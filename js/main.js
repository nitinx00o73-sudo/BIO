// ── Butterfly Cursor ──
const cur=document.getElementById('cursor');
let cmx=0,cmy=0,cvx=0,cvy=0,cscale=1,ctargetScale=1,cangle=0,clastX=0,clastY=0,cflapT=0;
document.addEventListener('mousemove',e=>{
  clastX=cmx; clastY=cmy;
  cmx=e.clientX; cmy=e.clientY;
});
let hovered=false;
document.querySelectorAll('a,button,.tbtn,.sw,.contact-chip,.btn-primary,.btn-outline').forEach(el=>{
  el.addEventListener('mouseenter',()=>{hovered=true;});
  el.addEventListener('mouseleave',()=>{hovered=false;});
});
function animCursor(){
  cflapT+=0.18;
  ctargetScale=hovered?1.6:1;
  cscale+=(ctargetScale-cscale)*0.12;
  const dx=cmx-clastX, dy=cmy-clastY;
  const speed=Math.sqrt(dx*dx+dy*dy);
  if(speed>1){ cangle=Math.atan2(dy,dx)*180/Math.PI; }
  const flapAmt=Math.min(speed*0.04,0.5);
  const svgPaths=cur.querySelectorAll('path,ellipse,circle');
  svgPaths.forEach((p,i)=>{
    if(i<2){ p.style.transform=`skewY(${Math.sin(cflapT)*flapAmt*18}deg)`; }
  });
  cur.style.transform=`translate(${cmx-24}px,${cmy-19}px) scale(${cscale}) rotate(${speed>2?cangle-90:0}deg)`;
  requestAnimationFrame(animCursor);
}
animCursor();

// ── Floating Particles ──
const pc=document.getElementById('particles');
const colors=['rgba(74,144,232,0.6)','rgba(139,92,246,0.6)','rgba(6,214,160,0.5)','rgba(201,168,76,0.5)'];
for(let i=0;i<18;i++){
  const p=document.createElement('div');
  p.className='particle';
  const sz=Math.random()*3+1;
  p.style.cssText=`width:${sz}px;height:${sz}px;left:${Math.random()*100}%;background:${colors[i%colors.length]};animation-duration:${8+Math.random()*12}s;animation-delay:${Math.random()*10}s;`;
  pc.appendChild(p);
}

// ── Scroll Reveal ──
const revEls=document.querySelectorAll('.reveal');
const obs=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add('visible'),i*80);
    }
  });
},{threshold:0.12});
revEls.forEach(el=>obs.observe(el));

// ── Hero Canvas (floating butterflies) ──
(function(){
  const c=document.getElementById('hero-canvas');
  const ctx=c.getContext('2d');
  function resize(){c.width=c.offsetWidth;c.height=c.offsetHeight;}
  resize(); window.addEventListener('resize',resize);
  const bflies=Array.from({length:9},(_,i)=>({
    x:Math.random()*c.width,y:Math.random()*c.height,
    vx:(Math.random()-0.5)*0.4,vy:(Math.random()-0.5)*0.3,
    phase:Math.random()*Math.PI*2,
    scale:0.3+Math.random()*0.5,
    hue:Math.random()*280+180,
    alpha:0.2+Math.random()*0.35,
  }));
  function drawMini(ctx,x,y,s,hue,t,alpha){
    const flap=Math.sin(t*2.5+s)*0.4;
    ctx.save();ctx.translate(x,y);ctx.globalAlpha=alpha;
    [[1,-1],[1,1],[-1,-1],[-1,1]].forEach(([sx,isH])=>{
      const scl=isH===1?0.7:1;
      ctx.save();ctx.rotate(sx*flap*(isH===1?0.6:1));
      ctx.beginPath();
      if(isH===1){
        ctx.moveTo(0,5*s*scl);
        ctx.bezierCurveTo(sx*10*s,14*s,sx*60*s*scl,8*s,sx*62*s*scl,30*s);
        ctx.bezierCurveTo(sx*63*s*scl,50*s,sx*38*s,60*s,0,45*s);
      } else {
        ctx.moveTo(0,0);
        ctx.bezierCurveTo(sx*8*s,-48*s,sx*70*s,-58*s,sx*78*s,-12*s);
        ctx.bezierCurveTo(sx*82*s,8*s,sx*46*s,30*s,0,5*s);
      }
      ctx.closePath();
      ctx.fillStyle=`hsla(${hue},80%,65%,0.85)`;ctx.fill();
      ctx.restore();
    });
    ctx.restore();
  }
  let t=0;
  function frame(){
    ctx.clearRect(0,0,c.width,c.height);
    t+=0.012;
    bflies.forEach(b=>{
      b.x+=b.vx; b.y+=b.vy;
      if(b.x<-100)b.x=c.width+100;if(b.x>c.width+100)b.x=-100;
      if(b.y<-100)b.y=c.height+100;if(b.y>c.height+100)b.y=-100;
      drawMini(ctx,b.x,b.y,b.scale,b.hue,t+b.phase,b.alpha);
    });
    requestAnimationFrame(frame);
  }
  frame();
})();

// About image loaded from uploaded photo

// ── Avatar canvases ──
document.querySelectorAll('.avatar-canvas').forEach(c=>{
  const hue=+c.dataset.hue||220;
  const ctx=c.getContext('2d');
  c.width=c.offsetWidth||200;c.height=c.offsetHeight||200;
  let t=Math.random()*100;
  function frame(){
    const W=c.width,H=c.height;
    ctx.clearRect(0,0,W,H);
    t+=0.015;
    for(let i=0;i<6;i++){
      const x=W/2+Math.cos(t*0.7+i*1.05)*W*0.28;
      const y=H/2+Math.sin(t*0.9+i*1.05)*H*0.28;
      const r=W*0.18+Math.sin(t+i)*W*0.06;
      const g=ctx.createRadialGradient(x,y,0,x,y,r);
      g.addColorStop(0,`hsla(${hue+i*15},80%,60%,0.18)`);
      g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    }
    requestAnimationFrame(frame);
  }
  frame();
});

// ════════════════════════════════
//  SIMULATOR LOGIC
// ════════════════════════════════
const CV=document.getElementById('main-canvas');
const ctx2=CV.getContext('2d');
const W=CV.width,H=CV.height,CX=W/2,CY=H/2-10;

const SP=[
  {name:'Blue Morpho',  base:[20,90,242],  irid:[76,191,255], spot:[230,230,255], dark:[3,8,30],  hex:'#145af2'},
  {name:'Purple Emperor',base:[97,25,204], irid:[178,76,255], spot:[217,178,255], dark:[13,3,30], hex:'#6119cc'},
  {name:'Emerald SW',   base:[13,158,71],  irid:[51,255,127], spot:[178,255,191], dark:[3,20,8],  hex:'#0d9e47'},
  {name:'Golden BW',    base:[229,166,13], irid:[255,230,51], spot:[255,242,127], dark:[30,18,3], hex:'#e5a60d'},
  {name:'Red Lacewing', base:[217,20,13],  irid:[255,89,38],  spot:[255,178,153], dark:[25,3,3],  hex:'#d9140d'},
  {name:'White Admiral',base:[217,217,230],irid:[255,255,255],spot:[255,255,255], dark:[38,38,46],hex:'#d9d9e6'},
];
const VIEWS=['3D Orbit','Front','Top','Side','Back','X-Ray'];
const ANIMS=['Idle','Flapping','Auto-rotate','Breathing'];

const S={spIdx:0,view:'3D Orbit',anim:'Idle',az:45,el:40,wl:470,ft:200,camH:30,camV:25,t:0,fp:0,rH:30,drag:false,lx:0,ly:0};

