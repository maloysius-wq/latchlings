'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const {loadCampaign}=require('../tools/campaign/runtime.cjs'),{replay}=require('../tools/campaign/review.cjs'),{linkedDependencies}=require('../tools/campaign/linked-review.cjs');
const {guideLinkedPassages,guideClosedDoors}=require('../tools/campaign/guided-linked.cjs');
const {levels,simulateState}=loadCampaign(path.resolve(__dirname,'..'));
const base={...structuredClone(levels[0]),id:301,chapter:7,size:5,pieces:[{color:'blue',suit:'spade',pos:[2,4]},{color:'coral',suit:'heart',pos:[0,0]}],nests:[[0,2],[4,2]],rocks:[],anchors:[],suitGates:[],colorGates:[],rails:[],turners:[],switches:[],doors:[],solution:[[0,'U'],[0,'L'],[1,'D'],[1,'R']]};
const original=JSON.stringify(base),passages=guideLinkedPassages(base,simulateState);
assert(passages.some(l=>l.switches.some(s=>s[0]===0&&s[1]===4)&&l.doors.some(d=>d[0]===0&&d[1]===3)),'derive switch-before-door from actual travel, not painted random state');
for(const l of passages){assert(replay(l,simulateState).solved);assert(linkedDependencies(l,simulateState).connections.some(w=>w.type==='opened-passage'));}
assert.equal(JSON.stringify(base),original);
const foundation={...base,id:331,size:6,pieces:[{...base.pieces[0],pos:[1,4]},{...base.pieces[1],pos:[5,4]}],nests:[[5,3],[5,0]],rocks:[[0,2]],switches:[[0,4,0]],doors:[[2,4,0]],solution:[[0,'U'],[0,'D'],[0,'U'],[0,'L'],[0,'D'],[1,'U'],[1,'R'],[1,'U'],[1,'L'],[1,'D'],[1,'L']]};
assert(replay(foundation,simulateState).solved,'foundation already clears before closed-door substitution');
const serialized=JSON.stringify(foundation),closings=guideClosedDoors(foundation,simulateState);
assert(closings.some(l=>l.doors.some(d=>d[0]===0&&d[1]===2)),'replace actual rock stop with the same linked door while preserving a useful closed launch');
for(const l of closings){assert(replay(l,simulateState).solved);assert(linkedDependencies(l,simulateState).connections.some(w=>w.type==='closed-launch'));assert.equal(l.solution.length,10,'remove only now-invalid redundant input after the opened passage extends an old stop and enables an earlier capture');}
assert.equal(JSON.stringify(foundation),serialized);
assert.deepEqual(guideLinkedPassages({...base,solution:[]},simulateState),[]);
assert.deepEqual(guideClosedDoors({...base,solution:[]},simulateState),[]);
console.log('PASS witnessed linked opening/closing suggestions, real compact replay and immutable foundations');
