from pathlib import Path
import shutil, json, hashlib

ROOT=Path('.')
OUT=Path('/tmp/r1r5-prepared')
if OUT.exists(): shutil.rmtree(OUT)
OUT.mkdir(parents=True)

changed=[]

def write(path,text):
    dst=OUT/path
    dst.parent.mkdir(parents=True,exist_ok=True)
    dst.write_text(text,encoding='utf-8')
    changed.append(str(path))

def load(path): return (ROOT/path).read_text(encoding='utf-8')

def replace_once(text,old,new,label):
    n=text.count(old)
    if n!=1: raise SystemExit(f'{label}: expected 1 occurrence, found {n}')
    return text.replace(old,new,1)

# R1/R4: story rail can grow, and Large Text actually enlarges the immediate story line.
p=Path('style400-story-rail-board.css'); t=load(p)
block='''\n\n/* Astra audit R1/R4: readable rails must wrap instead of clipping, including Large Text. */\n.story-level-rail{height:auto;overflow:visible}\n.story-rail-main{min-height:0}\n.story-rail-main p{overflow:visible}\nhtml[data-text-size="large"] .story-rail-main p{font-size:16px;line-height:1.32}\n@media(max-height:620px){\n .story-level-rail{height:auto;min-height:52px}\n html[data-text-size="large"] .story-rail-main p{font-size:15px!important;line-height:1.3}\n}\n'''
if 'Astra audit R1/R4' in t: raise SystemExit('story rail audit block already present')
t+=block; write(p,t)

# R1: mechanic text is never clamped/ellipsized; its container grows with content.
p=Path('style400-story-theme.css'); t=load(p)
block='''\n\n/* Astra audit R1: route teaching is essential text, never a two-line ellipsis. */\n#game .mechanic-note.mechanic-chip{height:auto;align-items:flex-start}\n#game .mechanic-chip-copy{display:block!important;-webkit-line-clamp:unset!important;-webkit-box-orient:initial!important;overflow:visible!important;white-space:normal}\n'''
if 'Astra audit R1:' in t: raise SystemExit('story theme audit block already present')
t+=block; write(p,t)

# R4: shared Large Text coverage, with the short-screen rule no longer defeating the user preference.
p=Path('style400-game.css'); t=load(p)
block='''\n\n/* Astra audit R4: Large Text covers essential story, teaching, dialog, and journal copy. */\nhtml[data-text-size="large"] #game .mechanic-chip-copy{font-size:16px!important;line-height:1.3}\nhtml[data-text-size="large"] .modal p{font-size:16px;line-height:1.5}\nhtml[data-text-size="large"] .story-screen-card>p,\nhtml[data-text-size="large"] .story-role-card,\nhtml[data-text-size="large"] .story-briefing p,\nhtml[data-text-size="large"] .story-current-chapter p,\nhtml[data-text-size="large"] .story-journey-item p,\nhtml[data-text-size="large"] .story-cinematic-intro{font-size:16px;line-height:1.5}\n@media(max-height:620px){\n html[data-text-size="large"] #game .mechanic-chip-copy{font-size:15px!important;line-height:1.28}\n}\n'''
if 'Astra audit R4:' in t: raise SystemExit('game large-text audit block already present')
t+=block; write(p,t)

# R1: four known overlong movement rails get concise immediate lines without changing story canon.
p=Path('gameplay-story-rail400.js'); t=load(p)
insert='''const MOVEMENT_RAIL_LINES={\n 'A Porch Worth Reaching':'The twin-lantern porch is slipping out of easy visiting range.',\n 'Holding, Not Freezing':'The anchors create reliable moments while everything keeps moving.',\n 'The View Gets Wider':'From Prism’s high paths, neighboring islands sit farther from their old markers.',\n 'Waykeepers Everywhere':'Every region now maintains part of the same living map.'\n};\n'''
t=replace_once(t,'];\nfunction escapeHtml','];\n'+insert+'function escapeHtml','insert concise rail lines')
t=replace_once(t,"line=early?.line||movement?.setup||meta.context","line=early?.line||MOVEMENT_RAIL_LINES[movement?.title]||movement?.setup||meta.context",'use concise rail lines')
write(p,t)

