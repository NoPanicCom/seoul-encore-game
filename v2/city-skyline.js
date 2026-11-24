import { CITY_BOUNDS, CITY_ENTRY } from './city-grid.js';

const TAU = 2 * Math.PI;
const LANDMARK = Object.freeze({
  x: CITY_ENTRY.x - .5,
  z: CITY_BOUNDS.minZ - 30,
  name: Object.freeze({ ru: 'Лазурная башня Сеула', tr: 'Seul Gök Kulesi' }),
});
const WEST = CITY_BOUNDS.minX - 62;
const EAST = CITY_BOUNDS.maxX + 62;
const NORTH = CITY_BOUNDS.maxZ + 60;
const SOUTH = CITY_BOUNDS.minZ - 78;
const HORIZON = 560;
const ROAD_END = CITY_BOUNDS.minZ - 4;
const SHORE_Y = -.05;
const RIVER_Y = -.46;

const paints = new Map();
function rgb(hex) {
  if (!paints.has(hex)) paints.set(hex, [0, 2, 4].map(i => Number.parseInt(hex.slice(i, i + 2), 16) / 255));
  return paints.get(hex);
}

function mix(a, b, t) {
  return a.map((v, i) => v + (b[i] - v) * t);
}

function shade(color, amount) {
  return color.map(channel => Math.min(1, channel * amount));
}

function unit(value) {
  return Math.max(0, Math.min(1, value));
}

function dissolveHorizon(data) {
  for (let i = 0, alpha = 3; i < data.positions.length; i += 3, alpha += 4) {
    const distance = Math.max(Math.abs(data.positions[i]), Math.abs(data.positions[i + 2]));
    const t = unit((distance - 274) / (HORIZON - 274));
    data.colors[alpha] = 1 - t * t * (3 - 2 * t);
  }
}

function batch() {
  return { positions: [], normals: [], indices: [], colors: [] };
}

function polygon(out, vertices, paint) {
  const [a, b, c] = vertices;
  const [u, v, w] = b.map((n, i) => n - a[i]);
  const [x, y, z] = c.map((n, i) => n - a[i]);
  const n = [v * z - w * y, w * x - u * z, u * y - v * x];
  const length = Math.hypot(...n);
  if (!length) return;
  const normal = n.map(v => v / length);
  const start = out.positions.length / 3;
  for (const [i, point] of vertices.entries()) {
    out.positions.push(...point);
    out.normals.push(...normal);
    out.colors.push(...(Array.isArray(paint[0]) ? paint[i] : paint), 1);
  }
  for (let i = 1; i < vertices.length - 1; i++) out.indices.push(start, start + i, start + i + 1);
}

function prism(out, x, y, z, w, h, d, paint) {
  const a = x - w / 2, b = x + w / 2, c = y, e = y + h, f = z - d / 2, g = z + d / 2;
  polygon(out, [[a,c,g],[b,c,g],[b,e,g],[a,e,g]], paint);
  polygon(out, [[b,c,f],[a,c,f],[a,e,f],[b,e,f]], shade(paint, .90));
  polygon(out, [[a,c,f],[a,c,g],[a,e,g],[a,e,f]], shade(paint, .95));
  polygon(out, [[b,c,g],[b,c,f],[b,e,f],[b,e,g]], shade(paint, .84));
  polygon(out, [[a,e,f],[a,e,g],[b,e,g],[b,e,f]], shade(paint, 1.16));
}

function ribbon(out, a, b, width, paint) {
  const dx = b[0] - a[0], dz = b[2] - a[2];
  const horizontal = Math.hypot(dx, dz);
  if (!horizontal) return;
  const x = dz / horizontal * width / 2, z = -dx / horizontal * width / 2;
  polygon(out, [[a[0] - x,a[1],a[2] - z], [b[0] - x,b[1],b[2] - z],
    [b[0] + x,b[1],b[2] + z], [a[0] + x,a[1],a[2] + z]], paint);
}

