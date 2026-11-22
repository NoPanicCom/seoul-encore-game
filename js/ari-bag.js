import { line } from './story.js';
const looks = [
    {
        id: 'fuchsia',
        asset: 'travel/lisa-set-backstage',
        garment: 'studio/lisa-set-backstage',
        name: line('Fuşya kargo', 'Карго цвета фуксии'),
        detail: line('Kargo pantolon ve bot', 'Карго и ботинки'),
        alt: line('Lisa fuşya ceket, siyah kargo pantolon ve bağcıklı botlarla', 'Лиса в куртке цвета фуксии, чёрных карго и ботинках со шнуровкой'),
    },
    {
        id: 'emerald',
        asset: 'travel/lisa-set-rehearsal',
        garment: 'studio/lisa-set-rehearsal',
        name: line('Zümrüt ve krem', 'Изумруд и кремовый'),
        detail: line('Spor takım ve sneaker', 'Спортивный костюм и кроссовки'),
        alt: line('Lisa zümrüt ve krem spor takımı ve sneaker’larıyla', 'Лиса в изумрудно-кремовом спортивном костюме и кроссовках'),
    },
    {
        id: 'gold',
        asset: 'travel/lisa-set-couture',
        garment: 'studio/lisa-set-couture',
        name: line('Altın sahne', 'Золотая сцена'),
        detail: line('Püsküllü korse ve çizme', 'Корсет с бахромой и сапоги'),
        alt: line('Lisa altın püsküllü korse ve platform çizmelerle', 'Лиса в золотом корсете с бахромой и сапогах на платформе'),
    },
];
const key = 'encore1.ari-bag.v1';
export function isAriEncoreCostume(value) {
    return looks.some(({ asset }) => asset === value);
}
function readBag() {
    try {
        const record = localStorage.getItem(key)?.split('|');
        if (record?.length !== 2)
            return null;
        const [id, phase] = record;
        const look = looks.find(item => item.id === id);
        if (look && (phase === 'preparing' || phase === 'packed' || phase === 'backstage' || phase === 'open' || phase === 'dressed' || phase === 'encore')) {
            return { look, phase };
        }
    }
    catch { /* Tarayıcı kaydı kullanılamadığında oyun bellekte sürer. */ }
    return null;
}
let current = readBag();
function saveBag(next) {
    current = next;
    try {
        if (next)
            localStorage.setItem(key, `${next.look.id}|${next.phase}`);
        else
            localStorage.removeItem(key);
    }
    catch { /* Tarayıcı kaydı kullanılamadığında oyun bellekte sürer. */ }
}
export function resetAri() { saveBag(null); }
export function ariPhase() { return current?.phase ?? null; }
export function ariAsset() { return current?.look.asset ?? null; }
export function startAriBackstage() {
    if (current?.phase === 'packed')
        saveBag({ ...current, phase: 'backstage' });
}
export function ariAction(id) {
    const look = looks.find(item => id === `ari-look-${item.id}`);
    if (look && (!current || current.phase === 'preparing')) {
        if (current?.look === look)
            return false;
        saveBag({ look, phase: 'preparing' });
        return true;
    }
    if (!current)
        return false;
    const { phase } = current;
    if (id === 'ari-pack' && phase === 'preparing')
        saveBag({ ...current, phase: 'packed' });
    else if (id === 'ari-open' && phase === 'backstage')
        saveBag({ ...current, phase: 'open' });
    else if (id === 'ari-dress' && phase === 'open')
        saveBag({ ...current, phase: 'dressed' });
    else if (id === 'ari-cue' && phase === 'dressed')
        saveBag({ ...current, phase: 'encore' });
    else
        return false;
    return true;
}
export function ariFigure(lang) {
    if (current?.phase !== 'dressed' && current?.phase !== 'encore')
        return '';
    const { asset, alt } = current.look;
    return `<span class="worn-look" data-costume="${asset}"><img src="art/${asset}.webp" alt="${alt[lang]}" draggable="false"></span>`;
}
const fittingTitle = line('Lisa’nın gizli bis kostümü', 'Секретный костюм Лисы');
const backstageTitle = line('Bis öncesi kulis', 'За кулисами перед бисом');
const choose = line('Lisa için bir bis kostümü seç ve kılıfa yerleştir.', 'Выбери костюм Лисы для выхода на бис и убери его в чехол.');
const packed = line('Fermuar kapalı, Lisa’nın etiketi takılı. Salon karardığında kılıfı kuliste aç.', 'Чехол застёгнут, бирка Лисы на месте. Открой чехол за кулисами, когда в зале погаснет свет.');
const unzip = line('Fermuarı sonuna kadar aşağı çek.', 'Потяни молнию вниз до конца.');
const dress = line('Kostüm kılıfta hazır. Lisa’yı bis için giydir.', 'Костюм в чехле. Помоги Лисе переодеться к выходу на бис.');
const cue = line('Lisa hazır. Tek spotun altına çıkması için işaret ver.', 'Лиса готова. Дай ей сигнал выйти под свет прожектора.');
const packLabel = line('Kılıfa koy ve fermuarı kapat', 'Убрать в чехол и застегнуть');
const exitLabel = line('Kılıfı al ve devam et', 'Взять чехол и продолжить');
const openLabel = line('Kılıfı aç', 'Открыть чехол');
const dressLabel = line('Lisa’ya kostümü giydir', 'Помочь Лисе переодеться');
const cueLabel = line('Lisa’ya sahne işareti ver', 'Дать Лисе сигнал к выходу');
const bagLabel = line('Lisa’nın fermuarlı kostüm kılıfı', 'Чехол Лисы на молнии');
const pullLabel = line('Fermuarı sonuna kadar aşağı çek veya kılıfı aç', 'Потянуть молнию вниз или открыть чехол');
const ariName = line('Ari', 'Ари');
const ariAlt = line('Kostüm asistanı Ari', 'Ассистент по костюмам Ари');
function garmentBag(lang, mode, look) {
    return `<div class="ari-bag" data-ari-bag="${mode}" ${mode === 'sealed' ? `role="img" aria-label="${bagLabel[lang]}"` : ''}>
    <span class="ari-bag-hook" aria-hidden="true"></span>
    <span class="ari-bag-loop" aria-hidden="true"></span>
    <div class="ari-bag-lining" aria-hidden="true"></div>
    ${mode === 'open' ? `<div class="ari-bag-garment"><img src="art/${look.garment}.webp" alt="${look.name[lang]}" draggable="false"></div>` : ''}
    <div class="ari-bag-rim" aria-hidden="true"></div>
    <div class="ari-bag-panel ari-bag-left" aria-hidden="true"><span class="ari-bag-tag">LISA</span></div>
    <div class="ari-bag-panel ari-bag-right" aria-hidden="true"></div>
    <span class="ari-zip-track" aria-hidden="true"></span>
    ${mode === 'unzip' ? `<button type="button" class="ari-zip-pull" data-ari-zip aria-label="${pullLabel[lang]}" aria-describedby="ari-backstage-help"><span aria-hidden="true"></span></button>` : '<span class="ari-zip-pull" aria-hidden="true"><span></span></span>'}
  </div>`;
}
function looksPicker(lang, selected) {
    return `<div class="ari-looks">${looks.map(look => `<button type="button" class="ari-look" data-act="ari-look-${look.id}" data-ari-tone="${look.id}" aria-pressed="${look === selected}">
    <span class="ari-look-photo"><img src="art/${look.asset}.webp" alt="" draggable="false"></span>
    <strong>${look.name[lang]}</strong><small>${look.detail[lang]}</small>
  </button>`).join('')}</div>`;
}
export function ariFitting(lang) {
    const look = current?.look;
    const packedLook = current && current.phase !== 'preparing' ? current.look : null;
    return `<section class="ari-room ari-fitting" data-ari-phase="${packedLook ? 'packed' : 'preparing'}" data-ari-look="${look?.id ?? ''}" aria-labelledby="ari-fitting-title">
    <h2 id="ari-fitting-title">${fittingTitle[lang]}</h2>
    <div class="ari-guide"><img src="art/ari.webp" alt="${ariAlt[lang]}" draggable="false">
      <div><strong>${ariName[lang]}</strong><p role="status">${(packedLook ? packed : choose)[lang]}</p></div>
    </div>
    ${packedLook ? `<div class="ari-workbench">${garmentBag(lang, 'sealed', packedLook)}</div>` : looksPicker(lang, look)}
    ${packedLook
        ? `<button type="button" class="primary ari-primary" data-act="ari-exit">${exitLabel[lang]} <span aria-hidden="true">→</span></button>`
        : `<button type="button" class="primary ari-primary" data-act="ari-pack" ${look ? '' : 'disabled'}>${packLabel[lang]}</button>`}
  </section>`;
}
export function ariBackstage(lang) {
    if (!current || current.phase === 'preparing' || current.phase === 'packed')
        return '';
    const { look, phase } = current;
    const wearing = phase === 'dressed' || phase === 'encore';
    const opened = phase === 'open';
    const message = wearing ? cue : opened ? dress : unzip;
    const action = wearing ? 'ari-cue' : opened ? 'ari-dress' : 'ari-open';
    const label = wearing ? cueLabel : opened ? dressLabel : openLabel;
    return `<section class="ari-room ari-backstage" data-ari-phase="${phase}" data-ari-look="${look.id}" aria-labelledby="ari-backstage-title">
    <h2 id="ari-backstage-title">${backstageTitle[lang]}</h2>
    <p id="ari-backstage-help" class="ari-backstage-help" role="status">${message[lang]}</p>
    <div class="ari-workbench">${wearing ? `<div class="ari-wearing">${ariFigure(lang)}</div>` : garmentBag(lang, opened ? 'open' : 'unzip', look)}</div>
    <button type="button" class="${opened || wearing ? 'primary' : 'secondary'} ari-primary" data-act="${action}">${label[lang]}${wearing ? ' <span aria-hidden="true">→</span>' : ''}</button>
  </section>`;
}
export function mountAriZip(root, draw) {
    const bag = root.querySelector('.ari-bag[data-ari-bag="unzip"]');
    const handle = bag?.querySelector('[data-ari-zip]');
    const rail = bag?.querySelector('.ari-zip-track');
    if (!bag || !handle || !rail)
        return () => { };
    const controller = new AbortController();
    const listener = { signal: controller.signal };
    let drag = null;
    let moved = false;
    const drawOpening = () => {
        if (!ariAction('ari-open'))
            return;
        draw();
        root.querySelector('[data-act="ari-dress"]')?.focus({ preventScroll: true });
    };
    const progress = (event, start) => Math.max(0, Math.min(1, (event.clientY - start.y) / start.length));
    const pastTap = (event, start) => Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6;
    const endDrag = () => {
        drag = null;
        bag.style.removeProperty('--ari-zip');
        delete bag.dataset.ariDragging;
    };
    handle.addEventListener('pointerdown', event => {
        if (!event.isPrimary || event.button !== 0)
            return;
        moved = false;
        drag = { pointer: event.pointerId, x: event.clientX, y: event.clientY, length: rail.getBoundingClientRect().height };
        handle.setPointerCapture(event.pointerId);
        bag.dataset.ariDragging = 'true';
    }, listener);
    handle.addEventListener('pointermove', event => {
        if (!drag || event.pointerId !== drag.pointer)
            return;
        moved || (moved = pastTap(event, drag));
        bag.style.setProperty('--ari-zip', String(progress(event, drag)));
    }, listener);
    handle.addEventListener('pointerup', event => {
        if (!drag || event.pointerId !== drag.pointer)
            return;
        moved || (moved = pastTap(event, drag));
        const completed = progress(event, drag) >= .82;
        endDrag();
        if (completed)
            drawOpening();
    }, listener);
    const cancelDrag = (event) => {
        if (drag?.pointer === event.pointerId)
            endDrag();
    };
    handle.addEventListener('pointercancel', cancelDrag, listener);
    handle.addEventListener('lostpointercapture', cancelDrag, listener);
    handle.addEventListener('click', event => {
        if (!moved || event.detail === 0)
            drawOpening();
    }, listener);
    return () => controller.abort();
}
