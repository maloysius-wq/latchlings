# Curated Campaign Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Levels 51–400 into unique, progressively taught puzzles, ending with a demanding mastery-only Aurora.

**Architecture:** Keep the static `_L` campaign format and shipped movement engine. Offline CommonJS tools load the actual transition function, prove candidates, detect repeats and export curated boards; a separate acceptance manifest records design decisions and evidence. Author and accept one chapter at a time, then verify compatibility and the rendered campaign.

**Tech Stack:** Existing JavaScript, Node.js 22, CommonJS, `node:assert/strict`, Playwright and GitHub Actions; no new runtime dependencies.

**Spec:** `docs/superpowers/specs/2026-10-05-campaign-rebuild-design.md` (player approved).

## Global Constraints

- Preserve 400 numbered slots, eight 50-level chapters, region identities, story beats, reward boundaries, the Level 400 homecoming, tap-per-spoken-line dialogue, no narrator voice, no Undo, and accepted pre-Astra Reset/D-pad/Hint controls.
- Keep Chapter 1 exactly as shipped; SHA-256 `8F3F99F27B3CEA194CD41F8C45F1802BC080B5D423B9F03AD0D465A57433A003`.
- Preserve scoring: three stars at `movesUsed <= optimal`, two at `<= optimal + 1`, otherwise one for a completed board within budget. Preserve every slot's baseline `moveLimit - optimal` margin.
- Keep existing progress and backup schemas unchanged: campaign `{unlocked, stars}`, existing keys, version-1 backup parsing, cinematics seen flags and Daily isolation. No reset or destructive migration.
- No runtime random generator, new movement rule, tightened allowance or difficulty inferred from move count alone.
- Use 5×5–7×7 boards and ordinarily two or three pieces. Four pieces require complete proof and phone clarity. Keep Level 366 a dense 7×7 stress board.
- No canonical duplicate of any accepted board, including preserved Chapter 1. Related local teaching contrasts require materially different decisions and recorded rationale.
- No merge/deployment without separate release approval. Preserve unrelated `debug.log` and `test-artifacts/`.

## Review Focus

1. Solver resource exhaustion must remain explicitly unproven, never become a claimed optimum (Task 1).
2. Reflection, identity renaming and switch-link renaming must not hide repeated puzzles (Task 2).
3. A valid intended route can coexist with an easier bypass; relevance must inspect alternatives, not only that route (Tasks 2–9).
4. Returning players must retain stars/unlocks and not replay already-seen rewards or films (Task 10).
5. Daily after learning rails but before turners must not reveal an untaught mechanic (Task 10).

## File and Interface Map

- `tools/campaign/runtime.cjs`: load exports and the shipped movement function in a VM; no product-engine refactor.
- `tools/campaign/solve.cjs`: complete breadth-first search with explicit resource/depth results.
- `tools/campaign/fingerprint.cjs`: canonical and terrain fingerprints.
- `tools/campaign/review.cjs`: route witnesses, comparisons and manifest validation.
- `tools/campaign/export.cjs`: deterministic `_L` encoding and chapter export validation.
- `tools/campaign/accept.cjs`: command-line acceptance/report entry point.
- `docs/campaign/baseline.json`: frozen starting slot margins and Chapter 1 hash.
- `docs/campaign/acceptance.json`: review records for all 350 reviewed slots.
- `docs/campaign/authoring/*.json`: decoded curated input, one file per rebuilt chapter.
- `tests/campaign-tools.cjs`, `tests/campaign-design.cjs`: tools and final campaign contracts.
- `campaign400-2.js` through `campaign400-8.js`: runtime boards; never edit `campaign400-1.js`.
- `game400-a.js`: narrowly scoped `chapterNote` and Daily eligibility updates.
- Existing browser suites remain authoritative for controls, clearances, story, saves and rendering.

Shared types (plain JavaScript objects, documented with JSDoc): `Level` is the decoded `_L` object; `State = {positions: ([number,number]|null)[], doorMask:number}`; `Route = [number,'U'|'D'|'L'|'R'][]`.

`ReviewRecord = {id, chapter, local, stage, intention, prerequisites, focus, decision, baselineMargin, canonical, proof, witnesses, comparisons, contrastWith, rationale, visualEvidence}`. `decision` is `retain` or `replace`; `stage` is `intro`, `practice`, `combine`, `planning` or `capstone` (Aurora uses its five specified bands). Proof contains status, optimum, states and solver settings; witnesses contain replayable state/next-move records, not prose alone. `comparisons` records bypass searches and near-clone review disposition. `visualEvidence` records inspected captures or explicitly pending review.

