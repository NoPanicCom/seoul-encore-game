import { concertCostume } from './travel-look.js';
import { renderHeldStick, renderArena } from './lightstick.js';
export function renderPerformance(member, lang, playing, lights, stick = null, secret = false, watching = false, costumes = {}, roseCue = null) {
    const cue = lang === 'ru' ? 'Поймай звезду у круга' : 'Yıldız halkaya gelince dokun';
    const palette = ['#ff80c2', '#bca2ff', '#ffe29e'];
    const colors = lights.map((key, index) => '--cue-' + index + ':' + palette[key]).join(';');
    const cast = secret ? [member] : ['jisoo', 'jennie', 'rose', 'lisa'];
    const names = { jisoo: 'Jisoo', jennie: 'Jennie', rose: 'Rosé', lisa: 'Lisa' };
    const dancers = cast.map((id, index) => {
        const shirt = costumes[id] || (secret ? '' : concertCostume(id));
        const figure = shirt || `<div style="background-image:url('art/world/${secret ? id : 'concert-quartet'}.webp')"></div>`;
        return `<div class="live-dancer" data-artist="${id}" style="--spot:${13 + index * 24}%;--column:${index * 100 / 3}%">${figure}${secret ? '' : `<b>${names[id]}</b>`}</div>`;
    }).join('');
    const stage = `<div class="live-set${secret ? ' secret-set' : ''}" ${!secret && roseCue ? 'data-yuna-cue="' + roseCue + '"' : ''} style="${colors}">
    <div class="live-light" aria-hidden="true"></div>${dancers}
    ${stick && secret ? renderArena(stick) : ''}
    ${stick ? renderHeldStick(stick, lang, playing, watching) : ''}
    <span class="live-bug">${secret ? 'LISA • ENCORE' : 'BLACKPINK • SEOUL'}</span>
  </div>`;
    if (watching)
        return stage;
    return `${stage}<div class="timing-lane" id="note-rail" aria-hidden="true">
    <i class="rail-target"></i><i class="rail-note">✦</i></div>
  <small class="timing-guide">${playing && !stick ? cue : ''}</small>`;
}
