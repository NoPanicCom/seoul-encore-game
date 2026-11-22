import { ariPhase } from './ari-bag.js';
import { createWorldEngine } from './world-engine.js';
import { mountNariDuet } from './nari-duet.js';
import { worldAudio } from './world-audio.js';
import { stickName, merchButtons, couponLabel, isShopStick } from './lightstick.js';
import { yunaDressed, yunaCue } from './yuna-light.js';
import { passes } from './story.js';
import { studioMemberId, studioTravelSelection } from './studio.js';
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
const nari = {
    ...door('nari', ['Нари', 'Nari'], 267, 546, 356),
    approach: { x: 378, y: 551 }, radius: 24, image: 'art/walk/nari.webp', size: { width: 164, height: 164 },
    sheet: { frameWidth: 224, frameHeight: 224, rows: { south: 0 }, idleColumn: 0, walkColumns: [0] },
};
const rooms = {
    street: [door('hotel', ['Отель', 'Otel'], 150), door('hall', ['YG Entertainment', 'YG Entertainment'], 620), door('plaza', ['К арене →', 'Arena yolu →'], 1110, 610, 470)],
    hall: [door('street', street, 90, 623, 485), door('dance', titles.dance, 365), door('studio', titles.studio, 925)],
    dance: [door('hall', hall, 55, 565, 420), tile('pad0', ['←', '←'], 425, 625), tile('pad1', ['★', '★'], 640, 560), tile('pad2', ['→', '→'], 850, 650), nari],
    studio: [door('hall', hall, 108, 580, 430), door('mix', ['Синтезатор', 'Synth çal'], 810, 555, 438)],
    plaza: [door('street', street, 100, 620, 480), { ...door('merch', ['Лайтстики', 'Lightstick standı'], 445, 585, 376), image: 'art/walk/stand.webp', size: { width: 208, height: 213 } }, door('gate', ['Вход на концерт', 'Konser girişi'], 1010, 530, 345)],
    hotel: [door('street', street, 66, 560, 409), door('rest', ['Отдохнуть', 'Dinlen'], 894, 590, 449)],
};
const route = [0, 2, 1, 0, 2, 1];
const roomKey = (value) => Object.prototype.hasOwnProperty.call(titles, value);
const nextDoor = { dance: 'hall', hall: 'street', street: 'plaza', plaza: 'gate', hotel: 'street', studio: 'hall' };
const directions = {
    dance: ['Нари: Идём через холл!', 'Nari: Koridordan geçelim!'],
    hall: ['Нари: Выход на улицу слева.', 'Nari: Sokak çıkışı solda.'],
    street: ['Нари: Видишь огни справа? Нам к арене!', 'Nari: Sağdaki ışıkları görüyor musun? Arena o tarafta!'],
    plaza: ['Нари: За этими воротами наша сцена. Готова?', 'Nari: O kapının ardında sahnemiz var. Hazır mısın?'],
    hotel: ['Нари: Когда будешь готова, выйдем на улицу.', 'Nari: Hazır olunca sokağa çıkalım.'],
    studio: ['Нари: Пойдём через холл, когда закончишь.', 'Nari: Hazır olunca koridordan geçelim.'],
};
const fresh = () => ({ invitation: 'none', room: 'street', days: 2, arrival: true, danced: false, step: 0, duo: 0, x: 505, y: 646 });
const sofiaKey = 'encore1.sofia-walk.v1';
const roleKey = (id) => 'encore1.role-walk.' + id + '.v1';
const memories = new Map();
export function beginRoleWalk(id, days) { save(roleKey(id), { ...fresh(), days, arrival: false }); }
function load(key) {
    const memory = memories.get(key);
    let raw;
    try {
        raw = localStorage.getItem(key);
    }
    catch {
        return memory ?? fresh();
    }
    if (!raw)
        return memory ?? fresh();
    const [place, days, arrival, danced, step, x, y, duo, invite] = raw.split('|');
    if (!place || !roomKey(place) || !['0', '1', '2'].includes(days ?? '') || !['0', '1'].includes(arrival ?? '') || !['0', '1'].includes(danced ?? '') ||
        !/^[0-6]$/.test(step ?? '') || !x || !y || !Number.isFinite(Number(x)) || !Number.isFinite(Number(y)))
        return fresh();
    const invitation = invite === 'offered' || invite === 'together' || (invite === 'onstage' && place === 'plaza') || invite === 'performed' ? invite : 'none';
    return { invitation, room: place, days: Number(days), arrival: arrival === '1', danced: danced === '1', step: Number(step), duo: duo && /^[0-3]$/.test(duo) ? Number(duo) : 0, x: Math.max(26, Math.min(1174, Number(x))), y: Math.max(510, Math.min(754, Number(y))) };
}
function save(key, s) {
    memories.set(key, { ...s });
    try {
        localStorage.setItem(key, [s.room, s.days, +s.arrival, +s.danced, s.step, Math.round(s.x), Math.round(s.y), s.duo, s.invitation].join('|'));
    }
    catch { /* Keep progress in this tab. */ }
}
export function renderSeoulWalk() { return '<section class="walk-host"></section>'; }
export function mountSeoulWalk(lang, sound, chosen, owned, equip, concert, cast) {
    const root = document.querySelector('.walk-host');
    if (!root)
        throw new Error('Missing walking world');
    const host = root;
    const say = (words) => words[lang === 'ru' ? 0 : 1];
    const key = cast ? roleKey(cast.id) : sofiaKey;
    const state = load(key);
    const part = cast ? passes[cast.id] : undefined;
    const name = part ? (part.name === 'BLINK' ? 'BLINK' : part.item || studioMemberId(cast?.id ?? '') ? part.name : part.job[lang]) : say(['София', 'Sofia']);
    const member = studioMemberId(part?.person ?? '');
    const ruMember = member ? { jisoo: 'Джису', jennie: 'Дженни', rose: 'Розэ', lisa: 'Лисы' }[member] : '';
    const artist = studioMemberId(cast?.id ?? '');
    const dressed = !!(member && studioTravelSelection(member));
    const costumeRoom = !!(part?.item || artist);
    const fan = !cast || cast.id === 'blink';
    const player = fan ? { image: 'art/walk/sofia-walk.webp', width: 163, height: 163, speed: 410,
        sheet: { frameWidth: 192, frameHeight: 192, rows: { south: 0, east: 1, north: 2 }, idleColumn: 0, walkColumns: [1, 2, 0, 3] } } :
        artist ? { image: 'art/world/' + artist + '.webp', width: 129, height: 161, speed: 410, sheet: { frameWidth: 128, frameHeight: 160, rows: { south: 0, west: 1, north: 2 }, idleColumn: 0, walkColumns: [1, 2, 3] } } :
            { image: 'art/walk/cast-' + cast.id + '.webp', width: 126, height: 163, speed: 410, sheet: { frameWidth: 144, frameHeight: 192, rows: { south: 0, west: 1, north: 2 }, idleColumn: 0, walkColumns: [1, 2, 3, 0] } };
    let equipped = chosen;
    let leaveRoom = () => { };
    let notice = '';
    const avatar = new Image();
    avatar.src = 'art/walk/sofia.webp';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    function renderRoom() {
        const room = state.room;
        const together = state.invitation === 'together' || state.invitation === 'onstage';
        const spots = rooms[room].filter(s => s.id !== 'nari' || !together);
        if (cast && room === 'hall' && part) {
            const entrance = door('role-room', costumeRoom ? ['Гримёрка ' + ruMember, 'Giyinme odası · ' + part.person] : ['Задание · ' + name, 'Görev · ' + name], 650, 531, 351);
            if (part.item && member) {
                entrance.image = 'art/world/hero-' + member + '.webp';
                entrance.size = { width: 100, height: 162 };
                entrance.position = { x: 623, y: 534 };
            }
            spots.push(entrance);
        }
        if (cast?.id === 'yuna' && room === 'dance') {
            spots.push(door('light-desk', ['Пульт света', 'Spot masası'], 1030, 545, 375));
        }
        const scene = { width: 1200, height: 800, background: 'art/walk/' + (room === 'dance' ? 'mirrored-studio' : room) + '.webp', spawn: { x: state.x, y: state.y }, walkable: { x: 25, y: 510, width: 1150, height: 245 }, obstacles: [], hotspots: spots };
        const day = () => state.days === 0 ? say(['Сегодня концерт', 'Bugün konser var']) : state.days === 1 ? say(['Концерт завтра', 'Konser yarın']) : say(['До концерта 2 дня', 'Konsere 2 gün var']);
        const roleTip = cast?.id === 'ari' && ariPhase() === 'packed' ? say(['Чехол уже за кулисами. Через площадь ты попадёшь на концерт.', 'Kılıf artık kuliste. Meydandan geçip konsere yürü.']) : cast?.id === 'yuna' && yunaDressed() ? (yunaCue() ? say(['Свет для Розэ готов. Иди через площадь к арене!', 'Rosé’nin ışığı hazır. Meydandan geçip arenaya yürü!']) : say(['Зайди в танцзал YG и подойди к пульту света.', 'YG dans odasına gir ve spot masasına yürü.'])) : costumeRoom && part ? (dressed ? say(['Костюм для ' + ruMember + ' готов. Встретимся на арене!', 'Konser kıyafeti hazır. ' + part.person + ' seni arenada bekliyor!']) : room === 'hall' ? say(['Подойди к гримёрке, чтобы выбрать костюм для ' + ruMember + '.', part.person + ' için kostüm seçmek üzere giyinme odasına yürü.']) : say(['Войди в YG и приготовь костюм для ' + ruMember + '.', 'YG’ye gir ve ' + part.person + ' için konser kıyafetini seç.'])) : say(['В холле YG тебя ждёт задание.', 'Görevin YG koridorunda seni bekliyor.']);
        const tip = () => together ? say(directions[room]) : cast && (room === 'street' || room === 'hall') ? roleTip : room === 'dance' ? (state.step === route.length ? say(['Связка готова!', 'Koreografi hazır!']) : say(['Подойди к Нари для дуэта или танцуй по меткам.', 'Düet için Nari’ye yaklaş. Tek başına dans etmek için işaretlere bas.'])) :
            room === 'hall' ? say(['Дверь танцзала слева, студия справа.', 'Dans odası solda, ses stüdyosu sağda.']) :
                room === 'street' ? say(['Тяни джойстик или коснись тротуара. Вход в YG под вывеской.', 'Yön kolunu sürükle veya kaldırıma dokun. YG girişi tabelanın altında.']) :
                    room === 'plaza' ? say(['Подойди к воротам, чтобы попасть на концерт.', 'Konsere girmek için kapıya yürü.']) :
                        room === 'studio' ? say(['Найди синтезатор и сыграй мелодию.', 'Synth’in yanına yürü ve melodini çal.']) : say(['У кровати можно отдохнуть до следующего дня.', 'Yatağın yanına gidip ertesi güne geçebilirsin.']);
        host.innerHTML = `<div class="walk-title"><h2>${(room === 'hotel' && cast ? say(['Отель', 'Otel']) : say(titles[room]))}</h2><span data-day></span></div>
      <div class="walk-board hongdae-board" data-walk-room="${room}" data-walk-role="${cast?.id ?? 'sofia'}" data-with-nari="${together}"><canvas tabindex="0" aria-label="${(room === 'hotel' && cast ? say(['Отель', 'Otel']) : say(titles[room]))}"></canvas>
      <div class="walk-pins">${spots.map(s => `<button class="walk-pin ${s.id.startsWith('pad') ? 'floor-pin' : ''} ${together && s.id === nextDoor[room] ? 'nari-route' : ''}" data-walk-to="${s.id}" aria-label="${s.id.startsWith('pad') ? say(['Танцевальная метка', 'Dans işareti']) + ' ' : ''}${say(s.label)}">${say(s.label)}</button>`).join('')}</div>
      <div class="walk-bottom"><div class="world-stick" aria-label="${say(['Джойстик', 'Yön kolu'])}"><span aria-hidden="true">＋</span><i></i></div><button class="walk-use" hidden></button></div>
      <div class="walk-panel" hidden></div></div>
      <div class="walk-trail"><span>${name}${together ? say([' + Нари', ' + Nari']) : ''}</span><div class="trail-line"><i class="you-dot"></i>${spots.map(s => `<b style="left:${s.position.x / 12}%"></b>`).join('')}</div><span>✦</span></div>
      <p class="walk-tip" role="status"></p>
      ${room === 'dance' && !together ? '<div class="dance-steps"></div>' : ''}
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
        let endDuet;
        let nearNari = false;
        function acceptInvitation() {
            leaveRoom();
            state.invitation = 'together';
            notice = '';
            save(key, state);
            renderRoom();
        }
        function meetNari() {
            if (state.invitation === 'offered') {
                panelShow(`<h3>${say(['Приглашение Нари', 'Nari’nin daveti'])}</h3><p>${say(['Пойдём со мной на мой первый концерт? Станцуем наш танец!', 'İlk konserime benimle gelir misin? Birlikte bizim dansı yapalım!'])}</p>
          <button class="duet-next" data-invite>${say(['Пойдём вместе!', 'Birlikte gidelim!'])}</button>
          <button class="duet-again" data-rehearse>${say(['Ещё раз отрепетировать', 'Bir kez daha prova yap'])}</button>`);
            }
            else
                startDuet(false);
        }
        function startDuet(live) {
            if (open)
                return;
            open = true;
            engine.setPaused(true);
            host.classList.add('in-duet');
            panel.classList.add('duet-stage');
            panel.classList.toggle('debut-stage', live);
            panel.hidden = false;
            if (live)
                get('h2').textContent = say(['Первый концерт Нари', 'Nari’nin ilk konseri']);
            endDuet = mountNariDuet(panel, lang, state.duo, count => { state.duo = count; save(key, state); }, () => {
                if (!live && !state.danced && state.days > 0)
                    --state.days;
                state.duo = 0;
                state.step = route.length;
                state.danced = true;
                state.invitation = live ? 'performed' : 'offered';
                notice = live ? say(['Вы с Нари выступили вместе!', 'Nari ile ilk sahnenize çıktınız!']) : say(['Нари ждёт тебя в танцзале.', 'Nari seni dans odasında bekliyor.']);
                board.dataset.danceStep = String(state.step);
                save(key, state);
                refresh();
            }, () => {
                if (live) {
                    leaveRoom();
                    if (state.invitation === 'onstage') {
                        state.invitation = 'together';
                        state.duo = 0;
                    }
                    save(key, state);
                    renderRoom();
                    return;
                }
                endDuet?.();
                endDuet = undefined;
                host.classList.remove('in-duet');
                panel.classList.remove('duet-stage');
                panel.replaceChildren();
                nearNari = true;
                panelClose();
            }, live ? { kind: 'concert', continueShow: concert } : { kind: 'rehearsal', invite: acceptInvitation }, cast ? { name, image: fan ? null : player.image } : undefined);
        }
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
            save(key, state);
            renderRoom();
        }
        function dance(id) {
            const n = Number(id.slice(3));
            if (state.step === route.length || n !== route[state.step])
                return;
            pose = n;
            poseUntil = performance.now() + 820;
            engine.setAppearance(fan ? dancingPlayer : player);
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
            save(key, state);
            refresh();
        }
        function arrive(id) {
            if (open)
                return;
            if (roomKey(id)) {
                destination(id);
                return;
            }
            if (id === 'role-room' && cast) {
                if (costumeRoom)
                    cast.openWardrobe();
                else
                    cast.mission();
                return;
            }
            if (id === 'light-desk' && cast?.id === 'yuna') {
                cast.lightDesk();
                return;
            }
            if (id === 'nari') {
                meetNari();
                return;
            }
            if (id.startsWith('pad')) {
                dance(id);
                return;
            }
            if (id === 'gate') {
                worldAudio.cue('curtain');
                if (together) {
                    state.days = 0;
                    state.invitation = 'onstage';
                    save(key, state);
                    refresh();
                    startDuet(true);
                    return;
                }
                if (state.days > 0) {
                    state.days = 0;
                    save(key, state);
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
                save(key, state);
                refresh();
                worldAudio.cue('delivery');
                return;
            }
            if (id === 'mix') {
                panelShow(`<h3>${say(['Студийный синтезатор', 'Stüdyo synth’i'])}</h3><div class="walk-keys">${['DO', 'MI', 'SOL'].map((k, i) => `<button data-key="${i}">${k}</button>`).join('')}</div>`);
                return;
            }
            if (id === 'merch') {
                panelShow(`<h3>${say(['Концертные лайтстики', 'Konser lightstick’leri'])}</h3><p>${couponLabel(lang, owned)}</p><div class="stick-shelf">${merchButtons(lang, equipped, owned, true)}</div>`);
                return;
            }
        }
        const engine = createWorldEngine({ canvas, scene, player, ...(together ? { companion: {
                    width: 163, height: 163, sheet: { frameWidth: 192, frameHeight: 192, rows: { south: 0, east: 1, north: 2 }, idleColumn: 0, walkColumns: [1, 2, 0, 3] }, image: 'art/walk/nari-walk.webp', speed: 440, followDistance: 78,
                    spawn: { x: state.x + (state.x < 145 ? 78 : -78), y: Math.max(510, state.y - 12) },
                } } : {}), joystick: { base: stick, thumb: get('.world-stick i') },
            onStep: () => worldAudio.cue('step'), onInteract: arrive,
            onProximityChange(id) { use.hidden = !id || id.startsWith('pad'); use.textContent = say(spots.find(s => s.id === id)?.label ?? ['', '']); },
            onAssetError: () => { status.textContent = say(['Не удалось загрузить сцену. Обнови страницу.', 'Sahne yüklenemedi. Sayfayı yenile.']); },
            onFrame() {
                const p = engine.getPosition(), c = engine.getCamera(), now = performance.now();
                board.dataset.playerX = p.x.toFixed(1);
                board.dataset.playerY = p.y.toFixed(1);
                const partner = engine.getCompanionPosition();
                if (partner) {
                    board.dataset.nariX = partner.x.toFixed(1);
                    board.dataset.nariY = partner.y.toFixed(1);
                }
                dot.style.left = (p.x / 12) + '%';
                const previous = previousPosition;
                if (p.x !== previousPosition.x || p.y !== previousPosition.y) {
                    state.x = p.x;
                    state.y = p.y;
                    previousPosition = p;
                    if (now - lastSave > 850) {
                        save(key, state);
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
                const doorway = spots.find(s => (roomKey(s.id) || s.id === 'gate' || s.id === 'role-room' || s.id === 'light-desk') && Math.hypot(s.approach.x - p.x, s.approach.y - p.y) < 25 && Math.hypot(s.approach.x - previous.x, s.approach.y - previous.y) >= 25);
                if (doorway && !open) {
                    arrive(doorway.id);
                    return;
                }
                if (room === 'dance' && !together && !open) {
                    const close = Math.hypot(nari.position.x - p.x, nari.position.y - p.y) < 82 || Math.hypot(nari.approach.x - p.x, nari.approach.y - p.y) < 28;
                    if (close && !nearNari && !engine.getTargetHotspot()) {
                        nearNari = true;
                        meetNari();
                        return;
                    }
                    nearNari = close;
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
        host.addEventListener('pointerdown', () => { void worldAudio.enter(); }, { ...listen, capture: true });
        host.addEventListener('keydown', () => { void worldAudio.enter(); }, { ...listen, capture: true });
        host.addEventListener('click', event => {
            const button = event.target instanceof Element ? event.target.closest('button') : null;
            if (!button)
                return;
            const id = button.dataset.walkTo;
            if (button.classList.contains('walk-arrival')) {
                state.days = state.days === 1 ? 2 : 1;
                save(key, state);
                notice = '';
                leaveRoom();
                renderRoom();
                return;
            }
            if (button.hasAttribute('data-invite')) {
                acceptInvitation();
                return;
            }
            if (button.hasAttribute('data-rehearse')) {
                panelClose();
                state.invitation = 'none';
                save(key, state);
                startDuet(false);
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
            if (item && isShopStick(item)) {
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
        window.addEventListener('pagehide', () => save(key, state), listen);
        canvas.focus({ preventScroll: true });
        leaveRoom = () => { endDuet?.(); host.classList.remove('in-duet'); window.clearTimeout(curtainTimer); window.clearTimeout(poseTimer); const p = engine.getPosition(); state.x = p.x; state.y = p.y; save(key, state); engine.destroy(); controller.abort(); };
        if (state.invitation === 'onstage')
            startDuet(true);
    }
    worldAudio.setEnabled(sound);
    renderRoom();
    return () => { leaveRoom(); worldAudio.exit(); };
}
