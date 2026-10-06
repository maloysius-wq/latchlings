'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const {loadCampaign}=require('../tools/campaign/runtime.cjs'),{cooperation}=require('../tools/campaign/candidates.cjs'),{replay,reviewLevel}=require('../tools/campaign/review.cjs');
const {simulateState,levels}=loadCampaign(path.resolve(__dirname,'..'));
const masked={...JSON.parse(JSON.stringify(levels[0])),id:241,chapter:5,size:5,pieces:[{color:'blue',suit:'spade',pos:[2,4]},{color:'coral',suit:'heart',pos:[0,2]}],nests:[[0,3],[2,3]],rocks:[[3,2]],anchors:[],suitGates:[],colorGates:[[2,2,'coral']],rails:[],turners:[],switches:[],doors:[],solution:[[1,'D'],[0,'L'],[0,'U'],[1,'R']]};
assert(replay(masked,simulateState).solved,'masked-stop fixture must actually clear');
assert.equal(replay(masked,simulateState).steps[1].result.reason,'piece','engine occupancy has priority over the gate under that resident');
assert.equal(cooperation(masked,simulateState).stops.length,0,'a mismatching gate already supplies the identical physical stop; the resident is not a necessary helper');
assert(!reviewLevel(masked,simulateState,{focus:['helpers']}).witnesses.some(w=>w.mechanic==='helpers'),'review must not store a fictitious helper witness');
assert.equal(cooperation({...masked,colorGates:[]},simulateState).stops.length,1,'removing the gate makes this a genuine piece-dependent stop');
assert.equal(cooperation({...masked,colorGates:[],suitGates:[[2,2,'heart']]},simulateState).stops.length,0,'wrong-suit stops can be masked in the same way');
const {meaningfulHelperStop}=require('../tools/campaign/helper-stop.cjs');
const positions=[[2,4],[2,2]],move=simulateState(masked,positions,0,0,'L');
assert.equal(meaningfulHelperStop(masked,positions,0,0,'L',move,simulateState),false);
for(const terrain of [{colorGates:[],doors:[[2,2,0]]},{colorGates:[],rails:[[2,2,'R']]}]){const l={...masked,...terrain};assert.equal(meaningfulHelperStop(l,positions,0,0,'L',simulateState(l,positions,0,0,'L'),simulateState),false);}
for(const terrain of [{colorGates:[[2,2,'blue']]},{colorGates:[],anchors:[[2,2]]},{colorGates:[],turners:[[2,2,'CW']]}]){const l={...masked,...terrain};assert.equal(meaningfulHelperStop(l,positions,0,0,'L',simulateState(l,positions,0,0,'L'),simulateState),true,'matching gates, anchors and bends do not mask this adjacent helper stop');}
const {solve}=require('../tools/campaign/solve.cjs');
const trapped={...masked,pieces:[{color:'blue',suit:'spade',pos:[1,3]},{color:'coral',suit:'heart',pos:[0,2]}],nests:[[0,3],[2,4]],rocks:[[3,2],[3,3],[1,4],[3,4]]};
const initialState={positions:[[2,4],[2,2]],doorMask:0};
assert.deepEqual(replay(trapped,simulateState,[[1,'D'],[0,'D'],[0,'R']]).positions,initialState.positions,'the solver regression starts from an actually reachable trapped snapshot');
assert.equal(solve({...trapped,colorGates:[]},simulateState,{initialState,maxDepth:3,forbidMeaningfulHelperStops:true}).status,'depth-exhausted','a genuinely necessary occupant must be forbidden by physical helper proof');
assert.equal(solve(trapped,simulateState,{initialState,maxDepth:3,forbidHelperStops:true}).status,'depth-exhausted','literal legacy restriction remains unchanged');
assert.equal(solve(trapped,simulateState,{initialState,maxDepth:3,forbidMeaningfulHelperStops:true}).optimum,3,'masked occupancy must not exclude a physically helper-free alternative');
console.log('PASS real physical helper dependence rather than occupancy reason labels');
