import { chromium } from 'playwright';
import fs from 'node:fs';
fs.mkdirSync('opening-bubble-stability-audit',{recursive:true});
const browser=await chromium.launch({headless:true});
const all={accepted:true,failures:[],runs:[]};
const fail=m=>{all.accepted=false;all.failures.push(m)};
const expected={2:['PipIt was an expedition basket.','TansyIt was one basket.'],4:['PippaWe can show you every place yesterday stopped working.','RowanYou can help us find where those routes should go now.'],5:['BrambleEverybody knows a piece of the route. We just need to put the pieces together.'],6:['RowanGuide each helper into the nest that matches them. When every helper arrives safely, that route is working.'],7:['PippaThat route worked yesterday.','RowanLittle Home moved farther than usual overnight.','PipSo breakfast is a puzzle now?','TansyBreakfast is urgently a puzzle now.']};
async function run(dpr,reduced=false){
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:dpr,reducedMotion:reduced?'reduce':'no-preference'});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{try{localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1}))}catch{}});
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>window.LatchlingsCinematics&&window.LatchlingsCinematicGeometry);
 await page.evaluate(()=>{if(window.LatchlingsCinematics.active)window.LatchlingsCinematics.finish(true);window.LatchlingsCinematics.show('opening',{markSeen:false});window.__bubbleMut=[];const stage=document.getElementById('cinematicStage');const wm=new WeakMap();let seq=1;window.__bid=n=>{if(!wm.has(n))wm.set(n,seq++);return wm.get(n)};new MutationObserver(ms=>{for(const m of ms){for(const n of m.addedNodes){if(n.nodeType!==1)continue;for(const b of (n.matches?.('.cin-speech-bubble')?[n]:[...(n.querySelectorAll?.('.cin-speech-bubble')||[])]))window.__bubbleMut.push({t:performance.now(),beat:window.LatchlingsCinematics.beat+1,type:'add',id:window.__bid(b),text:b.textContent.trim()})}for(const n of m.removedNodes){if(n.nodeType!==1)continue;for(const b of (n.matches?.('.cin-speech-bubble')?[n]:[...(n.querySelectorAll?.('.cin-speech-bubble')||[])]))window.__bubbleMut.push({t:performance.now(),beat:window.LatchlingsCinematics.beat+1,type:'remove',id:window.__bid(b),text:b.textContent.trim()})}}}).observe(stage,{subtree:true,childList:true});});
 const runReport={dpr,reduced,beats:[],mutations:[],errors};
 const endBeat=reduced?7:7;
 for(let beat=1;beat<=endBeat;beat++){
   await page.waitForFunction(i=>window.LatchlingsCinematics.beat+1===i,beat);
   await page.waitForTimeout(140);
   const samples=await page.evaluate(async()=>{const out=[];for(let i=0;i<90;i++){await new Promise(r=>requestAnimationFrame(r));out.push([...document.querySelectorAll('#cinematicStage .cin-speech-bubble')].map(b=>{const r=b.getBoundingClientRect(),cs=getComputedStyle(b);return{id:window.__bid(b),text:b.textContent.trim(),x:r.x,y:r.y,w:r.width,h:r.height,opacity:Number(cs.opacity),display:cs.display,visibility:cs.visibility}}))}return out});
   const by=new Map();for(const frame of samples)for(const b of frame){if(!by.has(b.id))by.set(b.id,[]);by.get(b.id).push(b)}
   const metrics=[];for(const [id,arr] of by){const range=k=>Math.max(...arr.map(x=>x[k]))-Math.min(...arr.map(x=>x[k]));metrics.push({id,text:arr[0].text,frames:arr.length,xRange:range('x'),yRange:range('y'),wRange:range('w'),hRange:range('h'),opacityMin:Math.min(...arr.map(x=>x.opacity))})}
   runReport.beats.push({beat,metrics});
   for(const m of metrics){if(m.frames!==90)fail(`DPR ${dpr}${reduced?' reduced':''} beat ${beat} bubble node changed during stable window: ${m.text}`);if(m.xRange>.75||m.yRange>.75||m.wRange>.75||m.hRange>.75)fail(`DPR ${dpr}${reduced?' reduced':''} beat ${beat} geometry moved: ${m.text} ranges ${m.xRange}/${m.yRange}/${m.wRange}/${m.hRange}`);if(m.opacityMin<.99)fail(`DPR ${dpr}${reduced?' reduced':''} beat ${beat} opacity dipped: ${m.text}`)}
   const exp=expected[beat]||[];if(metrics.length!==exp.length)fail(`DPR ${dpr}${reduced?' reduced':''} beat ${beat} expected ${exp.length} bubbles, saw ${metrics.length}`);
   if([2,4,7].includes(beat))await page.screenshot({path:`opening-bubble-stability-audit/dpr${dpr}${reduced?'-reduced':''}-beat${beat}.png`,fullPage:true});
   if(beat<endBeat){await page.click('#cinematicNext');await page.waitForTimeout(90)}
 }
 runReport.mutations=await page.evaluate(()=>window.__bubbleMut);
 for(const [beat,texts] of Object.entries(expected))for(const text of texts){const adds=runReport.mutations.filter(m=>m.beat===Number(beat)&&m.type==='add'&&m.text===text);if(adds.length!==1)fail(`DPR ${dpr}${reduced?' reduced':''} beat ${beat} bubble added ${adds.length} times instead of once: ${text}`)}
 if(errors.length)fail(`DPR ${dpr}${reduced?' reduced':''} page errors: ${errors.join(' | ')}`);
 if(!reduced){await page.evaluate(()=>window.LatchlingsCinematics.finish(true));await page.evaluate(()=>window.LatchlingsCinematics.show('opening',{markSeen:false}));await page.waitForSelector('#cinematicOverlay.show');await page.click('#cinematicSkip');await page.waitForFunction(()=>!document.getElementById('cinematicOverlay').classList.contains('show'));}
 await page.close();return runReport;
}
all.runs.push(await run(1,false));
all.runs.push(await run(3,false));
all.runs.push(await run(3,true));
fs.writeFileSync('opening-bubble-stability-audit/report.json',JSON.stringify(all,null,2));
console.log(JSON.stringify(all,null,2));
await browser.close();
if(!all.accepted)process.exit(1);
