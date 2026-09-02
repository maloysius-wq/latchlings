from pathlib import Path

p = Path('title-island-concepts/index.html')
t = p.read_text()

css = r'''
/* Selected Little Home: floating island drift */
#c2 .island-model{animation:littleHomeIslandFloat 7.6s ease-in-out infinite;transform-origin:50% 50%;will-change:transform}
#c2 .island-shadow{animation:littleHomeShadowAnchor 7.6s ease-in-out infinite;transform-origin:50% 50%;will-change:transform,opacity}
#c2 .float-pebbles{position:absolute;inset:0;z-index:1;pointer-events:none}
#c2 .float-pebble{position:absolute;display:block;background-image:linear-gradient(145deg,rgba(255,255,255,.18),rgba(66,43,29,.26)),url('textures/earth.jpg');background-size:cover,34px 34px;background-position:center;border-radius:52% 38% 46% 41%;box-shadow:inset -2px -2px 3px rgba(55,37,25,.17),0 3px 4px rgba(45,55,62,.12);animation:littleHomePebbleFloat 7.6s ease-in-out infinite;animation-delay:var(--pebble-delay);will-change:translate}
#c2 .float-pebble.pebble-1{left:28px;top:175px;width:13px;height:9px;rotate:-17deg;--pebble-delay:-.8s;--pebble-lift:-4px}
#c2 .float-pebble.pebble-2{right:22px;top:192px;width:10px;height:7px;rotate:13deg;--pebble-delay:-2.2s;--pebble-lift:-6px}
#c2 .float-pebble.pebble-3{left:46px;top:234px;width:9px;height:7px;rotate:22deg;--pebble-delay:-3.7s;--pebble-lift:-5px}
#c2 .float-pebble.pebble-4{right:42px;top:247px;width:14px;height:10px;rotate:-9deg;--pebble-delay:-5.1s;--pebble-lift:-7px}
#c2 .float-pebble.pebble-5{left:79px;top:287px;width:8px;height:6px;rotate:31deg;--pebble-delay:-6.3s;--pebble-lift:-4px}
#c2 .float-pebble.pebble-6{right:87px;top:301px;width:11px;height:8px;rotate:-24deg;--pebble-delay:-1.6s;--pebble-lift:-6px}
@keyframes littleHomeIslandFloat{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-5px)}}
@keyframes littleHomeShadowAnchor{0%,100%{transform:translateY(0) scale(1);opacity:1}50%{transform:translateY(5px) scale(.94);opacity:.78}}
@keyframes littleHomePebbleFloat{0%,100%{translate:0 2px}50%{translate:0 var(--pebble-lift,-5px)}}
'''

if '/* Selected Little Home: floating island drift */' not in t:
    marker = '#c2 .path{left:111px;top:129px;width:126px}'
    if marker not in t:
        raise SystemExit('Could not find Concept 2 placement marker')
    t = t.replace(marker, css + marker, 1)

c2_start = t.index('<section class="concept" id="c2"')
c3_start = t.index('<section class="concept" id="c3"')
before, c2, after = t[:c2_start], t[c2_start:c3_start], t[c3_start:]
if 'class="float-pebbles"' not in c2:
    old = '<div class="island-shadow"></div>'
    pebbles = '<div class="island-shadow"></div><div class="float-pebbles" aria-hidden="true"><i class="float-pebble pebble-1"></i><i class="float-pebble pebble-2"></i><i class="float-pebble pebble-3"></i><i class="float-pebble pebble-4"></i><i class="float-pebble pebble-5"></i><i class="float-pebble pebble-6"></i></div>'
    if old not in c2:
        raise SystemExit('Could not find Concept 2 island shadow markup')
    c2 = c2.replace(old, pebbles, 1)
    t = before + c2 + after

old_reduce = '@media(prefers-reduced-motion:reduce){.latchling,.face,.eyes,.mouth,.play-ball{animation:none!important}}'
new_reduce = '@media(prefers-reduced-motion:reduce){.latchling,.face,.eyes,.mouth,.play-ball,#c2 .island-model,#c2 .island-shadow,#c2 .float-pebble{animation:none!important}}'
if old_reduce in t:
    t = t.replace(old_reduce, new_reduce, 1)
elif new_reduce not in t:
    raise SystemExit('Could not locate reduced-motion rule')

p.write_text(t)
