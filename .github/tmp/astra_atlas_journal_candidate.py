from pathlib import Path
import re

root=Path('.')

# --- Atlas behavior: simplify navigation, add explicit state semantics, and show a working arrival.
a_path=root/'game400-a.js'
a=a_path.read_text(encoding='utf-8')

old_reveal="function atlasRevealDestination(r){const map=document.getElementById('levelGrid'),node=map&&map.querySelector(`.atlas-node[data-level=\"${r.to}\"]`);if(!node)return;node.disabled=false;node.classList.remove('locked','reward-destination');node.classList.add('current','new-current','cloud-clearing');node.setAttribute('aria-label',`Level ${r.to}, current destination`);const route=map.querySelector(`.atlas-route[data-target=\"${r.to}\"]`);if(route)route.classList.add('reward-restoring')}"
new_reveal="function atlasRevealDestination(r){const map=document.getElementById('levelGrid'),node=map&&map.querySelector(`.atlas-node[data-level=\"${r.to}\"]`);if(!node)return;node.disabled=false;node.dataset.state='current';node.classList.remove('locked','state-locked','reward-destination');node.classList.add('current','state-current','new-current','cloud-clearing','reward-working');const badge=node.querySelector('.atlas-state-badge');if(badge)badge.textContent='◆';node.setAttribute('aria-label',`Level ${r.to}, current destination`);const route=map.querySelector(`.atlas-route[data-target=\"${r.to}\"]`);if(route)route.classList.add('reward-restoring')}"
assert old_reveal in a, 'atlasRevealDestination anchor changed'
a=a.replace(old_reveal,new_reveal)

nav_pattern=r" const nav=document\.getElementById\('chapterNav'\);nav\.innerHTML=.*?\n nav\.querySelectorAll\('\[data-step\]'\)\.forEach\(b=>b\.onclick=.*?\);\n"
nav_repl=""" const nav=document.getElementById('chapterNav');nav.innerHTML=`<button class=\"atlas-chapter-arrow\" data-step=\"-1\" aria-label=\"Previous chapter\" ${chapterView===1?'disabled':''}>‹</button><div class=\"atlas-chapter-current\"><span>Chapter ${chapterView} of 8</span><b>${ch.theme}</b></div><button class=\"atlas-chapter-arrow\" data-step=\"1\" aria-label=\"Next chapter\" ${chapterView===8?'disabled':''}>›</button>`;
 nav.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{chapterView=Math.max(1,Math.min(8,chapterView+(+b.dataset.step)));const local=progress.unlocked-(chapterView-1)*50;rangeView=local>0?Math.min(4,Math.floor((local-1)/10)):0;renderChapter()});
"""
a,count=re.subn(nav_pattern,nav_repl,a,count=1,flags=re.S)
assert count==1,'chapter nav replacement failed'

range_pattern=r" const range=document\.getElementById\('rangeNav'\);range\.innerHTML=.*?;range\.querySelectorAll\('\[data-range\]'\)\.forEach\(b=>b\.onclick=.*?\);\n"
range_repl=""" const range=document.getElementById('rangeNav'),rangeStart=chapterStart+rangeView*10,rangeEnd=rangeStart+9;range.innerHTML=`<button class=\"atlas-range-arrow\" data-range-step=\"-1\" aria-label=\"Previous route stretch\" ${rangeView===0?'disabled':''}>‹</button><div class=\"atlas-range-current\" aria-live=\"polite\"><span>${waypoints[rangeView]}</span><b>Levels ${rangeStart}–${rangeEnd}</b><small>Stretch ${rangeView+1} of 5</small></div><button class=\"atlas-range-arrow\" data-range-step=\"1\" aria-label=\"Next route stretch\" ${rangeView===4?'disabled':''}>›</button>`;range.querySelectorAll('[data-range-step]').forEach(b=>b.onclick=()=>{rangeView=Math.max(0,Math.min(4,rangeView+(+b.dataset.rangeStep)));renderChapter()});
"""
a,count=re.subn(range_pattern,range_repl,a,count=1,flags=re.S)
assert count==1,'range nav replacement failed'

