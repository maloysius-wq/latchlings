from pathlib import Path
import re

root=Path('.')

# ----- Parent runtime: contextual Home primary action.
a_path=root/'game400-a.js'
a=a_path.read_text(encoding='utf-8')
old="function updateHome(replay=false){const total=Object.values(progress.stars).reduce((a,b)=>a+(+b||0),0),legacy=document.getElementById('homeStars');if(legacy)legacy.textContent=total;const frame=document.getElementById('homeTitleFrame'),stage=STORY?STORY.completedChapters(progress):0,focus=homeRewardFocus;homeRewardFocus=null;if(frame&&frame.contentWindow)frame.contentWindow.postMessage({source:'latchlings-game',type:'home-state',stars:total,stage,replay:!!replay,motion:uiPrefs.motion,textSize:uiPrefs.textSize,focus},location.origin)}"
new="function updateHome(replay=false){const total=Object.values(progress.stars).reduce((a,b)=>a+(+b||0),0),legacy=document.getElementById('homeStars');if(legacy)legacy.textContent=total;const frame=document.getElementById('homeTitleFrame'),stage=STORY?STORY.completedChapters(progress):0,focus=homeRewardFocus;homeRewardFocus=null;const level=Math.max(1,Math.min(400,Number(progress.unlocked)||1)),chapter=Math.max(1,Math.min(8,Math.ceil(level/50))),chapterName=CHAPTERS[chapter-1]?.name||`Chapter ${chapter}`,finished=level>=400&&Number(progress.stars?.[400]||0)>0,started=Object.keys(progress.stars||{}).length>0||level>1,primaryLabel=finished?'Replay Aurora Crown':started?`Continue ${chapterName}`:`Begin ${chapterName}`,primaryMeta=finished?'Level 400 · final route':`Level ${level} · Chapter ${chapter}`;if(frame&&frame.contentWindow)frame.contentWindow.postMessage({source:'latchlings-game',type:'home-state',stars:total,stage,replay:!!replay,motion:uiPrefs.motion,textSize:uiPrefs.textSize,focus,primaryLabel,primaryMeta},location.origin)}"
assert old in a, 'updateHome anchor changed'
a=a.replace(old,new)
a_path.write_text(a,encoding='utf-8')

# ----- Parent runtime: keepsake memory recall modal.
b_path=root/'game400-b.js'
b=b_path.read_text(encoding='utf-8')
anchor="function resetProgress(){modal(`<h2>Reset progress?</h2>"
assert anchor in b, 'memory modal insertion anchor changed'
memory_code=r'''const HOME_KEEPSAKE_MEMORIES={
 mailbox:{title:'Sunpetal Mailbox',chapter:'Sunpetal Meadows',text:'The morning routes stopped missing Little Home once the Waykeeper redrew them for where the islands are now.'},
 pennant:{title:'Visitor Pennant',chapter:'Lanternwood Grove',text:'Lanternwood showed that neighbors can share dependable stops and travel windows without pretending the islands stand still.'},
 anchor:{title:'Restored Anchor',chapter:'Lodestone Caverns',text:'Lodestone anchors create dependable moments. Crews retune them as the drift changes instead of pinning the world in place.'},
 bunting:{title:'Market Bunting',chapter:'Masquerade Keep',text:'Market Day returned when the old suit-mark lanes became useful civic routes again and the records behind them were shared.'},
 telescope:{title:'Prism Telescope',chapter:'Prism Gardens',text:'From Prism, the mismatch became visible: the islands had moved while yesterday’s approved routes had not.'},
 relic:{title:'Waykeeper Compass',chapter:'Copperline Junction',text:'The old maps were all right for their own moments. Copperline proved that a new route can be correct without copying an old one.'},
 dock:{title:'Arrival Platform',chapter:'Stormswitch Foundry',text:'Stormswitch works because communities watch their own routes, share signals, and correct timing together.'}
};
function homeMemoryModal(key){const memory=HOME_KEEPSAKE_MEMORIES[key];if(!memory)return;modal(`<section class="home-memory-card" aria-label="Little Home memory"><div class="theme-kicker">Little Home memory · ${memory.chapter}</div><h2>${memory.title}</h2><p>${memory.text}</p><div class="modal-actions"><button class="primary-small" id="homeMemoryStory">Open Story & Residents</button><button class="secondary-small" id="homeMemoryClose">Back to Little Home</button></div></section>`);document.getElementById('homeMemoryStory').onclick=()=>{closeModal();openStoryScreen()};document.getElementById('homeMemoryClose').onclick=closeModal}
'''
b=b.replace(anchor,memory_code+anchor)
old_action="window.LatchlingsHomeAction=action=>{if(action==='play')startLevel(progress.unlocked);if(action==='daily')startDailyPuzzle();if(action==='levels'){chapterView=Math.ceil(progress.unlocked/50);rangeView=Math.floor(((progress.unlocked-1)%50)/10);screen('levels');renderChapter()}if(action==='settings')settingsModal();if(action==='story')openStoryScreen()};"
new_action="window.LatchlingsHomeAction=action=>{if(typeof action==='string'&&action.startsWith('memory:')){homeMemoryModal(action.slice(7));return}if(action==='play')startLevel(progress.unlocked);if(action==='daily')startDailyPuzzle();if(action==='levels'){chapterView=Math.ceil(progress.unlocked/50);rangeView=Math.floor(((progress.unlocked-1)%50)/10);screen('levels');renderChapter()}if(action==='settings')settingsModal();if(action==='story')openStoryScreen()};"
assert old_action in b, 'HomeAction anchor changed'
b=b.replace(old_action,new_action)
b_path.write_text(b,encoding='utf-8')

