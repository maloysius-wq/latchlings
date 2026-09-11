from pathlib import Path
import re


def replace_once(path, old, new):
    p=Path(path); s=p.read_text()
    if old not in s:
        raise SystemExit(f'missing expected text in {path}: {old[:100]!r}')
    p.write_text(s.replace(old,new,1))


def regex_once(path, pattern, repl):
    p=Path(path); s=p.read_text()
    ns,n=re.subn(pattern,repl,s,count=1,flags=re.S)
    if n!=1:
        raise SystemExit(f'pattern count {n} in {path}: {pattern[:100]!r}')
    p.write_text(ns)

# ---------------------------------------------------------------------------
# 1) Production narrative model: make the chapter arc queryable everywhere.
# ---------------------------------------------------------------------------
Path('story-grounding400.js').write_text(r'''\
'use strict';
(function(){
const STORY=window.LATCHLINGS_STORY;if(!STORY)return;
STORY.premise='Small creatures live ordinary lives across drifting floating islands. At Little Home, garden schedules, deliveries, drift notes, and neighbor messages begin failing in the same strange ways, so the household calls a Waykeeper to help discover why the old Skyway is falling behind.';
STORY.whyWaykeeper='Little Home did not summon a chosen hero. Its five residents compared different kinds of evidence, realized several route failures might share one cause, and sent an old Waykeeper call for someone trained to read route logic across the whole network. You answered it.';
STORY.campaignGoal='Keep the Latchlands connected by learning why the Skyway is falling behind, then help every community rebuild it into a living network that can change as the islands drift.';
STORY.antagonisticPressure='There is no villain moving the islands. The pressure comes from a route system that has grown rigid while the world it serves keeps changing.';
STORY.helperCrewMotto='Every island knows its own paths. When a route slips, neighbors bring local knowledge, spare hands, and a safe place to stop.';
STORY.helperCrewExplanation='Pippa, Bramble, Rowan, Pip, and Tansy compare garden plans, deliveries, drift observations, and messages at Little Home. Around the Latchlands, nearby Latchlings volunteer to test stopping points, carry supplies, watch travel windows, and tend the pieces of Skyway they know best. The board crew is that local work party, not a literal portrait of the named resident in the story.';
STORY.coordinationExplanation='Reports meet at Little Home, then travel back out with the Waykeeper. Each community keeps watch over its own routes, and together the Latchlands learn to keep the Skyway moving with the drift.';

const CONTRIBUTIONS={
 Pippa:'Tracks routines closely enough to notice when dependable routes begin taking longer or landing wrong.',
 Bramble:'Travels between households, comparing failures that would otherwise look local and unrelated.',
 Rowan:'Watches Little Home itself and connects route trouble to changes in the islands’ drift.',
 Pip:'Explores overlooked places and keeps finding old markers, forgotten hardware, and inconvenient clues.',
 Tansy:'Notices who loses a visit, a friendship, or an ordinary piece of life when a route stops working.'
};
(STORY.cast||[]).forEach(c=>c.contribution=CONTRIBUTIONS[c.name]||'Helps Little Home understand the changing routes.');

const ARCS=[
 {chapterGoal:'Find out why several ordinary Sunpetal routes are failing in the same ways.',atlasObjective:'Compare today’s route failures and learn what changed.',pressure:'Breakfast, watering, mail, and visits are all becoming unreliable at once.',outcome:'Sunpetal proves the hardware still works. The Skyway is describing where the islands used to be, and the drift is continuing.',movements:[
  {title:'A Pattern at Breakfast',setup:'One basket misses a familiar stop. Then the watering route, Pip’s kite, and an outside bread delivery miss in almost the same way.',question:'Is this one strange morning, or are several routes failing for the same reason?',stakes:'If the failures share a cause, fixing one errand will not fix tomorrow.'},
  {title:'The Route Desk',setup:'Neighbor notes pile up at Little Home. A temporary circuit works, then fresh drift immediately changes the problem again.',question:'Can current observations keep a route working when the islands continue to move?',stakes:'A one-time repair is already proving too temporary.'},
  {title:'Markers in the Grass',setup:'Pip finds old Skyway markers sitting slightly away from the routes everyone uses now.',question:'Why do the old markers point toward places the islands no longer occupy?',stakes:'The answer could tell the Waykeeper whether the network or the islands are actually at fault.'},
  {title:'Build for Today',setup:'Local crews start testing stops from current coordinates instead of trusting the old route layout.',question:'Can Sunpetal build a dependable circuit without forcing the islands back into old positions?',stakes:'The meadow needs a route that works with movement, not only between drift checks.'},
  {title:'The Drift Continues',setup:'Sunpetal’s morning routes finally hold, but Rowan’s newest measurements show that nothing has stopped moving.',question:'What happens when the same problem reaches communities beyond the meadow?',stakes:'A working local repair means little if every neighboring route is quietly falling behind too.'}
 ]},
 {chapterGoal:'Reconnect Lanternwood and discover why the old Skyway expected neighbors to participate in one another’s routes.',atlasObjective:'Learn how shared stops turn isolated paths into a neighborhood network.',pressure:'Lanternwood is full of paths that almost connect, leaving households close enough to see and awkwardly hard to visit.',outcome:'Lanternwood reconnects by coordinating people as well as infrastructure. Cooperation was part of the original Skyway design.',movements:[
  {title:'Almost Connected',setup:'Bramble reaches Lanternwood and finds household after household improvising around crossings that miss by just a little.',question:'Can the first neighboring homes reconnect without each one solving the drift alone?',stakes:'Small gaps are already turning ordinary visits and shared chores into separate problems.'},
  {title:'Travel Windows',setup:'Neighbors begin standing in useful places and coordinating when routes are open.',question:'Can a route become dependable because people deliberately make room for one another?',stakes:'Everyone improvising independently keeps creating new conflicts.'},
  {title:'A Porch Worth Reaching',setup:'Pip and Tansy make friends on an island that nearly drifted out of easy visiting range.',question:'What does a route failure cost when the destination is a person rather than a parcel?',stakes:'Connection is becoming social and emotional, not merely efficient.'},
  {title:'The Missing Assumption',setup:'Old Lanternwood patterns make little sense until the Waykeeper treats neighbors as part of the route itself.',question:'Did the old Skyway assume communities would cooperate instead of traveling independently?',stakes:'Understanding that assumption could change how every later route is rebuilt.'},
  {title:'Neighborhood Circuit',setup:'Lanternwood has enough shared stops and travel windows to attempt one connected neighborhood circuit.',question:'Can cooperation hold an entire grove together as the islands keep drifting?',stakes:'This is the first test of a route maintained by a community rather than a single household.'}
 ]},
 {chapterGoal:'Understand the buried anchor system and what it reveals about old Waykeeper maintenance.',atlasObjective:'Wake the old anchors and learn what “holding fast” was actually meant to mean.',pressure:'The route markers lead underground to infrastructure almost nobody remembers how to tend.',outcome:'Anchors create dependable moments inside movement, and old records show route maintenance was once ordinary shared work.',movements:[
  {title:'The Buried Stop',setup:'A route marker leads into Lodestone Caverns, where an old anchor still responds after years underground.',question:'What was an anchor supposed to do in a world whose islands never stop moving?',stakes:'Treating anchors as permanent locks could repeat the same mistake as the stale map.'},
  {title:'Made to Move',setup:'Waykeeper markings show anchors being repositioned again and again across different years.',question:'Why would a “fixed” piece of infrastructure have so many approved positions?',stakes:'The answer may reveal how actively the Skyway was once maintained.'},
  {title:'Everybody’s Job',setup:'Bramble finds maintenance logs full of ordinary names, schedules, and community crews.',question:'Was Waykeeping once a shared civic practice rather than rare specialist work?',stakes:'A network this large cannot depend forever on one household and one Waykeeper.'},
  {title:'When the Cavern Shifts',setup:'A local shift ruins a route that worked perfectly the day before.',question:'Can the Waykeeper adapt without treating the previous solution as sacred?',stakes:'The first real test of the new philosophy arrives immediately.'},
  {title:'Holding, Not Freezing',setup:'The restored anchors now give the local cluster reliable moments of alignment while everything around them continues moving.',question:'What older routes become reachable once the Latchlands stop confusing stability with stillness?',stakes:'The anchor network points toward much larger civic infrastructure.'}
 ]},
 {chapterGoal:'Keep Masquerade Keep’s market functioning and learn how old civic routes coordinated large public systems.',atlasObjective:'Restore the market lanes and trace the suit marks back to the wider Skyway.',pressure:'Thousands of tiny routines collide at once when an elegant routing system loses alignment.',outcome:'Market Day succeeds, and Keep records reveal civic routes once synchronized with distant Skyway stations.',movements:[
  {title:'Market Anyway',setup:'Masquerade Keep is opening on schedule despite route lanes that no longer line up cleanly.',question:'Can the outer market lanes reopen without turning every delivery into a traffic jam?',stakes:'This is the first time the route problem affects a whole public event at once.'},
  {title:'The Right Stall',setup:'Suit-mark gates sort carts and residents through narrow districts, but only when the correct routes reach them.',question:'Can identity-based lanes stay useful when their approaches have drifted?',stakes:'The market depends on precision at a scale Little Home has not seen before.'},
  {title:'Older Than the Market',setup:'Tansy notices that the suit symbols appear on structures much older than today’s stalls.',question:'What were these civic marks used for before Masquerade Keep became a market hub?',stakes:'The symbols may connect today’s chaos to the oldest surviving Skyway.'},
  {title:'Distant Stations',setup:'Records inside the Keep describe route windows synchronized with stations far beyond the market.',question:'How did separated regions once coordinate automatically across the drift?',stakes:'The Skyway used to operate as a larger system than anyone at Little Home realized.'},
  {title:'Market Saved',setup:'The lanes are working, the stalls are open, and communities begin handing the Waykeeper their old route records.',question:'What will those records reveal when compared with the wider Latchlands?',stakes:'The evidence now extends far beyond one region.'}
 ]},
 {chapterGoal:'See the Long Drift clearly and prove that restoring the historical map exactly cannot keep communities connected.',atlasObjective:'Measure the wider drift and find a route that works somewhere the old map does not.',pressure:'Some island groups are slowly separating from connections their communities have relied on for generations.',outcome:'Prism Gardens reconnects with a route that never existed on the historical map. A new route can be more correct than an old one.',movements:[
  {title:'The View Gets Wider',setup:'Prism Gardens’ color lanes work locally, but its high paths reveal neighboring islands farther from their historical markers.',question:'How large is the drift when the Waykeeper looks beyond one route at a time?',stakes:'A local inconvenience may actually be a regional separation.'},
  {title:'A Familiar Island, Farther Away',setup:'A known island is visibly farther from its old connection than anyone at Little Home expected.',question:'How long before “slightly inconvenient” becomes genuinely isolated?',stakes:'The distance is no longer an abstract number on Rowan’s notes.'},
  {title:'The Porch Light',setup:'Tansy can still see a Lanternwood friend’s porch through the telescope.',question:'What are the Latchlands trying to preserve when they say a route matters?',stakes:'The route is now about keeping relationships possible, not restoring tidy geometry.'},
  {title:'Yesterday Will Not Fit',setup:'Pippa overlays the historical map on the present islands. Aligning one region throws another out of place.',question:'Can the old map ever be restored exactly while the islands continue to drift?',stakes:'If the answer is no, restoration must mean something different.'},
  {title:'New Coordinates',setup:'The Waykeeper drafts a Prism route around where the islands actually are, even though no historical map contains it.',question:'Can a brand-new route be legitimate simply because it serves the Latchlands now?',stakes:'Accepting that idea changes the entire purpose of the journey.'}
 ]},
 {chapterGoal:'Discover what the original Waykeepers actually did and why the Skyway stopped adapting.',atlasObjective:'Read Copperline’s contradictory maps and uncover the maintenance philosophy everyone forgot.',pressure:'The household is still tempted to search for one authoritative old plan that can tell them how to put everything back.',outcome:'Every old map was correct for its own moment. Automation preserved operation but hid the need for ongoing observation and revision.',movements:[
  {title:'The Instructions Disagree',setup:'Copperline’s rails lead to drawers full of officially approved route maps that contradict one another.',question:'Which old map is the correct one?',stakes:'The campaign’s entire restoration plan seems to depend on choosing correctly.'},
  {title:'Look at the Dates',setup:'Rowan notices the maps were approved years apart while the islands occupy different positions on each sheet.',question:'What if the contradiction is evidence rather than an error?',stakes:'The old Waykeepers may have understood drift very differently.'},
  {title:'They Were All Correct',setup:'Map after map fits the island positions of its own year.',question:'Was the Skyway always meant to be repeatedly rewritten?',stakes:'If so, there was never one permanent map to recover.'},
  {title:'What Automation Hid',setup:'Later records show more route work being handled automatically while human revisions grow less frequent.',question:'How did a network designed for change become something everyone expected to run untouched?',stakes:'The true failure may be cultural and procedural, not mechanical.'},
  {title:'Off the Old Map',setup:'The Waykeeper deliberately draws a Copperline route that has no historical precedent.',question:'Can the Latchlands trust a route because it works now rather than because it existed before?',stakes:'This is the moment restoration becomes active Waykeeping again.'}
 ]},
 {chapterGoal:'Turn the repair effort into a distributed Waykeeper network that can respond faster than the drift.',atlasObjective:'Coordinate distant communities so no single household has to carry the whole Skyway.',pressure:'The route system is too large and too dynamic for one Waykeeper or one hub to maintain alone.',outcome:'The Latchlands establish a living Waykeeper network. Communities observe and adjust their own parts while sharing what changes.',movements:[
  {title:'One Switch, Two Regions',setup:'Stormswitch Foundry can coordinate routes across regions, but every control changes possibilities somewhere else.',question:'Can distant communities act as parts of one route system without losing local control?',stakes:'Scaling up badly would create a new single point of failure.'},
  {title:'Same Travel Window',setup:'Several regions attempt one coordinated travel window using shared signals.',question:'Can observations and timing travel fast enough to keep separate routes aligned?',stakes:'The rebuilt network needs communication as much as hardware.'},
  {title:'Useful Failure',setup:'A mistimed synchronization sends parcels in ridiculous directions, then gives every region better information.',question:'Can a living network learn from imperfect coordination instead of demanding flawless plans?',stakes:'Adaptability requires feedback, not perfection.'},
  {title:'Faster Than Yesterday',setup:'The rebuilt system begins responding to current drift before old route errors become emergencies.',question:'Can the communities finally change the network faster than the network falls behind?',stakes:'This is the first proof that the new method can last.'},
  {title:'Waykeepers Everywhere',setup:'Meadows, Lanternwood, Lodestone, the Keep, Prism, Copperline, and Stormswitch all maintain pieces of the same living map.',question:'What happens when Waykeeping becomes a shared practice again?',stakes:'Aurora Crown can now be approached as a meeting point, not a rescue machine.'}
 ]},
 {chapterGoal:'Connect the oldest and newest Skyway routes without searching for a master switch or final permanent map.',atlasObjective:'Use every lesson together and make Aurora Crown part of a Skyway that can keep changing tomorrow.',pressure:'The oldest routes converge at Aurora Crown, inviting one last dangerous assumption: that somewhere there must be a perfect central fix.',outcome:'There is no master switch and no final map. The Skyway lives because communities keep watching, communicating, and adjusting together.',movements:[
  {title:'Old and New Together',setup:'Aurora Crown accepts restored historical lines and routes invented only days ago.',question:'Can the oldest infrastructure coexist with connections the old Waykeepers never saw?',stakes:'A living network must inherit useful history without being trapped by it.'},
  {title:'Back on the Same Map',setup:'Island groups that had begun separating appear together on the living route map again.',question:'Can reconnection become ordinary instead of a heroic exception?',stakes:'The campaign succeeds only if everyday travel becomes dependable again.'},
  {title:'Visiting Without a Crisis Plan',setup:'Pip and Tansy realize a visit to friends no longer needs to be planned around a failing crossing.',question:'What does victory look like when the stakes return to ordinary life?',stakes:'The whole journey was meant to protect small routines like this.'},
  {title:'One Node Among Many',setup:'Little Home’s route desk is busy, but it is no longer the center of every decision.',question:'Can the network keep working when responsibility is truly distributed?',stakes:'The Latchlands must not recreate the dependency that caused the problem.'},
  {title:'Tomorrow’s Route',setup:'The islands drift beneath the aurora while route lights keep adjusting around them.',question:'Can the Skyway stay alive without ever becoming finished?',stakes:'The final answer defines what “Skyway Restored” really means.'}
 ]}
];

(STORY.chapters||[]).forEach((c,i)=>c.arc=ARCS[i]);
function clampLevel(level){return Math.max(1,Math.min(400,Number(level)||1))}
function movementForLevel(level){const L=clampLevel(level),chapter=Math.ceil(L/50),local=(L-1)%50+1,index=Math.floor((local-1)/10),c=STORY.chapters[chapter-1],m=c.arc.movements[index];return {chapter,local,index,...m,chapterGoal:c.arc.chapterGoal,atlasObjective:c.arc.atlasObjective,pressure:c.arc.pressure,outcome:c.arc.outcome}}
function milestoneDone(progress,level){return !!(progress&&progress.stars&&Number(progress.stars[level]||0)>0)}
function chapterAtlasLine(chapter,progress){
 const ch=Math.max(1,Math.min(8,Number(chapter)||1)),c=STORY.chapters[ch-1],start=(ch-1)*50+1,unlocked=Math.max(1,Number(progress&&progress.unlocked)||1);
 if(start>unlocked)return {label:'Ahead on the Skyway',text:'Restore the earlier regions to learn what this part of the network needs.'};
 if(milestoneDone(progress,ch*50))return {label:'Region restored',text:c.arc.outcome};
 const local=Math.max(1,Math.min(50,unlocked-(ch-1)*50)),m=c.arc.movements[Math.floor((local-1)/10)];return {label:'Current question',text:m.question};
}
function campaignBriefing(progress){
 const unlocked=Math.max(1,Math.min(400,Number(progress&&progress.unlocked)||1)),chapter=Math.ceil(unlocked/50),local=(unlocked-1)%50+1,c=STORY.chapters[chapter-1],movement=movementForLevel(unlocked),discoveries=[];
 for(let ch=1;ch<=chapter;ch++){
  const cc=STORY.chapters[ch-1];
  for(let i=0;i<5;i++){const L=(ch-1)*50+(i+1)*10;if(milestoneDone(progress,L))discoveries.push({chapter:ch,level:L,text:cc.beats[i]})}
 }
 return {chapter,local,chapterName:c.name,location:c.theme,why:STORY.whyWaykeeper,goal:STORY.campaignGoal,pressure:STORY.antagonisticPressure,currentTitle:movement.title,currentQuestion:movement.question,currentStakes:movement.stakes,known:discoveries.slice(-3).map(x=>x.text)};
}
function journeyFor(progress){
 const unlocked=Math.max(1,Math.min(400,Number(progress&&progress.unlocked)||1)),current=Math.ceil(unlocked/50),out=[];
 for(let ch=1;ch<=current;ch++){
  const c=STORY.chapters[ch-1],done=milestoneDone(progress,ch*50);
  if(done)out.push({chapter:ch,name:c.name,location:c.theme,status:'Restored',summary:c.arc.outcome});
  else {const local=Math.max(1,Math.min(50,unlocked-(ch-1)*50)),m=c.arc.movements[Math.floor((local-1)/10)];out.push({chapter:ch,name:c.name,location:c.theme,status:'In progress',summary:m.question})}
 }
 return out;
}
STORY.movementForLevel=movementForLevel;
STORY.chapterAtlasLine=chapterAtlasLine;
STORY.campaignBriefing=campaignBriefing;
STORY.journeyFor=journeyFor;
const oldBeatForLevel=STORY.beatForLevel.bind(STORY);
STORY.beatForLevel=function(level){
 const beat=oldBeatForLevel(level);if(!beat)return null;const L=clampLevel(level),c=STORY.chapters[beat.chapter-1],m=movementForLevel(L);let nextLead='';
 if(m.index<4){const next=c.arc.movements[m.index+1];nextLead=`Next: ${next.title} — ${next.setup}`}
 else if(beat.chapter<8){const next=STORY.chapters[beat.chapter];nextLead=`Next region: ${next.theme} — ${next.opening}`}
 else nextLead='The final route is not a permanent map. It is a promise to keep watching, communicating, and adjusting.';
 return {...beat,resultLabel:beat.local===50?'Chapter result':'What we learned',movementTitle:m.title,questionResolved:m.question,nextLead};
};
})();
'''.lstrip())

