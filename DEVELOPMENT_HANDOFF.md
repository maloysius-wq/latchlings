# Development Handoff

## REPOSITORY ACCESS PRE-FLIGHT — HARD GATE
For repository work, GitHub is the canonical path. If GitHub repository functions are not already loaded, the first tool action for a repository task must be connector/plugin discovery for `GitHub`.

## Repository access preflight
GitHub is the canonical repository path for this project. Read this handoff first, then inspect the repository through the connected GitHub tools before doing repository work. If GitHub repository functions are not already loaded, discover/load them before attempting another repository route. Local clone or filesystem failure is not evidence that GitHub is unavailable. If the wrong route is attempted first, recover immediately through GitHub and continue the original request without asking the user to repeat the plugin instruction.

## Current work

### Full Astra visual/story audit closure
**Status: IN PROGRESS**

User goal: reconcile the entire original `LATCHLINGS_VISUAL_STORY_AUDIT.md` and the later `LATCHLINGS_IMPLEMENTATION_REVIEW.md` against current `main`, finish every remaining software-addressable item, validate the complete acceptance matrix, clean temporary validation machinery, deploy, and close out without treating untested external-device work as complete.

Source acceptance contract:
- Original audit baseline: `a5048dd25804fdd261639e5a22332a0cfd506682`.
- Astra implementation review baseline: `d6e39c0866505795c2aa6a26777896072e16e7df`.
- R1-R5 usability work is already completed and protected by candidate run `34853875486`, committed-live run `34855339189`, final Pages run `34856135214`, and final guard run `34856138001`.

Open work to reconcile and close:
1. Pass 4: restage all 25 cinematic beats around purposeful action, visual cause/effect, one-speaker chronological dialogue, reduced-motion-safe staging, and a shared scenic system; revise opening pacing where the audit calls out diagram/exposition presentation.
2. Ending: replace the simplified completion presentation with the canonical Little Home, ordinary-life resolution, living-Skyway pullback, concise thesis, and primary Return to Little Home action.
3. Home/Atlas/journal/story coherence: keepsake resident use + revisit memories, contextual Home primary action, Atlas hierarchy/state readability/landmarks, journal section hierarchy, clearer information-layer roles, stronger authored movement/character progression, and reward-copy trimming.
4. Gameplay/world polish: residual decorative-cell ambiguity, explicit mechanic-state causality/rejected-blocker feedback, destination/arrival feedback, star-criteria discoverability, and cross-region presentation consistency.
5. Presentation/accessibility consolidation: all-controls target/focus audit, safe-area/text-scaling/reading-order checks, motion interruption/offscreen animation checks, shared cast/presentation tokens/renderer cleanup, and removal of obsolete override/documentation layers where safe.
6. Pass 5 browser-addressable coverage: 320x568, 360x800, 390x844, 430x932, tablet and landscape decisions; fresh onboarding/skipped opening/returning player; all films/dialogue turns; 40 movement starts/results; Daily/replay/campaign isolation; contrast/non-color identity; keyboard/focus/text scaling; sound-toggle persistence/interruption behavior; asset/cache integrity; frame-time/memory/loading measurements in available browser runtimes.
7. External-only certifications must remain explicitly unverified if this environment cannot perform them: real physical-phone touch/performance/battery behavior, genuine iOS Safari hardware behavior, exhaustive assistive-technology testing, and subjective real-speaker/headphone audio mixing/listening.

Protected systems:
- Exact authored puzzle definitions/solutions in `campaign400-1.js` through `campaign400-8.js` must not change.
- Preserve accepted Pass 3 chapter art direction unless an audit item specifically requires a presentation-layer correction.
- Preserve the R1-R5 behavior already certified.

Implementation/validation contract:
- Reconcile every original audit ID (`V01`-`V20`, `N01`-`N06`, `U01`-`U11`, `A01`, `P01`) and both documents' Pass 1-5 acceptance language against current code/runtime.
- Record each item as COMPLETED, PARTIAL/EXTERNAL, or intentionally non-blocking with concrete evidence; do not use “improved” as closure.
- Use candidate-first browser validation for broad presentation changes, then committed-live validation before cleanup.
- Protect campaign/story canon and authored solutions with exact diff/hash checks.
- Manually review representative settled screenshots, especially cinematics, ending, Home, Atlas, journal, dense boards, Large Text, and reduced motion.
- Remove temporary workflows/helpers before final closeout.
- Final exact head must pass GitHub Pages and the permanent repository-access guard.

Next action: inspect current cinematic, ending, Home, Atlas, journal, mechanic-feedback, presentation-stack, accessibility/audio, and performance source against the two audit documents; build a complete item-by-item gap matrix before product edits.

### Astra audit R1-R5 usability pass
**Status: COMPLETED**

Completed scope:
- R1: all 400 campaign story rails and route tips remain readable without clipping at 390x844 and 320x568, Normal and Large Text.
- R2: Little Home resident motion honors in-game Reduced Motion and pauses while Home is inactive.
- R3: hint highlighting begins after returning to the board and persists until interaction/reset.
- R4: Large Text enlarges essential story, mechanic, modal, journal, narration, and dialogue copy.
- R5: cinematic progress, Skip, and Continue remain persistently visible on short phones for all 25 beats.

Accepted product promotion: `f241d816242f245c0ea41ad3c33dd9d496d7c849`.
Committed-live acceptance: run `34855339189` / success, evidence artifact `10353096127`, SHA-256 `14d8a3d710f1168bba2839cb7fe7eb16e2579c7646263725716be0cd55de5c44`.
Cleanup commit: `404c319d39c96799ecb368933a27a9626c705e5a`.
Final R1-R5 exact head: `7e2643d2e78b1a5c25b6b5364225e1566e19a5cd`; Pages `34856135214` success; repository guard `34856138001` success.

## Durable project state
- The eight-chapter Pass 3 visual/story campaign is complete and protected.
- The Astra R1-R5 usability pass is complete and protected.
- Prior detailed development history is preserved in the dated `DEVELOPMENT_HANDOFF_ARCHIVE_*` files.
- `LEVEL_SELECT_ART_DIRECTION.md` and `STORY_BIBLE.md` remain durable art/story references.
