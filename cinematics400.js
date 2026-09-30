'use strict';
(function(){
const SEEN_KEY='latchlings_cinematics_seen_v1';
const TRIGGERS={1:'opening',251:'across-drift',301:'old-maps',351:'homeward'};
const CAST=Object.fromEntries((window.LATCHLINGS_STORY?.cast||[]).map(person=>[person.name,{...person.visual,suit:person.visual?.suit||person.suit}]));
if(!Object.keys(CAST).length)throw new Error('Canonical Latchlings cast identity is unavailable');
const MAP_YEARS=Object.freeze([
 {year:12,landmarks:{home:{x:.14,y:.72},keep:{x:.49,y:.43},crown:{x:.83,y:.2}},edges:[['home','keep'],['keep','crown']]},
 {year:31,landmarks:{home:{x:.2,y:.2},keep:{x:.76,y:.68},crown:{x:.48,y:.76}},edges:[['home','keep'],['keep','crown']]},
 {year:58,landmarks:{home:{x:.78,y:.72},keep:{x:.25,y:.55},crown:{x:.63,y:.18}},edges:[['home','keep'],['keep','crown']]}
].map(year=>Object.freeze({year:year.year,landmarks:Object.freeze(Object.fromEntries(Object.entries(year.landmarks).map(([name,point])=>[name,Object.freeze({...point})]))),edges:Object.freeze(year.edges.map(edge=>Object.freeze(edge.slice())))})));
const CINEMATICS={
 opening:{
  title:'The Morning the Routes Missed',chapter:'Before Level 1',finalLabel:'Help Little Home',unlock:1,
  beats:[
   {label:'A Moving World',visual:'opening-continuous',lines:[
    ['Narrator','In the Latchlands, the islands are always drifting—slowly, quietly, and exactly as they should.'],
    ['Narrator','The Skyway moves with them, carrying neighbors, parcels, and all the small things that make a day work.']
   ]},
   {label:'Morning at Little Home',visual:'opening-continuous',lines:[
    ['Narrator','And on a little island called Little Home, every morning began with its own familiar collection of very important jobs.'],
    ['Bramble','Breakfast incoming. Perfectly timed, as usual.'],
    ['Bramble','…That is not our porch.']
   ]},
   {label:'The Same Strange Miss',visual:'opening-continuous',lines:[
    ['Pippa','My watering line missed the garden too.'],
    ['Pip','Our shortcut missed the play rock.'],
    ['Tansy','A shortcut is supposed to reach something, Pip.'],
    ['Pip','It did yesterday.'],
    ['Rowan','Little Home drifted exactly as expected. But three different routes missed us by nearly the same distance.'],
    ['Narrator','One missed errand might have been bad luck. Three matching misses were a question.']
   ]},
   {label:'The Old Call',visual:'opening-continuous',lines:[
    ['Pippa','We know our island. We know our routes. But something larger isn’t adding up.'],
    ['Pippa','Let’s send the old Waykeeper call.'],
    ['Narrator','Waykeepers once helped the Skyway adapt whenever familiar paths stopped fitting the world around them.'],
    ['Narrator','Little Home sent the call…'],
    ['Narrator','…and you answered.']
   ]},
   {label:'See the Route',visual:'opening-continuous',lines:[
    ['Bramble','We’ll bring what we know. Our neighbors will bring what they know. You help us see how all the pieces fit together.'],
    ['Narrator','To a Waykeeper, every real route becomes a puzzle of paths, people, and stopping places.'],
    ['Rowan','Start with Sunpetal’s morning routes. Find out why they’re all missing in the same way.'],
    ['Pippa','And perhaps begin with breakfast.'],
    ['Pip','Finally, a properly organized investigation.']
   ]}
  ]
 },
 'across-drift':{
  title:'Across the Drift',chapter:'After Level 250',finalLabel:'Continue to Copperline',unlock:251,
  beats:[
   {label:'The View From Prism Gardens',visual:'prism-view',lines:[['Narrator','From Prism Gardens, the horizon opens. For the first time, several distant routes can be watched at once.']]},
   {label:'A Familiar Porch',visual:'porch',lines:[['Tansy','I can still see their porch.'],['Pip','That sounded less reassuring than you meant it to.'],['Tansy','The old route no longer reaches it. I would like the new one to.']]},
   {label:'Not One Bad Route',visual:'network-miss',lines:[['Rowan','Watch the endpoints. The islands keep drifting while the old lines stay put.'],['Narrator','This is not one bad route. The network is falling behind the world it serves.']]},
   {label:'Yesterday’s Map',visual:'map-mismatch',lines:[['Pippa','Line up this old marker and another island falls out of place.'],['Rowan','Then yesterday’s map cannot be the answer.']]},
   {label:'New Coordinates',visual:'porch-reconnect',lines:[['Bramble','Good. I was getting tired of chasing yesterday.'],['Narrator','The familiar porch is our destination. A fresh route needs to reach it where it is now, not where yesterday’s map left it.']]}
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
const OPENING_FIRST_RUN_STEPS=CINEMATICS.opening.beats.flatMap((beat,beatIndex)=>beat.lines.map((_,lineIndex)=>[beatIndex,lineIndex]));
let activeId=null,activeIndex=0,activeLine=0,activeFlow=null,activeStep=0,onDone=null,markOnDone=false,lastFocus=null;
let porchGeometryObserver=null,porchGeometryScene=null,porchGeometryResize=null,porchGeometryFrame=0;
function disconnectPorchGeometry(){if(porchGeometryObserver){porchGeometryObserver.disconnect();porchGeometryObserver=null}if(porchGeometryResize){window.removeEventListener('resize',porchGeometryResize);porchGeometryResize=null}if(porchGeometryFrame){cancelAnimationFrame(porchGeometryFrame);porchGeometryFrame=0}porchGeometryScene=null}
let networkGeometryObserver=null,networkGeometryScene=null,networkGeometryResize=null,networkGeometryFrame=0,networkPhaseTimer=0,networkGeometryHomeFrame=null;
function reducedMotionRequested(){return document.documentElement.dataset.motion==='reduced'||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true}
function disconnectNetworkScene(){if(networkGeometryObserver){networkGeometryObserver.disconnect();networkGeometryObserver=null}if(networkGeometryResize){window.removeEventListener('resize',networkGeometryResize);networkGeometryHomeFrame?.removeEventListener('load',networkGeometryResize);networkGeometryResize=null}networkGeometryHomeFrame=null;if(networkGeometryFrame){cancelAnimationFrame(networkGeometryFrame);networkGeometryFrame=0}if(networkPhaseTimer){clearTimeout(networkPhaseTimer);networkPhaseTimer=0}networkGeometryScene=null}
function syncNetworkGeometry(scene){
 const frame=scene?.closest('.cin-homeward-wrap')?.querySelector('.cin-home-reference'),home=frame?.contentDocument?.querySelector('#c2 .scene');
 if(home){const fit=Math.min(.76,Math.max(.1,(frame.clientWidth-12)/350),Math.max(.1,(frame.clientHeight-12)/350));home.style.setProperty('transform',`translate(-50%,-50%) scale(${fit})`,'important')}
 const svg=scene?.querySelector('.cin-network-routes');if(!svg||!window.LatchlingsSceneGeometry?.syncPath)return false;
 let ready=true;
 for(const path of svg.querySelectorAll('path[data-from][data-to]')){
  const from=scene.querySelector(`[data-network-anchor="${path.dataset.from}"]`),to=scene.querySelector(`[data-network-anchor="${path.dataset.to}"]`);
  if(!window.LatchlingsSceneGeometry.syncPath(svg,path,from,to)){path.removeAttribute('d');ready=false}
 }
 const courier=scene.querySelector('.action-courier'),route=scene.querySelector('.courier-route');
 if(ready&&courier&&route){
  const elapsed=Math.max(0,performance.now()-Number(scene.dataset.travelStarted||0));
  const progress=reducedMotionRequested()?1:Math.min(1,elapsed/1800);
  const point=route.getPointAtLength(route.getTotalLength()*progress),screen=new DOMPoint(point.x,point.y).matrixTransform(route.getScreenCTM()),box=scene.getBoundingClientRect();
  const sx=box.width/scene.offsetWidth,sy=box.height/scene.offsetHeight;
  courier.style.left=(screen.x-box.left)/sx+'px';courier.style.top=(screen.y-box.top)/sy+'px';
  scene.dataset.travelProgress=String(progress);scene.dataset.landed=progress===1?'true':'false';
 }
 scene.dataset.geometryReady=ready?'true':'false';return ready;
}
function bindNetworkScene(scene,visual){
 disconnectNetworkScene();if(!scene)return;
 networkGeometryScene=scene;
 if(scene.querySelector('.action-courier'))scene.dataset.travelStarted=String(performance.now());
 const sync=()=>{if(networkGeometryScene===scene&&scene.isConnected)syncNetworkGeometry(scene)};
 sync();networkGeometryResize=sync;window.addEventListener('resize',networkGeometryResize,{passive:true});
 networkGeometryHomeFrame=scene.closest('.cin-homeward-wrap')?.querySelector('.cin-home-reference')||null;
 networkGeometryHomeFrame?.addEventListener('load',sync);
 if(typeof ResizeObserver==='function'){networkGeometryObserver=new ResizeObserver(sync);networkGeometryObserver.observe(scene);scene.querySelectorAll('[data-network-anchor]').forEach(anchor=>networkGeometryObserver.observe(anchor))}
 if(!reducedMotionRequested()){
  const tick=()=>{if(networkGeometryScene!==scene||!scene.isConnected){disconnectNetworkScene();return}syncNetworkGeometry(scene);networkGeometryFrame=requestAnimationFrame(tick)};
  networkGeometryFrame=requestAnimationFrame(tick);
 }
 if(visual==='living-network'){
  if(reducedMotionRequested()){scene.dataset.networkPhase='complete';return}
  const phases=['anchor','window','redraw','complete'];let phaseIndex=0;scene.dataset.networkPhase='report';
  const advance=()=>{if(networkGeometryScene!==scene||!scene.isConnected)return;scene.dataset.networkPhase=phases[phaseIndex++];if(phaseIndex<phases.length)networkPhaseTimer=setTimeout(advance,1200);else networkPhaseTimer=0};
  networkPhaseTimer=setTimeout(advance,1200);
 }
}
function syncPorchGeometry(scene){
 const island=scene.querySelector('.porch-far-island'),svg=scene.querySelector('.porch-reconnect-svg'),path=svg?.querySelector('.porch-reconnect-route'),origin=scene.querySelector('[data-route-origin]'),landing=scene.querySelector('[data-route-landing]'),pulse=scene.querySelector('[data-route-pulse]');
 if(!island||!svg||!path||!origin||!landing||!pulse)return false;
 const sceneRect=scene.getBoundingClientRect(),islandRect=island.getBoundingClientRect();
 if(sceneRect.width<=0||sceneRect.height<=0||islandRect.width<=0||islandRect.height<=0)return false;
 const parentScaleX=island.offsetWidth?islandRect.width/island.offsetWidth:1,parentScaleY=island.offsetHeight?islandRect.height/island.offsetHeight:1;
 if(parentScaleX<=0||parentScaleY<=0)return false;
 svg.style.left=`${(sceneRect.left-islandRect.left)/parentScaleX}px`;svg.style.top=`${(sceneRect.top-islandRect.top)/parentScaleY}px`;
 svg.style.width=`${scene.clientWidth/parentScaleX}px`;svg.style.height=`${scene.clientHeight/parentScaleY}px`;
 const ready=!!window.LatchlingsSceneGeometry?.syncPath(svg,path,origin,landing);scene.dataset.geometryAttempted='true';
 if(ready){
  try{
   const length=path.getTotalLength(),end=path.getPointAtLength(length),matrix=path.getScreenCTM(),landingRect=landing.getBoundingClientRect(),sx=landing.clientWidth/landingRect.width,sy=landing.clientHeight/landingRect.height;
   if(!length||!matrix||!landingRect.width||!landingRect.height)throw new Error('Porch landing point is unavailable');
   const screen=new DOMPoint(end.x,end.y).matrixTransform(matrix);
   if(!Number.isFinite(screen.x)||!Number.isFinite(screen.y))throw new Error('Porch landing point is invalid');
   pulse.style.left=`${(screen.x-landingRect.left)*sx-pulse.offsetWidth/2}px`;pulse.style.top=`${(screen.y-landingRect.top)*sy-pulse.offsetHeight/2}px`;pulse.style.translate='none';
   scene.dataset.routeConnected='true';
  }catch(_){scene.removeAttribute('data-route-connected');scene.dataset.geometryReady='false';path.removeAttribute('d');pulse.style.left='50%';pulse.style.top='50%';pulse.style.translate='-50% -50%';return false}
 }else{scene.removeAttribute('data-route-connected');pulse.style.left='50%';pulse.style.top='50%';pulse.style.translate='-50% -50%'}
 scene.dataset.geometryReady=ready?'true':'false';
 return ready;
}
function bindPorchGeometry(scene){
 disconnectPorchGeometry();porchGeometryScene=scene;
 scene.dataset.geometryReady='false';
 const sync=()=>{if(porchGeometryFrame)cancelAnimationFrame(porchGeometryFrame);porchGeometryFrame=requestAnimationFrame(()=>{porchGeometryFrame=0;if(porchGeometryScene===scene&&scene.isConnected)syncPorchGeometry(scene)})};
 sync();
 if(typeof ResizeObserver==='function'){porchGeometryObserver=new ResizeObserver(sync);[scene,scene.querySelector('.porch-far-island'),scene.querySelector('[data-route-origin]'),scene.querySelector('[data-route-landing]')].filter(Boolean).forEach(element=>porchGeometryObserver.observe(element))}
 porchGeometryResize=sync;window.addEventListener('resize',porchGeometryResize,{passive:true});
}
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
function mapNodeIcon(name,x,y){
 const icon=name==='home'?'<path d="M-5 1 0-4 5 1v5H1V3h-2v3h-4z"/><path class="map-icon-detail" d="M-6 1 0-5 6 1"/>':name==='keep'?'<path d="M-6-4h3v3h6v-3h3v10H-6z"/><path class="map-icon-detail" d="M-2 6V2h4v4"/>':'<path d="m-6-3 4 2 2-5 2 5 4-2-2 9H-4z"/><circle class="map-icon-detail" cy="4" r="1"/>';
 return `<g class="map-icon ${name}" transform="translate(${x} ${y})" aria-hidden="true">${icon}</g>`;
}
function mapSheets(mode){
 const r=8;
 const sheets=MAP_YEARS.map((year,index)=>{
  const points=Object.fromEntries(Object.entries(year.landmarks).map(([name,point])=>[name,{x:Number((point.x*100).toFixed(2)),y:Number((point.y*100).toFixed(2))}]));
  const routes=year.edges.map(([from,to],edgeIndex)=>{const a=points[from],b=points[to],bend=edgeIndex===0?-6:6;return `<path class="map-route edge-${edgeIndex+1}" data-from="${from}" data-to="${to}" d="M ${a.x} ${a.y} Q ${Number(((a.x+b.x)/2).toFixed(2))} ${Number(((a.y+b.y)/2+bend).toFixed(2))} ${b.x} ${b.y}"/>`}).join('');
  const landmarks=Object.entries(points).map(([name,point])=>`<g class="map-landmark ${name}"><circle class="map-anchor ${name}" data-landmark="${name}" cx="${point.x}" cy="${point.y}" r="${r}"/><title>${name==='home'?'Little Home':name==='keep'?'Waykeeper Keep':'Aurora Crown'}</title>${mapNodeIcon(name,point.x,point.y)}<text class="map-landmark-name" x="${point.x}" y="${Number((point.y+13).toFixed(2))}" text-anchor="middle">${name.toUpperCase()}</text></g>`).join('');
  const label=`Year ${year.year}: Little Home, Waykeeper Keep, Aurora Crown`;
  return `<div class="cin-map-sheet m${index+1}" data-year="${year.year}"><b class="map-year-label">YEAR ${year.year}</b><svg class="cin-map-art" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${label}"><g class="map-routes">${routes}</g><g class="map-landmarks">${landmarks}</g></svg><div class="map-landmark-key" aria-hidden="true"><span class="home">HOME</span><span class="keep">KEEP</span><span class="crown">CROWN</span></div></div>`;
 }).join('');
 const placeKey=['spread','sequence'].includes(mode)?'<div class="map-place-legend" aria-hidden="true"><span class="home">Little Home</span><span class="keep">Waykeeper Keep</span><span class="crown">Aurora Crown</span></div>':'';
 return `<div class="cin-maps ${mode}" data-map-mode="${mode}">${sheets}${placeKey}</div>`;
}
const NETWORK_NODES=Object.freeze([
 {id:'meadows',label:'MEADOWS',type:'meadow',className:'n1'},
 {id:'lantern',label:'LANTERNWOOD',type:'lantern',className:'n2'},
 {id:'lodestone',label:'LODESTONE',type:'lodestone',className:'n3'},
 {id:'keep',label:'WAYKEEPER KEEP',type:'keep',className:'n4'},
 {id:'prism',label:'PRISM GARDENS',type:'prism',className:'n5'},
 {id:'copperline',label:'COPPERLINE',type:'copper',className:'n6'},
 {id:'stormswitch',label:'STORMSWITCH',type:'storm',className:'n7'},
 {id:'crown',label:'AURORA CROWN',type:'crown',className:'n8'}
].map(node=>Object.freeze(node)));
const NETWORK_EDGES=Object.freeze([
 {from:'stormswitch',to:'meadows',role:'report'},
 {from:'meadows',to:'lodestone',role:'anchor'},
 {from:'lodestone',to:'lantern',role:'window'},
 {from:'meadows',to:'lantern',role:'redraw'},
 {from:'lantern',to:'keep'},
 {from:'lodestone',to:'prism'},
 {from:'prism',to:'copperline'},
 {from:'copperline',to:'crown'}
].map(edge=>Object.freeze(edge)));
function networkNode(node){const label=node.id==='copperline'?'COPPER<wbr>LINE':node.label;return `<div class="node ${node.className} type-${node.type}" data-network-node="${node.id}"><i class="node-side"></i><i class="node-rim"></i><i class="node-top"></i><i class="node-landmark"></i><span>${label}</span><i class="node-route-anchor" data-network-anchor="${node.id}" aria-hidden="true"></i></div>`}
function networkEdge(edge,index){const role=edge.role?` role-${edge.role}`:'';return `<path class="network-route${role}" pathLength="1" data-from="${edge.from}" data-to="${edge.to}" ${edge.role?`data-edge-role="${edge.role}"`:''} ${edge.choice?`data-route-choice="${edge.choice}" data-bend="${edge.bend}"`:''} d=""/>`}
function networkCausality(){return `<div class="network-causality" aria-label="How the living route responds"><span data-causality-step="report" data-from="stormswitch" data-to="meadows"><b>1</b><strong>STORMSWITCH → MEADOWS</strong><small>DRIFT REPORT</small></span><span data-causality-step="anchor" data-from="meadows" data-to="lodestone"><b>2</b><strong>LODESTONE</strong><small>ANCHOR ADJUSTED</small></span><span data-causality-step="window" data-from="lodestone" data-to="lantern"><b>3</b><strong>LANTERNWOOD</strong><small>TRAVEL WINDOW</small></span><span data-causality-step="redraw" data-from="meadows" data-to="lantern"><b>4</b><strong>MEADOWS → LANTERNWOOD</strong><small>ROUTE REDRAWN</small></span></div>`}
function networkHtml(mode=''){
 const edges=mode==='many'?[{from:'stormswitch',to:'crown',choice:'high-tide',bend:86},{from:'stormswitch',to:'crown',choice:'low-tide',bend:-86}]:NETWORK_EDGES;
 const phase=mode==='living'?' data-network-phase="report"':'';
 return `<div class="cin-network ${mode}"${phase}>${NETWORK_NODES.map(networkNode).join('')}<svg class="cin-network-routes" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">${edges.map(networkEdge).join('')}</svg>${mode==='living'?networkCausality():''}</div>`;
}
function familiarPorchIslandHtml(withRoute=false){return `<div class="porch-far-island"><i class="porch-island-side"></i><i class="porch-island-top"></i>${withRoute?'<svg class="porch-reconnect-svg" viewBox="0 0 1000 760" preserveAspectRatio="none" aria-hidden="true"><path class="porch-reconnect-route" pathLength="1" d=""></path></svg>':''}<i class="porch-tree"></i><i class="porch-house"></i><i class="porch-deck">${withRoute?'<span class="porch-route-landing" data-route-landing><span class="porch-route-pulse" data-route-pulse></span></span>':''}</i><i class="porch-friend-lantern l1"></i><i class="porch-friend-lantern l2"></i></div>`}
function lookoutHtml(){return `<div class="cin-lookout-scene cin-porch-production"><i class="porch-cloud c1"></i><i class="porch-cloud c2"></i>${familiarPorchIslandHtml()}<div class="porch-near-island"><i class="porch-crystal k1"></i><i class="porch-crystal k2"></i></div><div class="cin-telescope production-telescope"><i class="tube"></i><i class="lens"></i><span class="cin-telescope-mount"><b></b><b></b><b></b></span></div>${character('Tansy','lookout-tansy')}${character('Pip','lookout-pip')}<i class="cin-sightline"></i><i class="porch-depth-haze"></i></div>`}
function breakfastJourneyHtml(){return `<div class="cin-breakfast-journey" data-story-action="breakfast-basket-travel">${islandsHtml('wide basket-journey')}<i class="breakfast-journey-route"></i><span class="breakfast-basket-traveler"><i class="basket-handle"></i><i class="basket-body"></i></span><span class="breakfast-home-destination"><i class="home-roof"></i><i class="home-body"></i><i class="home-door"></i><i class="home-lantern"></i></span></div>`}
function porchReconnectHtml(){return `<div class="cin-lookout-scene cin-porch-production cin-porch-reconnect" data-story-action="route-reaches-familiar-porch"><i class="porch-cloud c1"></i><i class="porch-cloud c2"></i>${familiarPorchIslandHtml(true)}<div class="porch-route-origin" data-route-origin aria-label="New route origin"><i></i></div>${routeDraftingHtml('NEW COORDINATES')}</div>`}
function keepsakeHtml(){return `<div class="cin-community-work"><div class="work-station meadows">${character('Pippa','work-pippa')}<i class="work-prop route-marker"></i><b>CHECK ROUTE</b></div><div class="work-station lodestone">${character('Rowan','work-rowan')}<i class="work-prop anchor-ring"></i><b>ADJUST ANCHOR</b></div><div class="work-station copperline">${character('Bramble','work-bramble')}<i class="work-prop map-roll"></i><b>REDRAW LINE</b></div><span class="work-signal s1"></span><span class="work-signal s2"></span></div>`}
function automationHtml(){return `<div class="cin-automation"><div class="hand-map">${mapSheets('tiny')}</div><div class="machine"><i class="gear g1"></i><i class="gear g2"></i><span class="fixed-line"></span></div><div class="cin-unattended-desk" data-story-action="unattended-desk"><i class="desk-window"></i><i class="desk-surface"></i><i class="desk-note"></i><i class="desk-chair"></i></div></div>`}
function routeDraftingHtml(label='LIVE ROUTE'){return `<div class="cin-route-drafting"><i></i><b>${label}</b></div>`}
function volunteerHtml(){return `<div class="cin-volunteer-scene">${islandsHtml('volunteer-islands')}<i class="volunteer-route-stake"></i>${character('Bramble','volunteer-bramble')}${helper('#4c8ff4','#79aff9','#2e69c8','spade','volunteer-helper h1')}${helper('#f6b737','#ffd06a','#d18c16','diamond','volunteer-helper h2')}${helper('#66bd72','#94dc98','#469852','club','volunteer-helper h3')}<span class="volunteer-line l1"></span><span class="volunteer-line l2"></span><span class="volunteer-line l3"></span></div>`}
// The same named stops recur in the wide view, stale chart, and fresh delivery.
// Routes and the courier use rendered anchors, including during drift/resize.
function actionLandscapeHtml(type){
 const copper=type==='brand-new-route',overlay=type==='map-mismatch',stale=['network-miss','frozen-network'].includes(type);
 const places=copper?[['origin','Copperline','depot'],['home','Little Home','cottage'],['porch','Friend’s Porch','porch']]:[['origin','Prism Gardens','garden'],['home','Little Home','cottage'],['porch','Twin-lit Porch','porch']];
 const island=([id,name,kind],index)=>`<div class="action-island place-${id} kind-${kind}" style="--place-index:${index}"><i class="action-earth"></i><i class="action-grass"></i><i class="action-landmark"></i><i class="action-landing" data-network-anchor="${id}"></i><b>${name}</b></div>`;
 const ghosts=stale||overlay?'<i class="action-old-stop old-home" data-network-anchor="old-home"></i><i class="action-old-stop old-porch" data-network-anchor="old-porch"></i>':'';
 const edge=(from,to,extra='')=>`<path class="network-route ${extra}" data-from="${from}" data-to="${to}" d="" />`;
 const current=edge('origin','home',copper?'courier-route':'current-route')+edge('home','porch','current-route');
 const history=stale||overlay?edge('origin','old-home','historical-route')+edge('old-home','old-porch','historical-route'):'';
 const caption=copper?'NEW LINE · PARCEL REACHES LITTLE HOME':overlay?'ONE MARKER ALIGNS · THE OTHERS MISS':stale?'OLD ROUTES · MOVING DESTINATIONS':'PRISM LOOKOUT · WATCHING THE WIDER DRIFT';
 return `<div class="cin-action-scene action-${type}" data-story-action="${type}">${places.map(island).join('')}${ghosts}<svg class="cin-network-routes" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">${stale?history:current+history}</svg>${copper?'<span class="action-courier" aria-label="Parcel"><i></i></span>':''}${overlay?'<div class="action-chart" aria-label="Historical chart aligned at Prism"><i></i></div>':''}<div class="action-caption">${caption}</div></div>`;
}
function visualHtml(type){
 if(['prism-view','network-miss','map-mismatch','brand-new-route','frozen-network'].includes(type))return actionLandscapeHtml(type);
 if(type==='breakfast-journey')return breakfastJourneyHtml();
 if(type==='porch-reconnect')return porchReconnectHtml();
 if(type==='archipelago')return islandsHtml('wide');
 if(type==='little-home')return homeHtml('little-home');
 if(type==='skyway')return `${islandsHtml('bright')}<div class="cin-route-cargo"><i>✉</i><i>✿</i><i>⌂</i></div>`;
 if(type==='waykeeper')return `${islandsHtml('waykeeper-map')}<div class="cin-compass"><i></i><b>WAYKEEPER</b></div>`;
 if(type==='helper-crew')return volunteerHtml();
 if(type==='snap-demo')return routeDemoHtml();
 if(type==='morning')return `${homeHtml('morning')}<div class="cin-breakfast-route"><span class="old-line"></span><i class="basket"></i><i class="miss">×</i></div>`;
 if(type==='porch')return lookoutHtml();
 if(type==='new-route')return `${islandsHtml('new')}${routeDraftingHtml('NEW COORDINATES')}`;
 if(type==='map-drawer')return `<div class="cin-drawer"><i></i>${mapSheets('stacked')}</div>${character('Bramble','map-bramble')}`;
 if(type==='dated-maps')return mapSheets('spread');
 if(type==='map-sequence')return mapSheets('sequence');
 if(type==='automation')return automationHtml();
 if(type==='signals')return networkHtml('signals');
 if(type==='keepsakes')return keepsakeHtml();
 if(type==='living-network')return networkHtml('living');
 if(type==='many-routes')return networkHtml('many');
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
 const compact=!!activeFlow,lastBeat=compact?activeStep===activeFlow.length-1:activeIndex===c.beats.length-1,lastLine=compact?true:activeLine===b.lines.length-1;
 nextBtn.textContent=lastBeat&&lastLine?c.finalLabel:(lastLine?'Next scene':'Continue');
 if(activeId==='opening'&&window.LatchlingsOpeningScene){
  const step=CINEMATICS.opening.beats.slice(0,activeIndex).reduce((n,beat)=>n+beat.lines.length,0)+activeLine+1;
  window.LatchlingsOpeningScene.sync(document.getElementById('cinematicStage'),step,{character,suitSvg});
  nextBtn.textContent=window.LatchlingsOpeningScene.buttonLabel(step);
  o.dataset.openingStep=String(step);
 }
 const copy=document.querySelector('.cinematic-copy');if(copy)copy.scrollTop=0;
}
function render(){
 const c=CINEMATICS[activeId],b=c&&c.beats[activeIndex];if(!c||!b)return;
 const o=ensureOverlay(),opening=activeId==='opening',displayIndex=opening?activeIndex:(activeFlow?activeStep:activeIndex),displayCount=opening?c.beats.length:(activeFlow?activeFlow.length:c.beats.length);
 o.dataset.cinematic=activeId;o.dataset.visual=b.visual;o.dataset.beat=String(activeIndex);o.dataset.mode=activeFlow?'first-run':'full';
 document.getElementById('cinematicChapter').textContent=c.chapter;
 document.getElementById('cinematicTitle').textContent=c.title;
 document.getElementById('cinematicBeat').textContent=b.label;
 document.getElementById('cinematicCounter').textContent=`${displayIndex+1} / ${displayCount}`;
 disconnectPorchGeometry();disconnectNetworkScene();
 if(opening&&window.LatchlingsOpeningScene)window.LatchlingsOpeningScene.sync(document.getElementById('cinematicStage'),1,{character,suitSvg});
 else{const stage=document.getElementById('cinematicStage');stage.innerHTML=visualHtml(b.visual);if(b.visual==='porch-reconnect')bindPorchGeometry(stage.querySelector('.cin-porch-reconnect'));const measuredScene=stage.querySelector('.cin-network,.cin-action-scene');if(measuredScene)bindNetworkScene(measuredScene,b.visual)}
 document.getElementById('cinematicProgress').innerHTML=Array.from({length:displayCount},(_,i)=>`<i class="${i===displayIndex?'active':i<displayIndex?'done':''}"></i>`).join('');
 renderTurn();
 requestAnimationFrame(()=>o.classList.add('beat-ready'));
}
function show(id,opts={}){const c=CINEMATICS[id];if(!c)return false;if(activeId)return false;const o=ensureOverlay();lastFocus=document.activeElement;activeId=id;activeFlow=id==='opening'&&opts.compact?OPENING_FIRST_RUN_STEPS:null;activeStep=0;if(activeFlow){activeIndex=activeFlow[0][0];activeLine=activeFlow[0][1]}else{activeIndex=0;activeLine=0}onDone=typeof opts.onComplete==='function'?opts.onComplete:null;markOnDone=opts.markSeen!==false;o.classList.remove('beat-ready');o.classList.add('show');o.setAttribute('aria-hidden','false');document.body.classList.add('cinematic-open');render();setTimeout(()=>{const b=document.getElementById('cinematicNext');if(b)try{b.focus({preventScroll:true})}catch(_){b.focus()}const copy=document.querySelector('.cinematic-copy');if(copy)copy.scrollTop=0},50);return true}
function next(){if(!activeId)return;const c=CINEMATICS[activeId],b=c.beats[activeIndex],o=ensureOverlay();if(activeFlow){if(activeStep>=activeFlow.length-1){finish(false);return}o.classList.remove('beat-ready');activeStep++;activeIndex=activeFlow[activeStep][0];activeLine=activeFlow[activeStep][1];setTimeout(render,35);return}if(activeLine<b.lines.length-1){activeLine++;renderTurn();return}if(activeIndex>=c.beats.length-1){finish(false);return}o.classList.remove('beat-ready');activeIndex++;activeLine=0;setTimeout(render,35)}
function finish(skipped){if(!activeId)return;disconnectPorchGeometry();disconnectNetworkScene();const id=activeId,cb=onDone,shouldMark=markOnDone,o=ensureOverlay();if(shouldMark)markSeen(id);activeId=null;activeIndex=0;activeLine=0;activeFlow=null;activeStep=0;onDone=null;markOnDone=false;o.classList.remove('show','beat-ready');o.removeAttribute('data-cinematic');o.removeAttribute('data-visual');o.removeAttribute('data-mode');o.setAttribute('aria-hidden','true');document.body.classList.remove('cinematic-open');if(lastFocus&&typeof lastFocus.focus==='function')try{lastFocus.focus()}catch(_){}lastFocus=null;if(cb)setTimeout(()=>cb({id,skipped:!!skipped}),40)}
function maybeShowBeforeLevel(level,unlocked,onComplete){const id=TRIGGERS[Number(level)];if(!id||hasSeen(id))return false;const c=CINEMATICS[id];if(Number(level)>1&&Number(unlocked||1)<c.unlock)return false;return show(id,{onComplete,markSeen:true,compact:id==='opening'})}
function renderLibrary(container,unlocked){if(typeof container==='string')container=document.getElementById(container);if(!container)return;const u=Math.max(1,Number(unlocked)||1),order=['opening','across-drift','old-maps','homeward'];container.innerHTML=order.map(id=>{const c=CINEMATICS[id],locked=u<c.unlock,seen=hasSeen(id);return `<button class="cinematic-library-card ${locked?'locked':''}" type="button" data-cinematic-id="${id}" ${locked?'disabled':''}><span class="cinematic-library-status">${locked?`Unlocks after Level ${c.unlock-1}`:seen?'Replay cinematic':'Watch cinematic'}</span><strong>${escapeHtml(c.title)}</strong><small>${escapeHtml(c.chapter)}</small></button>`}).join('');container.querySelectorAll('.cinematic-library-card:not(.locked)').forEach(b=>b.onclick=()=>show(b.dataset.cinematicId,{markSeen:false}))}
document.addEventListener('keydown',e=>{if(!activeId)return;if(e.key==='Escape'){e.preventDefault();finish(true);return}if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();next()}});
window.LatchlingsCinematics={TRIGGERS,CINEMATICS,OPENING_FIRST_RUN_STEPS,MAP_YEARS,show,next,finish,hasSeen,reset,maybeShowBeforeLevel,renderLibrary,castIdentitySource:'LATCHLINGS_STORY.cast',get active(){return activeId},get beat(){return activeIndex},get line(){return activeLine},get mode(){return activeFlow?'first-run':'full'},get step(){return activeFlow?activeStep:null}};
})();

