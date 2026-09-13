import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT='/tmp/chapter2-pass3-corrected';
fs.mkdirSync(OUT,{recursive:true});
const results={checks:[],errors:[],screenshots:[]};
function assert(cond,msg){if(!cond)throw new Error(msg)}
function check(name,detail='ok'){results.checks.push({name,detail});console.log('CHECK',name,detail)}
async function shot(page,name){await page.screenshot({path:`${OUT}/${name}.png`,fullPage:false});results.screenshots.push(name+'.png')}

const browser=await chromium.launch({headless:true});
async function contextFor(unlocked=400){
 const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
 const stars={};for(let i=1;i<unlocked;i++)stars[i]=3;
 await ctx.addInitScript(({unlocked,stars})=>{
  localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked,stars}));
  localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1,'across-drift':1,'old-maps':1,homeward:1}));
  localStorage.setItem('latchlings_ui_prefs_v1',JSON.stringify({motion:'system',textSize:'normal'}));
 },{unlocked,stars});
 return ctx;
}
async function settleTransition(page){
 await page.evaluate(async()=>{try{const t=eval('activeScreenTransition');if(t?.finished)await t.finished}catch(_){}});
 await page.waitForTimeout(80);
}
async function clearPresentation(page){
 await settleTransition(page);
 await page.evaluate(()=>{
  try{window.LatchlingsStoryTheme?.close(false)}catch(_){}
  try{if(window.LatchlingsCinematics?.active)window.LatchlingsCinematics.finish(true)}catch(_){}
  const sc=document.getElementById('storyCardOverlay');if(sc){sc.classList.remove('show');sc.setAttribute('aria-hidden','true')}
  const o=document.getElementById('overlay');if(o)o.classList.remove('show','home-overlay');
 });
 await page.waitForTimeout(100);
}

// Clean Atlas proof: enter directly from Little Home so no deferred level Story card can race the screenshot.
const atlasCtx=await contextFor(400);const atlasPage=await atlasCtx.newPage();atlasPage.setDefaultTimeout(10000);atlasPage.on('pageerror',e=>results.errors.push('atlas pageerror: '+String(e)));await atlasPage.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
await atlasPage.evaluate(()=>eval("chapterView=2;rangeView=2;screen('levels');renderChapter()"));
await clearPresentation(atlasPage);
const atlas=await atlasPage.evaluate(()=>{
 const map=document.getElementById('levelGrid'),e=map.querySelector('.atlas-scene em'),after=getComputedStyle(e,'::after'),r=e.getBoundingClientRect(),story=document.getElementById('storyCardOverlay'),overlay=document.getElementById('overlay');
 return {screen:document.body.dataset.screen,cls:map.className,storyVisible:story?.classList.contains('show'),modalVisible:overlay?.classList.contains('show'),landmark:{w:r.width,h:r.height,bg:getComputedStyle(e).backgroundImage,afterContent:after.content,afterShadow:after.boxShadow}};
});
assert(atlas.screen==='levels'&&/atlas-range-3/.test(atlas.cls),'Wrong Atlas state: '+JSON.stringify(atlas));
assert(!atlas.storyVisible&&!atlas.modalVisible,'Atlas evidence is obscured: '+JSON.stringify(atlas));
assert(atlas.landmark.w>35&&atlas.landmark.h>25&&atlas.landmark.afterContent!=='none'&&atlas.landmark.afterShadow!=='none','Twin-lantern Atlas landmark missing: '+JSON.stringify(atlas));
check('Clean Lanternwood Atlas landmark',JSON.stringify(atlas));await shot(atlasPage,'chapter2-atlas-twin-lantern-porch-clean-390');await atlasCtx.close();

// Clean Little Home proof: stage 2 progress is already earned, then focus the canonical pennant without an outgoing game transition covering the scene.
const homeCtx=await contextFor(101);const homePage=await homeCtx.newPage();homePage.setDefaultTimeout(10000);homePage.on('pageerror',e=>results.errors.push('home pageerror: '+String(e)));await homePage.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await homePage.evaluate(()=>window.focusHomeReward('pennant'));await homePage.waitForTimeout(180);
const frame=homePage.frameLocator('#homeTitleFrame');await frame.locator('#c2 .story-pennant').waitFor({state:'visible'});
const home=await frame.locator('#c2 .phone').evaluate(phone=>({stage2:phone.classList.contains('story-stage-2'),focus:phone.classList.contains('story-focus-pennant'),pennant:getComputedStyle(phone.querySelector('.story-pennant')).display}));
const outer=await homePage.evaluate(()=>({screen:document.body.dataset.screen,transition:!!document.querySelector('.screen-transition-outgoing'),story:document.getElementById('storyCardOverlay')?.classList.contains('show'),modal:document.getElementById('overlay')?.classList.contains('show')}));
assert(home.stage2&&home.focus&&home.pennant!=='none','Pennant focus missing: '+JSON.stringify(home));assert(outer.screen==='home'&&!outer.transition&&!outer.story&&!outer.modal,'Little Home evidence is obscured: '+JSON.stringify(outer));
check('Clean Little Home pennant payoff',JSON.stringify({home,outer}));await shot(homePage,'chapter2-home-pennant-focus-clean-390');await homeCtx.close();

assert(results.errors.length===0,'Browser errors: '+JSON.stringify(results.errors));fs.writeFileSync(`${OUT}/results.json`,JSON.stringify(results,null,2));console.log('CHAPTER2_PASS3_CORRECTED_EVIDENCE_ACCEPTED');await browser.close();
