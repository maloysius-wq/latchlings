import { chromium } from 'playwright';
import fs from 'node:fs';
fs.mkdirSync('opening-bubble-flicker-audit',{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:3});
const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
await page.addInitScript(()=>{try{localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1}))}catch{}});
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
await page.waitForFunction(()=>window.LatchlingsCinematics);
await page.evaluate(()=>{if(window.LatchlingsCinematics.active)window.LatchlingsCinematics.finish(true);window.LatchlingsCinematics.show('opening',{markSeen:false});});
await page.waitForSelector('#cinematicOverlay.show');
await page.evaluate(()=>{
  window.__bubbleMutations=[];
  const stage=document.getElementById('cinematicStage');
  const wm=new WeakMap();let next=1;
  window.__bubbleId=n=>{if(!wm.has(n))wm.set(n,next++);return wm.get(n)};
  new MutationObserver(ms=>{for(const m of ms){for(const n of [...m.addedNodes,...m.removedNodes]){if(n.nodeType===1){const bubbles=n.matches?.('.cin-speech-bubble')?[n]:[...(n.querySelectorAll?.('.cin-speech-bubble')||[])];for(const b of bubbles)window.__bubbleMutations.push({t:performance.now(),type:m.addedNodes.length&&[...m.addedNodes].includes(n)?'add':'remove',id:window.__bubbleId(b),text:b.textContent.trim()})}}}}).observe(stage,{subtree:true,childList:true});
});
const report={beats:[],errors};
for(let beat=0;beat<7;beat++){
  await page.waitForFunction(i=>window.LatchlingsCinematics.beat===i,beat);
  await page.waitForTimeout(250);
  const data=await page.evaluate(async beat=>{
    const start=performance.now(), samples=[];
    for(let i=0;i<150;i++){
      await new Promise(r=>requestAnimationFrame(r));
      const bubbles=[...document.querySelectorAll('#cinematicStage .cin-speech-bubble')];
      samples.push({t:performance.now()-start,bubbles:bubbles.map(b=>{const r=b.getBoundingClientRect(),cs=getComputedStyle(b);return {id:window.__bubbleId(b),text:b.textContent.trim(),x:r.x,y:r.y,w:r.width,h:r.height,opacity:Number(cs.opacity),visibility:cs.visibility,display:cs.display,transform:cs.transform,translate:cs.translate,animationName:cs.animationName,transitionProperty:cs.transitionProperty,animations:b.getAnimations().map(a=>({playState:a.playState,currentTime:a.currentTime,effect:a.effect?.getComputedTiming?.().progress}))}})});
    }
    return {samples,mutations:window.__bubbleMutations.splice(0)};
  },beat);
  const by=new Map();
  for(const s of data.samples)for(const b of s.bubbles){if(!by.has(b.id))by.set(b.id,[]);by.get(b.id).push(b)}
  const bubbles=[];
  for(const [id,arr] of by){const vals=k=>arr.map(x=>x[k]);const range=k=>Math.max(...vals(k))-Math.min(...vals(k));bubbles.push({id,text:arr[0].text,samples:arr.length,xRange:range('x'),yRange:range('y'),wRange:range('w'),hRange:range('h'),opacityMin:Math.min(...vals('opacity')),opacityMax:Math.max(...vals('opacity')),animationNames:[...new Set(arr.map(x=>x.animationName))],transitionProperties:[...new Set(arr.map(x=>x.transitionProperty))],transforms:[...new Set(arr.map(x=>x.transform))],translates:[...new Set(arr.map(x=>x.translate))]})}
  report.beats.push({beat:beat+1,bubbles,mutations:data.mutations});
  await page.screenshot({path:`opening-bubble-flicker-audit/beat-${beat+1}.png`,fullPage:true});
  if(beat<6){await page.click('#cinematicNext');await page.waitForTimeout(100)}
}
fs.writeFileSync('opening-bubble-flicker-audit/report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();
