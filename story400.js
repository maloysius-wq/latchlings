'use strict';
(function(){
const CAST=[
 {name:'Pippa',color:'lavender',suit:'club',role:'Gardener and household organizer',voice:'Practical, patient, quietly stubborn about doing things properly.'},
 {name:'Bramble',color:'coral',suit:'diamond',role:'Courier, errand-runner, and enthusiastic fixer',voice:'Curious, optimistic, and always convinced there is a clever shortcut.'},
 {name:'Rowan',color:'mint',suit:'heart',role:'Tree-tender and island caretaker',voice:'Observant, patient, and usually the first to notice when the island itself has changed.'},
 {name:'Pip',color:'blue',suit:'spade',role:'Explorer, according to Pip',voice:'Bold, competitive, inventive, and suspicious of unnecessary detours.'},
 {name:'Tansy',color:'coral',suit:'heart',role:'Co-conspirator and collector',voice:'Expressive, imaginative, and unusually good at noticing what a change means to people.'}
];

const CHAPTERS=[
 {
  name:'Morning Routes',theme:'Sunpetal Meadows',mechanic:'Edges, rocks, and clean continuous snaps',color:'#b9dcf4',
  desc:'Little Home wakes to ordinary errands behaving strangely. Breakfast, watering, mail, and play routes no longer line up quite the way they did yesterday.',
  tip:'Use the whole board. Sometimes the useful stopping point is several snaps away from the nest.',
  opening:'Morning begins with tiny inconveniences. By breakfast, the Waykeeper has enough evidence to know the routes themselves are shifting.',
  homeReward:'A route mailbox appears beside the cottage.',
  beats:[
   'The household compares notes and realizes the bad routes are not individual mistakes. Little Home itself has shifted farther than normal.',
   'Neighboring meadow islands report the same trouble. The morning-route problem is wider than one household.',
   'Old route markers sit just slightly out of alignment, as if the map stayed still while the islands kept moving.',
   'The Waykeeper builds a dependable temporary morning circuit. For the first time all day, everyone gets where they meant to go.',
   'The meadow routes are working again, but Rowan confirms the drift has not stopped. A little route mailbox goes up at Little Home.'
  ],
  bases:['Breakfast Basket','Watering Can','Blue Kite','Bread Run','Mail Sack','Tea Tray','Garden Gate','Picnic Cloth','Sunpetal Cart','Lost Scarf'],
  situations:[
   'Pippa wants the herb basket home before the kettle gives up waiting.',
   'The flowers are thirsty and yesterday’s watering route no longer lands where Pippa expects.',
   'Pip insists the kite is not lost; it is merely waiting somewhere inconvenient.',
   'Bramble promised breakfast bread and would very much like that promise to remain technically true.',
   'The morning mail has discovered a remarkably inefficient way to visit Little Home.',
   'Tansy has volunteered to carry tea, which has made route quality suddenly very important.',
   'Pippa needs the garden path working before three separate chores become one large chore.',
   'A picnic is easy to organize once everyone can actually reach the same patch of grass.',
   'The meadow cart is packed, ready, and pointed at a route that made more sense yesterday.',
   'Somebody’s scarf has taken a short trip without consulting its owner.'
  ],
  phase:['',' Detour',' Roundabout',' Reroute',' One More Stop']
 },
 {
  name:'Neighbors',theme:'Lanternwood Grove',mechanic:'Other Latchlings become movable stopping points',color:'#294e62',
  desc:'Lanternwood is full of almost-connected paths. The Waykeeper learns that routes often work because another Latchling is standing in exactly the right place.',
  tip:'A Latchling can be more valuable as a temporary wall than as the next piece you finish.',
  opening:'Bramble goes to check on nearby households and discovers that everybody has been improvising around the same strange drift.',
  homeReward:'A neighbor pennant appears near the cottage.',
  beats:[
   'The first neighboring household reconnects with Little Home. The easiest route turns out to require people helping one another stop safely.',
   'Lanternwood begins coordinating shared travel windows instead of everyone improvising alone.',
   'Pip and Tansy make friends on an island that had nearly drifted out of easy reach.',
   'The old route pattern finally makes sense: the Skyway expected communities to cooperate rather than move independently.',
   'Lanternwood’s neighborhood circuit is restored. A little visitor pennant comes home with Bramble.'
  ],
  bases:['Lantern Supper','Borrowed Ladder','Firefly Jar','Neighbor’s Pie','Woodland Post','Supper Bell','Garden Visit','Shared Basket','Porch Light','Friendly Shortcut'],
  situations:[
   'A neighbor promised supper, and Bramble promised the route was shorter this way.',
   'The borrowed ladder should return before anyone remembers how long it has been borrowed.',
   'Pip and Tansy are carrying a firefly jar with the solemnity of official civic business.',
   'A pie is cooling on the wrong island, which everyone agrees qualifies as an emergency.',
   'Lanternwood’s mail route works beautifully if the right neighbor waits in the right place.',
   'The supper bell rang. Several Latchlings are now attempting to be punctual at once.',
   'Pippa is visiting another garden and refuses to arrive after the seedlings have been watered incorrectly.',
   'Three households are sharing one basket and, increasingly, one route plan.',
   'A porch light is waiting to be delivered before the grove gets properly dark.',
   'Bramble has found another shortcut. Nobody is permitted to look worried yet.'
  ],
  phase:['',' With Company',' Two Stops Later',' After Dark',' Home Together']
 },
 {
  name:'Holding Fast',theme:'Lodestone Caverns',mechanic:'Anchors create deliberate stopping points',color:'#25354d',
  desc:'Buried Skyway anchors reveal that the old network was never meant to freeze the islands. It was meant to create reliable moments inside a moving world.',
  tip:'Treat anchors as movable-route geometry: landing on one can set up the next two or three snaps.',
  opening:'Route markers lead beneath the islands into Lodestone Caverns, where old Waykeeper anchors are still waiting to be understood.',
  homeReward:'A restored anchor hangs beneath Little Home.',
  beats:[
   'The first buried anchor comes back online and creates a dependable stop in a route that had become impossible.',
   'Old Waykeeper markings show that the anchors were designed to be repositioned again and again.',
   'Bramble finds maintenance records proving route-tending used to be an ordinary community job.',
   'A cavern shift ruins yesterday’s solution. The Waykeeper adapts instead of forcing the old plan back into place.',
   'The local anchor network stabilizes the cluster and points toward much older civic routes. Little Home gains its own restored anchor.'
  ],
  bases:['Anchor Bell','Crystal Basket','Cavern Lunch','Lodestone Cart','Echo Lantern','Old Marker','Miner’s Tea','Deep Post','Copper Lunchbox','Waykeeper Chalk'],
  situations:[
   'An old anchor bell rings for the first time in years and immediately creates three new errands.',
   'A crystal sample needs a route home that does not rely on yesterday’s alignment.',
   'Lunch has reached the cavern crew. The cavern crew has not reached lunch.',
   'The Lodestone cart can make the trip if the Waykeeper gives it one dependable place to stop.',
   'An echo lantern is headed deeper underground, preferably without visiting every wall first.',
   'Rowan finds an old route marker that is useful only after everyone stops treating it as decoration.',
   'Tea for the maintenance crew has become the unofficial test of the restored anchor line.',
   'Bramble has a parcel for a station nobody at Little Home knew still existed.',
   'A very dented lunchbox has survived decades underground and deserves a straightforward trip home.',
   'Waykeeper chalk marks turn out to be instructions, revisions, arguments, and occasionally doodles.'
  ],
  phase:['',' Below',' Repositioned',' Under Pressure',' Holding Fast']
 },
 {
  name:'Market Day',theme:'Masquerade Keep',mechanic:'Suit gates recognize each Latchling’s black suit mark',color:'#403052',
  desc:'Masquerade Keep’s old suit-mark lanes were built to keep a crowded market moving. Misalignment turns elegant civic routing into cheerful logistical chaos.',
  tip:'If a route looks blocked, ask whether the wrong Latchling is approaching the gate.',
  opening:'The market is happening whether the routes cooperate or not. The Waykeeper’s job is to make those two facts compatible.',
  homeReward:'Market bunting appears at Little Home.',
  beats:[
   'The outer market lanes reopen and the first carts finally reach the correct stalls.',
   'Pippa’s produce arrives before the market closes, an outcome she accepts as the minimum reasonable standard.',
   'Tansy notices the suit symbols predate the market, linking Masquerade Keep to the oldest Skyway routes.',
   'Records inside the Keep show that the civic lanes once synchronized automatically with distant stations.',
   'Market Day succeeds. The household returns with route records, snacks, and a strand of celebratory bunting.'
  ],
  bases:['Berry Stall','Ribbon Cart','Clockmaker Lane','Pie Queue','Suit Parade','Flower Crate','Market Bell','Mask Box','Spice Basket','Closing Stall'],
  situations:[
   'Pippa’s berries are headed toward a stall that recognizes the correct mark and absolutely nothing else.',
   'A ribbon cart has entered a district where every gate appears personally offended by it.',
   'The clockmaker is waiting for parts and has begun timing the delay with professional interest.',
   'The pie queue is moving. This has somehow made the routing problem more urgent.',
   'A parade route and a delivery route have decided to become the same route for a while.',
   'The flower crate has the right destination, the right owner, and currently the wrong lane.',
   'The market bell means opening time, not “continue reorganizing the entrances.”',
   'A box of festival masks is making excellent progress toward several places it does not belong.',
   'The spice basket smells wonderful enough that three different stalls now claim it.',
   'Bramble is trying to finish one last delivery before “closing soon” becomes “closed.”'
  ],
  phase:['',' Through the Gate',' Crowd Control',' Last Call',' Market Saved']
 },
 {
  name:'The Long Drift',theme:'Prism Gardens',mechanic:'Color gates join suit logic',color:'#82cbd0',
  desc:'From Prism Gardens the household can finally see the larger drift. Some island groups are slowly separating from routes that have connected them for generations.',
  tip:'Separate the two clues: body color answers one gate, black suit answers another.',
  opening:'The gardens’ color-coded lanes are beautiful, precise, and increasingly unable to pretend the islands are still where the old maps say they are.',
  homeReward:'A telescope appears on Little Home.',
  beats:[
   'The first color route comes back online, but the view from the gardens reveals how far the neighboring islands have moved.',
   'One familiar island is visibly farther away. The larger drift is no longer an abstract measurement.',
   'Tansy worries about friends in Lanternwood. The household stops talking about route efficiency and starts talking about staying connected.',
   'The Waykeeper proves that restoring the old map exactly will not work. The islands are already somewhere new.',
   'Prism Gardens reconnects using an adjusted route that never existed on the historical map. Little Home gets a telescope to watch the drift.'
  ],
  bases:['Prism Picnic','Blue Glass','Garden Letter','Color Cart','Distant Porch','Rainbow Seeds','High Path','Friendship Parcel','Glasshouse Tea','Telescope Case'],
  situations:[
   'A picnic basket has learned that matching the route is now just as important as choosing the route.',
   'Blue glass panes are headed for a greenhouse that is gradually becoming a little farther away.',
   'A letter to Lanternwood matters more now that the receiving island is visibly drifting toward the horizon.',
   'The garden cart needs both kinds of route mark to agree before anyone gets lunch.',
   'Tansy can still see a friend’s porch. She would very much like to keep it reachable too.',
   'Rainbow seeds have been sorted by color with great care and routed with considerably less success.',
   'The high garden path gives Rowan the first clear view of the wider Latchlands drift.',
   'Bramble has a parcel for an island that is no longer quite where the address says it is.',
   'Tea in the glasshouse becomes an impromptu route-planning meeting.',
   'A telescope case reaches Little Home before the household fully understands why they are going to need it.'
  ],
  phase:['',' Refracted',' Farther Out',' New Coordinates',' Across the Drift']
 },
 {
  name:'Old Ways',theme:'Copperline Junction',mechanic:'Directional rails and turners reshape continuous snaps',color:'#9a6748',
  desc:'Copperline Junction holds old Waykeeper records that overturn the household’s assumption: the original Skyway was designed to keep changing.',
  tip:'A turner changes direction without ending the move. Trace the entire snap before pressing.',
  opening:'The household expects Copperline to contain instructions for putting the old map back. Instead it contains decades of different correct maps.',
  homeReward:'A Waykeeper compass appears beside the cottage.',
  beats:[
   'Copperline’s first rail loop is restored and immediately demonstrates why a route can be correct only for a particular moment.',
   'Bramble finds maintenance diagrams that openly contradict one another. All of them are signed as approved.',
   'The contradiction becomes the answer: every map was correct for the drift of its day.',
   'The Waykeeper deliberately builds a useful route that has never existed before.',
   'Copperline reconnects using a new map. The household brings home an old Waykeeper compass, not as an instruction but as a reminder to keep looking.'
  ],
  bases:['Copper Express','Turner Tea','Rail Lunch','Old Timetable','Station Parcel','Maintenance Cart','Junction Bell','Map Drawer','New Line','Waykeeper Compass'],
  situations:[
   'A tiny express cart has one direction in mind and several turners with other opinions.',
   'Tea for the station crew is tracing a route that looks impossible until the first turn.',
   'Lunch is traveling by rail, which has made everyone unusually attentive to arrows.',
   'An old timetable is perfectly accurate for a world that existed many years ago.',
   'Bramble’s station parcel is learning that a continuous route can change direction without becoming a new trip.',
   'A maintenance cart needs to visit exactly the parts of Copperline everyone else avoids.',
   'The junction bell rings whenever a restored line reconnects. It has started ringing often.',
   'A drawer full of route maps contains several mutually exclusive versions of “the correct way.”',
   'The Waykeeper tests a route no historical map contains and watches it work.',
   'The old compass points toward movement, not permanence.'
  ],
  phase:['',' Around the Bend',' Revised',' Off the Old Map',' A New Line']
 },
 {
  name:'Coming Together',theme:'Stormswitch Foundry',mechanic:'Switches, doors, rails, and identity gates work as one system',color:'#283a4c',
  desc:'Stormswitch Foundry turns restoration into a community project. One route changes because somebody somewhere else acted at the right time.',
  tip:'A switch is about timing, not just activation. Opening a door can also remove a useful stopping wall.',
  opening:'The Foundry has the control hardware needed to coordinate larger parts of the Skyway, but nothing there works usefully in isolation.',
  homeReward:'A small docking beam appears at Little Home.',
  beats:[
   'The first cross-region switch line comes online and connects communities that have been solving their problems separately.',
   'Several regions successfully coordinate the same travel window. The Skyway begins behaving like a network again.',
   'One failed synchronization sends parcels in several silly directions and teaches everybody more than a flawless test would have.',
   'The rebuilt system starts responding to current drift faster than the old automated network did.',
   'The Latchlands establish a living Waykeeper network. Little Home adds a small arrival platform for the visitors who are suddenly much easier to reach.'
  ],
  bases:['Switch Lunch','Foundry Post','Storm Parcel','Door Timing','Shared Signal','Copper Relay','Visitor Window','Lantern Relay','Community Run','Arrival Beam'],
  situations:[
   'Lunch can cross the Foundry as soon as somebody stops opening the useful door at the wrong time.',
   'A post sack is waiting on three regions to agree about what “now” means.',
   'Bramble’s parcel route depends on a switch operated by somebody Bramble cannot even see.',
   'A door is useful both open and closed, which feels unfair until the route finally works.',
   'The first shared signal between distant islands is brief, bright, and immediately followed by cheering.',
   'A copper relay passes route information farther than any one household could manage alone.',
   'Little Home has a visitor window now. Pip has interpreted this as a formal promise of company.',
   'Lanternwood sends a route signal through the Foundry and gets an answer from Prism Gardens.',
   'Several communities attempt one coordinated run. Most of them even start at the intended time.',
   'The new arrival beam is headed for Little Home, assuming the final control sequence behaves itself.'
  ],
  phase:['',' Switched',' In Sequence',' All Together',' Networked']
 },
 {
  name:'Homeward',theme:'Aurora Crown',mechanic:'Every campaign mechanic is active',color:'#172b52',
  desc:'Aurora Crown reveals the final truth of the Skyway: there is no master route to restore. The network survives by changing with the islands and the people using it.',
  tip:'Read the board as a sequence of future board states, not as a single move.',
  opening:'The oldest Skyway lines overlap beneath the aurora. Nothing here offers a button that puts the world back. It offers the tools to keep moving forward.',
  homeReward:'Distant connected islands and route lights become visible around Little Home.',
  beats:[
   'The first Crown route accepts both restored historical lines and newly invented connections.',
   'Island groups that had begun separating appear on the same living route map again.',
   'Pip and Tansy realize visiting their friends no longer requires planning around a failing crossing.',
   'Little Home becomes one ordinary node in a community-maintained Skyway rather than the center of a rescue effort.',
   'The Skyway lives again. The islands continue to drift, and the routes move with them.'
  ],
  bases:['Aurora Crossing','Crown Parcel','Home Lantern','Living Map','Friend Route','Last Old Gate','New Skyway','Little Home Run','Drifting Together','Tomorrow’s Route'],
  situations:[
   'An aurora-lit route combines lessons from every region and politely refuses to be solved one mechanic at a time.',
   'Bramble has one more parcel and, for once, an entire community helping keep the route open.',
   'A lantern bound for Little Home passes through connections that did not exist at the start of the journey.',
   'The living route map changes while everyone watches and nobody treats that as a failure anymore.',
   'Pip and Tansy are planning a visit that would have been nearly impossible during the Long Drift.',
   'One of the oldest surviving gates becomes useful again without requiring the old world around it.',
   'The new Skyway is not one perfect route. It is hundreds of useful routes that can keep changing.',
   'The household heads home through a network maintained by people all across the Latchlands.',
   'The islands drift under the aurora, connected without being fixed in place.',
   'Tomorrow’s route does not exist yet. The Waykeeper knows that is perfectly normal.'
  ],
  phase:['',' Under the Aurora',' Reconnected',' Living Route',' Homeward']
 }
];

const PHASE_FLAVOR=[
 'The route is still simple enough to read at a glance, which is exactly how the problem intends to introduce itself.',
 'More neighbors and errands are now sharing the same space, so setup matters as much as the destination.',
 'The local problem is starting to reveal something larger about how the Skyway works.',
 'The household is solving today’s problem while quietly rewriting what tomorrow’s route can be.',
 'This is the chapter’s hardest stretch: temporary stops and future board states matter more than the obvious first move.'
];

function clampLevel(level){return Math.max(1,Math.min(400,Number(level)||1))}
function levelMeta(level){
 const L=clampLevel(level),chapter=Math.ceil(L/50),local=(L-1)%50+1,c=CHAPTERS[chapter-1],slot=(local-1)%10,phase=Math.floor((local-1)/10);
 return {
  level:L,chapter,local,
  title:c.bases[slot]+c.phase[phase],
  context:c.situations[slot],
  flavor:PHASE_FLAVOR[phase],
  mechanic:c.mechanic,
  storyName:c.name,
  location:c.theme
 };
}
function beatForLevel(level){
 const L=clampLevel(level),local=(L-1)%50+1;
 if(local%10!==0)return null;
 const chapter=Math.ceil(L/50),c=CHAPTERS[chapter-1],beatIndex=local/10-1;
 return {chapter,local,title:local===50?`Chapter ${chapter} complete · ${c.name}`:`${c.name} · Story beat`,text:c.beats[beatIndex],homeReward:local===50?c.homeReward:null};
}
function completedChapters(progress){
 const stars=progress&&progress.stars||{};
 let completed=0;
 for(let ch=1;ch<=8;ch++){
  const end=ch*50;
  if((stars[end]||0)>0)completed=ch;else break;
 }
 return completed;
}
function currentChapter(progress){
 const unlocked=progress&&progress.unlocked||1;
 return Math.max(1,Math.min(8,Math.ceil(unlocked/50)));
}

window.LATCHLINGS_STORY={
 title:'Latchlings',tagline:'Small friends. Smart puzzles.',world:'The Latchlands',network:'The Skyway',playerRole:'Waykeeper',home:'Little Home',
 premise:'Small creatures live ordinary lives across drifting floating islands. The Waykeeper helps the old Skyway keep changing with them.',
 theme:'A good path is not one that never changes. It is one that can change with the people who need it.',
 cast:CAST,chapters:CHAPTERS,levelMeta,beatForLevel,completedChapters,currentChapter
};
})();
