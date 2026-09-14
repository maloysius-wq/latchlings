# Development Handoff

## Repository access preflight
GitHub is the canonical repository path for this project. Read this handoff first, then inspect the repository through the connected GitHub tools before doing repository work. If GitHub repository functions are not already loaded, discover/load them before attempting another repository route. Local clone or filesystem failure is not evidence that GitHub is unavailable. If the wrong route is attempted first, recover immediately through GitHub and continue the original request without asking the user to repeat the plugin instruction.

## Current work

### Astra audit R1-R5 usability pass
**Status: IN PROGRESS**

User goal: finish the repository-wide R1-R5 usability correction pass and stay with it through validation, promotion, cleanup, deployment, and closeout.

Scope:
- R1: make always-visible story rails and route teaching readable without clipping across all 400 campaign levels, including 320x568 phones.
- R2: make Little Home resident motion honor the in-game Reduced Motion preference and pause while the Home scene is inactive.
- R3: make hint highlights begin only after returning to the board and persist until the player acts or resets.
- R4: make Large Text materially enlarge essential story, mechanic, modal, journal, narration, and dialogue copy.
- R5: keep cinematic progress, Skip, and Continue navigation persistently visible on short phones for all 25 cinematic beats.

Protected systems: all authored campaign data (`campaign400-1.js` through `campaign400-8.js`), `story400.js`, `story-grounding400.js`, `STORY_BIBLE.md`, and accepted Pass 3 Chapter 5-8 modules remain unchanged.

Accepted candidate:
- candidate head: `b6878a609abbbba5f0108fc847bfd5130036dfae`
- prepare workflow run: `34853875229` / run 23, success
- prepared artifact: `audit-r1-r5-prepared`, artifact `10351851928`, SHA-256 `c3fdf5039806dc3bbd9ea27cdab250a8d9e9726012e151a57515fa7220523424`
- validation workflow run: `34853875486` / run 17, success
- evidence artifact: `audit-r1-r5-candidate-evidence`, artifact `10351722573`, SHA-256 `b66e5f24d9053e497cbaec47955ee3149bd42956cef1e3b044fbc35a0968ae8b`
- exact accepted candidate blobs were promoted in commit `f241d816242f245c0ea41ad3c33dd9d496d7c849` (`Promote accepted Astra audit R1-R5 candidate`).
- the active promotion lineage places this handoff directly on top of that exact product commit before committed-live validation.

Candidate acceptance results:
- 390x844 Normal and Large Text: all 400 story rails/mechanic tips pass clipping and containment checks.
- 320x568 Normal and Large Text: all 400 story rails/mechanic tips pass clipping and containment checks.
- Level 201 at 320x568 Large Text: document/body width 320; controls top 404.375, bottom 545.375; minimum active target 44.796875 px.
- R2: Reduced Motion leaves adult resident move counts `[0,0,0]`, scheduler `paused`, CSS child animation `none`; System motion resumes deliberate resident movement; leaving Home pauses the scheduler again.
- R3: hint stays absent while the modal is read, appears only after Back to board, remains after another 3.9 seconds, and clears on the suggested interaction.
- R4 ancillary copy: Normal story/modal/dialogue/narration = 13/16/13/11.2 px; Large = 16/18/16/15 px.
- R5: all 25 cinematic beats keep persistent footer navigation visible at 320x568.
- authored solution smoke passes Levels 1, 50, 100, 150, 200, 250, 300, 350, and 400.
- Daily isolation smoke passes with campaign progress/cinematic state unchanged and no campaign visual slice applied.
- browser acceptance completed with `R1-R5 ACCEPTANCE PASSED` and no reported browser errors.

Implementation summary:
- `style400-story-rail-board.css`: wrapping/overflow fixes, one-row narrow-phone rail, Large Text dimensions, compact short-phone chrome while retaining >=44 px controls.
- `style400-story-theme.css`: mechanic teaching copy cannot be line-clamped/ellipsized.
- `style400-game.css`: Large Text coverage for essential UI; modal paragraph Large Text is 18 px.
- `gameplay-story-rail400.js`: concise immediate story rail copy for early beats and all 40 movements while full story content remains available in Story surfaces.
- `game400-a.js`: concise chapter-distinct route teaching and expert tip.
- `game400-b.js`: persistent post-modal hint lifecycle with explicit clear-on-interaction/reset behavior.
- `title-island-concepts/index.html`: live in-game/OS motion preference and scene-activity scheduler control.
- `cinematics400.js`: persistent cinematic footer outside scrollable copy.
- `style400-cinematics.css` and `style400-cinematics-dialogue.css`: short-phone persistent navigation plus Large Text narration/dialogue support.
- `index.html`: cache-busts only changed audit-pass assets.

Remaining closeout plan:
1. validate the committed product directly, not a regenerated candidate, with the same R1-R5/solution/Daily protections.
2. manually review representative evidence screenshots.
3. remove all temporary R1-R5 preparation/validation workflows and helpers.
4. update this entry to COMPLETED with live run/deployment evidence.
5. certify the exact final head with GitHub Pages and the permanent repository-access guard.

No known product blocker at this point. The accepted candidate has passed the full candidate gate; committed-live acceptance and closeout remain.

## Durable project state
- The eight-chapter Pass 3 visual/story campaign is complete and protected.
- Prior detailed development history is preserved in the dated `DEVELOPMENT_HANDOFF_ARCHIVE_*` files.
- `LEVEL_SELECT_ART_DIRECTION.md` and `STORY_BIBLE.md` remain durable art/story references.
