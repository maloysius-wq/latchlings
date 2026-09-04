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

### 2026-09-04 — Fix Little Home cottage roof seam

**Status: IN PROGRESS**

**User goal:** Clarify the title-screen cottage silhouette. If the apparent house-and-shed composition is actually intended to be one house, visually bridge the separated roof masses so the building unmistakably reads as a single cottage rather than two detached structures.

**Implementation plan:** Inspect the existing Little Home cottage markup/CSS in `title-island-concepts/index.html` and preserve its established walls, chimney, windows/door, island placement, resident choreography, title layout, and 1.10× island scale. Confirm whether the current roof sections belong to one cottage. If they do, add the smallest connecting roof geometry needed to close the visible gap, matching the existing roof palette and depth language rather than redesigning the cottage.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md` and `title-island-concepts/index.html`; one temporary self-removing GitHub Actions validation/render workflow may be used. No gameplay, campaign, story, audio, Latchling model, title typography, island geometry, or resident sizing changes are intended.

**Validation plan:** Static validation must show only the title cottage source changed in the product. Chromium at the production 390×844 title viewport must verify the cottage retains its existing position/footprint, the connecting roof is visible and overlaps the adjacent roof masses rather than floating separately, no horizontal overflow appears, and the five-resident/title composition remains intact. Render a clean title screenshot for manual visual inspection before accepting the change.

**Deployment plan:** Commit this handoff entry before product edits, run the isolated roof fix behind a self-removing workflow, inspect the render, commit only the accepted title change, verify GitHub Pages deployment, then mark this entry `COMPLETED` with implementation/deployment IDs and remaining risk.

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
