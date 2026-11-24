import {readDuet, saveDuet, startingLook} from './album.js';
import {createWorld} from './world.js';
import {worldAudio as audio} from '../js/world-audio.js';

const phrases = {
  ru: {
    chapter: 'Глава Софии',
    exit: 'Вернуться в основную игру',
    sceneLabel: 'Трёхмерная сцена Seoul Encore',
    routeLabel: 'Маршрут к Нари',
    loading: 'Сеул зажигает огни',
    loadingDescription: 'Готовим улицу и репетиционный зал…',
    retryLoad: 'Загрузить снова',
    loadError: 'Сцена не загрузилась',
    loadErrorDetail: 'Для этой главы нужен браузер с поддержкой WebGL. Попробуй загрузить сцену снова.',
    replayError: 'Запись не найдена',
    replayErrorDetail: 'Открой сохранённый танец в альбоме на устройстве, где ты его записала.',
    street: 'Улица в Сеуле',
    streetObjective: 'Войди в здание YG впереди',
    lobby: 'Лобби YG',
    lobbyObjective: 'Пройди прямо в репетиционный зал',
    practice: 'Репетиционный зал',
    practiceObjective: 'Подойди к Нари',
    nearObjective: 'Нари ждёт тебя на танцполе',
    startDuet: 'Танцевать с Нари',
    joystickLabel: 'Джойстик движения',
    moveTouch: 'Движение',
    moveKeyboard: 'WASD / Стрелки',
    cameraTouch: 'Свайп по сцене — камера',
    cameraKeyboard: 'Камера: потяни сцену или нажми Q / E',
    look: 'Образ',
    close: 'Закрыть',
    outfitLabel: 'Костюм',
    jacket: 'Куртка',
    jacketOn: 'На Софии',
    jacketOff: 'Снята',
    wandLabel: 'Цвет лайтстика',
    rose: 'Розовый',
    midnight: 'Полночный',
    wandPink: 'Розовый',
    wandViolet: 'Лиловый',
    wandBlue: 'Голубой',
    wandGold: 'Тёплый белый',
    wandCustom: 'Мой цвет',
    soundOn: 'Звук включён',
    soundOff: 'Звук выключен',
    danceLabel: 'Танец',
    duet: 'София × Нари',
    side: 'Вбок',
    jump: 'Прыжок',
    spin: 'Поворот',
    heart: 'Сердце',
    step: 'Шаг',
    demo: 'Нари показывает движения',
    demoCue: 'Смотри на Нари',
    play: 'Теперь вместе',
    playCue: 'Нажми, когда полоска загорится',
    replay: 'Запись дуэта',
    replayCue: 'Смотри сохранённый танец',
    hit: 'В такт!',
    early: 'Подожди, пока загорится полоска',
    wrong: 'Повтори движение, которое показывает Нари',
    miss: 'Следи за полоской на следующем шаге',
    resultKicker: 'Репетиция окончена',
    scoreLabel: 'Попадания в ритм',
    resultCopy: 'Сохрани кадр с вашим дуэтом в альбом Софии.',
    replayResult: 'Этот дуэт уже в альбоме Софии.',
    saved: 'Кадр сохранён в альбом Софии.',
    savedWithoutPhoto: 'Дуэт сохранён. Для фотографии не хватило места.',
    saveError: 'Не удалось сохранить фотокарту. Попробуй снова.',
    save: 'Сохранить фотокарту',
    savedButton: 'Фотокарта сохранена',
    repeat: 'Танцевать снова',
    watchAgain: 'Смотреть снова',
    album: 'Открыть альбом',
    backToWalk: 'Вернуться в зал',
    backToStreet: 'Вернуться на улицу',
  },
  tr: {
    chapter: 'Sofia’nın bölümü',
    exit: 'Ana oyuna dön',
    sceneLabel: 'Seoul Encore üç boyutlu sahnesi',
    routeLabel: 'Nari’ye giden yol',
    loading: 'Seul ışıklarını yakıyor',
    loadingDescription: 'Sokak ve prova salonu hazırlanıyor…',
    retryLoad: 'Yeniden yükle',
    loadError: 'Sahne yüklenemedi',
    loadErrorDetail: 'Bu bölüm WebGL destekli bir tarayıcı gerektiriyor. Sahneyi yeniden yüklemeyi dene.',
    replayError: 'Kayıt bulunamadı',
    replayErrorDetail: 'Albümdeki dansı kaydettiğin cihazdan açabilirsin.',
    street: 'Seul sokağı',
    streetObjective: 'İlerideki YG binasına gir',
    lobby: 'YG lobisi',
    lobbyObjective: 'Düz ilerleyip prova salonuna gir',
    practice: 'Prova salonu',
    practiceObjective: 'Nari’ye yaklaş',
    nearObjective: 'Nari seni dans pistinde bekliyor',
    startDuet: 'Nari ile dans et',
    joystickLabel: 'Hareket kumandası',
    moveTouch: 'Hareket',
    moveKeyboard: 'WASD / Ok tuşları',
    cameraTouch: 'Kamera için sahneyi kaydır',
    cameraKeyboard: 'Kamera için sahneyi sürükle veya Q / E tuşlarına bas',
    look: 'Görünüm',
    close: 'Kapat',
    outfitLabel: 'Kostüm',
    jacket: 'Ceket',
    jacketOn: 'Giyildi',
    jacketOff: 'Çıkarıldı',
    wandLabel: 'Işık çubuğu rengi',
    rose: 'Pembe',
    midnight: 'Gece moru',
    wandPink: 'Pembe',
    wandViolet: 'Lila',
    wandBlue: 'Mavi',
    wandGold: 'Sıcak beyaz',
    wandCustom: 'Kendi rengim',
    soundOn: 'Ses açık',
    soundOff: 'Ses kapalı',
    danceLabel: 'Dans',
    duet: 'Sofia × Nari',
    side: 'Yana adım',
    jump: 'Sıçra',
    spin: 'Dön',
    heart: 'Kalp',
    step: 'Adım',
    demo: 'Nari hareketleri gösteriyor',
    demoCue: 'Nari’yi izle',
    play: 'Şimdi birlikte',
    playCue: 'Çubuk parladığında dokun',
    replay: 'Düet kaydı',
    replayCue: 'Kaydettiğin dansı izle',
    hit: 'Tam ritminde!',
    early: 'Çubuk parlayana kadar bekle',
    wrong: 'Nari’nin gösterdiği hareketi yap',
    miss: 'Bir sonraki adımda çubuğu takip et',
    resultKicker: 'Prova tamamlandı',
    scoreLabel: 'Ritmi yakaladığın vuruşlar',
    resultCopy: 'Düetinizi Sofia’nın albümüne kaydet.',
    replayResult: 'Bu düet Sofia’nın albümünde kayıtlı.',
    saved: 'Fotokart Sofia’nın albümüne kaydedildi.',
    savedWithoutPhoto: 'Düet kaydedildi. Fotoğraf için yer kalmadı.',
    saveError: 'Fotokart kaydedilemedi. Yeniden dene.',
    save: 'Fotokartı kaydet',
    savedButton: 'Fotokart kaydedildi',
    repeat: 'Yeniden dans et',
    watchAgain: 'Yeniden izle',
    album: 'Albümü aç',
    backToWalk: 'Salona dön',
    backToStreet: 'Sokağa dön',
  },
};

