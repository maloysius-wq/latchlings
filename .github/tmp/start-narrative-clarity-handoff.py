from pathlib import Path
p=Path('DEVELOPMENT_HANDOFF.md')
s=p.read_text()
marker='## Current Work\n'
heading='### 2026-09-11 — Campaign-wide narrative clarity overhaul'
entry='''
### 2026-09-11 — Campaign-wide narrative clarity overhaul

**Status: IN PROGRESS**

**User goal:** Deeply audit and strengthen the entire 400-level narrative so the player clearly understands the five Little Home residents, what is happening, why the Waykeeper is there, what each chapter represents, the growing stakes, the systemic/no-villain antagonist, the evolving objective, and the final living-Skyway payoff. The opening scene should do substantially more character/world/goal work while staying player-paced and skippable.

**Audit findings before implementation:** The story bible is stronger than current delivery. The opening establishes drift/Skyway basics but does not clearly dramatize why the Waykeeper answered Little Home or why these five residents are the ones who recognized the pattern. Chapter 1 Levels 1–20 have bespoke sequential rail dialogue, but later play largely reuses the same ten local errand lines each ten-level movement. Automatic Story Cards occur at Level 1 and levels ending in 0, so they pre-announce turning points rather than introducing each 10-level movement, and their flavor is generic rather than the chapter arc. Stronger milestone text is mostly confined to the post-win modal. Atlas blurbs do not show the active story question. Story & Residents lacks why-you-are-here, evolving goal, what-we-know, and journey-so-far recap. The Level 400 ending is accurate but brief. Opening text is duplicated between `cinematics400.js` and `cinematic-dialogue400.js`, risking source drift.

**Implementation plan:** (1) Enrich the production story model with Waykeeper arrival/role, evolving campaign pressure/goal, and five explicit narrative movements per chapter. (2) Expand the opening into a stronger sequence that introduces all five residents and their evidence, dramatizes matching route failures, shows Little Home sending a Waykeeper call and the player answering it, explains community helper crews, teaches the universal board language, and ends on a concrete Sunpetal objective. Centralize opening dialogue in the cinematic source. (3) Move automatic Story Card framing to Levels 1/11/21/31/41 and show current question + why it matters without spoiling the payoff. (4) Add the active movement thread to the compact gameplay story rail. (5) Make 10-level victory milestones visually explicit discoveries/results with next leads and stronger chapter-50 bridges. (6) Add a compact narrative objective to each Atlas chapter header. (7) Turn Story & Residents into a spoiler-safe campaign briefing/catch-up screen with why the Waykeeper is here, current objective/knowledge/question, journey-so-far, and richer resident contributions. (8) Strengthen `Skyway Restored` so the full thesis lands. (9) Update `CINEMATICS_SCRIPT.md` and `STORY_BIBLE.md` delivery guidance to match production.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`; `story400.js` and/or `story-grounding400.js`; `cinematics400.js`, `cinematic-dialogue400.js`, `CINEMATICS_SCRIPT.md`; `story-theme400.js`, `gameplay-story-rail400.js`; `game400-a.js`, `game400-b.js`; `index.html`; existing story/rail/Atlas UI CSS as needed; `STORY_BIBLE.md`; temporary self-removing validation helpers. Puzzle definitions/solver logic, Little Home movement, music/SFX, and Atlas camera motion are out of scope.

**Validation plan:** Browser-drive a narrative acceptance matrix at phone size/DPR 1 and 3. Reset and replay the opening beat-by-beat, asserting all five residents/roles, Waykeeper call/arrival, initial objective, stable narration/dialogue, Continue/Skip, and reduced-motion completeness. Verify auto Story Cards at 1/11/21/31/41 but not 10/20/30/40/50; representative story rails across all eight chapters/five movements; all 40 milestone beats; all eight Atlas objectives; Story & Residents at early/mid/late progress; later cinematics; and Level 400 payoff. Fail on spoilers, missing objectives, contradictory duplicate opening copy, layout overflow, page errors, or protected gameplay/audio/Little Home regressions. Capture screenshots plus a machine-readable audit artifact.

**Deployment plan:** Commit this IN PROGRESS entry before product edits, implement through GitHub, validate through temporary self-removing Actions helpers, commit only accepted files, deploy clean accepted state to Pages, then close this entry with exact commits/runs/artifact/coverage and verify only the permanent repository-access guard remains.

'''
if heading not in s:
    p.write_text(s.replace(marker,marker+entry,1))