function chord(out, start, end, width, paint) {
  const [dx, dy, dz] = end.map((v, i) => v - start[i]);
  const h = Math.hypot(dx, dz);
  const l = Math.hypot(h, dy);
  const vx = h > .001 ? dz / h : 1;
  const vz = h > .001 ? -dx / h : 0;
  const up = [-dy * vz / l, (dz * vx - dx * vz) / l, dy * vx / l];
  const points = [start, end].flatMap(p => [[-1,-1], [1,-1], [1,1], [-1,1]].map(([u, v]) => [
    p[0] + (u * vx + v * up[0]) * width / 2,
    p[1] + v * up[1] * width / 2,
    p[2] + (u * vz + v * up[2]) * width / 2,
  ]));
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    polygon(out, [points[i], points[j], points[j + 4], points[i + 4]], shade(paint, .86 + i * .086));
  }
}

function shoreline(x) {
  const center = -81.5 + Math.sin(x / 28) * 2.9 + Math.sin((x + 19) / 13) * 1.1;
  const half = 7.3 + Math.cos((x + 9) / 38) * 1.16;
  return { north: Math.min(ROAD_END - .65, center + half), south: center - half };
}

function strip(out, columns, paint, alternating = 0) {
  for (let i = 0; i < columns.length - 1; i++) {
    const [nearA, farA] = columns[i];
    const [nearB, farB] = columns[i + 1];
    polygon(out, [nearA, farA, farB, nearB], shade(paint, 1 + alternating * (i % 5 - 2) / 2));
  }
}

function landGrid(out, x0, x1, z0, z1, nx, nz, height, paint) {
  const rows = Array.from({length: nz + 1}, (_, j) => {
    const z = z0 + (z1 - z0) * j / nz;
    return Array.from({length: nx + 1}, (_, i) => {
      const x = x0 + (x1 - x0) * i / nx;
      return [x, height(x, z), z];
    });
  });
  for (let j = 0; j < nz; j++) {
    for (let i = 0; i < nx; i++) {
      const a = rows[j][i], b = rows[j + 1][i], c = rows[j + 1][i + 1], d = rows[j][i + 1];
      const p = paint(i, j, (a[1] + b[1] + c[1] + d[1]) / 4);
      polygon(out, [a, b, d], p);
      polygon(out, [b, c, d], shade(p, .984));
    }
  }
}

function hill(x, z, xx, zz, w, d, height) {
  return Math.max(0, 1 - ((x - xx) / w) ** 2 - ((z - zz) / d) ** 2) ** 2 * height;
}

function hillColor(i, j, height) {
  const tint = .42 + .16 * Math.sin(i * .52 + j * .34) + .10 * Math.cos(j * .71 - i * .21);
  const base = mix(rgb('6c8c79'), rgb('7b9a85'), tint);
  return mix(base, rgb('6f8296'), unit(height / 36));
}

const westHill = (x, z) => SHORE_Y + hill(x,z,-115,-7,30,66,13) + hill(x,z,-131,46,33,37,11);
const eastHill = (x, z) => SHORE_Y + hill(x,z,116,-39,31,56,13) + hill(x,z,131,40,34,53,15);
const nearHills = (x, z) => SHORE_Y + hill(x,z,-75,108,63,42,23) + hill(x,z,63,122,70,55,27);
const farHills = (x, z) => SHORE_Y + hill(x,z,-101,-124,61,29,24) + hill(x,z,89,-131,68,39,30);

function riverbank(land, water, columns) {
  strip(land, columns.map(x => [[x,SHORE_Y,shoreline(x).north],[x,SHORE_Y,ROAD_END]]), rgb('769582'), .035);
  strip(land, columns.map(x => [[x,SHORE_Y,-98],[x,SHORE_Y,shoreline(x).south]]), rgb('658675'), .035);
  strip(land, columns.map(x => [[x,RIVER_Y,shoreline(x).north - .16],[x,SHORE_Y,shoreline(x).north + .56]]), rgb('b1a894'), .05);
  strip(land, columns.map(x => [[x,SHORE_Y,shoreline(x).south - .58],[x,RIVER_Y,shoreline(x).south + .17]]), rgb('b0a58e'), .05);
  strip(water, columns.map(x => [[x,RIVER_Y,shoreline(x).south],[x,RIVER_Y,shoreline(x).north]]), rgb('4c8caa'), .055);
}