### Task 1: Establish reproducible baseline and trustworthy shortest-path tools

**Files:** Create `tools/campaign/runtime.cjs`, `tools/campaign/solve.cjs`, `docs/campaign/baseline.json`, `tests/campaign-tools.cjs`.

**Interfaces:** `loadCampaign(root) -> {levels, simulateState}`; `solve(level, simulateState, {initialState?, maxStates, maxMs, maxDepth?, forbidHelperStops?}) -> {status:'solved'|'unsolvable'|'depth-exhausted'|'unproven', route?, optimum?, states}`. Unsolvable requires exhausting the reachable graph; depth-exhausted only disproves solutions within the bound.

- [x] Add failing tests named `matchesRenderedTransitions`, `provesTinyShortestRoute`, `reportsExhaustionHonestly` and `honorsDoorStateAndHelperRestriction`. Assert exact shortest lengths on hand-checkable fixtures; a deliberately tiny state limit returns `unproven`; depth limit cannot return globally `unsolvable`; helper restriction forbids moves with `reason === 'piece'`.
- [x] Run `node tests/campaign-tools.cjs`; expect missing-module failure before implementation.
- [x] Implement VM loading following the existing read-only October 5 audit, using `game400-b.js`'s actual `simulateState` and its documented constants. Fail clearly if source boundaries change. Breadth-first state keys include every piece position/capture plus door mask; reconstruct routes from parent links rather than copying every path into the queue.
- [x] Capture all 400 baseline margins from Git revision `c79f39f`, not an already edited working tree. Add a Playwright comparison of returned movement paths/events/masks for representative mechanics to prevent VM drift.
- [x] Run tool tests and prove all 400 baseline boards (retry unresolved searches with explicitly larger budgets); expect 400 proven optima matching metadata. Record resource settings, not machine-specific completion promises.
- [x] Commit only the named tools, fixtures and baseline: `test: establish campaign baseline and shortest-path proof tools`.

### Task 2: Add originality, relevance and deterministic export gates

**Files:** Create `tools/campaign/fingerprint.cjs`, `tools/campaign/review.cjs`, `tools/campaign/export.cjs`, `tools/campaign/accept.cjs`, `tests/campaign-design.cjs`; extend tool tests.

**Interfaces:** `canonical(level, {terrainOnly=false}={}) -> string`; `reviewLevel(level, simulateState, settings) -> {proof,witnesses,comparisons}`; `validateRecord(level, record, baseline, acceptedLevels) -> string[]`; `encodeLevel(level) -> array`; `exportChapter(levels, chapter) -> string`.

CLI: `node tools/campaign/accept.cjs --chapter N` checks the current chapter against Chapter 1 and earlier accepted chapters; `--all` requires all 350 records. Output nonzero for failure or unproven required evidence. Write reports under `test-artifacts/campaign/`, never overwrite authoring inputs on a failed check.

- [x] Add failing assertions: reflected rails/turners and consistent identity/link renaming share fingerprints; wrong nest association and reversed turner handedness do not. Reproduce baseline duplicate counts (130 excess instances) as baseline-only evidence, not final tolerance.
- [x] Add export round-trip assertion `deepEqual(decodedExport, inputLevels)` and repeat-export byte equality. Assert IDs/chapter/margins and Chapter 1 hash; reject missing design records, exhausted proofs, unreviewed similarity flags and empty mechanic witnesses.
- [x] Run `node tests/campaign-tools.cjs`; expect missing interfaces/assertion failure.
- [x] Implement signatures above. Preserve color/suit distinctions while consistently renaming identities; transform directions/handedness and shared switch/door links correctly. Near-clone output flags geometry and dependency motifs for review; it does not automatically certify originality.
- [x] Implement alternative-route searches: Chapter 2 within-budget and optimal-depth searches forbidding helper stops; feature-removal comparisons and reachable relevant blocking/pass/turn/toggle witnesses for other focus mechanics. Record uncertainty as unproven. Gates may legitimately block wrong choices even if intended travel survives removal.
- [x] Run tools, baseline analysis and export round-trip fixtures; expect PASS. Add final `campaign-design.cjs` assertions for zero duplicate replacements, all 350 complete records and baseline margins; leave final campaign acceptance visibly pending until authored, not silently disabled.
- [x] Commit `feat: add campaign originality and mechanic acceptance gates`.

