# Campaign rebuild design — October 5, 2026

Status: **player-approved specification; Native implementation authorized**. The player reviewed and approved this specification, then the written implementation plan, and chose Native execution. Chapter 8 is a challenging mastery-only finale. Track actual implementation/verification in the plan ledger and handoff; this approval is not a completion claim.

## 1. Intended experience and scope

The player finished Chapter 1 and found Lanternwood too easy and repetitive. Rebuild the 350 slots in Chapters 2–8 into distinct, deliberately taught puzzles with rising conceptual difficulty. Each teaching chapter begins accessibly, establishes its focus, then adds earlier skills through causal interactions. Aurora is the approved exception: no new rule, a demanding synthesis of the entire game and a genuine test of wits.

Keep Chapter 1 exactly as shipped. It already contains helper stopping, so Lanternwood cannot honestly introduce that engine rule for the first time. Its new learning is **advanced cooperation**: creating and relocating stops, exchanging helper roles, retaining a useful helper instead of capturing it, and sequencing eventual captures. This specification proposes using the existing rule set rather than inventing another tile/rule; player review can correct that scope before implementation.

Preserve 400 numbered slots, eight 50-level chapters, region identities, story beats, reward boundaries, the Level 400 homecoming, tap-per-spoken-line dialogue, no narrator voice, no Undo, and accepted pre-Astra Reset/D-pad/Hint controls. No general graphical or story redesign is included. Adjust teaching text only where it must accurately describe the replacement boards.

Implementation starts from current live `c79f39f38987542ea1e904d33d5d4c1b6cd6733e` on review branch `codex/campaign-rebuild-20261005`. Do not publish this rewrite automatically; the September 30 release authorization applied to that release.

## 2. Why a rebuild is warranted

The October 5 audit independently proved all 400 current shortest solutions and replayed all supplied routes in the rendered game. Move labels are accurate. Design acceptance was missing:

- 130 repeat instances across 63 equivalent families after normalizing all eight orientations, piece order, consistent identities and switch links.
- Chapter 4 has 25 within-chapter repeat instances; Chapter 5 has 30; Chapter 6 has 34. Chapter 8 has 39 repeats of any earlier campaign board.
- Chapter 2 has 14 legal clears without any move ending against another piece; nine still earn three stars. Chapter 1 already uses helper stops in 29 supplied routes.
- Removing suit gates leaves the supplied sequence successful in 41/50 Chapter 4 boards, and removing color gates does so in 42/50 Chapter 5 boards. Mechanics being present is not proof of meaningful integration.
- Levels 398/399/400 are equivalent, undermining the finale.

Feature-removal results are counterfactual sequence-survival measures, not proof that every surviving gate is decorative. A gate can meaningfully restrict wrong choices while the correct sequence survives removal. Replacement acceptance must inspect relevant decisions and state graphs, not misuse a removal test.

Detailed baseline evidence is at `C:/RetroRig_Codex_Handoff/audit-latchlings/CAMPAIGN_LEVEL_AUDIT_2026-10-05.md` and its adjacent generated JSON/scripts. The implementation plan must bring reproducible analysis/acceptance tooling into the repository rather than depend on this machine's local files.

## 3. Authoring approach

Use a **curated deterministic campaign**, assisted by offline candidate construction and solver analysis. Do not ship a runtime random generator. Reordering the current boards alone cannot fill the missing design variety; accepting hundreds of unchecked random candidates cannot establish a learning curve.

Every slot 51–400 must receive a documented design decision and pass the new acceptance gates. A sound existing board may be retained only if it fits its new learning slot, is unique against the complete accepted campaign, and passes relevance/progression review. Retention must not become a way to retain a duplicate family. Rebuild each chapter in sequence, validating it before compounding issues in the next.

Each accepted board has a small review record, separate from player-facing copy:

