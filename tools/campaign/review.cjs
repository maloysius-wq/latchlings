'use strict';
const {solve}=require('./solve.cjs'),{canonical,FIELDS}=require('./fingerprint.cjs');
const clone=value=>JSON.parse(JSON.stringify(value));
const effect=move=>move?JSON.stringify([move.r,move.c,move.path,move.mask,move.capture]):'blocked';
const focusForChapter=chapter=>({2:['helpers'],3:['anchors'],4:['suitGates'],5:['colorGates'],6:['rails','turners'],7:['switches','doors'],8:[]})[chapter]||[];
// A switch and its door are two parts of one linked-state rule, not two mechanics.
const mechanicClasses=witnesses=>new Set(witnesses.map(w=>['switches','doors'].includes(w.mechanic)?'linked-state':w.mechanic));
function replay(level,simulateState,route=level.solution){
 let positions=level.pieces.map(p=>p.pos.slice()),doorMask=0;const steps=[];
 for(let prefix=0;prefix<route.length;prefix++){
  const[pi,dir]=route[prefix],move=simulateState(level,positions,doorMask,pi,dir);
  if(!move)return{solved:false,steps,error:`Invalid move ${prefix+1}`};
  steps.push({prefix,state:{positions:clone(positions),doorMask},move:[pi,dir],result:clone(move)});
  positions[pi]=move.capture?null:[move.r,move.c];doorMask=move.mask;
 }
 return{solved:positions.every(p=>p===null),steps,positions,doorMask};
}
function reviewLevel(level,simulateState,settings={}){
 const proof=solve(level,simulateState,settings),travel=replay(level,simulateState),witnesses=[];
 const focus=settings.focus||focusForChapter(level.chapter);
 for(const step of travel.steps){
  const {prefix,state,move,result}=step;
  if(result.reason==='piece')witnesses.push({mechanic:'helpers',prefix,state,move,effect:'piece-stop'});
  for(const field of FIELDS.filter(f=>f!=='rocks'&&level[f]?.length)){
   const without={...level,[field]:[]};
   // Solution states make each counterfactual reachable and reproducible.
   for(let pi=0;pi<state.positions.length;pi++)if(state.positions[pi])for(const dir of ['U','D','L','R']){
    const actual=simulateState(level,state.positions,state.doorMask,pi,dir),removed=simulateState(without,state.positions,state.doorMask,pi,dir);
    if(effect(actual)!==effect(removed))witnesses.push({mechanic:field,prefix,state,move:[pi,dir],effect:move[0]===pi&&move[1]===dir?'intended-trajectory':'relevant-choice',actual:clone(actual),removed:clone(removed)});
   }
  }
 }
 const comparisons={authoredSolved:travel.solved,terrain:canonical(level,{terrainOnly:true}),focus,removal:{}};
 for(const field of focus.filter(f=>f!=='helpers'))comparisons.removal[field]=replay({...level,[field]:[]},simulateState).solved;
 if(level.chapter===2)comparisons.noHelper=solve(level,simulateState,{...settings,forbidHelperStops:true,maxDepth:level.moveLimit});
 return {proof:{...proof,settings:{maxStates:settings.maxStates||800000,maxMs:settings.maxMs??30000}},witnesses,comparisons};
}
function validateRecord(level,record,baseline,acceptedLevels){
 const errors=[];
 if(!record)return['Missing review record'];
 if(record.id!==level.id||record.chapter!==level.chapter||record.local!==(level.id-1)%50+1)errors.push('Record slot mismatch');
 if(!record.intention?.trim()||!record.stage||!['retain','replace'].includes(record.decision))errors.push('Missing design decision/intention');
 if(level.moveLimit-level.optimal!==baseline.margins[level.id-1]||record.baselineMargin!==baseline.margins[level.id-1])errors.push('Changed baseline allowance margin');
 if(record.proof?.status!=='solved'||record.proof.optimum!==level.optimal||level.solution.length!==level.optimal)errors.push('Missing or inconsistent shortest proof');
 const key=canonical(level);if(record.canonical!==key)errors.push('Stale canonical fingerprint');
 if(acceptedLevels.some(l=>canonical(l)===key))errors.push('Canonical duplicate');
 const focus=record.focus||[];
 if(!focus.length&&level.chapter!==8)errors.push('Missing focus');
 for(const field of focus)if(!record.witnesses?.some(w=>w.mechanic===field))errors.push(`Missing ${field} witness`);
 if(!record.comparisons?.similarityReviewed)errors.push('Similarity review pending');
 if(!record.visualEvidence?.status?.trim()||/pending/i.test(record.visualEvidence.status))errors.push('Visual review pending');
 if(!record.comparisons?.authoredSolved)errors.push('Authored route incomplete');
 if(level.chapter===2){
  const restricted=record.comparisons?.noHelper;if(!restricted||restricted.status==='unproven')errors.push('Helper bypass proof unproven');
  if(restricted?.status==='solved'&&restricted.optimum<=level.optimal&&!record.contrastWith?.length)errors.push('Perfect no-helper bypass without purposeful contrast');
 }
 return errors;
}
module.exports={reviewLevel,validateRecord,replay,focusForChapter,mechanicClasses};
