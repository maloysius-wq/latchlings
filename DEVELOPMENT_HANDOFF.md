# Development Handoff

## REPOSITORY ACCESS PRE-FLIGHT — HARD GATE
For repository work, GitHub is the canonical path. If GitHub repository functions are not already loaded, the first tool action for a repository task must be connector/plugin discovery for `GitHub`.

## Repository access preflight
GitHub is the canonical repository path for this project. Read this handoff first, then inspect the repository through the connected GitHub tools before doing repository work. If GitHub repository functions are not already loaded, discover/load them before attempting another repository route. Local clone or filesystem failure is not evidence that GitHub is unavailable. If the wrong route is attempted first, recover immediately through GitHub and continue the original request without asking the user to repeat the plugin instruction.

## Current work

### Approved full-game polish implementation (2026-09-24)
**Status: LOCAL IMPLEMENTATION VERIFIED — final branch push and GitHub CI pending.**

Approved scope: execute the complete game-polish design and implementation guide on branch `codex/audit-polish-20260924`, starting from `881630b159dd0471870826f2a4181506f97078b0`. Follow the approved design at `docs/superpowers/specs/2026-09-24-game-polish-design.md` and the ordered entry point at `docs/superpowers/plans/2026-09-24-game-polish-execution-guide.md`: reliability/gameplay, phone presentation, then story staging. The completed work and remaining checks are recorded below.

Protected behavior: no Undo, no narrator voice, no campaign level/solution edits, no move/star-rule changes, no Daily/campaign progress mixing, manual tap/keyboard advancement for every cinematic line, canonical Little Home identity, and the accepted pre-Astra Reset/D-pad/Hint control geometry. Keep the existing static HTML/CSS/JavaScript architecture and provide a factual final handoff before considering merge/deploy.

Baseline evidence: full `npm test` exits 1 in `tests/opening-world-coherence.browser.cjs:163` at 360x800 Normal, reporting that Opening turn 4 does not show the breakfast basket visibly traveling. Running that suite alone reproduces the same assertion. Running `tests/phone-visual-regressions.browser.cjs` alone exits 1 at `openingGeometry` because `getPointAtLength` is called on an empty SVG path. The full command aborts at the first suite, so the second failure was confirmed separately. Full logs are in the local ignored `.superpowers/sdd/2026-09-24-reliability-gameplay/` workspace.

Starting protected-source SHA-256 values:

| File | SHA-256 |
|---|---|
| `campaign400-1.js` | `8F3F99F27B3CEA194CD41F8C45F1802BC080B5D423B9F03AD0D465A57433A003` |
| `campaign400-2.js` | `5C2EFE317C5AA57C4A67C30DFC3DCCCCF1941144623D75F9884D8028706F3E96` |
| `campaign400-3.js` | `F42CBCB06FFDFDBEC5B91C6E7DBB7925CF73125B3C8EDD23F4814B37E56027B9` |
| `campaign400-4.js` | `9CB48060E6F46E8755F9035FCF16239C46624B918E40E4A10750571CD02AE9E9` |
| `campaign400-5.js` | `A4FB2C11D338CAFC90266A49F751E91471B7E97E88F61879D7FD0D1F5F7545D5` |
| `campaign400-6.js` | `EEEBA272F0543CE044F027A0B2A79791198B223BEBDF75A382F68F06F486B363` |
| `campaign400-7.js` | `54B0655F5854C5D4842526119090A68A6C91D6B31E0B84A4B245601BB96769A0` |
| `campaign400-8.js` | `7F0E5DEA01B184E59CB7C44632376D6EA3C1916368CE3EB89B850714741CA987` |

#### Reliability/gameplay stage — verified complete (2026-09-24)

Completed in ordered commits on `codex/audit-polish-20260924`:
- `13262a9` — readiness-aware opening geometry and motion tests; the existing route-endpoint and overlap assertions remain active.
- `362de98` — replayed all 400 authored solutions through the live simulator, added Level 1/201/301 smoke coverage, and added the GitHub Actions workflow.
- `b6fdf98` — versioned progress export/import validation, transactional storage updates, visible unsaved-progress handling, and plain-language reset copy.
- `34fa172` — deterministic Daily tiers based on completed mechanics, with campaign/Daily isolation.
- `d414cac` — pure move simulation and bounded, cancellable current-board hints. Search distinguishes proven `impossible` from `inconclusive`; it shows only one next move, recognizes verified authored-route continuations, preserves an exhausted board when opening the loss-screen hint, and adds no Undo control.

Verification evidence:
- `npm test` passed all nine browser suites at the committed Task 5 tree: opening-world coherence, opening board header, phone visual regressions, continuous Opening, Opening flow, cinematic regression, all-400 campaign replay, progress/Daily, and current-board hints. The full command was run twice while stabilizing Task 5; the final run exited 0.
- `node tests/gameplay-campaign.browser.cjs` passed all 400 authored routes and Level 1/201/301 start checks. Campaign definitions were not edited.
- `node tests/current-hint.browser.cjs` passed pure/live-simulator parity, noninitial route completion within its move budget, proven exhaustion, bounded-search uncertainty, cancellation, one-step UI, and persistent highlight. A progressed Level 301 switch/door route displayed the verified gold-diamond/down continuation in 23ms at 390×844; its local screenshot is `C:\Users\Max\AppData\Local\Temp\latchlings-level301-current-hint.png` (not a repository artifact).
- Browser coverage included 320×568, 360×800, 390×844, and 430×932, with Large Text and Reduced Motion cases in the relevant cinematic, layout, save, and flow suites. The hint UI was visually inspected at 390×844; the hint overlay fit without clipping or obstructing its choices.
- The eight current campaign SHA-256 values match the Task 0 baseline blob contents. Task 0's `campaign400-7.js` table cell contained a transcription typo; the verified hash is `54B0655F5854C5D4842526119090A68A6C91D6B31E0B84A4B245601BB96769A0`. The file itself is unchanged from the recorded start commit.
- `git diff --check` passed. The only untracked path at closeout was `test-artifacts/opening-world/`, a set of PNG evidence generated by the browser test; it was left uncommitted and preserved.
- GitHub Actions has no run for the new local commits yet. `gh run list --repo maloysius-wq/latchlings --branch codex/audit-polish-20260924 --limit 10` returned no runs, and `origin/codex/audit-polish-20260924` is still at `881630b`. Per the execution guide, the updated branch will be pushed only after all three stages are complete; CI must then be inspected before claiming final completion.

