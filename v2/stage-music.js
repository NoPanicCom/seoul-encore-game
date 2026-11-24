const SAMPLE_RATE = 22050;
const TAU = 2 * Math.PI;
const INTRO_BEATS = 2;
const DEFAULT_BEAT_MS = 500;

// Dmaj9, E6, C#m7, F#m7. The opening phrase returns with a different ending.
const SCORE = [
  { bass: 38, chord: [54, 57, 61, 64], lead: [
    [0, 78, .72], [3, 76, .36], [5, 73, .39], [7, 76, .30],
    [8, 81, .68], [12, 80, .44], [14, 76, .38],
  ] },
  { bass: 40, chord: [56, 59, 61, 64], lead: [
    [0, 78, .45], [2, 76, .38], [4, 71, .72], [8, 73, .35],
    [10, 76, .52], [13, 80, .55],
  ] },
  { bass: 37, chord: [56, 59, 61, 64], lead: [
    [0, 78, .65], [3, 76, .34], [5, 73, .37], [7, 76, .33],
    [8, 83, .71], [12, 81, .52], [14, 80, .37],
  ] },
  { bass: 42, chord: [54, 57, 61, 64], lead: [
    [0, 76, .48], [3, 73, .44], [6, 69, .37], [8, 73, .45],
    [10, 76, .50], [12, 78, .80], [15, 73, .29],
  ] },
];

function mix(samples, offset, duration, wave) {
  const start = Math.round(offset * SAMPLE_RATE);
  const frames = Math.min(samples.length - start, Math.round(duration * SAMPLE_RATE));
  for (let index = 0; index < frames; index++) {
    samples[start + index] += wave(index / SAMPLE_RATE);
  }
}

function note(samples, at, duration, pitch, level, harmonics, attack = .014) {
  const radians = TAU * 440 * 2 ** ((pitch - 69) / 12);
  const [octave, fifth] = harmonics;
  mix(samples, at, duration, time => {
    const angle = radians * time;
    const shape = Math.sin(angle) + octave * Math.sin(2 * angle) + fifth * Math.sin(3 * angle);
    const envelope = Math.min(1, time / attack) * (1 - time / duration) ** 1.7;
    return level * shape * envelope;
  });
}

function noise(samples, at, duration, level, tint, attack = .004) {
  let seed = (Math.round(at * SAMPLE_RATE) + 29) | 0;
  let previous = 0;
  mix(samples, at, duration, time => {
    seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
    const current = seed / 2147483648;
    const shape = current - previous * tint;
    previous = current;
    return level * shape * Math.min(1, time / attack) * (1 - time / duration) ** 2.4;
  });
}

function kick(samples, at, level = .34) {
  mix(samples, at, .21, time => {
    const phase = TAU * (53 * time + 74 * (1 - Math.exp(-43 * time)) / 43);
    const envelope = Math.min(1, time / .003) * Math.exp(-14 * time) * (1 - time / .21);
    return level * (Math.sin(phase) + .21 * Math.sin(2 * phase)) * envelope;
  });
}

function clap(samples, at, level) {
  noise(samples, at, .052, level * .73, .44, .002);
  noise(samples, at + .012, .066, level * .81, .60, .002);
  noise(samples, at + .025, .078, level, .35, .005);
}

function master(samples, peakLevel) {
  let peak = 0;
  for (const sample of samples) peak = Math.max(peak, Math.abs(sample));
  const scale = peakLevel / peak;
  for (let index = 0; index < samples.length; index++) samples[index] *= scale;
}

function writeIntro(samples, beat) {
  const duration = INTRO_BEATS * beat;
  noise(samples, 0, duration, .18, .94, .65 * duration);
  const climb = [66, 69, 73, 76, 78, 81];
  climb.forEach((pitch, index) => {
    const at = index * beat * .26;
    note(samples, at, Math.min(.50, duration - at), pitch, .09 + index * .009, [.22, .11], .022);
  });
  kick(samples, beat, .21);
  clap(samples, 1.5 * beat, .08);
  clap(samples, 1.75 * beat, .10);
}

