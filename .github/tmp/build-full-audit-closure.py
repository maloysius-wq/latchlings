from pathlib import Path
import re

ROOT=Path('.')

def read(path): return (ROOT/path).read_text(encoding='utf-8')
def write(path,text): (ROOT/path).write_text(text,encoding='utf-8')
def replace_once(text,old,new,label):
    count=text.count(old)
    if count!=1: raise SystemExit(f'{label}: expected 1 exact match, found {count}')
    return text.replace(old,new,1)
def sub_once(text,pattern,repl,label,flags=re.S):
    out,n=re.subn(pattern,repl,text,count=1,flags=flags)
    if n!=1: raise SystemExit(f'{label}: expected 1 regex match, found {n}')
    return out

def append_once(text,marker,block):
    if marker in text: return text
    return text.rstrip()+"\n\n"+block.strip()+"\n"

# 1) Canonical cast identity is owned by story400.js and shared by presentation layers.
story=read('story400.js')
story=replace_once(story,'\nconst CHAPTERS=[','\nwindow.LATCHLINGS_CAST=CAST;\nconst CHAPTERS=[','story cast export')
write('story400.js',story)

# 2) Consolidate cinematic JS helpers into cinematics400.js and restage every beat around visible action/evidence.
cin=read('cinematics400.js')
cin=sub_once(cin,r"const CAST=\{.*?\};\nconst CINEMATICS=",'''const STORY_CAST=window.LATCHLINGS_CAST||window.LATCHLINGS_STORY?.cast||[];
const CIN_PALETTE={coral:['#ef5f66','#ff9297','#c33d49'],blue:['#4c8ff4','#79aff9','#2e69c8'],mint:['#66bd72','#94dc98','#469852'],gold:['#f6b737','#ffd06a','#d18c16'],lavender:['#9a72df','#c3a0f1','#724fbd']};
const DEFAULT_EXPR={Pippa:'curious',Bramble:'smug',Rowan:'happy',Pip:'determined',Tansy:'surprised'};
const CAST=Object.fromEntries(STORY_CAST.map(c=>{const p=CIN_PALETTE[c.color]||CIN_PALETTE.blue;return [c.name,{color:p[0],light:p[1],dark:p[2],suit:c.suit,expr:DEFAULT_EXPR[c.name]||'happy',role:c.shortRole||c.role,child:c.name==='Pip'||c.name==='Tansy'}]}));
const CINEMATICS=''','cinematic cast consolidation')

# Unique visual identifiers let the renderer stage each of all 25 beats deliberately.
visual_replacements={
"{label:'The Latchlands Move',visual:'archipelago'":"{label:'The Latchlands Move',visual:'opening-delivery'",
"{label:'Meet Little Home',visual:'little-home'":"{label:'Meet Little Home',visual:'opening-chores'",
"{label:'The Same Miss',visual:'morning'":"{label:'The Same Miss',visual:'opening-misses'",
"{label:'What the Skyway Does',visual:'skyway'":"{label:'What the Skyway Does',visual:'opening-flex'",
"{label:'A Waykeeper Answers',visual:'waykeeper'":"{label:'A Waykeeper Answers',visual:'opening-call',actionLabel:'Answer the call'",
"{label:'Everyone Knows a Piece',visual:'helper-crew'":"{label:'Everyone Knows a Piece',visual:'opening-neighbors'",
"{label:'How You See a Route',visual:'snap-demo'":"{label:'How You See a Route',visual:'opening-demo',actionLabel:'Try the route'",
"{label:'Start With Sunpetal',visual:'morning'":"{label:'Start With Sunpetal',visual:'opening-level1',actionLabel:'Begin Level 1'",
"{label:'The View From Prism Gardens',visual:'prism-view'":"{label:'The View From Prism Gardens',visual:'prism-horizon'",
"{label:'A Familiar Porch',visual:'porch'":"{label:'A Familiar Porch',visual:'porch'",
"{label:'Not One Bad Route',visual:'network-miss'":"{label:'Not One Bad Route',visual:'drift-endpoints'",
"{label:'Yesterday’s Map',visual:'map-mismatch'":"{label:'Yesterday’s Map',visual:'alignment-mismatch'",
"{label:'New Coordinates',visual:'new-route'":"{label:'New Coordinates',visual:'porch-route-payoff'",
"{label:'The Contradictory Drawer',visual:'map-drawer'":"{label:'The Contradictory Drawer',visual:'drawer-discovery'",
"{label:'Look at the Dates',visual:'dated-maps'":"{label:'Look at the Dates',visual:'dated-landmarks'",
"{label:'They Were All Correct',visual:'map-sequence'":"{label:'They Were All Correct',visual:'map-time-sequence'",
"{label:'What Was Forgotten',visual:'automation'":"{label:'What Was Forgotten',visual:'tended-to-automated'",
"{label:'The Real Problem',visual:'frozen-network'":"{label:'The Real Problem',visual:'living-vs-frozen'",
"{label:'Make a New One',visual:'brand-new-route'":"{label:'Make a New One',visual:'copper-route-payoff'",
"{label:'Signals From Everywhere',visual:'signals'":"{label:'Signals From Everywhere',visual:'community-signals'",
"{label:'Everyone Has a Part',visual:'keepsakes'":"{label:'Everyone Has a Part',visual:'people-tasks'",
"{label:'A Living Network',visual:'living-network'":"{label:'A Living Network',visual:'response-chain'",
"{label:'No Perfect Route',visual:'many-routes'":"{label:'No Perfect Route',visual:'routes-in-time'",
"{label:'Aurora Crown',visual:'aurora-crown'":"{label:'Aurora Crown',visual:'crown-meeting'",
"{label:'Homeward',visual:'homeward-network'":"{label:'Homeward',visual:'ordinary-home-pullback'",
}
for old,new in visual_replacements.items():
    if old not in cin: raise SystemExit('missing cinematic beat visual: '+old)
    cin=cin.replace(old,new,1)

# Character helper accepts beat-specific expressions while retaining canonical identity.
cin=replace_once(cin,"function character(name,extra=''){const c=CAST[name];if(!c)return'';return `<span class=\"cin-character ${c.child?'child':''} ${extra} expr-${c.expr}\" data-character=\"${name}\" style=\"--cin-color:${c.color};--cin-light:${c.light};--cin-dark:${c.dark}\"><span class=\"cin-suit\">${suitSvg(c.suit)}</span><span class=\"cin-face\"><span class=\"cin-eyes\"><i></i><i></i></span><i class=\"cin-mouth\"></i></span></span>`}","function character(name,extra='',expr=''){const c=CAST[name];if(!c)return'';return `<span class=\"cin-character ${c.child?'child':''} ${extra} expr-${expr||c.expr||'happy'}\" data-character=\"${name}\" style=\"--cin-color:${c.color};--cin-light:${c.light};--cin-dark:${c.dark}\"><span class=\"cin-suit\">${suitSvg(c.suit)}</span><span class=\"cin-face\"><span class=\"cin-eyes\"><i></i><i></i></span><i class=\"cin-mouth\"></i></span></span>`}",'cinematic expression helper')

new_visual_helpers=r'''
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
'''
cin=replace_once(cin,'function visualHtml(type){',new_visual_helpers+'\nfunction visualHtml(type){','insert scenic helpers')

cin=sub_once(cin,r"function visualHtml\(type\)\{.*?\n return islandsHtml\(\);\n\}",r'''function visualHtml(type){
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
}''','replace visual renderer')

