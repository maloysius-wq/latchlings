'use strict';
const assert=require('assert');
const fs=require('fs');
const http=require('http');
const os=require('os');
const path=require('path');
const {chromium}=require('playwright');

const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((request,response)=>{
 const url=new URL(request.url,'http://127.0.0.1');
 const requested=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
 const file=path.join(root,requested.endsWith('/')?`${requested}index.html`:requested);
 const relative=path.relative(root,file);
 if(relative.startsWith('..')||path.isAbsolute(relative))return response.writeHead(403).end();
 fs.readFile(file,(error,data)=>{if(error)return response.writeHead(404).end();response.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});response.end(data)});
});

const configs=[
 {width:320,height:568},{width:360,height:800},{width:390,height:844},{width:430,height:932}
].flatMap(viewport=>['normal','large'].map(textSize=>({...viewport,textSize})));
const captureLabels=new Set(['opening-narrator','opening-bramble','opening-rowan','later-film']);

async function flatTurns(page,id){
 return page.evaluate(cinematicId=>LatchlingsCinematics.CINEMATICS[cinematicId].beats.flatMap((beat,beatIndex)=>beat.lines.map((line,lineIndex)=>({beatIndex,lineIndex,speaker:line[0],text:line[1]}))),id);
}
async function currentTurn(page,id){
 return page.evaluate(cinematicId=>{
  const api=LatchlingsCinematics;
  return {id:api.active,flat:api.CINEMATICS[cinematicId].beats.slice(0,api.beat).reduce((count,beat)=>count+beat.lines.length,0)+api.line};
 },id);
}
async function advanceTo(page,id,target){
 let state=await currentTurn(page,id);
 if(state.id!==id||state.flat>target)throw new Error(`Cannot advance ${id} from turn ${state.flat} to ${target}`);
 while(state.flat<target){
  await page.locator('#cinematicNext').click();
  const previous=state.flat;
  await page.waitForFunction(({cinematicId,previous})=>{
   const api=LatchlingsCinematics;if(api.active!==cinematicId)return false;
   return api.CINEMATICS[cinematicId].beats.slice(0,api.beat).reduce((count,beat)=>count+beat.lines.length,0)+api.line>previous;
  },{cinematicId:id,previous});
  await page.waitForTimeout(70);
  state=await currentTurn(page,id);
 }
}
async function measure(page){
 return page.evaluate(()=>{
  const root=document.querySelector('#cinematicOverlay'),copy=document.querySelector('.cinematic-copy');
  const body=document.querySelector('.cinematic-lines .narrator-only span')||document.querySelector('.cin-opening-bubble>span')||document.querySelector('.cinematic-lines p.is-current>span');
  const box=element=>{const rect=element.getBoundingClientRect();return {x:rect.x,y:rect.y,width:rect.width,height:rect.height,right:rect.right,bottom:rect.bottom}};
  const footer=document.querySelector('.cinematic-footer'),progress=document.querySelector('.cinematic-progress'),next=document.querySelector('#cinematicNext'),skip=document.querySelector('#cinematicSkip'),title=document.querySelector('#cinematicTitle'),beat=document.querySelector('#cinematicBeat'),stage=document.querySelector('#cinematicStage');
  if(!body)return {missingBody:true};
  const visibleBeat=beat&&getComputedStyle(beat).display!=='none'&&getComputedStyle(beat).visibility!=='hidden';
  return {
   bodyFont:parseFloat(getComputedStyle(body).fontSize),body:box(body),heading:box(visibleBeat?beat:title),copy:box(copy),stage:box(stage),
   footer:box(footer),progress:box(progress),next:box(next),skip:box(skip),
   copyOverflow:getComputedStyle(copy).overflowY,bodyText:body.innerText,
   horizontalOverflow:document.documentElement.scrollWidth>innerWidth
  };
 });
}
function assertReadable(layout,config,label){
 assert(!layout.missingBody,`${label}: essential story body text must be rendered`);
 const min=config.textSize==='large'?17:15;
 assert(layout.bodyFont>=min,`${label} at ${config.width}x${config.height} ${config.textSize}: body copy is ${layout.bodyFont}px, expected at least ${min}px`);
 assert(layout.body.y-layout.heading.bottom<=72,`${label}: copy should start near its scene heading, not be bottom-anchored (${layout.body.y-layout.heading.bottom}px gap)`);
 assert(layout.body.y>=layout.heading.bottom-1,`${label}: story body should not overlap its heading`);
 assert.equal(layout.copyOverflow,'auto',`${label}: the existing copy panel should be the scrollable story region`);
 assert(layout.stage.bottom<=layout.copy.y+1,`${label}: text must remain below the scenic stage`);
 assert(layout.copy.bottom<=layout.footer.y+1,`${label}: copy must remain above the fixed footer`);
 assert(layout.next.height>=44&&layout.next.bottom<=config.height,`${label}: Continue must remain a reachable 44px target`);
 assert(layout.skip.height>=44&&layout.skip.bottom<=config.height,`${label}: Skip must remain a reachable 44px target`);
 assert(!layout.horizontalOverflow,`${label}: document must not scroll horizontally`);
}
function assertStable(reference,current,label){
 for(const key of ['footer','progress','next','skip'])for(const part of ['x','y','width','height']){
  assert(Math.abs(reference[key][part]-current[key][part])<=1,`${label}: ${key}.${part} shifted ${Math.abs(reference[key][part]-current[key][part]).toFixed(2)}px`);
 }
}

