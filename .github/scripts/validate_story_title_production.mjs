import { chromium } from 'playwright';

const base='http://127.0.0.1:8137/';
const browser=await chromium.launch({headless:true});

function watch(page,errors){
 page.on('console',m=>{if(m.type()==='error')errors.push('console:'+m.text())});
 page.on('pageerror',e=>errors.push('pageerror:'+e.message));
 page.on('requestfailed',r=>errors.push('request:'+r.url()+':'+(r.failure()?.errorText||'')));
}
async function homeFrame(page){
 await page.waitForSelector('#homeTitleFrame');
 await page.waitForFunction(()=>[...document.querySelectorAll('iframe')].some(f=>f.contentWindow&&f.src.includes('embed=1')));
 const frame=page.frames().find(f=>f.url().includes('title-island-concepts')&&f.url().includes('embed=1'));
 if(!frame)throw new Error('Production Little Home iframe not found');
 await frame.waitForSelector('#c2 .toy-logo');
 return frame;
}

const errors=[];
const context=await browser.newContext({viewport:{width:390,height:844}});
const page=await context.newPage();watch(page,errors);
await page.goto(base,{waitUntil:'networkidle'});
const frame=await homeFrame(page);
await page.waitForTimeout(150);

const homeState=await frame.evaluate(()=>{
 const c=document.querySelector('#c2'),phone=c.querySelector('.phone'),play=c.querySelector('.play');
 const visible=el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0};
 return {
  embed:document.body.classList.contains('embed-mode'),
  c2Visible:visible(c),introDisplay:getComputedStyle(document.querySelector('.intro')).display,switcherDisplay:getComputedStyle(document.querySelector('.switcher')).display,
  letters:c.querySelectorAll('.toy-logo span').length,tagline:c.querySelector('.toy-tagline')?.textContent.trim(),residents:c.querySelectorAll('.resident').length,adults:c.querySelectorAll('.resident.adult').length,children:c.querySelectorAll('.resident.child').length,pebbles:c.querySelectorAll('.float-pebble').length,clouds:c.querySelectorAll('.cloud').length,
  playBg:getComputedStyle(play).backgroundColor,playBgImage:getComputedStyle(play).backgroundImage,stageClasses:[...phone.classList].filter(x=>x.startsWith('story-stage-'))
 };
});
if(!homeState.embed||!homeState.c2Visible)throw new Error('Concept 2 is not the embedded production home');
if(homeState.introDisplay!=='none'||homeState.switcherDisplay!=='none')throw new Error('Preview chrome is visible in production embed');
if(homeState.letters!==10||homeState.tagline!=='Small friends. Smart puzzles.')throw new Error('Approved Wobbly Toy Letters branding changed');
if(homeState.residents!==5||homeState.adults!==3||homeState.children!==2||homeState.pebbles!==6||homeState.clouds!==4)throw new Error('Approved Little Home scene structure changed: '+JSON.stringify(homeState));
if(homeState.playBg!=='rgb(245, 222, 172)'||homeState.playBgImage!=='none')throw new Error('Approved #F5DEAC production Play control changed');

// Deterministically sample the first title letter's one-shot drop/bounce.
const titleMotion=await frame.evaluate(async()=>{
 restartLittleHomeTitle();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 const el=document.querySelector('#c2 .toy-logo span'),anim=el.getAnimations().find(a=>a.animationName==='littleHomeTitleDrop');
 if(!anim)throw new Error('littleHomeTitleDrop animation missing');anim.pause();
 const sample=async time=>{anim.currentTime=time;await new Promise(r=>requestAnimationFrame(r));const r=el.getBoundingClientRect(),cs=getComputedStyle(el);return {top:r.top,translate:cs.translate,opacity:+cs.opacity}};
 const start=await sample(0),impact=await sample(780*.56),rebound=await sample(780*.75),final=await sample(780);
 return {start,impact,rebound,final};
});
if(!(titleMotion.start.top<titleMotion.final.top-60))throw new Error('Production title does not start above final position');
if(!(titleMotion.impact.top>titleMotion.final.top+6))throw new Error('Production title lacks impact overshoot');
if(!(titleMotion.rebound.top<titleMotion.final.top-3))throw new Error('Production title lacks rebound');

