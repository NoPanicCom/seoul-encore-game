import { CITY_BLOCKS, CITY_BOUNDS, CITY_BUILDINGS, CITY_ENTRY, CITY_EXIT, CITY_ROADS } from './city-grid.js';

const BLOCK_WIDTH = 24;
const BLOCK_DEPTH = 18;
const NEAR_BLOCKS = 8;
const UPDATE_DISTANCE = 3;
const ROADS_X = ['WEST WALK', 'DALBIT-GIL', 'ENCORE-RO', 'NEON-GIL', 'HAN-RO', 'EAST WALK'];
const ROADS_Z = ['SOUTH WALK', 'YEONNAM-GIL', 'MINT-RO', 'HONGIK-RO', 'BAM-GIL', 'NORTH WALK'];

const ARCHITECTURE = {
  cafe: ['674752', 'B4807F', 'FFD0A1', 'ED997D', 'awning'],
  restaurant: ['673B4D', 'BB706D', 'FFC98C', 'E77E86', 'lanterns'],
  bakery: ['865C65', 'D29886', 'FFE0AC', 'FDB690', 'awning'],
  convenience: ['485666', '739D9F', '94F0DA', '82BFB3', 'ribbon'],
  fashion: ['68496B', 'A478AD', 'FF9ADF', 'B67FAB', 'glass'],
  cosmetics: ['795467', 'BC8395', 'FFB3D2', 'E18CB1', 'flutes'],
  florist: ['426563', '82AC98', 'A4E8B5', '97CBA4', 'plants'],
  bookstore: ['62556D', '9A8196', 'F3C4A0', 'BA959C', 'brick'],
  records: ['554663', '927AA9', 'EBADFF', 'A785BA', 'discs'],
  karaoke: ['633D70', 'A879BB', 'E9A0FF', 'BF8ACB', 'lights'],
  arcade: ['464E74', '728FBD', '86DEFF', '789FCE', 'lights'],
  photobooth: ['85596D', 'C48599', 'FFD0A4', 'ECA7A4', 'lanterns'],
  cinema: ['673B58', 'A96485', 'FFC291', 'DF879A', 'marquee'],
  gallery: ['59596F', '9C9AB0', 'F4D8EE', 'ACA7BA', 'glass'],
  'dance-studio': ['555279', '918DBC', 'B4B2FF', 'A8A1D2', 'glass'],
  'music-studio': ['465974', '798EAA', '8AE7F7', '88B6C0', 'flutes'],
  electronics: ['454B72', '808AB8', '88D9FF', '8D9BCC', 'ribbon'],
  'gift-shop': ['765168', 'C389A5', 'FFC8C5', 'CF8DAE', 'awning'],
  salon: ['6C536C', 'AF86A2', 'F9BADF', 'D895B7', 'flutes'],
  hotel: ['535468', '8398AA', 'F7CFA8', 'A2A9B2', 'marquee'],
};

const paintCache = new Map();

function paint(hex) {
  if (!paintCache.has(hex)) {
    const color = [0, 2, 4].map(i => Number.parseInt(hex.slice(i, i + 2), 16) / 255);
    paintCache.set(hex, color);
  }
  return paintCache.get(hex);
}

function tint(color, strength) {
  return color.map(channel => Math.min(1, channel * strength));
}

function batch() {
  return { positions: [], normals: [], colors: [], indices: [], uvs: [] };
}

function polygon(out, points, color, uv) {
  const [a, b, c] = points;
  const u = b.map((value, i) => value - a[i]);
  const v = c.map((value, i) => value - a[i]);
  const normal = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  const length = Math.hypot(...normal);
  const base = out.positions.length / 3;
  for (const [i, point] of points.entries()) {
    out.positions.push(...point);
    out.normals.push(...normal.map(value => value / length));
    const corner = Array.isArray(color[0]) ? color[i] : color;
    out.colors.push(...corner, 1);
    if (uv) out.uvs.push(...uv[i]);
  }
  for (let i = 1; i < points.length - 1; i++) out.indices.push(base, base + i, base + i + 1);
}