- level/chapter/local index, learning stage and named design intention;
- prerequisite and focus mechanics; intended dependency/order or useful setup;
- size and piece count; proven shortest length, supplied route and move budget;
- canonical puzzle fingerprint and terrain/solution-idea similarity flags;
- witnesses showing the focus mechanic matters at relevant states;
- solver completion/budget status and representative play/review evidence;
- a clear retention/replacement decision against the baseline.

No changes to the campaign level decoder or move simulation are expected. Existing `campaign400-2.js` through `campaign400-8.js` remain static authored exports consumed through `_L`; review/analysis metadata lives outside the compact runtime arrays. Tooling must use the actual gameplay transition function or a verified equivalent, not an independently drifting interpretation.

## 4. Chapter curriculum

| Chapter | Focus and characteristic reasoning | Earlier skills reintroduced later |
|---|---|---|
| 1 — Sunpetal | Unchanged shipped 1–50 | No edits |
| 2 — Lanternwood | Advanced cooperation: relocate stops, swap helper roles, defer captures | Edges, rocks, elementary stopping from Sunpetal |
| 3 — Lodestone | Exact anchor stops, launch points, choosing when to leave a precise stop | Helper relocation and capture sequencing |
| 4 — Masquerade | Suit permissions: correct traveler, identity-dependent blockers, shared suit/different color distinctions | Anchors and cooperative stopping |
| 5 — Prism | Color permissions distinct from suits: same color/different suit and same suit/different color | Suit routes, anchor setup, helpers |
| 6 — Copperline | Directional rail entry, then turners that bend a single continuous move | Identity gates, anchors, helper stops |
| 7 — Stormswitch | Linked switches/doors, useful open and closed states, deliberate toggling | Rails/turns, identities and precise/helper stops |
| 8 — Aurora | Mastery synthesis; no new rule, hard interactions and future-state reasoning | All taught skills, selectively and meaningfully combined |

Chapter 6 initially isolates rails in local levels 1–5; local 6–8 introduce turners with sparse earlier features. Subsequent practice combines these two route-transforming skills. Do not introduce both through a full mixed board on the first level.

An introductory gate board must make the identity distinction observable. Matching color/suit everywhere is not sufficient to teach that the two properties differ. Introductory switch boards must show an intelligible linked door, not require unexplained multi-toggle chains.

## 5. Teaching-chapter pacing

Apply the following to Chapters 2–7:

| Local levels | Purpose | Design boundary |
|---|---|---|
| 1–5 | Accessible focused demonstrations | Sparse readable geometry; isolate focus, only necessary foundational features |
| 6–15 | Practice through different ideas | Vary setup, direction, traveler/order and useful stopping geometry—not just orientation |
| 16–30 | First combinations | Focus plus one substantial earlier skill; build connected dependencies |
| 31–45 | Deeper planning | Multi-step setup, capture/order decisions, focus plus multiple earlier skills |
| 46–50 | Five distinct mastery challenges | No reskin series; Level 50 is a unique regional capstone |

A focus may require two pieces even during its introduction; “accessible” does not mean every entry must be single-piece. Use 5×5–7×7 boards and ordinarily two or three pieces. Four pieces are allowed for a small number of later mastery boards only when complete solver proof and phone clarity are demonstrated; they are not an automatic difficulty upgrade.

Indicative shortest-route authoring bands—not sufficient acceptance by themselves:

- focused introductions: generally 3–6 moves;
- practice: generally 5–10;
- first combinations: generally 7–13;
- deeper planning: generally 10–18;
- chapter capstones: generally 12–22.

Do not manufacture long solutions to hit these bands. A short puzzle with an exceptional non-obvious dependency can be accepted with an explicit rationale. Numeric band exceptions are recorded, not silently hidden. Monitor successive ten-level median lengths and decision/dependency evidence for broad upward progression; allow deliberate breathing-room boards rather than requiring strict per-level monotonicity. Never use move count, rocks, or board size as the sole difficulty score.

## 6. Aurora: a demanding mastery-only finale

