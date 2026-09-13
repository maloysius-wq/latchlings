from pathlib import Path

p=Path('DEVELOPMENT_HANDOFF.md')
s=p.read_text()
anchor='## Current Work\n\n'
if anchor not in s:
    raise SystemExit('Current Work anchor missing')
heading='### 2026-09-12 — Pass 3 Chapter 5 Prism campaign application'
if heading in s:
    raise SystemExit('Chapter 5 Pass 3 handoff entry already exists')
entry=r'''### 2026-09-12 — Pass 3 Chapter 5 Prism campaign application

**Status: IN PROGRESS**

**User goal:** Continue directly from the completed Chapter 4 Masquerade Pass 3 rollout and apply the next protected production slice to Chapter 5, Prism Gardens / The Long Drift (campaign Levels 201–250), using current `main` as source of truth.

**Roadmap/current-source recheck:** The Chapter 4 closeout explicitly names Prism Gardens as the next Pass 3 unit. Current `LEVEL_SELECT_ART_DIRECTION.md` specifies Marble 01 with glasshouse ribs, translucent petals, crystal planters, prismatic highlights, and soft botanical geometry. `story400.js`, `story-grounding400.js`, and `STORY_BIBLE.md` already give Chapter 5 a coherent five-movement arc: local color lanes widen into a visible regional separation, movement 3 returns to the Lanternwood friend porch with the same twin amber lanterns, movement 4 proves the historical map cannot fit the present islands, and movement 5 reconnects Prism on new coordinates. `cinematics400.js` already queues the existing `Across the Drift` cinematic for Level 251 and visually repeats the familiar porch/twin-light continuity. Current `game400-a.js` maps Chapters 1–4 into production modes; Level 250 still uses the generic completion surface; Little Home already contains the canonical stage-5 telescope but has no dedicated focus treatment.

**Implementation plan:** (1) Extend the reusable chapter visual-mode map so campaign Levels 201–250 use a new `prism` production mode while Daily stays neutral, Chapters 1–4 retain their accepted modes, Level 251 stays outside this rollout, and Level 366 keeps its Aurora override. (2) Build five quiet Prism movement surfaces from pale marble/glasshouse materials with translucent botanical accents and prismatic light kept outside rule space; playable cells remain non-symbolic linear materials. (3) Strengthen color gates as the chapter mechanic fixture using a pale translucent/glass body, a high-contrast color edge keyed to the existing gate color, and a restrained white highlight without changing gate behavior or confusing suit gates. (4) Turn Chapter 5 movement 3 into a recognizable Atlas lookout landmark: a glasshouse/sighting arch with a compact brass scope aimed toward two tiny distant amber lights, visually connecting Prism’s wider view to the same Lanternwood porch established in Chapter 2 and reused by `Across the Drift`. (5) Add a dedicated Level 250 reward showing Prism’s adjusted new-coordinate route, the lookout/twin-light continuity, and the telescope packed for Little Home; stars stay secondary, with `Visit Little Home` and `Continue to Copperline`. The home action must focus the existing canonical stage-5 telescope with reduced-motion-safe behavior. (6) Record the Prism lookout landmark in durable art direction and bump only cache keys required by changed production surfaces.

**Expected product files/systems:** `game400-a.js`, `game400-b.js`, `style400-production-slice.css`, `style400-skyway-atlas.css`, `title-island-concepts/index.html`, `LEVEL_SELECT_ART_DIRECTION.md`, and `index.html`; temporary self-removing candidate/validation helpers only. All eight `campaign400-*.js` files, authored solutions, `story400.js`, `story-grounding400.js`, `STORY_BIBLE.md`, `cinematics400.js`, cinematic dialogue, audio, movement simulation/rules, legacy board surfaces, and Chapters 6–8 behavior are protected from change.

**Validation plan:** Hash-protect all eight campaign definition files and unrelated story/cinematic/audio/runtime systems before candidate application. Run JavaScript syntax/static assertions and a Chromium matrix covering Chapter 5 Levels 201/210/211/220/221/230/231/240/241/250 at 390x844, Levels 201/250 at 320x568, Daily isolation on a Chapter 5 board, the accepted Level 200 Masquerade boundary, untouched Level 251, and Level 366 Aurora override. Assert all Chapter 5 campaign levels map to `prism`; five board ranges have distinct quiet linear materials; cell pseudo-decoration remains suppressed; selected Latchling/matching nest hierarchy remains explicit; color gates retain a readable translucent body plus keyed color edge while suit-gate readability remains intact; controls/viewport remain contained with >=44px active targets; no browser errors occur; and protected hashes remain unchanged. Verify Chapter 5 movement 3 exposes the glasshouse lookout / twin-amber-light landmark on the Atlas, solve the real authored Level 250 route to reach the dedicated reward, use `Visit Little Home` to reveal/focus the canonical telescope, confirm reduced-motion reaches the same informative state, and confirm continuing from the reward still reaches the existing Level 251 `Across the Drift` flow. Capture all five Prism ranges plus Atlas lookout, Level 250 reward, Little Home telescope focus, and small-phone endpoints for manual review before promotion.

**Deployment plan:** Commit this IN PROGRESS entry before product edits. Implement through a validation-only candidate, promote only after protected-source/static/browser checks and manual screenshots are accepted, remove every temporary helper, confirm GitHub Pages succeeds on the clean product head, then close this same entry as COMPLETED/PARTIAL/BLOCKED with exact commits/runs/artifacts and the next Pass 3 action.

'''
s=s.replace(anchor,anchor+'\n'+entry,1)
p.write_text(s)
