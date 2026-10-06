'use strict';
// Offline suggestions only; importing stage profiles never starts a writer.
function routingProfile(local){
 if(!Number.isInteger(local)||local<1||local>50)throw new Error('Expected local slot 1–50');
 const stage=local<=5?0:local<=15?1:local<=30?2:local<=45?3:4;
 return {size:stage<2?5:6,pieces:stage<2?2:stage===2&&local%3!==0?2:3,rocks:stage===0?3:local<=8?3:stage===1?4:stage===2?5:7+local%3,anchors:local<=8?0:1,rails:local<=8?1:2,turners:local<=5?0:local<=15?1:2,suitGates:stage>=2?1:0,colorGates:stage>=3?1:0,geometry:['lanes','crossing','corners','scattered'][local%4]};
}
function search(){
 const fs=require('node:fs'),path=require('node:path'),{loadCampaign}=require('./runtime.cjs'),{candidate,searchGeometry}=require('./candidates.cjs'),{solve}=require('./solve.cjs'),{canonical,nearClones}=require('./fingerprint.cjs'),{routingDependencies,routingFailures}=require('./routing-review.cjs');
 const {guideTurns,guideMatchingRails,guideRailBlockers}=require('./guided-routing.cjs'),{chooseAuthoredRoute}=require('./authored-route.cjs');
 const root=path.resolve(__dirname,'../..'),{levels,simulateState}=loadCampaign(root),baseline=require('../../docs/campaign/baseline.json'),accepted=require('../../docs/campaign/acceptance.json').records;
 if(accepted.filter(r=>r.chapter===5).length!==50)throw new Error('Accept all 50 Prism boards before starting Copperline authoring');
 const file=path.join(root,'test-artifacts/campaign/copperline-proposals.json'),saved=fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):[],rows=[],prior=levels.slice(0,250),keys=new Set(prior.map(l=>canonical(l))),ideas=new Set();
 fs.mkdirSync(path.dirname(file),{recursive:true});
 for(let local=1;local<=50;local++){
  const id=250+local,profile=routingProfile(local),stage=local<=5?0:local<=15?1:local<=30?2:local<=45?3:4,band=[[3,6],[5,10],[7,13],[10,18],[12,22]][stage];let selected;
  const qualify=(level,proof,decision,provenance={})=>{
   if(proof.status!=='solved'||proof.optimum<band[0]||proof.optimum>band[1])return null;
   Object.assign(level,{optimal:proof.optimum,solution:chooseAuthoredRoute(level,proof,simulateState,provenance.authoredRoute),moveLimit:proof.optimum+baseline.margins[id-1],difficultyScore:proof.optimum});
   if(keys.has(canonical(level))||routingFailures(level,simulateState,ideas).length)return null;
   return{level,proof,decision,profile,dependencies:routingDependencies(level,simulateState),similarities:nearClones(level,prior),reviewStatus:'pending individual author/visual review',...provenance};
  };
  const checkpoint=saved.find(r=>r.level.id===id);if(checkpoint)selected=qualify(checkpoint.level,solve(checkpoint.level,simulateState),checkpoint.decision,{origin:checkpoint.origin||id,profile:checkpoint.profile||profile,seed:checkpoint.seed,attempt:checkpoint.attempt,...(checkpoint.authoredRoute?{authoredRoute:checkpoint.authoredRoute}:{})});
  if(!selected)selected=qualify(JSON.parse(JSON.stringify(levels[id-1])),solve(levels[id-1],simulateState),'retain',{origin:id});
  for(let attempt=1;!selected&&attempt<=15000;attempt++){
   if(attempt%250===0)console.log(`SEARCH copperline ${id}: ${attempt}`);
   const seed=(0x72fa4139^Math.imul(id,2654435761)^Math.imul(attempt,2246822519))>>>0,proposalProfile={...profile,geometry:searchGeometry(profile.geometry,attempt)},level=candidate(proposalProfile,seed,id);let proof=solve(level,simulateState,{maxStates:200000,maxMs:500});
   if(proof.status==='unproven'&&attempt%16===0)proof=solve(level,simulateState,{maxStates:800000,maxMs:30000});
   if(local>=6&&attempt%2===0){
    const base=candidate({...proposalProfile,rails:0,turners:0},seed,id),basis=solve(base,simulateState,{maxStates:200000,maxMs:500});
    if(basis.status==='solved'){
     base.solution=basis.route;
     for(const turn of guideTurns(base,simulateState).slice(0,4)){
      const variants=local<=8?[turn]:guideRailBlockers(turn,simulateState).slice(0,8);
      for(const blocked of variants){
       const passages=routingDependencies(blocked,simulateState).railPassed.length?[blocked]:guideMatchingRails(blocked,simulateState).slice(0,6);
       for(const proposal of passages){
        const independent=solve(proposal,simulateState,{maxStates:800000,maxMs:30000}),authoredRoute=independent.status==='solved'&&proposal.solution.length===independent.optimum?proposal.solution:undefined;
        selected=qualify(proposal,independent,'replace',{seed,attempt,profile:proposalProfile,origin:'witness-guided continuous corner and specific rail entry',...(authoredRoute?{authoredRoute}:{})});if(selected)break;
       }
       if(selected)break;
      }
      if(selected)break;
     }
    }
   }
   if(selected)break;
   if(proof.status==='solved'&&proof.optimum>=band[0]&&proof.optimum<=band[1])selected=qualify(level,solve(level,simulateState,{maxStates:800000,maxMs:30000}),'replace',{seed,attempt,profile:proposalProfile});
  }
  if(!selected)throw new Error(`No qualified Copperline ${id}; keep checkpoint, do not relax gates`);
  rows.push(selected);prior.push(selected.level);keys.add(canonical(selected.level));if(local>=46)ideas.add(selected.dependencies.idea);
  fs.writeFileSync(file,JSON.stringify(rows,null,2));console.log(`PROPOSED copperline ${id}: ${selected.decision}, ${selected.level.optimal} moves, ${selected.dependencies.bends.length} bends, ${selected.dependencies.connections.length} connected routes`);
 }
 console.log('50 Copperline proposals; individual author review mandatory');
}
if(require.main===module)search();
module.exports={routingProfile};
