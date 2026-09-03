import { chromium } from 'playwright';

const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
const errors=[];
page.on('console',m=>{if(m.type()==='error')errors.push('console:'+m.text())});
page.on('pageerror',e=>errors.push('pageerror:'+e.message));
page.on('requestfailed',r=>errors.push('request:'+r.url()));

const res=await page.goto('http://127.0.0.1:8132/title-island-concepts/?c=2',{waitUntil:'networkidle'});
if(!res?.ok()) throw new Error('Little Home response failed');
await page.waitForTimeout(900);

const state=await page.evaluate(()=>{
  const c2=document.querySelector('#c2.active');
  const box=s=>{const r=c2.querySelector(s).getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
  const spans=[...c2.querySelectorAll('.toy-logo span')].map(el=>({text:el.textContent,transform:getComputedStyle(el).transform,fontSize:getComputedStyle(el).fontSize,color:getComputedStyle(el).color,stroke:getComputedStyle(el).webkitTextStrokeWidth}));
  const play=getComputedStyle(c2.querySelector('.play'));
  return {
    phone:box('.phone'),
    topline:box('.topline'),
    logo:box('.toy-logo'),
    tagline:box('.toy-tagline'),
    scene:box('.scene'),
    play:box('.play'),
    secondary:box('.secondary'),
    spans,
    logoText:c2.querySelector('.toy-logo')?.getAttribute('aria-label'),
    taglineText:c2.querySelector('.toy-tagline')?.textContent.trim(),
    residentCount:c2.querySelectorAll('.resident').length,
    adultCount:c2.querySelectorAll('.resident.adult').length,
    childCount:c2.querySelectorAll('.resident.child').length,
    pebbleCount:c2.querySelectorAll('.float-pebble').length,
    cloudCount:c2.querySelectorAll('.cloud').length,
    playBg:play.backgroundColor,
    playBgImage:play.backgroundImage,
    bodyWidth:document.body.scrollWidth,
    viewport:innerWidth
  };
});

if(state.bodyWidth>state.viewport+1) throw new Error(`Horizontal overflow ${state.bodyWidth}/${state.viewport}`);
if(state.logoText!=='Latchlings') throw new Error('Logo aria label changed');
if(state.taglineText!=='Small friends. Smart puzzles.') throw new Error(`Unexpected tagline ${state.taglineText}`);
if(state.spans.length!==10 || state.spans.map(x=>x.text).join('')!=='Latchlings') throw new Error('Toy letter structure invalid');
if(state.logo.left<state.phone.left+8 || state.logo.right>state.phone.right-8) throw new Error(`Logo outside phone: ${JSON.stringify(state.logo)}`);
if(state.tagline.left<state.phone.left+8 || state.tagline.right>state.phone.right-8) throw new Error('Tagline outside phone');
if(state.logo.top<=state.topline.bottom-2) throw new Error('Logo overlaps top controls');
if(state.tagline.bottom>=state.scene.top+4) throw new Error(`Tagline crowds scene: ${JSON.stringify({tagline:state.tagline,scene:state.scene})}`);
if(state.playBg!=='rgb(245, 222, 172)' || state.playBgImage!=='none') throw new Error(`Cream button changed: ${state.playBg} / ${state.playBgImage}`);
if(state.residentCount!==5 || state.adultCount!==3 || state.childCount!==2 || state.pebbleCount!==6 || state.cloudCount!==4) throw new Error('Scene composition changed');
const distinctTransforms=new Set(state.spans.map(x=>x.transform));
if(distinctTransforms.size<2) throw new Error('Letters are not visibly staggered');
if(state.spans.some(x=>parseFloat(x.stroke)<5)) throw new Error('Navy toy outline missing');
if(errors.length) throw new Error(errors.join(' | '));

await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/wobbly-logo-render/little-home-wobbly-logo.png`,fullPage:true});

for(const id of [1,3]){
  const p=await browser.newPage({viewport:{width:390,height:844}});
  const localErrors=[];
  p.on('pageerror',e=>localErrors.push(e.message));
  p.on('requestfailed',r=>localErrors.push(r.url()));
  await p.goto(`http://127.0.0.1:8132/title-island-concepts/?c=${id}`,{waitUntil:'networkidle'});
  const sanity=await p.evaluate(()=>{
    const c=document.querySelector('.concept.active');
    return {id:c?.id,toy:c?.querySelectorAll('.toy-logo').length,serif:getComputedStyle(c?.querySelector('.brand h2')).fontFamily,overflow:document.body.scrollWidth-innerWidth};
  });
  if(sanity.id!==`c${id}` || sanity.toy!==0 || sanity.overflow>1 || localErrors.length) throw new Error(`Concept ${id} changed: ${JSON.stringify({sanity,localErrors})}`);
  await p.close();
}

console.log('WOBBLY_LOGO_BROWSER_OK',JSON.stringify(state));
await browser.close();
