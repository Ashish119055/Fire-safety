import json,subprocess
c=json.load(open("cfg.json"));S=c["S"];T=c["TOTAL"]
inp=[];flt=[];n=0
def add(path,t,vol):
    global n
    inp.extend(["-i",path]); ms=int(t*1000)
    flt.append(f"[{n}:a]aresample=48000,aformat=channel_layouts=stereo,volume={vol},adelay={ms}|{ms}[a{n}]"); n+=1
for k,v in S.items(): add(f"assets/voice/{k}.wav",v["v"],1.0)
wh=["assets/audio/whoosh1.mp3","assets/audio/whoosh2.mp3"]
for i,k in enumerate(["title","parts","stroke","four","two","cmp","end"]): add(wh[i%2],S[k]["s"]-0.15,0.5)
add("assets/audio/spark.mp3",c["spark3"]-0.02,0.9)
add("assets/audio/spark.mp3",S["t2"]["s"]+0.6-0.02,0.8)
add("assets/audio/spark.mp3",S["hook"]["s"]+0.3,0.7)
# engine bed: looped idle
inp.extend(["-stream_loop","-1","-i","assets/audio/idle.mp3"])
flt.append(f"[{n}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{T},volume='if(lt(t,10),0.35,0.08)':eval=frame,afade=t=out:st={T-2}:d=2[a{n}]"); n+=1
flt.append("".join(f"[a{i}]" for i in range(n))+f"amix=inputs={n}:normalize=0:duration=longest,atrim=0:{T},apad=whole_dur={T},loudnorm=I=-16:TP=-1.5:LRA=11,atrim=0:{T}[out]")
cmd=["ffmpeg","-y","-v","error"]+inp+["-filter_complex",";".join(flt),"-map","[out]","-ar","48000","assets/audio/mix.wav"]
subprocess.run(cmd,check=True); print("ok")
