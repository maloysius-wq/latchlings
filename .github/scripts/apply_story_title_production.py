from pathlib import Path

# ---------------- index.html ----------------
p=Path('index.html')
t=p.read_text()
old_home='''  <main id="home" class="screen active">
    <div class="topbar card">
      <div class="logo">Latchlings<small></small></div><div class="spacer"></div>
      <div class="pill"><span id="homeStars">0</span><span>stars</span></div>
      <button class="iconbtn" id="settingsBtn" aria-label="Settings"></button>
    </div>
    <div class="home-main">
      <section class="hero card">
        <h1>Latchlings</h1>
        <p>Plan the route. Use the board. Snap every Latchling into the right nest.</p>
        <div class="island" aria-hidden="true"><div class="island-base"></div><div class="home-house"></div><div class="hero-latch one"><i class="mini-eye e1"></i><i class="mini-eye e2"></i><i class="mini-mouth"></i></div><div class="hero-latch two"><i class="mini-eye e1"></i><i class="mini-eye e2"></i><i class="mini-mouth"></i></div><div class="hero-latch three"><i class="mini-eye e1"></i><i class="mini-eye e2"></i><i class="mini-mouth"></i></div></div>
        <button class="primary-btn" id="playBtn">Play</button>
      </section>
      <div class="home-secondary"><button class="secondary-btn" id="dailyBtn">Daily Puzzle<br><small>Practice board</small></button><button class="secondary-btn" id="levelSelectBtn">Level Select<br><small>400 verified boards</small></button></div>
    </div>
    <nav class="bottom-tabs card"><button class="tab active" data-nav="home">Home</button><button class="tab" data-nav="play">Play</button><button class="tab" data-nav="levels">Levels</button><button class="tab" data-nav="about">Rules</button></nav>
  </main>
'''
new_home='''  <main id="home" class="screen active production-home" aria-label="Latchlings home">
    <div class="production-home-wrap">
      <iframe id="homeTitleFrame" class="production-home-frame" src="title-island-concepts/?c=2&amp;embed=1" title="Latchlings Little Home" scrolling="no"></iframe>
    </div>
  </main>
'''
if old_home not in t:
    raise SystemExit('Production home markup anchor not found')
t=t.replace(old_home,new_home,1)
old_complete='<h1 style="font-size:40px;margin-top:20px">Skyway Restored</h1><p>You cleared all 400 campaign puzzles. The final board stays beaten; it does not loop back into itself.</p>'
new_complete='<h1 style="font-size:40px;margin-top:20px">The Skyway Lives Again</h1><p>The islands keep drifting. Now the routes move with them, tended by neighbors and Waykeepers across the Latchlands.</p>'
if old_complete not in t:
    raise SystemExit('Campaign completion copy anchor not found')
t=t.replace(old_complete,new_complete,1)
t=t.replace('<button class="primary-btn" id="completeLevels">Level Select</button></section>','<button class="primary-btn" id="completeLevels">Level Select</button><button class="secondary-btn" id="completeHome" style="margin-top:12px">Return to Little Home</button></section>',1)
if '<script src="story400.js"></script>' not in t:
    t=t.replace('<script src="campaign400-8.js"></script>\n<script src="game400-a.js"></script>','<script src="campaign400-8.js"></script>\n<script src="story400.js"></script>\n<script src="game400-a.js"></script>',1)
p.write_text(t)

# ---------------- style400-ui.css ----------------
p=Path('style400-ui.css')
t=p.read_text()
marker='/* Production Little Home title surface */'
if marker not in t:
    t += '''\n\n/* Production Little Home title surface */
#home.production-home{max-width:none;padding:0;align-items:center;justify-content:center;overflow:hidden;background:transparent}
.production-home-wrap{width:min(390px,100vw,46.2085svh);aspect-ratio:390/844;max-height:100svh;overflow:hidden;border-radius:30px;box-shadow:0 18px 42px rgba(29,55,88,.16);background:#dceffa}
.production-home-frame{display:block;width:100%;height:100%;border:0;background:#dceffa}
.chapter-mechanic{margin-top:7px!important;font-size:12px!important;color:#385879!important;font-weight:800}
.chapter-opening{margin-top:7px!important;font-size:12px!important;color:#617a91!important;font-style:italic}
@media(max-width:430px){.production-home-wrap{border-radius:0;box-shadow:none}}
'''
p.write_text(t)

