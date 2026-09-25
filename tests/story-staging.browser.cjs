const assert=require('assert');
const http=require('http');
const fs=require('fs');
const os=require('os');
const path=require('path');
const {chromium}=require('playwright');

const repo=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.mp3':'audio/mpeg','.wav':'audio/wav'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname),requested=pathname==='/'?'/index.html':pathname;
 const file=path.resolve(repo,'.'+(requested.endsWith('/')?requested+'index.html':requested));
 if(file!==repo&&!file.startsWith(repo+path.sep)){res.writeHead(403).end();return}
 fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(data)});
});
const listen=()=>new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const evidence=fs.mkdtempSync(path.join(os.tmpdir(),'latchlings-story-staging-'));
const turns={basket:4,water:6,play:7};
const cue={
 basket:{source:'Bakery Perch',target:'Little Home Porch',route:'#opening-route-basket',sourceSelector:'.neighbor-bakery',targetName:'porch'},
 water:{source:"Pippa's Watering Can",target:'Little Home Garden',route:'#opening-route-water',sourceName:'Pippa',targetName:'garden'},
 play:{source:"Pip's Shortcut",target:'Garden Play Rock',route:'#opening-route-play',sourceName:'Pip',targetName:'play-rock'}
};
const center=r=>Number.isFinite(r?.x)&&Number.isFinite(r?.y)?{x:r.x,y:r.y}:{x:r.left+r.width/2,y:r.top+r.height/2};
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const overlap=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
const waitPaint=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));

async function startOpening(page,textSize){
 await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
 await page.evaluate(size=>{LatchlingsPrefs.set('textSize',size);LatchlingsCinematics.show('opening',{markSeen:false})},textSize);
 const ready=await page.waitForFunction(()=>document.querySelector('.cin-opening-continuous')?.dataset.geometryReady==='true',undefined,{timeout:8000}).then(()=>true).catch(()=>false);
 if(!ready){const state=await page.evaluate(()=>{const root=document.querySelector('.cin-opening-continuous'),frame=root?.querySelector('.opening-home-reference'),api=frame?.contentWindow?.LatchlingsCinematicHome,camera=root?.querySelector('.opening-world-camera');return {active:LatchlingsCinematics.active,geometryReady:root?.dataset.geometryReady,homeReady:root?.dataset.homeReady,camera:{width:camera?.clientWidth,height:camera?.clientHeight},frame:{width:frame?.clientWidth,height:frame?.clientHeight,ready:frame?.contentDocument?.readyState},landmarks:Object.fromEntries(['porch','garden','play-rock','Pippa','Pip','call','home-center'].map(name=>[name,api?.getLandmark(name)])),errors:document.querySelector('#cinematicStage')?.innerText.slice(0,180)}});throw new Error(`Opening geometry did not initialize: ${JSON.stringify(state)}`)}
}

async function advanceOne(page,expected){
 const before=Number(await page.locator('.cin-opening-continuous').getAttribute('data-step'));
 const button=page.locator('#cinematicNext');
 assert(await button.isVisible(),`Continue must be visible before turn ${before+1}`);
 await button.click();
 await page.waitForFunction(({before,expected})=>{
  const root=document.querySelector('.cin-opening-continuous');
  return root&&Number(root.dataset.step)>before&&Number(root.dataset.step)===expected;
 },{before,expected});
 await page.waitForFunction(()=>document.querySelector('.cin-opening-continuous')?.dataset.geometryReady==='true');
 await waitPaint(page);
}