function box(out, x, y, z, width, height, depth, color) {
  const w = width / 2, h = height / 2, d = depth / 2;
  const pts = [[x - w, y - h, z - d], [x + w, y - h, z - d], [x + w, y + h, z - d], [x - w, y + h, z - d],
    [x - w, y - h, z + d], [x + w, y - h, z + d], [x + w, y + h, z + d], [x - w, y + h, z + d]];
  for (const [face, light] of [
    [[3, 2, 1, 0], .90], [[4, 5, 6, 7], 1], [[7, 6, 2, 3], 1.13],
    [[0, 4, 7, 3], .83], [[1, 2, 6, 5], .94],
  ]) polygon(out, face.map(i => pts[i]), tint(color, light));
}

function ground(out, x0, x1, z0, z1, y, color) {
  polygon(out, [[x0, y, z0], [x0, y, z1], [x1, y, z1], [x1, y, z0]], color);
}

function panel(out, x, y, z, width, height, yaw, color, uv) {
  const w = width / 2, h = height / 2;
  const dx = Math.cos(yaw) * w, dz = -Math.sin(yaw) * w;
  polygon(out, [[x - dx, y - h, z - dz], [x + dx, y - h, z + dz],
    [x + dx, y + h, z + dz], [x - dx, y + h, z - dz]], color, uv);
}

function prismRoof(out, x, y, z, width, depth, rise, ridge, color) {
  const x0 = x - width / 2, x1 = x + width / 2, z0 = z - depth / 2, z1 = z + depth / 2;
  const a = [x0, y, z0], b = [x1, y, z0], c = [x0, y, z1], d = [x1, y, z1];
  const e = [x + ridge, y + rise, z0], f = [x + ridge, y + rise, z1];
  polygon(out, [a, e, b], tint(color, .87));
  polygon(out, [c, d, f], color);
  polygon(out, [a, c, f, e], tint(color, .92));
  polygon(out, [b, e, f, d], tint(color, 1.13));
}

function taperedRoof(out, x, y, z, width, depth, height, ratio, color) {
  const sides = [[-.5, -.5], [.5, -.5], [.5, .5], [-.5, .5]];
  const low = sides.map(([a, b]) => [x + a * width, y, z + b * depth]);
  const high = sides.map(([a, b]) => [x + a * width * ratio, y + height, z + b * depth * ratio]);
  for (let i = 0; i < sides.length; i++) {
    const next = (i + 1) % sides.length;
    polygon(out, [low[i], high[i], high[next], low[next]], tint(color, .89 + .09 * i));
  }
  polygon(out, [...high].reverse(), tint(color, 1.14));
}

function diamond(out, x, y, z, radius, height, shade) {
  const base = [[x - radius, y, z], [x, y, z + radius], [x + radius, y, z], [x, y, z - radius]];
  const top = [x, y + height * .60, z], bottom = [x, y - height * .40, z];
  for (let i = 0; i < 4; i++) {
    const next = (i + 1) % 4;
    polygon(out, [base[i], base[next], top], tint(shade, .87 + .10 * i));
    polygon(out, [base[next], base[i], bottom], tint(shade, .69 + .07 * i));
  }
}

function flatMaterial(B, scene, name, unlit = false) {
  const material = new B.StandardMaterial(name, scene);
  material.diffuseColor = B.Color3.White();
  material.specularColor = new B.Color3(.055, .05, .064);
  material.sideOrientation = B.Material.CounterClockWiseSideOrientation;
  if (unlit) {
    material.disableLighting = true;
    material.emissiveColor = B.Color3.White();
  }
  return material;
}

function meshFor(B, scene, anchor, name, data, material) {
  const mesh = new B.Mesh(name, scene);
  const vertices = new B.VertexData();
  vertices.positions = data.positions;
  vertices.indices = data.indices;
  vertices.normals = data.normals;
  vertices.colors = data.colors;
  if (data.uvs.length) vertices.uvs = data.uvs;
  vertices.applyToMesh(mesh);
  mesh.parent = anchor;
  mesh.material = material;
  mesh.isPickable = false;
  return mesh;
}