Phone Presentation completion evidence (2026-09-24):
- Ordered commits: `a1ede81` (cinematic copy), `9ad3277` (Atlas destinations), `6cd1b3c` (mechanic inspector), `42d6d63` (phone bounds/layout), and `c3e49c9` (prevent Home-only scaling from leaking into canonical cinematic Little Home geometry).
- `node tests/phone-stage-certification.browser.cjs` passed a fresh 180-case settled browser matrix on product commit `c3e49c9`: five viewports (320×568, 360×800, 390×844, 430×932, 844×390), nine screens (Home, Opening long line, later-film line, Level 1, Level 366, Atlas, Story/Journal, Settings, Ending), Normal/Large Text, and OS/in-game Reduced Motion. Assertions covered essential text, horizontal overflow, visible controls/footer, board and D-pad separation, cinematic copy bounds, touch targets, and modal focus restoration. Captures remain in `%TEMP%` under `latchlings-phone-stage-*`; they were visually reviewed, including short-phone Large Text and landscape Home/cinematics/Level 366/Ending.
- `node tests/home-short-phone.browser.cjs`, `node tests/ending-landscape.browser.cjs`, `node tests/large-text-gameplay.browser.cjs`, `node tests/phone-visual-regressions.browser.cjs`, and `node tests/mechanic-inspector.browser.cjs` passed. The phone visual regression specifically verifies canonical Opening path endpoints and the preserved pre-Astra control cluster.
- Full `npm test` passed after `c3e49c9`, including the Opening/cinematic regressions, phone readability suites, mechanic inspector, all 400 campaign routes, progress/Daily isolation, and current-board hint checks. `git diff --check` passed. All eight protected campaign SHA-256 values match the Task 0 baseline above.
- GitHub Actions has no run for the local commits yet: the connected GitHub branch still points to `881630b159dd0471870826f2a4181506f97078b0`, and the branch's Actions query returns zero runs. The execution guide defers pushing until all three stages are complete; inspect CI after that push and before final completion.

Remaining external checks include physical iOS/Android touch/performance behavior, assistive-technology coverage, and real-device audio listening. Overall work remains IN PROGRESS until Story Staging, final branch CI, and final handoff verification are complete.

Next: execute `2026-09-24-story-staging.md` in numbered order. Keep actual test output, screenshot review, commit SHA, campaign hashes, CI state, and external-only checks distinct. Mark this work COMPLETED only after the guide's final acceptance conditions are verified on the committed branch; otherwise document the exact remaining failure and PARTIAL status.

### Opening world coherence and static cinematic controls
**Status: COMPLETED / MERGED AND COMMITTED-MAIN VERIFIED**

Closeout (2026-09-16): PR #4, `Rebuild Opening around canonical Little Home`, was squash-merged to `main` as `8ac932e073b2fb72fd014fbbe3f885781af3ce41`. Candidate GitHub Actions run `35131002359` passed the full shipped six-suite `npm test`, including canonical-world coherence, the dedicated route-model header regression at Normal/Large Text, physical-phone geometry, continuous Opening behavior, first-run/replay/skip safety, and all 38 later-cinematic utterances. The exact merged-main commit was independently revalidated by browser run `35131483783`, which passed the same complete suite; repository access guard run `35131483828` passed; and GitHub Pages deployment run `35131482355` succeeded. Manual review of fresh candidate screenshots confirmed the three semantic misses, Rowan comparison, relocated Waykeeper call, final route-model header separation, and 360x800 Large Text presentation. The temporary Opening validation workflow is removed by this closeout commit; reusable regression tests remain in `tests/`.

Started 2026-09-16 from exact `main` `18f7605503ca81a1a94a0310b828a699c06d3e90` on branch `agent/opening-world-static-controls-20260916`. User-provided Android screenshots showed that the Opening still reads as several unrelated coordinate systems rather than one coherent place: a tiny neighboring island beside an oversized Little Home, Skyway lines that overshoot their islands, a breakfast delivery described as a miss while visibly reaching the porch, and a cinematic Little Home that does not match the production title-screen Little Home. The lower cinematic copy area also changes height between narrator and resident turns, moving progress/actions vertically.

Approved direction: reuse the production `title-island-concepts/?c=2&embed=1&cinematic=1` Little Home as the canonical home scene rather than redrawing it; establish neighboring islands in a pulled-back opening camera and move the camera toward Little Home instead of changing island scale relationships; bind route endpoints/miss markers to named semantic landmarks so the basket, watering line, and play shortcut visibly and verifiably miss their intended destinations; give every one of the 21 Opening spoken moments an explicit visual action/state; remove the changing route-tip treatment; and reserve a fixed lower copy/progress/action layout so controls never move between turns. Preserve canonical dialogue/story, later cinematics, gameplay rules, campaign definitions/solutions, title-screen Little Home behavior, Story replay, Large Text, Reduced Motion, and the accepted pre-Astra gameplay control geometry.

Implementation contract: follow TDD. Add/strengthen browser regressions before product edits and prove they fail for the current behavior; then make the smallest architecture changes needed. New checks must cover canonical Little Home reuse, proportional/grounded neighboring-island presentation, semantically correct porch/garden/play misses, deterministic per-turn visual state for all 21 Opening utterances, fixed footer/progress/button geometry across all turns, Normal/Large Text containment, Reduced Motion, and the existing 360x800 / 390x844 / 430x932 physical-phone geometry protections. Run targeted browser tests plus the complete shipped `npm test` on committed branch state. Review representative settled screenshots before promotion. Do not merge or mark complete until the committed candidate has evidence for the entire acceptance contract.

Implementation plan: `docs/superpowers/plans/2026-09-16-opening-world-coherence.md`.

### Physical-phone opening geometry and puzzle-control restoration
**Status: COMPLETED / COMMITTED-MAIN REGRESSION FIXED AND VERIFIED**

Closeout (2026-09-15): PR #3 was squash-merged to `main` as `8ce8556f31c2099e448e522b9e3ca7cd2501b1c9`. The root cause was a stale filled Web Animation: after the basket travel step, `place()` updated inline route coordinates without cancelling the still-active `fill: 'forwards'` animation, so rapid story advancement could leave the basket frozen mid-route over Rowan at 360×800. `place()` now cancels active element animations before applying the resolved route point. Candidate GitHub Actions run `35026680458` passed the targeted phone visual regression and the complete shipped `npm test`; latest branch-head run `35026926425` also passed both gates. Most importantly, committed-main GitHub Actions run `35027136387` passed `tests/phone-visual-regressions.browser.cjs` and the full four-suite `npm test` on exact merge SHA `8ce8556f31c2099e448e522b9e3ca7cd2501b1c9`. Repository access guard run `35027136530` also passed. The temporary repair workflow was removed during closeout; only handoff/workflow housekeeping changed after the verified product merge.


