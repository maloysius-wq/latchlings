import { chromium } from 'playwright';
import fs from 'node:fs';

const browser = await chromium.launch({headless:true});
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const errors=[];
page.on('pageerror', e=>errors.push('pageerror: '+e.message));
page.on('console', m=>{ if(m.type()==='error') errors.push('console: '+m.text()); });

async function state(label){
  const s=await page.evaluate((label)=>{
    const levels=document.getElementById('levels');
    const shell=document.querySelector('#levels .atlas-shell');
    const map=document.getElementById('levelGrid');
    const chapter=document.getElementById('chapterHead');
    const outgoing=document.querySelector('.screen-transition-outgoing');
    const cs=levels?getComputedStyle(levels):null;
    const ss=shell?getComputedStyle(shell):null;
    const rect=shell?shell.getBoundingClientRect():null;
    return {
      label,
      bodyScreen:document.body.dataset.screen,
      activeIds:[...document.querySelectorAll('.screen.active')].map(x=>x.id),
      levelsClass:levels?.className,
      levelsDisplay:cs?.display,
      levelsVisibility:cs?.visibility,
      levelsOpacity:cs?.opacity,
      shellDisplay:ss?.display,
      shellVisibility:ss?.visibility,
      shellOpacity:ss?.opacity,
      shellRect:rect&&{x:rect.x,y:rect.y,width:rect.width,height:rect.height},
      chapterText:chapter?.innerText?.slice(0,120),
      mapChildren:map?.children?.length,
      nodeCount:map?.querySelectorAll('.atlas-node').length,
      clickableNodes:map?.querySelectorAll('.atlas-node:not(.locked)').length,
      outgoingId:outgoing?.id||null,
      outgoingStyle:outgoing?.getAttribute('style')||null,
      debug:document.getElementById('debug')?.textContent||'',
      overlayClass:document.getElementById('overlay')?.className||''
    };
  },label);
  console.log('STATE '+JSON.stringify(s));
  return s;
}

await page.goto('http://127.0.0.1:4173/',{waitUntil:'load'});
await page.evaluate(()=>{
  localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked:12,stars:{1:3,2:3,3:2}}));
});
await page.reload({waitUntil:'load'});
await page.evaluate(()=>startLevel(5));
await page.waitForTimeout(700);
await state('game-ready');
await page.click('#pauseBtn');
await page.waitForSelector('#pauseLevels');
await page.click('#pauseLevels');
await page.waitForTimeout(80);
await state('pause-levels-80ms');
await page.waitForTimeout(650);
const pauseFinal=await state('pause-levels-final');
await page.screenshot({path:'level-select-diagnostic/pause-levels-final.png',fullPage:true});

await page.evaluate(()=>startLevel(5));
await page.waitForTimeout(700);
await page.evaluate(()=>loseLevel());
await page.waitForSelector('#loseLevelsBtn');
await page.click('#loseLevelsBtn');
await page.waitForTimeout(800);
const loseFinal=await state('lose-levels-final');
await page.screenshot({path:'level-select-diagnostic/lose-levels-final.png',fullPage:true});

await page.evaluate(()=>startLevel(12));
await page.waitForTimeout(700);
await page.evaluate(()=>winLevel());
await page.waitForSelector('#toLevelsBtn');
await page.click('#toLevelsBtn');
await page.waitForTimeout(850);
const winEarly=await state('win-levels-850ms');
await page.screenshot({path:'level-select-diagnostic/win-levels-850ms.png',fullPage:true});
await page.waitForTimeout(2500);
const winFinal=await state('win-levels-final');
await page.screenshot({path:'level-select-diagnostic/win-levels-final.png',fullPage:true});

const report={pauseFinal,loseFinal,winEarly,winFinal,errors};
fs.mkdirSync('level-select-diagnostic',{recursive:true});
fs.writeFileSync('level-select-diagnostic/report.json',JSON.stringify(report,null,2));
console.log('DIAGNOSTIC_REPORT '+JSON.stringify(report));
await browser.close();