# ----- Little Home scene: semantic keepsakes, contextual primary copy, purposeful resident work cycles.
h_path=root/'title-island-concepts/index.html'
h=h_path.read_text(encoding='utf-8')

# Restrict markup edits to canonical Little Home concept.
c2_start=h.index('<section class="concept" id="c2"')
c2_end=h.index('</section>',c2_start)+len('</section>')
c2=h[c2_start:c2_end]

keepsake_repls={
 '<i class="story-keepsake story-mailbox"></i>':'<i class="story-keepsake story-mailbox" data-memory="mailbox" role="button" tabindex="-1" aria-hidden="true" aria-label="Memory: Sunpetal mailbox"></i>',
 '<i class="story-keepsake story-pennant"></i>':'<i class="story-keepsake story-pennant" data-memory="pennant" role="button" tabindex="-1" aria-hidden="true" aria-label="Memory: Lanternwood visitor pennant"></i>',
 '<div class="story-keepsake story-anchor">':'<div class="story-keepsake story-anchor" data-memory="anchor" role="button" tabindex="-1" aria-hidden="true" aria-label="Memory: Lodestone restored anchor">',
 '<i class="story-keepsake story-bunting">':'<i class="story-keepsake story-bunting" data-memory="bunting" role="button" tabindex="-1" aria-hidden="true" aria-label="Memory: Masquerade market bunting">',
 '<i class="story-keepsake story-telescope"></i>':'<i class="story-keepsake story-telescope" data-memory="telescope" role="button" tabindex="-1" aria-hidden="true" aria-label="Memory: Prism telescope"></i>',
 '<i class="story-keepsake story-relic"></i>':'<i class="story-keepsake story-relic" data-memory="relic" role="button" tabindex="-1" aria-hidden="true" aria-label="Memory: Copperline Waykeeper compass"></i>',
 '<i class="story-keepsake story-dock"></i>':'<i class="story-keepsake story-dock" data-memory="dock" role="button" tabindex="-1" aria-hidden="true" aria-label="Memory: Stormswitch arrival platform"></i>'
}
for old_k,new_k in keepsake_repls.items():
    assert old_k in c2, f'keepsake markup missing: {old_k}'
    c2=c2.replace(old_k,new_k)

