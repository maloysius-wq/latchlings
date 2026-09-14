import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT='/tmp/audit-r1-r5-evidence';
fs.mkdirSync(OUT,{recursive:true});
const results={checks:[],errors:[],scans:{},cinematics:[],solutions:{},motion:{},fonts:{}};
function assert(cond,msg){if(!cond)throw new Error(msg)}
function check(name,detail='ok'){results.checks.push({name,detail});console.log('CHECK',name,detail)}
async function shot(page,name){await page.screenshot({path:`${OUT}/${name}.png`,fullPage:false})}
const browser=await chromium.launch({headless:true});
const seen={opening:1,'across-drift':1,'old-maps':1,homeward:1};
async function makeContext(viewport={width:390,height:844},prefs={motion:'reduced',textSize:'normal'},unlocked=400){
 const ctx=await browser.newContext({viewport,deviceScaleFactor:1,reducedMotion:'no-preference'});
 const stars={};for(let i=1;i<unlocked;i++)stars[i]=3;
 await ctx.addInitScript(({unlocked,stars,prefs,seen})=>{localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked,stars}));localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify(seen));localStorage.setItem('latchlings_ui_prefs_v1',JSON.stringify(prefs));},{unlocked,stars,prefs,seen});
 return ctx;
}
function listen(page,label){page.on('pageerror',e=>results.errors.push(`${label} pageerror: ${String(e)}`));page.on('console',m=>{if(m.type()==='error')results.errors.push(`${label} console: ${m.text()}`)})}
async function settleGame(page,L,mode='campaign'){
 await page.evaluate(({L,mode})=>window.startLevel(L,mode),{L,mode});
 await page.waitForTimeout(20);
 await page.evaluate(()=>{try{window.LatchlingsStoryTheme?.close(false)}catch(_){};try{if(window.LatchlingsCinematics?.active)window.LatchlingsCinematics.finish(true)}catch(_){};window.LatchlingsStoryRail?.render()});
 await page.waitForTimeout(20);
}
async function bounds(page,label){const x=await page.evaluate(()=>{const r=document.querySelector('.controls')?.getBoundingClientRect();const targets=[...document.querySelectorAll('.controls button')].filter(e=>getComputedStyle(e).display!=='none').map(e=>Math.min(e.getBoundingClientRect().width,e.getBoundingClientRect().height));return {w:innerWidth,h:innerHeight,doc:document.documentElement.scrollWidth,body:document.body.scrollWidth,controls:r?{top:r.top,bottom:r.bottom}:null,minTarget:targets.length?Math.min(...targets):0}});assert(x.doc<=x.w+1&&x.body<=x.w+1,`${label} horizontal overflow ${JSON.stringify(x)}`);assert(!x.controls||x.controls.bottom<=x.h+1,`${label} controls overflow ${JSON.stringify(x)}`);assert(!x.minTarget||x.minTarget>=44,`${label} target <44 ${JSON.stringify(x)}`);check(label,JSON.stringify(x));return x}

