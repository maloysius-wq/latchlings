from pathlib import Path

index=Path('index.html')
s=index.read_text()
css='<link rel="stylesheet" href="pass3-chapter7-stormswitch.css?v=20260913-ch7pass3-1">'
js='<script src="pass3-chapter7-stormswitch.js?v=20260913-ch7pass3-1"></script>'
new_css='<link rel="stylesheet" href="pass3-chapter8-aurora.css?v=20260913-ch8pass3-1">'
new_js='<script src="pass3-chapter8-aurora.js?v=20260913-ch8pass3-1"></script>'
assert css in s and js in s
assert 'pass3-chapter8-aurora.css' not in s and 'pass3-chapter8-aurora.js' not in s
s=s.replace(css,css+'\n'+new_css,1)
s=s.replace(js,js+'\n'+new_js,1)
index.write_text(s)

art=Path('LEVEL_SELECT_ART_DIRECTION.md')
a=art.read_text()
needle='- Shape source: ice/crystal facets and atmospheric aurora bands translated into the established Latchlings celestial palette.\n'
note='- Recurring landmark: a pale crown-shaped convergence beacon where historical and newly drawn route-light strands meet but visibly continue onward; reuse it in Chapter 8 movement 1 and the Level 400 reward so Aurora Crown reads as a meeting point in the living Skyway, never a central master switch.\n'
assert needle in a and note not in a
a=a.replace(needle,needle+note,1)
art.write_text(a)
