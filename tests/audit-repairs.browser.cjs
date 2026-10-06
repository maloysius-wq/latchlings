'use strict';
const assert=require('assert');
const fs=require('fs'),http=require('http'),path=require('path'),os=require('os');
const {chromium}=require('playwright');
const {waitForOpeningFramePaint}=require('./opening-frame-ready.cjs');
const root=path.resolve(__dirname,'..');
const evidence=fs.mkdtempSync(path.join(os.tmpdir(),'latchlings-audit-repairs-'));
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname.replace(/\/$/,'/index.html'));
 if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
 fs.readFile(file,(error,data)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(data)});
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:process.env.CI?undefined:'chrome'}),failures=[];
 const check=(condition,message)=>{if(!condition)failures.push(message)};
 try{
  const page=await browser.newPage({viewport:{width:320,height:568},reducedMotion:'reduce'});
  await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'load'});
  if(process.env.AUDIT_HOME_FRAMING_ONLY==='true'){
   await page.evaluate(()=>{LatchlingsCinematics.finish(true);assertionSafeShow();function assertionSafeShow(){if(!LatchlingsCinematics.show('homeward',{markSeen:false}))throw new Error('Homeward did not start');for(let turn=0;turn<30&&LatchlingsCinematics.beat<5;turn++)LatchlingsCinematics.next()}});
   await page.waitForFunction(()=>{const doc=document.querySelector('.cin-home-reference')?.contentDocument;return doc?.readyState==='complete'&&doc.querySelector('#c2 .cottage')});
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const cropped=await page.evaluate(()=>{const frame=document.querySelector('.cin-home-reference');return [...frame.contentDocument.querySelectorAll('#c2 .cottage,#c2 .little-home-tree .foliage')].filter(el=>{const r=el.getBoundingClientRect();return r.top<0||r.left<0||r.bottom>frame.contentWindow.innerHeight||r.right>frame.contentWindow.innerWidth}).map(el=>el.className)});
   if(cropped.length)console.error('HOME FRAME',await page.evaluate(()=>{const f=document.querySelector('.cin-home-reference'),s=f.contentDocument.querySelector('#c2 .scene');return {frame:[f.clientWidth,f.clientHeight],scene:s?.getBoundingClientRect().toJSON(),style:s?.style.cssText,transform:s?getComputedStyle(s).transform:null,network:document.querySelector('.cin-network')?.className}}));
   assert.deepStrictEqual(cropped,[],'Homeward canonical miniature must fit the short-phone frame');
   if(process.env.AUDIT_LABEL_ONLY==='true'){
    const covered=await page.evaluate(()=>{const f=document.querySelector('.cin-home-reference'),fr=f.getBoundingClientRect(),r=f.contentDocument.querySelector('#c2 .island-top').getBoundingClientRect(),label=document.querySelector('[data-network-node="copperline"] span').getBoundingClientRect(),a={left:fr.left+r.left*fr.width/f.clientWidth,right:fr.left+r.right*fr.width/f.clientWidth,top:fr.top+r.top*fr.height/f.clientHeight,bottom:fr.top+r.bottom*fr.height/f.clientHeight};return label.left<a.right&&label.right>a.left&&label.top<a.bottom&&label.bottom>a.top});
    assert(!covered,'Copperline name must stay outside Little Home ground');
   }
   console.log('PASS focused Homeward miniature framing');return;
  }
  await page.evaluate(()=>localStorage.setItem('latchlings_cinematics_seen_v1',JSON.stringify({opening:1,'across-drift':1,'old-maps':1,homeward:1})));
  for(const textSize of ['normal','large']){
   const clipped=await page.evaluate(size=>{
    LatchlingsPrefs.set('textSize',size);const bad=[];
    for(let level=1;level<=400;level++){
     startLevel(level);LatchlingsStoryTheme.close(false);LatchlingsCinematics.finish(true);LatchlingsStoryRail.render();
     const p=document.querySelector('#storyRailSlot .story-rail-main p');
     if(p.scrollHeight>p.clientHeight+1)bad.push(level);
    }
    return bad;
   },textSize);
   check(clipped.length===0,`${textSize}: complete compact motives must fit all 400 levels; clipped ${clipped.slice(0,12)}`);
  }
  const colors=await page.evaluate(()=>{
   const out=[];screen('levels');
   for(let ch=1;ch<=8;ch++){
    const start=(ch-1)*50+1;progress={unlocked:start+2,stars:{[start+1]:3}};chapterView=ch;rangeView=0;renderChapter();
    for(const [state,level] of [['restored',start+1],['current',start+2],['locked',start+3]]){
     const node=document.querySelector(`.atlas-node[data-level="${level}"]`);node.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));
     for(const el of document.querySelectorAll('.atlas-node-detail strong,.atlas-node-detail span')){const style=getComputedStyle(el);out.push({ch,state,color:style.color,opacity:Number(style.opacity)})}
    }
   }return out;
  });
  for(const {ch,state,color,opacity} of colors){const rgb=color.match(/[\d.]+/g).slice(0,3).map(Number),linear=rgb.map(v=>{v=(v*opacity+244*(1-opacity))/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}),lum=linear[0]*.2126+linear[1]*.7152+linear[2]*.0722;check((.85+.05)/(lum+.05)>=4.5,`Atlas chapter ${ch}/${state}: readable title/state after opacity on cream panel, got ${color}/${opacity}`)}
  const recovered=await page.evaluate(()=>{
   startLevel(3);LatchlingsStoryTheme.close(false);LatchlingsCinematics.finish(true);LatchlingsStoryRail.render();
   document.querySelector('.story-rail-story-btn').click();const panel=document.querySelector('.story-card-panel');
   const result=panel.textContent.includes(STORY.levelMeta(3).context);LatchlingsStoryTheme.close(false);return result;
  });
  check(recovered,'Short-phone Story button must recover the complete current level context, not a generic motive');
  const recap=await page.evaluate(()=>{progress={unlocked:251,stars:{250:3}};renderStoryScreen();return document.querySelector('.story-now-chapter p').textContent});
  check(!/original Skyway|designed to keep changing|overturn|all correct/i.test(recap),'Copperline entry recap must not reveal the later map discovery');
  const atlasRecap=await page.evaluate(()=>{chapterView=6;rangeView=0;renderChapter();return document.querySelector('.atlas-chapter-blurb').textContent});
  check(!/always designed|always meant/i.test(atlasRecap),'Copperline Atlas entry must not reveal the later map discovery');
  const boundaries=await page.evaluate(()=>{
   const bad=[];
   for(let ch=1;ch<=8;ch++){
    const start=(ch-1)*50+1,end=ch*50,outcome=STORY.chapters[ch-1].arc.outcome;
    for(const unlocked of [start,start+10,start+20,end]){
     progress={unlocked,stars:{}};renderStoryScreen();
     if(document.querySelector('.story-now-chapter p').textContent===outcome)bad.push(`${ch}/${unlocked}: unearned Journal outcome`);
     chapterView=ch;rangeView=0;renderChapter();
     if(document.querySelector('.atlas-blurb-full').textContent===outcome)bad.push(`${ch}/${unlocked}: unearned Atlas outcome`);
    }
    progress={unlocked:Math.min(400,end+1),stars:{[end]:1}};chapterView=ch;rangeView=0;renderChapter();
    if(document.querySelector('.atlas-blurb-full').textContent!==outcome)bad.push(`${ch}: earned outcome missing`);
   }return bad;
  });
  check(boundaries.length===0,`Chapter entry/discovery/earned summary boundaries: ${boundaries.join(', ')}`);
  for(const width of [320,390,430])for(const level of [1,51,301,366]){
   await page.setViewportSize({width,height:width===320?568:width===390?844:932});
   const layers=await page.evaluate(level=>{
    LatchlingsPrefs.set('textSize','large');startLevel(level);LatchlingsStoryTheme.close(false);LatchlingsCinematics.finish(true);LatchlingsStoryRail.render();
    const ui=[...document.querySelectorAll('#game .topbar,#game .story-rail-slot,#game #mechanicContext,#game .controls')];
    return {board:Number(getComputedStyle(document.querySelector('#board')).zIndex),ui:ui.map(el=>Number(getComputedStyle(el).zIndex))};
   },level);
   check(layers.ui.length===4&&layers.ui.every(z=>z>layers.board),`${width}/Level ${level}: gameplay UI must stay above the decorative board context`);
   // startLevel intentionally queues its movement intro; settle it before a
   // gameplay-only capture, rather than accidentally photographing that card.
   await page.waitForTimeout(250);
   await page.evaluate(()=>{LatchlingsStoryTheme.close(false);LatchlingsCinematics.finish(true)});
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   await page.screenshot({path:path.join(evidence,`${width}-large-gameplay-${level}.png`)});
  }
  for(const width of [320,390,430])for(const reduced of [false,true]){
   await page.setViewportSize({width,height:width===320?568:width===390?844:932});
   await page.emulateMedia({reducedMotion:reduced?'reduce':'no-preference'});
   await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'load'});
   await page.evaluate(()=>{LatchlingsPrefs.set('textSize','normal');LatchlingsCinematics.show('across-drift',{markSeen:false});while(LatchlingsCinematics.beat<1)LatchlingsCinematics.next()});
   await page.waitForSelector('.lookout-tansy');
   const grounded=await page.evaluate(()=>{const actor=document.querySelector('.lookout-tansy'),island=document.querySelector('.porch-near-island');if(!actor||!island)return null;const a=actor.getBoundingClientRect(),i=island.getBoundingClientRect();return {feet:a.bottom,surface:i.top+i.height*.30,edge:i.bottom}});
   check(grounded&&grounded.feet>=grounded.surface&&grounded.feet<=grounded.edge,`${width}: Tansy's feet must rest on foreground ground, got ${JSON.stringify(grounded)}`);
   await page.screenshot({path:path.join(evidence,`${width}-${reduced?'reduced':'motion'}-familiar-porch.png`)});
   await page.evaluate(()=>LatchlingsCinematics.finish(true));
  }
  for(const width of [320,390,430])for(const reduced of [false,true])for(const textSize of ['normal','large']){
   await page.setViewportSize({width,height:width===320?568:width===390?844:932});
   await page.emulateMedia({reducedMotion:reduced?'reduce':'no-preference'});
   await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'load'});
   await page.evaluate(size=>LatchlingsPrefs.set('textSize',size),textSize);
   for(const [visual,index] of [['keepsakes',1],['living-network',2],['aurora-crown',4],['homeward-network',5]]){
    await page.evaluate(index=>{LatchlingsCinematics.show('homeward',{markSeen:false});while(LatchlingsCinematics.beat<index)LatchlingsCinematics.next()},index);
    await page.waitForFunction(visual=>LatchlingsCinematics.active==='homeward'&&document.querySelector('#cinematicOverlay')?.dataset.visual===visual,visual);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    if(visual==='homeward-network'){
     await page.waitForFunction(()=>{const doc=document.querySelector('.cin-home-reference')?.contentDocument;return doc?.readyState==='complete'&&doc.querySelector('#c2 .cottage')});
     await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
     const cropped=await page.evaluate(()=>{const frame=document.querySelector('.cin-home-reference');return [...frame.contentDocument.querySelectorAll('#c2 .cottage,#c2 .little-home-tree .foliage')].filter(el=>{const r=el.getBoundingClientRect();return r.top<0||r.left<0||r.bottom>frame.contentWindow.innerHeight||r.right>frame.contentWindow.innerWidth}).map(el=>el.className)});
     check(cropped.length===0,`${width}/${textSize}: Homeward must frame the canonical cottage and tree, cropped ${cropped}`);
     if(width===320){const covered=await page.evaluate(()=>{const f=document.querySelector('.cin-home-reference'),fr=f.getBoundingClientRect(),r=f.contentDocument.querySelector('#c2 .island-top').getBoundingClientRect(),label=document.querySelector('[data-network-node="copperline"] span').getBoundingClientRect(),a={left:fr.left+r.left*fr.width/f.clientWidth,right:fr.left+r.right*fr.width/f.clientWidth,top:fr.top+r.top*fr.height/f.clientHeight,bottom:fr.top+r.bottom*fr.height/f.clientHeight};return label.left<a.right&&label.right>a.left&&label.top<a.bottom&&label.bottom>a.top});check(!covered,'320px Homeward Copperline name must stay clear of the painted Little Home ground')}
    }
    const state=await page.evaluate(()=>{
     const detail=document.querySelector('.cin-scene-detail'),spoken=document.querySelector('.cin-opening-dialogue-dock')||document.querySelector('.cinematic-lines'),boxes=[...document.querySelectorAll('.work-station')].map(station=>{const r=station.getBoundingClientRect(),feet=station.querySelector('.cin-character').getBoundingClientRect().bottom;return {feet,ground:r.top+r.height*.5,lowerEdge:r.top+r.height*.76,font:parseFloat(getComputedStyle(station.querySelector('b')).fontSize)}});
     return {detailFont:detail?parseFloat(getComputedStyle(detail).fontSize):0,detailAfterSpeech:!!detail&&!!(spoken.compareDocumentPosition(detail)&Node.DOCUMENT_POSITION_FOLLOWING),boxes};
    });
    check(state.detailFont>=12,`${width}/${textSize}/${visual}: essential scene names need a readable detail treatment`);
    check(state.detailAfterSpeech,`${width}/${textSize}/${visual}: optional map details must not push the spoken line below the fold`);
    if(visual==='keepsakes')check(state.boxes.length===3&&state.boxes.every(b=>b.feet>=b.ground&&b.feet<=b.lowerEdge&&b.font>=12),`${width}/${textSize}: work-crew residents and action labels must be grounded/readable`);
    await page.screenshot({path:path.join(evidence,`${width}-${textSize}-${reduced?'reduced':'motion'}-homeward-${visual}.png`)});
    await page.evaluate(()=>LatchlingsCinematics.finish(true));
   }
  }
  await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'no-preference'});
  await page.evaluate(()=>{LatchlingsPrefs.set('motion','system');LatchlingsCinematics.show('homeward',{markSeen:false});LatchlingsCinematics.next()});
  await page.waitForSelector('.work-station .anchor-ring');
  const startAnchor=await page.locator('.work-station .anchor-ring').boundingBox();
  await page.waitForTimeout(4300);
  const endAnchor=await page.locator('.work-station .anchor-ring').boundingBox();
  check(endAnchor.y-startAnchor.y>=5,'Lodestone work must visibly adjust the anchor and retain the new position, not wiggle back to the old one');
  await page.screenshot({path:path.join(evidence,'390-homeward-work-completed.png')});
  await page.evaluate(()=>LatchlingsCinematics.finish(true));
  for(const width of [320,390,430])for(const reduced of [false,true])for(const textSize of ['normal','large']){
   await page.setViewportSize({width,height:width===320?568:width===390?844:932});
   await page.emulateMedia({reducedMotion:reduced?'reduce':'no-preference'});
   await page.evaluate(size=>{LatchlingsPrefs.set('textSize',size);LatchlingsPrefs.set('motion','system')},textSize);
   for(const [id,visual] of [['across-drift','prism-view'],['across-drift','network-miss'],['across-drift','map-mismatch'],['old-maps','brand-new-route']]){
   await page.evaluate(({id,visual})=>{LatchlingsCinematics.show(id,{markSeen:false});const index=LatchlingsCinematics.CINEMATICS[id].beats.findIndex(b=>b.visual===visual);while(LatchlingsCinematics.beat<index)LatchlingsCinematics.next()},{id,visual});
   await page.waitForTimeout(100);
   const action=await page.evaluate(()=>{
    const root=document.querySelector('.cin-action-scene'),center=el=>{const r=el.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}};
    const paths=[...root?.querySelectorAll('path[data-from][data-to]')||[]],distances=paths.flatMap(path=>[0,1].map(t=>{const p=path.getPointAtLength(path.getTotalLength()*t),screen=new DOMPoint(p.x,p.y).matrixTransform(path.getScreenCTM()),anchor=center(root.querySelector(`[data-network-anchor="${t?path.dataset.to:path.dataset.from}"]`));return Math.hypot(screen.x-anchor.x,screen.y-anchor.y)}));
    const caption=root?.querySelector('.action-caption')?.getBoundingClientRect(),labels=[...root?.querySelectorAll('.action-island b')||[]].map(el=>el.getBoundingClientRect());
    const labelsCovered=caption&&labels.some(r=>caption.top-r.bottom<4);
    const ghosts=[...root?.querySelectorAll('.action-old-stop')||[]].map(el=>el.getBoundingClientRect()),landmarks=[...root?.querySelectorAll('.action-landmark')||[]].map(el=>el.getBoundingClientRect());
    const ghostsCoverLandmarks=ghosts.some(a=>landmarks.some(b=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top));
    return {exists:!!root,ready:root?.dataset.geometryReady,paths:paths.length,distances,labelsCovered,ghostsCoverLandmarks,progress:Number(root?.dataset.travelProgress||0)};
   });
   check(action.exists&&action.ready==='true'&&action.paths>=2,`${visual}: recognizable story action must have measured landmark routes, got ${JSON.stringify(action)}`);
   check(action.distances.every(d=>d<=2),`${width}/${reduced}/${textSize} ${visual}: actual route endpoints must touch rendered stops`);
   check(!action.labelsCovered,`${width}/${reduced}/${textSize} ${visual}: scenic captions must not cover place names`);
   check(!action.ghostsCoverLandmarks,`${width}/${reduced}/${textSize} ${visual}: historical markers must not cover current landmarks`);
   const stem=`${width}-${textSize}-${reduced?'reduced':'motion'}-${visual}`;
   if(visual==='brand-new-route'&&!reduced)check(action.progress>0&&action.progress<1,`${stem}: parcel must visibly travel before landing`);
   await page.screenshot({path:path.join(evidence,stem+'-moving.png')});
   if(visual==='brand-new-route'){
    if(!reduced){await page.waitForTimeout(700);await page.setViewportSize({width:width+8,height:width===320?568:width===390?844:932})}
    await page.waitForFunction(()=>document.querySelector('.cin-action-scene')?.dataset.landed==='true');
    await page.waitForFunction(()=>{const root=document.querySelector('.cin-action-scene'),a=root.querySelector('.action-courier').getBoundingClientRect(),b=root.querySelector('[data-network-anchor="home"]').getBoundingClientRect();return Math.hypot(a.left+a.width/2-b.left-b.width/2,a.top+a.height/2-b.top-b.height/2)<=2});
    const distance=await page.evaluate(()=>{const root=document.querySelector('.cin-action-scene'),a=root.querySelector('.action-courier').getBoundingClientRect(),b=root.querySelector('[data-network-anchor="home"]').getBoundingClientRect();return Math.hypot(a.left+a.width/2-b.left-b.width/2,a.top+a.height/2-b.top-b.height/2)});
    check(distance<=2,`${stem}: actual parcel must land on the measured Little Home stop after resize (${distance}px)`);
    await page.setViewportSize({width,height:width===320?568:width===390?844:932});
   }
   await page.screenshot({path:path.join(evidence,stem+'-settled.png')});
   await page.locator('.cinematic-copy').evaluate(el=>el.style.visibility='hidden');
   await page.screenshot({path:path.join(evidence,stem+'-no-dialogue.png')});
   await page.locator('.cinematic-copy').evaluate(el=>el.style.visibility='');
   await page.evaluate(()=>LatchlingsCinematics.finish(true));
   }
  }
  for(const width of [320,390,430]){
   await page.setViewportSize({width,height:width===320?568:width===390?844:932});
   await page.evaluate(()=>{LatchlingsPrefs.set('textSize','large');LatchlingsCinematics.show('opening',{markSeen:false})});
   await waitForOpeningFramePaint(page);
   const framing=await page.evaluate(()=>{const frame=document.querySelector('.opening-home-reference'),doc=frame.contentDocument;return {cropped:[...doc.querySelectorAll('#c2 .cottage,#c2 .little-home-tree .foliage')].filter(el=>{const r=el.getBoundingClientRect();return r.left<0||r.top<0||r.right>frame.contentWindow.innerWidth||r.bottom>frame.contentWindow.innerHeight}).map(el=>el.className),stage:document.querySelector('#cinematicStage').clientHeight,copy:document.querySelector('.cinematic-copy').clientHeight}});
   check(framing.cropped.length===0,`${width}: Opening crown/cottage must fit the canonical iframe, cropped ${framing.cropped}`);
   if(width>320)check(framing.stage>framing.copy,`${width}: scenic Opening should not yield most of its height to an empty copy dock`);
   await page.evaluate(()=>LatchlingsCinematics.finish(true));
  }
  assert.deepStrictEqual(failures,[],'Independent audit regressions:\n'+failures.join('\n'));
  console.log('PASS complete phone motives, Atlas contrast, earned summaries and grounded lookout residents');
  console.log('AUDIT CAPTURES '+evidence);
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(error=>{console.error(error);process.exitCode=1});
