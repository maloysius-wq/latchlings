# Latchlings Development Handoff

Last updated: 2026-09-13

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

### 2026-09-13 — Pass 3 Chapter 6 Copperline campaign application

**Status: IN PROGRESS**

**User goal:** Continue directly from the completed Chapter 5 Prism rollout and apply the next protected Pass 3 production slice to Chapter 6, Copperline Junction / Old Ways, campaign Levels 251–300, using current `main` as source of truth.

**Roadmap/current-source recheck:** Chapter 5 closes by sending the Waykeeper to Copperline, and the current Chapter 6 story is already a coherent five-movement reveal: `The Instructions Disagree`, `Look at the Dates`, `They Were All Correct`, `What Automation Hid`, and `Off the Old Map`. `story400.js`, `story-grounding400.js`, and `STORY_BIBLE.md` establish the chapter’s core lesson: the approved old maps contradict one another because each was correct for a different moment in the drift, and later automation hid the continuing need to observe and revise. Rails and turners are the active mechanic. `cinematics400.js` already queues `Old Maps, New Routes` at Level 301 and carries the same contradictory-map evidence into the chapter transition. Little Home already contains the canonical stage-6 `story-relic`, visually a small Waykeeper compass, but it has no dedicated reward focus. Current art direction specifies Rusty Metal 02 with rails, switch stands, station canopies, signal posts, turntables, and chunky riveted route hardware.

**Implementation plan:** (1) Follow the Chapter 5 packaging pattern and add a self-contained Chapter 6 production layer loaded after the stable shared runtime, extending the mutable visual-mode map so campaign Levels 251–300 use a new `copperline` mode while Daily remains neutral, Chapters 1–5 stay unchanged, Level 301 stays outside this visual slice, and Level 366 retains its Aurora override. (2) Build five distinct quiet Copperline movement surfaces from warm oxidized steel/rusted copper and muted station-platform materials; playable cells remain non-symbolic linear materials and scenery stays outside rules space. (3) Strengthen the chapter mechanic fixtures without changing behavior: rails become readable dark-steel route plates with a high-contrast cream/brass directional arrow, while turners become weighted round turntable plates with a clear curved route arrow and riveted edge. (4) Give Chapter 6 movement 3 a recognizable Atlas continuity landmark grounded in the actual evidence beat: a compact station archive/timetable kiosk with three staggered approved route plates / date cards beside rail hardware, so “they were all correct” exists as one physical object across Atlas and reward surfaces. The landmark must not overlap Atlas level nodes. (5) Add a dedicated real-Level-300 reward in which the old dated route plates sit beside one newly drawn working line; stars remain secondary. Reward actions are `Visit Little Home` and `Continue to Stormswitch`. The home action focuses the existing canonical stage-6 compass with a visible, reduced-motion-safe same-origin iframe emphasis. Continue must preserve normal campaign bookkeeping and reach Level 301 with the existing `Old Maps, New Routes` cinematic active. (6) Record the station-archive landmark in durable art direction and add explicit cache-keyed Chapter 6 assets to `index.html` only after candidate acceptance.

**Expected product files/systems:** new `pass3-chapter6-copperline.css`, new `pass3-chapter6-copperline.js`, `LEVEL_SELECT_ART_DIRECTION.md`, and `index.html`. Chapters 1–5 product assets and all shared runtime files are protected. All eight `campaign400-*.js` files, authored solutions, `story400.js`, `story-grounding400.js`, `STORY_BIBLE.md`, `cinematics400.js`, cinematic dialogue, audio, movement simulation/rules, `game400-a.js`, `game400-b.js`, shared board/Atlas/production styles, Little Home source, and Chapters 7–8 behavior are protected from change. Temporary validation/preparation helpers are not product.

**Scope-change / critical continuity fix:** During Chapter 6 live-promotion preparation, current `index.html` was found to contain `<div id="story-cast" id="storyCast"></div>` instead of the intended `<div class="story-cast" id="storyCast"></div>`. Because the duplicate `id` markup prevents the Story & Residents runtime from reliably finding `#storyCast` and also drops its styling class, this is treated as a critical pre-existing continuity defect. The Chapter 6 live-index promotion will restore the intended class/id markup and the final live-build validator will assert that `#storyCast.story-cast` exists. No story content or behavior is otherwise changed.

