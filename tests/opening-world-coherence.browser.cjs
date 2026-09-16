const assert=require('assert');
const http=require('http');
const fs=require('fs');
const path=require('path');
const {chromium}=require('playwright');

const root=path.resolve(__dirname,'..');
const evidenceDir=path.join(root,'test-artifacts','opening-world');
fs.mkdirSync(evidenceDir,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.mp3':'audio/mpeg','.wav':'audio/wav'};
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://127.0.0.1');const requested=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);const file=path.join(root,requested.endsWith('/')?requested+'index.html':requested);if(!file.startsWith(root)){res.writeHead(403).end();return}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(data)})});
const listen=()=>new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));

const EXPECTED_ACTIONS=[
 'establish-drifting-neighborhood','show-working-skyway','focus-little-home',
 'breakfast-route-travels','breakfast-misses-porch','watering-misses-garden',
 'shortcut-misses-rock','tansy-compares-target','pip-shows-yesterday-route',
 'rowan-measures-three-offsets','three-misses-pulse-together','widen-to-network-question',
 'waykeeper-call-ready','route-adapts-to-drift','call-leaves-little-home',
 'waykeeper-answer-arrives','neighbors-share-local-knowledge','route-becomes-puzzle',
 'sunpetal-route-focus','breakfast-start-focus','investigation-ready'
];
const SCREENSHOT_STEPS=new Set([1,3,5,6,7,10,13,16,18,21]);
const close=(a,b,tolerance=1)=>Math.abs(a-b)<=tolerance;
const center=box=>({x:box.left+box.width/2,y:box.top+box.height/2});
const distance=(a,b)=>Math.hypot(center(a).x-center(b).x,center(a).y-center(b).y);

async function advanceTo(page,step){
 while(await page.evaluate(()=>Number(document.querySelector('.cin-opening-continuous')?.dataset.step||0))<step){
  await page.locator('#cinematicNext').click();
  await page.waitForTimeout(90);
 }
 await page.waitForTimeout(90);
}

async function lowerGeometry(page){
 return page.evaluate(()=>{
  const rect=s=>document.querySelector(s)?.getBoundingClientRect().toJSON();
  return {
   copy:rect('.cinematic-copy'),
   footer:rect('.cinematic-footer'),
   progress:rect('.cinematic-progress'),
   next:rect('#cinematicNext'),
   beatDisplay:getComputedStyle(document.querySelector('#cinematicBeat')).display,
   shell:rect('.cinematic-shell')
  };
 });
}

async function canonicalState(page){
 return page.evaluate(()=>{
  const frame=document.querySelector('.opening-home-reference');
  if(!frame)return null;
  const doc=frame.contentDocument;
  if(!doc)return {src:frame.getAttribute('src'),ready:false};
  const residents=[...doc.querySelectorAll('#c2 [data-resident]')].map(x=>x.dataset.resident);
  const api=frame.contentWindow?.LatchlingsCinematicHome;
  const landmarks={};
  if(api?.getLandmark){for(const name of ['porch','garden','play-rock','call','Pippa','Bramble','Rowan','Pip','Tansy'])landmarks[name]=api.getLandmark(name)}
  return {
   src:frame.getAttribute('src'),
   ready:true,
   bodyOpening:doc.body?.dataset.openingCinematic||'',
   sceneActive:doc.documentElement?.dataset.sceneActive||'',
   island:!!doc.querySelector('#c2 .island-model'),
   cottage:!!doc.querySelector('#c2 .cottage'),
   tree:!!doc.querySelector('#c2 .little-home-tree'),
   residents,
   hasApi:!!api?.getLandmark,
   landmarks
  };
 });
}

async function missState(page,name){
 return page.evaluate(name=>{
  const rect=s=>document.querySelector(s)?.getBoundingClientRect().toJSON();
  const mover=rect(`[data-opening-mover="${name}"]`),miss=rect(`.opening-miss-marker[data-miss="${name}"]`),target=rect(`.opening-target-marker[data-target="${name==='basket'?'porch':name==='water'?'garden':'play-rock'}"]`);
  return {mover,miss,target};
 },name);
}

