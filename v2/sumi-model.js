const SKIN = '#edb896';
const CHEEK = '#cf897a';
const FACE_DETAIL = '#8d5650';
const HAIR = '#4f3030';
const HAIR_LIGHT = '#70433a';
const HAIR_LINE = '#875143';
const CARDIGAN = '#e2b54e';
const RIB = '#c79439';
const EMBROIDERY = '#856154';
const APRON = '#f4e6cd';
const LINEN = '#d9c4aa';
const SKIRT = '#5a3a36';
const SKIRT_LINE = '#704943';
const SHOE = '#362a32';
const WHITE = '#fff8ed';
const INK = '#352530';
const ROSE = '#bd7580';
const GLASS = '#f6d8df';

function posePart(B, scene, name, parent, [x, y, z]) {
  const joint = new B.TransformNode('Sumi/' + name, scene);
  joint.parent = parent;
  joint.position.set(x, y, z);
  return joint;
}

function makePart(B, scene, material, parent) {
  const pending = [];
  function tint(mesh, color, position) {
    mesh.position.set(...position);
    const {r, g, b} = B.Color3.FromHexString(color);
    const shades = new Float32Array(mesh.getTotalVertices() * 4);
    for (let i = 0; i < shades.length; i += 4) {
      shades[i] = r;
      shades[i + 1] = g;
      shades[i + 2] = b;
      shades[i + 3] = 1;
    }
    mesh.setVerticesData(B.VertexBuffer.ColorKind, shades);
    pending.push(mesh);
    return mesh;
  }
  return {
    oval(color, at, scale, tilt = 0, segments = 10) {
      const mesh = tint(B.MeshBuilder.CreateSphere('Sumi oval', {diameter: 2, segments}, scene), color, at);
      mesh.scaling.set(...scale);
      mesh.rotation.z = tilt;
    },
    box(color, at, scale, tilt = 0) {
      const mesh = tint(B.MeshBuilder.CreateBox('Sumi cut', {}, scene), color, at);
      mesh.scaling.set(...scale);
      mesh.rotation.z = tilt;
    },
    lathe(color, profile, at = [0,0,0], tessellation = 22) {
      const shape = profile.map(([y, radius]) => new B.Vector3(radius, y, 0));
      tint(B.MeshBuilder.CreateLathe('Sumi tailored fabric', {shape, tessellation}, scene), color, at);
    },
    panel(color, profile) {
      const columns = 9;
      const positions = [];
      const indices = [];
      const uvs = [];
      for (const [row, [y, width, depth]] of profile.entries()) {
        for (let column = 0; column < columns; column++) {
          const t = column / (columns - 1);
          const side = 2 * t - 1;
          positions.push(width * side, y, depth - .036 * side * side);
          uvs.push(t, row / (profile.length - 1));
          if (row && column) {
            const top = row * columns + column;
            const bottom = top - columns;
            indices.push(bottom - 1, top - 1, bottom, bottom, top - 1, top);
          }
        }
      }
      const data = new B.VertexData();
      data.positions = positions;
      data.indices = indices;
      data.uvs = uvs;
      data.normals = [];
      B.VertexData.ComputeNormals(positions, indices, data.normals);
      const mesh = new B.Mesh('Sumi apron panel', scene);
      data.applyToMesh(mesh);
      tint(mesh, color, [0,0,0]);
    },
    line(color, points, radius = .004, at = [0,0,0], taper) {
      const curve = B.Curve3.CreateCatmullRomSpline(points.map(point => new B.Vector3(...point)), 3);
      const path = curve.getPoints();
      const mesh = B.MeshBuilder.CreateTube('Sumi piping', {
        path, radius, tessellation: 6, cap: B.Mesh.CAP_ALL,
        radiusFunction: taper ? index => radius * taper(index / (path.length - 1)) : undefined,
      }, scene);
      tint(mesh, color, at);
    },
    finish() {
      const merged = B.Mesh.MergeMeshes(pending, true, true);
      if (!merged) throw new Error('Sumi modelinin geometrisi oluşturulamadı');
      merged.name = parent.name + ' mesh';
      merged.parent = parent;
      merged.material = material;
      merged.isPickable = false;
    },
  };
}

function buildSkirt(s) {
  s.lathe(SKIRT, [[.19,0],[.19,.186],[.22,.207],[.39,.18],[.69,.131],[.79,.139],[.80,0]]);
  for (const side of [-1,1]) {
    const x = side * .091;
    s.oval(SKIN,[x,.113,-.009],[.039,.102,.044],0,8);
    s.oval(LINEN,[x,.078,.002],[.041,.070,.045],0,8);
    s.oval(SHOE,[x,.047,.038],[.054,.043,.084],0,9);
    s.oval('#714c48',[x,.072,.064],[.042,.019,.039],0,7);
    s.line(SKIRT_LINE,[[x*1.64,.226,.112],[x*1.54,.39,.106],[x*1.2,.607,.095]],.006);
  }
}

