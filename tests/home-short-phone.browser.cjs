'use strict';
const assert=require('assert');
const fs=require('fs');
const http=require('http');
const path=require('path');
const {chromium}=require('playwright');

const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp'};
const overlaps=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
const server=http.createServer((request,response)=>{
 const url=new URL(request.url,'http://127.0.0.1');
 const requested=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
 const file=path.join(root,requested.endsWith('/')?`${requested}index.html`:requested);
 const relative=path.relative(root,file);
 if(relative.startsWith('..')||path.isAbsolute(relative))return response.writeHead(403).end();
 fs.readFile(file,(error,data)=>{if(error)return response.writeHead(404).end();response.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});response.end(data)});
});

(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:process.env.CI?undefined:'chrome',headless:true});
 try{
  for(const {width,height} of [{width:320,height:568},{width:360,height:568},{width:844,height:390}]){
   const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),page=await context.newPage();
   await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
   await page.waitForFunction(()=>document.querySelector('#homeTitleFrame')?.contentDocument?.readyState==='complete');
   const layout=await page.evaluate(()=>{
    const frame=document.querySelector('#homeTitleFrame'),frameBox=frame.getBoundingClientRect(),doc=frame.contentDocument,scaleX=frameBox.width/frame.clientWidth,scaleY=frameBox.height/frame.clientHeight;
    const project=element=>{const rect=element.getBoundingClientRect();return{left:frameBox.left+rect.left*scaleX,right:frameBox.left+rect.right*scaleX,top:frameBox.top+rect.top*scaleY,bottom:frameBox.top+rect.bottom*scaleY,width:rect.width*scaleX,height:rect.height*scaleY}};
    return{frame:{width:frameBox.width,height:frameBox.height,top:frameBox.top,bottom:frameBox.bottom},island:project(doc.querySelector('#c2 .island-model')),brand:project(doc.querySelector('#c2 .toy-brand')),tools:project(doc.querySelector('#c2 .home-tools')),play:project(doc.querySelector('#c2 .play')),secondary:[...doc.querySelectorAll('#c2 .secondary button')].map(project),horizontal:document.documentElement.scrollWidth>innerWidth};
   });
   assert(layout.play.height>=44&&layout.play.top>=0&&layout.play.bottom<=height,`${width}x${height}: Home Play action must remain fully visible (${JSON.stringify(layout)})`);
   assert.equal(layout.secondary.length,2,`${width}x${height}: both secondary Home actions must render`);
   for(const [index,action] of layout.secondary.entries())assert(action.height>=44&&action.left>=0&&action.right<=width&&action.top>=0&&action.bottom<=height,`${width}x${height}: Home secondary action ${index+1} must remain fully tappable (${JSON.stringify(layout)})`);
   assert(!overlaps(layout.brand,layout.tools),`${width}x${height}: Home title must not cover the header controls (${JSON.stringify(layout)})`);
   if(width>height)assert(layout.island.right+8<=layout.play.left,`${width}x${height}: Home actions must not cover the island scene (${JSON.stringify(layout)})`);
   else assert(layout.island.bottom+4<=layout.play.top,`${width}x${height}: Home actions must not cover the island scene (${JSON.stringify(layout)})`);
   assert(!layout.horizontal,`${width}x${height}: Home must not scroll horizontally`);
   await context.close();
  }
  console.log('PASS Home scene separation and visible Play, Daily Puzzle, and Level Select actions at 320x568, 360x568, and 844x390');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(error=>{console.error(error);process.exitCode=1});
