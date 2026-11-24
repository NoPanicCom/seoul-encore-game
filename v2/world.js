import {
  addHongdaeProps, BOOTH, createHongdaeWayfinder, districtArea, districtSpot, districtWalkable,
  DISTRICT_X, HONGDAE_CAMERA_WALLS, HONGDAE_ENTRY, YG_GATE,
} from './hongdae-world.js';
import { createLightstick, createPixel, HONGDAE_LIGHTSTICKS } from './hongdae-props.js';

import { createStreetStage } from './street-stage.js';

const PORTALS = [
  { low: 2.68, high: 3.38 },
  { low: -4.24, high: -3.78 },
];

const OPENING = 2.15;
const PLAYER_RADIUS = .30;
const WALK_SPEED = 2.68;
const WALK_CYCLE_METERS = .98;
const STANCE_PHASE = .55;
const STUDIO_Z = -10;
const NARI_X = .86;
const PLAZA_Z = 13;
const ARENA_START_Z = 23.3;
const ARENA_STAGE_Z = 27;
const ARENA_END_Z = 30.05;
const FOLLOW_GAP = .95;
const TAU = Math.PI * 2;
const MOVE_DURATION = 800;
const GREETING_DURATION = 1.48;
const DANCE_MOVES = new Set(['side', 'spin', 'heart', 'step', 'jump']);
const NEON_MATERIAL = /tube|filament|lettering/i;
const MODEL_URL = new URL('./models/', import.meta.url).href;

const JOINTS = [
  'hips', 'chest', 'head', 'L-hair', 'R-hair',
  'L-shoulder', 'R-shoulder', 'L-elbow', 'R-elbow', 'L-hand', 'R-hand',
  'L-hip', 'R-hip', 'L-knee', 'R-knee', 'L-foot', 'R-foot',
];

const OUTFITS = {
  rose: ['#f86091', '#ffd8da', '#6f3b70'],
  midnight: ['#5942ad', '#afa4fa', '#30234d'],
};
const OUTFIT_PARTS = ['Outfit', 'OutfitTrim', 'Trousers'];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function blendAngle(current, next, amount) {
  const difference = Math.atan2(Math.sin(next - current), Math.cos(next - current));
  return current + difference * amount;
}

function damping(rate, elapsed) {
  return 1 - Math.exp(-rate * elapsed);
}

function areaAt(z) {
  if (z >= ARENA_START_Z) return 'arena';
  if (z >= PLAZA_Z) return 'plaza';
  if (z > 3) return 'street';
  if (z > -4) return 'lobby';
  return 'practice';
}

function walkable(x, z, journey = false) {
  const furthest = journey ? ARENA_END_Z : PLAZA_Z - PLAYER_RADIUS;
  if (Math.abs(x) > 4.6 - PLAYER_RADIUS || z < -13 + PLAYER_RADIUS || z > furthest) return false;
  if (!journey && Math.hypot(x - NARI_X, z - STUDIO_Z) < .66) return false;
  if (Math.hypot(x - YG_GATE.x - .52, z - YG_GATE.z) < .32) return false;
  return Math.abs(x) <= OPENING - PLAYER_RADIUS || PORTALS.every(({ low, high }) =>
    z <= low - PLAYER_RADIUS || z >= high + PLAYER_RADIUS);
}

const CAMERA_WALLS = [
  { min: [-6.15, 0, -14.2], max: [-5.75, 5, 3.4] },
  { min: [5.75, 0, -14.2], max: [6.15, 5, 3.4] },
  { min: [-6, 0, -14.3], max: [6, 5, -13.8] },
  { min: [-12, 0, 30.32], max: [12, 8, 31.25] },
  { min: [-9.5, 0, 26.2], max: [-5.93, 6, 30.6] },
  { min: [5.93, 0, 26.2], max: [9.5, 6, 30.6] },
  ...PORTALS.flatMap(({ low, high }) => [
    { min: [-6.05, 0, low], max: [-OPENING, 5, high] },
    { min: [OPENING, 0, low], max: [6.05, 5, high] },
    { min: [-OPENING, 2.88, low], max: [OPENING, 5, high] },
  ]),
];

const CAMERA_PADDING = .17;

function cameraLimit(target, offset, walls = CAMERA_WALLS) {
  const origin = [target.x, target.y, target.z];
  const direction = [offset.x, offset.y, offset.z];
  let limit = 1;
  // Pad the architecture so the camera's near plane also clears each surface.
  for (const { min, max } of walls) {
    let enter = 0;
    let leave = limit;
    for (let axis = 0; axis < 3; axis++) {
      const lower = min[axis] - CAMERA_PADDING - origin[axis];
      const upper = max[axis] + CAMERA_PADDING - origin[axis];
      if (Math.abs(direction[axis]) < .0001) {
        if (lower > 0 || upper < 0) leave = -1;
        continue;
      }
      const a = lower / direction[axis];
      const b = upper / direction[axis];
      enter = Math.max(enter, Math.min(a, b));
      leave = Math.min(leave, Math.max(a, b));
      if (enter > leave) break;
    }
    if (enter <= leave) limit = Math.min(limit, enter);
  }
  return limit;
}

function color(B, hex) {
  return B.Color3.FromHexString(hex).toLinearSpace();
}

function addArenaLight(B, scene, actors) {
  const position = new B.Vector3(-2.6, 4.8, 23.6);
  const direction = new B.Vector3(0, .9, ARENA_STAGE_Z).subtract(position).normalize();
  const spot = new B.SpotLight('Arena spotlight', position, direction, Math.PI * .49, 2, scene);
  // Keep the shader's light list stable when the show starts or a replay opens directly on stage.
  spot.intensity = 0;
  spot.range = 14;
  spot.includedOnlyMeshes = actors;
  return spot;
}

function lightWorld(B, scene) {
  const sky = new B.HemisphericLight('Seoul evening', new B.Vector3(0, 1, .28), scene);
  sky.diffuse = new B.Color3(.82, .85, 1);
  sky.groundColor = new B.Color3(.46, .33, .44);
  sky.specular = new B.Color3(.45, .47, .62);
  sky.intensity = 1.04;

  const key = new B.DirectionalLight('Warm skylight', new B.Vector3(-.52, -.7, -.48), scene);
  key.diffuse = new B.Color3(1, .82, .77);
  key.intensity = 1.15;

  const rim = new B.DirectionalLight('Lavender bounce', new B.Vector3(.52, -.2, .67), scene);
  rim.diffuse = new B.Color3(.64, .57, 1);
  rim.intensity = .51;
  return rim;
}