function signs(B, scene) {
  const labels = [
    ...CITY_BUILDINGS.map(building => ({ id: building.id, title: building.name, accent: ARCHITECTURE[building.type][2] })),
    ...ROADS_X.map((title, i) => ({ id: `x${i}`, title, accent: '9DE3DE' })),
    ...ROADS_Z.map((title, i) => ({ id: `z${i}`, title, accent: '9DE3DE' })),
    { id: 'entry', title: 'SEOUL AFTER DARK', accent: 'F1C3E8' },
    { id: 'exit', title: 'HONGDAE', accent: 'FFCC9E' },
  ];
  const width = 2048, height = 1024, columns = 10, cw = 204, ch = 45;
  const texture = new B.DynamicTexture('Seoul street and shop sign atlas', { width, height }, scene, false,
    B.Texture.BILINEAR_SAMPLINGMODE);
  texture.wrapU = texture.wrapV = B.Texture.CLAMP_ADDRESSMODE;
  const context = texture.getContext();
  const uvs = new Map();
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  for (const [index, { id, title, accent }] of labels.entries()) {
    const x = (index % columns) * cw, y = Math.floor(index / columns) * ch;
    context.fillStyle = '#30243e';
    context.fillRect(x, y, cw, ch);
    context.strokeStyle = `#${accent}`;
    context.lineWidth = 2.5;
    context.strokeRect(x + 4, y + 4, cw - 8, ch - 8);
    context.fillStyle = `#${accent}`;
    context.font = '700 22px system-ui, sans-serif';
    context.fillText(title.toUpperCase(), x + cw / 2, y + ch / 2 + 1, cw - 21);
    const u0 = (x + 1) / width, u1 = (x + cw - 1) / width;
    const v0 = 1 - (y + ch - 1) / height, v1 = 1 - (y + 1) / height;
    uvs.set(id, [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]);
  }
  texture.update();
  const material = flatMaterial(B, scene, 'Seoul luminous typography', true);
  material.emissiveColor = B.Color3.Black();
  material.emissiveTexture = texture;
  return { material, texture, uvs };
}