function outskirts(land, water) {
  const ridge = (x, z) => SHORE_Y + hill(x,z,-224,161,142,152,39) + hill(x,z,189,186,148,157,49) +
    hill(x,z,-175,-213,119,109,41) + hill(x,z,204,-195,145,105,43) + hill(x,z,22,-306,155,140,58);
  const border = CITY_BOUNDS.maxZ + 4;
  const farDepthSteps = 9;
  for (const [x0, x1, edge, sideHill] of [[-HORIZON,WEST,WEST,westHill], [EAST,HORIZON,EAST,eastHill]]) {
    const apron = height => (x, z) => {
      const taper = unit(Math.abs(x - edge) / 50);
      return (1 - taper) * height(edge,z) + taper * ridge(x,z);
    };
    const columns = Array.from({length: 24}, (_, i) => x0 + (x1 - x0) * i / 23);
    riverbank(land, water, columns);
    landGrid(land, x0, x1, ROAD_END, border, 8, 23, apron(sideHill), hillColor);
    landGrid(land, x0, x1, border, NORTH, 8, 12, apron(nearHills), hillColor);
    landGrid(land, x0, x1, SOUTH, -98, 8, 12, apron(farHills), hillColor);
    for (const [z0, z1, rim, height] of [[NORTH,HORIZON,NORTH,nearHills], [-HORIZON,SOUTH,SOUTH,farHills]]) {
      const rimHeight = apron(height);
      landGrid(land, x0, x1, z0, z1, 8, farDepthSteps, (x, z) => {
        const taper = unit(Math.abs(z - rim) / 55);
        return (1 - taper) * rimHeight(x,rim) + taper * ridge(x,z);
      }, hillColor);
    }
  }
  for (const [z0, z1, rim, height] of [[NORTH,HORIZON,NORTH,nearHills], [-HORIZON,SOUTH,SOUTH,farHills]]) {
    landGrid(land, WEST, EAST, z0, z1, 42, farDepthSteps, (x, z) => {
      const taper = unit(Math.abs(z - rim) / 55);
      return (1 - taper) * height(x,rim) + taper * ridge(x,z);
    }, hillColor);
  }
}

function landscape(land, water) {
  const { minX, maxX, maxZ } = CITY_BOUNDS;
  landGrid(land, WEST, minX - 4, ROAD_END, maxZ + 4, 14, 23, westHill, hillColor);
  landGrid(land, maxX + 4, EAST, ROAD_END, maxZ + 4, 14, 23, eastHill, hillColor);
  landGrid(land, WEST, EAST, maxZ + 4, NORTH, 42, 12, nearHills, hillColor);
  landGrid(land, WEST, EAST, SOUTH, -98, 42, 12, farHills, hillColor);

  const columns = Array.from({length: 45}, (_, i) => WEST + (EAST - WEST) * i / 44);
  riverbank(land, water, columns);
  for (const side of ['north', 'south']) {
    const polarity = side === 'north' ? 1 : -1;
    strip(land, columns.map(x => {
      const z = shoreline(x)[side] + polarity * 1.19;
      return [[x,SHORE_Y + .012,z - .27],[x,SHORE_Y + .012,z + .27]];
    }), rgb('c1ad98'), .12);
  }
  for (let i = 0; i < 158; i++) {
    const x = WEST + (EAST - WEST) * ((i * 47 % 157) + .5) / 157;
    const local = shoreline(x);
    const frac = .08 + .84 * ((i * 23 % 79) / 79);
    const z = local.south + (local.north - local.south) * frac;
    const span = 1.1 + (i * 11 % 13 + i % 7) * .21;
    ribbon(water, [x - span / 2,RIVER_Y + .022,z - .08], [x + span / 2,RIVER_Y + .022,z + .05],
      .02 + (i % 5) * .017, rgb(i % 9 === 0 ? 'afc7c7' : '76a2bd'));
  }

  // The central hill is backed by the river bank and reads above the apartment roofs.
  landGrid(land, LANDMARK.x - 22, LANDMARK.x + 22, -114, -84, 12, 10,
    (x, z) => z > shoreline(x).south - .12 ? RIVER_Y - .08 :
      SHORE_Y + hill(x,z,LANDMARK.x,LANDMARK.z,19,11,5.1) + hill(x,z,LANDMARK.x - 10,-107,16,10,4.4), hillColor);
}

