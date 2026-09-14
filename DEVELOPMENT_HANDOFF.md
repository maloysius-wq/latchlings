# Latchlings Development Handoff

Last updated: 2026-09-13

## Start here

This repository is the source of truth for **Latchlings**.

- Repository: `maloysius-wq/latchlings`
- Live build: `https://maloysius-wq.github.io/latchlings/`
- Runtime: intended 400-level themed campaign on `main`
- Full historical journal through completed Pass 3 Chapter 4: `DEVELOPMENT_HANDOFF_ARCHIVE_2026-09-12.md`
- Full active-journal history through completed Pass 3 Chapter 6: `DEVELOPMENT_HANDOFF_ARCHIVE_2026-09-13_CH6.md`

Always inspect current `main`, `index.html`, and this handoff before changing anything. Read the dated archives when older implementation history or validation evidence is needed. The Chapter 6 archive preserves the previous live handoff byte-for-byte.

### REPOSITORY ACCESS PRE-FLIGHT — HARD GATE

For **all repository work in this project**, the connected **GitHub plugin/connector is the canonical and first-line repository path**. If GitHub functions are not already loaded, the first tool action for a repository task must be connector/plugin discovery for `GitHub`. The first repository read must be `DEVELOPMENT_HANDOFF.md` through `GitHub.fetch_file` or equivalent.

A failed local clone, missing checkout, container DNS failure, generic web failure, raw-GitHub failure, or absence of preloaded GitHub functions is never evidence that GitHub access is unavailable. An agent may claim GitHub is unavailable only after GitHub plugin discovery has explicitly been attempted and a real GitHub connector repository read cannot be invoked or fails.

Read `AGENTS.md` and `.github/REPOSITORY_ACCESS_PREFLIGHT.md` for the durable preflight contract. The repository guard workflow validates that these instructions remain present.

## MANDATORY handoff workflow

For every substantive repository task:

1. Read this file and inspect current `main` through GitHub.
2. Before implementation, add/update a `Current Work` entry with date, user goal, implementation plan, expected files/systems, validation plan, deployment plan, and `IN PROGRESS` status.
3. Commit that handoff update before implementation begins.
4. If scope changes materially, update the handoff again while work is underway.
5. After implementation, update the same entry to `COMPLETED`, `PARTIAL`, or `BLOCKED` and record exact changes, decisions, files, tests, deployment, risks, and next action.
6. Commit the final handoff update after implementation/deployment commits.

If a chat is interrupted, this file must already contain enough detail to resume immediately. Older completed entries belong in the dated archives rather than being discarded.

---

## Current Work

### 2026-09-13 — Pass 3 Chapter 7 Stormswitch campaign application

**Status: COMPLETED**

**User goal:** Continue the approved Pass 3 chapter-by-chapter visual/story rollout through Chapter 7, Stormswitch Foundry / Coming Together, campaign Levels 301–350, without changing authored puzzle data or destabilizing Chapters 1–6.

**Implementation shipped:** Chapter 7 now uses self-contained `pass3-chapter7-stormswitch.css` / `pass3-chapter7-stormswitch.js` production assets loaded after the accepted Chapter 5/6 modular layers. Campaign Levels 301–350 map to `stormswitch`; Daily remains neutral; Level 300 remains Copperline; Level 351 stays outside the Stormswitch visual slice; and Level 366 retains the explicit `aurora-dense` override. The five ten-level movements use distinct quiet blue-steel linear plate materials. Switches read as weighted storm-steel control plates with a high-contrast actuator, while closed and open doors retain explicit frame/bar hierarchy without changing simulation. Factory stacks, insulated conduits, lightning-mast language, and storm-lit machinery stay outside the rules layer.

**Story / Atlas / reward payoff:** Movement 3 / `Useful Failure` carries a compact multi-region synchronization relay grounded in the authored distributed-Waykeeper story. Regional signal lamps feed a shared timing-window dial, including an off-phase correction lamp so feedback and adjustment are visible rather than abstract; the landmark was placed in a left-middle Atlas pocket and validated with zero overlap against route nodes. Level 350 now has a dedicated `Waykeepers everywhere` reward that resolves the relay into synchronized signals feeding a small arrival platform / docking beam. Stars remain secondary. `Visit Little Home` focuses the canonical stage-7 `story-dock` with a visible reduced-motion-safe beam/focus treatment. `Begin Homeward` preserves campaign/Atlas bookkeeping and reaches Level 351 with the existing `homeward` cinematic active. `LEVEL_SELECT_ART_DIRECTION.md` records the synchronization relay as durable Chapter 7 language.

**Product / closeout commits:**
- `a4cecd4c1c171f62f305ffa4e00697da4b19491f` — add modular Chapter 7 Stormswitch production CSS.
- `b237dd0b8da882b8568ee360f9c85ae2fcef9eec` — add modular Chapter 7 runtime, Level 350 reward, and Little Home dock focus.
- `2f6d5bc186271aab76220cd6040da62435ada0cb` — record the synchronization relay in durable art direction.
- `177c008feadf1501d10b2757be28e64a90c8bf36` — wire the accepted Chapter 7 assets into the live page with explicit cache keys.
- `502310558d0f574515bd9972936fd85f066e38fd` — committed-live validation workflow revision used for final acceptance.
- `c6dc5209e5af5e9c35fad087ec0d3383274327b7` — remove all Chapter 7 validation/live-preparation workflows and `.github/tmp` helpers; product bytes are unchanged from the accepted live build.

