import { chromium } from 'playwright';

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
const errors=[];
page.on('console',m=>{if(m.type()==='error')errors.push('console:'+m.text())});
page.on('pageerror',e=>errors.push('pageerror:'+e.message));
page.on('requestfailed',r=>errors.push('request:'+r.url()));

await page.addInitScript(()=>{
  window.__adultStates={};
  window.__adultObserverReady=false;
  window.addEventListener('DOMContentLoaded',()=>{
    const adults=[...document.querySelectorAll('#c2 .resident.adult')];
    adults.forEach((el,i)=>{
      const key=el.dataset.activity||String(i);
      window.__adultStates[key]=new Set([el.dataset.motionState||'unknown']);
      const observer=new MutationObserver(()=>window.__adultStates[key].add(el.dataset.motionState||'unknown'));
      observer.observe(el,{attributes:true,attributeFilter:['data-motion-state']});
    });
    window.__adultObserverReady=true;
  },{once:true});
});

const res=await page.goto('http://127.0.0.1:8128/title-island-concepts/?c=2',{waitUntil:'networkidle'});
if(!res?.ok())throw new Error('Little Home response failed');
await page.waitForFunction(()=>window.__adultObserverReady===true);
await page.waitForTimeout(500);

const snap=async()=>page.evaluate(()=>{
  const a=document.querySelector('#c2.active');
  const adults=[...a.querySelectorAll('.resident.adult')].map(el=>({
    activity:el.dataset.activity,
    state:el.dataset.motionState,
    moves:Number(el.dataset.moveCount||0),
    next:Number(el.dataset.nextMoveMs||0),
    outing:el.classList.contains('adult-outing'),
    animation:getComputedStyle(el).animationName,
    duration:getComputedStyle(el).animationDuration,
    faceAnimation:getComputedStyle(el.querySelector('.face')).animationName,
    eyeAnimation:getComputedStyle(el.querySelector('.eyes')).animationName
  }));
  const kids=[...a.querySelectorAll('.resident.child')].map(el=>({animation:getComputedStyle(el).animationName,duration:getComputedStyle(el).animationDuration}));
  return {bodyWidth:document.body.scrollWidth,viewport:innerWidth,adults,kids,residents:a.querySelectorAll('.resident').length,flowers:a.querySelectorAll('.flower').length,clouds:a.querySelectorAll('.cloud').length,deck:a.querySelectorAll('.deck').length,fence:a.querySelectorAll('.fence').length};
});

const s0=await snap();
await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/random-adult-renders/little-home-random-adults-phase-1.png`,fullPage:true});
await page.waitForTimeout(5200);
const s1=await snap();
await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/random-adult-renders/little-home-random-adults-phase-2.png`,fullPage:true});
await page.waitForTimeout(7600);
const s2=await snap();
await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/random-adult-renders/little-home-random-adults-phase-3.png`,fullPage:true});
const observed=await page.evaluate(()=>Object.fromEntries(Object.entries(window.__adultStates).map(([k,v])=>[k,[...v]])));

if(s0.bodyWidth>s0.viewport+1)throw new Error(`Horizontal overflow ${s0.bodyWidth}/${s0.viewport}`);
if(s0.residents!==5||s0.adults.length!==3||s0.kids.length!==2)throw new Error('Resident structure mismatch '+JSON.stringify(s0));
if(s0.flowers!==3||s0.clouds!==4||s0.deck!==0||s0.fence!==0)throw new Error('Scene polish regression '+JSON.stringify(s0));
for(const adult of s2.adults){
  if(adult.moves<1)throw new Error(`Adult ${adult.activity} never completed a scheduled outing: ${JSON.stringify(adult)}`);
  const states=observed[adult.activity]||[];
  if(!states.includes('idle')||!states.includes('moving'))throw new Error(`Adult ${adult.activity} did not enter both idle/moving states: ${JSON.stringify(states)}`);
}
const idleAdults=[...s0.adults,...s1.adults,...s2.adults].filter(a=>a.state==='idle');
if(!idleAdults.length)throw new Error('No sampled adult idle states');
for(const adult of idleAdults.slice(0,3)){
  if(!adult.faceAnimation.includes('faceFloat')||!adult.eyeAnimation.includes('blinkCycle'))throw new Error(`Face/blink stopped while adult idle: ${JSON.stringify(adult)}`);
}
for(const kid of s0.kids){
  if(!kid.animation.includes('littleHomeKid')||kid.duration!=='6.1s')throw new Error(`Kid animation changed: ${JSON.stringify(kid)}`);
}
if(errors.length)throw new Error(errors.join(' | '));
console.log('RANDOM_ADULT_BROWSER_OK',JSON.stringify({observed,s0:s0.adults,s1:s1.adults,s2:s2.adults}));

for(const id of [1,3]){
  const p=await browser.newPage({viewport:{width:390,height:844}});
  const local=[];
  p.on('pageerror',e=>local.push(e.message));
  p.on('requestfailed',r=>local.push(r.url()));
  await p.goto(`http://127.0.0.1:8128/title-island-concepts/?c=${id}`,{waitUntil:'networkidle'});
  const sanity=await p.evaluate(()=>({active:document.querySelector('.concept.active')?.id,count:document.querySelector('.concept.active')?.querySelectorAll('.latchling').length,overflow:document.body.scrollWidth-innerWidth}));
  const expected=id===1?6:7;
  if(sanity.active!==`c${id}`||sanity.count!==expected||sanity.overflow>1||local.length)throw new Error(`Concept ${id} sanity failed ${JSON.stringify({sanity,local})}`);
  await p.close();
}

await browser.close();