function loft(out, levels, segments, paint) {
  const rows = levels.map(({x, y, z, r, turn = 0, petals = 0}) =>
    Array.from({length: segments}, (_, i) => {
      const angle = TAU * i / segments + turn;
      const radius = r * (1 + petals * Math.cos(3 * angle));
      return [x + radius * Math.cos(angle), y, z + radius * Math.sin(angle)];
    }));
  for (let i = 0; i < rows.length - 1; i++) {
    for (let j = 0; j < segments; j++) {
      const k = (j + 1) % segments;
      polygon(out, [rows[i][j], rows[i + 1][j], rows[i + 1][k], rows[i][k]], shade(paint, .88 + (j % 5) * .042));
    }
  }
  polygon(out, [...rows.at(-1)].reverse(), shade(paint, 1.11));
}

function tree(out, x, y, z, r, tint) {
  const bark = rgb('776a63');
  prism(out, x, y, z, r * .16, r * 1.25, r * .17, bark);
  loft(out, [
    {x,y:y + r * .65,z,r:r * .47},
    {x,y:y + r * 1.14,z,r:r},
    {x:x + .13 * r,y:y + r * 1.69,z:z - .11 * r,r:r * .70,turn:.23},
    {x:x + .13 * r,y:y + r * 2.03,z:z - .11 * r,r:r * .13,turn:.42},
  ], 6, tint);
}

function gardens(out) {
  const foliage = ['497c69', '599178', '7ca08a', '658770'];
  for (let i = 0; i < 58; i++) {
    const x = -126 + i * 4.46 + Math.sin(i * 4.9) * 1.1;
    if ([-48, 16, 72].some(bridge => Math.abs(bridge - x) < 4.65) || Math.abs(x - LANDMARK.x) < 9.5) continue;
    const bank = shoreline(x);
    const north = i % 2 === 0;
    const z = north ? Math.min(ROAD_END - .6, bank.north + 2.8) : bank.south - 3.25;
    tree(out, x, SHORE_Y, z, .52 + (i % 6) * .092, rgb(foliage[i % foliage.length]));
  }
  for (const side of [-1, 1]) {
    for (let i = 0; i < 12; i++) {
      const x = side * (87.5 + (i % 3) * 4.7), z = -58 + i * 10.52;
      const height = side < 0 ? westHill(x,z) : eastHill(x,z);
      tree(out, x, height, z, .85 + i % 4 * .21, rgb(foliage[i % foliage.length]));
    }
  }
}

