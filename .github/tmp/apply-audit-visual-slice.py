from pathlib import Path


def replace_once(path, old, new, label):
    p = Path(path)
    s = p.read_text()
    if old not in s:
        raise SystemExit(f'missing anchor: {label} in {path}')
    p.write_text(s.replace(old, new, 1))

# Load the narrow production-slice stylesheet last so it can prove a material system without
# rewriting the 40 existing board variants before the slice is accepted.
replace_once(
    'index.html',
    '<link rel="stylesheet" href="style400-board-surfaces.css">',
    '<link rel="stylesheet" href="style400-board-surfaces.css">\n<link rel="stylesheet" href="style400-production-slice.css?v=20260912-slice1">',
    'production slice stylesheet link'
)
for old, new, label in [
    ('title-island-concepts/?c=2&amp;embed=1&amp;v=20260911-discretesteps5', 'title-island-concepts/?c=2&amp;embed=1&amp;v=20260912-slice1', 'home iframe cache'),
    ('cinematics400.js?v=20260912-pass1', 'cinematics400.js?v=20260912-slice1', 'cinematics cache'),
    ('game400-a.js?v=20260912-pass1', 'game400-a.js?v=20260912-slice1', 'game a cache'),
    ('game400-b.js?v=20260912-pass1', 'game400-b.js?v=20260912-slice1', 'game b cache'),
]:
    replace_once('index.html', old, new, label)

# Mark only the approved representative boards. Keep the data hook inert for all other levels.
replace_once(
    'game400-a.js',
    "let playMode='campaign',dailySession=null;",
    "let playMode='campaign',dailySession=null;\nconst VISUAL_SLICE_LEVELS={1:'sunpetal',366:'aurora-dense'};\nlet homeRewardFocus=null;\nfunction visualSliceForLevel(level){return playMode==='campaign'?(VISUAL_SLICE_LEVELS[level]||''):''}\nfunction focusHomeReward(key){homeRewardFocus=key||null;screen('home')}",
    'visual slice level map'
)
replace_once(
    'game400-a.js',
    "function updateHome(replay=false){const total=Object.values(progress.stars).reduce((a,b)=>a+(+b||0),0),legacy=document.getElementById('homeStars');if(legacy)legacy.textContent=total;const frame=document.getElementById('homeTitleFrame'),stage=STORY?STORY.completedChapters(progress):0;if(frame&&frame.contentWindow)frame.contentWindow.postMessage({source:'latchlings-game',type:'home-state',stars:total,stage,replay:!!replay,motion:uiPrefs.motion,textSize:uiPrefs.textSize},location.origin)}",
    "function updateHome(replay=false){const total=Object.values(progress.stars).reduce((a,b)=>a+(+b||0),0),legacy=document.getElementById('homeStars');if(legacy)legacy.textContent=total;const frame=document.getElementById('homeTitleFrame'),stage=STORY?STORY.completedChapters(progress):0,focus=homeRewardFocus;homeRewardFocus=null;if(frame&&frame.contentWindow)frame.contentWindow.postMessage({source:'latchlings-game',type:'home-state',stars:total,stage,replay:!!replay,motion:uiPrefs.motion,textSize:uiPrefs.textSize,focus},location.origin)}",
    'home reward focus message'
)
replace_once(
    'game400-a.js',
    "const board=document.getElementById('board');board.dataset.level=String(currentLevel);document.getElementById('levelTitle').textContent=campaign?'Level '+currentLevel:'Daily Route';",
    "const board=document.getElementById('board'),game=document.getElementById('game'),visualSlice=visualSliceForLevel(currentLevel);board.dataset.level=String(currentLevel);if(visualSlice){board.dataset.visualSlice=visualSlice;if(game)game.dataset.visualSlice=visualSlice}else{delete board.dataset.visualSlice;if(game)delete game.dataset.visualSlice}document.getElementById('levelTitle').textContent=campaign?'Level '+currentLevel:'Daily Route';",
    'render visual slice data hook'
)
replace_once(
    'game400-a.js',
    "cell.innerHTML=`<div class=\"nest\" style=\"--piece-color:${COLORS[p.color]}\">${suitSvg(p.suit)}</div>`;return",
    "cell.innerHTML=`<div class=\"nest\" data-pi=\"${nestI}\" style=\"--piece-color:${COLORS[p.color]}\">${suitSvg(p.suit)}</div>`;return",
    'nest piece identity'
)
replace_once(
    'game400-a.js',
    "placePiece(el,pos[0],pos[1],lev.size,false);el.innerHTML=`<span class=\"suit-mark\">${suitSvg(p.suit)}</span><span class=\"face\"><span class=\"eyes\"><i class=\"eye\"></i><i class=\"eye\"></i></span><i class=\"mouth\"></i></span>`;el.onclick=()=>{if(animating||selected===i)return;selected=i;renderPieces(lev);if(window.LatchlingsSFX)window.LatchlingsSFX.selectLatchling()};layer.appendChild(el)})}",
    "placePiece(el,pos[0],pos[1],lev.size,false);el.innerHTML=`<span class=\"suit-mark\">${suitSvg(p.suit)}</span><span class=\"face\"><span class=\"eyes\"><i class=\"eye\"></i><i class=\"eye\"></i></span><i class=\"mouth\"></i></span>`;el.onclick=()=>{if(animating||selected===i)return;selected=i;renderPieces(lev);if(window.LatchlingsSFX)window.LatchlingsSFX.selectLatchling()};layer.appendChild(el)});document.querySelectorAll('#board .nest[data-pi]').forEach(n=>n.classList.toggle('selected-match',Number(n.dataset.pi)===selected))}",
    'selected matching nest state'
)

