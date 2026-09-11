import { chromium } from 'playwright';
import fs from 'node:fs';

const outDir = 'round-latchling-outline-audit';
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, reducedMotion: 'no-preference' });
await context.addInitScript(() => {
  localStorage.setItem('latchlings_campaign400_progress_v1', JSON.stringify({ unlocked: 400, stars: {} }));
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push(`console:${m.text()}`); });
await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });

function parseAlpha(color) {
  const m = color.match(/rgba?\(([^)]+)\)/i);
  if (!m) return 1;
  const parts = m[1].split(',').map(x => x.trim());
  return parts.length >= 4 ? Number(parts[3]) : 1;
}

const results = [];
for (const level of [1, 51, 201, 351]) {
  await page.evaluate(l => window.startLevel(l), level);
  await page.waitForSelector('#game.active .latchling');
  await page.waitForTimeout(180);
  const sample = await page.evaluate(() => {
    const els = [...document.querySelectorAll('#game.active .latchling')];
    return els.slice(0, Math.min(4, els.length)).map((el, i) => {
      const cs = getComputedStyle(el), r = el.getBoundingClientRect();
      return {
        i,
        selected: el.classList.contains('selected'),
        width: r.width,
        height: r.height,
        radius: cs.borderRadius,
        topWidth: cs.borderTopWidth,
        rightWidth: cs.borderRightWidth,
        bottomWidth: cs.borderBottomWidth,
        leftWidth: cs.borderLeftWidth,
        topColor: cs.borderTopColor,
        rightColor: cs.borderRightColor,
        bottomColor: cs.borderBottomColor,
        leftColor: cs.borderLeftColor,
        backgroundClip: cs.backgroundClip,
        overflow: cs.overflow,
        boxSizing: cs.boxSizing,
        pointerEvents: cs.pointerEvents
      };
    });
  });
  if (!sample.length) throw new Error(`Level ${level}: no Latchlings rendered`);
  for (const s of sample) {
    if (Math.abs(s.width - s.height) > 0.25) throw new Error(`Level ${level} piece ${s.i}: not square (${s.width}x${s.height})`);
    if (s.radius !== '50%') throw new Error(`Level ${level} piece ${s.i}: radius ${s.radius}`);
    for (const side of ['topWidth','rightWidth','bottomWidth','leftWidth']) if (s[side] !== '2px') throw new Error(`Level ${level} piece ${s.i}: ${side}=${s[side]}`);
    const colors = [s.topColor,s.rightColor,s.bottomColor,s.leftColor];
    if (!colors.every(c => c === colors[0])) throw new Error(`Level ${level} piece ${s.i}: rim colors differ ${colors.join(' | ')}`);
    if (parseAlpha(colors[0]) < 0.999) throw new Error(`Level ${level} piece ${s.i}: rim is translucent ${colors[0]}`);
    if (s.backgroundClip !== 'padding-box') throw new Error(`Level ${level} piece ${s.i}: backgroundClip=${s.backgroundClip}`);
    if (s.overflow !== 'hidden') throw new Error(`Level ${level} piece ${s.i}: overflow=${s.overflow}`);
    if (s.pointerEvents !== 'auto') throw new Error(`Level ${level} piece ${s.i}: pointerEvents=${s.pointerEvents}`);
  }
  const selected = page.locator('#game.active .latchling.selected').first();
  if (await selected.count()) await selected.screenshot({ path: `${outDir}/level-${level}-selected.png` });
  const unselected = page.locator('#game.active .latchling:not(.selected)').first();
  if (await unselected.count()) await unselected.screenshot({ path: `${outDir}/level-${level}-unselected.png` });
  await page.locator('#board').screenshot({ path: `${outDir}/level-${level}-board.png` });
  results.push({ level, sample });
}

// Interaction smoke: selection still changes and the selected ring remains present.
await page.evaluate(() => window.startLevel(1));
await page.waitForSelector('#game.active .latchling');
const pieces = page.locator('#game.active .latchling');
if (await pieces.count() > 1) {
  const before = await page.locator('#game.active .latchling.selected').getAttribute('data-pi');
  await pieces.nth(1).click();
  await page.waitForTimeout(80);
  const after = await page.locator('#game.active .latchling.selected').getAttribute('data-pi');
  if (before === after) throw new Error('Selection did not change');
  const selectedShadow = await page.locator('#game.active .latchling.selected').evaluate(el => getComputedStyle(el).boxShadow);
  if (!selectedShadow.includes('4px') || !selectedShadow.includes('7px')) throw new Error(`Selected ring shadow changed unexpectedly: ${selectedShadow}`);
}

if (errors.length) throw new Error(`Browser errors: ${errors.join(' || ')}`);
fs.writeFileSync(`${outDir}/report.json`, JSON.stringify({ accepted: true, results, errors }, null, 2));
console.log('ROUND_LATCHLING_OUTLINE_ACCEPTED');
await browser.close();
