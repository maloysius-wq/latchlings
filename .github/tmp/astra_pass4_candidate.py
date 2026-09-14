from pathlib import Path
import re

root = Path('.')

# ----- Cinematics: keep the 25 canonical beats, but rewrite the presentation copy around observable action.
cin_path = root / 'cinematics400.js'
cin = cin_path.read_text(encoding='utf-8')

new_cinematics = r'''const CINEMATICS={
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
};'''

cin, n = re.subn(r"const CINEMATICS=\{.*?\n\};(?=\nlet activeId)", new_cinematics, cin, count=1, flags=re.S)
assert n == 1, 'CINEMATICS block replacement failed'

# One-speaker chronological pacing: visual staging stays mounted while dialogue advances line by line.
cin = cin.replace(
    "let activeId=null,activeIndex=0,onDone=null,markOnDone=false,lastFocus=null;",
    "let activeId=null,activeIndex=0,activeLine=0,onDone=null,markOnDone=false,lastFocus=null;"
)

# Give the volunteer and distributed-work beats people doing work instead of diagram/token panels.
old_keepsake = "function keepsakeHtml(){const items=[['mail','MEADOWS'],['flag','LANTERN'],['anchor','LODESTONE'],['mask','KEEP'],['prism','PRISM'],['compass','COPPERLINE'],['switch','STORMSWITCH']];return `<div class=\"cin-keepsake-board\">${items.map(([c,l])=>`<i class=\"cin-keepsake-token ${c}\"><b></b><small>${l}</small></i>`).join('')}</div>`}"
new_keepsake = "function keepsakeHtml(){return `<div class=\"cin-community-work\"><div class=\"work-station meadows\">${character('Pippa','work-pippa')}<i class=\"work-prop route-marker\"></i><b>CHECK ROUTE</b></div><div class=\"work-station lodestone\">${character('Rowan','work-rowan')}<i class=\"work-prop anchor-ring\"></i><b>ADJUST ANCHOR</b></div><div class=\"work-station copperline\">${character('Bramble','work-bramble')}<i class=\"work-prop map-roll\"></i><b>REDRAW LINE</b></div><span class=\"work-signal s1\"></span><span class=\"work-signal s2\"></span></div>`}"
assert old_keepsake in cin, 'keepsake helper signature changed'
cin = cin.replace(old_keepsake, new_keepsake)

insert_after = "function routeDraftingHtml(label='LIVE ROUTE'){return `<div class=\"cin-route-drafting\"><i></i><b>${label}</b></div>`}\n"
volunteer_fn = "function volunteerHtml(){return `<div class=\"cin-volunteer-scene\">${islandsHtml('volunteer-islands')}<i class=\"volunteer-route-stake\"></i>${character('Bramble','volunteer-bramble')}${helper('#4c8ff4','#79aff9','#2e69c8','spade','volunteer-helper h1')}${helper('#f6b737','#ffd06a','#d18c16','diamond','volunteer-helper h2')}${helper('#66bd72','#94dc98','#469852','club','volunteer-helper h3')}<span class=\"volunteer-line l1\"></span><span class=\"volunteer-line l2\"></span><span class=\"volunteer-line l3\"></span></div>`}\n"
assert insert_after in cin, 'routeDrafting helper anchor changed'
cin = cin.replace(insert_after, insert_after + volunteer_fn)

old_helper_visual = "if(type==='helper-crew')return `<div class=\"cin-helper-story\"><div class=\"story-side\">${character('Pippa','portrait')}<b>STORY</b></div><div class=\"helper-arrow\">→</div><div class=\"crew-side\">${helper('#4c8ff4','#79aff9','#2e69c8','spade')}${helper('#f6b737','#ffd06a','#d18c16','diamond')}${helper('#66bd72','#94dc98','#469852','club')}<b>ROUTE CREW</b></div></div>`;"
assert old_helper_visual in cin, 'helper-crew visual anchor changed'
cin = cin.replace(old_helper_visual, "if(type==='helper-crew')return volunteerHtml();")

# Replace renderer/advance logic with a stable scene plus one chronological utterance at a time.
render_start = cin.index('function render(){')
show_start = cin.index('function show(', render_start)
new_render = r'''function renderTurn(){
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
'''
cin = cin[:render_start] + new_render + cin[show_start:]

cin = cin.replace(
    "activeId=id;activeIndex=0;onDone=typeof opts.onComplete==='function'?opts.onComplete:null;",
    "activeId=id;activeIndex=0;activeLine=0;onDone=typeof opts.onComplete==='function'?opts.onComplete:null;"
)

