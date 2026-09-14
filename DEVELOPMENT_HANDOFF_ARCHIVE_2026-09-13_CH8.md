# Latchlings Development Handoff

Last updated: 2026-09-13

## Start here

This repository is the source of truth for **Latchlings**.

- Repository: `maloysius-wq/latchlings`
- Live build: `https://maloysius-wq.github.io/latchlings/`
- Runtime: intended 400-level themed campaign on `main`
- Full historical journal through completed Pass 3 Chapter 4: `DEVELOPMENT_HANDOFF_ARCHIVE_2026-09-12.md`
- Full active-journal history through completed Pass 3 Chapter 6: `DEVELOPMENT_HANDOFF_ARCHIVE_2026-09-13_CH6.md`
- Full active-journal history through completed Pass 3 Chapter 7: `DEVELOPMENT_HANDOFF_ARCHIVE_2026-09-13_CH7.md`

Always inspect current `main`, `index.html`, and this handoff before changing anything. Read the dated archives when older implementation history or validation evidence is needed. The Chapter 7 archive preserves the previous live handoff byte-for-byte.

### REPOSITORY ACCESS PRE-FLIGHT — HARD GATE

For **all repository work in this project**, the connected **GitHub plugin/connector is the canonical and first-line repository path**. If GitHub functions are not already loaded, the first tool action for a repository task must be connector/plugin discovery for `GitHub`. The first repository read must be `DEVELOPMENT_HANDOFF.md` through `GitHub.fetch_file` or equivalent.

A failed local clone, missing checkout, container DNS failure, generic web failure, raw-GitHub failure, or absence of preloaded GitHub functions is never evidence that GitHub access is unavailable. An agent may claim GitHub is unavailable only after GitHub plugin discovery has explicitly been attempted and a real GitHub connector repository read cannot be invoked or fails. If the wrong route is attempted first, recover immediately through GitHub and continue the original request without asking the user to repeat the plugin instruction.

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

### 2026-09-13 — Pass 3 Chapter 8 Aurora Crown campaign application

**Status: COMPLETED**

**User goal:** Finish the approved Pass 3 chapter-by-chapter visual/story rollout with Chapter 8, Aurora Crown / Homeward, campaign Levels 351–400, without changing authored puzzle data or destabilizing Chapters 1–7, Daily, or the established campaign ending.

**Certified baseline:** Chapter 7 final closeout head was `7c800131795b75280a7f01c2649817ff7abd7d37`. GitHub Pages run `34794376662` (1104) and repository-access guard run `34794377513` (21) succeeded on that exact SHA. The Chapter 8 IN PROGRESS handoff was committed before product edits at `5a5f77d14d0a6b6a949da309b9575c150e8576f6`, and the previous full Chapter 7 journal was preserved byte-for-byte as `DEVELOPMENT_HANDOFF_ARCHIVE_2026-09-13_CH7.md`.

**Implementation shipped:** Chapter 8 now uses modular `pass3-chapter8-aurora.css` / `pass3-chapter8-aurora.js`, loaded after the accepted Chapter 7 production layer. Campaign Levels 351–400 map to `aurora`; Daily remains neutral; Level 350 remains Stormswitch; and the existing Level 366 `aurora-dense` override remains intact. Five distinct quiet crystalline/snow movement floors correspond to the authored movements `Old and New Together`, `Back on the Same Map`, `Visiting Without a Crisis Plan`, `One Node Among Many`, and `Tomorrow’s Route`. Rule-space cell decoration remains linear and non-symbolic, while aurora ribbons, crystal forms, beacons, star-field language, and luminous-route scenery remain outside puzzle semantics. Full-mechanic readability was strengthened on pale surfaces for anchors, suit/color gates, rails/turners, switches, closed/open doors, selected Latchlings, and matching nests without changing simulation.

