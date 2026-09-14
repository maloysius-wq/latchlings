import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT='/tmp/chapter8-clean';fs.mkdirSync(OUT,{recursive:true});
const browser=await chromium.launch({headless:true});
async function make(viewport){
 const ctx=await browser.newContext({viewport,deviceScaleFactor:1});
 const stars={};for(let i=1;i<400;i++)stars[i]=3;
 await ctx.addInitScript(({stars})=>{localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked:400,stars}));localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1,'across-drift':1,'old-maps':1,homeward:1}));},{stars});
 const page=await ctx.newPage();page.setDefaultTimeout(18000);await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});return {ctx,page};
}
async function settleLevel(page){
 await page.evaluate(()=>window.startLevel(351));
 await page.waitForTimeout(1800);
 await page.evaluate(async()=>{
  try{window.LatchlingsStoryTheme?.close(false)}catch(_){}
  const sc=document.getElementById('storyCardOverlay');if(sc){sc.classList.remove('show');sc.setAttribute('aria-hidden','true')}
  const co=document.getElementById('cinematicOverlay');if(co){co.classList.remove('show','active');co.setAttribute('aria-hidden','true')}
  try{const t=eval('activeScreenTransition');if(t?.finished)await t.finished}catch(_){}
 });
 await page.waitForTimeout(220);
}
for(const [width,height,name] of [[390,844,'chapter8-level351-clean-390.png'],[320,568,'chapter8-level351-clean-320.png']]){
 const {ctx,page}=await make({width,height});await settleLevel(page);if(await page.locator('#storyCardOverlay.show').count())throw new Error('story card still visible');await page.screenshot({path:`${OUT}/${name}`,fullPage:false});await ctx.close();
}
{
 const {ctx,page}=await make({width:390,height:844});
 await page.evaluate(()=>window.LatchlingsChapterEightPass3.finishCampaign());
 await page.waitForFunction(()=>document.body.dataset.screen==='complete');
 await page.evaluate(async()=>{try{const t=eval('activeScreenTransition');if(t?.finished)await t.finished}catch(_){}});
 await page.waitForTimeout(180);
 const state=await page.evaluate(()=>({screen:document.body.dataset.screen,active:[...document.querySelectorAll('.screen.active')].map(x=>x.id),title:document.querySelector('#complete h1')?.textContent||''}));
 if(state.screen!=='complete'||state.active.length!==1||state.active[0]!=='complete'||state.title!=='Skyway Restored')throw new Error('completion not settled '+JSON.stringify(state));
 await page.screenshot({path:`${OUT}/chapter8-campaign-complete-clean-390.png`,fullPage:false});await ctx.close();
}
await browser.close();console.log('CHAPTER8_CLEAN_EVIDENCE_OK');