cin, n = re.subn(
    r"function next\(\)\{.*?\}(?=\nfunction finish)",
    "function next(){if(!activeId)return;const c=CINEMATICS[activeId],b=c.beats[activeIndex],o=ensureOverlay();if(activeLine<b.lines.length-1){activeLine++;renderTurn();return}if(activeIndex>=c.beats.length-1){finish(false);return}o.classList.remove('beat-ready');activeIndex++;activeLine=0;setTimeout(render,35)}",
    cin,
    count=1,
    flags=re.S,
)
assert n == 1, 'next() replacement failed'
cin = cin.replace(
    "activeId=null;activeIndex=0;onDone=null;markOnDone=false;",
    "activeId=null;activeIndex=0;activeLine=0;onDone=null;markOnDone=false;"
)
cin = cin.replace(
    "get active(){return activeId},get beat(){return activeIndex}",
    "get active(){return activeId},get beat(){return activeIndex},get line(){return activeLine}"
)

cin_path.write_text(cin, encoding='utf-8')

# ----- Cinematic styling: add action staging inside the existing canonical cinematic stylesheet.
css_path = root / 'style400-cinematics.css'
css = css_path.read_text(encoding='utf-8')
marker = '/* Astra Pass 4 action staging */'
assert marker not in css, 'Pass 4 cinematic styles already present'
css += r'''

/* Astra Pass 4 action staging */
.cinematic-lines p.is-current{min-height:64px;align-content:start;animation:cinDialogueTurn .22s ease-out both}
.cinematic-overlay[data-turn="0"] .cinematic-stage{--turn-shift:0}
.cinematic-stage{background:linear-gradient(180deg,#acd7f2 0%,#dceefa 61%,#f5efe0 100%)}
.cinematic-stage:before{content:"";position:absolute;inset:auto -8% -20px;height:62%;background:radial-gradient(ellipse at center,rgba(255,248,220,.52),rgba(255,255,255,0) 68%);pointer-events:none;z-index:0}

/* Opening: observable drift, chores, a missed basket, then volunteers. */
.cinematic-overlay[data-cinematic="opening"][data-visual="archipelago"] .cin-island.i1{animation-name:cinPass4DriftLeft}
.cinematic-overlay[data-cinematic="opening"][data-visual="archipelago"] .cin-island.i3{animation-name:cinPass4DriftRight}
.cinematic-overlay[data-cinematic="opening"][data-visual="morning"] .cin-breakfast-route .basket{animation:cinPass4BasketMiss 2.8s ease-in-out infinite}
.cin-volunteer-scene{position:absolute;inset:0;overflow:hidden}
.cin-volunteer-scene .volunteer-islands{opacity:.72;scale:.92}
.volunteer-route-stake{position:absolute;left:50%;top:48%;width:9px;height:54px;border-radius:6px;background:#8a6748;box-shadow:0 0 0 4px rgba(255,247,218,.65);z-index:4}
.volunteer-route-stake:before{content:"";position:absolute;left:-17px;top:-3px;width:43px;height:20px;border-radius:5px;background:#fff0c3;border:2px solid #b99057;rotate:-3deg}
.volunteer-bramble{left:42%;top:55%;z-index:6}
.volunteer-helper{z-index:6}.volunteer-helper.h1{left:24%;top:44%}.volunteer-helper.h2{right:22%;top:40%}.volunteer-helper.h3{right:30%;top:65%}
.volunteer-line{position:absolute;height:3px;border-radius:999px;background:linear-gradient(90deg,rgba(72,153,211,.1),#77c6ef,#fff1a1);transform-origin:left center;z-index:3;animation:cinPass4RouteWrite 1.2s ease-out both}
.volunteer-line.l1{width:112px;left:29%;top:52%;rotate:6deg}.volunteer-line.l2{width:112px;left:51%;top:51%;rotate:-11deg;animation-delay:.18s}.volunteer-line.l3{width:95px;left:51%;top:58%;rotate:18deg;animation-delay:.34s}

/* Across the Drift: old lines stay put while endpoints visibly move. */
.cinematic-overlay[data-visual="network-miss"] .cin-islands.misaligned .i1{animation:cinPass4EndpointA 4s ease-in-out infinite}
.cinematic-overlay[data-visual="network-miss"] .cin-islands.misaligned .i3{animation:cinPass4EndpointB 4s ease-in-out infinite}
.cinematic-overlay[data-visual="network-miss"] .cin-ghost-map{opacity:.75}
.cinematic-overlay[data-visual="map-mismatch"] .cin-overlay-map .old{animation:cinPass4MapAlign 3.6s ease-in-out infinite}
.cinematic-overlay[data-visual="new-route"] .cin-route-drafting i{animation:cinPass4RouteWrite 1.5s ease-out both}

/* Old Maps: the physical evidence moves and the stale system visibly stops responding. */
.cinematic-overlay[data-visual="map-drawer"] .cin-drawer{animation:cinPass4DrawerOpen .65s cubic-bezier(.2,.85,.2,1) both}
.cinematic-overlay[data-visual="dated-maps"] .cin-map-sheet b{font-size:12px;letter-spacing:.06em}
.cinematic-overlay[data-visual="map-sequence"] .cin-map-sheet{animation:cinPass4MapSequence 4.8s ease-in-out infinite}
.cinematic-overlay[data-visual="automation"] .machine .gear{animation-duration:5.6s}
.cinematic-overlay[data-visual="frozen-network"] .cin-island{animation-duration:4.7s}
.cinematic-overlay[data-visual="frozen-network"] .cin-frozen-lines{filter:grayscale(.35);opacity:.76}

/* Homeward: people do distributed work; signals cause the next response. */
.cin-community-work{position:absolute;inset:0;display:grid;grid-template-columns:repeat(3,1fr);align-items:center;gap:8px;padding:36px 20px 24px}
.work-station{position:relative;height:132px;border-radius:24px;background:rgba(255,249,232,.76);border:1px solid rgba(163,135,96,.32);box-shadow:0 10px 22px rgba(42,70,88,.12);overflow:hidden}
.work-station .cin-character{left:50%;top:20px;translate:-50% 0;z-index:3}
.work-station b{position:absolute;left:5px;right:5px;bottom:10px;text-align:center;font-size:8px;letter-spacing:.08em;color:#31516e}
.work-prop{position:absolute;left:50%;bottom:35px;translate:-50% 0;width:44px;height:25px;z-index:2}
.route-marker{border-left:5px solid #7a6248;border-right:5px solid #7a6248;border-top:4px solid #efc875}
.anchor-ring{width:31px;height:31px;border:5px solid #5b8fa6;border-radius:50%;box-shadow:0 0 0 4px rgba(113,206,220,.18)}
.anchor-ring:after{content:"";position:absolute;left:50%;top:7px;width:5px;height:30px;background:#5b8fa6;translate:-50% 0}
.map-roll{height:31px;border-radius:4px;background:linear-gradient(135deg,#f7e8c9,#fff8e7);border:2px solid #b98e59;rotate:-6deg}
.work-signal{position:absolute;height:3px;border-radius:999px;background:linear-gradient(90deg,transparent,#8bd3f3,#fff0a2,#8bd3f3,transparent);z-index:5;animation:cinPass4Signal 2.6s ease-in-out infinite}.work-signal.s1{width:110px;left:28%;top:47%;rotate:-4deg}.work-signal.s2{width:110px;right:27%;top:54%;rotate:5deg;animation-delay:-1.3s}
.cinematic-overlay[data-visual="signals"] .cin-network .node-landmark,.cinematic-overlay[data-visual="living-network"] .cin-network .node-landmark{animation:cinPass4LandmarkAnswer 2.8s ease-in-out infinite}
.cinematic-overlay[data-visual="signals"] .cin-network .n2 .node-landmark,.cinematic-overlay[data-visual="living-network"] .cin-network .n2 .node-landmark{animation-delay:-.4s}.cinematic-overlay[data-visual="signals"] .cin-network .n3 .node-landmark,.cinematic-overlay[data-visual="living-network"] .cin-network .n3 .node-landmark{animation-delay:-.8s}.cinematic-overlay[data-visual="signals"] .cin-network .n4 .node-landmark,.cinematic-overlay[data-visual="living-network"] .cin-network .n4 .node-landmark{animation-delay:-1.2s}.cinematic-overlay[data-visual="signals"] .cin-network .n5 .node-landmark,.cinematic-overlay[data-visual="living-network"] .cin-network .n5 .node-landmark{animation-delay:-1.6s}.cinematic-overlay[data-visual="signals"] .cin-network .n6 .node-landmark,.cinematic-overlay[data-visual="living-network"] .cin-network .n6 .node-landmark{animation-delay:-2s}.cinematic-overlay[data-visual="signals"] .cin-network .n7 .node-landmark,.cinematic-overlay[data-visual="living-network"] .cin-network .n7 .node-landmark{animation-delay:-2.4s}

@keyframes cinDialogueTurn{from{opacity:0;translate:0 5px}to{opacity:1;translate:0 0}}
@keyframes cinPass4DriftLeft{0%,100%{translate:0 0}50%{translate:-12px 3px}}
@keyframes cinPass4DriftRight{0%,100%{translate:0 0}50%{translate:14px -2px}}
@keyframes cinPass4BasketMiss{0%,18%{translate:-34px -5px;rotate:-8deg}58%{translate:36px 4px;rotate:7deg}72%,100%{translate:45px 16px;rotate:14deg}}
@keyframes cinPass4RouteWrite{from{scale:0 1;opacity:.2}to{scale:1 1;opacity:1}}
@keyframes cinPass4EndpointA{0%,100%{translate:0 0}50%{translate:-18px 8px}}
@keyframes cinPass4EndpointB{0%,100%{translate:0 0}50%{translate:18px -8px}}
@keyframes cinPass4MapAlign{0%,100%{translate:-8px 0}50%{translate:8px 0}}
@keyframes cinPass4DrawerOpen{from{translate:0 -18px;opacity:.4}to{translate:0 0;opacity:1}}
@keyframes cinPass4MapSequence{0%,100%{translate:0 0;rotate:-1deg}33%{translate:7px -3px;rotate:1deg}66%{translate:-5px 3px;rotate:-2deg}}
@keyframes cinPass4Signal{0%,100%{opacity:.2;filter:saturate(.7)}50%{opacity:1;filter:saturate(1.3)}}
@keyframes cinPass4LandmarkAnswer{0%,70%,100%{filter:brightness(1);scale:1}82%{filter:brightness(1.35);scale:1.08}}

@media(prefers-reduced-motion:reduce){
 .cinematic-lines p.is-current,.cin-volunteer-scene *, .cin-community-work *,
 .cinematic-overlay[data-visual="network-miss"] .cin-island,
 .cinematic-overlay[data-visual="map-mismatch"] .cin-overlay-map .old,
 .cinematic-overlay[data-visual="map-drawer"] .cin-drawer,
 .cinematic-overlay[data-visual="map-sequence"] .cin-map-sheet,
 .cinematic-overlay[data-visual="signals"] .node-landmark,
 .cinematic-overlay[data-visual="living-network"] .node-landmark{animation:none!important}
}
'''
css_path.write_text(css, encoding='utf-8')

