import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT='/tmp/chapter7-pass3';
fs.mkdirSync(OUT,{recursive:true});
const results={checks:[],errors:[],screenshots:[],ranges:{},switchSamples:[],doorSamples:[],openDoorSamples:[]};
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
  const sw=board.querySelector('.switch-tile');let switchStyle=null;if(sw){const s=getComputedStyle(sw),a=getComputedStyle(sw,'::after');switchStyle={border:s.borderTopWidth,borderColor:s.borderTopColor,bg:s.backgroundImage,shadow:s.boxShadow,actuatorBg:a.backgroundImage,actuatorBorder:a.borderTopWidth,actuatorShadow:a.boxShadow}}
  const dr=board.querySelector('.door-tile');let doorStyle=null;if(dr){const s=getComputedStyle(dr),bars=dr.querySelector('.door-bars'),b=bars?getComputedStyle(bars):null;doorStyle={border:s.borderTopWidth,borderColor:s.borderTopColor,bg:s.backgroundImage,shadow:s.boxShadow,open:dr.classList.contains('open'),barsBorder:b?.borderTopColor||'',barsOpacity:b?.opacity||''}}
  return {gameSlice:game.dataset.visualSlice||'',boardSlice:board.dataset.visualSlice||'',range:board.dataset.boardRange,bg:cs.backgroundImage,before:bef.opacity,after:aft.opacity,selected:count('.latchling.selected'),nestMatch:count('.nest.selected-match'),switches:count('.switch-tile'),doors:count('.door-tile'),switchStyle,doorStyle};
 });
 assert(x.gameSlice===expected&&x.boardSlice===expected,`Level ${level} mode mismatch ${JSON.stringify(x)}`);
 if(expected==='stormswitch'){
  assert(x.selected===1&&x.nestMatch===1,`Level ${level} selected/nest hierarchy missing ${JSON.stringify(x)}`);
  assert(x.before==='0'&&x.after==='0',`Level ${level} decorative pseudo rules visible ${JSON.stringify(x)}`);
  assert(!/repeating-|conic-gradient|radial-gradient/.test(x.bg),`Level ${level} rule-like cell floor ${x.bg}`);
  if(x.switchStyle){assert(parseFloat(x.switchStyle.border)>=3&&x.switchStyle.bg!=='none'&&x.switchStyle.shadow!=='none'&&/gradient/.test(x.switchStyle.actuatorBg)&&parseFloat(x.switchStyle.actuatorBorder)>=3&&x.switchStyle.actuatorShadow!=='none',`Level ${level} switch treatment missing ${JSON.stringify(x.switchStyle)}`);results.switchSamples.push({level,...x.switchStyle})}
  if(x.doorStyle){assert(parseFloat(x.doorStyle.border)>=3&&x.doorStyle.bg!=='none'&&x.doorStyle.shadow!=='none'&&x.doorStyle.barsBorder&&x.doorStyle.barsBorder!=='rgba(0, 0, 0, 0)',`Level ${level} closed door treatment missing ${JSON.stringify(x.doorStyle)}`);results.doorSamples.push({level,...x.doorStyle})}
 }
 check(`Level ${level} visual contract`,JSON.stringify(x));return x;
}
async function openDoorContract(page,level){
 await settleGame(page,level);
 const count=await page.locator('#board .door-tile').count();if(!count)return null;
 await page.evaluate(()=>eval('doorMask=65535;renderGame(true)'));
 const x=await page.evaluate(()=>{const d=document.querySelector('#board .door-tile.open'),s=d&&getComputedStyle(d),b=d?.querySelector('.door-bars'),bs=b&&getComputedStyle(b);return d?{open:true,bg:s.backgroundImage,border:s.borderTopColor,shadow:s.boxShadow,barsOpacity:bs.opacity,barsBorder:bs.borderTopColor}:null});
 assert(x&&x.open&&x.bg!=='none'&&x.shadow!=='none'&&parseFloat(x.barsOpacity)>0,`Level ${level} open door state unreadable ${JSON.stringify(x)}`);results.openDoorSamples.push({level,...x});check(`Level ${level} open door state`,JSON.stringify(x));return x;
}

