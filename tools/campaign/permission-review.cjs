'use strict';
const {replay}=require('./review.cjs'),{cooperation}=require('./candidates.cjs'),{anchorDependencies}=require('./anchor-review.cjs');
const {solve}=require('./solve.cjs');
const permissionHelperProof=(level,simulateState)=>solve(level,simulateState,{maxStates:800000,maxMs:30000,maxDepth:level.solution.length,forbidHelperStops:true});
const effect=m=>m?JSON.stringify([m.r,m.c,m.path,m.capture,m.mask]):'blocked';
function permissionIdentityFailures(levels,chapter){
 const teaching=levels.filter(l=>l.chapter===chapter&&l.id>(chapter-1)*50&&l.id<=(chapter-1)*50+15);
 const contrast=(sameProperty,differentProperty)=>teaching.some(l=>l.pieces.some((p,i)=>l.pieces.some((q,j)=>i!==j&&p[sameProperty]===q[sameProperty]&&p[differentProperty]!==q[differentProperty])));
 const errors=[];
 if(!contrast('suit','color'))errors.push('Early teaching lacks shared suit / different color contrast');
 if(!contrast('color','suit'))errors.push('Early teaching lacks shared color / different suit contrast');
 return errors;
}
function permissionDependencies(level,simulateState,field){
 const property=field==='suitGates'?'suit':'color',travel=replay(level,simulateState),permitted=[],blocked=[],connections=[],deps=cooperation(level,simulateState),anchors=anchorDependencies(level,simulateState);
 for(const step of travel.steps){
  for(let pi=0;pi<step.state.positions.length;pi++)if(step.state.positions[pi])for(const dir of ['U','D','L','R']){
   const actual=simulateState(level,step.state.positions,step.state.doorMask,pi,dir),without=simulateState({...level,[field]:[]},step.state.positions,step.state.doorMask,pi,dir),intended=pi===step.move[0]&&dir===step.move[1];
   for(const gate of level[field]){
    const at=gate.slice(0,2),matches=gate[2]===level.pieces[pi][property];
    if(matches&&actual?.path.some(p=>p[0]===at[0]&&p[1]===at[1]))permitted.push({prefix:step.prefix,pi,dir,at,intended,state:step.state});
    if(!matches&&effect(actual)!==effect(without)){
     // Isolate this gate: unrelated permissions must not manufacture its witness.
     const single=simulateState({...level,[field]:level[field].filter(g=>g!==gate)},step.state.positions,step.state.doorMask,pi,dir);
     if(effect(actual)!==effect(single))blocked.push({prefix:step.prefix,pi,dir,at,intended,state:step.state,stop:actual?[actual.r,actual.c]:null});
    }
   }
  }
 }
 const intended=[...permitted,...blocked].filter(w=>w.intended);
 for(const w of intended){
  const current=travel.steps[w.prefix],previous=travel.steps.filter(s=>s.prefix<w.prefix&&s.move[0]===w.pi).at(-1);
  if(current.result.reason==='piece')connections.push({type:'permission-helper-trajectory',prefix:w.prefix,pi:w.pi});
  if(previous&&anchors.stops.some(s=>s.prefix===previous.prefix))connections.push({type:'anchor-permission-launch',prefix:w.prefix,pi:w.pi,anchorPrefix:previous.prefix});
  for(const stop of deps.stops){
   const lastTraveler=travel.steps.filter(s=>s.prefix<stop.prefix&&s.move[0]===stop.traveler).at(-1);
   if(blocked.includes(w)&&stop.traveler===w.pi&&lastTraveler?.prefix===w.prefix)connections.push({type:'permission-helper-launch',prefix:stop.prefix,permissionPrefix:w.prefix,pi:w.pi,helper:stop.helper});
   const last=travel.steps.filter(s=>s.prefix<stop.prefix&&s.move[0]===stop.helper).at(-1);
   if(last?.prefix===w.prefix)connections.push({type:'permission-placed-helper',prefix:stop.prefix,permissionPrefix:w.prefix,pi:w.pi,traveler:stop.traveler});
  }
 }
 const other=property==='suit'?'color':'suit';
 const sharedProperty=level.pieces.some((p,i)=>level.pieces.some((q,j)=>i!==j&&p[property]===q[property]&&p[other]!==q[other]));
 const idea=deps.motif+'|'+[...new Set(connections.map(w=>w.type))].sort().join('/')+'|'+(blocked.some(w=>w.intended)?'stopper':'permission')+'|'+(sharedProperty?'shared':'distinct');
 return{permitted,blocked,connections,anchorStops:anchors.stops,anchorConnections:anchors.connections,cooperation:deps,sharedProperty,idea,solved:travel.solved};
}
function permissionFailures(level,simulateState,capstoneIdeas=new Set()){
 const local=(level.id-1)%50+1,field=level.chapter===4?'suitGates':'colorGates',d=permissionDependencies(level,simulateState,field),errors=[];
 if(!d.solved)errors.push('Authored permission route incomplete');
 if(!d.permitted.length||!d.blocked.length||![...d.permitted,...d.blocked].some(w=>w.intended))errors.push('Missing solution-relevant permitted/blocked identity evidence');
 if(local>=16&&!d.connections.length)errors.push('Missing permission/earlier-skill causal connection');
 if(local>=31&&(d.cooperation.participants!==level.pieces.length||d.cooperation.beforeFirstCapture<2))errors.push('Incomplete connected permission planning chain');
 if(local>=31&&(!d.anchorStops.length||(!d.anchorConnections.length&&!d.connections.some(w=>w.type==='anchor-permission-launch'))))errors.push('Missing causal anchor/permission/helper planning connection');
 if(local>=46){if(d.cooperation.stops.length<3||d.cooperation.travelers<2)errors.push('Incomplete permission capstone cooperation');if(capstoneIdeas.has(d.idea))errors.push('Repeated permission capstone idea');}
 if(level.chapter===5&&local>=16){const suit=permissionDependencies(level,simulateState,'suitGates');if(!suit.permitted.length||!suit.blocked.length||!suit.connections.length)errors.push('Missing mixed suit/color causal distinction');}
 if(local>=31&&!errors.length){const restricted=permissionHelperProof(level,simulateState);if(restricted.status==='unproven')errors.push('Permission planning helper bypass proof unproven');else if(restricted.status==='solved')errors.push('Permission planning has a perfect helper bypass');}
 return errors;
}
module.exports={permissionDependencies,permissionFailures,permissionHelperProof,permissionIdentityFailures};
