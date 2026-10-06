'use strict';
// Deterministic offline suggestions only. Proof is not individual author acceptance.
function linkedProfile(local){
 if(!Number.isInteger(local)||local<1||local>50)throw new Error('Expected local slot 1–50');
 const stage=local<=5?0:local<=15?1:local<=30?2:local<=45?3:4;
 return {size:stage<2?5:6,pieces:stage<2?2:stage===2&&local%3!==0?2:3,rocks:stage===0?3:stage===1?4:stage===2?5:7+local%3,anchors:local<=5?0:1,links:local>=31&&[40,45,49].includes(local)?2:1,suitGates:local>=16&&local%4===0?1:0,colorGates:local>=16&&local%4===1?1:0,rails:local>=16&&local%4===2?1:0,turners:local>=16&&local%4===3?1:0,requiredState:local===36?'closed-launch':local===43?'delayed-opening':null,geometry:['lanes','crossing','corners','scattered'][local%4]};
}
function search(){
 const fs=require('node:fs'),path=require('node:path'),{loadCampaign}=require('./runtime.cjs'),{candidate,searchGeometry}=require('./candidates.cjs'),{solve}=require('./solve.cjs'),{canonical,nearClones}=require('./fingerprint.cjs'),{linkedDependencies,linkedFailures,linkedCurriculumFailures}=require('./linked-review.cjs');
 const {guideLinkedPassages,guideClosedDoors}=require('./guided-linked.cjs'),{chooseAuthoredRoute}=require('./authored-route.cjs');
 const root=path.resolve(__dirname,'../..'),{levels,simulateState}=loadCampaign(root),baseline=require('../../docs/campaign/baseline.json'),accepted=require('../../docs/campaign/acceptance.json').records;
 if(accepted.filter(r=>r.chapter===6).length!==50)throw new Error('Accept all 50 Copperline boards before Stormswitch authoring');
 const file=path.join(root,'test-artifacts/campaign/stormswitch-proposals.json'),saved=fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):[],rows=[],prior=levels.slice(0,300),keys=new Set(prior.map(l=>canonical(l))),ideas=new Set();
 fs.mkdirSync(path.dirname(file),{recursive:true});
 for(let local=1;local<=50;local++){
  const id=300+local,profile=linkedProfile(local),stage=local<=5?0:local<=15?1:local<=30?2:local<=45?3:4,band=[[3,6],[5,10],[7,13],[10,18],[12,22]][stage];let selected;
  const qualify=(level,proof,decision,provenance={})=>{
   if(proof.status!=='solved'||proof.optimum<band[0]||proof.optimum>band[1])return null;
   Object.assign(level,{optimal:proof.optimum,solution:chooseAuthoredRoute(level,proof,simulateState,provenance.authoredRoute),moveLimit:proof.optimum+baseline.margins[id-1],difficultyScore:proof.optimum});
   if(local<=5&&['anchors','suitGates','colorGates','rails','turners'].some(f=>level[f].length))return null;
   if(local<=15&&['suitGates','colorGates','rails','turners'].some(f=>level[f].length))return null;
   const d=linkedDependencies(level,simulateState);
   if(profile.requiredState&&!d.connections.some(w=>w.type===profile.requiredState))return null;
   if(keys.has(canonical(level))||linkedFailures(level,simulateState,ideas).length)return null;
   return{level,proof,decision,profile,dependencies:d,similarities:nearClones(level,prior),reviewStatus:'pending individual author/visual review',...provenance};
  };
  const checkpoint=saved.find(r=>r.level.id===id);if(checkpoint)selected=qualify(checkpoint.level,solve(checkpoint.level,simulateState),checkpoint.decision,{origin:checkpoint.origin||id,profile:checkpoint.profile||profile,seed:checkpoint.seed,attempt:checkpoint.attempt,...(checkpoint.authoredRoute?{authoredRoute:checkpoint.authoredRoute}:{})});
  if(!selected)selected=qualify(structuredClone(levels[id-1]),solve(levels[id-1],simulateState),'retain',{origin:id});
  for(let attempt=1;!selected&&attempt<=15000;attempt++){
   if(attempt%250===0)console.log(`SEARCH stormswitch ${id}: ${attempt}`);
   const seed=(0x42db918b^Math.imul(id,2654435761)^Math.imul(attempt,2246822519))>>>0,p={...profile,geometry:searchGeometry(profile.geometry,attempt)},level=candidate(p,seed,id);
   const proof=solve(level,simulateState,{maxStates:200000,maxMs:500});
   if(proof.status==='solved'&&proof.optimum>=band[0]&&proof.optimum<=band[1])selected=qualify(level,solve(level,simulateState),'replace',{seed,attempt,profile:p});
   if(selected)break;
   if(attempt%4===0){
    const base=candidate({...p,links:0},seed,id),basis=solve(base,simulateState,{maxStates:200000,maxMs:500});
    if(basis.status!=='solved')continue;base.solution=basis.route;
    for(const opened of guideLinkedPassages(base,simulateState).slice(0,12)){
     const variants=profile.requiredState?[...guideClosedDoors(opened,simulateState),opened]:[opened,...guideClosedDoors(opened,simulateState).slice(0,3)];
     for(const proposal of variants){
      const independent=solve(proposal,simulateState),authoredRoute=independent.status==='solved'&&proposal.solution.length===independent.optimum?proposal.solution:undefined;
      selected=qualify(proposal,independent,'replace',{seed,attempt,profile:p,origin:'actual linked passage and closed launch guidance',...(authoredRoute?{authoredRoute}:{})});if(selected)break;
     }
     if(selected)break;
    }
   }
  }
  if(!selected)throw new Error(`No qualified Stormswitch ${id}; preserve checkpoint, do not relax evidence`);
  rows.push(selected);prior.push(selected.level);keys.add(canonical(selected.level));if(local>=46)ideas.add(selected.dependencies.idea);
  fs.writeFileSync(file,JSON.stringify(rows,null,2));console.log(`PROPOSED stormswitch ${id}: ${selected.decision}, ${selected.level.optimal} inputs, ${selected.dependencies.connections.map(w=>w.type).join('/')}`);
 }
 const errors=linkedCurriculumFailures(rows.map(r=>r.level),simulateState);if(errors.length)throw new Error(errors.join('; '));
 console.log('50 Stormswitch proposals; individual author review mandatory');
}
if(require.main===module)search();
module.exports={linkedProfile};