**Story / Atlas / finale payoff:** Movement 1 carries a crown-shaped convergence beacon where historical and newly drawn route-light strands meet and visibly continue onward. This encodes the authored truth that Aurora Crown is a meeting point, not a master switch. The first candidate placement overlapped Level 354; it was moved to a lower-left Atlas pocket and the refined placement has zero node overlap. `LEVEL_SELECT_ART_DIRECTION.md` records this convergence beacon as the durable Chapter 8 landmark. Level 400 now has a dedicated `Skyway Restored` reward whose Crown beacon sends four route strands outward toward multiple communities. Its text explicitly preserves drift, distributed Waykeeping, and the lack of both a master switch and final map. `Visit Little Home` focuses the canonical stage-8 distant islands with visible living-route lights, while reduced motion preserves the same information without animation dependence. `See the living Skyway` preserves base completion bookkeeping and reaches the existing protected campaign-complete screen unchanged: `No master switch`, `No final map`, `A living Skyway`, and `Ordinary life continues. That is the victory.`

**Product / closeout commits:**
- `f0768d38deecb72c7d9102a71b518c0ee8e13463` — add modular Chapter 8 Aurora runtime, Level 400 reward, Little Home final-state focus, and completion handoff.
- `3d0eb176c03a806f9a4f754f83224cbeb13d8b6a` — add initial Chapter 8 Aurora production styles.
- `59eb5883f12630949d8dda4e23cef809043999d9` — move the convergence beacon clear of Level 354 while leaving the accepted board/reward language unchanged.
- `6d1b37be1959a413126fc560120972d6a2ff8879` — wire the exact accepted Chapter 8 assets into `index.html` with explicit cache keys and add the durable convergence-beacon art-direction note.
- `d589e48a8807db01bd3377f77b1654ded4a50ec4` — committed-live validation workflow revision used for final acceptance.
- `275f1a770c85e57262271949b131172b7b49df7d` — remove all Chapter 8 validation/evidence/live-preparation workflows and `.github/tmp` helpers; product bytes remain unchanged from accepted live validation.

**Candidate validation:** Initial candidate run `34795237529`, job `103826912667`, protected authored/source files and static checks successfully but rejected the candidate because the first convergence-beacon position overlapped Level 354. No puzzle/story/runtime defect was found. After relocating only the landmark, refined candidate run `34795509589`, job `103827696792`, completed successfully. Artifact `chapter8-pass3-candidate`, ID `10329009099`, SHA-256 `40526db8ef41ef1648d6a15efdde2c60d23126af986007f1910839162156bdb6`, supplied the accepted CSS/JS and main visual evidence. Manual review found two evidence-timing artifacts only: Level 351’s screenshot caught its opening story card, and the completion screenshot caught the normal outgoing screen transition. A no-product-change evidence supplement run `34795674443`, job `103828178093`, artifact ID `10329861502`, SHA-256 `80b85fcfb59e0b3d967776214ed6e0984bd4d8c1dce493530067f15384834dcb`, captured settled Level 351 boards and the fully settled completion screen. Those replacement screenshots were accepted.

**Committed-live validation:** Run `34795958399`, job `103828976846`, completed successfully against the actual committed live page. Artifact `chapter8-pass3-live-acceptance`, ID `10329483810`, SHA-256 `73b78efa3554e0f18933493b146e6bd4ac842c422e53208ab7cf1e6aa5dfc96b`. The gate verified all eight authored campaign files plus shared Chapters 1–7 runtime/story/cinematic/audio/Little Home/modular assets remained unchanged from certified Chapter 7 baseline. It also pinned the live Chapter 8 product to the accepted candidate hashes: CSS SHA-256 `3d47ec706859f61475255fb7966ff953e5ead916d998b032bb1bc82b05be9873` and JS SHA-256 `2a0bac563a598716a31875d641478f88730120a83f79a9a624e50a94df5096bc`. The live cache-keyed assets appeared exactly once in `index.html`, the durable beacon note existed, the repaired `#storyCast.story-cast` markup remained intact, and the protected ending copy remained unchanged.

