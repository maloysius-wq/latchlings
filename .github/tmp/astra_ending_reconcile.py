from pathlib import Path

matrix_path = Path('ASTRA_AUDIT_ACCEPTANCE_MATRIX.md')
handoff_path = Path('DEVELOPMENT_HANDOFF.md')
matrix = matrix_path.read_text(encoding='utf-8')
handoff = handoff_path.read_text(encoding='utf-8')

old = 'This file is the durable repository-side reconciliation of the original `LATCHLINGS_VISUAL_STORY_AUDIT.md` (audit baseline `a5048dd25804fdd261639e5a22332a0cfd506682`) and `LATCHLINGS_IMPLEMENTATION_REVIEW.md` (reviewed head `d6e39c0866505795c2aa6a26777896072e16e7df`) against current `main` after the accepted R1-R5 usability pass, Astra Pass 4 cinematic slice, Little Home coherence slice, Atlas + Story/Journal coherence slice, and Gameplay / Story coherence slice.'
new = 'This file is the durable repository-side reconciliation of the original `LATCHLINGS_VISUAL_STORY_AUDIT.md` (audit baseline `a5048dd25804fdd261639e5a22332a0cfd506682`) and `LATCHLINGS_IMPLEMENTATION_REVIEW.md` (reviewed head `d6e39c0866505795c2aa6a26777896072e16e7df`) against current `main` after the accepted R1-R5 usability pass, Astra Pass 4 cinematic slice, Little Home coherence slice, Atlas + Story/Journal coherence slice, Gameplay / Story coherence slice, and Ending closure slice.'
assert old in matrix
matrix = matrix.replace(old, new, 1)

old = '| V18 ending art quality | PARTIAL | Pass 4 replaced the simplified completion graphic with the canonical Little Home scene, ordinary-life activity, living-route accents, and a Home-first action. Candidate screenshots passed at 320x568, 390x844, and 430x932. A true living-Skyway-to-Little-Home pullback is still needed before closure. |'
new = '| V18 ending art quality | COMPLETED | The accepted ending closure keeps the canonical Little Home scene and adds a six-node living Skyway around it, then visually draws the composition from the wider network toward Little Home as one connected node before the familiar parcel/porch morning action resolves. Exact candidate `e3ac2e999c4781e8f4e9789552a5025e93b3466e` passed 320x568 / 390x844 / 430x932 plus OS/in-game Reduced Motion in run `34884153884`; exact bytes were promoted to `main` as `96aead97f525a25061f9b3e2b60b2a8263b2509d` and independently revalidated in run `34886703644`. |'
assert old in matrix
matrix = matrix.replace(old, new, 1)

old = '| N06 visual ending thesis | PARTIAL | Pass 4 removed the explanatory three-card thesis and centers the ordinary morning with concise copy and primary Return to Little Home. The final network-to-home visual pullback still needs to carry more of the thesis without relying on text. |'
new = '| N06 visual ending thesis | COMPLETED | The final image now carries the thesis visually: several communities remain active in one living network, Little Home is explicitly one node within it, the composition resolves toward the canonical home, and a parcel reaches the porch while the islands continue drifting. The concise accepted ending copy is unchanged; `Return to Little Home` remains the primary action and `Level Select` secondary. Reduced Motion presents the same resolved tableau without animation. |'
assert old in matrix
matrix = matrix.replace(old, new, 1)

old = '''### Pass 4 cinematics and ending
**PARTIAL, accepted cinematic slice promoted.** Candidate run `34865335086` passed source protection, syntax/static checks, every utterance across all 25 beats at three phone sizes, representative visual evidence, OS Reduced Motion, and in-game Reduced Motion. Accepted candidate product commit: `b8f6addf83611b3f8daf71311372e10de3ed90b6`; exact product bytes promoted to main as `0e244bfb5e0ae71fad64f468cb99b301b01af713`. One-speaker chronological pacing, action-oriented scenic restaging, opening pacing cleanup, canonical Little Home ending art, concise ending copy, and Home-first completion action are accepted. Remaining Pass 4 closure is the true living-Skyway-to-home visual pullback plus broader presentation-system consolidation tracked under V18/N06/V19.'''
new = '''### Pass 4 cinematics and ending
**COMPLETED for the audited cinematic and ending direction.** Candidate run `34865335086` accepted the one-speaker chronological cinematic pacing, action-oriented scenic restaging, opening pacing cleanup, canonical Little Home ending art, concise ending copy, and Home-first completion action. Ending closure candidate `e3ac2e999c4781e8f4e9789552a5025e93b3466e` then added the missing living-Skyway-to-home visual pullback and ordinary successful morning payoff; run `34884153884` passed the candidate matrix and run `34886703644` independently passed committed-main verification after exact-byte promotion to `96aead97f525a25061f9b3e2b60b2a8263b2509d`. V18/N06 are complete. Broader duplicated cast/state/design-token/CSS consolidation remains separately PARTIAL under V19 rather than reopening the accepted cinematic/ending direction.'''
assert old in matrix
matrix = matrix.replace(old, new, 1)

