from pathlib import Path
import re

# 1) Canonical cast identity lives in story400.js.
p=Path('story400.js'); s=p.read_text()
visuals={
 'Pippa':("#9a72df","#c3a0f1","#724fbd","club","curious",False),
 'Bramble':("#ef5f66","#ff9297","#c33d49","diamond","smug",False),
 'Rowan':("#66bd72","#94dc98","#469852","heart","happy",False),
 'Pip':("#4c8ff4","#79aff9","#2e69c8","spade","determined",True),
 'Tansy':("#ef5f66","#ff9297","#c33d49","heart","surprised",True),
}
for name,(color,light,dark,suit,expr,child) in visuals.items():
    pat=rf"(\{{name:'{name}',color:'[^']+',suit:'{suit}',role:'[^']+',shortRole:'[^']+',voice:'[^']+')\}}"
    repl=rf"\1,visual:{{color:'{color}',light:'{light}',dark:'{dark}',suit:'{suit}',expr:'{expr}',child:{str(child).lower()}}}}}"
    s,n=re.subn(pat,repl,s,count=1)
    assert n==1,name
p.write_text(s)

# 2) Cinematics derive visual cast identity from the story model rather than a second palette table.
p=Path('cinematics400.js'); s=p.read_text()
old=re.search(r"const CAST=\{\n.*?\n\};\nconst CINEMATICS=",s,re.S)
assert old
new="""const CAST=Object.fromEntries((window.LATCHLINGS_STORY?.cast||[]).map(person=>[person.name,{...person.visual,suit:person.visual?.suit||person.suit}]));
if(!Object.keys(CAST).length)throw new Error('Canonical Latchlings cast identity is unavailable');
const CINEMATICS="""
s=s[:old.start()]+new+s[old.end():]
s=s.replace("window.LatchlingsCinematics={TRIGGERS,CINEMATICS,show,next,finish,hasSeen,reset,maybeShowBeforeLevel,renderLibrary,get active(){return activeId},get beat(){return activeIndex},get line(){return activeLine}};",
            "window.LatchlingsCinematics={TRIGGERS,CINEMATICS,show,next,finish,hasSeen,reset,maybeShowBeforeLevel,renderLibrary,castIdentitySource:'LATCHLINGS_STORY.cast',get active(){return activeId},get beat(){return activeIndex},get line(){return activeLine}};")
p.write_text(s)

# 3) Consolidate legacy cinematic cascade into the canonical cinematic stylesheet in the exact existing order.
base=Path('style400-cinematics.css')
text=base.read_text().rstrip()+"\n\n/* Consolidated accepted cinematic presentation layers */\n"
for name in ['style400-cinematics-polish.css','style400-cinematics-refine.css','style400-cinematics-refine2.css']:
    q=Path(name); text+=f"\n/* Formerly {name} */\n"+q.read_text().strip()+"\n"
base.write_text(text)
for name in ['style400-cinematics-polish.css','style400-cinematics-refine.css','style400-cinematics-refine2.css']:
    Path(name).unlink()

# 4) Remove obsolete links and bump changed assets.
p=Path('index.html'); s=p.read_text()
for line in [
 '<link rel="stylesheet" href="style400-cinematics-polish.css">\n',
 '<link rel="stylesheet" href="style400-cinematics-refine.css">\n',
 '<link rel="stylesheet" href="style400-cinematics-refine2.css">\n',
]:
    assert line in s; s=s.replace(line,'')
s=s.replace('style400-ui.css?v=20260914-astra-pass4-candidate1','style400-ui.css?v=20260914-presentation-accessibility1')
s=s.replace('style400-game.css?v=20260914-gameplay-story-candidate1','style400-game.css?v=20260914-presentation-accessibility1')
s=s.replace('style400-cinematics.css?v=20260914-astra-pass4-candidate1','style400-cinematics.css?v=20260914-presentation-accessibility1')
s=s.replace('story400.js?v=20260912-ch2pass3-1','story400.js?v=20260914-presentation-accessibility1')
s=s.replace('cinematics400.js?v=20260914-astra-pass4-candidate1','cinematics400.js?v=20260914-presentation-accessibility1')
s=s.replace('game400-b.js?v=20260914-character-world1','game400-b.js?v=20260914-presentation-accessibility1')
p.write_text(s)