c2=c2.replace('class="latchling resident adult life-garden l1" data-role="adult" data-activity="garden"','class="latchling resident adult life-garden l1" data-role="adult" data-resident="Pippa" data-activity="garden"')
c2=c2.replace('class="latchling resident adult life-parcel l2" data-role="adult" data-activity="parcel"','class="latchling resident adult life-parcel l2" data-role="adult" data-resident="Bramble" data-activity="parcel"')
c2=c2.replace('class="latchling resident adult life-tree l3" data-role="adult" data-activity="tree"','class="latchling resident adult life-tree l3" data-role="adult" data-resident="Rowan" data-activity="tree"')
old_play='<button class="play">Play<svg viewBox="0 0 20 20"><path d="M6 3.6 15 10l-9 6.4Z"/></svg></button>'
new_play='<button class="play"><span class="home-primary-copy"><strong>Begin Sunpetal Meadows</strong><small>Level 1 · Chapter 1</small></span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 3.6 15 10l-9 6.4Z"/></svg></button>'
assert old_play in c2, 'Little Home play button anchor changed'
c2=c2.replace(old_play,new_play,1)
h=h[:c2_start]+c2+h[c2_end:]

# Add coherence styles inside the existing canonical style block.
css_marker='/* Astra Little Home coherence */'
assert css_marker not in h
css=r'''

/* Astra Little Home coherence */
#c2 .play .home-primary-copy{display:grid;gap:2px;text-align:left;min-width:0;position:relative;z-index:1}
#c2 .play .home-primary-copy strong{font-size:20px;line-height:1.05;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:265px}
#c2 .play .home-primary-copy small{font-size:10px;line-height:1.1;letter-spacing:.06em;text-transform:uppercase;color:#61778b;font-weight:850;text-shadow:none}
#c2 .story-keepsake.memory-unlocked{pointer-events:auto;cursor:pointer;outline:none;touch-action:manipulation}
#c2 .story-keepsake.memory-unlocked:focus-visible{filter:drop-shadow(0 0 6px rgba(48,89,126,.9));box-shadow:0 0 0 4px rgba(255,248,220,.92),0 0 0 7px rgba(43,82,118,.82)}
#c2 .story-anchor.memory-unlocked:focus-visible{border-radius:10px}
#c2 .resident.work-active{z-index:24;filter:drop-shadow(0 0 5px rgba(255,229,129,.92));transition:filter .16s ease}
#c2 .resident.work-active:before{content:"";position:absolute;left:50%;top:-9px;width:7px;height:7px;border-radius:50%;background:#ffe681;box-shadow:-8px 4px 0 -2px #fff3ad,8px 5px 0 -2px #fff3ad;translate:-50% 0;animation:littleHomeWorkSpark .8s ease-in-out infinite alternate;pointer-events:none}
#c2 .resident.work-active .eyes{transform:translateY(1px) scaleY(.82)}
#c2 .resident.work-active .mouth{width:7px;height:3px;border-bottom:2px solid #17375b;border-radius:0 0 8px 8px}
#c2 .resident[data-work-target="mailbox"].work-active+.resident{} /* stable selector marker for validation */
@keyframes littleHomeWorkSpark{from{opacity:.55;translate:-50% 1px}to{opacity:1;translate:-50% -2px}}
html[data-motion="reduced"] #c2 .resident.work-active:before{animation:none!important}
@media(max-width:350px),(max-height:740px){#c2 .play .home-primary-copy strong{font-size:17px;max-width:225px}#c2 .play .home-primary-copy small{font-size:9px}}
'''
h=h.replace('</style>',css+'\n</style>',1)

