const { chromium } = require('playwright');
const fs = require('fs');
const assert = require('assert');
const viewports=[['short',320,568],['phone',390,844],['wide',430,932]];

(async()=>{
  const browser=await chromium.launch({headless:true});
  const results={viewports:{},canonicalTurns:0};
  for(const [name,width,height] of viewports){
    const page=await browser.newPage({viewport:{width,height}});
    const errors=[];
    page.on('pageerror',e=>errors.push(String(e)));
    await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
    await page.evaluate(()=>localStorage.clear());
    await page.reload({waitUntil:'networkidle'});

    const canonical=await page.evaluate(()=>Object.values(window.LatchlingsCinematics.CINEMATICS).reduce((n,c)=>n+c.beats.reduce((m,b)=>m+b.lines.length,0),0));
    assert.strictEqual(canonical,56,'canonical cinematic utterance count changed');
    const openingCount=await page.evaluate(()=>window.LatchlingsCinematics.CINEMATICS.opening.beats.reduce((n,b)=>n+b.lines.length,0));
    assert.strictEqual(openingCount,18,'canonical opening replay changed');

    await page.evaluate(()=>window.LatchlingsCinematics.show('opening',{markSeen:false}));
    let replay=0;
    while(await page.evaluate(()=>!!window.LatchlingsCinematics.active)){
      await page.evaluate(()=>window.LatchlingsCinematics.next());
      replay++;
      await page.waitForTimeout(50);
      if(replay>30)throw new Error('full opening stuck');
    }
    assert.strictEqual(replay,18,'full opening replay must stay 18 advances');

    await page.evaluate(()=>localStorage.removeItem('latchlings_cinematics_seen_v1'));
    await page.evaluate(()=>window.LatchlingsCinematics.maybeShowBeforeLevel(1,1,()=>{}));
    const seen=[];let firstRun=0;
    while(await page.evaluate(()=>!!window.LatchlingsCinematics.active)){
      seen.push(await page.evaluate(()=>[window.LatchlingsCinematics.beat,window.LatchlingsCinematics.line,window.LatchlingsCinematics.mode]));
      await page.evaluate(()=>window.LatchlingsCinematics.next());
      firstRun++;
      await page.waitForTimeout(50);
      if(firstRun>10)throw new Error('first-run opening stuck');
    }
    assert.strictEqual(firstRun,5,'first-run opening must be exactly five advances');
    assert.deepStrictEqual(seen.map(x=>x.slice(0,2)),[[0,0],[2,2],[4,0],[6,0],[7,0]],'first-run opening must use approved canonical hook sequence');
    assert(seen.every(x=>x[2]==='first-run'),'first-run mode marker missing');

    await page.evaluate(()=>window.LatchlingsCinematics.show('opening',{markSeen:false}));
    await page.waitForTimeout(120);
    assert(await page.locator('#cinematicStage [data-story-action="breakfast-basket-travel"]').count(),'opening basket action missing');
    const openingBox=await page.locator('#cinematicStage').boundingBox();
    assert(openingBox&&openingBox.y>=0&&openingBox.y+openingBox.height<=height+1,'opening stage overflow');
    if(name==='phone') await page.locator('#cinematicStage').screenshot({path:'second-review-evidence/opening-basket-dialogue-hidden.png'});
    await page.evaluate(()=>window.LatchlingsCinematics.finish(true));

    await page.evaluate(()=>window.LatchlingsCinematics.show('across-drift',{markSeen:false}));
    for(let i=0;i<20;i++){
      if(await page.evaluate(()=>window.LatchlingsCinematics.beat===4))break;
      await page.evaluate(()=>window.LatchlingsCinematics.next());
      await page.waitForTimeout(50);
    }
    assert.strictEqual(await page.evaluate(()=>window.LatchlingsCinematics.beat),4,'Across beat 5 not reached');
    assert(await page.locator('#cinematicStage [data-story-action="route-reaches-familiar-porch"]').count(),'porch reconnect action missing');
    assert((await page.locator('#cinematicStage .porch-friend-lantern').count())>=2,'twin-lantern porch identity missing');
    if(name==='phone') await page.locator('#cinematicStage').screenshot({path:'second-review-evidence/across-porch-reconnect-dialogue-hidden.png'});
    await page.evaluate(()=>window.LatchlingsCinematics.finish(true));

    await page.evaluate(()=>window.LatchlingsCinematics.show('old-maps',{markSeen:false}));
    for(let i=0;i<20;i++){
      if(await page.evaluate(()=>window.LatchlingsCinematics.beat===3))break;
      await page.evaluate(()=>window.LatchlingsCinematics.next());
      await page.waitForTimeout(50);
    }
    assert(await page.locator('#cinematicStage [data-story-action="unattended-desk"]').count(),'unattended desk cue missing');
    await page.evaluate(()=>window.LatchlingsCinematics.finish(true));

    await page.evaluate(()=>window.LatchlingsPrefs.set('textSize','normal'));
    await page.evaluate(()=>openStoryScreen());
    await page.waitForTimeout(100);
    const normal=parseFloat(await page.locator('.story-now-chapter>p').evaluate(el=>getComputedStyle(el).fontSize));
    assert(normal>=14,`journal Normal ${normal}px below 14px`);
    let docOverflow=await page.evaluate(()=>document.documentElement.scrollHeight>innerHeight+2||document.documentElement.scrollWidth>innerWidth+2);
    assert(!docOverflow,`${name} journal document overflow at Normal`);
    if(name==='phone') await page.locator('#story').screenshot({path:'second-review-evidence/journal-normal.png'});

    await page.evaluate(()=>window.LatchlingsPrefs.set('textSize','large'));
    await page.waitForTimeout(100);
    const large=parseFloat(await page.locator('.story-now-chapter>p').evaluate(el=>getComputedStyle(el).fontSize));
    assert(large>=16,`journal Large ${large}px below 16px`);
    docOverflow=await page.evaluate(()=>document.documentElement.scrollHeight>innerHeight+2||document.documentElement.scrollWidth>innerWidth+2);
    assert(!docOverflow,`${name} journal document overflow at Large`);
    if(name==='phone') await page.locator('#story').screenshot({path:'second-review-evidence/journal-large.png'});

    await page.evaluate(()=>window.LatchlingsPrefs.set('motion','reduced'));
    await page.evaluate(()=>window.LatchlingsCinematics.show('opening',{markSeen:false}));
    await page.waitForTimeout(100);
    const running=await page.evaluate(()=>document.getElementById('cinematicStage').getAnimations({subtree:true}).filter(a=>a.playState==='running').length);
    assert.strictEqual(running,0,`${name} reduced-motion cinematic still animates`);
    await page.evaluate(()=>window.LatchlingsCinematics.finish(true));
    assert.strictEqual(errors.length,0,`${name} page errors: ${errors.join(' | ')}`);
    results.viewports[name]={firstRun,replay,normal,large,running};
    await page.close();
  }

  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  const ids=['opening','across-drift','old-maps','homeward'];
  let turns=0;
  for(const id of ids){
    await page.evaluate(id=>window.LatchlingsCinematics.show(id,{markSeen:false}),id);
    while(await page.evaluate(()=>!!window.LatchlingsCinematics.active)){
      const state=await page.evaluate(()=>{
        const A=window.LatchlingsCinematics,c=A.CINEMATICS[A.active],b=c.beats[A.beat],line=b.lines[A.line],next=document.getElementById('cinematicNext').getBoundingClientRect(),skip=document.getElementById('cinematicSkip').getBoundingClientRect();
        return {line,beat:A.beat,li:A.line,nextBottom:next.bottom,skipBottom:skip.bottom,h:innerHeight};
      });
      assert(state.line&&state.line[1],'canonical line missing');
      assert(state.nextBottom<=state.h+1&&state.skipBottom<=state.h+1,'cinematic controls not visible');
      turns++;
      await page.evaluate(()=>window.LatchlingsCinematics.next());
      await page.waitForTimeout(45);
    }
  }
  assert.strictEqual(turns,56,'full canonical cinematic replay did not retain 56 turns');
  results.canonicalTurns=turns;
  fs.writeFileSync('second-review-evidence/results.json',JSON.stringify(results,null,2));
  await browser.close();
})().catch(err=>{console.error(err);process.exit(1)});
