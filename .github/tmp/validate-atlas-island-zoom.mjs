import { chromium } from 'playwright';
import fs from 'node:fs';

const out='/tmp/atlas-island-zoom-audit';
fs.mkdirSync(out,{recursive:true});
const errors=[];
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
await context.addInitScript(() => {
  const original=Element.prototype.animate;
  window.__screenTransitionAudit=[];
  Element.prototype.animate=function(frames,options){
    if(this.classList&&this.classList.contains('screen-transition-outgoing')){
      let safeFrames=[];
      try{safeFrames=JSON.parse(JSON.stringify(frames))}catch(_){ }
      window.__screenTransitionAudit.push({
        id:this.id,
        frames:safeFrames,
        duration:typeof options==='number'?options:options?.duration,
        easing:typeof options==='object'?options?.easing:null,
        origin:this.style.transformOrigin,
        targetScreen:document.body.dataset.screen,
        at:performance.now()
      });
    }
    return original.call(this,frames,options);
  };
});
const page=await context.newPage();
page.on('pageerror',e=>errors.push(String(e)));
page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text())});
await page.goto('http://127.0.0.1:4173/',{waitUntil:'load'});
await page.evaluate(()=>localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked:3,stars:{1:3,2:3}})));
await page.reload({waitUntil:'load'});
await page.waitForFunction(()=>window.LatchlingsHomeAction);

await page.evaluate(()=>window.LatchlingsHomeAction('levels'));
await page.waitForSelector('#levels.active .atlas-node[data-level="3"]');
await page.waitForTimeout(520);
const targetGeometry=await page.evaluate(()=>{
  const s=document.getElementById('levels').getBoundingClientRect();
  const n=document.querySelector('.atlas-node[data-level="3"]').getBoundingClientRect();
  return {x:n.left+n.width/2-s.left,y:n.top+n.height/2-s.top};
});
await page.screenshot({path:`${out}/atlas-before-dive.png`});
await page.click('.atlas-node[data-level="3"]');
await page.waitForFunction(()=>document.body.dataset.screen==='game');
await page.waitForTimeout(210);
const diveMid=await page.evaluate(()=>({
  transform:getComputedStyle(document.getElementById('levels')).transform,
  opacity:+getComputedStyle(document.getElementById('levels')).opacity,
  outgoing:document.getElementById('levels').classList.contains('screen-transition-outgoing')
}));
await page.screenshot({path:`${out}/atlas-dive-mid.png`});
await page.waitForTimeout(360);
const diveState=await page.evaluate(()=>({
  active:document.body.dataset.screen,
  outgoing:document.querySelectorAll('.screen-transition-outgoing').length,
  animations:document.getElementById('levels').getAnimations().length,
  log:window.__screenTransitionAudit.slice()
}));
const dive=diveState.log.at(-1);
if(!dive||dive.id!=='levels') throw new Error('missing Atlas dive log');
if(dive.duration!==460) throw new Error(`wrong dive duration ${dive.duration}`);
if(!String(dive.frames.at(-1)?.transform).includes('scale(1.34)')) throw new Error('missing dive scale');
if(dive.frames.some(f=>String(f.transform||'').includes('106vw'))) throw new Error('dive used sideways swipe');
const [ox,oy]=String(dive.origin).split(' ').map(parseFloat);
if(Math.abs(ox-targetGeometry.x)>3||Math.abs(oy-targetGeometry.y)>3) throw new Error(`dive origin mismatch ${dive.origin} vs ${JSON.stringify(targetGeometry)}`);
if(!diveMid.outgoing||diveMid.opacity>=1) throw new Error(`dive not visibly progressing ${JSON.stringify(diveMid)}`);
if(diveState.active!=='game'||diveState.outgoing||diveState.animations) throw new Error(`dive cleanup failed ${JSON.stringify(diveState)}`);