# 5) Modal focus management, escape, trap, and focus restoration.
p=Path('game400-b.js'); s=p.read_text()
old="function modal(html){const overlay=document.getElementById('overlay'),home=document.getElementById('home'),frame=document.getElementById('homeTitleFrame'),overHome=!!home?.classList.contains('active');if(overHome&&frame)frame.classList.add('modal-suspended');document.getElementById('modal').innerHTML=html;overlay.classList.toggle('home-overlay',overHome);overlay.classList.add('show')}function closeModal(){const overlay=document.getElementById('overlay'),frame=document.getElementById('homeTitleFrame');overlay.classList.remove('show','home-overlay');if(frame)frame.classList.remove('modal-suspended')}"
assert old in s
new="""let modalReturnFocus=null;
function modalFocusables(){const modalEl=document.getElementById('modal');return modalEl?[...modalEl.querySelectorAll('button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex=\"-1\"])')].filter(el=>{const st=getComputedStyle(el),r=el.getBoundingClientRect();return st.display!=='none'&&st.visibility!=='hidden'&&r.width>0&&r.height>0}):[]}
function modalKeydown(event){const overlay=document.getElementById('overlay');if(!overlay?.classList.contains('show'))return;if(event.key==='Escape'){event.preventDefault();closeModal();return}if(event.key!=='Tab')return;const els=modalFocusables();if(!els.length){event.preventDefault();document.getElementById('modal')?.focus();return}const first=els[0],last=els[els.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}
function modal(html){const overlay=document.getElementById('overlay'),modalEl=document.getElementById('modal'),home=document.getElementById('home'),frame=document.getElementById('homeTitleFrame'),overHome=!!home?.classList.contains('active');if(!overlay.classList.contains('show'))modalReturnFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;if(overHome&&frame)frame.classList.add('modal-suspended');modalEl.innerHTML=html;modalEl.setAttribute('role','dialog');modalEl.setAttribute('aria-modal','true');modalEl.tabIndex=-1;overlay.classList.toggle('home-overlay',overHome);overlay.classList.add('show');if(overlay.dataset.focusBound!=='1'){overlay.dataset.focusBound='1';overlay.addEventListener('keydown',modalKeydown)}requestAnimationFrame(()=>{const first=modalFocusables()[0];(first||modalEl).focus({preventScroll:true})})}
function closeModal(){const overlay=document.getElementById('overlay'),frame=document.getElementById('homeTitleFrame'),returnFocus=modalReturnFocus;overlay.classList.remove('show','home-overlay');if(frame)frame.classList.remove('modal-suspended');modalReturnFocus=null;if(returnFocus?.isConnected)requestAnimationFrame(()=>returnFocus.focus({preventScroll:true}))}"""
s=s.replace(old,new)

# Reduced-motion gameplay uses instantaneous state change rather than decorative WAAPI movement.
s=s.replace("function animateMove(el,from,res,n){return new Promise(resolve=>{if(!el){", "function animateMove(el,from,res,n){return new Promise(resolve=>{if(effectiveReducedMotion()){if(window.LatchlingsSFX)window.LatchlingsSFX.endMove(res.reason,res.capture);resolve();return}if(!el){",1)
s=s.replace("function drawTrail(a,b,n,path){const layer=", "function drawTrail(a,b,n,path){if(effectiveReducedMotion())return;const layer=",1)
s=s.replace("function shakeSelected(){const el=", "function shakeSelected(){if(effectiveReducedMotion())return;const el=",1)
p.write_text(s)

# 6) Shared presentation tokens, focus system, certified non-spatial targets, and viewport budget.
p=Path('style400-ui.css'); s=p.read_text()
assert ':root{' in s
s=s.replace(':root{', ':root{\n  --surface-paper:#fff8eb;--surface-paper-2:#f8ead5;--surface-edge:rgba(206,180,143,.72);--surface-shadow:0 12px 28px rgba(37,65,91,.20),0 3px 8px rgba(70,52,31,.12);--surface-soft-shadow:0 6px 16px rgba(37,65,91,.14),0 2px 4px rgba(70,52,31,.10);--focus-ring:#245fa8;--touch-target:44px;\n',1)
s=s.replace('.card{background:linear-gradient(180deg,#fff8eb,#f8ead5);border:1px solid rgba(206,180,143,.72);box-shadow:var(--shadow);border-radius:28px}', '.card{background:linear-gradient(180deg,var(--surface-paper),var(--surface-paper-2));border:1px solid var(--surface-edge);box-shadow:var(--surface-shadow);border-radius:28px}',1)
s += r'''

/* Presentation/accessibility consolidation */
:where(button,[role="button"],[role="tab"],[href],[tabindex]:not([tabindex="-1"])):focus-visible{outline:3px solid var(--focus-ring);outline-offset:3px}
button:not(.latchling){min-height:var(--touch-target)}
.overlay{padding:max(14px,env(safe-area-inset-top)) max(14px,env(safe-area-inset-right)) max(14px,env(safe-area-inset-bottom)) max(14px,env(safe-area-inset-left))}
.modal{max-height:calc(100dvh - max(28px,env(safe-area-inset-top) + env(safe-area-inset-bottom)));overflow:auto;overscroll-behavior:contain}
.screen{height:100dvh;min-height:0;max-height:100dvh;padding-left:max(14px,env(safe-area-inset-left));padding-right:max(14px,env(safe-area-inset-right));overflow:hidden}
.card,.story-card-panel,.cinematic-shell{border-color:var(--surface-edge);box-shadow:var(--surface-shadow)}
html[data-motion="reduced"] *,html[data-motion="reduced"] *::before,html[data-motion="reduced"] *::after{scroll-behavior:auto!important}
@media(max-height:600px) and (orientation:portrait){.screen{padding-top:max(7px,env(safe-area-inset-top));padding-bottom:max(7px,env(safe-area-inset-bottom))}}
'''
p.write_text(s)

