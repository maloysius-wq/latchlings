const assert=require('assert');
const http=require('http');
const fs=require('fs');
const path=require('path');
const {chromium}=require('playwright');

const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.mp3':'audio/mpeg','.wav':'audio/wav'};
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://127.0.0.1');const requested=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);const file=path.join(root,requested.endsWith('/')?requested+'index.html':requested);if(!file.startsWith(root)){res.writeHead(403).end();return}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(data)})});
const listen=()=>new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));

async function openingGeometry(page,step){
 while(await page.evaluate(()=>Number(document.querySelector('.cin-opening-continuous')?.dataset.step||0))<step){await page.locator('#cinematicNext').click();await page.waitForTimeout(55)}
 await page.waitForTimeout(100);
 return page.evaluate(()=>{
  const rect=selector=>document.querySelector(selector)?.getBoundingClientRect().toJSON();
  const overlap=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
  const frame=document.querySelector('.opening-home-reference'),frameRect=frame.getBoundingClientRect(),doc=frame.contentDocument,scaleX=frameRect.width/frame.clientWidth,scaleY=frameRect.height/frame.clientHeight;
  const toParent=r=>({left:frameRect.left+r.left*scaleX,top:frameRect.top+r.top*scaleY,right:frameRect.left+r.right*scaleX,bottom:frameRect.top+r.bottom*scaleY,width:r.width*scaleX,height:r.height*scaleY});
  const residents=[...doc.querySelectorAll('#c2 [data-resident]')].map(el=>({name:el.dataset.resident,box:toParent(el.getBoundingClientRect())}));
  const visibleProps=[...document.querySelectorAll('[data-opening-mover],.opening-call-box,.opening-player-compass')].filter(el=>parseFloat(getComputedStyle(el).opacity)>.05&&el.getBoundingClientRect().width>0).map(el=>({name:el.getAttribute('data-opening-mover')||el.className,box:el.getBoundingClientRect().toJSON()}));
  const propOverlaps=visibleProps.flatMap(prop=>residents.map(person=>({prop:prop.name,name:person.name,area:overlap(prop.box,person.box)})));
  const routes={};
  for(const [name,targetName] of Object.entries({basket:'porch',water:'garden',play:'play-rock'})){
   const route=document.querySelector(`#opening-route-${name}`),miss=document.querySelector(`.opening-miss-marker[data-miss="${name}"]`).getBoundingClientRect(),target=document.querySelector(`.opening-target-marker[data-target="${targetName}"]`).getBoundingClientRect(),mover=document.querySelector(`[data-opening-mover="${name}"]`).getBoundingClientRect();
   const len=route.getTotalLength(),p=route.getPointAtLength(len),screen=new DOMPoint(p.x,p.y).matrixTransform(route.getScreenCTM());
   const center=b=>({x:b.left+b.width/2,y:b.top+b.height/2}),dist=(a,b)=>Math.hypot(center(a).x-center(b).x,center(a).y-center(b).y),missCenter=center(miss);
   routes[name]={endpointDistance:Math.hypot(screen.x-missCenter.x,screen.y-missCenter.y),destinationDistance:dist(miss,target),moverToMiss:dist(mover,miss)};
  }
  const stage=document.querySelector('#cinematicStage').getBoundingClientRect();
  return {frame:frameRect.toJSON(),stage:stage.toJSON(),residents,propOverlaps,routes,action:document.querySelector('.cin-opening-continuous').dataset.storyAction};
 });
}

