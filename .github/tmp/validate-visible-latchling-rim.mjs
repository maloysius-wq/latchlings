import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'node:fs';

const phase = process.argv[2];
if (!['before','after'].includes(phase)) throw new Error('usage: node validate-visible-latchling-rim.mjs before|after');
const outDir = 'visible-latchling-rim-audit-v2';
fs.mkdirSync(outDir, { recursive: true });
const levels = [1, 5, 13, 20];
const dprs = [1, 3];
const all = [];

for (const dpr of dprs) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
  await context.addInitScript(() => {
    localStorage.setItem('latchlings_campaign400_progress_v1', JSON.stringify({ unlocked: 400, stars: {} }));
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(`console:${m.text()}`); });
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}.cinematic-overlay,#cinematicOverlay{display:none!important;pointer-events:none!important}'});

  const href = await page.locator('link[href*="style400-game.css"]').getAttribute('href');
  if (phase === 'after' && href !== 'style400-game.css?v=20260911-rim2') throw new Error(`cache-busted stylesheet href missing: ${href}`);

  for (const level of levels) {
    await page.evaluate(l => window.startLevel(l), level);
    await page.waitForSelector('#game.active .latchling');
    await page.waitForTimeout(60);
    const data = await page.evaluate(() => {
      const els = [...document.querySelectorAll('#game.active .latchling')];
      return els.map((el, i) => {
        const cs = getComputedStyle(el), r = el.getBoundingClientRect();
        return {
          i,
          selected: el.classList.contains('selected'),
          width: r.width,
          height: r.height,
          radius: cs.borderRadius,
          borderWidths: [cs.borderTopWidth,cs.borderRightWidth,cs.borderBottomWidth,cs.borderLeftWidth],
          borderColors: [cs.borderTopColor,cs.borderRightColor,cs.borderBottomColor,cs.borderLeftColor],
          backgroundClip: cs.backgroundClip,
          backgroundOrigin: cs.backgroundOrigin,
          backgroundImage: cs.backgroundImage,
          boxShadow: cs.boxShadow,
          overflow: cs.overflow,
          boxSizing: cs.boxSizing,
          pointerEvents: cs.pointerEvents
        };
      });
    });
    if (!data.length) throw new Error(`Level ${level}: no Latchlings rendered`);

    if (phase === 'after') {
      for (const p of data) {
        if (Math.abs(p.width - p.height) > 0.25) throw new Error(`L${level} P${p.i}: not round geometry ${p.width}x${p.height}`);
        if (p.radius !== '50%') throw new Error(`L${level} P${p.i}: radius=${p.radius}`);
        if (!p.borderWidths.every(v => v === '4px')) throw new Error(`L${level} P${p.i}: border widths ${p.borderWidths.join(',')}`);
        if (!p.borderColors.every(v => v === 'rgba(0, 0, 0, 0)')) throw new Error(`L${level} P${p.i}: expected transparent structural border, got ${p.borderColors.join(' | ')}`);
        const clips = p.backgroundClip.split(',').map(x => x.trim());
        if (clips.length !== 3 || clips[0] !== 'padding-box' || clips[1] !== 'padding-box' || clips[2] !== 'border-box') throw new Error(`L${level} P${p.i}: backgroundClip=${p.backgroundClip}`);
        const origins = p.backgroundOrigin.split(',').map(x => x.trim());
        if (origins.length !== 3 || origins[0] !== 'padding-box' || origins[1] !== 'padding-box' || origins[2] !== 'border-box') throw new Error(`L${level} P${p.i}: backgroundOrigin=${p.backgroundOrigin}`);
        if ((p.backgroundImage.match(/gradient\(/g)||[]).length < 3 || !p.backgroundImage.includes('rgb(23, 50, 77)')) throw new Error(`L${level} P${p.i}: dedicated navy rim layer missing: ${p.backgroundImage}`);
        if (p.overflow !== 'hidden' || p.boxSizing !== 'border-box' || p.pointerEvents !== 'auto') throw new Error(`L${level} P${p.i}: interaction/clip contract changed`);
        if (p.selected && (!p.boxShadow.includes('4px') || !p.boxShadow.includes('7px'))) throw new Error(`L${level} P${p.i}: selected rings changed: ${p.boxShadow}`);
      }
    }

    const selected = page.locator('#game.active .latchling.selected').first();
    const piece = (await selected.count()) ? selected : page.locator('#game.active .latchling').first();
    await piece.screenshot({ path: `${outDir}/${phase}-dpr${dpr}-level-${level}-selected.png` });
    if (level === 13) await page.locator('#board').screenshot({ path: `${outDir}/${phase}-dpr${dpr}-level-13-board.png` });
    all.push({dpr, level, href, pieces:data});
  }

  if (phase === 'after') {
    await page.evaluate(() => window.startLevel(20));
    await page.waitForSelector('#game.active .latchling');
    const count = await page.locator('#game.active .latchling').count();
    if (count > 1) {
      const before = await page.locator('#game.active .latchling.selected').getAttribute('data-pi');
      await page.evaluate(() => document.querySelectorAll('#game.active .latchling')[1].click());
      await page.waitForTimeout(50);
      const after = await page.locator('#game.active .latchling.selected').getAttribute('data-pi');
      if (before === after) throw new Error('selection interaction did not change selected Latchling');
    }
  }
  if (errors.length) throw new Error(`browser errors at DPR ${dpr}: ${errors.join(' || ')}`);
  await browser.close();
}

fs.writeFileSync(`${outDir}/${phase}-report.json`, JSON.stringify({ phase, all }, null, 2));

if (phase === 'after') {
  const beforeReport = JSON.parse(fs.readFileSync(`${outDir}/before-report.json`, 'utf8'));
  for (const afterEntry of all) {
    const beforeEntry = beforeReport.all.find(x => x.dpr === afterEntry.dpr && x.level === afterEntry.level);
    if (!beforeEntry) throw new Error(`missing baseline L${afterEntry.level} DPR${afterEntry.dpr}`);
    for (let i=0;i<Math.min(afterEntry.pieces.length,beforeEntry.pieces.length);i++) {
      const a=afterEntry.pieces[i], b=beforeEntry.pieces[i];
      if (Math.abs(a.width-b.width) > 0.25 || Math.abs(a.height-b.height) > 0.25) throw new Error(`outer geometry changed L${afterEntry.level} P${i}: before ${b.width}x${b.height}, after ${a.width}x${a.height}`);
    }
  }
  for (const dpr of [1,3]) {
    const beforePath = `${outDir}/before-dpr${dpr}-level-13-selected.png`;
    const afterPath = `${outDir}/after-dpr${dpr}-level-13-selected.png`;
    const a = PNG.sync.read(fs.readFileSync(beforePath));
    const b = PNG.sync.read(fs.readFileSync(afterPath));
    if (a.width !== b.width || a.height !== b.height) throw new Error(`visual comparison dimensions changed at DPR${dpr}`);
    const diff = new PNG({width:a.width,height:a.height});
    const changed = pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:0.08});
    const ratio = changed/(a.width*a.height);
    fs.writeFileSync(`${outDir}/diff-dpr${dpr}-level-13.png`, PNG.sync.write(diff));
    if (ratio < 0.02) throw new Error(`visual change too subtle at DPR${dpr}: ${(ratio*100).toFixed(2)}% pixels changed`);
    console.log(`RIM_VISUAL_DIFF_DPR${dpr}=${(ratio*100).toFixed(2)}%`);
  }
  console.log('VISIBLE_LATCHLING_RIM_ACCEPTED');
}
