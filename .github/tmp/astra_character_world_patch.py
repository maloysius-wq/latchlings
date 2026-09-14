from pathlib import Path
import argparse
import re

ROOT = Path('.')


def read(path):
    return (ROOT / path).read_text(encoding='utf-8')


def write(path, text):
    (ROOT / path).write_text(text, encoding='utf-8')


def replace_once(text, old, new, label):
    if old not in text:
        raise AssertionError(f'missing patch anchor: {label}')
    if text.count(old) != 1:
        raise AssertionError(f'non-unique patch anchor: {label} ({text.count(old)})')
    return text.replace(old, new, 1)


def regex_once(text, pattern, repl, label):
    out, count = re.subn(pattern, repl, text, count=1, flags=re.S)
    if count != 1:
        raise AssertionError(f'regex patch failed: {label} ({count})')
    return out


def handoff_only():
    path = 'DEVELOPMENT_HANDOFF.md'
    text = read(path)
    marker = '#### Active character/world coherence candidate'
    if marker in text:
        return
    needle = 'Next action: Character/world coherence candidate. Preserve all accepted product slices while finishing the remaining source-defined behavior/world gaps: sharpen N04 information roles across during-play motive, movement-opening clue, milestone result, and recap; complete V06 resident use for earned keepsakes; add Pip/Tansy behavior and broader line-appropriate expressions for N05; improve V07 cross-region fixture consistency and V12 destination distinctiveness without changing authored puzzle definitions.\n'
    block = needle + "\n#### Active character/world coherence candidate\n**Status: IN PROGRESS**\n\nCandidate branch: `astra-character-world-coherence`, branched from protected `main` head `e913ba53681bbf16ae0b2c6f9a8ca0a49abf8665`. TDD RED run `34890084992` correctly failed all eight intended pre-change contracts for N04, V06, N05, V07, and V12. Planned product scope is limited to presentation/story-role code, Little Home choreography, Atlas landmark presentation, and cache keys. Authored campaign files `campaign400-1.js` through `campaign400-8.js` remain protected and unchanged. Candidate acceptance requires short/normal/wide phone browser checks, Reduced Motion/offscreen checks for new Home behavior, shared fixture identity across Story and Atlas, five distinct authored destinations per Atlas chapter, manual settled screenshot review, and committed-main revalidation before closure.\n"
    text = replace_once(text, needle, block, 'handoff next action')
    write(path, text)


def patch_story_grounding():
    path = 'story-grounding400.js'
    text = read(path)
    if 'const MOVEMENT_FIXTURES=' in text:
        return
    block = r'''

/* Astra character/world coherence: one shared physical-fixture vocabulary for movement clues, Story postcards and Atlas destinations. */
const MOVEMENT_FIXTURES=[
 [
  {id:'morning-route-table',label:'Breakfast Route Table',kind:'table'},
  {id:'route-mailbox',label:'Little Home Route Mailbox',kind:'mailbox'},
  {id:'waykeeper-marker',label:'Old Waykeeper Marker',kind:'marker'},
  {id:'sunpetal-safe-stop',label:'Sunpetal Safe-Stop Garden',kind:'garden'},
  {id:'route-mailbox',label:'Little Home Route Mailbox',kind:'mailbox'}
 ],
 [
  {id:'lanternwood-crossing',label:'Lanternwood Crossing',kind:'porch'},
  {id:'travel-window-post',label:'Shared Travel-Window Post',kind:'signal'},
  {id:'twin-lantern-porch',label:'Twin-Lantern Porch',kind:'porch'},
  {id:'shared-stop-marker',label:'Neighborhood Stop Marker',kind:'marker'},
  {id:'visitor-pennant',label:'Visitor Pennant Landing',kind:'pennant'}
 ],
 [
  {id:'buried-anchor',label:'Buried Anchor Station',kind:'anchor'},
  {id:'waykeeper-marker',label:'Old Waykeeper Marker',kind:'marker'},
  {id:'maintenance-log-desk',label:'Community Maintenance Desk',kind:'archive'},
  {id:'shifted-anchor-line',label:'Shifted Anchor Line',kind:'anchor'},
  {id:'restored-anchor',label:'Restored Anchor Station',kind:'anchor'}
 ],
 [
  {id:'market-outer-gate',label:'Outer Market Gate',kind:'gate'},
  {id:'suit-lane',label:'Suit-Marked Market Lane',kind:'gate'},
  {id:'old-suit-plaque',label:'Old Civic Suit Arch',kind:'gate'},
  {id:'distant-station-board',label:'Distant Station Board',kind:'signal'},
  {id:'market-bunting',label:'Market Bunting Square',kind:'bunting'}
 ],
 [
  {id:'prism-lookout',label:'Prism Lookout',kind:'observatory'},
  {id:'drift-sighting',label:'Long-Drift Sighting Arch',kind:'observatory'},
  {id:'twin-lantern-porch',label:'Twin-Lantern Porch',kind:'porch'},
  {id:'map-overlay-table',label:'Yesterday Map Table',kind:'archive'},
  {id:'prism-telescope',label:'Prism Telescope Terrace',kind:'telescope'}
 ],
 [
  {id:'route-plate-archive',label:'Approved Route-Plate Archive',kind:'archive'},
  {id:'dated-map-rack',label:'Dated Map Rack',kind:'archive'},
  {id:'route-plate-archive',label:'Approved Route-Plate Archive',kind:'archive'},
  {id:'automation-desk',label:'Old Automation Desk',kind:'relay'},
  {id:'waykeeper-compass',label:'Waykeeper Compass Platform',kind:'compass'}
 ],
 [
  {id:'shared-relay',label:'Two-Region Relay',kind:'relay'},
  {id:'travel-window-dial',label:'Shared Travel-Window Dial',kind:'signal'},
  {id:'correction-lamp',label:'Correction-Lamp Relay',kind:'relay'},
  {id:'living-signal-board',label:'Living Signal Board',kind:'relay'},
  {id:'arrival-platform',label:'Little Home Arrival Platform',kind:'dock'}
 ],
 [
  {id:'crown-convergence',label:'Crown Convergence Beacon',kind:'crown'},
  {id:'living-map',label:'Living Skyway Map',kind:'archive'},
  {id:'twin-lantern-porch',label:'Twin-Lantern Porch',kind:'porch'},
  {id:'little-home-route-desk',label:'Little Home Route Desk',kind:'table'},
  {id:'tomorrow-beacon',label:'Tomorrow Route Beacon',kind:'crown'}
 ]
];
function movementFixtureFor(level){
 const m=movementForLevel(level),chapter=Math.max(1,Math.min(8,m.chapter)),index=Math.max(0,Math.min(4,m.index)),fixture=MOVEMENT_FIXTURES[chapter-1][index];
 return {...fixture,chapter,index,level:(chapter-1)*50+(index+1)*10};
}
STORY.movementFixtureFor=movementFixtureFor;
STORY.movementFixtures=MOVEMENT_FIXTURES;
'''
    text = text.replace('\n})();\n', block + '\n})();\n')
    if 'movementFixtureFor' not in text:
        raise AssertionError('fixture block not inserted')
    write(path, text)


