# Development Handoff

## REPOSITORY ACCESS PRE-FLIGHT — HARD GATE
For repository work, GitHub is the canonical path. If GitHub repository functions are not already loaded, the first tool action for a repository task must be connector/plugin discovery for `GitHub`.

## Repository access preflight
GitHub is the canonical repository path for this project. Read this handoff first, then inspect the repository through the connected GitHub tools before doing repository work. If GitHub repository functions are not already loaded, discover/load them before attempting another repository route. Local clone or filesystem failure is not evidence that GitHub is unavailable. If the wrong route is attempted first, recover immediately through GitHub and continue the original request without asking the user to repeat the plugin instruction.

## Current work

### Full Astra visual/story audit closure
**Status: IN PROGRESS**

User goal: reconcile the entire original [`LATCHLINGS_VISUAL_STORY_AUDIT.md`](LATCHLINGS_VISUAL_STORY_AUDIT.md) and the later [`LATCHLINGS_IMPLEMENTATION_REVIEW.md`](LATCHLINGS_IMPLEMENTATION_REVIEW.md) against current `main`, finish every remaining software-addressable item, validate the complete acceptance matrix, clean temporary validation machinery, deploy, and close out without treating untested external-device work as complete.

Source acceptance contract:
- Canonical audit source: [`LATCHLINGS_VISUAL_STORY_AUDIT.md`](LATCHLINGS_VISUAL_STORY_AUDIT.md), committed to `main` on 2026-09-14 as `2ece5dd46d8fcb50b3591b62c77dd65b46cd02ab`; original audit baseline `a5048dd25804fdd261639e5a22332a0cfd506682`.
- Canonical implementation-review source: [`LATCHLINGS_IMPLEMENTATION_REVIEW.md`](LATCHLINGS_IMPLEMENTATION_REVIEW.md), committed to `main` on 2026-09-14 as `85f2b597de1ec3ee3daf12f0a84ade26e6cf1502`; reviewed-head baseline `d6e39c0866505795c2aa6a26777896072e16e7df`.
- [`ASTRA_AUDIT_ACCEPTANCE_MATRIX.md`](ASTRA_AUDIT_ACCEPTANCE_MATRIX.md) is the living reconciliation ledger against those two source documents and current `main`. The audit/review documents define the requested findings and acceptance language; the matrix records their current implementation status and evidence.
- R1-R5 usability work is completed and protected by candidate run `34853875486`, committed-live run `34855339189`, final Pages run `34856135214`, and final guard run `34856138001`.

Accepted Astra Pass 4 checkpoint (2026-09-14):
- Candidate run `34865335086` passed exact campaign/source protection, syntax/static assertions, every utterance in all 25 cinematic beats at 320x568 / 390x844 / 430x932, representative visual evidence, OS Reduced Motion, and in-game Reduced Motion.
- Accepted candidate product commit: `b8f6addf83611b3f8daf71311372e10de3ed90b6`.
- Exact accepted product bytes were promoted to `main` as `0e244bfb5e0ae71fad64f468cb99b301b01af713` after a second protected-source check.
- V03 is now accepted complete. V18/N06 remain partial only because the final living-Skyway-to-Little-Home pullback is still implied rather than fully staged. V19 is partial: canonical utterance state is consolidated between the core cinematic renderer and dialogue layer, but broader presentation/CSS duplication remains.
- Temporary Pass 4 promotion workflow was removed after promotion. The candidate branch retains its validation scaffolding/evidence history and is not the source of truth.

