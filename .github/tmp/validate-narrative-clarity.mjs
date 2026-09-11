import { chromium } from 'playwright';
import fs from 'node:fs';

const out='/tmp/narrative-clarity-audit';
fs.mkdirSync(out,{recursive:true});
const report={opening:[],storyCards:{},rails:[],milestones:[],atlas:[],briefings:{},laterCinematics:{},ending:{},errors:[]};
const browser=await chromium.launch({headless:true});

async function auditAtDpr(dpr){
 const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:dpr});
 const page=await ctx.newPage();
 page.on('pageerror',e=>report.errors.push(`dpr${dpr} pageerror: ${e}`));
 page.on('console',m=>{if(m.type()==='error')report.errors.push(`dpr${dpr} console: ${m.text()}`)});
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'load'});
 await page.evaluate(()=>{
   localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked:400,stars:{}}));
   localStorage.removeItem('latchlings_story_cards_seen_v1');
   localStorage.removeItem('latchlings_cinematics_seen_v1');
 });
 await page.reload({waitUntil:'load'});
 await page.waitForFunction(()=>window.LatchlingsCinematics&&window.LATCHLINGS_STORY&&window.LatchlingsStoryTheme&&window.LatchlingsStoryRail);

 // Canonical model audit.
 const model=await page.evaluate(()=>{
   const S=window.LATCHLINGS_STORY;
   const starts=[],nonstarts=[];
   for(let ch=1;ch<=8;ch++){
     for(const local of [1,11,21,31,41])starts.push({level:(ch-1)*50+local,ok:window.LatchlingsStoryTheme.autoEligible(S.levelMeta((ch-1)*50+local))});
     for(const local of [10,20,30,40,50])nonstarts.push({level:(ch-1)*50+local,ok:window.LatchlingsStoryTheme.autoEligible(S.levelMeta((ch-1)*50+local))});
   }
   const milestones=Array.from({length:40},(_,i)=>(Math.floor(i/5))*50+((i%5)+1)*10).map(level=>({level,beat:S.beatForLevel(level)}));
   const arcs=S.chapters.map((c,i)=>({chapter:i+1,name:c.name,movements:c.arc?.movements?.length,goal:c.arc?.chapterGoal,objective:c.arc?.atlasObjective,outcome:c.arc?.outcome}));
   const early=S.campaignBriefing({unlocked:1,stars:{}});
   const midStars={50:3,100:3,150:3,200:3,210:3,220:3,230:3};
   const mid=S.campaignBriefing({unlocked:234,stars:midStars}),midJourney=S.journeyFor({unlocked:234,stars:midStars});
   const lateStars={};for(let x=50;x<=350;x+=50)lateStars[x]=3;for(let x=360;x<=390;x+=10)lateStars[x]=3;
   const late=S.campaignBriefing({unlocked:400,stars:lateStars}),lateJourney=S.journeyFor({unlocked:400,stars:lateStars});
   return {starts,nonstarts,milestones,arcs,early,mid,midJourney,late,lateJourney,why:S.whyWaykeeper,goal:S.campaignGoal,pressure:S.antagonisticPressure};
 });
 if(model.starts.some(x=>!x.ok))throw new Error(`movement-start cards missing: ${JSON.stringify(model.starts.filter(x=>!x.ok))}`);
 if(model.nonstarts.some(x=>x.ok))throw new Error(`milestone cards still auto-trigger: ${JSON.stringify(model.nonstarts.filter(x=>x.ok))}`);
 if(model.arcs.some(a=>a.movements!==5||!a.goal||!a.objective||!a.outcome))throw new Error('chapter arc coverage incomplete');
 if(model.milestones.some(x=>!x.beat?.resultLabel||!x.beat?.nextLead||!x.beat?.questionResolved))throw new Error('milestone enrichment incomplete');
 if(model.midJourney.length!==5||model.midJourney.some(j=>j.chapter>5))throw new Error(`mid journey spoiler/coverage issue ${JSON.stringify(model.midJourney)}`);
 if(model.lateJourney.length!==8)throw new Error('late journey missing chapters');
 if(!/You answered it/i.test(model.why)||!/living network/i.test(model.goal)||!/no villain/i.test(model.pressure))throw new Error('campaign briefing thesis incomplete');
 report.milestones=model.milestones.map(x=>({level:x.level,label:x.beat.resultLabel,next:x.beat.nextLead}));
 report.briefings={early:model.early,mid:model.mid,midJourney:model.midJourney,late:model.late,lateJourney:model.lateJourney};

 // Opening: render every beat and verify player-facing essentials + layout.
 await page.evaluate(()=>window.LatchlingsCinematics.show('opening',{markSeen:false}));
 await page.waitForSelector('#cinematicOverlay.show');
 const beatCount=await page.evaluate(()=>window.LatchlingsCinematics.CINEMATICS.opening.beats.length);
 if(beatCount!==8)throw new Error(`opening beat count ${beatCount}`);
 const essentials={
   0:['Latchlands','moving'],
   1:['Little Home','Pippa','Bramble','Rowan','Pip','Tansy'],
   2:['routes','same'],
   3:['Skyway','drift'],
   4:['Waykeeper','You answer'],
   5:['island','route'],
   6:['direction','nest'],
   7:['Sunpetal','larger']
 };
 for(let i=0;i<beatCount;i++){
   await page.waitForFunction(index=>window.LatchlingsCinematics.beat===index,i);
   await page.waitForTimeout(90);
   const state=await page.evaluate(()=>{
     const o=document.getElementById('cinematicOverlay'),shell=o.querySelector('.cinematic-shell'),stage=document.getElementById('cinematicStage');
     const text=[document.getElementById('cinematicBeat')?.textContent,document.getElementById('cinematicLines')?.textContent,stage?.textContent].join(' ');
     const r=shell.getBoundingClientRect();
     return {beat:window.LatchlingsCinematics.beat,text,dialogue:o.dataset.dialogueCount||'0',shell:{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height},scrollW:shell.scrollWidth,clientW:shell.clientWidth};
   });
   for(const needle of essentials[i])if(!state.text.toLowerCase().includes(needle.toLowerCase()))throw new Error(`opening beat ${i+1} missing ${needle}: ${state.text}`);
   if(state.shell.left<-1||state.shell.right>391||state.scrollW>state.clientW+2)throw new Error(`opening horizontal overflow beat ${i+1}: ${JSON.stringify(state)}`);
   if(i===1){
     const cast=await page.evaluate(()=>[...document.querySelectorAll('.cin-cast-intro .cin-intro-person')].map(x=>x.textContent.replace(/\s+/g,' ').trim()));
     if(cast.length!==5||!['Pippa','Bramble','Rowan','Pip','Tansy'].every(n=>cast.some(x=>x.includes(n))))throw new Error(`opening cast intro incomplete ${JSON.stringify(cast)}`);
     if(dpr===1)await page.screenshot({path:`${out}/opening-cast-dpr1.png`});
     if(dpr===3)await page.screenshot({path:`${out}/opening-cast-dpr3.png`});
   }
   if(i===2){
     // Watch a dialogue-heavy beat for the geometry flicker that was fixed previously.
     const samples=[];
     for(let k=0;k<24;k++){
       samples.push(await page.evaluate(()=>[...document.querySelectorAll('.cin-speech-bubble')].map(b=>{const r=b.getBoundingClientRect();return [b.parentElement?.dataset?.speaker,Math.round(r.x*10)/10,Math.round(r.y*10)/10,Math.round(r.width*10)/10,Math.round(r.height*10)/10,+getComputedStyle(b).opacity]})));
       await page.waitForTimeout(17);
     }
     const first=JSON.stringify(samples[0]);if(samples.some(s=>JSON.stringify(s)!==first))throw new Error(`opening dialogue geometry changed during stable beat at dpr${dpr}`);
   }
   if(i===4&&dpr===1)await page.screenshot({path:`${out}/opening-waykeeper-call.png`});
   if(i===7&&dpr===1)await page.screenshot({path:`${out}/opening-objective.png`});
   report.opening.push({dpr,index:i+1,label:await page.textContent('#cinematicBeat'),dialogue:state.dialogue});
   if(i<beatCount-1)await page.click('#cinematicNext');
 }
 await page.click('#cinematicNext');
 await page.waitForFunction(()=>!window.LatchlingsCinematics.active);

 // Story Card movement framing, objective/stakes, and non-spoiler trigger contract.
 await page.evaluate(()=>window.LatchlingsStoryTheme.show(11,false));
 await page.waitForSelector('#storyCardOverlay.show');
 const card=await page.evaluate(()=>({kind:document.getElementById('storyCardKind').textContent,title:document.getElementById('storyCardTitle').textContent,objective:document.getElementById('storyCardObjective').textContent.replace(/\s+/g,' ').trim(),scrollW:document.getElementById('storyCardPanel').scrollWidth,clientW:document.getElementById('storyCardPanel').clientWidth}));
 if(card.kind!=='New lead'||!card.objective.includes('Current question')||!card.objective.includes('current observations'))throw new Error(`movement card incorrect ${JSON.stringify(card)}`);
 if(card.scrollW>card.clientW+2)throw new Error('story card horizontal overflow');
 report.storyCards.level11=card;
 if(dpr===1)await page.screenshot({path:`${out}/story-card-level11.png`});
 await page.click('#storyCardContinue');

 // Representative gameplay rail from all 8 chapters x 5 movements.
 for(let ch=1;ch<=8;ch++){
   for(let phase=0;phase<5;phase++){
     const level=(ch-1)*50+phase*10+1;
     await page.evaluate(L=>{
       document.body.dataset.screen='game';
       document.querySelectorAll('.screen').forEach(x=>x.classList.toggle('active',x.id==='game'));
       document.getElementById('levelTitle').textContent='Level '+L;
       document.getElementById('mechanicNote').dataset.storyRailLevel='';
       window.LatchlingsStoryRail.render();
     },level);
     const rail=await page.evaluate(()=>({level:document.getElementById('levelTitle').textContent,title:document.querySelector('.story-rail-movement')?.textContent,thread:document.querySelector('.story-rail-thread')?.textContent,hostH:document.getElementById('mechanicNote').getBoundingClientRect().height,scrollW:document.querySelector('.story-level-rail')?.scrollWidth,clientW:document.querySelector('.story-level-rail')?.clientWidth}));
     if(!rail.title||!rail.thread?.startsWith('Question:'))throw new Error(`rail missing movement thread at ${level}: ${JSON.stringify(rail)}`);
     if(Math.abs(rail.hostH-94)>1.5||rail.scrollW>rail.clientW+2)throw new Error(`rail footprint regression at ${level}: ${JSON.stringify(rail)}`);
     report.rails.push({chapter:ch,phase:phase+1,level,title:rail.title,thread:rail.thread});
   }
 }

 // Atlas: current chapter gets a question, completed gets result, future gets no plot answer.
 await page.evaluate(()=>{
   const stars={50:3,100:3};localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked:121,stars}));location.reload();
 });
 await page.waitForFunction(()=>window.LatchlingsHomeAction&&window.LATCHLINGS_STORY);
 await page.evaluate(()=>window.LatchlingsHomeAction('levels'));
 await page.waitForSelector('#levels.active');
 await page.waitForTimeout(480);
 const atlasCurrent=await page.evaluate(()=>({text:document.querySelector('.atlas-chapter-objective')?.textContent.replace(/\s+/g,' ').trim(),head:document.querySelector('.atlas-chapter-head')?.getBoundingClientRect().height}));
 if(!atlasCurrent.text?.includes('Current question')||atlasCurrent.head>125)throw new Error(`current Atlas objective bad ${JSON.stringify(atlasCurrent)}`);
 if(dpr===1)await page.screenshot({path:`${out}/atlas-current-question.png`});
 const atlasLines=await page.evaluate(()=>{const S=window.LATCHLINGS_STORY,p={unlocked:121,stars:{50:3,100:3}};return Array.from({length:8},(_,i)=>({chapter:i+1,...S.chapterAtlasLine(i+1,p)}))});
 if(atlasLines[0].label!=='Region restored'||atlasLines[1].label!=='Region restored'||atlasLines[2].label!=='Current question')throw new Error(`Atlas status labels wrong ${JSON.stringify(atlasLines)}`);
 if(atlasLines.slice(3).some(x=>x.label!=='Ahead on the Skyway'||/automation|master|historical map|Waykeeper network/i.test(x.text)))throw new Error(`future Atlas spoiler ${JSON.stringify(atlasLines.slice(3))}`);
 report.atlas=atlasLines;

 // Story & Residents is a real catch-up surface.
 await page.evaluate(()=>window.openStoryScreen());
 await page.waitForSelector('#story.active');
 const storyScreen=await page.evaluate(()=>({brief:document.getElementById('storyBriefing').textContent.replace(/\s+/g,' ').trim(),journey:[...document.querySelectorAll('#storyJourney .story-journey-item')].map(x=>x.textContent.replace(/\s+/g,' ').trim()),residentContrib:[...document.querySelectorAll('#storyCast .story-person-contribution')].map(x=>x.textContent),bodyScrollW:document.documentElement.scrollWidth,bodyClientW:document.documentElement.clientWidth}));
 if(!storyScreen.brief.includes('Why you’re here')||!storyScreen.brief.includes('Current question')||!storyScreen.brief.includes('What we know'))throw new Error(`story briefing incomplete ${JSON.stringify(storyScreen)}`);
 if(storyScreen.journey.length!==3||storyScreen.residentContrib.length!==5)throw new Error(`story journey/residents incomplete ${JSON.stringify(storyScreen)}`);
 if(storyScreen.bodyScrollW>storyScreen.bodyClientW+2)throw new Error('Story & Residents horizontal overflow');
 if(dpr===1)await page.screenshot({path:`${out}/story-residents-midcampaign.png`,fullPage:true});

 // Later cinematics remain present and preserve their mental-model shifts.
 const later=await page.evaluate(()=>Object.fromEntries(['across-drift','old-maps','homeward'].map(id=>[id,{beats:window.LatchlingsCinematics.CINEMATICS[id].beats.length,text:window.LatchlingsCinematics.CINEMATICS[id].beats.flatMap(b=>b.lines.map(x=>x[1])).join(' ')}])));
 if(later['across-drift'].beats!==5||!/yesterday’s map cannot be the answer/i.test(later['across-drift'].text))throw new Error('Across the Drift changed incorrectly');
 if(later['old-maps'].beats!==6||!/Skyway stopped changing/i.test(later['old-maps'].text))throw new Error('Old Maps revelation missing');
 if(later.homeward.beats!==6||!/not a master switch/i.test(later.homeward.text))throw new Error('Homeward revelation missing');
 report.laterCinematics=later;

 // Ending explicitly lands no master switch / no final map / living Skyway.
 await page.evaluate(()=>{document.querySelectorAll('.screen').forEach(x=>x.classList.toggle('active',x.id==='complete'));document.body.dataset.screen='complete'});
 const ending=await page.evaluate(()=>({text:document.getElementById('complete').textContent.replace(/\s+/g,' ').trim(),scrollW:document.getElementById('complete').scrollWidth,clientW:document.getElementById('complete').clientWidth}));
 for(const phrase of ['Skyway Restored','No master switch','No final map','A living Skyway','Ordinary life continues'])if(!ending.text.includes(phrase))throw new Error(`ending missing ${phrase}`);
 if(ending.scrollW>ending.clientW+2)throw new Error('ending horizontal overflow');
 report.ending={dpr,text:ending.text};
 if(dpr===1)await page.screenshot({path:`${out}/skyway-restored.png`,fullPage:true});
 await ctx.close();
}

