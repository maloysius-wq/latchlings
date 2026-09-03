from pathlib import Path

# STORY_BIBLE.md
p=Path('STORY_BIBLE.md')
t=p.read_text()
marker='The player is not commanding the Latchlings as pieces. They are helping everyone understand the sequence of moves that will get the right people to the right places.\n'
addition='''\n### Featured residents and helper crews\n\nA named resident in a Story Card is the person whose errand, discovery, concern, or request gives that route problem its meaning. The puzzle board is not a literal cast portrait of that scene. The Latchlings visible on the board are the **helper crew** or **work party** pitching in with the Waykeeper to carry out the route.\n\nThat means a Story Card can be about Pippa while the active board contains Latchlings with different body colors and suit marks. Those board identities belong to the crew participating in that route problem; they do not need to visually match the featured resident. A featured resident may also be helping in-world, but the board remains a practical route abstraction rather than a one-to-one depiction of named characters.\n\nThe simple player-facing rule is: **When one Latchling needs help, the whole island pitches in.**\n'''
if '### Featured residents and helper crews' not in t:
    if marker not in t: raise SystemExit('STORY_BIBLE gameplay fiction anchor missing')
    t=t.replace(marker,marker+addition,1)
p.write_text(t)

# story400.js
p=Path('story400.js')
t=p.read_text()
repls={
"role:'Gardener and household organizer',voice:":"role:'Gardener and household organizer',shortRole:'Gardener & organizer',voice:",
"role:'Courier, errand-runner, and enthusiastic fixer',voice:":"role:'Courier, errand-runner, and enthusiastic fixer',shortRole:'Courier & fixer',voice:",
"role:'Tree-tender and island caretaker',voice:":"role:'Tree-tender and island caretaker',shortRole:'Island caretaker',voice:",
"role:'Explorer, according to Pip',voice:":"role:'Explorer, according to Pip',shortRole:'Explorer',voice:",
"role:'Co-conspirator and collector',voice:":"role:'Co-conspirator and collector',shortRole:'Collector & commentator',voice:"
}
for old,new in repls.items():
    if old in t:t=t.replace(old,new,1)
    elif new not in t:raise SystemExit('CAST role anchor missing: '+old)
helper_marker='function completedChapters(progress){'
helper='''function featuredResidents(text){\n const source=String(text||'');\n return CAST.filter(c=>new RegExp(`(?:^|\\\\W)${c.name.replace(/[.*+?^${}()|[\\\\]\\\\]/g,'\\\\$&')}(?=$|\\\\W)`,'i').test(source));\n}\n\n'''
if 'function featuredResidents(text)' not in t:
    if helper_marker not in t:raise SystemExit('story helper anchor missing')
    t=t.replace(helper_marker,helper+helper_marker,1)
old=" theme:'A good path is not one that never changes. It is one that can change with the people who need it.',\n cast:CAST,chapters:CHAPTERS,levelMeta,beatForLevel,completedChapters,currentChapter"
new=" theme:'A good path is not one that never changes. It is one that can change with the people who need it.',\n helperCrewMotto:'When one Latchling needs help, the whole island pitches in.',\n helperCrewExplanation:'The resident named in a story is the person whose errand, discovery, or concern gives the route meaning. The Latchlings on the board are the helper crew working that route with the Waykeeper, so their colors and suit marks do not need to match the featured resident.',\n cast:CAST,chapters:CHAPTERS,levelMeta,beatForLevel,featuredResidents,completedChapters,currentChapter"
if old in t:t=t.replace(old,new,1)
elif 'helperCrewMotto' not in t:raise SystemExit('story export anchor missing')
p.write_text(t)

# index.html
p=Path('index.html')
t=p.read_text()
old='''      <div class="story-card-meta"><span class="story-card-kind" id="storyCardKind"></span><span class="story-card-location" id="storyCardLocation"></span></div>\n      <h2 id="storyCardTitle"></h2>'''
new='''      <div class="story-card-meta"><span class="story-card-kind" id="storyCardKind"></span><span class="story-card-location" id="storyCardLocation"></span></div>\n      <div class="story-card-characters" id="storyCardCharacters" hidden></div>\n      <h2 id="storyCardTitle"></h2>'''
if old in t:t=t.replace(old,new,1)
elif 'id="storyCardCharacters"' not in t:raise SystemExit('story card character host anchor missing')
old2='''      <p class="story-card-flavor" id="storyCardFlavor"></p>\n      <div class="story-card-actions">'''
new2='''      <p class="story-card-flavor" id="storyCardFlavor"></p>\n      <aside class="story-card-crew-note" id="storyCardCrewNote" hidden><strong>How routes work</strong><span></span></aside>\n      <div class="story-card-actions">'''
if old2 in t:t=t.replace(old2,new2,1)
elif 'id="storyCardCrewNote"' not in t:raise SystemExit('story helper note anchor missing')
p.write_text(t)

