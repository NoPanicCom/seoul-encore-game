import { CITY_BLOCKS, CITY_ENTRY, getBuilding, SUMI_CAFE_ID, walkable } from './city-grid.js';

const MAX_RESIDENTS = 8;
const SPAWN_DISTANCE = 29;
const KEEP_DISTANCE = 30;
const BODY_RADIUS = .23;
const PLAYER_CLEARANCE = .55;
const TAU = 2 * Math.PI;
const SUMI_GUEST_SEED = 45;
const FIRST_SUMI_GUEST = 'sumi-guest-1';
const SUMI_PALETTES = [7, 4, 0, 3, 2, 5, 1, 6];
const DEPARTURE_PHASES = new Set(['release', 'sumi-exit', 'depart-corner']);
const AWAY_FROM_STREET = { x: Infinity, z: Infinity };

const LOOKS = [
  { kind: 'coat', jacket: '8671C2', shirt: 'F0C1D9', trousers: '4F456F', shoe: 'D1C1E8', hair: '493449', skin: 'E5AB91', bag: 'F1A3BB' },
  { kind: 'cap', jacket: 'BF725D', shirt: 'F3C28F', trousers: '494452', shoe: 'C8B6AA', hair: '473B50', skin: 'C7856E', bag: '80677F' },
  { kind: 'bob', jacket: '6AB1A7', shirt: 'CFDFAB', trousers: '566379', shoe: 'E3D2BC', hair: '5B3E51', skin: 'EBAF92', bag: 'DBA6BA' },
  { kind: 'field', jacket: '5E82B2', shirt: 'BFCDED', trousers: '615F80', shoe: 'CECAE2', hair: '3D344D', skin: '986556', bag: 'AB899A' },
  { kind: 'pony', jacket: 'CF83A3', shirt: 'F6C6D0', trousers: '6A5178', shoe: 'DFABC5', hair: '52384C', skin: 'D89881', bag: 'F4BA90' },
  { kind: 'blazer', jacket: 'B08A77', shirt: 'F2D2AD', trousers: '594F67', shoe: 'CCD3BA', hair: '49364A', skin: 'B7796D', bag: '766FAA' },
  { kind: 'bob', jacket: 'B55B89', shirt: 'F4BDC8', trousers: '594A68', shoe: 'E1BEAD', hair: '643F4C', skin: 'E8AB88', bag: 'C493C8' },
  { kind: 'cap', jacket: '758E9B', shirt: 'DDD3B0', trousers: '474964', shoe: 'DCCAD9', hair: '503D4E', skin: 'C79277', bag: 'BF908F' },
];

function rgb(hex) {
  return [0, 2, 4].map(start => Number.parseInt(hex.slice(start, start + 2), 16) / 255);
}

function lighten(rgbColor, factor) {
  return rgbColor.map(channel => Math.min(1, factor * channel));
}

function approachAngle(current, target, dt) {
  const delta = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + delta * (1 - Math.exp(-dt * 12));
}