# ---------------- style400-game.css ----------------
p=Path('style400-game.css')
t=p.read_text()
marker='/* Narrative presentation layer */'
if marker not in t:
    t += '''\n\n/* Narrative presentation layer */
.mechanic-note.story-note{padding:10px 14px 9px}
.mechanic-note.story-note strong{display:block;color:#173a67;font-family:Georgia,serif;font-size:15px;line-height:1.05;margin-bottom:4px}
.mechanic-note.story-note span{display:block;font-size:11.5px;line-height:1.32;color:#45627c;font-weight:750}
.mechanic-note.story-note em{display:block;margin-top:5px;padding-top:5px;border-top:1px solid rgba(190,162,126,.35);font-size:10.5px;line-height:1.3;color:#64788c;font-style:normal;font-weight:700}
.win-story-title{margin:-1px 0 8px;color:#173a67;font-family:Georgia,serif;font-size:18px;font-weight:800}
.story-beat{margin:14px 0 16px;padding:13px 14px;border-radius:16px;background:rgba(245,222,172,.48);border:1px solid rgba(190,151,91,.42);text-align:left}
.story-beat strong{display:block;color:#173a67;margin-bottom:5px;font-size:13px}
.story-beat p{margin:0!important;font-size:12px!important;line-height:1.42!important}
.story-reward{display:block;margin-top:7px;color:#5e7856;font-size:11px;font-weight:850}
.story-scroll{max-height:58vh;overflow:auto;text-align:left;padding-right:3px}
.story-scroll h3{margin:15px 0 5px;color:#173a67;font-family:Georgia,serif;font-size:18px}
.story-scroll p{margin:0 0 10px!important;font-size:13px!important}
.story-cast{display:grid;gap:8px;margin:9px 0}
.story-person{padding:9px 10px;border-radius:13px;background:rgba(255,248,232,.72);border:1px solid rgba(208,182,145,.55)}
.story-person strong{display:block;color:#173a67;font-size:13px}.story-person span{display:block;margin-top:2px;color:#5d7387;font-size:11px;line-height:1.3}
'''
p.write_text(t)

# ---------------- game400-a.js ----------------
p=Path('game400-a.js')
t=p.read_text()
if 'const STORY=window.LATCHLINGS_STORY||null;' not in t:
    start=t.index('const CHAPTERS=[')
    end=t.index('const COLORS=',start)
    old=t[start:end]
    arr=old[len('const CHAPTERS='):].strip()
    if arr.endswith(';'):arr=arr[:-1]
    new=f"const STORY=window.LATCHLINGS_STORY||null;\nconst CHAPTERS=STORY?STORY.chapters:{arr};\n"
    t=t[:start]+new+t[end:]

old="function screen(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));document.getElementById(id).classList.add('active')}"
new="function screen(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));document.getElementById(id).classList.add('active');if(id==='home')setTimeout(()=>updateHome(true),0)}"
if old in t:t=t.replace(old,new,1)
elif "if(id==='home')setTimeout(()=>updateHome(true),0)" not in t:raise SystemExit('screen() anchor missing')

old="function updateHome(){const total=Object.values(progress.stars).reduce((a,b)=>a+(+b||0),0);document.getElementById('homeStars').textContent=total}"
new="function updateHome(replay=false){const total=Object.values(progress.stars).reduce((a,b)=>a+(+b||0),0),legacy=document.getElementById('homeStars');if(legacy)legacy.textContent=total;const frame=document.getElementById('homeTitleFrame'),stage=STORY?STORY.completedChapters(progress):0;if(frame&&frame.contentWindow)frame.contentWindow.postMessage({source:'latchlings-game',type:'home-state',stars:total,stage,replay:!!replay},location.origin)}"
if old in t:t=t.replace(old,new,1)
elif 'homeTitleFrame' not in t:raise SystemExit('updateHome() anchor missing')

old="document.getElementById('chapterHead').innerHTML=`<div class=\"chapter-badge\">${chapterView}</div><div><div class=\"theme-kicker\">${ch.theme}</div><h2>Chapter ${chapterView}: ${ch.name}</h2><p>${ch.desc}</p></div>`;"
new="document.getElementById('chapterHead').innerHTML=`<div class=\"chapter-badge\">${chapterView}</div><div><div class=\"theme-kicker\">${ch.theme}</div><h2>Chapter ${chapterView}: ${ch.name}</h2><p>${ch.desc}</p><p class=\"chapter-mechanic\"><strong>Route language:</strong> ${ch.mechanic||''}</p><p class=\"chapter-opening\">${ch.opening||''}</p></div>`;"
if old in t:t=t.replace(old,new,1)
elif 'chapter-opening' not in t:raise SystemExit('renderChapter() header anchor missing')

