'use strict';
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
const LINES=[
 [
  'Breakfast first. I need that basket back at Little Home.',
  'The flowers are waiting. Let’s get the watering route lined up.',
  'My kite is not lost. It just needs a better route.',
  'Bread delivery coming through. I promised breakfast.',
  'Mail should visit homes, not tour the whole meadow.',
  'I volunteered to carry the tea, so let’s make this route gentle.',
  'Three chores share this garden path. I need it dependable.',
  'Everyone is heading to the picnic patch. Let’s get them there together.',
  'The cart is packed. Now it needs a route that still works.',
  'That scarf moved with the island. Let’s trace where the path shifted.'
 ],
 [
  'Supper is waiting across the grove. I’ll find us a clean way through.',
  'I borrowed that ladder. Returning it before anyone asks feels wise.',
  'The fireflies deserve a smooth ride. No unnecessary bumps.',
  'That pie is cooling on the wrong island. This is officially urgent.',
  'The woodland post works if we give each other the right places to stop.',
  'The supper bell already rang. Let’s help everyone arrive together.',
  'I promised to visit that garden before the seedlings are watered twice.',
  'Three homes, one basket, one route plan. We can make that work.',
  'That porch light needs to be in place before the grove gets dark.',
  'I found a shortcut. This time I brought witnesses.'
 ],
 [
  'That old anchor bell is ringing again. Let’s see where it wants us to stop.',
  'The crystal sample needs a dependable way back to the surface.',
  'Lunch found the cavern crew. Now we should help the crew find lunch.',
  'The cart only needs one reliable stop to make this whole route work.',
  'That echo lantern is headed deeper. I want a route we can repeat.',
  'The chalk marks make sense once we stop treating them like decoration.',
  'Tea is a surprisingly good test for whether these anchors are useful.',
  'I have a parcel for a station nobody knew was still here.',
  'This lunchbox survived decades underground. We can manage one trip home.',
  'The old Waykeepers kept moving their stops. We should too.'
 ],
 [
  'My berries are going to the berry stall, not whichever gate happens to open.',
  'This ribbon cart has offended every gate in the district. Let’s fix that.',
  'The clockmaker is timing us now. I would prefer a flattering result.',
  'The pie queue is moving. I vote we move faster.',
  'The parade and delivery lanes crossed again. That seems fun until you are carrying boxes.',
  'These flowers have one stall and one owner. Let’s use the right lane.',
  'The market bell means open, so the entrances need to work now.',
  'The mask box keeps visiting places it does not belong. I can relate, but still.',
  'The spice basket smells good enough that everyone claims it. We know where it goes.',
  'One last delivery before closing. I am absolutely counting this as on time.'
 ],
 [
  'The picnic basket has the route and the color right. Now we make both agree.',
  'Those blue panes belong in the glasshouse. The island is farther out than yesterday.',
  'I want this letter to reach Lanternwood while the porch is still easy to find.',
  'The garden cart needs both route marks to agree before anyone gets lunch.',
  'I can still see that porch. I want to keep being able to visit it.',
  'The rainbow seeds are sorted perfectly. Their route deserves the same care.',
  'From up here you can see how much the whole cluster has moved.',
  'The address is right. The island has simply moved somewhere new.',
  'Tea in the glasshouse has become a route meeting. I brought extra cups.',
  'This telescope is going home. I think we are going to need it.'
 ],
 [
  'The express cart knows where it wants to go. The turners have opinions.',
  'Follow the turn all the way through. The route is longer than it first looks.',
  'Lunch is traveling by rail, so I am reading every arrow twice.',
  'This timetable was correct once. Let’s find what is correct now.',
  'The station parcel can keep moving even when the route changes direction.',
  'Maintenance needs the awkward parts of the junction most. We’ll reach them.',
  'Every restored line rings that bell. I want to hear it again.',
  'All these maps disagree because the islands kept moving. That is the clue.',
  'This line is new. If it works now, that is what matters.',
  'The compass does not point backward. Neither should we.'
 ],
 [
  'Lunch can wait one more minute. The switches need to agree first.',
  'The foundry post is carrying reports from more than one region now.',
  'That storm parcel needs the door open at exactly the right moment.',
  'Open is not always better. Sometimes the closed door is the stop we need.',
  'One signal here changes a route somewhere else. Let’s make it deliberate.',
  'The relay is ready. Copperline is waiting for our timing.',
  'Visitors have a travel window now. I want it to stay dependable.',
  'Lanternwood sent their signal. Our turn.',
  'This run belongs to several communities at once. We all have a part.',
  'The arrival beam is lit. Let’s bring this route home.'
 ],
 [
  'The meadow signal is in. We can build from something people already trust.',
  'Lodestone is holding steady. I’ll watch the next shift.',
  'Copperline sent another map. Good. It means they are still adjusting.',
  'I found the interesting route. It also happens to be the useful one.',
  'Everyone is sending signals now. It feels like the Latchlands are talking.',
  'The network can change before yesterday becomes a problem. That is the goal.',
  'We do not need one perfect route. We need the next good one.',
  'Crown is receiving every region at once. I brought the newest coordinates.',
  'We can keep this connected because everyone keeps watching their part.',
  'Home is moving. Good thing we know how to find it.'
 ]
];
const PHASE_LINES=[
 ['Let’s start with the route we know.','The detour moved again; we’ll work around it.','The roundabout is longer, but it still gets us there.','Time to reroute this one from scratch.','One more stop and the morning circuit is ours.'],
 ['First we learn how to stop for one another.','More neighbors are joining the route now.','Two stops can solve what one cannot.','The grove is darker, so every safe stop matters.','Let’s bring the whole neighborhood home together.'],
 ['The first anchor gives us somewhere certain to land.','We are going deeper, where the old stops still remember their job.','The anchors can move with the route; let’s use that.','The cavern shifted again. We adjust with it.','Hold this line long enough for everyone to get through.'],
 ['Open the first lane and let the market breathe.','The gate marks are doing more of the talking now.','Crowds change the route; we change with them.','Last call. Make every lane count.','The market is almost connected end to end.'],
 ['Start with the colors close to home.','The light bends, but the route can still be read.','Everything is farther out now. Keep the connection alive.','The old coordinates are wrong. We can write new ones.','Across the drift, the route only matters if it reaches someone.'],
 ['Let’s put the first old line back to work.','The bend is part of the route, not a mistake.','Every revision tells us what the drift was doing.','The old map ends here. Our route does not.','A new line can be just as real as an old one.'],
 ['Start one switch at a time and watch what answers.','The system changes when we change it.','Sequence matters now. Let’s keep everyone in step.','Several regions are working this route together.','The network is awake. Keep the signals moving.'],
 ['Begin with the connections already answering us.','Under the aurora, every region is visible at once.','Reconnect what moved, not what the old map remembers.','This is a living route. It should keep changing.','Homeward means we keep finding one another.']
];
function escapeHtml(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}
function suitSvg(s){
 if(s==='heart')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 86C39 74 13 58 13 34c0-14 10-23 23-23 8 0 14 4 18 10 4-6 10-10 18-10 13 0 23 9 23 23 0 24-26 40-45 52Z"/></svg>';
 if(s==='diamond')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 7 88 50 50 93 12 50Z"/></svg>';
 if(s==='club')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 12a19 19 0 0 1 12 34 20 20 0 1 1 9 37c-9 0-15-5-18-11 1 10 5 16 12 21H35c7-5 11-11 12-21-3 6-9 11-18 11a20 20 0 1 1 9-37A19 19 0 0 1 50 12Z"/></svg>';
 if(s==='spade')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8C43 22 14 36 14 60c0 13 10 23 23 23 8 0 13-4 16-10-1 9-5 15-12 20h18c-7-5-11-11-12-20 3 6 8 10 16 10 13 0 23-10 23-23C86 36 57 22 50 8Z"/></svg>';
 return '';
}
function portrait(name){const c=CAST[name]||CAST.Pippa;return `<span class="rail-latchling ${c.child?'child':''} expr-${c.expr}" data-character="${name}" style="--rail-color:${c.color};--rail-light:${c.light};--rail-dark:${c.dark}"><span class="rail-suit">${suitSvg(c.suit)}</span><span class="rail-face"><span class="rail-eyes"><i></i><i></i></span><i class="rail-mouth"></i></span></span>`}
function levelFromDom(){const m=(document.getElementById('levelTitle')?.textContent||'').match(/(\d+)/);return m?Math.max(1,Math.min(400,+m[1])):0}
function movementLabel(chapter,phase){const c=STORY.chapters?.[chapter-1];const raw=c?.phase?.[phase]?.trim();return raw||c?.name||`Movement ${phase+1}`}
function render(){
 const note=document.getElementById('mechanicNote'),game=document.getElementById('game');if(!note||!game)return;
 const level=levelFromDom();if(!level||document.body.dataset.screen!=='game')return;
 if(note.dataset.storyRailLevel===String(level)&&note.querySelector('.story-level-rail'))return;
 const meta=STORY.levelMeta(level),chapter=meta.chapter,local=meta.local,slot=(local-1)%10,phase=Math.floor((local-1)/10),speaker=SPEAKERS[chapter-1][slot],base=LINES[chapter-1][slot],phaseLine=PHASE_LINES[chapter-1][phase],movement=movementLabel(chapter,phase),milestone=local%10===0;
 game.dataset.storyChapter=String(chapter);game.dataset.storyPhase=String(phase+1);game.dataset.storySlot=String(slot+1);game.dataset.storyMilestone=milestone?'true':'false';game.style.setProperty('--chapter-progress',`${(local/50*100).toFixed(2)}%`);
 const props=document.getElementById('levelProps');if(props){props.innerHTML='';props.hidden=true;props.setAttribute('aria-hidden','true')}
 const env=document.getElementById('levelEnvironment');if(env)env.remove();
 note.className='mechanic-note story-level-rail-host';note.dataset.storyRailLevel=String(level);note.setAttribute('aria-label',`${speaker}: ${base} ${phaseLine}. Chapter progress ${local} of 50.`);
 const segments=Array.from({length:5},(_,i)=>`<i class="${i<phase?'done':i===phase?'active':''}" aria-hidden="true"></i>`).join('');
 note.innerHTML=`<section class="story-level-rail story-rail-ch${chapter}"><div class="story-rail-person">${portrait(speaker)}<strong>${escapeHtml(speaker)}</strong></div><div class="story-rail-main"><div class="story-rail-meta"><span class="story-rail-title">${escapeHtml(meta.title)}</span><span class="story-rail-count">${local} / 50</span></div><p><span>${escapeHtml(base)}</span> <small>${escapeHtml(phaseLine)}</small></p><div class="story-rail-foot"><span class="story-rail-movement">${escapeHtml(movement)}</span><span class="story-rail-progress"><b></b>${segments}</span></div></div></section>`;
}
function sanitizeDebug(){const d=document.getElementById('debug');if(!d||d.dataset.playerSafe==='true'||getComputedStyle(d).display==='none')return;d.dataset.playerSafe='true';d.textContent='Something went wrong. Return to Level Select and try again.'}
let queued=false;function schedule(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;render();sanitizeDebug()})}
function install(){
 const title=document.getElementById('levelTitle'),note=document.getElementById('mechanicNote'),debug=document.getElementById('debug');
 if(title)new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
 if(note)new MutationObserver(schedule).observe(note,{childList:true,subtree:true,characterData:true});
 if(debug)new MutationObserver(sanitizeDebug).observe(debug,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['style','class']});
 new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['data-screen']});
 document.addEventListener('click',schedule,true);schedule();
}
install();
window.LatchlingsStoryRail={render,SPEAKERS,LINES,PHASE_LINES};
})();