from pathlib import Path
from textwrap import dedent

p=Path('DEVELOPMENT_HANDOFF.md')
t=p.read_text()
marker='## Current Work\n\n'
entry=dedent('''### 2026-09-02 — Simplify Little Home buttons to solid #F5DEAC\n\n**Status: IN PROGRESS**\n\n**User goal:** Keep the current rounded Concept 2 / Little Home button shapes and layout, remove the diagonal stripe treatment entirely, and make all three controls a solid `#F5DEAC`.\n\n**Implementation plan:** Refine only Concept 2. Preserve the current Play / Daily Puzzle / Level Select positions, rounded corners, typography, icon medallions, inset highlight, grounded shadow, and press behavior. Replace the repeating stripe gradients and the second-button stripe override with a solid `#F5DEAC` base plus only subtle non-pattern shading for tactile depth. Concepts 1 and 3 remain unchanged. Production `index.html` remains untouched.\n\n**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, `title-island-concepts/index.html`, plus temporary self-removing workflow/script files for implementation and Chromium validation. No external assets or runtime dependencies.\n\n**Validation plan:** Static checks must confirm `#F5DEAC` is used on all three Concept 2 controls, no `repeating-linear-gradient` remains in the Concept 2 control block, all existing labels and scene elements remain intact, and production/game/campaign files are untouched. Chromium at 390x844 must verify all controls remain inside the phone, retain rounded corners, remain separated from the island and each other, have no overflow or browser errors, and visually compute to a solid warm cream surface rather than stripes.\n\n**Deployment plan:** Commit this handoff entry before implementation, then commit the validated Concept 2 solid-button refinement to `main`, deploy through GitHub Pages, and close this same entry with implementation SHA, validation/deployment details, and the live preview link. Production title integration remains out of scope.\n\n---\n\n''')
if '### 2026-09-02 — Simplify Little Home buttons to solid #F5DEAC' in t:
    raise SystemExit('entry already exists')
if marker not in t:
    raise SystemExit('Current Work marker missing')
p.write_text(t.replace(marker,marker+entry,1))
