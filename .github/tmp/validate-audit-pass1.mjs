import { chromium } from 'playwright';
import fs from 'node:fs';

const out='/tmp/audit-pass1';
fs.mkdirSync(out,{recursive:true});
const errors=[];
const report={viewports:[],cinematics:{},settings:{},daily:{},story:{},help:{}};
function assert(cond,msg){if(!cond)throw new Error(msg)}
function rectOk(r,w,h,label){assert(r&&r.width>0&&r.height>0,`${label} has no box`);assert(r.left>=-1&&r.right<=w+1,`${label} horizontal bounds ${JSON.stringify(r)} viewport ${w}`);assert(r.top>=-1&&r.bottom<=h+1,`${label} vertical bounds ${JSON.stringify(r)} viewport ${h}`)}

const browser=await chromium.launch({headless:true});
const base=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
const page=await base.newPage();
page.on('pageerror',e=>errors.push('pageerror: '+String(e)));
page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text())});
await page.goto('http://127.0.0.1:4173/',{waitUntil:'load'});
await page.evaluate(()=>{localStorage.clear();location.reload()});
await page.waitForLoadState('load');
await page.waitForFunction(()=>window.LatchlingsHomeAction&&document.getElementById('homeTitleFrame')?.contentWindow);
let homeFrame=page.frames().find(f=>/title-island-concepts/.test(f.url()));
assert(homeFrame,'Little Home iframe missing');
await homeFrame.waitForSelector('#c2 .settings');
const homeTargets=await homeFrame.evaluate(()=>Object.fromEntries(['.settings','.story-home'].map(sel=>{const r=document.querySelector('#c2 '+sel)?.getBoundingClientRect();return [sel,r&&{width:r.width,height:r.height}]})));
assert(homeTargets['.settings'].width>=44&&homeTargets['.settings'].height>=44,'Settings target below 44px');
assert(homeTargets['.story-home'].width>=44&&homeTargets['.story-home'].height>=44,'Story target below 44px');

// Gear must open actual Settings, with direct sound/readability/motion controls.
await homeFrame.click('#c2 .settings');
await page.waitForSelector('#overlay.show #modal h2');
assert((await page.locator('#modal h2').textContent()).trim()==='Settings','Home gear did not open Settings');
for(const id of ['musicToggleBtn','sfxToggleBtn','motionToggleBtn','textSizeToggleBtn','settingsRules','settingsStory'])assert(await page.locator('#'+id).count()===1,`Settings missing ${id}`);
await page.click('#motionToggleBtn');
await page.click('#textSizeToggleBtn');
report.settings.afterToggle=await page.evaluate(()=>({prefs:window.LatchlingsPrefs.get(),motion:document.documentElement.dataset.motion,text:document.documentElement.dataset.textSize}));
assert(report.settings.afterToggle.prefs.motion==='reduced'&&report.settings.afterToggle.prefs.textSize==='large','UI preferences did not toggle');
await page.click('#musicToggleBtn');
await page.click('#sfxToggleBtn');
report.settings.audio=await page.evaluate(()=>({music:window.LatchlingsMusic.isEnabled(),sfx:window.LatchlingsSFX.isEnabled()}));
assert(report.settings.audio.music===false&&report.settings.audio.sfx===false,'Audio toggles did not persist state');
await page.click('#settingsClose');

// Dedicated Story entry and spoiler-safe fresh briefing.
await homeFrame.click('#c2 .story-home');
await page.waitForFunction(()=>document.body.dataset.screen==='story');
const freshStory=(await page.locator('#story').innerText()).toLowerCase();
report.story.fresh=freshStory;
for(const forbidden of ['route system has grown rigid','rebuild it into a living network','the skyway stopped changing with them'])assert(!freshStory.includes(forbidden),`Fresh briefing leaked later conclusion: ${forbidden}`);
assert(freshStory.includes('cause is still unknown')||freshStory.includes('find out what changed'),'Fresh briefing does not preserve investigation state');
await page.screenshot({path:`${out}/fresh-story.png`});
await page.click('#storyBack');
await page.waitForFunction(()=>document.body.dataset.screen==='home');

