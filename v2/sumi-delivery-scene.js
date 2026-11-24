import {createSumiGuest} from './city-pedestrians.js';
import {createPaymentProps, createSumiDrink, createSumiMaterials, createTableMarks} from './sumi-service-props.js';

export const SUMI_DELIVERY_LAYOUT = Object.freeze({
  pickup: Object.freeze({x: 0, z: -1.82}),
  table: Object.freeze({x: -2.72, z: .28, y: .7435}),
  tableApproach: Object.freeze({x: -1.84, z: .28}),
  chair: Object.freeze({x: -2.72, z: 1.04}),
  register: Object.freeze({x: -.66, z: -1.98}),
  paymentApproach: Object.freeze({x: 0, z: -1.62}),
});

const DOOR = {x: -.76, z: 3.28};
const COUNTER = {x: -.72, z: -1.69, yaw: 2.67};
const CHAIR_SIDE = {x: -2.12, z: 1.04};
const FAR_CHAIR_SIDE = {x:-3.32,z:1.04};
const ARRIVAL_PATH = [{x: -.70, z: 2.40}, COUNTER];
const TABLE_PATH = [{x: -1.10, z: -1.40}, {x: -1.10, z: 1.04}, CHAIR_SIDE];
const REGISTER_PATH = [{x: -1.10, z: 1.04}, {x: -1.10, z: -1.46}, SUMI_DELIVERY_LAYOUT.register];
const FAR_REGISTER_PATH = [{x:-3.32,z:1.66},{x:-1.02,z:1.66},...REGISTER_PATH.slice(1)];
const EXIT_PATH = [{x: -.69, z: 2.37}, {x: -.76, z: 3.34}];
const PHASES = new Set(['idle', 'arrive', 'order', 'wait', 'carry', 'serve', 'complete',
  'drink', 'pay', 'exit', 'dirty', 'clear', 'wipe', 'scrub', 'clean']);
const CUP_ON_TABLE = new Set(['serve','complete','drink','pay','exit','dirty']);
const RETURNED = new Set(['wipe','scrub','clean']);
const DRAINED = new Set(['pay','exit','dirty','clear','wipe','scrub','clean']);
const WALKING = new Set(['arriving','walking-to-table','walking-to-register','leaving']);
const VISIBLE_GUEST = new Set(['arriving','ordering','walking-to-table','sitting','seated','thanking','drinking',
  'drunk','standing-up','walking-to-register','paying','paid','leaving']);
const DRINK_SECONDS = 3.6;
const PAY_SECONDS = 1.24;
const WIPE_SECONDS = 1.86;
const BODY_RADIUS = .26;
const SOFIA_CLEARANCE = .54;
const DETOUR_SPACING = .18;
const DETOUR_NEIGHBORS = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];
const TAU = 2 * Math.PI;

function shortestTurn(from, to, amount) {
  const difference = Math.atan2(Math.sin(to - from), Math.cos(to - from));
  return from + difference * amount;
}

function ease(value) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2*t);
}

