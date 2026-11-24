import {SUMI_CAFE_ID} from './city-grid.js';
import {createSumi} from './sumi-model.js';

const WIDTH = 8.28;
const DEPTH = 7.43;
const BACK = -3.75;
const FRONT = 3.68;
const HEIGHT = 3.14;

const BOUNDS = Object.freeze({minX: -WIDTH / 2, maxX: WIDTH / 2, minZ: BACK, maxZ: FRONT});
const SPAWN = Object.freeze({x: 0, z: 2.95, yaw: Math.PI});
const EXIT = Object.freeze({x: 0, z: 3.52});
const STATION_Z = -1.82;
const CAMERA_WALLS = [
  {min: [-4.31, -.1, -3.91], max: [-4.12, 3.29, 3.88]},
  {min: [4.12, -.1, -3.91], max: [4.31, 3.29, 3.88]},
  {min: [-4.32, -.1, -3.94], max: [4.32, 3.29, -3.75]},
  {min: [-4.25, 3.13, -3.82], max: [4.25, 3.26, 3.73]},
];

// Each edition changes both the materials and the way the room is decorated.
const EDITIONS = [
  {room: '#dcc1ae', accent: '#f0b67d', floor: '#836158', display: '#f8ddbc', trim: 'slats'},
  {room: '#bfafd9', accent: '#c594f1', floor: '#605271', display: '#f2ddff', trim: 'arches'},
  {room: '#85a8b1', accent: '#7bdbe8', floor: '#496873', display: '#c9fbff', trim: 'tiles'},
  {room: '#b2c0a0', accent: '#a9d69f', floor: '#607d67', display: '#dff1d1', trim: 'planters'},
  {room: '#d4a4ab', accent: '#f69dba', floor: '#795b6b', display: '#ffdaea', trim: 'canopy'},
  {room: '#7e749f', accent: '#83a5fb', floor: '#45465f', display: '#cbd6ff', trim: 'neon'},
  {room: '#c6ae8b', accent: '#eac566', floor: '#785f60', display: '#fff0bd', trim: 'graphic'},
  {room: '#a9bdd5', accent: '#a3bdfa', floor: '#5e6685', display: '#e1ebff', trim: 'frames'},
  {room: '#c2a0b5', accent: '#e9879d', floor: '#754d66', display: '#ffccd4', trim: 'lozenges'},
  {room: '#a1c7bc', accent: '#80e1c0', floor: '#486b65', display: '#c7ffe6', trim: 'grids'},
];

const IVORY = '#fff0dc';
const INK = '#292336';
const METAL = '#55566d';
const GOLD = '#f0ba74';
const PAPER = '#f9e9da';
const LEAVES = ['#64896b', '#7aa275', '#a0ba83'];

function mix(from, to, amount) {
  const a = Number.parseInt(from.slice(1), 16);
  const b = Number.parseInt(to.slice(1), 16);
  const channels = [16, 8, 0].map(shift => {
    const c = (a >> shift) & 255;
    return Math.round(c + (((b >> shift) & 255) - c) * amount).toString(16).padStart(2, '0');
  });
  return '#' + channels.join('');
}

function maker(B, scene, root, palette) {
  const paints = [];
  const lights = [];
  const materials = [];
  const textures = [];
  const hitboxes = [];
  const shapes = {
    box: () => B.MeshBuilder.CreateBox('room block', {}, scene),
    orb: () => B.MeshBuilder.CreateSphere('room sphere', {diameter: 1, segments: 6}, scene),
    bud: () => B.MeshBuilder.CreateSphere('room detail', {diameter: 1, segments: 4}, scene),
    cylinder: () => B.MeshBuilder.CreateCylinder('room disk', {tessellation: 14}, scene),
    cone: () => B.MeshBuilder.CreateCylinder('room taper', {diameterTop: .44, diameterBottom: 1, tessellation: 15}, scene),
    torus: () => B.MeshBuilder.CreateTorus('room ring', {diameter: .83, thickness: .17, tessellation: 14}, scene),
  };

  function part(pick, color, x, y, z, width, height, depth, yaw = 0, roll = 0, target = paints) {
    const mesh = shapes[pick]();
    mesh.position.set(x, y, z);
    mesh.scaling.set(width, height, depth);
    mesh.rotation.set(0, yaw, roll);
    const rgb = B.Color3.FromHexString(color);
    const vertices = new Float32Array(mesh.getTotalVertices() * 4);
    for (let i = 0; i < vertices.length; i += 4) {
      vertices[i] = rgb.r;
      vertices[i + 1] = rgb.g;
      vertices[i + 2] = rgb.b;
      vertices[i + 3] = 1;
    }
    mesh.setVerticesData(B.VertexBuffer.ColorKind, vertices);
    target.push(mesh);
    return mesh;
  }

  function block(x, z, width, depth) {
    hitboxes.push({minX: x - width / 2, maxX: x + width / 2, minZ: z - depth / 2, maxZ: z + depth / 2});
  }

  function text(label, x, y, z, width, height, background = INK, color = IVORY) {
    const texture = new B.DynamicTexture(label, {width: 512, height: 128}, scene, false);
    textures.push(texture);
    const pen = texture.getContext();
    pen.fillStyle = background;
    pen.fillRect(0, 0, 512, 128);
    pen.strokeStyle = color;
    pen.lineWidth = 3;
    pen.strokeRect(9, 9, 494, 110);
    pen.fillStyle = color;
    pen.font = '700 47px system-ui, sans-serif';
    pen.textAlign = 'center';
    pen.textBaseline = 'middle';
    pen.fillText(label, 256, 66, 472);
    texture.update();
    texture.uScale = -1;
    texture.uOffset = 1;
    const screen = B.MeshBuilder.CreatePlane(label, {width, height}, scene);
    const enamel = new B.StandardMaterial(label, scene);
    materials.push(enamel);
    enamel.disableLighting = true;
    enamel.diffuseColor = B.Color3.Black();
    enamel.emissiveColor = B.Color3.Black();
    enamel.emissiveTexture = texture;
    enamel.backFaceCulling = false;
    screen.material = enamel;
    screen.parent = root;
    screen.rotation.y = Math.PI;
    screen.position.set(x, y, z);
    screen.isPickable = false;
  }

  function combine(parts, label, luminous) {
    if (!parts.length) return;
    const merged = B.Mesh.MergeMeshes(parts, true, true);
    if (!merged) throw new Error('Oda geometrisi birleştirilemedi: ' + label);
    const surface = new B.StandardMaterial(label, scene);
    materials.push(surface);
    surface.diffuseColor = B.Color3.White();
    surface.specularColor.set(.13, .115, .14);
    if (luminous) {
      surface.disableLighting = true;
      surface.emissiveColor.set(.22, .20, .25);
    }
    merged.name = label;
    merged.material = surface;
    merged.parent = root;
    merged.isPickable = false;
  }

  return {
    ...palette,
    box: (...args) => part('box', ...args),
    orb: (...args) => part('orb', ...args),
    bud: (...args) => part('bud', ...args),
    cylinder: (...args) => part('cylinder', ...args),
    cone: (...args) => part('cone', ...args),
    torus: (...args) => part('torus', ...args),
    light(color, x, y, z, w, h, d, yaw = 0, roll = 0) {
      return part('box', color, x, y, z, w, h, d, yaw, roll, lights);
    },
    block,
    text,
    ready() {
      combine(paints, root.name + ' paint', false);
      combine(lights, root.name + ' lamps', true);
    },
    hitboxes,
    dispose() {
      for (const pending of [...paints, ...lights]) {
        if (!pending.isDisposed()) pending.dispose();
      }
      root.dispose();
      for (const texture of textures) texture.dispose();
      for (const surface of materials) surface.dispose();
    },
  };
}

