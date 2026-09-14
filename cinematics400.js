'use strict';
(function(){
const SEEN_KEY='latchlings_cinematics_seen_v1';
const TRIGGERS={1:'opening',251:'across-drift',301:'old-maps',351:'homeward'};
const CAST=Object.fromEntries((window.LATCHLINGS_STORY?.cast||[]).map(person=>[person.name,{...person.visual,suit:person.visual?.suit||person.suit}]));
if(!Object.keys(CAST).length)throw new Error('Canonical Latchlings cast identity is unavailable');
const CINEMATICS={
 opening:{
  title:'The Skyway',chapter:'Before Level 1',finalLabel:'Begin Level 1',unlock:1,
  beats:[
   {label:'The Latchlands Move',visual:'archipelago',lines:[['Narrator','Morning routes light up between drifting islands. A breakfast basket starts toward Little Home while the shoreline quietly slides east.']]},
   {label:'Meet Little Home',visual:'little-home',lines:[['Pippa','Watering line first.'],['Bramble','Bread route second.'],['Rowan','And I will measure how far home moved overnight.'],['Tansy','Please measure before breakfast becomes lunch.']]},
   {label:'The Same Miss',visual:'morning',lines:[['Pippa','My watering stop missed the garden.'],['Bramble','The bread basket missed by almost the same distance.'],['Rowan','Little Home is healthy. The routes are stopping where home used to be.']]},
   {label:'What the Skyway Does',visual:'skyway',lines:[['Narrator','A working Skyway carries parcels, visits, and daily chores while the islands keep moving. The route adapts; the world does not hold still.']]},
   {label:'A Waykeeper Answers',visual:'waykeeper',lines:[['Pippa','We sent the old Waykeeper call. You answered.'],['Rowan','We will bring what each route is doing now. You help us test what fits the whole network.']]},
   {label:'Everyone Knows a Piece',visual:'helper-crew',lines:[['Bramble','Neighbors know their own paths better than any master map.'],['Narrator','Local route crews step forward with what they know, one working stop at a time.']]},
   {label:'How You See a Route',visual:'snap-demo',lines:[['Rowan','Choose a helper and a direction. They slide until the route gives them a real stopping point.'],['Narrator','Guide every helper into the matching nest. When everyone arrives, that route works again.']]},
   {label:'Start With Sunpetal',visual:'morning',lines:[['Pippa','First, make breakfast possible again.'],['Pip','Then we investigate breakfast.'],['Tansy','In that order, please.']]}
  ]
 },
 'across-drift':{
  title:'Across the Drift',chapter:'After Level 250',finalLabel:'Continue to Copperline',unlock:251,
  beats:[
   {label:'The View From Prism Gardens',visual:'prism-view',lines:[['Narrator','From Prism Gardens, the horizon opens. For the first time, several distant routes can be watched at once.']]},
   {label:'A Familiar Porch',visual:'porch',lines:[['Tansy','I can still see their porch.'],['Pip','That sounded less reassuring than you meant it to.'],['Tansy','The old route no longer reaches it. I would like the new one to.']]},
   {label:'Not One Bad Route',visual:'network-miss',lines:[['Rowan','Watch the endpoints. The islands keep drifting while the old lines stay put.'],['Narrator','This is not one bad route. The network is falling behind the world it serves.']]},
   {label:'Yesterday’s Map',visual:'map-mismatch',lines:[['Pippa','Line up this old marker and another island falls out of place.'],['Rowan','Then yesterday’s map cannot be the answer.']]},
   {label:'New Coordinates',visual:'new-route',lines:[['Bramble','Good. I was getting tired of chasing yesterday.'],['Narrator','A newly drawn route reaches the familiar porch. It never existed on the old map, and it works now.']]}
  ]
 },
 'old-maps':{
  title:'Old Maps, New Routes',chapter:'After Level 300',finalLabel:'Build the Living Skyway',unlock:301,
  beats:[
   {label:'The Contradictory Drawer',visual:'map-drawer',lines:[['Bramble','I found the instructions.'],['Pippa','Wonderful.'],['Bramble','They disagree with the other instructions.']]},
   {label:'Look at the Dates',visual:'dated-maps',lines:[['Rowan','They do not disagree. Look at the dates.'],['Pippa','Every map was approved in its own year.']]},
   {label:'They Were All Correct',visual:'map-sequence',lines:[['Pippa','The same landmarks moved between every map.'],['Narrator','Old Waykeepers kept redrawing routes because each map was correct for a different moment.']]},
   {label:'What Was Forgotten',visual:'automation',lines:[['Rowan','The machines kept repeating the last approved routes.'],['Bramble','And eventually nobody was left at the desk checking the window.']]},
   {label:'The Real Problem',visual:'frozen-network',lines:[['Narrator','The islands keep moving. The stale routes do not.'],['Pippa','Then we do not restore the old map.']]},
   {label:'Make a New One',visual:'brand-new-route',lines:[['Rowan','We draw the route the Latchlands need now.'],['Bramble','Finally. Instructions I can follow.'],['Narrator','A route can be new and still be right. The test is whether it serves the living world.']]}
  ]
 },
 homeward:{
  title:'Homeward',chapter:'After Level 350',finalLabel:'Begin Homeward',unlock:351,
  beats:[
   {label:'Signals From Everywhere',visual:'signals',lines:[['Narrator','Stormswitch answers first. Then signals arrive from every restored region, each watching its own piece of the drift.']]},
   {label:'Everyone Has a Part',visual:'keepsakes',lines:[['Pippa','Meadows checked the morning routes.'],['Rowan','Lodestone adjusted the anchor window.'],['Bramble','Copperline approved a new line and complained about its handwriting.']]},
   {label:'A Living Network',visual:'living-network',lines:[['Narrator','A drift report reaches an anchor crew. Their adjustment changes a travel window. Another community redraws its route before the old one can fail.']]},
   {label:'No Perfect Route',visual:'many-routes',lines:[['Rowan','Two routes can both be right at different moments.'],['Pippa','Good. We know what to do with perfect old routes now.']]},
   {label:'Aurora Crown',visual:'aurora-crown',lines:[['Narrator','Aurora Crown is where old lines meet, not where one master switch controls them.'],['Bramble','Excellent. Everyone brought tools anyway.']]},
   {label:'Homeward',visual:'homeward-network',lines:[['Pippa','We keep watching.'],['Rowan','We keep adjusting.'],['Tansy','We keep visiting.'],['Pip','Preferably by the interesting route.'],['Narrator','Little Home drifts with everyone else. The living Skyway keeps finding a way back.']]}
  ]
 }
};
let activeId=null,activeIndex=0,activeLine=0,onDone=null,markOnDone=false,lastFocus=null;
function escapeHtml(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}
function suitSvg(s){
 if(s==='heart')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 86C39 74 13 58 13 34c0-14 10-23 23-23 8 0 14 4 18 10 4-6 10-10 18-10 13 0 23 9 23 23 0 24-26 40-45 52Z"/></svg>';
 if(s==='diamond')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 7 88 50 50 93 12 50Z"/></svg>';
 if(s==='club')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 12a19 19 0 0 1 12 34 20 20 0 1 1 9 37c-9 0-15-5-18-11 1 10 5 16 12 21H35c7-5 11-11 12-21-3 6-9 11-18 11a20 20 0 1 1 9-37A19 19 0 0 1 50 12Z"/></svg>';
 if(s==='spade')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8C43 22 14 36 14 60c0 13 10 23 23 23 8 0 13-4 16-10-1 9-5 15-12 20h18c-7-5-11-11-12-20 3 6 8 10 16 10 13 0 23-10 23-23C86 36 57 22 50 8Z"/></svg>';
 return '';
}
function character(name,extra=''){const c=CAST[name];if(!c)return'';return `<span class="cin-character ${c.child?'child':''} ${extra} expr-${c.expr}" data-character="${name}" style="--cin-color:${c.color};--cin-light:${c.light};--cin-dark:${c.dark}"><span class="cin-suit">${suitSvg(c.suit)}</span><span class="cin-face"><span class="cin-eyes"><i></i><i></i></span><i class="cin-mouth"></i></span></span>`}
function helper(color,light,dark,suit,extra=''){return `<span class="cin-character helper ${extra}" style="--cin-color:${color};--cin-light:${light};--cin-dark:${dark}"><span class="cin-suit">${suitSvg(suit)}</span><span class="cin-face"><span class="cin-eyes"><i></i><i></i></span><i class="cin-mouth"></i></span></span>`}
function islandMarkup(i,extra=''){const prop=['tree','cottage','rock','tree','cottage'][i-1]||'tree';return `<div class="cin-island i${i} ${extra}"><span class="cin-island-side"></span><span class="cin-island-rim"></span><span class="cin-island-top"></span><i class="cin-island-prop prop-${prop}"></i></div>`}
function islandsHtml(cls=''){return `<div class="cin-islands ${cls}">${[1,2,3,4,5].map(i=>islandMarkup(i)).join('')}<span class="cin-route r1"></span><span class="cin-route r2"></span><span class="cin-route r3"></span><span class="cin-route r4"></span></div>`}
function homeHtml(mode=''){return `<div class="cin-home-reference-wrap ${mode}"><iframe class="cin-home-reference" src="title-island-concepts/?c=2&embed=1&cinematic=1" title="Little Home" tabindex="-1" aria-hidden="true"></iframe></div>`}
function routeDemoHtml(){return `<div class="cin-demo-board"><div class="cin-demo-label top">ROCK STOP</div><div class="cin-demo-track top"><span class="demo-mover rock-mover">${helper('#4c8ff4','#79aff9','#2e69c8','spade')}</span><i class="demo-rock"></i></div><div class="cin-demo-label bottom">HELPER STOP → SAFE NEST</div><div class="cin-demo-track bottom"><span class="demo-mover helper-mover">${helper('#f6b737','#ffd06a','#d18c16','diamond')}</span><span class="demo-blocker">${helper('#66bd72','#94dc98','#469852','club')}</span><span class="demo-nest">${suitSvg('diamond')}</span></div><div class="cin-demo-arrow">→</div></div>`}
function mapSheets(mode){return `<div class="cin-maps ${mode}"><div class="cin-map-sheet m1"><b>YEAR 12</b><i class="line a"></i><i class="line b"></i><i class="node n1"></i><i class="node n2"></i></div><div class="cin-map-sheet m2"><b>YEAR 31</b><i class="line a"></i><i class="line b"></i><i class="node n1"></i><i class="node n2"></i></div><div class="cin-map-sheet m3"><b>YEAR 58</b><i class="line a"></i><i class="line b"></i><i class="node n1"></i><i class="node n2"></i></div></div>`}
function networkNode(n,label,type){return `<div class="node n${n} type-${type}"><i class="node-side"></i><i class="node-rim"></i><i class="node-top"></i><i class="node-landmark"></i><span>${label}</span></div>`}
function networkHtml(mode=''){const nodes=[['MEADOWS','meadow'],['LANTERN','lantern'],['LODESTONE','lodestone'],['KEEP','keep'],['PRISM','prism'],['COPPERLINE','copper'],['STORMSWITCH','storm'],['CROWN','crown']];return `<div class="cin-network ${mode}">${nodes.map((x,i)=>networkNode(i+1,x[0],x[1])).join('')}<span class="wire w1"></span><span class="wire w2"></span><span class="wire w3"></span><span class="wire w4"></span><span class="wire w5"></span><span class="wire w6"></span><span class="wire w7"></span></div>`}
function lookoutHtml(){return `<div class="cin-lookout-scene cin-porch-production"><i class="porch-cloud c1"></i><i class="porch-cloud c2"></i><div class="porch-far-island"><i class="porch-island-side"></i><i class="porch-island-top"></i><i class="porch-tree"></i><i class="porch-house"></i><i class="porch-deck"></i><i class="porch-friend-lantern l1"></i><i class="porch-friend-lantern l2"></i></div><div class="porch-near-island"><i class="porch-crystal k1"></i><i class="porch-crystal k2"></i></div><div class="cin-telescope production-telescope"><i class="tube"></i><i class="lens"></i><span class="cin-telescope-mount"><b></b><b></b><b></b></span></div>${character('Tansy','lookout-tansy')}${character('Pip','lookout-pip')}<i class="cin-sightline"></i><i class="porch-depth-haze"></i></div>`}
function keepsakeHtml(){return `<div class="cin-community-work"><div class="work-station meadows">${character('Pippa','work-pippa')}<i class="work-prop route-marker"></i><b>CHECK ROUTE</b></div><div class="work-station lodestone">${character('Rowan','work-rowan')}<i class="work-prop anchor-ring"></i><b>ADJUST ANCHOR</b></div><div class="work-station copperline">${character('Bramble','work-bramble')}<i class="work-prop map-roll"></i><b>REDRAW LINE</b></div><span class="work-signal s1"></span><span class="work-signal s2"></span></div>`}
function automationHtml(){return `<div class="cin-automation"><div class="hand-map">${mapSheets('tiny')}</div><div class="machine"><i class="gear g1"></i><i class="gear g2"></i><span class="fixed-line"></span></div></div>`}
function routeDraftingHtml(label='LIVE ROUTE'){return `<div class="cin-route-drafting"><i></i><b>${label}</b></div>`}
function volunteerHtml(){return `<div class="cin-volunteer-scene">${islandsHtml('volunteer-islands')}<i class="volunteer-route-stake"></i>${character('Bramble','volunteer-bramble')}${helper('#4c8ff4','#79aff9','#2e69c8','spade','volunteer-helper h1')}${helper('#f6b737','#ffd06a','#d18c16','diamond','volunteer-helper h2')}${helper('#66bd72','#94dc98','#469852','club','volunteer-helper h3')}<span class="volunteer-line l1"></span><span class="volunteer-line l2"></span><span class="volunteer-line l3"></span></div>`}
function visualHtml(type){
 if(type==='archipelago')return islandsHtml('wide');
 if(type==='little-home')return homeHtml('little-home');
 if(type==='skyway')return `${islandsHtml('bright')}<div class="cin-route-cargo"><i>✉</i><i>✿</i><i>⌂</i></div>`;
 if(type==='waykeeper')return `${islandsHtml('waykeeper-map')}<div class="cin-compass"><i></i><b>WAYKEEPER</b></div>`;
 if(type==='helper-crew')return volunteerHtml();
 if(type==='snap-demo')return routeDemoHtml();
 if(type==='morning')return `${homeHtml('morning')}<div class="cin-breakfast-route"><span class="old-line"></span><i class="basket"></i><i class="miss">×</i></div>`;
 if(type==='prism-view')return `${islandsHtml('prism')}<div class="cin-prism-beam p1"></div><div class="cin-prism-beam p2"></div><div class="cin-prism-beam p3"></div>`;
 if(type==='porch')return lookoutHtml();
 if(type==='network-miss')return `${islandsHtml('misaligned')}<div class="cin-ghost-map"><span></span><span></span><span></span></div>`;
 if(type==='map-mismatch')return `<div class="cin-overlay-map"><div class="old"><b>OLD MAP</b>${islandsHtml('map-old')}</div><div class="now"><b>NOW</b>${islandsHtml('map-now')}</div></div>`;
 if(type==='new-route')return `${islandsHtml('new')}${routeDraftingHtml('NEW COORDINATES')}`;
 if(type==='map-drawer')return `<div class="cin-drawer"><i></i>${mapSheets('stacked')}</div>${character('Bramble','map-bramble')}`;
 if(type==='dated-maps')return mapSheets('spread');
 if(type==='map-sequence')return mapSheets('sequence');
 if(type==='automation')return automationHtml();
 if(type==='frozen-network')return `${islandsHtml('frozen')}<div class="cin-frozen-lines"><i></i><i></i><i></i></div>`;
 if(type==='brand-new-route')return `${islandsHtml('brand-new')}<div class="cin-compass small"><i></i></div>${routeDraftingHtml('LIVING ROUTE')}`;
 if(type==='signals')return networkHtml('signals');
 if(type==='keepsakes')return keepsakeHtml();
 if(type==='living-network')return networkHtml('living');
 if(type==='many-routes')return `${islandsHtml('many')}<div class="cin-route-options"><i></i><i></i><i></i></div>`;
 if(type==='aurora-crown')return `${networkHtml('crown')}<div class="cin-aurora"><i></i><i></i><i></i></div>`;
 if(type==='homeward-network')return `<div class="cin-homeward-wrap">${networkHtml('mini')}${homeHtml('homeward')}</div>`;
 return islandsHtml();
}
function seenMap(){try{return JSON.parse(localStorage.getItem(SEEN_KEY)||'{}')}catch(_){return {}}}
function hasSeen(id){return !!seenMap()[id]}
function markSeen(id){const s=seenMap();s[id]=1;try{localStorage.setItem(SEEN_KEY,JSON.stringify(s))}catch(_){}}
function reset(){try{localStorage.removeItem(SEEN_KEY)}catch(_){}}
function ensureOverlay(){let o=document.getElementById('cinematicOverlay');if(o)return o;o=document.createElement('div');o.id='cinematicOverlay';o.className='cinematic-overlay';o.setAttribute('aria-hidden','true');o.innerHTML=`<section class="cinematic-shell" role="dialog" aria-modal="true" aria-labelledby="cinematicTitle"><header class="cinematic-head"><div><span class="cinematic-kind">STORY CINEMATIC</span><span class="cinematic-chapter" id="cinematicChapter"></span></div><button class="cinematic-skip" id="cinematicSkip" type="button">Skip</button></header><div class="cinematic-stage" id="cinematicStage" aria-hidden="true"></div><div class="cinematic-copy"><div class="cinematic-counter" id="cinematicCounter"></div><h2 id="cinematicTitle"></h2><h3 id="cinematicBeat"></h3><div class="cinematic-lines" id="cinematicLines" aria-live="polite"></div></div><footer class="cinematic-footer"><div class="cinematic-progress" id="cinematicProgress" aria-hidden="true"></div><button class="cinematic-next" id="cinematicNext" type="button">Continue</button></footer></section>`;document.body.appendChild(o);document.getElementById('cinematicSkip').onclick=()=>finish(true);document.getElementById('cinematicNext').onclick=next;return o}
function renderTurn(){
 const c=CINEMATICS[activeId],b=c&&c.beats[activeIndex],line=b&&b.lines[activeLine];
 if(!c||!b||!line)return;
 const o=ensureOverlay();
 o.dataset.turn=String(activeLine);
 const [speaker,text]=line;
 document.getElementById('cinematicLines').innerHTML=`<p class="${speaker==='Narrator'?'narrator':'dialogue'} is-current"><strong>${escapeHtml(speaker)}</strong><span>${escapeHtml(text)}</span></p>`;
 const nextBtn=document.getElementById('cinematicNext');
 const lastBeat=activeIndex===c.beats.length-1,lastLine=activeLine===b.lines.length-1;
 nextBtn.textContent=lastBeat&&lastLine?c.finalLabel:(lastLine?'Next scene':'Continue');
 const copy=document.querySelector('.cinematic-copy');if(copy)copy.scrollTop=0;
}
function render(){
 const c=CINEMATICS[activeId],b=c&&c.beats[activeIndex];if(!c||!b)return;
 const o=ensureOverlay();o.dataset.cinematic=activeId;o.dataset.visual=b.visual;o.dataset.beat=String(activeIndex);
 document.getElementById('cinematicChapter').textContent=c.chapter;
 document.getElementById('cinematicTitle').textContent=c.title;
 document.getElementById('cinematicBeat').textContent=b.label;
 document.getElementById('cinematicCounter').textContent=`${activeIndex+1} / ${c.beats.length}`;
 document.getElementById('cinematicStage').innerHTML=visualHtml(b.visual);
 document.getElementById('cinematicProgress').innerHTML=c.beats.map((_,i)=>`<i class="${i===activeIndex?'active':i<activeIndex?'done':''}"></i>`).join('');
 renderTurn();
 requestAnimationFrame(()=>o.classList.add('beat-ready'));
}
function show(id,opts={}){const c=CINEMATICS[id];if(!c)return false;if(activeId)return false;const o=ensureOverlay();lastFocus=document.activeElement;activeId=id;activeIndex=0;activeLine=0;onDone=typeof opts.onComplete==='function'?opts.onComplete:null;markOnDone=opts.markSeen!==false;o.classList.remove('beat-ready');o.classList.add('show');o.setAttribute('aria-hidden','false');document.body.classList.add('cinematic-open');render();setTimeout(()=>{const b=document.getElementById('cinematicNext');if(b)try{b.focus({preventScroll:true})}catch(_){b.focus()}const copy=document.querySelector('.cinematic-copy');if(copy)copy.scrollTop=0},50);return true}
function next(){if(!activeId)return;const c=CINEMATICS[activeId],b=c.beats[activeIndex],o=ensureOverlay();if(activeLine<b.lines.length-1){activeLine++;renderTurn();return}if(activeIndex>=c.beats.length-1){finish(false);return}o.classList.remove('beat-ready');activeIndex++;activeLine=0;setTimeout(render,35)}
function finish(skipped){if(!activeId)return;const id=activeId,cb=onDone,shouldMark=markOnDone,o=ensureOverlay();if(shouldMark)markSeen(id);activeId=null;activeIndex=0;activeLine=0;onDone=null;markOnDone=false;o.classList.remove('show','beat-ready');o.removeAttribute('data-cinematic');o.removeAttribute('data-visual');o.setAttribute('aria-hidden','true');document.body.classList.remove('cinematic-open');if(lastFocus&&typeof lastFocus.focus==='function')try{lastFocus.focus()}catch(_){}lastFocus=null;if(cb)setTimeout(()=>cb({id,skipped:!!skipped}),40)}
function maybeShowBeforeLevel(level,unlocked,onComplete){const id=TRIGGERS[Number(level)];if(!id||hasSeen(id))return false;const c=CINEMATICS[id];if(Number(level)>1&&Number(unlocked||1)<c.unlock)return false;return show(id,{onComplete,markSeen:true})}
function renderLibrary(container,unlocked){if(typeof container==='string')container=document.getElementById(container);if(!container)return;const u=Math.max(1,Number(unlocked)||1),order=['opening','across-drift','old-maps','homeward'];container.innerHTML=order.map(id=>{const c=CINEMATICS[id],locked=u<c.unlock,seen=hasSeen(id);return `<button class="cinematic-library-card ${locked?'locked':''}" type="button" data-cinematic-id="${id}" ${locked?'disabled':''}><span class="cinematic-library-status">${locked?`Unlocks after Level ${c.unlock-1}`:seen?'Replay cinematic':'Watch cinematic'}</span><strong>${escapeHtml(c.title)}</strong><small>${escapeHtml(c.chapter)}</small></button>`}).join('');container.querySelectorAll('.cinematic-library-card:not(.locked)').forEach(b=>b.onclick=()=>show(b.dataset.cinematicId,{markSeen:false}))}
document.addEventListener('keydown',e=>{if(!activeId)return;if(e.key==='Escape'){e.preventDefault();finish(true);return}if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();next()}});
window.LatchlingsCinematics={TRIGGERS,CINEMATICS,show,next,finish,hasSeen,reset,maybeShowBeforeLevel,renderLibrary,castIdentitySource:'LATCHLINGS_STORY.cast',get active(){return activeId},get beat(){return activeIndex},get line(){return activeLine}};
})();
