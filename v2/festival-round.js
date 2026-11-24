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

export const ENCORE_BEAT_MS = 480;
const bowDuration = 1050;
const revealAt = bowDuration+1900;
const audienceAt = revealAt + 3 * ENCORE_BEAT_MS;

// The audience has as many beats as it needs to light the four banks.
export function createLisaEncore() {
  let elapsed = 0, last = null, lit = 0, lastHit = -1, finaleAt = null;
  const interval = 2 * ENCORE_BEAT_MS;
  const beat = () => (elapsed-audienceAt)/interval;
  return {
    get phase() {
      if (elapsed < bowDuration) return 'bow';
      if (elapsed < revealAt) return 'blackout';
      if (elapsed < audienceAt) return 'entrance';
      if (finaleAt === null) return 'relight';
      return elapsed-finaleAt < 1450 ? 'finale' : 'card';
    },
    get lit() {return lit;},
    get bow() {return Math.sin(Math.PI*Math.min(1,elapsed/bowDuration));},
    get entrance() {return Math.min(1,Math.max(0,(elapsed-revealAt)/(audienceAt-revealAt)));},
    get musicTime() {return Math.max(0,elapsed-revealAt);},
    get ring() {return 1+1.56*Math.abs(beat()-Math.round(beat()));},
    get ready() {
      const i = Math.round(beat());
      return this.phase==='relight' && i>=1 && lastHit!==i && Math.abs(beat()-i)*interval<=265;
    },
    tick(now) {
      if(last!==null) elapsed+=Math.max(0,now-last);
      last=now;
    },
    pause() {last=null;},
    tap() {
      if(!this.ready) return false;
      lastHit=Math.round(beat());
      lit++;
      if(lit===4) finaleAt=elapsed;
      return true;
    },
  };
}