SP.forEach((s,i)=>{
  const d=document.createElement('div');
  d.className='sw'+(i===0?' on':'');
  d.style.background=s.hex;d.title=s.name;
  d.onclick=()=>{document.querySelectorAll('.sw').forEach(x=>x.classList.remove('on'));d.classList.add('on');S.spIdx=i;document.getElementById('c-sp').textContent=s.name;};
  document.getElementById('spr').appendChild(d);
});
function mkBtns(ids,cid,key,dispId){
  ids.forEach(v=>{
    const b=document.createElement('button');
    b.className='tbtn'+(v===ids[0]?' on':'');b.textContent=v;
    b.onclick=()=>{document.querySelectorAll('#'+cid+' .tbtn').forEach(x=>x.classList.remove('on'));b.classList.add('on');S[key]=v;if(dispId)document.getElementById(dispId).textContent=v;};
    document.getElementById(cid).appendChild(b);
  });
}
mkBtns(VIEWS,'vr','view','c-mode');
mkBtns(ANIMS,'ar','anim');
function bindSl(id,dispId,suf,key,extra){
  document.getElementById(id).oninput=function(){S[key]=+this.value;document.getElementById(dispId).textContent=this.value+suf;if(extra)extra(+this.value);};
}
bindSl('az','d-az','°','az');
bindSl('el','d-el','°','el',v=>document.getElementById('c-aoi').textContent=v+'°');
bindSl('wl','d-wl',' nm','wl',v=>document.getElementById('c-wl').textContent=v+' nm');
bindSl('ft','d-ft',' nm','ft');
bindSl('ch','d-ch','°','camH');
bindSl('cv','d-cv','°','camV');

CV.addEventListener('mousedown',e=>{S.drag=true;S.lx=e.clientX;S.ly=e.clientY;});
window.addEventListener('mouseup',()=>S.drag=false);
CV.addEventListener('mousemove',e=>{
  if(!S.drag)return;
  S.camH+=(e.clientX-S.lx)*0.5;S.camV+=(e.clientY-S.ly)*0.4;
  S.camV=Math.max(-80,Math.min(80,S.camV));S.lx=e.clientX;S.ly=e.clientY;
  document.getElementById('ch').value=Math.round(S.camH%360);document.getElementById('d-ch').textContent=Math.round(S.camH%360)+'°';
  document.getElementById('cv').value=Math.round(S.camV);document.getElementById('d-cv').textContent=Math.round(S.camV)+'°';
});

function wlToRGB(wl){
  let r,g,b;
  if(wl<380){r=0.5;g=0;b=0.5;}else if(wl<440){r=(440-wl)/60;g=0;b=1;}else if(wl<490){r=0;g=(wl-440)/50;b=1;}else if(wl<510){r=0;g=1;b=(510-wl)/20;}else if(wl<580){r=(wl-510)/70;g=1;b=0;}else if(wl<645){r=1;g=(645-wl)/65;b=0;}else{r=1;g=0;b=0;}
  const f=wl<420?0.3+0.7*(wl-380)/40:wl>645?0.3+0.7*(700-wl)/55:1;
  return[Math.round(r*255*f),Math.round(g*255*f),Math.round(b*255*f)];
}
function iridFactor(a,wl,ft){const theta=a*Math.PI/180;const path=2*1.56*ft*Math.cos(theta);return 0.5+0.5*Math.cos(2*Math.PI*path/Math.max(1,wl));}
function lerp3(a,b,t){return[Math.round(a[0]*(1-t)+b[0]*t),Math.round(a[1]*(1-t)+b[1]*t),Math.round(a[2]*(1-t)+b[2]*t)];}
function wingColor(sp,irid,wl){return lerp3(lerp3(sp.base,sp.irid,irid),wlToRGB(wl),0.13);}
function rc(c,a){return a!=null?`rgba(${c[0]},${c[1]},${c[2]},${a})`:`rgb(${c[0]},${c[1]},${c[2]})`;}

function draw2D(ox,oy,mainC,hindC,darkC,spotC,wlRGB,irid,sp,flap,breathe){
  const c=ctx2;
  c.save();c.translate(ox,oy);c.scale(breathe,breathe);
  function drawWing(side,isHind){
    const s=side;
    c.beginPath();
    if(!isHind){c.moveTo(0,0);c.bezierCurveTo(s*18,-82,s*108,-105,s*130,-25);c.bezierCurveTo(s*140,12,s*78,55,0,8);}
    else{c.moveTo(0,8);c.bezierCurveTo(s*16,22,s*118,18,s*128,56);c.bezierCurveTo(s*132,90,s*65,118,0,74);}
    c.closePath();
    c.fillStyle=rc(isHind?hindC:mainC);c.fill();
    const gx=isHind?s*60:s*55,gy=isHind?60:-45;
    const shG=c.createRadialGradient(gx,gy,0,gx,gy,88);
    shG.addColorStop(0,rc(wlRGB,0.52*irid));shG.addColorStop(1,'rgba(0,0,0,0)');
    c.save();c.clip();c.fillStyle=shG;c.fillRect(-200,-200,400,400);c.restore();
    c.strokeStyle=rc(darkC);c.lineWidth=1.5;c.stroke();
    c.strokeStyle=rc(darkC,0.5);c.lineWidth=0.8;
    const veins=isHind?[[[0,30],[s*52,48],[s*108,58]],[[0,25],[s*58,15],[s*115,8]],[[0,42],[s*28,78],[s*18,108]]]:
      [[[0,0],[s*48,-52],[s*112,-28]],[[0,2],[s*74,16],[s*118,10]],[[0,0],[s*38,-78],[s*96,-88]],[[0,2],[s*54,32],[s*88,44]]];
    veins.forEach(([a,b,cc])=>{c.beginPath();c.moveTo(a[0],a[1]);c.quadraticCurveTo(b[0],b[1],cc[0],cc[1]);c.stroke();});
    const spots=isHind?[[s*50,64],[s*88,36],[s*40,90]]:[[s*54,-60],[s*90,-36],[s*66,24],[s*36,-16]];
    spots.forEach(([px,py],i)=>{c.beginPath();c.arc(px,py,i===0?6:4,0,Math.PI*2);c.fillStyle=rc(spotC,i%2===0?0.55:0.3);c.fill();});
  }
  function flapWing(side,isHind,fn){c.save();if(flap!==0){c.rotate(side*flap*(isHind?0.7:1));}fn();c.restore();}
  flapWing(1,true,()=>drawWing(1,true));flapWing(-1,true,()=>drawWing(-1,true));
  flapWing(1,false,()=>drawWing(1,false));flapWing(-1,false,()=>drawWing(-1,false));
  c.beginPath();c.ellipse(0,10,5,60,0,0,Math.PI*2);c.fillStyle='#080808';c.fill();c.strokeStyle='rgba(255,255,255,0.2)';c.lineWidth=0.8;c.stroke();
  c.strokeStyle='rgba(190,190,210,0.65)';c.lineWidth=1.2;
  [[-1],[1]].forEach(([s])=>{c.beginPath();c.moveTo(s*3,-48);c.quadraticCurveTo(s*17,-84,s*27,-100);c.stroke();c.beginPath();c.arc(s*27,-100,3,0,Math.PI*2);c.fillStyle='rgba(200,200,220,0.75)';c.fill();});
  c.restore();
}

