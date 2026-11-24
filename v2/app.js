import {createLisaEncore, ENCORE_BEAT_MS, createFestivalRound, FESTIVAL_BEAT_MS} from './festival-round.js';
import {saveLisaEncorePhoto, clearInvitation, equipHongdaeStick, readDuet, readHongdaeStick, readInvitation, saveDuet, saveInvitation, savePixelPhoto, startingLook} from './album.js';
import {createWorld} from './world.js';
import {isShopStick, stickColor, stickName} from '../js/lightstick.js';
import {worldAudio as audio} from '../js/world-audio.js';
import {silentStageBreak, pauseStageMusic, resumeStageMusic, setStageSound, stageApplause, startStageMusic, stopStageMusic} from './stage-music.js';

const phrases = {
  ru: {
    bowTitle: 'Спасибо, Хондэ!',
    blackoutHint: 'В зале гаснет свет…',
    encoreTitle: 'Секретный бис Лисы',
    entranceHint: 'Один прожектор. Из-за кулис выходит Лиса.',
    relightHint: 'В такт коснись звезды — зажги четыре ряда',
    finaleHint: 'Весь зал сияет твоим цветом!',
    encoreSaved: 'Твоя карточка с концерта уже в альбоме',
    encoreError: 'Не удалось сохранить карточку на устройстве',
    encoreRetry: 'Сохранить ещё раз',
    phone: 'Телефон Софии',
    openPhone: 'Открыть телефон',
    language: 'Язык',
    audienceTicket: 'Билет в зал',
    exit: 'Вернуться в основную игру',
    sceneLabel: 'Трёхмерная сцена Seoul Encore',
    routeLabel: 'Маршрут к Нари',
    arenaRouteLabel: 'Маршрут к концертной арене',
    loading: 'Сеул зажигает огни',
    loadingDescription: 'Готовим улицу и репетиционный зал…',
    retryLoad: 'Загрузить снова',
    loadError: 'Сцена не загрузилась',
    loadErrorDetail: 'Для этой главы нужен браузер с поддержкой WebGL. Попробуй загрузить сцену снова.',
    replayError: 'Запись не найдена',
    replayErrorDetail: 'Открой сохранённый танец в альбоме на устройстве, где ты его записала.',
    street: 'Улица в Сеуле',
    streetObjective: 'Войди в здание YG впереди',
    festivalTitle: 'Волна Хондэ',
    festivalJoin: 'На концерт',
    festivalTap: 'Зажечь лайтстик',
    festivalHint: 'Коснись звезды, когда кольца совпадут',
    festivalRoute: 'Под вывеской HONGDAE начинается концерт',
    festivalShop: 'Выбери лайтстик у Минхо и возвращайся на концерт',
    festivalDone: 'До встречи, Хондэ!',
    festivalBest: 'Твой рекорд',
    festivalLeave: 'На улицу',
    festivalAgain: 'Ещё раз',
    hongdae: 'Хондэ',
    minho: 'Магазин Минхо',
    hongdaeRoute: 'К Пикселю через указатель «Хондэ» справа',
    hongdaeObjective: 'Пиксель рядом. Зайди в магазин справа',
    hongdaeBoothObjective: 'Фотокабина на другой стороне улицы',
    minhoObjective: 'Подойди к полке, чтобы взять лайтстик',
    minhoEquipped: 'С Пикселем и лайтстиком к фотокабине',
    hongdaeEnter: 'В Хондэ',
    hongdaeExit: 'Обратно к YG',
    hongdaeLoading: 'Открываем Хондэ…',
    hongdaeError: 'Хондэ не загрузился. Попробуй снова.',
    stickEquip: 'Взять',
    stickBuy: 'Купить',
    stickCoupon: '1 купон',
    stickEquipped: 'В руке',
    stickError: 'Не удалось взять лайтстик. Попробуй ещё раз.',
    boothTitle: 'Фотокабина',
    boothAction: 'Сделать фото',
    boothPose: 'Улыбнись!',
    boothPhotoAlt: 'София и Пиксель в фотокабине Хондэ',
    boothNeedsStick: 'Возьми с полки лайтстик и вернись к фотокабине',
    boothCaptureError: 'Кадр не получился. Попробуй ещё раз.',
    boothSaveError: 'Не удалось сохранить кадр. Попробуй ещё раз.',
    boothSaved: 'Фото с Пикселем сохранено в альбоме.',
    boothRetake: 'Сделать новый кадр',
    boothRetakeShort: 'Снова',
    lobby: 'Лобби YG',
    lobbyObjective: 'Пройди прямо в репетиционный зал',
    practice: 'Репетиционный зал',
    practiceObjective: 'Подойди к Нари',
    nearObjective: 'Нари ждёт тебя на танцполе',
    startDuet: 'Танцевать с Нари',
    nari: 'Нари',
    plaza: 'Площадь у арены',
    arena: 'Концертная арена',
    journeyPractice: 'Выйди из студии вместе с Нари',
    journeyLobby: 'Через лобби — на улицу',
    journeyStreet: 'Иди прямо к концертной арене',
    journeyPlaza: 'Пройди через площадь к входу на арену',
    journeyArena: 'Иди к сцене и поднимись по пандусу',
    stageReady: 'Нари рядом. Пора на сцену!',
    startConcert: 'Начать концерт',
    finaleLabel: 'Финальный жест',
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
    danceControls: 'Движения танца',
    stopDance: 'Остановить танец',
    duet: 'София × Нари',
    side: 'Вбок',
    jump: 'Прыжок',
    spin: 'Поворот',
    heart: 'Сердце',
    step: 'Шаг',
    demo: 'Нари показывает движения',
    demoCue: 'Смотри на Нари',
    play: 'Теперь вместе',
    playCue: 'Нажми, когда кольцо загорится',
    concert: 'Прямой эфир · Арена',
    concertCue: 'Нажми, когда кольцо загорится',
    replay: 'Запись дуэта',
    replayCue: 'Смотри сохранённый танец',
    arenaReplay: 'Запись с арены',
    hit: 'В такт!',
    early: 'Подожди, пока загорится кольцо',
    wrong: 'Повтори движение, которое показывает Нари',
    miss: 'Следи за следующим кольцом',
    resultKicker: 'Репетиция окончена',
    concertKicker: 'Концерт окончен · Аплодисменты!',
    scoreLabel: 'В такт',
    resultCopy: 'Сохрани кадр с вашим дуэтом в альбом Софии.',
    concertCopy: 'Сохрани фотокарту с твоего первого концерта с Нари.',
    inviteCopy: 'Станцуем на сцене?',
    acceptInvite: 'Пойдём на концерт',
    acceptInviteShort: 'К арене',
    resumeInvite: 'Вернуться к приглашению Нари',
    resumeInviteShort: 'Приглашение Нари',
    preparingArena: 'Готовим арену…',
    arenaError: 'Арена не загрузилась. Попробуй ещё раз.',
    replayResult: 'Этот дуэт уже в альбоме Софии.',
    saved: 'Кадр сохранён в альбом Софии.',
    savedWithoutPhoto: 'Дуэт сохранён. Для фотографии не хватило места.',
    saveError: 'Не удалось сохранить фотокарту. Попробуй снова.',
    save: 'В альбом',
    photoAlt: 'Фотокарта дуэта Софии и Нари',
    repeat: 'Танцевать снова',
    watchAgain: 'Смотреть снова',
    watchShort: 'Смотреть',
    repeatShort: 'Повторить',
    album: 'Открыть альбом',
    albumShort: 'Альбом',
    backShort: 'Назад',
    backToWalk: 'Вернуться в зал',
    backToStreet: 'Вернуться на улицу',
    backToArena: 'Вернуться на арену',
  },
  tr: {
    bowTitle: 'Teşekkürler, Hongdae!',
    blackoutHint: 'Salonda ışıklar sönüyor…',
    encoreTitle: 'Lisa’nın gizli bisi',
    entranceHint: 'Tek bir spot yanıyor. Lisa kulisten çıkıyor.',
    relightHint: 'Ritimde yıldıza dokun, dört sırayı aydınlat',
    finaleHint: 'Bütün salon senin renginde parlıyor!',
    encoreSaved: 'Bu gecenin fotokartı albümünde',
    encoreError: 'Fotokart bu cihaza kaydedilemedi',
    encoreRetry: 'Kaydı yeniden dene',
    phone: 'Sofia’nın telefonu',
    openPhone: 'Telefonu aç',
    language: 'Dil',
    audienceTicket: 'Seyirci bileti',
    exit: 'Ana oyuna dön',
    sceneLabel: 'Seoul Encore üç boyutlu sahnesi',
    routeLabel: 'Nari’ye giden yol',
    arenaRouteLabel: 'Konser arenasına giden yol',
    loading: 'Seul ışıklarını yakıyor',
    loadingDescription: 'Sokak ve prova salonu hazırlanıyor…',
    retryLoad: 'Yeniden yükle',
    loadError: 'Sahne yüklenemedi',
    loadErrorDetail: 'Bu bölüm WebGL destekli bir tarayıcı gerektiriyor. Sahneyi yeniden yüklemeyi dene.',
    replayError: 'Kayıt bulunamadı',
    replayErrorDetail: 'Albümdeki dansı kaydettiğin cihazdan açabilirsin.',
    street: 'Seul sokağı',
    streetObjective: 'İlerideki YG binasına gir',
    festivalTitle: 'Hongdae ışık dalgası',
    festivalJoin: 'Konsere katıl',
    festivalTap: 'Lightstick’i yak',
    festivalHint: 'Halkalar birleşince yıldıza dokun',
    festivalRoute: 'HONGDAE tabelasının altında konser var',
    festivalShop: 'Minho’dan bir lightstick seçip konsere dön',
    festivalDone: 'Görüşürüz, Hongdae!',
    festivalBest: 'En iyi skorun',
    festivalLeave: 'Sokağa dön',
    festivalAgain: 'Yeniden oyna',
    hongdae: 'Hongdae',
    minho: 'Minho’nun dükkânı',
    hongdaeRoute: 'Pixel için sağdaki Hongdae tabelasına yaklaş',
    hongdaeObjective: 'Pixel yanında. Sağdaki dükkâna gir',
    hongdaeBoothObjective: 'Fotokabin sokağın karşı kaldırımında',
    minhoObjective: 'Işık çubuğu almak için bir rafa yaklaş',
    minhoEquipped: 'Pixel ve ışık çubuğunla fotokabine git',
    hongdaeEnter: 'Hongdae’ye git',
    hongdaeExit: 'YG’ye dön',
    hongdaeLoading: 'Hongdae hazırlanıyor…',
    hongdaeError: 'Hongdae yüklenemedi. Yeniden dene.',
    stickEquip: 'Eline al',
    stickBuy: 'Satın al',
    stickCoupon: '1 kupon',
    stickEquipped: 'Elinde',
    stickError: 'Işık çubuğu alınamadı. Yeniden dene.',
    boothTitle: 'Fotokabin',
    boothAction: 'Fotoğraf çek',
    boothPose: 'Gülümse!',
    boothPhotoAlt: 'Hongdae fotokabininde Sofia ve Pixel',
    boothNeedsStick: 'Raftan bir ışık çubuğu alıp fotokabine dön',
    boothCaptureError: 'Fotoğraf çekilemedi. Yeniden dene.',
    boothSaveError: 'Fotoğraf kaydedilemedi. Yeniden dene.',
    boothSaved: 'Pixel’le çekildiğin fotoğraf albüme eklendi.',
    boothRetake: 'Yeni fotoğraf çek',
    boothRetakeShort: 'Yeniden',
    lobby: 'YG lobisi',
    lobbyObjective: 'Düz ilerleyip prova salonuna gir',
    practice: 'Prova salonu',
    practiceObjective: 'Nari’ye yaklaş',
    nearObjective: 'Nari seni dans pistinde bekliyor',
    startDuet: 'Nari ile dans et',
    nari: 'Nari',
    plaza: 'Arena meydanı',
    arena: 'Konser arenası',
    journeyPractice: 'Nari’yle birlikte stüdyodan çık',
    journeyLobby: 'Lobiden geçip sokağa çık',
    journeyStreet: 'Düz ilerleyip konser arenasına yürü',
    journeyPlaza: 'Meydanı geçip arena girişine git',
    journeyArena: 'Sahneye yürü ve rampadan çık',
    stageReady: 'Nari yanında. Sahneye çıkma zamanı!',
    startConcert: 'Konseri başlat',
    finaleLabel: 'Final hareketi',
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
    danceControls: 'Dans hareketleri',
    stopDance: 'Dansı durdur',
    duet: 'Sofia × Nari',
    side: 'Yana adım',
    jump: 'Sıçra',
    spin: 'Dön',
    heart: 'Kalp',
    step: 'Adım',
    demo: 'Nari hareketleri gösteriyor',
    demoCue: 'Nari’yi izle',
    play: 'Şimdi birlikte',
    playCue: 'Halka parlayınca dokun',
    concert: 'Canlı · Arena',
    concertCue: 'Halka parlayınca dokun',
    replay: 'Düet kaydı',
    replayCue: 'Kaydettiğin dansı izle',
    arenaReplay: 'Arena kaydı',
    hit: 'Tam ritminde!',
    early: 'Halka parlayana kadar bekle',
    wrong: 'Nari’nin gösterdiği hareketi yap',
    miss: 'Sonraki halkayı takip et',
    resultKicker: 'Prova tamamlandı',
    concertKicker: 'Konser bitti · Alkışlar!',
    scoreLabel: 'Ritim',
    resultCopy: 'Düetinizi Sofia’nın albümüne kaydet.',
    concertCopy: 'Nari’yle ilk konserinin fotokartını albüme kaydet.',
    inviteCopy: 'Sahnede dans edelim mi?',
    acceptInvite: 'Konsere gidelim',
    acceptInviteShort: 'Arenaya',
    resumeInvite: 'Nari’nin davetine dön',
    resumeInviteShort: 'Nari’nin daveti',
    preparingArena: 'Arena hazırlanıyor…',
    arenaError: 'Arena yüklenemedi. Yeniden dene.',
    replayResult: 'Bu düet Sofia’nın albümünde kayıtlı.',
    saved: 'Fotokart Sofia’nın albümüne kaydedildi.',
    savedWithoutPhoto: 'Düet kaydedildi. Fotoğraf için yer kalmadı.',
    saveError: 'Fotokart kaydedilemedi. Yeniden dene.',
    save: 'Albüme ekle',
    photoAlt: 'Sofia ile Nari’nin düet fotokartı',
    repeat: 'Yeniden dans et',
    watchAgain: 'Yeniden izle',
    watchShort: 'İzle',
    repeatShort: 'Tekrar',
    album: 'Albümü aç',
    albumShort: 'Albüm',
    backShort: 'Geri',
    backToWalk: 'Salona dön',
    backToStreet: 'Sokağa dön',
    backToArena: 'Arenaya dön',
  },
};

