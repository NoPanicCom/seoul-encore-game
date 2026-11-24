const stages = ['intro', 'work', 'display', 'decision', 'done'];
const chapters = new Map();

export async function loadShopStory(id) {
  const number = Number(id.slice(5));
  if (!/^city-\d{3}$/.test(id) || number < 1 || number > 200) throw new RangeError('Unknown city building');
  const chapter = String(Math.ceil(number / 20)).padStart(2, '0');
  if (!chapters.has(chapter)) {
    const moduleUrl = new URL('stories/chapter-' + chapter + '.js', import.meta.url);
    // Keep content on the same revision as the runtime when a saved link is reopened.
    moduleUrl.searchParams.set('v', new URL(import.meta.url).pathname.split('/').pop());
    const request = import(moduleUrl.href).then(module => new Map(module.default.map(story => [story.id, story])))
      .catch(error => { chapters.delete(chapter); throw error; });
    chapters.set(chapter, request);
  }
  const story = (await chapters.get(chapter)).get(id);
  if (!story) throw new Error('Missing shop story for ' + id);
  return story;
}

export function createShopJournal(getStorage) {
  const memory = new Map();
  const key = id => 'encore1.shop-story.v1.' + id;

  function read(id) {
    if (memory.has(id)) return memory.get(id);
    let saved;
    try {
      saved = JSON.parse(getStorage().getItem(key(id)));
    } catch { /* A private browser can still play in memory. */ }
    const valid = saved && stages.includes(saved.stage) && Number.isInteger(saved.seen) && saved.seen >= 0 && saved.seen <= 3 &&
      (saved.stage === 'done' ? (saved.ending === 0 || saved.ending === 1) && (saved.seen & (1 << saved.ending)) : saved.ending === null);
    const entry = valid ? saved : {stage:'intro', ending:null, seen:0};
    memory.set(id, entry);
    return entry;
  }

  function write(id, entry) {
    memory.set(id, entry);
    try {
      getStorage().setItem(key(id), JSON.stringify(entry));
      return true;
    } catch {
      return false;
    }
  }

  return {
    read,
    advance(id, expected, ending) {
      const entry = read(id);
      if (entry.stage !== expected || expected === 'done') return null;
      if (expected === 'decision' && ending !== 0 && ending !== 1) return null;
      const choice = expected === 'decision' ? ending : null;
      const next = {stage:stages[stages.indexOf(expected) + 1], ending:choice,
        seen:choice === null ? entry.seen : entry.seen | (1 << choice)};
      return {entry:next, saved:write(id, next)};
    },
    restart(id) {
      const entry = read(id);
      if (entry.stage !== 'done') return null;
      const next = {stage:'intro', ending:null, seen:entry.seen};
      return {entry:next, saved:write(id, next)};
    },
  };
}
