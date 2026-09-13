from pathlib import Path


def replace_once(path, old, new):
    p = Path(path)
    s = p.read_text()
    count = s.count(old)
    if count != 1:
        raise SystemExit(f'{path}: expected exactly one match, found {count}: {old[:120]!r}')
    p.write_text(s.replace(old, new, 1))


def append_once(path, marker, block):
    p = Path(path)
    s = p.read_text()
    if marker in s:
        raise SystemExit(f'{path}: marker already present: {marker}')
    p.write_text(s.rstrip() + '\n\n' + block.strip() + '\n')

# Chapter-aware production mode.
replace_once(
    'game400-a.js',
    "const VISUAL_CHAPTER_MODES={1:'sunpetal'};",
    "const VISUAL_CHAPTER_MODES={1:'sunpetal',2:'lanternwood'};"
)

# Chapter 2 relationship continuity: one recurring visual identifier, not a new core-cast dependency.
replace_once(
    'story400.js',
    "Pip and Tansy make friends on an island that had nearly drifted out of easy reach.",
    "Pip and Tansy make friends at a small porch marked by twin amber lanterns on an island that had nearly drifted out of easy reach."
)
replace_once(
    'story400.js',
    "A porch light is waiting to be delivered before the grove gets properly dark.",
    "A matching pair of amber porch lanterns is waiting to be delivered before the grove gets properly dark."
)
replace_once(
    'story400.js',
    "Tansy worries about friends in Lanternwood. The household stops talking about route efficiency and starts talking about staying connected.",
    "Tansy spots the same twin amber lanterns on the Lanternwood porch. The household stops talking about route efficiency and starts talking about staying connected."
)
replace_once(
    'story400.js',
    "Tansy can still see a friend’s porch. She would very much like to keep it reachable too.",
    "Tansy can still see the twin amber lanterns on a friend’s porch. She would very much like to keep it reachable too."
)

replace_once(
    'story-grounding400.js',
    "Pip and Tansy make friends on an island that nearly drifted out of easy visiting range.",
    "Pip and Tansy make friends at a small porch marked by twin amber lanterns on an island that nearly drifted out of easy visiting range."
)
replace_once(
    'story-grounding400.js',
    "Tansy can still see a Lanternwood friend’s porch through the telescope.",
    "Tansy can still see the same twin amber lanterns on a Lanternwood friend’s porch through the telescope."
)

replace_once(
    'STORY_BIBLE.md',
    "The chapter turns the core stopper mechanic into a social idea: sometimes the route works because another person is there.\n",
    "The chapter turns the core stopper mechanic into a social idea: sometimes the route works because another person is there.\n\nA small neighbor porch with **twin amber lanterns** becomes the chapter's recurring relationship landmark. Pip and Tansy recognize it here first; when the porch returns in the later telescope story, the same paired lights should make the place recognizable before dialogue explains it.\n"
)
replace_once(
    'STORY_BIBLE.md',
    "- **30:** Pip and Tansy make friends on an island that nearly drifted out of easy reach.",
    "- **30:** Pip and Tansy make friends at a small porch with twin amber lanterns on an island that nearly drifted out of easy reach."
)
replace_once(
    'STORY_BIBLE.md',
    "- **30:** Tansy worries about friends in Lanternwood; the abstract problem becomes personal.",
    "- **30:** Tansy spots the same twin amber lanterns on the Lanternwood porch; the abstract problem becomes personal."
)

# Make the established Lanternwood landmark survive into the later Familiar Porch scene.
replace_once(
    'cinematics400.js',
    '<i class="porch-house"></i><i class="porch-deck"></i></div>',
    '<i class="porch-house"></i><i class="porch-deck"></i><i class="porch-friend-lantern l1"></i><i class="porch-friend-lantern l2"></i></div>'
)

