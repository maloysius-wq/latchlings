# Latchlings Development Handoff

Last updated: 2026-09-13

## Start here

This repository is the source of truth for **Latchlings**.

- Repository: `maloysius-wq/latchlings`
- Live build: `https://maloysius-wq.github.io/latchlings/`
- Runtime: intended 400-level themed campaign on `main`
- Full historical journal through completed Pass 3 Chapter 4: `DEVELOPMENT_HANDOFF_ARCHIVE_2026-09-12.md`
- Full active-journal history through completed Pass 3 Chapter 6: `DEVELOPMENT_HANDOFF_ARCHIVE_2026-09-13_CH6.md`
- Full active-journal history through completed Pass 3 Chapter 7: `DEVELOPMENT_HANDOFF_ARCHIVE_2026-09-13_CH7.md`
- Full active-journal history through completed Pass 3 Chapter 8: `DEVELOPMENT_HANDOFF_ARCHIVE_2026-09-13_CH8.md`

Always inspect current `main`, `index.html`, and this handoff before changing anything. Read the dated archives when older implementation history or validation evidence is needed.

### REPOSITORY ACCESS PRE-FLIGHT — HARD GATE

For **all repository work in this project**, the connected **GitHub plugin/connector is the canonical and first-line repository path**. If GitHub functions are not already loaded, the first tool action for a repository task must be connector/plugin discovery for `GitHub`. The first repository read must be `DEVELOPMENT_HANDOFF.md` through `GitHub.fetch_file` or equivalent.

A failed local clone, missing checkout, container DNS failure, generic web failure, raw-GitHub failure, or absence of preloaded GitHub functions is never evidence that GitHub access is unavailable. An agent may claim GitHub is unavailable only after GitHub plugin discovery has explicitly been attempted and a real GitHub connector repository read cannot be invoked or fails. If the wrong route is attempted first, recover immediately through GitHub and continue the original request without asking the user to repeat the plugin instruction.

Read `AGENTS.md` and `.github/REPOSITORY_ACCESS_PREFLIGHT.md` for the durable preflight contract. The repository guard workflow validates that these instructions remain present.

## MANDATORY handoff workflow

For every substantive repository task:

1. Read this file and inspect current `main` through GitHub.
2. Before implementation, add/update a `Current Work` entry with date, user goal, implementation plan, expected files/systems, validation plan, deployment plan, and `IN PROGRESS` status.
3. Commit that handoff update before implementation begins.
4. If scope changes materially, update the handoff again while work is underway.
5. After implementation, update the same entry to `COMPLETED`, `PARTIAL`, or `BLOCKED` and record exact changes, decisions, files, tests, deployment, risks, and next action.
6. Commit the final handoff update after implementation/deployment commits.

If a chat is interrupted, this file must already contain enough detail to resume immediately. Older completed entries belong in the dated archives rather than being discarded.

---

## Current Work

### 2026-09-13 — Original visual/story audit continuation: focused R1–R5 usability pass

**Status: IN PROGRESS**

**User goal:** Continue the original Astra visual/story audit from the independent implementation review rather than treating completed Pass 3 as completion of the full audit. First fix review findings R1–R5 with settled browser evidence while preserving accepted chapter art, all 400 campaign definitions/solutions, Daily isolation, story canon, chapter rewards, and the certified Pass 3 presentation. After this focused unit is closed, proceed to the outstanding original Pass 4 cinematics/ending work and then Pass 5 mobile/device finishing.

**Source-of-truth review material:** Current GitHub `main` plus the user-supplied `LATCHLINGS_IMPLEMENTATION_REVIEW.md`, reviewed alongside the original Library file `LATCHLINGS_VISUAL_STORY_AUDIT.md`. The original audit defines Pass 4 as restaging all 25 cinematic beats around a shared renderer/chronological dialogue and bringing the ending onto canonical Little Home; Pass 5 covers actual phones, iOS/Safari, safe areas, text scaling, touch/focus, asset loading/audio, performance, and cleanup. The September 13 implementation review explicitly says Pass 3 is substantial progress but the full audit is not complete.

**Certified baseline:** `main` is `d6e39c0866505795c2aa6a26777896072e16e7df`. GitHub Pages run `34796217103` (1118) and repository-access guard run `34796218186` (23) both completed successfully on that exact SHA. This is the immutable product baseline for the R1–R5 repair pass.

**R1 — story/mechanic clipping:** The review reproduced 40 clipped story rails at Levels 71–80, 141–150, 201–210, and 341–350, plus 305/400 route tips exceeding the existing two-line box. Current sources still show `.story-level-rail{overflow:hidden}`, compact fixed-height behavior, and `.mechanic-chip-copy` with a two-line WebKit clamp. Required correction: keep the readable font size, allow safe wrapping/growth, and author/retain concise immediate copy so essential distinctions are never hidden. Do not solve by shrinking text.

**R2 — Reduced Motion resident scheduler:** Little Home currently captures `matchMedia('(prefers-reduced-motion: reduce)').matches` into a constant used by the adult movement scheduler. The game later sends live `motion` state to the iframe, but the scheduler does not recompute effective motion or cancel active movement/pending timers. Required correction: use a live effective preference combining game setting and OS preference, cancel active resident Web Animations and timers when reduced motion is enabled or the scene is inactive, and resume deliberately only when allowed.

