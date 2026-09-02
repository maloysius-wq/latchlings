import { chromium } from 'playwright';

const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
const errors=[];
page.on('console',m=>{if(m.type()==='error')errors.push('console:'+m.text())});
page.on('pageerror',e=>errors.push('pageerror:'+e.message));
page.on('requestfailed',r=>errors.push('request:'+r.url()));

const res=await page.goto('http://127.0.0.1:8130/title-island-concepts/?c=2',{waitUntil:'networkidle'});
if(!res?.ok())throw new Error('Little Home response failed');
await page.waitForTimeout(650);

const sample=async()=>page.evaluate(()=>{
  const a=document.querySelector('#c2.active');
  const rect=s=>{const r=a.querySelector(s).getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
  const island=a.querySelector('.island-model');
  const shadow=a.querySelector('.island-shadow');
  const pebbles=[...a.querySelectorAll('.float-pebble')].map(el=>{const r=el.getBoundingClientRect();const cs=getComputedStyle(el);return {top:r.top,left:r.left,translate:cs.translate,delay:cs.animationDelay,duration:cs.animationDuration}});
  const clouds=[...a.querySelectorAll('.cloud')].map(el=>{const cs=getComputedStyle(el);return {translate:cs.translate,animation:cs.animationName,duration:cs.animationDuration}});
  return {
    bodyWidth:document.body.scrollWidth,
    viewport:innerWidth,
    phone:rect('.phone'),
    islandRect:rect('.island-model'),
    islandTransform:getComputedStyle(island).transform,
    islandAnimation:getComputedStyle(island).animationName,
    shadowRect:rect('.island-shadow'),
    shadowTransform:getComputedStyle(shadow).transform,
    shadowOpacity:getComputedStyle(shadow).opacity,
    pebbles,
    clouds,
    residents:a.querySelectorAll('.resident').length,
    adults:a.querySelectorAll('.resident.adult').length,
    children:a.querySelectorAll('.resident.child').length,
    play:rect('.play'),
    secondary:rect('.secondary')
  };
});

const s0=await sample();
await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/floating-island-renders/little-home-float-phase-1.png`,fullPage:true});
await page.waitForTimeout(1900);
const s1=await sample();
await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/floating-island-renders/little-home-float-phase-2.png`,fullPage:true});
await page.waitForTimeout(1900);
const s2=await sample();
await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/floating-island-renders/little-home-float-phase-3.png`,fullPage:true});

if(s0.bodyWidth>s0.viewport+1)throw new Error(`Horizontal overflow ${s0.bodyWidth}/${s0.viewport}`);
if(s0.phone.left<-1||s0.phone.right>s0.viewport+1||s0.secondary.bottom>s0.phone.bottom+1)throw new Error('Phone/UI bounds failed');
if(s0.residents!==5||s0.adults!==3||s0.children!==2||s0.pebbles.length!==6||s0.clouds.length!==4)throw new Error('Scene structure mismatch '+JSON.stringify(s0));
if(!s0.islandAnimation.includes('littleHomeIslandFloat'))throw new Error('Island float animation missing');

const islandTops=[s0.islandRect.top,s1.islandRect.top,s2.islandRect.top];
const islandRange=Math.max(...islandTops)-Math.min(...islandTops);
if(islandRange<1.4||islandRange>6.5)throw new Error(`Island bob range unexpected: ${islandRange} from ${JSON.stringify(islandTops)}`);

const shadowTops=[s0.shadowRect.top,s1.shadowRect.top,s2.shadowRect.top];
const shadowRange=Math.max(...shadowTops)-Math.min(...shadowTops);
if(shadowRange>2.4)throw new Error(`Shadow is not visually anchored enough: ${shadowRange} from ${JSON.stringify(shadowTops)}`);

const initialPebbleTranslations=new Set(s0.pebbles.map(p=>p.translate));
if(initialPebbleTranslations.size<3)throw new Error('Pebbles are too synchronized at initial sample');
for(let i=0;i<6;i++){
  const vals=[s0.pebbles[i].translate,s1.pebbles[i].translate,s2.pebbles[i].translate];
  if(vals.every(v=>v===vals[0]))throw new Error(`Pebble ${i+1} did not animate: ${JSON.stringify(vals)}`);
  if(s0.pebbles[i].duration!=='7.6s')throw new Error(`Pebble ${i+1} duration mismatch: ${s0.pebbles[i].duration}`);
}

for(let i=0;i<4;i++){
  if(!s0.clouds[i].animation.includes('littleHomeCloudDrift'))throw new Error(`Cloud ${i} lost drift animation`);
}
const cloudChanged=s0.clouds.filter((c,i)=>c.translate!==s2.clouds[i].translate).length;
if(cloudChanged<3)throw new Error(`Cloud motion not observed strongly enough: ${cloudChanged}/4 changed`);

for(const p of s0.pebbles){
  if(p.top>=s0.play.top-28)throw new Error(`Pebble crowds Play control: ${JSON.stringify(p)}`);
  if(p.left<s0.phone.left-4||p.left>s0.phone.right+4)throw new Error(`Pebble escaped phone bounds: ${JSON.stringify(p)}`);
}
if(errors.length)throw new Error(errors.join(' | '));
console.log('FLOATING_ISLAND_BROWSER_OK',JSON.stringify({islandTops,islandRange,shadowTops,shadowRange,pebbleInitial:[...initialPebbleTranslations],cloudChanged}));

for(const id of [1,3]){
  const p=await browser.newPage({viewport:{width:390,height:844}});
  const localErrors=[];
  p.on('pageerror',e=>localErrors.push(e.message));
  p.on('requestfailed',r=>localErrors.push(r.url()));
  await p.goto(`http://127.0.0.1:8130/title-island-concepts/?c=${id}`,{waitUntil:'networkidle'});
  const sanity=await p.evaluate(()=>{
    const a=document.querySelector('.concept.active');
    const island=a?.querySelector('.island-model');
    return {active:a?.id,count:a?.querySelectorAll('.latchling').length,pebbles:a?.querySelectorAll('.float-pebble').length,animation:island?getComputedStyle(island).animationName:'',overflow:document.body.scrollWidth-innerWidth};
  });
  const expected=id===1?6:7;
  if(sanity.active!==`c${id}`||sanity.count!==expected||sanity.pebbles!==0||sanity.animation.includes('littleHomeIslandFloat')||sanity.overflow>1||localErrors.length)throw new Error(`Concept ${id} sanity failed ${JSON.stringify({sanity,localErrors})}`);
  await p.close();
}

await browser.close();