// Reload proves preferences persist and are propagated to Little Home.
await page.reload({waitUntil:'load'});
await page.waitForFunction(()=>window.LatchlingsPrefs);
report.settings.afterReload=await page.evaluate(()=>({prefs:window.LatchlingsPrefs.get(),motion:document.documentElement.dataset.motion,text:document.documentElement.dataset.textSize,music:window.LatchlingsMusic.isEnabled(),sfx:window.LatchlingsSFX.isEnabled()}));
assert(report.settings.afterReload.prefs.motion==='reduced'&&report.settings.afterReload.prefs.textSize==='large','UI prefs did not survive reload');
assert(report.settings.afterReload.music===false&&report.settings.afterReload.sfx===false,'Audio prefs did not survive reload');
homeFrame=page.frames().find(f=>/title-island-concepts/.test(f.url()));
await homeFrame.waitForSelector('#c2 .settings');
await page.waitForTimeout(80);
assert(await homeFrame.evaluate(()=>document.documentElement.dataset.motion)==='reduced','Reduced-motion preference not propagated to Little Home');
// Return text size to normal/system for geometry gates.
await page.evaluate(()=>{window.LatchlingsPrefs.set('motion','system');window.LatchlingsPrefs.set('textSize','normal')});

// Daily must be a separate game mode and never mutate campaign progress.
const campaignBefore=await page.evaluate(()=>localStorage.getItem('latchlings_campaign400_progress_v1'));
await page.evaluate(()=>window.LatchlingsHomeAction('daily'));
await page.waitForFunction(()=>document.body.dataset.screen==='game'&&document.body.dataset.playMode==='daily');
await page.waitForSelector('#storyRailSlot .daily-rail');
assert(await page.locator('#storyCardBtn').isHidden(),'Daily exposes campaign Story card button');
assert((await page.locator('#storyRailSlot').innerText()).includes('Campaign story and progress stay unchanged'),'Daily rail is not spoiler-safe/neutral');
assert(await page.locator('#mechanicNote').isVisible(),'Daily lost mechanic teaching');
await page.screenshot({path:`${out}/daily-route.png`});
await page.evaluate(()=>winLevel());
await page.waitForSelector('#overlay.show #dailyHomeBtn');
const campaignAfter=await page.evaluate(()=>localStorage.getItem('latchlings_campaign400_progress_v1'));
assert(campaignBefore===campaignAfter,`Daily mutated campaign progress: before=${campaignBefore} after=${campaignAfter}`);
report.daily.storage=await page.evaluate(()=>localStorage.getItem('latchlings_daily400_progress_v1'));
assert(report.daily.storage&&report.daily.storage.includes('completed'),'Daily completion not stored separately');
assert((await page.locator('#modal').innerText()).includes('separate from campaign progress'),'Daily completion does not explain isolation');
await page.click('#dailyHomeBtn');
await page.waitForFunction(()=>document.body.dataset.screen==='home');

// Campaign rail and mechanic teaching are separate surfaces.
await page.evaluate(()=>{localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1}));localStorage.setItem('latchlings_story_cards_seen_v1',JSON.stringify({'1':1}));startLevel(1)});
await page.waitForFunction(()=>document.body.dataset.screen==='game'&&document.body.dataset.playMode==='campaign');
await page.waitForSelector('#storyRailSlot .story-level-rail');
assert(await page.locator('#mechanicNote').isVisible(),'Mechanic cue not visible during campaign');
assert(await page.locator('#storyRailSlot').isVisible(),'Story rail not visible');
const railFont=parseFloat(await page.locator('.story-rail-main p').evaluate(el=>getComputedStyle(el).fontSize));
assert(railFont>=13,'Essential story copy remains too small: '+railFont);
const storyTarget=await page.locator('.story-rail-story-btn').boundingBox();
assert(storyTarget.width>=44&&storyTarget.height>=44,'Story target below 44px');
await page.screenshot({path:`${out}/level1-pass1.png`});

// Pause exposes Settings directly.
await page.click('#pauseBtn');
await page.waitForSelector('#pauseSettings');
await page.click('#pauseSettings');
assert((await page.locator('#modal h2').textContent()).trim()==='Settings','Pause Settings does not open Settings');
await page.click('#settingsClose');

