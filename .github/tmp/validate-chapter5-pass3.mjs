import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT='/tmp/chapter5-pass3';
fs.mkdirSync(OUT,{recursive:true});
const results={checks:[],errors:[],screenshots:[],ranges:{},colorGateSamples:[]};
function assert(cond,msg){if(!cond)throw new Error(msg)}
function check(name,detail='ok'){results.checks.push({name,detail});console.log('CHECK',name,detail)}
async function shot(page,name){await page.screenshot({path:`${OUT}/${name}.png`,fullPage:false});results.screenshots.push(name+'.png')}

const browser=await chromium.launch({headless:true});
async function makeContext(viewport={width:390,height:844},opts={}){
 const reduced=!!opts.reduced,unlocked=opts.unlocked??400,seen=opts.seen??{opening:1,'across-drift':1,'old-maps':1,homeward:1};
 const ctx=await browser.newContext({viewport,deviceScaleFactor:1,reducedMotion:reduced?'reduce':'no-preference'});
 const stars={};for(let i=1;i<unlocked;i++)stars[i]=3;
 await ctx.addInitScript(({unlocked,stars,reduced,seen})=>{
  localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked,stars}));
  localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify(seen));
  localStorage.setItem('latchlings_ui_prefs_v1',JSON.stringify({motion:reduced?'reduced':'system',textSize:'normal'}));
 },{unlocked,stars,reduced,seen});
 return ctx;
}
async function clearPresentation(page){
 await page.waitForTimeout(780);
 await page.evaluate(async()=>{
  try{const t=eval('activeScreenTransition');if(t?.finished)await t.finished}catch(_){}
  try{window.LatchlingsStoryTheme?.close(false)}catch(_){}
  try{if(window.LatchlingsCinematics?.active)window.LatchlingsCinematics.finish(true)}catch(_){}
  const sc=document.getElementById('storyCardOverlay');if(sc){sc.classList.remove('show');sc.setAttribute('aria-hidden','true')}
  const co=document.getElementById('cinematicOverlay');if(co){co.classList.remove('show','active');co.setAttribute('aria-hidden','true')}
  const o=document.getElementById('overlay');if(o)o.classList.remove('show','home-overlay');
 });
 await page.waitForTimeout(140);
 await page.evaluate(()=>{
  try{window.LatchlingsStoryTheme?.close(false)}catch(_){}
  const sc=document.getElementById('storyCardOverlay');if(sc){sc.classList.remove('show');sc.setAttribute('aria-hidden','true')}
  const o=document.getElementById('overlay');if(o)o.classList.remove('show','home-overlay');
 });
 await page.waitForTimeout(70);
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
  const game=document.getElementById('game'),board=document.getElementById('board'),cell=board.querySelector('.cell'),cs=getComputedStyle(cell),bef=getComputedStyle(cell,'::before'),aft=getComputedStyle(cell,'::after');
  const count=s=>board.querySelectorAll(s).length;
  const cg=board.querySelector('.gate.color');let colorGate=null;
  if(cg){const g=getComputedStyle(cg),span=cg.querySelector('span'),sg=span?getComputedStyle(span):null;const variable=g.getPropertyValue('--gate-color').trim();colorGate={variable,border:g.borderTopColor,borderWidth:g.borderTopWidth,bg:g.backgroundImage,shadow:g.boxShadow,inner:sg?.backgroundColor||'',innerShadow:sg?.boxShadow||''}}
  const suit=board.querySelector('.gate.suit');let suitGate=null;if(suit){const g=getComputedStyle(suit),svg=suit.querySelector('svg'),sg=svg?getComputedStyle(svg):null;suitGate={border:g.borderTopColor,borderWidth:g.borderTopWidth,bg:g.backgroundImage,fill:sg?.fill||''}}
  return {gameSlice:game.dataset.visualSlice||'',boardSlice:board.dataset.visualSlice||'',range:board.dataset.boardRange,bg:cs.backgroundImage,before:bef.opacity,after:aft.opacity,selected:count('.latchling.selected'),nestMatch:count('.nest.selected-match'),colorGates:count('.gate.color'),suitGates:count('.gate.suit'),colorGate,suitGate};
 });
 assert(x.gameSlice===expected&&x.boardSlice===expected,`Level ${level} mode mismatch ${JSON.stringify(x)}`);
 if(expected==='prism'){
  assert(x.selected===1&&x.nestMatch===1,`Level ${level} selected/nest hierarchy missing ${JSON.stringify(x)}`);
  assert(x.before==='0'&&x.after==='0',`Level ${level} decorative pseudo rules visible ${JSON.stringify(x)}`);
  assert(!/repeating-|conic-gradient|radial-gradient/.test(x.bg),`Level ${level} rule-like cell floor ${x.bg}`);
  if(x.colorGate){
   assert(parseFloat(x.colorGate.borderWidth)>=3&&x.colorGate.bg!=='none'&&x.colorGate.shadow!=='none',`Level ${level} color-gate glass treatment missing ${JSON.stringify(x)}`);
   assert(x.colorGate.variable&&x.colorGate.border===x.colorGate.variable&&x.colorGate.inner===x.colorGate.variable,`Level ${level} color-gate keyed edge/core mismatch ${JSON.stringify(x.colorGate)}`);
   results.colorGateSamples.push({level,...x.colorGate});
  }
  if(x.suitGate)assert(parseFloat(x.suitGate.borderWidth)>=3&&x.suitGate.fill&&x.suitGate.fill!=='none',`Level ${level} suit gate lost readability ${JSON.stringify(x.suitGate)}`);
 }
 check(`Level ${level} visual contract`,JSON.stringify(x));return x;
}

