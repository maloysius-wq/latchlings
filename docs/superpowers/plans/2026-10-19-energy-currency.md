# Energy and Currency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the approved earned-only energy/coin economy, with durable paid attempts, priced hints and five-move continuations, without altering the verified puzzles or presentation contracts.

**Architecture:** Put immutable balance/attempt transitions in a small standalone module, serialize durable writes through native IndexedDB transactions, and connect the existing game through a focused adapter. Store once-only completion receipts and a recoverable import journal alongside wallet state; existing campaign/Daily storage remains compatible.

**Tech Stack:** Existing JavaScript, CommonJS Node tests, native IndexedDB, Playwright and GitHub Actions; no new runtime dependency or backend.

**Spec:** `docs/superpowers/specs/2026-10-19-energy-currency-design.md`, approved by the player’s “Well let's proceed then” on October 19. The player approved this plan. Tasks1–7 are implemented; Task8 post-review verification and delivery are in progress. Preserve the previously selected **Native** execution method.

## Global Constraints

- Existing branch: `codex/campaign-rebuild-20261005`; product baseline `85f204524d5e5c529db1ee3a5d5ef6e7a1e3e5bb`, design commit `83698285d52f21ca548bbddbbe05cd1de71812e7`. No merge/deploy without separate release authorization.
- Start/cap 20 energy; regenerate 1 every 900,000ms; charge one on the first valid move of a new attempt. Preview, blocked input, resume and +5-move purchase do not charge energy.
- Start at zero coins. Progression tiers pay 10/20/30 total; improvements pay only the tier difference; non-improving replays pay 2/4/6. A hint costs 15; a five-move extension costs 40. No ads or real-money purchases.
- Same wallet for campaign and Daily, separate reward keys; one Daily progression entitlement per original Daily date. Daily never changes campaign stars/unlocks/story history.
- Preserve all eight campaign exports byte-for-byte against the current verified branch, all 400 IDs and definitions, original star thresholds and actual movement simulation. Never edit `_L` definitions or mutate `lev.moveLimit` to grant a continuation.
- Keep pre-Astra Reset/D-pad/Hint layout and button IDs. No Undo. Preserve 21 tapped Opening lines, no new audio playback, all measured scene endpoints and Little Home porch geometry.
- Preserve Normal/Large Text, Reduced Motion, focus restoration, board/Route Tip separation and existing route/control/clearance assertions. Do not hide or weaken old tests to accommodate energy.
- Native execution means inline implementation with one fresh whole-branch review at the end, not an implementer/reviewer pair per task. Preserve unrelated `debug.log`, `test-artifacts/` and other task workspaces.

## Review Focus

1. A final move canceled by Reset/exit must neither overwrite the replacement board nor pay a win; prove prepare/animation/commit boundaries in Task 3/4.
2. Two tabs racing a 40-coin purchase or a first move must serialize and preserve a single current attempt; real IndexedDB concurrency tests in Task 2/5.
3. A lost localStorage progress write after a committed coin award must recover progress without paying twice; receipt/outbox tests in Task 4.
4. Restoring an older v1 backup or resetting campaign progress must not recreate starter energy or first-clear payouts; migration/import tests in Task 6.
5. An unsupported storage environment, corrupted attempt or interrupted import must not silently produce a new wallet or a half-restored game; recovery tests in Task 2/6.

## Files and shared interfaces

Create only the following focused runtime units; use the existing global-script convention and an optional CommonJS export for the pure core.