Verification follow-up after Codex usage exhaustion found a reproducible committed-main regression. PR #2 is merged to `main` as `28c8309fac33c0995fb03b9a9356b5614e32792c`, and its repository guard (`35019203103`) plus Pages deployment (`35019202230`) passed. However, fresh verification run `35021684052` executed the repository's exact shipped `npm test` command and failed twice in `tests/phone-visual-regressions.browser.cjs` at 360×800: `arrived props must not cover residents`, specifically overlapping `opening-rowan` (first attempt reported `opening-rowan:339`; confirmation rerun reported `opening-rowan:235`). Because the first browser suite aborts on this assertion, the remaining three suites did not execute in that fresh committed-main run. Initial run `35021561796` was harness-only and did not reach tests because `npm ci` was invalid without a lockfile; it is not product evidence. Do not treat this slice as fully verified until the 360×800 overlap is fixed and the complete shipped `npm test` command passes on committed `main`.

User-provided Android screenshots on 2026-09-15 exposed two root causes: the Opening positioned residents against the whole stage while Little Home occupied only a narrow portion of it, and independently floating islands drifted away from fixed SVG routes; the earlier control restoration enlarged only the D-pad while leaving Astra's compact 330px / 64px–148px–64px grid in force, which displaced or hid Hint.

Candidate branch `codex/mobile-island-controls-fix-20260915` enlarges and rebalances the textured Little Home plateau, grounds all five residents and the porch/garden/play-rock props, centers Pip on the SVG motion path, distributes moving props away from the cast, fixes route endpoints relative to their named destinations, places the call display clear of every face, and gives the helper route an unobstructed grassy-edge landing. Independent island bobbing was removed because it made otherwise correct SVG endpoints visibly detach. Story copy/pacing, gameplay rules, board presentation, campaign data, later cinematics, and landscape layout are unchanged.

The complete portrait Reset / D-pad / Hint cluster now restores the exact pre-Astra baseline geometry from `a5048dd25804fdd261639e5a22332a0cfd506682`: full available width, 78px side columns, original 80px/66px side-action heights, 22px radii, 13px labels, responsive 224px/53vw and short-screen 190px/45vw D-pad sizing, and original direction hit regions. New `tests/phone-visual-regressions.browser.cjs` validates 360×800, 390×844, and 430×932 resident/prop plateau containment, route-to-destination proximity, route-marker connection, post-animation Pip footing, prop/call/helper non-overlap, and complete control geometry. Fresh local `npm test` passed all four shipped browser suites; rendered 390×844 frames for steps 1, 10, 12, 14, and 17 plus Level 1 controls were manually reviewed. PR #2 repository guard run `35019072437` passed on candidate `be0fcd02fa1a268b873037bca366c8ea919dba28` before this documentation-only closeout.

### Continuous opening cinematic rebuild
**Status: COMPLETED / ACCEPTED**

User-approved replacement of the current card-like first-run Opening with one continuous, tap-to-advance animated morning at Little Home. Preserve canon, later cinematics, campaign data, settings, replay access, and control geometry. The new opening must use title-island material textures, connect every route to explicit source/destination anchors, protect dialogue and controls from scenic overlap, support Normal/Large Text and Reduced Motion, and validate stage-only story readability at 320x568, 390x844, and 430x932 before promotion.

Approved screenplay arc: establish normal drift and a working flexible Skyway; follow one breakfast basket to Little Home; show the basket, watering line, and play route missing by the same offset; let all five residents observe and respond; send and answer the old Waykeeper call; gather voluntary local knowledge; dissolve the same physical scene into the real Level 1 route model; begin by helping with breakfast without prematurely declaring the map stale.

Candidate implementation: draft PR `#1` on `codex/opening-cinematic-rebuild-20260915` replaces the prior 8-card/10-step first-run compromise with a single persistent Little Home stage and 21 player-paced spoken lines. The production uses the title-island earth/grass/wood textures, normalized SVG routes whose endpoints are bound to named anchors, route-following movers, a separate helper skiff, and an exact miniature generated from `LEVELS[0]`. Dialogue, scenic art, and persistent controls occupy separate grid regions; the short-phone layout preserves full Large Text without reducing its font size. The Story journal replays all 21 lines, Skip still enters the normal Level 1 Story Card, and later cinematics are unchanged.

Acceptance evidence: local TDD began red at 18 rather than the approved 21 lines, then caught and drove correction of a helper/household pile-up, an overflowing fifth board column, and a 320x568 Large Text scroll on Rowan's longest line. Final local browser contracts passed all 21 opening states at 320x568 / 390x844 / 430x932, Normal and Large Text, OS and in-game Reduced Motion, exact route-to-anchor geometry, persistent-scene identity, real Home Play → Opening → Level 1 flow, Skip, journal replay, and all 38 utterances in the later cinematics. Representative settled screenshots for the opening, three matching misses, Waykeeper call, helper arrival, and Level 1 model were manually reviewed. All eight `campaign400-*.js` SHA-256 values remained exact. Exact candidate product/docs/test bytes were committed by `e9ec21b11309fd2d492c056c5503ee900be55663`; candidate browser runs `35007698033` and `35008241419` plus repository guard runs `35007697956` and `35008241409` passed. PR `#1` was squash-merged to `main` as `aa3275d576911e3011ea6027d256c8b95fe3d129`. Committed-main browser run `35008479218`, repository guard `35008479273`, and Pages deployment `35008478478` all passed. Temporary validation workflow cleanup landed as `1a032dd5330ba27c713e0d9a9d51e031285032f6`; the reusable browser tests remain in `tests/`.


### User playtest: controls and opening story balance
**Status: COMPLETED / ACCEPTED**

Player-feedback follow-up on 2026-09-15 intentionally supersedes two Astra-era presentation choices while preserving the accepted underlying systems.

- **Gameplay controls:** the Astra short/tall-phone D-pad shrink overrides were reverted to the original pre-Astra responsive geometry. Main `9015bdb6b2f60e30b98afddc677e990ba8b1bff4` adds only `style400-control-restoration.css` plus its late import. Committed-main Chromium run `34978632258` verified 144px at 320x568, 175.5px at 390x568, 190px at 430x568, and 206.7px at 390x844, including the original short-screen directional hit geometry. Pages run `34978567074` succeeded. This is now the protected control baseline unless new player testing requests another change.
- **First-run Opening:** the earlier five-advance compact Opening was too terse in live playtesting. The accepted first-run flow now uses ten existing canonical utterances at `[[0,0],[1,0],[1,1],[1,2],[1,3],[2,2],[3,0],[4,0],[6,0],[7,1]]`, restoring the moving-world hook, all five Little Home voices, the stale-route diagnosis, what the Skyway does, the Waykeeper call, the movement rule, and Pip's breakfast beat. No canonical dialogue was rewritten. The complete 8-beat / 18-utterance Opening remains available in replay, and the later three cinematics are unchanged.

