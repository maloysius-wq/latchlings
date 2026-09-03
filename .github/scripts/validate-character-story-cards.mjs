import { chromium } from 'playwright';
import fs from 'fs';

const BASE='http://127.0.0.1:8143/';
fs.mkdirSync('character-story-renders',{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844}});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push('page:'+e.message));
page.on('console',m=>{if(m.type()==='error')errors.push('console:'+m.text())});
page.on('requestfailed',r=>{const u=r.url(),e=r.failure()?.errorText||'';if(/\.(?:mp3|wav|ogg|m4a)($|\?)/.test(u)&&/ERR_ABORTED/.test(e))return;errors.push('request:'+u+':'+e)});
const ok=(c,m)=>{if(!c)throw new Error(m)};
await page.goto(BASE,{waitUntil:'domcontentloaded'});
await page.waitForTimeout(220);
await page.evaluate(()=>{localStorage.removeItem('latchlings_story_cards_seen_v1')});

function expectedSpec(name){return {Pippa:['lavender','club'],Bramble:['coral','diamond'],Rowan:['mint','heart'],Pip:['blue','spade'],Tansy:['coral','heart']}[name]}
async function openCard(level){
  await page.evaluate(level=>{window.LatchlingsStoryTheme.close(false);startLevel(level);window.LatchlingsStoryTheme.show(level,true)},level);
  await page.waitForTimeout(90);
  return await page.evaluate(()=>({
    level:Number(document.getElementById('storyCardOverlay').dataset.level),
    featured:document.getElementById('storyCardOverlay').dataset.featured,
    chars:[...document.querySelectorAll('#storyCardCharacters .story-character-chip')].map(x=>x.dataset.character),
    portraits:[...document.querySelectorAll('#storyCardScene .story-scene-character')].map(x=>({name:x.dataset.character,color:x.dataset.color,suit:x.dataset.suit})),
    hidden:document.getElementById('storyCardCharacters').hidden,
    pair:document.getElementById('storyCardCharacters').classList.contains('is-pair'),
    crewHidden:document.getElementById('storyCardCrewNote').hidden,
    crewText:document.getElementById('storyCardCrewNote').textContent,
    panel:(()=>{const r=document.getElementById('storyCardPanel').getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}})(),
    scrollW:document.documentElement.scrollWidth,
    innerW:window.innerWidth
  }));
}
async function assertCard(level,names,label){
  const state=await openCard(level);
  ok(state.level===level,`${label}: wrong level`);
  ok(state.chars.join(',')===names.join(','),`${label}: chips ${state.chars} != ${names}`);
  ok(state.portraits.map(x=>x.name).join(',')===names.join(','),`${label}: portraits ${JSON.stringify(state.portraits)}`);
  ok(state.featured===names.join(','),`${label}: dataset featured ${state.featured}`);
  ok(state.hidden===(names.length===0),`${label}: character row hidden state wrong`);
  ok(state.pair===(names.length>1),`${label}: paired class wrong`);
  for(const p of state.portraits){const [color,suit]=expectedSpec(p.name);ok(p.color===color&&p.suit===suit,`${label}: ${p.name} visual identity ${p.color}/${p.suit}`)}
  ok(state.panel.left>=0&&state.panel.right<=391&&state.panel.top>=0&&state.panel.bottom<=845,`${label}: panel clipped`);
  ok(state.scrollW<=state.innerW+1,`${label}: horizontal overflow`);
  return state;
}

const pippa=await assertCard(1,['Pippa'],'Pippa');
ok(!pippa.crewHidden,'Level 1 helper-crew note missing');
ok(/whole island pitches in/i.test(pippa.crewText)&&/helper crew/i.test(pippa.crewText),'Level 1 helper-crew explanation incomplete');
await page.screenshot({path:'character-story-renders/pippa-helper-crew.png',fullPage:true});
const boardClosed=await page.evaluate(()=>{window.LatchlingsStoryTheme.close(false);const r=document.getElementById('board').getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}});
await page.evaluate(()=>window.LatchlingsStoryTheme.show(1,true));await page.waitForTimeout(40);
const boardOpen=await page.evaluate(()=>{const r=document.getElementById('board').getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}});
ok(JSON.stringify(boardClosed)===JSON.stringify(boardOpen),'Story portrait card changed board geometry');

