const sampleRate = 22050;
const beat = 60 / 110;
const sixteenth = beat / 4;
const barLength = 4 * beat;
const tau = Math.PI * 2;
// Am7, Fmaj7, Cmaj7, Gadd9. The hook answers itself across the four bars.
const score = [
    { bass: 33, chord: [57, 60, 64, 67], hook: [[0, 76, .5], [3, 79, .4], [6, 81, .52], [8, 84, .7], [11, 83, .42], [14, 81, .64]] },
    { bass: 29, chord: [53, 57, 60, 64], hook: [[0, 81, .68], [3, 76, .48], [6, 79, .45], [9, 77, .55], [12, 76, .42], [15, 72, .28]] },
    { bass: 36, chord: [55, 59, 60, 64], hook: [[0, 76, .53], [3, 79, .42], [6, 86, .5], [8, 84, .74], [11, 79, .4], [14, 76, .62]] },
    { bass: 31, chord: [55, 59, 62, 69], hook: [[0, 74, .52], [3, 71, .42], [6, 74, .54], [8, 79, .7], [11, 81, .4], [14, 83, .63]] },
];
function frequency(midi) {
    return 440 * 2 ** ((midi - 69) / 12);
}
function addWave(samples, offset, length, wave) {
    const first = Math.round(offset * sampleRate);
    const count = Math.round(length * sampleRate);
    for (let frame = 0; frame < count; frame++) {
        const index = (first + frame) % samples.length;
        samples[index] = (samples[index] ?? 0) + wave(frame / sampleRate);
    }
}
function synth(samples, offset, length, midi, level, harmonics, attack = .008) {
    const radians = tau * frequency(midi);
    const [second, third] = harmonics;
    addWave(samples, offset, length, t => {
        const phase = radians * t;
        const wave = Math.sin(phase) + second * Math.sin(phase * 2) + third * Math.sin(phase * 3);
        const envelope = Math.min(1, t / attack) * (1 - t / length) ** 2;
        return level * envelope * wave;
    });
}
function kick(samples, offset) {
    addWave(samples, offset, .22, t => {
        const phase = tau * (46 * t + 77 * (1 - Math.exp(-41 * t)) / 41);
        return .39 * Math.min(1, t / .003) * Math.exp(-15 * t) * (1 - t / .22) * Math.sin(phase);
    });
}
function noise(samples, offset, length, level, color) {
    let seed = 123457 + Math.floor(offset * sampleRate);
    let previous = 0;
    addWave(samples, offset, length, t => {
        seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
        const value = seed / 2147483648;
        const filtered = value - previous * color;
        previous = value;
        return level * filtered * Math.min(1, t / .004) * (1 - t / length) ** 3;
    });
}
function compose(context) {
    const buffer = context.createBuffer(1, Math.round(score.length * barLength * sampleRate), sampleRate);
    const samples = buffer.getChannelData(0);
    for (const [index, bar] of score.entries()) {
        const start = index * barLength;
        const at = (step) => start + step * sixteenth;
        for (const step of (index === 3 ? [0, 6, 8, 13, 15] : [0, 6, 8, 14]))
            kick(samples, at(step));
        for (const step of [4, 12]) {
            noise(samples, at(step), .14, .13, .34);
            noise(samples, at(step) + .014, .095, .07, .51);
            synth(samples, at(step), .075, 54, .09, [.28, .16]);
        }
        for (const step of [0, 2, 3, 6, 8, 10, 11, 14, 15]) {
            noise(samples, at(step), step % 4 === 2 ? .081 : .044, step % 2 === 0 ? .065 : .035, .92);
        }
        for (const step of [0, 3, 6, 8, 11, 14]) {
            synth(samples, at(step) + .009, step % 4 === 0 ? .29 : .21, bar.bass + (step === 11 ? 12 : 0), .19, [.54, .27]);
        }
        for (const step of [0, 5, 10, 14]) {
            for (const [voice, midi] of bar.chord.entries()) {
                synth(samples, at(step) + .009 * voice, step === 0 ? .55 : .29, midi, step === 0 ? .061 : .042, [.31, .08], .028);
            }
        }
        for (const [step, midi, length] of bar.hook) {
            synth(samples, at(step), length * beat, midi, .13, [.26, .11]);
            synth(samples, at(step) + 3 * sixteenth, .21, midi, .022, [.15, .04]);
        }
    }
    let peak = 0;
    for (const sample of samples)
        peak = Math.max(peak, Math.abs(sample));
    const scale = .54 / peak;
    for (const [index, sample] of samples.entries())
        samples[index] = sample * scale;
    return buffer;
}
let enabled = true;
let context;
let loop;
let air;
let mix;
let activation;
function openMix(ctx) {
    loop ?? (loop = compose(ctx));
    const output = ctx.createGain();
    output.gain.value = .72;
    output.connect(ctx.destination);
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -16;
    limiter.knee.value = 10;
    limiter.ratio.value = 5;
    limiter.attack.value = .003;
    limiter.release.value = .13;
    limiter.connect(output);
    const musicGain = ctx.createGain();
    musicGain.gain.setValueAtTime(0, ctx.currentTime);
    musicGain.gain.linearRampToValueAtTime(.64, ctx.currentTime + .09);
    musicGain.connect(limiter);
    const music = ctx.createBufferSource();
    music.buffer = loop;
    music.loop = true;
    music.connect(musicGain);
    music.start();
    return { context: ctx, output, limiter, music, musicGain, voices: new Set(), recent: new Map() };
}
function closeMix() {
    if (!mix)
        return;
    mix.output.disconnect();
    mix.music.stop();
    mix.music.disconnect();
    mix.musicGain.disconnect();
    mix.limiter.disconnect();
    for (const voice of mix.voices)
        voice.stop();
    mix = undefined;
}
function hidden() {
    return typeof document !== 'undefined' && document.hidden;
}
function reportAudioFailure(error) {
    console.warn('Oyun odası sesi kullanılamadı.', error);
}
function exit() {
    activation = undefined;
    closeMix();
    if (context && context.state !== 'closed')
        void context.suspend().catch(reportAudioFailure);
}
function enter() {
    if (!enabled || hidden() || typeof AudioContext === 'undefined' || mix)
        return Promise.resolve();
    if (activation)
        return activation;
    try {
        if (!context || context.state === 'closed') {
            const created = new AudioContext();
            created.addEventListener('statechange', () => {
                if (mix?.context === created && created.state !== 'running')
                    closeMix();
            });
            context = created;
        }
        const ctx = context;
        const pending = ctx.resume().then(() => {
            if (activation === pending && enabled && !hidden() && ctx.state === 'running')
                mix = openMix(ctx);
        }).catch(reportAudioFailure).finally(() => {
            if (activation === pending)
                activation = undefined;
        });
        activation = pending;
        return pending;
    }
    catch (error) {
        if (error instanceof Error)
            reportAudioFailure(error);
        return Promise.resolve();
    }
}
function voice(mixer, source, shape, start, length) {
    source.connect(shape).connect(mixer.limiter);
    mixer.voices.add(source);
    source.onended = () => {
        mixer.voices.delete(source);
        source.disconnect();
        shape.disconnect();
    };
    source.start(start);
    source.stop(start + length);
}
function envelope(mixer, start, length, peak) {
    const shape = mixer.context.createGain();
    shape.gain.setValueAtTime(.0001, start);
    shape.gain.exponentialRampToValueAtTime(peak, start + .009);
    shape.gain.exponentialRampToValueAtTime(.0001, start + length);
    return shape;
}
function ring(mixer, start, pitch, length, peak, wave = 'sine', endPitch = pitch) {
    const oscillator = mixer.context.createOscillator();
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(pitch, start);
    oscillator.frequency.exponentialRampToValueAtTime(endPitch, start + length);
    voice(mixer, oscillator, envelope(mixer, start, length, peak), start, length);
}
function brush(mixer, start, length, peak) {
    if (!air) {
        air = mixer.context.createBuffer(1, sampleRate, sampleRate);
        noise(air.getChannelData(0), 0, 1, .54, .36);
    }
    const source = mixer.context.createBufferSource();
    source.buffer = air;
    voice(mixer, source, envelope(mixer, start, length, peak), start, length);
}
const repeatDelay = {
    step: .16, pixel: .26, delivery: .37, spotlight: .28, curtain: 1.05, note: .074,
};
function useCue(key, play) {
    const mixer = mix;
    if (!mixer || mixer.context.state !== 'running' || hidden())
        return;
    const now = mixer.context.currentTime;
    if (now - (mixer.recent.get(key) ?? -Infinity) < repeatDelay[key])
        return;
    mixer.recent.set(key, now);
    play(mixer, now + .012);
}
function cue(event) {
    useCue(event, (mixer, start) => {
        switch (event) {
            case 'step':
                ring(mixer, start, 136, .083, .072, 'triangle', 79);
                brush(mixer, start, .053, .062);
                break;
            case 'pixel':
                ring(mixer, start, 640, .105, .094, 'sine', 850);
                ring(mixer, start + .085, 960, .13, .075, 'triangle', 630);
                break;
            case 'delivery':
                for (const [index, midi] of [69, 72, 76].entries()) {
                    ring(mixer, start + index * .072, frequency(midi), .25, .105, 'triangle');
                }
                break;
            case 'spotlight':
                ring(mixer, start, frequency(76), .16, .115, 'triangle');
                ring(mixer, start + .095, frequency(81), .29, .133, 'triangle');
                break;
            case 'curtain':
                brush(mixer, start, .205, .16);
                ring(mixer, start, frequency(57), .31, .13, 'sine', frequency(69));
                for (const [index, midi] of [57, 64, 69, 72, 76].entries()) {
                    ring(mixer, start + .16 + .022 * index, frequency(midi), .49, .087, 'triangle');
                }
                break;
        }
    });
}
function note(index) {
    const pitches = [69, 74, 81];
    const pitch = frequency(pitches[index]);
    useCue('note', (mixer, start) => {
        ring(mixer, start, pitch, .15, .15, 'triangle');
        ring(mixer, start + .014, pitch * 2, .09, .038);
    });
}
export const worldAudio = {
    // Call directly from a user gesture. Idempotent during an active room visit.
    enter,
    exit,
    cue,
    note,
    setEnabled(value) {
        enabled = value;
        if (!value)
            exit();
    },
};
if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => { if (document.hidden)
        exit(); });
}
if (typeof window !== 'undefined')
    window.addEventListener('pagehide', exit);
