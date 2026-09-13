from pathlib import Path

# Move the movement-3 lookout out from behind the Level 221 island and point the scope/lights into open map space.
p=Path('style400-skyway-atlas.css')
s=p.read_text()
old='.theme-ch5 .atlas-map.atlas-range-3 .atlas-scene em{left:7%;bottom:10%;width:82px;height:69px;border:8px solid rgba(224,250,246,.82);border-bottom:0;border-radius:42px 42px 0 0;background:linear-gradient(180deg,rgba(184,235,232,.20),rgba(80,141,148,.16));box-shadow:0 7px 12px rgba(51,99,106,.17),inset 0 0 0 2px rgba(103,181,183,.12);opacity:.96;rotate:0deg}'
new='.theme-ch5 .atlas-map.atlas-range-3 .atlas-scene em{left:auto;right:5%;bottom:12%;width:82px;height:69px;border:8px solid rgba(224,250,246,.82);border-bottom:0;border-radius:42px 42px 0 0;background:linear-gradient(180deg,rgba(184,235,232,.20),rgba(80,141,148,.16));box-shadow:0 7px 12px rgba(51,99,106,.17),inset 0 0 0 2px rgba(103,181,183,.12);opacity:.96;rotate:0deg}'
if s.count(old)!=1:raise SystemExit(f'Atlas lookout anchor count={s.count(old)}')
s=s.replace(old,new,1)
old='.theme-ch5 .atlas-map.atlas-range-3 .atlas-scene em:before{content:"";position:absolute;left:25px;top:24px;width:39px;height:8px;border-radius:7px;background:linear-gradient(90deg,#d8a95f 0 62%,#58777c 63% 100%);transform:rotate(-15deg);box-shadow:0 3px 4px rgba(51,88,94,.18)}'
new='.theme-ch5 .atlas-map.atlas-range-3 .atlas-scene em:before{content:"";position:absolute;left:18px;top:24px;width:39px;height:8px;border-radius:7px;background:linear-gradient(90deg,#58777c 0 37%,#d8a95f 38% 100%);transform:rotate(15deg);box-shadow:0 3px 4px rgba(51,88,94,.18)}'
if s.count(old)!=1:raise SystemExit(f'Atlas scope anchor count={s.count(old)}')
s=s.replace(old,new,1)
old='.theme-ch5 .atlas-map.atlas-range-3 .atlas-scene em:after{content:"";position:absolute;right:-48px;top:20px;width:7px;height:7px;border-radius:50%;background:#ffc66a;box-shadow:14px 1px 0 #ffc66a,0 0 9px rgba(255,181,79,.78),14px 1px 9px rgba(255,181,79,.78)}'
new='.theme-ch5 .atlas-map.atlas-range-3 .atlas-scene em:after{content:"";position:absolute;left:-48px;top:20px;width:7px;height:7px;border-radius:50%;background:#ffc66a;box-shadow:14px 1px 0 #ffc66a,0 0 9px rgba(255,181,79,.78),14px 1px 9px rgba(255,181,79,.78)}'
if s.count(old)!=1:raise SystemExit(f'Atlas lights anchor count={s.count(old)}')
s=s.replace(old,new,1)
p.write_text(s)

# Make the Little Home focus state visibly announce the telescope without changing the canonical prop geometry.
p=Path('title-island-concepts/index.html')
s=p.read_text()
old='#c2 .phone.story-focus-telescope .story-telescope{display:block;z-index:25;filter:drop-shadow(0 0 7px rgba(98,202,210,.90)) drop-shadow(0 0 13px rgba(244,195,105,.48));animation:telescopeRewardFocus 1800ms cubic-bezier(.2,.8,.2,1) both}'
new='#c2 .phone.story-focus-telescope .story-telescope{display:block;z-index:25;filter:drop-shadow(0 0 7px rgba(98,202,210,.90)) drop-shadow(0 0 13px rgba(244,195,105,.48));box-shadow:0 0 0 5px rgba(103,218,221,.23),0 0 17px rgba(92,198,207,.62),0 3px 4px rgba(46,56,60,.15);animation:telescopeRewardFocus 1800ms cubic-bezier(.2,.8,.2,1) both}'
if s.count(old)!=1:raise SystemExit(f'Telescope focus anchor count={s.count(old)}')
s=s.replace(old,new,1)
p.write_text(s)
print('CHAPTER5_PASS3_VISUAL_REFINEMENT_APPLIED')
