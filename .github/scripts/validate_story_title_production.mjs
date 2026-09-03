import { chromium } from 'playwright';

const base='http://127.0.0.1:8137/';
const watchdog=setTimeout(()=>{console.error('GLOBAL_BROWSER_TIMEOUT');process.exit(124)},90000);
const browser=await chromium.launch({headless:true});

function prep(page,errors=[]){
  page.setDefaultTimeout(6000);
  page.setDefaultNavigationTimeout(12000);
  page.on('console',m=>{if(m.type()==='error')errors.push('console:'+m.text())});
  page.on('pageerror',e=>errors.push('pageerror:'+e.message));
  page.on('requestfailed',r=>{const failure=r.failure()?.errorText||'';if(failure==='net::ERR_ABORTED'&&/\.(mp3|ogg|wav)(?:\?|$)/i.test(r.url()))return;errors.push('request:'+r.url()+':'+failure)});
}
async function gotoApp(page){
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('#homeTitleFrame');
  await page.waitForFunction(()=>{
    const f=document.getElementById('homeTitleFrame'),d=f?.contentDocument;
    return !!(d?.body?.classList.contains('embed-mode')&&d.querySelector('#c2 .toy-logo'));
  });
}
async function homeFrame(page){
  const handle=await page.$('#homeTitleFrame');
  const frame=await handle?.contentFrame();
  if(!frame)throw new Error('Production Little Home iframe not found');
  return frame;
}
async function clickHome(page,selector){
  await page.waitForFunction(sel=>!!document.getElementById('homeTitleFrame')?.contentDocument?.querySelector(sel),selector);
  await page.evaluate(sel=>document.getElementById('homeTitleFrame').contentDocument.querySelector(sel).click(),selector);
}
async function inspectHome(page){
  return await page.evaluate(()=>{
    const d=document.getElementById('homeTitleFrame')?.contentDocument;
    const c=d?.querySelector('#c2'),phone=c?.querySelector('.phone'),play=c?.querySelector('.play');
    if(!d||!c||!phone||!play)throw new Error('Embedded Little Home DOM incomplete');
    const visible=el=>{const s=d.defaultView.getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0};
    return {
      embed:d.body.classList.contains('embed-mode'),c2Visible:visible(c),
      introDisplay:d.defaultView.getComputedStyle(d.querySelector('.intro')).display,
      switcherDisplay:d.defaultView.getComputedStyle(d.querySelector('.switcher')).display,
      letters:c.querySelectorAll('.toy-logo span').length,
      tagline:c.querySelector('.toy-tagline')?.textContent.trim(),
      residents:c.querySelectorAll('.resident').length,adults:c.querySelectorAll('.resident.adult').length,children:c.querySelectorAll('.resident.child').length,
      pebbles:c.querySelectorAll('.float-pebble').length,clouds:c.querySelectorAll('.cloud').length,
      playBg:d.defaultView.getComputedStyle(play).backgroundColor,playBgImage:d.defaultView.getComputedStyle(play).backgroundImage,
      stageClasses:[...phone.classList].filter(x=>x.startsWith('story-stage-'))
    };
  });
}

console.log('STEP fresh home');
const errors=[];
const context=await browser.newContext({viewport:{width:390,height:844}});
const page=await context.newPage();prep(page,errors);await gotoApp(page);
const frame=await homeFrame(page);
const homeState=await inspectHome(page);
if(!homeState.embed||!homeState.c2Visible)throw new Error('Concept 2 is not the embedded production home');
if(homeState.introDisplay!=='none'||homeState.switcherDisplay!=='none')throw new Error('Preview chrome is visible in production embed');
if(homeState.letters!==10||homeState.tagline!=='Small friends. Smart puzzles.')throw new Error('Approved Wobbly Toy Letters branding changed');
if(homeState.residents!==5||homeState.adults!==3||homeState.children!==2||homeState.pebbles!==6||homeState.clouds!==4)throw new Error('Approved Little Home scene structure changed: '+JSON.stringify(homeState));
if(homeState.playBg!=='rgb(245, 222, 172)'||homeState.playBgImage!=='none')throw new Error('Approved #F5DEAC production Play control changed');

