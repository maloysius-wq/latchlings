'use strict';
const DIRECTIONS=['U','D','L','R'];
const stateKey=state=>state.doorMask+'|'+state.positions.map(p=>p?p[0]+','+p[1]:'-').join(';');

/** BFS proves the optimum or reports the exact reason proof is incomplete. */
function solve(level,simulateState,{initialState,maxStates=800000,maxMs=30000,maxDepth=Infinity,forbidHelperStops=false}={}){
 if(!Number.isInteger(maxStates)||maxStates<1||!Number.isFinite(maxMs)||maxMs<0||maxDepth<0)throw new Error('Invalid solver limits');
 const started=Date.now(),initial=initialState||{positions:level.pieces.map(p=>p.pos.slice()),doorMask:0};
 const nodes=[{positions:initial.positions.map(p=>p&&p.slice()),doorMask:initial.doorMask,depth:0,parent:-1,move:null}];
 const seen=new Set([stateKey(nodes[0])]);let cursor=0,cutDepth=false;
 const report=status=>({status,states:seen.size,elapsedMs:Date.now()-started});
 const found=index=>{const route=[];for(let i=index;nodes[i].parent>=0;i=nodes[i].parent)route.push(nodes[i].move);return {...report('solved'),optimum:nodes[index].depth,route:route.reverse()};};
 if(nodes[0].positions.every(p=>p===null))return found(0);
 while(cursor<nodes.length){
  if(Date.now()-started>=maxMs)return report('unproven');
  const index=cursor++,state=nodes[index];
  if(state.depth>=maxDepth){cutDepth=true;continue;}
  for(let pi=0;pi<state.positions.length;pi++)if(state.positions[pi])for(const dir of DIRECTIONS){
   const move=simulateState(level,state.positions,state.doorMask,pi,dir);
   if(!move||(forbidHelperStops&&move.reason==='piece'))continue;
   const positions=state.positions.map(p=>p&&p.slice());positions[pi]=move.capture?null:[move.r,move.c];
   const next={positions,doorMask:move.mask,depth:state.depth+1,parent:index,move:[pi,dir]},key=stateKey(next);
   if(seen.has(key))continue;
   if(seen.size>=maxStates)return report('unproven');
   seen.add(key);nodes.push(next);
   if(positions.every(p=>p===null))return found(nodes.length-1);
  }
 }
 return report(cutDepth?'depth-exhausted':'unsolvable');
}
module.exports={solve,stateKey};