def patch_story_rail():
    path = 'gameplay-story-rail400.js'
    text = read(path)
    if 'data-story-role="motive"' in text and 'MOVEMENT_RAIL_LINES' not in text:
        return
    text = regex_once(text, r"const EARLY_STORY=\[.*?\];\nconst MOVEMENT_RAIL_LINES=\{.*?\};\n", '', 'remove duplicate rail exposition tables')
    old = "const meta=STORY.levelMeta(level),chapter=meta.chapter,local=meta.local,slot=(local-1)%10,movement=STORY.movementForLevel?STORY.movementForLevel(level):null,early=chapter===1&&local<=20?EARLY_STORY[local-1]:null,speaker=early?.speaker||SPEAKERS[chapter-1][slot],line=early?.line||MOVEMENT_RAIL_LINES[movement?.title]||movement?.setup||meta.context;"
    new = "const meta=STORY.levelMeta(level),chapter=meta.chapter,local=meta.local,slot=(local-1)%10,mentioned=(STORY.cast||[]).find(c=>new RegExp(`(?:^|\\\\W)${c.name}(?=$|\\\\W)`,'i').test(meta.context)),speaker=mentioned?.name||SPEAKERS[chapter-1][slot],line=meta.context;"
    text = replace_once(text, old, new, 'story rail motive source')
    old = "host.dataset.storyRailLevel=String(level);host.setAttribute('aria-label',`${speaker}. ${line}. Open Story for the full route context.`);host.innerHTML=`<section class=\"story-level-rail story-rail-ch${chapter}\"><div class=\"story-rail-person\">${portrait(speaker)}</div><div class=\"story-rail-main\"><div class=\"story-rail-meta\"><strong>${escapeHtml(speaker)}</strong><span>${escapeHtml(movement?.title||meta.title)}</span></div><p>${escapeHtml(line)}</p></div><button class=\"story-rail-story-btn\" type=\"button\" aria-label=\"Open full story for this level\"><span aria-hidden=\"true\">▣</span><b>Story</b></button></section>`;"
    new = "host.dataset.storyRailLevel=String(level);host.dataset.storyRole='motive';host.setAttribute('aria-label',`${speaker}. ${line}. Open Story for this movement's clue.`);host.innerHTML=`<section class=\"story-level-rail story-rail-ch${chapter}\" data-story-role=\"motive\"><div class=\"story-rail-person\">${portrait(speaker)}</div><div class=\"story-rail-main\"><div class=\"story-rail-meta\"><strong>${escapeHtml(speaker)}</strong><span>Why this route matters</span></div><p>${escapeHtml(line)}</p></div><button class=\"story-rail-story-btn\" type=\"button\" aria-label=\"Open Story for the current movement clue\"><span aria-hidden=\"true\">▣</span><b>Story</b></button></section>`;"
    text = replace_once(text, old, new, 'story rail role markup')
    text = replace_once(text, 'window.LatchlingsStoryRail={render,SPEAKERS,EARLY_STORY};', 'window.LatchlingsStoryRail={render,SPEAKERS};', 'story rail export')
    write(path, text)