# Replace the old small-step wandering routes with named, authored work destinations.
route_pattern=r"const LITTLE_HOME_ADULT_GAP_MIN=4000;.*?const littleHomeAdults=\[\.\.\.document\.querySelectorAll\('#c2 \.resident\.adult'\)\];"
route_replacement=r'''const LITTLE_HOME_ADULT_GAP_MIN=4200;
const LITTLE_HOME_ADULT_GAP_MAX=8200;
const LITTLE_HOME_ADULT_STEP_MIN=620;
const LITTLE_HOME_ADULT_STEP_MAX=920;
const littleHomeRandom=(min,max)=>min+Math.random()*(max-min);
let littleHomeStoryStage=0;
const littleHomeAdultRoutes={
 garden:[
  {x:0,y:0,target:'potting table',action:'sorting seeds',hold:500},
  {x:16,y:-4,target:'yellow flowers',action:'watering flowers',hold:900},
  {x:-26,y:-24,target:'blue flowers',action:'checking new growth',hold:900},
  {x:0,y:0,target:'potting table',action:'putting the watering can away',hold:450}
 ],
 parcel:[
  {x:0,y:0,target:'cottage porch',action:'checking the delivery list',hold:500},
  {x:28,y:-10,target:'garden path',action:'carrying a parcel',hold:350},
  {x:54,y:5,target:'mailbox',action:'delivering the morning mail',hold:1000,minStage:1},
  {x:40,y:9,target:'visitor pennant',action:'checking for visitors',hold:800,minStage:2},
  {x:0,y:0,target:'cottage porch',action:'marking the route complete',hold:450}
 ],
 tree:[
  {x:0,y:0,target:'tree path',action:'gathering the yard tools',hold:450},
  {x:7,y:12,target:'old tree',action:'tending the roots',hold:900},
  {x:2,y:32,target:'Waykeeper compass',action:'checking the old compass',hold:1000,minStage:6},
  {x:0,y:0,target:'tree path',action:'putting the tools away',hold:450}
 ]
};
const littleHomeRouteFor=adult=>(littleHomeAdultRoutes[adult.dataset.activity]||littleHomeAdultRoutes.garden).filter(step=>!step.minStage||littleHomeStoryStage>=step.minStage);
const littleHomeAdults=[...document.querySelectorAll('#c2 .resident.adult')];'''
h,count=re.subn(route_pattern,route_replacement,h,count=1,flags=re.S)
assert count==1,'adult route block replacement failed'