# Dedicated Chapter 2 reward + canonical Little Home pennant action.
reward2 = r'''function showChapterTwoReward(stars,starRow,moveWord,lev){
 modal(`<section class="chapter-reward-card chapter-two-reward" aria-label="Lanternwood Grove reconnected"><div class="chapter-reward-kicker">Lanternwood connected</div><h2>Little Home has a visitor pennant</h2><div class="chapter-reward-postcard lanternwood-reward-postcard" role="img" aria-label="A restored route reaches a Lanternwood porch with twin amber lanterns while a visitor pennant returns to Little Home"><i class="lanternwood-reward-tree t1"></i><i class="lanternwood-reward-tree t2"></i><i class="lanternwood-reward-porch"></i><i class="lanternwood-reward-lantern l1"></i><i class="lanternwood-reward-lantern l2"></i><i class="lanternwood-reward-route"></i><i class="lanternwood-reward-pennant"></i></div><p class="chapter-reward-result">Neighbors can reach one another by sharing stops and travel windows. The twin amber lanterns are reachable again.</p><div class="win-stars chapter-reward-stars" aria-label="${stars} stars earned">${starRow}</div><div class="chapter-reward-score">${moveWord(movesUsed)} · Perfect route: ${moveWord(lev.optimal)}</div><div class="modal-actions"><button class="primary-small" id="chapterTwoRewardHome">Visit Little Home</button><button class="secondary-small" id="chapterTwoRewardContinue">Continue to Lodestone</button></div></section>`);
 document.getElementById('chapterTwoRewardHome').onclick=()=>{closeModal();cancelAtlasReward();focusHomeReward('pennant')};
 document.getElementById('chapterTwoRewardContinue').onclick=()=>{closeModal();if(atlasRewardState&&atlasRewardState.from===100)playQueuedAtlasReward(true);else startLevel(101)}
}'''
replace_once(
    'game400-b.js',
    "function winLevel(){\n",
    reward2 + "\nfunction winLevel(){\n"
)
replace_once(
    'game400-b.js',
    "if(currentLevel===50){showChapterOneReward(stars,starRow,moveWord,lev);return}const storyMeta=STORY?STORY.levelMeta(currentLevel):null",
    "if(currentLevel===50){showChapterOneReward(stars,starRow,moveWord,lev);return}if(currentLevel===100){showChapterTwoReward(stars,starRow,moveWord,lev);return}const storyMeta=STORY?STORY.levelMeta(currentLevel):null"
)

# Little Home focus treatment for the existing stage-2 visitor pennant.
focus_css = r'''
/* Chapter-two payoff focus: the canonical Little Home visitor pennant gets the same readable, non-blocking reward treatment. */
#c2 .phone.story-focus-pennant .story-pennant{display:block;z-index:25;animation:pennantRewardFocus 1800ms cubic-bezier(.2,.8,.2,1) both}
#c2 .phone.story-focus-pennant .story-pennant:before{content:"";position:absolute;left:-13px;top:-8px;width:44px;height:49px;border-radius:50%;border:3px solid rgba(255,211,112,.80);box-shadow:0 0 0 7px rgba(255,231,158,.15),0 0 18px rgba(255,185,72,.55);animation:pennantRewardHalo 1800ms ease-out both;pointer-events:none}
@keyframes pennantRewardFocus{0%{opacity:.25;transform:translateY(-8px) rotate(-6deg) scale(.78)}28%{opacity:1;transform:translateY(1px) rotate(3deg) scale(1.15)}55%{transform:translateY(-1px) rotate(-1deg) scale(.99)}100%{opacity:1;transform:none}}
@keyframes pennantRewardHalo{0%{opacity:0;scale:.55}28%{opacity:1;scale:1}100%{opacity:0;scale:1.24}}
@media(prefers-reduced-motion:reduce){#c2 .phone.story-focus-pennant .story-pennant,#c2 .phone.story-focus-pennant .story-pennant:before{animation:none!important}}
'''
replace_once(
    'title-island-concepts/index.html',
    '@media(prefers-reduced-motion:reduce){#c2 .phone.story-focus-mailbox .story-mailbox,#c2 .phone.story-focus-mailbox .story-mailbox:before{animation:none!important}}\n</style>',
    '@media(prefers-reduced-motion:reduce){#c2 .phone.story-focus-mailbox .story-mailbox,#c2 .phone.story-focus-mailbox .story-mailbox:before{animation:none!important}}\n' + focus_css + '</style>'
)
replace_once(
    'title-island-concepts/index.html',
    "phone.classList.remove('story-focus-mailbox');if(e.data.focus==='mailbox'){void phone.offsetWidth;phone.classList.add('story-focus-mailbox');setTimeout(()=>phone.classList.remove('story-focus-mailbox'),2200)}if(e.data.replay)restartLittleHomeTitle()",
    "phone.classList.remove('story-focus-mailbox','story-focus-pennant');if(e.data.focus==='mailbox'){void phone.offsetWidth;phone.classList.add('story-focus-mailbox');setTimeout(()=>phone.classList.remove('story-focus-mailbox'),2200)}if(e.data.focus==='pennant'){void phone.offsetWidth;phone.classList.add('story-focus-pennant');setTimeout(()=>phone.classList.remove('story-focus-pennant'),2200)}if(e.data.replay)restartLittleHomeTitle()"
)