def patch_story_theme():
    path = 'story-theme400.js'
    text = read(path)
    if 'function expressionForLine' in text and 'data-story-role="movement-clue"' in text:
        return
    expr_anchor = "const CHAR_EXPR={Pippa:'curious',Bramble:'smug',Rowan:'happy',Pip:'determined',Tansy:'surprised'};"
    expr_new = expr_anchor + "\nconst CHAR_BEHAVIOR={Pippa:{token:'marker',label:'Straightens route markers'},Bramble:{token:'parcel',label:'Tests one more shortcut'},Rowan:{token:'measure',label:'Measures the island drift'},Pip:{token:'clue',label:'Finds overlooked clues'},Tansy:{token:'visit',label:'Notices missed visits'}};"
    text = replace_once(text, expr_anchor, expr_new, 'character behavior vocabulary')
    vars_anchor = "function characterVars(c){const color=CHAR_COLORS[c.color]||CHAR_COLORS.blue,b=CHAR_BLINK[c.name]||['4.8s','-1.4s'];return `--charColor:${color};--charLight:${CHAR_LIGHT[c.color]||color};--charDark:${CHAR_DARK[c.color]||color};--avatar-blink-duration:${b[0]};--avatar-blink-delay:${b[1]}`}\n"
    expr_fn = vars_anchor + "function expressionForLine(name,line=''){const t=String(line||'').toLowerCase();if(/shortcut|ridiculous|technically true|perfectly efficient/.test(t))return name==='Bramble'||name==='Pip'?'smug':'surprised';if(/miss|fail|wrong|stale|farther|separat|out of place|closed|lost/.test(t))return name==='Tansy'?'curious':'determined';if(/\\?|why|what if|notice|spot|find|found|look|marker|map|drift|measure/.test(t))return 'curious';if(/works|saved|home|visit|friend|reach|cheer|together|connected/.test(t))return 'happy';return CHAR_EXPR[name]||'happy'}\nfunction behaviorFor(c){return CHAR_BEHAVIOR[c.name]||{token:'route',label:'Helps tend the route'}}\n"
    text = replace_once(text, vars_anchor, expr_fn, 'line expression function')
    text = regex_once(text, r"function characterPortrait\(c,index,total\)\{.*?\}\nfunction characterAvatar\(c\)\{.*?\}\nfunction characterChip\(c\)\{.*?\}\nfunction residentCard\(c\)\{.*?\}\n", """function characterPortrait(c,index,total,line=''){const expr=expressionForLine(c.name,line||c.contribution||c.voice),behavior=behaviorFor(c);return `<span class=\"story-scene-character story-scene-character-${index+1} story-scene-character-count-${total}\" data-character=\"${escapeHtml(c.name)}\" data-color=\"${escapeHtml(c.color)}\" data-suit=\"${escapeHtml(c.suit)}\" data-expression=\"${expr}\" data-behavior=\"${behavior.token}\" style=\"${characterVars(c)}\"><span class=\"story-char-body expr-${expr}\"><span class=\"suit-mark\">${charSuitSvg(c.suit)}</span>${characterFace()}</span></span>`}
function characterAvatar(c,line=''){const expr=expressionForLine(c.name,line||c.contribution||c.voice),behavior=behaviorFor(c);return `<span class=\"story-character-avatar expr-${expr}\" data-character=\"${escapeHtml(c.name)}\" data-color=\"${escapeHtml(c.color)}\" data-suit=\"${escapeHtml(c.suit)}\" data-expression=\"${expr}\" data-behavior=\"${behavior.token}\" style=\"${characterVars(c)}\"><span class=\"story-character-avatar-suit\">${charSuitSvg(c.suit)}</span><span class=\"story-character-avatar-face\"><span class=\"story-character-avatar-eyes\"><i></i><i></i></span><i class=\"story-character-avatar-mouth\"></i></span></span>`}
function characterChip(c){const behavior=behaviorFor(c);return `<div class=\"story-character-chip\" data-character=\"${escapeHtml(c.name)}\">${characterAvatar(c,c.contribution)}<span class=\"story-character-copy\"><strong>${escapeHtml(c.name)}</strong><small>${escapeHtml(c.shortRole||c.role)}</small><em>${escapeHtml(behavior.label)}</em></span></div>`}
function residentCard(c){const behavior=behaviorFor(c);return `<div class=\"story-person story-person-portrait\" data-character=\"${escapeHtml(c.name)}\" data-behavior=\"${behavior.token}\">${characterAvatar(c,c.contribution)}<span class=\"story-person-copy\"><strong>${escapeHtml(c.name)}</strong><span>${escapeHtml(c.role)}. ${escapeHtml(c.voice)}</span><small class=\"story-person-action\">${escapeHtml(behavior.label)}</small>${c.contribution?`<small class=\"story-person-contribution\">${escapeHtml(c.contribution)}</small>`:''}</span></div>`}
""", 'dynamic character presentation')
    text = regex_once(text, r"function vignette\(meta,featured=\[\]\)\{.*?\}\n", """function vignette(meta,featured=[],line=''){const props=decorFor(meta),people=featured.slice(0,2),fixture=STORY.movementFixtureFor?STORY.movementFixtureFor(meta.level):null,fixtureHtml=fixture?`<span class=\"story-scene-fixture fixture-${escapeHtml(fixture.kind)}\" data-fixture=\"${escapeHtml(fixture.id)}\" data-fixture-kind=\"${escapeHtml(fixture.kind)}\" title=\"${escapeHtml(fixture.label)}\"><i></i><b></b></span>`:'';return `<div class=\"story-scene-land\"></div>${props.map((p,i)=>`<span class=\"story-scene-prop scene-p${i+1} prop-${p}\">${iconSvg(p)}</span>`).join('')}${fixtureHtml}<span class=\"story-scene-route\"></span>${people.map((c,i)=>characterPortrait(c,i,people.length,line)).join('')}`}
""", 'shared story fixture')
    show_fn = r'''function show(level,manual=false){
 if(!STORY)return;
 const meta=STORY.levelMeta(level),chapter=STORY.chapters[meta.chapter-1],overlay=document.getElementById('storyCardOverlay');if(!overlay)return;
 const movement=STORY.movementForLevel?STORY.movementForLevel(level):null,movementStart=meta.local===1||meta.local%10===1,featured=featuredFor(meta,chapter),automatic=!manual&&movementStart,movementClue=automatic&&!!movement,storyRole=movementClue?'movement-clue':'route-context';
 const title=movementClue?movement.title:meta.title,line=movementClue?movement.setup:meta.context,goal=movementClue?movement.question:`Help the local crew complete ${meta.title.toLowerCase()}.`,more=movementClue?[movement.stakes].filter(Boolean).join(' '):(manual?meta.flavor:''),lineResident=(STORY.cast||[]).find(c=>line.includes(c.name))||featured[0]||null;
 overlay.className=`story-card-overlay story-card-ch${meta.chapter} story-card-${movementStart?'chapter':'route'} show`;overlay.dataset.level=String(level);overlay.dataset.manual=manual?'1':'0';overlay.dataset.featured=featured.map(c=>c.name).join(',');overlay.dataset.storyRole=storyRole;
 document.getElementById('storyCardKind').textContent=movementClue?'Movement clue':'Route context';document.getElementById('storyCardLocation').textContent=`Chapter ${meta.chapter} · ${meta.location}`;document.getElementById('storyCardTitle').textContent=title;const scene=document.getElementById('storyCardScene'),roleMarker=movementClue?'<span data-story-role="movement-clue" hidden></span>':'<span data-story-role="route-context" hidden></span>';scene.innerHTML=roleMarker+vignette(meta,featured,line);scene.dataset.primaryProp=decorFor(meta)[0]||'';scene.dataset.fixture=STORY.movementFixtureFor?STORY.movementFixtureFor(level).id:'';scene.setAttribute('aria-label',`${meta.location}: ${title}`);const lineEl=document.getElementById('storyCardLine');if(lineEl)lineEl.innerHTML=`${lineResident?characterAvatar(lineResident,line):''}<span><strong>${escapeHtml(lineResident?.name||'Route note')}</strong><em>${escapeHtml(line)}</em></span>`;const goalEl=document.getElementById('storyCardGoal');if(goalEl)goalEl.innerHTML=`<strong>${movementClue?'Question':'Goal'}</strong><span>${escapeHtml(goal)}</span>`;const moreEl=document.getElementById('storyCardMore'),moreCopy=document.getElementById('storyCardMoreCopy');if(moreEl){moreEl.hidden=!more;moreEl.open=false}if(moreCopy)moreCopy.textContent=more;
 const characters=document.getElementById('storyCardCharacters');if(characters){characters.innerHTML='';characters.hidden=true;characters.classList.remove('is-pair')}
 const crew=document.getElementById('storyCardCrewNote');if(crew){const showCrew=meta.level===1;crew.hidden=!showCrew;const copy=crew.querySelector('span');if(copy)copy.textContent=showCrew?`${STORY.helperCrewMotto} The Latchlings on the board are the local helper crew working this route with you.`:''}
 document.getElementById('storyCardContinue').textContent=manual?'Back to board':'Start route';overlay.setAttribute('aria-hidden','false');requestAnimationFrame(()=>document.getElementById('storyCardContinue')?.focus())
}
'''
    text = regex_once(text, r"function show\(level,manual=false\)\{.*?\n\}\nfunction close", show_fn + 'function close', 'story card role separation')
    text = replace_once(text, 'window.LatchlingsStoryTheme={decorateLevel,enterLevel,show,close,decorFor,iconSvg,autoEligible,featuredFor,characterChip,residentCard};', 'window.LatchlingsStoryTheme={decorateLevel,enterLevel,show,close,decorFor,iconSvg,autoEligible,featuredFor,characterChip,residentCard,expressionForLine,behaviorFor};', 'story theme export')
    write(path, text)


def patch_game_b():
    path = 'game400-b.js'
    text = read(path)
    if 'data-story-role="result"' not in text:
        text = replace_once(text, '<div class="story-beat story-beat-result">', '<div class="story-beat story-beat-result" data-story-role="result">', 'milestone result role')
    if 'data-story-role="briefing"' not in text:
        text = replace_once(text, '<div class="story-now-chapter">', '<div class="story-now-chapter" data-story-role="briefing">', 'journal briefing role')
    if 'data-story-role="recap"' not in text:
        text = replace_once(text, '<div class="story-journey-item ${j.status===\'Restored\'?\'done\':\'current\'}">', '<div class="story-journey-item ${j.status===\'Restored\'?\'done\':\'current\'}" data-story-role="recap">', 'journal recap role')
    write(path, text)


