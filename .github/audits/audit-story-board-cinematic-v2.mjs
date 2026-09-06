import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT='audit-v2';
fs.mkdirSync(`${OUT}/gameplay`,{recursive:true});
fs.mkdirSync(`${OUT}/cinematic`,{recursive:true});
const fail=m=>{throw new Error(m)};
const overlap=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
const rectObj=r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height});

const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844}});
await context.addInitScript(()=>{
  const storySeen={};for(let i=1;i<=400;i++)storySeen[i]=1;
  localStorage.setItem('latchlings_story_cards_seen_v1',JSON.stringify(storySeen));
  localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1,'across-drift':1,'old-maps':1,homeward:1}));
  localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked:400,stars:{}}));
});
const page=await context.newPage();
page.setDefaultTimeout(8000);
const errors=[];
page.on('pageerror',e=>errors.push('pageerror: '+e.message));
page.on('console',m=>{if(m.type()==='error'&&!/favicon|ERR_ABORTED|Failed to load resource/i.test(m.text()))errors.push('console: '+m.text())});
await page.goto('http://127.0.0.1:8080/',{waitUntil:'domcontentloaded'});
await page.waitForFunction(()=>window.LatchlingsStoryRail&&window.LatchlingsCinematicGeometry&&window.LatchlingsCinematicDialogue&&typeof startLevel==='function');

// Gameplay acceptance: all 50 Sunpetal levels, with focal captures at movement boundaries/milestones.
const gameplay=[];
const phaseLooks=new Map();
let railHeight=null;
for(let level=1;level<=50;level++){
  await page.evaluate(n=>{
    if(window.LatchlingsCinematics?.active)window.LatchlingsCinematics.finish(true);
    window.LatchlingsStoryTheme?.close(false);
    startLevel(n);
    window.LatchlingsStoryTheme?.close(false);
    window.LatchlingsStoryRail?.render();
  },level);
  await page.waitForFunction(n=>document.getElementById('mechanicNote')?.dataset.storyRailLevel===String(n),level);
  const d=await page.evaluate(()=>{
    const game=document.getElementById('game'),rail=document.querySelector('.story-level-rail'),board=document.getElementById('board'),cell=board.querySelector('.cell'),props=document.getElementById('levelProps'),br=board.getBoundingClientRect();
    return {
      level:+document.getElementById('levelTitle').textContent.replace(/\D/g,''),
      phase:+game.dataset.storyPhase,slot:+game.dataset.storySlot,milestone:game.dataset.storyMilestone,
      railHeight:rail.getBoundingClientRect().height,speaker:document.querySelector('.story-rail-person>strong')?.textContent,
      line:document.querySelector('.story-rail-main p')?.innerText,count:document.querySelector('.story-rail-count')?.textContent,
      movement:document.querySelector('.story-rail-movement')?.textContent,
      boardColor:getComputedStyle(board).backgroundColor,border:getComputedStyle(board).borderColor,
      cellRadius:getComputedStyle(cell).borderRadius,cellBorder:getComputedStyle(cell).borderColor,
      overflow:document.documentElement.scrollWidth-window.innerWidth,
      board:{left:br.left,right:br.right,top:br.top,bottom:br.bottom},
      oldEnv:!!document.getElementById('levelEnvironment'),
      propsVisible:!!props&&getComputedStyle(props).display!=='none'&&!props.hidden,
      medallions:document.querySelectorAll('.lv-subject-medallion,.level-prop').length,
      tip:!!document.querySelector('.mechanic-chip-label'),
      text:document.getElementById('game').innerText
    };
  });
  const local=level,phase=Math.floor((level-1)/10)+1,slot=(level-1)%10+1;
  if(d.level!==level||d.phase!==phase||d.slot!==slot)fail(`Gameplay state mismatch level ${level}: ${JSON.stringify(d)}`);
  if(d.milestone!==(level%10===0?'true':'false'))fail(`Milestone mismatch level ${level}`);
  if(d.oldEnv||d.propsVisible||d.medallions||d.tip)fail(`Rejected old presentation visible at ${level}: ${JSON.stringify(d)}`);
  if(!d.speaker||!d.line||!d.movement||d.count!==`${local} / 50`)fail(`Story rail incomplete level ${level}: ${JSON.stringify(d)}`);
  railHeight??=d.railHeight;if(Math.abs(d.railHeight-railHeight)>1.5)fail(`Story rail height drift: ${level} ${d.railHeight} vs ${railHeight}`);
  if(d.overflow>1||d.board.left<0||d.board.right>390.5)fail(`Gameplay overflow at ${level}: ${JSON.stringify(d)}`);
  if(/prototype error|command post|command center|implementation choice|development choice|requester|you didn.?t want|we are not going to/i.test(d.text))fail(`Development-facing text visible on level ${level}: ${d.text}`);
  if([1,11,21,31,41].includes(level))phaseLooks.set(phase,`${d.boardColor}|${d.border}|${d.cellRadius}|${d.cellBorder}`);
  if([1,10,11,20,21,30,31,40,41,50].includes(level))await page.screenshot({path:`${OUT}/gameplay/level-${String(level).padStart(2,'0')}.png`,fullPage:false,animations:'disabled'});
  gameplay.push(d);
}
if(new Set(phaseLooks.values()).size!==5)fail(`Sunpetal movement board identities are not distinct: ${JSON.stringify([...phaseLooks])}`);

