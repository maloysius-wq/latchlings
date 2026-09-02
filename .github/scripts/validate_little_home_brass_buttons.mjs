import { chromium } from 'playwright';

const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
const errors=[];
page.on('console',m=>{if(m.type()==='error')errors.push('console:'+m.text())});
page.on('pageerror',e=>errors.push('pageerror:'+e.message));
page.on('requestfailed',r=>errors.push('request:'+r.url()));

const res=await page.goto('http://127.0.0.1:8132/title-island-concepts/?c=2',{waitUntil:'networkidle'});
if(!res?.ok())throw new Error('Little Home response failed');
await page.waitForTimeout(750);

const data=await page.evaluate(()=>{
  const active=document.querySelector('#c2.active');
  const phone=active.querySelector('.phone');
  const play=active.querySelector('.play');
  const secondary=[...active.querySelectorAll('.secondary button')];
  const island=active.querySelector('.island-model');
  const rect=el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
  const css=el=>{const s=getComputedStyle(el);return {clipPath:s.clipPath,backgroundImage:s.backgroundImage,borderTopWidth:s.borderTopWidth,borderRadius:s.borderRadius,filter:s.filter,color:s.color,fontSize:s.fontSize,boxShadow:s.boxShadow}};
  return {
    bodyWidth:document.body.scrollWidth,
    viewport:innerWidth,
    phone:rect(phone),
    play:{rect:rect(play),css:css(play),before:getComputedStyle(play,'::before').content,text:play.textContent.trim()},
    secondary:secondary.map(b=>({rect:rect(b),css:css(b),before:getComputedStyle(b,'::before').content,strong:b.querySelector('strong')?.textContent.trim(),span:b.querySelector('span')?.textContent.trim(),svg:rect(b.querySelector('svg'))})),
    island:rect(island),
    residents:active.querySelectorAll('.resident').length,
    pebbles:active.querySelectorAll('.float-pebble').length,
    clouds:active.querySelectorAll('.cloud').length
  };
});

const inside=(outer,inner)=>inner.left>=outer.left-1&&inner.right<=outer.right+1&&inner.top>=outer.top-1&&inner.bottom<=outer.bottom+1;
if(data.bodyWidth>data.viewport+1)throw new Error(`Horizontal overflow ${data.bodyWidth}/${data.viewport}`);
if(data.play.text!=='Play')throw new Error('Play label changed');
if(data.secondary.length!==2||data.secondary[0].strong!=='Daily Puzzle'||data.secondary[1].strong!=='Level Select')throw new Error('Secondary labels changed');
if(!inside(data.phone,data.play.rect)||data.secondary.some(b=>!inside(data.phone,b.rect)))throw new Error('Control escaped phone bounds '+JSON.stringify(data));
if(data.play.rect.bottom>=Math.min(...data.secondary.map(b=>b.rect.top))-4)throw new Error('Play overlaps secondary controls');
if(data.island.bottom>data.play.rect.top-16)throw new Error(`Island crowds brass controls: island bottom ${data.island.bottom}, play top ${data.play.rect.top}`);
if(data.play.css.clipPath==='none'||data.secondary.some(b=>b.css.clipPath==='none'))throw new Error('Chamfered plate silhouette missing');
if(!data.play.css.backgroundImage.includes('radial-gradient')||!data.play.css.backgroundImage.includes('repeating-linear-gradient'))throw new Error('Play lacks rivet/brushed brass layers');
if(data.secondary.some(b=>!b.css.backgroundImage.includes('radial-gradient')||!b.css.backgroundImage.includes('repeating-linear-gradient')))throw new Error('Secondary brass layers missing');
if(data.play.css.borderTopWidth!=='2px'||data.secondary.some(b=>b.css.borderTopWidth!=='2px'))throw new Error('Metal plate border missing');
if(data.play.before==='none'||data.secondary.some(b=>b.before==='none'))throw new Error('Engraved inset frame pseudo-element missing');
if(data.play.rect.height<54||data.play.rect.height>66||data.secondary.some(b=>b.rect.height<70||b.rect.height>84))throw new Error('Control target sizing unexpected');
if(data.secondary.some(b=>b.svg.width<28||b.svg.height<28))throw new Error('Pressed icon medallions too small');
if(data.residents!==5||data.pebbles!==6||data.clouds!==4)throw new Error('Little Home scene regressed '+JSON.stringify({residents:data.residents,pebbles:data.pebbles,clouds:data.clouds}));
if(errors.length)throw new Error(errors.join(' | '));

await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/brass-button-renders/little-home-brass-buttons.png`,fullPage:true});

for(const id of [1,3]){
  const p=await browser.newPage({viewport:{width:390,height:844}});
  const local=[];
  p.on('pageerror',e=>local.push(e.message));
  p.on('requestfailed',r=>local.push(r.url()));
  await p.goto(`http://127.0.0.1:8132/title-island-concepts/?c=${id}`,{waitUntil:'networkidle'});
  const sanity=await p.evaluate(()=>{
    const a=document.querySelector('.concept.active');
    const play=a.querySelector('.play');
    const sec=a.querySelector('.secondary button');
    return {active:a.id,playClip:getComputedStyle(play).clipPath,secClip:getComputedStyle(sec).clipPath,playBorder:getComputedStyle(play).borderTopWidth,secBorder:getComputedStyle(sec).borderTopWidth,overflow:document.body.scrollWidth-innerWidth};
  });
  if(sanity.active!==`c${id}`||sanity.playClip!=='none'||sanity.secClip!=='none'||sanity.playBorder!=='1px'||sanity.secBorder!=='0px'||sanity.overflow>1||local.length)throw new Error(`Concept ${id} controls changed unexpectedly ${JSON.stringify({sanity,local})}`);
  await p.close();
}

console.log('BRASS_BUTTON_BROWSER_OK',JSON.stringify({play:data.play.rect,secondary:data.secondary.map(b=>b.rect),islandBottom:data.island.bottom,styles:{play:data.play.css.backgroundImage.slice(0,120),secondary:data.secondary.map(b=>b.css.backgroundImage.slice(0,90))}}));
await browser.close();
