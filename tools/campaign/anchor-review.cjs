'use strict';
const {replay}=require('./review.cjs'),{cooperation}=require('./candidates.cjs');
function anchorDependencies(level,simulateState){
 const travel=replay(level,simulateState),deps=cooperation(level,simulateState),connections=[];
 const stops=travel.steps.filter(s=>s.result.reason==='anchor').map(s=>({prefix:s.prefix,pi:s.move[0],at:[s.result.r,s.result.c]}));
 for(const stop of deps.stops)for(const [type,pi] of [['parked-helper',stop.helper],['anchor-launch',stop.traveler]]){
  const preceding=travel.steps.filter(s=>s.prefix<stop.prefix&&s.move[0]===pi).at(-1);
  if(preceding?.result.reason==='anchor')connections.push({type,prefix:stop.prefix,anchorPrefix:preceding.prefix,pi,state:stop.state,move:stop.move,helper:stop.helper,traveler:stop.traveler});
 }
 return{stops,connections,cooperation:deps,idea:deps.motif+'|'+connections.map(w=>w.type).join('/')};
}
function anchorFailures(level,simulateState,capstoneIdeas=new Set()){
 const local=(level.id-1)%50+1,evidence=anchorDependencies(level,simulateState),deps=evidence.cooperation,errors=[];
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
 return errors;
}
module.exports={anchorDependencies,anchorFailures};
