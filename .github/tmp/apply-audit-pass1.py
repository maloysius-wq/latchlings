from pathlib import Path
import re


def read(path):
    return Path(path).read_text()


def write(path, text):
    Path(path).write_text(text)


def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f'missing anchor: {label}')
    return text.replace(old, new, 1)


def replace_function(text, name, new_source):
    marker=f'function {name}('
    start=text.find(marker)
    if start < 0:
        raise SystemExit(f'missing function {name}')
    nxt=text.find('\nfunction ', start+len(marker))
    if nxt < 0:
        raise SystemExit(f'no following function after {name}')
    return text[:start]+new_source.rstrip()+text[nxt:]

# ---------------------------------------------------------------------------
# index.html: zoom allowed, separate story rail/mechanic cue, cache freshness.
# ---------------------------------------------------------------------------
p='index.html'; s=read(p)
s=replace_once(s,
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no" />',
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />',
    'viewport scaling')
s=replace_once(s,
    '    <div class="mechanic-note" id="mechanicNote"></div>\n    <div class="board-wrap">',
    '    <div class="story-rail-slot" id="storyRailSlot" aria-live="polite"></div>\n    <div class="board-wrap">',
    'story rail slot')
s=replace_once(s,
    '    <div class="controls"><button class="side-action" id="resetLevelBtn">',
    '    <div class="mechanic-note mechanic-chip" id="mechanicNote"></div>\n    <div class="controls"><button class="side-action" id="resetLevelBtn">',
    'mechanic note below board')
for old,new in [
 ('style400-ui.css?v=20260911-narrative1','style400-ui.css?v=20260912-pass1'),
 ('style400-game.css?v=20260911-sphere3','style400-game.css?v=20260912-pass1'),
 ('style400-skyway-atlas.css?v=20260911-narrative1','style400-skyway-atlas.css?v=20260912-pass1'),
 ('style400-story-rail-board.css?v=20260911-storypresentation1','style400-story-rail-board.css?v=20260912-pass1'),
 ('style400-cinematics-dialogue.css?v=20260911-storypresentation1','style400-cinematics-dialogue.css?v=20260912-pass1'),
 ('story-grounding400.js?v=20260911-narrative1','story-grounding400.js?v=20260912-pass1'),
 ('cinematics400.js?v=20260911-narrative1','cinematics400.js?v=20260912-pass1'),
 ('cinematic-dialogue400.js?v=20260911-storypresentation1','cinematic-dialogue400.js?v=20260912-pass1'),
 ('game400-a.js?v=20260911-narrative1','game400-a.js?v=20260912-pass1'),
 ('game400-b.js?v=20260911-narrative1','game400-b.js?v=20260912-pass1'),
 ('gameplay-story-rail400.js?v=20260911-storypresentation1','gameplay-story-rail400.js?v=20260912-pass1')
]:
    s=replace_once(s,old,new,old)
write(p,s)

# ---------------------------------------------------------------------------
# game400-a.js: preferences, explicit play mode / Daily session, layout source.
# ---------------------------------------------------------------------------
p='game400-a.js'; s=read(p)
anchor="let progress=loadProgress();\nlet atlasRewardState=null,atlasRewardTimers=[];"
insert="""let progress=loadProgress();
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
let atlasRewardState=null,atlasRewardTimers=[];"""
s=replace_once(s,anchor,insert,'preferences and Daily globals')
s=replace_once(s,
    "const reduced=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches),canAnimate=!!current&&!reduced&&typeof current.animate==='function';",
    "const reduced=effectiveReducedMotion(),canAnimate=!!current&&!reduced&&typeof current.animate==='function';",
    'screen reduced motion preference')
old_update="function updateHome(replay=false){const total=Object.values(progress.stars).reduce((a,b)=>a+(+b||0),0),legacy=document.getElementById('homeStars');if(legacy)legacy.textContent=total;const frame=document.getElementById('homeTitleFrame'),stage=STORY?STORY.completedChapters(progress):0;if(frame&&frame.contentWindow)frame.contentWindow.postMessage({source:'latchlings-game',type:'home-state',stars:total,stage,replay:!!replay},location.origin)}"
new_update="function updateHome(replay=false){const total=Object.values(progress.stars).reduce((a,b)=>a+(+b||0),0),legacy=document.getElementById('homeStars');if(legacy)legacy.textContent=total;const frame=document.getElementById('homeTitleFrame'),stage=STORY?STORY.completedChapters(progress):0;if(frame&&frame.contentWindow)frame.contentWindow.postMessage({source:'latchlings-game',type:'home-state',stars:total,stage,replay:!!replay,motion:uiPrefs.motion,textSize:uiPrefs.textSize},location.origin)}"
s=replace_once(s,old_update,new_update,'home preference message')
new_start="""function startLevel(L,mode='campaign'){
 playMode=mode==='daily'?'daily':'campaign';document.body.dataset.playMode=playMode;
 currentLevel=Math.max(1,Math.min(400,L));const lev=LEVELS[currentLevel-1];if(!lev){showError('Missing level '+currentLevel);return}
 if(playMode==='daily'&&!dailySession)dailySession={...dailyRouteInfo(),level:currentLevel};
 chapterView=Math.ceil(currentLevel/50);rangeView=Math.floor(((currentLevel-1)%50)/10);applyTheme(chapterView);positions=lev.pieces.map(p=>p.pos.slice());doorMask=0;movesUsed=0;selected=0;hintStep=0;animating=false;
 if(playMode==='daily'&&window.LatchlingsStoryTheme?.close)window.LatchlingsStoryTheme.close(false);
 screen('game');renderGame(true);
 if(playMode==='daily')return;
 const enterStory=()=>{if(window.LatchlingsStoryTheme)window.LatchlingsStoryTheme.enterLevel(currentLevel)},enterCinematicOrStory=()=>{if(window.LatchlingsCinematics&&window.LatchlingsCinematics.maybeShowBeforeLevel(currentLevel,progress.unlocked,enterStory))return;enterStory()};if(activeScreenTransition&&activeScreenTransition.finished)activeScreenTransition.finished.then(enterCinematicOrStory).catch(enterCinematicOrStory);else enterCinematicOrStory()
}"""
s=replace_function(s,'startLevel',new_start)
new_render="""function renderGame(full=false){
 const lev=LEVELS[currentLevel-1],chapter=Math.ceil(currentLevel/50),boardRange=boardRangeForLevel(currentLevel);applyTheme(chapter);const campaign=playMode==='campaign',storyMeta=campaign&&STORY?STORY.levelMeta(currentLevel):null;
 document.getElementById('levelTitle').textContent=campaign?'Level '+currentLevel:'Daily Route';document.getElementById('movesLeft').textContent=Math.max(0,lev.moveLimit-movesUsed);
 const storyBtn=document.getElementById('storyCardBtn');if(storyBtn){storyBtn.hidden=!campaign;storyBtn.setAttribute('aria-hidden',campaign?'false':'true')}
 const note=document.getElementById('mechanicNote');note.className='mechanic-note mechanic-chip';note.innerHTML=`<span class="mechanic-chip-label">Route tip</span><span class="mechanic-chip-copy">${chapterNote(currentLevel)}</span>`;
 const props=document.getElementById('levelProps');if(campaign&&window.LatchlingsStoryTheme)window.LatchlingsStoryTheme.decorateLevel(currentLevel,storyMeta);else if(props){props.innerHTML='';props.hidden=true;props.setAttribute('aria-hidden','true')}
 const board=document.getElementById('board');board.style.setProperty('--n',lev.size);board.dataset.boardRange=String(boardRange);board.dataset.boardStyle=`ch${chapter}-r${boardRange}`;if(full){board.querySelectorAll('.cell').forEach(x=>x.remove());for(let r=0;r<lev.size;r++)for(let c=0;c<lev.size;c++){const cell=document.createElement('div');cell.className='cell';cell.dataset.r=r;cell.dataset.c=c;cell.dataset.tileVariant=String((r*3+c*5+currentLevel+boardRange)%4);board.insertBefore(cell,document.getElementById('pieceLayer'));decorateCell(cell,lev,r,c)}}renderPieces(lev)
}"""
s=replace_function(s,'renderGame',new_render)
write(p,s)

