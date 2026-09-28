const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');

const repo=path.resolve(__dirname,'..');
const evidence=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'latchlings-story-payoffs-'));
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname),requested=pathname==='/'?'/index.html':pathname;
 const file=path.resolve(repo,'.'+(requested.endsWith('/')?requested+'index.html':requested));
 if(file!==repo&&!file.startsWith(repo+path.sep)){res.writeHead(403).end();return}
 fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(data)});
});

const milestones={
 50:{selector:'.chapter-reward-card',home:'#chapterRewardHome',continue:'#chapterRewardContinue',keepsake:'mailbox'},
 100:{selector:'.chapter-two-reward',home:'#chapterTwoRewardHome',continue:'#chapterTwoRewardContinue',keepsake:'pennant'},
 150:{selector:'.chapter-three-reward',home:'#chapterThreeRewardHome',continue:'#chapterThreeRewardContinue',keepsake:'anchor'},
 200:{selector:'.chapter-four-reward',home:'#chapterFourRewardHome',continue:'#chapterFourRewardContinue',keepsake:'bunting'}
};

async function openReward(page,level,{reduced=false,priorUnlocked=level,textSize='normal'}={}){
 await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
 await page.evaluate(({level,reduced,priorUnlocked,textSize})=>{
  LatchlingsPrefs.set('motion',reduced?'reduced':'system');LatchlingsPrefs.set('textSize',textSize);
  progress={unlocked:priorUnlocked,stars:{}};
  currentLevel=level;playMode='campaign';movesUsed=LEVELS[level-1].optimal;
  positions=LEVELS[level-1].pieces.map(()=>null);
  winLevel();
 },{level,reduced,priorUnlocked,textSize});
 await page.waitForSelector('.chapter-reward-card');
}

async function verifyRewardPresentation(browser,level,expected,{width,height,textSize='normal',reduced=false}){
 const context=await browser.newContext({viewport:{width,height},reducedMotion:reduced?'reduce':'no-preference'}),page=await context.newPage();
 await openReward(page,level,{reduced,textSize});
 const layout=await page.evaluate(selector=>{
  const card=document.querySelector(selector),overlay=document.querySelector('#overlay'),actions=[...card.querySelectorAll('button')].map(button=>button.getBoundingClientRect()),box=card.getBoundingClientRect(),frame=overlay.getBoundingClientRect();
  return{card:{left:box.left,top:box.top,right:box.right,bottom:box.bottom},overlay:{left:frame.left,top:frame.top,right:frame.right,bottom:frame.bottom},actions:actions.map(rect=>({left:rect.left,top:rect.top,right:rect.right,bottom:rect.bottom})),overflow:document.documentElement.scrollWidth>innerWidth};
 },expected.selector);
 assert(!layout.overflow,`Level ${level}: ${width}px ${textSize} reward must not create horizontal overflow (${JSON.stringify(layout)})`);
 assert(layout.card.left>=0&&layout.card.right<=width&&layout.card.top>=layout.overlay.top&&layout.card.bottom<=layout.overlay.bottom,`Level ${level}: ${width}px ${textSize} reward card must stay inside the usable overlay (${JSON.stringify(layout)})`);
 assert(layout.actions.length>=2&&layout.actions.every(button=>button.left>=0&&button.right<=width&&button.top>=layout.overlay.top&&button.bottom<=layout.overlay.bottom),`Level ${level}: ${width}px ${textSize} reward actions must remain reachable (${JSON.stringify(layout)})`);
 await page.screenshot({path:path.join(evidence,`level-${level}-${width}-${textSize}-${reduced?'reduced':'normal'}.png`)});
 await context.close();
}

