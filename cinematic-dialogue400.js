'use strict';
(function(){
const API=window.LatchlingsCinematics;if(!API||!API.CINEMATICS)return;
const CAST={
 Pippa:{color:'#9a72df',light:'#c3a0f1',dark:'#724fbd',suit:'club',expr:'curious',role:'Organizer'},
 Bramble:{color:'#ef5f66',light:'#ff9297',dark:'#c33d49',suit:'diamond',expr:'smug',role:'Courier'},
 Rowan:{color:'#66bd72',light:'#94dc98',dark:'#469852',suit:'heart',expr:'happy',role:'Caretaker'},
 Pip:{color:'#4c8ff4',light:'#79aff9',dark:'#2e69c8',suit:'spade',expr:'determined',role:'Explorer',child:true},
 Tansy:{color:'#ef5f66',light:'#ff9297',dark:'#c33d49',suit:'heart',expr:'surprised',role:'Collector',child:true}
};
const opening=API.CINEMATICS.opening;
if(opening){
 opening.beats[0].lines=[['Narrator','The Latchlands are always moving. Not quickly. Not dangerously. Just enough that yesterday’s path is never quite today’s.']];
 opening.beats[1].lines=[
  ['Narrator','This is Little Home, a shared household where five very different sets of eyes keep catching different parts of the same day.'],
  ['Tansy','It was one basket.'],
  ['Pip','It was an expedition basket.']
 ];
 opening.beats[2].lines=[['Narrator','For generations, the Skyway has kept homes, gardens, markets, and neighbors connected while the islands drift. A good route does not hold the world still. It keeps working while the world moves.']];
 opening.beats[3].lines=[
  ['Narrator','Little Home is the first place where the odd little failures get compared instead of shrugged off: Pippa tracks broken routines, Rowan tracks the island’s drift, Bramble carries reports between neighbors, and Pip and Tansy keep noticing the clues adults step past. Together, their notes reveal one shared problem.'],
  ['Pippa','We can tell you what keeps going wrong.'],
  ['Rowan','You can help us read the route underneath it.']
 ];
 opening.beats[4].lines=[
  ['Narrator','Little Home becomes a coordination point, not a command post. Every community knows its own paths best. Neighbors volunteer observations, route crews, travel windows, and hands on their own Skyway hardware because every repaired route helps somebody get home.'],
  ['Bramble','We connect the reports. Everybody brings the part they know.']
 ];
 opening.beats[5].lines=[
  ['Narrator','Choose a Latchling, then choose a direction. They snap along that route until something stops them. An edge, a rock, or another helper can turn one move into the setup for the next.'],
  ['Rowan','Guide each helper into the nest that matches them. When every helper arrives safely, that route is working.']
 ];
 opening.beats[6].lines=[
  ['Narrator','Start small, Waykeeper. Fix the morning route. Then help Little Home compare what it learns with the neighbors who are already working on their own pieces of the Skyway.'],
  ['Pippa','That route worked yesterday.'],
  ['Rowan','Little Home moved farther than usual overnight.'],
  ['Pip','So breakfast is a puzzle now?'],
  ['Tansy','Breakfast is urgently a puzzle now.']
 ];
}
function escapeHtml(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}
function suitSvg(s){
 if(s==='heart')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 86C39 74 13 58 13 34c0-14 10-23 23-23 8 0 14 4 18 10 4-6 10-10 18-10 13 0 23 9 23 23 0 24-26 40-45 52Z"/></svg>';
 if(s==='diamond')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 7 88 50 50 93 12 50Z"/></svg>';
 if(s==='club')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 12a19 19 0 0 1 12 34 20 20 0 1 1 9 37c-9 0-15-5-18-11 1 10 5 16 12 21H35c7-5 11-11 12-21-3 6-9 11-18 11a20 20 0 1 1 9-37A19 19 0 0 1 50 12Z"/></svg>';
 if(s==='spade')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8C43 22 14 36 14 60c0 13 10 23 23 23 8 0 13-4 16-10-1 9-5 15-12 20h18c-7-5-11-11-12-20 3 6 8 10 16 10 13 0 23-10 23-23C86 36 57 22 50 8Z"/></svg>';
 return '';
}
function portrait(name,extra=''){const c=CAST[name];if(!c)return'';return `<span class="cin-character ${c.child?'child':''} ${extra} expr-${c.expr}" data-character="${escapeHtml(name)}" style="--cin-color:${c.color};--cin-light:${c.light};--cin-dark:${c.dark}"><span class="cin-suit">${suitSvg(c.suit)}</span><span class="cin-face"><span class="cin-eyes"><i></i><i></i></span><i class="cin-mouth"></i></span></span>`}
function dialogueLines(beat){return (beat?.lines||[]).filter(x=>x&&x[0]!=='Narrator'&&CAST[x[0]])}
function dialogueGroups(beat){const out=[],byName=new Map();for(const [name,text] of dialogueLines(beat)){if(!byName.has(name)){const g=[name,[]];byName.set(name,g);out.push(g)}byName.get(name)[1].push(text)}return out}
function narratorLines(beat){return (beat?.lines||[]).filter(x=>x&&x[0]==='Narrator').map(x=>x[1])}
function speechTextHtml(texts){return texts.map((text,i)=>`<span${i?' class="speech-followup"':''}>${escapeHtml(text)}</span>`).join('')}
function bubbleHtml(name,texts,index,count){return `<div class="cin-dialogue-speaker speaker-${index+1} speaker-count-${count}" data-speaker="${escapeHtml(name)}"><div class="cin-speech-bubble"><b>${escapeHtml(name)}</b>${speechTextHtml(texts)}</div>${portrait(name,'dialogue-portrait')}<span class="cin-speaker-name">${escapeHtml(name)}</span></div>`}
function castIntroHtml(groups){const spoken=new Map(groups);const order=['Pippa','Bramble','Rowan','Pip','Tansy'];return `<div class="cin-dialogue-layer cin-cast-intro" data-dialogue-count="${groups.length}">${order.map((name,i)=>{const c=CAST[name],speech=spoken.get(name);return `<div class="cin-intro-person intro-${i+1}" data-speaker="${name}">${speech?`<div class="cin-speech-bubble intro-bubble"><b>${name}</b>${speechTextHtml(speech)}</div>`:''}${portrait(name,'dialogue-portrait')}<span class="cin-speaker-name">${name}</span><small>${c.role}</small></div>`}).join('')}</div>`}
function dialogueLayerHtml(id,index,beat){const groups=dialogueGroups(beat);if(id==='opening'&&index===1)return castIntroHtml(groups);if(!groups.length)return '';
 return `<div class="cin-dialogue-layer" data-dialogue-count="${groups.length}">${groups.map(([name,texts],i)=>bubbleHtml(name,texts,i,groups.length)).join('')}</div>`;
}
function accessibleDialogueHtml(groups){if(!groups.length)return'';return `<span class="cin-dialogue-a11y">${groups.map(([name,texts])=>`${escapeHtml(name)}: ${texts.map(escapeHtml).join(' ')}`).join(' ')}</span>`}
let scheduled=false,processing=false;
function postProcess(){
 scheduled=false;if(processing)return;const id=API.active,index=API.beat,c=API.CINEMATICS[id],beat=c&&c.beats[index],overlay=document.getElementById('cinematicOverlay'),stage=document.getElementById('cinematicStage'),lines=document.getElementById('cinematicLines');
 if(!id||!beat||!overlay||!stage||!lines)return;
 processing=true;
 try{
  const groups=dialogueGroups(beat);
  if(!stage.querySelector(':scope > .cin-dialogue-layer'))stage.insertAdjacentHTML('beforeend',dialogueLayerHtml(id,index,beat));
  const narration=narratorLines(beat);lines.classList.add('cinematic-narration-only');lines.dataset.narratorCount=String(narration.length);
  const desired=narration.map(text=>`<p class="narrator-only"><span>${escapeHtml(text)}</span></p>`).join('')+accessibleDialogueHtml(groups);
  if(lines.innerHTML!==desired)lines.innerHTML=desired;
  lines.hidden=!narration.length&&!groups.length;
  overlay.dataset.dialogueCount=String(groups.length);
  overlay.dataset.narratorCount=String(narration.length);
 }finally{processing=false}
}
function schedule(){if(processing||scheduled)return;scheduled=true;queueMicrotask(postProcess)}
function observe(){
 const overlay=document.getElementById('cinematicOverlay');if(!overlay){requestAnimationFrame(observe);return}
 new MutationObserver(schedule).observe(overlay,{subtree:true,childList:true,attributes:true,attributeFilter:['data-cinematic','data-visual','class']});
 schedule();
}
const oldEnsure=API.show;API.show=function(){const out=oldEnsure.apply(API,arguments);requestAnimationFrame(()=>requestAnimationFrame(schedule));return out};
observe();
window.LatchlingsCinematicDialogue={CAST,postProcess,narratorLines,dialogueLines,dialogueGroups};
})();