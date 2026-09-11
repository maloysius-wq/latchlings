import { chromium } from 'playwright';
import fs from 'fs';

const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
const pageErrors = [];
page.on('pageerror', e => pageErrors.push(String(e)));

await page.goto('http://127.0.0.1:4173/', {waitUntil:'networkidle'});

const source = await (await fetch('http://127.0.0.1:4173/game400-a.js')).text();
const css = await (await fetch('http://127.0.0.1:4173/style400-ui.css')).text();
if (source.includes('document.startViewTransition')) throw new Error('root View Transition API still used');
if (!source.includes('duration:420')) throw new Error('420ms transition duration missing');
if (!source.includes('current.animate')) throw new Error('outgoing screen WAAPI animation missing');
if (!source.includes('skipTransition()')) throw new Error('skipTransition contract missing');
if (css.includes('::view-transition-')) throw new Error('obsolete root snapshot CSS remains');
if (!css.includes('.screen.screen-transition-outgoing')) throw new Error('outgoing overlay CSS missing');

const runs = await page.evaluate(async () => {
  const prepare = target => {
    if (target === 'levels') {
      chapterView = Math.ceil(progress.unlocked / 50);
      rangeView = Math.floor(((progress.unlocked - 1) % 50) / 10);
      const c = screen('levels');
      renderChapter();
      return c;
    }
    if (target === 'story') {
      const c = screen('story');
      renderStoryScreen();
      return c;
    }
    if (target === 'game') {
      currentLevel = 1;
      const lev = LEVELS[0];
      positions = lev.pieces.map(p => p.pos.slice());
      doorMask = 0;
      movesUsed = 0;
      selected = 0;
      hintStep = 0;
      animating = false;
      applyTheme(1);
      const c = screen('game');
      renderGame(true);
      return c;
    }
    return screen(target);
  };

  const output = [];
  for (const target of ['levels','home','story','home','game','home','levels','home']) {
    const callStart = performance.now();
    const ctl = prepare(target) || activeScreenTransition;
    if (!ctl || !ctl.ready || !ctl.finished || typeof ctl.skipTransition !== 'function') {
      throw new Error('transition contract missing for ' + target);
    }
    await ctl.ready;
    const motionStart = performance.now();
    const stamps = [];
    let stop = false;
    const pump = t => { stamps.push(t); if (!stop) requestAnimationFrame(pump); };
    requestAnimationFrame(pump);
    await ctl.finished;
    stop = true;
    const end = performance.now();
    const deltas = stamps.slice(1).map((t,i) => t - stamps[i]);
    output.push({
      target,
      readyDelay: motionStart - callStart,
      motion: end - motionStart,
      total: end - callStart,
      frames: stamps.length,
      maxGap: deltas.length ? Math.max(...deltas) : 0,
      avgGap: deltas.length ? deltas.reduce((a,b) => a + b, 0) / deltas.length : 0,
      outgoingLeft: document.querySelectorAll('.screen-transition-outgoing').length,
      activeCount: document.querySelectorAll('.screen.active').length,
      bodyScreen: document.body.dataset.screen
    });
    await new Promise(r => setTimeout(r, 35));
  }
  return output;
});

console.log('PREPARED_TRANSITION_CADENCE', JSON.stringify(runs));
for (const r of runs) {
  if (r.readyDelay < 0 || r.readyDelay > 190) throw new Error(`prep delay out of band ${r.target}: ${r.readyDelay}`);
  if (r.motion < 380 || r.motion > 540) throw new Error(`motion duration out of band ${r.target}: ${r.motion}`);
  if (r.total > 700) throw new Error(`total transition too long ${r.target}: ${r.total}`);
  if (r.frames < 18) throw new Error(`too few motion frames ${r.target}: ${r.frames}`);
  if (r.avgGap > 20.5) throw new Error(`poor motion average cadence ${r.target}: ${r.avgGap}`);
  if (r.maxGap > 55) throw new Error(`motion frame stall ${r.target}: ${r.maxGap}`);
  if (r.outgoingLeft !== 0 || r.activeCount !== 1) throw new Error(`transition cleanup failed ${r.target}`);
  if (r.bodyScreen !== r.target) throw new Error(`wrong final screen ${r.target}: ${r.bodyScreen}`);
}
if (pageErrors.length) throw new Error('page errors: ' + pageErrors.join(' | '));
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
if (overflow > 1) throw new Error('horizontal overflow ' + overflow);

// Reduced motion must bypass the animation entirely.
await page.emulateMedia({reducedMotion:'reduce'});
const reduced = await page.evaluate(() => {
  const before = document.body.dataset.screen;
  const result = screen('levels');
  renderChapter();
  return {
    before,
    resultType: typeof result,
    after: document.body.dataset.screen,
    active: !!activeScreenTransition,
    outgoing: document.querySelectorAll('.screen-transition-outgoing').length,
    activeCount: document.querySelectorAll('.screen.active').length
  };
});
if (reduced.active || reduced.outgoing !== 0 || reduced.after !== 'levels' || reduced.activeCount !== 1) {
  throw new Error('reduced-motion path should swap immediately: ' + JSON.stringify(reduced));
}
await page.emulateMedia({reducedMotion:'no-preference'});

// Rapid navigation must cancel the first transition cleanly and finish on the second destination.
const rapid = await page.evaluate(async () => {
  screen('story');
  renderStoryScreen();
  screen('home');
  const c = activeScreenTransition;
  if (c) await c.finished;
  return {
    screen: document.body.dataset.screen,
    outgoing: document.querySelectorAll('.screen-transition-outgoing').length,
    activeCount: document.querySelectorAll('.screen.active').length
  };
});
if (rapid.screen !== 'home' || rapid.outgoing !== 0 || rapid.activeCount !== 1) {
  throw new Error('rapid navigation cleanup failed: ' + JSON.stringify(rapid));
}

// Capture a real Home -> Level Select transition at regular intervals.
await page.evaluate(() => {
  chapterView = Math.ceil(progress.unlocked / 50);
  rangeView = Math.floor(((progress.unlocked - 1) % 50) / 10);
  screen('levels');
  renderChapter();
});
for (let i = 0; i < 7; i++) {
  if (i) await page.waitForTimeout(65);
  await page.screenshot({path:`smooth-transition-audit/frame-${String(i).padStart(2,'0')}-${i*65}ms.png`,fullPage:true});
}
await page.evaluate(async () => { if (activeScreenTransition) await activeScreenTransition.finished; });

fs.writeFileSync('smooth-transition-audit/report.json', JSON.stringify({
  accepted:true,
  runs,
  reduced,
  rapid,
  pageErrors,
  overflow
}, null, 2));
console.log('SMOOTH_WINDOW_TRANSITION_ACCEPTED');
await browser.close();