const byId = id => document.getElementById(id);
const game = byId('game');
const canvas = byId('scene');
const joystick = byId('joystick');
const rehearsal = byId('rehearse');
const startConcert = byId('start-concert');
const hongdaeAction = byId('hongdae-action');
const boothPhoto = byId('booth-photo');
const boothSave = byId('booth-save');
const inviteButton = byId('invite-nari');
const resumeButton = byId('resume-invite');
const watchCard = byId('watch-card');
const wardrobe = byId('wardrobe');
const lookToggle = byId('look-toggle');
const soundButton = byId('sound');
const phoneToggle = byId('phone-toggle');
const phone = byId('phone');
const languageButton = byId('language');
const jacketButton = byId('jacket');
const saveButton = byId('save-card');
const resultPhoto = byId('result-photo');
const outfits = [...wardrobe.querySelectorAll('[data-outfit]')];
const wandOptions = wardrobe.querySelector('.wand-select > div');
const moveButtons = [...byId('move-buttons').querySelectorAll('[data-move]')];
const beatMeter = byId('beat-meter');
const beatMarker = byId('beat-marker');
const finaleButtons = [...byId('finale-select').querySelectorAll('[data-finale]')];
const phraseMarks = [...byId('duet-banner').querySelectorAll('.phrase i')];