Remaining closure work:
1. Little Home coherence: purposeful resident destination actions, resident characterization through behavior/expression, keepsake use plus tap-to-revisit memories, contextual Home primary action, and ordinary-life cause/effect.
2. Atlas/journal/story coherence: hierarchy/state readability/landmarks, journal `Now` / Residents / Journey / Cinematics structure, clearer information-layer roles, regular story postcard treatment, and late reward-copy trimming.
3. Gameplay/world polish: residual decorative-cell ambiguity, explicit mechanic-state causality/rejected-blocker feedback, destination/arrival feedback, star-criteria discoverability, and cross-region presentation consistency.
4. Ending closure: add the true living-Skyway-to-home visual pullback while preserving the accepted concise ending and Home-first action.
5. Presentation/accessibility consolidation: all-controls target/focus audit, safe-area/text-scaling/reading-order checks, motion interruption/offscreen animation checks, shared cast/presentation tokens/renderer cleanup, and removal of obsolete override layers where safe.
6. Pass 5 browser-addressable coverage: 320x568, 360x800, 390x844, 430x932, tablet and landscape decisions; fresh onboarding/skipped opening/returning player; all films/dialogue turns; 40 movement starts/results; Daily/replay/campaign isolation; contrast/non-color identity; keyboard/focus/text scaling; sound-toggle persistence/interruption behavior; asset/cache integrity; frame-time/memory/loading measurements in available browser runtimes.
7. External-only certifications must remain explicitly unverified if this environment cannot perform them: real physical-phone touch/performance/battery behavior, genuine iOS Safari hardware behavior, exhaustive assistive-technology testing, and subjective real-speaker/headphone audio mixing/listening.

Protected systems:
- Exact authored puzzle definitions/solutions in `campaign400-1.js` through `campaign400-8.js` must not change.
- Preserve accepted Pass 3 chapter art direction unless an audit item specifically requires a presentation-layer correction.
- Preserve all R1-R5 behavior and the accepted Pass 4 cinematic dialogue/navigation behavior.

Implementation/validation contract:
- Read both canonical audit source documents above when reconciling an item; do not rely on the acceptance matrix as a substitute for their original wording.
- Reconcile every original audit ID (`V01`-`V20`, `N01`-`N06`, `U01`-`U11`, `A01`, `P01`) and both documents' Pass 1-5 acceptance language against current code/runtime.
- Record each item as COMPLETED, PARTIAL/EXTERNAL, or intentionally non-blocking with concrete evidence; do not use “improved” as closure.
- Use candidate-first browser validation for broad presentation changes, then committed-live validation before cleanup.
- Protect campaign/story canon and authored solutions with exact diff/hash checks.
- Manually review representative settled screenshots, especially cinematics, ending, Home, Atlas, journal, dense boards, Large Text, and reduced motion.
- Remove temporary workflows/helpers before final closeout.
- Final exact head must pass GitHub Pages and the permanent repository-access guard.

Next action: Little Home coherence candidate. Modify the existing Little Home implementation rather than adding another presentation layer. Give each adult an authored work route with recognizable destination/action/return phases; preserve R2 pause/reduced-motion semantics; make unlocked keepsakes focusable/tappable and route them to concise memory/reward recall; change the primary Home action from generic `Play` to chapter/level context; validate at short/normal/wide phone sizes with both motion modes and campaign source protection before promotion.

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
Final R1-R5 exact head before broader Astra closure: `7e2643d2e78b1a5c25b6b5364225e1566e19a5cd`; Pages `34856135214` success; repository guard `34856138001` success.

## Durable project state
- The eight-chapter Pass 3 visual/story campaign is complete and protected.
- The Astra R1-R5 usability pass is complete and protected.
- The accepted Pass 4 cinematic slice is promoted and tracked in `ASTRA_AUDIT_ACCEPTANCE_MATRIX.md`.
- `LATCHLINGS_VISUAL_STORY_AUDIT.md` and `LATCHLINGS_IMPLEMENTATION_REVIEW.md` are canonical repository source documents for the Astra closure effort.
- `ASTRA_AUDIT_ACCEPTANCE_MATRIX.md` is the living repository-side item-by-item reconciliation of those source documents against current implementation evidence.
- Prior detailed development history is preserved in the dated `DEVELOPMENT_HANDOFF_ARCHIVE_*` files.
- `LEVEL_SELECT_ART_DIRECTION.md` and `STORY_BIBLE.md` remain durable art/story references.
