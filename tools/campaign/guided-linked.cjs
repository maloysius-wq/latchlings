'use strict';
// Offline state suggestions. Independent shortest proof and author review remain mandatory.
const {replay}=require('./review.cjs'),{linkedDependencies}=require('./linked-review.cjs');
const same=(a,b)=>a[0]===b[0]&&a[1]===b[1],dirs=['U','R','D','L'],vectors={U:[-1,0],D:[1,0],L:[0,-1],R:[0,1]};
const occupied=l=>[...l.pieces.map(p=>p.pos),...l.nests,...['rocks','anchors','suitGates','colorGates','rails','turners','switches','doors'].flatMap(f=>l[f])];
function guideLinkedPassages(base,simulateState){
 const travel=replay(base,simulateState);if(!travel.solved||base.switches.length||base.doors.length)return[];
 const taken=occupied(base),switches=new Map(),suggestions=[],used=new Set();
 for(const step of travel.steps)for(const at of step.result.path)if(!taken.some(p=>same(p,at)))switches.set(at.join(','),at);
 for(const sw of switches.values()){
  const foundation=structuredClone(base);foundation.switches.push([...sw,0]);const switched=replay(foundation,simulateState);if(!switched.solved)continue;
  for(const step of switched.steps){let mask=step.state.doorMask;
   for(const at of step.result.path){
    if((mask&1)&&!taken.some(p=>same(p,at))&&!same(at,sw)){
     const key=sw.join(',')+'>'+at.join(',');if(!used.has(key)){
      used.add(key);const level=structuredClone(foundation);level.doors.push([...at,0]);
      const d=linkedDependencies(level,simulateState);if(d.solved&&d.connections.some(w=>w.type==='opened-passage')&&d.closedStops.length)suggestions.push(level);
     }
    }
    if(same(at,sw))mask^=1;
   }
  }
 }
 return suggestions;
}
function compactReplay(level,simulateState,route){
 let positions=level.pieces.map(p=>p.pos.slice()),mask=0;const compact=[];
 for(const [pi,dir] of route){const move=simulateState(level,positions,mask,pi,dir);if(!move)continue;compact.push([pi,dir]);positions[pi]=move.capture?null:[move.r,move.c];mask=move.mask;}
 return positions.every(p=>p===null)?compact:null;
}
function guideClosedDoors(base,simulateState){
 const travel=replay(base,simulateState);if(!travel.solved)return[];
 const links=[...new Set(base.switches.map(s=>s[2]))],suggestions=[],used=new Set();
 for(const step of travel.steps){
  if(step.result.reason!=='rock')continue;
  const path=[step.state.positions[step.move[0]],...step.result.path],from=path.at(-2),last=path.at(-1);let dir=last[0]<from[0]?'U':last[0]>from[0]?'D':last[1]<from[1]?'L':'R';
  const turn=base.turners.find(t=>same(t,last));if(turn)dir=dirs[(dirs.indexOf(dir)+(turn[2]==='CW'?1:3))%4];
  const v=vectors[dir],at=[last[0]+v[0],last[1]+v[1]];
  for(const link of links){
   if(step.result.mask&(1<<link))continue;
   const key=at.join(',')+':'+link;if(used.has(key))continue;used.add(key);
   const level=structuredClone(base);level.rocks=level.rocks.filter(p=>!same(p,at));level.doors.push([...at,link]);
   const route=compactReplay(level,simulateState,base.solution);if(!route)continue;level.solution=route;
   const d=linkedDependencies(level,simulateState);if(d.connections.some(w=>['closed-launch','delayed-opening'].includes(w.type)&&w.link===link))suggestions.push(level);
  }
 }
 return suggestions;
}
module.exports={guideLinkedPassages,guideClosedDoors};
