import { createWorldEngine } from './world-engine.js';
import { worldAudio } from './world-audio.js';
import { stickName } from './lightstick.js';
const titles = {
    street: ['Улица в Сеуле', 'Seul sokağı'], hall: ['Холл YG', 'YG koridoru'], dance: ['Танцзал', 'Dans odası'],
    studio: ['Студия звука', 'Ses stüdyosu'], plaza: ['Площадь арены', 'Arena meydanı'], hotel: ['Номер Софии', 'Sofia’nın otel odası'],
};
function door(id, label, x, foot = 525, sign = 380) {
    return { id, label, position: { x, y: foot }, approach: { x, y: foot }, marker: { x, y: sign }, radius: 63,
        hitbox: { x: x - 72, y: sign - 56, width: 144, height: foot - sign + 92 } };
}
function tile(id, label, x, y) {
    return { ...door(id, label, x, y, y), radius: 40, hitbox: { x: x - 55, y: y - 38, width: 110, height: 76 } };
}
const street = ['На улицу', 'Sokağa çık'];
const hall = ['В холл', 'Koridora çık'];
const rooms = {
    street: [door('hotel', ['Отель', 'Otel'], 150), door('hall', ['YG Entertainment', 'YG Entertainment'], 620), door('plaza', ['К арене →', 'Arena yolu →'], 1110, 610, 470)],
    hall: [door('street', street, 90, 623, 485), door('dance', titles.dance, 365), door('studio', titles.studio, 925)],
    dance: [door('hall', hall, 55, 565, 420), tile('pad0', ['←', '←'], 425, 625), tile('pad1', ['★', '★'], 640, 560), tile('pad2', ['→', '→'], 850, 650)],
    studio: [door('hall', hall, 108, 580, 430), door('mix', ['Синтезатор', 'Synth çal'], 810, 555, 438)],
    plaza: [door('street', street, 100, 620, 480), { ...door('merch', ['Лайтстики', 'Lightstick standı'], 445, 585, 376), image: 'art/walk/stand.webp', size: { width: 208, height: 213 } }, door('gate', ['Вход на концерт', 'Konser girişi'], 1010, 530, 345)],
    hotel: [door('street', street, 66, 560, 409), door('rest', ['Отдохнуть', 'Dinlen'], 894, 590, 449)],
};
const route = [0, 2, 1, 0, 2, 1];
const roomKey = (value) => Object.prototype.hasOwnProperty.call(titles, value);
const fresh = () => ({ room: 'street', days: 2, arrival: true, danced: false, step: 0, x: 505, y: 646 });
const key = 'encore1.sofia-walk.v1';
let memory;
function load() {
    let raw;
    try {
        raw = localStorage.getItem(key);
    }
    catch {
        return memory ?? fresh();
    }
    if (!raw)
        return memory ?? fresh();
    const [place, days, arrival, danced, step, x, y] = raw.split('|');
    if (!place || !roomKey(place) || !['0', '1', '2'].includes(days ?? '') || !['0', '1'].includes(arrival ?? '') || !['0', '1'].includes(danced ?? '') ||
        !/^[0-6]$/.test(step ?? '') || !x || !y || !Number.isFinite(Number(x)) || !Number.isFinite(Number(y)))
        return fresh();
    return { room: place, days: Number(days), arrival: arrival === '1', danced: danced === '1', step: Number(step), x: Math.max(26, Math.min(1174, Number(x))), y: Math.max(510, Math.min(754, Number(y))) };
}
function save(s) {
    memory = { ...s };
    try {
        localStorage.setItem(key, [s.room, s.days, +s.arrival, +s.danced, s.step, Math.round(s.x), Math.round(s.y)].join('|'));
    }
    catch { /* Keep progress in this tab. */ }
}
export function renderSeoulWalk() { return '<section class="walk-host"></section>'; }
export function mountSeoulWalk(lang, sound, chosen, equip, concert) {
    const root = document.querySelector('.walk-host');
    if (!root)
        throw new Error('Missing walking world');
    const host = root;
    const say = (words) => words[lang === 'ru' ? 0 : 1];
    const state = load();
    let equipped = chosen;
    let leaveRoom = () => { };
    let notice = '';
    const avatar = new Image();
    avatar.src = 'art/walk/sofia.webp';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    function renderRoom() {
        const room = state.room;
        const spots = rooms[room];
        const scene = { width: 1200, height: 800, background: 'art/walk/' + room + '.webp', spawn: { x: state.x, y: state.y }, walkable: { x: 25, y: 510, width: 1150, height: 245 }, obstacles: [], hotspots: spots };
        const day = () => state.days === 0 ? say(['Сегодня концерт', 'Bugün konser var']) : state.days === 1 ? say(['Концерт завтра', 'Konser yarın']) : say(['До концерта 2 дня', 'Konsere 2 gün var']);
        const tip = () => room === 'dance' ? (state.step === route.length ? say(['Связка готова!', 'Koreografi hazır!']) : say(['Наступай на сияющие метки', 'Parlayan işaretlere bas'])) :
            room === 'hall' ? say(['Дверь танцзала слева, студия справа.', 'Dans odası solda, ses stüdyosu sağda.']) :
                room === 'street' ? say(['Тяни джойстик или коснись тротуара. Вход в YG под вывеской.', 'Yön kolunu sürükle veya kaldırıma dokun. YG girişi tabelanın altında.']) :
                    room === 'plaza' ? say(['Подойди к воротам, чтобы попасть на концерт.', 'Konsere girmek için kapıya yürü.']) :
                        room === 'studio' ? say(['Найди синтезатор и сыграй мелодию.', 'Synth’in yanına yürü ve melodini çal.']) : say(['У кровати можно отдохнуть до следующего дня.', 'Yatağın yanına gidip ertesi güne geçebilirsin.']);
        host.innerHTML = `<div class="walk-title"><h2>${say(titles[room])}</h2><span data-day></span></div>
      <div class="walk-board hongdae-board" data-walk-room="${room}"><canvas tabindex="0" aria-label="${say(titles[room])}"></canvas>
      <div class="walk-pins">${spots.map(s => `<button class="walk-pin ${s.id.startsWith('pad') ? 'floor-pin' : ''}" data-walk-to="${s.id}" aria-label="${s.id.startsWith('pad') ? say(['Танцевальная метка', 'Dans işareti']) + ' ' : ''}${say(s.label)}">${say(s.label)}</button>`).join('')}</div>
      <div class="walk-bottom"><div class="world-stick" aria-label="${say(['Джойстик', 'Yön kolu'])}"><span aria-hidden="true">＋</span><i></i></div><button class="walk-use" hidden></button></div>
      <div class="walk-panel" hidden></div></div>
      <div class="walk-trail"><span>SOFIA</span><div class="trail-line"><i class="you-dot"></i>${spots.map(s => `<b style="left:${s.position.x / 12}%"></b>`).join('')}</div><span>✦</span></div>
      <p class="walk-tip" role="status"></p>
      ${room === 'dance' ? '<div class="dance-steps"></div>' : ''}
      ${state.arrival && room === 'street' ? `<button class="walk-arrival">${state.days === 2 ? say(['Начать за день до концерта', 'Konsere bir gün kala başla']) : say(['Начать за два дня', 'İki gün kala başla'])}</button>` : ''}`;
        const get = (q) => {
            const el = host.querySelector(q);
            if (!el)
                throw new Error('Missing walk control ' + q);
            return el;
        };
        const canvas = get('canvas'), board = get('.walk-board'), stick = get('.world-stick'), use = get('.walk-use'), panel = get('.walk-panel');
        const status = get('.walk-tip'), dayLabel = get('[data-day]'), dot = get('.you-dot');
        const steps = host.querySelector('.dance-steps');
        const pins = Array.from(host.querySelectorAll('[data-walk-to]'));
        const controller = new AbortController();
        const listen = { signal: controller.signal };
        let pose = 0, poseUntil = 0, resetAfter = 0, poseTimer = 0, nextBeat = 0, beat = 0;
        let previousPosition = scene.spawn;
        let lastSave = performance.now();
        let open = false;
        let curtainTimer = 0;
        function refresh() {
            board.dataset.days = String(state.days);
            dayLabel.textContent = day();
            status.textContent = notice || tip();
            if (steps)
                steps.innerHTML = route.map((n, i) => `<span class="${i < state.step ? 'done' : i === state.step ? 'next' : ''}">${i < state.step ? '✓' : ['←', '★', '→'][n]}</span>`).join('');
            for (const pin of pins)
                pin.classList.toggle('active-step', pin.dataset.walkTo === 'pad' + route[state.step]);
        }
        function panelShow(html) {
            open = true;
            engine.setPaused(true);
            panel.innerHTML = html + `<button class="panel-close" data-walk-close>× <span>${say(['Назад', 'Geri'])}</span></button>`;
            panel.hidden = false;
        }
        function panelClose() { open = false; panel.hidden = true; engine.setPaused(false); canvas.focus({ preventScroll: true }); }
        const player = { image: 'art/walk/sofia-walk.webp', width: 163, height: 163, speed: 410,
            sheet: { frameWidth: 192, frameHeight: 192, rows: { south: 0, east: 1, north: 2 }, idleColumn: 0, walkColumns: [1, 2, 0, 3] } };
        const dancingPlayer = { image: avatar.src, width: 126, height: 163, speed: 410,
            draw(ctx, { height }, direction) {
                if (!avatar.complete || !avatar.naturalWidth)
                    return;
                const dancing = performance.now() < poseUntil;
                const col = dancing ? pose : direction === 'north' ? 2 : direction === 'south' ? 0 : 1;
                const side = avatar.naturalWidth / 3;
                ctx.save();
                if (!dancing && direction === 'west')
                    ctx.scale(-1, 1);
                if (dancing && !reduced.matches)
                    ctx.translate(0, -Math.abs(Math.sin((poseUntil - performance.now()) / 150)) * 8);
                ctx.drawImage(avatar, col * side, dancing ? side : 0, side, side, -height / 2, -height, height, height);
                ctx.restore();
            } };
        function destination(next) {
            leaveRoom();
            const entrance = rooms[next].find(s => s.id === room);
            const spawn = entrance?.approach ?? { x: 520, y: 620 };
            if (next === 'dance' && state.step === route.length)
                state.step = 0;
            Object.assign(state, { room: next, x: spawn.x + 42, y: Math.min(740, spawn.y + 79), arrival: false });
            notice = '';
            save(state);
            renderRoom();
        }
        function dance(id) {
            const n = Number(id.slice(3));
            if (state.step === route.length || n !== route[state.step])
                return;
            pose = n;
            poseUntil = performance.now() + 820;
            engine.setAppearance(dancingPlayer);
            window.clearTimeout(poseTimer);
            poseTimer = window.setTimeout(() => engine.setAppearance(player), 820);
            worldAudio.note(n);
            engine.pulseHotspot(id);
            ++state.step;
            if (state.step === route.length) {
                if (!state.danced && state.days > 0)
                    --state.days;
                state.danced = true;
                notice = say(['Связка готова! За окном уже новый свет. Пора на арену.', 'Koreografi hazır! Şimdi arenaya yürüyebilirsin.']);
            }
            else
                notice = '';
            board.dataset.danceStep = String(state.step);
            save(state);
            refresh();
        }
        function arrive(id) {
            if (open)
                return;
            if (roomKey(id)) {
                destination(id);
                return;
            }
            if (id.startsWith('pad')) {
                dance(id);
                return;
            }
            if (id === 'gate') {
                worldAudio.cue('curtain');
                if (state.days > 0) {
                    state.days = 0;
                    save(state);
                    refresh();
                    board.classList.add('evening');
                    open = true;
                    engine.setPaused(true);
                    status.textContent = say(['Настал вечер концерта. Ворота открываются…', 'Konser akşamı geldi. Kapılar açılıyor…']);
                    curtainTimer = window.setTimeout(concert, 1250);
                }
                else
                    concert();
                return;
            }
            if (id === 'rest') {
                if (state.days > 0)
                    --state.days;
                state.arrival = false;
                notice = day();
                save(state);
                refresh();
                worldAudio.cue('delivery');
                return;
            }
            if (id === 'mix') {
                panelShow(`<h3>${say(['Студийный синтезатор', 'Stüdyo synth’i'])}</h3><div class="walk-keys">${['DO', 'MI', 'SOL'].map((k, i) => `<button data-key="${i}">${k}</button>`).join('')}</div>`);
                return;
            }
            if (id === 'merch') {
                panelShow(`<h3>${say(['Концертные лайтстики', 'Konser lightstick’leri'])}</h3><div class="walk-merch">${['heart', 'moon', 'star'].map(id => `<button data-equip="${id}" aria-pressed="${equipped === id}"><img src="art/lightsticks/${id}.webp" alt=""><span>${stickName(id, lang)}</span></button>`).join('')}</div>`);
                return;
            }
        }
        const engine = createWorldEngine({ canvas, scene, player, joystick: { base: stick, thumb: get('.world-stick i') },
            onStep: () => worldAudio.cue('step'), onInteract: arrive,
            onProximityChange(id) { use.hidden = !id || id.startsWith('pad'); use.textContent = say(spots.find(s => s.id === id)?.label ?? ['', '']); },
            onAssetError: () => { status.textContent = say(['Не удалось загрузить сцену. Обнови страницу.', 'Sahne yüklenemedi. Sayfayı yenile.']); },
            onFrame() {
                const p = engine.getPosition(), c = engine.getCamera(), now = performance.now();
                board.dataset.playerX = p.x.toFixed(1);
                board.dataset.playerY = p.y.toFixed(1);
                dot.style.left = (p.x / 12) + '%';
                const previous = previousPosition;
                if (p.x !== previousPosition.x || p.y !== previousPosition.y) {
                    state.x = p.x;
                    state.y = p.y;
                    previousPosition = p;
                    if (now - lastSave > 850) {
                        save(state);
                        lastSave = now;
                    }
                }
                for (const [i, pin] of pins.entries()) {
                    const s = spots[i];
                    if (!s)
                        continue;
                    const screen = engine.getHotspotScreenPosition(s.id);
                    if (!screen)
                        continue;
                    const off = screen.x < 22 || screen.x > canvas.clientWidth - 22;
                    pin.classList.toggle('edge-pin', off);
                    const half = Math.min(pin.offsetWidth / 2 + 6, canvas.clientWidth / 3);
                    const px = Math.max(half, Math.min(canvas.clientWidth - half, screen.x));
                    let py = screen.y;
                    if (off)
                        py = 45 + (i % 3) * 43;
                    pin.style.left = px + 'px';
                    pin.style.top = Math.max(26, Math.min(canvas.clientHeight - 35, py)) + 'px';
                    pin.dataset.side = off ? (screen.x < 22 ? 'left' : 'right') : '';
                }
                const doorway = spots.find(s => (roomKey(s.id) || s.id === 'gate') && Math.hypot(s.approach.x - p.x, s.approach.y - p.y) < 25 && Math.hypot(s.approach.x - previous.x, s.approach.y - previous.y) >= 25);
                if (doorway && !open) {
                    arrive(doorway.id);
                    return;
                }
                if (room === 'dance' && !open && now >= nextBeat) {
                    worldAudio.groove(beat++);
                    nextBeat = now + 520;
                }
                if (room === 'dance' && state.step < route.length && !open && now > resetAfter) {
                    const target = spots.find(s => s.id === 'pad' + route[state.step]);
                    if (target && Math.hypot(target.approach.x - p.x, target.approach.y - p.y) < 34) {
                        resetAfter = now + 180;
                        dance(target.id);
                    }
                }
                board.dataset.cameraX = String(c.x);
                board.dataset.cameraY = String(c.y);
                board.dataset.scale = String(c.scale);
            } });
        board.dataset.danceStep = String(state.step);
        refresh();
        host.addEventListener('pointerdown', () => { if (sound)
            void worldAudio.enter(); }, { ...listen, capture: true });
        host.addEventListener('keydown', () => { if (sound)
            void worldAudio.enter(); }, { ...listen, capture: true });
        host.addEventListener('click', event => {
            const button = event.target instanceof Element ? event.target.closest('button') : null;
            if (!button)
                return;
            const id = button.dataset.walkTo;
            if (button.classList.contains('walk-arrival')) {
                state.days = state.days === 1 ? 2 : 1;
                save(state);
                notice = '';
                leaveRoom();
                renderRoom();
                return;
            }
            if (button.hasAttribute('data-walk-close')) {
                panelClose();
                return;
            }
            if (button.dataset.key !== undefined) {
                const key = Number(button.dataset.key);
                if (key === 0 || key === 1 || key === 2)
                    worldAudio.note(key);
                button.animate?.([{ transform: 'scale(.92)' }, { transform: 'scale(1)' }], { duration: 240 });
                return;
            }
            const item = button.dataset.equip;
            if (item === 'moon' || item === 'star' || item === 'heart') {
                equipped = item;
                equip(item);
                worldAudio.cue('delivery');
                notice = say(['В рюкзаке · ', 'Çantanda · ']) + stickName(item, lang);
                refresh();
                panelClose();
                return;
            }
            if (open)
                return;
            if (id) {
                canvas.focus({ preventScroll: true });
                engine.moveToHotspot(id);
            }
            else if (button === use)
                engine.interact();
        }, listen);
        window.addEventListener('pagehide', () => save(state), listen);
        canvas.focus({ preventScroll: true });
        leaveRoom = () => { window.clearTimeout(curtainTimer); window.clearTimeout(poseTimer); const p = engine.getPosition(); state.x = p.x; state.y = p.y; save(state); engine.destroy(); controller.abort(); };
    }
    worldAudio.setEnabled(sound);
    renderRoom();
    return () => { leaveRoom(); worldAudio.exit(); };
}
