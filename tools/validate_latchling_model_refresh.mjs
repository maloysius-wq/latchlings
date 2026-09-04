import {chromium} from 'playwright';
const ok=(c,m)=>{if(!c)throw new Error(m)};
const errors=[];
const hook=p=>{
  p.on('pageerror',e=>errors.push('page:'+e.message));
  p.on('console',m=>{if(m.type()==='error')errors.push('console:'+m.text())});
  p.on('requestfailed',r=>{const u=r.url(),e=r.failure()?.errorText||'';if(/\.(mp3|wav|ogg|m4a)($|\?)/.test(u)&&/ERR_ABORTED/.test(e))return;errors.push('request:'+u+':'+e)});
};
const browser=await chromium.launch({headless:true});
const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'no-preference'});
const page=await ctx.newPage();hook(page);
await page.goto('http://127.0.0.1:8154/',{waitUntil:'domcontentloaded'});
await page.waitForFunction(()=>typeof startLevel==='function'&&window.LatchlingsStoryTheme&&window.LATCHLINGS_STORY);

await page.evaluate(()=>startLevel(400));
await page.waitForSelector('#game.active .latchling');
const puzzle=await page.evaluate(()=>{
  const xs=[...document.querySelectorAll('#game .latchling')],x=xs[0],r=x.getBoundingClientRect(),eye=x.querySelector('.eye'),face=x.querySelector('.face'),mouth=x.querySelector('.mouth'),suit=x.querySelector('.suit-mark'),eyes=x.querySelector('.eyes'),anim=eyes.getAnimations().find(a=>a.animationName==='refinedBlink');
  const er=eye.getBoundingClientRect(),mr=mouth.getBoundingClientRect(),sr=suit.getBoundingClientRect();
  return {count:xs.length,w:r.width,h:r.height,eye:getComputedStyle(eye).backgroundColor,catchlight:getComputedStyle(eye,'::before').content,cheek:getComputedStyle(face,'::before').content,mouthY:(mr.top-r.top)/r.height,suitY:(sr.top-r.top)/r.height,eyeY:(er.top-r.top)/r.height,blink:getComputedStyle(eyes).animationName,frames:anim?anim.effect.getKeyframes().map(k=>String(k.scale)):[],durations:xs.map(v=>getComputedStyle(v.querySelector('.eyes')).animationDuration),appendages:xs.filter(v=>v.querySelector('.horn,.stem,.antenna,.ear,.hair,.hat,.sprout')).length};
});
ok(puzzle.count>1,'puzzle pieces missing');
ok(Math.abs(puzzle.w-puzzle.h)<.25,'puzzle Latchling not spherical '+JSON.stringify(puzzle));
ok(puzzle.eye==='rgb(23, 37, 58)','puzzle eyes wrong '+puzzle.eye);
ok(puzzle.catchlight!=='none'&&puzzle.cheek!=='none','puzzle catchlight/cheeks missing');
ok(puzzle.mouthY<.62&&puzzle.mouthY>.45,'puzzle mouth not raised '+puzzle.mouthY);
ok(puzzle.suitY<puzzle.eyeY,'puzzle suit not on forehead');
ok(puzzle.blink==='refinedBlink','puzzle blink not bound '+puzzle.blink);
ok(puzzle.frames.some(x=>x.includes('0.07')),'puzzle blink close keyframe missing '+JSON.stringify(puzzle.frames));
ok(new Set(puzzle.durations).size>1,'puzzle blinks synchronized');
ok(puzzle.appendages===0,'unexpected puzzle head appendage');

const expr=await page.evaluate(()=>{
  const piece=document.querySelector('#game .latchling'),all=['happy','surprised','angry','smug','sleepy','curious','determined'],out={};
  for(const name of all){
    piece.classList.remove(...all.map(x=>'expr-'+x));piece.classList.add('expr-'+name);
    const mouth=getComputedStyle(piece.querySelector('.mouth')),eyes=getComputedStyle(piece.querySelector('.eyes'),'::before'),e1=piece.querySelectorAll('.eye')[0].getBoundingClientRect(),e2=piece.querySelectorAll('.eye')[1].getBoundingClientRect(),eyeStyle=getComputedStyle(piece.querySelector('.eye'));
    out[name]={bb:mouth.borderBottomWidth,bt:mouth.borderTopWidth,bg:mouth.backgroundColor,rot:mouth.rotate,brow:eyes.content,e1:e1.width,e2:e2.width,eyeTop:eyeStyle.borderTopWidth};
  }
  return out;
});
ok(parseFloat(expr.happy.bb)>0,'happy mouth missing');
ok(expr.surprised.bg!=='rgba(0, 0, 0, 0)','surprised mouth missing');
ok(parseFloat(expr.angry.bt)>0&&expr.angry.brow!=='none','angry expression missing');
ok(parseFloat(expr.smug.bb)>0&&expr.smug.rot!=='none'&&expr.smug.rot!=='0deg','smug expression missing');
ok(parseFloat(expr.sleepy.eyeTop)>0,'sleepy eyes missing');
ok(Math.abs(expr.curious.e1-expr.curious.e2)>.5,'curious eyes missing');
ok(parseFloat(expr.determined.bt)>0&&expr.determined.brow!=='none','determined expression missing');
await page.screenshot({path:'latchling-model-refresh-renders/puzzle-level-400.png',fullPage:true});

