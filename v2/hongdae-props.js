export const HONGDAE_LIGHTSTICKS = Object.freeze(['hammer', 'white-star', 'jisoo-cone']);

const TAU = Math.PI * 2;
const sceneMaterials = new WeakMap();

function materialsFor(B, scene) {
  if (!sceneMaterials.has(scene)) sceneMaterials.set(scene, new Map());
  const materials = sceneMaterials.get(scene);
  return (name, hex, roughness = .57, metallic = 0, glow = 0) => {
    if (materials.has(name)) return materials.get(name);
    const material = new B.PBRMaterial('Hongdae ' + name, scene);
    material.albedoColor = B.Color3.FromHexString(hex).toLinearSpace();
    material.metallic = metallic;
    material.roughness = roughness;
    material.emissiveColor = material.albedoColor.scale(glow);
    materials.set(name, material);
    return material;
  };
}

function node(B, scene, name, parent, position = [0, 0, 0]) {
  const part = new B.TransformNode(name, scene);
  part.parent = parent;
  part.position.set(...position);
  return part;
}

function modelMaker(B, scene, root) {
  const named = name => root.name + '/' + name;
  const material = materialsFor(B, scene);
  const joint = (name, parent, position) => node(B, scene, named(name), parent, position);
  const finish = (mesh, parent, surface, position = [0, 0, 0]) => {
    mesh.parent = parent;
    mesh.material = surface;
    mesh.isPickable = false;
    mesh.position.set(...position);
    return mesh;
  };
  const ball = (name, parent, surface, position, scale, segments = 9) => {
    const mesh = B.MeshBuilder.CreateSphere(named(name), {diameter: 2, segments}, scene);
    mesh.scaling.set(...scale);
    return finish(mesh, parent, surface, position);
  };
  const tube = (name, parent, surface, points, radius, sides = 5, radiusFunction) => {
    const path = points.map(point => new B.Vector3(...point));
    const mesh = B.MeshBuilder.CreateTube(named(name), {
      path, radius, radiusFunction, tessellation: sides, cap: B.Mesh.CAP_ALL,
    }, scene);
    return finish(mesh, parent, surface);
  };
  const geometry = (name, parent, surface, positions, indices, position) => {
    // Match the winding of Babylon's primitive meshes before batching the parts.
    for (let index = 0; index < indices.length; index += 3) {
      [indices[index + 1], indices[index + 2]] = [indices[index + 2], indices[index + 1]];
    }
    const data = new B.VertexData();
    const normals = [];
    B.VertexData.ComputeNormals(positions, indices, normals);
    data.positions = positions;
    data.indices = indices;
    data.normals = normals;
    data.uvs = new Float32Array(positions.length / 3 * 2);
    const mesh = new B.Mesh(named(name), scene);
    data.applyToMesh(mesh);
    return finish(mesh, parent, surface, position);
  };
  return {joint, material, geometry, tube, ball};
}

function rings(indices, count, levels, reverse = false) {
  for (let level = 0; level < levels - 1; level++) {
    for (let side = 0; side < count; side++) {
      const start = level * count + side;
      const next = level * count + (side + 1) % count;
      const top = start + count;
      const topNext = next + count;
      if (reverse) indices.push(start, top, next, next, top, topNext);
      else indices.push(start, next, top, next, topNext, top);
    }
  }
}

function lathe(make, name, parent, surface, profile, {segments = 26, ripple = 0, at} = {}) {
  const positions = [];
  const indices = [];
  for (const [level, [y, radius, offset = 0]] of profile.entries()) {
    for (let side = 0; side < segments; side++) {
      const angle = TAU * side / segments;
      const edge = radius * (1 + ripple * Math.sin(angle * 5 + level * .63));
      positions.push(offset + edge * Math.cos(angle), y, edge * Math.sin(angle));
    }
  }
  rings(indices, segments, profile.length, true);
  return make.geometry(name, parent, surface, positions, indices, at);
}

function badge(make, name, parent, surface, outline, at, thickness, bevel = .12, dome = 0) {
  const positions = [];
  const indices = [];
  const half = thickness / 2;
  const profile = [[1 - bevel, -half], [1, -half * .55], [1, half * .48], [1 - bevel, half]];
  for (const [radius, z] of profile) {
    for (const [x, y] of outline) positions.push(x * radius, y * radius, z);
  }
  const count = outline.length;
  const lower = positions.length / 3;
  const upper = lower + 1;
  positions.push(0, 0, -half, 0, 0, half + dome);
  rings(indices, count, profile.length);
  const front = (profile.length - 1) * count;
  for (let side = 0; side < count; side++) {
    const next = (side + 1) % count;
    indices.push(lower, next, side, upper, front + side, front + next);
  }
  return make.geometry(name, parent, surface, positions, indices, at);
}

