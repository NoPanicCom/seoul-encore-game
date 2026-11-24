import { CITY_BLOCKS } from './city-grid.js';

const PARTICLES = 216;
const SKY_RADIUS = 108;
const SKY_VERTEX = `
  precision highp float;
  attribute vec3 position;
  uniform mat4 worldViewProjection;
  varying vec3 direction;
  void main() {
    direction = position;
    vec4 clip = worldViewProjection * vec4(position, 1.0);
    gl_Position = clip.xyww;
  }`;

const NOISE = `
  float seed(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 cell = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(seed(cell), seed(cell + vec2(1.0,0.0)), f.x),
      mix(seed(cell + vec2(0.0,1.0)), seed(cell + 1.0), f.x), f.y);
  }`;

const SKY_FRAGMENT = `
  precision highp float;
  varying vec3 direction;
  uniform vec3 sun;
  uniform vec3 moon;
  uniform vec4 light;
  uniform vec4 clouds;
  ${NOISE}
  void main() {
    vec3 dir = normalize(direction);
    float height = max(0.0, dir.y);
    float night = light.x;
    float daylight = light.y;
    float twilight = light.z;
    vec3 horizon = mix(vec3(.74,.83,.95),vec3(.25,.30,.46),night);
    vec3 zenith = mix(vec3(.27,.56,.85),vec3(.042,.071,.169),night);
    vec3 sky = mix(horizon,zenith,pow(height,.54));
    float sunDot = clamp(dot(dir,sun),0.0,1.0);
    float moonDot = clamp(dot(dir,moon),0.0,1.0);
    float warmth = twilight * exp(-height*6.7) * (.33+.67*pow(sunDot,3.2));
    sky = mix(sky,vec3(.98,.55,.43),warmth*.88);
    sky = mix(sky,vec3(.56,.64,.74) * (1.0-night*.60),clouds.y*.57);

    vec2 celestial = vec2(atan(dir.x,dir.z)*.15915494, asin(dir.y)*.31830989);
    vec2 starGrid = celestial*vec2(258.0,143.0);
    vec2 starCell = floor(starGrid);
    float stars = seed(starCell);
    vec2 starOffset = vec2(seed(starCell+2.1),seed(starCell-7.0))*.58+.21;
    float starShape = 1.0-smoothstep(.032,.147,length(fract(starGrid)-starOffset));
    sky += vec3(.76,.85,1.0)*starShape*step(.956,stars)*smoothstep(.035,.18,height)*
      night*night*(.69+.27*sin(clouds.z*2.0+stars*188.0));

    float solarDisc = smoothstep(.99905,.99953,sunDot)*smoothstep(-.065,-.019,sun.y);
    sky += vec3(.96,.49,.23)*pow(sunDot,38.0)*twilight*.55;
    sky = mix(sky,vec3(1.0,.88,.62),solarDisc*(1.0-clouds.y*.63));

    vec3 moonShade = normalize(moon+vec3(.018,.012,0.0));
    float moonDisc = smoothstep(.99891,.99929,moonDot)*
      (1.0-smoothstep(.99904,.99945,dot(dir,moonShade)));
    float moonRise = smoothstep(-.031,.020,moon.y)*night;
    sky += vec3(.28,.43,.76)*pow(moonDot,80.0)*moonRise*.24;
    sky = mix(sky,vec3(.87,.94,1.0),moonDisc*moonRise);

    vec2 p = dir.xz/(height+.26)*1.64+vec2(clouds.w,clouds.w*.31);
    float cloudNoise = noise(p)*.58+noise(p*2.28+13.2)*.29+noise(p*4.7-6.3)*.13;
    float cloud = smoothstep(.75-clouds.x*.36,.88-clouds.x*.33,cloudNoise);
    cloud *= smoothstep(.005,.126,height);
    vec3 cloudColor = mix(vec3(.91,.94,.98),vec3(.22,.27,.43),night);
    cloudColor = mix(cloudColor,vec3(.43,.50,.63),clouds.y*.69);
    cloudColor = mix(cloudColor,vec3(.98,.65,.56),warmth*.75);
    sky = mix(sky,cloudColor,cloud*min(1.0,.58+.39*daylight+clouds.y*.17));
    gl_FragColor = vec4(sky,1.0);
  }`;

