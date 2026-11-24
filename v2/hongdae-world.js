export const DISTRICT_X = 40;
export const YG_GATE = { x: 2.65, z: 8.45 };
export const HONGDAE_ENTRY = { x: 0, z: 7 };
export const HONGDAE_EXIT = { x: -.65, z: 7.45 };
export const BOOTH = { x: -3, z: -2.5 };

const SHOP_FRONT = 3.6;
const SHOP_BACK = 8.26;
const SHOP_HALF_WIDTH = 2.94;
const SHOP_OPENING = 1.06;
const SHELF_X = 7.87;
const SHELF_HEIGHT = 1.06;
const SHELF_SLOTS = [
  { id: 'hammer', z: -2.23 },
  { id: 'white-star', z: -1.42 },
  { id: 'jisoo-cone', z: -.61 },
];

const SHOP_FURNITURE = [
  { minX: 7.54, maxX: 8.22, minZ: -2.68, maxZ: -.13 },
  { minX: 6.18, maxX: 6.90, minZ: .97, maxZ: 2.59 },
];

export const HONGDAE_CAMERA_WALLS = [
  { min: [3.55, 0, -3], max: [3.70, 3.7, -SHOP_OPENING] },
  { min: [3.55, 0, SHOP_OPENING], max: [3.70, 3.7, 3] },
  { min: [3.55, 2.7, -SHOP_OPENING], max: [3.70, 3.7, SHOP_OPENING] },
  { min: [SHOP_FRONT, 0, -3.12], max: [SHOP_BACK, 3.1, -SHOP_HALF_WIDTH] },
  { min: [SHOP_FRONT, 0, SHOP_HALF_WIDTH], max: [SHOP_BACK, 3.1, 3.12] },
  { min: [SHOP_BACK, 0, -3.12], max: [8.48, 3.1, 3.12] },
  { min: [-5.75, 0, -3.43], max: [-3.58, 3.1, -1.56] },
].map(({ min, max }) => ({ min: [DISTRICT_X + min[0], min[1], min[2]], max: [DISTRICT_X + max[0], max[1], max[2]] }));

export function districtArea(x) {
  return x > SHOP_FRONT ? 'minho' : 'hongdae';
}

export function districtWalkable(x, z, radius) {
  if (x < -3.6 + radius || x > SHOP_BACK - radius || z < -10 + radius || z > 12 - radius) return false;
  if (x < SHOP_FRONT - radius) return true;
  if (x <= SHOP_FRONT + radius && Math.abs(z) > SHOP_OPENING - radius) return false;
  if (Math.abs(z) > SHOP_HALF_WIDTH - radius) return false;
  return SHOP_FURNITURE.every(({ minX, maxX, minZ, maxZ }) =>
    x < minX - radius || x > maxX + radius || z < minZ - radius || z > maxZ + radius);
}

export function districtSpot(x, z, previous) {
  if (x > SHOP_FRONT) {
    if (x < 6.08 || x > 7.35) return null;
    const slot = SHELF_SLOTS.find(({ id, z: center }) => Math.abs(z - center) <= (previous === `shelf-${id}` ? .43 : .37));
    return slot ? `shelf-${slot.id}` : null;
  }
  const radius = (id, threshold) => previous === id ? threshold + .16 : threshold;
  if (Math.hypot(x - HONGDAE_EXIT.x, z - HONGDAE_EXIT.z) <= radius('hongdae-exit', 1.03)) return 'hongdae-exit';
  if (Math.hypot(x - BOOTH.x, z - BOOTH.z) <= radius('booth', .90)) return 'booth';
  return null;
}

export function createHongdaeWayfinder(B, scene) {
  const root = new B.TransformNode('Hongdae wayfinder', scene);
  root.position.set(YG_GATE.x, 0, YG_GATE.z);
  root.rotation.y = -.13;

  const metal = new B.StandardMaterial('Wayfinder housing', scene);
  metal.diffuseColor = new B.Color3(.22, .14, .29);
  metal.emissiveColor = new B.Color3(.07, .03, .10);
  metal.specularColor = new B.Color3(.25, .24, .35);

  const part = (name, settings, x, y, z) => {
    const mesh = B.MeshBuilder.CreateBox(name, settings, scene);
    mesh.parent = root;
    mesh.position.set(x, y, z);
    mesh.material = metal;
    mesh.isPickable = false;
    return mesh;
  };
  part('Hongdae sign post', { width: .082, height: 1.72, depth: .075 }, .52, .86, .015);
  part('Hongdae sign footing', { width: .24, height: .092, depth: .25 }, .52, .046, .015);
  part('Hongdae sign case', { width: 1.47, height: .64, depth: .095 }, .17, 1.63, .015);

  const texture = new B.DynamicTexture('Hongdae approach lettering', { width: 512, height: 224 }, scene, false);
  const ctx = texture.getContext();
  const gradient = ctx.createLinearGradient(0, 0, 512, 224);
  gradient.addColorStop(0, '#222039');
  gradient.addColorStop(1, '#482746');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 224);
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#ff9bd6';
  ctx.strokeRect(8, 8, 496, 208);
  ctx.fillStyle = '#ffe5fc';
  ctx.font = '800 65px system-ui, sans-serif';
  ctx.fillText('HONGDAE', 28, 101);
  ctx.font = '700 45px system-ui, sans-serif';
  ctx.fillText('홍대', 29, 178);
  ctx.strokeStyle = '#9deaff';
  ctx.lineWidth = 12;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(411, 159);
  ctx.lineTo(464, 159);
  ctx.moveTo(443, 136);
  ctx.lineTo(466, 159);
  ctx.lineTo(443, 182);
  ctx.stroke();
  texture.update();

  const lit = new B.StandardMaterial('Hongdae wayfinding light', scene);
  lit.disableLighting = true;
  lit.backFaceCulling = false;
  lit.diffuseColor = B.Color3.Black();
  lit.emissiveColor = B.Color3.Black();
  lit.emissiveTexture = texture;
  const board = B.MeshBuilder.CreatePlane('Hongdae lettering', { width: 1.43, height: .605 }, scene);
  board.parent = root;
  board.position.set(.17, 1.63, .067);
  board.material = lit;
  board.isPickable = false;
  return root;
}

export function addHongdaeProps(B, scene, anchor, createLightstick) {
  const props = [];
  try {
    for (const { id, z } of SHELF_SLOTS) {
      const stick = createLightstick(B, scene, id, `shelf-${id}`);
      props.push(stick);
      stick.root.parent = anchor;
      stick.root.position.set(SHELF_X, SHELF_HEIGHT + .106, z);
      stick.root.rotation.y = -Math.PI / 2;
      stick.root.scaling.setAll(1.24);
    }
    return props;
  } catch (error) {
    for (const prop of props) prop.dispose();
    throw error;
  }
}
