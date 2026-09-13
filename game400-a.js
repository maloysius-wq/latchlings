'use strict';
const LEVELS=window.LEVELS||[];
const STORY=window.LATCHLINGS_STORY||null;
const CHAPTERS=STORY?STORY.chapters:[
 {name:'First Snaps',theme:'Sunpetal Meadows',desc:'Edges, rocks, and clean magnetic routes. The meadow starts gentle, then grows into long setup puzzles.',tip:'Use the whole board. Sometimes the useful stopping point is several snaps away from the nest.',color:'#b9dcf4'},
 {name:'Clever Stops',theme:'Lanternwood Grove',desc:'Other Latchlings become movable stoppers in a lantern-lit forest of increasingly tangled routes.',tip:'A Latchling can be more valuable as a temporary wall than as the next piece you finish.',color:'#294e62'},
 {name:'Magnetic Anchors',theme:'Lodestone Caverns',desc:'Anchors create precise stops inside crystal caverns while earlier stopper logic remains in play.',tip:'Treat anchors as movable-route geometry: landing on one can set up the next two or three snaps.',color:'#25354d'},
 {name:'Suit Gates',theme:'Masquerade Keep',desc:'Black suit marks decide which Latchling can cross each gate inside the moonlit keep.',tip:'If a route looks blocked, ask whether the wrong Latchling is approaching the gate.',color:'#403052'},
 {name:'Color Gates',theme:'Prism Gardens',desc:'Body color joins suit logic in a luminous garden where identity matters as much as position.',tip:'Separate the two clues: body color answers one gate, black suit answers another.',color:'#82cbd0'},
 {name:'Rails and Turns',theme:'Copperline Junction',desc:'Directional rails and turners reshape continuous snaps across a warm copper transit hub.',tip:'A turner changes direction without ending the move. Trace the entire snap before pressing.',color:'#9a6748'},
 {name:'Switchworks',theme:'Stormswitch Foundry',desc:'Switches, doors, rails, and identity gates combine inside an electric storm foundry.',tip:'A switch is about timing, not just activation. Opening a door can also remove a useful stopping wall.',color:'#283a4c'},
 {name:'Master Circuit',theme:'Aurora Crown',desc:'Every mechanic is active beneath the aurora. These are the campaign’s longest and most layered routes.',tip:'Read the board as a sequence of future board states, not as a single move.',color:'#172b52'}
 ];