const ctx=await makeContext({width:390,height:844},{unlocked:400});
const page=await ctx.newPage();page.setDefaultTimeout(14000);page.on('pageerror',e=>results.errors.push('pageerror: '+String(e)));
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
assert(!(await page.locator('meta[name="viewport"]').getAttribute('content')||'').includes('user-scalable=no'),'viewport zoom disabled');
const reps=[201,210,211,220,221,230,231,240,241,250];
for(const L of reps){
 const x=await boardContract(page,L,'prism');
 if([201,211,221,231,241].includes(L)){results.ranges[x.range]=x.bg;await shot(page,`chapter5-level${L}-390`)}
 if(L===250)await shot(page,'chapter5-level250-390');
}
assert(Object.keys(results.ranges).length===5,'Did not observe all five Prism ranges: '+JSON.stringify(results.ranges));
assert(new Set(Object.values(results.ranges)).size===5,'Prism movement materials are not distinct: '+JSON.stringify(results.ranges));
assert(results.colorGateSamples.length>0,'No Chapter 5 color gate sampled');
check('Five distinct Prism movement surfaces',JSON.stringify(results.ranges));
check('Prism color-gate samples',JSON.stringify(results.colorGateSamples));

await boardContract(page,200,'masquerade');
await settleGame(page,225,'daily');
let daily=await page.evaluate(()=>({game:document.getElementById('game').dataset.visualSlice||'',board:document.getElementById('board').dataset.visualSlice||'',mode:document.body.dataset.playMode}));
assert(daily.mode==='daily'&&!daily.game&&!daily.board,'Daily inherited Prism material: '+JSON.stringify(daily));check('Daily Chapter 5 isolation',JSON.stringify(daily));
await boardContract(page,251,'');
await boardContract(page,366,'aurora-dense');

