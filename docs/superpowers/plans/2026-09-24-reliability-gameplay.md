# Reliability and Gameplay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make saves durable, Daily approachable, hints honest from the current board, and the shipped browser suite reliable while preserving all 400 puzzles and existing scoring.

**Architecture:** Keep the existing static page and global game runtime. Isolate backup validation and route-hint search in small browser-loaded modules, then connect them through the current Settings/Hint UI. Repair test readiness without weakening geometric assertions; add permanent gameplay coverage and CI.

**Tech Stack:** Static HTML/CSS/JavaScript, Node.js, Playwright, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-24-game-polish-design.md`; execute this plan before `2026-09-24-phone-presentation.md` and `2026-09-24-story-staging.md`.

## Global Constraints

- No Undo button, rollback feature, narrator voice, backend, cloud save, or star-rule change.
- Do not modify `campaign400-1.js` through `campaign400-8.js`; record their SHA-256 hashes before/after.
- Preserve the pre-Astra Reset/D-pad/Hint geometry in `style400-control-restoration.css`.
- Preserve manual cinematic advancement, existing story text, campaign/Daily isolation, and Reduced Motion.
- Follow RED -> GREEN -> full `npm test` for every product behavior task. Commit each independently testable task.
- Start from the approved spec branch; update `DEVELOPMENT_HANDOFF.md` to IN PROGRESS and commit it before the first product-code edit.
- Tests must run at 320x568, 360x800, 390x844, and 430x932 where layout is involved.

## Review Focus

1. Corrupt import or unsupported backup version must not change any existing star, unlock, or cinematic-seen key (Task 3).
2. Storage quota/security failure after a win must keep session progress and visibly report unsaved state (Task 3).
3. A player who has just unlocked a chapter but has not played its mechanic must not receive that mechanic in Daily (Task 4).
4. A hint search that reaches its work limit must say “could not find a hint” rather than “no solution” (Task 5).
5. Fast cinematic taps or slow iframe load must not make tests pass by skipping the actual route/overlap checks (Task 1).

---

## File map

| File | Responsibility |
|---|---|
| `tests/opening-world-coherence.browser.cjs`, `tests/phone-visual-regressions.browser.cjs` | Readiness-aware cinematic assertions. |
| `tests/gameplay-campaign.browser.cjs` | All 400 authored solutions and board/runtime smoke. |
| `tests/progress-daily.browser.cjs` | Backup, save-failure, and Daily behavior. |
| `tests/current-hint.browser.cjs` | Current-state hint search and UI behavior. |
| `progress-backup400.js` | Pure backup create/parse/validation; no DOM writes. |
| `route-hint400.js` | Bounded asynchronous state search over the real move simulator. |
| `game400-a.js` | Runtime save result, Daily selection, and shared state adapter. |
| `game400-b.js` | Settings backup controls, hint presentation, simulator adapter. |
| `index.html`, `package.json`, `.github/workflows/validate-game.yml` | Load new modules and run permanent checks. |

### Task 0: Start the implementation handoff

**Files:** Modify `DEVELOPMENT_HANDOFF.md` only.

- [ ] **Step 1: Record the starting point.** Confirm branch `codex/audit-polish-20260924`, read the current handoff and `AGENTS.md`, record `git rev-parse HEAD`, `git status --short`, and SHA-256 hashes for `campaign400-1.js` through `campaign400-8.js`.
- [ ] **Step 2: Mark IN PROGRESS.** Add the approved scope, protected behavior, exact baseline `npm test` failures, planned three-stage order, and current branch/commit. Do not state any game fix is complete.
- [ ] **Step 3: Commit before product edits.** Commit the handoff alone as `docs: start approved game polish implementation`.

### Task 1: Fix the existing test-readiness failures

**Files:** Modify `tests/opening-world-coherence.browser.cjs:28-35,83-115,130-163`; modify `tests/phone-visual-regressions.browser.cjs:12-31,41-48`.

**Interfaces:** Consumes `.cin-opening-continuous[data-geometry-ready="true"]`, SVG routes, `Element.getAnimations()`. Produces deterministic tests; no product API.

- [ ] **Step 1: Reproduce the baseline failures.** Run `npm test`, then both named tests separately. Record the exact failing assertion/exception in `DEVELOPMENT_HANDOFF.md` under IN PROGRESS. The known local baseline is a variable “visibly travels” turn failure and an empty-path `getPointAtLength` exception.
- [ ] **Step 2: Change test setup to wait for real geometry.** Before route inspection, use:

```js
await page.waitForFunction(() => {
  const root=document.querySelector('.cin-opening-continuous');
  return root?.dataset.geometryReady==='true' &&
    ['basket','water','play'].every(name =>
      document.querySelector(`#opening-route-${name}`)?.getTotalLength()>0);
});
```

- [ ] **Step 3: Replace fixed 90/100ms animation snapshots.** For a travel turn, wait for its mover animation to enter `running` **or** a verified Reduced Motion endpoint; sample mover center at two animation frames and assert it changes toward the correct path endpoint. After the duration, assert mover-to-miss/target distances as before. Keep every existing resident-overlap, endpoint, and control-geometry assertion. Do not replace a failed visual assertion with mere DOM existence.
- [ ] **Step 4: Verify and commit.** Run both targeted tests five times, then `npm test`; require all runs exit 0. Commit only the test changes with `test: wait for opening geometry and motion state`.

### Task 2: Make all authored puzzle solutions a permanent gate

**Files:** Create `tests/gameplay-campaign.browser.cjs`; modify `package.json`; create `.github/workflows/validate-game.yml`.

**Interfaces:** Consumes `LEVELS`, `simulate(pi,d)`, `currentLevel`, `positions`, `doorMask`. Produces a permanent campaign-data smoke test without changing boards.

- [ ] **Step 1: Write a failing test and prove it detects an invalid route.** Copy the minimal local HTTP server/Playwright harness from `tests/opening-board-header.browser.cjs`. For each level, initialize the runtime state, apply each authored move through the real simulator, update `positions` and `doorMask`, and assert every piece is captured, solution length equals `optimal`, and length does not exceed `moveLimit`:

```js
const result=await page.evaluate(() => LEVELS.map(lev => {
  currentLevel=lev.id;
  positions=lev.pieces.map(piece=>piece.pos.slice());
  doorMask=0;
  for(const [pi,dir] of lev.solution){
    const move=simulate(pi,dir);
    if(!move)return {id:lev.id,error:'invalid authored move'};
    positions[pi]=move.capture?null:[move.r,move.c];
    doorMask=move.mask;
  }
  if(positions.some(Boolean))return {id:lev.id,error:'unfinished'};
  if(lev.solution.length!==lev.optimal || lev.solution.length>lev.moveLimit)
    return {id:lev.id,error:'solution metadata'};
  return null;
}).filter(Boolean));
assert.deepStrictEqual(result,[]);
```

This is a new regression gate for existing content, so it may pass immediately. To prove the gate is sensitive, temporarily make one assertion expect 399 verified boards, confirm the test fails, then restore it; do not edit campaign data to prove the test catches failure. Add a normal Level 1, a gated Level 201, and a switched Level 301 browser-start smoke check.
- [ ] **Step 2: Add the test to `npm test`.** Keep the six existing suites, then append `node tests/gameplay-campaign.browser.cjs`. Add a GitHub Actions workflow on push/PR with Windows or Ubuntu Node 22, `npm install`, `npx playwright install --with-deps chromium` when required, and `npm test`.
- [ ] **Step 3: Verify and commit.** Run `node tests/gameplay-campaign.browser.cjs` and `npm test`. Commit test/workflow/package changes as `test: gate all 400 campaign routes`.

### Task 3: Add validated progress backup and honest save status

**Files:** Create `progress-backup400.js`, `tests/progress-daily.browser.cjs`; modify `index.html:130-145`, `game400-a.js:20-46`, `game400-b.js` Settings and Reset Progress functions.

**Interfaces:** `window.LatchlingsProgressBackup.create(progress,seen) -> object`; `.parse(jsonText) -> {progress,seen}` or throws; `saveProgress() -> boolean`. The Settings buttons call the pure API and perform all storage writes only after validation and confirmation.

- [ ] **Step 1: Write RED browser tests.** Test a backup round trip for unlocked level, sparse stars, and known cinematic IDs; reject malformed JSON, wrong version, `unlocked=401`, star value 4, and an unknown film ID without changing storage. Override `Storage.prototype.setItem` for the campaign key to throw and verify a win does not lose in-memory progress and displays an unsaved warning. Verify Reset Progress copy contains no “verified campaign”. Run `node tests/progress-daily.browser.cjs` and observe the expected failures before product edits.
- [ ] **Step 2: Implement the pure format.** Use a narrow versioned schema:

```js
{format:'latchlings-progress',version:1,
 campaign:{unlocked:12,stars:{'1':3,'2':2}},
 cinematics:['opening']}