async function verifyEarnedVignette(browser,level,expected){
 const context=await browser.newContext({viewport:{width:320,height:568},reducedMotion:'no-preference'}),page=await context.newPage();
 await openReward(page,level);
 const card=page.locator(expected.selector),snapshot=await card.evaluate(el=>({level:el.dataset.rewardLevel,settled:el.dataset.vignetteSettled,label:el.querySelector('.chapter-reward-postcard')?.getAttribute('aria-label'),text:el.innerText,decorative:[...el.querySelectorAll('.chapter-reward-postcard i')].every(item=>item.getAttribute('aria-hidden')==='true')}));
 assert.equal(snapshot.level,String(level),`Level ${level}: the reward must identify the earned milestone`);
 assert.equal(snapshot.settled,'false',`Level ${level}: the earned vignette must begin in its brief moving state`);
 assert(snapshot.label&&snapshot.label.toLowerCase().includes(expected.keepsake),`Level ${level}: the postcard must announce its earned ${expected.keepsake} keepsake`);
 assert(snapshot.decorative,`Level ${level}: decorative moving pieces must be hidden from assistive technology`);
 assert(!/next region|coming soon|locked reward/i.test(snapshot.text),`Level ${level}: reward copy must not preview a later-region reward`);
 assert(await page.locator(expected.home).isEnabled()&&await page.locator(expected.continue).isEnabled(),`Level ${level}: Home and Continue must be reachable while the vignette is moving`);
 const moving=await card.locator('.chapter-reward-postcard').evaluate(el=>[...el.querySelectorAll('*')].some(item=>item.getAnimations().some(animation=>animation.playState==='running')));
 assert(moving,`Level ${level}: its one-shot earned visual must be animating`);
 await page.screenshot({path:path.join(evidence,`level-${level}-320-normal.png`)});
 await page.locator(expected.home).click();
 assert.equal(await page.locator('#overlay').getAttribute('class').then(value=>value.includes('show')),false,`Level ${level}: Home must dismiss the modal without waiting for the vignette`);
 await page.waitForFunction(()=>document.body.dataset.screen==='home');
 await context.close();
}

async function verifyContinue(browser,level,expected){
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'no-preference'}),page=await context.newPage();
 await openReward(page,level);
 const moving=await page.locator(expected.selector+' .chapter-reward-postcard').evaluate(el=>[...el.querySelectorAll('*')].some(item=>item.getAnimations().some(animation=>animation.playState==='running')));
 assert(moving,`Level ${level}: Continue test must activate during the vignette`);
 await page.screenshot({path:path.join(evidence,`level-${level}-390-normal.png`)});
 await page.locator(expected.continue).click();
 await page.waitForFunction(()=>!document.getElementById('overlay').classList.contains('show'));
 assert(['levels','game'].includes(await page.locator('body').getAttribute('data-screen')),`Level ${level}: Continue must immediately enter the next-level flow`);
 await context.close();
}

async function assertMailboxPose(page,label){
 const pose=await page.evaluate(()=>{
  const postcard=document.querySelector('[data-reward-level="50"] .chapter-reward-postcard'),basket=postcard?.querySelector('.chapter-reward-basket')?.getBoundingClientRect(),mailbox=postcard?.querySelector('.chapter-reward-mailbox')?.getBoundingClientRect();
  return basket&&mailbox?{basket:{x:basket.left+basket.width/2,y:basket.top+basket.height/2},mailbox:{x:mailbox.left+mailbox.width/2,y:mailbox.top+mailbox.height/2}}:null;
 });
 assert(pose&&Math.hypot(pose.basket.x-pose.mailbox.x,pose.basket.y-pose.mailbox.y)<=10,`${label}: settled Level 50 basket must visibly remain at the mailbox (${JSON.stringify(pose)})`);
}

async function verifyReducedAndReplay(browser,level,expected){
 const context=await browser.newContext({viewport:{width:320,height:568},reducedMotion:'reduce'}),page=await context.newPage();
 await openReward(page,level,{reduced:true});
 const card=page.locator(expected.selector);
 assert.equal(await card.getAttribute('data-vignette-settled'),'true',`Level ${level}: Reduced Motion must show the completed keepsake immediately`);
 assert(await page.locator(expected.home).isVisible()&&await page.locator(expected.continue).isVisible(),`Level ${level}: Reduced Motion must preserve both actions`);
 if(level===50)await assertMailboxPose(page,'Reduced Motion');
 await page.screenshot({path:path.join(evidence,`level-${level}-320-reduced.png`)});
 await context.close();

 const replayContext=await browser.newContext({viewport:{width:320,height:568}}),replayPage=await replayContext.newPage();
 await openReward(replayPage,level,{priorUnlocked:level+1});
 const replayCard=replayPage.locator(expected.selector);
 assert.equal(await replayCard.getAttribute('data-reward-level'),String(level),`Level ${level}: replay must show only its already-earned chapter keepsake`);
 assert.equal(await replayPage.locator('[data-reward-future]').count(),0,`Level ${level}: replay must not reveal a future chapter prop`);
 await replayPage.waitForFunction(selector=>document.querySelector(selector)?.dataset.vignetteSettled==='true',expected.selector,{timeout:1800});
 if(level===50)await assertMailboxPose(replayPage,'Normal-motion completion');
 await replayContext.close();
}