// Movement 3 must expose the Prism lookout aimed toward two familiar amber lights.
await page.evaluate(()=>eval("chapterView=5;rangeView=2;screen('levels');renderChapter()"));
await page.waitForTimeout(720);
await page.evaluate(()=>{const sc=document.getElementById('storyCardOverlay');if(sc){sc.classList.remove('show');sc.setAttribute('aria-hidden','true')}});
const atlas=await page.evaluate(()=>{
 const map=document.getElementById('levelGrid'),e=map.querySelector('.atlas-scene em'),r=e.getBoundingClientRect(),before=getComputedStyle(e,'::before'),after=getComputedStyle(e,'::after'),c=getComputedStyle(e);
 return {cls:map.className,lookout:{w:r.width,h:r.height,border:c.borderTopWidth,radius:c.borderTopLeftRadius,bg:c.backgroundImage,opacity:c.opacity,scope:before.backgroundImage,scopeW:before.width,lightsBg:after.backgroundColor,lightsShadow:after.boxShadow,lightsW:after.width}};
});
assert(/atlas-range-3/.test(atlas.cls),'Chapter 5 movement-3 Atlas class missing: '+JSON.stringify(atlas));
assert(atlas.lookout.w>=75&&atlas.lookout.h>=60&&parseFloat(atlas.lookout.border)>=7&&atlas.lookout.scope!=='none'&&parseFloat(atlas.lookout.scopeW)>=35&&atlas.lookout.lightsBg!=='rgba(0, 0, 0, 0)'&&atlas.lookout.lightsShadow!=='none','Prism lookout / twin lights landmark missing: '+JSON.stringify(atlas));
check('Prism Atlas glasshouse lookout and twin amber lights',JSON.stringify(atlas));await shot(page,'chapter5-atlas-lookout-twin-lights-390');
await ctx.close();

// Smallest supported phone endpoints.
const small=await makeContext({width:320,height:568},{unlocked:400});const sp=await small.newPage();sp.setDefaultTimeout(14000);sp.on('pageerror',e=>results.errors.push('small pageerror: '+String(e)));await sp.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
for(const L of [201,250]){await boardContract(sp,L,'prism');await boundsOk(sp,`Level ${L} 320`);await shot(sp,`chapter5-level${L}-320`)}
await small.close();

// Solve the real authored Level 250 route and inspect the dedicated reward + telescope payoff.
const rewardCtx=await makeContext({width:390,height:844},{unlocked:250,seen:{opening:1}});const rp=await rewardCtx.newPage();rp.setDefaultTimeout(18000);rp.on('pageerror',e=>results.errors.push('reward pageerror: '+String(e)));await rp.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await settleGame(rp,250);
const solution=await rp.evaluate(()=>window.LEVELS[249].solution.map(x=>[x[0],x[1]]));
for(const [pi,d] of solution){
 const piece=rp.locator(`.latchling[data-pi="${pi}"]`);assert(await piece.count()===1,`Authored Level 250 solution references unavailable piece ${pi}`);
 if(!(await piece.evaluate(e=>e.classList.contains('selected'))))await piece.click();
 await rp.evaluate(async dir=>{await window.moveSelected(dir)},d);
}
await rp.locator('.chapter-five-reward').waitFor({state:'visible'});
const reward=await rp.evaluate(()=>({card:!!document.querySelector('.chapter-five-reward'),postcard:!!document.querySelector('.prism-reward-postcard'),glasshouse:!!document.querySelector('.prism-reward-glasshouse'),scope:!!document.querySelector('.prism-reward-scope'),lights:!!document.querySelector('.prism-reward-lights'),home:!!document.getElementById('chapterFiveRewardHome'),cont:!!document.getElementById('chapterFiveRewardContinue'),text:document.querySelector('.chapter-five-reward .chapter-reward-result')?.textContent||'',generic:!!document.querySelector('.story-beat-result')}));
assert(reward.card&&reward.postcard&&reward.glasshouse&&reward.scope&&reward.lights&&reward.home&&reward.cont,'Chapter 5 reward incomplete: '+JSON.stringify(reward));
assert(!reward.generic&&/where the islands are now/i.test(reward.text),'Chapter 5 new-coordinate payoff missing: '+JSON.stringify(reward));
check('Real Level 250 dedicated reward',JSON.stringify(reward));await shot(rp,'chapter5-level250-reward-390');
await rp.click('#chapterFiveRewardHome');await rp.waitForTimeout(760);
const frame=rp.frameLocator('#homeTitleFrame');await frame.locator('#c2 .story-telescope').waitFor({state:'visible'});
const home=await frame.locator('#c2 .phone').evaluate(phone=>{const t=phone.querySelector('.story-telescope'),s=getComputedStyle(t);return {stage5:phone.classList.contains('story-stage-5'),focus:phone.classList.contains('story-focus-telescope'),display:s.display,filter:s.filter,screen:parent.document.body.dataset.screen}});
assert(home.stage5&&home.focus&&home.display!=='none'&&home.filter!=='none'&&home.screen==='home','Little Home telescope payoff missing: '+JSON.stringify(home));check('Little Home telescope payoff',JSON.stringify(home));await shot(rp,'chapter5-home-telescope-focus-390');
await rewardCtx.close();

