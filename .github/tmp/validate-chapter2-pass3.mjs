import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT='/tmp/chapter2-pass3';
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
 await page.evaluate(async()=>{
  try{const t=eval('activeScreenTransition');if(t?.finished)await t.finished}catch(_){}
  try{window.LatchlingsStoryTheme?.close(false)}catch(_){}
  try{if(window.LatchlingsCinematics?.active)window.LatchlingsCinematics.finish(true)}catch(_){}
  const sc=document.getElementById('storyCardOverlay');if(sc){sc.classList.remove('show');sc.setAttribute('aria-hidden','true')}
  const o=document.getElementById('overlay');if(o)o.classList.remove('show','home-overlay');
 });
 await page.waitForTimeout(90);
 // Close once more after any deferred story-entry callback has had a chance to run.
 await page.evaluate(()=>{
  try{window.LatchlingsStoryTheme?.close(false)}catch(_){}
  const sc=document.getElementById('storyCardOverlay');if(sc){sc.classList.remove('show');sc.setAttribute('aria-hidden','true')}
  const o=document.getElementById('overlay');if(o)o.classList.remove('show','home-overlay');
 });
 await page.waitForTimeout(40);
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
  return {gameSlice:game.dataset.visualSlice||'',boardSlice:board.dataset.visualSlice||'',range:board.dataset.boardRange,bg:cs.backgroundImage,before:bef.opacity,after:aft.opacity,selected:count('.latchling.selected'),nestMatch:count('.nest.selected-match')};
 });
 assert(x.gameSlice===expected&&x.boardSlice===expected,`Level ${level} mode mismatch ${JSON.stringify(x)}`);
 if(expected==='lanternwood'){
  assert(x.selected===1&&x.nestMatch===1,`Level ${level} selected/nest hierarchy missing ${JSON.stringify(x)}`);
  assert(x.before==='0'&&x.after==='0',`Level ${level} decorative pseudo rules visible ${JSON.stringify(x)}`);
  assert(!/repeating-|conic-gradient|radial-gradient/.test(x.bg),`Level ${level} rule-like cell floor ${x.bg}`);
 }
 check(`Level ${level} visual contract`,JSON.stringify(x));return x;
}

// Main Chapter 2 matrix.
const ctx=await makeContext({width:390,height:844},{unlocked:400});
const page=await ctx.newPage();page.setDefaultTimeout(10000);page.on('pageerror',e=>results.errors.push('pageerror: '+String(e)));
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
assert(!(await page.locator('meta[name="viewport"]').getAttribute('content')||'').includes('user-scalable=no'),'viewport zoom disabled');

const reps=[51,60,61,70,71,80,81,90,91,100];
for(const L of reps){
 const x=await boardContract(page,L,'lanternwood');
 if([51,61,71,81,91].includes(L)){results.ranges[x.range]=x.bg;await shot(page,`chapter2-level${L}-390`)}
 if(L===100)await shot(page,'chapter2-level100-390');
}
assert(Object.keys(results.ranges).length===5,'Did not observe all five Lanternwood ranges: '+JSON.stringify(results.ranges));
assert(new Set(Object.values(results.ranges)).size===5,'Lanternwood waypoint materials are not distinct: '+JSON.stringify(results.ranges));
check('Five distinct Lanternwood movement surfaces',JSON.stringify(results.ranges));

// Boundary and mode isolation.
await boardContract(page,50,'sunpetal');
await settleGame(page,60,'daily');
let daily=await page.evaluate(()=>({game:document.getElementById('game').dataset.visualSlice||'',board:document.getElementById('board').dataset.visualSlice||'',mode:document.body.dataset.playMode}));
assert(daily.mode==='daily'&&!daily.game&&!daily.board,'Daily inherited campaign material: '+JSON.stringify(daily));check('Daily Chapter 2 isolation',JSON.stringify(daily));
await boardContract(page,101,'');
await boardContract(page,366,'aurora-dense');

// Story continuity in the actual runtime.
let continuity=await page.evaluate(()=>({
 ch2:window.LATCHLINGS_STORY.movementForLevel(71).setup,
 ch5:window.LATCHLINGS_STORY.movementForLevel(221).setup,
 beat2:window.LATCHLINGS_STORY.chapters[1].beats[2],
 beat5:window.LATCHLINGS_STORY.chapters[4].beats[2]
}));
for(const [k,v] of Object.entries(continuity))assert(/twin amber lanterns/i.test(v),`Twin-lantern continuity missing in ${k}: ${v}`);
check('Twin amber lantern story continuity',JSON.stringify(continuity));

// Atlas movement 3 must visually introduce the same porch landmark.
await page.evaluate(()=>eval("chapterView=2;rangeView=2;screen('levels');renderChapter()"));
await page.waitForTimeout(120);
const atlas=await page.evaluate(()=>{
 const map=document.getElementById('levelGrid'),e=map.querySelector('.atlas-scene em'),a=getComputedStyle(e,'::after'),b=e.getBoundingClientRect();
 return {cls:map.className,route:map.dataset.routeShape,em:{w:b.width,h:b.height,bg:getComputedStyle(e).backgroundImage,afterContent:a.content,afterBg:a.backgroundColor,afterShadow:a.boxShadow}};
});
assert(/atlas-range-3/.test(atlas.cls),'Chapter 2 movement-3 Atlas class missing: '+JSON.stringify(atlas));
assert(atlas.em.w>35&&atlas.em.h>25&&atlas.em.afterContent!=='none'&&atlas.em.afterShadow!=='none','Twin-lantern Atlas porch landmark missing: '+JSON.stringify(atlas));
check('Lanternwood Atlas porch landmark',JSON.stringify(atlas));await shot(page,'chapter2-atlas-twin-lantern-porch-390');

