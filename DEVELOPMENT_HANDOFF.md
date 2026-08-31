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

**Status: COMPLETED**

**User request:** Add a very happy/cutesy title/menu track that persists across non-level screens and a different cute, soft, slow, pensive/inquisitive instrumental track for each chapter. Music must use a Creative Commons license suitable for the game, with attribution information saved when applicable.

**Start-of-work handoff commit:** `0a50cc1eea095d5f0adf9f22de2a5067248fd7ec`

#### Final soundtrack

All nine selected tracks are **CC0 1.0 / public-domain dedication**, so no attribution is legally required. Full voluntary credits, original source URLs, licensing notes, and processing details are preserved in `MUSIC_CREDITS.md`.

- Title/menu: **Happy Ukelele Island Surfing Theme** — Tarush Singhal
- Chapter 1 / Sunpetal Meadows: **Calm3 - Peaceful Days** — Juhani Junkala / SubspaceAudio
- Chapter 2 / Lanternwood Grove: **Calm1 - A Place I Call Home** — Juhani Junkala / SubspaceAudio
- Chapter 3 / Lodestone Caverns: **A Small Town On Pluto (Music Box)** — HoliznaCC0
- Chapter 4 / Masquerade Keep: **Mystical Piano** — Indieteur
- Chapter 5 / Prism Gardens: **Gem Popper Piano Tune** — Mopz
- Chapter 6 / Copperline Junction: **Cozy Puzzle In-Game 3** — MintoDog
- Chapter 7 / Stormswitch Foundry: **Electric Piano And Piano Soft Melody** — OpenGameArt contributor; the archival mirror does not preserve the uploader name
- Chapter 8 / Aurora Crown: **Calm Piano 1 (Vaporware)** — cynicmusic / The Cynic Project

Shipping assets live in `assets/music/` as:

- `title-happy-ukulele.mp3`
- `chapter-1-peaceful-days.mp3`
- `chapter-2-place-i-call-home.mp3`
- `chapter-3-pluto-music-box.mp3`
- `chapter-4-mystical-piano.mp3`
- `chapter-5-gem-popper.mp3`
- `chapter-6-cozy-puzzle.mp3`
- `chapter-7-electric-soft.mp3`
- `chapter-8-vaporware.mp3`

The source copies were retrieved from the public CC0 archival repository `euuuuuuan/todak-public`, whose provenance ledger links back to the original OpenGameArt / Free Music Archive pages. `MUSIC_CREDITS.md` records those original pages as the primary human-readable references.

#### Audio processing

The archive copies were OGG/Vorbis. A temporary GitHub Action converted them to MP3 for broad mobile-browser compatibility and normalized them approximately to:

- -20 LUFS integrated loudness
- -2 dBTP true peak target
- 7 LU loudness-range target
- LAME MP3 variable quality `-q:a 5`

The first conversion workflow attempt failed cleanly because the current GitHub runner image did not include `ffmpeg`. No audio files were modified by that failed run. The workflow was fixed to install FFmpeg explicitly, then made race-safe with `git pull --rebase origin main` before its final push.

Temporary import/conversion workflows removed themselves after successful use, so `.github/workflows/` is not left with one-use soundtrack machinery.

Relevant commits/runs:

- `3f5f3ee9cbaf9ed0603fe8d77d3d361b872ea1cd` — add temporary CC0 import workflow
- workflow run `33439477791` — import succeeded
- `7efa2d70146adc50ae3ea4b16cfb24dc9de9e04a` — bot commit adding source OGG assets
- `5f15e6bdca1412075ac3e77d0a87de371641f2c3` — initial converter workflow
- workflow run `33439669269` — failed because FFmpeg was absent on runner
- `165309b5d64478d3c7aba60cdc4cd410bccd5ea8` — explicitly install FFmpeg
- `7d4c682385f9822910b200635f91d2b3a647ba5a` — make converter push race-safe
- workflow run `33439965272` — final conversion succeeded
- `0e556191474f9235d1554463f2a7133834d809bd` — bot commit replacing OGGs with normalized MP3s
- `11f02be93ad380d354265095f874a84a62660d4c` — add `MUSIC_CREDITS.md`
- `cef36e536e2991aa7148869014eb4bc623b6f4ec` — add `music400.js`
- `0ff40d3586d579dd0c3a71c1fd159964632b49b9` — load `music400.js` in live `index.html`

