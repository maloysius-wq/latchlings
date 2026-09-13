import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT='/tmp/chapter3-pass3';
fs.mkdirSync(OUT,{recursive:true});
const results={checks:[],errors:[],screenshots:[],ranges:{}};
function assert(cond,msg){if(!cond)throw new Error(msg)}
function check(name,detail='ok'){results.checks.push({name,detail});console.log('CHECK',name,detail)}
async function shot(page,name){await page.screenshot({path:`${OUT}/${name}.png`,fullPage:false});results.screenshots.push(name+'.png')}

const browser=await chromium.launch({headless:true});
async function makeContext(viewport={width:390,height:844},opts={}){
 const reduced=!!opts.reduced,unlocked=opts.unlocked??400;
 const ctx=await browser.newContext({viewport,deviceScaleFactor:1,reducedMotion:reduced?'reduce':'no-preference'});
 const stars={};for(let i=1;i<unlocked;i++)stars[i]=3;
 await ctx.addInitScript(({unlocked,stars,reduced})=>{
  localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked,stars}));
  localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1,'across-drift':1,'old-maps':1,homeward:1}));
  localStorage.setItem('latchlings_ui_prefs_v1',JSON.stringify({motion:reduced?'reduced':'system',textSize:'normal'}));
 },{unlocked,stars,reduced});
 return ctx;
}
async function clearPresentation(page){
 await page.waitForTimeout(760);
 await page.evaluate(async()=>{
  try{const t=eval('activeScreenTransition');if(t?.finished)await t.finished}catch(_){}
  try{window.LatchlingsStoryTheme?.close(false)}catch(_){}
  try{if(window.LatchlingsCinematics?.active)window.LatchlingsCinematics.finish(true)}catch(_){}
  const sc=document.getElementById('storyCardOverlay');if(sc){sc.classList.remove('show');sc.setAttribute('aria-hidden','true')}
  const co=document.getElementById('cinematicOverlay');if(co){co.classList.remove('show','active');co.setAttribute('aria-hidden','true')}
  const o=document.getElementById('overlay');if(o)o.classList.remove('show','home-overlay');
 });
 await page.waitForTimeout(120);
 await page.evaluate(()=>{
  try{window.LatchlingsStoryTheme?.close(false)}catch(_){}
  const sc=document.getElementById('storyCardOverlay');if(sc){sc.classList.remove('show');sc.setAttribute('aria-hidden','true')}
  const o=document.getElementById('overlay');if(o)o.classList.remove('show','home-overlay');
 });
 await page.waitForTimeout(60);
}
async function settleGame(page,level,mode='campaign'){
 await page.evaluate(({level,mode})=>window.startLevel(level,mode),{level,mode});
 await clearPresentation(page);
}
async function boundsOk(page,label){
 const x=await page.evaluate(()=>({w:innerWidth,h:innerHeight,sw:document.documentElement.scrollWidth,bodyw:document.body.scrollWidth,controls:(()=>{const r=document.querySelector('.controls')?.getBoundingClientRect();return r?{top:r.top,bottom:r.bottom}:null})(),minTargets:(()=>{const a=Array.from(document.querySelectorAll('.controls button')).filter(x=>getComputedStyle(x).display!=='none').map(x=>Math.min(x.getBoundingClientRect().width,x.getBoundingClientRect().height));return a.length?Math.min(...a):0})()}));
 assert(x.sw<=x.w+1&&x.bodyw<=x.w+1,`${label} horizontal overflow ${JSON.stringify(x)}`);
 if(x.controls)assert(x.controls.bottom<=x.h+1,`${label} controls leave viewport ${JSON.stringify(x)}`);
 if(x.minTargets)assert(x.minTargets>=44,`${label} touch target below 44px ${JSON.stringify(x)}`);
 check(label+' containment',JSON.stringify(x));
}
async function boardContract(page,level,expected){
 await settleGame(page,level);
 const x=await page.evaluate(()=>{
  const game=document.getElementById('game'),board=document.getElementById('board'),cell=board.querySelector('.cell'),cs=getComputedStyle(cell),bef=getComputedStyle(cell,'::before'),aft=getComputedStyle(cell,'::after'),anchor=board.querySelector('.anchor');
  const count=s=>board.querySelectorAll(s).length;
  return {gameSlice:game.dataset.visualSlice||'',boardSlice:board.dataset.visualSlice||'',range:board.dataset.boardRange,bg:cs.backgroundImage,before:bef.opacity,after:aft.opacity,selected:count('.latchling.selected'),nestMatch:count('.nest.selected-match'),anchors:count('.anchor'),anchorStyle:anchor?{bg:getComputedStyle(anchor).backgroundImage,shadow:getComputedStyle(anchor).boxShadow,border:getComputedStyle(anchor).borderColor}:null};
 });
 assert(x.gameSlice===expected&&x.boardSlice===expected,`Level ${level} mode mismatch ${JSON.stringify(x)}`);
 if(expected==='lodestone'){
  assert(x.selected===1&&x.nestMatch===1,`Level ${level} selected/nest hierarchy missing ${JSON.stringify(x)}`);
  assert(x.before==='0'&&x.after==='0',`Level ${level} decorative pseudo rules visible ${JSON.stringify(x)}`);
  assert(!/repeating-|conic-gradient|radial-gradient/.test(x.bg),`Level ${level} rule-like cell floor ${x.bg}`);
  assert(x.anchors>0&&x.anchorStyle&&x.anchorStyle.bg!=='none'&&x.anchorStyle.shadow!=='none',`Level ${level} anchor treatment missing ${JSON.stringify(x)}`);
 }
 check(`Level ${level} visual contract`,JSON.stringify(x));return x;
}

