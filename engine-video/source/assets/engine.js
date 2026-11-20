// Deterministic engine cutaway renderer. All state derives from crank angle.
(function(){
const NS="http://www.w3.org/2000/svg";
const R=70, L=200, HEAD=-345;
function el(tag,attrs,parent){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e;}
function pinY(th){const a=th*Math.PI/180;return -(R*Math.cos(a)+Math.sqrt(L*L-R*R*Math.sin(a)*Math.sin(a)));}
function lerp(a,b,t){return a+(b-a)*t}
function mix(c1,c2,t){return c1.map((v,i)=>Math.round(lerp(v,c2[i],t)));}
function rgb(c,a){return `rgba(${c[0]},${c[1]},${c[2]},${a})`}
const BLUE=[70,170,255], DENSE=[120,110,255], FIRE=[255,140,30], HOT=[255,230,120], SMOKE=[150,160,175];
const LINE="#8fd3ff", METAL="#16314f", METAL2="#1d3f66";

function build(g,type){
  const E={type,g};
  const pistonLen = type==="2s"?150:110;
  E.pistonLen=pistonLen;
  // crankcase
  if(type==="4s"){
    el("path",{d:"M-150,-60 L-150,60 Q-150,150 -60,150 L60,150 Q150,150 150,60 L150,-60 Z",fill:"#0f2742",stroke:LINE,"stroke-width":3},g);
    el("path",{d:"M-140,95 Q0,110 140,95 L140,60 Q140,140 60,140 L-60,140 Q-140,140 -140,60 Z",fill:"rgba(230,170,40,0.35)"},g); // oil sump
  } else {
    E.ccFill=el("path",{d:"M-130,-150 L-130,70 Q-130,135 -55,135 L55,135 Q130,135 130,70 L130,-150 Z",fill:rgb(BLUE,0.2)},g);
    el("path",{d:"M-130,-150 L-130,70 Q-130,135 -55,135 L55,135 Q130,135 130,70 L130,-150",fill:"none",stroke:LINE,"stroke-width":3},g);
  }
  // cylinder walls
  const wallTop = type==="4s"?HEAD:HEAD;
  E.gas=el("rect",{x:-90,y:HEAD,width:180,height:100,fill:rgb(BLUE,0)},g);
  E.flash=el("circle",{cx:0,cy:HEAD+10,r:10,fill:"url(#flashGrad)",opacity:0},g);
  if(type==="4s"){
    // walls full height
    el("rect",{x:-120,y:HEAD,width:30,height:HEAD*-1-60,fill:METAL,stroke:LINE,"stroke-width":3},g);
    el("rect",{x:90,y:HEAD,width:30,height:HEAD*-1-60,fill:METAL,stroke:LINE,"stroke-width":3},g);
    // cooling fins
    for(let i=0;i<5;i++){const y=HEAD+20+i*36;el("rect",{x:-150,y,width:30,height:12,fill:METAL2,stroke:LINE,"stroke-width":2},g);el("rect",{x:120,y,width:30,height:12,fill:METAL2,stroke:LINE,"stroke-width":2},g);}
    // head with ports
    el("path",{d:`M-150,${HEAD} L-150,${HEAD-80} L150,${HEAD-80} L150,${HEAD} Z`,fill:METAL,stroke:LINE,"stroke-width":3},g);
    // intake port (left) and exhaust port (right) channels
    E.inPort=el("path",{d:`M-260,${HEAD-60} L-80,${HEAD-60} L-55,${HEAD} L-35,${HEAD} L-60,${HEAD-30} L-260,${HEAD-30} Z`,fill:"#0a1a2e",stroke:LINE,"stroke-width":2.5},g);
    E.exPort=el("path",{d:`M260,${HEAD-60} L80,${HEAD-60} L55,${HEAD} L35,${HEAD} L60,${HEAD-30} L260,${HEAD-30} Z`,fill:"#0a1a2e",stroke:LINE,"stroke-width":2.5},g);
    E.inFlow=el("g",{},g); E.exFlow=el("g",{},g);
    E.inDots=[];E.exDots=[];
    for(let i=0;i<9;i++){E.inDots.push(el("circle",{r:6,fill:rgb(BLUE,1),opacity:0},E.inFlow));E.exDots.push(el("circle",{r:8,fill:rgb(SMOKE,1),opacity:0},E.exFlow));}
    // valves
    E.inValve=el("g",{},g); E.exValve=el("g",{},g);
    for(const [vg,x] of [[E.inValve,-45],[E.exValve,45]]){
      el("rect",{x:x-5,y:HEAD-150,width:10,height:148,fill:"#c9d6e3",stroke:"#5d7a99","stroke-width":1.5},vg);
      el("path",{d:`M${x-28},${HEAD} L${x+28},${HEAD} L${x+6},${HEAD-14} L${x-6},${HEAD-14} Z`,fill:"#c9d6e3",stroke:"#5d7a99","stroke-width":1.5},vg);
      el("rect",{x:x-14,y:HEAD-160,width:28,height:8,fill:"#c9d6e3"},vg);
      // spring
      let d=`M${x-12},${HEAD-152}`;for(let k=0;k<6;k++){d+=` L${x+12},${HEAD-145+k*10} L${x-12},${HEAD-140+k*10}`;}
      el("path",{d,fill:"none",stroke:"#9fb7cc","stroke-width":2.5},vg);
    }
    E.inLabelState=null;
  } else {
    // two-stroke cylinder with ports
    const EXT=-240, EXB=-185, TRT=-215, TRB=-180, INT=-172, INB=-132;
    E.ports={EXT,EXB,TRT,TRB,INT,INB};
    // left wall with transfer passage
    el("path",{d:`M-90,${HEAD} L-120,${HEAD} L-120,${TRT} L-90,${TRT} Z`,fill:METAL,stroke:LINE,"stroke-width":3},g);
    el("path",{d:`M-90,${TRB} L-120,${TRB} L-120,-150 L-90,-150 Z`,fill:METAL,stroke:LINE,"stroke-width":3},g);
    E.trPass=el("path",{d:`M-120,${TRT} L-165,${TRT-10} L-165,-60 L-130,-60 L-130,-150 L-120,-150 L-120,${TRB} Z`,fill:rgb(BLUE,0.2),stroke:LINE,"stroke-width":2.5},g);
    el("path",{d:`M-120,${HEAD} L-185,${HEAD} L-185,-150 L-130,-150 L-130,-60 L-165,-60 L-165,${TRT-10} L-120,${TRT}`,fill:METAL,stroke:LINE,"stroke-width":3},g);
    // right wall with exhaust port and inlet port
    el("path",{d:`M90,${HEAD} L120,${HEAD} L120,${EXT} L90,${EXT} Z`,fill:METAL,stroke:LINE,"stroke-width":3},g);
    el("path",{d:`M90,${EXB} L120,${EXB} L120,${INT} L90,${INT} Z`,fill:METAL,stroke:LINE,"stroke-width":3},g);
    el("path",{d:`M90,${INB} L120,${INB} L120,-150 L90,-150 Z`,fill:METAL,stroke:LINE,"stroke-width":3},g);
    E.exPort=el("path",{d:`M120,${EXT} L280,${EXT-20} L280,${EXB+10} L120,${EXB} Z`,fill:"#0a1a2e",stroke:LINE,"stroke-width":2.5},g);
    E.inPort=el("path",{d:`M120,${INT} L280,${INT+5} L280,${INB+15} L120,${INB} Z`,fill:"#0a1a2e",stroke:LINE,"stroke-width":2.5},g);
    for(let i=0;i<5;i++){const y=HEAD+15+i*22;el("rect",{x:-215,y,width:30,height:10,fill:METAL2,stroke:LINE,"stroke-width":2},g);el("rect",{x:120,y,width:40,height:10,fill:METAL2,stroke:LINE,"stroke-width":2},g);}
    el("path",{d:`M-185,${HEAD} L-185,${HEAD-50} L160,${HEAD-50} L160,${HEAD} Z`,fill:METAL,stroke:LINE,"stroke-width":3},g);
    E.inFlow=el("g",{},g); E.exFlow=el("g",{},g); E.trFlow=el("g",{},g);
    E.inDots=[];E.exDots=[];E.trDots=[];
    for(let i=0;i<9;i++){E.inDots.push(el("circle",{r:6,fill:rgb(BLUE,1),opacity:0},E.inFlow));E.exDots.push(el("circle",{r:8,fill:rgb(SMOKE,1),opacity:0},E.exFlow));E.trDots.push(el("circle",{r:6,fill:rgb(BLUE,1),opacity:0},E.trFlow));}
  }
  // spark plug
  const sp=el("g",{},g);
  const top= type==="4s"?HEAD-80:HEAD-50;
  el("rect",{x:-14,y:top-70,width:28,height:50,rx:6,fill:"#e8eef5",stroke:"#7b93ad","stroke-width":2},sp);
  el("rect",{x:-20,y:top-22,width:40,height:22,fill:"#9aabbd",stroke:"#5d7a99","stroke-width":2},sp);
  el("rect",{x:-6,y:top,width:12,height:(HEAD-top)+4,fill:"#9aabbd"},sp);
  el("rect",{x:-4,y:top-90,width:8,height:22,fill:"#7b93ad"},sp);
  E.spark=el("path",{d:`M0,${HEAD+2} L-12,${HEAD+14} L4,${HEAD+16} L-6,${HEAD+30} L14,${HEAD+12} L0,${HEAD+10} Z`,fill:"#fff7b0",opacity:0},g);
  // crank
  E.crank=el("g",{},g);
  el("path",{d:"M0,0 m-95,0 a95,95 0 0,1 190,0 L60,30 L-60,30 Z",fill:"#2b5a8a",stroke:LINE,"stroke-width":2.5,transform:"rotate(180)"},E.crank);
  el("circle",{cx:0,cy:0,r:30,fill:"#3a74ad",stroke:LINE,"stroke-width":2.5},E.crank);
  el("circle",{cx:0,cy:-R,r:26,fill:"#3a74ad",stroke:LINE,"stroke-width":2.5},E.crank);
  el("circle",{cx:0,cy:0,r:10,fill:"#0b1d33"},E.crank);
  // rod
  E.rod=el("path",{d:"",fill:"#5b8fc4",stroke:LINE,"stroke-width":2.5},g);
  E.pin2=el("circle",{r:9,fill:"#0b1d33",stroke:LINE,"stroke-width":2},g);
  // piston
  E.piston=el("g",{},g);
  el("rect",{x:-88,y:0,width:176,height:pistonLen,rx:6,fill:"#b9c9d9",stroke:"#e6f2ff","stroke-width":2.5},E.piston);
  for(let k=0;k<3;k++)el("rect",{x:-88,y:12+k*12,width:176,height:4,fill:"#6d859e"},E.piston);
  el("circle",{cx:0,cy:45,r:16,fill:"#7f97b0",stroke:"#e6f2ff","stroke-width":2},E.piston);
  if(type==="2s"){el("path",{d:"M-88,0 Q-40,-14 0,-2 L0,0 Z",fill:"#b9c9d9",stroke:"#e6f2ff","stroke-width":2},E.piston);} // deflector-ish
  // direction arrow
  E.arrow=el("path",{d:"M0,-30 L22,0 L8,0 L8,40 L-8,40 L-8,0 L-22,0 Z",fill:"#ffd34d",opacity:0},g);
  return E;
}
function valveLift(phi,start,end){ if(phi<start||phi>end)return 0; return Math.sin((phi-start)/(end-start)*Math.PI);}
function flowDots(dots,path,amount,t,col){ // path: fn(u)->[x,y]
  const n=dots.length;
  for(let i=0;i<n;i++){const u=((t*0.9+i/n)%1+1)%1;const p=path(u);dots[i].setAttribute("cx",p[0]);dots[i].setAttribute("cy",p[1]);dots[i].setAttribute("opacity",amount*Math.sin(u*Math.PI));if(col)dots[i].setAttribute("fill",col);}
}
function update(E,theta,t,opt){
  opt=opt||{};
  const a=theta*Math.PI/180;
  const py=pinY(theta), top=py-45;
  const cx=R*Math.sin(a), cy=-R*Math.cos(a);
  E.crank.setAttribute("transform",`rotate(${theta})`);
  E.piston.setAttribute("transform",`translate(0,${top})`);
  // rod as tapered quad
  const dx=0-cx, dy=py-cy, len=Math.hypot(dx,dy), nx=-dy/len, ny=dx/len;
  E.rod.setAttribute("d",`M${cx+nx*20},${cy+ny*20} L${0+nx*11},${py+ny*11} L${0-nx*11},${py-ny*11} L${cx-nx*20},${cy-ny*20} Z`);
  E.pin2.setAttribute("cx",cx);E.pin2.setAttribute("cy",cy);
  E.gas.setAttribute("y",HEAD);E.gas.setAttribute("height",Math.max(0,top-HEAD));
  const vel=Math.sin(a); // >0 moving down
  E.arrow.setAttribute("opacity",opt.arrow?Math.min(1,Math.abs(vel)*2):0);
  E.arrow.setAttribute("transform",`translate(${E.type==="4s"?-205:-245},${(HEAD-175)/1+40}) ${vel>0?"rotate(180)":""}`);
  let gasCol=BLUE,gasA=0,flash=0,spark=0;
  if(E.type==="4s"){
    const phi=((theta%720)+720)%720;
    const li=valveLift(phi,-10,190)+valveLift(phi,710,730);
    const le=valveLift(phi,530,730);
    E.inValve.setAttribute("transform",`translate(0,${li*24})`);
    E.exValve.setAttribute("transform",`translate(0,${le*24})`);
    if(phi<180){gasCol=BLUE;gasA=0.25+0.25*phi/180;}
    else if(phi<360){const k=(phi-180)/180;gasCol=mix(BLUE,DENSE,k);gasA=0.5+0.35*k;}
    else if(phi<540){const k=(phi-360)/180;gasCol=k<0.15?mix(HOT,FIRE,k/0.15):mix(FIRE,[200,70,40],(k-0.15)/0.85);gasA=0.9-0.35*k;flash=phi<400?1-(phi-360)/40:0;spark=phi<372?1:0;}
    else {const k=(phi-540)/180;gasCol=SMOKE;gasA=0.55-0.4*k;}
    flowDots(E.inDots,u=>[lerp(-250,-50,u),lerp(HEAD-45,HEAD-45,u)+(u>0.8?(u-0.8)*5*45:0)],li,t,rgb(BLUE,1));
    flowDots(E.exDots,u=>[lerp(50,260,u),HEAD-45+(u<0.2?(0.2-u)*5*45:0)],le,t,rgb(SMOKE,1));
    if(opt.phaseCb)opt.phaseCb(phi);
  } else {
    const th=((theta%360)+360)%360;
    const P=E.ports;
    const exOpen=Math.max(0,Math.min(1,(top-P.EXT)/(P.EXB-P.EXT)));
    const trOpen=Math.max(0,Math.min(1,(top-P.TRT)/(P.TRB-P.TRT)));
    const bottom=top+E.pistonLen;
    const inOpen=Math.max(0,Math.min(1,(P.INB-bottom)/(P.INB-P.INT)));
    // chamber gas
    if(th<180){ // going down after spark
      if(exOpen<=0){const k=th/ 60;gasCol=k<0.25?mix(HOT,FIRE,k*4):FIRE;gasA=0.9-0.2*Math.min(1,k);flash=th<40?1-th/40:0;spark=th<12?1:0;}
      else if(trOpen<=0){gasCol=mix(FIRE,SMOKE,exOpen);gasA=0.6;}
      else {gasCol=mix(SMOKE,BLUE,trOpen);gasA=0.5;}
    } else { // going up
      if(exOpen>0){gasCol=mix(BLUE,SMOKE,0.25);gasA=0.5;}
      else {const k=(th-180)/180;gasCol=mix(BLUE,DENSE,k);gasA=0.5+0.4*k;}
    }
    // crankcase density: rises when piston goes down (compressed), low when going up (suction)
    const ccA = th<180?0.25+0.35*(th/180):0.6-0.35*((th-180)/180)+0.15*inOpen;
    E.ccFill.setAttribute("fill",rgb(BLUE,ccA));
    E.trPass.setAttribute("fill",rgb(BLUE,0.2+0.5*trOpen));
    if(opt.smoke){E.exDots.forEach((d,i)=>d.setAttribute("r",10+((t*0.9+i/9)%1)*26));flowDots(E.exDots,u=>[lerp(95,320,u),lerp(-215,-330,u*u)],Math.max(exOpen,0.55),t,"rgba(120,125,135,0.85)");}
    else {E.exDots.forEach(d=>d.setAttribute("r",8));flowDots(E.exDots,u=>[lerp(95,280,u),lerp(-215,-220,u)],exOpen,t,rgb(SMOKE,1));}
    flowDots(E.inDots,u=>[lerp(285,110,u),-152+(u>0.85?(u-0.85)*6*20:0)],inOpen,t,rgb(BLUE,1));
    flowDots(E.trDots,u=>u<0.6?[-147,lerp(-90,-200,u/0.6)]:[lerp(-140,-40,(u-0.6)/0.4),lerp(-205,-280,(u-0.6)/0.4)],trOpen,t,rgb(BLUE,1));
    if(opt.phaseCb)opt.phaseCb(th,{exOpen,trOpen,inOpen});
  }
  E.gas.setAttribute("fill",rgb(gasCol,gasA));
  E.flash.setAttribute("opacity",flash);E.flash.setAttribute("r",20+90*(1-flash));
  E.spark.setAttribute("opacity",spark);
}
window.Engine={build,update,pinY,HEAD};
})();
