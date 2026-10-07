'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const {loadCampaign}=require('../tools/campaign/runtime.cjs');
const {expertDependencies,expertFailures,expertEvidenceFailures}=require('../tools/campaign/expert-review.cjs');
const {simulateState}=loadCampaign(path.resolve(__dirname,'..'));
// Hand-traced twelve-input relay: three residents, two connected taught classes.
const pair={id:351,chapter:8,size:6,pieces:[{color:'blue',suit:'spade',pos:[2,5]},{color:'coral',suit:'heart',pos:[5,3]},{color:'mint',suit:'club',pos:[0,0]}],nests:[[1,2],[0,2],[5,0]],rocks:[[3,1],[1,0],[3,5],[1,1],[1,5],[3,3],[5,4]],anchors:[],suitGates:[],colorGates:[],rails:[],turners:[],switches:[[5,2,0]],doors:[[2,0,0]],solution:[[1,'L'],[1,'U'],[1,'R'],[1,'U'],[0,'L'],[2,'R'],[2,'D'],[0,'R'],[0,'U'],[1,'L'],[2,'L'],[2,'D']],optimal:12,moveLimit:15};
assert.deepEqual(expertDependencies(pair,simulateState).classes.sort(),['helpers','linked-state']);
assert.deepEqual(expertFailures(pair,simulateState),[],'a compact pairwise mastery relay has real setup and no perfect helper bypass');
assert.deepEqual(expertEvidenceFailures(pair,expertDependencies(pair,simulateState)),[],'cheap guidance checks the same physical structure before an expensive independent proof');
assert(expertFailures({...pair,id:361},simulateState).some(e=>/three.*classes/i.test(e)),'three-way synthesis cannot be inferred from three residents alone');
assert(expertFailures({...pair,id:400},simulateState).some(e=>/three.*classes/i.test(e)),'final network needs a third meaningfully connected taught class');
const irrelevant={...pair,doors:[[4,4,0]]};
assert(!expertDependencies(irrelevant,simulateState).classes.includes('linked-state'),'switch-mask changes alone never count as a taught class');
const universal={...pair,pieces:pair.pieces.map(p=>({...p,suit:'spade'})),suitGates:[[2,2,'spade']]};
assert(!expertDependencies(universal,simulateState).classes.includes('suitGates'),'a gate allowing every resident cannot manufacture a third mastery class from a helper crossing');
assert(expertFailures({...pair,id:366},simulateState).some(e=>/7.*7/.test(e)),'dense Level366 remains a seven-by-seven stress board');
const d=expertDependencies(pair,simulateState);
assert(expertFailures({...pair,id:391},simulateState,new Set([d.idea])).some(e=>/Repeated/.test(e)),'last-ten solving ideas cannot be accepted twice');
const disconnected={id:365,chapter:8,size:6,pieces:[{color:'blue',suit:'spade',pos:[2,5]},{color:'coral',suit:'heart',pos:[5,5]},{color:'mint',suit:'club',pos:[3,3]}],nests:[[0,5],[4,4],[0,2]],rocks:[[3,0],[0,0],[4,0],[0,3],[0,1]],anchors:[[3,5]],suitGates:[[0,4,'spade'],[4,5,'heart']],colorGates:[[1,5,'blue'],[5,0,'lavender']],rails:[],turners:[],switches:[],doors:[],optimal:9,moveLimit:11,solution:[[0,'D'],[1,'L'],[2,'D'],[2,'L'],[2,'U'],[1,'R'],[1,'U'],[0,'U'],[1,'L']]};
assert(!expertDependencies(disconnected,simulateState).classes.includes('colorGates'),'an all-rejecting color wall and an unrelated allowed passage cannot manufacture a connected identity class');
const deadRail={...pair,id:360,pieces:[{color:'blue',suit:'spade',pos:[0,5]},{color:'coral',suit:'heart',pos:[0,1]}],nests:[[2,4],[3,3]],rocks:[[5,4],[5,3],[0,3],[3,0],[3,5],[1,0]],switches:[],doors:[],rails:[[4,0,'U'],[4,5,'D']],solution:[[0,'D'],[1,'D'],[1,'L'],[1,'U'],[1,'R'],[1,'U'],[1,'R'],[0,'U'],[0,'L'],[0,'D'],[0,'L'],[0,'U'],[0,'R'],[1,'L'],[1,'D'],[1,'L'],[0,'U']]};
assert(!expertDependencies(deadRail,simulateState).classes.includes('rails'),'a never-enterable arrow wall plus an unrelated rail passage cannot manufacture directional mastery');
console.log('PASS connected expert classes, staged mastery, real state use, dense366 and final-ten idea uniqueness');
{
 const turnaround={id:369,chapter:8,size:6,pieces:[{color:'blue',suit:'spade',pos:[1,2]},{color:'coral',suit:'heart',pos:[3,5]},{color:'mint',suit:'club',pos:[0,2]}],nests:[[4,4],[3,3],[5,0]],rocks:[[2,2],[2,1],[2,3],[1,1],[1,3],[2,5],[5,4],[1,4]],anchors:[[1,0]],suitGates:[],colorGates:[],rails:[[4,3,'D']],turners:[],switches:[[0,5,0]],doors:[[3,4,0]],solution:[[2,'R'],[0,'U'],[0,'L'],[0,'D'],[0,'D'],[2,'L'],[2,'D'],[2,'D'],[2,'R'],[0,'U'],[2,'L'],[0,'D'],[0,'R'],[0,'D'],[1,'L'],[2,'D']]};
 assert(!expertDependencies(turnaround,simulateState).classes.includes('anchors'),'a turn-around anchor whose removal preserves every downstream helper launch cannot inflate mastery');
 const shared={id:351,chapter:8,size:6,pieces:[{color:'blue',suit:'spade',pos:[0,1]},{color:'coral',suit:'heart',pos:[3,4]}],nests:[[4,1],[0,0]],rocks:[[0,3],[5,3],[5,2],[1,0],[4,0],[5,0]],anchors:[[3,5]],suitGates:[],colorGates:[],rails:[],turners:[],switches:[],doors:[],solution:[[0,'R'],[0,'D'],[0,'R'],[0,'U'],[1,'L'],[0,'L'],[1,'U'],[1,'R'],[1,'D'],[1,'L'],[0,'D'],[1,'U'],[1,'L']]};
 assert(expertDependencies(shared,simulateState).classes.includes('anchors'),'a shared anchor that changes both residents helper launch rows remains meaningful mastery');
}
{
 const {prepareChapter}=require('../tools/campaign/prepare.cjs'),baseline=require('../docs/campaign/baseline.json');
 const teaching=loadCampaign(path.resolve(__dirname,'..')).levels.slice(300,350).map(l=>({...l,id:l.id+50,chapter:8,moveLimit:l.optimal+baseline.margins[l.id+49]}));
 const notes=Object.fromEntries(teaching.map(l=>[l.id,{intention:'Fixture only: short linked teaching is not an expert mastery curriculum.',rationale:'Isolated acceptance regression, not published content.'}]));
 assert.throws(()=>prepareChapter(teaching,notes,baseline,simulateState,{visualEvidence:{status:'fixture only'}}),/351: Expert pair lacks two connected taught classes/,'preparation must reject ordinary teaching relabeled as Aurora before exporting records');
 console.log('PASS expert preparation refuses relabeled introductory teaching');
}
{
 const {expertProfile,expertRoute}=require('../tools/campaign/search-expert.cjs');
 const proof={status:'solved',optimum:12,route:pair.solution};
 assert.deepEqual(expertRoute({...pair,solution:[]},proof,simulateState),pair.solution,'raw suggestions have no authored route; use the independent valid solution');
 assert.deepEqual(expertRoute({...pair,solution:pair.solution.slice(1)},proof,simulateState),pair.solution,'stale nonoptimal guidance must not abort an independently proven suggestion');
 assert.throws(()=>expertRoute({...pair,solution:[[0,'R'],...pair.solution.slice(1)]},proof,simulateState),/clear/,'same-length authored guidance still must really clear');
 for(let local=1;local<=50;local++){
  const p=expertProfile(local);assert(p.pieces>=2&&p.pieces<=3,'ordinary expert boards do not require four residents');assert(p.size>=5&&p.size<=7);
  if(local<=10){assert.equal(p.pieces,2);assert.equal(['anchors','suitGates','colorGates','rails','turners','links'].filter(f=>p[f]>0).length,1,'expert entry pairs cooperation with one substantial taught skill');}
  else assert.equal(p.pieces,3);
  if(p.suitGates&&p.colorGates)assert(['shared-suit','shared-color'].includes(p.identity),'mixed identity suggestions must not make suit and color interchangeable');
 }
 assert.equal(expertProfile(16).size,7);assert.equal(expertProfile(50).links,1);
 assert.equal(expertProfile(27).requiredState,'closed-launch');assert.equal(expertProfile(34).requiredState,'delayed-opening');
 assert.throws(()=>expertProfile(0),/1–50/);assert.throws(()=>expertProfile(51),/1–50/);
 console.log('PASS expert suggestion profiles keep focused pairs, dense366 and selective mastery combinations');
}
{
 const {expertFoundationSuggestions}=require('../tools/campaign/search-expert.cjs');
 const base={id:372,chapter:8,size:6,pieces:[{color:'blue',suit:'spade',pos:[1,5]},{color:'coral',suit:'heart',pos:[3,5]},{color:'mint',suit:'club',pos:[3,3]}],nests:[[3,0],[0,2],[5,5]],rocks:[[5,2],[2,0],[0,5],[5,4],[0,3],[2,5],[4,0],[0,0]],anchors:[],suitGates:[],colorGates:[],rails:[],turners:[],switches:[],doors:[],solution:[[0,'L'],[1,'L'],[1,'D'],[2,'U'],[0,'R'],[0,'D'],[0,'R'],[2,'D'],[0,'L'],[1,'L'],[1,'U'],[2,'R'],[2,'D'],[0,'R'],[0,'U'],[0,'L']]};
 const before=JSON.stringify(base),variants=expertFoundationSuggestions(base,simulateState,{suitGates:1,rails:1});
 assert.equal(JSON.stringify(base),before,'foundation guidance cannot mutate its source route');
 const specific=variants.find(l=>l.anchors.some(a=>a[0]===4&&a[1]===1)&&l.suitGates.some(a=>a[0]===5&&a[1]===2&&a[2]==='heart')&&l.rails.some(a=>a[0]===5&&a[1]===4&&a[2]==='U'));
 assert(specific,'compose the hand-traced helper anchor, Heart permission and blocked upward rail');
 const {solve}=require('../tools/campaign/solve.cjs'),p=solve(specific,simulateState);
 assert.equal(p.status,'solved');assert.equal(p.optimum,15,'independent proof shortens the guided foundation without padding');
 const proved={...specific,solution:p.route,optimal:p.optimum};
 assert.deepEqual(expertDependencies(proved,simulateState).classes,['anchors','helpers','suitGates'],'real replay exposes the connected classes, not a cosmetic rail class');
 assert.deepEqual(expertFailures(proved,simulateState),[],'foundation suggestions still require every normal mastery gate');
 assert.deepEqual(expertFoundationSuggestions({...base,solution:[]},simulateState,{suitGates:1,rails:1}),[],'incomplete foundations produce no fabricated route evidence');
 console.log('PASS actual foundation guidance composes causal fields without bypassing fresh proof');
 const {iterateExpertFoundations}=require('../tools/campaign/search-expert.cjs');
 const focused=[...iterateExpertFoundations(base,simulateState,{suitGates:1,rails:1})].find(l=>l.anchors.some(a=>a[0]===4&&a[1]===1)&&l.suitGates.some(a=>a[0]===5&&a[1]===2&&a[2]==='heart')&&l.rails.length===0);
 assert(focused,'offer the connected anchor/helper/permission design without requiring a cosmetic rail');
 const fp=solve(focused,simulateState);assert.equal(fp.status,'solved');
 assert.deepEqual(expertFailures({...focused,optimal:fp.optimum,solution:fp.route},simulateState),[],'focused suggestions still satisfy the complete expert contract');
 console.log('PASS focused cooperative foundations precede complete mixtures without relaxing mastery');
 const {proveExpertSuggestion}=require('../tools/campaign/search-expert.cjs');
 assert.equal(proveExpertSuggestion(focused,simulateState,[16,26]),null,'reject a proven fifteen-input suggestion outside the chosen band before full qualification');
 const accepted=proveExpertSuggestion(focused,simulateState,[12,26]);
 assert.equal(accepted.status,'solved');assert.equal(accepted.optimum,15,'only complete shortest proofs proceed to normal qualification');
 console.log('PASS bounded suggestion screening rejects short routes without inventing proof');
}