function counter(s, x=0, z=-2.68, w=3.12, d=.70, h=.91) {
  s.box(s.wood, x, h/2, z, w-.08, h, d-.06);
  s.box(s.highlight, x, h+.028, z, w, .057, d);
  s.box(s.deep, x, .087, z, w-.03, .093, d-.01);
  s.box(s.accent, x, .63*h, z+d*.49, w-.27, .065, .022);
  s.block(x, z, w, d);
  return h+.055;
}

function table(s, x, z, w=.91, d=.70, h=.73, color=s.wood) {
  s.box(s.highlight, x, h, z, w, .067, d);
  for (const dx of [-1,1]) for (const dz of [-1,1]) {
    s.box(color, x+dx*(w/2-.11),h/2,z+dz*(d/2-.105),.085,h,.085);
  }
  s.block(x,z,w,d);
  return h+.036;
}

function seat(s,x,z,yaw=0,color=s.accent) {
  s.box(s.deep,x,.234,z,.43,.46,.38,yaw);
  s.box(color,x,.48,z,.53,.13,.50,yaw);
  s.box(color,x-Math.sin(yaw)*.21,.72,z-Math.cos(yaw)*.21,.54,.37,.12,yaw);
  s.block(x,z,.52,.49);
}

function sofa(s,x,z,w=1.83,color=s.accent) {
  s.box(s.deep,x,.23,z,w,.42,.65);
  s.box(color,x,.47,z,w-.13,.18,.72);
  s.box(color,x,.73,z-.28,w,.47,.18);
  for(const side of [-1,1]) s.box(color,x+side*(w*.5-.055),.57,z,.18,.31,.71);
  s.block(x,z,w,.74);
}

function shelf(s,x,z,{w=1.38,d=.38,h=1.97,levels=4,color=s.wood}={},fill) {
  for(const side of [-1,1])s.box(color,x+side*w/2,h/2,z,.063,h,d);
  s.box(s.deep,x,h/2,z-d*.46,w,h,.038);
  for(let row=0;row<=levels;row++){
    const y=.12+(h-.15)*row/levels;
    s.box(color,x,y,z,w,.052,d);
    if(row<levels) fill?.(x,y+.026,z,row,w,d);
  }
  s.block(x,z,w+.06,d);
}

function plant(s,x,z,h=.60,tint=LEAVES[1],y=0) {
  s.cylinder(s.wood,x,y+h*.18,z,h*.52,h*.36,h*.52);
  s.cylinder(s.deep,x,y+h*.36,z,h*.45,h*.025,h*.45);
  for(let i=0;i<5;i++){
    const angle=i*Math.PI*.4;
    const dx=Math.sin(angle), dz=Math.cos(angle);
    s.bud(i%2?LEAVES[0]:tint,x+dx*h*.13,y+h*.59+i*.025,z+dz*h*.13,.24*h,.66*h,.15*h,angle,dx*.57);
  }
}

function frame(s,x,y,z,w,h,index=0) {
  const picture=[s.accent,'#e4aa86','#c7b5e1','#9cccca','#e9bc77'][index%5];
  s.box(s.deep,x,y,z,w+.105,h+.105,.061);
  s.box(PAPER,x,y,z+.037,w,h,.021);
  s.box(picture,x-.11*w,y+.15*h,z+.057,w*.54,h*.65,.018,0,.18);
  s.orb(s.secondary,x+.16*w,y-.12*h,z+.071,w*.40,h*.39,.027);
  s.box(s.accent,x+.13*w,y+.19*h,z+.072,w*.39,h*.07,.020,0,-.55);
}

function fixtureWall(s, customSign = false) {
  s.box(s.floor,0,-.068,(BACK+FRONT)/2,WIDTH+.27,.13,DEPTH+.28);
  s.box(s.wall,0,HEIGHT/2,BACK-.068,WIDTH+.27,HEIGHT,.136);
  s.box(s.highlight,0,HEIGHT+.054,(BACK+FRONT)/2,WIDTH+.22,.113,DEPTH+.10);
  for(const side of [-1,1]){
    s.box(s.wall,side*(WIDTH/2+.07),HEIGHT/2,(BACK+FRONT)/2,.14,HEIGHT,DEPTH);
    s.box(s.wood,side*(WIDTH/2-.023),.17,(BACK+FRONT)/2,.060,.33,DEPTH-.12);
    s.box(s.deep,side*1.54,1.39,FRONT-.09,.13,2.78,.20);
    s.light(s.display,side*1.54,1.36,FRONT-.211,.031,2.28,.045);
  }
  s.box(s.deep,0,2.78,FRONT-.09,3.20,.14,.20);
  s.box(s.wood,0,.17,BACK+.021,WIDTH,.33,.070);
  s.box(s.wood,0,2.79,BACK+.025,WIDTH,.069,.08);
  for(const side of [-1,1]){
    s.box(s.secondary,side*2.47,1.60,BACK+.046,2.96,1.92,.078);
    s.box(s.deep,side*3.86,2.63,BACK+.10,.10,.35,.13);
    s.light(s.display,side*3.86,2.66,BACK+.19,.093,.28,.09);
  }
  for(let row=0;row<8;row++){
    const z=BACK+.46+row*.925;
    s.box(mix(s.floor,s.highlight,.17),0,-.001,z,WIDTH-.06,.003,.017);
  }
  for(const side of [-1,1]){
    s.box(s.secondary,side*1.02,.000,1.20,.028,.004,4.74);
    s.light(s.display,side*2.42,2.94,-1.02,.046,.045,2.72);
    s.box(s.deep,side*2.42,2.983,-1.02,.088,.044,2.81);
    for(const z of [-2.15,.15])s.box(s.deep,side*2.42,3.068,z,.032,.151,.034);
  }
  if (!customSign) s.box(s.deep,0,2.888,BACK+.115,2.65,.36,.105);
}

