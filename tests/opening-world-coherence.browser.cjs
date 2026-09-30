const assert=require('assert');
const http=require('http');
const fs=require('fs');
const path=require('path');
const {chromium}=require('playwright');

const root=path.resolve(__dirname,'..');
const evidenceDir=process.env.OPENING_EVIDENCE_DIR||path.join(root,'test-artifacts','opening-world');
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
const CUE_DETAILS={1:'wide drifting neighborhood + working route',2:'cargo visibly travels the working Skyway',3:'camera settles on canonical Little Home',4:'breakfast basket visibly travels',5:'porch target and breakfast miss are both visible',6:'watering route visibly travels and splashes at the miss',7:'shortcut visibly travels toward a miss beside the play rock',8:'Tansy is visibly focused while the intended target pulses',9:'Pip is focused and yesterday route is visible',10:'Rowan reveals all three offset vectors',11:'all three matching misses pulse together',12:'Pippa widens the view to the network question',13:'Waykeeper call device visibly appears',14:'adaptive route visibly bends across the drift',15:'call signal visibly travels outward',16:'answer signal visibly returns to Little Home',17:'five residents contribute visible knowledge tokens',18:'same world dissolves into the Level 1 route model',19:'Sunpetal morning route is visibly called out',20:'breakfast start is visibly highlighted',21:'route-ready state visibly settles'};
const TRAVEL_CUES={
 cargo:{actor:'.opening-route-cargo',route:'#opening-route-working',duration:1300},
 basket:{actor:'[data-opening-mover="basket"]',route:'#opening-route-basket',duration:1250},
 water:{actor:'[data-opening-mover="water"]',route:'#opening-route-water',duration:1000},
 play:{actor:'[data-opening-mover="play"]',route:'#opening-route-play',duration:900},
 signalOut:{actor:'.signal-out',route:'#opening-route-call',duration:1050},
 signalIn:{actor:'.signal-in',route:'#opening-route-answer',duration:850}
};
const SCREENSHOT_STEPS=new Set([1,3,5,6,7,10,13,16,18,21]);
const close=(a,b,tolerance=1)=>Math.abs(a-b)<=tolerance;
const center=box=>({x:box.left+box.width/2,y:box.top+box.height/2});
const distance=(a,b)=>Math.hypot(center(a).x-center(b).x,center(a).y-center(b).y);

async function waitForOpeningGeometry(page){
 await page.waitForFunction(()=>{
  const root=document.querySelector('.cin-opening-continuous');
  return root?.dataset.geometryReady==='true'&&
   ['basket','water','play'].every(name=>document.querySelector(`#opening-route-${name}`)?.getTotalLength()>0);
 });
}

async function waitForScenePaint(page){
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
}

async function advanceTo(page,step){
 await waitForOpeningGeometry(page);
 while(await page.evaluate(()=>Number(document.querySelector('.cin-opening-continuous')?.dataset.step||0))<step){
  const before=await page.evaluate(()=>Number(document.querySelector('.cin-opening-continuous')?.dataset.step||0));
  const travelName={2:'cargo',4:'basket',6:'water',7:'play',15:'signalOut',16:'signalIn'}[before+1];
  if(travelName)await page.evaluate(({name,details})=>{
   if(matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.motion==='reduced')return;
   const mover=document.querySelector(details.actor),route=document.querySelector(details.route),length=route?.getTotalLength();
   if(!mover||!route||!length)return;
   const endpoint=route.getPointAtLength(length),trace={name,samples:[],started:false,complete:false,startedAt:performance.now(),endpoint:{x:endpoint.x,y:endpoint.y},duration:details.duration};
   window.__openingTravelTrace=trace;
   const sample=()=>{
    if(window.__openingTravelTrace!==trace)return;
    const animation=mover.getAnimations().find(item=>item.playState==='running'),routeEnd=route.getPointAtLength(route.getTotalLength());
    const box=mover.getBoundingClientRect(),inverse=route.getScreenCTM().inverse(),position=new DOMPoint(box.left+box.width/2,box.top+box.height/2).matrixTransform(inverse);
    if(animation){
     trace.samples.push({time:Number(animation.currentTime),distance:Math.hypot(position.x-routeEnd.x,position.y-routeEnd.y)});trace.started=true;
     if(trace.samples.length<256)requestAnimationFrame(sample);
    }else if(trace.started){trace.samples.push({time:details.duration,distance:Math.hypot(position.x-routeEnd.x,position.y-routeEnd.y)});trace.complete=true}
    else if(performance.now()-trace.startedAt<3000)requestAnimationFrame(sample);
    else trace.timedOut=true;
   };
   requestAnimationFrame(sample);
  },{name:travelName,details:TRAVEL_CUES[travelName]});
  await page.locator('#cinematicNext').click();
  await page.waitForFunction(before=>Number(document.querySelector('.cin-opening-continuous')?.dataset.step||0)>before,before);
  await waitForOpeningGeometry(page);
 }
 await page.waitForFunction(step=>Number(document.querySelector('.cin-opening-continuous')?.dataset.step||0)===step,step);
 await waitForScenePaint(page);
}