const moves = {
  side: {icon: '↔', note: 0},
  jump: {icon: '↑', note: 1},
  spin: {icon: '↻', note: 2},
  heart: {icon: '♡', note: 2},
  step: {icon: '⇢', note: 0},
};
const timings = {
  demo: {duration: 1390, cue: 280},
  play: {duration: 2180, cue: 1090, tolerance: 500},
  concert: {duration: 1860, cue: 930, tolerance: 435},
  replay: {duration: 1320, cue: 220},
};
const arenaReplayTiming = {duration: timings.concert.duration, cue: 465};
const stageBeatMs = timings.concert.duration / 4;
const finales = new Set(finaleButtons.map(button => button.dataset.finale));
const arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
const directionKeys = new Set([...arrows, 'KeyW', 'KeyA', 'KeyS', 'KeyD']);
const keysHeld = new Set();
const hongdaeActions = {
  'hongdae-enter': {label: 'hongdaeEnter', icon: '↗'},
  'hongdae-exit': {label: 'hongdaeExit', icon: '↩'},
  booth: {label: 'boothAction', icon: '▣'},
};

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
const savedFinale = preference('encore.v2.finale');
let selectedFinale = finales.has(savedFinale) ? savedFinale : 'heart';
let invitation = readInvitation();
let concertFinale = null;
let arenaPending = false;
let arenaError = false;
let stageAudioRequested = false;
let world;
let state = 'loading';
let area = 'street';
let spot = null;
let hongdaePending = false;
let hongdaeFeedback = '';
let shopStick = readHongdaeStick();
let booth = null;
let boothTimer = 0;
let festival = null;
let encore = null;
let encorePhoto = null;
let encoreId = null;
let festivalFrame = 0;
let festivalBest = Number(preference('encore.v2.hongdae-wave.best')) || 0;
let nearNari = false;
let replay = null;
let failure = null;
let frame = 0;
let round;
let saveStatus = '';
let cardId = null;
let previewRound = null;
let previewPhoto = null;
let joystickPointer = null;
let orbitPointer = null;
let joystickInput = {x: 0, y: 0};

const words = key => phrases[lang][key];
const setText = (id, value) => { byId(id).textContent = value; };
const canWalk = () => state === 'walk' && wardrobe.hidden && !phone.open && !arenaPending && !hongdaePending;
const journey = () => concertFinale !== null;
const arenaRound = () => round?.venue === 'arena';
const rhythmState = phase => phase === 'play' || phase === 'concert';
const stagePerformance = () => arenaRound() && (state === 'concert' || state === 'replay');
const timing = () => state === 'replay' && arenaRound() ? arenaReplayTiming : timings[state];
const concertPlan = () => replay && !arenaRound() ? replay : invitation;
const albumHref = byId('album-link').getAttribute('href');
const inHongdae = () => area === 'hongdae' || area === 'minho';

function shelfStick() {
  const id = spot?.startsWith('shelf-') ? spot.slice(6) : null;
  return area === 'minho' && isShopStick(id) ? id : null;
}

