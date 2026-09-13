from pathlib import Path


def replace_once(path, old, new):
    p=Path(path)
    s=p.read_text()
    if old not in s:
        raise SystemExit(f'anchor not found in {path}: {old[:160]!r}')
    if s.count(old) != 1:
        raise SystemExit(f'expected one anchor in {path}, found {s.count(old)}: {old[:160]!r}')
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
    "const VISUAL_CHAPTER_MODES={1:'sunpetal',2:'lanternwood',3:'lodestone',4:'masquerade'};",
    "const VISUAL_CHAPTER_MODES={1:'sunpetal',2:'lanternwood',3:'lodestone',4:'masquerade',5:'prism'};"
)

# 2) Dedicated Chapter 5 reward and routing.
reward_fn = r'''function showChapterFiveReward(stars,starRow,moveWord,lev){
 modal(`<section class="chapter-reward-card chapter-five-reward" aria-label="Prism Gardens reconnected on new coordinates"><div class="chapter-reward-kicker">New coordinates connected</div><h2>Little Home has a telescope</h2><div class="chapter-reward-postcard prism-reward-postcard" role="img" aria-label="A Prism Gardens glasshouse lookout and telescope trace a newly adjusted Skyway route toward two familiar amber porch lights"><i class="prism-reward-glasshouse"></i><i class="prism-reward-planter"></i><i class="prism-reward-petal p1"></i><i class="prism-reward-petal p2"></i><i class="prism-reward-petal p3"></i><i class="prism-reward-route"></i><i class="prism-reward-scope"></i><i class="prism-reward-lights"></i></div><p class="chapter-reward-result">Prism is connected again, not by forcing yesterday's map to fit, but by drawing the route around where the islands are now.</p><div class="win-stars chapter-reward-stars" aria-label="${stars} stars earned">${starRow}</div><div class="chapter-reward-score">${moveWord(movesUsed)} · Perfect route: ${moveWord(lev.optimal)}</div><div class="modal-actions"><button class="primary-small" id="chapterFiveRewardHome">Visit Little Home</button><button class="secondary-small" id="chapterFiveRewardContinue">Continue to Copperline</button></div></section>`);
 document.getElementById('chapterFiveRewardHome').onclick=()=>{closeModal();cancelAtlasReward();focusHomeReward('telescope')};
 document.getElementById('chapterFiveRewardContinue').onclick=()=>{closeModal();if(atlasRewardState&&atlasRewardState.from===250)playQueuedAtlasReward(true);else startLevel(251)}
}
'''
replace_once('game400-b.js','function winLevel(){',reward_fn+'function winLevel(){')
replace_once(
    'game400-b.js',
    "if(currentLevel===50){showChapterOneReward(stars,starRow,moveWord,lev);return}if(currentLevel===100){showChapterTwoReward(stars,starRow,moveWord,lev);return}if(currentLevel===150){showChapterThreeReward(stars,starRow,moveWord,lev);return}if(currentLevel===200){showChapterFourReward(stars,starRow,moveWord,lev);return}const storyMeta=",
    "if(currentLevel===50){showChapterOneReward(stars,starRow,moveWord,lev);return}if(currentLevel===100){showChapterTwoReward(stars,starRow,moveWord,lev);return}if(currentLevel===150){showChapterThreeReward(stars,starRow,moveWord,lev);return}if(currentLevel===200){showChapterFourReward(stars,starRow,moveWord,lev);return}if(currentLevel===250){showChapterFiveReward(stars,starRow,moveWord,lev);return}const storyMeta="
)

