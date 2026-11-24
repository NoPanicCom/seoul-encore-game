import { pixelAlbum } from './v2-recordings.js';
import { hasHongdaeMelody } from './hongdae.js';
import { studioMemberId } from './studio.js';
import { drawTravelLook, loadTravelLook, travelLook } from './travel-look.js';
const say = (lang, labels) => labels[lang === 'tr' ? 0 : 1];
const members = ['jisoo', 'jennie', 'rose', 'lisa'];
const names = { jisoo: 'Jisoo', jennie: 'Jennie', rose: 'Rosé', lisa: 'Lisa' };
const frames = ['spark', 'holo', 'classic', 'vinyl'];
const styles = ['neon', 'mono', 'warm'];
const poses = ['duo', 'lean', 'close'];
const copy = {
    title: ['Fotoğraf kabini', 'Фотобудка'],
    frame: ['Çerçeve', 'Рамка'],
    style: ['Filtre', 'Фильтр'],
    pose: ['Poz', 'Поза'],
    spark: ['Pembe yıldız', 'Розовая звезда'],
    holo: ['Hologram', 'Голограмма'],
    classic: ['Klasik', 'Классика'],
    vinyl: ['Plak', 'Винил'],
    neon: ['Neon', 'Неон'],
    mono: ['Siyah beyaz', 'Чёрно-белый'],
    warm: ['Sıcak', 'Тёплый'],
    duo: ['Yan yana', 'Рядом'],
    lean: ['Baş başa', 'Голова к голове'],
    close: ['Pati selamı', 'Привет лапкой'],
    shutter: ['Fotoğraf çek', 'Сделать фото'],
    street: ['Hongdae’ye dön', 'Вернуться в Хондэ'],
    album: ['Fotoğraflarımı aç', 'Открыть мои фото'],
    albumTitle: ['Hongdae fotoğrafları', 'Фото из Хондэ'],
    albumEmpty: ['Fotoğraf kabinindeki çekimlerin burada birikecek.', 'Здесь появятся снимки из фотобудки.'],
    load: ['Kabin hazırlanıyor…', 'Фотобудка готовится…'],
    loadError: ['Kadraj yüklenemedi. Yeniden deneyebilirsin.', 'Кадр не загрузился. Можно попробовать снова.'],
    retryLoad: ['Kadrajı yeniden yükle', 'Загрузить кадр снова'],
    takeError: ['Fotoğraf basılamadı. Yeniden çekebilirsin.', 'Снимок не напечатался. Можно снять снова.'],
    taken: ['Fotoğraf albüme eklendi!', 'Снимок добавлен в альбом!'],
    aborted: ['Çekim durdu. Hazır olunca yeniden dene.', 'Съёмка остановилась. Попробуй снова, когда будешь готова.'],
    saveError: ['Fotoğraf hazır. Albüme yazılamadı, kaydı yeniden dene.', 'Снимок готов. Не удалось добавить его в альбом. Попробуй снова.'],
    retrySave: ['Albüme yeniden kaydet', 'Снова сохранить в альбом'],
    download: ['Fotoğrafı indir', 'Скачать фото'],
    albumIssue: ['Bazı fotoğraflar tarayıcıdan okunamadı.', 'Некоторые снимки не удалось прочитать из хранилища.'],
    waitingForMember: ['Çekim için bir üye seç.', 'Выбери участницу для снимка.'],
};
const defaultOptions = { frame: 'spark', style: 'neon', pose: 'duo' };
const photoPrefix = 'encore1.booth.photo.';
const jpeg = /^data:image\/jpeg;base64,\/9j\/[A-Za-z0-9+/]*={0,2}$/;
const photoId = /^[0-9a-z]+-[0-9a-f]{16}$/;
const safeAsset = /^[a-z0-9][a-z0-9/-]*$/;
const width = 520;
const height = 536;
const imageBox = { x: 12, y: 12, width: 496, height: 459 };
const sessions = new Map();
function getSession(member) {
    const previous = sessions.get(member);
    if (previous)
        return previous;
    const session = { options: { ...defaultOptions }, print: null, unsaved: false };
    sessions.set(member, session);
    return session;
}
function includes(options, value) {
    return options.some(option => option === value);
}
function isAsset(value) {
    return value.length <= 128 && safeAsset.test(value);
}
function isCard(card) {
    return !!card && typeof card.id === 'string' && photoId.test(card.id)
        && typeof card.created === 'number' && Number.isSafeInteger(card.created)
        && card.created > 0 && card.created <= 8.64e15
        && includes(members, card.member ?? '') && includes(frames, card.frame ?? '')
        && includes(styles, card.style ?? '') && includes(poses, card.pose ?? '')
        && typeof card.outfit === 'string' && isAsset(card.outfit)
        && Array.isArray(card.pieces) && card.pieces.length <= 12
        && card.pieces.every(piece => typeof piece === 'string' && isAsset(piece))
        && typeof card.image === 'string' && jpeg.test(card.image);
}
/** Each print has its own key so one tab cannot erase another's album when saving. */
export function saveBoothCard(storage, card) {
    if (!isCard(card))
        throw new Error('Invalid photo booth card');
    storage.setItem(photoPrefix + card.id, JSON.stringify(card));
}
export function readBoothCards(storage) {
    const result = { cards: [], issue: false };
    for (let index = 0; index < storage.length; index++) {
        const key = storage.key(index);
        if (!key?.startsWith(photoPrefix))
            continue;
        try {
            const card = JSON.parse(storage.getItem(key) ?? 'null');
            if (isCard(card) && key === photoPrefix + card.id)
                result.cards.push(card);
            else
                result.issue = true;
        }
        catch {
            result.issue = true;
        }
    }
    result.cards.sort((a, b) => b.created - a.created || b.id.localeCompare(a.id));
    return result;
}
function newCard(member, look, options, image) {
    const created = Date.now();
    const entropy = Array.from(crypto.getRandomValues(new Uint8Array(8)), byte => byte.toString(16).padStart(2, '0')).join('');
    return { id: `${created.toString(36)}-${entropy}`, member, created, outfit: look.asset, pieces: [...look.pieces], ...options, image };
}
const palettes = {
    neon: { sky: '#42254e', wall: '#201632', floor: '#170f25', light: '#b282d0', grid: '#836ea3', tag: '#ff599c', accent: '#52dacf' },
    mono: { sky: '#403f4b', wall: '#262631', floor: '#14141b', light: '#a0a0a8', grid: '#70707c', tag: '#dddddf', accent: '#aaaab5' },
    warm: { sky: '#694049', wall: '#3d2329', floor: '#28151d', light: '#e6a27b', grid: '#ec9d76', tag: '#ff9774', accent: '#ffd990' },
};
const arrangements = {
    duo: { memberX: 224, memberY: 440, memberHeight: 350, turn: 0, facing: 1, pixelX: 350, pixelY: 438, pixelSize: 128, pixelFrame: 0 },
    lean: { memberX: 200, memberY: 441, memberHeight: 350, turn: .13, facing: -1, pixelX: 313, pixelY: 434, pixelSize: 128, pixelFrame: 1 },
    close: { memberX: 235, memberY: 449, memberHeight: 378, turn: -.09, facing: 1, pixelX: 370, pixelY: 438, pixelSize: 148, pixelFrame: 3 },
};
function star(context, x, y, size) {
    context.beginPath();
    context.moveTo(x, y - size);
    context.lineTo(x + size * .22, y - size * .22);
    context.lineTo(x + size, y);
    context.lineTo(x + size * .22, y + size * .22);
    context.lineTo(x, y + size);
    context.lineTo(x - size * .22, y + size * .22);
    context.lineTo(x - size, y);
    context.lineTo(x - size * .22, y - size * .22);
    context.closePath();
    context.fill();
}
function mural(context, style) {
    const tone = palettes[style];
    const wall = context.createLinearGradient(0, 20, 0, 390);
    wall.addColorStop(0, tone.sky);
    wall.addColorStop(1, tone.wall);
    context.fillStyle = wall;
    context.fillRect(0, 0, width, height);
    const wash = context.createRadialGradient(258, 208, 10, 258, 208, 245);
    wash.addColorStop(0, `${tone.light}cd`);
    wash.addColorStop(1, `${tone.light}00`);
    context.fillStyle = wash;
    context.fillRect(0, 0, width, 398);
    context.beginPath();
    for (let row = 0; row < 13; row++) {
        const y = row * 30 + 16;
        context.moveTo(0, y);
        context.lineTo(width, y);
        for (let x = row % 2 ? 29 : 0; x < width; x += 72) {
            context.moveTo(x, y);
            context.lineTo(x, y + 30);
        }
    }
    context.strokeStyle = `${tone.grid}26`;
    context.stroke();
    context.save();
    context.translate(258, 89);
    context.rotate(-.077);
    context.textAlign = 'center';
    context.font = '900 italic 64px system-ui, sans-serif';
    context.lineWidth = 8;
    context.lineJoin = 'round';
    context.strokeStyle = `${tone.wall}df`;
    context.strokeText('HONGDAE', 0, 0);
    context.fillStyle = tone.tag;
    context.fillText('HONGDAE', 0, 0);
    context.restore();
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = `${tone.accent}a3`;
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(33, 183);
    context.bezierCurveTo(9, 216, 86, 235, 113, 174);
    context.bezierCurveTo(120, 139, 65, 167, 73, 205);
    context.bezierCurveTo(82, 240, 113, 206, 137, 198);
    context.moveTo(418, 232);
    context.lineTo(439, 192);
    context.lineTo(450, 216);
    context.lineTo(477, 202);
    context.lineTo(462, 240);
    context.closePath();
    context.stroke();
    context.fillStyle = tone.tag;
    star(context, 76, 119, 15);
    star(context, 448, 132, 19);
    star(context, 469, 156, 7);
    star(context, 122, 127, 6);
    context.fillStyle = tone.accent;
    star(context, 49, 268, 24);
    star(context, 455, 293, 12);
    star(context, 446, 271, 7);
    context.fillStyle = tone.floor;
    context.fillRect(0, 388, width, height - 388);
    context.fillStyle = `${tone.accent}97`;
    context.fillRect(0, 387, width, 2);
    const floor = context.createLinearGradient(0, 387, 0, 471);
    floor.addColorStop(0, `${tone.tag}4c`);
    floor.addColorStop(1, `${tone.wall}00`);
    context.fillStyle = floor;
    context.fillRect(0, 388, width, 83);
}
function paper(context, member, frame) {
    const tint = context.createLinearGradient(0, 0, width, height);
    if (frame === 'spark') {
        tint.addColorStop(0, '#ff87b7');
        tint.addColorStop(.55, '#ffb2dc');
        tint.addColorStop(1, '#f969a0');
    }
    else if (frame === 'holo') {
        tint.addColorStop(0, '#fff3a1');
        tint.addColorStop(.38, '#dcb1ff');
        tint.addColorStop(.71, '#a9f2f9');
        tint.addColorStop(1, '#caffb7');
    }
    else if (frame === 'vinyl') {
        tint.addColorStop(0, '#fceabe');
        tint.addColorStop(1, '#ffad5f');
    }
    else {
        tint.addColorStop(0, '#fff6e8');
        tint.addColorStop(1, '#e8d9c5');
    }
    context.fillStyle = tint;
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#231429';
    context.font = '800 23px system-ui, sans-serif';
    context.textBaseline = 'alphabetic';
    context.textAlign = 'left';
    context.fillText(`${names[member]} + Pixel`, 23, 510);
    context.textAlign = 'right';
    context.font = '700 13px monospace';
    context.fillText('SEOUL ENCORE', width - 25, 508);
    if (frame === 'vinyl') {
        context.beginPath();
        context.arc(width - 152, 503, 15, 0, 2 * Math.PI);
        context.fill();
        context.beginPath();
        context.arc(width - 152, 503, 11, .38, 2.95);
        context.arc(width - 152, 503, 11, 3.58, 6.04);
        context.strokeStyle = '#ffd29d';
        context.lineWidth = 1;
        context.stroke();
        context.fillStyle = '#ff967d';
        context.beginPath();
        context.arc(width - 152, 503, 4.5, 0, 2 * Math.PI);
        context.fill();
    }
    else if (frame !== 'classic') {
        star(context, width - 147, 503, 8);
        star(context, width - 160, 492, 4);
    }
}
function drawPhoto(canvas, member, actor, pixel, options) {
    const context = canvas.getContext('2d', { alpha: false });
    if (!context)
        throw new Error('Photo booth requires canvas');
    const layout = arrangements[options.pose];
    paper(context, member, options.frame);
    context.save();
    context.beginPath();
    context.rect(imageBox.x, imageBox.y, imageBox.width, imageBox.height);
    context.clip();
    mural(context, options.style);
    context.fillStyle = '#12091699';
    context.beginPath();
    context.ellipse(layout.memberX, layout.memberY + 2, 60, 13, 0, 0, 2 * Math.PI);
    context.ellipse(layout.pixelX, layout.pixelY + 1, 40, 9, 0, 0, 2 * Math.PI);
    context.fill();
    context.save();
    context.translate(layout.memberX, layout.memberY);
    context.rotate(layout.turn);
    drawTravelLook(context, actor, 0, 0, layout.memberHeight, layout.facing === -1 ? -1 : 1);
    context.restore();
    context.imageSmoothingEnabled = false;
    context.drawImage(pixel, layout.pixelFrame * 96, 0, 96, 96, layout.pixelX - layout.pixelSize / 2, layout.pixelY - layout.pixelSize * 88 / 96, layout.pixelSize, layout.pixelSize);
    context.imageSmoothingEnabled = true;
    if (options.style !== 'neon') {
        context.globalCompositeOperation = 'color';
        context.fillStyle = options.style === 'mono' ? '#808080' : '#d5775b66';
        context.fillRect(imageBox.x, imageBox.y, imageBox.width, imageBox.height);
    }
    context.restore();
}
function loadPixel() {
    return new Promise((resolve, reject) => {
        const pixel = new Image();
        pixel.onload = () => pixel.naturalWidth === 384 && pixel.naturalHeight === 96
            ? resolve(pixel) : reject(new Error('Pixel atlas has incorrect dimensions'));
        pixel.onerror = () => reject(new Error('Pixel atlas could not load'));
        pixel.src = 'art/world/pixel.webp';
    });
}
function selector(lang, name, values, chosen) {
    return `<div class="booth-options" role="group" aria-label="${say(lang, copy[name])}">
    <span aria-hidden="true">${say(lang, copy[name])}</span>
    <div>${values.map(value => `<button type="button" data-booth-${name}="${value}" aria-pressed="${value === chosen}" disabled>${say(lang, copy[value])}</button>`).join('')}</div>
  </div>`;
}
export function renderBooth(lang, memberName) {
    const member = studioMemberId(memberName);
    if (!member)
        return `<p role="status">${say(lang, copy.waitingForMember)}</p>`;
    const { options } = getSession(member);
    const unlockedFrames = hasHongdaeMelody(member) ? frames : frames.filter(frame => frame !== 'vinyl');
    return `<section class="booth" data-booth data-booth-member="${member}" lang="${lang}" aria-labelledby="booth-title">
    <div class="booth-head"><div><p lang="en">HONGDAE PHOTO LAB</p><h2 id="booth-title">${say(lang, copy.title)}</h2></div><span>${names[member]} + Pixel</span></div>
    <div class="booth-deck">
      <div class="booth-camera" data-booth-camera>
        <canvas width="${width}" height="${height}" data-booth-preview role="img" aria-label="${names[member]} + Pixel"></canvas>
        <div class="booth-camera-lamp" aria-hidden="true"></div>
        <div data-booth-countdown class="booth-countdown" role="status" aria-atomic="true" hidden></div>
      </div>
      <div class="booth-console">
        <button type="button" class="booth-shutter" data-booth-shutter disabled><i aria-hidden="true"></i>${say(lang, copy.shutter)}</button>
        <p class="booth-status" data-booth-status role="status">${say(lang, copy.load)}</p>
        <button type="button" class="booth-retry" data-booth-retry-load hidden>${say(lang, copy.retryLoad)}</button>
        <div class="booth-print" data-booth-print hidden></div>
        ${selector(lang, 'frame', unlockedFrames, unlockedFrames.includes(options.frame) ? options.frame : defaultOptions.frame)}
        ${selector(lang, 'style', styles, options.style)}
        ${selector(lang, 'pose', poses, options.pose)}
      </div>
    </div>
    <div class="booth-nav">
      <button type="button" data-booth-action="street"><span aria-hidden="true">←</span> ${say(lang, copy.street)}</button>
    </div>
  </section>`;
}
function printImage(card) {
    return `<img width="${width}" height="${height}" src="${card.image}" alt="${names[card.member]} + Pixel" decoding="async">`;
}
function loadAlbum() {
    try {
        return readBoothCards(localStorage);
    }
    catch {
        return { cards: [], issue: true };
    }
}
export function boothPhotoCount() {
    return loadAlbum().cards.length;
}
export function boothAlbum(lang) {
    const result = loadAlbum();
    const date = new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'ru-RU', { dateStyle: 'medium' });
    const pixelPrints = pixelAlbum(lang, 'lisa') + pixelAlbum(lang);
    const photos = result.cards.map(card => `<li><figure data-booth-card="${card.id}" data-booth-outfit="${card.outfit}" data-booth-pieces="${card.pieces.join(',')}">
    ${printImage(card)}<figcaption><strong>${names[card.member]} + Pixel</strong><time datetime="${new Date(card.created).toISOString()}">${date.format(card.created)}</time></figcaption>
  </figure></li>`);
    return `<section class="booth-album" lang="${lang}"><h3>${say(lang, copy.albumTitle)}</h3>
    ${pixelPrints}
    ${photos.length ? `<ul>${photos.join('')}</ul>` : pixelPrints ? '' : `<p>${say(lang, copy.albumEmpty)}</p>`}
    ${result.issue ? `<p role="status">${say(lang, copy.albumIssue)}</p>` : ''}
  </section>`;
}
export function mountBooth(lang, memberName, onAction) {
    const member = studioMemberId(memberName);
    const booth = document.querySelector('[data-booth]');
    const canvas = booth?.querySelector('[data-booth-preview]');
    const camera = booth?.querySelector('[data-booth-camera]');
    const shutter = booth?.querySelector('[data-booth-shutter]');
    const countdown = booth?.querySelector('[data-booth-countdown]');
    const status = booth?.querySelector('[data-booth-status]');
    const retryLoad = booth?.querySelector('[data-booth-retry-load]');
    const print = booth?.querySelector('[data-booth-print]');
    if (!member || !booth || !canvas || !camera || !shutter || !countdown || !status || !retryLoad || !print)
        return () => { };
    const session = getSession(member);
    if (session.options.frame === 'vinyl' && !hasHongdaeMelody(member))
        session.options.frame = defaultOptions.frame;
    const lifecycle = new AbortController();
    const { signal } = lifecycle;
    const controls = Array.from(booth.querySelectorAll('button[data-booth-frame],button[data-booth-style],button[data-booth-pose]'));
    let prepared = null;
    let counter = 0;
    let timer;
    let flashTimer;
    const sayStatus = (label) => { status.textContent = say(lang, label); };
    const refreshButtons = () => {
        for (const control of controls) {
            control.disabled = !prepared || counter > 0;
            const selected = control.dataset.boothFrame === session.options.frame
                || control.dataset.boothStyle === session.options.style || control.dataset.boothPose === session.options.pose;
            control.setAttribute('aria-pressed', String(selected));
        }
        shutter.disabled = !prepared || counter > 0 || session.unsaved;
    };
    const showPrint = () => {
        if (!session.print)
            return;
        const card = session.print;
        print.hidden = false;
        print.dataset.boothOutfit = card.outfit;
        print.dataset.boothPieces = card.pieces.join(',');
        print.innerHTML = `${printImage(card)}<div class="booth-print-actions">
      ${session.unsaved ? `<button type="button" data-booth-retry-save>${say(lang, copy.retrySave)}</button>` :
            `<button type="button" data-booth-action="album">${say(lang, copy.album)} <span aria-hidden="true">↗</span></button>`}
      <a href="${card.image}" download="hongdae-${card.id}.jpg">${say(lang, copy.download)}</a>
    </div>`;
    };
    const persist = () => {
        const card = session.print;
        if (!card)
            return;
        try {
            saveBoothCard(localStorage, card);
            session.unsaved = false;
            sayStatus(copy.taken);
        }
        catch {
            session.unsaved = true;
            sayStatus(copy.saveError);
        }
        showPrint();
        refreshButtons();
        if (!session.unsaved)
            window.dispatchEvent(new Event('encore:photo-saved'));
    };
    const renderPreview = () => {
        if (!prepared)
            return;
        drawPhoto(canvas, member, prepared.memberImage, prepared.pixel, session.options);
        canvas.dataset.boothOutfit = prepared.look.asset;
        canvas.dataset.boothPieces = prepared.look.pieces.join(',');
        canvas.dataset.boothFrame = session.options.frame;
        canvas.dataset.boothStyle = session.options.style;
        canvas.dataset.boothPose = session.options.pose;
    };
    const prepare = async () => {
        if (session.unsaved)
            sayStatus(copy.saveError);
        else
            sayStatus(copy.load);
        retryLoad.hidden = true;
        try {
            const look = travelLook(member);
            if (!look)
                throw new Error('Selected member has no travel look');
            const [memberImage, pixel] = await Promise.all([loadTravelLook(look), loadPixel()]);
            if (signal.aborted)
                return;
            prepared = { look, memberImage, pixel };
            renderPreview();
            camera.classList.add('is-ready');
            if (!session.unsaved)
                status.textContent = '';
        }
        catch {
            if (signal.aborted)
                return;
            prepared = null;
            retryLoad.hidden = false;
            sayStatus(copy.loadError);
        }
        refreshButtons();
    };
    const stopCountdown = () => {
        window.clearTimeout(timer);
        timer = undefined;
        counter = 0;
        countdown.hidden = true;
        countdown.textContent = '';
    };
    const takePhoto = () => {
        if (!prepared)
            return;
        try {
            const image = canvas.toDataURL('image/jpeg', .87);
            if (!jpeg.test(image))
                throw new Error('Photo could not be encoded');
            session.print = newCard(member, prepared.look, session.options, image);
            window.clearTimeout(flashTimer);
            camera.classList.add('is-flashing');
            flashTimer = window.setTimeout(() => {
                camera.classList.remove('is-flashing');
                print.scrollIntoView({ block: 'nearest' });
            }, 260);
            persist();
        }
        catch {
            sayStatus(copy.takeError);
            refreshButtons();
        }
    };
    const tick = () => {
        if (signal.aborted)
            return;
        if (counter < 1) {
            stopCountdown();
            takePhoto();
            return;
        }
        countdown.hidden = false;
        countdown.textContent = String(counter);
        counter -= 1;
        timer = window.setTimeout(tick, 1000);
    };
    booth.addEventListener('click', event => {
        const button = event.target instanceof Element ? event.target.closest('button') : null;
        if (!button || button.disabled)
            return;
        const action = button.dataset.boothAction;
        if (action === 'street' || action === 'album') {
            onAction(action);
            return;
        }
        if (button.hasAttribute('data-booth-retry-load')) {
            void prepare();
            return;
        }
        if (button.hasAttribute('data-booth-retry-save')) {
            persist();
            return;
        }
        if (!prepared || timer !== undefined)
            return;
        if (button === shutter) {
            counter = 3;
            status.textContent = '';
            refreshButtons();
            camera.scrollIntoView({ block: 'nearest' });
            tick();
            return;
        }
        const { boothFrame = '', boothStyle = '', boothPose = '' } = button.dataset;
        if (includes(frames, boothFrame))
            session.options.frame = boothFrame;
        else if (includes(styles, boothStyle))
            session.options.style = boothStyle;
        else if (includes(poses, boothPose))
            session.options.pose = boothPose;
        else
            return;
        renderPreview();
        refreshButtons();
    }, { signal });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && timer !== undefined) {
            stopCountdown();
            refreshButtons();
            sayStatus(copy.aborted);
        }
    }, { signal });
    showPrint();
    void prepare();
    return () => {
        lifecycle.abort();
        stopCountdown();
        window.clearTimeout(flashTimer);
    };
}