# Replace the scheduler/runner block, preserving R2 cancellation semantics while adding work holds.
runner_pattern=r"const littleHomeMotionQuery=matchMedia\('\(prefers-reduced-motion: reduce\)'\);.*?littleHomeAdults\.forEach\(adult=>\{\n  adult\.dataset\.motionState='idle';adult\.dataset\.moveCount='0';adult\.dataset\.routeIndex='0';\n  adult\.style\.transform=littleHomeStepTransform\(\(littleHomeAdultRoutes\[adult\.dataset\.activity\]\|\|littleHomeAdultRoutes\.garden\)\[0\]\);\n\}\);"
runner_replacement=r'''const littleHomeMotionQuery=matchMedia('(prefers-reduced-motion: reduce)');
const littleHomeRoot=document.querySelector('#c2');
const littleHomeStepTransform=step=>`translate(${step.x}px,${step.y}px) rotate(${step.r||0}deg)`;
let littleHomeAdultTimer=0;
let littleHomeAdultTurn=0;
let littleHomeAdultAnimation=null;
let littleHomeHoldTimer=0;
let littleHomeHoldResolve=null;
let littleHomeSceneActive=true;
const littleHomeEffectiveReducedMotion=()=>littleHomeMotionQuery.matches||document.documentElement.dataset.motion==='reduced';
const littleHomeMotionAllowed=()=>littleHomeSceneActive&&!littleHomeEffectiveReducedMotion();
const clearLittleHomeWorkState=adult=>{if(!adult)return;adult.classList.remove('work-active');adult.dataset.motionState='idle';adult.dataset.workAction=''};
const littleHomeDelay=ms=>new Promise(resolve=>{littleHomeHoldResolve=resolve;littleHomeHoldTimer=setTimeout(()=>{littleHomeHoldTimer=0;littleHomeHoldResolve=null;resolve()},ms)});
const stopLittleHomeAdultMotion=()=>{
 clearTimeout(littleHomeAdultTimer);littleHomeAdultTimer=0;
 if(littleHomeHoldTimer){clearTimeout(littleHomeHoldTimer);littleHomeHoldTimer=0;if(littleHomeHoldResolve){const done=littleHomeHoldResolve;littleHomeHoldResolve=null;done()}}
 if(littleHomeAdultAnimation){littleHomeAdultAnimation.cancel();littleHomeAdultAnimation=null}
 littleHomeAdults.forEach(clearLittleHomeWorkState);
 if(littleHomeRoot){littleHomeRoot.dataset.activeAdult='';littleHomeRoot.dataset.nextAdultMoveMs='paused'}
};
const scheduleNextLittleHomeAdultMove=()=>{
 clearTimeout(littleHomeAdultTimer);littleHomeAdultTimer=0;
 if(!littleHomeMotionAllowed()||!littleHomeAdults.length)return;
 const wait=littleHomeRandom(LITTLE_HOME_ADULT_GAP_MIN,LITTLE_HOME_ADULT_GAP_MAX);
 if(littleHomeRoot)littleHomeRoot.dataset.nextAdultMoveMs=String(Math.round(wait));
 littleHomeAdultTimer=setTimeout(()=>{littleHomeAdultTimer=0;runLittleHomeAdultMove()},wait);
};
const syncLittleHomeMotion=()=>{
 document.documentElement.dataset.sceneActive=littleHomeSceneActive?'true':'false';
 if(!littleHomeMotionAllowed()){stopLittleHomeAdultMotion();return}
 if(!littleHomeAdultTimer&&!littleHomeAdultAnimation&&!littleHomeHoldTimer)scheduleNextLittleHomeAdultMove();
};
const runLittleHomeAdultMove=async()=>{
 if(!littleHomeMotionAllowed()||!littleHomeAdults.length)return;
 clearTimeout(littleHomeAdultTimer);littleHomeAdultTimer=0;
 const adult=littleHomeAdults[littleHomeAdultTurn%littleHomeAdults.length];
 littleHomeAdultTurn=(littleHomeAdultTurn+1)%littleHomeAdults.length;
 const route=littleHomeRouteFor(adult);
 if(route.length<2){scheduleNextLittleHomeAdultMove();return}
 adult.dataset.motionState='moving';
 if(littleHomeRoot)littleHomeRoot.dataset.activeAdult=adult.dataset.resident||adult.dataset.activity||'';
 let current=route[0];adult.style.transform=littleHomeStepTransform(current);
 for(let i=1;i<route.length&&littleHomeMotionAllowed();i++){
  const next=route[i],duration=littleHomeRandom(LITTLE_HOME_ADULT_STEP_MIN,LITTLE_HOME_ADULT_STEP_MAX);
  adult.dataset.stepDurationMs=String(Math.round(duration));adult.dataset.workTarget=next.target||'';adult.dataset.workAction=next.action||'';
  const animation=adult.animate([{transform:littleHomeStepTransform(current)},{transform:littleHomeStepTransform(next)}],{duration,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
  littleHomeAdultAnimation=animation;
  let completed=false;try{await animation.finished;completed=true}catch{}
  if(littleHomeAdultAnimation===animation)littleHomeAdultAnimation=null;
  if(!completed||!littleHomeMotionAllowed()){animation.cancel();break}
  adult.style.transform=littleHomeStepTransform(next);animation.cancel();adult.dataset.moveCount=String(Number(adult.dataset.moveCount||0)+1);
  if(next.action){adult.classList.add('work-active');adult.dataset.motionState='working';adult.dataset.lastWorkTarget=next.target||'';adult.dataset.lastWorkAction=next.action;await littleHomeDelay(next.hold||550);adult.classList.remove('work-active');adult.dataset.motionState='moving'}
  current=next;
 }
 clearLittleHomeWorkState(adult);adult.dataset.completedWorkCycles=String(Number(adult.dataset.completedWorkCycles||0)+1);
 if(littleHomeRoot)littleHomeRoot.dataset.activeAdult='';
 if(littleHomeMotionAllowed())scheduleNextLittleHomeAdultMove();
};
littleHomeAdults.forEach(adult=>{
 adult.dataset.motionState='idle';adult.dataset.moveCount='0';adult.dataset.completedWorkCycles='0';adult.dataset.lastWorkTarget='';adult.dataset.lastWorkAction='';
 adult.style.transform=littleHomeStepTransform(littleHomeRouteFor(adult)[0]);
});'''
h,count=re.subn(runner_pattern,runner_replacement,h,count=1,flags=re.S)
assert count==1,'adult runner block replacement failed'