async function endingGeometry(page){
 return page.evaluate(()=>{
  const stage=document.querySelector('.ending-homecoming'),svg=stage?.querySelector('.ending-parcel-route-svg'),path=svg?.querySelector('.ending-parcel-route'),from=stage?.querySelector('[data-home-node="true"]'),target=stage?.querySelector('.ending-parcel-target'),parcel=stage?.querySelector('.ending-parcel'),frame=stage?.querySelector('.ending-home-frame'),door=frame?.contentDocument?.querySelector('#c2 .cottage .door');
  const center=element=>{const r=element?.getBoundingClientRect();return r?{x:r.left+r.width/2,y:r.top+r.height/2}:null};
  const point=t=>{if(!path||!path.getTotalLength())return null;const p=path.getPointAtLength(path.getTotalLength()*t),m=path.getScreenCTM(),q=new DOMPoint(p.x,p.y).matrixTransform(m);return{x:q.x,y:q.y}};
  const frameRect=frame?.getBoundingClientRect(),doorRect=door?.getBoundingClientRect(),win=frame?.contentWindow;
  const porch=frameRect&&doorRect&&win?{x:frameRect.left+(doorRect.left+doorRect.width/2)*frameRect.width/Math.max(1,win.innerWidth),y:frameRect.top+(doorRect.top+doorRect.height/2)*frameRect.height/Math.max(1,win.innerHeight)}:null;
  const homeNode=stage?.querySelector('[data-home-node="true"]'),fallbackLabel=stage?.querySelector('.ending-fallback-home-label');
  return {state:stage?.dataset.parcelState,pathLength:path?.getTotalLength()||0,start:point(0),end:point(1),source:center(from),target:center(target),porch,parcel:center(parcel),homeNode:center(homeNode),fallbackLabel:{text:fallbackLabel?.textContent.trim()||'',display:fallbackLabel?getComputedStyle(fallbackLabel).display:'none',box:fallbackLabel?.getBoundingClientRect().toJSON()||null},parcelVisible:!!parcel&&getComputedStyle(parcel).display!=='none'&&getComputedStyle(parcel).visibility!=='hidden'&&Number(getComputedStyle(parcel).opacity)>.1,actions:[...document.querySelectorAll('#completeHome,#completeLevels')].every(button=>{const r=button.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(button).pointerEvents!=='none'})};
 });
}

