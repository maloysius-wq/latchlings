const { chromium } = require('playwright');
const fs = require('fs');
const assert = require('assert');

(async()=>{
  fs.mkdirSync('second-review-settled',{recursive:true});
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'networkidle'});

  await page.evaluate(()=>window.LatchlingsCinematics.show('opening',{markSeen:false}));
  await page.waitForTimeout(650);
  assert(await page.locator('#cinematicStage [data-story-action="breakfast-basket-travel"]').count());
  await page.locator('#cinematicStage').screenshot({path:'second-review-settled/opening-basket.png'});
  await page.evaluate(()=>window.LatchlingsCinematics.finish(true));

  await page.evaluate(()=>window.LatchlingsCinematics.show('across-drift',{markSeen:false}));
  for(let i=0;i<20;i++){
    if(await page.evaluate(()=>window.LatchlingsCinematics.beat===4))break;
    await page.evaluate(()=>window.LatchlingsCinematics.next());
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(650);
  assert.strictEqual(await page.evaluate(()=>window.LatchlingsCinematics.beat),4);
  const porch=page.locator('#cinematicStage [data-story-action="route-reaches-familiar-porch"]');
  assert(await porch.count(),'reconnect scene missing');
  const lanterns=page.locator('#cinematicStage .porch-friend-lantern');
  assert((await lanterns.count())>=2,'twin lanterns missing');
  for(let i=0;i<2;i++){
    const b=await lanterns.nth(i).boundingBox();
    assert(b&&b.width>=8&&b.height>=8&&b.x>=0&&b.y>=0&&b.x+b.width<=390&&b.y+b.height<=844,`lantern ${i} not visibly contained`);
  }
  const house=await page.locator('#cinematicStage .porch-house').boundingBox();
  assert(house&&house.width>=35&&house.height>=28,'familiar porch house not visually substantial');
  await page.locator('#cinematicStage').screenshot({path:'second-review-settled/across-porch-reconnect.png'});
  await page.evaluate(()=>window.LatchlingsCinematics.finish(true));

  await page.evaluate(()=>window.LatchlingsCinematics.show('old-maps',{markSeen:false}));
  for(let i=0;i<20;i++){
    if(await page.evaluate(()=>window.LatchlingsCinematics.beat===3))break;
    await page.evaluate(()=>window.LatchlingsCinematics.next());
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(450);
  assert(await page.locator('#cinematicStage [data-story-action="unattended-desk"]').count());
  await page.locator('#cinematicStage').screenshot({path:'second-review-settled/old-maps-unattended-desk.png'});
  await page.evaluate(()=>window.LatchlingsCinematics.finish(true));

  await page.evaluate(()=>window.LatchlingsPrefs.set('textSize','normal'));
  await page.evaluate(()=>openStoryScreen());
  await page.waitForTimeout(650);
  const normal=parseFloat(await page.locator('.story-now-chapter>p').evaluate(el=>getComputedStyle(el).fontSize));
  assert(normal>=14,`normal journal ${normal}px`);
  await page.locator('#story').screenshot({path:'second-review-settled/journal-normal.png'});
  await page.evaluate(()=>window.LatchlingsPrefs.set('textSize','large'));
  await page.waitForTimeout(250);
  const large=parseFloat(await page.locator('.story-now-chapter>p').evaluate(el=>getComputedStyle(el).fontSize));
  assert(large>=16,`large journal ${large}px`);
  await page.locator('#story').screenshot({path:'second-review-settled/journal-large.png'});

  await page.evaluate(()=>window.LatchlingsPrefs.set('motion','reduced'));
  await page.evaluate(()=>window.LatchlingsCinematics.show('across-drift',{markSeen:false}));
  for(let i=0;i<20;i++){
    if(await page.evaluate(()=>window.LatchlingsCinematics.beat===4))break;
    await page.evaluate(()=>window.LatchlingsCinematics.next());
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(200);
  const running=await page.evaluate(()=>document.getElementById('cinematicStage').getAnimations({subtree:true}).filter(a=>a.playState==='running').length);
  assert.strictEqual(running,0,'reduced-motion reconnect scene animates');
  await page.locator('#cinematicStage').screenshot({path:'second-review-settled/across-porch-reconnect-reduced.png'});
  await page.evaluate(()=>window.LatchlingsCinematics.finish(true));

  assert.strictEqual(errors.length,0,errors.join(' | '));
  fs.writeFileSync('second-review-settled/results.json',JSON.stringify({normal,large,running},null,2));
  await browser.close();
})().catch(err=>{console.error(err);process.exit(1)});
