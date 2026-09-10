import {chromium} from 'playwright';
import fs from 'fs';
const browser=await chromium.launch({headless:true});
const failures=[],boardReport=[],progressionReport=[];
const fail=m=>{failures.push(m);console.error('FAIL',m)};
async function freshPage(viewport={width:390,height:844},reducedMotion='no-preference'){
  const p=await browser.newPage({viewport,reducedMotion});
  await p.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await p.evaluate(()=>{localStorage.setItem('latchlings_campaign400_progress_v1',JSON.stringify({unlocked:1,stars:{}}));if(window.LatchlingsCinematics&&window.LatchlingsCinematics.reset)window.LatchlingsCinematics.reset()});
  await p.reload({waitUntil:'networkidle'});
  return p;
}
async function forceWin(page,level){
  await page.evaluate(L=>{closeModal();cancelAtlasReward();progress={unlocked:L,stars:{}};saveProgress();currentLevel=L;movesUsed=LEVELS[L-1].optimal;screen('game');winLevel()},level);
  await page.waitForSelector('#overlay.show #nextLevelBtn');
}

// Ordinary clear 1 -> 2.
{
  const p=await freshPage();await forceWin(p,1);await p.locator('#nextLevelBtn').click();
  await p.waitForSelector('#levels.active.atlas-reward-mode');await p.waitForTimeout(180);
  let s=await p.evaluate(()=>({source:!!document.querySelector('.atlas-node[data-level="1"].just-completed'),destLocked:!!document.querySelector('.atlas-node[data-level="2"].locked'),banner:!!document.querySelector('.atlas-reward-banner')}));
  if(!s.source||!s.destLocked||!s.banner)fail('1->2 did not begin from completed source with clouded destination');
  await p.screenshot({path:'payoff-board-audit/progression/01-source.png'});
  await p.waitForTimeout(520);
  s=await p.evaluate(()=>({traveler:!!document.querySelector('.atlas-travel-token'),route:!!document.querySelector('.atlas-route[data-target="2"].reward-restoring')}));
  if(!s.traveler||!s.route)fail('1->2 missing traveler or restoring route');
  await p.screenshot({path:'payoff-board-audit/progression/02-travel.png'});
  await p.waitForTimeout(500);
  s=await p.evaluate(()=>({cloud:!!document.querySelector('.atlas-node[data-level="2"].cloud-clearing'),current:!!document.querySelector('.atlas-node[data-level="2"].new-current')}));
  if(!s.cloud||!s.current)fail('1->2 destination did not clear cloud/become current');
  await p.screenshot({path:'payoff-board-audit/progression/03-arrival.png'});
  await p.waitForSelector('#game.active',{timeout:5000});
  const title=(await p.locator('#levelTitle').textContent()).trim();if(title!=='Level 2')fail('1->2 Next Level did not auto-continue after reward');
  progressionReport.push({case:'1->2',title});await p.close();
}

// Waypoint crossing 10 -> 11. Level Select plays reward and stays there.
{
  const p=await freshPage();await forceWin(p,10);await p.locator('#toLevelsBtn').click();await p.waitForSelector('#levels.active.atlas-reward-mode');await p.waitForTimeout(240);
  if(!(await p.locator('.atlas-node[data-level="10"].waypoint-complete').count()))fail('10->11 outgoing waypoint did not celebrate');
  await p.screenshot({path:'payoff-board-audit/progression/10-waypoint-source.png'});
  await p.waitForTimeout(1000);
  if(!(await p.locator('.atlas-node[data-level="11"].reward-destination').count()))fail('10->11 destination stretch did not stage a clouded arrival');
  await p.screenshot({path:'payoff-board-audit/progression/11-new-stretch.png'});
  await p.waitForTimeout(600);
  if(!(await p.locator('.atlas-node[data-level="11"].cloud-clearing').count()))fail('10->11 destination cloud did not clear');
  await p.waitForTimeout(1000);
  const stay=await p.evaluate(()=>({levels:document.getElementById('levels').classList.contains('active'),range:document.getElementById('levelGrid').getAttribute('aria-label'),current:!!document.querySelector('.atlas-node[data-level="11"].current'),rewardMode:document.getElementById('levels').classList.contains('atlas-reward-mode')}));
  if(!stay.levels||!stay.current||stay.rewardMode||!stay.range.includes('levels 11 through 20'))fail('10->11 Level Select did not settle on Level 11 stretch');
  progressionReport.push({case:'10->11',...stay});await p.close();
}

