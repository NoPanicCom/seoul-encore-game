import { items, passes, trips } from './story.js';
import { beatAt, beatCount, beatMs, cardIds, windowMs } from './rules.js';
import { melody, previewIntro, silence } from './sound.js';
import { renderLobby } from './lobby.js';
import { renderPets, petAction, petAlbum, petTourNote, openPet, openPetLobby } from './pets.js';
import { renderStudio, studioAction, stageLook, studioAlbum } from './studio.js';
import { cityAction, cityAlbum, cityDay, cityFinale, cityProgress, cityReset, renderCity, saveCityCheckpoint, restoreCityCheckpoint } from './city.js';
import { renderCrewGame, crewAction, crewAlbum, hasCrewGame, isCrewGameComplete, resetCrewGame } from './crew-game.js';
import { renderEncore, startEncore, replayEncore, hasEncoreReplay, encoreAction } from './encore.js';
function element(id) {
    const found = document.getElementById(id);
    if (!found)
        throw new Error(id);
    return found;
}
const app = element('app');
let lang = 'ru';
const t = (tr, ru) => lang === 'tr' ? tr : ru;
function storageError() {
    element('storage').textContent = t('Safari bu oturumda kayıt alanına erişemiyor.', 'Safari не может сохранить альбом в этом сеансе.');
}
function read(key) { try {
    return localStorage.getItem('encore1.' + key);
}
catch {
    storageError();
    return null;
} }
function save(key, value) { try {
    localStorage.setItem('encore1.' + key, value);
}
catch {
    storageError();
} }
if (read('lang') === 'tr')
    lang = 'tr';