Opening acceptance evidence: TDD RED run `34980347527` failed on the old five-step selection; accepted candidate product `a710738756472142c906f71d956652ceb1a5f749`; candidate browser run `34981082617` passed 320x568 / 390x844 / 430x932, full 18-utterance Opening replay, all 56 cinematic utterances, Reduced Motion, control containment, and restored D-pad protection. Candidate artifact `10401806417`, SHA-256 `4c8d9bff12ccc50e42adeb15bf25ee205ac9802d3da78a327cb201859f8b51d8`, was manually reviewed and accepted. Exact accepted `cinematics400.js` bytes were promoted to main as `caa55b27ebdb6902e0ff018fee4ca80744828171`; committed-main run `34981606218` independently revalidated exact provenance and the same runtime contract. Live artifact `10402101217`, SHA-256 `67878195e4dd4ac2ae6327c9215fd7822d02dcd7dcfda85d938cb62b6dd426f0`.

The historical Astra second-review section below remains as evidence of the earlier five-step decision, but its first-run pacing choice is superseded by this player-tested ten-step flow. Preserve the full replay, cinematic presentation architecture, later cinematics, Reduced Motion, authored campaign definitions/solutions, and the restored pre-Astra control geometry.

### Astra second-review finishing pass
**Status: COMPLETED / BOUNDED FINISHING PASS ACCEPTED**

Source: [`LATCHLINGS_SECOND_REVIEW.md`](LATCHLINGS_SECOND_REVIEW.md), reviewing main `9dffa07d9f1fcd0c48029e13e8a641596c630fc8`. Preserve independently reverified R1-R5, authored campaign definitions/solutions, accepted Home/Atlas/journal/ending behavior, and completed browser-addressable certification.

Approved bounded scope:
- S1: visually stage the Opening beat-1 breakfast-basket travel and Across the Drift beat-5 reconnection to the same twin-lantern porch; add a small unattended-desk cue to Old Maps beat 4 only if it fits the existing composition cleanly.
- S2: shorten first-run opening pacing to roughly five meaningful advances while retaining the complete canonical 8-beat / 18-utterance opening in Journal replay.
- S3: raise journal primary body copy to a comfortable phone-reading baseline around 14px Normal / 16px Large and let the existing internal panels scroll.
- S4: leave as deliberately deferred art-direction refinement unless the bounded S1-S3 changes naturally improve it.

Validation contract: TDD RED before product edits; candidate-first browser validation at 320x568 / 390x844 / 430x932; visual proof screenshots for Opening beat 1 and Across beat 5 with dialogue hidden; full canonical cinematic replay preserved; journal text-size/containment regression checks; exact authored campaign hash protection; committed-main revalidation; temporary-workflow cleanup; final Pages and repository guard.

Accepted evidence:
- TDD RED run `34916255682` reached the browser and failed on the intended pre-change behavior: first-run Opening required 18 advances rather than the approved compact flow. Full replay had already passed at all 18 canonical opening utterances.
- Candidate run `34916628626` passed the three-phone behavioral contract. Initial candidate `897cd8f82ea5dc3de51eb5db4f85be90e8ee93f0` preserved 18-utterance replay, reduced first-run Opening to exactly five canonical advances, raised Journal body copy to 14px Normal / 16px Large, preserved all 56 cinematic utterances, and kept Reduced Motion at zero running cinematic animations. Candidate artifact `10376266862`, SHA-256 `a90e5a8ddffed37266362bd011e869268a26d2ded0a46c22ededa9d059728abb`.
- Manual visual review rejected the first Across-the-Drift beat-5 capture because the route destination was not visually legible despite passing DOM assertions. Visual-correction run `34916941697` fixed only `style400-cinematics.css`, reran the full bounded contract, and produced final candidate `bd0633290cbc01ce6dac398ab2ee49b8dcdb4f2c`. Settled artifact `10376767446`, SHA-256 `274efc0357a363056abb51c070bb3833635a3e7595e41bd9b921ff9b8136fc65`, was manually accepted: Opening beat 1 reads as a basket traveling toward Little Home; Across beat 5 visibly lands the new route on the same twin-lantern porch; Old Maps beat 4 shows an operating router beside an empty desk; Normal/Large Journal captures are clean and readable. Reduced Motion shows the resolved porch tableau without animation.
- Exact accepted four-file product bytes were promoted to `main` as `4e18050462d5b58d326a35130b4e9ec6ebe231c9`. Committed-main run `34917299386` independently revalidated those exact blobs, campaign hashes, the three-phone contract, 56-turn replay, five-step first-run Opening, 14/16px Journal sizing, Reduced Motion, and settled visual captures. Artifact `10376628399`, SHA-256 `4d453c6248305103ff2e264a368bf22ac4315b94e54096517496fd90f99938a0`.
- S1, S2, and S3 are accepted complete for this bounded second-review scope. S4 remains deliberately deferred as subjective art-direction refinement; it is not a functional regression or a reason to reopen the completed rollout.


### Full Astra visual/story audit closure
**Status: BROWSER-ADDRESSABLE FUNCTIONAL CLOSURE COMPLETE / S4 ART-DIRECTION REFINEMENT DEFERRED**

User goal: reconcile the entire original [`LATCHLINGS_VISUAL_STORY_AUDIT.md`](LATCHLINGS_VISUAL_STORY_AUDIT.md) and the later [`LATCHLINGS_IMPLEMENTATION_REVIEW.md`](LATCHLINGS_IMPLEMENTATION_REVIEW.md) against current `main`, finish every remaining software-addressable item, validate the complete acceptance matrix, clean temporary validation machinery, deploy, and close out without treating untested external-device work as complete.

