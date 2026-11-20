import json
lines=json.load(open("lines.json")); durs=json.load(open("durs.json"))
txt={k:v for k,v in lines}
GAP=0.85; t=0.5; S={}
order=[k for k,_ in lines]
extra={"title":0.3,"parts":0.5,"stroke":0.4,"four":0.6,"s1":0.5,"two":1.0,"t1":0.4,"oil":0.5,"cmp":0.8,"end":0.6}
for k in order:
    t+=extra.get(k,0)
    S[k]={"v":round(t,3),"d":durs[k]}
    t+=durs[k]+GAP
TOTAL=round(t+1.5,2)
# scene windows: from voice start-0.35 to next voice start-0.35
keys=order
for i,k in enumerate(keys):
    S[k]["s"]=round(max(0,S[k]["v"]-0.35),3)
for i,k in enumerate(keys):
    S[k]["e"]=S[keys[i+1]]["s"] if i+1<len(keys) else TOTAL
    S[k]["D"]=round(S[k]["e"]-S[k]["s"],3)
def W(k,word,occ=0):
    s=txt[k]; i=-1
    for _ in range(occ+1): i=s.index(word,i+1)
    return round(S[k]["v"]+S[k]["d"]*i/len(s),3)
json.dump({"S":S,"TOTAL":TOTAL},open("timing.json","w"),indent=1)

items=[] # (scene, html, in_time)
def add(k,html,at=None,cls="",style=""):
    at=S[k]["v"]+0.1 if at is None else at
    items.append((k,f'<div class="it {cls}" style="{style}" data-in="{at}">{html}</div>'))
O='<span class="o">'; E='</span>'
# hook
add("hook","क्या आप जानते हैं?",0,cls="kick")
add("hook",f"हर सेकंड<br>{O}दर्जनों धमाके!{E}",W("hook","हर"),cls="big")
add("hook","लेकिन बाइक <b>चलती कैसे</b> है?",W("hook","लेकिन"),cls="q")
# title
add("title","पेट्रोल इंजन",cls="kick")
add("title",f"{O}4 स्ट्रोक{E}",W("title","फोर"),cls="huge")
add("title","vs",W("title","और"),cls="vs")
add("title",f'<span class="c">2 स्ट्रोक</span>',W("title","टू"),cls="huge")
add("title","कैसे काम करते हैं?",W("title","कैसे"),cls="sub")
# parts
add("parts","भाग 1",cls="kick")
add("parts","इंजन के<br>मुख्य हिस्से",cls="big")
# stroke
add("stroke","भाग 1",cls="kick")
add("stroke","स्ट्रोक क्या है?",cls="big")
add("stroke",f"पिस्टन का एक बार<br>ऊपर → नीचे <br>= {O}1 स्ट्रोक{E}",W("stroke","एक स्ट्रोक"),cls="mid")
add("stroke","<b>TDC</b> – टॉप डेड सेंटर<br><b>BDC</b> – बॉटम डेड सेंटर",W("stroke","टी डी सी"),cls="row small")
# four
add("four","भाग 2",cls="kick")
add("four",f"{O}4 स्ट्रोक{E} इंजन",cls="big")
add("four",f"4 स्ट्रोक = {O}1 पावर{E}",W("four","एक बार"),cls="mid")
add("four","क्रैंकशाफ्ट के <b>2 चक्कर</b> (720°)",W("four","दो चक्कर"),cls="row")
stroke_cards={
 "s1":("1","सक्शन स्ट्रोक","Suction / Intake",[("पिस्टन","↓ नीचे","पिस्टन"),("इनलेट वाल्व","खुला","इनलेट"),("मिश्रण","पेट्रोल + हवा अंदर","मिश्रण")]),
 "s2":("2","कम्प्रेशन स्ट्रोक","Compression",[("दोनों वाल्व","बंद","दोनों"),("पिस्टन","↑ ऊपर","ऊपर"),("मिश्रण","ज़ोर से दबता है","दबाता")]),
 "s3":("3","पावर स्ट्रोक","Power",[("स्पार्क प्लग","चिंगारी ⚡","चिंगारी"),("मिश्रण","जलकर फैलता है","जलकर"),("पिस्टन","↓ ताकत से नीचे","धकेलता")]),
 "s4":("4","एग्ज़ॉस्ट स्ट्रोक","Exhaust",[("एग्ज़ॉस्ट वाल्व","खुला","वाल्व खुलता"),("पिस्टन","↑ ऊपर","ऊपर"),("जली गैसें","बाहर","बाहर")]),
}
for k,(n,name,en,rows) in stroke_cards.items():
    add(k,f'<span class="num">{n}</span><span class="nm">{name}<i>{en}</i></span>',cls="head")
    for a,b,w in rows:
        add(k,f'<span class="ra">{a}</span><span class="rb">{b}</span>',W(k,w),cls="row kv")