function hongdaeContext() {
  if (area === 'street' && spot === 'hongdae-enter') return hongdaeActions[spot];
  if (inHongdae() && spot === 'hongdae-exit') return hongdaeActions[spot];
  if (area === 'hongdae' && spot === 'festival' && shopStick) return {label:'festivalJoin',icon:'♫'};
  if (area === 'hongdae' && spot === 'booth' && shopStick) return hongdaeActions[spot];
  const shelf = shelfStick();
  if (shelf) {
    const owned = shelf === shopStick || preference('encore1.bought.' + shelf) === '1';
    return {label: shelf === shopStick ? 'stickEquipped' : owned ? 'stickEquip' : 'stickBuy', icon: '✦', shelf};
  }
  return null;
}

function paintSaveStatus() {
  setText('save-status', saveStatus ? words(saveStatus) : '');
  byId('save-status').hidden = !saveStatus;
  byId('save-status').dataset.error = String(saveStatus === 'saveError');
  byId('result-copy').hidden = Boolean(previewPhoto) || cardId !== null;
  saveButton.disabled = cardId !== null;
  saveButton.hidden = Boolean(replay) || cardId !== null;
  watchCard.hidden = cardId === null;
  if (cardId) watchCard.href = `./#replay/${cardId}`;
}

function capturePhoto() {
  const photo = world.capturePhoto();
  if (!/^data:image\/(?:webp|jpeg);base64,/.test(photo)) throw new Error('Photo capture returned an unsupported image');
  return photo;
}

function paintPhotoPreview() {
  resultPhoto.alt = words('photoAlt');
  if (state !== 'result' || previewRound === round) return;
  previewRound = round;
  previewPhoto = null;
  try {
    previewPhoto = replay?.photo ?? capturePhoto();
    resultPhoto.src = previewPhoto;
  } catch (error) {
    console.warn('Seoul Encore photo preview could not be captured.', error);
    resultPhoto.removeAttribute('src');
  }
  resultPhoto.hidden = !previewPhoto;
}

function paintMission() {
  setText('area', words(area));
  byId('mission').setAttribute('aria-label', words(inHongdae() ? area : journey() ? 'arenaRouteLabel' : 'routeLabel'));
  const context = hongdaeContext();
  const direction = byId('hongdae-route');
  const purchase = context?.label === 'stickBuy';
  const loadingDistrict = hongdaePending && !context;
  direction.textContent = words(loadingDistrict ? 'hongdaeLoading' : purchase ? 'stickCoupon' : 'hongdaeRoute');
  direction.hidden = !loadingDistrict && !purchase && (area !== 'street' || journey() || Boolean(context));
  if (area === 'hongdae' && shopStick && !context) {
    direction.hidden = false;
    direction.textContent = words('festivalRoute');
  }
  const journeyObjective = `journey${area[0].toUpperCase()}${area.slice(1)}`;
  let objective = journey() || area === 'arena' || area === 'plaza'
    ? (nearNari ? 'stageReady' : journeyObjective)
    : (nearNari ? 'nearObjective' : `${area}Objective`);
  if (inHongdae()) {
    if (area === 'hongdae') objective = shopStick ? 'hongdaeBoothObjective' : 'hongdaeObjective';
    else objective = shopStick ? 'minhoEquipped' : 'minhoObjective';
    if (spot === 'festival') objective = shopStick ? 'festivalTitle' : 'festivalShop';
    if (spot === 'booth' && !shopStick) objective = 'boothNeedsStick';
  }
  setText('objective', context?.shelf ? stickName(context.shelf, lang) : words(objective));
  rehearsal.hidden = journey() || !nearNari || inHongdae() || Boolean(context);
  startConcert.hidden = !journey() || !nearNari || inHongdae() || Boolean(context);
  hongdaeAction.hidden = !context;
  hongdaeAction.disabled = hongdaePending || arenaPending || Boolean(context?.shelf && context.shelf === shopStick);
  hongdaeAction.setAttribute('aria-busy', String(hongdaePending));
  if (context) {
    hongdaeAction.dataset.spot = spot;
    const label = words(hongdaePending ? 'hongdaeLoading' : context.label);
    setText('hongdae-action-icon', context.icon);
    setText('hongdae-action-label', label);
    const name = context.shelf ? `${label} · ${stickName(context.shelf, lang)}` : label;
    hongdaeAction.setAttribute('aria-label', purchase ? `${name} · ${words('stickCoupon')}` : name);
  } else {
    delete hongdaeAction.dataset.spot;
  }
  setText('hongdae-status', hongdaeFeedback ? words(hongdaeFeedback) : '');
  byId('hongdae-status').hidden = !hongdaeFeedback;
  paintInvitation();
}

function paintResult() {
  paintPhotoPreview();
  setText('result-title', words('duet'));
  setText('result-kicker', words(arenaRound() ? 'concertKicker' : 'resultKicker'));
  setText('result-copy', words(replay ? 'replayResult' : arenaRound() ? 'concertCopy' : 'resultCopy'));
  setText('repeat-icon', replay ? '▷' : '↻');
  setText('repeat-label', words(replay ? 'watchShort' : 'repeatShort'));
  byId('repeat-duet').setAttribute('aria-label', words(replay ? 'watchAgain' : 'repeat'));
  const returnLabel = replay ? (arenaRound() ? 'album' : 'backToStreet') : (arenaRound() ? 'backToArena' : 'backToWalk');
  byId('return-explore').setAttribute('aria-label', words(returnLabel));
  byId('return-explore').hidden = Boolean(replay) && arenaRound();
  const score = byId('result-score');
  score.hidden = Boolean(replay) || !round;
  if (round) score.textContent = `${words('scoreLabel')} · ${round.hits}/${round.moves.length}`;
  paintSaveStatus();
  paintInvitation();
}

function paintInvitation() {
  byId('concert-invite').hidden = !concertPlan() || journey() || arenaRound();
  resumeButton.hidden = !invitation || Boolean(replay) || journey() || area !== 'street' || !hongdaeAction.hidden;
  setText('invite-nari-label', words(arenaPending ? 'preparingArena' : 'acceptInviteShort'));
  inviteButton.setAttribute('aria-label', words(arenaPending ? 'preparingArena' : 'acceptInvite'));
  setText('resume-invite-label', words(arenaPending ? 'preparingArena' : 'resumeInviteShort'));
  resumeButton.setAttribute('aria-label', words(arenaPending ? 'preparingArena' : 'resumeInvite'));
  for (const button of [inviteButton, resumeButton]) {
    button.disabled = arenaPending || (button === resumeButton && hongdaePending);
    button.setAttribute('aria-busy', String(arenaPending));
  }
  lookToggle.disabled = arenaPending || hongdaePending || state !== 'walk';
  for (const id of ['invite-status', 'walk-invite-status']) {
    setText(id, arenaError ? words('arenaError') : '');
    byId(id).hidden = !arenaError || (id === 'walk-invite-status' && resumeButton.hidden);
  }
}