```

Validate `unlocked` as an integer 1..400; star keys as integer level IDs 1..400 with values 1..3; seen IDs against `Object.keys(LatchlingsCinematics.CINEMATICS)`. Reject unknown format/version, unknown schema fields, and stars above unlocked; permit a Level 400 star when `unlocked===400`. Daily history/preferences are not in the file. Serialize with `JSON.stringify(...,null,2)` and a `.json` download link made from a temporary Blob URL, revoked after use.
- [ ] **Step 3: Connect Settings UI and storage.** Add `Export progress` and `Import progress` buttons with a hidden `type=file accept=.json,application/json` input. Read selected file as text, call `.parse`, show a confirmation summary (unlocked level and star count), and only then write campaign and cinematic keys. Snapshot both old storage values first; on a write failure, attempt to restore both values. Do not replace in-memory state unless both new writes succeed. If restoration also fails, say explicitly that local storage may be inconsistent and offer export of the still-intact in-memory session. Change `saveProgress` to catch `setItem` failure, return `false`, update Home, and show a persistent-but-dismissible unsaved banner with Export. Replace the developer-facing Reset sentence with plain language.
- [ ] **Step 4: Verify and commit.** Run targeted tests, the full `npm test`, and a manual browser backup/export/import round trip. Commit as `feat: protect campaign progress with backup and save warnings`.

### Task 4: Tier Daily selection by learned mechanics

**Files:** Modify `game400-a.js:37-40,198-212`; update `tests/progress-daily.browser.cjs`.

**Interfaces:** `dailyRouteInfo(date=new Date(), campaignProgress=progress) -> {key,level,tier}`. `startDailyPuzzle()` consumes it; Daily save keys remain separate.

- [ ] **Step 1: Write RED cases.** Fix the clock in tests. A fresh player must draw only from Levels 1-10; unlocked 101 with no Level 101 star must not draw an anchor board; an advanced player must have access to learned later mechanics. Repeated calls for the same date+tier must return the same level. A Daily clear must not change campaign stars or `unlocked`.
- [ ] **Step 2: Implement deterministic selection.** Compute `highestCompleted=Math.max(0,...Object.keys(progress.stars).map(Number))`, then use a curated pool for `0..10` and a completed-level cap thereafter. Build a tier index from the highest fully introduced mechanic chapter, not `progress.unlocked`; choose with a stable integer date hash plus tier, modulo the eligible pool length. Return a short tier label for the Daily header/rules entry. Never select an unplayed new-mechanic board merely because it is the unlocked next level.
- [ ] **Step 3: Verify and commit.** Run targeted test and `npm test`; manually launch Daily with fresh and Chapter 7 progress. Commit as `feat: match daily puzzles to learned mechanics`.

### Task 5: Give a current-board hint without Undo

**Files:** Create `route-hint400.js`, `tests/current-hint.browser.cjs`; modify `index.html:130-145`; modify `game400-b.js:16-18,52`.

**Interfaces:** Extract `simulateState(lev,positions,mask,pi,dir) -> move|null` with no DOM/global mutation; `simulate(pi,dir)` delegates to it. `window.LatchlingsRouteHint.findNext(lev,{positions,doorMask,remaining},{maxStates}) -> Promise<{status:'found',pi,dir}|{status:'impossible'}|{status:'inconclusive'}>`.

- [ ] **Step 1: Write RED tests.** Use an authored board with a valid noninitial state to require a legal next hint that reaches a solution within `remaining`. Test a proven exhausted move budget yields `impossible`, and `maxStates:1` yields `inconclusive` unless the initial state is terminal. Test an untouched board returns the first authored move quickly. Assert the UI never exposes the entire route and the hint highlight persists after the modal closes.
- [ ] **Step 2: Extract the real simulator.** Move only the pure route calculation from `simulate` into `simulateState`; preserve gate/rail/turner/door/switch order exactly. Re-run the 400-solution test before adding search. Do not alter level arrays, move cost, or star evaluation.
- [ ] **Step 3: Implement bounded breadth-first search.** Encode state from ordered piece positions plus door mask; expand live pieces in index order and directions `U,D,L,R`; skip invalid/no-op moves and visited states; stop at `remaining` depth. Work in short event-loop slices so Hint does not freeze the screen. Return `impossible` only after fully exploring all states within the remaining budget; return `inconclusive` on the explicit state/time cap. At the untouched board, use `lev.solution[0]` without search.
- [ ] **Step 4: Connect the existing Hint UI.** While searching, show a cancellable “Finding a route…” state. On `found`, name only the next piece/direction and apply existing highlight. On `impossible`, explain that the current position cannot finish within the remaining moves and offer Reset. On `inconclusive`, say a hint could not be confirmed and offer Reset or Keep Playing. There is no Undo control and no star-rule change.
- [ ] **Step 5: Verify and commit.** Run current-hint test, 400-solution test, and `npm test`; manually inspect a late switch/door puzzle for responsiveness. Commit as `feat: hint from the current route state`.

### Task 6: Reliability-stage closeout

**Files:** Modify `DEVELOPMENT_HANDOFF.md` after verification; no campaign file changes.

- [ ] **Step 1: Run fresh verification.** Run `npm test`; check `git diff --check`; compare all eight campaign SHA-256 hashes to the pre-change hashes; run `git status --short`; inspect GitHub Actions on the committed branch.
- [ ] **Step 2: Record evidence, not promises.** Add test command, result counts, browser viewport coverage, backup/Daily/hint evidence, any external-only gaps, and the exact commit SHA to the handoff. Leave overall work IN PROGRESS because the phone/story plans remain.
- [ ] **Step 3: Commit handoff update.** Commit as `docs: record reliability and gameplay verification`. Do not merge to `main` yet.