function roof(building, out, detail, body, trim, accent) {
  const { x, z, width: w, depth: d, height: h, type } = building;
  const cap = (dx, height, width, depth, y = h, color = trim) =>
    box(out, x + dx, y + height / 2, z, width, height, depth, color);
  const gable = (height, rank, y = h, width = w, depth = d) => prismRoof(out, x, y, z, width, depth, height, rank, trim);
  const slope = (height, ratio, y = h, width = w, depth = d) =>
    taperedRoof(out, x, y, z, width, depth, height, ratio, trim);
  switch (type) {
    case 'cafe': cap(0, .12, w + .20, d + .14); gable(.58, 1.26, h + .13, w + .24, d + .16); break;
    case 'restaurant':
      cap(0, .16, w + .34, d + .30); slope(.65, .68, h + .16, w + .39, d + .35);
      cap(0, .13, w * .76, d * .76, h + .79); slope(.51, .45, h + .92, w * .76, d * .76); break;
    case 'bakery': gable(1.07, 0, h, w + .21, d + .22); cap(-1.23, .79, .35, .39, h + .54, body); break;
    case 'convenience':
      cap(0, .26, w + .14, d + .18); cap(0, .38, w * .76, d * .68, h + .23, body);
      cap(0, .18, w * .54, d * .46, h + .61); break;
    case 'fashion': cap(-1.15, 1.22, w * .48, d * .79); cap(.98, .55, w * .37, d, h, body); break;
    case 'cosmetics':
      for (let i = -2; i <= 2; i++) cap(i * .59, .37 + (2 - Math.abs(i)) * .27, .51, d * .88);
      break;
    case 'florist':
      gable(.71, 0, h + .26, w * .84, d * .71); cap(0, .26, w * .84, d * .71, h, body);
      for (const dx of [-1.88, 1.88]) cap(dx, .21, .49, d * .89, h, paint('6C9B7D'));
      break;
    case 'bookstore': cap(0, .18, w + .12, d + .14); gable(.98, 0, h + .18, w * .61, d * .93); break;
    case 'records':
      cap(0, .31, w * .95, d * .92); cap(.28, .30, w * .73, d * .72, h + .31, body);
      cap(.5, .39, w * .52, d * .50, h + .61); break;
    case 'karaoke':
      cap(0, .22, w + .18, d + .16); slope(.56, .71, h + .22, w * .90, d * .92);
      box(detail, x, h + .73, z + building.door.nz * d * .32, w * .59, .05, .042, accent); break;
    case 'arcade': gable(.77, -1.17, h, w + .12, d + .14); cap(1.43, .96, .31, d * .42, h, accent); break;
    case 'photobooth':
      cap(0, .17, w + .22, d + .18); slope(.31, .84, h + .17, w + .12, d + .16);
      slope(.56, .53, h + .48, w * .86, d * .84); break;
    case 'cinema': cap(0, .35, w + .23, d + .27); cap(0, .89, w * .66, d * .55, h + .35); break;
    case 'gallery':
      for (const dx of [-1.22, 1.22]) prismRoof(out, x + dx, h, z, w * .49, d + .11, .77, .62, trim);
      break;
    case 'dance-studio': slope(.84, .83); cap(0, .14, w * .90, d * .89, h + .84, body); break;
    case 'music-studio': cap(-1.25, 1.02, 1.25, d * .89); cap(1.25, 1.02, 1.25, d * .89); cap(0, .31, 1.44, d * .47); break;
    case 'electronics':
      for (let i = -2; i <= 2; i++) cap(i * .85, .59, .23, d * (.63 - .06 * Math.abs(i)), h, trim);
      cap(0, .13, w + .11, d + .15); break;
    case 'gift-shop': gable(.83, -.41, h, w + .14, d + .15); cap(1.49, .79, .51, .44, h + .22, body); break;
    case 'salon':
      for (const dx of [-1.67, 1.67]) cap(dx, .81, .105, d * .80);
      cap(0, .12, w * .83, d * .82, h + .78); cap(0, .32, w * .68, d * .54, h, body); break;
    case 'hotel':
      cap(0, .62, w * .82, d * .74); cap(0, .51, w * .57, d * .53, h + .62);
      slope(.73, .08, h + 1.13, w * .55, d * .49); break;
  }
}