function createRig(B, scene, anchor, material, look, seed) {
  const skeleton = new B.Skeleton(`City resident rig ${seed}`, `city-resident-rig-${seed}`, scene);
  const bone = (name, parent, x, y, z) => new B.Bone(name, skeleton, parent, B.Matrix.Translation(x, y, z));
  const hips = bone('hips', null, 0, .79, 0);
  const chest = bone('chest', hips, 0, .21, 0);
  const head = bone('head', chest, 0, .30, 0);
  const limbs = [-1, 1].map(side => {
    const shoulder = bone('shoulder', chest, side * .206, .19, 0);
    const elbow = bone('elbow', shoulder, 0, -.19, 0);
    const hip = bone('hip', hips, side * .096, -.036, 0);
    const knee = bone('knee', hip, 0, -.302, 0);
    const ankle = bone('ankle', knee, 0, -.307, 0);
    return { side, shoulder, elbow, hip, knee, ankle };
  });

  const positions = [], normals = [], indices = [], colors = [], matrices = [], weights = [];
  function shape(joint, center, radii, paint, segments = 9, rings = 6) {
    const base = positions.length / 3;
    const jointIndex = skeleton.bones.indexOf(joint);
    const [cx, cy, cz] = center;
    const shade = typeof paint === 'string' ? rgb(paint) : paint;
    for (let row = 0; row <= rings; row++) {
      const pitch = -Math.PI / 2 + Math.PI * row / rings;
      for (let i = 0; i < segments; i++) {
        const yaw = TAU * i / segments;
        const p = [Math.cos(pitch) * Math.cos(yaw), Math.sin(pitch), Math.cos(pitch) * Math.sin(yaw)];
        positions.push(cx + radii[0] * p[0], cy + radii[1] * p[1], cz + radii[2] * p[2]);
        const normal = p.map((value, axis) => value / radii[axis]);
        const length = Math.hypot(...normal);
        normals.push(...normal.map(value => value / length));
        colors.push(...lighten(shade, .86 + row / rings * .17), 1);
        matrices.push(jointIndex, 0, 0, 0);
        weights.push(1, 0, 0, 0);
      }
    }
    for (let row = 0; row < rings; row++) {
      for (let i = 0; i < segments; i++) {
        const a = base + row * segments + i;
        const b = base + row * segments + (i + 1) % segments;
        indices.push(a, a + segments, b + segments, a, b + segments, b);
      }
    }
  }

  shape(hips, [0, .763, 0], [.179, .143, .102], look.trousers);
  const coat = look.kind === 'coat' || look.kind === 'blazer';
  shape(chest, [0, coat ? .949 : 1.027, .003], [.202, coat ? .242 : .179, .119], look.jacket, 12, 7);
  shape(chest, [0, 1.082, .036], [.153, .144, .099], look.jacket, 10);
  shape(chest, [0, 1.041, .112], [.060, .141, .026], look.shirt, 8);
  shape(chest, [0, 1.214, .012], [.076, .092, .072], look.skin, 9, 5);
  for (const side of [-1, 1]) {
    shape(chest, [side * .067, 1.132, .109], [.026, .066, .027], lighten(rgb(look.jacket), 1.21), 7, 4);
    shape(chest, [side * .095, .929, .101], [.030, .025, .015], lighten(rgb(look.jacket), 1.25), 7, 3);
  }
  if (look.kind === 'field' || look.kind === 'cap') {
    shape(chest, [-.133, 1.083, -.096], [.099, .151, .087], look.bag);
    shape(chest, [.133, 1.083, -.096], [.099, .151, .087], look.bag);
  } else {
    shape(hips, [.209, .796, .075], [.071, .098, .049], look.bag);
    shape(chest, [.143, 1.043, .113], [.023, .134, .014], look.bag, 7, 5);
  }

  shape(head, [0, 1.415, .024], [.155, .178, .135], look.skin, 14, 9);
  shape(head, [0, 1.370, .084], [.117, .104, .086], look.skin, 12, 7);
  shape(head, [0, 1.417, .158], [.027, .031, .023], lighten(rgb(look.skin), 1.06), 8, 5);
  shape(head, [0, 1.358, .165], [.035, .011, .011], '94586D', 8, 4);
  for (const side of [-1, 1]) {
    shape(head, [side * .142, 1.407, .026], [.029, .052, .042], look.skin, 8, 5);
    shape(head, [side * .058, 1.456, .147], [.037, .022, .014], 'EFE2DB', 8, 5);
    shape(head, [side * .055, 1.456, .159], [.017, .021, .010], '382D49', 9, 5);
    shape(head, [side * .051, 1.463, .168], [.004, .006, .005], 'FFF0DC', 6, 3);
    shape(head, [side * .059, 1.495, .133], [.034, .009, .012], look.hair, 8, 4);
  }

  shape(head, [0, 1.506, -.018], [.165, .128, .137], look.hair, 14, 8);
  if (look.kind === 'cap') {
    shape(head, [0, 1.550, .009], [.168, .092, .149], look.jacket, 12, 6);
    shape(head, [0, 1.524, .133], [.113, .019, .100], look.jacket, 12, 5);
    shape(head, [0, 1.582, .119], [.025, .021, .012], look.shirt, 8, 4);
  } else {
    for (const side of [-1, 1]) {
      const height = look.kind === 'bob' ? 1.429 : 1.484;
      shape(head, [side * .137, height, -.014], [.052, .104, .103], look.hair, 10);
    }
    shape(head, [-.065, 1.545, .101], [.099, .059, .053], lighten(rgb(look.hair), 1.17), 11);
    shape(head, [.075, 1.538, .084], [.078, .057, .053], look.hair, 10);
    if (look.kind === 'pony') shape(head, [.069, 1.449, -.147], [.084, .149, .074], look.hair, 10, 7);
    if (look.kind === 'coat') shape(head, [.037, 1.63, -.051], [.074, .061, .073], look.hair, 10);
  }

  for (const { side, shoulder, elbow, hip, knee, ankle } of limbs) {
    shape(shoulder, [side * .205, 1.117, .001], [.062, .120, .068], look.jacket, 9);
    shape(elbow, [side * .211, .923, .007], [.049, .116, .052], look.jacket, 9);
    shape(elbow, [side * .211, .837, .010], [.043, .061, .045], look.skin, 9, 5);
    shape(hip, [side * .098, .614, .006], [.084, .185, .084], look.trousers, 9);
    shape(knee, [side * .098, .287, .005], [.066, .177, .069], look.trousers, 9);
    shape(ankle, [side * .098, .078, .051], [.075, .066, .144], look.shoe, 10, 6);
    shape(ankle, [side * .098, .032, .053], [.078, .026, .142], 'B7AFBF', 9, 4);
  }

  const data = new B.VertexData();
  Object.assign(data, { positions, normals, colors, indices, matricesIndices: matrices, matricesWeights: weights });
  const mesh = new B.Mesh(`City resident ${seed}`, scene);
  data.applyToMesh(mesh);
  mesh.parent = anchor;
  mesh.material = material;
  mesh.skeleton = skeleton;
  mesh.numBoneInfluencers = 1;
  mesh.isPickable = false;
  mesh.rotationQuaternion = null;
  const proportion = .86 + (seed * 7 % 9) * .017;
  mesh.scaling.set(proportion * (.94 + seed % 5 * .025), proportion, proportion);

  // Each resident is a single skinned mesh. One weighted joint per vertex keeps the gait cheap.
  const hipPos = new B.Vector3(0, .79, 0);
  const gripOffset = new B.Vector3(-.005, -.163, .028);
  const mouthCenter = new B.Vector3(0, .058, .165);
  const turn = (joint, x, y = 0, z = 0) => joint.setYawPitchRoll(y, x, z, B.Space.LOCAL);
  function pose(phase, walking, time, action = 'stand') {
    if (action === 'sit' || action === 'thanks' || action === 'drink') {
      hipPos.y = .55;
      hips.setPosition(hipPos, B.Space.LOCAL);
      const gratitude = action === 'thanks' ? .5 + .5 * Math.sin(time * TAU / 1.45) : 0;
      const sip = action === 'drink' ? Math.sin(Math.PI * (Math.min(3.6, Math.max(0, time)) % 1.2) / 1.2) ** 2 : 0;
      turn(chest, .084 + gratitude * .13);
      turn(head, -.04 + gratitude * .20 - sip * .11, .07 * gratitude - sip * .11);
      for (const { side, shoulder, elbow, hip, knee, ankle } of limbs) {
        turn(hip, -1.46, side * .10);
        turn(knee, 1.56);
        turn(ankle, -.095);
        turn(shoulder, -.31 - gratitude * .34, 0, side * .18);
        turn(elbow, -.48 - gratitude * .58);
      }
      if (action === 'drink') {
        const hand = limbs[0];
        turn(hand.shoulder, -.31 - sip * 1.09, .40 * sip, -.18 + .22 * sip);
        turn(hand.elbow, -.48 - sip * 1.08, .28 * sip);
      }
      return;
    }
    const stride = Math.sin(phase);
    const rise = Math.abs(Math.cos(phase)) * .023 * walking;
    hipPos.y = .79 + rise + Math.sin(time * 2.2) * .009 * (1 - walking);
    hips.setPosition(hipPos, B.Space.LOCAL);
    turn(chest, .03 * walking, stride * .105 * walking, stride * .042 * walking);
    turn(head, .028 + Math.sin(time * 2.5) * .025, -stride * .063 * walking);
    for (const { side, shoulder, elbow, hip, knee, ankle } of limbs) {
      const forward = side * stride;
      const lift = Math.max(0, -side * Math.cos(phase));
      const legPitch = .53 * forward * walking;
      const bend = .66 * lift * walking;
      turn(hip, legPitch);
      turn(knee, bend);
      turn(ankle, -.55 * legPitch - .36 * bend);
      turn(shoulder, -.37 * forward * walking - .058, 0, side * .108);
      turn(elbow, -.16 - Math.max(0, forward) * .19 * walking);
    }
    if (action === 'pay') {
      const reach = Math.sin(Math.PI * Math.min(1, Math.max(0, time / 1.2))) ** .65;
      turn(chest, .12 * reach, -.09 * reach);
      turn(head, .12 * reach);
      turn(limbs[0].shoulder, -.058 - .88 * reach, .20 * reach, -.108);
      turn(limbs[0].elbow, -.16 - .64 * reach);
    }
  }
  return {
    mesh, pose,
    getHandWorldPosition() {
      mesh.computeWorldMatrix(true);
      return limbs[0].elbow.getAbsolutePositionFromLocal(gripOffset, mesh);
    },
    getMouthWorldPosition() {
      mesh.computeWorldMatrix(true);
      return head.getAbsolutePositionFromLocal(mouthCenter, mesh);
    },
    dispose() { mesh.dispose(); skeleton.dispose(); },
  };
}

