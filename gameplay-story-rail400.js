'use strict';
(function(){
const STORY=window.LATCHLINGS_STORY;if(!STORY)return;
const PALETTE={coral:['#ef5f66','#ff9297','#c33d49'],blue:['#4c8ff4','#79aff9','#2e69c8'],mint:['#66bd72','#94dc98','#469852'],gold:['#f6b737','#ffd06a','#d18c16'],lavender:['#9a72df','#c3a0f1','#724fbd']};
const EXPR={Pippa:'curious',Bramble:'smug',Rowan:'happy',Pip:'determined',Tansy:'surprised'};
const CAST=Object.fromEntries((window.LATCHLINGS_CAST||STORY.cast||[]).map(c=>{const p=PALETTE[c.color]||PALETTE.blue;return [c.name,{color:p[0],light:p[1],dark:p[2],suit:c.suit,expr:EXPR[c.name]||'happy',child:c.name==='Pip'||c.name==='Tansy'}]}));
const SPEAKERS=[['Pippa','Pippa','Pip','Bramble','Bramble','Tansy','Pippa','Tansy','Bramble','Rowan'],['Bramble','Bramble','Pip','Tansy','Bramble','Rowan','Pippa','Tansy','Rowan','Bramble'],['Rowan','Rowan','Bramble','Bramble','Rowan','Pippa','Rowan','Bramble','Bramble','Rowan'],['Pippa','Tansy','Bramble','Pip','Tansy','Pippa','Rowan','Tansy','Bramble','Bramble'],['Tansy','Rowan','Tansy','Pippa','Tansy','Rowan','Pip','Bramble','Pippa','Rowan'],['Bramble','Rowan','Pippa','Bramble','Bramble','Rowan','Pip','Pippa','Rowan','Rowan'],['Pippa','Bramble','Rowan','Tansy','Pip','Bramble','Rowan','Pippa','Tansy','Bramble'],['Pippa','Rowan','Bramble','Pip','Tansy','Rowan','Pippa','Bramble','Tansy','Pip']];
const EARLY_STORY=[{speaker:'Pippa',line:'Breakfast basket missed a stop that worked yesterday.'},{speaker:'Rowan',line:'The watering marker shifted a whole garden bed.'},{speaker:'Pip',line:'My kite missed the same crossing. That makes two.'},{speaker:'Bramble',line:'East Sunpetal bread missed by the same distance.'},{speaker:'Tansy',line:'Neighbors report the same shifted crossings.'},{speaker:'Pippa',line:'Today’s stops no longer line up with yesterday’s map.'},{speaker:'Rowan',line:'The islands are fine. The routes fell behind.'},{speaker:'Bramble',line:'More households sent the same route report.'},{speaker:'Pippa',line:'Let’s build a temporary circuit from today’s positions.'},{speaker:'Tansy',line:'The new circuit works. People arrive where they meant to.'},{speaker:'Rowan',line:'The repair held, but fresh drift already changed things.'},{speaker:'Pippa',line:'One repair is not enough. Routes must keep changing.'},{speaker:'Bramble',line:'Send current coordinates and missed stops to Little Home.'},{speaker:'Pip',line:'An old marker points to where this island used to be.'},{speaker:'Tansy',line:'A vanished crossing cost a family their visiting hour.'},{speaker:'Rowan',line:'Local crews are testing new stops around old markers.'},{speaker:'Pippa',line:'The hardware works. Yesterday’s map is the problem.'},{speaker:'Bramble',line:'Shared reports let us repair routes faster together.'},{speaker:'Pip',line:'More old markers point to yesterday’s island positions.'},{speaker:'Tansy',line:'Sunpetal works for today. Now we rebuild beyond it.'}];
const MOVEMENT_RAIL_LINES={
 'A Pattern at Breakfast':'Morning routes shifted together.',
 'The Route Desk':'Fresh drift changed the route.',
 'Markers in the Grass':'Old markers show past positions.',
 'Build for Today':'Crews test today’s stops.',
 'The Drift Continues':'The islands keep moving.',
 'Almost Connected':'Lanternwood crossings miss.',
 'Travel Windows':'Neighbors time shared routes.',
 'A Porch Worth Reaching':'The twin-lantern porch drifts.',
 'The Missing Assumption':'Old routes need cooperation.',
 'Neighborhood Circuit':'Shared stops form a circuit.',
 'The Buried Stop':'An old anchor still answers.',
 'Made to Move':'Anchors were built to move.',
 'Everybody’s Job':'Ordinary crews kept routes.',
 'When the Cavern Shifts':'A shift breaks yesterday’s route.',
 'Holding, Not Freezing':'Anchors create reliable moments.',
 'Market Anyway':'The market opens through drift.',
 'The Right Stall':'Suit gates need matching routes.',
 'Older Than the Market':'Suit marks predate the market.',
 'Distant Stations':'Records link distant stations.',
 'Market Saved':'The market works again.',
 'The View Gets Wider':'Nearby islands moved outward.',
 'A Familiar Island, Farther Away':'A familiar island drifted farther.',
 'The Porch Light':'Twin lanterns still mark home.',
 'Yesterday Will Not Fit':'One old map breaks another region.',
 'New Coordinates':'The Waykeeper draws a new route.',
 'The Instructions Disagree':'Approved maps contradict.',
 'Look at the Dates':'The maps come from different years.',
 'They Were All Correct':'Each old map once fit.',
 'What Automation Hid':'Automation hid route revisions.',
 'Off the Old Map':'A route leaves the old map.',
 'One Switch, Two Regions':'One switch changes two regions.',
 'Same Travel Window':'Regions share one travel window.',
 'Useful Failure':'Bad timing improves the network.',
 'Faster Than Yesterday':'The network adapts faster.',
 'Waykeepers Everywhere':'Every region keeps the map.',
 'Old and New Together':'Old and new routes connect.',
 'Back on the Same Map':'Island groups reconnect.',
 'Visiting Without a Crisis Plan':'Visits no longer need rescue plans.',
 'One Node Among Many':'Little Home is one busy node.',
 'Tomorrow’s Route':'Route lights keep adjusting.',
};

const CHARACTER_TURNS={
 Pippa:['checks the plan','logs the next stop','compares today’s reports','marks the changed route','organizes another test','checks the safest option','updates the route notes','confirms the handoff','sets the final check','records what worked'],
 Bramble:['runs the first errand','tries the obvious shortcut','carries the next report','tests a detour','checks the busy crossing','tries the faster line','delivers the revised route','tests one last shortcut','brings back the result','calls the route usable'],
 Rowan:['measures the drift','checks the island edge','compares the old marker','watches the alignment','tests a stable stop','measures the new gap','checks the route again','confirms the island moved','watches the final approach','records the new position'],
 Pip:['spots the first clue','tests the bold route','finds the odd crossing','tries the tricky stop','calls out the mismatch','tests the narrow line','finds the useful blocker','takes the interesting route','spots the last snag','declares it solved'],
 Tansy:['notices who is waiting','checks the visit route','spots the human cost','follows the porch light','tests the shared stop','checks who can reach whom','notices a better handoff','keeps the visit possible','watches the last crossing','marks the route worth keeping']
};
function evolvingMovementLine(title,slot,speaker){const base=(MOVEMENT_RAIL_LINES[title]||'The route changes with the drift.').replace(/\.$/,'');const action=(CHARACTER_TURNS[speaker]||CHARACTER_TURNS.Pippa)[slot%10];return slot===0?base+'.':`${base}; ${speaker} ${action}.`}

function escapeHtml(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}
function suitSvg(s){if(s==='heart')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 86C39 74 13 58 13 34c0-14 10-23 23-23 8 0 14 4 18 10 4-6 10-10 18-10 13 0 23 9 23 23 0 24-26 40-45 52Z"/></svg>';if(s==='diamond')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 7 88 50 50 93 12 50Z"/></svg>';if(s==='club')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 12a19 19 0 0 1 12 34 20 20 0 1 1 9 37c-9 0-15-5-18-11 1 10 5 16 12 21H35c7-5 11-11 12-21-3 6-9 11-18 11a20 20 0 1 1 9-37A19 19 0 0 1 50 12Z"/></svg>';if(s==='spade')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8C43 22 14 36 14 60c0 13 10 23 23 23 8 0 13-4 16-10-1 9-5 15-12 20h18c-7-5-11-11-12-20 3 6 8 10 16 10 13 0 23-10 23-23C86 36 57 22 50 8Z"/></svg>';return ''}
function portrait(name){const c=CAST[name]||CAST.Pippa;return `<span class="rail-latchling ${c.child?'child':''} expr-${c.expr}" data-character="${name}" style="--rail-color:${c.color};--rail-light:${c.light};--rail-dark:${c.dark}"><span class="rail-suit">${suitSvg(c.suit)}</span><span class="rail-face"><span class="rail-eyes"><i></i><i></i></span><i class="rail-mouth"></i></span></span>`}
function levelFromDom(){return Number(document.getElementById('board')?.dataset.level||0)||0}
function render(){const host=document.getElementById('storyRailSlot');if(!host||document.body.dataset.screen!=='game')return;const level=levelFromDom();if(!level)return;if(document.body.dataset.playMode==='daily'){host.dataset.storyRailLevel='daily';host.innerHTML='<section class="story-level-rail daily-rail"><div class="story-rail-daily-mark" aria-hidden="true">✦</div><div class="story-rail-main"><div class="story-rail-meta"><strong>Daily Route</strong></div><p>A standalone puzzle for today. Campaign story and progress stay unchanged.</p></div></section>';return}if(host.dataset.storyRailLevel===String(level)&&host.querySelector('.story-level-rail'))return;const meta=STORY.levelMeta(level),chapter=meta.chapter,local=meta.local,slot=(local-1)%10,movement=STORY.movementForLevel?STORY.movementForLevel(level):null,early=chapter===1&&local<=20?EARLY_STORY[local-1]:null,speaker=early?.speaker||SPEAKERS[chapter-1][slot],line=early?.line||evolvingMovementLine(movement?.title,slot,speaker)||movement?.setup||meta.context;host.dataset.storyRailLevel=String(level);host.setAttribute('aria-label',`${speaker}. ${line}. Open Story for the full route context.`);host.innerHTML=`<section class="story-level-rail story-rail-ch${chapter}"><div class="story-rail-person">${portrait(speaker)}</div><div class="story-rail-main"><div class="story-rail-meta"><strong>${escapeHtml(speaker)}</strong><span>${escapeHtml(movement?.title||meta.title)}</span></div><p>${escapeHtml(line)}</p></div><button class="story-rail-story-btn" type="button" aria-label="Open full story for this level"><span aria-hidden="true">▣</span><b>Story</b></button></section>`;host.querySelector('.story-rail-story-btn')?.addEventListener('click',()=>document.getElementById('storyCardBtn')?.click())}
function sanitizeDebug(){const d=document.getElementById('debug');if(!d||d.dataset.playerSafe==='true'||getComputedStyle(d).display==='none')return;d.dataset.playerSafe='true';d.textContent='Something went wrong. Return to Level Select and try again.'}
let queued=false;function schedule(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;render();sanitizeDebug()})}
function install(){const title=document.getElementById('levelTitle'),debug=document.getElementById('debug');if(title)new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});if(debug)new MutationObserver(sanitizeDebug).observe(debug,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['style','class']});new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['data-screen','data-play-mode']});document.addEventListener('click',schedule,true);schedule()}
install();window.LatchlingsStoryRail={render,SPEAKERS,EARLY_STORY};
})();