# ---------------------------------------------------------------------------
# 2) Opening cinematic: richer character/world/player setup, without spoiling L20.
# ---------------------------------------------------------------------------
opening_obj=r'''opening:{
  title:'The Skyway',chapter:'Before Level 1',finalLabel:'Begin Level 1',unlock:1,
  beats:[
   {label:'The Latchlands Move',visual:'archipelago',lines:[['Narrator','The Latchlands are always moving. Not quickly. Not dangerously. Drift is simply part of living here, which means yesterday’s path is never quite today’s.']]},
   {label:'Meet Little Home',visual:'little-home',lines:[['Narrator','This is Little Home. Pippa keeps its routines, Bramble knows the roads between households, Rowan watches the island itself, Pip finds what everybody else walks past, and Tansy notices who gets left waiting when a path fails.'],['Tansy','It was one basket.'],['Pip','It was an expedition basket.']]},
   {label:'The Same Miss',visual:'morning',lines:[['Narrator','Then several ordinary routes start missing in almost the same way. Different chores. Different travelers. One suspiciously similar problem.'],['Pippa','My watering stop moved a whole garden bed.'],['Bramble','Bread from East Sunpetal missed us by nearly the same amount.'],['Rowan','Little Home is healthy. It just drifted farther than those routes expected.']]},
   {label:'What the Skyway Does',visual:'skyway',lines:[['Narrator','For generations, the Skyway has kept homes, gardens, markets, and neighbors connected while the islands drift. A good route does not hold the world still. It keeps working while the world moves.']]},
   {label:'A Waykeeper Answers',visual:'waykeeper',lines:[['Narrator','Little Home sends an old Waykeeper call. You answer it. The household can bring observations from lived-in routes; a Waykeeper can read how those clues fit across the network and test where a route should go now.'],['Pippa','We’ll show you what changed in the day-to-day routes.'],['Rowan','You help us find out whether those changes belong to one larger pattern.']]},
   {label:'Everyone Knows a Piece',visual:'helper-crew',lines:[['Narrator','You will not work alone. Each island knows its own paths and hardware best. Local Latchlings volunteer as route crews, testing stops and travel windows while Little Home gathers the reports.'],['Bramble','Everybody knows a piece of the route. We just need to put the pieces together.']]},
   {label:'How You See a Route',visual:'snap-demo',lines:[['Narrator','On the board, choose a helper and a direction. They snap along that route until an edge, a rock, another helper, or later Skyway hardware stops them. One stop can set up the next.'],['Rowan','Guide each helper into the nest that matches them. When every helper arrives safely, that route is working.']]},
   {label:'Start With Sunpetal',visual:'morning',lines:[['Narrator','Begin with Sunpetal’s morning routes. Restore what people need today, compare the failures as reports arrive, and find out whether Little Home had one strange morning or discovered something much larger.'],['Pippa','First we make breakfast possible again.'],['Pip','Then we investigate breakfast.'],['Tansy','In that order, please.']]}
  ]
 },
 'across-drift':''' 
