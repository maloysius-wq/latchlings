'use strict';
(function(){
const STORY=window.LATCHLINGS_STORY||null;
const THEME=window.LatchlingsStoryTheme||null;
const LEVELS=window.LEVELS||[];
const PHASES=[
 {key:'home-morning',label:'Little Home Morning'},
 {key:'meadow-detours',label:'Meadow Detours'},
 {key:'open-fields',label:'Open Fields'},
 {key:'reroute-work',label:'Reroute Work'},
 {key:'golden-return',label:'Golden-Hour Return'}
];
const SUBJECTS=[
 {key:'breakfast',label:'Breakfast Basket'},
 {key:'watering',label:'Watering Can'},
 {key:'kite',label:'Blue Kite'},
 {key:'bread',label:'Bread Run'},
 {key:'mail',label:'Mail Sack'},
 {key:'tea',label:'Tea Tray'},
 {key:'gate',label:'Garden Gate'},
 {key:'picnic',label:'Picnic Cloth'},
 {key:'cart',label:'Sunpetal Cart'},
 {key:'scarf',label:'Lost Scarf'}
];
const ACCENTS=[['flower','parcel'],['water','flower'],['kite','flower'],['basket','home'],['parcel','home'],['basket','flower'],['flower','home'],['basket','flower'],['cart','parcel'],['scarf','flower']];
function subjectSvg(key){
 const paths={
  breakfast:'<path d="M12 31h40l-6 22H18z"/><path d="M20 31c1-12 8-19 12-19s11 7 12 19"/><path class="secondary" d="M18 38h30v7H18z"/>',
  watering:'<path d="M17 28h29v24H17z"/><path d="M46 34c11 0 12 12 3 14"/><path d="M18 31 9 24l2-5 12 7"/><circle class="secondary" cx="31" cy="19" r="8"/>',
  kite:'<path d="m32 7 19 21-19 19-19-19z"/><path d="M32 47c0 8 11 5 8 13"/><path class="secondary" d="m28 52 8 5-8 5z"/>',
  bread:'<path d="M12 35c0-10 7-19 20-19s20 9 20 19v17H12z"/><path class="secondary" d="M23 18c2 7 2 12 0 18M33 17c2 7 2 12 0 19M43 20c1 6 1 10-1 15"/>',
  mail:'<path d="M12 20h40v33H12z"/><path d="m12 22 20 17 20-17"/><path class="secondary" d="m19 48 10-10m16 10L35 38"/>',
  tea:'<path d="M14 28h33v22H14z"/><path d="M47 33c10 0 11 12 2 14"/><path class="secondary" d="M20 23h20M23 17h14"/><path d="M10 52h43"/>',
  gate:'<path d="M14 16v40M50 16v40M14 24h36M14 50h36"/><path class="secondary" d="M21 27v20M32 27v20M43 27v20"/>',
  picnic:'<path d="M10 20h44v35H10z"/><path class="secondary" d="M10 32h44M10 44h44M24 20v35M39 20v35"/><path d="m18 17 5-7m23 7-5-7"/>',
  cart:'<path d="M10 23h37l6 23H15z"/><circle cx="22" cy="52" r="6"/><circle cx="45" cy="52" r="6"/><path class="secondary" d="M17 16h25v9H17z"/>',
  scarf:'<path d="M20 8c18 7 22 16 12 27l9 21-9 3-8-20c-18-5-17-24-4-31z"/><path class="secondary" d="m37 49 9-3 4 9-9 3z"/>'
 };
 return `<svg viewBox="0 0 64 64" aria-hidden="true">${paths[key]||paths.breakfast}</svg>`;
}
function ensureEnvironment(){
 const game=document.getElementById('game');if(!game)return null;
 let env=document.getElementById('levelEnvironment');
 if(!env){
  env=document.createElement('div');env.id='levelEnvironment';env.className='level-environment';env.setAttribute('aria-hidden','true');
  env.innerHTML='<div class="lv-sky"><i class="lv-sun"></i><i class="lv-cloud c1"></i><i class="lv-cloud c2"></i><i class="lv-cloud c3"></i><i class="lv-far-island i1"></i><i class="lv-far-island i2"></i></div><div class="lv-landmarks"><i class="lv-cottage"></i><i class="lv-hedge h1"></i><i class="lv-hedge h2"></i><i class="lv-signpost"></i><i class="lv-creek"></i><i class="lv-windmill"><b></b></i><i class="lv-route-stake s1"></i><i class="lv-route-stake s2"></i><i class="lv-route-stake s3"></i><i class="lv-lantern l1"></i><i class="lv-lantern l2"></i><i class="lv-lantern l3"></i></div><div class="lv-ambient"><i class="lv-butterfly b1"></i><i class="lv-butterfly b2"></i><i class="lv-seed p1"></i><i class="lv-seed p2"></i><i class="lv-seed p3"></i></div><div class="lv-reactive"><i class="lv-route-thread t1"></i><i class="lv-route-thread t2"></i><i class="lv-reactive-flower f1"></i><i class="lv-reactive-flower f2"></i><i class="lv-reactive-flower f3"></i></div><div class="lv-milestone-badge"></div>';
  game.prepend(env);
 }
 return env;
}
function clearChapterOneState(){
 const app=document.getElementById('app'),game=document.getElementById('game'),env=document.getElementById('levelEnvironment');
 if(app){delete app.dataset.sunpetalPhase;delete app.dataset.sunpetalAmbient;delete app.dataset.sunpetalMilestone}
 if(game){delete game.dataset.levelSubject;delete game.dataset.routeProgress;game.style.removeProperty('--lv-progress')}
 if(env){env.hidden=true;delete env.dataset.level;delete env.dataset.phase;delete env.dataset.ambient;env.className='level-environment'}
}
function renderLevelProps(meta,subject,slot){
 const host=document.getElementById('levelProps');if(!host||!THEME)return;
 const accent=ACCENTS[slot-1]||['flower','parcel'];
 host.classList.add('lv-level-props');
 host.dataset.subject=subject.key;
 host.innerHTML=`<span class="level-prop lv-subject-medallion" title="${subject.label}">${subjectSvg(subject.key)}</span><span class="level-prop lv-accent-medallion a1">${THEME.iconSvg(accent[0])}</span><span class="level-prop lv-accent-medallion a2">${THEME.iconSvg(accent[1])}</span>`;
}
function apply(level,meta){
 const L=Math.max(1,Math.min(400,Number(level)||1));meta=meta||(STORY?STORY.levelMeta(L):null);
 const env=ensureEnvironment(),app=document.getElementById('app'),game=document.getElementById('game');
 if(!env||!app||!game||!meta||meta.chapter!==1){clearChapterOneState();return}
 const local=meta.local||L,phaseIndex=Math.floor((local-1)/10),slot=(local-1)%10+1,ambient=((local-1)%10)<5?'a':'b',phase=PHASES[phaseIndex],subject=SUBJECTS[slot-1],milestone=local%10===0;
 env.hidden=false;env.dataset.level=String(L);env.dataset.phase=phase.key;env.dataset.ambient=ambient;env.className=`level-environment phase-${phase.key} ambient-${ambient} subject-${subject.key}${milestone?' milestone':''}`;
 app.dataset.sunpetalPhase=String(phaseIndex+1);app.dataset.sunpetalAmbient=ambient;if(milestone)app.dataset.sunpetalMilestone='true';else delete app.dataset.sunpetalMilestone;
 game.dataset.levelSubject=subject.key;game.dataset.routeProgress='start';game.style.setProperty('--lv-progress','0');
 const badge=env.querySelector('.lv-milestone-badge');if(badge)badge.textContent=milestone?`${phase.label} · Route ${local}`:phase.label;
 renderLevelProps(meta,subject,slot);
 window.requestAnimationFrame(updateRouteProgress);
}
function updateRouteProgress(){
 const env=document.getElementById('levelEnvironment'),game=document.getElementById('game'),layer=document.getElementById('pieceLayer');if(!env||!game||env.hidden||!layer)return;
 const L=Number(env.dataset.level)||0,lev=LEVELS[L-1];if(!lev||L<1||L>50)return;
 const total=(lev.pieces||[]).length||1,remaining=layer.querySelectorAll('.latchling').length,delivered=Math.max(0,total-remaining),ratio=Math.max(0,Math.min(1,delivered/total));
 game.style.setProperty('--lv-progress',ratio.toFixed(2));
 game.dataset.routeProgress=ratio>=1?'complete':ratio>0?'working':'start';
 env.dataset.delivered=String(delivered);
}
function install(){
 if(!THEME||typeof THEME.decorateLevel!=='function'||THEME.__sunpetalVariationWrapped)return;
 const original=THEME.decorateLevel.bind(THEME);
 THEME.decorateLevel=function(level,meta){original(level,meta);apply(level,meta)};
 THEME.__sunpetalVariationWrapped=true;
 const layer=document.getElementById('pieceLayer');if(layer)new MutationObserver(()=>window.requestAnimationFrame(updateRouteProgress)).observe(layer,{childList:true,subtree:false});
}
install();
window.LatchlingsLevelVariation={apply,updateRouteProgress,PHASES,SUBJECTS};
})();