from pathlib import Path
import re


def write_changed(path, transform):
    p = Path(path)
    old = p.read_text()
    new = transform(old)
    if new == old:
        raise SystemExit(f'No change produced for {path}')
    p.write_text(new)


def patch_cinematic_dialogue(text):
    marker = "function accessibleDialogueHtml(groups){if(!groups.length)return'';return `<span class=\"cin-dialogue-a11y\">${groups.map(([name,texts])=>`${escapeHtml(name)}: ${texts.map(escapeHtml).join(' ')}`).join(' ')}</span>`}\n"
    if text.count(marker) != 1:
        raise SystemExit('cinematic-dialogue accessible marker mismatch')
    helper = r'''function openingDockHtml(index,groups){
 if(!groups.length)return '';
 const order=['Pippa','Bramble','Rowan','Pip','Tansy'];
 const castKey=index===1?`<div class="cin-opening-cast-key" aria-label="Little Home residents">${order.map(name=>{const c=CAST[name];return `<span class="cin-opening-cast-chip">${portrait(name,'opening-cast-portrait')}<span><b>${escapeHtml(name)}</b><small>${escapeHtml(c.role)}</small></span></span>`}).join('')}</div>`:'';
 const rows=groups.map(([name,texts])=>{const c=CAST[name];return `<div class="cin-opening-dialogue-row" data-speaker="${escapeHtml(name)}">${portrait(name,'opening-dialogue-portrait')}<div class="cin-opening-bubble"><div class="cin-opening-speaker"><b>${escapeHtml(name)}</b><small>${escapeHtml(c?.role||'Resident')}</small></div>${speechTextHtml(texts)}</div></div>`}).join('');
 return `<section class="cin-opening-dialogue-dock" data-beat="${index+1}" data-dialogue-count="${groups.length}" aria-label="Character dialogue">${castKey}<div class="cin-opening-dialogue-list">${rows}</div></section>`;
}
'''
    text = text.replace(marker, helper + marker, 1)
    pattern = re.compile(r"function postProcess\(\)\{\n.*?\n\}\nfunction schedule", re.S)
    match = pattern.search(text)
    if not match:
        raise SystemExit('cinematic-dialogue postProcess block not found')
    replacement = r'''function postProcess(){
 scheduled=false;if(processing)return;const id=API.active,index=API.beat,c=API.CINEMATICS[id],beat=c&&c.beats[index],overlay=document.getElementById('cinematicOverlay'),stage=document.getElementById('cinematicStage'),lines=document.getElementById('cinematicLines');
 if(!id||!beat||!overlay||!stage||!lines)return;if(overlay.dataset.cinematic!==id||overlay.dataset.visual!==beat.visual)return;
 processing=true;
 try{
  const groups=dialogueGroups(beat),narration=narratorLines(beat),copy=lines.closest('.cinematic-copy'),opening=id==='opening';
  if(opening){
   stage.querySelectorAll(':scope > .cin-dialogue-layer').forEach(node=>node.remove());
   let dock=copy?.querySelector(':scope > .cin-opening-dialogue-dock')||null;
   const beatKey=String(index+1);
   if(dock&&dock.dataset.beat!==beatKey){dock.remove();dock=null}
   if(groups.length&&copy&&!dock)lines.insertAdjacentHTML('afterend',openingDockHtml(index,groups));
   if(!groups.length&&dock)dock.remove();
  }else{
   copy?.querySelectorAll(':scope > .cin-opening-dialogue-dock').forEach(node=>node.remove());
   if(!stage.querySelector(':scope > .cin-dialogue-layer'))stage.insertAdjacentHTML('beforeend',dialogueLayerHtml(id,index,beat));
  }
  if(!lines.classList.contains('cinematic-narration-only'))lines.classList.add('cinematic-narration-only');
  lines.dataset.narratorCount=String(narration.length);
  const desired=narration.map(text=>`<p class="narrator-only"><span>${escapeHtml(text)}</span></p>`).join('')+(opening?'':accessibleDialogueHtml(groups));
  if(lines.innerHTML!==desired)lines.innerHTML=desired;
  lines.hidden=!narration.length&&(opening||!groups.length);
  overlay.dataset.dialogueCount=String(groups.length);
  overlay.dataset.narratorCount=String(narration.length);
  if(groups.length&&!opening)window.LatchlingsCinematicGeometry?.normalizeDialogue(stage);
 }finally{processing=false}
}
function schedule'''
    text = text[:match.start()] + replacement + text[match.end():]
    return text


