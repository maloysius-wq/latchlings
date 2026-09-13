from pathlib import Path

p=Path('title-island-concepts/index.html')
s=p.read_text()
old="#c2 .story-bunting{left:211px;top:78px;width:94px;height:24px;border-top:2px solid rgba(101,72,45,.65);transform:rotate(4deg)}#c2 .story-bunting:after{content:\"\";position:absolute;left:5px;top:-1px;width:9px;height:11px;background:#e58b84;clip-path:polygon(0 0,100% 0,50% 100%);box-shadow:18px 2px 0 #f0c45e,36px 4px 0 #86ad79,54px 5px 0 #7da7df,72px 5px 0 #e58b84}"
new="#c2 .story-bunting{left:192px;top:16px;width:132px;height:24px;border-top:2px solid rgba(101,72,45,.72);transform:rotate(4deg)}#c2 .story-bunting:after{content:\"\";position:absolute;left:5px;top:-1px;width:10px;height:12px;background:#e58b84;clip-path:polygon(0 0,100% 0,50% 100%);box-shadow:27px 2px 0 #f0c45e,54px 4px 0 #86ad79,81px 5px 0 #7da7df,108px 4px 0 #e58b84}"
if s.count(old)!=1:
    raise SystemExit(f'canonical bunting anchor count={s.count(old)}')
s=s.replace(old,new,1)
old_halo="left:-10px;top:-12px;width:111px;height:39px"
new_halo="left:-8px;top:-12px;width:148px;height:39px"
if s.count(old_halo)!=1:
    raise SystemExit(f'bunting halo anchor count={s.count(old_halo)}')
s=s.replace(old_halo,new_halo,1)
p.write_text(s)
print('CHAPTER4_BUNTING_REFINED')