## Chapter Authoring Cycle (Tasks 3–9)

Each chapter is its own reviewed deliverable. The steps below apply separately to each named task; do not check a task complete merely because another chapter passed.

**Interfaces consumed:** Task 1/2 signatures. **Produced:** 50 decoded authored levels, 50 complete `ReviewRecord`s, deterministic static chapter export and acceptance report.

- [ ] Write failing chapter-contract tests for the task's specific curriculum below. For each stage assert allowed focus/prerequisites, mandatory actual witnesses, unique fingerprints, slot IDs, unchanged margins, proven optimum equal to route length and all captures complete. Assert rationale for numeric pacing exceptions; calculate ten-level medians and review decision-dependency evidence rather than enforcing monotonic move counts.
- [ ] Run `node tools/campaign/accept.cjs --chapter N`; expect FAIL on baseline duplicates/relevance/curriculum gaps or absent records, not infrastructure errors.
- [ ] Author `docs/campaign/authoring/chapter-N.json` deliberately by different solving ideas. Offline candidate search is allowed, but each acceptance record must describe a specific dependency, contrast or setup that the actual board demonstrates. Do not stamp a prose rationale over a random accepted array. Retained boards must pass all new gates. Check every candidate against all already accepted boards, including Chapter 1.
- [ ] For each board prove the optimum, choose a valid shortest route, assign `moveLimit = optimum + baselineMargin`, fill witnesses/comparisons and review similarity flags. Ordinary teaching bands: local 1–5 focus, 6–15 practice, 16–30 earlier-skill combination, 31–45 deeper planning, 46–50 five distinct capstones. Indicative optima 3–6, 5–10, 7–13, 10–18, 12–22 respectively; document justified exceptions without manufacturing extra moves.
- [ ] Export only `campaign400-N.js`. Run `node tests/campaign-tools.cjs`, chapter acceptance, and `node tests/gameplay-campaign.browser.cjs`. Where old Level 201/301 smoke assumptions no longer fit, replace only arbitrary size/piece/full-mix expectations with this chapter's semantic teaching contract; keep valid rendering and route assertions.
- [ ] Inspect early/middle/late boards on 320×568 Large Text and 390×844; play a representative setup/capture sequence through actual controls. Record exact IDs, screenshots and limitations. Use the Task 11 matrix for full closeout.
- [ ] Commit this chapter's authoring JSON, static export, records and tests, using the task's message below. Do not advance to the next chapter with unresolved required proof/relevance failures.

### Task 3: Lanternwood, Levels 51–100

**Status:** Complete at `0d7bd66`; 50 reviewed/proven boards, fresh full 17-suite regression PASS. See the campaign review ledger for exact visual evidence.

**Files:** Create `docs/campaign/authoring/chapter-2.json`, `docs/campaign/acceptance.json`; modify `campaign400-2.js`, `tests/campaign-design.cjs`.

Curriculum: advanced cooperation, not a falsely new helper rule. Introduce relocation, swapping roles and delayed captures through sparse geometry, then connected multi-piece dependencies. No anchors/gates/rails/turners/switches/doors. At least 40/50 boards have no within-budget clear with helper-stop moves forbidden; every non-contrast board has no optimal clear without a helper stop. Explicitly mark remaining purposeful teaching contrasts. Include witness of a helper relocation and of delayed capture in later bands; capstones must not be independent solo errands.

Chapter assertions include `helperRequiredCount >= 40`, no unproven restricted search and non-contrast optimal helper necessity. Commit: `feat: rebuild Lanternwood around advanced cooperation`.

### Task 4: Lodestone, Levels 101–150

**Status:** Complete at `7eb11d3`; 50 reviewed/proven boards, fresh full 17-suite regression PASS. See the campaign review ledger for exact visual evidence.

**Files:** Create chapter-3 authoring JSON; modify `campaign400-3.js`, acceptance manifest, design tests.

Curriculum: relevant exact anchor stops/launch points first; later connected helper relocation and capture order. No later mechanics. Every anchor-focus board has actual route evidence of its stop/launch dependence, not an unused tile. Distinct final five include different helper/anchor relationships. Commit: `feat: rebuild Lodestone anchor progression`.

### Task 5: Masquerade, Levels 151–200