const ctx=await makeContext({width:390,height:844},{unlocked:400});
const page=await ctx.newPage();page.setDefaultTimeout(12000);page.on('pageerror',e=>results.errors.push('pageerror: '+String(e)));
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
assert(!(await page.locator('meta[name="viewport"]').getAttribute('content')||'').includes('user-scalable=no'),'viewport zoom disabled');

const reps=[101,110,111,120,121,130,131,140,141,150];
for(const L of reps){
 const x=await boardContract(page,L,'lodestone');
 if([101,111,121,131,141].includes(L)){results.ranges[x.range]=x.bg;await shot(page,`chapter3-level${L}-390`)}
 if(L===150)await shot(page,'chapter3-level150-390');
}
assert(Object.keys(results.ranges).length===5,'Did not observe all five Lodestone ranges: '+JSON.stringify(results.ranges));
assert(new Set(Object.values(results.ranges)).size===5,'Lodestone movement materials are not distinct: '+JSON.stringify(results.ranges));
check('Five distinct Lodestone movement surfaces',JSON.stringify(results.ranges));

await boardContract(page,100,'lanternwood');
await settleGame(page,120,'daily');
let daily=await page.evaluate(()=>({game:document.getElementById('game').dataset.visualSlice||'',board:document.getElementById('board').dataset.visualSlice||'',mode:document.body.dataset.playMode}));
assert(daily.mode==='daily'&&!daily.game&&!daily.board,'Daily inherited campaign material: '+JSON.stringify(daily));check('Daily Chapter 3 isolation',JSON.stringify(daily));
await boardContract(page,151,'');
await boardContract(page,366,'aurora-dense');

// Movement 2 must expose the old Waykeeper marker as a recognizable Atlas landmark.
await page.evaluate(()=>eval("chapterView=3;rangeView=1;screen('levels');renderChapter()"));
await page.waitForTimeout(680);
await page.evaluate(()=>{const sc=document.getElementById('storyCardOverlay');if(sc){sc.classList.remove('show');sc.setAttribute('aria-hidden','true')}});
const atlas=await page.evaluate(()=>{
 const map=document.getElementById('levelGrid'),e=map.querySelector('.atlas-scene em'),r=e.getBoundingClientRect(),before=getComputedStyle(e,'::before'),after=getComputedStyle(e,'::after'),c=getComputedStyle(e);
 return {cls:map.className,route:map.dataset.routeShape,marker:{w:r.width,h:r.height,bg:c.backgroundImage,clip:c.clipPath,opacity:c.opacity,beforeContent:before.content,beforeBorder:before.borderTopWidth,beforeShadow:before.boxShadow,afterContent:after.content,afterBg:after.backgroundColor,afterShadow:after.boxShadow}};
});
assert(/atlas-range-2/.test(atlas.cls),'Chapter 3 movement-2 Atlas class missing: '+JSON.stringify(atlas));
assert(atlas.marker.w>=50&&atlas.marker.h>=60&&atlas.marker.beforeContent!=='none'&&atlas.marker.beforeShadow!=='none'&&atlas.marker.afterContent!=='none'&&atlas.marker.afterShadow!=='none','Old Waykeeper marker landmark missing: '+JSON.stringify(atlas));
check('Lodestone Atlas old Waykeeper marker',JSON.stringify(atlas));await shot(page,'chapter3-atlas-waykeeper-marker-390');
await ctx.close();