- `economy400-core.js`: constants, record/attempt validation, regeneration, immutable transitions and pricing. Export `window.LatchlingsEconomyCore` / `module.exports`.
- `economy400-store.js`: database `latchlings_economy_v1`, object store `state`, singleton key `wallet`; transactions, initialization and import journal. Export `window.LatchlingsEconomyStore`.
- `economy400-game.js`: game/receipt adapter and purchase orchestration. Export `window.LatchlingsEconomy`.
- `economy400-ui.js` and `style400-economy.css`: reserved-space wallet summaries, countdown and accessible economy dialogs. Export `window.LatchlingsEconomyUI`.
- Modify `game400-a.js`, `game400-b.js`, `progress-backup400.js` and `index.html` only at the lifecycle/UI/storage hooks identified below. Do not restructure the movement engine.
- Create `tests/economy-fixture.cjs`, `tests/economy-policy.cjs`, `tests/economy-storage.browser.cjs`, `tests/economy-attempt.browser.cjs`, `tests/economy-rewards.browser.cjs`, `tests/economy-purchases.browser.cjs`, `tests/economy-backup.browser.cjs` and `tests/economy-ui.browser.cjs`.
- Adapt affected existing browser fixtures and `tests/browser-game-ready.cjs`; preserve all existing suites in `package.json`. Record final exact counts instead of assuming the old 37 suites remain the total.

Core vocabulary:

```text
Wallet = {version:1, revision, energy, coins, anchorMs, lastObservedMs,
          accounted:{campaign:{level:stars},daily:{date:stars}},
          attempt:null|Attempt, receipts:{id:Receipt}, importJournal:null|Journal}
Attempt = {id, revision, mode, level, signature, daily:null|{key,level,tier},
           positions, selected, doorMask, movesUsed, extraMoves, energyPaid,
           status:'preview'|'active'|'out-of-moves'|'completed',
           pendingMove:null|PendingMove, paidHint:null|PaidHint}
Receipt = {id,attemptId,mode,level,daily,stars,moves,coins,delivered:boolean}
```

`PendingMove` contains a unique token, expected attempt revision, last settled input snapshot and the actual simulator result; `PaidHint` contains a board key and `{pi,dir}`. A journal contains the validated target backup plus original campaign/seen values and wallet for recovery. Validate safe integers, enum values, IDs, bounds and level signatures; do not trust imported coordinates or arbitrary fields. The signature is a deterministic serialization of the complete immutable level definition, not just the level number.

Exact cross-task API:

```text
Core.createState({now,campaign,daily}) -> Wallet
Core.validateWallet(value) -> Wallet                 // structural wallet validation
Core.validateAttempt(attempt,level) -> Attempt       // actual board/signature validation
Core.settleEnergy(wallet,now) -> {state,nextRechargeAt:null|number}
Core.reduce(wallet,command,{now,level,simulateState}) -> {state,value}
Store.open({indexedDB,dbName?}) -> Promise<Store>
store.initialize({now,campaign,daily}) -> Promise<Wallet> // only if absent
store.read() -> Promise<Wallet>
store.transact(command,context) -> Promise<{state,value}>
store.prepareImport(target,originals) -> Promise<Journal>
store.finishImport(journalId) -> Promise<Wallet>
Economy.ready -> Promise<void>
Economy.read() -> Promise<Wallet>
Economy.effectiveLimit(level) -> number              // authored limit + current extraMoves
Economy.prepareMove({pi,dir,generation}) -> Promise<MoveTicket>
Economy.commitMove(ticket,{selected}) -> Promise<Attempt>
Economy.cancelMove(ticket) -> Promise<void>
Economy.resumeAttempt() -> Promise<boolean>
Economy.retireAttempt() -> Promise<void>
Economy.completeAttempt() -> Promise<Receipt>
Economy.deliverPendingReceipts() -> Promise<void>
Economy.purchaseMoves({requestId}) -> Promise<Attempt>
Economy.purchaseHint({requestId,boardKey,pi,dir}) -> Promise<PaidHint>
Economy.restoreBackup(parsed) -> Promise<boolean>
UI.renderWallets(wallet) -> void
UI.walletDialog(), UI.zeroEnergyDialog(), UI.storageError(error) -> void
```

