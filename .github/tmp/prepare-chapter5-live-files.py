from pathlib import Path

index = Path('index.html')
s = index.read_text()
css_anchor = '<link rel="stylesheet" href="style400-production-slice.css?v=20260912-ch4pass3-1">'
css_line = '<link rel="stylesheet" href="pass3-chapter5-prism.css?v=20260913-ch5modular-1">'
if css_line not in s:
    if s.count(css_anchor) != 1:
        raise SystemExit(f'index CSS anchor count was {s.count(css_anchor)}, expected 1')
    s = s.replace(css_anchor, css_anchor + '\n' + css_line, 1)
js_anchor = '<script src="game400-b.js?v=20260912-ch4pass3-1"></script>'
js_line = '<script src="pass3-chapter5-prism.js?v=20260913-ch5modular-1"></script>'
if js_line not in s:
    if s.count(js_anchor) != 1:
        raise SystemExit(f'index JS anchor count was {s.count(js_anchor)}, expected 1')
    s = s.replace(js_anchor, js_anchor + '\n' + js_line, 1)
index.write_text(s)

art = Path('LEVEL_SELECT_ART_DIRECTION.md')
a = art.read_text()
shape = "- Shape source: greenhouse arches and radial flower forms, stylized rather than photo-real."
landmark = "- Recurring landmark: a pale glasshouse lookout / sighting arch with a compact brass scope aimed toward two distant amber porch lights; reuse it in Chapter 5 Atlas/reward surfaces so Prism's wider regional view visibly reconnects to the familiar Lanternwood friend porch."
if landmark not in a:
    if a.count(shape) != 1:
        raise SystemExit(f'Prism shape-source anchor count was {a.count(shape)}, expected 1')
    a = a.replace(shape, shape + '\n' + landmark, 1)
art.write_text(a)

assert s.count(css_line) == 1
assert s.count(js_line) == 1
assert a.count(landmark) == 1
print('CHAPTER5_LIVE_FILES_PREPARED')