const ctx=await makeContext({width:390,height:844},{unlocked:400});
const page=await ctx.newPage();page.setDefaultTimeout(16000);page.on('pageerror',e=>results.errors.push('pageerror: '+String(e)));
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
assert(await page.evaluate(()=>!!window.LatchlingsChapterSevenPass3),'Chapter 7 module did not load');
const reps=[301,310,311,320,321,330,331,340,341,350];
for(const L of reps){
 const x=await boardContract(page,L,'stormswitch');
 if([301,311,321,331,341].includes(L)){results.ranges[x.range]=x.bg;await shot(page,`chapter7-level${L}-390`)}
 if(L===350)await shot(page,'chapter7-level350-390');
}
assert(Object.keys(results.ranges).length===5,'Did not observe all five Stormswitch ranges: '+JSON.stringify(results.ranges));
assert(new Set(Object.values(results.ranges)).size===5,'Stormswitch movement materials are not distinct: '+JSON.stringify(results.ranges));
assert(results.switchSamples.length>0,'No Chapter 7 switch fixture sampled');
assert(results.doorSamples.length>0,'No Chapter 7 door fixture sampled');
for(const L of reps){if(await openDoorContract(page,L))break}
assert(results.openDoorSamples.length>0,'No Chapter 7 open door fixture sampled');
check('Five distinct Stormswitch movement surfaces',JSON.stringify(results.ranges));
check('Stormswitch switch samples',JSON.stringify(results.switchSamples));
check('Stormswitch closed door samples',JSON.stringify(results.doorSamples));
check('Stormswitch open door samples',JSON.stringify(results.openDoorSamples));

await boardContract(page,300,'copperline');
await settleGame(page,325,'daily');
let daily=await page.evaluate(()=>({game:document.getElementById('game').dataset.visualSlice||'',board:document.getElementById('board').dataset.visualSlice||'',mode:document.body.dataset.playMode}));
assert(daily.mode==='daily'&&!daily.game&&!daily.board,'Daily inherited Stormswitch material: '+JSON.stringify(daily));check('Daily Chapter 7 isolation',JSON.stringify(daily));
await boardContract(page,351,'');
await boardContract(page,366,'aurora-dense');

// Movement 3 must expose the synchronization relay without covering route nodes.
await page.evaluate(()=>eval("chapterView=7;rangeView=2;screen('levels');renderChapter()"));
await page.waitForTimeout(760);
const atlas=await page.evaluate(()=>{
 const map=document.getElementById('levelGrid'),e=map.querySelector('.atlas-scene em'),r=e.getBoundingClientRect(),nodes=[...map.querySelectorAll('.atlas-node')].map(n=>{const x=n.getBoundingClientRect();return {level:n.dataset.level,left:x.left,top:x.top,right:x.right,bottom:x.bottom}}),overlaps=nodes.filter(n=>!(r.right<=n.left||r.left>=n.right||r.bottom<=n.top||r.top>=n.bottom)).map(n=>n.level),before=getComputedStyle(e,'::before'),after=getComputedStyle(e,'::after'),c=getComputedStyle(e);
 return {cls:map.className,landmark:{left:r.left,top:r.top,right:r.right,bottom:r.bottom,w:r.width,h:r.height,border:c.borderTopWidth,bg:c.backgroundImage,opacity:c.opacity,dialBorder:before.borderTopWidth,dialBg:before.backgroundImage,lampsBg:after.backgroundColor,lampsShadow:after.boxShadow},overlaps};
});
assert(/atlas-range-3/.test(atlas.cls),'Chapter 7 movement-3 Atlas class missing: '+JSON.stringify(atlas));
assert(atlas.landmark.w>=68&&atlas.landmark.h>=78&&parseFloat(atlas.landmark.border)>=4&&parseFloat(atlas.landmark.dialBorder)>=4&&/gradient/.test(atlas.landmark.dialBg)&&atlas.landmark.lampsBg!=='rgba(0, 0, 0, 0)'&&atlas.landmark.lampsShadow!=='none','Stormswitch relay landmark incomplete: '+JSON.stringify(atlas));
assert(atlas.overlaps.length===0,'Stormswitch relay landmark overlaps Atlas nodes: '+JSON.stringify(atlas));
check('Stormswitch Atlas synchronization relay',JSON.stringify(atlas));await shot(page,'chapter7-atlas-relay-390');
await ctx.close();

