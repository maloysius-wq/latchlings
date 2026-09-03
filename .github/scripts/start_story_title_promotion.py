from pathlib import Path
from textwrap import dedent

p=Path('DEVELOPMENT_HANDOFF.md')
t=p.read_text()
marker='## Current Work\n\n'
if marker not in t:
    raise SystemExit('Current Work marker not found')
entry=dedent('''### 2026-09-03 — Build the Latchlings story layer and promote Little Home to production

**Status: IN PROGRESS**

**User goal:** Turn the approved Little Home title concept into the actual production title/home screen, and build the story framework discussed in chat so the existing 400-board campaign feels like the everyday lives and larger journey of the Latchlings rather than an unrelated sequence of puzzles. The established tagline `Small friends. Smart puzzles.` remains unchanged.

**Narrative scope:** Establish the Latchlands, the player as a Waykeeper, the old Skyway route network, the five recurring Little Home residents, and an eight-chapter arc mapped onto the existing 8×50 mechanic campaign. The intended chapter arc is: 1 `Morning Routes`, 2 `Neighbors`, 3 `Holding Fast`, 4 `Market Day`, 5 `The Long Drift`, 6 `Old Ways`, 7 `Coming Together`, 8 `Homeward`. Preserve the existing chapter locations/themes and mechanic progression underneath those story identities. Add lightweight per-level narrative context for all 400 levels and milestone story beats without forcing long cutscenes between normal puzzles.

**Production-title scope:** Promote the currently approved Concept 2 / Little Home title surface into the production game. Preserve the exact Wobbly Toy Letters branding, `Small friends. Smart puzzles.` tagline, staggered letter drop/bounce entrance, animated clouds, gently bobbing textured island, six floating earth pebbles, organic textured tree, cottage, three intermittently moving adults, two continuously playing children, blue flower, and solid `#F5DEAC` Play / Daily Puzzle / Level Select controls. The production title must use the approved preview as the visual source of truth rather than recreating another approximate mock. Existing game navigation/actions must remain functional.

**Home-world progression:** Make the production Little Home act as a quiet visual record of campaign progress. Add small chapter-completion keepsakes/upgrades to the home scene at major milestones (for example mailbox/neighbor token, restored anchor, market bunting, telescope, Waykeeper relic, docking element, and distant connected-island payoff) without cluttering the base composition.

**Gameplay-story integration plan:** Add a durable story bible document plus a runtime narrative data layer. Give each of the 400 levels a deterministic compact title and one-line situation tied to its chapter. Surface that context through the existing level/game UI, keep mechanic guidance available, enrich chapter headers with story + mechanic framing, and add short milestone beats to completion UI at sensible intervals. Add an accessible Story/Lore entry point from settings so the cast/world can be revisited without interrupting play.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`; new story bible/runtime narrative files; production `index.html`; production home/title styling/bridge code; selected `title-island-concepts/index.html` only as needed to expose the approved surface for production reuse and story-stage decoration; `game400-a.js` / `game400-b.js` for story hooks; existing CSS as needed. Campaign board definitions and solver data must not change.

**Validation plan:** Validate all 400 campaign levels still load and retain their board/solution data; narrative metadata resolves for Levels 1–400; chapter headers map correctly to eight story arcs and existing mechanics; milestone beats trigger only where intended; production Play, Daily Puzzle, Level Select, Settings, level selection, gameplay, win/lose, hint, pause, and campaign-complete flows still function. Chromium validation must cover production home at multiple mobile viewports, prove the approved title drop/bounce and home animations run, verify progress-star synchronization and home progression staging, then start and complete representative levels from early/mid/late chapters. Confirm no console/page/request errors or horizontal overflow. Reduced-motion must skip the title entrance. The existing design preview must remain usable.

**Deployment plan:** Commit this handoff entry before implementation. Implement in reviewable commits, use GitHub Actions for static/runtime/Chromium validation and rendered screenshots, deploy the validated production commit through GitHub Pages, inspect the actual production title render, then close this same handoff entry with implementation SHA(s), validation/deployment details, remaining risks, and exact next action.

---\n\n''')
if 'Build the Latchlings story layer and promote Little Home to production' in t:
    raise SystemExit('Entry already exists')
t=t.replace(marker,marker+entry,1)
p.write_text(t)