const byId = id => document.getElementById(id);
const game = byId('game');
const canvas = byId('scene');
const joystick = byId('joystick');
const rehearsal = byId('rehearse');
const wardrobe = byId('wardrobe');
const lookToggle = byId('look-toggle');
const soundButton = byId('sound');
const languageButton = byId('language');
const jacketButton = byId('jacket');
const saveButton = byId('save-card');
const outfits = [...wardrobe.querySelectorAll('[data-outfit]')];
const wandOptions = wardrobe.querySelector('.wand-select > div');
const moveButtons = [...byId('move-buttons').querySelectorAll('[data-move]')];
const phraseMarks = [...byId('duet-banner').querySelectorAll('.phrase i')];

const moves = {
  side: {icon: '↔', note: 0},
  jump: {icon: '↑', note: 1},
  spin: {icon: '↻', note: 2},
  heart: {icon: '♡', note: 2},
  step: {icon: '⇢', note: 0},
};
const rhythm = {
  duration: 2180,
  center: 1090,
  tolerance: 500,
  demoDuration: 1390,
  demoCue: 280,
  replayDuration: 1320,
  replayCue: 220,
};
const durations = {demo: rhythm.demoDuration, play: rhythm.duration, replay: rhythm.replayDuration};
const arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
const directionKeys = new Set([...arrows, 'KeyW', 'KeyA', 'KeyS', 'KeyD']);
const keysHeld = new Set();