// Smallest supported phone endpoints.
const small=await makeContext({width:320,height:568},{unlocked:400});const sp=await small.newPage();sp.setDefaultTimeout(16000);sp.on('pageerror',e=>results.errors.push('small pageerror: '+String(e)));await sp.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
for(const L of [301,350]){await boardContract(sp,L,'stormswitch');await boundsOk(sp,`Level ${L} 320`);await shot(sp,`chapter7-level${L}-320`)}
await small.close();

// Solve the real authored Level 350 route and inspect dedicated reward + dock payoff.
const rewardCtx=await makeContext({width:390,height:844},{unlocked:350,seen:{opening:1,'across-drift':1,'old-maps':1}});const rp=await rewardCtx.newPage();rp.setDefaultTimeout(22000);rp.on('pageerror',e=>results.errors.push('reward pageerror: '+String(e)));await rp.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await settleGame(rp,350);
const solution=await rp.evaluate(()=>window.LEVELS[349].solution.map(x=>[x[0],x[1]]));
for(const [pi,d] of solution){const piece=rp.locator(`.latchling[data-pi="${pi}"]`);assert(await piece.count()===1,`Authored Level 350 solution references unavailable piece ${pi}`);if(!(await piece.evaluate(e=>e.classList.contains('selected'))))await piece.click();await rp.evaluate(async dir=>{await window.moveSelected(dir)},d)}
await rp.locator('.chapter-seven-reward').waitFor({state:'visible'});
const reward=await rp.evaluate(()=>({card:!!document.querySelector('.chapter-seven-reward'),postcard:!!document.querySelector('.stormswitch-reward-postcard'),relay:!!document.querySelector('.storm-reward-relay'),dial:!!document.querySelector('.storm-reward-dial'),lamps:document.querySelectorAll('.storm-reward-lamp').length,network:!!document.querySelector('.storm-reward-network'),dock:!!document.querySelector('.storm-reward-dock'),beam:!!document.querySelector('.storm-reward-beam'),home:!!document.getElementById('chapterSevenRewardHome'),cont:!!document.getElementById('chapterSevenRewardContinue'),text:document.querySelector('.chapter-seven-reward .chapter-reward-result')?.textContent||'',generic:!!document.querySelector('.story-beat-result')}));
assert(reward.card&&reward.postcard&&reward.relay&&reward.dial&&reward.lamps===4&&reward.network&&reward.dock&&reward.beam&&reward.home&&reward.cont,'Chapter 7 reward incomplete: '+JSON.stringify(reward));
assert(!reward.generic&&/Communities are watching their own routes/i.test(reward.text),'Chapter 7 living-network payoff missing: '+JSON.stringify(reward));
check('Real Level 350 dedicated reward',JSON.stringify(reward));await shot(rp,'chapter7-level350-reward-390');
await rp.click('#chapterSevenRewardHome');await rp.waitForTimeout(760);
const frame=rp.frameLocator('#homeTitleFrame');await frame.locator('#c2 .story-dock').waitFor({state:'visible'});
const home=await frame.locator('#c2 .phone').evaluate(phone=>{const t=phone.querySelector('.story-dock'),r=t.getBoundingClientRect(),pr=phone.getBoundingClientRect(),s=getComputedStyle(t);return {stage7:phone.classList.contains('story-stage-7'),focus:phone.classList.contains('story-focus-dock'),display:s.display,filter:s.filter,shadow:s.boxShadow,inside:r.left>=pr.left&&r.right<=pr.right&&r.top>=pr.top&&r.bottom<=pr.bottom,screen:parent.document.body.dataset.screen}});
assert(home.stage7&&home.focus&&home.display!=='none'&&home.filter!=='none'&&home.shadow!=='none'&&home.inside&&home.screen==='home','Little Home dock payoff missing: '+JSON.stringify(home));check('Little Home arrival dock payoff',JSON.stringify(home));await shot(rp,'chapter7-home-dock-focus-390');
await rewardCtx.close();

