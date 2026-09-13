from pathlib import Path


def replace_once(path, old, new):
    p=Path(path)
    s=p.read_text()
    if old not in s:
        raise SystemExit(f'anchor not found in {path}: {old[:120]!r}')
    if s.count(old) != 1:
        raise SystemExit(f'expected one anchor in {path}, found {s.count(old)}: {old[:120]!r}')
    p.write_text(s.replace(old,new,1))


def append_once(path, marker, block):
    p=Path(path)
    s=p.read_text()
    if marker in s:
        raise SystemExit(f'candidate marker already present in {path}: {marker}')
    p.write_text(s.rstrip()+"\n\n"+block.strip()+"\n")

# 1) Chapter-aware production mode.
replace_once(
    'game400-a.js',
    "const VISUAL_CHAPTER_MODES={1:'sunpetal',2:'lanternwood'};",
    "const VISUAL_CHAPTER_MODES={1:'sunpetal',2:'lanternwood',3:'lodestone'};"
)

# 2) Dedicated Chapter 3 reward and routing.
reward_fn = r'''function showChapterThreeReward(stars,starRow,moveWord,lev){
 modal(`<section class="chapter-reward-card chapter-three-reward" aria-label="Lodestone Caverns stabilized"><div class="chapter-reward-kicker">Lodestone stabilized</div><h2>Little Home has a restored anchor</h2><div class="chapter-reward-postcard lodestone-reward-postcard" role="img" aria-label="A restored Skyway anchor holds beside an old Waykeeper marker among glowing Lodestone crystals"><i class="lodestone-reward-shelf"></i><i class="lodestone-reward-crystal c1"></i><i class="lodestone-reward-crystal c2"></i><i class="lodestone-reward-crystal c3"></i><i class="lodestone-reward-marker"></i><i class="lodestone-reward-anchor"></i><i class="lodestone-reward-line"></i></div><p class="chapter-reward-result">The anchors do not freeze the islands. They create dependable moments that crews can retune as the drift changes.</p><div class="win-stars chapter-reward-stars" aria-label="${stars} stars earned">${starRow}</div><div class="chapter-reward-score">${moveWord(movesUsed)} · Perfect route: ${moveWord(lev.optimal)}</div><div class="modal-actions"><button class="primary-small" id="chapterThreeRewardHome">Visit Little Home</button><button class="secondary-small" id="chapterThreeRewardContinue">Continue to Masquerade</button></div></section>`);
 document.getElementById('chapterThreeRewardHome').onclick=()=>{closeModal();cancelAtlasReward();focusHomeReward('anchor')};
 document.getElementById('chapterThreeRewardContinue').onclick=()=>{closeModal();if(atlasRewardState&&atlasRewardState.from===150)playQueuedAtlasReward(true);else startLevel(151)}
}
'''
replace_once('game400-b.js','function winLevel(){',reward_fn+'function winLevel(){')
replace_once(
    'game400-b.js',
    "if(currentLevel===50){showChapterOneReward(stars,starRow,moveWord,lev);return}if(currentLevel===100){showChapterTwoReward(stars,starRow,moveWord,lev);return}const storyMeta=",
    "if(currentLevel===50){showChapterOneReward(stars,starRow,moveWord,lev);return}if(currentLevel===100){showChapterTwoReward(stars,starRow,moveWord,lev);return}if(currentLevel===150){showChapterThreeReward(stars,starRow,moveWord,lev);return}const storyMeta="
)

