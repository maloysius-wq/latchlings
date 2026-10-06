'use strict';
const {replay}=require('./review.cjs'),{cooperation}=require('./candidates.cjs');
const {solve}=require('./solve.cjs');
const anchorHelperProof=(level,simulateState)=>solve(level,simulateState,{maxStates:800000,maxMs:30000,maxDepth:level.solution.length,forbidMeaningfulHelperStops:true});
function anchorDependencies(level,simulateState){
 const travel=replay(level,simulateState),deps=cooperation(level,simulateState),connections=[];
 const effect=move=>move?JSON.stringify([move.r,move.c,move.path,move.capture,move.mask]):'blocked';
 const meaningful=travel.steps.filter(s=>{
  if(s.result.reason!=='anchor')return false;
  const without={...level,anchors:level.anchors.filter(a=>a[0]!==s.result.r||a[1]!==s.result.c)};
  return effect(s.result)!==effect(simulateState(without,s.state.positions,s.state.doorMask,...s.move));
 });
 const prefixes=new Set(meaningful.map(s=>s.prefix)),stops=meaningful.map(s=>({prefix:s.prefix,pi:s.move[0],at:[s.result.r,s.result.c]}));
 for(const stop of deps.stops)for(const [type,pi] of [['parked-helper',stop.helper],['anchor-launch',stop.traveler]]){
  const preceding=travel.steps.filter(s=>s.prefix<stop.prefix&&s.move[0]===pi).at(-1);
  if(preceding&&prefixes.has(preceding.prefix))connections.push({type,prefix:stop.prefix,anchorPrefix:preceding.prefix,pi,state:stop.state,move:stop.move,helper:stop.helper,traveler:stop.traveler});
 }
 return{stops,connections,cooperation:deps,idea:deps.motif+'|'+connections.map(w=>w.type).join('/')};
}
function anchorFailures(level,simulateState,capstoneIdeas=new Set()){
 const local=(level.id-1)%50+1,evidence=anchorDependencies(level,simulateState),deps=evidence.cooperation,errors=[];
 if(!deps.solved)errors.push('Authored anchor route incomplete');
 if(!evidence.stops.length)errors.push('Anchor focus lacks a real intended stop');
 if(local>=16){
  if(!evidence.connections.length)errors.push('Missing anchor/helper causal connection');
  if(deps.participants!==level.pieces.length)errors.push('Disconnected independent anchor errand');
 }
 if(local>=31&&(deps.stops.length<2||deps.relocations<1||deps.beforeFirstCapture<2))errors.push('Incomplete anchor planning/capture-order chain');
 if(local>=46){
  if(deps.stops.length<3||deps.travelers<2)errors.push('Incomplete anchor capstone cooperation');
  if(capstoneIdeas.has(evidence.idea))errors.push('Repeated anchor capstone dependency idea');
 }
 if(local>=16&&!errors.length){
  const restricted=anchorHelperProof(level,simulateState);
  if(restricted.status==='unproven')errors.push('Combined anchor helper bypass proof unproven');
  else if(restricted.status==='solved')errors.push('Combined anchor puzzle has a perfect helper bypass');
 }
 return errors;
}
module.exports={anchorDependencies,anchorFailures,anchorHelperProof};
