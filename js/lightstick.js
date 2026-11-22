const sticks = {
    heart: { tr: 'Pembe kalp', ru: 'Розовое сердце', color: '#ff78b6' },
    moon: { tr: 'Lila ay', ru: 'Сиреневая луна', color: '#bc91ff' },
    star: { tr: 'Nane yıldızı', ru: 'Мятная звезда', color: '#69eed5' },
};
export function stickId(value) {
    return value === 'heart' || value === 'moon' || value === 'star' ? value : null;
}
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
export function renderHeldStick(id, lang, playing) {
    const item = sticks[id];
    return `<div class="fan-lights" aria-hidden="true" style="--stick:${item.color}">${'<i></i>'.repeat(12)}</div><button type="button" class="held-stick" data-held-stick="${id}" data-act="${playing ? 'tap' : 'play'}" aria-label="${item[lang]} · ${lang === 'tr' ? 'Ritimle yak' : 'Зажечь в такт'}" style="--stick:${item.color}"><span class="wand-aura"></span>${wand(id)}<i class="wand-grip" aria-hidden="true"></i></button>`;
}
export function lightBeat(area, beat) {
    // The hit rank advances on each accepted tap, including after a missed beat.
    area.dataset.lightHit = String(beat);
    area.dataset.pulse = beat % 2 === 0 ? 'even' : 'odd';
}
export function renderLightResult(lang, id, score, total) {
    const tr = lang === 'tr';
    const message = score === 0 ? (tr ? 'Şarkıyı dinledin. Yeni turda yıldız halkaya gelince dokun.' : 'Ты послушала песню. В следующем туре нажми, когда звезда коснётся кольца.') :
        tr ? 'Senin işaretinle tribünde bir ışık dalgası yükseldi.' : 'По твоему сигналу по трибунам прошла световая волна.';
    return `<section class="stick-finale" style="--stick:${sticks[id].color}"><div class="stadium-finish">${wand(id)}</div>
    <h2>${tr ? 'Konserin son akoru' : 'Последний аккорд'}</h2><p>${message}</p>
    <p class="show-score"><strong>${score} / ${total}</strong> ${tr ? 'ritimde yakış' : 'попаданий в такт'} · ${sticks[id][lang]}</p>
    <button class="shop-go" data-act="stick-concert">${tr ? 'Şarkıyı tekrar çal' : 'Сыграть ещё раз'}</button>
    <button class="secondary" data-act="back-shop">${tr ? 'Minho’ya dön' : 'Вернуться к Минхо'}</button>
    <button class="secondary" data-act="trip-street">${tr ? 'Hongdae’ye dön' : 'Вернуться в Хондэ'}</button></section>`;
}
