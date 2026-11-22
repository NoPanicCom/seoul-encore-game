import { studioTravelSelection } from './studio.js';
import { drawTravelLook, loadTravelLook, travelLook } from './travel-look.js';
import { worldAudio } from './world-audio.js';
import { createWorldEngine } from './world-engine.js';
const say = (phrase, lang) => phrase[lang === 'tr' ? 0 : 1];
const names = {
    jisoo: ['Jisoo', 'Джису'],
    jennie: ['Jennie', 'Дженни'],
    rose: ['Rosé', 'Розэ'],
    lisa: ['Lisa', 'Лиса'],
};
const copy = {
    title: ['Hongdae', 'Хондэ'],
    wardrobe: ['Kıyafet', 'Наряд'],
    canvas: ['Hongdae sokağı', 'Улица в Хондэ'],
    guide: ['Yere dokun veya yön kolunu sürükle.', 'Коснись земли или потяни джойстик.'],
    move: ['Yön kolu', 'Джойстик'],
    places: ['Sokaktaki yerler', 'Места на улице'],
    recordsPlayed: ['Hongdae ezgisini buldun! Fotokabinde plak çerçevesi açıldı.', 'Ты нашла мелодию Хондэ! В фотобудке открылась рамка с пластинками.'],
    assetIssue: ['Bir sokak görseli yüklenemedi.', 'Не удалось загрузить изображение улицы.'],
};
const destinations = {
    back: { label: ['Kulis', 'Гримёрка'], action: ['Kulise dön', 'В гримёрку'], icon: '↶' },
    records: { label: ['Plakçı', 'Пластинки'], action: ['Ezgi çal', 'Сыграть мелодию'], icon: '♫' },
    booth: { label: ['Fotokabin', 'Фотобудка'], action: ['Fotokabine gir', 'Войти в фотобудку'], icon: '▣' },
};
const stops = ['back', 'records', 'booth'];
const isDestination = (id) => stops.some(stop => stop === id);
export const hongdaeScene = {
    width: 1440,
    height: 960,
    background: 'art/world/hongdae.webp',
    walkable: { x: 20, y: 594, width: 1400, height: 336 },
    obstacles: [],
    spawn: { x: 900, y: 725 },
    hotspots: [
        {
            id: 'back', position: { x: 142, y: 580 }, marker: { x: 142, y: 306 },
            hitbox: { x: 78, y: 223, width: 146, height: 357 },
            approach: { x: 142, y: 622 }, radius: 56,
        },
        {
            id: 'records', position: { x: 674, y: 580 }, marker: { x: 674, y: 292 },
            hitbox: { x: 265, y: 242, width: 751, height: 338 },
            approach: { x: 674, y: 622 }, radius: 62,
        },
        {
            id: 'booth', position: { x: 1224, y: 580 }, marker: { x: 1224, y: 199 },
            hitbox: { x: 1018, y: 205, width: 343, height: 375 },
            approach: { x: 1224, y: 626 }, radius: 55,
        },
    ],
};
const visits = new Map();
const melodies = new Set();
const melodyKey = (member) => `encore1.hongdae.melody.${member}`;
export function hasHongdaeMelody(member) {
    if (melodies.has(member))
        return true;
    try {
        return typeof localStorage !== 'undefined' && localStorage.getItem(melodyKey(member)) === '1';
    }
    catch {
        return false;
    }
}
function rememberMelody(member) {
    melodies.add(member);
    try {
        localStorage.setItem(melodyKey(member), '1');
    }
    catch { /* The current visit can still use the melody. */ }
}
function appearance(member) {
    return {
        image: `art/world/${member}.webp`, width: 151, height: 189, speed: 370,
        sheet: { frameWidth: 128, frameHeight: 160, rows: { south: 0, west: 1, north: 2 },
            idleColumn: 0, walkColumns: [1, 2, 3], anchor: { x: 64, y: 150 } },
    };
}
function destinationButton(id, lang, marker) {
    const item = destinations[id];
    const label = say(item.label, lang);
    return `<button type="button" class="hongdae-stop" data-hongdae-go="${id}"${marker ? ' data-hongdae-marker hidden' : ''}>
    <span aria-hidden="true">${item.icon}</span><span>${label}</span>
  </button>`;
}
export function renderHongdae(lang, member) {
    return `<section class="hongdae-shell" aria-labelledby="hongdae-title">
    <div class="hongdae-heading">
      <h2 id="hongdae-title">${say(copy.title, lang)}</h2>
      <button type="button" class="hongdae-cast" data-hongdae-action="wardrobe">
        <img src="art/world/hero-${member}.webp" alt="" width="36" height="36">
        <span><strong>${say(names[member], lang)}</strong><small>${say(copy.wardrobe, lang)}</small></span>
        <span aria-hidden="true">›</span>
      </button>
    </div>
    <div class="hongdae-board" data-hongdae-board>
      <canvas tabindex="0" data-hongdae-canvas aria-label="${say(copy.canvas, lang)}" aria-describedby="hongdae-guide"></canvas>
      <div class="hongdae-markers">${stops.map(id => destinationButton(id, lang, true)).join('')}</div>
      <div class="hongdae-controls">
        <div class="world-stick" aria-label="${say(copy.move, lang)}" data-hongdae-stick><span aria-hidden="true">＋</span><i data-hongdae-thumb></i></div>
        <button class="hongdae-interact" type="button" data-hongdae-action="interact" hidden></button>
      </div>
    </div>
    <nav class="hongdae-destinations" aria-label="${say(copy.places, lang)}">${stops.map(id => destinationButton(id, lang, false)).join('')}</nav>
    <p class="hongdae-guide" id="hongdae-guide">${say(copy.guide, lang)}</p>
    <p class="hongdae-status" data-hongdae-status role="status"></p>
    <p class="hongdae-status" data-hongdae-error role="status" hidden>${say(copy.assetIssue, lang)}</p>
  </section>`;
}
export function mountHongdae(lang, member, onAction) {
    const root = document.querySelector('.hongdae-shell');
    if (!root)
        throw new Error('Hongdae view must be rendered before mounting');
    const board = requireControl(root, '[data-hongdae-board]');
    const canvas = requireControl(root, '[data-hongdae-canvas]');
    const stick = requireControl(root, '[data-hongdae-stick]');
    const thumb = requireControl(root, '[data-hongdae-thumb]');
    const interact = requireControl(root, '[data-hongdae-action="interact"]');
    const status = requireControl(root, '[data-hongdae-status]');
    const warning = requireControl(root, '[data-hongdae-error]');
    const signals = new AbortController();
    const listener = { signal: signals.signal };
    const markers = Array.from(root.querySelectorAll('[data-hongdae-marker]'));
    const previous = visits.get(member);
    const scene = { ...hongdaeScene, spawn: previous?.player ?? hongdaeScene.spawn };
    const pixelSpawn = previous?.pixel ?? { x: hongdaeScene.spawn.x - 82, y: hongdaeScene.spawn.y + 27 };
    const player = appearance(member);
    let active = true;
    let recordTimers = [];
    let sound = true;
    try {
        sound = window.localStorage.getItem('encore1.sound') !== 'off';
    }
    catch {
        sound = false;
    }
    worldAudio.setEnabled(sound);
    function playRecords() {
        recordTimers.forEach(timer => window.clearTimeout(timer));
        board.dataset.hongdaePlaying = 'true';
        status.textContent = say(copy.recordsPlayed, lang);
        rememberMelody(member);
        const melody = [0, 2, 1, 2];
        recordTimers = melody.map((note, index) => window.setTimeout(() => worldAudio.note(note), index * 150));
        recordTimers.push(window.setTimeout(() => {
            delete board.dataset.hongdaePlaying;
            recordTimers = [];
        }, 1100));
    }
    const engine = createWorldEngine({
        canvas, scene, player,
        companion: {
            spawn: pixelSpawn,
            followDistance: 81, width: 73, height: 73, speed: 385, image: 'art/world/pixel.webp',
            sheet: { frameWidth: 96, frameHeight: 96, rows: { south: 0 }, idleColumn: 0, walkColumns: [1, 2, 3, 2],
                anchor: { x: 48, y: 88 } },
        },
        joystick: { base: stick, thumb },
        onFrame: updateMarkers,
        onStep: () => worldAudio.cue('step'),
        onInteract: id => {
            if (id === 'records') {
                engine.pulseHotspot(id);
                playRecords();
            }
            else if (id === 'booth' || id === 'back') {
                onAction(id, member);
            }
        },
        onProximityChange: id => {
            board.dataset.hongdaeNear = id ?? '';
            interact.hidden = id === null;
            if (id && isDestination(id))
                interact.textContent = say(destinations[id].action, lang);
        },
        onAssetError: () => { warning.hidden = false; },
    });
    const look = studioTravelSelection(member) ? travelLook(member) : null;
    if (look) {
        void loadTravelLook(look).then(loaded => {
            if (!active)
                return;
            engine.setAppearance({
                ...player,
                draw: (context, { height }, direction) => drawTravelLook(context, loaded, 0, 0, height, direction === 'west' ? -1 : 1),
            });
        }).catch(() => { if (active)
            warning.hidden = false; });
    }
    function updateMarkers() {
        const current = engine.getPosition();
        const pet = engine.getCompanionPosition();
        const camera = engine.getCamera();
        const { clientWidth: width, clientHeight: height } = canvas;
        setData(board, 'playerX', current.x);
        setData(board, 'playerY', current.y);
        if (pet) {
            setData(board, 'pixelX', pet.x);
            setData(board, 'pixelY', pet.y);
        }
        setData(board, 'cameraX', camera.x);
        setData(board, 'cameraY', camera.y);
        setData(board, 'cameraScale', camera.scale, 5);
        const topLimit = 24;
        const bottomLimit = height - 110;
        for (const marker of markers) {
            const id = marker.dataset.hongdaeGo ?? '';
            const spot = engine.getHotspotScreenPosition(id);
            const facade = scene.hotspots.find(hotspot => hotspot.id === id)?.hitbox;
            const facadeTop = facade ? (facade.y - camera.y) * camera.scale : height;
            const facadeBottom = facade ? (facade.y + facade.height - camera.y) * camera.scale : 0;
            const shown = Boolean(spot && spot.x >= -45 && spot.x <= width + 45
                && facadeBottom >= topLimit && facadeTop <= bottomLimit);
            if (marker.hidden === shown)
                marker.hidden = !shown;
            if (!spot || !shown)
                continue;
            // When the camera cuts off the booth sign, keep its curtain clear for a direct tap.
            const pinX = id === 'booth' && facade && spot.y < 0 ? (facade.x + 16 - camera.x) * camera.scale : spot.x;
            const x = Math.round(Math.min(width - 61, Math.max(61, pinX)));
            const y = Math.round(Math.min(bottomLimit, Math.max(topLimit, spot.y)));
            const transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
            if (marker.style.transform !== transform)
                marker.style.transform = transform;
        }
    }
    function enterAudio() { if (sound)
        void worldAudio.enter(); }
    root.addEventListener('pointerdown', enterAudio, { ...listener, capture: true });
    root.addEventListener('click', enterAudio, { ...listener, capture: true });
    root.addEventListener('keydown', enterAudio, { ...listener, capture: true });
    root.addEventListener('click', event => {
        const target = event.target instanceof Element ? event.target.closest('button') : null;
        if (!target)
            return;
        const { hongdaeAction, hongdaeGo } = target.dataset;
        if (hongdaeAction === 'wardrobe')
            onAction('wardrobe', member);
        else if (hongdaeAction === 'interact')
            engine.interact();
        else if (hongdaeGo && isDestination(hongdaeGo)) {
            canvas.focus({ preventScroll: true });
            engine.moveToHotspot(hongdaeGo);
        }
    }, listener);
    updateMarkers();
    canvas.focus({ preventScroll: true });
    return () => {
        active = false;
        const pixel = engine.getCompanionPosition();
        if (pixel)
            visits.set(member, { player: engine.getPosition(), pixel });
        signals.abort();
        recordTimers.forEach(timer => window.clearTimeout(timer));
        engine.destroy();
        worldAudio.exit();
    };
}
function requireControl(root, selector) {
    const control = root.querySelector(selector);
    if (!control)
        throw new Error(`Hongdae view is missing ${selector}`);
    return control;
}
function setData(node, key, value, decimals = 2) {
    const text = value.toFixed(decimals);
    if (node.dataset[key] !== text)
        node.dataset[key] = text;
}