**Validation plan:** Use clean Chapter 5 final head `7fcbb3473d8c6b63018c840fdad62f3712c23aed` as the protected baseline. Candidate-first validation must hash/check all eight campaign definitions plus shared Chapters 1–5 runtime/story/cinematic/audio/Little Home assets before and after candidate application. Run JavaScript syntax/static assertions and Chromium at 390x844 for Levels 251/260/261/270/271/280/281/290/291/300, plus 320x568 for Levels 251 and 300. Verify Daily isolation on a Chapter 6 board, Level 250 remains Prism, Level 301 stays outside Copperline, and Level 366 remains `aurora-dense`. Assert all five Copperline board ranges use distinct quiet linear cell materials, cell pseudo-decoration stays suppressed, selected Latchling/matching nest hierarchy remains explicit, rail and turner fixtures are visually weighted/readable, active touch targets remain >=44px, controls stay inside the phone viewport, and no horizontal overflow/browser errors occur. Inspect movement 3’s archive/timetable landmark and assert zero overlap with Atlas level nodes. Solve the real authored Level 300 route to reach the dedicated reward, use `Visit Little Home` to verify the compass focus, verify reduced motion reaches the same informative compass state without animation dependence, and use `Continue to Stormswitch` to verify Level 301 opens with the existing `old-maps` cinematic active. Capture all five Copperline ranges, Atlas landmark, Level 300 reward, compass focus, cinematic continuation, and both small-phone endpoints for manual screenshot review before live wiring/promotion.

**Deployment plan:** This IN PROGRESS handoff entry is committed before product edits. Create Chapter 6 modular assets but keep them out of the live index for candidate validation where practical. Promote only after source-protection/static/full Chromium checks and manual screenshots are accepted. Then wire the exact accepted product assets into `index.html`, add the durable art-direction landmark note, rerun the complete acceptance gate against the committed live build, remove every temporary Chapter 6 helper/workflow, confirm GitHub Pages succeeds on the clean product head, close this same entry as COMPLETED/PARTIAL/BLOCKED with exact commits/runs/artifacts, and verify one final Pages deployment on the closeout head. Repository mutations continue through the connected GitHub integration; Actions may validate but must not be relied on to push commits.

### 2026-09-12 — Pass 3 Chapter 5 Prism campaign application

**Status: COMPLETED**

**User goal:** Continue the approved Pass 3 chapter-by-chapter visual/story rollout through Chapter 5, Prism Gardens / The Long Drift, campaign Levels 201–250, without changing authored puzzle data or destabilizing Chapters 1–4.

**Implementation shipped:** Chapter 5 now uses a self-contained production layer loaded after the stable shared runtime. `pass3-chapter5-prism.css` gives Levels 201–250 five distinct quiet pale-marble/glasshouse movement surfaces, translucent color gates keyed to their existing mechanic color, readable suit gates, and botanical/prismatic scenery outside the rules layer. Movement 3 adds the recurring pale glasshouse lookout with a compact brass scope aimed toward the same two distant amber porch lights established in Lanternwood. `pass3-chapter5-prism.js` opts Chapter 5 into the `prism` visual mode, preserves normal Level 250 progress/Atlas bookkeeping, replaces the generic Level 250 result with the dedicated new-coordinate Prism reward, supports `Visit Little Home` with a visible reduced-motion-safe focus on the canonical stage-5 telescope, and preserves the existing `Across the Drift` cinematic transition into Level 251. `LEVEL_SELECT_ART_DIRECTION.md` records the lookout/twin-light landmark as durable Chapter 5 language, and `index.html` loads the two Chapter 5 production assets with explicit cache keys.

**Important packaging decision:** An earlier integrated candidate edited shared runtime/style files and passed its browser matrix, but GitHub Actions in this repository currently receives a read-only push token even when a workflow requests `contents: write`. Before product promotion, the scope change was recorded at `88ccf5e6014dafd7022ea86c04937ce7aa5c3cb2`, and Chapter 5 was repackaged into explicit modular assets so the accepted Chapter 1–4 shared files could remain byte-for-byte unchanged. This was a packaging change only; campaign definitions, story, cinematics, mechanics, and authored solutions were not changed.

**Product commits:**
- `da7a926e7aea33fba286081c8e39e9f603b56d70` — add modular Chapter 5 Prism production CSS.
- `862ad9f444ad5349208f72a606f22d571739e16c` — add modular Chapter 5 Prism runtime/reward/telescope focus.
- `db7d4c5dceee635889a0442f15273bddcc37af30` — wire the Chapter 5 assets into the live page and add the durable Prism lookout art-direction note.
- `86f2bc1498e16ee7122c5566ea635178805048a7` — remove all Chapter 5 validation/preparation workflows and helper files after acceptance.

