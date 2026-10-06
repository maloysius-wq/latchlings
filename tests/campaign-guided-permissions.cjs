'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const {loadCampaign}=require('../tools/campaign/runtime.cjs'),{replay}=require('../tools/campaign/review.cjs'),{anchorDependencies}=require('../tools/campaign/anchor-review.cjs');
const {guidePermissions,guideMatchingPermissions}=require('../tools/campaign/guided-permissions.cjs');
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
assert.equal(typeof guideMatchingPermissions,'function','a meaningful stopper can be supplemented with actual matching passage, not weaker acceptance');
const matching=guideMatchingPermissions(base,simulateState,'colorGates');
assert.equal(JSON.stringify(base),before);
assert(matching.some(p=>p.colorGates.some(g=>g.join(',')==='3,4,blue')),'suggest a Blue permission on an actual interior Blue route segment');
const bluePassage=matching.find(p=>p.colorGates.some(g=>g.join(',')==='3,4,blue'));
assert(!replay({...bluePassage,colorGates:[[3,4,'coral']]},simulateState).solved,'that permitted actual entry becomes physically blocked for the wrong color');
for(const p of matching){assert(replay(p,simulateState).solved);const cells=[...p.pieces.map(x=>x.pos),...p.nests,...p.rocks,...p.anchors,...p.suitGates,...p.colorGates].map(x=>x.slice(0,2).join(','));assert.equal(new Set(cells).size,cells.length,'matching passage must not cover starts, nests or prior terrain');}
assert.deepEqual(guideMatchingPermissions({...base,solution:[]},simulateState,'colorGates'),[]);
assert.deepEqual(guideMatchingPermissions({...base,rocks:[...base.rocks,[3,4]]},simulateState,'colorGates'),[],'incomplete foundation cannot produce a matching-passage certificate');
console.log('PASS exclusive actual matching-passage suggestions preserve their witnessed input route');