function draw3D(mainC,hindC,darkC,spotC,wlRGB,irid,sp,flap,breathe,isXray){
  const c=ctx2;
  const hR=S.camH*Math.PI/180,vR=S.camV*Math.PI/180;
  function proj(x,y,z){
    const cosH=Math.cos(hR),sinH=Math.sin(hR),cosV=Math.cos(vR),sinV=Math.sin(vR);
    const x2=x*cosH+z*sinH,z2=-x*sinH+z*cosH;
    const y2=y*cosV-z2*sinV,z3=y*sinV+z2*cosV;
    const fov=4.2,sc=fov/(fov+z3+2.8);
    return[CX+x2*190*sc,CY-y2*190*sc,sc,z3];
  }
  function getWingPts(side,isHind){
    const s=side;
    if(!isHind)return[[0,0,0],[s*0.12,-0.62,0.01],[s*0.55,-0.82,0.05],[s*0.82,-0.78,0.07],[s*0.98,-0.18,0.08],[s*0.88,0.10,0.05],[s*0.32,0.06,0.02],[0,0.04,0]];
    return[[0,0.05,0],[s*0.12,0.16,0.02],[s*0.78,0.10,0.05],[s*0.82,0.40,0.08],[s*0.50,0.80,0.06],[s*0.12,0.72,0.02],[0,0.55,0]];
  }
  function drawWing3D(side,isHind){
    const raw=getWingPts(side,isHind);
    const fR=flap*side*(isHind?0.75:1.0);
    const pts=raw.map(([x,y,z])=>{
      const nx=x*Math.cos(fR)-z*Math.sin(fR),nz=x*Math.sin(fR)+z*Math.cos(fR);
      return[nx,y*(breathe+(1-breathe)*0.5),nz];
    });
    const projected=pts.map(p=>proj(p[0],p[1],p[2]));
    return{projected,avgZ:projected.reduce((s,p)=>s+p[3],0)/projected.length,side,isHind};
  }
  const wings=[drawWing3D(-1,true),drawWing3D(1,true),drawWing3D(-1,false),drawWing3D(1,false)];
  wings.sort((a,b)=>b.avgZ-a.avgZ);
  wings.forEach(({projected,side,isHind})=>{
    const col=isHind?hindC:mainC;
    c.beginPath();c.moveTo(projected[0][0],projected[0][1]);
    projected.slice(1).forEach(p=>c.lineTo(p[0],p[1]));c.closePath();
    if(isXray){
      c.fillStyle=rc(col,0.15);c.fill();c.strokeStyle=rc(wlRGB,0.85);c.lineWidth=1.2;c.stroke();
      c.strokeStyle=rc(wlRGB,0.45);c.lineWidth=0.6;
      const p0=projected[0];projected.forEach((p,i)=>{if(i>0&&i<projected.length-1){c.beginPath();c.moveTo(p0[0],p0[1]);c.lineTo(p[0],p[1]);c.stroke();}});
    } else {
      c.fillStyle=rc(col,0.92);c.fill();
      if(projected[2]){const sc=projected[2][2];const sg=c.createRadialGradient(projected[2][0],projected[2][1],0,projected[2][0],projected[2][1],75*sc);sg.addColorStop(0,rc(wlRGB,0.55*irid));sg.addColorStop(1,'rgba(0,0,0,0)');c.save();c.clip();c.fillStyle=sg;c.fillRect(0,0,W,H);c.restore();}
      c.strokeStyle=rc(darkC,0.75);c.lineWidth=1.2;c.stroke();
      c.strokeStyle=rc(darkC,0.4);c.lineWidth=0.7;
      const p0=projected[0];projected.forEach((p,i)=>{if(i>0&&i<projected.length-1){c.beginPath();c.moveTo(p0[0],p0[1]);c.lineTo(p[0],p[1]);c.stroke();}});
      [[2,0.45],[4,0.28]].forEach(([pi,op])=>{const p=projected[pi];if(!p)return;c.beginPath();c.arc(p[0],p[1],5*p[2],0,Math.PI*2);c.fillStyle=rc(spotC,op);c.fill();});
    }
  });
  const b0=proj(0,-0.55,0.01),b1=proj(0,0.55,0.01);
  ctx2.beginPath();ctx2.moveTo(b0[0],b0[1]);ctx2.lineTo(b1[0],b1[1]);
  ctx2.strokeStyle='rgba(8,8,8,0.95)';ctx2.lineWidth=10*b0[2];ctx2.stroke();
  ctx2.strokeStyle='rgba(255,255,255,0.18)';ctx2.lineWidth=1;ctx2.stroke();
  [[-1],[1]].forEach(([s])=>{
    const a0=proj(s*0.02,-0.50,0.01),am=proj(s*0.14,-0.72,0.01),a1=proj(s*0.22,-0.84,0.01);
    ctx2.strokeStyle='rgba(180,180,210,0.6)';ctx2.lineWidth=1;
    ctx2.beginPath();ctx2.moveTo(a0[0],a0[1]);ctx2.quadraticCurveTo(am[0],am[1],a1[0],a1[1]);ctx2.stroke();
    ctx2.beginPath();ctx2.arc(a1[0],a1[1],3*a1[2],0,Math.PI*2);ctx2.fillStyle='rgba(200,200,225,0.75)';ctx2.fill();
  });
}

function simDraw(){
  const sp=SP[S.spIdx];
  const irid=iridFactor(S.el,S.wl,S.ft);
  const mainC=wingColor(sp,irid,S.wl);
  const hindC=wingColor(sp,irid*0.82,S.wl);
  const darkC=sp.dark,spotC=sp.spot,wlRGB=wlToRGB(S.wl);
  const flap=S.anim==='Flapping'?Math.sin(S.fp)*0.55:0;
  const breathe=S.anim==='Breathing'?1+Math.sin(S.t*1.2)*0.055:1;
  const c=ctx2;

  c.clearRect(0,0,W,H);
  const bg=c.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#020412');bg.addColorStop(1,'#080818');
  c.fillStyle=bg;c.fillRect(0,0,W,H);

  for(let i=0;i<200;i++){
    const sx=(Math.abs(Math.sin(i*73.1))*W)|0;
    const sy=(Math.abs(Math.cos(i*47.3))*(H*0.85))|0;
    const br=0.3+0.55*(Math.sin(i*1.3+S.t*0.6)*0.5+0.5);
    c.beginPath();c.arc(sx,sy,0.7,0,Math.PI*2);c.fillStyle=`rgba(255,255,255,${br*0.65})`;c.fill();
  }

  const azR=(S.az-90)*Math.PI/180,elR=S.el*Math.PI/180;
  const sunX=CX+Math.cos(azR)*260*0.7,sunY=CY-Math.sin(elR)*200*0.6-30;
  const sg=c.createRadialGradient(sunX,sunY,0,sunX,sunY,52);
  sg.addColorStop(0,rc(wlRGB,0.95));sg.addColorStop(0.45,rc(wlRGB,0.38));sg.addColorStop(1,'rgba(0,0,0,0)');
  c.fillStyle=sg;c.fillRect(sunX-65,sunY-65,130,130);

  c.save();c.strokeStyle=rc(wlRGB,0.32);c.lineWidth=1.5;c.setLineDash([10,8]);
  c.beginPath();c.moveTo(sunX,sunY);c.lineTo(CX,CY);c.stroke();c.setLineDash([]);
  const rayA=Math.atan2(CY-sunY,CX-sunX);
  c.strokeStyle=rc(wlRGB,0.28);c.lineWidth=1;c.beginPath();c.arc(CX,CY,50,rayA,rayA+0.55);c.stroke();
  c.fillStyle=rc(wlRGB,0.9);c.font='500 12px Outfit,sans-serif';c.textAlign='center';c.fillText(S.el+'°',CX+68,CY-10);
  c.restore();

  c.strokeStyle='rgba(255,255,255,0.05)';c.lineWidth=1;c.beginPath();c.moveTo(0,H-32);c.lineTo(W,H-32);c.stroke();

  if(S.view==='3D Orbit')draw3D(mainC,hindC,darkC,spotC,wlRGB,irid,sp,flap,breathe,false);
  else if(S.view==='X-Ray')draw3D(mainC,hindC,darkC,spotC,wlRGB,irid,sp,flap,breathe,true);
  else if(S.view==='Front')draw2D(CX,CY,mainC,hindC,darkC,spotC,wlRGB,irid,sp,flap,breathe);
  else if(S.view==='Top'){c.save();c.translate(CX,CY);c.scale(1,0.42);c.translate(-CX,-CY);draw2D(CX,CY,mainC,hindC,darkC,spotC,wlRGB,irid,sp,flap,breathe);c.restore();}
  else if(S.view==='Side'){
    c.save();c.translate(CX,CY);
    const bG=c.createLinearGradient(-15,0,15,0);bG.addColorStop(0,rc(mainC));bG.addColorStop(0.5,rc(hindC));bG.addColorStop(1,rc(darkC,0.8));
    c.beginPath();c.ellipse(0,0,15,112,0,0,Math.PI*2);c.fillStyle=bG;c.fill();
    const ssG=c.createRadialGradient(-5,-20,0,-5,-20,60);ssG.addColorStop(0,rc(wlRGB,0.45*irid));ssG.addColorStop(1,'rgba(0,0,0,0)');
    c.save();c.clip();c.fillStyle=ssG;c.fillRect(-80,-120,160,240);c.restore();
    c.strokeStyle=rc(darkC);c.lineWidth=1.5;c.stroke();
    c.beginPath();c.ellipse(2,0,5,56,0,0,Math.PI*2);c.fillStyle='#080808';c.fill();
    c.strokeStyle='rgba(190,190,210,0.6)';c.lineWidth=1.2;
    [[-1],[1]].forEach(([s])=>{c.beginPath();c.moveTo(s*2,-52);c.quadraticCurveTo(s*14,-78,s*22,-92);c.stroke();c.beginPath();c.arc(s*22,-92,3,0,Math.PI*2);c.fillStyle='rgba(200,200,220,0.7)';c.fill();});
    c.restore();
  } else if(S.view==='Back'){
    const mutMain=lerp3(darkC,sp.base,0.25),mutHind=lerp3(darkC,sp.irid,0.18),mutSpot=lerp3(darkC,[200,180,140],0.5);
    draw2D(CX,CY,mutMain,mutHind,darkC,mutSpot,wlRGB,irid*0.3,sp,flap,breathe);
  }

  // Spectrum bar
  const bx=18,by=H-26,bw=160,bh=8;
  for(let i=0;i<bw;i++){const cc=wlToRGB(380+320*i/bw);c.fillStyle=`rgb(${cc[0]},${cc[1]},${cc[2]})`;c.fillRect(bx+i,by,1,bh);}
  c.strokeStyle='rgba(255,255,255,0.2)';c.lineWidth=0.5;c.strokeRect(bx,by,bw,bh);
  const mx2=bx+bw*(S.wl-380)/320;
  c.beginPath();c.moveTo(mx2,by-4);c.lineTo(mx2,by+bh+4);c.strokeStyle='rgba(255,255,255,0.9)';c.lineWidth=1.5;c.stroke();
  c.fillStyle='rgba(255,255,255,0.6)';c.font='10px DM Mono,monospace';
  c.textAlign='left';c.fillText('380',bx,by-7);c.textAlign='right';c.fillText('700nm',bx+bw,by-7);

  document.getElementById('c-ir').textContent=Math.round(irid*100)+'%';
}