# ---------------------------------------------------------------------------
# story-grounding400.js: briefing language exposes only earned conclusions.
# ---------------------------------------------------------------------------
p='story-grounding400.js'; s=read(p)
old="""function campaignBriefing(progress){
 const unlocked=Math.max(1,Math.min(400,Number(progress&&progress.unlocked)||1)),chapter=Math.ceil(unlocked/50),local=(unlocked-1)%50+1,c=STORY.chapters[chapter-1],movement=movementForLevel(unlocked),discoveries=[];
 for(let ch=1;ch<=chapter;ch++){
  const cc=STORY.chapters[ch-1];
  for(let i=0;i<5;i++){const L=(ch-1)*50+(i+1)*10;if(milestoneDone(progress,L))discoveries.push({chapter:ch,level:L,text:cc.beats[i]})}
 }
 return {chapter,local,chapterName:c.name,location:c.theme,why:STORY.whyWaykeeper,goal:STORY.campaignGoal,pressure:STORY.antagonisticPressure,currentTitle:movement.title,currentQuestion:movement.question,currentStakes:movement.stakes,known:discoveries.slice(-3).map(x=>x.text)};
}"""
new="""function campaignBriefing(progress){
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
}"""
s=replace_once(s,old,new,'earned campaign briefing')
write(p,s)

# ---------------------------------------------------------------------------
# cinematic-dialogue400.js: preserve utterance order and dock every film.
# ---------------------------------------------------------------------------
p='cinematic-dialogue400.js'; s=read(p)
s=replace_once(s,
 "function dialogueGroups(beat){const out=[],byName=new Map();for(const [name,text] of dialogueLines(beat)){if(!byName.has(name)){const g=[name,[]];byName.set(name,g);out.push(g)}byName.get(name)[1].push(text)}return out}",
 "function dialogueGroups(beat){return dialogueLines(beat).map(([name,text])=>[name,[text]])}",
 'chronological dialogue groups')
old_dock="""function openingDockHtml(index,groups){
 if(!groups.length)return '';
 const order=['Pippa','Bramble','Rowan','Pip','Tansy'];
 const castKey=index===1?`<div class="cin-opening-cast-key" aria-label="Little Home residents">${order.map(name=>{const c=CAST[name];return `<span class="cin-opening-cast-chip">${portrait(name,'opening-cast-portrait')}<span><b>${escapeHtml(name)}</b><small>${escapeHtml(c.role)}</small></span></span>`}).join('')}</div>`:'';
 const rows=groups.map(([name,texts])=>{const c=CAST[name];return `<div class="cin-opening-dialogue-row" data-speaker="${escapeHtml(name)}">${portrait(name,'opening-dialogue-portrait')}<div class="cin-opening-bubble"><div class="cin-opening-speaker"><b>${escapeHtml(name)}</b><small>${escapeHtml(c?.role||'Resident')}</small></div>${speechTextHtml(texts)}</div></div>`}).join('');
 return `<section class="cin-opening-dialogue-dock" data-beat="${index+1}" data-dialogue-count="${groups.length}" aria-label="Character dialogue">${castKey}<div class="cin-opening-dialogue-list">${rows}</div></section>`;
}"""
new_dock="""function openingDockHtml(id,index,groups){
 if(!groups.length)return '';
 const order=['Pippa','Bramble','Rowan','Pip','Tansy'];
 const castKey=id==='opening'&&index===1?`<div class="cin-opening-cast-key" aria-label="Little Home residents">${order.map(name=>{const c=CAST[name];return `<span class="cin-opening-cast-chip">${portrait(name,'opening-cast-portrait')}<span><b>${escapeHtml(name)}</b><small>${escapeHtml(c.role)}</small></span></span>`}).join('')}</div>`:'';
 const rows=groups.map(([name,texts],utterance)=>{const c=CAST[name];return `<div class="cin-opening-dialogue-row" data-speaker="${escapeHtml(name)}" data-utterance="${utterance+1}">${portrait(name,'opening-dialogue-portrait')}<div class="cin-opening-bubble"><div class="cin-opening-speaker"><b>${escapeHtml(name)}</b><small>${escapeHtml(c?.role||'Resident')}</small></div>${speechTextHtml(texts)}</div></div>`}).join('');
 return `<section class="cin-opening-dialogue-dock cin-ordered-dialogue-dock" data-cinematic="${escapeHtml(id)}" data-beat="${index+1}" data-dialogue-count="${groups.length}" aria-label="Character dialogue in script order">${castKey}<div class="cin-opening-dialogue-list">${rows}</div></section>`;
}"""
s=replace_once(s,old_dock,new_dock,'shared dialogue dock')
start=s.index('function postProcess(){')
end=s.index('\nfunction schedule(){',start)
new_post="""function postProcess(){
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
}"""
s=s[:start]+new_post+s[end:]
write(p,s)