await page.click('#pauseBtn');
await page.waitForSelector('#pauseLevels');
await page.click('#pauseLevels');
await page.waitForFunction(()=>document.body.dataset.screen==='levels');
await page.waitForTimeout(210);
const pullMid=await page.evaluate(()=>({
  transform:getComputedStyle(document.getElementById('game')).transform,
  opacity:+getComputedStyle(document.getElementById('game')).opacity,
  outgoing:document.getElementById('game').classList.contains('screen-transition-outgoing')
}));
await page.screenshot({path:`${out}/game-pullback-mid.png`});
await page.waitForTimeout(360);
const pullState=await page.evaluate(()=>({
  active:document.body.dataset.screen,
  outgoing:document.querySelectorAll('.screen-transition-outgoing').length,
  animations:document.getElementById('game').getAnimations().length,
  log:window.__screenTransitionAudit.slice()
}));
const pull=pullState.log.at(-1);
if(!pull||pull.id!=='game') throw new Error('missing pullback log');
if(pull.duration!==460) throw new Error(`wrong pullback duration ${pull.duration}`);
if(!String(pull.frames.at(-1)?.transform).includes('scale(.76)')) throw new Error('missing pullback scale');
if(pull.frames.some(f=>String(f.transform||'').includes('106vw'))) throw new Error('pullback used sideways swipe');
if(!pullMid.outgoing||pullMid.opacity>=1) throw new Error(`pullback not visibly progressing ${JSON.stringify(pullMid)}`);
if(pullState.active!=='levels'||pullState.outgoing||pullState.animations) throw new Error(`pullback cleanup failed ${JSON.stringify(pullState)}`);

await page.click('.atlas-node[data-level="3"]');
await page.waitForTimeout(540);
await page.click('#pauseBtn');
await page.click('#pauseLevels');
await page.waitForTimeout(540);
const repeat=await page.evaluate(()=>({
  active:document.body.dataset.screen,
  outgoing:document.querySelectorAll('.screen-transition-outgoing').length,
  levelsAnimations:document.getElementById('levels').getAnimations().length,
  gameAnimations:document.getElementById('game').getAnimations().length,
  levelsTransform:getComputedStyle(document.getElementById('levels')).transform,
  levelsOpacity:getComputedStyle(document.getElementById('levels')).opacity
}));
if(repeat.active!=='levels'||repeat.outgoing||repeat.levelsAnimations||repeat.gameAnimations||repeat.levelsTransform!=='none'||repeat.levelsOpacity!=='1') throw new Error(`repeat cleanup failed ${JSON.stringify(repeat)}`);

await page.click('#levelsBack');
await page.waitForTimeout(100);
const generic=await page.evaluate(()=>window.__screenTransitionAudit.at(-1));
if(!generic||generic.id!=='levels'||generic.duration!==420||!generic.frames.some(f=>String(f.transform||'').includes('106vw'))) throw new Error(`generic swipe changed ${JSON.stringify(generic)}`);
await page.waitForTimeout(430);

fs.writeFileSync(`${out}/report.json`,JSON.stringify({targetGeometry,diveMid,dive,pullMid,pull,repeat,generic,errors},null,2));
if(errors.length) throw new Error(errors.join(' | '));
await context.close();

const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
const rp=await reduced.newPage();
await rp.goto('http://127.0.0.1:4173/',{waitUntil:'load'});
await rp.evaluate(()=>localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked:3,stars:{1:3,2:3}})));
await rp.reload({waitUntil:'load'});
await rp.waitForFunction(()=>window.LatchlingsHomeAction);
await rp.evaluate(()=>window.LatchlingsHomeAction('levels'));
await rp.waitForSelector('#levels.active .atlas-node[data-level="3"]');
await rp.click('.atlas-node[data-level="3"]');
const reducedState=await rp.evaluate(()=>({
  screen:document.body.dataset.screen,
  outgoing:document.querySelectorAll('.screen-transition-outgoing').length,
  animations:[...document.querySelectorAll('.screen')].reduce((n,e)=>n+e.getAnimations().length,0)
}));
if(reducedState.screen!=='game'||reducedState.outgoing||reducedState.animations) throw new Error(`reduced motion failed ${JSON.stringify(reducedState)}`);
fs.writeFileSync(`${out}/reduced-motion.json`,JSON.stringify(reducedState,null,2));
await reduced.close();
await browser.close();
console.log('ATLAS_ISLAND_ZOOM_ACCEPTED');
