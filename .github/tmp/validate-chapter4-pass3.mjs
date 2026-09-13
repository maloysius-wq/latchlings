import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT='/tmp/chapter4-pass3';
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
  const game=document.getElementById('game'),board=document.getElementById('board'),cell=board.querySelector('.cell'),cs=getComputedStyle(cell),bef=getComputedStyle(cell,'::before'),aft=getComputedStyle(cell,'::after'),gate=board.querySelector('.gate.suit');
  const count=s=>board.querySelectorAll(s).length;
  let gateStyle=null;
  if(gate){const g=getComputedStyle(gate),svg=gate.querySelector('svg'),sg=svg?getComputedStyle(svg):null;gateStyle={bg:g.backgroundImage,shadow:g.boxShadow,border:g.borderColor,borderWidth:g.borderTopWidth,fill:sg?.fill||''}}
  return {gameSlice:game.dataset.visualSlice||'',boardSlice:board.dataset.visualSlice||'',range:board.dataset.boardRange,bg:cs.backgroundImage,before:bef.opacity,after:aft.opacity,selected:count('.latchling.selected'),nestMatch:count('.nest.selected-match'),suitGates:count('.gate.suit'),gateStyle};
 });
 assert(x.gameSlice===expected&&x.boardSlice===expected,`Level ${level} mode mismatch ${JSON.stringify(x)}`);
 if(expected==='masquerade'){
  assert(x.selected===1&&x.nestMatch===1,`Level ${level} selected/nest hierarchy missing ${JSON.stringify(x)}`);
  assert(x.before==='0'&&x.after==='0',`Level ${level} decorative pseudo rules visible ${JSON.stringify(x)}`);
  assert(!/repeating-|conic-gradient|radial-gradient/.test(x.bg),`Level ${level} rule-like cell floor ${x.bg}`);
  assert(x.suitGates>0&&x.gateStyle&&x.gateStyle.bg!=='none'&&x.gateStyle.shadow!=='none',`Level ${level} suit-gate treatment missing ${JSON.stringify(x)}`);
  assert(parseFloat(x.gateStyle.borderWidth)>=3&&x.gateStyle.fill&&x.gateStyle.fill!=='none'&&x.gateStyle.fill!=='rgba(0, 0, 0, 0)',`Level ${level} suit-gate contrast weak ${JSON.stringify(x)}`);
 }
 check(`Level ${level} visual contract`,JSON.stringify(x));return x;
}

const ctx=await makeContext({width:390,height:844},{unlocked:400});
const page=await ctx.newPage();page.setDefaultTimeout(12000);page.on('pageerror',e=>results.errors.push('pageerror: '+String(e)));
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
assert(!(await page.locator('meta[name="viewport"]').getAttribute('content')||'').includes('user-scalable=no'),'viewport zoom disabled');

const reps=[151,160,161,170,171,180,181,190,191,200];
for(const L of reps){
 const x=await boardContract(page,L,'masquerade');
 if([151,161,171,181,191].includes(L)){results.ranges[x.range]=x.bg;await shot(page,`chapter4-level${L}-390`)}
 if(L===200)await shot(page,'chapter4-level200-390');
}
assert(Object.keys(results.ranges).length===5,'Did not observe all five Masquerade ranges: '+JSON.stringify(results.ranges));
assert(new Set(Object.values(results.ranges)).size===5,'Masquerade movement materials are not distinct: '+JSON.stringify(results.ranges));
check('Five distinct Masquerade movement surfaces',JSON.stringify(results.ranges));

await boardContract(page,150,'lodestone');
await settleGame(page,180,'daily');
let daily=await page.evaluate(()=>({game:document.getElementById('game').dataset.visualSlice||'',board:document.getElementById('board').dataset.visualSlice||'',mode:document.body.dataset.playMode}));
assert(daily.mode==='daily'&&!daily.game&&!daily.board,'Daily inherited campaign material: '+JSON.stringify(daily));check('Daily Chapter 4 isolation',JSON.stringify(daily));
await boardContract(page,201,'');
await boardContract(page,366,'aurora-dense');

// Movement 3 must expose the old civic suit-gate arch as a recognizable Atlas landmark.
await page.evaluate(()=>eval("chapterView=4;rangeView=2;screen('levels');renderChapter()"));
await page.waitForTimeout(680);
await page.evaluate(()=>{const sc=document.getElementById('storyCardOverlay');if(sc){sc.classList.remove('show');sc.setAttribute('aria-hidden','true')}});
const atlas=await page.evaluate(()=>{
 const map=document.getElementById('levelGrid'),e=map.querySelector('.atlas-scene em'),r=e.getBoundingClientRect(),before=getComputedStyle(e,'::before'),after=getComputedStyle(e,'::after'),c=getComputedStyle(e);
 return {cls:map.className,route:map.dataset.routeShape,arch:{w:r.width,h:r.height,bg:c.backgroundImage,border:c.borderTopWidth,borderColor:c.borderTopColor,radius:c.borderTopLeftRadius,opacity:c.opacity,beforeContent:before.content,beforeBg:before.backgroundColor,beforeColor:before.color,afterContent:after.content,afterBg:after.backgroundImage}};
});
assert(/atlas-range-3/.test(atlas.cls),'Chapter 4 movement-3 Atlas class missing: '+JSON.stringify(atlas));
assert(atlas.arch.w>=70&&atlas.arch.h>=65&&parseFloat(atlas.arch.border)>=9&&/♠/.test(atlas.arch.beforeContent)&&atlas.arch.afterContent!=='none'&&atlas.arch.afterBg!=='none','Old civic suit-gate landmark missing: '+JSON.stringify(atlas));
check('Masquerade Atlas old civic suit-gate arch',JSON.stringify(atlas));await shot(page,'chapter4-atlas-civic-suit-gate-390');
await ctx.close();

