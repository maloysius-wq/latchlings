'use strict';
// Build review inputs in memory. This module never edits campaign files or approves a design.
const {canonical,nearClones}=require('./fingerprint.cjs');
const {reviewLevel,validateRecord,focusForChapter}=require('./review.cjs');
const {exportChapter}=require('./export.cjs');
const {stageFor}=require('./accept.cjs');
const {cooperation,cooperationFailures}=require('./candidates.cjs');
function prepareChapter(levels,notes,baseline,simulateState,{previous=[],existingRecords=[],visualEvidence={status:'pending'}}={}){
 if(levels.length!==50)throw new Error('Preparation requires 50 reviewed slots');
 const chapter=levels[0].chapter,exported=exportChapter(levels,chapter),records=[],keys=new Set(previous.map(l=>canonical(l))),capstoneMotifs=new Set();
 // Check every annotation before running expensive proof; no generic stamp is generated.
 for(const level of levels){const note=notes[level.id],intention=typeof note==='string'?note:note?.intention;
  if(typeof intention!=='string'||intention.trim().length<15||/pending/i.test(intention))throw new Error(`Missing reviewed intention for ${level.id}`);
 }
 for(const level of levels){
  const note=typeof notes[level.id]==='string'?{intention:notes[level.id]}:notes[level.id];
  const key=canonical(level);if(keys.has(key))throw new Error(`Duplicate board ${level.id}`);
  const similarities=nearClones(level,[...previous,...levels.filter(l=>l.id<level.id)]);
  if(similarities.length&&!note.nearCloneReview)throw new Error(`Unreviewed similarities for ${level.id}`);
  const focus=note.focus||focusForChapter(chapter),fresh=reviewLevel(level,simulateState,{focus,maxStates:800000,maxMs:30000});
  if(fresh.proof.status!=='solved'||fresh.proof.optimum!==level.optimal)throw new Error(`Unproven optimum for ${level.id}`);
  if(chapter===2){const errors=cooperationFailures(level,simulateState,capstoneMotifs);if(errors.length)throw new Error(`${level.id}: ${errors.join('; ')}`);if(level.id>=96)capstoneMotifs.add(cooperation(level,simulateState).motif);}
  const witnesses=fresh.witnesses.filter(w=>focus.includes(w.mechanic)||w.mechanic==='helpers').map(({mechanic,prefix,state,move,effect})=>({mechanic,prefix,state,move,effect}));
  const {elapsedMs,route,...proof}=fresh.proof;
  const comparisons={...fresh.comparisons,similarityReviewed:true,similarities,nearCloneReview:note.nearCloneReview||'No terrain or route near-clone flags; distinct board-specific dependency reviewed.'};
  if(comparisons.noHelper){const {elapsedMs,route,...restricted}=comparisons.noHelper;comparisons.noHelper=restricted;}
  if(chapter===2){const d=cooperation(level,simulateState);comparisons.cooperation={motif:d.motif,captureOrder:d.captureOrder,participants:d.participants,relocations:d.relocations,beforeFirstCapture:d.beforeFirstCapture};}
  const record={id:level.id,chapter,local:(level.id-1)%50+1,stage:stageFor(level.id),intention:note.intention,prerequisites:note.prerequisites||['edges','rocks','basic helpers'],focus,decision:note.decision||'replace',baselineMargin:baseline.margins[level.id-1],canonical:key,proof,witnesses,comparisons,contrastWith:note.contrastWith||[],rationale:note.rationale||'',visualEvidence};
  const errors=validateRecord(level,record,baseline,[]);if(errors.length)throw new Error(`${level.id}: ${errors.join('; ')}`);
  records.push(record);keys.add(key);
 }
 return{authoring:levels,manifest:{records:[...existingRecords.filter(r=>r.chapter!==chapter),...records].sort((a,b)=>a.id-b.id)},exported};
}
function patchFor(files){
 const lines=s=>s.replace(/\r\n/g,'\n').replace(/\n$/,'').split('\n');let patch='*** Begin Patch\n';
 for(const file of files){const next=lines(file.content);
  if(file.old===null){patch+=`*** Add File: ${file.path}\n`+next.map(l=>'+'+l).join('\n')+'\n';continue;}
  const prior=lines(file.old);let prefix=0,suffix=0;
  while(prefix<prior.length&&prefix<next.length&&prior[prefix]===next[prefix])prefix++;
  if(prefix===prior.length&&prefix===next.length)continue;
  while(suffix<prior.length-prefix&&suffix<next.length-prefix&&prior[prior.length-1-suffix]===next[next.length-1-suffix])suffix++;
  patch+=`*** Update File: ${file.path}\n@@\n`+(prefix?' '+prior[prefix-1]+'\n':'')+prior.slice(prefix,prior.length-suffix).map(l=>'-'+l+'\n').join('')+next.slice(prefix,next.length-suffix).map(l=>'+'+l+'\n').join('')+(suffix?' '+prior[prior.length-suffix]+'\n':'');
 }
 return patch+'*** End Patch';
}
module.exports={prepareChapter,patchFor};