Core commands are `BEGIN_MOVE`, `COMMIT_MOVE`, `CANCEL_MOVE`, `RETIRE`, `COMPLETE`, `ACK_RECEIPT`, `BUY_MOVES`, `BUY_HINT` and `SETTLE`; each carries its operation/request ID and expected attempt ID/revision when applicable. Read the latest wallet inside the transaction; global wallet revision changes must not invalidate an unchanged attempt merely because its countdown settled. Reject actual stale attempt revisions with explicit error codes. Repeated purchase request IDs return the original outcome without charging again; a distinct request at a new exhausted extension may buy another five.

Store transaction context extends the Core context with optional `signal:AbortSignal` and `isCurrent:()=>boolean`. Check both before writing and abort an uncommitted transaction when its lifecycle signal cancels; never report a successful debit from an aborted transaction. The game adapter publishes committed snapshots through `CustomEvent('latchlings:economy', {detail:wallet})`; UI subscribes in Task 7. Until that presentation task exists, use the current save-status/modal functions for failure messages, not an undefined future UI module.

## Task 1: Pure policies, migration seed and validated attempt transitions

**Files:** Create `economy400-core.js`, `tests/economy-policy.cjs`.

**Interfaces:** Produce all `Core` methods above. Use the real extracted `simulateState` from `tools/campaign/runtime.cjs` in tests; do not implement new puzzle physics. All reducers leave inputs unchanged, including on rejection.

- [x] Write `energy_boundaries`, `cap_discards_backlog`, `clock_rollback`, `reward_tiers_and_replays`, `legacy_seed` and `reject_invalid_state` tests. Assert fresh `{energy:20,coins:0}`; after spending from full at `t`, 19 at `t+899999`, 20 at `t+900000`; no >20 after a week; a later spend from full waits a new 900000ms. Preserve partial intervals below cap and the monotonic timestamp during rollback.
- [x] Assert `progression(0,1)=10`, `progression(1,3)=20`, repeated 1/2/3-star clears pay 2/4/6; Daily date and campaign keys differ. Seeding `{stars:{51:3}}` accounts for that tier without coins and does not mutate the legacy save. Reject fractional, negative, unsafe or malformed balances, duplicate receipt IDs with conflicting contents and invalid board snapshots.
- [x] Run `node tests/economy-policy.cjs`; observe failure because the module/API is absent, not a syntax/fixture error. Record RED.
- [x] Implement the exact constants, immutable transitions and specified integer guards. `BEGIN_MOVE` validates a genuine simulator move and debits only an unpaid attempt; durable `pendingMove` retains the last settled board. `COMMIT_MOVE` applies only its own token. `COMPLETE` derives stars from actual total moves and immutable authored thresholds. Only a solved attempt produces a completion receipt; repeated completion returns that receipt.
- [x] Add literal assertions for duplicate BEGIN/COMPLETE/BUY requests, legal/blocked moves, zero energy, selected captured pieces, linked masks, +5 allowance without level mutation, 15-coin hint caching and 40-coin extension boundaries. At 39 coins an extension changes nothing; at 40 it leaves zero and adds five. Reject `BUY_MOVES` unless out of moves and `BUY_HINT` during a pending move/import.
- [x] Run the policy suite GREEN and `node tests/campaign-tools.cjs`; expect immutable policies and real simulator parity PASS. Commit `feat: define transactional energy and coin policies` with only this task's files.

## Task 2: Native IndexedDB store and real concurrency/error tests

**Files:** Create `economy400-store.js`, `tests/economy-storage.browser.cjs`, `tests/economy-fixture.cjs`; extend `index.html` script loading for the core/store.

**Interfaces:** Consume `Core`; implement `Store` above. `store.transact` does read/validate/reduce/write in one IndexedDB readwrite transaction, resolves only on transaction completion, and aborts without publishing state on any failure. Do not await unrelated work inside an IDB transaction.

