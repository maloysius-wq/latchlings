from pathlib import Path
p=Path('DEVELOPMENT_HANDOFF.md')
t=p.read_text()
heading='### 2026-09-03 — Clamp music fade volume to valid media range'
if heading in t:
    print('handoff entry already present')
    raise SystemExit(0)
entry='''\n### 2026-09-03 — Clamp music fade volume to valid media range\n\n**Status: IN PROGRESS**\n\n**User goal:** Fix the production `IndexSizeError` raised when `HTMLMediaElement.volume` receives a tiny negative value during a music fade (observed value `-0.00186667`).\n\n**Implementation plan:** Harden `music400.js` so fade interpolation progress is clamped to `[0,1]` and the computed volume assignment is independently clamped to `[0,1]`. Preserve all existing music track routing, target volume, fade duration, settings behavior, and SFX behavior.\n\n**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, `music400.js`, and temporary self-removing GitHub Actions validation files. Campaign/story/title/gameplay files remain unchanged.\n\n**Validation plan:** Static syntax validation plus a focused browser/unit harness that forces animation-frame timestamps both before and after the captured fade start time, verifies every attempted media volume assignment remains in `[0,1]`, exercises fade-to-zero and fade-up transitions, and confirms normal music routing still works without console/page errors.\n\n**Deployment plan:** Commit this handoff entry before implementation, patch and validate the music fade guard, deploy the exact validated product SHA through GitHub Pages, then close this same handoff entry with implementation SHA, validation/deployment IDs, and remaining risk.\n\n---\n'''
marker='## Current Work\n'
pos=t.index(marker)+len(marker)
t=t[:pos]+entry+t[pos:]
p.write_text(t)
print('VOLUME_FIX_HANDOFF_STARTED')
