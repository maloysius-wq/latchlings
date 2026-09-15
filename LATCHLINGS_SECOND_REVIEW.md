# Latchlings — second implementation review
September 14, 2026. Reviewed GitHub main `9dffa07d9f1fcd0c48029e13e8a641596c630fc8` and the live game.

## Verdict

**The five specific usability defects from the previous review are fixed in my fresh tests. The build is substantially better, and I found no blocking gameplay regression in the exercised paths.**

I would accept those fixes and the functional Home/Atlas/journal/ending improvements. I would **not yet equate the repository's “browser-addressable closure complete” label with complete fulfillment of the original professional-polish/art-direction brief**.

The remaining concerns are primarily cinematic visual storytelling, opening pacing, and small secondary/body typography—not a repeat of the five defects already fixed. Physical-device and listening checks remain explicitly unverified.

No repository or game files were changed. All game progress used disposable browser contexts. The prior audit and review were preserved.

## What I independently verified

| Previous issue | Fresh result |
|---|---|
| R1: clipped story lines and route tips | **Pass.** All 400 boards at 390×844 and 320×568, each at Normal and Large Text: 1,600 combinations, no recurrence of the clipped-parent/clamped-tip defects or gameplay control overflow. |
| R2: Reduced Motion ignored by resident JavaScript | **Pass.** With OS motion normal and the game set to Reduced, residents stayed still and Home had zero running animations. With normal motion restored, movement resumed; leaving Home then stopped running animations and further movement. |
| R3: hint highlight expired while reading | **Pass.** After waiting 3.8 seconds in the hint modal and returning to the board, both the piece and direction remained highlighted. |
| R4: Large Text ineffective | **Pass for the reported essential story/tip defect.** At 390px, story grows 14→16px and tip 13.5→16px. At 320px, story grows 13→15px and tip 12.5→15px. See remaining journal typography concern below. |
| R5: cinematic Continue below viewport | **Pass.** All 56 canonical utterances across 25 beats at both 390×844 and 320×568: 112 states, matching expected text and visible 44px-or-larger cinematic action controls. |

Additional results:

