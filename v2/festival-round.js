export const FESTIVAL_BEAT_MS = 550;
const cueInterval = FESTIVAL_BEAT_MS * 2;
const tolerance = 215;
const cueCount = 8;

export function createFestivalRound() {
  const hits = Array(cueCount).fill(false);
  let elapsed = 0;
  let last = null;
  let score = 0;
  return {
    get elapsed() {return elapsed;},
    get score() {return score;},
    get hits() {return hits;},
    get complete() {return elapsed > cueCount*cueInterval+tolerance;},
    get ring() {
      if (elapsed < cueInterval/2) return 1+.78;
      return 1+.78*Math.abs(elapsed/cueInterval-Math.round(elapsed/cueInterval))*2;
    },
    get index() {return Math.round(elapsed/cueInterval)-1;},
    get ready() {
      const i = this.index;
      return i>=0 && i<cueCount && !hits[i] && Math.abs(elapsed-(i+1)*cueInterval)<=tolerance;
    },
    tick(now) {
      if (last!==null) elapsed+=Math.max(0,now-last);
      last=now;
    },
    pause() {last=null;},
    tap() {
      if (!this.ready) return false;
      hits[this.index]=true;
      score++;
      return true;
    },
    missed(i) {return !hits[i] && elapsed>(i+1)*cueInterval+tolerance;},
  };
}