async function scanAll(page,label,textSize){
 await page.evaluate(size=>window.LatchlingsPrefs.set('textSize',size),textSize);
 const out=await page.evaluate(async()=>{
  const fails=[];const fonts=[];
  const clips=(el,stop)=>{if(!el)return 'missing';const er=el.getBoundingClientRect();let p=el.parentElement;while(p&&p!==stop){const s=getComputedStyle(p),ov=`${s.overflow} ${s.overflowY} ${s.overflowX}`;if(/hidden|clip/.test(ov)){const r=p.getBoundingClientRect();if(er.bottom>r.bottom+1||er.top<r.top-1||er.right>r.right+1||er.left<r.left-1)return `${p.className||p.id}:${JSON.stringify({e:{t:er.top,b:er.bottom,l:er.left,r:er.right},p:{t:r.top,b:r.bottom,l:r.left,r:r.right}})}`}p=p.parentElement}return ''};
  for(let L=1;L<=400;L++){
   window.startLevel(L,'campaign');await new Promise(r=>setTimeout(r,0));try{window.LatchlingsStoryTheme?.close(false)}catch(_){};try{if(window.LatchlingsCinematics?.active)window.LatchlingsCinematics.finish(true)}catch(_){};window.LatchlingsStoryRail?.render();
   const rail=document.querySelector('.story-level-rail'),story=document.querySelector('.story-rail-main p'),tip=document.querySelector('.mechanic-chip-copy'),controls=document.querySelector('.controls'),game=document.getElementById('game');
   const rs=story&&getComputedStyle(story),ts=tip&&getComputedStyle(tip),rr=rail&&rail.getBoundingClientRect(),sr=story&&story.getBoundingClientRect(),tr=tip&&tip.getBoundingClientRect(),cr=controls&&controls.getBoundingClientRect();
   const why=[];
   if(!rail||!story||!tip)why.push('missing rail/story/tip');
   if(story&&story.scrollHeight>story.clientHeight+1)why.push(`story internal clip ${story.scrollHeight}/${story.clientHeight}`);
   if(tip&&tip.scrollHeight>tip.clientHeight+1)why.push(`tip internal clip ${tip.scrollHeight}/${tip.clientHeight}`);
   if(rr&&sr&&sr.bottom>rr.bottom+1)why.push(`story below rail ${sr.bottom}/${rr.bottom}`);
   const ac=clips(story,game);if(ac)why.push('story ancestor clip '+ac);
   const tc=clips(tip,game);if(tc)why.push('tip ancestor clip '+tc);
   if(ts&&(ts.overflow==='hidden'||ts.textOverflow==='ellipsis'||(ts.webkitLineClamp&&ts.webkitLineClamp!=='none')))why.push(`tip clipping css overflow=${ts.overflow} ellipsis=${ts.textOverflow} clamp=${ts.webkitLineClamp}`);
   if(cr&&cr.bottom>innerHeight+1)why.push(`controls bottom ${cr.bottom}>${innerHeight}`);
   if(document.documentElement.scrollWidth>innerWidth+1||document.body.scrollWidth>innerWidth+1)why.push('horizontal overflow');
   if(why.length)fails.push({L,why});
   if([71,141,201,341,400].includes(L))fonts.push({L,story:rs?.fontSize,tip:ts?.fontSize,railH:rr?.height,storyH:sr?.height,tipH:tr?.height,controlsBottom:cr?.bottom});
  }
  return {fails,fonts};
 });
 results.scans[`${label}-${textSize}`]=out;assert(out.fails.length===0,`${label} ${textSize} scan failures: ${JSON.stringify(out.fails.slice(0,20))}`);check(`${label} ${textSize}: all 400 rails/tips`,JSON.stringify(out.fonts));return out;
}

// R1 + R4 all-board matrix at both target phone sizes, normal and Large Text.
for(const viewport of [{width:390,height:844},{width:320,height:568}]){
 const ctx=await makeContext(viewport,{motion:'reduced',textSize:'normal'});const page=await ctx.newPage();listen(page,`${viewport.width}`);page.setDefaultTimeout(20000);await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 const normal=await scanAll(page,`${viewport.width}x${viewport.height}`,'normal');
 if(viewport.width===390){await settleGame(page,201);await shot(page,'r1-level201-normal-390')}
 const large=await scanAll(page,`${viewport.width}x${viewport.height}`,'large');
 if(viewport.width===390){await settleGame(page,201);await shot(page,'r4-level201-large-390')}
 if(viewport.width===320){await settleGame(page,201);await bounds(page,'R1/R4 Level 201 large 320 containment');await shot(page,'r4-level201-large-320')}
 for(const L of [71,141,201,341]){const n=normal.fonts.find(x=>x.L===L),g=large.fonts.find(x=>x.L===L);assert(parseFloat(g.story)>parseFloat(n.story),`Large Text failed story font ${viewport.width} L${L}: ${n.story}->${g.story}`);assert(parseFloat(g.tip)>parseFloat(n.tip),`Large Text failed tip font ${viewport.width} L${L}: ${n.tip}->${g.tip}`)}
 results.fonts[`${viewport.width}`]={normal:normal.fonts,large:large.fonts};check(`R4 Large Text grows essential copy ${viewport.width}`,JSON.stringify(results.fonts[`${viewport.width}`]));await ctx.close();
}

