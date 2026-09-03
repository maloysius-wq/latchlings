from pathlib import Path
for name in ('story-theme400.js','style400-story-theme.css'):
    p=Path(name)
    t=p.read_text()
    if t.startswith('\\\n'):
        t=t[2:]
    elif t.startswith('\\'):
        t=t[1:]
    p.write_text(t)
    print('fixed',name)

validator=Path('.github/scripts/validate_story_theme_overhaul.mjs')
t=validator.read_text()
old="if(/\\.mp3($|\\?)/.test(u)&&/ERR_ABORTED/.test(err))return;"
new="if(/\\.(?:mp3|wav|ogg|m4a)($|\\?)/.test(u)&&/ERR_ABORTED/.test(err))return;"
if old not in t and new not in t:
    raise SystemExit('audio abort filter anchor missing')
t=t.replace(old,new,1)
validator.write_text(t)
print('audio navigation-abort filter hardened')
