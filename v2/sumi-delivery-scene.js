import {createSumiGuest} from './city-pedestrians.js';

export const SUMI_DELIVERY_LAYOUT = Object.freeze({
  pickup: Object.freeze({x: 0, z: -1.82}),
  table: Object.freeze({x: -2.72, z: .28, y: .7435}),
  tableApproach: Object.freeze({x: -1.84, z: .28}),
  chair: Object.freeze({x: -2.72, z: 1.04}),
});

const DOOR = {x: -.76, z: 3.28};
const COUNTER = {x: -.72, z: -1.69, yaw: 2.67};
const CHAIR_SIDE = {x: -2.12, z: 1.04};
const ARRIVAL_PATH = [{x: -.70, z: 2.40}, COUNTER];
const TABLE_PATH = [{x: -1.10, z: -1.40}, {x: -1.10, z: 1.04}, CHAIR_SIDE];
const PHASES = new Set(['idle', 'arrive', 'order', 'wait', 'carry', 'serve', 'complete']);
const TAU = 2 * Math.PI;

function shortestTurn(from, to, amount) {
  const difference = Math.atan2(Math.sin(to - from), Math.cos(to - from));
  return from + difference * amount;
}

function showDrink(B, scene, parent, material, name) {
  const root = new B.TransformNode(name, scene);
  root.parent = parent;
  const parts = [];
  function shape(mesh, color, x, y, z, width, height, depth) {
    mesh.position.set(x, y, z);
    mesh.scaling.set(width, height, depth);
    const {r, g, b} = B.Color3.FromHexString(color);
    const shades = new Float32Array(mesh.getTotalVertices() * 4);
    for (let i = 0; i < shades.length; i += 4) shades.set([r, g, b, 1], i);
    mesh.setVerticesData(B.VertexBuffer.ColorKind, shades);
    parts.push(mesh);
    return mesh;
  }
  function disk(color, x, y, z, width, height, depth = width) {
    return shape(B.MeshBuilder.CreateCylinder('strawberry service', {tessellation: 18}, scene),
      color, x, y, z, width, height, depth);
  }
  function fruit(color, x, y, z, width, height, depth) {
    shape(B.MeshBuilder.CreateSphere('strawberry service', {segments: 6, diameter: 1}, scene),
      color, x, y, z, width, height, depth);
  }
  disk('#754e48', 0, .012, 0, .392, .024, .286);
  disk('#ad7761', 0, .027, 0, .367, .015, .261);
  shape(B.MeshBuilder.CreateTorus('tray lip', {diameter: 1, thickness: .047, tessellation: 22}, scene),
    '#c18a6a', 0, .034, 0, .386, .35, .283);
  shape(B.MeshBuilder.CreateBox('napkin', {}, scene), '#f5e1c7',
    -.043, .038, .016, .230, .007, .124).rotation.y = -.22;
  disk('#c47789', .021, .063, -.013, .110, .047);
  disk('#e8a9b5', .021, .108, -.013, .118, .049);
  disk('#f2d3dc', .021, .142, -.013, .124, .041);
  disk('#fff1df', .021, .168, -.013, .129, .021);
  disk('#d38199', .052, .212, -.026, .012, .087).rotation.z = -.19;
  fruit('#c7717f', -.010, .187, .005, .037, .039, .031);
  fruit('#71865d', -.009, .206, .007, .030, .008, .021);
  const geometry = B.Mesh.MergeMeshes(parts, true, true);
  if (!geometry) {
    root.dispose();
    for (const mesh of parts) if (!mesh.isDisposed()) mesh.dispose();
    throw new Error('Çilekli süt tepsisi oluşturulamadı');
  }
  geometry.name = name + ' mesh';
  geometry.parent = root;
  geometry.material = material;
  geometry.isPickable = false;
  return root;
}