# Continuity correction in canonical cinematic text.
p='cinematics400.js'; s=read(p)
s=replace_once(s,
 "['Narrator','For the first time, the Waykeeper deliberately builds a route that has never existed before.']",
 "['Narrator','Now the Waykeeper understands why a route with no historical precedent can still be the right route for the Latchlands today.']",
 'Copperline continuity')
write(p,s)

# ---------------------------------------------------------------------------
# gameplay-story-rail400.js: one readable current beat, no mechanic overwrite.
# ---------------------------------------------------------------------------
p='gameplay-story-rail400.js'
rail_source=r'''\'use strict\';
(function(){
const STORY=window.LATCHLINGS_STORY;if(!STORY)return;
const CAST={
 Pippa:{color:'#9a72df',light:'#c3a0f1',dark:'#724fbd',suit:'club',expr:'curious'},
 Bramble:{color:'#ef5f66',light:'#ff9297',dark:'#c33d49',suit:'diamond',expr:'smug'},
 Rowan:{color:'#66bd72',light:'#94dc98',dark:'#469852',suit:'heart',expr:'happy'},
 Pip:{color:'#4c8ff4',light:'#79aff9',dark:'#2e69c8',suit:'spade',expr:'determined',child:true},
 Tansy:{color:'#ef5f66',light:'#ff9297',dark:'#c33d49',suit:'heart',expr:'surprised',child:true}
};
const SPEAKERS=[
 ['Pippa','Pippa','Pip','Bramble','Bramble','Tansy','Pippa','Tansy','Bramble','Rowan'],
 ['Bramble','Bramble','Pip','Tansy','Bramble','Rowan','Pippa','Tansy','Rowan','Bramble'],
 ['Rowan','Rowan','Bramble','Bramble','Rowan','Pippa','Rowan','Bramble','Bramble','Rowan'],
 ['Pippa','Tansy','Bramble','Pip','Tansy','Pippa','Rowan','Tansy','Bramble','Bramble'],
 ['Tansy','Rowan','Tansy','Pippa','Tansy','Rowan','Pip','Bramble','Pippa','Rowan'],
 ['Bramble','Rowan','Pippa','Bramble','Bramble','Rowan','Pip','Pippa','Rowan','Rowan'],
 ['Pippa','Bramble','Rowan','Tansy','Pip','Bramble','Rowan','Pippa','Tansy','Bramble'],
 ['Pippa','Rowan','Bramble','Pip','Tansy','Rowan','Pippa','Bramble','Tansy','Pip']
];
const EARLY_STORY=[
 {speaker:'Pippa',line:'Breakfast first. The basket missed a stop that worked perfectly yesterday.'},
 {speaker:'Rowan',line:'The watering marker is off by a whole garden bed. Little Home moved farther overnight.'},
 {speaker:'Pip',line:'My kite missed the same crossing. That makes two routes, not one bad basket.'},
 {speaker:'Bramble',line:'Bread from East Sunpetal missed us by the same distance. This is a pattern.'},
 {speaker:'Tansy',line:'The morning mail brought three notes from neighbors whose crossings shifted too.'},
 {speaker:'Pippa',line:'I laid today’s stops over yesterday’s map. None of the endpoints line up anymore.'},
 {speaker:'Rowan',line:'The islands are where they should be. The routes are the part that fell behind.'},
 {speaker:'Bramble',line:'Five households sent the same kind of report. Leave the next one at Little Home.'},
 {speaker:'Pippa',line:'Let’s build one temporary circuit from where everyone actually is this morning.'},
 {speaker:'Tansy',line:'The new circuit works. For the first time today, people are arriving where they meant to.'},
 {speaker:'Rowan',line:'Another drift check just came in. The repair held, but the islands kept moving.'},
 {speaker:'Pippa',line:'Then one repair is not enough. We need a way to keep rewriting the route.'},
 {speaker:'Bramble',line:'The route mailbox is open. Send coordinates, missed stops, and very specific complaints.'},
 {speaker:'Pip',line:'I found an old Skyway marker under the grass. It points to where this island used to be.'},
 {speaker:'Tansy',line:'A family across the meadow missed visiting hour when their crossing vanished. This is bigger than errands.'},
 {speaker:'Rowan',line:'The marker stones still work. Local crews are testing new stops around them now.'},
 {speaker:'Pippa',line:'The hardware is not broken. The old map is simply describing yesterday’s Latchlands.'},
 {speaker:'Bramble',line:'With everyone’s reports together, we can fix routes faster than each island can alone.'},
 {speaker:'Pip',line:'Three more old markers point to where the islands used to be. Yesterday’s map is the problem.'},
 {speaker:'Tansy',line:'We have our answer: the Skyway works, but its map is old. Now we rebuild Sunpetal for today.'}
];
function escapeHtml(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}
function suitSvg(s){if(s==='heart')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 86C39 74 13 58 13 34c0-14 10-23 23-23 8 0 14 4 18 10 4-6 10-10 18-10 13 0 23 9 23 23 0 24-26 40-45 52Z"/></svg>';if(s==='diamond')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 7 88 50 50 93 12 50Z"/></svg>';if(s==='club')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 12a19 19 0 0 1 12 34 20 20 0 1 1 9 37c-9 0-15-5-18-11 1 10 5 16 12 21H35c7-5 11-11 12-21-3 6-9 11-18 11a20 20 0 1 1 9-37A19 19 0 0 1 50 12Z"/></svg>';if(s==='spade')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8C43 22 14 36 14 60c0 13 10 23 23 23 8 0 13-4 16-10-1 9-5 15-12 20h18c-7-5-11-11-12-20 3 6 8 10 16 10 13 0 23-10 23-23C86 36 57 22 50 8Z"/></svg>';return ''}
function portrait(name){const c=CAST[name]||CAST.Pippa;return `<span class="rail-latchling ${c.child?'child':''} expr-${c.expr}" data-character="${name}" style="--rail-color:${c.color};--rail-light:${c.light};--rail-dark:${c.dark}"><span class="rail-suit">${suitSvg(c.suit)}</span><span class="rail-face"><span class="rail-eyes"><i></i><i></i></span><i class="rail-mouth"></i></span></span>`}
function levelFromDom(){return Number(document.getElementById('board')?.dataset.level||0)||0}
function render(){
 const host=document.getElementById('storyRailSlot');if(!host||document.body.dataset.screen!=='game')return;
 const level=levelFromDom();if(!level)return;
 if(document.body.dataset.playMode==='daily'){
  host.dataset.storyRailLevel='daily';host.innerHTML='<section class="story-level-rail daily-rail"><div class="story-rail-daily-mark" aria-hidden="true">✦</div><div class="story-rail-main"><div class="story-rail-meta"><strong>Daily Route</strong></div><p>A standalone puzzle for today. Campaign story and progress stay unchanged.</p></div></section>';return;
 }
 if(host.dataset.storyRailLevel===String(level)&&host.querySelector('.story-level-rail'))return;
 const meta=STORY.levelMeta(level),chapter=meta.chapter,local=meta.local,slot=(local-1)%10,phase=Math.floor((local-1)/10),movement=STORY.movementForLevel?STORY.movementForLevel(level):null,early=chapter===1&&local<=20?EARLY_STORY[local-1]:null,speaker=early?.speaker||SPEAKERS[chapter-1][slot],line=early?.line||movement?.setup||meta.context;
 host.dataset.storyRailLevel=String(level);host.setAttribute('aria-label',`${speaker}. ${line}. Open Story for the full route context.`);
 host.innerHTML=`<section class="story-level-rail story-rail-ch${chapter}"><div class="story-rail-person">${portrait(speaker)}</div><div class="story-rail-main"><div class="story-rail-meta"><strong>${escapeHtml(speaker)}</strong><span>${escapeHtml(movement?.title||meta.title)}</span></div><p>${escapeHtml(line)}</p></div><button class="story-rail-story-btn" type="button" aria-label="Open full story for this level"><span aria-hidden="true">▣</span><b>Story</b></button></section>`;
 host.querySelector('.story-rail-story-btn')?.addEventListener('click',()=>document.getElementById('storyCardBtn')?.click());
}
function sanitizeDebug(){const d=document.getElementById('debug');if(!d||d.dataset.playerSafe==='true'||getComputedStyle(d).display==='none')return;d.dataset.playerSafe='true';d.textContent='Something went wrong. Return to Level Select and try again.'}
let queued=false;function schedule(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;render();sanitizeDebug()})}
function install(){const title=document.getElementById('levelTitle'),debug=document.getElementById('debug');if(title)new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});if(debug)new MutationObserver(sanitizeDebug).observe(debug,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['style','class']});new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['data-screen','data-play-mode']});document.addEventListener('click',schedule,true);schedule()}
install();
window.LatchlingsStoryRail={render,SPEAKERS,EARLY_STORY};
})();
'''
# unescape the intentionally raw opening quote only
rail_source=rail_source.replace("\\'use strict\\';","'use strict';")
write(p,rail_source)

