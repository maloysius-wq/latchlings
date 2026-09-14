# Astra Audit Acceptance Matrix

Last reconciled: 2026-09-14

This file is the durable repository-side reconciliation of the original `LATCHLINGS_VISUAL_STORY_AUDIT.md` (audit baseline `a5048dd25804fdd261639e5a22332a0cfd506682`) and `LATCHLINGS_IMPLEMENTATION_REVIEW.md` (reviewed head `d6e39c0866505795c2aa6a26777896072e16e7df`) against current `main` after the accepted R1-R5 usability pass, Astra Pass 4 cinematic slice, and Little Home coherence slice.

The canonical source documents now live in this repository as [`LATCHLINGS_VISUAL_STORY_AUDIT.md`](LATCHLINGS_VISUAL_STORY_AUDIT.md) and [`LATCHLINGS_IMPLEMENTATION_REVIEW.md`](LATCHLINGS_IMPLEMENTATION_REVIEW.md). This matrix is the living reconciliation ledger against those source documents and current `main`; it does not replace their original wording, evidence, or Pass 1–5 acceptance definitions.

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
| V03 shared cinematic layout | COMPLETED | Pass 4 candidate run `34865335086` exercised every utterance in all 25 beats at 320x568, 390x844, and 430x932. Each beat keeps one scenic stage mounted while exactly one canonical utterance is visible at a time; script order, visual IDs, Skip/Continue containment, and reduced-motion behavior passed. Representative screenshots were manually reviewed before promotion. |
| N01 dialogue order | COMPLETED | Original script order is preserved for the identified Tansy/Pip and Bramble/Pippa defects; Pass 4 additionally validates exact canonical speaker/text order for every cinematic utterance. |
| N02 earned knowledge | PARTIAL | Pass 4 moved cinematic exposition toward observable cause/effect and reduced repeated beat-level explanation. Fresh journal/briefing spoilers were improved earlier. Later movement authorship and repeated information across rail/milestone/journal still need consolidation. |
| U01 real Settings | COMPLETED | Home gear routes to real Settings; Story/Residents has its own entry; relevant preferences are exposed. |
| U02 touch targets | PARTIAL | Gameplay chrome and Atlas controls improved, and Little Home's primary CTA plus unlocked keepsake keyboard/focus behavior are accepted. An all-controls target audit is still required across Atlas, cinematics, dialogs, journal, home, and dense states. |
| U03 viewport containment | PARTIAL | Gameplay and R5 cinematic navigation are accepted on tested phones. Pass 4 revalidated all 25 cinematics at 320x568, 390x844, and 430x932; Little Home coherence is also accepted at those three phone sizes. Pass 5 still requires 360x800, tablet, landscape, and broader safe-area decisions. |
| N03 Daily isolation | COMPLETED | Fresh Daily solve was verified to keep campaign unlocks/stars/cinematic state isolated and store Daily completion separately. |
| U04 mechanic teaching | COMPLETED | Story and mechanic guidance are separate, rule art is present, and R1 acceptance keeps essential mechanic distinctions readable. |
| V04 material consistency | OPEN | Title, story cards/cinematics, Little Home, and ending still need one approved material/light/shadow vocabulary. |
| V05 purposeful domestic actions | COMPLETED | Little Home adults now use infrequent authored work cycles with recognizable destinations/actions/returns: Pippa tends flowers, Bramble handles deliveries/visitor checks, and Rowan tends the tree/Waykeeper compass. Candidate run `34867918569` and committed-live run `34868476341` verified work cycles while preserving Reduced Motion and offscreen pause behavior. |
| V06 discoverable keepsakes | PARTIAL | All seven chapter keepsakes retain their first-return focus behavior and now become focusable/tappable earned memories with concise recall modals. Resident use is present for several relevant objects through authored work routes, but not yet explicitly authored for every keepsake, so this remains partial. |
| U05 contextual Home primary action | COMPLETED | Fresh, returning, and completed Home states now expose contextual primary actions instead of generic `Play`: begin the current chapter, continue the current chapter/level, or replay Aurora Crown after completion. Accepted at 320x568, 390x844, and 430x932 in candidate and committed-live validation. |
| V07 depth hierarchy | PARTIAL | Board hierarchy improved; residual decorative ambiguity and cross-region fixture consistency remain. |
| V08 selection feedback | PARTIAL | High-contrast selection and destination emphasis are present. Final arrival/trajectory-help polish remains; constant board pulsing is not desired. |
| V09 readable nests | PARTIAL | Suit-plus-color identity is preserved and nests are clearer. Arrival acknowledgement/completed-destination resolution still needs refinement. |
| V10 mechanic-state causality | PARTIAL | Explicit switch-to-door relationship, open/closed causality, rail/turn readability, and rejected-blocker feedback remain. |
| U06 control dominance | COMPLETED | Compact controls are accepted. Swipe and Undo are optional design experiments and intentionally NON-BLOCKING because they change interaction/difficulty economics. |
| V11 emotional win causality | PARTIAL | Chapter rewards and Pass 4 cinematics provide stronger cause/effect, while Little Home now turns several earned systems into observable resident actions. Immediate ordinary-world consequences after normal play still need strengthening. |
| U07 hints | COMPLETED | Honest reset-before-hint flow is retained; R3 acceptance keeps board highlighting active after returning until interaction/reset rather than expiring while the modal is read. Current-state solver hints remain a NON-BLOCKING future enhancement. |
| U08 failure tone | COMPLETED | Solver-verification language was replaced with player-facing retry/help language. |
| U09 mastery copy | PARTIAL | Move wording/pluralization is corrected. Star criteria still need discoverability before evaluation. |
| V12 meaningful Atlas landmarks | PARTIAL | Pass 3 added authored landmarks throughout the eight chapters; some nodes still feel interchangeable. |
| V13 Atlas hierarchy | OPEN | Competing chapter/range/map/navigation layers and truncated secondary labels still need simplification. |
| V14 restored vs available states | PARTIAL | Progression states improved but need stronger non-color-only shape/lighting/route distinctions. |
| V15 visible map repair | PARTIAL | Existing route transition/reward language is useful; affected landmarks still need a brief visible working-state payoff. |
| N04 information-layer roles | PARTIAL | Story rail was simplified and Pass 4 reduced cinematic over-explanation, but play/movement/milestone/journal responsibilities still overlap and repeat exposition. |
| V16 story postcards | OPEN | Chapter rewards gained postcard-like treatment, but regular Story cards still need authored place/prop crops, one concise line, and one goal. |
| U10 journal structure | OPEN | `Now` plus separate Residents/Journey/Cinematics hierarchy and faster replay access remain outstanding. |
| N05 characterization through behavior | PARTIAL | Little Home now characterizes Pippa, Bramble, and Rowan through distinct work behaviors and a small working-expression state. Broader emotional/cinematic expression changes and Pip/Tansy behavioral characterization remain outstanding. |
| V17 chapter reward | PARTIAL | Dedicated chapter rewards exist across all eight chapters with keepsakes and Home/Continue choices. Late reward copy still needs trimming, especially Aurora. |
| V18 ending art quality | PARTIAL | Pass 4 replaced the simplified completion graphic with the canonical Little Home scene, ordinary-life activity, living-route accents, and a Home-first action. Candidate screenshots passed at 320x568, 390x844, and 430x932. A true living-Skyway-to-Little-Home pullback is still needed before closure. |
| N06 visual ending thesis | PARTIAL | Pass 4 removed the explanatory three-card thesis and now centers the ordinary morning with concise copy and primary Return to Little Home. The final network-to-home visual pullback still needs to carry more of the thesis without relying on text. |
| V19 presentation consolidation | PARTIAL | Pass 4 consolidated canonical utterance state between `cinematics400.js` and the existing `cinematic-dialogue400.js` layer instead of adding another renderer; the dialogue layer now consumes the active canonical line. Little Home coherence was implemented inside the existing Home/runtime files rather than another override file. Broader duplicated cast/state/design-token and stacked cinematic CSS cleanup remains. |
| U11 accessibility | PARTIAL | Zoom/readability preferences and R4/R5 are accepted. Pass 4 validated persistent cinematic navigation and zero running cinematic-stage animations under OS/in-game Reduced Motion. Little Home now exposes earned keepsakes as keyboard-focusable controls, preserves Reduced Motion/offscreen pause, and passed three phone sizes. Full target/focus, safe-area, reading-order, text-scaling, meaningful-equivalent, and device checks remain. |
| V20 purposeful motion | PARTIAL | R2 proves in-game Reduced Motion stops/cancels Little Home resident movement. Little Home coherence additionally validates purposeful resident work cycles, cancellation when Reduced Motion is enabled, and zero adult movement while Home is offscreen. Pass 4 records zero running cinematic-stage animations under OS and in-game Reduced Motion. Broader interruption and ambient-vs-informative motion checks remain. |
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
**PARTIAL, accepted cinematic slice promoted.** Candidate run `34865335086` passed source protection, syntax/static checks, every utterance across all 25 beats at three phone sizes, representative visual evidence, OS Reduced Motion, and in-game Reduced Motion. Accepted candidate product commit: `b8f6addf83611b3f8daf71311372e10de3ed90b6`; exact product bytes promoted to main as `0e244bfb5e0ae71fad64f468cb99b301b01af713`. One-speaker chronological pacing, action-oriented scenic restaging, opening pacing cleanup, canonical Little Home ending art, concise ending copy, and Home-first completion action are accepted. Remaining Pass 4 closure is the true living-Skyway-to-home visual pullback plus broader presentation-system consolidation tracked under V18/N06/V19.