function bridge(out, lights, x, style) {
  const bank = shoreline(x);
  const near = bank.north + .48;
  const far = bank.south - .70;
  const center = (near + far) / 2;
  const palette = [rgb('a3747e'), rgb('ddd6bd'), rgb('9fa8b8')];
  const metal = palette[style];
  const deck = rgb('666779');
  const nodes = [[ROAD_END - .015, SHORE_Y], [near, .50], [center, .91], [far, .50], [far - 2.1, SHORE_Y]];
  for (let i = 1; i < nodes.length; i++) {
    const [za, ya] = nodes[i - 1], [zb, yb] = nodes[i];
    polygon(out, [[x - 2.58,yb,zb],[x - 2.58,ya,za],[x + 2.58,ya,za],[x + 2.58,yb,zb]], deck);
    ribbon(out, [x,ya + .04,za], [x,yb + .04,zb], .085, rgb('cfc0ac'));
    for (const side of [-1, 1]) {
      const edge = x + side * 2.59;
      chord(out, [edge,ya + .04,za], [edge,yb + .04,zb], .14, metal);
      chord(out, [edge,ya + .61,za], [edge,yb + .61,zb], .083, metal);
    }
  }
  for (const side of [-1, 1]) {
    const edge = x + side * 2.67;
    const rise = style === 1 ? 6.5 : style === 0 ? 4.0 : 1.7;
    const from = [edge, .73, far], to = [edge, .73, near];
    const points = Array.from({length: 13}, (_, i) => {
      const t = i / 12;
      const factor = style === 1 ? 1 - Math.abs(t * 2 - 1) ** .47 : Math.sin(Math.PI * t);
      return [edge, .73 + rise * factor, from[2] + (to[2] - from[2]) * t];
    });
    for (let i = 0; i < points.length - 1; i++) {
      chord(out, points[i], points[i + 1], style === 0 ? .19 : .125, metal);
      if (i) chord(out, [edge,.55,points[i][2]], points[i], .045, metal);
      if (i % 3 === 0) prism(lights, edge, .63, points[i][2], .13, .18, .15, rgb('ffe8b4'));
    }
    for (const z of [center - 3.1, center + 3.1]) {
      prism(out, edge, RIVER_Y - .06, z, .43, style === 1 ? 4.8 : 1.41, .69, metal);
      if (style === 1) prism(lights, edge, 4.30, z, .23, .13, .33, rgb('b5e8eb'));
    }
  }
}

function promenade(out) {
  const x = CITY_ENTRY.x;
  const palette = ['aa867a', 'b59584', 'a78479', 'c09d8a', '9f7e78'];
  const iron = rgb('796f7c');
  const brightIron = rgb('ab96a0');
  const deck = (width, near, far, samples) => {
    prism(out, x, -.14, (near + far) / 2, width, .14, near - far, rgb('786865'));
    for (let i = 0; i < samples; i++) {
      const d = (near - far) / samples;
      const z = far + d * (i + .5);
      prism(out, x, -.032, z, width - .071, .036, d - .015, rgb(palette[(i * 7) % palette.length]));
    }
  };
  deck(4.42, CITY_BOUNDS.minZ + 1, -74.91, 28);
  deck(16.46, -74.91, -80.23, 14);
  for (const side of [-1, 1]) {
    for (const z of [-78.91, -76.94]) prism(out, x + side * 6.96, RIVER_Y - .12, z, .26, .48, .28, iron);
  }
  function rail(a, b, count) {
    for (const y of [.31, .67]) chord(out, [a[0],y,a[1]], [b[0],y,b[1]], y > .5 ? .095 : .040, brightIron);
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const xx = a[0] + (b[0] - a[0]) * t, z = a[1] + (b[1] - a[1]) * t;
      prism(out, xx, 0, z, .083, .74, .083, iron);
      prism(out, xx, .72, z, .096, .042, .096, brightIron);
    }
  }
  for (const side of [-1, 1]) {
    rail([x + side * 2.13,-66.4], [x + side * 2.13,-75.02], 7);
    rail([x + side * 8.14,-75.04], [x + side * 8.14,-80.14], 4);
    rail([x + side * 2.15,-75.04], [x + side * 8.14,-75.04], 5);
  }
  rail([x - 8.14,-80.14], [x + 8.14,-80.14], 14);
}