old="document.getElementById('levelTitle').textContent='Level '+currentLevel;document.getElementById('movesLeft').textContent=Math.max(0,lev.moveLimit-movesUsed);document.getElementById('mechanicNote').textContent=chapterNote(currentLevel);"
new="const storyMeta=STORY?STORY.levelMeta(currentLevel):null;document.getElementById('levelTitle').textContent='Level '+currentLevel;document.getElementById('movesLeft').textContent=Math.max(0,lev.moveLimit-movesUsed);const note=document.getElementById('mechanicNote');if(storyMeta){note.classList.add('story-note');note.innerHTML=`<strong>${storyMeta.title}</strong><span>${storyMeta.context}</span><em>${chapterNote(currentLevel)}</em>`}else{note.classList.remove('story-note');note.textContent=chapterNote(currentLevel)};"
if old in t:t=t.replace(old,new,1)
elif 'storyMeta=STORY?STORY.levelMeta' not in t:raise SystemExit('renderGame() narrative anchor missing')

t=t.replace("if(k<=2)return c.desc;","if(k<=2)return (c.mechanic?c.mechanic+'. ':'')+c.tip;",1)
p.write_text(t)

# ---------------- game400-b.js ----------------
p=Path('game400-b.js')
t=p.read_text()
start=t.index('function winLevel(){')
end=t.index('\nfunction loseLevel(){',start)
old=t[start:end]
new='''function winLevel(){if(window.LatchlingsSFX)window.LatchlingsSFX.levelClear();const lev=LEVELS[currentLevel-1],stars=starsFor(lev);progress.stars[currentLevel]=Math.max(progress.stars[currentLevel]||0,stars);if(currentLevel<400)progress.unlocked=Math.max(progress.unlocked,currentLevel+1);saveProgress();const starRow=[1,2,3].map((n,i)=>starSvg(n<=stars,`s${i+1}`)).join(''),storyMeta=STORY?STORY.levelMeta(currentLevel):null,beat=STORY?STORY.beatForLevel(currentLevel):null,storyTitle=storyMeta?`<div class="win-story-title">${storyMeta.title}</div>`:'',beatHtml=beat?`<div class="story-beat"><strong>${beat.title}</strong><p>${beat.text}</p>${beat.homeReward?`<span class="story-reward">Little Home: ${beat.homeReward}</span>`:''}</div>`:'';modal(`<h2>Level cleared</h2>${storyTitle}<div class="win-stars" aria-label="${stars} stars earned">${starRow}</div><p>${movesUsed} moves. Verified shortest solution: ${lev.optimal}.</p>${beatHtml}<div class="modal-actions"><button class="primary-small" id="nextLevelBtn">${currentLevel===400?'Finish':'Next Level'}</button><button class="secondary-small" id="replayBtn">Replay</button><button class="secondary-small" id="toLevelsBtn">Level Select</button></div>`);document.getElementById('nextLevelBtn').onclick=()=>{closeModal();if(currentLevel===400){if(window.LatchlingsSFX)window.LatchlingsSFX.campaignComplete();screen('complete')}else startLevel(currentLevel+1)};document.getElementById('replayBtn').onclick=()=>{closeModal();startLevel(currentLevel)};document.getElementById('toLevelsBtn').onclick=()=>{closeModal();chapterView=Math.ceil(currentLevel/50);rangeView=Math.floor(((currentLevel-1)%50)/10);screen('levels');renderChapter()}}'''
t=t[:start]+new+t[end:]