regex_once('cinematics400.js',r"opening:\{.*?\n \},\n 'across-drift':",opening_obj)

# Remove the duplicated opening dialogue override so cinematics400.js is canonical.
regex_once('cinematic-dialogue400.js',r"const opening=API\.CINEMATICS\.opening;\nif\(opening\)\{.*?\n\}\nfunction escapeHtml",'function escapeHtml')

# ---------------------------------------------------------------------------
# 3) Story Cards: five movement openings + visible question/stakes.
# ---------------------------------------------------------------------------
replace_once('story-theme400.js',
"function kindFor(meta){if(meta.local===1)return 'Chapter opening';if(meta.local%10===0)return 'Turning point';return 'Route story'}",
"function kindFor(meta){if(meta.local===1)return 'Chapter opening';if(meta.local%10===1)return 'New lead';return 'Route story'}")
regex_once('story-theme400.js',r"function show\(level,manual=false\)\{.*?\n\}\nfunction close",r'''function show(level,manual=false){
 if(!STORY)return;
 const meta=STORY.levelMeta(level),chapter=STORY.chapters[meta.chapter-1],overlay=document.getElementById('storyCardOverlay');if(!overlay)return;
 const movement=STORY.movementForLevel?STORY.movementForLevel(level):null,movementStart=meta.local===1||meta.local%10===1,featured=featuredFor(meta,chapter),automatic=!manual&&movementStart;
 const title=automatic&&movement?movement.title:meta.title,context=automatic&&movement?movement.setup:meta.context,flavor=automatic?`Today’s route: ${meta.context}`:(movement?`Part of ${movement.title}. ${meta.flavor}`:meta.flavor);
 overlay.className=`story-card-overlay story-card-ch${meta.chapter} story-card-${movementStart?'chapter':'route'} show`;
 overlay.dataset.level=String(level);overlay.dataset.manual=manual?'1':'0';overlay.dataset.featured=featured.map(c=>c.name).join(',');
 document.getElementById('storyCardKind').textContent=kindFor(meta);document.getElementById('storyCardLocation').textContent=`Chapter ${meta.chapter} · ${meta.location}`;document.getElementById('storyCardTitle').textContent=title;document.getElementById('storyCardContext').textContent=context;document.getElementById('storyCardFlavor').textContent=flavor;document.getElementById('storyCardScene').innerHTML=vignette(meta,featured);
 const objective=document.getElementById('storyCardObjective');if(objective){objective.hidden=!movement;objective.innerHTML=movement?`<strong>Current question</strong><span>${escapeHtml(movement.question)}</span><small>${escapeHtml(movement.stakes)}</small>`:''}
 const characters=document.getElementById('storyCardCharacters');if(characters){characters.innerHTML=featured.map(characterChip).join('');characters.hidden=!featured.length;characters.classList.toggle('is-pair',featured.length>1)}
 const crew=document.getElementById('storyCardCrewNote');if(crew){const showCrew=meta.level===1;crew.hidden=!showCrew;const copy=crew.querySelector('span');if(copy)copy.textContent=showCrew?`${STORY.helperCrewMotto} The Latchlings on the board are the local helper crew working this route with you.`:''}
 document.getElementById('storyCardContinue').textContent=manual?'Back to board':'Start route';overlay.setAttribute('aria-hidden','false');requestAnimationFrame(()=>document.getElementById('storyCardContinue')?.focus())
}
function close''')
replace_once('story-theme400.js',
"function autoEligible(meta){return !!meta&&(meta.local===1||meta.local%10===0)}",
"function autoEligible(meta){return !!meta&&(meta.local===1||meta.local%10===1)}")
replace_once('story-theme400.js',
"function residentCard(c){return `<div class=\"story-person story-person-portrait\" data-character=\"${escapeHtml(c.name)}\">${characterAvatar(c)}<span class=\"story-person-copy\"><strong>${escapeHtml(c.name)}</strong><span>${escapeHtml(c.role)}. ${escapeHtml(c.voice)}</span></span></div>`}",
"function residentCard(c){return `<div class=\"story-person story-person-portrait\" data-character=\"${escapeHtml(c.name)}\">${characterAvatar(c)}<span class=\"story-person-copy\"><strong>${escapeHtml(c.name)}</strong><span>${escapeHtml(c.role)}. ${escapeHtml(c.voice)}</span>${c.contribution?`<small class=\"story-person-contribution\">${escapeHtml(c.contribution)}</small>`:''}</span></div>`}")

