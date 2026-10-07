'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),matrix=process.argv.includes('--capture-matrix');
const samples=[...Array.from({length:7},(_,i)=>[51+i*50,75+i*50,100+i*50]).flat(),366,381,...Array.from({length:10},(_,i)=>391+i),301,304,305,314,316,317,319,321,325,328,330,332,339,342,347];
const ids=[...new Set(samples)],captures=[],failures=[],out=path.join(root,'test-artifacts/campaign/polish');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(path.relative(root,file).startsWith('..')){res.writeHead(403).end();return}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(data)});
});
async function geometry(page,label){
 const s=await page.evaluate(()=>{
  const box=sel=>{const el=document.querySelector(sel),r=el.getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
  return{width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth,board:box('#board'),note:box('#mechanicNote'),controls:['#resetLevelBtn','#hintBtn','.dpad-hit[data-dir="U"]','.dpad-hit[data-dir="D"]','.dpad-hit[data-dir="L"]','.dpad-hit[data-dir="R"]','#cycleLatchlingBtn'].map(box),grid:Number(document.getElementById('board').dataset.gridSize),cells:document.querySelectorAll('#board .cell').length,pieces:document.querySelectorAll('.latchling').length,expectedSize:LEVELS[currentLevel-1].size,expectedPieces:positions.filter(Boolean).length};
 });
 assert(!s.overflow,label+': no horizontal overflow');
 assert.equal(s.grid,s.expectedSize,label+': actual board size');assert.equal(s.cells,s.grid**2,label+': all cells render');
 assert.equal(s.pieces,s.expectedPieces,label+': every uncaptured resident renders');
 assert(s.note.top-s.board.bottom>=2,label+': reliable board/Route Tip gap '+JSON.stringify(s));
 for(const b of [s.board,...s.controls])assert(b.width>0&&b.height>0&&b.left>=0&&b.right<=s.width&&b.top>=0&&b.bottom<=s.height,label+': board and accepted controls fit '+JSON.stringify(b));
 assert(s.controls.every(b=>b.top>=s.note.bottom),label+': Route Tip cannot cover controls');
}
async function shot(page,label,state){
 const movingBefore=await page.evaluate(()=>animating),file=path.join(out,label+'-'+state+'.png');
 await page.screenshot({path:file,animations:'allow'});
 const movingAfter=await page.evaluate(()=>animating);
 captures.push({label,state,moving:movingBefore&&movingAfter,movingBefore,movingAfter,file});
}
async function input(page,pi,dir,index){
 await page.locator('.latchling[data-pi="'+pi+'"]').click();
 await page.locator('.dpad-hit[data-dir="'+dir+'"]').click();
 await page.waitForFunction(n=>movesUsed===n&&!animating,index+1);
}
(async()=>{
 // The browser matrix must describe accepted replacement data, never pending suggestions.
 assert.equal(require('../docs/campaign/acceptance.json').records.length,350,'all seven rebuilt chapters need acceptance records before final polish certification');
 fs.mkdirSync(out,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({channel:process.env.CI?undefined:'chrome',headless:true});
 let clears=0;
 try{
  const configs=matrix?[{width:320,height:568},{width:390,height:844},{width:430,height:932}].flatMap(v=>['normal','large'].flatMap(text=>['no-preference','reduce'].map(motion=>({...v,text,motion})))):[{width:320,height:568,text:'large',motion:'reduce'},{width:390,height:844,text:'normal',motion:'reduce'}];
  for(const config of configs){
   const context=await browser.newContext({viewport:{width:config.width,height:config.height},reducedMotion:config.motion});
   await context.addInitScript(()=>{localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1,'across-drift':1,'old-maps':1,homeward:1}));localStorage.setItem('latchlings_story_cards_seen_v1',JSON.stringify(Object.fromEntries(Array.from({length:400},(_,i)=>[i+1,1]))))});
   const page=await context.newPage();page.on('pageerror',e=>failures.push(e.message));
   await page.goto('http://127.0.0.1:'+server.address().port+'/',{waitUntil:'networkidle'});
   await page.evaluate(text=>{LatchlingsPrefs.set('textSize',text);LatchlingsPrefs.set('motion','system')},config.text);
   for(const id of ids){
    const label=config.width+'x'+config.height+'-'+config.text+'-'+config.motion+'-'+id;
    await page.evaluate(id=>{closeModal();LatchlingsCinematics.finish(true);LatchlingsStoryTheme.close(false);startLevel(id);LatchlingsCinematics.finish(true);LatchlingsStoryTheme.close(false)},id);
    await page.waitForFunction(id=>currentLevel===id&&!animating&&document.body.dataset.screen==='game',id);
    await geometry(page,label);await shot(page,label,'initial');
    const route=await page.evaluate(()=>LEVELS[currentLevel-1].solution);
    const count=matrix?Math.min(4,route.length-1):route.length;
    for(let i=0;i<count;i++){
     const [pi,dir]=route[i];
     if(matrix&&i===0){
      await page.locator('.latchling[data-pi="'+pi+'"]').click();
      // Dispatch the real control; the screenshot records whether the frame is moving.
      await page.evaluate(dir=>document.querySelector('.dpad-hit[data-dir="'+dir+'"]').click(),dir);
      await shot(page,label,config.motion==='reduce'?'reduced-transition':'transition');
      await page.waitForFunction(()=>movesUsed===1&&!animating);
     }else await input(page,pi,dir,i);
     if(i===Math.min(2,count-1)){await geometry(page,label+' setup');await shot(page,label,'setup');}
    }
    if(matrix){await geometry(page,label+' settled');await shot(page,label,'settled');}
    else{
     const win=await page.evaluate(()=>({done:positions.every(p=>!p),moves:movesUsed,optimal:LEVELS[currentLevel-1].optimal,stars:progress.stars[currentLevel],screen:document.body.dataset.screen}));
     assert(win.done&&win.moves===win.optimal&&win.stars===3,label+': real controls earn an optimal clear '+JSON.stringify(win));
     if(id===400){await page.getByRole('button',{name:'See the living Skyway',exact:true}).click();await page.waitForFunction(()=>document.body.dataset.screen==='complete');}
     clears++;await shot(page,label,'completed');
    }
   }
   await context.close();
  }
  assert.deepEqual(failures,[],'no browser exceptions');
  if(matrix)for(const width of [320,390,430])for(const text of ['normal','large'])assert(captures.some(c=>c.label.startsWith(width+'x')&&c.label.includes('-'+text+'-no-preference-')&&c.state==='transition'&&c.moving),'capture actual in-motion gameplay at '+width+' '+text);
  fs.writeFileSync(path.join(out,'report-'+(matrix?'matrix':'controls')+'.json'),JSON.stringify({ids,clears,captures},null,2));
  console.log('PASS campaign polish: '+ids.length+' boards, '+clears+' real-control clears, '+captures.length+' captures');
 }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