// Hint is readable and highlights the actual first move, with stale-state protection.
await page.click('#hintBtn');
await page.waitForSelector('#hintClose');
const hintText=(await page.locator('#modal').innerText()).toLowerCase();
assert(!hintText.includes('verified shortest')&&!hintText.includes('solver-verified'),'Hint exposes solver jargon');
await page.click('#hintClose');
assert(await page.locator('.latchling.hint-focus').count()===1,'Hint did not highlight a piece');
assert(await page.locator('.dpad-hit.hint-focus').count()===1,'Hint did not highlight a direction');

await page.evaluate(()=>startLevel(13));
await page.waitForTimeout(40);
await page.evaluate(()=>{const [pi,d]=LEVELS[12].solution[0];document.querySelector(`.latchling[data-pi="${pi}"]`)?.click();document.querySelector(`.dpad-hit[data-dir="${d}"]`)?.click()});
await page.waitForTimeout(500);
if(await page.locator('#overlay.show').count()) await page.evaluate(()=>closeModal());
await page.click('#hintBtn');
await page.waitForSelector('#hintReset');
assert((await page.locator('#modal').innerText()).includes('Reset for an accurate hint?'),'Hint did not protect against changed board state');
await page.click('#hintKeep');

// Failure and win language is player-facing, with correct pluralization.
await page.evaluate(()=>loseLevel());
const failText=(await page.locator('#modal').innerText()).toLowerCase();
assert(failText.includes("let's try another route")&&!failText.includes('solver-verified'),'Failure copy still sounds like implementation jargon');
await page.evaluate(()=>closeModal());
await page.evaluate(()=>startLevel(1));
await page.waitForTimeout(30);
const optimal=await page.evaluate(()=>LEVELS[0].optimal);
await page.evaluate(()=>winLevel());
const winText=(await page.locator('#modal').innerText()).toLowerCase();
assert(!winText.includes('verified shortest'),'Win copy still exposes solver jargon');
assert(winText.includes(`perfect route: ${optimal} move${optimal===1?'':'s'}`),'Perfect route copy/pluralization incorrect');
report.help={hintText,failText,winText};
await page.evaluate(()=>closeModal());

// Rules use actual mechanic visuals, not A/S/I-O shorthand.
await page.evaluate(()=>rulesModal());
const rulesText=(await page.locator('#modal').innerText()).trim();
assert(!rulesText.includes('I/O'),'Rules retain I/O shorthand');
assert(await page.locator('#modal .legend-icon svg').count()>=4,'Rules are not using mechanic artwork');
await page.evaluate(()=>closeModal());

// All later-film utterances stay in source order, and dialogue never returns to the scenic stage.
async function inspectFilm(id){
 await page.evaluate(id=>window.LatchlingsCinematics.show(id,{markSeen:false}),id);
 const beats=await page.evaluate(id=>window.LatchlingsCinematics.CINEMATICS[id].beats.length,id);
 const rows=[];
 for(let i=0;i<beats;i++){
  await page.waitForTimeout(80);
  const state=await page.evaluate(()=>{
   const api=window.LatchlingsCinematics,b=api.CINEMATICS[api.active].beats[api.beat],expected=b.lines.filter(x=>x[0]!=='Narrator').map(x=>x[0]);
   const actual=[...document.querySelectorAll('.cin-ordered-dialogue-dock .cin-opening-dialogue-row')].map(x=>x.dataset.speaker);
   const stageDialogue=document.querySelectorAll('#cinematicStage>.cin-dialogue-layer').length;
   const bubble=document.querySelector('.cin-ordered-dialogue-dock .cin-opening-bubble');
   return {expected,actual,stageDialogue,font:bubble?parseFloat(getComputedStyle(bubble).fontSize):null,beat:api.beat};
  });
  assert(JSON.stringify(state.expected)===JSON.stringify(state.actual),`${id} beat ${i+1} dialogue reordered: ${JSON.stringify(state)}`);
  assert(state.stageDialogue===0,`${id} beat ${i+1} dialogue still overlays scene`);
  if(state.actual.length)assert(state.font>=12,`${id} beat ${i+1} dialogue too small: ${state.font}`);
  rows.push(state);
  if(i<beats-1)await page.evaluate(()=>window.LatchlingsCinematics.next());
 }
 await page.evaluate(()=>window.LatchlingsCinematics.finish(true));
 return rows;
}
for(const id of ['opening','across-drift','old-maps','homeward']) report.cinematics[id]=await inspectFilm(id);
assert(JSON.stringify(report.cinematics['across-drift'][1].actual)===JSON.stringify(['Tansy','Pip','Tansy']),'Across the Drift porch order wrong');
assert(JSON.stringify(report.cinematics['old-maps'][0].actual)===JSON.stringify(['Bramble','Pippa','Bramble']),'Old Maps drawer order wrong');
await page.screenshot({path:`${out}/cinematic-dock-final.png`});

