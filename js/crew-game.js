import { line, passes } from './story.js';
function game() {
    return { done: false, error: null, render: () => '', action: () => false };
}
function button(action, label, kind = '', pressed, disabled = false) {
    const state = pressed === undefined ? '' : ` aria-pressed="${pressed}"`;
    return `<button type="button" class="crew-button ${kind}" data-act="crew-${action}"${state}${disabled ? ' disabled' : ''}>${label}</button>`;
}
function image(asset, alt = '') {
    return `<img src="art/${asset}.webp" alt="${alt}" draggable="false">`;
}
function compare(actual, expected) {
    return actual.length === expected.length && actual.every((value, index) => value === expected[index]);
}
const finishLabel = line('Sahneye geç →', 'На сцену →');
const retryLabel = line('Yeniden dene', 'Попробовать снова');
const roles = {
    voice: line('Vokal', 'Вокал'),
    backing: line('Altyapı', 'Фонограмма'),
    crowd: line('Tribün', 'Трибуны')
};
const mixChannels = [roles.voice, roles.backing, roles.crowd];
const mixTarget = [4, 3, 2];
function soundGame() {
    const output = game();
    const levels = [2, 4, 5];
    let selected = 0;
    let mismatch = false;
    output.render = lang => `
    <div class="crew-mixer">${mixChannels.map((channel, i) => {
        const level = levels[i];
        const target = mixTarget[i];
        return button('mix-' + i, `<strong>${channel[lang]}</strong>
        <span class="crew-peaks" aria-hidden="true">${Array.from({ length: 5 }, (_, n) => `<i class="${n < (level ?? 0) ? 'on' : ''} ${n + 1 === target ? 'target' : ''}"></i>`).join('')}</span>
        <span>${level}/5 <small>${line('Hedef', 'Цель')[lang]} ${target}</small></span>`, 'crew-channel', selected === i);
    }).join('')}</div>
    <div class="crew-controls" aria-label="${mixChannels[selected]?.[lang]}">
      ${button('mix-lower', line('− Azalt', '− Тише')[lang], '', undefined, levels[selected] === 0)}
      ${button('mix-raise', line('+ Yükselt', '+ Громче')[lang], '', undefined, levels[selected] === 5)}
    </div>
    ${mismatch ? `<p class="crew-message" role="status">${line('Kanal seviyelerini hedef çizgileriyle eşleştirip tekrar dene.', 'Сверь уровни с отметками и проверь микс ещё раз.')[lang]}</p>` : ''}
    ${button('mix-test', line('Miksi kontrol et', 'Проверить микс')[lang], 'crew-primary')}`;
    output.action = action => {
        if (/^mix-[0-2]$/.test(action))
            selected = Number(action.slice(-1));
        else if (action === 'mix-raise' || action === 'mix-lower') {
            const level = levels[selected];
            if (level === undefined)
                return false;
            levels[selected] = Math.min(5, Math.max(0, level + (action === 'mix-raise' ? 1 : -1)));
            mismatch = false;
        }
        else if (action === 'mix-test') {
            output.done = compare(levels, mixTarget);
            mismatch = !output.done;
        }
        else
            return false;
        return true;
    };
    return output;
}
const dispatch = [
    { prompt: line('Programı değiştir', 'Измени расписание'), options: [
            { id: 'dance', text: line('Dans açılışını öne al', 'Поставить танец первым'), seconds: 24 },
            { id: 'wait', text: line('Orijinal sırayı bekle', 'Оставить прежний порядок'), seconds: -12 }
        ] },
    { prompt: line('Yedek mikrofonu hazırla', 'Подготовь запасной микрофон'), options: [
            { id: 'spare', text: line('Kanal 2 · dolu pil, ses testi', 'Канал 2 · заряд и проверка звука'), seconds: -16 },
            { id: 'empty', text: line('Kanal 2 · boş pil, test yok', 'Канал 2 · батарея разряжена, без проверки'), seconds: -5 },
            { id: 'wrong', text: line('Kanal 4 · dolu pil, ses testi', 'Канал 4 · заряд и проверка звука'), seconds: -12 }
        ] },
    { prompt: line('Mikrofonu teslim et', 'Доставь микрофон'), options: [
            { id: 'right', text: line('Sağ kulis · depo', 'Правая кулиса · склад'), seconds: -8 },
            { id: 'left', text: line('Sol kulis · Lisa’nın işareti', 'Левая кулиса · метка Лисы'), seconds: -10 }
        ] }
];
function managerGame() {
    const output = game();
    let seconds = 18;
    const schedule = [];
    output.render = lang => {
        const phase = dispatch[schedule.length];
        if (!phase)
            return '';
        return `<div class="crew-clock"><strong>${seconds}</strong> ${line('saniye', 'секунд')[lang]} <small>${line('Vokale kalan süre', 'До вступления вокала')[lang]}</small></div>
      ${schedule.length ? `<ol class="crew-list">${schedule.map(step => `<li>${step[lang]}</li>`).join('')}</ol>` : ''}
      <h3>${phase.prompt[lang]}</h3>
      <div class="crew-stack">${phase.options.map(option => button('dispatch-' + option.id, `<span>${option.text[lang]}</span><strong>${option.seconds > 0 ? '+' : '−'}${Math.abs(option.seconds)} s</strong>`, 'crew-choice')).join('')}</div>`;
    };
    output.action = action => {
        const option = dispatch[schedule.length]?.options.find(candidate => action === 'dispatch-' + candidate.id);
        if (!option)
            return false;
        seconds += option.seconds;
        schedule.push(option.text);
        if (seconds <= 0)
            output.error = line('Vokal girişi başladı. Dansı öne alıp ek süre kazan.', 'Вокал уже начался. Поставь танец первым, чтобы выиграть время.');
        else if (option.id === 'empty')
            output.error = line('Yedek mikrofonun pili boş. Dolu pili olanı ses testinden geçir.', 'Батарея запасного микрофона разряжена. Проверь микрофон с заряженной батареей.');
        else if (option.id === 'wrong')
            output.error = line('Lisa’nın alıcısı kanal 2’de. Yedek mikrofonu aynı kanalda test et.', 'Приёмник Лисы настроен на канал 2. Проверь запасной микрофон на том же канале.');
        else if (option.id === 'right')
            output.error = line('Sağ kuliste sadece depo var. Lisa sol kulisteki işaretten giriyor.', 'В правой кулисе только склад. Лиса выходит у метки слева.');
        else
            output.done = option.id === 'left';
        return true;
    };
    return output;
}
const angleLabels = [
    line('Genel plan', 'Общий план'),
    line('Yakın plan', 'Крупный план'),
    line('Takip kamerası', 'Следящая камера')
];
const angleAssets = ['lisa', 'jisoo', 'jennie'];
const shotLabels = [
    line('Perde açılırken yüzü göster', 'Покажи лицо при открытии занавеса'),
    line('Dans adımının hareketini izle', 'Проследи за движением в танце'),
    line('Pembe tribün dalgasını göster', 'Покажи розовую волну на трибунах')
];
const editTarget = [1, 2, 0];
const albumMemory = new Map();
function preserve(key, value) {
    try {
        localStorage.setItem('encore1.crew.' + key, value);
        albumMemory.delete(key);
    }
    catch {
        albumMemory.set(key, value);
    }
}
function restored(key) {
    if (albumMemory.has(key))
        return albumMemory.get(key);
    try {
        return localStorage.getItem('encore1.crew.' + key);
    }
    catch {
        return null;
    }
}
function angleFrame(index, lang) {
    const label = angleLabels[index];
    const asset = angleAssets[index];
    if (asset === undefined || !label)
        return '';
    return `<figure class="crew-frame crew-angle-${index}">${image(asset)}
    <figcaption>${label[lang]}</figcaption>
    ${index === 0 ? `<div class="crew-audience" aria-hidden="true">${'<i></i>'.repeat(14)}</div>` : ''}
  </figure>`;
}
function directorGame() {
    const output = game();
    const edit = [];
    let shot = 0;
    let preview = -1;
    output.render = lang => {
        if (preview >= 0) {
            const angle = edit[preview];
            return `<p class="crew-caption" aria-live="polite">${line('Montaj tekrarı', 'Просмотр монтажа')[lang]} · ${preview + 1}/3</p>
       ${angle === undefined ? '' : angleFrame(angle, lang)}
       ${button('cut-next', (preview === 2 ? line('Montajı kaydet', 'Сохранить монтаж') : line('Sonraki kesme →', 'Следующая склейка →'))[lang], 'crew-primary')}
       ${preview > 0 ? button('cut-replay', line('Baştan izle', 'Смотреть сначала')[lang]) : ''}`;
        }
        return `<div class="crew-timeline">${shotLabels.map((label, i) => {
            const angle = edit[i];
            return button('cut-slot-' + i, `<span>${label[lang]}</span><strong>${angle === undefined ? '—' : angleLabels[angle]?.[lang]}</strong>`, 'crew-choice', shot === i);
        }).join('')}</div>
    <div class="crew-cameras">${angleLabels.map((label, i) => button('cut-angle-' + i, `${image(angleAssets[i] ?? '')}<span>${label[lang]}</span>`, 'crew-camera', edit[shot] === i)).join('')}</div>
    ${button('cut-preview', line('Üç açıyı izle', 'Посмотреть три ракурса')[lang], 'crew-primary', undefined, edit.filter(angle => angle !== undefined).length < 3)}`;
    };
    output.action = action => {
        if (preview >= 0) {
            if (action === 'cut-replay')
                preview = 0;
            else if (action === 'cut-next') {
                if (preview < 2)
                    preview++;
                else {
                    preserve('montage', edit.join(','));
                    output.done = true;
                }
            }
            else
                return false;
        }
        else if (/^cut-slot-[0-2]$/.test(action))
            shot = Number(action.slice(-1));
        else if (/^cut-angle-[0-2]$/.test(action)) {
            edit[shot] = Number(action.slice(-1));
            shot = Math.min(2, shot + 1);
        }
        else if (action === 'cut-preview' && edit.filter(angle => angle !== undefined).length === 3) {
            if (compare(edit, editTarget))
                preview = 0;
            else
                output.error = line('Canlı görüntüde bir an kayboldu. Yüzü yakın, dansı takip, seyirciyi genel planla göster.', 'На записи потерялся один момент. Используй крупный план для лица, следящую камеру для танца и общий план для зала.');
        }
        else
            return false;
        return true;
    };
    return output;
}
const dancers = ['Jisoo', 'Jennie', 'Rosé', 'Lisa'];
const places = [line('Sol', 'Слева'), line('Orta', 'В центре'), line('Sağ', 'Справа'), line('Ön', 'Впереди')];
const danceMoves = [line('Dönüş', 'Поворот'), line('Poz', 'Поза'), line('Adım', 'Шаг')];
const plannedMoves = [2, 0, 1];
function choreoGame() {
    const output = game();
    let dancer = 0;
    const positions = new Map();
    const moves = [];
    let forming = true;
    output.render = lang => forming ? `
    <p class="crew-caption">${line('Jisoo sol · Jennie orta · Rosé sağ · Lisa ön', 'Джису слева · Дженни в центре · Розэ справа · Лиса впереди')[lang]}</p>
    <div class="crew-performers">${dancers.map((name, i) => button('choreo-dancer-' + i, name, '', dancer === i)).join('')}</div>
    <div class="crew-formation">${places.map((place, i) => {
        const person = positions.get(i);
        return button('choreo-place-' + i, `<span>${place[lang]}</span><strong>${person === undefined ? '＋' : dancers[person]}</strong>`, 'crew-place');
    }).join('')}</div>
    ${button('choreo-check', line('Yerleşimi kontrol et', 'Проверить расстановку')[lang], 'crew-primary', undefined, positions.size !== 4)}`
        : `<p class="crew-caption">${line('Prova sırası: adım, dönüş, poz', 'Порядок репетиции: шаг, поворот, поза')[lang]}</p>
      <div class="crew-order" aria-live="polite">${plannedMoves.map((_, i) => {
            const move = moves[i];
            return `<span>${move === undefined ? '·' : danceMoves[move]?.[lang]}</span>`;
        }).join('')}</div>
      <div class="crew-controls">${danceMoves.map((move, i) => button('choreo-move-' + i, move[lang])).join('')}</div>`;
    output.action = action => {
        if (forming && /^choreo-dancer-[0-3]$/.test(action))
            dancer = Number(action.slice(-1));
        else if (forming && /^choreo-place-[0-3]$/.test(action)) {
            const place = Number(action.slice(-1));
            for (const [assigned, actor] of positions)
                if (actor === dancer)
                    positions.delete(assigned);
            positions.set(place, dancer);
            const next = dancers.findIndex((_, i) => !Array.from(positions.values()).includes(i));
            if (next >= 0)
                dancer = next;
        }
        else if (forming && action === 'choreo-check' && positions.size === dancers.length) {
            if (dancers.every((_, i) => positions.get(i) === i))
                forming = false;
            else
                output.error = line('Bir dansçı yanlış hatta. Sahne yerleşimini yeniden kur.', 'Одна участница встала не на свою метку. Повтори расстановку.');
        }
        else if (!forming && /^choreo-move-[0-2]$/.test(action)) {
            const move = Number(action.slice(-1));
            if (move === plannedMoves[moves.length])
                moves.push(move);
            else
                output.error = line('Dans sırası karıştı. Adımdan sonra dönüş, en sonda poz gelir.', 'Порядок движений сбился. После шага идёт поворот, затем поза.');
            output.done = moves.length === plannedMoves.length;
        }
        else
            return false;
        return true;
    };
    return output;
}
const takes = [
    { id: 'jisoo', label: line('Gül pozu', 'Поза с розой'), start: .24, end: .43 },
    { id: 'jennie', label: line('Işıkta dönüş', 'Поворот в луче'), start: .51, end: .70 },
    { id: 'rose', label: line('Gitar ışığı', 'Луч над гитарой'), start: .62, end: .81 }
];
const exposureMs = 4800;
const exposureSteps = 10;
function inFocus(moment, take) {
    return moment >= take.start && moment <= take.end;
}
function photoGame() {
    const output = game();
    const captured = new Set();
    let shot = 0;
    let mode = 'idle';
    let start = 0;
    let step = 0;
    let coverMode = false;
    let feedback = null;
    output.render = lang => {
        if (coverMode)
            return `<h3>${line('Albüm kapağını seç', 'Выбери обложку альбома')[lang]}</h3>
      <div class="crew-cameras">${takes.filter(take => captured.has(take.id)).map(take => button('photo-cover-' + take.id, `${image(take.id)}<span>${take.label[lang]}</span>`, 'crew-camera')).join('')}</div>`;
        const current = takes[shot];
        if (!current)
            return '';
        const copy = line('Net kare', 'Чёткий кадр');
        return `<p class="crew-caption">${copy[lang]} · ${captured.size}/2 <span>${line('Çekim', 'Попытка')[lang]} ${shot + 1}/${takes.length}</span></p>
      <figure class="crew-frame crew-viewfinder">${image(current.id)}<figcaption>${current.label[lang]}</figcaption></figure>
      ${mode === 'idle' ? `<div class="crew-controls">${button('photo-live', line('Çekimi başlat', 'Начать съёмку')[lang], 'crew-primary')}
        ${button('photo-step-mode', line('Kare kare oyna', 'Играть покадрово')[lang])}</div>`
            : `<div class="crew-exposure ${mode === 'live' ? 'crew-live' : ''}" style="--capture-start:${current.start * 100}%;--capture-width:${(current.end - current.start) * 100}%;--capture-step:${step / exposureSteps * 100}%;--capture-elapsed:${Math.min(exposureMs, performance.now() - start)}ms;--capture-duration:${exposureMs}ms" aria-hidden="true"><i></i><span></span></div>
          ${mode === 'step' ? `<p class="crew-caption" role="status">${inFocus(step / exposureSteps, current) ? line('Netlik hazır', 'Фокус готов')[lang] : line('Bir sonraki kareyi dene', 'Попробуй следующий кадр')[lang]}</p>` : ''}
          <div class="crew-controls">${button('photo-shutter', line('Deklanşöre bas', 'Спустить затвор')[lang], 'crew-primary')}
          ${mode === 'step' ? button('photo-step', line('Sonraki kare', 'Следующий кадр')[lang]) : ''}</div>`}
      ${feedback ? `<p class="crew-message" role="status">${feedback[lang]}</p>` : ''}`;
    };
    output.action = action => {
        if (coverMode) {
            const cover = action.startsWith('photo-cover-') ? action.slice(12) : '';
            if (!captured.has(cover))
                return false;
            preserve('cover', cover);
            output.done = true;
            return true;
        }
        const current = takes[shot];
        if (!current)
            return false;
        if (mode === 'idle' && (action === 'photo-live' || action === 'photo-step-mode')) {
            mode = action === 'photo-live' ? 'live' : 'step';
            start = performance.now();
            step = 0;
        }
        else if (mode === 'step' && action === 'photo-step')
            step = Math.min(exposureSteps, step + 1);
        else if (mode !== 'idle' && action === 'photo-shutter') {
            const moment = mode === 'step' ? step / exposureSteps : (performance.now() - start) / exposureMs;
            if (inFocus(moment, current)) {
                captured.add(current.id);
                feedback = line('Kare net.', 'Кадр получился чётким.');
            }
            else
                feedback = line('Işığı kaçırdın. Sıradaki çekime geç.', 'Момент упущен. Переходи к следующему кадру.');
            mode = 'idle';
            shot++;
            if (captured.size === 2)
                coverMode = true;
            else if (captured.size + takes.length - shot < 2)
                output.error = line('Kapak seçmek için iki net kare gerekiyor. Çekime tekrar başla.', 'Для выбора обложки нужны два чётких кадра. Начни съёмку заново.');
        }
        else
            return false;
        return true;
    };
    return output;
}
const stairs = [0, 1, 2, 1];
function jisooGame() {
    const output = game();
    let rank = 0;
    const directions = [line('Sol', 'Слева'), line('Orta', 'По центру'), line('Sağ', 'Справа')];
    output.render = lang => `<p class="crew-caption">${line('Basamak', 'Ступень')[lang]} ${rank + 1}/${stairs.length}</p>
    <div class="crew-stairs">${stairs.map((mark, row) => `<div class="crew-stair"><span aria-hidden="true">${row + 1}</span>
      ${directions.map((direction, step) => button('stair-' + step, `${row < rank && step === mark ? '✓' : direction[lang]}` + (row === rank && step === mark ? `<small>${line('Işıklı', 'С подсветкой')[lang]}</small>` : ''), row === rank && step === mark ? 'crew-lit' : '', undefined, row !== rank)).join('')}</div>`).reverse().join('')}</div>`;
    output.action = action => {
        if (!/^stair-[0-2]$/.test(action))
            return false;
        if (Number(action.slice(-1)) === stairs[rank])
            rank++;
        else
            output.error = line('Bu basamak karanlık kaldı. Pembe işaretleri izle.', 'Ступенька осталась в тени. Следуй за розовыми метками.');
        output.done = rank === stairs.length;
        return true;
    };
    return output;
}
const jacketCues = [
    { expected: 'right', text: line('Mina sağ çıtçıtı işaret ediyor.', 'Мина показывает на правую кнопку.') },
    { expected: 'left', text: line('Şimdi sol çıtçıtı aç.', 'Теперь расстегни левую кнопку.') },
    { expected: 'turn', text: line('Spot yandı. Dönüşü yap.', 'Луч загорелся. Пора повернуться.') }
];
const jacketMoves = [
    { id: 'left', label: line('Sol çıtçıt', 'Левая кнопка') },
    { id: 'right', label: line('Sağ çıtçıt', 'Правая кнопка') },
    { id: 'turn', label: line('Dön', 'Повернуться') }
];
function jennieGame() {
    const output = game();
    let step = 0;
    output.render = lang => `
    <figure class="crew-frame crew-jacket crew-jacket-${step}">${image('jennie')}
      <span class="crew-stud crew-stud-left" aria-hidden="true"></span><span class="crew-stud crew-stud-right" aria-hidden="true"></span>
      <figcaption>${jacketCues[step]?.text[lang]}</figcaption>
    </figure>
    <div class="crew-controls">${jacketMoves.map(move => button('jacket-' + move.id, move.label[lang], '', undefined, move.id === 'right' && step > 0 || move.id === 'left' && step > 1)).join('')}</div>`;
    output.action = action => {
        const move = jacketMoves.find(candidate => action === 'jacket-' + candidate.id);
        if (!move || move.id === 'right' && step > 0 || move.id === 'left' && step > 1)
            return false;
        if (move.id === jacketCues[step]?.expected)
            step++;
        else
            output.error = line('İşaret kaçtı. Önce sağ çıtçıt, sonra sol çıtçıt, en son dönüş.', 'Сигнал пропущен. Сначала правая кнопка, затем левая, потом поворот.');
        output.done = step === jacketCues.length;
        return true;
    };
    return output;
}
const notes = [line('Pes', 'Низкая'), line('Orta', 'Средняя'), line('Tiz', 'Высокая')];
const melodyPattern = [1, 2, 0];
function roseGame() {
    const output = game();
    let index = 0;
    output.render = lang => `
    <p class="crew-caption">${line('Gitarın notaları', 'Гитарные ноты')[lang]}</p>
    <div class="crew-order">${melodyPattern.map((key, i) => `<span class="${i === index ? 'crew-lit' : ''}">${i < index ? '✓ ' : ''}${notes[key]?.[lang]}</span>`).join('')}</div>
    <div class="crew-piano">${notes.map((note, i) => button('note-' + i, `<strong>${['A', 'C', 'E'][i]}</strong><span>${note[lang]}</span>`, 'crew-key')).join('')}</div>`;
    output.action = action => {
        if (!/^note-[0-2]$/.test(action))
            return false;
        if (Number(action.slice(-1)) === melodyPattern[index])
            index++;
        else
            output.error = line('Nota gitarla uyuşmadı. Orta, tiz ve pes sırasını yeniden çal.', 'Нота не совпала с гитарой. Сыграй среднюю, высокую и низкую ещё раз.');
        output.done = index === melodyPattern.length;
        return true;
    };
    return output;
}
const factories = new Map([
    ['sound', soundGame], ['manager', managerGame], ['director', directorGame], ['choreo', choreoGame],
    ['photo', photoGame], ['jisoo', jisooGame], ['jennie', jennieGame], ['rose', roseGame]
]);
const active = new Map();
function getGame(role) {
    const previous = active.get(role);
    if (previous)
        return previous;
    const entry = factories.get(role)?.();
    if (entry)
        active.set(role, entry);
    return entry;
}
export function hasCrewGame(role) {
    return factories.has(role);
}
export function resetCrewGame(role) {
    active.delete(role);
}
export function isCrewGameComplete(role) {
    return active.get(role)?.done === true;
}
export function crewAction(action, role) {
    if (!action.startsWith('crew-'))
        return false;
    const entry = getGame(role);
    if (!entry || entry.done)
        return false;
    if (action === 'crew-retry') {
        resetCrewGame(role);
        return true;
    }
    return !entry.error && entry.action(action.slice(5));
}
export function renderCrewGame(lang, role) {
    const entry = getGame(role);
    const pass = passes[role];
    if (!entry || !pass)
        return '';
    const content = entry.done ? `<p class="crew-message" role="status">${pass.result[lang]}</p>${button('continue', finishLabel[lang], 'crew-primary')}`
        : entry.error ? `<p class="crew-message" role="status">${entry.error[lang]}</p>${button('retry', retryLabel[lang], 'crew-primary')}`
            : entry.render(lang);
    return `<section class="crew-game" data-crew-role="${role}"><p class="kicker">${pass.job[lang]} · ${pass.name}</p>
    <h2>${pass.cue[lang]}</h2><p class="intro">${pass.hint[lang]}</p>${content}</section>`;
}
export function crewAlbum(lang) {
    const cover = takes.find(take => take.id === restored('cover'));
    const storedMontage = restored('montage');
    if (!cover && storedMontage !== editTarget.join(','))
        return '';
    return `<section class="crew-album" aria-label="${line('Sahne kayıtları', 'Записи со сцены')[lang]}">
    ${cover ? `<div><h3>${line('Seçtiğin kapak', 'Твоя обложка')[lang]}</h3><figure class="crew-frame crew-cover">${image(cover.id)}<figcaption>${cover.label[lang]}</figcaption></figure></div>` : ''}
    ${storedMontage === editTarget.join(',') ? `<div><h3>${line('Üç açılı bis montajı', 'Бис с трёх ракурсов')[lang]}</h3><div class="crew-cameras">${editTarget.map(angle => angleFrame(angle, lang)).join('')}</div></div>` : ''}
  </section>`;
}
