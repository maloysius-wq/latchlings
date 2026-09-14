'use strict';
(function(){
const SEEN_KEY='latchlings_cinematics_seen_v1';
const TRIGGERS={1:'opening',251:'across-drift',301:'old-maps',351:'homeward'};
const STORY_CAST=window.LATCHLINGS_CAST||window.LATCHLINGS_STORY?.cast||[];
const CIN_PALETTE={coral:['#ef5f66','#ff9297','#c33d49'],blue:['#4c8ff4','#79aff9','#2e69c8'],mint:['#66bd72','#94dc98','#469852'],gold:['#f6b737','#ffd06a','#d18c16'],lavender:['#9a72df','#c3a0f1','#724fbd']};
const DEFAULT_EXPR={Pippa:'curious',Bramble:'smug',Rowan:'happy',Pip:'determined',Tansy:'surprised'};
const CAST=Object.fromEntries(STORY_CAST.map(c=>{const p=CIN_PALETTE[c.color]||CIN_PALETTE.blue;return [c.name,{color:p[0],light:p[1],dark:p[2],suit:c.suit,expr:DEFAULT_EXPR[c.name]||'happy',role:c.shortRole||c.role,child:c.name==='Pip'||c.name==='Tansy'}]}));
const CINEMATICS={
 opening:{
  title:'The Skyway',chapter:'Before Level 1',finalLabel:'Begin Level 1',unlock:1,
  beats:[
   {label:'The Latchlands Move',visual:'opening-delivery',lines:[['Narrator','The Latchlands are always moving. Not quickly. Not dangerously. Drift is simply part of living here, which means yesterday’s path is never quite today’s.']]},
   {label:'Meet Little Home',visual:'opening-chores',lines:[['Narrator','This is Little Home. Pippa keeps its routines, Bramble knows the roads between households, Rowan watches the island itself, Pip finds what everybody else walks past, and Tansy notices who gets left waiting when a path fails.'],['Tansy','It was one basket.'],['Pip','It was an expedition basket.']]},
   {label:'The Same Miss',visual:'opening-misses',lines:[['Narrator','Then several ordinary routes start missing in almost the same way. Different chores. Different travelers. One suspiciously similar problem.'],['Pippa','My watering stop moved a whole garden bed.'],['Bramble','Bread from East Sunpetal missed us by nearly the same amount.'],['Rowan','Little Home is healthy. It just drifted farther than those routes expected.']]},
   {label:'What the Skyway Does',visual:'opening-flex',lines:[['Narrator','For generations, the Skyway has kept homes, gardens, markets, and neighbors connected while the islands drift. A good route does not hold the world still. It keeps working while the world moves.']]},
   {label:'A Waykeeper Answers',visual:'opening-call',actionLabel:'Answer the call',lines:[['Narrator','Little Home sends an old Waykeeper call. You answer it. The household can bring observations from lived-in routes; a Waykeeper can read how those clues fit across the network and test where a route should go now.'],['Pippa','We’ll show you what changed in the day-to-day routes.'],['Rowan','You help us find out whether those changes belong to one larger pattern.']]},
   {label:'Everyone Knows a Piece',visual:'opening-neighbors',lines:[['Narrator','You will not work alone. Each island knows its own paths and hardware best. Local Latchlings volunteer as route crews, testing stops and travel windows while Little Home gathers the reports.'],['Bramble','Everybody knows a piece of the route. We just need to put the pieces together.']]},
   {label:'How You See a Route',visual:'opening-demo',actionLabel:'Try the route',lines:[['Narrator','On the board, choose a helper and a direction. They snap along that route until an edge, a rock, another helper, or later Skyway hardware stops them. One stop can set up the next.'],['Rowan','Guide each helper into the nest that matches them. When every helper arrives safely, that route is working.']]},
   {label:'Start With Sunpetal',visual:'opening-level1',actionLabel:'Begin Level 1',lines:[['Narrator','Begin with Sunpetal’s morning routes. Restore what people need today, compare the failures as reports arrive, and find out whether Little Home had one strange morning or discovered something much larger.'],['Pippa','First we make breakfast possible again.'],['Pip','Then we investigate breakfast.'],['Tansy','In that order, please.']]}
  ]
 },
 'across-drift':{
  title:'Across the Drift',chapter:'After Level 250',finalLabel:'Continue to Copperline',unlock:251,
  beats:[
   {label:'The View From Prism Gardens',visual:'prism-horizon',lines:[['Narrator','From Prism Gardens, the Waykeeper can finally see farther than one route at a time.']]},
   {label:'A Familiar Porch',visual:'porch',lines:[['Tansy','I can still see their porch.'],['Pip','That sounded less reassuring than you meant it to.'],['Tansy','I would like to keep being able to visit it.']]},
   {label:'Not One Bad Route',visual:'drift-endpoints',lines:[['Rowan','This is not one route behaving badly. Look at all of them.'],['Narrator','The islands are doing what they have always done. The network is falling behind them.']]},
   {label:'Yesterday’s Map',visual:'alignment-mismatch',lines:[['Pippa','If we put every marker back exactly where it used to be, the islands will still be somewhere new.'],['Rowan','Then yesterday’s map cannot be the answer.']]},
   {label:'New Coordinates',visual:'porch-route-payoff',lines:[['Bramble','Good. I was getting tired of chasing yesterday.'],['Narrator','Prism Gardens reconnects on a route that never existed on the old map. The next question is waiting at Copperline Junction: what did the first Waykeepers know that everyone else forgot?']]}
  ]
 },
 'old-maps':{
  title:'Old Maps, New Routes',chapter:'After Level 300',finalLabel:'Build the Living Skyway',unlock:301,
  beats:[
   {label:'The Contradictory Drawer',visual:'drawer-discovery',lines:[['Bramble','I have found the instructions.'],['Pippa','Wonderful.'],['Bramble','They disagree with the other instructions.']]},
   {label:'Look at the Dates',visual:'dated-landmarks',lines:[['Rowan','They do not disagree. Look at the dates.'],['Pippa','Every one of these was approved.']]},
   {label:'They Were All Correct',visual:'map-time-sequence',lines:[['Pippa','They were all correct.'],['Narrator','Old Waykeepers never protected one perfect map. They watched the drift and rewrote the routes again and again.']]},
   {label:'What Was Forgotten',visual:'tended-to-automated',lines:[['Rowan','The machines kept more of the work running by themselves.'],['Bramble','And eventually everyone forgot the part where somebody still had to look out the window.']]},
   {label:'The Real Problem',visual:'living-vs-frozen',lines:[['Narrator','The islands are not broken. The drift is not the disaster. The Skyway stopped changing with them.'],['Pippa','Then we do not restore the old map.']]},
   {label:'Make a New One',visual:'copper-route-payoff',lines:[['Rowan','We make the route the Latchlands need now.'],['Bramble','Finally. Instructions I can follow.'],['Narrator','Now the Waykeeper understands why a route with no historical precedent can still be the right route for the Latchlands today.']]}
  ]
 },
 homeward:{
  title:'Homeward',chapter:'After Level 350',finalLabel:'Begin Homeward',unlock:351,
  beats:[
   {label:'Signals From Everywhere',visual:'community-signals',lines:[['Narrator','By the time Stormswitch comes online, the Waykeeper is no longer working alone.']]},
   {label:'Everyone Has a Part',visual:'people-tasks',lines:[['Pippa','Meadows are ready.'],['Rowan','Lodestone is holding alignment.'],['Bramble','Copperline says the new route is ugly, functional, and therefore officially excellent.']]},
   {label:'A Living Network',visual:'response-chain',lines:[['Narrator','One community watches the drift. Another adjusts an anchor. Another changes a travel window. The Skyway begins responding faster than the islands can leave yesterday’s map behind.']]},
   {label:'No Perfect Route',visual:'routes-in-time',lines:[['Rowan','There is no one perfect route to switch back on.'],['Pippa','Good. We know what to do with perfect old routes now.']]},
   {label:'Aurora Crown',visual:'crown-meeting',lines:[['Narrator','Aurora Crown is not a master switch. It is where the oldest surviving Skyway lines meet.'],['Bramble','Excellent. Everyone brought tools anyway.']]},
   {label:'Homeward',visual:'ordinary-home-pullback',lines:[['Pippa','We keep watching.'],['Rowan','We keep adjusting.'],['Tansy','We keep visiting.'],['Pip','Preferably by the interesting route.'],['Narrator','Home is not the place that never moves. It is the place you keep finding a way back to.']]}
  ]
 }
};
let activeId=null,activeIndex=0,onDone=null,markOnDone=false,lastFocus=null;
function escapeHtml(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}
function suitSvg(s){
 if(s==='heart')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 86C39 74 13 58 13 34c0-14 10-23 23-23 8 0 14 4 18 10 4-6 10-10 18-10 13 0 23 9 23 23 0 24-26 40-45 52Z"/></svg>';
 if(s==='diamond')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 7 88 50 50 93 12 50Z"/></svg>';
 if(s==='club')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 12a19 19 0 0 1 12 34 20 20 0 1 1 9 37c-9 0-15-5-18-11 1 10 5 16 12 21H35c7-5 11-11 12-21-3 6-9 11-18 11a20 20 0 1 1 9-37A19 19 0 0 1 50 12Z"/></svg>';
 if(s==='spade')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8C43 22 14 36 14 60c0 13 10 23 23 23 8 0 13-4 16-10-1 9-5 15-12 20h18c-7-5-11-11-12-20 3 6 8 10 16 10 13 0 23-10 23-23C86 36 57 22 50 8Z"/></svg>';
 return '';
}
function character(name,extra='',expr=''){const c=CAST[name];if(!c)return'';return `<span class="cin-character ${c.child?'child':''} ${extra} expr-${expr||c.expr||'happy'}" data-character="${name}" style="--cin-color:${c.color};--cin-light:${c.light};--cin-dark:${c.dark}"><span class="cin-suit">${suitSvg(c.suit)}</span><span class="cin-face"><span class="cin-eyes"><i></i><i></i></span><i class="cin-mouth"></i></span></span>`}
function helper(color,light,dark,suit,extra=''){return `<span class="cin-character helper ${extra}" style="--cin-color:${color};--cin-light:${light};--cin-dark:${dark}"><span class="cin-suit">${suitSvg(suit)}</span><span class="cin-face"><span class="cin-eyes"><i></i><i></i></span><i class="cin-mouth"></i></span></span>`}
function islandMarkup(i,extra=''){const prop=['tree','cottage','rock','tree','cottage'][i-1]||'tree';return `<div class="cin-island i${i} ${extra}"><span class="cin-island-side"></span><span class="cin-island-rim"></span><span class="cin-island-top"></span><i class="cin-island-prop prop-${prop}"></i></div>`}
function islandsHtml(cls=''){return `<div class="cin-islands ${cls}">${[1,2,3,4,5].map(i=>islandMarkup(i)).join('')}<span class="cin-route r1"></span><span class="cin-route r2"></span><span class="cin-route r3"></span><span class="cin-route r4"></span></div>`}
function homeHtml(mode=''){return `<div class="cin-home-reference-wrap ${mode}"><iframe class="cin-home-reference" src="title-island-concepts/?c=2&embed=1&cinematic=1" title="Little Home" tabindex="-1" aria-hidden="true"></iframe></div>`}
function routeDemoHtml(){return `<div class="cin-demo-board"><div class="cin-demo-label top">ROCK STOP</div><div class="cin-demo-track top"><span class="demo-mover rock-mover">${helper('#4c8ff4','#79aff9','#2e69c8','spade')}</span><i class="demo-rock"></i></div><div class="cin-demo-label bottom">HELPER STOP → SAFE NEST</div><div class="cin-demo-track bottom"><span class="demo-mover helper-mover">${helper('#f6b737','#ffd06a','#d18c16','diamond')}</span><span class="demo-blocker">${helper('#66bd72','#94dc98','#469852','club')}</span><span class="demo-nest">${suitSvg('diamond')}</span></div><div class="cin-demo-arrow">→</div></div>`}
function mapSheets(mode){return `<div class="cin-maps ${mode}"><div class="cin-map-sheet m1"><b>YEAR 12</b><i class="line a"></i><i class="line b"></i><i class="node n1"></i><i class="node n2"></i></div><div class="cin-map-sheet m2"><b>YEAR 31</b><i class="line a"></i><i class="line b"></i><i class="node n1"></i><i class="node n2"></i></div><div class="cin-map-sheet m3"><b>YEAR 58</b><i class="line a"></i><i class="line b"></i><i class="node n1"></i><i class="node n2"></i></div></div>`}
function networkNode(n,label,type){return `<div class="node n${n} type-${type}"><i class="node-side"></i><i class="node-rim"></i><i class="node-top"></i><i class="node-landmark"></i><span>${label}</span></div>`}
function networkHtml(mode=''){const nodes=[['MEADOWS','meadow'],['LANTERN','lantern'],['LODESTONE','lodestone'],['KEEP','keep'],['PRISM','prism'],['COPPERLINE','copper'],['STORMSWITCH','storm'],['CROWN','crown']];return `<div class="cin-network ${mode}">${nodes.map((x,i)=>networkNode(i+1,x[0],x[1])).join('')}<span class="wire w1"></span><span class="wire w2"></span><span class="wire w3"></span><span class="wire w4"></span><span class="wire w5"></span><span class="wire w6"></span><span class="wire w7"></span></div>`}
function lookoutHtml(){return `<div class="cin-lookout-scene cin-porch-production"><i class="porch-cloud c1"></i><i class="porch-cloud c2"></i><div class="porch-far-island"><i class="porch-island-side"></i><i class="porch-island-top"></i><i class="porch-tree"></i><i class="porch-house"></i><i class="porch-deck"></i><i class="porch-friend-lantern l1"></i><i class="porch-friend-lantern l2"></i></div><div class="porch-near-island"><i class="porch-crystal k1"></i><i class="porch-crystal k2"></i></div><div class="cin-telescope production-telescope"><i class="tube"></i><i class="lens"></i><span class="cin-telescope-mount"><b></b><b></b><b></b></span></div>${character('Tansy','lookout-tansy')}${character('Pip','lookout-pip')}<i class="cin-sightline"></i><i class="porch-depth-haze"></i></div>`}
function keepsakeHtml(){const items=[['mail','MEADOWS'],['flag','LANTERN'],['anchor','LODESTONE'],['mask','KEEP'],['prism','PRISM'],['compass','COPPERLINE'],['switch','STORMSWITCH']];return `<div class="cin-keepsake-board">${items.map(([c,l])=>`<i class="cin-keepsake-token ${c}"><b></b><small>${l}</small></i>`).join('')}</div>`}
function automationHtml(){return `<div class="cin-automation"><div class="hand-map">${mapSheets('tiny')}</div><div class="machine"><i class="gear g1"></i><i class="gear g2"></i><span class="fixed-line"></span></div></div>`}
function routeDraftingHtml(label='LIVE ROUTE'){return `<div class="cin-route-drafting"><i></i><b>${label}</b></div>`}

const VISUAL_DESCRIPTIONS={
 'opening-delivery':'Little Home drifts gently while a breakfast basket follows yesterday’s route and lands short of its new stop.',
 'opening-chores':'Pippa waters the garden, Bramble carries a parcel, Rowan checks the tree, and Pip and Tansy cross the yard during ordinary morning chores.',
 'opening-misses':'Basket, watering, and mail routes all miss their shifted destinations by the same visible offset.',
 'opening-flex':'A courier crosses a luminous route that flexes between drifting islands instead of forcing the islands back into place.',
 'opening-call':'A Waykeeper signal rises from Little Home and a compass answers it.',
 'opening-neighbors':'Local route crews gather around Little Home and test shared stopping points together.',
 'opening-demo':'A helper slides until a blocker stops it, then a second move reaches the matching nest.',
 'opening-level1':'The failed breakfast basket sits beside a highlighted Sunpetal route ready for the player to repair.',
 'prism-horizon':'Prism Gardens sits in the foreground while familiar islands are visibly farther apart on the horizon.',
 'porch':'Tansy and Pip use a telescope to find the familiar twin-lantern porch across the widening drift.',
 'drift-endpoints':'Two route endpoints drift apart while their old fixed line stays behind.',
 'alignment-mismatch':'Aligning yesterday’s map with one island visibly misaligns another island group.',
 'porch-route-payoff':'A newly drafted route reaches the familiar twin-lantern porch at its current position.',
 'drawer-discovery':'Bramble physically opens a drawer packed with overlapping approved route maps.',
 'dated-landmarks':'Several maps show the same landmarks at different positions with clearly different dates.',
 'map-time-sequence':'The same landmarks move through a sequence of once-correct historical maps.',
 'tended-to-automated':'A tended route desk gives way to unattended machinery that keeps repeating an old line.',
 'living-vs-frozen':'The islands continue drifting while a stale route remains frozen in yesterday’s position.',
 'copper-route-payoff':'A fresh Copperline route is drawn off the historical map and connects successfully.',
 'community-signals':'Recognizable communities send distinct working signals into the shared network.',
 'people-tasks':'People water, deliver, adjust an anchor, and check signals instead of displaying abstract keepsake cards.',
 'response-chain':'One community action visibly triggers the next response across several regions.',
 'routes-in-time':'Two different routes are shown as valid at different moments as the islands move.',
 'crown-meeting':'Old and new route strands meet at Aurora Crown and continue outward, proving it is a meeting point rather than a master control.',
 'ordinary-home-pullback':'Little Home carries on with watering, deliveries, visitors, and play as the view pulls back to show it as one connected node among many.'
};
function actionLabel(text,cls=''){return `<span class="cin-action-label ${cls}">${escapeHtml(text)}</span>`}
function choreMarks(){return `<div class="cin-chore-marks"><i class="garden">water</i><i class="parcel">deliver</i><i class="tree">check</i><i class="play">play</i></div>`}
function missEvidence(){return `<div class="cin-miss-evidence"><i class="basket">basket</i><i class="water">water</i><i class="mail">mail</i><span class="old-stop s1"></span><span class="old-stop s2"></span><span class="old-stop s3"></span><b>same shift</b></div>`}
function communityTasks(){return `<div class="cin-community-tasks"><i>water</i><i>deliver</i><i>anchor</i><i>signal</i></div>`}
function demoPlayableHtml(){return `${routeDemoHtml()}<div class="cin-demo-controls" aria-label="Guided route example"><button type="button" data-demo-step="1">1 · Choose helper</button><button type="button" data-demo-step="2">2 · Move right</button><span class="cin-demo-status" aria-live="polite">Choose the blue helper.</span></div>`}

function visualHtml(type){
 if(type==='opening-delivery')return `${homeHtml('opening-action opening-delivery')}${actionLabel('breakfast delivery','delivery')}`;
 if(type==='opening-chores')return `${homeHtml('opening-action opening-chores')}${choreMarks()}`;
 if(type==='opening-misses')return `${homeHtml('opening-action opening-misses')}${missEvidence()}`;
 if(type==='opening-flex')return `${islandsHtml('bright flexible-route')}<div class="cin-flex-courier">${helper('#4c8ff4','#79aff9','#2e69c8','spade')}</div>${actionLabel('route flexes with drift','route')}`;
 if(type==='opening-call')return `${homeHtml('opening-call')}<div class="cin-call-signal"><i></i><b>WAYKEEPER CALL</b></div><div class="cin-compass"><i></i><b>ANSWERED</b></div>`;
 if(type==='opening-neighbors')return `${homeHtml('opening-neighbors')}<div class="cin-neighbor-crew">${helper('#4c8ff4','#79aff9','#2e69c8','spade')}${helper('#f6b737','#ffd06a','#d18c16','diamond')}${helper('#66bd72','#94dc98','#469852','club')}</div>${actionLabel('neighbors test a shared stop','crew')}`;
 if(type==='opening-demo')return demoPlayableHtml();
 if(type==='opening-level1')return `${homeHtml('opening-level1')}<div class="cin-breakfast-route"><span class="old-line"></span><i class="basket"></i><i class="miss">×</i></div>${actionLabel('your first repair','goal')}`;
 if(type==='prism-horizon')return `${islandsHtml('prism horizon-spread')}<div class="cin-distance-line"><b>then</b><span></span><b>now</b></div>`;
 if(type==='porch')return lookoutHtml();
 if(type==='drift-endpoints')return `${islandsHtml('drift-apart')}<div class="cin-endpoint-measure"><i></i><b>old fixed line</b></div>`;
 if(type==='alignment-mismatch')return `<div class="cin-overlay-map mismatch-action"><div class="old"><b>ALIGN A</b>${islandsHtml('map-old')}</div><div class="now"><b>B FALLS OUT</b>${islandsHtml('map-now')}</div></div>`;
 if(type==='porch-route-payoff')return `${lookoutHtml()}<div class="cin-porch-route-payoff"><i></i><b>NEW ROUTE REACHES PORCH</b></div>`;
 if(type==='drawer-discovery')return `<div class="cin-drawer physical-discovery"><i></i>${mapSheets('stacked')}</div>${character('Bramble','map-bramble','surprised')}`;
 if(type==='dated-landmarks')return `${mapSheets('spread landmark-dates')}<div class="cin-map-landmark-key"><i></i><b>same landmark</b></div>`;
 if(type==='map-time-sequence')return `${mapSheets('sequence time-sequence')}<div class="cin-time-arrow">YEAR 12 → YEAR 31 → YEAR 58</div>`;
 if(type==='tended-to-automated')return `${automationHtml()}<div class="cin-tender-shift"><span class="attended">watched + revised</span><span class="unattended">left running</span></div>`;
 if(type==='living-vs-frozen')return `${islandsHtml('living-moving')}<div class="cin-frozen-lines compare"><i></i><i></i><i></i><b>route stayed here</b></div>`;
 if(type==='copper-route-payoff')return `${islandsHtml('brand-new')}<div class="cin-compass small"><i></i></div>${routeDraftingHtml('NEW CORRECT ROUTE')}`;
 if(type==='community-signals')return `${networkHtml('signals community-signals')}${communityTasks()}`;
 if(type==='people-tasks')return `${networkHtml('people-working')}${communityTasks()}<div class="cin-working-cast">${character('Pippa','work-pippa','determined')}${character('Bramble','work-bramble','happy')}${character('Rowan','work-rowan','curious')}</div>`;
 if(type==='response-chain')return `${networkHtml('living response-chain')}<div class="cin-chain-steps"><i>1</i><i>2</i><i>3</i><i>4</i></div>`;
 if(type==='routes-in-time')return `${islandsHtml('many routes-in-time')}<div class="cin-route-options"><i></i><i></i><i></i><b>NOW</b><b>NEXT DRIFT</b></div>`;
 if(type==='crown-meeting')return `${networkHtml('crown crown-meeting')}<div class="cin-aurora"><i></i><i></i><i></i></div><div class="cin-crown-through-lines"><i></i><i></i><i></i><b>routes continue outward</b></div>`;
 if(type==='ordinary-home-pullback')return `<div class="cin-homeward-wrap ordinary-life">${networkHtml('mini pullback-network')}${homeHtml('homeward ordinary-life-home')}${choreMarks()}</div>`;
 if(type==='archipelago')return islandsHtml('wide');
 if(type==='little-home')return homeHtml('little-home');
 if(type==='skyway')return `${islandsHtml('bright')}<div class="cin-route-cargo"><i>✉</i><i>✿</i><i>⌂</i></div>`;
 if(type==='waykeeper')return `${islandsHtml('waykeeper-map')}<div class="cin-compass"><i></i><b>WAYKEEPER</b></div>`;
 if(type==='helper-crew')return `<div class="cin-helper-story"><div class="story-side">${character('Pippa','portrait')}<b>STORY</b></div><div class="helper-arrow">→</div><div class="crew-side">${helper('#4c8ff4','#79aff9','#2e69c8','spade')}${helper('#f6b737','#ffd06a','#d18c16','diamond')}${helper('#66bd72','#94dc98','#469852','club')}<b>ROUTE CREW</b></div></div>`;
 if(type==='snap-demo')return routeDemoHtml();
 if(type==='morning')return `${homeHtml('morning')}<div class="cin-breakfast-route"><span class="old-line"></span><i class="basket"></i><i class="miss">×</i></div>`;
 if(type==='prism-view')return `${islandsHtml('prism')}<div class="cin-prism-beam p1"></div><div class="cin-prism-beam p2"></div><div class="cin-prism-beam p3"></div>`;
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
function ensureOverlay(){let o=document.getElementById('cinematicOverlay');if(o)return o;o=document.createElement('div');o.id='cinematicOverlay';o.className='cinematic-overlay';o.setAttribute('aria-hidden','true');o.innerHTML=`<section class="cinematic-shell" role="dialog" aria-modal="true" aria-labelledby="cinematicTitle"><header class="cinematic-head"><div><span class="cinematic-kind">STORY CINEMATIC</span><span class="cinematic-chapter" id="cinematicChapter"></span></div><button class="cinematic-skip" id="cinematicSkip" type="button">Skip</button></header><div class="cinematic-stage" id="cinematicStage" role="img" aria-label=""></div><div class="cinematic-copy"><div class="cinematic-counter" id="cinematicCounter"></div><h2 id="cinematicTitle"></h2><h3 id="cinematicBeat"></h3><div class="cinematic-lines" id="cinematicLines" aria-live="polite"></div></div><footer class="cinematic-footer"><div class="cinematic-progress" id="cinematicProgress" aria-hidden="true"></div><button class="cinematic-next" id="cinematicNext" type="button">Continue</button></footer></section>`;document.body.appendChild(o);document.getElementById('cinematicSkip').onclick=()=>finish(true);document.getElementById('cinematicNext').onclick=next;return o}
function render(){const c=CINEMATICS[activeId],b=c&&c.beats[activeIndex];if(!c||!b)return;const o=ensureOverlay();o.dataset.cinematic=activeId;o.dataset.visual=b.visual;document.getElementById('cinematicChapter').textContent=c.chapter;document.getElementById('cinematicTitle').textContent=c.title;document.getElementById('cinematicBeat').textContent=b.label;document.getElementById('cinematicCounter').textContent=`${activeIndex+1} / ${c.beats.length}`;const stage=document.getElementById('cinematicStage');stage.innerHTML=visualHtml(b.visual);stage.setAttribute('aria-label',VISUAL_DESCRIPTIONS[b.visual]||b.label);document.getElementById('cinematicLines').innerHTML=b.lines.map(([speaker,text])=>`<p class="${speaker==='Narrator'?'narrator':'dialogue'}"><strong>${escapeHtml(speaker)}</strong><span>${escapeHtml(text)}</span></p>`).join('');document.getElementById('cinematicProgress').innerHTML=c.beats.map((_,i)=>`<i class="${i===activeIndex?'active':i<activeIndex?'done':''}"></i>`).join('');const nextBtn=document.getElementById('cinematicNext');nextBtn.textContent=b.actionLabel||(activeIndex===c.beats.length-1?c.finalLabel:'Continue');wireDemo(stage);const copy=document.querySelector('.cinematic-copy');if(copy)copy.scrollTop=0;requestAnimationFrame(()=>o.classList.add('beat-ready'))}
function wireDemo(stage){const controls=stage?.querySelector('.cin-demo-controls');if(!controls)return;const status=controls.querySelector('.cin-demo-status');controls.querySelectorAll('button[data-demo-step]').forEach(btn=>btn.onclick=()=>{const step=Number(btn.dataset.demoStep)||1;controls.dataset.step=String(step);controls.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));if(status)status.textContent=step===1?'Blue helper selected. Now move right.':'Stopped by the helper, then safely into the matching nest.';stage.dataset.demoStep=String(step)})}
function show(id,opts={}){const c=CINEMATICS[id];if(!c)return false;if(activeId)return false;const o=ensureOverlay();lastFocus=document.activeElement;activeId=id;activeIndex=0;onDone=typeof opts.onComplete==='function'?opts.onComplete:null;markOnDone=opts.markSeen!==false;o.classList.remove('beat-ready');o.classList.add('show');o.setAttribute('aria-hidden','false');document.body.classList.add('cinematic-open');render();setTimeout(()=>{const b=document.getElementById('cinematicNext');if(b)try{b.focus({preventScroll:true})}catch(_){b.focus()}const copy=document.querySelector('.cinematic-copy');if(copy)copy.scrollTop=0},50);return true}
function next(){if(!activeId)return;const c=CINEMATICS[activeId],o=ensureOverlay();if(activeIndex>=c.beats.length-1){finish(false);return}o.classList.remove('beat-ready');activeIndex++;setTimeout(render,35)}
function finish(skipped){if(!activeId)return;const id=activeId,cb=onDone,shouldMark=markOnDone,o=ensureOverlay();if(shouldMark)markSeen(id);activeId=null;activeIndex=0;onDone=null;markOnDone=false;o.classList.remove('show','beat-ready');o.removeAttribute('data-cinematic');o.removeAttribute('data-visual');o.setAttribute('aria-hidden','true');document.body.classList.remove('cinematic-open');if(lastFocus&&typeof lastFocus.focus==='function')try{lastFocus.focus()}catch(_){}lastFocus=null;if(cb)setTimeout(()=>cb({id,skipped:!!skipped}),40)}
function maybeShowBeforeLevel(level,unlocked,onComplete){const id=TRIGGERS[Number(level)];if(!id||hasSeen(id))return false;const c=CINEMATICS[id];if(Number(level)>1&&Number(unlocked||1)<c.unlock)return false;return show(id,{onComplete,markSeen:true})}
function renderLibrary(container,unlocked){if(typeof container==='string')container=document.getElementById(container);if(!container)return;const u=Math.max(1,Number(unlocked)||1),order=['opening','across-drift','old-maps','homeward'];container.innerHTML=order.map(id=>{const c=CINEMATICS[id],locked=u<c.unlock,seen=hasSeen(id);return `<button class="cinematic-library-card ${locked?'locked':''}" type="button" data-cinematic-id="${id}" ${locked?'disabled':''}><span class="cinematic-library-status">${locked?`Unlocks after Level ${c.unlock-1}`:seen?'Replay cinematic':'Watch cinematic'}</span><strong>${escapeHtml(c.title)}</strong><small>${escapeHtml(c.chapter)}</small></button>`}).join('');container.querySelectorAll('.cinematic-library-card:not(.locked)').forEach(b=>b.onclick=()=>show(b.dataset.cinematicId,{markSeen:false}))}
document.addEventListener('keydown',e=>{if(!activeId)return;if(e.key==='Escape'){e.preventDefault();finish(true);return}if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();next()}});
window.LatchlingsCinematics={TRIGGERS,CINEMATICS,show,next,finish,hasSeen,reset,maybeShowBeforeLevel,renderLibrary,get active(){return activeId},get beat(){return activeIndex}};
})();