add("loop","चक्र चलता रहता है…",cls="kick")
for i,(w,wd) in enumerate([("सक्शन","सक्शन"),("कम्प्रेशन","कम्प्रेशन"),("पावर","पावर"),("एग्ज़ॉस्ट","एग्ज़ॉस्ट")]):
    add("loop",f'<span class="ln" id="loopw{i}">{i+1}. {w}</span>',W("loop",wd),cls="lw")
# two
add("two","भाग 3",cls="kick")
add("two",'<span class="c">2 स्ट्रोक</span> इंजन',cls="big")
add("two","वाल्व नहीं — <b>पोर्ट</b>",W("two","वाल्व"),cls="mid")
add("two",f"1 चक्कर (360°) = {O}1 पावर{E}",W("two","हर एक"),cls="row")
t2cards={
 "t1":("↑","पिस्टन ऊपर","Upward stroke",[("ऊपर","मिश्रण दबता है","दबता"),("नीचे क्रैंककेस","नया मिश्रण","क्रैंककेस"),("इनलेट पोर्ट","खुला","इनलेट")]),
 "t2":("↓","पिस्टन नीचे","Downward stroke",[("स्पार्क","पावर ⚡","स्पार्क"),("एग्ज़ॉस्ट पोर्ट","गैसें बाहर","एग्ज़ॉस्ट"),("ट्रांसफर पोर्ट","नया मिश्रण ऊपर","ट्रांसफर")]),
}
for k,(n,name,en,rows) in t2cards.items():
    add(k,f'<span class="num c2">{n}</span><span class="nm">{name}<i>{en}</i></span>',cls="head")
    for a,b,w in rows:
        add(k,f'<span class="ra">{a}</span><span class="rb">{b}</span>',W(k,w),cls="row kv")
add("oil","लुब्रिकेशन",cls="kick")
add("oil",f'पेट्रोल <span class="c">+</span> {O}2T ऑयल{E}',W("oil","पेट्रोल"),cls="big")
add("oil","अलग ऑयल सिस्टम नहीं",W("oil","अलग"),cls="row")
add("oil","इसीलिए <b>धुआँ ज़्यादा</b>",W("oil","इसीलिए"),cls="row warn")
html_items={}
for k,h in items: html_items.setdefault(k,[]).append(h)
panels="\n".join(f'<div class="panel{" narrow" if k in ("parts","two") else ""}" id="p-{k}" data-s="{S[k]["s"]}" data-e="{S[k]["e"]}">'+"".join(v)+"</div>" for k,v in html_items.items())
# compare/end columns
c4=[("ज़्यादा माइलेज",W("cmp","माइलेज"),"ok"),("कम प्रदूषण",W("cmp","प्रदूषण"),"ok"),("आज की बाइक, कार",W("cmp","आज"),"ok")]
c2=[("हल्का, सस्ता",W("cmp","हल्का"),"ok"),("ज़्यादा पिकअप",W("cmp","पिकअप"),"ok"),("धुआँ ज़्यादा",W("cmp","धुआँ"),"bad")]
def col(lst):
    return "".join(f'<div class="ci {c}" data-in="{t}"><span class="ic">{"✓" if c=="ok" else "✗"}</span>{x}</div>' for x,t,c in lst)
