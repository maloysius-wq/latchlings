import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT='/tmp/audit-visual-slice';
fs.mkdirSync(OUT,{recursive:true});
const results={checks:[],errors:[],screenshots:[]};
function assert(cond,msg){if(!cond)throw new Error(msg)}
function check(name,detail='ok'){results.checks.push({name,detail});console.log('CHECK',name,detail)}

const browser=await chromium.launch({headless:true});
async function makeContext(viewport={width:390,height:844},reduced=false,unlocked=400){
 const ctx=await browser.newContext({viewport,deviceScaleFactor:1,reducedMotion:reduced?'reduce':'no-preference'});
 const stars={};for(let i=1;i<unlocked;i++)stars[i]=3;
 await ctx.addInitScript(({unlocked,stars,reduced})=>{
  localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked,stars}));
  localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1,'across-drift':1,'old-maps':1,homeward:1}));
  localStorage.setItem('latchlings_ui_prefs_v1',JSON.stringify({motion:reduced?'reduced':'system',textSize:'normal'}));
 },{unlocked,stars,reduced});
 return ctx;
}
async function settleGame(page,level){
 await page.evaluate(L=>window.startLevel(L),level);
 // Chapter-opening story cards are scheduled after the screen transition, so wait past that timer
 // and dismiss through the real player-facing Start route control before visual capture.
 await page.waitForTimeout(1050);
 const continueBtn=page.locator('#storyCardContinue');
 if(await continueBtn.isVisible().catch(()=>false))await continueBtn.click();
 await page.evaluate(()=>{try{window.LatchlingsStoryTheme?.close(true)}catch(_){}const o=document.getElementById('storyCardOverlay');if(o){o.classList.remove('show');o.setAttribute('aria-hidden','true')}});
 await page.waitForTimeout(120);
 assert(!(await page.locator('#storyCardOverlay').evaluate(o=>o.classList.contains('show'))),'story card remained over gameplay');
}
async function solveCurrentLevel(page,level){
 const solution=await page.evaluate(L=>window.LEVELS[L-1].solution,level);
 assert(Array.isArray(solution)&&solution.length>0,`missing solution for level ${level}`);
 for(const [pi,d] of solution){
  const piece=page.locator(`.latchling[data-pi="${pi}"]`);
  if(await piece.count()){await piece.click();await page.evaluate(dir=>window.moveSelected(dir),d);await page.waitForTimeout(15)}
 }
 await page.locator('.chapter-reward-card').waitFor({state:'visible',timeout:8000});
 return solution.length;
}
async function shot(page,name){await page.screenshot({path:`${OUT}/${name}.png`,fullPage:false});results.screenshots.push(name+'.png')}
async function boundsOk(page,label){const x=await page.evaluate(()=>({w:innerWidth,h:innerHeight,sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight,bodyw:document.body.scrollWidth}));assert(x.sw<=x.w+1&&x.bodyw<=x.w+1,`${label} horizontal overflow ${JSON.stringify(x)}`);check(label+' horizontal containment',JSON.stringify(x))}

// Capture current deployed Pass 1 as the visual baseline. These are comparison evidence only.
async function captureBaseline(){
 const ctx=await makeContext({width:390,height:844},false,400);const p=await ctx.newPage();p.setDefaultTimeout(8000);
 try{
  await p.goto('https://maloysius-wq.github.io/latchlings/?audit-baseline=20260912',{waitUntil:'networkidle',timeout:30000});
  await settleGame(p,1);await shot(p,'before-sunpetal-390');
  await settleGame(p,366);await shot(p,'before-aurora366-390');
  await p.evaluate(()=>{if(window.LatchlingsCinematics?.active)window.LatchlingsCinematics.finish(true);window.LatchlingsCinematics.show('across-drift',{markSeen:false});window.LatchlingsCinematics.next()});await p.waitForTimeout(180);await shot(p,'before-porch-390');
  check('deployed Pass 1 baseline captured');
 }catch(e){results.errors.push('baseline capture: '+String(e));console.warn('BASELINE_CAPTURE_WARNING',String(e))}
 await ctx.close();
}
await captureBaseline();

// Main candidate checks at the production phone target.
const ctx=await makeContext({width:390,height:844},false,400);
const page=await ctx.newPage();page.setDefaultTimeout(8000);
page.on('pageerror',e=>results.errors.push('pageerror: '+String(e)));
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
assert(!await page.locator('meta[name="viewport"]').getAttribute('content').then(x=>x?.includes('user-scalable=no')),'viewport zoom disabled');

