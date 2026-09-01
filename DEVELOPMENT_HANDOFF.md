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

### 2026-08-31 — Ten browser-rendered title-page concepts

**Status: COMPLETED**

**User goal:** Replace the current title page direction with something dramatically cuter, more characterful, animated, handcrafted, and less template/AI-looking. Produce **10 genuinely different title-page concepts as real HTML/CSS/JS that can actually run in the browser**, not generated concept art. Latchlings on the title page must have expressive eyes/faces and animation. Zero emoji. Research and use appropriate CC0 assets from the internet where they materially improve the designs.

**Implementation plan:**

1. Inspect the current home/title markup and active 400-level visual language so concepts remain plausible within the actual game.
2. Research CC0 UI/environment/decorative asset packs suitable for a cute sky-island puzzle game, with source/license provenance saved alongside the concepts.
3. Build a standalone `title-concepts/` preview area containing ten distinct, mobile-first HTML concepts rather than ten palette swaps. Each concept will preserve the core product actions (Play, Daily Puzzle, Level Select, settings/progress context) but explore different composition, ornament, character staging, motion, typography treatment, panels, and environmental framing.
4. Latchlings will be real HTML/CSS/SVG creatures with eyes, mouths, black suit marks, individual expressions, asynchronous blinks, idle motion, and different poses. No emoji or generated raster character art.
5. Where CC0 assets are used, vendor them locally or use a safe build/import step and record exact source/license details in `title-concepts/ASSET_CREDITS.md`. Prefer Kenney/OpenGameArt CC0 sources and avoid attribution-required assets unless clearly documented.
6. Render all ten concepts in a phone-size headless browser, inspect screenshots for clipping/readability/uncanny faces, and fix obvious defects before deployment.
7. Deploy the preview gallery under the existing GitHub Pages site without replacing the live game title page. The user will choose a direction first; production integration happens only after selection.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, new `title-concepts/` HTML/CSS/JS preview files, locally vendored CC0 decorative assets where useful, `title-concepts/ASSET_CREDITS.md`, and temporary self-removing workflows only if needed for binary asset import/render validation. Existing live `index.html` home screen remains unchanged during concept exploration.

**Validation plan:** zero emoji scan; HTML/CSS/JS syntax/sanity checks; ten distinct concept entries; mobile-size headless rendering/screenshots; no external runtime hotlinks for selected assets; provenance/license audit for all third-party assets.

**Deployment plan:** add the preview gallery and assets under `title-concepts/`, verify Pages deployment, then mark this entry COMPLETED with concept descriptions, source assets, screenshots/render results, preview URL, commits, and next action.

#### Completion summary

Ten genuinely different browser-feasible title-page directions were built under `title-concepts/` without modifying the production `index.html` title page. The live preview gallery is intended for design selection before any production integration.

**Concepts:**
1. Storybook Skyway — warm floating-island storybook composition.
2. Nest Nursery — giant living tree with multiple nest/perch characters.
3. Skyway Journal — paper travel-journal/map direction.
4. Toybox Diorama — chunky tabletop/toy-stage direction.
5. Cloud Carousel — circular/orbiting cloud composition.
6. Cottage Window — cozy windowsill looking into the skyway.
7. Garden Gate — flower/hedge entrance with peeking characters.
8. Lantern Constellations — soft twilight moon/lantern direction.
9. Patchwork Story — felt/stitch/applique handmade direction.
10. Little Music Box — tiny clockwork stage/music-box direction.

**Character/art system:** Latchlings are original HTML/CSS/inline-SVG, not generated raster art. They have white eyes/pupils, mouths, blush, wings/feet, black suit marks, multiple expressions, individual deterministic blink intervals, and distinct idle/pose animations. The preview contains zero emoji and respects `prefers-reduced-motion`.

**Product/UI decision:** Fake currency/energy bars from earlier concept imagery were deliberately rejected. Every concept uses product-relevant context only: star progress, settings, Play, Daily Puzzle, and Level Select.

**CC0 assets:** Five local accents from Kenney `Background Elements Remastered` are vendored in `title-concepts/assets/kenney/`: `cloud1.png`, `cloud4.png`, `tree.png`, `castleSmallAlt.png`, and `bush3.png`. Full provenance and CC0 1.0 licensing are recorded in `title-concepts/ASSET_CREDITS.md`. Additional researched production candidates are Kenney UI Pack - Adventure, Fantasy UI Borders, Foliage Sprites, and the CC0 Wenrexa flower/nature UI kit, but the preview intentionally avoids becoming an off-the-shelf asset-pack collage.