# Stage evidence gets a textual equivalent and actions can be interactive without text covering it.
cin=replace_once(cin,'<div class="cinematic-stage" id="cinematicStage" aria-hidden="true"></div>','<div class="cinematic-stage" id="cinematicStage" role="img" aria-label=""></div>','cinematic stage accessibility')
old_render="function render(){const c=CINEMATICS[activeId],b=c&&c.beats[activeIndex];if(!c||!b)return;const o=ensureOverlay();o.dataset.cinematic=activeId;o.dataset.visual=b.visual;document.getElementById('cinematicChapter').textContent=c.chapter;document.getElementById('cinematicTitle').textContent=c.title;document.getElementById('cinematicBeat').textContent=b.label;document.getElementById('cinematicCounter').textContent=`${activeIndex+1} / ${c.beats.length}`;document.getElementById('cinematicStage').innerHTML=visualHtml(b.visual);document.getElementById('cinematicLines').innerHTML=b.lines.map(([speaker,text])=>`<p class=\"${speaker==='Narrator'?'narrator':'dialogue'}\"><strong>${escapeHtml(speaker)}</strong><span>${escapeHtml(text)}</span></p>`).join('');document.getElementById('cinematicProgress').innerHTML=c.beats.map((_,i)=>`<i class=\"${i===activeIndex?'active':i<activeIndex?'done':''}\"></i>`).join('');const nextBtn=document.getElementById('cinematicNext');nextBtn.textContent=activeIndex===c.beats.length-1?c.finalLabel:'Continue';const copy=document.querySelector('.cinematic-copy');if(copy)copy.scrollTop=0;requestAnimationFrame(()=>o.classList.add('beat-ready'))}"
new_render="function render(){const c=CINEMATICS[activeId],b=c&&c.beats[activeIndex];if(!c||!b)return;const o=ensureOverlay();o.dataset.cinematic=activeId;o.dataset.visual=b.visual;document.getElementById('cinematicChapter').textContent=c.chapter;document.getElementById('cinematicTitle').textContent=c.title;document.getElementById('cinematicBeat').textContent=b.label;document.getElementById('cinematicCounter').textContent=`${activeIndex+1} / ${c.beats.length}`;const stage=document.getElementById('cinematicStage');stage.innerHTML=visualHtml(b.visual);stage.setAttribute('aria-label',VISUAL_DESCRIPTIONS[b.visual]||b.label);document.getElementById('cinematicLines').innerHTML=b.lines.map(([speaker,text])=>`<p class=\"${speaker==='Narrator'?'narrator':'dialogue'}\"><strong>${escapeHtml(speaker)}</strong><span>${escapeHtml(text)}</span></p>`).join('');document.getElementById('cinematicProgress').innerHTML=c.beats.map((_,i)=>`<i class=\"${i===activeIndex?'active':i<activeIndex?'done':''}\"></i>`).join('');const nextBtn=document.getElementById('cinematicNext');nextBtn.textContent=b.actionLabel||(activeIndex===c.beats.length-1?c.finalLabel:'Continue');wireDemo(stage);const copy=document.querySelector('.cinematic-copy');if(copy)copy.scrollTop=0;requestAnimationFrame(()=>o.classList.add('beat-ready'))}"
cin=replace_once(cin,old_render,new_render,'cinematic render action/a11y')
cin=replace_once(cin,'function show(id,opts={}){','function wireDemo(stage){const controls=stage?.querySelector(\'.cin-demo-controls\');if(!controls)return;const status=controls.querySelector(\'.cin-demo-status\');controls.querySelectorAll(\'button[data-demo-step]\').forEach(btn=>btn.onclick=()=>{const step=Number(btn.dataset.demoStep)||1;controls.dataset.step=String(step);controls.querySelectorAll(\'button\').forEach(b=>b.setAttribute(\'aria-pressed\',String(b===btn)));if(status)status.textContent=step===1?\'Blue helper selected. Now move right.\':\'Stopped by the helper, then safely into the matching nest.\';stage.dataset.demoStep=String(step)})}\nfunction show(id,opts={}){','interactive demo wiring')

# Merge dialogue + geometry runtimes into the single cinematic runtime, deriving cast identity from STORY.
dialogue=read('cinematic-dialogue400.js')
dialogue=sub_once(dialogue,r"const CAST=\{.*?\};\nfunction escapeHtml",'''const STORY_CAST=window.LATCHLINGS_CAST||window.LATCHLINGS_STORY?.cast||[];
const PALETTE={coral:['#ef5f66','#ff9297','#c33d49'],blue:['#4c8ff4','#79aff9','#2e69c8'],mint:['#66bd72','#94dc98','#469852'],gold:['#f6b737','#ffd06a','#d18c16'],lavender:['#9a72df','#c3a0f1','#724fbd']};
const EXPR={Pippa:'curious',Bramble:'smug',Rowan:'happy',Pip:'determined',Tansy:'surprised'};
const CAST=Object.fromEntries(STORY_CAST.map(c=>{const p=PALETTE[c.color]||PALETTE.blue;return [c.name,{color:p[0],light:p[1],dark:p[2],suit:c.suit,expr:EXPR[c.name]||'happy',role:c.shortRole||c.role,child:c.name==='Pip'||c.name==='Tansy'}]}));
function escapeHtml''','dialogue cast consolidation')
geometry=read('cinematic-geometry400.js')
geometry=geometry.replace("const API=window.LatchlingsCinematics;if(!API)return;","const API=window.LatchlingsCinematics;if(!API)return;\nconst reducedMotion=()=>window.LatchlingsPrefs?.reducedMotion?.()||!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);",1)
geometry=geometry.replace("if(brightGeom)layoutCargo(stage,brightGeom,(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)?cargoEpoch+2200:time);\n raf=requestAnimationFrame(tick);","if(brightGeom)layoutCargo(stage,brightGeom,reducedMotion()?cargoEpoch+2200:time);\n if(!reducedMotion())raf=requestAnimationFrame(tick);",1)
cin=cin.rstrip()+"\n\n/* Consolidated ordered-dialogue runtime */\n"+dialogue.strip()+"\n\n/* Consolidated cinematic geometry runtime */\n"+geometry.strip()+"\n"
write('cinematics400.js',cin)

# 3) Merge all cinematic CSS layers into one file and add the final directorial/accessibility layer.
base=read('style400-cinematics.css')
for extra in ['style400-cinematics-polish.css','style400-cinematics-refine.css','style400-cinematics-refine2.css','style400-cinematics-dialogue.css','style400-cinematics-geometry.css']:
    base += f"\n\n/* Consolidated from {extra} */\n"+read(extra).strip()+"\n"