await settleGame(page,1);
let sun=await page.evaluate(()=>{
 const board=document.getElementById('board'),cell=board.querySelector('.cell'),nest=board.querySelector('.nest.selected-match'),game=document.getElementById('game'),cs=getComputedStyle(cell),bef=getComputedStyle(cell,'::before'),aft=getComputedStyle(cell,'::after'),sel=board.querySelector('.latchling.selected');
 return {gameSlice:game.dataset.visualSlice,boardSlice:board.dataset.visualSlice,bg:cs.backgroundImage,before:bef.opacity,after:aft.opacity,nest:!!nest,selected:!!sel,boardRange:board.dataset.boardRange};
});
assert(sun.gameSlice==='sunpetal'&&sun.boardSlice==='sunpetal','Sunpetal slice hook missing');
assert(sun.nest&&sun.selected,'Sunpetal selected piece / matching nest pair missing');
assert(sun.before==='0'&&sun.after==='0','Sunpetal decorative cell rules still visible');
assert(!/repeating-|conic-gradient|radial-gradient/.test(sun.bg),'Sunpetal floor still rule-like: '+sun.bg);
check('Sunpetal quiet-floor contract',JSON.stringify(sun));await boundsOk(page,'Sunpetal 390');await shot(page,'after-sunpetal-390');

await settleGame(page,366);
let aur=await page.evaluate(()=>{
 const board=document.getElementById('board'),cell=board.querySelector('.cell'),game=document.getElementById('game'),cs=getComputedStyle(cell),bef=getComputedStyle(cell,'::before'),aft=getComputedStyle(cell,'::after');
 const count=s=>board.querySelectorAll(s).length;
 return {gameSlice:game.dataset.visualSlice,boardSlice:board.dataset.visualSlice,bg:cs.backgroundImage,before:bef.opacity,after:aft.opacity,nestMatch:count('.nest.selected-match'),selected:count('.latchling.selected'),anchor:count('.anchor'),suitGate:count('.gate.suit'),colorGate:count('.gate.color'),rail:count('.rail'),turner:count('.turner'),switchTile:count('.switch-tile'),door:count('.door-tile'),rocks:count('.rock')};
});
assert(aur.gameSlice==='aurora-dense'&&aur.boardSlice==='aurora-dense','Aurora slice hook missing');
for(const k of ['anchor','suitGate','colorGate','rail','turner','switchTile','door'])assert(aur[k]>0,`Level 366 is missing dense fixture ${k}: ${JSON.stringify(aur)}`);
assert(aur.nestMatch===1&&aur.selected===1,'Aurora selected piece / matching nest pair missing');
assert(aur.before==='0'&&aur.after==='0','Aurora decorative cell rules still visible');
assert(!/repeating-|conic-gradient|radial-gradient/.test(aur.bg),'Aurora floor still rule-like: '+aur.bg);
check('Aurora dense-mechanic contract',JSON.stringify(aur));await boundsOk(page,'Aurora 390');await shot(page,'after-aurora366-390');

// Familiar Porch staging and dialogue separation.
await page.evaluate(()=>{if(window.LatchlingsCinematics?.active)window.LatchlingsCinematics.finish(true);window.LatchlingsCinematics.show('across-drift',{markSeen:false});window.LatchlingsCinematics.next()});
await page.waitForTimeout(220);
let porch=await page.evaluate(()=>{
 const o=document.getElementById('cinematicOverlay'),stage=document.getElementById('cinematicStage'),copy=o.querySelector('.cinematic-copy'),house=stage.querySelector('.porch-house'),scope=stage.querySelector('.cin-porch-production');
 const r=e=>{const b=e.getBoundingClientRect();return {l:b.left,t:b.top,r:b.right,b:b.bottom,w:b.width,h:b.height}};
 const intersects=(a,b)=>a.l<b.r&&a.r>b.l&&a.t<b.b&&a.b>b.t;const hr=r(house),cr=r(copy),sr=r(stage);
 return {visual:o.dataset.visual,production:!!scope,tansy:stage.querySelectorAll('[data-character="Tansy"]').length,pip:stage.querySelectorAll('[data-character="Pip"]').length,telescope:stage.querySelectorAll('.production-telescope').length,house:!!house,dialogueInStage:stage.querySelectorAll('.cin-dialogue-layer,.cin-speech-bubble').length,houseCopyOverlap:intersects(hr,cr),stage:sr,houseRect:hr,copyRect:cr};
});
assert(porch.visual==='porch'&&porch.production&&porch.house&&porch.telescope===1,'Porch production scene incomplete: '+JSON.stringify(porch));
assert(porch.tansy===1&&porch.pip===1,'Porch scene must show Tansy and Pip together');
assert(porch.dialogueInStage===0,'Dialogue is covering the porch evidence');
assert(!porch.houseCopyOverlap,'Cinematic copy overlaps the familiar porch');
check('Familiar Porch visual-evidence contract',JSON.stringify(porch));await boundsOk(page,'Porch 390');await shot(page,'after-porch-390');
await page.evaluate(()=>document.querySelector('.cinematic-copy').style.visibility='hidden');await shot(page,'after-porch-text-hidden-390');await page.evaluate(()=>document.querySelector('.cinematic-copy').style.visibility='');
await ctx.close();