No new tile, hidden movement exception, timed-input rule, or new scoring rule. Its challenge comes from state changes and dependencies using taught mechanics:

- **351–360:** re-entry into expert play with compact pairwise interactions, not introductory instruction;
- **361–375:** three-way combinations, shared passages, helpers that must survive until later;
- **376–390:** future-state planning, deliberate door closure, opposing permissions and staged capture order;
- **391–395:** five distinct expert puzzles exploiting different interactions;
- **396–399:** four different culminating ideas, not a repeated layout with a moved nest;
- **400:** one unique final network puzzle, followed by the existing measured homecoming.

The opening group may be easier than Stormswitch's end to give players room to read the new region, but remains mastery play. The final ten should contain the campaign's strongest conceptual demands, with different dependency structures. Indicative expert lengths are roughly 12–26 moves; exceeding that is not evidence of quality. Level 400 must require meaningful use of at least three taught mechanic classes and staged cooperation/state reasoning. Earlier mechanic categories need not all appear in one cluttered board.

Require author/player review of the final ten for wit, clarity and satisfaction. Solver success is not human difficulty certification. If player playtesting has not occurred, explicitly mark that external evidence as pending rather than claiming the challenge has been proven enjoyable.

## 7. Acceptance gates

### Solvability and fairness

- Independently prove the shortest solution for every accepted board. A search that runs out of time/states is **unproven**, never accepted as optimal from its supplied route.
- Replay every supplied route through the actual rendered simulator; finish all pieces with valid moves and correct door masks.
- Preserve the existing scoring formulas: three stars at `movesUsed <= optimal`, two at `<= optimal + 1`, otherwise one for a completed board within budget.
- Preserve each numbered slot's existing allowance margin: baseline `moveLimit - optimal` (currently two or three moves). Record these baseline margins in the acceptance manifest; a replacement's limit is its independently proven new optimum plus that slot's unchanged margin, even if board size changes. The shipped margins are authored per slot, not uniformly determined by size. Difficulty must come from planning, not silently tightening the allowance.
- Do not alter control behavior, blocked-move accounting, Reset, Hint cancellation/bounds or the center selection button. Do not add Undo.

### Originality

- No accepted Chapter 2–8 board may be exactly or canonically equivalent to any other campaign board, including preserved Chapter 1.
- Canonicalization covers rotations/reflections, piece-to-nest association, consistent color/suit renaming, rail directions, reflected turner handedness and linked switch/door IDs.
- Run a separate near-clone review using terrain structure, start/goal edits and solution/dependency motifs. A rock change or a renamed resident does not automatically make a new idea.
- Clearly related teaching contrasts are permitted only if their intended decision materially changes; record the contrast and keep it local. Do not reuse the same terrain/solution skeleton as campaign filler.

### Mechanic relevance

- Helper boards: actual movement witnesses must show useful piece stops and/or helper relocation and capture-order dependence. At least 40/50 Lanternwood boards must lack any within-budget clear when all moves ending against another piece are forbidden. Every non-contrast Lanternwood three-star route must require a helper stop. The remaining slots are purposeful teaching contrasts, not arbitrary independent errands.
- Anchors: relevant stops or launch setup must actually rely on anchors in focus boards.
- Suit/color gates: show identity-dependent permitted/blocked movement at reachable, solution-relevant states. This can include using a nonmatching gate as a stopper. Demonstrate distinct suit/color reasoning in mixed focus boards.
- Rails: show relevant directional entry or directional blocking, not arrows far from all useful travel.
- Turners: record real trajectory bends on intended solving routes, not cosmetic turn tiles.
- Switches/doors: solving must depend on linked state; later boards must include meaningful reasons to open, close, or postpone changing a door.
- A feature-removal comparison may establish relevance, but removal need not invalidate the identical supplied sequence for every legitimate gate/rail. Supplement it with reachable-choice, path, optimal-length and dependency witnesses. Every accepted focus board needs concrete evidence, not “mechanic present.”
- Mixed-board review names the causal connection between focus and earlier mechanic(s). Merely placing both on the grid fails that review.