// R2: in-game Reduced Motion independently stops adults and CSS residents, then resumes only while Home is active.
{
 const ctx=await makeContext({width:390,height:844},{motion:'reduced',textSize:'normal'});const page=await ctx.newPage();listen(page,'motion');page.setDefaultTimeout(20000);await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});const frame=page.frameLocator('#homeTitleFrame');await frame.locator('#c2 .resident.adult').first().waitFor();await page.waitForTimeout(600);
 const state=async()=>frame.locator('#c2').evaluate(root=>({counts:[...root.querySelectorAll('.resident.adult')].map(e=>Number(e.dataset.moveCount||0)),transforms:[...root.querySelectorAll('.resident.adult')].map(e=>e.style.transform),active:root.dataset.activeAdult||'',next:root.dataset.nextAdultMoveMs||'',motion:document.documentElement.dataset.motion,scene:document.documentElement.dataset.sceneActive,kidAnim:getComputedStyle(root.querySelector('.kid-one')).animationName}));
 const a=await state();await page.waitForTimeout(13000);const b=await state();assert(JSON.stringify(a.counts)===JSON.stringify(b.counts)&&JSON.stringify(a.transforms)===JSON.stringify(b.transforms),`Reduced motion adults moved ${JSON.stringify({a,b})}`);assert(b.motion==='reduced'&&b.next==='paused'&&b.kidAnim==='none',`Reduced motion not fully applied ${JSON.stringify(b)}`);check('R2 in-game Reduced Motion stops residents',JSON.stringify(b));await shot(page,'r2-reduced-home-390');
 await page.evaluate(()=>window.LatchlingsPrefs.set('motion','system'));await page.waitForTimeout(13000);const c=await state();assert(c.counts.some((n,i)=>n>b.counts[i]),`Residents did not deliberately resume ${JSON.stringify({b,c})}`);check('R2 residents resume when allowed',JSON.stringify(c));
 await settleGame(page,1);await page.waitForTimeout(300);const offA=await state();await page.waitForTimeout(13000);const offB=await state();assert(JSON.stringify(offA.counts)===JSON.stringify(offB.counts)&&JSON.stringify(offA.transforms)===JSON.stringify(offB.transforms),`Offscreen residents moved ${JSON.stringify({offA,offB})}`);assert(offB.scene==='false'&&offB.next==='paused',`Offscreen scheduler not paused ${JSON.stringify(offB)}`);check('R2 offscreen Little Home paused',JSON.stringify(offB));results.motion={reduced:b,resumed:c,offscreen:offB};await ctx.close();
}

// R3: read longer than old timer, then Back to board must start persistent highlight.
{
 const ctx=await makeContext({width:390,height:844},{motion:'reduced',textSize:'normal'});const page=await ctx.newPage();listen(page,'hint');page.setDefaultTimeout(20000);await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await settleGame(page,201);await page.click('#hintBtn');await page.waitForTimeout(3900);assert(await page.locator('.hint-focus').count()===0,'Hint highlighted behind modal before return');await page.click('#hintClose');await page.waitForTimeout(100);assert(await page.locator('.hint-focus').count()===2,`Hint not highlighted on board return, count=${await page.locator('.hint-focus').count()}`);await shot(page,'r3-hint-after-reading-390');await page.waitForTimeout(3900);assert(await page.locator('.hint-focus').count()===2,'Hint expired while player was on board');const dir=await page.locator('.dpad-hit.hint-focus').getAttribute('data-dir');await page.click(`.dpad-hit[data-dir="${dir}"]`);await page.waitForTimeout(80);assert(await page.locator('.hint-focus').count()===0,'Hint did not clear after suggested interaction');check('R3 persistent hint lifecycle',`direction=${dir}`);await ctx.close();
}

