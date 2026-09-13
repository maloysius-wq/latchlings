import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT='/tmp/chapter6-pass3';
fs.mkdirSync(OUT,{recursive:true});
const results={checks:[],errors:[],screenshots:[],ranges:{},railSamples:[],turnerSamples:[]};
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
  const rail=board.querySelector('.rail');let railStyle=null;if(rail){const s=getComputedStyle(rail),svg=rail.querySelector('svg'),v=svg?getComputedStyle(svg):null;railStyle={border:s.borderTopWidth,borderColor:s.borderTopColor,bg:s.backgroundImage,shadow:s.boxShadow,stroke:v?.stroke||'',strokeWidth:v?.strokeWidth||''}}
  const turner=board.querySelector('.turner');let turnerStyle=null;if(turner){const s=getComputedStyle(turner),svg=turner.querySelector('svg'),v=svg?getComputedStyle(svg):null;turnerStyle={border:s.borderTopWidth,borderColor:s.borderTopColor,bg:s.backgroundImage,shadow:s.boxShadow,radius:s.borderTopLeftRadius,stroke:v?.stroke||'',strokeWidth:v?.strokeWidth||''}}
  return {gameSlice:game.dataset.visualSlice||'',boardSlice:board.dataset.visualSlice||'',range:board.dataset.boardRange,bg:cs.backgroundImage,before:bef.opacity,after:aft.opacity,selected:count('.latchling.selected'),nestMatch:count('.nest.selected-match'),rails:count('.rail'),turners:count('.turner'),railStyle,turnerStyle};
 });
 assert(x.gameSlice===expected&&x.boardSlice===expected,`Level ${level} mode mismatch ${JSON.stringify(x)}`);
 if(expected==='copperline'){
  assert(x.selected===1&&x.nestMatch===1,`Level ${level} selected/nest hierarchy missing ${JSON.stringify(x)}`);
  assert(x.before==='0'&&x.after==='0',`Level ${level} decorative pseudo rules visible ${JSON.stringify(x)}`);
  assert(!/repeating-|conic-gradient|radial-gradient/.test(x.bg),`Level ${level} rule-like cell floor ${x.bg}`);
  if(x.railStyle){assert(parseFloat(x.railStyle.border)>=3&&x.railStyle.bg!=='none'&&x.railStyle.shadow!=='none'&&x.railStyle.stroke&&x.railStyle.stroke!=='none'&&parseFloat(x.railStyle.strokeWidth)>=3,`Level ${level} rail treatment missing ${JSON.stringify(x.railStyle)}`);results.railSamples.push({level,...x.railStyle})}
  if(x.turnerStyle){assert(parseFloat(x.turnerStyle.border)>=3&&x.turnerStyle.bg!=='none'&&x.turnerStyle.shadow!=='none'&&parseFloat(x.turnerStyle.radius)>20&&x.turnerStyle.stroke&&x.turnerStyle.stroke!=='none'&&parseFloat(x.turnerStyle.strokeWidth)>=3,`Level ${level} turner treatment missing ${JSON.stringify(x.turnerStyle)}`);results.turnerSamples.push({level,...x.turnerStyle})}
 }
 check(`Level ${level} visual contract`,JSON.stringify(x));return x;
}

const ctx=await makeContext({width:390,height:844},{unlocked:400});
const page=await ctx.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>results.errors.push('pageerror: '+String(e)));
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
assert(await page.evaluate(()=>!!window.LatchlingsChapterSixPass3),'Chapter 6 module did not load');
const reps=[251,260,261,270,271,280,281,290,291,300];
for(const L of reps){
 const x=await boardContract(page,L,'copperline');
 if([251,261,271,281,291].includes(L)){results.ranges[x.range]=x.bg;await shot(page,`chapter6-level${L}-390`)}
 if(L===300)await shot(page,'chapter6-level300-390');
}
assert(Object.keys(results.ranges).length===5,'Did not observe all five Copperline ranges: '+JSON.stringify(results.ranges));
assert(new Set(Object.values(results.ranges)).size===5,'Copperline movement materials are not distinct: '+JSON.stringify(results.ranges));
assert(results.railSamples.length>0,'No Chapter 6 rail fixture sampled');
assert(results.turnerSamples.length>0,'No Chapter 6 turner fixture sampled');
check('Five distinct Copperline movement surfaces',JSON.stringify(results.ranges));
check('Copperline rail samples',JSON.stringify(results.railSamples));
check('Copperline turner samples',JSON.stringify(results.turnerSamples));

await boardContract(page,250,'prism');
await settleGame(page,275,'daily');
let daily=await page.evaluate(()=>({game:document.getElementById('game').dataset.visualSlice||'',board:document.getElementById('board').dataset.visualSlice||'',mode:document.body.dataset.playMode}));
assert(daily.mode==='daily'&&!daily.game&&!daily.board,'Daily inherited Copperline material: '+JSON.stringify(daily));check('Daily Chapter 6 isolation',JSON.stringify(daily));
await boardContract(page,301,'');
await boardContract(page,366,'aurora-dense');