Source acceptance contract:
- Canonical audit source: [`LATCHLINGS_VISUAL_STORY_AUDIT.md`](LATCHLINGS_VISUAL_STORY_AUDIT.md), committed to `main` on 2026-09-14 as `2ece5dd46d8fcb50b3591b62c77dd65b46cd02ab`; original audit baseline `a5048dd25804fdd261639e5a22332a0cfd506682`.
- Canonical implementation-review source: [`LATCHLINGS_IMPLEMENTATION_REVIEW.md`](LATCHLINGS_IMPLEMENTATION_REVIEW.md), exact uploaded bytes finalized on `main` as `307abc8854c5f69eab288c1f2cef4b7dca20b241` (Git blob `9b7413371d8833d7e1fc5c26b89373244ac3dc86`); reviewed-head baseline `d6e39c0866505795c2aa6a26777896072e16e7df`.
- Second independent review source: [`LATCHLINGS_SECOND_REVIEW.md`](LATCHLINGS_SECOND_REVIEW.md), reviewing exact head `9dffa07d9f1fcd0c48029e13e8a641596c630fc8`; it independently reverified R1-R5 and narrowed the remaining work to S1-S3 plus optional S4 art direction.
- [`ASTRA_AUDIT_ACCEPTANCE_MATRIX.md`](ASTRA_AUDIT_ACCEPTANCE_MATRIX.md) is the living reconciliation ledger against all three source documents and current `main`. The audit/review documents define the requested findings and acceptance language; the matrix records functional acceptance, visual acceptance, deliberately deferred recommendations, and external-only work separately.
- R1-R5 usability work is completed and protected by candidate run `34853875486`, committed-live run `34855339189`, final Pages run `34856135214`, and final guard run `34856138001`.

Accepted Astra Pass 4 checkpoint (2026-09-14):
- Candidate run `34865335086` passed exact campaign/source protection, syntax/static assertions, every utterance in all 25 cinematic beats at 320x568 / 390x844 / 430x932, representative visual evidence, OS Reduced Motion, and in-game Reduced Motion.
- Accepted candidate product commit: `b8f6addf83611b3f8daf71311372e10de3ed90b6`.
- Exact accepted product bytes were promoted to `main` as `0e244bfb5e0ae71fad64f468cb99b301b01af713` after a second protected-source check.
- V03 was accepted complete at this checkpoint. The later Ending closure closes V18/N06, and the later presentation/accessibility consolidation closes V19. Historical partial statements below describe then-current checkpoint state, not current project state.

Accepted Little Home coherence checkpoint (2026-09-14):
- Candidate run `34867918569` passed exact campaign/accepted-source protection plus browser checks at 320x568, 390x844, and 430x932. Accepted candidate product commit: `119ece1000cdab69c902ec75d2b0d89881372bd1`.
- Candidate evidence artifact `10357697352`, SHA-256 `0864252f975ab553764fbaee7cf7157e7764e354c155f81573eb7f552f3c7ae3`, includes fresh Home, returning-progress Home, keepsake memory, purposeful-work, Reduced Motion, and results evidence.
- Promotion run `34868354446` reverified protected sources and imported only `game400-a.js`, `game400-b.js`, `title-island-concepts/index.html`, and `index.html`. Exact accepted product bytes were promoted to `main` as `5003f8c8e8421713f49374ab6b8c39d2af1cc3f1`.
- Committed-live run `34868476341` revalidated fresh/returning/completed contextual Home actions, telescope memory recall, purposeful Pippa work behavior, in-game Reduced Motion, and offscreen motion cancellation. Evidence artifact `10358421047`, SHA-256 `269400e89ca880bca3b5080cf7c01ca3ae0df6fa2d9b64367c5c15cf6ef24b93`.
- V05 purposeful domestic actions and U05 contextual Home action were accepted complete here. V06/N05 were partial at this checkpoint and were later closed by the Character/world coherence slice.

Accepted Atlas + Story/Journal coherence checkpoint (2026-09-14):
- TDD RED run `34868949719` failed for the intended missing behavior (`8` legacy Atlas region-dot controls), proving the acceptance test detected the pre-change hierarchy.
- Candidate run `34869403804`, attempt 3 / job `104063446587`, passed exact campaign/accepted-source protection, syntax/static checks, and browser acceptance at 320x568, 390x844, and 430x932. Earlier attempts correctly caught a 320x568 journal containment defect; the final accepted build uses a viewport-height flex journal with internal panel scrolling rather than shrinking text or touch targets.
- Candidate acceptance covers: one chapter previous/current/next control; one full-name route-stretch control; no legacy region dots or five compressed range tabs; 44px minimum chapter/range controls; explicit `restored/current/available/locked` state semantics with non-color badges; visible `reward-working` destination feedback; `Now / Residents / Journey / Cinematics` journal tabs; direct Cinematics access; Arrow-key tab navigation; Large Text growth; short-screen containment; and Little Home regression protection.
- Accepted candidate product commit: `b359b522961f01287dbe1c5a25a60d848c0fdead`. Candidate evidence artifact `10358591068`, SHA-256 `e94c62ea182af3e24feaa59d4772aecb3f6b6c9f1ae722afe497ab47a45c5503`.
- Settled visual-review run `34870429364` verified the exact accepted product bytes and produced post-transition Atlas, Now, and Cinematics captures. Artifact `10358083089`, SHA-256 `2d78f1bc94d9b8d1677bd1010629a27ef1788b3ceaa99343614266607f32b258`. These settled screenshots were manually reviewed and accepted before promotion.
- Promotion run `34870594463` reverified protected sources and imported only `game400-a.js`, `game400-b.js`, `index.html`, `style400-skyway-atlas.css`, `style400-story-theme.css`, and `style400-atlas-progression.css`. Exact accepted product bytes were promoted to `main` as `d9290e333fe41cb624b699259db2c6cc83f421fd`.
- Committed-live run `34870670735` independently revalidated the promoted bytes at all three phone sizes, including Atlas hierarchy/state/arrival behavior, journal containment/direct replay/keyboard navigation/Large Text, and Little Home regression behavior. Evidence artifact `10359290640`, SHA-256 `1b21adc9e94a23c724b48a24d03dcab7d010b1df14697c550f44ecfc60dab349`.
- V13 Atlas hierarchy, V14 restored-vs-available state distinction, V15 visible map repair, and U10 journal structure were accepted complete here. N04 was partial at this checkpoint and was later closed by the Character/world coherence slice.
- Temporary `main` promotion/live workflows were removed after acceptance in cleanup commits `10b165e4bbddf8fc80d1c41fe93e4bb6e4ded6a6` and `c62983028350fed7fd1b7c9363362c421202784c`. One-shot candidate helper-wiring and settled-visual workflows were also removed after their evidence was captured. The candidate branch is validation history only and is not the source of truth.