# ---------------------------------------------------------------------------
# game400-b.js: Settings, Daily-safe completion, clear help copy, real legend.
# ---------------------------------------------------------------------------
p='game400-b.js'; s=read(p)
new_win="""function winLevel(){
 if(window.LatchlingsSFX)window.LatchlingsSFX.levelClear();const lev=LEVELS[currentLevel-1],stars=starsFor(lev),starRow=[1,2,3].map((n,i)=>starSvg(n<=stars,`s${i+1}`)).join(''),moveWord=n=>`${n} move${n===1?'':'s'}`;
 if(playMode==='daily'){
  saveDailyCompletion(stars);modal(`<h2>Daily route complete</h2><div class="win-stars" aria-label="${stars} stars earned">${starRow}</div><p>${moveWord(movesUsed)}. Perfect route: ${moveWord(lev.optimal)}.</p><p>Today's puzzle is separate from campaign progress.</p><div class="modal-actions"><button class="primary-small" id="dailyHomeBtn">Little Home</button><button class="secondary-small" id="dailyReplayBtn">Replay Daily</button></div>`);document.getElementById('dailyHomeBtn').onclick=()=>{closeModal();leaveDailyForHome()};document.getElementById('dailyReplayBtn').onclick=()=>{closeModal();startLevel(currentLevel,'daily')};return;
 }
 const previousUnlocked=progress.unlocked;progress.stars[currentLevel]=Math.max(progress.stars[currentLevel]||0,stars);if(currentLevel<400)progress.unlocked=Math.max(progress.unlocked,currentLevel+1);saveProgress();if(currentLevel<400&&progress.unlocked>previousUnlocked)queueAtlasReward(currentLevel,currentLevel+1,stars);const storyMeta=STORY?STORY.levelMeta(currentLevel):null,beat=STORY?STORY.beatForLevel(currentLevel):null,storyTitle=storyMeta?`<div class="win-story-title">${storyMeta.title}</div>`:'',beatHtml=beat?`<div class="story-beat story-beat-result"><span class="story-beat-kicker">${beat.resultLabel||'Route discovery'}</span><strong>${beat.title}</strong><p>${beat.text}</p>${beat.nextLead?`<div class="story-beat-next"><b>${beat.local===50?'Next region':'Next lead'}</b><span>${beat.nextLead}</span></div>`:''}${beat.homeReward?`<span class="story-reward">Little Home changes: ${beat.homeReward}</span>`:''}</div>`:'';modal(`<h2>Level cleared</h2>${storyTitle}<div class="win-stars" aria-label="${stars} stars earned">${starRow}</div><p>${moveWord(movesUsed)}. Perfect route: ${moveWord(lev.optimal)}.</p>${beatHtml}<div class="modal-actions"><button class="primary-small" id="nextLevelBtn">${currentLevel===400?'Finish':'Next Level'}</button><button class="secondary-small" id="replayBtn">Replay</button><button class="secondary-small" id="toLevelsBtn">Level Select</button></div>`);document.getElementById('nextLevelBtn').onclick=()=>{closeModal();if(currentLevel===400){if(window.LatchlingsSFX)window.LatchlingsSFX.campaignComplete();screen('complete')}else if(atlasRewardState&&atlasRewardState.from===currentLevel)playQueuedAtlasReward(true);else startLevel(currentLevel+1)};document.getElementById('replayBtn').onclick=()=>{closeModal();cancelAtlasReward();startLevel(currentLevel)};document.getElementById('toLevelsBtn').onclick=()=>{closeModal();if(atlasRewardState&&atlasRewardState.from===currentLevel)playQueuedAtlasReward(false);else{chapterView=Math.ceil(currentLevel/50);rangeView=Math.floor(((currentLevel-1)%50)/10);screen('levels');renderChapter()}}
}"""
s=replace_function(s,'winLevel',new_win)
new_lose="""function loseLevel(){
 if(window.LatchlingsSFX)window.LatchlingsSFX.levelLose();const daily=playMode==='daily';modal(`<h2>Let's try another route</h2><p>You are out of moves. Retry from the starting layout, or ask for a hint if you want a small nudge.</p><div class="modal-actions"><button class="primary-small" id="retryBtn">${daily?'Retry Daily':'Retry level'}</button><button class="secondary-small" id="loseHintBtn">Show a hint</button><button class="secondary-small" id="loseExitBtn">${daily?'Little Home':'Level Select'}</button></div>`);document.getElementById('retryBtn').onclick=()=>{closeModal();startLevel(currentLevel,playMode)};document.getElementById('loseHintBtn').onclick=()=>{closeModal();startLevel(currentLevel,playMode);setTimeout(showHint,80)};document.getElementById('loseExitBtn').onclick=()=>{closeModal();if(daily){leaveDailyForHome();return}chapterView=Math.ceil(currentLevel/50);rangeView=Math.floor(((currentLevel-1)%50)/10);screen('levels');renderChapter()}
}"""
s=replace_function(s,'loseLevel',new_lose)
new_hint="""function showHint(){
 if(window.LatchlingsSFX)window.LatchlingsSFX.hint();const lev=LEVELS[currentLevel-1];if(movesUsed>0){modal(`<h2>Reset for an accurate hint?</h2><p>This route hint starts from the original board. Reset first so the suggested move matches what you see.</p><div class="modal-actions"><button class="primary-small" id="hintReset">Reset & show hint</button><button class="secondary-small" id="hintKeep">Keep playing</button></div>`);document.getElementById('hintReset').onclick=()=>{closeModal();startLevel(currentLevel,playMode);setTimeout(showHint,90)};document.getElementById('hintKeep').onclick=closeModal;return}
 const [pi,d]=lev.solution[0],p=lev.pieces[pi],names={U:'up',D:'down',L:'left',R:'right'};selected=pi;renderPieces(lev);const piece=document.querySelector(`.latchling[data-pi="${pi}"]`),dir=document.querySelector(`.dpad-hit[data-dir="${d}"]`);piece?.classList.add('hint-focus');dir?.classList.add('hint-focus');setTimeout(()=>{piece?.classList.remove('hint-focus');dir?.classList.remove('hint-focus')},3200);modal(`<h2>Try this first</h2><p>Select the ${p.color} ${p.suit} Latchling and move ${names[d]}. The piece and direction are highlighted when you return to the board.</p><div class="modal-actions"><button class="primary-small" id="hintClose">Back to board</button></div>`);document.getElementById('hintClose').onclick=closeModal
}"""
s=replace_function(s,'showHint',new_hint)
new_rules="""function rulesModal(){modal(`<h2>How the board works</h2><p>Choose a Latchling, then press a direction. It snaps until the board stops it. A matching nest captures it. The center D-pad button cycles through Latchlings still on the board.</p><div class="legend"><div class="legend-item"><span class="legend-icon legend-anchor">${icon('anchor')}</span><span>Anchors stop any Latchling.</span></div><div class="legend-item"><span class="legend-icon legend-suit">${suitSvg('heart')}</span><span>Suit gates require the matching black suit mark.</span></div><div class="legend-item"><span class="legend-icon"><span class="legend-color-dot"></span></span><span>Color gates require the matching body color.</span></div><div class="legend-item"><span class="legend-icon">${dirSvg('R')}</span><span>Rails only allow their shown direction.</span></div><div class="legend-item"><span class="legend-icon">${turnSvg('CW')}</span><span>Turners bend one continuous snap.</span></div><div class="legend-item"><span class="legend-icon"><span class="legend-switch-icon"><i></i></span></span><span>Switches toggle linked doors.</span></div></div><div class="modal-actions"><button class="primary-small" id="rulesClose">Got it</button></div>`);document.getElementById('rulesClose').onclick=closeModal}"""
s=replace_function(s,'rulesModal',new_rules)
new_pause="""function pauseModal(){const daily=playMode==='daily';modal(`<h2>Paused</h2><p>Nothing on the board moves while this menu is open.</p><div class="modal-actions"><button class="primary-small" id="resumeBtn">Resume</button><button class="secondary-small" id="pauseReset">Reset ${daily?'Daily':'level'}</button><button class="secondary-small" id="pauseSettings">Settings</button><button class="secondary-small" id="pauseRules">Rules & mechanics</button><button class="secondary-small" id="pauseExit">${daily?'Little Home':'Level Select'}</button></div>`);document.getElementById('resumeBtn').onclick=closeModal;document.getElementById('pauseReset').onclick=()=>{closeModal();startLevel(currentLevel,playMode)};document.getElementById('pauseSettings').onclick=settingsModal;document.getElementById('pauseRules').onclick=rulesModal;document.getElementById('pauseExit').onclick=()=>{closeModal();if(daily){leaveDailyForHome();return}chapterView=Math.ceil(currentLevel/50);rangeView=Math.floor(((currentLevel-1)%50)/10);screen('levels');renderChapter()}}"""
s=replace_function(s,'pauseModal',new_pause)
new_storymodal="""function storyModal(){if(!STORY){rulesModal();return}const ch=STORY.currentChapter(progress),c=STORY.chapters[ch-1],cast=STORY.cast.map(storyResidentCard).join(''),brief=STORY.campaignBriefing?STORY.campaignBriefing(progress):null,journey=STORY.journeyFor?STORY.journeyFor(progress):[];const mission=brief?`<div class="story-briefing"><div><strong>Why you’re here</strong><p>${brief.why}</p></div><div><strong>Current question</strong><p>${brief.currentQuestion}</p><small>${brief.currentStakes}</small></div>${brief.known.length?`<div><strong>Latest discovery</strong><p>${brief.known[brief.known.length-1]}</p></div>`:''}</div>`:'';const trail=journey.length?`<div class="story-journey">${journey.map(j=>`<div class="story-journey-item ${j.status==='Restored'?'done':'current'}"><b>${j.chapter}</b><span><strong>${j.name}</strong><small>${j.status} · ${j.location}</small><p>${j.summary}</p></span></div>`).join('')}</div>`:'';modal(`<h2>The Latchlands</h2><div class="story-scroll"><p>${brief?.premise||STORY.premise}</p>${mission}<h3>You are the ${STORY.playerRole}</h3><p>${brief?.goal||'Restore the routes people need now and follow the evidence.'}</p>${storyHelperCrewHtml()}<h3>Little Home</h3><div class="story-cast">${cast}</div><h3>Journey so far</h3>${trail}<h3>Current chapter · ${c.name}</h3><p><strong>${c.theme}</strong><br>${c.desc}</p></div><div class="modal-actions"><button class="primary-small" id="storyClose">Back to Settings</button></div>`);document.getElementById('storyClose').onclick=settingsModal}"""
s=replace_function(s,'storyModal',new_storymodal)
new_renderstory="""function renderStoryScreen(){if(!STORY)return;const ch=STORY.currentChapter(progress),c=STORY.chapters[ch-1],brief=STORY.campaignBriefing?STORY.campaignBriefing(progress):null,journey=STORY.journeyFor?STORY.journeyFor(progress):[],premise=document.getElementById('storyPremise'),role=document.getElementById('storyRole'),cast=document.getElementById('storyCast'),chapter=document.getElementById('storyChapter'),briefing=document.getElementById('storyBriefing'),journeyEl=document.getElementById('storyJourney'),cinematics=document.getElementById('storyCinematics');if(premise)premise.textContent=brief?.premise||STORY.premise;if(role)role.innerHTML=`<strong>You are the ${STORY.playerRole}</strong><span>${brief?.goal||'Restore the routes people need now and follow the evidence.'}</span>${storyHelperCrewHtml()}`;if(briefing&&brief)briefing.innerHTML=`<div class="story-briefing"><div><strong>Why you’re here</strong><p>${brief.why}</p></div><div><strong>Current question</strong><p>${brief.currentQuestion}</p><small>${brief.currentStakes}</small></div><div><strong>What we know</strong><p>${brief.known.length?brief.known.join(' '):'We have matching route failures, but their cause is still unknown.'}</p></div></div>`;if(cast)cast.innerHTML=STORY.cast.map(storyResidentCard).join('');if(chapter)chapter.innerHTML=`<strong>Chapter ${ch}: ${c.name}</strong><span>${c.theme}</span><p>${c.desc}</p>`;if(journeyEl)journeyEl.innerHTML=journey.map(j=>`<div class="story-journey-item ${j.status==='Restored'?'done':'current'}"><b>${j.chapter}</b><span><strong>${j.name}</strong><small>${j.status} · ${j.location}</small><p>${j.summary}</p></span></div>`).join('');if(cinematics&&window.LatchlingsCinematics)window.LatchlingsCinematics.renderLibrary(cinematics,progress.unlocked)}"""
s=replace_function(s,'renderStoryScreen',new_renderstory)
new_settings="""function settingsModal(){
 const prefs=window.LatchlingsPrefs?.get?.()||{motion:'system',textSize:'normal'},musicOn=window.LatchlingsMusic?.isEnabled?.()!==false,sfxOn=window.LatchlingsSFX?.isEnabled?.()!==false;
 modal(`<h2>Settings</h2><p>Adjust the game here. Story & Residents has its own book entry on Little Home.</p><div class="modal-actions settings-actions"><button class="secondary-small" id="musicToggleBtn" aria-pressed="${musicOn}">Music: ${musicOn?'On':'Off'}</button><button class="secondary-small" id="sfxToggleBtn" aria-pressed="${sfxOn}">Sound Effects: ${sfxOn?'On':'Off'}</button><button class="secondary-small" id="motionToggleBtn" aria-pressed="${prefs.motion==='reduced'}">Motion: ${prefs.motion==='reduced'?'Reduced':'System'}</button><button class="secondary-small" id="textSizeToggleBtn" aria-pressed="${prefs.textSize==='large'}">Text size: ${prefs.textSize==='large'?'Large':'Normal'}</button><button class="secondary-small" id="settingsRules">Controls & mechanics</button><button class="secondary-small" id="settingsStory">Story & Residents</button><button class="primary-small" id="settingsClose">Close</button></div>`);
 const music=document.getElementById('musicToggleBtn'),sfx=document.getElementById('sfxToggleBtn'),motion=document.getElementById('motionToggleBtn'),text=document.getElementById('textSizeToggleBtn');
 if(music)music.onclick=()=>{window.LatchlingsMusic?.setEnabled?.(!window.LatchlingsMusic.isEnabled());const on=window.LatchlingsMusic?.isEnabled?.()!==false;music.textContent=`Music: ${on?'On':'Off'}`;music.setAttribute('aria-pressed',String(on))};
 if(sfx)sfx.onclick=()=>{window.LatchlingsSFX?.setEnabled?.(!window.LatchlingsSFX.isEnabled());const on=window.LatchlingsSFX?.isEnabled?.()!==false;sfx.textContent=`Sound Effects: ${on?'On':'Off'}`;sfx.setAttribute('aria-pressed',String(on))};
 if(motion)motion.onclick=()=>{const p=window.LatchlingsPrefs.get(),next=p.motion==='reduced'?'system':'reduced';window.LatchlingsPrefs.set('motion',next);motion.textContent=`Motion: ${next==='reduced'?'Reduced':'System'}`;motion.setAttribute('aria-pressed',String(next==='reduced'))};
 if(text)text.onclick=()=>{const p=window.LatchlingsPrefs.get(),next=p.textSize==='large'?'normal':'large';window.LatchlingsPrefs.set('textSize',next);text.textContent=`Text size: ${next==='large'?'Large':'Normal'}`;text.setAttribute('aria-pressed',String(next==='large'))};
 document.getElementById('settingsStory').onclick=storyModal;document.getElementById('settingsRules').onclick=rulesModal;document.getElementById('settingsClose').onclick=closeModal
}"""
s=replace_function(s,'settingsModal',new_settings)
# Narrow binding substitutions rather than replacing the whole function.
s=replace_once(s,"if(dailyBtn)dailyBtn.onclick=()=>{const now=new Date(),seed=now.getFullYear()*372+now.getMonth()*31+now.getDate();startLevel((seed*37%400)+1)};","if(dailyBtn)dailyBtn.onclick=startDailyPuzzle;",'daily button')
s=replace_once(s,"if(action==='daily'){const now=new Date(),seed=now.getFullYear()*372+now.getMonth()*31+now.getDate();startLevel((seed*37%400)+1)}","if(action==='daily')startDailyPuzzle()",'home daily action')
s=replace_once(s,"if(action==='settings')openStoryScreen()","if(action==='settings')settingsModal();if(action==='story')openStoryScreen()",'home settings/story actions')
s=replace_once(s,"bindHome('#c2 .settings','settings');","bindHome('#c2 .story-home','story');bindHome('#c2 .settings','settings');",'home story button binding')
s=replace_once(s,"document.getElementById('resetLevelBtn').onclick=()=>startLevel(currentLevel);","document.getElementById('resetLevelBtn').onclick=()=>startLevel(currentLevel,playMode);",'reset current mode')
s=replace_once(s,"if(settingsBtn)settingsBtn.onclick=openStoryScreen;","if(settingsBtn)settingsBtn.onclick=settingsModal;",'legacy settings binding')
write(p,s)