full_cin_css=r'''
/* Full Astra audit closure: scenic direction, persistent evidence, responsive finish */
.cinematic-shell{grid-template-rows:auto minmax(210px,38vh) minmax(0,1fr) auto}
.cinematic-stage{min-height:0}.cinematic-footer{position:relative;z-index:40;background:rgba(255,249,238,.96);border-top:1px solid rgba(177,149,109,.34);padding:8px 14px max(10px,env(safe-area-inset-bottom));box-shadow:0 -9px 18px rgba(36,54,70,.06)}
.cinematic-skip{min-width:44px;min-height:44px}.cinematic-next{min-height:48px}.cinematic-progress{margin:0 0 8px}.cinematic-stage[role="img"]{outline:0}
.cin-action-label{position:absolute;z-index:18;left:50%;bottom:12px;translate:-50% 0;padding:6px 10px;border-radius:999px;background:rgba(255,249,232,.94);border:1px solid rgba(50,83,106,.24);box-shadow:0 5px 12px rgba(35,58,72,.13);color:#244d70;font-size:10px;font-weight:950;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap}
.cin-chore-marks,.cin-community-tasks{position:absolute;inset:0;z-index:15;pointer-events:none}.cin-chore-marks i,.cin-community-tasks i{position:absolute;padding:4px 7px;border-radius:999px;background:#fff7dc;border:1px solid rgba(55,83,102,.2);box-shadow:0 4px 8px rgba(35,58,72,.13);color:#315b77;font-size:9px;font-style:normal;font-weight:900;text-transform:uppercase}.cin-chore-marks .garden{left:14%;top:58%}.cin-chore-marks .parcel{right:14%;top:48%}.cin-chore-marks .tree{left:23%;top:28%}.cin-chore-marks .play{right:29%;bottom:12%}
.cin-miss-evidence{position:absolute;inset:0;z-index:16;pointer-events:none}.cin-miss-evidence i{position:absolute;width:34px;height:24px;border-radius:7px;background:#f1d39c;border:2px solid #835d3d;display:grid;place-items:center;color:#5a452f;font-size:8px;font-style:normal;font-weight:900}.cin-miss-evidence .basket{left:14%;top:53%}.cin-miss-evidence .water{left:42%;top:61%;background:#9bd5e9}.cin-miss-evidence .mail{right:13%;top:47%;background:#f5e7cb}.cin-miss-evidence .old-stop{position:absolute;width:15px;height:15px;border:2px dashed #c65353;border-radius:50%}.cin-miss-evidence .s1{left:27%;top:48%}.cin-miss-evidence .s2{left:55%;top:56%}.cin-miss-evidence .s3{right:4%;top:42%}.cin-miss-evidence b{position:absolute;left:50%;top:35%;translate:-50% 0;color:#a53e49;font-size:10px;text-transform:uppercase;background:rgba(255,250,239,.9);padding:4px 8px;border-radius:999px}
.cin-flex-courier{position:absolute;z-index:17;left:20%;top:29%;animation:cinAuditCourier 3.1s ease-in-out infinite}.cin-flex-courier .cin-character{position:relative}.cin-call-signal{position:absolute;z-index:14;left:17%;bottom:20%;width:80px;height:80px;border-radius:50%;border:2px solid rgba(91,188,225,.7);box-shadow:0 0 0 12px rgba(101,194,228,.12),0 0 22px rgba(95,184,225,.4);display:grid;place-items:center}.cin-call-signal i{width:6px;height:54px;background:linear-gradient(#fff7b2,#56bde3);border-radius:99px}.cin-call-signal b{position:absolute;bottom:-18px;width:110px;text-align:center;font-size:8px;color:#315d78}.cin-neighbor-crew{position:absolute;z-index:16;right:8%;bottom:16%;display:flex;gap:4px}.cin-neighbor-crew .cin-character{position:relative;animation:none}.cin-demo-controls{position:absolute;z-index:30;right:8px;bottom:7px;display:grid;gap:4px;max-width:142px}.cin-demo-controls button{min-height:34px;border:1px solid #a67d4c;border-radius:9px;background:#fff7df;color:#234e72;font-size:9px;font-weight:900}.cin-demo-controls button[aria-pressed="true"]{background:#214f7f;color:#fff}.cin-demo-status{padding:4px 6px;border-radius:8px;background:rgba(255,255,255,.92);font-size:8px;line-height:1.2;color:#405d70}
.cin-distance-line,.cin-endpoint-measure{position:absolute;z-index:15;left:16%;right:14%;top:51%;height:2px;background:repeating-linear-gradient(90deg,#ce5e59 0 6px,transparent 6px 11px);color:#6c4c43}.cin-distance-line b{position:absolute;top:-20px;font-size:9px;text-transform:uppercase}.cin-distance-line b:first-child{left:0}.cin-distance-line b:last-child{right:0}.cin-endpoint-measure b{position:absolute;left:50%;top:-20px;translate:-50% 0;font-size:9px;background:#fff5dd;padding:3px 7px;border-radius:999px}.cin-porch-route-payoff{position:absolute;z-index:16;left:27%;right:14%;top:47%;height:4px;background:linear-gradient(90deg,#7cdbd1,#fff2a5,#74a7ef);box-shadow:0 0 10px rgba(96,196,218,.65);rotate:-7deg}.cin-porch-route-payoff b{position:absolute;right:0;top:-22px;font-size:8px;color:#315d78;background:#fff7df;padding:3px 6px;border-radius:999px}
.cin-map-landmark-key,.cin-time-arrow,.cin-tender-shift{position:absolute;z-index:18;left:50%;translate:-50% 0;bottom:9px;padding:5px 8px;border-radius:999px;background:rgba(255,248,226,.95);border:1px solid rgba(111,80,47,.3);color:#5a4935;font-size:8px;font-weight:900;white-space:nowrap}.cin-tender-shift{display:flex;gap:12px}.cin-tender-shift .attended{color:#437b57}.cin-tender-shift .unattended{color:#9b4e4e}.cin-frozen-lines.compare b{position:absolute;left:50%;top:42%;translate:-50% 0;font-size:9px;background:#fff0de;padding:4px 7px;border-radius:999px;color:#9b4e4e}
.cin-community-tasks i:nth-child(1){left:10%;top:24%}.cin-community-tasks i:nth-child(2){left:37%;top:15%}.cin-community-tasks i:nth-child(3){right:18%;top:38%}.cin-community-tasks i:nth-child(4){left:46%;bottom:14%}.cin-working-cast .cin-character{z-index:19}.cin-working-cast .work-pippa{left:12%;bottom:19%}.cin-working-cast .work-bramble{left:43%;top:18%}.cin-working-cast .work-rowan{right:12%;top:43%}.cin-chain-steps{position:absolute;inset:0;z-index:18;pointer-events:none}.cin-chain-steps i{position:absolute;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:#fff4b2;color:#214f7f;font-style:normal;font-weight:950;box-shadow:0 0 12px rgba(255,220,93,.5)}.cin-chain-steps i:nth-child(1){left:9%;top:23%}.cin-chain-steps i:nth-child(2){left:37%;top:18%}.cin-chain-steps i:nth-child(3){right:23%;top:35%}.cin-chain-steps i:nth-child(4){right:14%;bottom:16%}.cin-route-options b{position:absolute;font-size:8px;background:#fff7df;color:#315d78;padding:3px 6px;border-radius:999px}.cin-route-options b:nth-of-type(1){left:22%;top:20%}.cin-route-options b:nth-of-type(2){right:18%;bottom:18%}.cin-crown-through-lines{position:absolute;inset:0;z-index:16;pointer-events:none}.cin-crown-through-lines i{position:absolute;left:20%;right:8%;top:49%;height:3px;background:linear-gradient(90deg,transparent,#80e3d4,#fff4b8,#ad8bef,transparent);box-shadow:0 0 9px rgba(139,223,231,.58);transform-origin:center}.cin-crown-through-lines i:nth-child(1){rotate:9deg}.cin-crown-through-lines i:nth-child(2){rotate:-12deg}.cin-crown-through-lines i:nth-child(3){rotate:24deg}.cin-crown-through-lines b{position:absolute;right:6%;top:20%;font-size:8px;background:#eefcff;color:#315d78;padding:4px 7px;border-radius:999px}.ordinary-life .cin-chore-marks{z-index:22}
@keyframes cinAuditCourier{0%,100%{translate:0 0}50%{translate:180px 25px}}
@media(max-width:360px),(max-height:620px){.cinematic-shell{height:calc(100svh - 10px);max-height:calc(100svh - 10px);grid-template-rows:auto minmax(150px,31vh) minmax(0,1fr) auto;border-radius:20px}.cinematic-copy{padding:8px 12px}.cinematic-copy h2{font-size:21px}.cinematic-copy h3{margin-bottom:5px}.cinematic-footer{padding:6px 10px max(7px,env(safe-area-inset-bottom))}.cinematic-skip{font-size:11px}.cin-demo-controls{max-width:120px}.cin-action-label{bottom:7px}}
html[data-motion="reduced"] .cinematic-stage *,html[data-motion="reduced"] .cinematic-progress i{animation:none!important;transition:none!important}html[data-motion="reduced"] .cin-flex-courier{translate:90px 12px!important}
@media(prefers-reduced-motion:reduce){.cinematic-stage *,.cinematic-progress i{animation:none!important;transition:none!important}.cin-flex-courier{translate:90px 12px!important}}
'''
base=append_once(base,'Full Astra audit closure: scenic direction',full_cin_css)
write('style400-cinematics.css',base)
for extra in ['style400-cinematics-polish.css','style400-cinematics-refine.css','style400-cinematics-refine2.css','style400-cinematics-dialogue.css','style400-cinematics-geometry.css','cinematic-dialogue400.js','cinematic-geometry400.js']:
    p=ROOT/extra
    if p.exists(): p.unlink()

