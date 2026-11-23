import { renderChapterReplayFrame } from './chapter-dance.js';
import { worldAudio } from './world-audio.js';
export function renderChapterReplay(lang) {
    const ru = lang === 'ru';
    return `<section class="chapter-dance chapter-replay" aria-labelledby="chapter-replay-title">
    <div class="cd-heading"><span>${ru ? 'ИЗ АЛЬБОМА' : 'ALBÜMDEN'}</span><h2 id="chapter-replay-title">${ru ? 'Наш танец с Нари' : 'Nari ile dansımız'}</h2></div>
    <div class="chapter-replay-frame"></div>
    <div class="chapter-replay-controls"><button class="cd-action" data-replay-toggle></button>
    <button class="cd-subtle" data-act="chapter-album">${ru ? 'Вернуться в альбом' : 'Albüme dön'}</button></div>
  </section>`;
}
export function mountChapterReplay(root, card, lang, sound) {
    const scene = root.querySelector('.chapter-replay');
    const frame = scene?.querySelector('.chapter-replay-frame');
    const control = scene?.querySelector('[data-replay-toggle]');
    if (!scene || !frame || !control)
        throw new Error('Missing chapter replay controls');
    const view = { scene, frame, control };
    const ru = lang === 'ru';
    const stepMs = 2320;
    let step = 0, remaining = stepMs, deadline = 0, timer = 0;
    let playing = false, ended = false;
    function drawStep() {
        view.frame.innerHTML = renderChapterReplayFrame(card, lang, step);
    }
    function controls() {
        view.scene.dataset.replay = playing ? 'playing' : ended ? 'ended' : 'paused';
        view.control.textContent = ended ? (ru ? '↻ Смотреть ещё раз' : '↻ Baştan izle') : playing ? (ru ? 'Пауза' : 'Duraklat') : (ru ? 'Продолжить' : 'Devam et');
    }
    function schedule() {
        deadline = performance.now() + remaining;
        timer = window.setTimeout(() => {
            if (step === card.choreography.length - 1) {
                playing = false;
                ended = true;
                worldAudio.exit();
                controls();
                return;
            }
            step++;
            remaining = stepMs;
            drawStep();
            worldAudio.groove(step);
            schedule();
        }, remaining);
    }
    function start() {
        if (ended) {
            step = 0;
            remaining = stepMs;
            ended = false;
            drawStep();
        }
        playing = true;
        controls();
        void worldAudio.enter();
        schedule();
    }
    function pause() {
        if (!playing)
            return;
        remaining = Math.max(0, deadline - performance.now());
        playing = false;
        window.clearTimeout(timer);
        worldAudio.exit();
        controls();
    }
    const controller = new AbortController();
    control.addEventListener('click', () => { if (playing)
        pause();
    else
        start(); }, { signal: controller.signal });
    document.addEventListener('visibilitychange', () => { if (document.hidden)
        pause(); }, { signal: controller.signal });
    worldAudio.setEnabled(sound);
    drawStep();
    if (document.hidden)
        controls();
    else
        start();
    return () => { controller.abort(); window.clearTimeout(timer); worldAudio.exit(); };
}
