import { chromium } from 'playwright';

const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
const errors=[];
page.on('console',m=>{if(m.type()==='error')errors.push('console:'+m.text())});
page.on('pageerror',e=>errors.push('pageerror:'+e.message));
page.on('requestfailed',r=>errors.push('request:'+r.url()));

const res=await page.goto('http://127.0.0.1:8126/title-island-concepts/?c=2',{waitUntil:'networkidle'});
if(!res?.ok())throw new Error('Little Home response failed');
await page.waitForTimeout(650);

const sample=async()=>page.evaluate(()=>{
  const a=document.querySelector('#c2.active');
  const box=s=>{const r=a.querySelector(s).getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,w:r.width,h:r.height}};
  const clouds=[...a.querySelectorAll('.cloud')].map(el=>({
    box:(()=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom}})(),
    translate:getComputedStyle(el).translate,
    animation:getComputedStyle(el).animationName
  }));
  return {
    bodyWidth:document.body.scrollWidth,
    viewport:innerWidth,
    phone:box('.phone'),
    island:box('.island-top'),
    rock:box('.rock.r1'),
    play:box('.play'),
    secondary:box('.secondary'),
    clouds,
    deck:a.querySelectorAll('.deck').length,
    residents:a.querySelectorAll('.resident').length,
    children:a.querySelectorAll('.resident.child').length,
    imgs:a.querySelectorAll('img').length
  };
});

const s0=await sample();
await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/cloud-renders/little-home-clouds-phase-1.png`,fullPage:true});
await page.waitForTimeout(1700);
const s1=await sample();
await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/cloud-renders/little-home-clouds-phase-2.png`,fullPage:true});
await page.waitForTimeout(1700);
const s2=await sample();
await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/cloud-renders/little-home-clouds-phase-3.png`,fullPage:true});

if(s0.bodyWidth>s0.viewport+1)throw new Error(`Horizontal overflow ${s0.bodyWidth}/${s0.viewport}`);
if(s0.phone.left<-1||s0.phone.right>s0.viewport+1||s0.secondary.bottom>s0.phone.bottom+1)throw new Error('Phone/UI bounds failed');
if(s0.deck!==0||s0.residents!==6||s0.children!==2||s0.clouds.length!==4||s0.imgs!==0)throw new Error('Structure mismatch '+JSON.stringify(s0));
if(s0.rock.left < s0.island.left+30 || s0.rock.right > s0.island.right-25)throw new Error(`Rock still crowds island edge: ${JSON.stringify({rock:s0.rock,island:s0.island})}`);
for(let i=0;i<4;i++){
  if(!s0.clouds[i].animation.includes('littleHomeCloudDrift'))throw new Error(`Cloud ${i} lacks drift animation`);
  const vals=[s0.clouds[i].translate,s1.clouds[i].translate,s2.clouds[i].translate];
  if(vals.every(v=>v===vals[0]))throw new Error(`Cloud ${i} did not visibly animate: ${JSON.stringify(vals)}`);
}
if(errors.length)throw new Error(errors.join(' | '));
console.log('CLOUD_BROWSER_OK',JSON.stringify({rock:s0.rock,island:s0.island,clouds:s0.clouds.map(c=>c.translate),cloudsLater:s2.clouds.map(c=>c.translate)}));

for(const id of [1,3]){
  const p=await browser.newPage({viewport:{width:390,height:844}});
  const localErrors=[];
  p.on('pageerror',e=>localErrors.push(e.message));
  p.on('requestfailed',r=>localErrors.push(r.url()));
  await p.goto(`http://127.0.0.1:8126/title-island-concepts/?c=${id}`,{waitUntil:'networkidle'});
  const sanity=await p.evaluate(()=>({active:document.querySelector('.concept.active')?.id,count:document.querySelector('.concept.active')?.querySelectorAll('.latchling').length,overflow:document.body.scrollWidth-innerWidth}));
  const expected=id===1?6:7;
  if(sanity.active!==`c${id}`||sanity.count!==expected||sanity.overflow>1||localErrors.length)throw new Error(`Concept ${id} sanity failed ${JSON.stringify({sanity,localErrors})}`);
  await p.close();
}

await browser.close();
