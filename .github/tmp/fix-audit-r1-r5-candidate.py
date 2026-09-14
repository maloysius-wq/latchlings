from pathlib import Path
import hashlib, json

root = Path('/tmp/r1r5-prepared')
path = root / 'style400-story-rail-board.css'
text = path.read_text(encoding='utf-8')
old = '.story-rail-main{min-height:0}'
new = '.story-rail-main{min-height:0;overflow:visible}'
count = text.count(old)
if count != 1:
    raise SystemExit(f'inner story rail fix: expected 1 occurrence, found {count}')
text = text.replace(old, new, 1)
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
