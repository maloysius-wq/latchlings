from pathlib import Path
p=Path('style400-ui.css')
s=p.read_text(encoding='utf-8')
old='.ending-hero-pass4 h1{font-size:31px;line-height:1;letter-spacing:-1px;white-space:nowrap;margin-top:2px;margin-bottom:3px}'
new='.ending-hero-pass4 h1{font-size:27px;line-height:1;letter-spacing:-1px;white-space:nowrap;margin-top:2px;margin-bottom:3px}'
assert old in s, 'short ending title rule anchor changed'
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')
print('Short ending title containment fix applied.')