nodes_pattern=r" const nodes=Array\.from\(\{length:10\},\(_,j\)=>\{.*?\}\)\.join\(''\);\n"
nodes_repl=""" const nodes=Array.from({length:10},(_,j)=>{const L=first+j,stars=progress.stars[L]||0,hiddenArrival=!!((sameRewardView||rewardDestView)&&reward&&L===reward.to),rewardSource=!!(rewardSourceView&&reward&&L===reward.from),locked=hiddenArrival||L>visualUnlocked,done=stars>0,current=rewardSource||(!hiddenArrival&&L===visualUnlocked),milestone=j===9,p=points[j],variant=(rangeView+j)%5,state=locked?'locked':current?'current':done?'restored':'available',badge=state==='restored'?'✓':state==='current'?'◆':state==='available'?'○':'',pennant=current?`<span class=\"atlas-pennant\">${rewardSource?'Route restored':done?'Latest stop':'Next stop'}</span>`:'';return `<button class=\"level-node atlas-node state-${state} ${locked?'locked':''} ${done?'done':''} ${current?'current':''} ${milestone?'milestone':''} ${rewardSource?'reward-source':''} ${hiddenArrival?'reward-destination':''}\" style=\"--x:${p[0]}%;--y:${p[1]}%;--float-time:${(4.1+(j%4)*.43).toFixed(2)}s;--float-delay:-${(j*.37).toFixed(2)}s\" data-level=\"${L}\" data-state=\"${state}\" data-variant=\"${variant}\" aria-label=\"Level ${L}, ${state}${done?`, ${stars} star${stars===1?'':'s'}`:''}\" ${locked?'disabled':''}><span class=\"atlas-island\" aria-hidden=\"true\"><span class=\"atlas-island-side\"></span><span class=\"atlas-island-top\"></span><span class=\"atlas-prop\" data-variant=\"${variant}\"><i></i><b></b></span></span><span class=\"atlas-level-number\">${L}</span><span class=\"atlas-state-badge\" aria-hidden=\"true\">${badge}</span><span class=\"atlas-stars\" aria-hidden=\"true\">${[1,2,3].map(n=>`<i class=\"${n<=stars?'on':''}\"></i>`).join('')}</span><span class=\"atlas-cloud-cover\" aria-hidden=\"true\"></span>${pennant}</button>`}).join('');
"""
a,count=re.subn(nodes_pattern,nodes_repl,a,count=1,flags=re.S)
assert count==1,'atlas node replacement failed'

old_map="map.innerHTML=`<div class=\"atlas-scene\" aria-hidden=\"true\"><i></i><b></b><em></em></div><div class=\"atlas-route-caption\"><b>${waypoints[rangeView]}</b><span>Levels ${first}–${first+9} · Skyway stretch ${rangeView+1} of 5</span></div><svg class=\"atlas-route-svg\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\">${route}</svg>${nodes}`;"
new_map="map.innerHTML=`<div class=\"atlas-scene\" aria-hidden=\"true\"><i></i><b></b><em></em></div><svg class=\"atlas-route-svg\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\">${route}</svg>${nodes}`;"
assert old_map in a,'atlas map markup anchor changed'
a=a.replace(old_map,new_map)

old_reduced="const reduced=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches),same=r.sourceChapter===r.destChapter&&r.sourceRange===r.destRange;"
new_reduced="const reduced=effectiveReducedMotion(),same=r.sourceChapter===r.destChapter&&r.sourceRange===r.destRange;"
assert old_reduced in a,'Atlas reduced-motion anchor changed'
a=a.replace(old_reduced,new_reduced)
a_path.write_text(a,encoding='utf-8')

# --- Journal behavior: one concise Now view plus separate accessible sections.
b_path=root/'game400-b.js'
b=b_path.read_text(encoding='utf-8')