// Smallest supported phone endpoints.
const small=await makeContext({width:320,height:568},{unlocked:400});const sp=await small.newPage();sp.setDefaultTimeout(12000);sp.on('pageerror',e=>results.errors.push('small pageerror: '+String(e)));await sp.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
for(const L of [151,200]){await boardContract(sp,L,'masquerade');await boundsOk(sp,`Level ${L} 320`);await shot(sp,`chapter4-level${L}-320`)}
await small.close();

// Solve the real authored Level 200 route and inspect the chapter reward + Little Home bunting payoff.
const rewardCtx=await makeContext({width:390,height:844},{unlocked:200});const rp=await rewardCtx.newPage();rp.setDefaultTimeout(15000);rp.on('pageerror',e=>results.errors.push('reward pageerror: '+String(e)));await rp.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await settleGame(rp,200);
const solution=await rp.evaluate(()=>window.LEVELS[199].solution.map(x=>[x[0],x[1]]));
for(const [pi,d] of solution){
 const piece=rp.locator(`.latchling[data-pi="${pi}"]`);assert(await piece.count()===1,`Authored Level 200 solution references unavailable piece ${pi}`);
 if(!(await piece.evaluate(e=>e.classList.contains('selected'))))await piece.click();
 await rp.evaluate(async dir=>{await window.moveSelected(dir)},d);
}
await rp.locator('.chapter-four-reward').waitFor({state:'visible'});
const reward=await rp.evaluate(()=>({card:!!document.querySelector('.chapter-four-reward'),postcard:!!document.querySelector('.masquerade-reward-postcard'),arch:!!document.querySelector('.masquerade-reward-arch'),plaques:document.querySelectorAll('.masquerade-reward-plaque').length,bunting:!!document.querySelector('.masquerade-reward-bunting'),home:!!document.getElementById('chapterFourRewardHome'),cont:!!document.getElementById('chapterFourRewardContinue'),text:document.querySelector('.chapter-four-reward .chapter-reward-result')?.textContent||'',generic:!!document.querySelector('.story-beat-result')}));
assert(reward.card&&reward.postcard&&reward.arch&&reward.plaques===4&&reward.bunting&&reward.home&&reward.cont,'Chapter 4 reward incomplete: '+JSON.stringify(reward));
assert(!reward.generic&&/old suit-mark lanes/i.test(reward.text),'Chapter 4 reward story payoff missing: '+JSON.stringify(reward));
check('Real Level 200 dedicated reward',JSON.stringify(reward));await shot(rp,'chapter4-level200-reward-390');
await rp.click('#chapterFourRewardHome');
await rp.waitForTimeout(720);
const frame=rp.frameLocator('#homeTitleFrame');await frame.locator('#c2 .story-bunting').waitFor({state:'visible'});
const home=await frame.locator('#c2 .phone').evaluate(phone=>({stage4:phone.classList.contains('story-stage-4'),focus:phone.classList.contains('story-focus-bunting'),bunting:getComputedStyle(phone.querySelector('.story-bunting')).display,screen:parent.document.body.dataset.screen}));
assert(home.stage4&&home.focus&&home.bunting!=='none'&&home.screen==='home','Little Home market-bunting payoff missing: '+JSON.stringify(home));check('Little Home market-bunting payoff',JSON.stringify(home));await shot(rp,'chapter4-home-bunting-focus-390');await rewardCtx.close();

// Reduced motion must reach the same informative bunting state without depending on animation.
const reduced=await makeContext({width:390,height:844},{unlocked:201,reduced:true});const red=await reduced.newPage();red.setDefaultTimeout(10000);await red.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await red.evaluate(()=>window.focusHomeReward('bunting'));await red.waitForTimeout(220);const rframe=red.frameLocator('#homeTitleFrame');await rframe.locator('#c2 .story-bunting').waitFor({state:'visible'});const reducedHome=await rframe.locator('#c2 .phone').evaluate(phone=>({stage4:phone.classList.contains('story-stage-4'),focus:phone.classList.contains('story-focus-bunting'),display:getComputedStyle(phone.querySelector('.story-bunting')).display,animation:getComputedStyle(phone.querySelector('.story-bunting')).animationName}));assert(reducedHome.stage4&&reducedHome.focus&&reducedHome.display!=='none','Reduced-motion bunting payoff missing: '+JSON.stringify(reducedHome));check('Reduced-motion Chapter 4 payoff',JSON.stringify(reducedHome));await reduced.close();

assert(results.errors.length===0,'Browser errors: '+JSON.stringify(results.errors));
fs.writeFileSync(`${OUT}/results.json`,JSON.stringify(results,null,2));
console.log('CHAPTER4_PASS3_BROWSER_ACCEPTED');
await browser.close();