// Movement 3 must expose the station archive/timetable kiosk without covering route nodes.
await page.evaluate(()=>eval("chapterView=6;rangeView=2;screen('levels');renderChapter()"));
await page.waitForTimeout(760);
await page.evaluate(()=>{const sc=document.getElementById('storyCardOverlay');if(sc){sc.classList.remove('show');sc.setAttribute('aria-hidden','true')}});
const atlas=await page.evaluate(()=>{
 const map=document.getElementById('levelGrid'),e=map.querySelector('.atlas-scene em'),r=e.getBoundingClientRect(),nodes=[...map.querySelectorAll('.atlas-node')].map(n=>{const x=n.getBoundingClientRect();return {level:n.dataset.level,left:x.left,top:x.top,right:x.right,bottom:x.bottom}}),overlaps=nodes.filter(n=>!(r.right<=n.left||r.left>=n.right||r.bottom<=n.top||r.top>=n.bottom)).map(n=>n.level),before=getComputedStyle(e,'::before'),after=getComputedStyle(e,'::after'),c=getComputedStyle(e);
 return {cls:map.className,landmark:{left:r.left,top:r.top,right:r.right,bottom:r.bottom,w:r.width,h:r.height,border:c.borderTopWidth,bg:c.backgroundImage,opacity:c.opacity,platesBg:before.backgroundColor,platesShadow:before.boxShadow,signalBg:after.backgroundColor,signalShadow:after.boxShadow},overlaps};
});
assert(/atlas-range-3/.test(atlas.cls),'Chapter 6 movement-3 Atlas class missing: '+JSON.stringify(atlas));
assert(atlas.landmark.w>=80&&atlas.landmark.h>=68&&parseFloat(atlas.landmark.border)>=4&&atlas.landmark.platesBg!=='rgba(0, 0, 0, 0)'&&atlas.landmark.platesShadow!=='none'&&atlas.landmark.signalBg!=='rgba(0, 0, 0, 0)'&&atlas.landmark.signalShadow!=='none','Copperline archive landmark incomplete: '+JSON.stringify(atlas));
assert(atlas.overlaps.length===0,'Copperline archive landmark overlaps Atlas nodes: '+JSON.stringify(atlas));
check('Copperline Atlas archive kiosk',JSON.stringify(atlas));await shot(page,'chapter6-atlas-archive-final-390');
await ctx.close();

// Smallest supported phone endpoints.
const small=await makeContext({width:320,height:568},{unlocked:400});const sp=await small.newPage();sp.setDefaultTimeout(15000);sp.on('pageerror',e=>results.errors.push('small pageerror: '+String(e)));await sp.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
for(const L of [251,300]){await boardContract(sp,L,'copperline');await boundsOk(sp,`Level ${L} 320`);await shot(sp,`chapter6-level${L}-320`)}
await small.close();

// Solve the real authored Level 300 route and inspect the dedicated reward + compass payoff.
const rewardCtx=await makeContext({width:390,height:844},{unlocked:300,seen:{opening:1,'across-drift':1}});const rp=await rewardCtx.newPage();rp.setDefaultTimeout(20000);rp.on('pageerror',e=>results.errors.push('reward pageerror: '+String(e)));await rp.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await settleGame(rp,300);
const solution=await rp.evaluate(()=>window.LEVELS[299].solution.map(x=>[x[0],x[1]]));
for(const [pi,d] of solution){const piece=rp.locator(`.latchling[data-pi="${pi}"]`);assert(await piece.count()===1,`Authored Level 300 solution references unavailable piece ${pi}`);if(!(await piece.evaluate(e=>e.classList.contains('selected'))))await piece.click();await rp.evaluate(async dir=>{await window.moveSelected(dir)},d)}
await rp.locator('.chapter-six-reward').waitFor({state:'visible'});
const reward=await rp.evaluate(()=>({card:!!document.querySelector('.chapter-six-reward'),postcard:!!document.querySelector('.copperline-reward-postcard'),kiosk:!!document.querySelector('.copper-reward-kiosk'),maps:document.querySelectorAll('.copper-reward-map').length,newline:!!document.querySelector('.copper-reward-newline'),compass:!!document.querySelector('.copper-reward-compass'),home:!!document.getElementById('chapterSixRewardHome'),cont:!!document.getElementById('chapterSixRewardContinue'),text:document.querySelector('.chapter-six-reward .chapter-reward-result')?.textContent||'',generic:!!document.querySelector('.story-beat-result')}));
assert(reward.card&&reward.postcard&&reward.kiosk&&reward.maps===3&&reward.newline&&reward.compass&&reward.home&&reward.cont,'Chapter 6 reward incomplete: '+JSON.stringify(reward));
assert(!reward.generic&&/each was a record of what worked in its own moment/i.test(reward.text),'Chapter 6 old-maps payoff missing: '+JSON.stringify(reward));
check('Real Level 300 dedicated reward',JSON.stringify(reward));await shot(rp,'chapter6-level300-reward-390');
await rp.click('#chapterSixRewardHome');await rp.waitForTimeout(760);
const frame=rp.frameLocator('#homeTitleFrame');await frame.locator('#c2 .story-relic').waitFor({state:'visible'});
const home=await frame.locator('#c2 .phone').evaluate(phone=>{const t=phone.querySelector('.story-relic'),r=t.getBoundingClientRect(),pr=phone.getBoundingClientRect(),s=getComputedStyle(t);return {stage6:phone.classList.contains('story-stage-6'),focus:phone.classList.contains('story-focus-compass'),display:s.display,filter:s.filter,shadow:s.boxShadow,inside:r.left>=pr.left&&r.right<=pr.right&&r.top>=pr.top&&r.bottom<=pr.bottom,screen:parent.document.body.dataset.screen}});
assert(home.stage6&&home.focus&&home.display!=='none'&&home.filter!=='none'&&home.shadow!=='none'&&home.inside&&home.screen==='home','Little Home compass payoff missing: '+JSON.stringify(home));check('Little Home compass payoff',JSON.stringify(home));await shot(rp,'chapter6-home-compass-focus-390');
await rewardCtx.close();

