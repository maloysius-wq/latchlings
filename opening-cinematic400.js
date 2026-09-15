'use strict';
(function(){
const SVG_NS='http://www.w3.org/2000/svg';
function boardHtml(suitSvg){
 const level=window.LEVELS&&window.LEVELS[0];if(!level)return'';
 const rocks=new Set(level.rocks.map(([r,c])=>r+':'+c)),nests=new Map(level.nests.map(([r,c],i)=>[r+':'+c,level.pieces[i]])),pieces=new Map(level.pieces.map(p=>[p.pos[0]+':'+p.pos[1],p]));
 let cells='';for(let r=0;r<level.size;r++)for(let c=0;c<level.size;c++){const key=r+':'+c,p=pieces.get(key),n=nests.get(key);cells+=`<span class="opening-board-cell ${rocks.has(key)?'is-rock':''}">${n?`<i class="opening-board-nest">${suitSvg(n.suit)}</i>`:''}${p?`<i class="opening-board-piece" style="--piece:${p.color}">${suitSvg(p.suit)}</i>`:''}</span>`}
 return `<div class="opening-board-model" aria-hidden="true"><span class="opening-board-label">WAYKEEPER ROUTE MODEL</span><div class="opening-board-grid" style="--opening-grid:${level.size}">${cells}</div></div>`;
}
function create({character,suitSvg}){
 return `<div class="cin-opening-continuous" data-step="1">
  <div class="opening-world">
   <span class="opening-cloud cloud-a"></span><span class="opening-cloud cloud-b"></span>
   <svg class="opening-route-map" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
    <path id="opening-route-working" class="opening-route route-working" data-target="#opening-anchor-working" d="M80 150 C150 115 230 122 310 150"/>
    <circle id="opening-anchor-working" class="opening-anchor" cx="310" cy="150" r="4"/>
    <path id="opening-route-basket" class="opening-route route-basket" data-target="#opening-anchor-basket" d="M205 260 C330 210 505 270 650 315"/>
    <circle id="opening-anchor-basket" class="opening-anchor old-stop" cx="650" cy="315" r="9"/>
    <path id="opening-route-water" class="opening-route route-water" data-target="#opening-anchor-water" d="M690 350 C680 390 695 415 720 430"/>
    <circle id="opening-anchor-water" class="opening-anchor old-stop" cx="720" cy="430" r="9"/>
    <path id="opening-route-play" class="opening-route route-play" data-target="#opening-anchor-play" d="M745 440 C760 455 775 472 790 485"/>
    <circle id="opening-anchor-play" class="opening-anchor old-stop" cx="790" cy="485" r="9"/>
    <path id="opening-route-call" class="opening-route route-call" data-target="#opening-anchor-player" d="M705 285 C560 150 350 72 155 102"/>
    <circle id="opening-anchor-player" class="opening-anchor player-anchor" cx="155" cy="102" r="10"/>
    <path id="opening-route-crew" class="opening-route route-crew" data-target="#opening-anchor-crew" d="M420 455 C475 438 525 428 575 420"/>
    <circle id="opening-anchor-crew" class="opening-anchor crew-anchor" cx="575" cy="420" r="6"/>
   </svg>
   <div class="opening-island opening-neighbor"><i class="opening-earth island-side"></i><i class="opening-grass island-top"></i><i class="opening-wood neighbor-bakery"></i></div>
   <div class="opening-island opening-distant"><i class="opening-earth island-side"></i><i class="opening-grass island-top"></i><i class="opening-wood distant-tree"></i></div>
   <div class="opening-little-home">
    <i class="opening-earth home-side"></i><i class="opening-grass home-top"></i>
    <div class="opening-tree"><i class="opening-wood trunk"></i><i class="crown"></i></div>
    <div class="opening-wood opening-cottage"><i class="roof"></i><i class="door"></i><i class="window"></i></div>
    <i class="opening-wood opening-porch"></i><i class="opening-garden"></i><i class="opening-play-rock opening-earth"></i>
    <i class="opening-water-miss"></i><i class="opening-offset offset-basket"></i><i class="opening-offset offset-water"></i><i class="opening-offset offset-play"></i>
   </div>
   <span class="opening-basket opening-wood"><i></i></span><span class="opening-water-cart opening-wood"><i></i></span>
   <div class="opening-cast">
    ${character('Pippa','opening-person opening-pippa')}${character('Bramble','opening-person opening-bramble')}${character('Rowan','opening-person opening-rowan')}${character('Pip','opening-person opening-pip')}${character('Tansy','opening-person opening-tansy')}
   </div>
   <div class="opening-measure"><i></i><i></i><i></i></div>
   <div class="opening-call-box opening-wood"><i class="opening-call-compass"></i></div>
   <div class="opening-player-compass opening-wood"><i></i></div>
   <div class="opening-local-crew"><div class="opening-crew-platform"><i class="opening-earth crew-side"></i><i class="opening-grass crew-top"></i><span class="opening-helper helper-one"></span><span class="opening-helper helper-two"></span><span class="opening-route-marker opening-wood"></span></div></div>
  </div>
  ${boardHtml(suitSvg)}
 </div>`;
}
function point(path,t){const p=path.getPointAtLength(path.getTotalLength()*t);return {left:(p.x/10)+'%',top:(p.y/6)+'%'}}
function place(root,selector,pathId,t){const el=root.querySelector(selector),path=root.querySelector(pathId);if(!el||!path)return;Object.assign(el.style,point(path,t))}
function travel(root,selector,pathId,duration){const el=root.querySelector(selector),path=root.querySelector(pathId);if(!el||!path)return;el.getAnimations().forEach(a=>a.cancel());const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.motion==='reduced';if(reduced){place(root,selector,pathId,1);return}const frames=[];for(let i=0;i<=16;i++)frames.push(point(path,i/16));el.animate(frames,{duration,easing:'ease-in-out',fill:'forwards'})}
function sync(stage,step,helpers){
 let root=stage.querySelector('.cin-opening-continuous');if(!root){stage.innerHTML=create(helpers);root=stage.querySelector('.cin-opening-continuous')}
 const previous=Number(root.dataset.step||0);root.dataset.step=String(step);
 if(step===4&&previous!==4)travel(root,'.opening-basket','#opening-route-basket',1500);else if(step>=5)place(root,'.opening-basket','#opening-route-basket',1);else place(root,'.opening-basket','#opening-route-basket',0);
 if(step===6&&previous!==6)travel(root,'.opening-water-cart','#opening-route-water',1100);else if(step>=6)place(root,'.opening-water-cart','#opening-route-water',1);else place(root,'.opening-water-cart','#opening-route-water',0);
 if(step===7&&previous!==7)travel(root,'.opening-pip','#opening-route-play',900);
 return root;
}
function buttonLabel(step){if(step===13)return'Send the Call';if(step===15)return'Answer';if(step===21)return'Help Little Home';return'Continue'}
window.LatchlingsOpeningScene={create,sync,buttonLabel};
})();