function paintFinale() {
  byId('finale-select').hidden = journey();
  for (const button of finaleButtons) button.setAttribute('aria-pressed', String(button.dataset.finale === selectedFinale));
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
  const failedArena = failure === 'arena';
  setText('failure-title', words(missingReplay ? 'replayError' : 'loadError'));
  setText('failure-detail', words(missingReplay ? 'replayErrorDetail' : failedArena ? 'arenaError' : 'loadErrorDetail'));
  byId('retry-load').hidden = missingReplay;
  const link = byId('error-back');
  link.href = missingReplay || replay ? albumHref : byId('exit-game').href;
  link.textContent = words(missingReplay || replay ? 'album' : 'exit');
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
  languageButton.setAttribute('aria-label', `${words('language')} · ${nextLanguage}`);
  languageButton.title = nextLanguage;
  paintSound();
  paintJacket();
  paintFinale();
  paintMission();
  paintResult();
  paintBooth();
  if (festival) paintFestival();
  paintFailure();
  if (round && Object.hasOwn(timings, state)) paintCue();
}

function setState(next) {
  state = next;
  game.dataset.state = next;
  const walking = next === 'walk';
  const dancing = Object.hasOwn(timings, next);
  byId('startup').hidden = next !== 'loading';
  byId('failure').hidden = next !== 'error';
  byId('mission').hidden = !walking;
  byId('walk-controls').hidden = !walking;
  byId('duet-banner').hidden = !dancing;
  byId('dance-panel').hidden = !dancing;
  byId('move-buttons').hidden = !rhythmState(next);
  byId('result').hidden = next !== 'result';
  paintBooth();
  byId('festival-panel').hidden = next !== 'festival';
  if (!rhythmState(next)) delete game.dataset.beat;
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
  world.equipShopStick(replay ? null : shopStick);
  game.dataset.shopStick = replay ? '' : shopStick ?? '';
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
  game.dataset.lookOpen = String(open);
  byId('walk-controls').inert = open;
  world.setLookPreview(open);
  if (open) {
    resetControls();
    byId('look-close').focus({preventScroll: true});
  } else if (restoreFocus) {
    phoneToggle.focus({preventScroll: true});
  }
}

function openPhone() {
  if (phone.open) return;
  if (!wardrobe.hidden) setWardrobe(false);
  resetControls();
  paintInvitation();
  phone.showModal();
  if (round) round.lastTime = null;
  if (stagePerformance()) pauseStageMusic();
  if (festival) pauseFestival();
  phoneToggle.setAttribute('aria-expanded', 'true');
  byId('phone-close').focus({preventScroll: true});
}

function closePhone() {
  if (!phone.open) return;
  phone.close();
  if (festival) playAudio();
  if (stagePerformance()) {
    resumeStageMusic();
    playAudio();
  }
}

function playAudio() {
  if (!sound || phone.open || document.hidden) return;
  if (festival) {
    const solo=encore && ['entrance','relight','finale'].includes(encore.phase);
    if ((!festival.complete || solo) && !stageAudioRequested) {
      const session = festival;
      stageAudioRequested = true;
      void startStageMusic({beatMs:solo?ENCORE_BEAT_MS:FESTIVAL_BEAT_MS, solo:Boolean(solo), offsetMs:() => solo ? encore?.musicTime ?? 0 : session.elapsed}).then(started => {
        if (!started && session===festival) stageAudioRequested = false;
      });
    }
    return;
  }
  if (!arenaRound()) {
    void audio.enter();
  } else if (stagePerformance() && !stageAudioRequested) {
    stageAudioRequested = true;
    const current = round;
    void startStageMusic({beatMs: stageBeatMs}).then(started => {
      if (!started && round === current) stageAudioRequested = false;
    }).catch(error => {
      if (round === current) stageAudioRequested = false;
      console.warn('Seoul Encore concert audio could not play.', error);
    });
  }
}

function closeStageAudio() {
  stopStageMusic();
  stageAudioRequested = false;
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
  setText('duet-mode', words(state === 'replay' && arenaRound() ? 'arenaReplay' : state));
  setText('cue-phase', words(state + 'Cue'));
  setText('cue-icon', moves[current].icon);
  setText('cue-title', words(current));
  setText('dance-step', `${index + 1} / ${sequence.length}`);
  const message = byId('dance-feedback');
  message.textContent = feedback ? words(feedback) : '';
  message.dataset.feedback = feedback;
  for (const button of moveButtons) {
    const move = button.dataset.move;
    const expected = move === current;
    button.hidden = !sequence.includes(move);
    button.classList.toggle('is-expected', expected);
    if (expected) {
      button.setAttribute('aria-current', 'step');
      if (beatMeter.parentElement !== button) button.append(beatMeter);
    } else {
      button.removeAttribute('aria-current');
    }
  }
  for (const [i, mark] of phraseMarks.entries()) {
    mark.classList.toggle('is-hit', beats.has(i));
    mark.classList.toggle('is-active', i === index);
  }
}

function paintBeat() {
  const {cue, tolerance} = timing();
  const offset = round.elapsed - cue;
  const beat = round.beats.has(round.index) ? 'hit' : offset < -tolerance ? 'early' : offset > tolerance ? 'late' : 'open';
  if (game.dataset.beat !== beat) game.dataset.beat = beat;
  beatMarker.style.setProperty('--beat-scale', Math.max(.78, 1 - .65 * offset / cue).toFixed(3));
}

function announceDance(move, actor) {
  world.dance(move, actor, 920);
  if (!arenaRound()) audio.note(moves[move].note);
}

function startRound(next, venue = 'studio') {
  cancelAnimationFrame(frame);
  resetControls();
  setWardrobe(false);
  closeStageAudio();
  cardId = null;
  saveStatus = '';
  const finale = replay?.finalMove ?? (venue === 'arena' ? concertFinale : selectedFinale);
  round = {
    venue, moves: ['side', 'jump', finale], index: 0, elapsed: 0, lastTime: null,
    shown: false, beats: new Set(), hits: 0, feedback: '',
  };
  if (venue === 'arena') audio.exit();
  world.startDance(venue);
  game.dataset.venue = venue;
  if (replay) game.dataset.area = venue === 'arena' ? 'arena' : 'practice';
  game.dataset.hits = '0';
  setState(next);
  paintCue();
  if (rhythmState(next)) paintBeat();
  frame = requestAnimationFrame(tick);
}

