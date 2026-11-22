const copy = {
    tr: {
        concert: 'Konser gecesi',
        start: 'Oyuna başla',
        explore: 'Keşfet',
        city: 'Seul',
        pets: 'Patili dostlar',
        studio: 'Stil stüdyosu',
        album: 'Albüm',
        replay: 'Konseri tekrar oyna',
        fan: 'Oyun fikri · Sofia',
        plan: 'Oyun planı',
    },
    ru: {
        concert: 'Вечер концерта',
        start: 'Начать игру',
        explore: 'Исследуй',
        city: 'Сеул',
        pets: 'Питомцы',
        studio: 'Гардероб',
        album: 'Альбом',
        replay: 'Сыграть концерт снова',
        fan: 'Идея игры · София',
        plan: 'План игры (TR)',
    },
};
const lineup = ['jisoo', 'jennie', 'rose', 'lisa'];
const art = {
    city: '<span class="el-phone"><i></i><b></b></span>',
    pets: '<img src="art/lobby/pet.webp" alt="" width="160" height="171">',
    studio: '<img src="art/lobby/styling.webp" alt="" width="166" height="224">',
    album: '<span class="el-stack"><img src="art/lobby/rose.webp" alt="" width="257" height="520"></span>',
};
function shortcut(id, name, count = '') {
    return `<button type="button" class="el-card el-card--${id}" data-act="${id}">
    <span class="el-card-label">${name}${count}</span>
    <span class="el-card-art" aria-hidden="true">${art[id]}</span>
    <i class="el-arrow" aria-hidden="true"></i>
  </button>`;
}
export function renderLobby(lang, count, total, hasReplay, resumeLabel = '') {
    const label = copy[lang];
    const portraits = lineup.map(member => `<span class="el-portrait">
    <img src="art/lobby/${member}.webp" alt="" width="257" height="520">
  </span>`).join('');
    return `<div class="encore-lobby">
    <section class="el-cover" aria-labelledby="encore-title">
      <div class="el-marquee">
        <span>BLACKPINK</span>
        <span>${label.concert}</span>
      </div>
      <div class="el-lineup" aria-hidden="true">${portraits}</div>
      <span class="el-glint el-glint--left" aria-hidden="true"></span>
      <span class="el-glint el-glint--right" aria-hidden="true"></span>
      <h1 class="el-title" id="encore-title"><span>Seoul</span> <strong>Encore</strong></h1>
    </section>
    <button type="button" class="el-start" data-act="start">
      <span class="el-play" aria-hidden="true"></span>
      <strong>${label.start}</strong>
      <i class="el-arrow" aria-hidden="true"></i>
    </button>
    ${resumeLabel ? `<button class="resume" data-act="resume">${resumeLabel}</button>` : ''}
    <nav class="el-shortcuts" aria-labelledby="encore-explore">
      <h2 id="encore-explore">${label.explore}</h2>
      <div class="el-grid">
        ${shortcut('city', label.city)}
        ${shortcut('pets', label.pets)}
        ${shortcut('studio', label.studio)}
        ${shortcut('album', label.album, `<span class="el-count">${count} / ${total}</span>`)}
      </div>
    </nav>
    ${hasReplay ? `<button type="button" class="el-replay" data-act="replay">
      <span class="el-replay-icon" aria-hidden="true"></span>
      <strong>${label.replay}</strong>
      <i class="el-arrow" aria-hidden="true"></i>
    </button>` : ''}
    <footer class="el-footer">
      <span>${label.fan}</span>
      <a href="plan.html" lang="tr">${label.plan}</a>
    </footer>
  </div>`;
}