function preference(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn('Seoul Encore preference could not be saved.', error);
  }
}

let lang = preference('encore1.lang') === 'tr' ? 'tr' : 'ru';
let sound = preference('encore1.sound') !== 'off';
let look = startingLook();
look.jacket ??= true;
let world;
let state = 'loading';
let area = 'street';
let nearNari = false;
let replay = null;
let failure = null;
let frame = 0;
let round;
let saveStatus = '';
let cardId = null;
let joystickPointer = null;
let orbitPointer = null;
let joystickInput = {x: 0, y: 0};

const words = key => phrases[lang][key];
const setText = (id, value) => { byId(id).textContent = value; };
const canWalk = () => state === 'walk' && wardrobe.hidden;
const albumHref = byId('album-link').getAttribute('href');

function paintSaveStatus() {
  setText('save-status', saveStatus ? words(saveStatus) : '');
  byId('save-status').hidden = !saveStatus;
  byId('save-status').dataset.error = String(saveStatus === 'saveError');
  byId('result-copy').hidden = cardId !== null;
  saveButton.textContent = words(cardId ? 'savedButton' : 'save');
  saveButton.disabled = cardId !== null;
}

function paintMission() {
  setText('area', words(area));
  setText('objective', words(nearNari ? 'nearObjective' : `${area}Objective`));
  rehearsal.hidden = !nearNari;
}

function paintResult() {
  setText('result-title', words('duet'));
  setText('result-copy', words(replay ? 'replayResult' : 'resultCopy'));
  setText('repeat-duet', words(replay ? 'watchAgain' : 'repeat'));
  setText('return-explore', words(replay ? 'backToStreet' : 'backToWalk'));
  const score = byId('result-score');
  score.hidden = Boolean(replay) || !round;
  if (round) score.textContent = `${words('scoreLabel')} · ${round.hits}/${round.moves.length}`;
  saveButton.hidden = Boolean(replay);
  paintSaveStatus();
}

function paintSound() {
  const label = words(sound ? 'soundOn' : 'soundOff');
  soundButton.setAttribute('aria-pressed', String(sound));
  soundButton.setAttribute('aria-label', label);
  soundButton.title = label;
}

function paintFailure() {
  if (!failure) return;
  const missingReplay = failure === 'replay';
  setText('failure-title', words(missingReplay ? 'replayError' : 'loadError'));
  setText('failure-detail', words(missingReplay ? 'replayErrorDetail' : 'loadErrorDetail'));
  byId('retry-load').hidden = missingReplay;
  const link = byId('error-back');
  link.href = missingReplay ? albumHref : byId('exit-game').href;
  link.textContent = words(missingReplay ? 'album' : 'exit');
}

