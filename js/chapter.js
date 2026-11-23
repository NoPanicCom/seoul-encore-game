import { createChapterDance, restoreChapterDance, renderChapterDance, renderChapterDanceCard, handleChapterDanceAction, isChapterDanceSnapshot } from './chapter-dance.js';
import { chapterHongdaeAlbum, resetChapterHongdae } from './chapter-hongdae.js';
import { travelLook } from './travel-look.js';
import { studioMemberId } from './studio.js';
import { yunaCue } from './yuna-light.js';
import { worldAudio } from './world-audio.js';
const memory = new Map();
function read(key) {
    try {
        const raw = localStorage.getItem(key) ?? memory.get(key);
        return raw ? JSON.parse(raw) : null;
    }
    catch {
        const raw = memory.get(key);
        return raw ? JSON.parse(raw) : null;
    }
}
function write(key, data) {
    const raw = JSON.stringify(data);
    memory.set(key, raw);
    try {
        localStorage.setItem(key, raw);
    }
    catch { /* The current tab still holds the chapter. */ }
}
const keyFor = (role) => 'encore.chapter.v1.' + role;
const albumKey = 'encore.chapter-album.v1';
function newId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
const object = (v) => v !== null && typeof v === 'object';
function album() {
    const cards = read(albumKey);
    return Array.isArray(cards) ? cards.filter((c) => object(c) && typeof c.id === 'string' && isChapterDanceSnapshot(c.card)) : [];
}
export function chapterAlbum(lang) {
    const cards = album();
    const title = lang === 'ru' ? 'Наша сцена' : 'Bizim sahnemiz';
    return '<section class="chapter-scrapbook"><h3>' + title + '</h3>' + (cards.length ? cards.map(entry => renderChapterDanceCard(entry.card, lang)).join('') : '<p>' + (lang === 'ru' ? 'После выступления с Нари сделай снимок на память.' : 'Nari’yle sahneye çıktıktan sonra hatıra fotoğrafını çek.') + '</p>') + chapterHongdaeAlbum(lang) + '</section>';
}
export function resetChapter(role) {
    write(keyFor(role), { id: newId(), dance: createChapterDance() });
    resetChapterHongdae(role);
}
export function chapterSession(role) {
    const key = keyFor(role), stored = read(key);
    const id = object(stored) && typeof stored.id === 'string' && /^[a-z0-9]{5,40}$/.test(stored.id) ? stored.id : newId();
    const dance = restoreChapterDance(object(stored) ? stored.dance : null);
    function persist() {
        if (dance.snapshot && isChapterDanceSnapshot(dance.snapshot)) {
            const cards = album();
            if (!cards.some(c => c.id === id))
                write(albumKey, [{ id, card: dance.snapshot }, ...cards]);
        }
        write(key, { id, dance });
    }
    persist();
    function look(stick) {
        const member = studioMemberId(role);
        const costume = member ? travelLook(member) : null;
        const spot = role === 'yuna' ? yunaCue() : null;
        const light = spot?.startsWith('pearl') ? 'white' : spot?.startsWith('cyan') ? '#9de7ff' : spot?.startsWith('rose') ? 'pink' : stick === 'white-star' ? 'white' : stick === 'jisoo-cone' || stick === 'moon' ? 'lavender' : stick === 'star' ? 'gold' : 'pink';
        return { outfit: costume?.asset ?? (role === 'sofia' || role === 'blink' ? 'sofia' : 'walk/cast-' + role), pieces: costume?.pieces ?? [], light };
    }
    return { id, dance, persist, look };
}
export function mountChapterDancePanel(panel, lang, session, stick, stage, events) {
    const state = session.dance, look = session.look(stick);
    const ru = lang === 'ru';
    const label = (tr, russian) => ru ? russian : tr;
    let timer = 0, beat = 0;
    function paint() {
        panel.innerHTML = renderChapterDance(state, lang, look);
        const footer = document.createElement('div');
        footer.className = 'chapter-dance-nav';
        if (!stage && state.phase === 'ready') {
            footer.innerHTML = '<p>' + label('Nari elini uzatıyor. “Bu dansı ilk sahnemde birlikte yapalım mı?”', 'Нари протягивает руку. «Станцуем это вместе на моём первом концерте?»') + '</p><button type="button" data-chapter-join>' + label('Nari ile arenaya yürü', 'Пойти с Нари на арену') + ' →</button>';
        }
        else if (state.phase === 'complete') {
            footer.innerHTML = '<button data-act="chapter-album">' + label('Fotokartımı albümde aç', 'Открыть мою карточку в альбоме') + '</button><button data-chapter-concert>' + label('BLACKPINK konserine devam et', 'Продолжить концерт BLACKPINK') + ' →</button>';
        }
        footer.innerHTML += '<button class="chapter-leave" data-chapter-close>' + (stage ? label('Meydana dön', 'Вернуться на площадь') : label('Prova odasına dön', 'Вернуться в танцзал')) + '</button>';
        panel.append(footer);
    }
    if (stage && state.phase === 'ready') {
        handleChapterDanceAction(state, 'chapter-dance-start', look);
        session.persist();
    }
    paint();
    function groove() {
        if (document.hidden)
            return;
        if (state.phase === 'lesson' || state.phase === 'choose' || state.phase === 'live')
            worldAudio.groove(beat++);
    }
    timer = window.setInterval(groove, 580);
    const controller = new AbortController();
    panel.addEventListener('click', event => {
        const button = event.target instanceof Element ? event.target.closest('button') : null;
        if (!button)
            return;
        if (button.hasAttribute('data-chapter-join')) {
            events.ready();
            return;
        }
        if (button.hasAttribute('data-chapter-close')) {
            events.close();
            return;
        }
        if (button.hasAttribute('data-chapter-concert')) {
            events.concert();
            return;
        }
        if (button.dataset.act === 'chapter-album') {
            event.stopPropagation();
            events.album();
            return;
        }
        const action = button.dataset.act;
        if (!action || !action.startsWith('chapter-dance-'))
            return;
        // The gate is the only entry to the live performance.
        if (!stage && action === 'chapter-dance-start') {
            events.ready();
            return;
        }
        if (handleChapterDanceAction(state, action, look)) {
            worldAudio.cue(state.phase === 'complete' ? 'delivery' : 'spotlight');
            session.persist();
            paint();
        }
    }, { signal: controller.signal });
    return () => { controller.abort(); window.clearInterval(timer); };
}