# 3) Prism production surfaces + chapter reward art.
prism_css = r'''
/* Pass 3 Chapter 5: Prism production family. Pale marble and greenhouse glass stay quiet in rule space; refracted light, petals and glasshouse ribs live outside it. */
#game[data-visual-slice="prism"] .board-wrap{background:radial-gradient(circle at 18% 16%,rgba(255,190,222,.17) 0 8%,transparent 23%),radial-gradient(circle at 83% 20%,rgba(134,225,237,.18) 0 10%,transparent 25%),linear-gradient(180deg,rgba(240,253,250,.10),rgba(102,146,154,.06));box-shadow:0 22px 44px rgba(45,91,101,.15)}
#game[data-visual-slice="prism"] #board{background:linear-gradient(145deg,#c8dcda,#94b7b6)!important;border:3px solid #7fa8a8!important;box-shadow:0 18px 34px rgba(43,82,91,.24),inset 0 2px rgba(255,255,255,.62),inset 0 0 0 5px rgba(214,242,239,.22)!important}
#game[data-visual-slice="prism"] #board .cell{background:linear-gradient(145deg,#e9efeb,#cfdedb)!important;border:1px solid rgba(93,130,131,.34)!important;border-radius:10px!important;box-shadow:inset 0 1px rgba(255,255,255,.70),inset 0 -2px rgba(73,111,114,.08)!important}
#game[data-visual-slice="prism"] #board .rock{background:linear-gradient(145deg,#e7e3df,#aaaeb2 62%,#7c878d)!important;filter:saturate(.55);box-shadow:inset 4px 5px rgba(255,255,255,.35),inset -4px -5px rgba(57,76,84,.14),0 5px 8px rgba(43,70,78,.20)!important}
#game[data-visual-slice="prism"] #board .nest{background:linear-gradient(145deg,#fbfffc,#e0eeeb)!important;border-width:3px!important;border-style:solid!important;box-shadow:inset 0 0 0 3px rgba(255,255,255,.60),0 3px 8px rgba(50,91,99,.18)!important}
#game[data-visual-slice="prism"] #board .gate.color{background:linear-gradient(145deg,rgba(250,255,255,.92),rgba(205,229,230,.78))!important;border:3px solid var(--gate-color)!important;box-shadow:0 0 0 2px rgba(255,255,255,.55),0 5px 10px rgba(48,88,96,.20),inset 0 1px rgba(255,255,255,.88)!important;filter:none!important}
#game[data-visual-slice="prism"] #board .gate.color span{background:var(--gate-color)!important;box-shadow:inset 0 0 0 4px rgba(255,255,255,.72),0 0 0 1px rgba(66,94,100,.16)!important}
#game[data-visual-slice="prism"] #board .gate.suit{background:linear-gradient(145deg,#f5f7f4,#d9e2df)!important;border:3px solid #65767d!important;box-shadow:0 5px 9px rgba(46,74,82,.18),inset 0 1px rgba(255,255,255,.72)!important}
#game[data-visual-slice="prism"] #board .gate.suit svg{fill:#263b4a!important}
#game[data-visual-slice="prism"] .theme-flourish.left{left:-4px;top:8%;width:70px;height:124px;opacity:.76;background:linear-gradient(90deg,transparent 0 11px,rgba(214,245,242,.82) 12px 17px,transparent 18px 33px,rgba(177,224,224,.72) 34px 39px,transparent 40px);border-top:5px solid rgba(201,238,235,.66);border-radius:48% 48% 0 0;filter:drop-shadow(0 7px 8px rgba(60,106,111,.12))}
#game[data-visual-slice="prism"] .theme-flourish.left:before{content:"";position:absolute;left:8px;top:17px;width:52px;height:67px;border:5px solid rgba(209,242,239,.70);border-bottom:0;border-radius:28px 28px 0 0}
#game[data-visual-slice="prism"] .theme-flourish.right{right:0;bottom:10%;width:68px;height:102px;opacity:.78;background:linear-gradient(145deg,transparent 0 42%,rgba(116,190,183,.22) 43% 100%);filter:drop-shadow(0 6px 7px rgba(57,101,105,.12))}
#game[data-visual-slice="prism"] .theme-flourish.right:before{content:"";position:absolute;right:5px;top:8px;width:46px;height:46px;background:linear-gradient(145deg,rgba(248,166,205,.74),rgba(255,224,161,.60));clip-path:polygon(50% 0,64% 35%,100% 26%,73% 53%,100% 78%,62% 69%,50% 100%,39% 69%,0 80%,27% 53%,0 27%,36% 35%)}
#game[data-visual-slice="prism"] .theme-flourish.right:after{content:"";position:absolute;right:17px;bottom:8px;width:39px;height:31px;border-radius:8px 8px 13px 13px;background:linear-gradient(145deg,rgba(212,239,235,.88),rgba(126,181,180,.64));border:2px solid rgba(99,150,151,.46)}

/* Five Prism movements: quiet marble/glass shifts only; color identity remains on the gate fixture rather than the floor. */
#game[data-visual-slice="prism"] #board[data-board-range="1"]{background:linear-gradient(145deg,#c8dcda,#94b7b6)!important;border-color:#7fa8a8!important}
#game[data-visual-slice="prism"] #board[data-board-range="1"] .cell{background:linear-gradient(145deg,#e9efeb,#cfdedb)!important}
#game[data-visual-slice="prism"] #board[data-board-range="2"]{background:linear-gradient(145deg,#c4dbd7,#8fb5b5)!important;border-color:#79aaa5!important}
#game[data-visual-slice="prism"] #board[data-board-range="2"] .cell{background:linear-gradient(145deg,#e7f0ec,#c9ddda)!important}
#game[data-visual-slice="prism"] #board[data-board-range="3"]{background:linear-gradient(145deg,#bfd8d7,#8aaeb5)!important;border-color:#799da9!important}
#game[data-visual-slice="prism"] #board[data-board-range="3"] .cell{background:linear-gradient(145deg,#e6efee,#c7d9de)!important}
#game[data-visual-slice="prism"] #board[data-board-range="4"]{background:linear-gradient(145deg,#c3d3d8,#969fba)!important;border-color:#8d91b2!important}
#game[data-visual-slice="prism"] #board[data-board-range="4"] .cell{background:linear-gradient(145deg,#ebecef,#d0d1df)!important}
#game[data-visual-slice="prism"] #board[data-board-range="5"]{background:linear-gradient(145deg,#c9d5d1,#9cb6a6)!important;border-color:#88a596!important}
#game[data-visual-slice="prism"] #board[data-board-range="5"] .cell{background:linear-gradient(145deg,#eef0e9,#d5ddd1)!important}

/* Chapter 5 reward: present-day coordinates, the Prism lookout and the familiar Lanternwood lights share one view. */
.chapter-five-reward .chapter-reward-kicker{color:#587f86}
.prism-reward-postcard{background:linear-gradient(#bfe4e4 0 56%,#7da7a4 57% 100%);border-color:#7ea8a6}
.prism-reward-postcard:before{background:linear-gradient(145deg,#e8efeb,#a9c7c3)!important;box-shadow:inset 0 3px rgba(255,255,255,.42)!important}
.prism-reward-glasshouse{position:absolute;left:10%;bottom:16%;width:110px;height:90px;z-index:3;border:8px solid rgba(229,250,247,.82);border-bottom:0;border-radius:56px 56px 0 0;box-shadow:inset 0 0 0 2px rgba(112,175,178,.18),0 6px 9px rgba(53,94,100,.15)}
.prism-reward-glasshouse:before{content:"";position:absolute;left:47px;top:-4px;width:5px;height:82px;background:rgba(204,241,239,.70);box-shadow:-34px 15px 0 -1px rgba(204,241,239,.44),34px 15px 0 -1px rgba(204,241,239,.44)}
.prism-reward-planter{position:absolute;left:22%;bottom:16%;width:62px;height:27px;z-index:5;border-radius:7px 7px 16px 16px;background:linear-gradient(145deg,#dceae7,#88b2ae);border:2px solid rgba(91,147,145,.52)}
.prism-reward-petal{position:absolute;z-index:6;width:27px;height:35px;border-radius:55% 55% 45% 45%;transform-origin:50% 100%;opacity:.82}.prism-reward-petal.p1{left:24%;bottom:27%;background:linear-gradient(#ffb7d6,#e78fb9);transform:rotate(-24deg)}.prism-reward-petal.p2{left:31%;bottom:29%;background:linear-gradient(#ffe099,#d9b85c)}.prism-reward-petal.p3{left:38%;bottom:27%;background:linear-gradient(#a9dce5,#72b6c6);transform:rotate(24deg)}
.prism-reward-route{position:absolute;z-index:4;left:43%;bottom:32%;width:43%;height:5px;border-radius:999px;background:linear-gradient(90deg,#efffff,#9edfe1 32%,#f4c0df 61%,#f7d985);transform:rotate(-10deg);box-shadow:0 0 8px rgba(236,249,225,.55)}
.prism-reward-scope{position:absolute;z-index:7;left:48%;bottom:43%;width:61px;height:13px;border-radius:10px;background:linear-gradient(90deg,#d9ae64 0 61%,#607d82 62% 100%);transform:rotate(-14deg);box-shadow:0 4px 6px rgba(47,78,83,.18)}
.prism-reward-scope:before{content:"";position:absolute;left:29px;top:10px;width:4px;height:45px;background:#795a3b;box-shadow:-13px 30px 0 -1px #795a3b,13px 30px 0 -1px #795a3b;transform-origin:top}
.prism-reward-lights{position:absolute;z-index:8;right:11%;top:31%;width:8px;height:8px;border-radius:50%;background:#ffc66c;box-shadow:16px 1px 0 #ffc66c,0 0 11px rgba(255,181,82,.84),16px 1px 11px rgba(255,181,82,.84)}
'''
append_once('style400-production-slice.css','Pass 3 Chapter 5: Prism production family',prism_css)

