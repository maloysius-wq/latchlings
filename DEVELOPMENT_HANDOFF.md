# Latchlings Development Handoff

Last updated: 2026-09-13

## Start here

This repository is the source of truth for **Latchlings**.

- Repository: `maloysius-wq/latchlings`
- Live build: `https://maloysius-wq.github.io/latchlings/`
- Runtime: intended 400-level themed campaign on `main`
- Full historical journal through completed Pass 3 Chapter 4: `DEVELOPMENT_HANDOFF_ARCHIVE_2026-09-12.md`
- Full active-journal history through completed Pass 3 Chapter 6: `DEVELOPMENT_HANDOFF_ARCHIVE_2026-09-13_CH6.md`

Always inspect current `main`, `index.html`, and this handoff before changing anything. Read the dated archives when older implementation history or validation evidence is needed. The Chapter 6 archive preserves the previous live handoff byte-for-byte.

### REPOSITORY ACCESS PRE-FLIGHT — HARD GATE

For **all repository work in this project**, the connected **GitHub plugin/connector is the canonical and first-line repository path**. If GitHub functions are not already loaded, the first tool action for a repository task must be connector/plugin discovery for `GitHub`. The first repository read must be `DEVELOPMENT_HANDOFF.md` through `GitHub.fetch_file` or equivalent.

A failed local clone, missing checkout, container DNS failure, generic web failure, raw-GitHub failure, or absence of preloaded GitHub functions is never evidence that GitHub access is unavailable. An agent may claim GitHub is unavailable only after GitHub plugin discovery has explicitly been attempted and a real GitHub connector repository read cannot be invoked or fails.

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

### 2026-09-13 — Pass 3 Chapter 7 Stormswitch campaign application

**Status: IN PROGRESS**

**User goal:** Continue the approved Pass 3 chapter-by-chapter visual/story rollout through Chapter 7, Stormswitch Foundry / Coming Together, campaign Levels 301–350, without changing authored puzzle data or destabilizing Chapters 1–6.

**Roadmap/current-source recheck:** The clean product baseline is completed Chapter 6 closeout `8ee722375f68462cc8ee595eaa6870109cd8c5c3`; GitHub Pages run `34780104401` (run 1084) succeeded on that exact head, and repository-access guard run `34780104831` also succeeded. The authored Chapter 7 arc is a five-movement distributed-network story: `One Switch, Two Regions`, `Same Travel Window`, `Useful Failure`, `Faster Than Yesterday`, and `Waykeepers Everywhere`. `story400.js`, `story-grounding400.js`, and `STORY_BIBLE.md` establish the chapter's job as turning restoration into shared Waykeeping: distant communities coordinate timing and signals, learn from imperfect synchronization, and ultimately maintain a living network faster than the drift can invalidate yesterday's routes. Switches and doors are the chapter's distinctive active hardware while rails and identity gates remain in the combined system. `cinematics400.js` already queues `Homeward` at Level 351, opening on signals arriving from everywhere and carrying the living-network payoff into Aurora Crown. Little Home already contains the canonical stage-7 `story-dock`, matching the authored small docking beam / arrival-platform reward. Current art direction specifies Blue Metal Plate with factory stacks, relay towers, switch banks, insulated conduits, lightning masts, and storm-lit steel.

**Implementation plan:** (1) Follow the accepted Chapter 5/6 modular packaging pattern and add a self-contained Chapter 7 production layer loaded after the stable shared runtime, extending the mutable visual-mode map so campaign Levels 301–350 use a new `stormswitch` mode while Daily remains neutral, Level 300 remains Copperline, Level 351 stays outside this visual slice, and Level 366 retains its explicit Aurora override. (2) Build five distinct quiet blue-steel movement surfaces, one for each authored ten-level movement, using non-symbolic linear plate/material gradients inside rules space and keeping factory/lightning scenery outside the board. (3) Strengthen the chapter's unique active fixtures without changing simulation: switch tiles become weighted storm-steel control plates with a clear high-contrast actuator, and door tiles remain visually useful in both closed and open states with explicit frame/bar hierarchy. Rails, turners, suit gates, and color gates may receive chapter-consistent contrast only where necessary for readability; their behavior remains untouched. (4) Give movement 3 / `Useful Failure` a recurring Atlas landmark grounded in the authored synchronization beat: a compact multi-region relay/synchronization tower with several regional signal lamps feeding one shared timing-window dial, including one visible off-phase correction lamp so feedback and adjustment read physically. Reuse the same relay language in the Level 350 reward in a resolved synchronized state. The Atlas landmark must not overlap any level node. (5) Add a dedicated real-Level-350 reward showing the coordinated relay line feeding a small arrival platform/docking beam. Stars remain secondary. `Visit Little Home` must focus the existing canonical stage-7 dock with a visible reduced-motion-safe same-origin treatment; `Begin Homeward` must preserve normal campaign/Atlas bookkeeping and reach Level 351 with the existing `Homeward` cinematic active. (6) After candidate acceptance, record the relay/synchronization landmark in durable art direction and wire explicit cache-keyed Chapter 7 assets into `index.html`.

