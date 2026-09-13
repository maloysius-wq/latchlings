from pathlib import Path

p=Path('index.html')
s=p.read_text()
css6='<link rel="stylesheet" href="pass3-chapter6-copperline.css?v=20260913-ch6pass3-1">'
js6='<script src="pass3-chapter6-copperline.js?v=20260913-ch6pass3-1"></script>'
css7='<link rel="stylesheet" href="pass3-chapter7-stormswitch.css?v=20260913-ch7pass3-1">'
js7='<script src="pass3-chapter7-stormswitch.js?v=20260913-ch7pass3-1"></script>'
assert css6 in s and js6 in s
assert 'pass3-chapter7-stormswitch.css' not in s and 'pass3-chapter7-stormswitch.js' not in s
assert '<div class="story-cast" id="storyCast"></div>' in s
s=s.replace(css6,css6+'\n'+css7,1)
s=s.replace(js6,js6+'\n'+js7,1)
out=Path('/tmp/chapter7-live')
out.mkdir(parents=True,exist_ok=True)
(out/'index.html').write_text(s)
assert (out/'index.html').read_text().count('pass3-chapter7-stormswitch.css')==1
assert (out/'index.html').read_text().count('pass3-chapter7-stormswitch.js')==1
assert '<div class="story-cast" id="storyCast"></div>' in (out/'index.html').read_text()
