# Campaign rebuild verification ledger

Status: **IN PROGRESS**, Native execution on `codex/campaign-rebuild-20261005`. Lanternwood accepted at `0d7bd66`: targeted acceptance and fresh full 17-suite regression PASS. Lodestone offline tools verified; Chapter 3–8 data pending. No merge/deployment. Approved design and implementation plan are under `docs/superpowers/`.

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

### Lanternwood static export — targeted evidence

- All 50 slots individually reviewed through named dependency intentions in `docs/campaign/lanternwood-intentions.json`; decoded inputs in `docs/campaign/authoring/chapter-2.json`; reproducible proof/witness records in `docs/campaign/acceptance.json`. All replaced; Chapter 1 unchanged.
- Fresh `accept.cjs --chapter 2`: **50 reviewed, 50 proven, 50 helper-required, zero failures**. Every within-budget no-helper search completes without a clear; no resource exhaustion is treated as success. Five capstones have distinct identity-independent dependency motifs; combined boards have no disconnected solo resident.
- Fresh rendered gameplay campaign: **400/400 routes PASS**, including unchanged Level 1/201/301 start checks. `campaign-prepare.cjs --chapter-2` regeneration produces the exact static export. Chapter 1 SHA-256 matches its frozen baseline; `git diff --check` passes.
- All 50 final proposal definitions captured and layout-checked at **320×568 Large Text / 390×844 Normal, Reduced Motion**. Actual piece/D-pad optimal clears on **51/52/54/55/58/67/79/96/100** pass. Initial/setup frames sampled and inspected for **51/52/54/55/58/61/67/68/73/81/86/87/90/92/93/94/95/96/97/98/99/100**, including all five capstones. Temporary evidence: `test-artifacts/campaign/proposal-captures/`.
- Conceptual progression reviewed through individual helper roles, relocations, connected relays and delayed captures. Ten-level median shortest lengths rise **8.5 → 10 → 10.5 → 14 → 14.5**; these numbers are corroborating evidence, not proof of human difficulty/enjoyment.
- Curriculum review refined 52/54/55 after the first export: keep 51 as a reminder, teach relocation at 52, early helper release at 53, reciprocal roles at 54, and vacating/rebuilding the helper corridor at 55. Fresh chapter contract observed RED on the three earlier variants, then GREEN on their replacements. Level 55 is an explicitly documented eight-move introductory-to-practice bridge, with unchanged allowance; searches at six/seven moves did not produce a qualified version. No claim of general mathematical impossibility or human difficulty certification. Both the initial `3dac463` and refined `0d7bd66` product trees passed all 17 suites.
- Acceptance hardening: switch/door is one linked-state class for the finale; pending visual evidence cannot certify a chapter; incomplete or unreviewed author intentions cannot be automatically exported. New regressions observed RED then GREEN.

Refined Lanternwood full `npm test`: **17 suites PASS**, session 98340 exit 0; full log in this plan's scratch `task-3-refined-suite.log`. Chapter 1 hash unchanged; fresh proof/route/format tests PASS. This closes Chapter 2 acceptance, not the complete campaign program or physical-player validation.

Remaining: author/review/export Chapters 3–8; stage-accurate teaching/Daily compatibility; current-state Hint and grandfathered-save regressions; all final-ten Aurora design reviews; all 400 fresh proofs and rendered routes; final regression and phone/motion matrix; independent whole-branch review and exact-head pushed CI. Historical baseline tests need full Git history in CI (`fetch-depth: 0`) when added to `npm test`.

### Lodestone static export — targeted evidence

- All 50 slots have individual intentions in `docs/campaign/lodestone-intentions.json`, decoded inputs in `docs/campaign/authoring/chapter-3.json`, and fresh records in the acceptance manifest. Eleven retained designs: 101/104/105/109/110/111/112/113/114/115/123; 39 replaced or repaired. Level 106's adjacent rock was removed so Gold's anchor placement genuinely stops Blue, in six moves.
- Fresh `accept.cjs --chapter 3`: **50 reviewed, 50 proven, zero failures**. Combined boards 116–150 have actual anchor/helper connections and no equally short helper-free clear. Natural edge stops cannot falsely certify anchor placement. All five capstone dependency ideas are distinct; no canonical or near-clone flags against Chapters 1–3.
- `campaign-prepare.cjs --chapter-3` observed RED before authoring existed, then GREEN on the exact export and retained/replaced decision round-trip. All **400 rendered campaign routes PASS**. Chapter 1 SHA-256 still matches its frozen baseline. Targeted tools/originality/anchor/permission tests pass.
- All 50 boards layout-checked and captured at **320×568 Large Text / 390×844 Normal, Reduced Motion**. Actual-control three-star clears: **101/108/117/129/146/150**. Initial frames inspected for **101/106/108/117/129/146/147/148/149/150**, including every capstone; setup frames for **146/150**. Temporary evidence: `test-artifacts/campaign/lodestone-captures/`. No controls, CSS clearance assertions or runtime movement rules changed.
- Ten-level median optima **5 → 8 → 9.5 → 11.5 → 13.5**, corroborating the individual setup/capture-order review, not certifying human difficulty. Physical devices and player enjoyment remain unverified.
- Chapter regression **PASS, all 17 suites**, session 82499 exit 0; exact full log `task-4-suite.log`. Chapters 4–8 and final compatibility/review/CI tasks remain unfinished. Offline permission tooling and partial Masquerade author notes are preparation, not Chapter 4 acceptance. The proposal harness now also checks actual resident/nest suit SVG agreement; its 32-board Masquerade rerun passes, including shared-suit and shared-color introductions.

Physical iOS/Android, assistive technology, speaker/headphone and player difficulty/enjoyment checks remain unverified. No completion or publication claim is made here.