function paintLanguage() {
  document.documentElement.lang = lang;
  for (const node of document.querySelectorAll('[data-text]')) node.textContent = words(node.dataset.text);
  for (const node of document.querySelectorAll('[data-label]')) {
    const label = words(node.dataset.label);
    node.setAttribute('aria-label', label);
    if (node.title) node.title = label;
  }
  languageButton.setAttribute('aria-pressed', String(lang === 'tr'));
  const nextLanguage = lang === 'tr' ? 'Русский' : 'Türkçe';
  languageButton.setAttribute('aria-label', nextLanguage);
  languageButton.title = nextLanguage;
  paintSound();
  paintJacket();
  paintMission();
  paintResult();
  paintFailure();
  if (round && Object.hasOwn(durations, state)) paintCue();
}

function setState(next) {
  state = next;
  game.dataset.state = next;
  const walking = next === 'walk';
  const dancing = Object.hasOwn(durations, next);
  byId('startup').hidden = next !== 'loading';
  byId('failure').hidden = next !== 'error';
  byId('mission').hidden = !walking;
  byId('walk-controls').hidden = !walking;
  byId('duet-banner').hidden = !dancing;
  byId('dance-panel').hidden = !dancing;
  byId('move-buttons').hidden = next !== 'play';
  byId('result').hidden = next !== 'result';
  if (next !== 'play') delete game.dataset.beat;
  if (!dancing) delete game.dataset.currentMove;
}

function paintJacket() {
  jacketButton.setAttribute('aria-pressed', String(look.jacket));
  setText('jacket-state', words(look.jacket ? 'jacketOn' : 'jacketOff'));
}

function updateLook() {
  world.outfit(look.outfit);
  world.setWand(look.wandColor);
  world.setJacket(look.jacket);
  game.dataset.jacket = String(look.jacket);
  paintJacket();
  for (const button of outfits) button.setAttribute('aria-pressed', String(button.dataset.outfit === look.outfit));

  let imported = wandOptions.querySelector('[data-imported]');
  const existing = [...wandOptions.querySelectorAll('[data-wand]:not([data-imported])')].some(
    button => button.dataset.wand === look.wandColor.toLowerCase(),
  );
  if (!existing && !imported) {
    imported = document.createElement('button');
    imported.type = 'button';
    imported.dataset.imported = 'true';
    imported.dataset.label = 'wandCustom';
    wandOptions.append(imported);
  }
  if (!existing) {
    imported.dataset.wand = look.wandColor;
    imported.style.setProperty('--swatch', look.wandColor);
    imported.setAttribute('aria-label', words('wandCustom'));
  }
  for (const button of wandOptions.querySelectorAll('[data-wand]')) {
    button.setAttribute('aria-pressed', String(button.dataset.wand.toLowerCase() === look.wandColor.toLowerCase()));
  }
}

function setWardrobe(open, restoreFocus = false) {
  wardrobe.hidden = !open;
  lookToggle.setAttribute('aria-expanded', String(open));
  world.setLookPreview(open);
  if (open) {
    resetControls();
    byId('look-close').focus({preventScroll: true});
  } else if (restoreFocus) {
    lookToggle.focus({preventScroll: true});
  }
}

function playAudio() {
  if (sound) void audio.enter();
}

function moveInput() {
  if (!world) return;
  const keyboardX = Number(keysHeld.has('KeyD') || keysHeld.has('ArrowRight')) -
    Number(keysHeld.has('KeyA') || keysHeld.has('ArrowLeft'));
  const keyboardY = Number(keysHeld.has('KeyW') || keysHeld.has('ArrowUp')) -
    Number(keysHeld.has('KeyS') || keysHeld.has('ArrowDown'));
  if (canWalk()) world.setInput(joystickInput.x + keyboardX, joystickInput.y + keyboardY);
  else world.setInput(0, 0);
}

function moveJoystick(event) {
  const rect = joystick.getBoundingClientRect();
  const radius = rect.width * .31;
  const x = event.clientX - rect.x - rect.width / 2;
  const y = event.clientY - rect.y - rect.height / 2;
  const distance = Math.hypot(x, y);
  const scale = distance <= radius ? 1 : radius / distance;
  const dx = x * scale;
  const dy = y * scale;
  joystickInput = distance > 5 ? {x: dx / radius, y: -dy / radius} : {x: 0, y: 0};
  joystick.style.setProperty('--stick-x', `${dx}px`);
  joystick.style.setProperty('--stick-y', `${dy}px`);
  moveInput();
}