# story-theme400.js
p=Path('story-theme400.js')
t=p.read_text()
const_anchor="const SEEN_KEY='latchlings_story_cards_seen_v1';\n"
const_add="""const CHAR_COLORS={coral:'#ef5f66',blue:'#4c8ff4',mint:'#66bd72',gold:'#f6b737',lavender:'#9a72df'};\nconst CHAR_LIGHT={coral:'#ff9297',blue:'#79aff9',mint:'#94dc98',gold:'#ffd06a',lavender:'#c3a0f1'};\nconst CHAR_DARK={coral:'#c33d49',blue:'#2e69c8',mint:'#469852',gold:'#d18c16',lavender:'#724fbd'};\nconst CHAR_EXPR={Pippa:'curious',Bramble:'smug',Rowan:'happy',Pip:'determined',Tansy:'surprised'};\n"""
if 'const CHAR_COLORS=' not in t:
    if const_anchor not in t:raise SystemExit('story theme constants anchor missing')
    t=t.replace(const_anchor,const_anchor+const_add,1)

insert_anchor="function iconSvg(key){const body=ICONS[key]||ICONS.parcel;return `<svg viewBox=\"0 0 64 64\" aria-hidden=\"true\">${body}</svg>`}\n"
character_helpers=r'''function charSuitSvg(s){
 if(s==='heart')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 86C39 74 13 58 13 34c0-14 10-23 23-23 8 0 14 4 18 10 4-6 10-10 18-10 13 0 23 9 23 23 0 24-26 40-45 52Z"/></svg>';
 if(s==='diamond')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 7 88 50 50 93 12 50Z"/></svg>';
 if(s==='club')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 12a19 19 0 0 1 12 34 20 20 0 1 1 9 37c-9 0-15-5-18-11 1 10 5 16 12 21H35c7-5 11-11 12-21-3 6-9 11-18 11a20 20 0 1 1 9-37A19 19 0 0 1 50 12Z"/></svg>';
 if(s==='spade')return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8C43 22 14 36 14 60c0 13 10 23 23 23 8 0 13-4 16-10-1 9-5 15-12 20h18c-7-5-11-11-12-20 3 6 8 10 16 10 13 0 23-10 23-23C86 36 57 22 50 8Z"/></svg>';
 return '';
}
function characterVars(c){const color=CHAR_COLORS[c.color]||CHAR_COLORS.blue;return `--charColor:${color};--charLight:${CHAR_LIGHT[c.color]||color};--charDark:${CHAR_DARK[c.color]||color}`}
function characterFace(){return '<span class="face"><span class="eyes"><i class="eye"></i><i class="eye"></i></span><i class="mouth"></i></span>'}
function characterPortrait(c,index,total){const expr=CHAR_EXPR[c.name]||'happy';return `<span class="story-scene-character story-scene-character-${index+1} story-scene-character-count-${total}" data-character="${escapeHtml(c.name)}" data-color="${escapeHtml(c.color)}" data-suit="${escapeHtml(c.suit)}" style="${characterVars(c)}"><span class="story-char-body expr-${expr}"><span class="suit-mark">${charSuitSvg(c.suit)}</span>${characterFace()}</span></span>`}
function characterAvatar(c){return `<span class="story-character-avatar" data-character="${escapeHtml(c.name)}" data-color="${escapeHtml(c.color)}" data-suit="${escapeHtml(c.suit)}" style="${characterVars(c)}"><span class="story-character-avatar-suit">${charSuitSvg(c.suit)}</span><span class="story-character-avatar-eyes"><i></i><i></i></span></span>`}
function characterChip(c){return `<div class="story-character-chip" data-character="${escapeHtml(c.name)}">${characterAvatar(c)}<span class="story-character-copy"><strong>${escapeHtml(c.name)}</strong><small>${escapeHtml(c.shortRole||c.role)}</small></span></div>`}
function residentCard(c){return `<div class="story-person story-person-portrait" data-character="${escapeHtml(c.name)}">${characterAvatar(c)}<span class="story-person-copy"><strong>${escapeHtml(c.name)}</strong><span>${escapeHtml(c.role)}. ${escapeHtml(c.voice)}</span></span></div>`}
function featuredFor(meta,chapter){if(!STORY||!STORY.featuredResidents||!meta)return[];const flavor=meta.local===1?chapter.opening:meta.flavor;return STORY.featuredResidents(`${meta.context} ${flavor}`).slice(0,2)}
'''
if 'function characterPortrait(' not in t:
    if insert_anchor not in t:raise SystemExit('story theme icon helper anchor missing')
    t=t.replace(insert_anchor,insert_anchor+character_helpers,1)