function neighborhoods(out, glow) {
  const walls = ['617487','788298','7f8c97','a0909d','696f8a','8c8c93'];
  const light = ['ffdcb2','a9d5ee','e6afd2','d6ece2'];
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i < 21; i++) {
      const x = (i - 10) * (11.4 + row * .38) + Math.sin((i + row) * 8.71) * 3.2;
      const z = -106 - row * 10.4 + Math.cos(i * 3.2 + row) * 3.5;
      if (Math.abs(x - LANDMARK.x) < 24 && row < 2) continue;
      const w = 3.3 + (i * 5 + row * 3) % 7 * .69;
      const h = 5.9 + ((i * 7 + row * 11) % 14) * .83;
      const d = 3.9 + (i * 13 + row) % 5 * .61;
      const color = rgb(walls[(i + 3 * row) % walls.length]);
      prism(out, x, SHORE_Y, z, w, h, d, color);
      prism(out, x + .47, SHORE_Y + h, z - .34, w * .65, 1.11 + i % 3 * .34, d * .70, shade(color, 1.13));
      if (i % 4 === 0) prism(out, x - .72, h + .88, z, .12, 1.8, .12, rgb('8592a3'));
      for (let tier = 0; tier < Math.floor(h / 2); tier++) {
        for (let column = -1; column <= 1; column++) {
          if ((i + tier * 5 + column * 7 + row) % 7 < 2) continue;
          const xx = x + column * w * .26, yy = 1.36 + tier * 1.68, near = z + d / 2 + .029;
          const half = w * .0525;
          polygon(glow, [[xx - half,yy,near],[xx + half,yy,near],[xx + half,yy + .23,near],[xx - half,yy + .23,near]],
            rgb(light[(i + row + tier) % light.length]));
        }
      }
    }
  }
  for (const side of [-1, 1]) {
    for (let i = 0; i < 11; i++) {
      const z = -63 + i * 12.2, x = side * (103 + i % 3 * 8.2);
      const h = 3.4 + i % 5 * 1.18;
      prism(out, x, .05, z, 4.1 + .52 * (i % 3), h, 5.3, rgb(walls[(i + 1) % walls.length]));
      prism(out, x + .6, h, z, 2.9, .72, 3.8, rgb(walls[(i + 3) % walls.length]));
      for (let j = 0; j < 4; j++) {
        const xx = x - side * (2.1 + .26 * (i % 3)), yy = 1.10 + j * .79;
        const panel = [[xx,yy,z - .41],[xx,yy,z + .41],[xx,yy + .185,z + .41],[xx,yy + .185,z - .41]];
        polygon(glow, side > 0 ? panel : panel.reverse(), rgb(light[(i + j) % light.length]));
      }
    }
  }
}