await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/story-title-renders/production-home-fresh.png`,fullPage:true});

// Play must bridge from the approved title surface into the real campaign.
await frame.click('#c2 .play');
await page.waitForSelector('#game.active');
const gameStory=await page.evaluate(()=>({title:document.querySelector('#levelTitle').textContent.trim(),storyTitle:document.querySelector('#mechanicNote strong')?.textContent.trim(),context:document.querySelector('#mechanicNote span')?.textContent.trim(),tip:document.querySelector('#mechanicNote em')?.textContent.trim(),className:document.querySelector('#mechanicNote').className}));
if(gameStory.title!=='Level 1'||!gameStory.storyTitle||!gameStory.context||!gameStory.tip||!gameStory.className.includes('story-note'))throw new Error('Level 1 story context is not wired into gameplay: '+JSON.stringify(gameStory));

// Level metadata must cover all 400 boards and produce distinct titles.
const storyCoverage=await page.evaluate(()=>{const rows=Array.from({length:400},(_,i)=>LATCHLINGS_STORY.levelMeta(i+1));return {count:rows.length,unique:new Set(rows.map(x=>`${x.chapter}:${x.title}`)).size,missing:rows.filter(x=>!x.title||!x.context||!x.mechanic).length,chapters:LATCHLINGS_STORY.chapters.map(x=>x.name)};});
if(storyCoverage.count!==400||storyCoverage.unique!==400||storyCoverage.missing!==0)throw new Error('400-level story metadata coverage failed: '+JSON.stringify(storyCoverage));
const expectedChapters=['Morning Routes','Neighbors','Holding Fast','Market Day','The Long Drift','Old Ways','Coming Together','Homeward'];
if(JSON.stringify(storyCoverage.chapters)!==JSON.stringify(expectedChapters))throw new Error('Story chapter order changed: '+JSON.stringify(storyCoverage.chapters));

// Level Select must carry story identity while keeping mechanic/location framing.
await page.evaluate(()=>screen('home'));await page.waitForTimeout(80);
const frame2=await homeFrame(page);
await frame2.locator('#c2 .secondary button').nth(1).click();
await page.waitForSelector('#levels.active');
const chapterText=await page.locator('#chapterHead').innerText();
const chapterTextLower=chapterText.toLowerCase();
if(!chapterText.includes('Chapter 1: Morning Routes')||!chapterTextLower.includes('sunpetal meadows')||!chapterText.includes('Route language:')||!chapterTextLower.includes('edges, rocks'))throw new Error('Narrative chapter header missing required story/mechanic framing: '+chapterText);

// Settings must expose optional lore without interrupting normal play.
await page.evaluate(()=>screen('home'));await page.waitForTimeout(80);
const frame3=await homeFrame(page);await frame3.click('#c2 .settings');
await page.waitForSelector('#settingsStory');await page.click('#settingsStory');
const lore=await page.locator('#modal').innerText();
for(const name of ['Pippa','Bramble','Rowan','Pip','Tansy','Waykeeper','Skyway'])if(!lore.includes(name))throw new Error('Lore modal missing '+name);
await page.evaluate(()=>closeModal());

// Milestone completion should add a story beat without changing the star result flow.
await page.evaluate(()=>{currentLevel=10;movesUsed=LEVELS[9].optimal;winLevel()});
await page.waitForSelector('.story-beat');
const beatText=await page.locator('.story-beat').innerText();
if(!beatText.includes('Morning Routes')||!beatText.includes('household'))throw new Error('Level 10 milestone beat missing: '+beatText);
await page.evaluate(()=>closeModal());

await page.evaluate(()=>screen('complete'));
const completeText=await page.locator('#complete').innerText();
if(!completeText.includes('The Skyway Lives Again')||!completeText.includes('keep drifting')||!completeText.includes('Return to Little Home'))throw new Error('Campaign completion story copy not promoted');

if(errors.length)throw new Error('Primary production browser errors: '+errors.join(' | '));
await context.close();

// Fully completed progress should reveal all eight Little Home environmental keepsakes.
const progressedErrors=[];
const progressed=await browser.newContext({viewport:{width:390,height:844}});
await progressed.addInitScript(()=>{const stars={};for(let ch=1;ch<=8;ch++)stars[ch*50]=3;localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked:400,stars}));});
const pp=await progressed.newPage();watch(pp,progressedErrors);await pp.goto(base,{waitUntil:'networkidle'});const pf=await homeFrame(pp);await pp.waitForTimeout(180);
const progression=await pf.evaluate(()=>{const phone=document.querySelector('#c2 .phone'),sel=['.story-mailbox','.story-pennant','.story-anchor','.story-bunting','.story-telescope','.story-relic','.story-dock','.story-distant-islands'];return {classes:[...phone.classList].filter(x=>x.startsWith('story-stage-')),shown:sel.map(s=>getComputedStyle(document.querySelector(s)).display)};});
if(progression.classes.length!==8||progression.shown.some(x=>x==='none'))throw new Error('Little Home chapter progression is incomplete: '+JSON.stringify(progression));
await pp.screenshot({path:`${process.env.GITHUB_WORKSPACE}/story-title-renders/production-home-complete.png`,fullPage:true});
if(progressedErrors.length)throw new Error('Progressed production browser errors: '+progressedErrors.join(' | '));
await progressed.close();

// Reduced motion must present the completed title immediately.
const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const rp=await reduced.newPage();await rp.goto(base,{waitUntil:'networkidle'});const rf=await homeFrame(rp);await rp.waitForTimeout(80);
const reducedState=await rf.evaluate(()=>({animations:[...document.querySelectorAll('#c2 .toy-logo span')].flatMap(x=>x.getAnimations().map(a=>a.animationName)),opacity:[...document.querySelectorAll('#c2 .toy-logo span')].map(x=>getComputedStyle(x).opacity)}));
if(reducedState.animations.includes('littleHomeTitleDrop')||!reducedState.opacity.every(x=>x==='1'))throw new Error('Reduced-motion production title still animates');
await reduced.close();

// The production title must fit common shorter/taller mobile viewports without overflow.
for(const [w,h] of [[360,740],[412,915]]){
 const c=await browser.newContext({viewport:{width:w,height:h}}),p=await c.newPage();await p.goto(base,{waitUntil:'networkidle'});await homeFrame(p);
 const fit=await p.evaluate(()=>{const r=document.querySelector('.production-home-wrap').getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,w:innerWidth,h:innerHeight,scroll:document.body.scrollWidth}});
 if(fit.left<-1||fit.right>fit.w+1||fit.top<-1||fit.bottom>fit.h+1||fit.scroll>fit.w+1)throw new Error(`Production home overflow at ${w}x${h}: ${JSON.stringify(fit)}`);
 await c.close();
}

console.log('STORY_TITLE_PRODUCTION_OK',JSON.stringify({homeState,titleMotion,storyCoverage,progression}));
await browser.close();
