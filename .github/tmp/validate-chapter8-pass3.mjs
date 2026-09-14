import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT='/tmp/chapter8-pass3';
fs.mkdirSync(OUT,{recursive:true});
const results={checks:[],errors:[],screenshots:[],ranges:{},fixtures:{}};
function assert(cond,msg){if(!cond)throw new Error(msg)}
function check(name,detail='ok'){results.checks.push({name,detail});console.log('CHECK',name,detail)}
async function shot(page,name){await page.screenshot({path:`${OUT}/${name}.png`,fullPage:false});results.screenshots.push(name+'.png')}

const browser=await chromium.launch({headless:true});
async function makeContext(viewport={width:390,height:844},opts={}){
  const reduced=!!opts.reduced,unlocked=opts.unlocked??400,complete=!!opts.complete;
  const seen=opts.seen??{opening:1,'across-drift':1,'old-maps':1,homeward:1};
  const ctx=await browser.newContext({viewport,deviceScaleFactor:1,reducedMotion:reduced?'reduce':'no-preference'});
  const stars={};for(let i=1;i<unlocked;i++)stars[i]=3;if(complete)for(let i=1;i<=400;i++)stars[i]=3;
  await ctx.addInitScript(({unlocked,stars,reduced,seen})=>{
    localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked,stars}));
    localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify(seen));
    localStorage.setItem('latchlings_ui_prefs_v1',JSON.stringify({motion:reduced?'reduced':'system',textSize:'normal'}));
  },{unlocked,stars,reduced,seen});
  return ctx;
}
async function clearPresentation(page){
  await page.waitForTimeout(720);
  await page.evaluate(async()=>{
    try{const t=eval('activeScreenTransition');if(t?.finished)await t.finished}catch(_){}
    try{window.LatchlingsStoryTheme?.close(false)}catch(_){}
    try{if(window.LatchlingsCinematics?.active)window.LatchlingsCinematics.finish(true)}catch(_){}
    const sc=document.getElementById('storyCardOverlay');if(sc){sc.classList.remove('show');sc.setAttribute('aria-hidden','true')}
    const co=document.getElementById('cinematicOverlay');if(co){co.classList.remove('show','active');co.setAttribute('aria-hidden','true')}
    const o=document.getElementById('overlay');if(o)o.classList.remove('show','home-overlay');
  });
  await page.waitForTimeout(100);
}
async function settleGame(page,level,mode='campaign'){
  await page.evaluate(({level,mode})=>window.startLevel(level,mode),{level,mode});
  await clearPresentation(page);
}
async function boundsOk(page,label){
  const x=await page.evaluate(()=>({w:innerWidth,h:innerHeight,sw:document.documentElement.scrollWidth,bodyw:document.body.scrollWidth,controls:(()=>{const r=document.querySelector('.controls')?.getBoundingClientRect();return r?{top:r.top,bottom:r.bottom}:null})(),minTargets:(()=>{const a=[...document.querySelectorAll('.controls button')].filter(x=>getComputedStyle(x).display!=='none').map(x=>Math.min(x.getBoundingClientRect().width,x.getBoundingClientRect().height));return a.length?Math.min(...a):0})()}));
  assert(x.sw<=x.w+1&&x.bodyw<=x.w+1,`${label} horizontal overflow ${JSON.stringify(x)}`);
  if(x.controls)assert(x.controls.bottom<=x.h+1,`${label} controls leave viewport ${JSON.stringify(x)}`);
  if(x.minTargets)assert(x.minTargets>=44,`${label} touch target below 44px ${JSON.stringify(x)}`);
  check(label+' containment',JSON.stringify(x));return x;
}
async function boardContract(page,level,expected){
  await settleGame(page,level);
  const x=await page.evaluate(()=>{
    const game=document.getElementById('game'),board=document.getElementById('board'),cell=board.querySelector('.cell'),cs=getComputedStyle(cell),bef=getComputedStyle(cell,'::before'),aft=getComputedStyle(cell,'::after');
    const count=s=>board.querySelectorAll(s).length;
    const fixture={};
    for(const [name,sel] of Object.entries({anchor:'.anchor',suitGate:'.gate.suit',colorGate:'.gate.color',rail:'.rail',turner:'.turner',switch:'.switch-tile',door:'.door-tile'})){
      const e=board.querySelector(sel);if(e){const s=getComputedStyle(e);fixture[name]={bg:s.backgroundImage,bgColor:s.backgroundColor,border:s.borderTopColor,borderW:s.borderTopWidth,shadow:s.boxShadow,opacity:s.opacity}}
    }
    return {gameSlice:game.dataset.visualSlice||'',boardSlice:board.dataset.visualSlice||'',range:board.dataset.boardRange,bg:cs.backgroundImage,before:bef.opacity,after:aft.opacity,selected:count('.latchling.selected'),nestMatch:count('.nest.selected-match'),fixture};
  });
  assert(x.gameSlice===expected&&x.boardSlice===expected,`Level ${level} mode mismatch ${JSON.stringify(x)}`);
  if(expected==='aurora'){
    assert(x.selected===1&&x.nestMatch===1,`Level ${level} selected/nest hierarchy missing ${JSON.stringify(x)}`);
    assert(x.before==='0'&&x.after==='0',`Level ${level} decorative pseudo rules visible ${JSON.stringify(x)}`);
    assert(!/repeating-|conic-gradient|radial-gradient/.test(x.bg),`Level ${level} rule-like cell floor ${x.bg}`);
    for(const [k,v] of Object.entries(x.fixture)){results.fixtures[k]??={level,...v};assert(v.opacity!=='0'&&v.borderW!=='0px'&&(v.bg!=='none'||v.bgColor!=='rgba(0, 0, 0, 0)'),`Level ${level} ${k} unreadable ${JSON.stringify(v)}`)}
  }
  check(`Level ${level} visual contract`,JSON.stringify(x));return x;
}
async function openDoorContract(page,level){
  await settleGame(page,level);if(!await page.locator('#board .door-tile').count())return null;
  await page.evaluate(()=>eval('doorMask=65535;renderGame(true)'));
  const x=await page.evaluate(()=>{const d=document.querySelector('#board .door-tile.open'),s=d&&getComputedStyle(d),b=d?.querySelector('.door-bars'),bs=b&&getComputedStyle(b);return d?{open:true,bg:s.backgroundImage,border:s.borderTopColor,shadow:s.boxShadow,barsOpacity:bs?.opacity||'',barsBorder:bs?.borderTopColor||''}:null});
  assert(x&&x.open&&x.bg!=='none'&&x.shadow!=='none'&&parseFloat(x.barsOpacity)>0,`Level ${level} open door unreadable ${JSON.stringify(x)}`);check(`Level ${level} open door state`,JSON.stringify(x));return x;
}
async function solveCurrent(page,level){
  const solution=await page.evaluate(L=>window.LEVELS[L-1].solution.map(x=>[x[0],x[1]]),level);
  for(const [pi,d] of solution){
    const piece=page.locator(`.latchling[data-pi="${pi}"]`);assert(await piece.count()===1,`Level ${level} solution references unavailable piece ${pi}`);
    if(!(await piece.evaluate(e=>e.classList.contains('selected'))))await piece.click();
    await page.evaluate(async dir=>{await window.moveSelected(dir)},d);
  }
  return solution.length;
}

