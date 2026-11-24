import { SUMI_CAFE_ID } from './city-grid.js';
import { createSumiGuest } from './city-pedestrians.js';
import { SUMI_DELIVERY_LAYOUT } from './sumi-delivery-scene.js';

const SPAWN = { x: 0, z: 2.95 };
const EXIT = { x: 0, z: 3.52 };
const EXIT_APPROACH = { x: 0, z: 3.20 };
const LEGACY = { x: 0, z: -1.82 };
const RADIUS = .30;
const GRID = .24;
const NEIGHBORS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1], [-.707, -.707], [.707, -.707], [-.707, .707], [.707, .707]];
const STAGES = { intro: 'host', work: 'work', display: 'display', decision: 'host', done: 'host' };
const GROUPS = ['host', 'work', 'display'];
const FOOTPRINT = { host: .28, work: .39, display: .39 };
const GOLD = '#ffe0a7';
const IVORY = '#fff1d7';
const CHARCOAL = '#493b52';
const PALETTES = ['#ce7f95', '#80b7a8', '#b599d6', '#e4aa78', '#86b1d5', '#d896b4', '#a2ba81', '#c8856b', '#91a1d2', '#db9d84'];

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

function fixtureClear(fixtures, x, z, radius) {
  return fixtures.every(({object, footprint}) => Math.hypot(x - object.x, z - object.z) >= radius + footprint);
}

function sumiProtected() {
  const { tableApproach, paymentApproach } = SUMI_DELIVERY_LAYOUT;
  return [
    { ...tableApproach, radius: .72 }, { ...paymentApproach, radius: .72 },
    { x: 1, z: -1.35, radius: .70 }, { x: -.72, z: 2.68, radius: .77 },
    { x: -1.06, z: .96, radius: .65 }, { x: -1.03, z: -.65, radius: .62 },
  ];
}

function reachable(canStep) {
  const index = (x, z) => `${x}/${z}`;
  const from = { x: Math.round(SPAWN.x / GRID), z: Math.round(SPAWN.z / GRID) };
  const queue = [from], visited = new Set([index(from.x, from.z)]);
  for (let head = 0; head < queue.length; head++) {
    const {x, z} = queue[head];
    for (const [dx, dz] of NEIGHBORS) {
      const xx = x + dx, zz = z + dz;
      if (xx < -16 || xx > 16 || zz < -14 || zz > 14) continue;
      if (visited.has(index(xx, zz)) || !canStep(xx * GRID, zz * GRID) ||
          !canStep((x + dx * .5) * GRID, (z + dz * .5) * GRID)) continue;
      visited.add(index(xx, zz));
      queue.push({x: xx, z: zz});
    }
  }
  return queue.map(({x, z}) => ({x: x * GRID, z: z * GRID}));
}

function planRoom(walkable, building) {
  const sumi = building.id === SUMI_CAFE_ID;
  const protectedPoints = sumi ? sumiProtected() : [];
  const legacy = [LEGACY, EXIT_APPROACH];
  if (sumi) legacy.push(SUMI_DELIVERY_LAYOUT.tableApproach, SUMI_DELIVERY_LAYOUT.paymentApproach);
  const free = reachable((x, z) => walkable(x, z, RADIUS));
  const positions = Object.create(null);
  const used = [];
  const wishes = sumi ? [{x: 1.55, z: 2.10}, {x: 1.30, z: .54}, {x: 2.78, z: 2.12}] :
    [{x: -1.43, z: 1.86}, {x: -1.35, z: -.55}, {x: 1.40, z: -.34}];

  for (const [index, group] of GROUPS.entries()) {
    const rank = point => distance(point, wishes[index]);
    const candidates = free.filter(point => distance(point, LEGACY) >= 1.34 && distance(point, EXIT) >= 1.37 &&
      protectedPoints.every(spot => distance(point, spot) >= spot.radius) &&
      used.every(other => distance(point, other.station) >= 1.34 && distance(point, other.object) >= .67))
      .sort((a, b) => rank(a) - rank(b));
    let found;
    for (const station of candidates) {
      const offsets = DIRECTIONS.map(([dx, dz]) => ({x: station.x + dx * .84, z: station.z + dz * .84}));
      offsets.sort((a, b) => Math.abs(b.x) + b.z * .16 - Math.abs(a.x) - a.z * .16);
      for (const object of offsets) {
        if (!walkable(object.x, object.z, FOOTPRINT[group]) || distance(SPAWN, object) < .98 ||
            legacy.some(point => distance(point, object) < .81) ||
            protectedPoints.some(point => distance(point, object) < point.radius + .16) ||
            used.some(other => distance(other.object, object) < .84 || distance(other.station, object) < .68)) continue;
        const entry = {station, object, footprint: FOOTPRINT[group], yaw: Math.atan2(station.x - object.x, station.z - object.z)};
        const fixtures = [...used, entry];
        const canStep = (x, z) => walkable(x, z, RADIUS) && fixtureClear(fixtures, x, z, RADIUS);
        const reach = reachable(canStep);
        const targets = [station, ...used.map(entry => entry.station), ...legacy];
        if (targets.some(target => !reach.some(node => distance(node, target) < .25) || !canStep(target.x, target.z))) continue;
        found = entry;
        break;
      }
      if (found) break;
    }
    if (!found) throw new Error(`${building.id} ${group} hikâye alanı için yürünebilir konum yok`);
    positions[group] = found;
    used.push(found);
  }
  return positions;
}

