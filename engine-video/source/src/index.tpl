<!doctype html>
<html>
<head>
<meta charset="utf-8">
<script src="assets/lib/gsap.min.js"></script>
<style>
@font-face{font-family:"Baloo2";src:url("assets/fonts/baloo-2-devanagari-800-normal.woff2") format("woff2");font-weight:800}
@font-face{font-family:"Mukta";src:url("assets/fonts/mukta-devanagari-700-normal.woff2") format("woff2");font-weight:700}
@font-face{font-family:"Mukta";src:url("assets/fonts/mukta-devanagari-800-normal.woff2") format("woff2");font-weight:800}
html,body{margin:0;background:#0b1d33}
#root{position:absolute;inset:0;width:1920px;height:1080px;overflow:hidden;font-family:"Mukta","Inter",sans-serif;color:#eaf6ff;
 background:radial-gradient(ellipse at 35% 55%,#13345a 0%,#0b1d33 60%,#071426 100%)}
#grid{position:absolute;inset:0;background-image:linear-gradient(rgba(143,211,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(143,211,255,.07) 1px,transparent 1px),linear-gradient(rgba(143,211,255,.13) 1px,transparent 1px),linear-gradient(90deg,rgba(143,211,255,.13) 1px,transparent 1px);background-size:30px 30px,30px 30px,150px 150px,150px 150px}
.eng{position:absolute;left:0;top:0;width:1920px;height:1080px}
.eng svg{width:1920px;height:1080px;overflow:visible}
.svl{font-family:"Baloo2";font-weight:800;font-size:34px;fill:#ffd34d}
.svl.g{fill:#7dffb2}.svl.w{fill:#fff}
.degb{font-family:"Baloo2";font-weight:800;font-size:48px;fill:#ffd34d}
.deg{font-family:"Mukta";font-weight:700;font-size:26px;fill:#8fd3ff}
.panel{position:absolute;left:1080px;top:150px;width:760px;opacity:0}
.it{opacity:0;margin-bottom:22px}
.kick{font-size:34px;font-weight:800;color:#8fd3ff;letter-spacing:2px;text-transform:uppercase;border-left:8px solid #ffd34d;padding-left:18px}
.big{font-family:"Baloo2";font-weight:800;font-size:96px;line-height:1.12}
.huge{font-family:"Baloo2";font-weight:800;font-size:130px;line-height:1.05;margin-bottom:0}
.vs{font-size:50px;font-weight:800;color:#8fd3ff;margin:0 0 0 10px}
.sub{font-size:54px;font-weight:700;margin-top:20px}
.q{font-size:60px;font-weight:700;margin-top:30px;background:rgba(255,211,77,.12);border-radius:18px;padding:14px 28px;display:inline-block}
.mid{font-size:64px;font-weight:800;line-height:1.25}
.row{font-size:46px;font-weight:700;background:rgba(143,211,255,.08);border:2px solid rgba(143,211,255,.25);border-radius:16px;padding:14px 26px}
.row.small{font-size:40px;line-height:1.45}
.row.warn{border-color:#ff8a5c;background:rgba(255,120,60,.12)}
.o{color:#ffb547}.c{color:#7dffb2}
b{color:#ffd34d;font-weight:800}
.head{display:flex;align-items:center;gap:28px;margin-bottom:40px}
.num{font-family:"Baloo2";font-weight:800;font-size:150px;line-height:1;color:#0b1d33;background:#ffd34d;border-radius:28px;width:170px;height:170px;display:flex;align-items:center;justify-content:center;padding-top:12px;box-sizing:border-box}
.num.c2{background:#7dffb2}
.nm{font-family:"Baloo2";font-weight:800;font-size:80px;line-height:1.05}
.nm i{display:block;font-family:"Inter";font-style:normal;font-weight:700;font-size:34px;color:#8fd3ff;margin-top:8px}
.kv{display:flex;justify-content:space-between;gap:20px}
.ra{color:#8fd3ff}.rb{color:#fff;font-weight:800}
.lw{font-family:"Baloo2";font-weight:800;font-size:84px;margin-bottom:6px}
.cols{position:absolute;inset:0;opacity:0}
.colh{position:absolute;top:50px;width:700px;text-align:center;font-family:"Baloo2";font-weight:800;font-size:76px;opacity:0}
.colh.h4{left:130px;color:#ffb547}.colh.h2{left:1090px;color:#7dffb2}
.cl{position:absolute;top:790px;width:760px}
.cl.l{left:100px}.cl.r{left:1060px}
.ci{opacity:0;font-size:46px;font-weight:800;display:inline-flex;align-items:center;gap:14px;margin:0 18px 14px 0;background:rgba(143,211,255,.08);border:2px solid rgba(143,211,255,.25);border-radius:14px;padding:8px 22px}
.ci .ic{color:#7dffb2;font-family:"Inter";font-weight:900}
.ci.bad{border-color:#ff8a5c}.ci.bad .ic{color:#ff6b4a}
.ci.big2{font-family:"Baloo2";font-size:72px;padding:14px 34px;display:block;text-align:center;margin:40px 40px 0}
#root .narrow{left:1420px;width:470px}
.narrow .big{font-size:78px}.narrow .mid{font-size:50px}.narrow .row{font-size:36px}
#flashv{position:absolute;inset:0;background:#fff;opacity:0}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="%TOTAL%" data-width="1920" data-height="1080">
  <div id="grid"></div>
  <div class="eng" id="w4"><svg viewBox="0 0 1920 1080"><defs><radialGradient id="flashGrad"><stop offset="0" stop-color="#fffbe0"/><stop offset=".4" stop-color="#ffb030"/><stop offset="1" stop-color="#ff5a00" stop-opacity="0"/></radialGradient></defs>
    <g transform="translate(560,800) scale(1.5)"><g id="g4"></g><g id="degg"><text id="deg4a" class="deg" x="-265" y="30" text-anchor="middle"></text><text id="deg4b" class="degb" x="-265" y="80" text-anchor="middle"></text><text id="deg4c" class="deg" x="-265" y="120" text-anchor="middle"></text></g>%L4%</g></svg></div>
  <div class="eng" id="w2"><svg viewBox="0 0 1920 1080">
    <g transform="translate(560,800) scale(1.5)"><g id="g2"></g>%L2%</g></svg></div>
  %PANELS%
  %CMP%
  <div id="flashv"></div>
  <audio id="mix" class="clip" src="assets/audio/mix.wav" data-start="0" data-duration="%TOTAL%" data-track-index="2" data-volume="1"></audio>
</div>
<script src="assets/engine.js"></script>
<script>
(function(){
const C=%CFG%; const S=C.S;
const E4=Engine.build(document.getElementById("g4"),"4s");
const E2=Engine.build(document.getElementById("g2"),"2s");
const d4a=document.getElementById("deg4a"),d4b=document.getElementById("deg4b"),d4c=document.getElementById("deg4c");
const loopw=[0,1,2,3].map(i=>document.getElementById("loopw"+i));
const clamp=(x)=>Math.max(0,Math.min(1,x));
const ease=(p)=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
function scene(t){for(const k in S){if(t>=S[k].s&&t<S[k].e)return k;}return "end";}
function drive(t){
  const k=scene(t), lt=t-S[k].s, D=S[k].D;
  let a4=0,a2=0,showDeg=false,arrow4=false,arrow2=false;
  const p=(pad)=>ease(clamp((lt-pad)/(D-2*pad)));
  switch(k){
    case "hook": a4=lt*540; break;
    case "title": a4=lt*300; break;
    case "parts": a4=30; break;
    case "stroke": a4=360*p(0.9); arrow4=true; break;
    case "four": a4=720*clamp(lt/D); showDeg=true; break;
    case "s1": a4=180*p(0.7); showDeg=true; arrow4=true; break;
    case "s2": a4=180+180*p(0.7); showDeg=true; arrow4=true; break;
    case "s3": {const ts=C.spark3-S.s3.s; a4= lt<ts?360:540-180*Math.pow(1-clamp((lt-ts)/(D-ts-0.6)),2.2); showDeg=true; arrow4=true; break;}
    case "s4": a4=540+180*p(0.7); showDeg=true; arrow4=true; break;
    case "loop": a4=lt*260; showDeg=true; break;
    case "two": a2=180-(D-lt)*144; break;
    case "t1": a2=180+180*p(0.6); arrow2=true; break;
    case "t2": {const q=clamp((lt-0.6)/(D-1.2)); a2=360+180*(q<.5?0.5*Math.pow(q*2,0.7):0.5+0.5*Math.pow((q-.5)*2,1.4)); arrow2=true; break;}
    case "oil": a2=lt*330; break;
    default: a4=lt*400; a2=lt*400;
  }
  Engine.update(E4,a4,t,{arrow:arrow4,phaseCb:(phi)=>{
    d4a.textContent=showDeg?"क्रैंक कोण":"";d4b.textContent=showDeg?(Math.round(phi)+"°"):"";d4c.textContent=showDeg?("चक्कर: "+(phi<360?1:2)):"";
    if(k==="loop"){const idx=Math.floor(phi/180)%4;loopw.forEach((w,i)=>{if(w){w.style.color=i===idx?"#ffb547":"#5d7a99";}});}
  }});
  Engine.update(E2,a2,t,{arrow:arrow2,smoke:k==="oil"||k==="cmp"});
}
const tl=gsap.timeline({paused:true});
const proxy={t:0};
tl.to(proxy,{t:C.TOTAL,duration:C.TOTAL,ease:"none",onUpdate:()=>drive(proxy.t)},0);
drive(0);
// panels
document.querySelectorAll(".panel,.cols").forEach(p=>{
  const s=+p.dataset.s,e=+p.dataset.e;
  tl.set(p,{opacity:0},0); tl.set(p,{opacity:1,x:0},s);
  if(e<C.TOTAL-0.1) tl.to(p,{opacity:0,x:-60,duration:0.3,ease:"power2.in"},e-0.32);
  p.querySelectorAll("[data-in]").forEach(it=>{
    tl.fromTo(it,{opacity:0,y:40,scale:0.92},{opacity:1,y:0,scale:1,duration:0.45,ease:"back.out(1.7)"},+it.dataset.in);
    tl.fromTo(it,{textShadow:"0 0 0px rgba(255,200,80,0)"},{textShadow:"0 0 26px rgba(255,200,80,.9)",duration:0.2,yoyo:true,repeat:1},+it.dataset.in+0.3);
  });
});
document.querySelectorAll(".lgrp").forEach(g=>{
  const s=+g.dataset.s,e=+g.dataset.e;
  g.querySelectorAll(".lab").forEach(l=>{tl.fromTo(l,{opacity:0},{opacity:1,duration:0.35},+l.dataset.in);});
  tl.to(g,{opacity:0,duration:0.3},e-0.3);
});
// engine wrappers
const w4="#w4",w2="#w2";
tl.fromTo(w4,{opacity:0.5,scale:1.12,transformOrigin:"560px 800px"},{opacity:1,scale:1,duration:1.0,ease:"power3.out"},0);
tl.fromTo(w2,{opacity:0,x:900},{opacity:0,x:900,duration:0.01},0);
tl.to(w4,{x:-900,opacity:0,duration:0.8,ease:"power2.in"},S.two.s);
tl.fromTo(w2,{x:900,opacity:0},{x:0,opacity:1,duration:0.9,ease:"power3.out",immediateRender:false},S.two.s+0.5);
// compare layout
tl.fromTo(w4,{x:-80,y:-180,scale:0.6,opacity:0,transformOrigin:"560px 800px"},{x:-80,y:-180,scale:0.6,opacity:1,duration:0.7,ease:"power2.out",immediateRender:false},S.cmp.s);
tl.to(w2,{x:880,y:-180,scale:0.6,transformOrigin:"560px 800px",duration:0.9,ease:"power3.inOut"},S.cmp.s);
// slow camera breathing on stage
tl.fromTo("#grid",{backgroundPositionY:"0px"},{backgroundPositionY:"300px",duration:C.TOTAL,ease:"none"},0);
// spark flash
[C.spark3].forEach(ts=>{tl.fromTo("#flashv",{opacity:0.0},{opacity:0.18,duration:0.06,yoyo:true,repeat:1},ts);});
window.__timelines=window.__timelines||{};
window.__timelines["main"]=tl;
})();
</script>
</body>
</html>