const decorators = {
  slats(s) {
    for(const side of [-1,1])for(let i=0;i<14;i++)s.box(s.wood,side*(1.19+i*.185),1.56,BACK+.123,.053,1.79,.066);
  },
  arches(s) {
    for(const side of [-1,1]){
      s.box(s.accent,side*2.54,1.36,BACK+.107,1.44,1.61,.060);
      s.orb(s.accent,side*2.54,2.16,BACK+.110,1.44,.97,.079);
      s.box(s.highlight,side*2.54,1.34,BACK+.15,1.16,1.5,.015);
    }
  },
  tiles(s) {
    for(const side of [-1,1])for(let i=0;i<7;i++)for(let j=0;j<5;j++){
      s.box((i+j)%4===0?s.accent:s.highlight,side*(1.42+i*.35),.81+j*.31,BACK+.115,.321,.283,.055);
    }
  },
  planters(s) {
    for(const side of [-1,1]){
      s.box(s.wood,side*2.53,2.33,BACK+.25,2.45,.083,.36);
      for(let i=0;i<5;i++)plant(s,side*(1.53+i*.49),BACK+.25,.32,s.accent,2.37);
    }
  },
  canopy(s) {
    for(const side of [-1,1])for(let i=0;i<10;i++){
      s.box(i%2?s.accent:s.highlight,side*(1.28+i*.276),2.21,BACK+.30,.267,.30,.36,0,side*.11);
    }
  },
  neon(s) {
    for(const side of [-1,1])for(let i=0;i<4;i++){
      s.light(i%2?s.display:s.accent,side*(1.50+i*.57),1.66,BACK+.155,.027,1.41,.034,0,side*(.22+i*.08));
    }
  },
  graphic(s) {
    for(const side of [-1,1])for(let i=0;i<6;i++){
      s.box(i%2?s.highlight:s.accent,side*(1.59+i*.40),1.55,BACK+.139,.18,1.49,.028,0,side*.41);
    }
  },
  frames(s) {
    for(const side of [-1,1])for(let i=0;i<3;i++)frame(s,side*(1.54+i*.87),1.98,BACK+.13,.57,.54,i);
  },
  lozenges(s) {
    for(const side of [-1,1])for(let i=0;i<5;i++){
      const x=side*(1.31+i*.56);
      s.box(s.accent,x,1.92,BACK+.13,.38,.38,.046,0,.785);
      s.box(s.highlight,x,1.38,BACK+.13,.29,.29,.046,0,.785);
    }
  },
  grids(s) {
    for(const side of [-1,1]) {
      for(let i=0;i<8;i++)s.box(s.wood,side*(1.23+i*.35),1.60,BACK+.128,.027,1.78,.04);
      for(let i=0;i<4;i++)s.box(s.wood,side*2.48,.82+i*.49,BACK+.16,2.60,.029,.04);
    }
  },
};

function cup(s,x,y,z,color=s.accent,r=.14) {
  s.cylinder(color,x,y+r*.44,z,r,r*.88,r);
  s.cylinder(s.deep,x,y+r*.90,z,r*.75,.012,r*.75);
  s.orb(color,x+r*.57,y+r*.49,z,r*.37,r*.48,r*.19);
}

function jars(s,x,y,z,count,pace=.17) {
  for(let i=0;i<count;i++){
    const color=[s.accent,s.secondary,s.highlight,s.display,GOLD][i%5];
    const h=.11+(i%3)*.057;
    const pos=x+i*pace;
    s.cylinder(color,pos,y+h/2,z,.108,h,.108);
    s.cylinder(PAPER,pos,y+h,z,.092,.029,.092);
  }
}

function flowers(s,x,y,z,size=.32,color=s.accent) {
  s.cylinder(s.wood,x,y+size*.21,z,size*.61,size*.42,size*.61);
  const petals = size > .44 ? 5 : 3;
  for(let i=0;i<petals;i++){
    const a=i*Math.PI*2/petals;
    const dx=Math.sin(a), dz=Math.cos(a);
    const h=size*(.55+i*.07);
    s.box(LEAVES[i%3],x+dx*size*.14,y+size*.42+h*.5,z+dz*size*.14,.020,h,.020,a,dx*.23);
    s.bud(i%2?color:s.display,x+dx*size*.21,y+size*.39+h,z+dz*size*.19,size*.29,size*.27,size*.31);
  }
}

function dishes(s,x,y,z,color=s.accent) {
  s.cylinder(PAPER,x,y+.022,z,.40,.044,.40);
  s.cylinder(color,x,y+.070,z,.31,.090,.31);
  s.cylinder(IVORY,x,y+.116,z,.25,.018,.25);
  s.box(GOLD,x+.12,y+.123,z,.025,.025,.23,.26);
}

function screen(s,x,y,z,w,h) {
  s.box(INK,x,y,z,w+.11,h+.115,.075);
  s.light(s.secondary,x,y,z+.048,w,h,.023);
  s.light(s.display,x,y+h*.42,z+.065,w*.89,.022,.014);
}

function speaker(s,x,y,z,large=false) {
  const width = large ? .42 : .28;
  const height = large ? .75 : .42;
  s.box(INK,x,y,z,width,height,.24);
  for(const level of [-1,1]){
    const disk=s.cylinder(METAL,x,y+level*height*.21,z+.13,width*.60,.04,width*.60);
    disk.rotation.x=Math.PI/2;
    s.orb(s.deep,x,y+level*height*.21,z+.153,width*.24,width*.24,.048);
  }
}

