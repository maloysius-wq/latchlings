from pathlib import Path

def read(p): return Path(p).read_text(encoding='utf-8')
def write(p,t): Path(p).write_text(t,encoding='utf-8')
def once(t,old,new,label):
    n=t.count(old)
    if n!=1: raise SystemExit(f'{label}: expected 1, found {n}')
    return t.replace(old,new,1)

# Modal focus entry, trap, Escape, and restoration.
p='game400-b.js'; t=read(p)
old="function modal(html){const overlay=document.getElementById('overlay'),home=document.getElementById('home'),frame=document.getElementById('homeTitleFrame'),overHome=!!home?.classList.contains('active');if(overHome&&frame)frame.classList.add('modal-suspended');document.getElementById('modal').innerHTML=html;overlay.classList.toggle('home-overlay',overHome);overlay.classList.add('show');document.body.classList.add('modal-open')}function closeModal(){const overlay=document.getElementById('overlay'),frame=document.getElementById('homeTitleFrame');overlay.classList.remove('show','home-overlay');document.body.classList.remove('modal-open');if(frame)frame.classList.remove('modal-suspended')}"
new="""let modalLastFocus=null;
function modalFocusables(){const root=document.getElementById('modal');return root?[...root.querySelectorAll('button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex=\"-1\"])')].filter(el=>!el.hidden&&getComputedStyle(el).display!=='none'):[]}
function modal(html){const overlay=document.getElementById('overlay'),home=document.getElementById('home'),frame=document.getElementById('homeTitleFrame'),overHome=!!home?.classList.contains('active'),wasOpen=overlay.classList.contains('show');if(!wasOpen)modalLastFocus=document.activeElement;if(overHome&&frame)frame.classList.add('modal-suspended');const root=document.getElementById('modal');root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.innerHTML=html;overlay.classList.toggle('home-overlay',overHome);overlay.classList.add('show');document.body.classList.add('modal-open');requestAnimationFrame(()=>{const first=modalFocusables()[0]||root;first.setAttribute?.('tabindex',first===root?'-1':first.getAttribute('tabindex')||'0');try{first.focus({preventScroll:true})}catch(_){first.focus?.()}})}
function closeModal(){const overlay=document.getElementById('overlay'),frame=document.getElementById('homeTitleFrame');overlay.classList.remove('show','home-overlay');document.body.classList.remove('modal-open');if(frame)frame.classList.remove('modal-suspended');const prior=modalLastFocus;modalLastFocus=null;if(prior&&prior.isConnected&&typeof prior.focus==='function')requestAnimationFrame(()=>{try{prior.focus({preventScroll:true})}catch(_){prior.focus()}})}
document.addEventListener('keydown',e=>{const overlay=document.getElementById('overlay');if(!overlay?.classList.contains('show'))return;if(e.key==='Escape'){e.preventDefault();closeModal();return}if(e.key!=='Tab')return;const list=modalFocusables();if(!list.length){e.preventDefault();document.getElementById('modal')?.focus();return}const first=list[0],last=list[list.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});"""
t=once(t,old,new,'modal focus contract')
write(p,t)

# Story Card remembers invoker, traps focus, restores on close.
p='story-theme400.js'; t=read(p)
t=once(t,"let activeLevel=1;","let activeLevel=1,storyCardLastFocus=null;",'story focus state')
t=once(t," const meta=STORY.levelMeta(level),chapter=STORY.chapters[meta.chapter-1],overlay=document.getElementById('storyCardOverlay');if(!overlay)return;"," const meta=STORY.levelMeta(level),chapter=STORY.chapters[meta.chapter-1],overlay=document.getElementById('storyCardOverlay');if(!overlay)return;storyCardLastFocus=document.activeElement;",'story capture focus')
old="function close(mark=true){const overlay=document.getElementById('storyCardOverlay');if(!overlay)return;const level=Number(overlay.dataset.level)||activeLevel;if(mark)markSeen(level);overlay.classList.remove('show');overlay.setAttribute('aria-hidden','true')}"
new="function close(mark=true){const overlay=document.getElementById('storyCardOverlay');if(!overlay)return;const level=Number(overlay.dataset.level)||activeLevel;if(mark)markSeen(level);overlay.classList.remove('show');overlay.setAttribute('aria-hidden','true');const prior=storyCardLastFocus;storyCardLastFocus=null;if(prior&&prior.isConnected&&typeof prior.focus==='function')requestAnimationFrame(()=>{try{prior.focus({preventScroll:true})}catch(_){prior.focus()}})}"
t=once(t,old,new,'story restore focus')
insert="""
document.addEventListener('keydown',e=>{const overlay=document.getElementById('storyCardOverlay');if(!overlay?.classList.contains('show'))return;if(e.key==='Escape'){e.preventDefault();close(false);return}if(e.key!=='Tab')return;const root=document.getElementById('storyCardPanel'),list=root?[...root.querySelectorAll('button:not([disabled]),[href],[tabindex]:not([tabindex="-1"])')].filter(el=>!el.hidden&&getComputedStyle(el).display!=='none'):[];if(!list.length)return;const first=list[0],last=list[list.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
"""
t=once(t,"function autoEligible(meta){",insert+"function autoEligible(meta){",'story trap')
write(p,t)

# Cinematic Tab trap and don't turn focused buttons into accidental Continue shortcuts.
p='cinematics400.js'; t=read(p)
old="document.addEventListener('keydown',e=>{if(!activeId)return;if(e.key==='Escape'){e.preventDefault();finish(true);return}if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();next()}});"
new="""document.addEventListener('keydown',e=>{if(!activeId)return;const shell=document.querySelector('#cinematicOverlay .cinematic-shell');if(e.key==='Escape'){e.preventDefault();finish(true);return}if(e.key==='Tab'){const list=shell?[...shell.querySelectorAll('button:not([disabled]),[href],[tabindex]:not([tabindex="-1"])')].filter(el=>!el.hidden&&getComputedStyle(el).display!=='none'):[];if(!list.length)return;const first=list[0],last=list[list.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}return}if((e.key==='Enter'||e.key===' ')&&!e.repeat){const active=document.activeElement;if(active&&active.closest&&active.closest('button,[role="button"],a,input,select,textarea'))return;e.preventDefault();next()}});"""
t=once(t,old,new,'cinematic keyboard contract')
write(p,t)
print('FULL_AUDIT_A11Y_REFINEMENT_OK')