settings_anchor="function settingsModal(){modal(`<h2>Settings</h2><p>This rebuild keeps the interface intentionally quiet. There are no ad buttons, currencies, or decorative counters competing with the puzzle.</p><div class=\"modal-actions\"><button class=\"secondary-small\" id=\"settingsRules\">Rules and mechanics</button><button class=\"primary-small\" id=\"settingsClose\">Close</button></div>`);document.getElementById('settingsRules').onclick=rulesModal;document.getElementById('settingsClose').onclick=closeModal}"
if 'function storyModal(){' not in t:
    story_fn="""function storyModal(){if(!STORY){rulesModal();return}const ch=STORY.currentChapter(progress),c=STORY.chapters[ch-1],cast=STORY.cast.map(x=>`<div class=\"story-person\"><strong>${x.name}</strong><span>${x.role}. ${x.voice}</span></div>`).join('');modal(`<h2>The Latchlands</h2><div class=\"story-scroll\"><p>${STORY.premise}</p><h3>You are the ${STORY.playerRole}</h3><p>The Skyway is an old route network built to keep changing as the floating islands drift. Your puzzles are the route problems behind everyday life.</p><h3>Little Home</h3><div class=\"story-cast\">${cast}</div><h3>Current chapter · ${c.name}</h3><p><strong>${c.theme}</strong><br>${c.desc}</p><p><em>${STORY.theme}</em></p></div><div class=\"modal-actions\"><button class=\"primary-small\" id=\"storyClose\">Back</button></div>`);document.getElementById('storyClose').onclick=settingsModal}\n"""
    if settings_anchor not in t:raise SystemExit('settingsModal anchor missing')
    t=t.replace(settings_anchor,story_fn+settings_anchor,1)

old=settings_anchor
new="function settingsModal(){modal(`<h2>Settings</h2><p>Little Home is your base while the Waykeeper rebuilds a living Skyway across the drifting Latchlands.</p><div class=\"modal-actions\"><button class=\"secondary-small\" id=\"settingsStory\">Story and residents</button><button class=\"secondary-small\" id=\"settingsRules\">Rules and mechanics</button><button class=\"primary-small\" id=\"settingsClose\">Close</button></div>`);document.getElementById('settingsStory').onclick=storyModal;document.getElementById('settingsRules').onclick=rulesModal;document.getElementById('settingsClose').onclick=closeModal}"
if old in t:t=t.replace(old,new,1)
elif 'settingsStory' not in t:raise SystemExit('settingsModal replacement failed')

old="function bind(){document.getElementById('settingsBtn').innerHTML=icon('gear');"
new="function bind(){const settingsBtn=document.getElementById('settingsBtn');if(settingsBtn)settingsBtn.innerHTML=icon('gear');"
if old in t:t=t.replace(old,new,1)
elif 'const settingsBtn=' not in t:raise SystemExit('bind settings anchor missing')

old="document.getElementById('playBtn').onclick=()=>startLevel(progress.unlocked);document.getElementById('levelSelectBtn').onclick=()=>{chapterView=Math.ceil(progress.unlocked/50);rangeView=Math.floor(((progress.unlocked-1)%50)/10);screen('levels');renderChapter()};document.getElementById('dailyBtn').onclick=()=>{const now=new Date(),seed=now.getFullYear()*372+now.getMonth()*31+now.getDate();startLevel((seed*37%400)+1)};"
new="const playBtn=document.getElementById('playBtn'),levelSelectBtn=document.getElementById('levelSelectBtn'),dailyBtn=document.getElementById('dailyBtn');if(playBtn)playBtn.onclick=()=>startLevel(progress.unlocked);if(levelSelectBtn)levelSelectBtn.onclick=()=>{chapterView=Math.ceil(progress.unlocked/50);rangeView=Math.floor(((progress.unlocked-1)%50)/10);screen('levels');renderChapter()};if(dailyBtn)dailyBtn.onclick=()=>{const now=new Date(),seed=now.getFullYear()*372+now.getMonth()*31+now.getDate();startLevel((seed*37%400)+1)};const homeFrame=document.getElementById('homeTitleFrame');if(homeFrame)homeFrame.addEventListener('load',()=>updateHome(true));window.addEventListener('message',e=>{if(e.origin!==location.origin||!e.data||e.data.source!=='latchlings-home')return;const action=e.data.action;if(action==='play')startLevel(progress.unlocked);if(action==='daily'){const now=new Date(),seed=now.getFullYear()*372+now.getMonth()*31+now.getDate();startLevel((seed*37%400)+1)}if(action==='levels'){chapterView=Math.ceil(progress.unlocked/50);rangeView=Math.floor(((progress.unlocked-1)%50)/10);screen('levels');renderChapter()}if(action==='settings')settingsModal()});"
if old in t:t=t.replace(old,new,1)
elif "source!=='latchlings-home'" not in t:raise SystemExit('home action bridge anchor missing')

t=t.replace("document.getElementById('settingsBtn').onclick=settingsModal;","if(settingsBtn)settingsBtn.onclick=settingsModal;",1)
t=t.replace("document.getElementById('completeLevels').onclick=()=>{chapterView=8;rangeView=4;screen('levels');renderChapter()};","document.getElementById('completeLevels').onclick=()=>{chapterView=8;rangeView=4;screen('levels');renderChapter()};const completeHome=document.getElementById('completeHome');if(completeHome)completeHome.onclick=()=>screen('home');",1)
p.write_text(t)