function residentMaterial(B, scene) {
  const material = new B.StandardMaterial('Seoul resident fabrics', scene);
  material.diffuseColor = B.Color3.White();
  material.specularColor = new B.Color3(.041, .035, .052);
  material.sideOrientation = B.Material.CounterClockWiseSideOrientation;
  return material;
}

export function createSumiGuest(B, scene, anchor, visitorId = FIRST_SUMI_GUEST) {
  const number = Number(/^sumi-guest-([1-9]\d*)$/.exec(visitorId)?.[1]);
  if (!Number.isSafeInteger(number)) throw new RangeError('Sumi misafir kimliği geçersiz');
  const material = residentMaterial(B, scene);
  const look = LOOKS[SUMI_PALETTES[(number - 1) % SUMI_PALETTES.length]];
  const seed = number === 1 ? SUMI_GUEST_SEED : 100 + number % 4093;
  const rig = createRig(B, scene, anchor, material, look, seed);
  rig.mesh.metadata = { visitorId };
  let disposed = false;
  return {
    mesh: rig.mesh,
    pose: rig.pose,
    getHandWorldPosition: rig.getHandWorldPosition,
    getMouthWorldPosition: rig.getMouthWorldPosition,
    dispose() {
      if (disposed) return;
      disposed = true;
      rig.dispose();
      material.dispose();
    },
  };
}