# 4) Canonical Little Home: contextual CTA, revisitable keepsake memories, visible domestic actions, ending mode.
home=read('title-island-concepts/index.html')
home=home.replace('<button class="play">Play<svg','<button class="play"><span class="play-main">Play</span><small class="play-context">Continue your journey</small><svg')
home_css=r'''
/* Full audit closure: purposeful Little Home actions + revisitable keepsakes */
#c2 .play{display:grid;grid-template-columns:1fr auto;grid-template-rows:auto auto;align-items:center;text-align:left;column-gap:9px;padding-left:20px}#c2 .play .play-main{font-size:18px;font-weight:950;line-height:1.05}#c2 .play .play-context{grid-column:1;font-size:10px;line-height:1.2;font-weight:800;opacity:.72}#c2 .play svg{grid-column:2;grid-row:1/3}
#c2 .story-keepsake[role="button"]{cursor:pointer;pointer-events:auto;outline:none}#c2 .story-keepsake[role="button"]:focus-visible{filter:drop-shadow(0 0 5px #fff) drop-shadow(0 0 9px #2f6ea3);outline:3px solid #fff7d2;outline-offset:4px}
#c2 .resident-action-label{position:absolute;z-index:28;left:50%;bottom:15px;translate:-50% 0;max-width:220px;padding:6px 10px;border-radius:999px;background:rgba(255,249,232,.95);border:1px solid rgba(46,78,99,.22);box-shadow:0 5px 12px rgba(37,57,72,.14);color:#31546f;font-size:10px;font-weight:900;text-align:center;opacity:0;transition:opacity .16s ease,translate .16s ease;pointer-events:none}#c2[data-home-action] .resident-action-label{opacity:1;translate:-50% -3px}
#c2 .resident[data-action="water"]{filter:drop-shadow(0 0 5px rgba(91,185,221,.7))}#c2 .resident[data-action="deliver"]{filter:drop-shadow(0 0 5px rgba(229,179,78,.75))}#c2 .resident[data-action="inspect"]{filter:drop-shadow(0 0 5px rgba(101,181,98,.72))}
body.ending-embed #c2 .topline,body.ending-embed #c2 .brand,body.ending-embed #c2 .play,body.ending-embed #c2 .secondary{display:none!important}body.ending-embed #c2 .scene{top:32px!important;height:760px;scale:1.08;transform-origin:50% 35%}body.ending-embed #c2 .story-distant-islands{display:block!important;opacity:1!important}body.ending-embed #c2 .phone{border-radius:0;box-shadow:none}body.ending-embed #c2 .resident-action-label{bottom:72px}
html[data-motion="reduced"] #c2 .resident-action-label{transition:none!important}
'''
home=home.replace('</style>','\n'+home_css+'\n</style>',1)
home=replace_once(home,"const LITTLE_HOME_ADULT_STEP_MIN=750;",'''const LITTLE_HOME_ADULT_STEP_MIN=750;
const LITTLE_HOME_ACTIONS={garden:{action:'water',label:'Pippa waters the garden.'},parcel:{action:'deliver',label:'Bramble delivers the morning parcel.'},tree:{action:'inspect',label:'Rowan checks the tree and island edge.'}};
const LITTLE_HOME_MEMORY={mailbox:'Sunpetal · the mailbox remembers the first shared route reports.',pennant:'Lanternwood · the pennant remembers neighbors becoming part of one another’s routes.',anchor:'Lodestone · the anchor remembers reliable stops in a moving world.',bunting:'Masquerade · the bunting remembers a market that kept moving.',telescope:'Prism · the telescope remembers the moment the wider drift came into view.',relic:'Copperline · the compass remembers that every old map was temporary.',dock:'Stormswitch · the dock remembers communities answering one another.',skyway:'Aurora Crown · Little Home is one connected node among many.'};''','home action constants')
home=replace_once(home,"const runLittleHomeAdultMove=async()=>{",'''const performLittleHomeAdultAction=async adult=>{const spec=LITTLE_HOME_ACTIONS[adult?.dataset.activity];if(!spec||!littleHomeMotionAllowed())return;adult.dataset.action=spec.action;if(littleHomeRoot){littleHomeRoot.dataset.homeAction=adult.dataset.activity||'';const label=littleHomeRoot.querySelector('.resident-action-label');if(label)label.textContent=spec.label}await new Promise(r=>setTimeout(r,620));delete adult.dataset.action;if(littleHomeRoot)delete littleHomeRoot.dataset.homeAction};
const runLittleHomeAdultMove=async()=>{''','home action function')
home=home.replace("adult.dataset.moveCount=String(Number(adult.dataset.moveCount||0)+1);\n  }else{","adult.dataset.moveCount=String(Number(adult.dataset.moveCount||0)+1);\n    if(next===2||next===5)await performLittleHomeAdultAction(adult);\n  }else{",1)
home=replace_once(home,"function initProductionEmbed(){\n const params=new URLSearchParams(location.search);if(params.get('embed')!=='1')return;\n const cinematic=params.get('cinematic')==='1';",'''function initProductionEmbed(){
 const params=new URLSearchParams(location.search);if(params.get('embed')!=='1')return;
 const cinematic=params.get('cinematic')==='1',ending=params.get('ending')==='1';''','home ending params')
home=home.replace("document.body.classList.add('embed-mode');if(cinematic){document.documentElement.classList.add('cinematic-mode');document.body.classList.add('cinematic-mode')}show('c2');","document.body.classList.add('embed-mode');if(cinematic){document.documentElement.classList.add('cinematic-mode');document.body.classList.add('cinematic-mode')}if(ending)document.body.classList.add('ending-embed');show('c2');",1)
home=home.replace("const c2=document.getElementById('c2'),phone=c2.querySelector('.phone'),progress=c2.querySelector('.progress span');","const c2=document.getElementById('c2'),phone=c2.querySelector('.phone'),progress=c2.querySelector('.progress span'),play=c2.querySelector('.play');\n if(!c2.querySelector('.resident-action-label'))c2.querySelector('.island-model')?.insertAdjacentHTML('beforeend','<div class=\"resident-action-label\" aria-live=\"polite\"></div>');\n const memoryKeys=['mailbox','pennant','anchor','bunting','telescope','relic','dock'];const memoryEls=[...c2.querySelectorAll('.story-mailbox,.story-pennant,.story-anchor,.story-bunting,.story-telescope,.story-relic,.story-dock')];memoryEls.forEach((el,i)=>{const key=memoryKeys[i];if(!key)return;el.dataset.memory=key;el.setAttribute('role','button');el.setAttribute('tabindex','0');el.setAttribute('aria-label',`Revisit ${LITTLE_HOME_MEMORY[key]||key}`);const fire=()=>send('memory:'+key);el.addEventListener('click',fire);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fire()}})});",1)
home=home.replace("if(e.data.replay)restartLittleHomeTitle()});","if(play){const main=play.querySelector('.play-main'),ctx=play.querySelector('.play-context');if(main)main.textContent=e.data.playLabel||'Play';if(ctx)ctx.textContent=e.data.playContext||'Continue your journey';play.setAttribute('aria-label',`${e.data.playLabel||'Play'}. ${e.data.playContext||''}`.trim())}if(e.data.replay)restartLittleHomeTitle()});",1)
home=home.replace("parent.postMessage({source:'latchlings-home',action:'ready'},location.origin);","if(ending){for(let i=1;i<=8;i++)phone.classList.add('story-stage-'+i);phone.classList.add('story-focus-living-skyway');setTimeout(()=>{const adult=littleHomeAdults[1]||littleHomeAdults[0];if(adult){adult.dataset.action='deliver';c2.dataset.homeAction='parcel';const label=c2.querySelector('.resident-action-label');if(label)label.textContent='A visitor arrives while Little Home carries on.'}},350)}\n parent.postMessage({source:'latchlings-home',action:'ready'},location.origin);",1)
write('title-island-concepts/index.html',home)

# 5) Home context, Atlas semantics, audit-safe transitions and movement hierarchy.
ga=read('game400-a.js')
old_update="function updateHome(replay=false){const total=Object.values(progress.stars).reduce((a,b)=>a+(+b||0),0),legacy=document.getElementById('homeStars');if(legacy)legacy.textContent=total;const frame=document.getElementById('homeTitleFrame'),stage=STORY?STORY.completedChapters(progress):0,focus=homeRewardFocus;homeRewardFocus=null;if(frame&&frame.contentWindow)frame.contentWindow.postMessage({source:'latchlings-game',type:'home-state',stars:total,stage,replay:!!replay,motion:uiPrefs.motion,textSize:uiPrefs.textSize,focus},location.origin)}"
new_update="function updateHome(replay=false){const total=Object.values(progress.stars).reduce((a,b)=>a+(+b||0),0),legacy=document.getElementById('homeStars');if(legacy)legacy.textContent=total;const frame=document.getElementById('homeTitleFrame'),stage=STORY?STORY.completedChapters(progress):0,focus=homeRewardFocus;homeRewardFocus=null;const complete=!!progress.stars[400],next=Math.max(1,Math.min(400,progress.unlocked)),chapter=Math.ceil(next/50),local=(next-1)%50+1,playLabel=complete?'Return to the living Skyway':(progress.stars[next]?'Replay latest route':'Continue journey'),playContext=complete?'Aurora Crown · tomorrow’s route can change again':`${CHAPTERS[chapter-1].theme} · Level ${next} · ${ATLAS_WAYPOINTS[chapter-1][Math.floor((local-1)/10)]}`;if(frame&&frame.contentWindow)frame.contentWindow.postMessage({source:'latchlings-game',type:'home-state',stars:total,stage,replay:!!replay,motion:uiPrefs.motion,textSize:uiPrefs.textSize,focus,playLabel,playContext,nextLevel:next},location.origin)}"
ga=replace_once(ga,old_update,new_update,'contextual home cta')
ga=ga.replace("const reduced=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches),same=", "const reduced=effectiveReducedMotion(),same=",1)
write('game400-a.js',ga)