// Viewport containment, touch targets, and dense board coverage.
await base.close();
for(const [width,height] of [[320,568],[360,800],[390,844],[430,932],[768,844]]){
 const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
 const p=await ctx.newPage();
 const localErrors=[];p.on('pageerror',e=>localErrors.push(String(e)));
 await p.goto('http://127.0.0.1:4173/',{waitUntil:'load'});
 await p.evaluate(()=>{localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked:400,stars:{}}));localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1,'across-drift':1,'old-maps':1,homeward:1}));localStorage.setItem('latchlings_story_cards_seen_v1',JSON.stringify({'400':1}));startLevel(400)});
 await p.waitForSelector('#storyRailSlot .story-level-rail');
 await p.waitForTimeout(60);
 const geom=await p.evaluate(()=>{
  const ids=['game','.game-top','#storyRailSlot','#board','#mechanicNote','.controls'];
  const out={};for(const sel of ids){const el=sel==='game'?document.getElementById('game'):document.querySelector(sel),r=el?.getBoundingClientRect();out[sel]=r?{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}:null}
  out.dirs=[...document.querySelectorAll('.dpad-hit')].map(el=>{const r=el.getBoundingClientRect();return {width:r.width,height:r.height}});out.side=[...document.querySelectorAll('.side-action')].map(el=>{const r=el.getBoundingClientRect();return {width:r.width,height:r.height}});return out;
 });
 for(const sel of ['.game-top','#storyRailSlot','#board','#mechanicNote','.controls']) rectOk(geom[sel],width,height,`${width}x${height} ${sel}`);
 assert(geom.dirs.every(r=>r.width>=44&&r.height>=44),`${width}x${height} D-pad hit target below 44px: ${JSON.stringify(geom.dirs)}`);
 assert(geom.side.every(r=>r.height>=44),`${width}x${height} side action target below 44px`);
 // Atlas targets.
 await p.evaluate(()=>{screen('levels');chapterView=1;renderChapter()});
 await p.waitForSelector('.atlas-region-dot');
 const atlas=await p.evaluate(()=>({dots:[...document.querySelectorAll('.atlas-region-dot')].map(e=>{const r=e.getBoundingClientRect();return [r.width,r.height]}),arrows:[...document.querySelectorAll('.atlas-chapter-arrow')].map(e=>{const r=e.getBoundingClientRect();return [r.width,r.height]}),tabs:[...document.querySelectorAll('.atlas-waypoint-tab')].map(e=>{const r=e.getBoundingClientRect();return [r.width,r.height]})}));
 assert(atlas.dots.every(([w,h])=>w>=44&&h>=44),`${width}x${height} Atlas chapter dot target below 44px`);
 assert(atlas.arrows.every(([w,h])=>w>=44&&h>=44),`${width}x${height} Atlas arrow target below 44px`);
 assert(atlas.tabs.every(([w,h])=>h>=44),`${width}x${height} Atlas waypoint below 44px`);
 await p.evaluate(()=>startLevel(1));await p.waitForTimeout(40);
 await p.screenshot({path:`${out}/viewport-${width}x${height}.png`});
 report.viewports.push({width,height,geom,atlas,errors:localErrors});
 assert(!localErrors.length,`${width}x${height} page errors: ${localErrors.join(' | ')}`);
 await ctx.close();
}

fs.writeFileSync(`${out}/report.json`,JSON.stringify(report,null,2));
assert(!errors.length,`base browser errors: ${errors.join(' | ')}`);
await browser.close();
console.log('AUDIT_PASS1_ACCEPTED viewports=5 cinematics=25 daily=isolated settings=reachable');