const lanes = CITY_BLOCKS.flatMap((block, blockIndex) => [-1, 1].map((normal, side) => {
  const buildings = block.buildings.filter(building => building.door.nz === normal);
  const first = buildings[0], last = buildings.at(-1);
  return {
    id: blockIndex * 2 + side,
    block, buildings,
    z: first.door.z + normal * .81,
    left: first.x - first.width / 2 - .47,
    right: last.x + last.width / 2 + .47,
  };
}));

const sumiAddress = getBuilding(SUMI_CAFE_ID);
const sumiLane = lanes.find(lane => lane.buildings.includes(sumiAddress));

function laneDistance(lane, x, z) {
  return Math.hypot(Math.max(lane.left - x, x - lane.right, 0), lane.z - z);
}

function storefront(building, distance) {
  const d = building.door;
  return { x: d.x + d.nx * distance, z: d.z + d.nz * distance };
}

function approachPlan(npc, building) {
  npc.target = building;
  npc.phase = 'sidewalk';
  npc.to = { x: building.door.x, z: npc.lane.z };
}

function residentFor(B, scene, anchor, material, lane, x, z, time) {
  const side = x < lane.block.x ? -1 : 1;
  const nearSide = side < 0 ? 0 : lane.buildings.length - 1;
  const initial = lane.buildings[nearSide];
  const mode = (lane.id + 1) % 3;
  const style = LOOKS[(lane.id * 7 + initial.typeIndex * 3 + lane.block.row) % LOOKS.length];
  const rig = createRig(B, scene, anchor, material, style, lane.id);
  const edgeX = side < 0 ? lane.left : lane.right;
  const pavementStart = storefront(initial, .81);
  pavementStart.x += side * (1.08 + mode * .31);
  const atSidewalk = mode !== 0 && Math.hypot(pavementStart.x - x, pavementStart.z - z) >= 1.15;
  const start = atSidewalk ? pavementStart : { x: edgeX, z: lane.block.z + initial.door.nz * .83 };
  if (Math.hypot(start.x - x, start.z - z) < 1.15) start.z += initial.door.nz * 1.75;
  const npc = {
    rig, lane, x: start.x, z: start.z, yaw: initial.door.yaw,
    to: atSidewalk ? { x: initial.door.x, z: lane.z } : { x: edgeX, z: lane.z },
    target: initial, phase: atSidewalk ? 'sidewalk' : 'corner',
    stride: lane.id * .81, speed: .91 + (lane.id * 13 % 9) * .041, effort: 0,
    count: 0, resume: time,
  };
  rig.mesh.position.set(npc.x, .004, npc.z);
  rig.pose(npc.stride, 0, time);
  return npc;
}

