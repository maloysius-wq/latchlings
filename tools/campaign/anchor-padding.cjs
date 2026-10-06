'use strict';
const {replay}=require('./review.cjs');
const clockwise={U:'R',R:'D',D:'L',L:'U'},counterclockwise={U:'L',L:'D',D:'R',R:'U'};
// Deliberately narrow: reject a marker only when EVERY authored use is an
// immediate straight continuation. Waiting for another actor, a changed
// heading, or a shared real launch is not certified as padding by this test.
function anchorPaddingFailures(level,simulateState){
 if(level.chapter<3||(level.chapter<8&&(level.id-1)%50<15))return[];
 const travel=replay(level,simulateState),errors=[];
 for(const anchor of level.anchors){
  const stops=travel.steps.filter(s=>s.result.reason==='anchor'&&s.result.r===anchor[0]&&s.result.c===anchor[1]);
  if(!stops.length)continue;
  const pure=stops.every(s=>{
   let heading=s.move[1];
   for(const at of s.result.path){const turn=level.turners.find(t=>t[0]===at[0]&&t[1]===at[1]);if(turn)heading=(turn[2]==='CW'?clockwise:counterclockwise)[heading];}
   const next=travel.steps[s.prefix+1];
   return next&&next.move[0]===s.move[0]&&next.move[1]===heading;
  });
  if(pure)errors.push('Straight anchor pause without a solving decision at '+anchor.join(','));
 }
 return errors;
}
module.exports={anchorPaddingFailures};