function writeGroove(samples, beat, solo) {
  for (const [index, bar] of SCORE.entries()) {
    const at = step => (INTRO_BEATS + index * 4 + step / 4) * beat;
    for (const step of (index === 3 ? [0, 3, 8, 11, 14] : [0, 6, 8, 10, 14])) kick(samples, at(step));
    for (const step of [4, 12]) {
      clap(samples, at(step), .16);
      note(samples, at(step), .078, 57, .072, [.39, .23]);
    }
    for (const step of [1, 2, 3, 6, 7, 9, 10, 11, 14, 15]) {
      const open = step % 4 === 2;
      noise(samples, at(step), open ? .085 : .037, open ? .058 : .036, .92);
    }
    for (const step of [0, 3, 6, 8, 10, 14]) {
      const pitch = bar.bass + (step === 10 ? 12 : 0);
      note(samples, at(step), (step === 0 ? .77 : .44) * beat, pitch, .21, [.57, .24], .008);
    }
    for (const step of [0, 3, 7, 10, 13]) {
      for (const [voice, pitch] of bar.chord.entries()) {
        note(samples, at(step) + voice * .008, (step === 0 ? .92 : .52) * beat,
          pitch, step === 0 ? .060 : .043, [.42, .14], .032);
      }
    }
    const soloHook = [[0,bar.chord[2]+12,.76],[5,bar.chord[1]+12,.32],
      [7,bar.chord[2]+12,.30],[10,bar.chord[3]+12,.55],[14,bar.chord[1]+12,.27]];
    for (const [step, pitch, duration] of solo ? soloHook : bar.lead) {
      note(samples, at(step), duration * beat, pitch, .152, [.38, .12], .011);
      note(samples, at(step) + beat * .37, duration * beat, pitch, .034, [.15, .06], .021);
    }
  }
}

function makeSong(context, beatMs, solo) {
  const beat = beatMs / 1000;
  const start = Math.round(INTRO_BEATS * beat * SAMPLE_RATE);
  const frames = Math.round((INTRO_BEATS + SCORE.length * 4) * beat * SAMPLE_RATE);
  const buffer = context.createBuffer(1, frames, SAMPLE_RATE);
  const samples = buffer.getChannelData(0);
  writeIntro(samples, beat);
  writeGroove(samples, beat, solo);
  // Ease the two score boundaries so changing or repeating sections stays quiet.
  const ramp = Math.round(.008 * SAMPLE_RATE);
  for (let frame = 0; frame < ramp; frame++) {
    const weight = frame / ramp;
    samples[start - frame - 1] *= weight;
    samples[start + frame] *= weight;
    samples[frames - frame - 1] *= weight;
  }
  master(samples, .66);
  return buffer;
}

function makeApplause(context) {
  const duration = 2.8;
  const buffer = context.createBuffer(1, Math.round(duration * SAMPLE_RATE), SAMPLE_RATE);
  const samples = buffer.getChannelData(0);
  let seed = 248793;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  noise(samples, .04, 2.6, .24, .15, .34);
  // Each pair of hands has its own cadence, slight timing changes and distance.
  for (let person = 0; person < 20; person++) {
    const rhythm = .18 + random() * .31;
    const strength = .025 + random() * .072;
    let at = .025 + random() * .59;
    while (at < duration - .12) {
      const swell = Math.min(1, at / .31, (duration - at) / .85);
      clap(samples, at, strength * swell * (.65 + random() * .50));
      at += rhythm * (.63 + random() * .70);
    }
  }
  master(samples, .61);
  return buffer;
}

let enabled = true;
let context;
let opening;
let music;
let applause;
let songBuffer;
let applauseBuffer;
let cachedBeat;
let cachedSolo;
let closeTimer;
let suspendedContext;
let command = 0;

function hidden() {
  return typeof document !== 'undefined' && document.hidden;
}

function report(error) {
  console.warn('Konser sesi kullanılamadı.', error);
}

function drop(playback) {
  if (!playback) return;
  playback.source.onended = null;
  playback.output.disconnect();
  playback.source.stop();
  playback.source.disconnect();
}

function stopPlayback() {
  command++;
  suspendedContext = undefined;
  drop(music);
  drop(applause);
  music = undefined;
  applause = undefined;
}

function closeContext() {
  clearTimeout(closeTimer);
  const active = context;
  context = undefined;
  opening = undefined;
  if (active && active.state !== 'closed') void active.close().catch(report);
}