function startSumiGuest(B, scene, anchor, time, visitorId) {
  const rig = createSumiGuest(B, scene, anchor, visitorId);
  // Visible ahead of Sofia at the city gate, then across the boulevard and along the café pavement.
  const first = visitorId === FIRST_SUMI_GUEST;
  const edge = sumiLane.left;
  const x = first ? CITY_ENTRY.x + .75 : edge;
  const z = first ? CITY_ENTRY.z - 2.55 : sumiLane.z - sumiAddress.door.nz * 3.3;
  const yaw = first ? Math.atan2(edge - x, 0) : sumiAddress.door.yaw;
  const corner = { x: edge, z: sumiLane.z };
  rig.mesh.position.set(x, .004, z);
  rig.mesh.rotation.y = yaw;
  rig.pose(0, 0, time);
  return {
    rig, lane: sumiLane, x, z, yaw, target: sumiAddress,
    phase: first ? 'approach' : 'corner', to: first ? { x: edge, z } : corner, corner,
    visitorId, stride: 0, speed: 1.28, effort: 0, resume: time,
  };
}

function reached(npc, time) {
  const { phase, target } = npc;
  if (phase === 'approach') {
    npc.phase = 'corner';
    npc.to = npc.corner;
  } else if (phase === 'corner') {
    approachPlan(npc, target);
  } else if (phase === 'sidewalk') {
    npc.phase = 'doorway';
    npc.resume = time + .28 + (npc.lane.id % 4) * .061;
    npc.to = null;
  } else if (phase === 'enter') {
    npc.rig.mesh.setEnabled(false);
    npc.to = null;
    if (npc.visitorId) {
      npc.phase = 'arrived';
    } else {
      npc.phase = 'inside';
      npc.resume = time + 2.8 + ((npc.lane.id + npc.count * 3) % 5) * .49;
    }
  } else if (phase === 'exit') {
    npc.count++;
    const at = npc.lane.buildings.indexOf(target);
    const offset = 1 + (npc.lane.id + npc.count) % (npc.lane.buildings.length - 1);
    approachPlan(npc, npc.lane.buildings[(at + offset) % npc.lane.buildings.length]);
  } else if (phase === 'sumi-exit') {
    npc.to = npc.exitSteps.shift();
    if (!npc.to) {
      npc.phase = 'depart-corner';
      npc.to = { x: npc.corner.x, z: npc.corner.z - target.door.nz * 3.15 };
    }
  } else if (phase === 'depart-corner') {
    npc.phase = 'left';
    npc.to = null;
  }
}

