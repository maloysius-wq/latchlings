from pathlib import Path
import hashlib, json

root = Path('/tmp/r1r5-prepared')
manifest_path = root / 'manifest.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))

path = root / 'style400-game.css'
text = path.read_text(encoding='utf-8')
old = 'html[data-text-size="large"] .modal p{font-size:16px;line-height:1.5}'
new = 'html[data-text-size="large"] .modal p{font-size:18px;line-height:1.5}'
count = text.count(old)
if count != 1:
    raise SystemExit(f'large modal copy rule: expected 1 occurrence, found {count}')
text = text.replace(old, new, 1)
path.write_text(text, encoding='utf-8')

data = path.read_bytes()
manifest[str(path.relative_to(root))] = {
    'sha256': hashlib.sha256(data).hexdigest(),
    'bytes': len(data),
}
manifest_path.write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print(json.dumps({'style400-game.css': manifest['style400-game.css']}, indent=2))
