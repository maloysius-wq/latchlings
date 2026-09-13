from pathlib import Path


def replace_once(path, old, new):
    p=Path(path)
    s=p.read_text()
    if old not in s:
        raise SystemExit(f'anchor not found in {path}: {old[:140]!r}')
    if s.count(old) != 1:
        raise SystemExit(f'expected one anchor in {path}, found {s.count(old)}: {old[:140]!r}')
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
    "const VISUAL_CHAPTER_MODES={1:'sunpetal',2:'lanternwood',3:'lodestone'};",
    "const VISUAL_CHAPTER_MODES={1:'sunpetal',2:'lanternwood',3:'lodestone',4:'masquerade'};"
)

# 2) Dedicated Chapter 4 reward and routing.
reward_fn = r'''function showChapterFourReward(stars,starRow,moveWord,lev){
 modal(`<section class="chapter-reward-card chapter-four-reward" aria-label="Masquerade Keep Market Day restored"><div class="chapter-reward-kicker">Market Day saved</div><h2>Little Home has market bunting</h2><div class="chapter-reward-postcard masquerade-reward-postcard" role="img" aria-label="Masquerade Keep's old civic suit gate stands open above a restored market route and celebratory bunting"><i class="masquerade-reward-wall"></i><i class="masquerade-reward-arch"></i><i class="masquerade-reward-plaque spade"></i><i class="masquerade-reward-plaque diamond"></i><i class="masquerade-reward-plaque club"></i><i class="masquerade-reward-plaque heart"></i><i class="masquerade-reward-banner"></i><i class="masquerade-reward-stall s1"></i><i class="masquerade-reward-stall s2"></i><i class="masquerade-reward-route"></i><i class="masquerade-reward-bunting"></i></div><p class="chapter-reward-result">Market Day is moving again. The old suit-mark lanes are working as civic routes, and the community is sharing the records behind them.</p><div class="win-stars chapter-reward-stars" aria-label="${stars} stars earned">${starRow}</div><div class="chapter-reward-score">${moveWord(movesUsed)} · Perfect route: ${moveWord(lev.optimal)}</div><div class="modal-actions"><button class="primary-small" id="chapterFourRewardHome">Visit Little Home</button><button class="secondary-small" id="chapterFourRewardContinue">Continue to Prism</button></div></section>`);
 document.getElementById('chapterFourRewardHome').onclick=()=>{closeModal();cancelAtlasReward();focusHomeReward('bunting')};
 document.getElementById('chapterFourRewardContinue').onclick=()=>{closeModal();if(atlasRewardState&&atlasRewardState.from===200)playQueuedAtlasReward(true);else startLevel(201)}
}
'''
replace_once('game400-b.js','function winLevel(){',reward_fn+'function winLevel(){')
replace_once(
    'game400-b.js',
    "if(currentLevel===50){showChapterOneReward(stars,starRow,moveWord,lev);return}if(currentLevel===100){showChapterTwoReward(stars,starRow,moveWord,lev);return}if(currentLevel===150){showChapterThreeReward(stars,starRow,moveWord,lev);return}const storyMeta=",
    "if(currentLevel===50){showChapterOneReward(stars,starRow,moveWord,lev);return}if(currentLevel===100){showChapterTwoReward(stars,starRow,moveWord,lev);return}if(currentLevel===150){showChapterThreeReward(stars,starRow,moveWord,lev);return}if(currentLevel===200){showChapterFourReward(stars,starRow,moveWord,lev);return}const storyMeta="
)

