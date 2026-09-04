# Latchlings Development Handoff

Last updated: 2026-09-04

## Start here

This repository is the source of truth for **Latchlings**.

- Repository: `maloysius-wq/latchlings`
- Live build: `https://maloysius-wq.github.io/latchlings/`
- Runtime: intended 400-level themed campaign on `main`

Always inspect current `main`, `index.html`, and this handoff before changing anything.

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

If a chat is interrupted, the handoff must already contain enough detail to resume immediately. This file is a live project journal, not an end-of-chat summary.

---

## Current Work

### 2026-09-04 — Repair global Latchling coverage and finish the canonical campaign ending

**Status: IN PROGRESS**

**User goal:** Continue development from the current repository, repairing any critical handoff issue before new feature work. The continuation audit found that the completed global spherical-model handoff missed the campaign-completion screen: `index.html` still renders three legacy `.hero-latch` characters with old `.mini-eye` / `.mini-mouth` faces. The same screen also predates the canonical ending defined in `STORY_BIBLE.md`, which requires the final beat to preserve **Skyway Restored**, return emotionally to Little Home, show the larger connected community, and make clear that the islands still drift while the routes move with them.

**Implementation plan:** First eliminate the stale completion-screen Latchling treatment and replace it with the same authored spherical-face language used elsewhere: circular gradient bodies, dark glossy blinking eyes with catchlights, soft cheeks, raised readable mouths, forehead suit symbols, and no head appendages. Then turn the existing generic campaign-completion card into the canonical Level 400 epilogue without changing campaign mechanics or completion flow: use the `Skyway Restored` ending language, stage Little Home with the five household residents, add subtle distant connected islands / route lights, and keep both existing navigation actions. Respect reduced-motion preferences and asynchronous blink timing.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, `index.html`, and `style400-ui.css`. `game400-b.js` should remain unchanged unless validation reveals a completion-flow defect. Campaign definitions, solver data, level progression, Story Card content, Little Home title source, audio, and gameplay Latchling model are not in scope.

**Validation plan:** Static checks must confirm no `.hero-latch`, `.mini-eye`, or `.mini-mouth` markup/styles remain; the completion heading contains `Skyway Restored`; exactly five ending residents are present with forehead suit marks and refined face parts; existing `completeLevels` and `completeHome` controls remain; and no campaign/gameplay files changed. Browser validation should reach or force the completion screen at the production phone viewport and a wide viewport, verify no horizontal overflow, verify all five ending residents are circular and visible with dark eyes/catchlights/cheeks/mouths/suits, confirm route-light scenery is visible without obscuring controls, and confirm reduced-motion disables face/route animation. The completion navigation buttons must still work.

**Deployment plan:** Commit this handoff entry before product edits, implement the ending repair directly on `main`, run isolated static/browser validation through a temporary self-removing workflow if needed, verify the exact implementation deploys successfully through GitHub Pages, then close this entry with commit/run IDs and remaining risk.

---

### 2026-09-04 — Fix Little Home cottage roof seam

**Status: COMPLETED**

**User goal:** Clarify the title-screen cottage silhouette. If the apparent house-and-shed composition is actually intended to be one house, visually bridge the separated roof masses so the building unmistakably reads as a single cottage rather than two detached structures.

**Implementation plan:** Inspect the existing Little Home cottage markup/CSS in `title-island-concepts/index.html` and preserve its established walls, chimney, windows/door, island placement, resident choreography, title layout, and 1.10× island scale. Confirm whether the current roof sections belong to one cottage. If they do, add the smallest connecting roof geometry needed to close the visible gap, matching the existing roof palette and depth language rather than redesigning the cottage.

**Render refinement note:** The first validated overlap pass (Actions run `33902161335`, artifact `9948058317`) removed the literal box gap but manual inspection still read the right roof as a second attached gable because `.roof-b` retained its own independent peak. The final geometry is therefore being refined so the darker side roof plane begins at the front gable's existing apex/ridge and slopes back over the side wall, which is the correct single-cottage perspective. The cottage footprint and all non-roof title elements remain unchanged.

