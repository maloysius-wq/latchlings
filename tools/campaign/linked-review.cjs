'use strict';
const {replay}=require('./review.cjs');
const {meaningfulHelperStop}=require('./helper-stop.cjs');
const {cooperation}=require('./candidates.cjs');
const {anchorDependencies}=require('./anchor-review.cjs');
const {solve}=require('./solve.cjs');
const same=(a,b)=>a[0]===b[0]&&a[1]===b[1];
const physical=m=>m?JSON.stringify([m.r,m.c,m.path,m.capture]):'blocked';
function linkedDependencies(level,simulateState){
 const travel=replay(level,simulateState),toggles=[],openPasses=[],closedStops=[],connections=[];
 for(const step of travel.steps){
  let mask=step.state.doorMask;
  step.result.path.forEach((at,index)=>{const sw=level.switches.find(s=>same(s,at));if(sw){mask^=1<<sw[2];toggles.push({prefix:step.prefix,pathIndex:index,pi:step.move[0],at,link:sw[2],open:!!(mask&(1<<sw[2]))});}});
  for(let pi=0;pi<step.state.positions.length;pi++)if(step.state.positions[pi])for(const dir of ['U','D','L','R']){
   const actual=simulateState(level,step.state.positions,step.state.doorMask,pi,dir),intended=pi===step.move[0]&&dir===step.move[1];
   for(const door of level.doors){
    const opposite=simulateState(level,step.state.positions,step.state.doorMask^(1<<door[2]),pi,dir);
    if(physical(actual)===physical(opposite))continue;
    const index=actual?.path.findIndex(at=>same(at,door))??-1;
    if(index>=0&&!opposite?.path.some(at=>same(at,door))){
     let entryMask=step.state.doorMask;
     for(const at of actual.path.slice(0,index)){const sw=level.switches.find(s=>same(s,at));if(sw)entryMask^=1<<sw[2];}
     if(entryMask&(1<<door[2]))openPasses.push({prefix:step.prefix,pi,dir,intended,at:door.slice(0,2),link:door[2],pathIndex:index,state:step.state});
    }
    const next=opposite?.path[actual?.path.length||0];
    if(index<0&&next&&same(next,door)&&(!actual||actual.reason==='door'))closedStops.push({prefix:step.prefix,pi,dir,intended,at:door.slice(0,2),link:door[2],pathIndex:actual?.path.length||0,state:step.state,stop:actual?[actual.r,actual.c]:null});
   }
  }
 }
 for(const w of [...openPasses,...closedStops].filter(w=>w.intended)){
  const toggle=toggles.filter(t=>t.link===w.link&&(t.prefix<w.prefix||(t.prefix===w.prefix&&t.pathIndex<w.pathIndex))).at(-1);
  if(openPasses.includes(w)&&toggle?.open)connections.push({type:'opened-passage',prefix:w.prefix,togglePrefix:toggle.prefix,pi:w.pi,link:w.link});
  if(closedStops.includes(w)&&!toggle?.open&&w.stop){
   const launch=travel.steps.find(s=>s.prefix>w.prefix&&s.move[0]===w.pi);
   if(launch&&(launch.result.capture||meaningfulHelperStop(level,launch.state.positions,launch.state.doorMask,...launch.move,launch.result,simulateState))){
    if(toggle)connections.push({type:'closed-launch',prefix:w.prefix,togglePrefix:toggle.prefix,launchPrefix:launch.prefix,pi:w.pi,link:w.link});
    const opening=toggles.find(t=>t.link===w.link&&t.open&&t.prefix>launch.prefix);
    const passage=opening&&openPasses.find(p=>p.intended&&p.link===w.link&&(p.prefix>opening.prefix||(p.prefix===opening.prefix&&p.pathIndex>opening.pathIndex)));
    if(passage)connections.push({type:'delayed-opening',prefix:w.prefix,launchPrefix:launch.prefix,togglePrefix:opening.prefix,passagePrefix:passage.prefix,pi:w.pi,link:w.link});
   }
  }
 }
 const coop=cooperation(level,simulateState),anchors=anchorDependencies(level,simulateState),earlierConnections=[];
 for(const w of [...openPasses,...closedStops].filter(w=>w.intended)){
  const previous=travel.steps.filter(s=>s.prefix<w.prefix&&s.move[0]===w.pi).at(-1);
  if(coop.stops.some(s=>s.prefix===w.prefix))earlierConnections.push({type:'door-helper-trajectory',prefix:w.prefix,pi:w.pi});
  if(previous&&anchors.stops.some(s=>s.prefix===previous.prefix))earlierConnections.push({type:'anchor-door-launch',prefix:w.prefix,anchorPrefix:previous.prefix,pi:w.pi});
  for(const s of coop.stops){const placed=travel.steps.filter(p=>p.prefix<s.prefix&&p.move[0]===s.helper).at(-1);if(placed?.prefix===w.prefix)earlierConnections.push({type:'door-placed-helper',prefix:s.prefix,doorPrefix:w.prefix,pi:w.pi});}
  for(const field of ['suitGates','colorGates','rails','turners'])if(level[field].length&&physical(simulateState(level,w.state.positions,w.state.doorMask,w.pi,w.dir))!==physical(simulateState({...level,[field]:[]},w.state.positions,w.state.doorMask,w.pi,w.dir)))earlierConnections.push({type:'door-routing-trajectory',prefix:w.prefix,pi:w.pi,field});
 }
 const linksUsed=[...new Set(connections.map(w=>w.link))];
 const idea=coop.motif+'|'+[...new Set(connections.map(w=>w.type))].sort().join('/')+'|'+[...new Set(earlierConnections.map(w=>w.type))].sort().join('/')+'|'+linksUsed.length;
 return {solved:travel.solved,toggles,openPasses,closedStops,connections,earlierConnections,cooperation:coop,linksUsed,idea};
}
function linkedFailures(level,simulateState,capstoneIdeas=new Set()){
 const local=(level.id-1)%50+1,d=linkedDependencies(level,simulateState),errors=[];
 if(!d.solved)errors.push('Authored linked-state route incomplete');
 if(!d.openPasses.some(w=>w.intended)||!d.closedStops.length||!d.connections.some(w=>w.type==='opened-passage'))errors.push('Missing actual linked opening passage and closed-state evidence');
 for(const link of new Set(level.switches.map(s=>s[2])))if(!d.linksUsed.includes(link))errors.push('Unused linked-state pair '+link);
 if(local>=16&&!d.earlierConnections.length&&!d.connections.some(w=>['closed-launch','delayed-opening'].includes(w.type)))errors.push('Missing state/earlier-skill causal connection');
 if(local>=31&&(d.cooperation.participants!==level.pieces.length||d.cooperation.beforeFirstCapture<2))errors.push('Incomplete connected state planning chain');
 if(local>=46){if(d.cooperation.stops.length<3||d.cooperation.travelers<2)errors.push('Incomplete state capstone cooperation');if(capstoneIdeas.has(d.idea))errors.push('Repeated linked-state capstone idea');}
 if(local>=31&&!errors.length){const p=solve(level,simulateState,{maxStates:800000,maxMs:30000,maxDepth:level.solution.length,forbidMeaningfulHelperStops:true});if(p.status==='unproven')errors.push('State helper bypass proof unproven');else if(p.status==='solved')errors.push('State planning has a perfect helper bypass');}
 return errors;
}
function linkedCurriculumFailures(levels,simulateState){
 const types=new Set(levels.filter(l=>(l.id-1)%50>=30).flatMap(l=>linkedDependencies(l,simulateState).connections.map(w=>w.type))),errors=[];
 if(!types.has('closed-launch'))errors.push('Later state curriculum lacks an earned closing launch');
 if(!types.has('delayed-opening'))errors.push('Later state curriculum lacks a useful postponed opening');
 return errors;
}
module.exports={linkedDependencies,linkedFailures,linkedCurriculumFailures};