// R4 ancillary surfaces: modal, journal, cinematic narration/dialogue all grow under Large Text.
async function ancillaryFonts(textSize){const ctx=await makeContext({width:390,height:844},{motion:'reduced',textSize});const p=await ctx.newPage();listen(p,'ancillary-'+textSize);await p.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await p.evaluate(()=>{window.LatchlingsPrefs.set('textSize',document.documentElement.dataset.textSize);screen('story');updateStoryScreen?.()});await p.waitForTimeout(100);const story=await p.evaluate(()=>{const e=document.querySelector('.story-screen-card>p');return e?parseFloat(getComputedStyle(e).fontSize):0});await settleGame(p,201);await p.click('#pauseBtn');const modal=await p.locator('.modal p').evaluate(e=>parseFloat(getComputedStyle(e).fontSize));await p.click('#pauseResume');await p.evaluate(()=>window.LatchlingsCinematics.show('across-drift',{markSeen:false}));await p.waitForTimeout(160);const cin=await p.evaluate(()=>{const b=document.querySelector('.cin-ordered-dialogue-dock .cin-opening-bubble'),n=document.querySelector('.cinematic-lines .narrator-only');return {bubble:b?parseFloat(getComputedStyle(b).fontSize):0,narrator:n?parseFloat(getComputedStyle(n).fontSize):0}});window.__dummy=0;await p.evaluate(()=>window.LatchlingsCinematics.finish(true));await ctx.close();return {story,modal,...cin}}
const ancN=await ancillaryFonts('normal'),ancL=await ancillaryFonts('large');assert(ancL.story>ancN.story&&ancL.modal>ancN.modal&&ancL.bubble>ancN.bubble,`R4 ancillary text did not grow ${JSON.stringify({ancN,ancL})}`);if(ancN.narrator&&ancL.narrator)assert(ancL.narrator>ancN.narrator,`R4 narrator did not grow ${JSON.stringify({ancN,ancL})}`);check('R4 ancillary Large Text',JSON.stringify({normal:ancN,large:ancL}));results.fonts.ancillary={normal:ancN,large:ancL};