export function createSumiDelivery(B, scene, parent, walkable) {
  const guest = createSumiGuest(B, scene, parent);
  guest.mesh.name = 'Sumi delivery guest';
  guest.mesh.isPickable = false;
  guest.mesh.metadata = {...guest.mesh.metadata, action: 'hidden'};
  const drinks = new Set();
  const material = new B.StandardMaterial('Sumi strawberry service textiles', scene);
  material.diffuseColor = B.Color3.White();
  material.specularColor.set(.13, .085, .10);
  function createDrink(name = 'Sumi strawberry milk') {
    const root = showDrink(B, scene, parent, material, name);
    drinks.add(root);
    return {
      root,
      dispose() {
        if (drinks.delete(root)) root.dispose();
      },
    };
  }
  const placed = createDrink('Sumi table strawberry milk');
  const {table, chair} = SUMI_DELIVERY_LAYOUT;
  const seatLift = .545 - .55 * guest.mesh.scaling.y;
  placed.root.position.set(table.x + .185, table.y, table.z + .066);
  placed.root.rotation.y = -.23;

  let phase = 'idle';
  let path = [];
  let target = 0;
  let state = 'hidden';
  let stateTime = 0;
  let clock = 0;
  let stride = 0;
  let effort = 0;

  function status(action) {
    if (state !== action) {
      state = action;
      stateTime = 0;
      guest.mesh.metadata.action = action;
    }
  }

  function stand(point, yaw, y = 0) {
    guest.mesh.position.set(point.x, y, point.z);
    guest.mesh.rotation.y = yaw;
  }

  function route(points, action) {
    path = points;
    target = 0;
    status(action);
  }

  function transition(next) {
    const last = phase;
    phase = next;
    guest.mesh.setEnabled(next !== 'idle');
    placed.root.setEnabled(next === 'serve' || next === 'complete');
    if (next === 'idle') {
      stand(DOOR, Math.PI);
      status('hidden');
    } else if (next === 'arrive') {
      stand(DOOR, Math.PI);
      route(ARRIVAL_PATH, 'arriving');
    } else if (next === 'order') {
      stand(COUNTER, COUNTER.yaw);
      status('ordering');
    } else if (next === 'wait' || next === 'carry') {
      if (state === 'seated' || state === 'sitting' || state === 'walking-to-table') return;
      stand(COUNTER, COUNTER.yaw);
      route(TABLE_PATH, 'walking-to-table');
    } else {
      if (state === 'walking-to-table' || state === 'sitting') return;
      stand(chair, Math.PI, seatLift);
      if (last !== 'serve' && last !== 'complete') status('thanking');
    }
  }

  function step(dt, player) {
    const next = path[target];
    if (!next || !dt) return 0;
    const current = guest.mesh.position;
    const dx = next.x - current.x;
    const dz = next.z - current.z;
    const distance = Math.hypot(dx, dz);
    const amount = Math.min(distance, dt * 1.72);
    const x = distance ? current.x + dx / distance * amount : next.x;
    const z = distance ? current.z + dz / distance * amount : next.z;
    // A moving guest yields to Sofia without leaving its furniture-clear aisle.
    const nextGap = player ? Math.hypot(x - player.x, z - player.z) : Infinity;
    if (nextGap < .54 && nextGap < Math.hypot(current.x - player.x, current.z - player.z)) return 0;
    if (!walkable(x, z, .26)) return 0;
    current.set(x, 0, z);
    if (distance > .001) {
      const heading = Math.atan2(dx, dz);
      guest.mesh.rotation.y = shortestTurn(guest.mesh.rotation.y, heading, 1 - Math.exp(-dt * 11));
    }
    if (amount >= distance - .001) {
      target++;
      if (target === path.length) status(state === 'arriving' ? 'ordering' : 'sitting');
    }
    return amount;
  }

  function update(dt = 0, next = 'idle', player) {
    if (!PHASES.has(next)) throw new RangeError('Sumi teslimat aşaması geçersiz');
    const elapsed = Math.min(.10, Math.max(0, dt));
    if (phase !== next) transition(next);
    clock += elapsed;
    stateTime += elapsed;
    if (state === 'hidden') return state;
    const walked = state === 'arriving' || state === 'walking-to-table' ? step(elapsed, player) : 0;
    effort += ((walked > .0001 ? 1 : 0) - effort) * (elapsed ? 1 - Math.exp(-elapsed * 13) : 1);
    stride = (stride + walked / .91 * TAU) % TAU;
    let action = 'stand';
    if (state === 'ordering') {
      guest.mesh.rotation.y = shortestTurn(guest.mesh.rotation.y, COUNTER.yaw, 1 - Math.exp(-elapsed * 9));
    } else if (state === 'sitting') {
      const seating = Math.min(1, stateTime / .48);
      const blend = seating * seating * (3 - 2 * seating);
      guest.mesh.position.x = CHAIR_SIDE.x + (chair.x - CHAIR_SIDE.x) * blend;
      guest.mesh.position.y = seatLift * blend;
      guest.mesh.position.z = chair.z;
      guest.mesh.rotation.y = shortestTurn(guest.mesh.rotation.y, Math.PI, 1 - Math.exp(-elapsed * 14));
      action = 'sit';
      if (seating >= 1) status(phase === 'serve' || phase === 'complete' ? 'thanking' : 'seated');
    } else if (state === 'seated' || state === 'thanking') {
      action = state === 'thanking' ? 'thanks' : 'sit';
      const Sofia = player ?? SUMI_DELIVERY_LAYOUT.tableApproach;
      const towardSofia = Math.atan2(Sofia.x - chair.x, Sofia.z - chair.z);
      const heading = action === 'thanks' ? shortestTurn(Math.PI, towardSofia, .45) : Math.PI;
      guest.mesh.rotation.y = shortestTurn(guest.mesh.rotation.y, heading, 1 - Math.exp(-elapsed * 9));
      if (stateTime >= 1.6 && state === 'thanking') status('seated');
    }
    guest.pose(stride, action === 'stand' ? effort : 0, action === 'thanks' ? stateTime : clock, action);
    return state;
  }

  function restore(next) {
    if (!PHASES.has(next)) throw new RangeError('Sumi teslimat aşaması geçersiz');
    transition(next);
    effort = 0;
    if (next === 'wait' || next === 'carry' || next === 'serve' || next === 'complete') {
      stand(chair, Math.PI, seatLift);
      status('seated');
    }
    update(0, next);
    return state;
  }

  transition('idle');
  return {
    ...SUMI_DELIVERY_LAYOUT,
    get state() {
      return state;
    },
    update,
    restore,
    createDrink,
    dispose() {
      guest.dispose();
      for (const root of drinks) root.dispose();
      drinks.clear();
      material.dispose();
    },
  };
}
