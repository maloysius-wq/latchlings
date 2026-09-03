from pathlib import Path

# The approved title surface is embedded same-origin in production. Production owns the
# navigation contract directly; the embedded surface keeps postMessage as a fallback for
# standalone preview use. Home modals also avoid backdrop-filter over the live animated
# iframe because that combination can stall Chromium/mobile compositors.
p=Path('game400-b.js')
t=p.read_text()
old_bridge="const homeFrame=document.getElementById('homeTitleFrame');if(homeFrame)homeFrame.addEventListener('load',()=>updateHome(true));window.addEventListener('message',e=>{if(e.origin!==location.origin||!e.data||e.data.source!=='latchlings-home')return;const action=e.data.action;if(action==='play')startLevel(progress.unlocked);if(action==='daily'){const now=new Date(),seed=now.getFullYear()*372+now.getMonth()*31+now.getDate();startLevel((seed*37%400)+1)}if(action==='levels'){chapterView=Math.ceil(progress.unlocked/50);rangeView=Math.floor(((progress.unlocked-1)%50)/10);screen('levels');renderChapter()}if(action==='settings')settingsModal()});"
new_bridge="const homeFrame=document.getElementById('homeTitleFrame');window.LatchlingsHomeAction=action=>{if(action==='play')startLevel(progress.unlocked);if(action==='daily'){const now=new Date(),seed=now.getFullYear()*372+now.getMonth()*31+now.getDate();startLevel((seed*37%400)+1)}if(action==='levels'){chapterView=Math.ceil(progress.unlocked/50);rangeView=Math.floor(((progress.unlocked-1)%50)/10);screen('levels');renderChapter()}if(action==='settings')settingsModal()};const wireHomeFrame=()=>{const d=homeFrame?.contentDocument;if(!d)return;const bindHome=(sel,action)=>{const el=d.querySelector(sel);if(!el||el.dataset.parentBound==='1')return;el.dataset.parentBound='1';el.addEventListener('click',()=>window.LatchlingsHomeAction(action))};bindHome('#c2 .play','play');bindHome('#c2 .secondary button:nth-child(1)','daily');bindHome('#c2 .secondary button:nth-child(2)','levels');bindHome('#c2 .settings','settings');updateHome(true)};if(homeFrame){homeFrame.addEventListener('load',wireHomeFrame);if(homeFrame.contentDocument?.readyState==='complete')setTimeout(wireHomeFrame,0)}window.addEventListener('message',e=>{if(e.origin!==location.origin||!e.data||e.data.source!=='latchlings-home')return;if(e.data.action==='ready'){wireHomeFrame();return}window.LatchlingsHomeAction(e.data.action)});"
if old_bridge in t:
    t=t.replace(old_bridge,new_bridge,1)
elif 'const wireHomeFrame=()=>{' not in t:
    raise SystemExit('Generated parent home-action bridge not found')

old_modal="function modal(html){document.getElementById('modal').innerHTML=html;document.getElementById('overlay').classList.add('show')}function closeModal(){document.getElementById('overlay').classList.remove('show')}"
new_modal="function modal(html){const overlay=document.getElementById('overlay');document.getElementById('modal').innerHTML=html;overlay.classList.toggle('home-overlay',!!document.getElementById('home')?.classList.contains('active'));overlay.classList.add('show')}function closeModal(){document.getElementById('overlay').classList.remove('show','home-overlay')}"
if old_modal in t:
    t=t.replace(old_modal,new_modal,1)
elif "classList.toggle('home-overlay'" not in t:
    raise SystemExit('Generated modal helper not found')
p.write_text(t)

p=Path('style400-game.css')
t=p.read_text()
if '.overlay.home-overlay{' not in t:
    t += "\n/* Avoid expensive live blur over the animated production-home iframe. */\n.overlay.home-overlay{backdrop-filter:none;-webkit-backdrop-filter:none}\n"
p.write_text(t)

p=Path('title-island-concepts/index.html')
t=p.read_text()
old_send="const send=action=>parent.postMessage({source:'latchlings-home',action},location.origin);"
new_send="const send=action=>{if(parent&&typeof parent.LatchlingsHomeAction==='function'){parent.LatchlingsHomeAction(action);return}parent.postMessage({source:'latchlings-home',action},location.origin)};"
if old_send in t:
    t=t.replace(old_send,new_send,1)
elif "typeof parent.LatchlingsHomeAction==='function'" not in t:
    raise SystemExit('Generated embedded home send bridge not found')
old_listeners="c2.querySelector('.play').addEventListener('click',()=>send('play'));\n const secondary=c2.querySelectorAll('.secondary button');if(secondary[0])secondary[0].addEventListener('click',()=>send('daily'));if(secondary[1])secondary[1].addEventListener('click',()=>send('levels'));\n c2.querySelector('.settings').addEventListener('click',()=>send('settings'));"
new_listeners="const bindEmbed=(el,action)=>{if(!el)return;el.addEventListener('click',()=>{if(el.dataset.parentBound==='1')return;send(action)})};\n bindEmbed(c2.querySelector('.play'),'play');\n const secondary=c2.querySelectorAll('.secondary button');bindEmbed(secondary[0],'daily');bindEmbed(secondary[1],'levels');\n bindEmbed(c2.querySelector('.settings'),'settings');"
if old_listeners in t:
    t=t.replace(old_listeners,new_listeners,1)
elif "const bindEmbed=(el,action)=>" not in t:
    raise SystemExit('Generated embedded button listeners not found')
p.write_text(t)