function closeWhenQuiet() {
  clearTimeout(closeTimer);
  if (!context || music || applause) return;
  closeTimer = setTimeout(closeContext, 500);
}

function shutdown() {
  stopPlayback();
  closeContext();
}

// Call from a tap or key press on browsers that gate AudioContext.resume().
export async function unlockStageAudio() {
  if (!enabled || hidden() || typeof window === 'undefined') return false;
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return false;
  clearTimeout(closeTimer);
  if (context?.state === 'running') return true;
  if (opening) return opening;
  try {
    if (!context || context.state === 'closed') context = new Audio();
    const active = context;
    const pending = active.resume().then(() =>
      enabled && !hidden() && context === active && active.state === 'running'
    ).catch(error => {
      report(error);
      return false;
    }).finally(() => {
      if (opening === pending) opening = undefined;
    });
    opening = pending;
    return pending;
  } catch (error) {
    report(error);
    return false;
  }
}

function playback(buffer, volume, loopStart, offset = 0) {
  const source = context.createBufferSource();
  const output = context.createGain();
  source.buffer = buffer;
  output.gain.value = volume;
  if (loopStart !== undefined) {
    source.loop = true;
    source.loopStart = loopStart;
  }
  source.connect(output);
  output.connect(context.destination);
  source.start(0, offset);
  return {source, output};
}

export async function startStageMusic({beatMs = DEFAULT_BEAT_MS, offsetMs, solo = false} = {}) {
  const start = ++command;
  const ready = await unlockStageAudio();
  if (!ready || start !== command || !enabled || hidden() || context?.state !== 'running') return false;
  const tempo = Number.isFinite(beatMs) ? Math.min(800, Math.max(320, beatMs)) : DEFAULT_BEAT_MS;
  if (music && cachedBeat === tempo && cachedSolo === solo) return true;
  drop(music);
  drop(applause);
  music = undefined;
  applause = undefined;
  try {
    if (cachedBeat !== tempo || cachedSolo !== solo || !songBuffer) {
      songBuffer = makeSong(context, tempo, solo);
      cachedSolo = solo;
      cachedBeat = tempo;
    }
    const loopFrame = Math.round(INTRO_BEATS * tempo / 1000 * SAMPLE_RATE);
    const offset = offsetMs ? offsetMs()/1000 : 0;
    music = playback(songBuffer, .49, loopFrame / SAMPLE_RATE, offset);
    return true;
  } catch (error) {
    report(error);
    closeWhenQuiet();
    return false;
  }
}

// Keep the gesture-unlocked context for the silent beat before Lisa walks on.
export function silentStageBreak() {
  clearTimeout(closeTimer);
  stopPlayback();
}

export function stopStageMusic() {
  stopPlayback();
  closeWhenQuiet();
}

export function pauseStageMusic() {
  const active = context;
  if (!active || active.state === 'closed' || (!music && !opening) || suspendedContext === active) return;
  suspendedContext = active;
  // Suspending the clock keeps the current buffer source and playback position.
  void active.suspend().catch(error => {
    if (suspendedContext === active) suspendedContext = undefined;
    report(error);
  });
}

export function resumeStageMusic() {
  const active = suspendedContext;
  suspendedContext = undefined;
  if (!enabled || hidden() || !active || context !== active || active.state === 'closed') return;
  // Request resume in the closing gesture even if the preceding suspend is still pending.
  void active.resume().catch(report);
}

export function stageApplause() {
  if (!enabled || hidden() || context?.state !== 'running') return false;
  if (applause) return true;
  clearTimeout(closeTimer);
  try {
    if (!applauseBuffer) applauseBuffer = makeApplause(context);
    const crowd = playback(applauseBuffer, .39);
    applause = crowd;
    crowd.source.onended = () => {
      crowd.source.disconnect();
      crowd.output.disconnect();
      if (applause === crowd) applause = undefined;
      closeWhenQuiet();
    };
    return true;
  } catch (error) {
    report(error);
    closeWhenQuiet();
    return false;
  }
}

export function setStageSound(value) {
  enabled = Boolean(value);
  if (!enabled) shutdown();
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => { if (hidden()) shutdown(); });
}
if (typeof window !== 'undefined') window.addEventListener('pagehide', shutdown);
