from pathlib import Path
p=Path('style400-story-theme.css')
t=p.read_text()
marker='/* Visible story-prop medallion refinement */'
if marker not in t:
    t += r'''

/* Visible story-prop medallion refinement */
.level-props{z-index:3}
.level-prop{width:38px;height:38px;padding:6px;border-radius:50%;background:rgba(255,248,230,.84);border:1px solid color-mix(in srgb,var(--propPrimary) 45%,rgba(130,105,70,.42));box-shadow:0 4px 10px rgba(22,38,50,.13),inset 0 1px rgba(255,255,255,.62);opacity:.92;backdrop-filter:blur(2px)}
.level-prop svg{stroke-width:3.2}
.level-prop.prop-pos-1{left:24px;top:7px;transform:rotate(-6deg)}
.level-prop.prop-pos-2{right:24px;top:7px;bottom:auto;transform:rotate(6deg) scale(.96)}
.level-prop.prop-pos-3{left:auto;right:72px;bottom:5px;transform:rotate(3deg) scale(.82);opacity:.72}
#game .board{z-index:2}
@media(max-width:520px){.level-prop{width:34px;height:34px;padding:5px}.level-prop.prop-pos-1{left:20px;top:9px}.level-prop.prop-pos-2{right:20px;top:9px}.level-prop.prop-pos-3{right:60px;bottom:4px;display:grid}}
@media(max-height:720px){.level-prop.prop-pos-3{display:none}.level-prop.prop-pos-1,.level-prop.prop-pos-2{top:4px}}
'''
p.write_text(t)
print('LEVEL_PROP_MEDALLIONS_REFINED')