**Files added:** `title-concepts/index.html`, `concept.html`, `shared.css`, `themes-a.css`, `themes-b.css`, `preview-fixes.css`, `concepts.js`, `ASSET_CREDITS.md`, plus the five vendored PNG accents.

**Validation:** static validation passed for JS syntax, presence of all ten templates, exact CC0 asset set, zero emoji, and no external runtime hotlinks in the concept renderer. GitHub Actions run `33471050823` rendered all ten concepts in Chromium at a 390x844 mobile viewport with no console/page errors, failed requests, broken images, or horizontal overflow and uploaded screenshot artifact `9786540353`. Screenshots were downloaded and visually inspected. The first pass found only a 14px vertical overflow on Nest Nursery; `preview-fixes.css` reduced its scene height, and the final browser gate confirmed it fits within 390x844 with no overflow.

**Implementation head before handoff close:** `4d8f7df964c201190237b16f778ed2476ce21ed9`.

**Preview URL:** `https://maloysius-wq.github.io/latchlings/title-concepts/`

**Next action:** user reviews the ten live animated HTML concepts and chooses a direction or asks to combine specific elements. Do not replace the production title page until the user explicitly selects/approves a direction.

---

### 2026-08-31 — SFX timing and softness tuning

**Status: COMPLETED**

**User feedback / goal:** Keep the current magnetic whoosh character, but make short snaps actually expose enough of the recording to hear it. Determine whether leading silence is being clipped. Make every ordinary movement collision/end-stop use the same soft wall-edge sound instead of separate rock/anchor/blocked-square impacts. Replace both the level-win cue and the Continue/Next Level confirmation cue with softer, cuter pre-recorded sounds. Preserve the zero-procedural-audio rule.

**Implementation plan:**

1. Measure the existing three movement WAVs for leading silence/low-level attack and total duration. If dead space exists, trim only silent/near-silent leading material from the checked-in recordings without pitch/time-stretch or synthesis.
2. If necessary, slightly relax movement-stop playback behavior so a short snap does not chop off the useful attack, while keeping one recorded travel cue per continuous snap and preventing overlap into later moves.
3. Route all non-capture ordinary endpoints (edge, another Latchling, rock, anchor, door, suit gate, color gate, rail) to the existing preferred `stop-soft.wav`. Retire specialized endpoint sounds from active runtime use rather than deleting provenance immediately.
4. Search the existing CC0 Kenney interface library for gentler/cuter alternatives for `level-clear.wav` and `ui-confirm.wav`/Next Level. Import selected source recordings locally and update `SFX_CREDITS.md` with exact original filenames and purpose.
5. Keep semantic sounds distinct so Continue/Next Level does not double-stack with level-clear.
6. Validate active JS syntax, exact file references, WAV format, no procedural/pitch/playbackRate/randomization code, movement audio timing behavior, unified endpoint routing, and Pages deployment.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, `sfx400.js`, `SFX_CREDITS.md`, selected files in `assets/sfx/`, and temporary self-removing GitHub workflows only if needed to inspect/replace binary audio. Core level data and puzzle semantics are out of scope.

**Deployment plan:** stage/validate binary audio first, then update `sfx400.js`, run repository-backed validation, wait for GitHub Pages success, and finally mark this entry COMPLETED with exact source/timing decisions and commits.


#### Completion summary

- Waveform audit confirmed real leading low-level padding in the three whooshes. The -40 dBFS attack originally began at about 225 ms / 117 ms / 86 ms for short / medium / long. Front-only trims of 215 ms / 107 ms / 76 ms now put the strong attack at about 10 ms without pitch, speed, time-stretch, synthesis, or randomization. Final durations are about 0.328 s / 0.299 s / 0.494 s.
- Every ordinary non-capture stop now uses `stop-soft.wav`, including edge, another Latchling, rock, anchor, closed door, gate, and rail. Nest capture remains `capture.wav`. The old specialized impact files remain only as inactive provenance/history assets.
- Level clear now uses Kenney CC0 `confirmation_002.wav` at controller volume 0.24 instead of the sharper `confirmation_004.wav`. Continue/Next Level now uses a dedicated Kenney CC0 `pluck_001.wav` as `next-level.wav` at volume 0.16 instead of generic `ui-confirm.wav`.
- `SFX_CREDITS.md` records the new source files, trim amounts, and unified-stop rule.
- Validation passed for JavaScript syntax, mappings, unified stop routing, WAV format, <=12 ms movement attack onset, and zero forbidden procedural/pitch/playbackRate/randomization code.
- Key commits/runs: start handoff `2ec78a4c2dfb0703f483a26daf5702d19f57759c`; timing audit run `33443079744`; asset tuning run `33443162541` / commit `91b4f71`; runtime/provenance run `33443235379` / commit `32cd0d11561df678d25e45bba0c12c21ddbf6e01`; GitHub Pages run `33443251025` completed successfully.
- Remaining test is subjective real-device listening only.