function architecture(building, solid, detail, labels, uvs) {
  const { x, z, width: w, depth: d, height: h, door, variant, type, lot } = building;
  const [bodyHex, trimHex, accentHex, glassHex, style] = ARCHITECTURE[type];
  const body = tint(paint(bodyHex), .92 + variant * .021);
  const trim = paint(trimHex), accent = paint(accentHex), glass = paint(glassHex);
  const ink = paint('342A43');
  const face = (out, u, y, width, height, color, extension = .021, uv) =>
    panel(out, x + u * door.nz, y, door.z + door.nz * extension, width, height, door.yaw, color, uv);
  const beam = (u, y, width, height, depth, color, extension) =>
    box(solid, x + u * door.nz, y, door.z + door.nz * extension, width, height, depth, color);
  box(solid, x, h / 2, z, w, h, d, body);
  box(solid, x, .12, z, w + .07, .24, d + .07, tint(body, .70));
  box(solid, x, h - .16, z, w + .15, .16, d + .15, trim);
  roof(building, solid, detail, body, trim, accent);

  const frontRows = h >= 6.15 ? 3 : 2;
  const centerCount = style === 'glass' || style === 'flutes' ? 3 : 4;
  for (let row = 0; row < frontRows; row++) {
    const y = 3.41 + row * (h - 3.65) / frontRows;
    for (let col = 0; col < centerCount; col++) {
      const uu = (col - (centerCount - 1) / 2) * (w - .83) / centerCount;
      const ww = (w - .91) / centerCount - (style === 'glass' ? .10 : .25);
      const hh = style === 'flutes' ? .69 : .50;
      face(solid, uu, y, ww + .105, hh + .10, ink, .024);
      const emitting = (variant + row * 3 + col * 2) % 7 < 5;
      const shade = tint(glass, .57 + ((variant + col * 3 + row) % 5) * .115);
      face(emitting ? detail : solid, uu, y, ww, hh, emitting ? shade : tint(body, .88), .029);
      face(solid, uu, y, .034, hh, trim, .034);
    }
    if (style === 'ribbon' || style === 'brick') face(solid, 0, y - .36, w - .27, .044, trim, .023);
  }

  for (const side of [-1, 1]) {
    const wallX = x + side * (w / 2 + .017);
    for (const offset of [-.27, .24]) {
      const zz = z + d * offset;
      const y = 3.22 + (variant % 3) * .18;
      panel(solid, wallX, y, zz, .91, .87, side * Math.PI / 2, ink);
      panel(detail, wallX + side * .008, y, zz, .78, .71, side * Math.PI / 2, tint(glass, side < 0 ? .61 : .76));
      panel(solid, wallX + side * .012, y, zz, .042, .71, side * Math.PI / 2, trim);
    }
    const corner = (lot % 4 === 0 && side < 0) || (lot % 4 === 3 && side > 0);
    if (corner) {
      const signZ = door.z - door.nz * 1.14;
      box(solid, wallX + side * .12, 2.87, signZ, .25, .62, 2.30, ink);
      panel(labels, wallX + side * .254, 2.87, signZ, 2.19, .54, side * Math.PI / 2,
        [1, 1, 1], uvs.get(building.id));
      panel(detail, wallX + side * .252, 2.542, signZ, 2.12, .042, side * Math.PI / 2, accent);
      panel(detail, wallX + side * .021, 1.94, door.z - door.nz * .36, .036, 1.78, side * Math.PI / 2, accent);
    }
  }

  // The sign, glazing and door share a visible frame on the authoritative street-facing side.
  const doorHalf = door.width / 2;
  for (const side of [-1, 1]) {
    const u = side * (doorHalf + .057);
    beam(u, 1.03, .111, 2.02, .123, trim, .042);
    face(detail, u, 1.05, .038, 1.91, accent, .110);
    const windowX = side * (doorHalf + .87);
    face(solid, windowX, 1.12, 1.02, 1.62, trim, .032);
    face(detail, windowX, 1.13, .883, 1.49,
      [tint(glass, .42), tint(glass, .42), tint(glass, .78), tint(glass, .78)], .039);
    face(solid, windowX, .79, .885, .055, ink, .044);
    face(solid, windowX + side * .16, 1.18, .032, 1.36, ink, .045);
    if (style === 'plants') {
      for (let i = 0; i < 3; i++) {
        const u = windowX + (i - 1) * .247;
        face(solid, u, .68, .16, .28 + i * .034, paint('4D7E6E'), .050);
      }
    } else if (style === 'discs') {
      const center = x + windowX * door.nz;
      diamond(detail, center, 1.31, door.z + .054 * door.nz, .20, .43, accent);
    } else if (style === 'lights' || style === 'ribbon') {
      for (let i = 0; i < 3; i++) {
        const hh = .14 + ((i + variant) % 3) * .13;
        face(detail, windowX + (i - 1) * .14, 1.19 + hh / 2, .084, hh, tint(accent, .79), .053);
      }
    } else if (style === 'glass' || style === 'marquee') {
      face(solid, windowX, 1.34, .41, .58, tint(body, .70), .052);
      face(detail, windowX, 1.34, .33, .48, tint(accent, .59), .058);
    }
  }
  beam(0, 2.047, door.width + .22, .115, .145, trim, .041);
  face(detail, 0, 2.078, door.width - .035, .036, accent, .119);
  face(solid, 0, 1.01, door.width, 2.0, ink, .049);
  face(detail, 0, 1.22, door.width - .19, 1.26,
    [tint(glass, .25), tint(glass, .25), tint(glass, .61), tint(glass, .61)], .054);
  face(solid, 0, .37, door.width - .12, .66, tint(body, .69), .057);
  face(solid, .18, .98, .087, .20, trim, .061);
  face(detail, .18, .98, .025, .129, accent, .064);
  beam(0, 2.54, w - .44, .64, .17, ink, .097);
  face(labels, 0, 2.54, w - 1.14, .55, [1, 1, 1], .185, uvs.get(building.id));

  if (style === 'awning' || style === 'marquee') {
    beam(0, 2.20, w - .30, .105, style === 'awning' ? .50 : .62, trim, .25);
    for (let i = 0; i < 7; i++) {
      const u = (i - 3) * .63;
      face(detail, u, 2.17, style === 'awning' ? .26 : .11, .037, accent, style === 'awning' ? .507 : .568);
    }
  } else if (style === 'lanterns' || style === 'lights') {
    for (const u of [-1.93, 1.93]) {
      const zz = door.z + door.nz * .16;
      diamond(detail, x + u, 2.15, zz, .105, .23, accent);
    }
  } else if (style === 'flutes' || style === 'ribbon') {
    for (const u of [-2.11, 2.11]) {
      face(detail, u, (h + 2.93) / 2, .041, h - 3.19, accent, .032);
    }
  }
  const gx = door.x, gz = door.z;
  const z0 = Math.min(gz, gz + door.nz * .79), z1 = Math.max(gz, gz + door.nz * .79);
  const edge = tint(paint('625571'), .92), glow = tint(glass, .58);
  const [low, high] = door.nz > 0 ? [glow, edge] : [edge, glow];
  ground(detail, gx - doorHalf - .07, gx + doorHalf + .07, z0 + .01, z1 - .01, .010, [low, high, high, low]);
}

