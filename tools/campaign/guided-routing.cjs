'use strict';
// Suggestions retain real replay evidence, never certify optimum or teaching quality.
const {replay}=require('./review.cjs');
const {routingDependencies}=require('./routing-review.cjs');
const same=(a,b)=>a[0]===b[0]&&a[1]===b[1],directions=['U','R','D','L'],vectors={U:[-1,0],D:[1,0],L:[0,-1],R:[0,1]};
const direction=(a,b)=>b[0]<a[0]?'U':b[0]>a[0]?'D':b[1]<a[1]?'L':'R';
const occupied=level=>[...level.pieces.map(p=>p.pos),...level.nests,...['rocks','anchors','suitGates','colorGates','rails','turners','switches','doors'].flatMap(f=>level[f])];
function guideTurns(base,simulateState){
 const travel=replay(base,simulateState);if(!travel.solved||base.turners.length)return[];
 const suggestions=[],used=new Set();
 for(let index=0;index+1<travel.steps.length;index++){
  const a=travel.steps[index],b=travel.steps[index+1];if(a.move[0]!==b.move[0]||a.result.capture)continue;
  const at=[a.result.r,a.result.c];if(occupied(base).some(p=>same(p,at)))continue;
  const turn=(directions.indexOf(b.move[1])-directions.indexOf(a.move[1])+4)%4;if(![1,3].includes(turn))continue;
  const key=at.join(',')+turn;if(used.has(key))continue;used.add(key);
  const level=structuredClone(base);level.turners.push([...at,turn===1?'CW':'CCW']);level.solution.splice(index+1,1);
  if(replay(level,simulateState).solved&&routingDependencies(level,simulateState).bends.some(w=>w.prefix===index))suggestions.push(level);
 }
 return suggestions;
}
function guideMatchingRails(base,simulateState){
 const travel=replay(base,simulateState);if(!travel.solved)return[];
 const suggestions=[],used=new Set(),taken=occupied(base);
 for(const step of travel.steps)step.result.path.forEach((at,index)=>{
  if(taken.some(p=>same(p,at)))return;
  const entry=direction(index?step.result.path[index-1]:step.state.positions[step.move[0]],at),key=at.join(',')+entry;if(used.has(key))return;used.add(key);
  const level=structuredClone(base);level.rails.push([...at,entry]);if(replay(level,simulateState).solved)suggestions.push(level);
 });
 return suggestions;
}
function guideRailBlockers(base,simulateState){
 const travel=replay(base,simulateState);if(!travel.solved)return[];
 const suggestions=[],used=new Set();
 for(const step of travel.steps){
  if(step.result.reason!=='rock')continue;
  const points=[step.state.positions[step.move[0]],...step.result.path],last=points.at(-1);let final=direction(points.at(-2),last);
  const turn=base.turners.find(t=>same(t,last));if(turn)final=directions[(directions.indexOf(final)+(turn[2]==='CW'?1:3))%4];
  const v=vectors[final],at=[last[0]+v[0],last[1]+v[1]];
  for(const entry of directions.filter(d=>d!==final)){
   const key=at.join(',')+entry;if(used.has(key))continue;used.add(key);
   const level=structuredClone(base);level.rocks=level.rocks.filter(p=>!same(p,at));level.rails.push([...at,entry]);if(replay(level,simulateState).solved)suggestions.push(level);
  }
 }
 return suggestions;
}
module.exports={guideTurns,guideMatchingRails,guideRailBlockers};