---

### 2026-08-31 — Full licensed sound-effects pass

**Status: COMPLETED**

**User request:** Perform a full audit of Latchlings and add high-quality real sound effects to meaningful UI/gameplay events, including menu/button taps, Latchling selection, continuous magnetic movement, and endpoint impacts. Zero procedurally generated sounds were allowed.

#### Final source / license decision

The entire shipping SFX palette is sourced from **Kenney** game-audio packs released under **Creative Commons CC0 1.0 Universal**. Attribution is not legally required, but permanent provenance is preserved in `SFX_CREDITS.md`, including the official Kenney source pack/pages, exact original filenames, transfer mirrors used for retrieval, CC0 license URL, and optional Kenney credit.

Source families:

- Kenney **Interface Sounds** for UI, selection, hint, switch, capture and result cues.
- Kenney **Impact Sounds** for physical snap endpoints.
- Kenney **Foley Sounds / Woosh** for continuous magnetic travel.

All 21 shipping files are local in `assets/sfx/`. No runtime hotlinks are used.

#### Final sound map / design rules

The audit intentionally uses a restrained semantic vocabulary instead of making every state noisy.

- Ordinary button/menu action: quiet UI tap.
- Back/close/resume-style action: back cue.
- Settings/pause/rules-style modal opening: open cue.
- Positive UI confirmation: confirmation cue.
- Direct Latchling selection: dedicated select cue, only when selection actually changes.
- Center D-pad Latchling cycle: separate light tick cue.
- Invalid/no-movement D-pad input: error/bump cue.
- Valid magnetic movement: exactly **one continuous pre-recorded woosh per snap**, never one sound per grid cell.
  - path length <= 2: `move-short.wav`
  - path length 3–4: `move-medium.wav`
  - path length >= 5: `move-long.wav`
- Movement endpoint is sounded at the instant the primary travel animation reaches its destination, before the secondary bounce/capture flourish:
  - board edge or another Latchling: `stop-soft.wav`
  - rock: `stop-rock.wav`
  - anchor: `stop-anchor.wav`
  - closed door, mismatched suit/color gate, or wrong-direction rail: `stop-blocked.wav`
  - matching nest: `capture.wav`
- Switch activation: subtle `switch.wav` timed to the route step.
- Turner: subtle `turn.wav` timed to the route bend.
- Ordinary successful travel through gates/rails is intentionally silent to avoid sonic clutter.
- Hint: dedicated question/hint cue.
- Level clear: positive result cue.
- Out of moves: restrained lose/error cue.
- Level 400 completion: separate campaign-completion punctuation.
- Generic UI taps are suppressed for semantic buttons such as D-pad directions, Latchling selection/cycle, and Hint so their specialized sound does not double-stack.
- Level 400 `Finish` suppresses the generic confirmation cue so it does not stack with campaign completion.

#### Zero-procedural guarantee

`sfx400.js` uses standard HTML `Audio` playback of the checked-in source recordings. The final validator rejects procedural/variable audio code and confirmed that the SFX layer contains none of the following:

- `AudioContext` / `webkitAudioContext`
- oscillators / `createOscillator` / `OscillatorNode`
- runtime-generated audio samples
- `playbackRate` changes
- pitch/detune changes
- random sound/pitch variation

The runtime may only choose a recorded file, set its volume, start/stop it, and use a small pool of identical recorded one-shots for safe overlap.

#### Files and runtime changes

- New `SFX_CREDITS.md` with permanent CC0/provenance record.
- New `assets/sfx/` containing exactly 21 local mono PCM WAV files.
- New `sfx400.js` controller with separate SFX state key `latchlings_sfx_enabled_v1`.
- `game400-a.js` now emits semantic direct-selection and center-cycle events.
- `game400-b.js` now emits invalid move, move start, in-route switch/turner, endpoint/capture, hint, level clear/loss and campaign-completion events.
- `index.html` loads `sfx400.js` after `music400.js`.
- Settings now receives a separate `Sound Effects: On / Off` control without adding persistent top-bar clutter. Music and SFX preferences remain independent.