# Restage only the familiar-porch visual. Dialogue remains in the ordered dock from Pass 1.
old_lookout = "function lookoutHtml(){return `<div class=\"cin-lookout-scene\"><div class=\"cin-lookout-island\"><i class=\"near-side\"></i><i class=\"near-top\"></i><i class=\"near-crystal\"></i></div><div class=\"cin-telescope\"><i class=\"tube\"></i><i class=\"lens\"></i><span class=\"cin-telescope-mount\"><b></b><b></b><b></b></span></div>${character('Tansy','lookout-tansy')}<div class=\"cin-distant-home\"><i class=\"d-side\"></i><i class=\"d-top\"></i><i class=\"d-house\"></i><i class=\"d-light\"></i></div><i class=\"cin-sightline\"></i></div>`}"
new_lookout = "function lookoutHtml(){return `<div class=\"cin-lookout-scene cin-porch-production\"><i class=\"porch-cloud c1\"></i><i class=\"porch-cloud c2\"></i><div class=\"porch-far-island\"><i class=\"porch-island-side\"></i><i class=\"porch-island-top\"></i><i class=\"porch-tree\"></i><i class=\"porch-house\"></i><i class=\"porch-deck\"></i></div><div class=\"porch-near-island\"><i class=\"porch-crystal k1\"></i><i class=\"porch-crystal k2\"></i></div><div class=\"cin-telescope production-telescope\"><i class=\"tube\"></i><i class=\"lens\"></i><span class=\"cin-telescope-mount\"><b></b><b></b><b></b></span></div>${character('Tansy','lookout-tansy')}${character('Pip','lookout-pip')}<i class=\"cin-sightline\"></i><i class=\"porch-depth-haze\"></i></div>`}"
replace_once('cinematics400.js', old_lookout, new_lookout, 'familiar porch production scene')