function star(radius, spin = 0, inner = .45) {
  return Array.from({length: 10}, (_, index) => {
    const angle = Math.PI / 2 + index * TAU / 10 + spin;
    const tip = index % 2 ? radius * inner : radius;
    return [tip * Math.cos(angle), tip * Math.sin(angle)];
  });
}

function heart(width, height, count = 28) {
  return Array.from({length: count}, (_, index) => {
    const angle = -TAU * index / count;
    const y = 13 * Math.cos(angle) - 5 * Math.cos(2 * angle)
      - 2 * Math.cos(3 * angle) - Math.cos(4 * angle);
    return [width * .5 * Math.sin(angle) ** 3, height * (y + 2.6) / 29];
  });
}

function mergeByMaterial(B, parent) {
  const groups = new Map();
  for (const mesh of parent.getChildMeshes(true)) {
    if (!groups.has(mesh.material)) groups.set(mesh.material, []);
    groups.get(mesh.material).push(mesh);
  }
  for (const [material, parts] of groups) {
    if (parts.length <= 1) continue;
    for (const mesh of parts) mesh.parent = null;
    const combined = B.Mesh.MergeMeshes(parts, true, false);
    if (!combined) throw new Error(parent.name + ' parçaları birleştirilemedi');
    combined.name = parent.name + ' ' + material.name;
    combined.parent = parent;
    combined.isPickable = false;
  }
}

function makeHammer(make, root) {
  const black = make.material('hammer rubber', '#282133', .43);
  const button = make.material('hammer switch', '#514353', .31, .12);
  const satin = make.material('hammer pink', '#f889bb', .32, .07, .10);
  const lip = make.material('hammer highlight', '#ffbedc', .32, .05, .12);
  const rim = make.material('hammer relief', '#e06b9e', .42, .04);
  lathe(make, 'handle', root, black, [
    [-.085, 0], [-.085, .009], [-.081, .013], [-.069, .014], [-.030, .014],
    [.015, .016], [.046, .017], [.064, .022], [.083, .025], [.093, .034],
    [.109, .040], [.129, .039], [.143, .030], [.149, .019], [.151, 0],
  ]);
  lathe(make, 'rose collar', root, satin, [
    [.040, .016], [.041, .018], [.049, .020], [.055, .019], [.056, .017],
  ]);
  make.ball('power switch', root, button, [0, .015, .016], [.006, .007, .0028], 8);
  make.ball('status light', root, lip, [0, .024, .0162], [.002, .002, .0013], 6);
  for (const side of [-1, 1]) {
    const mount = make.joint('hammer end ' + side, root, [side * .051, .120, 0]);
    mount.rotation.y = side * .21;
    mount.rotation.z = side * -.12;
    const outline = heart(.069, .087);
    badge(make, 'double heart', mount, satin, outline, [0, 0, 0], .043, .23, .003);
    badge(make, 'heart piping', mount, lip, heart(.060, .077), [0, 0, -.0165], .004, .14);
    const relief = heart(.055, .069).map(([x, y]) => [x, y, .0225]);
    relief.push(relief[0]);
    make.tube('embossed heart', mount, rim, relief, .0012, 5);
    make.ball('pearl mark', mount, lip, [-side * .010, .018, .023], [.009, .004, .0019], 6);
  }
}

function makeWhiteStar(make, root) {
  const pearl = make.material('star enamel', '#f1f0f9', .29, .06);
  const crystal = make.material('star prism', '#fcf8ff', .19, .16, .20);
  const silver = make.material('star silver', '#a9a1ba', .30, .52);
  const button = make.material('star switch', '#726785', .37, .24);
  lathe(make, 'pearl grip', root, pearl, [
    [-.085, 0], [-.085, .015], [-.081, .019], [-.068, .020],
    [-.019, .018], [.018, .016], [.040, .016], [.064, .022],
    [.077, .019], [.087, .017], [.089, 0],
  ]);
  lathe(make, 'silver cap seam', root, silver, [[-.071,.019],[-.070,.020],[-.067,.020],[-.066,.019]]);
  make.ball('star power switch', root, button, [0, .006, .018], [.0058, .0072, .0028], 8);
  const top = make.joint('star lamp', root, [0, .112, 0]);
  top.rotation.z = -.11;
  badge(make, 'star enamel housing', top, pearl, star(.074), [0, 0, 0], .030, .11, .002);
  badge(make, 'silver trim', top, silver, star(.061, 0, .46), [0, 0, .014], .006, .075);
  const diffuser = badge(make, 'prismatic star', top, crystal, star(.055, 0, .47), [0, 0, .018], .008, .055, .012);
  diffuser.convertToFlatShadedMesh();
  badge(make, 'rear star emblem', top, pearl, star(.045), [0, 0, -.015], .003);
}