const ctx=await makeContext({width:390,height:844},{unlocked:400});
const page=await ctx.newPage();page.setDefaultTimeout(18000);page.on('pageerror',e=>results.errors.push('pageerror: '+String(e)));
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
assert(await page.evaluate(()=>!!window.LatchlingsChapterEightPass3),'Chapter 8 module did not load');
const reps=[351,360,361,370,371,380,381,390,391,400];
for(const L of reps){
  const x=await boardContract(page,L,'aurora');
  if([351,361,371,381,391].includes(L)){results.ranges[x.range]=x.bg;await shot(page,`chapter8-level${L}-390`)}
  if(L===400)await shot(page,'chapter8-level400-390');
}
assert(Object.keys(results.ranges).length===5,'Did not observe all five Aurora ranges: '+JSON.stringify(results.ranges));
assert(new Set(Object.values(results.ranges)).size===5,'Aurora movement materials are not distinct: '+JSON.stringify(results.ranges));
for(const needed of ['anchor','suitGate','colorGate','rail','turner','switch','door'])assert(results.fixtures[needed],`No Chapter 8 ${needed} fixture sampled`);
let openDoor=null;for(const L of reps){openDoor=await openDoorContract(page,L);if(openDoor)break}assert(openDoor,'No Chapter 8 open door sampled');
check('Five distinct Aurora movement surfaces',JSON.stringify(results.ranges));check('Aurora fixture coverage',JSON.stringify(results.fixtures));

