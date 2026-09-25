'use strict';
const assert=require('assert');
const fs=require('fs');
const http=require('http');
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

(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:process.env.CI?undefined:'chrome',headless:true});
 const errors=[];
 try{
  for(const textSize of ['normal','large']){
   const context=await browser.newContext({viewport:{width:844,height:390},reducedMotion:'reduce'}),page=await context.newPage();
   page.on('pageerror',error=>errors.push(error.message));
   await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
   await page.evaluate(size=>{LatchlingsPrefs.set('textSize',size);screen('complete')},textSize);
   await page.waitForFunction(()=>document.body.dataset.screen==='complete');
   await page.waitForFunction(()=>document.querySelector('.ending-home-frame')?.contentDocument?.readyState==='complete');
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const layout=await page.evaluate(()=>{
    const box=selector=>{const rect=document.querySelector(selector).getBoundingClientRect();return{top:rect.top,bottom:rect.bottom,height:rect.height,left:rect.left,right:rect.right}};
    return{heading:box('.ending-hero h1'),scene:box('.ending-homecoming'),primary:box('#completeHome'),secondary:box('#completeLevels'),height:innerHeight,width:innerWidth,scrollWidth:document.documentElement.scrollWidth};
   });
   for(const [name,element] of Object.entries({heading:layout.heading,scene:layout.scene,primary:layout.primary,secondary:layout.secondary})){
    assert(element.height>0&&element.top>=-1&&element.bottom<=layout.height+1,`844x390 ${textSize}: Ending ${name} must stay visible in landscape (${JSON.stringify(layout)})`);
   }
   assert(layout.primary.height>=44&&layout.secondary.height>=44,`844x390 ${textSize}: Ending actions must retain a 44px touch target`);
   assert(layout.scrollWidth<=layout.width,`844x390 ${textSize}: Ending must not scroll horizontally`);
   await context.close();
  }
  assert.deepStrictEqual(errors,[],'landscape Ending must not produce browser runtime errors');
  console.log('PASS landscape Ending scene, copy, and both 44px actions at 844x390 Normal/Large Text');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(error=>{console.error(error);process.exitCode=1});
