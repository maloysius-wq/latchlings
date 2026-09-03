import {chromium} from 'playwright';
import fs from 'fs';
const BASE='http://127.0.0.1:8140/';
const OUT='story-cadence-transition-renders';
fs.mkdirSync(OUT,{recursive:true});
const ok=(c,m)=>{if(!c)throw new Error(m)};
const browser=await chromium.launch({headless:true});
const ctx=await browser.newContext({viewport:{width:390,height:844}});
const page=await ctx.newPage();
const problems=[];
page.on('pageerror',e=>problems.push('page:'+e.message));
page.on('console',m=>{if(m.type()==='error')problems.push('console:'+m.text())});
page.on('requestfailed',r=>{const u=r.url(),e=r.failure()?.errorText||'';if(/\.(?:mp3|wav|ogg|m4a)($|\?)/i.test(u)&&/ERR_ABORTED/.test(e))return;problems.push('request:'+u+':'+e)});
await page.goto(BASE,{waitUntil:'domcontentloaded'});
await page.waitForTimeout(450);

console.log('STEP home phone background');
let home=await page.evaluate(()=>{const q=s=>document.querySelector(s),r=e=>{const x=e.getBoundingClientRect();return{x:x.x,y:x.y,w:x.width,h:x.height}};const app=q('#app'),wrap=q('.production-home-wrap'),back=q('.chapter-material-backdrop');return{bodyScreen:document.body.dataset.screen,home:r(q('#home')),wrap:r(wrap),wrapShadow:getComputedStyle(wrap).boxShadow,homeBg:getComputedStyle(q('#home')).backgroundImage,appBg:getComputedStyle(app).backgroundImage,beforeOpacity:getComputedStyle(app,'::before').opacity,afterOpacity:getComputedStyle(app,'::after').opacity,backDisplay:getComputedStyle(back).display,scrollW:document.documentElement.scrollWidth,innerW:innerWidth}});
ok(home.bodyScreen==='home','Initial body screen is not home');ok(home.home.w>=389,'Home does not fill phone width');ok(home.wrapShadow==='none','Little Home still has a production panel shadow');ok(home.beforeOpacity==='0'&&home.afterOpacity==='0','Legacy app clouds remain visible behind home');ok(home.backDisplay==='none','Chapter material backdrop remains visible on home');ok(home.homeBg.includes('linear-gradient'),'Home does not own a sky gradient');ok(home.scrollW<=home.innerW+1,'Phone home horizontal overflow');
await page.screenshot({path:`${OUT}/home-phone.png`,fullPage:true});

console.log('STEP home wide background');
await page.setViewportSize({width:1365,height:768});await page.waitForTimeout(120);
home=await page.evaluate(()=>{const h=document.querySelector('#home').getBoundingClientRect(),w=document.querySelector('.production-home-wrap').getBoundingClientRect(),app=document.querySelector('#app');return{homeW:h.width,homeH:h.height,wrapW:w.width,wrapH:w.height,shadow:getComputedStyle(document.querySelector('.production-home-wrap')).boxShadow,bg:getComputedStyle(document.querySelector('#home')).backgroundImage,before:getComputedStyle(app,'::before').opacity,back:getComputedStyle(document.querySelector('.chapter-material-backdrop')).display,scrollW:document.documentElement.scrollWidth,innerW:innerWidth}});
ok(home.homeW>=1364&&home.homeH>=767,'Wide home does not cover viewport');ok(home.wrapW<500&&home.wrapH>=760,'Little Home scene no longer stays centered/portrait on wide viewport');ok(home.shadow==='none','Wide home still looks like a floating panel');ok(home.before==='0'&&home.back==='none','Legacy backdrop survives on wide home');ok(home.scrollW<=home.innerW+1,'Wide home horizontal overflow');
await page.screenshot({path:`${OUT}/home-wide.png`,fullPage:true});

console.log('STEP actual home to levels whoosh');
await page.setViewportSize({width:390,height:844});await page.waitForTimeout(150);
const frame=page.frames().find(f=>/title-island-concepts/.test(f.url()));ok(frame,'Little Home iframe missing');
await frame.locator('#c2 .secondary button:nth-child(2)').click();
await page.waitForTimeout(95);
let trans=await page.evaluate(()=>({screen:document.body.dataset.screen,levels:document.querySelector('#levels').classList.contains('active'),veil:document.querySelector('#screenWhoosh').classList.contains('run'),veilAnim:getComputedStyle(document.querySelector('#screenWhoosh')).animationName,arrive:document.querySelector('#levels').classList.contains('screen-arriving'),arriveAnim:getComputedStyle(document.querySelector('#levels')).animationName}));
ok(trans.screen==='levels'&&trans.levels,'Level Select navigation failed');ok(trans.veil&&trans.veilAnim==='latchlingsScreenWhoosh','Whoosh veil did not animate on screen change');ok(trans.arrive&&trans.arriveAnim==='latchlingsScreenArrive','Destination blur/settle did not animate');
await page.screenshot({path:`${OUT}/whoosh-to-levels.png`,fullPage:true});
await page.waitForTimeout(430);ok(!(await page.locator('#screenWhoosh').evaluate(e=>e.classList.contains('run'))),'Whoosh did not clean itself up');
await page.evaluate(()=>screen('levels'));await page.waitForTimeout(40);ok(!(await page.locator('#screenWhoosh').evaluate(e=>e.classList.contains('run'))),'Same-screen call incorrectly replayed whoosh');

