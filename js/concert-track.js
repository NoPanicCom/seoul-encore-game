import { beatCount, windowMs } from './rules.js';
const minBpm = 30;
const maxBpm = 300;
const defaultBpm = 120;
const timingPrecisionMs = 0.000001;
const mimeByExtension = {
    mp3: 'audio/mpeg', m4a: 'audio/mp4', aac: 'audio/aac', wav: 'audio/wav',
};
const audioTypes = Object.values(mimeByExtension);
const libraryName = 'seoul-encore-concert-music';
const storeName = 'tracks';
const trackId = 'selected';
const copy = {
    tr: {
        heading: 'Konser müziği', original: 'Oyun müziği', pick: 'Telefondan şarkı seç', replace: 'Şarkıyı değiştir',
        guide: 'Dosyalar’dan MP3, M4A veya WAV seç. Şarkı bu cihazda kalır.',
        tempoLabel: 'Tempo (BPM)', startLabel: 'Başlangıç (sn)',
        timing: 'Şarkının BPM’ini ve bir vuruşa denk gelen başlangıç saniyesini gir.',
        preview: 'Önizle', stop: 'Önizlemeyi durdur', apply: 'Konserde kullan', reset: 'Oyun müziğine dön',
        loading: 'Şarkı açılıyor…',
        format: 'Bu dosya açılamadı. Çalınabilen bir MP3, M4A veya WAV seç.',
        previewError: 'Önizleme başlatılamadı. Başka bir ses dosyası seçebilirsin.',
        tempo: `Tempo ${minBpm} ile ${maxBpm} BPM arasında olmalı.`, start: 'Şarkının içinden bir başlangıç saniyesi seç.',
        short: 'Başlangıçtan sonra 12 vuruş için yer kalmalı. Başlangıcı geri al veya daha uzun bir şarkı seç.',
        session: 'Tarayıcı şarkıyı saklayamıyor. Seçtiğin şarkıyı bu oturumda kullanabilirsin.',
        restore: 'Kayıtlı şarkı açılamadı. Yeniden bir dosya seçebilirsin.',
        remove: 'Tarayıcı önceki kaydı silemedi. Sayfayı yeniden açtığında önceki şarkı görünebilir.',
        muted: 'Önizlemeyi duymak için üstten sesi aç.',
    },
    ru: {
        heading: 'Музыка концерта', original: 'Музыка игры', pick: 'Выбрать песню с телефона', replace: 'Выбрать другую песню',
        guide: 'Выбери MP3, M4A или WAV в «Файлах». Песня останется на этом устройстве.',
        tempoLabel: 'Темп (BPM)', startLabel: 'Начало (с)',
        timing: 'Введи темп песни и время начала, которое совпадает с ударом.',
        preview: 'Послушать', stop: 'Остановить', apply: 'Играть под эту песню', reset: 'Вернуть музыку игры',
        loading: 'Открываем песню…',
        format: 'Файл не открылся. Выбери MP3, M4A или WAV, который можно воспроизвести.',
        previewError: 'Не удалось включить предпрослушивание. Попробуй другой аудиофайл.',
        tempo: `Выбери темп от ${minBpm} до ${maxBpm} BPM.`, start: 'Выбери время начала в пределах песни.',
        short: 'После начала должно хватить времени на 12 ударов. Начни раньше или выбери песню подлиннее.',
        session: 'Браузер не может сохранить песню. Выбранный файл доступен до закрытия игры.',
        restore: 'Сохранённая песня не открылась. Можно выбрать файл снова.',
        remove: 'Браузер не смог удалить сохранённую песню. Она может появиться при повторном открытии игры.',
        muted: 'Чтобы услышать песню, включи звук сверху.',
    },
};
let selected = null;
let playing = null;
let sound = true;
let initialization;
let initialized = false;
let storageStatus = 'ready';
let saveQueue = Promise.resolve();
let revision = 0;
const observers = new Set();
export function concertTrackSettingsIssue(duration, bpm, start) {
    if (!Number.isFinite(bpm) || bpm < minBpm || bpm > maxBpm)
        return 'tempo';
    if (!Number.isFinite(start) || start < 0 || start >= duration)
        return 'start';
    if (!Number.isFinite(duration) || (duration - start) * 1000 + timingPrecisionMs < roundEnd(bpm))
        return 'short';
    return null;
}
function roundEnd(bpm) {
    return beatCount * (60000 / bpm) + windowMs + 60;
}
function openLibrary() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(libraryName, 1);
        let blocked = false;
        request.onupgradeneeded = () => { request.result.createObjectStore(storeName); };
        request.onsuccess = () => {
            if (blocked)
                request.result.close();
            else {
                request.result.onversionchange = () => request.result.close();
                resolve(request.result);
            }
        };
        request.onerror = () => reject(request.error);
        request.onblocked = () => {
            blocked = true;
            reject(new Error('Concert music storage is blocked'));
        };
    });
}
async function transact(mode, operate) {
    const library = await openLibrary();
    try {
        return await new Promise((resolve, reject) => {
            const transaction = library.transaction(storeName, mode);
            const request = operate(transaction.objectStore(storeName));
            transaction.oncomplete = () => resolve(request.result);
            transaction.onabort = () => reject(transaction.error ?? request.error);
        });
    }
    finally {
        library.close();
    }
}
function hasTrackSettings(value) {
    return Boolean(value && 'name' in value && typeof value.name === 'string' && value.name.length > 0
        && 'key' in value && typeof value.key === 'string' && /^[0-9a-f]{32}$/.test(value.key)
        && 'bpm' in value && typeof value.bpm === 'number' && 'start' in value && typeof value.start === 'number');
}
function readTrack(value) {
    if (!hasTrackSettings(value))
        return null;
    const { name, bpm, start, key } = value;
    if ('file' in value && value.file instanceof Blob && value.file.size > 0 && audioTypes.includes(value.file.type)) {
        return { name, bpm, start, key, file: value.file };
    }
    if ('bytes' in value && value.bytes instanceof ArrayBuffer && value.bytes.byteLength > 0
        && 'mime' in value && typeof value.mime === 'string' && audioTypes.includes(value.mime)) {
        return { name, bpm, start, key, file: new Blob([value.bytes], { type: value.mime }) };
    }
    return null;
}
async function saveTrack(track) {
    try {
        await transact('readwrite', store => store.put(track, trackId));
    }
    catch (error) {
        if (!(error instanceof DOMException) || error.name !== 'UnknownError')
            throw error;
        // WebKit can reject Blob writes in a temporary browsing session while still accepting bytes.
        const { file, ...settings } = track;
        const bytes = await file.arrayBuffer();
        await transact('readwrite', store => store.put({ ...settings, bytes, mime: file.type }, trackId));
    }
}
function notify() {
    for (const observer of observers)
        observer();
}
function writeSelection(track) {
    const current = ++revision;
    saveQueue = saveQueue.then(async () => {
        let status = 'ready';
        try {
            if (track)
                await saveTrack(track);
            else
                await transact('readwrite', store => store.delete(trackId));
        }
        catch {
            status = track ? 'session' : 'remove';
        }
        if (current === revision) {
            storageStatus = status;
            notify();
        }
    });
}
function disposeMedia(media) {
    media.audio.pause();
    media.audio.removeAttribute('src');
    media.audio.load();
    URL.revokeObjectURL(media.url);
}
function prepareMedia(file, signal) {
    const audio = new Audio();
    const media = { audio, url: URL.createObjectURL(file) };
    audio.preload = 'metadata';
    return new Promise((resolve, reject) => {
        const clear = () => {
            window.clearTimeout(timeout);
            audio.removeEventListener('loadedmetadata', ready);
            audio.removeEventListener('error', failed);
            signal?.removeEventListener('abort', failed);
        };
        const failed = () => {
            clear();
            disposeMedia(media);
            reject(new Error('Concert music could not be decoded'));
        };
        const ready = () => {
            if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
                failed();
                return;
            }
            clear();
            resolve(media);
        };
        const timeout = window.setTimeout(failed, 12000);
        audio.addEventListener('loadedmetadata', ready);
        audio.addEventListener('error', failed);
        signal?.addEventListener('abort', failed);
        if (signal?.aborted)
            failed();
        else {
            audio.src = media.url;
            audio.load();
        }
    });
}
export function initConcertTrack() {
    if (initialization)
        return initialization;
    document.addEventListener('visibilitychange', () => {
        if (document.hidden)
            stopConcertTrack();
    });
    window.addEventListener('pagehide', stopConcertTrack);
    initialization = (async () => {
        try {
            const stored = await transact('readonly', store => store.get(trackId)).catch(() => {
                storageStatus = 'session';
                return undefined;
            });
            if (stored === undefined)
                return;
            const track = readTrack(stored);
            if (!track)
                throw new Error('Invalid saved concert music');
            const media = await prepareMedia(track.file);
            if (concertTrackSettingsIssue(media.audio.duration, track.bpm, track.start)) {
                disposeMedia(media);
                throw new Error('Invalid saved concert timing');
            }
            selected = { ...track, media };
        }
        catch {
            storageStatus = 'restore';
        }
        finally {
            initialized = true;
            notify();
        }
    })();
    return initialization;
}
export function activeConcertTrack() {
    return selected ? { name: selected.name, beatMs: 60000 / selected.bpm, key: selected.key } : null;
}
export function stopConcertTrack() {
    const previous = playing;
    playing = null;
    if (previous) {
        previous.media.audio.pause();
        previous.onStop?.();
    }
}
async function startPlayback(next) {
    stopConcertTrack();
    const { audio } = next.media;
    playing = next;
    try {
        audio.currentTime = next.start;
        audio.muted = !sound;
        await audio.play();
    }
    catch (error) {
        if (playing === next)
            stopConcertTrack();
        throw error;
    }
}
export async function playConcertTrack() {
    if (!selected)
        throw new Error('No concert music selected');
    await startPlayback({ media: selected.media, start: selected.start });
}
export function isConcertTrackPlaying() {
    return Boolean(playing && !playing.onStop && !playing.media.audio.paused && !playing.media.audio.ended);
}
export function concertTrackElapsed() {
    if (!playing || playing.onStop)
        return 0;
    const { audio } = playing.media;
    const elapsed = Math.max(0, (audio.currentTime - playing.start) * 1000);
    if (audio.ended && selected) {
        const finish = roundEnd(selected.bpm);
        if (elapsed + timingPrecisionMs >= finish)
            return Math.max(elapsed, finish);
    }
    return elapsed;
}
export function setConcertTrackSound(enabled) {
    sound = enabled;
    if (playing)
        playing.media.audio.muted = !enabled;
    notify();
}
export function renderConcertTrack(lang) {
    const labels = copy[lang];
    return `<section class="concert-track" data-concert-track>
    <details>
      <summary>
        <span class="concert-track-icon" aria-hidden="true">♫</span>
        <span class="concert-track-summary"><strong>${labels.heading}</strong><span data-track-name>${labels.original}</span></span>
        <span class="concert-track-chevron" aria-hidden="true"></span>
      </summary>
      <div class="concert-track-body">
        <p>${labels.guide}</p>
        <button type="button" data-track-pick>${labels.pick}</button>
        <input type="file" data-track-file accept=".mp3,.m4a,.aac,.wav,audio/mpeg,audio/mp4,audio/x-m4a,audio/aac,audio/wav,audio/x-wav" hidden>
        <div class="concert-track-settings" data-track-settings hidden>
          <strong data-track-draft></strong>
          <p>${labels.timing}</p>
          <div class="concert-track-grid">
            <label>${labels.tempoLabel}<input type="number" inputmode="decimal" data-track-bpm min="${minBpm}" max="${maxBpm}" step=".01"></label>
            <label>${labels.startLabel}<input type="number" inputmode="decimal" data-track-start min="0" step=".01"></label>
          </div>
          <div class="concert-track-grid">
            <button type="button" data-track-preview>${labels.preview}</button>
            <button type="button" data-track-use>${labels.apply}</button>
          </div>
          <p data-track-muted hidden>${labels.muted}</p>
        </div>
        <button type="button" data-track-reset hidden>${labels.reset}</button>
      </div>
    </details>
    <p class="concert-track-status" data-track-status role="status" hidden></p>
  </section>`;
}
function fileType(file) {
    const extension = /\.([^.]+)$/.exec(file.name)?.[1]?.toLowerCase();
    if (extension && Object.prototype.hasOwnProperty.call(mimeByExtension, extension))
        return mimeByExtension[extension];
    if (audioTypes.includes(file.type))
        return file.type;
    return undefined;
}
function trackKey() {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}
export function mountConcertTrack(root, lang, onChange) {
    const panel = root.matches('[data-concert-track]') ? root : root.querySelector('[data-concert-track]');
    if (!panel)
        return () => { };
    const name = panel.querySelector('[data-track-name]');
    const pick = panel.querySelector('[data-track-pick]');
    const fileInput = panel.querySelector('[data-track-file]');
    const settings = panel.querySelector('[data-track-settings]');
    const draftName = panel.querySelector('[data-track-draft]');
    const bpm = panel.querySelector('[data-track-bpm]');
    const offset = panel.querySelector('[data-track-start]');
    const preview = panel.querySelector('[data-track-preview]');
    const apply = panel.querySelector('[data-track-use]');
    const reset = panel.querySelector('[data-track-reset]');
    const status = panel.querySelector('[data-track-status]');
    const muted = panel.querySelector('[data-track-muted]');
    if (!name || !pick || !fileInput || !settings || !draftName || !bpm || !offset || !preview || !apply || !reset || !status || !muted)
        return () => { };
    const controls = { name, pick, settings, draftName, bpm, offset, apply, reset, status, preview, muted };
    const labels = copy[lang];
    const listeners = new AbortController();
    let pending;
    let draft = selected;
    let fromSelection = selected;
    let previewPlayback;
    let timer = 0;
    let notice = '';
    let edited = false;
    const timingIssue = () => draft && concertTrackSettingsIssue(draft.media.audio.duration, bpm.valueAsNumber, offset.valueAsNumber);
    const hasChanges = () => !!draft && (draft !== selected || bpm.valueAsNumber !== selected?.bpm || offset.valueAsNumber !== selected?.start);
    const canAudition = () => !!draft && Number.isFinite(offset.valueAsNumber) && offset.valueAsNumber >= 0 && offset.valueAsNumber < draft.media.audio.duration;
    const showSettings = (next, tempo = defaultBpm, start = 0) => {
        draft = next;
        controls.bpm.value = String(tempo);
        controls.offset.value = String(start);
        edited = false;
    };
    const sync = () => {
        if (fromSelection !== selected) {
            fromSelection = selected;
            showSettings(selected, selected?.bpm, selected?.start);
        }
        const issue = timingIssue();
        controls.name.textContent = selected?.name ?? labels.original;
        controls.pick.textContent = draft ? labels.replace : labels.pick;
        controls.pick.disabled = !initialized;
        controls.settings.hidden = !draft;
        controls.draftName.hidden = !draft || draft === selected;
        controls.draftName.textContent = draft?.name ?? '';
        controls.apply.disabled = !!pending || !hasChanges() || !!issue;
        controls.preview.disabled = !!pending || (!previewPlayback && !canAudition());
        controls.preview.textContent = previewPlayback ? labels.stop : labels.preview;
        controls.reset.hidden = !selected;
        controls.muted.hidden = sound || !draft;
        const persistenceMessage = storageStatus === 'ready' ? '' : labels[storageStatus];
        controls.status.textContent = notice || (edited && issue ? labels[issue] : persistenceMessage);
        controls.status.hidden = !controls.status.textContent;
    };
    showSettings(selected, selected?.bpm, selected?.start);
    observers.add(sync);
    sync();
    void initConcertTrack();
    const stopPreview = () => {
        if (previewPlayback && playing === previewPlayback)
            stopConcertTrack();
    };
    const discardDraft = () => {
        if (draft && draft.media !== selected?.media)
            disposeMedia(draft.media);
    };
    pick.addEventListener('click', () => fileInput.click(), { signal: listeners.signal });
    fileInput.addEventListener('change', () => {
        const file = fileInput.files?.item(0);
        fileInput.value = '';
        if (!file)
            return;
        pending?.abort();
        pending = undefined;
        stopPreview();
        const type = fileType(file);
        if (!type || !file.size) {
            notice = labels.format;
            sync();
            return;
        }
        const read = new AbortController();
        pending = read;
        const blob = file.slice(0, file.size, type);
        notice = labels.loading;
        sync();
        void prepareMedia(blob, read.signal).then(media => {
            if (read.signal.aborted) {
                disposeMedia(media);
                return;
            }
            discardDraft();
            const title = file.name.replace(/\.[^.]+$/, '').trim() || file.name;
            showSettings({ file: blob, name: title, media });
            edited = true;
            notice = '';
        }, () => {
            if (!read.signal.aborted)
                notice = labels.format;
        }).finally(() => {
            if (pending === read) {
                pending = undefined;
                sync();
            }
        });
    }, { signal: listeners.signal });
    settings.addEventListener('input', () => {
        stopPreview();
        notice = '';
        edited = true;
        sync();
    }, { signal: listeners.signal });
    preview.addEventListener('click', () => {
        if (previewPlayback) {
            stopPreview();
            return;
        }
        if (!draft || !canAudition())
            return;
        notice = '';
        const next = { media: draft.media, start: offset.valueAsNumber, onStop: () => {
                window.clearTimeout(timer);
                next.media.audio.removeEventListener('ended', stopPreview);
                previewPlayback = undefined;
                sync();
            } };
        previewPlayback = next;
        next.media.audio.addEventListener('ended', stopPreview);
        void startPlayback(next).then(() => {
            if (previewPlayback === next)
                timer = window.setTimeout(stopPreview, 6000);
        }, error => {
            if (!listeners.signal.aborted && !(error instanceof DOMException && error.name === 'AbortError')) {
                notice = labels.previewError;
                sync();
            }
        });
        sync();
    }, { signal: listeners.signal });
    apply.addEventListener('click', () => {
        if (!draft || !hasChanges() || timingIssue())
            return;
        stopConcertTrack();
        const { media, file, name: title } = draft;
        const previous = selected;
        const stored = { file, name: title, bpm: bpm.valueAsNumber, start: offset.valueAsNumber, key: trackKey() };
        selected = { ...stored, media };
        if (previous && previous.media !== media)
            disposeMedia(previous.media);
        storageStatus = 'ready';
        notice = '';
        writeSelection(stored);
        notify();
        onChange();
    }, { signal: listeners.signal });
    reset.addEventListener('click', () => {
        pending?.abort();
        pending = undefined;
        stopConcertTrack();
        discardDraft();
        if (selected)
            disposeMedia(selected.media);
        selected = null;
        storageStatus = 'ready';
        notice = '';
        writeSelection(null);
        notify();
        onChange();
    }, { signal: listeners.signal });
    return () => {
        observers.delete(sync);
        listeners.abort();
        pending?.abort();
        pending = undefined;
        stopPreview();
        discardDraft();
    };
}
