# Development Handoff

## REPOSITORY ACCESS PRE-FLIGHT — HARD GATE

For repository work, GitHub is the canonical path. If GitHub repository functions are not already loaded, the first tool action for a repository task must be connector/plugin discovery for `GitHub`. Read this file through the GitHub connector before using a local checkout. If the wrong route is attempted first, recover immediately through GitHub and continue the original request without asking the user to repeat the plugin instruction. See `AGENTS.md` and `.github/REPOSITORY_ACCESS_PREFLIGHT.md`.

## Current state — 2026-09-29

**IN PROGRESS: implement the player's approved September 29 independent audit repairs A1–A13.** Work stays on the audit branch; no merge/deployment. Order: contrast/UI layering/grounding/resize and labels; short-phone motives and earned story continuity; six bounded action scenes and shared miniature materials/framing; complete regression and visual verification. Existing local resize fix and compact handoff draft are included in this approved follow-up. Preserve unrelated `test-artifacts/` evidence.

Baseline: clean published `63fa4cf` full `npm test` passed all 16 suites on retry, all 400 routes passed, campaign diff was empty. First full attempt had a 30s navigation timeout before assertions; root cause unestablished. Audit evidence/report: `C:/RetroRig_Codex_Handoff/audit-latchlings/final-audit-20260929/`. This audit reopened visual/readability/earned-knowledge gaps despite passing functional tests; the older completion records are historical, not closure of A1–A13.

- Repository: `maloysius-wq/latchlings`; working branch: `codex/audit-polish-20260924`. The last published head is `63fa4cf31a559207e98c1795cc1e722879792b15`. Do not merge or deploy without a separate player instruction.
- The approved game-polish execution guide (`docs/superpowers/plans/2026-09-24-game-polish-execution-guide.md`) is complete through reliability/gameplay, phone presentation, and story staging. The branch remains unmerged.
- An independent follow-up review found a mid-flight Opening resize timing error: the resumed signal animation applied the remaining fraction twice. A focused browser regression failed against `63fa4cf` (733 ms remained, but the new animation lasted 337 ms), and passed after a local fix to retain the actual remaining time. Full-suite and branch CI verification for this follow-up are pending. The existing untracked `test-artifacts/` directory is user evidence; preserve it.

## Product contracts

- Preserve all 400 authored campaign levels, solutions, move/star rules, and campaign/Daily progress isolation. The eight `campaign400-*.js` files are protected by the hashes below.
- Preserve the player-paced 21-line Opening, tap/keyboard advancement for every spoken line, the canonical title-screen Little Home and measured porch, Story replay/Skip, and Reduced Motion and Large Text behavior. There is no narrator voice.
- Keep the accepted pre-Astra Reset/D-pad/Hint puzzle controls. Do not add Undo.
- Preserve route endpoints, resident/landmark/dialogue clearances, the 320×568 Large Text board/Route Tip gap, earned and immediately skippable Level 50/100/150/200 rewards, and the Level 400 parcel's measured arrival at the canonical porch.

## Source and checks

- Opening scene and motion: `opening-cinematic400.js`, `style400-opening-cinematic.css`, `tests/opening-world-coherence.browser.cjs`.
- Other films and map/Homeward staging: `cinematics400.js`, `style400-cinematics.css`, `tests/story-staging.browser.cjs`.
- Milestone rewards and ending: `style400-production-slice.css`, `style400-ui.css`, `tests/story-payoffs.browser.cjs`.
- The shipped `npm test` command runs 16 browser suites, including all 400 authored routes, progress/Daily isolation, current-board hints, phone layouts, cinematics, rewards, and the ending. Check `git diff --check` and compare the campaign hashes below before closing a code change.

At `63fa4cf`, full `npm test`, the 180-capture phone viewport/motion matrix, campaign hash comparison, and `git diff --check` passed. GitHub [Validate Game](https://github.com/maloysius-wq/latchlings/actions/runs/36466555603) and [Repository Access Guard](https://github.com/maloysius-wq/latchlings/actions/runs/36466555599) both passed on that exact head. Settled and moving screenshots were reviewed at 320×568, 390×844, and 430×932 for Opening, Across the Drift, dated maps, Homeward, four rewards, Levels 1 and 366, and Level 400, including Large Text, Reduced Motion, and dialogue visible/hidden. Captures are local temporary files, not repository assets.

### Protected campaign SHA-256 baseline

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

## Remaining work and evidence limits

- The acceptance matrix marks V04 material consistency **PARTIAL**: regular non-reward Story props and small Atlas landmarks still differ from the textured Little Home style. This is deferred art direction, not a gameplay regression. Keep the current 21-tap Opening until player testing calls for a pacing change.
- Physical iOS/Android touch, safe-area and performance checks; real screen-reader use; and subjective audio balance on speakers/headphones remain **unverified**. Browser tests do not establish those results.

## History and stage completion index

The complete pre-compaction handoff, including every old commit, failure, screenshot path, and CI run, is preserved in [the `63fa4cf` Git revision](https://github.com/maloysius-wq/latchlings/blob/63fa4cf31a559207e98c1795cc1e722879792b15/DEVELOPMENT_HANDOFF.md). Earlier history is in `DEVELOPMENT_HANDOFF_ARCHIVE_*.md`. For ordinary work, use this short handoff and current code; open the historical revision only when its provenance is needed. The original audit and item-by-item reconciliation remain in `LATCHLINGS_VISUAL_STORY_AUDIT.md` and `ASTRA_AUDIT_ACCEPTANCE_MATRIX.md`.

### Reliability/gameplay stage

Completed 2026-09-24; details and baseline failure evidence are in the pre-compaction handoff linked above and `docs/superpowers/plans/2026-09-24-reliability-gameplay.md`.

### Phone Presentation completion evidence

Completed 2026-09-24; the 180-case matrix and commit evidence are in the pre-compaction handoff and `docs/superpowers/plans/2026-09-24-phone-presentation.md`.

### Story Staging / Game Polish final verification

Completed 2026-09-25, with final visual polish verified on 2026-09-28 at `63fa4cf`; details are in the pre-compaction handoff and `docs/superpowers/plans/2026-09-24-story-staging.md`.