function cafe(s) {
  const y=counter(s);
  s.box(METAL,-.55,y+.28,-2.76,1.10,.52,.48);
  s.box(INK,-.55,y+.32,-2.493,.87,.23,.032);
  s.light(s.display,-.55,y+.46,-2.468,.70,.024,.025);
  for(const x of [-.80,-.42]){
    s.cylinder(GOLD,x,y+.22,-2.44,.055,.10,.055);
    cup(s,x,y,-2.44,IVORY);
  }
  s.cylinder(s.secondary,.66,y+.093,-2.59,.53,.19,.53);
  s.cylinder(IVORY,.66,y+.19,-2.59,.48,.055,.48);
  for(const x of [-2.52,2.52]){
    const top=table(s,x,.31);
    cup(s,x-.15,top,.34,s.highlight);
    cup(s,x+.13,top,.25);
    seat(s,x,-.48);
    seat(s,x,1.12,Math.PI);
    plant(s,x+Math.sign(x)*.69,-1.84,.73);
  }
}

function strawberryGlass(s, x, y, z) {
  s.cylinder('#c97789',x,y+.027,z,.102,.054,.102);
  s.cylinder('#f5c4ce',x,y+.075,z,.112,.062,.112);
  s.cylinder(IVORY,x,y+.111,z,.116,.037,.116);
  s.box('#d5758a',x+.03,y+.143,z,.008,.088,.008,0,.21);
}

const PIXEL_PERCH = Object.freeze({x: 1, z: -1.35, y: .64});

function pixelStool(s) {
  const {x, y, z} = PIXEL_PERCH;
  const legHeight = y - .116;
  for (const dx of [-.158,.158]) for (const dz of [-.156,.156]) {
    s.box('#82564b',x+dx,legHeight/2,z+dz,.055,legHeight,.055,0,-dx*.28);
    s.box('#a5755d',x+dx,.045,z+dz,.060,.09,.060);
  }
  s.box('#82564b',x,.155,z,.30,.042,.085);
  s.box('#82564b',x,.155,z,.085,.042,.30);
  s.cylinder('#c78b73',x,y-.106,z,.492,.060,.492);
  s.cylinder('#b8717c',x,y-.076,z,.506,.040,.506);
  s.orb('#dfa8aa',x,y-.038,z,.516,.076,.516);
  s.block(x,z,.52,.52);
}

function sumiCafe(s, cafeName) {
  const walnut='#7d5146';
  const clay='#b36f58';
  const ceramic='#fff0d2';
  const top=counter(s,0,-2.66,3.46,.78);
  for(let i=0;i<26;i++){
    const x=(i-12.5)*.123;
    s.box(i%3===0?'#c89263':'#ad795e',x,.414,-2.281,.038,.56,.043);
  }
  s.box('#eed2ab',0,.726,-2.247,3.35,.051,.047);
  s.box(clay,0,.157,-2.243,3.33,.055,.045);
  s.box(walnut,0,1.20,-3.58,3.25,.073,.26);
  s.box('#daa986',0,1.253,-3.72,3.38,.34,.033);
  for(let i=0;i<8;i++){
    cup(s, (i-3.5)*.302, 1.25, -3.56, [ceramic, '#d9b9a0','#b86d77'][i%3],.105);
  }

  s.box(walnut,0,2.07,BACK+.178,1.42,.38,.10);
  s.box('#3c2e37',0,2.07,BACK+.239,1.32,.30,.030);
  s.text(cafeName,-.097,2.071,BACK+.262,.98,.245,'#3c2e37','#ffdfb7');
  s.orb('#c36b71',.504,2.064,BACK+.269,.183,.178,.038,.22);
  s.orb('#ce7980',.514,2.022,BACK+.278,.130,.161,.029,.38);
  for (const [dx,dy] of [[-.046,.02],[.025,.037],[-.014,-.024],[.047,-.017],[.01,-.057]]) {
    s.bud('#f4bd9d',.506+dx,2.061+dy,BACK+.298,.014,.019,.013,.34);
  }
  for (const [dx,roll] of [[-.041,.76],[.0,.14],[.043,-.71]]) {
    s.bud('#a9ab76',.499+dx,2.153,BACK+.292,.044,.088,.022,roll);
  }

  s.box('#66505a',-1.11,top+.225,-2.67,.76,.44,.47);
  s.box(walnut,-1.11,top+.242,-2.405,.78,.43,.058);
  s.box('#342835',-1.11,top+.247,-2.368,.65,.28,.024);
  s.light('#ecb677',-1.11,top+.374,-2.347,.56,.025,.022);
  s.box(METAL,-1.11,top+.046,-2.43,.69,.062,.36);
  for(const x of [-1.30,-.98]){
    s.cylinder(GOLD,x,top+.206,-2.319,.038,.100,.038);
    cup(s,x,top+.072,-2.31,ceramic,.098);
  }

  s.cylinder(ceramic,1.09,top+.043,-2.64,.50,.07,.47);
  s.cylinder('#e3b389',1.09,top+.114,-2.64,.41,.13,.38);
  for (const [x,z] of [[.98,-2.60],[1.16,-2.59],[1.08,-2.72]]) {
    s.orb('#f2d8bf',x,top+.198,z,.18,.083,.18);
    s.orb('#cf7684',x,top+.24,z,.082,.091,.082);
  }
  strawberryGlass(s,.77,top,-2.44);
  strawberryGlass(s,1.40,top,-2.52);
  pixelStool(s);

  for (const side of [-1,1]) {
    const x=side*2.72;
    sofa(s,x,-.79,1.63,side<0?'#bd8f79':'#bb876f');
    const h=table(s,x,.28,1.04,.71,.71,walnut);
    cup(s,x-.17,h,.25,ceramic,.12);
    strawberryGlass(s,x+.19,h,.24);
    flowers(s,x+.31,h,.51,.29,'#d98b8e');
    seat(s,x,1.04,Math.PI,'#c68e71');
    plant(s,side*3.52,-2.27,.78,'#92a077');
    frame(s,side*2.68,1.97,BACK+.153,1.01,.69,side+1);
    s.cylinder(walnut,side*2.64,2.92,-.71,.046,.38,.046);
    s.cone('#d6a05f',side*2.64,2.73,-.71,.42,.23,.42);
    s.orb(IVORY,side*2.64,2.601,-.71,.26,.11,.26);
  }
  for (const x of [-.95,0,.95]) {
    s.cylinder(walnut,x,2.96,-2.53,.038,.34,.038);
    s.cone('#dfaf77',x,2.756,-2.53,.31,.17,.31);
    s.orb('#fff2ca',x,2.658,-2.53,.15,.103,.15);
  }
}