story_modal_pattern=r"function storyModal\(\)\{.*?\}(?=\nfunction renderStoryScreen)"
b,count=re.subn(story_modal_pattern,"function storyModal(){closeModal();openStoryScreen()}",b,count=1,flags=re.S)
assert count==1,'storyModal replacement failed'

story_screen_pattern=r"function renderStoryScreen\(\)\{.*?\}\nfunction openStoryScreen\(\)\{.*?\}"
story_screen_repl=r'''const STORY_SECTION_ORDER=['Now','Residents','Journey','Cinematics'];
function setStorySection(name,focus=false){const key=STORY_SECTION_ORDER.includes(name)?name:'Now';STORY_SECTION_ORDER.forEach(section=>{const tab=document.getElementById(`storyTab${section}`),panel=document.getElementById(`story${section}Panel`),active=section===key;if(tab){tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1}if(panel)panel.hidden=!active});if(focus)document.getElementById(`storyTab${key}`)?.focus()}
function bindStorySections(){const tabs=STORY_SECTION_ORDER.map(name=>document.getElementById(`storyTab${name}`)).filter(Boolean);tabs.forEach((tab,index)=>{if(tab.dataset.bound==='1')return;tab.dataset.bound='1';tab.onclick=()=>setStorySection(STORY_SECTION_ORDER[index]);tab.addEventListener('keydown',event=>{let next=null;if(event.key==='ArrowRight')next=(index+1)%tabs.length;if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next===null)return;event.preventDefault();setStorySection(STORY_SECTION_ORDER[next],true)})})}
function renderStoryScreen(){if(!STORY)return;const ch=STORY.currentChapter(progress),c=STORY.chapters[ch-1],brief=STORY.campaignBriefing?STORY.campaignBriefing(progress):null,journey=STORY.journeyFor?STORY.journeyFor(progress):[],now=document.getElementById('storyNowSummary'),cast=document.getElementById('storyCast'),journeyEl=document.getElementById('storyJourney'),cinematics=document.getElementById('storyCinematics'),latest=brief?.known?.length?brief.known[brief.known.length-1]:'The route failures match, but their wider cause is still unknown.';if(now)now.innerHTML=`<div class="story-now-chapter"><span>Chapter ${ch} · ${c.theme}</span><strong>${c.name}</strong><p>${c.desc}</p></div><div class="story-now-grid"><div><strong>Current question</strong><p>${brief?.currentQuestion||'What does this route need now?'}</p><small>${brief?.currentStakes||''}</small></div><div><strong>Latest discovery</strong><p>${latest}</p></div><div><strong>Your work</strong><p>${brief?.goal||`Restore the routes people need now as the ${STORY.playerRole}.`}</p></div></div>`;if(cast)cast.innerHTML=`${STORY.cast.map(storyResidentCard).join('')}${storyHelperCrewHtml()}`;if(journeyEl)journeyEl.innerHTML=journey.length?journey.map(j=>`<div class="story-journey-item ${j.status==='Restored'?'done':'current'}"><b>${j.chapter}</b><span><strong>${j.name}</strong><small>${j.status} · ${j.location}</small><p>${j.summary}</p></span></div>`).join(''):'<p class="story-section-empty">Your restored routes will appear here.</p>';if(cinematics&&window.LatchlingsCinematics)window.LatchlingsCinematics.renderLibrary(cinematics,progress.unlocked);bindStorySections()}
function openStoryScreen(){screen('story');applyTheme(STORY?STORY.currentChapter(progress):1);renderStoryScreen();setStorySection('Now')}'''
b,count=re.subn(story_screen_pattern,story_screen_repl,b,count=1,flags=re.S)
assert count==1,'renderStoryScreen replacement failed'
b_path.write_text(b,encoding='utf-8')

