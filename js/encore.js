import { beatCount } from './rules.js';
import { isYunaCue } from './yuna-light.js';
import { line, passes } from './story.js';
const memberArt = { Lisa: 'lisa', Jisoo: 'jisoo', Jennie: 'jennie', 'Rosé': 'rose' };
const lineup = ['Jisoo', 'Jennie', 'Rosé', 'Lisa'];
const storageKey = 'encore1.last-performance';
const safeArt = /^(?:[a-z0-9_-]{1,48}\/){0,2}[a-z0-9_-]{1,48}$/;
const cueByRole = {
    ari: line('Kostüm kılıfını aç', 'Открыть чехол с костюмом'),
    mina: line('Ceket için işaret ver', 'Дать сигнал для смены жакета'),
    soyeon: line('Eteğin klipsini aç', 'Расстегнуть застёжку на шлейфе'),
    yuna: line('Prova spotunu aç', 'Включить свет с репетиции'),
    lisa: line('Perdeyi aralayıp sahneye çık', 'Шагнуть из-за кулисы'),
    jisoo: line('Giriş çizgisine adım at', 'Шагнуть к метке выхода'),
    jennie: line('Giriş vuruşunu say', 'Отсчитать вступление'),
    rose: line('Gitarınla giriş yap', 'Выйти с гитарой'),
    light: line('Işık masasından işaret ver', 'Дать сигнал с пульта света'),
    manager: line('Ekibe bis işaretini gönder', 'Передать команде сигнал на бис'),
    director: line('Perdeye çıkış işaretini ver', 'Дать сигнал к выходу'),
    sound: line('Sahne mikrofonunu aç', 'Включить сценический микрофон'),
    choreo: line('İlk sekizi say', 'Отсчитать первые восемь'),
    photo: line('Sahneyi kadraja al', 'Взять сцену в кадр'),
    blink: line('Işık çubuğunu kaldır', 'Поднять лайтстик'),
};
const scenes = {
    solo: {
        title: line('Lisa’nın gizli solosu', 'Тайное соло Лисы'),
        entrance: line('Bütün gece kuliste bekleyen Lisa tek başına sahneye çıkıyor. İlk sekiz sayıyı ayak sesleriyle dolduruyor.', 'Лиса весь вечер ждала за кулисами. Теперь она выходит одна и начинает танец под звук собственных шагов.'),
        bow: line('Lisa son dönüşünü bitirdi. Salonun bir anlık sessizliğini alkış kesti.', 'Лиса сделала последний поворот. Миг тишины в зале оборвался аплодисментами.'),
    },
    group: {
        title: line('Dört spot, tek sahne', 'Четыре луча, одна сцена'),
        entrance: line('Önce Jisoo, ardından Jennie, Rosé ve Lisa. Her adımla sahnede bir spot daha yanıyor.', 'Первой выходит Джису, за ней Дженни, Розэ и Лиса. С каждым выходом загорается новый луч.'),
        bow: line('Dördü sahnenin ortasında buluştu ve son selamı birlikte verdi.', 'Все четверо встретились в центре сцены и вместе поклонились в последний раз.'),
    },
    wave: {
        title: line('Tribünde pembe dalga', 'Розовая волна на трибунах'),
        entrance: line('Ön sırada bir ışık yanıyor. Ardından bütün tribün, sahnedekileri bile şaşırtan pembe bir dalgaya kalkıyor.', 'В первом ряду вспыхивает огонёк. Розовая волна поднимается по трибунам и удивляет даже девушек на сцене.'),
        bow: line('Dört üye tribüne döndü. Son selamı pembe dalgayı başlatan sıraya gönderdiler.', 'Все четверо повернулись к трибунам. Последний поклон достался ряду, с которого пошла розовая волна.'),
    },
};
let active = null;
let lastRecording = null;
let storageIssue = false;
function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function isMember(value) {
    return typeof value === 'string' && Object.prototype.hasOwnProperty.call(memberArt, value);
}
function isNote(value) {
    return typeof value === 'string' && value.length <= 800;
}
function decodeInput(value) {
    if (!isObject(value))
        return null;
    const { role, member, score, signal, cityNote, looks } = value;
    if (typeof role !== 'string' || !Object.prototype.hasOwnProperty.call(passes, role) || !isMember(member))
        return null;
    if (signal !== 'solo' && signal !== 'group' && signal !== 'wave')
        return null;
    if (score !== null && (typeof score !== 'number' || !Number.isInteger(score) || score < 0 || score > beatCount))
        return null;
    if (!isObject(cityNote) || !isNote(cityNote.tr) || !isNote(cityNote.ru) || !isObject(looks))
        return null;
    const validatedLooks = {};
    for (const [name, art] of Object.entries(looks)) {
        if (!isMember(name) || typeof art !== 'string' || !safeArt.test(art))
            return null;
        validatedLooks[name] = art;
    }
    const spot = value.roseCue;
    if (spot !== undefined && (role !== 'yuna' || typeof spot !== 'string' || !isYunaCue(spot)))
        return null;
    return { role, member, score, signal, ...(typeof spot === 'string' ? { roseCue: spot } : {}), looks: validatedLooks, cityNote: { tr: cityNote.tr, ru: cityNote.ru } };
}
function loadRecording() {
    if (storageIssue)
        return lastRecording;
    let raw;
    try {
        raw = localStorage.getItem(storageKey);
    }
    catch {
        return lastRecording;
    }
    if (raw === null || raw.length > 8192)
        return null;
    let stored;
    try {
        stored = JSON.parse(raw);
    }
    catch {
        return null;
    }
    if (!isObject(stored) || stored.version !== 1 || (stored.light !== 'pink' && stored.light !== 'silver'))
        return null;
    const input = decodeInput(stored);
    return input && { ...input, version: 1, light: stored.light };
}
function saveRecording(input, light) {
    lastRecording = { ...input, version: 1, light };
    try {
        localStorage.setItem(storageKey, JSON.stringify(lastRecording));
        storageIssue = false;
    }
    catch {
        storageIssue = true;
    }
}
export function startEncore(input) {
    const snapshot = decodeInput(input);
    if (!snapshot)
        throw new TypeError('Invalid encore input');
    active = { input: snapshot, phase: 'standby', light: null, replay: false };
}
export function hasEncoreReplay() {
    return loadRecording() !== null;
}
export function replayEncore() {
    const recording = loadRecording();
    if (!recording)
        return false;
    active = { input: recording, phase: 'standby', light: recording.light, replay: true };
    return true;
}
export function encoreAction(action) {
    if (!active)
        return false;
    if (active.phase === 'standby' && action === 'encore-cue') {
        active.phase = 'entrance';
        return true;
    }
    if (active.phase !== 'entrance')
        return false;
    const light = active.replay ? active.light : action === 'encore-pink' ? 'pink' : action === 'encore-silver' ? 'silver' : null;
    if (!light || (active.replay && action !== 'encore-play-light'))
        return false;
    active.phase = 'bow';
    active.light = light;
    if (!active.replay)
        saveRecording(active.input, light);
    return true;
}
function escapeHtml(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function art(input, member) {
    return `art/${input.looks[member] ?? `studio/${memberArt[member]}-spotlight`}.webp`;
}
function button(action, label, style = 'primary') {
    return `<button type="button" class="${style}" data-act="${action}">${label}</button>`;
}
function crowd() {
    return `<div class="encore-crowd" aria-hidden="true">${Array.from({ length: 4 }, (_, row) => `<div class="encore-crowd-row" style="--row:${row}">${Array.from({ length: 17 }, (_, column) => `<i style="--column:${column};--height:${7 + (column * 7 + row * 11) % 13}"></i>`).join('')}</div>`).join('')}</div>`;
}
function film(performance, lang) {
    const { input, phase, light, replay } = performance;
    const artists = input.signal === 'solo' ? ['Lisa'] : lineup;
    const members = artists.map((name, index) => `<figure data-artist="${memberArt[name]}" class="encore-artist${input.member === name ? ' encore-featured' : ''}" style="--enter:${index}">
    <img src="${art(input, name)}" alt="" width="280" height="420">
    <figcaption>${name}</figcaption>
  </figure>`).join('');
    const started = phase !== 'standby';
    const overline = replay ? line('KONSER KAYDI', 'ЗАПИСЬ КОНЦЕРТА') : line('SEOUL · CANLI', 'СЕУЛ · СЦЕНА');
    return `<div ${input.roseCue ? 'data-yuna-cue="' + input.roseCue + '"' : ''} class="encore-film encore-${input.signal} encore-${phase} encore-light-${phase === 'bow' ? light : 'neutral'}">
    <div class="encore-scanline" aria-hidden="true"></div>
    <div class="encore-rig" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    <div class="encore-lights" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    ${started ? `<div class="encore-cast">${members}</div>` : '<div class="encore-curtain" aria-hidden="true"></div>'}
    ${crowd()}
    <p class="mono encore-stamp"><span aria-hidden="true"></span>${overline[lang]}</p>
  </div>`;
}
function roleName(input, lang) {
    const pass = passes[input.role];
    if (!pass)
        throw new TypeError('Missing encore role');
    return input.role === 'light' || pass.name === input.member ? pass.job[lang] : `${pass.name} · ${pass.job[lang]}`;
}
function finalNote(performance, lang) {
    const { input, light } = performance;
    if (!light)
        throw new TypeError('Missing encore light');
    const score = input.score === null ? line('Serbest izleme', 'Свободный просмотр')[lang] : `${input.score} / ${beatCount} ${line('vuruş', 'ударов')[lang]}`;
    const lighting = light === 'pink' ? line('Pembe ışık', 'Розовый свет') : line('Gümüş ışık', 'Серебряный свет');
    const cityNote = input.cityNote[lang];
    return `<div class="encore-memory">
    <img src="${art(input, input.member)}" alt="" width="54" height="66">
    <div><strong>${input.member} · ${escapeHtml(roleName(input, lang))}</strong>
    <p class="mono">${lighting[lang]} · ${score}</p>
    ${cityNote ? `<p>${escapeHtml(cityNote)}</p>` : ''}</div>
  </div>`;
}
export function renderEncore(lang) {
    if (!active)
        return '';
    const { input, phase, replay } = active;
    const scene = scenes[input.signal];
    const intro = line('Son selam bitti', 'Последний поклон');
    const standby = line('Sahne karardı. Salon bekliyor. Bir sonraki işaret sende.', 'Сцена погасла. Зал замер в ожидании. Следующий сигнал за тобой.');
    const title = phase === 'standby' ? intro : scene.title;
    const description = phase === 'standby' ? standby : scene[phase];
    const part = phase === 'standby' ? 1 : phase === 'entrance' ? 2 : 3;
    const cue = cueByRole[input.role] ?? line('Bis işaretini ver', 'Дать сигнал на бис');
    const startLabel = replay ? line('Kaydı başlat', 'Включить запись') : cue;
    const controls = {
        standby: () => button('encore-cue', startLabel[lang]),
        entrance: () => replay ? button('encore-play-light', line('Final ışığını izle', 'Посмотреть финальный свет')[lang]) :
            `<div class="encore-choices">${button('encore-pink', line('Pembe ışığı yak', 'Включить розовый свет')[lang])}${button('encore-silver', line('Gümüş ışığı yak', 'Включить серебряный свет')[lang], 'secondary')}</div>`,
        bow: () => replay ? button('home', line('Ana ekrana dön', 'На главную')[lang]) : button('collect', line('Fotoğraf kartımı al', 'Забрать фотокарточку')[lang]),
    };
    const progress = line('Bis ilerlemesi', 'Ход выступления на бис');
    const storageMessage = line('Konser kaydı bu oturumda izlenebilir. Tarayıcı kaydına erişilemiyor.', 'Концерт можно пересмотреть в этом сеансе. Хранилище браузера недоступно.');
    return `<section class="encore-sequence" aria-labelledby="encore-title">
    ${film(active, lang)}
    <div class="encore-progress"><span class="mono" aria-hidden="true">${part} / 3</span><progress value="${part}" max="3" aria-label="${progress[lang]}"></progress></div>
    <div class="encore-description" aria-live="polite"><h2 id="encore-title" tabindex="-1">${title[lang]}</h2><p>${description[lang]}</p></div>
    ${phase === 'bow' ? finalNote(active, lang) : ''}
    ${controls[phase]()}
    ${storageIssue && phase === 'bow' ? `<p class="encore-storage" role="status">${storageMessage[lang]}</p>` : ''}
  </section>`;
}