# ---------------------------------------------------------------------------
# title Little Home: separate Story book from real Settings gear, 44px targets.
# ---------------------------------------------------------------------------
p='title-island-concepts/index.html'; s=read(p)
css_anchor='.settings{width:40px;height:40px;border:0;border-radius:50%;background:rgba(255,249,235,.94);box-shadow:0 7px 18px rgba(42,65,91,.10);display:grid;place-items:center;color:#577491}.settings svg{width:21px;height:21px;display:block}'
css_new='.home-tools{display:flex;gap:8px;align-items:center}.settings,.story-home{width:44px;height:44px;border:0;border-radius:50%;background:rgba(255,249,235,.94);box-shadow:0 7px 18px rgba(42,65,91,.10);display:grid;place-items:center;color:#577491;cursor:pointer}.settings svg,.story-home svg{width:21px;height:21px;display:block;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}'
s=replace_once(s,css_anchor,css_new,'home tools css')
start=s.index('<section class="concept" id="c2"')
end=s.index('<section class="concept" id="c3"',start)
segment=s[start:end]
needle='</span></div><button class="settings" aria-label="Settings">'
replacement='</span></div><div class="home-tools"><button class="story-home" aria-label="Story &amp; Residents" title="Story &amp; Residents"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5c2.6-.9 5.2-.5 8 1.2v12c-2.8-1.7-5.4-2.1-8-1.2zM20 5.5c-2.6-.9-5.2-.5-8 1.2v12c2.8-1.7 5.4-2.1 8-1.2z"/><path d="M12 6.7v12"/></svg></button><button class="settings" aria-label="Settings">'
if needle not in segment: raise SystemExit('missing c2 settings markup')
segment=segment.replace(needle,replacement,1)
# close the new wrapper immediately after the settings button.
close_needle='</svg></button></div><div class="brand toy-brand">'
close_replacement='</svg></button></div></div><div class="brand toy-brand">'
if close_needle not in segment: raise SystemExit('missing c2 settings wrapper close')
segment=segment.replace(close_needle,close_replacement,1)
s=s[:start]+segment+s[end:]
s=replace_once(s,"bindEmbed(c2.querySelector('.settings'),'settings');","bindEmbed(c2.querySelector('.story-home'),'story');bindEmbed(c2.querySelector('.settings'),'settings');",'iframe story binding')
s=replace_once(s,"window.addEventListener('message',e=>{if(e.origin!==location.origin||!e.data||e.data.source!=='latchlings-game'||e.data.type!=='home-state')return;if(progress)progress.textContent=String(e.data.stars??0);","window.addEventListener('message',e=>{if(e.origin!==location.origin||!e.data||e.data.source!=='latchlings-game'||e.data.type!=='home-state')return;document.documentElement.dataset.motion=e.data.motion||'system';document.documentElement.dataset.textSize=e.data.textSize||'normal';if(progress)progress.textContent=String(e.data.stars??0);",'iframe preference message')
s=s.replace('</style>','html[data-motion="reduced"] *{animation:none!important;transition-duration:.01ms!important;scroll-behavior:auto!important}\n</style>',1)
write(p,s)

