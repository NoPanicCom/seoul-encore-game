import { isShopStick, stickColor, stickId, stickName } from './lightstick.js';
const prefix = 'encore.v2.duet.';
const pixelPrefix = 'encore.v2.pixel-photo.';
const encorePhotoPrefix = 'encore.v2.lisa-encore.photo.';
const invitationKey = 'encore.v2.nari-invitation';
const validId = (id) => /^[a-z0-9]{8,48}$/.test(id);
const hex = (v) => typeof v === 'string' && /^#[a-f0-9]{6}$/i.test(v);
const outfit = (v) => v === 'rose' || v === 'midnight';
const validPhoto = (v) => typeof v === 'string' && v.length <= 480000 && /^data:image\/(?:webp|jpeg);base64,[A-Za-z0-9+/]+=*$/.test(v);
function newCardId() {
    return Date.now().toString(36) + Array.from(crypto.getRandomValues(new Uint8Array(12)), byte => byte.toString(16).padStart(2, '0')).join('');
}
export function readHongdaeStick() {
    try {
        const selected = localStorage.getItem('encore1.lightstick');
        return selected && isShopStick(selected) ? selected : null;
    }
    catch {
        return null;
    }
}
export function equipHongdaeStick(id) {
    if (!isShopStick(id))
        throw new Error('Invalid shop lightstick');
    const previous = readHongdaeStick();
    // Older saves may have only an equipped model, without its purchase marker.
    if (previous && previous !== id)
        localStorage.setItem('encore1.bought.' + previous, '1');
    localStorage.setItem('encore1.bought.' + id, '1');
    const color = stickColor(id);
    localStorage.setItem('encore.v2.color', color);
    localStorage.setItem('encore1.lightstick', id);
    return color;
}
function isPixelPhoto(value) {
    if (!value || typeof value !== 'object')
        return false;
    const card = value;
    return validPhoto(card.photo) && outfit(card.outfit) && typeof card.jacket === 'boolean' &&
        typeof card.stick === 'string' && isShopStick(card.stick) && hex(card.wandColor);
}
export function savePixelPhoto(input) {
    if (!isPixelPhoto(input))
        throw new Error('Invalid Hongdae photo');
    const { photo, outfit, jacket, stick, wandColor } = input;
    const id = newCardId();
    // The print and the look are one record; a full album must leave the preview available for retry.
    localStorage.setItem(pixelPrefix + id, JSON.stringify({ photo, outfit, jacket, stick, wandColor }));
    return id;
}
export function saveLisaEncorePhoto(input) {
    if (!isPixelPhoto(input) || input.wandColor !== stickColor(input.stick))
        throw new Error('Invalid Lisa encore photo');
    const id = newCardId();
    localStorage.setItem(encorePhotoPrefix + id, JSON.stringify(input));
    return id;
}
export function pixelAlbum(lang, kind = 'pixel') {
    const encore = kind === 'lisa';
    const prefix = encore ? encorePhotoPrefix : pixelPrefix;
    const ids = [];
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(prefix)) {
                const id = key.slice(prefix.length);
                if (validId(id))
                    ids.push(id);
            }
        }
    }
    catch {
        return '';
    }
    const tr = lang === 'tr';
    return ids.sort().reverse().map(id => {
        let card;
        try {
            card = JSON.parse(localStorage.getItem(prefix + id) ?? 'null');
        }
        catch {
            return '';
        }
        if (!isPixelPhoto(card))
            return '';
        const title = encore ? (tr ? 'Lisa’nın gizli bisi' : 'Секретный бис Лисы') : (tr ? 'Sofia ve Pixel' : 'София и Пиксель');
        const open = tr ? 'Fotoğrafı büyüt' : 'Увеличить фото';
        const close = tr ? 'Küçült' : 'Свернуть';
        return `<details class="pixel-print" data-${encore ? 'encore' : 'pixel'}-photo="${id}" data-stick="${card.stick}">
      <summary class="v2-photo" data-venue="hongdae" style="--v2-wand:${card.wandColor}">
        <img loading="lazy" src="${card.photo}" alt="${encore ? title : tr ? 'Hongdae fotokabininde Sofia ve Pixel' : 'София и Пиксель в фотобудке Хондэ'}">
        <span><small>HONGDAE · ${encore ? 'SECRET ENCORE' : 'PHOTO CLUB'}</small><strong>${title}</strong><em>${stickName(card.stick, lang)}</em>
        <b class="print-zoom"><i>${open} ＋</i><i>${close} −</i></b></span>
      </summary></details>`;
    }).join('');
}
function isDuet(value) {
    if (!value || typeof value !== 'object')
        return false;
    const card = value;
    return outfit(card.outfit) && hex(card.wandColor) && ['heart', 'step', 'spin'].some(move => move === card.finalMove)
        && (card.venue === undefined || card.venue === 'studio' || card.venue === 'arena')
        && (card.jacket === undefined || typeof card.jacket === 'boolean')
        && (card.photo === undefined || validPhoto(card.photo));
}
export function startingLook() {
    try {
        const storedOutfit = localStorage.getItem('encore.v2.outfit');
        const selected = stickId(localStorage.getItem('encore1.lightstick'));
        const previous = localStorage.getItem('encore.v2.color');
        return { jacket: localStorage.getItem('encore.v2.jacket') !== 'off', outfit: outfit(storedOutfit) ? storedOutfit : 'rose', wandColor: hex(previous) ? previous : selected ? stickColor(selected) : '#ff91ba' };
    }
    catch {
        return { outfit: 'rose', wandColor: '#ff91ba' };
    }
}
function danceChoices(input) {
    const choices = { outfit: input.outfit, wandColor: input.wandColor, finalMove: input.finalMove };
    if (input.jacket !== undefined)
        choices.jacket = input.jacket;
    return choices;
}
export function saveInvitation(input) {
    const invitation = danceChoices(input);
    if (!isDuet(invitation))
        throw new Error('Invalid invitation');
    try {
        localStorage.setItem(invitationKey, JSON.stringify(invitation));
        return true;
    }
    catch {
        return false;
    }
}
export function readInvitation() {
    try {
        const raw = localStorage.getItem(invitationKey);
        if (!raw)
            return null;
        const parsed = JSON.parse(raw);
        return isDuet(parsed) ? danceChoices(parsed) : null;
    }
    catch {
        return null;
    }
}
export function clearInvitation() {
    try {
        localStorage.removeItem(invitationKey);
    }
    catch { /* Storage can be disabled for this session. */ }
}
export function saveDuet(input) {
    const card = danceChoices(input);
    if (input.venue !== undefined)
        card.venue = input.venue;
    if (validPhoto(input.photo))
        card.photo = input.photo;
    if (!isDuet(card))
        throw new Error('Invalid duet');
    const id = newCardId();
    // One entry per performance keeps simultaneous tabs from overwriting another night's card.
    try {
        localStorage.setItem(prefix + id, JSON.stringify(card));
    }
    catch (error) {
        if (!(error instanceof DOMException) || error.name !== 'QuotaExceededError' || !card.photo)
            throw error;
        delete card.photo;
        localStorage.setItem(prefix + id, JSON.stringify(card));
    }
    try {
        localStorage.setItem('encore.v2.outfit', card.outfit);
        localStorage.setItem('encore.v2.color', card.wandColor);
        localStorage.setItem('encore.v2.jacket', card.jacket === false ? 'off' : 'on');
    }
    catch { /* The recording has already been saved. */ }
    return id;
}
export function readDuet(id) {
    if (!validId(id))
        return null;
    try {
        const raw = localStorage.getItem(prefix + id);
        if (!raw)
            return null;
        const card = JSON.parse(raw);
        return isDuet(card) ? card : null;
    }
    catch {
        return null;
    }
}
export function v2Album(lang) {
    const ids = [];
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(prefix))
                ids.push(key.slice(prefix.length));
        }
    }
    catch {
        return '';
    }
    return ids.sort().reverse().map(id => {
        const card = readDuet(id);
        if (!card)
            return '';
        const concert = card.venue === 'arena';
        const title = concert ? (lang === 'ru' ? 'Первая сцена с Нари' : 'Nari’yle ilk sahne') : (lang === 'ru' ? 'София и Нари · Студия YG' : 'Sofia ve Nari · YG Stüdyosu');
        const location = concert ? 'SEOUL LIVE' : 'YG STUDIO';
        const poster = concert ? 'art/lobby/v2-concert.jpg' : 'art/lobby/v2-duet.jpg';
        const finale = lang === 'ru' ? { heart: 'Сердце', spin: 'Поворот', step: 'Шаг' } : { heart: 'Kalp', spin: 'Dönüş', step: 'Adım' };
        return `<a class="v2-photo" data-venue="${concert ? 'arena' : 'studio'}" href="v2/#replay/${id}" style="--v2-wand:${card.wandColor}"><img loading="lazy" alt="" src="${card.photo ?? poster}"><span><small>${location} · 3D</small><strong>${title}</strong><em>${finale[card.finalMove]} · ${lang === 'ru' ? 'Смотреть танец' : 'Dansı izle'} ▷</em></span></a>`;
    }).join('');
}
