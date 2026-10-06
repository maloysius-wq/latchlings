'use strict';
async function waitForOpeningFramePaint(page){
 await page.waitForFunction(()=>{
  const root=document.querySelector('.cin-opening-continuous'),frame=root?.querySelector('.opening-home-reference'),doc=frame?.contentDocument,scene=doc?.querySelector('#c2 .scene');
  if(root?.dataset.geometryReady!=='true'||doc?.readyState!=='complete'||!scene||!frame.clientWidth||!frame.clientHeight)return false;
  if(Math.abs(frame.contentWindow.innerWidth-frame.clientWidth)>1||Math.abs(frame.contentWindow.innerHeight-frame.clientHeight)>1)return false;
  const fit=Math.min(.76,Math.max(.1,(frame.clientWidth-12)/350),Math.max(.1,(frame.clientHeight-12)/350)),r=scene.getBoundingClientRect();
  // Check the applied fit, not whether landmarks happen to pass their assertions.
  // Settled clipping remains a failure in the calling framing/endpoint tests.
  return Math.abs(r.width-350*fit)<.75&&Math.abs(r.height-350*fit)<.75;
 });
}
module.exports={waitForOpeningFramePaint};