# ---------------------------------------------------------------------------
# style400-story-rail-board.css: readable compact rail, board styles preserved.
# ---------------------------------------------------------------------------
p='style400-story-rail-board.css'; s=read(p)
marker='/* Board-first progression. The puzzle surface, not scenery behind it, carries the visual journey. */'
pos=s.index(marker)
board_tail=s[pos:]
new_prefix=r'''/* Pass 1 story rail: one readable immediate story beat. Mechanic teaching is separate. */
#game .level-environment,#game #levelEnvironment{display:none!important}
#game .story-rail-slot{width:min(100%,490px);min-height:0;margin:0 auto 7px;flex:0 0 auto}
.story-level-rail{min-height:62px;display:grid;grid-template-columns:44px minmax(0,1fr) 54px;gap:8px;align-items:center;padding:7px 8px;border:1px solid color-mix(in srgb,var(--railAccent,#6aa357) 34%,#c8b999);border-radius:17px;background:rgba(255,250,238,.9);box-shadow:0 5px 12px rgba(36,58,73,.09);color:var(--railInk,#315742);overflow:hidden}
.story-level-rail.daily-rail{grid-template-columns:44px minmax(0,1fr);background:rgba(246,249,242,.94)}
.story-rail-person{display:grid;place-items:center}.rail-latchling{position:relative;display:block;width:38px;height:38px;border-radius:50%;background:radial-gradient(circle at 34% 23%,rgba(255,255,255,.48) 0 6%,transparent 7%),linear-gradient(180deg,var(--rail-light),var(--rail-color) 56%,var(--rail-dark));border:1.5px solid #274462;box-shadow:0 4px 7px rgba(26,46,62,.18),inset 0 -3px 5px rgba(27,30,38,.1);overflow:hidden}.rail-latchling.child{width:34px;height:34px}.rail-suit{position:absolute;top:7%;left:50%;translate:-50% 0;width:25%;height:25%;z-index:3}.rail-suit svg{width:100%;height:100%;display:block;fill:#27496f}.rail-face{position:absolute;left:13%;right:13%;top:29%;height:58%}.rail-eyes{position:absolute;left:0;right:0;top:7%;height:34%;display:flex;justify-content:center;gap:23%;align-items:center}.rail-eyes i{width:22%;height:100%;border-radius:50%;background:#17253a;position:relative}.rail-eyes i:before{content:"";position:absolute;width:29%;height:29%;left:18%;top:14%;border-radius:50%;background:#fff}.rail-mouth{position:absolute;left:50%;top:46%;translate:-50% 0;width:28%;height:18%}.rail-latchling.expr-happy .rail-mouth,.rail-latchling.expr-smug .rail-mouth,.rail-latchling.expr-curious .rail-mouth{border-bottom:1.5px solid #28415f;border-radius:0 0 52% 52%}.rail-latchling.expr-surprised .rail-mouth{width:18%;height:22%;border:1.3px solid #17253a;border-radius:50%;background:#29415f}.rail-latchling.expr-determined .rail-mouth{border-top:1.5px solid #28415f}
.story-rail-main{min-width:0;display:grid;gap:2px}.story-rail-meta{min-width:0;display:flex;align-items:baseline;gap:6px}.story-rail-meta strong{font-size:12px;color:var(--railInk,#315742)}.story-rail-meta span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;color:#708078}.story-rail-main p{margin:0;color:#29465f;font-size:14px;line-height:1.25;font-weight:650;overflow-wrap:anywhere}.story-rail-story-btn{min-width:50px;min-height:48px;border:1px solid rgba(63,92,86,.18);border-radius:14px;background:#fffaf0;color:#315742;display:grid;place-items:center;gap:0;font-size:15px;cursor:pointer}.story-rail-story-btn span{font-size:17px;line-height:1}.story-rail-story-btn b{font-size:10px}.story-rail-daily-mark{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:#e7efda;color:#416447;font-size:20px}
@media(max-height:620px){#game .story-rail-slot{margin-bottom:4px}.story-level-rail{min-height:52px;padding:5px 7px;grid-template-columns:38px minmax(0,1fr) 48px;gap:6px}.rail-latchling{width:32px;height:32px}.rail-latchling.child{width:30px;height:30px}.story-rail-main p{font-size:12.5px;line-height:1.18}.story-rail-meta strong{font-size:11px}.story-rail-meta span{font-size:10px}.story-rail-story-btn{min-width:46px;min-height:46px}}

'''
write(p,new_prefix+board_tail)