// R5: all 25 cinematic beats at 320x568 keep persistent footer navigation initially visible.
{
 const ctx=await makeContext({width:320,height:568},{motion:'reduced',textSize:'normal'});const p=await ctx.newPage();listen(p,'cinematics');p.setDefaultTimeout(20000);await p.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 const ids=['opening','across-drift','old-maps','homeward'];let count=0;
 for(const id of ids){await p.evaluate(id=>window.LatchlingsCinematics.show(id,{markSeen:false}),id);await p.waitForTimeout(120);const beats=await p.evaluate(id=>window.LatchlingsCinematics.CINEMATICS[id].beats.length,id);for(let i=0;i<beats;i++){await p.waitForTimeout(80);const x=await p.evaluate(()=>{const copy=document.querySelector('.cinematic-copy'),footer=document.querySelector('.cinematic-footer'),next=document.getElementById('cinematicNext'),skip=document.getElementById('cinematicSkip'),prog=document.getElementById('cinematicProgress'),shell=document.querySelector('.cinematic-shell');const rect=e=>{const r=e.getBoundingClientRect();return {t:r.top,b:r.bottom,l:r.left,r:r.right,w:r.width,h:r.height}};return {beat:window.LatchlingsCinematics.beat,copy:rect(copy),footer:rect(footer),next:rect(next),skip:rect(skip),prog:rect(prog),shell:rect(shell),nextInCopy:copy.contains(next),footerContains:footer.contains(next),copyScroll:copy.scrollHeight>copy.clientHeight,scrollTop:copy.scrollTop}});assert(!x.nextInCopy&&x.footerContains,`${id} ${i+1} Continue still inside scroll ${JSON.stringify(x)}`);assert(x.next.b<=568+1&&x.skip.b<=568+1&&x.prog.b<=568+1,`${id} ${i+1} navigation below viewport ${JSON.stringify(x)}`);assert(x.next.h>=44&&x.skip.h>=44,`${id} ${i+1} nav target below 44 ${JSON.stringify(x)}`);assert(x.footer.t>=x.copy.b-1,`${id} ${i+1} footer overlaps copy ${JSON.stringify(x)}`);results.cinematics.push({id,beat:i+1,...x});count++;if(id==='across-drift'&&i===1)await shot(p,'r5-across-drift-beat2-320');if(i<beats-1)await p.click('#cinematicNext')}
 await p.evaluate(()=>window.LatchlingsCinematics.finish(true));}
 assert(count===25,`Expected 25 cinematic beats, got ${count}`);check('R5 all 25 cinematic beats keep visible persistent navigation',`beats=${count}`);await ctx.close();
}

// Real authored solution smoke across all chapter endpoints plus Level 1.
{
 const ctx=await makeContext({width:390,height:844},{motion:'reduced',textSize:'normal'});const p=await ctx.newPage();listen(p,'solutions');p.setDefaultTimeout(30000);await p.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 for(const L of [1,50,100,150,200,250,300,350,400]){await settleGame(p,L);const sol=await p.evaluate(L=>LEVELS[L-1].solution.map(x=>[x[0],x[1]]),L);for(const [pi,d] of sol){const piece=p.locator(`.latchling[data-pi="${pi}"]`);if(!(await piece.evaluate(e=>e.classList.contains('selected'))))await piece.click();await p.evaluate(async d=>{await moveSelected(d)},d)}await p.waitForTimeout(30);const left=await p.locator('#pieceLayer .latchling').count();assert(left===0,`Level ${L} authored solution left ${left} pieces`);results.solutions[L]=sol.length;try{document}catch{};await p.evaluate(()=>{const o=document.getElementById('overlay');if(o)o.classList.remove('show');const r=document.querySelector('.chapter-reward-card');if(r)r.remove()})}check('Authored solution smoke',JSON.stringify(results.solutions));await ctx.close();
}

// Daily isolation smoke: starting a Daily route must not mutate campaign progress or cinematic state.
{
 const ctx=await makeContext({width:390,height:844},{motion:'reduced',textSize:'normal'},1);const p=await ctx.newPage();listen(p,'daily');await p.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});const before=await p.evaluate(()=>({progress:localStorage.getItem('latchlings_campaign400_progress_v1'),seen:localStorage.getItem('latchlings_cinematics_seen_v1')}));await p.evaluate(()=>startDailyPuzzle());await p.waitForTimeout(100);const after=await p.evaluate(()=>({progress:localStorage.getItem('latchlings_campaign400_progress_v1'),seen:localStorage.getItem('latchlings_cinematics_seen_v1'),mode:document.body.dataset.playMode,slice:document.getElementById('game').dataset.visualSlice||''}));assert(before.progress===after.progress&&before.seen===after.seen&&after.mode==='daily'&&!after.slice,`Daily isolation regression ${JSON.stringify({before,after})}`);check('Daily isolation smoke',JSON.stringify(after));await ctx.close();
}

assert(results.errors.length===0,'Browser errors: '+JSON.stringify(results.errors));
fs.writeFileSync(`${OUT}/results.json`,JSON.stringify(results,null,2));
await browser.close();
console.log('R1-R5 ACCEPTANCE PASSED');
