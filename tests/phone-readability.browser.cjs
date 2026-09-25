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
async function prepareAtlas(page,chapter){
 return page.evaluate(chapterNumber=>{
  progress={unlocked:3,stars:{1:3,2:2}};currentLevel=3;chapterView=chapterNumber;rangeView=0;
  screen('levels');renderChapter();
  const map=document.querySelector('#levelGrid'),detail=document.querySelector('#atlasNodeDetail'),mapRect=map.getBoundingClientRect();
  const box=element=>{const rect=element.getBoundingClientRect();return {left:rect.left,top:rect.top,right:rect.right,bottom:rect.bottom,width:rect.width,height:rect.height}};
  const meta=STORY.levelMeta(chapterNumber===1?3:201);
  return {
   chapter:chapterNumber,detailExists:!!detail,detailText:detail?.innerText||'',detailFont:detail?parseFloat(getComputedStyle(detail).fontSize):0,
   detailLive:detail?.getAttribute('aria-live')||'',detailBox:detail?box(detail):null,
   location:meta.location,lockedTitle:STORY.levelMeta(chapterNumber===1?4:201).title,
   map:box(map),mapNodes:[...map.querySelectorAll('.atlas-node')].map(node=>({level:Number(node.dataset.level),state:node.dataset.state,disabled:node.disabled,box:box(node)})),
   objectiveFont:parseFloat(getComputedStyle(document.querySelector('.atlas-chapter-objective')||document.querySelector('.atlas-chapter-blurb')).fontSize),
   rangeDetailFont:parseFloat(getComputedStyle(document.querySelector('.atlas-range-current b')).fontSize),
   horizontalOverflow:document.documentElement.scrollWidth>innerWidth,currentLevel
  };
 },chapter);
}
function assertAtlasSnapshot(state,config,label){
 assert(state.detailExists,`${label}: Atlas must show the selected/current destination detail`);
 assert(state.detailFont>=14,`${label}: destination detail must be at least 14px, got ${state.detailFont}px`);
 assert.equal(state.detailLive,'polite',`${label}: destination detail must announce changes politely`);
 if(!state.detailText.includes('Locked'))assert(state.detailText.includes(state.location),`${label}: unlocked destination should use its known story location`);
 assert(state.map.height>=config.height*.35,`${label}: map must remain a dominant part of the phone layout`);
 assert(state.mapNodes.every(node=>node.box.left>=state.map.left-1&&node.box.right<=state.map.right+1&&node.box.top>=state.map.top-1&&node.box.bottom<=state.map.bottom+1),`${label}: every route node must remain inside the map bounds`);
 if(state.detailBox){const covered=state.mapNodes.filter(node=>!(node.box.right<=state.detailBox.left||node.box.left>=state.detailBox.right||node.box.bottom<=state.detailBox.top||node.box.top>=state.detailBox.bottom));assert.equal(covered.length,0,`${label}: destination panel must not cover route nodes (${JSON.stringify({detail:state.detailBox,covered:covered.map(node=>({level:node.level,box:node.box}))})})`)}
 assert(state.objectiveFont>=11,`${label}: chapter context should not remain microcopy (${state.objectiveFont}px)`);
 assert(state.rangeDetailFont>=11,`${label}: route-stretch detail should remain readable (${state.rangeDetailFont}px)`);
 assert(!state.horizontalOverflow,`${label}: Atlas must not overflow horizontally`);
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
   if([320,390].includes(config.width)){
    const chapterOne=await prepareAtlas(page,1);
    const chapterOneCapture=path.join(os.tmpdir(),`latchlings-atlas-ch1-${config.width}x${config.height}-${config.textSize}.png`);
    await page.screenshot({path:chapterOneCapture});captures.push(chapterOneCapture);
    assertAtlasSnapshot(chapterOne,config,'Chapter 1 Atlas');
    const interaction=await page.evaluate(()=>{
     const map=document.querySelector('#levelGrid'),detail=document.querySelector('#atlasNodeDetail'),initialMapHeight=map.getBoundingClientRect().height,beforeLevel=currentLevel;
     const restored=map.querySelector('.atlas-node[data-level="2"]'),current=map.querySelector('.atlas-node[data-level="3"]'),locked=map.querySelector('.atlas-node[data-level="4"]');
     restored.focus();const restoredText=detail.innerText;
     current.focus();const currentText=detail.innerText;current.blur();const blurText=detail.innerText;
     locked.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));const lockedText=detail.innerText;
     locked.click();
     return {restoredText,currentText,blurText,lockedText,lockedDisabled:locked.disabled,levelBefore:beforeLevel,levelAfter:currentLevel,mapHeight:map.getBoundingClientRect().height,initialMapHeight,lockedTitle:STORY.levelMeta(4).title,bodyText:document.body.innerText};
    });
    assert(interaction.restoredText.includes('Restored')&&interaction.restoredText.includes('Level 2'),'focusing a restored node must show its name and restored state');
    assert(interaction.currentText.includes('Current')&&interaction.currentText.includes('Level 3'),'focusing the current node must show its name and current state');
    assert(interaction.blurText.includes('Level 3')&&interaction.blurText.includes('Current'),'leaving node focus must restore the current destination detail');
    assert(interaction.lockedDisabled,'locked level controls must remain disabled');
    assert(interaction.lockedText.includes('Level 4')&&interaction.lockedText.includes('Locked'),'hovering a locked node must state only its locked level');
    assert(!interaction.lockedText.includes(interaction.lockedTitle)&&!interaction.bodyText.includes(interaction.lockedTitle),'locked nodes must not leak their future story result into the DOM text');
    assert.equal(interaction.levelAfter,interaction.levelBefore,'focusing or inspecting nodes must not start a level');
    assert(Math.abs(interaction.mapHeight-interaction.initialMapHeight)<=1,'focus/hover detail changes must not resize the map');

    const chapterFive=await prepareAtlas(page,5);
    const chapterFiveCapture=path.join(os.tmpdir(),`latchlings-atlas-ch5-${config.width}x${config.height}-${config.textSize}.png`);
    await page.screenshot({path:chapterFiveCapture});captures.push(chapterFiveCapture);
    assertAtlasSnapshot(chapterFive,config,'Chapter 5 locked Atlas');
    assert(chapterFive.detailText.includes('Level 201')&&chapterFive.detailText.includes('Locked'),'a locked chapter must show a spoiler-safe level/state detail');
    assert(!chapterFive.detailText.includes(chapterFive.lockedTitle),'locked destination detail must not reveal its future result');
   }
   await context.close();
  }
  assert.deepStrictEqual(errors,[],'phone readability browser checks must not produce runtime errors');
  console.log(`PASS cinematic copy readability, scroll containment, and fixed navigation at ${configs.length} viewport/text configurations`);
  console.log(`VISUAL CAPTURES ${captures.length} in ${os.tmpdir()}`);
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(error=>{console.error(error);process.exit(1)});