# R1: route tips are intentionally concise, preserving mechanic distinctions rather than relying on clipping.
p=Path('game400-a.js'); t=load(p)
old="function chapterNote(L){const k=(L-1)%50+1,ch=Math.ceil(L/50),c=CHAPTERS[ch-1];if(k<=2)return (c.mechanic?c.mechanic+'. ':'')+c.tip;if(ch===1&&k<=5)return 'A snap continues until something stops it. Use the board edge and rocks to line up the nest.';if(ch===2&&k<=5)return 'Other Latchlings are movable walls. Park one where another needs to stop.';if(ch===3&&k<=5)return 'Anchors create exact stopping points without needing a wall behind them.';if(ch===4&&k<=5)return 'Read the black suit mark before committing to a gate route.';if(ch===5&&k<=5)return 'Body color and suit are separate clues now. Check both before you snap.';if(ch===6&&k<=5)return 'Rails restrict entry; turners bend one continuous snap without spending another move.';if(ch===7&&k<=5)return 'Switch order matters. Open the route you need before committing a Latchling to it.';if(ch===8&&k<=5)return 'Everything is live. Read the whole circuit before your first move.';if(k>=46)return 'Expert board: expect setup moves, temporary blockers, and routes that only make sense several snaps ahead.';return c.tip}"
new="const ROUTE_TIPS=['Use edges and rocks to create exact stops.','Park helpers as temporary stopping walls.','Anchors stop a snap at an exact position.','Suit gates read the Latchling’s black suit mark.','Color gates read body color; suit gates read the black suit mark.','Rails restrict entry; turners bend the same snap.','Switches toggle doors; an open door may remove a useful stop.','All mechanics are live. Plan several board states ahead.'];\nfunction chapterNote(L){const k=(L-1)%50+1,ch=Math.ceil(L/50),tip=ROUTE_TIPS[ch-1];if(k>=46)return 'Expert route: use setup moves and temporary blockers.';return tip}"
t=replace_once(t,old,new,'replace chapterNote')
write(p,t)

