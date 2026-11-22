import { beatAt, beatCount, beatMs, windowMs } from './rules.js';
import { lightBeat, stickName } from './lightstick.js';
import { renderPerformance } from './performance.js';
import { melody, silence } from './sound.js';
import { worldChallenge } from './world.js';
const duration = beatCount * beatMs + windowMs + 60;
export function encodeFanRecording(times) {
    return 'v1:' + times.join(',');
}
export function readFanRecording(stick, value) {
    // Older cards stored just the stick. Their preview uses the musical downbeats.
    if (value === '1')
        return { stick, times: Array.from({ length: beatCount }, (_, i) => (i + 1) * beatMs), legacy: true };
    if (!value || !/^v1:(?:\d{1,4}(?:,\d{1,4}){0,11})?$/.test(value))
        return null;
    const times = value.length === 3 ? [] : value.slice(3).split(',').map(Number);
    let previous = -1;
    for (const ms of times) {
        const beat = beatAt(ms);
        if (beat === null || beat <= previous)
            return null;
        previous = beat;
    }
    return { stick, times, legacy: false };
}
export function renderFanReplay(lang, record) {
    const tr = lang === 'tr';
    const label = record.legacy ? (tr ? 'Sahne canlandırması' : 'Реконструкция сцены') : (tr ? 'Konser kaydı' : 'Запись концерта');
    return `<section class="live-stage fan-replay" data-playing="false" aria-labelledby="replay-heading">
    <div class="film-head"><span>${label}</span><span aria-hidden="true">SEOUL</span></div>
    ${renderPerformance('lisa', lang, false, worldChallenge('lisa', 'light'), record.stick, true, true)}
    <div class="film-timeline"><progress max="${duration}" value="0" aria-label="${tr ? 'Kayıt süresi' : 'Время записи'}"></progress><output>0:00 / 0:08</output></div>
    <h2 id="replay-heading">${tr ? 'Lisa’nın gizli bisi' : 'Секретный бис Лисы'}</h2>
    <p>${stickName(record.stick, lang)}</p>
    <button class="secondary" data-act="rewatch-fan" hidden>↻ ${tr ? 'Baştan izle' : 'Посмотреть ещё раз'}</button>
    <button class="shop-go" data-act="fan-album">${tr ? 'Albüme dön' : 'Вернуться в альбом'}</button>
  </section>`;
}
export function mountFanReplay(root, record, sound, lang) {
    const scene = root.querySelector('.fan-replay');
    const set = scene?.querySelector('.live-set');
    const bar = scene?.querySelector('progress');
    const clock = scene?.querySelector('output');
    const restart = scene?.querySelector('[data-act="rewatch-fan"]');
    if (!scene || !set || !bar || !clock || !restart)
        throw new Error('Missing replay controls');
    let active = true;
    let frame = 0;
    let next = 0;
    let start = 0;
    function paint(now) {
        if (!active || !scene || !set || !bar || !clock || !restart)
            return;
        const elapsed = Math.min(duration, now - start);
        for (let cue = record.times[next]; cue !== undefined && cue <= elapsed; cue = record.times[next]) {
            lightBeat(set, ++next);
            set.dataset.arenaLit = 'true';
        }
        const last = record.times[next - 1];
        if (last !== undefined && elapsed - last >= 530)
            delete set.dataset.pulse;
        bar.value = elapsed;
        const timecode = '0:0' + Math.floor(elapsed / 1000) + ' / 0:08';
        if (clock.value !== timecode)
            clock.value = timecode;
        if (elapsed < duration) {
            frame = requestAnimationFrame(paint);
            return;
        }
        scene.dataset.playing = 'false';
        restart.hidden = false;
        silence();
    }
    async function run() {
        {
            try {
                await melody(null, true, true);
            }
            catch {
                const status = root.querySelector('#feedback');
                if (sound && active && status)
                    status.textContent = lang === 'tr' ? 'Kayıt sessiz oynatılıyor.' : 'Запись воспроизводится без звука.';
            }
        }
        if (!active || !scene)
            return;
        scene.dataset.playing = 'true';
        start = performance.now();
        frame = requestAnimationFrame(paint);
    }
    void run();
    return () => { active = false; cancelAnimationFrame(frame); silence(); };
}