function surface(B, scene, name, color = '#ffffff') {
  const material = new B.StandardMaterial(name, scene);
  material.diffuseColor = B.Color3.FromHexString(color);
  material.specularColor.set(.12, .105, .125);
  return material;
}

function paletteMesh(B, scene, parent, material, name, build) {
  const parts = [];
  function shape(kind, x, y, z, width, height, depth, paint, pitch = 0, yaw = 0, roll = 0) {
    const mesh = kind === 'orb' ? B.MeshBuilder.CreateSphere(name, {diameter: 1, segments: 5}, scene) :
      kind === 'box' ? B.MeshBuilder.CreateBox(name, {}, scene) :
        B.MeshBuilder.CreateCylinder(name, {tessellation: 12, diameterTop: kind === 'cone' ? .60 : 1}, scene);
    mesh.position.set(x, y, z);
    mesh.scaling.set(width, height, depth);
    mesh.rotation.set(pitch, yaw, roll);
    const color = B.Color3.FromHexString(paint);
    const vertices = new Float32Array(mesh.getTotalVertices() * 4);
    for (let i = 0; i < vertices.length; i += 4) {
      vertices[i] = color.r;
      vertices[i + 1] = color.g;
      vertices[i + 2] = color.b;
      vertices[i + 3] = 1;
    }
    mesh.setVerticesData(B.VertexBuffer.ColorKind, vertices);
    parts.push(mesh);
  }
  const tools = Object.fromEntries(['box', 'orb', 'disk', 'cone'].map(kind => [kind, (...args) => shape(kind, ...args)]));
  build(tools);
  const mesh = B.Mesh.MergeMeshes(parts, true, true);
  if (!mesh) throw new Error(`Dükkân eşyası birleştirilemedi: ${name}`);
  mesh.name = name;
  mesh.parent = parent;
  mesh.material = material;
  mesh.isPickable = false;
  return mesh;
}

const HEIGHT = .75;

function mug(shape, x, y, z, color) {
  shape.cone(x, y + .088, z, .16, .176, .16, color);
  shape.disk(x, y + .174, z, .153, .014, .153, IVORY);
  shape.disk(x, y + .182, z, .122, .010, .122, '#985e57');
  shape.orb(x + .081, y + .088, z, .067, .106, .042, color);
  shape.disk(x, y + .015, z, .255, .030, .25, '#e7ba94');
}

function openBook(shape, x, y, z, color) {
  shape.box(x, y + .015, z, .39, .032, .28, color);
  for (const side of [-1, 1]) {
    shape.box(x + side * .084, y + .04, z, .171, .036, .245, IVORY, 0, 0, side * -.12);
    for (let index = 0; index < 4; index++) {
      shape.box(x + side * .080, y + .062, z - .066 + index * .040, .090, .005, .008, '#9b796d');
    }
  }
}

