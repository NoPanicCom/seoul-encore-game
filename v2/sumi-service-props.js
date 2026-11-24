function node(B, scene, parent, name) {
  const root = new B.TransformNode(name, scene);
  root.parent = parent;
  return root;
}

function batch(B, scene, root, material) {
  const parts = [];
  function paint(mesh, color, x, y, z, width, height, depth) {
    mesh.position.set(x, y, z);
    mesh.scaling.set(width, height, depth);
    const {r, g, b} = B.Color3.FromHexString(color);
    const shades = new Float32Array(mesh.getTotalVertices() * 4);
    for (let i = 0; i < shades.length; i += 4) {
      shades[i] = r;
      shades[i + 1] = g;
      shades[i + 2] = b;
      shades[i + 3] = 1;
    }
    mesh.setVerticesData(B.VertexBuffer.ColorKind, shades);
    parts.push(mesh);
    return mesh;
  }
  return {
    box: (...args) => paint(B.MeshBuilder.CreateBox('service detail', {}, scene), ...args),
    disk: (...args) => paint(B.MeshBuilder.CreateCylinder('service disk', {tessellation: 18}, scene), ...args),
    orb: (...args) => paint(B.MeshBuilder.CreateSphere('service accent', {segments: 6}, scene), ...args),
    ring: (...args) => paint(B.MeshBuilder.CreateTorus('service rim', {diameter:1, thickness:.047, tessellation:22}, scene), ...args),
    finish() {
      const mesh = B.Mesh.MergeMeshes(parts, true, true);
      if (!mesh) {
        for (const part of parts) if (!part.isDisposed()) part.dispose();
        throw new Error('Sumi servis geometrisi oluşturulamadı');
      }
      mesh.name = root.name + ' mesh';
      mesh.parent = root;
      mesh.material = material;
      mesh.isPickable = false;
    },
  };
}

export function createSumiMaterials(B, scene) {
  const solid = new B.StandardMaterial('Sumi strawberry service', scene);
  solid.diffuseColor = B.Color3.White();
  solid.specularColor.set(.13, .085, .10);
  const glass = new B.StandardMaterial('Sumi clear glass', scene);
  glass.diffuseColor = B.Color3.FromHexString('#ddddea');
  glass.specularColor.set(.63,.57,.65);
  glass.specularPower = 76;
  glass.alpha = .25;
  glass.disableDepthWrite = true;
  glass.backFaceCulling = false;
  return {
    solid, glass,
    dispose() {
      glass.dispose();
      solid.dispose();
    },
  };
}

const GLASS_CENTER = Object.freeze({x: .021, y: .040, z: -.013});

export function createSumiDrink(B, scene, parent, materials, name, onTray) {
  const root = node(B, scene, parent, name);
  const glassRoot = onTray ? node(B, scene, root, name + ' glass') : root;
  if (onTray) {
    glassRoot.position.set(GLASS_CENTER.x, GLASS_CENTER.y, GLASS_CENTER.z);
    const tray = batch(B, scene, root, materials.solid);
    tray.disk('#754e48',0,.012,0,.392,.024,.286);
    tray.disk('#ad7761',0,.027,0,.367,.015,.261);
    tray.ring('#c18a6a',0,.034,0,.386,.35,.283);
    tray.box('#f5e1c7',-.043,.038,.016,.230,.007,.124).rotation.y = -.22;
    tray.finish();
  }
  const shell = B.MeshBuilder.CreateCylinder(name + ' transparent wall', {
    diameterTop:.128, diameterBottom:.106, height:.140, tessellation:22, cap:B.Mesh.NO_CAP,
  }, scene);
  shell.parent = glassRoot;
  shell.position.y = .076;
  shell.material = materials.glass;
  shell.isPickable = false;
  const edges = batch(B, scene, glassRoot, materials.solid);
  edges.disk('#e8d4d9',0,.006,0,.107,.012,.107);
  edges.ring('#ecdddd',0,.144,0,.126,.24,.126);
  edges.finish();

  const milk = node(B, scene, glassRoot, name + ' milk level');
  milk.position.y = .012;
  const layers = batch(B, scene, milk, materials.solid);
  layers.disk('#ce8295',0,.024,0,.105,.048,.105);
  layers.disk('#e8a7b6',0,.067,0,.114,.043,.114);
  layers.disk('#f2ced9',0,.100,0,.119,.028,.119);
  layers.finish();
  const foam = node(B, scene, glassRoot, name + ' foam');
  const top = batch(B, scene, foam, materials.solid);
  top.disk('#fff1df',0,.007,0,.122,.015,.122);
  top.orb('#c7717f',-.018,.023,.008,.035,.038,.031);
  top.orb('#71865d',-.018,.034,.010,.028,.007,.021);
  top.finish();
  const residue = node(B, scene, glassRoot, name + ' strawberry residue');
  const traces = batch(B, scene, residue, materials.solid);
  traces.disk('#d997a6',.008,.014,.005,.082,.006,.072);
  traces.orb('#e6afbc',-.037,.027,-.021,.023,.024,.015);
  traces.finish();

  function setFill(fraction) {
    milk.setEnabled(fraction > .003);
    foam.setEnabled(fraction > .06);
    residue.setEnabled(fraction <= .003);
    milk.scaling.y = Math.max(.002, fraction);
    foam.position.y = .012 + .107 * fraction;
  }
  setFill(onTray ? 1 : 0);
  return {root, glassRoot, glassCenter: GLASS_CENTER, setFill};
}

