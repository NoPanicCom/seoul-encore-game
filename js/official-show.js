import { line } from './story.js';
const tracks = [
    { id: 'pink-venom', title: 'Pink Venom', video: 'gQlMMD8auMs' },
    { id: 'shut-down', title: 'Shut Down', video: 'POe9SOEKotk' },
    { id: 'how-you-like-that', title: 'How You Like That', video: 'ioNng23DkIM' },
];
const firstTrack = tracks[0];
const copy = {
    title: line('BLACKPINK’in resmî klipleri', 'Официальные клипы BLACKPINK'),
    lisa: line('Lisa dansı bitirdi, menajerden mikrofonu aldı. Şimdi vokal sırası!', 'Лиса закончила танец и взяла микрофон у менеджера. Пора петь!'),
    choose: line('Klip seç', 'Выбрать клип'),
    link: line('YouTube’da resmî klibi aç', 'Открыть официальный клип на YouTube'),
    rhythm: line('Ritim modunda oyna', 'Играть в режиме ритма'),
    home: line('Ana ekrana dön', 'На главную'),
    finish: line('Konser finaline geç', 'Перейти к финалу концерта'),
};
function watchUrl(track) {
    return `https://www.youtube.com/watch?v=${track.video}`;
}
export function renderOfficialShow(lang, lisa, liveStageMarkup) {
    const stage = lisa && liveStageMarkup ? `<div class="official-stage live-stage" data-playing="true">${liveStageMarkup}</div>` : `<figure class="official-poster">
    <img class="official-poster-stage" src="art/mainstage.webp" alt="" width="1080" height="720">
    <div class="official-poster-cast" aria-hidden="true"><img src="art/world/concert-quartet.webp" alt="" width="720" height="804"></div>
  </figure>`;
    return `<section id="official-show" aria-labelledby="official-show-title">
    <h2 id="official-show-title">${copy.title[lang]}</h2>
    ${lisa ? `<p class="official-lisa-intro">${copy.lisa[lang]}</p>` : ''}
    ${stage}
    <div class="official-tracks" role="group" aria-label="${copy.choose[lang]}">
      ${tracks.map(track => `<button type="button" data-official-track="${track.id}" aria-pressed="${track === firstTrack}">${track.title}</button>`).join('')}
    </div>
    <a class="official-link" data-official-link href="${watchUrl(firstTrack)}" target="_blank" rel="noopener noreferrer">
      <span><strong data-official-title>${firstTrack.title}</strong><span>${copy.link[lang]}</span></span>
      <span class="official-link-icon" aria-hidden="true">↗</span>
    </a>
    <div class="official-actions">
      ${lisa ? `<button type="button" class="primary" data-act="official-finish">${copy.finish[lang]}</button>` : ''}
      <button type="button" class="secondary" data-act="official-return">${(lisa ? copy.rhythm : copy.home)[lang]}</button>
    </div>
  </section>`;
}
export function mountOfficialShow(root) {
    const show = root.id === 'official-show' ? root : root.querySelector('#official-show');
    if (!show)
        throw new Error('Missing official show');
    const link = show.querySelector('[data-official-link]');
    const title = show.querySelector('[data-official-title]');
    if (!link || !title)
        throw new Error('Missing official show link');
    const buttons = show.querySelectorAll('[data-official-track]');
    const controller = new AbortController();
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const track = tracks.find(candidate => candidate.id === button.dataset.officialTrack);
            if (!track)
                return;
            buttons.forEach(choice => choice.setAttribute('aria-pressed', String(choice === button)));
            link.href = watchUrl(track);
            title.textContent = track.title;
        }, { signal: controller.signal });
    });
    return () => controller.abort();
}