function buildBody(s) {
  s.lathe(CARDIGAN, [[.69,0],[.70,.125],[.75,.142],[.88,.126],[.99,.120],
    [1.15,.136],[1.22,.167],[1.29,.158],[1.34,.102],[1.365,.061],[1.37,0]]);
  s.lathe(RIB, [[.72,.133],[.73,.142],[.756,.144],[.773,.134]]);
  s.lathe(SKIN, [[1.324,0],[1.328,.053],[1.40,.052],[1.416,.059],[1.418,0]]);
  s.panel(APRON,[[.874,.130,.166],[.965,.123,.150],[1.052,.103,.147],[1.118,.105,.149],
    [1.187,.108,.158],[1.245,.103,.173],[1.281,.092,.171]]);
  s.oval(APRON,[0,.691,.112],[.149,.245,.052]);
  s.box(APRON,[0,.872,.143],[.282,.097,.053]);
  s.line(LINEN,[[-.14,.862,.126],[0,.884,.168],[.14,.862,.125]],.012);
  s.oval(LINEN,[.064,.735,.159],[.059,.062,.012],-.095,8);
  s.line(APRON,[[.08,.891,.165],[.13,.847,.177],[.101,.791,.178]],.006);
  s.line(APRON,[[.078,.88,.166],[.03,.852,.176],[.041,.819,.177]],.006);
  for (const side of [-1,1]) {
    s.line(APRON,[[side*.086,1.24,.157],[side*.091,1.286,.137],[side*.101,1.34,.078]],.010);
    s.line(RIB,[[side*.133,1.30,.058],[side*.13,1.18,.109],[side*.123,1.028,.104]],.008);
  }
  // A small embroidered cup, steam and saucer make the apron read from the counter.
  s.line(EMBROIDERY,[[-.017,1.143,.148],[-.014,1.121,.151],[.009,1.121,.152],[.015,1.143,.149]],.0027,[0,0,.013]);
  s.line(EMBROIDERY,[[-.015,1.143,.15],[.018,1.143,.15],[.023,1.137,.151],[.014,1.128,.152]],.0025,[0,0,.013]);
  s.line(EMBROIDERY,[[-.025,1.113,.150],[.001,1.107,.153],[.025,1.113,.150]],.0022,[0,0,.013]);
  for (const x of [-.006,.009]) s.line(EMBROIDERY,[[x,1.152,.151],[x-.004,1.16,.15],[x,1.17,.149]],.0019,[0,0,.013]);
}

function buildHead(s) {
  s.oval(SKIN,[0,0,0],[.128,.147,.111],0,14);
  s.oval(SKIN,[0,-.055,.023],[.111,.096,.092],0,12);
  s.oval(HAIR,[0,.049,-.029],[.139,.133,.117],0,13);
  s.oval(HAIR,[-.049,.169,-.060],[.086,.084,.074],.17,11);
  for (const [i, shift] of [-.042,-.018,.005,.027].entries()) {
    s.line(i % 2 ? HAIR_LIGHT : HAIR, [[shift-.05,.179,-.016],[shift-.03,.233,-.045],
      [shift+.006,.240,-.072],[shift+.034,.204,-.103]], .010, [0,0,0], t => .60+Math.sin(t*Math.PI)*.54);
  }
  // The two warm curls frame her face without covering the expression.
  s.line(HAIR_LIGHT,[[.029,.147,.046],[-.046,.129,.088],[-.103,.074,.102],
    [-.121,.009,.078],[-.109,-.040,.057]],.029,[0,0,0],t=>.19+.83*Math.sin(t*Math.PI));
  s.line(HAIR,[[.031,.149,.057],[.093,.113,.087],[.117,.047,.086],
    [.121,-.022,.061],[.098,-.062,.050]],.030,[0,0,0],t=>.17+.86*Math.sin(t*Math.PI));
  s.line(HAIR_LINE,[[.022,.145,.072],[-.045,.117,.119],[-.095,.075,.122],[-.111,.03,.098]],.004);
  s.oval('#7d8656',[-.108,.172,.005],[.022,.013,.012],-.37,6);
  s.oval('#bc6d67',[-.115,.150,.021],[.017,.019,.010],.13,6);
  s.oval(SKIN,[0,-.021,.108],[.023,.029,.029],0,8);
  s.oval('#f2c1a0',[-.004,-.018,.131],[.012,.010,.008],0,6);
  for (const side of [-1,1]) {
    s.oval(SKIN,[side*.124,-.025,.004],[.018,.031,.023],side*.1,8);
    s.oval('#d7927a',[side*.122,-.026,.022],[.008,.016,.006],0,6);
    s.oval('#f1c26e',[side*.118,-.052,.019],[.009,.012,.009],0,6);
    s.oval(CHEEK,[side*.078,-.042,.087],[.018,.010,.012],side*.15,7);
    s.line(HAIR,[[side*.021,.055,.106],[side*.054,.073,.106],[side*.078,.069,.088]],.0035);
    s.oval(FACE_DETAIL,[side*.014,-.034,.124],[.006,.004,.005],0,5);
  }
  s.line(ROSE,[[-.033,-.060,.102],[-.010,-.068,.115],[.012,-.067,.114],[.033,-.058,.101]],.0055);
  s.line(WHITE,[[-.020,-.062,.112],[0,-.065,.119],[.019,-.062,.112]],.0019);
}

