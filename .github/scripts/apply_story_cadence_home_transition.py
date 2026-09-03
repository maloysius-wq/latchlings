from pathlib import Path

# index.html
p=Path('index.html'); t=p.read_text()
if '<body data-screen="home">' not in t:
    t=t.replace('<body>','<body data-screen="home">',1)
anchor='<div class="chapter-material-backdrop" id="chapterMaterialBackdrop" aria-hidden="true"></div>'
whoosh='<div class="screen-whoosh" id="screenWhoosh" aria-hidden="true"><i class="whoosh-streak one"></i><i class="whoosh-streak two"></i></div>'
if whoosh not in t:
    if anchor not in t: raise SystemExit('chapter backdrop anchor missing')
    t=t.replace(anchor,anchor+'\n  '+whoosh,1)
p.write_text(t)

# game400-a.js
p=Path('game400-a.js'); t=p.read_text()
old="function screen(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));document.getElementById(id).classList.add('active');if(id==='home')setTimeout(()=>updateHome(true),0)}"
new="let screenWhooshTimer=0;function screen(id){const next=document.getElementById(id),current=document.querySelector('.screen.active');if(!next)return;document.body.dataset.screen=id;if(current===next){if(id==='home')setTimeout(()=>updateHome(true),0);return}const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(current)current.classList.remove('active','screen-arriving');next.classList.add('active');const veil=document.getElementById('screenWhoosh');if(!reduced&&current){next.classList.remove('screen-arriving');void next.offsetWidth;next.classList.add('screen-arriving');if(veil){veil.classList.remove('run');void veil.offsetWidth;veil.classList.add('run')}clearTimeout(screenWhooshTimer);screenWhooshTimer=setTimeout(()=>{next.classList.remove('screen-arriving');if(veil)veil.classList.remove('run')},440)}else{next.classList.remove('screen-arriving');if(veil)veil.classList.remove('run')}if(id==='home')setTimeout(()=>updateHome(true),0)}"
if old in t:
    t=t.replace(old,new,1)
elif 'screenWhooshTimer' not in t:
    raise SystemExit('screen function anchor missing')
p.write_text(t)

# story-theme400.js
p=Path('story-theme400.js'); t=p.read_text()
old="function enterLevel(level){activeLevel=Number(level)||activeLevel;if(!STORY)return;const seen=seenMap();window.setTimeout(()=>{if(!seen[level])show(level,false)},90)}"
new="function autoEligible(meta){return !!meta&&(meta.local===1||meta.local%10===0)}\nfunction enterLevel(level){activeLevel=Number(level)||activeLevel;if(!STORY)return;const meta=STORY.levelMeta(level);if(!autoEligible(meta))return;const seen=seenMap();window.setTimeout(()=>{if(!seen[level])show(level,false)},90)}"
if old in t:
    t=t.replace(old,new,1)
elif 'function autoEligible' not in t:
    raise SystemExit('enterLevel anchor missing')
old_obj='window.LatchlingsStoryTheme={decorateLevel,enterLevel,show,close,decorFor,iconSvg};'
new_obj='window.LatchlingsStoryTheme={decorateLevel,enterLevel,show,close,decorFor,iconSvg,autoEligible};'
if old_obj in t:
    t=t.replace(old_obj,new_obj,1)
elif 'autoEligible};' not in t:
    raise SystemExit('story theme export anchor missing')
p.write_text(t)

# style400-ui.css
p=Path('style400-ui.css'); t=p.read_text()
marker='/* Full-viewport Little Home + blurry whoosh screen transitions */'
if marker not in t:
    t += r'''

/* Full-viewport Little Home + blurry whoosh screen transitions */
body[data-screen="home"],body[data-screen="home"] #app{
  background:linear-gradient(180deg,#dceffa 0%,#d8edf8 69%,#edf3f4 100%);
}
body[data-screen="home"] #app:before,body[data-screen="home"] #app:after{opacity:0!important}
body[data-screen="home"] .chapter-material-backdrop{display:none!important}
#home.production-home{
  width:100%;max-width:none;padding:0;margin:0;align-items:center;justify-content:center;overflow:hidden;
  background:
    radial-gradient(circle at 24% 24%,rgba(255,255,255,.62),transparent 22%),
    radial-gradient(circle at 78% 39%,rgba(255,255,255,.34),transparent 20%),
    linear-gradient(180deg,#dceffa 0%,#d8edf8 69%,#edf3f4 100%);
}
.production-home-wrap{box-shadow:none!important;border-radius:0!important;background:transparent!important}
.production-home-frame{background:transparent}

.screen-whoosh{
  position:fixed;z-index:1200;left:-36vw;top:-18vh;width:172vw;height:136vh;pointer-events:none;opacity:0;
  transform:translate3d(-125vw,0,0) skewX(-9deg);will-change:transform,opacity,backdrop-filter;
  background:linear-gradient(100deg,transparent 0 20%,rgba(235,248,255,.12) 31%,rgba(255,255,255,.62) 46%,rgba(203,228,246,.38) 57%,transparent 76%);
  border-left:1px solid rgba(255,255,255,.16);border-right:1px solid rgba(255,255,255,.18);
}
.screen-whoosh:before{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 24%,rgba(255,255,255,.18) 38%,rgba(255,255,255,.44) 50%,rgba(255,255,255,.12) 64%,transparent 78%);filter:blur(12px)}
.whoosh-streak{position:absolute;display:block;height:4px;border-radius:999px;background:rgba(255,255,255,.68);filter:blur(3px);box-shadow:0 0 18px rgba(255,255,255,.36)}
.whoosh-streak.one{width:58vw;left:37%;top:39%;transform:rotate(-4deg)}
.whoosh-streak.two{width:43vw;left:45%;top:58%;transform:rotate(3deg);opacity:.52}
.screen-whoosh.run{animation:latchlingsScreenWhoosh 420ms cubic-bezier(.36,.02,.16,1) both}
.screen.active.screen-arriving{animation:latchlingsScreenArrive 390ms cubic-bezier(.18,.7,.22,1) both;transform-origin:50% 48%;will-change:filter,transform,opacity}
@keyframes latchlingsScreenWhoosh{
  0%{opacity:0;transform:translate3d(-125vw,0,0) skewX(-9deg);backdrop-filter:blur(0px) saturate(1)}
  14%{opacity:.84;backdrop-filter:blur(8px) saturate(.96)}
  48%{opacity:1;transform:translate3d(-5vw,0,0) skewX(-9deg);backdrop-filter:blur(18px) saturate(.9)}
  76%{opacity:.82;backdrop-filter:blur(13px) saturate(.94)}
  100%{opacity:0;transform:translate3d(125vw,0,0) skewX(-9deg);backdrop-filter:blur(3px) saturate(1)}
}
@keyframes latchlingsScreenArrive{
  0%{filter:blur(9px);transform:translate3d(15px,0,0) scale(.994);opacity:.86}
  48%{filter:blur(3px);transform:translate3d(4px,0,0) scale(.998);opacity:.97}
  100%{filter:blur(0);transform:translate3d(0,0,0) scale(1);opacity:1}
}
@media(prefers-reduced-motion:reduce){
  .screen-whoosh,.screen-whoosh.run{display:none!important;animation:none!important;backdrop-filter:none!important}
  .screen.active.screen-arriving{animation:none!important;filter:none!important;transform:none!important;opacity:1!important}
}
'''
p.write_text(t)
print('STORY_CADENCE_HOME_TRANSITION_APPLIED')
