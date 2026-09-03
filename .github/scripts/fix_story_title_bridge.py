from pathlib import Path

# The approved title surface is embedded same-origin in production. Prefer a direct parent
# action contract so title buttons behave synchronously, with postMessage retained as fallback.
p=Path('game400-b.js')
t=p.read_text()
old="window.addEventListener('message',e=>{if(e.origin!==location.origin||!e.data||e.data.source!=='latchlings-home')return;const action=e.data.action;if(action==='play')startLevel(progress.unlocked);if(action==='daily'){const now=new Date(),seed=now.getFullYear()*372+now.getMonth()*31+now.getDate();startLevel((seed*37%400)+1)}if(action==='levels'){chapterView=Math.ceil(progress.unlocked/50);rangeView=Math.floor(((progress.unlocked-1)%50)/10);screen('levels');renderChapter()}if(action==='settings')settingsModal()});"
new="window.LatchlingsHomeAction=action=>{if(action==='play')startLevel(progress.unlocked);if(action==='daily'){const now=new Date(),seed=now.getFullYear()*372+now.getMonth()*31+now.getDate();startLevel((seed*37%400)+1)}if(action==='levels'){chapterView=Math.ceil(progress.unlocked/50);rangeView=Math.floor(((progress.unlocked-1)%50)/10);screen('levels');renderChapter()}if(action==='settings')settingsModal()};window.addEventListener('message',e=>{if(e.origin!==location.origin||!e.data||e.data.source!=='latchlings-home')return;window.LatchlingsHomeAction(e.data.action)});"
if old in t:
    t=t.replace(old,new,1)
elif 'window.LatchlingsHomeAction=action=>' not in t:
    raise SystemExit('Generated parent home-action bridge not found')
p.write_text(t)

p=Path('title-island-concepts/index.html')
t=p.read_text()
old="const send=action=>parent.postMessage({source:'latchlings-home',action},location.origin);"
new="const send=action=>{if(parent&&typeof parent.LatchlingsHomeAction==='function'){parent.LatchlingsHomeAction(action);return}parent.postMessage({source:'latchlings-home',action},location.origin)};"
if old in t:
    t=t.replace(old,new,1)
elif "typeof parent.LatchlingsHomeAction==='function'" not in t:
    raise SystemExit('Generated embedded home send bridge not found')
p.write_text(t)