# ---------------- title-island-concepts/index.html ----------------
p=Path('title-island-concepts/index.html')
t=p.read_text()
css_marker='/* Production embed + story progression */'
if css_marker not in t:
    css='''\n/* Production embed + story progression */
body.embed-mode{margin:0;background:transparent;overflow:hidden}
body.embed-mode .page{max-width:none;margin:0;padding:0}
body.embed-mode .intro,body.embed-mode .switcher,body.embed-mode .label,body.embed-mode .variant-note{display:none!important}
body.embed-mode .viewer{display:block}
body.embed-mode .concept{display:none!important;width:100%;margin:0}
body.embed-mode #c2{display:block!important}
body.embed-mode #c2 .phone{border-radius:0;box-shadow:none;width:100%}
#c2 .story-distant-islands{display:none;position:absolute;inset:0;z-index:1;pointer-events:none}
#c2 .story-distant-islands i{position:absolute;width:38px;height:16px;border-radius:50%;background:linear-gradient(#8fc879 0 38%,#966947 40% 100%);filter:drop-shadow(0 6px 5px rgba(47,63,77,.12));opacity:.72}
#c2 .story-distant-islands i:after{content:"";position:absolute;width:5px;height:5px;border-radius:50%;background:#f7cf66;box-shadow:0 0 8px #fff2a2;top:3px;left:17px}
#c2 .story-distant-islands .d1{left:28px;top:71px;transform:scale(.66) rotate(-4deg)}#c2 .story-distant-islands .d2{right:26px;top:103px;transform:scale(.8) rotate(5deg)}#c2 .story-distant-islands .d3{right:74px;top:34px;transform:scale(.48)}
#c2 .story-keepsake{display:none;position:absolute;z-index:16;pointer-events:none}
#c2 .story-mailbox{left:252px;top:142px;width:17px;height:13px;border-radius:5px 5px 3px 3px;background:#f5deac;border:2px solid #9b7445;box-shadow:0 3px 4px rgba(61,47,31,.14)}#c2 .story-mailbox:after{content:"";position:absolute;width:3px;height:20px;background:#815936;left:5px;top:11px;border-radius:2px}
#c2 .story-pennant{left:225px;top:104px;width:3px;height:38px;background:#7d5a38;border-radius:2px}#c2 .story-pennant:after{content:"";position:absolute;left:3px;top:3px;width:22px;height:13px;background:#8fa979;clip-path:polygon(0 0,100% 16%,72% 100%,0 72%)}
#c2 .story-anchor{left:158px;top:258px;width:34px;height:42px;z-index:1;color:#304a62;filter:drop-shadow(0 4px 4px rgba(31,43,55,.22))}#c2 .story-anchor svg{width:100%;height:100%;stroke:currentColor;fill:none;stroke-width:2.3;stroke-linecap:round;stroke-linejoin:round}
#c2 .story-bunting{left:211px;top:78px;width:94px;height:24px;border-top:2px solid rgba(101,72,45,.65);transform:rotate(4deg)}#c2 .story-bunting:after{content:"";position:absolute;left:5px;top:-1px;width:9px;height:11px;background:#e58b84;clip-path:polygon(0 0,100% 0,50% 100%);box-shadow:18px 2px 0 #f0c45e,36px 4px 0 #86ad79,54px 5px 0 #7da7df,72px 5px 0 #e58b84}
#c2 .story-telescope{left:271px;top:153px;width:28px;height:9px;border-radius:8px;background:linear-gradient(90deg,#c99a52,#6e7e7f);transform:rotate(-16deg);box-shadow:0 3px 4px rgba(46,56,60,.15)}#c2 .story-telescope:before{content:"";position:absolute;width:8px;height:13px;border-radius:3px;background:#35516a;right:-2px;top:-2px}#c2 .story-telescope:after{content:"";position:absolute;width:3px;height:24px;background:#7c5937;left:13px;top:7px;box-shadow:-7px 15px 0 -1px #7c5937,7px 15px 0 -1px #7c5937;transform-origin:top}
#c2 .story-relic{left:78px;top:153px;width:21px;height:21px;border-radius:50%;background:#f5deac;border:3px solid #b58b4d;box-shadow:0 3px 5px rgba(63,46,28,.16)}#c2 .story-relic:before,#c2 .story-relic:after{content:"";position:absolute;background:#274563;border-radius:2px}#c2 .story-relic:before{width:2px;height:13px;left:7px;top:1px;transform:rotate(26deg)}#c2 .story-relic:after{width:9px;height:2px;left:4px;top:7px;transform:rotate(26deg)}
#c2 .story-dock{left:292px;top:163px;width:54px;height:21px;border-radius:7px;background-image:linear-gradient(rgba(255,244,213,.08),rgba(68,40,23,.08)),url('textures/wood.jpg');background-size:cover,70px 70px;transform:rotate(-4deg);box-shadow:0 5px 6px rgba(54,43,32,.18)}#c2 .story-dock:after{content:"";position:absolute;inset:5px 17px;border-left:2px solid rgba(78,49,30,.3);border-right:2px solid rgba(78,49,30,.3)}
#c2 .phone.story-stage-1 .story-mailbox,#c2 .phone.story-stage-2 .story-pennant,#c2 .phone.story-stage-3 .story-anchor,#c2 .phone.story-stage-4 .story-bunting,#c2 .phone.story-stage-5 .story-telescope,#c2 .phone.story-stage-6 .story-relic,#c2 .phone.story-stage-7 .story-dock,#c2 .phone.story-stage-8 .story-distant-islands{display:block}
'''
    t=t.replace('</style>',css+'\n</style>',1)