(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:process.env.CI?undefined:'chrome',headless:true});
 const errors=[],captures=[];
 try{
  for(const config of configs){
   const context=await browser.newContext({viewport:{width:config.width,height:config.height},reducedMotion:'reduce'});
   const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
   await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
   await page.evaluate(size=>LatchlingsPrefs.set('textSize',size),config.textSize);
   for(const id of ['opening','across-drift','old-maps','homeward']){
    await page.evaluate(cinematicId=>LatchlingsCinematics.show(cinematicId,{markSeen:false}),id);
    await page.waitForFunction(cinematicId=>LatchlingsCinematics.active===cinematicId,id);
    await page.waitForTimeout(100);
    const turns=await flatTurns(page,id);
    const targets=id==='opening'
     ? [...new Set([0,turns.reduce((best,turn,index)=>turn.text.length>turns[best].text.length?index:best,0),turns.findIndex(turn=>turn.speaker==='Bramble'),turns.findIndex(turn=>turn.speaker==='Rowan'),turns.length-1])].filter(index=>index>=0).sort((a,b)=>a-b)
     : [turns.reduce((best,turn,index)=>turn.text.length>turns[best].text.length?index:best,0)];
    const reference=await measure(page);assertReadable(reference,config,`${id} first turn`);
    for(const target of targets){
     await advanceTo(page,id,target);
     const layout=await measure(page),turn=turns[target],label=id==='opening'?`opening ${turn.speaker.toLowerCase()}`:`${id} ${turn.speaker.toLowerCase()}`;
     assertReadable(layout,config,label);assertStable(reference,layout,`${id} turn ${target+1}`);
     if(id==='opening'&&captureLabels.has(`opening-${turn.speaker.toLowerCase()}`)&&[320,390].includes(config.width)){
      const filename=`latchlings-phone-${config.width}x${config.height}-${config.textSize}-opening-turn-${target+1}-${turn.speaker.toLowerCase()}.png`,capture=path.join(os.tmpdir(),filename);
      await page.screenshot({path:capture});captures.push(capture);
     }
     if(id!=='opening'&&[320,390].includes(config.width)){
      const filename=`latchlings-phone-${config.width}x${config.height}-${config.textSize}-${id}-later-film.png`,capture=path.join(os.tmpdir(),filename);
      await page.screenshot({path:capture});captures.push(capture);
     }
    }
    await page.evaluate(()=>LatchlingsCinematics.finish(true));
   }
   await context.close();
  }
  assert.deepStrictEqual(errors,[],'phone readability browser checks must not produce runtime errors');
  console.log(`PASS cinematic copy readability, scroll containment, and fixed navigation at ${configs.length} viewport/text configurations`);
  console.log(`VISUAL CAPTURES ${captures.length} in ${os.tmpdir()}`);
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(error=>{console.error(error);process.exit(1)});
