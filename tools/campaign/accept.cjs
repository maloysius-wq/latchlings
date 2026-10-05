'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {loadCampaign}=require('./runtime.cjs'),{canonical}=require('./fingerprint.cjs'),{reviewLevel,validateRecord,focusForChapter,mechanicClasses}=require('./review.cjs');
const {exportChapter}=require('./export.cjs');
const {cooperation,cooperationFailures}=require('./candidates.cjs');
const {anchorDependencies,anchorFailures}=require('./anchor-review.cjs');
const stageFor=id=>{const local=(id-1)%50+1;if(id>=351)return local<=10?'expert-pairs':local<=25?'expert-triples':local<=40?'future-states':local<=45?'expert-interactions':local<50?'culmination':'finale';return local<=5?'intro':local<=15?'practice':local<=30?'combine':local<=45?'planning':'capstone';};

/** Freshly verify proof and witnesses; stored success flags cannot certify a board. */
function acceptCampaign(root,{chapter=null}={}){
 if(chapter!==null&&(!Number.isInteger(chapter)||chapter<2||chapter>8))throw new Error('Expected chapter 2–8');
 const {levels,simulateState}=loadCampaign(root),baseline=JSON.parse(fs.readFileSync(path.join(root,'docs/campaign/baseline.json'),'utf8'));
 const manifestFile=path.join(root,'docs/campaign/acceptance.json'),records=fs.existsSync(manifestFile)?JSON.parse(fs.readFileSync(manifestFile,'utf8')).records:[];
 const failures=[],seen=new Map(),capstoneMotifs=new Set(),anchorIdeas=new Set(),selected=levels.filter(l=>l.chapter>1&&(!chapter||l.chapter===chapter));let reviewed=0,proven=0,helperRequiredCount=0;
 const fail=(id,message)=>failures.push({id,message});
 const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'campaign400-1.js'))).digest('hex').toUpperCase();
 if(hash!==baseline.chapter1Sha256)fail(1,'Chapter 1 bytes changed');
 if(levels.length!==400||levels.some((l,i)=>l.id!==i+1))fail(0,'Campaign must retain 400 numbered slots');
 for(const level of levels.filter(l=>!chapter||l.chapter<=chapter)){
  const key=canonical(level);if(seen.has(key)&&level.chapter>1&&(!chapter||level.chapter===chapter))fail(level.id,`Canonical duplicate of ${seen.get(key)}`);else seen.set(key,level.id);
 }
 for(const level of selected){
  const record=records.find(r=>r.id===level.id);if(!record){fail(level.id,'Missing review record');continue;}
  reviewed++;for(const error of validateRecord(level,record,baseline,[]))fail(level.id,error);
  if(record.stage!==stageFor(level.id))fail(level.id,'Incorrect learning stage');
  const fresh=reviewLevel(level,simulateState,{...record.proof?.settings,focus:record.focus});
  if(fresh.proof.status!=='solved'||fresh.proof.optimum!==level.optimal)fail(level.id,'Fresh shortest proof failed');else proven++;
  if(!fresh.comparisons.authoredSolved)fail(level.id,'Actual authored replay incomplete');
  for(const focus of record.focus||[])if(!fresh.witnesses.some(w=>w.mechanic===focus))fail(level.id,`Focus ${focus} lacks fresh reachable evidence`);
  if(level.chapter===2){
   for(const error of cooperationFailures(level,simulateState,capstoneMotifs))fail(level.id,error);
   if(level.id>=96)capstoneMotifs.add(cooperation(level,simulateState).motif);
   const restricted=fresh.comparisons.noHelper;
   if(restricted.status==='unproven')fail(level.id,'Restricted helper search unproven');
   else if(restricted.status!=='solved')helperRequiredCount++;
   else if(restricted.optimum<=level.optimal&&!record.contrastWith?.length)fail(level.id,'Optimal helper bypass');
  }
  if(level.chapter===3){
   for(const error of anchorFailures(level,simulateState,anchorIdeas))fail(level.id,error);
   if(level.id>=146)anchorIdeas.add(anchorDependencies(level,simulateState).idea);
  }
  const local=(level.id-1)%50+1,forbidden=({2:['anchors','suitGates','colorGates','rails','turners','switches','doors'],3:['suitGates','colorGates','rails','turners','switches','doors'],4:['colorGates','rails','turners','switches','doors'],5:['rails','turners','switches','doors'],6:['switches','doors']})[level.chapter]||[];
  for(const field of forbidden)if(level[field].length)fail(level.id,`Untaught ${field}`);
  if(level.chapter===6&&local<=5&&level.turners.length)fail(level.id,'Premature turner before Level 256');
  if(level.chapter===6&&local>=6&&local<=8&&!fresh.witnesses.some(w=>w.mechanic==='turners'&&w.effect==='intended-trajectory'))fail(level.id,'Missing introductory turner bend');
  if(level.size<5||level.size>7||level.pieces.length>4)fail(level.id,'Unsupported board size/piece count');
  if(level.id===366&&level.size!==7)fail(level.id,'Lost dense Level 366 stress board');
  if(level.id===400&&(mechanicClasses(fresh.witnesses).size<3||!fresh.witnesses.some(w=>w.mechanic==='helpers')||!level.switches.length))fail(level.id,'Finale lacks staged cooperation/state synthesis');
  const bands={intro:[3,6],practice:[5,10],combine:[7,13],planning:[10,18],capstone:[12,22]},band=bands[record.stage]||[12,26];
  if((level.optimal<band[0]||level.optimal>band[1])&&!record.rationale?.trim())fail(level.id,'Missing numeric pacing exception rationale');
  const source=path.join(root,`docs/campaign/authoring/chapter-${level.chapter}.json`);
  if(!fs.existsSync(source))fail(level.id,'Missing deterministic authoring source');
 }
 if((!chapter||chapter===2)&&selected.some(l=>l.chapter===2)&&helperRequiredCount<40)fail(2,`Only ${helperRequiredCount}/50 helper-required boards`);
 for(const ch of [...new Set(selected.map(l=>l.chapter))]){
  const file=path.join(root,`docs/campaign/authoring/chapter-${ch}.json`);if(!fs.existsSync(file))continue;
  const authored=JSON.parse(fs.readFileSync(file,'utf8'));if(exportChapter(authored,ch)!==fs.readFileSync(path.join(root,`campaign400-${ch}.js`),'utf8').replace(/\r\n/g,'\n'))fail(ch,'Static export differs from authored source');
 }
 return {reviewed,proven,helperRequiredCount,failures};
}
if(require.main===module){
 const index=process.argv.indexOf('--chapter'),chapter=index<0?null:Number(process.argv[index+1]),root=path.resolve(__dirname,'../..');
 const report=acceptCampaign(root,{chapter}),dir=path.join(root,'test-artifacts/campaign');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,chapter?`chapter-${chapter}.json`:'all.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({...report,failures:report.failures.slice(0,15),failureCount:report.failures.length},null,2));process.exitCode=report.failures.length?1:0;
}
module.exports={acceptCampaign,stageFor};