# 3) Masquerade production surfaces + chapter reward art.
masquerade_css = r'''
/* Pass 3 Chapter 4: Masquerade production family. Moonlit plaster stays quiet in rule space; arches, parapets and market cloth carry place identity outside it. */
#game[data-visual-slice="masquerade"] .board-wrap{background:radial-gradient(circle at 74% 11%,rgba(246,232,255,.18) 0 8%,transparent 22%),radial-gradient(ellipse at 50% 48%,rgba(194,151,205,.10) 0 39%,rgba(42,31,55,.13) 65%,transparent 78%);box-shadow:0 23px 44px rgba(28,20,39,.19)}
#game[data-visual-slice="masquerade"] #board{background:linear-gradient(145deg,#625966,#443d4d)!important;border:3px solid #9f8466!important;box-shadow:0 18px 36px rgba(28,20,39,.34),inset 0 2px rgba(255,244,235,.18),inset 0 0 0 5px rgba(117,89,116,.14)!important}
#game[data-visual-slice="masquerade"] #board .cell{background:linear-gradient(145deg,#8c8389,#716a76)!important;border:1px solid rgba(62,49,65,.42)!important;border-radius:9px!important;box-shadow:inset 0 1px rgba(255,244,238,.16),inset 0 -2px rgba(42,31,47,.14)!important}
#game[data-visual-slice="masquerade"] #board .rock{background:linear-gradient(145deg,#9d9693,#645d63 62%,#49424d)!important;filter:saturate(.48);box-shadow:inset 4px 5px rgba(255,255,255,.12),inset -4px -5px rgba(31,24,34,.22),0 5px 8px rgba(25,18,31,.28)!important}
#game[data-visual-slice="masquerade"] #board .nest{background:linear-gradient(145deg,#f3ebe2,#d8ccc7)!important;border-width:3px!important;border-style:solid!important;box-shadow:inset 0 0 0 3px rgba(255,255,255,.34),0 3px 8px rgba(34,25,38,.23)!important}
#game[data-visual-slice="masquerade"] #board .gate.suit{background:linear-gradient(145deg,#f0e7e1,#cabcb6)!important;border:3px solid #a7834e!important;box-shadow:0 0 0 2px rgba(255,244,220,.28),0 5px 10px rgba(30,21,36,.30),inset 0 1px rgba(255,255,255,.58)!important;filter:none!important}
#game[data-visual-slice="masquerade"] #board .gate.suit svg{fill:#241d2f!important;filter:drop-shadow(0 1px rgba(255,255,255,.18))}
#game[data-visual-slice="masquerade"] .theme-flourish.left{left:-3px;top:9%;width:62px;height:116px;opacity:.67;background:linear-gradient(145deg,#756776,#4b4051);clip-path:polygon(0 100%,0 22%,12% 22%,12% 7%,28% 7%,28% 22%,47% 22%,47% 2%,64% 2%,64% 22%,82% 22%,82% 10%,100% 10%,100% 100%);filter:drop-shadow(0 7px 8px rgba(31,22,39,.20))}
#game[data-visual-slice="masquerade"] .theme-flourish.left:before{content:"";position:absolute;left:21px;top:45px;width:20px;height:37px;border:4px solid rgba(228,209,216,.50);border-bottom:0;border-radius:13px 13px 0 0;background:rgba(33,25,42,.20)}
#game[data-visual-slice="masquerade"] .theme-flourish.right{right:2px;bottom:11%;width:58px;height:105px;opacity:.72;background:linear-gradient(90deg,transparent 0 42px,#8d754f 43px 47px,transparent 48px);filter:drop-shadow(0 5px 7px rgba(34,23,38,.16))}
#game[data-visual-slice="masquerade"] .theme-flourish.right:before{content:"";position:absolute;right:11px;top:17px;width:41px;height:18px;background:linear-gradient(90deg,#d7838d,#b26778);clip-path:polygon(0 0,100% 10%,78% 55%,100% 100%,0 84%);box-shadow:0 2px 3px rgba(40,27,42,.20)}
#game[data-visual-slice="masquerade"] .theme-flourish.right:after{content:"";position:absolute;right:19px;top:53px;width:26px;height:10px;background:#d1a85c;clip-path:polygon(0 0,100% 10%,70% 100%,0 79%);box-shadow:0 19px 0 -1px #8e6ea2}

/* Five Masquerade movements: quiet plaster/stone shifts only; civic symbols remain fixtures, never floor marks. */
#game[data-visual-slice="masquerade"] #board[data-board-range="1"]{background:linear-gradient(145deg,#625966,#443d4d)!important;border-color:#9f8466!important}
#game[data-visual-slice="masquerade"] #board[data-board-range="1"] .cell{background:linear-gradient(145deg,#8c8389,#716a76)!important}
#game[data-visual-slice="masquerade"] #board[data-board-range="2"]{background:linear-gradient(145deg,#5f5563,#413849)!important;border-color:#a48760!important}
#game[data-visual-slice="masquerade"] #board[data-board-range="2"] .cell{background:linear-gradient(145deg,#887d84,#6c6370)!important}
#game[data-visual-slice="masquerade"] #board[data-board-range="3"]{background:linear-gradient(145deg,#5a505f,#3d3547)!important;border-color:#aa895d!important}
#game[data-visual-slice="masquerade"] #board[data-board-range="3"] .cell{background:linear-gradient(145deg,#82767f,#665d6b)!important}
#game[data-visual-slice="masquerade"] #board[data-board-range="4"]{background:linear-gradient(145deg,#544b5b,#372f42)!important;border-color:#a47d59!important}
#game[data-visual-slice="masquerade"] #board[data-board-range="4"] .cell{background:linear-gradient(145deg,#7b7079,#5f5665)!important}
#game[data-visual-slice="masquerade"] #board[data-board-range="5"]{background:linear-gradient(145deg,#514757,#332b3d)!important;border-color:#af8d5d!important}
#game[data-visual-slice="masquerade"] #board[data-board-range="5"] .cell{background:linear-gradient(145deg,#766a74,#594f60)!important}

/* Chapter 4 reward: old civic routing and the living market share one gate again. */
.chapter-four-reward .chapter-reward-kicker{color:#8b5e72}
.masquerade-reward-postcard{background:linear-gradient(#21182f 0 54%,#4e4054 55% 100%);border-color:#8e735f}
.masquerade-reward-postcard:before{background:linear-gradient(#6e6269,#463b48)!important;box-shadow:inset 0 3px rgba(255,236,223,.07)!important}
.masquerade-reward-wall{position:absolute;left:5%;right:5%;bottom:15%;height:38%;z-index:2;background:linear-gradient(145deg,#988d8c,#655b65);clip-path:polygon(0 16%,10% 16%,10% 0,22% 0,22% 16%,36% 16%,36% 4%,49% 4%,49% 16%,64% 16%,64% 0,77% 0,77% 16%,90% 16%,90% 6%,100% 6%,100% 100%,0 100%);box-shadow:0 7px 10px rgba(28,18,31,.26)}
.masquerade-reward-arch{position:absolute;z-index:4;left:40%;bottom:18%;width:70px;height:74px;border:10px solid #c8bab2;border-bottom:0;border-radius:35px 35px 0 0;background:#281f31;box-shadow:0 5px 8px rgba(27,18,31,.28),inset 0 0 0 3px rgba(255,242,224,.10)}
.masquerade-reward-plaque{position:absolute;z-index:6;width:18px;height:18px;border-radius:5px;background:linear-gradient(#efe6df,#c9bbb3);border:2px solid #9b7d50;display:grid;place-items:center;color:#241d2f;font-style:normal;font-family:Georgia,serif;font-size:12px;font-weight:900;line-height:1}
.masquerade-reward-plaque:after{display:block}.masquerade-reward-plaque.spade{left:41%;bottom:49%}.masquerade-reward-plaque.diamond{left:48%;bottom:58%}.masquerade-reward-plaque.club{left:56%;bottom:58%}.masquerade-reward-plaque.heart{left:63%;bottom:49%}
.masquerade-reward-plaque.spade:after{content:"♠"}.masquerade-reward-plaque.diamond:after{content:"♦"}.masquerade-reward-plaque.club:after{content:"♣"}.masquerade-reward-plaque.heart:after{content:"♥"}
.masquerade-reward-banner{position:absolute;z-index:7;left:37%;bottom:70%;width:85px;height:18px;background:linear-gradient(90deg,#d98792,#b35f74);clip-path:polygon(0 0,100% 7%,82% 52%,100% 100%,0 84%);filter:drop-shadow(0 3px 3px rgba(30,18,31,.22))}
.masquerade-reward-stall{position:absolute;z-index:4;bottom:19%;width:45px;height:39px;background:linear-gradient(#8e684b,#67493c);box-shadow:0 4px 7px rgba(28,18,31,.22)}
.masquerade-reward-stall:before{content:"";position:absolute;left:-4px;right:-4px;top:-10px;height:14px;background:linear-gradient(90deg,#d7a250 0 25%,#f1d48b 25% 50%,#b97782 50% 75%,#ead39d 75%);clip-path:polygon(0 0,100% 0,92% 100%,8% 100%)}
.masquerade-reward-stall.s1{left:12%}.masquerade-reward-stall.s2{right:8%;transform:scale(.88)}
.masquerade-reward-route{position:absolute;z-index:3;left:18%;bottom:25%;width:62%;height:4px;border-radius:999px;background:linear-gradient(90deg,rgba(233,194,107,.08),#dfb75f 22% 88%,rgba(223,183,95,.08));transform:rotate(-4deg);box-shadow:0 0 7px rgba(221,178,83,.28)}
.masquerade-reward-bunting{position:absolute;z-index:8;left:12%;right:10%;top:19%;height:22px;border-top:2px solid rgba(228,197,132,.72)}
.masquerade-reward-bunting:after{content:"";position:absolute;left:5px;top:-1px;width:10px;height:12px;background:#dd8290;clip-path:polygon(0 0,100% 0,50% 100%);box-shadow:28px 2px 0 #e7bc62,56px 4px 0 #8f73a6,84px 5px 0 #d98792,112px 4px 0 #e7bc62,140px 2px 0 #8f73a6}
'''
append_once('style400-production-slice.css','Pass 3 Chapter 4: Masquerade production family',masquerade_css)

