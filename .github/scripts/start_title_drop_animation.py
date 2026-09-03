from pathlib import Path
from textwrap import dedent
p=Path('DEVELOPMENT_HANDOFF.md')
t=p.read_text()
marker='## Current Work\n\n'
entry=dedent('''### 2026-09-03 — Animate Little Home title letters dropping into place

**Status: IN PROGRESS**

**User goal:** Keep the selected Wobbly Toy Letters branding in Concept 2 / Little Home, but make the title screen begin with the ten `Latchlings` letters dropping down into place one by one, with a slight bounce on impact before settling into their existing wobbled positions.

**Implementation plan:** Refine only Concept 2. Preserve the current cream/navy toy-letter look, exact `Small friends. Smart puzzles.` tagline, top controls, five-resident floating island, clouds, pebbles, tree, cottage, randomized adult movement, and solid `#F5DEAC` buttons. Add a one-shot staggered entrance animation to each title-letter span. Each letter starts above the title with slight rotation and reduced opacity, falls past its final baseline, rebounds upward briefly, then settles into the existing odd/even wobbled transform. Stagger letters left-to-right with a short delay so the word visibly assembles. The animation must not loop. Under `prefers-reduced-motion: reduce`, skip the entrance entirely and render the finished title immediately. Concepts 1 and 3 remain unchanged. Production `index.html` remains untouched.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, `title-island-concepts/index.html`, plus temporary self-removing implementation/browser-validation workflow files. No external assets or runtime dependencies.

**Validation plan:** Static checks must confirm a Concept 2-only title-drop keyframe, per-letter stagger delays for all ten letters, non-looping animation, preserved Wobbly Toy Letter styling, exact tagline text, and reduced-motion override. Chromium at 390x844 must sample the title shortly after load, during the stagger, and after completion to prove letters start above their resting positions, enter at different times, bounce/settle, and end at the exact current wobbled layout. The final title must stay clear of top controls and island, the scene/buttons must remain unchanged, and there must be no console/page/request errors or horizontal overflow. A reduced-motion browser pass must verify the final title appears immediately without the drop animation. Concepts 1 and 3 must remain unaffected.

**Deployment plan:** Commit this handoff entry before implementation. Then commit the validated Concept 2 title entrance to `main`, deploy through GitHub Pages, inspect rendered screenshots at multiple animation phases, and close this same handoff entry with implementation SHA, validation/deployment details, and live preview link. Production integration remains out of scope.

---\n\n''')
if '### 2026-09-03 — Animate Little Home title letters dropping into place' in t:
    raise SystemExit('entry already exists')
if marker not in t:
    raise SystemExit('Current Work marker not found')
p.write_text(t.replace(marker, marker+entry, 1))