# 4) Movement-3 Atlas evidence landmark.
atlas_css = r'''
/* Pass 3 Chapter 5 continuity landmark: Levels 221-230 use a Prism glasshouse lookout and scope aimed at the same twin amber porch lights from Lanternwood. */
.theme-ch5 .atlas-map.atlas-range-3 .atlas-scene em{left:7%;bottom:10%;width:82px;height:69px;border:8px solid rgba(224,250,246,.82);border-bottom:0;border-radius:42px 42px 0 0;background:linear-gradient(180deg,rgba(184,235,232,.20),rgba(80,141,148,.16));box-shadow:0 7px 12px rgba(51,99,106,.17),inset 0 0 0 2px rgba(103,181,183,.12);opacity:.96;rotate:0deg}
.theme-ch5 .atlas-map.atlas-range-3 .atlas-scene em:before{content:"";position:absolute;left:25px;top:24px;width:39px;height:8px;border-radius:7px;background:linear-gradient(90deg,#d8a95f 0 62%,#58777c 63% 100%);transform:rotate(-15deg);box-shadow:0 3px 4px rgba(51,88,94,.18)}
.theme-ch5 .atlas-map.atlas-range-3 .atlas-scene em:after{content:"";position:absolute;right:-48px;top:20px;width:7px;height:7px;border-radius:50%;background:#ffc66a;box-shadow:14px 1px 0 #ffc66a,0 0 9px rgba(255,181,79,.78),14px 1px 9px rgba(255,181,79,.78)}
'''
append_once('style400-skyway-atlas.css','Pass 3 Chapter 5 continuity landmark',atlas_css)

