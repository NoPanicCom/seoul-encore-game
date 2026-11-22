import { renderLisaMic, mountLisaMic, resetLisaMic, lisaMicTaken, setLisaMicSoundEnabled } from './lisa-mic.js';
import { renderOfficialShow, mountOfficialShow } from './official-show.js';
import { initConcertTrack, activeConcertTrack, renderConcertTrack, mountConcertTrack, playConcertTrack, stopConcertTrack, setConcertTrackSound, concertTrackElapsed, isConcertTrackPlaying } from './concert-track.js';
import { items, passes, trips } from './story.js';
import { beatAt, beatCount, beatMs, cardIds, windowMs } from './rules.js';
import { worldAudio } from './world-audio.js';
import { melody, previewIntro, silence, setMusicEnabled } from './sound.js';
import { renderWorld, mountWorld, worldAlbum, worldChallenge, selectBackstageMember } from './world.js';
import { renderSeoulWalk, mountSeoulWalk, beginRoleWalk } from './seoul-walk.js';
import { renderHongdae, mountHongdae } from './hongdae.js';
import { renderBooth, mountBooth, boothAlbum, boothPhotoCount } from './booth.js';
import { shopSticks, isShopStick, stickId, renderMinho, renderLightResult, renderBlackout, secretPhotocard, lightBeat } from './lightstick.js';
import { encodeFanRecording, readFanRecording, renderFanReplay, mountFanReplay } from './fan-replay.js';
import { changeRoom, fastenJacket, hangJacket, jacketPhase, mountJacketDrag, releaseSnap, resetJacket, sendJennieBack, showFigure, startChange } from './mina-jacket.js';
import { trainPhase, dressVelvet, pinTrain, startStairs, resetTrain, velvetFitting, velvetBackstage, mountVelvetBackstage, velvetStairs, mountVelvetStairs, velvetStageFigure } from './soyeon-train.js';
import { resetYuna, yunaFitting, yunaRehearsal, yunaAction, yunaDressed, yunaCue, yunaFigure, mountYunaAim } from './yuna-light.js';
import { resetManagerMic, managerMicDone, renderManagerMic, mountManagerMic } from './manager-mic.js';
import { ariPhase, resetAri, ariAction, startAriBackstage, ariAsset, ariFitting, ariBackstage, mountAriZip, ariFigure } from './ari-bag.js';
import { concertCostume, travelLook, dressedFigure } from './travel-look.js';
import { renderPerformance } from './performance.js';
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
let walkedToConcert = false;
let arenaEntrance = 'walk';
let tripMember = 'lisa';
let unmountScene;
let role = 'ari';
let lisaTour = false;
let officialOrigin = 'home';
let unmountTrackPanel;
let tracksReady = false;
let roundTrack = null;
function lisaSongMode() {
    const preference = read('lisa-song-mode');
    if (preference === 'official' || preference === 'rhythm')
        return preference;
    return activeConcertTrack() ? 'rhythm' : 'official';
}
let walkRole = null;
let drawn = false;
let remaining = 0;
const memberIds = { Jisoo: 'jisoo', Jennie: 'jennie', 'Rosé': 'rose', Lisa: 'lisa' };
const previousPhotoMember = read('lastPhotoMember');
tripMember = Object.values(memberIds).find(member => member === previousPhotoMember) ?? 'lisa';
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
setMusicEnabled(sound);
setConcertTrackSound(sound);
setLisaMicSoundEnabled(sound);
function soundLabel() { return sound ? t('Ses açık', 'Звук вкл.') : t('Ses kapalı', 'Звук выкл.'); }
function changeSound(enabled) {
    sound = enabled;
    save('sound', sound ? 'on' : 'off');
    setMusicEnabled(sound);
    worldAudio.setEnabled(sound);
    setConcertTrackSound(sound);
    setLisaMicSoundEnabled(sound);
    if (sound && ['walk', 'world', 'hongdae', 'manager-mic'].includes(page))
        void worldAudio.enter();
    const button = app.querySelector('header [data-act="sound"]');
    if (button) {
        button.textContent = (sound ? '♫ ' : '○ ') + soundLabel();
        button.setAttribute('aria-pressed', String(sound));
    }
}
let album = cardIds(read('album'));
let lightstick = stickId(read('lightstick'));
let replay = null;
let secretTimes = [];
const ownedSticks = new Set(shopSticks.filter(id => read('bought.' + id) === '1' || lightstick === id));
function buyOrEquip(id) {
    if (!ownedSticks.has(id)) {
        save('bought.' + id, '1');
        ownedSticks.add(id);
    }
    lightstick = id;
    save('lightstick', id);
}
const fanCards = () => ['heart', 'moon', 'star', ...shopSticks].filter(id => readFanRecording(id, read('secret-card.' + id)) !== null);
let ariVenue = null;
let tourEncore = false;
let firstSongScore = 0;
let playing = false;
let listening = false;
let epoch = 0;
let start = 0;
let frame = 0;
let glowTimer = 0;
let hits = new Set();
let viewing = false;
let feedback = '';
function pass(id = role) {
    const p = passes[id];
    if (!p)
        throw new Error('pass');
    return p;
}
function stop() { window.clearTimeout(glowTimer); epoch++; playing = false; cancelAnimationFrame(frame); silence(); stopConcertTrack(); roundTrack = null; }
const checkpoints = ['city', 'brief', 'item', 'cue', 'crew', 'stage', 'manager-mic', 'lisa-mic'];
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
function stylistConcert(stylist) {
    return role === stylist && (walkedToConcert ? walkRole === stylist && arenaEntrance === 'walk' : cityMode === 'tour');
}
function stylistFitting(stylist) {
    return studioMember === passes[stylist]?.person && role === stylist && (studioBack === 'walk' || studioBack === 'brief' || studioBack === 'city' || studioBack === 'item');
}
function managerConcert(dest) {
    if (role !== 'manager' || (dest !== 'stage' && dest !== 'lightshow'))
        return false;
    return walkedToConcert ? walkRole === 'manager' && arenaEntrance === 'walk' : dest === 'stage' && cityMode === 'tour';
}
function lisaConcert(dest) {
    if (role !== 'lisa' || (dest !== 'stage' && dest !== 'lightshow'))
        return false;
    return walkedToConcert ? walkRole === 'lisa' && arenaEntrance === 'walk' : lisaTour && cityMode === 'tour' && dest === 'stage';
}
function go(next) {
    if (lisaConcert(next) && !lisaMicTaken())
        next = 'lisa-mic';
    if (managerConcert(next) && !managerMicDone())
        next = 'manager-mic';
    if ((next === 'stage' || next === 'lightshow') && stylistConcert('mina') && jacketPhase() === 'change')
        next = 'mina-change';
    if ((next === 'stage' || next === 'lightshow') && stylistConcert('soyeon') && (trainPhase() === 'dressed' || trainPhase() === 'pinned'))
        next = 'soyeon-change';
    if ((next === 'stage' || next === 'lightshow') && stylistConcert('ari') && ['backstage', 'open', 'dressed'].includes(ariPhase() ?? '')) {
        ariVenue = walkedToConcert ? 'arena' : 'tour';
        next = 'ari-change';
    }
    if (!['blackout', 'ari-change', 'secret'].includes(next))
        ariVenue = null;
    if (!ariVenue && !['official-show', 'lisa-mic', 'manager-mic', 'lightshow', 'stage', 'mina-change', 'soyeon-change', 'soyeon-stairs'].includes(next))
        walkedToConcert = false;
    if (!['stage', 'lightshow', 'secret', 'blackout', 'ari-change', 'mina-change', 'walk-bow'].includes(next))
        listening = false;
    if (next !== 'blackout' && next !== 'ari-change' && next !== 'secret')
        tourEncore = false;
    const hash = sceneHash(next);
    if (location.hash !== hash)
        history.replaceState(null, '', location.pathname + location.search + hash);
    stop();
    page = next;
    feedback = '';
    checkpoint(next);
    draw();
    window.scrollTo(0, 0);
}
function isTravelWardrobe() { return studioBack === 'world' || studioBack === 'hongdae'; }
function sceneHash(next) {
    if (next === 'official-show')
        return '#official-show/' + officialOrigin;
    if (next === 'lisa-mic' || lisaConcert(next))
        return (next === 'lisa-mic' ? '#lisa-mic/' : '#lisa-show/') + (walkedToConcert ? 'arena' : 'tour');
    if (next === 'manager-practice')
        return '#manager-practice/yg';
    if (next === 'manager-mic')
        return '#manager-mic/' + (walkedToConcert ? 'arena' : 'tour');
    if (managerConcert(next))
        return '#manager-show/' + (walkedToConcert ? 'arena' : 'tour');
    if (ariVenue && ['blackout', 'ari-change', 'secret'].includes(next))
        return '#ari-bis/' + ariVenue + '/' + next;
    if (next === 'studio' && stylistFitting('ari') && studioBack !== 'walk')
        return '#ari-fitting/' + studioBack;
    if ((next === 'stage' || next === 'lightshow') && stylistConcert('ari') && ariPhase() === 'packed')
        return '#ari-opening/' + (walkedToConcert ? 'arena' : 'tour');
    if (next === 'yuna-rehearsal')
        return '#yuna-rehearsal/' + studioBack;
    if (next === 'studio' && stylistFitting('yuna') && studioBack !== 'walk')
        return '#yuna-fitting/' + studioBack;
    if ((next === 'stage' || next === 'lightshow') && stylistConcert('yuna') && yunaDressed())
        return '#yuna-show/' + (walkedToConcert ? 'arena' : 'tour');
    if ((next === 'stage' || next === 'lightshow' || next === 'mina-change') && stylistConcert('mina') && jacketPhase())
        return '#mina-show/' + (walkedToConcert ? 'arena' : 'tour');
    if (stylistConcert('soyeon') && trainPhase() && ['stage', 'lightshow', 'soyeon-change', 'soyeon-stairs'].includes(next)) {
        return (next === 'soyeon-stairs' ? '#soyeon-stairs/' : '#soyeon-show/') + (walkedToConcert ? 'arena' : 'tour');
    }
    if (next === 'studio' && stylistFitting('soyeon') && studioBack !== 'walk')
        return '#soyeon-fitting/' + studioBack;
    if (next === 'studio' && stylistFitting('mina') && studioBack !== 'walk')
        return '#mina-fitting/' + studioBack;
    if (walkedToConcert && (next === 'lightshow' || next === 'stage'))
        return arenaEntrance === 'home' ? '#concert' : '#arena-live' + (walkRole ? '/' + walkRole : '');
    if (next === 'walk' || next === 'walk-bow')
        return '#walk-city' + (walkRole ? '/' + walkRole : '');
    if (next === 'time')
        return '#role/' + role + (drawn ? '/draw' : '');
    if (next === 'world')
        return '#play';
    if (next === 'fan-replay' || next === 'light-result' || (next === 'album' && albumSection === 'concert'))
        return '#concert-album/' + tripMember;
    if (next === 'blackout' || next === 'secret')
        return '#secret/' + tripMember;
    if (next === 'minho' || next === 'lightshow' || next === 'hongdae' || next === 'booth')
        return '#' + next + '/' + tripMember;
    if (next === 'studio' && studioBack === 'home')
        return '#gallery/' + (memberIds[studioMember] ?? 'lisa');
    if (next === 'album' && albumSection === 'hongdae')
        return '#hongdae-album/' + tripMember;
    if (next === 'studio' && studioBack === 'walk' && walkRole)
        return '#fitting/' + walkRole;
    if (next === 'studio' && isTravelWardrobe())
        return '#wardrobe/' + studioBack + '/' + tripMember;
    return '';
}
function restoreScene() {
    ariVenue = null;
    const [place, first, second] = location.hash.slice(1).split('/');
    if (place === 'official-show' && first === 'home') {
        officialOrigin = 'home';
        return 'official-show';
    }
    if ((place === 'lisa-mic' || place === 'lisa-show' || place === 'official-show') && (first === 'arena' || first === 'tour')) {
        role = 'lisa';
        actor = 'Lisa';
        tripMember = 'lisa';
        lisaTour = true;
        walkedToConcert = first === 'arena';
        walkRole = walkedToConcert ? role : null;
        arenaEntrance = 'walk';
        cityMode = walkedToConcert ? 'free' : 'tour';
        if (!walkedToConcert)
            restoreCityCheckpoint();
        if (place === 'lisa-mic' || !lisaMicTaken())
            return 'lisa-mic';
        if (place === 'official-show') {
            officialOrigin = first;
            return 'official-show';
        }
        return walkedToConcert && lightstick ? 'lightshow' : 'stage';
    }
    if (place === 'manager-practice' && first === 'yg') {
        role = 'manager';
        walkRole = role;
        actor = 'Lisa';
        tripMember = 'lisa';
        cityMode = 'free';
        return 'manager-practice';
    }
    if ((place === 'manager-mic' || place === 'manager-show') && (first === 'arena' || first === 'tour')) {
        role = 'manager';
        actor = 'Lisa';
        tripMember = 'lisa';
        walkedToConcert = first === 'arena';
        walkRole = walkedToConcert ? role : null;
        arenaEntrance = 'walk';
        cityMode = walkedToConcert ? 'free' : 'tour';
        if (!walkedToConcert)
            restoreCityCheckpoint();
        if (place === 'manager-mic' || !managerMicDone())
            return 'manager-mic';
        return walkedToConcert && lightstick ? 'lightshow' : 'stage';
    }
    if (place === 'ari-fitting' && (first === 'item' || first === 'brief' || first === 'city')) {
        role = 'ari';
        actor = 'Lisa';
        studioMember = actor;
        studioBack = first;
        cityMode = 'tour';
        return 'studio';
    }
    if ((place === 'ari-opening' || place === 'ari-bis') && (first === 'arena' || first === 'tour')) {
        role = 'ari';
        actor = 'Lisa';
        tripMember = 'lisa';
        walkedToConcert = first === 'arena';
        arenaEntrance = 'walk';
        walkRole = walkedToConcert ? role : null;
        cityMode = walkedToConcert ? 'free' : 'tour';
        const phase = ariPhase();
        if (place === 'ari-bis' && phase && phase !== 'preparing') {
            ariVenue = first;
            tourEncore = first === 'tour';
            const [points, mode] = (read('ari-show-meta') ?? '').split('|');
            firstSongScore = Math.min(beatCount, Math.max(0, Number(points) || 0));
            listening = mode === 'listen';
            if (phase === 'packed')
                return 'blackout';
            return phase === 'encore' ? 'secret' : 'ari-change';
        }
        return walkedToConcert && lightstick ? 'lightshow' : 'stage';
    }
    if ((place === 'yuna-fitting' || place === 'yuna-rehearsal') && (first === 'walk' || first === 'item' || first === 'brief' || first === 'city')) {
        role = 'yuna';
        actor = 'Rosé';
        tripMember = 'rose';
        studioMember = actor;
        studioBack = first;
        walkRole = first === 'walk' ? role : null;
        cityMode = first === 'walk' ? 'free' : 'tour';
        return place === 'yuna-rehearsal' && yunaDressed() ? 'yuna-rehearsal' : 'studio';
    }
    if (place === 'yuna-show' && (first === 'arena' || first === 'tour')) {
        role = 'yuna';
        actor = 'Rosé';
        tripMember = 'rose';
        walkedToConcert = first === 'arena';
        walkRole = walkedToConcert ? role : null;
        arenaEntrance = 'walk';
        cityMode = walkedToConcert ? 'free' : 'tour';
        return walkedToConcert && lightstick ? 'lightshow' : 'stage';
    }
    if ((place === 'soyeon-show' || place === 'soyeon-stairs') && (first === 'arena' || first === 'tour')) {
        role = 'soyeon';
        actor = 'Jisoo';
        tripMember = 'jisoo';
        walkedToConcert = first === 'arena';
        walkRole = walkedToConcert ? role : null;
        arenaEntrance = 'walk';
        cityMode = walkedToConcert ? 'free' : 'tour';
        if (trainPhase() === 'pinned' || trainPhase() === 'dressed')
            return 'soyeon-change';
        if (place === 'soyeon-stairs' && trainPhase() === 'stage')
            return 'soyeon-stairs';
        return walkedToConcert && lightstick ? 'lightshow' : 'stage';
    }
    if (place === 'soyeon-fitting' && (first === 'item' || first === 'brief' || first === 'city')) {
        role = 'soyeon';
        actor = 'Jisoo';
        studioMember = actor;
        studioBack = first;
        cityMode = 'tour';
        return 'studio';
    }
    if (place === 'mina-fitting' && (first === 'brief' || first === 'city' || first === 'item')) {
        role = 'mina';
        actor = 'Jennie';
        studioMember = actor;
        studioBack = first;
        cityMode = 'tour';
        return 'studio';
    }
    if (place === 'mina-show' && (first === 'arena' || first === 'tour')) {
        role = 'mina';
        actor = 'Jennie';
        tripMember = 'jennie';
        walkedToConcert = first === 'arena';
        walkRole = walkedToConcert ? 'mina' : null;
        arenaEntrance = 'walk';
        cityMode = walkedToConcert ? 'free' : 'tour';
        if (jacketPhase() === 'change')
            return 'mina-change';
        return walkedToConcert && lightstick ? 'lightshow' : 'stage';
    }
    if (place === 'walk-city' || place === 'arena-live' || place === 'concert' || place === 'fitting') {
        walkRole = place !== 'concert' && first && isRole(first) ? first : null;
        if (walkRole) {
            role = walkRole;
            actor = pass().person;
            tripMember = memberIds[actor] ?? 'lisa';
        }
        if (place === 'fitting' && walkRole) {
            studioBack = 'walk';
            studioMember = actor;
            return 'studio';
        }
    }
    if (place === 'arena-live' || place === 'concert') {
        arenaEntrance = place === 'concert' ? 'home' : 'walk';
        walkedToConcert = true;
        if (!walkRole) {
            role = 'blink';
            actor = 'Lisa';
            tripMember = 'lisa';
        }
        cityMode = 'free';
        if (walkRole === 'lisa' && !lisaMicTaken())
            return 'lisa-mic';
        if (walkRole === 'manager' && !managerMicDone())
            return 'manager-mic';
        return lightstick ? 'lightshow' : 'stage';
    }
    if (place === 'walk-city')
        return 'walk';
    if (place === 'seoul-walk')
        return 'home';
    if (place === 'play')
        return 'world';
    if (place === 'role' && first && isRole(first)) {
        drawn = second === 'draw';
        role = first;
        actor = pass().person;
        resetCrewGame(role);
        return 'time';
    }
    const key = place === 'wardrobe' ? second : first;
    const member = Object.values(memberIds).find(value => value === key);
    if (!member)
        return 'home';
    tripMember = member;
    if (place === 'gallery') {
        studioMember = pass(member).person;
        studioBack = 'home';
        return 'studio';
    }
    if (place === 'concert-album') {
        albumSection = 'concert';
        return 'album';
    }
    if (place === 'secret')
        return lightstick ? 'secret' : 'minho';
    if (place === 'lightshow')
        return lightstick ? 'lightshow' : 'minho';
    if (place === 'minho' || place === 'hongdae' || place === 'booth')
        return place;
    if (place === 'hongdae-album') {
        albumSection = 'hongdae';
        return 'album';
    }
    if (place === 'wardrobe' && (first === 'world' || first === 'hongdae')) {
        studioBack = first;
        studioMember = pass(member).person;
        return 'studio';
    }
    return 'home';
}
function openTravelWardrobe(member, from) {
    tripMember = member;
    studioMember = pass(member).person;
    studioBack = from;
    go('studio');
}
function action(id, label, style = 'primary') { return `<button class="${style}" data-act="${id}">${label}</button>`; }
function photo(file, alt = '', cls = '') { return `<img class="${cls}" src="art/${file}.webp" alt="${alt}">`; }
const albumTitle = () => t('Fotoğraf albümüm', 'Мой фотоальбом');
function home() {
    const progress = resumePoint();
    const p = progress ? passes[progress.role] : null;
    const resumeLabel = p ? t('Turneme dön', 'Продолжить тур') + ' · ' + p.job[lang] : '';
    return renderLobby(lang, album.length, Object.keys(passes).length, hasEncoreReplay(), resumeLabel, boothPhotoCount() + fanCards().length);
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
    const p = pass();
    const label = stylistRoles.includes(role) ? (lang === 'ru' ? 'Стилист · ' : 'Stilist · ') + p.person : p.job[lang];
    return `<section class="drawn-pass" data-role="${role}">${role === 'blink' ? '<span aria-hidden="true">♥</span>' : photo(role === 'light' ? 'light' : p.photo, '')}<div><small>${t('Senin rolün', 'Твоя роль')}</small><h2>${roleFamily(role) === 'team' && role !== 'blink' ? p.job[lang] : p.name}</h2><b>${roleFamily(role) === 'team' && role !== 'blink' ? 'BLACKPINK' : label}</b><p>${p.intro[lang]}</p></div></section>
  ${role === 'lisa' ? '<div class="lisa-music-choices" role="group" aria-label="BLACKPINK"><h3>' + t('Mikrofonu aldığında', 'Когда возьмёшь микрофон') + '</h3>' + ['official', 'rhythm'].map(mode => '<button class="option" data-act="lisa-mode-' + mode + '" aria-pressed="' + (lisaSongMode() === mode) + '">' + (mode === 'official' ? t('Resmî klibi seç · YouTube', 'Выбрать клип · YouTube') : t('Ritim oyununda söyle', 'Вступить в песню в ритм-игре')) + '</button>').join('') + '</div>' : ''}
  <h2>${t('Seul’e ne zaman gelelim?', 'Когда приедем в Сеул?')}</h2><p class="intro">${t('Seul’e erken gelirsen YG’ye yürüyüp konser için hazırlanabilirsin.', 'Приезжай заранее, чтобы прогуляться до YG и подготовиться к концерту.')}</p>
  <div class="stack">${drawn ? '' : action('enter-role-city', t('Bu karakterle Seul’de yürü', 'Гулять по Сеулу за этого героя'), 'primary')}${[t('İki gün önce · Şehri gez', 'За два дня · Погулять'), t('Bir gün önce · Son prova', 'За день · Репетиция'), t('Doğrudan konsere', 'Сразу на концерт')].map((label, i) => action('days-' + (2 - i), label + ' →', 'option')).join('')}</div>`;
}
function studioScreen() {
    const choose = studioBack === 'home'
        ? `<div class="segmented">${Object.keys(memberIds).map(name => action('artist-' + name, name, name === studioMember ? 'chosen' : '')).join('')}</div>` : '';
    const travelExit = isTravelWardrobe() ? action('trip-street', t('Pixel ile Hongdae’ye çık', 'На прогулку с Пикселем'), 'trip-exit') : '';
    const costume = studioBack === 'walk' ? concertCostume(studioMember) : '';
    if (stylistFitting('ari'))
        return ariFitting(lang) + renderStudio(lang, studioMember);
    if (stylistFitting('yuna'))
        return yunaFitting(lang) + renderStudio(lang, studioMember);
    if (stylistFitting('soyeon'))
        return velvetFitting(lang) + renderStudio(lang, studioMember);
    if (stylistFitting('mina')) {
        const under = concertCostume('Jennie');
        const ready = jacketPhase() === 'opening';
        const cue = ready ? t('İlk şarkı için ceket iliklendi. Finalden önce çıtçıtları sen açacaksın.', 'Жакет застёгнут для первой песни. Перед финалом ты расстегнёшь кнопки.') : under ? t('Final kıyafeti hazır. İlk şarkı için üstüne pembe ceketi giydir.', 'Образ для финала готов. Надень сверху розовый жакет для первой песни.') : t('Önce aşağıdan Jennie’nin final kıyafetini seç.', 'Сначала выбери ниже наряд Дженни для финальной песни.');
        const attach = ready ? '' : `<button type="button" class="primary" data-act="fasten-jacket" ${under ? '' : 'disabled'}>${t('Pembe ceketi giydir', 'Надеть розовый жакет')}</button>`;
        return `<section class="mina-fitting"><div class="fitting-cue">${ready ? showFigure() : under}<p>${cue}</p></div></section>` + renderStudio(lang, studioMember, attach);
    }
    const fitting = studioBack === 'walk' ? `<div class="fitting-cue">${costume}<p>${costume ? t(studioMember + ' bu kıyafetle sahneye çıkacak.', studioMember + ' выйдет на сцену в этом образе.') : t(studioMember + ' için sahne kostümünü seç.', 'Подбери сценический костюм для ' + studioMember + '.')}</p></div>` : '';
    return choose + fitting + renderStudio(lang, studioMember) + travelExit;
}
function cityScreen() {
    const route = cityMode === 'tour' ? (stylistRoles.includes(role) ? action('studio', t(actor + ' için kostüm hazırla', 'Подготовить костюм для ' + actor), 'walk-entry secondary') : '') : action('walk', t('Sofia ile Seul’de yürü', 'Гулять по Сеулу за Софию'), 'walk-entry secondary');
    const walk = cityMode === 'free' ? action('trip-street', '<strong>Hongdae</strong><span>' + t('Pixel ile fotoğraf yürüyüşü', 'Фотопрогулка с Пикселем') + '</span>', 'trip-invite') : '';
    return route + walk + renderCity(lang, role, cityMode !== 'tour');
}
function brief() {
    const p = pass();
    return `${photo(memberRoles.includes(role) ? (stageLook(p.person, 'rehearsal') ?? p.photo) : (role === 'light' ? 'light' : p.photo), '', 'portrait')}<p class="kicker">${p.job[lang]} / ${p.person}</p><h2>${t('Sıra sende.', 'Твой выход.')}</h2><p>${p.intro[lang]}</p>${action('mission', t('Göreve başla', 'Начать задание'))}${role === 'manager' ? action('manager-rehearse', t('Önce ekiple akışı prova et', 'Сначала отрепетировать порядок выхода'), 'secondary') : ''}${action('studio', t('Sahne kostümü seç', 'Выбрать сценический наряд'), 'secondary')}${action('pet-visit', t('Provadan önce patili dostuna uğra', 'Заглянуть к питомцу перед репетицией'), 'secondary')}`;
}
function itemsPage() {
    return `<h2>${t('Son parça', 'Последняя деталь')}</h2><p class="intro">${pass().intro[lang]}</p><div class="items">${items.map(item => action('item-' + item.id, `${photo(item.id)}<span>${item.label[lang]}</span>`, 'item')).join('')}</div>`;
}
function cuePage() {
    const p = pass();
    return `<p class="kicker">${p.job[lang]} / ${p.person}</p><h2>${t('Çıkışa iki dakika', 'Две минуты до выхода')}</h2><p class="intro">${p.item ? p.hint[lang] : p.intro[lang]}</p><div class="stack">${p.choices.map((choice, i) => action('answer-' + i, choice[lang], 'option')).join('')}</div>`;
}
function lisaWithMicrophone(playingLisa) {
    const outfit = travelLook('Lisa');
    const look = outfit && (outfit.pieces.length || !outfit.asset.startsWith('world/')) ? outfit : { asset: 'travel/lisa-soundcheck', pieces: [] };
    const marker = playingLisa ? 'data-lisa-microphone' : 'data-manager-microphone';
    return dressedFigure(look, `<span class="manager-stage-mic" ${marker} role="img" aria-label="${t('Yedek mikrofon', 'Запасной микрофон')}"></span>`);
}
function officialShow() {
    if (officialOrigin === 'home')
        return renderOfficialShow(lang, false);
    const stage = renderPerformance('lisa', lang, true, worldChallenge('lisa', 'light'), lightstick, false, true, { lisa: lisaWithMicrophone(true) });
    return renderOfficialShow(lang, true, stage);
}
function stage() {
    const p = pass();
    const secret = page === 'secret';
    const fromShop = page === 'lightshow' || secret || walkedToConcert;
    const performer = secret ? 'lisa' : fromShop ? tripMember : (memberIds[p.person] ?? 'lisa');
    const jacket = !secret && stylistConcert('mina') ? jacketPhase() : undefined;
    const velvet = !secret && stylistConcert('soyeon') && trainPhase() === 'stage';
    const roseDressed = !secret && stylistConcert('yuna') && yunaDressed();
    const packed = !secret && stylistConcert('ari') && ariPhase() === 'packed';
    const ariSolo = secret && ariVenue !== null && ariPhase() === 'encore';
    let lisa = '';
    const micDelivered = managerConcert(page) && managerMicDone();
    const lisaDelivered = lisaConcert(page) && lisaMicTaken();
    if (micDelivered || lisaDelivered) {
        lisa = lisaWithMicrophone(lisaDelivered);
    }
    else if (ariSolo)
        lisa = ariFigure(lang);
    else if (packed && travelLook('Lisa')?.asset === ariAsset())
        lisa = dressedFigure({ asset: 'travel/lisa-soundcheck', pieces: [] });
    const roseCue = roseDressed ? yunaCue() : null;
    const title = jacket === 'final' ? t('BLACKPINK · Final şarkısı', 'BLACKPINK · Финальная песня') : jacket === 'opening' ? t('BLACKPINK · Açılış şarkısı', 'BLACKPINK · Первая песня') : secret ? t('Lisa’nın gizli bisi', 'Секретный бис Лисы') : t('BLACKPINK konseri', 'Концерт BLACKPINK');
    const description = lisaDelivered ? t('Mikrofon elinde, Lisa! İlk nakarata ritimle gir.', 'Микрофон у тебя, Лиса! Вступай в припев в такт.') : micDelivered ? t('Lisa mikrofonu senden aldı! Dansın son adımıyla ilk nakarata giriyor.', 'Лиса взяла у тебя микрофон! Последний танцевальный шаг — и начинается припев.') : ariSolo ? t('Lisa, kılıfta sakladığın kıyafetle sahnede! Son nakarata sen de eşlik et.', 'Лиса вышла в наряде, который ты спрятала в чехле! Лови ритм последнего припева.') : packed ? t('Kılıf kuliste seni bekliyor. BLACKPINK ile açılış şarkısına eşlik et.', 'Чехол ждёт тебя за кулисами. А пока поймай ритм первой песни BLACKPINK.') : roseCue ? t('Provada seçtiğin spot Rosé’yi buldu. Çizmeleri ilk adımında parlıyor!', 'Твой свет поймал Розэ. На первом же шаге её сапоги засияли!') : velvet ? t('Jisoo merdivenleri çıktı! Hazırladığın bordo kadife elbiseyle sahnede.', 'Джису поднялась по ступенькам! На ней бордовое бархатное платье, которое ты подготовила.') : jacket === 'final' ? t('Jennie, hazırladığın ikinci kıyafetle sahnede. Son nakarata eşlik et!', 'Дженни вернулась в твоём втором образе. Лови ритм последнего припева!') : jacket === 'opening' ? t('Jennie pembe ceketiyle sahnede. Şarkı bitince kuliste buluşun.', 'Дженни вышла в розовом жакете. После песни встречайтесь за кулисами.') : secret ? t('Lisa geri döndü! Yıldız halkaya ulaşınca dokun, bütün salon senin renginde yansın.', 'Лиса вернулась! Коснись лайтстика, когда звезда дойдёт до кольца, и весь зал засияет твоим цветом.') : fromShop ? t('Jisoo, Jennie, Rosé ve Lisa sahnede! Yıldız halkaya gelince ritme dokun.', 'На сцене Джису, Дженни, Розэ и Лиса! Когда звезда дойдёт до круга, нажми в такт.') : p.result[lang];
    const watching = playing && listening;
    const mix = secret ? 'Afterglow' : jacket === 'final' ? 'Pink Horizon' : 'Seoul Lights';
    const track = roundTrack ?? activeConcertTrack();
    const credit = track ? t('Cihazındaki kayıt', 'Запись с устройства') + ' · ' + escapeText(track.name) : t('Oyun için bestelenen müzik', 'Музыка для игры') + ' · ' + mix;
    const scene = renderPerformance(performer, lang, playing, worldChallenge(performer, 'light'), lightstick, secret, watching, {
        lisa, jennie: jacket ? showFigure() : '', jisoo: velvet ? velvetStageFigure(lang) : '', rose: roseDressed ? yunaFigure(lang) : ''
    }, roseCue);
    if (watching)
        return `<div class="stage live-stage watch-concert" data-playing="true" data-mode="listen">${scene}<h2>${title}</h2><p>${credit}</p><progress id="concert-time" max="${beatCount * (track?.beatMs ?? beatMs)}" value="0" aria-label="${t('Şarkı', 'Песня')}"></progress>${action('pause', t('Duraklat', 'Пауза'), 'secondary')}</div>`;
    return `<div class="stage live-stage" data-playing="${playing}">${scene}${!fromShop && !roseDressed && !packed && stageLook(p.person, 'rehearsal') ? photo(stageLook(p.person, 'rehearsal') ?? p.card, p.person, 'rhythm-look') : ''}<span class="kicker">${credit}</span><h2>${title}</h2><p>${description}</p><div class="dots" aria-hidden="true">${'<i class="dot"></i>'.repeat(beatCount)}</div>
  <button id="pad" class="disc" data-act="${playing ? 'tap' : 'play'}">${playing ? t('Ritme vur', 'В такт') : t('Ritim oyunu ▶', 'Играть в ритм ▶')}</button>
  <p id="count" class="mono">0 / ${beatCount}</p>${lightstick ? '<p class="light-feedback" id="light-feedback" role="status"></p>' : ''}</div>
  ${fromShop ? '' : '<p class="intro">' + t('İç halka büyüyüp kenara vardığında dokun. Kaçırırsan sıradaki vuruştan devam et.', 'Нажимай, когда кольцо дорастёт до края. Если пропустишь, лови следующий удар.') + '</p>'}
  ${playing ? '' : action('listen', t('Konseri sadece izle ve dinle', 'Смотреть и слушать концерт'), 'secondary')}
  ${playing ? action('pause', t('Duraklat', 'Пауза'), 'secondary') : ''}
  ${playing || fromShop ? '' : action('relax', t('Süre tutmadan finali izle', 'Посмотреть финал без таймера'), 'secondary')}
  ${playing ? '' : `<details class="concert-videos"><summary>${t('BLACKPINK’in resmî klipleri', 'Официальные клипы BLACKPINK')}</summary><a href="https://www.youtube.com/watch?v=gQlMMD8auMs" target="_blank" rel="noopener noreferrer">Pink Venom · YouTube ↗</a><a href="https://www.youtube.com/watch?v=POe9SOEKotk" target="_blank" rel="noopener noreferrer">Shut Down · YouTube ↗</a></details>`}`;
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
    return `<p class="kicker">${t('Konser hatırası', 'На память о концерте')}</p><h2>${t('Bir kez daha!', 'На бис!')}</h2><div class="memcard">${photo(memoryLook(role), p.person)}<strong>${p.person}</strong><small class="mono">SEOUL ENCORE · ${p.job[lang]}</small></div><p>${read('signal.' + role) ? signalTitle(read('signal.' + role)) + ' · ' + (role === 'ari' ? p.finale : p.result)[lang] : p.finale[lang]}</p><div class="log">${p.name} · ${p.job[lang]}<br>${storedScore()}<br>${memories()}</div>
  ${action('pet-visit', t('Konserden sonra eve uğra', 'Навестить питомца после шоу'))}${action('afterparty', t('Ertesi gün · Turneye devam', 'На следующий день · Продолжить тур'), 'secondary')}${action('clipday', t('Klip çekim gününe katıl', 'Остаться на съёмки клипа'), 'secondary')}${action('album', albumTitle(), 'secondary')}${action('start', t('Başka bir kartla oyna', 'Играть с другим пропуском'), 'secondary')}`;
}
function albumPage() {
    const tabs = [['concert', t('Konser', 'Концерт')], ['pets', t('Patiler', 'Питомцы')], ['city', t('Şehir', 'Город')], ['hongdae', t('Fotokabin', 'Фотобудка')], ['studio', t('Stil', 'Стиль')], ['crew', t('Ekip', 'Команда')], ['world', t('Kulis', 'Гримёрка')]];
    const special = fanCards();
    const concertCards = `${special.length ? '<div class="foil-album">' + special.map(id => secretPhotocard(lang, id, true)).join('') + '</div>' : ''}<div class="album">${album.map(id => {
        const p = passes[id];
        if (!p)
            throw new Error(id);
        return action('card-' + id, `${photo(memoryLook(id))}<span>${p.person} · ${p.job[lang]}</span>`, 'collect');
    }).join('')}</div>${album.length || special.length ? '' : `<p class="intro">${t('İlk konserini bitirince fotoğraf kartın buraya gelecek.', 'Заверши концерт, чтобы получить первую фотокарточку.')}</p>`}${hasEncoreReplay() ? action('replay', t('Son konseri yeniden izle', 'Посмотреть запись концерта'), 'secondary') : ''}${action('start', t('Kulis kartı seç', 'Выбрать пропуск'))}`;
    const sections = { hongdae: () => boothAlbum(lang) + action('trip-street', t('Hongdae’ye dön', 'Вернуться в Хондэ'), 'trip-exit'), concert: () => concertCards, pets: () => petAlbum(lang), studio: () => studioAlbum(lang), city: () => cityAlbum(lang), crew: () => crewAlbum(lang), world: () => {
            const cards = worldAlbum(lang);
            return (cards.length ? '<div class="world-album">' + cards.map(card => `<figure class="world-album-card"><img src="${card.image}" alt=""><figcaption><strong>${card.title}</strong><small>${card.subtitle}</small></figcaption></figure>`).join('') + '</div>' : '<p>' + t('Kulis provasını tamamlayınca ilk hatıran buraya gelir.', 'Закончи репетицию за кулисами, и здесь появится твоя карточка.') + '</p>') + action('world', t('Kulise gir', 'Войти за кулисы'));
        } };
    return `<h2>${albumTitle()}</h2><div class="segmented">${tabs.map(([id, name]) => action('section-' + id, String(name), albumSection === id ? 'chosen' : '')).join('')}</div>${sections[albumSection]?.() ?? concertCards}`;
}
function back() {
    if (page === 'official-show')
        return officialOrigin === 'home' ? 'home' : walkedToConcert ? 'walk' : 'brief';
    if (page === 'lisa-mic')
        return walkedToConcert ? 'walk' : 'brief';
    if (ariVenue && page === 'ari-change')
        return ariVenue === 'arena' ? 'walk' : 'brief';
    if (walkedToConcert || page === 'walk-bow')
        return arenaEntrance;
    if (page === 'manager-practice')
        return 'walk';
    if (page === 'manager-mic')
        return 'brief';
    if (page === 'yuna-rehearsal')
        return 'studio';
    if (page === 'mina-change' || page === 'soyeon-change' || page === 'soyeon-stairs')
        return 'brief';
    if (page === 'fan-replay')
        return 'album';
    if (page === 'album' && albumSection === 'hongdae' || page === 'booth')
        return 'hongdae';
    if (page === 'minho' || page === 'light-result')
        return 'hongdae';
    if (page === 'lightshow' || page === 'blackout' || page === 'secret')
        return 'minho';
    if (page === 'hongdae')
        return 'world';
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
    unmountTrackPanel?.();
    unmountTrackPanel = undefined;
    unmountScene?.();
    unmountScene = undefined;
    app.dataset.page = page;
    document.documentElement.lang = lang;
    const trackPanel = ['home', 'time'].includes(page) || (!playing && ['stage', 'lightshow', 'secret'].includes(page));
    const screens = { 'official-show': officialShow, 'lisa-mic': () => renderLisaMic(lang), 'manager-practice': () => renderCrewGame(lang, 'manager', true), 'manager-mic': () => renderManagerMic(lang), 'ari-change': () => ariBackstage(lang), 'yuna-rehearsal': () => yunaRehearsal(lang), 'soyeon-change': () => velvetBackstage(lang), 'soyeon-stairs': () => velvetStairs(lang), 'mina-change': () => changeRoom(lang), home, walk: renderSeoulWalk, 'walk-bow': () => `<section class="walk-bow"><img src="art/mainstage.webp" alt=""><h2>${t('BLACKPINK sahneden selam veriyor', 'BLACKPINK на поклоне')}</h2><p>${listening ? t('Sahne ışıkları söndü. Seul’den iyi geceler!', 'Свет на сцене погас. Спокойной ночи, Сеул!') : t('Konserde yakaladığın vuruşlar', 'Твои попадания в такт') + ' · ' + hits.size + ' / ' + beatCount}</p>${arenaEntrance === 'home' ? action('home', t('Ana ekrana dön', 'На главную')) : action('walk', t('Arena meydanına dön', 'Вернуться на площадь'))}</section>`, world: () => renderWorld(lang) + action('walk', t('Sofia ile Seul’de yürü', 'Гулять по Сеулу за Софию'), 'walk-entry secondary'), minho: () => renderMinho(lang, lightstick, ownedSticks), lightshow: stage, secret: stage, 'fan-replay': () => replay ? renderFanReplay(lang, replay) : albumPage(), blackout: () => renderBlackout(lang), 'light-result': () => lightstick ? renderLightResult(lang, lightstick, hits.size, beatCount) : renderMinho(lang, lightstick, ownedSticks), hongdae: () => renderHongdae(lang, tripMember) + action('walk', t('Sofia ile Seul’de yürü', 'Гулять по Сеулу за Софию'), 'walk-entry secondary'), booth: () => renderBooth(lang, tripMember), passes: roles, time: clockPage, city: cityScreen, pets: () => renderPets(lang), studio: studioScreen, crew: () => renderCrewGame(lang, clipDay ? 'director' : role), brief, item: itemsPage, cue: cuePage, stage, show: () => renderEncore(lang), ending, album: albumPage };
    app.innerHTML = `<header><button class="brand" data-act="home" aria-label="${t('Ana ekran', 'Главная')}"><b>✳</b> encore</button><button type="button" class="audio-switch" data-act="sound" aria-pressed="${sound}">${sound ? '♫ ' : '○ '}${soundLabel()}</button><button class="lang" data-act="lang" aria-label="Türkçe / Русский">${lang === 'tr' ? 'TR <span>/ РУ</span>' : '<span>TR /</span> РУ'}</button></header><main>${['home', 'walk', 'world', 'hongdae', 'booth', 'minho', 'blackout', 'light-result', 'fan-replay'].includes(page) ? '' : `<div class="subhead">${action('back', back() === 'home' ? t('‹ Ana ekran', '‹ Главная') : t('‹ Geri', '‹ Назад'), 'smallbtn')}<span class="cardno">${(['official-show', 'lisa-mic', 'lightshow', 'secret'].includes(page)) ? 'SEOUL LIVE' : ['passes', 'album', 'pets', 'city', 'studio'].includes(page) ? 'SEOUL ENCORE' : pass().name + ' / SEOUL'}</span></div>`}${screens[page]()}${trackPanel ? renderConcertTrack(lang) : ''}<div id="feedback" class="notice" role="status"></div></main>`;
    if (!tracksReady)
        app.querySelectorAll('[data-act="play"],[data-act="listen"],[data-act^="watch-fan-"]').forEach(button => button.disabled = true);
    element('feedback').textContent = feedback;
    if (trackPanel)
        unmountTrackPanel = mountConcertTrack(app, lang, draw);
    if (page === 'lisa-mic')
        unmountScene = mountLisaMic(app, lang);
    else if (page === 'official-show')
        unmountScene = mountOfficialShow(app);
    else if (page === 'manager-mic') {
        worldAudio.setEnabled(sound);
        unmountScene = mountManagerMic(app, lang);
    }
    else if (page === 'ari-change') {
        unmountScene = mountAriZip(app, draw);
    }
    else if (page === 'yuna-rehearsal') {
        unmountScene = mountYunaAim(app, draw);
    }
    else if (page === 'soyeon-change') {
        unmountScene = mountVelvetBackstage(app);
    }
    else if (page === 'soyeon-stairs') {
        unmountScene = mountVelvetStairs(app, () => go(walkedToConcert && lightstick ? 'lightshow' : 'stage'));
    }
    else if (page === 'mina-change') {
        unmountScene = mountJacketDrag(app, () => { if (hangJacket())
            draw(); });
    }
    else if (page === 'walk') {
        unmountScene = mountSeoulWalk(lang, sound, lightstick, ownedSticks, buyOrEquip, () => {
            role = walkRole ?? 'blink';
            actor = pass().person;
            tripMember = memberIds[actor] ?? 'lisa';
            cityMode = 'free';
            clipDay = false;
            remaining = 0;
            hits.clear();
            arenaEntrance = 'walk';
            walkedToConcert = true;
            go(lightstick ? 'lightshow' : 'stage');
        }, walkRole ? { id: walkRole, openWardrobe: () => { studioBack = 'walk'; studioMember = actor; go('studio'); },
            lightDesk: () => { studioMember = actor; studioBack = 'walk'; go(yunaDressed() ? 'yuna-rehearsal' : 'studio'); },
            mission: () => {
                if (walkRole === 'manager') {
                    resetCrewGame('manager');
                    cityMode = 'free';
                    go('manager-practice');
                }
                else {
                    cityMode = 'tour';
                    go('brief');
                }
            } } : undefined);
    }
    else if (page === 'fan-replay' && replay) {
        unmountScene = mountFanReplay(app, replay, sound, lang);
    }
    else if (page === 'blackout') {
        if (!document.hidden) {
            const timer = window.setTimeout(() => {
                if (ariVenue) {
                    startAriBackstage();
                    go('ari-change');
                    return;
                }
                go('secret');
                void play(listening);
            }, 2800);
            unmountScene = () => window.clearTimeout(timer);
        }
    }
    else if (page === 'world') {
        unmountScene = mountWorld(lang, (id, member) => {
            tripMember = member;
            if (id === 'world-exit-city') {
                go('hongdae');
                return;
            }
            if (id === 'world-wardrobe') {
                openTravelWardrobe(member, 'world');
                return;
            }
            if (id !== 'world-enter-concert')
                return;
            lisaTour = false;
            role = member;
            actor = pass().person;
            cityMode = 'tour';
            remaining = 0;
            clipDay = false;
            resetCrewGame(role);
            cityReset();
            cityDay(0);
            hits.clear();
            go('stage');
        }, sound, changeSound);
    }
    else if (page === 'hongdae') {
        unmountScene = mountHongdae(lang, tripMember, (id, member) => {
            if (id === 'wardrobe') {
                openTravelWardrobe(member, 'hongdae');
                return;
            }
            if (id === 'back') {
                selectBackstageMember(member);
                go('world');
                return;
            }
            go(id === 'minho' ? 'minho' : 'booth');
        });
    }
    else if (page === 'booth') {
        unmountScene = mountBooth(lang, tripMember, id => {
            if (id === 'album') {
                albumSection = 'hongdae';
                go('album');
            }
            else
                go('hongdae');
        });
    }
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
    if ((page === 'stage' || page === 'lightshow') && stylistConcert('mina')) {
        if (jacketPhase() === 'opening') {
            startChange();
            hits.clear();
            go('mina-change');
            return;
        }
        if (jacketPhase() === 'final')
            resetJacket();
    }
    if ((page === 'stage' || page === 'lightshow') && stylistConcert('ari') && ariPhase() === 'packed') {
        ariVenue = walkedToConcert ? 'arena' : 'tour';
        tourEncore = ariVenue === 'tour';
        firstSongScore = hits.size;
        listening = listening || free;
        save('ari-show-meta', [firstSongScore, listening ? 'listen' : 'rhythm'].join('|'));
        hits.clear();
        go('blackout');
        return;
    }
    if (page === 'secret' && ariVenue) {
        const touring = ariVenue === 'tour';
        const recording = lightstick && !listening;
        forecast = 'solo';
        lastFree = listening || free;
        if (lightstick && recording) {
            save('secret-card.' + lightstick, encodeFanRecording(secretTimes, ariAsset(), roundTrack));
            save('lastAlbum', 'concert');
        }
        if (touring) {
            startEncore({ role, member: actor, looks: { Lisa: ariAsset() ?? 'travel/lisa-encore' }, score: lastFree ? null : firstSongScore, cityNote: { tr: noteFor('tr'), ru: noteFor('ru') }, signal: 'solo' });
            encoreAction('encore-cue');
            encoreAction('encore-pink');
            viewing = false;
            collectCard(!recording, firstSongScore);
            if (!recording)
                return;
        }
        go(recording ? 'light-result' : 'walk-bow');
        return;
    }
    if (page === 'stage' && walkedToConcert && !lightstick) {
        go('walk-bow');
        return;
    }
    if (page === 'secret' && lightstick && listening) {
        if (tourEncore) {
            forecast = 'solo';
            lastFree = true;
            collectCard(false, firstSongScore);
        }
        go('walk-bow');
        return;
    }
    if (page === 'secret' && lightstick) {
        save('secret-card.' + lightstick, encodeFanRecording(secretTimes, null, roundTrack));
        save('lastAlbum', 'concert');
        if (tourEncore) {
            forecast = 'solo';
            lastFree = false;
            collectCard(false, firstSongScore);
        }
        go('light-result');
        return;
    }
    if (lightstick && !free && (page === 'lightshow' || page === 'stage')) {
        tourEncore = page === 'stage';
        firstSongScore = hits.size;
        hits.clear();
        go('blackout');
        return;
    }
    forecast = chooseFinale();
    lastFree = free || listening;
    const looks = {};
    for (const name of Object.keys(memberIds)) {
        const selected = stageLook(name);
        if (selected)
            looks[name] = selected;
    }
    if (stylistConcert('soyeon') && trainPhase() === 'stage')
        looks.Jisoo = 'soyeon/jisoo-velvet';
    const spot = stylistConcert('yuna') ? yunaCue() : null;
    if (stylistConcert('yuna') && yunaDressed())
        looks['Rosé'] = 'travel/rose-set-original';
    startEncore({ role, member: actor, looks, ...(spot ? { roseCue: spot } : {}), score: lastFree ? null : hits.size, cityNote: { tr: noteFor('tr'), ru: noteFor('ru') }, signal: forecast });
    viewing = false;
    go('show');
}
function collectCard(openEnding = true, score = hits.size) {
    save('lastAlbum', 'concert');
    album = cardIds([...(cardIds(read('album'))), ...album, role].join(','));
    save('album', album.join(','));
    save('signal.' + role, forecast);
    let cardLook = stageLook(actor) ?? 'studio/' + memberIds[actor] + '-spotlight';
    if (role === 'ari' && ariPhase() === 'encore')
        cardLook = ariAsset() ?? cardLook;
    if (role === 'yuna' && yunaDressed())
        cardLook = 'travel/rose-set-original';
    if (role === 'soyeon' && trainPhase() === 'stage')
        cardLook = 'soyeon/jisoo-velvet';
    save('look.' + role, cardLook);
    save('score.' + role, lastFree ? 'free' : String(score));
    save('note.' + role + '.tr', noteFor('tr'));
    save('note.' + role + '.ru', noteFor('ru'));
    save('checkpoint', '');
    albumSection = 'concert';
    cityMode = 'after';
    cityDay(1);
    if (openEnding)
        go('ending');
}
function tick(now) {
    if (!playing)
        return;
    const interval = roundTrack?.beatMs ?? beatMs;
    const elapsed = roundTrack ? concertTrackElapsed() : now - start;
    if (elapsed + .5 >= beatCount * interval + windowMs + 60) {
        finish(false);
        return;
    }
    if (roundTrack && !isConcertTrackPlaying()) {
        stop();
        draw();
        message('Müzik durdu. Devam etmek için tekrar başlat.', 'Музыка остановилась. Начни песню ещё раз.');
        return;
    }
    if (listening) {
        const progress = element('concert-time');
        if (progress instanceof HTMLProgressElement)
            progress.value = elapsed;
        frame = requestAnimationFrame(tick);
        return;
    }
    const phase = (Math.max(0, elapsed) % interval) / interval;
    const pad = element('pad');
    element('note-rail').style.setProperty('--phase', String(phase));
    pad.style.setProperty('--scale', String(.43 + .57 * phase));
    pad.style.setProperty('--intensity', String(.3 + .7 * phase));
    pad.classList.toggle('ready', beatAt(elapsed, interval) !== null);
    app.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('hit', hits.has(i));
        dot.classList.toggle('past', !hits.has(i) && elapsed > (i + 1) * interval + Math.min(windowMs, interval * .45));
    });
    frame = requestAnimationFrame(tick);
}
async function play(watch = false) {
    listening = watch;
    stop();
    const token = epoch;
    const button = element('pad');
    if (button instanceof HTMLButtonElement)
        button.disabled = true;
    {
        const track = activeConcertTrack();
        try {
            if (track) {
                await playConcertTrack();
                if (token === epoch)
                    roundTrack = track;
            }
            else
                await melody(page === 'secret' ? null : cityProgress().intro, page === 'lightshow' || page === 'secret', page === 'secret', stylistConcert('mina') && jacketPhase() === 'final' && page !== 'secret');
        }
        catch {
            if (track && token === epoch) {
                stop();
                draw();
                message('Dosya açılamadı. Müzik ayarlarından yeniden seç.', 'Не удалось открыть файл. Выбери его ещё раз в настройках музыки.');
                return;
            }
            if (sound && token === epoch) {
                draw();
                message('Ses açılamadı. Ses düğmesini kapatıp oynayabilirsin.', 'Не удалось включить звук. Отключи его и начни снова.');
                return;
            }
        }
    }
    if (token !== epoch)
        return;
    hits = new Set();
    secretTimes = [];
    playing = true;
    start = performance.now();
    draw();
    frame = requestAnimationFrame(tick);
}
let clipDay = false;
function unlockRole() {
    earnedPasses = cardIds([...earnedPasses, ...cardIds(read('earned')), role].join(','));
    save('earned', earnedPasses.join(','));
}
function completeRoleTask() {
    hits.clear();
    unlockRole();
    go(hasCrewGame(role) ? 'crew' : 'stage');
}
function rolePick(id, lottery = false) {
    if (!isRole(id))
        return;
    if (id === 'mina')
        resetJacket();
    if (id === 'soyeon')
        resetTrain();
    drawn = lottery;
    role = id;
    actor = pass().person;
    clipDay = false;
    resetCrewGame(role);
    go('time');
}
function tapRhythm(now) {
    const elapsed = roundTrack ? concertTrackElapsed() : now - start;
    const i = beatAt(elapsed, roundTrack?.beatMs ?? beatMs);
    if (playing && i !== null && !hits.has(i)) {
        hits.add(i);
        const set = app.querySelector('.live-set');
        if (set && lightstick) {
            lightBeat(set, hits.size);
            window.clearTimeout(glowTimer);
            glowTimer = window.setTimeout(() => { delete set.dataset.pulse; }, 530);
            if (page === 'secret') {
                secretTimes.push(Math.round(elapsed));
                set.dataset.arenaLit = 'true';
            }
            element('light-feedback').textContent = page === 'secret' && hits.size === 1 ? t('Bütün salon senin renginde!', 'Весь зал сияет твоим цветом!') : t('Tam ritminde!', 'Точно в такт!');
        }
        element('note-rail').dataset.hit = String(i % 2);
        element('count').textContent = hits.size + ' / ' + beatCount;
    }
    else if (playing && i === null && lightstick) {
        element('light-feedback').textContent = t('Sıradaki yıldızı yakala.', 'Поймай следующую звезду.');
    }
}
app.addEventListener('pointerdown', event => {
    if (event.isPrimary && event.button === 0 && event.target instanceof Element && event.target.closest('button[data-act="tap"]')) {
        tapRhythm(performance.now());
    }
});
app.addEventListener('click', e => {
    const target = e.target;
    if (!(target instanceof Element))
        return;
    const act = target.closest('button[data-act]')?.dataset.act;
    if (!act)
        return;
    if (page === 'time' && role === 'lisa' && (act === 'lisa-mode-rhythm' || act === 'lisa-mode-official')) {
        save('lisa-song-mode', act === 'lisa-mode-rhythm' ? 'rhythm' : 'official');
        draw();
        return;
    }
    if (act === 'official-home' && page === 'home') {
        officialOrigin = 'home';
        go('official-show');
        return;
    }
    if (act === 'lisa-sing' && page === 'lisa-mic' && role === 'lisa' && lisaMicTaken()) {
        unlockRole();
        hits.clear();
        if (lisaSongMode() === 'official') {
            officialOrigin = walkedToConcert ? 'arena' : 'tour';
            go('official-show');
        }
        else {
            go(walkedToConcert && lightstick ? 'lightshow' : 'stage');
            void play();
        }
        return;
    }
    if (page === 'official-show' && act === 'official-return') {
        if (officialOrigin === 'home')
            go('home');
        else {
            go(walkedToConcert && lightstick ? 'lightshow' : 'stage');
            void play();
        }
        return;
    }
    if (page === 'official-show' && act === 'official-finish' && officialOrigin !== 'home') {
        if (walkedToConcert) {
            listening = true;
            go('walk-bow');
        }
        else
            finish(true);
        return;
    }
    if (act === 'lang') {
        stop();
        lang = lang === 'tr' ? 'ru' : 'tr';
        save('lang', lang);
        feedback = '';
        draw();
        return;
    }
    if (act === 'stick-concert' && lightstick && (page === 'minho' || page === 'light-result')) {
        hits.clear();
        go('lightshow');
        return;
    }
    if (page === 'album' && act.startsWith('watch-fan-')) {
        const id = stickId(act.slice('watch-fan-'.length));
        replay = id ? readFanRecording(id, read('secret-card.' + id)) : null;
        if (replay)
            go('fan-replay');
        return;
    }
    if (page === 'fan-replay' && act === 'rewatch-fan') {
        draw();
        return;
    }
    if (act === 'fan-album') {
        albumSection = 'concert';
        go('album');
        return;
    }
    if (act === 'back-shop') {
        go('minho');
        return;
    }
    if (page === 'minho' && act.startsWith('stick-')) {
        const choice = stickId(act.slice(6));
        if (choice && isShopStick(choice)) {
            buyOrEquip(choice);
            draw();
            app.querySelector('[data-act="stick-' + choice + '"]')?.focus({ preventScroll: true });
        }
        return;
    }
    if (act === 'trip-street') {
        if (page === 'studio' && studioBack === 'world') {
            selectBackstageMember(tripMember);
            go('world');
            const exit = app.querySelector('[data-world-action="walk-exit-city"]');
            if (!exit)
                throw new Error('Missing backstage street exit');
            exit.click();
        }
        else
            go('hongdae');
        return;
    }
    if (act === 'shop') {
        go('minho');
        return;
    }
    if (act === 'arena') {
        walkRole = null;
        arenaEntrance = 'home';
        role = 'blink';
        actor = 'Lisa';
        cityMode = 'free';
        clipDay = false;
        walkedToConcert = true;
        hits.clear();
        go(lightstick ? 'lightshow' : 'stage');
        return;
    }
    if (act === 'walk') {
        if (page !== 'walk-bow')
            walkRole = null;
        go('walk');
        return;
    }
    if (act === 'world') {
        go('world');
        return;
    }
    if (act === 'home') {
        go('home');
        return;
    }
    if (act === 'album') {
        albumSection = boothPhotoCount() > 0 && read('lastAlbum') !== 'concert' ? 'hongdae' : 'concert';
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
        lisaTour = role === 'lisa';
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
            rolePick(id, true);
        return;
    }
    if (act.startsWith('role-')) {
        rolePick(act.slice(5));
        return;
    }
    if (page === 'time' && (act === 'enter-role-city' || act.startsWith('days-'))) {
        lisaTour = role === 'lisa';
        if (lisaTour)
            resetLisaMic();
    }
    if (page === 'time' && role === 'manager' && (act === 'enter-role-city' || act.startsWith('days-')))
        resetManagerMic();
    if (page === 'time' && role === 'ari' && (act === 'enter-role-city' || act.startsWith('days-'))) {
        resetAri();
        save('ari-show-meta', '');
    }
    if (page === 'time' && role === 'yuna' && (act === 'enter-role-city' || act.startsWith('days-')))
        resetYuna();
    if (page === 'time' && role === 'soyeon' && (act === 'enter-role-city' || act.startsWith('days-')))
        resetTrain();
    if (act === 'enter-role-city' || (drawn && (act === 'days-2' || act === 'days-1'))) {
        walkRole = role;
        remaining = act === 'days-1' ? 1 : 2;
        cityMode = 'tour';
        cityReset();
        cityDay(-remaining);
        beginRoleWalk(role, remaining);
        go('walk');
        return;
    }
    if (act.startsWith('days-')) {
        remaining = Number(act.slice(5));
        cityMode = 'tour';
        cityReset();
        cityDay(-remaining);
        go(remaining ? 'city' : role === 'lisa' && drawn ? 'lisa-mic' : role === 'manager' ? 'manager-mic' : 'brief');
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
    if (page === 'studio' && stylistFitting('ari') && act.startsWith('ari-')) {
        if (act === 'ari-exit' && ariPhase() && ariPhase() !== 'preparing') {
            if (studioBack === 'item')
                completeRoleTask();
            else
                go(studioBack);
            return;
        }
        if (ariAction(act)) {
            draw();
            app.querySelector('[data-act="' + (act === 'ari-pack' ? 'ari-exit' : act) + '"]')?.focus({ preventScroll: true });
        }
        return;
    }
    if (page === 'ari-change' && ariVenue && act.startsWith('ari-')) {
        if (!ariAction(act))
            return;
        if (act === 'ari-cue') {
            go('secret');
            void play(listening);
        }
        else {
            draw();
            app.querySelector(act === 'ari-open' ? '[data-act=ari-dress]' : '[data-act=ari-cue]')?.focus({ preventScroll: true });
        }
        return;
    }
    if (stylistFitting('yuna') && (page === 'studio' || page === 'yuna-rehearsal') && act.startsWith('yuna-')) {
        if (page === 'studio' && act === 'yuna-rehearse' && yunaDressed()) {
            go('yuna-rehearsal');
            return;
        }
        if (page === 'yuna-rehearsal' && act === 'yuna-exit' && yunaCue()) {
            if (studioBack === 'item')
                completeRoleTask();
            else
                go(studioBack);
            return;
        }
        if (yunaAction(act)) {
            draw();
            const focus = act === 'yuna-outfit' ? 'yuna-boots' : act === 'yuna-boots' ? 'yuna-rehearse' : act === 'yuna-confirm' ? 'yuna-exit' : act;
            app.querySelector('[data-act="' + focus + '"]')?.focus({ preventScroll: true });
        }
        return;
    }
    if (page === 'studio' && act === 'soyeon-dress' && stylistFitting('soyeon')) {
        if (dressVelvet()) {
            draw();
            app.querySelector('[data-act=soyeon-exit]')?.focus({ preventScroll: true });
        }
        return;
    }
    if (page === 'soyeon-change') {
        if (act === 'soyeon-pin') {
            if (pinTrain()) {
                draw();
                app.querySelector('[data-act=soyeon-stairs]')?.focus({ preventScroll: true });
            }
            return;
        }
        if (act === 'soyeon-stairs' && startStairs()) {
            go('soyeon-stairs');
            return;
        }
    }
    if (act === 'fasten-jacket' && page === 'studio' && stylistFitting('mina')) {
        if (fastenJacket())
            draw();
        return;
    }
    if (page === 'mina-change') {
        if (act === 'snap-0' || act === 'snap-1') {
            releaseSnap(act === 'snap-0' ? 0 : 1);
            draw();
            return;
        }
        if (act === 'hang-jacket') {
            if (hangJacket())
                draw();
            return;
        }
        if (act === 'jennie-return' && sendJennieBack()) {
            hits.clear();
            go(walkedToConcert && lightstick ? 'lightshow' : 'stage');
            void play(listening);
            return;
        }
    }
    if (act === 'studio-continue' || (act === 'soyeon-exit' && page === 'studio' && stylistFitting('soyeon') && trainPhase())) {
        if (stylistFitting('ari') && studioBack === 'item') {
            if (ariPhase() === 'packed')
                completeRoleTask();
            else
                message('Önce bis kıyafetini seç ve kılıfa yerleştir.', 'Сначала выбери наряд для биса и убери его в чехол.');
            return;
        }
        if (stylistFitting('yuna') && studioBack === 'item') {
            if (yunaCue())
                completeRoleTask();
            else if (yunaDressed())
                go('yuna-rehearsal');
            else
                message('Önce yıldızlı kıyafeti ve çizmeleri giydir.', 'Сначала надень звёздный наряд и сапоги.');
            return;
        }
        if (stylistFitting('soyeon') && studioBack === 'item') {
            if (!trainPhase()) {
                message('Önce Jisoo’ya bordo kadife elbiseyi giydir.', 'Сначала надень на Джису бордовое бархатное платье.');
                return;
            }
            go('cue');
            return;
        }
        if (stylistFitting('mina') && studioBack === 'item') {
            if (jacketPhase() !== 'opening') {
                message('Önce final kıyafetini seç ve pembe ceketi giydir.', 'Сначала выбери образ для финала и надень розовый жакет.');
                return;
            }
            go('cue');
            return;
        }
        go(studioBack);
        return;
    }
    if (act.startsWith('artist-') && studioBack === 'home') {
        const selected = act.slice(7);
        if (Object.prototype.hasOwnProperty.call(memberIds, selected)) {
            studioMember = selected;
            go('studio');
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
        if (stylistFitting('mina') && act.startsWith('studio-wear-') && jacketPhase() === 'opening')
            fastenJacket();
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
        if (role === 'lisa') {
            lisaTour = true;
            go('lisa-mic');
            return;
        }
        go(role === 'manager' ? 'manager-mic' : pass().item ? 'item' : 'cue');
        return;
    }
    if (page === 'brief' && role === 'manager' && act === 'manager-rehearse') {
        resetCrewGame(role);
        go('crew');
        return;
    }
    if (page === 'manager-mic' && act === 'manager-concert' && role === 'manager' && managerMicDone()) {
        unlockRole();
        hits.clear();
        go(walkedToConcert && lightstick ? 'lightshow' : 'stage');
        void play();
        return;
    }
    if (act.startsWith('item-')) {
        if (role === 'ari' && act === 'item-gloves') {
            if (ariPhase() === 'packed')
                completeRoleTask();
            else {
                studioBack = 'item';
                studioMember = 'Lisa';
                go('studio');
            }
            return;
        }
        if (role === 'yuna' && act === 'item-boots') {
            if (yunaCue())
                completeRoleTask();
            else {
                studioBack = 'item';
                studioMember = 'Rosé';
                go('studio');
            }
            return;
        }
        if (role === 'soyeon' && act === 'item-rosecoat' && !trainPhase()) {
            studioBack = 'item';
            studioMember = 'Jisoo';
            go('studio');
            return;
        }
        if (role === 'mina' && act === 'item-jacket' && jacketPhase() !== 'opening') {
            studioBack = 'item';
            studioMember = 'Jennie';
            go('studio');
            return;
        }
        if (act.slice(5) === pass().item)
            go('cue');
        else
            message('Bir daha bak. ' + pass().intro.tr, 'Посмотри ещё раз. ' + pass().intro.ru);
        return;
    }
    if (act.startsWith('answer-')) {
        if (Number(act.slice(7)) === pass().correct)
            completeRoleTask();
        else
            message(pass().hint.tr, pass().hint.ru);
        return;
    }
    const crewRole = clipDay ? 'director' : role;
    if (act === 'crew-continue' && isCrewGameComplete(crewRole)) {
        if (page === 'manager-practice') {
            go('walk');
            return;
        }
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
        const roomSwitch = app.querySelector('[data-world-action="toggle-sound"]');
        if (roomSwitch)
            roomSwitch.click();
        else
            changeSound(!sound);
        return;
    }
    if (act === 'listen') {
        void play(true);
        return;
    }
    if (act === 'play') {
        void play();
        return;
    }
    if (act === 'tap') {
        if (e.detail === 0)
            tapRhythm(performance.now());
        return;
    }
    if (act === 'pause') {
        stop();
        draw();
        message('Şarkı durdu. Tekrar dinleyebilir veya ritme eşlik edebilirsin.', 'Пауза. Можно снова послушать песню или сыграть в ритм.');
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
document.addEventListener('visibilitychange', () => {
    if (page === 'fan-replay' && document.hidden) {
        albumSection = 'concert';
        go('album');
        return;
    }
    if (page === 'blackout') {
        draw();
        return;
    }
    if (document.hidden && (page === 'stage' || page === 'lightshow' || page === 'secret')) {
        stop();
        draw();
    }
});
window.addEventListener('encore:photo-saved', () => {
    save('lastAlbum', 'hongdae');
    save('lastPhotoMember', tripMember);
});
page = restoreScene();
draw();
void initConcertTrack().then(() => {
    tracksReady = true;
    app.querySelectorAll('[data-act="play"],[data-act="listen"],[data-act^="watch-fan-"]').forEach(button => button.disabled = false);
    if (activeConcertTrack() && !playing && ['time', 'stage', 'lightshow', 'secret'].includes(page))
        draw();
});
window.addEventListener('hashchange', () => go(restoreScene()));