cmp_html=f'''<div class="cols" id="cols-cmp" data-s="{S["cmp"]["s"]}" data-e="{S["cmp"]["e"]}">
<div class="colh h4" data-in="{S["cmp"]["v"]}">4 स्ट्रोक</div><div class="colh h2" data-in="{W("cmp","टू")}">2 स्ट्रोक</div>
<div class="cl l">{col(c4)}</div><div class="cl r">{col(c2)}</div></div>
<div class="cols" id="cols-end" data-s="{S["end"]["s"]}" data-e="{TOTAL}">
<div class="colh h4" data-in="{W("end","फोर")}">4 स्ट्रोक</div><div class="colh h2" data-in="{W("end","टू")}">2 स्ट्रोक</div>
<div class="cl l"><div class="ci big2" data-in="{W("end","दो चक्कर")}">2 चक्कर = <span class="o">1 पावर</span></div></div>
<div class="cl r"><div class="ci big2" data-in="{W("end","एक चक्कर")}">1 चक्कर = <span class="o">1 पावर</span></div></div></div>'''
# engine labels (group coords)
lab4=[("स्पार्क प्लग",W("parts","स्पार्क"),(14,-470),(300,-500)),
      ("सिलेंडर",W("parts","सिलेंडर"),(120,-150),(300,-150)),
      ("पिस्टन",W("parts","पिस्टन"),(60,-270),(300,-260)),
      ("कनेक्टिंग रॉड",W("parts","कनेक्टिंग"),(25,-130),(300,-60)),
      ("क्रैंकशाफ्ट",W("parts","क्रैंकशाफ्ट"),(80,30),(300,60))]
lab2=[("एग्ज़ॉस्ट पोर्ट",W("two","पोर्ट"),(270,-215),(310,-300)),
      ("इनलेट पोर्ट",W("two","पोर्ट")+0.5,(270,-150),(310,-110)),
      ("ट्रांसफर पोर्ट",W("two","पोर्ट")+1.0,(-160,-150),(-330,-470)),
      ("क्रैंककेस",W("two","पोर्ट")+1.5,(-100,100),(-240,120))]
def labels(lst,pid,s,e):
    out=f'<g id="{pid}" class="lgrp" data-s="{s}" data-e="{e}">'
    for txt_,t_,(tx,ty),(lx,ly) in lst:
        anchor="start" if (lx>0 or ly<-400) else "end"
        out+=f'<g class="lab" data-in="{t_}"><line x1="{tx}" y1="{ty}" x2="{lx-(10 if lx>0 else -10)}" y2="{ly}" stroke="#ffd34d" stroke-width="2.5"/><circle cx="{tx}" cy="{ty}" r="6" fill="#ffd34d"/><text x="{lx}" y="{ly+12}" text-anchor="{anchor}" class="svl">{txt_}</text></g>'
    return out+"</g>"
L4=labels(lab4,"lab4",S["parts"]["s"],S["parts"]["e"])
L2=labels(lab2,"lab2",S["two"]["s"],S["two"]["e"])
tdc=f'''<g id="tdcg" class="lgrp" data-s="{S["stroke"]["s"]}" data-e="{S["four"]["s"]}">
<g class="lab" data-in="{W("stroke","टी डी सी")}"><line x1="-170" y1="-315" x2="170" y2="-315" stroke="#ffd34d" stroke-width="3" stroke-dasharray="12 8"/><text x="185" y="-305" class="svl">TDC</text></g>
<g class="lab" data-in="{W("stroke","बी डी सी")}"><line x1="-170" y1="-175" x2="170" y2="-175" stroke="#7dffb2" stroke-width="3" stroke-dasharray="12 8"/><text x="185" y="-165" class="svl g">BDC</text></g>
<g class="lab" data-in="{W("stroke","एक स्ट्रोक")}"><path d="M-195,-312 L-215,-312 L-215,-178 L-195,-178" fill="none" stroke="#fff" stroke-width="3"/><text x="-228" y="-235" text-anchor="end" class="svl w">1 स्ट्रोक</text></g></g>'''
spark_t3=W("s3","चिंगारी")
cfg=dict(S=S,TOTAL=TOTAL,spark3=spark_t3)
json.dump(cfg,open("cfg.json","w"))
tpl=open("src/index.tpl").read()
out=tpl.replace("%PANELS%",panels).replace("%CMP%",cmp_html).replace("%L4%",L4+tdc).replace("%L2%",L2).replace("%CFG%",json.dumps(cfg)).replace("%TOTAL%",str(TOTAL))
open("index.html","w").write(out)
print("TOTAL",TOTAL); print({k:(v["s"],v["D"]) for k,v in S.items()})
