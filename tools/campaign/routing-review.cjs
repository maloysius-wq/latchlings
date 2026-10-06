'use strict';
// Offline evidence only. Entry direction follows actual traveled segments after turns.
const {replay}=require('./review.cjs'),{cooperation}=require('./candidates.cjs'),{anchorDependencies}=require('./anchor-review.cjs'),{solve}=require('./solve.cjs');
const effect=m=>m?JSON.stringify([m.r,m.c,m.path,m.capture,m.mask]):'blocked';
const direction=(a,b)=>b[0]<a[0]?'U':b[0]>a[0]?'D':b[1]<a[1]?'L':'R';
function routingDependencies(level,simulateState){
 const travel=replay(level,simulateState),coop=cooperation(level,simulateState),anchors=anchorDependencies(level,simulateState),railPassed=[],railBlocked=[],bends=[],connections=[];
 for(const step of travel.steps){
  for(let pi=0;pi<step.state.positions.length;pi++)if(step.state.positions[pi])for(const dir of ['U','D','L','R']){
   const actual=simulateState(level,step.state.positions,step.state.doorMask,pi,dir),intended=pi===step.move[0]&&dir===step.move[1],base={prefix:step.prefix,pi,dir,intended,state:step.state};
   for(const gate of level.rails){
    const index=actual?.path.findIndex(p=>p[0]===gate[0]&&p[1]===gate[1])??-1;
    if(index>=0){const from=index?actual.path[index-1]:step.state.positions[pi],entry=direction(from,actual.path[index]);if(entry===gate[2])railPassed.push({...base,at:gate.slice(0,2),entry});}
    const removed=simulateState({...level,rails:level.rails.filter(g=>g!==gate)},step.state.positions,step.state.doorMask,pi,dir);
    if(effect(actual)!==effect(removed)&&index<0)railBlocked.push({...base,at:gate.slice(0,2)});
   }
   if(intended&&actual){
    const points=[step.state.positions[pi],...actual.path];
    for(let i=1;i+1<points.length;i++){
     const at=points[i],turn=level.turners.find(t=>t[0]===at[0]&&t[1]===at[1]);
     if(!turn||direction(points[i-1],at)===direction(at,points[i+1]))continue;
     const removed=simulateState({...level,turners:level.turners.filter(t=>t!==turn)},step.state.positions,step.state.doorMask,pi,dir);
     if(effect(actual)!==effect(removed))bends.push({...base,at:at.slice(),entry:direction(points[i-1],at),exit:direction(at,points[i+1])});
    }
   }
  }
 }
 const intended=[...railPassed,...railBlocked,...bends].filter(w=>w.intended);
 for(const w of intended){
  const current=travel.steps[w.prefix],previous=travel.steps.filter(s=>s.prefix<w.prefix&&s.move[0]===w.pi).at(-1);
  if(coop.stops.some(s=>s.prefix===w.prefix))connections.push({type:'routing-helper-trajectory',prefix:w.prefix,pi:w.pi});
  if(previous&&anchors.stops.some(s=>s.prefix===previous.prefix))connections.push({type:'anchor-routing-launch',prefix:w.prefix,pi:w.pi,anchorPrefix:previous.prefix});
  if(previous&&['suitGates','colorGates'].some(field=>effect(previous.result)!==effect(simulateState({...level,[field]:[]},previous.state.positions,previous.state.doorMask,...previous.move))))connections.push({type:'permission-routing-launch',prefix:w.prefix,pi:w.pi,permissionPrefix:previous.prefix});
  for(const stop of coop.stops){
   const helperMove=travel.steps.filter(s=>s.prefix<stop.prefix&&s.move[0]===stop.helper).at(-1);
   const travelerMove=travel.steps.filter(s=>s.prefix<stop.prefix&&s.move[0]===stop.traveler).at(-1);
   if(helperMove?.prefix===w.prefix)connections.push({type:'routing-placed-helper',prefix:stop.prefix,routingPrefix:w.prefix,pi:w.pi,traveler:stop.traveler});
   if(travelerMove?.prefix===w.prefix&&railBlocked.includes(w))connections.push({type:'routing-helper-launch',prefix:stop.prefix,routingPrefix:w.prefix,pi:w.pi,helper:stop.helper});
  }
 }
 return{solved:travel.solved,railPassed,railBlocked,bends,connections,cooperation:coop,loopingMoves:travel.steps.filter(s=>s.result.path.length>=level.size*level.size*4&&s.result.reason==='edge').map(s=>s.prefix),idea:coop.motif+'|'+[...new Set(connections.map(w=>w.type))].sort().join('/')+'|'+bends.map(w=>w.entry===w.exit?'straight':'bend').join('/')};
}
function routingFailures(level,simulateState,capstoneIdeas=new Set()){
 const local=(level.id-1)%50+1,d=routingDependencies(level,simulateState),errors=[];
 if(!d.solved)errors.push('Authored routing route incomplete');
 if(d.loopingMoves.length)errors.push('Routing travel hits engine loop guard');
 if(local<=5&&level.turners.length)errors.push('Turners introduced before rail practice');
 if((local<=5||local>=9)&&(!d.railPassed.length||!d.railBlocked.length||![...d.railPassed,...d.railBlocked].some(w=>w.intended)))errors.push('Missing relevant permitted/blocked rail entry');
 if(local>=6&&!d.bends.length)errors.push('Missing intended visible turner bend');
 if(local>=16&&!d.connections.length)errors.push('Missing routing/earlier-skill causal connection');
 if(local>=31&&(d.cooperation.participants!==level.pieces.length||d.cooperation.beforeFirstCapture<2||d.cooperation.relocations<1))errors.push('Incomplete connected routing planning chain');
 if(local>=46){if(d.cooperation.stops.length<3||d.cooperation.travelers<2)errors.push('Incomplete routing capstone cooperation');if(capstoneIdeas.has(d.idea))errors.push('Repeated routing capstone idea');}
 if(local>=31&&!errors.length){const proof=solve(level,simulateState,{maxStates:800000,maxMs:30000,maxDepth:level.solution.length,forbidMeaningfulHelperStops:true});if(proof.status==='unproven')errors.push('Routing helper bypass proof unproven');else if(proof.status==='solved')errors.push('Routing planning has a perfect helper bypass');}
 return errors;
}
module.exports={routingDependencies,routingFailures};
