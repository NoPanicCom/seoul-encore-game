export function renderPerformance(member, lang, playing, lights) {
    const cue = lang === 'ru' ? 'Поймай звезду у круга' : 'Yıldız halkaya gelince dokun';
    const palette = ['#ff80c2', '#bca2ff', '#ffe29e'];
    const colors = lights.map((key, index) => '--cue-' + index + ':' + palette[key]).join(';');
    return `<div class="live-set" style="${colors}" aria-hidden="true">
    <div class="live-light"></div><div class="live-dancer"><div style="background-image:url('art/world/${member}.webp')"></div></div>
    <span class="live-bug">SEOUL • LIVE</span>
  </div><div class="timing-lane" id="note-rail" aria-hidden="true">
    <i class="rail-target"></i><i class="rail-note">✦</i></div>
  <small class="timing-guide">${playing ? cue : ''}</small>`;
}
