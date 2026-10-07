const assert=require('assert');
const http=require('http');
const fs=require('fs');
const path=require('path');
const os=require('os');
const {chromium}=require('playwright');

const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://127.0.0.1');
 const requested=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
 const file=path.join(root,requested.endsWith('/')?requested+'index.html':requested);
 const relative=path.relative(root,file);
 if(relative.startsWith('..')||path.isAbsolute(relative)){res.writeHead(403).end();return}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(data)})
});

(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:process.env.CI?undefined:'chrome',headless:true});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844}});
  await context.addInitScript(()=>{localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1,'across-drift':1,'old-maps':1,homeward:1}));localStorage.setItem('latchlings_story_cards_seen_v1',JSON.stringify(Object.fromEntries(Array.from({length:400},(_,i)=>[i+1,1]))))});
  const page=await context.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});

  const search=await page.evaluate(async()=>{
   const lev=LEVELS[3],initial=lev.pieces.map(piece=>piece.pos.slice()),initialJson=JSON.stringify(initial);
   currentLevel=lev.id;positions=initial.map(point=>point.slice());doorMask=0;
   const globalsBefore=JSON.stringify({currentLevel,positions,doorMask}),pure=simulateState(lev,initial,0,lev.solution[0][0],lev.solution[0][1]);
   const globalsAfter=JSON.stringify({currentLevel,positions,doorMask});
   const delegated=simulate(lev.solution[0][0],lev.solution[0][1]);
   let cursor={positions:initial.map(point=>point.slice()),doorMask:0},prefix=simulateState(lev,cursor.positions,cursor.doorMask,lev.solution[0][0],lev.solution[0][1]);
   cursor={positions:[prefix.capture?null:[prefix.r,prefix.c]],doorMask:prefix.mask};
   const noninitial={positions:cursor.positions.map(point=>point&&point.slice()),doorMask:cursor.doorMask,remaining:lev.solution.length-1};
   const firstHintStarted=performance.now(),initialHint=await LatchlingsRouteHint.findNext(lev,{positions:initial,doorMask:0,remaining:lev.moveLimit},{maxStates:1}),initialHintMs=performance.now()-firstHintStarted;
   let routeState={positions:noninitial.positions.map(point=>point&&point.slice()),doorMask:noninitial.doorMask},remaining=noninitial.remaining,steps=0,lastHint=null;
   while(routeState.positions.some(Boolean)&&remaining>0){
    const hint=await LatchlingsRouteHint.findNext(lev,{...routeState,remaining},{maxStates:5000,maxMs:1000});
    lastHint=hint;if(hint.status!=='found'||hint.pi===null)break;
    const move=simulateState(lev,routeState.positions,routeState.doorMask,hint.pi,hint.dir);
    if(!move)throw new Error('search returned an illegal next move');
    routeState.positions[hint.pi]=move.capture?null:[move.r,move.c];routeState.doorMask=move.mask;remaining--;steps++;
   }
   const impossible=await LatchlingsRouteHint.findNext(lev,{...noninitial,remaining:0},{maxStates:5000});
   const canonicalStates=new Set();let authoredPositions=initial.map(point=>point&&point.slice()),authoredMask=0;
   const stateKey=(statePositions,stateMask)=>JSON.stringify({positions:statePositions,doorMask:stateMask});
   canonicalStates.add(stateKey(authoredPositions,authoredMask));
   for(const [authoredPi,authoredDir] of lev.solution){const move=simulateState(lev,authoredPositions,authoredMask,authoredPi,authoredDir);if(!move)break;authoredPositions[authoredPi]=move.capture?null:[move.r,move.c];authoredMask=move.mask;canonicalStates.add(stateKey(authoredPositions,authoredMask))}
   let alternate=null;
   for(let pi=0;pi<initial.length&&!alternate;pi++)for(const dir of ['U','D','L','R']){const move=simulateState(lev,initial,0,pi,dir);if(!move)continue;const next=initial.map(point=>point&&point.slice());next[pi]=move.capture?null:[move.r,move.c];if(!canonicalStates.has(stateKey(next,move.mask))){alternate={positions:next,doorMask:move.mask,remaining:lev.moveLimit-1};break}}
   const limited=alternate?await LatchlingsRouteHint.findNext(lev,alternate,{maxStates:1}):{status:'missing'};
   const terminal=await LatchlingsRouteHint.findNext(lev,{positions:[null],doorMask:0,remaining:0},{maxStates:1});
   return {level:lev.id,initialJson,pure,delegated,globalsBefore,globalsAfter,initialHint,initialHintMs,authoredFirst:lev.solution[0],noninitial,steps,lastHint,solved:!routeState.positions.some(Boolean),remaining,impossible,limited,terminal};
  });
  assert.equal(search.level,4);
  assert.equal(search.globalsAfter,search.globalsBefore,'pure simulator must not mutate live game globals');
  assert.equal(JSON.stringify(search.delegated),JSON.stringify(search.pure),'live simulator must delegate to the same pure result');
  assert.equal(search.initialHint.status,'found','untouched board should return its authored first move');
  assert.deepStrictEqual([search.initialHint.pi,search.initialHint.dir],search.authoredFirst);
  assert(search.initialHintMs<100,'untouched-board hint should use the authored first move without searching');
  assert(search.noninitial.positions.some(Boolean),'route continuation test must begin from an actual noninitial board');
  assert(search.solved&&search.steps<=search.noninitial.remaining,`a current-state hint sequence must solve within the remaining move budget; ${JSON.stringify({steps:search.steps,remaining:search.remaining,lastHint:search.lastHint})}`);
  assert.equal(search.impossible.status,'impossible','a nonterminal board with no moves remaining is proven impossible');
  assert.equal(search.limited.status,'inconclusive','a noncanonical current board that reaches the state cap must not be reported as impossible');
  assert.equal(search.terminal.status,'found','an already solved board should be recognized before applying a search cap');

  await page.evaluate(()=>{
   startLevel(4);
   const lev=LEVELS[3],[pi,dir]=lev.solution[0],move=simulate(pi,dir);
   positions[pi]=move.capture?null:[move.r,move.c];doorMask=move.mask;movesUsed=1;renderGame(true);
  });
  await page.evaluate(()=>showHint());
  const modalText=await page.locator('#modal').innerText();
  assert(await page.locator('#hintFound').isVisible(),'current position with a valid continuation must show one useful hint');
  assert.equal(await page.locator('.hint-next-step').count(),1,'hint UI must reveal only the next step, not the full route');
  assert(!/solution|full route|move 1 of/i.test(modalText),'hint UI must not disclose the complete authored route');
  await page.locator('#hintClose').click();
  await page.waitForFunction(()=>document.querySelector('.latchling.hint-focus')&&document.querySelector('.dpad-hit.hint-focus'));

  await page.evaluate(()=>{
   const lev=LEVELS[3];movesUsed=lev.moveLimit;renderGame(true);
  });
  await page.evaluate(()=>showHint());
  assert(await page.locator('#hintImpossible').isVisible(),'exhausted current move budget must have a truthful no-route message');
  assert(await page.locator('#hintResetBoard').isVisible(),'impossible hint must offer Reset');
  assert(await page.locator('#hintKeepPlaying').isVisible(),'impossible hint must let the player keep playing');
  await page.locator('#hintKeepPlaying').click();
  const exhaustedBoard=await page.evaluate(()=>JSON.stringify({positions,movesUsed}));
  await page.evaluate(()=>loseLevel());
  await page.locator('#loseHintBtn').click();
  await page.locator('#hintImpossible').waitFor({state:'visible'});
  assert.equal(await page.evaluate(()=>JSON.stringify({positions,movesUsed})),exhaustedBoard,'Lose-screen hint must inspect the current board instead of resetting it');
  await page.locator('#hintKeepPlaying').click();

  await page.evaluate(()=>{
   window.__realFindNext=LatchlingsRouteHint.findNext;
   LatchlingsRouteHint.findNext=()=>new Promise(resolve=>window.__resolveHeldHint=resolve);
  });
  await page.locator('#hintBtn').click();
  await page.locator('#hintSearching').waitFor({state:'visible'});
  await page.locator('#cancelHintSearch').click();
  await page.waitForFunction(()=>!document.getElementById('overlay').classList.contains('show'));
  await page.evaluate(()=>window.__resolveHeldHint({status:'found',pi:0,dir:'U'}));
  await page.waitForTimeout(40);
  assert.equal(await page.locator('#hintFound').count(),0,'cancelled search must not reopen a stale hint dialog');
  await page.evaluate(()=>{LatchlingsRouteHint.findNext=window.__realFindNext});

  await page.evaluate(()=>{LatchlingsRouteHint.findNext=async()=>({status:'inconclusive'})});
  await page.locator('#hintBtn').click();
  await page.locator('#hintInconclusive').waitFor({state:'visible'});
  assert(await page.locator('#hintInconclusiveReset').isVisible(),'inconclusive search must offer Reset');
  assert(await page.locator('#hintInconclusiveKeep').isVisible(),'inconclusive search must offer Keep Playing');
  await page.locator('#hintInconclusiveKeep').click();
  await page.evaluate(()=>{LatchlingsRouteHint.findNext=window.__realFindNext});

  const lateHint=await page.evaluate(async()=>{
   const lev=LEVELS[300];startLevel(301);
   if(document.getElementById('storyCardOverlay')?.getAttribute('aria-hidden')==='false')document.getElementById('storyCardContinue')?.click();
   let applied=0;
   for(const [pi,dir] of lev.solution.slice(0,3)){
    const result=simulate(pi,dir);if(!result)throw new Error(`Level 301 authored prefix move ${applied+1} is invalid`);
    positions[pi]=result.capture?null:[result.r,result.c];doorMask=result.mask;movesUsed++;applied++;
   }
   let routeCheck=lev.pieces.map(piece=>piece.pos.slice()),routeCheckMask=0;
   for(const [pi,dir] of lev.solution.slice(0,applied)){const result=simulateState(lev,routeCheck,routeCheckMask,pi,dir);if(!result)throw new Error(`Level 301 pure route prefix move ${applied+1} is invalid`);routeCheck[pi]=result.capture?null:[result.r,result.c];routeCheckMask=result.mask}
   renderGame(true);
   const expected=lev.solution[applied],started=performance.now();await showHint();const elapsedMs=performance.now()-started;
   const status=document.getElementById('hintFound')?'found':document.getElementById('hintImpossible')?'impossible':document.getElementById('hintInconclusive')?'inconclusive':'missing';
   return {id:lev.id,doors:lev.doors.length,switches:lev.switches.length,applied,remaining:lev.moveLimit-movesUsed,doorMask,expectedPi:expected[0],expectedDir:expected[1],selected,positions,routeCheck,routeCheckMask,elapsedMs,status,text:document.getElementById('modal').innerText};
  });
  assert(lateHint.doors>0&&lateHint.switches>0,'late-puzzle responsiveness check must use a switch-and-door campaign board');
  assert.equal(lateHint.applied,3,'late-puzzle check must inspect a genuinely progressed board');
  assert.deepStrictEqual(lateHint.positions,lateHint.routeCheck,'Level 301 test prefix must match the simulator-replayed authored state');
  assert.equal(lateHint.status,'found',`a progressed authored switch/door route should get its verified continuation immediately: ${JSON.stringify(lateHint)}`);
  assert.equal(lateHint.selected,lateHint.expectedPi,'the late hint must highlight the authored next piece');
  assert(lateHint.text.toLowerCase().includes(({U:'up',D:'down',L:'left',R:'right'})[lateHint.expectedDir]),'the late hint must give the authored next direction');
  assert(lateHint.elapsedMs<1500,`late switch/door hint must keep the interface responsive; ${lateHint.elapsedMs.toFixed(0)}ms`);
  const lateHintScreenshot=path.join(os.tmpdir(),'latchlings-level301-current-hint.png');
  await page.screenshot({path:lateHintScreenshot});
  console.log(`Level 301 progressed switch/door hint: ${lateHint.status} in ${lateHint.elapsedMs.toFixed(0)}ms; screenshot ${lateHintScreenshot}`);

  const offRouteFixtures=[
   {id:51,off:[0,'D'],continuation:[[0,'U'],[1,'U'],[1,'R'],[1,'D'],[0,'L']]},
   {id:151,off:[0,'L'],continuation:[[0,'D'],[1,'L'],[1,'D'],[0,'R'],[0,'U']]},
   {id:256,off:[0,'R'],continuation:[[0,'U'],[0,'L'],[0,'D'],[1,'D'],[0,'L'],[0,'U'],[0,'D'],[1,'L']]},
   {id:301,off:[0,'U'],continuation:[[0,'D'],[1,'L'],[0,'L'],[0,'U'],[1,'U'],[1,'R']]}
  ];
  for(const fixture of offRouteFixtures){
   const result=await page.evaluate(async({id,off,continuation})=>{
    const lev=LEVELS[id-1],initial=lev.pieces.map(p=>p.pos.slice()),key=(p,m)=>JSON.stringify([p,m]),authored=new Set([key(initial,0)]);
    let route=initial.map(p=>p.slice()),mask=0;
    for(const [pi,dir] of lev.solution){const m=simulateState(lev,route,mask,pi,dir);route[pi]=m.capture?null:[m.r,m.c];mask=m.mask;authored.add(key(route,mask));}
    const first=simulateState(lev,initial,0,...off);if(!first)throw Error('off-route fixture input is illegal');
    const current=initial.map(p=>p.slice());current[off[0]]=first.capture?null:[first.r,first.c];
    const isOff=!authored.has(key(current,first.mask));let known=current.map(p=>p&&p.slice()),knownMask=first.mask;
    for(const [pi,dir] of continuation){const m=simulateState(lev,known,knownMask,pi,dir);if(!m)throw Error('known continuation is illegal');known[pi]=m.capture?null:[m.r,m.c];knownMask=m.mask;}
    let remaining=lev.moveLimit-1,steps=0,state={positions:current,doorMask:first.mask},status;
    while(state.positions.some(Boolean)&&remaining>0){
     const h=await LatchlingsRouteHint.findNext(lev,{...state,remaining},{maxStates:12000,maxMs:900});status=h.status;
     if(h.status!=='found'||h.pi===null)break;
     const m=simulateState(lev,state.positions,state.doorMask,h.pi,h.dir);if(!m)throw Error('hint gave illegal input');
     state.positions[h.pi]=m.capture?null:[m.r,m.c];state.doorMask=m.mask;steps++;remaining--;
    }
    return{isOff,knownSolved:known.every(p=>!p),knownFits:continuation.length<=lev.moveLimit-1,solved:state.positions.every(p=>!p),steps,status};
   },fixture);
   assert(result.isOff,fixture.id+': fixture must be outside every authored-prefix state');
   assert(result.knownSolved&&result.knownFits,fixture.id+': literal independently found continuation still fits');
   assert(result.solved,fixture.id+': real current-state Hint must lead home within remaining moves '+JSON.stringify(result));
  }
  for(const action of ['reset','change']){
   await page.evaluate(()=>{closeModal();startLevel(51);LatchlingsStoryTheme.close(false);window.__realFindNext=LatchlingsRouteHint.findNext;LatchlingsRouteHint.findNext=()=>new Promise(resolve=>window.__resolveHeldHint=resolve)});
   await page.locator('#hintBtn').click();await page.locator('#hintSearching').waitFor({state:'visible'});
   await page.evaluate(action=>{if(action==='reset')document.getElementById('resetLevelBtn').click();else startLevel(151);window.__resolveHeldHint({status:'found',pi:0,dir:'L'});LatchlingsRouteHint.findNext=window.__realFindNext},action);
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   assert.equal(await page.locator('#hintFound').count(),0,action+': stale search cannot reopen a hint');
   assert.equal(await page.locator('.hint-focus').count(),0,action+': stale search cannot highlight the new board');
  }
  await context.close();
  console.log('PASS pure simulation, current-state search, honest bounds, cancellable hint UI, and persistent next-step highlight');
 }finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
})().catch(error=>{console.error(error);process.exit(1)});