let lastT=0;
function simLoop(now){
  requestAnimationFrame(simLoop);
  const dt=Math.min((now-lastT)/1000,0.05);lastT=now;
  S.t+=dt;
  if(S.anim==='Flapping')S.fp+=dt*3.5;
  if(S.anim==='Auto-rotate'){S.rH+=dt*30;S.camH=S.rH;}
  simDraw();
}
requestAnimationFrame(simLoop);

// ══════════════════════════════════════════════════════
//  LIFECYCLE STAGE ILLUSTRATIONS (Canvas drawings)
// ══════════════════════════════════════════════════════
function drawEgg(canvas){
  const c=canvas.getContext('2d'), W=canvas.width, H=canvas.height, cx=W/2, cy=H/2;
  c.clearRect(0,0,W,H);
  // Leaf background
  c.beginPath(); c.ellipse(cx,cy+20,58,35,0.2,0,Math.PI*2);
  c.fillStyle='#1a4a1a'; c.fill();
  c.strokeStyle='#2a6a2a'; c.lineWidth=1; c.stroke();
  // Leaf veins
  c.strokeStyle='rgba(80,180,80,0.4)'; c.lineWidth=0.7;
  for(let i=-3;i<=3;i++){
    c.beginPath(); c.moveTo(cx,cy+10);
    c.quadraticCurveTo(cx+i*15,cy+20,cx+i*25,cy+40); c.stroke();
  }
  // Eggs cluster
  const eggPos=[[0,-12],[18,-6],[-18,-6],[9,6],[-9,6],[0,18]];
  eggPos.forEach(([ex,ey],i)=>{
    const g=c.createRadialGradient(cx+ex-3,cy+ey-3,1,cx+ex,cy+ey,10);
    g.addColorStop(0,'#d4f5d0');
    g.addColorStop(0.4,'#7dd87a');
    g.addColorStop(1,'#2a7a28');
    c.beginPath(); c.ellipse(cx+ex,cy+ey,8,10,0,0,Math.PI*2);
    c.fillStyle=g; c.fill();
    c.strokeStyle='rgba(255,255,255,0.25)'; c.lineWidth=0.8; c.stroke();
    // Ribbing
    c.strokeStyle='rgba(255,255,255,0.15)'; c.lineWidth=0.5;
    for(let r=1;r<=4;r++){
      c.beginPath(); c.ellipse(cx+ex,cy+ey,8,10*(r/5),0,0,Math.PI*2);
      c.stroke();
    }
  });
}

function drawLarva(canvas){
  const c=canvas.getContext('2d'), W=canvas.width, H=canvas.height, cx=W/2, cy=H/2+10;
  c.clearRect(0,0,W,H);
  // Branch
  c.beginPath(); c.moveTo(15,cy+25); c.lineTo(W-15,cy+25);
  c.strokeStyle='#5a3a1a'; c.lineWidth=8; c.lineCap='round'; c.stroke();
  c.strokeStyle='#7a5a3a'; c.lineWidth=2; c.stroke();
  // Body segments
  const segs=8;
  for(let i=0;i<segs;i++){
    const sx=28+i*11, bh=i===0?11:9;
    const g=c.createRadialGradient(sx-2,cy-2,1,sx,cy,bh);
    const isRed=i===2||i===4;
    g.addColorStop(0,isRed?'#ff9980':'#c0d870');
    g.addColorStop(0.5,isRed?'#cc3322':'#6a9a20');
    g.addColorStop(1,isRed?'#881a10':'#3a6010');
    c.beginPath(); c.ellipse(sx,cy,bh,bh,0,0,Math.PI*2);
    c.fillStyle=g; c.fill();
    c.strokeStyle='rgba(0,0,0,0.3)'; c.lineWidth=0.5; c.stroke();
  }
  // Head
  const hg=c.createRadialGradient(cx-28,cy-2,2,cx-28,cy,13);
  hg.addColorStop(0,'#d04020'); hg.addColorStop(1,'#601008');
  c.beginPath(); c.ellipse(cx-28,cy,13,12,0,0,Math.PI*2);
  c.fillStyle=hg; c.fill();
  // Eyes
  c.beginPath(); c.arc(cx-33,cy-4,3,0,Math.PI*2); c.fillStyle='#fff'; c.fill();
  c.beginPath(); c.arc(cx-33,cy-4,1.5,0,Math.PI*2); c.fillStyle='#111'; c.fill();
  // Tufts (hair-like structures)
  [[30,cy-12],[52,cy-11],[74,cy-11],[96,cy-11]].forEach(([tx,ty])=>{
    for(let t=-2;t<=2;t++){
      c.beginPath(); c.moveTo(tx,ty); c.lineTo(tx+t*3,ty-10);
      c.strokeStyle='rgba(200,230,100,0.7)'; c.lineWidth=0.8; c.stroke();
    }
  });
  // Legs
  for(let i=0;i<6;i++){
    const lx=42+i*12, ly=cy+9;
    c.beginPath(); c.moveTo(lx,ly); c.lineTo(lx+4,ly+12);
    c.strokeStyle='#4a6010'; c.lineWidth=1.5; c.stroke();
  }
}

