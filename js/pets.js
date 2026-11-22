const words = (value, lang) => value[lang === 'tr' ? 0 : 1];
const petIds = ['jisoo', 'jennie', 'rose', 'lisa', 'pixel'];
const activities = ['feed', 'play', 'bed', 'park', 'mission', 'photo'];
const pets = {
    jisoo: {
        name: ['Jisoo', 'Джису'], animal: ['Pembe tasmalı beyaz köpek', 'Белая собачка с розовым ошейником'],
        heading: ['Jisoo’nun köpeği', 'Собачка Джису'], withOwner: ['Jisoo ve köpeği', 'Джису и её собачка'],
        intro: ['Pembe tasması sallanırken kapıya kadar sekiyor. Dışarı çıkmaya hazır!', 'Розовый ошейник качается. Собачка уже скачет к двери: пора гулять!'],
        play: ['İp oyuncağı iki patisiyle yakaladı, sonra sana geri getirdi.', 'Собачка поймала канатик двумя лапами и принесла тебе.'],
        mission: {
            title: ['Taşıma çantasını hazırla', 'Собери переноску'],
            prompt: ['Kısa yolculuk için çanta hazır. Minik patilerin altında yumuşak ve tanıdık bir şey olsun. Ne koyarsın?', 'Переноска готова к короткой поездке. Нужно что-то мягкое и знакомое для маленьких лап. Что положишь?'],
            choices: [{ icon: '🎤', label: ['Mikrofon', 'Микрофон'] }, { icon: '🧣', label: ['Sevdiği battaniye', 'Любимый плед'] }, { icon: '🔔', label: ['Çıngırak', 'Колокольчик'] }],
            correct: 1, retry: ['Tüyleri kadar yumuşak bir şey arıyor.', 'Поищи что-то мягкое, как её шерсть.'],
            memory: ['Sevdiği battaniyeyi taşıma çantasına serdin. Beyaz köpek kıvrılıp pembe burnunu kumaşa gömdü.', 'Ты постелила любимый плед в переноску. Белая собачка свернулась клубком и уткнулась носом в ткань.'],
            reward: { icon: '🧳', label: ['Rahat yolcu rozeti', 'Значок «Уютная поездка»'] },
        },
    },
    jennie: {
        name: ['Jennie', 'Дженни'], animal: ['Kıvırcık kahverengi köpek', 'Коричневая кудрявая собачка'],
        heading: ['Jennie’nin köpeği', 'Собачка Дженни'], withOwner: ['Jennie ve köpeği', 'Дженни и её собачка'],
        intro: ['Kıvırcık kulakları her adımda zıplıyor. En küçük hışırtıda bile başını çeviriyor.', 'Кудрявые ушки подпрыгивают при каждом шаге. На любой шорох собачка поворачивает голову.'],
        play: ['Fiyonk biçimindeki oyuncağı kaptı ve gururla etrafta dolaştı.', 'Собачка схватила игрушку-бантик и гордо обошла комнату.'],
        mission: {
            title: ['Turne tılsımını seç', 'Выбери талисман для тура'],
            prompt: ['Jennie turnede sahneye çıkarken bu dostunu hatırlamak istiyor. Masada üç tılsım var. Hangisi siyah fiyonktaki işareti taşıyor?', 'В туре Дженни хочет вспоминать своего друга перед выходом на сцену. На столе три талисмана. На каком тот же знак, что на чёрном бантике?'],
            choices: [{ icon: '♡', label: ['Altın kalp', 'Золотое сердечко'] }, { icon: '☾', label: ['Gümüş ay', 'Серебряный месяц'] }, { icon: '✦', label: ['Mavi yıldız', 'Синяя звёздочка'] }],
            correct: 0, retry: ['Fotoğraftaki siyah fiyonga yakından bak.', 'Присмотрись к чёрному бантику на фотографии.'],
            memory: ['Altın kalbi turne çantasına taktın. Jennie, ilk sahne çağrısında gülümseyip kalbe dokundu.', 'Ты прикрепила золотое сердечко к гастрольной сумке. Услышав первый вызов на сцену, Дженни улыбнулась и коснулась талисмана.'],
            reward: { icon: '♡', label: ['Altın kalp tılsımı', 'Талисман «Золотое сердце»'] },
        },
    },
    rose: {
        name: ['Rosé', 'Розэ'], animal: ['Mavi fularlı köpek', 'Собачка в голубом платочке'],
        heading: ['Rosé’nin köpeği', 'Собачка Розэ'], withOwner: ['Rosé ve köpeği', 'Розэ и её собачка'],
        intro: ['Mavi fularını takmış, burnunu kaldırıp bir sonraki yürüyüşü bekliyor.', 'Собачка в голубом платочке подняла нос и ждёт следующей прогулки.'],
        play: ['Yumuşak oyuncağı yakaladı ve fuları uçuşurken koştu.', 'Собачка поймала мягкую игрушку и побежала. Голубой платочек развевался.'],
        mission: {
            title: ['Prova için bir dost bul', 'Найди друга на время репетиции'],
            prompt: ['Rosé provaya gidiyor. Mavi fularlı dostu, parkta iki selam öğreten turne çevirmenini tanıyor. Kime emanet edersin?', 'Розэ уходит на репетицию. Её друг знает переводчицу, которая научила тебя здороваться на двух языках в парке. С кем ты его оставишь?'],
            choices: [{ icon: '☕', label: ['Sumi · kafe sahibi', 'Суми · хозяйка кафе'] }, { icon: '🎧', label: ['Jun · prodüktör', 'Джун · продюсер'] }, { icon: '💬', label: ['Dana · çevirmen', 'Дана · переводчица'] }],
            correct: 2, retry: ['Köpek, Dana’nın yürüyüşünü tanıyıp fularını salladı.', 'Собачка узнала Дану по шагам и взмахнула голубым платочком.'],
            memory: ['Dana mavi fularlı dostla provanın sonuna kadar parkta kaldı. Rosé dönüşte ikisini de kapıda buldu.', 'Дана погуляла с собачкой до конца репетиции. Когда Розэ вернулась, оба ждали её у двери.'],
            reward: { icon: '🎀', label: ['Mavi fular kurdelesi', 'Голубая лента'] },
        },
    },
    lisa: {
        name: ['Lisa', 'Лиса'], animal: ['Kutuları seven gri kedi', 'Серая кошка, которая любит коробки'],
        heading: ['Lisa’nın kedisi', 'Кошка Лисы'], withOwner: ['Lisa ve kedisi', 'Лиса и её кошка'],
        intro: ['Mor tasmalı kedi en sessiz odada bile bir karton kutu bulur.', 'Кошка в лиловом ошейнике найдёт картонную коробку в любой комнате.'],
        play: ['Tüyü yakalamak için kutudan tek bir pati çıkardı.', 'Из коробки высунулась одна лапа и поймала пёрышко.'],
        mission: {
            title: ['Lisa’nın kedisini bul', 'Найди кошку Лисы'],
            prompt: ['Kedi yine saklandı. Karton hışırtısı duydun. Başını sokup içinde rahatça dönebileceği yere bak.', 'Кошка снова спряталась. Где-то шуршит картон. Загляни туда, где она может удобно свернуться клубком.'],
            choices: [{ icon: '📦', label: ['Geniş karton kutu', 'Широкая картонная коробка'] }, { icon: '🧺', label: ['Çamaşır sepeti', 'Корзина для белья'] }, { icon: '🎒', label: ['Kapalı sırt çantası', 'Закрытый рюкзак'] }],
            correct: 0, retry: ['İki gri kulak kartonun kenarında göründü.', 'Два серых ушка показались над краем картона.'],
            memory: ['Geniş kutuya bakınca iki yeşil göz gördün. Kedi gerinip patisini kutunun kenarına koydu.', 'В широкой коробке блеснули два зелёных глаза. Кошка потянулась и положила лапу на край.'],
            reward: { icon: '📦', label: ['Saklambaç rozeti', 'Значок «Прятки»'] },
        },
    },
    pixel: {
        name: ['Pixel', 'Пиксель'], animal: ['Avlunun siyah beyaz kedisi', 'Чёрно-белый котик из дворика'],
        heading: ['Pixel · avlu kedisi', 'Пиксель · кот из дворика'], withOwner: ['Pixel · YG avlusu', 'Пиксель · дворик YG'],
        intro: ['Pixel avludaki tabureyi ve ekibin çantalarını gözlüyor. Herkesin gelişini ilk o fark ediyor.', 'Пиксель сторожит табуретку и сумки команды во дворе. Он первым замечает всех гостей.'],
        play: ['Pixel parmağını burnuyla dürttü ve sevilmek için yanına sokuldu.', 'Пиксель ткнулся носом в палец и придвинулся поближе, чтобы ты его погладила.'],
        mission: {
            title: ['Kayıp anahtarlık', 'Пропавший брелок'],
            prompt: ['Ekibin pati biçimli anahtarlığı kayıp. Pixel ekipman taşınırken uyuduğu yere bakıyor. Nereye bakarsın?', 'У команды пропал брелок-лапка. Пиксель смотрит туда, где спал, пока переносили оборудование. Куда заглянешь?'],
            choices: [{ icon: '🪴', label: ['Saksının arkası', 'За горшком'] }, { icon: '🎛️', label: ['Ekipman çantasının yanı', 'Рядом с сумкой оборудования'] }, { icon: '🪑', label: ['Taburenin üstü', 'На табуретке'] }],
            correct: 1, retry: ['Pixel ekipman çantasının yanında patisini yere uzattı.', 'Пиксель вытянул лапу к полу рядом с сумкой оборудования.'],
            memory: ['Pixel’in uyuduğu çantanın yanında anahtarlığı buldun. Ekip onu yeniden kulis anahtarlarına taktı.', 'Ты нашла брелок рядом с сумкой, у которой спал Пиксель. Команда снова прикрепила его к ключам от закулисья.'],
            reward: { icon: '🔑', label: ['Pati anahtarlığı rozeti', 'Значок «Брелок-лапка»'] },
        },
    },
};
const copy = {
    section: ['Kulis patileri', 'Лапки за кулисами'],
    choose: ['Bir dost seç', 'Выбери питомца'],
    room: ['Odaya dön', 'Вернуться в комнату'],
    friend: ['Dostluk', 'Дружба'],
    careTitle: ['Bugünkü bakım', 'Сегодняшняя забота'],
    feed: ['Mama ver', 'Покормить'],
    play: ['Oyna', 'Поиграть'],
    pet: ['Sev', 'Погладить'],
    bed: ['Yatağı hazırla', 'Устроить лежанку'],
    bedChoose: ['Bu gece nerede uyusun?', 'Где поспит питомец?'],
    bedPicked: ['Yatak hazır!', 'Лежанка готова!'],
    park: ['Parkta top oyna', 'Поиграть с мячом в парке'],
    photo: ['Fotoğraf çek', 'Сделать фото'],
    photoDone: ['Fotoğraf albümde', 'Фото в альбоме'],
    photoHint: ['Fotoğraf için önce iki bakım etkinliği yap.', 'Для фото позаботься о питомце дважды.'],
    photoSaved: ['Kareyi çektin. Fotoğraf albümde!', 'Снимок готов. Фото уже в альбоме!'],
    feedDone: ['Mama kabı boşaldı. Patiler memnun!', 'Мисочка опустела. Питомец доволен!'],
    parkTitle: ['Top nerede?', 'Где мячик?'],
    parkIntro: ['Topa dokun ya da bir yeri seçip ara. Üç atışı da tamamla.', 'Нажми на мяч или выбери, где искать. Поймай его три раза.'],
    parkProgress: ['Yakalanan top', 'Поймано мячей'],
    ball: ['Topu yakala', 'Поймать мяч'],
    search: ['Bir yerde ara', 'Выбрать место поиска'],
    parkRetry: ['Orada yok. Renkli topun göründüğü yere bak.', 'Там пусто. Посмотри, где виднеется цветной мячик.'],
    parkHit: ['Yakaladın! Top bir sonraki yere yuvarlandı.', 'Поймала! Мяч укатился в другое место.'],
    parkDone: ['Üçünü de buldun! Dostluk albümüne park hatırası eklendi.', 'Все три мяча пойманы! В альбоме появилась запись о парке.'],
    parkLine: ['Parkta üç top yakaladık.', 'Мы поймали три мяча в парке.'],
    parkReward: ['Park kurdelesi', 'Лента за игру в парке'],
    replayPark: ['Yeniden oyna', 'Играть снова'],
    homeMissionDone: ['Hatıra albümde', 'Воспоминание в альбоме'],
    album: ['Pati albümü', 'Альбом лапок'],
    albumEmpty: ['Bir dostla vakit geçir. Dostluk kaydın, fotoğrafların ve ödüllerin burada birikecek.', 'Проведи время с питомцем. Здесь появятся записи о дружбе, фотографии и награды.'],
    albumPhoto: ['Fotoğraf', 'Фото'],
    courtyard: ['YG avlusunda kiraz ağaçları ve Pixel’in bankı', 'Дворик YG с цветущими вишнями и скамейкой Пикселя'],
    thumbDog: ['Köpeği', 'Собачка'],
    thumbCat: ['Kedisi', 'Кошка'],
    thumbYard: ['Avlu kedisi', 'Кот из дворика'],
    memory: ['Hatırayı aç', 'Открыть воспоминание'],
    close: ['Kapat', 'Закрыть'],
    careMemory: ['Kuliste birlikte vakit geçirdik.', 'Мы провели время вместе за кулисами.'],
    tourNote: ['Jennie sahneye çıkmadan önce altın kalp tılsımına dokundu.', 'Перед выходом на сцену Дженни коснулась талисмана с золотым сердечком.'],
    storeError: ['Bu tarayıcı pati albümünü kaydedemiyor. Bu oturumda oynamaya devam edebilirsin.', 'Браузер не может сохранить альбом лапок. Можно продолжить игру в этой сессии.'],
};
const beds = {
    quilt: { icon: '🧺', label: ['Battaniyeli sepet', 'Корзинка с пледом'] },
    cushion: { icon: '🌙', label: ['Ay biçimli minder', 'Подушка-полумесяц'] },
};
const parkSpots = [
    { icon: '🌿', label: ['Çalı', 'Куст'] },
    { icon: '🪑', label: ['Bank', 'Скамейка'] },
    { icon: '🌼', label: ['Çiçekler', 'Цветы'] },
];
const parkOrder = [1, 0, 2];
const storagePrefix = 'encore1.pets.';
const inSession = new Map();
let storageFailed = false;
let selected = 'jisoo';
let place = 'room';
let notice;
let parkRound = 0;
let searching = false;
let choosingBed = false;
let mysteryTried;
let openMemory;
function isPet(value) {
    return petIds.some(id => id === value);
}
function isBed(value) {
    return value === 'quilt' || value === 'cushion';
}
function progress(id) {
    const pending = inSession.get(id);
    if (typeof window !== 'undefined') {
        try {
            const saved = window.localStorage.getItem(storagePrefix + id)?.split(',') ?? [];
            return {
                earned: new Set([...activities.filter(activity => saved.includes(activity)), ...(pending?.earned ?? [])]),
                bed: pending?.bed ?? saved.find(isBed),
            };
        }
        catch {
            storageFailed = true;
        }
    }
    return pending ?? { earned: new Set(), bed: undefined };
}
function remember(id, activity, bed) {
    const changes = progress(id);
    changes.earned.add(activity);
    changes.bed = bed ?? changes.bed;
    if (typeof window !== 'undefined') {
        try {
            const saved = [...changes.earned];
            if (changes.bed)
                saved.push(changes.bed);
            window.localStorage.setItem(storagePrefix + id, saved.join(','));
            inSession.delete(id);
            return;
        }
        catch {
            storageFailed = true;
        }
    }
    inSession.set(id, changes);
}
export function openPet(id) {
    if (!isPet(id))
        return false;
    selected = id;
    place = 'room';
    parkRound = 0;
    choosingBed = false;
    mysteryTried = undefined;
    notice = undefined;
    return true;
}
export function openPetLobby() {
    openPet(petIds[0]);
}
export function petTourNote(lang, member) {
    return member.toLowerCase() === 'jennie' && progress('jennie').earned.has('mission') ? words(copy.tourNote, lang) : '';
}
function startPark() {
    place = 'park';
    parkRound = 0;
    searching = false;
    notice = undefined;
}
function finishParkRound() {
    parkRound++;
    searching = false;
    if (parkRound < parkOrder.length) {
        notice = copy.parkHit;
        return;
    }
    remember(selected, 'park');
    notice = copy.parkDone;
}
function careCount(earned) {
    return Number(earned.has('feed')) + Number(earned.has('play')) + Number(earned.has('bed'));
}
export function petAction(action) {
    if (action.startsWith('pet-select-'))
        return openPet(action.slice('pet-select-'.length));
    if (action.startsWith('pet-memory-')) {
        const id = action.slice('pet-memory-'.length);
        if (!isPet(id) || progress(id).earned.size === 0)
            return false;
        openMemory = openMemory === id ? undefined : id;
        return true;
    }
    if (action === 'pet-room')
        return openPet(selected);
    if (place === 'room') {
        const bed = action.slice('pet-bed-'.length);
        if (choosingBed && action.startsWith('pet-bed-') && isBed(bed)) {
            remember(selected, 'bed', bed);
            notice = copy.bedPicked;
            return true;
        }
        switch (action) {
            case 'pet-feed':
                remember(selected, 'feed');
                notice = copy.feedDone;
                return true;
            case 'pet-play':
                remember(selected, 'play');
                notice = pets[selected].play;
                return true;
            case 'pet-bed':
                remember(selected, 'bed');
                choosingBed = !choosingBed;
                notice = undefined;
                return true;
            case 'pet-park':
                startPark();
                return true;
            case 'pet-mission':
                place = 'mission';
                notice = undefined;
                return true;
            case 'pet-photo':
                if (careCount(progress(selected).earned) < 2)
                    return false;
                remember(selected, 'photo');
                notice = copy.photoSaved;
                return true;
        }
    }
    if (place === 'park' && action === 'pet-park') {
        startPark();
        return true;
    }
    if (place === 'park' && parkRound < parkOrder.length) {
        if (action === 'pet-ball-search') {
            searching = true;
            return true;
        }
        if (action === 'pet-ball-hit') {
            finishParkRound();
            return true;
        }
        if (searching && /^pet-ball-[0-2]$/.test(action)) {
            const guess = Number(action.slice(-1));
            if (guess === parkOrder[parkRound])
                finishParkRound();
            else
                notice = copy.parkRetry;
            return true;
        }
    }
    if (place === 'mission' && /^pet-choice-[0-2]$/.test(action) && !progress(selected).earned.has('mission')) {
        const guess = Number(action.slice(-1));
        const mission = pets[selected].mission;
        mysteryTried = guess;
        if (guess === mission.correct) {
            remember(selected, 'mission');
            notice = undefined;
        }
        else
            notice = mission.retry;
        return true;
    }
    return false;
}
function picture(id, lang, decorative = false) {
    const alt = decorative ? '' : words(pets[id].animal, lang);
    return `<img class="pets-photo pets-photo--${id}" src="art/pets/${id}.webp" alt="${alt}">`;
}
function icon(symbol) {
    return `<span aria-hidden="true">${symbol}</span>`;
}
function button(action, body, style = 'pets-button', attributes = '') {
    return `<button type="button" class="${style}" data-act="pet-${action}" ${attributes}>${body}</button>`;
}
function status(lang) {
    return `<p class="pets-status" role="status">${notice ? words(notice, lang) : ''}</p>`;
}
function saveStatus(lang) {
    return storageFailed ? `<p class="pets-status" role="status">${words(copy.storeError, lang)}</p>` : '';
}
function friendship(earned, lang) {
    return `<div class="pets-friend"><span>${words(copy.friend, lang)}</span><meter min="0" max="${activities.length}" value="${earned.size}" aria-label="${words(copy.friend, lang)}"></meter><strong>${earned.size}/${activities.length}</strong></div>`;
}
function shortSpecies(id) {
    if (id === 'pixel')
        return copy.thumbYard;
    return id === 'lisa' ? copy.thumbCat : copy.thumbDog;
}
function bedView(bed, lang) {
    const options = ['quilt', 'cushion'].map(id => button(`bed-${id}`, `${icon(beds[id].icon)}${words(beds[id].label, lang)}`, 'pets-button', `aria-pressed="${bed === id}"`));
    return `<div id="pets-bed-choices" class="pets-bed-choices" ${choosingBed ? '' : 'hidden'} role="group" aria-label="${words(copy.bedChoose, lang)}">
    <p>${words(copy.bedChoose, lang)}</p><div>${options.join('')}</div>
  </div>${bed && !choosingBed ? `<p class="pets-hint pets-bed-saved">${icon(beds[bed].icon)} ${words(beds[bed].label, lang)}</p>` : ''}`;
}
function roomView(id, lang) {
    const pet = pets[id];
    const { earned, bed } = progress(id);
    const choose = petIds.map(key => button('select-' + key, `${picture(key, lang, true)}<strong>${words(pets[key].name, lang)}</strong><small>${words(shortSpecies(key), lang)}</small>`, 'pets-thumb', `aria-pressed="${key === id}" aria-label="${words(pets[key].heading, lang)}"`));
    const careActions = [
        { id: 'feed', icon: '🥣', title: copy.feed },
        { id: 'play', icon: id === 'pixel' ? '♡' : '🧸', title: id === 'pixel' ? copy.pet : copy.play },
        { id: 'bed', icon: '☾', title: copy.bed },
    ];
    const careButtons = careActions.map(action => button(action.id, `${icon(action.icon)}<span>${words(action.title, lang)}</span>${earned.has(action.id) ? icon('✓') : ''}`, `pets-care-button${earned.has(action.id) ? ' pets-care-button--done' : ''}`, action.id === 'bed' ? `aria-expanded="${choosingBed}" aria-controls="pets-bed-choices"` : `aria-pressed="${earned.has(action.id)}"`));
    const photoReady = careCount(earned) >= 2;
    return `<h2>${words(copy.section, lang)}</h2>
    <div class="pets-pick" role="group" aria-label="${words(copy.choose, lang)}">${choose.join('')}</div>
    <article class="pets-hero">
      <div class="pets-cover${notice === copy.photoSaved ? ' pets-cover--flash' : ''}">${picture(id, lang)}</div>
      <div class="pets-profile"><h3>${words(pet.heading, lang)}</h3><p>${words(pet.intro, lang)}</p></div>
    </article>
    ${friendship(earned, lang)}
    <h3 class="pets-heading">${words(copy.careTitle, lang)}</h3>
    <div class="pets-care">${careButtons.join('')}</div>
    ${bedView(bed, lang)}
    ${status(lang)}
    <div class="pets-outings">
      ${button('park', `${icon('🎾')}${words(earned.has('park') ? copy.replayPark : copy.park, lang)}`)}
      ${button('mission', `${icon(earned.has('mission') ? '✓' : pet.mission.reward.icon)}${words(pet.mission.title, lang)}`)}
      ${button('photo', `${icon(earned.has('photo') ? '✓' : '◉')}${words(earned.has('photo') ? copy.photoDone : copy.photo, lang)}`, 'pets-button pets-button--photo', photoReady ? '' : 'disabled aria-describedby="pets-photo-hint"')}
    </div>
    ${photoReady ? '' : `<p class="pets-hint" id="pets-photo-hint">${words(copy.photoHint, lang)}</p>`}
    ${saveStatus(lang)}`;
}
function returnButton(lang) {
    return button('room', `${icon('‹')}${words(copy.room, lang)}`, 'pets-return');
}
function parkView(lang) {
    const target = parkOrder[parkRound];
    const complete = target === undefined;
    const spots = parkSpots.map((spot, index) => `<div class="pets-park-spot pets-park-spot--${index}">
    ${icon(spot.icon)}<small>${words(spot.label, lang)}</small>
    ${target === index ? button('ball-hit', icon('🎾'), 'pets-ball', `aria-label="${words(copy.ball, lang)}"`) : ''}</div>`);
    const options = parkSpots.map((spot, index) => button(`ball-${index}`, `${icon(spot.icon)}${words(spot.label, lang)}`));
    return `${returnButton(lang)}<h2>${words(copy.parkTitle, lang)}</h2>
    <p class="pets-hint">${words(copy.parkIntro, lang)}</p>
    <div class="pets-park" aria-label="${words(copy.park, lang)}">
      <div class="pets-park-friend">${picture(selected, lang)}</div>${spots.join('')}
    </div>
    <div class="pets-park-count"><span>${words(copy.parkProgress, lang)}</span><strong>${parkRound}/${parkOrder.length}</strong></div>
    ${status(lang)}
    <div class="pets-outings">${complete
        ? button('park', `${icon('↻')}${words(copy.replayPark, lang)}`)
        : searching ? options.join('') : button('ball-search', `${icon('⌕')}${words(copy.search, lang)}`)}</div>`;
}
function missionView(id, lang) {
    const mission = pets[id].mission;
    const done = progress(id).earned.has('mission');
    const choices = mission.choices.map((choice, index) => button('choice-' + index, `${icon(choice.icon)}${words(choice.label, lang)}`, 'pets-button', `aria-pressed="${mysteryTried === index}"`));
    return `${returnButton(lang)}<h2>${words(mission.title, lang)}</h2>
    <figure class="pets-mission-photo">${picture(id, lang)}</figure>
    ${done ? `<p>${words(mission.memory, lang)}</p><div class="pets-reward">${icon(mission.reward.icon)}${words(mission.reward.label, lang)}</div>
      <p class="pets-hint">${words(copy.homeMissionDone, lang)}</p>` : `<p>${words(mission.prompt, lang)}</p><div class="pets-outings">${choices.join('')}</div>${status(lang)}`}`;
}
export function renderPets(lang) {
    const view = { room: () => roomView(selected, lang), park: () => parkView(lang), mission: () => missionView(selected, lang) };
    return `<section class="pets pets--${selected}" id="pets-room" lang="${lang}">${view[place]()}</section>`;
}
function memoryPhoto(id, lang) {
    const pet = pets[id];
    const panels = id === 'pixel'
        ? `${picture(id, lang)}<img class="pets-print-yard" src="art/pets/pixel-yard.webp" alt="${words(copy.courtyard, lang)}">`
        : `<img class="pets-print-owner" src="art/lobby/${id}.webp" alt="${words(pet.name, lang)}">${picture(id, lang)}`;
    return `<figure class="pets-print${id === 'pixel' ? ' pets-print--yard' : ''}"><div>${panels}</div><figcaption>${words(copy.albumPhoto, lang)} · ${words(pet.withOwner, lang)}</figcaption></figure>`;
}
export function petAlbum(lang) {
    const entries = petIds.flatMap(id => {
        const { earned, bed } = progress(id);
        if (earned.size === 0)
            return [];
        const pet = pets[id];
        const caption = words(pet.heading, lang);
        const expanded = openMemory === id;
        return [`<article class="pets-memory pets--${id}">
      ${earned.has('photo') ? memoryPhoto(id, lang) : `<h4>${caption}</h4>`}
      ${friendship(earned, lang)}
      ${button('memory-' + id, `${icon(expanded ? '×' : '↗')}${words(expanded ? copy.close : copy.memory, lang)}`, 'pets-button', `aria-expanded="${expanded}" aria-controls="pets-memory-${id}" aria-label="${words(expanded ? copy.close : copy.memory, lang)} · ${caption}"`)}
      <div class="pets-memory-story" id="pets-memory-${id}" ${expanded ? '' : 'hidden'}>
        ${careCount(earned) ? `<p>${words(copy.careMemory, lang)}</p>` : ''}
        ${bed ? `<p>${icon(beds[bed].icon)} ${words(beds[bed].label, lang)}</p>` : ''}
        ${earned.has('park') ? `<p>${words(copy.parkLine, lang)}</p><div class="pets-reward">${icon('🎾')}${words(copy.parkReward, lang)}</div>` : ''}
        ${earned.has('mission') ? `<p>${words(pet.mission.memory, lang)}</p><div class="pets-reward">${icon(pet.mission.reward.icon)}${words(pet.mission.reward.label, lang)}</div>` : ''}
      </div>
    </article>`];
    });
    return `<section class="pets pets-album" lang="${lang}"><h3>${words(copy.album, lang)}</h3>${entries.length ? `<div class="pets-memories">${entries.join('')}</div>` : `<p class="pets-hint">${words(copy.albumEmpty, lang)}</p>`}${saveStatus(lang)}</section>`;
}