(async()=>{
 await listen();
 const browser=await chromium.launch({channel:process.env.CI?undefined:'chrome',headless:true});
 const pageErrors=[];
 const configs=[
  {width:360,height:800,textSize:'normal'},
  {width:390,height:844,textSize:'normal'},
  {width:430,height:932,textSize:'normal'},
  {width:360,height:800,textSize:'large'}
 ];
 for(const config of configs){
  const context=await browser.newContext({viewport:{width:config.width,height:config.height},reducedMotion:'no-preference'});
  const page=await context.newPage();
  page.on('pageerror',e=>pageErrors.push(`${config.width}x${config.height}/${config.textSize}: ${e.message}`));
  await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
  await page.evaluate(textSize=>{LatchlingsPrefs.set('textSize',textSize);LatchlingsCinematics.show('opening',{markSeen:false})},config.textSize);
  await page.waitForTimeout(160);

  const rootExists=await page.locator('.cin-opening-continuous').count();
  assert.equal(rootExists,1,`${config.width}x${config.height}: Opening must keep one persistent scene root`);
  assert.equal(await page.locator('.opening-little-home').count(),0,`${config.width}x${config.height}: duplicate hand-built Little Home must be removed`);
  assert.equal(await page.locator('.opening-home-reference').count(),1,`${config.width}x${config.height}: Opening must reuse the canonical Little Home iframe`);

  const canonical=await canonicalState(page);
  assert(canonical?.src?.includes('c=2'),`${config.width}x${config.height}: canonical Home must use concept 2`);
  for(const token of ['embed=1','cinematic=1','opening=1'])assert(canonical.src.includes(token),`${config.width}x${config.height}: canonical Home src must include ${token}`);
  assert(canonical.ready&&canonical.island&&canonical.cottage&&canonical.tree,`${config.width}x${config.height}: canonical Little Home scene must be loaded`);
  assert.deepEqual(new Set(canonical.residents),new Set(['Pippa','Bramble','Rowan','Pip','Tansy']),`${config.width}x${config.height}: canonical Home must contain the five production residents`);
  assert.equal(canonical.bodyOpening,'true',`${config.width}x${config.height}: iframe must expose Opening cinematic mode`);
  assert.equal(canonical.sceneActive,'false',`${config.width}x${config.height}: ambient Home life must be paused inside the Opening`);
  assert(canonical.hasApi,`${config.width}x${config.height}: canonical Home must expose landmark API`);
  for(const [name,box] of Object.entries(canonical.landmarks))assert(box&&['x','y','width','height'].every(k=>Number.isFinite(box[k])),`${config.width}x${config.height}: landmark ${name} must be finite`);

  const baseline=await lowerGeometry(page);
  assert.equal(baseline.beatDisplay,'none',`${config.width}x${config.height}: changing Opening beat/route subtitle must be removed`);
  const neighborBoxes=await page.evaluate(()=>[...document.querySelectorAll('.opening-neighbor-island')].map(x=>x.getBoundingClientRect().toJSON()));
  const homeBox=await page.locator('.opening-home-reference').evaluate(x=>x.getBoundingClientRect().toJSON());
  assert(neighborBoxes.length>=2,`${config.width}x${config.height}: establishing shot needs at least two neighboring islands`);
  for(const box of neighborBoxes){const ratio=box.width/homeBox.width;assert(ratio>=.22&&ratio<=.72,`${config.width}x${config.height}: neighboring island must remain a believable perspective scale of Little Home, ratio ${ratio.toFixed(2)}`)}

  for(let step=1;step<=21;step++){
   await advanceTo(page,step);
   const action=await page.locator('.cin-opening-continuous').getAttribute('data-story-action');
   assert.equal(action,EXPECTED_ACTIONS[step-1],`${config.width}x${config.height}: turn ${step} must expose its semantic visual action`);
   const g=await lowerGeometry(page);
   for(const key of ['footer','progress','next']){
    for(const edge of ['top','bottom','height'])assert(close(g[key][edge],baseline[key][edge],1),`${config.width}x${config.height}/${config.textSize}: ${key}.${edge} moved on turn ${step}: ${g[key][edge]} vs ${baseline[key][edge]}`);
   }
   assert(close(g.copy.top,baseline.copy.top,1)&&close(g.copy.bottom,baseline.copy.bottom,1)&&close(g.copy.height,baseline.copy.height,1),`${config.width}x${config.height}/${config.textSize}: copy region moved on turn ${step}`);
   assert(g.next.left>=0&&g.next.right<=config.width&&g.next.bottom<=config.height,`${config.width}x${config.height}: Continue must stay onscreen`);
   if(step===5||step===6||step===7){
    const name=step===5?'basket':step===6?'water':'play',s=await missState(page,name);
    assert(s.mover&&s.miss&&s.target,`${config.width}x${config.height}: ${name} mover, miss marker and intended target must all exist`);
    assert(distance(s.miss,s.target)>=14&&distance(s.miss,s.target)<=52,`${config.width}x${config.height}: ${name} miss must be obvious but nearby, got ${distance(s.miss,s.target).toFixed(1)}px`);
    assert(distance(s.mover,s.miss)<=4,`${config.width}x${config.height}: ${name} mover must settle on its miss marker`);
    assert(distance(s.mover,s.target)>=12,`${config.width}x${config.height}: ${name} must not visually arrive at its intended destination`);
   }
   if(step===10){
    const lengths=await page.evaluate(()=>[...document.querySelectorAll('.opening-offset-vector')].filter(x=>parseFloat(getComputedStyle(x).opacity)>.05).map(x=>x.getTotalLength?x.getTotalLength():x.getBoundingClientRect().width));
    assert.equal(lengths.length,3,`${config.width}x${config.height}: Rowan must reveal all three offsets`);
    assert(Math.max(...lengths)-Math.min(...lengths)<=5,`${config.width}x${config.height}: matching misses must use equal-length offset vectors: ${lengths}`);
   }
   if(step===11){
    const visible=await page.evaluate(()=>[...document.querySelectorAll('.opening-miss-marker')].filter(x=>parseFloat(getComputedStyle(x).opacity)>.05).length);
    assert.equal(visible,3,`${config.width}x${config.height}: all three misses must be visibly compared together`);
   }
   if(config.width===390&&config.textSize==='normal'&&SCREENSHOT_STEPS.has(step))await page.screenshot({path:path.join(evidenceDir,`390x844-step-${String(step).padStart(2,'0')}.png`),fullPage:true});
  }
  if(config.width===360&&config.textSize==='large')await page.screenshot({path:path.join(evidenceDir,'360x800-large-step-21.png'),fullPage:true});
  await context.close();
 }

 const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const rp=await reduced.newPage();
 await rp.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
 await rp.evaluate(()=>LatchlingsCinematics.show('opening',{markSeen:false}));
 for(let step=1;step<=21;step++){
  await advanceTo(rp,step);
  assert.equal(await rp.locator('.cin-opening-continuous').getAttribute('data-story-action'),EXPECTED_ACTIONS[step-1],`Reduced Motion turn ${step} must keep the same semantic state`);
  assert.equal(await rp.locator('#cinematicStage').evaluate(e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length),0,`Reduced Motion turn ${step} must have no running stage animations`);
 }
 await reduced.close();

 await browser.close();
 server.close();
 assert.deepEqual(pageErrors,[]);
 console.log('PASS canonical Opening world, semantic misses, 21 visual actions, and static lower controls');
})().catch(error=>{console.error(error);server.close();process.exit(1)});
