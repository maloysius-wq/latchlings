# Latchlings Development Handoff

Last updated: 2026-09-12

## Start here

This repository is the source of truth for **Latchlings**.

- Repository: `maloysius-wq/latchlings`
- Live build: `https://maloysius-wq.github.io/latchlings/`
- Runtime: intended 400-level themed campaign on `main`
- Full historical journal through completed Pass 3 Chapter 4: `DEVELOPMENT_HANDOFF_ARCHIVE_2026-09-12.md`

Always inspect current `main`, `index.html`, and this handoff before changing anything. Read the archive when older implementation history or validation evidence is needed; it preserves the pre-Chapter-5 handoff byte-for-byte.

### REPOSITORY ACCESS PRE-FLIGHT — HARD GATE

For **all repository work in this project**, the connected **GitHub plugin/connector is the canonical and first-line repository path**. This rule applies before any local/container/web attempt. If GitHub functions are not already loaded, the **first tool action for a repository task must be connector/plugin discovery for `GitHub`**. The first repository read must be `DEVELOPMENT_HANDOFF.md` through `GitHub.fetch_file` (or equivalent).

A failed local clone, missing checkout, container DNS failure, generic web failure, raw-GitHub failure, or absence of preloaded GitHub functions is **never evidence that GitHub access is unavailable**. An agent may claim GitHub is unavailable only after GitHub plugin discovery has explicitly been attempted **and** a real GitHub connector repository read cannot be invoked or fails. If the wrong route is attempted first, recover immediately through GitHub and continue the original request without asking the user to repeat the plugin instruction.

Read `AGENTS.md` and `.github/REPOSITORY_ACCESS_PREFLIGHT.md` for the durable preflight contract. The repository guard workflow validates that these instructions remain present.

## MANDATORY handoff workflow

For every substantive repository task, in every current or future chat:

1. Read this file and inspect the current repository.
2. Before implementation, add/update a `Current Work` entry with the date, user goal, implementation plan, expected files/systems, validation plan, deployment plan, and `IN PROGRESS` status.
3. Commit that handoff update before implementation begins.
4. If scope changes materially, update the handoff again while work is underway.
5. After implementation, update the same entry to `COMPLETED`, `PARTIAL`, or `BLOCKED` and record exactly what changed, important decisions, files changed, validation/test results, deployment status/commit, remaining bugs/risks, and exact next action if incomplete.
6. Commit the final handoff update after implementation/deployment commits.

If a chat is interrupted, the handoff must already contain enough detail to resume immediately. This file is the live project journal. Older completed entries are retained in the dated archive named above rather than deleted.

---

## Current Work

### 2026-09-12 — Pass 3 Chapter 5 Prism campaign application

**Status: IN PROGRESS**

**User goal:** Continue directly from the completed Chapter 4 Masquerade Pass 3 rollout and apply the next protected production slice to Chapter 5, Prism Gardens / The Long Drift (campaign Levels 201–250), using current `main` as source of truth.

**Roadmap/current-source recheck:** The Chapter 4 closeout explicitly names Prism Gardens as the next Pass 3 unit. Current `LEVEL_SELECT_ART_DIRECTION.md` specifies Marble 01 with glasshouse ribs, translucent petals, crystal planters, prismatic highlights, and soft botanical geometry. `story400.js`, `story-grounding400.js`, and `STORY_BIBLE.md` already give Chapter 5 a coherent five-movement arc: local color lanes widen into a visible regional separation, movement 3 returns to the Lanternwood friend porch with the same twin amber lanterns, movement 4 proves the historical map cannot fit the present islands, and movement 5 reconnects Prism on new coordinates. `cinematics400.js` already queues the existing `Across the Drift` cinematic for Level 251 and visually repeats the familiar porch/twin-light continuity. Current `game400-a.js` maps Chapters 1–4 into production modes; Level 250 still uses the generic completion surface; Little Home already contains the canonical stage-5 telescope but has no dedicated focus treatment.

**Implementation plan:** (1) Add a self-contained Chapter 5 production layer loaded after the stable shared runtime so campaign Levels 201–250 opt into a `prism` visual mode while Daily stays neutral, Chapters 1–4 remain byte-for-byte stable, Level 251 stays outside this rollout, and Level 366 keeps its Aurora override. The layer may extend the existing mutable chapter-mode map at runtime rather than rewriting `game400-a.js`. (2) Build five quiet Prism movement surfaces from pale marble/glasshouse materials with translucent botanical accents and prismatic light kept outside rule space; playable cells remain non-symbolic linear materials. (3) Strengthen color gates as the chapter mechanic fixture using a pale translucent/glass body, a high-contrast color edge keyed to the existing gate color, and a restrained white highlight without changing gate behavior or confusing suit gates. (4) Turn Chapter 5 movement 3 into a recognizable Atlas lookout landmark: a glasshouse/sighting arch with a compact brass scope aimed toward two tiny distant amber lights, visually connecting Prism’s wider view to the same Lanternwood porch established in Chapter 2 and reused by `Across the Drift`. (5) Add a dedicated Level 250 reward showing Prism’s adjusted new-coordinate route, the lookout/twin-light continuity, and the telescope packed for Little Home; stars stay secondary, with `Visit Little Home` and `Continue to Copperline`. The Chapter 5 layer must preserve the normal progress/Atlas-reward bookkeeping and then replace the generic Level 250 result synchronously with the dedicated reward. The home action focuses the existing canonical stage-5 telescope with a reduced-motion-safe same-origin iframe emphasis rather than rewriting the Little Home document. (6) Record the Prism lookout landmark in durable art direction and load the new production assets from `index.html` with explicit cache keys.

