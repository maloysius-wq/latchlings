# Astra Audit Acceptance Matrix

Last reconciled: 2026-09-14

This file is the durable repository-side reconciliation of the original `LATCHLINGS_VISUAL_STORY_AUDIT.md` (audit baseline `a5048dd25804fdd261639e5a22332a0cfd506682`) and `LATCHLINGS_IMPLEMENTATION_REVIEW.md` (reviewed head `d6e39c0866505795c2aa6a26777896072e16e7df`) against current `main` after the accepted R1-R5 usability pass.

The original standalone audit/review files were supplied outside the repository and therefore are not treated as repository source files. Their acceptance requirements are preserved here so future implementation work does not depend on an external attachment.

Status meanings:
- **COMPLETED**: software-addressable requirement is implemented and has concrete accepted evidence.
- **PARTIAL**: meaningful implementation exists, but one or more audit requirements remain.
- **OPEN**: the substantive requested work remains.
- **NON-BLOCKING**: explicitly optional design experiment, not required for audit closure.
- **EXTERNAL**: cannot be honestly certified in the current browser/automation environment and must stay unverified until tested on the required hardware/software.

## Item-by-item reconciliation

| ID | Current status | Evidence / remaining closure work |
|---|---|---|
| V01 quiet board floors | PARTIAL | Pass 3 materially quieted all eight chapter families. Residual decorative-cell ambiguity still needs cleanup, especially badge/ring-like decoration that can resemble mechanics. |
| V02 readable story rail | COMPLETED | R1/R4 acceptance covers all 400 campaign rails/tips at 390x844 and 320x568 in Normal and Large Text without clipping essential story/mechanic copy. |
| V03 shared cinematic layout | PARTIAL | Chronological dialogue and persistent short-phone navigation are accepted. Pass 4 scenic restaging, purposeful action, visual cause/effect, and one-speaker pacing across all 25 beats remain. |
| N01 dialogue order | COMPLETED | Original script order is preserved for the identified Tansy/Pip and Bramble/Pippa defects. |
| N02 earned knowledge | PARTIAL | Fresh journal/briefing spoilers were improved. Later movement authorship, revelation pacing, and repeated exposition still need consolidation. |
| U01 real Settings | COMPLETED | Home gear routes to real Settings; Story/Residents has its own entry; relevant preferences are exposed. |
| U02 touch targets | PARTIAL | Gameplay chrome and Atlas controls improved, but an all-controls target audit is still required across cinematics, dialogs, journal, home, and dense states. |
| U03 viewport containment | PARTIAL | Gameplay and R5 cinematic navigation are accepted on tested phones. Pass 5 still requires the full phone/tablet/landscape/safe-area matrix. |
| N03 Daily isolation | COMPLETED | Fresh Daily solve was verified to keep campaign unlocks/stars/cinematic state isolated and store Daily completion separately. |
| U04 mechanic teaching | COMPLETED | Story and mechanic guidance are separate, rule art is present, and R1 acceptance keeps essential mechanic distinctions readable. |
| V04 material consistency | OPEN | Title, story cards/cinematics, Little Home, and ending still need one approved material/light/shadow vocabulary. |
| V05 purposeful domestic actions | OPEN | Little Home residents still need authored destination actions rather than motion alone. |
| V06 discoverable keepsakes | PARTIAL | Chapter reward reveal/focus exists. Resident use plus tap-to-revisit memory behavior remains. |
| U05 contextual Home primary action | OPEN | Returning/completed Home still needs chapter/next-route context rather than generic `Play`. |
| V07 depth hierarchy | PARTIAL | Board hierarchy improved; residual decorative ambiguity and cross-region fixture consistency remain. |
| V08 selection feedback | PARTIAL | High-contrast selection and destination emphasis are present. Final arrival/trajectory-help polish remains; constant board pulsing is not desired. |
| V09 readable nests | PARTIAL | Suit-plus-color identity is preserved and nests are clearer. Arrival acknowledgement/completed-destination resolution still needs refinement. |
| V10 mechanic-state causality | PARTIAL | Explicit switch-to-door relationship, open/closed causality, rail/turn readability, and rejected-blocker feedback remain. |
| U06 control dominance | COMPLETED | Compact controls are accepted. Swipe and Undo are optional design experiments and intentionally NON-BLOCKING because they change interaction/difficulty economics. |
| V11 emotional win causality | PARTIAL | Chapter rewards now provide stronger payoff, but ordinary-world action consequences and fast destination-to-world causality remain incomplete. |
| U07 hints | COMPLETED | Honest reset-before-hint flow is retained; R3 acceptance keeps board highlighting active after returning until interaction/reset rather than expiring while the modal is read. Current-state solver hints remain a NON-BLOCKING future enhancement. |
| U08 failure tone | COMPLETED | Solver-verification language was replaced with player-facing retry/help language. |
| U09 mastery copy | PARTIAL | Move wording/pluralization is corrected. Star criteria still need discoverability before evaluation. |
| V12 meaningful Atlas landmarks | PARTIAL | Pass 3 added authored landmarks throughout the eight chapters; some nodes still feel interchangeable. |
| V13 Atlas hierarchy | OPEN | Competing chapter/range/map/navigation layers and truncated secondary labels still need simplification. |
| V14 restored vs available states | PARTIAL | Progression states improved but need stronger non-color-only shape/lighting/route distinctions. |
| V15 visible map repair | PARTIAL | Existing route transition/reward language is useful; affected landmarks still need a brief visible working-state payoff. |
| N04 information-layer roles | PARTIAL | Story rail was simplified, but play/movement/milestone/journal responsibilities still overlap and repeat exposition. |
| V16 story postcards | OPEN | Chapter rewards gained postcard-like treatment, but regular Story cards still need authored place/prop crops, one concise line, and one goal. |
| U10 journal structure | OPEN | `Now` plus separate Residents/Journey/Cinematics hierarchy and faster replay access remain outstanding. |
| N05 characterization through behavior | OPEN | Resident identity is still mostly portrait/copy driven; authored actions and expression changes remain. |
| V17 chapter reward | PARTIAL | Dedicated chapter rewards exist across all eight chapters with keepsakes and Home/Continue choices. Late reward copy still needs trimming, especially Aurora. |
| V18 ending art quality | OPEN | Simplified completion scene must be replaced by the canonical Little Home quality/state, ordinary-life resolution, and living-Skyway pullback. |
| N06 visual ending thesis | OPEN | Ending should let the successful ordinary morning and living network carry the thesis; concise text only, with Return to Little Home primary. |
| V19 presentation consolidation | OPEN | Cast identity, scene rendering, state, design tokens, and layered cinematic/presentation overrides remain duplicated. Consolidate existing layers instead of adding another broad override. |
| U11 accessibility | PARTIAL | Zoom/readability preferences and R4/R5 are accepted. Full target/focus, safe-area, reading-order, text-scaling, meaningful-equivalent, and device checks remain. |
| V20 purposeful motion | PARTIAL | R2 proves in-game Reduced Motion stops/cancels Little Home resident movement. Broader offscreen animation, interruption, ambient-vs-informative motion, and all-cinematic checks remain. |
| A01 audio | PARTIAL / EXTERNAL | Controls are reachable. Persistence/interruption can be browser-tested; subjective cue balance, real-speaker/headphone mixing and listening remain EXTERNAL. |
| P01 performance | PARTIAL / EXTERNAL | Browser frame-time/memory/loading measurement is still required. Physical modest-phone touch/performance/battery certification remains EXTERNAL. |