function nextBeat() {
  const missed = rhythmState(state) && !round.beats.has(round.index);
  if (++round.index === round.moves.length) {
    if (state === 'demo') {
      startRound('play');
    } else {
      world.poseForPhoto();
      if (arenaRound()) {
        closeStageAudio();
        if (sound) stageApplause();
      } else {
        audio.cue('delivery');
        if (!replay) rememberInvitation({...look, finalMove: round.moves.at(-1)});
      }
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
  if (phone.open) {
    round.lastTime = null;
    frame = requestAnimationFrame(tick);
    return;
  }
  if (round.lastTime !== null) round.elapsed += Math.min(125, now - round.lastTime);
  round.lastTime = now;
  const {cue, duration} = timing();
  if (!round.shown && round.elapsed >= cue) {
    round.shown = true;
    if (!arenaRound()) audio.groove(round.index);
    if (!round.beats.has(round.index)) {
      announceDance(round.moves[round.index], state === 'replay' ? 'both' : 'nari');
    }
  }
  if (round.elapsed >= duration) {
    const previous = state;
    nextBeat();
    // Starting a new phase schedules its own frame.
    if (state !== previous) return;
  }
  if (rhythmState(state)) paintBeat();
  frame = requestAnimationFrame(tick);
}

function answer(move) {
  if (!rhythmState(state) || phone.open || !round.moves.includes(move) || round.beats.has(round.index)) return;
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

function rememberInvitation(plan) {
  const {outfit, wandColor, jacket, finalMove} = plan;
  invitation = {outfit, wandColor, jacket: jacket ?? true, finalMove};
  try {
    saveInvitation(invitation);
  } catch (error) {
    console.warn('Seoul Encore invitation could not be saved.', error);
  }
}

function clearReplay() {
  if (replay) history.replaceState(null, '', location.pathname + location.search);
  replay = null;
  game.dataset.replay = 'false';
}

async function beginConcertWalk() {
  const plan = concertPlan();
  if (!plan || journey() || arenaPending || arenaRound() || (state !== 'result' && !canWalk())) return;
  const activeWorld = world;
  arenaError = false;
  arenaPending = true;
  resetControls();
  paintInvitation();
  try {
    await activeWorld.prepareArena();
    if (world !== activeWorld) return;

    rememberInvitation(plan);
    look = {outfit: plan.outfit, wandColor: plan.wandColor, jacket: plan.jacket ?? true};
    updateLook();
    concertFinale = plan.finalMove;
    nearNari = false;
    activeWorld.beginJourney();
    clearReplay();
    round = null;
    game.dataset.journey = 'true';
    game.dataset.venue = 'arena';
    paintFinale();
    setState('walk');
    paintMission();
    phoneToggle.focus({preventScroll: true});
    audio.cue('spotlight');
  } catch (error) {
    concertFinale = null;
    arenaError = true;
    console.warn('Seoul Encore concert venue could not load.', error);
  } finally {
    arenaPending = false;
    paintInvitation();
  }
}

function backToWalk() {
  if (arenaPending) return;
  cancelAnimationFrame(frame);
  closeStageAudio();
  if (replay && arenaRound()) {
    location.assign(albumHref);
    return;
  }
  const restoringLook = Boolean(replay);
  if (restoringLook) {
    look = startingLook();
    look.jacket ??= true;
  }
  clearReplay();
  if (restoringLook) updateLook();
  round = null;
  game.dataset.area = area;
  game.dataset.venue = journey() ? 'arena' : 'studio';
  world.endDance();
  setState('walk');
  paintMission();
  (nearNari ? (journey() ? startConcert : rehearsal) : phoneToggle).focus({preventScroll: true});
  playAudio();
}

function saveCard() {
  if (state !== 'result' || replay || cardId) return;
  try {
    const photo = previewPhoto ?? capturePhoto();
    cardId = saveDuet({...look, finalMove: round.moves.at(-1), venue: round.venue, photo});
    saveStatus = readDuet(cardId)?.photo ? 'saved' : 'savedWithoutPhoto';
    if (arenaRound() && saveStatus === 'saved') {
      invitation = null;
      try {
        clearInvitation();
      } catch (error) {
        console.warn('Seoul Encore invitation could not be cleared.', error);
      }
    } else if (!arenaRound()) {
      audio.cue('spotlight');
    }
  } catch (error) {
    console.warn('Seoul Encore photo could not be saved.', error);
    saveStatus = 'saveError';
  }
  paintSaveStatus();
}

async function enterHongdae(destination) {
  if (hongdaePending || inHongdae()) return;
  const activeWorld = world;
  hongdaePending = true;
  hongdaeFeedback = '';
  resetControls();
  paintMission();
  try {
    await activeWorld.enterHongdae(destination);
    if (world === activeWorld) {
      audio.cue('pixel');
      if (!phone.open) phoneToggle.focus({preventScroll: true});
    }
  } catch (error) {
    hongdaeFeedback = 'hongdaeError';
    console.warn('Seoul Encore Hongdae could not load.', error);
  } finally {
    hongdaePending = false;
    paintMission();
  }
}

function actInHongdae() {
  if (!canWalk() || !hongdaeContext() || hongdaeAction.disabled) return;
  hongdaeFeedback = '';
  if (spot === 'hongdae-enter') {
    void enterHongdae();
  } else if (spot === 'hongdae-exit') {
    resetControls();
    world.leaveHongdae();
    if (!phone.open) phoneToggle.focus({preventScroll: true});
  } else if (spot === 'festival') {
    startFestival();
  } else if (spot === 'booth') {
    takeBoothPhoto();
  } else {
    const shelf = shelfStick();
    try {
      const color = equipHongdaeStick(shelf);
      shopStick = shelf;
      look.wandColor = color;
      updateLook();
      audio.cue('delivery');
    } catch (error) {
      hongdaeFeedback = 'stickError';
      console.warn('Seoul Encore lightstick could not be equipped.', error);
    }
    paintMission();
  }
}

function paintFestival() {
  const phase=encore?.phase ?? 'group';
  game.dataset.encore=phase;
  const finished=phase==='card';
  const playing=phase==='group' || phase==='relight';
  const hints={group:'festivalHint',bow:'festivalDone',blackout:'blackoutHint',entrance:'entranceHint',relight:'relightHint',finale:'finaleHint',card:'finaleHint'};
  setText('festival-title',words(phase==='group'?'festivalTitle':['blackout','bow'].includes(phase)?'bowTitle':'encoreTitle'));
  setText('festival-hint',words(hints[phase]));
  const dotsContainer=byId('festival-dots');
  dotsContainer.hidden=!playing;
  if (dotsContainer.childElementCount!==(encore?4:8))
    dotsContainer.replaceChildren(...Array.from({length:encore?4:8},()=>document.createElement('i')));
  const dots = [...byId('festival-dots').children];
  dots.forEach((dot,i) => {dot.className = encore ? (i<encore.lit?'hit':'') : festival.hits[i]?'hit':festival.missed(i)?'miss':'';});
  setText('festival-score',encore ? (playing ? `${encore.lit}/4` : finished ? `${words('festivalBest')} ${festivalBest}/8` : '') : `${festival.score}/8`);
  byId('festival-tap').hidden = !playing;
  byId('festival-again').hidden = !finished;
  byId('encore-gift').hidden = !finished;
  if(finished) {
    const print=byId('encore-print');
    if(encorePhoto && print.getAttribute('src')!==encorePhoto.photo) print.src=encorePhoto.photo;
    print.hidden=!encorePhoto;
    print.alt=words('encoreTitle');
    setText('encore-status',words(encoreId?'encoreSaved':'encoreError'));
    byId('encore-album').hidden=!encoreId;
    byId('encore-retry').hidden=Boolean(encoreId);
  }
}

function awardEncorePrint() {
  if (encore?.phase!=='card' || encoreId) return;
  try {
    encorePhoto ??= {photo:world.captureEncorePhoto(stickColor(shopStick)), outfit:look.outfit, jacket:look.jacket,
      stick:shopStick,wandColor:stickColor(shopStick)};
    encoreId=saveLisaEncorePhoto(encorePhoto);
  } catch(error) {
    console.warn('Seoul Encore photocard could not be saved.',error);
  }
  paintFestival();
}

function festivalTick(now) {
  if (!festival || encore?.phase==='card') return;
  if (!phone.open && !document.hidden) {
    const tap=byId('festival-tap');
    if(encore) {
      const previous=encore.phase;
      encore.tick(now);
      world.showEncore(encore);
      if(previous!==encore.phase) {
        paintFestival();
        if(encore.phase==='entrance') playAudio();
        if(encore.phase==='relight') tap.focus({preventScroll:true});
        if(encore.phase==='card') {
          closeStageAudio();
          if(sound) stageApplause();
          awardEncorePrint();
          byId(encoreId?'encore-album':'encore-retry').focus({preventScroll:true});
          return;
        }
      }
    } else {
      festival.tick(now);
      [...byId('festival-dots').children].forEach((dot,i)=>{
        if (festival.missed(i) && !dot.classList.contains('miss')) dot.className='miss';
      });
      if (festival.complete) {
        if (festival.score>festivalBest) {
          festivalBest=festival.score;
          storePreference('encore.v2.hongdae-wave.best',String(festivalBest));
        }
        silentStageBreak();
        stageAudioRequested=false;
        encore=createLisaEncore();
        encore.tick(now);
        world.showEncore(encore);
        paintFestival();
      }
    }
    const track=encore ?? festival;
    tap.style.setProperty('--fan-ring',track.ring.toFixed(3));
    tap.dataset.ready=String(track.ready);
  }
  festivalFrame=requestAnimationFrame(festivalTick);
}

function pauseFestival() {
  (encore ?? festival).pause();
  closeStageAudio();
}

function startFestival() {
  resetControls();
  audio.exit();
  closeStageAudio();
  if(encore) world.festivalView(false);
  encore=null;
  encorePhoto=null;
  encoreId=null;
  world.festivalView(true,stickColor(shopStick));
  festival = createFestivalRound();
  byId('festival-dots').replaceChildren(...festival.hits.map(()=>document.createElement('i')));
  byId('festival-panel').style.setProperty('--fan-color',stickColor(shopStick));
  setState('festival');
  paintFestival();
  byId('festival-tap').focus({preventScroll:true});
  festivalTick(performance.now());
  playAudio();
}

function tapFestival() {
  if (!festival || phone.open || document.hidden) return;
  // Let the animation frame own the transition to the result, including its last beat.
  if ((encore ?? festival).tap()) {
    world.waveStick();
    paintFestival();
  }
}

function leaveFestival() {
  cancelAnimationFrame(festivalFrame);
  closeStageAudio();
  world.festivalView(false);
  festival = null;
  encore=null;
  encorePhoto=null;
  encoreId=null;
  delete game.dataset.encore;
  setState('walk');
  paintMission();
  hongdaeAction.focus({preventScroll:true});
  playAudio();
}

function paintBooth() {
  const active = state === 'booth';
  byId('booth-panel').hidden = !active || Boolean(booth?.taking);
  byId('booth-finder').hidden = !active || !booth?.taking;
  if (!active || !booth) return;
  const photo = booth.record?.photo;
  boothPhoto.alt = words('boothPhotoAlt');
  if (photo) {
    if (boothPhoto.getAttribute('src') !== photo) boothPhoto.src = photo;
  } else {
    boothPhoto.removeAttribute('src');
  }
  boothPhoto.hidden = !photo;
  boothSave.hidden = !photo || Boolean(booth.saved);
  boothSave.disabled = Boolean(booth.saved);
  const status = byId('booth-status');
  status.hidden = !booth.feedback;
  status.textContent = booth.feedback ? words(booth.feedback) : '';
  status.dataset.error = String(Boolean(booth.feedback) && !booth.saved);
}

function takeBoothPhoto() {
  if (!shopStick || (state !== 'booth' && (spot !== 'booth' || !canWalk())) || booth?.taking) return;
  resetControls();
  booth = {taking: true, record: null, feedback: '', saved: false};
  setState('booth');
  boothTimer = setTimeout(() => {
    try {
      const photo = world.captureBoothPhoto();
      if (!/^data:image\/(?:jpeg|webp);base64,/.test(photo)) throw new Error('Unsupported booth photo');
      booth.record = {...look, stick: shopStick, photo};
      audio.cue('spotlight');
    } catch (error) {
      booth.feedback = 'boothCaptureError';
      console.warn('Seoul Encore booth photo could not be captured.', error);
    }
    booth.taking = false;
    paintBooth();
    if (!phone.open) byId(booth.record ? 'booth-save' : 'booth-retake').focus({preventScroll: true});
  }, 520);
}

function saveBoothPhoto() {
  if (state !== 'booth' || !booth?.record || booth.saved) return;
  try {
    savePixelPhoto(booth.record);
    booth.saved = true;
    booth.feedback = 'boothSaved';
    audio.cue('delivery');
    byId('booth-album').focus({preventScroll: true});
  } catch (error) {
    booth.feedback = 'boothSaveError';
    console.warn('Seoul Encore booth photo could not be saved.', error);
  }
  paintBooth();
}

function closeBooth() {
  if (state !== 'booth') return;
  clearTimeout(boothTimer);
  booth = null;
  setState('walk');
  paintMission();
  (hongdaeAction.hidden ? phoneToggle : hongdaeAction).focus({preventScroll: true});
}

function showFailure(kind, error) {
  cancelAnimationFrame(frame);
  cancelAnimationFrame(festivalFrame);
  festival = null;
  clearTimeout(boothTimer);
  resetControls();
  closeStageAudio();
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
      onSpot(next) {
        if (spot === next) return;
        spot = next;
        hongdaeFeedback = '';
        paintMission();
      },
    });
    updateLook();
    if (replay) {
      if (replay.venue === 'arena') await world.prepareArena().catch(error => showFailure('arena', error));
      if (!world) return;
      startRound('replay', replay.venue ?? 'studio');
    } else {
      setState('walk');
      paintMission();
      const entry = new URL(location.href);
      if (entry.searchParams.get('start') === 'hongdae') {
        const destination = entry.searchParams.get('at') === 'booth' ? 'booth' : 'gate';
        entry.searchParams.delete('start');
        entry.searchParams.delete('at');
        history.replaceState(history.state, '', entry);
        await enterHongdae(destination);
      }
    }
  } catch (error) {
    showFailure('scene', error);
  }
}