/* Consolidated ordered-dialogue runtime */
'use strict';
(function(){
const API=window.LatchlingsCinematics;if(!API||!API.CINEMATICS)return;
const STORY_CAST=window.LATCHLINGS_CAST||window.LATCHLINGS_STORY?.cast||[];
const PALETTE={coral:['#ef5f66','#ff9297','#c33d49'],blue:['#4c8ff4','#79aff9','#2e69c8'],mint:['#66bd72','#94dc98','#469852'],gold:['#f6b737','#ffd06a','#d18c16'],lavender:['#9a72df','#c3a0f1','#724fbd']};
const EXPR={Pippa:'curious',Bramble:'smug',Rowan:'happy',Pip:'determined',Tansy:'surprised'};
const CAST=Object.fromEntries(STORY_CAST.map(c=>{const p=PALETTE[c.color]||PALETTE.blue;return [c.name,{color:p[0],light:p[1],dark:p[2],suit:c.suit,expr:EXPR[c.name]||'happy',role:c.shortRole||c.role,child:c.name==='Pip'||c.name==='Tansy'}]}));
function escapeHtml(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}
function suitSvg(s){
 if(s==='heart')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 86C39 74 13 58 13 34c0-14 10-23 23-23 8 0 14 4 18 10 4-6 10-10 18-10 13 0 23 9 23 23 0 24-26 40-45 52Z"/></svg>';
 if(s==='diamond')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 7 88 50 50 93 12 50Z"/></svg>';
 if(s==='club')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 12a19 19 0 0 1 12 34 20 20 0 1 1 9 37c-9 0-15-5-18-11 1 10 5 16 12 21H35c7-5 11-11 12-21-3 6-9 11-18 11a20 20 0 1 1 9-37A19 19 0 0 1 50 12Z"/></svg>';
 if(s==='spade')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8C43 22 14 36 14 60c0 13 10 23 23 23 8 0 13-4 16-10-1 9-5 15-12 20h18c-7-5-11-11-12-20 3 6 8 10 16 10 13 0 23-10 23-23C86 36 57 22 50 8Z"/></svg>';
 return '';
}
function portrait(name,extra=''){const c=CAST[name];if(!c)return'';return `<span class="cin-character ${c.child?'child':''} ${extra} expr-${c.expr}" data-character="${escapeHtml(name)}" style="--cin-color:${c.color};--cin-light:${c.light};--cin-dark:${c.dark}"><span class="cin-suit">${suitSvg(c.suit)}</span><span class="cin-face"><span class="cin-eyes"><i></i><i></i></span><i class="cin-mouth"></i></span></span>`}
function dialogueLines(beat){return (beat?.lines||[]).filter(x=>x&&x[0]!=='Narrator'&&CAST[x[0]])}
function dialogueGroups(beat){return dialogueLines(beat).map(([name,text])=>[name,[text]])}
function narratorLines(beat){return (beat?.lines||[]).filter(x=>x&&x[0]==='Narrator').map(x=>x[1])}
function speechTextHtml(texts){return texts.map((text,i)=>`<span${i?' class="speech-followup"':''}>${escapeHtml(text)}</span>`).join('')}
function bubbleHtml(name,texts,index,count){return `<div class="cin-dialogue-speaker speaker-${index+1} speaker-count-${count}" data-speaker="${escapeHtml(name)}"><div class="cin-speech-bubble"><b>${escapeHtml(name)}</b>${speechTextHtml(texts)}</div>${portrait(name,'dialogue-portrait')}<span class="cin-speaker-name">${escapeHtml(name)}</span></div>`}
function castIntroHtml(groups){const spoken=new Map(groups);const order=['Pippa','Bramble','Rowan','Pip','Tansy'];return `<div class="cin-dialogue-layer cin-cast-intro" data-dialogue-count="${groups.length}">${order.map((name,i)=>{const c=CAST[name],speech=spoken.get(name);return `<div class="cin-intro-person intro-${i+1}" data-speaker="${name}">${speech?`<div class="cin-speech-bubble intro-bubble"><b>${name}</b>${speechTextHtml(speech)}</div>`:''}${portrait(name,'dialogue-portrait')}<span class="cin-speaker-name">${name}</span><small>${c.role}</small></div>`}).join('')}</div>`}
function dialogueLayerHtml(id,index,beat){const groups=dialogueGroups(beat);if(id==='opening'&&index===1)return castIntroHtml(groups);if(!groups.length)return '';
 return `<div class="cin-dialogue-layer" data-dialogue-count="${groups.length}">${groups.map(([name,texts],i)=>bubbleHtml(name,texts,i,groups.length)).join('')}</div>`;
}
function openingDockHtml(id,index,groups){
 if(!groups.length)return '';
 const order=['Pippa','Bramble','Rowan','Pip','Tansy'];
 const castKey=id==='opening'&&index===1?`<div class="cin-opening-cast-key" aria-label="Little Home residents">${order.map(name=>{const c=CAST[name];return `<span class="cin-opening-cast-chip">${portrait(name,'opening-cast-portrait')}<span><b>${escapeHtml(name)}</b><small>${escapeHtml(c.role)}</small></span></span>`}).join('')}</div>`:'';
 const rows=groups.map(([name,texts],utterance)=>{const c=CAST[name];return `<div class="cin-opening-dialogue-row" data-speaker="${escapeHtml(name)}" data-utterance="${utterance+1}">${portrait(name,'opening-dialogue-portrait')}<div class="cin-opening-bubble"><div class="cin-opening-speaker"><b>${escapeHtml(name)}</b><small>${escapeHtml(c?.role||'Resident')}</small></div>${speechTextHtml(texts)}</div></div>`}).join('');
 return `<section class="cin-opening-dialogue-dock cin-ordered-dialogue-dock" data-cinematic="${escapeHtml(id)}" data-beat="${index+1}" data-dialogue-count="${groups.length}" aria-label="Character dialogue in script order">${castKey}<div class="cin-opening-dialogue-list">${rows}</div></section>`;
}
function accessibleDialogueHtml(groups){if(!groups.length)return'';return `<span class="cin-dialogue-a11y">${groups.map(([name,texts])=>`${escapeHtml(name)}: ${texts.map(escapeHtml).join(' ')}`).join(' ')}</span>`}
let scheduled=false,processing=false;
function postProcess(){
 scheduled=false;if(processing)return;const id=API.active,index=API.beat,c=API.CINEMATICS[id],beat=c&&c.beats[index],overlay=document.getElementById('cinematicOverlay'),stage=document.getElementById('cinematicStage'),lines=document.getElementById('cinematicLines');
 if(!id||!beat||!overlay||!stage||!lines)return;if(overlay.dataset.cinematic!==id||overlay.dataset.visual!==beat.visual)return;
 processing=true;
 try{
  const groups=dialogueGroups(beat),narration=narratorLines(beat),copy=lines.closest('.cinematic-copy'),beatKey=`${id}:${index+1}`;
  stage.querySelectorAll(':scope > .cin-dialogue-layer').forEach(node=>node.remove());
  let dock=copy?.querySelector(':scope > .cin-opening-dialogue-dock')||null;
  if(dock&&dock.dataset.key!==beatKey){dock.remove();dock=null}
  if(groups.length&&copy&&!dock){lines.insertAdjacentHTML('afterend',openingDockHtml(id,index,groups));dock=copy.querySelector(':scope > .cin-opening-dialogue-dock');if(dock)dock.dataset.key=beatKey}
  if(!groups.length&&dock)dock.remove();
  if(!lines.classList.contains('cinematic-narration-only'))lines.classList.add('cinematic-narration-only');
  lines.dataset.narratorCount=String(narration.length);
  const desired=narration.map(text=>`<p class="narrator-only"><span>${escapeHtml(text)}</span></p>`).join('');
  if(lines.innerHTML!==desired)lines.innerHTML=desired;
  lines.hidden=!narration.length;
  overlay.dataset.dialogueCount=String(groups.length);overlay.dataset.narratorCount=String(narration.length);
 }finally{processing=false}
}
function schedule(){if(processing||scheduled)return;scheduled=true;queueMicrotask(postProcess)}
function observe(){
 const overlay=document.getElementById('cinematicOverlay');if(!overlay){requestAnimationFrame(observe);return}
 new MutationObserver(schedule).observe(overlay,{subtree:true,childList:true,attributes:true,attributeFilter:['data-cinematic','data-visual','class']});
 schedule();
}
const oldEnsure=API.show;API.show=function(){const out=oldEnsure.apply(API,arguments);requestAnimationFrame(()=>requestAnimationFrame(schedule));return out};
observe();
window.LatchlingsCinematicDialogue={CAST,postProcess,narratorLines,dialogueLines,dialogueGroups};
})();

