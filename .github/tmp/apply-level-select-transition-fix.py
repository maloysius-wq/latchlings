from pathlib import Path

p=Path('game400-a.js')
text=p.read_text()
old="const settle=()=>{if(settled)return;settled=true;if(rafA)cancelAnimationFrame(rafA);if(rafB)cancelAnimationFrame(rafB);if(animation){animation.onfinish=null;animation.oncancel=null}markReady();restore();resolveFinished();if(activeScreenTransition===controller)activeScreenTransition=null};"
new="const settle=()=>{if(settled)return;settled=true;if(rafA)cancelAnimationFrame(rafA);if(rafB)cancelAnimationFrame(rafB);if(animation){animation.onfinish=null;animation.oncancel=null;animation.cancel();animation=null}markReady();restore();resolveFinished();if(activeScreenTransition===controller)activeScreenTransition=null};"
if old not in text:
    raise SystemExit('Expected transition settle block not found')
text=text.replace(old,new,1)
p.write_text(text)
print('LEVEL_SELECT_TRANSITION_FIX_APPLIED')