function releaseJoystick() {
  const pointer = joystickPointer;
  joystickPointer = null;
  if (pointer !== null && joystick.hasPointerCapture(pointer)) joystick.releasePointerCapture(pointer);
  joystickInput = {x: 0, y: 0};
  joystick.style.removeProperty('--stick-x');
  joystick.style.removeProperty('--stick-y');
  moveInput();
}

function releaseOrbit() {
  const pointer = orbitPointer;
  orbitPointer = null;
  if (pointer && canvas.hasPointerCapture(pointer.id)) canvas.releasePointerCapture(pointer.id);
}

function resetControls() {
  keysHeld.clear();
  releaseJoystick();
  releaseOrbit();
}

function paintCue() {
  const {moves: sequence, index, beats, feedback} = round;
  const current = sequence[index];
  game.dataset.currentMove = current;
  setText('duet-title', words('duet'));
  setText('duet-mode', words(state));
  setText('cue-phase', words(state + 'Cue'));
  setText('cue-icon', moves[current].icon);
  setText('cue-title', words(current));
  setText('dance-step', `${index + 1} / ${sequence.length}`);
  const message = byId('dance-feedback');
  message.textContent = feedback ? words(feedback) : '';
  message.dataset.feedback = feedback;
  for (const button of moveButtons) button.classList.toggle('is-expected', button.dataset.move === current);
  for (const [i, mark] of phraseMarks.entries()) {
    mark.classList.toggle('is-hit', beats.has(i));
    mark.classList.toggle('is-active', i === index);
  }
}

function paintBeat() {
  const offset = round.elapsed - rhythm.center;
  if (round.beats.has(round.index)) game.dataset.beat = 'hit';
  else if (offset < -rhythm.tolerance) game.dataset.beat = 'early';
  else if (offset > rhythm.tolerance) game.dataset.beat = 'late';
  else game.dataset.beat = 'open';
  const progress = Math.min(100, 100 * round.elapsed / rhythm.duration);
  byId('beat-marker').style.setProperty('--progress', `${progress}%`);
}

function announceDance(move, actor) {
  world.dance(move, actor, 920);
  audio.note(moves[move].note);
}

function startRound(next) {
  cancelAnimationFrame(frame);
  resetControls();
  setWardrobe(false);
  cardId = null;
  saveStatus = '';
  const finale = replay?.finalMove ?? 'heart';
  round = {
    moves: ['side', 'jump', finale], index: 0, elapsed: 0, lastTime: null,
    shown: false, beats: new Set(), hits: 0, feedback: '',
  };
  world.startDance();
  if (replay) game.dataset.area = 'practice';
  game.dataset.hits = '0';
  setState(next);
  paintCue();
  frame = requestAnimationFrame(tick);
}

function nextBeat() {
  const missed = state === 'play' && !round.beats.has(round.index);
  if (++round.index === round.moves.length) {
    if (state === 'demo') {
      startRound('play');
    } else {
      world.poseForPhoto();
      audio.cue('delivery');
      setState('result');
      paintResult();
      byId('result').focus({preventScroll: true});
    }
    return;
  }

  round.elapsed = 0;
  round.shown = false;
  round.feedback = missed ? 'miss' : '';
  paintCue();
}

function tick(now) {
  if (round.lastTime !== null) round.elapsed += Math.min(125, now - round.lastTime);
  round.lastTime = now;
  const cue = state === 'demo' ? rhythm.demoCue : state === 'play' ? rhythm.center : rhythm.replayCue;
  if (!round.shown && round.elapsed >= cue) {
    round.shown = true;
    audio.groove(round.index);
    if (!round.beats.has(round.index)) {
      announceDance(round.moves[round.index], state === 'replay' ? 'both' : 'nari');
    }
  }
  if (round.elapsed >= durations[state]) {
    const previous = state;
    nextBeat();
    // Starting a new phase schedules its own frame.
    if (state !== previous) return;
  }
  if (state === 'play') paintBeat();
  frame = requestAnimationFrame(tick);
}

