from pathlib import Path
import re

root = Path('.')

# The existing dialogue post-processor previously expanded every utterance in a beat,
# which defeats Pass 4's one-speaker chronological turn model. Make it consume the
# canonical active line from cinematics400.js instead of rebuilding the whole beat.
path = root / 'cinematic-dialogue400.js'
src = path.read_text(encoding='utf-8')
replacement = r'''function postProcess(){
 scheduled=false;if(processing)return;
 const id=API.active,index=API.beat,lineIndex=Math.max(0,Number(API.line)||0),c=API.CINEMATICS[id],beat=c&&c.beats[index],line=beat&&beat.lines&&beat.lines[lineIndex],overlay=document.getElementById('cinematicOverlay'),stage=document.getElementById('cinematicStage'),lines=document.getElementById('cinematicLines');
 if(!id||!beat||!line||!overlay||!stage||!lines)return;if(overlay.dataset.cinematic!==id||overlay.dataset.visual!==beat.visual)return;
 processing=true;
 try{
  const speaker=line[0],text=line[1],groups=CAST[speaker]?[[speaker,[text]]]:[],narration=speaker==='Narrator'?[text]:[],copy=lines.closest('.cinematic-copy'),turnKey=`${id}:${index+1}:${lineIndex+1}`;
  stage.querySelectorAll(':scope > .cin-dialogue-layer').forEach(node=>node.remove());
  let dock=copy?.querySelector(':scope > .cin-opening-dialogue-dock')||null;
  if(dock&&dock.dataset.key!==turnKey){dock.remove();dock=null}
  if(groups.length&&copy&&!dock){lines.insertAdjacentHTML('afterend',openingDockHtml(id,index,groups));dock=copy.querySelector(':scope > .cin-opening-dialogue-dock');if(dock)dock.dataset.key=turnKey}
  if(!groups.length&&dock)dock.remove();
  if(!lines.classList.contains('cinematic-narration-only'))lines.classList.add('cinematic-narration-only');
  lines.dataset.narratorCount=String(narration.length);
  const desired=narration.map(value=>`<p class="narrator-only"><span>${escapeHtml(value)}</span></p>`).join('');
  if(lines.innerHTML!==desired)lines.innerHTML=desired;
  lines.hidden=!narration.length;
  overlay.dataset.dialogueCount=String(groups.length);overlay.dataset.narratorCount=String(narration.length);overlay.dataset.turn=String(lineIndex);
 }finally{processing=false}
}
'''
src, count = re.subn(r'function postProcess\(\)\{.*?\n\}(?=\nfunction schedule\(\))', replacement.rstrip(), src, count=1, flags=re.S)
assert count == 1, 'dialogue postProcess replacement failed'
path.write_text(src, encoding='utf-8')

# Cache-bust the dialogue processor as part of the same Pass 4 candidate.
index_path = root / 'index.html'
index = index_path.read_text(encoding='utf-8')
old = 'cinematic-dialogue400.js?v=20260912-pass1'
new = 'cinematic-dialogue400.js?v=20260914-astra-pass4-candidate1'
assert old in index or new in index, 'dialogue script cache key changed unexpectedly'
index = index.replace(old, new)
index_path.write_text(index, encoding='utf-8')

# Honor both OS reduced motion and the in-game Reduced Motion preference.
css_path = root / 'style400-cinematics.css'
css = css_path.read_text(encoding='utf-8')
marker = '/* Astra Pass 4 in-game reduced motion */'
if marker not in css:
    css += r'''

/* Astra Pass 4 in-game reduced motion */
html[data-motion="reduced"] .cinematic-stage *,
html[data-motion="reduced"] .cinematic-copy *{animation:none!important;transition:none!important}
'''
css_path.write_text(css, encoding='utf-8')

ui_path = root / 'style400-ui.css'
ui = ui_path.read_text(encoding='utf-8')
ui_marker = '/* Astra Pass 4 ending in-game reduced motion */'
if ui_marker not in ui:
    ui += r'''

/* Astra Pass 4 ending in-game reduced motion */
html[data-motion="reduced"] .ending-homecoming *{animation:none!important;transition:none!important}
html[data-motion="reduced"] .ending-parcel{translate:125px -20px;opacity:1}
html[data-motion="reduced"] .ending-porch-light{opacity:1;scale:1}
'''
ui_path.write_text(ui, encoding='utf-8')

# Follow-up invariants.
assert 'lineIndex=Math.max(0,Number(API.line)||0)' in src
assert 'dialogueGroups(beat),narration=narratorLines(beat)' not in src
assert new in index
assert marker in css
assert ui_marker in ui
print('Astra Pass 4 dialogue/presentation follow-up applied.')