function parcel(shape, x, y, z, color, height = .16) {
  shape.box(x, y + height / 2, z, .245, height, .19, color);
  shape.box(x, y + height + .005, z, .252, .013, .030, GOLD);
  shape.box(x, y + height + .008, z, .035, .015, .196, GOLD);
  shape.orb(x - .04, y + height + .027, z, .097, .053, .061, '#d37d96', 0, 0, .32);
  shape.orb(x + .04, y + height + .027, z, .097, .053, .061, '#d37d96', 0, 0, -.32);
}

function camera(shape, x, y, z, color) {
  shape.box(x, y + .111, z, .266, .192, .14, CHARCOAL);
  shape.box(x, y + .058, z, .269, .046, .145, color);
  shape.disk(x, y + .125, z + .079, .122, .044, .122, '#887d9b', Math.PI / 2);
  shape.disk(x, y + .125, z + .105, .090, .030, .090, '#789eaf', Math.PI / 2);
  shape.box(x + .075, y + .217, z, .047, .027, .042, GOLD);
}

function bouquet(shape, x, y, z, color) {
  shape.cone(x, y + .088, z, .157, .173, .139, '#ae8c73');
  shape.disk(x, y + .177, z, .122, .018, .122, '#805851');
  for (let index = 0; index < 5; index++) {
    const dx = (index - 2) * .052;
    const height = .213 + (index % 3) * .046;
    shape.box(x + dx * .54, y + .16 + height / 2, z, .016, height, .014, '#659784', 0, 0, dx * -3.1);
    shape.orb(x + dx, y + .16 + height, z, .086, .078, .061, index % 2 ? GOLD : color);
  }
}

function bottle(shape, x, y, z, color, scale = 1) {
  shape.cone(x, y + .09 * scale, z, .104 * scale, .18 * scale, .095 * scale, color);
  shape.disk(x, y + .192 * scale, z, .062 * scale, .052 * scale, .062 * scale, CHARCOAL);
  shape.box(x, y + .087 * scale, z + .047 * scale, .060 * scale, .051 * scale, .009, IVORY);
}

function dish(shape, x, y, z, color) {
  shape.disk(x, y + .025, z, .348, .044, .344, '#dba993');
  shape.disk(x, y + .055, z, .286, .033, .282, '#fff0d1');
  for (let index = 0; index < 3; index++) {
    shape.orb(x + (index - 1) * .072, y + .096, z - (index % 2) * .036, .099, .085, .091,
      index % 2 ? '#90b888' : color);
  }
}

function smallScreen(shape, x, y, z, color, light) {
  shape.box(x, y + .034, z, .24, .068, .17, CHARCOAL);
  shape.box(x, y + .157, z, .245, .158, .064, color);
  shape.box(x, y + .157, z + .035, .205, .119, .021, '#504560');
  for (let index = 0; index < 3; index++) {
    shape.box(x + (index - 1) * .048, y + .132 + index * .017, z + .048, .026, .034 + index * .023, .010, light);
  }
}