# ---------------------------------------------------------------------------
# 4) Persistent story rail: keep local character flavor + current chapter thread.
# ---------------------------------------------------------------------------
replace_once('gameplay-story-rail400.js',
"const meta=STORY.levelMeta(level),chapter=meta.chapter,local=meta.local,slot=(local-1)%10,phase=Math.floor((local-1)/10);const early=chapter===1&&local<=20?EARLY_STORY[local-1]:null,speaker=early?.speaker||SPEAKERS[chapter-1][slot],base=early?.line||LINES[chapter-1][slot],report=!!early?.report,movement=movementLabel(chapter,phase),milestone=local%10===0;",
"const meta=STORY.levelMeta(level),chapter=meta.chapter,local=meta.local,slot=(local-1)%10,phase=Math.floor((local-1)/10),arcMovement=STORY.movementForLevel?STORY.movementForLevel(level):null;const early=chapter===1&&local<=20?EARLY_STORY[local-1]:null,speaker=early?.speaker||SPEAKERS[chapter-1][slot],base=early?.line||LINES[chapter-1][slot],report=!!early?.report,movement=arcMovement?.title||movementLabel(chapter,phase),thread=arcMovement?.question||'',milestone=local%10===0;")
replace_once('gameplay-story-rail400.js',
"note.innerHTML=`<section class=\"story-level-rail story-rail-ch${chapter} ${report?'story-report':''}\"><div class=\"story-rail-person\">${portrait(speaker)}<strong>${escapeHtml(speaker)}</strong></div><div class=\"story-rail-main\"><div class=\"story-rail-meta\"><span class=\"story-rail-title\">${escapeHtml(meta.title)}</span>${report?'<span class=\"story-rail-report\">Route report</span>':''}<span class=\"story-rail-count\">${local} / 50</span></div><p><span>${escapeHtml(base)}</span></p><div class=\"story-rail-foot\"><span class=\"story-rail-movement\">${escapeHtml(movement)}</span><span class=\"story-rail-progress\"><b></b>${segments}</span></div></div></section>`;",
"note.innerHTML=`<section class=\"story-level-rail story-rail-ch${chapter} ${report?'story-report':''}\"><div class=\"story-rail-person\">${portrait(speaker)}<strong>${escapeHtml(speaker)}</strong></div><div class=\"story-rail-main\"><div class=\"story-rail-meta\"><span class=\"story-rail-title\">${escapeHtml(meta.title)}</span>${report?'<span class=\"story-rail-report\">Route report</span>':''}<span class=\"story-rail-count\">${local} / 50</span></div><p><span class=\"story-rail-quote\">${escapeHtml(base)}</span>${thread?`<small class=\"story-rail-thread\">Question: ${escapeHtml(thread)}</small>`:''}</p><div class=\"story-rail-foot\"><span class=\"story-rail-movement\">${escapeHtml(movement)}</span><span class=\"story-rail-progress\"><b></b>${segments}</span></div></div></section>`;")

