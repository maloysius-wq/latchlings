# Energy and earned-currency economy

Date: October 19, 2026

Status: Approved by the player's “Well let's proceed then” on October 19, after being asked to review this written specification. Implementation plan: `docs/superpowers/plans/2026-10-19-energy-currency.md`, awaiting its own review. No economy code is implemented by this documentation change.

Repository: `maloysius-wq/latchlings`. Continue the existing `codex/campaign-rebuild-20261005` branch, starting at `85f204524d5e5c529db1ee3a5d5ef6e7a1e3e5bb`. Do not merge or deploy.

## Purpose and approved rules

Add a depletable energy pool and earned coins to the existing single-player puzzle game. Performance earns useful assistance, and a player who runs out of moves can purchase more without restarting their board.

- Start with 20 energy. The cap is 20.
- Regenerate one energy every 15 minutes, including elapsed time while the game is closed.
- Each new attempt costs one energy, charged on its first valid move. A blocked/no-op input, selecting a piece, opening a level, looking at Story, or viewing a cutscene does not cost energy.
- Resume an existing attempt without another energy charge. Buying five more moves also costs no additional energy.
- First-clear/progression coin awards are 10, 20 and 30 for one, two and three stars.
- A successful hint costs 15 coins. An inconclusive search does not cost coins.
- A continuation costs 40 coins and grants exactly five additional moves on the current board.
- Earned coins only. No real-money purchase, advertising, subscriptions, energy shop or server account in this version.

The voice recording workbook is a separate deliverable. This economy does not add recorded voices, change cinematic text, or change tap-to-advance dialogue.

## Architecture choice

Use one small, isolated economy module and native IndexedDB transactions for the wallet, reward ledger and attempt snapshots. Keep existing campaign progress, Daily progress and cinematic-history interfaces compatible. This supports durable, serialized transactions across same-origin tabs without adding a runtime package or backend.

Alternatives considered:

1. A localStorage wallet is smaller, but ordinary read/modify/write is not transactional across tabs and becomes fragile when combined with paid resume state.
2. A server-authoritative economy can enforce clock and purchase integrity, but adds accounts, hosting and network dependencies outside the approved earned-only scope.

The IndexedDB version remains a local game save, not a tamper-proof financial system. Players who alter device clocks, edit storage or restore an old whole-wallet backup can alter their local economy. Real payments would require a separately approved server-backed design.

## Complete v1 balance rules

### Energy

Persist integer energy, the regeneration anchor and the last observed timestamp. Settle elapsed complete 15-minute intervals before an economy action. Preserve a partial interval while below the cap. When the pool reaches 20, discard excess elapsed intervals so a full pool cannot accumulate hidden future energy. Spending from a full pool starts the next recharge interval at that spend.

Use the later of the observed time and the saved last-observed timestamp to prevent clock rollback from granting extra regeneration. A clock rollback must not produce a negative balance, negative countdown or bonus energy. A large forward jump can refill to 20, never above it; there is no claim of protection against deliberate clock manipulation.

At zero energy, a new unpaid attempt cannot make its first valid move. Show the next recharge countdown and allow an already-paid attempt to resume. Do not automatically spend coins or delete its board.

Reset/Retry after a paid attempt retires that attempt and creates a fresh unpaid attempt. It costs energy only when the next valid move starts. Resetting a preview that has not moved costs nothing. Exiting an unfinished board preserves its paid snapshot instead of silently resetting it. Merely opening another board does not abandon the saved attempt; starting another attempt's first valid move requires explicit confirmation if it will replace a different unfinished paid attempt. Keep one resumable attempt at a time.

### Coins and repeated clears

Start with zero coins. Coins cannot become negative and all prices/rewards are nonnegative integers.

For each campaign level, remember the highest star tier for which progression coins have been accounted. For Daily, use a distinct key for the Daily date, not a campaign level key. A changing learned-mechanic tier within one Daily date must not mint multiple first-clear rewards.

- The first one-/two-/three-star clear pays 10/20/30.
- A later improvement pays the difference to the new progression tier. Example: one star pays 10, then three stars pays 20 more, totaling 30 progression coins.
- If the new clear does not improve that tier, pay a replay reward of 2/4/6 coins for one/two/three stars.
- An improved clear receives the progression difference, not an additional replay award.
- Each distinct completed attempt pays once. Repeated callbacks, reloading a result, reopening an earned keepsake, and replaying a cinematic do not pay again.