(async()=>{
 await listen();
 const browser=await chromium.launch({channel:process.env.CI?undefined:'chrome',headless:true});
 const failures=[];
 for(const viewport of [{width:360,height:800},{width:390,height:844},{width:430,height:932}]){
  const context=await browser.newContext({viewport});const page=await context.newPage();page.on('pageerror',e=>failures.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
  await page.evaluate(()=>LatchlingsCinematics.show('opening',{markSeen:false}));
  const early=await openingGeometry(page,1);
  assert(early.frame.left>=early.stage.left-1&&early.frame.right<=early.stage.right+1&&early.frame.top>=early.stage.top-1&&early.frame.bottom<=early.stage.bottom+1,`${viewport.width}x${viewport.height}: canonical Little Home must stay inside the cinematic stage`);
  assert.equal(early.residents.length,5,`${viewport.width}x${viewport.height}: all five production residents must come from canonical Little Home`);

  const routes=await openingGeometry(page,10);
  assert.equal(routes.action,'rowan-measures-three-offsets',`${viewport.width}x${viewport.height}: Rowan line must have the offset-comparison visual`);
  assert(routes.propOverlaps.every(x=>x.area<20),`${viewport.width}x${viewport.height}: story props must not cover canonical residents (${routes.propOverlaps.filter(x=>x.area>=20).map(x=>`${x.name}:${x.area.toFixed(0)}`)})`);
  for(const [name,data] of Object.entries(routes.routes)){
   assert(data.endpointDistance<3,`${viewport.width}x${viewport.height}: ${name} route must terminate at its semantic miss marker`);
   assert(data.destinationDistance>=14&&data.destinationDistance<=52,`${viewport.width}x${viewport.height}: ${name} miss must remain visibly near but separate from destination, got ${data.destinationDistance.toFixed(1)}px`);
   assert(data.moverToMiss<4,`${viewport.width}x${viewport.height}: ${name} mover must settle exactly at the miss point, got ${data.moverToMiss.toFixed(1)}px`);
  }
  const call=await openingGeometry(page,13);
  assert.equal(call.action,'waykeeper-call-ready',`${viewport.width}x${viewport.height}: call line must visibly stage the Waykeeper device`);
  assert(call.propOverlaps.every(x=>x.area<20),`${viewport.width}x${viewport.height}: call display must remain clear of canonical residents (${call.propOverlaps.filter(x=>x.area>=20).map(x=>`${x.name}:${x.area.toFixed(0)}`)})`);
  const knowledge=await openingGeometry(page,17);
  assert.equal(knowledge.action,'neighbors-share-local-knowledge',`${viewport.width}x${viewport.height}: Bramble's local-knowledge line must visibly gather knowledge`);

  await page.evaluate(()=>{LatchlingsCinematics.finish(true);startLevel(1)});await page.waitForTimeout(80);
  const controls=await page.evaluate(()=>{const r=s=>document.querySelector(s).getBoundingClientRect().toJSON(),style=s=>getComputedStyle(document.querySelector(s));return {game:r('#game'),controls:r('#game .controls'),reset:r('#resetLevelBtn'),dpad:r('#game .dpad'),hint:r('#hintBtn'),columns:style('#game .controls').gridTemplateColumns,controlWidth:style('#game .controls').width,resetHeight:style('#resetLevelBtn').minHeight,resetRadius:style('#resetLevelBtn').borderRadius,resetFont:style('#resetLevelBtn').fontSize}});
  const short=viewport.height<=720,expectedDpad=Math.min(short?190:224,viewport.width*(short?.45:.53));
  assert(Math.abs(controls.dpad.width-expectedDpad)<1,`${viewport.width}x${viewport.height}: D-pad must use pre-Astra responsive size`);
  assert(controls.controls.width>viewport.width-50,`${viewport.width}x${viewport.height}: lower controls must use the original full game width, got ${controls.controls.width}px`);
  assert.equal(Math.round(controls.reset.width),78,`${viewport.width}x${viewport.height}: Reset must use the original 78px column`);
  assert.equal(Math.round(controls.hint.width),78,`${viewport.width}x${viewport.height}: Hint must use the original 78px column`);
  assert.equal(Math.round(parseFloat(controls.resetHeight)),short?66:80,'side actions must use their pre-Astra height');
  assert.equal(Math.round(parseFloat(controls.resetRadius)),22,'side actions must use their pre-Astra radius');
  assert.equal(Math.round(parseFloat(controls.resetFont)),13,'side actions must use their pre-Astra label size');
  for(const [name,box] of Object.entries({reset:controls.reset,dpad:controls.dpad,hint:controls.hint}))assert(box.left>=controls.game.left-1&&box.right<=controls.game.right+1,`${viewport.width}x${viewport.height}: ${name} must remain visible inside the game`);
  await context.close();
 }
 await browser.close();server.close();assert.deepEqual(failures,[]);console.log('PASS physical-phone canonical Opening geometry and pre-Astra control cluster');
})().catch(error=>{console.error(error);server.close();process.exit(1)});

