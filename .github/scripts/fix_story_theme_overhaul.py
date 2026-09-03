from pathlib import Path
p=Path('story-theme400.js')
t=p.read_text()
t=t.replace("const SEEN_KEY='latchlings_story_cards_seen_v1';","const SEEN_KEY='latchlings_story_cards_seen_v1';\nlet activeLevel=1;",1)
t=t.replace("function decorateLevel(level,meta){meta=meta||", "function decorateLevel(level,meta){activeLevel=Number(level)||activeLevel;meta=meta||",1)
t=t.replace("function enterLevel(level){if(!STORY)return;", "function enterLevel(level){activeLevel=Number(level)||activeLevel;if(!STORY)return;",1)
t=t.replace("const level=Number(overlay.dataset.level)||window.currentLevel||1;", "const level=Number(overlay.dataset.level)||activeLevel;",1)
t=t.replace("trigger.onclick=()=>show(window.currentLevel||1,true)", "trigger.onclick=()=>show(activeLevel,true)",1)
p.write_text(t)

p=Path('style400-story-theme.css')
t=p.read_text()
t += '''\n/* Keep decorative story props inside the viewport; the board sits above them so they peek from behind its frame without obscuring cells. */\n.level-prop.prop-pos-1{left:2px;top:11%;transform:rotate(-8deg) scale(.92)}\n.level-prop.prop-pos-2{right:2px;bottom:16%;transform:rotate(7deg) scale(.88)}\n.level-prop.prop-pos-3{left:7%;bottom:-3px;transform:rotate(4deg) scale(.68);opacity:.56}\n@media(max-width:520px){.level-prop.prop-pos-1{left:1px;top:8%}.level-prop.prop-pos-2{right:1px;bottom:14%}}\n'''
p.write_text(t)
print('STORY_THEME_FIXES_APPLIED')
