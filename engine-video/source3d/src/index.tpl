<!doctype html>
<html>
<head>
<meta charset="utf-8">
<script src="assets/lib/gsap.min.js"></script>
<script src="assets/lib/three.min.js"></script>
<style>
@font-face{font-family:"Baloo2";src:url("assets/fonts/baloo-2-devanagari-800-normal.woff2") format("woff2");font-weight:800}
@font-face{font-family:"Mukta";src:url("assets/fonts/mukta-devanagari-700-normal.woff2") format("woff2");font-weight:700}
@font-face{font-family:"Mukta";src:url("assets/fonts/mukta-devanagari-800-normal.woff2") format("woff2");font-weight:800}
html,body{margin:0;background:#07111f}
#root{position:absolute;inset:0;width:1920px;height:1080px;overflow:hidden;font-family:"Mukta","Inter",sans-serif;color:#eef7ff;
 background:radial-gradient(ellipse at 32% 40%,#1b4470 0%,#0d2440 45%,#060f1c 100%)}
#gl{position:absolute;left:0;top:0;width:1920px;height:1080px}
#vig{position:absolute;inset:0;background:radial-gradient(ellipse at 40% 50%,rgba(0,0,0,0) 55%,rgba(0,0,0,.55) 100%);pointer-events:none}
.panel{position:absolute;left:1150px;top:120px;width:700px;opacity:0;padding:34px 40px 18px;border-radius:30px;
 background:linear-gradient(160deg,rgba(14,34,60,.86),rgba(7,18,34,.86));border:2px solid rgba(120,200,255,.28);box-shadow:0 30px 80px rgba(0,0,0,.45)}
#root .narrow{left:1440px;width:400px;padding:26px 30px 10px}
.narrow .big{font-size:70px}.narrow .mid{font-size:44px}.narrow .row{font-size:32px}
.it{opacity:0;margin-bottom:20px}
.kick{font-size:30px;font-weight:800;color:#7fd0ff;letter-spacing:2px;border-left:8px solid #ffc83d;padding-left:16px}
.big{font-family:"Baloo2";font-weight:800;font-size:90px;line-height:1.1;text-shadow:0 6px 24px rgba(0,0,0,.5)}
.huge{font-family:"Baloo2";font-weight:800;font-size:124px;line-height:1.02;margin-bottom:0;text-shadow:0 8px 30px rgba(0,0,0,.5)}
.vs{font-size:48px;font-weight:800;color:#7fd0ff;margin:0 0 0 10px}
.sub{font-size:52px;font-weight:700;margin-top:18px}
.q{font-size:56px;font-weight:700;margin-top:26px;background:rgba(255,200,61,.14);border-radius:18px;padding:12px 26px;display:inline-block}
.mid{font-size:60px;font-weight:800;line-height:1.25}
.row{font-size:42px;font-weight:700;background:rgba(127,208,255,.08);border:2px solid rgba(127,208,255,.25);border-radius:16px;padding:12px 24px}
.row.small{font-size:38px;line-height:1.45}
.row.warn{border-color:#ff8a5c;background:rgba(255,120,60,.14)}
.o{color:#ffb03b}.c{color:#6dffb0}
b{color:#ffc83d;font-weight:800}
.head{display:flex;align-items:center;gap:26px;margin-bottom:34px}
.num{font-family:"Baloo2";font-weight:800;font-size:130px;line-height:1;color:#0b1d33;background:linear-gradient(160deg,#ffe27a,#ffb020);border-radius:28px;width:150px;height:150px;display:flex;align-items:center;justify-content:center;padding-top:10px;box-sizing:border-box;box-shadow:0 10px 30px rgba(255,170,30,.35)}
.num.c2{background:linear-gradient(160deg,#a6ffd0,#2fe08a);box-shadow:0 10px 30px rgba(50,220,140,.35)}
.nm{font-family:"Baloo2";font-weight:800;font-size:74px;line-height:1.05}
.nm i{display:block;font-family:"Inter";font-style:normal;font-weight:700;font-size:32px;color:#7fd0ff;margin-top:8px}
.kv{display:flex;justify-content:space-between;gap:20px}
.ra{color:#7fd0ff}.rb{color:#fff;font-weight:800}
.lw{font-family:"Baloo2";font-weight:800;font-size:80px;margin-bottom:4px}
.cols{position:absolute;inset:0;opacity:0}
.colh{position:absolute;top:44px;width:700px;text-align:center;font-family:"Baloo2";font-weight:800;font-size:80px;opacity:0;text-shadow:0 8px 30px rgba(0,0,0,.6)}
.colh.h4{left:140px;color:#ffb03b}.colh.h2{left:1080px;color:#6dffb0}
.cl{position:absolute;top:875px;width:780px}
.cl.l{left:100px}.cl.r{left:1050px}
.ci{opacity:0;font-size:44px;font-weight:800;display:inline-flex;align-items:center;gap:14px;margin:0 16px 14px 0;background:rgba(10,26,48,.85);border:2px solid rgba(127,208,255,.3);border-radius:14px;padding:8px 22px}
.ci .ic{color:#6dffb0;font-family:"Inter";font-weight:900}
.ci.bad{border-color:#ff8a5c}.ci.bad .ic{color:#ff6b4a}
.ci.big2{font-family:"Baloo2";font-size:70px;padding:14px 34px;display:block;text-align:center;margin:10px 50px 0}
.lab3{position:absolute;left:0;top:0;opacity:0;width:0;height:0}
.lab3 svg{position:absolute;left:0;top:0;overflow:visible}
.lab3 line{stroke:#ffc83d;stroke-width:3}
.lab3 circle{fill:#ffc83d;stroke:#0b1d33;stroke-width:3}
.lab3 .lt{position:absolute;white-space:nowrap;font-family:"Baloo2";font-weight:800;font-size:44px;color:#0b1d33;background:#ffc83d;border-radius:12px;padding:4px 18px 0;box-shadow:0 8px 24px rgba(0,0,0,.45)}
#dial{position:absolute;left:1560px;top:770px;width:280px;height:280px;opacity:0}
#dial2{position:absolute;left:1560px;top:770px;width:280px;height:280px;opacity:0}
.dt{font-family:"Baloo2";font-weight:800;font-size:26px;fill:#fff}
.dv{font-family:"Baloo2";font-weight:800;font-size:44px;fill:#ffc83d}
#flashv{position:absolute;inset:0;background:radial-gradient(circle at 30% 35%,rgba(255,220,150,.9),rgba(255,140,40,0) 60%);opacity:0}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="%TOTAL%" data-width="1920" data-height="1080">
  <canvas id="gl" width="1920" height="1080"></canvas>
  <div id="vig"></div>
  %LABS%
  %PANELS%
  %CMP%
  <svg id="dial" viewBox="-140 -140 280 280">
    <circle r="128" fill="rgba(7,18,34,.88)" stroke="rgba(127,208,255,.35)" stroke-width="3"/>
    <path d="M0,-110 A110,110 0 0,1 110,0" fill="none" stroke="#46aaff" stroke-width="18"/>
    <path d="M110,0 A110,110 0 0,1 0,110" fill="none" stroke="#7a6cff" stroke-width="18"/>
    <path d="M0,110 A110,110 0 0,1 -110,0" fill="none" stroke="#ff7a1a" stroke-width="18"/>
    <path d="M-110,0 A110,110 0 0,1 0,-110" fill="none" stroke="#8d96a3" stroke-width="18"/>
    <g id="needle"><line x1="0" y1="0" x2="0" y2="-120" stroke="#fff" stroke-width="7" stroke-linecap="round"/></g>
    <circle r="62" fill="#0b1d33"/>
    <text id="dialv" class="dv" y="4" text-anchor="middle">0°</text>
    <text id="dialn" class="dt" y="36" text-anchor="middle">सक्शन</text>
  </svg>
  <svg id="dial2" viewBox="-140 -140 280 280">
    <circle r="128" fill="rgba(7,18,34,.88)" stroke="rgba(127,208,255,.35)" stroke-width="3"/>
    <path d="M0,-110 A110,110 0 0,1 0,110" fill="none" stroke="#ff7a1a" stroke-width="18"/>
    <path d="M0,110 A110,110 0 0,1 0,-110" fill="none" stroke="#46aaff" stroke-width="18"/>
    <g id="needle2"><line x1="0" y1="0" x2="0" y2="-120" stroke="#fff" stroke-width="7" stroke-linecap="round"/></g>
    <circle r="62" fill="#0b1d33"/>
    <text id="dial2v" class="dv" y="4" text-anchor="middle">0°</text>
    <text id="dial2n" class="dt" y="36" text-anchor="middle">नीचे</text>
  </svg>
  <div id="flashv"></div>
  <audio id="mix" class="clip" src="assets/audio/mix.wav" data-start="0" data-duration="%TOTAL%" data-track-index="2" data-volume="1"></audio>
</div>
<script src="assets/engine3d.js"></script>
<script>
(function(){
const C=%CFG%; const S=C.S;
const st=Engine3D.createStage(document.getElementById("gl"),1920,1080);
const cam=st.camera, V=THREE.Vector3;
const clamp=(x)=>Math.max(0,Math.min(1,x));
const ease=(p)=>p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
const L=(a,b,k)=>a+(b-a)*k, LV=(a,b,k)=>a.map((v,i)=>L(v,b[i],k));
// camera keyframes per scene: [pos, target, shift px, fov] at start (a) and end (b)
const K={
 hook:  {a:[[2.2,5.0,5.8],[0,3.6,0],300,30], b:[[7,4.2,11.5],[0,2.0,0],380,32]},
 title: {a:[[8,4.4,11],[0,2.0,0],380,32], b:[[-3,3.8,12.5],[0,2.0,0],380,32]},
 parts: {a:[[4,3,14],[0,2.0,0],360,32], b:[[2.5,2.8,14.5],[0,2.0,0],360,32]},
 stroke:{a:[[2.5,2.8,12],[0,2.4,0],380,32], b:[[1.4,2.8,12.5],[0,2.4,0],380,32]},
 four:  {a:[[7,6,11],[0,2.2,0],380,32], b:[[5,5,12.5],[0,2.2,0],380,32]},
 s1:    {a:[[-4.6,5.2,7.4],[-0.5,3.6,0],380,32], b:[[-3,4.8,6.8],[-0.3,3.5,0],380,32]},
 s2:    {a:[[1.8,4,7.8],[0,3.2,0],380,32], b:[[1,3.8,7],[0,3.2,0],380,32]},
 s3:    {a:[[1,4.8,6],[0,3.6,0],380,30], b:[[3.6,3.4,9.2],[0,2.6,0],380,32]},
 s4:    {a:[[5,5,7.8],[0.8,3.6,0],380,32], b:[[3.6,4.6,7.4],[0.8,3.5,0],380,32]},
 loop:  {a:[[6.5,5.6,11],[0,2.0,0],380,32], b:[[-6,5,11.5],[0,2.0,0],380,32]},
 two:   {a:[[-7,5,11],[0,1.7,0],320,32], b:[[-3,3.6,13],[0,1.7,0],320,32]},
 t1:    {a:[[-3.4,1.8,10],[0,1.4,0],380,32], b:[[-2,2.2,9.6],[0,1.5,0],380,32]},
 t2:    {a:[[4.4,3.8,9.2],[0.4,2.2,0],380,32], b:[[2.8,3.2,10],[0.4,2.1,0],380,32]},
 oil:   {a:[[6.2,4,11],[1.4,2.0,0],380,32], b:[[4,3.4,12],[1.4,2.0,0],380,32]},
 cmp:   {a:[[0,5,20],[0,1.6,0],0,32], b:[[0,4.4,19],[0,1.6,0],0,32]},
 end:   {a:[[0,4.4,19],[0,1.6,0],0,32], b:[[0,5.5,21],[0,1.7,0],0,32]},
};
const order=Object.keys(S);
function scene(t){for(const k of order){if(t>=S[k].s&&t<S[k].e)return k;}return "end";}
function camAt(k,lt,D){
  const kf=K[k]; const p=ease(clamp(lt/D));
  let pos=LV(kf.a[0],kf.b[0],p), tg=LV(kf.a[1],kf.b[1],p), sh=L(kf.a[2],kf.b[2],p), fov=L(kf.a[3],kf.b[3],p);
  const i=order.indexOf(k);
  if(i>0&&lt<1.3){const pk=K[order[i-1]], q=ease(clamp(lt/1.3));
    pos=LV(pk.b[0],pos,q); tg=LV(pk.b[1],tg,q); sh=L(pk.b[2],sh,q); fov=L(pk.b[3],fov,q);}
  return {pos,tg,sh,fov};
}
const labs=C.labs.map(l=>({...l,el:document.getElementById(l.id)}));
labs.forEach(l=>{l.line=l.el.querySelector("line");l.txt=l.el.querySelector(".lt");});
const dial=document.getElementById("needle"),dialv=document.getElementById("dialv"),dialn=document.getElementById("dialn");
const dial2=document.getElementById("needle2"),dial2v=document.getElementById("dial2v"),dial2n=document.getElementById("dial2n");
const loopw=[0,1,2,3].map(i=>document.getElementById("loopw"+i));
const NAMES=["सक्शन","कम्प्रेशन","पावर","एग्ज़ॉस्ट"];
const tv=new V();
function drive(t){
  const k=scene(t), lt=t-S[k].s, D=S[k].D;
  const p=(pad)=>ease(clamp((lt-pad)/(D-2*pad)));
  let a4=0,a2=0,smoke4=0,smoke2=0;
  switch(k){
    case "hook": a4=lt*560; break;
    case "title": a4=lt*320; break;
    case "parts": a4=30; break;
    case "stroke": a4=360*p(0.9); break;
    case "four": a4=720*clamp(lt/D); break;
    case "s1": a4=180*p(0.7); break;
    case "s2": a4=180+180*p(0.7); break;
    case "s3": {const ts=C.spark3-S.s3.s; a4= lt<ts?360:540-180*Math.pow(1-clamp((lt-ts)/(D-ts-0.6)),2.2); break;}
    case "s4": a4=540+180*p(0.7); smoke4=1; break;
    case "loop": a4=lt*300; smoke4=1; break;
    case "two": a2=180-(D-lt)*150; break;
    case "t1": a2=180+180*p(0.6); break;
    case "t2": {const q=clamp((lt-0.6)/(D-1.2)); a2=360+180*(q<.5?0.5*Math.pow(q*2,0.7):0.5+0.5*Math.pow((q-.5)*2,1.4)); break;}
    case "oil": a2=lt*330; smoke2=1; break;
    default: a4=lt*420; a2=lt*420; smoke4=0.6; smoke2=1;
  }
  // engine placement
  const g4=st.e4.g, g2=st.e2.g;
  let x4=0,x2=40,s4=1,s2=1;
  const tw=t-S.two.s, tc=t-S.cmp.s;
  if(t>=S.two.s&&t<S.cmp.s){const q=ease(clamp(tw/1.4)); x4=L(0,-14,q); x2=L(14,0,q);}
  if(t>=S.cmp.s){const q=ease(clamp(tc/1.4)); x4=L(-14,-3.6,q); x2=L(0,3.6,q); s4=s2=L(1,0.92,q);}
  g4.position.x=x4; g2.position.x=x2; g4.scale.setScalar(s4); g2.scale.setScalar(s2);
  g4.visible=x4>-13; g2.visible=x2<13;
  const phi=Engine3D.update4(st.e4,a4,t,{smoke:smoke4});
  const r2=Engine3D.update2(st.e2,a2,t,{smoke:smoke2});
  // camera
  const c=camAt(k,lt,D);
  let shake=0;
  if(k==="hook"||k==="s3"){const f=st.e4.fire.material.opacity||0; shake=f*0.05;}
  cam.position.set(c.pos[0]+Math.sin(t*61)*shake,c.pos[1]+Math.cos(t*47)*shake,c.pos[2]);
  cam.fov=c.fov; cam.lookAt(c.tg[0],c.tg[1],c.tg[2]);
  cam.setViewOffset(1920,1080,c.sh,0,1920,1080); cam.updateProjectionMatrix();
  st.renderer.render(st.scene,cam);
  // labels follow 3D anchors
  labs.forEach(l=>{
    const g=l.eng==="e4"?g4:g2;
    tv.set(l.a[0],l.a[1],l.a[2]); g.localToWorld(tv); tv.project(cam);
    const x=(tv.x*0.5+0.5)*1920, y=(-tv.y*0.5+0.5)*1080;
    l.el.style.left=x+"px"; l.el.style.top=y+"px";
    l.line.setAttribute("x2",l.o[0]); l.line.setAttribute("y2",l.o[1]);
    l.txt.style.left=l.o[0]+"px"; l.txt.style.top=(l.o[1]-30)+"px"; l.txt.style.transform=l.o[0]<0?"translateX(-100%)":"none";
  });
  // dials
  dial.setAttribute("transform",`rotate(${phi/2})`);
  dialv.textContent=Math.round(phi)+"°"; dialn.textContent=NAMES[Math.min(3,Math.floor(phi/180))];
  dial2.setAttribute("transform",`rotate(${r2.th})`);
  dial2v.textContent=Math.round(r2.th)+"°"; dial2n.textContent=r2.th<180?"पिस्टन नीचे":"पिस्टन ऊपर";
  if(k==="loop"){const idx=Math.floor(phi/180)%4;loopw.forEach((w,i)=>{if(w){w.style.color=i===idx?"#ffb03b":"#4f6d8c";w.style.transform=i===idx?"scale(1.08)":"scale(1)";}});}
}
const tl=gsap.timeline({paused:true});
const proxy={t:0};
tl.to(proxy,{t:C.TOTAL,duration:C.TOTAL,ease:"none",onUpdate:()=>drive(proxy.t)},0);
document.querySelectorAll(".panel,.cols").forEach(pn=>{
  const s=+pn.dataset.s,e=+pn.dataset.e;
  tl.set(pn,{opacity:0},0);
  tl.fromTo(pn,{opacity:0,x:80},{opacity:1,x:0,duration:0.5,ease:"power3.out",immediateRender:false},s+0.05);
  if(e<C.TOTAL-0.1) tl.to(pn,{opacity:0,x:-60,duration:0.3,ease:"power2.in"},e-0.32);
  pn.querySelectorAll("[data-in]").forEach(it=>{
    tl.fromTo(it,{opacity:0,y:36,scale:0.9},{opacity:1,y:0,scale:1,duration:0.45,ease:"back.out(1.8)"},Math.max(s+0.15,+it.dataset.in));
  });
});
document.querySelectorAll(".lab3").forEach(l=>{
  tl.set(l,{opacity:0},0);
  tl.fromTo(l,{opacity:0},{opacity:1,duration:0.3,immediateRender:false},+l.dataset.in);
  tl.to(l,{opacity:0,duration:0.25},+l.dataset.e-0.3);
});
tl.set("#dial",{opacity:0},0);
tl.to("#dial",{opacity:1,duration:0.4},S.four.s+0.6); tl.to("#dial",{opacity:0,duration:0.3},S.loop.e-0.3);
tl.set("#dial2",{opacity:0},0);
tl.to("#dial2",{opacity:1,duration:0.4},S.t1.s+0.3); tl.to("#dial2",{opacity:0,duration:0.3},S.t2.e-0.3);
[C.spark3,S.t2.s+0.6].forEach(ts=>{tl.fromTo("#flashv",{opacity:0},{opacity:0.55,duration:0.05,yoyo:true,repeat:1,immediateRender:false},ts);});
tl.fromTo("#gl",{opacity:0},{opacity:1,duration:0.6},0);
drive(0);
window.__timelines=window.__timelines||{};
window.__timelines["main"]=tl;
})();
</script>
</body>
</html>
