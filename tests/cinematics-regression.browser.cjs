const assert = require('assert');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};
const server = http.createServer((request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1');
  const requested = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
  const file = path.join(root, requested.endsWith('/') ? `${requested}index.html` : requested);
  if (!file.startsWith(root)) return response.writeHead(403).end();
  fs.readFile(file, (error, data) => {
    if (error) return response.writeHead(404).end();
    response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    response.end(data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const pageErrors = [];
  for (const [width, height] of [[320, 568], [390, 844], [430, 932]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => pageErrors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: 'networkidle' });
    const laterCount = await page.evaluate(() => ['across-drift', 'old-maps', 'homeward']
      .flatMap(id => LatchlingsCinematics.CINEMATICS[id].beats.flatMap(beat => beat.lines)).length);
    assert.equal(laterCount, 38, 'the three later cinematics must retain all 38 utterances');

    for (const id of ['across-drift', 'old-maps', 'homeward']) {
      await page.evaluate(cinematicId => LatchlingsCinematics.show(cinematicId, { markSeen: false }), id);
      await page.locator('#cinematicOverlay.show').waitFor({ state: 'visible' });
      let utterances = 0;
      while (await page.evaluate(() => Boolean(LatchlingsCinematics.active))) {
        const layout = await page.evaluate(() => {
          const stage = document.querySelector('#cinematicStage').getBoundingClientRect();
          const copy = document.querySelector('.cinematic-copy').getBoundingClientRect();
          const footer = document.querySelector('.cinematic-footer').getBoundingClientRect();
          const next = document.querySelector('#cinematicNext').getBoundingClientRect();
          const skip = document.querySelector('#cinematicSkip').getBoundingClientRect();
          return {
            stage: stage.toJSON(), copy: copy.toJSON(), footer: footer.toJSON(),
            next: next.toJSON(), skip: skip.toJSON(), scrollWidth: document.documentElement.scrollWidth
          };
        });
        assert(layout.stage.bottom <= layout.copy.top + 1, `${id}: scenery entered the dialogue region`);
        assert(layout.copy.bottom <= layout.footer.top + 1, `${id}: dialogue entered the controls`);
        for (const control of [layout.next, layout.skip]) {
          assert(control.left >= 0 && control.right <= width && control.top >= 0 && control.bottom <= height,
            `${id}: a cinematic control left the ${width}x${height} viewport`);
        }
        assert(layout.scrollWidth <= width, `${id}: horizontal overflow at ${width}px`);
        utterances++;
        await page.locator('#cinematicNext').click();
        await page.waitForTimeout(70);
        if (utterances > 40) throw new Error(`${id}: cinematic did not finish`);
      }
    }
    await context.close();
  }
  await browser.close();
  server.close();
  assert.deepEqual(pageErrors, []);
  console.log('PASS later cinematic regression: 38 utterances at three phone sizes');
})().catch(error => {
  console.error(error);
  server.close();
  process.exit(1);
});