# Give the first chapter a visible, ordinary-life payoff instead of another dense result block.
reward_fn = '''function showChapterOneReward(stars,starRow,moveWord,lev){\n modal(`<section class="chapter-reward-card" aria-label="Sunpetal Meadows restored"><div class="chapter-reward-kicker">Sunpetal restored</div><h2>Little Home has a new mailbox</h2><div class="chapter-reward-postcard" role="img" aria-label="A basket route reaches the newly installed mailbox beside Little Home"><i class="chapter-reward-house"></i><i class="chapter-reward-mailbox"></i><i class="chapter-reward-route"></i><i class="chapter-reward-basket"></i><i class="chapter-reward-flower f1"></i><i class="chapter-reward-flower f2"></i></div><p class="chapter-reward-result">Breakfast, watering, and mail can reach their stops again. The routes now follow where Sunpetal is today.</p><div class="win-stars chapter-reward-stars" aria-label="${stars} stars earned">${starRow}</div><div class="chapter-reward-score">${moveWord(movesUsed)} · Perfect route: ${moveWord(lev.optimal)}</div><div class="modal-actions"><button class="primary-small" id="chapterRewardHome">Visit Little Home</button><button class="secondary-small" id="chapterRewardContinue">Continue to Lanternwood</button></div></section>`);\n document.getElementById('chapterRewardHome').onclick=()=>{closeModal();cancelAtlasReward();focusHomeReward('mailbox')};\n document.getElementById('chapterRewardContinue').onclick=()=>{closeModal();if(atlasRewardState&&atlasRewardState.from===50)playQueuedAtlasReward(true);else startLevel(51)}\n}\n'''
replace_once('game400-b.js', 'function winLevel(){', reward_fn + 'function winLevel(){', 'chapter one reward helper')
replace_once(
    'game400-b.js',
    "const previousUnlocked=progress.unlocked;progress.stars[currentLevel]=Math.max(progress.stars[currentLevel]||0,stars);if(currentLevel<400)progress.unlocked=Math.max(progress.unlocked,currentLevel+1);saveProgress();if(currentLevel<400&&progress.unlocked>previousUnlocked)queueAtlasReward(currentLevel,currentLevel+1,stars);const storyMeta=STORY?STORY.levelMeta(currentLevel):null,beat=STORY?STORY.beatForLevel(currentLevel):null,storyTitle=storyMeta?`<div class=\"win-story-title\">${storyMeta.title}</div>`:'',beatHtml=beat?`<div class=\"story-beat story-beat-result\"><span class=\"story-beat-kicker\">${beat.resultLabel||'Route discovery'}</span><strong>${beat.title}</strong><p>${beat.text}</p>${beat.nextLead?`<div class=\"story-beat-next\"><b>${beat.local===50?'Next region':'Next lead'}</b><span>${beat.nextLead}</span></div>`:''}${beat.homeReward?`<span class=\"story-reward\">Little Home changes: ${beat.homeReward}</span>`:''}</div>`:'';",
    "const previousUnlocked=progress.unlocked;progress.stars[currentLevel]=Math.max(progress.stars[currentLevel]||0,stars);if(currentLevel<400)progress.unlocked=Math.max(progress.unlocked,currentLevel+1);saveProgress();if(currentLevel<400&&progress.unlocked>previousUnlocked)queueAtlasReward(currentLevel,currentLevel+1,stars);if(currentLevel===50){showChapterOneReward(stars,starRow,moveWord,lev);return}const storyMeta=STORY?STORY.levelMeta(currentLevel):null,beat=STORY?STORY.beatForLevel(currentLevel):null,storyTitle=storyMeta?`<div class=\"win-story-title\">${storyMeta.title}</div>`:'',beatHtml=beat?`<div class=\"story-beat story-beat-result\"><span class=\"story-beat-kicker\">${beat.resultLabel||'Route discovery'}</span><strong>${beat.title}</strong><p>${beat.text}</p>${beat.nextLead?`<div class=\"story-beat-next\"><b>${beat.local===50?'Next region':'Next lead'}</b><span>${beat.nextLead}</span></div>`:''}${beat.homeReward?`<span class=\"story-reward\">Little Home changes: ${beat.homeReward}</span>`:''}</div>`:'';",
    'level 50 reward branch'
)

# Briefly frame the canonical mailbox at Little Home when the player chooses to inspect the reward.
title_path = Path('title-island-concepts/index.html')
title = title_path.read_text()
css_anchor = '</style>'
focus_css = '''\n/* Chapter-one payoff focus: the canonical Little Home mailbox gets a short, non-blocking reveal. */\n#c2 .phone.story-focus-mailbox .story-mailbox{display:block;z-index:25;animation:mailboxRewardFocus 1800ms cubic-bezier(.2,.8,.2,1) both}\n#c2 .phone.story-focus-mailbox .story-mailbox:before{content:"";position:absolute;left:-12px;top:-10px;width:37px;height:32px;border-radius:50%;border:3px solid rgba(255,231,139,.82);box-shadow:0 0 0 7px rgba(255,243,186,.20),0 0 18px rgba(255,218,104,.62);animation:mailboxRewardHalo 1800ms ease-out both;pointer-events:none}\n@keyframes mailboxRewardFocus{0%{opacity:.25;transform:translateY(-9px) scale(.76)}28%{opacity:1;transform:translateY(1px) scale(1.18)}55%{transform:translateY(-2px) scale(.98)}100%{opacity:1;transform:none}}\n@keyframes mailboxRewardHalo{0%{opacity:0;scale:.55}28%{opacity:1;scale:1}100%{opacity:0;scale:1.25}}\n@media(prefers-reduced-motion:reduce){#c2 .phone.story-focus-mailbox .story-mailbox,#c2 .phone.story-focus-mailbox .story-mailbox:before{animation:none!important}}\n'''
if focus_css.strip() not in title:
    if css_anchor not in title:
        raise SystemExit('missing title style close')
    title = title.replace(css_anchor, focus_css + css_anchor, 1)
message_old = "if(e.data.replay)restartLittleHomeTitle()"
message_new = "phone.classList.remove('story-focus-mailbox');if(e.data.focus==='mailbox'){void phone.offsetWidth;phone.classList.add('story-focus-mailbox');setTimeout(()=>phone.classList.remove('story-focus-mailbox'),2200)}if(e.data.replay)restartLittleHomeTitle()"
if message_old not in title:
    raise SystemExit('missing title home-state focus anchor')
title = title.replace(message_old, message_new, 1)
title_path.write_text(title)

# Promote the candidate stylesheet into the product tree for validation.
Path('style400-production-slice.css').write_text(Path('.github/tmp/style400-production-slice.css').read_text())
print('AUDIT_VISUAL_SLICE_PATCH_APPLIED')