# 4) Atlas movement-three old civic suit-gate landmark.
atlas_css = r'''
/* Pass 3 Chapter 4 evidence landmark: Levels 171-180 reveal an old civic suit gate underneath the living market dress. */
.theme-ch4 .atlas-map.atlas-range-3 .atlas-scene em{left:8%;bottom:10%;width:76px;height:72px;border:10px solid rgba(201,188,186,.82);border-bottom:0;border-radius:38px 38px 0 0;background:linear-gradient(180deg,rgba(225,128,145,.34) 0 12%,rgba(38,28,48,.28) 12% 100%);box-shadow:0 7px 12px rgba(22,15,29,.26);opacity:.94;rotate:0deg}
.theme-ch4 .atlas-map.atlas-range-3 .atlas-scene em:before{content:"♠  ♦  ♣  ♥";position:absolute;left:-7px;right:-7px;top:20px;height:18px;padding:2px 3px;border-radius:5px;background:rgba(226,216,211,.88);border:1px solid rgba(141,113,82,.72);color:#241d2f;font-family:Georgia,serif;font-size:10px;font-weight:900;letter-spacing:2px;text-align:center;line-height:13px;box-shadow:0 2px 4px rgba(28,19,33,.18)}
.theme-ch4 .atlas-map.atlas-range-3 .atlas-scene em:after{content:"";position:absolute;right:-15px;top:-7px;width:47px;height:17px;background:linear-gradient(90deg,#d98390,#ad6073);clip-path:polygon(0 0,100% 10%,78% 54%,100% 100%,0 84%);filter:drop-shadow(0 2px 2px rgba(30,20,34,.18))}
'''
append_once('style400-skyway-atlas.css','Pass 3 Chapter 4 evidence landmark',atlas_css)

