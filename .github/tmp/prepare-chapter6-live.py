from pathlib import Path

out=Path('/tmp/chapter6-live')
out.mkdir(parents=True,exist_ok=True)

index=Path('index.html')
s=index.read_text()
css5='<link rel="stylesheet" href="pass3-chapter5-prism.css?v=20260913-ch5modular-1">'
js5='<script src="pass3-chapter5-prism.js?v=20260913-ch5modular-1"></script>'
css6='<link rel="stylesheet" href="pass3-chapter6-copperline.css?v=20260913-ch6pass3-1">'
js6='<script src="pass3-chapter6-copperline.js?v=20260913-ch6pass3-1"></script>'
assert css5 in s and js5 in s
assert 'pass3-chapter6-copperline.css' not in s and 'pass3-chapter6-copperline.js' not in s
bad='<div id="story-cast" id="storyCast"></div>'
good='<div class="story-cast" id="storyCast"></div>'
assert s.count(bad)==1 and good not in s
s=s.replace(bad,good,1)
s=s.replace(css5,css5+'\n'+css6,1)
s=s.replace(js5,js5+'\n'+js6,1)
(out/'index.html').write_text(s)

art=Path('LEVEL_SELECT_ART_DIRECTION.md').read_text()
anchor='### 6. Copperline Junction\n- Material: **Rusty Metal 02**, Poly Haven CC0, Rob Tuytel. https://polyhaven.com/a/rusty_metal_02\n- Object vocabulary: rails, switch stands, station canopies, signal posts, turntables and riveted route hardware.\n- Shape source: railway signaling/track geometry reduced to chunky toy-like silhouettes.'
assert anchor in art
note='- Recurring landmark: a compact station archive / timetable kiosk holding three staggered approved route plates from different years beside rail and signal hardware; reuse it in Chapter 6 Atlas/reward surfaces so “they were all correct” reads as physical maintenance evidence rather than an abstract lesson.'
assert note not in art
art=art.replace(anchor,anchor+'\n'+note,1)
(out/'LEVEL_SELECT_ART_DIRECTION.md').write_text(art)

handoff=Path('DEVELOPMENT_HANDOFF.md').read_text()
scope_anchor='**Expected product files/systems:** new `pass3-chapter6-copperline.css`, new `pass3-chapter6-copperline.js`, `LEVEL_SELECT_ART_DIRECTION.md`, and `index.html`. Chapters 1–5 product assets and all shared runtime files are protected. All eight `campaign400-*.js` files, authored solutions, `story400.js`, `story-grounding400.js`, `STORY_BIBLE.md`, `cinematics400.js`, cinematic dialogue, audio, movement simulation/rules, `game400-a.js`, `game400-b.js`, shared board/Atlas/production styles, Little Home source, and Chapters 7–8 behavior are protected from change. Temporary validation/preparation helpers are not product.'
scope_note='**Scope-change / critical continuity fix:** During Chapter 6 live-promotion preparation, current `index.html` was found to contain `<div id="story-cast" id="storyCast"></div>` instead of the intended `<div class="story-cast" id="storyCast"></div>`. Because the duplicate `id` markup prevents the Story & Residents runtime from reliably finding `#storyCast` and also drops its styling class, this is treated as a critical pre-existing continuity defect. The Chapter 6 live-index promotion will restore the intended class/id markup and the final live-build validator will assert that `#storyCast.story-cast` exists. No story content or behavior is otherwise changed.'
assert scope_anchor in handoff and scope_note not in handoff
handoff=handoff.replace(scope_anchor,scope_anchor+'\n\n'+scope_note,1)
(out/'DEVELOPMENT_HANDOFF.md').write_text(handoff)

live=(out/'index.html').read_text()
assert live.count('pass3-chapter6-copperline.css')==1
assert live.count('pass3-chapter6-copperline.js')==1
assert live.count(good)==1 and bad not in live
