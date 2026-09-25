const assert=require('assert');
const http=require('http');
const fs=require('fs');
const path=require('path');
const {chromium}=require('playwright');

const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://127.0.0.1');
 const requested=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
 const file=path.join(root,requested.endsWith('/')?requested+'index.html':requested);
 const relative=path.relative(root,file);
 if(relative.startsWith('..')||path.isAbsolute(relative)){res.writeHead(403).end();return}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(data)})
});

(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:process.env.CI?undefined:'chrome',headless:true});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true,timezoneId:'UTC'});
  await context.addInitScript(()=>{
   localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked:12,stars:{'1':2,'2':1}}));
   localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1}));
   localStorage.removeItem('latchlings_daily400_progress_v1');
   const NativeDate=Date,fixedNow=Date.UTC(2026,8,24,12);
   class FixedDate extends NativeDate{constructor(...args){super(...(args.length?args:[fixedNow]))}static now(){return fixedNow}}
   window.Date=FixedDate;
  });
  const page=await context.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});

  const daily=await page.evaluate(()=>{
   const date=new Date(),fresh=dailyRouteInfo(date,{unlocked:11,stars:{}}),justUnlockedAnchors=dailyRouteInfo(date,{unlocked:101,stars:{'100':1}}),advancedProgress={unlocked:351,stars:{'350':1}},advanced=dailyRouteInfo(date,advancedProgress);
   const repeated=dailyRouteInfo(new Date(date),advancedProgress);
   const sampledLaterRoutes=Array.from({length:400},(_,offset)=>dailyRouteInfo(new Date(date.getTime()+offset*86400000),advancedProgress).level);
   progress={unlocked:advancedProgress.unlocked,stars:{...advancedProgress.stars}};
   const campaignBefore=JSON.stringify({unlocked:progress.unlocked,stars:progress.stars}),storedBefore=localStorage.getItem('latchlings_campaign400_progress_v1');
   startDailyPuzzle();
   const title=document.getElementById('levelTitle').innerText,dailyLabel=document.querySelector('#mechanicNote .mechanic-chip-label').textContent;
   rulesModal();const rulesTier=document.getElementById('dailyRulesTier')?.innerText||'';closeModal();
   const lev=LEVELS[currentLevel-1];
   for(let index=0;index<lev.solution.length;index++){const [pi,dir]=lev.solution[index],move=simulate(pi,dir);if(!move)throw new Error(`Daily Level ${lev.id} authored move failed`);positions[pi]=move.capture?null:[move.r,move.c];doorMask=move.mask;if(index===0)renderGame(true)}
   movesUsed=lev.solution.length;
   winLevel();
   const dailyHistory=JSON.parse(localStorage.getItem('latchlings_daily400_progress_v1')||'{}');
   return {fresh,justUnlockedAnchors,advanced,repeated,sampledLaterRoutes,dailyLevel:dailySession.level,dailyTier:dailySession.tier,campaignBefore,campaignAfter:JSON.stringify({unlocked:progress.unlocked,stars:progress.stars}),storedBefore,storedAfter:localStorage.getItem('latchlings_campaign400_progress_v1'),dailyRecord:dailyHistory[dailySession.key],title,dailyLabel,rulesTier,renderedTitle:document.getElementById('levelTitle').innerText,renderedLabel:document.querySelector('#mechanicNote .mechanic-chip-label').textContent};
  });
  assert(daily.fresh.level>=1&&daily.fresh.level<=10,'fresh Daily selection must stay in the curated opening pool');
  assert.equal(daily.fresh.tier,'Edges','fresh Daily must identify the first-mechanics tier');
  assert(daily.justUnlockedAnchors.level<=100,'unlocking Level 101 without completing it must not expose its anchor mechanic');
  assert.equal(daily.justUnlockedAnchors.tier,'Helpers','Daily tier must follow the highest completed level rather than unlocked level');
  assert(daily.advanced.level<=350,'advanced Daily selection must never exceed its highest completed level');
  assert.equal(daily.advanced.tier,'Switches','completing Level 350 must identify the learned Switchworks tier');
  assert(daily.sampledLaterRoutes.some(level=>level>=301&&level<=350),'advanced Daily pool must include learned Switchworks routes');
  assert.deepStrictEqual(daily.repeated,daily.advanced,'same date and mechanic tier must return the same Daily route');
  assert.equal(daily.dailyLevel,daily.advanced.level,'starting Daily must consume the deterministic selected route');
  assert.equal(daily.dailyTier,daily.advanced.tier,'starting Daily must preserve its mechanic tier');
  assert(daily.title.toLowerCase().includes('switches'),`Daily header must show the learned mechanic tier; got ${JSON.stringify(daily.title)}`);
  assert(daily.dailyLabel.includes('Switches'),'Daily route tip must identify the mechanic tier');
  assert(daily.rulesTier.includes('Switches'),'Daily rules entry must identify the mechanic tier');
  assert(daily.renderedTitle.toLowerCase().includes('switches')&&daily.renderedLabel.includes('Switches'),`Daily tier label must persist after rerendering a puzzle move; got ${JSON.stringify([daily.renderedTitle,daily.renderedLabel])}`);
  assert.equal(daily.campaignAfter,daily.campaignBefore,'clearing Daily must not change campaign stars or unlocks');
  assert.equal(daily.storedAfter,daily.storedBefore,'clearing Daily must not write campaign progress');
  assert.equal(daily.dailyRecord.level,daily.dailyLevel,'Daily clear must save to its separate daily history');

  const roundTrip=await page.evaluate(()=>{
   const backup=LatchlingsProgressBackup.create({unlocked:12,stars:{'1':3,'2':1,'12':2}},['opening','old-maps']);
   return LatchlingsProgressBackup.parse(JSON.stringify(backup));
  });
  assert.deepStrictEqual(roundTrip,{progress:{unlocked:12,stars:{'1':3,'2':1,'12':2}},seen:['old-maps','opening']},'backup must round-trip unlocked level, sparse stars, and known cinematics');

  const invalid=await page.evaluate(()=>{
   const valid={format:'latchlings-progress',version:1,campaign:{unlocked:12,stars:{'1':2}},cinematics:['opening']};
   const cases=[
    ['malformed JSON','{'],
    ['wrong version',JSON.stringify({...valid,version:2})],
    ['unlocked above campaign',JSON.stringify({...valid,campaign:{...valid.campaign,unlocked:401}})],
    ['invalid star value',JSON.stringify({...valid,campaign:{...valid.campaign,stars:{'1':4}}})],
    ['unknown cinematic',JSON.stringify({...valid,cinematics:['opening','not-a-film']})],
    ['star above unlocked',JSON.stringify({...valid,campaign:{unlocked:12,stars:{'13':1}}})],
    ['unknown field',JSON.stringify({...valid,cloudSave:true})]
   ];
   const before=[localStorage.getItem('latchlings_campaign400_progress_v1'),localStorage.getItem('latchlings_cinematics_seen_v1')];
   const rejected=[];
   for(const [name,json] of cases){try{LatchlingsProgressBackup.parse(json)}catch(_){rejected.push(name)}}
   const after=[localStorage.getItem('latchlings_campaign400_progress_v1'),localStorage.getItem('latchlings_cinematics_seen_v1')];
   const level400=LatchlingsProgressBackup.parse(JSON.stringify({format:'latchlings-progress',version:1,campaign:{unlocked:400,stars:{'400':3}},cinematics:[]}));
   return {rejected,unchanged:JSON.stringify(before)===JSON.stringify(after),level400};
  });
  assert.deepStrictEqual(invalid.rejected,['malformed JSON','wrong version','unlocked above campaign','invalid star value','unknown cinematic','star above unlocked','unknown field'],'invalid backup cases must be rejected');
  assert(invalid.unchanged,'parsing rejected data must never mutate campaign or cinematic storage');
  assert.equal(invalid.level400.progress.stars['400'],3,'a Level 400 star must be allowed at unlocked level 400');

  const source={format:'latchlings-progress',version:1,campaign:{unlocked:12,stars:{'1':3,'2':1,'12':2}},cinematics:['old-maps','opening']};
  await page.evaluate(()=>{progress={unlocked:12,stars:{'1':3,'2':1,'12':2}};localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1,'old-maps':1}));settingsModal()});
  const downloadPromise=page.waitForEvent('download');
  await page.locator('#exportProgressBtn').click();
  const download=await downloadPromise;
  const exportedJson=fs.readFileSync(await download.path(),'utf8'),exported=JSON.parse(exportedJson);
  assert.deepStrictEqual(exported,source,'Settings export must create the documented JSON backup');

  await page.evaluate(()=>{
   window.__nativeFileText=File.prototype.text;
   Object.defineProperty(File.prototype,'text',{configurable:true,writable:true,value:function(){return new Promise((resolve,reject)=>setTimeout(()=>window.__nativeFileText.call(this).then(resolve,reject),250))}});
  });
  await page.locator('#progressImportInput').setInputFiles({name:'progress.json',mimeType:'application/json',buffer:Buffer.from(exportedJson)});
  await page.locator('#progressImportSummary').waitFor({state:'visible'});
  assert(await page.locator('#progressImportSummary').isVisible(),'valid import must request confirmation');
  assert(/Level 12/.test(await page.locator('#progressImportSummary').innerText()),'confirmation must summarize the unlocked level');
  assert(/3 stars/.test(await page.locator('#progressImportSummary').innerText()),'confirmation must summarize earned stars');
  await page.evaluate(()=>{Object.defineProperty(File.prototype,'text',{configurable:true,writable:true,value:window.__nativeFileText});delete window.__nativeFileText});
  const beforeConfirm=await page.evaluate(()=>[localStorage.getItem('latchlings_campaign400_progress_v1'),localStorage.getItem('latchlings_cinematics_seen_v1')]);
  assert.deepStrictEqual(beforeConfirm,[JSON.stringify({unlocked:12,stars:{'1':2,'2':1}}),JSON.stringify({opening:1,'old-maps':1})],'valid import must not write until confirmed');
  await page.locator('#confirmProgressImport').click();
  const imported=await page.evaluate(()=>({progress,stored:localStorage.getItem('latchlings_campaign400_progress_v1'),seen:localStorage.getItem('latchlings_cinematics_seen_v1')}));
  assert.deepStrictEqual(imported.progress,source.campaign,'confirmation must replace in-memory campaign progress');
  assert.deepStrictEqual(JSON.parse(imported.stored),source.campaign,'confirmation must save campaign progress');
  assert.deepStrictEqual(JSON.parse(imported.seen),{opening:1,'old-maps':1},'confirmation must restore seen cinematics');

  await page.evaluate(()=>resetProgress());
  assert(!/verified campaign/i.test(await page.locator('#modal').innerText()),'Reset Progress copy must not refer to a verified campaign');
  await page.locator('#cancelReset').click();

  const badBefore=await page.evaluate(()=>[localStorage.getItem('latchlings_campaign400_progress_v1'),localStorage.getItem('latchlings_cinematics_seen_v1')]);
  await page.evaluate(()=>settingsModal());
  await page.locator('#progressImportInput').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...source,version:99}))});
  await page.locator('#progressImportError').waitFor({state:'visible'});
  assert(await page.locator('#progressImportError').isVisible(),'invalid import must explain that the backup could not be read');
  const badAfter=await page.evaluate(()=>[localStorage.getItem('latchlings_campaign400_progress_v1'),localStorage.getItem('latchlings_cinematics_seen_v1')]);
  assert.deepStrictEqual(badAfter,badBefore,'invalid import must leave both stored progress keys unchanged');
  await page.locator('#progressImportErrorClose').click();

  const atomicBefore=await page.evaluate(()=>({campaign:localStorage.getItem('latchlings_campaign400_progress_v1'),seen:localStorage.getItem('latchlings_cinematics_seen_v1'),progress:{unlocked:progress.unlocked,stars:{...progress.stars}}}));
  await page.evaluate(()=>settingsModal());
  await page.locator('#progressImportInput').setInputFiles({name:'replacement.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...source,campaign:{unlocked:20,stars:{'1':3,'2':2,'20':1}}}))});
  await page.evaluate(()=>{
   const original=Storage.prototype.setItem;let failOnce=true;
   Object.defineProperty(Storage.prototype,'setItem',{configurable:true,writable:true,value:function(key,value){if(key==='latchlings_cinematics_seen_v1'&&failOnce){failOnce=false;throw new DOMException('Quota exceeded','QuotaExceededError')}return original.call(this,key,value)}});
  });
  await page.locator('#confirmProgressImport').click();
  const atomicAfter=await page.evaluate(()=>({campaign:localStorage.getItem('latchlings_campaign400_progress_v1'),seen:localStorage.getItem('latchlings_cinematics_seen_v1'),progress:{unlocked:progress.unlocked,stars:{...progress.stars}},warning:document.getElementById('saveStatusBanner').innerText}));
  assert.deepStrictEqual(atomicAfter.campaign,atomicBefore.campaign,'failed two-key import must restore the prior campaign value');
  assert.deepStrictEqual(atomicAfter.seen,atomicBefore.seen,'failed two-key import must restore the prior cinematic value');
  assert.deepStrictEqual(atomicAfter.progress,atomicBefore.progress,'failed import must not replace in-memory progress');
  assert(/could not be saved/i.test(atomicAfter.warning),'failed import must report its save failure');
  await page.locator('#cancelProgressImport').click();
  await page.locator('#saveStatusDismiss').click();

  await page.evaluate(()=>settingsModal());
  await page.locator('#progressImportInput').setInputFiles({name:'replacement.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...source,campaign:{unlocked:20,stars:{'1':3,'2':2,'20':1}}}))});
  await page.locator('#confirmProgressImport').waitFor({state:'visible'});
  await page.evaluate(()=>{
   const original=Storage.prototype.setItem;
   Object.defineProperty(Storage.prototype,'setItem',{configurable:true,writable:true,value:function(key,value){if(key==='latchlings_campaign400_progress_v1')throw new DOMException('Quota exceeded','QuotaExceededError');return original.call(this,key,value)}});
  });
  await page.locator('#confirmProgressImport').click();
  const inconsistent=await page.evaluate(()=>({progress:{unlocked:progress.unlocked,stars:{...progress.stars}},text:document.getElementById('saveStatusBanner').innerText}));
  assert.deepStrictEqual(inconsistent.progress,atomicBefore.progress,'storage rollback failure must leave the in-memory session untouched');
  assert(/local storage may be inconsistent/i.test(inconsistent.text),'failed rollback must explicitly warn that local storage may be inconsistent');
  assert(await page.locator('#saveStatusExport').isVisible(),'inconsistent-storage warning must offer an export of the active session');
  await page.locator('#cancelProgressImport').click();
  await page.locator('#saveStatusDismiss').click();

  await page.evaluate(()=>{
   const original=Storage.prototype.setItem;
   Object.defineProperty(Storage.prototype,'setItem',{configurable:true,writable:true,value:function(key,value){if(key==='latchlings_campaign400_progress_v1')throw new DOMException('Quota exceeded','QuotaExceededError');return original.call(this,key,value)}});
   progress={unlocked:33,stars:{'1':2}};currentLevel=1;movesUsed=1;playMode='campaign';winLevel();
  });
  const failedSave=await page.evaluate(()=>({progress:{unlocked:progress.unlocked,stars:{...progress.stars}},hidden:document.getElementById('saveStatusBanner').hidden,text:document.getElementById('saveStatusBanner').innerText,stored:localStorage.getItem('latchlings_campaign400_progress_v1'),result:saveProgress()}));
  assert.equal(failedSave.progress.unlocked,33,'failed save must preserve session unlock progress');
  assert(failedSave.progress.stars['1']>=2,'a win must remain in the in-memory session after storage fails');
  assert.equal(failedSave.result,false,'saveProgress must report storage failure');
  assert.equal(failedSave.hidden,false,'failed campaign save must show a persistent unsaved banner');
  assert(/export/i.test(failedSave.text),'unsaved banner must offer an export action');
  for(const width of [320,360,390,430]){
   await page.setViewportSize({width,height:844});
   const boxes=await page.evaluate(()=>Object.fromEntries(['#saveStatusBanner','#saveStatusExport','#saveStatusDismiss'].map(selector=>[selector,document.querySelector(selector).getBoundingClientRect().toJSON()])));
   assert(boxes['#saveStatusBanner'].left>=0&&boxes['#saveStatusBanner'].right<=width,`${width}px: save warning must remain inside the phone viewport`);
   for(const selector of ['#saveStatusExport','#saveStatusDismiss'])assert(boxes[selector].left>=boxes['#saveStatusBanner'].left&&boxes[selector].right<=boxes['#saveStatusBanner'].right,`${width}px: ${selector} must stay inside the save warning`);
   const exportBox=boxes['#saveStatusExport'],dismissBox=boxes['#saveStatusDismiss'];
   assert(exportBox.right<=dismissBox.left,`${width}px: save warning actions must not overlap`);
  }
  await page.locator('#saveStatusDismiss').click();
  assert(await page.locator('#saveStatusBanner').isHidden(),'unsaved banner must be dismissible');

  await context.close();
  console.log('PASS progress backup, Daily learned-mechanic tiers and isolation, reset copy, and unsaved-win handling');
 }finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
})().catch(error=>{console.error(error);process.exit(1)});