# 3) Lodestone production surfaces + chapter reward art.
lodestone_css = r'''
/* Pass 3 Chapter 3: Lodestone production family. Geological material stays quiet inside rule space; crystals and old Waykeeper markings live outside it. */
#game[data-visual-slice="lodestone"] .board-wrap{background:radial-gradient(ellipse at 50% 44%,rgba(99,216,232,.10) 0 34%,rgba(73,61,111,.08) 50%,rgba(17,29,43,.16) 67%,transparent 79%);box-shadow:0 23px 44px rgba(13,24,39,.20)}
#game[data-visual-slice="lodestone"] #board{background:linear-gradient(145deg,#56616b,#3b4653)!important;border:3px solid #6d94a5!important;box-shadow:0 18px 36px rgba(10,21,34,.34),inset 0 2px rgba(221,249,255,.18),inset 0 0 0 5px rgba(66,103,119,.12)!important}
#game[data-visual-slice="lodestone"] #board .cell{background:linear-gradient(145deg,#707a82,#59636e)!important;border:1px solid rgba(31,48,62,.45)!important;border-radius:9px!important;box-shadow:inset 0 1px rgba(230,249,252,.13),inset 0 -2px rgba(16,28,39,.15)!important}
#game[data-visual-slice="lodestone"] #board .rock{background:linear-gradient(145deg,#87919a,#4c5863 62%,#35414d)!important;filter:saturate(.52);box-shadow:inset 4px 5px rgba(255,255,255,.11),inset -4px -5px rgba(12,21,30,.23),0 5px 8px rgba(8,17,28,.30)!important}
#game[data-visual-slice="lodestone"] #board .nest{background:linear-gradient(145deg,#edf5f2,#c4d3d1)!important;border-width:3px!important;border-style:solid!important;box-shadow:inset 0 0 0 3px rgba(255,255,255,.34),0 3px 8px rgba(11,24,35,.24)!important}
#game[data-visual-slice="lodestone"] #board .anchor{background:linear-gradient(145deg,#bdeef2,#78b7c5 52%,#4e8195)!important;border-color:#294b62!important;color:#18364e!important;box-shadow:0 0 0 2px rgba(200,250,255,.18),0 5px 10px rgba(8,20,31,.32),inset 0 1px rgba(255,255,255,.46)!important;filter:drop-shadow(0 0 4px rgba(95,214,228,.24))}
#game[data-visual-slice="lodestone"] .theme-flourish.left{left:1px;top:8%;width:65px;height:118px;opacity:.66;background:linear-gradient(150deg,#b9f6fb,#5ab4ca 68%,#3a688c);clip-path:polygon(18% 100%,29% 36%,42% 5%,52% 48%,63% 21%,75% 100%);filter:drop-shadow(0 0 9px rgba(79,205,222,.32))}
#game[data-visual-slice="lodestone"] .theme-flourish.left:before{content:"";position:absolute;left:8px;bottom:0;width:34px;height:72px;background:linear-gradient(155deg,#b9a9ef,#645e9f);clip-path:polygon(0 100%,28% 37%,48% 0,64% 48%,100% 100%);opacity:.46}
#game[data-visual-slice="lodestone"] .theme-flourish.right{right:2px;bottom:8%;width:54px;height:74px;opacity:.72;background:linear-gradient(145deg,#64717a,#36424e);clip-path:polygon(12% 0,88% 7%,100% 91%,14% 100%,0 17%);box-shadow:0 8px 13px rgba(10,20,30,.22)}
#game[data-visual-slice="lodestone"] .theme-flourish.right:before{content:"";position:absolute;left:13px;top:13px;width:23px;height:23px;border:3px solid rgba(142,232,241,.72);border-radius:50%;box-shadow:0 0 9px rgba(87,213,229,.30)}
#game[data-visual-slice="lodestone"] .theme-flourish.right:after{content:"";position:absolute;left:12px;bottom:14px;width:26px;height:3px;border-radius:3px;background:rgba(205,238,240,.52);box-shadow:0 7px rgba(205,238,240,.34),0 -7px rgba(205,238,240,.24);transform:rotate(-7deg)}

/* Five Lodestone movements: five geological slabs, all linear and non-symbolic inside the playable cells. */
#game[data-visual-slice="lodestone"] #board[data-board-range="1"]{background:linear-gradient(145deg,#56616b,#3b4653)!important;border-color:#6d94a5!important}
#game[data-visual-slice="lodestone"] #board[data-board-range="1"] .cell{background:linear-gradient(145deg,#707a82,#59636e)!important}
#game[data-visual-slice="lodestone"] #board[data-board-range="2"]{background:linear-gradient(145deg,#52606c,#354554)!important;border-color:#6ca2b4!important}
#game[data-visual-slice="lodestone"] #board[data-board-range="2"] .cell{background:linear-gradient(145deg,#6a7782,#52616e)!important}
#game[data-visual-slice="lodestone"] #board[data-board-range="3"]{background:linear-gradient(145deg,#505b67,#323e4d)!important;border-color:#748ea9!important}
#game[data-visual-slice="lodestone"] #board[data-board-range="3"] .cell{background:linear-gradient(145deg,#65717c,#4d5b68)!important}
#game[data-visual-slice="lodestone"] #board[data-board-range="4"]{background:linear-gradient(145deg,#495560,#2d3946)!important;border-color:#667f9a!important}
#game[data-visual-slice="lodestone"] #board[data-board-range="4"] .cell{background:linear-gradient(145deg,#5e6a76,#465461)!important}
#game[data-visual-slice="lodestone"] #board[data-board-range="5"]{background:linear-gradient(145deg,#434f5b,#27333f)!important;border-color:#6a889b!important}
#game[data-visual-slice="lodestone"] #board[data-board-range="5"] .cell{background:linear-gradient(145deg,#576470,#414e5a)!important}

/* Chapter 3 reward: the stabilized anchor line and the old Waykeeper marker become one readable postcard. */
.chapter-three-reward .chapter-reward-kicker{color:#4c8292}
.lodestone-reward-postcard{background:linear-gradient(#152536 0 54%,#293a49 55% 100%);border-color:#5d7480}
.lodestone-reward-postcard:before{background:linear-gradient(#3b4854,#202d39)!important;box-shadow:inset 0 3px rgba(196,245,250,.06)!important}
.lodestone-reward-shelf{position:absolute;left:5%;right:5%;bottom:16%;height:31%;z-index:2;background:linear-gradient(160deg,#65717b,#394651);clip-path:polygon(0 28%,17% 4%,42% 17%,61% 0,100% 25%,92% 100%,8% 91%);box-shadow:0 7px 10px rgba(7,16,25,.28)}
.lodestone-reward-crystal{position:absolute;z-index:4;bottom:32%;width:18px;background:linear-gradient(150deg,#d0fbff,#66bfd1 67%,#5573a1);clip-path:polygon(50% 0,100% 72%,66% 100%,3% 84%,18% 29%);filter:drop-shadow(0 0 7px rgba(87,213,229,.42))}
.lodestone-reward-crystal.c1{left:15%;height:57px}.lodestone-reward-crystal.c2{left:25%;height:40px;transform:rotate(8deg);background:linear-gradient(150deg,#d8d1ff,#8378c0)}.lodestone-reward-crystal.c3{right:13%;height:49px;transform:rotate(-5deg)}
.lodestone-reward-marker{position:absolute;z-index:5;right:28%;bottom:26%;width:46px;height:61px;background:linear-gradient(145deg,#6c7880,#3d4852);clip-path:polygon(11% 0,90% 7%,100% 91%,14% 100%,0 16%);box-shadow:0 5px 8px rgba(8,17,25,.30)}
.lodestone-reward-marker:before{content:"";position:absolute;left:12px;top:10px;width:21px;height:21px;border:3px solid #91e5ed;border-radius:50%;box-shadow:0 0 8px rgba(91,211,225,.38)}
.lodestone-reward-marker:after{content:"";position:absolute;left:10px;bottom:12px;width:25px;height:3px;border-radius:3px;background:#cee9e9;box-shadow:0 7px rgba(206,233,233,.58),0 -7px rgba(206,233,233,.38);transform:rotate(-7deg)}
.lodestone-reward-anchor{position:absolute;z-index:6;left:48%;bottom:26%;width:31px;height:38px;border:4px solid #91e5ed;border-top-color:transparent;border-radius:0 0 18px 18px;filter:drop-shadow(0 0 6px rgba(91,211,225,.40))}
.lodestone-reward-anchor:before{content:"";position:absolute;left:10px;top:-11px;width:4px;height:31px;border-radius:3px;background:#91e5ed;box-shadow:-7px 7px 0 -1px #91e5ed,7px 7px 0 -1px #91e5ed}
.lodestone-reward-anchor:after{content:"";position:absolute;left:7px;top:-15px;width:9px;height:9px;border:3px solid #91e5ed;border-radius:50%}
.lodestone-reward-line{position:absolute;z-index:3;left:33%;bottom:30%;width:37%;height:4px;border-radius:999px;background:linear-gradient(90deg,rgba(115,219,231,.08),#77d6e2 24% 88%,rgba(119,214,226,.08));transform:rotate(-7deg);box-shadow:0 0 8px rgba(88,210,224,.30)}
'''
append_once('style400-production-slice.css','Pass 3 Chapter 3: Lodestone production family',lodestone_css)