async function sceneMeasurements(page,name){
 return page.evaluate(name=>{
 const root=document.querySelector('.cin-opening-continuous'),route=document.querySelector(`#opening-route-${name}`);
  const frame=root?.querySelector('.opening-home-reference');
  const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  const actualCenter=element=>{const r=element?.getBoundingClientRect();return r?{x:r.left+r.width/2,y:r.top+r.height/2,left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height}:null};
  const projectedHome=name=>{
   const doc=frame?.contentDocument,win=frame?.contentWindow;
   if(!doc||!win)return null;
   const group=name==='garden'?[...doc.querySelectorAll('#c2 .flower.f1,#c2 .flower.f2,#c2 .flower.f3')]:[doc.querySelector(name==='porch'?'#c2 .cottage .door':name==='cottage'?'#c2 .cottage':name==='play-rock'?'#c2 .rock.r1':`#c2 [data-resident="${name}"]`)].filter(Boolean);
   if(!group.length)return null;
   const rects=group.map(el=>el.getBoundingClientRect()),frameRect=frame.getBoundingClientRect(),sx=frameRect.width/Math.max(1,win.innerWidth),sy=frameRect.height/Math.max(1,win.innerHeight);
   const left=Math.min(...rects.map(r=>r.left)),top=Math.min(...rects.map(r=>r.top)),right=Math.max(...rects.map(r=>r.right)),bottom=Math.max(...rects.map(r=>r.bottom));
   return {left:frameRect.left+left*sx,top:frameRect.top+top*sy,right:frameRect.left+right*sx,bottom:frameRect.top+bottom*sy,width:(right-left)*sx,height:(bottom-top)*sy};
  };
  const localPoint=t=>{const p=route.getPointAtLength(route.getTotalLength()*t),m=route.getScreenCTM(),q=new DOMPoint(p.x,p.y).matrixTransform(m);return{x:q.x,y:q.y}};
  const source=name==='basket'?actualCenter(root.querySelector('.neighbor-bakery')):projectedHome(name==='water'?'Pippa':'Pip');
  const target=projectedHome(name==='basket'?'porch':name==='water'?'garden':'play-rock'),targetStructure=name==='basket'?projectedHome('cottage'):null;
  const marker=document.querySelector(`.opening-miss-marker[data-miss="${name}"]`),targetMarker=document.querySelector(`.opening-target-marker[data-target="${name==='basket'?'porch':name==='water'?'garden':'play-rock'}"]`);
  const markerCenter=actualCenter(marker),targetMarkerCenter=actualCenter(targetMarker),residents=Object.fromEntries(['Pippa','Bramble','Rowan','Pip','Tansy'].map(resident=>[resident,projectedHome(resident)]));
  const sourceLabel=root.querySelector('[data-errand-source]'),targetLabel=root.querySelector('[data-errand-target]');
  const visible=el=>{if(!el)return false;const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)>.1&&r.width>0&&r.height>0};
  const labelRect=el=>el?.getBoundingClientRect().toJSON()||null;
  const mover=root.querySelector(`[data-opening-mover="${name}"]`),mr=actualCenter(mover);
  const moveAnimations=mover?.getAnimations()||[];
  return {
   source,target,targetStructure,residents,camera:labelRect(root.querySelector('.opening-world-camera')),pathStart:localPoint(0),pathEnd:localPoint(1),marker:markerCenter,targetMarker:targetMarkerCenter,mover:mr,
   sourceLabel:{text:sourceLabel?.textContent.trim()||'',visible:visible(sourceLabel),box:labelRect(sourceLabel)},
   targetLabel:{text:targetLabel?.textContent.trim()||'',visible:visible(targetLabel),box:labelRect(targetLabel)},
   routeOpacity:Number(getComputedStyle(route).opacity),previousRouteOpacity:['basket','water','play'].filter(other=>other!==name).map(other=>Number(getComputedStyle(document.querySelector(`#opening-route-${other}`)).opacity)),
   animationCount:moveAnimations.length,
   activeStep:Number(root.dataset.step),targetDistance:dist(markerCenter,targetMarkerCenter)
  };
 },name);
}

