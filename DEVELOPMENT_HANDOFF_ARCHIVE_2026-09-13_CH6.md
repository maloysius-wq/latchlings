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

**Status: COMPLETED**

**User goal:** Continue the approved Pass 3 chapter-by-chapter visual/story rollout through Chapter 6, Copperline Junction / Old Ways, campaign Levels 251–300, without changing authored puzzle data or destabilizing Chapters 1–5.

**Implementation shipped:** Chapter 6 now uses the self-contained `pass3-chapter6-copperline.css` / `pass3-chapter6-copperline.js` production layer loaded after the accepted shared runtime. Campaign Levels 251–300 map to `copperline`; Daily remains neutral; Level 250 remains Prism; Level 301 stays outside the Copperline visual slice; and Level 366 retains the Aurora override. The five ten-level movements use distinct quiet oxidized-steel / station-platform linear materials. Rails now read as weighted dark-steel directional route plates with cream/brass arrows, while turners read as round riveted turntables with a high-contrast curved route arrow, with no behavior changes. Outside rule space, the chapter uses a station canopy and signal-post vocabulary.

**Story/Atlas/reward payoff:** Movement 3 now carries the recurring station archive / timetable kiosk grounded in the authored `They Were All Correct` evidence beat: three staggered approved route plates from different years sit beside signal hardware. The first candidate placement overlapped Atlas Level 279, so it was rejected before promotion and moved to a node-clear mid-right pocket. Level 300 now has a dedicated Copperline reward showing the historical maps beside one newly drawn working line, a signal, and the Waykeeper compass. `Visit Little Home` visibly focuses the canonical stage-6 compass with a reduced-motion-safe treatment; `Continue to Stormswitch` preserves normal campaign/Atlas bookkeeping and reaches Level 301 with the existing `Old Maps, New Routes` (`old-maps`) cinematic active. `LEVEL_SELECT_ART_DIRECTION.md` records the archive kiosk as durable Chapter 6 language.

**Critical continuity fix included:** During live-promotion preparation, `index.html` was found to contain invalid duplicate-id markup, `<div id="story-cast" id="storyCast"></div>`, instead of the intended `<div class="story-cast" id="storyCast"></div>`. The scope change was recorded at `b6174dd4d2e4915f28d38b79e854f2a61883e7d4` before the product fix. The live index now contains the intended `#storyCast.story-cast` element, restoring both the runtime lookup target and styling class. The final live-build static gate explicitly rejected the old duplicate-id form and required the corrected form. No story text or authored story behavior changed.

**Product / implementation commits:**
- `ae913cab8f6ecc76fd5c1f41c825e54babef8b58` — open Chapter 6 `IN PROGRESS` handoff before product edits.
- `6508713608a83b8609129e3292f3b154ae93ce31` — add modular Chapter 6 Copperline production CSS.
- `3744d7a8c297551e1cc761930decb78691ed8373` — add modular Chapter 6 runtime, Level 300 reward, and compass focus.
- `ea955e6a53a744ab5ac5a2e09939e0354358f49a` — move the archive kiosk clear of Atlas route nodes after candidate rejection.
- `b6174dd4d2e4915f28d38b79e854f2a61883e7d4` — document the Story & Residents continuity-fix scope change before promotion.
- `1ea52d9e3cfed529231becf6dbc6434e401c1808` — record the Copperline archive landmark in durable art direction.
- `692bf59bbf2d625931b923d31d1c4ed2b8f67e9b` — wire Chapter 6 into the live page and repair `#storyCast.story-cast` markup.
- `f79918c336fbc4789b6d47a36a822701bb8ce215` — final committed-live validation workflow revision.
- `6095e2565a29e5394fd2068a18a3f772742e2c6e` — final Chapter 6 helper cleanup head; all Chapter 6 temporary workflow/helper files are removed.

**Candidate validation:** Candidate run `34779257003`, job `103783122077`, correctly failed only because the initial archive kiosk overlapped Level 279; source protection, static checks, and all Copperline board-range checks before the Atlas assertion were clean. The landmark was repositioned without changing mechanics or reward logic. Refined candidate run `34779404826`, job `103783535394`, then completed successfully. Candidate artifact `chapter6-pass3-candidate`, ID `10325355062`, SHA-256 `39ce978f0e15f0283005332606a022aa88dea29dd674ec5b120ee305b5efac40`, passed the full Chapter 6 matrix and supplied the screenshots accepted for promotion.

