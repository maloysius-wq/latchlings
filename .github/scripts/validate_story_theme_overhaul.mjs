import { chromium } from 'playwright';
import fs from 'fs';

const BASE='http://127.0.0.1:8138/';
const OUT='story-theme-renders';
fs.mkdirSync(OUT,{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844}});
const page=await context.newPage();
const problems=[];
page.on('console',m=>{if(m.type()==='error')problems.push('console:'+m.text())});
page.on('pageerror',e=>problems.push('page:'+e.message));
page.on('requestfailed',r=>{const u=r.url(),err=r.failure()?.errorText||'';if(/\.mp3($|\?)/.test(u)&&/ERR_ABORTED/.test(err))return;problems.push('request:'+u+':'+err)});
const badResponses=[];
page.on('response',r=>{if(r.status()>=400)badResponses.push(`${r.status()}:${r.url()}`)});
function ok(cond,msg){if(!cond)throw new Error(msg)}
async function openLevel(L,{clearSeen=false}={}){
  if(clearSeen)await page.evaluate(()=>localStorage.removeItem('latchlings_story_cards_seen_v1'));
  await page.evaluate(L=>startLevel(L),L);
  await page.waitForTimeout(150);
}
async function dismissStory(){if(await page.locator('#storyCardOverlay.show').count())await page.click('#storyCardContinue')}
await page.goto(BASE,{waitUntil:'domcontentloaded'});
await page.waitForSelector('#homeTitleFrame');
await page.waitForTimeout(250);

console.log('STEP asset pack');
const assetNames=['grass.webp','earth.webp','wood.webp','fabric-market.webp','cobblestone.webp','bookcloth.webp','metal-plate.webp'];
const assetStatus=await page.evaluate(async names=>Promise.all(names.map(async name=>{const r=await fetch('assets/textures/'+name,{cache:'no-store'});return {name,status:r.status,ok:r.ok,type:r.headers.get('content-type')}})),assetNames);
for(const a of assetStatus)ok(a.ok&&a.status===200,`Texture failed ${a.name}: ${a.status}`);

console.log('STEP story card layout');
await openLevel(1,{clearSeen:true});
await page.waitForSelector('#storyCardOverlay.show');
const cardState=await page.evaluate(()=>{
  const board=document.getElementById('board').getBoundingClientRect(),note=document.getElementById('mechanicNote').getBoundingClientRect(),overlay=document.getElementById('storyCardOverlay');
  return {title:document.getElementById('storyCardTitle').textContent,context:document.getElementById('storyCardContext').textContent,location:document.getElementById('storyCardLocation').textContent,kind:document.getElementById('storyCardKind').textContent,noteText:document.getElementById('mechanicNote').textContent,noteH:note.height,board:{x:board.x,y:board.y,w:board.width,h:board.height},props:document.getElementById('levelProps').dataset.props,overlayPos:getComputedStyle(overlay).position};
});
ok(cardState.title==='Breakfast Basket','Level 1 story title wrong');
ok(cardState.context.includes('herb basket'),'Level 1 story context missing');
ok(cardState.location.includes('Chapter 1')&&cardState.location.includes('Sunpetal Meadows'),'Story location metadata missing');
ok(cardState.kind==='Chapter opening','Level 1 should be chapter opening');
ok(cardState.noteText.includes('Route tip'),'Mechanic chip missing label');
ok(!cardState.noteText.includes('Breakfast Basket')&&!cardState.noteText.includes('herb basket'),'Narrative still crammed into mechanic chip');
ok(cardState.noteH<=42,`Mechanic chip too tall: ${cardState.noteH}`);
ok(cardState.overlayPos==='fixed','Story card overlay is not fixed');
ok(cardState.props.includes('basket'),'Breakfast Basket did not get basket set dressing');
await page.screenshot({path:`${OUT}/story-card-ch1.png`,fullPage:true});
await page.click('#storyCardContinue');
await page.waitForTimeout(80);
const afterCard=await page.evaluate(()=>{const r=document.getElementById('board').getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,shown:document.getElementById('storyCardOverlay').classList.contains('show')}});
ok(!afterCard.shown,'Story card did not close');
for(const k of ['x','y','w','h'])ok(Math.abs(afterCard[k]-cardState.board[k])<1.1,`Board shifted when story card closed: ${k}`);