## 8. Progress and Daily compatibility

Keep existing progress and backup schemas unchanged: campaign `{unlocked, stars}`, existing keys, version-1 backup parsing, cinematics seen flags and Daily isolation. No reset or destructive migration.

Previously earned stars and unlocks are grandfathered as earned progress. They are not silently regraded against replacement boards. Players replaying a replacement earn stars under that board's proven new target; saving must not downgrade an existing higher star count. This does not assert that a historic achievement was earned on the new board. No new best-move ledger or extra migration UI is in scope.

Do not automatically replay already-seen Opening/films or revoke earned keepsakes. Preserve story/reward boundaries at the same IDs. Current level IDs are stable, not remapped.

Daily remains restricted to campaign mechanics already reached, uses campaign definitions deterministically, and writes only Daily completion. Because this design retains the mechanic-introduction chapter order, no new eligibility tier is required. Still test boundary players (50/100/150/200/250/300/350 completed), especially Chapter 6's staged rail/turner introduction: any finer eligibility adjustment must prevent an untaught-turner Daily without changing campaign progress. Use actual completed/introduced-mechanic evidence for that distinction, not only an optimistic chapter label.

## 9. Components and verification boundaries

Keep changes focused:

1. **Offline authoring/analysis:** candidate construction, complete shortest-path proofs, fingerprints, dependency/feature relevance and accepted manifest. Reports explicit failure or unproven states. Re-running accepted export is deterministic.
2. **Static campaign data:** Chapters 2–8 exports only; Chapter 1 remains byte-identical. Update new expected hashes when validated; retain the original ones as historical evidence.
3. **Teaching and Daily integration:** targeted board-accurate route tips/intro text and eligibility adjustments, without cinematic/layout redesign or new gameplay rules.
4. **Regression/acceptance tests:** broad campaign design gates plus existing actual-render route replay, progress/backup/Daily checks and phone/control/story assertions.

Do not freeze arbitrary old Level 201/301 piece counts if their intentional introductory designs change. Replace such assumptions with the newly approved semantic board contracts. Do not weaken route endpoints, overlap/clearance tests, accepted control geometry, or the Level 366 dense-phone stress case. Keep Level 366 a 7×7 dense board suitable for that test.

Before implementation closeout:

- Run campaign acceptance/solver proof for all 400 boards and old-vs-new Chapter 1 byte/hash comparison.
- Run targeted campaign, mechanic, Hint, progress/backup/Daily and phone tests, then full `npm test` and `git diff --check`.
- Run the existing 180-capture phone-stage matrix and chapter samples at 320×568, 390×844 and 430×932, Normal/Large Text and motion/Reduced Motion. Review early, middle and late boards from every rebuilt chapter; inspect all final ten Aurora boards.
- Verify actual controls execute representative new optimal routes, not only direct simulation. Check off-route Hint behavior and responsiveness on dense expert boards.
- Push the review branch and verify exact-head GitHub CI before declaring implementation complete. No merge/deployment without separate release approval.
- Keep a short handoff pointing to a detailed acceptance ledger. Do not rebuild the enormous historical handoff.
- Report physical-device, assistive-technology and human difficulty/playtesting evidence honestly; mark checks not performed as pending.

## 10. Review and delivery boundaries

This is one campaign-content program with sequential chapter acceptance, not seven independently generated sets joined at the end. The implementation plan should establish shared quality tooling first, author/accept Lanternwood, proceed through Lodestone to Stormswitch, then build Aurora against the complete earlier curriculum. A chapter is not done because it contains 50 valid arrays.

The next step is player review of this written specification. Once approved, write a detailed implementation plan with chapter acceptance checkpoints and choose its execution method. Do not start product code or replace authored data before those reviews.
