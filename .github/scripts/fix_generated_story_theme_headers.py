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