// Each recipe makes a recognisable three-dimensional object for its own shop type.
const CRAFTS = {
  cafe: mug,
  restaurant: dish,
  bakery(s, x, y, z, color) {
    s.box(x, y + .016, z, .33, .032, .24, '#ca936f');
    s.orb(x, y + .078, z, .28, .132, .184, '#d5a16b');
    for (const dx of [-.076, 0, .076]) s.box(x + dx, y + .139, z, .017, .013, .086, color, 0, .27);
  },
  convenience(s, x, y, z, color) {
    s.box(x - .05, y + .102, z, .119, .204, .106, color);
    s.box(x - .05, y + .113, z + .055, .088, .075, .012, IVORY);
    s.disk(x - .05, y + .213, z, .039, .026, .040, GOLD);
    bottle(s, x + .077, y, z - .018, '#a6c8b1', .82);
  },
  fashion(s, x, y, z, color) {
    s.box(x, y + .033, z, .33, .064, .22, CHARCOAL, 0, .12);
    s.box(x, y + .086, z, .31, .043, .213, '#d9abc0', 0, -.12);
    s.box(x, y + .123, z, .28, .045, .188, color, 0, .05);
    s.box(x + .05, y + .152, z, .022, .011, .179, GOLD, 0, .05);
  },
  cosmetics(s, x, y, z, color) {
    s.disk(x - .053, y + .039, z + .02, .187, .074, .160, color);
    s.disk(x - .056, y + .083, z + .02, .139, .020, .122, '#e9b3b9');
    bottle(s, x + .079, y, z - .039, '#e5b3a0', .87);
  },
  florist: bouquet,
  bookstore: openBook,
  records(s, x, y, z, color) {
    s.box(x, y + .124, z - .054, .233, .238, .039, color, -.13);
    s.disk(x, y + .129, z - .027, .166, .022, .166, '#4f455e', Math.PI / 2 - .13);
    s.disk(x, y + .129, z - .014, .061, .010, .061, GOLD, Math.PI / 2 - .13);
    s.disk(x, y + .024, z + .06, .182, .045, .144, CHARCOAL);
  },
  karaoke(s, x, y, z, color) {
    s.disk(x, y + .02, z, .189, .041, .172, CHARCOAL);
    s.disk(x, y + .122, z, .043, .219, .043, '#74647f', 0, 0, -.17);
    s.orb(x + .020, y + .239, z, .082, .089, .080, color, 0, 0, -.17);
  },
  arcade(s, x, y, z, color) {
    smallScreen(s, x, y, z - .026, color, '#a9eddb');
    s.box(x, y + .061, z + .065, .244, .054, .113, color);
    s.orb(x - .054, y + .112, z + .085, .048, .044, .048, GOLD);
    s.disk(x + .05, y + .092, z + .086, .034, .020, .034, '#ed9fb6');
  },
  photobooth: camera,
  cinema(s, x, y, z, color) {
    s.box(x, y + .096, z, .246, .192, .058, CHARCOAL);
    s.box(x, y + .193, z, .251, .053, .058, color, 0, 0, -.14);
    for (let index = 0; index < 4; index++) s.box(x - .081 + index * .052, y + .186 + index * .007, z + .032, .022, .043, .009, IVORY, 0, 0, -.38);
    s.box(x, y + .10, z + .033, .178, .017, .009, '#d7bbaf');
  },
  gallery(s, x, y, z, color) {
    s.box(x, y + .139, z, .23, .271, .04, '#b18877', -.13);
    s.box(x, y + .139, z + .024, .189, .229, .018, IVORY, -.13);
    s.orb(x - .026, y + .171, z + .041, .110, .113, .021, color, -.13);
    s.box(x + .022, y + .103, z + .041, .102, .071, .015, '#8c9ac0', -.13, 0, -.24);
    s.box(x, y + .021, z + .05, .166, .041, .124, CHARCOAL);
  },
  'dance-studio'(s, x, y, z, color) {
    for (const side of [-1, 1]) {
      s.orb(x + side * .072, y + .056, z + side * .021, .12, .112, .221, color, 0, side * .21);
      s.box(x + side * .072, y + .018, z + side * .021, .117, .034, .192, IVORY, 0, side * .21);
      for (let index = 0; index < 3; index++) s.box(x + side * .073, y + .099, z - .018 + index * .031 + side * .021, .076, .009, .012, GOLD);
    }
  },
  'music-studio'(s, x, y, z, color) {
    s.box(x, y + .049, z, .35, .097, .21, CHARCOAL);
    for (let index = 0; index < 8; index++) {
      const xx = x + (index - 3.5) * .036;
      s.box(xx, y + .104, z + .016, .031, .019, .138, IVORY);
      if (index % 3 !== 2) s.box(xx + .016, y + .117, z - .023, .017, .016, .071, '#5e4c6b');
    }
    s.box(x, y + .105, z - .085, .265, .016, .022, color);
  },
  electronics(s, x, y, z, color) { smallScreen(s, x, y, z, color, '#b0ead3'); },
  'gift-shop': parcel,
  salon(s, x, y, z, color) {
    s.box(x - .047, y + .022, z, .172, .041, .105, color);
    for (let index = 0; index < 7; index++) s.box(x - .106 + index * .019, y + .019, z + .070, .009, .018, .072, CHARCOAL);
    bottle(s, x + .084, y, z - .02, '#c494ad', .82);
  },
  hotel(s, x, y, z, color) {
    s.disk(x - .055, y + .034, z, .177, .066, .155, CHARCOAL);
    s.orb(x - .055, y + .070, z, .156, .108, .137, '#e9ba7e');
    s.disk(x - .055, y + .133, z, .038, .033, .038, GOLD);
    s.box(x + .075, y + .034, z + .025, .084, .061, .145, color, 0, .22);
    s.box(x + .075, y + .068, z + .025, .045, .010, .081, IVORY, 0, .22);
  },
};