**Expected product files/systems:** new `pass3-chapter7-stormswitch.css`, new `pass3-chapter7-stormswitch.js`, `LEVEL_SELECT_ART_DIRECTION.md`, and `index.html`. Chapters 1–6 product assets and shared runtime are protected. All eight `campaign400-*.js` files, authored solutions, `story400.js`, `story-grounding400.js`, `STORY_BIBLE.md`, `cinematics400.js`, cinematic dialogue, audio, movement simulation/rules, `game400-a.js`, `game400-b.js`, shared board/Atlas/production styles, Little Home source, and Chapter 8 behavior are protected from change. Temporary validation/preparation helpers are not product.

**Validation plan:** Use clean Chapter 6 final head `8ee722375f68462cc8ee595eaa6870109cd8c5c3` as the protected baseline. Candidate-first validation must compare/hash all eight campaign definitions plus shared Chapters 1–6 runtime/story/cinematic/audio/Little Home and modular Chapter 5/6 assets before and after candidate application. Run JavaScript syntax/static assertions and Chromium at 390×844 for Levels 301/310/311/320/321/330/331/340/341/350, plus 320×568 for Levels 301 and 350. Verify Daily isolation on a Chapter 7 board, Level 300 remains Copperline, Level 351 stays outside Stormswitch, and Level 366 remains `aurora-dense`. Assert all five Stormswitch board ranges use distinct quiet linear cell materials, cell pseudo-decoration stays suppressed, selected Latchling/matching nest hierarchy remains explicit, switches and closed/open doors are visually weighted/readable, active touch targets remain >=44px, controls stay inside the phone viewport, and no horizontal overflow/browser errors occur. Inspect movement 3's relay/synchronization landmark and assert zero overlap with Atlas level nodes. Solve the real authored Level 350 route to reach the dedicated reward, use `Visit Little Home` to verify the dock focus, verify reduced motion reaches the same informative dock state without animation dependence, and use `Begin Homeward` to verify Level 351 opens with the existing `homeward` cinematic active. Capture all five Stormswitch ranges, Atlas landmark, Level 350 reward, dock focus, Homeward continuation, and both small-phone endpoints for manual screenshot review before live wiring/promotion.

**Deployment plan:** This IN PROGRESS handoff entry must be committed before product edits. Create Chapter 7 modular assets but keep them out of the live index during candidate validation. Promote only after source-protection/static/full Chromium checks and manual screenshots are accepted. Then wire the exact accepted product assets into `index.html`, add the durable art-direction landmark note, rerun the complete acceptance gate against the committed live build, remove every temporary Chapter 7 helper/workflow, confirm GitHub Pages succeeds on the clean product head, close this same entry as COMPLETED/PARTIAL/BLOCKED with exact commits/runs/artifacts, and verify one final Pages deployment on the closeout head. Repository mutations continue through the connected GitHub integration; Actions may validate but must not be relied on to push commits.

## Completed checkpoint — Pass 3 Chapter 6 Copperline

**Status: COMPLETED**

- Chapter 6 / Levels 251–300 ship as modular `copperline` production assets with five oxidized-steel movement ranges, weighted rail/turner hardware, the node-clear station archive/timetable landmark, dedicated real-Level-300 reward, and canonical Little Home compass payoff.
- Refined candidate run `34779404826`, job `103783535394`, artifact ID `10325355062`, SHA-256 `39ce978f0e15f0283005332606a022aa88dea29dd674ec5b120ee305b5efac40`, passed after the initial Atlas kiosk overlap was corrected.
- Final live-build validation run `34779823500`, job `103784662772`, artifact ID `10324541061`, SHA-256 `9f1d2fadb85ed62120eae1bc8c71328d0806f4c58828e70e2469dfb37622a44f`, passed the full protected-source/browser/real-Level-300/reward-home/reduced-motion matrix.
- Chapter 6 also repaired the pre-existing Story & Residents duplicate-id markup to the intended `#storyCast.story-cast` element and guards it against regression.
- Final Chapter 6 closeout commit `8ee722375f68462cc8ee595eaa6870109cd8c5c3`; Pages run `34780104401` (1084) and repository-access guard run `34780104831` both succeeded on that exact head.
- Full Chapter 5–6 implementation history remains byte-for-byte in `DEVELOPMENT_HANDOFF_ARCHIVE_2026-09-13_CH6.md`.

**Next action while Chapter 7 is active:** Do not begin Chapter 8 until this Chapter 7 entry is closed and exact-head Pages verification is green.
