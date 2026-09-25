'use strict';
const assert=require('assert');
const fs=require('fs');
const http=require('http');
const os=require('os');
const path=require('path');
const {chromium}=require('playwright');

const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.wav':'audio/wav'};
const allViewports=[{width:320,height:568},{width:360,height:800},{width:390,height:844},{width:430,height:932},{width:844,height:390}];
const viewports=process.env.PHONE_STAGE_VIEWPORT?allViewports.filter(value=>`${value.width}x${value.height}`===process.env.PHONE_STAGE_VIEWPORT):allViewports;
const textSizes=process.env.PHONE_STAGE_TEXT?[process.env.PHONE_STAGE_TEXT]:['normal','large'];
const motionModes=process.env.PHONE_STAGE_MOTION?[process.env.PHONE_STAGE_MOTION]:['os-reduced','in-game-reduced'];
const screens=['home','opening-long','later-film','level-1','level-366','atlas','story-journal','settings','ending'];
const server=http.createServer((request,response)=>{
 const url=new URL(request.url,'http://127.0.0.1');
 const requested=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
 const file=path.join(root,requested.endsWith('/')?`${requested}index.html`:requested);
 const relative=path.relative(root,file);
 if(relative.startsWith('..')||path.isAbsolute(relative))return response.writeHead(403).end();
 fs.readFile(file,(error,data)=>{if(error)return response.writeHead(404).end();response.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});response.end(data)});
});

const waitPaint=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
const overlaps=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
async function settle(page){await page.waitForTimeout(80);await waitPaint(page)}
async function enterLevel(page,level){
 await page.evaluate(value=>{window.LatchlingsCinematics?.finish(true);window.LatchlingsStoryTheme?.close(false);startLevel(value);window.LatchlingsCinematics?.finish(true);window.LatchlingsStoryTheme?.close(false)},level);
 await page.waitForFunction(value=>currentLevel===value&&document.body.dataset.screen==='game',level);
 await page.waitForFunction(()=>!animating);
 await page.waitForTimeout(120);
 await page.evaluate(()=>{window.LatchlingsCinematics?.finish(true);window.LatchlingsStoryTheme?.close(false)});
 await page.waitForFunction(()=>!document.querySelector('#storyCardOverlay.show')&&!document.querySelector('#cinematicOverlay.show'));
 await settle(page);
}
async function showCinematic(page,id){
 await page.evaluate(cinematicId=>{window.LatchlingsCinematics?.finish(true);window.LatchlingsCinematics.show(cinematicId,{markSeen:false})},id);
 await page.waitForFunction(cinematicId=>LatchlingsCinematics.active===cinematicId,id);
 const target=await page.evaluate(cinematicId=>{
  const turns=LatchlingsCinematics.CINEMATICS[cinematicId].beats.flatMap(beat=>beat.lines.map(line=>({speaker:line[0],text:line[1]})));
  return turns.reduce((best,turn,index)=>turn.text.length>turns[best].text.length?index:best,0);
 },id);
 let current=await page.evaluate(cinematicId=>{
  const api=LatchlingsCinematics;return api.CINEMATICS[cinematicId].beats.slice(0,api.beat).reduce((sum,beat)=>sum+beat.lines.length,0)+api.line;
 },id);
 while(current<target){
  await page.locator('#cinematicNext').click();
  const before=current;
  await page.waitForFunction(({cinematicId,prior})=>{const api=LatchlingsCinematics;return api.active===cinematicId&&api.CINEMATICS[cinematicId].beats.slice(0,api.beat).reduce((sum,beat)=>sum+beat.lines.length,0)+api.line>prior},{cinematicId:id,prior:before});
  current=await page.evaluate(cinematicId=>{const api=LatchlingsCinematics;return api.CINEMATICS[cinematicId].beats.slice(0,api.beat).reduce((sum,beat)=>sum+beat.lines.length,0)+api.line},id);
 }
 await settle(page);
}
async function assertCinematic(page,config,label){
 const state=await page.evaluate(()=>{
  const box=selector=>{const rect=document.querySelector(selector).getBoundingClientRect();return{left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,width:rect.width,height:rect.height}};
  const body=document.querySelector('.cinematic-lines .narrator-only span')||document.querySelector('.cin-opening-bubble>span')||document.querySelector('.cinematic-lines p.is-current>span');
  const stage=box('#cinematicStage'),copy=box('.cinematic-copy'),footer=box('.cinematic-footer'),next=box('#cinematicNext'),skip=box('#cinematicSkip');
  const range=body?document.createRange():null;if(range)range.selectNodeContents(body);
  const bodyLines=range?[...range.getClientRects()].map(rect=>({top:rect.top,bottom:rect.bottom,left:rect.left,right:rect.right})):[];
  return{font:body?parseFloat(getComputedStyle(body).fontSize):0,body:body?.innerText||'',bodyLines,stage,copy,footer,next,skip,overflow:document.documentElement.scrollWidth>innerWidth,running:document.querySelector('#cinematicStage').getAnimations({subtree:true}).filter(animation=>animation.playState==='running').length};
 });
 assert(state.body,`${label}: essential line must render`);
 assert(state.font>=(config.textSize==='large'?17:15),`${label}: copy is ${state.font}px at ${config.textSize}`);
 if(config.width>config.height)assert(state.stage.right<=state.copy.left+1,`${label}: story copy must remain beside, not over, its scene`);
 else assert(state.stage.bottom<=state.copy.top+1,`${label}: story copy must remain below its scene`);
 assert(state.copy.bottom<=state.footer.top+1,`${label}: copy must not cover fixed cinematic controls`);
 assert(state.bodyLines.length>0&&state.bodyLines.every(line=>line.top>=state.copy.top-1&&line.bottom<=state.copy.bottom+1&&line.bottom<=state.footer.top+1),`${label}: every rendered line of the active spoken text must fit above the fixed footer (${JSON.stringify({copy:state.copy,footer:state.footer,bodyLines:state.bodyLines})})`);
 for(const control of ['next','skip'])assert(state[control].height>=44&&state[control].bottom<=config.height+1,`${label}: ${control} must remain a visible 44px target`);
 assert(state.footer.bottom<=config.height+1,`${label}: cinematic footer must remain onscreen`);
 assert(!state.overflow,`${label}: page must not scroll horizontally`);
 assert.equal(state.running,0,`${label}: OS/in-game Reduced Motion should settle without running stage animations`);
}
async function capture(page,config,textSize,motion,screenName){
 await settle(page);
 const horizontal=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,body:document.body.scrollWidth,width:innerWidth}));
 assert(horizontal.doc<=horizontal.width&&horizontal.body<=horizontal.width,`${config.width}x${config.height} ${textSize} ${motion} ${screenName}: horizontal document overflow ${JSON.stringify(horizontal)}`);
 const screenshot=path.join(os.tmpdir(),`latchlings-phone-stage-${config.width}x${config.height}-${textSize}-${motion}-${screenName}.png`);
 await page.screenshot({path:screenshot,fullPage:false});
 return screenshot;
}

