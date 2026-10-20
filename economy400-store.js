'use strict';
(function(root){
 const C=root.LatchlingsEconomyCore;
 const failure=(code,message=code)=>Object.assign(new Error(message),{code});
 function open({indexedDB,dbName='latchlings_economy_v1'}){
  return new Promise((resolve,reject)=>{
   if(!indexedDB){reject(failure('STORAGE_UNAVAILABLE'));return;}
   let request,finished=false;
   const rejectOnce=error=>{if(!finished){finished=true;reject(error);}};
   try{request=indexedDB.open(dbName,1);}catch(error){rejectOnce(failure('STORAGE_UNAVAILABLE',error.message));return;}
   request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains('state'))db.createObjectStore('state');};
   request.onerror=()=>rejectOnce(failure('STORAGE_UNAVAILABLE',request.error?.message));
   request.onblocked=()=>rejectOnce(failure('STORAGE_BLOCKED','Close older Latchlings tabs and try again.'));
   request.onsuccess=()=>{const db=request.result;if(finished){db.close();return;}finished=true;db.onversionchange=()=>db.close();resolve(createStore(db));};
  });
 }
 function createStore(database){
  const api={database,resumeError:null,close:()=>database.close()};
  // The callback is deliberately synchronous: reduction and put share this transaction.
  function transaction(change,context={}){
   return new Promise((resolve,reject)=>{
    let tx,result,problem;
    function abort(error){problem=error;try{tx?.abort();}catch{} }
    const canceled=()=>abort(failure('ABORTED'));
    function current(){if(context.signal?.aborted||context.isCurrent&&context.isCurrent()!==true)throw failure('ABORTED');}
    try{current();tx=database.transaction('state','readwrite');}catch(error){reject(error.code?error:failure('STORAGE_UNAVAILABLE',error.message));return;}
    context.signal?.addEventListener('abort',canceled,{once:true});
    const clean=()=>context.signal?.removeEventListener('abort',canceled);
    tx.oncomplete=()=>{clean();resolve(result);};
    tx.onabort=()=>{clean();reject(problem||failure('ABORTED',tx.error?.message));};
    tx.onerror=()=>{problem=problem||failure('STORAGE_WRITE_FAILED',tx.error?.message);};
    const store=tx.objectStore('state'),get=store.get('wallet');
    get.onsuccess=()=>{try{current();const output=change(get.result);current();if(output.write!==undefined)store.put(output.write,'wallet');result=output.value;}catch(error){abort(error);}};
   });
  }
  function checked(value){
   const w=C.validateWallet(value);
   if(w.attempt&&Array.isArray(root.LEVELS)){
    try{C.validateAttempt(w.attempt,root.LEVELS[w.attempt.level-1]);}
    catch(error){api.resumeError=error;w.attempt=null;}
   }
   return w;
  }
  api.initialize=options=>transaction(raw=>{const w=raw===undefined?C.createState(options):checked(raw);return {write:w,value:w};});
  api.read=()=>transaction(raw=>{if(raw===undefined)throw failure('NOT_INITIALIZED');const w=checked(raw);return {write:w,value:w};});
  api.transact=(command,context)=>transaction(raw=>{if(raw===undefined)throw failure('NOT_INITIALIZED');const result=C.reduce(checked(raw),command,context);return {write:result.state,value:result};},context);
  api.prepareImport=(target,originals)=>transaction(raw=>{const w=checked(raw);if(w.importJournal)throw failure('IMPORT_PENDING');const wallet=C.validateWallet(target.economy);if(wallet.importJournal)throw failure('INVALID_IMPORT');const journal={id:root.crypto.randomUUID(),target:{...target,economy:wallet},originals:{...originals,economy:w}};w.importJournal=journal;w.revision++;return {write:w,value:journal};});
  api.finishImport=journalId=>transaction(raw=>{const w=checked(raw),j=w.importJournal;if(!j||j.id!==journalId)throw failure('STALE');const target=C.validateWallet(j.target.economy);if(target.importJournal)throw failure('INVALID_IMPORT');target.revision=Math.max(w.revision,target.revision)+1;return {write:target,value:target};});
  return api;
 }
 root.LatchlingsEconomyStore=Object.freeze({open});
})(window);