const LAMP_VERTEX = `
  precision highp float;
  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;
  attribute vec4 color;
  uniform mat4 worldViewProjection;
  uniform float night;
  varying vec3 surface;
  varying vec2 shape;
  varying float power;
  varying float distanceToEye;
  void main() {
    gl_Position = worldViewProjection * vec4(position,1.0);
    power = smoothstep(.25+color.a*.42,.46+color.a*.42,night);
    surface = color.rgb * (.87+.13*abs(normal.y));
    shape = uv*2.0-1.0;
    distanceToEye = gl_Position.w;
  }`;

const LAMP_FRAGMENT = `
  precision highp float;
  varying vec3 surface;
  varying vec2 shape;
  varying float power;
  varying float distanceToEye;
  uniform vec3 hazeColor;
  uniform float haze;
  void main() {
    vec3 lamp = mix(vec3(.28,.27,.33),surface,power);
    lamp = mix(lamp,hazeColor,1.0-exp(-distanceToEye*haze));
    gl_FragColor = vec4(lamp,1.0);
  }`;

const POOL_FRAGMENT = `
  precision highp float;
  varying vec3 surface;
  varying vec2 shape;
  varying float power;
  varying float distanceToEye;
  uniform float haze;
  void main() {
    float distanceFromLamp = length(shape);
    float intensity = (1.0-smoothstep(.0,1.0,distanceFromLamp));
    intensity *= intensity * exp(-distanceToEye*haze);
    gl_FragColor = vec4(surface, power*intensity*.54);
  }`;

const WEATHER_VERTEX = `
  precision highp float;
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 worldViewProjection;
  uniform vec3 wind;
  uniform vec3 volume;
  uniform vec3 right;
  uniform vec4 weather;
  varying vec2 corner;
  varying float opacity;
  void main() {
    float snow = weather.x;
    float storm = weather.y;
    float life = fract(position.y+weather.z*mix(.86+.35*storm,.22,snow)*(.8+position.x*.45));
    vec2 travel = position.xz + wind.xz*weather.w*mix(.52,1.0,snow);
    travel += vec2(sin(life*16.0+position.z*25.0),cos(life*12.0+position.x*15.0))*.046*snow;
    vec2 offset = fract(travel)-.5;
    vec3 p = vec3(offset.x*volume.x,(1.0-life)*volume.y,offset.y*volume.z);
    corner = uv*2.0-1.0;
    float size = .62+position.z*.78;
    p += right*(corner.x*mix(.020,.059,snow)+corner.y*mix(.060,0.0,snow))*size;
    p.y += corner.y*mix(.23,.052,snow)*size;
    opacity = smoothstep(.02,.16,life)*(1.0-smoothstep(.87,1.0,life));
    opacity *= (1.0-smoothstep(.34,.5,max(abs(offset.x),abs(offset.y))))*(.58+.42*position.x);
    gl_Position = worldViewProjection * vec4(p,1.0);
  }`;

const WEATHER_FRAGMENT = `
  precision highp float;
  uniform vec4 weather;
  varying vec2 corner;
  varying float opacity;
  void main() {
    float drop = (1.0-smoothstep(.0,1.0,abs(corner.x)))*(1.0-smoothstep(.25,1.0,abs(corner.y)));
    float flake = 1.0-smoothstep(.22,.94,length(corner));
    float alpha = mix(drop*(.55+.17*weather.y),flake*.93,weather.x);
    gl_FragColor = vec4(mix(vec3(.72,.88,1.0),vec3(.96,.98,1.0),weather.x),opacity*alpha);
  }`;

