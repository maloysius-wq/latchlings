import {chromium} from 'playwright';
import fs from 'fs';

const BASE='http://127.0.0.1:8141/';
const OUT='swipe-transition-renders';
fs.mkdirSync(OUT,{recursive:true});
const ok=(c,m)=>{if(!c)throw new Error(m)};

const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844}});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push('page:'+e.message));
page.on('console',m=>{if(m.type()==='error')errors.push('console:'+m.text())});
page.on('requestfailed',r=>{
  const u=r.url(),e=r.failure()?.errorText||'';
  if(/\.(?:mp3|wav|ogg|m4a)($|\?)/.test(u)&&/ERR_ABORTED/.test(e))return;
  errors.push('request:'+u+':'+e);
});

await page.goto(BASE,{waitUntil:'domcontentloaded'});
await page.waitForFunction(()=>document.getElementById('homeTitleFrame')?.contentDocument?.readyState==='complete');
await page.waitForFunction(()=>window.LatchlingsSFX&&window.LatchlingsHomeAction);

const support=await page.evaluate(()=>typeof document.startViewTransition==='function');
ok(support,'Chromium does not expose document.startViewTransition');

await page.evaluate(()=>{
  window.__vtCalls=0;
  window.__swipeSfxCalls=0;
  const native=document.startViewTransition.bind(document);
  Object.defineProperty(document,'startViewTransition',{configurable:true,value:(cb)=>{window.__vtCalls++;return native(cb)}});
  const orig=window.LatchlingsSFX.screenSwipe;
  window.LatchlingsSFX.screenSwipe=()=>{window.__swipeSfxCalls++;return orig()};
});

console.log('STEP home to levels actual swipe');
await page.evaluate(()=>window.LatchlingsHomeAction('levels'));
await page.waitForTimeout(72);
await page.screenshot({path:`${OUT}/home-to-levels-mid-swipe.png`,fullPage:true});
let state=await page.evaluate(()=>({screen:document.body.dataset.screen,levels:document.getElementById('levels').classList.contains('active'),vt:window.__vtCalls,sfx:window.__swipeSfxCalls,anims:document.getAnimations().map(a=>({pseudo:a.effect?.pseudoElement||'',time:a.currentTime||0}))}));
ok(state.screen==='levels'&&state.levels,'Home→Levels destination not active');
ok(state.vt===1,'Home→Levels should start one View Transition');
ok(state.sfx===1,'Home→Levels should play one swipe sound');
await page.waitForTimeout(190);

console.log('STEP levels to game actual swipe');
await page.evaluate(()=>startLevel(1));
await page.waitForTimeout(65);
await page.screenshot({path:`${OUT}/levels-to-game-mid-swipe.png`,fullPage:true});
state=await page.evaluate(()=>({screen:document.body.dataset.screen,game:document.getElementById('game').classList.contains('active'),vt:window.__vtCalls,sfx:window.__swipeSfxCalls}));
ok(state.screen==='game'&&state.game,'Levels→Game destination not active');
ok(state.vt===2&&state.sfx===2,'Levels→Game should add exactly one transition and sound');
await page.waitForTimeout(190);

console.log('STEP game to next level has no swipe');
await page.evaluate(()=>{window.__beforeLevelVT=window.__vtCalls;window.__beforeLevelSFX=window.__swipeSfxCalls;startLevel(2)});
await page.waitForTimeout(90);
state=await page.evaluate(()=>({screen:document.body.dataset.screen,level:document.getElementById('levelTitle').textContent,vt:window.__vtCalls,sfx:window.__swipeSfxCalls,bvt:window.__beforeLevelVT,bsfx:window.__beforeLevelSFX}));
ok(state.screen==='game'&&/Level 2/.test(state.level),'Level 2 did not load on Game screen');
ok(state.vt===state.bvt,'Game→Game next level incorrectly started a transition');
ok(state.sfx===state.bsfx,'Game→Game next level incorrectly played swipe sound');

console.log('STEP retry same game has no swipe');
await page.evaluate(()=>{window.__beforeRetryVT=window.__vtCalls;window.__beforeRetrySFX=window.__swipeSfxCalls;startLevel(2)});
await page.waitForTimeout(70);
state=await page.evaluate(()=>({vt:window.__vtCalls,sfx:window.__swipeSfxCalls,bvt:window.__beforeRetryVT,bsfx:window.__beforeRetrySFX}));
ok(state.vt===state.bvt&&state.sfx===state.bsfx,'Retry on Game triggered swipe transition/audio');

