import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'no-preference'});
const page=await ctx.newPage();
const errors=[];
page.on('pageerror',e=>errors.push('page:'+e.message));
page.on('console',m=>{if(m.type()==='error')errors.push('console:'+m.text())});
page.on('requestfailed',r=>{const u=r.url(),e=r.failure()?.errorText||'';if(/\.(mp3|wav|ogg|m4a)($|\?)/.test(u)&&/ERR_ABORTED/.test(e))return;errors.push('request:'+u+':'+e)});
await page.goto('http://127.0.0.1:8155/',{waitUntil:'domcontentloaded'});
await page.waitForFunction(()=>typeof screen==='function'&&typeof startLevel==='function'&&window.LatchlingsStoryTheme);

await page.evaluate(()=>{screen('game');startLevel(400)});
await page.waitForSelector('#game.active .latchling');
await page.waitForTimeout(220);
await page.screenshot({path:'clean-latchling-renders/puzzle-level-400.png',fullPage:true});

await page.evaluate(()=>{screen('game');startLevel(1);LatchlingsStoryTheme.show(1,true)});
await page.waitForSelector('#storyCardOverlay.show .story-char-body');
await page.waitForTimeout(120);
await page.screenshot({path:'clean-latchling-renders/story-single.png',fullPage:true});
await page.evaluate(()=>LatchlingsStoryTheme.close(false));

const pair=await page.evaluate(()=>{for(let i=1;i<=400;i++){const m=LATCHLINGS_STORY.levelMeta(i),c=LATCHLINGS_STORY.chapters[m.chapter-1],f=LatchlingsStoryTheme.featuredFor(m,c);if(f.length===2)return i}return 53});
await page.evaluate(L=>{screen('game');startLevel(L);LatchlingsStoryTheme.show(L,true)},pair);
await page.waitForSelector('#storyCardOverlay.show .story-scene-character-count-2');
await page.waitForTimeout(120);
await page.screenshot({path:'clean-latchling-renders/story-pair.png',fullPage:true});
await page.evaluate(()=>LatchlingsStoryTheme.close(false));

await page.evaluate(()=>openStoryScreen());
await page.waitForSelector('#story.active .story-character-avatar');
await page.waitForTimeout(120);
await page.screenshot({path:'clean-latchling-renders/residents.png',fullPage:true});

await page.evaluate(()=>screen('home'));
await page.waitForTimeout(500);
await page.screenshot({path:'clean-latchling-renders/title-home.png',fullPage:true});

if(errors.length)throw new Error(errors.join(' | '));
console.log('CLEAN_LATCHLING_VISUAL_AUDIT_OK',JSON.stringify({pair}));
await browser.close();
