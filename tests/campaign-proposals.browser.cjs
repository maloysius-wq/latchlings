'use strict';
// Review offline proposals in the real game, without changing static exports.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{chromium}=require('playwright');
const chapterIndex=process.argv.indexOf('--chapter'),chapter=chapterIndex<0?2:Number(process.argv[chapterIndex+1]);
assert(Number.isInteger(chapter)&&chapter>=2&&chapter<=8,'proposal review expects chapter 2–8');
const names={2:'lanternwood',3:'lodestone',4:'masquerade',5:'prism',6:'copperline',7:'stormswitch',8:'aurora'};
const root=path.resolve(__dirname,'..'),fileIndex=process.argv.indexOf('--review-file'),reviewFile=fileIndex<0?`test-artifacts/campaign/${names[chapter]}-proposals.json`:process.argv[fileIndex+1],rows=JSON.parse(fs.readFileSync(path.resolve(root,reviewFile),'utf8'));
const evidenceName=fileIndex<0?(chapter===2?'proposal':names[chapter]):path.parse(reviewFile).name.replace(/-proposals$/,'');
const evidence=path.join(root,`test-artifacts/campaign/${evidenceName}-captures`);fs.mkdirSync(evidence,{recursive:true});
const clearIds=process.argv.includes('--all-controls')?rows.map(r=>r.level.id):chapter===2?[51,52,54,55,58,67,79,96,100]:[1,8,17,29,46,50].map(local=>(chapter-1)*50+local);
if(chapter===6)clearIds.push(256); // Execute the first real single-input bend through protected controls.
const budgetIndex=process.argv.indexOf('--budget-level'),budgetLevel=budgetIndex<0?196:Number(process.argv[budgetIndex+1]);
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname.replace(/\/$/,'/index.html'));if(path.relative(root,file).startsWith('..'))return res.writeHead(403).end();fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css'})[path.extname(file)]||'application/octet-stream');res.end(data);});});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{
  browser=await chromium.launch({channel:process.env.CI?undefined:'chrome',headless:true});
  for(const config of [{width:320,height:568,text:'large'},{width:390,height:844,text:'normal'}]){
   const context=await browser.newContext({viewport:{width:config.width,height:config.height},reducedMotion:'reduce'});
   await context.addInitScript(()=>{localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1,'across-drift':1,'old-maps':1,homeward:1}));localStorage.setItem('latchlings_story_cards_seen_v1',JSON.stringify(Object.fromEntries(Array.from({length:400},(_,i)=>[i+1,1]))));});
   const page=await context.newPage();await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
   for(const row of rows){
    await page.evaluate(({level,text})=>{LatchlingsCinematics?.finish(true);LatchlingsStoryTheme?.close(false);LEVELS[level.id-1]=level;LatchlingsPrefs.set('textSize',text);LatchlingsPrefs.set('motion','reduced');startLevel(level.id);LatchlingsCinematics?.finish(true);LatchlingsStoryTheme?.close(false);},{level:row.level,text:config.text});
    await page.waitForFunction(()=>document.body.dataset.screen==='game'&&document.querySelector('#board .latchling'));
    await page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
    assert.equal(await page.locator('#storyCardOverlay.show').count(),0,'proposal review must not capture behind a story card');
    assert.equal(await page.locator('#movesLeft').textContent(),String(row.level.moveLimit),`Proposal ${row.level.id} initial budget must match its proven target and preserved margin`);
    const identities=await page.evaluate(()=>LEVELS[currentLevel-1].pieces.map((piece,pi)=>{const expected=document.createElement('span');expected.innerHTML=suitSvg(piece.suit);return {pi,color:piece.color,suit:piece.suit,nest:document.querySelector(`#board .nest[data-pi="${pi}"] svg`)?.outerHTML,piece:document.querySelector(`#board .latchling[data-pi="${pi}"] .suit-mark svg`)?.outerHTML,expected:expected.firstElementChild.outerHTML};}));
    for(const identity of identities){assert.equal(identity.nest,identity.expected,`Proposal ${row.level.id} nest ${identity.pi} must show its actual ${identity.color} ${identity.suit} identity`);assert.equal(identity.piece,identity.expected,`Proposal ${row.level.id} resident ${identity.pi} suit must agree with its nest`);}
    const layout=await page.evaluate(()=>{const box=s=>document.querySelector(s).getBoundingClientRect().toJSON();return {board:box('#board'),tip:box('#mechanicNote'),controls:box('.controls'),overflow:document.documentElement.scrollWidth>innerWidth};});
    await page.screenshot({path:path.join(evidence,`${config.width}-${config.text}-level-${row.level.id}.png`)});
    if(process.argv.includes('--diagnose-budget')&&row.level.id===budgetLevel){
     console.log(JSON.stringify(await page.evaluate(()=>({level:currentLevel,movesUsed,limit:LEVELS[currentLevel-1].moveLimit,text:document.querySelector('#movesLeft').textContent,font:getComputedStyle(document.querySelector('#movesLeft')).font,box:document.querySelector('#movesLeft').getBoundingClientRect().toJSON()}))));
     await page.locator('#movesLeft').screenshot({path:path.join(evidence,`${config.width}-${config.text}-level-${budgetLevel}-budget.png`)});
    }
    const requiredGap=config.width===320&&config.text==='large'?2:0;
    assert(layout.tip.top-(layout.board.top+layout.board.height)>=requiredGap,`Proposal ${row.level.id} board/Route Tip gap ${config.width}: ${JSON.stringify(layout)}`);
    assert(!layout.overflow);assert(layout.controls.bottom<=config.height,`Proposal ${row.level.id} controls clipped`);
    if(clearIds.includes(row.level.id)){
     for(let index=0;index<row.level.solution.length;index++){
      const[pi,dir]=row.level.solution[index];
      await page.locator(`#board .latchling[data-pi="${pi}"]`).click();
      await page.locator(`.dpad-hit[data-dir="${dir}"]`).click();
      await page.waitForFunction(count=>!animating&&movesUsed===count,index+1);
      if(index===Math.floor(row.level.solution.length/2))await page.screenshot({path:path.join(evidence,`${config.width}-${config.text}-level-${row.level.id}-setup.png`)});
     }
     assert(await page.evaluate(()=>positions.every(p=>p===null)),`Proposal ${row.level.id} must clear through actual controls`);
     assert.equal(await page.evaluate(()=>starsFor(LEVELS[currentLevel-1])),3);
     await page.evaluate(()=>closeModal());
    }
   }
   await context.close();
  }
  console.log(`PASS ${rows.length} proposal board layouts at 320 Large Text and 390 Normal; captures ${evidence}; harness does not edit static campaign data`);
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