let page = 'home';
let role = 'ari';
let remaining = 0;
const memberIds = { Jisoo: 'jisoo', Jennie: 'jennie', 'Rosé': 'rose', Lisa: 'lisa' };
let petBack = 'home';
let studioBack = 'home';
let studioMember = 'Lisa';
let cityMode = 'free';
let forecast = 'solo';
let albumSection = 'concert';
let roleGroup = 'all';
let earnedPasses = cardIds([read('earned'), read('album')].join(','));
let actor = 'Lisa';
let lastFree = false;
function escapeText(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function isRole(id) { return Object.prototype.hasOwnProperty.call(passes, id); }
function memoryLook(id) {
    const asset = read('look.' + id);
    return asset && /^[a-z0-9_-]+(?:\/[a-z0-9_-]+)*$/.test(asset) ? asset : passes[id]?.card ?? 'lisa';
}
let sound = read('sound') !== 'off';
let album = cardIds(read('album'));
let playing = false;
let epoch = 0;
let start = 0;
let frame = 0;
let hits = new Set();
let viewing = false;
let feedback = '';
function pass() {
    const p = passes[role];
    if (!p)
        throw new Error('pass');
    return p;
}
function stop() { epoch++; playing = false; cancelAnimationFrame(frame); silence(); }
const checkpoints = ['city', 'brief', 'item', 'cue', 'crew', 'stage'];
function resumePoint() {
    const [id, point, days] = (read('checkpoint') ?? '').split('|');
    const dest = checkpoints.find(key => key === point);
    if (!id || !isRole(id) || !dest || days === undefined || !['0', '1', '2'].includes(days))
        return null;
    return { role: id, page: dest, remaining: Number(days) };
}
function checkpoint(next) {
    if (cityMode !== 'tour' || clipDay || !checkpoints.some(key => key === next))
        return;
    save('checkpoint', [role, next, remaining].join('|'));
    saveCityCheckpoint();
}
function go(next) {
    stop();
    page = next;
    feedback = '';
    checkpoint(next);
    draw();
    window.scrollTo(0, 0);
}
function action(id, label, style = 'primary') { return `<button class="${style}" data-act="${id}">${label}</button>`; }
function photo(file, alt = '', cls = '') { return `<img class="${cls}" src="art/${file}.webp" alt="${alt}">`; }
const albumTitle = () => t('Fotoğraf albümüm', 'Мой фотоальбом');
function home() {
    const progress = resumePoint();
    const p = progress ? passes[progress.role] : null;
    const resumeLabel = p ? t('Turneme dön', 'Продолжить тур') + ' · ' + p.job[lang] : '';
    return renderLobby(lang, album.length, Object.keys(passes).length, hasEncoreReplay(), resumeLabel);
}
const memberRoles = ['lisa', 'jisoo', 'jennie', 'rose'];
const stylistRoles = ['ari', 'mina', 'soyeon', 'yuna'];
const order = ['ari', 'lisa', 'light', 'blink', 'jisoo', 'mina', 'manager', 'jennie', 'soyeon', 'sound', 'rose', 'yuna', 'director', 'choreo', 'photo'];
function roleFamily(id) {
    if (memberRoles.includes(id))
        return 'stage';
    if (stylistRoles.includes(id))
        return 'style';
    return 'team';
}
function roles() {
    const groups = [['all', t('Tümü', 'Все')], ['stage', t('Sahne', 'Сцена')], ['style', t('Stilistler', 'Стилисты')], ['team', t('Ekip ve BLINK', 'Команда и BLINK')], ['earned', t('Kartlarım', 'Мои пропуска')]];
    return `<h2>${t('Bu gece kimsin?', 'Кем ты станешь?')}</h2>
  ${action('random', t('✦  Sürpriz kart çek', '✦  Вытянуть случайный пропуск'), 'secondary')}
  <div class="segmented">${groups.map(([id, name]) => action('filter-' + id, String(name), roleGroup === id ? 'chosen' : '')).join('')}</div>
  ${roleGroup === 'earned' && !earnedPasses.length ? '<p class="intro">' + t('İlk kulis görevini bitirince kartın burada açılır.', 'Выполни первое задание, и здесь появится твой пропуск.') + '</p>' : ''}<div class="role-grid">${order.filter(id => roleGroup === 'all' || roleFamily(id) === roleGroup || (roleGroup === 'earned' && earnedPasses.includes(id))).map(id => {
        const p = passes[id];
        if (!p)
            throw new Error(id);
        const portrait = id === 'blink' ? '<span class="role-fan" aria-hidden="true">♥</span>' : photo(id === 'light' ? 'light' : p.photo);
        const label = roleFamily(id) === 'team' ? p.job[lang] : p.name;
        const caption = stylistRoles.includes(id) ? p.person + ' · ' + p.job[lang] : p.person === label ? p.job[lang] : p.person;
        return action('role-' + id, `${portrait}<div><strong>${label}</strong><small>${id === 'blink' ? 'BLINK' : caption}</small></div>`, 'role-option');
    }).join('')}</div>`;
}
function clockPage() {
    return `<h2>${t('Seul’e ne zaman gelelim?', 'Когда приедем в Сеул?')}</h2><p class="intro">${t('Her gün bir durağa uğrayabilirsin. Konser seni bekler.', 'Каждый день можно заглянуть в одно место. Концерт тебя дождётся.')}</p>
  <div class="stack">${[t('İki gün önce · Şehri gez', 'За два дня · Погулять'), t('Bir gün önce · Son prova', 'За день · Репетиция'), t('Doğrudan konsere', 'Сразу на концерт')].map((label, i) => action('days-' + (2 - i), label + ' →', 'option')).join('')}</div>`;
}
function studioScreen() {
    const choose = studioBack === 'home'
        ? `<div class="segmented">${Object.keys(memberIds).map(name => action('artist-' + name, name, name === studioMember ? 'chosen' : '')).join('')}</div>` : '';
    return choose + renderStudio(lang, studioMember);
}
function cityScreen() {
    return renderCity(lang, role, cityMode !== 'tour');
}
function brief() {
    const p = pass();
    return `${photo(memberRoles.includes(role) ? (stageLook(p.person, 'rehearsal') ?? p.photo) : (role === 'light' ? 'light' : p.photo), '', 'portrait')}<p class="kicker">${p.job[lang]} / ${p.person}</p><h2>${t('Sıra sende.', 'Твой выход.')}</h2><p>${p.intro[lang]}</p>${action('mission', t('Göreve başla', 'Начать задание'))}${action('studio', t('Sahne kostümü seç', 'Выбрать сценический наряд'), 'secondary')}${action('pet-visit', t('Provadan önce patili dostuna uğra', 'Заглянуть к питомцу перед репетицией'), 'secondary')}`;
}
function itemsPage() {
    return `<h2>${t('Son parça', 'Последняя деталь')}</h2><p class="intro">${pass().intro[lang]}</p><div class="items">${items.map(item => action('item-' + item.id, `${photo(item.id)}<span>${item.label[lang]}</span>`, 'item')).join('')}</div>`;
}
function cuePage() {
    const p = pass();
    return `<p class="kicker">${p.job[lang]} / ${p.person}</p><h2>${t('Çıkışa iki dakika', 'Две минуты до выхода')}</h2><p class="intro">${p.item ? p.hint[lang] : p.intro[lang]}</p><div class="stack">${p.choices.map((choice, i) => action('answer-' + i, choice[lang], 'option')).join('')}</div>`;
}
function stage() {
    const p = pass();
    return `<div class="stage">${stageLook(p.person, 'rehearsal') ? photo(stageLook(p.person, 'rehearsal') ?? p.card, p.person, 'rhythm-look') : ''}<span class="kicker">SEOUL LIVE</span><h2>${p.cue[lang]}</h2><p>${p.result[lang]}</p><div class="dots" aria-hidden="true">${'<i class="dot"></i>'.repeat(beatCount)}</div>
  <button id="pad" class="disc" data-act="${playing ? 'tap' : 'play'}">${playing ? t('Dokun', 'Нажми') : t('Başlat ▶', 'Старт ▶')}</button>
  <p id="count" class="mono">0 / ${beatCount}</p></div>
  <p class="intro">${t('İç halka büyüyüp kenara vardığında dokun. Kaçırırsan sıradaki vuruştan devam et.', 'Нажимай, когда кольцо дорастёт до края. Если пропустишь, лови следующий удар.')}</p>
  ${playing ? action('pause', t('Duraklat', 'Пауза'), 'secondary') : action('sound', (sound ? '♫ ' : '○ ') + (sound ? t('Ses açık', 'Звук включён') : t('Ses kapalı', 'Звук выключен')), 'secondary')}
  ${playing ? '' : action('relax', t('Süre tutmadan finali izle', 'Посмотреть финал без таймера'), 'secondary')}`;
}
function memories() {
    const note = read('note.' + role + '.' + lang);
    if (note !== null)
        return escapeText(note);
    const saved = read('trip.' + role) ?? '';
    return saved.split(',').filter(n => /^[0-3]$/.test(n)).map(n => trips[Number(n)]?.label[lang]).join(' · ');
}
function noteFor(language) {
    return [cityFinale(language), petTourNote(language, actor)].filter(Boolean).join(' ');
}
function signalTitle(signal) {
    if (signal === 'group')
        return t('Dört üye aynı ışıkta', 'Четыре участницы в одном луче');
    if (signal === 'wave')
        return t('Tribünün pembe dalgası', 'Розовая волна трибун');
    return t('Lisa’nın gizli solosu', 'Тайное соло Лисы');
}
function storedScore() {
    const value = read('score.' + role);
    if (value === 'free')
        return t('Serbest izleme', 'Свободный просмотр');
    const n = Number(value);
    const count = value !== null && Number.isInteger(n) && n >= 0 && n <= beatCount ? n : hits.size;
    return t('Yakaladığın vuruş', 'Точные попадания') + ' · ' + count + ' / ' + beatCount;
}
function ending() {
    const p = pass();
    return `<p class="kicker">${t('Konser hatırası', 'На память о концерте')}</p><h2>${t('Bir kez daha!', 'На бис!')}</h2><div class="memcard">${photo(memoryLook(role), p.person)}<strong>${p.person}</strong><small class="mono">SEOUL ENCORE · ${p.job[lang]}</small></div><p>${read('signal.' + role) ? signalTitle(read('signal.' + role)) + ' · ' + p.result[lang] : p.finale[lang]}</p><div class="log">${p.name} · ${p.job[lang]}<br>${storedScore()}<br>${memories()}</div>
  ${action('pet-visit', t('Konserden sonra eve uğra', 'Навестить питомца после шоу'))}${action('afterparty', t('Ertesi gün · Turneye devam', 'На следующий день · Продолжить тур'), 'secondary')}${action('clipday', t('Klip çekim gününe katıl', 'Остаться на съёмки клипа'), 'secondary')}${action('album', albumTitle(), 'secondary')}${action('start', t('Başka bir kartla oyna', 'Играть с другим пропуском'), 'secondary')}`;
}
function albumPage() {
    const tabs = [['concert', t('Konser', 'Концерт')], ['pets', t('Patiler', 'Питомцы')], ['city', t('Şehir', 'Город')], ['studio', t('Stil', 'Стиль')], ['crew', t('Kulis', 'За сценой')]];
    const concertCards = `<div class="album">${album.map(id => {
        const p = passes[id];
        if (!p)
            throw new Error(id);
        return action('card-' + id, `${photo(memoryLook(id))}<span>${p.person} · ${p.job[lang]}</span>`, 'collect');
    }).join('')}</div>${album.length ? '' : `<p class="intro">${t('İlk konserini bitirince fotoğraf kartın buraya gelecek.', 'Заверши концерт, чтобы получить первую фотокарточку.')}</p>`}${hasEncoreReplay() ? action('replay', t('Son konseri yeniden izle', 'Посмотреть запись концерта'), 'secondary') : ''}${action('start', t('Kulis kartı seç', 'Выбрать пропуск'))}`;
    const sections = { concert: () => concertCards, pets: () => petAlbum(lang), studio: () => studioAlbum(lang), city: () => cityAlbum(lang), crew: () => crewAlbum(lang) };
    return `<h2>${albumTitle()}</h2><div class="segmented">${tabs.map(([id, name]) => action('section-' + id, String(name), albumSection === id ? 'chosen' : '')).join('')}</div>${sections[albumSection]?.() ?? concertCards}`;
}
function back() {
    if (page === 'pets')
        return petBack;
    if (page === 'studio')
        return studioBack;
    if (page === 'ending' && viewing)
        return 'album';
    if (page === 'time')
        return 'passes';
    if (page === 'city' && cityMode === 'after')
        return 'ending';
    if (page === 'city' && cityMode === 'tour')
        return 'time';
    if (page === 'crew' && clipDay)
        return 'ending';
    if (page === 'item' || page === 'cue' || page === 'crew')
        return 'brief';
    return 'home';
}
function draw() {
    document.documentElement.lang = lang;
    const screens = { home, passes: roles, time: clockPage, city: cityScreen, pets: () => renderPets(lang), studio: studioScreen, crew: () => renderCrewGame(lang, clipDay ? 'director' : role), brief, item: itemsPage, cue: cuePage, stage, show: () => renderEncore(lang), ending, album: albumPage };
    app.innerHTML = `<header><button class="brand" data-act="home" aria-label="${t('Ana ekran', 'Главная')}"><b>✳</b> encore</button><button class="lang" data-act="lang" aria-label="Türkçe / Русский">${lang === 'tr' ? 'TR <span>/ РУ</span>' : '<span>TR /</span> РУ'}</button></header><main>${page === 'home' ? '' : `<div class="subhead">${action('back', back() === 'home' ? t('‹ Ana ekran', '‹ Главная') : t('‹ Geri', '‹ Назад'), 'smallbtn')}<span class="cardno">${['passes', 'album', 'pets', 'city', 'studio'].includes(page) ? 'SEOUL ENCORE' : pass().name + ' / SEOUL'}</span></div>`}${screens[page]()}<div id="feedback" class="notice" role="status"></div></main>`;
    element('feedback').textContent = feedback;
}
function message(tr, ru) { feedback = t(tr, ru); element('feedback').textContent = feedback; }
function chooseFinale() {
    const city = cityProgress();
    if (city.lightstick || role === 'blink')
        return 'wave';
    if (city.rhythm || !['ari', 'lisa', 'light', 'manager'].includes(role))
        return 'group';
    return 'solo';
}
function finish(free) {
    forecast = chooseFinale();
    lastFree = free;
    const looks = {};
    for (const name of Object.keys(memberIds)) {
        const selected = stageLook(name);
        if (selected)
            looks[name] = selected;
    }
    startEncore({ role, member: actor, looks, score: free ? null : hits.size, cityNote: { tr: noteFor('tr'), ru: noteFor('ru') }, signal: forecast });
    viewing = false;
    go('show');
}
function collectCard() {
    album = cardIds([...(cardIds(read('album'))), ...album, role].join(','));
    save('album', album.join(','));
    save('signal.' + role, forecast);
    save('look.' + role, stageLook(actor) ?? 'studio/' + memberIds[actor] + '-spotlight');
    save('score.' + role, lastFree ? 'free' : String(hits.size));
    save('note.' + role + '.tr', noteFor('tr'));
    save('note.' + role + '.ru', noteFor('ru'));
    save('checkpoint', '');
    albumSection = 'concert';
    cityMode = 'after';
    cityDay(1);
    go('ending');
}
function tick(now) {
    if (!playing)
        return;
    const elapsed = now - start;
    if (elapsed >= beatCount * beatMs + windowMs + 60) {
        finish(false);
        return;
    }
    const phase = (Math.max(0, elapsed) % beatMs) / beatMs;
    const pad = element('pad');
    pad.style.setProperty('--scale', String(.43 + .57 * phase));
    pad.style.setProperty('--intensity', String(.3 + .7 * phase));
    pad.classList.toggle('ready', beatAt(elapsed) !== null);
    app.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('hit', hits.has(i));
        dot.classList.toggle('past', !hits.has(i) && elapsed > (i + 1) * beatMs + windowMs);
    });
    frame = requestAnimationFrame(tick);
}
async function play() {
    stop();
    const token = epoch;
    const button = element('pad');
    if (button instanceof HTMLButtonElement)
        button.disabled = true;
    if (sound) {
        try {
            await melody(cityProgress().intro);
        }
        catch {
            if (token === epoch) {
                draw();
                message('Ses açılamadı. Ses düğmesini kapatıp oynayabilirsin.', 'Не удалось включить звук. Отключи его и начни снова.');
            }
            return;
        }
    }
    if (token !== epoch)
        return;
    hits = new Set();
    playing = true;
    start = performance.now();
    draw();
    frame = requestAnimationFrame(tick);
}
let clipDay = false;
function rolePick(id) {
    if (!isRole(id))
        return;
    role = id;
    actor = pass().person;
    clipDay = false;
    resetCrewGame(role);
    go('time');
}
app.addEventListener('click', e => {
    const target = e.target;
    if (!(target instanceof Element))
        return;
    const act = target.closest('button[data-act]')?.dataset.act;
    if (!act)
        return;
    if (act === 'lang') {
        stop();
        lang = lang === 'tr' ? 'ru' : 'tr';
        save('lang', lang);
        feedback = '';
        draw();
        return;
    }
    if (act === 'home') {
        go('home');
        return;
    }
    if (act === 'album') {
        albumSection = 'concert';
        go('album');
        return;
    }
    if (act.startsWith('section-')) {
        albumSection = act.slice(8);
        go('album');
        return;
    }
    if (act === 'back') {
        go(back());
        return;
    }
    if (act === 'resume') {
        const progress = resumePoint();
        if (!progress)
            return;
        role = progress.role;
        actor = pass().person;
        remaining = progress.remaining;
        clipDay = false;
        cityMode = 'tour';
        if (!restoreCityCheckpoint()) {
            cityReset();
            cityDay(-remaining);
        }
        resetCrewGame(role);
        hits.clear();
        go(progress.page);
        return;
    }
    if (act === 'start') {
        roleGroup = 'all';
        go('passes');
        return;
    }
    if (act.startsWith('filter-')) {
        roleGroup = act.slice(7);
        draw();
        return;
    }
    if (act === 'random') {
        const fresh = order.filter(id => !album.includes(id));
        const deck = fresh.length ? fresh : order;
        const id = deck[Math.floor(Math.random() * deck.length)];
        if (id)
            rolePick(id);
        return;
    }
    if (act.startsWith('role-')) {
        rolePick(act.slice(5));
        return;
    }
    if (act.startsWith('days-')) {
        remaining = Number(act.slice(5));
        cityMode = 'tour';
        cityReset();
        cityDay(-remaining);
        go(remaining ? 'city' : 'brief');
        return;
    }
    if (act === 'city') {
        cityMode = 'free';
        go('city');
        return;
    }
    if (act === 'afterparty') {
        cityMode = 'after';
        cityDay(1);
        go('city');
        return;
    }
    if (act === 'clipday') {
        clipDay = true;
        resetCrewGame('director');
        go('crew');
        return;
    }
    if (act === 'city-continue') {
        if (cityMode !== 'tour') {
            go('home');
            return;
        }
        if (remaining === 0) {
            go('brief');
            return;
        }
        remaining--;
        cityDay(-remaining);
        go('city');
        return;
    }
    if (act === 'pets' || act === 'pets-pixel' || act === 'pet-visit') {
        petBack = page;
        if (act === 'pets')
            openPetLobby();
        else
            openPet(act === 'pets-pixel' ? 'pixel' : (actor === 'Rosé' ? 'rose' : actor.toLowerCase()));
        go('pets');
        return;
    }
    if (act === 'studio') {
        studioBack = page;
        studioMember = page === 'home' ? 'Lisa' : actor;
        go('studio');
        return;
    }
    if (act === 'studio-continue') {
        go(studioBack);
        return;
    }
    if (act.startsWith('artist-') && studioBack === 'home') {
        const selected = act.slice(7);
        if (Object.prototype.hasOwnProperty.call(memberIds, selected)) {
            studioMember = selected;
            draw();
        }
        return;
    }
    if (act === 'replay') {
        if (replayEncore())
            go('show');
        return;
    }
    if (act.startsWith('encore-') && encoreAction(act)) {
        draw();
        document.getElementById('encore-title')?.focus({ preventScroll: true });
        return;
    }
    if (act.startsWith('pet-') && petAction(act)) {
        draw();
        return;
    }
    if (act.startsWith('studio-') && studioAction(act, studioMember)) {
        draw();
        return;
    }
    if (act.startsWith('city-') && cityAction(act, role)) {
        if (cityMode === 'tour')
            saveCityCheckpoint();
        if (sound && (act === 'city-preview-drums' || act === 'city-preview-whisper'))
            void previewIntro(act === 'city-preview-drums' ? 'drums' : 'whisper');
        draw();
        return;
    }
    if (act === 'mission') {
        go(pass().item ? 'item' : 'cue');
        return;
    }
    if (act.startsWith('item-')) {
        if (act.slice(5) === pass().item)
            go('cue');
        else
            message('Bir daha bak. ' + pass().intro.tr, 'Посмотри ещё раз. ' + pass().intro.ru);
        return;
    }
    if (act.startsWith('answer-')) {
        if (Number(act.slice(7)) === pass().correct) {
            hits.clear();
            earnedPasses = cardIds([...earnedPasses, ...cardIds(read('earned')), role].join(','));
            save('earned', earnedPasses.join(','));
            go(hasCrewGame(role) ? 'crew' : 'stage');
        }
        else
            message(pass().hint.tr, pass().hint.ru);
        return;
    }
    const crewRole = clipDay ? 'director' : role;
    if (act === 'crew-continue' && isCrewGameComplete(crewRole)) {
        if (clipDay) {
            clipDay = false;
            albumSection = 'crew';
            go('album');
        }
        else {
            go('stage');
        }
        return;
    }
    if (act.startsWith('crew-') && crewAction(act, crewRole)) {
        draw();
        return;
    }
    if (act === 'sound') {
        sound = !sound;
        save('sound', sound ? 'on' : 'off');
        draw();
        return;
    }
    if (act === 'play') {
        void play();
        return;
    }
    if (act === 'tap') {
        const i = beatAt(performance.now() - start);
        if (i !== null && !hits.has(i)) {
            hits.add(i);
            element('count').textContent = hits.size + ' / ' + beatCount;
        }
        return;
    }
    if (act === 'pause') {
        stop();
        draw();
        message('Prova durdu. Başlat ile ölçüyü baştan al.', 'Пауза. Нажми «Старт», чтобы начать такт заново.');
        return;
    }
    if (act === 'relax') {
        finish(true);
        return;
    }
    if (act === 'collect') {
        collectCard();
        return;
    }
    if (act.startsWith('card-')) {
        role = act.slice(5);
        actor = pass().person;
        viewing = true;
        go('ending');
    }
});
document.addEventListener('visibilitychange', () => { if (document.hidden && page === 'stage') {
    stop();
    draw();
} });
draw();
