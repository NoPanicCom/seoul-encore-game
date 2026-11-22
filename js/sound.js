import { beatCount, beatMs } from './rules.js';
let context;
let bus;
let generation = 0;
let enabled = true;
export function setMusicEnabled(value) {
    enabled = value;
    if (bus && context)
        bus.gain.setTargetAtTime(enabled ? .17 : 0, context.currentTime, .008);
}
export function silence() {
    generation++;
    bus?.disconnect();
    bus = undefined;
}
async function instrument() {
    silence();
    const pending = generation;
    context ?? (context = new AudioContext());
    await context.resume();
    if (pending !== generation)
        return null;
    const ctx = context;
    const output = ctx.createGain();
    output.gain.value = enabled ? .17 : 0;
    output.connect(ctx.destination);
    bus = output;
    return (pitch, time, length, type, volume, slide = 1) => {
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.type = type;
        const attack = ctx.currentTime + time;
        osc.frequency.setValueAtTime(pitch, attack);
        if (slide !== 1)
            osc.frequency.exponentialRampToValueAtTime(pitch * slide, attack + length);
        env.gain.setValueAtTime(.0001, attack);
        env.gain.exponentialRampToValueAtTime(volume, attack + .012);
        env.gain.exponentialRampToValueAtTime(.0001, attack + length);
        osc.connect(env).connect(output);
        osc.start(attack);
        osc.stop(attack + length + .02);
        osc.onended = () => { osc.disconnect(); env.disconnect(); };
    };
}
export async function previewIntro(intro) {
    try {
        const note = await instrument();
        if (!note)
            return;
        for (let i = 0; i < 4; i++) {
            if (intro === 'drums')
                note(145, i * .18, .15, 'sine', .76, .32);
            else
                note(349.23 * 2 ** (i / 6), i * .18, .31, 'sine', .3);
        }
    }
    catch {
        const feedback = document.getElementById('feedback');
        if (feedback)
            feedback.textContent = document.documentElement.lang === 'ru' ? 'Звуковой предпросмотр недоступен.' : 'Ses önizlemesi açılamadı.';
    }
}
export async function melody(intro, fanMix = false, secret = false) {
    const note = await instrument();
    if (!note)
        return;
    const pitches = secret ? [392, 493.88, 587.33, 659.25, 523.25, 659.25, 783.99, 659.25, 440, 523.25, 587.33, 783.99] : [293.66, 349.23, 440, 392, 349.23, 523.25, 440, 392, 293.66, 349.23, 392, 293.66];
    if (intro === 'whisper')
        note(587.32, 0, .58, 'sine', .26);
    if (intro === 'drums')
        for (let i = 0; i < 3; i++)
            note(150, i * .18, .14, 'sine', .64, .33);
    const chords = secret ? [[196, 246.94, 293.66], [130.81, 164.81, 196], [146.83, 185, 220]] : [[146.83, 174.61, 220], [116.54, 146.83, 174.61], [130.81, 164.81, 196]];
    for (const [i, pitch] of pitches.slice(0, beatCount).entries()) {
        const time = (i + 1) * beatMs / 1000;
        note(pitch, time, .34, 'triangle', .54);
        const chord = chords[Math.floor(i / 4)];
        if (fanMix && chord) {
            const offbeat = time + beatMs / 2000;
            note(chord[0] / 2, time, .35, 'sine', .68);
            for (const tone of chord)
                note(tone * 2, offbeat, .21, 'triangle', .15);
            if (i % 2 === 1)
                note(198, time, .09, 'triangle', .38, .48);
        }
        else
            note(pitch / 4, time, .32, 'sine', .72);
        note(136, time, .18, 'sine', .85, .34);
        note(2200, time + .32, .04, 'triangle', .12, .48);
        if (i % 2 === 1)
            note(pitch * 1.5, time + .32, .15, 'sine', .32);
    }
}