def patch_home():
    path = 'title-island-concepts/index.html'
    text = read(path)
    if 'data-resident="Pip"' not in text:
        text = replace_once(text, '<div class="latchling resident child kid-one l5" data-role="child" data-activity="play" data-color="blue" data-suit="spade" data-expr="happy"></div><div class="latchling resident child kid-two l6" data-role="child" data-activity="play" data-color="coral" data-suit="heart" data-expr="surprised"></div>', '<div class="latchling resident child kid-one l5" data-role="child" data-resident="Pip" data-activity="play" data-color="blue" data-suit="spade" data-expr="determined"></div><div class="latchling resident child kid-two l6" data-role="child" data-resident="Tansy" data-activity="play" data-color="coral" data-suit="heart" data-expr="happy"></div>', 'child resident identities')
    routes = """const littleHomeAdultRoutes={
 garden:[
  {x:0,y:0,target:'potting table',action:'sorting seeds',hold:500},
  {x:16,y:-4,target:'yellow flowers',action:'watering flowers',hold:900},
  {x:-26,y:-24,target:'blue flowers',action:'checking new growth',hold:900},
  {x:24,y:-50,target:'market bunting',action:'straightening the market bunting',hold:900,minStage:4,keepsake:'bunting'},
  {x:0,y:0,target:'potting table',action:'putting the watering can away',hold:450,record:false}
 ],
 parcel:[
  {x:0,y:0,target:'cottage porch',action:'checking the delivery list',hold:500},
  {x:28,y:-10,target:'garden path',action:'carrying a parcel',hold:350},
  {x:54,y:5,target:'mailbox',action:'delivering the morning mail',hold:1000,minStage:1,keepsake:'mailbox'},
  {x:34,y:-27,target:'visitor pennant',action:'checking for visitors',hold:800,minStage:2,keepsake:'pennant'},
  {x:78,y:20,target:'arrival platform',action:'meeting the next arrival',hold:950,minStage:7,keepsake:'dock'},
  {x:0,y:0,target:'cottage porch',action:'marking the route complete',hold:450,record:false}
 ],
 tree:[
  {x:0,y:0,target:'tree path',action:'gathering the yard tools',hold:450},
  {x:7,y:12,target:'old tree',action:'tending the roots',hold:900},
  {x:48,y:42,target:'anchor line',action:'checking the restored anchor line',hold:900,minStage:3,keepsake:'anchor'},
  {x:118,y:14,target:'Prism telescope',action:'measuring the current drift',hold:1000,minStage:5,keepsake:'telescope'},
  {x:2,y:32,target:'Waykeeper compass',action:'checking the old compass',hold:1000,minStage:6,keepsake:'relic'},
  {x:0,y:0,target:'tree path',action:'putting the tools away',hold:450,record:false}
 ]
};"""
    text = regex_once(text, r"const littleHomeAdultRoutes=\{.*?\n\};", routes, 'complete keepsake-use routes')
    text = replace_once(text, "const clearLittleHomeWorkState=adult=>{if(!adult)return;adult.classList.remove('work-active');adult.dataset.motionState='idle';adult.dataset.workAction=''};", "const clearLittleHomeWorkState=adult=>{if(!adult)return;adult.classList.remove('work-active');adult.dataset.motionState='idle';adult.dataset.workAction='';adult.dataset.keepsakeUse='';document.querySelectorAll('#c2 .story-keepsake.is-being-used').forEach(x=>x.classList.remove('is-being-used'))};", 'work state cleanup')
    old = "if(next.action){adult.classList.add('work-active');adult.dataset.motionState='working';if(next.record!==false){adult.dataset.lastWorkTarget=next.target||'';adult.dataset.lastWorkAction=next.action;}await littleHomeDelay(next.hold||550);adult.classList.remove('work-active');adult.dataset.motionState='moving'}"
    new = "if(next.action){const keepsake=next.keepsake?document.querySelector(`#c2 [data-memory=\\\"${next.keepsake}\\\"]`):null;adult.classList.add('work-active');adult.dataset.motionState='working';adult.dataset.keepsakeUse=next.keepsake||'';if(keepsake)keepsake.classList.add('is-being-used');if(next.record!==false){adult.dataset.lastWorkTarget=next.target||'';adult.dataset.lastWorkAction=next.action;}await littleHomeDelay(next.hold||550);if(keepsake)keepsake.classList.remove('is-being-used');adult.dataset.keepsakeUse='';adult.classList.remove('work-active');adult.dataset.motionState='moving'}"
    text = replace_once(text, old, new, 'adult keepsake interaction state')
    marker = "function restartLittleHomeTitle(){const logo=document.querySelector('#c2 .toy-logo');"
    behavior = r'''
const littleHomeKeepsakeUses=[
 {keepsake:'mailbox',resident:'Bramble'},{keepsake:'pennant',resident:'Bramble'},{keepsake:'anchor',resident:'Rowan'},{keepsake:'bunting',resident:'Pippa'},{keepsake:'telescope',resident:'Rowan'},{keepsake:'relic',resident:'Rowan'},{keepsake:'dock',resident:'Bramble'}
];
async function runLittleHomeFocusedKeepsake(key){
 const use=littleHomeKeepsakeUses.find(x=>x.keepsake===key);if(!use||!littleHomeMotionAllowed())return false;const adult=littleHomeAdults.find(x=>x.dataset.resident===use.resident);if(!adult)return false;const route=littleHomeRouteFor(adult),step=route.find(x=>x.keepsake===key),base=route[0];if(!step)return false;stopLittleHomeAdultMotion();adult.style.transform=littleHomeStepTransform(base);adult.dataset.motionState='moving';if(littleHomeRoot)littleHomeRoot.dataset.activeAdult=adult.dataset.resident||'';const anim=adult.animate([{transform:littleHomeStepTransform(base)},{transform:littleHomeStepTransform(step)}],{duration:520,easing:'cubic-bezier(.2,.72,.2,1)',fill:'forwards'});littleHomeAdultAnimation=anim;try{await anim.finished}catch{}if(littleHomeAdultAnimation===anim)littleHomeAdultAnimation=null;if(!littleHomeMotionAllowed()){clearLittleHomeWorkState(adult);return false}adult.style.transform=littleHomeStepTransform(step);anim.cancel();const keepsake=document.querySelector(`#c2 [data-memory="${key}"]`);adult.classList.add('work-active');adult.dataset.motionState='working';adult.dataset.keepsakeUse=key;adult.dataset.lastWorkTarget=step.target||key;adult.dataset.lastWorkAction=step.action||'using keepsake';if(keepsake)keepsake.classList.add('is-being-used');await littleHomeDelay(900);if(keepsake)keepsake.classList.remove('is-being-used');adult.dataset.keepsakeUse='';adult.classList.remove('work-active');if(!littleHomeMotionAllowed()){clearLittleHomeWorkState(adult);return false}const back=adult.animate([{transform:littleHomeStepTransform(step)},{transform:littleHomeStepTransform(base)}],{duration:480,easing:'cubic-bezier(.2,.72,.2,1)',fill:'forwards'});littleHomeAdultAnimation=back;try{await back.finished}catch{}if(littleHomeAdultAnimation===back)littleHomeAdultAnimation=null;adult.style.transform=littleHomeStepTransform(base);back.cancel();clearLittleHomeWorkState(adult);if(littleHomeRoot)littleHomeRoot.dataset.activeAdult='';if(littleHomeMotionAllowed())scheduleNextLittleHomeAdultMove();return true
}
const littleHomeChildBehaviors={
 Pip:{resident:'Pip',steps:[{x:0,y:0,target:'yard ball',action:'plotting a shortcut',expr:'determined'},{x:-18,y:-43,target:'old route marker',action:'checking an overlooked marker',expr:'curious'},{x:18,y:-28,target:'tree path',action:'testing a shortcut',expr:'smug'},{x:0,y:0,target:'yard ball',action:'calling the clue found',expr:'happy'}]},
 Tansy:{resident:'Tansy',steps:[{x:0,y:0,target:'yard ball',action:'keeping score',expr:'happy'},{x:30,y:-44,target:'distant porch lights',action:'watching for a missed visit',expr:'curious'},{x:55,y:-24,target:'visitor pennant',action:'checking whether friends can visit',expr:'happy',minStage:2},{x:0,y:0,target:'yard ball',action:'telling Pip what changed',expr:'surprised'}]}
};
const littleHomeChildren=[...document.querySelectorAll('#c2 .resident.child')];let littleHomeChildTimer=0,littleHomeChildAnimation=null,littleHomeChildTurn=0;
const littleHomeExprClasses=['happy','surprised','angry','smug','sleepy','curious','determined'];
const setLittleHomeExpression=(el,expr)=>{littleHomeExprClasses.forEach(x=>el.classList.remove('expr-'+x));el.classList.add('expr-'+expr);el.dataset.expr=expr;el.dataset.expression=expr};
const stopLittleHomeChildMotion=()=>{clearTimeout(littleHomeChildTimer);littleHomeChildTimer=0;if(littleHomeChildAnimation){littleHomeChildAnimation.cancel();littleHomeChildAnimation=null}littleHomeChildren.forEach(child=>{child.classList.remove('behavior-active');child.dataset.behaviorAction='';child.dataset.behaviorTarget='';child.style.transform='translate(0px,0px)'})};
const scheduleLittleHomeChildBehavior=()=>{clearTimeout(littleHomeChildTimer);littleHomeChildTimer=0;if(!littleHomeMotionAllowed()||!littleHomeChildren.length)return;const wait=Math.round(littleHomeRandom(3600,6200));if(littleHomeRoot)littleHomeRoot.dataset.nextChildMoveMs=String(wait);littleHomeChildTimer=setTimeout(()=>{littleHomeChildTimer=0;runLittleHomeChildBehavior()},wait)};
async function runLittleHomeChildBehavior(name=''){
 if(!littleHomeMotionAllowed())return false;const child=name?littleHomeChildren.find(x=>x.dataset.resident===name):littleHomeChildren[littleHomeChildTurn++%littleHomeChildren.length];if(!child)return false;const def=littleHomeChildBehaviors[child.dataset.resident];if(!def)return false;const steps=def.steps.filter(x=>!x.minStage||littleHomeStoryStage>=x.minStage);let current={x:0,y:0};for(const next of steps){if(!littleHomeMotionAllowed())break;setLittleHomeExpression(child,next.expr);child.dataset.behaviorTarget=next.target;child.dataset.behaviorAction=next.action;const a=child.animate([{transform:`translate(${current.x}px,${current.y}px)`},{transform:`translate(${next.x}px,${next.y}px)`}],{duration:430,easing:'cubic-bezier(.2,.72,.2,1)',fill:'forwards'});littleHomeChildAnimation=a;try{await a.finished}catch{}if(littleHomeChildAnimation===a)littleHomeChildAnimation=null;if(!littleHomeMotionAllowed()){a.cancel();break}child.style.transform=`translate(${next.x}px,${next.y}px)`;a.cancel();child.classList.add('behavior-active');await new Promise(r=>setTimeout(r,520));child.classList.remove('behavior-active');current=next}child.style.transform='translate(0px,0px)';child.dataset.behaviorTarget='';child.dataset.behaviorAction='';if(littleHomeMotionAllowed())scheduleLittleHomeChildBehavior();return true
}
const syncLittleHomeChildMotion=()=>{if(!littleHomeMotionAllowed()){stopLittleHomeChildMotion();return}if(!littleHomeChildTimer&&!littleHomeChildAnimation)scheduleLittleHomeChildBehavior()};
littleHomeMotionQuery.addEventListener?.('change',syncLittleHomeChildMotion);try{if(parent&&parent!==window&&parent.document?.body)new MutationObserver(syncLittleHomeChildMotion).observe(parent.document.body,{attributes:true,attributeFilter:['data-screen']})}catch(_){}syncLittleHomeChildMotion();
window.LatchlingsHomeLife={runAdult:runLittleHomeAdultMove,runChild:runLittleHomeChildBehavior,runKeepsake:runLittleHomeFocusedKeepsake,keepsakeUses:littleHomeKeepsakeUses};

'''
    text = replace_once(text, marker, behavior + marker, 'home behavior scheduler')
    text = replace_once(text, "syncLittleHomeMotion();phone.classList.remove('story-focus-mailbox','story-focus-pennant','story-focus-anchor','story-focus-bunting');", "syncLittleHomeMotion();syncLittleHomeChildMotion();phone.classList.remove('story-focus-mailbox','story-focus-pennant','story-focus-anchor','story-focus-bunting');", 'child motion preference sync')
    old_focus = "if(e.data.focus==='bunting'){void phone.offsetWidth;phone.classList.add('story-focus-bunting');setTimeout(()=>phone.classList.remove('story-focus-bunting'),2200)}if(e.data.replay)restartLittleHomeTitle()"
    new_focus = "if(e.data.focus==='bunting'){void phone.offsetWidth;phone.classList.add('story-focus-bunting');setTimeout(()=>phone.classList.remove('story-focus-bunting'),2200)}if(['telescope','relic','dock'].includes(e.data.focus)){const target=c2.querySelector(`[data-memory=\\\"${e.data.focus}\\\"]`);if(target){target.classList.add('reward-focus');setTimeout(()=>target.classList.remove('reward-focus'),2200)}}if(e.data.focus)setTimeout(()=>runLittleHomeFocusedKeepsake(e.data.focus),240);if(e.data.replay)restartLittleHomeTitle()"
    text = replace_once(text, old_focus, new_focus, 'focused keepsake resident use')
    css = r'''

/* Astra character/world coherence: authored child behavior and visible keepsake use. */
#c2 .kid-one,#c2 .kid-two{animation:none!important}
#c2 .play-ball{animation:none!important}
#c2 .resident.child.behavior-active{z-index:25;filter:drop-shadow(0 0 5px rgba(255,243,170,.92))}
#c2 .resident.child.behavior-active:before{content:"";position:absolute;left:50%;top:-8px;width:5px;height:5px;border-radius:50%;background:#fff0a0;box-shadow:-6px 3px 0 -1px #fff8c5,6px 3px 0 -1px #fff8c5;translate:-50% 0}
#c2 .story-keepsake.is-being-used{display:block!important;z-index:24;filter:drop-shadow(0 0 7px rgba(255,224,112,.95)) drop-shadow(0 0 2px rgba(255,255,255,.9))}
#c2 .story-keepsake.reward-focus{display:block!important;z-index:26;animation:coherenceKeepsakeFocus 1500ms cubic-bezier(.2,.8,.2,1) both}
@keyframes coherenceKeepsakeFocus{0%{filter:drop-shadow(0 0 0 rgba(255,226,111,0))}28%{filter:drop-shadow(0 0 10px rgba(255,226,111,.95))}100%{filter:drop-shadow(0 0 3px rgba(255,226,111,.42))}}
html[data-motion="reduced"] #c2 .story-keepsake.reward-focus{animation:none!important;filter:drop-shadow(0 0 5px rgba(255,226,111,.65))}
'''
    text = text.replace('\n</style>', css + '\n</style>', 1)
    write(path, text)