function answer(move) {
  if (state !== 'play' || round.beats.has(round.index)) return;
  if (game.dataset.beat !== 'open') {
    round.feedback = game.dataset.beat === 'late' ? 'miss' : 'early';
  } else if (move !== round.moves[round.index]) {
    round.feedback = 'wrong';
  } else {
    round.beats.add(round.index);
    round.hits++;
    game.dataset.hits = String(round.hits);
    round.feedback = 'hit';
    announceDance(move, 'both');
  }
  paintCue();
  paintBeat();
}

function backToWalk() {
  cancelAnimationFrame(frame);
  if (replay) {
    history.replaceState(null, '', location.pathname + location.search);
    look = startingLook();
    look.jacket ??= true;
    updateLook();
  }
  replay = null;
  round = null;
  game.dataset.replay = 'false';
  game.dataset.area = area;
  world.endDance();
  setState('walk');
  paintMission();
  (nearNari ? rehearsal : lookToggle).focus({preventScroll: true});
}

function saveCard() {
  if (state !== 'result' || replay || cardId) return;
  try {
    const photo = world.capturePhoto();
    if (!/^data:image\/(?:webp|jpeg);base64,/.test(photo)) throw new Error('Photo capture returned an unsupported image');
    cardId = saveDuet({...look, finalMove: round.moves.at(-1), photo});
    saveStatus = readDuet(cardId)?.photo ? 'saved' : 'savedWithoutPhoto';
    audio.cue('spotlight');
  } catch (error) {
    console.warn('Seoul Encore photo could not be saved.', error);
    saveStatus = 'saveError';
  }
  paintSaveStatus();
}

function showFailure(kind, error) {
  cancelAnimationFrame(frame);
  resetControls();
  audio.exit();
  world?.dispose();
  world = undefined;
  failure = kind;
  if (error) console.warn('Seoul Encore 3D could not load.', error);
  setState('error');
  paintFailure();
}

async function load() {
  failure = null;
  setState('loading');
  const hash = location.hash.slice(1);
  if (hash) {
    const match = /^replay\/([a-z0-9]+)$/i.exec(hash);
    replay = match && readDuet(match[1]);
    if (!replay) {
      showFailure('replay');
      return;
    }
    look = {outfit: replay.outfit, wandColor: replay.wandColor, jacket: replay.jacket ?? true};
    game.dataset.replay = 'true';
  }

  try {
    world = await createWorld(canvas, {
      onArea(next) {
        area = next;
        game.dataset.area = area;
        nearNari = false;
        paintMission();
        if (area !== 'street') audio.cue('step');
      },
      onNear(near) {
        nearNari = near;
        paintMission();
        if (near) audio.cue('spotlight');
      },
    });
    updateLook();
    if (replay) startRound('replay');
    else {
      setState('walk');
      paintMission();
    }
  } catch (error) {
    showFailure('scene', error);
  }
}

