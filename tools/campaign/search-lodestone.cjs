'use strict';
// Offline proposals, including sound retained boards; never certifies or exports a chapter.
const fs=require('node:fs'),path=require('node:path');
const {loadCampaign}=require('./runtime.cjs'),{solve}=require('./solve.cjs'),{canonical,nearClones}=require('./fingerprint.cjs'),{candidate}=require('./candidates.cjs'),{anchorDependencies,anchorFailures}=require('./anchor-review.cjs');
const root=path.resolve(__dirname,'../..'),{levels,simulateState}=loadCampaign(root),baseline=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/baseline.json'))),file=path.join(root,'test-artifacts/campaign/lodestone-proposals.json');
const rows=fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):[],prior=[...levels.slice(0,100),...rows.map(r=>r.level)],ideas=new Set(rows.filter(r=>r.level.id>=146).map(r=>anchorDependencies(r.level,simulateState).idea));
const keys=new Set(prior.map(l=>canonical(l)));fs.mkdirSync(path.dirname(file),{recursive:true});
for(let local=rows.length+1;local<=50;local++){
 const id=100+local,stage=local<=5?0:local<=15?1:local<=30?2:local<=45?3:4,bands=[[3,6],[5,10],[7,13],[10,18],[12,22]],profile={size:stage<2?5:6,pieces:stage<2?2:stage===2&&(local<=20||local%4===0)?2:3,rocks:stage<2?4:stage===2?6+local%3:8+local%3,anchors:stage<2?1:stage===2?2:2+local%2,geometry:['corners','lanes','crossing','scattered'][local%4]};let selected;
 const qualify=(level,proof,decision,metadata={})=>{
  if(proof.status!=='solved'||proof.optimum<bands[stage][0]||proof.optimum>bands[stage][1])return null;
  Object.assign(level,{optimal:proof.optimum,solution:proof.route,moveLimit:proof.optimum+baseline.margins[id-1],difficultyScore:proof.optimum});
  if(keys.has(canonical(level))||anchorFailures(level,simulateState,ideas).length)return null;
  return{level,proof,decision,profile,...metadata,dependencies:anchorDependencies(level,simulateState),similarities:nearClones(level,prior),reviewStatus:'pending individual author/visual review'};
 };
 const original=JSON.parse(JSON.stringify(levels[id-1]));
 // Reuse is a design option, not a shortcut around proof or causal integration.
 if(!anchorFailures(original,simulateState,ideas).length)selected=qualify(original,solve(original,simulateState,{maxStates:800000,maxMs:30000}),'retain',{origin:id});
 for(let attempt=1;!selected&&attempt<=15000;attempt++){
  if(attempt%250===0)console.log(`SEARCH anchor ${id}: ${attempt}`);
  const seed=(0x1f3d6a29^Math.imul(id,2654435761)^Math.imul(attempt,2246822519))>>>0,level=candidate(profile,seed,id),explore=solve(level,simulateState,{maxStates:200000,maxMs:500});
  if(explore.status!=='solved'||explore.optimum<bands[stage][0]||explore.optimum>bands[stage][1])continue;
  level.solution=explore.route;if(anchorFailures(level,simulateState,ideas).length)continue;
  selected=qualify(level,solve(level,simulateState,{maxStates:800000,maxMs:30000}),'replace',{seed,attempt});
 }
 if(!selected)throw new Error(`No qualified Lodestone ${id}; checkpoint retained, do not relax gates automatically`);
 rows.push(selected);prior.push(selected.level);keys.add(canonical(selected.level));if(local>=46)ideas.add(selected.dependencies.idea);
 fs.writeFileSync(file,JSON.stringify(rows,null,2));console.log(`PROPOSED anchor ${id}: ${selected.decision}, ${selected.level.optimal} moves, ${selected.dependencies.connections.length} causal anchor/helper links`);
}
console.log('50 Lodestone proposals; author review is still mandatory');