await page.evaluate(()=>startLevel(1));
const moved=await page.evaluate(async()=>{for(const d of ['U','R','D','L'])if(simulate(selected,d)){const before=movesUsed;await moveSelected(d);return {ok:movesUsed===before+1,dir:d,movesUsed}}return {ok:false}});
ok(moved.ok,'real puzzle movement failed '+JSON.stringify(moved));

await page.evaluate(()=>{startLevel(1);LatchlingsStoryTheme.show(1,true)});
await page.waitForSelector('#storyCardOverlay.show .story-char-body');
const story=await page.evaluate(()=>{
  const x=document.querySelector('.story-char-body'),r=x.getBoundingClientRect(),e=x.querySelector('.eye'),f=x.querySelector('.face'),m=x.querySelector('.mouth'),s=x.querySelector('.suit-mark'),eyes=x.querySelector('.eyes');
  return {w:r.width,h:r.height,eye:getComputedStyle(e).backgroundColor,cheek:getComputedStyle(f,'::before').content,mouthY:(m.getBoundingClientRect().top-r.top)/r.height,suitY:(s.getBoundingClientRect().top-r.top)/r.height,eyeY:(e.getBoundingClientRect().top-r.top)/r.height,blink:getComputedStyle(eyes).animationName};
});
ok(Math.abs(story.w-story.h)<.25&&story.eye==='rgb(23, 37, 58)'&&story.cheek!=='none'&&story.mouthY<.62&&story.suitY<story.eyeY&&story.blink==='refinedStoryBlink','story portrait mismatch '+JSON.stringify(story));
await page.screenshot({path:'latchling-model-refresh-renders/story-single.png',fullPage:true});
await page.evaluate(()=>LatchlingsStoryTheme.close(false));

const pairLevel=await page.evaluate(()=>{for(let i=1;i<=400;i++){const m=LATCHLINGS_STORY.levelMeta(i),c=LATCHLINGS_STORY.chapters[m.chapter-1],f=LatchlingsStoryTheme.featuredFor(m,c);if(f.length===2)return i}return null});
ok(pairLevel,'paired story not found');
await page.evaluate(L=>{startLevel(L);LatchlingsStoryTheme.show(L,true)},pairLevel);
await page.waitForSelector('#storyCardOverlay.show .story-scene-character-count-2');
ok(await page.locator('#storyCardOverlay .story-char-body').count()===2,'paired portraits missing');
await page.screenshot({path:'latchling-model-refresh-renders/story-pair.png',fullPage:true});
await page.evaluate(()=>LatchlingsStoryTheme.close(false));

await page.evaluate(()=>openStoryScreen());
await page.waitForSelector('#story.active .story-character-avatar');
const residents=await page.evaluate(()=>[...document.querySelectorAll('#story .story-character-avatar')].map(a=>{const r=a.getBoundingClientRect(),eyes=a.querySelector('.story-character-avatar-eyes'),face=a.querySelector('.story-character-avatar-face');return {name:a.dataset.character,w:r.width,h:r.height,eyes:!!eyes,mouth:!!a.querySelector('.story-character-avatar-mouth'),suit:!!a.querySelector('.story-character-avatar-suit svg'),cheek:getComputedStyle(face,'::before').content,eye:getComputedStyle(eyes.querySelector('i')).backgroundColor,blink:getComputedStyle(eyes).animationName,expr:[...a.classList].find(c=>c.startsWith('expr-'))}}));
ok(residents.length===5,'expected five resident avatars');
ok(residents.every(x=>Math.abs(x.w-x.h)<.25&&x.eyes&&x.mouth&&x.suit&&x.cheek!=='none'&&x.eye==='rgb(23, 37, 58)'&&x.blink==='refinedAvatarBlink'&&x.expr),'resident avatar mismatch '+JSON.stringify(residents));
await page.screenshot({path:'latchling-model-refresh-renders/residents.png',fullPage:true});

