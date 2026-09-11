import { chromium } from 'playwright';
import fs from 'fs';

const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
const failures = [];
const pageErrors = [];
page.on('pageerror', e => pageErrors.push(String(e)));
const check = (ok,msg) => { if(!ok){ console.error('FAIL',msg); failures.push(msg); } };

await page.goto('http://127.0.0.1:4173/', {waitUntil:'networkidle'});

const styles = [];
for (let ch=1; ch<=8; ch++) {
  for (let range=1; range<=5; range++) {
    const level = (ch-1)*50 + (range-1)*10 + 1;
    await page.evaluate(({level,ch,range}) => {
      currentLevel = level;
      chapterView = ch;
      rangeView = range-1;
      applyTheme(ch);
      const lev = LEVELS[level-1];
      positions = lev.pieces.map(p => p.pos.slice());
      doorMask = 0;
      movesUsed = 0;
      selected = 0;
      hintStep = 0;
      animating = false;
      document.querySelectorAll('.screen').forEach(x => x.classList.remove('active'));
      document.getElementById('game').classList.add('active');
      document.body.dataset.screen = 'game';
      renderGame(true);
    }, {level,ch,range});
    await page.waitForTimeout(30);

    const info = await page.evaluate(() => {
      const board = document.getElementById('board');
      const cells = [...board.querySelectorAll('.cell')];
      const sample = cells.slice(0, Math.min(12,cells.length)).map(cell => {
        const cs = getComputedStyle(cell);
        const before = getComputedStyle(cell,'::before');
        const after = getComputedStyle(cell,'::after');
        return {
          backgroundColor: cs.backgroundColor,
          backgroundImage: cs.backgroundImage,
          borderColor: cs.borderColor,
          borderWidth: cs.borderWidth,
          borderRadius: cs.borderRadius,
          boxShadow: cs.boxShadow,
          beforeBorder: before.border,
          beforeBackground: before.backgroundImage || before.backgroundColor,
          beforePointer: before.pointerEvents,
          afterBackground: after.backgroundImage || after.backgroundColor,
          afterPointer: after.pointerEvents
        };
      });
      const rect = board.getBoundingClientRect();
      return {
        boardStyle: board.dataset.boardStyle,
        boardRange: board.dataset.boardRange,
        cellCount: cells.length,
        sample,
        rect:{left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,width:rect.width,height:rect.height},
        viewport:{w:innerWidth,h:innerHeight},
        latchlings: document.querySelectorAll('#pieceLayer .latchling').length
      };
    });

    check(info.boardStyle === `ch${ch}-r${range}`, `wrong board style for ch${ch} r${range}: ${info.boardStyle}`);
    check(info.boardRange === String(range), `wrong board range for ch${ch} r${range}`);
    check(info.cellCount > 0, `no cells for ch${ch} r${range}`);
    check(info.latchlings > 0, `no visible latchlings for ch${ch} r${range}`);
    check(info.rect.left >= -1 && info.rect.right <= info.viewport.w + 1, `board horizontal overflow ch${ch} r${range}`);
    const c = info.sample[0];
    check(c && c.backgroundImage && c.backgroundImage !== 'none', `missing cell material ch${ch} r${range}`);
    check(parseFloat(c.borderWidth) >= 2, `cell border too weak ch${ch} r${range}: ${c.borderWidth}`);
    check(c.beforePointer === 'none' && c.afterPointer === 'none', `decorative layers intercept input ch${ch} r${range}`);
    const rgb = (c.backgroundColor.match(/\d+(?:\.\d+)?/g)||[]).slice(0,3).map(Number);
    if (rgb.length === 3) {
      const distance = Math.hypot(255-rgb[0],255-rgb[1],255-rgb[2]);
      check(distance >= 60, `cell still too close to white ch${ch} r${range}: ${c.backgroundColor}, distance=${distance.toFixed(1)}`);
    } else {
      check(false, `could not parse cell background color ch${ch} r${range}: ${c.backgroundColor}`);
    }

    const signature = JSON.stringify({
      bg:c.backgroundColor,
      image:c.backgroundImage,
      border:c.borderColor,
      width:c.borderWidth,
      radius:c.borderRadius,
      before:c.beforeBorder,
      after:c.afterBackground
    });
    styles.push({ch,range,level,signature,info});
    await page.locator('#board').screenshot({path:`polish-audit/boards/ch${ch}-r${range}-l${level}.png`});
    if (range === 1) await page.screenshot({path:`polish-audit/full-ch${ch}-r1.png`,fullPage:true});
  }
}

check(new Set(styles.map(x=>x.signature)).size === 40, `expected 40 unique cell signatures, found ${new Set(styles.map(x=>x.signature)).size}`);
for (let ch=1; ch<=8; ch++) {
  const rows = styles.filter(x=>x.ch===ch);
  check(new Set(rows.map(x=>x.info.sample[0].borderRadius)).size === 5, `chapter ${ch} does not show five distinct range geometries`);
}
for (let range=1; range<=5; range++) {
  const rows = styles.filter(x=>x.range===range);
  check(new Set(rows.map(x=>x.info.sample[0].backgroundColor)).size === 8, `range ${range} does not show eight distinct chapter base materials`);
}

const sfxSource = await (await fetch('sfx400.js')).text();
const musicSource = await (await fetch('music400.js')).text();
const uiSource = await (await fetch('style400-ui.css')).text();
check(sfxSource.includes('const SFX_OUTPUT_SCALE = 0.60;'), 'SFX output scale constant is missing');
check(sfxSource.includes('volume * SFX_OUTPUT_SCALE'), 'SFX makeAudio path is not using output scale');
check((uiSource.match(/420ms/g)||[]).length >= 2, 'screen transition does not contain both 420ms timings');
const transitionBlock = uiSource.slice(uiSource.indexOf('/* Fast right-swipe root snapshot transitions */'));
check(!transitionBlock.includes('210ms'), 'old 210ms screen transition timing remains');
check(transitionBlock.includes('@media(prefers-reduced-motion:reduce)'), 'reduced motion transition override missing');
check(musicSource.includes('const TARGET_VOLUME = 0.24;'), 'music target unexpectedly changed');
check(pageErrors.length === 0, `page errors: ${pageErrors.join(' | ')}`);

fs.writeFileSync('polish-audit/report.json', JSON.stringify({
  accepted: failures.length===0,
  failures,
  pageErrors,
  uniqueSignatures:new Set(styles.map(x=>x.signature)).size,
  styles:styles.map(x=>({
    chapter:x.ch,range:x.range,level:x.level,
    backgroundColor:x.info.sample[0].backgroundColor,
    borderColor:x.info.sample[0].borderColor,
    borderWidth:x.info.sample[0].borderWidth,
    borderRadius:x.info.sample[0].borderRadius,
    backgroundImage:x.info.sample[0].backgroundImage
  }))
}, null, 2));

await browser.close();
if (failures.length) throw new Error(`polish validation failed: ${failures.length}`);
console.log('AUDIO_TRANSITION_BOARD_POLISH_ACCEPTED signatures=40');