const SUMI_PALETTE = {
  wall: '#d5a98e',
  floor: '#8b675c',
  accent: '#d19082',
  display: '#ffe0ad',
  secondary: '#ae7d69',
  wood: '#82564b',
  highlight: '#f1d6ac',
  deep: '#593941',
};

function restaurant(s) {
  const y=counter(s);
  dishes(s,-.68,y,-2.67,s.accent);
  dishes(s,0,y,-2.67,'#d39d74');
  dishes(s,.68,y,-2.67,'#9cbc87');
  s.box(s.secondary,0,y+.41,-3.08,2.95,.083,.27);
  for(let i=0;i<7;i++)s.cylinder(PAPER,(i-3)*.37,y+.51,-3.08,.29,.14,.29);
  for(const x of [-2.48,2.48])for(const z of [.08,1.66]){
    const top=table(s,x,z,1.01,.64);
    dishes(s,x,top,z,s.accent);
    seat(s,x-.66,z,Math.PI/2,s.secondary);
    seat(s,x+.66,z,-Math.PI/2,s.secondary);
  }
  for(const x of [-2.48,2.48])s.orb(s.display,x,2.53,-.15,.38,.50,.38);
}

function bakery(s) {
  const y=counter(s,0,-2.66,3.32,.70,.86);
  s.box(s.wood,0,y+.48,-3.01,3.29,.063,.11);
  for(const x of [-1.58,-.51,.53,1.58])s.box(s.wood,x,y+.25,-2.66,.055,.49,.57);
  for(let i=0;i<7;i++){
    const x=(i-3)*.42;
    s.box(PAPER,x,y+.025,-2.64,.36,.042,.42);
    s.orb('#db9c5e',x,y+.117,-2.65,.27,.17,.27);
    s.orb(i%2?s.accent:'#fff0d9',x,y+.183,-2.64,.195,.063,.19);
  }
  s.box(METAL,-2.94,.93,-2.72,1.13,1.57,.78);
  screen(s,-2.94,1.03,-2.313,.75,.64);
  s.block(-2.94,-2.72,1.13,.78);
  shelf(s,2.92,-2.53,{},(x,y,z,row)=>{
    for(let i=0;i<4;i++)s.orb(row%2?'#c48657':'#f0b97e',x-.44+i*.29,y+.105,z,.21,.19,.28);
  });
  const top=table(s,2.43,.55,1.24,.67);
  s.cylinder(s.highlight,2.43,top+.10,.55,.60,.18,.60);
  s.orb(s.accent,2.43,top+.25,.55,.60,.18,.60);
}

function convenience(s) {
  const y=counter(s);
  screen(s,.62,y+.26,-2.66,.56,.35);
  s.box(METAL,.56,y+.044,-2.51,.63,.075,.32);
  jars(s,-1.11,y,-2.55,5);
  for(const x of [-2.59,2.59]) for(const z of [-.82,1.27]) {
    shelf(s,x,z,{w:1.78,d:.62,h:1.49,levels:3},(cx,top,cz,row)=>{
      for(let i=0;i<7;i++){
        const w=.17+(i%3)*.024;
        s.box([s.accent,IVORY,'#f0b475',s.display,s.secondary][(row+i)%5],
          cx-.66+i*.22,top+.11,cz+.05,w,.22,.21);
      }
    });
  }
}

function mannequin(s,x,y,z,color) {
  s.cylinder(s.deep,x,y+.041,z,.46,.082,.40);
  s.cylinder(METAL,x,y+.34,z,.07,.63,.07);
  s.cone(color,x,y+.52,z,.52,.39,.37);
  s.orb(color,x,y+.77,z,.39,.36,.23);
  s.orb(color,x-.23,y+.735,z,.18,.26,.19,0,.34);
  s.orb(color,x+.23,y+.735,z,.18,.26,.19,0,-.34);
  s.orb(PAPER,x,y+1.03,z,.18,.23,.17);
}

function fashion(s) {
  s.box(s.wood,0,.13,-2.70,2.98,.26,1.13);
  s.block(0,-2.70,2.98,1.13);
  for(let i=0;i<3;i++)mannequin(s,(i-1)*.83,.26,-2.68,[s.accent,'#bea9e6','#edc084'][i]);
  for(const x of [-2.68,2.68]){
    for(const side of [-1,1])s.box(METAL,x+side*.78,.88,-.30,.064,1.75,.11);
    s.box(METAL,x,1.75,-.30,1.57,.06,.08);
    for(let i=0;i<6;i++){
      const color=[s.highlight,s.accent,'#dca0aa','#9cbbd1'][i%4];
      const px=x-.63+i*.248;
      s.box(GOLD,px,1.66,-.30,.026,.17,.027);
      s.cone(color,px,1.22,-.33,.32,.56,.23,Math.PI/2);
    }
    s.block(x,-.30,1.68,.54);
    seat(s,x,1.82,0,s.secondary);
  }
}

function mirror(s,x,y,z,w,h) {
  s.box(s.deep,x,y,z,w+.19,h+.16,.095);
  s.box('#c9e6ec',x,y,z+.052,w,h,.022);
  s.box('#e3faf6',x-.12*w,y,z+.071,w*.11,h*.91,.014,0,-.29);
  for(const side of [-1,1])s.light(s.display,x+side*(w/2+.044),y,z+.084,.036,h+.049,.051);
}

function cosmetics(s) {
  const y=counter(s);
  mirror(s,0,1.78,-3.315,2.42,1.27);
  jars(s,-1.24,y,-2.71,6);
  for(let i=0;i<5;i++){
    const x=.25+i*.21;
    s.box(INK,x,y+.028,-2.65,.176,.062,.25);
    s.box(['#c47d99','#e699a5','#b879a3','#e5ac85','#cea5dc'][i],x,y+.065,-2.65,.135,.018,.18);
  }
  for(const side of [-1,1]){
    shelf(s,side*2.81,-.76,{w:1.39,d:.38,h:1.77},(x,y,z)=>jars(s,x-.43,y,z+.022,6,.165));
    seat(s,side*2.46,1.46,0,s.highlight);
  }
}