anchor = '''### Gameplay / Story coherence
**ACCEPTED core slice.** TDD RED run `34871396998` failed on the intended missing pre-win mastery rubric. Candidate run `34871805806` then passed exact campaign/accepted-source protection and the three-phone browser matrix after earlier attempts exposed a real 320x568 controls overflow; accepted candidate product commit `d2639e7`. Candidate artifact `10362672460`, SHA-256 `2ce5522db5357e1a59936ef6ebe592c3768c6f6652e36940c3dd9ae593ac177a`. Settled visual run `34880369639`, artifact `10363160590`, SHA-256 `9b2e5380ad8a899834a9a6d66fbd5e919b5df704e6446dfcb4583b8581269392`, was manually reviewed. Promotion/live run `34880640526` promoted only the six accepted product files to `main` as `4f9e27b01f3a0ae158ee44c8ac36b4c11e2fa033` and independently revalidated committed runtime; live artifact `10362788052`, SHA-256 `d6f73cb853179295b6c6b9115d91e4654eec4404323b1a171c1cead2d3088ead`. Follow-up committed-main closure run `34881048866`, artifact `10363266549`, SHA-256 `764e8dfb2782d9b286e13691dd9347714c966066600eb8ddc4ad77400acebbd0`, manually verified dense Levels 201/366 and grayscale/color-vision mechanic readability. V01/V09/V10/U09/V16/V17 are complete. N04 remains partial; V06/N05/V07/V12 and related authorship/world-consistency work remain for a later focused slice.
'''
assert anchor in matrix
ending_section = '''
### Ending closure
**ACCEPTED slice.** TDD RED run `34881984533` failed on the intended missing living-Skyway ending stage. Final accepted candidate `e3ac2e999c4781e8f4e9789552a5025e93b3466e` passed short/normal/wide phone containment, meaningful network semantics, canonical Little Home reuse, preserved concise copy/Home-first action, and OS/in-game Reduced Motion in run `34884153884`. Candidate artifact `10363603745`, SHA-256 `faa23518054ba810b16d0ee25116736fc22832192ef28c5b157b748dd7b7d23a`, was manually reviewed. Promotion/live run `34886703644` imported only `index.html` and `style400-ui.css` to `main` as `96aead97f525a25061f9b3e2b60b2a8263b2509d`, rechecked protected sources, then independently revalidated committed main. Live artifact `10365415386`, SHA-256 `e26903228bbaadcf39868f85c00d08a0e1e036ca2da1be66af5f64f14928a26e`. V18/N06 are complete.
'''
matrix = matrix.replace(anchor, anchor + ending_section, 1)

# Handoff: earlier Pass 4 status is now historical but must not claim ending still open.
old = '- V03 is accepted complete. V18/N06 remain partial because the final living-Skyway-to-Little-Home pullback is still implied rather than fully staged. V19 is partial: canonical utterance state is consolidated between the core cinematic renderer and dialogue layer, but broader presentation/CSS duplication remains.'
new = '- V03 is accepted complete. The later Ending closure checkpoint below closes V18/N06 with the living-Skyway-to-Little-Home pullback. V19 remains partial: canonical utterance state is consolidated between the core cinematic renderer and dialogue layer, but broader presentation/CSS duplication remains.'
assert old in handoff
handoff = handoff.replace(old, new, 1)

