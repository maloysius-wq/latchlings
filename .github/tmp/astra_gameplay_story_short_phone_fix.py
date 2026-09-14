from pathlib import Path

p=Path('style400-story-theme.css')
s=p.read_text(encoding='utf-8')
old='@media(max-width:350px){.mastery-guide{flex-basis:100%;margin-left:0;text-align:center}.story-card-line em{font-size:12px}}'
new='@media(max-width:350px){.mastery-guide{margin-left:0;padding:2px 5px;font-size:8.5px;letter-spacing:-.01em}.story-card-line em{font-size:12px}}\n@media(max-height:600px){#game .mechanic-note.mechanic-chip{margin:0 auto;padding:5px 8px}.mastery-guide{font-size:8.5px;padding:2px 5px}#game .controls{padding-top:0}.dpad{width:min(190px,41vw);height:min(190px,41vw)}}'
assert old in s, 'narrow mastery rule anchor changed'
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')
print('Short-phone gameplay layout correction applied.')