function tower(out, glow) {
  const {x, z} = LANDMARK;
  const offset = 5.0;
  const base = rgb('aab7bc'), shadeA = rgb('8795a6'), glass = rgb('648a9e'), gold = rgb('e8cdaa');
  const ice = rgb('bdfbfb'), frost = rgb('e8c8f7');
  const deck = (levels, tint, n = 30) => loft(out, levels.map(([y, r, petals = 0, turn = 0]) =>
    ({x, z, y:y + offset, r, petals, turn})), n, tint);
  const band = (y, r, width, tint, pulses = 0) => {
    const steps = 48;
    for (let i = 0; i < steps; i++) {
      if (pulses && i % pulses === pulses - 1) continue;
      const a = TAU * i / steps, b = TAU * (i + 1) / steps;
      const position = (angle, y) => [x + Math.cos(angle) * r, y + offset, z + Math.sin(angle) * r];
      polygon(glow, [position(a,y),position(a,y + width),position(b,y + width),position(b,y)], tint);
    }
  };

  deck([[0,7.1],[.45,7.22],[.61,6.87],[1.32,6.23],[1.58,6.21]], base);
  deck([[1.54,5.8],[1.81,5.8],[2.18,5.3]], gold);
  band(1.61, 5.83, .11, frost, 6);
  deck([[2,1.59],[11,1.38],[20,1.15],[30.4,1.26]], shadeA, 20);

  for (let i = 0; i < 3; i++) {
    const theta = i * TAU / 3 + .48;
    const braid = [[1.7,5.26,.66,0],[4.1,4.65,.55,.09],[8.9,3.94,.51,.23],
      [14.7,3.19,.44,.42],[21.9,2.75,.38,.62],[28.8,2.52,.41,.92],[31.0,2.95,.52,1.02]];
    const points = braid.map(([y, distance, r, spin]) => ({
      x:x + Math.cos(theta + spin) * distance, z:z + Math.sin(theta + spin) * distance, y:y + offset, r,
    }));
    loft(out, points, 10, base);
    for (let j = 0; j < points.length - 1; j++) {
      const a = points[j], b = points[j + 1];
      const edge = j * .16 + theta;
      chord(glow, [a.x + Math.cos(edge) * a.r,a.y,a.z + Math.sin(edge) * a.r],
        [b.x + Math.cos(edge + .16) * b.r,b.y,b.z + Math.sin(edge + .16) * b.r], .092, i === 0 ? frost : ice);
      if (j % 2 === 0) {
        chord(out, [a.x,a.y + .36,a.z], [x,b.y - .72,z], .19, shadeA);
      }
    }
  }

  deck([[19,1.39],[19.44,3.12],[19.62,3.44],[20.11,3.4],[20.58,2.93],[20.68,1.52]], base);
  band(19.66, 3.43, .19, ice, 7);
  deck([[29.78,2.2,.05],[30.28,3.8,.06],[30.91,5.07,.06],[31.36,5.48,.06]], shadeA, 42);
  deck([[31.33,5.49,.06],[31.58,5.74,.054],[31.89,5.60,.052],[33.58,5.38,.042]], glass, 42);
  deck([[33.54,5.39,.042],[33.88,5.69,.044],[34.11,5.49,.04],[35.09,4.16,.048],[35.83,2.42,.052]], base, 42);
  band(31.54, 6.11, .48, ice);
  band(33.73, 6.05, .43, frost);
  for (let i = 0; i < 30; i++) {
    const angle = i * TAU / 30;
    const radius = 5.56 * (1 + .047 * Math.cos(3 * angle));
    const y = offset + 32.10;
    const w = .074;
    const ant = [x + Math.cos(angle - w) * radius, y, z + Math.sin(angle - w) * radius];
    const post = [x + Math.cos(angle + w) * radius, y, z + Math.sin(angle + w) * radius];
    polygon(glow, [ant,[ant[0],y + 1.14,ant[2]],[post[0],y + 1.14,post[2]],post],
      i % 5 < 2 ? gold : i % 5 === 2 ? frost : ice);
  }
  deck([[35.8,2.4],[36.35,1.83],[37.1,1.45],[39.5,.72],[44.9,.29],[47.2,.16]], base, 20);
  deck([[40.1,.69],[40.33,1.04],[40.51,.78]], shadeA, 20);
  band(40.33, 1.06, .135, frost);
  band(46.54, .235, .28, rgb('ffc4cb'));

  for (let i = 0; i < 6; i++) {
    const angle = i * TAU / 6;
    const xx = x + Math.cos(angle) * 7.8, zz = z + Math.sin(angle) * 7.8;
    prism(out, xx, offset - .74, zz, .23, 1.75, .23, shadeA);
    prism(glow, xx, offset + .97, zz, .36, .18, .36, gold);
  }
}

function meshFor(B, scene, parent, name, data, material) {
  const mesh = new B.Mesh(name, scene);
  const vertices = new B.VertexData();
  Object.assign(vertices, data);
  vertices.applyToMesh(mesh);
  mesh.parent = parent;
  mesh.material = material;
  mesh.isPickable = false;
  return mesh;
}

function materialFor(B, scene, name, fogEnabled, emissive = false) {
  const material = new B.StandardMaterial(name, scene);
  material.diffuseColor = B.Color3.White();
  material.specularColor.set(.035, .040, .056);
  material.sideOrientation = B.Material.CounterClockWiseSideOrientation;
  material.fogEnabled = fogEnabled;
  if (emissive) {
    material.disableLighting = true;
    material.emissiveColor = B.Color3.White();
  }
  return material;
}