- [x] Write native-browser tests `initialize_once`, `two_tabs_one_wallet`, `aborted_write_is_not_success`, `nonempty_corruption_is_not_fresh_install` and `invalid_attempt_preserves_wallet`. Use one Playwright browser context/two pages for same-origin races; no new fake database package.
- [x] Run `node tests/economy-storage.browser.cjs`; observe RED for the absent store implementation. Supply the minimal static-server fixture as part of this test, not a separate scaffolding task.
- [x] Implement open/upgrade/blocked/versionchange/abort handling, absent-record-only initialization, transaction completion semantics and reread-before-reduce. On a structurally valid wallet with an incompatible attempt, preserve balances/ledger, isolate the bad attempt and surface a resume error. Do not silently mint 20 energy after a parsing error.
- [x] Assert 20 simultaneous valid first-move attempts can spend at most 20 energy; different unfinished paid attempts require replacement confirmation. For two racing extension requests with only 40 coins, exactly one distinct purchase succeeds, no negative balance, no +10 grant. A repeated identical request is idempotent. Inject transaction aborts before commit and assert both tabs still read the prior wallet.
- [x] Implement fixture helpers `withGame(run)`, `seedWallet(page,{energy,coins})`, `syncAttemptFixture(page,snapshot)` and `readWallet(page)`. Seeding writes validated test-only IDB records, preserves attempt/ledger fields unless explicitly under test, and reloads the public read view. Never add a production bypass, unlimited-energy flag or hidden query parameter.
- [x] Run storage and policy suites GREEN. Commit `feat: persist economy with serialized IndexedDB transactions`.

## Task 3: First-move charge, resumable board and animation lifecycle

**Files:** Create `economy400-game.js`, `tests/economy-attempt.browser.cjs`; modify `game400-a.js` (`startLevel`, `screen`, `renderGame`, startup), `game400-b.js` (`moveSelected`, Reset/pause/exit handlers), `index.html`, `tests/browser-game-ready.cjs` and affected gameplay fixtures.

**Interfaces:** Consume Core/Store; implement `ready`, `read`, `effectiveLimit`, move prepare/commit/cancel, resume and retire methods. `MoveTicket` holds attempt ID/revision, operation token, generation, simulator result and original position; it is not a second physics implementation.

- [x] Write actual-control cases `preview_and_blocked_are_free`, `first_move_charged_once`, `reload_resumes_paid_board`, `zero_energy_resume`, `reset_is_new_attempt`, `preview_other_level_preserves_paid_attempt`, `stale_animation_cannot_commit` and `daily_midnight_resume`. Record RED by running `node tests/economy-attempt.browser.cjs` before hooks exist.
- [x] Initialize the store from the existing valid campaign/Daily saves before enabling spending actions. Keep story/Settings accessible on storage failure. Update readiness helpers to wait for `Economy.ready` explicitly rather than introducing idle waits or blanket timeout inflation.
- [x] Keep a new board preview separate from an unfinished durable paid attempt. Normal entry to the same paid level resumes; Reset/Retry explicitly retires it. Before replacing a different paid attempt on the new board's first valid move, show confirmation. Cancellation preserves the prior attempt and wallet. Home's resume action restores the saved level/mode rather than selecting a fresh latest-unlocked board.
- [x] Sequence movement: validate actual input -> prepare transaction/debit -> recheck generation -> existing animation -> recheck generation -> commit settled snapshot -> render/check win or effective loss allowance. On cancellation, retain the prior settled snapshot and paid flag. Reset/exit must invalidate a pending request even while an IDB transaction is awaiting completion; its stale continuation must not animate or commit into the replacement board.
- [x] Persist positions, captured pieces, selected piece, door mask, total moves, extensions, level signature and original Daily identity. Test reload after a move and at zero energy, including dense 366 and a linked-door board. Do not change the simulation or static definitions.
- [x] Run attempt/storage/policy and `node tests/gameplay-campaign.browser.cjs`. Adapt long legacy fixtures with explicit wallet funding and synchronized intentional board fixtures; never remove their route, scoring or lifecycle assertions. Commit `feat: charge and resume durable puzzle attempts`.