# 5) Little Home bunting focus. Keep the canonical stage-4 prop and add a non-blocking focus state.
p=Path('title-island-concepts/index.html')
s=p.read_text()
focus_marker='Chapter-four payoff focus'
if focus_marker in s:
    raise SystemExit('Chapter 4 home focus already present')
focus_css = r'''

/* Chapter-four payoff focus: the canonical market bunting gets a short, non-blocking celebration above Little Home. */
#c2 .phone.story-focus-bunting .story-bunting{display:block;z-index:25;animation:buntingRewardFocus 1800ms cubic-bezier(.2,.8,.2,1) both}
#c2 .phone.story-focus-bunting .story-bunting:before{content:"";position:absolute;left:-10px;top:-12px;width:111px;height:39px;border-radius:20px;border:3px solid rgba(226,174,96,.78);box-shadow:0 0 0 7px rgba(235,195,119,.13),0 0 18px rgba(208,142,77,.43);animation:buntingRewardHalo 1800ms ease-out both;pointer-events:none}
@keyframes buntingRewardFocus{0%{opacity:.25;transform:translateY(-7px) rotate(-2deg) scale(.82)}28%{opacity:1;transform:translateY(1px) rotate(2deg) scale(1.10)}55%{transform:translateY(-1px) rotate(0deg) scale(.99)}100%{opacity:1;transform:rotate(4deg)}}
@keyframes buntingRewardHalo{0%{opacity:0;scale:.62}28%{opacity:1;scale:1}100%{opacity:0;scale:1.16}}
@media(prefers-reduced-motion:reduce){#c2 .phone.story-focus-bunting .story-bunting,#c2 .phone.story-focus-bunting .story-bunting:before{animation:none!important}}
'''
pos=s.rfind('</style>')
if pos < 0:
    raise SystemExit('closing style tag missing from title island')