document.addEventListener('pointerup', event => {
  if (!phone.open && state !== 'loading' && state !== 'error' && event.target instanceof Element && !event.target.closest('a, #sound')) playAudio();
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
  if (event.altKey || event.ctrlKey || event.metaKey || editing || phone.open) return;
  if (event.code === 'Escape') {
    if (!wardrobe.hidden) setWardrobe(false, true);
    else if (festival) leaveFestival();
    else if (state === 'booth') closeBooth();
    else if (state === 'result' || Object.hasOwn(timings, state)) backToWalk();
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
  } else if (canWalk() && event.code === 'KeyF' && !event.repeat) {
    if (!hongdaeAction.hidden) actInHongdae();
    else if (!resumeButton.hidden) void beginConcertWalk();
    else if (nearNari) enterPerformance();
  } else if (rhythmState(state) && !event.repeat) {
    const index = /^(?:Digit|Numpad)([1-3])$/.exec(event.code);
    if (index) {
      event.preventDefault();
      playAudio();
      answer(round.moves[Number(index[1]) - 1]);
    }
  }
});
document.addEventListener('keyup', event => {
  if (keysHeld.delete(event.code)) moveInput();
});
window.addEventListener('blur', resetControls);
window.addEventListener('pageshow', event => {
  if (!event.persisted) return;
  lang = preference('encore1.lang') === 'tr' ? 'tr' : 'ru';
  sound = preference('encore1.sound') !== 'off';
  audio.setEnabled(sound);
  setStageSound(sound);
  if (state === 'walk' && world) {
    const selected = readHongdaeStick();
    if (selected !== shopStick) {
      shopStick = selected;
      look.wandColor = shopStick ? stickColor(shopStick) : startingLook().wandColor;
      updateLook();
    }
  }
  paintLanguage();
});
window.addEventListener('hashchange', () => location.reload());
document.addEventListener('visibilitychange', () => {
  if (festival) {
    if (document.hidden) pauseFestival();
    else if (!phone.open) playAudio();
  }
  if (!document.hidden) return;
  resetControls();
  if (arenaRound()) closeStageAudio();
  if (round) round.lastTime = null;
});

