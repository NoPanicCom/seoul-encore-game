import {CITY_BOUNDS, CITY_BUILDINGS, CITY_ROADS, CITY_TYPES} from './city-grid.js';

const pair = (ru, tr) => ({ru, tr});
const activity = (mechanic, icon, title, instruction, reward, data) =>
  ({mechanic, icon, title, instruction, reward, ...data});
const names = (...entries) => entries.map(([ru, tr]) => pair(ru, tr));
const clues = (...entries) => entries.map(([ru, tr, questionRu, questionTr]) =>
  ({name: pair(ru, tr), question: pair(questionRu, questionTr)}));

const activities = {
  cafe: activity('sequence', '☕', pair('Заказы бариста', 'Barista siparişleri'),
    pair('Поставь напитки на поднос в порядке из чека.', 'İçecekleri fişteki sırayla tepsiye koy.'),
    pair('Штамп бариста', 'Barista damgası'),
    {items: names(['Эспрессо', 'Espresso'], ['Латте', 'Latte'], ['Мокко', 'Mocha'], ['Матча', 'Matcha'], ['Какао', 'Kakao'])}),
  restaurant: activity('match', '♨', pair('Горячая подача', 'Sıcak servis'),
    pair('Найди блюдо по просьбе гостя.', 'Konuğun isteğine uygun yemeği bul.'),
    pair('Похвала от шефа', 'Şefin teşekkürü'),
    {items: clues(
      ['Кимбап', 'Kimbap', 'Рисовый ролл, который удобно взять с собой.', 'Yanımda götürebileceğim bir pirinç rulosu.'],
      ['Рамён', 'Ramyun', 'Горячий бульон с длинной лапшой.', 'Uzun erişteli sıcak bir çorba.'],
      ['Бибимбап', 'Bibimbap', 'Миска риса и овощей, которые можно перемешать.', 'Karıştırabileceğim pirinç ve sebze kasesi.'],
      ['Манду', 'Mandu', 'Пельмени с начинкой.', 'İçi dolgulu mantılar.'],
      ['Ттокпокки', 'Tteokbokki', 'Рисовые палочки в остром соусе.', 'Acı soslu pirinç çubukları.'])}),
  bakery: activity('timing', '◉', pair('Свежая выпечка', 'Sıcacık fırın'),
    pair('Вынимай выпечку, когда индикатор войдёт в светлую зону.', 'Gösterge aydınlık alana girince tepsiyi fırından çıkar.'),
    pair('Три золотистые булочки', 'Üç altın renkli çörek'),
    {press: pair('Достать из печи', 'Fırından çıkar'), items: names(['Круассан', 'Kruvasan'], ['Булочка', 'Çörek'], ['Печенье', 'Kurabiye'], ['Тарт', 'Tart'], ['Бриошь', 'Briyoş'])}),
  convenience: activity('match', '▣', pair('Покупки в дорогу', 'Yol alışverişi'),
    pair('Выбери с полки то, что нужно для каждой остановки.', 'Her durak için gerekli ürünü raftan seç.'),
    pair('Рюкзак готов', 'Çanta hazır'),
    {items: clues(
      ['Вода', 'Su', 'После прогулки хочется пить.', 'Yürüyüşten sonra susadım.'],
      ['Зонт', 'Şemsiye', 'На улице начинается дождь.', 'Dışarıda yağmur başlıyor.'],
      ['Батарейки', 'Pil', 'Фонарик разрядился.', 'El fenerinin enerjisi bitti.'],
      ['Блокнот', 'Not defteri', 'Нужно записать адрес.', 'Adresi bir yere yazmalıyım.'],
      ['Рисовый шарик', 'Pirinç topu', 'Перед метро хочется перекусить.', 'Metrodan önce bir atıştırmalık lazım.'])}),
  fashion: activity('sequence', '✦', pair('Выход на подиум', 'Podyum sırası'),
    pair('Разложи аксессуары в порядке выхода моделей.', 'Aksesuarları modellerin çıkış sırasına göre hazırla.'),
    pair('Бейдж стилиста', 'Stilist rozeti'),
    {items: names(['Лента', 'Kurdele'], ['Берет', 'Bere'], ['Сумка', 'Çanta'], ['Перчатки', 'Eldiven'], ['Очки', 'Gözlük'])}),
  cosmetics: activity('match', '◈', pair('Палитра визажиста', 'Makyaj paleti'),
    pair('Подбери оттенок для каждого образа.', 'Her görünüm için doğru tonu seç.'),
    pair('Оттенки подобраны', 'Renkler hazır'),
    {items: clues(
      ['Розовый', 'Pembe', 'Светлый оттенок лепестков розы.', 'Açık renkli gül yaprağı tonu.'],
      ['Сиреневый', 'Lila', 'Нежный оттенок сирени.', 'Leylağın açık mor tonu.'],
      ['Коралловый', 'Mercan', 'Тёплый розово-оранжевый оттенок.', 'Sıcak pembe-turuncu bir ton.'],
      ['Серебро', 'Gümüş', 'Холодный металлический блеск.', 'Soğuk metalik bir ışıltı.'],
      ['Шампань', 'Şampanya', 'Светлый золотисто-бежевый блеск.', 'Açık, altın-bej bir ışıltı.'])}),
  florist: activity('sequence', '❋', pair('Букет на заказ', 'Sipariş buketi'),
    pair('Собери цветы по порядку из записки флориста.', 'Çiçekleri notta yazan sırayla bukete yerleştir.'),
    pair('Лента флориста', 'Çiçekçi kurdelesi'),
    {items: names(['Пион', 'Şakayık'], ['Тюльпан', 'Lale'], ['Роза', 'Gül'], ['Ромашка', 'Papatya'], ['Ирис', 'İris'])}),
  bookstore: activity('sequence', '▤', pair('Книги под заказ', 'Kitap siparişi'),
    pair('Положи книги на стойку в порядке из списка читателя.', 'Kitapları okurun listesindeki sırayla tezgâha koy.'),
    pair('Коллекционная закладка', 'Koleksiyon ayracı'),
    {items: names(['Сказки', 'Masallar'], ['Стихи', 'Şiir'], ['Комиксы', 'Çizgi roman'], ['Атлас', 'Atlas'], ['Роман', 'Roman'])}),
  records: activity('memory', '◎', pair('Порядок пластинок', 'Plak sırası'),
    pair('Запомни порядок наклеек и подай пластинки диджею.', 'Etiket sırasını hatırla ve plakları DJ’e ver.'),
    pair('Пластинка для коллекции', 'Koleksiyon plağı'),
    {items: names(['Звезда', 'Yıldız'], ['Луна', 'Ay'], ['Волна', 'Dalga'], ['Сердце', 'Kalp'], ['Молния', 'Şimşek'])}),
  karaoke: activity('timing', '♪', pair('Вступление в песню', 'Şarkıya giriş'),
    pair('Нажимай «Петь» в светлой зоне, чтобы вступить в такт.', 'Ritme girmek için gösterge aydınlık alandayken şarkıya gir.'),
    pair('Вокальная звезда', 'Vokal yıldızı'),
    {press: pair('Петь', 'Şarkıya gir'), items: names(['Куплет', 'Kıta'], ['Припев', 'Nakarat'], ['Бридж', 'Köprü'], ['Подпевка', 'Geri vokal'], ['Финал', 'Final'])}),
  arcade: activity('memory', '◇', pair('Сигналы автомата', 'Oyun makinesinin sinyalleri'),
    pair('Запомни сигналы и повтори их на кнопках автомата.', 'Sinyalleri hatırla ve makinenin tuşlarında tekrarla.'),
    pair('Аркадный жетон', 'Atari fişi'),
    {items: names(['▲ Треугольник', '▲ Üçgen'], ['● Круг', '● Daire'], ['■ Квадрат', '■ Kare'], ['◆ Ромб', '◆ Baklava'], ['★ Звезда', '★ Yıldız'])}),
  photobooth: activity('timing', '▣', pair('Серия снимков', 'Fotoğraf serisi'),
    pair('Снимай, когда индикатор позы попадёт в светлую рамку.', 'Poz göstergesi aydınlık çerçeveye girince fotoğrafı çek.'),
    pair('Фотополоска на память', 'Hatıra fotoğraf şeridi'),
    {press: pair('Снять кадр', 'Fotoğraf çek'), items: names(['Улыбка', 'Gülümse'], ['Сердце', 'Kalp'], ['Поворот', 'Dönüş'], ['Привет', 'Selam'], ['Подмигивание', 'Göz kırp'])}),
  cinema: activity('match', '▷', pair('Билеты в кино', 'Sinema biletleri'),
    pair('Назначь подходящее место каждому зрителю.', 'Her seyirciye istediği yeri ayır.'),
    pair('Кинобилет на память', 'Hatıra sinema bileti'),
    {items: clues(
      ['У прохода', 'Koridor yanı', 'Хочу быстро выйти, никого не потревожив.', 'Kimseyi rahatsız etmeden kolayca çıkmak istiyorum.'],
      ['В центре', 'Orta sıra', 'Хочу сидеть ровно напротив середины экрана.', 'Perdenin tam karşısında oturmak istiyorum.'],
      ['Первый ряд', 'Ön sıra', 'Хочу оказаться ближе всех к экрану.', 'Perdeye en yakın yerde oturmak istiyorum.'],
      ['Задний ряд', 'Arka sıra', 'Хочу сидеть подальше от экрана.', 'Perdeden en uzakta oturmak istiyorum.'],
      ['Парное место', 'Yan yana iki koltuk', 'Мы пришли вдвоём и хотим сидеть рядом.', 'İki kişiyiz ve yan yana oturmak istiyoruz.'])}),
  gallery: activity('memory', '◫', pair('Развеска выставки', 'Sergi düzeni'),
    pair('Запомни план выставки и развесь работы в этом порядке.', 'Sergi planını aklında tut, eserleri aynı sırayla as.'),
    pair('Знак куратора', 'Küratör rozeti'),
    {items: names(['Портрет', 'Portre'], ['Город', 'Şehir'], ['Цветы', 'Çiçekler'], ['Море', 'Deniz'], ['Небо', 'Gökyüzü'])}),
  'dance-studio': activity('sequence', '↗', pair('Танцевальная связка', 'Dans sekansı'),
    pair('Повтори связку движений по записи хореографа.', 'Koreografın notundaki hareketleri sırayla yap.'),
    pair('Штамп хореографа', 'Koreograf damgası'),
    {items: names(['Шаг', 'Adım'], ['Прыжок', 'Sıçra'], ['Поворот', 'Dön'], ['Хлопок', 'Alkış'], ['Поза', 'Poz'])}),
  'music-studio': activity('mix', '♫', pair('Студийный микс', 'Stüdyo miksi'),
    pair('Выставь уровни трёх дорожек по листу звукорежиссёра.', 'Üç kanalın seviyesini ses teknisyeninin notuna göre ayarla.'),
    pair('Мастер-запись готова', 'Ana kayıt hazır'),
    {items: names(['Вокал', 'Vokal'], ['Бас', 'Bas'], ['Ударные', 'Davul'])}),
  electronics: activity('mix', '⌁', pair('Настройка приёмника', 'Alıcı ayarı'),
    pair('Настрой три полосы сигнала по карточке проверки.', 'Üç sinyal bandını test kartına göre ayarla.'),
    pair('Точный сигнал', 'Sinyal ayarlandı'),
    {items: names(['Низкий', 'Düşük bant'], ['Средний', 'Orta bant'], ['Высокий', 'Yüksek bant'])}),
  'gift-shop': activity('sequence', '◇', pair('Ленты для подарков', 'Hediye kurdeleleri'),
    pair('Подбери ленты для коробок в порядке из заказа.', 'Kutuların kurdelelerini sipariş sırasına göre seç.'),
    pair('Подарок с твоей подписью', 'İmzalı hediye'),
    {items: names(['Розовая', 'Pembe'], ['Синяя', 'Mavi'], ['Золотая', 'Altın'], ['Зелёная', 'Yeşil'], ['Белая', 'Beyaz'])}),
  salon: activity('mix', '✂', pair('Образ для клиента', 'Müşterinin görünümü'),
    pair('Настрой длину, объём и блеск по карточке образа.', 'Uzunluğu, hacmi ve parlaklığı görünüm kartına göre ayarla.'),
    pair('Образ из салона', 'Salon görünümü'),
    {items: names(['Длина', 'Uzunluk'], ['Объём', 'Hacim'], ['Блеск', 'Parlaklık'])}),
  hotel: activity('match', '⌂', pair('Ключи от номера', 'Oda anahtarları'),
    pair('На стойке регистрации выдай каждому гостю нужный ключ.', 'Resepsiyonda her konuğa uygun oda anahtarını ver.'),
    pair('Штамп консьержа', 'Resepsiyon damgası'),
    {items: clues(
      ['Одноместный', 'Tek kişilik', 'Путешествую одна, одной кровати хватит.', 'Tek başıma seyahat ediyorum, bir yatak yeter.'],
      ['Две кровати', 'İki tek yatak', 'Нас двое, нам нужны отдельные кровати.', 'İki kişiyiz ve ayrı yatak istiyoruz.'],
      ['Семейный', 'Aile odası', 'Приехали с детьми, нужно больше места.', 'Çocuklarla geldik, daha geniş bir oda lazım.'],
      ['С видом', 'Manzaralı oda', 'Хочу смотреть на город из окна.', 'Pencereden şehri izlemek istiyorum.'],
      ['У лифта', 'Asansör yanı', 'У меня тяжёлый чемодан, не хочу далеко идти.', 'Valizim ağır, koridorda çok yürümek istemiyorum.'])}),
};