function tree(out, x, z, variant) {
  const planter = paint('63516D');
  box(out, x, .10, z, .74, .20, .75, planter);
  box(out, x, .62, z, .095, 1.10, .093, paint('80626B'));
  const leaves = paint(variant ? '608477' : '557D7F');
  diamond(out, x, 1.55, z, .49, 1.26, leaves);
  diamond(out, x + .27, 1.38, z - .15, .38, .99, tint(leaves, 1.13));
  diamond(out, x - .24, 1.67, z + .10, .33, .90, tint(leaves, .87));
}

function pavement(block, solid, detail) {
  const { x, z, row, column } = block;
  const w = BLOCK_WIDTH / 2, d = BLOCK_DEPTH / 2;
  const stone = paint('50495F');
  ground(solid, x - w, x + w, z - d, z + d, .001, stone);
  ground(solid, x - w + .21, x + w - .21, z - .95, z + .95, .005, paint('5D5267'));
  for (const side of [-1, 1]) {
    const zz = z + side * (d - .07), xx = x + side * (w - .07);
    ground(solid, x - w, x + w, zz - .07, zz + .07, .008, paint('796E7F'));
    ground(solid, xx - .07, xx + .07, z - d, z + d, .007, paint('796E7F'));
    for (let i = 0; i < 18; i++) {
      const p = x - w + .19 + i * 1.319;
      ground(solid, p, p + 1.291, zz - .42, zz + .42, .004,
        tint(stone, .95 + ((row + i * 2 + column) % 5) * .06));
    }
    tree(solid, x + side * 11.45, z, (row + column) % 2);
    for (const j of [-1, 1]) {
      const lampX = x + side * 11.76, lampZ = z + j * 8.74;
      box(solid, lampX, 1.235, lampZ, .076, 2.45, .076, paint('62566E'));
      box(solid, lampX, 2.45, lampZ + j * .15, .097, .081, .36, paint('72637A'));
      box(detail, lampX, 2.391, lampZ + j * .252, .146, .057, .158, paint('FFDAA5'));
    }
  }
}

