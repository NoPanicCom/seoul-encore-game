import { line } from './story.js';
import { worldAudio } from './world-audio.js';
import { createWorldEngine, worldToCamera } from './world-engine.js';
const key = 'seoul-encore:manager-mic:v1';
const duration = 120000;
const copy = {
    room: line('Arena kulisi', 'За кулисами арены'),
    title: line('Kayıp mikrofon', 'Пропавший микрофон'),
    search: line('Konsere iki dakika kala Lisa’nın mikrofonu kayboldu. Yedeğini bul!', 'За две минуты до концерта пропал микрофон Лисы. Найди запасной!'),
    carrying: line('Yedek mikrofonu sahne kanadında Lisa’ya ver.', 'Отнеси запасной микрофон Лисе к кулисе.'),
    delivered: line('Mikrofon Lisa’da. Sahne hazır!', 'Микрофон у Лисы. Сцена готова!'),
    beforeShow: line('Vokal girişine', 'До вокала'),
    countdown: line('Lisa’nın açılış dansı', 'Вступительный танец Лисы'),
    dance: line('Dans sürüyor', 'Танец продолжается'),
    live: line('Mikrofon açık', 'Микрофон включён'),
    feed: line('Sahne monitörü', 'Монитор сцены'),
    dancing: line('Lisa mikrofonsuz dans ediyor', 'Лиса танцует без микрофона'),
    singing: line('Lisa mikrofonu elinde tutuyor', 'Лиса держит микрофон'),
    canvas: line('Kulis odası. Yürümek için zemine dokun veya yön tuşlarını kullan.', 'Гримёрка. Чтобы идти, коснись пола или нажимай стрелки.'),
    shelf: line('Raf', 'Полка'),
    case: line('Kutu', 'Кофр'),
    wing: line('Kanat', 'Кулиса'),
    goShelf: line('Kostüm rafına git', 'Подойти к полке с костюмами'),
    goCase: line('Ekipman kutusuna git', 'Подойти к кофру с оборудованием'),
    goWing: line('Sahne kanadına git', 'Подойти к кулисе'),
    shelfClue: line('Rafta sadece kostümler var. Ekipman kutusuna bak.', 'На полке только костюмы. Загляни в кофр с оборудованием.'),
    emptyHands: line('Lisa sahne kanadında. Önce yedek mikrofonu bul.', 'Лиса у кулисы. Сначала найди запасной микрофон.'),
    took: line('Yedek mikrofonu aldın! Şimdi sahne kanadına git.', 'Запасной микрофон у тебя! Теперь иди к кулисе.'),
    emptyCase: line('Kutudaki mikrofon elinde. Lisa kanatta bekliyor.', 'Микрофон из кофра у тебя. Лиса ждёт у кулисы.'),
    tap: line('Yürümek için zemine veya bir eşyaya dokun.', 'Коснись пола или предмета, чтобы подойти.'),
    rescue: line('Lisa dansa devam ediyor. Mikrofonu hâlâ yetiştirebilirsin!', 'Лиса продолжает танцевать. Ты ещё можешь принести микрофон!'),
    mic: line('Yedek mikrofon', 'Запасной микрофон'),
    reward: line('Altın mikrofon', 'Золотой микрофон'),
    thanks: line('Lisa mikrofonu aldı. Sahneyi kurtardın!', 'Лиса взяла микрофон. Ты спасла выступление!'),
    concert: line('Konsere geç', 'Перейти к концерту'),
    assetError: line('Kulis görseli yüklenemedi. Eşyaları düğmeleriyle arayabilirsin.', 'Не удалось загрузить рисунок гримёрки. Используй кнопки, чтобы осмотреть предметы.'),
};
const spots = [
    { id: 'shelf', position: { x: 255, y: 405 }, marker: { x: 255, y: 260 },
        hitbox: { x: 75, y: 45, width: 350, height: 405 }, approach: { x: 255, y: 500 }, radius: 35 },
    { id: 'case', position: { x: 802, y: 520 }, marker: { x: 802, y: 388 },
        hitbox: { x: 688, y: 391, width: 228, height: 141 }, approach: { x: 802, y: 576 }, radius: 35 },
    { id: 'wing', position: { x: 1164, y: 405 }, marker: { x: 1164, y: 260 },
        hitbox: { x: 1019, y: 14, width: 306, height: 419 }, approach: { x: 1164, y: 490 }, radius: 35 },
];
const casePosition = spots[1].position;
const wingPosition = { x: 1255, y: 468 };
const scene = {
    width: 1440,
    height: 960,
    background: 'art/world/backstage.webp',
    spawn: { x: 534, y: 736 },
    walkable: [
        { x: 26, y: 610 }, { x: 81, y: 494 }, { x: 452, y: 464 }, { x: 546, y: 437 },
        { x: 1210, y: 440 }, { x: 1400, y: 531 }, { x: 1412, y: 916 }, { x: 26, y: 916 },
    ],
    obstacles: [{ x: 673, y: 431, width: 260, height: 106 }],
    hotspots: spots,
};
const manager = {
    image: 'art/walk/cast-manager.webp', width: 158, height: 222, speed: 520,
    sheet: {
        frameWidth: 144, frameHeight: 192, rows: { south: 0, west: 1, north: 2 },
        idleColumn: 0, walkColumns: [1, 2, 3, 0], anchor: { x: 72, y: 188 }, articulated: true,
    },
};
const objectLabels = { shelf: copy.goShelf, case: copy.goCase, wing: copy.goWing };
function readSave() {
    try {
        const raw = localStorage.getItem(key);
        if (!raw)
            return null;
        const saved = JSON.parse(raw);
        if (!saved)
            return null;
        const { phase, deadline } = saved;
        if (phase !== 'search' && phase !== 'carrying' && phase !== 'delivered')
            return null;
        if (typeof deadline === 'number' && Number.isSafeInteger(deadline) && deadline > 0)
            return { phase, deadline };
    }
    catch { /* Oyun, tarayıcı kaydı kullanılamadığında bellekte sürer. */ }
    return null;
}
let current = readSave();
function save(next) {
    current = next;
    try {
        if (next)
            localStorage.setItem(key, JSON.stringify(next));
        else
            localStorage.removeItem(key);
    }
    catch { /* Oyun, tarayıcı kaydı kullanılamadığında bellekte sürer. */ }
}
function mission() {
    if (current)
        return current;
    const next = { phase: 'search', deadline: Date.now() + duration };
    save(next);
    return next;
}
export function resetManagerMic() { save(null); }
export function managerMicDone() { return current?.phase === 'delivered'; }
function secondsLeft(deadline) {
    return Math.max(0, Math.min(duration, deadline - Date.now())) / 1000;
}
function showState(phase, remaining) {
    if (phase === 'delivered')
        return 'live';
    return remaining > 0 ? 'countdown' : 'dance';
}
function clock(remaining) {
    const whole = Math.ceil(remaining);
    return `${Math.floor(whole / 60).toString().padStart(2, '0')}:${(whole % 60).toString().padStart(2, '0')}`;
}
function micArt(classes, attributes = '') {
    return `<span class="manager-mic-icon ${classes}" aria-hidden="true" ${attributes}></span>`;
}
export function renderManagerMic(lang) {
    const { phase, deadline } = mission();
    const left = secondsLeft(deadline);
    const show = showState(phase, left);
    const delivered = phase === 'delivered';
    const status = delivered ? copy.thanks : phase === 'carrying' ? copy.took : show === 'dance' ? copy.rescue : copy.tap;
    return `<section class="manager-mic" data-manager-mic data-mic-state="${phase}" data-show-state="${show}" aria-labelledby="manager-mic-title">
    <p class="manager-mic-room">${copy.room[lang]}</p>
    <h2 id="manager-mic-title">${copy.title[lang]}</h2>
    <div class="manager-mic-top">
      <div class="manager-mic-brief">
        <div class="manager-mic-countdown" data-mic-countdown ${delivered ? 'hidden' : ''}>
          <span>${copy.beforeShow[lang]}</span>
          <time data-mic-clock role="timer">${clock(left)}</time>
        </div>
        <p data-mic-objective>${copy[phase][lang]}</p>
        <span class="manager-mic-inventory" data-mic-inventory ${phase === 'carrying' ? '' : 'hidden'}>${micArt('')} ${copy.mic[lang]}</span>
      </div>
      <figure class="manager-mic-monitor" data-mic-monitor>
        <div class="manager-mic-monitor-bar">${copy.feed[lang]} <span aria-hidden="true"></span></div>
        <div class="manager-mic-screen" role="img" data-mic-feed aria-label="${(delivered ? copy.singing : copy.dancing)[lang]}">
          <div class="manager-mic-dancer" data-mic-dancer aria-hidden="true">
            <div class="manager-mic-lisa"></div>
            ${micArt('manager-mic-onstage', `data-mic-onstage ${delivered ? '' : 'hidden'}`)}
          </div>
        </div>
        <figcaption data-mic-caption>${copy[show][lang]}</figcaption>
      </figure>
    </div>
    <div class="manager-mic-board">
      <canvas data-mic-floor tabindex="0" aria-label="${copy.canvas[lang]}"></canvas>
      <div class="manager-mic-prop" data-mic-case aria-hidden="true"><i></i><b></b></div>
      <div class="manager-mic-at-wing" data-mic-wing-guest ${delivered ? '' : 'hidden'}>
        <img data-mic-guest src="art/world/hero-lisa.webp" alt="" draggable="false">
        ${micArt('manager-mic-wing-mic')}
      </div>
      ${micArt('manager-mic-carried', `data-mic-carried ${phase === 'carrying' ? '' : 'hidden'}`)}
      ${spots.map(({ id, marker }) => `<button type="button" class="manager-mic-object" data-mic-object="${id}" aria-label="${objectLabels[id][lang]}" style="left:${marker.x / scene.width * 100}%;top:${marker.y / scene.height * 100}%" ${delivered ? 'hidden' : ''}>
        <span class="manager-mic-object-shape" aria-hidden="true"></span><span>${copy[id][lang]}</span>
      </button>`).join('')}
    </div>
    <p class="manager-mic-feedback" data-mic-feedback role="status">${status[lang]}</p>
    <div class="manager-mic-result" data-mic-result ${delivered ? '' : 'hidden'}>
      <div class="manager-mic-reward" data-mic-reward>${micArt('')}<strong>${copy.reward[lang]}</strong></div>
      <button type="button" class="primary" data-act="manager-concert">${copy.concert[lang]} <span aria-hidden="true">→</span></button>
    </div>
  </section>`;
}
export function mountManagerMic(root, lang) {
    const board = root.matches('[data-manager-mic]') ? root : root.querySelector('[data-manager-mic]');
    if (!board)
        throw new Error('Missing manager microphone scene');
    const room = board;
    function get(selector) {
        const node = room.querySelector(selector);
        if (!node)
            throw new Error(`Missing manager microphone scene element ${selector}`);
        return node;
    }
    const canvas = get('[data-mic-floor]');
    const heading = get('[data-mic-objective]');
    const timing = get('[data-mic-countdown]');
    const time = get('[data-mic-clock]');
    const feedback = get('[data-mic-feedback]');
    const feed = get('[data-mic-feed]');
    const caption = get('[data-mic-caption]');
    const carried = get('[data-mic-carried]');
    const onstage = get('[data-mic-onstage]');
    const guest = get('[data-mic-wing-guest]');
    const inventory = get('[data-mic-inventory]');
    const result = get('[data-mic-result]');
    const prop = get('[data-mic-case]');
    const pins = Array.from(board.querySelectorAll('[data-mic-object]'));
    const doc = board.ownerDocument;
    const view = doc.defaultView;
    if (!view)
        throw new Error('The manager microphone scene requires a browser window');
    const controller = new AbortController();
    const listener = { signal: controller.signal };
    let state = mission();
    let engine = null;
    let artworkReady = false;
    function updateClock() {
        const left = secondsLeft(state.deadline);
        const show = showState(state.phase, left);
        const previous = room.dataset.showState;
        if (show !== 'live') {
            const label = clock(left);
            if (time.textContent !== label)
                time.textContent = label;
        }
        room.style.setProperty('--manager-mic-time', String(left / (duration / 1000)));
        if (previous === show)
            return;
        room.dataset.showState = show;
        caption.textContent = copy[show][lang];
        if (show === 'dance')
            feedback.textContent = copy.rescue[lang];
    }
    function syncPhase() {
        const { phase } = state;
        const done = phase === 'delivered';
        room.dataset.micState = phase;
        heading.textContent = copy[phase][lang];
        timing.hidden = done;
        carried.hidden = phase !== 'carrying';
        inventory.hidden = carried.hidden;
        onstage.hidden = !done;
        guest.hidden = !done;
        result.hidden = !done;
        canvas.inert = done;
        feed.setAttribute('aria-label', (done ? copy.singing : copy.dancing)[lang]);
        pins.forEach(pin => { pin.hidden = done; });
        updateClock();
        syncPositions();
        if (done && artworkReady)
            engine?.setPaused(true);
    }
    function place(node, point) {
        const camera = engine?.getCamera();
        if (!camera)
            return;
        const { x, y } = worldToCamera(point, camera);
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
    }
    function syncPositions() {
        if (!engine)
            return;
        const position = engine.getPosition();
        place(prop, casePosition);
        place(guest, wingPosition);
        if (!carried.hidden)
            place(carried, { x: position.x + 42, y: position.y - 101 });
        for (const pin of pins) {
            const id = pin.dataset.micObject;
            if (!id)
                continue;
            const marker = engine.getHotspotScreenPosition(id);
            if (marker) {
                pin.style.left = `${marker.x}px`;
                pin.style.top = `${marker.y}px`;
            }
            pin.toggleAttribute('data-mic-target', engine.getTargetHotspot() === id);
        }
    }
    function interact(id) {
        if (state.phase === 'delivered')
            return;
        if (id === 'shelf')
            feedback.textContent = (state.phase === 'search' ? copy.shelfClue : copy.emptyCase)[lang];
        if (id === 'case') {
            const found = state.phase === 'search';
            if (found) {
                state = { ...state, phase: 'carrying' };
                save(state);
                syncPhase();
                worldAudio.cue('spotlight');
            }
            feedback.textContent = (found ? copy.took : copy.emptyCase)[lang];
        }
        if (id === 'wing') {
            if (state.phase !== 'carrying') {
                feedback.textContent = copy.emptyHands[lang];
                return;
            }
            state = { ...state, phase: 'delivered' };
            save(state);
            syncPhase();
            feedback.textContent = copy.thanks[lang];
            worldAudio.cue('delivery');
            get('[data-act="manager-concert"]').focus({ preventScroll: true });
        }
    }
    const art = [scene.background, manager.image].map(src => {
        const image = doc.createElement('img');
        image.src = src;
        return image.decode();
    });
    // Reveal the canvas on a drawn frame once its two assets have settled.
    void Promise.allSettled(art).then(() => { artworkReady = true; });
    engine = createWorldEngine({
        canvas, scene: { ...scene, spawn: state.phase === 'delivered' ? spots[2].approach : scene.spawn }, player: manager,
        onInteract: interact, onStep: () => worldAudio.cue('step'),
        onFrame: () => {
            if (artworkReady && !canvas.hasAttribute('data-mic-painted')) {
                canvas.setAttribute('data-mic-painted', '');
                if (state.phase === 'delivered')
                    engine?.setPaused(true);
            }
            syncPositions();
        },
        onAssetError: () => { feedback.textContent = copy.assetError[lang]; },
    });
    for (const pin of pins) {
        pin.addEventListener('click', () => {
            if (pin.dataset.micObject)
                engine?.moveToHotspot(pin.dataset.micObject);
        }, listener);
    }
    const enterAudio = () => { void worldAudio.enter(); };
    board.addEventListener('pointerdown', enterAudio, { ...listener, capture: true });
    board.addEventListener('keydown', enterAudio, { ...listener, capture: true });
    const visibility = () => {
        board.toggleAttribute('data-mic-paused', doc.hidden);
        updateClock();
    };
    doc.addEventListener('visibilitychange', visibility, listener);
    const ticker = view.setInterval(updateClock, 200);
    syncPhase();
    visibility();
    return () => {
        controller.abort();
        view.clearInterval(ticker);
        engine?.destroy();
        worldAudio.exit();
    };
}