**Final live-build validation:** Run `34779823500`, job `103784662772`, completed successfully against the committed live build. Artifact `chapter6-pass3-live-acceptance`, ID `10324541061`, SHA-256 `9f1d2fadb85ed62120eae1bc8c71328d0806f4c58828e70e2469dfb37622a44f`. The gate verified all eight campaign definition files plus shared Chapters 1–5 runtime/story/cinematic/audio/Little Home assets were unchanged from clean Chapter 5 baseline `7fcbb3473d8c6b63018c840fdad62f3712c23aed`; the accepted Chapter 6 CSS/JS were byte-stable from the approved refined candidate; Chapter 6 CSS/JS were referenced exactly once in `index.html`; the corrected `#storyCast.story-cast` markup was present; and the durable art-direction note existed.

**Browser / gameplay acceptance:** Chromium covered Levels 251/260/261/270/271/280/281/290/291/300 at 390×844 plus Levels 251/300 at 320×568. All Chapter 6 representatives mapped to `copperline`; all five movement cell floors were distinct quiet linear materials; cell pseudo-decoration remained suppressed; selected Latchling / matching nest hierarchy stayed explicit; rails and turners retained their readable weighted treatments; Daily remained neutral; Level 250 stayed Prism; Level 301 stayed outside Copperline; and Level 366 retained `aurora-dense`. The movement-3 archive kiosk had zero overlap with Atlas nodes. The validator solved the real authored Level 300 route, reached the dedicated reward, verified the Little Home compass focus, verified the reduced-motion state with animation disabled, and verified `Continue to Stormswitch` reached Level 301 with `old-maps` active. No browser errors occurred.

**Small-phone and manual review:** At both Level 251 and Level 300 on 320×568, document width remained exactly 320px with no horizontal overflow, the controls ran from `422.6875px` to `565.6875px` inside the 568px viewport, and the smallest active control target measured `44.796875px`. Candidate and committed-live screenshots were manually reviewed across all five Copperline ranges, the node-clear archive kiosk, Level 300 reward, Little Home compass focus, Old Maps continuation, and both small-phone endpoints. The final visual treatment was accepted without another correction pass.

**Deployment / cleanup:** All temporary Chapter 6 workflows and `.github/tmp` helpers were removed. `.github/workflows` is again only `validate-repository-access-guard.yml`, and `.github/tmp` is absent. GitHub Pages run `34779967036` (run 1083) completed successfully on `0400fdd248c99441594e7dd1d03b62a5b9168133`; the only subsequent cleanup change before `6095e2565a29e5394fd2068a18a3f772742e2c6e` was deletion of the remaining `.github/tmp` validator helper, so served product bytes were unchanged. The final handoff commit is expected to trigger the exact-head Pages verification required by the project contract. A one-byte connector scratch file named `_tmp_should_not_use` was accidentally created during promotion assembly and immediately removed before live validation; it was never referenced by the application and is absent from the final tree.

**Known blockers / risks:** None for Chapter 6. The repository Actions token remains unsuitable for push mutations, so future repository writes should continue through the connected GitHub integration while Actions remains the validation runner.

**Next Pass 3 action:** Begin Chapter 7, **Stormswitch Foundry, Levels 301–350**, as a new protected slice. Re-read current Chapter 7 campaign/story/grounding/cinematic sources before design. Use the durable baseline already in `LEVEL_SELECT_ART_DIRECTION.md`: Blue Metal Plate with factory stacks, relay towers, switch banks, insulated conduits, lightning masts, and storm-lit steel. Determine the Chapter 7 recurring landmark and Little Home payoff from the authored story rather than inheriting Copperline motifs. Preserve Chapters 1–6, Daily isolation, authored puzzle data, and Level 366 Aurora override. Open the Chapter 7 `IN PROGRESS` handoff before implementation and repeat the source-protection, candidate-first, real Level 350 solution, 320×568, reduced-motion, manual screenshot, cleanup, and exact-head Pages gates.

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