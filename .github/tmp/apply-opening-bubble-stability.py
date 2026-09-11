from pathlib import Path

p=Path('cinematic-dialogue400.js')
s=p.read_text()
old="if(!id||!beat||!overlay||!stage||!lines)return;\n processing=true;"
new="if(!id||!beat||!overlay||!stage||!lines)return;if(overlay.dataset.cinematic!==id||overlay.dataset.visual!==beat.visual)return;\n processing=true;"
if old not in s: raise SystemExit('dialogue readiness gate anchor missing')
s=s.replace(old,new,1)
old="""  if(!stage.querySelector(':scope > .cin-dialogue-layer'))stage.insertAdjacentHTML('beforeend',dialogueLayerHtml(id,index,beat));
  const narration=narratorLines(beat);"""
new="""  if(!stage.querySelector(':scope > .cin-dialogue-layer'))stage.insertAdjacentHTML('beforeend',dialogueLayerHtml(id,index,beat));
  const narration=narratorLines(beat);"""
if old not in s: raise SystemExit('dialogue insertion anchor missing')
# Keep insertion itself unchanged; normalize after all dialogue/narration DOM is settled.
old="""  overlay.dataset.dialogueCount=String(groups.length);
  overlay.dataset.narratorCount=String(narration.length);
 }finally{processing=false}"""
new="""  overlay.dataset.dialogueCount=String(groups.length);
  overlay.dataset.narratorCount=String(narration.length);
  if(groups.length)window.LatchlingsCinematicGeometry?.normalizeDialogue(stage);
 }finally{processing=false}"""
if old not in s: raise SystemExit('dialogue normalize anchor missing')
s=s.replace(old,new,1)
p.write_text(s)

p=Path('cinematic-geometry400.js')
s=p.read_text()
s=s.replace("let raf=0,lastBeatKey='',cargoEpoch=performance.now(),lastDialoguePass=0;","let raf=0,lastBeatKey='',cargoEpoch=performance.now(),lastDialogueLayer=null;",1)
start=s.index('function normalizeDialogue(stage){')
end=s.index('\nfunction tick(time){',start)
new_func=r'''function normalizeDialogue(stage){
 const layers=[...stage.querySelectorAll(':scope > .cin-dialogue-layer')];
 layers.forEach(layer=>{
  const bubbles=[...layer.querySelectorAll('.cin-speech-bubble')];if(!bubbles.length)return;
  const target=Math.max(...bubbles.map(b=>{const br=b.getBoundingClientRect();return Math.max(...[...b.querySelectorAll(':scope>b,:scope>span')].map(x=>Math.ceil(x.getBoundingClientRect().bottom-br.top+6)),0)}));
  const currentHeight=parseFloat(layer.style.getPropertyValue('--cin-bubble-height'))||0;if(Math.abs(currentHeight-target)>.25)layer.style.setProperty('--cin-bubble-height',`${target}px`);
  const sr=stage.getBoundingClientRect(),pad=5;
  bubbles.forEach(b=>{const br=b.getBoundingClientRect(),current=parseFloat(getComputedStyle(b).getPropertyValue('--cin-bubble-shift'))||0,baseLeft=br.left-current,baseRight=br.right-current;let desired=0;if(baseLeft<sr.left+pad)desired+=sr.left+pad-baseLeft;if(baseRight>sr.right-pad)desired-=baseRight-(sr.right-pad);if(Math.abs(desired-current)>.25)b.style.setProperty('--cin-bubble-shift',`${desired.toFixed(2)}px`)});
  bubbles.forEach(b=>{const speaker=b.closest('[data-speaker]'),portrait=speaker?.querySelector('.dialogue-portrait'),br=b.getBoundingClientRect(),pr=portrait?.getBoundingClientRect();if(!pr||!br.width)return;const px=pr.left+pr.width/2,tail=clamp((px-br.left)/br.width*100,8,92),current=parseFloat(b.style.getPropertyValue('--cin-tail-x'))||50;if(Math.abs(current-tail)>.1)b.style.setProperty('--cin-tail-x',`${tail.toFixed(2)}%`)});
 });
}'''
s=s[:start]+new_func+s[end:]
old=""" const beat=API.beat+1,key=`${API.active}:${beat}`;overlay.dataset.beat=String(beat);if(key!==lastBeatKey){lastBeatKey=key;cargoEpoch=time;normalizeDialogue(stage);lastDialoguePass=time}
 enhanceTrees(stage);"""
new=""" const beat=API.beat+1,key=`${API.active}:${beat}`;overlay.dataset.beat=String(beat);if(key!==lastBeatKey){lastBeatKey=key;cargoEpoch=time;lastDialogueLayer=null}
 const dialogueLayer=stage.querySelector(':scope > .cin-dialogue-layer');if(dialogueLayer!==lastDialogueLayer){lastDialogueLayer=dialogueLayer;if(dialogueLayer)normalizeDialogue(stage)}
 enhanceTrees(stage);"""
if old not in s: raise SystemExit('geometry beat anchor missing')
s=s.replace(old,new,1)
old=""" if(brightGeom)layoutCargo(stage,brightGeom,(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)?cargoEpoch+2200:time);
 if(time-lastDialoguePass>500){normalizeDialogue(stage);lastDialoguePass=time}
 raf=requestAnimationFrame(tick);"""
new=""" if(brightGeom)layoutCargo(stage,brightGeom,(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)?cargoEpoch+2200:time);
 raf=requestAnimationFrame(tick);"""
if old not in s: raise SystemExit('periodic normalize anchor missing')
s=s.replace(old,new,1)
old="function start(){if(!raf)raf=requestAnimationFrame(tick)}"
new="function start(){if(!raf)raf=requestAnimationFrame(tick)}\nwindow.addEventListener('resize',()=>{const stage=document.getElementById('cinematicStage');if(stage)normalizeDialogue(stage)},{passive:true});"
if old not in s: raise SystemExit('resize anchor missing')
s=s.replace(old,new,1)
p.write_text(s)

p=Path('index.html')
s=p.read_text()
if '<script src="cinematic-dialogue400.js"></script>' not in s: raise SystemExit('dialogue script tag missing')
if '<script src="cinematic-geometry400.js"></script>' not in s: raise SystemExit('geometry script tag missing')
s=s.replace('<script src="cinematic-dialogue400.js"></script>','<script src="cinematic-dialogue400.js?v=20260911-bubblestable1"></script>',1)
s=s.replace('<script src="cinematic-geometry400.js"></script>','<script src="cinematic-geometry400.js?v=20260911-bubblestable1"></script>',1)
p.write_text(s)
