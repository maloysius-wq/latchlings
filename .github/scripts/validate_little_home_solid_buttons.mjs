import { chromium } from 'playwright';

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
const errors=[];
page.on('console',m=>{if(m.type()==='error')errors.push('console:'+m.text())});
page.on('pageerror',e=>errors.push('pageerror:'+e.message));
page.on('requestfailed',r=>errors.push('request:'+r.url()));
const res=await page.goto('http://127.0.0.1:8137/title-island-concepts/?c=2',{waitUntil:'networkidle'});
if(!res?.ok()) throw new Error('Little Home failed to load');
await page.waitForTimeout(700);
const data=await page.evaluate(()=>{
  const a=document.querySelector('#c2.active');
  const box=s=>{const r=a.querySelector(s).getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
  const styles=[a.querySelector('.play'),...a.querySelectorAll('.secondary button')].map(el=>{
    const s=getComputedStyle(el);
    return {backgroundColor:s.backgroundColor,backgroundImage:s.backgroundImage,borderRadius:s.borderRadius,clipPath:s.clipPath};
  });
  return {bodyWidth:document.body.scrollWidth,viewport:innerWidth,phone:box('.phone'),play:box('.play'),secondary:[...a.querySelectorAll('.secondary button')].map(el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}}),island:box('.island-model'),styles,labels:['Play',...a.querySelectorAll('.secondary strong')].map((x,i)=>i===0?x:x.textContent.trim()),residents:a.querySelectorAll('.resident').length,pebbles:a.querySelectorAll('.float-pebble').length,clouds:a.querySelectorAll('.cloud').length};
});
await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/solid-button-renders/little-home-solid-buttons.png`,fullPage:true});
if(data.bodyWidth>data.viewport+1) throw new Error(`Horizontal overflow ${data.bodyWidth}/${data.viewport}`);
for(const b of [data.play,...data.secondary]) if(b.left<data.phone.left-1||b.right>data.phone.right+1||b.top<data.phone.top-1||b.bottom>data.phone.bottom+1) throw new Error('Control outside phone '+JSON.stringify(b));
if(data.play.bottom>=Math.min(...data.secondary.map(b=>b.top))) throw new Error('Play overlaps secondary controls');
if(data.island.bottom>data.play.top-8) throw new Error('Island crowds Play control');
for(const s of data.styles){
  if(s.backgroundColor!=='rgb(245, 222, 172)') throw new Error('Wrong button color '+JSON.stringify(s));
  if(s.backgroundImage!=='none') throw new Error('Button still has patterned/gradient background '+JSON.stringify(s));
  if(!['22px','20px'].includes(s.borderRadius)) throw new Error('Rounded shape changed '+JSON.stringify(s));
  if(s.clipPath!=='none') throw new Error('Unexpected clip path '+JSON.stringify(s));
}
if(data.residents!==5||data.pebbles!==6||data.clouds!==4) throw new Error('Scene structure changed '+JSON.stringify(data));
if(errors.length) throw new Error(errors.join(' | '));
for(const id of [1,3]){
  const p=await browser.newPage({viewport:{width:390,height:844}});
  await p.goto(`http://127.0.0.1:8137/title-island-concepts/?c=${id}`,{waitUntil:'networkidle'});
  const inherited=await p.evaluate(()=>{const a=document.querySelector('.concept.active'); return [...a.querySelectorAll('.play,.secondary button')].some(el=>getComputedStyle(el).backgroundColor==='rgb(245, 222, 172)')});
  if(inherited) throw new Error(`Concept ${id} inherited Little Home solid treatment`);
  await p.close();
}
console.log('SOLID_BUTTON_BROWSER_OK',JSON.stringify(data));
await browser.close();
