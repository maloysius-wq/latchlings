from pathlib import Path

p = Path('title-island-concepts/index.html')
text = p.read_text()

old_brand = '<div class="brand"><h2>Latchlings</h2><p>Home is where you latch</p><div class="brand-rule"><i></i></div></div>'
new_brand = '<div class="brand toy-brand"><h2 class="toy-logo" aria-label="Latchlings"><span aria-hidden="true">L</span><span aria-hidden="true">a</span><span aria-hidden="true">t</span><span aria-hidden="true">c</span><span aria-hidden="true">h</span><span aria-hidden="true">l</span><span aria-hidden="true">i</span><span aria-hidden="true">n</span><span aria-hidden="true">g</span><span aria-hidden="true">s</span></h2><p class="toy-tagline">Small friends. Smart puzzles.</p></div>'
if old_brand not in text:
    if new_brand not in text:
        raise SystemExit('Concept 2 brand block not found')
else:
    text = text.replace(old_brand, new_brand, 1)

css = '''
/* Selected Little Home: Wobbly Toy Letters brand */
#c2 .toy-brand{top:67px;left:15px;right:15px}
#c2 .toy-logo{margin:0;display:flex;justify-content:center;align-items:flex-end;gap:0;line-height:.84;font-family:"Arial Rounded MT Bold","Trebuchet MS",ui-rounded,system-ui,sans-serif;font-weight:950;letter-spacing:-.045em;color:transparent;text-shadow:none}
#c2 .toy-logo span{display:inline-block;font-size:45px;font-weight:950;color:#fff0c9;-webkit-text-stroke:6px var(--navy);paint-order:stroke fill;text-shadow:0 5px 0 rgba(24,57,104,.14);transform-origin:50% 80%}
#c2 .toy-logo span:nth-child(odd){transform:translateY(-2px) rotate(-2deg)}
#c2 .toy-logo span:nth-child(even){transform:translateY(2px) rotate(2deg)}
#c2 .toy-tagline{display:inline-block;margin:14px 0 0;padding:7px 14px;border-radius:999px;background:rgba(245,222,172,.94);box-shadow:0 3px 0 rgba(187,147,76,.28),0 8px 18px rgba(60,77,88,.08);color:var(--navy);font-family:Inter,ui-rounded,"Avenir Next",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:10px;font-weight:900;line-height:1;letter-spacing:.05em;text-transform:none;white-space:nowrap}
'''
if '/* Selected Little Home: Wobbly Toy Letters brand */' not in text:
    marker = '.scene{position:absolute;left:10px;right:10px;top:174px;height:399px;z-index:5}'
    if marker not in text:
        raise SystemExit('Scene CSS insertion marker not found')
    text = text.replace(marker, css + marker, 1)

p.write_text(text)
