from pathlib import Path

# Replace the home Settings modal with a dedicated parent Story/Settings screen.
# This avoids compositing a live animated iframe under the modal overlay while keeping
# story, resident, current-chapter, and rules access available from the approved home.

# ---------- index.html ----------
p=Path('index.html')
t=p.read_text()
if 'id="story" class="screen story-screen"' not in t:
    anchor='''  <main id="game" class="screen">'''
    story='''  <main id="story" class="screen story-screen" aria-label="Story and residents">
    <div class="topbar card story-topbar"><button class="iconbtn" id="storyBack" aria-label="Back"></button><div class="game-title" style="font-size:22px">Story &amp; Residents</div><div class="spacer"></div><button class="story-rules-btn" id="storyRules">Rules</button></div>
    <section class="story-screen-card card">
      <div class="theme-kicker">The Latchlands</div>
      <h1>Little Home</h1>
      <p id="storyPremise"></p>
      <div class="story-role-card" id="storyRole"></div>
      <h2>Residents</h2>
      <div class="story-cast" id="storyCast"></div>
      <h2>Current chapter</h2>
      <div class="story-current-chapter" id="storyChapter"></div>
    </section>
  </main>

'''
    if anchor not in t: raise SystemExit('Game screen anchor not found for story screen insertion')
    t=t.replace(anchor,story+anchor,1)
p.write_text(t)

# ---------- style400-game.css ----------
p=Path('style400-game.css')
t=p.read_text()
marker='/* Dedicated Story & Residents screen */'
if marker not in t:
    t += '''\n\n/* Dedicated Story & Residents screen */
.story-screen{gap:12px;padding-bottom:18px;overflow-y:auto}
.story-topbar{flex:0 0 auto}
.story-rules-btn{border:0;border-radius:999px;padding:8px 12px;background:#f5deac;color:#29445c;font-weight:900;box-shadow:0 3px 0 rgba(185,142,78,.65);cursor:pointer}
.story-screen-card{padding:18px 18px 22px;text-align:left;overflow:visible}
.story-screen-card h1{margin:2px 0 8px;color:#173a67;font-family:Georgia,serif;font-size:30px;line-height:1}
.story-screen-card h2{margin:20px 0 8px;color:#173a67;font-family:Georgia,serif;font-size:20px}
.story-screen-card>p{margin:0;color:#526d85;font-size:13px;line-height:1.48}
.story-role-card{margin-top:12px;padding:12px 13px;border-radius:15px;background:rgba(245,222,172,.48);border:1px solid rgba(190,151,91,.42);color:#4b6479;font-size:12px;line-height:1.42}
.story-role-card strong{display:block;margin-bottom:3px;color:#173a67;font-size:14px}
.story-current-chapter{padding:13px 14px;border-radius:16px;background:rgba(255,248,232,.74);border:1px solid rgba(208,182,145,.58)}
.story-current-chapter strong{display:block;color:#173a67;font-family:Georgia,serif;font-size:18px;margin-bottom:3px}
.story-current-chapter span{display:block;color:#657d91;font-size:11px;font-weight:850;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}
.story-current-chapter p{margin:0;color:#526d85;font-size:12px;line-height:1.42}
@media(max-width:430px){.story-screen{padding-left:12px;padding-right:12px}.story-screen-card{padding:16px 15px 20px}}
'''
p.write_text(t)

# ---------- game400-b.js ----------
p=Path('game400-b.js')
t=p.read_text()
if 'function renderStoryScreen(){' not in t:
    anchor='function settingsModal(){'
    if anchor not in t: raise SystemExit('settingsModal anchor missing for story screen runtime')
    fn="""function renderStoryScreen(){if(!STORY)return;const ch=STORY.currentChapter(progress),c=STORY.chapters[ch-1],premise=document.getElementById('storyPremise'),role=document.getElementById('storyRole'),cast=document.getElementById('storyCast'),chapter=document.getElementById('storyChapter');if(premise)premise.textContent=STORY.premise;if(role)role.innerHTML=`<strong>You are the ${STORY.playerRole}</strong>The Skyway is a living route network built to change as the floating islands drift. Your puzzle routes are the everyday work of keeping homes and neighbors connected.`;if(cast)cast.innerHTML=STORY.cast.map(x=>`<div class=\"story-person\"><strong>${x.name}</strong><span>${x.role}. ${x.voice}</span></div>`).join('');if(chapter)chapter.innerHTML=`<strong>Chapter ${ch}: ${c.name}</strong><span>${c.theme}</span><p>${c.desc}</p>`}
function openStoryScreen(){screen('story');renderStoryScreen()}
"""
    t=t.replace(anchor,fn+anchor,1)

# Production home settings route goes to the dedicated screen, not a modal.
t=t.replace("if(action==='settings')settingsModal()","if(action==='settings')openStoryScreen()")
t=t.replace("if(settingsBtn)settingsBtn.onclick=settingsModal;","if(settingsBtn)settingsBtn.onclick=openStoryScreen;")

# Wire Story screen controls once the normal bind has initialized shared icons/functions.
if "const storyBackBtn=document.getElementById('storyBack')" not in t:
    old='bind();'
    new="bind();const storyBackBtn=document.getElementById('storyBack'),storyRulesBtn=document.getElementById('storyRules');if(storyBackBtn){storyBackBtn.innerHTML=icon('back');storyBackBtn.onclick=()=>screen('home')}if(storyRulesBtn)storyRulesBtn.onclick=rulesModal;"
    if old not in t: raise SystemExit('bind() terminator missing for story screen controls')
    t=t.replace(old,new,1)
p.write_text(t)