const ATLAS_SIZE = 512;
const ATLAS_PANELS = {
  host: { y: 0, height: 98, crop: 3 },
  work: { y: 99, height: 88, crop: 3 },
  display: { y: 188, height: 324, crop: 4 },
};

function wordLines(pen, label, width, max) {
  const lines = [];
  let line = '';
  for (const word of label.split(/\s+/)) {
    const next = line && `${line} ${word}`;
    if (next && pen.measureText(next).width > width) {
      lines.push(line);
      line = word;
    } else {
      line = next || word;
    }
  }
  if (line) lines.push(line);
  if (lines.length > max) {
    const available = lines.slice(0, max);
    available[max - 1] += '…';
    return available;
  }
  return lines;
}

function labelsFor(B, scene, root, material, atlas, place, kind, y, width, height) {
  const panel = ATLAS_PANELS[kind];
  const left = panel.crop / ATLAS_SIZE;
  const right = 1 - left;
  const high = 1 - (panel.y + panel.crop) / ATLAS_SIZE;
  const low = 1 - (panel.y + panel.height - panel.crop) / ATLAS_SIZE;
  const mesh = new B.Mesh(`Shop story ${kind} label`, scene);
  const data = new B.VertexData();
  data.positions = [-width / 2,-height / 2,0, width / 2,-height / 2,0, width / 2,height / 2,0, -width / 2,height / 2,0];
  data.normals = [0,0,1,0,0,1,0,0,1,0,0,1];
  data.uvs = [left,low,right,low,right,high,left,high];
  data.indices = [0,1,2,0,2,3];
  data.applyToMesh(mesh);
  mesh.material = material;
  material.emissiveTexture = atlas;
  mesh.parent = root;
  mesh.position.set(place.x, y, place.z);
  mesh.isPickable = false;
  return mesh;
}

function paintLabels(atlas, story, stage, ending, lang, accent) {
  const pen = atlas.getContext();
  pen.textAlign = 'center';
  pen.textBaseline = 'middle';
  for (const {y, height, crop} of Object.values(ATLAS_PANELS)) {
    pen.fillStyle = '#382d46';
    pen.fillRect(0, y, ATLAS_SIZE, height);
    pen.strokeStyle = accent;
    pen.lineWidth = 4;
    pen.strokeRect(crop + 5, y + crop + 5, ATLAS_SIZE - 2 * (crop + 5), height - 2 * (crop + 5));
  }
  pen.fillStyle = IVORY;
  pen.font = '700 48px system-ui, sans-serif';
  pen.fillText(story.host[lang], 256, 53, 452);
  pen.font = '700 35px system-ui, sans-serif';
  pen.fillText(lang === 'tr' ? 'Çalışma tezgâhı' : 'Рабочий стол', 256, 145, 452);
  const final = stage === 'done' && ending !== null;
  const title = final ? story.endings[ending].choice[lang] : story.title[lang];
  pen.fillStyle = GOLD;
  pen.font = '700 38px system-ui, sans-serif';
  const titles = wordLines(pen, title, 452, 2);
  for (const [index, line] of titles.entries()) pen.fillText(line, 256, 251 + 41 * index, 452);
  pen.fillStyle = IVORY;
  pen.font = '600 30px system-ui, sans-serif';
  const description = final ? story.endings[ending].result[lang] : lang === 'tr' ? 'Sergi' : 'Витрина';
  const body = wordLines(pen, description, 452, 5);
  const y = 262 + 41 * titles.length;
  for (const [index, line] of body.entries()) pen.fillText(line, 256, y + index * 34, 452);
  atlas.update();
}