export function createCitySkyline(B, scene, parent) {
  if (!parent) throw new Error('Seul ufku için şehir kökü eksik');
  const root = new B.TransformNode('Seoul skyline', scene);
  root.parent = parent;
  const land = batch(), horizon = batch(), river = batch(), boroughs = batch(), windows = batch();
  const towerBody = batch(), towerGlow = batch(), boardwalk = batch();
  landscape(land, river);
  outskirts(horizon, river);
  dissolveHorizon(horizon);
  dissolveHorizon(river);
  gardens(land);
  neighborhoods(boroughs, windows);
  for (const [style, x] of [-48, 16, 72].entries()) bridge(boroughs, windows, x, style);
  promenade(boardwalk);
  tower(towerBody, towerGlow);

  const terrainPaint = materialFor(B, scene, 'Seoul landscape paint', true);
  const riverPaint = materialFor(B, scene, 'Seoul river color', true, true);
  const boroughPaint = materialFor(B, scene, 'Seoul exterior architecture', false);
  const boroughLamps = materialFor(B, scene, 'Seoul distant window light', false, true);
  const towerPaint = materialFor(B, scene, 'Seoul observation tower structure', false);
  const towerLamps = materialFor(B, scene, 'Seoul observation tower lights', false, true);
  const materials = [terrainPaint, riverPaint, boroughPaint, boroughLamps, towerPaint, towerLamps];
  meshFor(B, scene, root, 'Seoul skyline terrain', land, terrainPaint);
  meshFor(B, scene, root, 'Seoul skyline horizon', horizon, terrainPaint).hasVertexAlpha = true;
  meshFor(B, scene, root, 'Seoul river', river, riverPaint).hasVertexAlpha = true;
  meshFor(B, scene, root, 'Seoul bridges and boroughs', boroughs, boroughPaint);
  meshFor(B, scene, root, 'Seoul river promenade', boardwalk, terrainPaint);
  meshFor(B, scene, root, 'Seoul distant windows', windows, boroughLamps);
  meshFor(B, scene, root, 'Seoul observation tower', towerBody, towerPaint);
  meshFor(B, scene, root, 'Seoul tower illumination', towerGlow, towerLamps);

  let disposed = false;
  let phase = 0;
  function update({night = true, weather = 'clear'} = {}) {
    if (disposed) return;
    const dark = typeof night === 'number' ? unit(Number.isFinite(night) ? night : 1) : Number(Boolean(night));
    const condition = typeof weather === 'string' ? weather : weather?.type ?? 'clear';
    const wet = condition === 'rain' || condition === 'storm';
    const overcast = wet || condition === 'cloudy' || condition === 'snow' || condition === 'fog';
    const dt = Math.max(0, Math.min(.10, (scene.getEngine().getDeltaTime() || 0) / 1000));
    phase = (phase + dt * .38) % TAU;
    const shift = (Math.sin(phase) + 1) / 2;
    const day = overcast ? [.73,.82,.90] : [.94,1,.92];
    const nightLand = [.40,.51,.66];
    terrainPaint.diffuseColor.set(...mix(day, nightLand, dark));
    boroughPaint.diffuseColor.set(...mix([.94,.96,.98], [.44,.49,.65], dark));
    towerPaint.diffuseColor.set(...mix(overcast ? [.80,.86,.95] : [1,.96,.89], [.55,.68,.87], dark));
    const riverDay = wet ? [.74,.89,.98] : [.88,.98,1];
    riverPaint.emissiveColor.set(...mix(riverDay, [.39,.57,.82], dark));
    boroughLamps.emissiveColor.set(...mix([.31,.36,.47], [1,.86,.84], dark));
    const nightTint = overcast ? mix([.83,1.24,1.45], [1.25,.83,1.40], shift) : mix([.73,1.05,1.17], [1.13,.65,1.09], shift);
    towerLamps.emissiveColor.set(...mix(overcast ? [.83,.95,1] : [1,.96,.73], nightTint, dark));
  }

  update();
  return {
    landmark: LANDMARK,
    update,
    dispose() {
      if (disposed) return;
      disposed = true;
      root.dispose();
      for (const material of materials) material.dispose();
    },
  };
}