const MIST_VERTEX = `
  precision highp float;
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 worldViewProjection;
  uniform float aerial;
  varying vec2 shape;
  void main() {
    shape = uv;
    vec3 ground = vec3(position.x*2.3,position.z*.45+11.0,position.y*18.0-21.0);
    gl_Position = worldViewProjection*vec4(mix(position,ground,aerial),1.0);
  }`;

const MIST_FRAGMENT = `
  precision highp float;
  varying vec2 shape;
  uniform vec3 tint;
  uniform float drift;
  uniform float aerial;
  ${NOISE}
  void main() {
    vec2 edge = abs(shape*2.0-1.0);
    float mask = (1.0-smoothstep(.24,1.0,edge.x))*(1.0-smoothstep(.07,1.0,edge.y));
    float wisps = noise(vec2(shape.x*5.0+drift,shape.y*2.3));
    gl_FragColor = vec4(tint,mask*(.095+wisps*.20)*(1.0+aerial*.34));
  }`;

function shader(B, scene, name, vertexSource, fragmentSource, attributes, uniforms, transparent = false) {
  const material = new B.ShaderMaterial(name,scene,{vertexSource,fragmentSource},{
    attributes, uniforms: ['worldViewProjection', ...uniforms],
    needAlphaBlending: transparent,
  });
  material.backFaceCulling = false;
  material.disableDepthWrite = transparent;
  return material;
}

function geometry() {
  return { positions:[], normals:[], uvs:[], colors:[], indices:[] };
}

function quad(data, positions, normal = [0,1,0], color = [1,1,1,1]) {
  const offset = data.positions.length/3;
  data.positions.push(...positions.flat());
  data.uvs.push(0,0,0,1,1,1,1,0);
  for (let i=0;i<4;i++) {
    data.normals.push(...normal);
    data.colors.push(...color);
  }
  data.indices.push(offset,offset+1,offset+2,offset,offset+2,offset+3);
}

function mesh(B, scene, parent, name, material, data) {
  const part = new B.Mesh(name,scene);
  const vertices = new B.VertexData();
  Object.assign(vertices,data);
  vertices.applyToMesh(part);
  part.parent = parent;
  part.material = material;
  part.isPickable = false;
  return part;
}

function makeLamps(B, scene, root, materials) {
  const lenses = geometry();
  const pools = geometry();
  let count = 0;
  for (const {x,z,row,column} of CITY_BLOCKS) {
    for (const side of [-1,1]) for (const edge of [-1,1]) {
      const lx = x+side*11.76;
      const lz = z+edge*(8.74+.252);
      const near = Math.abs(column-2)+Math.abs(row-2);
      const delay = ((row*23+column*17+side*5+edge*7+55)%19)/19*.68 + near*.07;
      const color = [1,.78,.46,delay];
      const y = 2.391, w = .077, d = .082, h = .029;
      quad(lenses,[[lx-w,y-h,lz-d],[lx-w,y-h,lz+d],[lx+w,y-h,lz+d],[lx+w,y-h,lz-d]],[0,-1,0],color);
      quad(lenses,[[lx-w,y-h,lz-d],[lx-w,y+h,lz-d],[lx+w,y+h,lz-d],[lx+w,y-h,lz-d]],[0,0,-1],color);
      quad(lenses,[[lx-w,y-h,lz+d],[lx-w,y+h,lz+d],[lx+w,y+h,lz+d],[lx+w,y-h,lz+d]],[0,0,1],color);
      quad(lenses,[[lx-w,y-h,lz-d],[lx-w,y+h,lz-d],[lx-w,y+h,lz+d],[lx-w,y-h,lz+d]],[-1,0,0],color);
      quad(lenses,[[lx+w,y-h,lz-d],[lx+w,y+h,lz-d],[lx+w,y+h,lz+d],[lx+w,y-h,lz+d]],[1,0,0],color);
      const pz = lz+.52*edge, py = .020;
      quad(pools,[[lx-2.38,py,pz-2.75],[lx-2.38,py,pz+2.75],[lx+2.38,py,pz+2.75],[lx+2.38,py,pz-2.75]],
        [0,1,0],[1,.65,.32,delay]);
      count++;
    }
  }
  const lensMesh = mesh(B,scene,root,'City street lamp lenses',materials.lamps,lenses);
  const poolMesh = mesh(B,scene,root,'City street lamp pools',materials.pools,pools);
  lensMesh.metadata = {count,level:0};
  poolMesh.metadata = {count,level:0};
  return {lensMesh,poolMesh};
}