export function createPaymentProps(B, scene, parent, materials) {
  const terminal = node(B, scene, parent, 'Sumi cash terminal');
  terminal.position.set(-.66,.965,-2.365);
  terminal.rotation.y = -.12;
  const terminalPaint = batch(B, scene, terminal, materials.solid);
  terminalPaint.box('#4b3742',0,.028,0,.177,.056,.139);
  terminalPaint.box('#6f5961',0,.061,-.011,.164,.023,.121);
  terminalPaint.box('#91a8a0',0,.074,-.023,.098,.009,.054);
  for (let i=0;i<4;i++) terminalPaint.box('#d6b3a5',(i-1.5)*.030,.073,.036,.016,.008,.014);
  terminalPaint.finish();
  const light = node(B, scene, terminal, 'Sumi terminal confirmation');
  const lightPaint = batch(B, scene, light, materials.solid);
  lightPaint.box('#b1e6b0',0,.081,-.023,.069,.007,.027);
  lightPaint.finish();
  light.setEnabled(false);
  const card = node(B, scene, parent, 'Sumi payment card');
  const cardPaint = batch(B, scene, card, materials.solid);
  cardPaint.box('#879dc3',0,.006,0,.112,.012,.073);
  cardPaint.box('#f4d694',-.024,.013,.013,.024,.004,.021);
  cardPaint.box('#dac8e3',.024,.013,-.015,.034,.004,.009);
  cardPaint.finish();
  card.setEnabled(false);
  return {terminal, light, card};
}

export function createTableMarks(B, scene, parent, materials, table) {
  const dirty = node(B, scene, parent, 'Sumi dirty tabletop');
  dirty.position.set(table.x,table.y,table.z);
  const patches = [
    [-.255,.138,.190,.070],[-.155,.078,.112,.055],[-.036,.190,.156,.102],
    [.160,.176,.170,.098],[.274,.072,.141,.083],
  ].map(([x,z,w,d],i) => {
    const root = node(B, scene, dirty, 'Sumi spill ' + (i+1));
    root.position.set(x,.003,z);
    const paint = batch(B, scene, root, materials.solid);
    paint.orb('#d78f98',0,0,0,w,.005,d);
    paint.orb('#efc4b4',.018,.002,-.007,w*.60,.004,d*.42);
    paint.finish();
    return root;
  });
  const napkin = node(B, scene, dirty, 'Sumi used napkin');
  napkin.position.set(-.23,.018,-.015);
  const paper = batch(B, scene, napkin, materials.solid);
  paper.box('#e5c8ad',0,.007,0,.126,.014,.092).rotation.y = .25;
  paper.box('#f2dcca',-.016,.015,.003,.104,.010,.079).rotation.set(.11,.42,.07);
  paper.box('#cd9490',-.021,.021,.008,.039,.005,.024).rotation.y = .45;
  paper.finish();
  const cloth = node(B, scene, parent, 'Sumi tabletop cloth');
  const fabric = batch(B, scene, cloth, materials.solid);
  fabric.box('#70a692',0,.016,0,.170,.031,.123);
  fabric.box('#abd1ae',0,.032,0,.157,.010,.111);
  fabric.box('#cad9a6',0,.040,.040,.143,.006,.015);
  fabric.finish();
  return {dirty, patches, napkin, cloth};
}