async function verifyTravelProgress(page,name){
 const details=TRAVEL_CUES[name];
 assert(details,`Opening travel cue ${name} must have an explicit actor and route contract`);
 const reduced=await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.motion==='reduced');
 if(!reduced){
  await page.waitForFunction(({name,duration})=>{const trace=window.__openingTravelTrace;return trace?.name===name&&(trace.timedOut||trace.complete||trace.samples.some(sample=>sample.time>=duration))},{name,duration:details.duration+180},{timeout:details.duration+1800});
  const trace=await page.evaluate(()=>window.__openingTravelTrace);
  assert(trace&&trace.name===name&&!trace.timedOut&&trace.complete,`${name}: motion trace must start and settle on the requested route endpoint (${JSON.stringify(trace)})`);
  const first=trace.samples[0],progress=trace.samples.find(sample=>sample.time>=120&&sample.distance<first.distance-1);
  assert(progress,`${name}: mover must visibly progress toward its route endpoint across animation frames (${trace.samples.slice(0,4).map(sample=>`${sample.time.toFixed(0)}ms/${sample.distance.toFixed(1)}px`).join(', ')})`);
  const last=trace.samples.at(-1);
  assert(last&&last.distance<=3,`${name}: mover must settle on the measured route endpoint (${last?.distance?.toFixed(1)||'missing'}px away)`);
  return;
 }
 const travel=await page.locator(details.actor).evaluate((el,routeSelector)=>{
  const route=document.querySelector(routeSelector),endpoint=route.getPointAtLength(route.getTotalLength()),inverse=route.getScreenCTM().inverse(),box=el.getBoundingClientRect(),position=new DOMPoint(box.left+box.width/2,box.top+box.height/2).matrixTransform(inverse);
  return {distance:Math.hypot(position.x-endpoint.x,position.y-endpoint.y)};
 },details.route);
 assert(travel.distance<=2,`${name}: Reduced Motion must place the mover at its route endpoint (${travel.distance.toFixed(1)}px)`);
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

function cueStatus(step){
 const visible=selector=>{const el=document.querySelector(selector);if(!el)return false;const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity)>.05&&r.width>0&&r.height>0};
 const visibleCount=selector=>[...document.querySelectorAll(selector)].filter(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity)>.05&&r.width>0&&r.height>0}).length;
 const running=selector=>{const el=document.querySelector(selector);return !!el&&el.getAnimations().some(a=>a.playState==='running')};
 const root=document.querySelector('.cin-opening-continuous'),frame=document.querySelector('.opening-home-reference'),doc=frame?.contentDocument;
 const focused=name=>doc?.querySelector(`#c2 [data-resident="${name}"]`)?.dataset.openingFocus==='true';
 const camera=root?.dataset.camera;
 switch(step){
   case 1:return camera==='wide'&&visible('.opening-neighbor-island')&&visible('.route-working');
   case 2:return camera==='wide'&&visible('.opening-route-cargo')&&visible('#opening-route-working');
   case 3:return camera==='home'&&visible('.opening-home-reference');
   case 4:return visible('.route-basket')&&visible('[data-opening-mover="basket"]');
   case 5:return visible('.opening-target-marker[data-target="porch"]')&&visible('.opening-miss-marker[data-miss="basket"]');
   case 6:return visible('.route-water')&&visible('.opening-miss-splash')&&visible('[data-opening-mover="water"]');
   case 7:return visible('.route-play')&&visible('.opening-target-marker[data-target="play-rock"]')&&visible('[data-opening-mover="play"]');
   case 8:return focused('Tansy')&&visible('.opening-target-marker[data-target="play-rock"]');
   case 9:return focused('Pip')&&visible('.route-yesterday');
   case 10:return focused('Rowan')&&visibleCount('.opening-offset-vector')===3;
   case 11:return visibleCount('.opening-miss-marker')===3;
   case 12:return focused('Pippa')&&camera==='network'&&visible('.opening-network-question');
   case 13:return focused('Pippa')&&visible('.opening-call-box');
   case 14:return visible('.route-adaptive');
   case 15:return visible('.route-call')&&visible('.signal-out');
   case 16:return visible('.route-answer')&&visible('.opening-player-compass')&&visible('.signal-in');
   case 17:return focused('Bramble')&&visibleCount('.opening-knowledge-token')===5;
   case 18:return camera==='puzzle'&&visible('.opening-board-model');
   case 19:return focused('Rowan')&&visible('.opening-board-focus-label');
   case 20:return focused('Pippa')&&visible('.opening-board-breakfast');
   case 21:return focused('Pip')&&visible('.opening-board-ready');
   default:return false;
  }
}