# replace vignette
start=t.find('function vignette(meta){')
end=t.find('function decorateLevel(',start)
if start>=0 and end>start:
    new_vignette="""function vignette(meta,featured=[]){const props=decorFor(meta),people=featured.slice(0,2);return `<div class=\"story-scene-land\"></div>${props.map((p,i)=>`<span class=\"story-scene-prop scene-p${i+1} prop-${p}\">${iconSvg(p)}</span>`).join('')}<span class=\"story-scene-route\"></span>${people.map((c,i)=>characterPortrait(c,i,people.length)).join('')}`}\n"""
    t=t[:start]+new_vignette+t[end:]
elif 'function vignette(meta,featured=[]){' not in t:
    raise SystemExit('vignette function anchor missing')

# replace show
start=t.find('function show(level,manual=false){')
end=t.find('function close(',start)
if start<0 or end<0:raise SystemExit('show function bounds missing')
new_show=r'''function show(level,manual=false){
 if(!STORY)return;
 const meta=STORY.levelMeta(level),chapter=STORY.chapters[meta.chapter-1],overlay=document.getElementById('storyCardOverlay');if(!overlay)return;
 const flavor=meta.local===1?chapter.opening:meta.flavor,featured=featuredFor(meta,chapter);
 overlay.className=`story-card-overlay story-card-ch${meta.chapter} story-card-${meta.local===1?'chapter':meta.local%10===0?'milestone':'route'} show`;
 overlay.dataset.level=String(level);overlay.dataset.manual=manual?'1':'0';overlay.dataset.featured=featured.map(c=>c.name).join(',');
 document.getElementById('storyCardKind').textContent=kindFor(meta);document.getElementById('storyCardLocation').textContent=`Chapter ${meta.chapter} · ${meta.location}`;document.getElementById('storyCardTitle').textContent=meta.title;document.getElementById('storyCardContext').textContent=meta.context;document.getElementById('storyCardFlavor').textContent=flavor;document.getElementById('storyCardScene').innerHTML=vignette(meta,featured);
 const characters=document.getElementById('storyCardCharacters');if(characters){characters.innerHTML=featured.map(characterChip).join('');characters.hidden=!featured.length;characters.classList.toggle('is-pair',featured.length>1)}
 const crew=document.getElementById('storyCardCrewNote');if(crew){const showCrew=meta.level===1;crew.hidden=!showCrew;const copy=crew.querySelector('span');if(copy)copy.textContent=showCrew?`${STORY.helperCrewMotto} The Latchlings on the board are the helper crew working this route with you.`:''}
 document.getElementById('storyCardContinue').textContent=manual?'Back to board':'Continue';overlay.setAttribute('aria-hidden','false');requestAnimationFrame(()=>document.getElementById('storyCardContinue')?.focus())
}
'''
t=t[:start]+new_show+t[end:]
old_export='window.LatchlingsStoryTheme={decorateLevel,enterLevel,show,close,decorFor,iconSvg,autoEligible};'
new_export='window.LatchlingsStoryTheme={decorateLevel,enterLevel,show,close,decorFor,iconSvg,autoEligible,featuredFor,characterChip,residentCard};'
if old_export in t:t=t.replace(old_export,new_export,1)
elif 'residentCard' not in t.split('window.LatchlingsStoryTheme=',1)[-1]:raise SystemExit('story theme export anchor missing')
p.write_text(t)