# 5) Little Home telescope focus. Reuse the canonical stage-5 prop.
p=Path('title-island-concepts/index.html')
s=p.read_text()
focus_marker='Chapter-five payoff focus'
if focus_marker in s:
    raise SystemExit('Chapter 5 home focus already present')
focus_css = r'''
/* Chapter-five payoff focus: the canonical telescope becomes the visible Little Home consequence. */
#c2 .phone.story-focus-telescope .story-telescope{display:block;z-index:25;filter:drop-shadow(0 0 7px rgba(98,202,210,.90)) drop-shadow(0 0 13px rgba(244,195,105,.48));animation:telescopeRewardFocus 1800ms cubic-bezier(.2,.8,.2,1) both}
@keyframes telescopeRewardFocus{0%{opacity:.25;transform:rotate(-16deg) translateY(-6px) scale(.78)}28%{opacity:1;transform:rotate(-16deg) translateY(1px) scale(1.18)}55%{transform:rotate(-16deg) translateY(-1px) scale(1.01)}100%{opacity:1;transform:rotate(-16deg) scale(1)}}
@media(prefers-reduced-motion:reduce){#c2 .phone.story-focus-telescope .story-telescope{animation:none!important;filter:drop-shadow(0 0 7px rgba(98,202,210,.90)) drop-shadow(0 0 13px rgba(244,195,105,.48))}}
'''
idx=s.rfind('</style>')
if idx<0:raise SystemExit('style close missing in Little Home')
s=s[:idx]+"\n"+focus_css+s[idx:]
old_remove="phone.classList.remove('story-focus-mailbox','story-focus-pennant','story-focus-anchor','story-focus-bunting');"
new_remove="phone.classList.remove('story-focus-mailbox','story-focus-pennant','story-focus-anchor','story-focus-bunting','story-focus-telescope');"
if s.count(old_remove)!=1:raise SystemExit(f'home focus remove anchor count={s.count(old_remove)}')
s=s.replace(old_remove,new_remove,1)
old_bunting="if(e.data.focus==='bunting'){void phone.offsetWidth;phone.classList.add('story-focus-bunting');setTimeout(()=>phone.classList.remove('story-focus-bunting'),2200)}"
new_bunting=old_bunting+"if(e.data.focus==='telescope'){void phone.offsetWidth;phone.classList.add('story-focus-telescope');setTimeout(()=>phone.classList.remove('story-focus-telescope'),2200)}"
if s.count(old_bunting)!=1:raise SystemExit(f'home bunting focus anchor count={s.count(old_bunting)}')
s=s.replace(old_bunting,new_bunting,1)
p.write_text(s)