def patch_cinematic_css(text):
    if 'Opening dialogue now lives below the scenic stage' in text:
        raise SystemExit('cinematic dialogue CSS already patched')
    return text + r'''

/* Opening dialogue now lives below the scenic stage, inside the scrollable copy area. */
.cinematic-overlay[data-cinematic="opening"] .cinematic-stage>.cin-dialogue-layer{display:none!important}
.cin-opening-dialogue-dock{position:relative;display:grid;gap:7px;margin:8px 0 10px;padding:8px;border-radius:16px;background:linear-gradient(180deg,rgba(255,252,244,.95),rgba(246,238,219,.94));border:1px solid rgba(176,142,99,.35);box-shadow:inset 0 1px rgba(255,255,255,.78),0 4px 10px rgba(39,59,75,.08);color:#294c69}
.cin-opening-dialogue-list{display:grid;gap:6px}
.cin-opening-dialogue-row{display:grid;grid-template-columns:42px minmax(0,1fr);gap:7px;align-items:end;min-width:0}
.cin-opening-dialogue-row .dialogue-portrait,.cin-opening-cast-chip .dialogue-portrait{position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;translate:none!important;margin:0 auto;box-shadow:0 4px 8px rgba(21,42,62,.2),0 0 0 2px rgba(255,250,236,.82)}
.cin-opening-dialogue-row .dialogue-portrait{width:38px!important;height:38px!important;flex:0 0 38px!important}.cin-opening-dialogue-row .dialogue-portrait.child{width:34px!important;height:34px!important;flex-basis:34px!important}
.cin-opening-bubble{position:relative;min-width:0;padding:7px 9px 8px;border-radius:13px;background:#fffaf0;border:1.5px solid rgba(125,91,55,.39);box-shadow:0 4px 9px rgba(28,51,70,.10),inset 0 1px rgba(255,255,255,.8);font-size:11px;line-height:1.3;color:#294c69;overflow:visible}
.cin-opening-bubble:before{content:"";position:absolute;left:-6px;bottom:8px;width:11px;height:11px;background:#fffaf0;border-left:1.5px solid rgba(125,91,55,.39);border-bottom:1.5px solid rgba(125,91,55,.39);transform:rotate(45deg);border-radius:0 0 0 2px}
.cin-opening-speaker{display:flex;align-items:baseline;gap:6px;margin-bottom:3px}.cin-opening-speaker b{font-size:8.5px;line-height:1.1;font-weight:950;letter-spacing:.05em;text-transform:uppercase;color:#173a67}.cin-opening-speaker small{font-size:7.5px;line-height:1.1;font-weight:850;color:#748495;text-transform:uppercase;letter-spacing:.04em}
.cin-opening-bubble>span{display:block}.cin-opening-bubble .speech-followup{margin-top:4px;padding-top:4px;border-top:1px solid rgba(118,91,61,.16)}
.cin-opening-cast-key{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:3px;padding-bottom:7px;border-bottom:1px solid rgba(118,91,61,.14)}
.cin-opening-cast-chip{min-width:0;display:flex;flex-direction:column;align-items:center;gap:2px;text-align:center}.cin-opening-cast-chip .dialogue-portrait{width:30px!important;height:30px!important;flex:0 0 30px!important}.cin-opening-cast-chip .dialogue-portrait.child{width:27px!important;height:27px!important;flex-basis:27px!important}.cin-opening-cast-chip>span{min-width:0;display:flex;flex-direction:column}.cin-opening-cast-chip b{font-size:7px;line-height:1.05;color:#173a67;text-transform:uppercase;letter-spacing:.035em}.cin-opening-cast-chip small{font-size:6.5px;line-height:1.05;color:#667b8d;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(max-width:430px){.cin-opening-dialogue-dock{margin:7px 0 9px;padding:7px}.cin-opening-dialogue-row{grid-template-columns:38px minmax(0,1fr);gap:6px}.cin-opening-dialogue-row .dialogue-portrait{width:34px!important;height:34px!important;flex-basis:34px!important}.cin-opening-dialogue-row .dialogue-portrait.child{width:31px!important;height:31px!important;flex-basis:31px!important}.cin-opening-bubble{font-size:10.5px;padding:6px 8px 7px}.cin-opening-cast-chip .dialogue-portrait{width:27px!important;height:27px!important;flex-basis:27px!important}.cin-opening-cast-chip .dialogue-portrait.child{width:24px!important;height:24px!important;flex-basis:24px!important}.cin-opening-cast-chip b{font-size:6.6px}.cin-opening-cast-chip small{font-size:6.1px}}
@media(max-height:720px){.cin-opening-dialogue-dock{gap:5px;margin:5px 0 7px;padding:6px}.cin-opening-dialogue-list{gap:5px}.cin-opening-dialogue-row{grid-template-columns:34px minmax(0,1fr);gap:5px}.cin-opening-dialogue-row .dialogue-portrait{width:30px!important;height:30px!important;flex-basis:30px!important}.cin-opening-dialogue-row .dialogue-portrait.child{width:27px!important;height:27px!important;flex-basis:27px!important}.cin-opening-bubble{font-size:9.8px;line-height:1.25;padding:5px 7px 6px}.cin-opening-cast-chip .dialogue-portrait{width:24px!important;height:24px!important;flex-basis:24px!important}.cin-opening-cast-chip .dialogue-portrait.child{width:22px!important;height:22px!important;flex-basis:22px!important}}
'''


