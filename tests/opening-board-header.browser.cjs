const assert=require('assert');
const http=require('http');
const fs=require('fs');
const path=require('path');
const {chromium}=require('playwright');

const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://127.0.0.1');const requested=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);const file=path.join(root,requested.endsWith('/')?requested+'index.html':requested);if(!file.startsWith(root)){res.writeHead(403).end();return}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(data)})});
const overlap=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));

(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:process.env.CI?undefined:'chrome',headless:true});
 for(const config of [{width:390,height:844,textSize:'normal'},{width:360,height:800,textSize:'large'}]){
  const context=await browser.newContext({viewport:{width:config.width,height:config.height}});
  const page=await context.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
  await page.evaluate(textSize=>{LatchlingsPrefs.set('textSize',textSize);LatchlingsCinematics.show('opening',{markSeen:false})},config.textSize);
  while(await page.evaluate(()=>Number(document.querySelector('.cin-opening-continuous')?.dataset.step||0))<21){await page.locator('#cinematicNext').click();await page.waitForTimeout(70)}
  await page.waitForTimeout(120);
  const header=await page.evaluate(()=>{
   const label=document.querySelector('.opening-board-label'),badge=document.querySelector('.opening-board-focus-label'),board=document.querySelector('.opening-board-model');
   return {label:label.getBoundingClientRect().toJSON(),badge:badge.getBoundingClientRect().toJSON(),board:board.getBoundingClientRect().toJSON(),labelScrollWidth:label.scrollWidth,labelClientWidth:label.clientWidth,labelText:label.textContent.trim(),badgeText:badge.textContent.trim()};
  });
  assert.equal(header.labelText,'WAYKEEPER ROUTE MODEL');
  assert.equal(header.badgeText,'SUNPETAL MORNING ROUTE');
  assert.equal(overlap(header.label,header.badge),0,`${config.width}x${config.height}/${config.textSize}: route-model title and Sunpetal badge must occupy separate rows`);
  assert(header.labelScrollWidth<=header.labelClientWidth+1,`${config.width}x${config.height}/${config.textSize}: WAYKEEPER ROUTE MODEL must not clip`);
  assert(header.label.left>=header.board.left&&header.label.right<=header.board.right,`${config.width}x${config.height}/${config.textSize}: route-model title must stay inside board`);
  assert(header.badge.left>=header.board.left&&header.badge.right<=header.board.right,`${config.width}x${config.height}/${config.textSize}: Sunpetal badge must stay inside board`);
  await context.close();
 }
 await browser.close();server.close();console.log('PASS opening route-model header separation at normal and Large Text');
})().catch(error=>{console.error(error);server.close();process.exit(1)});