console.log('STEP story auto cadence');
const auto=await page.evaluate(()=>Array.from({length:400},(_,i)=>LATCHLINGS_STORY.levelMeta(i+1)).filter(m=>LatchlingsStoryTheme.autoEligible(m)).map(m=>m.level));
ok(auto.length===48,`Expected 48 automatic story moments, got ${auto.length}`);ok(auto.includes(1)&&auto.includes(10)&&auto.includes(50)&&auto.includes(51)&&auto.includes(400),'Automatic story cadence missing expected chapter/turning-point levels');ok(!auto.includes(2)&&!auto.includes(11)&&!auto.includes(52),'Routine levels incorrectly auto-eligible');
await page.evaluate(()=>{localStorage.removeItem('latchlings_story_cards_seen_v1');startLevel(2)});await page.waitForTimeout(180);ok(!(await page.locator('#storyCardOverlay').evaluate(e=>e.classList.contains('show'))),'Routine Level 2 auto-opened a Story Card');
await page.click('#storyCardBtn');await page.waitForTimeout(30);ok(await page.locator('#storyCardOverlay').evaluate(e=>e.classList.contains('show')),'Manual Story button failed on routine level');ok((await page.locator('#storyCardOverlay').getAttribute('data-manual'))==='1','Routine manual Story Card not marked manual');await page.click('#storyCardContinue');
await page.evaluate(()=>{localStorage.removeItem('latchlings_story_cards_seen_v1');startLevel(10)});await page.waitForTimeout(180);ok(await page.locator('#storyCardOverlay').evaluate(e=>e.classList.contains('show')),'Turning-point Level 10 did not auto-open Story Card');ok((await page.locator('#storyCardKind').textContent())==='Turning point','Level 10 Story Card is not labeled Turning point');await page.click('#storyCardContinue');await page.evaluate(()=>startLevel(10));await page.waitForTimeout(180);ok(!(await page.locator('#storyCardOverlay').evaluate(e=>e.classList.contains('show'))),'Seen Level 10 Story Card repeated on retry');
await page.evaluate(()=>{localStorage.removeItem('latchlings_story_cards_seen_v1');startLevel(51)});await page.waitForTimeout(180);ok(await page.locator('#storyCardOverlay').evaluate(e=>e.classList.contains('show')),'Chapter-opening Level 51 did not auto-open Story Card');ok((await page.locator('#storyCardKind').textContent())==='Chapter opening','Level 51 Story Card is not labeled Chapter opening');await page.screenshot({path:`${OUT}/chapter-opening-story.png`,fullPage:true});await page.click('#storyCardContinue');

console.log('STEP screen routing after transitions');
await page.evaluate(()=>screen('story'));await page.waitForTimeout(470);ok((await page.locator('#story').getAttribute('class')).includes('active'),'Story screen did not activate');ok((await page.evaluate(()=>document.body.dataset.screen))==='story','Body screen state not Story');
await page.evaluate(()=>screen('home'));await page.waitForTimeout(470);ok((await page.locator('#home').getAttribute('class')).includes('active'),'Home did not reactivate');ok((await page.evaluate(()=>document.body.dataset.screen))==='home','Body screen state not Home after return');

console.log('STEP compact home');
await page.setViewportSize({width:360,height:740});await page.waitForTimeout(150);const compact=await page.evaluate(()=>({scrollW:document.documentElement.scrollWidth,innerW:innerWidth,home:document.querySelector('#home').getBoundingClientRect().toJSON(),shadow:getComputedStyle(document.querySelector('.production-home-wrap')).boxShadow,legacy:getComputedStyle(document.querySelector('#app'),'::before').opacity}));ok(compact.scrollW<=compact.innerW+1,'Compact viewport overflow');ok(compact.home.width>=359,'Compact Home not full viewport');ok(compact.shadow==='none'&&compact.legacy==='0','Compact Home shows legacy panel/background');await page.screenshot({path:`${OUT}/home-compact.png`,fullPage:true});

console.log('STEP reduced motion');
const reducedCtx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const reducedPage=await reducedCtx.newPage();await reducedPage.goto(BASE,{waitUntil:'domcontentloaded'});await reducedPage.waitForTimeout(120);await reducedPage.evaluate(()=>screen('levels'));await reducedPage.waitForTimeout(30);const reduced=await reducedPage.evaluate(()=>({veilRun:document.querySelector('#screenWhoosh').classList.contains('run'),veilDisplay:getComputedStyle(document.querySelector('#screenWhoosh')).display,arrive:document.querySelector('#levels').classList.contains('screen-arriving'),anim:getComputedStyle(document.querySelector('#levels')).animationName,screen:document.body.dataset.screen}));ok(reduced.screen==='levels','Reduced-motion screen navigation failed');ok(!reduced.veilRun&&reduced.veilDisplay==='none','Reduced motion did not disable whoosh');ok(!reduced.arrive||reduced.anim==='none','Reduced motion did not disable arrival animation');await reducedCtx.close();

ok(problems.length===0,'Browser problems: '+problems.join(' | '));
console.log('STORY_CADENCE_HOME_TRANSITION_OK',JSON.stringify({autoCount:auto.length,phone:home,transition:trans,compact:{scrollW:compact.scrollW,innerW:compact.innerW},reduced}));
await browser.close();