// Dedicated continuation from the real Chapter 6 reward must enter existing Old Maps, New Routes at Level 301.
const continueCtx=await makeContext({width:390,height:844},{unlocked:300,seen:{opening:1,'across-drift':1}});const cp=await continueCtx.newPage();cp.setDefaultTimeout(22000);cp.on('pageerror',e=>results.errors.push('continue pageerror: '+String(e)));await cp.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await settleGame(cp,300);
const solution2=await cp.evaluate(()=>window.LEVELS[299].solution.map(x=>[x[0],x[1]]));
for(const [pi,d] of solution2){const piece=cp.locator(`.latchling[data-pi="${pi}"]`);if(!(await piece.evaluate(e=>e.classList.contains('selected'))))await piece.click();await cp.evaluate(async dir=>{await window.moveSelected(dir)},d)}
await cp.locator('.chapter-six-reward').waitFor({state:'visible'});await cp.click('#chapterSixRewardContinue');
await cp.waitForFunction(()=>window.LatchlingsCinematics?.active==='old-maps',{timeout:14000});
const continuation=await cp.evaluate(()=>({level:eval('currentLevel'),active:window.LatchlingsCinematics?.active||'',screen:document.body.dataset.screen,overlay:document.getElementById('cinematicOverlay')?.className||''}));
assert(continuation.level===301&&continuation.active==='old-maps','Chapter 6 continuation missed Old Maps, New Routes: '+JSON.stringify(continuation));check('Level 300 reward continues into existing Old Maps cinematic',JSON.stringify(continuation));await shot(cp,'chapter6-old-maps-continuation-390');await continueCtx.close();

// Reduced motion must reach the same informative compass state without animation dependency.
const reduced=await makeContext({width:390,height:844},{unlocked:301,reduced:true});const red=await reduced.newPage();red.setDefaultTimeout(14000);await red.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await red.evaluate(()=>window.LatchlingsChapterSixPass3.focusCompass());await red.waitForTimeout(280);const rframe=red.frameLocator('#homeTitleFrame');await rframe.locator('#c2 .story-relic').waitFor({state:'visible'});const reducedHome=await rframe.locator('#c2 .phone').evaluate(phone=>{const t=phone.querySelector('.story-relic'),s=getComputedStyle(t);return {stage6:phone.classList.contains('story-stage-6'),focus:phone.classList.contains('story-focus-compass'),display:s.display,animation:s.animationName,filter:s.filter,transform:s.transform}});assert(reducedHome.stage6&&reducedHome.focus&&reducedHome.display!=='none'&&reducedHome.filter!=='none','Reduced-motion compass payoff missing: '+JSON.stringify(reducedHome));assert(reducedHome.animation==='none','Reduced-motion compass still animates: '+JSON.stringify(reducedHome));check('Reduced-motion Chapter 6 compass payoff',JSON.stringify(reducedHome));await reduced.close();

assert(results.errors.length===0,'Browser errors: '+JSON.stringify(results.errors));
fs.writeFileSync(`${OUT}/results.json`,JSON.stringify(results,null,2));
console.log('CHAPTER6_PASS3_BROWSER_ACCEPTED');
await browser.close();