**Final validation:** Live-build validation run `34770385665`, job `103758785331`, succeeded against committed head `850b5c8496fd15fd9de9ca924e0442e6e9562b03`. Evidence artifact `chapter5-pass3-live-acceptance`, ID `10321239866`, SHA-256 `8813dc7dfc620accbfab9641aeddcd92d7fec1ab2b58df16fb0bb2cbc1fc67e4`. The gate verified all eight campaign definition files plus shared Chapter 1–4 runtime/story/cinematic/audio/Little Home sources were unchanged from clean Chapter 4 checkpoint `6573e9ecc84de26e17f801534b42ee7131ff7da0`; both modular assets loaded exactly once; Levels 201/210/211/220/221/230/231/240/241/250 mapped to `prism`; all five movement floors were distinct quiet linear materials; selected Latchling/matching nest hierarchy remained explicit; color gates retained matched keyed edge/core glass treatment; suit gates stayed readable; Daily stayed neutral; Level 200 remained Masquerade; Level 251 stayed outside the Prism slice; and Level 366 retained the Aurora override.

**End-to-end payoff validation:** The movement-3 glasshouse lookout had no overlap with any Atlas level node and retained its brass scope plus twin amber lights. The validator solved the real authored Level 250 route, reached the dedicated Prism reward, verified `Visit Little Home` revealed/focused the canonical telescope inside the Little Home frame, verified reduced-motion produced the same informative telescope state with animation disabled, and verified `Continue to Copperline` reached Level 251 with the existing `Across the Drift` cinematic active. No browser errors occurred.

**Small-phone and manual review:** At 320×568, Levels 201 and 250 had no horizontal overflow, controls ended at `565.6875px` inside the `568px` viewport, and the smallest active target measured `44.796875px`. Fresh screenshots from the committed live build were manually reviewed across all five Prism ranges, the node-clear Atlas lookout, Level 250 reward, Little Home telescope focus, Across the Drift continuation, and both 320×568 endpoints. No further visual correction was required.

**Deployment/cleanup:** GitHub Pages run `34770543286` (run 1063) succeeded on clean product/helper-cleanup head `86f2bc1498e16ee7122c5566ea635178805048a7`. `.github/workflows` is back to only `validate-repository-access-guard.yml`; `.github/tmp` is absent. No known Chapter 5 blocker remains.

**Next Pass 3 action:** Begin Chapter 6, **Copperline Junction, Levels 251–300**, as a new protected slice. Re-read current Chapter 6 story/grounding and campaign sources before design. Use the existing durable art direction as the baseline: Rusty Metal 02 material language with rails, switch stands, station canopies, signal posts, turntables, and chunky riveted route hardware. Preserve Chapters 1–5, Daily isolation, authored puzzle data, and the Level 366 Aurora override. Add the Chapter 6 `IN PROGRESS` handoff entry before implementation, then use the same candidate/live-build source-protection, real chapter-end solution, 320×568, reduced-motion, manual screenshot, cleanup, and final Pages gates.

## Previous checkpoint — Pass 3 Chapter 4 Masquerade

**Status: COMPLETED**

- Product commit: `dd38de6285eed52a326d5bd66f85080b162ce62b` (`Apply Pass 3 production treatment to Masquerade`).
- Chapter 4 / Levels 151–200 use the `masquerade` production family with five moonlit plaster/stone movement ranges, readable civic suit gates, a movement-3 old civic suit-gate Atlas landmark, a dedicated real-Level-200 Market Day reward, and the canonical stage-4 Little Home bunting payoff.
- Promotion run `34740177742`, job `103678447912`, artifact ID `10312372982`, SHA-256 `543d6387186f72b4b280682c743917f5d834856f136733abae5a8b733ed590b8` passed the protected-source/static/full Chromium/real-Level-200/reward-home/reduced-motion gates.
- Final Chapter 4 closeout helper cleanup head `6573e9ecc84de26e17f801534b42ee7131ff7da0`; GitHub Pages run `34740316491` (run 1043) succeeded on that head.
- Full Chapter 4 and all earlier journal evidence remains in `DEVELOPMENT_HANDOFF_ARCHIVE_2026-09-12.md`.