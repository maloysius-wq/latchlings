'use strict';
const {replay}=require('./review.cjs');
function chooseAuthoredRoute(level,proof,simulateState,authoredRoute){
 if(proof.status!=='solved')throw new Error('An independent complete proof is required');
 const route=authoredRoute||proof.route;
 if(route.length!==proof.optimum)throw new Error('Authored route must have independently proven optimal length');
 if(!replay({...level,solution:route},simulateState).solved)throw new Error('Authored route must clear through the real engine');
 return route.map(move=>move.slice());
}
module.exports={chooseAuthoredRoute};
