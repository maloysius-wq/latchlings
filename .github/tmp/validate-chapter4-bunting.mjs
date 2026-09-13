import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT='/tmp/chapter4-pass3';
fs.mkdirSync(OUT,{recursive:true});
const browser=await chromium.launch({headless:true});
const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,reducedMotion:'no-preference'});
const stars={};for(let i=1;i<201;i++)stars[i]=3;
await ctx.addInitScript(({stars})=>{
 localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked:201,stars}));
 localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1,'across-drift':1,'old-maps':1,homeward:1}));
 localStorage.setItem('latchlings_ui_prefs_v1',JSON.stringify({motion:'system',textSize:'normal'}));
},{stars});
const page=await ctx.newPage();
page.setDefaultTimeout(12000);
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
await page.evaluate(()=>window.focusHomeReward('bunting'));
await page.waitForTimeout(720);
const frame=page.frameLocator('#homeTitleFrame');
await frame.locator('#c2 .story-bunting').waitFor({state:'visible'});
const state=await frame.locator('#c2 .phone').evaluate(phone=>{
 const bunting=phone.querySelector('.story-bunting'),cottage=phone.querySelector('.cottage');
 const b=bunting.getBoundingClientRect(),c=cottage.getBoundingClientRect(),s=getComputedStyle(bunting);
 const overlap=!(b.right<=c.left||b.left>=c.right||b.bottom<=c.top||b.top>=c.bottom);
 return {stage4:phone.classList.contains('story-stage-4'),focus:phone.classList.contains('story-focus-bunting'),display:s.display,opacity:s.opacity,bunting:{left:b.left,top:b.top,right:b.right,bottom:b.bottom,width:b.width,height:b.height},cottage:{left:c.left,top:c.top,right:c.right,bottom:c.bottom},overlap};
});
if(!state.stage4||!state.focus||state.display==='none'||Number(state.opacity)<.95)throw new Error('Bunting focus state missing: '+JSON.stringify(state));
if(state.overlap)throw new Error('Bunting overlaps cottage: '+JSON.stringify(state));
if(state.bunting.width<120)throw new Error('Bunting too narrow to read: '+JSON.stringify(state));
if(errors.length)throw new Error('Browser errors: '+JSON.stringify(errors));
await page.screenshot({path:`${OUT}/chapter4-home-bunting-focus-390.png`,fullPage:false});
fs.writeFileSync(`${OUT}/bunting-refinement.json`,JSON.stringify(state,null,2));
console.log('CHAPTER4_BUNTING_VISUAL_GUARD_OK',JSON.stringify(state));
await browser.close();