function fits(npc, x, z, player, residents) {
  if (!walkable(x, z, BODY_RADIUS)) return false;
  const approaching = (peerX, peerZ, distance) => {
    const next = Math.hypot(x - peerX, z - peerZ);
    return next < distance && next < Math.hypot(npc.x - peerX, npc.z - peerZ);
  };
  return !approaching(player.x, player.z, PLAYER_CLEARANCE) && residents.every(peer =>
    peer === npc || peer.phase === 'inside' || !approaching(peer.x, peer.z, BODY_RADIUS * 2));
}

function clearsPerson(from, to, person, clearance) {
  if (!Number.isFinite(person.x)) return true;
  const dx = to.x - from.x, dz = to.z - from.z;
  const qx = person.x - from.x, qz = person.z - from.z;
  const length = dx * dx + dz * dz;
  if (!length) return true;
  const nearest = Math.max(0, Math.min(1, (qx * dx + qz * dz) / length));
  const distance = (qx - dx * nearest) ** 2 + (qz - dz * nearest) ** 2;
  // If Sofia walks into the guest's space, permit a step that moves the guest away.
  return distance >= Math.min(clearance ** 2, qx * qx + qz * qz) - 1e-8;
}

function sumiExitSegment(npc, from, to, player, peers) {
  if (!clearsPerson(from, to, player, PLAYER_CLEARANCE)) return false;
  if (peers.some(peer => peer !== npc && peer.rig.mesh.isEnabled() &&
      !clearsPerson(from, to, peer, BODY_RADIUS * 2))) return false;
  const { door } = npc.target;
  const jamb = door.width / 2 - BODY_RADIUS - .015;
  const dx = to.x - from.x, dz = to.z - from.z;
  const samples = Math.ceil(Math.hypot(dx, dz) / .08);
  for (let i = 1; i <= samples; i++) {
    const x = from.x + dx * i / samples, z = from.z + dz * i / samples;
    const depth = (z - door.z) * door.nz;
    if (depth < 0 || (!walkable(x, z, BODY_RADIUS) && (depth > .245 || Math.abs(x - door.x) > jamb))) return false;
  }
  return true;
}

function sumiExitRoute(npc, player, peers) {
  const { door } = npc.target;
  const depth = (npc.z - door.z) * door.nz;
  const point = (offset, distance) => ({ x: door.x + offset, z: door.z + door.nz * distance });
  const routes = [[point(depth < .245 ? 0 : npc.x - door.x, .81), npc.corner]];
  const jamb = door.width / 2 - BODY_RADIUS - .015;
  for (const side of [-1, 1]) {
    const ahead = depth < .245 ? [point(side * jamb, depth), point(side * jamb, .245)] : [];
    for (const bypass of [.81, .245, 1.48]) {
      // Step past the jamb before taking the vacant side, then return to the sidewalk.
      const outer = point(side * .76, Math.max(depth, .245));
      const mergeX = Math.min(npc.x - door.x, -1.17);
      routes.push([...ahead, outer, point(side * .76, bypass), point(mergeX, bypass), point(mergeX, .81), npc.corner]);
    }
  }
  return routes.find(points => points.every((to, index) =>
    sumiExitSegment(npc, index ? points[index - 1] : npc, to, player, peers)));
}

