from pathlib import Path

root=Path('.')

# --- Gameplay rendering semantics and state feedback.
a_path=root/'game400-a.js'
a=a_path.read_text(encoding='utf-8')
old_globals="let currentLevel=1,chapterView=1,rangeView=0,selected=0,movesUsed=0,doorMask=0,positions=[],animating=false,hintStep=0;"
new_globals=old_globals+"\nlet lastNestArrival=null,blockerFeedbackTimer=null;"
assert old_globals in a, 'game globals anchor changed'
a=a.replace(old_globals,new_globals,1)

old_start="chapterView=Math.ceil(currentLevel/50);rangeView=Math.floor(((currentLevel-1)%50)/10);applyTheme(chapterView);positions=lev.pieces.map(p=>p.pos.slice());doorMask=0;movesUsed=0;selected=0;hintStep=0;animating=false;"
new_start=old_start[:-1]+";lastNestArrival=null;"
assert old_start in a, 'startLevel reset anchor changed'
a=a.replace(old_start,new_start,1)

old_note="const note=document.getElementById('mechanicNote');note.className='mechanic-note mechanic-chip';note.innerHTML=`<span class=\"mechanic-chip-label\">Route tip</span><span class=\"mechanic-chip-copy\">${chapterNote(currentLevel)}</span>`;"
new_note="const note=document.getElementById('mechanicNote');note.className='mechanic-note mechanic-chip';note.dataset.feedback='tip';note.setAttribute('role','status');note.setAttribute('aria-live','polite');note.innerHTML=`<span class=\"mechanic-chip-label\">Route tip</span><span class=\"mechanic-chip-copy\">${chapterNote(currentLevel)}</span><span class=\"mastery-guide\" id=\"masteryGuide\" aria-label=\"Star criteria\">3★ ≤ ${lev.optimal} · 2★ ≤ ${lev.optimal+1} · 1★ finish</span>`;"
assert old_note in a, 'mechanic note anchor changed'
a=a.replace(old_note,new_note,1)

start=a.index('function decorateCell(')
end=a.index('function dirSvg(',start)
new_decor=r'''function mechanicLinkLabel(id){const n=Number(id)||0;return String.fromCharCode(65+(n%26))}
function decorateCell(cell,lev,r,c){
 const rock=findAt(lev.rocks,r,c);if(rock){cell.innerHTML='<div class="rock" role="img" aria-label="Rock stopper"></div>';return}
 const nestI=lev.nests.findIndex(n=>n[0]===r&&n[1]===c);if(nestI>=0){const p=lev.pieces[nestI],resolved=!positions[nestI],arrived=resolved&&lastNestArrival===nestI;cell.dataset.nestState=resolved?'resolved':'open';cell.innerHTML=`<div class="nest ${resolved?'resolved':''} ${arrived?'just-arrived':''}" data-pi="${nestI}" role="img" aria-label="${p.color} ${p.suit} nest, ${resolved?'resolved':'waiting'}" style="--piece-color:${COLORS[p.color]}">${suitSvg(p.suit)}${resolved?'<span class="nest-resolution" aria-hidden="true">✓</span>':''}</div>`;return}
 if(findAt(lev.anchors,r,c))cell.innerHTML+='<div class="anchor" role="img" aria-label="Anchor stopper">'+icon('anchor')+'</div>';
 const sg=findAt(lev.suitGates,r,c);if(sg)cell.innerHTML+=`<div class="gate suit" role="img" aria-label="Suit gate: ${sg[2]} only">${suitSvg(sg[2])}</div>`;
 const cg=findAt(lev.colorGates,r,c);if(cg)cell.innerHTML+=`<div class="gate color" role="img" aria-label="Color gate: ${cg[2]} only" style="--gate-color:${gateColor(cg[2])}"><span style="width:42%;height:42%;border-radius:50%;background:${gateColor(cg[2])};box-shadow:inset 0 0 0 4px rgba(255,255,255,.55)"></span></div>`;
 const rail=findAt(lev.rails,r,c);if(rail)cell.innerHTML+=`<div class="rail" role="img" aria-label="Rail: ${rail[2]} entry only">${dirSvg(rail[2])}</div>`;
 const turn=findAt(lev.turners,r,c);if(turn)cell.innerHTML+=`<div class="turner" role="img" aria-label="Turner: ${turn[2]==='CW'?'clockwise':'counter-clockwise'}">${turnSvg(turn[2])}</div>`;
 const sw=findAt(lev.switches,r,c);if(sw){const label=mechanicLinkLabel(sw[2]);cell.innerHTML+=`<div class="switch-tile" data-link="${sw[2]}" role="img" aria-label="Switch ${label}, toggles door ${label}"><span class="mechanic-link-badge" aria-hidden="true">${label}</span></div>`}
 const dr=findAt(lev.doors,r,c);if(dr){const label=mechanicLinkLabel(dr[2]),open=!!(doorMask&(1<<dr[2]));cell.innerHTML+=`<div class="door-tile ${open?'open':''}" data-link="${dr[2]}" role="img" aria-label="Door ${label}, ${open?'open':'closed'}"><span class="mechanic-link-badge" aria-hidden="true">${label}</span><span class="door-state-label" aria-hidden="true">${open?'OPEN':'CLOSED'}</span><div class="door-bars"></div></div>`}
}
'''
a=a[:start]+new_decor+a[end:]