console.log('STEP story seen/reopen behavior');
await page.evaluate(()=>startLevel(1));
await page.waitForTimeout(180);
ok(await page.locator('#storyCardOverlay.show').count()===0,'Routine retry replayed already-seen story card');
await page.click('#storyCardBtn');
await page.waitForSelector('#storyCardOverlay.show');
ok((await page.locator('#storyCardContinue').textContent())==='Back to board','Manual story reopen label wrong');
await page.click('#storyCardContinue');

console.log('STEP level-specific props');
await openLevel(3); await dismissStory();
const props3=await page.locator('#levelProps').getAttribute('data-props');
ok(props3?.includes('kite'),`Blue Kite missing kite prop: ${props3}`);
await openLevel(5); await dismissStory();
const props5=await page.locator('#levelProps').getAttribute('data-props');
ok(props5?.includes('parcel'),`Mail Sack missing parcel prop: ${props5}`);
ok(props3!==props5,'Different story levels received identical set dressing');

console.log('STEP all chapter materials');
const reps=[1,51,101,151,201,251,301,351];
const chapterStates=[];
for(let i=0;i<reps.length;i++){
  const L=reps[i];await openLevel(L);await dismissStory();await page.waitForTimeout(50);
  const s=await page.evaluate(({L,ch})=>{
    const app=document.getElementById('app'),board=document.getElementById('board'),cell=board.querySelector('.cell'),props=document.getElementById('levelProps'),mat=document.getElementById('chapterMaterialBackdrop');
    const br=board.getBoundingClientRect();
    return {L,ch,appClass:app.className,appBG:getComputedStyle(app).backgroundImage,matBG:getComputedStyle(mat).backgroundImage,boardBG:getComputedStyle(board).backgroundImage,cellBG:cell?getComputedStyle(cell).backgroundImage:'',props:props.dataset.props,count:props.children.length,pointer:getComputedStyle(props).pointerEvents,board:{x:br.x,y:br.y,w:br.width,h:br.height},scrollW:document.documentElement.scrollWidth,innerW:innerWidth};
  },{L,ch:i+1});
  ok(s.appClass.includes(`theme-ch${i+1}`),`Chapter ${i+1} theme class missing`);
  ok(/assets\/textures\//.test(s.matBG),`Chapter ${i+1} material backdrop missing texture`);
  ok(/assets\/textures\//.test(s.boardBG),`Chapter ${i+1} board missing texture`);
  ok(/assets\/textures\//.test(s.cellBG),`Chapter ${i+1} cells missing texture`);
  ok(s.count>=2,`Chapter ${i+1} has too little set dressing`);
  ok(s.pointer==='none',`Chapter ${i+1} props intercept pointer events`);
  ok(s.board.w>=330&&s.board.h>=330,`Chapter ${i+1} board became too small: ${s.board.w}x${s.board.h}`);
  ok(s.scrollW<=s.innerW+1,`Chapter ${i+1} horizontal overflow ${s.scrollW}/${s.innerW}`);
  chapterStates.push(s);
  await page.screenshot({path:`${OUT}/chapter-${i+1}.png`,fullPage:true});
}
ok(new Set(chapterStates.map(x=>x.appBG)).size===8,'Chapter canvas backgrounds are not all distinct');
ok(new Set(chapterStates.map(x=>x.props)).size>=6,'Set dressing lacks chapter variety');

console.log('STEP market story art');
await page.evaluate(()=>startLevel(151));await page.waitForTimeout(80);await page.click('#storyCardBtn');await page.waitForSelector('#storyCardOverlay.show');
const market=await page.evaluate(()=>({title:storyCardTitle.textContent,loc:storyCardLocation.textContent,scene:getComputedStyle(storyCardScene).backgroundImage,props:storyCardScene.querySelectorAll('.story-scene-prop').length}));
ok(market.title.includes('Berry Stall'),'Market story card title wrong');ok(market.loc.includes('Masquerade Keep'),'Market story card location wrong');ok(market.scene.includes('fabric-market.webp'),'Market story card is not using fabric material');ok(market.props>=2,'Market vignette missing props');
await page.screenshot({path:`${OUT}/story-card-market.png`,fullPage:true});await page.click('#storyCardContinue');

console.log('STEP pause hint rules');
await page.click('#pauseBtn');await page.waitForSelector('#overlay.show');ok((await page.locator('#modal').textContent()).includes('Paused'),'Pause modal failed');await page.click('#resumeBtn');
await page.click('#hintBtn');await page.waitForSelector('#overlay.show');ok((await page.locator('#modal').textContent()).includes('Hint'),'Hint modal failed');await page.click('#hintClose');
await page.evaluate(()=>rulesModal());await page.waitForSelector('#overlay.show');ok((await page.locator('#modal').textContent()).includes('How the board works'),'Rules modal failed');await page.click('#rulesClose');

console.log('STEP solve representative board');
await page.evaluate(()=>startLevel(1));await page.waitForTimeout(120);await dismissStory();
const sol=await page.evaluate(()=>LEVELS[0].solution.map(x=>x.slice()));
for(const [pi,d] of sol){
  const piece=page.locator(`.latchling[data-pi="${pi}"]`);if(await piece.count())await piece.click();
  await page.locator(`.dpad-hit[data-dir="${d}"]`).click();
  await page.waitForTimeout(430);
}
await page.waitForSelector('#overlay.show');ok((await page.locator('#modal').textContent()).includes('Level cleared'),'Stored Level 1 solution no longer clears');
await page.click('#nextLevelBtn');await page.waitForTimeout(180);ok(await page.locator('#storyCardOverlay.show').count()===1,'Next new level did not show its story card');ok((await page.locator('#storyCardTitle').textContent()).includes('Watering Can'),'Next-level story card wrong');await page.click('#storyCardContinue');

console.log('STEP daily and level select routes');
await page.evaluate(()=>window.LatchlingsHomeAction('daily'));await page.waitForTimeout(180);ok(await page.locator('#game.active').count()===1,'Daily route did not enter game');await dismissStory();
await page.evaluate(()=>{chapterView=Math.ceil(progress.unlocked/50);rangeView=Math.floor(((progress.unlocked-1)%50)/10);screen('levels');renderChapter()});ok(await page.locator('#levels.active').count()===1,'Level Select route failed');

console.log('STEP compact viewport');
await page.setViewportSize({width:360,height:740});await page.evaluate(()=>{localStorage.removeItem('latchlings_story_cards_seen_v1');startLevel(101)});await page.waitForTimeout(160);await page.waitForSelector('#storyCardOverlay.show');
const compact=await page.evaluate(()=>{const p=document.getElementById('storyCardPanel').getBoundingClientRect(),b=document.getElementById('board').getBoundingClientRect();return {panel:{x:p.x,y:p.y,w:p.width,h:p.height},board:{w:b.width,h:b.height},scrollW:document.documentElement.scrollWidth,innerW:innerWidth,anim:getComputedStyle(document.getElementById('storyCardPanel')).animationName}});
ok(compact.panel.x>=0&&compact.panel.y>=0&&compact.panel.x+compact.panel.w<=361&&compact.panel.y+compact.panel.h<=741,'Story card clipped on 360x740');ok(compact.scrollW<=compact.innerW+1,'Compact viewport horizontal overflow');ok(compact.board.w>=300,'Compact board too small');await page.screenshot({path:`${OUT}/story-card-compact.png`,fullPage:true});await page.click('#storyCardContinue');

console.log('STEP reduced motion');
const rmContext=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const rm=await rmContext.newPage();const rmErrors=[];rm.on('pageerror',e=>rmErrors.push(e.message));await rm.goto(BASE,{waitUntil:'domcontentloaded'});await rm.evaluate(()=>{localStorage.removeItem('latchlings_story_cards_seen_v1');startLevel(351)});await rm.waitForTimeout(160);await rm.waitForSelector('#storyCardOverlay.show');const reduced=await rm.evaluate(()=>({panelAnim:getComputedStyle(document.getElementById('storyCardPanel')).animationName,propAnim:getComputedStyle(document.querySelector('.story-scene-prop')).animationName}));ok(reduced.panelAnim==='none','Reduced motion did not disable story-card entrance');ok(reduced.propAnim==='none','Reduced motion did not disable vignette float');ok(rmErrors.length===0,'Reduced-motion page errors: '+rmErrors.join(' | '));await rmContext.close();

ok(badResponses.length===0,'HTTP errors: '+badResponses.join(' | '));ok(problems.length===0,'Browser problems: '+problems.join(' | '));
console.log('STORY_THEME_OVERHAUL_OK',JSON.stringify({assetStatus,cardState,chapterStates:chapterStates.map(({L,ch,props,boardBG,cellBG})=>({L,ch,props,boardBG,cellBG})),market,compact,reduced,solutionLength:sol.length}));
await browser.close();