// Later Familiar Porch must repeat the paired amber lights.
await page.evaluate(()=>{if(window.LatchlingsCinematics?.active)window.LatchlingsCinematics.finish(true);window.LatchlingsCinematics.show('across-drift',{markSeen:false});window.LatchlingsCinematics.next()});
await page.waitForTimeout(180);
const porch=await page.evaluate(()=>{
 const o=document.getElementById('cinematicOverlay'),lights=Array.from(document.querySelectorAll('.porch-friend-lantern')).map(e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return {w:r.width,h:r.height,bg:c.backgroundColor,shadow:c.boxShadow}});return {visual:o.dataset.visual,lights};
});
assert(porch.visual==='porch'&&porch.lights.length===2,'Familiar Porch twin lanterns missing: '+JSON.stringify(porch));
assert(porch.lights.every(x=>x.w>0&&x.h>0&&x.shadow!=='none'),'Familiar Porch lanterns not visibly lit: '+JSON.stringify(porch));
check('Across the Drift repeats Lanternwood landmark',JSON.stringify(porch));await shot(page,'across-drift-twin-lantern-porch-390');
await ctx.close();

// Smallest supported phone endpoints.
const small=await makeContext({width:320,height:568},{unlocked:400});const sp=await small.newPage();sp.setDefaultTimeout(10000);sp.on('pageerror',e=>results.errors.push('small pageerror: '+String(e)));await sp.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
for(const L of [51,100]){await boardContract(sp,L,'lanternwood');await boundsOk(sp,`Level ${L} 320`);await shot(sp,`chapter2-level${L}-320`)}
await small.close();

// Complete the real authored Level 100 solution and inspect the dedicated reward + home keepsake action.
const rewardCtx=await makeContext({width:390,height:844},{unlocked:100});const rp=await rewardCtx.newPage();rp.setDefaultTimeout(12000);rp.on('pageerror',e=>results.errors.push('reward pageerror: '+String(e)));await rp.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await settleGame(rp,100);
const solution=await rp.evaluate(()=>window.LEVELS[99].solution.map(x=>[x[0],x[1]]));
for(const [pi,d] of solution){
 const piece=rp.locator(`.latchling[data-pi="${pi}"]`);assert(await piece.count()===1,`Authored Level 100 solution references unavailable piece ${pi}`);
 if(!(await piece.evaluate(e=>e.classList.contains('selected'))))await piece.click();
 await rp.evaluate(async dir=>{await window.moveSelected(dir)},d);
}
await rp.locator('.chapter-two-reward').waitFor({state:'visible'});
const reward=await rp.evaluate(()=>({card:!!document.querySelector('.chapter-two-reward'),postcard:!!document.querySelector('.lanternwood-reward-postcard'),lights:document.querySelectorAll('.lanternwood-reward-lantern').length,pennant:!!document.querySelector('.lanternwood-reward-pennant'),home:!!document.getElementById('chapterTwoRewardHome'),cont:!!document.getElementById('chapterTwoRewardContinue'),text:document.querySelector('.chapter-two-reward .chapter-reward-result')?.textContent||'',generic:!!document.querySelector('.story-beat-result'),moves:document.querySelector('.chapter-two-reward .chapter-reward-score')?.textContent||''}));
assert(reward.card&&reward.postcard&&reward.lights===2&&reward.pennant&&reward.home&&reward.cont,'Chapter 2 reward incomplete: '+JSON.stringify(reward));
assert(!reward.generic&&/twin amber lanterns/i.test(reward.text),'Chapter 2 reward story payoff missing: '+JSON.stringify(reward));
check('Real Level 100 dedicated reward',JSON.stringify(reward));await shot(rp,'chapter2-level100-reward-390');
await rp.click('#chapterTwoRewardHome');
const frame=rp.frameLocator('#homeTitleFrame');await frame.locator('#c2 .story-pennant').waitFor({state:'visible'});
const home=await frame.locator('#c2 .phone').evaluate(phone=>({stage2:phone.classList.contains('story-stage-2'),focus:phone.classList.contains('story-focus-pennant'),pennant:getComputedStyle(phone.querySelector('.story-pennant')).display}));
assert(home.stage2&&home.focus&&home.pennant!=='none','Little Home visitor pennant payoff missing: '+JSON.stringify(home));check('Little Home visitor pennant payoff',JSON.stringify(home));await shot(rp,'chapter2-home-pennant-focus-390');await rewardCtx.close();

// Reduced motion must reach the same informative keepsake state without depending on animation.
const reduced=await makeContext({width:390,height:844},{unlocked:101,reduced:true});const red=await reduced.newPage();red.setDefaultTimeout(10000);await red.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await red.evaluate(()=>window.focusHomeReward('pennant'));const rframe=red.frameLocator('#homeTitleFrame');await rframe.locator('#c2 .story-pennant').waitFor({state:'visible'});const reducedHome=await rframe.locator('#c2 .phone').evaluate(phone=>({stage2:phone.classList.contains('story-stage-2'),focus:phone.classList.contains('story-focus-pennant'),display:getComputedStyle(phone.querySelector('.story-pennant')).display,animation:getComputedStyle(phone.querySelector('.story-pennant')).animationName}));assert(reducedHome.stage2&&reducedHome.focus&&reducedHome.display!=='none','Reduced-motion pennant payoff missing: '+JSON.stringify(reducedHome));check('Reduced-motion Chapter 2 payoff',JSON.stringify(reducedHome));await reduced.close();

assert(results.errors.length===0,'Browser errors: '+JSON.stringify(results.errors));
fs.writeFileSync(`${OUT}/results.json`,JSON.stringify(results,null,2));
console.log('CHAPTER2_PASS3_BROWSER_ACCEPTED');
await browser.close();
