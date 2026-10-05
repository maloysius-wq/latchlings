'use strict';
// Focused authoring proposals only; does not change static exports or approve records.
const fs=require('node:fs'),path=require('node:path');
const {loadCampaign}=require('./runtime.cjs'),{solve}=require('./solve.cjs'),{canonical,nearClones}=require('./fingerprint.cjs'),{candidate,cooperation,fitsCooperation}=require('./candidates.cjs');
const root=path.resolve(__dirname,'../..'),{levels,simulateState}=loadCampaign(root),file=path.join(root,'test-artifacts/campaign/lanternwood-proposals.json');
const rows=JSON.parse(fs.readFileSync(file)),baseline=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/baseline.json'))),ids=[52,54,55];
const prior=[...levels.slice(0,50),...rows.filter(r=>!ids.includes(r.level.id)).map(r=>r.level)],replacements=[];
for(const id of ids){
 const profile={size:5,pieces:2,rocks:id===55?5:id===52?4:3,geometry:id===52?'crossing':id===54?'corners':'lanes',minMoves:3,maxMoves:id===55?8:6,minStops:id===52?1:2,minTravelers:id===54?2:1,minRelocations:id===55?2:1,minBeforeCapture:id===52?1:2,roleSwap:id===54};let selected;
 for(let attempt=1;attempt<=20000;attempt++){
  const seed=(0xa53c9871^Math.imul(id,2654435761)^Math.imul(attempt,2246822519))>>>0,level=candidate(profile,seed,id),proof=solve(level,simulateState,{maxStates:800000,maxMs:30000});
  if(attempt%500===0)console.log(`Refinement ${id}, attempt ${attempt}`);
  if(proof.status!=='solved'||proof.optimum<profile.minMoves||proof.optimum>profile.maxMoves)continue;
  Object.assign(level,{solution:proof.route,optimal:proof.optimum,moveLimit:proof.optimum+baseline.margins[id-1],difficultyScore:proof.optimum});
  const dependencies=cooperation(level,simulateState);if(!fitsCooperation(dependencies,profile))continue;
  if(id===52&&dependencies.captureOrder.at(-1)!==dependencies.stops[0].helper)continue;
  if(id===55&&(dependencies.travelers!==1||new Set(dependencies.stops.map(s=>s.helperPosition.join(','))).size<2))continue;
  if(prior.some(l=>canonical(l)===canonical(level)))continue;
  const similarities=nearClones(level,prior);if(similarities.length)continue;
  const restricted=solve(level,simulateState,{maxStates:800000,maxMs:30000,maxDepth:level.moveLimit,forbidHelperStops:true});if(restricted.status==='unproven'||restricted.status==='solved')continue;
  selected={level,profile,seed,attempt,proof,restricted,dependencies,similarities,reviewStatus:'pending focused intro author/visual review'};break;
 }
 if(!selected)throw new Error(`No qualified intro ${id}; no source or proposal checkpoint changed`);
 replacements.push(selected);prior.push(selected.level);console.log(`PROPOSED refinement ${id}: ${selected.level.optimal} moves, ${selected.dependencies.motif}`);
}
const backup=file.replace('.json','-before-intro-refinement.json');if(!fs.existsSync(backup))fs.copyFileSync(file,backup);
fs.writeFileSync(file,JSON.stringify(rows.map(r=>replacements.find(x=>x.level.id===r.level.id)||r),null,2));
console.log('Three proposals refined; author review and static export still required');