console.log('STEP game to story, story to home');
await page.evaluate(()=>openStoryScreen());
await page.waitForTimeout(240);
state=await page.evaluate(()=>({screen:document.body.dataset.screen,vt:window.__vtCalls,sfx:window.__swipeSfxCalls}));
ok(state.screen==='story'&&state.vt===3&&state.sfx===3,'Game→Story transition mismatch');
await page.evaluate(()=>document.getElementById('storyBack').click());
await page.waitForTimeout(240);
state=await page.evaluate(()=>({screen:document.body.dataset.screen,vt:window.__vtCalls,sfx:window.__swipeSfxCalls}));
ok(state.screen==='home'&&state.vt===4&&state.sfx===4,'Story→Home transition mismatch');
await page.screenshot({path:`${OUT}/home-after-swipe.png`,fullPage:true});

console.log('STEP same screen home call has no swipe');
await page.evaluate(()=>{window.__beforeSameVT=window.__vtCalls;window.__beforeSameSFX=window.__swipeSfxCalls;screen('home')});
await page.waitForTimeout(60);
state=await page.evaluate(()=>({vt:window.__vtCalls,sfx:window.__swipeSfxCalls,bvt:window.__beforeSameVT,bsfx:window.__beforeSameSFX}));
ok(state.vt===state.bvt&&state.sfx===state.bsfx,'Same-screen Home call replayed transition/audio');

console.log('STEP compact viewport');
await page.setViewportSize({width:360,height:740});
await page.evaluate(()=>window.LatchlingsHomeAction('levels'));
await page.waitForTimeout(240);
state=await page.evaluate(()=>({scrollW:document.documentElement.scrollWidth,innerW:innerWidth,screen:document.body.dataset.screen}));
ok(state.screen==='levels'&&state.scrollW<=state.innerW+1,'Compact transition caused horizontal overflow');

console.log('STEP reduced motion bypass');
const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
const rpage=await reduced.newPage();
await rpage.goto(BASE,{waitUntil:'domcontentloaded'});
await rpage.waitForFunction(()=>window.LatchlingsSFX&&window.LatchlingsHomeAction);
await rpage.evaluate(()=>{
  window.__vtCalls=0;window.__swipeSfxCalls=0;
  const native=document.startViewTransition.bind(document);
  Object.defineProperty(document,'startViewTransition',{configurable:true,value:(cb)=>{window.__vtCalls++;return native(cb)}});
  const orig=window.LatchlingsSFX.screenSwipe;window.LatchlingsSFX.screenSwipe=()=>{window.__swipeSfxCalls++;return orig()};
  window.LatchlingsHomeAction('levels');
});
await rpage.waitForTimeout(80);
const rs=await rpage.evaluate(()=>({screen:document.body.dataset.screen,vt:window.__vtCalls,sfx:window.__swipeSfxCalls}));
ok(rs.screen==='levels','Reduced-motion navigation failed');
ok(rs.vt===0&&rs.sfx===0,'Reduced motion should bypass both swipe animation and whoosh');
await reduced.close();

console.log('STEP unsupported API fallback');
const fallback=await browser.newContext({viewport:{width:390,height:844}});
const fpage=await fallback.newPage();
await fpage.addInitScript(()=>{Object.defineProperty(document,'startViewTransition',{configurable:true,value:undefined})});
await fpage.goto(BASE,{waitUntil:'domcontentloaded'});
await fpage.waitForFunction(()=>window.LatchlingsSFX&&window.LatchlingsHomeAction);
await fpage.evaluate(()=>{window.__swipeSfxCalls=0;const orig=window.LatchlingsSFX.screenSwipe;window.LatchlingsSFX.screenSwipe=()=>{window.__swipeSfxCalls++;return orig()};window.LatchlingsHomeAction('levels')});
await fpage.waitForTimeout(80);
const fsState=await fpage.evaluate(()=>({screen:document.body.dataset.screen,sfx:window.__swipeSfxCalls}));
ok(fsState.screen==='levels'&&fsState.sfx===0,'Unsupported API fallback should navigate instantly without whoosh');
await fallback.close();

ok(errors.length===0,'Browser errors: '+errors.join(' | '));
console.log('SWIPE_TRANSITION_BROWSER_OK',JSON.stringify({final:state,reduced:rs,fallback:fsState}));
await browser.close();
