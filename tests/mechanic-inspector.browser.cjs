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

const bounds=element=>{const rect=element.getBoundingClientRect();return{x:rect.x,y:rect.y,width:rect.width,height:rect.height}};
const mechanicTypes=['anchors','suitGates','colorGates','rails','turners','switches','doors'];

(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:process.env.CI?undefined:'chrome',headless:true});
 const errors=[];
 try{
  const context=await browser.newContext({viewport:{width:320,height:568},reducedMotion:'reduce'});
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
  await page.evaluate(()=>{
   localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1,'across-drift':1,'old-maps':1,homeward:1}));
   localStorage.setItem('latchlings_story_cards_seen_v1',JSON.stringify({101:1,151:1,201:1,301:1,366:1}));
   LatchlingsPrefs.set('textSize','normal');
  });

  async function start(level){
   await page.evaluate(value=>{startLevel(value);window.LatchlingsCinematics?.finish(true);window.LatchlingsStoryTheme?.close(false)},level);
   await page.waitForFunction(value=>currentLevel===value&&document.body.dataset.screen==='game',level);
   await page.waitForTimeout(320);
   await page.evaluate(()=>{window.LatchlingsCinematics?.finish(true);window.LatchlingsStoryTheme?.close(false)});
   const overlays=await page.evaluate(()=>({story:document.querySelector('#storyCardOverlay')?.classList.contains('show')||false,cinematic:document.querySelector('#cinematicOverlay')?.classList.contains('show')||false}));
   assert.deepStrictEqual(overlays,{story:false,cinematic:false},`Level ${level} must be inspected with story overlays closed`);
  }

  async function boardSnapshot(){
   return page.evaluate(()=>{
    const box=selector=>{const rect=document.querySelector(selector).getBoundingClientRect();return{x:rect.x,y:rect.y,width:rect.width,height:rect.height}};
    return {movesUsed,positions:positions.map(position=>position&&position.slice()),selected,doorMask,board:box('#board'),dpad:box('#dpadRocker')};
   });
  }

  async function inspect(type,expected){
   const target=await page.evaluate(mechanicType=>{
    const lev=LEVELS[currentLevel-1],items=lev[mechanicType]||[],item=items[0];
    if(!item)return null;
    const [r,c]=item,cell=document.querySelector(`#board .cell[data-r="${r}"][data-c="${c}"]`);
    return {r,c,tabIndex:cell?.tabIndex,hasTabindex:cell?.hasAttribute('tabindex'),label:cell?.getAttribute('aria-label'),bearing:cell?.classList.contains('mechanic-bearing')};
   },type);
   assert(target,`Level ${await page.evaluate(()=>currentLevel)} needs a ${type} fixture`);
   assert.equal(target.tabIndex,0,`${type} cell must be reachable by keyboard`);
   assert(target.hasTabindex&&target.bearing,`${type} cell must be explicitly marked as mechanic-bearing`);
   assert(target.label&&expected.some(word=>target.label.toLowerCase().includes(word.toLowerCase())),`${type} cell needs a concise semantic label`);
   const before=await boardSnapshot();
   const cell=page.locator(`#board .cell[data-r="${target.r}"][data-c="${target.c}"]`);
   await cell.focus();
   const focusText=await page.locator('#mechanicInspector').innerText();
   const routeTipHidden=await page.locator('#mechanicNote').evaluate(element=>element.hasAttribute('aria-hidden'));
   assert(routeTipHidden,`${type} inspection should avoid announcing the hidden Route Tip over the mechanic status`);
   const focusCue=await cell.evaluate(element=>{const style=getComputedStyle(element);return style.outlineStyle!=='none'&&parseFloat(style.outlineWidth)>=2});
   assert(focusCue,`${type} cell needs a visible keyboard-focus cue`);
   for(const word of expected)assert(focusText.toLowerCase().includes(word.toLowerCase()),`${type} inspector should explain “${word}”; got “${focusText}”`);
   await cell.evaluate(element=>element.blur());
   const restored=await page.evaluate(()=>({hidden:document.querySelector('#mechanicInspector').hidden,note:document.querySelector('#mechanicNote').innerText}));
   assert(restored.hidden,`${type} inspector should close when keyboard focus leaves the mechanic`);
   assert(restored.note.toLowerCase().includes('route tip'),`${type} inspection should restore the normal Route Tip`);
   await cell.dispatchEvent('pointerdown',{pointerType:'mouse',button:0,bubbles:true});
   await cell.evaluate(element=>element.click());
   const clickText=await page.locator('#mechanicInspector').innerText();
   for(const word of expected)assert(clickText.toLowerCase().includes(word.toLowerCase()),`${type} pointer inspection should retain “${word}”`);
   const after=await boardSnapshot();
   assert.deepStrictEqual(after,before,`${type} inspection must not move pieces, spend moves, change selection, or toggle a door`);
   return {r:target.r,c:target.c};
  }

  async function assertKeyboardTargets(){
   const state=await page.evaluate(types=>{
    const lev=LEVELS[currentLevel-1],expected=new Set(types.flatMap(type=>(lev[type]||[]).map(([r,c])=>`${r},${c}`))),cells=[...document.querySelectorAll('#board .cell')];
    return {expected:expected.size,actual:cells.filter(cell=>cell.tabIndex===0).length,nonMechanicFocusable:cells.filter(cell=>!expected.has(`${cell.dataset.r},${cell.dataset.c}`)&&cell.tabIndex===0).length};
   },mechanicTypes);
   assert.equal(state.actual,state.expected,'only cells containing mechanics should be in the board tab order');
   assert.equal(state.nonMechanicFocusable,0,'ordinary cells must not become oversized focus targets');
  }

  await start(101);
  const openingAnchor=await inspect('anchors',['anchor','stop']);
  await assertKeyboardTargets();

  await start(151);
  await inspect('suitGates',['suit gate','spade','mark']);
  await assertKeyboardTargets();
  await start(201);
  await inspect('colorGates',['color gate','blue']);
  await assertKeyboardTargets();

  await start(301);
  await inspect('anchors',['anchor','stop']);
  await inspect('suitGates',['suit gate','star']);
  await inspect('colorGates',['color gate','gold']);
  await inspect('rails',['rail','down']);
  await inspect('turners',['turner','counter-clockwise']);
  await inspect('switches',['switch A','door A','closed']);
  const door=await inspect('doors',['door A','closed','switch A']);
  const mechanicRegion=await page.evaluate(()=>({role:document.querySelector('#mechanicInspector')?.getAttribute('role'),live:document.querySelector('#mechanicInspector')?.getAttribute('aria-live')}));
  assert.deepStrictEqual(mechanicRegion,{role:'status',live:'polite'},'the mechanic explanation must be announced without interrupting the route tip');

  await page.evaluate(async()=>{
   const moves=[[0,'R'],[1,'D'],[1,'U'],[0,'D'],[0,'R']];
   for(const [piece,direction] of moves){selected=piece;renderPieces(LEVELS[currentLevel-1]);await moveSelected(direction)}
  });
  await page.waitForFunction(()=>!animating&&movesUsed===5&&doorMask===1);
  const openDoorText=await page.locator('#mechanicInspector').innerText();
  assert(openDoorText.includes('Door A')&&openDoorText.includes('OPEN'),'door inspection must update from CLOSED to OPEN after linked switch A is activated');
  assert.deepStrictEqual(await page.evaluate(()=>({level:currentLevel,movesUsed,doorMask})),{level:301,movesUsed:5,doorMask:1},'the authored switch route should open door A without completing the level');

  await start(366);
  await assertKeyboardTargets();
  const denseLayout=await page.evaluate(()=>{const box=element=>{const rect=element.getBoundingClientRect();return{x:rect.x,y:rect.y,width:rect.width,height:rect.height}};return{board:box(document.querySelector('#board')),dpad:box(document.querySelector('#dpadRocker')),context:box(document.querySelector('#mechanicContext')),mapSize:getComputedStyle(document.querySelector('#board')).getPropertyValue('--n'),inspector:!!document.querySelector('#mechanicInspector')}});
  assert.equal(denseLayout.mapSize,'7','Level 366 must exercise the dense 7×7 board');
  assert(denseLayout.inspector,'dense Level 366 needs the mechanic inspector');
  await inspect('anchors',['anchor','stop']);
  const inspectorLayout=await page.evaluate(()=>{const box=element=>{const rect=element.getBoundingClientRect();return{x:rect.x,y:rect.y,width:rect.width,height:rect.height}};return{panel:box(document.querySelector('#mechanicInspector')),context:box(document.querySelector('#mechanicContext')),board:box(document.querySelector('#board')),dpad:box(document.querySelector('#dpadRocker')),overflow:getComputedStyle(document.querySelector('#mechanicInspector')).overflow}});
  assert.equal(inspectorLayout.overflow,'auto','long mechanic descriptions must scroll within their compact region');
  assert(inspectorLayout.panel.width>0&&inspectorLayout.panel.height>0,'dense-board inspector needs a visible compact area');
  assert(inspectorLayout.panel.x>=inspectorLayout.context.x&&inspectorLayout.panel.y>=inspectorLayout.context.y&&inspectorLayout.panel.x+inspectorLayout.panel.width<=inspectorLayout.context.x+inspectorLayout.context.width+1&&inspectorLayout.panel.y+inspectorLayout.panel.height<=inspectorLayout.context.y+inspectorLayout.context.height+1,'inspector must stay within the existing Route Tip region');
  const overlaps=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
  assert(!overlaps(inspectorLayout.panel,inspectorLayout.board),`mechanic inspector must not cover board cells: ${JSON.stringify(inspectorLayout)}`);
  assert(!overlaps(inspectorLayout.panel,inspectorLayout.dpad),'mechanic inspector must not cover D-pad controls');
  await page.screenshot({path:path.join(os.tmpdir(),'latchlings-mechanic-inspector-level-366-320x568.png')});

  await start(1);
  await page.screenshot({path:path.join(os.tmpdir(),'latchlings-mechanic-inspector-level-1-320x568.png')});
  assert.deepStrictEqual(errors,[],'mechanic inspection must not produce browser runtime errors');
  console.log('PASS mechanic copy, keyboard and pointer inspection, read-only state, linked door updates, and Level 366 phone geometry');
  console.log(`VISUAL CAPTURES Level 1 and Level 366 in ${os.tmpdir()}`);
  await context.close();
 }finally{await browser.close();server.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