function drawPupa(canvas){
  const c=canvas.getContext('2d'), W=canvas.width, H=canvas.height, cx=W/2, cy=H/2;
  c.clearRect(0,0,W,H);
  // Branch thread
  c.beginPath(); c.moveTo(cx,20); c.lineTo(cx,48);
  c.strokeStyle='rgba(200,210,180,0.6)'; c.lineWidth=1.2; c.stroke();
  // Chrysalis body
  const cg=c.createLinearGradient(cx-22,cy-32,cx+22,cy+40);
  cg.addColorStop(0,'#90c060'); cg.addColorStop(0.3,'#c8e890');
  cg.addColorStop(0.6,'#70a840'); cg.addColorStop(1,'#387020');
  c.beginPath();
  c.moveTo(cx,cy-38);
  c.bezierCurveTo(cx+24,cy-30,cx+28,cy+10,cx+18,cy+40);
  c.bezierCurveTo(cx+8,cy+52,cx-8,cy+52,cx-18,cy+40);
  c.bezierCurveTo(cx-28,cy+10,cx-24,cy-30,cx,cy-38);
  c.fillStyle=cg; c.fill();
  // Gold spots
  [[cx-8,cy-15],[cx+8,cy-10],[cx,cy+5],[cx-10,cy+20],[cx+10,cy+18]].forEach(([gx,gy])=>{
    c.beginPath(); c.arc(gx,gy,3.5,0,Math.PI*2);
    const sg=c.createRadialGradient(gx-1,gy-1,0,gx,gy,3.5);
    sg.addColorStop(0,'#fffaaa'); sg.addColorStop(1,'#c89020');
    c.fillStyle=sg; c.fill();
  });
  // Segmentation lines
  c.strokeStyle='rgba(40,80,10,0.4)'; c.lineWidth=0.8;
  for(let s=0;s<5;s++){
    const sy=cy-10+s*14;
    c.beginPath(); c.moveTo(cx-18+s*1,sy); c.lineTo(cx+18-s*1,sy); c.stroke();
  }
  // Shine
  const sh=c.createRadialGradient(cx-8,cy-20,2,cx-8,cy-20,20);
  sh.addColorStop(0,'rgba(255,255,255,0.4)'); sh.addColorStop(1,'rgba(0,0,0,0)');
  c.fillStyle=sh; c.fillRect(0,0,W,H);
}

function drawAdult(canvas){
  const c=canvas.getContext('2d'), W=canvas.width, H=canvas.height, cx=W/2, cy=H/2+8;
  c.clearRect(0,0,W,H);
  const t=Date.now()*0.003;
  const flap=Math.sin(t)*0.18;
  // Forewings
  [[1,-1],[-1,-1]].forEach(([sx])=>{
    c.save(); c.translate(cx,cy); c.rotate(sx*flap);
    c.beginPath();
    c.moveTo(0,0);
    c.bezierCurveTo(sx*8,-36,sx*50,-50,sx*60,-14);
    c.bezierCurveTo(sx*64,4,sx*36,24,0,5);
    c.closePath();
    const fg=c.createLinearGradient(0,0,sx*60,0);
    fg.addColorStop(0,'#0a1a6e'); fg.addColorStop(0.35,'#1a60e8');
    fg.addColorStop(0.65,'#30a8ff'); fg.addColorStop(1,'#0a1a6e');
    c.fillStyle=fg; c.fill();
    // Iridescent shimmer
    const ig=c.createRadialGradient(sx*28,-22,0,sx*28,-22,32);
    ig.addColorStop(0,'rgba(140,220,255,0.55)'); ig.addColorStop(1,'rgba(0,0,0,0)');
    c.save(); c.clip(); c.fillStyle=ig; c.fillRect(-80,-80,160,160); c.restore();
    c.strokeStyle='rgba(0,10,40,0.5)'; c.lineWidth=0.8; c.stroke();
    // Black border
    c.beginPath();
    c.moveTo(0,0);
    c.bezierCurveTo(sx*8,-36,sx*50,-50,sx*60,-14);
    c.strokeStyle='rgba(5,5,20,0.6)'; c.lineWidth=6; c.stroke();
    // White spots
    [[sx*52,-12],[sx*46,-22],[sx*38,-30]].forEach(([dx,dy])=>{
      c.beginPath(); c.arc(dx,dy,2.5,0,Math.PI*2);
      c.fillStyle='rgba(255,255,255,0.7)'; c.fill();
    });
    c.restore();
  });
  // Hindwings
  [[1,-1],[-1,-1]].forEach(([sx])=>{
    c.save(); c.translate(cx,cy); c.rotate(sx*flap*0.7);
    c.beginPath();
    c.moveTo(0,5);
    c.bezierCurveTo(sx*8,12,sx*52,8,sx*56,28);
    c.bezierCurveTo(sx*58,46,sx*32,58,0,40);
    c.closePath();
    const hg=c.createLinearGradient(0,5,sx*56,28);
    hg.addColorStop(0,'#08146a'); hg.addColorStop(0.5,'#1244c8');
    hg.addColorStop(1,'#08146a');
    c.fillStyle=hg; c.fill();
    c.strokeStyle='rgba(0,5,30,0.5)'; c.lineWidth=0.8; c.stroke();
    c.restore();
  });
  // Body
  c.beginPath(); c.ellipse(cx,cy+18,3,28,0,0,Math.PI*2);
  c.fillStyle='#0a0a18'; c.fill();
  // Antennae
  c.strokeStyle='rgba(180,200,240,0.6)'; c.lineWidth=1;
  [[-1],[1]].forEach(([s])=>{
    c.beginPath(); c.moveTo(cx+s*2,cy-8);
    c.quadraticCurveTo(cx+s*12,cy-28,cx+s*18,cy-42); c.stroke();
    c.beginPath(); c.arc(cx+s*18,cy-42,2.5,0,Math.PI*2);
    c.fillStyle='rgba(200,215,255,0.8)'; c.fill();
  });
  requestAnimationFrame(()=>drawAdult(canvas));
}

// ── LIFECYCLE STAGE DATA ──
const LC_DATA = {
  egg:{
    title:'Egg Stage — Ovum',
    intro:'The Blue Morpho lifecycle begins when a female lays tiny, pale-green, ribbed eggs on the leaves of specific host plants from the Fabaceae family. Each egg is only about 1.5mm in diameter and has a distinctive pale green colour that blends perfectly with leaves.',
    facts:[
      {label:'Duration',val:'9–14 days',desc:'Incubation period varies with temperature'},
      {label:'Diameter',val:'~1.5 mm',desc:'Tiny spherical with ribbed texture'},
      {label:'Host plant',val:'Fabaceae',desc:'Legume family leaves are preferred'},
      {label:'Clutch size',val:'1–3 eggs',desc:'Laid singly or in small clusters'},
    ]
  },
  larva:{
    title:'Caterpillar Stage — Larva',
    intro:'The caterpillar is the primary feeding stage. Morpho larvae are strikingly coloured — dark reddish-brown with bright lime-green or yellow patches. They feed exclusively on the leaves of Fabaceae plants and grow through 5 instar stages, moulting each time. They can grow up to 8cm long and possess irritating urticating hairs.',
    facts:[
      {label:'Duration',val:'60–100 days',desc:'Longest stage — intensive growth'},
      {label:'Max length',val:'~8 cm',desc:'After 5 moults (instars)'},
      {label:'Diet',val:'Fabaceae leaves',desc:'Obligate host plant feeder'},
      {label:'Defence',val:'Urticating hairs',desc:'Irritating to predators'},
    ]
  },
  pupa:{
    title:'Chrysalis Stage — Pupa',
    intro:'The pupa or chrysalis is a remarkable gold-spotted green case that glows in dim light. During this stage the entire larval body is dissolved and reorganised into the adult butterfly — a process called histolysis and histogenesis. The wing scales with their nanostructures are formed during this stage.',
    facts:[
      {label:'Duration',val:'14–21 days',desc:'Complete body reorganisation'},
      {label:'Length',val:'~3.5 cm',desc:'Compact compared to larva'},
      {label:'Colour',val:'Metallic green',desc:'Gold spots reflect IR light'},
      {label:'Key event',val:'Wing scale formation',desc:'Nanostructures built here'},
    ]
  },
  adult:{
    title:'Adult Butterfly — Imago',
    intro:'The adult Blue Morpho has a wingspan of 12–20cm, making it one of the largest butterflies in the world. The iridescent blue of the dorsal wings is produced entirely by photonic nanostructures — not pigment. Adults live 115–125 days and feed on fermenting fruit, fungi, and decomposing matter using a proboscis.',
    facts:[
      {label:'Wingspan',val:'12–20 cm',desc:'Among the world\'s largest'},
      {label:'Lifespan',val:'115–125 days',desc:'Total adult stage'},
      {label:'Colour source',val:'Nanostructure',desc:'No blue pigment whatsoever'},
      {label:'Diet',val:'Fermenting fruit',desc:'Proboscis feeding only'},
    ]
  }
};

