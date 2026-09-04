from pathlib import Path

# Ensure the scene-only title document itself is transparent, not just its body.
p=Path('title-island-concepts/index.html')
s=p.read_text()
old='body.cinematic-mode{width:100vw;height:100vh;min-height:0!important;margin:0;background:transparent!important;overflow:hidden!important}'
new='html.cinematic-mode,body.cinematic-mode{width:100vw;height:100vh;min-height:0!important;margin:0;background:transparent!important;overflow:hidden!important}'
if s.count(old)!=1:
    raise SystemExit(f'cinematic mode CSS anchor count {s.count(old)}')
s=s.replace(old,new)
old=" const cinematic=params.get('cinematic')==='1';\n document.body.classList.add('embed-mode');if(cinematic)document.body.classList.add('cinematic-mode');show('c2');"
new=" const cinematic=params.get('cinematic')==='1';\n document.body.classList.add('embed-mode');if(cinematic){document.documentElement.classList.add('cinematic-mode');document.body.classList.add('cinematic-mode')}show('c2');"
if s.count(old)!=1:
    raise SystemExit(f'cinematic mode JS anchor count {s.count(old)}')
s=s.replace(old,new)
p.write_text(s)

# Load final refinement after the main polish layer.
p=Path('index.html')
s=p.read_text()
link='<link rel="stylesheet" href="style400-cinematics-refine.css">'
if link not in s:
    anchor='<link rel="stylesheet" href="style400-cinematics-polish.css">'
    if s.count(anchor)!=1:
        raise SystemExit(f'polish loader anchor count {s.count(anchor)}')
    s=s.replace(anchor,anchor+'\n'+link,1)
p.write_text(s)
