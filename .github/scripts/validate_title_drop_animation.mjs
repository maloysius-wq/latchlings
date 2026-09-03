import { chromium } from 'playwright';

const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844}});
const page=await context.newPage();
const errors=[];
page.on('console',m=>{if(m.type()==='error')errors.push('console:'+m.text())});
page.on('pageerror',e=>errors.push('pageerror:'+e.message));
page.on('requestfailed',r=>errors.push('request:'+r.url()));

await page.goto('http://127.0.0.1:8131/title-island-concepts/?c=1',{waitUntil:'networkidle'});
await page.click('.switcher button[data-target="c2"]');
await page.waitForTimeout(30);

const setAnimationTime=async ms=>{
  await page.evaluate(ms=>{
    document.querySelectorAll('#c2 .toy-logo span').forEach(el=>{
      const a=el.getAnimations().find(x=>x.animationName==='littleHomeTitleDrop');
      if(!a)throw new Error('Missing title animation');
      a.pause();
      a.currentTime=ms;
    });
  },ms);
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>resolve())));
};

const snap=async()=>page.evaluate(()=>{
  const c=document.querySelector('#c2.active');
  const letters=[...c.querySelectorAll('.toy-logo span')].map(el=>{const r=el.getBoundingClientRect();const cs=getComputedStyle(el);return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,opacity:+cs.opacity,transform:cs.transform,translate:cs.translate,rotate:cs.rotate,delay:cs.animationDelay,name:cs.animationName}});
  const logo=c.querySelector('.toy-logo').getBoundingClientRect();
  const topLine=c.querySelector('.topline').getBoundingClientRect();
  const scene=c.querySelector('.scene').getBoundingClientRect();
  const tagline=c.querySelector('.toy-tagline').getBoundingClientRect();
  return {letters,logo:{top:logo.top,bottom:logo.bottom,left:logo.left,right:logo.right},topLine:{top:topLine.top,bottom:topLine.bottom},scene:{top:scene.top,bottom:scene.bottom},tagline:{top:tagline.top,bottom:tagline.bottom},bodyWidth:document.body.scrollWidth,viewport:innerWidth,residents:c.querySelectorAll('.resident').length,pebbles:c.querySelectorAll('.float-pebble').length,clouds:c.querySelectorAll('.cloud').length,playBg:getComputedStyle(c.querySelector('.play')).backgroundColor,playBgImage:getComputedStyle(c.querySelector('.play')).backgroundImage};
});