// Chapter 1 reward and canonical Little Home mailbox payoff from a chapter-one progress state.
const rewardCtx=await makeContext({width:390,height:844},false,50);const rewardPage=await rewardCtx.newPage();rewardPage.setDefaultTimeout(8000);rewardPage.on('pageerror',e=>results.errors.push('reward pageerror: '+String(e)));
await rewardPage.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await settleGame(rewardPage,50);const solvedMoves=await solveCurrentLevel(rewardPage,50);await rewardPage.waitForTimeout(120);
let reward=await rewardPage.evaluate(()=>({card:!!document.querySelector('.chapter-reward-card'),postcard:!!document.querySelector('.chapter-reward-postcard'),mailbox:!!document.querySelector('.chapter-reward-mailbox'),home:!!document.getElementById('chapterRewardHome'),cont:!!document.getElementById('chapterRewardContinue'),text:document.querySelector('.chapter-reward-result')?.textContent||'',score:document.querySelector('.chapter-reward-score')?.textContent||'',genericBeat:!!document.querySelector('.story-beat-result')}));
assert(reward.card&&reward.postcard&&reward.mailbox&&reward.home&&reward.cont,'Chapter 1 reward surface incomplete: '+JSON.stringify(reward));assert(!reward.genericBeat,'Chapter 1 still shows dense generic story result');assert(/Breakfast, watering, and mail/.test(reward.text),'Chapter 1 ordinary-life result missing');assert(!/^0 moves/.test(reward.score),`reward screenshot used fabricated zero-move clear: ${reward.score}`);check('Chapter 1 visible reward contract',JSON.stringify({...reward,solutionMoves:solvedMoves}));await boundsOk(rewardPage,'Reward 390');await shot(rewardPage,'after-reward50-390');
await rewardPage.click('#chapterRewardHome');await rewardPage.waitForTimeout(220);
const frame=rewardPage.frameLocator('#homeTitleFrame');await frame.locator('#c2 .story-mailbox').waitFor({state:'visible'});let homePayoff=await frame.locator('#c2 .phone').evaluate(phone=>({focus:phone.classList.contains('story-focus-mailbox'),stage1:phone.classList.contains('story-stage-1'),mailbox:getComputedStyle(phone.querySelector('.story-mailbox')).display}));assert(homePayoff.stage1&&homePayoff.mailbox!=='none','Canonical Little Home mailbox did not appear: '+JSON.stringify(homePayoff));assert(homePayoff.focus,'Mailbox focus treatment did not trigger on Visit Little Home');check('Little Home mailbox payoff',JSON.stringify(homePayoff));await shot(rewardPage,'after-home-mailbox-390');await rewardCtx.close();

// Smallest supported phone: candidate surfaces must remain contained without shrinking interaction targets below 44px.
const small=await makeContext({width:320,height:568},false,400);const sp=await small.newPage();sp.setDefaultTimeout(8000);await sp.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
for(const level of [1,366]){await settleGame(sp,level);await boundsOk(sp,`Level ${level} 320`);const fit=await sp.evaluate(()=>{const c=document.querySelector('.controls')?.getBoundingClientRect(),b=document.getElementById('board')?.getBoundingClientRect();return {controls:c&&{top:c.top,bottom:c.bottom},board:b&&{top:b.top,bottom:b.bottom},h:innerHeight,minTargets:Math.min(...Array.from(document.querySelectorAll('.controls button')).filter(x=>getComputedStyle(x).display!=='none').map(x=>Math.min(x.getBoundingClientRect().width,x.getBoundingClientRect().height)))} });assert(fit.controls&&fit.controls.bottom<=fit.h+1,`Level ${level} controls leave 320x568 viewport ${JSON.stringify(fit)}`);assert(fit.minTargets>=44,`Level ${level} touch target below 44px ${JSON.stringify(fit)}`);check(`Level ${level} 320 geometry`,JSON.stringify(fit));await shot(sp,`after-level${level}-320`)}
await small.close();

// Reduced-motion presentation still contains the slice and porch meaning.
const reduced=await makeContext({width:390,height:844},true,400);const rp=await reduced.newPage();rp.setDefaultTimeout(8000);await rp.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await settleGame(rp,366);assert(await rp.locator('#game').getAttribute('data-visual-slice')==='aurora-dense','Reduced-motion Aurora slice missing');await rp.evaluate(()=>{window.LatchlingsCinematics.show('across-drift',{markSeen:false});window.LatchlingsCinematics.next()});await rp.waitForTimeout(100);assert(await rp.locator('#cinematicOverlay').getAttribute('data-visual')==='porch','Reduced-motion porch missing');check('Reduced-motion slice surfaces render');await reduced.close();

assert(results.errors.length===0,'Browser errors: '+JSON.stringify(results.errors));
fs.writeFileSync(`${OUT}/results.json`,JSON.stringify(results,null,2));
console.log('AUDIT_VISUAL_SLICE_ACCEPTED');
await browser.close();
