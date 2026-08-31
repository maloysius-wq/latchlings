# Latchlings Development Handoff

Last updated: 2026-08-31

## Start here

This repository is the source of truth for **Latchlings**.

- Repository: `maloysius-wq/latchlings`
- Live build: `https://maloysius-wq.github.io/latchlings/`
- Runtime: intended 400-level themed campaign on `main`

Always inspect current `main`, `index.html`, and this handoff before changing anything.

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

### 2026-08-31 — Add licensed game music

**Status: IN PROGRESS**

**User request:** Find and implement music for Latchlings. Title/menu music should be extremely happy and cutesy and persist across every non-level screen. Actual levels should use different music for each chapter. Chapter music should be cute, soft, slow, pensive, inquisitive, and instrumental. All music must have a Creative Commons license suitable for use in the game. If attribution is required, preserve the required credit information in the repository.

**Plan:**

1. Search reputable music/asset sources for one title/menu track and eight chapter tracks.
2. Verify the license for every selected track at the source. Prefer CC0 where a good fit exists; CC BY is acceptable with attribution preserved. Avoid NC licenses because they would unnecessarily constrain future commercial release.
3. Record title, creator, source page, license, license URL/identifier, and exact attribution language in a repository credit file.
4. Add the selected audio assets to the repository under a dedicated `audio/` or `assets/music/` path, using browser-friendly compressed formats.
5. Add a small music controller to the active 400-level engine:
   - title/menu track loops across Home, Level Select, Rules, Settings, pause/non-level UI, and completion screen without restarting during ordinary navigation;
   - entering a level crossfades/switches to that level's chapter track;
   - Chapters 1–8 each have their own loop;
   - returning from gameplay to a non-level screen resumes the title/menu track;
   - autoplay restrictions are handled by starting/resuming audio only after the player's first gesture;
   - avoid overlapping two full-volume tracks;
   - preserve player-friendly volume and looping behavior.
6. Add a simple music on/off control if needed for respectful audio UX, without cluttering the interface.
7. Validate file references, JS syntax, navigation/music state changes, loop behavior, and license documentation.
8. Deploy to GitHub Pages and verify the Pages workflow plus live asset availability.
9. Update this handoff with final selections, licenses, implementation details, commits, validation, and any follow-up work.

**Expected files/systems:**

- `DEVELOPMENT_HANDOFF.md`
- `index.html` if an audio control or loader hook is needed
- active `game400-*.js` engine files and/or a new dedicated music controller JS file
- active CSS if an audio control is added
- new music asset directory/files
- new `MUSIC_CREDITS.md` or equivalent licensing/attribution file

**Validation plan:**

- Confirm each source/license independently before using the track.
- Confirm all referenced local audio files exist in the repository.
- Check JavaScript syntax.
- Verify title music persists across non-level screen changes.
- Verify each chapter maps to its own level track.
- Verify only one intended music context plays at a time.
- Verify first-gesture/autoplay handling on mobile-style browser behavior.
- Verify attribution records are complete.
- Check GitHub Pages deployment succeeds and music assets resolve publicly.

**Deployment:** GitHub Pages from `main` after assets and code are fully present. Update `index.html` last if load-order changes are required.

**Known unrelated critical issue still open:** `index.html` references `campaign400-3.js`, but Chapter 3's payload is missing from the repository. This music pass must not erase or obscure that issue. It still needs repair and a full campaign audit.

---

### 2026-08-31 — Establish live handoff workflow

**Status: COMPLETED**

Added the mandatory start-of-work/end-of-work handoff process. Start commit: `18f988ff874c27e759213c6021ad71241d00e2f9`. Completion commit: `42bbc1771bb34bf1381575f1a55199288cae77d7`.

---

## Critical known issue

`index.html` references `campaign400-3.js`, but **that file is missing from the repository tree**. GitHub history contains Chapter 1, Chapter 2, then Chapters 4–8, with no Chapter 3 campaign-data commit.

Affected range:

- Chapter 3: Magnetic Anchors
- Theme: Lodestone Caverns
- Levels 101–150

Required repair: regenerate/recover Chapter 3, create `campaign400-3.js` in the same compact format, run a full 400-level repository-backed validator, and verify Chapter 3 in the live build. Do not claim the exact missing payload exists in GitHub history.

---

## Active runtime

Loaded by `index.html`:

**CSS**
- `style400-ui.css`
- `style400-game.css`
- `style400-themes.css`