**Status:** Complete; 50 reviewed/proven boards, exact export/retention round-trip, 50-board phone pass and fresh full 17-suite regression PASS. Exact evidence is in the campaign review ledger. Later chapters and final closeout remain pending.

**Files:** Create chapter-4 authoring JSON; modify `campaign400-4.js`, manifest, design tests.

Curriculum: suit permission and nonmatching blocker behavior; distinguish shared suit/different color so players see suit identity. Sparse first five, then anchors and cooperation causally connected to permissions. No color gates or later mechanics. Require reachable solution-relevant permitted/blocked witnesses, including mixed identities; do not demand that deleting every gate destroys the supplied route. Commit: `feat: rebuild Masquerade suit-routing puzzles`.

### Task 6: Prism, Levels 201–250

**Status:** Complete; all 50 individually reviewed replacements, exact export and 200 total records, 50-board phone pass, all 400 rendered routes and fresh full 17-suite regression PASS. Exact evidence and reproduced regression fixes are in the campaign review ledger. Later chapters and final closeout remain pending.

**Files:** Create chapter-5 authoring JSON; modify `campaign400-5.js`, manifest, design tests, Level 201 semantic smoke if needed.

Curriculum: isolate color permission first; teach same color/different suit and same suit/different color, then mixed permissions, anchor setup and helper sequencing. First board need not include a suit gate. No rails/turners/switches/doors. Tests require both identity contrasts across the introduction/practice sequence and actual distinct permission decisions on mixed focus boards. Commit: `feat: rebuild Prism color and suit integration`.

### Task 7: Copperline, Levels 251–300

**Status:** Complete chapter authoring/export: 50 individually reviewed/proven boards, exact regeneration and 250 cumulative records, 50-board phone pass, required tooling/design/all-400 gameplay gates and fresh full 17-suite regression PASS. Earlier anchor cleanup and Tasks 8–11 remain pending. See the evidence ledger; this is not whole-campaign acceptance.

**Files:** Create chapter-6 authoring JSON; modify `campaign400-6.js`, manifest, design tests.

Curriculum: 251–255 rails only as new focus, 256–258 sparse turner introduction, then combined continuous routes with earlier identity/stopping skills. Turn witnesses must show a real bend during a single input; rail witnesses must show useful directional entry/blocking. No switches/doors. Test no turners in 251–255 and meaningful turner use in 256–258. Commit: `feat: rebuild Copperline rail and turner curriculum`.

### Task 8: Stormswitch, Levels 301–350

**Status:** Complete chapter checkpoint: 50 individually traced/proven boards (49 replaced, 323 retained), 300 cumulative records, exact regeneration, all-400 rendered route pass, all 50 actual-control clears at both phone layouts, and fresh full 17-suite regression PASS. See the campaign evidence ledger; Aurora and whole-program closeout are not complete.

**Files:** Create chapter-7 authoring JSON; modify `campaign400-7.js`, manifest, design tests, Level 301 semantic smoke if needed.

Curriculum: clear linked switch/door pair first, then meaningful open/closed states and deliberately delayed toggles; add earlier routes later, not every mechanic on Level 301. Include later witnesses where closing or postponing a change matters, with reachable masks and blocked/pass outcomes. Reject toggles on irrelevant routes. Commit: `feat: rebuild Stormswitch linked-state progression`.

### Task 9: Aurora, Levels 351–400

**Files:** Create chapter-8 authoring JSON; modify `campaign400-8.js`, manifest and design tests.

Curriculum: 351–360 compact expert pairwise interactions; 361–375 three-way combinations; 376–390 future-state planning; 391–395 five different expert interactions; 396–399 four different culminating ideas; 400 unique final network. No new rules. Indicative expert lengths 12–26, not mandatory padding. Level 366 stays dense 7×7. Level 400 must meaningfully combine at least three taught classes with staged cooperation/state reasoning. Require individual review records and screenshots for all final ten, distinct dependency motifs and no canonical equivalent anywhere earlier. Human difficulty/enjoyment review remains explicitly pending unless actually performed. Commit: `feat: author unique Aurora mastery finale`.

### Task 10: Align teaching, Daily and returning-player compatibility

**Files:** Modify `game400-a.js`, `tests/progress-daily.browser.cjs`, `tests/gameplay-campaign.browser.cjs`, `tests/current-hint.browser.cjs`; preserve `progress-backup400.js` schema. Change `story400.js` only if current board-specific teaching copy there actually requires correction; inspect references first.