// Dedicated continuation from the real Chapter 5 reward must still enter the existing Across the Drift flow at Level 251.
const continueCtx=await makeContext({width:390,height:844},{unlocked:250,seen:{opening:1}});const cp=await continueCtx.newPage();cp.setDefaultTimeout(20000);cp.on('pageerror',e=>results.errors.push('continue pageerror: '+String(e)));await cp.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await settleGame(cp,250);
const solution2=await cp.evaluate(()=>window.LEVELS[249].solution.map(x=>[x[0],x[1]]));
for(const [pi,d] of solution2){const piece=cp.locator(`.latchling[data-pi="${pi}"]`);if(!(await piece.evaluate(e=>e.classList.contains('selected'))))await piece.click();await cp.evaluate(async dir=>{await window.moveSelected(dir)},d)}
await cp.locator('.chapter-five-reward').waitFor({state:'visible'});await cp.click('#chapterFiveRewardContinue');
await cp.waitForFunction(()=>window.LatchlingsCinematics?.active==='across-drift',{timeout:12000});
const continuation=await cp.evaluate(()=>({level:eval('currentLevel'),active:window.LatchlingsCinematics?.active||'',screen:document.body.dataset.screen,overlay:document.getElementById('cinematicOverlay')?.className||''}));
assert(continuation.level===251&&continuation.active==='across-drift','Chapter 5 continuation missed Across the Drift: '+JSON.stringify(continuation));check('Level 250 reward continues into existing Across the Drift',JSON.stringify(continuation));await shot(cp,'chapter5-across-drift-continuation-390');await continueCtx.close();

// Reduced motion must reach the same informative telescope state without animation dependency.
const reduced=await makeContext({width:390,height:844},{unlocked:251,reduced:true});const red=await reduced.newPage();red.setDefaultTimeout(12000);await red.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await red.evaluate(()=>window.focusHomeReward('telescope'));await red.waitForTimeout(260);const rframe=red.frameLocator('#homeTitleFrame');await rframe.locator('#c2 .story-telescope').waitFor({state:'visible'});const reducedHome=await rframe.locator('#c2 .phone').evaluate(phone=>{const t=phone.querySelector('.story-telescope'),s=getComputedStyle(t);return {stage5:phone.classList.contains('story-stage-5'),focus:phone.classList.contains('story-focus-telescope'),display:s.display,animation:s.animationName,filter:s.filter}});assert(reducedHome.stage5&&reducedHome.focus&&reducedHome.display!=='none'&&reducedHome.filter!=='none','Reduced-motion telescope payoff missing: '+JSON.stringify(reducedHome));assert(reducedHome.animation==='none','Reduced-motion telescope still animates: '+JSON.stringify(reducedHome));check('Reduced-motion Chapter 5 telescope payoff',JSON.stringify(reducedHome));await reduced.close();

assert(results.errors.length===0,'Browser errors: '+JSON.stringify(results.errors));
fs.writeFileSync(`${OUT}/results.json`,JSON.stringify(results,null,2));
console.log('CHAPTER5_PASS3_BROWSER_ACCEPTED');
await browser.close();