**R3 — hint highlight lifetime:** `showHint()` currently highlights the recommended piece/direction before opening the hint modal and removes those classes after 3200ms. A player who reads longer returns to no highlight. Required correction: activate/persist the board highlight on `Back to board`, and clear it only after an appropriate interaction such as the suggested move, reset, selection/direction change, or a deliberate expiry that begins after board return. Preserve the reset-before-hint warning.

**R4 — Large Text coverage:** Current large-text rules enlarge the route-tip copy at ordinary heights but do not enlarge `.story-rail-main p`; the short-screen `!important` route-tip rule defeats large text at 320×568. Required correction: define a shared large-text scale for essential story/route guidance and allocate enough layout room at both ordinary and short screens. Revalidate dialogs, cinematics, and journal surfaces touched by the same preference rather than treating viewport containment as permission to ignore the selected size.

**R5 — small-screen cinematic navigation:** The review found 14/25 settled cinematic beats at 320×568 with some/all of Continue initially below the viewport inside the scrollable presentation. Required correction: keep cinematic navigation/progress in a persistent footer outside the scrolling dialogue/content region, preserving readable essential text instead of shrinking it. Continue/Skip targets must remain visible/reachable at initial scroll position.

**Expected product files/systems:** likely `style400-story-rail-board.css`, `style400-story-theme.css`, `style400-game.css`, `game400-b.js`, `title-island-concepts/index.html`, and the existing cinematic layout/style/runtime files after exact source inspection. Avoid creating another broad override layer merely to mask the defects. `campaign400-1.js` through `campaign400-8.js`, authored solutions/puzzle data, accepted Pass 3 chapter modular CSS/JS, story canon, chapter rewards, and final campaign semantics are protected unless a review finding explicitly requires presentation-only changes.

**Implementation plan:** (1) inspect the exact current cinematic DOM/CSS and Little Home scheduler before editing; (2) repair R1/R4 together so the rail and mechanic cue wrap/grow consistently under normal and large text; (3) repair R2 with a live motion-state controller and inactive-scene cancellation; (4) repair R3 with board-return-driven hint focus lifecycle; (5) repair R5 by separating the cinematic scrolling content from a persistent action footer using the existing shared cinematic presentation system; (6) keep changes targeted and consolidate existing rules where possible rather than stacking another general-purpose override file.

**Validation plan:** protect/hash all eight campaign definition files and accepted Pass 3 chapter modules against baseline `d6e39c...`. Use Chromium evidence at 390×844 and 320×568. For R1, render all 400 starting boards under normal and large text and assert no story-rail ancestor clipping and no hidden/truncated route-tip teaching; explicitly verify the four previously failing ten-level ranges and Level 201 wording. For R2, test in-game Reduced Motion independently with OS motion normal, confirm no resident position change after a >12.5s dwell, confirm pending timers/active movement are cancelled, and verify deliberate resume when motion returns to System. For R3, keep the hint modal open beyond the old 3.2s lifetime, return to the board, assert the recommended piece/direction are still visibly highlighted, then verify cleanup after the suggested move/reset/change. For R4, measure actual computed story and route-tip font sizes at normal vs Large Text on 390×844 and 320×568 and verify dialogs/cinematic/journal text does not regress. For R5, render all 25 settled cinematic beats at 320×568 and assert Continue/Skip/progress are initially visible and outside the scrolling content region. Re-run representative gameplay containment/touch-target checks, Daily isolation smoke, no browser errors, and real authored solutions for Levels 1/50/100/150/200/250/300/350/400.

**Deployment plan:** implement on `main` only after this IN PROGRESS journal commit. Use temporary CI/browser helpers only as needed and remove them before closeout. Promote only after automated and manual evidence pass. Confirm Pages on the clean product head, update this entry to `COMPLETED/PARTIAL/BLOCKED` with exact commits/runs/artifacts and any residual audit items, then certify the exact final handoff head with Pages plus the repository-access guard.

**Scope boundary:** This current unit closes only R1–R5. Do **not** mark the original audit complete after this unit. Pass 4 cinematic restaging/ending, home/Atlas/journal coherence, and Pass 5 physical-device/iOS/audio/performance/accessibility work remain separate until explicitly implemented and verified.

## Completed checkpoint — Pass 3 campaign application

**Status: COMPLETED AND CERTIFIED**

- The chapter-by-chapter Pass 3 rollout across Chapters 1–8 / Levels 1–400 is complete.
- Final certified Pass 3 head: `d6e39c0866505795c2aa6a26777896072e16e7df`.
- Exact-head Pages run `34796217103` (1118): completed/success.
- Exact-head repository-access guard run `34796218186` (23): completed/success.
- Full Chapter 8 implementation and validation history is preserved byte-for-byte in `DEVELOPMENT_HANDOFF_ARCHIVE_2026-09-13_CH8.md`.

**Next action:** Finish R1–R5 first. Then open a separate IN PROGRESS unit for the original Pass 4 cinematic/ending redesign; keep Pass 5 and untested physical-device/audio/performance items explicitly separate.