function roadbed(out) {
  const { minX, maxX, minZ, maxZ } = CITY_BOUNDS;
  ground(out, minX - 4, maxX + 4, minZ - 4, maxZ + 4, -.008, paint('3C364C'));
  const crossingsX = CITY_ROADS.vertical.filter(road => road.width > 4);
  const crossingsZ = CITY_ROADS.horizontal.filter(road => road.width > 4);
  for (const road of CITY_ROADS.vertical) {
    const { center, width, main } = road;
    const half = width / 2;
    ground(out, center - half + .03, center + half - .03, minZ, maxZ, -.005, paint(main ? '474056' : '403B50'));
    for (const side of [-1, 1]) {
      const x = center + side * (half - .31);
      ground(out, x - .023, x + .023, minZ + .21, maxZ - .21, .003, paint('6E6179'));
    }
    for (let z = minZ + 2; z < maxZ - 1; z += 3.3) {
      if (crossingsZ.some(cross => Math.abs(z - cross.center) < cross.width / 2 + 1.35)) continue;
      ground(out, center - .04, center + .04, z, z + 1, .004, paint(main ? 'AF8C79' : '7F7083'));
    }
  }
  for (const road of CITY_ROADS.horizontal) {
    const { center, width, main } = road;
    const half = width / 2;
    ground(out, minX, maxX, center - half + .03, center + half - .03, -.004, paint(main ? '474056' : '403B50'));
    for (const side of [-1, 1]) {
      const z = center + side * (half - .31);
      for (const [i, vertical] of CITY_ROADS.vertical.entries()) {
        if (i === 0) continue;
        const prev = CITY_ROADS.vertical[i - 1];
        ground(out, prev.center + prev.width / 2 + .25, vertical.center - vertical.width / 2 - .25,
          z - .023, z + .023, .003, paint('6E6179'));
      }
    }
    for (let x = minX + 2; x < maxX - 1; x += 3.3) {
      if (crossingsX.some(cross => Math.abs(x - cross.center) < cross.width / 2 + 1.35)) continue;
      ground(out, x, x + 1, center - .04, center + .04, .005, paint(main ? 'AF8C79' : '7F7083'));
    }
  }
  const zebra = paint('978C9C');
  for (const vertical of crossingsX) {
    for (const horizontal of crossingsZ) {
      for (const side of [-1, 1]) {
        const x = vertical.center + side * (vertical.width / 2 + .55);
        const z = horizontal.center + side * (horizontal.width / 2 + .55);
        for (let i = -4; i <= 4; i++) {
          const zz = horizontal.center + i * .70, xx = vertical.center + i * .70;
          ground(out, x - .46, x + .46, zz - .16, zz + .16, .007, zebra);
          ground(out, xx - .16, xx + .16, z - .46, z + .46, .007, zebra);
        }
      }
    }
  }
}

function wayfinding(out, labels, uvs) {
  const frame = paint('62566F'), white = [1, 1, 1];
  for (const [i, a] of CITY_ROADS.vertical.entries()) {
    if (a.width <= 4) continue;
    for (const [j, b] of CITY_ROADS.horizontal.entries()) {
      if (b.width <= 4) continue;
      const x = a.center + a.width / 2 + .15, z = b.center + b.width / 2 + .15;
      box(out, x, 1.055, z, .078, 2.11, .078, frame);
      box(out, x + .44, 2.13, z, .96, .224, .078, frame);
      box(out, x, 1.87, z + .44, .078, .224, .96, frame);
      for (const sign of [-1, 1]) {
        panel(labels, x + .44, 2.13, z + sign * .043, .91, .204,
          sign > 0 ? 0 : Math.PI, white, uvs.get(`x${i}`));
        panel(labels, x + sign * .043, 1.87, z + .44, .91, .204,
          sign * Math.PI / 2, white, uvs.get(`z${j}`));
      }
    }
  }
  for (const x of [CITY_ENTRY.x - 3.81, CITY_ENTRY.x + 3.81]) {
    box(out, x, 1.71, CITY_ENTRY.z - 3.48, .14, 3.42, .14, frame);
  }
  box(out, CITY_ENTRY.x, 3.35, CITY_ENTRY.z - 3.48, 7.74, .18, .16, frame);
  box(out, CITY_ENTRY.x, 3.15, CITY_ENTRY.z - 3.38, 3.49, .63, .17, paint('61476B'));
  panel(labels, CITY_ENTRY.x, 3.15, CITY_ENTRY.z - 3.28, 3.42, .57, 0, white, uvs.get('entry'));
  const exitSide = CITY_EXIT.x - 3.43;
  box(out, exitSide, 1.15, CITY_EXIT.z, .083, 2.07, .078, frame);
  box(out, exitSide, 1.71, CITY_EXIT.z, .96, .43, .078, frame);
  panel(labels, exitSide, 1.71, CITY_EXIT.z - .042, .91, .39, Math.PI, white, uvs.get('exit'));
  for (let i = -3; i <= 3; i++) {
    const x = CITY_EXIT.x + i * .425;
    ground(out, x - .159, x + .159, CITY_EXIT.z - .14, CITY_EXIT.z + .14, .010, paint('9D799D'));
  }
}