old_render_end="decorateCell(cell,lev,r,c)}}renderPieces(lev)\n}"
new_render_end="decorateCell(cell,lev,r,c)}}renderPieces(lev);if(lastNestArrival!==null){const arrivedPi=lastNestArrival;setTimeout(()=>{const n=document.querySelector(`#board .nest[data-pi=\"${arrivedPi}\"]`);if(n)n.classList.remove('just-arrived');if(lastNestArrival===arrivedPi)lastNestArrival=null},effectiveReducedMotion()?0:850)}\n}"
assert old_render_end in a, 'renderGame end anchor changed'
a=a.replace(old_render_end,new_render_end,1)
a_path.write_text(a,encoding='utf-8')

# --- Rejected-move cause feedback and resolved destination acknowledgement.
b_path=root/'game400-b.js'
b=b_path.read_text(encoding='utf-8')
insert_at=b.index('function simulate(')
helpers=r'''function immediateBlocker(pi,d){
 const lev=LEVELS[currentLevel-1],pos=positions[pi];if(!lev||!pos)return null;const piece=lev.pieces[pi],[dr,dc]=DIRV[d],r=pos[0]+dr,c=pos[1]+dc;if(r<0||c<0||r>=lev.size||c>=lev.size)return {type:'edge',r,c};
 if(findAt(lev.rocks,r,c))return {type:'rock',r,c};
 if(positions.some((p,i)=>i!==pi&&p&&p[0]===r&&p[1]===c))return {type:'piece',r,c};
 const door=findAt(lev.doors,r,c);if(door&&!(doorMask&(1<<door[2])))return {type:'door',r,c,link:door[2]};
 const sg=findAt(lev.suitGates,r,c);if(sg&&sg[2]!==piece.suit)return {type:'suitGate',r,c,needs:sg[2]};
 const cg=findAt(lev.colorGates,r,c);if(cg&&cg[2]!==piece.color)return {type:'colorGate',r,c,needs:cg[2]};
 const rail=findAt(lev.rails,r,c);if(rail&&rail[2]!==d)return {type:'rail',r,c,needs:rail[2]};
 return null;
}
function blockerCopy(blocker){if(!blocker)return 'That route cannot start from here.';if(blocker.type==='door')return `Door ${mechanicLinkLabel(blocker.link)} is closed. Find switch ${mechanicLinkLabel(blocker.link)} to open it.`;if(blocker.type==='suitGate')return `That suit gate only accepts the ${blocker.needs} mark.`;if(blocker.type==='colorGate')return `That color gate only accepts a ${blocker.needs} Latchling.`;if(blocker.type==='rail')return `That rail only accepts entry in its ${blocker.needs} direction.`;if(blocker.type==='piece')return 'Another Latchling is the stopper in that direction.';if(blocker.type==='rock')return 'A rock is stopping that route.';if(blocker.type==='edge')return 'The island edge is stopping that route.';return 'That route cannot start from here.'}
function restoreMechanicNote(){const note=document.getElementById('mechanicNote'),lev=LEVELS[currentLevel-1];if(!note||!lev)return;note.className='mechanic-note mechanic-chip';note.dataset.feedback='tip';note.innerHTML=`<span class="mechanic-chip-label">Route tip</span><span class="mechanic-chip-copy">${chapterNote(currentLevel)}</span><span class="mastery-guide" id="masteryGuide" aria-label="Star criteria">3★ ≤ ${lev.optimal} · 2★ ≤ ${lev.optimal+1} · 1★ finish</span>`}
function clearBlockerFeedback(restore=true){if(blockerFeedbackTimer){clearTimeout(blockerFeedbackTimer);blockerFeedbackTimer=null}document.querySelectorAll('#board .cell.blocked-cause').forEach(c=>{c.classList.remove('blocked-cause');delete c.dataset.blockerFeedback});if(restore)restoreMechanicNote()}
function showBlockedFeedback(blocker){clearBlockerFeedback(false);const note=document.getElementById('mechanicNote');if(note){note.className='mechanic-note mechanic-chip blocked-feedback';note.dataset.feedback='blocked';note.innerHTML=`<span class="mechanic-chip-label">Blocked</span><span class="mechanic-chip-copy">${blockerCopy(blocker)}</span>`}if(blocker&&blocker.r>=0&&blocker.c>=0){const cell=document.querySelector(`#board .cell[data-r="${blocker.r}"][data-c="${blocker.c}"]`);if(cell){cell.classList.add('blocked-cause');cell.dataset.blockerFeedback=blocker.type}}blockerFeedbackTimer=setTimeout(()=>{blockerFeedbackTimer=null;clearBlockerFeedback(true)},1800)}
'''
b=b[:insert_at]+helpers+b[insert_at:]
old_move="async function moveSelected(d){if(animating)return;clearHintFocus();const lev=LEVELS[currentLevel-1];if(!positions[selected]){const order=clockwiseAvailable();if(!order.length)return;selected=order[0]}const res=simulate(selected,d);if(!res){if(window.LatchlingsSFX)window.LatchlingsSFX.invalidMove();shakeSelected();return}animating=true;const pi=selected,from=positions[pi].slice(),el=document.querySelector(`.latchling[data-pi=\"${pi}\"]`);movesUsed++;doorMask=res.mask;if(window.LatchlingsSFX){window.LatchlingsSFX.startMove(res.path.length);window.LatchlingsSFX.scheduleRouteEvents(res.events,res.path.length)}await animateMove(el,from,res,lev.size);positions[pi]=res.capture?null:[res.r,res.c];if(res.capture){const next=nearestLatchling([res.r,res.c]);if(next>=0)selected=next}renderGame(true);animating=false;if(positions.every(p=>!p)){winLevel();return}if(movesUsed>=lev.moveLimit)loseLevel()}"
new_move="async function moveSelected(d){if(animating)return;clearBlockerFeedback(true);clearHintFocus();const lev=LEVELS[currentLevel-1];if(!positions[selected]){const order=clockwiseAvailable();if(!order.length)return;selected=order[0]}const res=simulate(selected,d);if(!res){if(window.LatchlingsSFX)window.LatchlingsSFX.invalidMove();showBlockedFeedback(immediateBlocker(selected,d));shakeSelected();return}animating=true;const pi=selected,from=positions[pi].slice(),el=document.querySelector(`.latchling[data-pi=\"${pi}\"]`);movesUsed++;doorMask=res.mask;if(window.LatchlingsSFX){window.LatchlingsSFX.startMove(res.path.length);window.LatchlingsSFX.scheduleRouteEvents(res.events,res.path.length)}await animateMove(el,from,res,lev.size);positions[pi]=res.capture?null:[res.r,res.c];lastNestArrival=res.capture?pi:null;if(res.capture){const next=nearestLatchling([res.r,res.c]);if(next>=0)selected=next}renderGame(true);animating=false;if(positions.every(p=>!p)){winLevel();return}if(movesUsed>=lev.moveLimit)loseLevel()}"
assert old_move in b, 'moveSelected anchor changed'
b=b.replace(old_move,new_move,1)
b_path.write_text(b,encoding='utf-8')