# ----- Ending: use the canonical Little Home scene, living route activity, concise thesis, and Home-first action.
index_path = root / 'index.html'
index = index_path.read_text(encoding='utf-8')
start = index.index('  <main id="complete"')
end = index.index('  </main>', start) + len('  </main>')
new_ending = r'''  <main id="complete" class="screen" aria-label="Campaign complete">
    <div class="home-main"><section class="hero card ending-hero ending-hero-pass4">
      <div class="logo" style="font-size:24px">Latchlings<small></small></div>
      <div class="ending-kicker">Little Home · Level 400</div>
      <h1>Skyway Restored</h1>
      <p>Morning reaches Little Home. A parcel lands, a porch answers, and the islands keep drifting.</p>
      <div class="ending-homecoming" role="img" aria-label="Little Home connected to the living Skyway while ordinary morning routes continue">
        <iframe class="ending-home-frame" src="title-island-concepts/?c=2&amp;embed=1&amp;cinematic=1&amp;ending=1" title="Little Home after the Skyway restoration" tabindex="-1"></iframe>
        <div class="ending-living-routes" aria-hidden="true"><i class="route-a"></i><i class="route-b"></i><i class="route-c"></i><span class="ending-parcel">✉</span><span class="ending-porch-light"></span></div>
      </div>
      <p class="ending-note">Ordinary life continues. That is the victory.</p>
      <div class="ending-actions"><button class="primary-btn" id="completeHome">Return to Little Home</button><button class="secondary-btn" id="completeLevels">Level Select</button></div>
    </section></div>
  </main>'''