async function verifyErrand(page,name,reduced,textSize,shots){
 await page.waitForFunction(name=>{
  const active=document.querySelector(`#opening-route-${name}`),prior=['basket','water','play'].filter(other=>other!==name).map(other=>document.querySelector(`#opening-route-${other}`));
  return active&&Number(getComputedStyle(active).opacity)>.95&&prior.every(route=>Number(getComputedStyle(route).opacity)<.3);
 },name);
 const expected=cue[name],m=await sceneMeasurements(page,name);
 assert(m.source&&m.target,`${name}: source and target landmark should be measured from canonical scene`);
 assert(distance(m.pathStart,center(m.source))<=3,`${name}: route must begin at real source (${distance(m.pathStart,center(m.source)).toFixed(1)}px)`);
 assert(distance(m.pathEnd,m.marker)<=3,`${name}: route must end at its miss marker (${distance(m.pathEnd,m.marker).toFixed(1)}px)`);
 assert(m.targetDistance>=12&&m.targetDistance<=52,`${name}: miss must remain visibly near its intended target (${m.targetDistance.toFixed(1)}px)`);
 assert(m.sourceLabel.visible&&m.targetLabel.visible,`${name}: source and intended-destination labels must be visible on turn ${m.activeStep}: ${JSON.stringify({source:m.sourceLabel,target:m.targetLabel})}`);
 assert(m.sourceLabel.text.toLowerCase().includes(expected.source.toLowerCase()),`${name}: source label should identify ${expected.source}`);
 assert(m.targetLabel.text.toLowerCase().includes(expected.target.toLowerCase()),`${name}: target label should identify ${expected.target}`);
 const endpointCollisions=[['source',m.sourceLabel.box,m.source],['target',m.targetLabel.box,m.target]].filter(([,label,landmark])=>overlap(label,landmark));
 assert.equal(endpointCollisions.length,0,`${name}: labels must not cover their source/destination landmarks (${JSON.stringify(endpointCollisions)})`);
 if(m.targetStructure)assert(!overlap(m.targetLabel.box,m.targetStructure),`${name}: destination label must not cover the cottage structure (${JSON.stringify({label:m.targetLabel.box,cottage:m.targetStructure})})`);
 const residentCollisions=Object.entries(m.residents).filter(([,resident])=>!resident||overlap(m.sourceLabel.box,resident)||overlap(m.targetLabel.box,resident));
 assert.equal(residentCollisions.length,0,`${name}: errand labels must not cover Latchling faces (${JSON.stringify({source:m.sourceLabel.box,target:m.targetLabel.box,residents:residentCollisions})})`);
 assert([m.sourceLabel.box,m.targetLabel.box].every(label=>label.left>=m.camera.left&&label.right<=m.camera.right&&label.top>=m.camera.top&&label.bottom<=m.camera.bottom),`${name}: errand labels must stay inside the animated scene`);
 assert(!overlap(m.sourceLabel.box,m.targetLabel.box),`${name}: source and destination labels must not collide (${JSON.stringify({source:m.sourceLabel.box,target:m.targetLabel.box})})`);
 if(name!=='basket')assert(m.routeOpacity>Math.max(...m.previousRouteOpacity)+.2,`${name}: active route must be more prominent than earlier errands (${m.routeOpacity} vs ${m.previousRouteOpacity})`);
 const mover=page.locator(`[data-opening-mover="${name}"]`);
 if(reduced){const settled=await page.evaluate(name=>{const el=document.querySelector(`[data-opening-mover="${name}"]`).getBoundingClientRect(),marker=document.querySelector(`.opening-miss-marker[data-miss="${name}"]`).getBoundingClientRect();return{mover:{x:el.left+el.width/2,y:el.top+el.height/2},marker:{x:marker.left+marker.width/2,y:marker.top+marker.height/2}}},name);assert(distance(settled.mover,settled.marker)<=3,`${name}: Reduced Motion mover must settle at the miss marker (${JSON.stringify(settled)})`)}
 else{
  await page.waitForFunction(name=>{const el=document.querySelector(`[data-opening-mover="${name}"]`);return el&&el.getAnimations().length>0},name);
  await mover.evaluate(el=>Promise.allSettled(el.getAnimations().map(a=>a.finished)));
  const final=await page.evaluate(name=>{const el=document.querySelector(`[data-opening-mover="${name}"]`),path=document.querySelector(`#opening-route-${name}`),point=path.getPointAtLength(path.getTotalLength()),matrix=path.getScreenCTM(),end=new DOMPoint(point.x,point.y).matrixTransform(matrix),marker=document.querySelector(`.opening-miss-marker[data-miss="${name}"]`);const b=el.getBoundingClientRect(),m=marker.getBoundingClientRect();return{mover:{x:b.left+b.width/2,y:b.top+b.height/2},marker:{x:m.left+m.width/2,y:m.top+m.height/2},pathEnd:{x:end.x,y:end.y},left:getComputedStyle(el).left,top:getComputedStyle(el).top,parent:el.offsetParent?.getBoundingClientRect().toJSON()}} ,name);
  assert(distance(final.mover,final.marker)<=3,`${name}: animated mover must finish at the miss marker (${distance(final.mover,final.marker).toFixed(1)}px; ${JSON.stringify(final)})`);
 }
 const motion=reduced?'reduced':'normal';
 await page.screenshot({path:path.join(shots,`${page.viewportSize().width}x${page.viewportSize().height}-${textSize}-${motion}-turn-${m.activeStep}-dialogue-visible.png`)});
 await page.locator('.cinematic-copy').evaluate(el=>{el.dataset.testPreviousVisibility=el.style.visibility;el.style.visibility='hidden'});
 await page.screenshot({path:path.join(shots,`${page.viewportSize().width}x${page.viewportSize().height}-${textSize}-${motion}-turn-${m.activeStep}-dialogue-hidden.png`)});
 await page.locator('.cinematic-copy').evaluate(el=>{el.style.visibility=el.dataset.testPreviousVisibility||'';delete el.dataset.testPreviousVisibility});
}

