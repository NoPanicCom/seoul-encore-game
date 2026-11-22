import { worldAudio } from './world-audio.js';
import { createWorldEngine } from './world-engine.js';
const say = (phrase, lang) => phrase[lang === 'tr' ? 0 : 1];
const members = ['jisoo', 'jennie', 'rose', 'lisa'];
const storageKey = 'encore1.world.v1';
const art = 'art/world/';
const costumes = {
    jisoo: {
        name: ['Jisoo', 'Джису'], light: [0, 2, 1], sound: [2, 0, 1], shelf: 0,
        delivery: ['Açılış ışığını birlikte deneyelim.', 'Проверим свет для выхода вместе.'],
        reward: ['Açılış ışığımız hazır.', 'Свет к выходу готов.'],
    },
    jennie: {
        name: ['Jennie', 'Дженни'], light: [1, 0, 2], sound: [2, 1, 0], shelf: 1,
        delivery: ['Tam zamanında! İlk sesi birlikte deneyelim.', 'Как раз вовремя! Проверим первый звук вместе.'],
        reward: ['İlk ses yerini buldu.', 'Первый звук на месте.'],
    },
    rose: {
        name: ['Rosé', 'Розэ'], light: [2, 0, 1], sound: [0, 2, 1], shelf: 2,
        delivery: ['Süper! Şimdi birbirimizi daha iyi duyacağız.', 'Отлично! Теперь мы лучше услышим друг друга.'],
        reward: ['Artık sesimiz birlikte.', 'Теперь наши голоса звучат вместе.'],
    },
    lisa: {
        name: ['Lisa', 'Лиса'], light: [0, 1, 2], sound: [1, 0, 2], shelf: 0,
        delivery: ['İyi iş! İki provayı bitirince sahneye çıkalım.', 'Отличная работа! Выйдем на сцену после двух проверок.'],
        reward: ['İlk sahne adımı bizim.', 'Первый шаг на сцену — наш.'],
    },
};
const copy = {
    title: ['Konser kulisi', 'За кулисами'],
    pick: ['Kiminle oynayalım?', 'За кого играть?'],
    room: ['YG · Hazırlık odası', 'YG · Гримёрка'],
    canvas: ['Kulis odası. Yürümek için zemine dokun veya okları kullan.', 'Гримёрка. Коснись пола или используй стрелки, чтобы идти.'],
    steer: ['Hareket', 'Движение'],
    guide: ['Yere dokun veya yön kolunu sürükle. Bir nesneye dokununca karakter yanına gider.', 'Коснись пола или потяни за джойстик. Коснись предмета, и героиня подойдёт к нему.'],
    firstWalk: ['Zemine dokun veya joystick’i sürükle.', 'Коснись пола или потяни джойстик.'],
    walk: ['Dolaş', 'Гуляй'],
    upNext: ['Sıradaki görev', 'Следующее задание'],
    map: ['Odadaki yerler', 'Места в гримёрке'],
    pixel: ['Pixel', 'Пиксель'],
    wardrobe: ['Gardırop', 'Гардероб'],
    return: ['Hazırlık masası', 'Гримёрный столик'],
    console: ['Prova paneli', 'Пульт репетиции'],
    curtain: ['Sahne perdesi', 'Занавес сцены'],
    pet: ['Pixel’i sev', 'Погладить Пикселя'],
    search: ['Rafı ara', 'Осмотреть полку'],
    bring: ['Kulaklığı bırak', 'Положить наушник'],
    check: ['Provayı aç', 'Открыть репетицию'],
    exit: ['Sahneye çık', 'Выйти на сцену'],
    close: ['Kapat', 'Закрыть'],
    gear: ['Kulaklık', 'Наушник'],
    light: ['Işık', 'Свет'],
    sound: ['Ses', 'Звук'],
    curtainTask: ['Sahne', 'Сцена'],
    waiting: ['Pixel’e yaklaş ve onu sev.', 'Подойди к Пикселю и погладь его.'],
    searching: ['Gardırobun alt rafında pembe kulaklığı ara.', 'Поищи розовый наушник на нижней полке гардероба.'],
    carrying: ['Pembe kulaklığı hazırlık masasına götür.', 'Отнеси розовый наушник к гримёрному столику.'],
    rehearse: ['Prova panelinde ışık ve sesi dene.', 'Проверь свет и звук на пульте репетиции.'],
    toCurtain: ['Hazırsın! Perdeye yaklaş ve sahneye çık.', 'Всё готово! Подойди к занавесу и выйди на сцену.'],
    checkedIn: ['Sahneye dönebilir ya da kulisi keşfedebilirsin.', 'Можно вернуться на сцену или погулять по гримёрке.'],
    pixelClue: ['Pixel mırıldandı, sonra gardırobun alt rafına baktı.', 'Пиксель замурлыкал и посмотрел на нижнюю полку гардероба.'],
    pixelAgain: ['Pixel gözlerini yavaşça kırptı ve patisini uzattı.', 'Пиксель медленно моргнул и протянул лапу.'],
    blocked: ['Perdeyi açmak için önce kulaklığı teslim et, ışık ve sesi dene.', 'Чтобы открыть занавес, верни наушник и проверь свет и звук.'],
    wardrobeEmpty: ['Gardıropta sahne kıyafetleri asılı.', 'В гардеробе висят сценические костюмы.'],
    returnEmpty: ['Hazırlık masasında kulaklık için boş bir yer var.', 'На гримёрном столике есть место для наушника.'],
    returnDone: ['Pembe kulaklık hazır. Ekip şimdi provanı bekliyor.', 'Розовый наушник на месте. Команда ждёт репетиции.'],
    consoleLocked: ['Önce pembe kulaklığı masaya getir.', 'Сначала отнеси розовый наушник к столику.'],
    take: ['Pembe kulaklık çantada!', 'Розовый наушник в сумке!'],
    inBag: ['Çantada · Pembe kulaklık', 'В сумке · Розовый наушник'],
    shelves: ['Alt rafta nereye bakarsın?', 'Где посмотреть на нижней полке?'],
    shelfPrompt: ['Kutuları açıp kulaklığı bul.', 'Открой коробки и найди наушник.'],
    shelfMiss: ['Bu kutu boş. Diğerlerine bakabilirsin.', 'Здесь пусто. Загляни в другие коробки.'],
    shelfTip: ['İpucu', 'Подсказка'],
    spoilers: ['Kulaklık şu kutuda: ', 'Наушник в этой коробке: '],
    consoleTitle: ['Işık ve ses provası', 'Проверка света и звука'],
    consoleIntro: ['Bir prova seç ve işaretleri sırasıyla tekrarla.', 'Выбери проверку и повтори сигналы по порядку.'],
    lightTitle: ['Renk sırasını yakala', 'Повтори порядок цветов'],
    soundTitle: ['Sahne çağrısını çal', 'Сыграй сигнал к выходу'],
    lightPrompt: ['Projektörleri karttaki sırayla aç.', 'Включи прожекторы в порядке, указанном на карточке.'],
    soundPrompt: ['Sinyali dinle veya simgelere bak. Sonra üç tuşa sırayla bas.', 'Послушай сигнал или посмотри на значки. Затем нажми три клавиши по порядку.'],
    previewLight: ['Işıkları izle', 'Смотреть свет'],
    previewSound: ['Sinyali dinle', 'Слушать сигнал'],
    playing: ['Sıra gösteriliyor…', 'Сигнал идёт…'],
    retry: ['Sırayı baştan deneyebilirsin.', 'Повтори порядок с начала.'],
    done: ['Prova tamam', 'Проверка пройдена'],
    lightsDone: ['Projektör sırası tamam! Işıklar sahneyi boyadı.', 'Свет настроен! Прожекторы раскрасили сцену.'],
    soundDone: ['Sahne çağrısı hazır. Sinyal kulaklıklara gidiyor!', 'Сигнал готов. Он прозвучит в наушниках!'],
    bothDone: ['Ekip hazır. Sahne perdesine git!', 'Команда готова. Иди к занавесу!'],
    saveIssue: ['Tarayıcı kaydı tutamıyor. Bu açık oturumda oynamaya devam edebilirsin.', 'Браузер не может сохранить игру. Ты можешь продолжить в этой сессии.'],
    assetIssue: ['Bir kulis görseli yüklenemedi. Odayı yeniden açmayı dene.', 'Не удалось загрузить рисунок. Попробуй открыть гримёрку снова.'],
    albumCard: ['İlk sahne çağrısı', 'Первый вызов на сцену'],
    replay: ['Hazırlığa yeniden başla', 'Начать подготовку заново'],
    openCurtain: ['Perde açılıyor…', 'Занавес открывается…'],
};
const shelves = [
    ['Tokalı sandık', 'Сундучок с застёжкой'],
    ['Taç bölmesi', 'Отделение с короной'],
    ['Pembe kutu', 'Розовая коробка'],
];
const symbols = {
    light: [
        { icon: '●', label: ['Pembe', 'Розовый'], color: 'pink' },
        { icon: '◆', label: ['Mor', 'Фиолетовый'], color: 'violet' },
        { icon: '✦', label: ['Altın', 'Золотой'], color: 'gold' },
    ],
    sound: [
        { icon: '▂', label: ['Bas', 'Низкий'], color: 'pink' },
        { icon: '▅', label: ['Orta', 'Средний'], color: 'violet' },
        { icon: '▇', label: ['Tiz', 'Высокий'], color: 'gold' },
    ],
};
const hotspots = ['pixel', 'wardrobe', 'return', 'console', 'curtain'];
const scene = {
    width: 1440,
    height: 960,
    background: art + 'backstage.webp',
    walkable: [
        { x: 39, y: 558 }, { x: 88, y: 488 }, { x: 450, y: 467 }, { x: 515, y: 440 },
        { x: 1189, y: 440 }, { x: 1225, y: 478 }, { x: 1370, y: 505 }, { x: 1400, y: 520 },
        { x: 1420, y: 575 }, { x: 1420, y: 928 }, { x: 20, y: 928 }, { x: 20, y: 605 },
    ],
    obstacles: [],
    spawn: { x: 1150, y: 675 },
    hotspots: [
        { id: 'pixel', position: { x: 1324, y: 438 }, hitbox: { x: 1262, y: 365, width: 119, height: 102 }, approach: { x: 1280, y: 505 }, radius: 86, image: art + 'pixel.webp', size: { width: 76, height: 76 }, sheet: { frameWidth: 96, frameHeight: 96, rows: { south: 0 }, idleColumn: 0, walkColumns: [1, 3, 2, 1], anchor: { x: 48, y: 88 } } },
        { id: 'wardrobe', position: { x: 260, y: 355 }, hitbox: { x: 170, y: 285, width: 186, height: 154 }, approach: { x: 260, y: 507 }, radius: 87 },
        { id: 'return', position: { x: 565, y: 250 }, hitbox: { x: 488, y: 218, width: 154, height: 195 }, approach: { x: 565, y: 471 }, radius: 82 },
        { id: 'console', position: { x: 850, y: 280 }, hitbox: { x: 774, y: 241, width: 152, height: 170 }, approach: { x: 850, y: 476 }, radius: 82 },
        { id: 'curtain', position: { x: 1160, y: 320 }, hitbox: { x: 1092, y: 250, width: 136, height: 189 }, approach: { x: 1160, y: 481 }, radius: 82 },
    ],
};
function appearance(member) {
    return {
        image: art + member + '.webp', width: 160, height: 200, speed: 375,
        sheet: { frameWidth: 128, frameHeight: 160, rows: { south: 0, west: 1, north: 2 }, idleColumn: 0, walkColumns: [1, 2, 3], anchor: { x: 64, y: 150 } },
    };
}
const emptyTrail = () => ({ gear: 'waiting', light: false, sound: false });
const initial = () => ({ ...emptyTrail(), member: 'lisa', cards: [], trails: {} });
let cached;
let saveIssue = false;
function readTrail(raw) {
    const gear = ['waiting', 'searching', 'carrying', 'returned'].find(stage => stage === raw.gear) ?? 'waiting';
    return { gear, light: gear === 'returned' && raw.light === true, sound: gear === 'returned' && raw.sound === true };
}
export function readWorldProgress(value) {
    if (!value)
        return initial();
    try {
        const raw = JSON.parse(value);
        if (!raw || typeof raw !== 'object')
            return initial();
        const member = members.find(id => id === raw.member) ?? 'lisa';
        const cards = Array.isArray(raw.cards) ? members.filter(id => raw.cards?.includes(id)) : [];
        const trails = {};
        for (const id of members) {
            const candidate = raw.trails?.[id];
            if (candidate && typeof candidate === 'object')
                trails[id] = readTrail(candidate);
        }
        return { ...readTrail(raw), member, cards, trails };
    }
    catch (error) {
        if (error instanceof SyntaxError)
            return initial();
        throw error;
    }
}
function progress() {
    if (cached)
        return cached;
    if (typeof window === 'undefined')
        return initial();
    try {
        cached = readWorldProgress(window.localStorage.getItem(storageKey));
    }
    catch {
        saveIssue = true;
        cached = initial();
    }
    return cached;
}
function save(state) {
    cached = state;
    try {
        window.localStorage.setItem(storageKey, JSON.stringify(state));
    }
    catch {
        saveIssue = true;
    }
}
export function advanceWorld(state, action) {
    if (action === 'meet' && state.gear === 'waiting')
        return { ...state, gear: 'searching' };
    if (action === 'take' && state.gear === 'searching')
        return { ...state, gear: 'carrying' };
    if (action === 'return' && state.gear === 'carrying')
        return { ...state, gear: 'returned' };
    if (state.gear !== 'returned')
        return state;
    if (action === 'light' || action === 'sound')
        return state[action] ? state : { ...state, [action]: true };
    if (action === 'curtain' && state.light && state.sound && !state.cards.includes(state.member)) {
        return { ...state, cards: [...state.cards, state.member] };
    }
    return state;
}
export function worldChallenge(member, kind) {
    return costumes[member][kind];
}
export function chooseWorldMember(state, member) {
    if (state.member === member)
        return state;
    const { gear, light, sound } = state;
    return { ...state, ...(state.trails[member] ?? emptyTrail()), member, trails: { ...state.trails, [state.member]: { gear, light, sound } } };
}
function nextPlace(state) {
    if (state.gear === 'waiting')
        return 'pixel';
    if (state.gear === 'searching')
        return 'wardrobe';
    if (state.gear === 'carrying')
        return 'return';
    return state.light && state.sound ? 'curtain' : 'console';
}
export function worldObjective(state, lang) {
    if (state.gear !== 'returned')
        return say(copy[state.gear], lang);
    if (!state.light || !state.sound)
        return say(copy.rehearse, lang);
    return say(state.cards.includes(state.member) ? copy.checkedIn : copy.toCurtain, lang);
}
function castFace(member) {
    return `<img src="${art}hero-${member}.webp" alt="" aria-hidden="true">`;
}
function action(id, label, style = '') {
    return `<button type="button" class="world-button ${style}" data-world-action="${id}">${label}</button>`;
}
export function renderWorld(lang) {
    const state = progress();
    return `<section class="world-shell" id="world-room" aria-labelledby="world-title">
    <div class="world-heading">
      <div><span class="world-room-name">${say(copy.room, lang)}</span><h2 id="world-title">${say(copy.title, lang)}</h2></div>
      ${action('pick-member', castFace(state.member) + '<span id="world-member-name">' + say(costumes[state.member].name, lang) + '</span><span aria-hidden="true">⌄</span>', 'world-member')}
    </div>
    <div class="world-board" id="world-board">
      <canvas id="world-canvas" tabindex="0" aria-label="${say(copy.canvas, lang)}"></canvas>
      <div class="world-light" id="world-light" aria-hidden="true"></div>
      <div class="world-curtain" aria-hidden="true"></div>
      <div class="world-spots">
        ${hotspots.map(id => `<button type="button" class="world-spot" data-world-go="${id}" hidden><span class="world-spot-pin" aria-hidden="true"></span><span class="world-spot-label">${say(copy[id], lang)}</span></button>`).join('')}
      </div>
      <div class="world-room-inventory" id="world-inventory" hidden><span aria-hidden="true">◉</span> ${say(copy.inBag, lang)}</div>
      <div class="world-held" id="world-held" hidden aria-hidden="true"></div>
      <div class="world-controls">
        <div class="world-stick" id="world-stick" aria-label="${say(copy.steer, lang)}"><span aria-hidden="true">↔</span><i id="world-thumb" aria-hidden="true"></i></div>
        ${action('interact', say(copy.walk, lang), 'world-interact').replace('type="button"', 'type="button" id="world-interact" hidden')}
      </div>
    </div>
    <div class="world-journal">
      <div class="world-objective">
        <span>${say(copy.upNext, lang)}</span>
        <strong id="world-objective" aria-live="polite">${worldObjective(state, lang)}</strong>
        <small class="world-first-walk" id="world-first-walk"${state.gear === 'waiting' ? '' : ' hidden'}>${say(copy.firstWalk, lang)}</small>
      </div>
      <ol class="world-checklist" id="world-checklist">${checklist(state, lang)}</ol>
      <p class="world-feedback" id="world-feedback" role="status"></p>
      <details class="world-map" id="world-map">
        <summary>${say(copy.map, lang)}</summary>
        <p>${say(copy.guide, lang)}</p>
        <div class="world-map-grid">${hotspots.map(id => action('walk-' + id, say(copy[id], lang))).join('')}${action('toggle-sound', say(soundOn, lang))}</div>
      </details>
      <p id="world-save-issue" class="world-feedback" role="status" hidden>${say(copy.saveIssue, lang)}</p>
      <p id="world-asset-issue" class="world-feedback" role="status" hidden>${say(copy.assetIssue, lang)}</p>
    </div>
    <dialog class="world-dialog" id="world-panel" aria-labelledby="world-panel-title"></dialog>
  </section>`;
}
function checklist(state, lang) {
    const tasks = [
        [copy.gear, state.gear === 'returned'], [copy.light, state.light], [copy.sound, state.sound],
        [copy.curtainTask, state.cards.includes(state.member)],
    ];
    return tasks.map(([label, done]) => `<li data-world-done="${done}"><span aria-hidden="true">${done ? '✓' : '○'}</span>${say(label, lang)}${done ? '<span class="world-sr"> · ' + say(copy.done, lang) + '</span>' : ''}</li>`).join('');
}
export function worldAlbum(lang) {
    return progress().cards.map(id => ({
        title: say(copy.albumCard, lang) + ' · ' + say(costumes[id].name, lang),
        image: 'art/studio/' + id + '-spotlight.webp',
        subtitle: say(costumes[id].reward, lang),
    }));
}
function dialogHeading(title, lang) {
    return `<div class="world-dialog-heading"><h3 id="world-panel-title">${say(title, lang)}</h3>${action('close-panel', '×', 'world-dialog-close').replace('type="button"', `type="button" aria-label="${say(copy.close, lang)}"`)}</div>`;
}
function panelMarkup(panel, state, lang) {
    if (panel === 'member') {
        return dialogHeading(copy.pick, lang) + '<div class="world-cast-grid">' + members.map(id => action('member-' + id, castFace(id) + '<strong>' + say(costumes[id].name, lang) + '</strong>' + (id === state.member ? '<span aria-hidden="true">✓</span>' : ''), 'world-cast-option')
            .replace('type="button"', `type="button" aria-pressed="${id === state.member}"`)).join('') + '</div>' + (state.cards.includes(state.member) ? action('replay', say(copy.replay, lang), 'world-panel-text-button') : '');
    }
    if (panel === 'shelves') {
        return dialogHeading(copy.shelves, lang) + `<p>${say(copy.shelfPrompt, lang)}</p><div class="world-shelf-grid">
      ${shelves.map((label, index) => action('shelf-' + index, '<span aria-hidden="true">' + ['▣', '♕', '●'][index] + '</span>' + say(label, lang), 'world-shelf')).join('')}
    </div>${action('shelf-tip', say(copy.shelfTip, lang), 'world-panel-text-button')}<p class="world-panel-status" role="status"></p>`;
    }
    if (panel === 'console') {
        return dialogHeading(copy.consoleTitle, lang) + `<p>${say(copy.consoleIntro, lang)}</p><div class="world-console-grid">
      ${['light', 'sound'].map(kind => action('rehearse-' + kind, '<span aria-hidden="true">' + (kind === 'light' ? '✦' : '♫') + '</span>' + say(copy[kind], lang) + (state[kind] ? ' ✓' : ''), 'world-console-option')).join('')}
    </div>`;
    }
    const light = panel === 'light';
    const sequence = worldChallenge(state.member, panel);
    return dialogHeading(light ? copy.lightTitle : copy.soundTitle, lang) + `<p>${say(light ? copy.lightPrompt : copy.soundPrompt, lang)}</p>
    <ol class="world-sequence">${sequence.map(note => {
        const symbol = symbols[panel][note];
        return `<li data-world-cue="${note}" class="world-signal is-${symbol.color}" aria-label="${say(symbol.label, lang)}"><span aria-hidden="true">${symbol.icon}</span></li>`;
    }).join('')}</ol>
    <div class="world-cue-grid">${symbols[panel].map((symbol, note) => action(panel + '-' + note, '<span aria-hidden="true">' + symbol.icon + '</span>' + say(symbol.label, lang), 'world-cue is-' + symbol.color)).join('')}</div>
    <div class="world-preview">${action('preview', say(light ? copy.previewLight : copy.previewSound, lang), 'world-panel-text-button')}${action('console', say(copy.console, lang), 'world-panel-text-button')}</div>
    <p class="world-panel-status" role="status"></p>`;
}
function required(selector) {
    const element = document.querySelector(selector);
    if (!element)
        throw new Error(selector);
    return element;
}
function isHotspot(id) {
    return hotspots.some(spot => spot === id);
}
function isNote(value) {
    return value === 0 || value === 1 || value === 2;
}
export function mountWorld(lang, requestAction, sound = true, setSound) {
    const room = required('#world-room');
    const board = required('#world-board');
    const canvas = required('#world-canvas');
    const stick = required('#world-stick');
    const thumb = required('#world-thumb');
    const dialog = required('#world-panel');
    const interact = required('#world-interact');
    const objective = required('#world-objective');
    const firstWalk = required('#world-first-walk');
    const feedback = required('#world-feedback');
    const checklistNode = required('#world-checklist');
    const inventory = required('#world-inventory');
    const held = required('#world-held');
    const storageWarning = required('#world-save-issue');
    const assetWarning = required('#world-asset-issue');
    const lightOverlay = required('#world-light');
    const places = required('#world-map');
    const soundButton = required('[data-world-action="toggle-sound"]');
    const markers = Array.from(room.querySelectorAll('[data-world-go]'));
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listeners = new AbortController();
    const timers = new Set();
    let state = progress();
    let nearby = null;
    let panel = null;
    let guesses = 0;
    let previewGeneration = 0;
    let exiting = false;
    let markerWidth = 0;
    const markerMargins = new Map();
    let lightTimer = 0;
    let openedFrom = null;
    const descriptions = { pixel: copy.pet, wardrobe: copy.search, return: copy.bring, console: copy.check, curtain: copy.exit };
    const enterAudio = () => { void worldAudio.enter(); };
    worldAudio.setEnabled(sound);
    function after(callback, delay) {
        const timer = window.setTimeout(() => { timers.delete(timer); callback(); }, delay);
        timers.add(timer);
        return timer;
    }
    function refresh() {
        room.dataset.worldGear = state.gear;
        room.dataset.worldReady = String(Number(state.light) + Number(state.sound));
        room.dataset.worldMember = state.member;
        inventory.hidden = state.gear !== 'carrying';
        held.hidden = inventory.hidden;
        firstWalk.hidden = state.gear !== 'waiting';
        objective.textContent = worldObjective(state, lang);
        checklistNode.innerHTML = checklist(state, lang);
        storageWarning.hidden = !saveIssue;
        lightOverlay.classList.toggle('world-lights-ready', state.light);
        required('#world-member-name').textContent = say(costumes[state.member].name, lang);
        required('[data-world-action="pick-member"] img').src = art + 'hero-' + state.member + '.webp';
        room.dataset.worldSound = String(sound);
        soundButton.textContent = say(sound ? soundOn : soundOff, lang);
        soundButton.setAttribute('aria-pressed', String(sound));
        engine.setHighlightedHotspot(state.gear === 'searching' || state.cards.includes(state.member) ? null : nextPlace(state));
        for (const marker of markers)
            marker.classList.toggle('world-destination', marker.dataset.worldGo === nextPlace(state));
        markerMargins.clear();
    }
    function commit(next) {
        if (next !== state) {
            state = next;
            save(state);
            refresh();
        }
    }
    function show(text) { feedback.textContent = say(text, lang); }
    function showPanel(next) {
        previewGeneration++;
        panel = next;
        guesses = 0;
        dialog.dataset.worldPanel = next;
        dialog.innerHTML = panelMarkup(next, state, lang);
        engine.setPaused(true);
        if (!dialog.open) {
            openedFrom = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            dialog.showModal();
        }
        dialog.querySelector('button')?.focus();
    }
    function closePanel() {
        previewGeneration++;
        panel = null;
        delete dialog.dataset.worldPanel;
        if (dialog.open)
            dialog.close();
        engine.setPaused(false);
        if (openedFrom?.isConnected && !openedFrom.hidden)
            openedFrom.focus({ preventScroll: true });
        openedFrom = null;
    }
    function announcePanel(message) {
        const status = dialog.querySelector('.world-panel-status');
        if (status)
            status.textContent = typeof message === 'string' ? message : say(message, lang);
    }
    function door() {
        if (!(state.light && state.sound)) {
            show(copy.blocked);
            return;
        }
        commit(advanceWorld(state, 'curtain'));
        exiting = true;
        engine.setPaused(true);
        board.dataset.worldExiting = 'true';
        feedback.textContent = say(copy.openCurtain, lang);
        worldAudio.cue('curtain');
        after(() => requestAction('world-enter-concert', state.member), sound ? 760 : media.matches ? 0 : 420);
    }
    function onInteract(id) {
        if (exiting || panel || !isHotspot(id))
            return;
        if (id === 'pixel') {
            const first = state.gear === 'waiting';
            commit(advanceWorld(state, 'meet'));
            engine.pulseHotspot('pixel');
            worldAudio.cue('pixel');
            show(first ? copy.pixelClue : copy.pixelAgain);
        }
        else if (id === 'wardrobe') {
            if (state.gear === 'searching')
                showPanel('shelves');
            else
                show(copy.wardrobeEmpty);
        }
        else if (id === 'return') {
            if (state.gear === 'carrying') {
                commit(advanceWorld(state, 'return'));
                worldAudio.cue('delivery');
                show(costumes[state.member].delivery);
            }
            else
                show(state.gear === 'returned' ? copy.returnDone : copy.returnEmpty);
        }
        else if (id === 'console') {
            if (state.gear === 'returned')
                showPanel('console');
            else
                show(copy.consoleLocked);
        }
        else
            door();
    }
    const engine = createWorldEngine({
        canvas, scene, player: appearance(state.member), onInteract,
        joystick: { base: stick, thumb },
        onStep: () => worldAudio.cue('step'),
        onFrame: updateMarkers,
        onAssetError: () => { assetWarning.hidden = false; },
        onProximityChange: id => {
            nearby = id && isHotspot(id) ? id : null;
            board.dataset.worldNear = nearby ?? '';
            interact.hidden = !nearby;
            if (nearby)
                interact.textContent = say(descriptions[nearby], lang);
        },
    });
    interact.hidden = true;
    function updateMarkers() {
        const { x, y } = engine.getPosition();
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (markerWidth !== width) {
            markerMargins.clear();
            markerWidth = width;
        }
        const xValue = String(Math.round(x));
        const yValue = String(Math.round(y));
        if (board.dataset.playerX !== xValue)
            board.dataset.playerX = xValue;
        if (board.dataset.playerY !== yValue)
            board.dataset.playerY = yValue;
        if (!held.hidden) {
            const camera = engine.getCamera();
            const itemX = Math.round((x - camera.x + 37) * camera.scale);
            const itemY = Math.round((y - camera.y - 67) * camera.scale);
            const position = `translate(${itemX}px, ${itemY}px)`;
            if (held.style.transform !== position)
                held.style.transform = position;
        }
        for (const marker of markers) {
            const id = marker.dataset.worldGo;
            const position = id ? engine.getHotspotScreenPosition(id) : null;
            const inside = position && position.x > 4 && position.x < width - 4 && position.y < height - 76 && position.y > -25;
            const hidden = !inside || exiting;
            if (marker.hidden !== hidden)
                marker.hidden = hidden;
            if (!inside || hidden)
                continue;
            const margin = markerMargins.get(marker) ?? marker.offsetWidth / 2 + 4;
            markerMargins.set(marker, margin);
            const left = Math.round(Math.max(margin, Math.min(width - margin, position.x))) + 'px';
            const minimumTop = marker.classList.contains('world-destination') ? 52 : 22;
            const top = Math.round(Math.max(minimumTop, position.y)) + 'px';
            if (marker.style.left !== left)
                marker.style.left = left;
            if (marker.style.top !== top)
                marker.style.top = top;
        }
    }
    function glow(color) {
        window.clearTimeout(lightTimer);
        timers.delete(lightTimer);
        lightOverlay.dataset.worldColor = color;
        lightTimer = after(() => { delete lightOverlay.dataset.worldColor; }, 400);
    }
    function preview(kind) {
        const generation = ++previewGeneration;
        const cues = Array.from(dialog.querySelectorAll('[data-world-cue]'));
        announcePanel(copy.playing);
        for (const [index, note] of worldChallenge(state.member, kind).entries()) {
            after(() => {
                if (generation !== previewGeneration)
                    return;
                cues.forEach((cue, i) => cue.classList.toggle('world-cue-hot', i === index));
                if (kind === 'sound')
                    worldAudio.note(note);
            }, index * 420);
        }
        after(() => {
            if (generation !== previewGeneration)
                return;
            cues.forEach(cue => cue.classList.remove('world-cue-hot'));
            announcePanel('');
        }, cues.length * 420);
    }
    function answer(kind, note) {
        previewGeneration++;
        const cueNodes = Array.from(dialog.querySelectorAll('[data-world-cue]'));
        cueNodes.forEach(cue => cue.classList.remove('world-cue-hot'));
        if (kind === 'sound')
            worldAudio.note(note);
        else
            glow(symbols.light[note].color);
        const sequence = worldChallenge(state.member, kind);
        if (note !== sequence[guesses]) {
            guesses = 0;
            cueNodes.forEach(cue => cue.classList.remove('world-cue-done'));
            announcePanel(copy.retry);
            return;
        }
        cueNodes[guesses]?.classList.add('world-cue-done');
        guesses++;
        if (guesses < sequence.length) {
            announcePanel(guesses + ' / ' + sequence.length);
            return;
        }
        commit(advanceWorld(state, kind));
        if (kind === 'light')
            worldAudio.cue('spotlight');
        show(state.light && state.sound ? copy.bothDone : kind === 'light' ? copy.lightsDone : copy.soundDone);
        if (state.light && state.sound)
            closePanel();
        else
            showPanel('console');
    }
    function walkTo(id) {
        if (places.open)
            places.open = false;
        canvas.focus({ preventScroll: true });
        engine.moveToHotspot(id);
    }
    room.addEventListener('click', event => {
        if (!(event.target instanceof Element) || exiting)
            return;
        const button = event.target.closest('button');
        if (!button || !room.contains(button))
            return;
        const destination = button.dataset.worldGo;
        if (destination && isHotspot(destination)) {
            walkTo(destination);
            return;
        }
        const id = button.dataset.worldAction;
        if (!id)
            return;
        const walkTarget = id.slice(5);
        if (id.startsWith('walk-') && isHotspot(walkTarget)) {
            walkTo(walkTarget);
            return;
        }
        const member = members.find(value => id === 'member-' + value);
        if (member && panel === 'member') {
            if (state.member !== member) {
                commit(chooseWorldMember(state, member));
                engine.setAppearance(appearance(member));
                feedback.textContent = '';
            }
            closePanel();
        }
        else if (id === 'toggle-sound') {
            sound = !sound;
            worldAudio.setEnabled(sound);
            if (sound)
                enterAudio();
            if (setSound)
                setSound(sound);
            else {
                try {
                    window.localStorage.setItem('encore1.sound', sound ? 'on' : 'off');
                }
                catch {
                    saveIssue = true;
                }
            }
            refresh();
        }
        else if (id === 'pick-member')
            showPanel('member');
        else if (id === 'close-panel')
            closePanel();
        else if (id === 'interact' && nearby && !panel)
            engine.interact();
        else if (id === 'replay' && panel === 'member') {
            commit({ ...state, ...emptyTrail() });
            feedback.textContent = '';
            closePanel();
        }
        else if (id === 'console' && panel)
            showPanel('console');
        else if (id === 'rehearse-light' || id === 'rehearse-sound') {
            if (panel === 'console')
                showPanel(id === 'rehearse-light' ? 'light' : 'sound');
        }
        else if (panel === 'shelves') {
            if (id === 'shelf-tip')
                announcePanel(say(copy.spoilers, lang) + say(shelves[costumes[state.member].shelf], lang));
            else if (id === 'shelf-' + costumes[state.member].shelf) {
                commit(advanceWorld(state, 'take'));
                worldAudio.cue('delivery');
                show(copy.take);
                closePanel();
            }
            else
                announcePanel(copy.shelfMiss);
        }
        else if (panel === 'light' || panel === 'sound') {
            if (id === 'preview')
                preview(panel);
            else if (id.startsWith(panel + '-')) {
                const note = Number(id.slice(panel.length + 1));
                if (isNote(note))
                    answer(panel, note);
            }
        }
    }, { signal: listeners.signal });
    dialog.addEventListener('cancel', event => { event.preventDefault(); closePanel(); }, { signal: listeners.signal });
    room.addEventListener('pointerdown', enterAudio, { capture: true, signal: listeners.signal });
    room.addEventListener('pointerup', enterAudio, { capture: true, signal: listeners.signal });
    room.addEventListener('click', enterAudio, { capture: true, signal: listeners.signal });
    room.addEventListener('keydown', enterAudio, { capture: true, signal: listeners.signal });
    refresh();
    updateMarkers();
    return () => {
        listeners.abort();
        timers.forEach(timer => window.clearTimeout(timer));
        timers.clear();
        engine.destroy();
        worldAudio.exit();
    };
}
const soundOn = ['♫ Ses açık', '♫ Звук включён'];
const soundOff = ['○ Ses kapalı', '○ Звук выключен'];
