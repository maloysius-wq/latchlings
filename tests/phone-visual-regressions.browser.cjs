const assert=require('assert');
const http=require('http');
const fs=require('fs');
const path=require('path');
const {chromium}=require('playwright');

const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.mp3':'audio/mpeg','.wav':'audio/wav'};
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://127.0.0.1');const file=path.join(root,decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(root)){res.writeHead(403).end();return}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(data)})});
const listen=()=>new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));

async function openingGeometry(page,step){
 while(await page.evaluate(()=>Number(document.querySelector('.cin-opening-continuous')?.dataset.step||0))<step){await page.locator('#cinematicNext').click();await page.waitForTimeout(55)}
 await page.waitForTimeout(90);
 return page.evaluate(()=>{
  const rect=selector=>document.querySelector(selector)?.getBoundingClientRect().toJSON();
  const top=rect('.home-top');
  const insidePlateau=box=>{const x=box.left+box.width/2,y=box.bottom-2,rx=top.width/2-box.width*.22,ry=top.height/2-2;return ((x-(top.left+top.width/2))/rx)**2+((y-(top.top+top.height/2))/ry)**2<=1};
  const people=[...document.querySelectorAll('.opening-person')].map(el=>({name:[...el.classList].find(c=>c.startsWith('opening-')&&c!=='opening-person'),box:el.getBoundingClientRect().toJSON()}));
  const overlap=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
  const call=rect('.opening-call-box');
  const fixedProps=['.opening-porch','.opening-garden','.opening-play-rock'].map(selector=>({selector,inside:insidePlateau(rect(selector))}));
  const propOverlaps=[...document.querySelectorAll('.opening-basket,.opening-water-cart,.opening-call-box')].filter(el=>parseFloat(getComputedStyle(el).opacity)>.05).flatMap(el=>{const box=el.getBoundingClientRect().toJSON();return people.map(p=>({prop:el.className,name:p.name,area:overlap(p.box,box)}))});
  const routes={};
  for(const [name,near] of Object.entries({basket:'.opening-porch',water:'.opening-garden',play:'.opening-play-rock'})){
   const route=document.querySelector(`#opening-route-${name}`),anchor=rect(`#opening-anchor-${name}`),destination=rect(near),length=route.getTotalLength(),p=route.getPointAtLength(length),screen=new DOMPoint(p.x,p.y).matrixTransform(route.getScreenCTM());
   routes[name]={anchor,endpointDistance:Math.hypot(screen.x-(anchor.left+anchor.width/2),screen.y-(anchor.top+anchor.height/2)),destinationDistance:Math.hypot((anchor.left+anchor.width/2)-(destination.left+destination.width/2),(anchor.top+anchor.height/2)-(destination.top+destination.height/2)),inside:insidePlateau(anchor)};
  }
  const callPath=document.querySelector('#opening-route-call'),callStart=callPath.getPointAtLength(0),callStartScreen=new DOMPoint(callStart.x,callStart.y).matrixTransform(callPath.getScreenCTM());
  const crew=rect('#opening-anchor-crew');
  return {people:people.map(p=>({...p,inside:insidePlateau(p.box)})),fixedProps,propOverlaps,call,callOverlaps:people.map(p=>({name:p.name,area:overlap(p.box,call)})),callStartDistance:Math.hypot(callStartScreen.x-(call.left+call.width/2),callStartScreen.y-(call.top+call.height/2)),routes,crewInside:insidePlateau(crew),crewOverlaps:people.map(p=>({name:p.name,area:overlap(p.box,crew)}))};
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
  assert(early.people.every(p=>p.inside),`${viewport.width}x${viewport.height}: every resident must stand on Little Home (${early.people.filter(p=>!p.inside).map(p=>p.name)})`);
  assert(early.fixedProps.every(p=>p.inside),`${viewport.width}x${viewport.height}: permanent props must sit on the grassy plateau (${early.fixedProps.filter(p=>!p.inside).map(p=>p.selector)})`);
  const routes=await openingGeometry(page,10);
  assert(routes.people.every(p=>p.inside),`${viewport.width}x${viewport.height}: residents must remain grounded after Pip's route animation (${routes.people.filter(p=>!p.inside).map(p=>p.name)})`);
  assert(routes.propOverlaps.every(x=>x.area<20),`${viewport.width}x${viewport.height}: arrived props must not cover residents (${routes.propOverlaps.filter(x=>x.area>=20).map(x=>`${x.name}:${x.area.toFixed(0)}`)})`);
  for(const [name,data] of Object.entries(routes.routes)){
   assert(data.inside,`${viewport.width}x${viewport.height}: ${name} old stop must remain on the grassy plateau`);
   assert(data.endpointDistance<3,`${name} route must terminate at its visible old-stop marker`);
   assert(data.destinationDistance>=8&&data.destinationDistance<=70,`${viewport.width}x${viewport.height}: ${name} miss must be visibly near its intended destination, got ${data.destinationDistance.toFixed(1)}px`);
  }
  const call=await openingGeometry(page,12);
  assert(call.people.every(p=>p.inside),`${viewport.width}x${viewport.height}: residents must remain grounded during the Waykeeper call (${call.people.filter(p=>!p.inside).map(p=>p.name)})`);
  assert(call.callOverlaps.every(x=>x.area<8),`${viewport.width}x${viewport.height}: call display must not cover a resident (${call.callOverlaps.map(x=>`${x.name}:${x.area.toFixed(0)}`).join(', ')})`);
  assert(call.callStartDistance<18,`${viewport.width}x${viewport.height}: call route must begin at the call display, got ${call.callStartDistance.toFixed(1)}px`);
  const crew=await openingGeometry(page,17);
  assert(crew.people.every(p=>p.inside),`${viewport.width}x${viewport.height}: residents must remain grounded when the helpers arrive (${crew.people.filter(p=>!p.inside).map(p=>p.name)})`);
  assert(crew.crewInside,`${viewport.width}x${viewport.height}: helper route must land on Little Home's grassy edge`);
  assert(crew.crewOverlaps.every(x=>x.area<8),`${viewport.width}x${viewport.height}: helper route landing must remain visually clear of residents (${crew.crewOverlaps.filter(x=>x.area>=8).map(x=>x.name)})`);

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
 await browser.close();server.close();assert.deepEqual(failures,[]);console.log('PASS physical-phone opening geometry and pre-Astra control cluster');
})().catch(error=>{console.error(error);server.close();process.exit(1)});