await boardContract(page,350,'stormswitch');
await settleGame(page,375,'daily');
const daily=await page.evaluate(()=>({game:document.getElementById('game').dataset.visualSlice||'',board:document.getElementById('board').dataset.visualSlice||'',mode:document.body.dataset.playMode}));
assert(daily.mode==='daily'&&!daily.game&&!daily.board,'Daily inherited Aurora material: '+JSON.stringify(daily));check('Daily Chapter 8 isolation',JSON.stringify(daily));
await boardContract(page,366,'aurora-dense');

// Movement 1: convergence beacon must read as a through-route and stay clear of every level node.
await page.evaluate(()=>eval("chapterView=8;rangeView=0;screen('levels');renderChapter()"));await page.waitForTimeout(760);
const atlas=await page.evaluate(()=>{
  const map=document.getElementById('levelGrid'),e=map.querySelector('.atlas-scene em'),r=e.getBoundingClientRect(),nodes=[...map.querySelectorAll('.atlas-node')].map(n=>{const x=n.getBoundingClientRect();return {level:n.dataset.level,left:x.left,top:x.top,right:x.right,bottom:x.bottom}}),overlaps=nodes.filter(n=>!(r.right<=n.left||r.left>=n.right||r.bottom<=n.top||r.top>=n.bottom)).map(n=>n.level),before=getComputedStyle(e,'::before'),after=getComputedStyle(e,'::after');
  return {cls:map.className,rect:{left:r.left,top:r.top,right:r.right,bottom:r.bottom,w:r.width,h:r.height},overlaps,crownBg:before.backgroundImage,crownShadow:before.boxShadow,routesBg:after.backgroundImage,routesShadow:after.boxShadow};
});
assert(/atlas-range-1/.test(atlas.cls),'Chapter 8 movement-1 Atlas class missing: '+JSON.stringify(atlas));
assert(atlas.rect.w>=65&&atlas.rect.h>=72&&/gradient/.test(atlas.crownBg)&&atlas.crownShadow!=='none'&&/gradient/.test(atlas.routesBg)&&atlas.routesShadow!=='none','Aurora convergence beacon incomplete: '+JSON.stringify(atlas));
assert(atlas.overlaps.length===0,'Aurora convergence beacon overlaps Atlas nodes: '+JSON.stringify(atlas));check('Aurora Atlas convergence beacon',JSON.stringify(atlas));await shot(page,'chapter8-atlas-convergence-390');
await ctx.close();

// Small-phone endpoints.
const small=await makeContext({width:320,height:568},{unlocked:400});const sp=await small.newPage();sp.setDefaultTimeout(18000);sp.on('pageerror',e=>results.errors.push('small pageerror: '+String(e)));await sp.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
for(const L of [351,400]){await boardContract(sp,L,'aurora');await boundsOk(sp,`Level ${L} 320`);await shot(sp,`chapter8-level${L}-320`)}await small.close();