document.addEventListener('pointerup', event => {
  if (state !== 'loading' && state !== 'error' && event.target instanceof Element && !event.target.closest('a, #sound')) playAudio();
}, {passive: true});
joystick.addEventListener('pointerdown', event => {
  if (!canWalk() || event.button !== 0 || joystickPointer !== null) return;
  joystickPointer = event.pointerId;
  joystick.setPointerCapture(event.pointerId);
  moveJoystick(event);
});
joystick.addEventListener('pointermove', event => {
  if (event.pointerId === joystickPointer) moveJoystick(event);
});
for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
  joystick.addEventListener(type, event => {
    if (event.pointerId === joystickPointer) releaseJoystick();
  });
  canvas.addEventListener(type, event => {
    if (event.pointerId === orbitPointer?.id) releaseOrbit();
  });
}
canvas.addEventListener('pointerdown', event => {
  if (state !== 'walk' || event.button !== 0 || orbitPointer) return;
  orbitPointer = {id: event.pointerId, x: event.clientX, y: event.clientY};
  canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener('pointermove', event => {
  if (event.pointerId !== orbitPointer?.id) return;
  world.orbit(event.clientX - orbitPointer.x, event.clientY - orbitPointer.y);
  orbitPointer.x = event.clientX;
  orbitPointer.y = event.clientY;
});
canvas.addEventListener('webglcontextlost', event => {
  event.preventDefault();
  if (world) showFailure('scene', new Error('WebGL context lost'));
});

document.addEventListener('keydown', event => {
  const editing = event.target instanceof Element && event.target.matches('input, textarea, select, [contenteditable]');
  if (event.altKey || event.ctrlKey || event.metaKey || editing) return;
  if (event.code === 'Escape') {
    if (!wardrobe.hidden) setWardrobe(false, true);
    else if (state === 'result' || Object.hasOwn(durations, state)) backToWalk();
    return;
  }
  if (canWalk() && directionKeys.has(event.code)) {
    event.preventDefault();
    playAudio();
    keysHeld.add(event.code);
    moveInput();
  } else if (state === 'walk' && (event.code === 'KeyQ' || event.code === 'KeyE')) {
    event.preventDefault();
    world.orbit(event.code === 'KeyQ' ? 15 : -15, 0);
  } else if (canWalk() && nearNari && event.code === 'KeyF' && !event.repeat) {
    playAudio();
    startRound('demo');
  } else if (state === 'play' && !event.repeat) {
    const index = /^(?:Digit|Numpad)([1-5])$/.exec(event.code);
    if (index) {
      event.preventDefault();
      playAudio();
      answer(moveButtons[Number(index[1]) - 1].dataset.move);
    }
  }
});
document.addEventListener('keyup', event => {
  if (keysHeld.delete(event.code)) moveInput();
});
window.addEventListener('blur', resetControls);
window.addEventListener('hashchange', () => location.reload());
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) return;
  resetControls();
  if (round) round.lastTime = null;
});

lookToggle.addEventListener('click', () => setWardrobe(wardrobe.hidden));
byId('look-close').addEventListener('click', () => setWardrobe(false, true));
jacketButton.addEventListener('click', () => {
  look.jacket = !look.jacket;
  storePreference('encore.v2.jacket', look.jacket ? 'on' : 'off');
  updateLook();
  audio.cue('step');
});
wardrobe.addEventListener('click', event => {
  const button = event.target.closest('[data-outfit], [data-wand]');
  if (!button) return;
  if (button.dataset.outfit) {
    look.outfit = button.dataset.outfit;
    storePreference('encore.v2.outfit', look.outfit);
  } else {
    look.wandColor = button.dataset.wand;
    storePreference('encore.v2.color', look.wandColor);
  }
  updateLook();
  audio.cue('step');
});
rehearsal.addEventListener('click', () => {
  if (canWalk() && nearNari) {
    playAudio();
    startRound('demo');
  }
});
for (const button of moveButtons) button.addEventListener('click', () => {
  playAudio();
  answer(button.dataset.move);
});
byId('stop-duet').addEventListener('click', backToWalk);
byId('repeat-duet').addEventListener('click', () => {
  playAudio();
  startRound(replay ? 'replay' : 'demo');
});
byId('return-explore').addEventListener('click', backToWalk);
saveButton.addEventListener('click', saveCard);
byId('retry-load').addEventListener('click', () => location.reload());

languageButton.addEventListener('click', () => {
  lang = lang === 'ru' ? 'tr' : 'ru';
  storePreference('encore1.lang', lang);
  paintLanguage();
});
soundButton.addEventListener('click', () => {
  sound = !sound;
  storePreference('encore1.sound', sound ? 'on' : 'off');
  audio.setEnabled(sound);
  paintSound();
  playAudio();
});

audio.setEnabled(sound);
paintLanguage();
void load();