- Real authored solutions passed for Levels **1, 50, 100, 150, 200, 250, 300, 350, 400**, all at their authored optimal counts with no pieces remaining.
- Fresh Daily on this date was Level **359**. It completed in 14 moves, stored its result separately, and left campaign progress at Level 1 with no stars.
- Additional Level 400 layout checks passed at **320×568, 360×800, 430×932, 768×844, 768×1024, 844×390**, Normal and Large Text.
- Home has contextual primary-action wording and a Memories entry. Earned mailbox memory opened successfully.
- Journal tabs expose the selected Now/Residents/Journey/Cinematics panel. Direct replay access no longer requires scrolling through every biography.
- Pause placed focus on Resume; ten Tab presses stayed inside the modal; Escape restored focus to Pause.
- All eight Atlas chapter views and all eight chapter-end reward cards were rendered and visually inspected.
- No JavaScript page errors in the completed main or supplemental UI runs.
- The comparison with the prior reviewed head contains no changes to the eight authored campaign files.
- The final repository head remained unchanged during review. Exact-head [Pages](https://github.com/maloysius-wq/latchlings/actions/runs/34899169516) and [Repository Access Guard](https://github.com/maloysius-wq/latchlings/actions/runs/34899170983) runs succeeded.

A test-harness mismatch was diagnosed and corrected before the successful cinematic run: the internal beat index is zero-based, while the final DOM scene number is one-based. That timeout was not counted as a game defect.

## Improvements worth keeping

### Gameplay

The readable, concise story motive and mechanic tip now fit without hiding their endings. Decorative badges no longer occupy the Level 201 corner cells. The rule layer remains much quieter than the original audit baseline. Stars have discoverable criteria before the win, and the chapter-end routes still solve correctly.

[Updated Level 201](C:/RetroRig_Codex_Handoff/audit-latchlings/review-2026-09-14/shots/level-201.png)

### Home, Atlas and journal

The contextual Home action, earned memories, resident activity, consolidated Atlas controls, and journal sections are real functional improvements. They directly address several of the original navigation and progression complaints. The Atlas no longer relies on five truncated range tabs and eight tiny chapter dots.

[Atlas chapter overview](C:/RetroRig_Codex_Handoff/audit-latchlings/review-2026-09-14/atlas-contact.jpg)

### Ending

The old flat standalone completion island and three explanatory thesis boxes are gone. The ending reuses canonical Little Home, adds a connected-world presentation and a parcel/porch cue, keeps the copy concise, and makes **Return to Little Home** primary. Both normal-motion and reduced-motion views were inspected.

I consider the previous ending complaints substantially addressed. Further material refinement would be polish, not a reason to restore the old ending.

[Revised ending](C:/RetroRig_Codex_Handoff/audit-latchlings/review-2026-09-14/shots/ending.png)

## Remaining audit gaps

### S1 — P2: Some cinematic actions exist in the narration, not the picture

The one-utterance dock and persistent footer are complete improvements. Several new scene elements also help, particularly volunteers and community work stations.

However, the broader original Pass 4 request was to make the scenes **show the cause and consequence**, not only rewrite what the narration says.

Concrete examples verified in source and in reduced/normal-motion captures:

- **Opening beat 1:** narration says a breakfast basket starts toward Little Home. The scene renderer returns the generic wide archipelago; there is no basket in that scene. Island/route animation is present, but it does not depict the stated delivery.
- **Across the Drift beat 5:** narration says a newly drawn route reaches the familiar porch. The scene returns generic islands plus the NEW COORDINATES badge; it does not show the recognizable twin-lantern porch used in beat 2 receiving the connection.
- **Old Maps beat 4:** the unattended-desk idea is still represented by map sheets and a machine/gear panel, with the human withdrawal explained in dialogue.
- Many other beats retain the older network-diagram composition. Some have revised motion, but the specific action-based staging requested in the original beat-by-beat audit has not all been implemented.

[Current scene renderer](https://github.com/maloysius-wq/latchlings/blob/9dffa07d9f1fcd0c48029e13e8a641596c630fc8/cinematics400.js). [Opening with normal motion](C:/RetroRig_Codex_Handoff/audit-latchlings/review-2026-09-14/shots/motion-cine-opening.png). [Across the Drift overview](C:/RetroRig_Codex_Handoff/audit-latchlings/review-2026-09-14/across-drift-contact.jpg).

**Suggested bounded next step:** Choose those first two scenes as the last cinematic proof: an actual basket traveling, and the same familiar porch receiving the new route. Evaluate each with dialogue hidden. Once the story is understandable visually, apply that standard only where another beat genuinely needs it. Do not restart the entire cinematic system.

### S2 — P2: Opening pacing still delays play

The opening remains eight scenes, but now contains **18 utterances/advances** before Begin Level 1 completes the introduction, unless the player uses Skip. One-utterance pacing improves reading order, but it does not meet the original recommendation to get the player quickly from a failed errand and a call for help into guided play.

The tutorial remains an illustrated snap-demo rather than a playable teaching step. This is not a progression failure; it is an unresolved onboarding/design decision.

**Suggested next step:** Present a short opening hook, then move the additional introductions into early play or optional replay. Measure time to the first meaningful player move. If keeping the full opening is a deliberate creative choice, mark this recommendation as intentionally deferred rather than completely implemented.

### S3 — P2: Journal body text is still too small for the stated polish target

The new journal architecture is much better. Its reading size is not yet as comfortable as the gameplay rail:

- Actual `.story-now-chapter > p`: **10.8px Normal, 12.5px Large**, confirmed in the browser.
- Several supporting labels are smaller still.
- At the normal phone size, the Now panel has substantial unused space below the text, so there is room to improve reading comfort without shrinking targets.

The previous R4 bug is fixed: the setting now does change the size. The remaining concern is the chosen sizes, not broken preference wiring. This is a design/readability finding, not an assertion of a formal accessibility violation.

[Journal typography source](https://github.com/maloysius-wq/latchlings/blob/9dffa07d9f1fcd0c48029e13e8a641596c630fc8/style400-story-theme.css#L158). [Journal screenshot](C:/RetroRig_Codex_Handoff/audit-latchlings/review-2026-09-14/shots/journal-now.png).

**Suggested next step:** Give journal body text a comfortable phone-reading baseline, preferably around the original 14–16px essential-copy target, and a meaningfully larger option. Let the existing internal panel scroll when necessary. Review cinematic narration and Atlas supporting labels alongside it.

### S4 — P3: Material consistency is improved, not fully unified

Reusing canonical Little Home and removing three obsolete cinematic CSS refinement files are sensible changes. They do not by themselves prove that every surface shares a polished art style.

The current Story Card still mixes a flatter prop vignette with glossy characters, and the surrounding ending-network houses are simpler than the canonical home. Atlas landmarks are more meaningful, but often remain tiny icons rather than strongly recognizable places.

These are optional art refinements after the higher-value items above—not a call for a new engine or another broad rewrite. I would describe original V04/material consistency as **partial/art-direction review**, not universally complete based on file consolidation.

### Documentation cleanup

The handoff's top-level closure claim is followed by stale “Next action: Presentation/accessibility consolidation candidate” wording and earlier durable-state bullets that still describe some accepted items as partial. Update these for a single unambiguous current state.

The acceptance matrix should distinguish:

- functionality independently passing;
- subjective visual acceptance;
- recommendations deliberately deferred;
- external-device testing not performed.

That distinction avoids another implementation cycle where a passing DOM assertion is interpreted as proof that the picture communicates the story.

## What not to reopen

Do not reopen R1–R5 without a new reproducible failure. Do not revert the chapter art, working canonical-home ending, new journal structure, Daily isolation, or accessible control changes. Preserve the campaign definitions and solutions.

The next useful work is a **small, visually reviewed finishing pass**, followed by real-device playtesting—not another all-day generalized rewrite.

## Unverified external checks

Real phone touch/safe areas, genuine iOS Safari behavior, battery/frame pacing on modest hardware, exhaustive assistive-technology behavior, and subjective speaker/headphone mixing remain unverified. The repository appropriately identifies these as external-only. Desktop browser success is not a substitute.

This review rendered all 400 starts but did not solve all 400 levels. It inspected the 25-beat cinematic set and targeted normal-motion scenes, not every moment of every animation on every device.

## Evidence

All evidence is local in this review folder:

- [Main results](C:/RetroRig_Codex_Handoff/audit-latchlings/review-2026-09-14/results.json)
- [Independent motion test](C:/RetroRig_Codex_Handoff/audit-latchlings/review-2026-09-14/motion.json)
- [Journal, memory, focus and normal-motion inspection](C:/RetroRig_Codex_Handoff/audit-latchlings/review-2026-09-14/ui.json)

Original reference documents remain in the repository: [original audit](https://github.com/maloysius-wq/latchlings/blob/9dffa07d9f1fcd0c48029e13e8a641596c630fc8/LATCHLINGS_VISUAL_STORY_AUDIT.md) and [first implementation review](https://github.com/maloysius-wq/latchlings/blob/9dffa07d9f1fcd0c48029e13e8a641596c630fc8/LATCHLINGS_IMPLEMENTATION_REVIEW.md).

### Handoff prompt

> Read DEVELOPMENT_HANDOFF.md first and current main as source of truth. Read LATCHLINGS_SECOND_REVIEW.md alongside the original audit. R1–R5 have passed independent fresh testing; preserve them. Address S1–S3 as a bounded finishing pass, with visual evidence rather than only DOM/data assertions. Treat S4 as art-direction refinement and clean stale handoff status wording. Explicitly distinguish accepted functionality, intentionally deferred creative recommendations, and unverified external-device work. Do not change authored campaign definitions/solutions or restart the completed rollout.