# --- Story screen markup.
i_path=root/'index.html'
i=i_path.read_text(encoding='utf-8')
start=i.index('  <main id="story"')
end=i.index('  </main>',start)+len('  </main>')
new_story=r'''  <main id="story" class="screen story-screen" aria-label="Story and residents">
    <div class="topbar card story-topbar"><button class="iconbtn" id="storyBack" aria-label="Back"></button><div class="game-title" style="font-size:22px">Story &amp; Residents</div><div class="spacer"></div><button class="story-rules-btn" id="storyRules">Rules</button></div>
    <section class="story-screen-card card story-journal-shell">
      <header class="story-journal-heading"><div class="theme-kicker">The Latchlands</div><h1>Little Home Journal</h1><p>What matters now, who lives here, and what the Skyway has taught you.</p></header>
      <div class="story-section-tabs" role="tablist" aria-label="Story journal sections">
        <button class="story-section-tab" id="storyTabNow" role="tab" aria-selected="true" aria-controls="storyNowPanel" tabindex="0">Now</button>
        <button class="story-section-tab" id="storyTabResidents" role="tab" aria-selected="false" aria-controls="storyResidentsPanel" tabindex="-1">Residents</button>
        <button class="story-section-tab" id="storyTabJourney" role="tab" aria-selected="false" aria-controls="storyJourneyPanel" tabindex="-1">Journey</button>
        <button class="story-section-tab" id="storyTabCinematics" role="tab" aria-selected="false" aria-controls="storyCinematicsPanel" tabindex="-1">Cinematics</button>
      </div>
      <div class="story-section-panels">
        <section class="story-section-panel" id="storyNowPanel" role="tabpanel" aria-labelledby="storyTabNow" tabindex="0"><div id="storyNowSummary"></div></section>
        <section class="story-section-panel" id="storyResidentsPanel" role="tabpanel" aria-labelledby="storyTabResidents" tabindex="0" hidden><div class="story-section-heading"><span>Little Home</span><h2>Residents</h2></div><div class="story-cast" id="storyCast"></div></section>
        <section class="story-section-panel" id="storyJourneyPanel" role="tabpanel" aria-labelledby="storyTabJourney" tabindex="0" hidden><div class="story-section-heading"><span>Earned recap</span><h2>Journey so far</h2></div><div class="story-journey" id="storyJourney"></div></section>
        <section class="story-section-panel" id="storyCinematicsPanel" role="tabpanel" aria-labelledby="storyTabCinematics" tabindex="0" hidden><div class="story-section-heading"><span>Replay</span><h2>Story Cinematics</h2><p>Revisit the major story moments you have reached.</p></div><div class="cinematic-library" id="storyCinematics"></div></section>
      </div>
    </section>
  </main>'''
i=i[:start]+new_story+i[end:]

replacements={
 'style400-skyway-atlas.css?v=20260912-ch4pass3-1':'style400-skyway-atlas.css?v=20260914-atlas-journal-candidate1',
 'style400-story-theme.css?v=20260913-audit-r1r5-1':'style400-story-theme.css?v=20260914-atlas-journal-candidate1',
 'style400-atlas-progression.css':'style400-atlas-progression.css?v=20260914-atlas-journal-candidate1',
 'game400-a.js?v=20260914-home-coherence-candidate1':'game400-a.js?v=20260914-atlas-journal-candidate1',
 'game400-b.js?v=20260914-home-coherence-candidate1':'game400-b.js?v=20260914-atlas-journal-candidate1'
}
for old,new in replacements.items():
    assert old in i,f'index cache anchor missing: {old}'
    i=i.replace(old,new,1)
i_path.write_text(i,encoding='utf-8')

