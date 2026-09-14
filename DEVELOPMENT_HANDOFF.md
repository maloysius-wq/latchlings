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

Always inspect current `main`, `index.html`, and this handoff before changing anything. Read the dated archives when older implementation history or validation evidence is needed. The Chapter 7 archive preserves the previous live handoff byte-for-byte.

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

### 2026-09-13 — Pass 3 Chapter 8 Aurora Crown campaign application

**Status: IN PROGRESS**

**User goal:** Finish the approved Pass 3 chapter-by-chapter visual/story rollout with Chapter 8, Aurora Crown / Homeward, campaign Levels 351–400, without changing authored puzzle data or destabilizing Chapters 1–7, Daily, or the established campaign ending.

**Certified baseline:** Chapter 7 final closeout head is `7c800131795b75280a7f01c2649817ff7abd7d37`. GitHub Pages run `34794376662` (run 1104) and repository-access guard run `34794377513` (run 21) both completed successfully on that exact SHA.

**Authored Chapter 8 source findings:** `story400.js` names the chapter `Homeward`, theme `Aurora Crown`, with every campaign mechanic active. Its core truth is that there is no master route to restore: the network survives by changing with the islands and the people using it. `story-grounding400.js` defines the five ten-level movements as `Old and New Together`, `Back on the Same Map`, `Visiting Without a Crisis Plan`, `One Node Among Many`, and `Tomorrow’s Route`. The chapter goal is to connect the oldest and newest Skyway routes without searching for a master switch or final permanent map; the outcome is that communities keep watching, communicating, and adjusting together. `cinematics400.js` already establishes at Level 351 that Aurora Crown is not a master switch but the meeting point of the oldest surviving lines, and the campaign-complete screen already states: no master switch, no final map, a living Skyway, and ordinary life continues. Little Home already contains the canonical stage-8 `story-distant-islands` payoff. Current art direction specifies Snow 02, pale crystalline ledges, crown-like beacons, star fields, aurora ribbons, and luminous route bridges.

**Implementation plan:** (1) Follow the accepted Chapter 5–7 modular packaging pattern with new `pass3-chapter8-aurora.css` and `pass3-chapter8-aurora.js`, loaded after stable Chapter 7 assets. Extend `VISUAL_CHAPTER_MODES[8]='aurora'` so campaign Levels 351–400 use the Chapter 8 mode while Daily remains neutral. Preserve the existing explicit Level 366 `aurora-dense` override rather than replacing it. (2) Build five distinct quiet crystalline/snow movement floors corresponding to the authored movements. Rule-space decoration remains linear, pale, and non-symbolic; star fields, aurora ribbons, beacons, and luminous bridges stay outside the board. (3) Give full-mechanic boards a final-chapter readability pass without changing simulation: switches/doors, rails/turners, suit/color gates, anchors, selected Latchling, and matching nest must remain visually separable on pale surfaces. (4) Use movement 1 / `Old and New Together` for the recurring Atlas landmark: a crown-shaped convergence beacon where multiple historical and newly drawn route-light strands meet and visibly continue onward. The landmark must communicate convergence without implying a central master control and must overlap no level node. Reuse the same multi-route beacon language in the Level 400 reward, where route strands leave Aurora Crown toward multiple communities rather than terminating at the Crown. (5) Add a dedicated real-Level-400 reward centered on `Tomorrow’s Route` / `Skyway Restored`: the result should explicitly preserve drift, distributed Waykeeping, and ordinary visiting. Stars remain secondary. `Visit Little Home` must reveal/focus the canonical stage-8 distant islands and route lights with a reduced-motion-safe treatment. `See the living Skyway` / finish action must preserve normal completion bookkeeping and reach the existing `complete` screen with its established ending semantics unchanged. (6) After candidate acceptance, add the recurring convergence-beacon note to `LEVEL_SELECT_ART_DIRECTION.md` and wire cache-keyed Chapter 8 assets into `index.html`.

