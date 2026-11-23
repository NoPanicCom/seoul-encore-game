import { couponLabel, isShopStick, merchButtons, stickName } from './lightstick.js';
import { passes } from './story.js';
const phrase = (tr, ru) => ({ tr, ru });
const poses = ['groove', 'jump', 'heart'];
const poseNames = {
    groove: phrase('Dans adımı', 'Танцевальный шаг'),
    jump: phrase('Zıplama', 'Прыжок'),
    heart: phrase('Kalp pozu', 'Сердечко')
};
const greetings = {
    first: phrase('Hoş geldin! Ben Minho. Biletindeki oyun kuponuyla rafımdan bir ışık çubuğu seçebilirsin.', 'Привет! Я Минхо. По игровому купону из билета можешь выбрать лайтстик с моей полки.'),
    repeat: phrase('Yeniden hoş geldin! Aldığın ışık çubuğu çantanda. İstersen başka bir modeli dene.', 'С возвращением! Твой лайтстик в рюкзаке. Если хочешь, примерь другую модель.'),
    'next-day': phrase('Yine karşılaştık! Yeni gün için rafı hazırladım, seçtiğin model de hâlâ çantanda.', 'Снова встретились! Я подготовил полку к новому дню, а выбранный лайтстик всё ещё в рюкзаке.')
};
const noStickGreetings = {
    repeat: phrase('Yeniden hoş geldin! İstersen raftaki modelleri birlikte inceleyelim.', 'С возвращением! Если хочешь, давай посмотрим на модели вместе.'),
    'next-day': phrase('Bugün de uğramana sevindim! Yeni gün için rafı hazırladım. Dilersen bir modele yakından bak.', 'Рад, что ты заглянула и сегодня! Я подготовил полку к новому дню. Можешь рассмотреть любой лайтстик.')
};
const archiveKey = 'encore1.chapter-hongdae.album';
const runKey = (role) => `encore1.chapter-hongdae.run.${role}`;
const runs = new Map();
const album = new Map();
let storageBlocked = false;
function validRole(value) { return /^[a-z][a-z0-9-]{0,27}$/.test(value); }
function validOutfit(value) { return value.length <= 96 && /^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(value); }
function isPose(value) { return poses.some(pose => pose === value); }
function isDay(value) { return value === 0 || value === 1 || value === 2; }
function read(key) {
    try {
        return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
    }
    catch {
        storageBlocked = true;
        return null;
    }
}
function write(key, value) {
    try {
        if (typeof localStorage === 'undefined')
            return;
        localStorage.setItem(key, value);
    }
    catch {
        storageBlocked = true;
    }
}
function decodeRun(raw) {
    if (!raw || raw.length > 400)
        return null;
    const fields = raw.split('|');
    const [version, day, found, frames, picked, saved] = fields;
    if (fields.length !== 6 || version !== '1' || day === undefined || frames === undefined || picked === undefined)
        return null;
    const minhoDay = Number(day);
    if ((day !== '' && (!/^[012]$/.test(day) || !isDay(minhoDay))) || (found !== '0' && found !== '1') || (saved !== '0' && saved !== '1'))
        return null;
    const shots = frames === '' ? [] : frames.split(',');
    if (shots.length > poses.length || shots.some(shot => !validOutfit(shot)) || found === '0' && shots.length > 0)
        return null;
    if (picked !== '' && (!isPose(picked) || shots.length !== poses.length) || saved === '1' && picked === '')
        return null;
    return { minhoDay: day !== '' && isDay(minhoDay) ? minhoDay : null, found: found === '1', shots,
        picked: isPose(picked) ? picked : null, saved: saved === '1' };
}
function runFor(role) {
    const current = runs.get(role);
    if (current)
        return current;
    const fresh = decodeRun(read(runKey(role))) ?? { minhoDay: null, found: false, shots: [], picked: null, saved: false };
    runs.set(role, fresh);
    return fresh;
}
function saveRun(role, run) {
    write(runKey(role), ['1', run.minhoDay ?? '', Number(run.found), run.shots.join(','), run.picked ?? '', Number(run.saved)].join('|'));
}
export function resetChapterHongdae(role = 'sofia') {
    if (!validRole(role))
        return;
    const fresh = { minhoDay: runFor(role).minhoDay, found: false, shots: [], picked: null, saved: false };
    runs.set(role, fresh);
    saveRun(role, fresh);
}
export function chapterHongdaeProgress(role = 'sofia') {
    const run = runFor(role);
    return { found: run.found, photos: run.shots.length, saved: run.saved, metMinho: run.minhoDay !== null };
}
function photos() {
    const stored = read(archiveKey);
    if (!stored)
        return album;
    const [version, ...entries] = stored.split('|');
    if (version !== '1')
        return album;
    for (const entry of entries) {
        const fields = entry.split(',');
        const [role, pose, outfit] = fields;
        if (fields.length === 3 && role && validRole(role) && pose && isPose(pose) && outfit && validOutfit(outfit)) {
            album.set(entry, { role, pose, outfit });
        }
    }
    return album;
}
function albumPhoto(photo) {
    const all = photos();
    const entry = [photo.role, photo.pose, photo.outfit].join(',');
    all.set(entry, photo);
    write(archiveKey, ['1', ...all.keys()].join('|'));
}
function picture(pose, outfit) {
    const sprite = outfit === 'walk/sofia' ? 'sofia' : outfit.startsWith('walk/cast-') || /^world\/(jisoo|jennie|rose|lisa)$/.test(outfit) ? 'cast' : 'outfit';
    return `<span class="chapter-hongdae-picture" data-chapter-frame="${pose}" aria-hidden="true">
    <span class="chapter-hongdae-actor" data-chapter-sprite="${sprite}" style="background-image:url('art/${outfit}.webp')"></span>
    <span class="chapter-hongdae-pixel"></span>
  </span>`;
}
function printPhoto(photo, lang) {
    const pass = Object.prototype.hasOwnProperty.call(passes, photo.role) ? passes[photo.role] : undefined;
    const actor = photo.role === 'sofia' ? phrase('Sofia', 'София')[lang] : pass?.name;
    const title = actor ? phrase(`${actor} ve Pixel`, `${actor} и Пиксель`)[lang] : phrase('Pixel ile bir kare', 'Кадр с Пикселем')[lang];
    return `<figure class="chapter-hongdae-keepsake">
    ${picture(photo.pose, photo.outfit)}
    <figcaption><strong>${title}</strong><span>${poseNames[photo.pose][lang]} · Hongdae</span></figcaption>
  </figure>`;
}
export function chapterHongdaeAlbum(lang) {
    const saved = Array.from(photos().values());
    return saved.length ? `<section class="chapter-hongdae-album"><h3>${phrase('Hongdae fotokabini', 'Фотобудка в Хондэ')[lang]}</h3>
    <div>${saved.map(photo => printPhoto(photo, lang)).join('')}</div></section>` : '';
}
const controls = {
    close: phrase('Kapat', 'Закрыть'),
    curtain: phrase('Perdeyi arala', 'Приоткрыть шторку'),
    shutter: phrase('Deklanşöre bas', 'Сделать снимок'),
    save: phrase('Albümde sakla', 'Сохранить в альбом')
};
function button(control, lang, disabled = false) {
    return `<button type="button" class="chapter-hongdae-button" data-chapter-hongdae="${control}"${disabled ? ' disabled' : ''}>${controls[control][lang]}</button>`;
}
function pixelContent(lang, role, outfit, run) {
    if (!run.found)
        return `<div class="chapter-hongdae-curtain">
      ${button('curtain', lang)}
    </div>
    <p>${phrase('Pixel bir anda gözden kayboldu. Fotokabinin perdesi kıpırdıyor.', 'Пиксель вдруг исчез. Шторка фотобудки шевелится.')[lang]}</p>`;
    const nextPose = poses[run.shots.length];
    if (nextPose)
        return `<div class="chapter-hongdae-preview">${picture(nextPose, outfit)}</div>
    <p>${run.shots.length === 0 ? phrase('Pixel buradaymış! Üç farklı pozda birlikte fotoğraf çekin.', 'Вот где был Пиксель! Сделайте три снимка в разных позах.')[lang] : ''}</p>
    <p class="chapter-hongdae-progress"><strong>${poseNames[nextPose][lang]}</strong><span>${run.shots.length} / ${poses.length}</span></p>
    ${button('shutter', lang)}`;
    const savedOutfit = run.picked ? run.shots[poses.indexOf(run.picked)] : undefined;
    if (run.saved && run.picked && savedOutfit) {
        return `${printPhoto({ role, pose: run.picked, outfit: savedOutfit }, lang)}
      <p role="status">${phrase('Seçtiğin kare artık albümünde.', 'Выбранный снимок уже в альбоме.')[lang]}</p>`;
    }
    const gallery = poses.map((pose, index) => {
        const frameOutfit = run.shots[index];
        if (!frameOutfit)
            return '';
        return `<button type="button" class="chapter-hongdae-frame" data-chapter-hongdae-pose="${pose}" aria-pressed="${run.picked === pose}">
      ${picture(pose, frameOutfit)}<strong>${poseNames[pose][lang]}</strong></button>`;
    }).join('');
    return `<p>${phrase('Albümde saklamak istediğin kareyi seç.', 'Выбери, какой снимок оставить в альбоме.')[lang]}</p>
    <div class="chapter-hongdae-frames">${gallery}</div>
    ${button('save', lang, run.picked === null)}`;
}
function minhoContent(lang, greeting, chosen, owned) {
    const dialogue = greeting === 'first' || chosen ? greetings[greeting] : noStickGreetings[greeting];
    return `<div class="chapter-hongdae-shop-image"><img src="art/crew/minho.webp" alt="" width="310" height="304"></div>
    <p class="chapter-hongdae-dialogue" data-chapter-minho-greeting="${greeting}">${dialogue[lang]}</p>
    <p class="coupon-count">${couponLabel(lang, owned)}</p>
    <div class="stick-shelf" role="group" aria-label="${phrase('Işık çubuğu seç', 'Выбери лайтстик')[lang]}">${merchButtons(lang, chosen, owned, true)}</div>
    ${chosen ? `<p class="chapter-hongdae-progress"><strong>${phrase('Çantanda', 'В рюкзаке')[lang]}</strong><span>${stickName(chosen, lang)}</span></p>` : ''}`;
}
export function mountChapterHongdae(panel, options) {
    const { lang, days, outfit, activity } = options;
    const role = options.role ?? 'sofia';
    if (!validRole(role) || !validOutfit(outfit))
        throw new Error('Invalid Hongdae chapter profile');
    const run = runFor(role);
    const greeting = run.minhoDay === null ? 'first' : run.minhoDay === days ? 'repeat' : 'next-day';
    if (activity === 'minho' && isDay(days) && run.minhoDay !== days) {
        run.minhoDay = days;
        saveRun(role, run);
    }
    let chosen = options.chosen;
    const owned = new Set(options.owned);
    const view = document.createElement('section');
    view.className = 'chapter-hongdae';
    view.setAttribute('aria-labelledby', 'chapter-hongdae-heading');
    panel.classList.add('chapter-hongdae-panel');
    panel.replaceChildren(view);
    const listeners = new AbortController();
    let notice = '';
    function render(focusSelector) {
        const title = activity === 'pixel' ? phrase('Pixel’in fotokabini', 'Фотобудка Пикселя') : phrase('Minho’nun dükkânı', 'Магазин Минхо');
        view.innerHTML = `<div class="chapter-hongdae-head"><h3 id="chapter-hongdae-heading" tabindex="-1">${title[lang]}</h3>${button('close', lang)}</div>
      <div class="chapter-hongdae-body">${activity === 'pixel' ? pixelContent(lang, role, outfit, run) : minhoContent(lang, greeting, chosen, owned)}
      <p class="chapter-hongdae-notice" role="status">${notice}</p>
      ${storageBlocked ? `<p class="chapter-hongdae-notice">${phrase('Tarayıcı bu oturumdaki değişiklikleri kalıcı kaydedemiyor.', 'Браузер не может сохранить изменения этого сеанса.')[lang]}</p>` : ''}</div>`;
        const focus = view.querySelector(focusSelector) ?? view.querySelector('h3');
        focus?.focus({ preventScroll: true });
    }
    function cleanup() {
        listeners.abort();
        view.remove();
        panel.classList.remove('chapter-hongdae-panel');
    }
    view.addEventListener('click', event => {
        const control = event.target instanceof Element ? event.target.closest('button') : null;
        if (!control || control.disabled)
            return;
        const action = control.dataset.chapterHongdae;
        event.stopPropagation();
        if (action === 'close') {
            cleanup();
            options.close();
            return;
        }
        const item = control.dataset.equip;
        if (activity === 'minho' && item && isShopStick(item)) {
            options.equip(item);
            chosen = item;
            owned.add(item);
            notice = `${phrase('Çantana yerleşti', 'В рюкзаке')[lang]} · ${stickName(item, lang)}`;
            render(`[data-equip="${item}"]`);
            return;
        }
        if (activity !== 'pixel')
            return;
        let nextFocus = 'h3';
        if (action === 'curtain' && !run.found) {
            run.found = true;
            notice = phrase('Pixel bulundu!', 'Пиксель нашёлся!')[lang];
            nextFocus = '[data-chapter-hongdae="shutter"]';
        }
        else if (action === 'shutter' && run.found && run.shots.length < poses.length) {
            run.shots.push(outfit);
            notice = `${phrase('Fotoğraf çekildi', 'Снимок сделан')[lang]} · ${run.shots.length} / ${poses.length}`;
            nextFocus = run.shots.length === poses.length ? '[data-chapter-hongdae-pose]' : '[data-chapter-hongdae="shutter"]';
        }
        else if (action === 'save' && run.picked && !run.saved) {
            const pickedOutfit = run.shots[poses.indexOf(run.picked)];
            if (!pickedOutfit)
                return;
            albumPhoto({ role, pose: run.picked, outfit: pickedOutfit });
            run.saved = true;
            notice = '';
            nextFocus = '[data-chapter-hongdae="close"]';
        }
        else {
            const pose = control.dataset.chapterHongdaePose;
            if (!pose || !isPose(pose) || run.shots.length !== poses.length || run.saved)
                return;
            run.picked = pose;
            nextFocus = `[data-chapter-hongdae-pose="${pose}"]`;
        }
        saveRun(role, run);
        render(nextFocus);
    }, { signal: listeners.signal });
    render('h3');
    return cleanup;
}