function makeStand(B, scene, root, material, yaw, place, name, color, craft, workshop) {
  const stand = new B.TransformNode(`Shop story ${name} stand`, scene);
  stand.parent = root;
  stand.position.set(place.x, 0, place.z);
  stand.rotation.y = yaw;
  paletteMesh(B, scene, stand, material, `Shop story ${name} furniture`, shape => {
    shape.box(0, .040, 0, .48, .077, .39, CHARCOAL);
    shape.box(0, .375, 0, .39, .67, .31, '#9b6979');
    shape.box(0, .713, 0, .64, .074, .45, '#cf9b8c');
    shape.box(0, .572, .164, .268, .040, .018, color);
    for (const side of [-1, 1]) {
      shape.box(side * .284, .98, -.179, .026, .47, .029, '#986b7d');
    }
    if (workshop) {
      craft(shape, -.089, HEIGHT, -.017, color);
      shape.box(.191, HEIGHT + .015, .061, .084, .022, .239, IVORY, 0, -.16);
      shape.box(.163, HEIGHT + .035, .044, .032, .015, .176, '#9b7590', 0, .37);
    }
  });
  return stand;
}

export function createShopStoryScene(B, scene, parent, building, walkable, story) {
  const craft = CRAFTS[building.type];
  if (!craft || !parent || typeof walkable !== 'function' || story?.id !== building.id) {
    throw new Error('Dükkân hikâyesinin mekân verisi eksik');
  }
  const layout = planRoom(walkable, building);
  const fixtures = Object.values(layout);
  const root = new B.TransformNode(`Shop story ${building.id}`, scene);
  root.parent = parent;
  const materials = [];
  const accent = PALETTES[building.variant % PALETTES.length];
  const ordinal = Number(building.id.slice(-3));
  let atlas, host, artifact;
  let disposed = false;
  let stage = 'intro', ending = null, language = 'ru', exhibit;
  let talking = false;
  let clock = 0, hostYaw = layout.host.yaw;
  const markers = new Map();

  function dispose() {
    if (disposed) return;
    disposed = true;
    host?.dispose();
    root.dispose();
    atlas?.dispose();
    for (const material of materials) material.dispose();
  }

  try {
    const enamel = surface(B, scene, 'Shop story objects');
    const ink = surface(B, scene, 'Shop story print');
    ink.diffuseColor.set(0, 0, 0);
    ink.emissiveColor.set(0, 0, 0);
    ink.disableLighting = true;
    ink.backFaceCulling = false;
    materials.push(enamel, ink);
    atlas = new B.DynamicTexture(`Shop story printed signs ${building.id}`, ATLAS_SIZE, scene, false);
    const anchor = new B.TransformNode('Shop story host anchor', scene);
    anchor.parent = root;
    anchor.position.set(layout.host.object.x, 0, layout.host.object.z);
    anchor.rotation.y = hostYaw;
    host = createSumiGuest(B, scene, anchor, `sumi-guest-${ordinal + 23}`);
    host.mesh.name = `Shop story host ${building.id}`;
    host.mesh.metadata = { role: 'shop-story-host', buildingId: building.id, name: story.host.ru };
    const hostLabel = labelsFor(B, scene, anchor, ink, atlas, {x: 0, z: .025}, 'host', 1.75, 1.04, .22);

    const work = makeStand(B, scene, root, enamel, layout.work.yaw, layout.work.object, 'work', accent, craft, true);
    const workLabel = labelsFor(B, scene, work, ink, atlas, {x: 0, z: .095}, 'work', 1.16, .78, .18);
    const display = makeStand(B, scene, root, enamel, layout.display.yaw, layout.display.object, 'display', accent, craft, false);
    const displayLabel = labelsFor(B, scene, display, ink, atlas, {x: 0, z: .105}, 'display', 1.42, .91, .57);

    for (const kind of GROUPS) {
      const point = layout[kind].station;
      const glow = surface(B, scene, `Shop story ${kind} station light`, accent);
      glow.diffuseColor.scaleInPlace(.27);
      glow.disableLighting = true;
      materials.push(glow);
      const marker = B.MeshBuilder.CreateTorus(`Shop story station ${kind}`, {diameter: .54, thickness: .035, tessellation: 20}, scene);
      marker.position.set(point.x, .023, point.z);
      marker.material = glow;
      marker.parent = root;
      marker.isPickable = false;
      marker.metadata = {role: 'shop-story-station', station: kind};
      markers.set(kind, marker);
    }

    function showArtifacts(next) {
      if (next === exhibit) return;
      exhibit = next;
      artifact?.dispose();
      artifact = null;
      if (next === 'empty') return;
      artifact = paletteMesh(B, scene, display, enamel, `Shop story exhibit ${next}`, shape => {
        const first = next === 'choice-0';
        const second = next === 'choice-1';
        const color = first ? '#e2af79' : second ? '#ab8dc6' : accent;
        shape.box(0, HEIGHT + .011, 0, .51, .021, .31, first ? '#825867' : '#765d77');
        if (second) {
          craft(shape, -.122, HEIGHT + .025, -.010, accent);
          craft(shape, .123, HEIGHT + .025, .007, color);
        } else {
          if (first) shape.disk(-.027, HEIGHT + .048, 0, .39, .056, .30, '#c38b80');
          craft(shape, -.025, HEIGHT + (first ? .078 : .026), -.007, color);
          if (first) shape.box(.184, HEIGHT + .057, .048, .10, .071, .063, GOLD, -.30);
        }
      });
      artifact.metadata = {role: 'shop-story-exhibit', ending: next === 'prepared' ? null : ending};
    }

    function setProgress(next, choice = null, lang = 'ru') {
      if (disposed) return;
      if (!Object.hasOwn(STAGES, next) || (choice !== null && choice !== 0 && choice !== 1) || (lang !== 'ru' && lang !== 'tr')) {
        throw new RangeError('Dükkân hikâyesi ilerleme bilgisi geçersiz');
      }
      if (next === stage && choice === ending && lang === language && exhibit !== undefined) return;
      stage = next;
      ending = choice;
      language = lang;
      host.mesh.metadata.name = story.host[lang];
      for (const [kind, marker] of markers) marker.metadata.active = kind === STAGES[next];
      showLabels();
      showArtifacts(stage === 'done' && ending !== null ? `choice-${ending}` :
        (stage === 'display' || stage === 'decision' || stage === 'done') ? 'prepared' : 'empty');
      paintLabels(atlas, story, stage, ending, language, accent);
    }

    function showLabels() {
      hostLabel.setEnabled(stage === 'intro' || stage === 'decision');
      workLabel.setEnabled(!talking && stage === 'work');
      displayLabel.setEnabled(!talking && (stage === 'display' || stage === 'decision' || stage === 'done'));
    }

    function setTalking(open) {
      if (disposed || talking === open) return;
      talking = open;
      showLabels();
    }

    function update(dt, playerX, playerZ) {
      if (disposed || ![dt, playerX, playerZ].every(Number.isFinite) || dt < 0) return;
      const elapsed = Math.min(dt, .1);
      clock += elapsed;
      const dx = playerX - anchor.position.x, dz = playerZ - anchor.position.z;
      const near = Math.hypot(dx, dz) < 2.35;
      const desired = near ? Math.atan2(dx, dz) : layout.host.yaw;
      const diff = Math.atan2(Math.sin(desired - hostYaw), Math.cos(desired - hostYaw));
      hostYaw += diff * (1 - Math.exp(-elapsed * 9));
      anchor.rotation.y = hostYaw;
      host.pose(0, 0, clock);
      for (const [kind, marker] of markers) {
        const active = kind === STAGES[stage];
        const amount = active ? .57 + .19 * Math.sin(clock * 4.25) : .14;
        marker.material.emissiveColor.set(amount, amount * .72, amount * .51);
      }
    }

    setProgress('intro');
    update(0, SPAWN.x, SPAWN.z);
    return {
      stations: Object.freeze(Object.fromEntries(GROUPS.map(key => [key, Object.freeze(layout[key].station)]))),
      hostPosition: Object.freeze(layout.host.object),
      walkable(x, z, radius = RADIUS) {
        return walkable(x, z, radius) && fixtureClear(fixtures, x, z, radius);
      },
      setProgress, setTalking, update, dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
