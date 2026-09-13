import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT='/tmp/chapter1-production-rollout';
fs.mkdirSync(OUT,{recursive:true});
const results={checks:[],errors:[],screenshots:[]};
const check=(name,detail='ok')=>{results.checks.push({name,detail});console.log('CHECK',name,detail)};
const assert=(cond,msg)=>{if(!cond)throw new Error(msg)};

const browser=await chromium.launch({headless:true});
async function context(viewport={width:390,height:844}){
  const ctx=await browser.newContext({viewport,deviceScaleFactor:1});
  const stars={};for(let i=1;i<400;i++)stars[i]=3;
  await ctx.addInitScript(({stars})=>{
    localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked:400,stars}));
    localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1,'across-drift':1,'old-maps':1,homeward:1}));
  },{stars});
  return ctx;
}
async function settle(page,level,mode='campaign'){
  await page.evaluate(({level,mode})=>window.startLevel(level,mode),{level,mode});
  await page.waitForTimeout(150);
  await page.evaluate(()=>{try{window.LatchlingsStoryTheme?.close(false)}catch(_){}const o=document.getElementById('storyCardOverlay');if(o){o.classList.remove('show');o.setAttribute('aria-hidden','true')}});
  await page.waitForTimeout(40);
}
async function shot(page,name){await page.screenshot({path:`${OUT}/${name}.png`,fullPage:false});results.screenshots.push(name+'.png')}
async function containment(page,label){
  const x=await page.evaluate(()=>({w:innerWidth,h:innerHeight,sw:document.documentElement.scrollWidth,bw:document.body.scrollWidth}));
  assert(x.sw<=x.w+1&&x.bw<=x.w+1,`${label} horizontal overflow ${JSON.stringify(x)}`);
  check(label+' containment',JSON.stringify(x));
}

const ctx=await context();const page=await ctx.newPage();page.setDefaultTimeout(8000);
page.on('pageerror',e=>results.errors.push(String(e)));
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});

const modeMatrix=await page.evaluate(()=>({
  chapter1:Array.from({length:50},(_,i)=>visualSliceForLevel(i+1)),
  level51:visualSliceForLevel(51),
  level366:visualSliceForLevel(366)
}));
assert(modeMatrix.chapter1.every(x=>x==='sunpetal'),'Not every Chapter 1 level maps to Sunpetal production mode');
assert(modeMatrix.level51==='','Level 51 incorrectly inherits Chapter 1 production mode');
assert(modeMatrix.level366==='aurora-dense','Level 366 Aurora proof override was lost');
check('chapter-aware visual mode mapping');

const reps=[1,10,11,20,21,30,31,40,41,50];
const rangeBackgrounds=new Map();
for(const level of reps){
  await settle(page,level);
  const state=await page.evaluate(()=>{
    const game=document.getElementById('game'),board=document.getElementById('board'),cell=board.querySelector('.cell');
    const cs=getComputedStyle(cell),bef=getComputedStyle(cell,'::before'),aft=getComputedStyle(cell,'::after');
    return {slice:game.dataset.visualSlice||'',boardSlice:board.dataset.visualSlice||'',range:board.dataset.boardRange||'',cellBg:cs.backgroundImage,before:bef.opacity,after:aft.opacity,selected:board.querySelectorAll('.latchling.selected').length,nestMatch:board.querySelectorAll('.nest.selected-match').length};
  });
  assert(state.slice==='sunpetal'&&state.boardSlice==='sunpetal',`Level ${level} missing Sunpetal production mode ${JSON.stringify(state)}`);
  assert(state.selected===1&&state.nestMatch===1,`Level ${level} selected piece / matching nest pair broken ${JSON.stringify(state)}`);
  assert(state.before==='0'&&state.after==='0',`Level ${level} decorative pseudo-elements returned ${JSON.stringify(state)}`);
  assert(!/repeating-|conic-gradient|radial-gradient/.test(state.cellBg),`Level ${level} floor became rule-like ${state.cellBg}`);
  rangeBackgrounds.set(state.range,state.cellBg);
  await containment(page,`Level ${level}`);
  if([1,11,21,31,41,50].includes(level))await shot(page,`chapter1-level${level}-390`);
}
assert(rangeBackgrounds.size===5,'Expected all five Chapter 1 board ranges');
assert(new Set(rangeBackgrounds.values()).size===5,'Chapter 1 board ranges do not have distinct quiet material shifts');
check('five authored Chapter 1 waypoint materials',JSON.stringify(Object.fromEntries(rangeBackgrounds)));

await settle(page,1,'daily');
assert((await page.locator('#game').getAttribute('data-visual-slice'))===null,'Daily mode inherited campaign production styling');
check('Daily mode remains neutral');
await settle(page,51);
assert((await page.locator('#game').getAttribute('data-visual-slice'))===null,'Level 51 inherited Chapter 1 production styling');
await settle(page,366);
assert((await page.locator('#game').getAttribute('data-visual-slice'))==='aurora-dense','Aurora proof no longer renders');
check('Chapter boundary and Aurora override preserved');
await ctx.close();

const small=await context({width:320,height:568});const sp=await small.newPage();sp.setDefaultTimeout(8000);await sp.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
for(const level of [1,50]){
  await settle(sp,level);await containment(sp,`Level ${level} 320`);
  const fit=await sp.evaluate(()=>{const controls=document.querySelector('.controls')?.getBoundingClientRect();const buttons=Array.from(document.querySelectorAll('.controls button')).filter(x=>getComputedStyle(x).display!=='none').map(x=>Math.min(x.getBoundingClientRect().width,x.getBoundingClientRect().height));return {bottom:controls?.bottom||0,h:innerHeight,minTarget:Math.min(...buttons)}});
  assert(fit.bottom<=fit.h+1,`Level ${level} controls exceed 320x568 viewport ${JSON.stringify(fit)}`);
  assert(fit.minTarget>=44,`Level ${level} touch target below 44px ${JSON.stringify(fit)}`);
  check(`Level ${level} small-phone geometry`,JSON.stringify(fit));await shot(sp,`chapter1-level${level}-320`);
}
await small.close();

assert(results.errors.length===0,'Browser errors: '+JSON.stringify(results.errors));
fs.writeFileSync(`${OUT}/results.json`,JSON.stringify(results,null,2));
console.log('CHAPTER1_PRODUCTION_ROLLOUT_ACCEPTED');
await browser.close();
