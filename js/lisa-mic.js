import { line } from './story.js';
import { dressedFigure, travelLook } from './travel-look.js';
const saveKey = 'seoul-encore:lisa-mic:v1';
const moveCount = 6;
const beatMs = 720;
const tolerance = 170;
const countIn = 2 * beatMs;
const handoffMs = 1250;
const copy = {
    intro: line('Mikrofon kayıp!', 'Микрофон пропал!'),
    introDetail: line('Konsere iki dakika var. Lisa dansa başlasın, menajer yedeği bulsun!', 'До концерта две минуты. Лиса начнёт танцевать, пока менеджер ищет запасной!'),
    enter: line('Sahneye çık', 'Выйти на сцену'),
    loading: line('Sahne hazırlanıyor…', 'Сцена готовится…'),
    dance: line('Lisa ile dans et', 'Танцуй с Лисой'),
    danceDetail: line('Nota parlak çizgiye gelince dokun.', 'Коснись кнопки, когда нота дойдёт до светлой линии.'),
    danceRelaxed: line('Her dokunuşta yeni bir dans adımı yap.', 'Одно нажатие — одно новое движение.'),
    tap: line('Ritme dokun', 'Нажми в такт'),
    step: line('Sonraki adım', 'Следующее движение'),
    resume: line('Dansı sürdür', 'Продолжить танец'),
    ready: line('Hazır ol…', 'Приготовься…'),
    miss: line('Sonraki vuruşu dene.', 'Попробуй на следующем ударе.'),
    moveProgress: line('Dans adımları', 'Движения танца'),
    access: line('Zamanlamasız mod', 'Режим без тайминга'),
    handoff: line('Menajer geliyor!', 'Менеджер уже идёт!'),
    handoffDetail: line('Yedek mikrofonu sahneye getiriyor.', 'Она несёт на сцену запасной микрофон.'),
    offered: line('Mikrofon hazır', 'Микрофон готов'),
    offeredDetail: line('Menajerin uzattığı mikrofona dokun.', 'Коснись микрофона в руке менеджера.'),
    take: line('Mikrofonu al', 'Взять микрофон'),
    taken: line('Mikrofon Lisa’da!', 'Микрофон у Лисы!'),
    takenDetail: line('Şimdi vokal zamanı.', 'Пора петь.'),
    sing: line('Şarkıya başla', 'Начать петь'),
};
const moves = [
    line('Sola adım', 'Шаг влево'), line('Çapraz adım', 'Шаг крестом'),
    line('Sıçra', 'Прыжок'), line('Dönüş', 'Поворот'),
    line('Kayarak adım', 'Шаг со скольжением'), line('Final pozu', 'Финальная поза'),
];
function readSave() {
    try {
        const raw = localStorage.getItem(saveKey);
        if (!raw)
            return null;
        const stored = JSON.parse(raw);
        if (!stored)
            return null;
        const { phase, hits, relaxed } = stored;
        if (typeof hits !== 'number' || !Number.isInteger(hits) || hits < 0 || hits > moveCount || typeof relaxed !== 'boolean')
            return null;
        if ((phase === 'intro' && hits === 0) || (phase === 'dance' && hits < moveCount) ||
            ((phase === 'handoff' || phase === 'offered' || phase === 'taken') && hits === moveCount)) {
            return { phase, hits, relaxed };
        }
    }
    catch { /* Tarayıcı kayıt izni vermezse ilerleme bellekte tutulur. */ }
    return null;
}
let saved = readSave();
const initial = { phase: 'intro', hits: 0, relaxed: false };
let soundEnabled;
let syncSound;
function save(next) {
    saved = next;
    try {
        if (next)
            localStorage.setItem(saveKey, JSON.stringify(next));
        else
            localStorage.removeItem(saveKey);
    }
    catch { /* Açık oyun oturumunda ilerleme bellekte tutulur. */ }
}
export function resetLisaMic() { save(null); }
export function lisaMicTaken() { return saved?.phase === 'taken'; }
export function setLisaMicSoundEnabled(enabled) {
    soundEnabled = enabled;
    syncSound?.(enabled);
}
function readSound() {
    if (soundEnabled !== undefined)
        return soundEnabled;
    try {
        return localStorage.getItem('encore1.sound') !== 'off';
    }
    catch {
        return true;
    }
}
const micIcon = '<span class="lisa-mic-prop" aria-hidden="true"><i></i><b></b></span>';
function detail(state, lang) {
    if (state.phase === 'dance')
        return copy[state.relaxed ? 'danceRelaxed' : 'danceDetail'][lang];
    return copy[`${state.phase}Detail`][lang];
}
export function renderLisaMic(lang) {
    const state = saved ?? initial;
    const { phase, hits, relaxed } = state;
    const look = travelLook('Lisa');
    if (!look)
        throw new Error('Missing Lisa travel look');
    return `<section class="lisa-mic" data-lisa-mic data-lisa-phase="${phase}" data-lisa-relaxed="${relaxed}" aria-labelledby="lisa-mic-title">
    <div class="lisa-mic-heading">
      <h2 id="lisa-mic-title">${copy[phase][lang]}</h2><p data-lisa-description>${detail(state, lang)}</p>
    </div>
    <div class="lisa-mic-stage">
      <img class="lisa-mic-arena" src="art/mainstage.webp" alt="" decoding="async" draggable="false">
      <div class="lisa-mic-lights" aria-hidden="true"></div>
      <div class="lisa-mic-curtains" aria-hidden="true"></div>
      <span class="lisa-mic-clock" aria-hidden="true">02:00</span>
      <div class="lisa-mic-performer" aria-hidden="true" data-lisa-performer>
        <span class="lisa-mic-shadow"></span>
        <div class="lisa-mic-lisa" data-lisa-dancer>${dressedFigure(look)}${micIcon}</div>
      </div>
      <div class="lisa-mic-manager" data-lisa-manager aria-hidden="true">
        <span class="lisa-mic-shadow"></span>
        <span class="lisa-mic-manager-sprite"><img src="art/walk/cast-manager.webp" alt="" decoding="async" draggable="false"></span>
        <span class="lisa-mic-arm"></span>
        <span class="lisa-mic-carried">${micIcon}</span>
      </div>
      <button type="button" class="lisa-mic-take" data-lisa-take ${phase === 'offered' ? '' : 'hidden'}>${micIcon}<span>${copy.take[lang]}</span></button>
      <div class="lisa-mic-move" data-lisa-move aria-live="off" hidden></div>
    </div>
    <div class="lisa-mic-controls">
      <button type="button" class="lisa-mic-action" data-lisa-enter ${phase === 'intro' ? '' : 'hidden'}><span data-lisa-enter-label>${copy.enter[lang]}</span><span aria-hidden="true">↗</span></button>
      <div data-lisa-dance ${phase === 'dance' ? '' : 'hidden'}>
        <div class="lisa-mic-progress" role="group" aria-label="${copy.moveProgress[lang]}">
          <div class="lisa-mic-marks" aria-hidden="true">${moves.map((_, index) => `<span ${index < hits ? 'data-lisa-done' : ''}></span>`).join('')}</div>
          <span><b data-lisa-count>${hits}</b> / ${moveCount}</span>
        </div>
        <div class="lisa-mic-track" data-lisa-track aria-hidden="true">
          <span class="lisa-mic-target"></span><span class="lisa-mic-strike"></span>
          <span class="lisa-mic-note"></span><span class="lisa-mic-note"></span><span class="lisa-mic-note"></span>
        </div>
        <div class="lisa-mic-pad-row">
          <button type="button" class="lisa-mic-action lisa-mic-pad" data-lisa-tap>${copy.resume[lang]}</button>
          <button type="button" class="lisa-mic-access" data-lisa-access aria-pressed="${relaxed}">${copy.access[lang]}</button>
        </div>
      </div>
      <button type="button" class="lisa-mic-action" data-lisa-continue ${phase === 'taken' ? 'data-act="lisa-sing"' : 'hidden'}>${copy.sing[lang]} <span aria-hidden="true">↗</span></button>
      <p class="lisa-mic-status" data-lisa-status role="status"></p>
    </div>
  </section>`;
}
function danceLoop(context) {
    const sampleRate = 22050;
    const samplesPerBeat = Math.round(sampleRate * beatMs / 1000);
    const buffer = context.createBuffer(1, samplesPerBeat * 8, sampleRate);
    const samples = buffer.getChannelData(0);
    const notes = [55, 55, 62, 67, 52, 52, 60, 64];
    let seed = 101;
    for (const [beat, note] of notes.entries()) {
        const fundamental = 440 * 2 ** ((note - 69) / 12);
        for (let i = 0; i < samplesPerBeat; i++) {
            const time = i / sampleRate;
            seed = Math.imul(seed, 1664525) + 1013904223 | 0;
            const noise = seed / 2147483648;
            const ramp = Math.min(1, time / .005);
            const kickPhase = 2 * Math.PI * (55 * time + 1.7 * (1 - Math.exp(-45 * time)));
            const kick = .45 * Math.sin(kickPhase) * Math.exp(-17 * time);
            const bassPhase = 2 * Math.PI * fundamental * time;
            const bass = (.13 * Math.sin(bassPhase) + .048 * Math.sin(2 * bassPhase)) * Math.exp(-6 * time);
            const tick = time - beatMs / 2000;
            const hat = tick < 0 ? 0 : .13 * noise * Math.min(1, tick / .002) * Math.exp(-60 * tick);
            const clap = beat % 2 === 1 ? .15 * noise * Math.exp(-28 * time) : 0;
            const end = Math.min(1, (samplesPerBeat - 1 - i) / 180);
            samples[beat * samplesPerBeat + i] = ((kick + bass + clap) * ramp + hat) * end;
        }
    }
    return buffer;
}
function createDanceAudio(now) {
    let context;
    let buffer;
    let source;
    let version = 0;
    function stop() {
        version++;
        source?.stop();
        source?.disconnect();
        source = undefined;
    }
    async function start(origin) {
        stop();
        const pending = version;
        if (typeof AudioContext === 'undefined')
            return;
        try {
            const audio = context ?? (context = new AudioContext());
            await audio.resume();
            if (pending !== version || audio.state !== 'running')
                return;
            const loop = buffer ?? (buffer = danceLoop(audio));
            const lead = .028;
            const delay = (now() - origin) / 1000 + lead;
            const next = audio.createBufferSource();
            next.buffer = loop;
            next.loop = true;
            next.connect(audio.destination);
            next.start(audio.currentTime + lead + Math.max(0, -delay), Math.max(0, delay) % loop.duration);
            source = next;
        }
        catch (error) {
            if (pending === version)
                console.warn('Lisa dans ritmi sesi kullanılamadı.', error);
        }
    }
    function close() {
        stop();
        if (context && context.state !== 'closed')
            void context.close().catch(() => { });
    }
    return { start, stop, close };
}
export function mountLisaMic(root, lang) {
    const scene = root.matches('[data-lisa-mic]') ? root : root.querySelector('[data-lisa-mic]');
    if (!scene)
        throw new Error('Missing Lisa microphone scene');
    const board = scene;
    const doc = board.ownerDocument;
    const view = doc.defaultView;
    if (!view)
        throw new Error('The Lisa microphone scene requires a browser window');
    const win = view;
    function get(selector) {
        const element = board.querySelector(selector);
        if (!element)
            throw new Error(`Missing Lisa microphone scene element ${selector}`);
        return element;
    }
    const controller = new AbortController();
    const listener = { signal: controller.signal };
    const title = get('#lisa-mic-title');
    const description = get('[data-lisa-description]');
    const enter = get('[data-lisa-enter]');
    const enterLabel = get('[data-lisa-enter-label]');
    const dance = get('[data-lisa-dance]');
    const pad = get('[data-lisa-tap]');
    const access = get('[data-lisa-access]');
    const take = get('[data-lisa-take]');
    const next = get('[data-lisa-continue]');
    const status = get('[data-lisa-status]');
    const count = get('[data-lisa-count]');
    const dancer = get('[data-lisa-dancer]');
    const move = get('[data-lisa-move]');
    const manager = get('[data-lisa-manager]');
    const marks = Array.from(board.querySelectorAll('.lisa-mic-marks span'));
    const notes = Array.from(board.querySelectorAll('.lisa-mic-note'));
    const art = Array.from(board.querySelectorAll('img'));
    const sound = createDanceAudio(() => win.performance.now());
    let state = saved ?? initial;
    let origin = null;
    let lastHit = -1;
    let lastPress = null;
    let handoffElapsed = 0;
    let lastFrame = null;
    let frame = 0;
    let artReady = art.every(image => image.complete);
    let artTimer = 0;
    function changeState(nextState) {
        state = nextState;
        save(state);
    }
    function showState() {
        const { phase, hits, relaxed } = state;
        board.dataset.lisaPhase = phase;
        board.dataset.lisaRelaxed = String(relaxed);
        title.textContent = copy[phase][lang];
        description.textContent = detail(state, lang);
        enter.hidden = phase !== 'intro';
        dance.hidden = phase !== 'dance';
        take.hidden = phase !== 'offered';
        next.hidden = phase !== 'taken';
        if (phase === 'taken')
            next.dataset.act = 'lisa-sing';
        for (const button of [enter, pad, access, take])
            button.disabled = !artReady;
        board.toggleAttribute('data-lisa-loading', !artReady);
        enterLabel.textContent = copy[artReady ? 'enter' : 'loading'][lang];
        count.textContent = String(hits);
        marks.forEach((mark, index) => mark.toggleAttribute('data-lisa-done', index < hits));
        access.setAttribute('aria-pressed', String(relaxed));
        pad.textContent = copy[!artReady ? 'loading' : origin === null ? 'resume' : relaxed ? 'step' : 'tap'][lang];
        board.toggleAttribute('data-lisa-running', origin !== null);
    }
    function visibleWindow(now) {
        const elapsed = now - (origin ?? now) - countIn;
        const beat = Math.round(elapsed / beatMs);
        const timing = elapsed - beat * beatMs;
        const open = origin !== null && beat >= 0 && Math.abs(timing) <= tolerance && beat > lastHit;
        return { elapsed, beat, open };
    }
    function drawTrack(now) {
        const { elapsed, beat, open } = visibleWindow(now);
        board.toggleAttribute('data-lisa-beat-window', open && state.phase === 'dance' && !state.relaxed);
        pad.dataset.lisaBeatIndex = open ? String(beat) : '';
        if (open && status.textContent === copy.ready[lang]) {
            status.textContent = '';
            delete status.dataset.lisaCue;
        }
        const nearest = Math.max(0, beat);
        for (const [index, note] of notes.entries()) {
            const target = nearest + index - 1;
            note.hidden = target < 0 || origin === null || state.relaxed;
            const position = 34 + (target * beatMs - elapsed) / beatMs * 55;
            note.style.left = `${position}%`;
            note.toggleAttribute('data-lisa-note-hit', target === lastHit);
        }
    }
    function drawManager() {
        const progress = Math.min(1, handoffElapsed / handoffMs);
        manager.style.setProperty('--lisa-manager-x', `${107 - 32 * (1 - (1 - progress) ** 1.45)}%`);
        manager.style.setProperty('--lisa-manager-frame', `${Math.floor(handoffElapsed / 135) % 4 * -100}%`);
    }
    function tick(now) {
        frame = 0;
        if (doc.hidden)
            return;
        if (state.phase === 'dance' && origin !== null && !state.relaxed)
            drawTrack(now);
        if (state.phase === 'handoff') {
            handoffElapsed += Math.max(0, now - (lastFrame ?? now));
            lastFrame = now;
            drawManager();
            if (handoffElapsed >= handoffMs) {
                changeState({ ...state, phase: 'offered' });
                showState();
                status.textContent = copy.offeredDetail[lang];
                take.focus({ preventScroll: true });
            }
        }
        queueFrame();
    }
    function queueFrame() {
        const needsAnimation = state.phase === 'handoff' || (state.phase === 'dance' && origin !== null && !state.relaxed);
        if (!frame && artReady && !doc.hidden && needsAnimation)
            frame = win.requestAnimationFrame(tick);
    }
    function playSound(enabled) {
        if (enabled && origin !== null && !doc.hidden)
            void sound.start(origin);
        else
            sound.stop();
    }
    function beginDance(now) {
        origin = now;
        lastHit = -1;
        lastPress = null;
        showState();
        drawTrack(now);
        status.textContent = state.relaxed ? '' : copy.ready[lang];
        status.toggleAttribute('data-lisa-cue', !state.relaxed);
        playSound(readSound());
        queueFrame();
    }
    function showMove() {
        const name = moves[state.hits - 1]?.[lang] ?? '';
        dancer.dataset.lisaMove = String(state.hits);
        move.hidden = false;
        move.textContent = name;
        status.textContent = name;
        delete status.dataset.lisaCue;
    }
    function hit(now) {
        if (!artReady || doc.hidden || state.phase !== 'dance')
            return;
        if (origin === null) {
            beginDance(now);
            return;
        }
        const { beat, open } = visibleWindow(now);
        if (!state.relaxed && !open) {
            if (beat !== lastHit || beat < 0) {
                status.textContent = copy.miss[lang];
                status.setAttribute('data-lisa-cue', '');
            }
            return;
        }
        if (lastPress !== null && now - lastPress < 120)
            return;
        lastPress = now;
        lastHit = beat;
        const hits = state.hits + 1;
        changeState({ ...state, hits, phase: hits === moveCount ? 'handoff' : 'dance' });
        showMove();
        if (state.phase !== 'dance') {
            origin = null;
            lastFrame = now;
            sound.stop();
            queueFrame();
        }
        showState();
        drawTrack(now);
    }
    enter.addEventListener('click', () => {
        if (!artReady || doc.hidden || state.phase !== 'intro')
            return;
        changeState({ ...state, phase: 'dance' });
        beginDance(win.performance.now());
        pad.focus({ preventScroll: true });
    }, listener);
    pad.addEventListener('pointerdown', event => {
        if (event.isPrimary && event.button === 0 && !state.relaxed)
            hit(win.performance.now());
    }, listener);
    pad.addEventListener('click', event => {
        if (state.relaxed || event.detail === 0)
            hit(win.performance.now());
    }, listener);
    pad.addEventListener('keydown', event => {
        if (event.repeat && (event.key === ' ' || event.key === 'Enter'))
            event.preventDefault();
    }, listener);
    access.addEventListener('click', () => {
        if (!artReady || doc.hidden || state.phase !== 'dance')
            return;
        changeState({ ...state, relaxed: !state.relaxed });
        beginDance(win.performance.now());
        pad.focus({ preventScroll: true });
    }, listener);
    take.addEventListener('click', () => {
        if (!artReady || doc.hidden || state.phase !== 'offered')
            return;
        changeState({ ...state, phase: 'taken' });
        showState();
        take.dataset.act = 'lisa-sing';
        next.focus({ preventScroll: true });
    }, listener);
    function pause() {
        if (frame)
            win.cancelAnimationFrame(frame);
        frame = 0;
        lastFrame = null;
        origin = null;
        sound.stop();
        status.textContent = '';
        delete status.dataset.lisaCue;
        drawTrack(win.performance.now());
        showState();
    }
    doc.addEventListener('visibilitychange', () => {
        board.toggleAttribute('data-lisa-paused', doc.hidden);
        if (doc.hidden)
            pause();
        else
            queueFrame();
    }, listener);
    win.addEventListener('pagehide', pause, listener);
    win.addEventListener('pageshow', queueFrame, listener);
    function revealArt() {
        if (artReady)
            return;
        win.clearTimeout(artTimer);
        artReady = true;
        showState();
        queueFrame();
    }
    if (!artReady) {
        const onArt = () => { if (art.every(image => image.complete))
            revealArt(); };
        for (const image of art) {
            image.addEventListener('load', onArt, listener);
            image.addEventListener('error', onArt, listener);
        }
        // The rhythm remains playable if the connection cannot deliver the artwork.
        artTimer = win.setTimeout(revealArt, 1500);
    }
    syncSound = playSound;
    showState();
    drawTrack(win.performance.now());
    drawManager();
    queueFrame();
    return () => {
        controller.abort();
        win.clearTimeout(artTimer);
        if (frame)
            win.cancelAnimationFrame(frame);
        if (syncSound === playSound)
            syncSound = undefined;
        sound.close();
    };
}