export function createSumiDelivery(B, scene, parent, walkable) {
  const {table, chair, register, tableApproach} = SUMI_DELIVERY_LAYOUT;
  const registerHeading = Math.PI;
  const props = createSumiMaterials(B, scene);
  const drinks = new Set();
  const localHand = new B.Vector3();
  const localMouth = new B.Vector3();
  const inverse = B.Matrix.Identity();
  let visitorId = 'sumi-guest-1';
  let guest = instantiateGuest(visitorId);
  let phase = 'idle';
  let path = [];
  let target = 0;
  let state = 'hidden';
  let stateTime = 0;
  let clock = 0;
  let stride = 0;
  let effort = 0;
  let risingToward = CHAIR_SIDE;
  let retryDetourAt = 0;

  function instantiateGuest(id) {
    const result = createSumiGuest(B, scene, parent, id);
    result.mesh.name = 'Sumi delivery guest';
    result.mesh.isPickable = false;
    result.mesh.metadata.action = 'hidden';
    return result;
  }

  function drinkProp(name, onTray, empty = false) {
    const drink = createSumiDrink(B, scene, parent, props, name, onTray);
    if (empty) drink.setFill(0);
    drinks.add(drink.root);
    return {
      ...drink,
      dispose() {
        if (drinks.delete(drink.root) && !drink.root.isDisposed()) drink.root.dispose();
      },
    };
  }

  const placed = drinkProp('Sumi table strawberry milk', true);
  placed.root.position.set(table.x + .185, table.y, table.z + .066);
  placed.root.rotation.y = -.23;
  placed.glassRoot.name = 'Sumi drinking glass';
  placed.glassRoot.metadata = {fill: 1};
  const returned = drinkProp('Sumi returned empty glass', true, true);
  returned.root.position.set(.71, .965, -2.393);
  returned.root.rotation.y = .42;
  const payment = createPaymentProps(B, scene, parent, props);
  const tableMarks = createTableMarks(B, scene, parent, props, table);

  function status(action) {
    if (state !== action) {
      state = action;
      stateTime = 0;
    }
    guest.mesh.metadata.action = action;
  }

  function seatLift() {
    return .545 - .55 * guest.mesh.scaling.y;
  }

  function stand(point, yaw, y = 0) {
    guest.mesh.position.set(point.x, y, point.z);
    guest.mesh.rotation.y = yaw;
  }

  function route(points, action) {
    path = points;
    target = 0;
    retryDetourAt = 0;
    status(action);
  }

  function transition(next, player) {
    const last = phase;
    phase = next;
    if (next === 'idle') {
      stand(DOOR, Math.PI);
      status('hidden');
    } else if (next === 'arrive') {
      stand(DOOR, Math.PI);
      route(ARRIVAL_PATH, 'arriving');
    } else if (next === 'order') {
      if (state !== 'ordering') stand(COUNTER, COUNTER.yaw);
      status('ordering');
    } else if (next === 'wait' || next === 'carry') {
      if (state === 'seated' || state === 'sitting' || state === 'walking-to-table') return;
      if (state !== 'ordering') stand(COUNTER, COUNTER.yaw);
      route(TABLE_PATH, 'walking-to-table');
    } else if (next === 'serve' || next === 'complete' || next === 'drink') {
      if (state === 'walking-to-table' || state === 'sitting') return;
      stand(chair, Math.PI, seatLift());
      if (next === 'drink') status('drinking');
      else if (last !== 'serve' && last !== 'complete') status('thanking');
    } else if (next === 'pay') {
      stand(chair, Math.PI, seatLift());
      risingToward = player && player.z > .59 && Math.hypot(CHAIR_SIDE.x-player.x,CHAIR_SIDE.z-player.z) < .81 ?
        FAR_CHAIR_SIDE : CHAIR_SIDE;
      status('standing-up');
    } else if (next === 'exit') {
      if (state !== 'paid') stand(register, registerHeading);
      route(EXIT_PATH, 'leaving');
    } else if (next === 'scrub') {
      status('wiping');
    } else {
      status(next === 'clean' ? 'clean' : 'left');
    }
  }

  function finishWalk() {
    if (state === 'arriving') status('ordering');
    else if (state === 'walking-to-table') status('sitting');
    else if (state === 'walking-to-register') status('paying');
    else status('left');
  }

  function clearLeg(from, to, player) {
    const dx=to.x-from.x, dz=to.z-from.z;
    const px=from.x-player.x, pz=from.z-player.z;
    const closest = Math.max(0,Math.min(1,-(px*dx+pz*dz)/(dx*dx+dz*dz || 1)));
    const gap = Math.min(SOFIA_CLEARANCE+.006,Math.hypot(px,pz));
    if (Math.hypot(px+dx*closest,pz+dz*closest) < gap-1e-7) return false;
    const hops = Math.max(1, Math.ceil(Math.hypot(dx,dz)/.018));
    for (let i=1;i<=hops;i++) {
      const x = from.x+dx*i/hops;
      const z = from.z+dz*i/hops;
      const edge = Math.min(.010, Math.hypot(x-from.x,z-from.z)*.12);
      if (!walkable(x,z,BODY_RADIUS+edge)) return false;
    }
    return true;
  }

  function rerouteAroundPlayer(from, player) {
    const last = path.at(-1);
    const goals = Math.hypot(last.x-player.x,last.z-player.z) >= SOFIA_CLEARANCE ? [last] : [];
    if (state !== 'walking-to-table') {
      for (const dx of [-.56,.56]) {
        const point = {x:last.x+dx,z:last.z};
        if (walkable(point.x,point.z,BODY_RADIUS) &&
            Math.hypot(point.x-player.x,point.z-player.z) >= SOFIA_CLEARANCE) goals.push(point);
      }
    }
    if (!goals.length) return false;
    if (clearLeg(from,goals[0],player)) {
      path = [goals[0]];
      target = 0;
      return true;
    }

    // Explore the free floor when Sofia blocks the regular route.
    const queue = [{x:from.x,z:from.z,col:0,row:0,previous:null}];
    const visited = new Set(['0,0']);
    for (let i=0;i<queue.length;i++) {
      const point=queue[i];
      const goal=goals.find(g => Math.hypot(point.x-g.x,point.z-g.z) < .35 && clearLeg(point,g,player));
      if (goal) {
        const route = [goal];
        for (let link=point;link.previous;link=link.previous) route.unshift(link);
        path = [];
        target = 0;
        for (let current=from,index=0;index<route.length;index++) {
          while (route[index+1] && clearLeg(current,route[index+1],player)) index++;
          current = route[index];
          path.push(current);
        }
        return true;
      }
      for (const [dc,dr] of DETOUR_NEIGHBORS) {
        const col=point.col+dc, row=point.row+dr;
        const key=col+','+row;
        if (visited.has(key)) continue;
        const neighbor={x:from.x+col*DETOUR_SPACING,z:from.z+row*DETOUR_SPACING,col,row,previous:point};
        if (!clearLeg(point,neighbor,player)) continue;
        visited.add(key);
        queue.push(neighbor);
      }
    }
    return false;
  }

  function step(dt, player, canDetour = true) {
    const next = path[target];
    if (!next || !dt) return 0;
    const current = guest.mesh.position;
    const dx = next.x - current.x;
    const dz = next.z - current.z;
    const distance = Math.hypot(dx, dz);
    const amount = Math.min(distance, dt * 1.72);
    const x = distance ? current.x + dx / distance * amount : next.x;
    const z = distance ? current.z + dz / distance * amount : next.z;
    const nextGap = player ? Math.hypot(x - player.x, z - player.z) : Infinity;
    const playerBlocks = nextGap < SOFIA_CLEARANCE && nextGap < Math.hypot(current.x-player.x,current.z-player.z)-1e-7;
    if (!walkable(x,z,BODY_RADIUS) || playerBlocks) {
      if (!canDetour || !player || clock < retryDetourAt) return 0;
      if (rerouteAroundPlayer(current,player)) return step(dt,player,false);
      retryDetourAt = clock+.25;
      return 0;
    }
    current.set(x, 0, z);
    if (distance > .001) {
      const heading = Math.atan2(dx, dz);
      guest.mesh.rotation.y = shortestTurn(guest.mesh.rotation.y, heading, 1 - Math.exp(-dt * 11));
    }
    if (amount >= distance - .001 && ++target === path.length) finishWalk();
    return amount;
  }

  function rise(elapsed) {
    const t = Math.min(1, stateTime / .68);
    const mesh = guest.mesh;
    const halfwayHeight = seatLift() + (.79 - .55) * mesh.scaling.y * .48;
    const blend = ease(t);
    mesh.position.x = chair.x + (risingToward.x - chair.x) * blend;
    mesh.position.z = chair.z;
    if (t < .5) {
      mesh.position.y = seatLift() + (halfwayHeight - .55*mesh.scaling.y - seatLift()) * ease(t*2);
    } else {
      mesh.position.y = (halfwayHeight - .79*mesh.scaling.y) * (1 - ease(2*t-1));
    }
    const heading = risingToward === CHAIR_SIDE ? Math.PI/2 : -Math.PI/2;
    mesh.rotation.y = shortestTurn(mesh.rotation.y,heading,1-Math.exp(-elapsed*12));
    if (t >= 1) route(risingToward === CHAIR_SIDE ? REGISTER_PATH : FAR_REGISTER_PATH,'walking-to-register');
    return t < .5 ? 'sit' : 'stand';
  }

  function seat(elapsed) {
    const seating = Math.min(1, stateTime / .48);
    const blend = ease(seating);
    guest.mesh.position.set(CHAIR_SIDE.x + (chair.x - CHAIR_SIDE.x) * blend, seatLift() * blend, chair.z);
    guest.mesh.rotation.y = shortestTurn(guest.mesh.rotation.y, Math.PI, 1 - Math.exp(-elapsed * 14));
    if (seating >= 1) {
      if (phase === 'drink') status('drinking');
      else status(phase === 'serve' || phase === 'complete' ? 'thanking' : 'seated');
    }
  }

  function animateGuest(elapsed, player) {
    const walked = WALKING.has(state) ? step(elapsed, player) : 0;
    effort += ((walked > .0001 ? 1 : 0) - effort) * (elapsed ? 1 - Math.exp(-elapsed * 13) : 1);
    stride = (stride + walked / .91 * TAU) % TAU;
    let action = 'stand';
    if (state === 'ordering') {
      guest.mesh.rotation.y = shortestTurn(guest.mesh.rotation.y, COUNTER.yaw, 1 - Math.exp(-elapsed * 9));
    } else if (state === 'sitting') {
      seat(elapsed);
      action = 'sit';
    } else if (state === 'seated' || state === 'thanking' || state === 'drunk') {
      action = state === 'thanking' ? 'thanks' : 'sit';
      const sofia = player ?? tableApproach;
      const heading = action === 'thanks' ?
        shortestTurn(Math.PI, Math.atan2(sofia.x-chair.x, sofia.z-chair.z), .45) : Math.PI;
      guest.mesh.rotation.y = shortestTurn(guest.mesh.rotation.y, heading, 1 - Math.exp(-elapsed * 9));
      if (stateTime >= 1.6 && state === 'thanking') status('seated');
    } else if (state === 'drinking') {
      action = 'drink';
      guest.mesh.rotation.y = shortestTurn(guest.mesh.rotation.y, Math.PI, 1 - Math.exp(-elapsed * 9));
      if (stateTime >= DRINK_SECONDS) {
        status('drunk');
        action = 'sit';
      }
    } else if (state === 'standing-up') {
      action = rise(elapsed);
    } else if (state === 'paying' || state === 'paid') {
      const {x,z} = guest.mesh.position;
      const terminal = payment.terminal.position;
      const towardRegister = Math.atan2(terminal.x-x,terminal.z-z);
      guest.mesh.rotation.y = shortestTurn(guest.mesh.rotation.y,towardRegister,1-Math.exp(-elapsed*10));
      if (state === 'paying' && stateTime >= PAY_SECONDS) status('paid');
      action = state === 'paying' ? 'pay' : 'stand';
    }
    guest.pose(stride, action === 'stand' ? effort : 0, action === 'stand' || action === 'sit' ? clock : stateTime, action);
  }

  function handAt(relativeTo) {
    relativeTo.computeWorldMatrix(true).invertToRef(inverse);
    B.Vector3.TransformCoordinatesToRef(guest.getHandWorldPosition(), inverse, localHand);
    return localHand;
  }

  function bringRimToMouth(glass, sip) {
    // Align the near rim to the lips only while the guest tips the glass.
    B.Vector3.TransformCoordinatesToRef(guest.getMouthWorldPosition(),inverse,localMouth);
    const angle = glass.rotation.x;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const lateral = localMouth.x - glass.position.x;
    const depth = (localMouth.z-glass.position.z)*cos - (localMouth.y-glass.position.y)*sin;
    const scale = .069 / (Math.hypot(lateral,depth) || 1);
    const rimX = lateral*scale;
    const rimZ = depth*scale;
    const touch = ease((sip-.19)/.81);
    glass.position.x += (localMouth.x-rimX-glass.position.x)*touch;
    glass.position.y += (localMouth.y-.144*cos+rimZ*sin-glass.position.y)*touch;
    glass.position.z += (localMouth.z-.144*sin-rimZ*cos-glass.position.z)*touch;
  }

  function positionCup() {
    placed.root.setEnabled(CUP_ON_TABLE.has(phase));
    returned.root.setEnabled(RETURNED.has(phase));
    const glass = placed.glassRoot;
    const resting = placed.glassCenter;
    let amount = DRAINED.has(phase) || state === 'drunk' ? 0 : 1;
    if (state === 'drinking') {
      const hand = handAt(placed.root);
      const hold = ease(stateTime/.37) * ease((DRINK_SECONDS-stateTime)/.39);
      glass.position.set(resting.x+(hand.x-resting.x)*hold,
        resting.y+(hand.y-.074-resting.y)*hold, resting.z+(hand.z-resting.z)*hold);
      const sip = Math.sin(Math.PI * (stateTime % 1.2) / 1.2) ** 2;
      glass.rotation.x = (.14 + .47*sip)*hold;
      bringRimToMouth(glass,sip);
      amount = 1 - [.52,1.72,2.92].reduce((total,time) => total + ease((stateTime-time)/.30)/3,0);
    } else {
      glass.position.set(resting.x,resting.y,resting.z);
      glass.rotation.x = 0;
    }
    placed.setFill(amount);
    glass.metadata.fill = amount;
  }

  function positionPayment() {
    const active = state === 'paying';
    payment.card.setEnabled(active);
    payment.light.setEnabled(state === 'paid' || active && stateTime >= .65);
    if (!active) return;
    const hand = handAt(parent);
    const tap = ease((stateTime-.34)/.26) * ease((1.08-stateTime)/.32);
    payment.card.position.set(hand.x+(-.66-hand.x)*tap,
      hand.y+.018+(1.058-hand.y-.018)*tap, hand.z+(-2.365-hand.z)*tap);
    payment.card.rotation.y = .12 + .25 * (1-tap);
  }

  function refreshTable() {
    const dirty = (DRAINED.has(phase) || state === 'drunk') && state !== 'clean';
    const cleaning = state === 'wiping';
    const {patches, napkin, cloth} = tableMarks;
    tableMarks.dirty.setEnabled(dirty);
    napkin.setEnabled(dirty && (!cleaning || stateTime < .36));
    cloth.setEnabled((phase === 'wipe' || cleaning) && state !== 'clean');
    if (cleaning) {
      const progress = Math.min(1, stateTime/WIPE_SECONDS);
      const sweep = ease(progress);
      cloth.position.set(table.x-.31+.63*sweep, table.y,
        table.z+.15+.07*Math.sin(sweep*TAU*1.55));
      cloth.rotation.y = .23*Math.sin(sweep*TAU*1.7);
      patches.forEach((patch,index) => patch.setEnabled(sweep < .16 + index*.145));
      if (progress >= 1) {
        status('clean');
        tableMarks.dirty.setEnabled(false);
        cloth.setEnabled(false);
      }
    } else {
      cloth.position.set(table.x+.25,table.y,table.z+.225);
      cloth.rotation.y = -.23;
      for (const patch of patches) patch.setEnabled(true);
    }
  }

  function update(dt = 0, next = 'idle', player) {
    if (!PHASES.has(next)) throw new RangeError('Sumi teslimat aşaması geçersiz');
    const elapsed = Math.min(.10, Math.max(0, dt));
    if (phase !== next) transition(next,player);
    clock += elapsed;
    stateTime += elapsed;
    if (VISIBLE_GUEST.has(state)) animateGuest(elapsed,player);
    guest.mesh.setEnabled(VISIBLE_GUEST.has(state));
    positionCup();
    positionPayment();
    refreshTable();
    return state;
  }

  function restore(next) {
    if (!PHASES.has(next)) throw new RangeError('Sumi teslimat aşaması geçersiz');
    transition(next);
    effort = 0;
    if (next === 'wait' || next === 'carry' || next === 'serve' || next === 'complete' || next === 'drink') {
      stand(chair, Math.PI, seatLift());
      status(next === 'drink' ? 'drunk' : 'seated');
    } else if (next === 'pay') {
      stand(register, registerHeading);
      status('paid');
    } else if (next === 'exit') {
      stand(EXIT_PATH.at(-1), 0);
      status('left');
    }
    return update(0, next);
  }

  update(0,'idle');
  return {
    ...SUMI_DELIVERY_LAYOUT,
    get state() {
      return state;
    },
    get guest() {
      return guest.mesh;
    },
    update,
    restore,
    setVisitorId(id) {
      if (id === visitorId) return;
      const replacement = instantiateGuest(id);
      guest.dispose();
      guest = replacement;
      visitorId = id;
      restore('idle');
    },
    createDrink: (name = 'Sumi strawberry milk') => drinkProp(name,true),
    createEmptyDrink: (name = 'Sumi empty glass') => drinkProp(name,true,true),
    dispose() {
      guest.dispose();
      for (const root of drinks) if (!root.isDisposed()) root.dispose();
      drinks.clear();
      payment.terminal.dispose();
      payment.card.dispose();
      tableMarks.dirty.dispose();
      tableMarks.cloth.dispose();
      props.dispose();
    },
  };
}