byId('festival-tap').addEventListener('pointerdown', event => {
  if (event.isPrimary && event.button===0) tapFestival();
});
byId('festival-tap').addEventListener('click', event => {
  if (event.detail===0) tapFestival();
});
byId('encore-retry').addEventListener('click',awardEncorePrint);
byId('festival-again').addEventListener('click', startFestival);
byId('festival-leave').addEventListener('click', leaveFestival);
phoneToggle.addEventListener('click', openPhone);
byId('phone-close').addEventListener('click', closePhone);
phone.addEventListener('cancel', event => {
  event.preventDefault();
  closePhone();
});
phone.addEventListener('close', () => {
  phoneToggle.setAttribute('aria-expanded', 'false');
  if (wardrobe.hidden) phoneToggle.focus({preventScroll: true});
});
phone.addEventListener('click', event => {
  if (event.target !== phone) return;
  const {top, bottom, left, right} = phone.getBoundingClientRect();
  if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) closePhone();
});
lookToggle.addEventListener('click', () => {
  closePhone();
  setWardrobe(true);
});
byId('look-close').addEventListener('click', () => setWardrobe(false, true));
jacketButton.addEventListener('click', () => {
  look.jacket = !look.jacket;
  storePreference('encore.v2.jacket', look.jacket ? 'on' : 'off');
  updateLook();
  audio.cue('step');
});
wardrobe.addEventListener('click', event => {
  const finale = event.target.closest('[data-finale]');
  if (finale) {
    selectedFinale = finale.dataset.finale;
    storePreference('encore.v2.finale', selectedFinale);
    paintFinale();
    audio.cue('step');
    return;
  }
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
function enterPerformance() {
  if (!canWalk() || !nearNari) return;
  if (journey()) startRound('concert', 'arena');
  else startRound('demo');
  playAudio();
}

rehearsal.addEventListener('click', enterPerformance);
startConcert.addEventListener('click', enterPerformance);
hongdaeAction.addEventListener('click', actInHongdae);
byId('booth-close').addEventListener('click', closeBooth);
byId('booth-retake').addEventListener('click', takeBoothPhoto);
boothSave.addEventListener('click', saveBoothPhoto);
inviteButton.addEventListener('click', () => void beginConcertWalk());
resumeButton.addEventListener('click', () => void beginConcertWalk());
for (const button of moveButtons) button.addEventListener('click', () => {
  playAudio();
  answer(button.dataset.move);
});
byId('stop-duet').addEventListener('click', backToWalk);
byId('repeat-duet').addEventListener('click', () => {
  if (arenaPending) return;
  const venue = round.venue;
  startRound(replay ? 'replay' : venue === 'arena' ? 'concert' : 'demo', venue);
  playAudio();
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
  setStageSound(sound);
  if (!sound) stageAudioRequested = false;
  paintSound();
  playAudio();
});

audio.setEnabled(sound);
setStageSound(sound);
paintLanguage();
void load();