# R3: highlight begins after returning to the board and persists until an interaction/reset.
p=Path('game400-b.js'); t=load(p)
old="function showHint(){if(window.LatchlingsSFX)window.LatchlingsSFX.hint();const lev=LEVELS[currentLevel-1];if(movesUsed>0){modal(`<h2>Reset for an accurate hint?</h2><p>This route hint starts from the original board. Reset first so the suggested move matches what you see.</p><div class=\"modal-actions\"><button class=\"primary-small\" id=\"hintReset\">Reset & show hint</button><button class=\"secondary-small\" id=\"hintKeep\">Keep playing</button></div>`);document.getElementById('hintReset').onclick=()=>{closeModal();startLevel(currentLevel,playMode);setTimeout(showHint,90)};document.getElementById('hintKeep').onclick=closeModal;return}const [pi,d]=lev.solution[0],p=lev.pieces[pi],names={U:'up',D:'down',L:'left',R:'right'};selected=pi;renderPieces(lev);const piece=document.querySelector(`.latchling[data-pi=\"${pi}\"]`),dir=document.querySelector(`.dpad-hit[data-dir=\"${d}\"]`);piece?.classList.add('hint-focus');dir?.classList.add('hint-focus');setTimeout(()=>{piece?.classList.remove('hint-focus');dir?.classList.remove('hint-focus')},3200);modal(`<h2>Try this first</h2><p>Select the ${p.color} ${p.suit} Latchling and move ${names[d]}. The piece and direction are highlighted when you return to the board.</p><div class=\"modal-actions\"><button class=\"primary-small\" id=\"hintClose\">Back to board</button></div>`);document.getElementById('hintClose').onclick=closeModal}"
new="let activeHintFocus=null;\nfunction clearHintFocus(){if(!activeHintFocus)return;activeHintFocus.piece?.classList.remove('hint-focus');activeHintFocus.dir?.classList.remove('hint-focus');activeHintFocus=null}\nfunction applyHintFocus(pi,d){clearHintFocus();const piece=document.querySelector(`.latchling[data-pi=\"${pi}\"]`),dir=document.querySelector(`.dpad-hit[data-dir=\"${d}\"]`);piece?.classList.add('hint-focus');dir?.classList.add('hint-focus');activeHintFocus={pi,d,piece,dir}}\nfunction showHint(){if(window.LatchlingsSFX)window.LatchlingsSFX.hint();const lev=LEVELS[currentLevel-1];if(movesUsed>0){modal(`<h2>Reset for an accurate hint?</h2><p>This route hint starts from the original board. Reset first so the suggested move matches what you see.</p><div class=\"modal-actions\"><button class=\"primary-small\" id=\"hintReset\">Reset & show hint</button><button class=\"secondary-small\" id=\"hintKeep\">Keep playing</button></div>`);document.getElementById('hintReset').onclick=()=>{clearHintFocus();closeModal();startLevel(currentLevel,playMode);setTimeout(showHint,90)};document.getElementById('hintKeep').onclick=closeModal;return}const [pi,d]=lev.solution[0],p=lev.pieces[pi],names={U:'up',D:'down',L:'left',R:'right'};selected=pi;renderPieces(lev);clearHintFocus();modal(`<h2>Try this first</h2><p>Select the ${p.color} ${p.suit} Latchling and move ${names[d]}. The piece and direction stay highlighted when you return to the board.</p><div class=\"modal-actions\"><button class=\"primary-small\" id=\"hintClose\">Back to board</button></div>`);document.getElementById('hintClose').onclick=()=>{closeModal();requestAnimationFrame(()=>applyHintFocus(pi,d))}}"
t=replace_once(t,old,new,'replace showHint')
t=replace_once(t,"async function moveSelected(d){if(animating)return;","async function moveSelected(d){if(animating)return;clearHintFocus();",'clear hint on move')
t=replace_once(t,"document.getElementById('pauseReset').onclick=()=>{closeModal();startLevel(currentLevel,playMode)}","document.getElementById('pauseReset').onclick=()=>{clearHintFocus();closeModal();startLevel(currentLevel,playMode)}",'clear hint on pause reset')
t=replace_once(t,"document.getElementById('resetLevelBtn').onclick=()=>startLevel(currentLevel,playMode);","document.getElementById('resetLevelBtn').onclick=()=>{clearHintFocus();startLevel(currentLevel,playMode)};",'clear hint on reset')
# Clear the remaining direction highlight if the player selects a different piece.
t=replace_once(t,"document.getElementById('hintBtn').onclick=showHint;","document.getElementById('pieceLayer')?.addEventListener('click',e=>{if(activeHintFocus&&e.target.closest('.latchling'))clearHintFocus()});document.getElementById('hintBtn').onclick=showHint;",'clear hint on selection')
write(p,t)

