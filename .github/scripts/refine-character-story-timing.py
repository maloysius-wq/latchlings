from pathlib import Path
p=Path('story-theme400.js')
t=p.read_text()
old="function enterLevel(level){activeLevel=Number(level)||activeLevel;if(!STORY)return;const meta=STORY.levelMeta(level);if(!autoEligible(meta))return;const seen=seenMap();window.setTimeout(()=>{if(!seen[level])show(level,false)},90)}"
new="function enterLevel(level){activeLevel=Number(level)||activeLevel;if(!STORY)return;const meta=STORY.levelMeta(level);if(!autoEligible(meta))return;const seen=seenMap();window.setTimeout(()=>{if(!seen[level])show(level,false)},260)}"
if old in t:t=t.replace(old,new,1)
elif '},260)}' not in t:raise SystemExit('enterLevel timing anchor missing')
p.write_text(t)
print('CHARACTER_STORY_TIMING_REFINED')
