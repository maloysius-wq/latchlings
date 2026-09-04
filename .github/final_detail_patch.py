from pathlib import Path

p=Path('cinematics400.js');s=p.read_text()
old='<div class="cin-telescope"><i class="tube"></i><i class="lens"></i></div>${character(\'Tansy\',\'lookout-tansy\')}'
new='<div class="cin-telescope"><i class="tube"></i><i class="lens"></i><span class="cin-telescope-mount"><b></b><b></b><b></b></span></div>${character(\'Tansy\',\'lookout-tansy\')}'
if s.count(old)!=1: raise SystemExit(f'telescope markup anchor count {s.count(old)}')
p.write_text(s.replace(old,new))

p=Path('index.html');s=p.read_text();link='<link rel="stylesheet" href="style400-cinematics-refine2.css">'
if link not in s:
    anchor='<link rel="stylesheet" href="style400-cinematics-refine.css">'
    if s.count(anchor)!=1: raise SystemExit(f'refine loader anchor count {s.count(anchor)}')
    s=s.replace(anchor,anchor+'\n'+link,1)
p.write_text(s)