# 4) Atlas movement-two old Waykeeper marker landmark.
atlas_css = r'''
/* Pass 3 Chapter 3 evidence landmark: Levels 111-120 surface an old Waykeeper marker before the maintenance-record reveal. */
.theme-ch3 .atlas-map.atlas-range-2 .atlas-scene em{right:8%;bottom:10%;width:54px;height:66px;background:linear-gradient(145deg,#64717a,#36424e);clip-path:polygon(11% 0,90% 7%,100% 91%,14% 100%,0 17%);box-shadow:0 7px 11px rgba(8,18,29,.30);opacity:.88;rotate:-4deg}
.theme-ch3 .atlas-map.atlas-range-2 .atlas-scene em:before{content:"";position:absolute;left:14px;top:12px;width:22px;height:22px;border:3px solid rgba(145,231,240,.85);border-radius:50%;box-shadow:0 0 9px rgba(87,213,229,.38)}
.theme-ch3 .atlas-map.atlas-range-2 .atlas-scene em:after{content:"";position:absolute;left:12px;bottom:13px;width:27px;height:3px;border-radius:3px;background:rgba(211,239,240,.74);box-shadow:0 7px rgba(211,239,240,.48),0 -7px rgba(211,239,240,.35);transform:rotate(-7deg)}
'''
append_once('style400-skyway-atlas.css','Pass 3 Chapter 3 evidence landmark',atlas_css)