# ---------------------------------------------------------------------------
# 5) Victory milestones + Story & Residents campaign briefing.
# ---------------------------------------------------------------------------
replace_once('game400-b.js',
"beatHtml=beat?`<div class=\"story-beat\"><strong>${beat.title}</strong><p>${beat.text}</p>${beat.homeReward?`<span class=\"story-reward\">Little Home: ${beat.homeReward}</span>`:''}</div>`:'';",
"beatHtml=beat?`<div class=\"story-beat story-beat-result\"><span class=\"story-beat-kicker\">${beat.resultLabel||'Route discovery'}</span><strong>${beat.title}</strong><p>${beat.text}</p>${beat.nextLead?`<div class=\"story-beat-next\"><b>${beat.local===50?'Next region':'Next lead'}</b><span>${beat.nextLead}</span></div>`:''}${beat.homeReward?`<span class=\"story-reward\">Little Home changes: ${beat.homeReward}</span>`:''}</div>`:'';")

regex_once('game400-b.js',r"function storyModal\(\)\{.*?\}\nfunction renderStoryScreen",r'''function storyModal(){if(!STORY){rulesModal();return}const ch=STORY.currentChapter(progress),c=STORY.chapters[ch-1],cast=STORY.cast.map(storyResidentCard).join(''),brief=STORY.campaignBriefing?STORY.campaignBriefing(progress):null,journey=STORY.journeyFor?STORY.journeyFor(progress):[];const mission=brief?`<div class="story-briefing"><div><strong>Why you’re here</strong><p>${brief.why}</p></div><div><strong>Current question</strong><p>${brief.currentQuestion}</p><small>${brief.currentStakes}</small></div>${brief.known.length?`<div><strong>Latest discovery</strong><p>${brief.known[brief.known.length-1]}</p></div>`:''}</div>`:'';const trail=journey.length?`<div class="story-journey">${journey.map(j=>`<div class="story-journey-item ${j.status==='Restored'?'done':'current'}"><b>${j.chapter}</b><span><strong>${j.name}</strong><small>${j.status} · ${j.location}</small><p>${j.summary}</p></span></div>`).join('')}</div>`:'';modal(`<h2>The Latchlands</h2><div class="story-scroll"><p>${STORY.premise}</p>${mission}<h3>You are the ${STORY.playerRole}</h3><p>${STORY.campaignGoal||'Keep the Skyway changing with the drifting islands.'}</p>${storyHelperCrewHtml()}<h3>Little Home</h3><div class="story-cast">${cast}</div><h3>Journey so far</h3>${trail}<h3>Current chapter · ${c.name}</h3><p><strong>${c.theme}</strong><br>${c.desc}</p><p><em>${STORY.theme}</em></p></div><div class="modal-actions"><button class="primary-small" id="storyClose">Back</button></div>`);document.getElementById('storyClose').onclick=settingsModal}
function renderStoryScreen''')
regex_once('game400-b.js',r"function renderStoryScreen\(\)\{.*?\}\nfunction openStoryScreen",r'''function renderStoryScreen(){if(!STORY)return;const ch=STORY.currentChapter(progress),c=STORY.chapters[ch-1],brief=STORY.campaignBriefing?STORY.campaignBriefing(progress):null,journey=STORY.journeyFor?STORY.journeyFor(progress):[],premise=document.getElementById('storyPremise'),role=document.getElementById('storyRole'),cast=document.getElementById('storyCast'),chapter=document.getElementById('storyChapter'),briefing=document.getElementById('storyBriefing'),journeyEl=document.getElementById('storyJourney'),cinematics=document.getElementById('storyCinematics');if(premise)premise.textContent=STORY.premise;if(role)role.innerHTML=`<strong>You are the ${STORY.playerRole}</strong><span>${STORY.campaignGoal||'The Skyway is a living route network built to change as the floating islands drift.'}</span>${storyHelperCrewHtml()}`;if(briefing&&brief)briefing.innerHTML=`<div class="story-briefing"><div><strong>Why you’re here</strong><p>${brief.why}</p></div><div><strong>Current question</strong><p>${brief.currentQuestion}</p><small>${brief.currentStakes}</small></div><div><strong>What we know</strong><p>${brief.known.length?brief.known.join(' '):brief.pressure}</p></div></div>`;if(cast)cast.innerHTML=STORY.cast.map(storyResidentCard).join('');if(chapter)chapter.innerHTML=`<strong>Chapter ${ch}: ${c.name}</strong><span>${c.theme}</span><p>${c.desc}</p>`;if(journeyEl)journeyEl.innerHTML=journey.map(j=>`<div class="story-journey-item ${j.status==='Restored'?'done':'current'}"><b>${j.chapter}</b><span><strong>${j.name}</strong><small>${j.status} · ${j.location}</small><p>${j.summary}</p></span></div>`).join('');if(cinematics&&window.LatchlingsCinematics)window.LatchlingsCinematics.renderLibrary(cinematics,progress.unlocked)}
function openStoryScreen''')

