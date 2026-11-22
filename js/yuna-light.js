import { line } from './story.js';
const spots = [
    { id: 'pearl', label: line('İnci', 'Жемчужный'), focus: line('Yumuşak ışık', 'Мягкий свет') },
    { id: 'cyan', label: line('Buz mavisi', 'Ледяной'), focus: line('Dar spot', 'Узкий луч') },
    { id: 'rose', label: line('Gül pembesi', 'Розовый'), focus: line('Geniş spot', 'Широкий луч') },
];
const aims = [
    { id: 'left', label: line('Soldan', 'Слева'), symbol: '↘' },
    { id: 'center', label: line('Üstten', 'Сверху'), symbol: '↓' },
    { id: 'right', label: line('Sağdan', 'Справа'), symbol: '↙' },
];
const storageKey = 'encore1.yuna-light.v1';
const looks = {
    casual: { asset: 'travel/rose-set-rehearsal', alt: line('Rosé, mor prova kıyafeti ve siyah çizmelerle', 'Розэ в сиреневом костюме и чёрных сапогах') },
    outfit: { asset: 'yuna/rose-stars', alt: line('Rosé, gümüş yıldızlı kıyafet ve siyah prova ayakkabılarıyla', 'Розэ в костюме с серебряными звёздами и в чёрных балетках') },
    complete: { asset: 'travel/rose-set-original', alt: line('Rosé, gümüş yıldızlı sahne kıyafeti ve parlak gümüş çizmelerle', 'Розэ в сценическом костюме с серебряными звёздами и блестящих серебряных сапогах') },
};
const initial = { look: 'casual', spot: 'pearl', aim: 'center', confirmed: null };
const allCues = new Set(spots.flatMap(({ id: spot }) => aims.map(({ id: aim }) => `${spot}-${aim}`)));
export function isYunaCue(value) {
    return typeof value === 'string' && allCues.has(value);
}
function readYuna() {
    try {
        const [look, spotId, aimId, confirmed] = (localStorage.getItem(storageKey) ?? '').split('|');
        const spot = spots.find(({ id }) => id === spotId);
        const aim = aims.find(({ id }) => id === aimId);
        if ((look === 'casual' || look === 'outfit' || look === 'complete') && spot && aim) {
            return { look, spot: spot.id, aim: aim.id, confirmed: look === 'complete' && isYunaCue(confirmed) ? confirmed : null };
        }
    }
    catch { /* Oyun tarayıcı kaydı kullanılamadığında bellekte sürer. */ }
    return { ...initial };
}
let state = readYuna();
function persistYuna() {
    try {
        localStorage.setItem(storageKey, [state.look, state.spot, state.aim, state.confirmed].join('|'));
    }
    catch { /* Oyuncu mevcut oturuma devam edebilir. */ }
}
export function resetYuna() {
    state = { ...initial };
    try {
        localStorage.removeItem(storageKey);
    }
    catch { /* Oturum sıfırlandı. */ }
}
export function yunaDressed() { return state.look === 'complete'; }
export function yunaCue() { return state.confirmed; }
export function yunaAction(action) {
    if (action === 'yuna-outfit' && state.look === 'casual') {
        state.look = 'outfit';
    }
    else if (action === 'yuna-boots' && state.look === 'outfit') {
        state.look = 'complete';
    }
    else if (yunaDressed()) {
        const spot = spots.find(({ id }) => action === 'yuna-spot-' + id);
        const aim = aims.find(({ id }) => action === 'yuna-aim-' + id);
        const cue = `${state.spot}-${state.aim}`;
        if (spot && state.spot !== spot.id)
            state.spot = spot.id;
        else if (aim && state.aim !== aim.id)
            state.aim = aim.id;
        else if (action === 'yuna-confirm' && state.confirmed !== cue)
            state.confirmed = cue;
        else
            return false;
    }
    else
        return false;
    persistYuna();
    return true;
}
function figure(look, lang) {
    const { asset, alt } = looks[look];
    return `<span class="yuna-figure worn-look" data-costume="${asset}"><img src="art/${asset}.webp" alt="${alt[lang]}" draggable="false"></span>`;
}
export function yunaFigure(lang) {
    return yunaDressed() ? figure('complete', lang) : '';
}
const fittingStatus = {
    casual: line('Yuna, Rosé’ye önce gümüş yıldızlı kıyafeti giydir.', 'Юна, сначала помоги Розэ надеть костюм с серебряными звёздами.'),
    outfit: line('Yıldızlı kıyafet üzerinde. Şimdi parlak gümüş çizmeleri giydir.', 'Костюм уже на Розэ. Теперь помоги ей надеть блестящие серебряные сапоги.'),
    complete: line('Kıyafet ve çizmeler hazır. Işıkçı prova salonunda bekliyor.', 'Костюм и сапоги готовы. Осветитель ждёт в репетиционном зале.'),
};
const outfitLabel = line('Yıldızlı kıyafeti giydir', 'Надеть костюм со звёздами');
const bootsLabel = line('Gümüş çizmeleri giydir', 'Надеть серебряные сапоги');
const fittedOutfit = line('Yıldızlı kıyafet hazır', 'Костюм со звёздами готов');
const fittedBoots = line('Gümüş çizmeler hazır', 'Серебряные сапоги готовы');
export function yunaFitting(lang) {
    const { look } = state;
    const dressed = yunaDressed();
    return `<section class="yuna-fitting yuna-room" data-yuna-look="${look}" aria-labelledby="yuna-fitting-title">
    <h2 id="yuna-fitting-title">${line('Rosé ile kostüm provası', 'Примерка костюма с Розэ')[lang]}</h2>
    <div class="yuna-fit-world">
      <div class="yuna-model">${figure(look, lang)}</div>
      <figure class="yuna-assistant">
        <span class="yuna-cast" aria-hidden="true"></span><figcaption>${line('Yuna', 'Юна')[lang]}</figcaption>
      </figure>
    </div>
    <p class="yuna-status" role="status">${fittingStatus[look][lang]}</p>
    <div class="yuna-dress-actions">
      <button type="button" data-act="yuna-outfit"${look === 'casual' ? '' : ' disabled'}>
        <span aria-hidden="true">${look === 'casual' ? '✦' : '✓'}</span>${(look === 'casual' ? outfitLabel : fittedOutfit)[lang]}
      </button>
      <button type="button" data-act="yuna-boots"${look === 'outfit' ? '' : ' disabled'}>
        <img src="art/boots.webp" alt="">${(dressed ? fittedBoots : bootsLabel)[lang]}
      </button>
    </div>
    <button type="button" class="primary yuna-primary" data-act="yuna-rehearse"${dressed ? '' : ' disabled'}>
      ${line('Işıkçıyla provaya git', 'Пойти на световую репетицию')[lang]} <span aria-hidden="true">→</span>
    </button>
  </section>`;
}
const savedMessage = line('Işıkçı: Ayarı kaydettim. Rosé sahneye bu ışıkla çıkacak.', 'Осветитель: Я сохранил настройки. Розэ выйдет на сцену с этим светом.');
const introMessage = line('Işıkçı: Rengi ve ışığın yönünü seç. Beğendiğin ayarı konsere gönder.', 'Осветитель: Выбери цвет и направление луча. Сохрани вариант, который тебе нравится.');
const spotNotes = {
    pearl: line('İnci ışığı kıyafetin iki yanını da aydınlatıyor.', 'Мягкий свет освещает костюм с обеих сторон.'),
    cyan: line('Dar mavi spot gümüş çizmelerin çizgilerini belirginleştiriyor.', 'Узкий голубой луч подчёркивает контуры серебряных сапог.'),
    rose: line('Geniş pembe ışık sahne eteğini ve yıldızları öne çıkarıyor.', 'Широкий розовый свет выделяет юбку и звёзды.'),
};
export function yunaRehearsal(lang) {
    if (!yunaDressed())
        return yunaFitting(lang);
    const { spot, aim, confirmed } = state;
    const saved = confirmed === `${spot}-${aim}`;
    const spotButtons = spots.map(({ id, label, focus }) => `<button type="button" data-act="yuna-spot-${id}" data-yuna-swatch="${id}" aria-pressed="${id === spot}">
    <span class="yuna-swatch" aria-hidden="true"></span><strong>${label[lang]}</strong><small>${focus[lang]}</small></button>`).join('');
    const aimButtons = aims.map(({ id, label, symbol }) => `<button type="button" data-act="yuna-aim-${id}" aria-pressed="${id === aim}">
    <span aria-hidden="true">${symbol}</span>${label[lang]}</button>`).join('');
    return `<section class="yuna-rehearsal yuna-room" data-yuna-cue="${spot}" data-yuna-aim="${aim}" aria-labelledby="yuna-light-title">
    <h2 id="yuna-light-title">${line('Rosé ile ışık provası', 'Световая репетиция с Розэ')[lang]}</h2>
    <div class="yuna-preview">
      <div class="yuna-spotlight"><span class="yuna-beam" aria-hidden="true"></span><span class="yuna-pool" aria-hidden="true"></span>${yunaFigure(lang)}</div>
      <figure class="yuna-operator">
        <span class="yuna-cast" aria-hidden="true"></span><figcaption>${line('Işıkçı', 'Осветитель')[lang]}</figcaption>
      </figure>
    </div>
    <p class="yuna-gesture-tip"><span aria-hidden="true">↔</span> ${line('Spotu yana kaydır.', 'Передвинь луч движением вбок.')[lang]}</p>
    <p class="yuna-dialogue" role="status">${(saved ? savedMessage : introMessage)[lang]}</p>
    <fieldset class="yuna-options">
      <legend>${line('Spot rengi', 'Цвет прожектора')[lang]}</legend><div>${spotButtons}</div>
    </fieldset>
    <fieldset class="yuna-options yuna-directions">
      <legend>${line('Işık yönü', 'Направление луча')[lang]}</legend><div>${aimButtons}</div>
    </fieldset>
    <p class="yuna-light-note" role="status">${spotNotes[spot][lang]}</p>
    <button type="button" class="primary yuna-primary" data-act="yuna-confirm"${saved ? ' disabled' : ''}>
      ${(saved ? line('Konser ışığı kaydedildi', 'Свет для концерта сохранён') : line('Konser için bu ışığı seç', 'Выбрать этот свет для концерта'))[lang]}
    </button>
    ${saved ? `<button type="button" class="secondary yuna-primary" data-act="yuna-exit">
      ${line('Provayı bitir', 'Завершить репетицию')[lang]} <span aria-hidden="true">→</span>
    </button>` : ''}
  </section>`;
}
export function mountYunaAim(root, afterChange) {
    const preview = root.querySelector('.yuna-preview');
    if (!preview)
        return () => { };
    const controller = new AbortController();
    const listener = { signal: controller.signal };
    let start = null;
    preview.addEventListener('pointerdown', event => {
        if (!event.isPrimary || event.button !== 0)
            return;
        start = { id: event.pointerId, x: event.clientX, y: event.clientY };
        preview.setPointerCapture(event.pointerId);
    }, listener);
    preview.addEventListener('pointerup', event => {
        if (!start || start.id !== event.pointerId)
            return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        start = null;
        if (Math.abs(dx) < 28 || Math.abs(dx) <= Math.abs(dy))
            return;
        const current = aims.findIndex(({ id }) => state.aim === id);
        const target = aims[current + Math.sign(dx)];
        if (target && yunaAction('yuna-aim-' + target.id))
            afterChange();
    }, listener);
    preview.addEventListener('lostpointercapture', event => {
        if (start?.id === event.pointerId)
            start = null;
    }, listener);
    return () => controller.abort();
}
