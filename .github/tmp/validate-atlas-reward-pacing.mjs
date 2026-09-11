import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE='http://127.0.0.1:4173';
const outDir='atlas-reward-pacing-audit';
fs.mkdirSync(outDir,{recursive:true});
const report={accepted:true,failures:[],scenarios:[]};
const fail=(msg)=>{report.accepted=false;report.failures.push(msg)};
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));

async function preparePage(browser,{level,unlocked,reduced=false}){
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,reducedMotion:reduced?'reduce':'no-preference'});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(BASE,{waitUntil:'networkidle'});
  await page.evaluate(({level,unlocked})=>{
    localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked,stars:{[String(level)]:3}}));
    localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1,'across-drift':1,'old-maps':1,homeward:1}));
  },{level,unlocked});
  await page.reload({waitUntil:'networkidle'});
  await page.evaluate((level)=>window.startLevel(level),level);
  await page.waitForSelector('#game.active');
  await page.waitForTimeout(520);
  await page.evaluate(()=>{
    document.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));
    if(window.LatchlingsMusic)window.LatchlingsMusic.sync(true);
  });
  await page.waitForTimeout(120);
  return {context,page,errors};
}

async function runScenario(browser,{name,from,to,unlocked,kind,reduced=false,expectedTrack='1',destinationTrack=null}){
  const {context,page,errors}=await preparePage(browser,{level:from,unlocked,reduced});
  const result={name,from,to,reduced,kind,errors,travelers:[],trackSamples:[],events:[]};
  const startTrack=await page.evaluate(()=>window.LatchlingsMusic?.requested());
  result.startTrack=startTrack;
  if(startTrack!==expectedTrack)fail(`${name}: expected starting music ${expectedTrack}, got ${startTrack}`);

  await page.evaluate(()=>{
    window.__atlasPacingAudit={start:performance.now(),events:[],travelerSeq:0,trackSamples:[]};
    const audit=window.__atlasPacingAudit;
    const seen=new WeakSet();
    const captureToken=(token)=>{
      if(seen.has(token))return;seen.add(token);
      requestAnimationFrame(()=>{
        const anim=token.getAnimations()[0];
        audit.events.push({type:'traveler',t:performance.now()-audit.start,duration:anim?Number(anim.effect.getTiming().duration):null});
      });
    };
    document.querySelectorAll('.atlas-travel-token').forEach(captureToken);
    audit.mo=new MutationObserver(ms=>{
      for(const m of ms){
        for(const n of m.addedNodes){
          if(!(n instanceof Element))continue;
          if(n.matches?.('.atlas-travel-token'))captureToken(n);
          n.querySelectorAll?.('.atlas-travel-token').forEach(captureToken);
          if(n.matches?.('.atlas-reward-banner.arrival')||n.querySelector?.('.atlas-reward-banner.arrival'))audit.events.push({type:'arrival-banner',t:performance.now()-audit.start});
        }
      }
    });
    audit.mo.observe(document.getElementById('app'),{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
    audit.timer=setInterval(()=>{
      const levels=document.getElementById('levels');
      audit.trackSamples.push({t:performance.now()-audit.start,requested:window.LatchlingsMusic?.requested(),current:window.LatchlingsMusic?.current(),fade:window.LatchlingsMusic?.fadeDuration(),atlas:window.LatchlingsMusic?.atlasRewardActive(),screen:document.body.dataset.screen,level:document.getElementById('levelTitle')?.textContent,classes:levels?.className||''});
    },25);
  });

  const t0=Date.now();
  await page.evaluate(({from,to})=>{window.queueAtlasReward(from,to,3);window.playQueuedAtlasReward(true)},{from,to});
  await page.waitForSelector('#levels.active');
  await page.screenshot({path:`${outDir}/${name}-atlas-start.png`,fullPage:true});
  await page.waitForFunction((to)=>document.querySelector('#game.active') && document.getElementById('levelTitle')?.textContent.includes(`Level ${to}`),to,{timeout:9000});
  result.elapsedMs=Date.now()-t0;
  await page.waitForTimeout(120);
  const audit=await page.evaluate(()=>{
    clearInterval(window.__atlasPacingAudit.timer);
    window.__atlasPacingAudit.mo.disconnect();
    return {events:window.__atlasPacingAudit.events,trackSamples:window.__atlasPacingAudit.trackSamples};
  });
  result.events=audit.events;
  result.trackSamples=audit.trackSamples;
  result.travelers=audit.events.filter(e=>e.type==='traveler');
  await page.screenshot({path:`${outDir}/${name}-next-level.png`,fullPage:true});

  const titleSamples=result.trackSamples.filter(s=>s.requested==='title');
  if(titleSamples.length)fail(`${name}: title music was requested during Atlas reward/auto-advance at ${titleSamples[0].t.toFixed(0)}ms`);
  const atlasFadeSamples=result.trackSamples.filter(s=>s.atlas);
  if(!reduced && atlasFadeSamples.some(s=>s.fade!==612))fail(`${name}: reward-specific fade was not 612ms throughout Atlas reward`);

  if(!reduced){
    if(kind==='same'){
      if(result.travelers.length!==1)fail(`${name}: expected 1 traveler, saw ${result.travelers.length}`);
      const d=result.travelers[0]?.duration;
      if(Math.abs(d-2006)>2)fail(`${name}: expected 2006ms traveler duration, got ${d}`);
      if(result.elapsedMs<3700||result.elapsedMs>4300)fail(`${name}: expected ~3.9s reward+auto advance, got ${result.elapsedMs}ms`);
      if(result.trackSamples.some(s=>s.requested!==expectedTrack))fail(`${name}: same-chapter reward changed away from chapter ${expectedTrack}`);
    } else {
      if(result.travelers.length!==2)fail(`${name}: expected 2 traveler legs, saw ${result.travelers.length}`);
      const ds=result.travelers.map(x=>x.duration);
      if(Math.abs((ds[0]??0)-1224)>2||Math.abs((ds[1]??0)-1598)>2)fail(`${name}: expected traveler legs 1224/1598ms, got ${ds.join('/')}`);
      if(result.elapsedMs<5050||result.elapsedMs>5650)fail(`${name}: expected ~5.3s cross reward+auto advance, got ${result.elapsedMs}ms`);
      if(destinationTrack){
        const firstDest=result.trackSamples.find(s=>s.requested===destinationTrack);
        if(!firstDest)fail(`${name}: destination chapter music ${destinationTrack} was never requested`);
        else if(firstDest.t<1350)fail(`${name}: destination music changed too early at ${firstDest.t.toFixed(0)}ms`);
        const bad=result.trackSamples.filter(s=>![expectedTrack,destinationTrack].includes(s.requested));
        if(bad.length)fail(`${name}: unexpected track ${bad[0].requested} requested`);
      } else if(result.trackSamples.some(s=>s.requested!==expectedTrack))fail(`${name}: cross-waypoint same-chapter reward changed music unexpectedly`);
    }
  } else {
    if(result.elapsedMs>1600)fail(`${name}: reduced-motion reward should remain prompt, got ${result.elapsedMs}ms`);
  }
  if(errors.length)fail(`${name}: page errors: ${errors.join(' | ')}`);
  report.scenarios.push(result);
  await context.close();
}

const browser=await chromium.launch({headless:true});
try{
  await runScenario(browser,{name:'same-range-1-to-2',from:1,to:2,unlocked:2,kind:'same',expectedTrack:'1'});
  await runScenario(browser,{name:'cross-waypoint-10-to-11',from:10,to:11,unlocked:11,kind:'cross',expectedTrack:'1'});
  await runScenario(browser,{name:'cross-chapter-50-to-51',from:50,to:51,unlocked:51,kind:'cross',expectedTrack:'1',destinationTrack:'2'});
  await runScenario(browser,{name:'reduced-motion-1-to-2',from:1,to:2,unlocked:2,kind:'same',expectedTrack:'1',reduced:true});
} finally { await browser.close(); }
fs.writeFileSync(`${outDir}/report.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if(!report.accepted)process.exit(1);
