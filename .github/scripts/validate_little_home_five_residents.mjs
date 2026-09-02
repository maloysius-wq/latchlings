import { chromium } from 'playwright';

const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
const errors=[];
page.on('console',m=>{if(m.type()==='error')errors.push('console:'+m.text())});
page.on('pageerror',e=>errors.push('pageerror:'+e.message));
page.on('requestfailed',r=>errors.push('request:'+r.url()));

const res=await page.goto('http://127.0.0.1:8127/title-island-concepts/?c=2',{waitUntil:'networkidle'});
if(!res?.ok()) throw new Error('Little Home response failed');
await page.waitForTimeout(650);

const sample=async()=>page.evaluate(()=>{
  const a=document.querySelector('#c2.active');
  const box=s=>{const r=a.querySelector(s).getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,w:r.width,h:r.height}};
  const blue=a.querySelector('.flower.blue.f3');
  return {
    bodyWidth:document.body.scrollWidth,
    viewport:innerWidth,
    phone:box('.phone'),
    island:box('.island-top'),
    tree:box('.little-home-tree'),
    cottage:box('.cottage'),
    blueFlower:box('.flower.blue.f3'),
    bluePetals:getComputedStyle(blue,'::after').backgroundImage,
    residents:a.querySelectorAll('.resident').length,
    adults:a.querySelectorAll('.resident.adult').length,
    children:a.querySelectorAll('.resident.child').length,
    homeAdults:a.querySelectorAll('.resident.life-home').length,
    garden:a.querySelectorAll('.resident.life-garden').length,
    parcel:a.querySelectorAll('.resident.life-parcel').length,
    treeAdult:a.querySelectorAll('.resident.life-tree').length,
    flowers:a.querySelectorAll('.flower').length,
    clouds:a.querySelectorAll('.cloud').length,
    deck:a.querySelectorAll('.deck').length,
    fence:a.querySelectorAll('.fence').length,
    imgs:a.querySelectorAll('img').length,
    label:a.querySelector('.label span')?.textContent || '',
    variant:a.querySelector('.variant-note')?.textContent || ''
  };
});

const s0=await sample();
await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/five-resident-renders/little-home-five-phase-1.png`,fullPage:true});
await page.waitForTimeout(1900);
await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/five-resident-renders/little-home-five-phase-2.png`,fullPage:true});
await page.waitForTimeout(1900);
await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/five-resident-renders/little-home-five-phase-3.png`,fullPage:true});

if(s0.bodyWidth>s0.viewport+1) throw new Error(`Horizontal overflow ${s0.bodyWidth}/${s0.viewport}`);
if(s0.phone.left<-1||s0.phone.right>s0.viewport+1) throw new Error('Phone clipped');
if(s0.residents!==5||s0.adults!==3||s0.children!==2||s0.homeAdults!==0) throw new Error('Resident split mismatch '+JSON.stringify(s0));
if(s0.garden!==1||s0.parcel!==1||s0.treeAdult!==1) throw new Error('Remaining adult routines changed');
if(s0.flowers!==3||!s0.bluePetals.includes('114, 174, 245')) throw new Error('Blue flower rendering missing '+JSON.stringify({flowers:s0.flowers,bluePetals:s0.bluePetals}));
if(s0.blueFlower.left < s0.tree.right+4 || s0.blueFlower.right > s0.cottage.left-20) throw new Error('Blue flower placement crowds tree/cottage '+JSON.stringify({flower:s0.blueFlower,tree:s0.tree,cottage:s0.cottage}));
if(s0.blueFlower.top < s0.island.top-2 || s0.blueFlower.bottom > s0.island.bottom+2) throw new Error('Blue flower sits outside island top');
if(s0.clouds!==4||s0.deck!==0||s0.fence!==0||s0.imgs!==0) throw new Error('Scene regression '+JSON.stringify(s0));
if(!s0.label.includes('five-Latchling')||!s0.variant.includes('five-resident')) throw new Error('Preview copy not updated');
if(errors.length) throw new Error(errors.join(' | '));
console.log('FIVE_RESIDENT_BROWSER_OK',JSON.stringify({residents:s0.residents,adults:s0.adults,children:s0.children,flowers:s0.flowers,blueFlower:s0.blueFlower}));

for(const id of [1,3]){
  const p=await browser.newPage({viewport:{width:390,height:844}});
  const localErrors=[];
  p.on('pageerror',e=>localErrors.push(e.message));
  p.on('requestfailed',r=>localErrors.push(r.url()));
  await p.goto(`http://127.0.0.1:8127/title-island-concepts/?c=${id}`,{waitUntil:'networkidle'});
  const sanity=await p.evaluate(()=>({active:document.querySelector('.concept.active')?.id,count:document.querySelector('.concept.active')?.querySelectorAll('.latchling').length,overflow:document.body.scrollWidth-innerWidth}));
  const expected=id===1?6:7;
  if(sanity.active!==`c${id}`||sanity.count!==expected||sanity.overflow>1||localErrors.length) throw new Error(`Concept ${id} sanity failed ${JSON.stringify({sanity,localErrors})}`);
  await p.close();
}

await browser.close();
