import { renderHeldStick } from './lightstick.js';
export function renderPerformance(member, lang, playing, lights, stick = null) {
    const cue = lang === 'ru' ? 'Поймай звезду у круга' : 'Yıldız halkaya gelince dokun';
    const palette = ['#ff80c2', '#bca2ff', '#ffe29e'];
    const colors = lights.map((key, index) => '--cue-' + index + ':' + palette[key]).join(';');
    return `<div class="live-set" style="${colors}">
    <div class="live-light" aria-hidden="true"></div><div class="live-dancer" aria-hidden="true"><div style="background-image:url('art/world/${member}.webp')"></div></div>
    ${stick ? renderHeldStick(stick, lang, playing) : ''}
    <span class="live-bug">SEOUL • LIVE</span>
  </div><div class="timing-lane" id="note-rail" aria-hidden="true">
    <i class="rail-target"></i><i class="rail-note">✦</i></div>
  <small class="timing-guide">${playing && !stick ? cue : ''}</small>`;
}
