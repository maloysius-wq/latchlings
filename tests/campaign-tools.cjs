'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const {loadCampaign}=require('../tools/campaign/runtime.cjs');
const {solve}=require('../tools/campaign/solve.cjs');
const root=path.resolve(__dirname,'..');
const {levels,simulateState}=loadCampaign(root);
const fixture=()=>({size:5,pieces:[{color:'blue',suit:'spade',pos:[4,0],expression:'happy'}],nests:[[0,4]],rocks:[],anchors:[],suitGates:[],colorGates:[],rails:[],turners:[],switches:[],doors:[]});

function provesTinyShortestRoute(){
 const lev=fixture(),result=solve(lev,simulateState,{maxStates:1000,maxMs:1000});
 assert.equal(result.status,'solved');assert.equal(result.optimum,2);
 let positions=lev.pieces.map(p=>p.pos),mask=0;
 for(const [pi,dir] of result.route){const move=simulateState(lev,positions,mask,pi,dir);assert(move);positions[pi]=move.capture?null:[move.r,move.c];mask=move.mask;}
 assert.deepEqual(positions,[null]);
}
function reportsExhaustionHonestly(){
 assert.equal(solve(fixture(),simulateState,{maxStates:1,maxMs:1000}).status,'unproven');
 assert.equal(solve(fixture(),simulateState,{maxStates:1000,maxMs:0}).status,'unproven');
 assert.equal(solve(fixture(),simulateState,{maxStates:1000,maxMs:1000,maxDepth:1}).status,'depth-exhausted');
 const trapped=fixture();trapped.rocks=[[3,0],[4,1]];
 assert.equal(solve(trapped,simulateState,{maxStates:1000,maxMs:1000}).status,'unsolvable');
 assert.equal(solve(fixture(),simulateState,{initialState:{positions:[null],doorMask:0},maxStates:1000,maxMs:1000}).optimum,0);
}
function honorsDoorStateAndHelperRestriction(){
 const lev=fixture();lev.switches=[[4,1,0]];lev.doors=[[4,3,0]];
 const opened=simulateState(lev,[[4,0]],0,0,'R');
 assert.equal(opened.mask,1);assert.deepEqual([opened.r,opened.c],[4,4]);
 const closed=simulateState(lev,[[4,0]],1,0,'R');
 assert.equal(closed.mask,0);assert.deepEqual([closed.r,closed.c],[4,2]);
 const fromOpen=solve(lev,simulateState,{initialState:{positions:[[4,2]],doorMask:1},maxStates:1000,maxMs:1000});assert.equal(fromOpen.optimum,2);
 const helper=levels[50];const proof=solve(helper,simulateState,{maxStates:100000,maxMs:5000,forbidHelperStops:true,maxDepth:helper.moveLimit});
 assert.notEqual(proof.status,'unproven');assert.notEqual(proof.status,'solved','Level 51 has no within-budget no-helper clear');
}
async function matchesRenderedTransitions(){
 const http=require('node:http'),fs=require('node:fs'),{chromium}=require('playwright');
 const server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname.replace(/\/$/,'/index.html'));
  if(path.relative(root,file).startsWith('..'))return res.writeHead(403).end();
  fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end();const ext=path.extname(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css'})[ext]||'application/octet-stream');res.end(data);});
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
  browser=await chromium.launch({channel:process.env.CI?undefined:'chrome',headless:true});const page=await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>typeof simulateState==='function');
  for(const id of [1,51,101,151,201,251,301,366,400]){
   const lev=levels[id-1];let positions=lev.pieces.map(p=>p.pos.slice()),mask=0;
   for(const [pi,dir] of lev.solution){
    const before=JSON.stringify({positions,mask});const move=simulateState(lev,positions,mask,pi,dir);
    const rendered=await page.evaluate(({id,positions,mask,pi,dir})=>simulateState(LEVELS[id-1],positions,mask,pi,dir),{id,positions,mask,pi,dir});
    assert.deepEqual(JSON.parse(JSON.stringify(move)),rendered,`VM/rendered transition ${id}:${pi},${dir}`);
    assert.equal(JSON.stringify({positions,mask}),before,'transition must not mutate search state');
    positions[pi]=move.capture?null:[move.r,move.c];mask=move.mask;
   }
  }
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
(async()=>{for(const test of [provesTinyShortestRoute,reportsExhaustionHonestly,honorsDoorStateAndHelperRestriction,matchesRenderedTransitions]){await test();console.log(`PASS ${test.name}`);}})().catch(error=>{console.error(error);process.exitCode=1;});
