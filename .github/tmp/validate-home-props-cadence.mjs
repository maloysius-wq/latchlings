import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import fs from 'fs';

const mode=process.argv[2]||'after';
const out='home-props-cadence-audit';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const report={mode,checks:[],errors:[]};
for(const dpr of [1,3]){
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:dpr});
  page.on('pageerror',e=>report.errors.push(String(e)));
  await page.goto(`http://127.0.0.1:4173/title-island-concepts/?c=2&embed=1&v=test-${mode}`,{waitUntil:'networkidle'});
  await page.waitForTimeout(500);
  const state=await page.evaluate(()=>{
    const adults=[...document.querySelectorAll('#c2 .resident.adult')];
    return adults.map((el,i)=>{
      const cs=getComputedStyle(el);
      const ps=getComputedStyle(el,'::after');
      const r=el.getBoundingClientRect();
      return {
        i,
        cls:el.className,
        overflow:cs.overflow,
        radius:cs.borderRadius,
        width:r.width,
        height:r.height,
        propContent:ps.content,
        propWidth:ps.width,
        propHeight:ps.height,
        propRight:ps.right,
        propBottom:ps.bottom,
        nextMoveMs:Number(el.dataset.nextMoveMs||0)
      };
    });
  });
  report.checks.push({dpr,state});
  if(mode==='after'){
    for(const a of state){
      if(a.overflow!=='visible') throw new Error(`adult ${a.i} overflow ${a.overflow}`);
      if(a.radius!=='50%') throw new Error(`adult ${a.i} radius ${a.radius}`);
      if(a.propContent==='none'||a.propContent==='normal') throw new Error(`adult ${a.i} prop missing`);
      if(parseFloat(a.propRight)>=0) throw new Error(`adult ${a.i} prop does not extend outside: right ${a.propRight}`);
      if(!(a.width>0&&Math.abs(a.width-a.height)<0.2)) throw new Error(`adult ${a.i} sphere geometry bad`);
    }
    const ranges=[[10000,16000],[18000,24000],[26000,32000]];
    state.forEach((a,i)=>{if(a.nextMoveMs<ranges[i][0]||a.nextMoveMs>ranges[i][1])throw new Error(`adult ${i} initial wait ${a.nextMoveMs} outside ${ranges[i]}`)});
    const resamples=await page.evaluate(()=>{
      const adults=[...document.querySelectorAll('#c2 .resident.adult')];
      const names=['littleHomeGarden','littleHomeParcel','littleHomeTree'];
      const rows=[];
      for(let pass=0;pass<12;pass++){
        adults.forEach((el,i)=>{
          el.classList.add('adult-outing');
          el.dispatchEvent(new AnimationEvent('animationend',{animationName:names[i],bubbles:true}));
          rows.push(Number(el.dataset.nextMoveMs||0));
        });
      }
      return rows;
    });
    if(resamples.some(v=>v<35000||v>100000)) throw new Error(`post-outing wait outside 35-100s: ${JSON.stringify(resamples)}`);
    report.resamples=resamples;
  }
  await page.screenshot({path:`${out}/${mode}-dpr${dpr}-home.png`,fullPage:true});
  const clips=await page.evaluate(()=>[...document.querySelectorAll('#c2 .resident.adult')].map(el=>{const r=el.getBoundingClientRect();return {x:Math.max(0,r.x-14),y:Math.max(0,r.y-14),width:r.width+34,height:r.height+28}}));
  for(let i=0;i<clips.length;i++){
    const c=clips[i];
    await page.screenshot({path:`${out}/${mode}-dpr${dpr}-adult${i+1}.png`,clip:c});
  }
  await page.close();
}
fs.writeFileSync(`${out}/${mode}-report.json`,JSON.stringify(report,null,2));
await browser.close();
if(mode==='after'&&report.errors.length)throw new Error(report.errors.join('\n'));
