import { chromium } from 'playwright';
import fs from 'node:fs';

const base='http://127.0.0.1:4173/';
const out='story-presentation-audit';
fs.mkdirSync(out,{recursive:true});
const report={opening:[],rails:[],errors:[]};
function assert(ok,msg){if(!ok)throw new Error(msg)}

async function newPage(browser,dpr=1,reducedMotion='no-preference'){
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:dpr,reducedMotion});
  const page=await context.newPage();
  page.on('pageerror',e=>report.errors.push(`pageerror: ${e.message}`));
  page.on('console',m=>{if(m.type()==='error')report.errors.push(`console: ${m.text()}`)});
  await page.goto(base,{waitUntil:'networkidle'});
  return {context,page};
}

async function inspectOpening(page,dpr){
  const shown=await page.evaluate(()=>window.LatchlingsCinematics?.show('opening',{markSeen:false}));
  assert(shown===true,`opening did not show at DPR ${dpr}`);
  for(let i=0;i<8;i++){
    await page.waitForFunction(i=>window.LatchlingsCinematics?.beat===i,i);
    await page.waitForTimeout(140);
    const data=await page.evaluate(i=>{
      const stage=document.getElementById('cinematicStage');
      const copy=document.querySelector('.cinematic-copy');
      const dock=copy?.querySelector(':scope > .cin-opening-dialogue-dock');
      const sr=stage?.getBoundingClientRect(),dr=dock?.getBoundingClientRect();
      const beat=window.LatchlingsCinematics?.CINEMATICS?.opening?.beats?.[i];
      const expectedGroups=new Set((beat?.lines||[]).filter(x=>x?.[0]!=='Narrator').map(x=>x[0])).size;
      const bubbles=[...(dock?.querySelectorAll('.cin-opening-bubble')||[])].map(b=>({clientHeight:b.clientHeight,scrollHeight:b.scrollHeight,text:b.textContent.trim()}));
      const next=document.getElementById('cinematicNext'),skip=document.getElementById('cinematicSkip');
      return {
        expectedGroups,
        stageLayers:stage?.querySelectorAll(':scope > .cin-dialogue-layer').length||0,
        dock:!!dock,
        dockGroups:dock?.querySelectorAll('.cin-opening-dialogue-row').length||0,
        castChips:dock?.querySelectorAll('.cin-opening-cast-chip').length||0,
        separated:!dock||!sr||!dr||dr.top>=sr.bottom-1,
        bubbles,
        horizontalOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
        nextUsable:!!next&&!next.disabled&&getComputedStyle(next).display!=='none',
        skipUsable:!!skip&&!skip.disabled&&getComputedStyle(skip).display!=='none',
        narrator:(document.getElementById('cinematicLines')?.innerText||'').trim(),
        dockText:(dock?.innerText||'').trim()
      };
    },i);
    assert(data.stageLayers===0,`opening beat ${i+1} still overlays dialogue on the stage at DPR ${dpr}`);
    assert(data.dock===Boolean(data.expectedGroups),`opening beat ${i+1} dock presence mismatch at DPR ${dpr}`);
    assert(data.dockGroups===data.expectedGroups,`opening beat ${i+1} speaker group mismatch at DPR ${dpr}`);
    assert(data.separated,`opening beat ${i+1} dialogue overlaps scenic stage at DPR ${dpr}`);
    assert(data.bubbles.every(b=>b.scrollHeight<=b.clientHeight+1),`opening beat ${i+1} clipped dialogue at DPR ${dpr}`);
    assert(data.horizontalOverflow<=1,`opening beat ${i+1} horizontal overflow ${data.horizontalOverflow}px at DPR ${dpr}`);
    assert(data.nextUsable&&data.skipUsable,`opening beat ${i+1} lost cinematic controls at DPR ${dpr}`);
    if(i===1)assert(data.castChips===5,`opening beat 2 lost five-resident identity key at DPR ${dpr}`);
    report.opening.push({dpr,beat:i+1,...data});
    if(dpr===1&&[1,2,4,7].includes(i))await page.screenshot({path:`${out}/opening-dpr1-beat-${i+1}.png`,fullPage:true});
    if(i<7){await page.locator('#cinematicNext').scrollIntoViewIfNeeded();await page.locator('#cinematicNext').click();}
  }
  await page.evaluate(()=>window.LatchlingsCinematics?.finish(true));
}