**Browser / gameplay acceptance:** Chromium covered Levels 351/360/361/370/371/380/381/390/391/400 at 390×844 plus Levels 351/400 at 320×568. All standard Chapter 8 representatives mapped to `aurora`; all five movement floors were distinct quiet linear materials; cell pseudo-decoration stayed suppressed; selected Latchling / matching nest hierarchy stayed explicit; and anchors, gates, rails, turners, switches, and both closed/open door states remained readable. Daily stayed neutral; Level 350 stayed Stormswitch; Level 366 retained `aurora-dense`; and the movement-1 convergence beacon had zero overlap with Atlas nodes. The validator solved the real authored Level 400 route twice, once through the dedicated reward into Little Home’s stage-8 distant-island focus and once through the dedicated reward into the existing protected `complete` screen. Reduced motion reached the same informative home state without animation dependence. No browser errors occurred.

**Small-phone and manual review:** At both Level 351 and Level 400 on 320×568, document width remained exactly `320px`, controls ran from `422.6875px` to `565.6875px` inside the 568px viewport, and the smallest active control target measured `44.796875px`. Refined-candidate and committed-live screenshots were manually reviewed across all five Aurora movement families, the node-clear convergence beacon, Level 400 reward, Little Home living-Skyway focus, the settled campaign-complete screen, and both small-phone endpoints. The final visuals were accepted without further product correction.

**Deployment / cleanup:** All temporary Chapter 8 workflows and `.github/tmp` helpers are removed. `.github/workflows` is back to only `validate-repository-access-guard.yml`, and `.github/tmp` no longer exists. Clean product head `275f1a770c85e57262271949b131172b7b49df7d` deployed successfully via GitHub Pages run `34796127274` (1117). This handoff closeout commit must receive one final exact-head Pages deployment and repository-access guard success before Pass 3 is declared fully certified.

**Known blockers / risks:** None for the Chapter 8 product. The established authored campaign ending is unchanged. Three inert Chapter 7 staging branches may still exist outside `main`; they do not affect product, Pages, validation, or release behavior.

**Next action after exact-head certification:** Pass 3 chapter-by-chapter rollout is complete across Chapters 1–8. Do not begin another chapter slice. The recommended next repository task is a release-grade full-campaign regression/final visual audit across the entire 400-level product, including a sampled cross-chapter smoke matrix, first-run/new-save flow, Daily isolation, Story & Residents, cinematic replay, Little Home progression stages, final completion/restart navigation, asset/cache integrity, and final production cleanup. Open a new IN PROGRESS handoff before starting that work.

## Completed checkpoint — Pass 3 Chapter 7 Stormswitch

**Status: COMPLETED**

- Chapter 7 / Levels 301–350 ship as modular `stormswitch` assets with five blue-steel movement ranges, weighted switches/doors, the node-clear multi-region synchronization relay, dedicated real-Level-350 reward, and canonical Little Home dock payoff.
- Refined candidate run `34785092933`, job `103798990890`, artifact ID `10326422236`, SHA-256 `d4abd8887f1bf57abca04503420fd07c2d15e9be25077237ed964eb8d9126972`, passed after an evidence-only Level 301 screenshot timing correction.
- Final live-build validation run `34785435371`, job `103799945133`, artifact ID `10326875273`, SHA-256 `25d0854a3988a6e767a6b754f99f736fb18391649ab80e10506a4afa75931e1c`, passed protected-source, full browser, real-Level-350, reward/home/reduced-motion/Homeward continuation checks.
- Temporary Chapter 7 workflows/helpers are removed; `.github/workflows` returned to the permanent repository-access guard only.
- Final certified Chapter 7 head `7c800131795b75280a7f01c2649817ff7abd7d37`; Pages run `34794376662` and repository-access guard run `34794377513` both succeeded on that exact head.
- Full Chapter 7 implementation history remains byte-for-byte in `DEVELOPMENT_HANDOFF_ARCHIVE_2026-09-13_CH7.md`.

**Next action:** Chapter 8 is complete pending only this closeout head’s final Pages/access-guard certification. After those exact-head checks are green, the chapter-by-chapter Pass 3 rollout is complete.