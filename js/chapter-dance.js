const prefix = 'chapter-dance-';
const artists = ['jisoo', 'jennie', 'rose', 'lisa'];
const companions = ['nari', ...artists, 'quartet'];
const lesson = ['side', 'jump'];
const finals = ['heart', 'spin', 'step'];
const moves = [...lesson, ...finals];
const poses = ['heart', 'jump', 'wave'];
const moments = ['bow', 'applause', 'confetti'];
const phases = ['lesson', 'choose', 'ready', 'live', 'photo', 'complete'];
const baseLook = { outfit: 'sofia', light: 'pink' };
export function createChapterDance() {
    return {
        phase: 'lesson', taught: 0, watching: true, finalMove: null, step: 0,
        shown: null, mistake: false, companion: 'nari', pose: 'heart', moment: 'bow',
        photoStartedAt: null, look: null, snapshot: null,
    };
}
function oneOf(item, choices) {
    return choices.some(choice => choice === item);
}
function isRecord(raw) {
    return typeof raw === 'object' && raw !== null && !Array.isArray(raw);
}
function isAsset(value) {
    return typeof value === 'string' && /^(?:art\/)?(?:[a-z0-9-]+\/)+[a-z0-9-]+(?:\.webp)?$/.test(value);
}
function asset(value) {
    const relative = value.startsWith('art/') ? value : 'art/' + value;
    return relative.endsWith('.webp') ? relative : relative + '.webp';
}
function validLook(raw) {
    return isRecord(raw) && (raw.outfit === 'sofia' || isAsset(raw.outfit)) &&
        typeof raw.light === 'string' && /^(?:[a-z0-9-]{1,32}|#[0-9a-f]{6})$/i.test(raw.light) &&
        (raw.wandColor === undefined || raw.wandColor === null || (typeof raw.wandColor === 'string' && /^#[0-9a-f]{6}$/i.test(raw.wandColor))) &&
        (raw.playerName === undefined || (typeof raw.playerName === 'string' && raw.playerName.trim().length > 0 && raw.playerName.length <= 48)) &&
        (raw.pieces === undefined || (Array.isArray(raw.pieces) && raw.pieces.length <= 12 && raw.pieces.every(isAsset)));
}
function copyLook(look) {
    return { outfit: look.outfit, light: look.light,
        ...(look.wandColor !== undefined ? { wandColor: look.wandColor } : {}),
        ...(look.pieces ? { pieces: [...look.pieces] } : {}),
        ...(look.playerName ? { playerName: look.playerName.trim() } : {}) };
}
export function isChapterDanceSnapshot(raw) {
    if (!isRecord(raw) || !validLook(raw))
        return false;
    const { choreography, companion, pose, moment, exposure } = raw;
    return Array.isArray(choreography) && choreography.length === 3 &&
        choreography[0] === 'side' && choreography[1] === 'jump' && oneOf(choreography[2], finals) &&
        oneOf(companion, companions) && oneOf(pose, poses) && oneOf(moment, moments) && oneOf(exposure, [0, 1, 2]);
}
export function restoreChapterDance(raw, now = performance.now()) {
    const initial = createChapterDance();
    if (!isRecord(raw))
        return initial;
    const { phase, taught, watching, finalMove, step, shown, mistake, companion, pose, moment, look, snapshot } = raw;
    if (!oneOf(phase, phases) || !oneOf(taught, [0, 1, 2]) || !oneOf(step, [0, 1, 2, 3]) ||
        typeof watching !== 'boolean' || typeof mistake !== 'boolean' ||
        (shown !== null && !oneOf(shown, moves)) || (finalMove !== null && !oneOf(finalMove, finals)) ||
        !oneOf(companion, companions) || !oneOf(pose, poses) || !oneOf(moment, moments))
        return initial;
    if (phase === 'lesson' && taught === 2)
        return initial;
    if (phase !== 'lesson' && taught !== 2)
        return initial;
    if ((phase === 'lesson' || phase === 'choose' || phase === 'ready') && (look !== null || step !== 0))
        return initial;
    if (phase !== 'lesson' && phase !== 'choose' && finalMove === null)
        return initial;
    if ((phase === 'live' || phase === 'photo' || phase === 'complete') && !validLook(look))
        return initial;
    if ((phase === 'photo' || phase === 'complete') && step !== 3)
        return initial;
    if (phase === 'complete') {
        if (!isChapterDanceSnapshot(snapshot) || snapshot.choreography[2] !== finalMove)
            return initial;
        const picture = { ...copyLook(snapshot),
            choreography: choreography(finalMove), companion: snapshot.companion, pose: snapshot.pose,
            moment: snapshot.moment, exposure: snapshot.exposure };
        return { phase, taught, watching, finalMove, step, shown, mistake,
            companion: picture.companion, pose: picture.pose, moment: picture.moment,
            photoStartedAt: null, look: copyLook(picture), snapshot: picture };
    }
    if (snapshot !== null)
        return initial;
    return { phase, taught, watching, finalMove, step, shown, mistake, companion, pose, moment,
        photoStartedAt: phase === 'photo' ? now : null,
        look: validLook(look) ? copyLook(look) : null, snapshot: null };
}
function choreography(finalMove) {
    return [...lesson, finalMove];
}
const lightBeat = 800;
function photoElapsed(state, now) {
    return Math.max(0, now - (state.photoStartedAt ?? now)) % (lightBeat * 3);
}
function captureExposure(elapsed) {
    return elapsed < lightBeat ? 0 : elapsed < lightBeat * 2 ? 1 : 2;
}
export function handleChapterDanceAction(state, action, look = baseLook, now = performance.now()) {
    if (!action.startsWith(prefix))
        return false;
    const event = action.slice(prefix.length);
    if (state.phase === 'lesson') {
        const expected = state.taught === 2 ? undefined : lesson[state.taught];
        if (event === 'try' || event === 'watch') {
            state.watching = event === 'watch';
            state.mistake = false;
            state.shown = null;
            return true;
        }
        const move = event.startsWith('move-') ? event.slice(5) : '';
        if (state.watching || !expected || !oneOf(move, lesson))
            return false;
        state.shown = move;
        state.mistake = move !== expected;
        if (!state.mistake) {
            state.watching = true;
            state.taught = state.taught === 0 ? 1 : 2;
            if (state.taught === 2)
                state.phase = 'choose';
        }
        return true;
    }
    if (state.phase === 'choose') {
        if (event === 'lock' && state.finalMove) {
            state.phase = 'ready';
            return true;
        }
        const finalMove = event.startsWith('finish-') ? event.slice(7) : '';
        if (!oneOf(finalMove, finals))
            return false;
        state.finalMove = finalMove;
        state.shown = finalMove;
        return true;
    }
    if (state.phase === 'ready' && event === 'start') {
        state.phase = 'live';
        state.shown = null;
        state.look = copyLook(validLook(look) ? look : baseLook);
        return true;
    }
    const { finalMove } = state;
    if (!finalMove)
        return false;
    if (state.phase === 'live') {
        if (event === 'bow' && state.step === 3) {
            state.phase = 'photo';
            state.mistake = false;
            state.photoStartedAt = now;
            return true;
        }
        const move = event.startsWith('move-') ? event.slice(5) : '';
        const sequence = choreography(finalMove);
        const expected = state.step === 3 ? undefined : sequence[state.step];
        if (!expected || !oneOf(move, sequence))
            return false;
        state.shown = move;
        state.mistake = move !== expected;
        if (!state.mistake)
            state.step = state.step === 0 ? 1 : state.step === 1 ? 2 : 3;
        return true;
    }
    if (state.phase !== 'photo' || !state.look)
        return false;
    const [kind, choice] = event.split('-');
    if (kind === 'pose' && oneOf(choice, poses))
        state.pose = choice;
    else if (kind === 'with' && oneOf(choice, companions))
        state.companion = choice;
    else if (kind === 'moment' && oneOf(choice, moments))
        state.moment = choice;
    else if (event === 'shutter') {
        state.snapshot = { ...copyLook(state.look), choreography: choreography(finalMove),
            companion: state.companion, pose: state.pose, moment: state.moment,
            exposure: captureExposure(photoElapsed(state, now)) };
        state.photoStartedAt = null;
        state.phase = 'complete';
    }
    else
        return false;
    return true;
}
const action = (id, label, css, attributes = '') => `<button type="button" class="${css}" data-act="${prefix}${id}" ${attributes}>${label}</button>`;
const labels = {
    ru: {
        lesson: 'Репетиция с Нари', choose: 'Твоё финальное движение', ready: 'Танец готов',
        live: 'Первый выход на сцену', photo: 'Кадр после концерта', complete: 'Фотокарточка в альбоме',
        rehearsal: 'ТАНЦЗАЛ', stage: 'СЦЕНА', camera: 'ФОТОКАМЕРА', ask: 'Нари показывает', try: 'Моя очередь',
        echo: 'Повтори движение Нари.', retry: 'Ещё раз!', replay: 'Покажи ещё раз',
        pick: 'Примерь движение, затем добавь его в танец.', lock: 'Запомнить хореографию',
        prepared: 'Нари встретит тебя у сцены.', cue: 'Следующее движение',
        finish: 'У нас получилось! Зал аплодирует.', bow: 'Поклониться', photocall: 'Выбери позу и компанию, затем поймай луч на фото.',
        pose: 'Поза', companion: 'Кто в кадре', moment: 'Момент', shutter: 'Сделать фото',
        card: 'Первый концерт', sofiaCard: 'Первый концерт Софии', sofia: 'София', nari: 'Нари',
        moves: { side: 'Шаг в сторону', jump: 'Прыжок', heart: 'Сердечко', spin: 'Поворот', step: 'Подиумный шаг' },
        poses: { heart: 'Сердечко', jump: 'Прыжок', wave: 'Привет' },
        moments: { bow: 'Поклон', applause: 'Аплодисменты', confetti: 'Конфетти' },
    },
    tr: {
        lesson: 'Nari ile prova', choose: 'Final hareketin', ready: 'Dans hazır',
        live: 'İlk sahnen', photo: 'Konserden bir kare', complete: 'Fotoğraf kartı albümde',
        rehearsal: 'DANS SALONU', stage: 'SAHNE', camera: 'KAMERA', ask: 'Nari gösteriyor', try: 'Sıra bende',
        echo: 'Nari’nin hareketini tekrarla.', retry: 'Bir daha dene!', replay: 'Tekrar göster',
        pick: 'Hareketleri dene ve birini dansına ekle.', lock: 'Koreografiyi kaydet',
        prepared: 'Nari seni sahne girişinde bekliyor.', cue: 'Sıradaki hareket',
        finish: 'Başardık! Salon alkışlıyor.', bow: 'Selam ver', photocall: 'Pozu ve eşlikçiyi seç, sonra spot ışığını yakala.',
        pose: 'Poz', companion: 'Kadrajdakiler', moment: 'Çekim anı', shutter: 'Fotoğraf çek',
        card: 'İlk konser', sofiaCard: 'Sofia’nın ilk konseri', sofia: 'Sofia', nari: 'Nari',
        moves: { side: 'Yana adım', jump: 'Sıçra', heart: 'Kalp', spin: 'Dönüş', step: 'Podyum adımı' },
        poses: { heart: 'Kalp', jump: 'Sıçra', wave: 'El salla' },
        moments: { bow: 'Selam', applause: 'Alkış', confetti: 'Konfeti' },
    },
};
const moveIcon = { side: '↔', jump: '↑', heart: '♡', spin: '↻', step: '↗' };
const poseIcon = { heart: '♡', jump: '↑', wave: '✧' };
const names = { jisoo: 'Jisoo', jennie: 'Jennie', rose: 'Rosé', lisa: 'Lisa' };
const roleNames = {
    ari: ['Ari', 'Ари'], mina: ['Mina', 'Мина'], yuna: ['Yuna', 'Юна'], soyeon: ['Soyeon', 'Соён'],
    light: ['Işıkçı', 'Осветитель'], manager: ['Menajer', 'Менеджер'], director: ['Yönetmen', 'Режиссёр'],
    choreo: ['Koreograf', 'Хореограф'], photo: ['Fotoğrafçı', 'Фотограф'], sound: ['Sesçi', 'Звукорежиссёр'],
};
const lightPalette = {
    pink: '#ff8ccd', rose: '#ff649f', purple: '#bc96ff', violet: '#bc96ff', lavender: '#c39fff',
    blue: '#91bcff', gold: '#ffd288', amber: '#ffc56f', pearl: '#fff1eb', white: '#fff5e5',
    mint: '#9defd2', stars: '#fff4b5', 'rose-stars': '#fff4b5',
    '0': '#ff8ccd', '1': '#bc96ff', '2': '#ffd288',
};
function lightColor(light) {
    if (/^#[a-f0-9]{6}$/i.test(light))
        return light;
    const key = light.toLowerCase();
    return Object.prototype.hasOwnProperty.call(lightPalette, key) ? lightPalette[key] : lightPalette.pink;
}
function name(person, lang) {
    if (person === 'nari' || person === 'sofia')
        return labels[lang][person];
    return person === 'quartet' ? 'BLACKPINK' : names[person];
}
function playerName(look, lang) {
    if (look.playerName)
        return look.playerName;
    const file = look.outfit.split('/').pop()?.replace(/\.webp$/, '') ?? look.outfit;
    const artist = artists.find(id => file === id || file.startsWith(id + '-') || file === 'hero-' + id);
    if (artist)
        return names[artist];
    const role = file.startsWith('cast-') ? file.slice(5) : '';
    return roleNames[role]?.[lang === 'tr' ? 0 : 1] ?? labels[lang].sofia;
}
function escapeCaption(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function dancer(person, pose, lang, look) {
    const dressed = person === 'sofia' && look && look.outfit !== 'sofia' && isAsset(look.outfit) ? look : null;
    const sheet = dressed && /^(?:art\/)?walk\/cast-/.test(dressed.outfit) ? asset(dressed.outfit) : null;
    const costume = dressed && !sheet
        ? `<span class="cd-costume">${[dressed.outfit, ...(dressed.pieces ?? [])].filter(isAsset)
            .map(src => `<img src="${asset(src)}" alt="">`).join('')}</span>` : '';
    const caption = person === 'sofia' && look ? playerName(look, lang) : name(person, lang);
    return `<figure class="cd-dancer" data-dancer="${person}" data-cd-move="${pose}">
    <i class="cd-body${costume ? ' cd-custom' : ''}${sheet ? ' cd-cast-look' : ''}" ${sheet ? `style="--cd-guise:url('${sheet}')"` : ''} aria-hidden="true">${costume}</i>
    <figcaption>${escapeCaption(caption)}</figcaption></figure>`;
}
function cast(people, pose, lang) {
    return `<div class="cd-cast">${people.map(person => dancer(person, pose, lang)).join('')}</div>`;
}
const glitter = '<div class="cd-confetti" aria-hidden="true">' +
    Array.from({ length: 14 }, (_, i) => `<i style="--cx:${8 + i * 37 % 83}%;--cy:${5 + i * 17 % 73}%;--cr:${i * 49}deg"></i>`).join('') +
    '</div>';
function photoFrame(snapshot, lang, light) {
    const { companion, pose, moment } = snapshot;
    const people = companion === 'quartet' ? artists : companion === 'nari' ? [] : [companion];
    const exposure = 'fixed' in light ? light.fixed : 'live';
    const delay = 'elapsed' in light ? `--cd-exposure-delay:${-light.elapsed}ms` : '';
    return `<div class="cd-floor cd-stage cd-viewfinder" data-photo-moment="${moment}" data-photo-with="${companion}" data-photo-pose="${pose}" style="--cd-light:${lightColor(snapshot.light)}">
    <i class="cd-light" aria-hidden="true"></i><i class="cd-exposure" data-exposure="${exposure}" style="${delay}" aria-hidden="true"></i>${moment === 'confetti' ? glitter : ''}
    ${cast(people, pose, lang)}
    <div class="cd-pair">${dancer('sofia', pose, lang, snapshot)}${companion === 'nari' ? dancer('nari', pose, lang) : ''}</div>
    <span class="cd-focus" aria-hidden="true"></span>
  </div>`;
}
export function renderChapterDanceCard(snapshot, lang = 'ru') {
    const copy = labels[lang];
    const player = playerName(snapshot, lang);
    return `<figure class="chapter-dance-card" data-dance-card="${snapshot.moment}">
    ${photoFrame(snapshot, lang, { fixed: snapshot.exposure })}
    <figcaption><span><strong>${player === copy.sofia ? copy.sofiaCard : copy.card}</strong><small>${escapeCaption(player)} × ${name(snapshot.companion, lang)} · ${copy.moments[snapshot.moment]}</small></span>
    <span class="cd-card-moves" aria-label="${snapshot.choreography.map(move => copy.moves[move]).join(', ')}">${snapshot.choreography.map(move => moveIcon[move]).join(' ')}</span></figcaption>
  </figure>`;
}
function timeline(finalMove, completed, lang) {
    const sequence = [...lesson, finalMove];
    const copy = labels[lang];
    return `<ol class="cd-timeline" aria-label="${lang === 'tr' ? 'Koreografi' : 'Хореография'}">${sequence.map((move, index) => `<li data-cleared="${index < completed}" ${index === completed ? 'aria-current="step"' : ''}><small>${index + 1}</small><b aria-hidden="true">${move ? moveIcon[move] : '?'}</b><span>${move ? copy.moves[move] : (lang === 'tr' ? 'Final' : 'Финал')}</span></li>`).join('')}</ol>`;
}
function moveButtons(kind, available, copy, selected) {
    return `<div class="cd-choices">${available.map(move => action(kind + '-' + move, `<b aria-hidden="true">${moveIcon[move]}</b><span>${copy.moves[move]}</span>`, 'cd-key', kind === 'finish' ? `aria-pressed="${move === selected}"` : '')).join('')}</div>`;
}
function rehearsal(state, lang, look) {
    const copy = labels[lang];
    const expected = state.taught === 2 ? undefined : lesson[state.taught];
    const nariPose = state.watching && expected ? expected : 'idle';
    const sofiaPose = state.shown ?? 'idle';
    const room = `<div class="cd-floor cd-room"><i class="cd-light" aria-hidden="true"></i>
    <div class="cd-pair">${dancer('nari', nariPose, lang)}${dancer('sofia', sofiaPose, lang, look)}</div>
    ${state.watching && expected ? `<span class="cd-demo" aria-hidden="true">${moveIcon[expected]}</span>` : ''}
  </div>`;
    let controls = '';
    if (state.phase === 'lesson' && expected) {
        const prompt = state.watching ? `${copy.ask} · ${copy.moves[expected]}`
            : state.mistake ? copy.retry : copy.echo;
        controls = `<p class="cd-cue" role="status">${prompt}</p>${state.watching
            ? action('try', copy.try, 'cd-action')
            : moveButtons('move', lesson, copy) + action('watch', copy.replay, 'cd-subtle')}`;
    }
    else if (state.phase === 'choose') {
        controls = `<p class="cd-cue" role="status">${state.finalMove ? copy.moves[state.finalMove] : copy.pick}</p>
      ${moveButtons('finish', finals, copy, state.finalMove)}
      ${action('lock', copy.lock, 'cd-action', state.finalMove ? '' : 'disabled')}`;
    }
    else {
        controls = `<p class="cd-cue" role="status">${copy.prepared}</p>`;
    }
    return `${room}<div class="cd-controls">${timeline(state.finalMove, state.taught, lang)}${controls}</div>`;
}
function duetStage(look, lang, show, sync, finale, badge, crowd = '') {
    return `<div class="cd-floor cd-stage" style="--cd-light:${lightColor(look.light)}">
    <i class="cd-light" aria-hidden="true"></i>${cast(artists, sync, lang)}
    <div class="cd-pair">${dancer('nari', sync, lang)}${dancer('sofia', show, lang, look)}</div>
     ${finale ? glitter : ''}<span class="cd-live-chip"><i></i> ${badge}</span>${crowd}
  </div>`;
}
function live(state, lang, look) {
    if (!state.finalMove)
        return '';
    const copy = labels[lang];
    const sequence = choreography(state.finalMove);
    const next = state.step === 3 ? undefined : sequence[state.step];
    const show = state.shown ?? 'idle';
    const sync = state.mistake ? 'idle' : show;
    const prompt = next ? `${state.mistake ? copy.retry : copy.cue} · ${copy.moves[next]}` : copy.finish;
    return duetStage(look, lang, show, sync, !next, 'LIVE') + `<div class="cd-controls">${timeline(state.finalMove, state.step, lang)}
    <p class="cd-cue" role="status">${prompt}</p>${next ? moveButtons('move', sequence, copy) : action('bow', copy.bow, 'cd-action')}
  </div>`;
}
export function renderChapterReplayFrame(card, lang, index) {
    const move = card.choreography[index];
    if (!move)
        throw new RangeError('Invalid choreography step');
    // Older cards saved the lighting of the stage before the wand had its own field.
    const color = card.wandColor === undefined ? lightColor(card.light) : card.wandColor;
    const crowd = color ? `<div class="chapter-replay-audience" style="--wand:${color}" aria-hidden="true">${'<i></i>'.repeat(15)}</div>` : '';
    return duetStage(card, lang, move, move, index === card.choreography.length - 1, lang === 'ru' ? 'ПОВТОР' : 'TEKRAR', crowd)
        + timeline(card.choreography[2], index, lang);
}
function photoControls(state, lang, look, now) {
    const copy = labels[lang];
    const { pose, companion, moment } = state;
    return `${photoFrame({ ...look, pose, companion, moment }, lang, { elapsed: photoElapsed(state, now) })}
    <div class="cd-controls cd-photo-controls">
      <p class="cd-cue">${copy.photocall}</p>
      <fieldset><legend>${copy.pose}</legend><div class="cd-photo-choices">${poses.map(id => action('pose-' + id, `<span aria-hidden="true">${poseIcon[id]}</span> ${copy.poses[id]}`, 'cd-chip', `aria-pressed="${pose === id}"`)).join('')}</div></fieldset>
      <fieldset><legend>${copy.companion}</legend><div class="cd-photo-choices">${companions.map(id => action('with-' + id, name(id, lang), 'cd-chip', `aria-pressed="${companion === id}"`)).join('')}</div></fieldset>
      <fieldset><legend>${copy.moment}</legend><div class="cd-photo-choices">${moments.map(id => action('moment-' + id, copy.moments[id], 'cd-chip', `aria-pressed="${moment === id}"`)).join('')}</div></fieldset>
      ${action('shutter', `<i class="cd-shutter" aria-hidden="true"></i>${copy.shutter}`, 'cd-action')}
    </div>`;
}
export function renderChapterDance(state, lang = 'ru', look = baseLook, now = performance.now()) {
    const copy = labels[lang];
    const appearance = state.look ?? (validLook(look) ? look : baseLook);
    const zone = state.phase === 'live' ? copy.stage : state.phase === 'photo' || state.phase === 'complete' ? copy.camera : copy.rehearsal;
    let content;
    if (state.phase === 'complete' && state.snapshot)
        content = renderChapterDanceCard(state.snapshot, lang);
    else if (state.phase === 'photo')
        content = photoControls(state, lang, appearance, now);
    else if (state.phase === 'live')
        content = live(state, lang, appearance);
    else
        content = rehearsal(state, lang, appearance);
    return `<section class="chapter-dance" data-dance-phase="${state.phase}" data-dance-step="${state.step}" data-dance-error="${state.mistake}" aria-labelledby="cd-title">
    <div class="cd-heading"><span>${zone}</span><h2 id="cd-title">${copy[state.phase]}</h2></div>${content}
  </section>`;
}
