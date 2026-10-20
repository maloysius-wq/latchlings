'use strict';
(function(root){
 const C=root.LatchlingsEconomyCore;
 let store,wallet=null,preview=null,startupError=null,lifecycle=Promise.resolve(),preparing=null,ticket=null,presentingReceipt=false;
 const clone=x=>JSON.parse(JSON.stringify(x)),uid=()=>crypto.randomUUID();
 const fail=(code)=>{throw Object.assign(new Error(code),{code});};
 function publish(w){wallet=w;root.dispatchEvent(new CustomEvent('latchlings:economy',{detail:clone(w)}));return w;}
 function storageError(error){if(root.LatchlingsEconomyUI)root.LatchlingsEconomyUI.storageError(error);else showSaveStatus('The wallet could not be saved. Your board is unchanged. Retry or export your progress from Settings.');}
 function context(extra={}){return {now:Date.now(),level:LEVELS[(preview?.level||currentLevel)-1],simulateState,...extra};}
 async function readyStore(){await api.ready;if(startupError)throw startupError;await lifecycle;return store;}
 function report(error){
  if(error.code==='ABORTED')return;
  if(error.code==='NO_ENERGY'&&root.LatchlingsEconomyUI){root.LatchlingsEconomyUI.zeroEnergyDialog();return;}
  const titles={NO_ENERGY:'Energy is recharging',STALE:'This saved route changed',NO_COINS:'Not enough coins',OUT_OF_MOVES:'No moves left'};
  const messages={NO_ENERGY:'A new attempt costs 1 energy. You regain 1 every 15 minutes, up to 20. A paid saved attempt can still be resumed.',STALE:'Another tab or action changed this attempt. Resume the latest saved route before playing again.',NO_COINS:'Earn coins by completing routes. Nothing was purchased.',OUT_OF_MOVES:'Continue from the out-of-moves menu or start a new attempt.'};
  if(!titles[error.code])storageError(error);
  modal(`<h2>${titles[error.code]||'Wallet unavailable'}</h2><p>${messages[error.code]||'Your action was not saved. Keep the game open and retry, or export your progress from Settings.'}</p><div class="modal-actions"><button class="primary-small" id="economyErrorClose">Back</button></div>`);document.getElementById('economyErrorClose').onclick=closeModal;
 }
 function matches(a,L,mode,daily){return a&&a.level===L&&a.mode===mode&&a.status!=='completed'&&(mode!=='daily'||a.daily.key===daily?.key);}
 function apply(a){positions=clone(a.positions);selected=a.selected;doorMask=a.doorMask;movesUsed=a.movesUsed;if(a.mode==='daily')dailySession=clone(a.daily);}
 async function complete(a,extra={}){
  const out=await store.transact({type:'COMPLETE',attemptId:a.id,expectedRevision:a.revision,requestId:uid()},context({level:LEVELS[a.level-1],...extra}));publish(out.state);if(preview?.id===a.id)preview=clone(out.state.attempt);return out.value;
 }
 async function deliver(){
  const pending=Object.values((await store.read()).receipts).filter(r=>!r.delivered);
  for(const receipt of pending){
   let deliveredCampaign=null;
   try{
    const out=await store.transact({type:'ACK_RECEIPT',receiptId:receipt.id},context({deliverReceipt:r=>{
     if(r.mode==='daily'){
      const all=JSON.parse(localStorage.getItem(DAILY_PROGRESS_KEY)||'{}');if(!all||typeof all!=='object'||Array.isArray(all))fail('INVALID_PROGRESS');const old=all[r.daily.key];
      if(!old?.completed||r.stars>(old.stars||0)||r.stars===old.stars&&r.moves<(old.moves??Infinity))all[r.daily.key]={level:r.level,stars:r.stars,moves:r.moves,completed:true};
      localStorage.setItem(DAILY_PROGRESS_KEY,JSON.stringify(all));
     }else{
      const stored=root.LatchlingsProgressBackup.create(JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{"unlocked":1,"stars":{}}'),[]).campaign;
      const next={unlocked:Math.max(stored.unlocked,progress.unlocked,Math.min(400,r.level+1)),stars:{...stored.stars}};
      for(const [key,n] of Object.entries(progress.stars))next.stars[key]=Math.max(next.stars[key]||0,n);
      next.stars[r.level]=Math.max(next.stars[r.level]||0,r.stars);localStorage.setItem(PROGRESS_KEY,JSON.stringify(next));deliveredCampaign=next;
     }
    }}));publish(out.state);if(deliveredCampaign){progress=deliveredCampaign;updateHome();}hideSaveStatus();
   }catch(error){showSaveStatus('Your coins are saved. Journey progress still needs to be written on this device; keep the game open, retry, or export a backup.');return false;}
  }
  return true;
 }
 function confirm({title,copy:copyText,confirmText='Continue',disabled=false,generation=moveRequestSerial}){
  return new Promise(resolve=>{
   modal(`<h2>${title}</h2><p>${copyText}</p><div class="modal-actions"><button class="primary-small" id="economyConfirm" ${disabled?'disabled':''}>${confirmText}</button><button class="secondary-small" id="economyCancel">Cancel</button></div>`);
   const button=document.getElementById('economyConfirm');let settled=false;
   const finish=answer=>{if(settled)return;settled=true;observer.disconnect();resolve(answer&&generation===moveRequestSerial);};
   const observer=new MutationObserver(()=>{if(!button.isConnected||!document.getElementById('overlay').classList.contains('show'))finish(false);});observer.observe(document.getElementById('overlay'),{attributes:true,childList:true,subtree:true});
   button.onclick=()=>{finish(true);closeModal();};document.getElementById('economyCancel').onclick=()=>{finish(false);closeModal();};
  });
 }
 const api={
  get snapshot(){return wallet;},get attempt(){return preview;},get error(){return startupError;},get presentingReceipt(){return presentingReceipt;},confirm,storageError,report,
  ready:null,
  async read(){await readyStore();const w=await store.read();if(w.importJournal)return publish(w);return publish((await store.transact({type:'SETTLE'},context())).state);},
  effectiveLimit(lev){return lev.moveLimit+(preview?.level===lev.id?preview.extraMoves:0);},
  invalidate(){preparing?.abort();preparing=null;if(ticket){const stale=ticket;ticket=null;lifecycle=lifecycle.then(()=>store.transact({type:'CANCEL_MOVE',attemptId:stale.attemptId,requestId:stale.token},context({level:stale.level}))).then(out=>{publish(out.state);}).catch(error=>{if(error.code!=='STALE')storageError(error);});}},
  enterLevel(L,mode,{fresh=false}={}){
   api.invalidate();
   if(fresh&&wallet?.attempt&&matches(wallet.attempt,L,mode,dailySession)){
    const id=wallet.attempt.id;lifecycle=lifecycle.then(async()=>{const w=await store.read();if(w.attempt?.id===id){const out=await store.transact({type:'RETIRE',attemptId:id,expectedRevision:w.attempt.revision},context());publish(out.state);}}).catch(storageError);
   }
   const saved=!fresh&&wallet?.attempt;
   preview=matches(saved,L,mode,dailySession)?clone(saved):C.createAttempt({id:uid(),level:LEVELS[L-1],mode,daily:mode==='daily'?dailySession:null});
   if(saved?.pendingMove&&preview.id===saved.id){preview.pendingMove=null;lifecycle=lifecycle.then(async()=>{const out=await store.transact({type:'CANCEL_MOVE',attemptId:saved.id,requestId:saved.pendingMove.token},context({level:LEVELS[saved.level-1]}));publish(out.state);if(preview?.id===saved.id)preview=clone(out.state.attempt);}).catch(storageError);}
   apply(preview);return preview;
  },
  async resumeAttempt(){const w=await api.read(),a=w.attempt;if(!a?.energyPaid||a.status==='completed')return false;if(a.mode==='daily')dailySession=clone(a.daily);startLevel(a.level,a.mode);return true;},
  async retireAttempt(){await readyStore();const a=preview;if(!a)return;const w=await store.read();if(w.attempt?.id!==a.id)return;const out=await store.transact({type:'RETIRE',attemptId:a.id,expectedRevision:w.attempt.revision},context());publish(out.state);},
  async prepareMove({pi,dir,generation}){
   await readyStore();const view=preview;if(!view||generation!==moveRequestSerial)fail('ABORTED');
   if(JSON.stringify([view.positions,view.doorMask,view.movesUsed])!==JSON.stringify([positions,doorMask,movesUsed]))fail('STALE');
   const w=await store.read();publish(w);let replacePaid=false;
   if(w.attempt?.id!==view.id&&w.attempt?.energyPaid&&w.attempt.status!=='completed'){
    replacePaid=await confirm({title:'Start a different route?',copy:'This replaces your unfinished saved attempt. The energy already used on it is not refunded.',confirmText:'Replace saved attempt',generation});if(!replacePaid)fail('ABORTED');
   }
   if(generation!==moveRequestSerial||preview!==view)fail('ABORTED');
   const controller=new AbortController();preparing=controller;
   const token=uid(),a=view,level=LEVELS[a.level-1];
   try{const out=await store.transact({type:'BEGIN_MOVE',attempt:view,pi,dir,requestId:token,replacePaid,expectedRevision:a.revision},context({level,signal:controller.signal,isCurrent:()=>generation===moveRequestSerial&&preview===view}));publish(out.state);const result={attemptId:a.id,revision:out.state.attempt.revision,token,generation,level,result:out.value.result,pi,from:clone(a.positions[pi])};if(preview===view)preview=clone(out.state.attempt);ticket=result;return result;}finally{if(preparing===controller)preparing=null;}
  },
  async commitMove(move,{selected:selection}){
   if(move.generation!==moveRequestSerial)fail('ABORTED');await readyStore();
   const out=await store.transact({type:'COMMIT_MOVE',attemptId:move.attemptId,requestId:move.token,expectedRevision:move.revision,selected:selection},context({level:move.level,isCurrent:()=>move.generation===moveRequestSerial}));publish(out.state);if(ticket===move)ticket=null;if(preview?.id===move.attemptId)preview=clone(out.state.attempt);return out.value;
  },
  async cancelMove(move){if(!move)return;await readyStore();try{const out=await store.transact({type:'CANCEL_MOVE',attemptId:move.attemptId,requestId:move.token},context({level:move.level}));publish(out.state);if(preview?.id===move.attemptId)preview=clone(out.state.attempt);}catch(error){if(error.code!=='STALE')throw error;}if(ticket===move)ticket=null;},
  async completeAttempt(){await readyStore();const a=preview,generation=moveRequestSerial;if(!a)fail('STALE');const controller=new AbortController();preparing=controller;try{return await complete(a,{signal:controller.signal,isCurrent:()=>generation===moveRequestSerial&&preview?.id===a.id});}finally{if(preparing===controller)preparing=null;}},
  async deliverPendingReceipts(){await readyStore();return deliver();},
  async hintOffer(){
   const w=await api.read(),a=preview;if(!a||JSON.stringify([a.positions,a.doorMask,a.movesUsed])!==JSON.stringify([positions,doorMask,movesUsed]))fail('STALE');
   if(w.attempt?.id===a.id&&w.attempt.revision!==a.revision)fail('STALE');
   const key=C.boardKey(a),solved=a.positions.every(p=>!p),exhausted=a.movesUsed>=api.effectiveLimit(LEVELS[a.level-1]);
   if(!solved&&!exhausted&&!a.energyPaid&&w.energy===0)fail('NO_ENERGY');
   const cached=a.paidHint?.boardKey===key?a.paidHint:null;
   if(cached&&!simulateState(LEVELS[a.level-1],a.positions,a.doorMask,cached.pi,cached.dir))fail('INVALID_HINT');
   let replacePaid=false;
   if(!solved&&!exhausted&&w.attempt?.id!==a.id&&w.attempt?.energyPaid&&w.attempt.status!=='completed'){
    replacePaid=await confirm({title:'Replace the saved route?',copy:'Purchasing a hint here replaces your unfinished saved attempt. Its spent energy is not refunded.',confirmText:'Replace saved attempt'});if(!replacePaid)fail('ABORTED');
   }
   return {boardKey:key,cached,replacePaid,requestId:uid(),feeNeeded:!cached&&!solved&&!exhausted};
  },
  async purchaseHint({requestId,boardKey,pi,dir,replacePaid=false,signal,isCurrent=()=>true}){
   await readyStore();const a=preview,generation=moveRequestSerial;if(!a)fail('STALE');
   const out=await store.transact({type:'BUY_HINT',attempt:a,attemptId:a.id,expectedRevision:a.revision,requestId,boardKey,pi,dir,replacePaid},context({signal,isCurrent:()=>generation===moveRequestSerial&&preview?.id===a.id&&isCurrent()}));publish(out.state);if(preview?.id===a.id)preview=clone(out.state.attempt);return out.value;
  },
  async purchaseMoves({requestId}){
   await readyStore();const a=preview,generation=moveRequestSerial;if(!a)fail('STALE');const controller=new AbortController();preparing=controller;
   try{const out=await store.transact({type:'BUY_MOVES',attemptId:a.id,expectedRevision:a.revision,requestId,selected},context({signal:controller.signal,isCurrent:()=>generation===moveRequestSerial&&preview?.id===a.id}));publish(out.state);if(generation===moveRequestSerial&&preview?.id===a.id){preview=clone(out.state.attempt);apply(preview);}return out.value;}finally{if(preparing===controller)preparing=null;}
  },
  async moveSelected(dir){
   if(animating)return;clearBlockerFeedback(true);clearHintFocus();const lev=LEVELS[currentLevel-1];
   if(!positions[selected]){const order=clockwiseAvailable();if(!order.length)return;selected=order[0];}
   if(!simulate(selected,dir)){root.LatchlingsSFX?.invalidMove();showBlockedFeedback(immediateBlocker(selected,dir));shakeSelected();return;}
   animating=true;const generation=++moveRequestSerial,pi=selected;let move=null;
   try{
    move=await api.prepareMove({pi,dir,generation});if(generation!==moveRequestSerial){await api.cancelMove(move);return;}
    const res=move.result,el=document.querySelector(`.latchling[data-pi="${pi}"]`);
    root.LatchlingsSFX?.startMove(res.path.length);root.LatchlingsSFX?.scheduleRouteEvents(res.events,res.path.length);
    await animateMove(el,move.from,res,lev.size);
    if(generation!==moveRequestSerial){await api.cancelMove(move);return;}
    let next=pi;
    if(res.capture){let distance=Infinity;positions.forEach((p,i)=>{if(!p||i===pi)return;const d=(p[0]-res.r)**2+(p[1]-res.c)**2;if(d<distance){distance=d;next=i;}});}
    const a=await api.commitMove(move,{selected:next});if(generation!==moveRequestSerial)return;
    apply(a);lastNestArrival=res.capture?pi:null;renderGame(true);animating=false;
    if(positions.every(p=>!p)){animating=true;try{await winLevel();}finally{if(generation===moveRequestSerial)animating=false;}return;}
    if(movesUsed>=api.effectiveLimit(lev))loseLevel();
   }catch(error){if(move)await api.cancelMove(move).catch(storageError);if(generation!==moveRequestSerial)return;animating=false;renderGame(true);report(error);}
  },
 };
 api.ready=(async()=>{try{store=await root.LatchlingsEconomyStore.open({indexedDB:root.indexedDB});let daily={};try{daily=JSON.parse(localStorage.getItem(DAILY_PROGRESS_KEY)||'{}');}catch{}publish(await store.initialize({now:Date.now(),campaign:progress,daily}));if(wallet.attempt?.energyPaid&&wallet.attempt.status!=='completed'&&!wallet.attempt.pendingMove&&wallet.attempt.positions.every(p=>!p))await complete(wallet.attempt);await deliver();if(store.resumeError)showSaveStatus('Your wallet is safe, but the saved board no longer matches this game. Please start a new attempt.');}catch(error){startupError=error;storageError(error);}})();
 root.LatchlingsEconomy=api;
 // Install after all chapter presenters so every milestone shares the same receipt gate.
 const presentWin=winLevel;
 winLevel=async function(){const generation=moveRequestSerial;try{const receipt=await api.completeAttempt();if(generation!==moveRequestSerial)return;presentingReceipt=true;try{presentWin();}finally{presentingReceipt=false;}const actions=document.querySelector('#modal .modal-actions');if(actions&&!document.querySelector('#modal .economy-earned')){const earned=document.createElement('p');earned.className='economy-earned';earned.textContent=`+${receipt.coins} coins earned`;actions.before(earned);}await api.deliverPendingReceipts();}catch(error){if(generation===moveRequestSerial)report(error);}};
})(window);