// Representative story rails in every later chapter.
for(const level of [51,101,151,201,251,301,351]){
  await page.evaluate(n=>{window.LatchlingsStoryTheme?.close(false);startLevel(n);window.LatchlingsStoryTheme?.close(false);window.LatchlingsStoryRail?.render()},level);
  await page.waitForFunction(n=>document.getElementById('mechanicNote')?.dataset.storyRailLevel===String(n),level);
  await page.screenshot({path:`${OUT}/gameplay/chapter-${Math.ceil(level/50)}.png`,fullPage:false,animations:'disabled'});
}
fs.writeFileSync(`${OUT}/gameplay-manifest.json`,JSON.stringify({phaseLooks:[...phaseLooks],levels:gameplay},null,2));

// Opening cinematic acceptance.
await page.evaluate(()=>window.LatchlingsCinematics.show('opening',{markSeen:false}));
await page.waitForTimeout(220);
const opening=[];
for(let idx=0;idx<7;idx++){
  if(idx){await page.evaluate(()=>window.LatchlingsCinematics.next());await page.waitForTimeout(220)}
  const d=await page.evaluate(()=>{
    const stage=document.getElementById('cinematicStage'),sr=stage.getBoundingClientRect();
    const groups=[...stage.querySelectorAll(':scope > .cin-dialogue-layer')].map(layer=>[...layer.querySelectorAll('.cin-speech-bubble')].map(b=>{
      const r=b.getBoundingClientRect(),portrait=b.closest('[data-speaker]')?.querySelector('.dialogue-portrait')?.getBoundingClientRect(),tail=parseFloat(getComputedStyle(b).getPropertyValue('--cin-tail-x'))||50;
      const px=portrait?portrait.left+portrait.width/2:null,tailX=r.left+r.width*tail/100;
      return {speaker:b.closest('[data-speaker]')?.dataset.speaker,rect:rectObj(r),portrait:portrait?rectObj(portrait):null,tailX,tailError:px==null?999:Math.abs(tailX-px)};
    }));
    const pairs=window.LatchlingsCinematicGeometry.ROUTE_PAIRS;
    const routeSets=[...stage.querySelectorAll('.cin-islands')].map(islands=>{
      const geoms=islands.__latchRouteGeometry||[];
      return geoms.map((g,i)=>{
        if(!g)return null;
        const a=islands.querySelector(`:scope > .cin-island.${pairs[i][0]}`)?.getBoundingClientRect(),b=islands.querySelector(`:scope > .cin-island.${pairs[i][1]}`)?.getBoundingClientRect();
        const p1={x:sr.left+g.x1,y:sr.top+g.y1},p2={x:sr.left+g.x2,y:sr.top+g.y2};
        const inside=(p,r)=>!!r&&p.x>=r.left-2&&p.x<=r.right+2&&p.y>=r.top-2&&p.y<=r.bottom+2;
        return {from:pairs[i][0],to:pairs[i][1],startInside:inside(p1,a),endInside:inside(p2,b),g};
      }).filter(Boolean);
    });
    const trees=[...stage.querySelectorAll('.prop-tree[data-detailed-tree="true"]')].map(t=>({crowns:t.querySelectorAll('.cin-tree-crown').length,wood:getComputedStyle(t.querySelector('.cin-tree-trunk')).backgroundImage,grass:getComputedStyle(t.querySelector('.cin-tree-crown')).backgroundImage}));
    const beat=window.LatchlingsCinematics.beat+1;
    const focal=[];
    if(beat===2||beat===7){
      const frame=stage.querySelector('.cin-home-reference'),doc=frame?.contentDocument;
      if(frame&&doc){const fr=frame.getBoundingClientRect(),sx=fr.width/(frame.clientWidth||fr.width),sy=fr.height/(frame.clientHeight||fr.height);const candidates=[...doc.querySelectorAll('#c2 .window,#c2 .door,#c2 .cottage-window,#c2 .cottage-door,#c2 .cottage')];for(const el of candidates){const r=el.getBoundingClientRect();if(r.width&&r.height)focal.push({left:fr.left+r.left*sx,top:fr.top+r.top*sy,right:fr.left+r.right*sx,bottom:fr.top+r.bottom*sy})}}
    }
    if(beat===4){const r=stage.querySelector('.cin-compass')?.getBoundingClientRect();if(r)focal.push(rectObj(r))}
    if(beat===5){const r=stage.querySelector('.cin-helper-story')?.getBoundingClientRect();if(r)focal.push(rectObj(r))}
    if(beat===6){const r=stage.querySelector('.cin-demo-board')?.getBoundingClientRect();if(r)focal.push(rectObj(r))}
    const dialogue=[...stage.querySelectorAll('.cin-speech-bubble,.cin-dialogue-speaker .dialogue-portrait,.cin-intro-person .dialogue-portrait')].map(x=>rectObj(x.getBoundingClientRect()));
    const ov=focal.reduce((sum,f)=>sum+dialogue.reduce((s,r)=>s+Math.max(0,Math.min(r.right,f.right)-Math.max(r.left,f.left))*Math.max(0,Math.min(r.bottom,f.bottom)-Math.max(r.top,f.top)),0),0);
    return {beat,groups,routeSets,trees,focalOverlap:ov,stage:rectObj(sr),overflow:document.documentElement.scrollWidth-window.innerWidth,narratorLabel:/Narrator/i.test(document.getElementById('cinematicLines')?.textContent||'')};
  });
  if(d.overflow>1||d.narratorLabel)fail(`Opening overflow/narrator regression beat ${idx+1}: ${JSON.stringify(d)}`);
  for(const group of d.groups){
    if(!group.length)continue;
    const heights=group.map(x=>x.rect.height),tops=group.map(x=>x.rect.top);
    if(Math.max(...heights)-Math.min(...heights)>1.5||Math.max(...tops)-Math.min(...tops)>1.5)fail(`Bubble band not normalized beat ${idx+1}: ${JSON.stringify(group)}`);
    if(group.some(x=>x.tailError>3.5))fail(`Bubble tail misses speaker beat ${idx+1}: ${JSON.stringify(group)}`);
    if(group.some(x=>x.rect.left<d.stage.left-1||x.rect.right>d.stage.right+1||x.rect.top<d.stage.top-1||x.rect.bottom>d.stage.bottom+1))fail(`Bubble outside stage beat ${idx+1}: ${JSON.stringify(group)}`);
  }
  if(d.routeSets.flat().some(x=>!x.startInside||!x.endInside))fail(`Route detached from island beat ${idx+1}: ${JSON.stringify(d.routeSets)}`);
  if([0,2,3].includes(idx)&&(!d.trees.length||d.trees.some(t=>t.crowns!==3||!/wood\.jpg/.test(t.wood)||!/grass\.jpg/.test(t.grass))))fail(`Textured tree regression beat ${idx+1}: ${JSON.stringify(d.trees)}`);
  // Full focal rectangles are conservative. Allow a small amount of edge contact, but not meaningful cover.
  if(d.focalOverlap>150)fail(`Dialogue materially covers focal scene beat ${idx+1}: ${d.focalOverlap}`);
  if(idx===2){
    const samples=[];
    for(let s=0;s<4;s++){
      await page.waitForTimeout(180);
      samples.push(await page.evaluate(()=>{
        const stage=document.getElementById('cinematicStage'),sr=stage.getBoundingClientRect(),cargo=stage.querySelector('.cin-route-cargo'),geoms=cargo?.__latchRouteGeometry||[];
        const dist=(p,a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy||1,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/l)),x=a.x+t*dx,y=a.y+t*dy;return Math.hypot(p.x-x,p.y-y)};
        return [...(cargo?.querySelectorAll('i')||[])].map((el,i)=>{const r=el.getBoundingClientRect(),g=geoms[i],p={x:r.left+r.width/2-sr.left,y:r.top+r.height/2-sr.top};return {x:p.x,y:p.y,d:g?dist(p,{x:g.x1,y:g.y1},{x:g.x2,y:g.y2}):999}});
      }));
    }
    if(samples.flat().some(x=>x.d>2.5))fail(`Cargo is not on route: ${JSON.stringify(samples)}`);
    if(!samples[0].some((p,i)=>Math.hypot(p.x-samples.at(-1)[i].x,p.y-samples.at(-1)[i].y)>5))fail(`Cargo did not travel: ${JSON.stringify(samples)}`);
    d.cargo=samples;
  }
  opening.push(d);
  await page.screenshot({path:`${OUT}/cinematic/opening-${String(idx+1).padStart(2,'0')}.png`,fullPage:false,animations:'disabled'});
}
await page.evaluate(()=>window.LatchlingsCinematics.finish(false));