## Task 4: Once-only completion rewards and recoverable progress delivery

**Files:** Extend `economy400-game.js`, `economy400-core.js`; create `tests/economy-rewards.browser.cjs`; modify `game400-b.js` (`winLevel`), `game400-a.js` (save/lifecycle recovery) and affected progress/reward fixtures.

**Interfaces:** Implement `completeAttempt` and `deliverPendingReceipts`. Core receipts are durable before progress delivery; ACK only after the appropriate campaign/Daily write succeeds. Campaign delivery takes max(existing, earned) stars/unlocks; Daily delivery never touches campaign fields.

- [x] Write `first_clear_and_improvements`, `replay_246`, `duplicate_win_reload`, `failed_progress_write_recovers`, `daily_shared_wallet_isolated_progress`, `milestone_and_finale_pay_once` and `canceled_final_animation_pays_nothing`; run `node tests/economy-rewards.browser.cjs` RED.
- [x] Commit reward, accounted tier, completed attempt and receipt together. Example: one-star first clear pays 10, later three-star improvement pays 20, later three-star replay pays 6; totals 36, not 46. Already-accounted legacy three-star levels pay replay 6 rather than another 30.
- [x] Deliver and ACK pending receipts idempotently. Simulate localStorage failure after the wallet transaction; reload, recover progress and retain exactly the previously awarded coins. Recover a settled solved board interrupted before the COMPLETE call. Reject stale wins after another attempt or reset supersedes their token.
- [x] Integrate coin-result text into normal, Daily, Level 50/100/150/200 and finale result paths. Reopening a chapter keepsake/cinematic is presentation only and never calls completion/payment. Preserve current reward action IDs and immediate skipping.
- [x] Run rewards/attempt suites and `node tests/progress-daily.browser.cjs`, `node tests/story-payoffs.browser.cjs --delayed-observation`. Expect existing saves/max stars, receipt recovery, reward animation/porch assertions PASS. Commit `feat: award performance coins once per completed attempt`.

## Task 5: Paid hints and five-move continuations

**Files:** Extend `economy400-game.js`, create `tests/economy-purchases.browser.cjs`; modify `game400-b.js` (`showHint`, `loseLevel`, `moveSelected`), `game400-a.js` (`renderGame`), `tests/current-hint.browser.cjs` and relevant fixtures.

**Interfaces:** Implement `purchaseHint` and `purchaseMoves`; use the effective limit in every remaining-moves consumer. Bind request IDs to one confirmation action; a later exhausted extension creates a new purchase request.

- [x] Write `hint_15_only_if_presentable`, `cached_hint_free_after_reload`, `stale_hint_never_spends`, `extension_40_preserves_board`, `duplicate_clicks_one_extension`, `extension_changes_solver_budget_not_stars` and `zero_energy_paid_continue`. Run `node tests/economy-purchases.browser.cjs` RED before enabling purchases.
- [x] Add explicit priced confirmation before new hint search. Preserve the current 12,000-state/900ms solver limits and cancel/reset/exit generations. Search without charging; then revalidate attempt/board, overlay visibility and affordability in the purchase transaction before revealing a found legal move. Persist the paid result with that board key. No charge for solved, impossible, inconclusive, canceled or stale requests. A validated cached hint can reopen without a new payment/search.
- [x] Out-of-moves modal offers `Continue +5 moves · 40 coins`, Retry and exit. Do not add a lower control. Keep all state and total moves on success; the extension does not require energy. At insufficient coins, cancellation or transaction failure, keep the original modal and board unchanged and show why the purchase did not happen.
- [x] Use `Economy.effectiveLimit(lev)` for HUD, loss checks and hint remaining budget. Keep `starsFor` based on original `optimal` and total `movesUsed`. Test a second extension after five further moves, a failed concurrent purchase, canceled confirmation and a reloaded purchased extension.
- [x] Run purchase/reward/attempt suites plus the existing current-Hint and gameplay suites GREEN. Existing Hint tests fund their wallets and explicitly confirm the new price; retain legal-next-step, honest-bound, cancellation and persistent-highlight assertions. Commit `feat: sell confirmed hints and five-move continuations`.