function selectStage(key, el){
  document.querySelectorAll('.lc-stage').forEach(s=>s.classList.remove('active'));
  el.classList.add('active');
  const d=LC_DATA[key];
  const panel=document.getElementById('lc-panel');
  const content=document.getElementById('lc-panel-content');
  const factsHTML=d.facts.map(f=>`
    <div class="lc-fact">
      <div class="lc-fact-label">${f.label}</div>
      <div class="lc-fact-val">${f.val}</div>
      <div class="lc-fact-desc">${f.desc}</div>
    </div>`).join('');
  content.innerHTML=`
    <div class="lc-detail-title">${d.title}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px">
      <div><p class="lc-detail-body">${d.intro}</p></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${factsHTML}</div>
    </div>`;
  panel.classList.remove('hidden');
  panel.classList.add('visible');
  setTimeout(()=>panel.scrollIntoView({behavior:'smooth',block:'nearest'}),100);
}

// Init lifecycle canvases
window.addEventListener('load',()=>{
  const eggC=document.getElementById('lc-egg');
  const larvaC=document.getElementById('lc-larva');
  const pupaC=document.getElementById('lc-pupa');
  const adultC=document.getElementById('lc-adult');
  if(eggC){drawEgg(eggC);setInterval(()=>drawEgg(eggC),3000);}
  if(larvaC){drawLarva(larvaC);setInterval(()=>drawLarva(larvaC),3000);}
  if(pupaC){drawPupa(pupaC);setInterval(()=>drawPupa(pupaC),3000);}
  if(adultC){drawAdult(adultC);}
});

// ══════════════════════════════════════════════════════
//  ANATOMY CANVAS
// ══════════════════════════════════════════════════════
const ANAT_REGIONS=[
  {
    id:'forewing',label:'Forewing',eyebrow:'Primary flight surface',
    title:'Forewing (Dorsal)',
    body:'The forewing is the primary lift surface and the main canvas for iridescent structural colour. Covered in thousands of overlapping scales — each containing a precise nanostructure of 200nm lamellae — the forewing produces the iconic electric blue through thin-film interference. The black border is rich in melanin pigment providing UV absorption.',
    facts:[{l:'Scale density',v:'~200/mm²'},{l:'Scale size',v:'~100×50 µm'},{l:'Peak reflect',v:'470 nm'},{l:'Nanostructure',v:'7–9 lamellae'}],
    hit:(x,y,cx,cy)=>{ return (x<cx-10&&x>cx-170&&y>cy-120&&y<cy+10)||(x>cx+10&&x<cx+170&&y>cy-120&&y<cy+10); },
    colour:'rgba(74,144,232,0.25)',stroke:'rgba(74,144,232,0.8)'
  },
  {
    id:'hindwing',label:'Hindwing',eyebrow:'Secondary flight surface',
    title:'Hindwing (Dorsal)',
    body:'The hindwing is slightly smaller and less iridescent than the forewing. It provides stability during flight and aids in gliding. The dorsal hindwing surface has the same nanostructure but the lamellae are thinner and less regular, producing a slightly darker, less saturated blue. The hindwing margin bears a row of white marginal spots.',
    facts:[{l:'Colour',v:'Dark blue'},{l:'Width',v:'~8–10 cm'},{l:'Function',v:'Glide stability'},{l:'Spots',v:'White marginal'}],
    hit:(x,y,cx,cy)=>{ return (x<cx-10&&x>cx-160&&y>cy+10&&y<cy+130)||(x>cx+10&&x<cx+160&&y>cy+10&&y<cy+130); },
    colour:'rgba(80,100,220,0.2)',stroke:'rgba(80,100,255,0.7)'
  },
  {
    id:'body',label:'Thorax & Abdomen',eyebrow:'Central body structure',
    title:'Thorax & Abdomen',
    body:'The thorax houses the flight muscles — the largest muscles relative to body size of any flying organism. Six legs and four wings attach at the thorax. The abdomen contains digestive, reproductive, and respiratory systems. The entire body is covered in tiny dark brown scales providing thermoregulation, absorbing solar radiation to warm the butterfly on cool mornings.',
    facts:[{l:'Flight muscles',v:'25% body mass'},{l:'Wing joints',v:'4 articulations'},{l:'Temperature',v:'35–38°C optimal'},{l:'Body length',v:'~4–5 cm'}],
    hit:(x,y,cx,cy)=>{ return Math.abs(x-cx)<16&&Math.abs(y-cy-5)<75; },
    colour:'rgba(180,180,200,0.2)',stroke:'rgba(200,200,240,0.7)'
  },
  {
    id:'antennae',label:'Antennae',eyebrow:'Sensory organs',
    title:'Antennae & Sensory System',
    body:'The clubbed antennae are covered in thousands of chemoreceptor and mechanoreceptor sensilla. They detect pheromones from potential mates up to 2km away, sense air currents for flight correction, and detect plant volatiles for host location. The club-shaped tip (capitulum) houses the densest concentration of olfactory neurons.',
    facts:[{l:'Length',v:'~4 cm'},{l:'Sensilla',v:'Thousands'},{l:'Detection range',v:'~2 km (pheromone)'},{l:'Function',v:'Smell + balance'}],
    hit:(x,y,cx,cy)=>{ return Math.abs(x-cx)<50&&y<cy-80&&y>cy-180; },
    colour:'rgba(200,200,100,0.2)',stroke:'rgba(240,240,100,0.8)'
  },
  {
    id:'border',label:'Black Border',eyebrow:'Melanin marginal band',
    title:'Black Marginal Border',
    body:'The jet-black border of the forewing is loaded with melanin pigment — the only true pigment in the Blue Morpho\'s wing. This border serves multiple functions: absorbing harmful UV radiation to protect underlying wing structures, providing high-contrast patterning for intraspecies signalling, and breaking up the wing outline to confuse predators in flight.',
    facts:[{l:'Width',v:'8–14 mm'},{l:'Pigment',v:'Eumelanin'},{l:'UV absorption',v:'>95%'},{l:'Function',v:'Signal + protection'}],
    hit:(x,y,cx,cy)=>{
      const inLeft=x<cx-10&&x>cx-180&&y>cy-130&&y<cy+120;
      const inRight=x>cx+10&&x<cx+180&&y>cy-130&&y<cy+120;
      if(!inLeft&&!inRight)return false;
      const distL=Math.abs(x-(cx-175)); const distR=Math.abs(x-(cx+175));
      return Math.min(distL,distR)<28;
    },
    colour:'rgba(30,30,50,0.3)',stroke:'rgba(150,150,200,0.6)'
  },
];