This makes performance matter without leaving players permanently unable to rebuild their balance. Replay farming remains possible but consumes a fresh attempt's energy; it is an intended earned-currency route, not an unlimited result-screen reward.

Daily uses the same energy pool and coin balance. Its reward entitlement and win receipts are separate from campaign entitlements; completing Daily never changes campaign stars, unlocks or story history. A resumed Daily attempt keeps its original date and tier identity, even across midnight.

### Hints

Keep the accepted Hint button and the existing current-board solver. Show the 15-coin price and require confirmation before starting a paid request. Cancellation, a stale board, a changed attempt, no affordable balance, a solved board, an impossible result, and an inconclusive/resource-limited result cost nothing.

Charge once only after the solver produces a legal next move for the still-current snapshot and the result can actually be presented. Persist the paid hint with that snapshot so reopening it or reloading the same board is free. Another position or linked-door state is a different snapshot. Do not charge again for repeatedly tapping the same displayed suggestion. A pending search cannot spend after Reset, exit, import or level change.

Hints do not consume energy themselves. Do not sell a new hint on an unpaid board at zero energy; explain the recharge requirement. Hints remain available on an already-paid attempt whose energy balance has reached zero.

### Five more moves

Offer `Continue +5 moves · 40 coins` in the out-of-moves modal, alongside the existing Retry and exit actions. Do not add a bottom-control button. Show the current coin balance and insufficient-funds state; never purchase automatically.

The transaction must preserve all piece positions, captured pieces, linked-door mask, selected piece, original level identity, moves already used and any earlier purchased extensions. Add five to the attempt's available allowance, not to a static level definition. Repeated purchases are allowed when another extension is exhausted, each explicitly confirmed and charged once.

All consumers of remaining moves must use the attempt's effective allowance: HUD, movement/loss checks, hint solver, resume and export/import. Stars still use total actual moves and the original authored `optimal` / `optimal + 1` thresholds. Buying moves does not reset the move count, award stars or unlock anything by itself.

## Durable state and integration

### Economy record

The module owns a versioned record containing wallet balances/timestamps, a revision, progression-reward tiers, completion receipts, pending progress-delivery receipts, and the current attempt. Transactions reread and validate that record before changing it. An attempt contains a unique ID, revision, mode, campaign level, Daily identity when relevant, a level-definition signature, positions, selected piece, door mask, moves used, extra moves, energy-paid flag, status and cached paid hint.

Use explicit states: preview, active, out-of-moves and completed. Do not infer charge eligibility from a DOM screen or from `movesUsed === 0` alone. Reject stale revision/attempt-ID updates; refresh another tab rather than applying its old board to the newer attempt.

Separate pure balance/validation transitions from the IndexedDB adapter and DOM integration so fake-clock and transaction-failure tests do not need the full game.

### Game hooks

- `game400-a.js`: startup readiness, start/resume selection, rendered allowance, Home/Level Select wallet summaries, relevant lifecycle synchronization.
- `game400-b.js`: first-valid-move debit, committed settled snapshots, win receipts, out-of-moves continuation, priced/cancellable hints, pause/reset/import behavior.
- `progress-backup400.js`: compatible versioned backup validation and export/import.
- A dedicated economy module and focused stylesheet: storage/transitions, wallet presentation and purchase states; do not bury the subsystem in the already-large game files.
- `index.html`: load the new module before consumers and include its styles.

Preserve the existing movement-request generation checks. A canceled animation must not overwrite a reset board or credit an abandoned win. Save the last committed settled board; the first valid input's energy charge is durable before animation, but a canceled move does not become a completed win. Resume the last settled snapshot without charging that attempt again.

Commit wallet changes, the relevant attempt transition and the once-only reward receipt together. Deliver earned campaign/Daily progress through an idempotent receipt after the transaction, retaining pending delivery if the existing localStorage progress save fails. Reload must recover earned progress without awarding the coin receipt twice. Cinematic/reward replay must remain an explicit presentation action, not a money transaction.

If the economy store cannot be opened or written, do not pretend that a purchase or charge was saved. Prevent the affected mutation, keep the current board and balance visible, explain the storage problem, and leave Settings/backup and non-spending story navigation accessible. No silent new-wallet initialization for a malformed nonempty record.

### Existing saves, imports and resets