# --- Story card: one visual postcard, one character line, one goal, optional context.
i_path=root/'index.html'
i=i_path.read_text(encoding='utf-8')
i=i.replace('<div class="story-card-scene" id="storyCardScene" aria-hidden="true"></div>','<div class="story-card-scene" id="storyCardScene" role="img" aria-label=""></div>',1)
old_story='''      <div class="story-card-meta"><span class="story-card-kind" id="storyCardKind"></span><span class="story-card-location" id="storyCardLocation"></span></div>
      <div class="story-card-characters" id="storyCardCharacters" hidden></div>
      <h2 id="storyCardTitle"></h2>
      <p class="story-card-context" id="storyCardContext"></p>
      <p class="story-card-flavor" id="storyCardFlavor"></p>
      <div class="story-card-objective" id="storyCardObjective" hidden></div>'''
new_story='''      <div class="story-card-meta"><span class="story-card-kind" id="storyCardKind"></span><span class="story-card-location" id="storyCardLocation"></span></div>
      <div class="story-card-characters" id="storyCardCharacters" hidden></div>
      <h2 id="storyCardTitle"></h2>
      <div class="story-card-line" id="storyCardLine"></div>
      <div class="story-card-goal" id="storyCardGoal"></div>
      <details class="story-card-more" id="storyCardMore"><summary>More context</summary><p id="storyCardMoreCopy"></p></details>'''