function makeShadowMaterial(B, scene) {
  const texture = new B.DynamicTexture('Contact shadow', 64, scene, false);
  const context = texture.getContext();
  const gradient = context.createRadialGradient(32, 32, 2, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(20, 10, 26, .69)');
  gradient.addColorStop(.44, 'rgba(20, 10, 26, .46)');
  gradient.addColorStop(1, 'rgba(20, 10, 26, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  texture.hasAlpha = true;
  texture.update();

  const material = new B.StandardMaterial('Contact shadow', scene);
  material.diffuseTexture = texture;
  material.useAlphaFromDiffuseTexture = true;
  material.emissiveColor = new B.Color3(.08, .04, .10);
  material.disableLighting = true;
  material.disableDepthWrite = true;
  return material;
}

async function loadActor(B, scene, file, name, x, z, shadowMaterial) {
  const model = await B.SceneLoader.ImportMeshAsync('', MODEL_URL, file, scene);
  const byName = new Map([...model.meshes, ...model.transformNodes].map(node => [node.name, node]));
  const pivot = new B.TransformNode(name, scene);
  const rig = byName.get('rig-root');
  if (!rig) throw new Error(file + ' modelinde rig-root eksik');
  model.meshes[0].parent = pivot;
  pivot.position.set(x, 0, z);

  const jointNodes = new Map(JOINTS.map(jointName => {
    const node = byName.get(jointName);
    if (!node) throw new Error(file + ' modelinde eklem eksik: ' + jointName);
    node.rotationQuaternion = null;
    return [jointName, node];
  }));
  const joints = Object.fromEntries([...jointNodes].map(([jointName, node]) => [jointName, node.rotation]));
  const legs = Object.fromEntries(['L', 'R'].map(side => {
    const upper = -jointNodes.get(side + '-knee').position.y;
    const lower = -jointNodes.get(side + '-foot').position.y;
    if (upper <= 0 || lower <= 0) throw new Error(file + ' modelinde bacak eklemleri geçersiz');
    return [side, { upper, lower }];
  }));
  const materials = new Map(model.meshes.flatMap(mesh => mesh.material ? [[mesh.material.name, mesh.material]] : []));
  for (const mesh of model.meshes) mesh.isPickable = false;
  const shadow = B.MeshBuilder.CreateGround(name + ' shadow', { width: 1.12, height: .93 }, scene);
  shadow.material = shadowMaterial;
  shadow.isPickable = false;

  const wand = byName.get('wand');
  const jacket = model.meshes.filter(mesh => mesh.name.startsWith('Jacket-'));
  if (wand) wand.setEnabled(false);
  const hips = byName.get('hips');

  return {
    pivot, joints, legs, materials, wand, jacket, shadow, hips, meshes: model.meshes,
    hipHeight: hips.position.y,
    height: 0,
    offsetX: 0,
    offsetZ: 0,
    yaw: name === 'player' ? Math.PI : 0,
    skeletonYaw: 0,
    idlePhase: name === 'player' ? 0 : .42,
    walkCycle: 0,
    x, z,
  };
}

function walkingLeg({ upper, lower }, phase, height, strideScale) {
  const stride = WALK_CYCLE_METERS * STANCE_PHASE * strideScale * .5;
  let forward;
  let lift = 0;
  let footPitch = 0;
  if (phase < STANCE_PHASE) {
    forward = stride * (1 - 2 * phase / STANCE_PHASE);
  } else {
    const swing = (phase - STANCE_PHASE) / (1 - STANCE_PHASE);
    const arc = Math.sin(swing * Math.PI);
    forward = stride * (2 * swing * swing * (3 - 2 * swing) - 1);
    lift = arc * .135 * strideScale;
    footPitch = Math.sin(swing * TAU) * .24 * strideScale;
  }

  const down = upper + lower + height - lift;
  const knee = Math.acos(clamp((down * down + forward * forward - upper * upper - lower * lower) /
    (2 * upper * lower), -1, 1));
  const hip = -Math.atan2(forward, down) - Math.atan2(lower * Math.sin(knee), upper + lower * Math.cos(knee));
  return [hip, knee, 0, footPitch - hip - knee];
}

function animateActor(actor, style, time, elapsed, effort = 1) {
  const speed = elapsed ? damping(style === 'idle' ? 15 : 24, elapsed) : 1;
  const set = (name, x = 0, y = 0, z = 0) => {
    const rotation = actor.joints[name];
    rotation.x += (x - rotation.x) * speed;
    rotation.y += (y - rotation.y) * speed;
    rotation.z += (z - rotation.z) * speed;
  };

  let height = 0;
  let travelX = 0;
  let travelZ = 0;
  let turn = 0;
  let bodyTilt = Math.sin(time * 1.5) * .024;
  let bodyTwist = 0;
  let bodyPitch = .015;
  let leftArm = [0, .14, 0, .11];
  let rightArm = [0, .14, 0, .11];
  let leftLeg = [0, 0, 0];
  let rightLeg = [0, 0, 0];
  let hairSwing = Math.sin(time * 2.3) * .035;
  const beat = time * TAU;
  const hit = Math.sin(Math.PI * clamp(time, 0, 1));

  if (style === 'walk') {
    const stride = Math.sin(beat);
    const lift = Math.cos(beat);
    const strideScale = effort / (.5 + .5 * effort);
    height = -(.018 + .045 * lift * lift) * strideScale;
    bodyPitch = .075 * strideScale;
    bodyTwist = stride * .11 * strideScale;
    bodyTilt = lift * .026 * strideScale;
    hairSwing = stride * .14 * effort;
    leftArm = [lift * .31 * strideScale, .16, -.19, .11];
    rightArm = [-lift * .31 * strideScale, .16, -.19, .11];
    leftLeg = walkingLeg(actor.legs.L, time % 1, height, strideScale);
    rightLeg = walkingLeg(actor.legs.R, (time + .5) % 1, height, strideScale);
  } else if (style === 'greet') {
    const rise = clamp(Math.min(time / .22, (1 - time) / .23), 0, 1);
    const lift = rise * rise * (3 - 2 * rise);
    const wave = Math.sin((time - .22) * TAU * 3.5);
    bodyTilt = .06 * lift;
    bodyTwist = .10 * lift;
    rightArm = [.21 * lift, .14 + 1.46 * lift, .14 * lift,
      .11 + (1.27 + .29 * wave) * lift, (.10 + .22 * wave) * lift];
  } else if (style === 'side') {
    const sway = Math.sin(beat) * hit;
    travelX = .34 * sway;
    height = -.05 * Math.abs(sway);
    bodyTilt = -.21 * sway;
    bodyTwist = .22 * sway;
    leftLeg = [-.13 * hit, .22 * hit, .34 * Math.max(0, sway)];
    rightLeg = [-.13 * hit, .22 * hit, .34 * Math.max(0, -sway)];
    leftArm = [-.23, .32 + 1.04 * Math.max(0, sway), -.55, .18];
    rightArm = [-.23, .32 + 1.04 * Math.max(0, -sway), -.55, .18];
    hairSwing = -.32 * sway;
  } else if (style === 'spin') {
    turn = TAU * (time * time * (3 - 2 * time));
    height = .035 * hit;
    bodyTilt = -.12 * hit;
    bodyTwist = .3 * hit;
    leftArm = [-.42, .82 + .35 * hit, -.62, .3];
    rightArm = [-.26, .82 + .35 * hit, -.56, .3];
    leftLeg = [0, .13 * hit, 0];
    rightLeg = [-.34 * hit, .48 * hit, .13 * hit];
    hairSwing = .50 * hit;
  } else if (style === 'heart' || style === 'photo') {
    const raise = style === 'photo' ? 1 : Math.pow(hit, .4);
    height = -.027 * raise;
    bodyTilt = .06 * raise;
    bodyPitch = -.06 * raise;
    leftArm = [.38 * raise, .14 + 2.78 * raise, .12 * raise, .11 + 1.44 * raise];
    rightArm = [.38 * raise, .14 + 2.78 * raise, .12 * raise, .11 + 1.44 * raise];
    leftLeg = [-.13 * raise, .21 * raise, .06];
    rightLeg = [-.13 * raise, .21 * raise, .06];
  } else if (style === 'booth-photo') {
    bodyTilt = -.065;
    bodyTwist = .075;
    bodyPitch = -.055;
    leftArm = [-.18, .44, -.35, .46];
    rightArm = [.21, .96, .19, 1.30, -.08];
    leftLeg = [-.055, .11, .055];
    rightLeg = [0, .035, 0];
  } else if (style === 'step') {
    const step = Math.sin(beat) * hit;
    travelZ = .24 * hit;
    height = -.045 * hit;
    bodyTwist = step * .23;
    bodyPitch = .14 * hit;
    leftLeg = [-.67 * Math.max(0, step), .49 * Math.max(0, step), 0];
    rightLeg = [-.67 * Math.max(0, -step), .49 * Math.max(0, -step), 0];
    leftArm = [step * .64, .24 + .19 * hit, -.85 * hit, .19];
    rightArm = [-step * .64, .24 + .19 * hit, -.85 * hit, .19];
    hairSwing = step * .2;
  } else if (style === 'jump') {
    const flight = clamp((time - .16) / .69, 0, 1);
    const air = 4 * flight * (1 - flight);
    const prep = Math.max(0, 1 - Math.abs(time - .13) / .13);
    const land = Math.max(0, 1 - Math.abs(time - .87) / .13);
    const bend = .27 * air + .56 * (prep + land);
    height = .47 * air - .14 * (prep + land);
    bodyPitch = .18 * (prep + land) - .15 * air;
    leftArm = [-.32 - .40 * air, .14 + 1.68 * air, -.21, .22];
    rightArm = [-.32 - .40 * air, .14 + 1.68 * air, -.21, .22];
    leftLeg = [-bend, bend * 1.56, .10 * air];
    rightLeg = [-bend, bend * 1.56, .10 * air];
    hairSwing = -.28 * air + .14 * land;
  }

  set('hips', 0, bodyTwist * -.35, bodyTilt * .5);
  set('chest', bodyPitch, bodyTwist, bodyTilt);
  set('head', -bodyPitch * .66, -bodyTwist * .43, bodyTilt * -.46);
  set('L-hair', hairSwing, -bodyTwist, hairSwing * .28);
  set('R-hair', hairSwing, -bodyTwist, hairSwing * -.28);

  for (const [side, mirror, arm, leg] of [
    ['L', 1, leftArm, leftLeg], ['R', -1, rightArm, rightLeg],
  ]) {
    set(side + '-shoulder', arm[0], 0, mirror * arm[1]);
    set(side + '-elbow', arm[2], 0, mirror * arm[3]);
    set(side + '-hand', .12 * bodyTwist, 0, mirror * (-.06 + (arm[4] ?? 0)));
    set(side + '-hip', leg[0], 0, mirror * leg[2]);
    set(side + '-knee', leg[1], 0, 0);
    set(side + '-foot', leg[3] ?? -.42 * leg[1], 0, 0);
  }

  actor.height += (height - actor.height) * speed;
  actor.offsetX += (travelX - actor.offsetX) * speed;
  actor.offsetZ += (travelZ - actor.offsetZ) * speed;
  actor.skeletonYaw = blendAngle(actor.skeletonYaw, turn, speed);
  actor.hips.position.y = actor.hipHeight + Math.min(0, actor.height);
  const facingX = Math.sin(actor.yaw);
  const facingZ = Math.cos(actor.yaw);
  actor.pivot.position.set(
    actor.x + facingZ * actor.offsetX + facingX * actor.offsetZ,
    Math.max(0, actor.height),
    actor.z + facingZ * actor.offsetZ - facingX * actor.offsetX,
  );
  actor.pivot.rotation.y = actor.yaw + actor.skeletonYaw;
  actor.shadow.position.set(actor.pivot.position.x, .016, actor.pivot.position.z);
  const spread = 1 + Math.max(0, actor.height) * .45;
  actor.shadow.scaling.set(spread, 1, spread);
}

export async function createWorld(canvas, { onArea, onNear, onMove, onSpot } = {}) {
  const B = globalThis.BABYLON;
  if (!B) throw new Error('Babylon.js yüklenemedi');

  const engine = new B.Engine(canvas, true, {
    alpha: false,
    stencil: false,
    powerPreference: 'high-performance',
  });
  const scene = new B.Scene(engine);
  scene.useRightHandedSystem = true;
  scene.clearColor = new B.Color4(.077, .058, .128, 1);
  scene.fogMode = B.Scene.FOGMODE_EXP2;
  scene.fogDensity = .012;
  scene.fogColor = new B.Color3(.17, .12, .25);
  scene.skipPointerMovePicking = true;
  scene.imageProcessingConfiguration.exposure = 1.08;
  scene.imageProcessingConfiguration.contrast = 1.08;

  const camera = new B.FreeCamera('Third-person camera', new B.Vector3(0, 2.7, 14), scene);
  camera.fov = .86;
  camera.minZ = .045;
  camera.maxZ = 140;
  scene.activeCamera = camera;

  const rim = lightWorld(B, scene);
  const shadow = makeShadowMaterial(B, scene);
  const glow = new B.GlowLayer('Neon glow', scene, { mainTextureRatio: .36, blurKernelSize: 32 });
  glow.intensity = .30;
  let player;
  let nari;
  let city;
  let wayfinder;
  let pixel;
  let pixelShadow;
  const pixelPose = { x: -.76, z: 10.39, yaw: Math.PI };
  try {
    const [building, sofia, partner] = await Promise.all([
      B.SceneLoader.ImportMeshAsync('', MODEL_URL, 'yg.glb', scene),
      loadActor(B, scene, 'sofia.glb', 'player', 0, 10, shadow),
      loadActor(B, scene, 'nari.glb', 'nari', NARI_X, STUDIO_Z, shadow),
    ]);
    for (const mesh of building.meshes) mesh.isPickable = false;
    city = building.meshes[0];
    wayfinder = createHongdaeWayfinder(B, scene);
    player = sofia;
    nari = partner;
    pixel = createPixel(B, scene, 'pixel');
    pixel.place(pixelPose.x, pixelPose.z, pixelPose.yaw);
    pixelShadow = B.MeshBuilder.CreateGround('Pixel shadow', { width: .59, height: .45 }, scene);
    pixelShadow.material = shadow;
    pixelShadow.isPickable = false;
    rim.includedOnlyMeshes = [...player.meshes, ...nari.meshes];
    if (!player.wand || !player.materials.has('Wand')) throw new Error('Sofia modelinde ışık çubuğu eksik');
    if (!player.jacket.length) throw new Error('Sofia modelinde çıkarılabilir ceket eksik');
    for (const part of OUTFIT_PARTS) {
      if (!player.materials.has(part)) throw new Error('Sofia modelinde kostüm malzemesi eksik: ' + part);
    }
    for (const mesh of [...building.meshes, ...player.meshes]) {
      const name = mesh.material?.name;
      if (name && (NEON_MATERIAL.test(name) || name === 'Wand')) glow.addIncludedOnlyMesh(mesh);
    }
    await scene.whenReadyAsync();
  } catch (error) {
    engine.dispose();
    throw error;
  }

  const focus = new B.Vector3();
  const desiredFocus = new B.Vector3();
  const cameraOffset = new B.Vector3();
  let cameraYaw = 0;
  let cameraPitch = .29;
  let orbitYaw = 0;
  let orbitPitch = .23;
  let cameraDistance = 4.7;
  let inputX = 0;
  let inputY = 0;
  let time = 0;
  let discoveredMovement = false;
  let orbitAdjusted = false;
  let establishing = 1;
  let currentArea = areaAt(player.z);
  let currentSpot = null;
  let nearNari = false;
  let nariGreeted = false;
  let greetingEnds = 0;
  let exploration = null;
  let journey = null;
  let arena = null;
  let arenaPending = null;
  let hongdae = null;
  let hongdaePending = null;
  let districtVisit = null;
  let districtEpoch = 0;
  let festivalView = null;
  let lastWave = -10;
  const stageFocus = new B.Vector3(DISTRICT_X,1.34,-11.25);
  const handRotation = new B.Quaternion();
  const stickRotation = new B.Quaternion();
  let equippedStick = null;
  let wandVisible = false;
  let action = null;
  let photo = false;
  let lookPreview = null;
  let viewHeight = canvas.clientHeight;
  let disposed = false;
  const defaultWand = color(B, '#ff9acb');
  const spotlightWhite = B.Color3.White();
  let audienceTint = defaultWand;
  const handSticks = new Map();
  const originalOutfit = OUTFIT_PARTS.map(part => player.materials.get(part).albedoColor.clone());

  async function loadArena() {
    const model = await B.SceneLoader.LoadAssetContainerAsync(MODEL_URL, 'arena.glb', scene);
    let spotlight;
    try {
      if (disposed) throw new Error('Sahne kapatıldı');
      const neon = model.materials.find(material => material.name === 'Arena Glow');
      const crowd = model.materials.find(material => material.name === 'Crowd Sticks');
      if (!neon?.emissiveColor || !crowd?.emissiveColor) throw new Error('Konser sahnesinin ışık malzemeleri eksik');
      const glowMeshes = model.meshes.filter(mesh => {
        mesh.isPickable = false;
        return mesh.material === neon || mesh.material === crowd || NEON_MATERIAL.test(mesh.material?.name);
      });
      model.addAllToScene();
      for (const mesh of glowMeshes) glow.addIncludedOnlyMesh(mesh);
      spotlight = addArenaLight(B, scene, [...player.meshes, ...nari.meshes]);
      await scene.whenReadyAsync();
      if (disposed) throw new Error('Sahne kapatıldı');
      return {
        root: model.meshes[0], neon, crowd, spotlight,
        neonColor: neon.emissiveColor.clone(),
        crowdColor: crowd.emissiveColor.clone(),
        crowdPaint: crowd.albedoColor.clone(),
        crowdIntensity: crowd.emissiveIntensity,
      };
    } catch (error) {
      spotlight?.dispose();
      model.dispose();
      throw error;
    }
  }

  async function prepareArena() {
    if (disposed) throw new Error('Sahne kapatıldı');
    if (arena) return;
    if (!arenaPending) {
      arenaPending = loadArena().then(loaded => { arena = loaded; }).finally(() => { arenaPending = null; });
    }
    await arenaPending;
  }

  function addGlowingMeshes(meshes) {
    for (const mesh of meshes) {
      const emission = mesh.material?.emissiveColor;
      if (emission && (emission.r + emission.g + emission.b > .035)) glow.addIncludedOnlyMesh(mesh);
      mesh.isPickable = false;
    }
  }

  async function loadHongdae() {
    const model = await B.SceneLoader.LoadAssetContainerAsync(MODEL_URL, 'hongdae.glb', scene);
    let anchor;
    let props = [];
    try {
      if (disposed) throw new Error('Sahne kapatıldı');
      if (!model.meshes.some(mesh => mesh.getTotalVertices() > 0)) throw new Error('Hongdae çevre modeli boş');
      model.addAllToScene();
      anchor = new B.TransformNode('Hongdae district', scene);
      anchor.position.x = DISTRICT_X;
      model.populateRootNodes();
      for (const root of model.rootNodes) root.parent = anchor;
      const festival = createStreetStage(B, scene, anchor, glow);
      props = addHongdaeProps(B, scene, anchor, createLightstick);
      addGlowingMeshes(model.meshes);
      for (const prop of props) addGlowingMeshes(prop.meshes);
      await scene.whenReadyAsync();
      if (disposed) throw new Error('Sahne kapatıldı');
      anchor.setEnabled(false);
      return { anchor, festival };
    } catch (error) {
      for (const prop of props) prop.dispose();
      model.dispose();
      anchor?.dispose();
      throw error;
    }
  }

  function equipShopStick(id) {
    if (id !== null && !HONGDAE_LIGHTSTICKS.includes(id)) throw new RangeError('Işık çubuğu geçersiz: ' + id);
    if (id === equippedStick) return;
    if (id && !handSticks.has(id)) {
      const stick = createLightstick(B, scene, id, `equipped-${id}`);
      stick.root.parent = player.wand.parent;
      stick.root.position.copyFrom(player.wand.position);
      addGlowingMeshes(stick.meshes);
      handSticks.set(id, stick.root);
    }
    if (equippedStick) handSticks.get(equippedStick).setEnabled(false);
    equippedStick = id;
    if (id) handSticks.get(id).setEnabled(true);
    player.wand.setEnabled(!id && wandVisible);
  }

  function lightConcert(elapsed) {
    const phase = elapsed * TAU / .465;
    const pulse = .5 + .5 * Math.cos(phase);
    arena.neonColor.scaleToRef(.89 + pulse * .30, arena.neon.emissiveColor);
    arena.crowd.albedoColor.copyFrom(audienceTint);
    arena.crowd.emissiveColor.copyFrom(audienceTint);
    arena.crowd.emissiveIntensity = 1.05 + .42 * pulse;
    arena.spotlight.intensity = .62 + .26 * pulse;
    B.Color3.LerpToRef(spotlightWhite, audienceTint, .30, arena.spotlight.diffuse);
  }

  function updateCamera(elapsed, cardCapture = false) {
    if (festivalView) {
      const aspect = engine.getRenderWidth() / engine.getRenderHeight();
      camera.fov = 1.03;
      const distance = Math.max(5.4, 5.55 / (2 * Math.tan(camera.fov / 2) * aspect));
      camera.position.set(DISTRICT_X + .24, 2.36, -11.25 + distance);
      camera.setTarget(stageFocus);
      return;
    }
    const smoothing = elapsed ? damping(13, elapsed) : 1;
    const aspect = engine.getRenderWidth() / engine.getRenderHeight();
    const portrait = aspect < .85;
    const staged = exploration !== null;
    const shortLandscape = !portrait && viewHeight <= 560;
    const reveal = !districtVisit && !journey && !discoveredMovement && !orbitAdjusted && !lookPreview && !staged;
    const opening = clamp((time - .82) / 1.60, 0, 1);
    const wideShot = reveal ? 1 - .65 * opening * opening * (3 - 2 * opening) : 0;
    establishing += (wideShot - establishing) * (elapsed ? damping(4.6, elapsed) : 1);
    const panorama = !districtVisit && journey && !orbitAdjusted && !lookPreview ?
      clamp(Math.min((player.z - 12.5) / 3, (25.3 - player.z) / 3), 0, 1) : 0;
    const districtWide = districtVisit && !orbitAdjusted && !lookPreview && districtArea(player.x - DISTRICT_X) === 'hongdae' ?
      clamp((player.z - 1.2) / 4.4, 0, 1) : 0;
    const shelfView = districtVisit && currentSpot?.startsWith('shelf-') && !orbitAdjusted && !lookPreview && !inputX && !inputY;

    camera.fov = staged ? (portrait || cardCapture ? .88 : .77) :
      (portrait ? 1.04 + .25 * establishing + .22 * panorama + .13 * districtWide :
        .84 + .14 * establishing + .13 * panorama + .08 * districtWide);
    let distance = portrait ? 4.7 : 4.45;

    if (staged) {
      const stage = exploration.venue === 'arena';
      const side = stage ? -1 : 1;
      const compactPhoto = photo && portrait && !cardCapture ? clamp((800 - viewHeight) / 120, 0, 1) : 0;
      const aimHeight = cardCapture ? .86 : photo ? (portrait ? .42 - .27 * compactPhoto : .37) : .74;
      desiredFocus.set(shortLandscape && !cardCapture ? side * 1.05 : 0, aimHeight, stage ? ARENA_STAGE_Z : STUDIO_Z);
      cameraYaw = (stage ? Math.PI : 0) + (photo ? .13 : .04);
      cameraPitch = photo ? .18 : .21;
      const danceWidth = photo ? 2.36 : 2.88;
      distance = Math.max(photo ? 3.95 + 1.65 * compactPhoto : 4.25,
        danceWidth / (2 * Math.tan(camera.fov / 2) * aspect));
    } else {
      const indoors = districtVisit && districtArea(player.x - DISTRICT_X) === 'minho';
      const aimHeight = lookPreview && portrait ? (viewHeight < 720 ? .20 : .34) :
        1.16 + .62 * establishing + .56 * panorama + .24 * districtWide;
      distance += (portrait ? 4.7 : 3.4) * establishing + 3.2 * panorama + 1.12 * districtWide;
      if (indoors) distance = shelfView ? 3.65 : 3.25;
      desiredFocus.set(player.x + .48 * establishing + (shelfView ? .42 : 0), aimHeight, shelfView ? -1.38 : player.z);
      focus.x += (desiredFocus.x - focus.x) * smoothing;
      focus.y += (desiredFocus.y - focus.y) * smoothing;
      focus.z += (desiredFocus.z - focus.z) * smoothing;
      // At a jamb, interpolating between two valid positions can cross the corner.
      if (!canStep(focus.x, focus.z)) focus.copyFrom(desiredFocus);
      const desiredYaw = shelfView ? -1.34 : orbitYaw + .43 * establishing - .25 * panorama - .16 * districtWide;
      cameraYaw = blendAngle(cameraYaw, desiredYaw, smoothing);
      cameraPitch += (orbitPitch - .075 * establishing - cameraPitch) * smoothing;
    }
    if (staged) focus.copyFrom(desiredFocus);

    cameraOffset.set(
      Math.sin(cameraYaw) * Math.cos(cameraPitch) * distance,
      Math.sin(cameraPitch) * distance,
      Math.cos(cameraYaw) * Math.cos(cameraPitch) * distance,
    );
    const safeDistance = distance * cameraLimit(focus, cameraOffset, districtVisit ? HONGDAE_CAMERA_WALLS : undefined);
    cameraDistance = Math.min(safeDistance, cameraDistance + (safeDistance - cameraDistance) * smoothing);
    cameraOffset.scaleInPlace(cameraDistance / distance);
    camera.position.copyFrom(focus).addInPlace(cameraOffset);
    camera.setTarget(focus);
  }

  function showBoundaries() {
    const districtX = player.x - DISTRICT_X;
    const area = districtVisit ? districtArea(districtX) : areaAt(player.z);
    const distance = Math.hypot(player.x - nari.x, player.z - nari.z);
    const near = !districtVisit && (journey ? area === 'arena' && player.z >= (nearNari ? 25.45 : 25.7) &&
      Math.abs(player.x) <= (nearNari ? 2.4 : 2.2) && distance <= 2.75 :
      area === 'practice' && distance <= (nearNari ? 2.35 : 2.12));
    if (currentArea !== area) {
      currentArea = area;
      onArea?.(area);
    }
    if (nearNari !== near) {
      nearNari = near;
      if (near && !journey && !nariGreeted) {
        nariGreeted = true;
        greetingEnds = time + GREETING_DURATION;
      }
      onNear?.(near);
    }
    const closeToGate = area === 'street' && Math.hypot(player.x - YG_GATE.x, player.z - YG_GATE.z) <=
      (currentSpot === 'hongdae-enter' ? 1.26 : 1.06);
    const spot = districtVisit ? districtSpot(districtX, player.z, currentSpot) : closeToGate ? 'hongdae-enter' : null;
    if (spot !== currentSpot) {
      currentSpot = spot;
      onSpot?.(spot);
    }
  }

  function canStep(x, z, radius = PLAYER_RADIUS) {
    return districtVisit ? districtWalkable(x - DISTRICT_X, z, radius) : walkable(x, z, journey !== null);
  }

  function advanceActor(actor, deltaX, deltaZ, elapsed, radius = PLAYER_RADIUS) {
    const beforeX = actor.x;
    const beforeZ = actor.z;
    const steps = Math.max(1, Math.ceil(Math.hypot(deltaX, deltaZ) / .12));
    for (let step = 0; step < steps; step++) {
      const x = actor.x + deltaX / steps;
      const z = actor.z + deltaZ / steps;
      if (canStep(x, actor.z, radius)) actor.x = x;
      if (canStep(actor.x, z, radius)) actor.z = z;
    }
    const distance = Math.hypot(actor.x - beforeX, actor.z - beforeZ);
    if (distance > .0001) {
      const direction = Math.atan2(actor.x - beforeX, actor.z - beforeZ);
      actor.yaw = blendAngle(actor.yaw, direction, damping(20, elapsed));
    }
    return distance;
  }

  function recordTrail(distance) {
    journey.distance += distance;
    if (journey.distance - journey.trail.at(-1).distance < .14) return;
    const nearDoor = PORTALS.some(({ low, high }) => player.z > low - .72 && player.z < high + .72);
    const margin = nearDoor ? OPENING - PLAYER_RADIUS - .025 : 4.6 - PLAYER_RADIUS;
    const x = clamp(player.x + journey.side * .78, -margin, margin);
    journey.trail.push({ x, z: player.z, distance: journey.distance });
  }

  function followTrail(elapsed) {
    // Use the walked route through both doorways. A direct pursuit would cut across the jambs.
    let remaining = elapsed * WALK_SPEED * 1.18;
    let walked = 0;
    while (remaining > .0001 && journey.trail.length > 1) {
      const point = journey.trail[0];
      if (journey.distance - point.distance < FOLLOW_GAP) break;
      const dx = point.x - nari.x;
      const dz = point.z - nari.z;
      const distance = Math.hypot(dx, dz);
      if (distance < .045) {
        journey.trail.shift();
        continue;
      }
      const stride = Math.min(distance, remaining);
      const moved = advanceActor(nari, dx * stride / distance, dz * stride / distance, elapsed);
      if (moved < .0001) break;
      walked += moved;
      remaining -= stride;
    }
    return walked;
  }

  function move(elapsed) {
    if (!inputX && !inputY) return 0;

    const forwardX = -Math.sin(orbitYaw);
    const forwardZ = -Math.cos(orbitYaw);
    const deltaX = (inputX * -forwardZ + inputY * forwardX) * elapsed * WALK_SPEED;
    const deltaZ = (inputX * forwardX + inputY * forwardZ) * elapsed * WALK_SPEED;
    const moved = advanceActor(player, deltaX, deltaZ, elapsed);
    if (moved > .0001) {
      if (journey && !districtVisit) recordTrail(moved);
      if (!discoveredMovement) {
        discoveredMovement = true;
        onMove?.();
      }
    }
    return moved;
  }

  function animateWalk(actor, distance, elapsed) {
    const walking = distance > .0001;
    const effort = walking ? clamp(distance / (elapsed * WALK_SPEED), 0, 1) : 0;
    if (walking) actor.walkCycle = (actor.walkCycle + elapsed * WALK_SPEED / WALK_CYCLE_METERS * (.5 + .5 * effort)) % 1;
    animateActor(actor, walking ? 'walk' : 'idle', walking ? actor.walkCycle : time + actor.idlePhase, elapsed, effort);
  }

  function setPixelVisible(visible) {
    pixel.root.setEnabled(visible);
    pixelShadow.setEnabled(visible);
  }

  function placePixel(x, z, yaw, elapsed = 0, walking = false, posing = false) {
    pixel.step({ x, z, yaw, elapsed, walking, photo: posing });
    pixelShadow.position.set(x, .015, z);
    pixelShadow.rotation.y = yaw;
  }

  function followPixel(elapsed) {
    const visible = districtVisit !== null || areaAt(player.z) === 'street';
    setPixelVisible(visible);
    if (!visible) return;
    let moved = 0;
    if (elapsed && !lookPreview) {
      const facingX = Math.sin(player.yaw);
      const facingZ = Math.cos(player.yaw);
      const targetZ = player.z - .63 * facingZ;
      const sideX = player.x + .70 * facingZ - .63 * facingX;
      const sideZ = targetZ - .70 * facingX;
      const clearSide = canStep(sideX, sideZ, .18);
      const x = clearSide ? sideX : player.x;
      const z = clearSide ? sideZ : player.z;
      const dx = x - pixelPose.x;
      const dz = z - pixelPose.z;
      const distance = Math.hypot(dx, dz);
      if (distance > .11) {
        const stride = Math.min(elapsed * WALK_SPEED * 1.25, (distance - .075) * .66);
        moved = advanceActor(pixelPose, dx * stride / distance, dz * stride / distance, elapsed, .18);
      }
    }
    placePixel(pixelPose.x, pixelPose.z, pixelPose.yaw, elapsed, moved > .001);
  }

  function updateActors(elapsed) {
    if (districtVisit) {
      hongdae.festival.update(time, Boolean(festivalView), festivalView?.color ?? audienceTint);
      if (festivalView) {
        const phase = time-lastWave;
        animateActor(player, phase < .7 ? 'greet' : 'booth-photo', Math.min(1,phase/.7), elapsed);
        const stick = handSticks.get(equippedStick);
        stick.parent.computeWorldMatrix(true).decompose(undefined, handRotation);
        B.Quaternion.RotationYawPitchRollToRef(0,0,.12+.30*Math.sin(Math.min(.7,phase)*Math.PI/.7),stickRotation);
        handRotation.conjugateInPlace().multiplyToRef(stickRotation,stick.rotationQuaternion);
        return;
      }
    }
    if (exploration) {
      const now = performance.now();
      const active = action && now < action.start + action.duration;
      const progress = active ? clamp((now - action.start) / action.duration, 0, 1) : 0;
      const sofiaMove = active && action.actor !== 'nari' ? action.move : 'idle';
      const nariMove = active && action.actor !== 'sofia' ? action.move : 'idle';
      animateActor(player, photo ? 'photo' : sofiaMove, sofiaMove === 'idle' ? time : progress, elapsed);
      animateActor(nari, photo ? 'photo' : nariMove, nariMove === 'idle' ? time + .42 : progress, elapsed);
      if (exploration.venue === 'arena') lightConcert(photo ? 0 : (active ? now - action.start : now - exploration.startedAt) / 1000);
      return;
    }
    const moved = lookPreview ? 0 : move(elapsed);
    const followed = journey && !districtVisit && !lookPreview ? followTrail(elapsed) : 0;
    if (moved > .0001 || followed > .0001) showBoundaries();
    if (lookPreview) player.yaw = blendAngle(player.yaw, cameraYaw, elapsed ? damping(12, elapsed) : 1);
    if (!journey && nearNari) {
      nari.yaw = blendAngle(nari.yaw, Math.atan2(player.x - nari.x, player.z - nari.z), damping(9, elapsed));
    }
    animateWalk(player, moved, elapsed);
    followPixel(elapsed);
    if (districtVisit) return;
    if (!journey && time < greetingEnds) {
      animateActor(nari, 'greet', 1 - (greetingEnds - time) / GREETING_DURATION, elapsed);
    } else {
      animateWalk(nari, followed, elapsed);
    }
  }

  function resize() {
    viewHeight = canvas.clientHeight;
    const deviceScale = Math.min(globalThis.devicePixelRatio || 1, 1.5);
    const pixelBudget = 1_400_000;
    const renderScale = Math.min(deviceScale, Math.sqrt(pixelBudget / Math.max(1, canvas.clientWidth * viewHeight)));
    engine.setHardwareScalingLevel(1 / renderScale);
    engine.resize();
  }

  function setLookPreview(active) {
    if (exploration || active === Boolean(lookPreview)) return;
    if (active) {
      lookPreview = { yaw: player.yaw };
      inputX = inputY = 0;
    } else {
      player.yaw = lookPreview.yaw;
      lookPreview = null;
    }
  }

  function setDistrictVisible(visible) {
    hongdae.anchor.setEnabled(visible);
    city.setEnabled(!visible);
    wayfinder.setEnabled(!visible);
    arena?.root.setEnabled(!visible);
    nari.pivot.setEnabled(!visible);
    nari.shadow.setEnabled(!visible);
  }

  async function enterHongdae(destination = 'gate') {
    if (disposed) throw new Error('Sahne kapatıldı');
    if (districtVisit) return;
    if (destination !== 'gate' && destination !== 'booth') throw new RangeError('Hongdae konumu geçersiz: ' + destination);
    if (exploration || areaAt(player.z) !== 'street') throw new Error('Hongdae geçidi Seul sokağında');
    const epoch = districtEpoch;
    if (!hongdae) {
      if (!hongdaePending) {
        hongdaePending = loadHongdae().then(model => { hongdae = model; }).finally(() => { hongdaePending = null; });
      }
      await hongdaePending;
    }
    if (disposed) throw new Error('Sahne kapatıldı');
    if (districtVisit || epoch !== districtEpoch || exploration || areaAt(player.z) !== 'street') return;
    setLookPreview(false);
    districtVisit = {
      player: { x: player.x, z: player.z, yaw: player.yaw }, pixel: { ...pixelPose },
      orbitYaw, orbitPitch, cameraYaw, cameraPitch, cameraDistance, orbitAdjusted,
    };
    player.x = DISTRICT_X + (destination === 'booth' ? BOOTH.x + .35 : HONGDAE_ENTRY.x);
    player.z = destination === 'booth' ? BOOTH.z : HONGDAE_ENTRY.z;
    player.yaw = destination === 'booth' ? -Math.PI / 2 : Math.PI;
    Object.assign(pixelPose, { x: player.x - .38, z: player.z + .46, yaw: player.yaw });
    orbitYaw = cameraYaw = destination === 'booth' ? Math.PI / 2 : 0;
    orbitPitch = cameraPitch = .22;
    orbitAdjusted = false;
    inputX = inputY = 0;
    setDistrictVisible(true);
    updateActors(0);
    updateCamera(0);
    scene.render();
    showBoundaries();
  }

  function leaveHongdae() {
    districtEpoch++;
    if (!districtVisit) return;
    const saved = districtVisit;
    setLookPreview(false);
    districtVisit = null;
    Object.assign(player, saved.player);
    Object.assign(pixelPose, saved.pixel);
    ({ orbitYaw, orbitPitch, cameraYaw, cameraPitch, cameraDistance, orbitAdjusted } = saved);
    inputX = inputY = 0;
    setDistrictVisible(false);
    updateActors(0);
    updateCamera(0);
    scene.render();
    showBoundaries();
  }

  function startDance(venue = 'studio') {
    if (exploration) return;
    if (venue !== 'studio' && venue !== 'arena') throw new RangeError('Dans mekânı geçersiz: ' + venue);
    if (districtVisit) throw new Error('Hongdae’de prova sahnesi yok');
    const concert = venue === 'arena';
    if (concert && !arena) throw new Error('Konser sahnesi yüklenmedi');
    setLookPreview(false);
    greetingEnds = 0;
    exploration = {
      venue,
      startedAt: performance.now(),
      player: { x: player.x, z: player.z, yaw: player.yaw },
      nari: { x: nari.x, z: nari.z, yaw: nari.yaw },
    };
    const facing = concert ? Math.PI : 0;
    const side = concert ? -1 : 1;
    const centerZ = concert ? ARENA_STAGE_Z : STUDIO_Z;
    player.x = -.69 * side;
    player.z = centerZ + .02 * side;
    player.yaw = facing + .05;
    nari.x = .69 * side;
    nari.z = centerZ - .02 * side;
    nari.yaw = facing - .05;
    setPixelVisible(false);
    inputX = 0;
    inputY = 0;
    photo = false;
    action = null;
    if (concert) {
      lightConcert(0);
    }
    animateActor(player, 'idle', time, 0);
    animateActor(nari, 'idle', time + .42, 0);
    updateCamera(0);
    const area = areaAt(centerZ);
    if (currentArea !== area) {
      currentArea = area;
      onArea?.(area);
    }
  }

  function endDance() {
    if (!exploration) return;
    Object.assign(player, exploration.player);
    Object.assign(nari, exploration.nari);
    if (exploration.venue === 'arena') {
      arena.spotlight.intensity = 0;
      arena.neon.emissiveColor.copyFrom(arena.neonColor);
      arena.crowd.emissiveColor.copyFrom(arena.crowdColor);
      arena.crowd.albedoColor.copyFrom(arena.crowdPaint);
      arena.crowd.emissiveIntensity = arena.crowdIntensity;
    }
    exploration = null;
    action = null;
    photo = false;
    inputX = 0;
    inputY = 0;
    cameraYaw = orbitYaw;
    cameraPitch = orbitPitch;
    updateActors(0);
    updateCamera(0);
    showBoundaries();
  }

  function beginJourney() {
    if (!arena) throw new Error('Konser sahnesi yüklenmedi');
    if (journey) return;
    leaveHongdae();
    endDance();
    setLookPreview(false);
    if (areaAt(player.z) !== 'practice') {
      player.x = -.55;
      player.z = -9.15;
    }
    journey = {
      side: player.x <= nari.x ? 1 : -1,
      distance: 0,
      trail: [{ x: player.x, z: player.z, distance: 0 }],
    };
    player.yaw = 0;
    nari.yaw = 0;
    inputX = 0;
    inputY = 0;
    orbitYaw = cameraYaw = Math.PI;
    orbitPitch = cameraPitch = .23;
    orbitAdjusted = false;
    updateActors(0);
    updateCamera(0);
    showBoundaries();
  }

  function poseForPhoto() {
    startDance();
    photo = true;
    action = null;
  }

  function captureFrame(frameCamera, restoreCamera) {
    const frame = canvas.ownerDocument.createElement('canvas');
    frame.width = 360;
    frame.height = 440;
    engine.setSize(frame.width, frame.height);
    try {
      frameCamera();
      scene.render();
      frame.getContext('2d').drawImage(canvas, 0, 0);
      return frame.toDataURL('image/jpeg', .86);
    } finally {
      resize();
      restoreCamera();
      scene.render();
    }
  }

  function captureBoothPhoto() {
    if (!districtVisit || currentSpot !== 'booth') throw new Error('Fotoğraf çekmek için kabine yaklaş');
    const savedPlayer = { x: player.x, z: player.z, yaw: player.yaw };
    const savedCamera = { position: camera.position.clone(), rotation: camera.rotation.clone(), fov: camera.fov };
    const heldStick = handSticks.get(equippedStick);
    const heldRotation = heldStick?.rotationQuaternion;
    const heldEuler = heldStick?.rotation.clone();
    return captureFrame(() => {
      player.x = DISTRICT_X - 4.39;
      player.z = BOOTH.z + .20;
      player.yaw = Math.PI / 2 + .06;
      animateActor(player, 'booth-photo', time, 0);
      if (heldStick) {
        const handRotation = new B.Quaternion();
        heldStick.parent.computeWorldMatrix(true).decompose(undefined, handRotation);
        const facingCamera = B.Quaternion.RotationYawPitchRoll(Math.PI / 2, 0, .20);
        heldStick.rotationQuaternion = handRotation.conjugate().multiply(facingCamera);
      }
      placePixel(DISTRICT_X - 4.10, BOOTH.z - .39, Math.PI / 2 - .09, 0, false, true);
      camera.fov = .81;
      camera.position.set(DISTRICT_X - .96, 1.82, BOOTH.z);
      camera.setTarget(new B.Vector3(DISTRICT_X - 4.39, .94, BOOTH.z - .035));
    }, () => {
      if (heldStick) {
        heldStick.rotationQuaternion = heldRotation;
        if (!heldRotation) heldStick.rotation.copyFrom(heldEuler);
      }
      Object.assign(player, savedPlayer);
      animateActor(player, 'idle', time, 0);
      placePixel(pixelPose.x, pixelPose.z, pixelPose.yaw);
      camera.fov = savedCamera.fov;
      camera.position.copyFrom(savedCamera.position);
      camera.rotation.copyFrom(savedCamera.rotation);
    });
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  updateActors(0);
  updateCamera(0);
  scene.render();
  onArea?.(currentArea);
  onNear?.(false);
  onSpot?.(null);
  engine.runRenderLoop(() => {
    const elapsed = Math.min(.10, engine.getDeltaTime() / 1000);
    time += elapsed;
    updateActors(elapsed);
    updateCamera(elapsed);
    scene.render();
  });

  return {
    prepareArena,
    beginJourney,
    enterHongdae,
    leaveHongdae,
    equipShopStick,
    captureBoothPhoto,
    festivalView(active,hex) {
      if (active && !festivalView && districtVisit && currentSpot === 'festival') {
        const stick = handSticks.get(equippedStick);
        festivalView = {x:player.x, z:player.z, yaw:player.yaw, color:color(B,hex), rotation:stick.rotationQuaternion};
        stick.rotationQuaternion = B.Quaternion.Identity();
        player.x = DISTRICT_X - .67;
        player.z = -7.81;
        player.yaw = Math.PI;
        inputX = inputY = 0;
        placePixel(player.x-.49,player.z+.18,Math.PI);
      } else if (!active && festivalView) {
        const {x,z,yaw,rotation} = festivalView;
        Object.assign(player,{x,z,yaw});
        handSticks.get(equippedStick).rotationQuaternion = rotation;
        festivalView = null;
      }
      updateActors(0);
      updateCamera(0);
    },
    waveStick() {
      if (!festivalView) return;
      lastWave = time;
      hongdae.festival.wave(time);
    },
    setInput(x, y) {
      const length = Math.max(1, Math.hypot(x, y));
      inputX = x / length;
      inputY = y / length;
    },
    orbit(dx, dy) {
      if (exploration) return;
      orbitAdjusted = true;
      orbitYaw = (orbitYaw - dx * .008) % TAU;
      orbitPitch = clamp(orbitPitch + dy * .0055, -.05, .73);
    },
    startDance,
    dance(move, actor = 'both', durationMs = MOVE_DURATION) {
      if (!DANCE_MOVES.has(move)) throw new RangeError('Dans hareketi geçersiz: ' + move);
      if (actor !== 'sofia' && actor !== 'nari' && actor !== 'both') throw new RangeError('Dansçı geçersiz: ' + actor);
      startDance();
      photo = false;
      action = { move, actor, start: performance.now(), duration: clamp(durationMs, 300, 2200) };
    },
    endDance,
    outfit(choice) {
      const palette = OUTFITS[choice];
      if (choice !== 'default' && !Array.isArray(palette)) throw new RangeError('Kostüm geçersiz: ' + choice);
      for (const [index, part] of OUTFIT_PARTS.entries()) {
        const material = player.materials.get(part);
        material.albedoColor = palette ? color(B, palette[index]) : originalOutfit[index].clone();
      }
    },
    setJacket(worn) {
      for (const mesh of player.jacket) mesh.setEnabled(worn);
    },
    setLookPreview,
    setWand(hex) {
      wandVisible = Boolean(hex);
      player.wand.setEnabled(wandVisible && !equippedStick);
      audienceTint = hex ? color(B, hex) : defaultWand;
      if (hex) {
        const material = player.materials.get('Wand');
        material.albedoColor = audienceTint;
        material.emissiveColor = audienceTint.scale(1.35);
      }
    },
    poseForPhoto,
    capturePhoto() {
      poseForPhoto();
      updateActors(0);
      return captureFrame(() => updateCamera(0, true), () => updateCamera(0));
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      observer.disconnect();
      engine.stopRenderLoop();
      engine.dispose();
    },
  };
}