const ui = {
  close: pair('Закрыть', 'Kapat'),
  passport: pair('Штампы в паспорте', 'Pasaport damgaları'),
  cue: pair('Порядок', 'Sıra'),
  memory: pair('Запомни порядок', 'Sırayı hatırla'),
  showCue: pair('Показать ещё раз', 'Yeniden göster'),
  step: pair('Шаг', 'Adım'),
  wrong: pair('Попробуй другой вариант.', 'Başka bir seçenek dene.'),
  correct: pair('Верно!', 'Doğru!'),
  waiting: pair('Дождись светлой зоны.', 'Aydınlık alanı bekle.'),
  ready: pair('Сейчас!', 'Şimdi!'),
  retrySave: pair('Сохранить штамп', 'Damgayı kaydet'),
  saveError: pair('Не удалось сохранить штамп. Можно повторить.', 'Damga kaydedilemedi. Yeniden deneyebilirsin.'),
  stamped: pair('Штамп добавлен', 'Damga eklendi'),
  stampExists: pair('Этот штамп уже в паспорте', 'Bu damga pasaportunda var'),
  targetValue: pair('Цель', 'Hedef'),
  check: pair('Проверить', 'Kontrol et'),
  map: pair('Карта города', 'Şehir haritası'),
  search: pair('Найти здание', 'Bina ara'),
  types: pair('Тип здания', 'Bina türü'),
  allTypes: pair('Все типы', 'Tüm türler'),
  near: pair('Здания рядом', 'Yakındaki binalar'),
  results: pair('Найденные здания', 'Bulunan binalar'),
  noResults: pair('Здания не найдены.', 'Bina bulunamadı.'),
  player: pair('Ты здесь', 'Buradasın'),
  target: pair('Цель маршрута', 'Rota hedefi'),
  clear: pair('Убрать цель', 'Hedefi kaldır'),
  recenter: pair('Моё положение', 'Konumum'),
  zoomIn: pair('Приблизить', 'Yakınlaştır'),
  zoomOut: pair('Отдалить', 'Uzaklaştır'),
  north: pair('С', 'K'),
  atTarget: pair('Ты рядом', 'Hemen yanındasın'),
};