function florist(s) {
  const y=counter(s);
  flowers(s,-.79,y,-2.75,.52,s.accent);
  flowers(s,-.19,y,-2.61,.37,'#ebb589');
  s.box(PAPER,.57,y+.017,-2.61,.60,.033,.42,0,-.03);
  s.orb(s.accent,.69,y+.079,-2.64,.37,.12,.13);
  for(const x of [-2.73,2.73]){
    shelf(s,x,-.94,{w:1.70,d:.56,h:1.80,levels:3},(cx,top,z,row)=>{
      for(let i=0;i<4;i++)flowers(s,cx-.62+i*.39,top,z,.31+(i+row)%3*.06,[s.accent,'#edb78a','#c2a4d7'][i%3]);
    });
    flowers(s,x,0,1.37,.65,s.accent);
    s.block(x,1.37,.40,.40);
  }
}

function bookRow(s,x,y,z,w,row) {
  for(let i=0;i<10;i++){
    const h=.20+(i+row*2)%4*.035;
    const color=[s.accent,'#b1a3d3','#9dbca9','#e2b987','#bc887e',s.highlight][(i+row)%6];
    s.box(color,x-w*.43+i*w*.091,y+h*.49,z,.085,h,.24);
  }
}

function bookstore(s) {
  for(const x of [-2.81,2.81])for(const z of [-2.0,.50]){
    shelf(s,x,z,{w:1.63,d:.46,h:2.20,levels:5},(cx,y,cz,row,w)=>bookRow(s,cx,y,cz,w,row));
  }
  const top=table(s,0,-2.58,1.55,.65,.85);
  s.box(s.accent,0,top+.017,-2.54,.54,.035,.39);
  s.box(PAPER,-.143,top+.056,-2.51,.264,.042,.36,0,-.10);
  s.box(PAPER,.141,top+.056,-2.51,.264,.042,.36,0,.10);
  for(const x of [-2.05,2.05])seat(s,x,1.80,0,s.accent);
}

function records(s) {
  const y=counter(s);
  s.box(INK,-.42,y+.06,-2.68,.76,.117,.57);
  s.cylinder('#46374e',-.49,y+.133,-2.66,.42,.043,.42);
  s.cylinder(s.accent,-.49,y+.159,-2.66,.107,.018,.107);
  s.box(METAL,-.125,y+.165,-2.61,.041,.040,.29,.30);
  for(const x of [-2.73,2.73]){
    for(const z of [-1.51,.50]){
      const top=table(s,x,z,1.38,.62,.73);
      for(let i=0;i<6;i++){
        const color=[s.accent,s.secondary,s.highlight,'#d79d85'][(i+3)%4];
        s.box(color,x-.48+i*.19,top+.14,z,.17,.33,.063,0,.13*(i%3-1));
        s.orb(IVORY,x-.48+i*.19,top+.17,z+.038,.09,.08,.025);
      }
    }
    speaker(s,x,1.34,-3.16,true);
  }
  s.box(PAPER,.69,y+.20,-2.84,.46,.41,.046,0,.08);
  s.cylinder(s.secondary,.69,y+.20,-2.802,.24,.025,.24).rotation.x=Math.PI/2;
}

function microphone(s,x,y,z,color=s.accent) {
  s.cylinder(INK,x,y+.029,z,.26,.055,.26);
  s.cylinder(METAL,x,y+.45,z,.05,.89,.05);
  s.orb(color,x,y+.93,z,.15,.21,.14,0,-.25);
}

function karaoke(s) {
  s.box(s.wood,0,.098,-2.79,3.34,.195,1.21);
  s.block(0,-2.79,3.34,1.21);
  screen(s,0,1.88,-3.56,2.67,1.15);
  for(let bar=0;bar<4;bar++)s.light(bar%2?s.highlight:s.display,0,1.69+bar*.15,-3.486,1.84-(bar%2)*.45,.032,.025);
  for(const x of [-.56,.56])microphone(s,x,.19,-2.61);
  for(const x of [-2.65,2.65]){
    sofa(s,x,.28,1.76);
    speaker(s,x,1.11,-2.93,true);
    s.light(s.display,x,2.26,-2.87,.21,.23,.048,0,.785);
  }
}

function arcadeCabinet(s,x,z,color) {
  s.box(color,x,.74,z,.76,1.48,.55);
  s.box(INK,x,1.51,z,.71,.50,.39);
  screen(s,x,1.54,z+.22,.58,.36);
  for(let i=0;i<8;i++){
    s.light(i%2?s.display:GOLD,x-.21+(i%4)*.139,1.50+Math.floor(i/4)*.13,z+.289,.057,.056,.029);
  }
  s.box(METAL,x,1.055,z+.216,.75,.11,.43);
  s.cylinder(INK,x-.20,1.15,z+.32,.048,.16,.048);
  s.orb(s.display,x-.20,1.25,z+.32,.073,.073,.073);
  for(let i=0;i<3;i++)s.cylinder([GOLD,s.accent,s.display][i],x+.05+i*.074,1.125,z+.33,.055,.03,.055);
  s.light(s.display,x,1.78,z+.228,.57,.058,.044);
  s.block(x,z+.067,.80,.77);
}

function arcade(s) {
  arcadeCabinet(s,0,-2.65,s.accent);
  for(const side of [-1,1]){
    for(let i=0;i<3;i++)arcadeCabinet(s,side*(1.61+i*.88),-2.57,[s.secondary,'#b480ca','#8bbdaf'][i]);
    for(let i=0;i<4;i++){
      const z=-.8+i*.68;
      s.box(i%2?s.accent:s.secondary,side*2.62,.002,z,.62,.005,.62);
      s.box(s.highlight,side*2.62,.007,z,.22,.007,.22,0,.785);
    }
    seat(s,side*2.62,2.13,0,s.wood);
  }
}

function photobooth(s) {
  s.box(s.wood,0,.076,-2.80,2.72,.15,1.30);
  for(const side of [-1,1]){
    s.box(s.deep,side*1.36,1.26,-2.92,.15,2.48,1.02);
    s.light(s.display,side*1.26,1.42,-2.35,.043,2.07,.050);
  }
  s.box(s.accent,0,2.53,-2.89,2.81,.25,1.12);
  for(let i=0;i<12;i++)s.box(i%2?s.accent:s.secondary,(i-5.5)*.203,1.46,-3.39,.195,1.97,.08);
  s.box(s.deep,0,1.49,-3.305,.82,.52,.10);
  s.cylinder(s.highlight,0,1.52,-3.228,.22,.06,.22).rotation.x=Math.PI/2;
  s.orb(INK,0,1.52,-3.178,.14,.14,.057);
  s.light(s.display,.24,1.65,-3.24,.10,.06,.029);
  s.block(0,-2.92,2.84,1.02);
  for(const side of [-1,1]){
    sofa(s,side*2.58,-.59,1.55,s.secondary);
    frame(s,side*2.73,1.95,-3.57,.87,.72,side+1);
    flowers(s,side*3.47,0,.85,.70,s.accent);
  }
}