# R2: make the Little Home scheduler honor live game + OS motion and scene activity.
p=Path('title-island-concepts/index.html'); t=load(p)
old="""const littleHomeAdults=[...document.querySelectorAll('#c2 .resident.adult')];
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const littleHomeRoot=document.querySelector('#c2');
const littleHomeStepTransform=step=>`translate(${step.x}px,${step.y}px) rotate(${step.r||0}deg)`;
let littleHomeAdultTimer=0;
let littleHomeAdultTurn=0;
const scheduleNextLittleHomeAdultMove=()=>{
  if(reducedMotion||!littleHomeAdults.length)return;
  const wait=littleHomeRandom(LITTLE_HOME_ADULT_GAP_MIN,LITTLE_HOME_ADULT_GAP_MAX);
  if(littleHomeRoot)littleHomeRoot.dataset.nextAdultMoveMs=String(Math.round(wait));
  clearTimeout(littleHomeAdultTimer);
  littleHomeAdultTimer=setTimeout(runLittleHomeAdultMove,wait);
};
const runLittleHomeAdultMove=async()=>{
  if(reducedMotion||!littleHomeAdults.length)return;
  const adult=littleHomeAdults[littleHomeAdultTurn%littleHomeAdults.length];
  littleHomeAdultTurn=(littleHomeAdultTurn+1)%littleHomeAdults.length;
  const route=littleHomeAdultRoutes[adult.dataset.activity]||littleHomeAdultRoutes.garden;
  const current=Number(adult.dataset.routeIndex||0)%route.length;
  const next=(current+1)%route.length;
  const duration=littleHomeRandom(LITTLE_HOME_ADULT_STEP_MIN,LITTLE_HOME_ADULT_STEP_MAX);
  adult.dataset.motionState='moving';
  adult.dataset.moveCount=String(Number(adult.dataset.moveCount||0)+1);
  adult.dataset.routeIndex=String(next);
  adult.dataset.stepDurationMs=String(Math.round(duration));
  if(littleHomeRoot)littleHomeRoot.dataset.activeAdult=adult.dataset.activity||'';
  const animation=adult.animate([
    {transform:littleHomeStepTransform(route[current])},
    {transform:littleHomeStepTransform(route[next])}
  ],{duration,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
  try{await animation.finished}catch{}
  adult.style.transform=littleHomeStepTransform(route[next]);
  animation.cancel();
  adult.dataset.motionState='idle';
  if(littleHomeRoot)littleHomeRoot.dataset.activeAdult='';
  scheduleNextLittleHomeAdultMove();
};
littleHomeAdults.forEach(adult=>{
  adult.dataset.motionState='idle';
  adult.dataset.moveCount='0';
  adult.dataset.routeIndex='0';
  adult.style.transform=littleHomeStepTransform((littleHomeAdultRoutes[adult.dataset.activity]||littleHomeAdultRoutes.garden)[0]);
});
scheduleNextLittleHomeAdultMove();

function restartLittleHomeTitle(){const logo=document.querySelector('#c2 .toy-logo');if(!logo||matchMedia('(prefers-reduced-motion: reduce)').matches)return;logo.classList.remove('title-drop-run');void logo.offsetWidth;logo.classList.add('title-drop-run')}"""
new="""const littleHomeAdults=[...document.querySelectorAll('#c2 .resident.adult')];
const littleHomeMotionQuery=matchMedia('(prefers-reduced-motion: reduce)');
const littleHomeRoot=document.querySelector('#c2');
const littleHomeStepTransform=step=>`translate(${step.x}px,${step.y}px) rotate(${step.r||0}deg)`;
let littleHomeAdultTimer=0;
let littleHomeAdultTurn=0;
let littleHomeAdultAnimation=null;
let littleHomeSceneActive=true;
const littleHomeEffectiveReducedMotion=()=>littleHomeMotionQuery.matches||document.documentElement.dataset.motion==='reduced';
const littleHomeMotionAllowed=()=>littleHomeSceneActive&&!littleHomeEffectiveReducedMotion();
const stopLittleHomeAdultMotion=()=>{
  clearTimeout(littleHomeAdultTimer);littleHomeAdultTimer=0;
  if(littleHomeAdultAnimation){littleHomeAdultAnimation.cancel();littleHomeAdultAnimation=null}
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
  if(!littleHomeAdultTimer&&!littleHomeAdultAnimation)scheduleNextLittleHomeAdultMove();
};
const runLittleHomeAdultMove=async()=>{
  if(!littleHomeMotionAllowed()||!littleHomeAdults.length)return;
  const adult=littleHomeAdults[littleHomeAdultTurn%littleHomeAdults.length];
  littleHomeAdultTurn=(littleHomeAdultTurn+1)%littleHomeAdults.length;
  const route=littleHomeAdultRoutes[adult.dataset.activity]||littleHomeAdultRoutes.garden;
  const current=Number(adult.dataset.routeIndex||0)%route.length;
  const next=(current+1)%route.length;
  const duration=littleHomeRandom(LITTLE_HOME_ADULT_STEP_MIN,LITTLE_HOME_ADULT_STEP_MAX);
  adult.dataset.motionState='moving';
  adult.dataset.stepDurationMs=String(Math.round(duration));
  if(littleHomeRoot)littleHomeRoot.dataset.activeAdult=adult.dataset.activity||'';
  const animation=adult.animate([{transform:littleHomeStepTransform(route[current])},{transform:littleHomeStepTransform(route[next])}],{duration,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
  littleHomeAdultAnimation=animation;
  let completed=false;try{await animation.finished;completed=true}catch{}
  if(littleHomeAdultAnimation===animation)littleHomeAdultAnimation=null;
  if(completed&&littleHomeMotionAllowed()){
    adult.style.transform=littleHomeStepTransform(route[next]);
    adult.dataset.routeIndex=String(next);
    adult.dataset.moveCount=String(Number(adult.dataset.moveCount||0)+1);
  }else{
    adult.style.transform=littleHomeStepTransform(route[current]);
    adult.dataset.routeIndex=String(current);
  }
  animation.cancel();adult.dataset.motionState='idle';
  if(littleHomeRoot)littleHomeRoot.dataset.activeAdult='';
  if(littleHomeMotionAllowed())scheduleNextLittleHomeAdultMove();
};
littleHomeAdults.forEach(adult=>{
  adult.dataset.motionState='idle';adult.dataset.moveCount='0';adult.dataset.routeIndex='0';
  adult.style.transform=littleHomeStepTransform((littleHomeAdultRoutes[adult.dataset.activity]||littleHomeAdultRoutes.garden)[0]);
});
littleHomeMotionQuery.addEventListener?.('change',syncLittleHomeMotion);
try{if(parent&&parent!==window&&parent.document?.body){littleHomeSceneActive=parent.document.body.dataset.screen==='home';new MutationObserver(()=>{littleHomeSceneActive=parent.document.body.dataset.screen==='home';syncLittleHomeMotion()}).observe(parent.document.body,{attributes:true,attributeFilter:['data-screen']})}}catch(_){}
syncLittleHomeMotion();

function restartLittleHomeTitle(){const logo=document.querySelector('#c2 .toy-logo');if(!logo||littleHomeEffectiveReducedMotion()||!littleHomeSceneActive)return;logo.classList.remove('title-drop-run');void logo.offsetWidth;logo.classList.add('title-drop-run')}"""
t=replace_once(t,old,new,'replace Little Home scheduler')
# Make CSS animations pause while the home iframe is inactive, not merely when reduced motion is selected.
needle='html[data-motion="reduced"] *{animation:none!important;transition-duration:.01ms!important;scroll-behavior:auto!important}'
t=replace_once(t,needle,needle+'\nhtml[data-scene-active="false"] #c2 *{animation-play-state:paused!important}', 'add inactive scene CSS pause')
# Re-sync scheduler whenever the parent sends a new live motion preference.
old_msg="document.documentElement.dataset.motion=e.data.motion||'system';document.documentElement.dataset.textSize=e.data.textSize||'normal';"
new_msg="document.documentElement.dataset.motion=e.data.motion||'system';document.documentElement.dataset.textSize=e.data.textSize||'normal';syncLittleHomeMotion();"
t=replace_once(t,old_msg,new_msg,'sync scheduler on home-state message')
write(p,t)