console.log('STEP title motion');
const titleMotion=await frame.evaluate(async()=>{
  restartLittleHomeTitle();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const el=document.querySelector('#c2 .toy-logo span'),anim=el.getAnimations().find(a=>a.animationName==='littleHomeTitleDrop');
  if(!anim)throw new Error('littleHomeTitleDrop animation missing');
  anim.pause();
  const sample=async time=>{anim.currentTime=time;await new Promise(r=>requestAnimationFrame(r));const r=el.getBoundingClientRect(),cs=getComputedStyle(el);return {top:r.top,translate:cs.translate,opacity:+cs.opacity}};
  return {start:await sample(0),impact:await sample(780*.56),rebound:await sample(780*.75),final:await sample(780)};
});
if(!(titleMotion.start.top<titleMotion.final.top-60))throw new Error('Production title does not start above final position');
if(!(titleMotion.impact.top>titleMotion.final.top+6))throw new Error('Production title lacks impact overshoot');
if(!(titleMotion.rebound.top<titleMotion.final.top-3))throw new Error('Production title lacks rebound');
await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/story-title-renders/production-home-fresh.png`,fullPage:true});

console.log('STEP play bridge');
await clickHome(page,'#c2 .play');
await page.waitForSelector('#game.active');
const gameStory=await page.evaluate(()=>({title:document.querySelector('#levelTitle').textContent.trim(),storyTitle:document.querySelector('#mechanicNote strong')?.textContent.trim(),context:document.querySelector('#mechanicNote span')?.textContent.trim(),tip:document.querySelector('#mechanicNote em')?.textContent.trim(),className:document.querySelector('#mechanicNote').className}));
if(gameStory.title!=='Level 1'||!gameStory.storyTitle||!gameStory.context||!gameStory.tip||!gameStory.className.includes('story-note'))throw new Error('Level 1 story context is not wired into gameplay: '+JSON.stringify(gameStory));

console.log('STEP story coverage');
const storyCoverage=await page.evaluate(()=>{const rows=Array.from({length:400},(_,i)=>LATCHLINGS_STORY.levelMeta(i+1));return {count:rows.length,unique:new Set(rows.map(x=>`${x.chapter}:${x.title}`)).size,missing:rows.filter(x=>!x.title||!x.context||!x.mechanic).length,chapters:LATCHLINGS_STORY.chapters.map(x=>x.name),samples:[1,151,301,400].map(n=>LATCHLINGS_STORY.levelMeta(n))};});
if(storyCoverage.count!==400||storyCoverage.unique!==400||storyCoverage.missing!==0)throw new Error('400-level story metadata coverage failed: '+JSON.stringify(storyCoverage));
const expectedChapters=['Morning Routes','Neighbors','Holding Fast','Market Day','The Long Drift','Old Ways','Coming Together','Homeward'];
if(JSON.stringify(storyCoverage.chapters)!==JSON.stringify(expectedChapters))throw new Error('Story chapter order changed: '+JSON.stringify(storyCoverage.chapters));
if(storyCoverage.samples.some(x=>!x.title||!x.context||!x.mechanic))throw new Error('Representative early/mid/late/final story sample missing data');

console.log('STEP level select bridge');
await page.evaluate(()=>screen('home'));await page.waitForFunction(()=>document.getElementById('home').classList.contains('active'));
await clickHome(page,'#c2 .secondary button:nth-child(2)');
await page.waitForSelector('#levels.active');
const chapterText=await page.locator('#chapterHead').innerText(),chapterTextLower=chapterText.toLowerCase();
if(!chapterText.includes('Chapter 1: Morning Routes')||!chapterTextLower.includes('sunpetal meadows')||!chapterText.includes('Route language:')||!chapterTextLower.includes('edges, rocks'))throw new Error('Narrative chapter header missing required story/mechanic framing: '+chapterText);

console.log('STEP dedicated story screen');
await page.evaluate(()=>screen('home'));await page.waitForFunction(()=>document.getElementById('home').classList.contains('active'));
await clickHome(page,'#c2 .settings');
await page.waitForSelector('#story.active');
const lore=await page.locator('#story').innerText();
for(const name of ['Pippa','Bramble','Rowan','Pip','Tansy','Waykeeper','Skyway','Morning Routes'])if(!lore.includes(name))throw new Error('Story screen missing '+name);
const storyState=await page.evaluate(()=>({homeActive:document.getElementById('home').classList.contains('active'),storyActive:document.getElementById('story').classList.contains('active'),scrollWidth:document.body.scrollWidth,width:innerWidth}));
if(storyState.homeActive||!storyState.storyActive||storyState.scrollWidth>storyState.width+1)throw new Error('Story screen state/fit failed: '+JSON.stringify(storyState));
await page.locator('#storyRules').click();
await page.waitForSelector('#rulesClose');
if(!(await page.locator('#modal').innerText()).includes('How the board works'))throw new Error('Rules did not open from Story screen');
await page.locator('#rulesClose').click();
await page.locator('#storyBack').click();
await page.waitForSelector('#home.active');

console.log('STEP daily bridge');
await clickHome(page,'#c2 .secondary button:nth-child(1)');
await page.waitForSelector('#game.active');
const dailyTitle=await page.locator('#levelTitle').innerText();
if(!/^Level \d+$/.test(dailyTitle))throw new Error('Daily Puzzle did not enter a campaign board: '+dailyTitle);

console.log('STEP milestone beat');
await page.evaluate(()=>{currentLevel=10;movesUsed=LEVELS[9].optimal;winLevel()});
await page.waitForSelector('.story-beat');
const beatText=await page.locator('.story-beat').innerText();
if(!beatText.includes('Morning Routes')||!beatText.toLowerCase().includes('household'))throw new Error('Level 10 milestone beat missing: '+beatText);
await page.evaluate(()=>closeModal());

console.log('STEP completion copy');
await page.evaluate(()=>screen('complete'));
const completeText=await page.locator('#complete').innerText();
if(!completeText.includes('The Skyway Lives Again')||!completeText.includes('keep drifting')||!completeText.includes('Return to Little Home'))throw new Error('Campaign completion story copy not promoted');
if(errors.length)throw new Error('Primary production browser errors: '+errors.join(' | '));
await context.close();

console.log('STEP completed-home progression');
const progressedErrors=[];
const progressed=await browser.newContext({viewport:{width:390,height:844}});
await progressed.addInitScript(()=>{const stars={};for(let ch=1;ch<=8;ch++)stars[ch*50]=3;localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked:400,stars}));});
const pp=await progressed.newPage();prep(pp,progressedErrors);await gotoApp(pp);
const progression=await pp.evaluate(()=>{const d=document.getElementById('homeTitleFrame').contentDocument,phone=d.querySelector('#c2 .phone'),sel=['.story-mailbox','.story-pennant','.story-anchor','.story-bunting','.story-telescope','.story-relic','.story-dock','.story-distant-islands'];return {classes:[...phone.classList].filter(x=>x.startsWith('story-stage-')),shown:sel.map(s=>d.defaultView.getComputedStyle(d.querySelector(s)).display)};});
if(progression.classes.length!==8||progression.shown.some(x=>x==='none'))throw new Error('Little Home chapter progression is incomplete: '+JSON.stringify(progression));
await pp.screenshot({path:`${process.env.GITHUB_WORKSPACE}/story-title-renders/production-home-complete.png`,fullPage:true});
if(progressedErrors.length)throw new Error('Progressed production browser errors: '+progressedErrors.join(' | '));
await progressed.close();

console.log('STEP reduced motion');
const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
const rp=await reduced.newPage();prep(rp);await gotoApp(rp);
const reducedState=await rp.evaluate(()=>{const d=document.getElementById('homeTitleFrame').contentDocument;return {animations:[...d.querySelectorAll('#c2 .toy-logo span')].flatMap(x=>x.getAnimations().map(a=>a.animationName)),opacity:[...d.querySelectorAll('#c2 .toy-logo span')].map(x=>d.defaultView.getComputedStyle(x).opacity)};});
if(reducedState.animations.includes('littleHomeTitleDrop')||!reducedState.opacity.every(x=>x==='1'))throw new Error('Reduced-motion production title still animates');
await reduced.close();

console.log('STEP viewport fit');
for(const [w,h] of [[360,740],[412,915]]){
  const c=await browser.newContext({viewport:{width:w,height:h}}),p=await c.newPage();prep(p);await gotoApp(p);
  const fit=await p.evaluate(()=>{const r=document.querySelector('.production-home-wrap').getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,w:innerWidth,h:innerHeight,scroll:document.body.scrollWidth}});
  if(fit.left<-1||fit.right>fit.w+1||fit.top<-1||fit.bottom>fit.h+1||fit.scroll>fit.w+1)throw new Error(`Production home overflow at ${w}x${h}: ${JSON.stringify(fit)}`);
  await c.close();
}

console.log('STORY_TITLE_PRODUCTION_OK',JSON.stringify({homeState,titleMotion,storyCoverage,progression}));
await browser.close();
clearTimeout(watchdog);
