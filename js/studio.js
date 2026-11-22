const slots = ['top', 'bottom', 'jacket', 'shoes'];
const pieceTypes = [...slots, 'accessory'];
const memberNames = {
    jisoo: 'Jisoo', jennie: 'Jennie', rose: 'Rosé', lisa: 'Lisa',
};
const modes = {
    looks: ['Sahne kostümü', 'Сценический образ'],
    mix: ['Serbest kombin', 'Свой образ'],
    sets: ['Hazır setler', 'Комплекты'],
};
const phases = {
    rehearsal: ['Prova', 'Репетиция'],
    final: ['Final', 'Финал'],
};
const slotNames = {
    top: ['Üst', 'Верх'], bottom: ['Alt', 'Низ'], jacket: ['Ceket', 'Куртка'], shoes: ['Ayakkabı', 'Обувь'],
    accessory: ['Aksesuar', 'Аксессуар'],
};
const looks = [
    {
        id: 'soundcheck', phase: 'rehearsal', names: {
            jisoo: ['Gece çiçeği', 'Ночной цветок'], jennie: ['Kırmızı deri', 'Красная кожа'],
            rose: ['Gümüş yıldızlar', 'Серебряные звёзды'], lisa: ['Pembe şimşek', 'Розовая молния'],
        },
    },
    {
        id: 'runthrough', phase: 'rehearsal', names: {
            jisoo: ['Zümrüt saten', 'Изумрудный атлас'], jennie: ['Damalı yelek', 'Клетчатый жилет'],
            rose: ['Altın ışıltı', 'Золотое сияние'], lisa: ['Kobalt moto', 'Кобальтовая куртка'],
        },
    },
    {
        id: 'spotlight', phase: 'final', names: {
            jisoo: ['Safir nakış', 'Сапфировая вышивка'], jennie: ['Kristal püskül', 'Хрустальная бахрома'],
            rose: ['Kırmızı ekose', 'Красная клетка'], lisa: ['Bronz metalik', 'Литая бронза'],
        },
    },
    {
        id: 'encore', phase: 'final', names: {
            jisoo: ['Siyah fiyonk', 'Чёрный бант'], jennie: ['Yakut saten', 'Рубиновый атлас'],
            rose: ['Mor takımyıldız', 'Лиловое созвездие'], lisa: ['Turuncu kıvılcım', 'Оранжевая искра'],
        },
    },
];
const outfitSets = [
    {
        id: 'floral', names: {
            jisoo: ['Gül yaprakları', 'Лепестки роз'], jennie: ['Pembe deri', 'Розовая кожа'],
            rose: ['Pembe tül', 'Розовый тюль'], lisa: ['İnci zincirleri', 'Жемчужные цепочки'],
        },
    },
    {
        id: 'signature', names: {
            jisoo: ['Kırmızı kamelya', 'Красная камелия'], jennie: ['İnci ve tül', 'Жемчуг и тюль'],
            rose: ['Ayna pulları', 'Зеркальные пайетки'], lisa: ['Altın kıvrımlar', 'Золотые узоры'],
        },
    },
    {
        id: 'pink', names: {
            jisoo: ['Gül kuvars', 'Розовый кварц'], jennie: ['Pembe kargo', 'Розовые карго'],
            rose: ['Pembe kristaller', 'Розовые кристаллы'], lisa: ['Pembe saten', 'Розовый атлас'],
        },
    },
    {
        id: 'couture', names: {
            jisoo: ['Leylak çiçekleri', 'Цветы сирени'], jennie: ['Mavi saten', 'Голубой атлас'],
            rose: ['Gümüş ayna', 'Серебряное зеркало'], lisa: ['Altın sahne', 'Золотая сцена'],
        },
    },
    {
        id: 'backstage', names: {
            jisoo: ['Bordo gül ve dantel', 'Бордовая роза и кружево'], jennie: ['İncili pembe tüvit', 'Розовый твид с жемчугом'],
            rose: ['Gümüş yıldız ve zincir', 'Серебряные звёзды и цепочки'], lisa: ['Fuşya kargo', 'Карго цвета фуксии'],
        },
    },
    {
        id: 'rehearsal', names: {
            jisoo: ['Pembe kiraz çiçeği', 'Розовая сакура'], jennie: ['Gümüş şerit ve lacivert', 'Серебро и тёмно-синий'],
            rose: ['Leylak payet', 'Сиреневые пайетки'], lisa: ['Zümrüt ve krem', 'Изумруд и кремовый'],
        },
    },
    {
        id: 'original', names: {
            jisoo: ['Kadife gül', 'Бархатная роза'], jennie: ['Pembe tüvit ve fiyonk', 'Розовый твид и бант'],
            rose: ['Gümüş zincir ve korse', 'Серебряные цепочки и корсет'], lisa: ['Fuşya neon', 'Неоновая фуксия'],
        },
    },
];
const collections = [
    {
        id: 'crystal', label: ['Kristal', 'Кристалл'], pieces: {
            top: [['Kristal korse', 'Корсет с кристаллами'], ['Fuşya taşlı üst', 'Топ фуксия со стразами'], ['Gümüş payet', 'Серебряные пайетки'], ['Gül işlemeli kadife', 'Бархат с розой']],
            bottom: [['Zincirli şort', 'Шорты с цепочками'], ['Fuşya tüllü şort', 'Шорты с тюлем фуксия'], ['Taşlı pileli etek', 'Юбка со стразами'], ['Gümüş nakışlı şort', 'Серебряные шорты с вышивкой']],
            jacket: [['Püsküllü deri', 'Кожаная куртка с бахромой'], ['Fuşya tüvit', 'Твидовый жакет фуксия'], ['Gümüş bomber', 'Серебряный бомбер'], ['Bordo kadife', 'Бордовый бархатный жакет']],
            shoes: [null, ['Siyah uzun çizme', 'Высокие чёрные сапоги'], ['Gümüş platform çizme', 'Серебряные сапоги на платформе'], null],
        },
    },
    {
        id: 'rouge', label: ['Yakut', 'Рубин'], pieces: {
            top: [['Dantelli yakut korse', 'Рубиновый корсет с кружевом'], ['Kırmızı alevli üst', 'Топ с красным пламенем'], ['Altın payetli üst', 'Топ с золотыми пайетками'], ['Bordo asimetrik üst', 'Асимметричный бордовый топ']],
            bottom: [['Altın zincirli şort', 'Шорты с золотыми цепочками'], ['Yakut pileli etek', 'Рубиновая юбка в складку'], ['Bordo çan pantolon', 'Бордовые брюки клёш'], ['Kırmızı tüllü şort', 'Шорты с красным тюлем']],
            jacket: [['Yakut deri ceket', 'Рубиновая кожаная куртка'], ['Altın apoletli ceket', 'Жакет с золотыми эполетами'], ['Altın bomber', 'Золотой бомбер'], ['Bordo blazer', 'Бордовый блейзер']],
            shoes: [['Kırmızı bağcıklı bot', 'Красные ботинки на шнуровке'], ['Tokalı siyah çizme', 'Чёрные сапоги с пряжками'], ['Yakut simli bot', 'Рубиновые ботильоны с блёстками'], ['Altın bilekli sneaker', 'Высокие золотые кеды']],
        },
    },
    {
        id: 'orbit', label: ['Yıldız', 'Звезда'], pieces: {
            top: [['Mavi yıldızlı korse', 'Синий корсет со звёздами'], ['Ayna pullu üst', 'Топ с зеркальными пайетками'], ['Beyaz püsküllü üst', 'Белый топ с бахромой'], ['Ay işlemeli kadife', 'Бархатный топ с луной']],
            bottom: [['Gümüş metalik şort', 'Серебряные шорты'], ['Safir pileli etek', 'Сапфировая юбка в складку'], ['Beyaz kargo pantolon', 'Белые брюки карго'], ['Yıldızlı çan pantolon', 'Брюки клёш со звёздами']],
            jacket: [['Gümüş moto ceket', 'Серебряная косуха'], ['Safir apoletli blazer', 'Сапфировый блейзер с эполетами'], ['Beyaz taşlı bomber', 'Белый бомбер со стразами'], ['Lacivert yıldızlı bolero', 'Синее болеро со звёздами']],
            shoes: [['Gümüş topuklu çizme', 'Серебряные сапоги на каблуке'], ['Safir simli bot', 'Сапфировые ботильоны с блёстками'], ['Yıldızlı beyaz sneaker', 'Белые кеды со звёздами'], ['Siyah tokalı bot', 'Чёрные ботинки с пряжками']],
        },
    },
    {
        id: 'pulse', label: ['Parıltı', 'Блеск'], pieces: {
            top: [['Kristal yıldızlı üst', 'Топ с хрустальной звездой'], ['Fuşya saten fiyonk', 'Атласный топ фуксия с бантом'], ['Pembe çizgili yelek', 'Жилет в розовую полоску'], ['Pembe payetli üst', 'Топ с розовыми пайетками']],
            bottom: [['Taşlı cepli şort', 'Шорты с карманами в стразах'], ['Fuşya zincirli şort', 'Шорты фуксия с цепочками'], ['Fiyonklu pileli etek', 'Юбка в складку с бантом'], ['Fuşya çan pantolon', 'Брюки клёш фуксия']],
            jacket: [['Pembe alevli deri', 'Косуха с розовым пламенем'], ['Pembe saten bomber', 'Розовый атласный бомбер'], ['Taş yakalı blazer', 'Блейзер с лацканами в стразах'], ['Pembe tüylü ceket', 'Розовый жакет с перьями']],
            shoes: [['Pembe bağcıklı bot', 'Ботинки с розовыми шнурками'], ['Pembe simli bot', 'Розовые ботильоны с блёстками'], ['Taşlı sneaker', 'Кеды со стразами'], ['Şimşekli gümüş çizme', 'Серебряные сапоги с молниями']],
        },
    },
];
function garments(collection, slot) {
    return collection.pieces[slot].flatMap((label, index) => label === null ? [] : [{
            id: `${collection.id}-${slot}-${index + 1}`, slot, label,
        }]);
}
const wardrobe = collections.flatMap(collection => slots.flatMap(slot => garments(collection, slot)));
const accessories = [
    { id: 'crystal-accessory-belt', slot: 'accessory', label: ['Yıldızlı zincirli kemer', 'Ремень со звёздами и цепочками'] },
    { id: 'crystal-accessory-gloves', slot: 'accessory', label: ['Pembe taşlı eldiven', 'Розовые перчатки со стразами'] },
];
export const studioTotals = {
    outfits: Object.keys(memberNames).length * (looks.length + outfitSets.length),
    pieces: wardrobe.length + accessories.length,
};
function lookupMix(ids) {
    const items = slots.map((slot, index) => wardrobe.find(item => item.slot === slot && item.id === ids[index]));
    if (!items.every(item => item !== undefined))
        return null;
    const extras = ids.slice(slots.length);
    const equipped = accessories.filter(item => extras.includes(item.id));
    return equipped.length === extras.length ? [...items, ...equipped] : null;
}
function parseCard(value) {
    const [kind, ...ids] = value.split(',');
    if (kind === 'mix') {
        const items = lookupMix(ids);
        return items ? { kind, items } : null;
    }
    if (kind === 'set' && ids.length === 2) {
        const member = studioMemberId(ids[0] ?? '');
        const outfit = outfitSets.find(set => set.id === ids[1]);
        if (member && outfit)
            return { kind, member, outfit };
    }
    return null;
}
const copy = (lang, names) => names[lang === 'tr' ? 0 : 1];
export function studioMemberId(name) {
    const normalized = name.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return Object.keys(memberNames).find((key) => normalized === key) ?? null;
}
const storagePrefix = 'encore1.studio.';
const memory = new Map();
const pendingWrites = new Map();
let storageIssue = false;
function read(key) {
    const pending = pendingWrites.get(key);
    if (pending !== undefined)
        return pending;
    try {
        if (typeof localStorage !== 'undefined') {
            const value = localStorage.getItem(storagePrefix + key);
            if (value === null)
                memory.delete(key);
            else
                memory.set(key, value);
            return value;
        }
    }
    catch {
        storageIssue = true;
    }
    return memory.get(key) ?? null;
}
function save(key, value) {
    memory.set(key, value);
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(storagePrefix + key, value);
            pendingWrites.delete(key);
        }
    }
    catch {
        storageIssue = true;
        pendingWrites.set(key, value);
    }
}
function archive() {
    const saved = read('archive');
    return saved ? [...new Set(saved.split('|'))].filter(id => parseCard(id) !== null) : [];
}
function archiveCard(id) {
    const previous = archive();
    if (!previous.includes(id))
        save('archive', [id, ...previous].join('|'));
}
function chosenLook(member, phase) {
    const saved = read(`look.${member}.${phase}`);
    return looks.find(look => look.id === saved && look.phase === phase) ?? null;
}
/** The concert uses the chosen finale portrait, or the chosen rehearsal portrait when there is no finale. */
export function stageLook(memberName, phase) {
    const member = studioMemberId(memberName);
    if (!member)
        return null;
    const selected = phase ? chosenLook(member, phase) : chosenLook(member, 'final') ?? chosenLook(member, 'rehearsal');
    return selected ? `studio/${member}-${selected.id}` : null;
}
export function decodeStudioSelection(member, saved) {
    if (saved) {
        const [kind, id, ...extra] = saved.split(',');
        if (kind === 'look' && id !== undefined && extra.length === 0 && looks.some(look => look.id === id)) {
            return { kind, id };
        }
        const card = parseCard(saved);
        if (card?.kind === 'set' && card.member === member)
            return { kind: 'set', id: card.outfit.id };
        if (card?.kind === 'mix')
            return { kind: 'mix', pieces: card.items.map(item => item.id) };
    }
    return null;
}
export function studioTravelSelection(member) {
    const selected = decodeStudioSelection(member, read(`travel.${member}`));
    if (selected)
        return selected;
    const previous = chosenLook(member, 'final') ?? chosenLook(member, 'rehearsal');
    return previous ? { kind: 'look', id: previous.id } : null;
}
let mode = 'looks';
let phase = 'rehearsal';
let slot = 'top';
let collection = null;
let outfit = outfitSets[0];
const mix = {
    top: 'crystal-top-1', bottom: 'crystal-bottom-1', jacket: 'crystal-jacket-1', shoes: 'crystal-shoes-2',
};
const equippedAccessories = new Set();
const mixIds = () => [...slots.map(key => mix[key]), ...accessories.filter(item => equippedAccessories.has(item.id)).map(item => item.id)];
function isMode(value) {
    return Object.keys(modes).some(key => value === key);
}
function isSlot(value) {
    return pieceTypes.some(key => value === key);
}
function isPhase(value) {
    return value === 'rehearsal' || value === 'final';
}
export function studioAction(action, memberName) {
    if (!action.startsWith('studio-'))
        return false;
    const member = studioMemberId(memberName);
    if (!member)
        return false;
    const [, verb, ...args] = action.split('-');
    const value = args.join('-');
    if (verb === 'mode' && isMode(value)) {
        mode = value;
        return true;
    }
    if (verb === 'phase' && isPhase(value)) {
        phase = value;
        return true;
    }
    if (verb === 'wear') {
        const look = looks.find(entry => (entry.id === value && entry.phase === phase) || `costume-${entry.id}` === value);
        if (look) {
            phase = look.phase;
            save(`look.${member}.${phase}`, look.id);
            save(`travel.${member}`, `look,${look.id}`);
            return true;
        }
    }
    if (verb === 'wear' && value === 'mix' && mode === 'mix') {
        save(`travel.${member}`, ['mix', ...mixIds()].join(','));
        return true;
    }
    if (verb === 'wear' && value === 'set' && mode === 'sets') {
        save(`travel.${member}`, ['set', member, outfit.id].join(','));
        return true;
    }
    if (verb === 'slot' && isSlot(value)) {
        slot = value;
        return true;
    }
    if (verb === 'collection') {
        if (value === 'all') {
            collection = null;
            return true;
        }
        const selected = collections.find(entry => entry.id === value);
        if (!selected)
            return false;
        collection = selected;
        return true;
    }
    if (verb === 'piece' && slot === 'accessory' && accessories.some(item => item.id === value)) {
        if (!equippedAccessories.delete(value))
            equippedAccessories.add(value);
        return true;
    }
    if (verb === 'piece' && slot !== 'accessory' && wardrobe.some(item => item.id === value && item.slot === slot)) {
        mix[slot] = value;
        return true;
    }
    if (verb === 'set') {
        const selected = outfitSets.find(entry => entry.id === value);
        if (!selected)
            return false;
        outfit = selected;
        return true;
    }
    if (verb === 'save' && value === 'mix') {
        archiveCard(['mix', ...mixIds()].join(','));
        return true;
    }
    if (verb === 'save' && value === 'set') {
        archiveCard(['set', member, outfit.id].join(','));
        return true;
    }
    return false;
}
function control(action, label, className, selected) {
    const pressed = selected === undefined ? '' : ` aria-pressed="${selected}"`;
    return `<button type="button" class="${className}" data-act="studio-${action}"${pressed}>${label}</button>`;
}
function picture(asset, alt = '', decorative = true) {
    return `<img src="art/studio/${asset}.webp" alt="${alt}" decoding="async"${decorative ? ' loading="lazy"' : ''}>`;
}
function renderLooks(lang, member) {
    const selected = chosenLook(member, phase);
    const preview = selected ?? looks.find(look => look.phase === phase);
    if (!preview)
        throw new Error('studio phase');
    const title = copy(lang, preview.names[member]);
    const selectionText = selected
        ? copy(lang, ['Seçildi', 'Выбрано'])
        : copy(lang, ['Önizleme', 'Примерка']);
    const phaseGroups = ['rehearsal', 'final'];
    return `<div class="studio-look-rack" role="group" aria-label="${copy(lang, ['Kostüm seç', 'Выбери костюм'])}">
    ${phaseGroups.map(group => `<div class="studio-look-group">
      ${control(`phase-${group}`, copy(lang, phases[group]), 'studio-phase', phase === group)}
      <div class="studio-look-picker">
        ${looks.filter(look => look.phase === group).map(look => control(group === phase ? `wear-${look.id}` : `wear-costume-${look.id}`, picture(`${member}-${look.id}`) + `<span>${copy(lang, look.names[member])}</span>`, 'studio-look-option', chosenLook(member, group)?.id === look.id)).join('')}
      </div>
    </div>`).join('')}
  </div>
  <figure class="studio-portrait">
    ${picture(`${member}-${preview.id}`, `${memberNames[member]} · ${title}`, false)}
    <figcaption><span>${selectionText}</span><strong>${title}</strong></figcaption>
  </figure>`;
}
function mixPictures(lang, items) {
    return `<div class="studio-flatlay">${items.map(item => picture(item.id, copy(lang, item.label))).join('')}</div>`;
}
function saveButton(lang, kind, saved) {
    const label = saved ? ['✓ Albüme kaydedildi', '✓ Сохранено в альбоме'] : ['Albüme kaydet', 'Сохранить в альбом'];
    return `<button type="button" class="studio-save" data-act="studio-save-${kind}"${saved ? ' disabled' : ''}>${copy(lang, label)}</button>`;
}
function travelButton(lang, kind, wearing) {
    const label = wearing ? ['✓ Üzerinde', '✓ Надето'] : ['Kıyafeti giydir', 'Надеть образ'];
    return control(`wear-${kind}`, copy(lang, label), 'studio-save', wearing);
}
function renderMix(lang, member) {
    const ids = mixIds();
    const items = lookupMix(ids);
    if (!items)
        throw new Error('studio mix');
    const selected = collection;
    const options = slot === 'accessory' ? accessories : selected ? garments(selected, slot) : wardrobe.filter(item => item.slot === slot);
    return `<div class="studio-switch studio-slots" role="group" aria-label="${copy(lang, ['Parça türü', 'Тип одежды'])}">
    ${pieceTypes.map(key => control(`slot-${key}`, copy(lang, slotNames[key]), '', slot === key)).join('')}
  </div>
  ${slot === 'accessory' ? '' : `<div class="studio-switch studio-collections" role="group" aria-label="${copy(lang, ['Koleksiyon', 'Коллекция'])}">
    ${control('collection-all', copy(lang, ['Tümü', 'Все']), '', selected === null)}
    ${collections.map(entry => control(`collection-${entry.id}`, copy(lang, entry.label), '', selected?.id === entry.id)).join('')}
  </div>`}
  <figure class="studio-mix-preview">
    ${mixPictures(lang, items)}
    <figcaption>${copy(lang, ['Sofia’nın kombini', 'Образ Софии'])}</figcaption>
  </figure>
  <div class="studio-fit-actions">
    ${travelButton(lang, 'mix', read(`travel.${member}`) === ['mix', ...ids].join(','))}
    ${saveButton(lang, 'mix', archive().includes(['mix', ...ids].join(',')))}
  </div>
  <div class="studio-piece-picker" role="group" aria-label="${copy(lang, slotNames[slot])}">
    ${options.map(item => control(`piece-${item.id}`, picture(item.id) +
        `<span>${copy(lang, item.label)}</span>`, 'studio-piece', ids.includes(item.id))).join('')}
  </div>`;
}
function renderSets(lang, member) {
    const title = copy(lang, outfit.names[member]);
    return `<div class="studio-set-picker" role="group" aria-label="${copy(lang, ['Set seç', 'Выбери комплект'])}">
    ${outfitSets.map(entry => control(`set-${entry.id}`, picture(`${member}-set-${entry.id}`) +
        `<span>${copy(lang, entry.names[member])}</span>`, 'studio-set-option', entry.id === outfit.id)).join('')}
  </div>
  <div class="studio-fit-actions">
    ${travelButton(lang, 'set', read(`travel.${member}`) === ['set', member, outfit.id].join(','))}
    ${saveButton(lang, 'set', archive().includes(['set', member, outfit.id].join(',')))}
  </div>
  <figure class="studio-set-preview">
    ${picture(`${member}-set-${outfit.id}`, `${memberNames[member]} · ${title}`, false)}
    <figcaption>${title}</figcaption>
  </figure>`;
}
function storageNotice(lang) {
    return storageIssue ? `<p class="studio-storage" role="status">${copy(lang, [
        'Tarayıcı kayda izin vermiyor. Seçimlerin bu oturumda durur.',
        'Браузер не разрешает сохранение. Твой выбор сохранится до конца сеанса.',
    ])}</p>` : '';
}
export function renderStudio(lang, memberName, fittingAction = '') {
    const member = studioMemberId(memberName);
    if (!member)
        return `<p role="status">${copy(lang, ['Gardırop için bir üye seç.', 'Выбери участницу для примерки.'])}</p>`;
    const content = mode === 'looks' ? renderLooks(lang, member) : mode === 'mix' ? renderMix(lang, member) : renderSets(lang, member);
    const modeOptions = ['looks', 'sets', 'mix'];
    const totals = {
        looks: [`${looks.length} görünüm`, `${looks.length} образа`],
        sets: [`${outfitSets.length} görünüm`, `${outfitSets.length} образов`],
        mix: [`${studioTotals.pieces} parça`, `${studioTotals.pieces} предмета`],
    };
    return `<section class="studio" aria-label="${copy(lang, ['Gardırop', 'Гардероб'])}">
    <div class="studio-title"><h2>${copy(lang, ['Gardırop', 'Гардероб'])}</h2><span>${memberNames[member]}</span></div>
    <div class="studio-switch studio-modes" role="group" aria-label="${copy(lang, ['Gardırop bölümü', 'Раздел гардероба'])}">
      ${modeOptions.map(key => control(`mode-${key}`, `${copy(lang, modes[key])}<small>${copy(lang, totals[key])}</small>`, '', mode === key)).join('')}
    </div>
    ${content}
    ${storageNotice(lang)}
    ${fittingAction}
    ${control('continue', copy(lang, ['Gardıroptan çık →', 'Выйти из гардероба →']), 'primary studio-continue')}
  </section>`;
}
export function studioAlbum(lang) {
    const cards = archive().flatMap(value => {
        const card = parseCard(value);
        if (!card)
            return [];
        if (card.kind === 'mix') {
            return `<figure class="studio-album-card">${mixPictures(lang, card.items)}<figcaption>${copy(lang, ['Sofia’nın kombini', 'Образ Софии'])}</figcaption></figure>`;
        }
        const title = copy(lang, card.outfit.names[card.member]);
        const name = memberNames[card.member];
        return `<figure class="studio-album-card">${picture(`${card.member}-set-${card.outfit.id}`, `${name} · ${title}`)}<figcaption>${name} · ${title}</figcaption></figure>`;
    });
    const empty = copy(lang, ['Stüdyoda kaydettiğin kombinler burada görünür.', 'Здесь появятся образы, сохранённые в студии.']);
    return `<section class="studio-album"><h3>${copy(lang, ['Kombin albümü', 'Альбом образов'])}</h3>
    ${cards.length ? `<div class="studio-album-grid">${cards.join('')}</div>` : `<p class="studio-album-empty">${empty}</p>`}
    ${storageNotice(lang)}
  </section>`;
}