**Expected product files/systems:** new `pass3-chapter8-aurora.css`, new `pass3-chapter8-aurora.js`, `LEVEL_SELECT_ART_DIRECTION.md`, and `index.html`. Chapters 1–7 modular assets and shared runtime are protected. All eight `campaign400-*.js` files, authored solutions, `story400.js`, `story-grounding400.js`, `STORY_BIBLE.md`, `cinematics400.js`, cinematic dialogue, audio, movement simulation/rules, `game400-a.js`, `game400-b.js`, shared board/Atlas/production styles, Little Home source, and the existing campaign-complete markup/semantics are protected from product changes. Temporary validation/preparation helpers are not product.

**Validation plan:** Use certified Chapter 7 head `7c800131795b75280a7f01c2649817ff7abd7d37` as the protected baseline. Candidate-first validation must compare/hash all eight campaign files plus shared Chapters 1–7 runtime/story/cinematic/audio/Little Home/modular assets before and after candidate use. Run JavaScript syntax/static assertions and Chromium at 390×844 for Levels 351/360/361/370/371/380/381/390/391/400, plus 320×568 for Levels 351 and 400. Verify Daily isolation on a Chapter 8 board, Level 350 remains Stormswitch, Level 351 begins Aurora, and Level 366 retains `aurora-dense`. Assert all five Aurora movement floors are distinct quiet linear materials, cell pseudo-decoration stays suppressed, selected Latchling/matching nest hierarchy remains explicit, all active mechanic fixtures remain readable, touch targets remain >=44px, controls stay inside the phone viewport, and no horizontal overflow/browser errors occur. Inspect the movement-1 convergence beacon and assert zero overlap with Atlas nodes. Solve the real authored Level 400 route to reach the dedicated reward, use `Visit Little Home` to verify stage-8 distant islands/route-light focus, verify reduced motion reaches the same informative state without animation dependence, then use the finish action to verify the existing campaign-complete screen appears with `Skyway Restored`, `No master switch`, `No final map`, `A living Skyway`, and `Ordinary life continues`. Capture all five Aurora ranges, Atlas beacon, Level 400 reward, Little Home final focus, campaign-complete screen, and both small-phone endpoints for manual screenshot review before promotion.

**Deployment plan:** This IN PROGRESS handoff entry is committed before product edits. Create Chapter 8 modular assets but keep them out of the live index during candidate validation. Promote only after protected-source/static/full Chromium checks and manual screenshots are accepted. Then wire the exact accepted assets into `index.html`, add the durable convergence-beacon art-direction note, rerun the complete acceptance gate against the committed live build, remove every temporary Chapter 8 helper/workflow, confirm GitHub Pages succeeds on the clean product head, close this same entry as COMPLETED/PARTIAL/BLOCKED with exact commits/runs/artifacts, and verify one final Pages deployment plus repository-access guard on the exact closeout head.

## Completed checkpoint — Pass 3 Chapter 7 Stormswitch

**Status: COMPLETED**

- Chapter 7 / Levels 301–350 ship as modular `stormswitch` assets with five blue-steel movement ranges, weighted switches/doors, the node-clear multi-region synchronization relay, dedicated real-Level-350 reward, and canonical Little Home dock payoff.
- Refined candidate run `34785092933`, job `103798990890`, artifact ID `10326422236`, SHA-256 `d4abd8887f1bf57abca04503420fd07c2d15e9be25077237ed964eb8d9126972`, passed after an evidence-only Level 301 screenshot timing correction.
- Final live-build validation run `34785435371`, job `103799945133`, artifact ID `10326875273`, SHA-256 `25d0854a3988a6e767a6b754f99f736fb18391649ab80e10506a4afa75931e1c`, passed protected-source, full browser, real-Level-350, reward/home/reduced-motion/Homeward continuation checks.
- Temporary Chapter 7 workflows/helpers are removed; `.github/workflows` returned to the permanent repository-access guard only.
- Final certified Chapter 7 head `7c800131795b75280a7f01c2649817ff7abd7d37`; Pages run `34794376662` and repository-access guard run `34794377513` both succeeded on that exact head.
- Full Chapter 7 implementation history remains byte-for-byte in `DEVELOPMENT_HANDOFF_ARCHIVE_2026-09-13_CH7.md`.

**Next action while Chapter 8 is active:** Do not declare Pass 3 complete until Chapter 8 real-Level-400 acceptance, cleanup, final handoff closeout, and exact-head Pages/access-guard verification are green.
