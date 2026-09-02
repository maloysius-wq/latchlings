import { chromium } from 'playwright';

const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
const errors=[];
page.on('console',m=>{if(m.type()==='error')errors.push('console:'+m.text())});
page.on('pageerror',e=>errors.push('pageerror:'+e.message));
page.on('requestfailed',r=>errors.push('request:'+r.url()));

const res=await page.goto('http://127.0.0.1:8134/title-island-concepts/?c=2',{waitUntil:'networkidle'});
if(!res?.ok()) throw new Error('Little Home preview failed to load');
await page.waitForTimeout(900);

const data=await page.evaluate(()=>{
  const active=document.querySelector('#c2.active');
  const rect=el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
  const play=active.querySelector('.play');
  const secondary=[...active.querySelectorAll('.secondary button')];
  const scene=active.querySelector('.island-model');
  const cs=el=>getComputedStyle(el);
  return {
    bodyWidth:document.body.scrollWidth,
    viewport:innerWidth,
    phone:rect(active.querySelector('.phone')),
    play:rect(play),
    secondary:secondary.map(rect),
    island:rect(scene),
    playStyle:{borderRadius:cs(play).borderRadius,clipPath:cs(play).clipPath,backgroundImage:cs(play).backgroundImage,color:cs(play).color},
    secondaryStyles:secondary.map(el=>({borderRadius:cs(el).borderRadius,clipPath:cs(el).clipPath,backgroundImage:cs(el).backgroundImage,color:cs(el).color})),
    labels:[play.textContent.trim(),...secondary.map(el=>el.querySelector('strong')?.textContent.trim())],
    residents:active.querySelectorAll('.resident').length,
    adults:active.querySelectorAll('.resident[data-role="adult"]').length,
    children:active.querySelectorAll('.resident[data-role="child"]').length,
    pebbles:active.querySelectorAll('.float-pebble').length,
    clouds:active.querySelectorAll('.cloud').length
  };
});

if(data.bodyWidth>data.viewport+1) throw new Error(`Horizontal overflow ${data.bodyWidth}/${data.viewport}`);
if(data.play.left<data.phone.left-1||data.play.right>data.phone.right+1) throw new Error('Play outside phone');
for(const b of data.secondary){if(b.left<data.phone.left-1||b.right>data.phone.right+1||b.bottom>data.phone.bottom+1)throw new Error('Secondary outside phone');}
if(data.play.bottom>=Math.min(...data.secondary.map(b=>b.top))) throw new Error('Play overlaps secondary controls');
if(data.island.bottom>data.play.top-8) throw new Error(`Island crowds Play: island bottom ${data.island.bottom}, play top ${data.play.top}`);
if(data.playStyle.clipPath!=='none') throw new Error('Play still has clipped corners');
if(!data.playStyle.borderRadius.startsWith('22px')) throw new Error('Play is not rounded as intended: '+data.playStyle.borderRadius);
if(!data.playStyle.backgroundImage.includes('repeating-linear-gradient')) throw new Error('Play lacks stripes');
for(const s of data.secondaryStyles){
  if(s.clipPath!=='none') throw new Error('Secondary still has clipped corners');
  if(!s.borderRadius.startsWith('20px')) throw new Error('Secondary is not rounded: '+s.borderRadius);
  if(!s.backgroundImage.includes('repeating-linear-gradient')) throw new Error('Secondary lacks stripes');
}
if(JSON.stringify(data).match(/rgb\((?:0|[0-9]{1,2}),\s*(?:80|90|100|110|120|130|140|150|160|170|180),\s*(?:180|190|200|210|220|230|240|250|255)\)/)) throw new Error('Unexpected blue-dominant stripe palette detected');
if(JSON.stringify(data.labels)!==JSON.stringify(['Play','Daily Puzzle','Level Select'])) throw new Error('Labels changed: '+JSON.stringify(data.labels));
if(data.residents!==5||data.adults!==3||data.children!==2||data.pebbles!==6||data.clouds!==4) throw new Error('Scene regression '+JSON.stringify(data));
if(errors.length) throw new Error(errors.join(' | '));

await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/striped-button-renders/little-home-striped-buttons.png`,fullPage:true});
console.log('STRIPED_BUTTON_BROWSER_OK',JSON.stringify(data));

for(const id of [1,3]){
  const p=await browser.newPage({viewport:{width:390,height:844}});
  await p.goto(`http://127.0.0.1:8134/title-island-concepts/?c=${id}`,{waitUntil:'networkidle'});
  const sanity=await p.evaluate(()=>{
    const a=document.querySelector('.concept.active');
    const play=a.querySelector('.play');
    return {id:a.id,background:getComputedStyle(play).backgroundImage,clip:getComputedStyle(play).clipPath,borderRadius:getComputedStyle(play).borderRadius};
  });
  if(sanity.id!==`c${id}`)throw new Error(`Concept ${id} activation failed`);
  if(sanity.background.includes('repeating-linear-gradient'))throw new Error(`Concept ${id} accidentally inherited striped treatment`);
  await p.close();
}

await browser.close();
