'use strict';
const assert=require('assert');
const fs=require('fs');
const http=require('http');
const os=require('os');
const path=require('path');
const {chromium}=require('playwright');

const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp'};
const server=http.createServer((request,response)=>{
 const url=new URL(request.url,'http://127.0.0.1');
 const requested=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
 const file=path.join(root,requested.endsWith('/')?`${requested}index.html`:requested);
 const relative=path.relative(root,file);
 if(relative.startsWith('..')||path.isAbsolute(relative))return response.writeHead(403).end();
 fs.readFile(file,(error,data)=>{if(error)return response.writeHead(404).end();response.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});response.end(data)});
});
const overlaps=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;

(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:process.env.CI?undefined:'chrome',headless:true});
 try{
  const context=await browser.newContext({viewport:{width:320,height:568},reducedMotion:'reduce'}),page=await context.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
  await page.evaluate(()=>{
   localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1,'across-drift':1,'old-maps':1,homeward:1}));
   localStorage.setItem('latchlings_story_cards_seen_v1',JSON.stringify({1:1,366:1}));
   LatchlingsPrefs.set('textSize','large');
  });
  for(const level of [1,366]){
   await page.evaluate(value=>{window.LatchlingsCinematics?.finish(true);window.LatchlingsStoryTheme?.close(false);startLevel(value);window.LatchlingsCinematics?.finish(true);window.LatchlingsStoryTheme?.close(false)},level);
   await page.waitForFunction(value=>currentLevel===value&&document.body.dataset.screen==='game',level);
   await page.waitForTimeout(100);
   await page.screenshot({path:path.join(os.tmpdir(),`latchlings-large-text-level-${level}-320x568.png`)});
   const layout=await page.evaluate(()=>{
    const box=selector=>{const rect=document.querySelector(selector).getBoundingClientRect();return{left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,width:rect.width,height:rect.height}};
    const p=document.querySelector('#storyRailSlot .story-rail-main p'),ps=getComputedStyle(p);
    return{level:currentLevel,gridSize:document.querySelector('#board').dataset.gridSize,rail:box('#storyRailSlot'),railText:{lineClamp:ps.webkitLineClamp,rect:box('#storyRailSlot .story-rail-main p')},boardWrap:box('.board-wrap'),board:box('#board'),note:box('#mechanicContext'),controls:box('#game .controls'),dpad:box('#game .dpad'),copyFont:parseFloat(getComputedStyle(document.querySelector('#mechanicChipCopy')||document.querySelector('#mechanicNote .mechanic-chip-copy')).fontSize),cellSize:box('#board .cell').width};
   });
   assert(!overlaps(layout.rail,layout.board),`320x568 Large Text Level ${level}: Story rail must not obscure the board (${JSON.stringify(layout)})`);
   assert(!overlaps(layout.board,layout.note),`320x568 Large Text Level ${level}: Route Tip must not cover any board row (${JSON.stringify(layout)})`);
   assert(!overlaps(layout.note,layout.controls),`320x568 Large Text Level ${level}: Route Tip must not cover gameplay controls (${JSON.stringify(layout)})`);
   assert(layout.board.left>=layout.boardWrap.left&&layout.board.right<=layout.boardWrap.right&&layout.board.top>=layout.boardWrap.top&&layout.board.bottom<=layout.boardWrap.bottom,`320x568 Large Text Level ${level}: complete board must stay inside its own layout region (${JSON.stringify(layout)})`);
   assert(layout.board.left>=0&&layout.board.right<=320&&layout.board.top>=0&&layout.board.bottom<=568,`320x568 Large Text Level ${level}: complete board must fit inside the screen (${JSON.stringify(layout)})`);
   assert.equal(layout.gridSize,level===1?'5':'7',`Level ${level}: board must expose its actual grid size for responsive presentation`);
   assert(layout.cellSize>=25,`320x568 Large Text Level ${level}: board cells must remain legible after compact layout (${JSON.stringify(layout)})`);
   assert.equal(layout.dpad.width,144,`320x568 Large Text Level ${level}: preserve the accepted short-phone D-pad size`);
   assert(layout.copyFont>=15,`320x568 Large Text Level ${level}: teaching copy must not be reduced below 15px`);
   assert.equal(layout.railText.lineClamp,'2',`320x568 Large Text Level ${level}: compact story preview must retain its explicit full-story affordance`);
  }
  await context.close();
  console.log('PASS Large Text Level 1/366 board, teaching rail, Route Tip, and protected D-pad geometry at 320x568');
  console.log(`VISUAL CAPTURES ${os.tmpdir()} (latchlings-large-text-level-*-320x568.png)`);
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(error=>{console.error(error);process.exitCode=1});
