'use strict';
// Candidate proposals only. Does not certify, export or modify game assets.
const fs=require('node:fs'),path=require('node:path');
const {loadCampaign}=require('./runtime.cjs'),{solve}=require('./solve.cjs'),{canonical,nearClones}=require('./fingerprint.cjs'),{candidate,cooperation,fitsCooperation}=require('./candidates.cjs');
const root=path.resolve(__dirname,'../..'),{levels,simulateState}=loadCampaign(root),baseline=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/baseline.json'),'utf8'));
const out=path.join(root,'test-artifacts/campaign/lanternwood-proposals.json');fs.mkdirSync(path.dirname(out),{recursive:true});
const prior=levels.slice(0,50),accepted=[],proposals=fs.existsSync(out)?JSON.parse(fs.readFileSync(out,'utf8')):[];
for(const row of proposals)accepted.push(row.level);
const persist=()=>fs.writeFileSync(out,JSON.stringify(proposals,null,2));
const keys=new Set([...prior,...accepted].map(l=>canonical(l))),terrains=new Set(accepted.map(l=>canonical(l,{terrainOnly:true})));
const limitIndex=process.argv.indexOf('--limit'),limit=limitIndex<0?50:Number(process.argv[limitIndex+1]);
for(let local=proposals.length+1;local<=limit;local++){
 const stage=local<=5?0:local<=15?1:local<=30?2:local<=45?3:4;
 const profile={size:stage===0?5:stage===1?(local%3===0?6:5):stage===2?6:stage===3&&(local<=35||local%2===0)?6:7,pieces:stage<2?2:local%4===0&&stage===2?2:3,rocks:stage===0?3+local%3:stage===1?5+local%4:stage===2?6+local%5:8+local%6,geometry:['lanes','corners','crossing','scattered'][local%4],minMoves:[3,5,7,10,14][stage],maxMoves:[6,10,13,18,22][stage],minStops:[1,2,3,4,5][stage],minTravelers:stage>=2?2:1,minRelocations:stage===0?0:stage===1?1:2,minBeforeCapture:stage>=3?3:stage>=1?2:1,roleSwap:stage===1&&local>=11};
 const id=50+local;let selected=null;const rejected={unproven:0,unsolvable:0,length:0,cooperation:0,duplicate:0,bypass:0};
 for(let attempt=1;attempt<=10000;attempt++){
  const seed=(0x9e3779b9^Math.imul(id,2654435761)^Math.imul(attempt,2246822519))>>>0,lev=candidate(profile,seed,id);
  if(attempt%200===0)console.log(`SEARCH ${id}, attempt ${attempt}: ${JSON.stringify(rejected)}`);
  const proof=solve(lev,simulateState,{maxStates:200000,maxMs:500});
  if(proof.status!=='solved'){rejected[proof.status==='unproven'?'unproven':'unsolvable']++;continue;}
  if(proof.optimum<profile.minMoves||proof.optimum>profile.maxMoves){rejected.length++;continue;}
  lev.solution=proof.route;lev.optimal=proof.optimum;lev.moveLimit=proof.optimum+baseline.margins[id-1];lev.difficultyScore=proof.optimum;
  const deps=cooperation(lev,simulateState);if(!fitsCooperation(deps,profile)){rejected.cooperation++;continue;}
  const key=canonical(lev),terrain=canonical(lev,{terrainOnly:true});if(keys.has(key)||terrains.has(terrain)){rejected.duplicate++;continue;}
  const restricted=solve(lev,simulateState,{maxStates:200000,maxMs:2000,maxDepth:lev.moveLimit,forbidHelperStops:true});
  if(restricted.status==='unproven'||restricted.status==='solved'){rejected.bypass++;continue;}
  const full=solve(lev,simulateState,{maxStates:800000,maxMs:30000});if(full.status!=='solved'||full.optimum!==lev.optimal)continue;
  selected={level:lev,seed,attempt,profile,proof:full,restricted,dependencies:deps,similarities:nearClones(lev,[...prior,...accepted]),reviewStatus:'pending author visual/dependency review'};keys.add(key);terrains.add(terrain);break;
 }
 if(!selected){console.error(`No qualified proposal for Level ${id}; retain checkpoint, do not relax gates automatically`);process.exitCode=1;break;}
 proposals.push(selected);accepted.push(selected.level);persist();console.log(`PROPOSED ${id}: ${selected.level.optimal} moves, ${selected.dependencies.stops.length} helper stops, ${selected.dependencies.relocations} relocated stops; ${selected.attempt} candidates`);
}
console.log(`Proposals ${proposals.length}/50; author review pending; ${out}`);
