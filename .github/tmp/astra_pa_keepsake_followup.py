from pathlib import Path
p=Path('title-island-concepts/index.html')
s=p.read_text()
needle='html[data-motion="reduced"] .resident,html[data-motion="reduced"] .story-keepsake{transition:none!important}\n'
assert needle in s
rule='.story-keepsake[role="button"]::after{content:"";position:absolute;left:50%;top:50%;width:44px;height:44px;transform:translate(-50%,-50%);pointer-events:auto;background:transparent}\n'
s=s.replace(needle,needle+rule,1)
p.write_text(s)
print('keepsake 44px interaction zones added')
