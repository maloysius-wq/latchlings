from pathlib import Path

index=Path('index.html')
s=index.read_text()
css5='<link rel="stylesheet" href="pass3-chapter5-prism.css?v=20260913-ch5modular-1">'
js5='<script src="pass3-chapter5-prism.js?v=20260913-ch5modular-1"></script>'
css6='<link rel="stylesheet" href="pass3-chapter6-copperline.css?v=20260913-ch6pass3-1">'
js6='<script src="pass3-chapter6-copperline.js?v=20260913-ch6pass3-1"></script>'
assert css5 in s and js5 in s
assert 'pass3-chapter6-copperline.css' not in s and 'pass3-chapter6-copperline.js' not in s
s=s.replace(css5,css5+'\n'+css6,1)
s=s.replace(js5,js5+'\n'+js6,1)
Path('/tmp/chapter6-live').mkdir(parents=True,exist_ok=True)
Path('/tmp/chapter6-live/index.html').write_text(s)

art=Path('LEVEL_SELECT_ART_DIRECTION.md').read_text()
anchor='### 6. Copperline Junction\n- Material: **Rusty Metal 02**, Poly Haven CC0, Rob Tuytel. https://polyhaven.com/a/rusty_metal_02\n- Object vocabulary: rails, switch stands, station canopies, signal posts, turntables and riveted route hardware.\n- Shape source: railway signaling/track geometry reduced to chunky toy-like silhouettes.'
assert anchor in art
note='- Recurring landmark: a compact station archive / timetable kiosk holding three staggered approved route plates from different years beside rail and signal hardware; reuse it in Chapter 6 Atlas/reward surfaces so “they were all correct” reads as physical maintenance evidence rather than an abstract lesson.'
assert note not in art
art=art.replace(anchor,anchor+'\n'+note,1)
Path('/tmp/chapter6-live/LEVEL_SELECT_ART_DIRECTION.md').write_text(art)

assert Path('/tmp/chapter6-live/index.html').read_text().count('pass3-chapter6-copperline.css')==1
assert Path('/tmp/chapter6-live/index.html').read_text().count('pass3-chapter6-copperline.js')==1