function cinema(s) {
  screen(s,0,1.77,-3.587,4.37,1.69);
  s.box('#455d87',0,1.71,-3.518,4.24,1.57,.020);
  s.box('#ab7ea5',0,1.25,-3.488,4.24,.68,.026);
  for(let i=0;i<13;i++){
    const y=1.53+(i%3)*.14;
    s.box(i%2?'#e9be9c':'#f5daf0',(i-6)*.301,y,-3.465,.075,.057,.035,0,(i%4)*.17);
  }
  s.orb('#ffe6b7',-.81,1.94,-3.462,.46,.46,.032);
  for(const side of [-1,1]){
    s.box(s.accent,side*2.43,1.82,-3.56,.50,2.05,.18);
    speaker(s,side*3.05,1.37,-3.31,true);
    for(let row=0;row<4;row++)for(let col=0;col<3;col++){
      seat(s,side*(1.43+col*.72),-.75+row*.89,Math.PI,mix(s.accent,s.deep,.28));
    }
    for(let row=0;row<5;row++)s.light(s.display,side*1.02,.012,-1.00+row*.72,.045,.019,.11);
  }
}

function gallery(s) {
  frame(s,0,1.81,-3.56,2.48,1.35,1);
  for(const side of [-1,1]){
    frame(s,side*2.55,1.75,-3.55,1.21,.95,2+side);
    const x=side*2.24;
    const z=-.54;
    s.box(s.highlight,x,.46,z,.65,.92,.62);
    s.torus(s.accent,x,.92,z,.55,.45,.48,0,.90);
    s.orb(s.secondary,x,1.18,z,.29,.45,.23,0,side*.33);
    s.block(x,z,.67,.64);
    const top=table(s,side*2.67,1.38,.82,.60,.83);
    frame(s,side*2.67,top+.31,1.29,.42,.45,side+2);
  }
  s.box(s.deep,0,0,-2.79,2.81,.045,1.09);
}

function danceStudio(s) {
  mirror(s,0,1.72,-3.48,5.92,1.78);
  s.box(s.wood,0,1.09,-3.20,5.72,.068,.073);
  for(const x of [-2.71,0,2.71])s.box(METAL,x,.55,-3.19,.055,1.08,.055);
  for(const side of [-1,1]){
    speaker(s,side*3.55,.46,-2.92,true);
    s.block(side*3.55,-2.92,.42,.29);
    s.box(s.highlight,side*2.66,.025,.13,1.08,.048,1.65);
    s.box(s.accent,side*2.66,.052,.13,.96,.009,1.48);
    s.light(s.display,side*1.30,.009,-.43,.035,.018,4.55);
  }
  for(let i=0;i<5;i++){
    s.box(s.secondary,(i-2)*.42,.006,-2.62,.29,.015,.29,0,.785);
  }
  s.box(INK,0,1.22,-3.08,.52,.20,.08);
  s.light(s.display,0,1.22,-3.024,.36,.06,.017);
}

function keys(s,x,y,z) {
  s.box(INK,x,y+.058,z,1.28,.105,.40);
  for(let i=0;i<14;i++){
    const at=x+(i-6.5)*.085;
    s.box(PAPER,at,y+.124,z+.034,.077,.025,.27);
    if(i%7!==2&&i%7!==6)s.box(INK,at+.041,y+.14,z-.032,.042,.039,.14);
  }
}

function musicStudio(s) {
  const y=counter(s);
  s.box(INK,0,y+.051,-2.68,2.42,.095,.57);
  for(let i=0;i<14;i++){
    const x=(i-6.5)*.151;
    s.box(METAL,x,y+.106,-2.63,.026,.018,.24);
    s.box(i%3===0?s.accent:IVORY,x,y+.124,-2.64+(i%3-1)*.048,.080,.037,.058);
    s.light(i%2?'#9ce4c8':s.display,x,y+.115,-2.807,.076,.022,.034);
  }
  screen(s,0,1.66,-3.05,1.02,.59);
  for(let i=0;i<11;i++)s.light(i%3?s.accent:s.display,(i-5)*.078,1.60+(i%4)*.03,-2.987,.035,.112+(i%4)*.054,.022);
  for(const x of [-2.42,2.42]){
    speaker(s,x,1.29,-2.71,true);
    s.block(x,-2.71,.43,.28);
  }
  const top=table(s,-2.41,-.12,1.49,.61);
  keys(s,-2.41,top,-.12);
  seat(s,-2.41,.54);
  sofa(s,2.61,.46,1.66,s.secondary);
}

function electronics(s) {
  const top=table(s,0,-2.62,2.71,.76,.86);
  keys(s,-.61,top,-2.63);
  screen(s,.74,top+.32,-2.74,.80,.51);
  for(const x of [-2.69,2.69])for(const z of [-.97,1.20]){
    shelf(s,x,z,{w:1.62,d:.44,h:1.59,levels:3,color:s.secondary},(cx,y,cz,row)=>{
      for(let i=0;i<4;i++){
        const at=cx-.62+i*.39;
        s.box(INK,at,y+.14,cz,.22,.28,.065);
        s.light((i+row)%2?s.display:s.accent,at,y+.16,cz+.038,.16,.19,.025);
        s.cylinder(METAL,at,y+.014,cz,.19,.028,.17);
      }
    });
  }
}

function parcel(s,x,y,z,w,h,color) {
  s.box(color,x,y+h*.5,z,w,h,w*.91);
  s.box(s.display,x,y+h*.5,z,w*.18,h+.013,w*.94);
  s.box(s.display,x,y+h*.5,z,w+.025,h+.016,w*.17);
  s.bud(s.highlight,x-w*.10,y+h+.046,z,w*.26,.084,w*.15,0,.22);
  s.bud(s.highlight,x+w*.10,y+h+.046,z,w*.26,.084,w*.15,0,-.22);
}

