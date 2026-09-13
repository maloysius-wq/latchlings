import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT='/tmp/chapter1-production-evidence';
fs.mkdirSync(OUT,{recursive:true});
const results={checks:[],errors:[],screenshots:[]};
const assert=(cond,msg)=>{if(!cond)throw new Error(msg)};
const check=(name,detail='ok')=>{results.checks.push({name,detail});console.log('CHECK',name,detail)};

const browser=await chromium.launch({headless:true});
const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
const stars={};for(let i=1;i<400;i++)stars[i]=3;
await ctx.addInitScript(({stars})=>{
  localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked:400,stars}));
  localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1,'across-drift':1,'old-maps':1,homeward:1}));
},{stars});
const page=await ctx.newPage();page.setDefaultTimeout(8000);
page.on('pageerror',e=>results.errors.push('pageerror: '+String(e)));
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});

async function settle(level){
  await page.evaluate(L=>window.startLevel(L),level);
  // startLevel can defer story entry until the outgoing screen transition finishes.
  // Wait beyond that transition, then clear presentation overlays for screenshot evidence.
  await page.waitForTimeout(800);
  await page.evaluate(()=>{
    try{window.LatchlingsStoryTheme?.close(false)}catch(_){}
    try{if(window.LatchlingsCinematics?.active)window.LatchlingsCinematics.finish(true)}catch(_){}
    try{if(typeof closeModal==='function')closeModal()}catch(_){}
    const story=document.getElementById('storyCardOverlay');
    if(story){story.classList.remove('show','active','visible');story.setAttribute('aria-hidden','true')}
    const cinematic=document.getElementById('cinematicOverlay');
    if(cinematic){cinematic.classList.remove('show','active','visible');cinematic.setAttribute('aria-hidden','true')}
    const overlay=document.getElementById('overlay');
    if(overlay){overlay.classList.remove('show','active','visible','home-overlay');overlay.setAttribute('aria-hidden','true')}
  });
  await page.waitForTimeout(120);
  const state=await page.evaluate(()=>{
    const visible=e=>{if(!e)return false;const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)>0&&r.width>0&&r.height>0&&(e.classList.contains('show')||e.classList.contains('active')||e.classList.contains('visible')||e.getAttribute('aria-hidden')==='false')};
    const game=document.getElementById('game');
    const app=document.getElementById('app');
    return {
      level:document.getElementById('board')?.dataset.level,
      storyVisible:visible(document.getElementById('storyCardOverlay')),
      cinematicVisible:visible(document.getElementById('cinematicOverlay')),
      modalVisible:visible(document.getElementById('overlay')),
      gameFilter:getComputedStyle(game).filter,
      appFilter:getComputedStyle(app).filter,
      gameOpacity:getComputedStyle(game).opacity,
      active:game.classList.contains('active')
    };
  });
  assert(state.active,`Level ${level} game screen is not active: ${JSON.stringify(state)}`);
  assert(!state.storyVisible&&!state.cinematicVisible&&!state.modalVisible,`Level ${level} evidence overlay still visible: ${JSON.stringify(state)}`);
  assert(state.gameFilter==='none'&&state.appFilter==='none',`Level ${level} evidence remained filtered: ${JSON.stringify(state)}`);
  assert(Number(state.gameOpacity)>.99,`Level ${level} game opacity not settled: ${JSON.stringify(state)}`);
  check(`Level ${level} clean evidence state`,JSON.stringify(state));
}
async function shot(level){
  await settle(level);
  const state=await page.evaluate(()=>{const b=document.getElementById('board'),c=b.querySelector('.cell');return {slice:document.getElementById('game').dataset.visualSlice||'',range:b.dataset.boardRange,bg:getComputedStyle(c).backgroundImage,selected:b.querySelectorAll('.latchling.selected').length,nest:b.querySelectorAll('.nest.selected-match').length}});
  assert(state.slice==='sunpetal',`Level ${level} lost Sunpetal styling`);
  assert(state.selected===1&&state.nest===1,`Level ${level} selected/matching nest evidence failed`);
  const name=`chapter1-level${level}-390-clean.png`;
  await page.screenshot({path:`${OUT}/${name}`,fullPage:false});results.screenshots.push(name);check(`Level ${level} screenshot`,JSON.stringify(state));
}
for(const level of [1,11,21,31,41,50])await shot(level);
assert(results.errors.length===0,'Browser errors: '+JSON.stringify(results.errors));
fs.writeFileSync(`${OUT}/results.json`,JSON.stringify(results,null,2));
console.log('CHAPTER1_PRODUCTION_EVIDENCE_ACCEPTED');
await browser.close();
