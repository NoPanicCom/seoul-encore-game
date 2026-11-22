const line = (tr, ru) => ({ tr, ru });
const people = {
    jun: {
        name: line('Jun', 'Джун'), job: line('Prodüktör', 'Продюсер'),
        hello: line('Bis için iki giriş yazdım. Hangisiyle salon ilk vuruşu hisseder?', 'Я написал два вступления для выхода на бис. Как зал почувствует первый такт?')
    },
    nari: {
        name: line('Nari', 'Нари'), job: line('Dans stajyeri', 'Стажёрка танцевальной команды'),
        hello: line('Birlikte üç adım çalışalım. Son pozda döneceğim, ilk üç işareti bana sen ver.', 'Давай отрепетируем три шага. На последней позе я повернусь, а ты подай первые три сигнала.')
    },
    hena: {
        name: line('Hena', 'Хэна'), job: line('Vokal stajyeri', 'Вокалистка-стажёрка'),
        hello: line('Seçmeden önce kısa bir giriş yapacağım. Piyanoda ilk nota duyulunca birlikte girelim mi?', 'Перед прослушиванием я сделаю короткое вступление. Войдём вместе после первой ноты пианино?')
    },
    mei: {
        name: line('Mei', 'Мэй'), job: line('Kostüm ustası', 'Мастер по костюмам'),
        hello: line('Eteğin kuyruğunu merdivende toplamak gerek. Astarın içinde iki ilmek var. Çabuk açılacak bir klips takalım.', 'На лестнице подол нужно подобрать. В подкладке есть две петли. Поставим застёжку, которую можно быстро открыть.')
    },
    sumi: {
        name: line('Sumi', 'Суми'), job: line('Kafe sahibi', 'Хозяйка кафе'),
        hello: line('Dans ekibi burada buluşacak. Nari için küçük bir doğum günü pastası yaptım. Sürpriz için hangisini masada bırakalım?', 'Танцевальная команда встретится здесь. Я испекла торт для Нари. Что оставим на столе, чтобы сохранить сюрприз?')
    },
    minho: {
        name: line('Minho', 'Минхо'), job: line('Festival standı görevlisi', 'Продавец на фестивале'),
        hello: line('Işık çubuğunu prova ederken yanıma uğra. İstersen bendeki fazla festival kartını da takas edelim.', 'Хочешь опробовать лайтстик? У меня ещё есть лишняя фестивальная карточка для обмена.')
    },
    dana: {
        name: line('Dana', 'Дана'), job: line('Turne çevirmeni', 'Переводчица тура'),
        hello: line('Kalabalığa bir cümle seç. Söyleyişini kartıma yazayım, sahneden de kullanırsın.', 'Выбери фразу для зрителей. Запишу произношение на карточке, чтобы ты могла сказать её со сцены.')
    },
    pixel: {
        name: line('Pixel', 'Пиксель'), job: line('YG avlusunun kedisi', 'Котик из двора YG'),
        hello: line('Pixel mama kabının yanından kalkıp gümüş bir ekipman çantasına sürtünüyor.', 'Пиксель встаёт от миски и трётся о серебристый кофр для аппаратуры.')
    }
};
const awards = {
    jun: { label: line('Bis girişi', 'Вступление на бис'), icon: '♫', tone: 'lilac' },
    nari: { label: line('İlk dans provası', 'Первая танцевальная репетиция'), icon: '↔', tone: 'pink' },
    invite: { label: line('Nari’nin daveti', 'Приглашение Нари'), icon: '✉', tone: 'pink' },
    hena: { label: line('Birlikte ilk nota', 'Первая нота вместе'), icon: '♪', tone: 'lilac' },
    mei: { label: line('Kostüm klipsi', 'Застёжка для костюма'), icon: '✦', tone: 'mint' },
    sumi: { label: line('Doğum günü sürprizi', 'Сюрприз ко дню рождения'), icon: '✿', tone: 'peach' },
    minho: { label: line('Festival fotoğraf kartı', 'Фестивальная фотокарточка'), icon: '♥', tone: 'pink' },
    light: { label: line('Işık çubuğu provası', 'Репетиция с лайтстиком'), icon: '✧', tone: 'mint' },
    dana: { label: line('Sahne selamı', 'Приветствие со сцены'), icon: '☼', tone: 'mint' },
    pixel: { label: line('Pixel’in kayıp eşya ipucu', 'Находка Пикселя'), icon: '✣', tone: 'peach' },
    pixelphoto: { label: line('Pixel’in fotoğrafı', 'Фото Пикселя'), icon: '▧', tone: 'peach' },
    breakfast: { label: line('Turne kahvaltısı', 'Завтрак с командой'), icon: '☕', tone: 'peach' },
    'booth-peace': { label: line('Fotokabin · Zafer pozu', 'Фотобудка · Знак победы'), icon: '✌', tone: 'lilac' },
    'booth-heart': { label: line('Fotokabin · Kalp pozu', 'Фотобудка · Сердечко'), icon: '♡', tone: 'pink' },
    debut: { label: line('YG ilk sahne kartı', 'Карточка дебюта YG'), icon: '✷', tone: 'lilac' },
    busan: { label: line('Busan ses kontrolü', 'Саундчек в Пусане'), icon: '≈', tone: 'mint' },
    tour: { label: line('Turne açılış kartı', 'Карточка открытия тура'), icon: '★', tone: 'lilac' }
};
const awardIds = Object.keys(awards).filter((key) => Object.prototype.hasOwnProperty.call(awards, key));
const awardPortrait = {
    jun: 'jun', nari: 'nari', invite: 'nari', hena: 'hena', mei: 'mei', sumi: 'sumi',
    minho: 'minho', light: 'minho', dana: 'dana', pixel: 'pixel', pixelphoto: 'pixel',
    breakfast: 'dana', debut: 'hena'
};
const clock = {
    morning: {
        time: '09:00', label: line('Sabah', 'Утро'),
        plan: {
            seoul: line('Otel kahvaltısı, Han kıyısı ve YG lobisi', 'Завтрак в отеле, набережная Хан и вестибюль YG'),
            busan: line('Sahil yolunda Dana ile buluş', 'Встреча с Даной на набережной'),
            tour: line('Yol ekibiyle açılışa hazırlan', 'Подготовка к открытию с командой тура')
        }
    },
    afternoon: {
        time: '14:00', label: line('Öğleden sonra', 'День'),
        plan: {
            seoul: line('YG seçmesi, ilk sahne ve kafe', 'Прослушивание YG, дебют и кафе'),
            busan: line('Dana ve deniz sahnesi', 'Дана и сцена у моря'),
            tour: line('Açılış işaretini kontrol et', 'Проверь сигнал открытия')
        }
    },
    evening: {
        time: '19:00', label: line('Akşam', 'Вечер'),
        plan: {
            seoul: line('Festival, fotokabin ve ışık çubuğu provası', 'Фестиваль, фотобудка и репетиция с лайтстиками'),
            busan: line('Deniz sahnesinde ses kontrolü', 'Саундчек на сцене у моря'),
            tour: line('Turne açılışı', 'Открытие тура')
        }
    }
};
const slots = ['morning', 'afternoon', 'evening'];
const cityNames = {
    seoul: { label: line('Seul', 'Сеул'), sign: '서울', subtitle: line('Han Nehri · YG · Hongdae', 'Река Хан · YG · Хондэ') },
    busan: { label: line('Busan', 'Пусан'), sign: '부산', subtitle: line('Kıyı yolu · Deniz sahnesi', 'Набережная · Сцена у моря') },
    tour: { label: line('Turne', 'Тур'), sign: '투어', subtitle: line('Yol ekibi · Açılış sahnesi', 'Команда тура · Сцена открытия') }
};
const days = {
    [-2]: line('Konsere iki gün', 'За два дня до концерта'),
    [-1]: line('Prova günü', 'День репетиции'),
    0: line('Konser günü', 'День концерта'),
    1: line('Konserin ertesi', 'На следующий день')
};
const allHours = slots;
const dayHours = ['morning', 'afternoon'];
const lateHours = ['afternoon', 'evening'];
const venues = {
    hotel: { label: line('Turne oteli', 'Отель тура'), icon: '▤', tone: 'lilac', hours: allHours },
    river: { label: line('Han kıyısı', 'Набережная Хан'), icon: '≈', tone: 'mint', hours: dayHours, person: 'nari' },
    cafe: { label: line('Sumi’nin kafesi', 'Кафе Суми'), icon: '✿', tone: 'peach', hours: allHours, person: 'sumi' },
    festival: { label: line('Hongdae festivali', 'Фестиваль в Хондэ'), icon: '✧', tone: 'pink', hours: lateHours, person: 'minho' },
    photobooth: { label: line('Hongdae fotokabini', 'Фотобудка в Хондэ'), icon: '▧', tone: 'pink', hours: lateHours },
    lobby: { label: line('YG lobisi', 'Вестибюль YG'), icon: '⌂', tone: 'mint', hours: dayHours, person: 'dana' },
    studio: { label: line('YG kayıt odası', 'Студия записи YG'), icon: '♫', tone: 'lilac', hours: dayHours, person: 'jun', access: 'studio' },
    audition: { label: line('YG seçme odası', 'Зал прослушиваний YG'), icon: '♪', tone: 'lilac', hours: ['afternoon'], person: 'hena', access: 'audition' },
    wardrobe: { label: line('YG kostüm odası', 'Костюмерная YG'), icon: '✦', tone: 'peach', hours: dayHours, person: 'mei', access: 'wardrobe' },
    showcase: { label: line('YG küçük sahne', 'Малая сцена YG'), icon: '✴', tone: 'pink', hours: lateHours, person: 'nari', access: 'showcase' },
    debut: { label: line('YG ilk sahne', 'Дебют на сцене YG'), icon: '✷', tone: 'lilac', hours: lateHours },
    courtyard: { label: line('YG avlusu', 'Двор YG'), icon: '✣', tone: 'mint', hours: allHours, person: 'pixel' },
    station: { label: line('Tren garı', 'Вокзал'), icon: '↗', tone: 'peach', hours: allHours },
    boardwalk: { label: line('Busan kıyı yolu', 'Набережная Пусана'), icon: '≈', tone: 'mint', hours: allHours, person: 'dana' },
    busanstage: { label: line('Deniz sahnesi', 'Сцена у моря'), icon: '♫', tone: 'lilac', hours: allHours },
    tourstage: { label: line('Açılış sahnesi', 'Сцена открытия'), icon: '★', tone: 'pink', hours: allHours }
};
const stops = {
    seoul: ['hotel', 'river', 'cafe', 'festival', 'photobooth', 'lobby', 'studio', 'audition', 'wardrobe', 'showcase', 'debut', 'courtyard', 'station'],
    busan: ['boardwalk', 'busanstage', 'station'],
    tour: ['tourstage', 'station']
};
const mapPins = [
    { id: 'river', x: 26, y: 39 },
    { id: 'lobby', x: 78, y: 27 },
    { id: 'cafe', x: 23, y: 73 },
    { id: 'courtyard', x: 77, y: 74 }
];
const bagItems = {
    pass: { label: line('Turne kartı', 'Пропуск тура'), icon: '▤' },
    shoes: { label: line('Prova ayakkabısı', 'Обувь для репетиции'), icon: '↟' },
    pillow: { label: line('Seyahat yastığı', 'Дорожная подушка'), icon: '☁' },
    cable: { label: line('Telefon kablosu', 'Кабель для телефона'), icon: '⌁' }
};
const bagIds = ['pass', 'shoes', 'pillow', 'cable'];
const danceOrder = ['left', 'right', 'left'];
function newState() {
    return {
        city: 'seoul',
        day: -2,
        slot: 'morning',
        tab: 'map',
        location: 'hotel',
        visited: new Set(),
        inside: false,
        chat: null,
        contacts: new Set(['dana', 'hena']),
        collected: new Set(),
        bag: new Set(),
        intro: null,
        introPreview: null,
        rhythm: 0,
        danceDay: null,
        guestPass: false,
        henaInvite: false,
        nariInvite: false,
        practicedBefore: false,
        lightstick: false,
        tradeCard: true,
        greeting: null,
        busanGreeting: false,
        debutReady: false,
        storageUnavailable: false,
        notice: null
    };
}
let state = newState();
const memoryKey = 'encore1.city-album';
const sessionAwards = new Set();
function rememberedAwards() {
    let saved = [];
    try {
        if (typeof localStorage !== 'undefined')
            saved = localStorage.getItem(memoryKey)?.split(',') ?? [];
    }
    catch {
        state.storageUnavailable = true;
    }
    return awardIds.filter(id => saved.includes(id) || sessionAwards.has(id));
}
function collect(id, reply) {
    state.collected.add(id);
    sessionAwards.add(id);
    try {
        if (typeof localStorage !== 'undefined')
            localStorage.setItem(memoryKey, rememberedAwards().join(','));
    }
    catch {
        state.storageUnavailable = true;
    }
    state.notice = reply;
}
export function cityReset() {
    state = newState();
    restoreRelationships();
}
export function cityDay(day) {
    if (day !== -2 && day !== -1 && day !== 0 && day !== 1)
        return;
    state.day = day;
    state.slot = 'morning';
    state.tab = 'map';
    state.city = 'seoul';
    state.location = 'hotel';
    state.inside = false;
    state.chat = null;
    state.notice = null;
    state.rhythm = 0;
}
export function cityProgress() {
    return {
        city: state.city, day: state.day, tasks: state.collected.size, intro: state.intro, preview: state.introPreview,
        rhythm: state.danceDay !== null, audition: state.collected.has('hena'), costume: state.collected.has('mei'),
        lightstick: state.lightstick, greeting: state.greeting, clue: state.collected.has('pixel'), invite: state.nariInvite
    };
}
const checkpointKey = 'encore1.city-checkpoint';
const checkpointDays = [-2, -1, 0, 1];
const checkpointCities = ['seoul', 'busan', 'tour'];
export function saveCityCheckpoint() {
    const flags = [state.inside, state.guestPass, state.henaInvite, state.nariInvite, state.lightstick,
        state.tradeCard, state.busanGreeting, state.debutReady].map(flag => flag ? '1' : '0').join('');
    const checkpoint = new URLSearchParams({
        version: '1', city: state.city, day: String(state.day), slot: state.slot, tab: state.tab,
        location: state.location, visited: Array.from(state.visited).join(','), chat: state.chat ?? '',
        contacts: Array.from(state.contacts).join(','), collected: Array.from(state.collected).join(','),
        bag: Array.from(state.bag).join(','), intro: state.intro ?? '', preview: state.introPreview ?? '',
        rhythm: String(state.rhythm), danceDay: state.danceDay === null ? '' : String(state.danceDay),
        greeting: state.greeting ?? '', flags
    });
    try {
        if (typeof localStorage === 'undefined')
            return false;
        localStorage.setItem(checkpointKey, checkpoint.toString());
        return true;
    }
    catch {
        state.storageUnavailable = true;
        return false;
    }
}
function readChoice(input, options) {
    return options.find(option => String(option) === input);
}
function readSet(input, options) {
    if (input === null)
        return null;
    const values = new Set();
    for (const token of input === '' ? [] : input.split(',')) {
        const member = readChoice(token, options);
        if (!member || values.has(member))
            return null;
        values.add(member);
    }
    return values;
}
function parseCheckpoint(encoded) {
    if (encoded.length > 4096)
        return null;
    const data = new URLSearchParams(encoded);
    if (data.get('version') !== '1')
        return null;
    let hasDuplicateFields = false;
    data.forEach((_, key) => { if (data.getAll(key).length > 1)
        hasDuplicateFields = true; });
    if (hasDuplicateFields)
        return null;
    const city = readChoice(data.get('city'), checkpointCities);
    const day = readChoice(data.get('day'), checkpointDays);
    const slot = readChoice(data.get('slot'), slots);
    const tab = readChoice(data.get('tab'), tabIds);
    const flags = data.get('flags');
    if (!city || day === undefined || !slot || !tab || !flags || !/^[01]{8}$/.test(flags))
        return null;
    const location = readChoice(data.get('location'), stops[city]);
    const visited = readSet(data.get('visited'), Object.values(stops).flat());
    const contacts = readSet(data.get('contacts'), npcIds);
    const collected = readSet(data.get('collected'), awardIds);
    const bag = readSet(data.get('bag'), bagIds);
    const chat = readChoice(data.get('chat'), npcIds);
    const introOptions = ['drums', 'whisper'];
    const intro = readChoice(data.get('intro'), introOptions);
    const introPreview = readChoice(data.get('preview'), introOptions);
    const danceDay = readChoice(data.get('danceDay'), checkpointDays);
    const greeting = readChoice(data.get('greeting'), ['hello', 'thanks']);
    const rhythm = readChoice(data.get('rhythm'), [0, 1, 2, 3]);
    const inside = flags[0] === '1';
    if (!location || !visited || !contacts || !collected || !bag || bag.size > 2 || rhythm === undefined)
        return null;
    if (!chat && data.get('chat') !== '' || !intro && data.get('intro') !== '' ||
        !introPreview && data.get('preview') !== '' || danceDay === undefined && data.get('danceDay') !== '' ||
        !greeting && data.get('greeting') !== '')
        return null;
    if (inside && tab !== 'map' || chat && (tab !== 'messages' || !contacts.has(chat)) || city !== 'seoul' && day !== 1)
        return null;
    const guestPass = flags[1] === '1' || state.guestPass;
    const henaInvite = flags[2] === '1' || state.henaInvite;
    const nariInvite = flags[3] === '1' || state.nariInvite;
    for (const person of state.contacts)
        contacts.add(person);
    return {
        city, day, slot, tab, location, visited, inside, chat: chat ?? null, contacts, collected, bag,
        intro: intro ?? null, introPreview: introPreview ?? null, rhythm, danceDay: danceDay ?? null,
        guestPass, henaInvite, nariInvite, practicedBefore: state.practicedBefore,
        lightstick: flags[4] === '1', tradeCard: flags[5] === '1', greeting: greeting ?? null,
        busanGreeting: flags[6] === '1', debutReady: flags[7] === '1', storageUnavailable: state.storageUnavailable,
        notice: null
    };
}
export function restoreCityCheckpoint() {
    try {
        if (typeof localStorage === 'undefined')
            return false;
        const encoded = localStorage.getItem(checkpointKey);
        const checkpoint = encoded ? parseCheckpoint(encoded) : null;
        if (!checkpoint)
            return false;
        state = checkpoint;
        return true;
    }
    catch {
        state.storageUnavailable = true;
        return false;
    }
}
const roomTicket = line('Dana’dan ziyaretçi kartı al.', 'Попроси у Даны гостевой пропуск.');
const accessRoles = {
    studio: new Set(['lisa', 'sound', 'manager', 'director', 'light', 'jisoo', 'jennie', 'rose']),
    audition: new Set(['lisa', 'manager', 'jisoo', 'jennie', 'rose']),
    wardrobe: new Set(['ari', 'mina', 'soyeon', 'yuna', 'manager'])
};
function canInviteNari() {
    return state.danceDay !== null ? state.day > state.danceDay : state.practicedBefore;
}
function closedReason(venue, role) {
    if (!venue.hours.includes(state.slot)) {
        const open = venue.hours.map(slot => clock[slot].time).join(' / ');
        return line(`Açık saatler ${open}`, `Часы работы ${open}`);
    }
    switch (venue.access) {
        case 'studio':
        case 'wardrobe':
            return state.guestPass || accessRoles[venue.access].has(role) ? null : roomTicket;
        case 'audition':
            return state.henaInvite || accessRoles.audition.has(role) ? null : line('Telefonda Hena’dan davet iste.', 'Попроси приглашение у Хэны в телефоне.');
        case 'showcase':
            return state.nariInvite ? null : line('Nari ertesi gün bir davet yollar.', 'Нари пришлёт приглашение на следующий день.');
        default:
            return null;
    }
}
function button(action, text, className = 'city-option', attributes = '') {
    return `<button type="button" class="${className}" data-act="city-${action}" ${attributes}>${text}</button>`;
}
function badges(id, lang) {
    const badge = awards[id];
    return `<span class="city-chip city-tone-${badge.tone}"><span aria-hidden="true">${badge.icon}</span> ${badge.label[lang]}</span>`;
}
function portrait(person, lang) {
    return `<img src="art/crew/${person}.webp" alt="${people[person].name[lang]}" width="310" height="${person === 'jun' || person === 'nari' || person === 'hena' || person === 'mei' ? 386 : 304}">`;
}
function selected(action, label, lang, active) {
    return button(action, label[lang], 'city-option', `aria-pressed="${active}"`);
}
function options(lang, items) {
    return `<div class="city-options">${items.map(([action, label]) => button(action, label[lang])).join('')}</div>`;
}
function banner(lang) {
    const city = cityNames[state.city];
    return `<div class="city-banner city-banner-${state.city}">
    <div class="city-skyline" aria-hidden="true">${'<i></i>'.repeat(9)}</div>
    <div class="city-sign" lang="ko" aria-hidden="true">${city.sign}</div>
    <div class="city-banner-copy"><p>${city.subtitle[lang]}</p><h2>${city.label[lang]}</h2></div>
    <div class="city-time"><time>${clock[state.slot].time}</time><span>${days[state.day][lang]}</span></div>
  </div>`;
}
const tabs = {
    map: { label: line('Harita', 'Карта'), icon: '◇' },
    plan: { label: line('Program', 'План'), icon: '◷' },
    messages: { label: line('Mesajlar', 'Чаты'), icon: '✉' },
    bag: { label: line('Çanta', 'Сумка'), icon: '▤' }
};
const tabIds = ['map', 'plan', 'messages', 'bag'];
function phone(lang) {
    return `<nav class="city-phone" aria-label="${line('Oyun telefonu', 'Игровой телефон')[lang]}">
    ${tabIds.map(id => {
        const tab = tabs[id];
        return button(`tab-${id}`, `<span aria-hidden="true">${tab.icon}</span>${tab.label[lang]}`, 'city-tab', `aria-pressed="${state.tab === id}"`);
    }).join('')}
    </nav>`;
}
function map(lang, role) {
    const venueCards = stops[state.city].map(id => {
        const venue = venues[id];
        const reason = closedReason(venue, role);
        const subtitle = reason?.[lang] ?? (venue.person ? people[venue.person].name[lang] : '');
        return button(`visit-${id}`, `<span class="city-venue-icon" aria-hidden="true">${venue.icon}</span><span class="city-venue-copy"><strong>${venue.label[lang]}</strong>${subtitle ? `<small>${subtitle}</small>` : ''}</span><span aria-hidden="true">${reason ? '·' : state.visited.has(id) ? '✓' : '↗'}</span>`, `city-venue city-tone-${venue.tone}${reason ? ' city-locked' : ''}`);
    });
    return `<div class="city-section-head"><h3>${cityNames[state.city].label[lang]} · ${tabs.map.label[lang]}</h3>
    <small>${line('Durak seç', 'Выбери место')[lang]}</small></div>
    ${state.city === 'seoul' ? illustratedMap(lang, role) : ''}
    <div class="city-map">${venueCards.join('')}</div>`;
}
function illustratedMap(lang, role) {
    return `<nav class="city-illustrated-map" aria-label="${line('Seul haritasındaki duraklar', 'Места на карте Сеула')[lang]}">
    <img src="art/seoul-map.webp" alt="" width="960" height="640" decoding="async">
    ${mapPins.map(({ id, x, y }) => {
        const venue = venues[id];
        const reason = closedReason(venue, role);
        const label = reason ? `${venue.label[lang]}. ${reason[lang]}` : venue.label[lang];
        return button(`pin-${id}`, `<span aria-hidden="true">${venue.icon}</span>${venue.label[lang]}`, `city-map-pin city-tone-${venue.tone}${reason ? ' city-map-pin-closed' : ''}`, `style="--city-pin-x:${x}%;--city-pin-y:${y}%" aria-label="${label}"`);
    }).join('')}
  </nav>`;
}
function plan(lang) {
    return `<div class="city-section-head"><h3>${tabs.plan.label[lang]}</h3></div>
    <p class="city-instruction">${line('Saati bu ekrandan ilerlet. Açık duraklar haritada değişir.', 'Переводи часы здесь. На карте будут меняться открытые места.')[lang]}</p>
    <div class="city-agenda">${slots.map((slot, index) => {
        const block = clock[slot];
        const active = slot === state.slot;
        const canAdvance = index > slots.indexOf(state.slot);
        const detail = `<time>${block.time}</time><span><strong>${block.label[lang]}</strong><small>${block.plan[state.city][lang]}</small></span>`;
        return canAdvance ? button(`time-${slot}`, detail, 'city-agenda-row') :
            `<div class="city-agenda-row" ${active ? 'aria-current="time"' : ''}>${detail}</div>`;
    }).join('')}</div>`;
}
function messageThread(person, lang) {
    const p = people[person];
    let message = p.hello;
    const replies = [];
    if (person === 'dana') {
        message = state.guestPass
            ? line('Ziyaretçi kartın hazır. YG kayıt ve kostüm odalarının kapısında gösterebilirsin.', 'Гостевой пропуск готов. Покажи его у студии записи или костюмерной YG.')
            : line('YG kayıt ve kostüm odaları için ziyaretçi kartı çıkartabilirim.', 'Я могу выдать гостевой пропуск для студии записи и костюмерной YG.');
        if (!state.guestPass)
            replies.push(['guest-pass', line('Ziyaretçi kartı iste', 'Попросить гостевой пропуск')]);
    }
    if (person === 'hena') {
        message = state.henaInvite
            ? line('Seçme odası 14:00’te açık. Piyanoda buluşalım.', 'Зал прослушиваний открыт в 14:00. Встретимся у пианино.')
            : line('14:00’te YG’de seçmem var. Eşlik etmek ister misin?', 'В 14:00 у меня прослушивание в YG. Хочешь помочь?');
        if (!state.henaInvite)
            replies.push(['hena-invite', line('Davetini kabul et', 'Принять приглашение')]);
    }
    if (person === 'nari' && (state.danceDay !== null || state.practicedBefore)) {
        message = state.nariInvite
            ? line('Davetin hazır. Küçük sahne 14:00 ve 19:00’da açık.', 'Приглашение у тебя. Малая сцена открыта в 14:00 и 19:00.')
            : canInviteNari()
                ? line('Bugün küçük sahnede ilk gösterim var. Dünkü işaretleri hatırlıyor musun? Gelir misin?', 'Сегодня моё первое выступление на малой сцене. Помнишь наши шаги? Придёшь?')
                : line('Bugün ritmi bulduk! Bir sonraki gün sana küçük sahneden haber vereceğim.', 'Сегодня мы поймали ритм! Завтра напишу тебе о малой сцене.');
        if (canInviteNari() && !state.nariInvite)
            replies.push(['nari-invite', line('Gösteriye geliyorum', 'Я приду на выступление')]);
    }
    return `<div class="city-chat">
    ${button('tab-messages', line('← Mesajlar', '← Чаты')[lang], 'city-back')}
    <div class="city-speaker">${portrait(person, lang)}<div><h3>${p.name[lang]}</h3><p>${p.job[lang]}</p></div></div>
    <p class="city-bubble">${message[lang]}</p>
    ${replies.length ? options(lang, replies) : ''}
    </div>`;
}
function messages(lang) {
    if (state.chat)
        return messageThread(state.chat, lang);
    return `<div class="city-section-head"><h3>${tabs.messages.label[lang]}</h3></div>
    <div class="city-inbox">${Array.from(state.contacts, id => {
        const person = people[id];
        const newMessage = id === 'nari' && canInviteNari() && !state.nariInvite ? line('Yeni davet', 'Новое приглашение')[lang] : '';
        return button(`chat-${id}`, `${portrait(id, lang)}<span><strong>${person.name[lang]}</strong><small>${newMessage || person.job[lang]}</small></span><span aria-hidden="true">→</span>`, 'city-contact');
    }).join('')}</div>`;
}
function bag(lang) {
    return `<div class="city-section-head"><h3>${tabs.bag.label[lang]}</h3><small>${state.bag.size} / 2</small></div>
    <p class="city-instruction">${line('Otel çantana turne kartını ve prova ayakkabısını koy. Gardaki ekip ikisini de kontrol edecek.', 'Положи в сумку пропуск тура и обувь для репетиции. На вокзале команда проверит оба предмета.')[lang]}</p>
    <div class="city-bag">${bagIds.map(id => {
        const item = bagItems[id];
        return selected(`pack-${id}`, line(`<span aria-hidden="true">${item.icon}</span> ${item.label.tr}`, `<span aria-hidden="true">${item.icon}</span> ${item.label.ru}`), lang, state.bag.has(id));
    }).join('')}</div>
    <div class="city-badges">${Array.from(state.collected, id => badges(id, lang)).join('')}</div>`;
}
const intros = {
    drums: {
        label: line('Dört davul', 'Четыре удара'), pattern: '● ● ● ●',
        finale: line('Jun’la seçtiğin dört davul vuruşu bisin başında duyuldu.', 'На бис прозвучали четыре удара, которые вы выбрали с Джуном.')
    },
    whisper: {
        label: line('Fısıltı ve yükseliş', 'Шёпот и подъём'), pattern: '· · ◐ ●',
        finale: line('Jun’la seçtiğin fısıltıdan açılan girişte salon bir an sessiz kaldı.', 'На вступлении, которое вы выбрали с Джуном, зал на миг притих, услышав шёпот.')
    }
};
const greetingLabels = { hello: 'Annyeonghaseyo', thanks: 'Gamsahamnida' };
function rehearsal(lang) {
    if (state.danceDay !== null) {
        return `<p class="city-instruction">${line('“Üç işareti de yakaladım! Yarın mesajlarına bak.”', '«Поймала все три сигнала! Загляни завтра в сообщения».')[lang]}</p>
      ${button('chat-nari', line('Nari’nin mesajlarını aç', 'Открыть чат с Нари')[lang])}`;
    }
    return `<p class="city-instruction">${line('Sol, sağ, sol sırasıyla dokun.', 'Нажми по порядку: влево, вправо, влево.')[lang]}</p>
    <div class="city-pattern" aria-label="${state.rhythm} / 3">${danceOrder.map((step, index) => `<b class="${index < state.rhythm ? 'city-beat-done' : ''}" aria-hidden="true">${step === 'left' ? '←' : '→'}</b>`).join('')}</div>
    <div class="city-options city-options-pair">
    ${button('step-left', line('← Sol', '← Влево')[lang])}${button('step-right', line('Sağ →', 'Вправо →')[lang])}</div>`;
}
function studio(lang) {
    const introIds = ['drums', 'whisper'];
    const sample = state.introPreview ? intros[state.introPreview] : null;
    return `<div class="city-options city-options-pair">${introIds.map(id => selected(`preview-${id}`, intros[id].label, lang, state.introPreview === id)).join('')}</div>
    ${sample ? `<div class="city-sample" aria-label="${sample.label[lang]}">${sample.pattern}</div>${state.intro === state.introPreview ? badges('jun', lang) : button('choose-intro', line('Biste bunu kullan', 'Взять на бис')[lang])}` : ''}`;
}
function festival(lang) {
    const controls = [];
    if (!state.lightstick)
        controls.push(['lightstick', line('Işık çubuğunu aç ve işaret ver', 'Включить лайтстик и подать сигнал')]);
    if (state.tradeCard)
        controls.push(['trade', line('Yedek kart ↔ Minho’nun festival kartı', 'Запасная карта ↔ фестивальная карта Минхо')]);
    return `${state.lightstick ? '<div class="city-light-wave" aria-hidden="true">✦ ✧ ✦ ✧ ✦</div>' : ''}
    ${state.tradeCard ? `<p class="city-instruction">${line('Takas sonunda Minho’nun fotoğraf kartı albümüne eklenecek.', 'После обмена фотокарточка Минхо появится в альбоме.')[lang]}</p>` : badges('minho', lang)}
    ${options(lang, controls)}`;
}
function danaAtVenue(lang, venue) {
    const greetings = [
        ['hello', line('Annyeonghaseyo · Merhaba', 'Аннёнхасэё · Здравствуйте')],
        ['thanks', line('Gamsahamnida · Teşekkürler', 'Камсамнида · Спасибо')]
    ];
    return `<div class="city-options">${greetings.map(([id, label]) => selected(`greet-${id}`, label, lang, state.greeting === id)).join('')}</div>
    ${venue === 'lobby' ? button('chat-dana', line('Ziyaretçi kartı için Dana’ya yaz', 'Написать Дане о пропуске')[lang], 'city-back') : ''}`;
}
function station(lang) {
    if (state.city !== 'seoul') {
        return options(lang, [
            ...(state.city === 'tour' ? [['travel-busan', line('← Busan’a dön', '← Вернуться в Пусан')]] : []),
            ['travel-seoul', line('← Seul’e dön', '← Вернуться в Сеул')]
        ]);
    }
    if (state.day !== 1)
        return `<p class="city-instruction">${line('Busan treni konserin ertesi günü hareket edecek.', 'Поезд в Пусан отправится на следующий день после концерта.')[lang]}</p>`;
    if (!state.bag.has('pass') || !state.bag.has('shoes')) {
        return `<p class="city-instruction">${line('Turne kartını ve prova ayakkabısını çantana koy, sonra gara gel.', 'Положи в сумку пропуск и обувь для репетиции, потом возвращайся на вокзал.')[lang]}</p>
      ${button('tab-bag', tabs.bag.label[lang])}`;
    }
    return button('travel-busan', line('Busan trenine bin →', 'Сесть на поезд в Пусан →')[lang]);
}
function busanStage(lang) {
    if (state.collected.has('busan')) {
        return `${badges('busan', lang)}${button('travel-tour', line('Turne açılışına git →', 'На открытие тура →')[lang])}`;
    }
    if (!state.busanGreeting) {
        return `<p class="city-instruction">${line('Önce kıyı yolunda Dana’yla buluş. Ses kontrolünde seçtiğiniz selamı kullanacaksın.', 'Сначала встреться с Даной на набережной. Выбранная фраза прозвучит на саундчеке.')[lang]}</p>
      ${button('visit-boardwalk', venues.boardwalk.label[lang])}`;
    }
    return `<p class="city-instruction">${line('Dalgaların sesini dinle. Müzik kıyıya vurunca sahnenin işaretini ver.', 'Послушай волны. Подай сигнал сцене, когда волна дойдёт до берега.')[lang]}</p>
    <div class="city-sample" aria-hidden="true">≈ ≈ ✦</div>
    ${options(lang, [['busan-early', line('Dalga yaklaşırken', 'Волна ещё идёт')], ['busan-check', line('Dalga kıyıya vurduğunda', 'Волна у берега')]])}`;
}
function hotel(lang) {
    const joined = state.collected.has('breakfast');
    const breakfast = state.slot === 'morning' || joined ? `<div class="city-breakfast">
    <div class="city-speaker">${portrait('dana', lang)}<div><h4>${line('Ekip kahvaltısı', 'Завтрак с командой')[lang]}</h4><p>${people.dana.name[lang]} · ${people.dana.job[lang]}</p></div></div>
    <p class="city-bubble">${joined ? line('Bir dahaki durakta görüşürüz. Sahne selamını da unutma!', 'Увидимся на следующей остановке. И помни о приветствии со сцены!')[lang] : line('“Günaydın! Çay soğumadan masaya gel. Bugünün programına birlikte bakalım.”', '«Доброе утро! Садись к нам, пока не остыл чай. Посмотрим вместе план на сегодня».')[lang]}</p>
    ${joined ? badges('breakfast', lang) : button('hotel-breakfast', line('Dana’yla kahvaltıya otur', 'Позавтракать с Даной')[lang])}
    </div>` : '';
    return `${breakfast}${bag(lang)}`;
}
function photoBooth(lang) {
    const frame = state.collected.has('booth-peace') ? 'booth-peace' : state.collected.has('booth-heart') ? 'booth-heart' : null;
    if (frame)
        return `<div class="city-booth-print city-tone-${awards[frame].tone}">
    ${portrait('minho', lang)}<span aria-hidden="true">${awards[frame].icon}</span><strong>${awards[frame].label[lang]}</strong>
    </div>`;
    return `<p class="city-bubble">${line('Minho kabine girdi. Bir poz seç, oyun kamerası fotoğrafı albümüne bassın.', 'Минхо вошёл в фотобудку. Выбери позу, и игровая камера отправит снимок в альбом.')[lang]}</p>
    <div class="city-options city-options-pair">
      ${button('booth-peace', line('✌ Zafer pozu', '✌ Знак победы')[lang])}
      ${button('booth-heart', line('♡ Kalp pozu', '♡ Сердечко')[lang])}
    </div>`;
}
function debut(lang) {
    const performed = state.collected.has('debut');
    return `<div class="city-debut${performed ? ' city-debut-lit' : ''}">
    ${portrait('nari', lang)}${portrait('hena', lang)}
    </div>
    ${performed ? `<p class="city-bubble">${line('Nari ilk adımı attı, Hena ilk notayı söyledi. İkisi birlikte seyirciye selam verdi.', 'Нари сделала первый шаг, Хэна взяла первую ноту. Потом они вместе поклонились залу.')[lang]}</p>${badges('debut', lang)}` :
        `<p class="city-bubble">${state.debutReady ? line('Jun başıyla işaret verdi. Nari ile Hena girişini bekliyor.', 'Джун кивнул. Нари и Хэна ждут сигнала к выходу.')[lang] : line('Nari ve Hena ilk kez birlikte çıkacak. Prova bitince Jun sahne ışığını sana bırakıyor.', 'Нари и Хэна впервые выступят вместе. После репетиции Джун доверяет тебе свет на сцене.')[lang]}</p>
    ${state.debutReady ? button('debut-perform', line('Işığı yak ve grubu karşıla', 'Зажечь прожекторы и встретить группу')[lang]) : button('debut-ready', line('Jun’a hazır olduğunuzu bildir', 'Сообщить Джуну, что всё готово')[lang])}`}
  `;
}
function venueDetail(id, lang) {
    switch (id) {
        case 'hotel':
            return hotel(lang);
        case 'river':
            return rehearsal(lang);
        case 'studio':
            return studio(lang);
        case 'audition':
            return state.collected.has('hena') ? badges('hena', lang) : options(lang, [
                ['hena-early', line('Piyano başlamadan söyle', 'Спеть до пианино')],
                ['hena-note', line('İlk notayı dinle ve eşlik et', 'Услышать первую ноту и вступить')]
            ]);
        case 'wardrobe':
            return state.collected.has('mei') ? badges('mei', lang) : options(lang, [
                ['mei-outside', line('Klipsi eteğin dışından tak', 'Закрепить снаружи подола')],
                ['mei-clip', line('Klipsi astardaki iki ilmeğe geçir', 'Продеть застёжку в две петли подкладки')]
            ]);
        case 'cafe':
            return state.collected.has('sumi') ? badges('sumi', lang) : options(lang, [
                ['sumi-now', line('Pastayı masaya koy', 'Поставить торт на стол')],
                ['sumi-save', line('Masaya kapalı kart bırak, pastayı Sumi saklasın', 'Оставить закрытую открытку, торт спрятать у Суми')]
            ]);
        case 'festival':
            return festival(lang);
        case 'photobooth':
            return photoBooth(lang);
        case 'lobby':
            return `${danaAtVenue(lang, id)}${button('visit-debut', venues.debut.label[lang], 'city-option')}`;
        case 'boardwalk':
            return danaAtVenue(lang, id);
        case 'courtyard':
            return `<div class="city-options">${state.collected.has('pixel') ? badges('pixel', lang) :
                button('pixel-clue', line('Gümüş çantanın arkasına bak', 'Заглянуть за серебристый кофр')[lang])}
        ${state.collected.has('pixelphoto') ? badges('pixelphoto', lang) : button('pixel-photo', line('Pixel’i oyun kamerasıyla çek', 'Сфотографировать Пикселя в игре')[lang])}
        <button type="button" class="city-option" data-act="pets-pixel">${line('Pixel’le vakit geçir →', 'Побыть с Пикселем →')[lang]}</button>
        </div>`;
        case 'showcase':
            return state.collected.has('invite')
                ? `<p class="city-bubble">${line('“İlk gösterimi beraber yaptık. Selam vermek de ekibin işi!”', '«Моё первое выступление мы сделали вместе. Теперь поклонимся командой!»')[lang]}</p>${badges('invite', lang)}`
                : button('showcase-dance', line('Nari’ye ilk adım işaretini ver', 'Подать Нари сигнал к первому шагу')[lang]);
        case 'debut':
            return debut(lang);
        case 'station':
            return station(lang);
        case 'busanstage':
            return busanStage(lang);
        case 'tourstage':
            return state.collected.has('tour')
                ? `<p class="city-instruction">${line('Açılış kartın albüme eklendi. Turne ekibi selamını duymak için sahnenin önünde bekliyor.', 'Карточка открытия уже в альбоме. Команда тура ждёт у сцены, чтобы услышать твоё приветствие.')[lang]}</p>${badges('tour', lang)}`
                : button('tour-open', line('Turneyi sahne selamınla aç', 'Открыть тур приветствием со сцены')[lang]);
    }
}
function room(lang) {
    const venue = venues[state.location];
    const person = venue.person;
    const known = person ? people[person] : null;
    return `<div class="city-room">
    ${button('tab-map', `← ${tabs.map.label[lang]}`, 'city-back')}
    <div class="city-section-head"><h3>${venue.label[lang]}</h3></div>
    ${person && known ? `<div class="city-speaker"><div class="city-speaker-art city-tone-${venue.tone}">${portrait(person, lang)}</div><div><h4>${known.name[lang]}</h4><p>${known.job[lang]}</p></div></div>
    ${state.location === 'showcase' ? '' : `<p class="city-bubble">${known.hello[lang]}</p>`}` : ''}
    ${venueDetail(state.location, lang)}
  </div>`;
}
export function renderCity(lang, role, freeVisit = false) {
    const storageWarning = state.storageUnavailable
        ? `<p class="city-status">${line('Tarayıcı albümü bu oturumda saklayamıyor.', 'В этом сеансе браузер не может сохранить альбом.')[lang]}</p>` : '';
    const panel = {
        map: () => state.inside ? room(lang) : map(lang, role),
        plan: () => plan(lang),
        messages: () => messages(lang),
        bag: () => bag(lang)
    };
    const continueLabel = state.day < 0 ? line('Ertesi güne geç →', 'На следующий день →')
        : state.day === 0 ? line('Konser kulisine git →', 'За кулисы концерта →') : line('Geziyi bitir →', 'Завершить прогулку →');
    return `<section class="city-hub">
    ${banner(lang)}
    ${phone(lang)}
    ${state.notice ? `<p class="city-status" role="status">${state.notice[lang]}</p>` : ''}
    ${storageWarning}
    <div class="city-panel">${panel[state.tab]()}</div>
    ${freeVisit ? '' : button('continue', continueLabel[lang], 'city-continue')}
  </section>`;
}
export function cityAlbum(lang) {
    const stored = rememberedAwards();
    return `<section class="city-album"><div class="city-section-head">
    <h3>${line('Şehir hatıraları', 'Городские воспоминания')[lang]}</h3><small>${stored.length} / ${awardIds.length}</small></div>
    ${stored.length ? `<ul class="city-album-grid">${stored.map(id => {
        const person = awardPortrait[id];
        const photoFrame = id === 'booth-peace' || id === 'booth-heart';
        return `<li class="city-tone-${awards[id].tone}">${photoFrame ? `<div class="city-booth-print">${portrait('minho', lang)}<span aria-hidden="true">${awards[id].icon}</span></div>` : person ? portrait(person, lang) : `<div class="city-album-mark" aria-hidden="true">${awards[id].icon}</div>`}
      <strong>${awards[id].label[lang]}</strong></li>`;
    }).join('')}</ul>` : `<p class="city-instruction">${line('Şehirde ekiple tanışınca kazandığın kartlar burada görünür.', 'Карточки, полученные от команды в городе, появятся здесь.')[lang]}</p>`}
  </section>`;
}
export function cityFinale(lang) {
    const snippets = [];
    if (state.intro)
        snippets.push(intros[state.intro].finale);
    if (state.danceDay !== null)
        snippets.push(line('Nari’yle çalıştığın üç adım son selamın ritmine karıştı.', 'Три шага, которые вы отработали с Нари, вошли в ритм финального поклона.'));
    if (state.collected.has('hena'))
        snippets.push(line('Hena ilk notada ekibe katıldı.', 'Хэна вступила вместе с командой на первой ноте.'));
    if (state.collected.has('mei'))
        snippets.push(line('Mei’yle ayarladığın klips tek dokunuşta açıldı.', 'Застёжка, которую вы настроили с Мэй, открылась одним движением.'));
    if (state.lightstick)
        snippets.push(line('Minho’yla çalıştığın ışık dalgası sahneye kadar geldi.', 'Волна света, которую вы отрепетировали с Минхо, дошла до сцены.'));
    if (state.greeting) {
        const greeting = greetingLabels[state.greeting];
        snippets.push(line(`“${greeting}!” dediğinde tribün karşılık verdi.`, `На «${greeting}!» откликнулись трибуны.`));
    }
    if (state.collected.has('pixel'))
        snippets.push(line('Pixel’in bulduğu yedek mikrofon sahneye yetişti.', 'Запасной микрофон, который нашёл Пиксель, вовремя принесли на сцену.'));
    if (state.collected.has('sumi'))
        snippets.push(line('Son selamdan sonra Sumi pastayı getirdi, Nari mumları üfledi.', 'После последнего поклона Суми вынесла торт, и Нари задула свечи.'));
    if (state.collected.has('debut'))
        snippets.push(line('İlk gösteriden çıkan Nari ve Hena bu kez seni sahne kenarından alkışladı.', 'После своего дебюта Нари и Хэна аплодировали тебе из-за кулис.'));
    return snippets.map(snippet => snippet[lang]).join(' ');
}
const relationshipKey = 'encore1.city-connections';
const relationshipIds = ['guest-pass', 'hena-invite', 'nari-invite'];
const npcIds = ['jun', 'nari', 'hena', 'mei', 'sumi', 'minho', 'dana', 'pixel'];
const relationships = new Set();
function rememberRelationship(id) {
    relationships.add(id);
    try {
        if (typeof localStorage !== 'undefined')
            localStorage.setItem(relationshipKey, Array.from(relationships).join(','));
    }
    catch {
        state.storageUnavailable = true;
    }
}
function restoreRelationships() {
    try {
        const saved = typeof localStorage === 'undefined' ? [] : localStorage.getItem(relationshipKey)?.split(',') ?? [];
        for (const id of saved) {
            if (relationshipIds.includes(id) || npcIds.some(npc => id === npc))
                relationships.add(id);
        }
    }
    catch {
        state.storageUnavailable = true;
    }
    state.guestPass = relationships.has('guest-pass');
    state.henaInvite = relationships.has('hena-invite');
    state.nariInvite = relationships.has('nari-invite');
    for (const id of npcIds) {
        if (relationships.has(id))
            state.contacts.add(id);
    }
    state.practicedBefore = rememberedAwards().includes('nari');
    if (state.practicedBefore)
        state.contacts.add('nari');
}
function move(id, role) {
    if (!stops[state.city].includes(id))
        return false;
    const venue = venues[id];
    const reason = closedReason(venue, role);
    state.tab = 'map';
    state.chat = null;
    state.inside = reason === null;
    if (reason) {
        state.notice = reason;
        return true;
    }
    state.location = id;
    state.visited.add(id);
    if (venue.person && !state.contacts.has(venue.person)) {
        state.contacts.add(venue.person);
        rememberRelationship(venue.person);
    }
    return true;
}
function pack(item) {
    if (state.bag.has(item)) {
        state.bag.delete(item);
    }
    else if (state.bag.size === 2) {
        state.notice = line('Çanta dolu. Yeni bir eşya koymak için birini çıkar.', 'Сумка заполнена. Убери один предмет, чтобы положить другой.');
    }
    else {
        state.bag.add(item);
    }
}
function step(side) {
    if (state.danceDay !== null)
        return;
    if (danceOrder[state.rhythm] !== side) {
        state.rhythm = 0;
        state.notice = line('İlk işaretten yeniden dene.', 'Попробуй ещё раз с первого сигнала.');
        return;
    }
    state.rhythm += 1;
    if (state.rhythm === danceOrder.length) {
        state.danceDay = state.day;
        collect('nari', line('“Oldu! Yarın sana ilk gösterim için yazacağım.”', '«Получилось! Завтра напишу про моё первое выступление».'));
    }
}
function travel(city) {
    if (state.city === city)
        return false;
    const packed = state.bag.has('pass') && state.bag.has('shoes');
    if (city === 'busan' && state.city === 'seoul' && (state.day !== 1 || !packed))
        return false;
    if (city === 'tour' && (state.city !== 'busan' || !state.collected.has('busan')))
        return false;
    state.city = city;
    state.location = city === 'busan' ? 'boardwalk' : city === 'tour' ? 'tourstage' : 'hotel';
    state.tab = 'map';
    state.inside = false;
    return true;
}
function chatCommand(action) {
    if (state.tab !== 'messages')
        return false;
    if (action === 'guest-pass' && state.chat === 'dana') {
        state.guestPass = true;
        rememberRelationship(action);
        state.notice = line('YG ziyaretçi kartın hazır.', 'Гостевой пропуск YG готов.');
        return true;
    }
    if (action === 'hena-invite' && state.chat === 'hena') {
        state.henaInvite = true;
        rememberRelationship(action);
        state.notice = line('Seçme daveti geldi. 14:00’te YG seçme odasına gidebilirsin.', 'Приглашение пришло. В 14:00 можно пойти в зал прослушиваний YG.');
        return true;
    }
    if (action === 'nari-invite' && state.chat === 'nari' && canInviteNari()) {
        state.nariInvite = true;
        rememberRelationship(action);
        state.notice = line('Davet cebinde. Haritadan YG küçük sahnesine git.', 'Приглашение у тебя. Найди малую сцену YG на карте.');
        return true;
    }
    return false;
}
const roomCommands = {
    'hotel-breakfast': { at: 'hotel', perform: () => {
            if (state.slot === 'morning')
                collect('breakfast', line('Dana çay koydu. Programı birlikte gözden geçirdiniz.', 'Дана налила чай, и вы вместе посмотрели расписание.'));
        } },
    'booth-peace': { at: 'photobooth', perform: () => poseForBooth('booth-peace') },
    'booth-heart': { at: 'photobooth', perform: () => poseForBooth('booth-heart') },
    'debut-ready': { at: 'debut', perform: () => { state.debutReady = true; } },
    'debut-perform': { at: 'debut', perform: () => {
            if (state.debutReady)
                collect('debut', line('Salon alkışladı. İlk gösteri kartı albümüne girdi.', 'Зал зааплодировал. Карточка дебюта появилась в альбоме.'));
        } },
    'step-left': { at: 'river', perform: () => step('left') },
    'step-right': { at: 'river', perform: () => step('right') },
    'preview-drums': { at: 'studio', perform: () => { state.introPreview = 'drums'; } },
    'preview-whisper': { at: 'studio', perform: () => { state.introPreview = 'whisper'; } },
    'choose-intro': { at: 'studio', perform: () => {
            if (!state.introPreview)
                return;
            state.intro = state.introPreview;
            collect('jun', line('Jun seçtiğin girişi bis için ayırdı.', 'Джун оставил выбранное вступление для выхода на бис.'));
        } },
    'hena-early': { at: 'audition', perform: () => {
            state.notice = line('“Piyanonun ilk notasını bekleyelim, sonra birlikte.”', '«Подождём первую ноту пианино, потом вступим вместе».');
        } },
    'hena-note': { at: 'audition', perform: () => collect('hena', line('Piyano çaldı. Hena seninle aynı anda girdi.', 'Пианино заиграло. Хэна вступила одновременно с тобой.')) },
    'mei-outside': { at: 'wardrobe', perform: () => {
            state.notice = line('“Klips görünüyor. Astarın iki ilmeğini dene.”', '«Застёжку видно. Попробуй две петли в подкладке».');
        } },
    'mei-clip': { at: 'wardrobe', perform: () => collect('mei', line('Etek toplandı. Mei klipsin düzeneğini kulis için çantana koydu.', 'Подол собран. Мэй положила застёжку в твою сумку для выступления.')) },
    'sumi-now': { at: 'cafe', perform: () => {
            state.notice = line('“Pastayı görürse sürpriz biter. Önce kapalı kartı bırakalım.”', '«Если увидит торт, сюрприза не будет. Сначала оставим закрытую открытку».');
        } },
    'sumi-save': { at: 'cafe', perform: () => collect('sumi', line('Sumi pastayı son selamdan sonraya sakladı.', 'Суми спрятала торт до конца выступления.')) },
    lightstick: { at: 'festival', perform: () => {
            state.lightstick = true;
            collect('light', line('Minho çubuğunu kaldırdı. İşaretinle stand boyunca bir ışık dalgası oluştu.', 'Минхо поднял лайтстик. По твоему сигналу вдоль стенда прошла волна света.'));
        } },
    trade: { at: 'festival', perform: () => {
            if (!state.tradeCard)
                return;
            state.tradeCard = false;
            collect('minho', line('Takas tamam. Minho’nun festival kartı albümünde.', 'Обмен завершён. Фестивальная карточка Минхо в альбоме.'));
        } },
    'pixel-clue': { at: 'courtyard', perform: () => collect('pixel', line('Çantanın arkasında yedek mikrofon vardı. Pixel mırıldandı.', 'За кофром оказался запасной микрофон. Пиксель замурчал.')) },
    'pixel-photo': { at: 'courtyard', perform: () => collect('pixelphoto', line('Pixel başını eğdi. Fotoğraf albüme gitti.', 'Пиксель наклонил голову. Фото отправилось в альбом.')) },
    'showcase-dance': { at: 'showcase', perform: () => collect('invite', line('Nari işaretini gördü ve ilk adımıyla sahneye çıktı.', 'Нари увидела твой сигнал и сделала первый шаг на сцену.')) },
    'busan-early': { at: 'busanstage', perform: () => {
            state.notice = line('Dalganın kıyıya ulaştığı anı bekle.', 'Дождись, пока волна дойдёт до берега.');
        } },
    'busan-check': { at: 'busanstage', perform: () => {
            if (!state.busanGreeting)
                return;
            collect('busan', line('Kıyıda ses net duyuldu. Ekip turne açılışına hazır.', 'Звук на берегу чистый. Команда готова к открытию тура.'));
        } },
    'tour-open': { at: 'tourstage', perform: () => {
            if (!state.greeting)
                return;
            const greeting = greetingLabels[state.greeting];
            collect('tour', line(`“${greeting}!” Açılış işaretin sahneden tribüne ulaştı.`, `«${greeting}!» Сигнал открытия дошёл со сцены до трибун.`));
        } }
};
function poseForBooth(pose) {
    if (state.collected.has('booth-peace') || state.collected.has('booth-heart'))
        return;
    collect(pose, line('Flaş çaktı. Saçaklı fotokabin baskın albüme eklendi.', 'Вспышка! Снимок из фотобудки появился в альбоме.'));
}
export function cityAction(rawAction, role) {
    if (!rawAction.startsWith('city-') || rawAction === 'city-continue')
        return false;
    const action = rawAction.slice('city-'.length);
    state.notice = null;
    const tab = tabIds.find(id => action === `tab-${id}`);
    if (tab) {
        state.tab = tab;
        state.chat = null;
        state.inside = false;
        return true;
    }
    const pin = state.city === 'seoul' ? mapPins.find(({ id }) => action === `pin-${id}`) : undefined;
    const location = stops[state.city].find(id => action === `visit-${id}`) ?? pin?.id;
    if (location)
        return move(location, role);
    const slot = slots.find(id => action === `time-${id}`);
    if (slot && state.tab === 'plan' && slots.indexOf(slot) > slots.indexOf(state.slot)) {
        state.slot = slot;
        state.inside = false;
        return true;
    }
    const person = npcIds.find(id => action === `chat-${id}`);
    if (person && state.contacts.has(person)) {
        state.tab = 'messages';
        state.chat = person;
        state.inside = false;
        return true;
    }
    const item = bagIds.find(id => action === `pack-${id}`);
    if (item && (state.tab === 'bag' || state.inside && state.location === 'hotel')) {
        pack(item);
        return true;
    }
    if (chatCommand(action))
        return true;
    if (state.tab !== 'map' || !state.inside)
        return false;
    if ((action === 'greet-hello' || action === 'greet-thanks') && (state.location === 'lobby' || state.location === 'boardwalk')) {
        state.greeting = action === 'greet-hello' ? 'hello' : 'thanks';
        if (state.location === 'boardwalk')
            state.busanGreeting = true;
        collect('dana', line('Dana selamını sahne kartına yazdı.', 'Дана записала приветствие на карточке для сцены.'));
        return true;
    }
    if (action === 'travel-busan' && state.location === 'station')
        return travel('busan');
    if (action === 'travel-seoul' && state.location === 'station')
        return travel('seoul');
    if (action === 'travel-tour' && state.location === 'busanstage')
        return travel('tour');
    const command = Object.prototype.hasOwnProperty.call(roomCommands, action) ? roomCommands[action] : undefined;
    if (!command || command.at !== state.location)
        return false;
    command.perform();
    return true;
}
restoreRelationships();
