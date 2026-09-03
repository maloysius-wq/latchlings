'use strict';
(function(){
const STORY=window.LATCHLINGS_STORY||null;
const SEEN_KEY='latchlings_story_cards_seen_v1';
const CHAR_COLORS={coral:'#ef5f66',blue:'#4c8ff4',mint:'#66bd72',gold:'#f6b737',lavender:'#9a72df'};
const CHAR_LIGHT={coral:'#ff9297',blue:'#79aff9',mint:'#94dc98',gold:'#ffd06a',lavender:'#c3a0f1'};
const CHAR_DARK={coral:'#c33d49',blue:'#2e69c8',mint:'#469852',gold:'#d18c16',lavender:'#724fbd'};
const CHAR_EXPR={Pippa:'curious',Bramble:'smug',Rowan:'happy',Pip:'determined',Tansy:'surprised'};
let activeLevel=1;
const CH_DEFAULTS={1:['basket','flower','mail'],2:['lantern','parcel','jar'],3:['anchor','crystal','chalk'],4:['market','basket','mask'],5:['prism','flower','telescope'],6:['rail','map','compass'],7:['gear','signal','parcel'],8:['compass','home','aurora']};
const RULES=[
 [/watering|water/, 'water'],[/kite/, 'kite'],[/scarf/, 'scarf'],[/mail|post|parcel|letter/, 'parcel'],[/lantern|porch light/, 'lantern'],[/ladder/, 'ladder'],[/firefly|jar/, 'jar'],[/pie/, 'pie'],[/bell/, 'bell'],[/anchor|lodestone/, 'anchor'],[/crystal|glass|prism|rainbow/, 'crystal'],[/chalk|marker|record|timetable|map|drawer/, 'map'],[/berries|berry|spice|basket|seeds|picnic|lunch|tea|supper|bread/, 'basket'],[/cart|express|maintenance/, 'cart'],[/mask|suit|ribbon|parade|market|stall/, 'mask'],[/flower|garden/, 'flower'],[/telescope|distant|horizon|high path/, 'telescope'],[/rail|turner|junction|station|line/, 'rail'],[/compass/, 'compass'],[/switch|relay|signal|door|foundry|storm/, 'gear'],[/friend|visitor|arrival|home|porch/, 'home']
];
const ICONS={
 basket:'<path d="M13 28h38l-5 24H18z"/><path d="M22 28c1-11 7-17 10-17s9 6 10 17"/><path class="secondary" d="M19 35h29v6H19z"/>',
 water:'<path d="M17 28h29v24H17z"/><path d="M46 34c11 0 12 12 3 14"/><path d="M18 31 9 24l2-5 12 7"/><circle class="secondary" cx="31" cy="19" r="8"/>',
 kite:'<path d="m32 8 18 20-18 18-18-18z"/><path d="M32 46c0 8 11 5 8 12"/><path class="secondary" d="m28 50 7 5-7 5z"/>',
 parcel:'<path d="M11 18h42v34H11z"/><path d="M11 30h42M32 18v34"/><path class="secondary" d="M24 14h16v9H24z"/>',
 lantern:'<path d="M18 22h28l-4 31H22z"/><path d="M23 22c0-12 18-12 18 0"/><path class="secondary" d="M26 31h12v13H26z"/>',
 ladder:'<path d="M18 8v48M46 8v48M18 18h28M18 30h28M18 42h28M18 54h28"/>',
 jar:'<path d="M18 18h28v7H18z"/><path d="M21 25h22l4 29H17z"/><circle class="secondary" cx="28" cy="36" r="3"/><circle class="secondary" cx="37" cy="43" r="3"/>',
 pie:'<path d="M11 29c2-15 40-15 42 0v20c-5 9-37 9-42 0z"/><path class="secondary" d="M14 29c7 7 29 7 36 0M23 23l18 11M41 23 23 34"/>',
 bell:'<path d="M18 44h28c-4-5-5-12-5-19 0-15-18-15-18 0 0 7-1 14-5 19z"/><path class="secondary" d="M27 48h10c-1 8-9 8-10 0z"/>',
 anchor:'<circle cx="32" cy="12" r="6"/><path d="M32 18v31M20 27h24M13 40c3 12 10 17 19 17s16-5 19-17M13 40l-7 4M51 40l7 4"/>',
 crystal:'<path d="m32 6 14 17-6 33H24l-6-33z"/><path class="secondary" d="m32 6 2 50M18 23h28"/>',
 map:'<path d="m9 14 15-6 16 6 15-6v42l-15 6-16-6-15 6z"/><path class="secondary" d="M24 8v42M40 14v42M16 25c8-5 12 9 20 2s12 6 14 3"/>',
 cart:'<path d="M10 21h36l7 24H15z"/><circle cx="22" cy="51" r="6"/><circle cx="45" cy="51" r="6"/><path class="secondary" d="M17 15h24v8H17z"/>',
 mask:'<path d="M9 22c12-7 34-7 46 0l-6 24c-10 6-24 6-34 0z"/><path class="secondary" d="M17 31c6-5 10-4 13 1-5 4-9 4-13-1zm30 0c-6-5-10-4-13 1 5 4 9 4 13-1z"/>',
 market:'<path d="M10 25h44v31H10z"/><path d="m8 25 6-15h36l6 15"/><path class="secondary" d="M15 10v15M25 10v15M35 10v15M45 10v15"/>',
 flower:'<circle class="secondary" cx="32" cy="28" r="6"/><circle cx="32" cy="15" r="9"/><circle cx="45" cy="28" r="9"/><circle cx="32" cy="41" r="9"/><circle cx="19" cy="28" r="9"/><path d="M32 46v12"/>',
 prism:'<path d="m32 7 22 43H10z"/><path class="secondary" d="M32 7v43M10 50h44M21 29h22"/>',
 telescope:'<path d="m14 18 32 10-5 14-32-10z"/><path d="M39 38 29 57M39 38l14 17"/><path class="secondary" d="m46 24 10 3-6 18-10-3z"/>',
 rail:'<path d="M13 10v44M51 10v44M13 18h38M13 31h38M13 44h38"/><path class="secondary" d="m24 6 8 10 8-10z"/>',
 compass:'<circle cx="32" cy="32" r="24"/><circle class="secondary" cx="32" cy="32" r="4"/><path d="m37 15-3 14-7 20 3-14z"/>',
 gear:'<path d="m29 6 6 0 2 8 7 3 7-4 4 5-5 6 2 7 8 3v6l-8 2-3 7 4 7-5 4-6-5-7 2-3 8h-6l-2-8-7-3-7 4-4-5 5-6-2-7-8-3v-6l8-2 3-7-4-7 5-4 6 5 7-2z"/><circle class="secondary" cx="32" cy="35" r="9"/>',
 signal:'<path d="M13 48h38M32 48V18"/><circle class="secondary" cx="32" cy="14" r="8"/><path d="M18 29c-6 4-6 10 0 14M46 29c6 4 6 10 0 14"/>',
 home:'<path d="m8 31 24-21 24 21v25H8z"/><path class="secondary" d="M26 38h12v18H26zM15 31h34"/>',
 scarf:'<path d="M19 8c18 7 22 16 12 27l9 21-9 3-8-20c-18-5-17-24-4-31z"/><path class="secondary" d="m36 49 9-3 4 9-9 3z"/>',
 chalk:'<path d="m14 45 30-30 7 7-30 30-12 3z"/><path class="secondary" d="m44 15 5-5 7 7-5 5z"/>',
 aurora:'<path d="M4 20c13-12 22 12 34 0s18-7 22-2M5 34c12-10 20 10 31 1s17-8 23-3M12 48c10-7 17 7 27 0s13-5 17-2"/><circle class="secondary" cx="13" cy="12" r="3"/><circle class="secondary" cx="52" cy="10" r="2"/>'
};
function iconSvg(key){const body=ICONS[key]||ICONS.parcel;return `<svg viewBox="0 0 64 64" aria-hidden="true">${body}</svg>`}
function charSuitSvg(s){
 if(s==='heart')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 86C39 74 13 58 13 34c0-14 10-23 23-23 8 0 14 4 18 10 4-6 10-10 18-10 13 0 23 9 23 23 0 24-26 40-45 52Z"/></svg>';
 if(s==='diamond')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 7 88 50 50 93 12 50Z"/></svg>';
 if(s==='club')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 12a19 19 0 0 1 12 34 20 20 0 1 1 9 37c-9 0-15-5-18-11 1 10 5 16 12 21H35c7-5 11-11 12-21-3 6-9 11-18 11a20 20 0 1 1 9-37A19 19 0 0 1 50 12Z"/></svg>';
 if(s==='spade')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8C43 22 14 36 14 60c0 13 10 23 23 23 8 0 13-4 16-10-1 9-5 15-12 20h18c-7-5-11-11-12-20 3 6 8 10 16 10 13 0 23-10 23-23C86 36 57 22 50 8Z"/></svg>';
 return '';
}
function characterVars(c){const color=CHAR_COLORS[c.color]||CHAR_COLORS.blue;return `--charColor:${color};--charLight:${CHAR_LIGHT[c.color]||color};--charDark:${CHAR_DARK[c.color]||color}`}
function characterFace(){return '<span class="face"><span class="eyes"><i class="eye"></i><i class="eye"></i></span><i class="mouth"></i></span>'}
function characterPortrait(c,index,total){const expr=CHAR_EXPR[c.name]||'happy';return `<span class="story-scene-character story-scene-character-${index+1} story-scene-character-count-${total}" data-character="${escapeHtml(c.name)}" data-color="${escapeHtml(c.color)}" data-suit="${escapeHtml(c.suit)}" style="${characterVars(c)}"><span class="story-char-body expr-${expr}"><span class="suit-mark">${charSuitSvg(c.suit)}</span>${characterFace()}</span></span>`}
function characterAvatar(c){return `<span class="story-character-avatar" data-character="${escapeHtml(c.name)}" data-color="${escapeHtml(c.color)}" data-suit="${escapeHtml(c.suit)}" style="${characterVars(c)}"><span class="story-character-avatar-suit">${charSuitSvg(c.suit)}</span><span class="story-character-avatar-eyes"><i></i><i></i></span></span>`}
function characterChip(c){return `<div class="story-character-chip" data-character="${escapeHtml(c.name)}">${characterAvatar(c)}<span class="story-character-copy"><strong>${escapeHtml(c.name)}</strong><small>${escapeHtml(c.shortRole||c.role)}</small></span></div>`}
function residentCard(c){return `<div class="story-person story-person-portrait" data-character="${escapeHtml(c.name)}">${characterAvatar(c)}<span class="story-person-copy"><strong>${escapeHtml(c.name)}</strong><span>${escapeHtml(c.role)}. ${escapeHtml(c.voice)}</span></span></div>`}
function featuredFor(meta,chapter){if(!STORY||!STORY.featuredResidents||!meta)return[];const flavor=meta.local===1?chapter.opening:meta.flavor;return STORY.featuredResidents(`${meta.context} ${flavor}`).slice(0,2)}
function seenMap(){try{return JSON.parse(localStorage.getItem(SEEN_KEY)||'{}')}catch(_){return {}}}
function markSeen(level){const seen=seenMap();seen[level]=1;try{localStorage.setItem(SEEN_KEY,JSON.stringify(seen))}catch(_){}}
function decorFor(meta){if(!meta)return ['parcel'];const txt=(meta.title+' '+meta.context).toLowerCase(),out=[];for(const [re,key] of RULES){if(re.test(txt)&&!out.includes(key))out.push(key);if(out.length>=2)break}for(const k of CH_DEFAULTS[meta.chapter]||[]){if(!out.includes(k))out.push(k);if(out.length>=3)break}return out.slice(0,3)}
function kindFor(meta){if(meta.local===1)return 'Chapter opening';if(meta.local%10===0)return 'Turning point';return 'Route story'}
function escapeHtml(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}
function vignette(meta,featured=[]){const props=decorFor(meta),people=featured.slice(0,2);return `<div class="story-scene-land"></div>${props.map((p,i)=>`<span class="story-scene-prop scene-p${i+1} prop-${p}">${iconSvg(p)}</span>`).join('')}<span class="story-scene-route"></span>${people.map((c,i)=>characterPortrait(c,i,people.length)).join('')}`}
function decorateLevel(level,meta){activeLevel=Number(level)||activeLevel;meta=meta||(STORY?STORY.levelMeta(level):null);const host=document.getElementById('levelProps'),board=document.getElementById('board');if(!host||!meta)return;const props=decorFor(meta);host.dataset.level=String(level);host.dataset.props=props.join(',');host.innerHTML=props.map((p,i)=>`<span class="level-prop prop-pos-${i+1} prop-${p}">${iconSvg(p)}</span>`).join('');if(board){board.dataset.chapter=String(meta.chapter);board.dataset.storyProps=props.join(',')}}
function show(level,manual=false){
 if(!STORY)return;
 const meta=STORY.levelMeta(level),chapter=STORY.chapters[meta.chapter-1],overlay=document.getElementById('storyCardOverlay');if(!overlay)return;
 const flavor=meta.local===1?chapter.opening:meta.flavor,featured=featuredFor(meta,chapter);
 overlay.className=`story-card-overlay story-card-ch${meta.chapter} story-card-${meta.local===1?'chapter':meta.local%10===0?'milestone':'route'} show`;
 overlay.dataset.level=String(level);overlay.dataset.manual=manual?'1':'0';overlay.dataset.featured=featured.map(c=>c.name).join(',');
 document.getElementById('storyCardKind').textContent=kindFor(meta);document.getElementById('storyCardLocation').textContent=`Chapter ${meta.chapter} · ${meta.location}`;document.getElementById('storyCardTitle').textContent=meta.title;document.getElementById('storyCardContext').textContent=meta.context;document.getElementById('storyCardFlavor').textContent=flavor;document.getElementById('storyCardScene').innerHTML=vignette(meta,featured);
 const characters=document.getElementById('storyCardCharacters');if(characters){characters.innerHTML=featured.map(characterChip).join('');characters.hidden=!featured.length;characters.classList.toggle('is-pair',featured.length>1)}
 const crew=document.getElementById('storyCardCrewNote');if(crew){const showCrew=meta.level===1;crew.hidden=!showCrew;const copy=crew.querySelector('span');if(copy)copy.textContent=showCrew?`${STORY.helperCrewMotto} The Latchlings on the board are the helper crew working this route with you.`:''}
 document.getElementById('storyCardContinue').textContent=manual?'Back to board':'Continue';overlay.setAttribute('aria-hidden','false');requestAnimationFrame(()=>document.getElementById('storyCardContinue')?.focus())
}
function close(mark=true){const overlay=document.getElementById('storyCardOverlay');if(!overlay)return;const level=Number(overlay.dataset.level)||activeLevel;if(mark)markSeen(level);overlay.classList.remove('show');overlay.setAttribute('aria-hidden','true')}
function autoEligible(meta){return !!meta&&(meta.local===1||meta.local%10===0)}
function enterLevel(level){activeLevel=Number(level)||activeLevel;if(!STORY)return;const meta=STORY.levelMeta(level);if(!autoEligible(meta))return;const seen=seenMap();window.setTimeout(()=>{if(!seen[level])show(level,false)},260)}
const trigger=document.getElementById('storyCardBtn'),closer=document.getElementById('storyCardClose'),cont=document.getElementById('storyCardContinue');
if(trigger){trigger.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5c2.6-.9 5.2-.5 8 1.2v12c-2.8-1.7-5.4-2.1-8-1.2zM20 5.5c-2.6-.9-5.2-.5-8 1.2v12c2.8-1.7 5.4-2.1 8-1.2z"/><path d="M12 6.7v12"/></svg>';trigger.onclick=()=>show(activeLevel,true)}
if(closer)closer.onclick=()=>close(true);if(cont)cont.onclick=()=>close(true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById('storyCardOverlay')?.classList.contains('show'))close(true)});
window.LatchlingsStoryTheme={decorateLevel,enterLevel,show,close,decorFor,iconSvg,autoEligible,featuredFor,characterChip,residentCard};
})();