await setAnimationTime(0);
const s0=await snap();
await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/title-drop-renders/title-drop-start.png`,fullPage:true});
await setAnimationTime(437);
const s1=await snap();
await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/title-drop-renders/title-drop-impact.png`,fullPage:true});
await setAnimationTime(585);
const s2=await snap();
await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/title-drop-renders/title-drop-rebound.png`,fullPage:true});
await setAnimationTime(1400);
const sf=await snap();
await page.screenshot({path:`${process.env.GITHUB_WORKSPACE}/title-drop-renders/title-drop-final.png`,fullPage:true});

if(s0.letters.length!==10)throw new Error('Expected ten title letters');
if(!s0.letters.every(l=>l.name.includes('littleHomeTitleDrop')))throw new Error('Drop animation missing on one or more title letters');
const delays=s0.letters.map(l=>parseFloat(l.delay)||0);
for(let i=1;i<delays.length;i++)if(!(delays[i]>delays[i-1]))throw new Error('Letter delays are not strictly staggered');
if(!(s0.letters[0].top < sf.letters[0].top-70))throw new Error(`First letter did not start sufficiently above final position: ${s0.letters[0].top} vs ${sf.letters[0].top}`);
if(!(s1.letters[0].top > sf.letters[0].top+7))throw new Error(`First letter did not overshoot below final baseline: ${s1.letters[0].top} vs ${sf.letters[0].top}; translate=${s1.letters[0].translate}`);
if(!(s2.letters[0].top < sf.letters[0].top-3))throw new Error(`First letter did not rebound above final baseline: ${s2.letters[0].top} vs ${sf.letters[0].top}; translate=${s2.letters[0].translate}`);
if(!(s1.letters[9].top < sf.letters[9].top-70 && s1.letters[9].opacity < .05))throw new Error(`Last letter did not remain delayed while earlier letters landed: ${JSON.stringify(s1.letters[9])}`);
for(let i=0;i<10;i++){
  if(Math.abs(sf.letters[i].opacity-1)>.01)throw new Error(`Letter ${i+1} did not finish opaque`);
  if(sf.letters[i].left<-1||sf.letters[i].right>s0.viewport+1)throw new Error(`Letter ${i+1} outside viewport`);
  if(sf.letters[i].translate!=='0px' && sf.letters[i].translate!=='0px 0px')throw new Error(`Letter ${i+1} did not settle translate: ${sf.letters[i].translate}`);
}
if(sf.bodyWidth>sf.viewport+1)throw new Error(`Horizontal overflow ${sf.bodyWidth}/${sf.viewport}`);
if(sf.logo.top<sf.topLine.bottom-2)throw new Error('Final logo overlaps top controls');
if(sf.tagline.bottom>sf.scene.top+2)throw new Error('Tagline collides with scene');
if(sf.residents!==5||sf.pebbles!==6||sf.clouds!==4)throw new Error(`Scene structure changed: ${JSON.stringify({residents:sf.residents,pebbles:sf.pebbles,clouds:sf.clouds})}`);
if(sf.playBg!=='rgb(245, 222, 172)'||sf.playBgImage!=='none')throw new Error(`Play button changed: ${sf.playBg} / ${sf.playBgImage}`);
if(errors.length)throw new Error(errors.join(' | '));

const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
const rp=await reduced.newPage();
await rp.goto('http://127.0.0.1:8131/title-island-concepts/?c=2',{waitUntil:'networkidle'});
const reducedState=await rp.evaluate(()=>({
  active:document.querySelector('.concept.active')?.id,
  animations:[...document.querySelectorAll('#c2 .toy-logo span')].flatMap(el=>el.getAnimations().map(a=>a.animationName)),
  opacity:[...document.querySelectorAll('#c2 .toy-logo span')].map(el=>getComputedStyle(el).opacity),
  translate:[...document.querySelectorAll('#c2 .toy-logo span')].map(el=>getComputedStyle(el).translate)
}));
if(reducedState.active!=='c2')throw new Error('Reduced-motion Concept 2 did not activate');
if(reducedState.animations.includes('littleHomeTitleDrop'))throw new Error('Reduced-motion still runs title drop animation');
if(!reducedState.opacity.every(v=>v==='1'))throw new Error('Reduced-motion title is not immediately visible');
await reduced.close();

for(const id of [1,3]){
  const p=await context.newPage();
  await p.goto(`http://127.0.0.1:8131/title-island-concepts/?c=${id}`,{waitUntil:'networkidle'});
  const state=await p.evaluate(()=>({active:document.querySelector('.concept.active')?.id,toy:document.querySelectorAll('.concept.active .toy-logo').length,serif:document.querySelectorAll('.concept.active .brand h2:not(.toy-logo)').length,overflow:document.body.scrollWidth-innerWidth}));
  if(state.active!==`c${id}`||state.toy!==0||state.serif!==1||state.overflow>1)throw new Error(`Concept ${id} branding changed: ${JSON.stringify(state)}`);
  await p.close();
}

console.log('TITLE_DROP_BROWSER_OK',JSON.stringify({start:s0.letters[0].top,impact:s1.letters[0].top,rebound:s2.letters[0].top,final:sf.letters[0].top,lastDelayed:s1.letters[9].top,impactTranslate:s1.letters[0].translate,reboundTranslate:s2.letters[0].translate,delays}));
await context.close();
await browser.close();