function stepAlong(npc, player, residents, dt, time) {
  const dx = npc.to.x - npc.x, dz = npc.to.z - npc.z;
  const distance = Math.hypot(dx, dz);
  const step = Math.min(distance, npc.speed * dt * (npc.phase === 'enter' ? .68 : 1));
  if (!distance) {
    reached(npc, time);
    return 0;
  }
  const sx = dx * step / distance, sz = dz * step / distance;
  const inDoor = npc.phase === 'enter' || npc.phase === 'exit';
  let x = npc.x + sx, z = npc.z + sz;
  if (npc.phase === 'sumi-exit') {
    if (!sumiExitSegment(npc, npc, { x, z }, player, residents)) {
      const route = sumiExitRoute(npc, player, residents);
      if (route) {
        npc.to = route.shift();
        npc.exitSteps = route;
      }
      return 0;
    }
  } else if (inDoor) {
    // Only the last fraction inside the named doorway bypasses the exterior wall collider.
    if (Math.hypot(x - player.x, z - player.z) < PLAYER_CLEARANCE &&
        Math.hypot(x - player.x, z - player.z) < Math.hypot(npc.x - player.x, npc.z - player.z)) return 0;
  } else if (!fits(npc, x, z, player, residents)) {
    // Move toward the curb to give way without stepping into the storefront.
    const away = npc.target.door.nz;
    x = npc.x + sx * .52;
    z = npc.z + away * (npc.speed * dt * .46);
    if (Math.abs(z - npc.lane.z) > .41 || !fits(npc, x, z, player, residents)) return 0;
  }
  const walked = Math.hypot(x - npc.x, z - npc.z);
  npc.yaw = approachAngle(npc.yaw, Math.atan2(x - npc.x, z - npc.z), dt);
  npc.x = x;
  npc.z = z;
  if (Math.hypot(npc.to.x - x, npc.to.z - z) < .005) reached(npc, time);
  return walked;
}

function animateResident(npc, player, residents, dt, time) {
  if (npc.phase === 'inside') {
    const landing = storefront(npc.target, .30);
    if (time < npc.resume || Math.hypot(landing.x - player.x, landing.z - player.z) < PLAYER_CLEARANCE) return;
    npc.phase = 'exit';
    npc.yaw = npc.target.door.yaw;
    npc.to = storefront(npc.target, .81);
    npc.rig.mesh.setEnabled(true);
  } else if (npc.phase === 'doorway') {
    npc.yaw = approachAngle(npc.yaw, npc.target.door.yaw + Math.PI, dt);
    if (time >= npc.resume) {
      npc.phase = 'enter';
      npc.to = storefront(npc.target, .074);
    }
  }
  const distance = npc.to ? stepAlong(npc, player, residents, dt, time) : 0;
  npc.stride = (npc.stride + distance / .91 * TAU) % TAU;
  const walking = dt ? Math.min(1, distance / (dt * npc.speed)) : 0;
  npc.effort += (walking - npc.effort) * (1 - Math.exp(-dt * 14));
  npc.rig.mesh.position.set(npc.x, .004, npc.z);
  npc.rig.mesh.rotation.y = npc.yaw;
  npc.rig.pose(npc.stride, npc.effort, time + npc.lane.id);
}

