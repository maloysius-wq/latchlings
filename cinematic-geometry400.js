'use strict';
(function(){
const API=window.LatchlingsCinematics;if(!API)return;
const ROUTE_PAIRS=[['i1','i2'],['i2','i3'],['i1','i4'],['i4','i5']];
let raf=0,lastBeatKey='',cargoEpoch=performance.now(),lastDialoguePass=0;
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
  layer.style.removeProperty('--cin-bubble-height');
  let target=Math.max(...bubbles.map(b=>Math.ceil(b.scrollHeight)));const compact=stage.getBoundingClientRect().height<280;target=clamp(target,compact?46:50,compact?70:82);layer.style.setProperty('--cin-bubble-height',`${target}px`);
  requestAnimationFrame(()=>bubbles.forEach(b=>{
   const speaker=b.closest('[data-speaker]'),portrait=speaker?.querySelector('.dialogue-portrait'),br=b.getBoundingClientRect(),pr=portrait?.getBoundingClientRect();if(!pr||!br.width)return;const px=pr.left+pr.width/2,tail=clamp((px-br.left)/br.width*100,12,88);b.style.setProperty('--cin-tail-x',`${tail.toFixed(2)}%`);
  }));
 });
}
function tick(time){
 raf=0;const overlay=document.getElementById('cinematicOverlay'),stage=document.getElementById('cinematicStage');if(!overlay||!stage||!overlay.classList.contains('show')||!API.active)return;
 const beat=API.beat+1,key=`${API.active}:${beat}`;overlay.dataset.beat=String(beat);if(key!==lastBeatKey){lastBeatKey=key;cargoEpoch=time;normalizeDialogue(stage);lastDialoguePass=time}
 enhanceTrees(stage);
 const stageRect=stage.getBoundingClientRect();let brightGeom=null;
 stage.querySelectorAll('.cin-islands').forEach(islands=>{const g=layoutIslandRoutes(islands,stageRect);if(islands.classList.contains('bright'))brightGeom=g});
 if(brightGeom)layoutCargo(stage,brightGeom,(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)?cargoEpoch+2200:time);
 if(time-lastDialoguePass>500){normalizeDialogue(stage);lastDialoguePass=time}
 raf=requestAnimationFrame(tick);
}
function start(){if(!raf)raf=requestAnimationFrame(tick)}
function observe(){const overlay=document.getElementById('cinematicOverlay');if(!overlay){requestAnimationFrame(observe);return}new MutationObserver(start).observe(overlay,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-cinematic','data-visual']});start()}
observe();
window.LatchlingsCinematicGeometry={enhanceTrees,layoutIslandRoutes,normalizeDialogue,start,ROUTE_PAIRS};
})();