# --- Atlas presentation styles, inside the existing Atlas stylesheet.
atlas_path=root/'style400-skyway-atlas.css'
atlas=atlas_path.read_text(encoding='utf-8')
marker='/* Astra Atlas hierarchy coherence */'
assert marker not in atlas
atlas += r'''

/* Astra Atlas hierarchy coherence */
.atlas-chapter-nav{min-height:44px;grid-template-columns:44px minmax(0,1fr) 44px;gap:8px}
.atlas-chapter-arrow{width:44px;height:44px;min-width:44px;border-radius:17px;background:rgba(255,255,255,.38);box-shadow:inset 0 0 0 1px rgba(255,255,255,.44),0 3px 8px rgba(20,45,65,.08)}
.atlas-chapter-current{min-width:0;align-self:center;text-align:center;line-height:1.05}
.atlas-chapter-current span{display:block;font-size:7.5px;font-weight:950;letter-spacing:.11em;text-transform:uppercase;opacity:.62;margin-bottom:2px}
.atlas-chapter-current b{display:block;font-family:Georgia,"Times New Roman",serif;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.atlas-waypoint-nav{min-height:46px;grid-template-columns:44px minmax(0,1fr) 44px;gap:7px}
.atlas-range-arrow{width:44px;height:44px;min-width:44px;border:0;border-radius:16px;background:rgba(255,255,255,.34);box-shadow:inset 0 0 0 1px rgba(255,255,255,.42);font-size:20px;font-weight:950;cursor:pointer;backdrop-filter:blur(5px)}
.atlas-range-arrow:disabled{opacity:.25;cursor:default}
.atlas-range-current{height:44px;min-width:0;padding:5px 10px 4px;border-radius:16px;background:linear-gradient(145deg,rgba(255,255,255,.80),var(--atlas-accent-soft,#dff1ae));box-shadow:0 4px 10px rgba(25,48,68,.11),inset 0 0 0 1px rgba(255,255,255,.68);text-align:center;display:grid;grid-template-columns:1fr auto;grid-template-rows:auto auto;column-gap:8px;align-content:center}
.atlas-range-current span{grid-column:1/3;display:block;font-family:Georgia,"Times New Roman",serif;font-size:12.5px;line-height:1.05;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.atlas-range-current b{font-size:8.5px;line-height:1.05;letter-spacing:.04em;text-align:left}.atlas-range-current small{font-size:7px;line-height:1.05;font-weight:900;letter-spacing:.06em;text-transform:uppercase;opacity:.62;text-align:right}
.atlas-route-caption{display:none!important}
.atlas-state-badge{position:absolute;right:2px;bottom:5px;z-index:12;width:18px;height:18px;border-radius:50%;display:grid;place-items:center;background:#fffaf0;border:1px solid rgba(35,59,73,.28);box-shadow:0 2px 5px rgba(25,42,54,.20);font-size:11px;font-weight:1000;line-height:1;color:#24445f}
.atlas-node.state-restored .atlas-state-badge{background:#fff5bd}.atlas-node.state-current .atlas-state-badge{border-radius:5px;rotate:45deg;background:#fff0a3}.atlas-node.state-current .atlas-state-badge{font-size:9px}.atlas-node.state-current .atlas-state-badge::first-letter{rotate:-45deg}
.atlas-node.state-available .atlas-state-badge{background:rgba(255,255,255,.82);border-width:2px}.atlas-node.state-locked .atlas-state-badge{display:none}
.atlas-node.state-restored .atlas-island-top{clip-path:polygon(8% 4%,92% 4%,100% 45%,86% 93%,50% 100%,14% 93%,0 45%)}
.atlas-node.state-available .atlas-island{opacity:.82}.atlas-node.state-available .atlas-island-top{box-shadow:inset 0 2px rgba(255,255,255,.36),inset 0 -5px color-mix(in srgb,var(--atlas-top,#87c66c) 64%,#52615a)}
@media(max-height:720px){.atlas-chapter-nav{min-height:40px}.atlas-chapter-arrow{width:40px;height:40px;min-width:40px}.atlas-waypoint-nav{min-height:42px}.atlas-range-arrow{width:40px;height:40px;min-width:40px}.atlas-range-current{height:40px;padding-top:4px;padding-bottom:3px}.atlas-range-current span{font-size:11px}.atlas-range-current b{font-size:7.8px}.atlas-range-current small{font-size:6.5px}}
@media(max-height:600px){.atlas-chapter-nav{min-height:36px}.atlas-chapter-arrow{width:36px;height:36px;min-width:36px}.atlas-waypoint-nav{min-height:38px}.atlas-range-arrow{width:38px;height:38px;min-width:38px}.atlas-range-current{height:38px}.atlas-chapter-current span{display:none}.atlas-chapter-current b{font-size:12px}}
@media(max-width:340px){.atlas-chapter-nav{gap:5px}.atlas-waypoint-nav{gap:4px}.atlas-range-current{padding-left:7px;padding-right:7px}.atlas-range-current span{font-size:10.5px}.atlas-range-current small{display:none}}
'''
atlas_path.write_text(atlas,encoding='utf-8')