# ---------------------------------------------------------------------------
# 6) Atlas: show the spoiler-safe current narrative question/result.
# ---------------------------------------------------------------------------
replace_once('game400-a.js',
"const head=document.getElementById('chapterHead');head.innerHTML=",
"const atlasNarrative=STORY&&STORY.chapterAtlasLine?STORY.chapterAtlasLine(chapterView,progress):null,atlasObjectiveHtml=atlasNarrative?`<p class=\"atlas-chapter-objective\"><span>${atlasNarrative.label}</span>${atlasNarrative.text}</p>`:'';const head=document.getElementById('chapterHead');head.innerHTML=")
replace_once('game400-a.js',
"</span></p></div><div class=\"atlas-chapter-progress\"><b>${chapterDone}</b>/ 50<br>restored</div>",
"</span></p>${atlasObjectiveHtml}</div><div class=\"atlas-chapter-progress\"><b>${chapterDone}</b>/ 50<br>restored</div>")

# ---------------------------------------------------------------------------
# 7) HTML surfaces: Story Card objective, briefing/journey, stronger ending.
# ---------------------------------------------------------------------------
replace_once('index.html',
'''      <p id="storyPremise"></p>\n      <div class="story-role-card" id="storyRole"></div>''',
'''      <p id="storyPremise"></p>\n      <div id="storyBriefing"></div>\n      <div class="story-role-card" id="storyRole"></div>''')
replace_once('index.html',
'''      <h2>Current chapter</h2>\n      <div class="story-current-chapter" id="storyChapter"></div>\n      <h2>Story Cinematics</h2>''',
'''      <h2>Current chapter</h2>\n      <div class="story-current-chapter" id="storyChapter"></div>\n      <h2>Journey so far</h2>\n      <div class="story-journey" id="storyJourney"></div>\n      <h2>Story Cinematics</h2>''')
replace_once('index.html',
'''      <p class="story-card-flavor" id="storyCardFlavor"></p>\n      <aside class="story-card-crew-note" id="storyCardCrewNote" hidden>''',
'''      <p class="story-card-flavor" id="storyCardFlavor"></p>\n      <div class="story-card-objective" id="storyCardObjective" hidden></div>\n      <aside class="story-card-crew-note" id="storyCardCrewNote" hidden>''')
replace_once('index.html',
'''      <p class="ending-note">Ordinary life continues. That is the victory.</p>''',
'''      <div class="ending-resolution" aria-label="What Skyway Restored means"><p><strong>No master switch.</strong> Nobody stopped the islands from moving.</p><p><strong>No final map.</strong> Every community learned to watch its own routes and share what changes.</p><p><strong>A living Skyway.</strong> Little Home is one connected node among many, and tomorrow’s route can change again.</p></div>\n      <p class="ending-note">Ordinary life continues. That is the victory.</p>''')

# Cache-bust all changed runtime/style assets.
cache_repls={
 'style400-ui.css':'style400-ui.css?v=20260911-narrative1',
 'style400-skyway-atlas.css':'style400-skyway-atlas.css?v=20260911-narrative1',
 'style400-story-theme.css':'style400-story-theme.css?v=20260911-narrative1',
 'style400-story-rail-board.css':'style400-story-rail-board.css?v=20260911-narrative1',
 'story-grounding400.js':'story-grounding400.js?v=20260911-narrative1',
 'cinematics400.js':'cinematics400.js?v=20260911-narrative1',
 'cinematic-dialogue400.js?v=20260911-bubblestable1':'cinematic-dialogue400.js?v=20260911-narrative1',
 'game400-a.js?v=20260911-atlaszoom1':'game400-a.js?v=20260911-narrative1',
 'game400-b.js':'game400-b.js?v=20260911-narrative1',
 'story-theme400.js':'story-theme400.js?v=20260911-narrative1',
 'gameplay-story-rail400.js':'gameplay-story-rail400.js?v=20260911-narrative1'
}
ip=Path('index.html'); html=ip.read_text()
for old,new in cache_repls.items():
    if new in html: continue
    if old not in html: raise SystemExit(f'cache source missing {old}')
    html=html.replace(old,new,1)
ip.write_text(html)