#### Music-controller behavior

`music400.js` is intentionally separate from puzzle movement logic.

- Uses one looping `Audio` element so tracks cannot overlap at full volume.
- Target music volume is `0.24` after normalization.
- Track changes use a short ~360 ms fade.
- Home, Level Select, Rules/Settings opened from non-level screens, and completion use the title track.
- Actual gameplay uses the track for `ceil(displayed level / 50)`, Chapters 1–8.
- Moving between levels inside the same chapter does **not** restart the chapter music.
- Normal navigation between non-level screens does **not** restart the title music.
- Pause/win/rules overlays while the game screen remains active keep the chapter track because the player is still in the level context.
- Daily Puzzle uses the soundtrack for the level/chapter it resolves to.
- Audio begins only after the first real pointer/keyboard gesture to respect browser autoplay restrictions.
- The single media element is primed during that gesture, then synchronized to the resulting screen after the click/navigation completes.
- Music pauses when the tab/page becomes hidden and resumes to the correct context when visible again.
- Music enabled state persists in `latchlings_music_enabled_v1`.
- A `Music: On` / `Music: Off` button is injected into the existing Settings modal rather than adding a permanent top-bar control.
- No emoji or extra persistent UI clutter was added.
- Debug surface: `window.LatchlingsMusic` exposes `sync`, `isEnabled`, `setEnabled`, `current`, and `requested` for troubleshooting.

The controller watches active screen state and the displayed level label instead of modifying `game400-a.js` / `game400-b.js`. This keeps soundtrack behavior decoupled from core movement semantics.

#### Validation performed

Passed:

- Original source/license research for selected tracks: all final selections are CC0.
- Repository asset check: exactly nine final MP3 files exist in `assets/music/`; no OGG originals remain.
- Temporary import/conversion workflows are gone after successful processing.
- `music400.js` JavaScript syntax check with Node passed.
- Local controller mapping harness passed:
  - Home → title
  - Level Select → title
  - Complete → title
  - Levels 1–50 → Chapter 1
  - 51–100 → Chapter 2
  - 101–150 → Chapter 3
  - 151–200 → Chapter 4
  - 201–250 → Chapter 5
  - 251–300 → Chapter 6
  - 301–350 → Chapter 7
  - 351–400 → Chapter 8
- Final GitHub Pages deployment run `33440180653` completed successfully for commit `0ff40d3586d579dd0c3a71c1fd159964632b49b9`.

Not directly validated by automation:

- Audible playback/loop transitions on the user's specific phone/browser. The implementation handles standard mobile autoplay constraints structurally, but real-device listening remains the final subjective/compatibility test.
- Musical taste/fit is intentionally subject to user playtesting; tracks can be swapped later without changing the controller architecture.

#### Remaining unrelated critical issue

The pre-existing missing `campaign400-3.js` problem remains open. The soundtrack controller maps Chapter 3 by displayed level number, but the campaign data itself still needs repair before Levels 101–150 can be considered healthy. Do not treat the successful music deployment as fixing that campaign defect.

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

**Engine / presentation logic**
- `game400-a.js`
- `game400-b.js`
- `music400.js`

**Music / licensing**
- `assets/music/*.mp3` — nine local soundtrack files
- `MUSIC_CREDITS.md` — permanent license/provenance record

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
- Current music direction: title/menu = highly happy/cutesy; level tracks = chapter-specific, cute, soft, slow, pensive/inquisitive, instrumental. Preserve `MUSIC_CREDITS.md` when swapping tracks.

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
- Music preference key: `latchlings_music_enabled_v1`.
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
5. Preserve/update `MUSIC_CREDITS.md` if soundtrack files change.
6. At task completion, update and commit this handoff again.