**Candidate validation:** Initial candidate run `34784954657`, job `103798614837`, passed the full automated source-protection/static/browser matrix. Manual review found an evidence-only timing problem: the Level 301 screenshot captured the chapter-opening story card instead of the unobstructed board. No product defect was found. The screenshot timing was corrected and refined candidate run `34785092933`, job `103798990890`, completed successfully. Refined artifact `chapter7-pass3-candidate`, ID `10326422236`, SHA-256 `d4abd8887f1bf57abca04503420fd07c2d15e9be25077237ed964eb8d9126972`, supplied the accepted candidate screenshots and exact CSS/JS bytes used for promotion.

**Committed-live validation:** Run `34785435371`, job `103799945133`, completed successfully against the real committed page. Artifact `chapter7-pass3-live-acceptance`, ID `10326875273`, SHA-256 `25d0854a3988a6e767a6b754f99f736fb18391649ab80e10506a4afa75931e1c`. The gate verified all eight campaign definition files plus shared Chapters 1–6 runtime/story/cinematic/audio/Little Home and Chapter 5/6 modular assets remained unchanged from clean Chapter 6 baseline `8ee722375f68462cc8ee595eaa6870109cd8c5c3`; live Chapter 7 CSS/JS were byte-identical to the refined candidate; the new assets were referenced exactly once in `index.html`; the durable relay art-direction note existed; and the repaired `#storyCast.story-cast` markup remained intact.

**Browser / gameplay acceptance:** Chromium covered Levels 301/310/311/320/321/330/331/340/341/350 at 390×844 plus Levels 301/350 at 320×568. All Chapter 7 representatives mapped to `stormswitch`; all five movement floors were distinct quiet linear materials; cell pseudo-decoration remained suppressed; selected Latchling / matching nest hierarchy stayed explicit; switches and both closed/open door states stayed weighted and readable; Daily remained neutral; Level 300 stayed Copperline; Level 351 stayed outside Stormswitch; and Level 366 retained `aurora-dense`. The movement-3 synchronization relay had zero overlap with Atlas nodes. The validator solved the real authored Level 350 route twice, once through the dedicated reward into the Little Home dock focus and once through the reward into the existing `Homeward` cinematic. Reduced motion reached the same informative dock state without animation dependence. No browser errors occurred.

**Small-phone and manual review:** At both Level 301 and Level 350 on 320×568, document width remained exactly `320px`, controls ran from `422.6875px` to `565.6875px` inside the 568px viewport, and the smallest active control target measured `44.796875px`. Refined-candidate and committed-live screenshots were manually reviewed across all five Stormswitch ranges, the node-clear relay, Level 350 reward, Little Home dock focus, Homeward continuation, and both small-phone endpoints. The final visuals were accepted without product correction.

**Deployment / cleanup:** All temporary Chapter 7 workflows and `.github/tmp` helpers are removed. `.github/workflows` is back to only `validate-repository-access-guard.yml`. Cleanup head before this closeout is `c6dc5209e5af5e9c35fad087ec0d3383274327b7`; because that head was created by a direct ref move, it did not itself trigger Actions. This final handoff commit is therefore the intended exact-head certification point. Verify both GitHub Pages and the permanent repository-access guard succeed on the final closeout head before starting Chapter 8.

**Known blockers / risks:** None for the Chapter 7 product. Three inert temporary staging branches created while assembling the Chapter 7 handoff remain outside `main`; they do not affect product, Pages, validation, or future chapter work. Remove them when branch-ref deletion is available through the connected integration.

**Next Pass 3 action:** After exact-head closeout verification is green, begin Chapter 8, **Aurora Crown / Master Circuit, Levels 351–400**, as a new protected slice. Re-read the current Chapter 8 campaign/story/grounding/cinematic sources first. Use the durable Aurora Crown baseline already in `LEVEL_SELECT_ART_DIRECTION.md`: Snow 02 / pale crystalline ledges, crown-like beacons, star fields, aurora ribbons, and luminous route bridges. Determine the recurring Chapter 8 landmark and final Little Home / campaign payoff from authored story rather than inheriting Stormswitch motifs. Preserve Chapters 1–7, Daily isolation, authored puzzle data, the explicit Level 366 Aurora override, and the established ending semantics. Open the Chapter 8 `IN PROGRESS` handoff before product edits and repeat candidate-first source protection, real Level 400 solution, 320×568, reduced-motion, manual screenshot, cleanup, and exact-head Pages gates.

## Completed checkpoint — Pass 3 Chapter 6 Copperline

**Status: COMPLETED**

- Chapter 6 / Levels 251–300 ship as modular `copperline` production assets with five oxidized-steel movement ranges, weighted rail/turner hardware, the node-clear station archive/timetable landmark, dedicated real-Level-300 reward, and canonical Little Home compass payoff.
- Refined candidate run `34779404826`, job `103783535394`, artifact ID `10325355062`, SHA-256 `39ce978f0e15f0283005332606a022aa88dea29dd674ec5b120ee305b5efac40`, passed after the initial Atlas kiosk overlap was corrected.
- Final live-build validation run `34779823500`, job `103784662772`, artifact ID `10324541061`, SHA-256 `9f1d2fadb85ed62120eae1bc8c71328d0806f4c58828e70e2469dfb37622a44f`, passed the full protected-source/browser/real-Level-300/reward-home/reduced-motion matrix.
- Chapter 6 also repaired the pre-existing Story & Residents duplicate-id markup to the intended `#storyCast.story-cast` element and guards it against regression.
- Final Chapter 6 closeout commit `8ee722375f68462cc8ee595eaa6870109cd8c5c3`; Pages run `34780104401` (1084) and repository-access guard run `34780104831` both succeeded on that exact head.
- Full Chapter 5–6 implementation history remains byte-for-byte in `DEVELOPMENT_HANDOFF_ARCHIVE_2026-09-13_CH6.md`.