def patch_game_a():
    path = 'game400-a.js'
    text = read(path)
    if 'function atlasLandmarkFor' in text and 'data-landmark-label' in text:
        return
    block = r'''

/* Astra character/world coherence: movement fixtures become authored Atlas destinations. */
const ASTRA_ATLAS_LANDMARK_FALLBACK=[
 ['Morning Route Table','Route Mailbox','Old Waykeeper Marker','Safe-Stop Garden','Sunpetal Return'],
 ['Lanternwood Crossing','Travel-Window Post','Twin-Lantern Porch','Neighborhood Stop Marker','Visitor Landing'],
 ['Buried Anchor','Old Waykeeper Marker','Maintenance Desk','Shifted Anchor Line','Restored Anchor'],
 ['Outer Market Gate','Suit-Marked Lane','Old Civic Suit Arch','Distant Station Board','Market Bunting Square'],
 ['Prism Lookout','Long-Drift Sighting Arch','Twin-Lantern Porch','Yesterday Map Table','Telescope Terrace'],
 ['Route-Plate Archive','Dated Map Rack','Approved Map Room','Automation Desk','Compass Platform'],
 ['Two-Region Relay','Travel-Window Dial','Correction-Lamp Relay','Living Signal Board','Arrival Platform'],
 ['Crown Convergence','Living Skyway Map','Twin-Lantern Porch','Little Home Route Desk','Tomorrow Route Beacon']
];
function atlasLandmarkFor(chapter,range){const ch=Math.max(1,Math.min(8,Number(chapter)||1)),r=Math.max(0,Math.min(4,Number(range)||0)),level=(ch-1)*50+(r+1)*10,fixture=STORY&&STORY.movementFixtureFor?STORY.movementFixtureFor(level):null;return fixture||{id:`atlas-${ch}-${r}`,label:ASTRA_ATLAS_LANDMARK_FALLBACK[ch-1][r],kind:['table','marker','porch','archive','crown'][r],chapter:ch,index:r,level}}
function applyAstraAtlasLandmark(){const map=document.getElementById('levelGrid');if(!map)return;const landmark=atlasLandmarkFor(chapterView,rangeView),node=map.querySelector('.atlas-node.milestone');if(!node)return;node.setAttribute('data-landmark-label',landmark.label);node.dataset.landmarkKind=landmark.kind;node.dataset.landmarkIndex=String(rangeView);node.dataset.fixture=landmark.id;const oldLabel=node.getAttribute('aria-label')||'';if(!oldLabel.includes(landmark.label))node.setAttribute('aria-label',`${oldLabel}, ${landmark.label} landmark`);const prop=node.querySelector('.atlas-prop');if(prop){prop.classList.add('authored-landmark-prop');prop.dataset.landmarkKind=landmark.kind;prop.innerHTML=`<span class="atlas-landmark-mark" data-kind="${landmark.kind}" aria-hidden="true"><i></i><b></b></span>`}map.querySelector('.atlas-landmark-caption')?.remove();const caption=document.createElement('div');caption.className='atlas-route-caption atlas-landmark-caption';caption.dataset.fixture=landmark.id;caption.innerHTML=`<span>Destination · ${rangeView+1} of 5</span><b>${landmark.label}</b>`;map.appendChild(caption)}
const astraRenderChapterBase=renderChapter;renderChapter=function(){const out=astraRenderChapterBase.apply(this,arguments);applyAstraAtlasLandmark();return out};
window.LatchlingsAtlasLandmarks={atlasLandmarkFor,apply:applyAstraAtlasLandmark};
'''
    text += block
    write(path, text)


