from pathlib import Path
import hashlib, json

root = Path('/tmp/r1r5-prepared')
path = root / 'style400-story-rail-board.css'
text = path.read_text(encoding='utf-8')
replacements = [
    ('.story-rail-main{min-height:0}', '.story-rail-main{min-height:0;overflow:visible}', 'inner story rail overflow'),
    ('html[data-text-size="large"] .story-rail-main p{font-size:16px;line-height:1.32}', 'html[data-text-size="large"] #game #storyRailSlot .story-level-rail .story-rail-main p{font-size:16px!important;line-height:1.32!important}', 'large story rail font override'),
    ('html[data-text-size="large"] .story-rail-main p{font-size:15px!important;line-height:1.3}', 'html[data-text-size="large"] #game #storyRailSlot .story-level-rail .story-rail-main p{font-size:15px!important;line-height:1.3!important}', 'short-screen large story rail font override'),
]
for old, new, label in replacements:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected 1 occurrence, found {count}')
    text = text.replace(old, new, 1)

text += '''\n\n/* Astra audit R1/R4 narrow-phone correction: preserve the current three-part rail in one row. */\n@media(max-width:430px){\n .story-level-rail{grid-template-columns:44px minmax(0,1fr) 50px;align-items:center}\n .story-rail-person,.story-rail-main{height:auto;min-height:0}\n}\n@media(max-height:720px){\n .story-level-rail{grid-template-columns:38px minmax(0,1fr) 46px;align-items:center}\n .story-rail-person,.story-rail-main{height:auto;min-height:0}\n}\n\n/* Large Text yields a little puzzle-surface width before sacrificing readable copy. */\nhtml[data-text-size="large"] #game .board{width:min(90vw,460px)}\n\n/* 320x568-class phones reclaim chrome space, not text size or touch-target safety. */\n@media(max-height:620px){\n #game.screen{padding:4px 8px}\n #game .topbar{min-height:48px;margin-bottom:3px;padding:1px 8px}\n #game .story-rail-slot{margin-bottom:1px}\n #game .story-level-rail{grid-template-columns:34px minmax(0,1fr) 44px;gap:4px;padding:3px 5px}\n #game .story-rail-person{height:auto}\n #game .rail-latchling{width:30px;height:30px}\n #game .rail-latchling.child{width:28px;height:28px}\n #game .story-rail-story-btn{min-width:44px;min-height:44px}\n #game .controls{grid-template-columns:68px minmax(0,1fr) 68px;gap:6px;padding-top:1px}\n #game .dpad{width:138px;height:138px}\n #game .side-action{min-height:54px}\n}\n'''

path.write_text(text, encoding='utf-8')
manifest_path = root / 'manifest.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
data = path.read_bytes()
manifest['style400-story-rail-board.css'] = {
    'sha256': hashlib.sha256(data).hexdigest(),
    'bytes': len(data),
}
manifest_path.write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print(json.dumps(manifest['style400-story-rail-board.css'], indent=2))
