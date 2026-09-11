'use strict';
(function(){
const API=window.LatchlingsCinematics;if(!API)return;
const ROUTE_PAIRS=[['i1','i2'],['i2','i3'],['i1','i4'],['i4','i5']];
let raf=0,lastBeatKey='',cargoEpoch=performance.now(),lastDialogueLayer=null;
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function enhanceTrees(root=document){
 root.querySelectorAll('.cin-island-prop.prop-tree').forEach(tree=>{
  if(tree.dataset.detailedTree==='true')return;
  tree.dataset.detailedTree='true';
  tree.innerHTML='<span class="cin-tree-trunk"><i class="branch b1"></i><i class="branch b2"></i></span><span class="cin-tree-crown c1"></span><span class="cin-tree-crown c2"></span><span class="cin-tree-crown c3"></span>';
 });
}
function anchorFor(rect,toward){
 const cx=rect.left+rect.width*.5,cy=rect.top+rect.height*.36,tx=toward.x-cx,ty=toward.y-cy,len=Math.hypot(tx,ty)||1,ux=tx/len,uy=ty/len,rx=Math.max(8,rect.width*.38),ry=Math.max(6,rect.height*.18),d=1/Math.sqrt((ux*ux)/(rx*rx)+(uy*uy)/(ry*ry));
 return {x:cx+ux*d,y:cy+uy*d};
}
function layoutIslandRoutes(islands,stageRect){
 const box=islands.getBoundingClientRect(),ow=islands.offsetWidth||box.width,oh=islands.offsetHeight||box.height,sx=box.width/ow||1,sy=box.height/oh||1,centers={};
 for(const cls of ['i1','i2','i3','i4','i5']){
  const el=islands.querySelector(`:scope > .cin-island.${cls}`);if(!el)continue;const r=el.getBoundingClientRect(),local={left:(r.left-box.left)/sx,top:(r.top-box.top)/sy,width:r.width/sx,height:r.height/sy};centers[cls]={x:local.left+local.width*.5,y:local.top+local.height*.36,rect:local};
 }
 const geoms=[];
 ROUTE_PAIRS.forEach(([a,b],idx)=>{
  const from=centers[a],to=centers[b],route=islands.querySelector(`:scope > .cin-route.r${idx+1}`);if(!from||!to||!route)return;
  const start=anchorFor(from.rect,to),end=anchorFor(to.rect,from),dx=end.x-start.x,dy=end.y-start.y,width=Math.max(1,Math.hypot(dx,dy)),angle=Math.atan2(dy,dx)*180/Math.PI;
  route.style.setProperty('left',`${start.x}px`,'important');route.style.setProperty('top',`${start.y}px`,'important');route.style.setProperty('width',`${width}px`,'important');route.style.setProperty('rotate',`${angle}deg`,'important');route.style.setProperty('transform-origin','0 50%','important');
  geoms[idx]={x1:box.left-stageRect.left+start.x*sx,y1:box.top-stageRect.top+start.y*sy,x2:box.left-stageRect.left+end.x*sx,y2:box.top-stageRect.top+end.y*sy,width,angle,from:a,to:b};
 });
 islands.__latchRouteGeometry=geoms;
 return geoms;
}
function layoutCargo(stage,geoms,time){
 const cargo=stage.querySelector('.cin-route-cargo');if(!cargo||!geoms?.length)return;
 const items=[...cargo.querySelectorAll('i')],offsets=[0,.34,.67];
 items.forEach((item,i)=>{
  const g=geoms[Math.min(i,geoms.length-1)];if(!g)return;
  const raw=((time-cargoEpoch)/4800+offsets[i])%1,p=.035+raw*.93,x=g.x1+(g.x2-g.x1)*p,y=g.y1+(g.y2-g.y1)*p,fade=Math.min(1,raw/.09,(1-raw)/.09);
  item.style.setProperty('left',`${x}px`,'important');item.style.setProperty('top',`${y}px`,'important');item.style.setProperty('translate','-50% -50%','important');item.style.setProperty('opacity',String(clamp(fade,0,1)),'important');item.style.setProperty('animation','none','important');
 });
 cargo.__latchRouteGeometry=geoms;
}
function normalizeDialogue(stage){
 const layers=[...stage.querySelectorAll(':scope > .cin-dialogue-layer')];
 layers.forEach(layer=>{
  const bubbles=[...layer.querySelectorAll('.cin-speech-bubble')];if(!bubbles.length)return;
  const target=Math.max(...bubbles.map(b=>{const br=b.getBoundingClientRect();return Math.max(...[...b.querySelectorAll(':scope>b,:scope>span')].map(x=>Math.ceil(x.getBoundingClientRect().bottom-br.top+6)),0)}));
  const currentHeight=parseFloat(layer.style.getPropertyValue('--cin-bubble-height'))||0;if(Math.abs(currentHeight-target)>.25)layer.style.setProperty('--cin-bubble-height',`${target}px`);
  const sr=stage.getBoundingClientRect(),pad=5;
  bubbles.forEach(b=>{const br=b.getBoundingClientRect(),current=parseFloat(getComputedStyle(b).getPropertyValue('--cin-bubble-shift'))||0,baseLeft=br.left-current,baseRight=br.right-current;let desired=0;if(baseLeft<sr.left+pad)desired+=sr.left+pad-baseLeft;if(baseRight>sr.right-pad)desired-=baseRight-(sr.right-pad);if(Math.abs(desired-current)>.25)b.style.setProperty('--cin-bubble-shift',`${desired.toFixed(2)}px`)});
  bubbles.forEach(b=>{const speaker=b.closest('[data-speaker]'),portrait=speaker?.querySelector('.dialogue-portrait'),br=b.getBoundingClientRect(),pr=portrait?.getBoundingClientRect();if(!pr||!br.width)return;const px=pr.left+pr.width/2,tail=clamp((px-br.left)/br.width*100,8,92),current=parseFloat(b.style.getPropertyValue('--cin-tail-x'))||50;if(Math.abs(current-tail)>.1)b.style.setProperty('--cin-tail-x',`${tail.toFixed(2)}%`)});
 });
}
function tick(time){
 raf=0;const overlay=document.getElementById('cinematicOverlay'),stage=document.getElementById('cinematicStage');if(!overlay||!stage||!overlay.classList.contains('show')||!API.active)return;
 const beat=API.beat+1,key=`${API.active}:${beat}`;overlay.dataset.beat=String(beat);if(key!==lastBeatKey){lastBeatKey=key;cargoEpoch=time;lastDialogueLayer=null}
 const dialogueLayer=stage.querySelector(':scope > .cin-dialogue-layer');if(dialogueLayer!==lastDialogueLayer){lastDialogueLayer=dialogueLayer;if(dialogueLayer)normalizeDialogue(stage)}
 enhanceTrees(stage);
 const stageRect=stage.getBoundingClientRect();let brightGeom=null;
 stage.querySelectorAll('.cin-islands').forEach(islands=>{const g=layoutIslandRoutes(islands,stageRect);if(islands.classList.contains('bright'))brightGeom=g});
 if(brightGeom)layoutCargo(stage,brightGeom,(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)?cargoEpoch+2200:time);
 raf=requestAnimationFrame(tick);
}
function start(){if(!raf)raf=requestAnimationFrame(tick)}
window.addEventListener('resize',()=>{const stage=document.getElementById('cinematicStage');if(stage)normalizeDialogue(stage)},{passive:true});
function observe(){const overlay=document.getElementById('cinematicOverlay');if(!overlay){requestAnimationFrame(observe);return}new MutationObserver(start).observe(overlay,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-cinematic','data-visual']});start()}
observe();
window.LatchlingsCinematicGeometry={enhanceTrees,layoutIslandRoutes,normalizeDialogue,start,ROUTE_PAIRS};
})();