def patch_styles():
    path = 'style400-story-theme.css'
    text = read(path)
    marker = '/* Astra character/world coherence fixtures */'
    if marker not in text:
        text += r'''

/* Astra character/world coherence fixtures */
.story-scene-fixture{position:absolute;right:10%;bottom:16%;width:54px;height:44px;z-index:4;filter:drop-shadow(0 4px 4px rgba(24,45,60,.2));pointer-events:none}
.story-scene-fixture>i,.story-scene-fixture>b{position:absolute;display:block;box-sizing:border-box}
.story-scene-fixture.fixture-porch{width:58px;height:39px;border-radius:9px 9px 4px 4px;background:#7e6046;border:3px solid #4d4238;box-shadow:inset 0 9px #b89a73}.story-scene-fixture.fixture-porch:before{content:"";position:absolute;left:-5px;right:-5px;top:-9px;height:12px;background:#58453a;clip-path:polygon(8% 100%,22% 0,78% 0,94% 100%)}.story-scene-fixture.fixture-porch>i,.story-scene-fixture.fixture-porch>b{top:8px;width:8px;height:11px;border-radius:4px;background:#ffd36b;box-shadow:0 0 9px #ffc95c}.story-scene-fixture.fixture-porch>i{left:9px}.story-scene-fixture.fixture-porch>b{right:9px}
.story-scene-fixture.fixture-marker{width:35px;height:45px;border-radius:8px 8px 4px 4px;background:#8a8f87;border:2px solid #616b68}.story-scene-fixture.fixture-marker:before{content:"";position:absolute;inset:8px;border:3px solid #aee7e8;border-radius:50%}.story-scene-fixture.fixture-marker:after{content:"";position:absolute;right:-10px;top:9px;width:17px;height:3px;background:#f4e6bd;box-shadow:0 7px #f4e6bd,0 14px #f4e6bd;rotate:-7deg}
.story-scene-fixture.fixture-anchor{width:42px;height:42px;border:4px solid #74d4df;border-radius:50%}.story-scene-fixture.fixture-anchor:before{content:"";position:absolute;left:50%;top:16px;width:4px;height:30px;background:#5b8799;translate:-50% 0}.story-scene-fixture.fixture-anchor:after{content:"";position:absolute;left:4px;right:4px;bottom:-8px;height:13px;border:4px solid #5b8799;border-top:0;border-radius:0 0 20px 20px}
.story-scene-fixture.fixture-gate{width:48px;height:42px;border:7px solid #746678;border-bottom:0;border-radius:24px 24px 3px 3px}.story-scene-fixture.fixture-gate:after{content:"♠  ♦";position:absolute;left:-7px;right:-7px;bottom:-4px;font-size:9px;letter-spacing:7px;text-align:center;color:#2d2734}
.story-scene-fixture.fixture-observatory,.story-scene-fixture.fixture-telescope{width:51px;height:31px;border:3px solid rgba(232,255,255,.85);border-radius:28px 28px 6px 6px;background:rgba(123,205,211,.24)}.story-scene-fixture.fixture-observatory:after,.story-scene-fixture.fixture-telescope:after{content:"";position:absolute;width:32px;height:8px;border-radius:8px;background:#617a7a;right:-12px;top:5px;rotate:-16deg;box-shadow:10px 1px 0 -2px #caa05a}
.story-scene-fixture.fixture-archive,.story-scene-fixture.fixture-table{width:50px;height:31px;border-radius:5px;background:#9b6849;border:3px solid #68462f}.story-scene-fixture.fixture-archive:before,.story-scene-fixture.fixture-table:before{content:"";position:absolute;left:7px;top:-9px;width:34px;height:19px;background:#f1dfb6;border:1px solid #937657;box-shadow:4px -3px 0 #e2ca9e,-4px -6px 0 #f6e8c9;rotate:-3deg}
.story-scene-fixture.fixture-relay,.story-scene-fixture.fixture-signal{width:44px;height:38px;border-radius:6px;background:#526a78;border:3px solid #314957}.story-scene-fixture.fixture-relay:before,.story-scene-fixture.fixture-signal:before{content:"";position:absolute;left:7px;right:7px;top:8px;height:7px;border-radius:5px;background:#6fd4ed;box-shadow:0 11px 0 #f1b45b}.story-scene-fixture.fixture-relay:after,.story-scene-fixture.fixture-signal:after{content:"";position:absolute;left:50%;top:-17px;width:3px;height:19px;background:#9ac7d3;translate:-50% 0}
.story-scene-fixture.fixture-crown{width:52px;height:37px;background:linear-gradient(180deg,#d5ffff,#89d7ce);clip-path:polygon(0 100%,9% 34%,27% 64%,42% 5%,57% 64%,77% 31%,100% 100%);filter:drop-shadow(0 0 7px rgba(115,230,214,.7))}
.story-scene-fixture.fixture-mailbox{width:42px;height:27px;border-radius:10px 10px 4px 4px;background:#f2dca9;border:3px solid #8e6843}.story-scene-fixture.fixture-mailbox:after{content:"";position:absolute;left:16px;top:23px;width:5px;height:23px;background:#775236}
.story-scene-fixture.fixture-pennant,.story-scene-fixture.fixture-bunting{width:4px;height:40px;background:#7e5a3c}.story-scene-fixture.fixture-pennant:after,.story-scene-fixture.fixture-bunting:after{content:"";position:absolute;left:4px;top:3px;width:35px;height:18px;background:linear-gradient(90deg,#e98a82,#efc65c,#7aa87d);clip-path:polygon(0 0,100% 15%,75% 100%,0 73%)}
.story-scene-fixture.fixture-compass{width:38px;height:38px;border-radius:50%;background:#f1d59b;border:4px solid #b48546}.story-scene-fixture.fixture-compass:after{content:"";position:absolute;left:16px;top:5px;width:4px;height:23px;background:#274563;rotate:27deg}
.story-scene-fixture.fixture-dock{width:58px;height:22px;border-radius:5px;background:#9a704d;border:3px solid #684a35;rotate:-4deg}.story-scene-fixture.fixture-dock:after{content:"";position:absolute;inset:4px 14px;border-left:3px solid #5f4433;border-right:3px solid #5f4433}
.story-scene-fixture.fixture-garden{width:54px;height:24px;border-radius:50%;background:radial-gradient(circle at 20% 50%,#f2c65e 0 12%,transparent 14%),radial-gradient(circle at 50% 30%,#72aef5 0 12%,transparent 14%),radial-gradient(circle at 78% 58%,#e7898d 0 12%,transparent 14%),#78a969}
.story-person-action{display:block!important;margin-top:4px;font-weight:900;color:var(--ink,#264b78)}
.story-person[data-behavior="clue"] .story-character-avatar,.story-person[data-behavior="visit"] .story-character-avatar{filter:drop-shadow(0 2px 4px rgba(255,209,91,.28))}
'''
        write(path, text)

    path = 'style400-skyway-atlas.css'
    text = read(path)
    marker = '/* Astra authored Atlas destination landmarks */'
    if marker not in text:
        text += r'''

/* Astra authored Atlas destination landmarks */
.atlas-node.milestone .atlas-prop.authored-landmark-prop{width:45px;height:38px;top:-5px;scale:1;rotate:0deg!important;overflow:visible}
.atlas-node.milestone .atlas-prop.authored-landmark-prop:before,.atlas-node.milestone .atlas-prop.authored-landmark-prop:after,.atlas-node.milestone .atlas-prop.authored-landmark-prop>i,.atlas-node.milestone .atlas-prop.authored-landmark-prop>b{opacity:.12}
.atlas-landmark-mark{position:absolute;left:50%;top:50%;translate:-50% -50%;width:39px;height:31px;z-index:6;display:block;filter:drop-shadow(0 3px 2px rgba(22,38,48,.24));box-sizing:border-box}
.atlas-landmark-mark>i,.atlas-landmark-mark>b{position:absolute;display:block;box-sizing:border-box}
.atlas-landmark-mark[data-kind="porch"]{border-radius:6px;background:#7f6248;border:2px solid #4c4137;box-shadow:inset 0 7px #b89a73}.atlas-landmark-mark[data-kind="porch"]:before{content:"";position:absolute;left:-3px;right:-3px;top:-7px;height:9px;background:#57453a;clip-path:polygon(8% 100%,22% 0,78% 0,94% 100%)}.atlas-landmark-mark[data-kind="porch"]>i,.atlas-landmark-mark[data-kind="porch"]>b{top:7px;width:6px;height:8px;border-radius:50%;background:#ffd36b;box-shadow:0 0 7px #ffc95c}.atlas-landmark-mark[data-kind="porch"]>i{left:7px}.atlas-landmark-mark[data-kind="porch"]>b{right:7px}
.atlas-landmark-mark[data-kind="marker"]{width:24px;height:34px;border-radius:6px;background:#858c87;border:2px solid #5e6967}.atlas-landmark-mark[data-kind="marker"]:before{content:"";position:absolute;inset:6px;border:2px solid #a8e3e8;border-radius:50%}.atlas-landmark-mark[data-kind="marker"]:after{content:"";position:absolute;right:-8px;top:6px;width:12px;height:2px;background:#f1dfb9;box-shadow:0 5px #f1dfb9,0 10px #f1dfb9}
.atlas-landmark-mark[data-kind="anchor"]{width:30px;height:30px;border:3px solid #7cd8e4;border-radius:50%}.atlas-landmark-mark[data-kind="anchor"]:before{content:"";position:absolute;left:50%;top:12px;width:3px;height:22px;background:#587e91;translate:-50% 0}.atlas-landmark-mark[data-kind="anchor"]:after{content:"";position:absolute;left:3px;right:3px;bottom:-6px;height:9px;border:3px solid #587e91;border-top:0;border-radius:0 0 15px 15px}
.atlas-landmark-mark[data-kind="gate"]{width:35px;height:30px;border:5px solid #746678;border-bottom:0;border-radius:18px 18px 3px 3px}.atlas-landmark-mark[data-kind="gate"]:after{content:"♠♦";position:absolute;left:-5px;right:-5px;bottom:-4px;font-size:7px;letter-spacing:6px;text-align:center;color:#282332}
.atlas-landmark-mark[data-kind="observatory"],.atlas-landmark-mark[data-kind="telescope"]{width:37px;height:23px;border:2px solid rgba(238,255,255,.9);border-radius:21px 21px 5px 5px;background:rgba(113,204,211,.3)}.atlas-landmark-mark[data-kind="observatory"]:after,.atlas-landmark-mark[data-kind="telescope"]:after{content:"";position:absolute;width:22px;height:6px;border-radius:6px;background:#61797b;right:-7px;top:4px;rotate:-15deg;box-shadow:8px 1px 0 -2px #c79a55}
.atlas-landmark-mark[data-kind="archive"],.atlas-landmark-mark[data-kind="table"]{width:36px;height:23px;border-radius:4px;background:#986649;border:2px solid #67462f}.atlas-landmark-mark[data-kind="archive"]:before,.atlas-landmark-mark[data-kind="table"]:before{content:"";position:absolute;left:5px;top:-7px;width:25px;height:13px;background:#f1dfb6;border:1px solid #94775a;box-shadow:3px -2px 0 #e2ca9e,-3px -4px 0 #f7e9cb;rotate:-3deg}
.atlas-landmark-mark[data-kind="relay"],.atlas-landmark-mark[data-kind="signal"]{width:31px;height:29px;border-radius:5px;background:#516a79;border:2px solid #314957}.atlas-landmark-mark[data-kind="relay"]:before,.atlas-landmark-mark[data-kind="signal"]:before{content:"";position:absolute;left:5px;right:5px;top:6px;height:5px;border-radius:4px;background:#6fd4ed;box-shadow:0 8px 0 #efb15b}.atlas-landmark-mark[data-kind="relay"]:after,.atlas-landmark-mark[data-kind="signal"]:after{content:"";position:absolute;left:50%;top:-12px;width:2px;height:14px;background:#9bc8d4;translate:-50% 0}
.atlas-landmark-mark[data-kind="crown"]{width:38px;height:29px;background:linear-gradient(180deg,#d7ffff,#88d7cd);clip-path:polygon(0 100%,9% 36%,27% 66%,42% 4%,57% 65%,77% 31%,100% 100%);filter:drop-shadow(0 0 6px rgba(113,230,213,.72))}
.atlas-landmark-mark[data-kind="mailbox"]{width:30px;height:20px;border-radius:8px 8px 3px 3px;background:#f1dba8;border:2px solid #8d6843}.atlas-landmark-mark[data-kind="mailbox"]:after{content:"";position:absolute;left:11px;top:17px;width:4px;height:17px;background:#765237}
.atlas-landmark-mark[data-kind="pennant"],.atlas-landmark-mark[data-kind="bunting"]{width:3px;height:31px;background:#7d593d}.atlas-landmark-mark[data-kind="pennant"]:after,.atlas-landmark-mark[data-kind="bunting"]:after{content:"";position:absolute;left:3px;top:2px;width:27px;height:14px;background:linear-gradient(90deg,#e88982,#efc55d,#7ca77c);clip-path:polygon(0 0,100% 15%,74% 100%,0 73%)}
.atlas-landmark-mark[data-kind="compass"]{width:29px;height:29px;border-radius:50%;background:#f0d49a;border:3px solid #b38446}.atlas-landmark-mark[data-kind="compass"]:after{content:"";position:absolute;left:12px;top:4px;width:3px;height:18px;background:#294664;rotate:27deg}
.atlas-landmark-mark[data-kind="dock"]{width:39px;height:17px;border-radius:4px;background:#98704e;border:2px solid #674a35;rotate:-4deg}.atlas-landmark-mark[data-kind="dock"]:after{content:"";position:absolute;inset:3px 10px;border-left:2px solid #604534;border-right:2px solid #604534}
.atlas-landmark-mark[data-kind="garden"]{width:39px;height:18px;border-radius:50%;background:radial-gradient(circle at 20% 50%,#f1c45d 0 12%,transparent 14%),radial-gradient(circle at 50% 30%,#72aef5 0 12%,transparent 14%),radial-gradient(circle at 78% 58%,#e7888d 0 12%,transparent 14%),#77a969}
.atlas-landmark-caption{max-width:68%;pointer-events:none}.atlas-landmark-caption b{white-space:normal;line-height:1.05}.atlas-landmark-caption span{white-space:nowrap}
@media(max-height:600px){.atlas-landmark-caption{max-width:64%;padding:3px 6px}.atlas-landmark-caption b{font-size:10px}.atlas-landmark-mark{scale:.84}}
'''
        write(path, text)