Accepted Gameplay / Story coherence checkpoint (2026-09-14):
- TDD RED run `34871396998` failed on the intended missing pre-win star-criteria behavior. Candidate run `34871805806` later passed exact campaign/accepted-source protection plus the full 320x568 / 390x844 / 430x932 browser matrix after earlier attempts caught and drove correction of a genuine short-phone controls overflow.
- Accepted candidate product commit: `d2639e7`. The accepted six-file product is `game400-a.js`, `game400-b.js`, `story-theme400.js`, `style400-story-theme.css`, `index.html`, and `pass3-chapter8-aurora.js`. Candidate artifact `10362672460`, SHA-256 `2ce5522db5357e1a59936ef6ebe592c3768c6f6652e36940c3dd9ae593ac177a`.
- Settled visual-review run `34880369639` verified product provenance and captured clean short-phone gameplay, rejected-blocker feedback, and a regular Story Card with automatic overlays deliberately closed through the real runtime. Artifact `10363160590`, SHA-256 `9b2e5380ad8a899834a9a6d66fbd5e919b5df704e6446dfcb4583b8581269392`; screenshots were manually reviewed before promotion.
- Promotion/live run `34880640526` required the exact prior `main` base, rechecked protected sources, imported only the six accepted product files, and promoted them as `4f9e27b01f3a0ae158ee44c8ac36b4c11e2fa033`. Its fresh committed-main browser job independently revalidated the accepted behavior. Live artifact `10362788052`, SHA-256 `d6f73cb853179295b6c6b9115d91e4654eec4404323b1a171c1cead2d3088ead`.
- Committed-main closure run `34881048866` targeted the remaining source wording for V01/V10: Levels 201 and 366 keep decorative props behind rules space, and switch/door/rail/turn identity remains readable under achromatopsia, protanopia, deuteranopia, and tritanopia emulation. Artifact `10363266549`, SHA-256 `764e8dfb2782d9b286e13691dd9347714c966066600eb8ddc4ad77400acebbd0`; representative captures were manually reviewed.
- V01 quiet board floors, V09 readable nests, V10 mechanic-state causality, U09 mastery copy, V16 story postcards, and V17 chapter reward were accepted complete here. N04/V06/N05/V07/V12 were partial at this checkpoint and were later closed by the Character/world coherence slice.

Accepted Ending closure checkpoint (2026-09-14):
- **ACCEPTED.** TDD RED run `34881984533` failed for the intended missing behavior (`short: missing living-Skyway ending stage`). Final candidate run `34884153884` passed the three-phone ending contract and OS/in-game Reduced Motion on exact accepted product commit `e3ac2e999c4781e8f4e9789552a5025e93b3466e`; candidate artifact `10363603745`, SHA-256 `faa23518054ba810b16d0ee25116736fc22832192ef28c5b157b748dd7b7d23a`, was manually reviewed.
- Promotion/live run `34886703644` required exact promotion base `540f5af60d9b4fe3ea2078a1f7956e42d4eaf885`, rechecked all protected accepted sources, imported only `index.html` and `style400-ui.css`, and promoted exact accepted ending bytes to `main` as `96aead97f525a25061f9b3e2b60b2a8263b2509d`.
- The same run fresh-checked committed `main` and independently passed 320x568 / 390x844 / 430x932, canonical Little Home reuse, six-node living-network semantics, network-to-home sequence, exact concise copy, Home-first action, title/viewport containment, runtime-error checks, and OS/in-game Reduced Motion. Live artifact `10365415386`, SHA-256 `e26903228bbaadcf39868f85c00d08a0e1e036ca2da1be66af5f64f14928a26e`.
- V18 ending art quality and N06 visual ending thesis are accepted complete. V19 remains partial for separate presentation-system consolidation.

Accepted Character/world coherence checkpoint (2026-09-14):
- Final candidate run `34891362319` passed exact protected-source/syntax checks and the full 320x568 / 390x844 / 430x932 browser matrix for the remaining character/world contracts: four distinct N04 information roles, first-return resident use for all seven keepsakes plus memory activation, Pip/Tansy authored behavior, line-sensitive expressions, recurring Story/Atlas fixture identity, all 40 authored Atlas destinations, Reduced Motion, and offscreen Home cancellation.
- Accepted candidate product commit: `c4cab777dceb1b2162efa42fbd2fa126ef57b84a`. Candidate artifact `10366808335`, SHA-256 `8072f13cfe402bd987b9f6ae0d9337ac03c0746e0ea2f33389ba9d5ffe0d3b75`.
- Visible Atlas evidence was recaptured with Level Select actually active. Run `34891909689`, artifact `10366838850`, SHA-256 `72370ab5f30882d0c2c276c383a691ba4d9c674f37250d7efd92cff0f43b41bf`; representative porch, market arch, Prism lookout, map gallery, relay, Crown beacon, short-phone, and wide-phone captures were manually reviewed and accepted.
- Promotion run `34892253671` rechecked protected sources and imported only `story-grounding400.js`, `gameplay-story-rail400.js`, `story-theme400.js`, `game400-a.js`, `game400-b.js`, `title-island-concepts/index.html`, `style400-story-theme.css`, `style400-skyway-atlas.css`, and `index.html`. Exact product bytes were promoted to `main` as `c7d78aa61080513ac6f7ea31d9e82d7cd4ee2a4e`.
- Committed-main run `34892359817` independently revalidated the exact promoted bytes. Artifact `10367985257`, SHA-256 `0ad54fffb528a8f8733cbe974ca3059e81442f81c51984afe07a7556bb017708`. N04, V06, N05, V07, and V12 are accepted complete.

Presentation/accessibility consolidation checkpoint (2026-09-14):
- **ACCEPTED.** TDD RED run `34893568352` proved the intended missing presentation/accessibility behavior across short/compact/phone/wide/tablet/landscape layouts before implementation.
- Accepted candidate product commit: `e02ba6a9b9ee8925b73e915a17712852da103023`. The slice consolidates cinematic presentation/cast identity in existing core layers, removes obsolete broad cinematic overrides, adds deterministic modal focus entry/trap/Escape restoration, honors in-game Reduced Motion for gameplay Web Animations, adds safe short/tablet/landscape layouts, and keeps the accessible Memories path at a 44px action target minimum. A genuine tablet focus-restoration race was found during certification and fixed synchronously before acceptance.
- Settled visual-review run `34896742670` verified exact accepted bytes and produced clean Home, Memories, Journal, landscape gameplay, cinematic, and ending captures after screen transitions had fully settled. Artifact `10369157824`, SHA-256 `d0c1d3ac0bac2c1f5979c5b1919e30f3b2778277a0af6cc1b70759542ca55a68`; the representative captures were manually reviewed and accepted.
- Promotion run `34896935069` rechecked authored campaign/protected accepted sources and promoted exact candidate product bytes to `main` as `a998e095dd710028cdca6e028bc0047c71aeed3c`. Committed-main run `34897014938` independently passed the same six-viewport presentation/accessibility matrix on the promoted bytes.
- The canonical cinematic source contains 25 beats and 56 scripted utterances; certification derives the expected turn count from the source rather than a hard-coded total.