## Pass-level reconciliation

### Pass 1-2 foundation
Substantially complete where represented by the completed/partial item statuses above. Do not regress accepted settings, Daily isolation, mechanic teaching, dialogue order, compact controls, failure tone, or campaign solution behavior.

### Pass 3 chapter application
**COMPLETED and protected.** All eight chapter families and movement slices have accepted production art, chapter rewards, Atlas landmarks, Little Home reward focus, and protected authored campaign definitions. Level 366 remains the documented Aurora dense-treatment exception unless final art direction deliberately harmonizes it.

### R1-R5 focused usability pass
**COMPLETED and protected.** Accepted head before this closure pass: `7e2643d2e78b1a5c25b6b5364225e1566e19a5cd`. Preserve rail/tip readability, live Reduced Motion behavior, persistent hint highlight, Large Text coverage, and persistent cinematic progress/Skip/Continue on short phones.

### Pass 4 cinematics and ending
**OPEN / next product slice.** Restage all 25 beats around purposeful action and visual cause/effect; use one-speaker chronological pacing, shared scenic/cast systems, and reduced-motion-safe information. Replace the simplified ending with canonical Little Home, an ordinary successful morning/visit/delivery, a living-Skyway pullback, concise thesis, and primary Return to Little Home action. Opening pacing should trade diagrams/exposition for observable action and guided understanding.

### Home / Atlas / journal / gameplay coherence
**OPEN after or alongside Pass 4 where shared presentation work makes it safer.** Complete keepsake resident use/memories, contextual Home action, Atlas hierarchy/state legibility, journal hierarchy, information-layer roles, authored character progression, residual decorative-cell cleanup, mechanic causality, arrival feedback, and star-criteria discoverability.

### Pass 5 browser-addressable certification
**OPEN.** Cover 320x568, 360x800, 390x844, 430x932, tablet and landscape decisions; fresh onboarding/skipped opening/returning player; all films/dialogue turns; 40 movement starts/results; Daily/replay/campaign isolation; contrast/non-color identity; keyboard/focus/text scaling; sound-toggle persistence/interruption; asset/cache integrity; and frame-time/memory/loading in available browser runtimes.

### External-only certification
Keep explicitly **UNVERIFIED** until the required environment exists: real physical-phone touch/performance/battery behavior, genuine iOS Safari hardware behavior, exhaustive assistive-technology testing, and subjective real-speaker/headphone audio mixing/listening.

## Protected acceptance contract

- Do not modify authored puzzle definitions/solutions in `campaign400-1.js` through `campaign400-8.js` as part of presentation closure.
- Preserve accepted Pass 3 chapter art unless a specific audit item requires a presentation-layer correction.
- Preserve all R1-R5 certified behavior.
- Use candidate-first validation for broad presentation changes, then committed-live validation.
- Record each final item as COMPLETED, PARTIAL/EXTERNAL, or intentionally NON-BLOCKING with evidence. `Improved` is not a closure status.
