'use strict';
(function(){
const API=window.LatchlingsCinematics;if(!API)return;
const ROUTE_PAIRS=[['i1','i2'],['i2','i3'],['i1','i4'],['i4','i5']];
let raf=0,lastBeatKey='',cargoEpoch=performance.now();
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function enhanceTrees(root=document){
 root.querySelectorAll('.cin-island-prop.prop-tree').forEach(tree=>{
  if(tree.dataset.detailedTree==='true')return;
  tree.dataset.detailedTree='true';
  tree.innerHTML='<span class="cin-tree-trunk"><i class="branch b1"></i><i class="branch b2"></i></span><span class="cin-tree-crown c1"></span><span class="cin-tree-crown c2"></span><span class="cin-tree-crown c3"></span>';
 });
}
function islandAnchor(rect,toward,containerRect){
 const cx=rect.left-containerRect.left+rect.width*.5,cy=rect.top-containerRect.top+rect.height*.36;
 const tx=toward.x-cx,ty=toward.y-cy,len=Math.hypot(tx,ty)||1,ux=tx/len,uy=ty/len,rx=Math.max(8,rect.width*.38),ry=Math.max(6,rect.height*.18);
 const d=1/Math.sqrt((ux*ux)/(rx*rx)+(uy*uy)/(ry*ry));
 return {x:cx+ux*d,y:cy+uy*d};
}
function layoutIslandRoutes(islands,stageRect){
 const box=islands.getBoundingClientRect(),centers={};
 for(const cls of ['i1','i2','i3','i4','i5']){const el=islands.querySelector(`:scope > .cin-island.${cls}`);if(!el)continue;const r=el.getBoundingClientRect();centers[cls]={x:r.left-box.left+r.width*.5,y:r.top-box.top+r.height*.36,rect:r}}
 const stageOffset={x:box.left-stageRect.left,y:box.top-stageRect.top},geoms=[];
 ROUTE_PAIRS.forEach(([a,b],idx)=>{
  const from=centers[a],to=centers[b],route=islands.querySelector(`:scope > .cin-route.r${idx+1}`);if(!from||!to||!route)return;
  const start=islandAnchor(from.rect,to,box),endRev=islandAnchor(to.rect,from,box),end=endRev;
  const dx=end.x-start.x,dy=end.y-start.y,width=Math.max(1,Math.hypot(dx,dy)),angle=Math.atan2(dy,dx)*180/Math.PI;
  route.style.setProperty('left',`${start.x}px`,'important');route.style.setProperty('top',`${start.y}px`,'important');route.style.setProperty('width',`${width}px`,'important');route.style.setProperty('rotate',`${angle}deg`,'important');route.style.setProperty('transform-origin','0 50%','important');
  geoms[idx]={x1:start.x+stageOffset.x,y1:start.y+stageOffset.y,x2:end.x+stageOffset.x,y2:end.y+stageOffset.y,width,angle};
 });
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
}
function normalizeDialogue(stage){
 const layers=[...stage.querySelectorAll(':scope > .cin-dialogue-layer')];
 layers.forEach(layer=>{
  const bubbles=[...layer.querySelectorAll('.cin-speech-bubble')];if(!bubbles.length)return;
  bubbles.forEach(b=>{b.style.removeProperty('height')});
  let target=Math.max(...bubbles.map(b=>Math.ceil(b.scrollHeight)));
  const compact=stage.getBoundingClientRect().height<280;target=clamp(target,compact?46:50,compact?70:82);layer.style.setProperty('--cin-bubble-height',`${target}px`);
  bubbles.forEach(b=>{
   const speaker=b.closest('[data-speaker]'),portrait=speaker?.querySelector('.dialogue-portrait'),br=b.getBoundingClientRect(),pr=portrait?.getBoundingClientRect();if(!pr||!br.width)return;
   const px=pr.left+pr.width/2,tail=clamp((px-br.left)/br.width*100,12,88);b.style.setProperty('--cin-tail-x',`${tail.toFixed(2)}%`);
  });
 });
}
function tick(time){
 raf=0;const overlay=document.getElementById('cinematicOverlay'),stage=document.getElementById('cinematicStage');if(!overlay||!stage||!overlay.classList.contains('show')||!API.active)return;
 const beat=API.beat+1,key=`${API.active}:${beat}`;overlay.dataset.beat=String(beat);if(key!==lastBeatKey){lastBeatKey=key;cargoEpoch=time;requestAnimationFrame(()=>normalizeDialogue(stage))}
 enhanceTrees(stage);
 const stageRect=stage.getBoundingClientRect();let brightGeom=null;
 stage.querySelectorAll('.cin-islands').forEach(islands=>{const g=layoutIslandRoutes(islands,stageRect);if(islands.classList.contains('bright'))brightGeom=g});
 if(brightGeom)layoutCargo(stage,brightGeom,time);
 normalizeDialogue(stage);
 raf=requestAnimationFrame(tick);
}
function start(){if(!raf)raf=requestAnimationFrame(tick)}
function observe(){const overlay=document.getElementById('cinematicOverlay');if(!overlay){requestAnimationFrame(observe);return}new MutationObserver(start).observe(overlay,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-cinematic','data-visual']});start()}
observe();
window.LatchlingsCinematicGeometry={enhanceTrees,layoutIslandRoutes,normalizeDialogue,start,ROUTE_PAIRS};
})();