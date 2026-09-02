from pathlib import Path
import re

p = Path('title-island-concepts/index.html')
t = p.read_text()

old = '#c2 .rock.r1{left:43px;top:159px}'
new = '#c2 .rock.r1{left:58px;top:159px}'
if old not in t and new not in t:
    raise SystemExit('Concept 2 rock placement token not found')
t = t.replace(old, new, 1)

t = t.replace('#c2 .deck{left:102px;top:137px;width:77px}', '', 1)
c2_start = t.index('<section class="concept" id="c2"')
c3_start = t.index('<section class="concept" id="c3"')
before = t[:c2_start]
c2 = t[c2_start:c3_start]
after = t[c3_start:]
c2, n = re.subn(r'<div class="deck(?: [^"]*)?"></div>\s*', '', c2, count=1)
if n != 1 and 'class="deck' in c2:
    raise SystemExit('Could not remove Concept 2 deck/platform cleanly')
t = before + c2 + after

cloud_css = r'''
/* Selected Little Home: soft, asymmetric drifting cloud field */
#c2 .cloud{width:112px;height:30px;border-radius:54% 46% 51% 49%/72% 68% 43% 46%;background:linear-gradient(180deg,rgba(255,255,255,.86),rgba(247,252,255,.52));box-shadow:inset 0 3px 7px rgba(255,255,255,.28),inset 0 -6px 10px rgba(120,153,181,.08);filter:drop-shadow(0 10px 17px rgba(67,98,125,.08));opacity:.74;animation:littleHomeCloudDrift var(--cloud-speed,40s) ease-in-out infinite;animation-delay:var(--cloud-delay,0s);will-change:translate;pointer-events:none}
#c2 .cloud:before{width:51px;height:47px;left:12px;bottom:5px;border-radius:61% 39% 50% 50%/54% 48% 52% 46%;background:linear-gradient(145deg,rgba(255,255,255,.93),rgba(243,250,254,.58));box-shadow:34px 7px 0 -6px rgba(255,255,255,.62)}
#c2 .cloud:after{width:61px;height:55px;right:7px;bottom:0;border-radius:44% 56% 47% 53%/59% 45% 55% 41%;background:linear-gradient(155deg,rgba(255,255,255,.88),rgba(241,249,253,.54))}
#c2 .cloud.a{left:-40px;top:184px;transform:scale(.9);--cloud-speed:38s;--cloud-delay:-11s;--cloud-start:-14px;--cloud-end:25px;--cloud-lift:-3px;opacity:.70}
#c2 .cloud.b{right:-34px;top:234px;transform:scale(.73);--cloud-speed:46s;--cloud-delay:-27s;--cloud-start:18px;--cloud-end:-24px;--cloud-lift:2px;opacity:.62}
#c2 .cloud.c{left:16px;top:405px;transform:scale(.58);--cloud-speed:53s;--cloud-delay:-34s;--cloud-start:-9px;--cloud-end:31px;--cloud-lift:-2px;opacity:.48}
#c2 .cloud.d{right:12px;top:374px;transform:scale(.51);--cloud-speed:42s;--cloud-delay:-19s;--cloud-start:17px;--cloud-end:-22px;--cloud-lift:3px;opacity:.44}
@keyframes littleHomeCloudDrift{0%,100%{translate:var(--cloud-start,-14px) 0}50%{translate:var(--cloud-end,24px) var(--cloud-lift,-2px)}}
'''
if '/* Selected Little Home: soft, asymmetric drifting cloud field */' not in t:
    marker = '#c2 .path{'
    idx = t.index(marker)
    t = t[:idx] + cloud_css + t[idx:]

p.write_text(t)