await auditAtDpr(1);
await auditAtDpr(3);

// Reduced motion: all eight opening beats/content remain, but animation should be suppressed by CSS/media behavior.
const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
const rp=await reduced.newPage();
await rp.goto('http://127.0.0.1:4173/',{waitUntil:'load'});
await rp.waitForFunction(()=>window.LatchlingsCinematics);
await rp.evaluate(()=>window.LatchlingsCinematics.show('opening',{markSeen:false}));
for(let i=0;i<8;i++){
 await rp.waitForFunction(index=>window.LatchlingsCinematics.beat===index,i);
 const content=await rp.locator('#cinematicOverlay').textContent();if(!content?.trim())throw new Error(`reduced-motion opening blank at beat ${i+1}`);
 if(i<7)await rp.click('#cinematicNext');
}
await rp.click('#cinematicNext');
await rp.waitForFunction(()=>!window.LatchlingsCinematics.active);
report.reducedMotion={openingBeats:8,completed:true};
await reduced.close();
await browser.close();

if(report.errors.length)throw new Error(report.errors.join(' | '));
fs.writeFileSync(`${out}/report.json`,JSON.stringify(report,null,2));
console.log(`NARRATIVE_CLARITY_ACCEPTED opening=${report.opening.length} rails=${report.rails.length} milestones=${report.milestones.length} atlas=${report.atlas.length}`);