// Dedicated continuation must enter existing Homeward cinematic at Level 351.
const continueCtx=await makeContext({width:390,height:844},{unlocked:350,seen:{opening:1,'across-drift':1,'old-maps':1}});const cp=await continueCtx.newPage();cp.setDefaultTimeout(26000);cp.on('pageerror',e=>results.errors.push('continue pageerror: '+String(e)));await cp.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await settleGame(cp,350);
const solution2=await cp.evaluate(()=>window.LEVELS[349].solution.map(x=>[x[0],x[1]]));
for(const [pi,d] of solution2){const piece=cp.locator(`.latchling[data-pi="${pi}"]`);if(!(await piece.evaluate(e=>e.classList.contains('selected'))))await piece.click();await cp.evaluate(async dir=>{await window.moveSelected(dir)},d)}
await cp.locator('.chapter-seven-reward').waitFor({state:'visible'});await cp.click('#chapterSevenRewardContinue');
await cp.waitForFunction(()=>window.LatchlingsCinematics?.active==='homeward',{timeout:18000});
const continuation=await cp.evaluate(()=>({level:eval('currentLevel'),active:window.LatchlingsCinematics?.active||'',screen:document.body.dataset.screen,overlay:document.getElementById('cinematicOverlay')?.className||''}));
assert(continuation.level===351&&continuation.active==='homeward','Chapter 7 continuation missed Homeward: '+JSON.stringify(continuation));check('Level 350 reward continues into existing Homeward cinematic',JSON.stringify(continuation));await shot(cp,'chapter7-homeward-continuation-390');await continueCtx.close();

// Reduced motion must reach the same informative dock state without animation dependency.
const reduced=await makeContext({width:390,height:844},{unlocked:351,reduced:true});const red=await reduced.newPage();red.setDefaultTimeout(14000);await red.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await red.evaluate(()=>window.LatchlingsChapterSevenPass3.focusDock());await red.waitForTimeout(300);const rframe=red.frameLocator('#homeTitleFrame');await rframe.locator('#c2 .story-dock').waitFor({state:'visible'});const reducedHome=await rframe.locator('#c2 .phone').evaluate(phone=>{const t=phone.querySelector('.story-dock'),s=getComputedStyle(t);return {stage7:phone.classList.contains('story-stage-7'),focus:phone.classList.contains('story-focus-dock'),display:s.display,animation:s.animationName,filter:s.filter,transform:s.transform}});assert(reducedHome.stage7&&reducedHome.focus&&reducedHome.display!=='none'&&reducedHome.filter!=='none','Reduced-motion dock payoff missing: '+JSON.stringify(reducedHome));assert(reducedHome.animation==='none','Reduced-motion dock still animates: '+JSON.stringify(reducedHome));check('Reduced-motion Chapter 7 dock payoff',JSON.stringify(reducedHome));await reduced.close();

assert(results.errors.length===0,'Browser errors: '+JSON.stringify(results.errors));
fs.writeFileSync(`${OUT}/results.json`,JSON.stringify(results,null,2));
console.log('CHAPTER7_PASS3_BROWSER_ACCEPTED');
await browser.close();