# --- Atlas reward working landmark response.
prog_path=root/'style400-atlas-progression.css'
prog=prog_path.read_text(encoding='utf-8')
prog_marker='/* Astra working-landmark arrival */'
assert prog_marker not in prog
prog += r'''

/* Astra working-landmark arrival */
.atlas-node.reward-working .atlas-prop{animation:atlasLandmarkWorking 1.15s cubic-bezier(.2,.8,.2,1) both;filter:drop-shadow(0 0 8px #fff3a4) drop-shadow(0 0 14px var(--atlas-accent))}
.atlas-node.reward-working .atlas-island:after{content:"";position:absolute;inset:-2px;border-radius:50%;border:2px solid rgba(255,239,147,.86);box-shadow:0 0 12px rgba(255,232,118,.72);animation:atlasLandmarkRing 1.15s ease-out both;pointer-events:none}
@keyframes atlasLandmarkWorking{0%{scale:.88}42%{scale:1.18}100%{scale:1}}
@keyframes atlasLandmarkRing{0%{opacity:0;scale:.72}35%{opacity:1}100%{opacity:0;scale:1.28}}
html[data-motion="reduced"] .atlas-node.reward-working .atlas-prop{animation:none!important;filter:drop-shadow(0 0 8px #fff3a4) drop-shadow(0 0 12px var(--atlas-accent))}
html[data-motion="reduced"] .atlas-node.reward-working .atlas-island:after{animation:none!important;opacity:.85;scale:1}
'''
prog_path.write_text(prog,encoding='utf-8')