# 5) Little Home anchor focus. Keep the canonical stage-3 prop and only add a non-blocking focus state.
p=Path('title-island-concepts/index.html')
s=p.read_text()
focus_marker='Chapter-three payoff focus'
if focus_marker in s:
    raise SystemExit('Chapter 3 home focus already present')
focus_css = r'''

/* Chapter-three payoff focus: the canonical restored anchor gets a short, non-blocking reveal beneath Little Home. */
#c2 .phone.story-focus-anchor .story-anchor{display:block;z-index:25;color:#47758a;animation:anchorRewardFocus 1800ms cubic-bezier(.2,.8,.2,1) both}
#c2 .phone.story-focus-anchor .story-anchor:before{content:"";position:absolute;left:-10px;top:-8px;width:52px;height:57px;border-radius:50%;border:3px solid rgba(135,227,238,.82);box-shadow:0 0 0 7px rgba(139,230,239,.13),0 0 19px rgba(83,206,223,.56);animation:anchorRewardHalo 1800ms ease-out both;pointer-events:none}
@keyframes anchorRewardFocus{0%{opacity:.25;transform:translateY(-8px) scale(.78)}28%{opacity:1;transform:translateY(1px) scale(1.16)}55%{transform:translateY(-1px) scale(.99)}100%{opacity:1;transform:none}}
@keyframes anchorRewardHalo{0%{opacity:0;scale:.55}28%{opacity:1;scale:1}100%{opacity:0;scale:1.24}}
@media(prefers-reduced-motion:reduce){#c2 .phone.story-focus-anchor .story-anchor,#c2 .phone.story-focus-anchor .story-anchor:before{animation:none!important}}
'''
pos=s.rfind('</style>')
if pos < 0:
    raise SystemExit('closing style tag missing from title island')
s=s[:pos]+focus_css+s[pos:]
s=s.replace("phone.classList.remove('story-focus-mailbox','story-focus-pennant');","phone.classList.remove('story-focus-mailbox','story-focus-pennant','story-focus-anchor');",1)
pennant_branch="if(e.data.focus==='pennant'){void phone.offsetWidth;phone.classList.add('story-focus-pennant');setTimeout(()=>phone.classList.remove('story-focus-pennant'),2200)}"
if pennant_branch not in s:
    raise SystemExit('pennant focus branch anchor missing')
s=s.replace(pennant_branch,pennant_branch+"if(e.data.focus==='anchor'){void phone.offsetWidth;phone.classList.add('story-focus-anchor');setTimeout(()=>phone.classList.remove('story-focus-anchor'),2200)}",1)
p.write_text(s)

# 6) Durable art direction records the marker shape so future slices reuse it consistently.
replace_once(
    'LEVEL_SELECT_ART_DIRECTION.md',
    "- Shape source: real fractured rock/crystal facets simplified into readable phone-scale polygons.\n",
    "- Shape source: real fractured rock/crystal facets simplified into readable phone-scale polygons.\n- Recurring landmark: an old Waykeeper marker slab with an offset cyan anchor-ring glyph and three pale chalk revision ticks; reuse this silhouette in Chapter 3 Atlas/reward surfaces so the maintenance evidence reads as one physical system.\n"
)

# 7) Cache only the changed runtime surfaces.
p=Path('index.html')
s=p.read_text()
repls={
    'style400-skyway-atlas.css?v=20260912-ch2pass3-1':'style400-skyway-atlas.css?v=20260912-ch3pass3-1',
    'style400-production-slice.css?v=20260912-ch2pass3-1':'style400-production-slice.css?v=20260912-ch3pass3-1',
    'title-island-concepts/?c=2&amp;embed=1&amp;v=20260912-ch2pass3-1':'title-island-concepts/?c=2&amp;embed=1&amp;v=20260912-ch3pass3-1',
    'game400-a.js?v=20260912-ch2pass3-1':'game400-a.js?v=20260912-ch3pass3-1',
    'game400-b.js?v=20260912-ch2pass3-1':'game400-b.js?v=20260912-ch3pass3-1',
}
for old,new in repls.items():
    if s.count(old)!=1:
        raise SystemExit(f'index cache anchor {old!r} count={s.count(old)}')
    s=s.replace(old,new,1)
p.write_text(s)

print('CHAPTER3_PASS3_CANDIDATE_APPLIED')
