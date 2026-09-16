const assert=require('assert');
const http=require('http');
const fs=require('fs');
const path=require('path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.mp3':'audio/mpeg','.wav':'audio/wav'};
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://127.0.0.1');const requested=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);const file=path.join(root,requested.endsWith('/')?requested+'index.html':requested);if(!file.startsWith(root)){res.writeHead(403).end();return}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(data)})});
function listen(){return new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))}
const expected=[
 ['Narrator','islands are always drifting'],['Narrator','Skyway moves with them'],['Narrator','Little Home'],
 ['Bramble','Breakfast incoming'],['Bramble','not our porch'],['Pippa','watering line missed'],
 ['Pip','shortcut missed'],['Tansy','supposed to reach'],['Pip','yesterday'],['Rowan','three different routes'],
 ['Narrator','Three matching misses'],['Pippa','something larger'],['Pippa','Waykeeper call'],
 ['Narrator','Waykeepers once helped'],['Narrator','sent the call'],['Narrator','you answered'],
 ['Bramble','bring what we know'],['Narrator','every real route becomes a puzzle'],
 ['Rowan','Sunpetal'],['Pippa','begin with breakfast'],['Pip','properly organized investigation']
];
(async()=>{
 await listen();const browser=await chromium.launch({channel:process.env.CI?undefined:'chrome',headless:true});const failures=[];
 for(const config of [{width:320,height:568,reducedMotion:'no-preference',textSize:'normal'},{width:390,height:844,reducedMotion:'no-preference',textSize:'normal'},{width:430,height:932,reducedMotion:'no-preference',textSize:'normal'},{width:320,height:568,reducedMotion:'no-preference',textSize:'large'},{width:390,height:844,reducedMotion:'reduce',textSize:'normal'}]){
  const {width,height}=config,context=await browser.newContext({viewport:{width,height},reducedMotion:config.reducedMotion});const page=await context.newPage();page.on('pageerror',e=>failures.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});await page.evaluate(textSize=>{LatchlingsPrefs.set('textSize',textSize);LatchlingsCinematics.show('opening',{markSeen:false})},config.textSize);await page.waitForTimeout(140);
  const count=await page.evaluate(()=>LatchlingsCinematics.CINEMATICS.opening.beats.flatMap(b=>b.lines).length);assert.equal(count,21,'opening should contain the approved 21-line screenplay');
  const rootHandle=await page.locator('.cin-opening-continuous').elementHandle();assert(rootHandle,'opening should render one continuous scene root');
  assert.equal(await page.locator('.opening-home-reference').count(),1,'opening must persist the canonical Little Home frame');
  await page.evaluate(()=>{window.__openingStepHistory=[1];new MutationObserver(()=>window.__openingStepHistory.push(Number(document.querySelector('.cin-opening-continuous').dataset.step))).observe(document.querySelector('.cin-opening-continuous'),{attributes:true,attributeFilter:['data-step']})});
  for(let step=1;step<=21;step++){
   await page.waitForTimeout(80);
   const state=await page.evaluate(()=>{const copyEl=document.querySelector('.cinematic-copy'),next=document.querySelector('#cinematicNext').getBoundingClientRect(),skip=document.querySelector('#cinematicSkip').getBoundingClientRect(),shell=document.querySelector('.cinematic-shell'),message=document.querySelector('.cin-opening-dialogue-dock')||document.querySelector('.cinematic-lines');return {step:Number(document.querySelector('.cin-opening-continuous')?.dataset.step),speaker:LatchlingsCinematics.CINEMATICS.opening.beats[LatchlingsCinematics.beat].lines[LatchlingsCinematics.line][0],copy:copyEl?.innerText||'',stage:document.querySelector('#cinematicStage')?.getBoundingClientRect().toJSON(),textZone:copyEl?.getBoundingClientRect().toJSON(),footer:document.querySelector('.cinematic-footer')?.getBoundingClientRect().toJSON(),next:next.toJSON(),skip:skip.toJSON(),gridRows:getComputedStyle(shell).gridTemplateRows,overflow:document.documentElement.scrollWidth>innerWidth,messageOverflow:message?message.scrollHeight>message.clientHeight+1:false,messageOverflowY:message?getComputedStyle(message).overflowY:'visible',textures:[...document.querySelectorAll('.opening-earth,.opening-grass,.opening-wood')].map(e=>getComputedStyle(e).backgroundImage),action:document.querySelector('.cin-opening-continuous')?.dataset.storyAction}});
   assert.equal(state.step,step,`visual state should follow spoken line ${step}`);assert.equal(state.speaker,expected[step-1][0]);assert(state.copy.includes(expected[step-1][1]),`line ${step} should include screenplay phrase`);assert(state.action,`line ${step} must expose a semantic story action`);assert(state.stage.bottom<=state.textZone.top+1,'scenery must not enter the text zone');assert(state.textZone.bottom<=state.footer.top+1,'text must not enter persistent controls');if(state.messageOverflow)assert(['auto','scroll'].includes(state.messageOverflowY),`overflowing ${config.textSize} copy must scroll inside its fixed message slot`);for(const control of [state.next,state.skip])assert(control.left>=0&&control.right<=width&&control.top>=0&&control.bottom<=height,'cinematic controls must stay inside the viewport');assert(!state.overflow,'page must not overflow horizontally');
   if(step===1){assert(state.textures.some(x=>x.includes('earth.jpg')));assert(state.textures.some(x=>x.includes('grass.jpg')));assert(state.textures.some(x=>x.includes('wood.jpg')))}
   if(step===18){const fit=await page.evaluate(()=>{const g=document.querySelector('.opening-board-grid').getBoundingClientRect(),m=document.querySelector('.opening-board-model').getBoundingClientRect();return g.left>=m.left-1&&g.right<=m.right+1&&g.top>=m.top-1&&g.bottom<=m.bottom+1});assert(fit,'the Level 1 model must remain inside its wooden frame')}
   const same=await page.locator('.cin-opening-continuous').elementHandle();assert(await rootHandle.evaluate((a,b)=>a===b,same),'scene root must persist between lines');
   if(step<21){await page.locator('#cinematicNext').click();await page.waitForTimeout(80)}
  }
  const connected=await page.evaluate(()=>[...document.querySelectorAll('.opening-route[data-target]')].map(route=>{const target=document.querySelector(route.dataset.target),len=route.getTotalLength(),p=route.getPointAtLength(len),m=route.getScreenCTM(),end=new DOMPoint(p.x,p.y).matrixTransform(m),box=target.getBoundingClientRect();return Math.hypot(end.x-(box.left+box.width/2),end.y-(box.top+box.height/2))}));assert.equal(connected.length,3);assert(connected.every(d=>d<3),`semantic route endpoints must meet their miss markers: ${connected}`);
  const history=await page.evaluate(()=>window.__openingStepHistory);assert(history.every((value,index)=>!index||value>=history[index-1]),`scene state must never flash backward between taps: ${history}`);
  await page.locator('#cinematicNext').click();await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>LatchlingsCinematics.active),null);await context.close();
 }
 await browser.close();server.close();assert.deepEqual(failures,[]);console.log('PASS opening continuous canonical-world contract');
})().catch(e=>{console.error(e);server.close();process.exit(1)});

