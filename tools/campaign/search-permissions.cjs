'use strict';
// Deterministic offline proposals; every slot still needs individual author/visual review.
const fs=require('node:fs'),path=require('node:path');
const {guidePermissions,guideMatchingPermissions}=require('./guided-permissions.cjs');
const {chooseAuthoredRoute}=require('./authored-route.cjs');
const {loadCampaign}=require('./runtime.cjs'),{solve}=require('./solve.cjs'),{canonical,nearClones}=require('./fingerprint.cjs'),{candidate,searchGeometry}=require('./candidates.cjs'),{permissionDependencies,permissionFailures}=require('./permission-review.cjs');
const chapter=Number(process.argv[process.argv.indexOf('--chapter')+1]);if(![4,5].includes(chapter))throw new Error('Specify --chapter 4 or 5');
const root=path.resolve(__dirname,'../..'),{levels,simulateState}=loadCampaign(root),baseline=require('../../docs/campaign/baseline.json'),name=chapter===4?'masquerade':'prism',file=path.join(root,`test-artifacts/campaign/${name}-proposals.json`),checkpoint=fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):[],rows=[],prior=levels.slice(0,(chapter-1)*50),keys=new Set(prior.map(l=>canonical(l))),ideas=new Set();
fs.mkdirSync(path.dirname(file),{recursive:true});
for(let local=1;local<=50;local++){
 const id=(chapter-1)*50+local,stage=local<=5?0:local<=15?1:local<=30?2:local<=45?3:4,field=chapter===4?'suitGates':'colorGates',shared=[2,4,6,10,14,18,24,33,41,47].includes(local),identity=chapter===5&&stage>=2?(local%2===0?'shared-color':'shared-suit'):(shared?(chapter===4?'shared-suit':'shared-color'):(local===3?(chapter===4?'shared-color':'shared-suit'):undefined));
 const profile={size:stage<2?5:6,pieces:stage<2?2:stage===2&&local%3!==0?2:3,rocks:stage===0?3+local%2:stage===1?4:stage===2?5+local%2:7+local%3,anchors:stage===0?0:stage<3?1:2,suitGates:chapter===4?2:stage<2?0:2,colorGates:chapter===5?2:0,identity,geometry:['lanes','crossing','corners','scattered'][local%4]};
 if(shared){if(chapter===4)profile.suitPermissions=['spade','heart'];else profile.colorPermissions=['blue','coral'];}
 if(chapter===5&&identity==='shared-suit')profile.suitPermissions=['spade','heart'];
 if(chapter===5&&identity==='shared-color')profile.colorPermissions=['blue','coral'];
 const band=[[3,6],[5,10],[7,13],[10,18],[12,22]][stage];let selected;
 const qualify=(level,proof,decision,extra={})=>{
  if(proof.status!=='solved'||proof.optimum<band[0]||proof.optimum>band[1])return null;
  Object.assign(level,{optimal:proof.optimum,solution:chooseAuthoredRoute(level,proof,simulateState,extra.authoredRoute),moveLimit:proof.optimum+baseline.margins[id-1],difficultyScore:proof.optimum});
  if(keys.has(canonical(level))||permissionFailures(level,simulateState,ideas).length)return null;
  const dependencies=permissionDependencies(level,simulateState,field);
  if(((chapter===4&&identity==='shared-suit')||(chapter===5&&identity==='shared-color'))&&!dependencies.sharedProperty)return null;
  if(local===3){const p=level.pieces;if(!p.some((a,i)=>p.some((b,j)=>i!==j&&a[chapter===4?'color':'suit']===b[chapter===4?'color':'suit']&&a[chapter===4?'suit':'color']!==b[chapter===4?'suit':'color'])))return null;}
  if(stage>=2&&!dependencies.connections.length)return null;
  return{level,proof,decision,profile,dependencies,similarities:nearClones(level,prior),reviewStatus:'pending individual author/visual review',...extra};
 };
 const saved=checkpoint.find(r=>r.level.id===id);if(saved)selected=qualify(saved.level,solve(saved.level,simulateState),saved.decision,{origin:saved.origin||id,profile:saved.profile||profile,seed:saved.seed,attempt:saved.attempt,...(saved.authoredRoute?{authoredRoute:saved.authoredRoute}:{})});
 // Diagnostic full reproof recovered this design from the exploratory timeout pool.
 if(!selected&&id===183){const attempt=1781,seed=(0x356de927^Math.imul(id,2654435761)^Math.imul(attempt,2246822519))>>>0,level=candidate(profile,seed,id);selected=qualify(level,solve(level,simulateState,{maxStates:800000,maxMs:30000}),'replace',{seed,attempt,origin:'complete reproof of bounded-search candidate'});}
 if(!selected)selected=qualify(JSON.parse(JSON.stringify(levels[id-1])),solve(levels[id-1],simulateState),'retain',{origin:id});
 for(let attempt=1;!selected&&attempt<=15000;attempt++){
  if(attempt%250===0)console.log(`SEARCH ${name} ${id}: ${attempt}`);
  const seed=(0x356de927^Math.imul(id,2654435761)^Math.imul(attempt,2246822519))>>>0,proposalProfile={...profile,geometry:searchGeometry(profile.geometry,attempt)},level=candidate(proposalProfile,seed,id);let proof=solve(level,simulateState,{maxStates:200000,maxMs:500});
  if(proof.status==='unproven'&&attempt%16===0)proof=solve(level,simulateState,{maxStates:800000,maxMs:30000});
  if(stage>=3&&attempt%2===0){
   const base=candidate({...proposalProfile,anchors:0,suitGates:chapter===5?profile.suitGates:0,colorGates:0},seed,id),basis=solve(base,simulateState,{maxStates:200000,maxMs:500});
   if(basis.status==='solved'){base.solution=basis.route;for(const guided of guidePermissions(base,simulateState,field)){
    selected=qualify(guided,solve(guided,simulateState,{maxStates:800000,maxMs:30000}),'replace',{seed,attempt,profile:proposalProfile,origin:'witness-guided exact stop and permission blocker'});
    if(!selected&&chapter===5&&!permissionDependencies(guided,simulateState,field).permitted.length){
     for(const passage of guideMatchingPermissions(guided,simulateState,field).slice(0,8)){
      selected=qualify(passage,solve(passage,simulateState,{maxStates:800000,maxMs:30000}),'replace',{seed,attempt,profile:proposalProfile,origin:'witness-guided stopper plus actual matching passage'});if(selected)break;
     }
    }
    if(selected)break;
   }}
  }
  if(selected)break;
  if(proof.status!=='solved'||proof.optimum<band[0]||proof.optimum>band[1])continue;
  selected=qualify(level,solve(level,simulateState,{maxStates:800000,maxMs:30000}),'replace',{seed,attempt,profile:proposalProfile});
 }
 if(!selected)throw new Error(`No qualified ${name} ${id}; keep checkpoint; do not relax gates automatically`);
 rows.push(selected);prior.push(selected.level);keys.add(canonical(selected.level));if(local>=46)ideas.add(selected.dependencies.idea);
 fs.writeFileSync(file,JSON.stringify(rows,null,2));console.log(`PROPOSED ${name} ${id}: ${selected.decision}, ${selected.level.optimal} moves, ${selected.dependencies.connections.length} connected permissions`);
}
console.log(`50 ${name} proposals; author review mandatory`);
