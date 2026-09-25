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

async function openReward(page,level,{reduced=false,priorUnlocked=level}={}){
 await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
 await page.evaluate(({level,reduced,priorUnlocked})=>{
  LatchlingsPrefs.set('motion',reduced?'reduced':'system');
  progress={unlocked:priorUnlocked,stars:{}};
  currentLevel=level;playMode='campaign';movesUsed=LEVELS[level-1].optimal;
  positions=LEVELS[level-1].pieces.map(()=>null);
  winLevel();
 },{level,reduced,priorUnlocked});
 await page.waitForSelector('.chapter-reward-card');
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

async function verifyReducedAndReplay(browser,level,expected){
 const context=await browser.newContext({viewport:{width:320,height:568},reducedMotion:'reduce'}),page=await context.newPage();
 await openReward(page,level,{reduced:true});
 const card=page.locator(expected.selector);
 assert.equal(await card.getAttribute('data-vignette-settled'),'true',`Level ${level}: Reduced Motion must show the completed keepsake immediately`);
 assert(await page.locator(expected.home).isVisible()&&await page.locator(expected.continue).isVisible(),`Level ${level}: Reduced Motion must preserve both actions`);
 await page.screenshot({path:path.join(evidence,`level-${level}-320-reduced.png`)});
 await context.close();

 const replayContext=await browser.newContext({viewport:{width:320,height:568}}),replayPage=await replayContext.newPage();
 await openReward(replayPage,level,{priorUnlocked:level+1});
 const replayCard=replayPage.locator(expected.selector);
 assert.equal(await replayCard.getAttribute('data-reward-level'),String(level),`Level ${level}: replay must show only its already-earned chapter keepsake`);
 assert.equal(await replayPage.locator('[data-reward-future]').count(),0,`Level ${level}: replay must not reveal a future chapter prop`);
 await replayPage.waitForFunction(selector=>document.querySelector(selector)?.dataset.vignetteSettled==='true',expected.selector,{timeout:1800});
 await replayContext.close();
}

async function main(){
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true});
 try{
  for(const [level,expected] of Object.entries(milestones)){
   const numeric=Number(level);
   await verifyEarnedVignette(browser,numeric,expected);
   await verifyContinue(browser,numeric,expected);
   await verifyReducedAndReplay(browser,numeric,expected);
  }
  console.log(`PASS earned chapter keepsakes, immediate actions, Reduced Motion, replay, and no future props; 320/390px captures: ${evidence}`);
 }finally{await browser.close();server.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1});