# game400-b.js
p=Path('game400-b.js')
t=p.read_text()
start=t.find('function storyModal(){')
end=t.find('function openStoryScreen(){',start)
if start<0 or end<0:raise SystemExit('story screen function bounds missing')
new_funcs=r'''function storyResidentCard(x){return window.LatchlingsStoryTheme&&window.LatchlingsStoryTheme.residentCard?window.LatchlingsStoryTheme.residentCard(x):`<div class="story-person"><strong>${x.name}</strong><span>${x.role}. ${x.voice}</span></div>`}
function storyHelperCrewHtml(){return `<div class="story-helper-explain"><strong>Who are the Latchlings on the board?</strong><span>${STORY.helperCrewMotto} ${STORY.helperCrewExplanation}</span></div>`}
function storyModal(){if(!STORY){rulesModal();return}const ch=STORY.currentChapter(progress),c=STORY.chapters[ch-1],cast=STORY.cast.map(storyResidentCard).join('');modal(`<h2>The Latchlands</h2><div class="story-scroll"><p>${STORY.premise}</p><h3>You are the ${STORY.playerRole}</h3><p>The Skyway is an old route network built to keep changing as the floating islands drift. Your puzzles are the route problems behind everyday life.</p>${storyHelperCrewHtml()}<h3>Little Home</h3><div class="story-cast">${cast}</div><h3>Current chapter · ${c.name}</h3><p><strong>${c.theme}</strong><br>${c.desc}</p><p><em>${STORY.theme}</em></p></div><div class="modal-actions"><button class="primary-small" id="storyClose">Back</button></div>`);document.getElementById('storyClose').onclick=settingsModal}
function renderStoryScreen(){if(!STORY)return;const ch=STORY.currentChapter(progress),c=STORY.chapters[ch-1],premise=document.getElementById('storyPremise'),role=document.getElementById('storyRole'),cast=document.getElementById('storyCast'),chapter=document.getElementById('storyChapter');if(premise)premise.textContent=STORY.premise;if(role)role.innerHTML=`<strong>You are the ${STORY.playerRole}</strong><span>The Skyway is a living route network built to change as the floating islands drift. Your puzzle routes are the everyday work of keeping homes and neighbors connected.</span>${storyHelperCrewHtml()}`;if(cast)cast.innerHTML=STORY.cast.map(storyResidentCard).join('');if(chapter)chapter.innerHTML=`<strong>Chapter ${ch}: ${c.name}</strong><span>${c.theme}</span><p>${c.desc}</p>`}
'''
t=t[:start]+new_funcs+t[end:]
p.write_text(t)