# R5: move progress + Continue into a persistent footer outside the scrollable copy.
p=Path('cinematics400.js'); t=load(p)
old='<div class="cinematic-stage" id="cinematicStage" aria-hidden="true"></div><div class="cinematic-copy"><div class="cinematic-counter" id="cinematicCounter"></div><h2 id="cinematicTitle"></h2><h3 id="cinematicBeat"></h3><div class="cinematic-lines" id="cinematicLines" aria-live="polite"></div><div class="cinematic-progress" id="cinematicProgress" aria-hidden="true"></div><button class="cinematic-next" id="cinematicNext" type="button">Continue</button></div></section>'
new='<div class="cinematic-stage" id="cinematicStage" aria-hidden="true"></div><div class="cinematic-copy"><div class="cinematic-counter" id="cinematicCounter"></div><h2 id="cinematicTitle"></h2><h3 id="cinematicBeat"></h3><div class="cinematic-lines" id="cinematicLines" aria-live="polite"></div></div><footer class="cinematic-footer"><div class="cinematic-progress" id="cinematicProgress" aria-hidden="true"></div><button class="cinematic-next" id="cinematicNext" type="button">Continue</button></footer></section>'
t=replace_once(t,old,new,'move cinematic controls to footer')
write(p,t)

# R5: fixed cinematic footer and 44px Skip; R4: large text applies to cinematic essential copy.
p=Path('style400-cinematics.css'); t=load(p)
block='''\n\n/* Astra audit R5: persistent cinematic navigation stays outside the scrolling story copy. */\n.cinematic-shell{grid-template-rows:auto minmax(205px,36vh) minmax(0,1fr) auto}\n.cinematic-copy{padding-bottom:10px}\n.cinematic-footer{position:relative;z-index:60;flex:0 0 auto;padding:8px 18px calc(14px + env(safe-area-inset-bottom));background:rgba(255,249,238,.97);border-top:1px solid rgba(188,157,113,.35);box-shadow:0 -5px 14px rgba(38,54,70,.08)}\n.cinematic-footer .cinematic-progress{margin:0 0 8px}\n.cinematic-footer .cinematic-next{margin:0;min-height:48px}\n.cinematic-skip{min-height:44px;min-width:60px;padding:7px 12px}\nhtml[data-text-size="large"] .cinematic-lines .narrator-only{font-size:15px;line-height:1.45}\nhtml[data-text-size="large"] .cinematic-copy h3{font-size:15px;line-height:1.3}\n@media(max-height:620px){\n .cinematic-shell{grid-template-rows:auto minmax(145px,29vh) minmax(0,1fr) auto}\n .cinematic-head{min-height:48px;padding:5px 8px 5px 12px}\n .cinematic-copy{padding:8px 12px 6px}\n .cinematic-footer{padding:6px 12px calc(8px + env(safe-area-inset-bottom))}\n .cinematic-footer .cinematic-progress{margin:0 0 6px}\n}\n'''
if 'Astra audit R5:' in t: raise SystemExit('cinematic footer audit block already present')
t+=block; write(p,t)