(function initAnatomyCanvas(){
  const canvas=document.getElementById('anatomy-canvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const W=canvas.width, H=canvas.height, cx=W/2, cy=H/2+30;
  let hoveredId=null, animT=0;

  function drawButterfly(hId){
    ctx.clearRect(0,0,W,H);
    // Background gradient
    const bg=ctx.createRadialGradient(cx,cy,0,cx,cy,280);
    bg.addColorStop(0,'#080820'); bg.addColorStop(1,'#030310');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

    animT+=0.015;
    const glow=0.5+0.5*Math.sin(animT);

    function drawRegionOverlay(reg){
      if(hId===reg.id){
        ctx.save();
        ctx.globalAlpha=0.4+0.2*glow;
        ctx.strokeStyle=reg.stroke; ctx.lineWidth=2;
        ctx.setLineDash([6,4]); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle=reg.colour; ctx.fill();
        ctx.restore();
      }
    }

    // Forewings
    [[1,-1],[-1,-1]].forEach(([sx])=>{
      ctx.beginPath();
      ctx.moveTo(cx,cy);
      ctx.bezierCurveTo(cx+sx*20,cy-90,cx+sx*120,cy-115,cx+sx*155,cy-25);
      ctx.bezierCurveTo(cx+sx*165,cy+15,cx+sx*90,cy+65,cx,cy+10);
      ctx.closePath();
      // Fill
      const fg=ctx.createLinearGradient(cx,cy-100,cx+sx*150,cy);
      fg.addColorStop(0,'#06104a'); fg.addColorStop(0.3,'#1248c8');
      fg.addColorStop(0.6,'#1a70e8'); fg.addColorStop(0.85,'#0a3090');
      fg.addColorStop(1,'#040e30');
      ctx.fillStyle=fg; ctx.fill();
      // Iridescence
      const ig=ctx.createRadialGradient(cx+sx*65,cy-55,0,cx+sx*65,cy-55,90);
      ig.addColorStop(0,`rgba(100,200,255,${0.45+0.25*glow})`);
      ig.addColorStop(0.5,`rgba(50,120,255,${0.2+0.1*glow})`);
      ig.addColorStop(1,'rgba(0,0,0,0)');
      ctx.save(); ctx.beginPath();
      ctx.moveTo(cx,cy); ctx.bezierCurveTo(cx+sx*20,cy-90,cx+sx*120,cy-115,cx+sx*155,cy-25);
      ctx.bezierCurveTo(cx+sx*165,cy+15,cx+sx*90,cy+65,cx,cy+10); ctx.closePath();
      ctx.clip(); ctx.fillStyle=ig; ctx.fillRect(0,0,W,H); ctx.restore();
      // Black border
      ctx.beginPath();
      ctx.moveTo(cx,cy);
      ctx.bezierCurveTo(cx+sx*20,cy-90,cx+sx*120,cy-115,cx+sx*155,cy-25);
      ctx.bezierCurveTo(cx+sx*165,cy+15,cx+sx*90,cy+65,cx,cy+10);
      ctx.strokeStyle='rgba(4,4,15,0.9)'; ctx.lineWidth=18; ctx.stroke();
      // White spots on border
      [[sx*140,cy-18],[sx*148,cy-36],[sx*142,cy-54],[sx*130,cy-68],[sx*115,cy-80]].forEach(([dx,dy])=>{
        ctx.beginPath(); ctx.arc(dx,dy,3.5,0,Math.PI*2);
        ctx.fillStyle='rgba(255,255,255,0.65)'; ctx.fill();
      });
      // Forewing overlay check
      ctx.beginPath();
      ctx.moveTo(cx,cy); ctx.bezierCurveTo(cx+sx*20,cy-90,cx+sx*120,cy-115,cx+sx*155,cy-25);
      ctx.bezierCurveTo(cx+sx*165,cy+15,cx+sx*90,cy+65,cx,cy+10); ctx.closePath();
      drawRegionOverlay(ANAT_REGIONS[0]);
    });

    // Hindwings
    [[1,-1],[-1,-1]].forEach(([sx])=>{
      ctx.beginPath();
      ctx.moveTo(cx,cy+10);
      ctx.bezierCurveTo(cx+sx*18,cy+28,cx+sx*130,cy+22,cx+sx*148,cy+68);
      ctx.bezierCurveTo(cx+sx*155,cy+105,cx+sx*75,cy+140,cx,cy+95);
      ctx.closePath();
      const hg=ctx.createLinearGradient(cx,cy+10,cx+sx*148,cy+68);
      hg.addColorStop(0,'#04083a'); hg.addColorStop(0.5,'#0a30a0');
      hg.addColorStop(1,'#040828');
      ctx.fillStyle=hg; ctx.fill();
      ctx.strokeStyle='rgba(4,4,15,0.8)'; ctx.lineWidth=16; ctx.stroke();
      // Hindwing white spots
      [[sx*130,cy+60],[sx*118,cy+75],[sx*100,cy+90],[sx*78,cy+102],[sx*56,cy+110]].forEach(([dx,dy])=>{
        ctx.beginPath(); ctx.arc(dx,dy,3,0,Math.PI*2);
        ctx.fillStyle='rgba(255,255,255,0.55)'; ctx.fill();
      });
      ctx.beginPath();
      ctx.moveTo(cx,cy+10); ctx.bezierCurveTo(cx+sx*18,cy+28,cx+sx*130,cy+22,cx+sx*148,cy+68);
      ctx.bezierCurveTo(cx+sx*155,cy+105,cx+sx*75,cy+140,cx,cy+95); ctx.closePath();
      drawRegionOverlay(ANAT_REGIONS[1]);
    });

    // Wing veins
    ctx.strokeStyle='rgba(2,8,30,0.55)'; ctx.lineWidth=1;
    [[cx,cy,cx+120,cy-80],[cx,cy,cx+80,cy-95],[cx,cy,cx+50,cy+50],
     [cx,cy,cx-120,cy-80],[cx,cy,cx-80,cy-95],[cx,cy,cx-50,cy+50],
     [cx,cy+10,cx+110,cy+55],[cx,cy+10,cx-110,cy+55]].forEach(([x1,y1,x2,y2])=>{
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    });

    // Body overlay
    ctx.beginPath(); ctx.ellipse(cx,cy+30,14,80,0,0,Math.PI*2);
    ctx.fillStyle='#07071a'; ctx.fill();
    ctx.strokeStyle='rgba(100,120,180,0.3)'; ctx.lineWidth=1; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx,cy+30,14,80,0,0,Math.PI*2);
    drawRegionOverlay(ANAT_REGIONS[2]);

    // Antennae
    [[-1],[1]].forEach(([s])=>{
      ctx.beginPath(); ctx.moveTo(cx+s*4,cy-45);
      ctx.quadraticCurveTo(cx+s*28,cy-105,cx+s*42,cy-155);
      ctx.strokeStyle='rgba(160,180,220,0.6)'; ctx.lineWidth=1.5; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx+s*44,cy-158,5,8,s*0.4,0,Math.PI*2);
      ctx.fillStyle='rgba(180,200,240,0.7)'; ctx.fill();
    });
    ctx.beginPath(); ctx.moveTo(cx-42,cy-45); ctx.lineTo(cx+42,cy-45);
    ctx.lineTo(cx+42,cy-165); ctx.lineTo(cx-42,cy-165); ctx.closePath();
    drawRegionOverlay(ANAT_REGIONS[3]);

    // Border overlay regions (just outlines)
    [[1,-1],[-1,-1]].forEach(([sx])=>{
      ctx.beginPath();
      ctx.moveTo(cx,cy); ctx.bezierCurveTo(cx+sx*20,cy-90,cx+sx*120,cy-115,cx+sx*155,cy-25);
      ctx.bezierCurveTo(cx+sx*165,cy+15,cx+sx*90,cy+65,cx,cy+10); ctx.closePath();
      drawRegionOverlay(ANAT_REGIONS[4]);
      ctx.beginPath();
      ctx.moveTo(cx,cy+10); ctx.bezierCurveTo(cx+sx*18,cy+28,cx+sx*130,cy+22,cx+sx*148,cy+68);
      ctx.bezierCurveTo(cx+sx*155,cy+105,cx+sx*75,cy+140,cx,cy+95); ctx.closePath();
      drawRegionOverlay(ANAT_REGIONS[4]);
    });

    // Hover labels
    ANAT_REGIONS.forEach(reg=>{
      if(hId===reg.id) return;
      const labelPos={
        forewing:{x:cx+105,y:cy-60},
        hindwing:{x:cx+110,y:cy+65},
        body:{x:cx+30,y:cy+35},
        antennae:{x:cx+58,y:cy-120},
        border:{x:cx+148,y:cy-5}
      };
      const lp=labelPos[reg.id];
      if(lp){
        ctx.save();
        ctx.fillStyle='rgba(74,144,232,0.7)';
        ctx.beginPath(); ctx.arc(lp.x,lp.y,4,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.55)';
        ctx.font='10px DM Mono,monospace';
        ctx.textAlign='center';
        ctx.fillText(reg.label,lp.x,lp.y-9);
        ctx.restore();
      }
    });

    requestAnimationFrame(()=>drawButterfly(hoveredId));
  }

  canvas.addEventListener('mousemove',e=>{
    const rect=canvas.getBoundingClientRect();
    const scaleX=canvas.width/rect.width;
    const mx=(e.clientX-rect.left)*scaleX;
    const my=(e.clientY-rect.top)*(canvas.height/rect.height);
    let found=null;
    ANAT_REGIONS.forEach(r=>{ if(r.hit(mx,my,cx,cy)) found=r.id; });
    if(found!==hoveredId){
      hoveredId=found;
      const card=document.getElementById('anat-card');
      const def=document.getElementById('anat-default');
      const cont=document.getElementById('anat-content');
      if(found){
        const reg=ANAT_REGIONS.find(r=>r.id===found);
        document.getElementById('anat-eyebrow').textContent=reg.eyebrow;
        document.getElementById('anat-title').textContent=reg.title;
        document.getElementById('anat-body').textContent=reg.body;
        document.getElementById('anat-facts').innerHTML=reg.facts.map(f=>`
          <div class="anat-fact">
            <div class="anat-fact-label">${f.l}</div>
            <div class="anat-fact-val">${f.v}</div>
          </div>`).join('');
        def.style.display='none'; cont.style.display='block';
        card.classList.add('active');
      } else {
        def.style.display='flex'; cont.style.display='none';
        card.classList.remove('active');
      }
    }
  });

  drawButterfly(null);
})();

