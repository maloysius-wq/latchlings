import { chromium } from 'playwright';
import fs from 'node:fs';

const base='http://127.0.0.1:4173/title-island-concepts/?c=2&embed=1&v=validator';
const out='discrete-adult-movement-audit';
fs.mkdirSync(out,{recursive:true});

const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});
const page=await context.newPage();
const pageErrors=[];
page.on('pageerror',e=>pageErrors.push(String(e)));
await page.goto(base,{waitUntil:'networkidle'});
await page.waitForSelector('#c2 .resident.adult');

const initial=await page.evaluate(()=>({
  adults:[...document.querySelectorAll('#c2 .resident.adult')].map(a=>({
    activity:a.dataset.activity,
    state:a.dataset.motionState,
    moveCount:Number(a.dataset.moveCount||0),
    routeIndex:Number(a.dataset.routeIndex||0),
    overflow:getComputedStyle(a).overflow,
    animationName:getComputedStyle(a).animationName
  })),
  children:[...document.querySelectorAll('#c2 .resident.child')].map(a=>getComputedStyle(a).animationName)
}));

if(initial.adults.length!==3) throw new Error(`expected 3 adults, got ${initial.adults.length}`);
if(initial.adults.some(a=>a.state!=='idle'||a.moveCount!==0||a.routeIndex!==0)) throw new Error(`bad initial adult state ${JSON.stringify(initial.adults)}`);
if(initial.adults.some(a=>a.overflow!=='visible')) throw new Error(`prop overflow regressed ${JSON.stringify(initial.adults)}`);
if(initial.adults.some(a=>a.animationName!=='none')) throw new Error(`adult CSS burst animation still active ${JSON.stringify(initial.adults)}`);
if(!initial.children.some(n=>n.includes('littleHomeKidOne'))||!initial.children.some(n=>n.includes('littleHomeKidTwo'))) throw new Error(`child choreography changed ${JSON.stringify(initial.children)}`);

await page.evaluate(()=>{
  window.__adultMotionEvents=[];
  const now=()=>performance.now();
  for(const adult of document.querySelectorAll('#c2 .resident.adult')){
    new MutationObserver(()=>{
      const state=adult.dataset.motionState;
      const moving=[...document.querySelectorAll('#c2 .resident.adult')].filter(a=>a.dataset.motionState==='moving').length;
      window.__adultMotionEvents.push({
        t:now(),
        activity:adult.dataset.activity,
        state,
        moving,
        moveCount:Number(adult.dataset.moveCount||0),
        routeIndex:Number(adult.dataset.routeIndex||0),
        transform:getComputedStyle(adult).transform
      });
    }).observe(adult,{attributes:true,attributeFilter:['data-motion-state']});
  }
});

await page.waitForFunction(()=>{
  const ev=window.__adultMotionEvents||[];
  const starts=ev.filter(e=>e.state==='moving');
  const finishes=ev.filter(e=>e.state==='idle'&&e.moveCount>0);
  return starts.length>=3 && finishes.length>=3 && [...document.querySelectorAll('#c2 .resident.adult')].every(a=>a.dataset.motionState==='idle');
},{timeout:38000});

const result=await page.evaluate(()=>({
  events:window.__adultMotionEvents,
  adults:[...document.querySelectorAll('#c2 .resident.adult')].map(a=>({
    activity:a.dataset.activity,
    state:a.dataset.motionState,
    moveCount:Number(a.dataset.moveCount||0),
    routeIndex:Number(a.dataset.routeIndex||0),
    transform:getComputedStyle(a).transform,
    prop:getComputedStyle(a,'::after').cssText
  })),
  root:{nextMoveMs:document.querySelector('#c2').dataset.nextAdultMoveMs||'',active:document.querySelector('#c2').dataset.activeAdult||''}
}));

const starts=result.events.filter(e=>e.state==='moving').slice(0,3);
const finishes=result.events.filter(e=>e.state==='idle'&&e.moveCount>0).slice(0,3);
if(starts.length<3||finishes.length<3) throw new Error(`not enough movement events ${JSON.stringify(result.events)}`);
if(starts.some(e=>e.moving!==1)) throw new Error(`overlapping adult movement detected ${JSON.stringify(starts)}`);
const startActivities=starts.map(e=>e.activity);
if(new Set(startActivities).size!==3) throw new Error(`first three turns must cover all adults once: ${JSON.stringify(startActivities)}`);
if(starts.some(e=>e.moveCount!==1||e.routeIndex!==1)) throw new Error(`first turn advanced more than one waypoint ${JSON.stringify(starts)}`);

const durations=[];
const gaps=[];
for(let i=0;i<3;i++){
  const finish=finishes.find(e=>e.activity===starts[i].activity&&e.t>starts[i].t);
  if(!finish) throw new Error(`missing finish for ${starts[i].activity}`);
  durations.push(finish.t-starts[i].t);
  if(i<2){
    const next=starts[i+1];
    gaps.push(next.t-finish.t);
  }
}
if(durations.some(ms=>ms<650||ms>1350)) throw new Error(`single-step duration outside expected range ${JSON.stringify(durations)}`);
if(gaps.some(ms=>ms<3850||ms>10250)) throw new Error(`quiet gap outside 4-10 second contract ${JSON.stringify(gaps)}`);
if(result.adults.some(a=>a.moveCount!==1||a.routeIndex!==1||a.state!=='idle')) throw new Error(`adult should have exactly one completed waypoint after first rotation ${JSON.stringify(result.adults)}`);
if(result.root.active!=='') throw new Error(`active adult not cleared: ${JSON.stringify(result.root)}`);
if(pageErrors.length) throw new Error(`page errors: ${pageErrors.join(' | ')}`);

await page.screenshot({path:`${out}/after-three-discrete-moves.png`,fullPage:true});

const reduced=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,reducedMotion:'reduce'});
const reducedPage=await reduced.newPage();
await reducedPage.goto(base+'&reduced=1',{waitUntil:'networkidle'});
await reducedPage.waitForSelector('#c2 .resident.adult');
await reducedPage.waitForTimeout(10500);
const reducedState=await reducedPage.evaluate(()=>[...document.querySelectorAll('#c2 .resident.adult')].map(a=>({state:a.dataset.motionState,moveCount:Number(a.dataset.moveCount||0),routeIndex:Number(a.dataset.routeIndex||0),transform:getComputedStyle(a).transform})));
if(reducedState.some(a=>a.moveCount!==0||a.routeIndex!==0||a.state!=='idle')) throw new Error(`reduced motion adult moved ${JSON.stringify(reducedState)}`);
await reduced.close();

const report={accepted:true,starts,finishes,durationsMs:durations,gapsMs:gaps,adults:result.adults,reducedState,pageErrors};
fs.writeFileSync(`${out}/report.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();
