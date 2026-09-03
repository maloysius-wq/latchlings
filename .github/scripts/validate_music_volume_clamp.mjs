import { chromium } from 'playwright';
const browser = await chromium.launch({headless:true});
const context = await browser.newContext({viewport:{width:390,height:844}});
const page = await context.newPage();
const problems=[];
page.on('pageerror',e=>problems.push('page:'+e.message));
page.on('console',m=>{if(m.type()==='error')problems.push('console:'+m.text())});
page.on('requestfailed',r=>{const u=r.url(),e=r.failure()?.errorText||'';if(/\.(?:mp3|wav|ogg|m4a)($|\?)/.test(u)&&/ERR_ABORTED/.test(e))return;problems.push('request:'+u+':'+e)});
const ok=(c,m)=>{if(!c)throw new Error(m)};
await page.goto('http://127.0.0.1:8141/',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(250);
await page.evaluate(()=>{
  const d=Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype,'volume');
  window.__volumeAttempts=[];
  if(d&&d.get&&d.set&&d.configurable){
    Object.defineProperty(HTMLMediaElement.prototype,'volume',{
      configurable:true,
      get:d.get,
      set(v){window.__volumeAttempts.push(v);return d.set.call(this,v)}
    });
  }
  const realRAF=window.requestAnimationFrame.bind(window);
  let injectNegativeTimestamp=true;
  window.requestAnimationFrame=(cb)=>realRAF(ts=>{
    if(injectNegativeTimestamp){injectNegativeTimestamp=false;cb(performance.now()-8);}
    else cb(ts);
  });
});
await page.evaluate(()=>document.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})));
await page.waitForTimeout(120);
await page.evaluate(()=>startLevel(1));
await page.waitForTimeout(850);
await page.evaluate(()=>startLevel(51));
await page.waitForTimeout(850);
await page.evaluate(()=>screen('home'));
await page.waitForTimeout(850);
const state=await page.evaluate(()=>({attempts:window.__volumeAttempts||[],current:window.LatchlingsMusic?.current(),requested:window.LatchlingsMusic?.requested()}));
ok(state.attempts.length>0,'No media volume assignments observed');
ok(state.attempts.every(v=>Number.isFinite(v)&&v>=0&&v<=1),'Out-of-range volume attempt: '+JSON.stringify(state.attempts));
ok(!problems.some(x=>/IndexSizeError|volume provided|outside the range/i.test(x)),'Volume exception surfaced: '+problems.join(' | '));
ok(problems.length===0,'Browser problems: '+problems.join(' | '));
console.log('MUSIC_VOLUME_CLAMP_BROWSER_OK',JSON.stringify({min:Math.min(...state.attempts),max:Math.max(...state.attempts),count:state.attempts.length,current:state.current,requested:state.requested}));
await browser.close();
