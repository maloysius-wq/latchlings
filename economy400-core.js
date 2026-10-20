'use strict';
(function(root){
 const CAP=20,INTERVAL=900000,HINT_PRICE=15,MOVES_PRICE=40;
 const copy=value=>JSON.parse(JSON.stringify(value));
 const record=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
 function fail(code,message=code){const error=new Error(message);error.code=code;throw error}
 function integer(value,min=0,max=Number.MAX_SAFE_INTEGER){return Number.isSafeInteger(value)&&value>=min&&value<=max}
 function id(value){return typeof value==='string'&&/^[a-zA-Z0-9_:.-]{1,120}$/.test(value)&&!['__proto__','constructor','prototype'].includes(value)}
 function day(value){if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const date=new Date(value+'T00:00:00Z');return !Number.isNaN(date.getTime())&&date.toISOString().slice(0,10)===value}
 function canonical(value){if(Array.isArray(value))return value.map(canonical);if(record(value))return Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])]));return value}
 const signature=level=>JSON.stringify(canonical(level));
 const boardKey=a=>JSON.stringify([a.mode,a.level,a.daily?.key||null,a.signature,a.positions,a.doorMask,a.movesUsed,a.extraMoves]);
 function validateWallet(w){
  if(!record(w)||w.version!==1||!integer(w.revision)||!integer(w.energy,0,CAP)||!integer(w.coins)||!integer(w.anchorMs)||!integer(w.lastObservedMs)||w.anchorMs>w.lastObservedMs||!record(w.accounted)||!record(w.accounted.campaign)||!record(w.accounted.daily)||!record(w.receipts)||!(w.attempt===null||record(w.attempt))||!(w.importJournal===null||record(w.importJournal)))fail('INVALID_WALLET');
  for(const [key,n] of Object.entries(w.accounted.campaign))if(!/^(?:[1-9]\d{0,2})$/.test(key)||!integer(Number(key),1,400)||!integer(n,1,3))fail('INVALID_WALLET');
  for(const [key,n] of Object.entries(w.accounted.daily))if(!day(key)||!integer(n,1,3))fail('INVALID_WALLET');
  for(const [key,r] of Object.entries(w.receipts))if(!id(key)||!record(r)||r.id!==key||r.attemptId!==key||!['campaign','daily'].includes(r.mode)||!integer(r.level,1,400)||!integer(r.stars,1,3)||!integer(r.moves)||!integer(r.coins,0,30)||typeof r.delivered!=='boolean'||(r.mode==='daily'&&(!record(r.daily)||!day(r.daily.key)||r.daily.level!==r.level)))fail('INVALID_WALLET');
  return copy(w);
 }
 function createState({now,campaign={stars:{}},daily={}}){
  if(!integer(now))fail('INVALID_WALLET');
  const campaignTiers={},dailyTiers={};
  for(const [key,n] of Object.entries(campaign?.stars||{}))if(integer(Number(key),1,400)&&String(Number(key))===key&&integer(n,1,3))campaignTiers[key]=n;
  for(const [key,value] of Object.entries(daily||{}))if(day(key)&&value?.completed===true&&integer(value.stars,1,3))dailyTiers[key]=value.stars;
  return validateWallet({version:1,revision:0,energy:CAP,coins:0,anchorMs:now,lastObservedMs:now,accounted:{campaign:campaignTiers,daily:dailyTiers},attempt:null,receipts:{},importJournal:null});
 }
 function settleEnergy(wallet,now){
  const w=validateWallet(wallet);if(!integer(now))fail('INVALID_TIME');const current=Math.max(now,w.lastObservedMs);w.lastObservedMs=current;
  if(w.energy===CAP)w.anchorMs=current;
  else{const intervals=Math.floor((current-w.anchorMs)/INTERVAL);w.energy=Math.min(CAP,w.energy+intervals);w.anchorMs=w.energy===CAP?current:w.anchorMs+intervals*INTERVAL;}
  return {state:w,nextRechargeAt:w.energy===CAP?null:w.anchorMs+INTERVAL};
 }
 function createAttempt({id:attemptId,level,mode='campaign',daily=null}){
  const a={id:attemptId,revision:0,mode,level:level.id,signature:signature(level),positions:level.pieces.map(p=>p.pos.slice()),selected:0,doorMask:0,movesUsed:0,extraMoves:0,energyPaid:false,status:'preview',daily:copy(daily),pendingMove:null,paidHint:null,operations:{}};
  return validateAttempt(a,level);
 }
 function validateAttempt(a,level){
  const bad=()=>fail('INVALID_ATTEMPT');
  if(!record(a)||!level||!id(a.id)||!integer(a.revision)||!['campaign','daily'].includes(a.mode)||a.level!==level.id||a.signature!==signature(level)||!Array.isArray(a.positions)||a.positions.length!==level.pieces.length||!integer(a.selected,0,level.pieces.length-1)||!integer(a.doorMask,0,0x7fffffff)||!integer(a.movesUsed)||!integer(a.extraMoves)||a.extraMoves%5!==0||typeof a.energyPaid!=='boolean'||!['preview','active','out-of-moves','completed'].includes(a.status)||!record(a.operations)||!(a.pendingMove===null||record(a.pendingMove))||!(a.paidHint===null||record(a.paidHint)))bad();
  const used=new Set();for(const p of a.positions){if(p===null)continue;if(!Array.isArray(p)||p.length!==2||!p.every(n=>integer(n,0,level.size-1))||used.has(p.join(':'))||(level.rocks||[]).some(r=>r[0]===p[0]&&r[1]===p[1]))bad();used.add(p.join(':'));}
  let allowedMask=0;for(const field of [...(level.switches||[]),...(level.doors||[])])allowedMask|=1<<field[2];if(a.doorMask&~allowedMask)bad();
  if(a.mode==='daily'){if(!record(a.daily)||!day(a.daily.key)||a.daily.level!==level.id||typeof a.daily.tier!=='string')bad();}else if(a.daily!==null)bad();
  if(!a.energyPaid&&(a.movesUsed!==0||a.extraMoves!==0||a.status!=='preview'||a.pendingMove!==null))bad();
  if(a.status==='completed'&&a.positions.some(Boolean))bad();
  if(!integer(level.moveLimit+a.extraMoves))bad();
  for(const [key,value] of Object.entries(a.operations))if(!id(key)||!record(value)||typeof value.identity!=='string')bad();
  if(a.pendingMove&&(!id(a.pendingMove.token)||!integer(a.pendingMove.pi,0,level.pieces.length-1)||!['U','D','L','R'].includes(a.pendingMove.dir)||!record(a.pendingMove.result)))bad();
  if(a.paidHint&&(typeof a.paidHint.boardKey!=='string'||!integer(a.paidHint.pi,0,level.pieces.length-1)||!['U','D','L','R'].includes(a.paidHint.dir)))bad();
  return copy(a);
 }
 function reduce(wallet,command,context){
  const {now,level,simulateState}=context;const w=settleEnergy(wallet,now).state;if(w.importJournal)fail('IMPORT_PENDING');
  const c=command,type=c.type;let a=w.attempt,value=null;
  const assertActive=()=>{if(!a||a.id!==c.attemptId)fail('STALE');validateAttempt(a,level);};
  const expected=()=>{if(c.expectedRevision!==undefined&&c.expectedRevision!==a.revision)fail('STALE');};
  const bump=()=>{if(!integer(a.revision+1))fail('OVERFLOW');a.revision++;};
  const finish=()=>{if(!integer(w.revision+1)||!integer(w.coins))fail('OVERFLOW');w.revision++;return {state:validateWallet(w),value:copy(value)};};
  const identity=JSON.stringify([type,c.attemptId||c.attempt?.id,c.pi??null,c.dir??null,c.boardKey??null]);
  function prior(){if(!id(c.requestId))fail('INVALID_REQUEST');const op=a?.operations?.[type+':'+c.requestId];if(!op)return false;if(op.identity!==identity)fail('REQUEST_CONFLICT');return true;}
  function remember(){a.operations[type+':'+c.requestId]={identity};}
  function candidate(){
   const next=c.attempt?validateAttempt(c.attempt,level):null;
   if(!a||a.id!==(next?.id||c.attemptId)){
    if(a&&a.energyPaid&&a.status!=='completed'&&c.replacePaid!==true)fail('REPLACE_CONFIRMATION');
    if(!next||next.energyPaid||next.movesUsed!==0||next.status!=='preview')fail('STALE');
    a=next;w.attempt=a;
   }else validateAttempt(a,level);
  }
  if(type==='SETTLE')return finish();
  if(type==='ACK_RECEIPT'){const r=w.receipts[c.receiptId];if(!r)fail('STALE');r.delivered=true;value=r;return finish();}
  if(type==='COMPLETE'&&w.receipts[c.attemptId]){value=w.receipts[c.attemptId];return {state:validateWallet(wallet),value:copy(value)};}
  if(type==='RETIRE'){if(a&&c.attemptId&&a.id!==c.attemptId)fail('STALE');if(a)expected();w.attempt=null;return finish();}
  if(type==='BEGIN_MOVE'){
   candidate();if(prior()){value=a.pendingMove?.token===c.requestId?a.pendingMove:{token:c.requestId,done:true};return {state:validateWallet(wallet),value:copy(value)};}expected();
   if(a.status==='completed'||a.pendingMove)fail('BUSY');if(a.movesUsed>=level.moveLimit+a.extraMoves)fail('OUT_OF_MOVES');
   if(!integer(c.pi,0,level.pieces.length-1)||!['U','D','L','R'].includes(c.dir))fail('BLOCKED');
   const result=simulateState(level,a.positions,a.doorMask,c.pi,c.dir);if(!result)fail('BLOCKED');
   if(!a.energyPaid){if(w.energy<1)fail('NO_ENERGY');if(w.energy===CAP)w.anchorMs=w.lastObservedMs;w.energy--;a.energyPaid=true;}
   a.status='active';a.pendingMove={token:c.requestId,pi:c.pi,dir:c.dir,result:copy(result)};remember();bump();value=a.pendingMove;
  }else if(type==='COMMIT_MOVE'){
   assertActive();if(!a.pendingMove&&a.operations['COMMIT_MOVE:'+c.requestId]){value=a;return {state:validateWallet(wallet),value:copy(value)};}expected();
   if(!a.pendingMove||a.pendingMove.token!==c.requestId)fail('STALE');const p=a.pendingMove,result=simulateState(level,a.positions,a.doorMask,p.pi,p.dir);if(!result||signature(result)!==signature(p.result))fail('INVALID_ATTEMPT');
   a.positions[p.pi]=result.capture?null:[result.r,result.c];a.doorMask=result.mask;a.movesUsed++;if(!integer(a.movesUsed))fail('OVERFLOW');a.selected=integer(c.selected,0,level.pieces.length-1)?c.selected:p.pi;a.pendingMove=null;a.paidHint=null;a.status=a.movesUsed>=level.moveLimit+a.extraMoves&&a.positions.some(Boolean)?'out-of-moves':'active';remember();bump();value=a;
  }else if(type==='CANCEL_MOVE'){
   assertActive();if(a.pendingMove?.token===c.requestId){a.pendingMove=null;bump();}value=a;
  }else if(type==='BUY_MOVES'){
   assertActive();if(prior()){value=a;return {state:validateWallet(wallet),value:copy(value)};}expected();if(a.status!=='out-of-moves'||a.pendingMove||a.movesUsed<level.moveLimit+a.extraMoves||!a.energyPaid||!a.positions.some(Boolean))fail('NOT_EXHAUSTED');if(w.coins<MOVES_PRICE)fail('NO_COINS');if(!integer(a.extraMoves+5)||!integer(level.moveLimit+a.extraMoves+5))fail('OVERFLOW');w.coins-=MOVES_PRICE;a.extraMoves+=5;a.status='active';if(integer(c.selected,0,level.pieces.length-1))a.selected=c.selected;remember();bump();value=a;
  }else if(type==='BUY_HINT'){
   candidate();if(prior()){value=a.paidHint;return {state:validateWallet(wallet),value:copy(value)};}expected();if(a.pendingMove||a.status==='completed'||a.movesUsed>=level.moveLimit+a.extraMoves)fail('NOT_PLAYABLE');if(c.boardKey!==boardKey(a))fail('STALE');
   if(a.paidHint?.boardKey===c.boardKey){value=a.paidHint;return {state:validateWallet(wallet),value:copy(value)};}if(!a.energyPaid&&w.energy<1)fail('NO_ENERGY');if(w.coins<HINT_PRICE)fail('NO_COINS');if(!integer(c.pi,0,level.pieces.length-1)||!['U','D','L','R'].includes(c.dir)||!simulateState(level,a.positions,a.doorMask,c.pi,c.dir))fail('INVALID_HINT');
   w.coins-=HINT_PRICE;a.selected=c.pi;a.paidHint={boardKey:c.boardKey,pi:c.pi,dir:c.dir};remember();bump();value=a.paidHint;
  }else if(type==='COMPLETE'){
   assertActive();expected();if(!a.energyPaid||a.pendingMove||a.positions.some(Boolean)||a.movesUsed>level.moveLimit+a.extraMoves)fail('NOT_SOLVED');
   const stars=a.movesUsed<=level.optimal?3:a.movesUsed<=level.optimal+1?2:1,key=a.mode==='daily'?a.daily.key:String(a.level),tiers=w.accounted[a.mode],before=tiers[key]||0,coins=stars>before?(stars-before)*10:stars*2;
   if(!integer(w.coins+coins))fail('OVERFLOW');w.coins+=coins;tiers[key]=Math.max(before,stars);a.status='completed';bump();const receipt={id:a.id,attemptId:a.id,mode:a.mode,level:a.level,daily:a.daily,stars,moves:a.movesUsed,coins,delivered:false};w.receipts[a.id]=receipt;value=receipt;
  }else fail('INVALID_COMMAND');
  if(w.attempt)validateAttempt(w.attempt,level);return finish();
 }
 const api=Object.freeze({CAP,INTERVAL,HINT_PRICE,MOVES_PRICE,createState,validateWallet,validateAttempt,settleEnergy,reduce,signature,boardKey,createAttempt});
 if(typeof module==='object'&&module.exports)module.exports=api;else root.LatchlingsEconomyCore=api;
})(typeof window==='object'?window:globalThis);