# style400-story-theme.css
p=Path('style400-story-theme.css')
t=p.read_text()
css_marker='/* Featured resident Story Card portraits + helper-crew canon */'
if css_marker not in t:
    t += r'''

/* Featured resident Story Card portraits + helper-crew canon */
.story-card-characters{display:flex;flex-wrap:wrap;gap:7px;margin:0 0 9px}.story-card-characters[hidden]{display:none}.story-card-characters.is-pair{gap:6px}
.story-character-chip{display:flex;align-items:center;gap:7px;min-width:0;padding:5px 9px 5px 6px;border:1px solid color-mix(in srgb,var(--storyAccent) 28%,#d5bd94);border-radius:999px;background:rgba(255,249,236,.83);box-shadow:0 2px 7px rgba(32,47,57,.08)}
.story-character-avatar{position:relative;display:block;flex:0 0 34px;width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 34% 24%,rgba(255,255,255,.72) 0 8%,transparent 19%),linear-gradient(145deg,var(--charLight),var(--charColor) 55%,var(--charDark));border:1px solid rgba(255,255,255,.78);box-shadow:0 2px 5px rgba(24,39,55,.22),inset 0 -3px 5px rgba(25,31,42,.10)}
.story-character-avatar-suit{position:absolute;left:50%;top:3px;translate:-50% 0;width:10px;height:10px}.story-character-avatar-suit svg{width:100%;height:100%;fill:#142137}
.story-character-avatar-eyes{position:absolute;left:8px;right:8px;top:16px;height:9px;display:flex;justify-content:center;gap:5px}.story-character-avatar-eyes i{display:block;width:6px;height:8px;border-radius:50%;background:#fff;box-shadow:inset 0 -1px rgba(18,30,45,.12);position:relative}.story-character-avatar-eyes i:after{content:"";position:absolute;width:3px;height:4px;border-radius:50%;background:#17253a;left:2px;top:2px}
.story-character-copy{display:flex;flex-direction:column;min-width:0;line-height:1.05}.story-character-copy strong{color:#173a67;font-family:Georgia,serif;font-size:13px}.story-character-copy small{margin-top:2px;color:#6b7b87;font-size:9.5px;font-weight:800;white-space:nowrap}
.story-scene-character{position:absolute;z-index:6;bottom:7px;width:82px;height:82px;filter:drop-shadow(0 7px 7px rgba(19,31,42,.24));animation:storyResidentFloat 3.4s ease-in-out infinite;pointer-events:none}.story-scene-character-count-1{left:50%;translate:-50% 0}.story-scene-character-count-2.story-scene-character-1{left:39%;translate:-50% 0;rotate:-4deg}.story-scene-character-count-2.story-scene-character-2{left:61%;translate:-50% 0;rotate:4deg;animation-delay:-1.4s}
.story-char-body{position:relative;display:block;width:82px;height:82px;border-radius:50%;background:radial-gradient(circle at 34% 24%,rgba(255,255,255,.66) 0 7%,transparent 18%),linear-gradient(145deg,var(--charLight),var(--charColor) 55%,var(--charDark));box-shadow:0 5px 9px rgba(22,39,58,.27),inset 0 -5px 8px rgba(30,32,40,.13);border:1.5px solid rgba(255,255,255,.72);--blink-duration:4.7s;--blink-delay:-1.8s;--idle-delay:-.7s}
.story-scene-character-2 .story-char-body{--blink-duration:5.35s;--blink-delay:-3.1s;--idle-delay:-1.4s}
.story-card-crew-note{display:grid;grid-template-columns:auto 1fr;gap:8px 10px;align-items:start;margin-top:11px;padding:10px 11px;border-radius:14px;border:1px solid color-mix(in srgb,var(--storyAccent) 24%,#d9c39d);background:color-mix(in srgb,var(--storyAccent) 7%,rgba(255,250,240,.94));color:#536c7e;font-size:10.5px;line-height:1.35}.story-card-crew-note[hidden]{display:none}.story-card-crew-note strong{color:#29465f;font-size:9.5px;letter-spacing:.06em;text-transform:uppercase}.story-card-crew-note span{font-weight:720}
.story-helper-explain{display:grid;gap:4px;margin:12px 0 15px;padding:12px 13px;border-radius:16px;background:rgba(245,222,172,.52);border:1px solid rgba(177,144,97,.30);text-align:left}.story-helper-explain strong{color:#173a67;font-family:Georgia,serif;font-size:15px}.story-helper-explain span{color:#526a7c;font-size:11.5px;line-height:1.45;font-weight:700}
.story-person.story-person-portrait{display:flex;align-items:center;gap:10px;text-align:left}.story-person-portrait>.story-character-avatar{flex-basis:42px;width:42px;height:42px}.story-person-portrait>.story-character-avatar .story-character-avatar-suit{top:4px;width:12px;height:12px}.story-person-portrait>.story-character-avatar .story-character-avatar-eyes{left:10px;right:10px;top:20px;height:10px}.story-person-copy{display:flex;flex-direction:column;min-width:0}.story-person-copy strong{display:block}.story-person-copy>span{display:block}
@keyframes storyResidentFloat{0%,100%{translate:var(--resident-x,0) 0}50%{translate:var(--resident-x,0) -3px}}
@media(max-width:520px){.story-scene-character{width:72px;height:72px;bottom:5px}.story-char-body{width:72px;height:72px}.story-character-chip{max-width:100%}.story-character-copy small{white-space:normal}.story-card-characters.is-pair .story-character-chip{flex:1 1 145px}}
@media(max-height:720px){.story-scene-character{width:62px;height:62px;bottom:2px}.story-char-body{width:62px;height:62px}.story-card-characters{margin-bottom:5px}.story-character-avatar{width:30px;height:30px;flex-basis:30px}.story-card-crew-note{padding:7px 9px;margin-top:7px}}
@media(prefers-reduced-motion:reduce){.story-scene-character,.story-char-body .face,.story-char-body .eyes,.story-char-body .mouth{animation:none!important}}
'''
p.write_text(t)
print('CHARACTER_STORY_CARDS_APPLIED')