await page.evaluate(()=>screen('home'));await page.waitForTimeout(300);
const frame=page.frames().find(f=>/title-island-concepts/.test(f.url()));ok(frame,'title iframe missing');await frame.waitForSelector('#c2 .latchling');
const title=await frame.evaluate(()=>[...document.querySelectorAll('#c2 .latchling')].map(x=>{const r=x.getBoundingClientRect(),e=x.querySelector('.eye'),f=x.querySelector('.face'),m=x.querySelector('.mouth'),s=x.querySelector('.suit-mark'),eyes=x.querySelector('.eyes');return {role:x.dataset.role,w:r.width,h:r.height,eye:getComputedStyle(e).backgroundColor,cheek:getComputedStyle(f,'::before').content,mouthY:(m.getBoundingClientRect().top-r.top)/r.height,suitY:(s.getBoundingClientRect().top-r.top)/r.height,eyeY:(e.getBoundingClientRect().top-r.top)/r.height,blink:getComputedStyle(eyes).animationName,dur:getComputedStyle(eyes).animationDuration,appendage:!!x.querySelector('.horn,.stem,.antenna,.ear,.hair,.hat,.sprout')}}));
const adults=title.filter(x=>x.role==='adult'),kids=title.filter(x=>x.role==='child');
ok(adults.length===3&&kids.length===2,'title roster changed');ok(adults.every(x=>Math.abs(x.w-34)<.25&&Math.abs(x.h-34)<.25),'title adult size changed '+JSON.stringify(adults));ok(kids.every(x=>Math.abs(x.w-25)<.25&&Math.abs(x.h-25)<.25),'title child size changed '+JSON.stringify(kids));ok(title.every(x=>x.eye==='rgb(23, 37, 58)'&&x.cheek!=='none'&&x.mouthY<.64&&x.suitY<x.eyeY&&x.blink==='refinedBlink'&&!x.appendage),'title model mismatch '+JSON.stringify(title));ok(new Set(title.map(x=>x.dur)).size>1,'title blinks synchronized');
await page.screenshot({path:'latchling-model-refresh-renders/title-home.png',fullPage:true});
ok(errors.length===0,'browser errors '+errors.join(' | '));
await ctx.close();

const wide=await browser.newContext({viewport:{width:900,height:844},reducedMotion:'no-preference'});const wp=await wide.newPage();hook(wp);await wp.goto('http://127.0.0.1:8154/',{waitUntil:'domcontentloaded'});await wp.waitForFunction(()=>window.LatchlingsStoryTheme&&typeof startLevel==='function');await wp.evaluate(()=>{startLevel(1);LatchlingsStoryTheme.show(1,true)});await wp.waitForSelector('#storyCardOverlay.show');ok(!(await wp.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)),'wide overflow');await wp.screenshot({path:'latchling-model-refresh-renders/story-wide.png',fullPage:true});await wide.close();

const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const rp=await reduced.newPage();hook(rp);await rp.goto('http://127.0.0.1:8154/',{waitUntil:'domcontentloaded'});await rp.waitForFunction(()=>typeof startLevel==='function');await rp.evaluate(()=>startLevel(1));ok(await rp.locator('#game .eyes').first().evaluate(e=>getComputedStyle(e).animationName)==='none','reduced puzzle blink active');await rp.evaluate(()=>openStoryScreen());ok(await rp.locator('#story .story-character-avatar-eyes').first().evaluate(e=>getComputedStyle(e).animationName)==='none','reduced avatar blink active');await rp.evaluate(()=>screen('home'));await rp.waitForTimeout(160);const rf=rp.frames().find(f=>/title-island-concepts/.test(f.url()));ok(rf,'reduced title iframe missing');await rf.waitForSelector('#c2 .eyes');ok(await rf.locator('#c2 .eyes').first().evaluate(e=>getComputedStyle(e).animationName)==='none','reduced title blink active');await reduced.close();
ok(errors.length===0,'final errors '+errors.join(' | '));
console.log('GLOBAL_LATCHLING_MODEL_BROWSER_OK',JSON.stringify({puzzle,story,pairLevel,residents,title,moved}));
await browser.close();
