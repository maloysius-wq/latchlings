from pathlib import Path
p=Path('game400-a.js')
s=p.read_text()
old="atlasRewardBanner(r,true)},atlasRewardMs(850));"
new="atlasRewardBanner(r,true)},atlasRewardMs(970));"
if s.count(old)!=1:
    raise SystemExit(f'expected one cross-map timing match, found {s.count(old)}')
p.write_text(s.replace(old,new,1))