// ══════════════════════════════════════════════════════
//  CHARTS (Chart.js)
// ══════════════════════════════════════════════════════
(function initCharts(){
  const chartScript=document.createElement('script');
  chartScript.src='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js';
  chartScript.onload=buildCharts;
  document.head.appendChild(chartScript);

  function buildCharts(){
    Chart.defaults.color='rgba(160,160,200,0.8)';
    Chart.defaults.borderColor='rgba(255,255,255,0.06)';
    Chart.defaults.font.family='DM Mono, monospace';
    Chart.defaults.font.size=11;

    // 1. Reflectance vs Wavelength
    const wls=[],ref=[],refBrown=[];
    for(let wl=380;wl<=700;wl+=5){
      wls.push(wl);
      const r=wl<420?0:(wl<435?0.05+(wl-420)/15*0.15:
        wl<455?0.2+(wl-435)/20*0.5:
        wl<475?0.7+(wl-455)/20*0.28:
        wl<490?0.98-(wl-475)/15*0.35:
        wl<510?0.63-(wl-490)/20*0.45:
        wl<550?0.18-(wl-510)/40*0.12:
        0.06-(wl-550)/150*0.05);
      ref.push(Math.max(0,Math.min(1,r)));
      refBrown.push(wl>500?0.05+(wl-500)/200*0.2:wl>450?0.03+(wl-450)/50*0.02:0.03);
    }
    new Chart(document.getElementById('chart-reflect'),{
      type:'line',
      data:{
        labels:wls,
        datasets:[
          {label:'Blue Morpho (structural)',data:ref,borderColor:'#4a90e8',backgroundColor:'rgba(74,144,232,0.12)',borderWidth:2,fill:true,tension:0.4,pointRadius:0},
          {label:'Brown pigment (control)',data:refBrown,borderColor:'rgba(180,120,60,0.6)',backgroundColor:'rgba(180,120,60,0.05)',borderWidth:1.5,fill:true,tension:0.4,pointRadius:0}
        ]
      },
      options:{responsive:true,plugins:{legend:{display:true,labels:{color:'rgba(160,160,200,0.8)',boxWidth:12}}},
        scales:{
          x:{title:{display:true,text:'Wavelength (nm)',color:'rgba(160,160,200,0.6)'},ticks:{maxTicksLimit:8,color:'rgba(140,140,180,0.6)'}},
          y:{title:{display:true,text:'Reflectance (0–1)',color:'rgba(160,160,200,0.6)'},min:0,max:1.05,ticks:{color:'rgba(140,140,180,0.6)'}}
        }
      }
    });

    // 2. Iridescence vs Angle
    const angles=[],iridB=[],iridG=[],iridR=[];
    for(let a=0;a<=85;a+=2){
      angles.push(a+'°');
      const t=a*Math.PI/180;
      const path=n=>2*n*200*Math.cos(t);
      const irid=n=>(0.5+0.5*Math.cos(2*Math.PI*path(n)/470))*100;
      iridB.push(irid(1.56).toFixed(1));
      iridG.push((0.5+0.5*Math.cos(2*Math.PI*path(1.56)/530))*100);
      iridR.push((0.5+0.5*Math.cos(2*Math.PI*path(1.56)/620))*100);
    }
    new Chart(document.getElementById('chart-angle'),{
      type:'line',
      data:{
        labels:angles,
        datasets:[
          {label:'Blue (470nm)',data:iridB,borderColor:'#4a90e8',backgroundColor:'rgba(74,144,232,0.08)',borderWidth:2,fill:false,tension:0.4,pointRadius:0},
          {label:'Green (530nm)',data:iridG,borderColor:'#4ac874',backgroundColor:'transparent',borderWidth:1.5,fill:false,tension:0.4,pointRadius:0},
          {label:'Red (620nm)',data:iridR,borderColor:'#e85050',backgroundColor:'transparent',borderWidth:1.5,fill:false,tension:0.4,pointRadius:0},
        ]
      },
      options:{responsive:true,plugins:{legend:{display:true,labels:{color:'rgba(160,160,200,0.8)',boxWidth:12}}},
        scales:{
          x:{title:{display:true,text:'Angle of incidence (°)',color:'rgba(160,160,200,0.6)'},ticks:{maxTicksLimit:10,color:'rgba(140,140,180,0.6)'}},
          y:{title:{display:true,text:'Interference intensity (%)',color:'rgba(160,160,200,0.6)'},min:0,max:100,ticks:{color:'rgba(140,140,180,0.6)'}}
        }
      }
    });

    // 4. Nanostructure dimensions
    new Chart(document.getElementById('chart-nano'),{
      type:'bar',
      data:{
        labels:['M. menelaus','M. rhetenor','M. didius','M. achilles','M. aega','M. cypris'],
        datasets:[
          {label:'Lamella spacing (nm)',data:[230,205,240,220,215,235],backgroundColor:'rgba(74,144,232,0.65)',borderColor:'#4a90e8',borderWidth:1.5,borderRadius:3},
          {label:'Film thickness (nm)',data:[200,185,210,195,190,205],backgroundColor:'rgba(139,92,246,0.55)',borderColor:'#8b5cf6',borderWidth:1.5,borderRadius:3}
        ]
      },
      options:{responsive:true,plugins:{legend:{display:true,labels:{color:'rgba(160,160,200,0.8)',boxWidth:12}}},
        scales:{
          x:{ticks:{color:'rgba(160,160,200,0.7)',font:{size:10}}},
          y:{title:{display:true,text:'nm',color:'rgba(160,160,200,0.6)'},ticks:{color:'rgba(140,140,180,0.6)'},min:160,max:260}
        }
      }
    });

  }
})();