# 6) Gameplay feedback, journal structure, keepsake memory, discoverable star rules.
gb=read('game400-b.js')
gb=replace_once(gb,"events.push({type:'switch',step:path.length})","events.push({type:'switch',step:path.length,group:sw[2],opened:!!(localMask&(1<<sw[2]))})",'switch event causal data')
feedback_js=r'''
let routeFeedbackTimer=0;
function clearRouteFeedback(){clearTimeout(routeFeedbackTimer);document.querySelectorAll('#board .blocked-feedback,#board .causal-linked,#board .arrival-ack').forEach(el=>el.classList.remove('blocked-feedback','causal-linked','arrival-ack'));const note=document.getElementById('mechanicNote');if(note)delete note.dataset.feedback}
function blockedMoveInfo(pi,d){const lev=LEVELS[currentLevel-1],pos=positions[pi];if(!lev||!pos)return null;const [dr,dc]=DIRV[d],r=pos[0]+dr,c=pos[1]+dc,piece=lev.pieces[pi];if(r<0||c<0||r>=lev.size||c>=lev.size)return {reason:'edge',r:pos[0],c:pos[1],text:'The board edge stops this snap.'};if(findAt(lev.rocks,r,c))return {reason:'rock',r,c,text:'A rock blocks this direction.'};const other=positions.findIndex((p,i)=>i!==pi&&p&&p[0]===r&&p[1]===c);if(other>=0)return {reason:'piece',r,c,text:'Another Latchling is the stopping wall here.'};const door=findAt(lev.doors,r,c);if(door&&!(doorMask&(1<<door[2])))return {reason:'door',r,c,group:door[2],text:'This door is closed. Find its linked switch.'};const sg=findAt(lev.suitGates,r,c);if(sg&&sg[2]!==piece.suit)return {reason:'suit',r,c,text:`That gate needs the ${sg[2]} suit mark.`};const cg=findAt(lev.colorGates,r,c);if(cg&&cg[2]!==piece.color)return {reason:'color',r,c,text:`That gate needs a ${cg[2]} Latchling.`};const rail=findAt(lev.rails,r,c);if(rail&&rail[2]!==d)return {reason:'rail',r,c,text:`That rail only accepts movement ${rail[2]}.`};return null}
function showBlockedMove(pi,d){clearRouteFeedback();const info=blockedMoveInfo(pi,d),note=document.getElementById('mechanicNote');if(!info)return;if(note){note.dataset.feedback=info.reason;const copy=note.querySelector('.mechanic-chip-copy');if(copy){copy.dataset.routeCopy=copy.textContent;copy.textContent=info.text}}const cell=document.querySelector(`#board .cell[data-r="${info.r}"][data-c="${info.c}"]`);cell?.classList.add('blocked-feedback');if(info.group!==undefined){(LEVELS[currentLevel-1].switches||[]).filter(x=>x[2]===info.group).forEach(x=>document.querySelector(`#board .cell[data-r="${x[0]}"][data-c="${x[1]}"]`)?.classList.add('causal-linked'))}routeFeedbackTimer=setTimeout(()=>{if(note){const copy=note.querySelector('.mechanic-chip-copy');if(copy?.dataset.routeCopy){copy.textContent=copy.dataset.routeCopy;delete copy.dataset.routeCopy}}clearRouteFeedback()},1250)}
function showRouteCausality(res,lev,pi){clearRouteFeedback();if(res.capture){document.querySelector(`#board .nest[data-pi="${pi}"]`)?.classList.add('arrival-ack')}for(const ev of res.events||[]){if(ev.type!=='switch')continue;(lev.switches||[]).filter(x=>x[2]===ev.group).concat((lev.doors||[]).filter(x=>x[2]===ev.group)).forEach(x=>document.querySelector(`#board .cell[data-r="${x[0]}"][data-c="${x[1]}"]`)?.classList.add('causal-linked'));const note=document.getElementById('mechanicNote'),copy=note?.querySelector('.mechanic-chip-copy');if(copy){copy.dataset.routeCopy=copy.textContent;copy.textContent=ev.opened?'Switch opened its linked door.':'Switch closed its linked door.'}}routeFeedbackTimer=setTimeout(()=>{const copy=document.querySelector('#mechanicNote .mechanic-chip-copy');if(copy?.dataset.routeCopy){copy.textContent=copy.dataset.routeCopy;delete copy.dataset.routeCopy}clearRouteFeedback()},1050)}
'''
gb=replace_once(gb,'async function moveSelected(d){',feedback_js+'\nasync function moveSelected(d){','gameplay causal helpers')
gb=gb.replace("if(!res){if(window.LatchlingsSFX)window.LatchlingsSFX.invalidMove();shakeSelected();return}","if(!res){if(window.LatchlingsSFX)window.LatchlingsSFX.invalidMove();shakeSelected();showBlockedMove(selected,d);return}",1)
gb=gb.replace("renderGame(true);animating=false;if(positions.every(p=>!p)){","renderGame(true);showRouteCausality(res,lev,pi);animating=false;if(positions.every(p=>!p)){",1)
gb=gb.replace("Switches toggle linked doors.</span></div></div><div class=\"modal-actions\">","Switches toggle linked doors.</span></div><div class=\"legend-item legend-stars\"><span class=\"legend-icon\">★★★</span><span>Stars are based on moves: 3 stars at the Perfect route, 2 stars at Perfect + 1, and 1 star for finishing within the move limit.</span></div></div><div class=\"modal-actions\">",1)

