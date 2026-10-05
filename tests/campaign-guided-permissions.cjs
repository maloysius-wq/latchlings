'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const {loadCampaign}=require('../tools/campaign/runtime.cjs'),{replay}=require('../tools/campaign/review.cjs'),{anchorDependencies}=require('../tools/campaign/anchor-review.cjs');
const {guidePermissions}=require('../tools/campaign/guided-permissions.cjs');
const {levels,simulateState}=loadCampaign(path.resolve(__dirname,'..'));
const base={...JSON.parse(JSON.stringify(levels[0])),id:183,chapter:4,size:5,pieces:[{color:'blue',suit:'spade',pos:[4,4]},{color:'coral',suit:'heart',pos:[0,2]}],nests:[[0,3],[2,0]],rocks:[[1,4],[3,2]],anchors:[],suitGates:[],colorGates:[],solution:[[0,'U'],[1,'D'],[0,'L'],[0,'U'],[1,'L']]};
assert(replay(base,simulateState).solved);
const before=JSON.stringify(base),proposals=guidePermissions(base,simulateState,'suitGates');
assert.equal(JSON.stringify(base),before,'offline suggestions must not mutate the authored input');
assert(proposals.length,'a rock-positioned helper can become a meaningful exact-stop setup');
for(const proposal of proposals){
 assert(replay(proposal,simulateState).solved,'suggestions preserve this witnessed foundation route, but still require independent optimum/design proof');
 assert(anchorDependencies(proposal,simulateState).connections.some(w=>w.type==='parked-helper'));
 assert.equal(proposal.suitGates.length,1);
 assert.equal(proposal.suitGates[0][2],'heart','the permission replaces a blocker for Blue while admitting Coral');
 assert(proposal.anchors.some(a=>a[0]===2&&a[1]===2));
 assert(!proposal.rocks.some(a=>a[0]===3&&a[1]===2),'the old rock must not make the new anchor redundant');
}
assert.deepEqual(guidePermissions({...base,rocks:[],solution:[]},simulateState,'suitGates'),[],'no evidence means no guided suggestion, not a fabricated certificate');
assert.deepEqual(guidePermissions({...base,suitGates:[[2,2,'heart']]},simulateState,'suitGates'),[],'an anchor must not cover an existing permission tile');
console.log('PASS route-guided suggestions preserve input and witnessed anchor/helper/identity setup; not an acceptance shortcut');
