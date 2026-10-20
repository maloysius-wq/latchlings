'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'test-artifacts/phone-viewport');
const server=http.createServer((req,res)=>{
 const pathname=new URL(req.url,'http://localhost').pathname;
 const file=path.resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'})[path.extname(file)]||'application/octet-stream');res.end(data);});
});
// Catch a desktop-wide game viewport, a host-sized modal, recursion, or lost saves.
async function ready(frame){await frame.waitForFunction(()=>document.body.dataset.screen==='home'&&window.LatchlingsEconomy&&typeof LEVELS!=='undefined'&&LEVELS.length===400);await frame.evaluate(async()=>{await LatchlingsEconomy.ready;await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});}
async function gameFrame(page){return (await page.locator('#phoneGameFrame').elementHandle()).contentFrame();}
async function fits(frame,selector){const g=await frame.locator(selector).evaluate(el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,right:r.right,bottom:r.bottom,w:innerWidth,h:innerHeight};});assert(g.x>=-.1&&g.y>=-.1&&g.right<=g.w+.1&&g.bottom<=g.h+.1,selector+' must remain inside the phone '+JSON.stringify(g));}
async function largeTextBoardFits(frame){
 await frame.evaluate(()=>LatchlingsPrefs.set('textSize','large'));
 for(const id of [1,366]){
  await frame.evaluate(id=>{window.LatchlingsCinematics?.finish?.(true);window.LatchlingsStoryTheme?.close?.(false);closeModal();startLevel(id,'campaign',{fresh:true});window.LatchlingsCinematics?.finish?.(true);window.LatchlingsStoryTheme?.close?.(false);},id);
  await frame.waitForFunction(id=>currentLevel===id&&document.body.dataset.screen==='game',id);
  await frame.evaluate(async()=>{await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
  const layout=await frame.evaluate(()=>{const box=id=>document.getElementById(id).getBoundingClientRect().toJSON();return{width:innerWidth,height:innerHeight,board:box('board'),tip:box('mechanicContext'),rail:box('storyRailSlot'),fonts:document.fonts.status};});
  assert(layout.tip.top-layout.board.bottom>=2,'Large Text Level'+id+' board/Route Tip clearance must be >=2px: '+JSON.stringify(layout));
  for(const selector of ['#resetLevelBtn','#hintBtn','#cycleLatchlingBtn'])await fits(frame,selector);
  const targets=await frame.locator('.dpad-hit').all();for(const target of targets){const r=await target.boundingBox();assert(r&&r.width>=44&&r.height>=44,'original D-pad touch targets remain at least44px');}
 }
 await frame.evaluate(()=>{closeModal();screen('home');LatchlingsPrefs.set('textSize','normal');});
}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/',browser=await chromium.launch({channel:process.env.CI?undefined:'chrome',headless:true});fs.mkdirSync(out,{recursive:true});
 try{
  for(const [width,height,wantWidth,wantHeight] of [[1440,1000,390,844],[1366,768,320,568],[1024,600,320,568],[1280,840,360,800]]){
   const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(url+'?test=phone#saved-route',{waitUntil:'load'});
   assert.equal(await page.locator('#phoneGameFrame').count(),1,'a large browser must show one centered phone viewport, not a desktop-wide game');
   const frame=await gameFrame(page);await ready(frame);
   if(process.argv.includes('--large-text')){await largeTextBoardFits(frame);await context.close();console.log('PASS Large Text desktop '+width);continue;}
   const geometry=await page.locator('#phoneGameFrame').evaluate(el=>({r:el.getBoundingClientRect().toJSON(),vw:innerWidth,vh:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight}));
   assert(Math.abs(geometry.r.width-wantWidth)<=1);assert.equal(geometry.r.height,wantHeight);assert(Math.abs(geometry.r.x-(width-geometry.r.width)/2)<=1);assert(Math.abs(geometry.r.y-(height-wantHeight)/2)<=1);assert(!geometry.overflow);
   assert.deepEqual(await frame.evaluate(()=>[innerWidth,innerHeight]),[wantWidth,wantHeight]);assert.equal(await frame.locator('#phoneGameFrame').count(),0,'the game frame must not recursively create another phone');assert.equal(await frame.evaluate(()=>location.search),'?test=phone');assert.equal(await frame.evaluate(()=>location.hash),'#saved-route');
   await frame.locator('#homeWalletBtn').click();await fits(frame,'#modal');await fits(frame,'#walletClose');await frame.locator('#walletClose').click();
   await frame.frameLocator('#homeTitleFrame').locator('#c2 .play').click();await frame.locator('#cinematicOverlay.show').waitFor();await fits(frame,'#cinematicOverlay');await fits(frame,'#cinematicNext');await page.screenshot({path:path.join(out,`desktop-${width}-opening.png`)});await frame.locator('#cinematicSkip').click();await frame.locator('#storyCardClose').click();
   const route=await frame.evaluate(()=>LEVELS[0].solution);for(const [pi,dir]of route){await frame.locator(`.latchling[data-pi="${pi}"]`).click();await frame.locator(`.dpad-hit[data-dir="${dir}"]`).click();await frame.waitForFunction(()=>!animating);}
   await frame.locator('#nextLevelBtn').waitFor();const w=await frame.evaluate(()=>LatchlingsEconomy.read());assert.equal(w.energy,19);assert.equal(w.coins,30);await fits(frame,'#modal');await page.screenshot({path:path.join(out,`desktop-${width}-clear.png`)});
   await page.reload({waitUntil:'load'});const reloaded=await gameFrame(page);await ready(reloaded);const saved=await reloaded.evaluate(()=>LatchlingsEconomy.read());assert.equal(saved.energy,19);assert.equal(saved.coins,30);
   await largeTextBoardFits(reloaded);
   await page.setViewportSize({width:390,height:844});const resized=await gameFrame(page);await resized.waitForFunction(()=>innerWidth===390&&innerHeight===844);assert.equal((await resized.evaluate(()=>LatchlingsEconomy.read())).coins,30);assert.deepEqual(errors,[]);await context.close();console.log(`PASS centered phone ${width}x${height}, mobile dialogs, actual clear, reload and resize preserve wallet`);
  }
  for(const [width,height]of [[320,568],[390,844],[430,932],[844,390]]){
   const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),page=await context.newPage();await page.goto(url,{waitUntil:'load'});await ready(page);assert.equal(await page.locator('#phoneGameFrame').count(),0,'native phone layouts must not get a nested preview');assert.deepEqual(await page.evaluate(()=>[innerWidth,innerHeight]),[width,height]);await page.locator('#homeWalletBtn').click();await fits(page,'#modal');await fits(page,'#walletClose');await context.close();console.log(`PASS native viewport ${width}x${height} stays full size`);
  }
 }finally{await browser.close();await new Promise(r=>server.close(r));}
 console.log(process.argv.includes('--large-text')?'PASS Large Text board clearance at all4 desktop fits and unchanged4 native layouts':'PASS phone viewport: 4 desktop fits, 4 native layouts, Large Text board clearance, real gameplay and wallet persistence; screenshots '+out);
})().catch(e=>{console.error(e);process.exitCode=1;});
