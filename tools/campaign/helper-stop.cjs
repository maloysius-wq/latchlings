'use strict';
// Occupancy is checked before terrain by the engine. A reason label alone cannot
// establish cooperation when a closed door, gate or wrong-way rail masks it.
const physical=m=>m?JSON.stringify([m.r,m.c,m.path,m.mask,m.capture]):'blocked';
function meaningfulHelperStop(level,positions,mask,pi,dir,move,simulateState){
 if(!move||move.reason!=='piece')return false;
 if(!['suitGates','colorGates','rails','doors'].some(field=>level[field]?.length))return true;
 const withoutOthers=positions.map((p,index)=>index===pi?p:null);
 return physical(move)!==physical(simulateState(level,withoutOthers,mask,pi,dir));
}
module.exports={meaningfulHelperStop};