def patch_rail_js(text):
    pattern = re.compile(r" note\.innerHTML=`<section class=\\?\"story-level-rail.*?`;\n\}", re.S)
    match = pattern.search(text)
    if not match:
        # Source contains ordinary quotes inside the template literal once read from disk.
        pattern = re.compile(r" note\.innerHTML=`<section class=\"story-level-rail.*?`;\n\}", re.S)
        match = pattern.search(text)
    if not match:
        raise SystemExit('story rail render tail not found')
    replacement = r''' note.innerHTML=`<section class="story-level-rail story-rail-ch${chapter} ${report?'story-report':''}" data-expanded="false"><div class="story-rail-person">${portrait(speaker)}<strong>${escapeHtml(speaker)}</strong></div><div class="story-rail-main"><div class="story-rail-meta"><span class="story-rail-title">${escapeHtml(meta.title)}</span>${report?'<span class="story-rail-report">Route report</span>':''}<span class="story-rail-count">${local} / 50</span></div><p><span class="story-rail-quote">${escapeHtml(base)}</span>${thread?`<small class="story-rail-thread">Question: ${escapeHtml(thread)}</small>`:''}</p><div class="story-rail-foot"><span class="story-rail-movement">${escapeHtml(movement)}</span><span class="story-rail-progress"><b></b>${segments}</span><button class="story-rail-toggle" type="button" aria-expanded="false">Read all</button></div><div class="story-rail-expanded-actions" hidden><button class="story-rail-full" type="button"><span aria-hidden="true">▣</span> Open full level story</button><small>Same story as the book button above.</small></div></div></section>`;
 const rail=note.querySelector('.story-level-rail'),toggle=note.querySelector('.story-rail-toggle'),actions=note.querySelector('.story-rail-expanded-actions'),full=note.querySelector('.story-rail-full');
 const setExpanded=expanded=>{rail?.classList.toggle('is-expanded',expanded);note.classList.toggle('is-expanded',expanded);if(rail)rail.dataset.expanded=expanded?'true':'false';if(toggle){toggle.setAttribute('aria-expanded',String(expanded));toggle.textContent=expanded?'Collapse':'Read all'}if(actions)actions.hidden=!expanded;note.setAttribute('aria-expanded',String(expanded))};
 toggle?.addEventListener('click',()=>setExpanded(toggle.getAttribute('aria-expanded')!=='true'));
 full?.addEventListener('click',()=>document.getElementById('storyCardBtn')?.click());
 note.setAttribute('aria-label',`${speaker}: ${base}${thread?` Question: ${thread}`:''}. Chapter progress ${local} of 50. Use Read all to expand this beat or Story for the full level lore.`);
}
'''
    return text[:match.start()] + replacement + text[match.end():]