function makeWeather(B, scene, root, materials) {
  const flakes = geometry();
  const fog = geometry();
  for (let i=0;i<PARTICLES;i++) {
    const point = [(i*.754877666)%1,(i*.569840291+.33)%1,(i*.438579021+.71)%1];
    quad(flakes,[point,point,point,point]);
  }
  for (const [x,z,y,angle] of [[0,-14,.19,.1],[-5,5,.08,.57],[4,20,.36,-.72]]) {
    const dx = Math.cos(angle)*33, dz = Math.sin(angle)*33;
    quad(fog,[[x-dx,y,z-dz],[x-dx,y+3.85,z-dz],[x+dx,y+3.85,z+dz],[x+dx,y,z+dz]]);
  }
  const particles = mesh(B,scene,root,'City weather particles',materials.weather,flakes);
  const mist = mesh(B,scene,root,'City drifting fog',materials.mist,fog);
  particles.alwaysSelectAsActiveMesh = true;
  mist.alwaysSelectAsActiveMesh = true;
  particles.metadata = {weather:'clear',count:PARTICLES};
  particles.alphaIndex = 15;
  mist.alphaIndex = 11;
  return {particles,mist};
}

const CLOUD_COVER = {clear:.20,cloudy:.69,fog:.62,rain:.86,snow:.83,storm:1};
const HAZE = {clear:0,cloudy:.10,fog:.71,rain:.38,snow:.33,storm:.78};