**Scope-change note:** The first validated candidate integrated Chapter 5 directly into `game400-a.js`, `game400-b.js`, `style400-production-slice.css`, `style400-skyway-atlas.css`, and `title-island-concepts/index.html`. That candidate passed the full browser matrix and manual review after two visual refinements, but repository Actions currently receive a read-only push token even when the workflow requests `contents: write`. The connected GitHub integration can write normally, but importing five large generated whole-file replacements through the connector would be unnecessarily brittle. Before product promotion, the implementation is therefore being repackaged as two explicit, source-controlled Chapter 5 production assets that use the same approved CSS/reward/landmark vocabulary while leaving the accepted Chapter 1–4 runtime files untouched. This is a packaging/scope change, not a puzzle/story/mechanic change, and it must be revalidated end-to-end before deployment.

**Expected product files/systems after scope change:** new `pass3-chapter5-prism.css`, new `pass3-chapter5-prism.js`, `LEVEL_SELECT_ART_DIRECTION.md`, and `index.html`. The shared runtime files `game400-a.js`, `game400-b.js`, `style400-production-slice.css`, `style400-skyway-atlas.css`, and `title-island-concepts/index.html` now join the protected set for final promotion. All eight `campaign400-*.js` files, authored solutions, `story400.js`, `story-grounding400.js`, `STORY_BIBLE.md`, `cinematics400.js`, cinematic dialogue, audio, movement simulation/rules, legacy board surfaces, and Chapters 6–8 behavior remain protected from change. Temporary candidate/validation helpers are not product.

**Validation plan:** Hash-protect all eight campaign definition files plus all shared runtime/story/cinematic/audio/Little Home files before the modular candidate is applied. Run JavaScript syntax/static assertions and a Chromium matrix covering Chapter 5 Levels 201/210/211/220/221/230/231/240/241/250 at 390x844, Levels 201/250 at 320x568, Daily isolation on a Chapter 5 board, the accepted Level 200 Masquerade boundary, untouched Level 251, and Level 366 Aurora override. Assert all Chapter 5 campaign levels map to `prism`; five board ranges have distinct quiet linear materials; cell pseudo-decoration remains suppressed; selected Latchling/matching nest hierarchy remains explicit; color gates retain a readable translucent body plus keyed color edge while suit-gate readability remains intact; controls/viewport remain contained with >=44px active targets; no browser errors occur; and protected hashes remain unchanged. Verify Chapter 5 movement 3 exposes the refined glasshouse lookout / twin-amber-light landmark without overlapping Atlas nodes, solve the real authored Level 250 route to reach the dedicated reward, use `Visit Little Home` to reveal/focus the canonical telescope, confirm reduced-motion reaches the same informative state, and confirm continuing from the reward still reaches the existing Level 251 `Across the Drift` flow. Capture all five Prism ranges plus Atlas lookout, Level 250 reward, Little Home telescope focus, and small-phone endpoints for a fresh manual review of the modular packaging before promotion.

**Deployment plan:** The original IN PROGRESS entry was committed at `a184a43ca341679a8c32695adec08b2e43063cfe`; this scope-change update is committed before the modular product files are created. Validate the modular candidate on `main` with product assets staged but not yet referenced by the live index where practical, then update `index.html`, rerun the complete protected-source/static/browser/manual gate against the exact committed product, remove every temporary Chapter 5 helper/workflow, confirm GitHub Pages succeeds on the clean product head, and close this same entry as COMPLETED/PARTIAL/BLOCKED with exact commits/runs/artifacts and the next Pass 3 action. Repository mutations must use the connected GitHub integration; Actions may validate but must not be relied on to push commits.

## Previous checkpoint — Pass 3 Chapter 4 Masquerade

**Status: COMPLETED**

- Product commit: `dd38de6285eed52a326d5bd66f85080b162ce62b` (`Apply Pass 3 production treatment to Masquerade`).
- Chapter 4 / Levels 151–200 now use the `masquerade` production family with five moonlit plaster/stone movement ranges, readable civic suit gates, a movement-3 old civic suit-gate Atlas landmark, a dedicated real-Level-200 Market Day reward, and the canonical stage-4 Little Home bunting payoff.
- Manual screenshot review caught and fixed the bunting’s cottage overlap and an older one-pennant rendering flaw; final bunting uses five real pennants with a dedicated visual guard.
- Promotion run `34740177742`, job `103678447912`, artifact ID `10312372982`, SHA-256 `543d6387186f72b4b280682c743917f5d834856f136733abae5a8b733ed590b8` passed the protected-source/static/full Chromium/real-Level-200/reward-home/reduced-motion gates.
- Validator cleanup commit `3553ca4b636f019556a1a64c99b9aec791953124`; final Chapter 4 closeout helper cleanup head `6573e9ecc84de26e17f801534b42ee7131ff7da0`.
- GitHub Pages run `34740316491` (run 1043) succeeded on that final clean Chapter 4 head.
- Full Chapter 4 and all earlier journal evidence remains in `DEVELOPMENT_HANDOFF_ARCHIVE_2026-09-12.md`.