assert old_story in i, 'story card markup anchor changed'
i=i.replace(old_story,new_story,1)
cache_repls={
 'style400-game.css?v=20260913-audit-r1r5-1':'style400-game.css?v=20260914-gameplay-story-candidate1',
 'style400-story-theme.css?v=20260914-atlas-journal-candidate1':'style400-story-theme.css?v=20260914-gameplay-story-candidate1',
 'game400-a.js?v=20260914-atlas-journal-candidate1':'game400-a.js?v=20260914-gameplay-story-candidate1',
 'game400-b.js?v=20260914-atlas-journal-candidate1':'game400-b.js?v=20260914-gameplay-story-candidate1',
 'story-theme400.js?v=20260911-narrative1':'story-theme400.js?v=20260914-gameplay-story-candidate1',
 'pass3-chapter8-aurora.js?v=20260913-ch8pass3-1':'pass3-chapter8-aurora.js?v=20260914-gameplay-story-candidate1'
}
for old,new in cache_repls.items():
    assert old in i,f'index cache anchor missing {old}'
    i=i.replace(old,new,1)
i_path.write_text(i,encoding='utf-8')

story_js=root/'story-theme400.js'
s=story_js.read_text(encoding='utf-8')
old_vars="const title=automatic&&movement?movement.title:meta.title,context=automatic&&movement?movement.setup:meta.context,flavor=automatic?`Today’s route: ${meta.context}`:(movement?`Part of ${movement.title}. ${meta.flavor}`:meta.flavor);"
new_vars="const title=automatic&&movement?movement.title:meta.title,line=meta.context,goal=movement?movement.question:meta.flavor,more=[automatic&&movement?movement.setup:null,movement?.stakes,manual?meta.flavor:null].filter(Boolean).join(' '),lineResident=(STORY.cast||[]).find(c=>line.includes(c.name))||featured[0]||null;"
assert old_vars in s, 'story card variables anchor changed'
s=s.replace(old_vars,new_vars,1)
old_assign="document.getElementById('storyCardKind').textContent=kindFor(meta);document.getElementById('storyCardLocation').textContent=`Chapter ${meta.chapter} · ${meta.location}`;document.getElementById('storyCardTitle').textContent=title;document.getElementById('storyCardContext').textContent=context;document.getElementById('storyCardFlavor').textContent=flavor;document.getElementById('storyCardScene').innerHTML=vignette(meta,featured);\n const objective=document.getElementById('storyCardObjective');if(objective){objective.hidden=!movement;objective.innerHTML=movement?`<strong>Current question</strong><span>${escapeHtml(movement.question)}</span><small>${escapeHtml(movement.stakes)}</small>`:''}\n const characters=document.getElementById('storyCardCharacters');if(characters){characters.innerHTML=featured.map(characterChip).join('');characters.hidden=!featured.length;characters.classList.toggle('is-pair',featured.length>1)}"
new_assign="document.getElementById('storyCardKind').textContent=kindFor(meta);document.getElementById('storyCardLocation').textContent=`Chapter ${meta.chapter} · ${meta.location}`;document.getElementById('storyCardTitle').textContent=title;const scene=document.getElementById('storyCardScene');scene.innerHTML=vignette(meta,featured);scene.dataset.primaryProp=decorFor(meta)[0]||'';scene.setAttribute('aria-label',`${meta.location}: ${title}`);const lineEl=document.getElementById('storyCardLine');if(lineEl)lineEl.innerHTML=`${lineResident?characterAvatar(lineResident):''}<span><strong>${escapeHtml(lineResident?.name||'Route note')}</strong><em>${escapeHtml(line)}</em></span>`;const goalEl=document.getElementById('storyCardGoal');if(goalEl)goalEl.innerHTML=`<strong>Goal</strong><span>${escapeHtml(goal)}</span>`;const moreEl=document.getElementById('storyCardMore'),moreCopy=document.getElementById('storyCardMoreCopy');if(moreEl){moreEl.hidden=!more;moreEl.open=false}if(moreCopy)moreCopy.textContent=more;\n const characters=document.getElementById('storyCardCharacters');if(characters){characters.innerHTML='';characters.hidden=true;characters.classList.remove('is-pair')}"
assert old_assign in s, 'story card assignment anchor changed'
s=s.replace(old_assign,new_assign,1)
story_js.write_text(s,encoding='utf-8')