Final Pass 5 browser-addressable certification (2026-09-14):
- **COMPLETED.** Final run `34898523134` passed with zero failures while guarding the exact accepted product bytes at `a998e095dd710028cdca6e028bc0047c71aeed3c`. Evidence artifact `10369612799`, SHA-256 `22e90d782e365232305be7dc98b3fd175c041b8ae53cbd5dc804b248e6231501`. Earlier Pass 5 attempts (`34897697765`, `34897918110`, `34898064440`) exposed harness-only selector/scope defects; those were corrected without changing product code.
- Coverage: 320x568, 360x800, 390x844, 430x932, 768x1024 tablet, and 844x390 landscape; all 400 starting boards; all 40 chapter/range material variants; all 40 authored movement starts/results plus seven earned-knowledge chapter boundaries; fresh onboarding, skipped opening, returning player; isolated Daily/replay/campaign progression; all four films / 25 beats / 56 canonical utterances; non-color identity; keyboard/modal focus restoration; semantic journal tabs/panels; Large Text; audio controls/persistence/interruption; 71 loaded assets; and browser performance telemetry.
- Pass 5 measured zero running gameplay animations under Reduced Motion in all six viewport classes and no tested viewport/control overflow. The later second-review finishing pass raised primary Journal body copy from the independently measured 10.8px / 12.5px to 14px Normal / 16px Large.
- Browser telemetry from the certification environment: navigation/load about 165.3ms; synthetic 400-board render loop about 117.4ms; 120 frame samples at about 16.7ms median / 16.7ms p95 / 16.8ms max; about 4.30MB used JS heap; 44 measured resources totaling about 0.93MB transferred. These are browser-runner measurements, not physical-phone performance claims.

Remaining closure work:
- **DEFERRED ART DIRECTION:** S4 material consistency remains a subjective optional refinement. The second review specifically notes flatter Story-card props, simpler ending-network houses, and small Atlas landmarks. Do not restart the engine or broad presentation stack for this item; revisit only if the user chooses another art-direction pass after real-device playtesting.
- **External-only, explicitly UNVERIFIED:** real physical-phone touch/performance/battery behavior; genuine iOS Safari hardware behavior; exhaustive assistive-technology testing; and subjective real-speaker/headphone audio mixing/listening. These do not reopen the completed browser-addressable functional implementation.

Protected systems:
- Exact authored puzzle definitions/solutions in `campaign400-1.js` through `campaign400-8.js` must not change.
- Preserve accepted Pass 3 chapter art direction unless an audit item specifically requires a presentation-layer correction.
- Preserve all R1-R5 behavior, accepted Pass 4 cinematic dialogue/navigation behavior, accepted Little Home contextual/memory/motion behavior, accepted Atlas/journal hierarchy/state/accessibility behavior, accepted Gameplay / Story behavior, and accepted ending network/Home-first/Reduced-Motion behavior.

Implementation/validation contract:
- Read the original audit, first implementation review, and second implementation review above when reconciling an item; do not rely on the acceptance matrix as a substitute for their original wording.
- Reconcile every original audit ID (`V01`-`V20`, `N01`-`N06`, `U01`-`U11`, `A01`, `P01`) and both documents' Pass 1-5 acceptance language against current code/runtime.
- Distinguish functional COMPLETED items, subjective/deferred art-direction recommendations, and EXTERNAL-only checks with concrete evidence; do not use “improved” as closure.
- Use candidate-first browser validation for broad presentation changes, then committed-live validation before cleanup.
- Protect campaign/story canon and authored solutions with exact diff/hash checks.
- Manually review representative settled screenshots, especially cinematics, ending, Home, Atlas, journal, dense boards, Large Text, and reduced motion.
- Remove temporary workflows/helpers before final closeout.
- Final exact head must pass GitHub Pages and the permanent repository-access guard.

Next action: diagnose and fix the reproducible 360×800 Opening overlap where an arrived prop covers Rowan, then rerun the complete shipped `npm test` command on committed `main`. Only after that browser regression is green should real-device touch/safe-area/performance testing resume. Genuine iOS Safari, exhaustive assistive-technology testing, subjective speaker/headphone listening, and optional S4 art-direction work remain separate follow-ups.

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
- The accepted Little Home coherence slice is promoted and protected.
- The accepted Atlas + Story/Journal coherence slice is promoted and protected; current product source is on `main`, not the candidate branch.
- The accepted Gameplay / Story coherence slice is promoted and protected; its later character/world follow-up closed N04/V06/N05/V07/V12 without changing authored puzzle definitions.
- The Ending closure slice is promoted and protected; V18/N06 are complete on committed `main` with candidate, manual-visual, committed-live, and Reduced Motion evidence.
- The Character/world coherence slice is promoted and protected; N04/V06/N05/V07/V12 are complete on committed `main` with candidate, manual Atlas visual review, and committed-main browser evidence.
- The bounded Astra second-review finishing pass is promoted and protected on `main` as `4e18050462d5b58d326a35130b4e9ec6ebe231c9`; S1-S3 are accepted with candidate, manual stage-only visual review, Reduced Motion, typography, and committed-main evidence. S4 is deliberately deferred art direction.
- `LATCHLINGS_VISUAL_STORY_AUDIT.md`, `LATCHLINGS_IMPLEMENTATION_REVIEW.md`, and `LATCHLINGS_SECOND_REVIEW.md` are the canonical repository source documents for the Astra review/closure effort.
- `ASTRA_AUDIT_ACCEPTANCE_MATRIX.md` is the living repository-side item-by-item reconciliation of those source documents against current implementation evidence.
- Prior detailed development history is preserved in the dated `DEVELOPMENT_HANDOFF_ARCHIVE_*` files.
- `LEVEL_SELECT_ART_DIRECTION.md` and `STORY_BIBLE.md` remain durable art/story references.

## Story Staging / Game Polish final verification (2026-09-25)

**Local acceptance: PASS; remote CI pending.** This closes the remaining implementation work from the approved execution guide on `codex/audit-polish-20260924`, continuing from the requested source commit `ee01e75`. Product verification below includes the 320×568 Homeward label correction committed as `fa4f8f9355e4cebf1ecfe98898127a4df765b101`. Do not mark the branch complete until GitHub game validation and the repository-access guard pass on the pushed commit. No merge or deployment is authorized or performed.