s=s[:pos]+focus_css+s[pos:]
s=s.replace("phone.classList.remove('story-focus-mailbox','story-focus-pennant','story-focus-anchor');","phone.classList.remove('story-focus-mailbox','story-focus-pennant','story-focus-anchor','story-focus-bunting');",1)
anchor_branch="if(e.data.focus==='anchor'){void phone.offsetWidth;phone.classList.add('story-focus-anchor');setTimeout(()=>phone.classList.remove('story-focus-anchor'),2200)}"
if anchor_branch not in s:
    raise SystemExit('anchor focus branch missing')
s=s.replace(anchor_branch,anchor_branch+"if(e.data.focus==='bunting'){void phone.offsetWidth;phone.classList.add('story-focus-bunting');setTimeout(()=>phone.classList.remove('story-focus-bunting'),2200)}",1)
p.write_text(s)

# 6) Durable art direction records the civic arch landmark.
replace_once(
    'LEVEL_SELECT_ART_DIRECTION.md',
    "- Shape source: simple masonry arches, battlements and cloth pennants translated into the game's rounded storybook proportions.\n",
    "- Shape source: simple masonry arches, battlements and cloth pennants translated into the game's rounded storybook proportions.\n- Recurring landmark: a rounded old civic gate arch with four worn black suit plaques beneath newer rose-and-gold market cloth; reuse it in Chapter 4 Atlas/reward surfaces so the market visibly sits on older Skyway infrastructure.\n"
)

# 7) Cache only the changed runtime surfaces.
p=Path('index.html')
s=p.read_text()
repls={
    'style400-skyway-atlas.css?v=20260912-ch3pass3-1':'style400-skyway-atlas.css?v=20260912-ch4pass3-1',
    'style400-production-slice.css?v=20260912-ch3pass3-1':'style400-production-slice.css?v=20260912-ch4pass3-1',
    'title-island-concepts/?c=2&amp;embed=1&amp;v=20260912-ch3pass3-1':'title-island-concepts/?c=2&amp;embed=1&amp;v=20260912-ch4pass3-1',
    'game400-a.js?v=20260912-ch3pass3-1':'game400-a.js?v=20260912-ch4pass3-1',
    'game400-b.js?v=20260912-ch3pass3-1':'game400-b.js?v=20260912-ch4pass3-1',
}
for old,new in repls.items():
    if s.count(old)!=1:
        raise SystemExit(f'index cache anchor {old!r} count={s.count(old)}')
    s=s.replace(old,new,1)
p.write_text(s)

print('CHAPTER4_PASS3_CANDIDATE_APPLIED')