await assertCard(4,['Bramble'],'Bramble');
await assertCard(106,['Rowan'],'Rowan');
await assertCard(3,['Pip'],'Pip');
await assertCard(6,['Tansy'],'Tansy');
const pair=await assertCard(53,['Pip','Tansy'],'Pip + Tansy');
ok(pair.crewHidden,'Helper-crew tutorial should not repeat on paired routine card');
await page.screenshot({path:'character-story-renders/pip-tansy-pair.png',fullPage:true});
const generic=await assertCard(9,[],'Generic');
ok(generic.crewHidden,'Generic routine card unexpectedly shows helper note');
await page.screenshot({path:'character-story-renders/generic-no-character.png',fullPage:true});

await page.evaluate(()=>{window.LatchlingsStoryTheme.close(false);screen('story');renderStoryScreen()});
await page.waitForTimeout(260);
const story=await page.evaluate(()=>({
  helper:document.querySelector('#storyRole .story-helper-explain')?.textContent||'',
  residents:[...document.querySelectorAll('#storyCast .story-person-portrait')].map(x=>({name:x.dataset.character,color:x.querySelector('.story-character-avatar')?.dataset.color,suit:x.querySelector('.story-character-avatar')?.dataset.suit})),
  overflow:document.documentElement.scrollWidth-window.innerWidth
}));
ok(/colors and suit marks do not need to match/i.test(story.helper),'Persistent helper-crew explanation missing mismatch language');
ok(story.residents.length===5,'Residents screen does not show five portrait cards');
ok(story.residents.map(x=>x.name).join(',')==='Pippa,Bramble,Rowan,Pip,Tansy','Residents order changed');
for(const r of story.residents){const [color,suit]=expectedSpec(r.name);ok(r.color===color&&r.suit===suit,`Residents screen identity mismatch for ${r.name}`)}
ok(story.overflow<=1,'Story screen horizontal overflow');
await page.screenshot({path:'character-story-renders/residents-with-faces.png',fullPage:true});

await page.setViewportSize({width:900,height:820});
await page.evaluate(()=>{screen('game');window.LatchlingsStoryTheme.show(53,true)});await page.waitForTimeout(80);
const wide=await page.evaluate(()=>{const r=document.getElementById('storyCardPanel').getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,sw:document.documentElement.scrollWidth,iw:window.innerWidth}});
ok(wide.left>=0&&wide.right<=901&&wide.top>=0&&wide.bottom<=821,'Wide paired card clipped');ok(wide.sw<=wide.iw+1,'Wide overflow');

const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const rp=await reduced.newPage();const rerrors=[];rp.on('pageerror',e=>rerrors.push(e.message));await rp.goto(BASE,{waitUntil:'domcontentloaded'});await rp.waitForTimeout(160);await rp.evaluate(()=>{startLevel(1);window.LatchlingsStoryTheme.show(1,true)});await rp.waitForTimeout(50);const motion=await rp.evaluate(()=>({panel:getComputedStyle(document.getElementById('storyCardPanel')).animationName,portrait:getComputedStyle(document.querySelector('.story-scene-character')).animationName}));ok(motion.panel==='none'&&motion.portrait==='none','Reduced motion still animates story portrait card');ok(rerrors.length===0,'Reduced-motion page errors: '+rerrors.join(' | '));await reduced.close();

ok(errors.length===0,'Browser errors: '+errors.join(' | '));
console.log('CHARACTER_STORY_CARDS_BROWSER_OK',JSON.stringify({pippa:pippa.portraits,pair:pair.portraits,residents:story.residents,board:boardClosed}));
await browser.close();