const COLORS={coral:'#ef5f66',blue:'#4c8ff4',mint:'#66bd72',gold:'#f6b737',lavender:'#9a72df'};
const LIGHT={coral:'#ff9297',blue:'#79aff9',mint:'#94dc98',gold:'#ffd06a',lavender:'#c3a0f1'};
const DARK={coral:'#c33d49',blue:'#2e69c8',mint:'#469852',gold:'#d18c16',lavender:'#724fbd'};
const DIRV={U:[-1,0],D:[1,0],L:[0,-1],R:[0,1]}; const CW={U:'R',R:'D',D:'L',L:'U'},CCW={U:'L',L:'D',D:'R',R:'U'};
let currentLevel=1,chapterView=1,rangeView=0,selected=0,movesUsed=0,doorMask=0,positions=[],animating=false,hintStep=0;
const PROGRESS_KEY='latchlings_campaign400_progress_v1';
let progress=loadProgress();
const UI_PREFS_KEY='latchlings_ui_prefs_v1';
const DAILY_PROGRESS_KEY='latchlings_daily400_progress_v1';
let playMode='campaign',dailySession=null;
function loadUiPrefs(){try{const x=JSON.parse(localStorage.getItem(UI_PREFS_KEY)||'{}');return {motion:x.motion==='reduced'?'reduced':'system',textSize:x.textSize==='large'?'large':'normal'}}catch(_){return {motion:'system',textSize:'normal'}}}
let uiPrefs=loadUiPrefs();
function effectiveReducedMotion(){return uiPrefs.motion==='reduced'||!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)}
function applyUiPrefs(){document.documentElement.dataset.motion=uiPrefs.motion;document.documentElement.dataset.textSize=uiPrefs.textSize}
function setUiPref(key,value){if(key==='motion')uiPrefs.motion=value==='reduced'?'reduced':'system';if(key==='textSize')uiPrefs.textSize=value==='large'?'large':'normal';try{localStorage.setItem(UI_PREFS_KEY,JSON.stringify(uiPrefs))}catch(_){}applyUiPrefs();updateHome(true)}
applyUiPrefs();
window.LatchlingsPrefs={get:()=>({...uiPrefs}),set:setUiPref,reducedMotion:effectiveReducedMotion};
function dailyRouteInfo(){const now=new Date(),key=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`,seed=now.getFullYear()*372+now.getMonth()*31+now.getDate();return {key,level:(seed*37%400)+1}}
function startDailyPuzzle(){dailySession=dailyRouteInfo();startLevel(dailySession.level,'daily')}
function saveDailyCompletion(stars){if(!dailySession)return;try{const all=JSON.parse(localStorage.getItem(DAILY_PROGRESS_KEY)||'{}');all[dailySession.key]={level:dailySession.level,stars,moves:movesUsed,completed:true};localStorage.setItem(DAILY_PROGRESS_KEY,JSON.stringify(all))}catch(_){}}
function leaveDailyForHome(){playMode='campaign';dailySession=null;document.body.dataset.playMode='campaign';screen('home')}
let atlasRewardState=null,atlasRewardTimers=[];
const ATLAS_REWARD_TIME_SCALE=1.7;
function atlasRewardMs(ms){return Math.round(ms*ATLAS_REWARD_TIME_SCALE)}
function loadProgress(){try{const x=JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}');return {unlocked:Math.max(1,Math.min(400,x.unlocked||1)),stars:x.stars||{}}}catch(e){return {unlocked:1,stars:{}}}}
function saveProgress(){localStorage.setItem(PROGRESS_KEY,JSON.stringify(progress));updateHome()}
function showError(e){const d=document.getElementById('debug');d.style.display='block';d.dataset.playerSafe='true';d.textContent='Something went wrong. Return to Level Select and try again.'}
window.addEventListener('error',e=>showError(e.error||e.message));window.addEventListener('unhandledrejection',e=>showError(e.reason));
let activeScreenTransition=null;
function screen(id){
 const next=document.getElementById(id);if(!next)return;
 if(activeScreenTransition&&typeof activeScreenTransition.skipTransition==='function')activeScreenTransition.skipTransition();
 const current=document.querySelector('.screen.active');
 if(current===next){document.body.dataset.screen=id;if(id==='home')setTimeout(()=>updateHome(true),0);return}
 const swap=()=>{document.body.dataset.screen=id;document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));next.classList.add('active');if(id==='home')setTimeout(()=>updateHome(true),0)};
 const reduced=effectiveReducedMotion(),canAnimate=!!current&&!reduced&&typeof current.animate==='function';
 if(!canAnimate){swap();return}
 const atlasDive=current.id==='levels'&&id==='game',atlasPullback=current.id==='game'&&id==='levels';
 const priorStyle=current.getAttribute('style'),rect=current.getBoundingClientRect(),computedDisplay=getComputedStyle(current).display,display=computedDisplay==='none'?'flex':computedDisplay;
 let transformOrigin='50% 50%';
 if(atlasDive){const target=current.querySelector(`.atlas-node[data-level="${currentLevel}"]`)||current.querySelector('.atlas-node.current:not(.locked)')||current.querySelector('.atlas-node:not(.locked)');if(target){const tr=target.getBoundingClientRect(),ox=tr.left+tr.width/2-rect.left,oy=tr.top+tr.height/2-rect.top;transformOrigin=`${Math.round(ox)}px ${Math.round(oy)}px`}}
 let animation=null,rafA=0,rafB=0,settled=false,readySettled=false,resolveReady,resolveFinished,controller;
 const ready=new Promise(r=>resolveReady=r),finished=new Promise(r=>resolveFinished=r);
 const markReady=()=>{if(readySettled)return;readySettled=true;resolveReady()};
 const restore=()=>{if(priorStyle===null)current.removeAttribute('style');else current.setAttribute('style',priorStyle);current.classList.remove('screen-transition-outgoing')};
 const settle=()=>{if(settled)return;settled=true;if(rafA)cancelAnimationFrame(rafA);if(rafB)cancelAnimationFrame(rafB);if(animation){animation.onfinish=null;animation.oncancel=null;animation.cancel();animation=null}markReady();restore();resolveFinished();if(activeScreenTransition===controller)activeScreenTransition=null};
 controller={ready,finished,skipTransition(){if(settled)return;if(animation)animation.cancel();settle()}};
 activeScreenTransition=controller;
 current.classList.add('screen-transition-outgoing');
 Object.assign(current.style,{display,position:'fixed',left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px',margin:'0',zIndex:'40',pointerEvents:'none',willChange:'transform,opacity',transformOrigin,transform:'translate3d(0,0,0) scale(1)',opacity:'1'});
 swap();
 if(window.LatchlingsSFX&&window.LatchlingsSFX.screenSwipe)window.LatchlingsSFX.screenSwipe();
 void next.offsetWidth;
 rafA=requestAnimationFrame(()=>{rafB=requestAnimationFrame(()=>{if(settled)return;markReady();const frames=atlasDive?[{transform:'translate3d(0,0,0) scale(1)',opacity:1},{transform:'translate3d(0,0,0) scale(1.045)',opacity:1,offset:.18},{transform:'translate3d(0,0,0) scale(1.34)',opacity:.02}]:atlasPullback?[{transform:'translate3d(0,0,0) scale(1)',opacity:1},{transform:'translate3d(0,0,0) scale(.94)',opacity:.94,offset:.24},{transform:'translate3d(0,0,0) scale(.76)',opacity:0}]:[{transform:'translate3d(0,0,0) scaleX(1)',opacity:1},{transform:'translate3d(106vw,0,0) scaleX(1.018)',opacity:.10}],duration=atlasDive||atlasPullback?460:420,easing=atlasDive?'cubic-bezier(.18,.72,.2,1)':atlasPullback?'cubic-bezier(.24,.62,.24,1)':'cubic-bezier(.22,.61,.36,1)';animation=current.animate(frames,{duration,easing,fill:'forwards'});animation.onfinish=settle;animation.oncancel=()=>{if(!settled)settle()}})});
 return controller;
}
function icon(name){const paths={
 back:'<path d="M15 5 8 12l7 7"/><path d="M8 12h10"/>',pause:'<path d="M9 5v14M15 5v14"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.12-1.28l2-1.55-2-3.46-2.45 1a7 7 0 0 0-2.2-1.28L13.9 3h-4l-.36 2.43a7 7 0 0 0-2.2 1.28l-2.45-1-2 3.46 2 1.55A7 7 0 0 0 4.8 12c0 .44.04.87.12 1.28l-2 1.55 2 3.46 2.45-1a7 7 0 0 0 2.2 1.28L9.9 21h4l.36-2.43a7 7 0 0 0 2.2-1.28l2.45 1 2-3.46-2-1.55c.08-.41.12-.84.12-1.28Z"/>',reset:'<path d="M4 7v5h5"/><path d="M5.6 16a7 7 0 1 0 .2-8.2L4 10"/>',hint:'<path d="M9 18h6M10 21h4"/><path d="M8.4 14.3A6 6 0 1 1 15.6 14.3c-1.1.8-1.6 1.5-1.6 2.7h-4c0-1.2-.5-1.9-1.6-2.7Z"/>',up:'<path d="M5 15 12 8l7 7"/>',down:'<path d="m5 9 7 7 7-7"/>',left:'<path d="m15 5-7 7 7 7"/>',right:'<path d="m9 5 7 7-7 7"/>',anchor:'<circle cx="12" cy="5" r="2"/><path d="M12 7v11M7 10h10M5 15c1 4 4 6 7 6s6-2 7-6M5 15l-2 1M19 15l2 1"/>'};return `<svg class="icon" viewBox="0 0 24 24">${paths[name]||''}</svg>`}
function suitSvg(s){
 if(s==='heart')return '<svg viewBox="0 0 100 100"><path d="M50 86C39 74 13 58 13 34c0-14 10-23 23-23 8 0 14 4 18 10 4-6 10-10 18-10 13 0 23 9 23 23 0 24-26 40-45 52Z"/></svg>';
 if(s==='diamond')return '<svg viewBox="0 0 100 100"><path d="M50 7 88 50 50 93 12 50Z"/></svg>';
 if(s==='club')return '<svg viewBox="0 0 100 100"><path d="M50 12a19 19 0 0 1 12 34 20 20 0 1 1 9 37c-9 0-15-5-18-11 1 10 5 16 12 21H35c7-5 11-11 12-21-3 6-9 11-18 11a20 20 0 1 1 9-37A19 19 0 0 1 50 12Z"/></svg>';
 if(s==='spade')return '<svg viewBox="0 0 100 100"><path d="M50 8C43 22 14 36 14 60c0 13 10 23 23 23 8 0 13-4 16-10-1 9-5 15-12 20h18c-7-5-11-11-12-20 3 6 8 10 16 10 13 0 23-10 23-23C86 36 57 22 50 8Z"/></svg>';
 return '<svg viewBox="0 0 100 100"><path d="m50 7 13 27 30 4-22 21 6 30-27-14-27 14 6-30L7 38l30-4Z"/></svg>';
}
function gateColor(color){return COLORS[color]||'#4c8ff4'}
function expressionFor(levelId,pi,piece){const allowed=['happy','surprised','angry','smug','sleepy','curious','determined'];const authored=piece&&piece.expression;return allowed.includes(authored)?authored:allowed[(levelId*7+pi*11)%allowed.length]}
function applyTheme(ch){ch=Math.max(1,Math.min(8,ch));const app=document.getElementById('app');for(let i=1;i<=8;i++)app.classList.remove('theme-ch'+i);app.classList.add('theme-ch'+ch);const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute('content',CHAPTERS[ch-1].color)}
function clockwiseAvailable(){const lev=LEVELS[currentLevel-1],mid=(lev.size-1)/2;return positions.map((p,i)=>p?{i,p,a:(Math.atan2(p[1]-mid,-(p[0]-mid))+Math.PI*2)%(Math.PI*2)}:null).filter(Boolean).sort((a,b)=>a.a-b.a||a.i-b.i).map(x=>x.i)}
function cycleLatchling(){if(animating)return;const order=clockwiseAvailable();if(order.length<2)return;const at=order.indexOf(selected);selected=order[(at<0?0:at+1)%order.length];renderPieces(LEVELS[currentLevel-1]);if(window.LatchlingsSFX)window.LatchlingsSFX.cycleLatchling()}
function nearestLatchling(origin){let best=-1,bestD=Infinity;positions.forEach((p,i)=>{if(!p)return;const d=(p[0]-origin[0])**2+(p[1]-origin[1])**2;if(d<bestD||(d===bestD&&i<best)){bestD=d;best=i}});return best}
function starSvg(on,cls=''){return `<span class="win-star ${on?'on':''} ${cls}"><svg viewBox="0 0 100 100" aria-hidden="true"><path class="core" d="M50 8 62 35 92 38 69 58 75 88 50 72 25 88 31 58 8 38 38 35 Z"/><path class="shine" d="M50 17 58 35 78 37 63 50 67 68 50 58 33 68 37 50 22 37 42 35 Z"/></svg></span>`}
function updateHome(replay=false){const total=Object.values(progress.stars).reduce((a,b)=>a+(+b||0),0),legacy=document.getElementById('homeStars');if(legacy)legacy.textContent=total;const frame=document.getElementById('homeTitleFrame'),stage=STORY?STORY.completedChapters(progress):0;if(frame&&frame.contentWindow)frame.contentWindow.postMessage({source:'latchlings-game',type:'home-state',stars:total,stage,replay:!!replay,motion:uiPrefs.motion,textSize:uiPrefs.textSize},location.origin)}
const ATLAS_WAYPOINTS=[
 ['Morning Path','Meadow Detour','Open Fields','Routeworks','Sunset Return'],
 ['Lantern Edge','Shared Paths','Deep Grove','After Dark','Home Together'],
 ['Cavern Mouth','Anchor Hall','Crystal Turn','Deep Pressure','Holding Fast'],
 ['Outer Gate','Market Lane','Crowd Square','Last Bell','Market Saved'],
 ['Glass Walk','Refracted','Far Garden','New Coordinates','Across Drift'],
 ['Platform One','Bendworks','Map Room','Old Line','A New Line'],
 ['Foundry Gate','Switchbank','Relay Row','Shared Signal','Networked'],
 ['Crown Edge','Aurora Span','Reconnected','Living Route','Homeward']
 ];
const ATLAS_CHAPTER_BLURBS=[
 {full:"Morning routes drift out of line, and Little Home realizes the misses form a pattern.",compact:"Morning routes have drifted out of line."},
 {full:"Lanternwood reconnects when neighbors become part of one another’s routes.",compact:"Neighbors become part of one another’s routes."},
 {full:"Old anchors reveal the Skyway was built for reliable stops in a moving world.",compact:"Anchors make moving routes reliable."},
 {full:"Suit-mark lanes keep Masquerade Keep’s busy market moving through the drift.",compact:"Suit marks guide the market through the drift."},
 {full:"From Prism Gardens, the household finally sees how far the Latchlands are drifting.",compact:"The wider Latchlands drift comes into view."},
 {full:"Copperline’s old maps reveal the Skyway was always designed to keep changing.",compact:"The Skyway was always meant to change."},
 {full:"Stormswitch turns restoration into shared work, with distant routes responding together.",compact:"Restoration becomes a shared network effort."},
 {full:"Aurora Crown reveals there is no fixed master route; the Skyway survives by changing.",compact:"The Skyway lives by changing with the islands."}
];
const ATLAS_TRAVEL_LINES=[
 ["A fresh line of light stitches the meadow route back together.","The next island drifts into reach as the morning path brightens.","Another ordinary errand has a dependable way home."],
 ["Lanterns answer one another as the next shared path opens.","A neighbor-held stop turns into a route everyone can use.","Warm lights gather along the newly connected grove."],
 ["The anchor line hums, catches, and gives the drifting route a dependable stop.","Crystal light runs ahead through the cavern markers.","Another old Waykeeper stop wakes beneath the stone."],
 ["A suit-mark lane clicks into place and the market flow opens ahead.","Gold route inlays brighten beneath the next busy crossing.","Another market lane remembers how to carry a crowd."],
 ["Prism light bends across the gap and finds the next island.","The living route redraws itself in color instead of clinging to yesterday's map.","A new coordinate glows where the old route used to end."],
 ["Copper route lines tick forward and settle into a brand-new useful path.","A turner answers down the line and the next platform wakes.","The old maps make room for one more correct route."],
 ["A relay flashes, another answers, and the Foundry sends the route onward.","The next switchbank lights because someone else kept their part of the network moving.","Storm-blue current races ahead through the shared line."],
 ["Aurora light gathers around a route that did not exist yesterday.","The living Skyway shifts with the islands and opens the next way home.","Another drifting island returns to the same shared map."],
];
const ATLAS_ROUTE_PATTERNS=[
 {name:'gentle-arc',points:[[18,84],[27,73],[40,65],[55,61],[69,63],[79,55],[76,43],[64,34],[47,29],[28,21]]},
 {name:'right-hook',points:[[22,84],[40,80],[58,73],[73,64],[82,52],[78,40],[64,34],[49,37],[36,31],[25,21]]},
 {name:'left-hook',points:[[78,84],[61,79],[43,72],[28,62],[18,50],[22,39],[37,34],[52,37],[65,31],[76,21]]},
 {name:'center-climb',points:[[20,84],[36,78],[48,69],[55,58],[47,48],[57,39],[69,32],[80,26],[67,21],[49,24]]},
 {name:'wide-s',points:[[18,84],[38,80],[61,81],[79,73],[75,62],[56,57],[33,59],[19,50],[27,37],[50,21]]},
 {name:'reverse-s',points:[[82,84],[63,80],[40,81],[21,73],[25,62],[44,57],[67,59],[81,50],[73,37],[50,21]]},
 {name:'ridge-run',points:[[17,84],[31,78],[45,72],[61,69],[78,70],[82,58],[67,50],[50,46],[34,36],[21,22]]},
 {name:'shallow-valley',points:[[20,83],[38,78],[55,80],[74,77],[82,67],[69,57],[50,53],[31,57],[18,45],[27,21]]},
 {name:'right-terraces',points:[[18,84],[37,80],[31,68],[52,64],[46,52],[68,48],[62,36],[82,32],[72,22],[52,20]]},
 {name:'left-terraces',points:[[82,84],[63,80],[69,68],[48,64],[54,52],[32,48],[38,36],[18,32],[28,22],[48,20]]},
 {name:'left-orbit',points:[[50,84],[32,80],[20,69],[18,55],[28,44],[44,40],[61,44],[76,38],[79,27],[65,20]]},
 {name:'right-orbit',points:[[50,84],[68,80],[80,69],[82,55],[72,44],[56,40],[39,44],[24,38],[21,27],[35,20]]},
 {name:'diagonal-left',points:[[80,84],[71,76],[63,68],[54,60],[45,52],[37,44],[29,36],[21,28],[33,24],[49,20]]},
 {name:'diagonal-right',points:[[20,84],[29,76],[37,68],[46,60],[55,52],[63,44],[71,36],[79,28],[67,24],[51,20]]},
 {name:'clustered-hops',points:[[19,84],[37,82],[51,73],[67,76],[81,66],[68,55],[52,58],[35,51],[22,37],[40,21]]},
 {name:'broad-wave',points:[[17,84],[33,77],[56,75],[78,78],[82,65],[66,56],[43,55],[20,59],[24,42],[51,21]]},
 {name:'needle-climb',points:[[18,84],[34,78],[47,70],[58,61],[67,51],[61,42],[51,35],[42,29],[54,24],[72,20]]},
 {name:'crown-arc',points:[[22,84],[38,75],[56,78],[73,69],[80,57],[68,48],[51,50],[35,43],[22,32],[50,20]]},
 {name:'long-switchback',points:[[17,84],[43,80],[76,77],[82,65],[54,61],[22,58],[18,46],[46,41],[77,34],[61,20]]},
 {name:'shallow-spiral',points:[[50,84],[29,79],[18,67],[23,53],[39,47],[57,50],[75,45],[82,34],[70,24],[50,20]]}
];
const ATLAS_ROUTE_PLAN=[
 [0,1,2,3,4],
 [5,6,7,8,9],
 [10,11,12,13,14],
 [15,16,17,18,19],
 [4,8,12,16,0],
 [9,13,17,1,5],
 [14,18,2,6,10],
 [19,3,7,11,15]
];
const ATLAS_CURVE_PROFILES=[
 [-3.2,2.4,-2.6,3.6,-2.2,2.9,-3.4,2.1,-2.8],
 [1.2,1.8,2.7,3.4,2.4,.8,-1.2,-2.2,-2.8],
 [-1.4,-2.5,-3.3,-2.1,.4,2.1,3.5,2.5,1.1],
 [.8,-.6,1.1,-.8,.5,-1.0,.7,-.5,.9],
 [3.8,2.9,1.8,.7,-1.0,-2.0,-3.1,-2.2,-1.1],
 [-3.7,-2.8,-1.7,-.6,1.0,2.1,3.0,2.3,1.2],
 [2.7,-1.0,-2.8,-1.2,2.5,3.1,-.8,-2.6,1.8],
 [-1.8,3.0,1.0,-2.7,-2.0,2.6,1.4,-3.1,.9]
];
function atlasRouteSpec(ch,range){const idx=(ch-1)*5+range,patternIndex=ATLAS_ROUTE_PLAN[ch-1][range],pattern=ATLAS_ROUTE_PATTERNS[patternIndex],mirror=ch>=5,curve=(idx*3+range*2)%ATLAS_CURVE_PROFILES.length,drift=((idx*7)%5)-2,shear=((((idx*11)%7)-3)*.48);return {pattern,mirror,curve,drift,shear,name:`${pattern.name}${mirror?'-mirrored':''}`}}
function atlasLayout(ch,range){const spec=atlasRouteSpec(ch,range);return spec.pattern.points.map(([x,y],i)=>{let px=spec.mirror?100-x:x;px+=spec.drift+spec.shear*((52-y)/32)+(((i+ch+range)%4)-1.5)*.34;const py=y+((((i*3+ch*2+range)%5)-2)*.28);return [Math.max(16,Math.min(84,+px.toFixed(2))),Math.max(19,Math.min(85,+py.toFixed(2)))]})}
function atlasCurve(a,b,i,profile=0){const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.max(1,Math.hypot(dx,dy)),mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,bend=ATLAS_CURVE_PROFILES[profile][i%9],cx=mx+(-dy/len)*bend,cy=my+(dx/len)*bend;return `M ${a[0]} ${a[1]} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${b[0]} ${b[1]}`}
function atlasGuideHtml(chapter){if(!STORY||!STORY.cast?.length)return'';const c=STORY.cast[(chapter-1)%STORY.cast.length],color=c.color||'blue';return `<span class="atlas-guide" aria-hidden="true" style="--guide-light:${LIGHT[color]};--guide-color:${COLORS[color]};--guide-dark:${DARK[color]}"><span class="atlas-guide-suit">${suitSvg(c.suit)}</span><span class="atlas-guide-eyes"><i></i><i></i></span><i class="atlas-guide-mouth"></i></span>`}
function atlasRewardChapter(L){return Math.max(1,Math.min(8,Math.ceil(L/50)))}
function atlasRewardRange(L){return Math.max(0,Math.min(4,Math.floor(((L-1)%50)/10)))}
function clearAtlasRewardTimers(){atlasRewardTimers.forEach(clearTimeout);atlasRewardTimers=[]}
function atlasRewardTimer(fn,ms){const id=setTimeout(fn,ms);atlasRewardTimers.push(id);return id}
function queueAtlasReward(from,to,stars){clearAtlasRewardTimers();atlasRewardState={from,to,stars,phase:'queued',autoAdvance:false,sourceChapter:atlasRewardChapter(from),sourceRange:atlasRewardRange(from),destChapter:atlasRewardChapter(to),destRange:atlasRewardRange(to)};return atlasRewardState}
function cancelAtlasReward(){clearAtlasRewardTimers();atlasRewardState=null;const levels=document.getElementById('levels');if(levels)levels.classList.remove('atlas-reward-mode','atlas-music-hold')}
function atlasRewardCopy(r){if(r.destChapter!==r.sourceChapter)return {kicker:'Region restored',text:`${CHAPTERS[r.sourceChapter-1].theme} settles into the living map. ${CHAPTERS[r.destChapter-1].theme} glimmers into reach.`};if(r.destRange!==r.sourceRange)return {kicker:'Waypoint restored',text:`${ATLAS_WAYPOINTS[r.sourceChapter-1][r.sourceRange]} is connected. The Skyway bends toward ${ATLAS_WAYPOINTS[r.destChapter-1][r.destRange]}.`};const lines=ATLAS_TRAVEL_LINES[r.sourceChapter-1];return {kicker:'Skyway restored',text:lines[(r.from-1)%lines.length]}}
function atlasRewardBanner(r,arrival=false){const map=document.getElementById('levelGrid');if(!map)return;map.querySelectorAll('.atlas-reward-banner').forEach(x=>x.remove());const copy=atlasRewardCopy(r),el=document.createElement('div');el.className='atlas-reward-banner'+(arrival?' arrival':'');el.innerHTML=`<span>${arrival?(r.destChapter!==r.sourceChapter?'New region':'Next stop'):copy.kicker}</span><b>${arrival?(r.destChapter!==r.sourceChapter?CHAPTERS[r.destChapter-1].theme:ATLAS_WAYPOINTS[r.destChapter-1][r.destRange]):copy.text}</b>`;map.appendChild(el)}
function atlasCurveControl(a,b,i,profile=0){const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.max(1,Math.hypot(dx,dy)),mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,bend=ATLAS_CURVE_PROFILES[profile][i%9];return [mx+(-dy/len)*bend,my+(dx/len)*bend]}
function atlasTraveler(ch,a,b,profile=0,index=0,duration=1100){const map=document.getElementById('levelGrid');if(!map)return null;const token=document.createElement('div');token.className='atlas-travel-token';token.innerHTML=atlasGuideHtml(ch);token.style.left=a[0]+'%';token.style.top=a[1]+'%';map.appendChild(token);const c=atlasCurveControl(a,b,index,profile),anim=token.animate([{left:a[0]+'%',top:a[1]+'%',transform:'translate(-50%,-50%) scale(.86) rotate(-5deg)',offset:0},{left:c[0]+'%',top:c[1]+'%',transform:'translate(-50%,-50%) scale(1.08) rotate(4deg)',offset:.52},{left:b[0]+'%',top:b[1]+'%',transform:'translate(-50%,-50%) scale(.96) rotate(0deg)',offset:1}],{duration,easing:'cubic-bezier(.25,.72,.2,1)',fill:'forwards'});anim.onfinish=()=>token.classList.add('landed');return token}
function atlasRevealDestination(r){const map=document.getElementById('levelGrid'),node=map&&map.querySelector(`.atlas-node[data-level="${r.to}"]`);if(!node)return;node.disabled=false;node.classList.remove('locked','reward-destination');node.classList.add('current','new-current','cloud-clearing');node.setAttribute('aria-label',`Level ${r.to}, current destination`);const route=map.querySelector(`.atlas-route[data-target="${r.to}"]`);if(route)route.classList.add('reward-restoring')}
function finishAtlasReward(r){clearAtlasRewardTimers();const auto=!!r.autoAdvance,to=r.to;atlasRewardState=null;chapterView=r.destChapter;rangeView=r.destRange;renderChapter();const levels=document.getElementById('levels');if(levels){levels.classList.remove('atlas-reward-mode');levels.classList.toggle('atlas-music-hold',auto)}if(auto)atlasRewardTimer(()=>{if(levels)levels.classList.remove('atlas-music-hold');startLevel(to)},260)}
function runAtlasRewardSame(r,reduced=false){const map=document.getElementById('levelGrid'),source=map&&map.querySelector(`.atlas-node[data-level="${r.from}"]`),dest=map&&map.querySelector(`.atlas-node[data-level="${r.to}"]`);if(source)source.classList.add('just-completed');atlasRewardBanner(r,false);if(reduced){atlasRevealDestination(r);atlasRewardTimer(()=>finishAtlasReward(r),420);return}const first=r.sourceChapter*50-49+r.sourceRange*10,points=atlasLayout(r.sourceChapter,r.sourceRange),a=points[r.from-first],b=points[r.to-first],routeIndex=Math.max(0,r.from-first),route=map&&map.querySelector(`.atlas-route[data-target="${r.to}"]`);atlasRewardTimer(()=>{if(route)route.classList.add('reward-restoring')},atlasRewardMs(280));atlasRewardTimer(()=>atlasTraveler(r.sourceChapter,a,b,atlasRouteSpec(r.sourceChapter,r.sourceRange).curve,routeIndex,atlasRewardMs(1180)),atlasRewardMs(430));atlasRewardTimer(()=>atlasRevealDestination(r),atlasRewardMs(900));atlasRewardTimer(()=>{if(dest)dest.classList.add('reward-landed')},atlasRewardMs(1580));atlasRewardTimer(()=>finishAtlasReward(r),atlasRewardMs(2080))}
function runAtlasRewardCross(r,reduced=false){const map=document.getElementById('levelGrid'),source=map&&map.querySelector(`.atlas-node[data-level="${r.from}"]`);if(source)source.classList.add('just-completed','waypoint-complete');atlasRewardBanner(r,false);if(reduced){atlasRewardTimer(()=>{r.phase='destination';chapterView=r.destChapter;rangeView=r.destRange;renderChapter();atlasRewardBanner(r,true)},120);atlasRewardTimer(()=>atlasRevealDestination(r),320);atlasRewardTimer(()=>finishAtlasReward(r),760);return}const sourcePoints=atlasLayout(r.sourceChapter,r.sourceRange),sourceFirst=r.sourceChapter*50-49+r.sourceRange*10,a=sourcePoints[r.from-sourceFirst]||[50,24];atlasRewardTimer(()=>atlasTraveler(r.sourceChapter,a,[50,2],atlasRouteSpec(r.sourceChapter,r.sourceRange).curve,8,atlasRewardMs(720)),atlasRewardMs(220));atlasRewardTimer(()=>{r.phase='destination';chapterView=r.destChapter;rangeView=r.destRange;renderChapter();atlasRewardBanner(r,true)},atlasRewardMs(970));atlasRewardTimer(()=>{const destPoints=atlasLayout(r.destChapter,r.destRange),destFirst=r.destChapter*50-49+r.destRange*10,b=destPoints[r.to-destFirst]||destPoints[0];atlasTraveler(r.destChapter,[50,103],b,atlasRouteSpec(r.destChapter,r.destRange).curve,0,atlasRewardMs(940))},atlasRewardMs(1120));atlasRewardTimer(()=>atlasRevealDestination(r),atlasRewardMs(1750));atlasRewardTimer(()=>finishAtlasReward(r),atlasRewardMs(2920))}
function playQueuedAtlasReward(autoAdvance=false){const levels=document.getElementById('levels');if(levels)levels.classList.remove('atlas-music-hold');if(!atlasRewardState){if(autoAdvance&&currentLevel<400){startLevel(currentLevel+1);return}chapterView=Math.ceil(currentLevel/50);rangeView=Math.floor(((currentLevel-1)%50)/10);screen('levels');renderChapter();return}clearAtlasRewardTimers();const r=atlasRewardState;r.autoAdvance=!!autoAdvance;r.phase='source';chapterView=r.sourceChapter;rangeView=r.sourceRange;screen('levels');renderChapter();const reduced=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches),same=r.sourceChapter===r.destChapter&&r.sourceRange===r.destRange;atlasRewardTimer(()=>same?runAtlasRewardSame(r,reduced):runAtlasRewardCross(r,reduced),90)}
function renderChapter(){
 chapterView=Math.max(1,Math.min(8,chapterView));rangeView=Math.max(0,Math.min(4,rangeView));applyTheme(chapterView);
 const reward=atlasRewardState,rewardSourceView=!!(reward&&reward.phase==='source'&&chapterView===reward.sourceChapter&&rangeView===reward.sourceRange),rewardDestView=!!(reward&&reward.phase==='destination'&&chapterView===reward.destChapter&&rangeView===reward.destRange),visualUnlocked=rewardSourceView?reward.from:progress.unlocked;const levelsScreen=document.getElementById('levels');if(levelsScreen)levelsScreen.classList.toggle('atlas-reward-mode',rewardSourceView||rewardDestView);
 const ch=CHAPTERS[chapterView-1],atlasBlurb=ATLAS_CHAPTER_BLURBS[chapterView-1],chapterStart=(chapterView-1)*50+1,chapterEnd=chapterView*50,chapterDone=Array.from({length:50},(_,i)=>progress.stars[chapterStart+i]>0).filter(Boolean).length,waypoints=ATLAS_WAYPOINTS[chapterView-1],routeSpec=atlasRouteSpec(chapterView,rangeView),points=atlasLayout(chapterView,rangeView);
 const atlasNarrative=STORY&&STORY.chapterAtlasLine?STORY.chapterAtlasLine(chapterView,progress):null,atlasObjectiveHtml=atlasNarrative?`<p class="atlas-chapter-objective"><span>${atlasNarrative.label}</span>${atlasNarrative.text}</p>`:'';const head=document.getElementById('chapterHead');head.innerHTML=`<div class="atlas-chapter-medallion" aria-hidden="true">${chapterView}</div><div class="atlas-chapter-copy"><div class="theme-kicker">${ch.theme}</div><h2>${ch.name}</h2><p class="atlas-chapter-blurb"><span class="atlas-blurb-full">${atlasBlurb.full}</span><span class="atlas-blurb-compact">${atlasBlurb.compact}</span></p>${atlasObjectiveHtml}</div><div class="atlas-chapter-progress"><b>${chapterDone}</b>/ 50<br>restored</div>`;
 const nav=document.getElementById('chapterNav');nav.innerHTML=`<button class="atlas-chapter-arrow" data-step="-1" aria-label="Previous chapter" ${chapterView===1?'disabled':''}>‹</button><div class="atlas-region-dots">${CHAPTERS.map((c,i)=>`<button class="atlas-region-dot ${i+1===chapterView?'active':''}" data-ch="${i+1}" aria-label="Chapter ${i+1}: ${c.theme}" title="${c.theme}"></button>`).join('')}</div><button class="atlas-chapter-arrow" data-step="1" aria-label="Next chapter" ${chapterView===8?'disabled':''}>›</button>`;
 nav.querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>{chapterView=+b.dataset.ch;const local=progress.unlocked-(chapterView-1)*50;rangeView=local>0?Math.min(4,Math.floor((local-1)/10)):0;renderChapter()});
 nav.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{chapterView=Math.max(1,Math.min(8,chapterView+(+b.dataset.step)));const local=progress.unlocked-(chapterView-1)*50;rangeView=local>0?Math.min(4,Math.floor((local-1)/10)):0;renderChapter()});
 const range=document.getElementById('rangeNav');range.innerHTML=Array.from({length:5},(_,i)=>{const rs=chapterStart+i*10,re=rs+9,future=rs>progress.unlocked;return `<button class="atlas-waypoint-tab ${i===rangeView?'active':''} ${future?'future':''}" data-range="${i}" aria-label="${waypoints[i]}, levels ${rs} through ${re}"><span>${rs}–${re}</span><b>${waypoints[i]}</b></button>`}).join('');range.querySelectorAll('[data-range]').forEach(b=>b.onclick=()=>{rangeView=+b.dataset.range;renderChapter()});
 const first=chapterStart+rangeView*10,sameRewardView=rewardSourceView&&reward.to>=first&&reward.to<=first+9,route=points.slice(0,-1).map((a,i)=>{const b=points[i+1],target=first+i+1,rewardTarget=sameRewardView&&target===reward.to,state=rewardTarget?'future':target<visualUnlocked?'restored':target===visualUnlocked?'active':'future',d=atlasCurve(a,b,i,routeSpec.curve);return `<path class="atlas-route-shadow" data-target="${target}" d="${d}"/><path class="atlas-route ${state}" data-target="${target}" d="${d}"/>`}).join('');
 const nodes=Array.from({length:10},(_,j)=>{const L=first+j,stars=progress.stars[L]||0,hiddenArrival=!!((sameRewardView||rewardDestView)&&reward&&L===reward.to),rewardSource=!!(rewardSourceView&&reward&&L===reward.from),locked=hiddenArrival||L>visualUnlocked,done=stars>0,current=rewardSource||(!hiddenArrival&&L===visualUnlocked),milestone=j===9,p=points[j],variant=(rangeView+j)%5,pennant=current?`<span class="atlas-pennant">${rewardSource?'Route restored':done?'Latest stop':'Next stop'}</span>`:'';return `<button class="level-node atlas-node ${locked?'locked':''} ${done?'done':''} ${current?'current':''} ${milestone?'milestone':''} ${rewardSource?'reward-source':''} ${hiddenArrival?'reward-destination':''}" style="--x:${p[0]}%;--y:${p[1]}%;--float-time:${(4.1+(j%4)*.43).toFixed(2)}s;--float-delay:-${(j*.37).toFixed(2)}s" data-level="${L}" data-variant="${variant}" aria-label="Level ${L}${locked?', locked':current?', current destination':done?`, completed with ${stars} star${stars===1?'':'s'}`:', available'}" ${locked?'disabled':''}><span class="atlas-island" aria-hidden="true"><span class="atlas-island-side"></span><span class="atlas-island-top"></span><span class="atlas-prop" data-variant="${variant}"><i></i><b></b></span></span><span class="atlas-level-number">${L}</span><span class="atlas-stars" aria-hidden="true">${[1,2,3].map(n=>`<i class="${n<=stars?'on':''}"></i>`).join('')}</span><span class="atlas-cloud-cover" aria-hidden="true"></span>${pennant}</button>`}).join('');
 const map=document.getElementById('levelGrid');map.className=`atlas-map atlas-range-${rangeView+1} ${(rewardSourceView||rewardDestView)?'atlas-reward-playing':''}`;map.dataset.routeShape=routeSpec.name;map.dataset.curveProfile=routeSpec.curve;map.setAttribute('aria-label',`${ch.theme}, ${waypoints[rangeView]}, levels ${first} through ${first+9}`);map.innerHTML=`<div class="atlas-scene" aria-hidden="true"><i></i><b></b><em></em></div><div class="atlas-route-caption"><b>${waypoints[rangeView]}</b><span>Levels ${first}–${first+9} · Skyway stretch ${rangeView+1} of 5</span></div><svg class="atlas-route-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${route}</svg>${nodes}`;
 map.querySelectorAll('.atlas-node:not(.locked)').forEach(b=>b.onclick=()=>startLevel(+b.dataset.level));
 const continueBtn=document.getElementById('continueBtn');if(continueBtn)continueBtn.innerHTML=`<span>${progress.stars[progress.unlocked]?'Return to latest stop':'Continue journey'}</span><b>Level ${progress.unlocked}</b>`;
}
function startLevel(L,mode='campaign'){
 playMode=mode==='daily'?'daily':'campaign';document.body.dataset.playMode=playMode;
 currentLevel=Math.max(1,Math.min(400,L));const lev=LEVELS[currentLevel-1];if(!lev){showError('Missing level '+currentLevel);return}
 if(playMode==='daily'&&!dailySession)dailySession={...dailyRouteInfo(),level:currentLevel};
 chapterView=Math.ceil(currentLevel/50);rangeView=Math.floor(((currentLevel-1)%50)/10);applyTheme(chapterView);positions=lev.pieces.map(p=>p.pos.slice());doorMask=0;movesUsed=0;selected=0;hintStep=0;animating=false;
 if(playMode==='daily'&&window.LatchlingsStoryTheme?.close)window.LatchlingsStoryTheme.close(false);
 screen('game');renderGame(true);
 if(playMode==='daily')return;
 const enterStory=()=>{if(window.LatchlingsStoryTheme)window.LatchlingsStoryTheme.enterLevel(currentLevel)},enterCinematicOrStory=()=>{if(window.LatchlingsCinematics&&window.LatchlingsCinematics.maybeShowBeforeLevel(currentLevel,progress.unlocked,enterStory))return;enterStory()};if(activeScreenTransition&&activeScreenTransition.finished)activeScreenTransition.finished.then(enterCinematicOrStory).catch(enterCinematicOrStory);else enterCinematicOrStory()
}
function boardRangeForLevel(L){return Math.floor(((L-1)%50)/10)+1}
function renderGame(full=false){
 const lev=LEVELS[currentLevel-1],chapter=Math.ceil(currentLevel/50),boardRange=boardRangeForLevel(currentLevel);applyTheme(chapter);const campaign=playMode==='campaign',storyMeta=campaign&&STORY?STORY.levelMeta(currentLevel):null;
 const board=document.getElementById('board');board.dataset.level=String(currentLevel);document.getElementById('levelTitle').textContent=campaign?'Level '+currentLevel:'Daily Route';document.getElementById('movesLeft').textContent=Math.max(0,lev.moveLimit-movesUsed);
 const storyBtn=document.getElementById('storyCardBtn');if(storyBtn){storyBtn.hidden=!campaign;storyBtn.setAttribute('aria-hidden',campaign?'false':'true')}
 const note=document.getElementById('mechanicNote');note.className='mechanic-note mechanic-chip';note.innerHTML=`<span class="mechanic-chip-label">Route tip</span><span class="mechanic-chip-copy">${chapterNote(currentLevel)}</span>`;
 const props=document.getElementById('levelProps');if(campaign&&window.LatchlingsStoryTheme)window.LatchlingsStoryTheme.decorateLevel(currentLevel,storyMeta);else if(props){props.innerHTML='';props.hidden=true;props.setAttribute('aria-hidden','true')}
 board.style.setProperty('--n',lev.size);board.dataset.boardRange=String(boardRange);board.dataset.boardStyle=`ch${chapter}-r${boardRange}`;if(full){board.querySelectorAll('.cell').forEach(x=>x.remove());for(let r=0;r<lev.size;r++)for(let c=0;c<lev.size;c++){const cell=document.createElement('div');cell.className='cell';cell.dataset.r=r;cell.dataset.c=c;cell.dataset.tileVariant=String((r*3+c*5+currentLevel+boardRange)%4);board.insertBefore(cell,document.getElementById('pieceLayer'));decorateCell(cell,lev,r,c)}}renderPieces(lev)
}
function chapterNote(L){const k=(L-1)%50+1,ch=Math.ceil(L/50),c=CHAPTERS[ch-1];if(k<=2)return (c.mechanic?c.mechanic+'. ':'')+c.tip;if(ch===1&&k<=5)return 'A snap continues until something stops it. Use the board edge and rocks to line up the nest.';if(ch===2&&k<=5)return 'Other Latchlings are movable walls. Park one where another needs to stop.';if(ch===3&&k<=5)return 'Anchors create exact stopping points without needing a wall behind them.';if(ch===4&&k<=5)return 'Read the black suit mark before committing to a gate route.';if(ch===5&&k<=5)return 'Body color and suit are separate clues now. Check both before you snap.';if(ch===6&&k<=5)return 'Rails restrict entry; turners bend one continuous snap without spending another move.';if(ch===7&&k<=5)return 'Switch order matters. Open the route you need before committing a Latchling to it.';if(ch===8&&k<=5)return 'Everything is live. Read the whole circuit before your first move.';if(k>=46)return 'Expert board: expect setup moves, temporary blockers, and routes that only make sense several snaps ahead.';return c.tip}
function findAt(arr,r,c){return (arr||[]).find(x=>x[0]===r&&x[1]===c)}
function decorateCell(cell,lev,r,c){const rock=findAt(lev.rocks,r,c);if(rock){cell.innerHTML='<div class="rock"></div>';return}const nestI=lev.nests.findIndex(n=>n[0]===r&&n[1]===c);if(nestI>=0){const p=lev.pieces[nestI];cell.innerHTML=`<div class="nest" style="--piece-color:${COLORS[p.color]}">${suitSvg(p.suit)}</div>`;return}if(findAt(lev.anchors,r,c))cell.innerHTML+='<div class="anchor">'+icon('anchor')+'</div>';const sg=findAt(lev.suitGates,r,c);if(sg)cell.innerHTML+=`<div class="gate suit">${suitSvg(sg[2])}</div>`;const cg=findAt(lev.colorGates,r,c);if(cg)cell.innerHTML+=`<div class="gate color" style="--gate-color:${gateColor(cg[2])}"><span style="width:42%;height:42%;border-radius:50%;background:${gateColor(cg[2])};box-shadow:inset 0 0 0 4px rgba(255,255,255,.55)"></span></div>`;const rail=findAt(lev.rails,r,c);if(rail)cell.innerHTML+=`<div class="rail">${dirSvg(rail[2])}</div>`;const turn=findAt(lev.turners,r,c);if(turn)cell.innerHTML+=`<div class="turner">${turnSvg(turn[2])}</div>`;const sw=findAt(lev.switches,r,c);if(sw)cell.innerHTML+='<div class="switch-tile"></div>';const dr=findAt(lev.doors,r,c);if(dr)cell.innerHTML+=`<div class="door-tile ${(doorMask&(1<<dr[2]))?'open':''}"><div class="door-bars"></div></div>`}
function dirSvg(d){const rot={U:0,R:90,D:180,L:270}[d];return `<svg viewBox="0 0 24 24" style="transform:rotate(${rot}deg)"><path d="M12 19V5M6 11l6-6 6 6"/></svg>`}function turnSvg(t){return `<svg viewBox="0 0 24 24" ${t==='CCW'?'style="transform:scaleX(-1)"':''}><path d="M5 17h6a7 7 0 0 0 7-7V6"/><path d="m14 9 4-4 4 4"/></svg>`}
function renderPieces(lev){const layer=document.getElementById('pieceLayer');layer.innerHTML='';positions.forEach((pos,i)=>{if(!pos)return;const p=lev.pieces[i],el=document.createElement('button');el.className=`latchling expr-${expressionFor(currentLevel,i,p)} ${i===selected?'selected':''}`;el.dataset.pi=i;el.style.setProperty('--n',lev.size);el.style.setProperty('--piece-color',COLORS[p.color]);el.style.setProperty('--light',LIGHT[p.color]);el.style.setProperty('--dark',DARK[p.color]);const blinkDuration=(3.35+((currentLevel*17+i*29)%37)/10).toFixed(2)+'s',blinkDelay=(-((currentLevel*23+i*41)%59)/10).toFixed(2)+'s';el.style.setProperty('--blink-duration',blinkDuration);el.style.setProperty('--blink-delay',blinkDelay);el.style.setProperty('--idle-delay',(-((currentLevel*11+i*7)%23)/10).toFixed(2)+'s');placePiece(el,pos[0],pos[1],lev.size,false);el.innerHTML=`<span class="suit-mark">${suitSvg(p.suit)}</span><span class="face"><span class="eyes"><i class="eye"></i><i class="eye"></i></span><i class="mouth"></i></span>`;el.onclick=()=>{if(animating||selected===i)return;selected=i;renderPieces(lev);if(window.LatchlingsSFX)window.LatchlingsSFX.selectLatchling()};layer.appendChild(el)})}