old = '''Accepted Ending closure checkpoint (2026-09-14):
- **IN PROGRESS promotion gate.** TDD RED run `34881984533` failed for the intended missing behavior (`short: missing living-Skyway ending stage`). Final candidate run `34884153884` passes the three-phone ending contract and OS/in-game Reduced Motion on exact accepted product commit `e3ac2e999c4781e8f4e9789552a5025e93b3466e`; candidate artifact `10363603745`, SHA-256 `faa23518054ba810b16d0ee25116736fc22832192ef28c5b157b748dd7b7d23a`, has been manually reviewed. Promotion and committed-main verification are the remaining acceptance gates before V18/N06 can be marked complete.

Remaining closure work:
1. Ending closure: promote the accepted ending bytes to `main`, revalidate committed `main`, then reconcile V18/N06.
2. Character/world coherence: finish N04 information-role separation, remaining keepsake/resident-use behavior, Pip/Tansy characterization, cross-region fixture consistency, and Atlas landmark distinctiveness where nodes still feel interchangeable.
3. Presentation/accessibility consolidation: material-language consistency, all-controls target/focus audit, safe-area/text-scaling/reading-order checks, motion interruption/offscreen animation checks, shared cast/presentation tokens/renderer cleanup, and removal of obsolete override layers where safe.
4. Pass 5 browser-addressable coverage: 320x568, 360x800, 390x844, 430x932, tablet and landscape decisions; fresh onboarding/skipped opening/returning player; all films/dialogue turns; 40 movement starts/results; Daily/replay/campaign isolation; contrast/non-color identity; keyboard/focus/text scaling; sound-toggle persistence/interruption behavior; asset/cache integrity; frame-time/memory/loading measurements in available browser runtimes.
5. External-only certifications must remain explicitly unverified if this environment cannot perform them: real physical-phone touch/performance/battery behavior, genuine iOS Safari hardware behavior, exhaustive assistive-technology testing, and subjective real-speaker/headphone audio mixing/listening.'''
new = '''Accepted Ending closure checkpoint (2026-09-14):
- **ACCEPTED.** TDD RED run `34881984533` failed for the intended missing behavior (`short: missing living-Skyway ending stage`). Final candidate run `34884153884` passed the three-phone ending contract and OS/in-game Reduced Motion on exact accepted product commit `e3ac2e999c4781e8f4e9789552a5025e93b3466e`; candidate artifact `10363603745`, SHA-256 `faa23518054ba810b16d0ee25116736fc22832192ef28c5b157b748dd7b7d23a`, was manually reviewed.
- Promotion/live run `34886703644` required exact promotion base `540f5af60d9b4fe3ea2078a1f7956e42d4eaf885`, rechecked all protected accepted sources, imported only `index.html` and `style400-ui.css`, and promoted exact accepted ending bytes to `main` as `96aead97f525a25061f9b3e2b60b2a8263b2509d`.
- The same run fresh-checked committed `main` and independently passed 320x568 / 390x844 / 430x932, canonical Little Home reuse, six-node living-network semantics, network-to-home sequence, exact concise copy, Home-first action, title/viewport containment, runtime-error checks, and OS/in-game Reduced Motion. Live artifact `10365415386`, SHA-256 `e26903228bbaadcf39868f85c00d08a0e1e036ca2da1be66af5f64f14928a26e`.
- V18 ending art quality and N06 visual ending thesis are accepted complete. V19 remains partial for separate presentation-system consolidation.

Remaining closure work:
1. Character/world coherence: finish N04 information-role separation, remaining keepsake/resident-use behavior, Pip/Tansy characterization, cross-region fixture consistency, and Atlas landmark distinctiveness where nodes still feel interchangeable.
2. Presentation/accessibility consolidation: material-language consistency, all-controls target/focus audit, safe-area/text-scaling/reading-order checks, motion interruption/offscreen animation checks, shared cast/presentation tokens/renderer cleanup, and removal of obsolete override layers where safe.
3. Pass 5 browser-addressable coverage: 320x568, 360x800, 390x844, 430x932, tablet and landscape decisions; fresh onboarding/skipped opening/returning player; all films/dialogue turns; 40 movement starts/results; Daily/replay/campaign isolation; contrast/non-color identity; keyboard/focus/text scaling; sound-toggle persistence/interruption behavior; asset/cache integrity; frame-time/memory/loading measurements in available browser runtimes.
4. External-only certifications must remain explicitly unverified if this environment cannot perform them: real physical-phone touch/performance/battery behavior, genuine iOS Safari hardware behavior, exhaustive assistive-technology testing, and subjective real-speaker/headphone audio mixing/listening.'''
assert old in handoff
handoff = handoff.replace(old, new, 1)

old = '- Preserve all R1-R5 behavior, accepted Pass 4 cinematic dialogue/navigation behavior, accepted Little Home contextual/memory/motion behavior, accepted Atlas/journal hierarchy/state/accessibility behavior, and accepted Gameplay / Story behavior.'
new = '- Preserve all R1-R5 behavior, accepted Pass 4 cinematic dialogue/navigation behavior, accepted Little Home contextual/memory/motion behavior, accepted Atlas/journal hierarchy/state/accessibility behavior, accepted Gameplay / Story behavior, and accepted ending network/Home-first/Reduced-Motion behavior.'
assert old in handoff
handoff = handoff.replace(old, new, 1)

old = 'Next action: promote exact ending product bytes from accepted candidate `e3ac2e999c4781e8f4e9789552a5025e93b3466e`, run a fresh committed-main ending matrix at 320x568 / 390x844 / 430x932 plus OS/in-game Reduced Motion, then reconcile V18/N06 only if the promoted bytes remain green.'
new = 'Next action: Character/world coherence candidate. Preserve all accepted product slices while finishing the remaining source-defined behavior/world gaps: sharpen N04 information roles across during-play motive, movement-opening clue, milestone result, and recap; complete V06 resident use for earned keepsakes; add Pip/Tansy behavior and broader line-appropriate expressions for N05; improve V07 cross-region fixture consistency and V12 destination distinctiveness without changing authored puzzle definitions.'
assert old in handoff
handoff = handoff.replace(old, new, 1)

old = '- The ending closure candidate is accepted on its validation branch and is awaiting exact-byte promotion plus committed-main verification; V18/N06 remain partial until those gates pass.'
new = '- The Ending closure slice is promoted and protected; V18/N06 are complete on committed `main` with candidate, manual-visual, committed-live, and Reduced Motion evidence.'
assert old in handoff
handoff = handoff.replace(old, new, 1)

matrix_path.write_text(matrix, encoding='utf-8')
handoff_path.write_text(handoff, encoding='utf-8')
print('Ending closure reconciliation applied.')