/* Consolidated cinematic geometry runtime */
'use strict';
(function(){
const API=window.LatchlingsCinematics;if(!API)return;
const reducedMotion=()=>window.LatchlingsPrefs?.reducedMotion?.()||!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const ROUTE_PAIRS=[['i1','i2'],['i2','i3'],['i1','i4'],['i4','i5']];
let raf=0,lastBeatKey='',cargoEpoch=performance.now(),lastDialogueLayer=null;
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function enhanceTrees(root=document){
 root.querySelectorAll('.cin-island-prop.prop-tree').forEach(tree=>{
  if(tree.dataset.detailedTree==='true')return;
  tree.dataset.detailedTree='true';
  tree.innerHTML='<span class="cin-tree-trunk"><i class="branch b1"></i><i class="branch b2"></i></span><span class="cin-tree-crown c1"></span><span class="cin-tree-crown c2"></span><span class="cin-tree-crown c3"></span>';
 });
}
function anchorFor(rect,toward){
 const cx=rect.left+rect.width*.5,cy=rect.top+rect.height*.36,tx=toward.x-cx,ty=toward.y-cy,len=Math.hypot(tx,ty)||1,ux=tx/len,uy=ty/len,rx=Math.max(8,rect.width*.38),ry=Math.max(6,rect.height*.18),d=1/Math.sqrt((ux*ux)/(rx*rx)+(uy*uy)/(ry*ry));
 return {x:cx+ux*d,y:cy+uy*d};
}
function layoutIslandRoutes(islands,stageRect){
 const box=islands.getBoundingClientRect(),ow=islands.offsetWidth||box.width,oh=islands.offsetHeight||box.height,sx=box.width/ow||1,sy=box.height/oh||1,centers={};
 for(const cls of ['i1','i2','i3','i4','i5']){
  const el=islands.querySelector(`:scope > .cin-island.${cls}`);if(!el)continue;const r=el.getBoundingClientRect(),local={left:(r.left-box.left)/sx,top:(r.top-box.top)/sy,width:r.width/sx,height:r.height/sy};centers[cls]={x:local.left+local.width*.5,y:local.top+local.height*.36,rect:local};
 }
 const geoms=[];
 ROUTE_PAIRS.forEach(([a,b],idx)=>{
  const from=centers[a],to=centers[b],route=islands.querySelector(`:scope > .cin-route.r${idx+1}`);if(!from||!to||!route)return;
  const start=anchorFor(from.rect,to),end=anchorFor(to.rect,from),dx=end.x-start.x,dy=end.y-start.y,width=Math.max(1,Math.hypot(dx,dy)),angle=Math.atan2(dy,dx)*180/Math.PI;
  route.style.setProperty('left',`${start.x}px`,'important');route.style.setProperty('top',`${start.y}px`,'important');route.style.setProperty('width',`${width}px`,'important');route.style.setProperty('rotate',`${angle}deg`,'important');route.style.setProperty('transform-origin','0 50%','important');
  geoms[idx]={x1:box.left-stageRect.left+start.x*sx,y1:box.top-stageRect.top+start.y*sy,x2:box.left-stageRect.left+end.x*sx,y2:box.top-stageRect.top+end.y*sy,width,angle,from:a,to:b};
 });
 islands.__latchRouteGeometry=geoms;
 return geoms;
}
function layoutCargo(stage,geoms,time){
 const cargo=stage.querySelector('.cin-route-cargo');if(!cargo||!geoms?.length)return;
 const items=[...cargo.querySelectorAll('i')],offsets=[0,.34,.67];
 items.forEach((item,i)=>{
  const g=geoms[Math.min(i,geoms.length-1)];if(!g)return;
  const raw=((time-cargoEpoch)/4800+offsets[i])%1,p=.035+raw*.93,x=g.x1+(g.x2-g.x1)*p,y=g.y1+(g.y2-g.y1)*p,fade=Math.min(1,raw/.09,(1-raw)/.09);
  item.style.setProperty('left',`${x}px`,'important');item.style.setProperty('top',`${y}px`,'important');item.style.setProperty('translate','-50% -50%','important');item.style.setProperty('opacity',String(clamp(fade,0,1)),'important');item.style.setProperty('animation','none','important');
 });
 cargo.__latchRouteGeometry=geoms;
}
function normalizeDialogue(stage){
 const layers=[...stage.querySelectorAll(':scope > .cin-dialogue-layer')];
 layers.forEach(layer=>{
  const bubbles=[...layer.querySelectorAll('.cin-speech-bubble')];if(!bubbles.length)return;
  const target=Math.max(...bubbles.map(b=>{const br=b.getBoundingClientRect();return Math.max(...[...b.querySelectorAll(':scope>b,:scope>span')].map(x=>Math.ceil(x.getBoundingClientRect().bottom-br.top+6)),0)}));
  const currentHeight=parseFloat(layer.style.getPropertyValue('--cin-bubble-height'))||0;if(Math.abs(currentHeight-target)>.25)layer.style.setProperty('--cin-bubble-height',`${target}px`);
  const sr=stage.getBoundingClientRect(),pad=5;
  bubbles.forEach(b=>{const br=b.getBoundingClientRect(),current=parseFloat(getComputedStyle(b).getPropertyValue('--cin-bubble-shift'))||0,baseLeft=br.left-current,baseRight=br.right-current;let desired=0;if(baseLeft<sr.left+pad)desired+=sr.left+pad-baseLeft;if(baseRight>sr.right-pad)desired-=baseRight-(sr.right-pad);if(Math.abs(desired-current)>.25)b.style.setProperty('--cin-bubble-shift',`${desired.toFixed(2)}px`)});
  bubbles.forEach(b=>{const speaker=b.closest('[data-speaker]'),portrait=speaker?.querySelector('.dialogue-portrait'),br=b.getBoundingClientRect(),pr=portrait?.getBoundingClientRect();if(!pr||!br.width)return;const px=pr.left+pr.width/2,tail=clamp((px-br.left)/br.width*100,8,92),current=parseFloat(b.style.getPropertyValue('--cin-tail-x'))||50;if(Math.abs(current-tail)>.1)b.style.setProperty('--cin-tail-x',`${tail.toFixed(2)}%`)});
 });
}
function tick(time){
 raf=0;const overlay=document.getElementById('cinematicOverlay'),stage=document.getElementById('cinematicStage');if(!overlay||!stage||!overlay.classList.contains('show')||!API.active)return;
 const beat=API.beat+1,key=`${API.active}:${beat}`;overlay.dataset.beat=String(beat);if(key!==lastBeatKey){lastBeatKey=key;cargoEpoch=time;lastDialogueLayer=null}
 const dialogueLayer=stage.querySelector(':scope > .cin-dialogue-layer');if(dialogueLayer!==lastDialogueLayer){lastDialogueLayer=dialogueLayer;if(dialogueLayer)normalizeDialogue(stage)}
 enhanceTrees(stage);
 const stageRect=stage.getBoundingClientRect();let brightGeom=null;
 stage.querySelectorAll('.cin-islands').forEach(islands=>{const g=layoutIslandRoutes(islands,stageRect);if(islands.classList.contains('bright'))brightGeom=g});
 if(brightGeom)layoutCargo(stage,brightGeom,reducedMotion()?cargoEpoch+2200:time);
 if(!reducedMotion())raf=requestAnimationFrame(tick);
}
function start(){if(!raf)raf=requestAnimationFrame(tick)}
window.addEventListener('resize',()=>{const stage=document.getElementById('cinematicStage');if(stage)normalizeDialogue(stage)},{passive:true});
function observe(){const overlay=document.getElementById('cinematicOverlay');if(!overlay){requestAnimationFrame(observe);return}new MutationObserver(start).observe(overlay,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-cinematic','data-visual']});start()}
observe();
window.LatchlingsCinematicGeometry={enhanceTrees,layoutIslandRoutes,normalizeDialogue,start,ROUTE_PAIRS};
})();