function buildEye(s, side) {
  s.oval(INK,[0,0,0],[.032,.025,.012],side*.08,9);
  s.oval(WHITE,[0,0,.007],[.027,.021,.009],side*.08,9);
  s.oval('#865846',[-side*.002,0,.014],[.017,.019,.007],0,8);
  s.oval(INK,[-side*.002,0,.019],[.009,.015,.004],0,7);
  s.oval(WHITE,[-.006,.007,.023],[.005,.005,.003],0,6);
}

function buildArm(upper, lower, hand) {
  upper.oval(CARDIGAN,[0,-.068,0],[.066,.122,.070],0,10);
  upper.oval(RIB,[0,-.152,0],[.054,.035,.055],0,9);
  lower.oval(CARDIGAN,[0,-.049,0],[.047,.085,.051],0,9);
  lower.oval(RIB,[0,-.108,0],[.042,.022,.045],0,8);
  lower.oval(SKIN,[0,-.131,0],[.029,.054,.035],0,8);
  hand.oval(SKIN,[0,-.027,.005],[.035,.044,.028],0,8);
  hand.oval(SKIN,[.021,-.019,.017],[.014,.027,.016],.31,6);
}

function makeDrink(s, recipe) {
  const chocolate = recipe === 'chocolate';
  s.lathe(chocolate ? '#643c34' : ROSE,[[0,0],[0,.045],[.008,.049],[.047,.056],[.050,0]]);
  s.lathe(chocolate ? '#9b6a4b' : GLASS,[[.045,.054],[.085,.058],[.106,.060],[.116,.056],[.117,0]]);
  s.lathe(chocolate ? '#c7a287' : WHITE,[[.109,.061],[.117,.061],[.122,.057],[.124,0]]);
  s.line(chocolate ? '#f3d7bb' : '#d77e92',[[.022,.113,0],[.021,.161,.001],[.035,.183,.003]],.0045);
  if (chocolate) {
    s.box('#eadbd0',[-.021,.131,.016],[.028,.026,.029],.31);
    s.box('#ddc7b8',[.007,.126,-.021],[.026,.026,.027],-.18);
  } else {
    s.oval('#ce6d78',[-.023,.123,.016],[.015,.012,.017],.12,7);
    s.oval('#819468',[-.024,.134,.017],[.011,.0038,.009],.17,6);
  }
}

const ACTIONS = new Set(['idle','greet','prepare','serve']);