# ---------------------------------------------------------------------------
# 8) CSS additions. Keep gameplay rail footprint at 94px.
# ---------------------------------------------------------------------------
with Path('style400-story-theme.css').open('a') as f:
    f.write(r'''

/* Campaign narrative clarity: current question, briefing, journey, resident evidence. */
.story-card-objective{display:grid;gap:3px;margin-top:10px;padding:10px 11px;border-radius:15px;background:color-mix(in srgb,var(--storyAccent) 10%,rgba(255,250,240,.95));border:1px solid color-mix(in srgb,var(--storyAccent) 31%,#d8c29c);text-align:left}
.story-card-objective[hidden]{display:none}.story-card-objective strong{font-size:9px;letter-spacing:.09em;text-transform:uppercase;color:color-mix(in srgb,var(--storyAccent) 72%,#29465f)}.story-card-objective span{font-family:Georgia,"Times New Roman",serif;color:#29465f;font-size:13.5px;line-height:1.24;font-weight:750}.story-card-objective small{color:#5a7080;font-size:10.2px;line-height:1.3;font-weight:720}
.story-briefing{display:grid;gap:8px;margin:10px 0 14px}.story-briefing>div{padding:10px 12px;border-radius:15px;background:rgba(255,249,235,.62);border:1px solid rgba(177,144,97,.25);text-align:left}.story-briefing strong{display:block;margin-bottom:3px;color:#173a67;font-size:9px;letter-spacing:.08em;text-transform:uppercase}.story-briefing p{margin:0!important;max-width:none!important;color:#405e75!important;font-size:11.2px!important;line-height:1.38!important}.story-briefing small{display:block;margin-top:4px;color:#6a7881;font-size:9.8px;line-height:1.3;font-weight:720}
.story-person-contribution{display:block;margin-top:3px;color:#607786;font-size:9.5px;line-height:1.28;font-weight:720}
.story-journey{display:grid;gap:7px;margin:4px 0 12px}.story-journey-item{display:grid;grid-template-columns:31px minmax(0,1fr);gap:8px;align-items:start;padding:8px 9px;border-radius:14px;background:rgba(255,249,236,.56);border:1px solid rgba(177,144,97,.22);text-align:left}.story-journey-item>b{width:28px;height:28px;display:grid;place-items:center;border-radius:10px;background:#d8c8a9;color:#536675;font-family:Georgia,serif}.story-journey-item.done>b{background:#78aa67;color:#fff}.story-journey-item.current{border-color:rgba(83,151,190,.38);background:rgba(223,241,248,.62)}.story-journey-item.current>b{background:#4f91b5;color:#fff}.story-journey-item>span{min-width:0}.story-journey-item strong{display:block;color:#29465f;font-size:11px}.story-journey-item small{display:block;margin:1px 0 3px;color:#73818a;font-size:8.5px;font-weight:850;text-transform:uppercase;letter-spacing:.04em}.story-journey-item p{margin:0!important;max-width:none!important;color:#526b7c!important;font-size:9.7px!important;line-height:1.3!important}
@media(max-height:720px){.story-card-objective{margin-top:7px;padding:7px 9px}.story-card-objective span{font-size:12px}.story-card-objective small{font-size:9.5px}.story-briefing>div{padding:8px 9px}}
''')

with Path('style400-story-rail-board.css').open('a') as f:
    f.write(r'''

/* Narrative thread inside the fixed 94px gameplay rail. */
.story-rail-main p{display:grid!important;grid-template-rows:auto auto;align-content:center;gap:1px;-webkit-line-clamp:unset!important;-webkit-box-orient:initial!important}
.story-rail-quote{display:block;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.story-rail-main p>.story-rail-quote:before{content:'“'}.story-rail-main p>.story-rail-quote:after{content:'”'}
.story-rail-thread{display:block;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:color-mix(in srgb,var(--railInk) 75%,#72818a);font-size:8.2px;line-height:1.15;font-weight:760}.story-rail-movement{max-width:145px;overflow:hidden;text-overflow:ellipsis}
@media(max-width:390px){.story-rail-thread{font-size:7.8px}.story-rail-movement{max-width:125px}}
''')

with Path('style400-skyway-atlas.css').open('a') as f:
    f.write(r'''

/* Narrative clarity: one spoiler-safe question/result stays attached to each Atlas region. */
.atlas-chapter-head{min-height:88px}
.atlas-chapter-objective{margin-top:3px!important;padding-top:3px;border-top:1px solid rgba(34,67,85,.11);font-size:8.7px!important;line-height:1.16!important;opacity:.9!important;display:-webkit-box!important;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden!important}.atlas-chapter-objective span{display:inline-block;margin-right:5px;padding:1px 4px;border-radius:999px;background:color-mix(in srgb,var(--atlas-accent-soft,#dff1ae) 70%,rgba(255,255,255,.75));font-size:6.8px;font-weight:1000;letter-spacing:.06em;text-transform:uppercase;vertical-align:1px}
@media(max-height:760px){.atlas-chapter-head{min-height:80px}.atlas-chapter-objective{font-size:8.2px!important;-webkit-line-clamp:1}.atlas-chapter-copy h2{margin-bottom:2px}}
''')

with Path('style400-ui.css').open('a') as f:
    f.write(r'''

/* Campaign payoff and milestone discovery hierarchy. */
.story-beat-result{margin:9px 0;padding:10px 11px;border-radius:16px;background:rgba(224,241,232,.66);border:1px solid rgba(80,139,111,.25);text-align:left}.story-beat-kicker{display:block;margin-bottom:3px;color:#41705e;font-size:8px;font-weight:950;letter-spacing:.09em;text-transform:uppercase}.story-beat-result>strong{display:block;color:#173a67;font-family:Georgia,"Times New Roman",serif;font-size:14px}.story-beat-result>p{margin:4px 0 7px!important;color:#4b6678;font-size:11px;line-height:1.35}.story-beat-next{display:grid;gap:2px;padding-top:7px;border-top:1px solid rgba(76,116,99,.17)}.story-beat-next b{color:#5f7869;font-size:8px;letter-spacing:.07em;text-transform:uppercase}.story-beat-next span{color:#405f74;font-size:9.8px;line-height:1.3;font-weight:720}.story-reward{display:block;margin-top:7px;padding:6px 8px;border-radius:10px;background:rgba(255,244,199,.72);color:#755d34;font-size:9.5px;font-weight:800}
.ending-resolution{display:grid;gap:5px;width:min(92%,370px);margin:2px auto 9px}.ending-resolution p{margin:0!important;max-width:none!important;padding:6px 9px;border-radius:12px;background:rgba(255,249,235,.62);border:1px solid rgba(173,142,99,.22);color:#526a79!important;font-size:10.2px!important;line-height:1.28!important;text-align:left}.ending-resolution strong{color:#173a67}
''')