**Interfaces:** Existing `chapterNote(L)` returns stage-accurate concise copy; existing `dailyRouteInfo(date, campaignProgress)` retains deterministic public shape and separate Daily saves. Eligibility is bounded by completed/introduced mechanic evidence, not merely chapter unlocked.

- [ ] Add failing tests: completed 250/251/255 cannot select turners; completed 256 can use introduced turners but no switch; completing 300 without 301 cannot reveal switches. Test existing boundaries 50/100/150/200/250/300/350 and same-date deterministic selection.
- [ ] Add backup/replay assertions: old `{unlocked:400,stars:{51:3,400:3}}` and seen-scene flags round-trip without schema change; earning one star on replacement 51 cannot lower its old three stars or unlocks; already-seen films/earned keepsakes are not revoked/replayed by loading new content; Daily completion leaves serialized campaign progress identical.
- [ ] Run targeted progress and hint suites; expect new eligibility assertions to expose any current mismatch. If a save assertion already passes, preserve behavior rather than create an unnecessary migration.
- [ ] Implement only necessary staged tip and Daily changes in existing interfaces. Do not invent narrator voices, modify story presentation or add controls. Check old story copy against new cooperation teaching and Level 400 purpose.
- [ ] Test off-authored-route Hint on representative chapter boards with an independently known continuation; report existing solver budget limitations honestly rather than accepting a hint that cannot lead to a within-budget clear. No stale hint after Reset or level change.
- [ ] Run `node tests/progress-daily.browser.cjs`, `node tests/current-hint.browser.cjs`, `node tests/gameplay-campaign.browser.cjs`; expect PASS. Commit `fix: align campaign teaching and Daily with rebuilt progression`.

### Task 11: Whole-campaign verification and review delivery

**Files:** Create `tests/campaign-polish.browser.cjs`, `docs/reviews/2026-10-05-campaign-rebuild.md`; modify `package.json`, `DEVELOPMENT_HANDOFF.md`; finish manifest evidence. Do not commit generated capture directories.

**Interfaces:** New browser suite accepts `--capture-matrix` for extended captures; standard run asserts representative controls/rendering. `npm test` adds tools/design/new browser checks without removing any existing suite. Existing Validate Game workflow runs that exact command.

- [ ] Add browser assertions for accepted board shapes and control-driven solution replay: early/middle/late from each chapter plus all 391–400. Fail on board/Route Tip overlap, clipped controls or stalled inputs. Include dense 366 and actual finale completion; preserve existing porch/action assertions.
- [ ] Run new suite before adjustments; fix causes, not travel/endpoint/clearance/control assertions. Capture 320×568, 390×844, 430×932, Normal/Large Text, motion/Reduced Motion for sampled boards and final ten; inspect settled and in-motion representative frames. If all final-ten input routes are lengthy, chunk inputs and wait for actual settled state, never arbitrary blanket timeout inflation.
- [ ] Run `node tools/campaign/accept.cjs --all`, `node tests/campaign-tools.cjs`, `node tests/campaign-design.cjs`; expect all 400 proven routes, all 350 review records, zero equivalent replacement boards and no required unproven evidence. Re-export authoring inputs and confirm byte equality. Verify exact Chapter 1 hash against baseline; record replacement hashes as new acceptance evidence.
- [ ] Run full `npm test`, `node tests/phone-stage-certification.browser.cjs`, `node tests/campaign-polish.browser.cjs --capture-matrix`, and `git diff --check`; expect PASS with exact counts and report paths recorded. A flake gets investigated, not erased by a later success claim.
- [ ] Record exact reviewed IDs/captures, originality and progression evidence, any unresolved subjective/playtesting/device/audio checks in the review ledger. Keep handoff status concise and link this ledger; do not claim 400 human playtests from automated route replay.
- [ ] Obtain an independent whole-branch review through the chosen execution workflow; resolve findings and rerun affected checks. If reviewer delegation needs authorization, request it rather than fabricate independent review.
- [ ] Commit accepted source/tests/evidence metadata, push `codex/campaign-rebuild-20261005`, verify game and access-guard CI on the exact final SHA through GitHub. Report SHA, acceptance results and remaining external checks. No merge/deploy. If CI fails, fix and repeat exact-head checks before marking software complete.

## Execution Gate

The player approved this written plan and chose **Native**, then explicitly chose the existing dedicated branch and authorized routine development decisions without repeated prompts. Implement sequentially with a final independent review. This does not authorize deployment or unverified completion claims.