function makeCone(make, root) {
  const waffle = make.material('cone waffle', '#e9b46b', .66);
  const weave = make.material('cone waffle relief', '#bd8547', .71);
  const vanilla = make.material('vanilla diffuser', '#fff2e3', .35, 0, .07);
  const lavender = make.material('lavender diffuser', '#b596e3', .34, .02, .13);
  const glaze = make.material('vanilla glaze', '#fffafd', .30, .04, .12);
  lathe(make, 'waffle cone', root, waffle, [
    [-.085, 0], [-.085, .005], [-.079, .008], [-.073, .009], [.048, .030],
    [.055, .032], [.060, .032], [.063, .030], [.063, 0],
  ]);
  for (const direction of [-1, 1]) {
    for (let strand = 0; strand < 10; strand++) {
      const path = Array.from({length: 12}, (_, index) => {
        const t = index / 11;
        const radius = .0095 + .0207 * t;
        const angle = TAU * strand / 10 + direction * 2.18 * t;
        return [radius * Math.cos(angle), -.073 + .121 * t, radius * Math.sin(angle)];
      });
      make.tube('waffle spiral', root, weave, path, .0008, 4);
    }
  }
  lathe(make, 'vanilla scoop', root, vanilla, [
    [.054, 0], [.054, .023], [.060, .034], [.070, .040], [.081, .041],
    [.090, .037], [.098, .028], [.103, 0],
  ], {ripple: .055});
  lathe(make, 'lavender scoop', root, lavender, [
    [.083, 0], [.084, .026], [.089, .035], [.098, .042], [.108, .043],
    [.116, .038], [.126, .036], [.138, .034], [.149, .028], [.156, .017], [.161, 0],
  ], {ripple: .065});
  lathe(make, 'flowing vanilla cap', root, glaze, [
    [.129, .025], [.134, .034], [.141, .035], [.149, .030],
    [.156, .023], [.162, .016], [.165, .008], [.166, 0],
  ], {ripple: .068});
  for (const [x, z, length] of [[-.024,.021,.012],[.004,.034,.008],[.026,.020,.010],[-.023,-.020,.009],[.007,-.031,.013]]) {
    make.ball('vanilla drip', root, glaze, [x, .137, z], [.006, length, .0045], 7);
  }
}

const sticks = new Map([
  ['hammer', makeHammer],
  ['white-star', makeWhiteStar],
  ['jisoo-cone', makeCone],
]);

// A shared local origin lets the shelf, Sofia’s wrist and the photo booth reuse the same geometry.
export function createLightstick(B, scene, id, name = id) {
  const build = sticks.get(id);
  if (!build) throw new RangeError('Bilinmeyen ışık çubuğu: ' + id);
  const root = node(B, scene, name, null);
  const make = modelMaker(B, scene, root);
  build(make, root);
  for (const joint of [root, ...root.getChildTransformNodes(false)]) mergeByMaterial(B, joint);
  return {root, meshes: root.getChildMeshes(), dispose: () => root.dispose()};
}

function smoothstep(start, end, value) {
  const t = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
}

function colorHead(B, mesh, ivory, black) {
  const vertices = mesh.getVerticesData(B.VertexBuffer.PositionKind);
  const colors = new Float32Array(vertices.length / 3 * 4);
  for (let index = 0, output = 0; index < vertices.length; index += 3, output += 4) {
    const [x, y, z] = [vertices[index], vertices[index + 1], vertices[index + 2]];
    const outline = Math.hypot((x + .63 - .36 * y) / .60, (y - .32) / .86);
    const mask = 1 - smoothstep(.91, 1.05, outline);
    const cap = smoothstep(.03, .32, -z) * smoothstep(.27, .61, y - .48 * z);
    const shade = Math.max(mask, cap);
    colors[output] = ivory.r + (black.r - ivory.r) * shade;
    colors[output + 1] = ivory.g + (black.g - ivory.g) * shade;
    colors[output + 2] = ivory.b + (black.b - ivory.b) * shade;
    colors[output + 3] = 1;
  }
  mesh.setVerticesData(B.VertexBuffer.ColorKind, colors, false);
}