Completed scope and final safeguards:
- The 320×568 Large Text board/Route Tip gap is preserved by a reliable layout margin and a short-phone copy cap. The board/rail overlap assertions remain enabled and require at least 2 CSS px of clearance at the previously failing viewport; no assertion was weakened.
- Story Staging Tasks 1–4 are complete: Opening source/destination labels and map handoff, measured Across-to-porch route, distinct connected dated maps, and labeled Homeward report → anchor → window → redraw network. Small-phone labels were enlarged/positioned and checked against residents, landmarks, paths, and dialogue.
- Task 5 rewards at Levels 50/100/150/200 remain earned-only, brief, immediately skippable, and settled immediately with Reduced Motion. The Level 50 basket now remains visibly at its mailbox after the vignette, including replay and Reduced Motion.
- Task 6 removes the fixed Level 400 CSS trajectory. The parcel path is measured from the final Little Home node to the actual porch in the canonical iframe; readiness, resize, late load, missing landmark fallback, fallback repositioning, recovery, and no-false-arrival behavior are covered. Completion actions stay usable.
- Preserve all 400 level definitions, solutions, moves/stars, tap-per-line dialogue, no narrator voice, no Undo, and the accepted pre-Astra puzzle controls. The eight campaign hashes below match the recorded Task 0 values exactly.

Commits in this continuation: `030dbd1` earned reward vignettes; `4171868` small-phone labels; `515973d` measured final parcel; `07c9958` phone story/board clearance; `7f68b03` review fixes for the settled mailbox pose and bounded/resilient iframe fallback; `a63e2c7` CI browser-test synchronization; `51e295a` local-verification handoff; `fa4f8f9` 320px Homeward label placement.

Final local verification: product implementation and CI-sensitive fixes on `fa4f8f9355e4cebf1ecfe98898127a4df765b101`; prior test synchronization commit `a63e2c7be284271253bb77ad767f19c2abbad09e` is test-only. No campaign files changed.
- `$env:CI='true'; npm test` — **PASS (exit 0)** on the exact tracked tree committed as `fa4f8f9`. All suites passed, including the 21-step Opening scene, all 38 later-film utterances, phone readability, all 400 campaign routes, progression/Daily isolation, hints, story staging, rewards, and Level 400 ending behavior.
- `$env:CI='true'; node tests/opening-world-coherence.browser.cjs` — **PASS**. Its travel assertion now records actual browser animation frames from immediately before the tap, so CI timing cannot make a completed animation masquerade as a stationary one; the requirement for visible travel toward the measured endpoint remains intact.
- `$env:CI='true'; node tests/story-staging.browser.cjs` — **PASS**; full capture directory: `C:\Users\Max\AppData\Local\Temp\latchlings-story-staging-JsOd2e`. This includes the dated-map entrance-animation wait and 4px gap check, as well as Homeward label bounds/route/landmark/dialogue/resident checks.
- `$env:CI='true'; $env:STORY_STAGING_HOMEWARD_ONLY='true'; node tests/story-staging.browser.cjs` — **PASS** for all six Homeward configurations and resize checks; focused captures: `C:\Users\Max\AppData\Local\Temp\latchlings-story-staging-SLgFqU`. Manually inspected `homeward-layout-320x568.png`: MEADOWS is inside the stage, above the route fan, readable, and not covering a resident or landmark.
- `$env:CI='true'; node tests/progress-daily.browser.cjs` — **PASS** (also passed as part of the full suite). The valid-import test delays `File.text()` and waits for the actual asynchronous confirmation summary before asserting; it does not weaken the confirmation or persistence checks.
- `$env:CI='true'; node tests/phone-stage-certification.browser.cjs` — **PASS**, 180 settled captures across 320×568, 360×800, 390×844, 430×932, and 844×390; Normal/Large Text with OS and in-game Reduced Motion. This was rerun after the Homeward correction. Capture filename pattern: `%TEMP%/latchlings-phone-stage-*.png`. Overflow, stage/action visibility, gameplay controls, Settings touch target, Ending actions, and focus restoration all passed.
- `node tests/story-payoffs.browser.cjs` — **PASS** in the full CI-mode suite; latest captures: `C:\Users\Max\AppData\Local\Temp\latchlings-story-payoffs-JTVXJf`. Checks include earned rewards, immediate actions, Reduced Motion/replay, measured in-flight/resized porch landing, stalled-frame fallback, fallback repositioning, recovery to the canonical porch, and no false arrival.
- Story-library UI check in Chromium — **PASS**: opened all four entries through Story → Cinematics, manually advanced each film by exactly its authored line count, verified focus returned to each replay card, then used Skip and verified focus return; no browser errors.
- `git diff --check` — **PASS**. All eight campaign files compare **UNCHANGED** with `ee01e75` after normalizing checkout line endings; the worktree SHA-256 values match the Task 0 table above (including `campaign400-3.js`'s Windows-checkout hash). All authored puzzle definitions/solutions and move/star rules remain intact.
- Manually reviewed representative 320px Reduced Motion reward/ending captures, the 390px in-flight Level 400 landing, and the 320×568 Large Text Level 1 capture. They show the reward at its mailbox, parcel route into the Little Home porch, readable protected D-pad, and a clear board/Route Tip gap.

Still external-only and **UNVERIFIED**: physical iOS Safari and Android touch/safe-area/performance/battery behavior; exhaustive assistive-technology/screen-reader coverage; and real-speaker/headphone audio mixing/listening. No narrator voice was added. These do not block the browser implementation but remain real-device follow-ups.

Remote CI history: the earlier push of `906999a2b3d8e729c555b0efded0ddded6ad5479` triggered game run `36189942120` and guard run `36189942080`; the guard passed, while the game run exposed the asynchronous progress-import assertion. That test now waits for the actual confirmation summary. Push `51e295a` triggered game run `36195044389` and guard run `36195044333`; the guard passed, while game CI found the 320×568 Homeward MEADOWS label extending left of the scene (x=7.30px). The label is now repositioned in a route-free vertical band without reducing type size or relaxing the geometry assertions. Full CI-mode local tests, the six-case Homeward matrix, the 180-capture viewport/motion matrix, and campaign hash comparisons pass on `fa4f8f9`. **GitHub CI and pushed-file verification for `fa4f8f9` are pending**; record exact new run IDs and mark complete only after both workflows pass and the handoff is verified remotely. Do not merge or deploy without the player's separate instruction. CI's `npm install` step also emitted a non-blocking “1 high severity vulnerability” audit notice; no dependency changes were made in this visual/story task.