async function runOpening(browser,config){
 const context=await browser.newContext({viewport:{width:config.width,height:config.height},reducedMotion:config.reduced?'reduce':'no-preference'});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await startOpening(page,config.textSize);
 for(let turn=1;turn<=21;turn++){
  assert.equal(Number(await page.locator('.cin-opening-continuous').getAttribute('data-step')),turn,`${config.width}x${config.height}: exactly one tap should advance to turn ${turn}`);
  if(turn===4||turn===6||turn===7)await verifyErrand(page,Object.keys(turns).find(name=>turns[name]===turn),config.reduced,config.textSize,evidence);
  if(turn>=18){
   if(turn===18){await page.waitForFunction(()=>parseFloat(getComputedStyle(document.querySelector('.opening-board-model')).opacity)>.98);await waitPaint(page)}
   const handoff=await page.evaluate(()=>{
    const box=s=>document.querySelector(s)?.getBoundingClientRect().toJSON(),origin=document.querySelector('[data-route-handoff="origin"]'),destination=document.querySelector('[data-route-handoff="destination"]');
    const grid=box('.opening-board-grid');return {origin:{text:origin?.textContent||'',box:box('[data-route-handoff="origin"]')},destination:{text:destination?.textContent||'',box:box('[data-route-handoff="destination"]')},grid};
   });
   assert(handoff.origin.text.includes('Bakery Perch')&&handoff.destination.text.includes('Little Home Porch'),`${config.width}x${config.height}: abstract-board handoff must name both real landmarks`);
   assert(!overlap(handoff.origin.box,handoff.grid)&&!overlap(handoff.destination.box,handoff.grid),`${config.width}x${config.height}: handoff labels must stay outside the grid cells (${JSON.stringify(handoff)})`);
   if(turn===18)await page.screenshot({path:path.join(evidence,`${config.width}x${config.height}-${config.textSize}-${config.reduced?'reduced':'normal'}-turn-18-board-handoff.png`)});
  }
  if(turn<21)await advanceOne(page,turn+1);
 }
 assert.deepEqual(errors,[],`${config.width}x${config.height}: no browser errors during the 21-line film`);
 await context.close();
}

(async()=>{
 await listen();const browser=await chromium.launch({channel:process.env.CI?undefined:'chrome',headless:true});
 for(const config of [
  {width:320,height:568,reduced:false,textSize:'normal'},
  {width:390,height:844,reduced:false,textSize:'normal'},
  {width:320,height:568,reduced:true,textSize:'normal'},
  {width:390,height:844,reduced:true,textSize:'normal'},
  {width:320,height:568,reduced:true,textSize:'large'}
 ])await runOpening(browser,config);
 const gameContext=await browser.newContext({viewport:{width:320,height:568},reducedMotion:'reduce'}),gamePage=await gameContext.newPage();
 await gamePage.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});await gamePage.evaluate(()=>{LatchlingsCinematics?.finish(true);LatchlingsStoryTheme?.close(false);startLevel(1);LatchlingsCinematics?.finish(true);LatchlingsStoryTheme?.close(false)});
 await gamePage.waitForFunction(()=>document.body.dataset.screen==='game'&&Number(currentLevel)===1);
 const rail=await gamePage.evaluate(()=>{
  const box=s=>document.querySelector(s)?.getBoundingClientRect().toJSON();
  return {copy:document.querySelector('[data-route-handoff]')?.textContent||'',routeTip:document.querySelector('#mechanicNote .mechanic-chip-copy')?.innerText||'',tip:box('#mechanicNote'),handoff:box('[data-route-handoff]'),board:box('#board'),controls:box('.controls'),children:[...document.querySelector('#mechanicNote').children].map(el=>({text:el.innerText,box:el.getBoundingClientRect().toJSON()})),overflow:document.documentElement.scrollWidth>innerWidth};
 });
 await gamePage.screenshot({path:path.join(evidence,'320x568-level-1-route-handoff.png')});
 assert(rail.copy.includes('Bakery Perch')&&rail.copy.includes('Little Home Porch'),`Level 1 Route Tip must repeat the Opening origin and destination: ${rail.copy}`);
 assert(/route model/i.test(rail.copy)&&/not an island map/i.test(rail.copy),`Level 1 must say the grid is a route model, not island geography: ${rail.copy}`);
 assert(rail.routeTip.includes('Use edges and rocks for stops.'),'Level 1 route handoff must preserve the existing route instruction.');
 assert(!overlap(rail.tip,rail.board)&&!overlap(rail.handoff,rail.board)&&!overlap(rail.tip,rail.controls)&&!overlap(rail.handoff,rail.controls),`Level 1 handoff must not cover puzzle cells or controls: ${JSON.stringify(rail)}`);
 assert.equal(rail.overflow,false,'Level 1 semantic handoff must not cause horizontal overflow');
 await gameContext.close();await browser.close();server.close();
 console.log(`PASS Opening errands, real-landmark labels, map handoff, Level 1 route-model explanation; captures ${evidence}`);
})().catch(error=>{console.error(error);server.close();process.exit(1)});