# 6) Durable art-direction continuity note.
replace_once(
    'LEVEL_SELECT_ART_DIRECTION.md',
    "- Shape source: greenhouse arches and radial flower forms, stylized rather than photo-real.\n\n### 6. Copperline Junction",
    "- Shape source: greenhouse arches and radial flower forms, stylized rather than photo-real.\n- Recurring landmark: a small glasshouse lookout / sighting arch with a compact brass scope aimed toward two distant amber lights; reuse it in Chapter 5 movement 3 and the Level 250 reward so Prism's wider view visibly reconnects to the familiar Lanternwood porch established earlier.\n\n### 6. Copperline Junction"
)

# 7) Cache freshness for changed production surfaces.
p=Path('index.html')
s=p.read_text()
repls={
    'style400-skyway-atlas.css?v=20260912-ch4pass3-1':'style400-skyway-atlas.css?v=20260912-ch5pass3-1',
    'style400-production-slice.css?v=20260912-ch4pass3-1':'style400-production-slice.css?v=20260912-ch5pass3-1',
    'title-island-concepts/?c=2&amp;embed=1&amp;v=20260912-ch4pass3-1':'title-island-concepts/?c=2&amp;embed=1&amp;v=20260912-ch5pass3-1',
    'game400-a.js?v=20260912-ch4pass3-1':'game400-a.js?v=20260912-ch5pass3-1',
    'game400-b.js?v=20260912-ch4pass3-1':'game400-b.js?v=20260912-ch5pass3-1',
}
for old,new in repls.items():
    if s.count(old)!=1:raise SystemExit(f'cache anchor {old} count={s.count(old)}')
    s=s.replace(old,new,1)
p.write_text(s)

print('CHAPTER5_PASS3_PATCH_APPLIED')