def patch_rail_css(text):
    if 'Expandable story rail' in text:
        raise SystemExit('story rail CSS already patched')
    return text + r'''

/* Expandable story rail: compact by default, complete on demand, explicitly linked to the full Story card. */
.story-rail-foot{grid-template-columns:minmax(0,auto) minmax(50px,1fr) auto!important}
.story-rail-movement{max-width:118px;overflow:hidden;text-overflow:ellipsis}
.story-rail-toggle{min-width:47px;height:20px;padding:0 6px;border:1px solid color-mix(in srgb,var(--railAccent) 38%,rgba(42,62,78,.2));border-radius:999px;background:rgba(255,250,238,.86);color:var(--railInk);font:inherit;font-size:7.5px;font-weight:950;letter-spacing:.025em;white-space:nowrap;cursor:pointer;box-shadow:0 2px 4px rgba(28,44,58,.08)}
.story-rail-toggle:focus-visible,.story-rail-full:focus-visible{outline:2px solid color-mix(in srgb,var(--railAccent2) 78%,#173a67);outline-offset:2px}
.story-rail-expanded-actions{display:flex;align-items:center;gap:7px;margin-top:5px;padding-top:6px;border-top:1px solid color-mix(in srgb,var(--railAccent) 22%,transparent)}.story-rail-expanded-actions[hidden]{display:none!important}.story-rail-expanded-actions small{font-size:7.5px;line-height:1.15;color:color-mix(in srgb,var(--railInk) 68%,#7f8c94)}
.story-rail-full{flex:0 0 auto;border:1px solid color-mix(in srgb,var(--railAccent) 42%,#7a6651);border-radius:10px;background:linear-gradient(180deg,color-mix(in srgb,var(--railAccent) 14%,#fffaf0),rgba(255,249,236,.88));color:var(--railInk);padding:5px 8px;font-size:8px;font-weight:950;cursor:pointer;box-shadow:0 2px 5px rgba(30,47,61,.08)}.story-rail-full span{font-size:8px;margin-right:3px}
#game .mechanic-note.story-level-rail-host.is-expanded{height:auto;min-height:94px;overflow:visible;position:relative;z-index:8}
.story-level-rail.is-expanded{height:auto;min-height:94px;align-items:start;overflow:visible;padding-bottom:9px}
.story-level-rail.is-expanded .story-rail-person{height:auto;min-height:78px;padding-top:3px}
.story-level-rail.is-expanded .story-rail-main{height:auto;min-height:78px;grid-template-rows:auto auto auto auto;align-items:start;gap:4px}
.story-level-rail.is-expanded .story-rail-main p{display:block;overflow:visible;-webkit-line-clamp:unset;line-clamp:unset;max-height:none;font-size:10.5px;line-height:1.28;padding:2px 0}
.story-level-rail.is-expanded .story-rail-thread{display:block;margin-top:4px;padding-top:4px;border-top:1px solid color-mix(in srgb,var(--railAccent) 20%,transparent);font-size:9.3px;line-height:1.25}
.story-card-trigger{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:0!important;padding:3px 2px!important}
.story-card-trigger svg{width:19px!important;height:19px!important}.story-card-trigger:after{content:"Story";display:block;margin-top:1px;color:#49657a;font-size:6.7px;line-height:1;font-weight:950;letter-spacing:.03em;text-transform:uppercase}
@media(max-width:430px){.story-rail-movement{max-width:94px}.story-rail-toggle{min-width:43px;padding:0 5px;font-size:7.1px}.story-rail-expanded-actions{align-items:flex-start;flex-direction:column;gap:4px}.story-rail-full{font-size:7.7px}}
'''


def patch_index(text):
    swaps = {
        'style400-story-rail-board.css?v=20260911-narrative1': 'style400-story-rail-board.css?v=20260911-storypresentation1',
        'style400-cinematics-dialogue.css': 'style400-cinematics-dialogue.css?v=20260911-storypresentation1',
        'cinematic-dialogue400.js?v=20260911-narrative1': 'cinematic-dialogue400.js?v=20260911-storypresentation1',
        'gameplay-story-rail400.js?v=20260911-narrative1': 'gameplay-story-rail400.js?v=20260911-storypresentation1',
    }
    for old, new in swaps.items():
        if text.count(old) != 1:
            raise SystemExit(f'index cache marker mismatch: {old}')
        text = text.replace(old, new, 1)
    return text

write_changed('cinematic-dialogue400.js', patch_cinematic_dialogue)
write_changed('style400-cinematics-dialogue.css', patch_cinematic_css)
write_changed('gameplay-story-rail400.js', patch_rail_js)
write_changed('style400-story-rail-board.css', patch_rail_css)
write_changed('index.html', patch_index)
print('STORY_PRESENTATION_PATCH_APPLIED')