// Smallest supported phone endpoints.
const small=await makeContext({width:320,height:568},{unlocked:400});const sp=await small.newPage();sp.setDefaultTimeout(12000);sp.on('pageerror',e=>results.errors.push('small pageerror: '+String(e)));await sp.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
for(const L of [101,150]){await boardContract(sp,L,'lodestone');await boundsOk(sp,`Level ${L} 320`);await shot(sp,`chapter3-level${L}-320`)}
await small.close();

// Solve the real authored Level 150 route and inspect the chapter reward + Little Home anchor payoff.
const rewardCtx=await makeContext({width:390,height:844},{unlocked:150});const rp=await rewardCtx.newPage();rp.setDefaultTimeout(15000);rp.on('pageerror',e=>results.errors.push('reward pageerror: '+String(e)));await rp.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await settleGame(rp,150);
const solution=await rp.evaluate(()=>window.LEVELS[149].solution.map(x=>[x[0],x[1]]));
for(const [pi,d] of solution){
 const piece=rp.locator(`.latchling[data-pi="${pi}"]`);assert(await piece.count()===1,`Authored Level 150 solution references unavailable piece ${pi}`);
 if(!(await piece.evaluate(e=>e.classList.contains('selected'))))await piece.click();
 await rp.evaluate(async dir=>{await window.moveSelected(dir)},d);
}
await rp.locator('.chapter-three-reward').waitFor({state:'visible'});
const reward=await rp.evaluate(()=>({card:!!document.querySelector('.chapter-three-reward'),postcard:!!document.querySelector('.lodestone-reward-postcard'),crystals:document.querySelectorAll('.lodestone-reward-crystal').length,marker:!!document.querySelector('.lodestone-reward-marker'),anchor:!!document.querySelector('.lodestone-reward-anchor'),home:!!document.getElementById('chapterThreeRewardHome'),cont:!!document.getElementById('chapterThreeRewardContinue'),text:document.querySelector('.chapter-three-reward .chapter-reward-result')?.textContent||'',generic:!!document.querySelector('.story-beat-result')}));
assert(reward.card&&reward.postcard&&reward.crystals===3&&reward.marker&&reward.anchor&&reward.home&&reward.cont,'Chapter 3 reward incomplete: '+JSON.stringify(reward));
assert(!reward.generic&&/do not freeze the islands/i.test(reward.text),'Chapter 3 reward story payoff missing: '+JSON.stringify(reward));
check('Real Level 150 dedicated reward',JSON.stringify(reward));await shot(rp,'chapter3-level150-reward-390');
await rp.click('#chapterThreeRewardHome');
await rp.waitForTimeout(720);
const frame=rp.frameLocator('#homeTitleFrame');await frame.locator('#c2 .story-anchor').waitFor({state:'visible'});
const home=await frame.locator('#c2 .phone').evaluate(phone=>({stage3:phone.classList.contains('story-stage-3'),focus:phone.classList.contains('story-focus-anchor'),anchor:getComputedStyle(phone.querySelector('.story-anchor')).display,screen:parent.document.body.dataset.screen}));
assert(home.stage3&&home.focus&&home.anchor!=='none'&&home.screen==='home','Little Home restored-anchor payoff missing: '+JSON.stringify(home));check('Little Home restored-anchor payoff',JSON.stringify(home));await shot(rp,'chapter3-home-anchor-focus-390');await rewardCtx.close();

// Reduced motion must reach the same informative anchor state without depending on animation.
const reduced=await makeContext({width:390,height:844},{unlocked:151,reduced:true});const red=await reduced.newPage();red.setDefaultTimeout(10000);await red.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await red.evaluate(()=>window.focusHomeReward('anchor'));await red.waitForTimeout(220);const rframe=red.frameLocator('#homeTitleFrame');await rframe.locator('#c2 .story-anchor').waitFor({state:'visible'});const reducedHome=await rframe.locator('#c2 .phone').evaluate(phone=>({stage3:phone.classList.contains('story-stage-3'),focus:phone.classList.contains('story-focus-anchor'),display:getComputedStyle(phone.querySelector('.story-anchor')).display,animation:getComputedStyle(phone.querySelector('.story-anchor')).animationName}));assert(reducedHome.stage3&&reducedHome.focus&&reducedHome.display!=='none','Reduced-motion anchor payoff missing: '+JSON.stringify(reducedHome));check('Reduced-motion Chapter 3 payoff',JSON.stringify(reducedHome));await reduced.close();

assert(results.errors.length===0,'Browser errors: '+JSON.stringify(results.errors));
fs.writeFileSync(`${OUT}/results.json`,JSON.stringify(results,null,2));
console.log('CHAPTER3_PASS3_BROWSER_ACCEPTED');
await browser.close();
