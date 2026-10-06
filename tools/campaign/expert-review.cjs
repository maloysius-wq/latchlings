'use strict';
// Offline mastery evidence, not runtime rules or human difficulty certification.
const {replay}=require('./review.cjs'),{cooperation}=require('./candidates.cjs');
const {anchorDependencies}=require('./anchor-review.cjs');
const {permissionDependencies,permissionIdentityDecisions}=require('./permission-review.cjs');
const {routingDependencies}=require('./routing-review.cjs');
const {linkedDependencies}=require('./linked-review.cjs');
const {anchorPaddingFailures}=require('./anchor-padding.cjs'),{solve}=require('./solve.cjs');
// A precise stop must change a later launch or another resident's travel.
// Reversing from an anchor instead of the boundary is not enough by itself.
function usefulAnchor(level,simulateState,travel,anchor){
 const stripped={...level,anchors:level.anchors.filter(a=>a[0]!==anchor[0]||a[1]!==anchor[1])};
 const end=m=>m?JSON.stringify([m.r,m.c,m.mask,m.capture]):'invalid';
 for(const s of travel.steps.filter(s=>s.result.reason==='anchor'&&s.result.r===anchor[0]&&s.result.c===anchor[1])){
  const positions=s.state.positions.map(p=>p&&p.slice());let mask=s.state.doorMask;
  const first=simulateState(stripped,positions,mask,...s.move);if(!first)return true;
  positions[s.move[0]]=first.capture?null:[first.r,first.c];mask=first.mask;
  if(first.capture!==s.result.capture||mask!==s.result.mask)return true;
  for(const next of travel.steps.slice(s.prefix+1)){
   const m=simulateState(stripped,positions,mask,...next.move);
   // Removing a pause can make the next same-direction input a no-op:
   // it already reached the intended end on the previous input.
   const own=next.move[0]===s.move[0],at=positions[next.move[0]];
   const observed=m||own&&at&&{r:at[0],c:at[1],mask,capture:false};
   if(end(observed)!==end(next.result))return true;
   if(next.move[0]===s.move[0])break;
   if(JSON.stringify(m.path)!==JSON.stringify(next.result.path))return true;
   positions[next.move[0]]=m.capture?null:[m.r,m.c];mask=m.mask;
  }
 }
 return false;
}
function expertDependencies(level,simulateState){
 const travel=replay(level,simulateState),coop=cooperation(level,simulateState),anchor=anchorDependencies(level,simulateState),suit=permissionDependencies(level,simulateState,'suitGates'),color=permissionDependencies(level,simulateState,'colorGates'),routing=routingDependencies(level,simulateState),linked=linkedDependencies(level,simulateState),classes=[],connections=[];
 if(coop.stops.length)classes.push('helpers');
 const anchorConnection=anchor.connections.length||[...suit.connections,...color.connections,...routing.connections,...linked.earlierConnections].some(w=>/anchor/.test(w.type));
 if(anchor.stops.length&&anchorConnection&&level.anchors.some(a=>usefulAnchor(level,simulateState,travel,a)))classes.push('anchors');
 const sameAt=(a,b)=>a.at[0]===b.at[0]&&a.at[1]===b.at[1];
 for(const [name,d] of [['suitGates',suit],['colorGates',color]])if([...d.permitted,...d.blocked].some(w=>w.intended&&d.permitted.some(p=>sameAt(p,w))&&d.blocked.some(b=>sameAt(b,w))&&d.connections.some(c=>c.prefix===w.prefix||c.permissionPrefix===w.prefix))){classes.push(name);connections.push(...d.connections.map(w=>name+':'+w.type));}
 if(routing.connections.length){if([...routing.railPassed,...routing.railBlocked].some(w=>w.intended&&routing.railPassed.some(p=>sameAt(p,w))&&routing.railBlocked.some(b=>sameAt(b,w))&&routing.connections.some(c=>c.prefix===w.prefix||c.routingPrefix===w.prefix)))classes.push('rails');if(routing.bends.length)classes.push('turners');connections.push(...routing.connections.map(w=>'routing:'+w.type));}
 if(linked.connections.some(w=>w.type==='opened-passage')&&(linked.earlierConnections.length||linked.connections.some(w=>['closed-launch','delayed-opening'].includes(w.type)))){classes.push('linked-state');connections.push(...linked.connections.map(w=>'state:'+w.type),...linked.earlierConnections.map(w=>'state:'+w.type));}
 if(classes.includes('anchors'))connections.push(...anchor.connections.map(w=>'anchor:'+w.type));
 const identity=classes.includes('suitGates')&&classes.includes('colorGates')?permissionIdentityDecisions(level,simulateState):[];
 const futureState=linked.connections.some(w=>['closed-launch','delayed-opening'].includes(w.type))||identity.length>0||coop.beforeFirstCapture>=3&&coop.stops.some(w=>w.prefix>(coop.captures[0]??Infinity));
 classes.sort();
 const idea=classes.join('/')+'|'+coop.motif+'|'+[...new Set(connections)].sort().join('/');
 return{solved:travel.solved,classes,connections,cooperation:coop,linked,identity,futureState,idea,loopingMoves:routing.loopingMoves};
}
function expertEvidenceFailures(level,d,finalIdeas=new Set()){
 const local=level.id-350,c=d.cooperation,errors=[];
 if(!d.solved)errors.push('Expert authored route incomplete');
 if(d.loopingMoves.length)errors.push('Expert travel hits engine loop guard');
 if(d.classes.length<(local<=10?2:3))errors.push(local<=10?'Expert pair lacks two connected taught classes':'Expert synthesis lacks three connected taught classes');
 if(c.participants!==level.pieces.length||c.beforeFirstCapture<(local<=10?2:3)||c.stops.length<(local<=10?2:local<=25?3:4)||c.travelers<(local<=10?1:2))errors.push('Incomplete staged expert cooperation');
 if(local>=26&&!d.futureState)errors.push('Missing future-state or retained-helper capture planning');
 if(local>=41&&finalIdeas.has(d.idea))errors.push('Repeated final-ten expert dependency idea');
 if(level.id===366&&level.size!==7)errors.push('Dense Level366 must remain 7 by 7');
 if(level.id===400&&!d.classes.includes('linked-state'))errors.push('Final network lacks actual linked-state synthesis');
 return errors;
}
function expertFailures(level,simulateState,finalIdeas=new Set()){
 const d=expertDependencies(level,simulateState),errors=[...anchorPaddingFailures(level,simulateState),...expertEvidenceFailures(level,d,finalIdeas)];
 if(!errors.length){const p=solve(level,simulateState,{maxStates:800000,maxMs:30000,maxDepth:level.solution.length,forbidMeaningfulHelperStops:true});if(p.status==='unproven')errors.push('Expert helper bypass proof unproven');else if(p.status==='solved')errors.push('Expert has a perfect helper-free bypass');}
 return errors;
}
module.exports={expertDependencies,expertFailures,expertEvidenceFailures};