const directions = names(
  ['на север', 'kuzey'], ['на северо-восток', 'kuzeydoğu'], ['на восток', 'doğu'], ['на юго-восток', 'güneydoğu'],
  ['на юг', 'güney'], ['на юго-запад', 'güneybatı'], ['на запад', 'batı'], ['на северо-запад', 'kuzeybatı'],
);
const stampKey = 'encore.v2.city-passport';
const palette = ['#b074a0', '#a27acd', '#725cad', '#746fc6', '#578aba', '#61a6b0', '#77ab89', '#bd9580'];

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function button(id, className, text) {
  const node = element('button', className, text);
  node.type = 'button';
  if (id) node.id = id;
  return node;
}

function permutation(size, order, length = size) {
  const pool = Array.from({length: size}, (_, index) => index);
  return Array.from({length}, () => {
    const index = order % pool.length;
    order = Math.floor(order / pool.length);
    return pool.splice(index, 1)[0];
  });
}

function publicDistance(a, b) {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

function readPassport(known) {
  const raw = localStorage.getItem(stampKey);
  const entries = raw ? JSON.parse(raw) : [];
  if (!Array.isArray(entries)) throw new Error('Invalid city passport');
  const saved = new Set(entries.filter(id => known.has(id)));
  for (const id of known.keys()) {
    if (localStorage.getItem(stampKey + '.' + id) === '1') saved.add(id);
  }
  return saved;
}

function cleanPosition(position, bounds) {
  if (position && Number.isFinite(position.x) && Number.isFinite(position.z)) return position;
  return {x: (bounds.minX + bounds.maxX) / 2, z: (bounds.minZ + bounds.maxZ) / 2};
}

function mapAxis(value, low, high, span) {
  const padding = span / 2;
  return span >= high - low ? (low + high) / 2 : Math.max(low + padding, Math.min(high - padding, value));
}

function typeLabel(building, locale) {
  return CITY_TYPES.find(type => type.id === building.type)[locale];
}

export function createCityActivities({
  lang, onOpen, onClose, onTarget,
  buildings = CITY_BUILDINGS, plan = {bounds: CITY_BOUNDS, roads: CITY_ROADS},
}) {
  const {bounds, roads} = plan;
  const known = new Map(buildings.map(building => [building.id, building]));
  const locale = () => lang() === 'tr' ? 'tr' : 'ru';
  const say = entry => entry[locale()];
  const words = key => say(ui[key]);
  let passport;
  try {
    passport = readPassport(known);
  } catch (error) {
    passport = new Set();
    console.warn('Seoul Encore city passport could not be read.', error);
  }

  const dialog = element('dialog', 'city-dialog');
  dialog.id = 'city-panel';
  dialog.setAttribute('aria-labelledby', 'city-title');
  const heading = element('header', 'city-heading');
  const caption = element('p', 'city-caption');
  const title = element('h2', 'city-title');
  title.id = 'city-title';
  const count = element('p', 'city-passport');
  count.id = 'city-passport-count';
  const headingText = element('div');
  headingText.append(caption, title, count);
  const closeButton = button('city-close', 'city-close', '×');
  closeButton.autofocus = true;
  heading.append(headingText, closeButton);
  const content = element('div', 'city-content');
  dialog.append(heading, content);
  document.getElementById('game').append(dialog);

  let mode = null;
  let round = null;
  let frame = 0;
  let revealTimer = 0;
  let position = cleanPosition(null, bounds);
  let selected = null;
  let zoom = 1;
  let panCenter = null;
  let mapView = null;
  let mapObserver;

  function stopAnimation() {
    cancelAnimationFrame(frame);
    clearTimeout(revealTimer);
    frame = revealTimer = 0;
  }

  function paintHeading() {
    dialog.lang = locale();
    closeButton.setAttribute('aria-label', words('close'));
    count.textContent = `${words('passport')} · ${passport.size}/${known.size}`;
    count.dataset.count = String(passport.size);
    count.dataset.total = String(known.size);
    if (mode === 'activity') {
      caption.textContent = round.building.name;
      title.textContent = say(round.theme.title);
    } else {
      caption.textContent = '';
      title.textContent = words('map');
    }
  }

  function open(next) {
    mode = next;
    dialog.dataset.mode = next;
    if (!dialog.open) {
      onOpen?.(next);
      dialog.showModal();
      closeButton.focus({preventScroll: true});
    }
  }

  function close() {
    if (!dialog.open) return;
    dialog.close();
    finishClose();
  }

  function finishClose() {
    if (!mode) return;
    stopAnimation();
    mapObserver?.disconnect();
    mapObserver = undefined;
    mapView = null;
    const previous = mode;
    mode = null;
    round = null;
    onClose?.(previous);
  }

  closeButton.addEventListener('click', close);
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    close();
  });
  dialog.addEventListener('close', () => {
    if (!dialog.open) finishClose();
  });

  function renderActivity() {
    stopAnimation();
    paintHeading();
    dialog.dataset.cityState = round.finished ? 'result' : 'activity';
    if (round.finished) {
      const result = element('section', 'city-result');
      result.id = 'city-result';
      result.dataset.buildingId = round.building.id;
      result.dataset.saved = String(round.saved);
      const badge = element('span', 'city-badge', round.theme.icon);
      badge.setAttribute('aria-hidden', 'true');
      const reward = element('h3', 'city-reward', say(round.theme.reward));
      const description = element('p', 'city-message', words(round.feedback));
      description.setAttribute('role', 'status');
      result.append(badge, reward, description);
      if (!round.saved) result.append(button('city-retry-save', 'city-primary', words('retrySave')));
      content.replaceChildren(result);
      return;
    }

    const previousControl = document.activeElement?.dataset.cityChoice;
    const {theme, pattern, step} = round;
    const task = element('section', 'city-challenge');
    task.id = 'city-challenge';
    task.dataset.mechanic = theme.mechanic;
    task.dataset.step = String(step);
    task.dataset.buildingId = round.building.id;
    const guide = element('p', 'city-instruction', say(theme.instruction));
    const feedback = element('p', 'city-message', round.feedback ? words(round.feedback) : '');
    feedback.id = 'city-feedback';
    feedback.setAttribute('role', 'status');
    const current = pattern[step];
    task.append(guide);

    if (theme.mechanic === 'mix') {
      renderSliders(task);
    } else {
      const progress = element('p', 'city-progress', `${words('step')} ${step + 1}/${pattern.length}`);
      const cue = element('div', 'city-cue');
      cue.id = 'city-cue';
      task.append(progress, cue);
      if (theme.mechanic === 'timing') {
        cue.textContent = say(theme.items[current]);
        renderTiming(task);
      } else {
        if (theme.mechanic === 'match') {
          cue.textContent = say(theme.items[current].question);
        } else if (theme.mechanic === 'sequence' || round.reveal) {
          const list = element('ol', 'city-cue-list');
          list.setAttribute('aria-label', words('cue'));
          for (const [i, token] of pattern.entries()) {
            const item = element('li', i === step ? 'city-current' : '', say(theme.items[token]));
            item.dataset.cityToken = String(token);
            if (i === step) item.setAttribute('aria-current', 'step');
            list.append(item);
          }
          cue.append(list);
        } else {
          cue.textContent = words('memory');
        }
        renderChoices(task);
        if (theme.mechanic === 'memory') {
          task.append(button('city-show-cue', 'city-secondary', words('showCue')));
          if (round.reveal) {
            revealTimer = setTimeout(() => {
              round.reveal = false;
              renderActivity();
            }, 1800);
          }
        }
      }
    }
    task.append(feedback);
    content.replaceChildren(task);
    if (previousControl !== undefined) task.querySelector(`button[data-city-choice="${previousControl}"]`)?.focus({preventScroll: true});
  }

  function renderChoices(task) {
    const {theme, deck} = round;
    const choices = element('div', 'city-choices');
    for (const token of deck) {
      const choice = button('', 'city-choice', say(theme.items[token].name ?? theme.items[token]));
      choice.dataset.cityChoice = String(token);
      choice.disabled = Boolean(round.reveal);
      choices.append(choice);
    }
    task.append(choices);
  }

  function renderSliders(task) {
    const sliders = element('div', 'city-sliders');
    for (const [i, name] of round.theme.items.entries()) {
      const label = element('label', 'city-slider');
      const header = element('span', 'city-slider-label');
      header.append(element('strong', '', say(name)), element('small', '', `${words('targetValue')} ${round.targets[i]}`));
      const range = element('input', '');
      range.type = 'range';
      range.min = '0';
      range.max = '4';
      range.step = '1';
      range.value = String(round.values[i]);
      range.dataset.cityRange = String(i);
      range.setAttribute('aria-label', `${say(name)} · ${words('targetValue')} ${round.targets[i]}`);
      const value = element('output', 'city-slider-value', range.value);
      range.addEventListener('input', () => {
        round.values[i] = Number(range.value);
        value.textContent = range.value;
      });
      label.append(header, range, value);
      sliders.append(label);
    }
    task.append(sliders, button('city-check', 'city-primary', words('check')));
  }

  function renderTiming(task) {
    const meter = element('div', 'city-meter');
    const target = element('div', 'city-timing-zone');
    const marker = element('div', 'city-timing-marker');
    const press = button('city-timing', 'city-primary', say(round.theme.press));
    const signal = element('p', 'city-signal', words('waiting'));
    signal.setAttribute('aria-hidden', 'true');
    meter.setAttribute('aria-hidden', 'true');
    meter.append(target, marker);
    task.append(meter, signal, press);
    const center = .25 + (round.building.variant * 3 + round.pattern[round.step] * 5) % 11 / 20;
    const radius = .12;
    const period = 1610 + 47 * (round.building.variant % 5) + 63 * round.step;
    target.style.left = `${100 * (center - radius)}%`;
    target.style.width = `${200 * radius}%`;
    let start;
    let previous = false;
    task.dataset.cityWindow = 'wait';
    function animate(time) {
      start ??= time;
      const progress = (time - start) % period / period;
      marker.style.left = `${progress * 100}%`;
      const timely = Math.abs(progress - center) <= radius;
      if (timely !== previous) {
        task.dataset.cityWindow = timely ? 'open' : 'wait';
        signal.textContent = words(timely ? 'ready' : 'waiting');
        previous = timely;
      }
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
  }

  function saveStamp() {
    const id = round.building.id;
    try {
      const updated = readPassport(known);
      for (const value of passport) updated.add(value);
      updated.add(id);
      localStorage.setItem(stampKey + '.' + id, '1');
      passport = updated;
      round.saved = true;
      round.feedback = 'stamped';
    } catch (error) {
      round.feedback = 'saveError';
      console.warn('Seoul Encore city stamp could not be saved.', error);
    }
    renderActivity();
    if (round.saved) closeButton.focus({preventScroll: true});
    else content.querySelector('#city-retry-save')?.focus({preventScroll: true});
  }

  function progress(correct) {
    if (round.finished || round.reveal) return;
    if (correct) round.step += 1;
    if (round.step >= round.pattern.length) {
      round.finished = true;
      saveStamp();
    } else {
      round.feedback = correct ? 'correct' : 'wrong';
      if (round.theme.mechanic === 'timing' && !correct) {
        content.querySelector('#city-feedback').textContent = words('waiting');
      } else if (round.theme.mechanic === 'mix' && !correct) {
        content.querySelector('#city-feedback').textContent = words('wrong');
      } else {
        renderActivity();
        if (round.theme.mechanic === 'timing') content.querySelector('#city-timing').focus({preventScroll: true});
      }
    }
  }

  content.addEventListener('click', event => {
    if (mode !== 'activity' || !(event.target instanceof Element)) return;
    const chosen = event.target.closest('button');
    if (!chosen) return;
    if (chosen.dataset.cityChoice !== undefined) {
      progress(Number(chosen.dataset.cityChoice) === round.pattern[round.step]);
    } else if (chosen.id === 'city-timing') {
      progress(content.querySelector('#city-challenge').dataset.cityWindow === 'open');
    } else if (chosen.id === 'city-check') {
      const ready = round.targets.every((target, index) => round.values[index] === target);
      if (ready) round.step = round.pattern.length - 1;
      progress(ready);
    } else if (chosen.id === 'city-show-cue') {
      round.reveal = true;
      renderActivity();
      content.querySelector('#city-show-cue')?.focus({preventScroll: true});
    } else if (chosen.id === 'city-retry-save') {
      saveStamp();
    }
  });

  function play(building) {
    const place = known.get(building?.id);
    const theme = place && activities[place.type];
    if (!theme) throw new RangeError('Unknown city activity building');
    const variant = place.variant;
    const order = variant * 7 + place.typeIndex;
    const pattern = permutation(theme.items.length, order, 3);
    const finished = passport.has(place.id);
    const targetCode = variant * 11 + place.typeIndex * 3;
    const targets = Array.from({length: 3}, (_, i) => Math.floor(targetCode / 5 ** i) % 5);
    round = {
      building: place, theme, pattern, deck: permutation(theme.items.length, variant * 17 + place.typeIndex * 3),
      step: 0, finished, saved: finished, feedback: finished ? 'stampExists' : '',
      reveal: theme.mechanic === 'memory', targets, values: [2, 2, 2],
    };
    open('activity');
    renderActivity();
  }

  function follow(building) {
    selected = building;
    if (building && zoom > 1) panCenter = building;
    onTarget?.(building);
    paintMap();
  }

  function makeMap() {
    const controls = element('div', 'city-map-controls');
    const search = element('input', 'city-search');
    search.id = 'city-map-search';
    search.type = 'search';
    search.autocomplete = 'off';
    const types = element('select', 'city-types');
    types.id = 'city-map-type';
    const recompute = () => paintMap();
    search.addEventListener('input', recompute);
    types.addEventListener('change', recompute);
    controls.append(search, types);

    const mapBlock = element('div', 'city-map-frame');
    const canvas = element('canvas', 'city-map-canvas');
    canvas.id = 'city-map';
    canvas.setAttribute('role', 'img');
    const legend = element('div', 'city-map-legend');
    const north = element('span', 'city-map-north');
    north.setAttribute('aria-hidden', 'true');
    const player = element('span', 'city-map-you');
    legend.append(north, player);
    const zoomTools = element('div', 'city-zoom-tools');
    const out = button('city-zoom-out', 'city-map-button', '−');
    const back = button('city-map-recenter', 'city-map-button', '⊙');
    const closer = button('city-zoom-in', 'city-map-button', '+');
    out.addEventListener('click', () => changeZoom(-.5));
    closer.addEventListener('click', () => changeZoom(.5));
    back.addEventListener('click', () => {
      panCenter = position;
      drawMap();
    });
    zoomTools.append(out, back, closer);
    mapBlock.append(canvas, zoomTools);

    const destination = element('div', 'city-destination');
    destination.id = 'city-map-target';
    destination.setAttribute('role', 'region');
    const targetLine = element('p', '');
    targetLine.setAttribute('aria-live', 'polite');
    const remove = button('city-clear-target', 'city-map-button', '×');
    remove.addEventListener('click', () => follow(null));
    destination.append(targetLine, remove);
    const listHeading = element('h3', 'city-map-list-title');
    const list = element('ul', 'city-map-list');
    list.id = 'city-map-list';

    content.replaceChildren(controls, legend, mapBlock, destination, listHeading, list);
    mapView = {search, types, canvas, player, north, destination, targetLine, remove, listHeading, list, out, closer, back, matches: [], project: null};
    canvas.addEventListener('click', event => {
      const point = mapView.project?.(event);
      if (!point) return;
      const location = mapView.matches.find(place => Math.abs(place.x - point.x) <= place.width / 2 + 1 &&
        Math.abs(place.z - point.z) <= place.depth / 2 + 1);
      if (location) follow(location);
    });
    list.addEventListener('click', event => {
      const item = event.target instanceof Element && event.target.closest('button[data-building-id]');
      if (!item) return;
      follow(known.get(item.dataset.buildingId));
      list.querySelector(`button[data-building-id="${item.dataset.buildingId}"]`)?.focus({preventScroll: true});
    });
    mapObserver?.disconnect();
    mapObserver = new ResizeObserver(drawMap);
    mapObserver.observe(canvas);
  }

  function changeZoom(amount) {
    zoom = Math.max(1, Math.min(3, zoom + amount));
    panCenter ??= selected ?? position;
    drawMap();
  }

  function paintMap() {
    if (!mapView) return;
    paintHeading();
    const {search, types, canvas, north, player, destination, targetLine, remove, listHeading, list, out, closer, back} = mapView;
    search.placeholder = words('search');
    search.setAttribute('aria-label', words('search'));
    types.setAttribute('aria-label', words('types'));
    const chosenType = types.value;
    if (types.dataset.lang !== locale()) {
      const choices = [{id: '', ...ui.allTypes}, ...CITY_TYPES].map(type => {
        const option = element('option', '', type[locale()]);
        option.value = type.id;
        return option;
      });
      types.replaceChildren(...choices);
      types.value = chosenType;
      types.dataset.lang = locale();
    }
    canvas.setAttribute('aria-label', words('map'));
    north.textContent = words('north');
    player.textContent = words('player');
    out.setAttribute('aria-label', words('zoomOut'));
    closer.setAttribute('aria-label', words('zoomIn'));
    back.setAttribute('aria-label', words('recenter'));
    remove.setAttribute('aria-label', words('clear'));
    destination.setAttribute('aria-label', words('target'));
    destination.hidden = !selected;
    if (selected) {
      const point = selected.door ?? selected;
      const distance = Math.round(publicDistance(position, point));
      const angle = Math.atan2(point.x - position.x, position.z - point.z);
      const bearing = directions[(Math.round(angle / (Math.PI / 4)) + 8) % 8];
      const route = distance ? `${distance} m · ${say(bearing)}` : words('atTarget');
      targetLine.textContent = `${selected.name} · ${route}`;
      destination.dataset.buildingId = selected.id;
      destination.dataset.distance = String(distance);
    }

    const query = search.value.trim().toLowerCase();
    const filter = types.value;
    const matches = buildings.filter(place => {
      const matchesType = !filter || place.type === filter;
      return matchesType && (!query ||
        place.name.toLowerCase().includes(query) ||
        typeLabel(place, locale()).toLowerCase().includes(query) ||
        place.id.includes(query));
    });
    mapView.matches = matches;
    const filtered = Boolean(query || filter);
    listHeading.textContent = words(filtered ? 'results' : 'near');
    const nearby = matches.slice().sort((a, b) => publicDistance(position, a) - publicDistance(position, b));
    list.replaceChildren();
    if (!nearby.length) list.append(element('li', 'city-map-empty', words('noResults')));
    for (const place of filtered ? nearby : nearby.slice(0, 14)) {
      const row = element('li', '');
      const item = button('', 'city-building');
      item.dataset.buildingId = place.id;
      item.dataset.stamped = String(passport.has(place.id));
      item.setAttribute('aria-pressed', String(selected?.id === place.id));
      const label = element('span', 'city-building-name');
      label.append(element('strong', '', place.name), element('small', '', typeLabel(place, locale())));
      const distance = element('span', 'city-building-distance', `${Math.round(publicDistance(position, place.door ?? place))} m`);
      item.append(label, distance);
      row.append(item);
      list.append(row);
    }
    drawMap();
  }

  function drawMap() {
    if (!mapView || mode !== 'map') return;
    const {canvas, matches, out, closer} = mapView;
    const {width, height} = canvas.getBoundingClientRect();
    if (!width || !height) return;
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    const pixelsWide = Math.round(width * ratio);
    const pixelsHigh = Math.round(height * ratio);
    if (canvas.width !== pixelsWide || canvas.height !== pixelsHigh) {
      canvas.width = pixelsWide;
      canvas.height = pixelsHigh;
    }
    const context = canvas.getContext('2d');
    const scale = zoom * Math.min((width - 20) / (bounds.maxX - bounds.minX), (height - 20) / (bounds.maxZ - bounds.minZ));
    const middle = {x: (bounds.maxX + bounds.minX) / 2, z: (bounds.maxZ + bounds.minZ) / 2};
    const preferred = zoom <= 1 ? middle : panCenter ?? position;
    const center = {
      x: mapAxis(preferred.x, bounds.minX, bounds.maxX, (width - 14) / scale),
      z: mapAxis(preferred.z, bounds.minZ, bounds.maxZ, (height - 14) / scale),
    };
    const x = value => width / 2 + (value - center.x) * scale;
    const z = value => height / 2 + (value - center.z) * scale;
    mapView.project = event => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: center.x + (event.clientX - rect.left - width / 2) / scale,
        z: center.z + (event.clientY - rect.top - height / 2) / scale,
      };
    };
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.fillStyle = '#151126';
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#2b2340';
    context.fillRect(x(bounds.minX), z(bounds.minZ), (bounds.maxX - bounds.minX) * scale, (bounds.maxZ - bounds.minZ) * scale);
    for (const road of roads.vertical) {
      context.fillStyle = road.main ? '#514668' : '#423857';
      context.fillRect(x(road.center - road.width / 2), z(bounds.minZ), road.width * scale, (bounds.maxZ - bounds.minZ) * scale);
    }
    for (const road of roads.horizontal) {
      context.fillStyle = road.main ? '#514668' : '#423857';
      context.fillRect(x(bounds.minX), z(road.center - road.width / 2), (bounds.maxX - bounds.minX) * scale, road.width * scale);
    }

    const visible = new Set(matches.map(place => place.id));
    for (const place of buildings) {
      const active = visible.has(place.id);
      const color = palette[place.typeIndex % palette.length];
      context.fillStyle = active ? passport.has(place.id) ? '#f9c7ad' : color : '#49405c';
      const w = (place.width - .65) * scale;
      const h = (place.depth - .73) * scale;
      context.fillRect(x(place.x) - w / 2, z(place.z) - h / 2, w, h);
    }
    if (selected) {
      const door = selected.door ?? selected;
      context.setLineDash([3, 5]);
      context.strokeStyle = '#ffb6d7';
      context.lineWidth = 1.6;
      context.beginPath();
      context.moveTo(x(position.x), z(position.z));
      context.lineTo(x(door.x), z(door.z));
      context.stroke();
      context.setLineDash([]);
      context.lineWidth = 2;
      context.strokeRect(x(selected.x - selected.width / 2), z(selected.z - selected.depth / 2),
        selected.width * scale, selected.depth * scale);
    }

    const playerX = x(position.x);
    const playerZ = z(position.z);
    canvas.dataset.playerX = String(position.x);
    canvas.dataset.playerZ = String(position.z);
    context.beginPath();
    context.arc(playerX, playerZ, 6.5, 0, Math.PI * 2);
    context.fillStyle = '#a7edff';
    context.fill();
    context.strokeStyle = '#171124';
    context.lineWidth = 2;
    context.stroke();
    if (Number.isFinite(position.yaw)) {
      context.beginPath();
      context.moveTo(playerX, playerZ);
      context.lineTo(playerX + Math.sin(position.yaw) * 12, playerZ + Math.cos(position.yaw) * 12);
      context.strokeStyle = '#a7edff';
      context.stroke();
    }
    out.disabled = zoom <= 1;
    closer.disabled = zoom >= 3;
  }

  function map(currentPosition) {
    position = cleanPosition(currentPosition, bounds);
    if (!dialog.open || mode !== 'map') {
      stopAnimation();
      zoom = 1;
      panCenter = null;
      makeMap();
      open('map');
    }
    dialog.dataset.cityState = 'map';
    paintMap();
  }

  return {
    play,
    map,
    close,
    isOpen: () => dialog.open,
    count: () => passport.size,
    refresh() {
      if (!dialog.open) return;
      if (mode === 'map') paintMap();
      else renderActivity();
    },
  };
}
