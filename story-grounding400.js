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
  {title:'A Porch Worth Reaching',setup:'Pip and Tansy make friends at a small porch marked by twin amber lanterns on an island that nearly drifted out of easy visiting range.',question:'What does a route failure cost when the destination is a person rather than a parcel?',stakes:'Connection is becoming social and emotional, not merely efficient.'},
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
  {title:'The Porch Light',setup:'Tansy can still see the same twin amber lanterns on a Lanternwood friend’s porch through the telescope.',question:'What are the Latchlands trying to preserve when they say a route matters?',stakes:'The route is now about keeping relationships possible, not restoring tidy geometry.'},
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
 const fresh=discoveries.length===0;
 const premise=fresh?'Several ordinary routes around Little Home have started missing in suspiciously similar ways. The household has called a Waykeeper to compare the failures and find out what changed.':`Little Home is following what the restored routes have actually proved. The current work is in ${c.theme}, and later conclusions stay out of the briefing until the journey earns them.`;
 const goal=c.arc?.chapterGoal||movement.chapterGoal||'Restore the routes people need now and follow the evidence.';
 const pressure=movement.stakes||c.arc?.pressure||'The current route problem is affecting ordinary life.';
 return {chapter,local,chapterName:c.name,location:c.theme,premise,why:STORY.whyWaykeeper,goal,pressure,currentTitle:movement.title,currentQuestion:movement.question,currentStakes:movement.stakes,known:discoveries.slice(-3).map(x=>x.text)};
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
