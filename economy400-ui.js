'use strict';
(function(root){
 const E=root.LatchlingsEconomy,C=root.LatchlingsEconomyCore;
 let snapshot=null,error=null,rechargeTimer=null,refreshPromise=null,fingerprint='';
 const channel=typeof BroadcastChannel==='function'?new BroadcastChannel('latchlings-economy'):null;
 function recharge(w){if(!w)return 'Wallet unavailable';const settled=C.settleEnergy(w,Date.now()),at=settled.nextRechargeAt;if(at===null)return 'Energy is full';const seconds=Math.max(0,Math.ceil((at-Math.max(Date.now(),w.lastObservedMs))/1000));return `Next energy: ${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;}
 function paint(){
  const w=snapshot?C.settleEnergy(snapshot,Date.now()).state:null;
  for(const id of ['homeWalletBtn','atlasWalletBtn']){const button=document.getElementById(id);if(!button)continue;button.setAttribute('aria-label',w?`Energy ${w.energy} of 20. ${w.coins} coins. Open wallet${snapshot.importJournal?' and import recovery':''}.`:'Wallet unavailable. Open details.');button.querySelector('[data-wallet-energy]').textContent=w?`${w.energy}/20`:'—';button.querySelector('[data-wallet-coins]').textContent=w?String(w.coins):'—';}
  const next=document.getElementById('walletRechargeText');if(next)next.textContent=snapshot?.importJournal?'Import recovery is pending. Your original wallet is kept.':recharge(snapshot);
  const energy=document.getElementById('walletEnergyValue'),coins=document.getElementById('walletCoinsValue');if(energy)energy.textContent=w?`${w.energy}/20`:'Unavailable';if(coins)coins.textContent=w?String(w.coins):'Unavailable';
 }
 function renderWallets(wallet){
  if(!wallet){paint();return;}snapshot=C.validateWallet(wallet);error=E.error;paint();
  clearTimeout(rechargeTimer);const at=C.settleEnergy(snapshot,Date.now()).nextRechargeAt;if(at!==null&&!snapshot.importJournal)rechargeTimer=setTimeout(refresh,Math.max(100,at-Math.max(Date.now(),snapshot.lastObservedMs)+30));
  const signature=JSON.stringify([snapshot.energy,snapshot.coins,snapshot.accounted,snapshot.attempt?.id,snapshot.attempt?.revision,snapshot.importJournal?.id]);if(signature!==fingerprint){fingerprint=signature;channel?.postMessage('changed');}
 }
 function storageError(problem){error=problem;if(!document.getElementById('overlay').classList.contains('show')||!document.getElementById('walletTitle'))showSaveStatus('The wallet could not be saved. Keep the game open and retry, or export from Settings. Energy and coins have not been reset.');paint();}
 function refresh(){if(refreshPromise)return refreshPromise;refreshPromise=E.read().then(renderWallets).catch(storageError).finally(()=>{refreshPromise=null;});return refreshPromise;}
 function showWallet(zero=false){
  const w=snapshot||E.snapshot,pending=!!w?.importJournal,usable=w&&!pending&&!error&&!E.error,paid=w?.attempt?.energyPaid&&w.attempt.status!=='completed';
  modal(`<h2 id="walletTitle">${pending?'Recover this import':zero?'Energy is recharging':w?'Your wallet':'Wallet unavailable'}</h2><div class="economy-wallet-summary"><span>Energy <b id="walletEnergyValue">${w?`${w.energy}/20`:'Unavailable'}</b></span><span>Coins <b id="walletCoinsValue">${w?w.coins:'Unavailable'}</b></span></div><p id="walletRechargeText" aria-live="off"></p><p class="economy-wallet-rules">${pending?'The interrupted import is saved. Retry recovery before starting or purchasing anything. Export keeps the original journey and wallet.':!usable?'Wallet storage is unavailable. Story, Settings, and journey export remain available; spending is blocked to protect your balance.':'A new attempt uses 1 energy on its first valid move. Regain 1 every 15 minutes, up to 20. Hints cost 15 coins; five more moves cost 40.'}</p>${usable&&!zero?'<p class="economy-wallet-rules">Stars earn 10/20/30 total. Replays: 2/4/6. Improvements pay the difference.</p>':''}<div class="modal-actions">${paid?`<button class="primary-small" id="walletResume" ${pending||!usable?'disabled':''}>Resume saved route · no energy</button>`:''}${pending?'<button class="primary-small" id="walletRecover">Retry import recovery</button>':''}<button class="secondary-small" id="walletExport">Export progress</button><button class="secondary-small" id="walletClose">Back</button></div>`);
  paint();if(!usable)hideSaveStatus();const resume=document.getElementById('walletResume');if(resume)resume.onclick=async()=>{try{closeModal();await E.resumeAttempt();}catch(problem){E.report(problem);}};
  const recover=document.getElementById('walletRecover');if(recover)recover.onclick=async()=>{recover.disabled=true;try{await E.recoverImport();await refresh();if(recover.isConnected&&document.getElementById('overlay').classList.contains('show'))showWallet(false);}catch(problem){storageError(problem);if(recover.isConnected&&document.getElementById('overlay').classList.contains('show'))showWallet(false);}};
  document.getElementById('walletExport').onclick=exportProgressBackup;document.getElementById('walletClose').onclick=closeModal;
 }
 const UI={renderWallets,walletDialog:async()=>{const screenName=document.body.dataset.screen,generation=moveRequestSerial;await refresh();if(screenName===document.body.dataset.screen&&generation===moveRequestSerial)showWallet(false);},zeroEnergyDialog:()=>{snapshot=E.snapshot||snapshot;showWallet(true);},storageError};root.LatchlingsEconomyUI=UI;
 for(const id of ['homeWalletBtn','atlasWalletBtn'])document.getElementById(id).onclick=UI.walletDialog;
 root.addEventListener('latchlings:economy',event=>renderWallets(event.detail));
 root.addEventListener('focus',refresh);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refresh();});
 if(channel)channel.onmessage=()=>refresh();
 root.addEventListener('storage',event=>{if([PROGRESS_KEY,CINEMATIC_SEEN_STORAGE_KEY].includes(event.key)){progress=loadProgress();updateHome(true);if(document.body.dataset.screen==='levels')renderChapter();}});
 setInterval(paint,1000);E.ready.then(()=>{error=E.error;renderWallets(E.snapshot);});
})(window);