# Lanternwood production board family and Chapter 2 reward styling.
lanternwood_css = r'''
/* Pass 3 Chapter 2: Lanternwood production family. Rule space stays quiet; forest identity lives in material, perimeter silhouette and destination light. */
#game[data-visual-slice="lanternwood"] .board-wrap{background:radial-gradient(ellipse at 50% 45%,rgba(240,207,132,.12) 0 38%,rgba(28,54,44,.18) 63%,transparent 78%);box-shadow:0 22px 42px rgba(19,38,32,.18)}
#game[data-visual-slice="lanternwood"] #board{background:linear-gradient(145deg,#66705f,#465349)!important;border:3px solid #8f7957!important;box-shadow:0 17px 34px rgba(18,35,31,.31),inset 0 2px rgba(244,226,182,.18),inset 0 0 0 5px rgba(39,61,48,.22)!important}
#game[data-visual-slice="lanternwood"] #board .cell{background:linear-gradient(145deg,#787a68,#606958)!important;border:1px solid rgba(42,56,45,.42)!important;border-radius:10px!important;box-shadow:inset 0 1px rgba(239,225,190,.13),inset 0 -2px rgba(23,38,31,.14)!important}
#game[data-visual-slice="lanternwood"] #board .rock{background:linear-gradient(145deg,#92928a,#555c56 62%,#3c4640)!important;filter:saturate(.55);box-shadow:inset 4px 5px rgba(255,255,255,.13),inset -4px -5px rgba(22,30,26,.22),0 5px 8px rgba(18,30,27,.28)!important}
#game[data-visual-slice="lanternwood"] #board .nest{background:linear-gradient(145deg,#eee8d4,#cfc7aa)!important;border-width:3px!important;border-style:solid!important;box-shadow:inset 0 0 0 3px rgba(255,255,255,.34),0 3px 8px rgba(18,31,27,.22)!important}
#game[data-visual-slice="lanternwood"] .theme-flourish.left{left:-4px;top:5%;width:72px;height:124px;opacity:.62;background:linear-gradient(90deg,#1d3c31 0 11px,transparent 12px),radial-gradient(ellipse at 18px 25px,#31583e 0 22px,transparent 23px),radial-gradient(ellipse at 39px 56px,#3b6546 0 25px,transparent 26px),radial-gradient(circle at 52px 91px,#ffd06b 0 4px,#9a6a35 5px 7px,transparent 8px);filter:drop-shadow(0 6px 8px rgba(16,36,28,.18))}
#game[data-visual-slice="lanternwood"] .theme-flourish.right{right:-2px;bottom:7%;width:70px;height:118px;opacity:.60;background:linear-gradient(90deg,transparent 0 50px,#203e33 51px 61px,transparent 62px),radial-gradient(ellipse at 47px 26px,#31583e 0 21px,transparent 22px),radial-gradient(ellipse at 27px 59px,#416b49 0 23px,transparent 24px),radial-gradient(circle at 13px 84px,#ffd06b 0 4px,#9a6a35 5px 7px,transparent 8px);filter:drop-shadow(0 6px 8px rgba(16,36,28,.18))}

/* Five Lanternwood movements: linear timber/forest shifts only, never patterned rule marks. */
#game[data-visual-slice="lanternwood"] #board[data-board-range="1"]{background:linear-gradient(145deg,#687260,#47554a)!important;border-color:#8d7959!important}
#game[data-visual-slice="lanternwood"] #board[data-board-range="1"] .cell{background:linear-gradient(145deg,#7b7c69,#626a59)!important}
#game[data-visual-slice="lanternwood"] #board[data-board-range="2"]{background:linear-gradient(145deg,#626b58,#414e43)!important;border-color:#927650!important}
#game[data-visual-slice="lanternwood"] #board[data-board-range="2"] .cell{background:linear-gradient(145deg,#747562,#596251)!important}
#game[data-visual-slice="lanternwood"] #board[data-board-range="3"]{background:linear-gradient(145deg,#5b6555,#39483e)!important;border-color:#9b784c!important}
#game[data-visual-slice="lanternwood"] #board[data-board-range="3"] .cell{background:linear-gradient(145deg,#6d705e,#525d4e)!important}
#game[data-visual-slice="lanternwood"] #board[data-board-range="4"]{background:linear-gradient(145deg,#555f50,#334238)!important;border-color:#9a7447!important}
#game[data-visual-slice="lanternwood"] #board[data-board-range="4"] .cell{background:linear-gradient(145deg,#666b59,#4b5748)!important}
#game[data-visual-slice="lanternwood"] #board[data-board-range="5"]{background:linear-gradient(145deg,#4f5b4d,#2f3f36)!important;border-color:#a17b4b!important}
#game[data-visual-slice="lanternwood"] #board[data-board-range="5"] .cell{background:linear-gradient(145deg,#606755,#465244)!important}

/* The later Familiar Porch repeats Chapter 2's twin amber lantern landmark. */
#cinematicOverlay[data-visual="porch"] .porch-friend-lantern{position:absolute;z-index:6;width:7px;height:9px;border-radius:3px;background:#ffd477;border:1px solid #8c6637;box-shadow:0 0 10px rgba(255,190,80,.92),0 0 18px rgba(255,190,80,.38)}
#cinematicOverlay[data-visual="porch"] .porch-friend-lantern.l1{left:43%;top:50%}
#cinematicOverlay[data-visual="porch"] .porch-friend-lantern.l2{left:69%;top:49%}

/* Chapter 2 reward: a social route payoff, then the existing Little Home visitor pennant. */
.chapter-two-reward .chapter-reward-kicker{color:#9b6c2e}
.lanternwood-reward-postcard{background:linear-gradient(#283f3b 0 54%,#385943 55% 100%);border-color:#806b4d}
.lanternwood-reward-postcard:before{background:linear-gradient(#31563d,#203e31)!important;box-shadow:inset 0 3px rgba(255,224,153,.05)!important}
.lanternwood-reward-tree{position:absolute;z-index:2;bottom:20%;width:13px;height:64px;border-radius:8px 8px 4px 4px;background:#44382d;box-shadow:inset 2px 0 rgba(255,255,255,.05)}
.lanternwood-reward-tree:before{content:"";position:absolute;left:-19px;top:-24px;width:50px;height:43px;border-radius:50%;background:#31543c;box-shadow:15px 10px 0 -5px #3c6646,-10px 13px 0 -7px #274936}
.lanternwood-reward-tree.t1{left:11%}.lanternwood-reward-tree.t2{right:12%;transform:scale(.86)}
.lanternwood-reward-porch{position:absolute;z-index:4;right:25%;bottom:29%;width:35%;height:34%;border-radius:7px 7px 3px 3px;background:linear-gradient(90deg,#a57b56,#795943);box-shadow:0 5px 7px rgba(17,28,24,.26)}
.lanternwood-reward-porch:before{content:"";position:absolute;left:-8%;top:-27%;width:116%;height:35%;background:#514048;clip-path:polygon(50% 0,100% 100%,0 100%)}
.lanternwood-reward-porch:after{content:"";position:absolute;left:-13%;right:-13%;bottom:-12%;height:9%;border-radius:5px;background:#76543d}
.lanternwood-reward-lantern{position:absolute;z-index:6;width:8px;height:10px;border-radius:3px;background:#ffd477;border:1px solid #8d6433;box-shadow:0 0 10px rgba(255,190,78,.90),0 0 18px rgba(255,190,78,.35)}
.lanternwood-reward-lantern.l1{right:46%;bottom:43%}.lanternwood-reward-lantern.l2{right:30%;bottom:43%}
.lanternwood-reward-route{position:absolute;z-index:3;left:14%;bottom:32%;width:55%;height:4px;border-radius:999px;background:linear-gradient(90deg,rgba(255,212,111,.08),#efc765 26% 90%,rgba(239,199,101,.08));transform:rotate(-5deg);box-shadow:0 0 7px rgba(239,199,101,.30)}
.lanternwood-reward-pennant{position:absolute;z-index:5;left:24%;bottom:25%;width:3px;height:35px;border-radius:2px;background:#7b5838}
.lanternwood-reward-pennant:after{content:"";position:absolute;left:3px;top:2px;width:25px;height:14px;background:#e0a84e;clip-path:polygon(0 0,100% 16%,72% 100%,0 72%);box-shadow:0 0 8px rgba(255,195,83,.22)}
'''
append_once('style400-production-slice.css', 'Pass 3 Chapter 2: Lanternwood production family.', lanternwood_css)