(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:process.env.CI?undefined:'chrome',headless:true});
 const errors=[],captures=[];
 try{
  for(const viewport of viewports){
   const context=await browser.newContext({viewport,reducedMotion:'reduce'}),page=await context.newPage();
   page.on('pageerror',error=>errors.push(`${viewport.width}x${viewport.height}: ${error.message}`));
   await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
   await page.waitForFunction(()=>document.querySelector('#homeTitleFrame')?.contentDocument?.readyState==='complete');
   await page.evaluate(()=>{
    localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1,'across-drift':1,'old-maps':1,homeward:1}));
    localStorage.setItem('latchlings_story_cards_seen_v1',JSON.stringify({1:1,101:1,201:1,301:1,366:1}));
    progress={unlocked:366,stars:{1:3,2:2,50:3,100:2,150:2,200:3,250:2,300:3,350:2,365:3}};
   });
   for(const textSize of textSizes)for(const motion of motionModes){
    const osReduced=motion==='os-reduced';
    await page.emulateMedia({reducedMotion:osReduced?'reduce':'no-preference'});
    await page.evaluate(({textSize,osReduced})=>{LatchlingsPrefs.set('textSize',textSize);LatchlingsPrefs.set('motion',osReduced?'system':'reduced')},{textSize,osReduced});
    const config={...viewport,textSize,motion};

    await page.evaluate(()=>{window.LatchlingsCinematics?.finish(true);window.LatchlingsStoryTheme?.close(false);screen('home')});
    const home=await page.evaluate(()=>{const frame=document.querySelector('#homeTitleFrame'),frameBox=frame.getBoundingClientRect(),doc=frame.contentDocument,sx=frameBox.width/frame.clientWidth,sy=frameBox.height/frame.clientHeight,project=element=>{const rect=element.getBoundingClientRect();return{left:frameBox.left+rect.left*sx,right:frameBox.left+rect.right*sx,top:frameBox.top+rect.top*sy,bottom:frameBox.top+rect.bottom*sy,width:rect.width*sx,height:rect.height*sy}};return{frame:{top:frameBox.top,bottom:frameBox.bottom},island:project(doc.querySelector('#c2 .island-model')),brand:project(doc.querySelector('#c2 .toy-brand')),tools:project(doc.querySelector('#c2 .home-tools')),play:project(doc.querySelector('#c2 .play')),secondary:[...doc.querySelectorAll('#c2 .secondary button')].map(project)}});
    assert(home.play.height>=44&&home.play.top>=0&&home.play.bottom<=viewport.height,`${viewport.width}x${viewport.height}: Home Play must stay inside the viewport (${JSON.stringify(home)})`);
    assert(home.secondary.length===2&&home.secondary.every(button=>button.height>=44&&button.top>=0&&button.bottom<=viewport.height&&button.left>=0&&button.right<=viewport.width),`${viewport.width}x${viewport.height}: both Home secondary actions must stay tappable (${JSON.stringify(home)})`);
    assert(!overlaps(home.brand,home.tools),`${viewport.width}x${viewport.height}: Home title must not cover the header controls (${JSON.stringify(home)})`);
    if(viewport.width>viewport.height)assert(home.island.right+8<=home.play.left,`${viewport.width}x${viewport.height}: Home actions must not cover the island scene (${JSON.stringify(home)})`);
    else assert(home.island.bottom+4<=home.play.top,`${viewport.width}x${viewport.height}: Home actions must not cover the island scene (${JSON.stringify(home)})`);
    captures.push(await capture(page,config,textSize,motion,'home'));

    await showCinematic(page,'opening');
    await assertCinematic(page,config,`${viewport.width}x${viewport.height} Opening long line`);
    captures.push(await capture(page,config,textSize,motion,'opening-long'));
    await page.evaluate(()=>LatchlingsCinematics.finish(true));

    await showCinematic(page,'across-drift');
    await assertCinematic(page,config,`${viewport.width}x${viewport.height} later film`);
    captures.push(await capture(page,config,textSize,motion,'later-film'));
    await page.evaluate(()=>LatchlingsCinematics.finish(true));

    await enterLevel(page,1);
    const levelOne=await page.evaluate(()=>{const box=selector=>{const rect=document.querySelector(selector).getBoundingClientRect();return{left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,width:rect.width,height:rect.height}};return{game:box('#game'),rail:box('#storyRailSlot'),board:box('#board'),note:box('#mechanicContext'),controls:box('#game .controls'),reset:box('#resetLevelBtn'),hint:box('#hintBtn'),dpad:box('#game .dpad'),overlays:[...document.querySelectorAll('#overlay.show,#storyCardOverlay.show,#cinematicOverlay.show')].length}});
    assert.equal(levelOne.overlays,0,`${viewport.width}x${viewport.height}: Level 1 must be unobstructed`);
    for(const [name,box] of Object.entries({board:levelOne.board,reset:levelOne.reset,hint:levelOne.hint,dpad:levelOne.dpad}))assert(box.left>=-1&&box.right<=viewport.width+1&&box.top>=-1&&box.bottom<=viewport.height+1,`${viewport.width}x${viewport.height}: ${name} must remain in the game viewport (${JSON.stringify(box)})`);
    assert(!overlaps(levelOne.rail,levelOne.board),`${viewport.width}x${viewport.height} ${textSize}: Story rail must not cover the puzzle board (${JSON.stringify(levelOne)})`);
    if(viewport.width===320&&viewport.height===568)assert(levelOne.board.top-levelOne.rail.bottom>=2,`${viewport.width}x${viewport.height} ${textSize}: Story rail and puzzle board must retain at least a 2px layout gap (${JSON.stringify(levelOne)})`);
    assert(!overlaps(levelOne.board,levelOne.note),`${viewport.width}x${viewport.height} ${textSize}: Route Tip must not cover puzzle cells (${JSON.stringify(levelOne)})`);
    assert(!overlaps(levelOne.note,levelOne.controls),`${viewport.width}x${viewport.height} ${textSize}: Route Tip must not cover gameplay controls (${JSON.stringify(levelOne)})`);
    captures.push(await capture(page,config,textSize,motion,'level-1'));

    await enterLevel(page,366);
    const level366=await page.evaluate(()=>{const rect=selector=>document.querySelector(selector).getBoundingClientRect().toJSON();return{size:document.querySelector('#board').dataset.gridSize,scroll:document.documentElement.scrollWidth,game:rect('#game'),rail:rect('#storyRailSlot'),boardWrap:rect('.board-wrap'),board:rect('#board'),note:rect('#mechanicContext'),controls:rect('#game .controls'),dpad:rect('#game .dpad'),cell:rect('#board .cell')}});
    assert.equal(level366.size,'7',`${viewport.width}x${viewport.height}: dense Level 366 must render its 7x7 board`);
    for(const [name,box] of Object.entries({board:level366.board,reset:level366.controls,dpad:level366.dpad}))assert(box.left>=-1&&box.right<=viewport.width+1&&box.top>=-1&&box.bottom<=viewport.height+1,`${viewport.width}x${viewport.height}: Level 366 ${name} must stay onscreen (${JSON.stringify(box)})`);
    for(const [before,after] of [['rail','board'],['board','note'],['note','controls']])assert(!overlaps(level366[before],level366[after]),`${viewport.width}x${viewport.height} ${textSize}: Level 366 ${before} and ${after} must not overlap (${JSON.stringify(level366)})`);
    assert(level366.board.left>=level366.boardWrap.left&&level366.board.right<=level366.boardWrap.right&&level366.board.top>=level366.boardWrap.top&&level366.board.bottom<=level366.boardWrap.bottom,`${viewport.width}x${viewport.height}: Level 366 board must stay within its layout region (${JSON.stringify(level366)})`);
    if(viewport.width===320&&textSize==='large')assert(level366.cell.width>=25,`${viewport.width}x${viewport.height}: Large Text Level 366 cells must remain at least 25px wide`);
    captures.push(await capture(page,config,textSize,motion,'level-366'));

    await page.evaluate(()=>{window.LatchlingsStoryTheme?.close(false);window.LatchlingsCinematics?.finish(true);chapterView=1;rangeView=0;screen('levels');renderChapter()});
    await page.waitForFunction(()=>document.body.dataset.screen==='levels');
    await page.waitForFunction(()=>!!document.querySelector('#atlasNodeDetail'));
    const atlas=await page.evaluate(()=>{const box=element=>element.getBoundingClientRect().toJSON();return{map:box(document.querySelector('#levelGrid')),detail:box(document.querySelector('#atlasNodeDetail')),footer:box(document.querySelector('.atlas-footer')),overflow:document.documentElement.scrollWidth>innerWidth}});
    assert(atlas.map.width>viewport.width*(viewport.width>viewport.height ? .32 : .7),`${viewport.width}x${viewport.height}: Atlas map must remain dominant in its orientation (${JSON.stringify(atlas.map)})`);
    if(viewport.width<=viewport.height)assert(atlas.map.height>viewport.height*.35,`${viewport.width}x${viewport.height}: Atlas map must remain a dominant portrait region`);
    assert(atlas.footer.bottom<=viewport.height+1,`${viewport.width}x${viewport.height}: Atlas continue action must remain onscreen`);
    assert(!atlas.overflow,`${viewport.width}x${viewport.height}: Atlas must not overflow horizontally`);
    captures.push(await capture(page,config,textSize,motion,'atlas'));

    await page.evaluate(()=>{openStoryScreen();setStorySection('Journey')});
    await page.waitForFunction(()=>document.body.dataset.screen==='story'&&!document.querySelector('#storyJourneyPanel').hidden);
    const story=await page.evaluate(()=>({panel:document.querySelector('#storyJourneyPanel').getBoundingClientRect().toJSON(),tabs:document.querySelector('.story-section-tabs').getBoundingClientRect().toJSON(),height:innerHeight,width:innerWidth,scroll:document.documentElement.scrollWidth}));
    assert(story.panel.bottom<=story.height+1,`${viewport.width}x${viewport.height}: Journal content panel must fit or scroll inside the screen`);
    assert(story.tabs.bottom<=story.height+1&&story.tabs.top>=-1,`${viewport.width}x${viewport.height}: Journal section tabs must remain reachable`);
    assert(story.scroll<=story.width,`${viewport.width}x${viewport.height}: Journal must not overflow horizontally`);
    captures.push(await capture(page,config,textSize,motion,'story-journal'));

    await enterLevel(page,1);
    await page.locator('#pauseBtn').click();
    await page.locator('#pauseSettings').click();
    await page.locator('#overlay.show #settingsClose').waitFor({state:'visible'});
    const settings=await page.evaluate(()=>{const overlay=document.querySelector('#overlay'),modal=document.querySelector('#modal'),close=document.querySelector('#settingsClose'),rect=element=>element.getBoundingClientRect().toJSON();return{overlay:rect(overlay),modal:rect(modal),close:rect(close),height:innerHeight,width:innerWidth,scroll:document.documentElement.scrollWidth,scrollable:getComputedStyle(modal).overflowY}});
    assert(settings.modal.left>=-1&&settings.modal.right<=settings.width+1&&settings.modal.top>=-1&&settings.modal.bottom<=settings.height+1,`${viewport.width}x${viewport.height}: Settings modal must stay within viewport`);
    assert(settings.close.height>=44,`${viewport.width}x${viewport.height}: Settings close must remain a reachable touch target`);
    assert(['auto','scroll'].includes(settings.scrollable),`${viewport.width}x${viewport.height}: long Settings copy/actions need internal scrolling`);
    assert(settings.scroll<=settings.width,`${viewport.width}x${viewport.height}: Settings must not overflow horizontally`);
    captures.push(await capture(page,config,textSize,motion,'settings'));
    await page.locator('#settingsClose').click();
    await page.waitForFunction(()=>document.activeElement?.id==='pauseBtn');

    await page.evaluate(()=>screen('complete'));
    await page.waitForFunction(()=>document.body.dataset.screen==='complete');
    await page.waitForFunction(()=>document.querySelector('.ending-home-frame')?.contentDocument?.readyState==='complete');
    const ending=await page.evaluate(()=>{const rect=selector=>document.querySelector(selector).getBoundingClientRect().toJSON();return{screen:rect('#complete'),main:rect('#complete .home-main'),hero:rect('.ending-hero-pass4'),heading:rect('.ending-hero h1'),stage:rect('.ending-homecoming'),note:rect('.ending-note'),actions:rect('.ending-actions'),primary:rect('#completeHome'),secondary:rect('#completeLevels'),height:innerHeight,width:innerWidth,screenScrollHeight:document.querySelector('#complete').scrollHeight,scroll:document.documentElement.scrollWidth}});
    captures.push(await capture(page,config,textSize,motion,'ending'));
    assert(ending.heading.top>=-1&&ending.heading.bottom<=ending.height+1,`${viewport.width}x${viewport.height}: Ending heading must not clip (${JSON.stringify(ending)})`);
    assert(ending.stage.top>=-1&&ending.stage.bottom<=ending.height+1,`${viewport.width}x${viewport.height}: Ending scene must remain onscreen (${JSON.stringify(ending)})`);
    for(const [name,box] of Object.entries({primary:ending.primary,secondary:ending.secondary}))assert(box.height>=44&&box.top>=-1&&box.bottom<=ending.height+1,`${viewport.width}x${viewport.height}: ending ${name} action must remain visible (${JSON.stringify(ending)})`);
    assert(ending.scroll<=ending.width,`${viewport.width}x${viewport.height}: Ending must not overflow horizontally`);
    console.log(`PASS ${viewport.width}x${viewport.height} ${textSize} ${motion}`);
   }
   await context.close();
  }
  assert.deepStrictEqual(errors,[],'fresh phone-stage matrix must not produce runtime errors');
  assert.equal(captures.length,viewports.length*textSizes.length*motionModes.length*screens.length,'every screen/mode/viewport combination must be captured');
  console.log(`PASS fresh phone-stage matrix: ${captures.length} settled captures, ${viewports.length} viewports, Normal/Large Text, OS and in-game Reduced Motion`);
  console.log(`CAPTURES ${os.tmpdir()} (pattern latchlings-phone-stage-*.png)`);
  console.log('PASS no horizontal overflow, stage/action visibility, gameplay controls, Settings touch target, Ending actions, and Settings focus restoration');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(error=>{console.error(error);process.exitCode=1});
