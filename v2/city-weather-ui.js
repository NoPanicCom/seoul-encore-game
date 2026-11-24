const copy = {
  weather: {ru: 'Время и погода в Сеуле', tr: 'Seul’de saat ve hava'},
  climate: {ru: 'Погода в Сеуле', tr: 'Seul’de hava'},
  close: {ru: 'Закрыть панель погоды', tr: 'Hava panelini kapat'},
  aerial: {ru: 'Посмотреть на город сверху', tr: 'Şehre yukarıdan bak'},
  aerialShort: {ru: 'Сверху', tr: 'Üstten'},
  ground: {ru: 'Вернуться на улицу', tr: 'Sokak seviyesine dön'},
  groundShort: {ru: 'На улицу', tr: 'Sokağa dön'},
  aerialHint: {
    ru: 'Проведи вбок для поворота камеры. Проведи вверх, чтобы приблизить, или вниз, чтобы отдалить.',
    tr: 'Çevirmek için yana, yakınlaşmak için yukarı, uzaklaşmak için aşağı sürükle.',
  },
  wind: {ru: 'Ветер', tr: 'Rüzgâr'},
  windUnit: {ru: 'км/ч', tr: 'km/sa'},
  gameDay: {ru: 'Игровой день', tr: 'Oyun günü'},
  timeHint: {
    ru: 'В игре минута проходит за реальную секунду. После возврата к сеульскому времени часы снова идут быстрее.',
    tr: 'Oyunda bir dakika, gerçekte bir saniye sürer. Seul saatine dönünce oyun saati yine hızla ilerler.',
  },
  sunrise: {ru: 'Следующий рассвет', tr: 'Bir sonraki gün doğumu'},
  sunset: {ru: 'Посмотреть закат', tr: 'Gün batımını gör'},
  now: {ru: 'Вернуться к времени Сеула', tr: 'Seul saatine dön'},
  waiting: {ru: 'Ждём данные о погоде', tr: 'Hava bilgisi bekleniyor'},
};

const sources = {
  forecast: {
    ru: 'Почасовой прогноз для Сеула', tr: 'Seul için saatlik tahmin',
  },
  cached: {
    ru: 'Ранее сохранённый почасовой прогноз для Сеула', tr: 'Seul için daha önce kaydedilmiş saatlik tahmin',
  },
  simulation: {
    ru: 'На этот час нет прогноза. Погоду рассчитывает игра.',
    tr: 'Bu saat için tahmin bulunmuyor. Hava durumu oyunda modelleniyor.',
  },
};

const conditions = {
  clear: {ru: 'Ясно', tr: 'Açık', icon: '☀', nightIcon: '☾'},
  cloudy: {ru: 'Облачно', tr: 'Bulutlu', icon: '☁'},
  rain: {ru: 'Дождь', tr: 'Yağmurlu', icon: '☂'},
  fog: {ru: 'Туман', tr: 'Sisli', icon: '≋'},
  snow: {ru: 'Снег', tr: 'Karlı', icon: '❄'},
  storm: {ru: 'Гроза', tr: 'Fırtınalı', icon: 'ϟ'},
};

const times = [
  {id: 'sunrise', icon: '↑'}, {id: 'sunset', icon: '↓'}, {id: 'now', icon: '↶'},
];

function make(tag, id, className) {
  const element = document.createElement(tag);
  if (id) element.id = id;
  if (className) element.className = className;
  if (tag === 'button') element.type = 'button';
  return element;
}

function hiddenIcon(className, icon) {
  const symbol = make('span', '', className);
  symbol.setAttribute('aria-hidden', 'true');
  symbol.textContent = icon;
  return symbol;
}

function text(element, value) {
  if (element.textContent !== value) element.textContent = value;
}

function minutesAt(hour) {
  const minutes = Math.floor(hour * 60 + 1e-7);
  return (minutes % 1440 + 1440) % 1440;
}

function clockLabel(minutes) {
  const hour = Math.floor(minutes / 60).toString().padStart(2, '0');
  const minute = (minutes % 60).toString().padStart(2, '0');
  return hour + ':' + minute;
}