## Task 6: Compatible backups, import journal and reset protection

**Files:** Extend `progress-backup400.js`, `economy400-store.js`, `economy400-game.js`; create `tests/economy-backup.browser.cjs`; modify `game400-b.js` backup/import/reset functions and `tests/progress-daily.browser.cjs`.

**Interfaces:** `LatchlingsProgressBackup.create(progress,seen,economy?)` exports v2 when passed an economy record, otherwise preserves the v1 API. `parse(text)` returns `{progress,seen,economy:null|Wallet,version:1|2}`. Both versions validate all fields before mutation. Existing two-argument callers remain valid.

- [x] Write `v1_keeps_wallet_and_seeded_claims`, `v2_roundtrip_paid_attempt`, `reset_does_not_refill`, `import_cancel_preserves_all`, `malformed_replaces_nothing` and `journal_recovers_each_crash_boundary`; run `node tests/economy-backup.browser.cjs` RED.
- [x] Preserve v1 compatibility and strict validation; v2 exact top-level keys are `format`, `version`, `campaign`, `cinematics`, `economy`. Exclude active import-journal internals from exported target wallets. A legacy import preserves balances/timestamps/current reward ledger and merges imported historic star tiers as accounted. It never grants a new starter wallet. Show any conflicting-attempt retirement before confirmation.
- [x] Import protocol: validate target -> durably prepare a journal with old local values and target -> block economy mutation -> write target campaign/seen values -> transactionally install target wallet/clear journal -> publish game state. Startup finds an unfinished journal and idempotently finishes those same target writes before enabling play. If writes remain unavailable, keep the journal and explain recovery; export uses the coherent original snapshot, not a mixture. Test interruption after journal prepare, each local write and finalization, plus explicit retry.
- [x] A v2 import replaces its validated wallet/attempt only after confirmation. Local backup rollback is not claimed to be tamper-proof. Reject incompatible attempt signatures without replacing a valid wallet with a fresh one. Reset campaign leaves wallet, accounted rewards and recharge schedule intact and states this in its confirmation.
- [x] Run backup/storage/reward suites and existing progress-backup/Daily assertions GREEN. Verify version-1 sparse/full fixtures, earned story flags, cancel paths and failure messages, not just successful round trips. Commit `feat: preserve economy through compatible backups and recovery`.

## Task 7: Wallet presentation and compact-phone visual acceptance

**Files:** Create `economy400-ui.js`, `style400-economy.css`, `tests/economy-ui.browser.cjs`; modify `index.html`, Home/Level Select rendering hooks in `game400-a.js`, pause/reward hooks in `game400-b.js`; retain canonical iframe geometry.

**Interfaces:** Implement the `UI` methods above. UI reads published validated wallet snapshots and uses pure regeneration preview for countdown; it never changes balances itself or writes storage every animation frame. Refresh on ready, committed operations, recharge boundary, focus/visibility and cross-tab notification.

