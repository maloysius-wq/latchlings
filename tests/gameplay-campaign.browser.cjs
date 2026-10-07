const assert=require('assert');
const http=require('http');
const fs=require('fs');
const path=require('path');
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
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'no-preference'});
  await context.addInitScript(()=>{localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1,'across-drift':1,'old-maps':1,homeward:1}));localStorage.setItem('latchlings_story_cards_seen_v1',JSON.stringify(Object.fromEntries(Array.from({length:400},(_,i)=>[i+1,1]))))});
  const page=await context.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});

  const audit=await page.evaluate(()=>{
   const failures=[];
   let verified=0;
   for(let index=0;index<LEVELS.length;index++){
    const lev=LEVELS[index],errors=[];
    if(lev.id!==index+1)errors.push(`expected level id ${index+1}, got ${lev.id}`);
    currentLevel=lev.id;
    positions=lev.pieces.map(piece=>piece.pos.slice());
    doorMask=0;
    for(let step=0;step<lev.solution.length;step++){
     const [pi,dir]=lev.solution[step];
     const move=simulate(pi,dir);
     if(!move){errors.push(`solution move ${step+1} (${pi},${dir}) is invalid`);break}
     positions[pi]=move.capture?null:[move.r,move.c];
     doorMask=move.mask;
    }
    if(positions.some(Boolean))errors.push('authored solution leaves a Latchling uncaptured');
    if(lev.solution.length!==lev.optimal)errors.push(`solution has ${lev.solution.length} moves but optimal is ${lev.optimal}`);
    if(lev.solution.length>lev.moveLimit)errors.push(`solution exceeds ${lev.moveLimit}-move limit`);
    if(errors.length)failures.push({id:lev.id,errors});
    else verified++;
   }
   return {count:LEVELS.length,verified,failures};
  });
  assert.equal(audit.count,400,`expected 400 authored boards, got ${audit.count}`);
  assert.deepStrictEqual(audit.failures,[],`campaign solution failures: ${JSON.stringify(audit.failures.slice(0,12))}`);
  assert.equal(audit.verified,400,`expected 400 verified boards, got ${audit.verified}`);

  const smoke=await page.evaluate(()=>{
   const inspect=id=>{
    startLevel(id);
    const board=document.getElementById('board');
    return {
     id:Number(board.dataset.level),
     cells:board.querySelectorAll('.cell').length,
     pieces:board.querySelectorAll('.latchling').length,
     suitGates:board.querySelectorAll('.gate.suit').length,
     colorGates:board.querySelectorAll('.gate.color').length,
     switches:board.querySelectorAll('.switch-tile').length,
     doors:board.querySelectorAll('.door-tile').length
    };
   };
   return {normal:inspect(1),gated:inspect(201),switched:inspect(301),definitions:{
    gated:{cells:LEVELS[200].size**2,pieces:LEVELS[200].pieces.length,colorGates:LEVELS[200].colorGates.length},
    switched:{cells:LEVELS[300].size**2,pieces:LEVELS[300].pieces.length}
   }};
  });
  assert.deepStrictEqual(smoke.normal,{id:1,cells:25,pieces:1,suitGates:0,colorGates:0,switches:0,doors:0},'Level 1 must start as the normal opening board');
  assert.equal(smoke.gated.id,201,'Level 201 must start');
  assert(smoke.gated.colorGates>0,'Level 201 must render its introductory color permissions');
  assert.equal(smoke.gated.suitGates,0,'Level 201 isolates color permission before mixed suit/color practice');
  assert.equal(smoke.gated.colorGates,smoke.definitions.gated.colorGates,'every introductory color gate must be visible');
  assert.equal(smoke.gated.cells,smoke.definitions.gated.cells,'Level 201 must render its complete authored board');
  assert.equal(smoke.gated.pieces,smoke.definitions.gated.pieces,'Level 201 must render every authored Latchling');
  assert.equal(smoke.switched.id,301,'Level 301 must start');
  assert(smoke.switched.switches>0&&smoke.switched.doors>0,'Level 301 must render its linked switch and door');
  assert.equal(smoke.switched.cells,smoke.definitions.switched.cells,'Level 301 must render its complete authored board');
  assert.equal(smoke.switched.pieces,smoke.definitions.switched.pieces,'Level 301 must render every authored Latchling');

  for(const target of [51,151]){
   const reset=await page.evaluate(async target=>{
    closeModal();LatchlingsPrefs.set('motion','system');startLevel(51);
    const [pi,dir]=LEVELS[50].solution[0];
    document.querySelector('.latchling[data-pi="'+pi+'"]').click();
    const oldMove=moveSelected(dir),inMotion=animating&&movesUsed===1;
    if(target===51)document.getElementById('resetLevelBtn').click();else startLevel(target);
    const expected=LEVELS[target-1].pieces.map(p=>p.pos.slice());
    await oldMove;
    return{inMotion,expected,positions,level:currentLevel,moves:movesUsed,mask:doorMask,animating};
   },target);
   assert(reset.inMotion,'lifecycle regression must interrupt a real normal-motion move');
   assert.deepStrictEqual(reset.positions,reset.expected,target+': a late animation cannot overwrite a reset or newly selected board');
   assert.equal(reset.level,target);assert.equal(reset.moves,0);assert.equal(reset.mask,0);assert.equal(reset.animating,false);
  }
  const dailyExit=await page.evaluate(async()=>{
   closeModal();startLevel(1,'daily');const lev=LEVELS[0],before=JSON.stringify(progress);
   for(const [pi,dir] of lev.solution.slice(0,-1)){const m=simulate(pi,dir);if(!m)throw Error('invalid Daily fixture prefix');positions[pi]=m.capture?null:[m.r,m.c];doorMask=m.mask;movesUsed++;}
   renderGame(true);const [pi,dir]=lev.solution.at(-1);selected=pi;
   const oldMove=moveSelected(dir),inMotion=animating;
   leaveDailyForHome();await oldMove;
   return{inMotion,before,after:JSON.stringify(progress),mode:playMode,screen:document.body.dataset.screen,overlay:document.getElementById('overlay').classList.contains('show')};
  });
  assert(dailyExit.inMotion,'Daily exit regression must interrupt the actual final movement');
  assert.equal(dailyExit.after,dailyExit.before,'leaving Daily during its final animation must not award campaign stars');
  assert.equal(dailyExit.mode,'campaign');assert.equal(dailyExit.screen,'home');assert.equal(dailyExit.overlay,false,'abandoned movement cannot reopen a stale win modal');
  await context.close();
  console.log('PASS all 400 authored campaign routes, metadata, and Level 1/201/301 board-start smoke checks');
 }finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
})().catch(error=>{console.error(error);process.exit(1)});