memory_js=r'''
const HOME_MEMORIES={
 mailbox:['Sunpetal mailbox','Breakfast, watering, and mail were the first clues that yesterday’s routes no longer fit today’s island positions.'],
 pennant:['Lanternwood pennant','Neighbors learned that a dependable route sometimes works because somebody else is willing to be the stopping point.'],
 anchor:['Lodestone anchor','The old anchors were never meant to freeze the islands. They created reliable moments that crews could retune.'],
 bunting:['Masquerade bunting','The old suit-mark lanes kept a crowded market moving, and the records connected the Keep to older Skyway practice.'],
 telescope:['Prism telescope','The wider drift became visible here. A familiar twin-lantern porch was still home, just farther away.'],
 relic:['Copperline compass','The contradictory maps were all correct for their own moment. Waykeepers kept looking, measuring, and redrawing.'],
 dock:['Stormswitch dock','Communities began answering one another in time, turning separate repairs into a living network.'],
 skyway:['Living Skyway','Little Home is one connected node among many. Home is not the place that never moves; it is the place people keep finding a way back to.']
};
function showHomeMemory(key){const m=HOME_MEMORIES[key]||HOME_MEMORIES.skyway;modal(`<section class="home-memory-card"><span class="theme-kicker">Little Home memory</span><h2>${m[0]}</h2><p>${m[1]}</p><div class="modal-actions"><button class="primary-small" id="homeMemoryClose">Back to Little Home</button><button class="secondary-small" id="homeMemoryStory">Open Story & Residents</button></div></section>`);document.getElementById('homeMemoryClose').onclick=closeModal;document.getElementById('homeMemoryStory').onclick=()=>{closeModal();openStoryScreen()}}
function setStorySection(name='now'){const root=document.querySelector('.story-screen-card');if(!root)return;root.dataset.storySection=name;root.querySelectorAll('[data-story-section]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.storySection===name)));root.querySelectorAll('[data-story-panel]').forEach(p=>{p.hidden=p.dataset.storyPanel!==name})}
function bindStorySections(){document.querySelectorAll('.story-section-tab[data-story-section]').forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.onclick=()=>setStorySection(b.dataset.storySection)})}
'''
gb=replace_once(gb,'function storyResidentCard(x){',memory_js+'\nfunction storyResidentCard(x){','home memories / journal sections')
gb=gb.replace("function openStoryScreen(){screen('story');renderStoryScreen()}","function openStoryScreen(){screen('story');renderStoryScreen();bindStorySections();setStorySection('now')}",1)
gb=gb.replace("document.getElementById('settingsStory').onclick=storyModal;","document.getElementById('settingsStory').onclick=()=>{closeModal();openStoryScreen()};",1)
# Keep the 'What we know' summary short enough to be a summary, not a duplicate transcript.
gb=gb.replace("brief.known.length?brief.known.join(' '):'We have matching route failures, but their cause is still unknown.'","brief.known.length?brief.known.slice(-2).join(' '):'We have matching route failures, but their cause is still unknown.'",1)
# Parent action router gains memory actions while preserving existing routes.
gb=sub_once(gb,r"window\.LatchlingsHomeAction=action=>\{.*?\};const wireHomeFrame=",'''window.LatchlingsHomeAction=action=>{if(String(action).startsWith('memory:')){showHomeMemory(String(action).slice(7));return}if(action==='play')startLevel(progress.unlocked);if(action==='daily')startDailyPuzzle();if(action==='levels'){chapterView=Math.ceil(progress.unlocked/50);rangeView=Math.floor(((progress.unlocked-1)%50)/10);screen('levels');renderChapter()}if(action==='settings')settingsModal();if(action==='story')openStoryScreen()};const wireHomeFrame=''','home action router')
# Classify modal state so music can duck during menus.
gb=gb.replace("overlay.classList.toggle('home-overlay',overHome);overlay.classList.add('show')}","overlay.classList.toggle('home-overlay',overHome);overlay.classList.add('show');document.body.classList.add('modal-open')}",1)
gb=gb.replace("overlay.classList.remove('show','home-overlay');if(frame)frame.classList.remove('modal-suspended')}","overlay.classList.remove('show','home-overlay');document.body.classList.remove('modal-open');if(frame)frame.classList.remove('modal-suspended')}",1)
write('game400-b.js',gb)

# 7) Evolving rail dialogue instead of repeating one ten-level sentence.
rail=read('gameplay-story-rail400.js')
rail=sub_once(rail,r"const CAST=\{.*?\};\nconst SPEAKERS=",'''const PALETTE={coral:['#ef5f66','#ff9297','#c33d49'],blue:['#4c8ff4','#79aff9','#2e69c8'],mint:['#66bd72','#94dc98','#469852'],gold:['#f6b737','#ffd06a','#d18c16'],lavender:['#9a72df','#c3a0f1','#724fbd']};
const EXPR={Pippa:'curious',Bramble:'smug',Rowan:'happy',Pip:'determined',Tansy:'surprised'};
const CAST=Object.fromEntries((window.LATCHLINGS_CAST||STORY.cast||[]).map(c=>{const p=PALETTE[c.color]||PALETTE.blue;return [c.name,{color:p[0],light:p[1],dark:p[2],suit:c.suit,expr:EXPR[c.name]||'happy',child:c.name==='Pip'||c.name==='Tansy'}]}));
const SPEAKERS=''','rail cast consolidation')
progress_fn=r'''
const CHARACTER_TURNS={
 Pippa:['checks the plan','logs the next stop','compares today’s reports','marks the changed route','organizes another test','checks the safest option','updates the route notes','confirms the handoff','sets the final check','records what worked'],
 Bramble:['runs the first errand','tries the obvious shortcut','carries the next report','tests a detour','checks the busy crossing','tries the faster line','delivers the revised route','tests one last shortcut','brings back the result','calls the route usable'],
 Rowan:['measures the drift','checks the island edge','compares the old marker','watches the alignment','tests a stable stop','measures the new gap','checks the route again','confirms the island moved','watches the final approach','records the new position'],
 Pip:['spots the first clue','tests the bold route','finds the odd crossing','tries the tricky stop','calls out the mismatch','tests the narrow line','finds the useful blocker','takes the interesting route','spots the last snag','declares it solved'],
 Tansy:['notices who is waiting','checks the visit route','spots the human cost','follows the porch light','tests the shared stop','checks who can reach whom','notices a better handoff','keeps the visit possible','watches the last crossing','marks the route worth keeping']
};
function evolvingMovementLine(title,slot,speaker){const base=(MOVEMENT_RAIL_LINES[title]||'The route changes with the drift.').replace(/\.$/,'');const action=(CHARACTER_TURNS[speaker]||CHARACTER_TURNS.Pippa)[slot%10];return slot===0?base+'.':`${base}; ${speaker} ${action}.`}
'''
rail=replace_once(rail,'function escapeHtml(v){',progress_fn+'\nfunction escapeHtml(v){','rail progression helper')
rail=rail.replace("line=early?.line||MOVEMENT_RAIL_LINES[movement?.title]||movement?.setup||meta.context;","line=early?.line||evolvingMovementLine(movement?.title,slot,speaker)||movement?.setup||meta.context;",1)
write('gameplay-story-rail400.js',rail)

# 8) Story Card character contributions and stronger postcard-like focus.
st=read('story-theme400.js')
st=st.replace("const CHAR_EXPR={Pippa:'curious',Bramble:'smug',Rowan:'happy',Pip:'determined',Tansy:'surprised'};","const CHAR_EXPR={Pippa:'curious',Bramble:'smug',Rowan:'happy',Pip:'determined',Tansy:'surprised'};\nconst CHAR_CONTRIB={Pippa:'Keeps plans practical and turns observations into the next test.',Bramble:'Carries reports, tries routes, and makes distant neighbors feel close.',Rowan:'Reads the island itself and notices when the world has moved.',Pip:'Finds odd crossings and tests the route everyone else overlooks.',Tansy:'Notices what route changes mean for visits, routines, and people.'};",1)
st=st.replace("${c.contribution?`<small class=\"story-person-contribution\">${escapeHtml(c.contribution)}</small>`:''}","<small class=\"story-person-contribution\">${escapeHtml(c.contribution||CHAR_CONTRIB[c.name]||'')}</small>",1)
st=st.replace("return `<div class=\"story-scene-land\"></div>${props.map", "return `<div class=\"story-scene-postcard-stamp\">${escapeHtml(meta.location)}</div><div class=\"story-scene-land\"></div>${props.map",1)
write('story-theme400.js',st)

# 9) End screen and journal markup use canonical Little Home and explicit information hierarchy.
idx=read('index.html')
for href in ['style400-cinematics-polish.css','style400-cinematics-refine.css','style400-cinematics-refine2.css','style400-cinematics-dialogue.css','style400-cinematics-geometry.css']:
    idx=re.sub(rf'<link rel="stylesheet" href="{re.escape(href)}(?:\?[^\"]*)?">\n?','',idx)
for src in ['cinematic-dialogue400.js','cinematic-geometry400.js']:
    idx=re.sub(rf'<script src="{re.escape(src)}(?:\?[^\"]*)?"></script>\n?','',idx)
