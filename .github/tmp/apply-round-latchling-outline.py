from pathlib import Path

path = Path('style400-game.css')
text = path.read_text()
old = "border:2px solid rgba(39,68,98,.42);box-shadow:0 5px 9px rgba(22,39,58,.24),inset 0 -4px 7px rgba(30,32,40,.10),inset 0 1px 0 rgba(255,255,255,.25);overflow:hidden}"
new = "border:2px solid #274462;background-clip:padding-box;box-shadow:0 5px 9px rgba(22,39,58,.24),inset 0 -4px 7px rgba(30,32,40,.10),inset 0 1px 0 rgba(255,255,255,.25);overflow:hidden}"
count = text.count(old)
if count != 1:
    raise SystemExit(f'Expected exactly one refined Latchling border declaration, found {count}')
path.write_text(text.replace(old, new, 1))
print('ROUND_LATCHLING_OUTLINE_PATCH_APPLIED')