// Compact final beat, which has the busiest speech layout.
const compact=await browser.newContext({viewport:{width:390,height:700},reducedMotion:'reduce'});
const cp=await compact.newPage();cp.setDefaultTimeout(7000);
await cp.goto('http://127.0.0.1:8080/',{waitUntil:'domcontentloaded'});await cp.waitForFunction(()=>window.LatchlingsCinematics&&window.LatchlingsCinematicGeometry&&window.LatchlingsCinematicDialogue);
await cp.evaluate(()=>window.LatchlingsCinematics.show('opening',{markSeen:false}));for(let i=0;i<6;i++){await cp.evaluate(()=>window.LatchlingsCinematics.next());await cp.waitForTimeout(80)}await cp.waitForTimeout(160);
const compactData=await cp.evaluate(()=>{const stage=document.getElementById('cinematicStage'),sr=stage.getBoundingClientRect(),b=[...stage.querySelectorAll('.cin-speech-bubble')].map(x=>rectObj(x.getBoundingClientRect()));return {stage:rectObj(sr),b,overflow:document.documentElement.scrollWidth-window.innerWidth}});
if(compactData.overflow>1||compactData.b.some(r=>r.left<compactData.stage.left-1||r.right>compactData.stage.right+1||r.top<compactData.stage.top-1||r.bottom>compactData.stage.bottom+1))fail(`Compact final beat regression: ${JSON.stringify(compactData)}`);
await cp.screenshot({path:`${OUT}/cinematic/opening-07-compact.png`,fullPage:false,animations:'disabled'});await compact.close();

fs.writeFileSync(`${OUT}/cinematic-manifest.json`,JSON.stringify({opening,compactData},null,2));
if(errors.length)fail('Browser errors:\n'+errors.join('\n'));
await context.close();await browser.close();
console.log('VISUAL_ACCEPTANCE_V2_OK');
