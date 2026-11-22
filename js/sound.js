import { beatCount, beatMs, windowMs } from './rules.js';
const stage = {
    pickup: [74, 81], finish: 86,
    bars: [
        { bass: 38, chord: [62, 65, 69, 72], hook: [[0, 77, 2.7], [3, 81, 2.6], [6, 79, 1.7], [8, 81, 2.5], [11, 84, 1.4], [13, 81, 2.8]] },
        { bass: 34, chord: [58, 62, 65, 69], hook: [[0, 77, 2.4], [3, 74, 3.2], [7, 72, 1], [8, 77, 2.6], [11, 81, 2.1], [14, 84, 1.6]] },
        { bass: 36, chord: [60, 64, 67, 74], hook: [[0, 86, 2.8], [3, 84, 2.6], [6, 79, 1.8], [8, 82, 2.4], [11, 84, .8]] },
    ],
};
const encore = {
    pickup: [69, 76], finish: 81,
    bars: [
        { bass: 33, chord: [57, 60, 64, 67], hook: [[0, 76, 2.8], [3, 79, 2], [6, 81, 1.7], [8, 84, 2.8], [11, 83, 1.6], [14, 79, 1.7]] },
        { bass: 41, chord: [57, 60, 64, 65], hook: [[0, 81, 3.8], [5, 77, 1.7], [7, 76, .9], [8, 72, 2.8], [12, 77, 3.5]] },
        { bass: 43, chord: [55, 60, 62, 69], hook: [[0, 74, 2.8], [3, 79, 2.5], [6, 81, 1.6], [8, 83, 2.7], [11, 79, .8]] },
    ],
};
const finaleScore = {
    pickup: [72, 77], finish: 89,
    bars: [
        { bass: 41, chord: [57, 60, 65, 67], hook: [[0, 77, 2.8], [3, 81, 2], [6, 84, 1.8], [8, 89, 3.1], [12, 88, 1.6], [14, 84, 1.6]] },
        { bass: 34, chord: [58, 62, 65, 69], hook: [[0, 82, 3.2], [4, 81, 1.7], [6, 77, 1.7], [8, 74, 2.9], [12, 77, 2.9]] },
        { bass: 36, chord: [60, 64, 67, 74], hook: [[0, 79, 2.9], [3, 84, 2.5], [6, 86, 1.6], [8, 88, 2.7], [11, 84, .8]] },
    ],
};
const rate = 22050;
const beat = beatMs / 1000;
const subdivision = beat / 4;
const endOfRound = (beatCount * beatMs + windowMs + 60) / 1000;
const tau = 2 * Math.PI;
const musicLevel = .88;
const voices = {
    bass: { attack: .013, release: .06, decay: 4.3, second: .64, third: .28 },
    keys: { attack: .029, release: .08, decay: 6.4, second: .23, third: .12 },
    lead: { attack: .017, release: .07, decay: 3.5, second: .33, third: .18 },
};
function addSignal(samples, at, length, signal) {
    const offset = Math.round(at * rate);
    const frames = Math.min(samples.length - offset, Math.ceil(length * rate));
    for (let i = 0; i < frames; i++) {
        const frame = offset + i;
        samples[frame] = (samples[frame] ?? 0) + signal(i / rate);
    }
}
function tone(samples, at, midi, length, level, voice) {
    const radians = tau * 440 * 2 ** ((midi - 69) / 12);
    const { attack, release, decay, second, third } = voices[voice];
    addSignal(samples, at, length, time => {
        const phase = radians * time;
        const fade = Math.min(1, time / attack, (length - time) / release);
        const amplitude = fade * (.48 + .52 * Math.exp(-decay * time));
        return level * amplitude * (Math.sin(phase) + second * Math.sin(2 * phase) + third * Math.sin(3 * phase));
    });
}
function keys(samples, at, chord, length, level) {
    for (const [index, midi] of chord.entries())
        tone(samples, at + index * .007, midi, length, level, 'keys');
}
function kick(samples, at, level) {
    addSignal(samples, at, .19, time => {
        const phase = tau * (50 * time + 60 * (1 - Math.exp(-32 * time)) / 32);
        return level * Math.sin(phase) * Math.min(1, time / .004) * Math.exp(-18 * time) * (1 - time / .19);
    });
}
function brush(samples, at, length, level, color) {
    let seed = 84113 + Math.round(at * rate);
    let previous = 0;
    addSignal(samples, at, length, time => {
        seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
        const value = seed / 2147483648;
        const filtered = value - previous * color;
        previous = value;
        return level * filtered * Math.min(1, time / .007) * (1 - time / length) ** 3;
    });
}
function pickup(samples, score, intro) {
    const first = score.bars[0];
    keys(samples, 0, first.chord, .54, .052);
    tone(samples, 0, first.bass, .44, .15, 'bass');
    tone(samples, 0, score.pickup[0], .41, .12, 'lead');
    tone(samples, .48, score.pickup[1], .14, .13, 'lead');
    if (intro === 'drums') {
        kick(samples, 0, .38);
        kick(samples, .325, .25);
        brush(samples, .45, .11, .13, .52);
    }
    else {
        kick(samples, 0, intro === 'whisper' ? .18 : .28);
        brush(samples, .325, .17, .047, .9);
        if (intro === 'whisper')
            tone(samples, .095, score.pickup[0] + 12, .36, .044, 'keys');
    }
}
function playBar(samples, bar, at, fanMix, last) {
    for (const step of (last ? [0, 6, 8] : [0, 6, 8, 14]))
        kick(samples, at(step), step === 0 ? .40 : .31);
    for (const step of (last ? [4] : [4, 12])) {
        brush(samples, at(step), .145, .16, .40);
        brush(samples, at(step) + .017, .11, .095, .52);
        tone(samples, at(step), 55, .095, .045, 'keys');
        keys(samples, at(step), bar.chord, .20, .047);
    }
    for (const step of (last ? [2, 5, 9, 10, 11] : [2, 5, 9, 10, 13, 15])) {
        brush(samples, at(step), step % 2 === 0 ? .085 : .051, step % 2 === 0 ? .059 : .039, .96);
    }
    for (const step of (last ? [0, 3, 6, 8, 10] : [0, 3, 6, 8, 11, 14])) {
        tone(samples, at(step) + .008, bar.bass + (step === 11 ? 12 : 0), step % 4 === 0 ? .36 : .21, .22, 'bass');
    }
    keys(samples, at(0), bar.chord, .60, .067);
    keys(samples, at(5), bar.chord, .31, .047);
    keys(samples, at(8), bar.chord, .51, .060);
    if (fanMix)
        keys(samples, at(10), bar.chord.map(midi => midi + 12), .23, .030);
    for (const [step, midi, steps] of bar.hook) {
        tone(samples, at(step), midi, steps * subdivision, step % 4 === 0 ? .19 : .154, 'lead');
        if (!last || step <= 8)
            tone(samples, at(step + 2.5), midi, .19, fanMix ? .045 : .027, 'keys');
    }
}
function makeBuffer(ctx, duration, write) {
    const buffer = ctx.createBuffer(1, Math.round(duration * rate), rate);
    const samples = buffer.getChannelData(0);
    write(samples);
    let peak = 0;
    for (const sample of samples)
        peak = Math.max(Math.abs(sample), peak);
    const level = .74 / peak;
    for (let i = 0; i < samples.length; i++) {
        const fade = Math.min(1, (samples.length - 1 - i) / (.035 * rate));
        samples[i] = (samples[i] ?? 0) * fade * level;
    }
    return buffer;
}
function arrange(ctx, score, intro, fanMix) {
    return makeBuffer(ctx, endOfRound, samples => {
        pickup(samples, score, intro);
        for (const [index, bar] of score.bars.entries()) {
            playBar(samples, bar, step => beat * (1 + 4 * index) + step * subdivision, fanMix, index === score.bars.length - 1);
        }
        const end = beatCount * beat;
        kick(samples, end, .36);
        tone(samples, end, score.bars[0].bass, .24, .19, 'bass');
        keys(samples, end, score.bars[0].chord, .23, .059);
        tone(samples, end, score.finish, .24, .19, 'lead');
    });
}
let context;
let playing;
let generation = 0;
let enabled = true;
const recordings = new Map();
export function setMusicEnabled(value) {
    enabled = value;
    if (playing && context)
        playing.output.gain.setTargetAtTime(enabled ? musicLevel : 0, context.currentTime, .008);
}
export function silence() {
    generation++;
    if (!playing)
        return;
    const { source, output } = playing;
    playing = undefined;
    source.onended = null;
    source.stop();
    source.disconnect();
    output.disconnect();
}
async function play(key, render) {
    silence();
    const pending = generation;
    if (!context || context.state === 'closed')
        context = new AudioContext();
    const ctx = context;
    await ctx.resume();
    if (pending !== generation)
        return;
    let buffer = recordings.get(key);
    if (!buffer) {
        buffer = render(ctx);
        recordings.set(key, buffer);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const output = ctx.createGain();
    output.gain.value = enabled ? musicLevel : 0;
    source.connect(output).connect(ctx.destination);
    playing = { source, output };
    source.onended = () => {
        if (playing?.source === source) {
            playing = undefined;
            source.disconnect();
            output.disconnect();
        }
    };
    source.start();
}
export async function previewIntro(intro) {
    try {
        await play('preview:' + intro, ctx => makeBuffer(ctx, beat, samples => pickup(samples, stage, intro)));
    }
    catch {
        const feedback = document.getElementById('feedback');
        if (feedback)
            feedback.textContent = document.documentElement.lang === 'ru' ? 'Звуковой предпросмотр недоступен.' : 'Ses önizlemesi açılamadı.';
    }
}
export async function melody(intro, fanMix = false, secret = false, finale = false) {
    const score = finale ? finaleScore : secret ? encore : stage;
    await play(`${finale ? 'finale' : secret ? 'encore' : 'stage'}:${intro}:${fanMix}`, ctx => arrange(ctx, score, intro, fanMix));
}