idx=re.sub(r'style400-cinematics\.css\?v=[^\"]+', 'style400-cinematics.css?v=20260914-auditfull-1',idx)
idx=re.sub(r'cinematics400\.js\?v=[^\"]+', 'cinematics400.js?v=20260914-auditfull-1',idx)
idx=re.sub(r'game400-a\.js\?v=[^\"]+', 'game400-a.js?v=20260914-auditfull-1',idx)
idx=re.sub(r'game400-b\.js\?v=[^\"]+', 'game400-b.js?v=20260914-auditfull-1',idx)
idx=re.sub(r'gameplay-story-rail400\.js\?v=[^\"]+', 'gameplay-story-rail400.js?v=20260914-auditfull-1',idx)
idx=re.sub(r'story400\.js\?v=[^\"]+', 'story400.js?v=20260914-auditfull-1',idx)
idx=re.sub(r'story-theme400\.js\?v=[^\"]+', 'story-theme400.js?v=20260914-auditfull-1',idx)
idx=idx.replace('title-island-concepts/?c=2&amp;embed=1&amp;v=20260913-audit-r1r5-1','title-island-concepts/?c=2&amp;embed=1&amp;v=20260914-auditfull-1',1)
new_story='''  <main id="story" class="screen story-screen" aria-label="Story and residents">
    <div class="topbar card story-topbar"><button class="iconbtn" id="storyBack" aria-label="Back"></button><div class="game-title" style="font-size:22px">Story &amp; Residents</div><div class="spacer"></div><button class="story-rules-btn" id="storyRules">Rules</button></div>
    <section class="story-screen-card card" data-story-section="now">
      <header class="story-now-summary" data-story-panel="now"><div class="theme-kicker">The Latchlands</div><h1>Little Home</h1><p id="storyPremise"></p><div id="storyBriefing"></div><div class="story-role-card" id="storyRole"></div><div class="story-current-chapter" id="storyChapter"></div></header>
      <nav class="story-section-tabs" aria-label="Story sections"><button class="story-section-tab" data-story-section="now" aria-selected="true">Now</button><button class="story-section-tab" data-story-section="residents">Residents</button><button class="story-section-tab" data-story-section="journey">Journey</button><button class="story-section-tab" data-story-section="films">Cinematics</button></nav>
      <section class="story-section-panel" data-story-panel="residents" hidden><h2>Residents</h2><p class="story-section-intro">Who lives at Little Home, what they notice, and how they help the Waykeeper.</p><div class="story-cast" id="storyCast"></div></section>
      <section class="story-section-panel" data-story-panel="journey" hidden><h2>Journey so far</h2><div class="story-journey" id="storyJourney"></div></section>
      <section class="story-section-panel" data-story-panel="films" hidden><h2>Story Cinematics</h2><p class="story-cinematic-intro">Replay the major story moments you have reached.</p><div class="cinematic-library" id="storyCinematics"></div></section>
    </section>
  </main>'''
idx=sub_once(idx,r'  <main id="story" class="screen story-screen".*?  </main>\n\n  <main id="game"',new_story+'\n\n  <main id="game"','journal markup')
new_complete='''  <main id="complete" class="screen ending-screen" aria-label="Campaign complete">
    <div class="ending-canonical-wrap">
      <iframe id="endingHomeFrame" class="ending-home-frame" src="title-island-concepts/?c=2&amp;embed=1&amp;ending=1&amp;v=20260914-auditfull-1" title="Little Home after the Skyway restoration" scrolling="no"></iframe>
      <section class="ending-resolution-card card" aria-labelledby="endingTitle">
        <div class="ending-kicker">Level 400 · Homeward</div><h1 id="endingTitle">The Skyway lives because people keep tending it.</h1>
        <p>Little Home has not stopped moving. Neither has anyone else. The difference is that the routes move with them now.</p>
        <div class="ending-ordinary-list" aria-label="Ordinary life after the restoration"><span>Watering gets done.</span><span>A visitor arrives.</span><span>Pip still chooses the interesting route.</span></div>
        <p class="ending-note"><strong>No master switch. No final map.</strong> Home is the place you keep finding a way back to.</p>
        <div class="ending-actions"><button class="primary-btn" id="completeHome">Return to Little Home</button><button class="secondary-btn" id="completeLevels">View the living Skyway</button></div>
      </section>
    </div>
  </main>'''
idx=sub_once(idx,r'  <main id="complete" class="screen" aria-label="Campaign complete">.*?  </main>\n</div>',new_complete+'\n</div>','canonical ending markup')
write('index.html',idx)

# 10) Trim Level 400 reward so it leads into, rather than repeats, the ending.
p8=read('pass3-chapter8-aurora.js')
p8=p8.replace("Aurora Crown is connected, but it is not a master switch and this is not a final map. Old routes and brand-new routes now belong to the same living Skyway, tended by communities that keep watching the drift, sharing what changes, and making tomorrow's route fit tomorrow.","Old and new routes meet at Aurora Crown and keep going. The living Skyway is ready for tomorrow’s drift.",1)
p8=p8.replace('See the living Skyway','Finish the journey',1)
write('pass3-chapter8-aurora.js',p8)

# 11) Atlas, gameplay, story, ending, touch/focus/safe-area polish in existing canonical stylesheets.
atlas=read('style400-skyway-atlas.css')
atlas_css=r'''
/* Full audit closure: stronger Atlas hierarchy and state language */
.atlas-chapter-head{position:relative;z-index:8}.atlas-waypoint-nav{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;scroll-snap-type:x proximity;padding-bottom:3px}.atlas-waypoint-tab{min-width:92px;min-height:44px;scroll-snap-align:start;white-space:normal}.atlas-waypoint-tab b{display:block;overflow:visible;text-overflow:clip;white-space:normal;line-height:1.05}.atlas-region-dot{position:relative;min-width:44px;min-height:44px;background:transparent!important}.atlas-region-dot:before{content:"";position:absolute;left:50%;top:50%;width:10px;height:10px;border-radius:50%;translate:-50% -50%;background:#a9b5c0;border:2px solid rgba(255,255,255,.8);box-shadow:0 2px 5px rgba(27,51,70,.14)}.atlas-region-dot.active:before{width:18px;height:18px;background:var(--themeAccent);box-shadow:0 0 0 5px color-mix(in srgb,var(--themeAccent) 17%,transparent)}
.atlas-node:not(.locked):not(.done):not(.current) .atlas-island{filter:saturate(.92);box-shadow:0 0 0 2px rgba(255,255,255,.5),0 7px 12px rgba(29,54,73,.14)}.atlas-node.done .atlas-island{filter:saturate(.82) brightness(.98)}.atlas-node.done .atlas-island:after{content:"✓";position:absolute;right:-5px;top:-8px;width:18px;height:18px;border-radius:50%;display:grid;place-items:center;background:#659b67;color:#fff;font-size:10px;font-weight:950;box-shadow:0 2px 5px rgba(28,53,66,.18)}.atlas-node.current .atlas-island{filter:saturate(1.12);box-shadow:0 0 0 3px #fff7c6,0 0 0 7px color-mix(in srgb,var(--themeAccent) 44%,transparent),0 8px 16px rgba(29,54,73,.18)}.atlas-node.locked .atlas-island{filter:grayscale(.78) brightness(.85);opacity:.54}.atlas-node.milestone .atlas-prop{scale:1.18;filter:drop-shadow(0 4px 4px rgba(30,50,65,.18))}.atlas-node.done.milestone .atlas-prop{filter:drop-shadow(0 0 7px color-mix(in srgb,var(--themeAccent) 48%,transparent))}.atlas-route.restored{opacity:.9}.atlas-route.future{opacity:.18;stroke-dasharray:2 4}.atlas-route-caption{z-index:7}.atlas-route-caption b{font-size:13px}.atlas-route-caption span{font-size:10px}.atlas-chapter-objective{max-width:40ch}.atlas-footer{position:relative;z-index:12}
@media(max-width:360px){.atlas-waypoint-tab{min-width:86px}.atlas-route-caption span{display:none}.atlas-chapter-blurb .atlas-blurb-full{display:none}.atlas-chapter-blurb .atlas-blurb-compact{display:inline}}
'''
atlas=append_once(atlas,'Full audit closure: stronger Atlas hierarchy',atlas_css)
write('style400-skyway-atlas.css',atlas)