async function inspectRails(page){
  const levels=[1,17,111,241,351];
  for(const level of levels){
    await page.evaluate(level=>{
      document.querySelectorAll('#app>.screen').forEach(s=>s.classList.remove('active'));
      document.getElementById('game')?.classList.add('active');
      document.body.dataset.screen='game';
      const title=document.getElementById('levelTitle');if(title)title.textContent=`Level ${level}`;
      const meta=window.LATCHLINGS_STORY?.levelMeta(level);
      window.LatchlingsStoryTheme?.decorateLevel(level,meta);
      window.LatchlingsStoryRail?.render();
    },level);
    await page.waitForTimeout(100);
    const collapsed=await page.evaluate(()=>{
      const host=document.getElementById('mechanicNote'),rail=host?.querySelector('.story-level-rail'),p=rail?.querySelector('.story-rail-main p'),toggle=rail?.querySelector('.story-rail-toggle');
      const hr=host?.getBoundingClientRect();
      return {height:hr?.height||0,hasToggle:!!toggle,label:toggle?.textContent.trim(),expanded:toggle?.getAttribute('aria-expanded'),pScroll:p?.scrollHeight||0,pClient:p?.clientHeight||0,fullText:p?.textContent.trim()||'',horizontalOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
    });
    assert(collapsed.height>=90&&collapsed.height<=100,`level ${level} collapsed rail height ${collapsed.height}`);
    assert(collapsed.hasToggle&&collapsed.label==='Read all'&&collapsed.expanded==='false',`level ${level} lacks explicit Read all affordance`);
    assert(collapsed.horizontalOverflow<=1,`level ${level} collapsed rail horizontal overflow`);
    if(level===17)await page.screenshot({path:`${out}/rail-level-17-collapsed.png`,fullPage:true});
    await page.locator('.story-rail-toggle').click();
    await page.waitForTimeout(60);
    const expanded=await page.evaluate(()=>{
      const host=document.getElementById('mechanicNote'),rail=host?.querySelector('.story-level-rail'),p=rail?.querySelector('.story-rail-main p'),toggle=rail?.querySelector('.story-rail-toggle'),full=rail?.querySelector('.story-rail-full');
      return {height:host?.getBoundingClientRect().height||0,railExpanded:rail?.classList.contains('is-expanded'),aria:toggle?.getAttribute('aria-expanded'),label:toggle?.textContent.trim(),pScroll:p?.scrollHeight||0,pClient:p?.clientHeight||0,overflow:getComputedStyle(p).overflow,fullVisible:!!full&&getComputedStyle(full).display!=='none',horizontalOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
    });
    assert(expanded.railExpanded&&expanded.aria==='true'&&expanded.label==='Collapse',`level ${level} did not expand`);
    assert(expanded.height>collapsed.height,`level ${level} expanded rail did not grow`);
    assert(expanded.pScroll<=expanded.pClient+1||expanded.overflow==='visible',`level ${level} expanded text is clipped`);
    assert(expanded.fullVisible,`level ${level} full-story action missing when expanded`);
    assert(expanded.horizontalOverflow<=1,`level ${level} expanded rail horizontal overflow`);
    const pseudo=await page.evaluate(()=>getComputedStyle(document.getElementById('storyCardBtn'),'::after').content);
    assert(pseudo.includes('Story'),`level ${level} top-right story button lacks visible Story label`);
    if(level===17)await page.screenshot({path:`${out}/rail-level-17-expanded.png`,fullPage:true});
    await page.locator('.story-rail-full').click();
    await page.waitForTimeout(80);
    const card=await page.evaluate(()=>{const o=document.getElementById('storyCardOverlay');return {shown:o?.classList.contains('show'),level:o?.dataset.level||'',title:document.getElementById('storyCardTitle')?.textContent||''}});
    assert(card.shown&&Number(card.level)===level,`level ${level} rail full-story action did not open matching Story card`);
    report.rails.push({level,collapsed,expanded,card});
    await page.locator('#storyCardClose').click();
    await page.locator('.story-rail-toggle').click();
    await page.waitForTimeout(40);
  }
}

const browser=await chromium.launch({headless:true});
try{
  for(const dpr of [1,3]){
    const {context,page}=await newPage(browser,dpr);
    await inspectOpening(page,dpr);
    if(dpr===1)await inspectRails(page);
    await context.close();
  }
  const {context,page}=await newPage(browser,1,'reduce');
  await page.evaluate(()=>window.LatchlingsCinematics?.show('opening',{markSeen:false}));
  for(let i=0;i<8;i++){
    await page.waitForTimeout(80);
    const stageLayers=await page.evaluate(()=>document.getElementById('cinematicStage')?.querySelectorAll(':scope > .cin-dialogue-layer').length||0);
    assert(stageLayers===0,`reduced-motion opening beat ${i+1} restored stage overlay`);
    if(i<7){await page.locator('#cinematicNext').scrollIntoViewIfNeeded();await page.locator('#cinematicNext').click();}
  }
  await context.close();
  assert(report.errors.length===0,`browser errors: ${report.errors.join(' | ')}`);
  fs.writeFileSync(`${out}/report.json`,JSON.stringify(report,null,2));
  console.log(`STORY_PRESENTATION_ACCEPTED opening=${report.opening.length} rails=${report.rails.length}`);
} finally {
  await browser.close();
}
