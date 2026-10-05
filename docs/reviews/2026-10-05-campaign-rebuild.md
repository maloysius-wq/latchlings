# Campaign rebuild verification ledger

Status: **IN PROGRESS**, Native execution on `codex/campaign-rebuild-20261005`. No replacement campaign exports yet; no merge/deployment. Approved design and implementation plan are under `docs/superpowers/`.

## Completed foundations

- `3c5b55a`: real-engine offline loader, breadth-first shortest proof with explicit resource/depth outcomes, rendered transition comparison and immutable baseline margins from `c79f39f`.
- `9049c1f`: symmetry/identity/link-aware originality, near-clone flags, deterministic chapter export, reachable mechanic witnesses and fresh-proof acceptance entry point.
- Baseline: all **400** optima independently proven, no mismatches, maximum **25,412** visited states. Settings: 800,000 states and 30,000ms per board. `docs/campaign/baseline.json` records all slot allowance margins and Chapter 1 hash.
- Fresh full `npm test`: **17 suites PASS** before tooling and again after the foundation changes (second run session 87501, exit 0). Game source remained unchanged during these runs.
- Tools: four proof/runtime checks and five originality/export/review checks PASS. Originality's 130-repeat assertion refers to frozen baseline Git revision, not tolerance in replacement acceptance. Final campaign-design acceptance remains intentionally failing until records/boards are authored; it is not silently disabled in a purported completion run.

## Lanternwood authoring underway

Offline deterministic search produces proposals, not certified exports. Each proposal must prove its optimum, fail the within-budget no-helper bypass search, meet its staged cooperation predicate, and avoid canonical/terrain duplicates. Proposals are temporary evidence in `test-artifacts/campaign/lanternwood-proposals.json`; no claim that a proposal count equals completed levels.

Proposal review harness injected temporary definitions only into isolated browser contexts; static campaign files and real player saves were not changed. Layout checks passed for the first 29 proposals, then 30 including actual D-pad/piece-selection clears on Levels **51, 58, 67, 79**, at **320×568 Large Text** and **390×844 Normal**, Reduced Motion. Representative initial/setup screenshots inspected for **51, 58, 61, 67, 68**. These are partial proposal checks, not the final viewport/motion matrix or human playtesting.

Diagnostics: the first proposal harness incorrectly required the 320 Large Text 2px gap at 390 Normal (actual normal gap 0, no overlap). Corrected the new test to preserve the approved >=2px short-phone contract and no-overlap elsewhere; no existing assertion or product/control layout changed. A delayed chapter intro covered the first screenshot; the harness now seeds seen-card history and requires no overlay. Candidate search's 200ms exploratory limit left 146/199 Level 81 candidates unproven; exploration now uses 500ms/200,000 states and selected 6×6 planning slots. Final complete-proof and helper-bypass gates remain unchanged.

## Remaining acceptance

Author-review/export all 50 Lanternwood slots, then Chapters 3–8; stage-accurate teaching/Daily compatibility; current-state Hint and grandfathered-save regressions; all final-ten Aurora design reviews; all 400 fresh proofs and rendered routes; full regression and phone/motion matrix; independent whole-branch review and exact-head pushed CI. Historical baseline tests need full Git history in CI (`fetch-depth: 0`) when added to `npm test`.

Physical iOS/Android, assistive technology, speaker/headphone and player difficulty/enjoyment checks remain unverified. No completion or publication claim is made here.
