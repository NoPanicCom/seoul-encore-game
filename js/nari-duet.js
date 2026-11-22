import { worldAudio } from './world-audio.js';
const moves = [
    { ru: 'Шаг влево', tr: 'Sola adım', icon: '←' },
    { ru: 'Прыжок', tr: 'Yıldız sıçrayışı', icon: '★' },
    { ru: 'Сердечко', tr: 'Yanak kalbi', icon: '♡' },
];
const sequence = [0, 1, 2];
const finale = [0, 1, 2, 1, 0, 2, 0, 1];
export function mountNariDuet(panel, lang, learned, onLearn, onComplete, onExit, scene, guest) {
    const tr = lang === 'tr', live = scene.kind === 'concert';
    const nari = tr ? 'Nari' : 'Нари', sofia = guest?.name ?? (tr ? 'Sofia' : 'София');
    panel.innerHTML = `<div class="duet-top"><b>${live ? (tr ? 'İlk sahnemiz' : 'Наш дебют') + ' · ' : ''}${nari} × ${sofia}</b><button type="button" class="duet-exit" aria-label="${live ? (tr ? 'Meydana dön' : 'Вернуться на площадь') : (tr ? 'Provadan çık' : 'Выйти из репетиции')}">×</button></div>
    <div class="duet-floor" aria-label="${tr ? 'Dans pisti' : 'Танцпол'}">
      <div class="duet-performer"><i class="duet-body nari-body" data-pose="idle"></i><span>${nari}</span></div>
      <div class="duet-performer"><i class="duet-body sofia-body" data-pose="idle"></i><span>${sofia}</span></div>
    </div>
    <div class="duet-console"><div class="duet-track" aria-hidden="true">${moves.map(m => `<i>${m.icon}</i>`).join('')}</div>
      <p class="duet-message" role="status"></p>
      <div class="duet-moves" role="group" aria-label="${tr ? 'Dans hareketleri' : 'Танцевальные движения'}">${moves.map((m, i) => `<button type="button" data-duet-move="${i}"><b>${m.icon}</b>${m[lang]}</button>`).join('')}</div>
      <small class="duet-gesture">${tr ? 'Pistte parmağını sola, yukarı veya sağa kaydırabilirsin.' : 'На танцполе можно провести пальцем влево, вверх или вправо.'}</small>
      <button type="button" class="duet-next" hidden></button><button type="button" class="duet-again"></button>
    </div>`;
    function get(selector) {
        const element = panel.querySelector(selector);
        if (!element)
            throw new Error('Missing duet control ' + selector);
        return element;
    }
    const leader = get('.nari-body'), follower = get('.sofia-body'), floor = get('.duet-floor');
    if (guest?.image) {
        follower.classList.add('cast-body');
        follower.style.backgroundImage = 'url("' + guest.image + '")';
    }
    const message = get('.duet-message'), moveBar = get('.duet-moves'), again = get('.duet-again');
    const nextButton = get('.duet-next');
    const buttons = Array.from(moveBar.querySelectorAll('button'));
    const marks = Array.from(panel.querySelectorAll('.duet-track i'));
    const controller = new AbortController(), listener = { signal: controller.signal };
    let count = learned, phase = 'demo', elapsed = 0, last = performance.now(), frame = 0, beat = -1, wrongAt = null;
    let gesture = null;
    function pose(actor, n) { actor.dataset.pose = n === null ? 'idle' : String(n); }
    function setPhase(next) {
        phase = next;
        panel.dataset.phase = next;
        elapsed = 0;
        beat = -1;
        wrongAt = null;
        last = performance.now();
        const expected = sequence[count];
        marks.forEach((mark, i) => { mark.classList.toggle('learned', i < count); mark.classList.toggle('current', i === count); });
        buttons.forEach(b => { b.disabled = next !== 'echo'; });
        moveBar.hidden = next === 'finale' || next === 'done';
        again.hidden = next !== 'echo' && next !== 'done';
        nextButton.hidden = next !== 'done';
        nextButton.textContent = live ? (tr ? 'Konseri izle' : 'Смотреть концерт') : (tr ? 'Birlikte gidelim!' : 'Пойдём вместе!');
        if (live && next === 'echo')
            again.hidden = true;
        again.textContent = next === 'done' ? (live ? (tr ? 'Meydana dön' : 'На площадь') : (tr ? 'Daha sonra' : 'Чуть позже')) : (tr ? 'Nari, tekrar göster' : 'Нари, покажи ещё раз');
        if (next === 'demo' && expected !== undefined) {
            pose(leader, null);
            pose(follower, null);
            message.textContent = tr ? `Nari’yi izle · ${moves[expected].tr}` : `Смотри на Нари · ${moves[expected].ru}`;
        }
        else if (next === 'echo') {
            if (live && expected !== undefined) {
                message.textContent = tr ? `Seyirci hazır! Şimdi birlikte · ${moves[expected].tr}` : `Зал ждёт! Танцуем вместе · ${moves[expected].ru}`;
            }
            else
                message.textContent = tr ? 'Sıra sende! Nari’nin hareketini yap.' : 'Твоя очередь! Повтори движение Нари.';
        }
        else if (next === 'match') {
            message.textContent = tr ? 'Aynı anda!' : 'Синхронно!';
        }
        else if (next === 'finale') {
            if (live)
                message.textContent = tr ? 'Final bizim! Işıklar ikinizi takip ediyor.' : 'Наш финал! Лучи следуют за вами.';
            else
                message.textContent = tr ? 'Müzik başladı. Şimdi düet!' : 'Музыка пошла. Теперь дуэт!';
        }
        else if (next === 'done') {
            message.textContent = live ? (tr ? 'Nari: İlk alkışımız! İyi ki benimle sahneye çıktın.' : 'Нари: Это наши первые аплодисменты! Спасибо, что вышла со мной.') : (tr ? 'Nari: Bu benim ilk konserim! Bizim dansı sahnede birlikte yapalım mı?' : 'Нари: Это будет мой первый концерт! Станцуем наш танец вместе на сцене?');
        }
    }
    function answer(move) {
        if (phase !== 'echo')
            return;
        pose(follower, move);
        worldAudio.note(move);
        const expected = sequence[count];
        if (expected === undefined)
            return;
        if (move !== expected) {
            message.textContent = tr ? `Nari’yle bir daha dene · ${moves[expected].tr}` : `Попробуй с Нари ещё раз · ${moves[expected].ru}`;
            wrongAt = elapsed;
            return;
        }
        pose(leader, move);
        ++count;
        onLearn(count);
        setPhase('match');
    }
    function tick(now) {
        elapsed += Math.min(100, Math.max(0, now - last));
        last = now;
        if (phase === 'demo') {
            const expected = sequence[count];
            if (expected !== undefined && elapsed >= 300 && beat < 0) {
                beat = 0;
                pose(leader, expected);
                worldAudio.note(expected);
            }
            if (elapsed >= 1600)
                setPhase('echo');
        }
        else if (phase === 'echo' && wrongAt !== null && elapsed - wrongAt >= 650) {
            pose(follower, null);
            wrongAt = null;
        }
        else if (phase === 'match' && elapsed >= 880) {
            setPhase(count === sequence.length ? 'finale' : live ? 'echo' : 'demo');
        }
        else if (live && phase === 'echo' && Math.floor(elapsed / 520) !== beat) {
            beat = Math.floor(elapsed / 520);
            worldAudio.groove(beat);
        }
        else if (phase === 'finale') {
            const index = Math.floor(elapsed / 520);
            const move = finale[index];
            if (move === undefined) {
                setPhase('done');
                onComplete();
                worldAudio.cue('delivery');
            }
            else if (index !== beat) {
                beat = index;
                panel.dataset.beat = String(beat);
                pose(leader, move);
                pose(follower, move);
                worldAudio.groove(index);
                worldAudio.note(move);
            }
        }
        if (phase !== 'done')
            frame = requestAnimationFrame(tick);
    }
    panel.addEventListener('click', event => {
        const button = event.target instanceof Element ? event.target.closest('button') : null;
        if (!button)
            return;
        if (button === nextButton && phase === 'done') {
            if (scene.kind === 'concert')
                scene.continueShow();
            else
                scene.invite();
            return;
        }
        if (button.classList.contains('duet-exit') || (button === again && phase === 'done')) {
            onExit();
            return;
        }
        if (button === again && phase === 'echo') {
            setPhase('demo');
            return;
        }
        const n = Number(button.dataset.duetMove);
        if (n === 0 || n === 1 || n === 2)
            answer(n);
    }, listener);
    floor.addEventListener('pointerdown', e => {
        if (phase !== 'echo' || !e.isPrimary)
            return;
        gesture = { id: e.pointerId, x: e.clientX, y: e.clientY };
        floor.setPointerCapture(e.pointerId);
    }, listener);
    floor.addEventListener('pointerup', e => {
        if (!gesture || gesture.id !== e.pointerId)
            return;
        const dx = e.clientX - gesture.x, dy = e.clientY - gesture.y;
        gesture = null;
        if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy))
            answer(dx < 0 ? 0 : 2);
        else if (dy < -30 || Math.hypot(dx, dy) < 12)
            answer(1);
    }, listener);
    floor.addEventListener('pointercancel', () => { gesture = null; }, listener);
    setPhase(count >= sequence.length ? 'finale' : live ? 'echo' : 'demo');
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); controller.abort(); delete panel.dataset.phase; delete panel.dataset.beat; };
}