export function createSumi(B, scene, parent) {
  const root = new B.TransformNode('Sumi', scene);
  root.parent = parent;
  root.position.set(.035,0,-3.16);
  root.metadata = {action:'idle', recipe:'strawberry'};
  const material = new B.StandardMaterial('Sumi textiles', scene);
  material.diffuseColor = B.Color3.White();
  material.specularColor.set(.15,.114,.10);
  material.specularPower = 46;
  const body = posePart(B, scene, 'body', root, [0,0,0]);
  const head = posePart(B, scene, 'head', body, [0,1.499,.018]);
  const create = joint => makePart(B, scene, material, joint);
  const legs = create(root);
  buildSkirt(legs);
  legs.finish();
  const outfit = create(body);
  buildBody(outfit);
  outfit.finish();
  const face = create(head);
  buildHead(face);
  face.finish();
  const cups = {};
  for (const recipe of ['strawberry', 'chocolate']) {
    const drink = posePart(B, scene, `${recipe}-cup`, root, [.175,.965,.52]);
    drink.metadata = { recipe };
    const cup = create(drink);
    makeDrink(cup, recipe);
    cup.finish();
    drink.setEnabled(recipe === 'strawberry');
    cups[recipe] = drink;
  }
  const eyes = [];
  const arms = [];
  for (const side of [-1,1]) {
    const direction = side < 0 ? 'right' : 'left';
    const eye = posePart(B, scene, direction + '-eye', head, [side*.055,.021,.100]);
    eye.rotation.y = side*.30;
    const eyeShape = create(eye);
    buildEye(eyeShape, side);
    eyeShape.finish();
    eyes.push(eye);
    const upper = posePart(B, scene, direction + '-shoulder', body, [side*.149,1.273,.002]);
    const lower = posePart(B, scene, direction + '-elbow', upper, [0,-.161,0]);
    const hand = posePart(B, scene, direction + '-hand', lower, [0,-.167,0]);
    const limbs = [create(upper), create(lower), create(hand)];
    buildArm(...limbs);
    limbs.forEach(part => part.finish());
    arms.push({upper, lower, hand});
  }
  let total = 0;
  let phase = 0;
  let action = 'idle';
  function update(dt = 0, next = 'idle', recipe = 'strawberry') {
    if (!ACTIONS.has(next)) throw new RangeError('Sumi hareketi geçersiz');
    if (!Object.hasOwn(cups, recipe)) throw new RangeError('Sumi tarifi geçersiz');
    const drink = cups[recipe];
    if (root.metadata.recipe !== recipe) {
      const previous = cups[root.metadata.recipe];
      drink.position.copyFrom(previous.position);
      previous.setEnabled(false);
      drink.setEnabled(true);
      root.metadata.recipe = recipe;
    }
    const elapsed = Math.max(0, Math.min(.10, dt));
    if (action !== next) {
      phase = 0;
      action = next;
      root.metadata.action = next;
    }
    phase += elapsed;
    total += elapsed;
    const weight = elapsed ? 1 - Math.exp(-elapsed * 11) : 1;
    const ease = (from, to) => from + (to-from) * weight;
    const wave = action === 'greet';
    const cook = action === 'prepare';
    const serve = action === 'serve';
    const whisk = phase * (recipe === 'chocolate' ? 7.5 : 9);
    const stir = Math.sin(whisk);
    const reach = Math.min(1, phase * 1.9);
    const presentation = reach * reach * (3-2*reach);
    const [right,left] = arms;
    body.position.z = ease(body.position.z, serve ? .142 * presentation : 0);
    body.rotation.y = ease(body.rotation.y, cook ? .09 * stir : .025 * Math.sin(total*1.2));
    head.rotation.x = ease(head.rotation.x, cook ? .13 + .045 * stir : -.025 - .045 * (wave || serve));
    head.rotation.z = ease(head.rotation.z, wave ? .12 : .035 * Math.sin(total * 1.8));
    right.upper.rotation.z = ease(right.upper.rotation.z, wave ? -1.38 : -.10);
    right.lower.rotation.z = ease(right.lower.rotation.z, wave ? -.99 + .21*Math.sin(phase*13) : .08);
    right.upper.rotation.x = ease(right.upper.rotation.x, wave ? -.13 : cook ? -.59 : serve ? -1.06 : -.20);
    right.lower.rotation.x = ease(right.lower.rotation.x, wave ? -.22 : cook ? -.85+.18*stir : serve ? -.43 : -.59);
    right.hand.rotation.z = ease(right.hand.rotation.z, wave ? .32*Math.sin(phase*13) : cook ? .17*Math.cos(whisk) : 0);
    left.upper.rotation.z = ease(left.upper.rotation.z, cook || serve ? .06 : .13);
    left.upper.rotation.x = ease(left.upper.rotation.x, cook ? -.48 : serve ? -.72 : -.29);
    left.lower.rotation.x = ease(left.lower.rotation.x, cook ? -.92 : serve ? -.60 : -.54);
    drink.position.x = ease(drink.position.x, cook ? -.120+.023*stir : serve ? -.13 : .175);
    drink.position.y = ease(drink.position.y, serve ? .965+.035*Math.sin(presentation*Math.PI) : .965);
    drink.position.z = ease(drink.position.z, cook ? .322 : serve ? .32+.37*presentation : .52);
    const blink = Math.max(0, 1-Math.abs(total%4.6-3.52)/.105);
    for (const eye of eyes) eye.scaling.y = 1-blink*.93;
  }
  update();
  return {
    update,
    dispose() {
      root.dispose();
      material.dispose();
    },
  };
}
