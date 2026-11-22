import { isAriEncoreCostume } from './ari-bag.js';
import { activeConcertTrack, concertTrackElapsed, isConcertTrackPlaying, playConcertTrack, stopConcertTrack } from './concert-track.js';
import { beatAt, beatCount, beatMs, windowMs } from './rules.js';
import { lightBeat, stickName } from './lightstick.js';
import { renderPerformance } from './performance.js';
import { melody, silence } from './sound.js';
import { dressedFigure } from './travel-look.js';
import { worldChallenge } from './world.js';
const trackKey = /^[a-f0-9]{32}$/;
export function encodeFanRecording(times, costume, track) {
    const cues = times.join(',');
    const outfit = costume && isAriEncoreCostume(costume) ? costume : '';
    if (track) {
        if (!trackKey.test(track.key) || !isTrackInterval(track.beatMs))
            throw new Error('Invalid concert recording track');
        return `v3:${track.key}:${track.beatMs}:${outfit}:${cues}`;
    }
    return outfit ? `v2:${outfit}:${cues}` : `v1:${cues}`;
}
function isTrackInterval(interval) {
    return interval >= 200 && interval <= 2000;
}
export function readFanRecording(stick, value) {
    // Older cards stored just the stick. Their preview uses the musical downbeats.
    if (value === '1')
        return { stick, times: Array.from({ length: beatCount }, (_, i) => (i + 1) * beatMs), legacy: true };
    const [, key, interval, outfit, customCues] = /^v3:([a-f0-9]{32}):(\d{3,4}(?:\.\d{1,17})?):([^:]*):((?:\d{1,5}(?:,\d{1,5}){0,11})?)$/.exec(value ?? '') ?? [];
    if (key !== undefined && interval !== undefined && outfit !== undefined && customCues !== undefined) {
        const customBeatMs = Number(interval);
        if (!isTrackInterval(customBeatMs))
            return null;
        return parseRecording(stick, customCues, outfit || undefined, { key, beatMs: customBeatMs });
    }
    const [, costume, cues] = /^(?:v1:|v2:([^:]+):)((?:\d{1,4}(?:,\d{1,4}){0,11})?)$/.exec(value ?? '') ?? [];
    return cues === undefined ? null : parseRecording(stick, cues, costume);
}
function parseRecording(stick, cues, costume, track) {
    if (costume !== undefined && !isAriEncoreCostume(costume))
        return null;
    const times = cues ? cues.split(',').map(Number) : [];
    let previous = -1;
    for (const ms of times) {
        // Custom taps were rounded to the nearest millisecond when recorded.
        const beat = track
            ? beatAt(ms, track.beatMs) ?? beatAt(ms - .5, track.beatMs) ?? beatAt(ms + .5, track.beatMs)
            : beatAt(ms);
        if (beat === null || beat <= previous)
            return null;
        previous = beat;
    }
    return { stick, times, legacy: false, ...(costume === undefined ? {} : { costume }), ...(track === undefined ? {} : { track }) };
}
function replayDuration(record) {
    return beatCount * (record.track?.beatMs ?? beatMs) + windowMs + 60;
}
function timecode(ms) {
    const seconds = Math.floor(ms / 1000);
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
export function renderFanReplay(lang, record) {
    const tr = lang === 'tr';
    const duration = replayDuration(record);
    const label = record.legacy ? (tr ? 'Sahne canlandırması' : 'Реконструкция сцены') : (tr ? 'Konser kaydı' : 'Запись концерта');
    const costumes = record.costume ? { lisa: dressedFigure({ asset: record.costume, pieces: [] }) } : {};
    return `<section class="live-stage fan-replay" data-playing="false" aria-labelledby="replay-heading">
    <div class="film-head"><span>${label}</span><span aria-hidden="true">SEOUL</span></div>
    ${renderPerformance('lisa', lang, false, worldChallenge('lisa', 'light'), record.stick, true, true, costumes)}
    <div class="film-timeline"><progress max="${duration}" value="0" aria-label="${tr ? 'Kayıt süresi' : 'Время записи'}"></progress><output>0:00 / ${timecode(duration)}</output></div>
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
    const duration = replayDuration(record);
    const endTime = timecode(duration);
    const track = activeConcertTrack();
    const matchingTrack = record.track !== undefined && track?.key === record.track.key && track.beatMs === record.track.beatMs;
    const status = root.querySelector('#feedback');
    let active = true;
    let frame = 0;
    let next = 0;
    let start = 0;
    let mediaClock = false;
    let elapsed = 0;
    function reportSilent(missingTrack = false) {
        if (!active || !status)
            return;
        status.textContent = missingTrack
            ? (lang === 'tr' ? 'Bu kaydın müziği seçili değil. Işıklar sessiz oynatılıyor.' : 'Музыка этой записи не выбрана. Световое шоу воспроизводится без звука.')
            : (lang === 'tr' ? 'Kayıt sessiz oynatılıyor.' : 'Запись воспроизводится без звука.');
    }
    function stopAudio() {
        if (matchingTrack)
            stopConcertTrack();
        else if (!record.track)
            silence();
    }
    const paint = (now) => {
        if (!active)
            return;
        if (mediaClock) {
            elapsed = Math.min(duration, Math.max(elapsed, concertTrackElapsed()));
            if (elapsed < duration && !isConcertTrackPlaying()) {
                if (duration - elapsed <= .5)
                    elapsed = duration;
                else {
                    // If playback is interrupted, finish showing the remaining light cues.
                    start = now - elapsed;
                    mediaClock = false;
                    stopAudio();
                    reportSilent();
                }
            }
        }
        else
            elapsed = Math.min(duration, Math.max(elapsed, now - start));
        for (let cue = record.times[next]; cue !== undefined && cue <= elapsed; cue = record.times[next]) {
            lightBeat(set, ++next);
            set.dataset.arenaLit = 'true';
        }
        const last = record.times[next - 1];
        if (last !== undefined && elapsed - last >= 530)
            delete set.dataset.pulse;
        bar.value = elapsed;
        const display = `${timecode(elapsed)} / ${endTime}`;
        if (clock.value !== display)
            clock.value = display;
        if (elapsed < duration) {
            frame = requestAnimationFrame(paint);
            return;
        }
        scene.dataset.playing = 'false';
        restart.hidden = false;
        stopAudio();
    };
    const run = async () => {
        try {
            if (matchingTrack) {
                await playConcertTrack();
                mediaClock = true;
            }
            else if (record.track)
                reportSilent(true);
            else
                await melody(null, true, true);
        }
        catch {
            if (!active)
                return;
            stopAudio();
            if (record.track || sound)
                reportSilent();
        }
        if (!active)
            return;
        scene.dataset.playing = 'true';
        start = performance.now();
        frame = requestAnimationFrame(paint);
    };
    void run();
    return () => { active = false; cancelAnimationFrame(frame); stopAudio(); };
}