storycss=read('style400-story-theme.css')
story_extra=r'''
/* Full audit closure: information hierarchy, postcard scenes, board-edge decoration safety */
.level-props{clip-path:polygon(-80px -80px,calc(50% - 51%) -80px,calc(50% - 51%) 180%, -80px 180%, -80px -80px, calc(50% + 51%) -80px,180% -80px,180% 180%,calc(50% + 51%) 180%,calc(50% + 51%) -80px);}
.story-screen-card{overflow:hidden}.story-now-summary,.story-section-panel{padding:4px 2px}.story-section-tabs{position:sticky;top:0;z-index:5;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;margin:10px 0 14px;padding:5px;border-radius:16px;background:rgba(226,211,181,.55);backdrop-filter:blur(8px)}.story-section-tab{min-height:44px;border:0;border-radius:12px;background:transparent;color:#536c80;font-size:11px;font-weight:900}.story-section-tab[aria-selected="true"]{background:#fff8e8;color:#173a67;box-shadow:0 3px 8px rgba(33,52,66,.12)}.story-section-intro{color:#6b7f8f;font-size:12px;line-height:1.4}.story-scene-postcard-stamp{position:absolute;z-index:20;right:9px;top:9px;padding:4px 7px;border:1px solid rgba(75,63,47,.24);border-radius:7px;background:rgba(255,248,226,.88);color:#665944;font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:.05em;rotate:2deg}.story-card-scene{height:154px}.story-card-context{font-size:14px;line-height:1.35}.story-card-flavor{font-size:11px;line-height:1.4;color:#6a7d8c}.story-person-contribution{display:block;margin-top:4px;color:#60778b;font-weight:700;line-height:1.35}.home-memory-card p{max-width:40ch;margin-inline:auto}
@media(max-width:360px){.story-section-tabs{grid-template-columns:repeat(2,1fr)}.story-card-scene{height:128px}}
'''
storycss=append_once(storycss,'Full audit closure: information hierarchy',story_extra)
write('style400-story-theme.css',storycss)

gamecss=read('style400-game.css')
game_extra=r'''
/* Full audit closure: explicit causality, focus, safe areas, canonical ending */
button:focus-visible,[role="button"]:focus-visible{outline:3px solid #fff3a9!important;outline-offset:3px;box-shadow:0 0 0 6px rgba(37,91,136,.48)!important}.blocked-feedback{position:relative;z-index:5;animation:auditBlocked .34s ease-in-out 2}.blocked-feedback:after{content:"×";position:absolute;inset:12%;display:grid;place-items:center;border-radius:50%;background:rgba(180,58,64,.78);color:#fff;font-size:24px;font-weight:950;z-index:18}.causal-linked{position:relative;z-index:4;box-shadow:inset 0 0 0 4px rgba(255,215,87,.95),0 0 15px rgba(255,200,69,.75)!important}.arrival-ack{animation:auditArrival .7s ease-out both!important;box-shadow:0 0 0 4px rgba(255,244,172,.9),0 0 18px rgba(95,195,132,.75)!important}#mechanicNote[data-feedback]{box-shadow:0 3px 9px rgba(40,61,79,.09),inset 4px 0 0 #c9545b;background:#fff2ea}
@keyframes auditBlocked{50%{transform:scale(.94);filter:saturate(1.4)}}@keyframes auditArrival{0%{scale:.86}45%{scale:1.12}100%{scale:1}}
.ending-screen{padding:0!important;background:#dceefa}.ending-canonical-wrap{position:relative;width:100%;height:100%;min-height:100svh;overflow:hidden}.ending-home-frame{position:absolute;inset:0;width:100%;height:100%;border:0;background:#dceefa}.ending-resolution-card{position:absolute;z-index:5;left:50%;bottom:max(18px,env(safe-area-inset-bottom));translate:-50% 0;width:min(92vw,430px);padding:18px;border-radius:24px;background:rgba(255,249,235,.94);backdrop-filter:blur(12px);box-shadow:0 18px 45px rgba(27,54,75,.24);text-align:center}.ending-resolution-card h1{margin:5px auto 7px;max-width:16ch;font:700 clamp(24px,6vw,34px)/1.02 Georgia,serif;color:#183a67}.ending-resolution-card>p{margin:7px auto;max-width:42ch;color:#4d687d;line-height:1.4}.ending-ordinary-list{display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin:10px 0}.ending-ordinary-list span{padding:5px 8px;border-radius:999px;background:#edf4df;color:#456649;font-size:10px;font-weight:850}.ending-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.ending-actions button{min-height:48px}.ending-note{font-size:12px}.ending-kicker{text-transform:uppercase;letter-spacing:.08em;font-size:9px;font-weight:950;color:#9b703f}
@media(max-height:620px){.ending-resolution-card{bottom:max(7px,env(safe-area-inset-bottom));padding:12px 14px}.ending-resolution-card h1{font-size:22px}.ending-ordinary-list{margin:6px 0}.ending-resolution-card>p{font-size:11px;margin:4px auto}.ending-actions{margin-top:7px}}
@media(orientation:landscape) and (max-height:500px){.ending-resolution-card{right:max(12px,env(safe-area-inset-right));left:auto;bottom:50%;translate:0 50%;width:min(44vw,430px)}.ending-home-frame{width:58%}}
html[data-motion="reduced"] .blocked-feedback,html[data-motion="reduced"] .arrival-ack{animation:none!important}@media(prefers-reduced-motion:reduce){.blocked-feedback,.arrival-ack{animation:none!important}}
'''
gamecss=append_once(gamecss,'Full audit closure: explicit causality',game_extra)
write('style400-game.css',gamecss)

boards=read('style400-board-surfaces.css')
board_extra=r'''
/* Full audit closure: five recognizable movement rims without adding cell clutter */
#game .board[data-board-range="1"]{outline:2px solid color-mix(in srgb,var(--themeAccent) 22%,transparent);outline-offset:2px}#game .board[data-board-range="2"]{box-shadow:0 16px 34px rgba(30,48,65,.24),inset 0 0 0 4px color-mix(in srgb,var(--themeAccent) 10%,transparent)}#game .board[data-board-range="3"]{border-radius:22px 14px 22px 14px}#game .board[data-board-range="4"]{border-style:double;border-width:4px}#game .board[data-board-range="5"]{box-shadow:0 16px 34px rgba(30,48,65,.26),inset 0 0 0 2px rgba(255,255,255,.48),0 0 0 3px color-mix(in srgb,var(--themeAccent) 16%,transparent)}
'''
boards=append_once(boards,'Full audit closure: five recognizable movement rims',board_extra)
write('style400-board-surfaces.css',boards)

ui=read('style400-ui.css')
ui_extra=r'''
/* Full audit closure: device-safe interactive shell */
html,body{min-height:100%;min-height:100dvh}#app{min-height:100svh;padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)}button{touch-action:manipulation}.screen{padding-bottom:max(0px,env(safe-area-inset-bottom))}@media(orientation:landscape) and (max-height:500px){#game{overflow:auto}.production-home-frame{max-height:100svh}.story-screen,.atlas-screen{overflow:auto}}
'''
ui=append_once(ui,'Full audit closure: device-safe interactive shell',ui_extra)
write('style400-ui.css',ui)

# 12) Audio interruption: duck music during modals/cinematics and honor visibility.
music=read('music400.js')
music=music.replace("const TARGET_VOLUME = 0.24;","const TARGET_VOLUME = 0.24;\n  const DUCK_VOLUME = 0.09;",1)
music=music.replace("function fadeTo(target, duration = FADE_MS, token = transitionToken) {","function desiredVolume(){return document.body.classList.contains('cinematic-open')||document.body.classList.contains('modal-open')?DUCK_VOLUME:TARGET_VOLUME;}\n\n  function fadeTo(target, duration = FADE_MS, token = transitionToken) {",1)
music=music.replace("await fadeTo(TARGET_VOLUME, fadeMs, token);","await fadeTo(desiredVolume(), fadeMs, token);",1)
music=music.replace("if (currentKey === key && audio.src) {\n      if (audio.paused) beginCurrentTrack(transitionToken, fadeMs);\n      return;\n    }","if (currentKey === key && audio.src) {\n      if (audio.paused) beginCurrentTrack(transitionToken, fadeMs);\n      else fadeTo(desiredVolume(),fadeMs,transitionToken);\n      return;\n    }",1)
music=music.replace("const app = document.getElementById('app');","const bodyObserver=new MutationObserver(()=>queueMicrotask(()=>syncMusic()));bodyObserver.observe(document.body,{attributes:true,attributeFilter:['class']});\n\n  const app = document.getElementById('app');",1)
write('music400.js',music)

# Static sanity checks.
for js in ['story400.js','cinematics400.js','game400-a.js','game400-b.js','story-theme400.js','gameplay-story-rail400.js','pass3-chapter8-aurora.js','music400.js']:
    if not read(js).strip(): raise SystemExit(f'empty {js}')
if 'style400-cinematics-polish.css' in read('index.html'): raise SystemExit('cinematic CSS override still wired')
if 'cinematic-dialogue400.js' in read('index.html'): raise SystemExit('cinematic JS override still wired')
print('FULL_AUDIT_CLOSURE_BUILD_OK')