# ---------------------------------------------------------------------------
# 9) Durable narrative docs.
# ---------------------------------------------------------------------------
cin=Path('CINEMATICS_SCRIPT.md'); cs=cin.read_text()
new_opening=r'''# Cinematic 1: The Skyway

**Trigger:** Before Level 1, before the ordinary Level 1 Story Card.  
**Replay unlock:** Always available.  
**Story job:** Establish the Latchlands, normal drift, Little Home’s five residents and the different evidence each notices, several matching route failures, why Little Home sends a Waykeeper call, why the player answers as the Waykeeper, cooperative helper crews, the universal board language, and the initial Sunpetal investigation. **Do not reveal the stale-map diagnosis as solved fact here; Levels 1–20 earn that conclusion.**

## Beat 1 — The Latchlands Move

**Visual:** A wide field of small floating islands drifts at different speeds beneath soft clouds. Faint route lights flex between them.

**Narration:** The Latchlands are always moving. Drift is normal, which means yesterday’s path is never quite today’s.

**Player takeaway:** Movement is not the villain and the Waykeeper is not trying to stop it.

## Beat 2 — Meet Little Home

**Visual:** Little Home comes forward. All five residents are visibly paired with face, name, and role: Pippa — Organizer, Bramble — Courier, Rowan — Caretaker, Pip — Explorer, Tansy — Collector.

**Narration:** Pippa tracks routines, Bramble knows inter-household routes, Rowan watches the island, Pip finds overlooked clues, and Tansy notices who a broken path leaves waiting.

**Tansy:** “It was one basket.”  
**Pip:** “It was an expedition basket.”

**Player takeaway:** These five recur because their ordinary lives produce different evidence, not because they are chosen heroes.

## Beat 3 — The Same Miss

**Visual:** Little Home’s morning route fails in several ways: watering, bread, and another routine route miss similar stops.

**Narration:** Different chores and travelers are failing in suspiciously similar ways.

**Pippa:** “My watering stop moved a whole garden bed.”  
**Bramble:** “Bread from East Sunpetal missed us by nearly the same amount.”  
**Rowan:** “Little Home is healthy. It just drifted farther than those routes expected.”

**Player takeaway:** There is a pattern worth investigating, but its cause is not yet known.

## Beat 4 — What the Skyway Does

**Visual:** Route lights link homes, gardens, markets, and neighbors while islands continue drifting.

**Narration:** The Skyway exists to keep ordinary life connected while the world moves. A good route works with drift rather than freezing it.

## Beat 5 — A Waykeeper Answers

**Visual:** An old Waykeeper signal/compass motif lights above Little Home and new route lines sketch around present positions.

**Narration:** Little Home sends an old Waykeeper call. **You answer it.** The household brings observations from lived-in routes; the Waykeeper brings specialized route-reading skill and can connect those clues across the network.

**Pippa:** “We’ll show you what changed in the day-to-day routes.”  
**Rowan:** “You help us find out whether those changes belong to one larger pattern.”

**Player takeaway:** This explicitly answers why the player is here without assigning the Waykeeper a fixed biography.

## Beat 6 — Everyone Knows a Piece

**Visual:** Local helper crews gather around a route board.

**Narration:** Every island knows its own paths and hardware. Volunteers test stops and travel windows; Little Home coordinates reports; the Waykeeper connects the route logic.

**Bramble:** “Everybody knows a piece of the route. We just need to put the pieces together.”

## Beat 7 — How You See a Route

**Visual:** Demonstrate select → direction → continuous snap → deliberate stopper → matching nest.

**Narration:** A board is the Waykeeper’s route model. Edges, rocks, helpers, and later Skyway hardware create stopping points. One move can set up the next.

**Rowan:** “Guide each helper into the nest that matches them. When every helper arrives safely, that route is working.”

## Beat 8 — Start With Sunpetal

**Visual:** Return to Little Home’s failed morning connection.

**Narration:** Restore Sunpetal’s morning routes, compare the failures as reports arrive, and determine whether this is one strange morning or something larger.

**Pippa:** “First we make breakfast possible again.”  
**Pip:** “Then we investigate breakfast.”  
**Tansy:** “In that order, please.”

**Final button:** **Begin Level 1**

---

'''
pat=r"# Cinematic 1: The Skyway.*?---\n\n# Cinematic 2: Across the Drift"
ns,n=re.subn(pat,new_opening+'# Cinematic 2: Across the Drift',cs,count=1,flags=re.S)
if n!=1: raise SystemExit('CINEMATICS_SCRIPT opening replacement failed')
cin.write_text(ns)

bible=Path('STORY_BIBLE.md'); bs=bible.read_text()
contract=r'''

---

## Player-facing narrative delivery contract

The story bible is only successful if the player can reconstruct the campaign without reading this file. Production story surfaces should therefore distribute the arc deliberately instead of hiding the strongest ideas in completion text.

### What the opening must establish

Before Level 1, a player should know all of the following without already knowing Chapter 1’s answer:

- the islands naturally drift and drift is not an enemy;
- the Skyway exists to keep ordinary life connected while the islands move;
- Little Home is shared by Pippa, Bramble, Rowan, Pip, and Tansy, and each notices a different kind of evidence;
- several ordinary morning routes have begun failing in suspiciously similar ways;
- Little Home sends an old Waykeeper call and **the player answers it**;
- the residents provide local observations while the Waykeeper reads route logic across the network;
- route crews are voluntary local participants who know their own paths and infrastructure;
- a puzzle board is the Waykeeper’s model of one practical route problem;
- the first objective is to restore Sunpetal’s morning routes and determine whether the matching failures point to something larger.

The opening must **not** state as settled fact that “the map is stale.” Levels 1–20 are the investigation that earns that diagnosis.

### Ten-level movement rhythm

Each chapter’s five ten-level movements have three distinct story surfaces:

1. **Movement opening (Levels 1/11/21/31/41):** a short Story Card states the new evidence/setup, the current question, and why it matters. It does not reveal the result.
2. **During the movement:** the compact gameplay rail keeps local character/errand flavor visible while also carrying the active movement title/question.
3. **Movement result (Levels 10/20/30/40/50):** the win screen presents the canonical discovery/result and the next lead. Chapter 50 also makes the Little Home change and next-region bridge explicit.

This means a milestone is discovered **after** the player completes it, not pre-announced immediately before its level.

### Persistent campaign orientation

- The **Skyway Atlas** should show a compact, spoiler-safe current question for the region the player has reached. Completed regions may show their learned outcome. Future regions should not reveal their answer.
- **Story & Residents** is the catch-up surface. It should answer: Why is the Waykeeper here? What is the long-term goal? What do we know now? What question are we currently pursuing? What chapters have already been resolved? What does each Little Home resident contribute?
- The three later major cinematics remain the places for the campaign’s mental-model shifts: visible regional separation, the changing-map revelation, and the distributed living network.

### Ending knowledge

By `Skyway Restored`, the player should understand that:

- nobody defeated or stopped the drift;
- Aurora Crown never contained a master switch;
- there is no final permanent map;
- Waykeeping has become a distributed community practice again;
- Little Home is one node among many rather than the center of the world;
- ordinary life continuing is the actual victory.
'''
if '## Player-facing narrative delivery contract' not in bs:
    bible.write_text(bs.rstrip()+contract+'\n')

print('NARRATIVE_CLARITY_PATCH_APPLIED')