// Solve real Level 400 and verify dedicated reward + Little Home living-Skyway payoff.
const rewardCtx=await makeContext({width:390,height:844},{unlocked:400});const rp=await rewardCtx.newPage();rp.setDefaultTimeout(30000);rp.on('pageerror',e=>results.errors.push('reward pageerror: '+String(e)));await rp.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await settleGame(rp,400);const moves=await solveCurrent(rp,400);
await rp.locator('.chapter-eight-reward').waitFor({state:'visible'});
const reward=await rp.evaluate(()=>({card:!!document.querySelector('.chapter-eight-reward'),postcard:!!document.querySelector('.aurora-reward-postcard'),crown:!!document.querySelector('.aurora-reward-crown'),beacon:!!document.querySelector('.aurora-reward-beacon'),routes:document.querySelectorAll('.aurora-reward-route').length,islands:document.querySelectorAll('.aurora-reward-island').length,home:!!document.getElementById('chapterEightRewardHome'),finish:!!document.getElementById('chapterEightRewardFinish'),text:document.querySelector('.chapter-eight-reward .chapter-reward-result')?.textContent||'',generic:!!document.querySelector('.story-beat-result')}));
assert(reward.card&&reward.postcard&&reward.crown&&reward.beacon&&reward.routes===4&&reward.islands===4&&reward.home&&reward.finish,'Chapter 8 reward incomplete: '+JSON.stringify(reward));assert(!reward.generic&&/not a master switch/i.test(reward.text)&&/not a final map/i.test(reward.text),'Chapter 8 finale semantics missing: '+JSON.stringify(reward));check('Real Level 400 dedicated reward',`moves=${moves} ${JSON.stringify(reward)}`);await shot(rp,'chapter8-level400-reward-390');
await rp.click('#chapterEightRewardHome');await rp.waitForTimeout(760);const frame=rp.frameLocator('#homeTitleFrame');await frame.locator('#c2 .story-distant-islands').waitFor({state:'visible'});
const home=await frame.locator('#c2 .phone').evaluate(phone=>{const d=phone.querySelector('.story-distant-islands'),r=d.getBoundingClientRect(),pr=phone.getBoundingClientRect(),s=getComputedStyle(d),b=getComputedStyle(d,'::before');return {stage8:phone.classList.contains('story-stage-8'),focus:phone.classList.contains('story-focus-living-skyway'),display:s.display,filter:s.filter,route:b.backgroundImage,inside:r.left>=pr.left&&r.right<=pr.right&&r.top>=pr.top&&r.bottom<=pr.bottom,screen:parent.document.body.dataset.screen}});
assert(home.stage8&&home.focus&&home.display!=='none'&&home.filter!=='none'&&/gradient/.test(home.route)&&home.inside&&home.screen==='home','Little Home final living-Skyway payoff missing: '+JSON.stringify(home));check('Little Home final living-Skyway payoff',JSON.stringify(home));await shot(rp,'chapter8-home-living-skyway-390');await rewardCtx.close();

// Reduced motion must preserve the same informative home state without animation dependence.
const reducedCtx=await makeContext({width:390,height:844},{unlocked:400,complete:true,reduced:true});const red=await reducedCtx.newPage();red.setDefaultTimeout(18000);red.on('pageerror',e=>results.errors.push('reduced pageerror: '+String(e)));await red.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await red.evaluate(()=>window.LatchlingsChapterEightPass3.focusLivingSkyway());await red.waitForTimeout(600);const reducedHome=await red.frameLocator('#homeTitleFrame').locator('#c2 .phone').evaluate(phone=>{const d=phone.querySelector('.story-distant-islands'),s=getComputedStyle(d),i=d.querySelector('i'),is=getComputedStyle(i);return {stage8:phone.classList.contains('story-stage-8'),focus:phone.classList.contains('story-focus-living-skyway'),display:s.display,anim:is.animationName,screen:parent.document.body.dataset.screen}});assert(reducedHome.stage8&&reducedHome.focus&&reducedHome.display!=='none'&&(reducedHome.anim==='none'||reducedHome.anim===''),'Reduced-motion final home payoff missing: '+JSON.stringify(reducedHome));check('Reduced-motion final home payoff',JSON.stringify(reducedHome));await reducedCtx.close();

// Solve again and finish into the existing protected campaign-complete screen.
const finishCtx=await makeContext({width:390,height:844},{unlocked:400});const fp=await finishCtx.newPage();fp.setDefaultTimeout(30000);fp.on('pageerror',e=>results.errors.push('finish pageerror: '+String(e)));await fp.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await settleGame(fp,400);await solveCurrent(fp,400);await fp.locator('.chapter-eight-reward').waitFor({state:'visible'});await fp.click('#chapterEightRewardFinish');await fp.waitForFunction(()=>document.body.dataset.screen==='complete');const ending=await fp.evaluate(()=>({screen:document.body.dataset.screen,title:document.querySelector('#complete h1')?.textContent||'',resolution:document.querySelector('.ending-resolution')?.textContent||'',note:document.querySelector('.ending-note')?.textContent||''}));assert(ending.screen==='complete'&&/Skyway Restored/.test(ending.title)&&/No master switch/.test(ending.resolution)&&/No final map/.test(ending.resolution)&&/A living Skyway/.test(ending.resolution)&&/Ordinary life continues/.test(ending.note),'Protected campaign ending semantics changed: '+JSON.stringify(ending));check('Campaign-complete protected ending',JSON.stringify(ending));await shot(fp,'chapter8-campaign-complete-390');await finishCtx.close();

assert(results.errors.length===0,'Browser errors: '+JSON.stringify(results.errors));fs.writeFileSync(`${OUT}/chapter8-validation.json`,JSON.stringify(results,null,2));console.log('CHAPTER8_PASS3_ACCEPTANCE_OK');await browser.close();