# ---------------------------------------------------------------------------
# style400-game.css: compact reachable controls, visible mechanic cue, help art.
# ---------------------------------------------------------------------------
p='style400-game.css'; s=read(p)
s += r'''

/* Audit Pass 1: readable teaching and reachable phone controls. */
#game .board-wrap{flex:0 1 auto;min-height:0}
#game .board{width:min(100%,480px,44svh);max-height:none}
#game .mechanic-note{display:flex!important;width:min(100%,470px);max-width:470px;align-items:baseline;justify-content:center;gap:7px;margin:6px auto 2px;padding:7px 10px;font-size:13.5px;line-height:1.25;text-align:left;flex:0 0 auto}
#game .mechanic-chip-label{flex:0 0 auto;font-size:10px;font-weight:950;letter-spacing:.08em;text-transform:uppercase;color:#55715e}
#game .mechanic-chip-copy{font-size:13.5px;font-weight:700;color:#3d596b}
#game .controls{width:min(100%,330px);margin:0 auto;grid-template-columns:64px 148px 64px;justify-content:center;gap:9px;padding:6px 0 0}
#game .dpad{width:148px;height:148px;margin:auto}
#game .side-action{min-height:58px;border-radius:18px;font-size:12px}.side-action svg{width:24px;height:24px}
.latchling.hint-focus{box-shadow:0 0 0 4px #fff,0 0 0 8px #e4ad32,0 7px 12px rgba(22,39,58,.28)!important;animation:hintPiecePulse .7s ease-in-out 3}
.dpad-hit.hint-focus{outline:4px solid #e4ad32!important;outline-offset:-6px;border-radius:20px;background:rgba(255,226,135,.18)}
@keyframes hintPiecePulse{50%{filter:brightness(1.18) saturate(1.2)}}
.legend-icon svg{width:26px;height:26px;display:block}.legend-suit svg{fill:#1d2d43}.legend-color-dot{width:23px;height:23px;border-radius:50%;background:#4c8ff4;box-shadow:0 0 0 3px #dce9f5 inset}.legend-switch-icon{width:25px;height:25px;border-radius:7px;display:grid;place-items:center;background:#6da8c5;border:2px solid #315d7e}.legend-switch-icon i{width:11px;height:11px;border-radius:50%;background:#edf9fb;border:2px solid #214966}
.settings-actions button{min-height:52px}
html[data-text-size="large"] #game .mechanic-chip-copy{font-size:16px}html[data-text-size="large"] .modal p,html[data-text-size="large"] .legend-item{font-size:15px}html[data-text-size="large"] .story-scroll{font-size:17px}
@media(max-width:380px){#game .game-top .logo{display:none}#game .game-title{font-size:21px}.moves-box{min-width:56px}.moves-box span{font-size:10px}.moves-box strong{font-size:24px}}
@media(max-height:620px){#game{padding-top:calc(5px + env(safe-area-inset-top));padding-bottom:calc(5px + env(safe-area-inset-bottom))}#game .game-top{min-height:48px;margin-bottom:4px;padding:5px 7px}#game .board{width:min(100%,480px,40svh)}#game .mechanic-note{margin:3px auto 0;padding:5px 8px;gap:5px}.mechanic-chip-label{font-size:9px!important}.mechanic-chip-copy{font-size:11.5px!important}#game .controls{grid-template-columns:58px 144px 58px;gap:6px;padding-top:3px}#game .dpad{width:144px;height:144px}#game .side-action{min-height:50px;font-size:11px}.side-action svg{width:21px;height:21px}}
'''
write(p,s)