**Campaign**
- `campaign400-1.js` Levels 1–50
- `campaign400-2.js` Levels 51–100
- `campaign400-3.js` MISSING, should be Levels 101–150
- `campaign400-4.js` Levels 151–200
- `campaign400-5.js` Levels 201–250
- `campaign400-6.js` Levels 251–300
- `campaign400-7.js` Levels 301–350
- `campaign400-8.js` Levels 351–400

**Engine**
- `game400-a.js`
- `game400-b.js`

Legacy 80-level files (`game-a.js`, `game-b.js`, `levels-*`, `style.css`, `enhancements.*`) remain as history and are not active runtime source.

---

## Product non-negotiables

- Mobile-first, polished, cute, premium, uncluttered.
- No emoji in game UI. Use SVG/CSS/glyphs.
- Round colorful Latchlings, expressive centered faces, dark/black suit symbols.
- One smooth continuous magnetic snap, never cell-by-cell hopping.
- Persistent selection; direct tap-to-select remains available.
- Center D-pad selector cycles clockwise through uncaptured Latchlings.
- After capture, select the nearest remaining Latchling.
- Other Latchlings are strategic movable stoppers.
- Color and suit matter mechanically.
- Frozen/predetermined campaign levels.
- Every published level must be solvable inside move limit.
- Difficulty should remain sustained and include expert puzzles in every chapter.
- Nest cells are exclusive: no rocks, anchors, gates, rails, turners, switches, doors, or starting pieces may overlap nests.
- Keep the UI quiet. Avoid ad/currency/counter clutter.
- Push approved changes to GitHub so the same Pages URL remains the user's test build.

---

## Campaign structure and themes

1. Levels 1–50, First Snaps, Sunpetal Meadows
2. Levels 51–100, Clever Stops, Lanternwood Grove
3. Levels 101–150, Magnetic Anchors, Lodestone Caverns
4. Levels 151–200, Suit Gates, Masquerade Keep
5. Levels 201–250, Color Gates, Prism Gardens
6. Levels 251–300, Rails and Turns, Copperline Junction
7. Levels 301–350, Switchworks, Stormswitch Foundry
8. Levels 351–400, Master Circuit, Aurora Crown

Each chapter uses five 10-level ranges. Difficulty should have only a brief introduction, then sustained medium/hard play and an expert tail around local Levels 46–50.

---

## Core gameplay semantics

`game400-b.js::simulate()` is the source of truth for movement/solver behavior.

Blocking: board edge, rock, another Latchling, closed door, mismatched suit gate, mismatched color gate, wrong-direction rail.

Specials: matching nest captures; anchor stops; turner redirects the same snap; switch toggles linked door state.

Any validator must reproduce shipping semantics exactly.

---

## Controls, animation, stars, progress

- D-pad is one continuous physical rocker with invisible directional hit regions.
- Center cycle button pressed-state fix must preserve centering:
  `.dpad button.dpad-cycle:active { transform: translate(-50%, calc(-50% + 3px)) scale(.985) !important; }`
- Latchling blinking must remain asynchronous via per-piece duration/delay.
- `prefers-reduced-motion` disables nonessential animation.
- Win popup renders visual stars.
- 3 stars at `movesUsed <= optimal`; 2 at `<= optimal + 1`; otherwise 1.
- Progress key: `latchlings_campaign400_progress_v1`.
- Level 400 finishes without looping.

---

## Validation rules for level-data changes

Validate the entire campaign after any level-data edit: sequential IDs, unique starts/nests, no piece on nest, no nest/object overlap, no unintended special-tile overlap, stored solution replay, within move limit, solver-verified optimal/star thresholds, mechanic use, expert screening, and no chapter-boundary difficulty collapse.

Historical note: the retired 80-level campaign had 28 nest/object overlaps. Do not regress.

---

## Deployment workflow

GitHub Pages serves `main` from the root.

Safe order for large changes: handoff plan commit; upload dependencies/assets; update runtime code; update `index.html` last if necessary; wait for Pages `completed / success`; verify every referenced file actually exists and executes; test live behavior; then make the final handoff completion commit.

A successful Pages workflow does not prove JavaScript imports exist or run.

---

## First actions for a future chat

1. Read this file and inspect `main` plus `index.html`.
2. Follow the mandatory handoff workflow before implementation.
3. Resume any `IN PROGRESS`, `PARTIAL`, or `BLOCKED` Current Work entry first.
4. Do not forget the missing `campaign400-3.js` critical issue.
5. At task completion, update and commit this handoff again.
