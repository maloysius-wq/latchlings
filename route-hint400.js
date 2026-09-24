'use strict';
(function(){
 const DIRECTIONS=['U','D','L','R'];
 const DEFAULT_MAX_STATES=12000,DEFAULT_MAX_MS=900,SLICE_MS=7;
 const copyPositions=positions=>positions.map(position=>position?position.slice():null);
 const isSolved=positions=>positions.every(position=>!position);
 const encodeState=(positions,mask)=>`${mask}|${positions.map(position=>position?`${position[0]},${position[1]}`:'-').join(';')}`;
 const samePositions=(left,right)=>left.length===right.length&&left.every((position,index)=>position===null?right[index]===null:!!right[index]&&position[0]===right[index][0]&&position[1]===right[index][1]);
 function isInitialBoard(lev,positions,mask){
  return mask===0&&positions.length===lev.pieces.length&&positions.every((position,index)=>position&&position[0]===lev.pieces[index].pos[0]&&position[1]===lev.pieces[index].pos[1]);
 }
 function authoredContinuation(lev,positions,mask,remaining){
  if(!Array.isArray(lev.solution)||!lev.solution.length)return null;
  const routePositions=lev.pieces.map(piece=>piece.pos.slice());let routeMask=0;
  for(let index=0;index<=lev.solution.length;index++){
   if(routeMask===mask&&samePositions(routePositions,positions)&&lev.solution.length-index<=remaining){
    if(index===lev.solution.length)return {status:'found',pi:null,dir:null};
    const [pi,dir]=lev.solution[index];
    if(window.simulateState(lev,routePositions,routeMask,pi,dir))return {status:'found',pi,dir};
   }
   if(index===lev.solution.length)break;
   const [pi,dir]=lev.solution[index],move=window.simulateState(lev,routePositions,routeMask,pi,dir);
   if(!move)return null;
   routePositions[pi]=move.capture?null:[move.r,move.c];routeMask=move.mask;
  }
  return null;
 }
 function findNext(lev,state,options={}){
  const positions=copyPositions(state?.positions||[]),doorMask=Number(state?.doorMask)||0,remaining=Math.floor(Number(state?.remaining)||0),signal=options?.signal;
  if(!lev||positions.length!==lev.pieces.length)return Promise.resolve({status:'inconclusive'});
  if(isSolved(positions))return Promise.resolve({status:'found',pi:null,dir:null});
  if(remaining<=0)return Promise.resolve({status:'impossible'});
  if(isInitialBoard(lev,positions,doorMask)&&lev.solution?.length&&lev.solution.length<=remaining){
   const [pi,dir]=lev.solution[0];
   if(window.simulateState(lev,positions,doorMask,pi,dir))return Promise.resolve({status:'found',pi,dir});
  }
  const authoredHint=authoredContinuation(lev,positions,doorMask,remaining);
  if(authoredHint)return Promise.resolve(authoredHint);

  const maxStates=Math.max(1,Math.floor(Number(options?.maxStates)||DEFAULT_MAX_STATES)),maxMs=Math.max(1,Number(options?.maxMs)||DEFAULT_MAX_MS),started=performance.now();
  return new Promise(resolve=>{
   let settled=false,abortHandler=null;
   const finish=result=>{
    if(settled)return;settled=true;
    if(signal&&abortHandler)signal.removeEventListener('abort',abortHandler);
    resolve(result);
   };
   if(signal?.aborted){finish({status:'inconclusive'});return}
   if(signal){abortHandler=()=>finish({status:'inconclusive'});signal.addEventListener('abort',abortHandler,{once:true})}

   const root={positions,doorMask,depth:0,first:null},queue=[root],visited=new Set([encodeState(positions,doorMask)]);
   let cursor=0;
   function processSlice(){
    if(settled)return;
    if(signal?.aborted){finish({status:'inconclusive'});return}
    if(performance.now()-started>=maxMs){finish({status:'inconclusive'});return}
    const sliceStarted=performance.now();
    while(cursor<queue.length&&performance.now()-sliceStarted<SLICE_MS){
     const current=queue[cursor++];
     if(current.depth>=remaining)continue;
     for(let pi=0;pi<current.positions.length;pi++){
      if(!current.positions[pi])continue;
      for(const dir of DIRECTIONS){
       if(performance.now()-started>=maxMs){finish({status:'inconclusive'});return}
       const move=window.simulateState(lev,current.positions,current.doorMask,pi,dir);
       if(!move)continue;
       const nextPositions=copyPositions(current.positions);
       nextPositions[pi]=move.capture?null:[move.r,move.c];
       const nextMask=move.mask,nextDepth=current.depth+1,first=current.first||{pi,dir};
       if(isSolved(nextPositions)){finish({status:'found',pi:first.pi,dir:first.dir});return}
       if(nextDepth>=remaining)continue;
       const key=encodeState(nextPositions,nextMask);
       if(visited.has(key))continue;
       if(visited.size>=maxStates){finish({status:'inconclusive'});return}
       visited.add(key);queue.push({positions:nextPositions,doorMask:nextMask,depth:nextDepth,first});
      }
     }
    }
    if(settled)return;
    if(cursor>=queue.length){finish({status:'impossible'});return}
    setTimeout(processSlice,0);
   }
   setTimeout(processSlice,0);
  });
 }
 window.LatchlingsRouteHint={findNext};
})();