function farArchitecture(out) {
  for (const building of CITY_BUILDINGS) {
    const { x, z, width, depth, height, type } = building;
    const color = tint(paint(ARCHITECTURE[type][0]), .72);
    box(out, x, height * .276, z, width * .93, height * .552, depth * .93, color);
  }
  for (const side of [-1, 1]) {
    for (let i = 0; i < 15; i++) {
      const x = (i - 7) * 11.05 + Math.sin(i * 4.1) * 3.9;
      const z = side * (79 + Math.cos(i * 2.73) * 5.5);
      const h = 6.7 + (i * 13 % 9) * .94;
      const color = paint(['3F4058', '44455F', '484461', '3D4359'][i % 4]);
      box(out, x, h / 2, z, 5.7 + (i % 3) * 1.51, h, 6.5, color);
      box(out, x + .45, h + .41, z, 3.84, .82, 3.84, tint(color, 1.05));
    }
  }
}

export function createCityscape(B, scene, anchor) {
  if (!anchor) throw new Error('Seul dış çevresi için yerel sahne kökü eksik');
  const solid = flatMaterial(B, scene, 'Seoul masonry and sidewalks');
  const detail = flatMaterial(B, scene, 'Seoul luminous fixtures', true);
  const atlas = signs(B, scene);
  const terrain = batch(), roadSigns = batch(), far = batch();
  roadbed(terrain);
  wayfinding(terrain, roadSigns, atlas.uvs);
  farArchitecture(far);
  const permanent = [
    meshFor(B, scene, anchor, 'City road network', terrain, solid),
    meshFor(B, scene, anchor, 'City wayfinding', roadSigns, atlas.material),
    meshFor(B, scene, anchor, 'City background skyline', far, solid),
  ];
  const chunks = new Map();
  let active = new Set();
  let lastX = Infinity, lastZ = Infinity;
  let disposed = false;

  function show(block) {
    let meshes = chunks.get(block.id);
    if (!meshes) {
      const faces = batch(), lights = batch(), boards = batch();
      pavement(block, faces, lights);
      for (const building of block.buildings) architecture(building, faces, lights, boards, atlas.uvs);
      meshes = [meshFor(B, scene, anchor, `City ${block.id} buildings`, faces, solid),
        meshFor(B, scene, anchor, `City ${block.id} lights`, lights, detail),
        meshFor(B, scene, anchor, `City ${block.id} signs`, boards, atlas.material)];
      chunks.set(block.id, meshes);
    }
    for (const mesh of meshes) mesh.setEnabled(true);
  }

  function update(x, z) {
    if (disposed || !Number.isFinite(x) || !Number.isFinite(z)) return;
    if (Math.hypot(x - lastX, z - lastZ) < UPDATE_DISTANCE) return;
    lastX = x;
    lastZ = z;
    const rank = block => ((x - block.x) / 32) ** 2 + ((z - block.z) / 26) ** 2;
    const nearest = [...CITY_BLOCKS].sort((a, b) => rank(a) - rank(b)).slice(0, NEAR_BLOCKS);
    const next = new Set(nearest.map(block => block.id));
    for (const id of active) {
      if (!next.has(id)) for (const mesh of chunks.get(id)) mesh.setEnabled(false);
    }
    for (const block of nearest) if (!active.has(block.id)) show(block);
    active = next;
  }

  update(CITY_ENTRY.x, CITY_ENTRY.z);
  return {
    update,
    dispose() {
      if (disposed) return;
      disposed = true;
      for (const mesh of permanent) mesh.dispose();
      for (const meshes of chunks.values()) for (const mesh of meshes) mesh.dispose();
      chunks.clear();
      solid.dispose();
      detail.dispose();
      atlas.material.dispose();
      atlas.texture.dispose();
    },
  };
}
