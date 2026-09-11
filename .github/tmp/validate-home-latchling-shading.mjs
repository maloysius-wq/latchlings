import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'node:fs';
import path from 'node:path';

const mode=process.argv[2];
if(!['before','after'].includes(mode)) throw new Error('mode must be before or after');
const out='home-latchling-shading-audit';
fs.mkdirSync(out,{recursive:true});
const base='http://127.0.0.1:4173/';
const pageErrors=[];

function luminance(r,g,b){return .2126*r+.7152*g+.0722*b}
function regionLum(png,x0,x1,y0,y1){
  let total=0,count=0;
  const xa=Math.floor(png.width*x0), xb=Math.ceil(png.width*x1);
  const ya=Math.floor(png.height*y0), yb=Math.ceil(png.height*y1);
  for(let y=ya;y<yb;y++) for(let x=xa;x<xb;x++){
    const i=(y*png.width+x)*4;
    if(png.data[i+3]<220) continue;
    total+=luminance(png.data[i],png.data[i+1],png.data[i+2]); count++;
  }
  return count?total/count:0;
}
function shadingMetrics(file){
  const png=PNG.sync.read(fs.readFileSync(file));
  const top=regionLum(png,.70,.82,.18,.32);
  const bottom=regionLum(png,.70,.82,.68,.82);
  return {top:+top.toFixed(2),bottom:+bottom.toFixed(2),gap:+Math.abs(top-bottom).toFixed(2)};
}
function diffRatio(a,b,diffPath){
  const A=PNG.sync.read(fs.readFileSync(a)), B=PNG.sync.read(fs.readFileSync(b));
  if(A.width!==B.width||A.height!==B.height) throw new Error(`dimension mismatch ${a} ${b}`);
  const D=new PNG({width:A.width,height:A.height});
  const n=pixelmatch(A.data,B.data,D.data,A.width,A.height,{threshold:.1,includeAA:true});
  fs.writeFileSync(diffPath,PNG.sync.write(D));
  return n/(A.width*A.height);
}

const report={mode,dprs:{},pageErrors};
for(const dpr of [1,3]){
  const browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:dpr,reducedMotion:'reduce'});
  const page=await context.newPage();
  page.on('pageerror',e=>pageErrors.push(String(e)));
  await page.goto(base+`?audit=${mode}-${dpr}`,{waitUntil:'networkidle'});
  const iframe=await page.waitForSelector('#homeTitleFrame');
  const frame=await iframe.contentFrame();
  if(!frame) throw new Error('home iframe unavailable');
  await frame.waitForSelector('#c2 .resident');
  await frame.addStyleTag({content:'*{animation:none!important;transition:none!important}'});
  await frame.waitForTimeout(80);
  const residents=frame.locator('#c2 .resident');
  if(await residents.count()!==5) throw new Error(`expected 5 Little Home residents, got ${await residents.count()}`);
  const homeComputed=await residents.first().evaluate(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return {backgroundImage:s.backgroundImage,borderTopWidth:s.borderTopWidth,borderRadius:s.borderRadius,width:r.width,height:r.height}});
  const homeFiles=[];
  const shading=[];
  for(let i=0;i<5;i++){
    const f=path.join(out,`${mode}-dpr${dpr}-home-${i+1}.png`);
    await residents.nth(i).screenshot({path:f}); homeFiles.push(f); shading.push(shadingMetrics(f));
  }
  await frame.locator('#c2 .phone').screenshot({path:path.join(out,`${mode}-dpr${dpr}-home-full.png`)});

  await page.addStyleTag({content:'#cinematicOverlay,.cinematic-overlay{display:none!important;pointer-events:none!important}'});
  await page.evaluate(()=>{localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked:20,stars:{}}));if(typeof window.startLevel!=='function')throw new Error('startLevel unavailable');window.startLevel(1)});
  await page.waitForSelector('#game.active .latchling');
  const pieces=page.locator('#game.active .latchling');
  await pieces.first().evaluate(el=>el.click());
  await page.waitForTimeout(50);
  const puzzleFile=path.join(out,`${mode}-dpr${dpr}-puzzle-selected.png`);
  await pieces.first().screenshot({path:puzzleFile});
  const puzzleComputed=await pieces.first().evaluate(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return {borderTopWidth:s.borderTopWidth,borderRightWidth:s.borderRightWidth,borderBottomWidth:s.borderBottomWidth,borderLeftWidth:s.borderLeftWidth,borderTopColor:s.borderTopColor,borderRadius:s.borderRadius,backgroundClip:s.backgroundClip,width:r.width,height:r.height,boxShadow:s.boxShadow,left:s.left,top:s.top}});
  const beforeMove=await pieces.first().evaluate(el=>({left:el.style.left,top:el.style.top,transform:getComputedStyle(el).transform}));
  await page.locator('.dpad-hit.up').click({force:true});
  await page.waitForTimeout(350);
  const afterMove=await pieces.first().evaluate(el=>({left:el.style.left,top:el.style.top,transform:getComputedStyle(el).transform}));
  const moved=beforeMove.left!==afterMove.left||beforeMove.top!==afterMove.top||beforeMove.transform!==afterMove.transform;

  report.dprs[dpr]={homeComputed,shading,puzzleComputed,moved,beforeMove,afterMove};
  await browser.close();
}

