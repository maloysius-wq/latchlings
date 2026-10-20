'use strict';
(function(){
 const FORMAT='latchlings-progress',VERSION=1;
 const KNOWN_FILMS=()=>Object.keys(window.LatchlingsCinematics?.CINEMATICS||{});
 const isRecord=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
 function exactKeys(value,keys,label){
  if(!isRecord(value))throw new Error(`${label} must be an object`);
  const actual=Object.keys(value);
  if(actual.length!==keys.length||actual.some(key=>!keys.includes(key)))throw new Error(`${label} has unsupported fields`);
 }
 function normalizeProgress(value){
  exactKeys(value,['unlocked','stars'],'Campaign progress');
  if(!Number.isInteger(value.unlocked)||value.unlocked<1||value.unlocked>400)throw new Error('Unlocked level must be between 1 and 400');
  if(!isRecord(value.stars))throw new Error('Campaign stars must be an object');
  const stars={};
  for(const [key,count] of Object.entries(value.stars)){
   if(!/^(?:[1-9]|[1-9]\d|[1-3]\d\d|400)$/.test(key))throw new Error(`Invalid star level: ${key}`);
   const level=Number(key);
   if(level>value.unlocked)throw new Error(`Stars cannot be recorded beyond unlocked Level ${value.unlocked}`);
   if(!Number.isInteger(count)||count<1||count>3)throw new Error(`Level ${level} must have between 1 and 3 stars`);
   stars[String(level)]=count;
  }
  return {unlocked:value.unlocked,stars};
 }
 function normalizeSeen(value){
  if(!Array.isArray(value))throw new Error('Cinematics must be a list');
  const known=new Set(KNOWN_FILMS());
  const seen=[];
  for(const id of value){
   if(typeof id!=='string'||!known.has(id))throw new Error(`Unknown cinematic: ${String(id)}`);
   if(seen.includes(id))throw new Error(`Duplicate cinematic: ${id}`);
   seen.push(id);
  }
  return seen.sort();
 }
 function normalizeBackup(value){
  exactKeys(value,value?.version===2?['format','version','campaign','cinematics','economy']:['format','version','campaign','cinematics'],'Backup');
  if(value.format!==FORMAT)throw new Error('This is not a Latchlings progress backup');
  if(![1,2].includes(value.version))throw new Error(`Unsupported backup version: ${String(value.version)}`);
  const result={format:FORMAT,version:value.version,campaign:normalizeProgress(value.campaign),cinematics:normalizeSeen(value.cinematics)};
  if(value.version===2)result.economy=normalizeEconomy(value.economy);return result;
 }
 function normalizeEconomy(value){
  const C=window.LatchlingsEconomyCore,w=C.validateWallet(value);
  exactKeys(w,['version','revision','energy','coins','anchorMs','lastObservedMs','accounted','attempt','receipts','importJournal'],'Wallet');
  exactKeys(w.accounted,['campaign','daily'],'Reward ledger');if(w.importJournal!==null)throw new Error('An unfinished import cannot be restored as a target wallet');
  for(const r of Object.values(w.receipts)){exactKeys(r,['id','attemptId','mode','level','daily','stars','moves','coins','delivered'],'Completion receipt');if(r.mode==='daily')exactKeys(r.daily,['key','level','tier'],'Daily identity');else if(r.daily!==null)throw new Error('Campaign receipt has Daily data');}
  if(w.attempt){
   const a=w.attempt,level=window.LEVELS?.[a.level-1];C.validateAttempt(a,level);
   exactKeys(a,['id','revision','mode','level','signature','positions','selected','doorMask','movesUsed','extraMoves','energyPaid','status','daily','pendingMove','paidHint','operations'],'Saved attempt');
   if(a.mode==='daily')exactKeys(a.daily,['key','level','tier'],'Daily identity');
   for(const op of Object.values(a.operations))exactKeys(op,['identity'],'Operation receipt');
   if(a.pendingMove){exactKeys(a.pendingMove,['token','pi','dir','result'],'Pending move');const p=a.pendingMove,result=window.simulateState(level,a.positions,a.doorMask,p.pi,p.dir);if(!result||C.signature(result)!==C.signature(p.result))throw new Error('Invalid pending movement');}
   if(a.paidHint){exactKeys(a.paidHint,['boardKey','pi','dir'],'Paid hint');if(a.paidHint.boardKey===C.boardKey(a)&&!window.simulateState(level,a.positions,a.doorMask,a.paidHint.pi,a.paidHint.dir))throw new Error('Invalid cached hint');}
  }
  return w;
 }
 function create(progress,seen,economy){
  return normalizeBackup(economy===undefined?{format:FORMAT,version:VERSION,campaign:progress,cinematics:seen}:{format:FORMAT,version:2,campaign:progress,cinematics:seen,economy});
 }
 function parse(jsonText){
  if(typeof jsonText!=='string')throw new Error('Backup contents must be text');
  let value;
  try{value=JSON.parse(jsonText)}catch(_){throw new Error('Backup is not valid JSON')}
  const backup=normalizeBackup(value);
  return {progress:backup.campaign,seen:backup.cinematics,economy:backup.economy||null,version:backup.version};
 }
 window.LatchlingsProgressBackup={create,parse};
})();