index = index[:start] + new_ending + index[end:]
index = index.replace('style400-ui.css?v=20260912-pass1', 'style400-ui.css?v=20260914-astra-pass4-candidate1')
index = index.replace('style400-cinematics.css?v=20260913-audit-r1r5-1', 'style400-cinematics.css?v=20260914-astra-pass4-candidate1')
index = index.replace('cinematics400.js?v=20260913-audit-r1r5-1', 'cinematics400.js?v=20260914-astra-pass4-candidate1')
index_path.write_text(index, encoding='utf-8')

ui_path = root / 'style400-ui.css'
ui = ui_path.read_text(encoding='utf-8')
ui_marker = '/* Astra Pass 4 canonical ending */'
assert ui_marker not in ui, 'Pass 4 ending styles already present'
ui += r'''

/* Astra Pass 4 canonical ending */
.ending-hero-pass4{padding:18px 16px 17px;background:linear-gradient(180deg,#fff9ed 0%,#f8ead6 66%,#f2dfc3 100%)}
.ending-hero-pass4 h1{margin-bottom:5px}.ending-hero-pass4>p:not(.ending-note){margin-bottom:9px}
.ending-homecoming{position:relative;width:min(100%,430px);height:286px;margin:0 auto 7px;border-radius:26px;overflow:hidden;background:linear-gradient(#b7dff6,#eef5f2);border:1px solid rgba(165,139,101,.35);box-shadow:inset 0 1px rgba(255,255,255,.82),0 12px 24px rgba(43,67,82,.14);isolation:isolate}
.ending-home-frame{position:absolute;inset:-8% -5% -12%;width:110%;height:120%;border:0;pointer-events:none;z-index:1}
.ending-living-routes{position:absolute;inset:0;z-index:3;pointer-events:none;overflow:hidden}
.ending-living-routes i{position:absolute;height:4px;border-radius:999px;background:linear-gradient(90deg,transparent,rgba(93,180,239,.92) 18%,#fff0a2 50%,rgba(93,180,239,.92) 82%,transparent);box-shadow:0 0 10px rgba(85,170,232,.58);transform-origin:left center;animation:endingPass4Route 3.1s ease-in-out infinite}
.ending-living-routes .route-a{width:178px;left:-26px;top:65%;rotate:-10deg}.ending-living-routes .route-b{width:184px;right:-38px;top:58%;rotate:11deg;animation-delay:-1.2s}.ending-living-routes .route-c{width:150px;left:37%;top:24%;rotate:-3deg;animation-delay:-2.1s}
.ending-parcel{position:absolute;left:10%;top:58%;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#fff7da;border:1px solid rgba(155,119,66,.34);box-shadow:0 5px 12px rgba(40,70,90,.16);font-style:normal;animation:endingPass4Parcel 5.2s ease-in-out infinite}
.ending-porch-light{position:absolute;right:12%;top:45%;width:14px;height:14px;border-radius:50%;background:#ffe87e;box-shadow:0 0 0 5px rgba(255,232,126,.15),0 0 22px rgba(255,218,84,.8);animation:endingPass4Porch 3s ease-in-out infinite}
.ending-actions{display:grid;gap:10px;justify-items:center}.ending-actions .primary-btn{min-height:64px;font-size:24px}.ending-actions .secondary-btn{min-height:48px;width:min(78%,320px);padding:8px 12px}
@keyframes endingPass4Route{0%,100%{opacity:.45;filter:saturate(.85)}50%{opacity:1;filter:saturate(1.25)}}
@keyframes endingPass4Parcel{0%,15%{translate:-28px 8px;opacity:0}28%{opacity:1}72%{translate:210px -34px;opacity:1}86%,100%{translate:235px -42px;opacity:0}}
@keyframes endingPass4Porch{0%,45%{opacity:.3;scale:.8}58%,100%{opacity:1;scale:1}}
@media(max-height:640px){.ending-homecoming{height:230px}.ending-hero-pass4{padding-top:13px}.ending-actions .primary-btn{min-height:56px;font-size:21px}.ending-actions{gap:7px}.ending-hero-pass4>p:not(.ending-note){font-size:13px}}
@media(prefers-reduced-motion:reduce){.ending-living-routes i,.ending-parcel,.ending-porch-light{animation:none!important}.ending-parcel{translate:125px -20px;opacity:1}.ending-porch-light{opacity:1;scale:1}}
'''
ui_path.write_text(ui, encoding='utf-8')

# Static invariants for the patcher itself.
assert cin.count("label:'") == 25, f'expected 25 beats, found {cin.count("label:")}'
assert 'activeLine' in cin and 'renderTurn' in cin
assert 'cin-helper-story' not in cin
assert 'ending-resolution' not in index
assert index.index('id="completeHome"') < index.index('id="completeLevels"')
assert 'ASTRA_AUDIT_ACCEPTANCE_MATRIX.md' in (root / 'DEVELOPMENT_HANDOFF.md').read_text(encoding='utf-8')
print('Astra Pass 4 candidate patch applied.')