#### Audio processing

Source recordings were transcoded only to normalize the delivery container/format, not to generate or creatively alter the sounds. All shipping SFX are:

- mono
- 44.1 kHz
- 16-bit PCM WAV

No pitch, playback-rate, randomization, synthesis, or procedural sample generation is performed.

#### Important commits / workflow runs

- `b381f514cd1bb65a8d73a017a7b1d1900f24699b` — start-of-work handoff recorded by the temporary handoff workflow.
- `04a90ae53b683e5d4071163051aed61d8674f5f6` — add `SFX_CREDITS.md`.
- `270c762fb7b52a3ff627f0097df2b7903e50adc0` — add `sfx400.js` sourced-audio controller.
- `e4809aafe202bed3d604ae6fd984d15651f85b25` — create semantic SFX wiring workflow; workflow run `33441560859` completed successfully and self-removed after applying/validating the gameplay hooks.
- Initial SFX import workflow run `33441306894` downloaded, converted and file-count-validated all 21 recordings but failed only at the final git push because `main` advanced in a narrow race window. This was not an asset/source failure.
- `949f49f0b4d9745784faeacfdf9aeb46b7433258` — make SFX importer rebase/push retry-safe.
- Workflow run `33441700503` — retry import completed successfully.
- `b81bf270adddb2d7d1680b5fd9b282d7b96f049e` — bot commit adding all 21 final local SFX assets and removing importer.
- `5cd1aecf4f216edc308633f1a2b52f6fd892950b` — enable `sfx400.js` in live `index.html`.
- `38a1acb1c9f2482ab4ab66f48ed1ae4de26b4af9` — launch final repository-backed SFX validation.
- Workflow run `33441908994` — all SFX validation steps completed successfully.
- `7532721b563f1c43303a1ae5fb6d09bb32fb9e54` — validator cleanup completion commit; tree content matches the validated live runtime.
- GitHub Pages run `33441927536` for `7532721b563f1c43303a1ae5fb6d09bb32fb9e54` completed successfully.

#### Validation passed

- Active JS syntax check passed for `game400-a.js`, `game400-b.js`, `music400.js`, and `sfx400.js`.
- Exactly 21 SFX are referenced and exactly 21 WAV files ship; the filename sets match 1:1.
- Every WAV was parsed and confirmed non-empty, mono, 44.1 kHz, 16-bit PCM.
- Zero-procedural policy scan passed for oscillators, AudioContext synthesis, playback-rate/pitch/detune and random variation.
- Semantic engine hook audit passed for direct selection, cycling, invalid input, move start, route events, move end, capture, hint, clear, lose and campaign completion.
- Loader order check passed: `music400.js` then `sfx400.js`.
- Fake-media playback harness passed exact semantic routing for selection, cycling, invalid moves, short/medium/long travel, rock/anchor/blocked endpoints and capture.
- Import workflow and final validator both removed themselves after successful use.
- Final GitHub Pages deployment completed successfully.

#### Remaining listening/compatibility note

The objective wiring, assets and deployment are validated. The final subjective mix still requires real-device playtesting by ear. Individual cue choice or volume can be adjusted without changing the architecture if a sound feels too sharp, soft, busy, metallic, airy, etc.

An attempted independent HTTP fetch from the local execution environment could not resolve `maloysius-wq.github.io` because that environment had no DNS access, so do not claim that local curl provided a live-browser test. GitHub Pages itself reports the validated deployment as successful.

#### Remaining unrelated critical issue

The pre-existing missing `campaign400-3.js` / Levels 101–150 issue remains open and was explicitly preserved by the SFX validator. This SFX pass does not repair or conceal that campaign-data defect.

---

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
- `sfx400.js`

**Music / licensing**
- `assets/music/*.mp3` — nine local soundtrack files
- `MUSIC_CREDITS.md` — permanent license/provenance record

**Sound effects / licensing**
- `assets/sfx/*.wav` — 21 local sourced CC0 SFX files
- `SFX_CREDITS.md` — permanent CC0/provenance record

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
- Current SFX direction: sourced recorded audio only, no procedural generation; one continuous travel sound per magnetic snap; restrained semantic endpoint/UI cues. Preserve `SFX_CREDITS.md` when swapping effects.

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
- SFX preference key: `latchlings_sfx_enabled_v1`.
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
6. Preserve/update `SFX_CREDITS.md` if sound-effect files change; keep SFX sourced-recording-only.
7. At task completion, update and commit this handoff again.