# Atlas movement 3 gets the same twin-lantern porch landmark.
atlas_css = r'''
/* Pass 3 Chapter 2 continuity landmark: Levels 71-80 introduce the twin-amber-lantern porch later seen through the telescope. */
.theme-ch2 .atlas-map.atlas-range-3 .atlas-scene em{right:8%;bottom:8%;width:48px;height:34px;border:0;border-radius:5px;background:linear-gradient(90deg,#765944,#5b4438);box-shadow:0 5px 8px rgba(12,29,24,.25);opacity:.92;rotate:0deg}
.theme-ch2 .atlas-map.atlas-range-3 .atlas-scene em:before{content:"";position:absolute;left:-7%;top:-24%;width:114%;height:30%;background:#493d43;clip-path:polygon(50% 0,100% 100%,0 100%)}
.theme-ch2 .atlas-map.atlas-range-3 .atlas-scene em:after{content:"";position:absolute;left:9px;top:18px;width:6px;height:8px;border-radius:3px;background:#ffd477;border:1px solid #8c6637;box-shadow:20px 0 0 -1px #ffd477,0 0 9px #f4b34d,20px 0 9px #f4b34d}
'''
append_once('style400-skyway-atlas.css', 'Pass 3 Chapter 2 continuity landmark:', atlas_css)

# Cache-bust every changed production surface/script.
replacements = [
    ('style400-skyway-atlas.css?v=20260912-pass1','style400-skyway-atlas.css?v=20260912-ch2pass3-1'),
    ('style400-production-slice.css?v=20260912-ch1rollout1','style400-production-slice.css?v=20260912-ch2pass3-1'),
    ('title-island-concepts/?c=2&amp;embed=1&amp;v=20260912-slice1','title-island-concepts/?c=2&amp;embed=1&amp;v=20260912-ch2pass3-1'),
    ('<script src="story400.js"></script>','<script src="story400.js?v=20260912-ch2pass3-1"></script>'),
    ('story-grounding400.js?v=20260912-pass1','story-grounding400.js?v=20260912-ch2pass3-1'),
    ('cinematics400.js?v=20260912-slice1','cinematics400.js?v=20260912-ch2pass3-1'),
    ('game400-a.js?v=20260912-slice1','game400-a.js?v=20260912-ch2pass3-1'),
    ('game400-b.js?v=20260912-slice1','game400-b.js?v=20260912-ch2pass3-1'),
]
for old,new in replacements:
    replace_once('index.html', old, new)

print('CHAPTER2_PASS3_CANDIDATE_APPLIED')
