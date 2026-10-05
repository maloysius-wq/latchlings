'use strict';
// Offline suggestions from witnessed geometry, not acceptance or a runtime generator.
const {replay}=require('./review.cjs'),{cooperation}=require('./candidates.cjs'),{anchorDependencies}=require('./anchor-review.cjs');
const vectors={U:[-1,0],D:[1,0],L:[0,-1],R:[0,1]},same=(a,b)=>a[0]===b[0]&&a[1]===b[1];
function guidePermissions(base,simulateState,field){
 const travel=replay(base,simulateState);if(!travel.solved)return[];
 const suggestions=[],property=field==='suitGates'?'suit':'color';
 for(const stop of cooperation(base,simulateState).stops){
  const parked=travel.steps.filter(s=>s.prefix<stop.prefix&&s.move[0]===stop.helper).at(-1);
  if(parked?.result.reason!=='rock')continue;
  const anchor=[parked.result.r,parked.result.c],v=vectors[parked.move[1]],oldStop=[anchor[0]+v[0],anchor[1]+v[1]];
  const occupied=[...base.pieces.map(p=>p.pos),...base.nests,...['anchors','suitGates','colorGates','rails','turners','switches','doors'].flatMap(field=>base[field])];
  if(occupied.some(p=>same(p,anchor)))continue;
  for(const step of travel.steps.filter(s=>s.result.reason==='rock')){
   const d=vectors[step.move[1]],gate=[step.result.r+d[0],step.result.c+d[1]];
   if(same(gate,oldStop))continue;
   const permitted=[...new Set(base.pieces.map(p=>p[property]))].filter(value=>value!==base.pieces[step.move[0]][property]);
   for(const value of permitted){
    const proposal=JSON.parse(JSON.stringify(base));proposal.rocks=proposal.rocks.filter(p=>!same(p,oldStop)&&!same(p,gate));proposal.anchors.push(anchor);proposal[field].push([...gate,value]);
    if(replay(proposal,simulateState).solved&&anchorDependencies(proposal,simulateState).connections.length)suggestions.push(proposal);
   }
  }
 }
 return suggestions;
}
module.exports={guidePermissions};