const formats = Object.fromEntries(['ru', 'tr'].map(locale => [
  locale, {
    weekday: new Intl.DateTimeFormat(locale, {weekday: 'short', timeZone: 'UTC'}),
    date: new Intl.DateTimeFormat(locale, {weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC'}),
  },
]));

export function createCityWeatherUI({lang, onView, onTime, onPanel}) {
  const hud = make('div', 'city-weather-hud', 'city-weather-hud');
  hud.hidden = true;
  const toolbar = make('div', '', 'city-weather-toolbar');
  const weather = make('button', 'city-weather-toggle', 'city-weather-summary');
  weather.setAttribute('aria-controls', 'city-climate-panel');
  weather.setAttribute('aria-expanded', 'false');
  const clockLine = make('span', '', 'city-weather-clock');
  const hourNode = make('time', 'city-weather-hour', '');
  const dayNode = make('span', 'city-weather-day', '');
  clockLine.append(hourNode, dayNode);
  const reading = make('span', '', 'city-weather-reading');
  const weatherIcon = hiddenIcon('city-weather-icon', '—');
  const temperature = make('span', 'city-weather-temperature', '');
  reading.append(weatherIcon, temperature);
  const condition = make('span', 'city-weather-condition', '');
  weather.append(clockLine, reading, condition);

  const view = make('button', 'city-aerial-toggle', 'city-weather-view');
  view.setAttribute('aria-pressed', 'false');
  const viewIcon = hiddenIcon('city-weather-view-icon', '⤢');
  const viewLabel = make('span', '', '');
  view.append(viewIcon, viewLabel);
  toolbar.append(weather, view);

  const panel = make('section', 'city-climate-panel', 'city-climate-panel');
  panel.setAttribute('aria-labelledby', 'city-climate-title');
  panel.hidden = true;
  const header = make('header', '', 'city-climate-heading');
  const title = make('h2', 'city-climate-title', '');
  const closeButton = make('button', 'city-climate-close', 'city-climate-close');
  closeButton.append(hiddenIcon('', '×'));
  header.append(title, closeButton);

  const date = make('p', 'city-weather-date', 'city-weather-date');
  const dayCount = make('p', 'city-weather-day-count', 'city-weather-day-count');
  const wind = make('p', 'city-weather-wind', 'city-weather-wind');
  const sourceLine = make('p', 'city-weather-source', 'city-weather-source');
  const provider = make('a', 'city-weather-provider', 'city-weather-provider');
  provider.href = 'https://open-meteo.com/';
  provider.target = '_blank';
  provider.rel = 'noopener noreferrer';
  provider.textContent = 'Open-Meteo ↗';
  const controls = make('div', '', 'city-time-controls');
  const timeButtons = times.map(({id, icon}) => {
    const button = make('button', '', 'city-time-action');
    button.dataset.cityTime = id;
    const label = make('span', '', '');
    button.append(hiddenIcon('city-time-icon', icon), label);
    button.addEventListener('click', () => onTime(id));
    controls.append(button);
    return {id, label};
  });
  const timeHint = make('p', '', 'city-weather-time-hint');
  panel.append(header, controls, date, dayCount, wind, sourceLine, provider, timeHint);

  const aerialInfo = make('aside', 'city-aerial-info', 'city-aerial-info');
  aerialInfo.hidden = true;
  const landmarkName = make('p', 'city-aerial-landmark', 'city-aerial-landmark');
  landmarkName.setAttribute('aria-live', 'polite');
  const landmarkDescription = make('p', 'city-aerial-description', 'city-aerial-description');
  const hint = make('p', 'city-aerial-hint', 'city-aerial-hint');
  aerialInfo.append(landmarkName, landmarkDescription, hint);

  hud.append(toolbar, panel, aerialInfo);
  document.getElementById('game').append(hud);

  let isVisible = false;
  let isAerial = false;
  let signature;
  let lastDate;
  let weekdayText = '';
  let dateText = '';

  function setPanel(open, restoreFocus = false) {
    if (panel.hidden === !open) return;
    panel.hidden = !open;
    weather.setAttribute('aria-expanded', String(open));
    onPanel?.(open);
    if (open) closeButton.focus({preventScroll: true});
    else if (restoreFocus && isVisible) weather.focus({preventScroll: true});
  }

  function close() {
    setPanel(false, true);
  }

  weather.addEventListener('click', () => setPanel(panel.hidden, true));
  closeButton.addEventListener('click', close);
  view.addEventListener('click', () => {
    setPanel(false);
    onView(!isAerial);
  });
  hud.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || panel.hidden) return;
    event.preventDefault();
    event.stopPropagation();
    close();
  });

  function stampDate(isoDate, locale) {
    const key = locale + '/' + isoDate;
    if (lastDate === key) return;
    lastDate = key;
    const parsed = new Date(isoDate + 'T00:00:00Z');
    const available = Number.isFinite(parsed.valueOf());
    weekdayText = available ? formats[locale].weekday.format(parsed) : '—';
    dateText = available ? formats[locale].date.format(parsed) : '';
  }

  function update({visible, aerial, sample, landmark}) {
    isVisible = Boolean(visible);
    isAerial = Boolean(aerial);
    hud.hidden = !isVisible;
    if (!isVisible) {
      setPanel(false);
      signature = undefined;
      return;
    }

    const locale = lang() === 'tr' ? 'tr' : 'ru';
    const words = key => copy[key][locale];
    const minutes = sample && Number.isFinite(sample.hour) ? minutesAt(sample.hour) : null;
    const night = Number(sample?.night) >= .5;
    const heat = Number.isFinite(sample?.temperature) ? Math.round(sample.temperature) : null;
    const windSpeed = Number.isFinite(sample?.windKph) ? Math.round(sample.windKph) : null;
    const placeName = isAerial ? landmark?.name?.[locale] ?? '' : '';
    const placeDescription = placeName ? landmark.description?.[locale] ?? '' : '';
    const next = [
      locale, isAerial, minutes, sample?.day, sample?.date, sample?.weather,
      heat, windSpeed, sample?.source, night, placeName, placeDescription,
    ].join('|');
    if (next === signature) return;
    signature = next;

    hud.lang = locale;
    hud.dataset.aerial = String(isAerial);
    hud.dataset.source = sample?.source ?? '';
    hud.dataset.weather = sample?.weather ?? '';
    hud.dataset.day = sample?.day ?? '';

    stampDate(sample?.date ?? '', locale);
    const hour = minutes === null ? '–:–' : clockLabel(minutes);
    const kind = sample && Object.hasOwn(conditions, sample.weather) ? conditions[sample.weather] : null;
    const sky = kind?.[locale] ?? '—';
    const temperatureText = heat === null ? '—' : heat + ' °C';
    text(hourNode, hour);
    if (minutes !== null) hourNode.dateTime = hour;
    else hourNode.removeAttribute('datetime');
    text(dayNode, weekdayText);
    text(condition, sky);
    text(weatherIcon, night && kind?.nightIcon ? kind.nightIcon : kind?.icon ?? '—');
    text(temperature, temperatureText);
    weather.setAttribute('aria-label', [words('weather'), hour, dateText, sky, temperatureText].filter(Boolean).join(' · '));

    const viewText = words(isAerial ? 'ground' : 'aerial');
    view.setAttribute('aria-label', viewText);
    view.setAttribute('title', viewText);
    view.setAttribute('aria-pressed', String(isAerial));
    text(viewLabel, words(isAerial ? 'groundShort' : 'aerialShort'));
    text(viewIcon, isAerial ? '↩' : '⤢');

    text(title, words('climate'));
    closeButton.setAttribute('aria-label', words('close'));
    text(date, dateText);
    date.hidden = !dateText;
    dayCount.hidden = !Number.isInteger(sample?.day);
    if (!dayCount.hidden) text(dayCount, words('gameDay') + ' ' + sample.day);
    wind.hidden = windSpeed === null;
    if (!wind.hidden) text(wind, words('wind') + ' · ' + windSpeed + ' ' + words('windUnit'));
    const source = sample && Object.hasOwn(sources, sample.source) ? sources[sample.source] : null;
    text(sourceLine, source?.[locale] ?? words('waiting'));
    provider.hidden = sample?.source !== 'forecast' && sample?.source !== 'cached';
    text(timeHint, words('timeHint'));
    for (const {id, label} of timeButtons) text(label, words(id));

    aerialInfo.hidden = !isAerial;
    landmarkName.hidden = !placeName;
    landmarkDescription.hidden = !placeDescription;
    text(landmarkName, placeName);
    text(landmarkDescription, placeDescription);
    text(hint, words('aerialHint'));
  }

  return {update, close, isOpen: () => !panel.hidden};
}