// Chapter crossing 50 -> 51.
{
  const p=await freshPage();await forceWin(p,50);await p.locator('#nextLevelBtn').click();await p.waitForSelector('#levels.active.atlas-reward-mode');await p.waitForTimeout(260);
  if(!(await p.locator('.atlas-node[data-level="50"].waypoint-complete').count()))fail('50->51 chapter milestone did not celebrate');
  await p.screenshot({path:'payoff-board-audit/progression/50-region-source.png'});
  await p.waitForTimeout(1050);
  const dest=await p.evaluate(()=>({chapter:(document.querySelector('#chapterHead h2')?.textContent||'').trim(),node:!!document.querySelector('.atlas-node[data-level="51"].reward-destination'),banner:(document.querySelector('.atlas-reward-banner b')?.textContent||'').trim()}));
  if(dest.chapter!=='Neighbors'||!dest.node)fail('50->51 did not reveal chapter 2 destination');
  await p.screenshot({path:'payoff-board-audit/progression/51-region-arrival.png'});
  await p.waitForSelector('#game.active',{timeout:5000});
  const title=(await p.locator('#levelTitle').textContent()).trim();if(title!=='Level 51')fail('50->51 did not auto-continue to Level 51');
  progressionReport.push({case:'50->51',...dest,title});await p.close();
}

// Reduced motion.
{
  const p=await freshPage({width:390,height:700},'reduce');await forceWin(p,1);await p.locator('#nextLevelBtn').click();await p.waitForSelector('#levels.active.atlas-reward-mode');await p.waitForTimeout(180);
  if(!(await p.locator('.atlas-node[data-level="2"].cloud-clearing').count()))fail('reduced-motion reward did not expose destination reveal');
  await p.waitForSelector('#game.active',{timeout:2500});
  if((await p.locator('#levelTitle').textContent()).trim()!=='Level 2')fail('reduced-motion reward did not continue');
  progressionReport.push({case:'reduced-1->2',ok:true});await p.close();
}

// All 40 board surface combinations.
{
  const p=await freshPage();
  for(let ch=1;ch<=8;ch++)for(let r=1;r<=5;r++){
    const L=(ch-1)*50+(r-1)*10+1;
    await p.evaluate(L=>{closeModal();cancelAtlasReward();currentLevel=L;chapterView=Math.ceil(L/50);rangeView=Math.floor(((L-1)%50)/10);positions=LEVELS[L-1].pieces.map(x=>x.pos.slice());doorMask=0;movesUsed=0;selected=0;screen('game');renderGame(true)},L);
    await p.waitForTimeout(40);
    const m=await p.evaluate(()=>{const board=document.getElementById('board'),cell=board.querySelector('.cell'),br=board.getBoundingClientRect(),cr=cell.getBoundingClientRect(),cs=getComputedStyle(cell),bs=getComputedStyle(board);return{style:board.dataset.boardStyle,range:board.dataset.boardRange,cellBg:cs.backgroundImage,cellRadius:cs.borderRadius,cellBorder:cs.borderColor,boardBg:bs.backgroundImage,boardBorder:bs.borderColor,boardW:br.width,boardH:br.height,cellW:cr.width,pieceCount:board.querySelectorAll('.latchling').length,overflowX:document.documentElement.scrollWidth>document.documentElement.clientWidth}});
    if(m.pieceCount<1||m.boardW<260||m.cellW<35||m.overflowX)fail(`board geometry failure ${m.style}`);
    boardReport.push({chapter:ch,range:r,level:L,...m,signature:[m.cellBg,m.cellRadius,m.cellBorder,m.boardBg,m.boardBorder].join('|')});
    await p.screenshot({path:`payoff-board-audit/boards/ch${ch}-r${r}-L${L}.png`,fullPage:true});
  }
  const unique=new Set(boardReport.map(x=>x.signature));if(unique.size!==40)fail(`expected 40 distinct board signatures, got ${unique.size}`);
  for(const [w,h,suffix] of [[320,568,'compact'],[430,932,'tall']]){
    await p.setViewportSize({width:w,height:h});
    for(let ch=1;ch<=8;ch++){
      const L=(ch-1)*50+(suffix==='compact'?21:41);
      await p.evaluate(L=>{currentLevel=L;positions=LEVELS[L-1].pieces.map(x=>x.pos.slice());doorMask=0;movesUsed=0;selected=0;screen('game');renderGame(true)},L);await p.waitForTimeout(30);
      const ok=await p.evaluate(()=>{const b=document.getElementById('board').getBoundingClientRect();return b.left>=-1&&b.right<=innerWidth+1&&b.top>=0&&b.bottom<=innerHeight+2});if(!ok)fail(`${suffix} board overflow ch${ch}`);
      await p.screenshot({path:`payoff-board-audit/boards/${suffix}-ch${ch}.png`});
    }
  }
  await p.close();
}
fs.writeFileSync('payoff-board-audit/report.json',JSON.stringify({failures,progressionReport,boardReport},null,2));
await browser.close();
if(failures.length)throw new Error(`payoff/board validation failed: ${failures.length}`);
console.log(`ATLAS_PAYOFF_BOARD_THEMES_ACCEPTED boardSignatures=${new Set(boardReport.map(x=>x.signature)).size}`);