- Existing campaign `{unlocked, stars}`, cinematic-seen history, earned keepsakes and Daily progress survive first initialization.
- First economy initialization grants 20 energy and zero coins. Seed already-earned campaign/Daily reward tiers as accounted, without retroactively minting coins. Existing players can earn replay coins or a genuine higher-star improvement. This is a design default for review, not a previously promised retroactive grant.
- Continue accepting version-1 progress backups. A legacy import does not reset or refill an existing wallet or erase its reward ledger. Warn before closing a current attempt if imported progress conflicts with it; cancellation leaves everything unchanged.
- Export a version-2 backup with campaign, cinematic history and the validated economy/attempt record. Validate the complete file before committing any replacement. Explicitly confirm that a v2 restore replaces wallet/attempt state as well as campaign history. Use a recoverable import transaction/marker so interrupted writes cannot silently leave half an import applied. Restore errors retain the current session and explain recovery.
- Importing a v1 backup on a genuinely fresh install initializes the economy once, seeding its accounted tiers from the imported save. Reimporting cannot grant another starter pool.
- Reset campaign progress retains the economy, its reward-entitlement ledger and regeneration schedule. Explain this in confirmation copy. Reset is not a coin/energy refill. An intentional whole-economy erase is not part of this version.
- Reject a saved attempt with invalid positions, masks, level identity or an incompatible level-definition signature. Keep the wallet intact, explain that the board cannot be resumed, and do not invent rewards or silently restore onto a different puzzle.

## Presentation and protected contracts

Use the plain labels Energy and Coins for v1. Keep costs visible before confirmation and communicate awarded coins on ordinary wins and chapter-reward results without obscuring their earned animations or immediately usable actions.

Wallet information must have reserved layout space, not float over island residents, puzzle cells, routes, dialogue or navigation. Show energy, next recharge when below cap, and coins on Home/Level Select, with accessible wallet details from gameplay's existing pause interface. If a compact gameplay balance indicator fits, it must not shrink accepted controls or important text. No broad visual redesign.

Preserve all 400 static level definitions and hashes, original star thresholds, campaign/Daily isolation, all 21 tapped Opening lines, canonical Little Home porch geometry and clearance assertions, Reduced Motion/Large Text, keyboard/focus behavior and pre-Astra Reset/D-pad/Hint controls. No Undo, new voice playback, shortened scenes or new board mechanics.

## Acceptance evidence required

1. Pure/fake-clock tests: first initialization, 14:59/15:00 boundaries, partial intervals, cap/discarded backlog, spending from full, offline elapsed time, rollback/forward clocks, invalid records and integer/overflow bounds.
2. Charge tests: preview/blocked inputs free; first legal move once; reset/Retry creates a new unpaid attempt; returning/resuming does not charge twice; energy-zero preserves an active board; simultaneous tabs and rapid inputs cannot overspend.
3. Reward tests: every star tier, improvement differences, 2/4/6 replays, once-only completion receipts, reload/result/keepsake replay, chapter rewards and Level 400, Daily date isolation and midnight resume.
4. Purchase tests: exact 15/40 prices and low-funds boundaries; confirmation/cancellation; no unsuccessful hint charge; cached hint free; stale search cannot spend; +5 preserves every piece/mask/move field and handles rapid duplicate clicks/transaction failure.
5. Persistence tests: reload/reopen after first move, after a hint, after +5, at a loss and after a clear; pending progress-delivery recovery; storage errors; stale tabs; legacy migration; v1 and v2 export/import, cancellation, malformed backups and interrupted import recovery; campaign reset does not mint money or energy.
6. Actual-control browser tests must use the real economy and real gameplay entry points. Tests needing many clears may explicitly seed legitimate test wallet balances through a fixture; no production bypass flag or disabled energy checks. Existing protected travel/control/overlap assertions stay intact. Add the relevant new suites to `npm test`.
7. Review 320×568, 390×844 and 430×932, Normal/Large Text and motion/Reduced Motion: wallet details, zero-energy modal, hint confirmations/results, exhausted-moves continuation, wins and chapter rewards, dense Level 366 and Level 400 ending. Verify no overlap and correct focus restoration.
8. Run the full regression suite, story/gameplay matrices as affected, `git diff --check` and all eight campaign hash comparisons. Commit/push for review and check both GitHub workflows on the exact delivered SHA. Do not claim physical iOS/Android, real screen-reader or audio testing without actually performing it.

## Approval and next step

Review this written specification, especially the 2/4/6 replay rewards, legacy-player initialization, Daily sharing, and backup/reset rules. After written-spec approval, create the implementation plan and have the player review it and select the execution method before modifying product code. Routine implementation details can use the player's existing auto-approval preference; it does not replace the written-spec and plan review gates.