**Process correction:** A temporary roof-fix workflow was initially staged before the current-work entry was committed. Its product-edit step was gated on this handoff entry, and cleanup was staged to remove that premature workflow before implementation continues. No title product change is accepted until the cottage source is directly inspected and the exact existing roof markup/classes are confirmed.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md` and `title-island-concepts/index.html`; temporary self-removing GitHub Actions validation/render workflow(s) may be used. No gameplay, campaign, story, audio, Latchling model, title typography, island geometry, or resident sizing changes are intended.

**Validation plan:** Static validation must show only the title cottage source changed in the product. Chromium at the production 390×844 title viewport must verify the cottage retains its existing position/footprint, the connecting roof is visible and overlaps the adjacent roof masses rather than floating separately, no horizontal overflow appears, and the five-resident/title composition remains intact. Render a clean title screenshot for manual visual inspection before accepting the change.

**Deployment plan:** Commit this handoff entry before product edits, run the isolated roof fix behind a self-removing workflow, inspect the render, commit only the accepted title change, verify GitHub Pages deployment, then mark this entry `COMPLETED` with implementation/deployment IDs and remaining risk.

#### Completion summary

**Structure decision:** The Little Home building is one cottage, not a house plus shed. The source uses one `.cottage` container with `.house-front` and `.house-side` wall planes plus `.roof-a` and `.roof-b` roof planes. The original `.roof-b` had an independent peak, which made the side plane read as a second attached building even though it belonged to the same cottage.

**First pass and refinement:** The first fix joined the roof boxes more aggressively in commit `c510d8244715a5497cc1a7a5b1570df62c0eee1f` and passed Actions run `33902161335` with artifact `9948058317`, but manual render inspection rejected it as the final answer because the side roof still visibly had its own gable peak. The handoff was updated before refinement in commit `910b6ea4c15653219f7dae2bbc941a3f20dc87e3`.

**Final implementation:** Commit `4832185884d5eff38cca784cddf1fc03b4536222` (`Unify Little Home cottage roof ridge`) changes the darker side roof plane so it begins at the existing front-gable apex/ridge and slopes back over the side wall. The far-right roof edge and the cottage's 111×100 logical footprint remain unchanged; only the side-plane geometry changed. The result now reads as one cottage with a front gable and connected side roof rather than two neighboring gables.

**Validation:** Actions run `33902364020` passed static and Chromium checks at the production 390×844 title viewport. It verified shared ridge alignment, unchanged cottage footprint, no horizontal overflow, the same five-resident roster, and unchanged rendered resident sizes (34×34 px adults, 25×25 px children). Artifact `9948130433` (`little-home-cottage-shared-ridge`) was downloaded and manually inspected; both the full title render and close-up were accepted.

**Deployment:** GitHub Pages run `33902423865` completed successfully for implementation commit `4832185884d5eff38cca784cddf1fc03b4536222`. The final live-source check also confirmed the shared-ridge `.roof-b` rule is present on the deployed title before this handoff was closed.

**Repository hygiene / remaining risk:** Temporary roof-fix/refinement workflows self-removed, the accidental staging file was removed, and the failed temporary finalizer attempts were cleaned up. `.github/workflows/validate-repository-access-guard.yml` remains the only durable workflow. No blocking issue remains.


---

### 2026-09-04 — Refresh all Latchlings with refined spherical face model

**Status: COMPLETED**

**Continuation audit note (2026-09-04):** The product refresh had reached `ec21a9fa2a11b4c9377827b67d2cb51290f0aa0f`, and validation run `33897067802` passed its programmatic assertions, but artifact `9946166689` did not provide trustworthy settled-state proof for every requested surface: the puzzle/title/residents captures included transition or completion overlays. The task was kept open until a corrected settled-state visual audit ran. Repository cleanup also found temporary model-refresh workflows that failed to self-remove; they were removed as part of that handoff repair before new feature work.

**User goal:** Promote the selected HTML makeover direction (#4, then refined with a raised mouth) into the actual game for every Latchling. Preserve the established species/gameplay identity while making the cast feel cuter, cleaner, and more intentionally authored: true spherical bodies, no head protrusions, dark glossy blinking eyes with catchlights, soft cheeks, raised readable mouths with the existing expression variety, and suit symbols retained on the forehead.

**Implementation plan:** Treat the refined #4 model as one shared visual language across all production surfaces. Update puzzle-board Latchlings in `style400-game.css` without changing piece dimensions, movement, selection, color/suit identity, or solver data. Update the embedded Little Home/title residents in `title-island-concepts/index.html` with the same spherical body/face ratios while preserving the five-resident choreography and the existing reciprocal island counter-scale. Update named Story Card portraits and Story & Residents avatars in `story-theme400.js` / `style400-story-theme.css` so they use the same eyes, cheeks, mouths, expressions, and forehead suits instead of the older simplified avatar face. Keep the existing seven gameplay expressions (happy, surprised, angry, smug, sleepy, curious, determined), canonical named-resident expressions, asynchronous blink timing, and reduced-motion handling. Do not add horns, stems, ears, hair, leaves, hats, or any other head appendage.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, `style400-game.css`, `title-island-concepts/index.html`, `story-theme400.js`, and `style400-story-theme.css`; `index.html` only if a loader change proves necessary. Temporary self-removing GitHub Actions validation/render files may be used. Campaign definitions, level data, story text/canon, title layout/island geometry, textures, music, and SFX remain unchanged.

**Validation plan:** Static checks must prove all seven expression classes remain supported, suit SVGs remain on the forehead, no head-appendage markup/classes are introduced, campaign files and gameplay JS logic remain unchanged except any strictly presentation-only avatar markup required in story UI, and title resident roster/sizes remain unchanged. Chromium must validate representative puzzle Latchlings for all seven expressions, dark eyes with visible catchlights, cheek presence, raised mouth geometry, forehead suit placement, sphere width=height, asynchronous blinking, selection outline, movement/solving, and no input regression. It must validate all five title residents at their existing rendered sizes (34 px adults / 25 px children) and verify choreography/blinking, plus single and paired Story Cards and the Story & Residents screen with named-character expressions, cheeks, mouth, blink, suit/color fidelity, and no overflow. Run phone + wide viewport and reduced-motion checks. Render puzzle, title, story-card, and Residents-screen screenshots for manual visual inspection before deployment.

**Deployment plan:** Commit this handoff entry before product edits, implement behind a self-removing workflow, run strict static + Chromium validation and inspect render artifacts. Refine if any surface looks inconsistent or cramped. Commit only the green product result, deploy that exact implementation SHA through GitHub Pages, then close this same handoff entry with the final visual measurements, validation/artifact/deployment IDs, implementation SHA, and remaining risk.


#### Completion summary

**Implementation:** The refined spherical face language is now the production Latchling model across puzzle-board pieces, the five Little Home residents, named Story Card portraits, and Story & Residents avatars. The model keeps circular bodies with no head appendages, dark glossy eyes and catchlights, soft cheeks, raised expression-specific mouths, and forehead suit marks. Puzzle gameplay still supports all seven authored expressions (happy, surprised, angry, smug, sleepy, curious, determined), while the five named residents retain their canonical expressions and asynchronous blink timing.

**Product commit:** `ec21a9fa2a11b4c9377827b67d2cb51290f0aa0f` (`Refresh all Latchlings with polished spherical faces`). Product files changed there are `style400-game.css`, `title-island-concepts/index.html`, `story-theme400.js`, and `style400-story-theme.css`; campaign definitions, puzzle mechanics, story canon, audio, and production loader remained unchanged.

**Handoff repair:** Continuation audit found that the earlier programmatic validation run `33897067802` had passed, but its render artifact `9946166689` captured several requested surfaces during transitions or with completion overlays. Those images were not accepted as final visual proof. Five temporary model-refresh workflows that had failed to self-remove were also found on `main`. Repair commit `4559f1ed28e6f225ed267e82d314904a8cfeb273` documented the gap and removed all abandoned temporary workflows before further feature work.

**Corrected validation:** Settled-state audit run `33901011206` completed successfully. Its browser harness isolated every surface in a fresh state and rejected captures if the wrong screen, generic modal, or Story Card overlay was present. It verified the clean Level 400 puzzle, clean Little Home title, single and paired Story Cards, the Story & Residents screen, wide-layout Story Card behavior, and reduced-motion behavior. It also rechecked spherical geometry, dark eyes/catchlights, cheeks, raised mouth placement, forehead suits, async blinking, selection state, absence of head appendages, five-resident roster, and the established Little Home sizes of **34×34 px adults** and **25×25 px children**. The audit produced artifact `9947639477` (`settled-latchling-refresh-renders`) with six clean renders, all manually inspected and accepted. The temporary audit workflow self-removed in commit `60c8d0252b4c46f70eee138d1de549c3563bf12b`.

**Deployment:** GitHub Pages run `33901071825` completed successfully for audit-clean commit `60c8d0252b4c46f70eee138d1de549c3563bf12b`. This finalization run `33901345334` additionally fetched the deployed production HTML/CSS and opened `https://maloysius-wq.github.io/latchlings/` in Chromium, verifying the Little Home roster and the live Level 400 spherical puzzle model with no browser errors before this handoff was closed.

**Repository hygiene:** All model-refresh implementation/audit workflows are now self-removed; `.github/workflows/validate-repository-access-guard.yml` is the only durable workflow expected to remain.
