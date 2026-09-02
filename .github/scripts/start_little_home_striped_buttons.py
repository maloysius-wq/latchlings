from pathlib import Path
from textwrap import dedent
p = Path('DEVELOPMENT_HANDOFF.md')
text = p.read_text()
marker = '## Current Work\n\n'
if marker not in text:
    raise SystemExit('Current Work marker not found')
entry = dedent('''### 2026-09-02 — Switch Little Home controls to striped rounded buttons

**Status: IN PROGRESS**

**User goal:** Replace the current cut-corner brass controls in selected Concept 2 / Little Home with the rounded striped button family the user actually intended from the earlier rendered gallery. Keep the striped concept but recolor it away from blue so it harmonizes with the Little Home title screen.

**Implementation plan:** Refine only Concept 2. Preserve the existing Play / Daily Puzzle / Level Select markup, hierarchy, and scene spacing. Remove the chamfered/cut-corner brass silhouette and brass rivet treatment. Restyle all three controls as rounded striped buttons with a custom Little Home palette: warm cream alternating with soft sage and muted moss/olive accents, plus a subtle tactile border, inset highlight, grounded shadow, and physical press state. Keep the two lower controls compact and coordinated. Concepts 1 and 3 remain unchanged. Production `index.html` remains untouched.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, `title-island-concepts/index.html`, plus temporary self-removing workflow/script files for transformation and Chromium validation. No new external assets or runtime dependencies.

**Validation plan:** Static checks must confirm Concept 2 no longer contains the cut-corner brass `clip-path` treatment, uses rounded striped controls with non-blue sage/cream/moss stripe colors, preserves all three control labels and markup, and preserves the current five-resident floating-island scene. Chromium at 390x844 must verify all controls remain inside the phone, do not overlap the island or each other, retain readable labels/icons, show rounded corners and striped backgrounds, have no horizontal overflow or console/page/request errors, and leave Concepts 1 and 3 on their prior non-striped control styles. Capture a screenshot for visual inspection.

**Deployment plan:** Commit this handoff entry before implementation, then commit the validated Concept 2 striped control refinement to `main`, deploy through GitHub Pages, inspect the rendered screenshot, and close this same entry with implementation SHA, validation/deployment details, and next action. Production title integration remains out of scope.

---\n\n''')
if '### 2026-09-02 — Switch Little Home controls to striped rounded buttons' in text:
    raise SystemExit('Entry already present')
text = text.replace(marker, marker + entry, 1)
p.write_text(text)
