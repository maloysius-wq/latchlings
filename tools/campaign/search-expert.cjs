'use strict';
// One deterministic offline proposal writer; no runtime generation or auto-acceptance.
function expertProfile(local){
 if(!Number.isInteger(local)||local<1||local>50)throw new Error('Expected local slot 1–50');
 const p={size:local===16||local===50?7:6,pieces:local<=10?2:3,rocks:local<=10?5+local%3:local===16?10:7+local%3,anchors:0,suitGates:0,colorGates:0,rails:0,turners:0,links:0,requiredState:null,geometry:['lanes','crossing','corners','scattered'][local%4]};
 if(local<=10){const f=['anchors','suitGates','colorGates','rails','turners','links'][(local-1)%6];p[f]=f==='links'?1:2;return p;}
 p.anchors=1;
 if(local<=25){const fields=[['suitGates','colorGates'],['rails','turners'],['suitGates','rails'],['colorGates','turners'],['links','rails']][local%5];for(const f of fields)p[f]=1;}
 else if(local<=40){p.suitGates=1;p.colorGates=1;if(local%2)p.links=1;else{p.rails=1;p.turners=1;}}
 else{const fields=[['suitGates','colorGates','rails'],['links','turners'],['colorGates','rails','turners'],['links','suitGates'],['suitGates','colorGates','turners']][local%5];for(const f of fields)p[f]=1;}
 if(local===27||local===34){p.links=1;p.requiredState=local===27?'closed-launch':'delayed-opening';}
 if(local===50){p.links=1;p.suitGates=0;p.colorGates=1;p.rails=1;p.turners=0;}
 if(p.suitGates&&p.colorGates)p.identity=local%2?'shared-color':'shared-suit';
 return p;
}
function expertRoute(level,proof,simulateState){
 const authored=level.solution?.length===proof.optimum?level.solution:undefined;
 return require('./authored-route.cjs').chooseAuthoredRoute(level,proof,simulateState,authored);
}
function search(){
 const fs=require('node:fs'),path=require('node:path'),{loadCampaign}=require('./runtime.cjs'),{candidate,searchGeometry}=require('./candidates.cjs'),{solve}=require('./solve.cjs'),{canonical,nearClones}=require('./fingerprint.cjs'),{expertDependencies,expertFailures,expertEvidenceFailures}=require('./expert-review.cjs'),{anchorPaddingFailures}=require('./anchor-padding.cjs');
 const {guideTurns,guideRailBlockers}=require('./guided-routing.cjs'),{guideLinkedPassages,guideClosedDoors}=require('./guided-linked.cjs');
 const root=path.resolve(__dirname,'../..'),{levels,simulateState}=loadCampaign(root),baseline=require('../../docs/campaign/baseline.json'),records=require('../../docs/campaign/acceptance.json').records;
 if(records.filter(r=>r.chapter===7).length!==50)throw new Error('Accept all50 Stormswitch boards before Aurora authoring');
 const file=path.join(root,'test-artifacts/campaign/aurora-proposals.json'),saved=fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):[],rows=[],prior=levels.slice(0,350),keys=new Set(prior.map(l=>canonical(l))),ideas=new Set();
 fs.mkdirSync(path.dirname(file),{recursive:true});
 for(let local=1;local<=50;local++){
  const id=350+local,profile=expertProfile(local),band=local<=10?[12,18]:local<=25?[12,22]:local<=40?[14,26]:local===50?[18,26]:[16,26];let selected;
  const qualify=(level,proof,decision,origin)=>{
   if(proof.status!=='solved'||proof.optimum<band[0]||proof.optimum>band[1])return null;
   Object.assign(level,{optimal:proof.optimum,solution:expertRoute(level,proof,simulateState),moveLimit:proof.optimum+baseline.margins[id-1],difficultyScore:proof.optimum});
   if(keys.has(canonical(level))||expertFailures(level,simulateState,ideas).length)return null;
   const d=expertDependencies(level,simulateState);if(profile.requiredState&&!d.linked.connections.some(w=>w.type===profile.requiredState))return null;
   if(local<=10&&(level.pieces.length!==2||['anchors','suitGates','colorGates','rails','turners','switches'].filter(f=>level[f].length).length!==1))return null;
   return{level,proof,decision,profile,dependencies:d,similarities:nearClones(level,prior),origin,reviewStatus:'pending individual author and phone review'};
  };
  const checkpoint=saved.find(r=>r.level.id===id);if(checkpoint)selected=qualify(checkpoint.level,solve(checkpoint.level,simulateState),checkpoint.decision,checkpoint.origin);
  if(!selected)selected=qualify(structuredClone(levels[id-1]),solve(levels[id-1],simulateState),'retain',{historical:id});
  const guided=(level,origin)=>{
   if(level.solution.length<band[0])return null;
   const d=expertDependencies(level,simulateState);
   if(expertEvidenceFailures(level,d,ideas).length||anchorPaddingFailures(level,simulateState).length||profile.requiredState&&!d.linked.connections.some(w=>w.type===profile.requiredState))return null;
   return qualify(level,solve(level,simulateState),'replace',origin);
  };
  for(let attempt=1;!selected&&attempt<=15000;attempt++){
   if(attempt%250===0)console.log(`SEARCH aurora ${id}: ${attempt}`);
   const seed=(0x71a9f04d^Math.imul(id,2654435761)^Math.imul(attempt,2246822519))>>>0,p={...profile,geometry:searchGeometry(profile.geometry,attempt)},level=candidate(p,seed,id),quick={maxStates:200000,maxMs:500},proof=solve(level,simulateState,quick);
   if(proof.status==='solved'&&proof.optimum>=band[0]&&proof.optimum<=band[1]){level.solution=proof.route;selected=guided(level,{seed,attempt,kind:'bounded deterministic suggestion'});}
   if(selected)break;
   if(p.links&&attempt%4===0){
    const base=candidate({...p,links:0},seed,id),basis=solve(base,simulateState,quick);
    if(basis.status==='solved'){base.solution=basis.route;for(const opened of guideLinkedPassages(base,simulateState).slice(0,10)){
     const variants=p.requiredState?[...guideClosedDoors(opened,simulateState),opened]:[opened,...guideClosedDoors(opened,simulateState).slice(0,3)];
     for(const v of variants){selected=guided(v,{seed,attempt,kind:'actual state-passage/closure guidance'});if(selected)break;}if(selected)break;
    }}
   }
   if(!selected&&p.turners&&attempt%4===2){
    const base=candidate({...p,turners:0,rails:0},seed,id),basis=solve(base,simulateState,quick);
    if(basis.status==='solved'){base.solution=basis.route;for(const turn of guideTurns(base,simulateState).slice(0,4)){
     for(const v of p.rails?guideRailBlockers(turn,simulateState).slice(0,6):[turn]){selected=guided(v,{seed,attempt,kind:'actual continuous-bend guidance'});if(selected)break;}if(selected)break;
    }}
   }
  }
  if(!selected)throw new Error(`No qualified Aurora ${id}; preserve checkpoint, do not relax mastery evidence`);
  rows.push(selected);prior.push(selected.level);keys.add(canonical(selected.level));if(local>=41)ideas.add(selected.dependencies.idea);
  fs.writeFileSync(file,JSON.stringify(rows,null,2));console.log(`PROPOSED aurora ${id}: ${selected.decision}, ${selected.level.optimal} inputs, ${selected.dependencies.classes.join('/')}, future:${selected.dependencies.futureState}`);
 }
 console.log('50 Aurora suggestions; individual final-ten author/phone and human playtesting review still required');
}
if(require.main===module)search();
module.exports={expertProfile,expertRoute};