if 'class="story-distant-islands"' not in t:
    needle='<div class="scene"><div class="island-model"><div class="island-shadow"></div><div class="float-pebbles"'
    if needle not in t:raise SystemExit('Concept 2 scene prefix not found')
    t=t.replace(needle,'<div class="scene"><div class="story-distant-islands" aria-hidden="true"><i class="d1"></i><i class="d2"></i><i class="d3"></i></div><div class="island-model"><div class="island-shadow"></div><div class="float-pebbles"',1)

if 'class="story-keepsake story-mailbox"' not in t:
    needle='<i class="float-pebble pebble-6"></i></div><div class="island-side"></div>'
    if needle not in t:raise SystemExit('Concept 2 pebble anchor not found')
    decor='''<i class="float-pebble pebble-6"></i></div><i class="story-keepsake story-mailbox"></i><i class="story-keepsake story-pennant"></i><div class="story-keepsake story-anchor"><svg viewBox="0 0 24 28"><circle cx="12" cy="4" r="2.2"/><path d="M12 6.2v15M7 10h10M5 17c1 5 4 8 7 8s6-3 7-8M5 17l-3 2M19 17l3 2"/></svg></div><i class="story-keepsake story-bunting"></i><i class="story-keepsake story-telescope"></i><i class="story-keepsake story-relic"></i><i class="story-keepsake story-dock"></i><div class="island-side"></div>'''
    t=t.replace(needle,decor,1)

if 'function initProductionEmbed()' not in t:
    embed_js='''\nfunction initProductionEmbed(){
 const params=new URLSearchParams(location.search);if(params.get('embed')!=='1')return;
 document.body.classList.add('embed-mode');show('c2');
 const c2=document.getElementById('c2'),phone=c2.querySelector('.phone'),progress=c2.querySelector('.progress span');
 const send=action=>parent.postMessage({source:'latchlings-home',action},location.origin);
 c2.querySelector('.play').addEventListener('click',()=>send('play'));
 const secondary=c2.querySelectorAll('.secondary button');if(secondary[0])secondary[0].addEventListener('click',()=>send('daily'));if(secondary[1])secondary[1].addEventListener('click',()=>send('levels'));
 c2.querySelector('.settings').addEventListener('click',()=>send('settings'));
 window.addEventListener('message',e=>{if(e.origin!==location.origin||!e.data||e.data.source!=='latchlings-game'||e.data.type!=='home-state')return;if(progress)progress.textContent=String(e.data.stars??0);for(let i=1;i<=8;i++)phone.classList.remove('story-stage-'+i);const stage=Math.max(0,Math.min(8,Number(e.data.stage)||0));for(let i=1;i<=stage;i++)phone.classList.add('story-stage-'+i);if(e.data.replay)restartLittleHomeTitle()});
 parent.postMessage({source:'latchlings-home',action:'ready'},location.origin);
}
initProductionEmbed();\n'''
    t=t.replace('</script>',embed_js+'</script>',1)
p.write_text(t)
