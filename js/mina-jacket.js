import { decodeStudioSelection, studioTravelSelection } from './studio.js';
import { dressedFigure, resolveLook } from './travel-look.js';
const key = 'encore1.mina-jacket.v1';
const coat = '<img class="pink-jacket" src="art/travel/crystal-jacket-2.webp" alt="">';
let current = null;
try {
    const [outfit, phase, bits, hung] = (localStorage.getItem(key) ?? '').split('|');
    if (outfit && decodeStudioSelection('jennie', outfit) && (phase === 'opening' || phase === 'change' || phase === 'final') && /^[0-3]$/.test(bits ?? '') && (hung === '0' || hung === '1')) {
        current = { outfit, phase, snaps: Number(bits), hung: hung === '1' };
    }
}
catch { /* The tour can still be played in memory. */ }
function persist() {
    try {
        if (current)
            localStorage.setItem(key, [current.outfit, current.phase, current.snaps, Number(current.hung)].join('|'));
        else
            localStorage.removeItem(key);
    }
    catch { /* Keep this session's outfit. */ }
}
export function resetJacket() { current = null; persist(); }
export function jacketPhase() { return current?.phase; }
export function fastenJacket() {
    const pick = studioTravelSelection('jennie');
    if (!pick)
        return false;
    const outfit = pick.kind === 'mix' ? ['mix', ...pick.pieces].join(',') : pick.kind === 'set' ? 'set,jennie,' + pick.id : 'look,' + pick.id;
    current = { outfit, phase: 'opening', snaps: 0, hung: false };
    persist();
    return true;
}
export function startChange() { if (current?.phase === 'opening') {
    current.phase = 'change';
    persist();
} }
export function releaseSnap(index) {
    if (current?.phase !== 'change' || current.hung)
        return;
    current.snaps |= 1 << index;
    persist();
}
export function hangJacket() {
    if (current?.phase !== 'change' || current.snaps !== 3)
        return false;
    current.hung = true;
    persist();
    return true;
}
export function sendJennieBack() {
    if (current?.phase !== 'change' || !current.hung)
        return false;
    current.phase = 'final';
    persist();
    return true;
}
export function showFigure() {
    if (!current)
        return '';
    const selected = decodeStudioSelection('jennie', current.outfit);
    return dressedFigure(resolveLook('jennie', selected), current.hung ? '' : coat);
}
export function changeRoom(lang) {
    if (!current)
        return '';
    const ru = lang === 'ru';
    const prompt = current.hung ? (ru ? 'Второй образ готов. Твой сигнал, Мина!' : 'İkinci kıyafeti hazır. İşaretini bekliyor, Mina!') :
        current.snaps === 3 ? (ru ? 'Перетащи жакет на вешалку или коснись вешалки.' : 'Ceketi askıya sürükle veya askıya dokun.') :
            current.snaps !== 0 ? (ru ? 'Осталась одна кнопка. Расстегни её.' : 'Bir çıtçıt kaldı. Ona da dokun.') :
                (ru ? 'Коснись двух жемчужных кнопок на жакете Дженни.' : 'Jennie’nin ceketindeki iki inci çıtçıta dokun.');
    const opened = current.snaps;
    const snaps = [0, 1].map(i => {
        const released = (opened & (1 << i)) !== 0;
        return `<button type="button" class="pearl-snap snap-${i}" data-act="snap-${i}" aria-label="${ru ? 'Расстегнуть кнопку' : 'Çıtçıtı aç'} ${i + 1}" ${released ? 'disabled' : ''}>${released ? '✓' : '✧'}</button>`;
    }).join('');
    return `<section class="quick-change" data-snaps="${current.snaps}" data-hung="${current.hung}">
    <h2>${ru ? 'За кулисами с Дженни' : 'Jennie ile kuliste'}</h2>
    <div class="change-floor"><div class="change-model">${showFigure()}${current.hung || current.snaps === 3 ? '' : snaps}</div>
    <button type="button" class="jacket-hanger" data-act="hang-jacket" ${current.snaps !== 3 || current.hung ? 'disabled' : ''}>
    <span class="rack-hook" aria-hidden="true"></span>${current.hung ? coat : ''}<span>${ru ? 'Вешалка' : 'Askı'}</span></button></div>
    <p role="status">${prompt}</p>
    ${current.hung ? `<button type="button" class="primary" data-act="jennie-return">${ru ? 'Дать сигнал на выход' : 'Sahneye çıkış işareti ver'} →</button>` : ''}</section>`;
}
// The same hanger is a single-tap and keyboard target as well as a drop target.
export function mountJacketDrag(room, onDrop) {
    const controller = new AbortController(), listener = { signal: controller.signal };
    const sleeve = room.querySelector('.change-model .pink-jacket');
    const hanger = room.querySelector('.jacket-hanger');
    if (sleeve && hanger && current?.snaps === 3 && !current.hung) {
        let start = null;
        sleeve.addEventListener('pointerdown', e => {
            if (!e.isPrimary || e.button !== 0)
                return;
            e.preventDefault();
            start = { id: e.pointerId, x: e.clientX, y: e.clientY };
            sleeve.setPointerCapture(e.pointerId);
        }, listener);
        sleeve.addEventListener('pointermove', e => {
            if (start?.id === e.pointerId)
                sleeve.style.transform = `translate(${e.clientX - start.x}px,${e.clientY - start.y}px)`;
        }, listener);
        sleeve.addEventListener('pointerup', e => {
            if (start?.id !== e.pointerId)
                return;
            start = null;
            sleeve.style.transform = '';
            const box = hanger.getBoundingClientRect();
            if (e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom)
                onDrop();
        }, listener);
        sleeve.addEventListener('lostpointercapture', () => { start = null; sleeve.style.transform = ''; }, listener);
    }
    return () => controller.abort();
}