if(mode==='after'){
  const index=fs.readFileSync('index.html','utf8');
  const gameCss=fs.readFileSync('style400-game.css','utf8');
  const homeHtml=fs.readFileSync('title-island-concepts/index.html','utf8');
  if(!index.includes('style400-game.css?v=20260911-sphere3')) throw new Error('game stylesheet cache-bust missing');
  if(!index.includes('title-island-concepts/?c=2&amp;embed=1&amp;v=20260911-sphere3')) throw new Error('home iframe cache-bust missing');
  if(!gameCss.includes('border:2px solid #274462;background-clip:padding-box')) throw new Error('slim puzzle rim not restored');
  if(!homeHtml.includes('radial-gradient(circle at 50% 50%,var(--light) 0%,var(--piece-color) 58%,var(--dark) 100%)')) throw new Error('radial home body gradient missing');
  const before=JSON.parse(fs.readFileSync(path.join(out,'before-metrics.json'),'utf8'));
  const visual={};
  for(const dpr of [1,3]){
    const now=report.dprs[dpr],old=before.dprs[dpr];
    const oldGap=old.shading.reduce((a,x)=>a+x.gap,0)/old.shading.length;
    const newGap=now.shading.reduce((a,x)=>a+x.gap,0)/now.shading.length;
    const homeDiff=diffRatio(path.join(out,`before-dpr${dpr}-home-1.png`),path.join(out,`after-dpr${dpr}-home-1.png`),path.join(out,`diff-dpr${dpr}-home-1.png`));
    const puzzleDiff=diffRatio(path.join(out,`before-dpr${dpr}-puzzle-selected.png`),path.join(out,`after-dpr${dpr}-puzzle-selected.png`),path.join(out,`diff-dpr${dpr}-puzzle-selected.png`));
    visual[dpr]={oldGap:+oldGap.toFixed(2),newGap:+newGap.toFixed(2),homeDiff:+homeDiff.toFixed(4),puzzleDiff:+puzzleDiff.toFixed(4)};
    if(!(newGap < oldGap*.78)) throw new Error(`home top/bottom shading gap insufficiently reduced at DPR${dpr}: ${oldGap.toFixed(2)} -> ${newGap.toFixed(2)}`);
    if(homeDiff<.02) throw new Error(`home visual change too small at DPR${dpr}: ${homeDiff}`);
    if(puzzleDiff<.02) throw new Error(`puzzle rim revert visual change too small at DPR${dpr}: ${puzzleDiff}`);
    const p=now.puzzleComputed;
    if([p.borderTopWidth,p.borderRightWidth,p.borderBottomWidth,p.borderLeftWidth].some(v=>v!=='2px')) throw new Error(`puzzle rim not 2px on all sides at DPR${dpr}`);
    if(p.borderTopColor!=='rgb(39, 68, 98)') throw new Error(`unexpected puzzle rim color ${p.borderTopColor}`);
    if(p.borderRadius!=='50%') throw new Error('puzzle piece lost circular radius');
    if(Math.abs(p.width-p.height)>.01) throw new Error('puzzle piece lost square geometry');
    if(!now.moved) throw new Error(`level 1 movement smoke test failed at DPR${dpr}`);
    const h=now.homeComputed;
    if(h.borderRadius!=='50%'||Math.abs(h.width-h.height)>.01) throw new Error(`home resident lost circle geometry at DPR${dpr}`);
    if(h.backgroundImage.includes('linear-gradient')) throw new Error(`home resident still uses vertical linear body gradient at DPR${dpr}`);
  }
  report.visual=visual;
  if(pageErrors.length) throw new Error(`page errors: ${pageErrors.join(' | ')}`);
  console.log(`HOME_SHADING_DIFF_DPR1=${(report.visual[1].homeDiff*100).toFixed(2)}% GAP ${report.visual[1].oldGap}->${report.visual[1].newGap}`);
  console.log(`HOME_SHADING_DIFF_DPR3=${(report.visual[3].homeDiff*100).toFixed(2)}% GAP ${report.visual[3].oldGap}->${report.visual[3].newGap}`);
  console.log(`PUZZLE_RIM_DIFF_DPR1=${(report.visual[1].puzzleDiff*100).toFixed(2)}%`);
  console.log(`PUZZLE_RIM_DIFF_DPR3=${(report.visual[3].puzzleDiff*100).toFixed(2)}%`);
  console.log('HOME_LATCHLING_SHADING_ACCEPTED');
}
fs.writeFileSync(path.join(out,`${mode}-metrics.json`),JSON.stringify(report,null,2));