p=Path('style400-game.css'); s=p.read_text()
s += r'''

/* Presentation/accessibility consolidation */
html[data-motion="reduced"] #game *,
html[data-motion="reduced"] #game *::before,
html[data-motion="reduced"] #game *::after{animation:none!important;transition:none!important}
#game.screen.active{min-height:0;height:100dvh;max-height:100dvh;overflow:hidden}
@media(max-height:600px) and (orientation:portrait){
  #game .topbar{margin-bottom:5px}
  #game .controls{padding-top:2px}
  #game .side-action{min-height:62px}
  #game .dpad{width:min(184px,45vw);height:min(184px,45vw)}
}
@media(orientation:landscape) and (max-height:520px){
  #game.screen.active{max-width:100%;display:grid;grid-template-columns:minmax(0,1fr) minmax(250px,340px);grid-template-rows:auto auto minmax(0,1fr) auto;grid-template-areas:"top top" "story controls" "board controls" "note controls";gap:4px 10px;padding-top:max(6px,env(safe-area-inset-top));padding-bottom:max(6px,env(safe-area-inset-bottom))}
  #game .game-top{grid-area:top;min-height:48px;margin:0;padding:4px 8px}
  #game .game-title{font-size:20px}
  #game .moves-box strong{font-size:22px}
  #game .story-rail-slot{grid-area:story;min-height:0;margin:0}
  #game .board-wrap{grid-area:board;min-height:0;align-self:stretch}
  #game .board{width:min(52vh,360px);height:min(52vh,360px);max-height:none}
  #game .mechanic-note{grid-area:note;margin:0;max-width:none;padding:5px 8px;font-size:11px}
  #game .controls{grid-area:controls;align-self:center;display:grid;grid-template-columns:64px minmax(150px,190px) 64px;gap:5px;padding:0}
  #game .side-action{min-height:60px;font-size:11px;border-radius:16px}
  #game .dpad{width:min(190px,45vh);height:min(190px,45vh)}
}
'''
p.write_text(s)

# 7) Bring Little Home's top-level surface vocabulary in line without changing scene geometry.
p=Path('title-island-concepts/index.html'); s=p.read_text()
s=s.replace(':root{--navy:#183968;--ink:#264b78;--muted:#67819c;--cream:#fff8e8;--cream2:#f5e7c7;--line:#d8b681;--shadow:0 18px 42px rgba(29,55,88,.16);', ':root{--navy:#183968;--ink:#264b78;--muted:#67819c;--cream:#fff8eb;--cream2:#f8ead5;--line:#d6bc96;--shadow:0 12px 28px rgba(37,65,91,.20),0 3px 8px rgba(70,52,31,.12);--focus-ring:#245fa8;--touch-target:44px;',1)
insert='''\n/* Shared presentation/accessibility vocabulary */\nbutton:focus-visible,[role="button"]:focus-visible,[tabindex]:not([tabindex="-1"]):focus-visible{outline:3px solid var(--focus-ring);outline-offset:3px}\n.settings,.story-home{min-width:var(--touch-target);min-height:var(--touch-target)}\nhtml[data-motion="reduced"] .resident,html[data-motion="reduced"] .story-keepsake{transition:none!important}\n'''
s=s.replace('</style>',insert+'</style>',1)
p.write_text(s)

# Assertions
idx=Path('index.html').read_text()
assert 'style400-cinematics-polish.css' not in idx and 'style400-cinematics-refine.css' not in idx and 'style400-cinematics-refine2.css' not in idx
assert all(not Path(x).exists() for x in ['style400-cinematics-polish.css','style400-cinematics-refine.css','style400-cinematics-refine2.css'])
assert "castIdentitySource:'LATCHLINGS_STORY.cast'" in Path('cinematics400.js').read_text()
assert 'modalKeydown' in Path('game400-b.js').read_text()
print('presentation/accessibility candidate applied')