# ---------------------------------------------------------------------------
# style400-ui.css: user motion/readability preferences.
# ---------------------------------------------------------------------------
p='style400-ui.css'; s=read(p)
s += r'''

/* User-facing accessibility preferences. System remains the default. */
html[data-motion="reduced"] *,html[data-motion="reduced"] *:before,html[data-motion="reduced"] *:after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}
html[data-text-size="large"] .story-screen-card,html[data-text-size="large"] .story-briefing,html[data-text-size="large"] .story-current-chapter{font-size:1.08em}
'''
write(p,s)

# ---------------------------------------------------------------------------
# Atlas: actual non-overlapping 44px chapter targets in a scrollable row.
# ---------------------------------------------------------------------------
p='style400-skyway-atlas.css'; s=read(p)
s += r'''

/* Audit Pass 1 touch targets. The small dot remains a visual glyph inside a real target. */
.atlas-chapter-nav{min-height:48px;grid-template-columns:44px minmax(0,1fr) 44px}
.atlas-chapter-arrow{width:44px;height:44px;min-width:44px;border-radius:18px}
.atlas-region-dots{justify-content:flex-start;gap:2px;overflow-x:auto;scrollbar-width:none;padding:0 2px}.atlas-region-dots::-webkit-scrollbar{display:none}
.atlas-region-dot,.atlas-region-dot.active{position:relative;flex:0 0 44px;width:44px;height:44px;border:0;background:transparent;box-shadow:none;border-radius:14px}
.atlas-region-dot:before{content:"";position:absolute;left:50%;top:50%;translate:-50% -50%;width:13px;height:13px;border-radius:50%;border:2px solid rgba(255,255,255,.66);background:rgba(28,55,78,.27);box-shadow:0 2px 6px rgba(16,37,56,.12)}
.atlas-region-dot.active:before{width:31px;border-radius:9px;background:var(--atlas-accent,#79b95b);border-color:rgba(255,255,255,.84);box-shadow:0 0 0 2px rgba(31,55,70,.08),0 3px 8px rgba(16,37,56,.18)}
.atlas-waypoint-tab{min-height:44px;height:44px}
'''
write(p,s)

print('AUDIT_PASS1_PATCH_APPLIED')
