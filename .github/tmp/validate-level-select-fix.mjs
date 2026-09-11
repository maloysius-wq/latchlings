import { chromium } from 'playwright';
import fs from 'node:fs';

const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
const errors=[];
const checks=[];
page.on('pageerror',e=>errors.push('pageerror: '+e.message));
page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text())});

function assert(cond,msg){if(!cond)throw new Error(msg)}
async function snapshot(label){
  const s=await page.evaluate((label)=>{
    const levels=document.getElementById('levels');
    const shell=document.querySelector('#levels .atlas-shell');
    const map=document.getElementById('levelGrid');
    const rect=levels?.getBoundingClientRect();
    const shellRect=shell?.getBoundingClientRect();
    const cs=levels?getComputedStyle(levels):null;
    const directAnimations=levels?levels.getAnimations().filter(a=>a.effect?.target===levels):[];
    return {
      label,
      bodyScreen:document.body.dataset.screen,
      activeIds:[...document.querySelectorAll('.screen.active')].map(x=>x.id),
      display:cs?.display,
      opacity:cs?.opacity,
      transform:cs?.transform,
      rect:rect&&{x:rect.x,y:rect.y,width:rect.width,height:rect.height},
      shellRect:shellRect&&{x:shellRect.x,y:shellRect.y,width:shellRect.width,height:shellRect.height},
      chapterText:document.getElementById('chapterHead')?.innerText||'',
      rangeText:document.getElementById('rangeNav')?.innerText||'',
      nodeCount:map?.querySelectorAll('.atlas-node').length||0,
      clickableNodes:map?.querySelectorAll('.atlas-node:not(.locked)').length||0,
      outgoingCount:document.querySelectorAll('.screen-transition-outgoing').length,
      directAnimationCount:directAnimations.length,
      overlayClass:document.getElementById('overlay')?.className||'',
      debug:document.getElementById('debug')?.textContent||''
    };
  },label);
  checks.push(s);
  console.log('CHECK '+JSON.stringify(s));
  return s;
}
async function assertAtlas(label){
  const s=await snapshot(label);
  assert(s.bodyScreen==='levels',label+': body data-screen is not levels');
  assert(s.activeIds.length===1&&s.activeIds[0]==='levels',label+': levels is not the sole active screen');
  assert(s.display==='flex',label+': levels display is '+s.display);
  assert(Number(s.opacity)>=0.99,label+': levels opacity is '+s.opacity);
  assert(Math.abs(s.rect.x)<1.5,label+': levels is horizontally displaced x='+s.rect.x);
  assert(s.rect.width>=380,label+': levels width collapsed');
  assert(Math.abs(s.shellRect.x)<1.5&&s.shellRect.width>=380,label+': atlas shell displaced/collapsed');
  assert(s.chapterText.trim().length>20,label+': chapter header not populated');
  assert(s.rangeText.trim().length>5,label+': range navigation not populated');
  assert(s.nodeCount===10,label+': expected 10 atlas nodes, got '+s.nodeCount);
  assert(s.clickableNodes>0,label+': no clickable atlas nodes');
  assert(s.outgoingCount===0,label+': stale outgoing overlay remains');
  assert(s.directAnimationCount===0,label+': completed outgoing animation effect remains on levels');
  assert(!s.debug,label+': debug error surfaced: '+s.debug);
}
async function goGame(level=5){
  await page.evaluate(level=>startLevel(level),level);
  await page.waitForTimeout(720);
  const active=await page.evaluate(()=>document.querySelector('.screen.active')?.id);
  assert(active==='game','game did not become active');
}
async function pauseToLevels(label){
  await page.click('#pauseBtn');
  await page.waitForSelector('#pauseLevels');
  await page.click('#pauseLevels');
  await page.waitForTimeout(720);
  await assertAtlas(label);
}

