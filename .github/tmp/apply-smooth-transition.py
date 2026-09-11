from pathlib import Path

GAME = Path('game400-a.js')
CSS = Path('style400-ui.css')

old_screen = "let activeScreenTransition=null;function screen(id){const next=document.getElementById(id),current=document.querySelector('.screen.active');if(!next)return;if(current===next){document.body.dataset.screen=id;if(id==='home')setTimeout(()=>updateHome(true),0);return}const swap=()=>{document.body.dataset.screen=id;document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));next.classList.add('active');if(id==='home')setTimeout(()=>updateHome(true),0)};const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches,canSwipe=!!current&&!reduced&&typeof document.startViewTransition==='function';if(!canSwipe){swap();return}try{if(activeScreenTransition&&typeof activeScreenTransition.skipTransition==='function')activeScreenTransition.skipTransition();const vt=document.startViewTransition(swap);activeScreenTransition=vt;if(window.LatchlingsSFX&&window.LatchlingsSFX.screenSwipe)window.LatchlingsSFX.screenSwipe();vt.finished.finally(()=>{if(activeScreenTransition===vt)activeScreenTransition=null})}catch(_){activeScreenTransition=null;swap()}}"

new_screen = """let activeScreenTransition=null;
function screen(id){
 const next=document.getElementById(id);if(!next)return;
 if(activeScreenTransition&&typeof activeScreenTransition.skipTransition==='function')activeScreenTransition.skipTransition();
 const current=document.querySelector('.screen.active');
 if(current===next){document.body.dataset.screen=id;if(id==='home')setTimeout(()=>updateHome(true),0);return}
 const swap=()=>{document.body.dataset.screen=id;document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));next.classList.add('active');if(id==='home')setTimeout(()=>updateHome(true),0)};
 const reduced=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches),canSlide=!!current&&!reduced&&typeof current.animate==='function';
 if(!canSlide){swap();return}
 const priorStyle=current.getAttribute('style'),rect=current.getBoundingClientRect(),computedDisplay=getComputedStyle(current).display,display=computedDisplay==='none'?'flex':computedDisplay;
 let animation=null,rafA=0,rafB=0,settled=false,readySettled=false,resolveReady,resolveFinished,controller;
 const ready=new Promise(r=>resolveReady=r),finished=new Promise(r=>resolveFinished=r);
 const markReady=()=>{if(readySettled)return;readySettled=true;resolveReady()};
 const restore=()=>{if(priorStyle===null)current.removeAttribute('style');else current.setAttribute('style',priorStyle);current.classList.remove('screen-transition-outgoing')};
 const settle=()=>{if(settled)return;settled=true;if(rafA)cancelAnimationFrame(rafA);if(rafB)cancelAnimationFrame(rafB);if(animation){animation.onfinish=null;animation.oncancel=null}markReady();restore();resolveFinished();if(activeScreenTransition===controller)activeScreenTransition=null};
 controller={ready,finished,skipTransition(){if(settled)return;if(animation)animation.cancel();settle()}};
 activeScreenTransition=controller;
 current.classList.add('screen-transition-outgoing');
 Object.assign(current.style,{display,position:'fixed',left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px',margin:'0',zIndex:'40',pointerEvents:'none',willChange:'transform,opacity',transform:'translate3d(0,0,0) scaleX(1)',opacity:'1'});
 swap();
 if(window.LatchlingsSFX&&window.LatchlingsSFX.screenSwipe)window.LatchlingsSFX.screenSwipe();
 void next.offsetWidth;
 rafA=requestAnimationFrame(()=>{rafB=requestAnimationFrame(()=>{if(settled)return;markReady();animation=current.animate([{transform:'translate3d(0,0,0) scaleX(1)',opacity:1},{transform:'translate3d(106vw,0,0) scaleX(1.018)',opacity:.10}],{duration:420,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'});animation.onfinish=settle;animation.oncancel=()=>{if(!settled)settle()}})});
 return controller;
}"""

game = GAME.read_text()
if old_screen not in game:
    raise SystemExit('screen() source anchor not found')
GAME.write_text(game.replace(old_screen, new_screen, 1))

css = CSS.read_text()
marker = '/* Fast right-swipe root snapshot transitions */'
start = css.find(marker)
if start < 0:
    raise SystemExit('root transition CSS marker not found')
reduce_marker = '@media(prefers-reduced-motion:reduce)'
reduce_start = css.find(reduce_marker, start)
if reduce_start < 0:
    raise SystemExit('reduced-motion marker not found')
reduce_end = css.find('}', reduce_start)
if reduce_end < 0:
    raise SystemExit('reduced-motion block end not found')
old_reduce = css[reduce_start:reduce_end + 1]
if '::view-transition-' not in old_reduce:
    raise SystemExit('expected view-transition reduced-motion selectors missing')
new_reduce = '@media(prefers-reduced-motion:reduce){.ending-face,.ending-eyes,.ending-route,.ending-far-island{animation:none!important}}'
replacement = """/* Smooth screen transition: the destination lays out behind a fixed outgoing screen, then only the outgoing screen moves. */
.screen.screen-transition-outgoing{display:flex!important;flex-direction:column;backface-visibility:hidden;contain:paint;isolation:isolate}
"""
css = css[:start] + replacement + new_reduce + css[reduce_end + 1:]
CSS.write_text(css)

# Static contract checks.
game = GAME.read_text()
css = CSS.read_text()
assert 'document.startViewTransition' not in game
assert 'duration:420' in game
assert 'current.animate' in game
assert 'const ready=new Promise' in game and 'const finished=new Promise' in game
assert 'skipTransition()' in game
assert 'screen-transition-outgoing' in game and 'screen-transition-outgoing' in css
assert '::view-transition-' not in css
assert 'latchlingsSwipeRightOld' not in css
assert 'filter:blur(11px)' not in css
print('MANUAL_TRANSITION_STATIC_CHECKS_OK')
