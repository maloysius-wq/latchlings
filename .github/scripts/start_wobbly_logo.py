from pathlib import Path
from textwrap import dedent

p = Path('DEVELOPMENT_HANDOFF.md')
text = p.read_text()
marker = '## Current Work\n\n'
if marker not in text:
    raise SystemExit('Current Work marker missing')
entry = dedent('''
### 2026-09-03 — Implement Wobbly Toy Letters logo in Little Home preview

**Status: IN PROGRESS**

**User goal:** Take rendered logo exploration Option #2 exactly as selected and integrate it into the actual Concept 2 / Little Home title preview that has been refined throughout this project. Replace the current generic serif `Latchlings` wordmark and `Home is where you latch` tagline with the Wobbly Toy Letters treatment and its selected tagline, `Small friends. Smart puzzles.`

**Implementation plan:** Refine only Concept 2. Keep the existing top progress/settings controls, floating-island scene, five residents, clouds, earth pebbles, organic tree, cottage, flowers, adult randomized outings, and solid `#F5DEAC` controls unchanged. Replace only the Concept 2 brand markup/style with individually wrapped rounded toy letters in warm cream with a thick navy outline, subtle alternating tilt/baseline offsets, and a compact warm-cream pill tagline reading `Small friends. Smart puzzles.`. Concepts 1 and 3 keep the existing serif brand system. Production `index.html` remains untouched.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, `title-island-concepts/index.html`, plus temporary self-removing implementation/browser-validation workflow files. No external assets or runtime dependencies.

**Validation plan:** Static checks must confirm Concept 2 contains ten individually wrapped title letters spelling `Latchlings`, the exact tagline `Small friends. Smart puzzles.`, Concept 2-only wobbly logo styles, and removal of the old Concept 2 `Home is where you latch` brand markup. Chromium at 390x844 must verify the full wordmark stays inside the phone, remains clear of the top controls and island scene, the tagline pill is readable, buttons remain unchanged and solid `#F5DEAC`, the scene still contains 5 residents / 6 floating pebbles / 4 clouds, and there are no console/page/request errors or horizontal overflow. Concepts 1 and 3 must retain their prior serif brand treatment.

**Deployment plan:** Commit this handoff entry before product implementation, then commit the validated Concept 2 logo refinement to `main`, deploy through GitHub Pages, visually inspect the rendered screenshot, and close this same handoff entry with implementation SHA, validation/deployment details, and the live preview link. Production integration remains out of scope.

---

''')
if '### 2026-09-03 — Implement Wobbly Toy Letters logo in Little Home preview' not in text:
    text = text.replace(marker, marker + entry, 1)
p.write_text(text)