async function verifyEndingArrival(browser){
 const reducedContext=await browser.newContext({viewport:{width:320,height:568},reducedMotion:'reduce'}),reducedPage=await reducedContext.newPage();
 await reducedPage.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
 await reducedPage.evaluate(()=>{LatchlingsPrefs.set('motion','reduced');screen('complete')});
 const reducedReady=await reducedPage.waitForFunction(()=>document.querySelector('.ending-homecoming')?.dataset.parcelState==='arrived',undefined,{timeout:8000}).then(()=>true).catch(()=>false);
 if(!reducedReady){const state=await reducedPage.evaluate(()=>{const stage=document.querySelector('.ending-homecoming'),frame=stage?.querySelector('.ending-home-frame');return{screen:document.body.dataset.screen,motion:document.documentElement.dataset.motion,parcelState:stage?.dataset.parcelState,frame:{ready:frame?.contentDocument?.readyState,width:frame?.clientWidth,height:frame?.clientHeight,src:frame?.src,hasDoor:!!frame?.contentDocument?.querySelector('#c2 .cottage .door')},path:stage?.querySelector('.ending-parcel-route')?.getAttribute('d'),errors:document.querySelector('#debug')?.textContent}});throw new Error(`Reduced Motion ending did not settle: ${JSON.stringify(state)}`)}
 let geometry=await endingGeometry(reducedPage);
 assert(geometry.pathLength>0&&geometry.start&&geometry.end&&geometry.porch,`Reduced Motion ending must measure the canonical porch route (${JSON.stringify(geometry)})`);
 assert(Math.hypot(geometry.end.x-geometry.porch.x,geometry.end.y-geometry.porch.y)<=3,`Reduced Motion parcel route must land on the iframe porch (${JSON.stringify(geometry)})`);
 assert(Math.hypot(geometry.parcel.x-geometry.porch.x,geometry.parcel.y-geometry.porch.y)<=4,`Reduced Motion must settle the parcel at the actual porch (${JSON.stringify(geometry)})`);
 assert(geometry.actions,`Reduced Motion route must leave both ending actions available`);
 await reducedPage.screenshot({path:path.join(evidence,'ending-320-reduced.png')});
 await reducedContext.close();

 const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage();
 await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
 await page.evaluate(()=>{LatchlingsPrefs.set('motion','system');screen('complete')});
 await page.waitForFunction(()=>['ready','travelling','arrived'].includes(document.querySelector('.ending-homecoming')?.dataset.parcelState),undefined,{timeout:8000});
 await page.evaluate(()=>{for(const selector of ['.ending-network-field','.ending-home-focus'])for(const animation of document.querySelector(selector)?.getAnimations()||[])animation.finish()});
 await page.waitForFunction(()=>document.querySelector('.ending-homecoming')?.dataset.parcelState==='travelling',undefined,{timeout:3000});
 const before=await endingGeometry(page);
 assert(before.pathLength>0&&before.start&&before.end&&before.parcelVisible,`Normal ending must show the measured route and parcel while traveling (${JSON.stringify(before)})`);
 assert(Math.hypot(before.start.x-before.source.x,before.start.y-before.source.y)<=3,`Parcel path must begin at the final Little Home network handoff (${JSON.stringify(before)})`);
 assert(Math.hypot(before.end.x-before.porch.x,before.end.y-before.porch.y)<=3,`Parcel path must end at the measured canonical porch (${JSON.stringify(before)})`);
 await new Promise(resolve=>setTimeout(resolve,420));
 const moving=await endingGeometry(page);
 assert(Math.hypot(moving.parcel.x-before.parcel.x,moving.parcel.y-before.parcel.y)>=5,`Parcel must visibly travel along its measured path (${JSON.stringify({before:before.parcel,after:moving.parcel})})`);
 const routeProgress=Number(await page.locator('.ending-parcel-route').evaluate(path=>path.style.strokeDashoffset));
 assert(routeProgress>0&&routeProgress<1,`The measured route must visibly reveal behind the traveling parcel (${routeProgress})`);
 await page.screenshot({path:path.join(evidence,'ending-390-in-flight.png')});
 await page.waitForFunction(()=>document.querySelector('.ending-homecoming')?.dataset.parcelState==='arrived',undefined,{timeout:4000});
 let landed=await endingGeometry(page);
 assert(Math.hypot(landed.parcel.x-landed.porch.x,landed.parcel.y-landed.porch.y)<=4,`Animated parcel must actually settle at the porch (${JSON.stringify(landed)})`);
 await page.setViewportSize({width:320,height:568});
 await page.waitForFunction(()=>{
  const stage=document.querySelector('.ending-homecoming'),path=stage?.querySelector('.ending-parcel-route'),frame=stage?.querySelector('.ending-home-frame'),door=frame?.contentDocument?.querySelector('#c2 .cottage .door'),target=stage?.querySelector('.ending-parcel-target');
  if(stage?.dataset.parcelState!=='arrived'||!path?.getTotalLength()||!door||!target)return false;
  const frameRect=frame.getBoundingClientRect(),doorRect=door.getBoundingClientRect(),win=frame.contentWindow,porch={x:frameRect.left+(doorRect.left+doorRect.width/2)*frameRect.width/Math.max(1,win.innerWidth),y:frameRect.top+(doorRect.top+doorRect.height/2)*frameRect.height/Math.max(1,win.innerHeight)},targetRect=target.getBoundingClientRect(),point=path.getPointAtLength(path.getTotalLength()),matrix=path.getScreenCTM(),end=new DOMPoint(point.x,point.y).matrixTransform(matrix);
  return Math.hypot(targetRect.left+targetRect.width/2-porch.x,targetRect.top+targetRect.height/2-porch.y)<=3&&Math.hypot(end.x-porch.x,end.y-porch.y)<=3;
 });
 landed=await endingGeometry(page);
 assert(Math.hypot(landed.end.x-landed.porch.x,landed.end.y-landed.porch.y)<=3,`The responsive resize must remeasure the canonical porch endpoint (${JSON.stringify(landed)})`);
 assert(Math.hypot(landed.parcel.x-landed.porch.x,landed.parcel.y-landed.porch.y)<=4,`The settled parcel must remain on the porch after resize (${JSON.stringify(landed)})`);
 await page.screenshot({path:path.join(evidence,'ending-320-normal-resized.png')});
 await context.close();

 const fallbackContext=await browser.newContext({viewport:{width:320,height:568}}),fallbackPage=await fallbackContext.newPage();
 await fallbackPage.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
 await fallbackPage.locator('.ending-home-frame').evaluate(frame=>{frame.src='about:blank'});
 await fallbackPage.waitForFunction(()=>{const doc=document.querySelector('.ending-home-frame')?.contentDocument;return doc?.readyState==='complete'&&!doc.querySelector('#c2 .cottage .door')});
 await fallbackPage.evaluate(()=>screen('complete'));
 await fallbackPage.waitForFunction(()=>document.querySelector('.ending-homecoming')?.dataset.parcelState==='fallback',undefined,{timeout:5000});
 const fallback=await endingGeometry(fallbackPage);
 assert(fallback.parcelVisible&&fallback.parcel&&fallback.homeNode&&Math.hypot(fallback.parcel.x-fallback.homeNode.x,fallback.parcel.y-fallback.homeNode.y)<=3,`The unavailable-home fallback must visibly settle on the Little Home network node (${JSON.stringify(fallback)})`);
 assert(/little home/i.test(fallback.fallbackLabel.text)&&fallback.fallbackLabel.display!=='none'&&fallback.fallbackLabel.box?.width>0&&fallback.fallbackLabel.box?.height>0,`Short-phone fallback must visibly label the safe landing node Little Home (${JSON.stringify(fallback.fallbackLabel)})`);
 assert(await fallbackPage.locator('#completeHome').isVisible()&&await fallbackPage.locator('#completeLevels').isVisible(),'Missing iframe landmarks must not block either ending action');
 assert.equal(await fallbackPage.locator('.ending-parcel').getAttribute('data-arrived'),'false','A missing porch must never be reported as a successful landing');
 await fallbackContext.close();

 const stalledContext=await browser.newContext({viewport:{width:320,height:568},reducedMotion:'reduce'}),stalledPage=await stalledContext.newPage();
 await stalledPage.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
 const stalledReadyState=await stalledPage.locator('.ending-home-frame').evaluate(frame=>{const doc=frame.contentDocument;doc.open();doc.write('<!doctype html><title>Little Home is still arriving</title><body>Waiting for the island view.</body>');return doc.readyState});
 assert.equal(stalledReadyState,'loading','The readiness fallback test must hold the canonical ending iframe open');
 await stalledPage.evaluate(()=>{LatchlingsPrefs.set('motion','reduced');screen('complete')});
 await stalledPage.waitForFunction(()=>document.querySelector('.ending-homecoming')?.dataset.parcelState==='fallback',undefined,{timeout:6500});
 const stalled=await endingGeometry(stalledPage);
 assert(stalled.parcelVisible&&stalled.parcel&&stalled.homeNode&&Math.hypot(stalled.parcel.x-stalled.homeNode.x,stalled.parcel.y-stalled.homeNode.y)<=3,`A stalled ending iframe must reach the visible Little Home fallback (${JSON.stringify(stalled)})`);
 assert(/little home/i.test(stalled.fallbackLabel.text)&&stalled.actions,`A stalled ending iframe must label the fallback and leave both ending actions available (${JSON.stringify(stalled)})`);
 assert.equal(await stalledPage.locator('.ending-parcel').getAttribute('data-arrived'),'false','A stalled porch must never be reported as a successful landing');
 await stalledPage.setViewportSize({width:390,height:800});
 await stalledPage.waitForFunction(()=>{
  const stage=document.querySelector('.ending-homecoming'),parcel=stage?.querySelector('.ending-parcel')?.getBoundingClientRect(),node=stage?.querySelector('[data-home-node="true"]')?.getBoundingClientRect();
  return stage?.dataset.parcelState==='fallback'&&parcel&&node&&Math.hypot(parcel.left+parcel.width/2-node.left-node.width/2,parcel.top+parcel.height/2-node.top-node.height/2)<=3;
 },undefined,{timeout:1500});
 await stalledPage.locator('.ending-home-frame').evaluate(frame=>{frame.src=frame.src});
 await stalledPage.waitForFunction(()=>document.querySelector('.ending-homecoming')?.dataset.parcelState==='arrived',undefined,{timeout:8000});
 const recovered=await endingGeometry(stalledPage);
 assert(recovered.porch&&Math.hypot(recovered.parcel.x-recovered.porch.x,recovered.parcel.y-recovered.porch.y)<=4,`A recovered iframe must replace the fallback with the measured porch landing (${JSON.stringify(recovered)})`);
 await stalledContext.close();
}

async function main(){
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true});
 try{
  await verifyEndingArrival(browser);
  for(const [level,expected] of Object.entries(milestones)){
   const numeric=Number(level);
   await verifyRewardPresentation(browser,numeric,expected,{width:430,height:932});
   await verifyRewardPresentation(browser,numeric,expected,{width:320,height:568,textSize:'large',reduced:true});
   await verifyEarnedVignette(browser,numeric,expected);
   await verifyContinue(browser,numeric,expected);
   await verifyReducedAndReplay(browser,numeric,expected);
  }
  console.log(`PASS earned chapter keepsakes, immediate actions, Reduced Motion, replay, and no future props; 320/390px captures: ${evidence}`);
 }finally{await browser.close();server.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1});