function makePixelHead(B, make, head, colors) {
  const {ink, cream, velvet, green, blush, shine, whisker, lid} = colors;
  const fur = make.material('Pixel facial fur', '#ffffff', .76);
  const skull = make.ball('head', head, fur, [0, 0, 0], [.114, .101, .094], 22);
  colorHead(B, skull, cream.albedoColor, ink.albedoColor);
  const eyelids = [];
  for (const side of [-1, 1]) {
    const ear = make.joint('ear ' + side, head, [side * .078, .071, -.011]);
    ear.rotation.z = -side * .22;
    const outline = [[-.044,-.031],[.042,-.025],[.038,.009],[.028,.047],[.013,.071],[-.002,.073],[-.021,.053],[-.038,.012]];
    badge(make, 'velvet ear', ear, side < 0 ? ink : cream, outline, [0, 0, 0], .037, .14, .005);
    badge(make, 'warm ear lining', ear, velvet, outline.map(([x,y])=>[x*.69,y*.71]), [0, .006, .019], .007, .16);
    const eye = make.joint('eye ' + side, head, [side * .051,.014,.081]);
    eye.rotation.y = side * .31;
    make.ball('eye outline', eye, lid, [0,0,.002],[.031,.030,.012], 8);
    make.ball('golden green iris', eye, green, [0,0,.010],[.026,.025,.009], 8);
    make.ball('pupil', eye, ink, [.001,0,.017],[.011,.022,.0045], 7);
    make.ball('main catchlight', eye, shine, [-.008,.010,.020],[.007,.0065,.0025], 5);
    make.ball('second catchlight', eye, shine, [.008,-.009,.020],[.003,.003,.0017], 4);
    eyelids.push(eye);
    make.ball('muzzle', head, cream, [side*.025,-.033,.086], [.038,.029,.023], 9);
    for (let line = 0; line < 3; line++) {
      const height = -.032 - line * .009;
      const width = .129 + (line === 1 ? .008 : 0);
      make.tube('fine whisker', head, whisker, [
        [side*.055,height,.097],[side*.082,height+.003,.106],
        [side*.112,height+.009-line*.007,.104],
        [side*width,height+.011-line*.013,.096],
      ], .00105, 4, (_,distance)=>Math.max(.00038,.00115-distance*.010));
    }
    make.tube('smile', head, lid, [
      [0,-.041,.111], [side*.012,-.053,.110], [side*.027,-.051,.107],
    ],.0013,5);
  }
  badge(make, 'heart nose', head, blush, heart(.026,.021,20), [0,-.028,.110], .009, .24, .001);
  make.ball('nose gleam', head, shine, [-.004,-.023,.115], [.004,.0023,.0011], 4);
  return eyelids;
}

function makePixelBody(make, body, colors) {
  const {ink, cream, blush, velvet, gold, tag} = colors;
  make.ball('back', body, ink, [0,.175,-.033], [.122,.114,.204], 12);
  make.ball('chest', body, cream, [0,.183,.089], [.087,.115,.116], 11);
  make.ball('left shoulder patch', body, ink, [-.069,.195,.075], [.046,.084,.086], 8);
  make.ball('white flank', body, cream, [.062,.147,-.072], [.067,.061,.113], 8);
  make.ball('white blaze', body, cream, [-.053,.130,-.122], [.062,.057,.071], 8);
  lathe(make,'rose collar',body,velvet,[
    [.222,.070],[.226,.079],[.236,.081],[.242,.074],
  ],{segments:24,at:[0,0,.125]});
  make.ball('collar attachment', body, gold, [0,.224,.207], [.010,.010,.005], 6);
  const tagFace = make.joint('pendant', body, [0,.204,.212]);
  badge(make,'enamel tag',tagFace,tag,Array.from({length:18},(_,index)=>{
    const angle=TAU*index/18;
    return [.017*Math.cos(angle),.017*Math.sin(angle)];
  }),[0,0,0],.006);
  make.ball('paw tag pad', tagFace, blush, [0,-.003,.0035], [.0065,.005,.0019], 5);
  for (const [x,y] of [[-.008,.004],[-.003,.009],[.004,.009],[.009,.004]]) {
    make.ball('paw tag toe', tagFace, blush, [x,y,.0032], [.0027,.0031,.0016], 4);
  }
}