p=Path('style400-cinematics-dialogue.css'); t=load(p)
block='''\n\n/* Astra audit R4: Large Text enlarges actual chronological cinematic dialogue too. */\nhtml[data-text-size="large"] .cin-ordered-dialogue-dock .cin-opening-bubble{font-size:16px!important;line-height:1.4}\nhtml[data-text-size="large"] .cin-ordered-dialogue-dock .cin-opening-speaker b{font-size:11px}\nhtml[data-text-size="large"] .cin-ordered-dialogue-dock .cin-opening-speaker small{font-size:10px}\n@media(max-height:620px){html[data-text-size="large"] .cin-ordered-dialogue-dock .cin-opening-bubble{font-size:15px!important;line-height:1.36}}\n'''
if 'Astra audit R4: Large Text enlarges actual chronological' in t: raise SystemExit('cinematic large-text audit block already present')
t+=block; write(p,t)

# Cache-bust only the files changed in this usability pass.
p=Path('index.html'); t=load(p)
for old,new,label in [
 ('style400-game.css?v=20260912-pass1','style400-game.css?v=20260913-audit-r1r5-1','game css cache'),
 ('style400-story-theme.css?v=20260911-narrative1','style400-story-theme.css?v=20260913-audit-r1r5-1','story theme cache'),
 ('style400-story-rail-board.css?v=20260912-pass1','style400-story-rail-board.css?v=20260913-audit-r1r5-1','rail css cache'),
 ('style400-cinematics.css','style400-cinematics.css?v=20260913-audit-r1r5-1','cinematic css cache'),
 ('style400-cinematics-dialogue.css?v=20260912-pass1','style400-cinematics-dialogue.css?v=20260913-audit-r1r5-1','dialogue css cache'),
 ('title-island-concepts/?c=2&amp;embed=1&amp;v=20260912-ch4pass3-1','title-island-concepts/?c=2&amp;embed=1&amp;v=20260913-audit-r1r5-1','home iframe cache'),
 ('game400-a.js?v=20260912-ch4pass3-1','game400-a.js?v=20260913-audit-r1r5-1','game a cache'),
 ('game400-b.js?v=20260912-ch4pass3-1','game400-b.js?v=20260913-audit-r1r5-1','game b cache'),
 ('cinematics400.js?v=20260912-ch2pass3-1','cinematics400.js?v=20260913-audit-r1r5-1','cinematics js cache'),
 ('gameplay-story-rail400.js?v=20260912-pass1','gameplay-story-rail400.js?v=20260913-audit-r1r5-1','rail js cache')]:
    t=replace_once(t,old,new,label)
write(p,t)

manifest={}
for rel in changed:
    data=(OUT/rel).read_bytes()
    manifest[rel]={'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data)}
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
print(json.dumps(manifest,indent=2))
