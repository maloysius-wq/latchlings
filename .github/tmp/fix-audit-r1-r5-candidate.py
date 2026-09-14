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

# The current rail has portrait + copy + Story button. Legacy mobile CSS still defines only
# two grid columns, which creates an implicit second row and doubles the rail height.
text += '''\n\n/* Astra audit R1/R4 narrow-phone correction: preserve the current three-part rail in one row. */\n@media(max-width:430px){\n .story-level-rail{grid-template-columns:44px minmax(0,1fr) 50px;align-items:center}\n .story-rail-person,.story-rail-main{height:auto;min-height:0}\n}\n@media(max-height:720px){\n .story-level-rail{grid-template-columns:38px minmax(0,1fr) 46px;align-items:center}\n .story-rail-person,.story-rail-main{height:auto;min-height:0}\n}\n'''

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