# --- Existing presentation files receive the visual semantics; no new permanent override layer.
css_path=root/'style400-story-theme.css'
css=css_path.read_text(encoding='utf-8')
css += r'''

/* Astra gameplay/story coherence: keep scenery out of rule space and make state causality explicit. */
#game .board{z-index:2}
#game .level-props{z-index:1}
#game .mechanic-note.mechanic-chip{flex-wrap:wrap}
.mastery-guide{flex:0 0 auto;margin-left:auto;padding:3px 7px;border-radius:999px;background:rgba(255,255,255,.66);border:1px solid rgba(48,83,103,.16);color:#405d72;font-size:9.5px;font-weight:950;letter-spacing:.01em;white-space:nowrap}
#game .mechanic-note[data-feedback="blocked"]{box-shadow:0 3px 9px rgba(40,61,79,.09),inset 3px 0 0 #d66f54;background:rgba(255,243,231,.96)}
#game .mechanic-note[data-feedback="blocked"] .mechanic-chip-label{background:#f5d3c5;color:#7b3f32}
#game .cell.blocked-cause{outline:4px solid rgba(222,105,75,.94)!important;outline-offset:-4px;z-index:4}
.mechanic-link-badge{position:absolute;right:-6px;top:-7px;z-index:6;min-width:19px;height:19px;padding:0 4px;border-radius:999px;display:grid;place-items:center;background:#fff6d2;color:#173a67;border:2px solid #294f70;box-shadow:0 2px 5px rgba(14,37,54,.22);font-size:9px;font-weight:1000;line-height:1}
.door-state-label{position:absolute;left:50%;bottom:-9px;translate:-50% 0;z-index:6;padding:2px 4px;border-radius:6px;background:#24384b;color:#fff7dd;border:1px solid rgba(255,255,255,.48);font-size:6.5px;font-weight:1000;letter-spacing:.08em;line-height:1}
.door-tile.open .door-state-label{background:#2f735f;color:#effff8}.door-tile.open .door-bars{opacity:.32;transform:scaleX(1.08)}
.nest.resolved{opacity:.72;filter:saturate(.45) brightness(1.08)}
.nest-resolution{position:absolute;inset:auto -5px -5px auto;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:#2f7c65;color:#fff;border:2px solid #fff;box-shadow:0 2px 7px rgba(18,52,44,.25);font-size:12px;font-weight:1000}
.nest.just-arrived{animation:nestArrivalAck .7s cubic-bezier(.2,.8,.2,1) both}
@keyframes nestArrivalAck{0%{scale:.82;filter:brightness(1.45) saturate(1.3)}48%{scale:1.12;filter:brightness(1.18)}100%{scale:1;filter:saturate(.45) brightness(1.08)}}

/* Regular Story cards behave like concise illustrated postcards. */
.story-card-line{display:flex;align-items:center;gap:9px;margin:9px 0 8px;padding:9px 10px;border-radius:15px;background:rgba(255,255,255,.54);border:1px solid color-mix(in srgb,var(--storyAccent) 24%,#d4bd98)}
.story-card-line>.story-character-avatar{flex:0 0 38px;width:38px;height:38px}.story-card-line>span{min-width:0;display:grid;gap:2px;text-align:left}.story-card-line strong{font-size:10px;color:#173a67}.story-card-line em{font-family:Georgia,"Times New Roman",serif;font-size:13px;line-height:1.27;color:#38566e;font-style:normal;font-weight:700}
.story-card-goal{display:grid;grid-template-columns:auto 1fr;gap:7px;align-items:start;padding:8px 10px;border-radius:13px;background:color-mix(in srgb,var(--storyAccent) 12%,rgba(255,249,235,.86));text-align:left}.story-card-goal strong{font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:color-mix(in srgb,var(--storyAccent) 70%,#29465f)}.story-card-goal span{font-size:11px;line-height:1.28;color:#405f74;font-weight:780}
.story-card-more{margin:7px 0 2px;text-align:left}.story-card-more summary{cursor:pointer;min-height:32px;display:flex;align-items:center;font-size:9px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:#61778a}.story-card-more p{margin:1px 0 0!important;padding:7px 9px;border-radius:10px;background:rgba(255,255,255,.36);font-size:10.5px!important;line-height:1.32!important;color:#526b7c!important}.story-card-more[hidden]{display:none}
.story-card-scene .story-scene-prop.scene-p1{filter:drop-shadow(0 7px 8px rgba(22,38,50,.24)) saturate(1.08);scale:1.08}
html[data-text-size="large"] .story-card-line em{font-size:15px}html[data-text-size="large"] .story-card-goal span,html[data-text-size="large"] .story-card-more p{font-size:13px!important}
@media(max-width:350px){.mastery-guide{flex-basis:100%;margin-left:0;text-align:center}.story-card-line em{font-size:12px}}
@media(prefers-reduced-motion:reduce){.nest.just-arrived{animation:none!important}}
'''
css_path.write_text(css,encoding='utf-8')

# --- Trim late thesis repetition before the accepted ending.
ch8_path=root/'pass3-chapter8-aurora.js'
ch8=ch8_path.read_text(encoding='utf-8')
old_reward="Aurora Crown is connected, but it is not a master switch and this is not a final map. Old routes and brand-new routes now belong to the same living Skyway, tended by communities that keep watching the drift, sharing what changes, and making tomorrow's route fit tomorrow."
new_reward="Aurora Crown joins old and new routes in the same living Skyway. Communities keep watching the drift, sharing changes, and tending tomorrow’s route together."
assert old_reward in ch8, 'Aurora reward copy anchor changed'
ch8=ch8.replace(old_reward,new_reward,1)
ch8_path.write_text(ch8,encoding='utf-8')

exec(Path('.github/tmp/astra_gameplay_story_short_phone_fix.py').read_text(encoding='utf-8'), {'__name__':'__main__'})
print('Astra gameplay + story coherence candidate patch applied.')
