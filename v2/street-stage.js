// The festival fits the end of the existing lane. Batched vertex colours keep each
// moving body part to one draw call, regardless of its costume details.
export function createStreetStage(B, scene, district, bloom) {
  const root = new B.TransformNode('Hongdae live stage', scene);
  const paint = new B.StandardMaterial('Festival satin', scene);
  paint.diffuseColor = B.Color3.White();
  paint.specularColor.set(.17, .15, .20);
  const glow = new B.StandardMaterial('Festival neon', scene);
  glow.disableLighting = true;
  glow.emissiveColor = B.Color3.White();

  function joint(name, parent, x, y, z) {
    const node = new B.TransformNode(name, scene);
    node.parent = parent;
    node.position.set(x, y, z);
    return node;
  }

  function group(parent, material = paint) {
    const parts = [];
    function part(shape, tint, x, y, z, w, h, d, tilt = 0) {
      const mesh = shape === 'box' ? B.MeshBuilder.CreateBox('block', {}, scene) :
        shape === 'skirt' ? B.MeshBuilder.CreateCylinder('pleats', {diameterTop:.60, diameterBottom:1, tessellation:14}, scene) :
        B.MeshBuilder.CreateSphere('oval', {diameter:1, segments:8}, scene);
      mesh.scaling.set(w,h,d);
      mesh.position.set(x,y,z);
      mesh.rotation.z = tilt;
      const rgb = B.Color3.FromHexString(tint);
      const colors = new Float32Array(mesh.getTotalVertices() * 4);
      for (let i=0; i<colors.length; i+=4) colors.set([rgb.r,rgb.g,rgb.b,1],i);
      mesh.setVerticesData(B.VertexBuffer.ColorKind, colors);
      parts.push(mesh);
    }
    return {
      box: (...args) => part('box', ...args),
      oval: (...args) => part('oval', ...args),
      skirt: (...args) => part('skirt', ...args),
      finish() {
        const mesh = B.Mesh.MergeMeshes(parts,true,true);
        mesh.name = parent.name+' geometry';
        mesh.material = material;
        mesh.parent = parent;
        mesh.isPickable = false;
        return mesh;
      },
    };
  }

  const structure = group(root);
  structure.box('#292035',0,.32,-11.31,6.54,.62,2.66);
  structure.box('#4c334c',0,1.96,-12.52,6.48,3.02,.16);
  for (const side of [-1,1]) {
    structure.box('#343142',side*3.12,1.93,-11.74,.16,3.85,.16);
    structure.box('#201b2c',side*2.97,.95,-10.87,.46,.68,.45);
    structure.oval('#6f566d',side*2.97,.96,-10.625,.29,.29,.06);
  }
  structure.finish();
  const trims = group(root,glow);
  for (const side of [-1,1]) {
    trims.box('#ff83bd',side*3.12,2.06,-11.64,.028,3.57,.045);
    for (let i=0;i<3;i++) {
      trims.box(i%2?'#9365ba':'#c85793',side*(1.05+i*.46),1.7,-12.41,.031,2.0,.027,side*.58);
    }
    for (let i=0;i<5;i++) trims.box(i%2?'#ffa3d4':'#91eaff',side*2.86,1.45+i*.35,-12.37,.44,.045,.035,side*.45);
  }
  trims.box('#ffc7eb',0,.52,-9.968,6.49,.038,.054);
  trims.box('#ff67b8',0,3.78,-12.36,6.31,.032,.07);
  trims.finish();

  const led = new B.DynamicTexture('Hongdae concert marquee',{width:1024,height:256},scene,false);
  const ctx = led.getContext();
  function drawMarquee(solo) {
    const gradient = ctx.createLinearGradient(0,0,1024,256);
    gradient.addColorStop(0,'#3e1645'); gradient.addColorStop(.52,'#1c102f'); gradient.addColorStop(1,'#492144');
    ctx.fillStyle=gradient; ctx.fillRect(0,0,1024,256);
    ctx.textAlign='center'; ctx.fillStyle='#ffb6dc';
    ctx.font='bold 92px Helvetica, Arial, sans-serif'; ctx.fillText(solo?'L I S A':'BLACKPINK',512,116);
    ctx.font='600 35px Helvetica, Arial, sans-serif'; ctx.fillStyle='#f7edff';
    ctx.fillText(solo?'✦   S E C R E T   E N C O R E   ✦':'✦   H O N G D A E   L I V E   ✦',512,189); led.update();
  }
  drawMarquee(false);
  const screen = B.MeshBuilder.CreatePlane('Festival marquee',{width:4.88,height:1.22},scene);
  const display = new B.StandardMaterial('Festival screen',scene);
  display.disableLighting=true; display.emissiveTexture=led;
  led.uScale=-1; led.uOffset=1;
  screen.material=display; screen.parent=root; screen.rotation.y=Math.PI;
  screen.position.set(0,3.03,-12.39);

  const cast = [
    ['Jisoo','#a83e67','#382638','long'],['Jennie','#eea9c5','#372731','bun'],
    ['Rosé','#c4d4ec','#f2ce9e','long'],['Lisa','#a477de','#372534','fringe'],
  ];
  const dancers = cast.map(([name,tint,hair,style], index) => {
    const x=(index-1.5)*1.18;
    const pivot=joint(name+' festival',root,x,.63,-11.24);
    const body=group(pivot);
    const skin='#f5bf9e';
    body.oval(tint,0,.79,0,.40,.49,.28);
    body.skirt(name==='Lisa'?'#332b43':tint,0,.57,0,.50,.157,.34);
    body.box('#f5daea',0,.715,.02,.38,.044,.24);
    body.oval(skin,0,1.20,.015,.49,.51,.42);
    body.oval(hair,0,1.37,-.031,.52,.25,.45);
    body.oval(hair,0,1.19,-.095,.50,.43,.34);
    for (const sign of [-1,1]) {
      body.oval(hair,sign*.197,1.13,-.063,.155,style==='long'?.60:.34,.25,sign*.10);
      body.oval('#382836',sign*.091,1.224,.211,.043,.057,.027);
      body.oval('#fff9e8',sign*.091-.006,1.234,.227,.012,.014,.008);
      body.oval('#f4a1a2',sign*.146,1.172,.172,.066,.029,.031);
      body.oval('#ffe4b0',sign*.231,1.147,.03,.039,.078,.033);
    }
    body.oval('#bb6978',0,1.134,.211,.070,.020,.019);
    if (style==='bun') body.oval(hair,.09,1.53,-.12,.29,.26,.28);
    if (style==='fringe') body.oval(hair,0,1.325,.151,.42,.135,.145);
    else body.oval(hair,-.085,1.346,.134,.31,.13,.15,-.29);
    body.oval('#fef2e3',0,.903,.124,.062,.068,.037);
    if (name==='Jisoo') {
      for(let i=0;i<5;i++) body.oval('#d74b75',.145+.048*Math.sin(i*1.257),.894+.042*Math.cos(i*1.257),.128,.067,.069,.043);
      body.oval('#ffe0a2',.145,.894,.153,.031,.031,.021);
    } else if (name==='Jennie') {
      for(const side of [-1,1]) body.box('#511f41',side*.102,.838,.115,.025,.197,.02,side*.43);
    } else if (name==='Rosé') {
      for(let i=0;i<7;i++) body.oval('#fff6c5',-.14+i*.044,.79+.04*Math.sin(i),.132,.025,.032,.014);
    } else {
      body.box('#2c2238',0,.765,.126,.347,.067,.024,-.22);
    }
    body.finish();
    const arms=[], legs=[];
    for (const sign of [-1,1]) {
      const arm=joint(name+' arm '+sign,pivot,sign*.208,.92,0);
      const sleeve=group(arm);
      sleeve.oval(tint,0,-.060,0,.147,.19,.16);
      sleeve.oval(skin,0,-.225,.012,.104,.25,.108);
      sleeve.oval(skin,0,-.355,.023,.114,.108,.12);
      if(sign===1) {sleeve.box('#45344e',0,-.36,.11,.04,.045,.19);sleeve.oval('#edc2d9',0,-.36,.202,.081,.080,.074);}
      sleeve.finish(); arms.push(arm);
      const leg=joint(name+' boot '+sign,pivot,sign*.113,.55,0);
      const boot=group(leg);
      boot.oval(name==='Lisa'?'#51425e':skin,0,-.15,0,.146,.36,.144);
      boot.oval(name==='Rosé'?'#c9c8e5':'#342b3c',0,-.383,.018,.175,.31,.19);
      boot.oval('#42374b',0,-.499,.063,.18,.09,.22);
      boot.finish(); legs.push(leg);
    }
    return {pivot,arms,legs,x};
  });

  const lisa = dancers[3].pivot;
  const jacket = group(lisa);
  for (const side of [-1,1]) {
    jacket.oval('#ca4384',side*.138,.831,.058,.17,.25,.23,side*.16);
    jacket.oval('#fbd28a',side*.159,.937,.078,.115,.048,.17);
    jacket.box('#ffd9a4',side*.099,.843,.183,.024,.19,.026,-side*.28);
  }
  jacket.box('#edb558',0,.702,.146,.31,.042,.027);
  const costume=jacket.finish();
  costume.setEnabled(false);

  const soloPool=B.MeshBuilder.CreateDisc('Lisa solo spotlight',{radius:.85,tessellation:48,sideOrientation:B.Mesh.DOUBLESIDE},scene);
  soloPool.parent=root;
  soloPool.rotation.x=Math.PI/2;
  soloPool.position.set(0,.637,-11.1);
  const halo=new B.StandardMaterial('Encore floor light',scene);
  halo.disableLighting=true;
  halo.emissiveColor=B.Color3.FromHexString('#ffe7b5');
  halo.alpha=.29;
  halo.disableDepthWrite=true;
  soloPool.material=halo;
  soloPool.isPickable=false;
  soloPool.setEnabled(false);
  const key=new B.SpotLight('Lisa entrance spot',new B.Vector3(0,3.65,-10.0),new B.Vector3(0,-1,-.7),.99,2,scene);
  key.parent=root;
  key.diffuse=B.Color3.FromHexString('#fff0d5');
  key.includedOnlyMeshes=lisa.getChildMeshes();
  key.intensity=0;
  let lastMode='group';

  // A narrow additive beam leaves the performers readable through the haze.
  const beams = [-1,1].map(side => {
    const mount = joint('Festival moving head '+side,root,side*2.86,3.64,-11.72);
    const beam = B.MeshBuilder.CreateCylinder('Festival light shaft',{
      diameterTop:.055,diameterBottom:.91,height:3.36,tessellation:16,
    },scene);
    const mist = new B.StandardMaterial('Festival haze '+side,scene);
    mist.disableLighting = true;
    mist.diffuseColor = B.Color3.Black();
    mist.emissiveColor = B.Color3.FromHexString(side<0?'#ff81c1':'#bb9dff');
    mist.alpha = .13;
    mist.alphaMode = B.Engine.ALPHA_ADD;
    mist.disableDepthWrite = true;
    beam.material = mist;
    beam.parent = mount;
    beam.position.y = -1.68;
    beam.isPickable = false;
    return {mount,mist,side};
  });
  const banks=[];
  const silhouettes=group(root);
  for (let row=0;row<4;row++) {
    const material=new B.StandardMaterial('Audience wave '+row,scene);
    material.disableLighting=true;
    const lamps=group(root,material);
    for (const side of [-1,1]) {
      for (let seat=0;seat<3;seat++) {
        const x=side*(1.83+seat*.55), z=-7.4-row*.62+seat*.08, y=.85+Math.sin(row*2+seat)*.09;
        silhouettes.oval('#372b42',x,y-.45,z,.40,.75,.31);
        silhouettes.oval('#594459',x,y-.04,z,.285,.30,.27);
        silhouettes.oval('#453449',x,y+.012,z+.024,.294,.23,.242);
        silhouettes.oval('#675065',x+side*.17,y-.13,z,.085,.31,.085,-side*.37);
        silhouettes.box('#b0a1b8',x+side*.213,y+.035,z,.026,.17,.025);
        // Edge lights carry the pulse up each bank, including in portrait framing.
        lamps.box('#ffffff',side*(1.62+seat*.48),.105,z,.40,.040,.047);

        lamps.oval('#ffffff',x+side*.213,y+.14,z,.12,.135,.11);
      }
    }
    bloom.addIncludedOnlyMesh(lamps.finish());
    banks.push(material);
  }
  silhouettes.finish();
  root.parent=district;
  let hitAt=-20;
  return {
    wave(t) { hitAt=t; },
    update(t,active,tint,encore) {
      const mode=encore?.phase ?? 'group';
      const solo=!['group','bow','blackout'].includes(mode);
      const dark=mode==='blackout';
      if (lastMode!==mode) {
        drawMarquee(solo);
        screen.setEnabled(!dark);
        costume.setEnabled(solo);
        soloPool.setEnabled(solo);
        for (const [i,dancer] of dancers.entries()) dancer.pivot.setEnabled(mode==='group' || mode==='bow' || (solo && i===3));
        lastMode=mode;
      }
      const enter=encore?.entrance ?? 0;
      const ease=enter*enter*(3-2*enter);
      const lights=encore?.lit ?? 0;
      const neonLevel=dark ? 0 : solo ? .16+lights*.23 : 1;
      glow.emissiveColor.set(neonLevel,neonLevel,neonLevel);
      const beat=t*Math.PI*2/.55;
      dancers.forEach(({pivot,arms,legs,x},i)=>{
        const phase=beat*.5+i*.48;
        const lead=solo && i===3;
        pivot.position.x=(lead ? 3.26-2.94*ease : x)+.088*Math.sin(phase);
        pivot.position.z=lead ? -11.51+.56*ease : -11.24;
        pivot.position.y=.64+.05*Math.pow(Math.sin(phase),2);
        pivot.rotation.y=.23*Math.sin(phase)+(lead ? -.65*(1-ease)+.23*Math.sin(phase*2) : 0);
        pivot.rotation.z=.066*Math.sin(phase);
        pivot.rotation.x=mode==='bow'?encore.bow*.58:0;
        arms.forEach((arm,j)=>{
          const side=j===0?-1:1;
          arm.rotation.z=side*(.50+.64*(1+Math.sin(phase+side*.8)));
          arm.rotation.x=.27*Math.cos(phase+side);
          legs[j].rotation.x=side*.27*Math.sin(phase);
        });
      });
      key.intensity=solo?1.45:0;
      if(solo) {
        soloPool.position.x=lisa.position.x;
        soloPool.position.z=lisa.position.z;
        key.position.x=lisa.position.x;
      }
      for (const {mount,mist,side} of beams) {
        mount.rotation.z = -side*(.48+.32*Math.sin(beat*.18+side));
        const age=t-hitAt;
        mist.alpha=dark || (solo && !lights) ? 0 : .105+(active && age>=0 ? .14*Math.exp(-age*2.5) : 0);
      }
      banks.forEach((mat,i)=>{
        const age=t-hitAt-i*.135;
        const spread=active && age>=0 ? Math.exp(-age*2.85) : 0;
        const level=solo ? (i<lights ? 1.36+spread*2.7 : .016) : .13+.09*(1+Math.sin(beat*.25+i))+spread*3.8;
        tint.scaleToRef(dark ? 0 : level,mat.emissiveColor);
      });
    },
  };
}