fs.mkdirSync('level-select-fix-audit',{recursive:true});
await page.goto('http://127.0.0.1:4173/',{waitUntil:'load'});
await page.evaluate(()=>localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked:12,stars:{1:3,2:3,3:2}})));
await page.reload({waitUntil:'load'});

// Direct game -> Atlas baseline.
await goGame(5);
await pauseToLevels('pause-direct');

// Reproduce the former bug: Atlas animates out to Game, then must be reusable.
await goGame(5);
await pauseToLevels('pause-after-levels-was-outgoing');

// Lose flow after another Atlas -> Game transition.
await goGame(5);
await page.evaluate(()=>loseLevel());
await page.waitForSelector('#loseLevelsBtn');
await page.click('#loseLevelsBtn');
await page.waitForTimeout(720);
await assertAtlas('lose-after-levels-was-outgoing');

// Win/reward flow after another Atlas -> Game transition.
await goGame(12);
await page.evaluate(()=>winLevel());
await page.waitForSelector('#toLevelsBtn');
await page.click('#toLevelsBtn');
await page.waitForTimeout(900);
const rewardEarly=await snapshot('win-reward-early');
assert(rewardEarly.bodyScreen==='levels'&&rewardEarly.activeIds.includes('levels'),'win reward did not enter levels');
assert(Number(rewardEarly.opacity)>=0.99&&Math.abs(rewardEarly.rect.x)<1.5,'win reward Atlas is visually displaced/faded');
assert(rewardEarly.nodeCount===10,'win reward Atlas not populated');
await page.waitForTimeout(2500);
await assertAtlas('win-reward-final');

// Home -> Atlas after Atlas has itself been outgoing.
await page.evaluate(()=>screen('home'));
await page.waitForTimeout(720);
await page.evaluate(()=>{chapterView=Math.ceil(progress.unlocked/50);rangeView=Math.floor(((progress.unlocked-1)%50)/10);screen('levels');renderChapter()});
await page.waitForTimeout(720);
await assertAtlas('home-to-levels-after-reuse');

// Preserve nominal 420ms transition contract and ensure finished effect is removed.
const timing=await page.evaluate(async()=>{
  const levels=document.getElementById('levels');
  screen('game');
  await new Promise(r=>setTimeout(r,80));
  const a=levels.getAnimations().find(x=>x.effect?.target===levels);
  const duration=a?.effect?.getTiming()?.duration||0;
  const props=a?.effect?.getKeyframes()?.map(k=>({transform:k.transform,opacity:k.opacity}))||[];
  await activeScreenTransition?.finished;
  return {duration,props,after:levels.getAnimations().filter(x=>x.effect?.target===levels).length};
});
console.log('TIMING '+JSON.stringify(timing));
assert(timing.duration===420,'transition duration changed from 420ms');
assert(timing.props.length===2,'transition no longer has exactly two keyframes');
assert(timing.props.every(k=>k.transform!==undefined&&k.opacity!==undefined),'transition keyframes changed away from transform/opacity');
assert(timing.after===0,'finished transition animation remains attached to outgoing screen');

// Rapid cancellation must not leave a stale effect.
await page.evaluate(()=>{screen('home');screen('levels');renderChapter()});
await page.waitForTimeout(720);
await assertAtlas('rapid-navigation');

// Reduced motion must still switch immediately without animations.
await page.emulateMedia({reducedMotion:'reduce'});
await page.evaluate(()=>startLevel(5));
await page.waitForTimeout(80);
await page.evaluate(()=>{chapterView=1;rangeView=0;screen('levels');renderChapter()});
await page.waitForTimeout(80);
await assertAtlas('reduced-motion');

assert(errors.length===0,'browser errors: '+errors.join(' | '));
await page.screenshot({path:'level-select-fix-audit/final-levels.png',fullPage:true});
const report={checks,timing,errors};
fs.writeFileSync('level-select-fix-audit/report.json',JSON.stringify(report,null,2));
console.log('LEVEL_SELECT_FIX_ACCEPTED');
await browser.close();