- [x] Write visible/accessible Energy and Coins, next-recharge, wallet-details, zero-energy, insufficient-coins, import/error and focus-restoration tests at 320×568, 390×844 and 430×932, each Normal/Large Text and normal/Reduced Motion. Run `node tests/economy-ui.browser.cjs` RED before adding presentation.
- [x] Reserve a small wallet row outside Home/Level Select art and navigation, with readable labels/numbers and no absolute overlap. Keep gameplay controls exactly where accepted; expose wallet details through pause. Do not force an additional gameplay HUD row if it violates short-phone board/Route Tip/control geometry.
- [x] Price confirmations have explicit confirm/cancel and disabled insufficient-funds actions; no automatic purchase or focus trap. Energy-zero retains a visible Resume action when a paid attempt exists. Live countdown announcements must not chatter every second to screen readers. Zero, singular and capped values display accurately.
- [x] Review settled and moving screenshots including 1/301/366/400, zero energy, paid continuation, hint success/failure, milestone reward and ending. Record actual capture IDs; preserve old overlap, endpoint, porch, 44px-target, keyboard and control assertions. No new narration playback.
- [x] Run UI, Large Text, short-Home, phone visual regression, mechanic inspector and reward suites GREEN with explicit funded fixtures where needed. Commit `feat: show accessible wallet and purchase states`.

## Task 8: Whole-game verification and review delivery

**Files:** Modify `package.json`, affected existing browser fixtures and `DEVELOPMENT_HANDOFF.md`; create `docs/reviews/2026-10-19-energy-currency.md`. Do not commit generated captures or temporary fixtures.

**Interfaces:** Add every new economy test to `npm test` without dropping any existing suite. Shared fixtures may seed legitimate balances/attempts in test storage; no runtime bypass. The production game must pass its zero-energy and low-funds tests under real rules.

- [x] Run targeted pure/store/attempt/reward/purchase/backup/UI tests, then the full `npm test`; read every outcome. Failures must be diagnosed and reproduced, not dismissed by isolated green reruns. Preserve all baseline movement/route/control assertions while updating intentional price/readiness fixtures.
- [x] Run `node tests/phone-stage-certification.browser.cjs` and `node tests/campaign-polish.browser.cjs --capture-matrix`; funded gameplay fixtures must still use real controls and actual moving-state capture evidence. Inspect the Task 7 matrix in addition to preserved story/ending checks. Do not call automated route replay human playtesting.
- [x] Compare all eight `campaign400-N.js` SHA-256 values against the accepted current branch, including frozen Chapter 1. Run `git diff --check`; reject any unexplained campaign data, star threshold, cinematic script or bottom-control style change.
- [x] Obtain one fresh independent whole-branch review using the preserved Native workflow. Resolve Critical/Important findings with observed RED→GREEN and a green full suite; record any deferred Minor issues and all economic policy deviations rather than claiming unconditional completion.
- [x] Update the short handoff with exact implemented state, test counts/results, representative screenshots, migration/import behavior and remaining physical-device/AT/audio/player-balance checks. Link the detailed review instead of expanding handoff history again.
- [x] Commit/push the existing review branch and verify both GitHub workflows on the exact delivered SHA. Report SHA, source/CI evidence and any failures. No merge/deploy during the original review phase. Publishing to the live test site is a separate authorized release step, not implied by a green branch push. Review delivery `7c1796e` passed both workflows; the player subsequently authorized the October20 live release, recorded in `docs/reviews/2026-10-20-live-release.md`.

## Plan self-review and execution gate

Coverage: energy and pricing policies (1); serialization/storage failure (2); first-move/resume/reset/animation/Daily identity (3); reward receipts/outbox/milestones (4); paid hint and +5 state preservation (5); migration/backups/reset/journal (6); UI/accessibility/phone presentation (7); complete regression/hash/review/CI/handoff (8). All five Review Focus conditions have explicit owner tests. Public signatures, command names and price constants match across tasks.

Execution approved and completed using the selected **Native** inline method. Checkboxes summarize completed work; exact observed evidence, review repairs and delivery limits belong in `docs/reviews/2026-10-19-energy-currency.md`. Final full44-suite local regression and exact-source CI passed on `1a12c38`; both workflows passed on review delivery `7c1796e`. All eight tasks are complete, with the explicitly deferred Minor countdown placement documented. The player's subsequent October20 authorization supersedes this plan's original branch-only restriction; current release policy is at the top of `DEVELOPMENT_HANDOFF.md`.
