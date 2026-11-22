const sticks = {
    heart: { tr: 'Pembe kalp', ru: 'Розовое сердце', color: '#ff78b6' },
    moon: { tr: 'Lila ay', ru: 'Сиреневая луна', color: '#bc91ff' },
    star: { tr: 'Nane yıldızı', ru: 'Мятная звезда', color: '#69eed5' },
};
export function stickId(value) {
    return value === 'heart' || value === 'moon' || value === 'star' ? value : null;
}
export function stickName(id, lang) { return sticks[id][lang]; }
function wand(id) {
    return `<img class="wand-art" src="art/lightsticks/${id}.webp" alt="">`;
}
export function renderMinho(lang, selected) {
    const tr = lang === 'tr';
    const shelves = Object.keys(sticks).map(id => {
        const item = sticks[id];
        return `<button type="button" class="stick-item" data-act="stick-${id}" aria-pressed="${selected === id}" style="--stick:${item.color}"><i class="wand-plinth"></i>${wand(id)}<strong>${item[lang]}</strong><span class="wand-check" aria-hidden="true">✓</span></button>`;
    }).join('');
    return `<section class="minho-shop" aria-labelledby="shop-title">
    <div class="minho-head"><button class="smallbtn" data-act="trip-street">‹ ${tr ? 'Hongdae' : 'Хондэ'}</button></div>
    <div class="minho-interior"><h2 id="shop-title">${tr ? 'Minho’nun K-pop dükkânı' : 'K-pop магазин Минхо'}</h2></div>
    <p class="minho-dialog"><b>${tr ? 'Minho' : 'Минхо'}</b> ${tr ? 'Bir lightstick seç! Şarkı başlayınca ritme dokun, tribünü birlikte aydınlatalım.' : 'Выбери лайтстик! Нажимай в такт песне, и мы вместе зажжём трибуны.'}</p>
    <div class="stick-shelf" role="group" aria-label="${tr ? 'Lightstick seç' : 'Выбери лайтстик'}">${shelves}</div>
    <p class="shop-bag" role="status">${selected ? (tr ? 'Çantanda · ' : 'В рюкзаке · ') + sticks[selected][lang] : tr ? 'Denemek için birine dokun.' : 'Коснись лайтстика, чтобы примерить.'}</p>
    <button class="shop-go" data-act="stick-concert" ${selected ? '' : 'disabled'}>${tr ? 'Konsere götür' : 'Взять на концерт'} →</button>
  </section>`;
}
export function renderHeldStick(id, lang, playing, watching = false) {
    const item = sticks[id];
    const content = `<span class="wand-aura"></span>${wand(id)}<i class="wand-grip" aria-hidden="true"></i>`;
    const model = `class="held-stick" data-held-stick="${id}" style="--stick:${item.color}"`;
    const held = watching ? `<div ${model} aria-hidden="true">${content}</div>` :
        `<button type="button" ${model} data-act="${playing ? 'tap' : 'play'}" aria-label="${item[lang]} · ${lang === 'tr' ? 'Ritimle yak' : 'Зажечь в такт'}">${content}</button>`;
    return `<div class="fan-lights" aria-hidden="true" style="--stick:${item.color}">${'<i></i>'.repeat(12)}</div>${held}`;
}
export function lightBeat(area, beat) {
    // The hit rank advances on each accepted tap, including after a missed beat.
    area.dataset.lightHit = String(beat);
    area.dataset.pulse = beat % 2 === 0 ? 'even' : 'odd';
}
export function renderBlackout(lang) {
    const tr = lang === 'tr';
    return `<section class="encore-blackout" aria-live="polite">
    <div class="dark-arena" aria-hidden="true"><i></i><i></i><i></i></div>
    <h2>${tr ? 'Seul, iyi geceler…' : 'Спокойной ночи, Сеул…'}</h2>
    <p>${tr ? 'Son akor sustu. Sahnede tek bir mikrofon kaldı.' : 'Последний аккорд стих. На сцене остался один микрофон.'}</p></section>`;
}
export function renderArena(id) {
    const rows = Array.from({ length: 5 }, (_, row) => `<div style="--row:${row}">${'<i></i>'.repeat(22)}</div>`).join('');
    return `<div class="encore-arena" aria-hidden="true" style="--stick:${sticks[id].color}">${rows}</div>`;
}
export function secretPhotocard(lang, id, playable = false) {
    const title = lang === 'tr' ? 'Lisa’nın gizli bisi' : 'Секретный бис Лисы';
    const watch = lang === 'tr' ? 'Sahneyi izle' : 'Посмотреть выступление';
    const trigger = playable ? `<button type="button" class="card-film" data-act="watch-fan-${id}" aria-label="${watch} · ${title} · ${sticks[id][lang]}"><span>▶ ${watch}</span></button>` : '';
    return `<figure class="lisa-foil" data-encore-card="${id}" style="--stick:${sticks[id].color}">
    <img src="art/lisa-secret-encore.webp" alt="${lang === 'tr' ? 'Lisa sahnede parmaklarıyla kalp yapıyor' : 'Лиса показывает сердечко со сцены'}">
    <figcaption><b>${title}</b><small>${sticks[id][lang]}</small></figcaption>${trigger}</figure>`;
}
export function renderLightResult(lang, id, score, total) {
    const tr = lang === 'tr';
    return `<section class="stick-finale" style="--stick:${sticks[id].color}">
    ${secretPhotocard(lang, id)}
    <h2>${tr ? 'Bis kartın albümünde!' : 'Карточка с биса уже в альбоме!'}</h2>
    <p class="show-score"><strong>${score} / ${total}</strong> ${tr ? 'ritimde yakış' : 'попаданий в такт'} · ${sticks[id][lang]}</p>
    <button class="shop-go" data-act="fan-album">${tr ? 'Albümümü aç' : 'Открыть мой альбом'}</button>
    <button class="secondary" data-act="stick-concert">${tr ? 'Konseri tekrar oyna' : 'Сыграть концерт ещё раз'}</button>
    <button class="secondary" data-act="back-shop">${tr ? 'Minho’ya dön' : 'Вернуться к Минхо'}</button></section>`;
}
