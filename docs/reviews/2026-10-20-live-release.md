# October20 live release

The player explicitly authorized merge, deployment and live verification, and made publishing to the existing test site part of future approved Latchlings implementation work unless explicitly excluded. This supersedes the earlier branch-only restriction; it is not authorization to skip checks, erase saves or publish unrelated work.

## Published implementation

- Site: https://maloysius-wq.github.io/latchlings/ — GitHub Pages, `main`, repository root.
- Previous main: `c79f39f38987542ea1e904d33d5d4c1b6cd6733e`.
- Reviewed delivery: `7c1796e57d609f100e9aa59294989d22c8971fd3`, both [Validate Game](https://github.com/maloysius-wq/latchlings/actions/runs/39479701591) and [Repository Access Guard](https://github.com/maloysius-wq/latchlings/actions/runs/39479701785) PASS.
- First published release: `ba8f5b91286285190d9199e97781e9a7599d7aec`, a fast-forward of main containing the campaign rebuild and earned economy. Its only change after the reviewed delivery is the handoff's release authorization. No new runtime/test code or level definitions were introduced for release.
- [Pages build/deployment39482075383](https://github.com/maloysius-wq/latchlings/actions/runs/39482075383) PASS. Pages API reported the exact release commit `built`, with no error. [Release access guard39482078491](https://github.com/maloysius-wq/latchlings/actions/runs/39482078491) PASS.
- [Release game CI39482078483](https://github.com/maloysius-wq/latchlings/actions/runs/39482078483) was running when this documentation closeout was written. This closeout is documentation-only and automatically gets its own CI/Pages run. Verify and report the exact final Pages commit and CI results in the delivery response; do not add another self-referential documentation commit merely to embed its own SHA.

## Actual live checks — PASS

The release smoke script fetched all19 changed public HTML/JS/CSS assets relative to previous main and matched every response byte-for-byte by SHA-256 against the release commit. This includes all seven rebuilt campaign files and every changed economy runtime, parent page and Home iframe document.

Fresh isolated live Chrome contexts at320×568 Large Text/Reduced Motion,390×844 normal and430×932 normal verified:

- Home wallet starts at20/20 energy and0 coins; opening wallet and viewing a board are free.
- Actual Home iframe Play opens the cinematic. First-run Skip works at320/430px; all21 tapped Opening lines complete at390px. The level Story card then leads to Level1.
- A hint purchase is disabled at0 coins and cancel changes nothing.
- An actual resident/D-pad solution clears Level1, spends exactly1 energy and earns30 coins for three stars.
- Replay preview spends no extra energy. A confirmed, successfully shown hint costs15 coins; the same-board cached hint reopens free.
- Reload preserves19 energy,15 coins and the three-star accounted claim. No client script errors or HTTP errors were observed.

Twelve screenshots were captured (Home, Opening, clear and hint at each size). Home320, hint390 and clear430 were visually inspected. The Home wallet remains outside the island art, the original Reset/D-pad/Hint controls remain visible, and the earned30-coin result is readable.

Local evidence: `test-artifacts/economy/release-20261020/live-smoke.cjs`, `live-smoke.log`, `report.json`, screenshots and CI logs alongside them. These generated artifacts are not shipped game assets. Unrelated pre-existing `debug.log` and `test-artifacts/` content are preserved. The existing feature branch is retained.

## Limits

Full44-suite source regression,61 financial cases and294 economy UI captures are documented in `2026-10-19-energy-currency.md`; this live smoke is focused release verification, not a repetition of that complete matrix. No physical iOS/Android touch/background-recharge certification, real screen-reader, speaker/headphone or human difficulty/economy-balance playtesting was performed. Recharge timing remains one tap inside wallet details rather than directly on Home/Atlas strips. No voice playback, Undo, payments or ads were added.