# --- Journal layout styles in existing story stylesheet.
story_path=root/'style400-story-theme.css'
story=story_path.read_text(encoding='utf-8')
story_marker='/* Astra journal section coherence */'
assert story_marker not in story
story += r'''

/* Astra journal section coherence */
#story.story-screen{overflow:hidden}
#story .story-topbar{flex:0 0 auto}
.story-journal-shell{flex:1;min-height:0;padding:14px 14px 13px;display:flex;flex-direction:column;overflow:hidden}
.story-journal-heading{flex:0 0 auto;padding:0 3px 8px}.story-journal-heading h1{margin:1px 0 3px;font-family:Georgia,"Times New Roman",serif;font-size:27px;line-height:1}.story-journal-heading>p{margin:0;color:#587184;font-size:10.5px;line-height:1.28}
.story-section-tabs{flex:0 0 auto;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin:0 0 9px}
.story-section-tab{min-width:0;min-height:44px;padding:7px 5px;border:1px solid rgba(81,104,117,.18);border-radius:14px;background:rgba(255,255,255,.42);color:#476175;font-size:10.5px;font-weight:900;cursor:pointer;box-shadow:inset 0 1px rgba(255,255,255,.58)}
.story-section-tab[aria-selected="true"]{background:linear-gradient(145deg,#fffaf0,color-mix(in srgb,var(--themeAccent,#79b95b) 18%,#fff6df));color:#173a67;border-color:color-mix(in srgb,var(--themeAccent,#79b95b) 38%,#c5a877);box-shadow:0 4px 10px rgba(29,51,68,.10),inset 0 1px #fff}
.story-section-tab:focus-visible{outline:3px solid #173a67;outline-offset:2px}
.story-section-panels{flex:1;min-height:0;position:relative}.story-section-panel{height:100%;overflow:auto;padding:2px 3px 8px;scrollbar-gutter:stable}.story-section-panel[hidden]{display:none!important}.story-section-panel:focus{outline:none}.story-section-panel:focus-visible{outline:2px solid rgba(23,58,103,.58);outline-offset:2px;border-radius:12px}
.story-section-heading{margin:2px 0 9px}.story-section-heading>span{display:block;color:#6a806f;font-size:8px;font-weight:950;letter-spacing:.09em;text-transform:uppercase}.story-section-heading h2{margin:2px 0 3px;font-family:Georgia,"Times New Roman",serif;font-size:22px}.story-section-heading p{margin:0;color:#5a7182;font-size:10.5px;line-height:1.3}
.story-now-chapter{padding:12px 13px;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.70),color-mix(in srgb,var(--themeAccent,#79b95b) 10%,rgba(255,244,216,.72)));border:1px solid rgba(112,126,101,.18);box-shadow:0 5px 12px rgba(37,61,74,.08)}.story-now-chapter>span{display:block;color:#607867;font-size:8px;font-weight:950;letter-spacing:.08em;text-transform:uppercase}.story-now-chapter>strong{display:block;margin:2px 0 4px;font-family:Georgia,"Times New Roman",serif;font-size:20px;color:#173a67}.story-now-chapter>p{margin:0;color:#536d7e;font-size:10.8px;line-height:1.32}
.story-now-grid{display:grid;gap:8px;margin-top:9px}.story-now-grid>div{padding:10px 11px;border-radius:15px;background:rgba(255,249,235,.67);border:1px solid rgba(173,142,99,.18)}.story-now-grid strong{display:block;color:#456c5d;font-size:8px;letter-spacing:.08em;text-transform:uppercase}.story-now-grid p{margin:3px 0 0;color:#37566f;font-size:11px;line-height:1.35}.story-now-grid small{display:block;margin-top:4px;color:#6b7e8c;font-size:9px;line-height:1.28}.story-section-empty{color:#667d8e;font-size:12px;text-align:center;padding:24px 12px}
#storyResidentsPanel .story-helper-explain{margin-top:10px}
html[data-text-size="large"] .story-journal-heading>p,html[data-text-size="large"] .story-section-heading p,html[data-text-size="large"] .story-now-chapter>p,html[data-text-size="large"] .story-now-grid p{font-size:1.08em}html[data-text-size="large"] .story-section-tab{font-size:11.5px}html[data-text-size="large"] .story-now-grid small{font-size:10px}
@media(max-width:360px){.story-section-tabs{grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}.story-section-tab{min-height:40px}.story-journal-heading h1{font-size:23px}}
@media(max-height:620px){.story-journal-shell{padding-top:10px}.story-journal-heading{padding-bottom:5px}.story-journal-heading>p{display:none}.story-section-tabs{margin-bottom:6px}.story-section-tab{min-height:38px;padding:5px}.story-now-chapter{padding:9px 10px}.story-now-grid{gap:5px;margin-top:6px}.story-now-grid>div{padding:7px 9px}}
'''
story_path.write_text(story,encoding='utf-8')

# Candidate invariants.
assert 'atlas-region-dot' not in a[a.index('function renderChapter'):a.index('function dailyLevel') if 'function dailyLevel' in a else len(a)]
assert 'atlas-range-current' in a and 'data-state=' in a
assert "node.classList.add('current','state-current','new-current','cloud-clearing','reward-working')" in a
assert "const STORY_SECTION_ORDER=['Now','Residents','Journey','Cinematics']" in b
assert 'storyTabCinematics' in i and 'storyNowPanel' in i
assert 'Astra Atlas hierarchy coherence' in atlas
assert 'Astra journal section coherence' in story
assert 'Astra working-landmark arrival' in prog
exec(Path('.github/tmp/astra_atlas_journal_viewport_followup.py').read_text(encoding='utf-8'), {'__name__':'__main__'})
print('Astra Atlas + journal candidate patch applied.')