function makePixelLegs(make, body, colors) {
  const legs = [];
  for (const front of [true, false]) {
    for (const side of [-1, 1]) {
      const leg = make.joint((front ? 'fore' : 'hind') + 'paw ' + side, body,
        [side * (front ? .077 : .085), .147, front ? .104 : -.152]);
      const ankle = front ? [.033, .073, .037] : [.045, .073, .053];
      make.ball('ankle', leg, colors.ink, [0, -.044, front ? 0 : -.014], ankle, 8);
      make.ball('white sock',leg,colors.cream,[0,-.091,.006],[.032,.045,.032],8);
      make.ball('white paw',leg,colors.cream,[.002,-.122,.022],[.036,.025,.046],8);
      legs.push(leg);
    }
  }
  return legs;
}

function makePixelTail(B, make, tail, color) {
  const controls = [
    [0,0,0], [.009,.029,-.056], [.028,.092,-.101], [.058,.153,-.119],
    [.071,.206,-.108], [.053,.237,-.077], [.032,.244,-.052], [.019,.233,-.040],
  ];
  const path = B.Curve3.CreateCatmullRomSpline(controls.map(point => new B.Vector3(...point)), 4)
    .getPoints().map(point => [point.x, point.y, point.z]);
  make.tube('arched tail', tail, color, path, .027, 9,
    index => .028 - .013 * (index / (path.length - 1)) ** 1.4);
  make.ball('tail tip', tail, color, path[path.length - 1], [.015, .015, .015], 8);
}

// Placement is owned by the world. The pivot keeps the same gait and expression in every scene.
export function createPixel(B, scene, name = 'pixel') {
  const root = node(B, scene, name, null);
  const make = modelMaker(B, scene, root);
  const colors = {
    ink: make.material('Pixel tuxedo', '#282331', .71),
    cream: make.material('Pixel ivory fur', '#fff0df', .79),
    velvet: make.material('Pixel rose collar', '#dc8ba4', .58),
    green: make.material('Pixel iris', '#b1b76b', .28),
    blush: make.material('Pixel paw pink', '#e2a0af', .56),
    shine: make.material('Pixel eye gleam', '#fffce7', .28, 0, .18),
    whisker: make.material('Pixel whiskers', '#a99aa5', .72),
    lid: make.material('Pixel lash line', '#554052', .62),
    gold: make.material('Pixel collar clasp', '#e8b77d', .39, .22),
    tag: make.material('Pixel enamel tag', '#603252', .38),
  };
  const body = make.joint('body', root, [0,0,0]);
  const head = make.joint('head', body, [0,.290,.143]);
  const tail = make.joint('tail', body, [0,.171,-.195]);
  makePixelBody(make, body, colors);
  const eyes = makePixelHead(B, make, head, colors);
  const legs = makePixelLegs(make, body, colors);
  makePixelTail(B, make, tail, colors.ink);
  for (const joint of [body, ...body.getChildTransformNodes(false)]) mergeByMaterial(B, joint);

  let time = 0;
  let pace = 0;
  let pose = 0;
  let gait = 0;
  function place(x, z, yaw = 0) {
    root.position.set(x, 0, z);
    root.rotation.y = yaw;
  }
  function step({x = root.position.x, z = root.position.z, yaw = root.rotation.y, elapsed = 0, walking = false, photo = false} = {}) {
    place(x, z, yaw);
    const delta = Math.min(.08, Math.max(0, elapsed));
    const mix = delta ? 1 - Math.exp(-delta * 12) : 1;
    time += delta;
    pace += ((walking && !photo ? 1 : 0) - pace) * mix;
    pose += ((photo ? 1 : 0) - pose) * mix;
    gait += (7 + pace * 9) * delta;
    const trot = Math.sin(gait) * pace;
    body.position.y = .011 * Math.abs(trot) - pose * .016 + (.002 * Math.sin(time * 2.4));
    body.rotation.x = -.14 * pose;
    head.rotation.set(.051 * trot - .10 * pose, .08 * Math.sin(time * 1.6) * (1 - pace), .17 * pose + .04 * Math.sin(time * 2.7));
    tail.rotation.set(.12 * pose + .06 * trot, (.23 + .20 * pace) * Math.sin(time * (1.9 + pace)), .14 * pose);
    for (const [index, leg] of legs.entries()) {
      const swing = (index === 0 || index === 3) ? trot : -trot;
      leg.rotation.x = .49 * swing + pose * [-.78,.14,.35,.32][index];
      leg.position.y = .147 + Math.max(0, swing) * .021 + pose * (index < 2 ? .022 : -.004);
    }
    const blink = Math.max(0, 1 - Math.abs((time % 4.2) - 3.1) / .115);
    for (const eye of eyes) eye.scaling.y = 1 - blink * .94 * (1 - pose);
  }
  return {root, meshes: root.getChildMeshes(), place, step, dispose: () => root.dispose()};
}