### Little Home coherence
**ACCEPTED slice.** Candidate run `34867918569` passed campaign/accepted-source protection, three phone sizes, seven keepsake unlock/focus states, memory recall, three authored adult work cycles, in-game Reduced Motion, offscreen pause, and completed Home state. Accepted candidate product commit: `119ece1000cdab69c902ec75d2b0d89881372bd1`; exact four-file product promoted to `main` as `5003f8c8e8421713f49374ab6b8c39d2af1cc3f1` via promotion run `34868354446`. Committed-live run `34868476341` revalidated the promoted bytes. Candidate artifact `10357697352` SHA-256 `0864252f975ab553764fbaee7cf7157e7764e354c155f81573eb7f552f3c7ae3`; committed-live artifact `10358421047` SHA-256 `269400e89ca880bca3b5080cf7c01ca3ae0df6fa2d9b64367c5c15cf6ef24b93`. V05/U05 are complete; V06/N05 remain partial for the narrower remaining behavior noted above.

### Atlas / journal / story / gameplay coherence
**OPEN / next closure slices.** Simplify Atlas hierarchy and state legibility, strengthen working-landmark payoff, restructure journal/story hierarchy, clarify information-layer roles, improve regular Story postcards, trim late reward copy, then complete residual decorative-cell cleanup, mechanic causality, arrival feedback, and star-criteria discoverability.