export function createCityAtmosphere(B, scene, cityParent) {
  const root = new B.TransformNode('City atmosphere',scene);
  root.parent = cityParent;
  const materials = {
    sky: shader(B,scene,'City sky gradient',SKY_VERTEX,SKY_FRAGMENT,['position'],['sun','moon','light','clouds']),
    lamps: shader(B,scene,'City lamp glow',LAMP_VERTEX,LAMP_FRAGMENT,['position','normal','uv','color'],['night','haze','hazeColor']),
    pools: shader(B,scene,'City sidewalk lighting',LAMP_VERTEX,POOL_FRAGMENT,['position','normal','uv','color'],['night','haze'],true),
    weather: shader(B,scene,'City drifting precipitation',WEATHER_VERTEX,WEATHER_FRAGMENT,['position','uv'],['wind','volume','right','weather'],true),
    mist: shader(B,scene,'City low fog',MIST_VERTEX,MIST_FRAGMENT,['position','uv'],['tint','drift','aerial'],true),
  };
  materials.sky.disableDepthWrite = true;
  materials.sky.depthFunction = B.Constants.LEQUAL;
  const sky = B.MeshBuilder.CreateSphere('City sky',{diameter:2*SKY_RADIUS,segments:14},scene);
  sky.parent = root;
  sky.material = materials.sky;
  sky.isPickable = false;
  sky.alwaysSelectAsActiveMesh = true;
  sky.metadata = {};
  const {lensMesh,poolMesh} = makeLamps(B,scene,root,materials);
  const {particles,mist} = makeWeather(B,scene,root,materials);
  poolMesh.alphaIndex = 2;
  const sun = new B.Vector3(), moon = new B.Vector3();
  const celestialLight = new B.Vector4(), skyClouds = new B.Vector4();
  const tint = new B.Vector3(), volume = new B.Vector3(), right = new B.Vector3();
  const wind = new B.Vector3(.88,0,.37), particleWeather = new B.Vector4();
  let time = 0;
  let drift = 0;
  const cameraLocal = new B.Vector3();
  const forward = new B.Vector3();
  const facing = new B.Vector3(0,0,scene.useRightHandedSystem ? -1 : 1);

  function update(sample, dt, playerLocalX, playerZ, aerial) {
    const { hour, daylight, night, weather, windKph = 0, sunriseHour = 6, sunsetHour = 18 } = sample;
    time += dt;
    const windSpeed = Math.min(58, Math.max(0, windKph));
    drift += dt*(.015+windSpeed*.0017);
    const dayHours = sunsetHour-sunriseHour;
    const sinceSunrise = (hour-sunriseHour+24)%24;
    const angle = sinceSunrise <= dayHours ? sinceSunrise*Math.PI/dayHours :
      Math.PI+(sinceSunrise-dayHours)*Math.PI/(24-dayHours);
    sun.set(Math.cos(angle)*.78,Math.sin(angle)*.88,-.67).normalize();
    moon.set(-Math.cos(angle)*.68,-Math.sin(angle)*.86,-.61).normalize();
    const twilight = Math.exp(-Math.abs(Math.sin(angle))*5.8);
    const haze = HAZE[weather];
    celestialLight.set(night,daylight,twilight,0);
    skyClouds.set(CLOUD_COVER[weather],haze,time,drift);
    materials.sky.setVector3('sun',sun).setVector3('moon',moon).setVector4('light',celestialLight).setVector4('clouds',skyClouds);
    Object.assign(sky.metadata,{hour,daylight,night,weather,
      sunVisible:sun.y>-.065,moonVisible:moon.y>-.031&&night>.08,starsVisible:night>.31});

    tint.set(.50-.28*night,.59-.31*night,.73-.32*night);
    materials.lamps.setFloat('night',night).setFloat('haze',.002+haze*.021).setVector3('hazeColor',tint);
    materials.pools.setFloat('night',night).setFloat('haze',.001+haze*.017);
    poolMesh.setEnabled(night>.25);
    lensMesh.metadata.level = night;
    poolMesh.metadata.level = night;

    const camera = scene.activeCamera;
    if (camera) {
      camera.position.subtractToRef(cityParent.getAbsolutePosition(),cameraLocal);
      sky.position.copyFrom(cameraLocal);
      const cameraDirection = camera.getDirection(B.Axis.X);
      right.set(cameraDirection.x,cameraDirection.y,cameraDirection.z);
      if (aerial) {
        forward.copyFrom(camera.getDirection(facing)).scaleInPlace(24);
        particles.position.copyFrom(cameraLocal).addInPlace(forward);
        particles.position.y -= 8.5;
      }
    }
    if (!aerial) particles.position.set(playerLocalX,.04,playerZ);
    volume.set(aerial?33:16,aerial?17:10,aerial?33:16);
    particleWeather.set(weather==='snow'?1:0,weather==='storm'?1:0,time,drift);
    materials.weather.setVector3('wind',wind).setVector3('volume',volume).setVector3('right',right).setVector4('weather',particleWeather);
    particles.metadata.weather = weather;
    particles.setEnabled(weather==='rain'||weather==='snow'||weather==='storm');
    mist.position.set(aerial?0:playerLocalX,0,aerial?0:playerZ);
    materials.mist.setFloat('drift',drift).setFloat('aerial',aerial?1:0).setVector3('tint',tint);
    mist.setEnabled(weather==='fog');
  }

  update({hour:12,daylight:1,night:0,weather:'clear',windKph:7},0,0,0,false);
  root.setEnabled(false);
  return {
    update,
    setActive: active => root.setEnabled(active),
    dispose() {
      root.dispose();
      for (const material of Object.values(materials)) material.dispose();
    },
  };
}
