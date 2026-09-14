from pathlib import Path

# Parent: expose earned memories through one non-overlapping, focus-managed control path.
p=Path('game400-b.js')
s=p.read_text()
needle="function homeMemoryModal(key){const memory=HOME_KEEPSAKE_MEMORIES[key];if(!memory)return;modal(`<section class=\"home-memory-card\" aria-label=\"Little Home memory\"><div class=\"theme-kicker\">Little Home memory · ${memory.chapter}</div><h2>${memory.title}</h2><p>${memory.text}</p><div class=\"modal-actions\"><button class=\"primary-small\" id=\"homeMemoryStory\">Open Story & Residents</button><button class=\"secondary-small\" id=\"homeMemoryClose\">Back to Little Home</button></div></section>`);document.getElementById('homeMemoryStory').onclick=()=>{closeModal();openStoryScreen()};document.getElementById('homeMemoryClose').onclick=closeModal}"
assert needle in s
addition=needle+"\nconst HOME_MEMORY_ORDER=[['mailbox',1],['pennant',2],['anchor',3],['bunting',4],['telescope',5],['relic',6],['dock',7]];\nfunction homeMemoriesModal(){const stage=STORY?STORY.completedChapters(progress):0,earned=HOME_MEMORY_ORDER.filter(([,required])=>stage>=required);modal(`<section class=\"home-memory-card home-memory-index\" aria-label=\"Little Home memories\"><div class=\"theme-kicker\">Little Home · earned keepsakes</div><h2>Memories</h2><p>${earned.length?'Choose a keepsake to remember what changed when that route came home.':'Restore your first chapter to bring a keepsake home.'}</p>${earned.length?`<div class=\"home-memory-list\">${earned.map(([key])=>{const memory=HOME_KEEPSAKE_MEMORIES[key];return `<button class=\"secondary-small home-memory-choice\" data-memory-key=\"${key}\"><strong>${memory.title}</strong><span>${memory.chapter}</span></button>`}).join('')}</div>`:''}<div class=\"modal-actions\"><button class=\"primary-small\" id=\"homeMemoriesClose\">Back to Little Home</button></div></section>`);document.querySelectorAll('.home-memory-choice').forEach(button=>button.onclick=()=>homeMemoryModal(button.dataset.memoryKey));document.getElementById('homeMemoriesClose').onclick=closeModal}"
s=s.replace(needle,addition,1)
old="if(action==='settings')settingsModal();if(action==='story')openStoryScreen()};"
new="if(action==='settings')settingsModal();if(action==='story')openStoryScreen();if(action==='memories')homeMemoriesModal()};"
assert old in s
s=s.replace(old,new,1)
old="bindHome('#c2 .story-home','story');bindHome('#c2 .settings','settings');updateHome(true)};"
new="bindHome('#c2 .story-home','story');bindHome('#c2 .memories-home','memories');bindHome('#c2 .settings','settings');updateHome(true)};"
assert old in s
s=s.replace(old,new,1)
p.write_text(s)

# Little Home: add Memories to the existing top-right tool cluster and wire it through the embed bridge.
p=Path('title-island-concepts/index.html')
s=p.read_text()
marker='</button><button class="settings" aria-label="Settings">'
assert s.count(marker)>=1
# Only Little Home has story-home directly before settings, so target the precise local sequence.
local='</svg></button><button class="settings" aria-label="Settings"><svg viewBox="0 0 24 24">'
replacement='</svg></button><button class="memories-home" aria-label="Memories" title="Memories"><span aria-hidden="true">✦</span></button><button class="settings" aria-label="Settings"><svg viewBox="0 0 24 24">'
assert s.count(local)==1
s=s.replace(local,replacement,1)
css='''\n#c2 .home-tools{display:flex;align-items:center;gap:6px}\n#c2 .home-tools button{width:44px;height:44px;min-width:44px;min-height:44px}\n#c2 .memories-home{display:grid;place-items:center;border:0;border-radius:50%;background:rgba(255,248,231,.92);color:var(--navy);box-shadow:0 5px 14px rgba(41,59,81,.10);font-size:22px;font-weight:900;cursor:pointer}\n#c2 .memories-home:hover{filter:brightness(1.02)}\n'''
assert '</style>' in s
s=s.replace('</style>',css+'</style>',1)
old="bindEmbed(c2.querySelector('.story-home'),'story');bindEmbed(c2.querySelector('.settings'),'settings');"
new="bindEmbed(c2.querySelector('.story-home'),'story');bindEmbed(c2.querySelector('.memories-home'),'memories');bindEmbed(c2.querySelector('.settings'),'settings');"
assert old in s
s=s.replace(old,new,1)
p.write_text(s)

# Parent modal list styling uses the shared modal surface rather than a new presentation layer.
p=Path('style400-ui.css')
s=p.read_text()
s += '''\n.home-memory-list{display:grid;gap:8px;margin:14px 0}.home-memory-choice{width:100%;min-height:52px;text-align:left;display:grid;gap:2px;align-content:center}.home-memory-choice strong{font-size:14px;color:var(--navy)}.home-memory-choice span{font-size:11px;color:var(--muted);font-weight:750}\n'''
p.write_text(s)

print('accessible Memories path added')