def patch_index():
    path = 'index.html'
    text = read(path)
    replacements = {
        'style400-skyway-atlas.css?v=20260914-atlas-journal-candidate1':'style400-skyway-atlas.css?v=20260914-character-world1',
        'style400-story-theme.css?v=20260914-gameplay-story-candidate1':'style400-story-theme.css?v=20260914-character-world1',
        'title-island-concepts/?c=2&amp;embed=1&amp;v=20260914-home-coherence-candidate1':'title-island-concepts/?c=2&amp;embed=1&amp;v=20260914-character-world1',
        'story-grounding400.js?v=20260912-ch2pass3-1':'story-grounding400.js?v=20260914-character-world1',
        'game400-a.js?v=20260914-gameplay-story-candidate1':'game400-a.js?v=20260914-character-world1',
        'game400-b.js?v=20260914-gameplay-story-candidate1':'game400-b.js?v=20260914-character-world1',
        'story-theme400.js?v=20260914-gameplay-story-candidate1':'story-theme400.js?v=20260914-character-world1',
        'gameplay-story-rail400.js?v=20260913-audit-r1r5-1':'gameplay-story-rail400.js?v=20260914-character-world1',
    }
    for old, new in replacements.items():
        if old in text:
            text = text.replace(old, new)
    write(path, text)


def product():
    patch_story_grounding()
    patch_story_rail()
    patch_story_theme()
    patch_game_b()
    patch_home()
    patch_game_a()
    patch_styles()
    patch_index()

    # Static contract after patch.
    rail = read('gameplay-story-rail400.js')
    theme = read('story-theme400.js')
    grounding = read('story-grounding400.js')
    home = read('title-island-concepts/index.html')
    game = read('game400-a.js')
    assert 'MOVEMENT_RAIL_LINES' not in rail and 'data-story-role="motive"' in rail
    assert 'data-story-role="movement-clue"' in theme and 'expressionForLine' in theme
    assert 'movementFixtureFor' in grounding
    assert all(f"keepsake:'{k}'" in home for k in ['mailbox','pennant','anchor','bunting','telescope','relic','dock'])
    assert 'data-resident="Pip"' in home and 'data-resident="Tansy"' in home
    assert "resident:'Pip'" in home and "resident:'Tansy'" in home
    assert 'data-landmark-label' in game and 'atlasLandmarkFor' in game


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--handoff-only', action='store_true')
    parser.add_argument('--product', action='store_true')
    args = parser.parse_args()
    if args.handoff_only:
        handoff_only()
    if args.product:
        product()