### Pass 5 browser-addressable certification
**OPEN.** Cover 320x568, 360x800, 390x844, 430x932, tablet and landscape decisions; fresh onboarding/skipped opening/returning player; all films/dialogue turns; 40 movement starts/results; Daily/replay/campaign isolation; contrast/non-color identity; keyboard/focus/text scaling; sound-toggle persistence/interruption; asset/cache integrity; and frame-time/memory/loading in available browser runtimes.

### External-only certification
Keep explicitly **UNVERIFIED** until the required environment exists: real physical-phone touch/performance/battery behavior, genuine iOS Safari hardware behavior, exhaustive assistive-technology testing, and subjective real-speaker/headphone audio mixing/listening.

## Protected acceptance contract

- Do not modify authored puzzle definitions/solutions in `campaign400-1.js` through `campaign400-8.js` as part of presentation closure.
- Preserve accepted Pass 3 chapter art unless a specific audit item requires a presentation-layer correction.
- Preserve all R1-R5 certified behavior, accepted Pass 4 behavior, and accepted Little Home coherence behavior.
- Use candidate-first validation for broad presentation changes, then committed-live validation.
- Record each final item as COMPLETED, PARTIAL/EXTERNAL, or intentionally NON-BLOCKING with evidence. `Improved` is not a closure status.