export function createCityPedestrians(B, scene, anchor, { onSumiGuestEnter } = {}) {
  if (!anchor) throw new Error('Seul sakinleri için yerel sahne kökü eksik');
  if (!sumiAddress || !sumiLane) throw new Error('Sumi Café sokak rotası eksik');
  const material = residentMaterial(B, scene);
  const residents = [];
  let sumiGuest;
  let visitorNumber = 1;
  let waitingVisitor = FIRST_SUMI_GUEST;
  let time = 0, nextRefresh = 0;
  let lastX = Infinity, lastZ = Infinity;
  let disposed = false;

  function refresh(x, z) {
    for (let i = residents.length - 1; i >= 0; i--) {
      const npc = residents[i];
      if (Math.hypot(x - npc.x, z - npc.z) > KEEP_DISTANCE && laneDistance(npc.lane, x, z) > SPAWN_DISTANCE * .81) {
        npc.rig.dispose();
        residents.splice(i, 1);
      }
    }
    const regularLimit = MAX_RESIDENTS - 1;
    if (residents.length === regularLimit) return;
    const present = new Set(residents.map(npc => npc.lane));
    const nearby = lanes.filter(lane => lane !== sumiLane && !present.has(lane))
      .map(lane => ({ lane, distance: laneDistance(lane, x, z) }))
      .filter(({ distance }) => distance < SPAWN_DISTANCE)
      .sort((a, b) => a.distance - b.distance || a.lane.id - b.lane.id);
    for (const { lane } of nearby.slice(0, regularLimit - residents.length)) {
      residents.push(residentFor(B, scene, anchor, material, lane, x, z, time));
    }
  }

  function advanceGuest(player, peers, elapsed) {
    if (!sumiGuest && waitingVisitor) {
      sumiGuest = startSumiGuest(B, scene, anchor, time, waitingVisitor);
      waitingVisitor = null;
    }
    if (!sumiGuest || sumiGuest.phase === 'arrived') return;
    if (sumiGuest.phase === 'release') {
      if (Math.hypot(sumiGuest.x - player.x, sumiGuest.z - player.z) < PLAYER_CLEARANCE) return;
      const route = sumiExitRoute(sumiGuest, player, peers);
      if (!route) return;
      sumiGuest.phase = 'sumi-exit';
      sumiGuest.yaw = sumiAddress.door.yaw;
      sumiGuest.speed = 1.41;
      sumiGuest.to = route.shift();
      sumiGuest.exitSteps = route;
      sumiGuest.rig.mesh.setEnabled(true);
    }
    animateResident(sumiGuest, player, peers, elapsed, time);
    if (sumiGuest.phase === 'left') {
      sumiGuest.rig.dispose();
      sumiGuest = null;
    } else if (sumiGuest.phase === 'arrived') {
      onSumiGuestEnter?.({ buildingId: SUMI_CAFE_ID, visitorId: sumiGuest.visitorId });
    }
  }

  return {
    update(x, z, dt) {
      if (disposed || ![x, z, dt].every(Number.isFinite) || dt < 0) return;
      const elapsed = Math.min(dt, .12);
      time += elapsed;
      if (time >= nextRefresh || Math.hypot(x - lastX, z - lastZ) > 12) {
        refresh(x, z);
        nextRefresh = time + .45;
        lastX = x;
        lastZ = z;
      }
      const player = { x, z };
      advanceGuest(player, residents, elapsed);
      const peers = sumiGuest?.rig.mesh.isEnabled() ? [...residents, sumiGuest] : residents;
      for (const npc of residents) animateResident(npc, player, peers, elapsed, time);
    },
    hasSumiGuestArrived(visitorId) {
      return sumiGuest?.phase === 'arrived' && (visitorId === undefined || visitorId === sumiGuest.visitorId);
    },
    releaseSumiGuest(visitorId) {
      if (disposed || sumiGuest?.phase !== 'arrived' || sumiGuest.visitorId !== visitorId) return false;
      sumiGuest.phase = 'release';
      return true;
    },
    startSumiVisit() {
      if (disposed) return null;
      if (waitingVisitor) return waitingVisitor;
      if (sumiGuest && !DEPARTURE_PHASES.has(sumiGuest.phase)) return sumiGuest.visitorId;
      waitingVisitor = `sumi-guest-${++visitorNumber}`;
      return waitingVisitor;
    },
    advanceSumiGuest(dt) {
      if (disposed || !Number.isFinite(dt) || dt < 0) return;
      const elapsed = Math.min(dt, .12);
      time += elapsed;
      advanceGuest(AWAY_FROM_STREET, [], elapsed);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      for (const npc of residents) npc.rig.dispose();
      residents.length = 0;
      sumiGuest?.rig.dispose();
      material.dispose();
    },
  };
}