# Extend embedded-home binding with contextual primary text and accessible memories.
send_anchor=" const send=action=>{if(parent&&typeof parent.LatchlingsHomeAction==='function'){parent.LatchlingsHomeAction(action);return}parent.postMessage({source:'latchlings-home',action},location.origin)};"
assert send_anchor in h,'embed send anchor changed'
embed_extra=r'''
 const primary=c2.querySelector('.play'),primaryStrong=primary?.querySelector('.home-primary-copy strong'),primarySmall=primary?.querySelector('.home-primary-copy small');
 const keepsakeDefs=[['mailbox',1],['pennant',2],['anchor',3],['bunting',4],['telescope',5],['relic',6],['dock',7]];
 const keepsakeEls=keepsakeDefs.map(([key,stage])=>({key,stage,el:c2.querySelector(`[data-memory="${key}"]`)}));
 keepsakeEls.forEach(({key,el})=>{if(!el)return;const activate=()=>{if(el.classList.contains('memory-unlocked'))send(`memory:${key}`)};el.addEventListener('click',activate);el.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&el.classList.contains('memory-unlocked')){e.preventDefault();activate()}})});
 const syncKeepsakes=stage=>keepsakeEls.forEach(({stage:required,el})=>{if(!el)return;const unlocked=stage>=required;el.classList.toggle('memory-unlocked',unlocked);el.tabIndex=unlocked?0:-1;el.setAttribute('aria-hidden',String(!unlocked))});
'''
h=h.replace(send_anchor,send_anchor+embed_extra)

old_listener="window.addEventListener('message',e=>{if(e.origin!==location.origin||!e.data||e.data.source!=='latchlings-game'||e.data.type!=='home-state')return;document.documentElement.dataset.motion=e.data.motion||'system';document.documentElement.dataset.textSize=e.data.textSize||'normal';syncLittleHomeMotion();if(progress)progress.textContent=String(e.data.stars??0);for(let i=1;i<=8;i++)phone.classList.remove('story-stage-'+i);const stage=Math.max(0,Math.min(8,Number(e.data.stage)||0));for(let i=1;i<=stage;i++)phone.classList.add('story-stage-'+i);phone.classList.remove('story-focus-mailbox','story-focus-pennant','story-focus-anchor','story-focus-bunting');"
new_listener="window.addEventListener('message',e=>{if(e.origin!==location.origin||!e.data||e.data.source!=='latchlings-game'||e.data.type!=='home-state')return;document.documentElement.dataset.motion=e.data.motion||'system';document.documentElement.dataset.textSize=e.data.textSize||'normal';if(progress)progress.textContent=String(e.data.stars??0);for(let i=1;i<=8;i++)phone.classList.remove('story-stage-'+i);const stage=Math.max(0,Math.min(8,Number(e.data.stage)||0));littleHomeStoryStage=stage;for(let i=1;i<=stage;i++)phone.classList.add('story-stage-'+i);syncKeepsakes(stage);if(primaryStrong&&e.data.primaryLabel)primaryStrong.textContent=e.data.primaryLabel;if(primarySmall&&e.data.primaryMeta)primarySmall.textContent=e.data.primaryMeta;syncLittleHomeMotion();phone.classList.remove('story-focus-mailbox','story-focus-pennant','story-focus-anchor','story-focus-bunting');"
assert old_listener in h,'home-state listener anchor changed'
h=h.replace(old_listener,new_listener)

h_path.write_text(h,encoding='utf-8')

# ----- Cache-bust the changed parent scripts and embedded Little Home document.
i_path=root/'index.html'
i=i_path.read_text(encoding='utf-8')
i=i.replace('title-island-concepts/?c=2&amp;embed=1&amp;v=20260913-audit-r1r5-1','title-island-concepts/?c=2&amp;embed=1&amp;v=20260914-home-coherence-candidate1')
i=i.replace('game400-a.js?v=20260913-audit-r1r5-1','game400-a.js?v=20260914-home-coherence-candidate1')
i=i.replace('game400-b.js?v=20260913-audit-r1r5-1','game400-b.js?v=20260914-home-coherence-candidate1')
i_path.write_text(i,encoding='utf-8')

# Candidate invariants.
assert 'primaryLabel' in a and 'primaryMeta' in a
assert 'HOME_KEEPSAKE_MEMORIES' in b and "startsWith('memory:')" in b
assert h.count('data-memory=')==7
assert 'littleHomeAdultRoutes' in h and 'completedWorkCycles' in h and 'littleHomeStoryStage' in h
assert 'memory-unlocked' in h and 'home-primary-copy' in h
assert 'html[data-motion="reduced"] #c2 .resident.work-active:before' in h
assert '20260914-home-coherence-candidate1' in i
print('Astra Little Home coherence candidate patch applied.')