function giftShop(s) {
  const y=counter(s);
  parcel(s,-.64,y,-2.62,.45,.31,s.accent);
  s.box(PAPER,.28,y+.022,-2.63,.77,.044,.40,.11);
  for(let i=0;i<4;i++)s.torus([s.accent,GOLD,s.secondary,s.display][i],.49+i*.13,y+.071,-2.51,.13,.13,.13);
  for(const x of [-2.57,2.57])for(const z of [-1.18,.93]){
    shelf(s,x,z,{w:1.55,d:.49,h:1.68,levels:3},(cx,y,cz,row)=>{
      for(let i=0;i<4;i++)parcel(s,cx-.55+i*.36,y,cz,.28,.16+((row+i)%3)*.06,[s.accent,s.secondary,'#dcaa87','#bfa6df'][i]);
    });
  }
}

function salon(s) {
  const y=counter(s,0,-2.75,3.26,.51,.79);
  mirror(s,0,1.77,-3.288,2.43,1.41);
  jars(s,-1.20,y,-2.80,10,.23);
  for(const x of [-2.62,2.62]){
    mirror(s,x,1.63,-2.27,1.21,1.45);
    table(s,x,-2.17,1.39,.51,.86);
    s.cylinder(METAL,x,.32,-.83,.50,.64,.50);
    s.box(s.accent,x,.67,-.83,.71,.16,.63);
    s.box(s.accent,x,1.02,-.57,.71,.61,.17);
    for(const side of [-1,1])s.box(s.deep,x+side*.34,.84,-.82,.083,.12,.53);
    s.block(x,-.79,.75,.70);
    plant(s,x,1.56,.63);
  }
}

function hotel(s) {
  const y=counter(s,0,-2.70,3.51,.78,1.04);
  s.box(s.highlight,-.58,y+.056,-2.59,.62,.11,.36);
  s.box(GOLD,-.58,y+.115,-2.59,.56,.035,.301,0,.06);
  s.cylinder(METAL,.78,y+.145,-2.74,.041,.29,.041);
  s.cone(s.display,.78,y+.41,-2.74,.41,.25,.41);
  s.cylinder(GOLD,.45,y+.029,-2.55,.16,.053,.16);
  s.orb(GOLD,.45,y+.095,-2.55,.14,.11,.14);
  for(const x of [-2.66,2.66]){
    sofa(s,x,.21,1.89,s.accent);
    plant(s,x, -1.82,.72);
    const top=table(s,x,1.65,.85,.72,.61);
    flowers(s,x,top,1.65,.32,s.accent);
    s.box(s.wood,x,1.04,-3.20,1.14,.75,.44);
    for(let i=0;i<3;i++)s.box(s.secondary,x-.38+i*.37,1.48,-3.10,.305,.37,.30);
    s.block(x,-3.18,1.16,.48);
  }
}

// The palettes belong to the room types, while the edition belongs to each address.
const TYPES = new Map([
  ['cafe', [cafe, '#c3a49c', '#d69880']],
  ['restaurant', [restaurant, '#9ba384', '#d9ab76']],
  ['bakery', [bakery, '#d8bcaa', '#efac89']],
  ['convenience', [convenience, '#aec0ab', '#88bbe4']],
  ['fashion', [fashion, '#ae8fa9', '#de9ab9']],
  ['cosmetics', [cosmetics, '#d6a9bc', '#d787b7']],
  ['florist', [florist, '#a8b59c', '#edacb9']],
  ['bookstore', [bookstore, '#a78c7b', '#ddba88']],
  ['records', [records, '#897a99', '#e09b96']],
  ['karaoke', [karaoke, '#786a9a', '#de88c2']],
  ['arcade', [arcade, '#74618e', '#a6acf0']],
  ['photobooth', [photobooth, '#ad8da5', '#eca2b4']],
  ['cinema', [cinema, '#654760', '#b77695']],
  ['gallery', [gallery, '#cabdb2', '#af9ac7']],
  ['dance-studio', [danceStudio, '#9595aa', '#acc4e8']],
  ['music-studio', [musicStudio, '#876d83', '#b49ac9']],
  ['electronics', [electronics, '#80969f', '#8dc9d5']],
  ['gift-shop', [giftShop, '#bda9bb', '#eea897']],
  ['salon', [salon, '#c0aaa6', '#c68fb7']],
  ['hotel', [hotel, '#b09a91', '#d1ad95']],
]);

export function createInterior(B, scene, anchor, building) {
  const style = TYPES.get(building.type);
  const edition = EDITIONS[building.variant];
  if (!style || !edition) throw new RangeError('Bina türü veya iç dekor seçeneği geçersiz');
  const [build, room, accent] = style;
  const wall = mix(room, edition.room, .50);
  const sumiAddress = building.id === SUMI_CAFE_ID && building.type === 'cafe';
  const root = new B.TransformNode('Interior ' + building.id, scene);
  root.parent = anchor;
  const s = maker(B, scene, root, sumiAddress ? SUMI_PALETTE : {
    wall,
    floor: mix(edition.floor, room, .22),
    accent: mix(accent, edition.accent, .67),
    display: edition.display,
    secondary: mix(wall, INK, .30),
    wood: mix(edition.floor, '#3c2c40', .30),
    highlight: mix(wall, IVORY, .56),
    deep: mix(room, INK, .67),
  });
  let sumi;
  try {
    fixtureWall(s, sumiAddress);
    decorators[sumiAddress ? 'slats' : edition.trim](s);
    if (sumiAddress) {
      sumiCafe(s, building.name);
      sumi = createSumi(B, scene, root);
    } else {
      build(s);
    }
    if (!sumiAddress) s.text(building.name, 0, 2.888, BACK+.182, 2.54, .30, s.deep, s.display);
    s.torus(s.display,0,.016,STATION_Z,.65,.070,.65);
    s.box(s.accent,0,.012,STATION_Z,.17,.020,.17,0,.785);
    s.ready();
  } catch (error) {
    sumi?.dispose();
    s.dispose();
    throw error;
  }

  return {
    root,
    spawn: SPAWN,
    exit: EXIT,
    activity: {x:0, z:STATION_Z, id:building.type},
    ...(sumi ? {updateSumi: sumi.update, pixelPerch: PIXEL_PERCH} : {}),
    bounds: BOUNDS,
    cameraWalls: CAMERA_WALLS,
    walkable(x,z,radius) {
      if (x < BOUNDS.minX+radius || x > BOUNDS.maxX-radius || z < BOUNDS.minZ+radius || z > BOUNDS.maxZ-radius) return false;
      return s.hitboxes.every(hit => x <= hit.minX-radius || x >= hit.maxX+radius || z <= hit.minZ-radius || z >= hit.maxZ+radius);
    },
    dispose() {
      sumi?.dispose();
      s.dispose();
    },
  };
}
