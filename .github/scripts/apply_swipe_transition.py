from pathlib import Path

# index.html: remove obsolete overlay veil markup.
p=Path('index.html'); t=p.read_text()
old='  <div class="screen-whoosh" id="screenWhoosh" aria-hidden="true"><i class="whoosh-streak one"></i><i class="whoosh-streak two"></i></div>\n'
if old in t:
    t=t.replace(old,'',1)
elif 'id="screenWhoosh"' in t:
    raise SystemExit('unexpected screenWhoosh markup')
p.write_text(t)

# game400-a.js: use actual root snapshot View Transition for real cross-screen changes only.
p=Path('game400-a.js'); t=p.read_text()
old="let screenWhooshTimer=0;function screen(id){const next=document.getElementById(id),current=document.querySelector('.screen.active');if(!next)return;document.body.dataset.screen=id;if(current===next){if(id==='home')setTimeout(()=>updateHome(true),0);return}const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(current)current.classList.remove('active','screen-arriving');next.classList.add('active');const veil=document.getElementById('screenWhoosh');if(!reduced&&current){next.classList.remove('screen-arriving');void next.offsetWidth;next.classList.add('screen-arriving');if(veil){veil.classList.remove('run');void veil.offsetWidth;veil.classList.add('run')}clearTimeout(screenWhooshTimer);screenWhooshTimer=setTimeout(()=>{next.classList.remove('screen-arriving');if(veil)veil.classList.remove('run')},440)}else{next.classList.remove('screen-arriving');if(veil)veil.classList.remove('run')}if(id==='home')setTimeout(()=>updateHome(true),0)}"
new="let activeScreenTransition=null;function screen(id){const next=document.getElementById(id),current=document.querySelector('.screen.active');if(!next)return;if(current===next){document.body.dataset.screen=id;if(id==='home')setTimeout(()=>updateHome(true),0);return}const swap=()=>{document.body.dataset.screen=id;document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));next.classList.add('active');if(id==='home')setTimeout(()=>updateHome(true),0)};const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches,canSwipe=!!current&&!reduced&&typeof document.startViewTransition==='function';if(!canSwipe){swap();return}try{if(activeScreenTransition&&typeof activeScreenTransition.skipTransition==='function')activeScreenTransition.skipTransition();const vt=document.startViewTransition(swap);activeScreenTransition=vt;if(window.LatchlingsSFX&&window.LatchlingsSFX.screenSwipe)window.LatchlingsSFX.screenSwipe();vt.finished.finally(()=>{if(activeScreenTransition===vt)activeScreenTransition=null})}catch(_){activeScreenTransition=null;swap()}}"
if old in t:
    t=t.replace(old,new,1)
elif 'activeScreenTransition' not in t:
    raise SystemExit('screen router anchor missing')
p.write_text(t)

# style400-ui.css: preserve the full-viewport home fix, remove the veil/arrival CSS, add fast right-swipe View Transition CSS.
p=Path('style400-ui.css'); t=p.read_text()
if '.screen-whoosh{' in t:
    t=t.split('.screen-whoosh{',1)[0].rstrip()+"\n"
marker='/* Fast right-swipe root snapshot transitions */'
if marker not in t:
    t += r'''

/* Fast right-swipe root snapshot transitions */
@supports (view-transition-name:root){
  ::view-transition-group(root){animation-duration:210ms;animation-timing-function:cubic-bezier(.18,.76,.2,1);}
  ::view-transition-image-pair(root){isolation:auto;}
  ::view-transition-old(root){
    z-index:2;mix-blend-mode:normal;transform-origin:50% 50%;
    animation:latchlingsSwipeRightOld 210ms cubic-bezier(.18,.76,.2,1) both;
    will-change:transform,filter,opacity;
  }
  ::view-transition-new(root){z-index:1;mix-blend-mode:normal;animation:none;opacity:1;}
}
@keyframes latchlingsSwipeRightOld{
  0%{transform:translate3d(0,0,0) scaleX(1);filter:blur(0);opacity:1}
  24%{transform:translate3d(10vw,0,0) scaleX(1.012);filter:blur(1.8px);opacity:.98}
  58%{transform:translate3d(48vw,0,0) scaleX(1.045);filter:blur(5.5px);opacity:.86}
  100%{transform:translate3d(112vw,0,0) scaleX(1.085);filter:blur(11px);opacity:.16}
}
@media(prefers-reduced-motion:reduce){
  ::view-transition-group(root),::view-transition-old(root),::view-transition-new(root){animation:none!important}
}
'''
p.write_text(t)

# sfx400.js: add subtle, pooled screen swipe effect and public method.
p=Path('sfx400.js'); t=p.read_text()
if "screenSwipe: ['screen-swipe.wav'" not in t:
    anchor="    uiConfirm: ['ui-confirm.wav', 0.28, 2],\n"
    if anchor not in t: raise SystemExit('SFX definition anchor missing')
    t=t.replace(anchor,anchor+"    screenSwipe: ['screen-swipe.wav', 0.18, 2],\n",1)
if 'screenSwipe: () => play(\'screenSwipe\')' not in t:
    anchor="    uiConfirm: () => play('uiConfirm'),\n"
    if anchor not in t: raise SystemExit('SFX export anchor missing')
    t=t.replace(anchor,anchor+"    screenSwipe: () => play('screenSwipe'),\n",1)
p.write_text(t)

# Durable CC0 provenance.
p=Path('ART_ASSET_CREDITS.md'); t=p.read_text()
section='''\n\n## OpenGameArt sound source\n\n- **Swishes Sound Pack**, author **artisticdude**, OpenGameArt, released under **CC0**.\n  - Asset page: https://opengameart.org/content/swishes-sound-pack\n  - Pack download: https://opengameart.org/sites/default/files/swishes.zip\n  - License: https://creativecommons.org/publicdomain/zero/1.0/\n  - Selected source file: `swish-1.wav`, one of the pack's four lighter swishes.\n  - Local derivative: `assets/sfx/screen-swipe.wav`.\n  - Source inspection measured 0.1260 s duration with approximately 0.0221 s of leading silence at a -45 dB threshold. The implementation workflow trims that leading 22.1 ms, applies a 3 ms attack fade, an 11 ms tail fade, and -4 dB gain before writing 44.1 kHz 16-bit stereo PCM WAV. Runtime playback is further reduced to 0.18 volume by `sfx400.js` so the transition cue remains subtle.\n  - Used only for genuine cross-screen swipe transitions. It is not played for level-to-level changes while already on the Game screen.\n'''
if '## OpenGameArt sound source' not in t:
    t=t.rstrip()+section+'\n'
p.write_text(t)

print('SWIPE_TRANSITION_PRODUCT_PATCH_APPLIED')