async function waitForOpeningCue(page,step){
 try{await page.waitForFunction(cueStatus,step,{timeout:6000})}
 catch(error){
  const state=await page.evaluate(step=>{
   const root=document.querySelector('.cin-opening-continuous'),frame=root?.querySelector('.opening-home-reference');
   const selectors=['.opening-route-cargo','[data-opening-mover="basket"]','[data-opening-mover="water"]','[data-opening-mover="play"]','.signal-out','.signal-in'];
   const actors=Object.fromEntries(selectors.map(selector=>{const el=root?.querySelector(selector),style=el&&getComputedStyle(el),box=el?.getBoundingClientRect();return[selector,el?{left:style.left,top:style.top,opacity:style.opacity,box:box.toJSON(),animations:el.getAnimations().map(a=>({state:a.playState,currentTime:a.currentTime,duration:a.effect?.getTiming().duration}))}:null]}));
   const trace=window.__openingTravelTrace;
   return{step,actualStep:root?.dataset.step,action:root?.dataset.storyAction,camera:root?.dataset.camera,homeReady:root?.dataset.homeReady,geometryReady:root?.dataset.geometryReady,frameReady:frame?.contentDocument?.readyState,actors,trace:trace?{name:trace.name,started:trace.started,complete:trace.complete,timedOut:trace.timedOut,samples:trace.samples.slice(-4)}:null};
  },step);
  state.cueVisible=await page.evaluate(cueStatus,step);
  throw new Error(`Opening visual cue timed out at turn ${step} (${CUE_DETAILS[step]}): ${JSON.stringify(state)}; ${error.message}`);
 }
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
 const requestedWidth=Number(process.env.OPENING_WORLD_WIDTH||0),selectedConfigs=requestedWidth?configs.filter(config=>config.width===requestedWidth):configs;
 assert(selectedConfigs.length,`No Opening world case matches OPENING_WORLD_WIDTH=${requestedWidth}`);
 for(const config of selectedConfigs){
  const context=await browser.newContext({viewport:{width:config.width,height:config.height},reducedMotion:'no-preference'});
  const page=await context.newPage();
  page.on('pageerror',e=>pageErrors.push(`${config.width}x${config.height}/${config.textSize}: ${e.message}`));
  await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
  await page.evaluate(textSize=>{LatchlingsPrefs.set('textSize',textSize);LatchlingsCinematics.show('opening',{markSeen:false})},config.textSize);
  await waitForOpeningGeometry(page);

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
   const resizeDuringSignal=step===15&&config.width===390&&config.textSize==='normal';
   if(resizeDuringSignal)await page.evaluate(()=>{
    const root=document.querySelector('.cin-opening-continuous');
    const observer=new MutationObserver(()=>{
     if(Number(root.dataset.step)!==15)return;
     observer.disconnect();
     const resizeAfterVisibleTravel=()=>{
      const signal=root.querySelector('.signal-out'),animation=signal.getAnimations().find(item=>item.playState==='running');
      if(!animation||Number(animation.currentTime)<300){requestAnimationFrame(resizeAfterVisibleTravel);return}
      const duration=Number(animation.effect.getTiming().duration);
      window.__openingTestResizeExpectedRemaining=duration-Number(animation.currentTime);
      window.__openingTestResizeOldAnimation=animation;
      window.__openingTestResizePreviousWidth=root.clientWidth;
      root.style.width=`${root.clientWidth-24}px`;root.style.right='0px';window.__openingTestResizeApplied=true;
     };
     requestAnimationFrame(resizeAfterVisibleTravel);
    });
    observer.observe(root,{attributes:true,attributeFilter:['data-step']});window.__openingTestResizeObserver=observer;
   });
   await advanceTo(page,step);
   if(resizeDuringSignal){
    await page.waitForFunction(()=>{const signal=document.querySelector('.signal-out'),animation=signal?.getAnimations().find(item=>item.playState==='running');return window.__openingTestResizeApplied&&animation&&animation!==window.__openingTestResizeOldAnimation},undefined,{timeout:3000});
    const resized=await page.evaluate(()=>{const root=document.querySelector('.cin-opening-continuous'),signal=root.querySelector('.signal-out'),animation=signal.getAnimations().find(item=>item.playState==='running');return{applied:window.__openingTestResizeApplied,expectedRemaining:window.__openingTestResizeExpectedRemaining,previousWidth:window.__openingTestResizePreviousWidth,rootWidth:root.clientWidth,animation:animation?{state:animation.playState,currentTime:animation.currentTime,duration:Number(animation.effect.getTiming().duration)}:null}});
    assert(resized.applied&&resized.previousWidth-resized.rootWidth>=20,`Opening resize must settle before travel assertions (${JSON.stringify(resized)})`);
    assert(resized.animation?.state==='running',`Opening signal must still be traveling after scene geometry is resized (${JSON.stringify(resized)})`);
    assert(Math.abs(resized.animation.duration-resized.expectedRemaining)<=100,`Opening signal must keep its remaining travel time after resizing (${JSON.stringify(resized)})`);
   }
   const action=await page.locator('.cin-opening-continuous').getAttribute('data-story-action');
   assert.equal(action,EXPECTED_ACTIONS[step-1],`${config.width}x${config.height}: turn ${step} must expose its semantic visual action`);
   const travelName={2:'cargo',4:'basket',6:'water',7:'play',15:'signalOut',16:'signalIn'}[step];
   if(travelName)await verifyTravelProgress(page,travelName);
   if(resizeDuringSignal){await page.evaluate(()=>{const root=document.querySelector('.cin-opening-continuous');root.style.removeProperty('width');root.style.removeProperty('right')});await waitForOpeningGeometry(page)}
   await waitForOpeningCue(page,step);
   const cue=await page.evaluate(cueStatus,step);
   assert(cue,`${config.width}x${config.height}/${config.textSize}: turn ${step} must have an obvious visible event: ${CUE_DETAILS[step]||'unknown step'}`);
   const g=await lowerGeometry(page);
   for(const key of ['footer','progress','next']){
    for(const edge of ['top','bottom','height'])assert(close(g[key][edge],baseline[key][edge],1),`${config.width}x${config.height}/${config.textSize}: ${key}.${edge} moved on turn ${step}: ${g[key][edge]} vs ${baseline[key][edge]}`);
   }
   assert(close(g.copy.top,baseline.copy.top,1)&&close(g.copy.bottom,baseline.copy.bottom,1)&&close(g.copy.height,baseline.copy.height,1),`${config.width}x${config.height}/${config.textSize}: copy region moved on turn ${step}`);
   assert(g.next.left>=0&&g.next.right<=config.width&&g.next.bottom<=config.height,`${config.width}x${config.height}: Continue must stay onscreen`);
   if(step===6)await page.waitForTimeout(1000);
   if(step===7)await page.waitForTimeout(900);
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
  const travelName={2:'cargo',4:'basket',6:'water',7:'play',15:'signalOut',16:'signalIn'}[step];
  if(travelName)await verifyTravelProgress(rp,travelName);
  assert.equal(await rp.locator('.cin-opening-continuous').getAttribute('data-story-action'),EXPECTED_ACTIONS[step-1],`Reduced Motion turn ${step} must keep the same semantic state`);
  assert.equal(await rp.locator('#cinematicStage').evaluate(e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length),0,`Reduced Motion turn ${step} must have no running stage animations`);
 }
 await reduced.close();

 await browser.close();
 server.close();
 assert.deepEqual(pageErrors,[]);
 console.log('PASS canonical Opening world, semantic misses, 21 verified visual actions, and static lower controls');
})().catch(error=>{console.error(error);server.close();process.exit(1)});
