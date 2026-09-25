/* Shared screen-landmark to SVG-path geometry for cinematic scenes. */
(function(){
 'use strict';

 function svgPoint(svg,element,inverse){
  if(!svg||!element||!svg.isConnected||!element.isConnected)return null;
  const rect=element.getBoundingClientRect(),svgRect=svg.getBoundingClientRect();
  if(rect.width<=0||rect.height<=0||svgRect.width<=0||svgRect.height<=0)return null;
  const screenX=rect.left+rect.width/2,screenY=rect.top+rect.height/2;
  let point;
  if(typeof window.DOMPoint==='function')point=new DOMPoint(screenX,screenY).matrixTransform(inverse);
  else{point=svg.createSVGPoint();point.x=screenX;point.y=screenY;point=point.matrixTransform(inverse)}
  return Number.isFinite(point.x)&&Number.isFinite(point.y)?point:null;
 }

 function syncPath(svg,path,fromElement,toElement){
  if(!svg||!path||typeof path.getTotalLength!=='function')return false;
  const svgRect=svg.getBoundingClientRect(),viewBox=svg.viewBox&&svg.viewBox.baseVal,matrix=svg.getScreenCTM();
  if(svgRect.width<=0||svgRect.height<=0||!viewBox||viewBox.width<=0||viewBox.height<=0||!matrix)return false;
  let inverse;try{inverse=matrix.inverse()}catch(_){return false}
  const from=svgPoint(svg,fromElement,inverse),to=svgPoint(svg,toElement,inverse);
  if(!from||!to)return false;
  const dx=to.x-from.x,dy=to.y-from.y,customBend=Number(path.dataset?.bend),bend=Number.isFinite(customBend)&&customBend!==0?customBend:Math.min(34,Math.max(14,Math.abs(dx)*.13));
  const c1x=from.x+dx*.34,c1y=from.y+dy*.12+bend;
  const c2x=from.x+dx*.72,c2y=to.y+bend;
  const n=value=>Number(value.toFixed(2));
  const d=`M ${n(from.x)} ${n(from.y)} C ${n(c1x)} ${n(c1y)}, ${n(c2x)} ${n(c2y)}, ${n(to.x)} ${n(to.y)}`;
  try{
   if(path.getAttribute('d')!==d)path.setAttribute('d',d);
   return path.getTotalLength()>0;
  }catch(_){path.removeAttribute('d');return false}
 }

 window.LatchlingsSceneGeometry={syncPath};
})();
