from pathlib import Path
p=Path('DEVELOPMENT_HANDOFF.md');t=p.read_text()
heading='### 2026-09-03 — Reduce story interruptions, unify Little Home background, and add screen whoosh transitions'
start=t.find(heading)
if start<0: raise SystemExit('handoff entry missing')
end=t.find('\n---',start)
if end<0: raise SystemExit('handoff terminator missing')
section=t[start:end]
if '**Status: COMPLETED**' not in section:
    if '**Status: IN PROGRESS**' not in section: raise SystemExit('IN PROGRESS status missing')
    section=section.replace('**Status: IN PROGRESS**','**Status: COMPLETED**',1)
    section += r'''

#### Completion summary

**Story interruption cadence:** Story Cards remain available for all 400 levels from the persistent book button, but routine levels no longer auto-interrupt play. Automatic Story Cards now occur only at the first level of each 50-level chapter and at local Levels 10, 20, 30, 40, and 50. Static/runtime validation counted exactly 48 automatic story moments across the 400-level campaign. Routine Level 2 was explicitly verified not to auto-open; its book button still opened the correct manual story. Turning-point Level 10 auto-opened, was labeled `Turning point`, and did not repeat after being acknowledged. Chapter-opening Level 51 auto-opened and was labeled `Chapter opening`.

**Little Home background fix:** Production Home now owns a full-viewport version of the approved Little Home sky treatment. While Home is active, the legacy global `#app` cloud pseudo-elements and chapter material backdrop are suppressed, the old production wrapper shadow/frame is removed, and the embedded Little Home composition stays centered over the same continuous sky. The approved title animation, island, residents, controls, and progression scene were not altered. Browser validation covered 390×844, 360×740, and 1365×768; the wide render measured Home at the full 1365×768 viewport with the centered Little Home scene at approximately 355×768 and no panel shadow or horizontal overflow.

**Blurry whoosh transitions:** Added a reusable `screenWhoosh` visual layer plus destination settle animation to the shared `screen(...)` navigation path. A genuine screen change switches the functional target immediately, then runs a ~420 ms sweeping translucent blur/streak veil and a ~390 ms destination blur/translate settle. Same-screen calls do not replay the effect. Home, Levels, Game, Story, and other routes using `screen(...)` inherit it automatically. Under `prefers-reduced-motion: reduce`, the whoosh layer is hidden and navigation remains immediate with no arrival animation.

**Validation:** GitHub Actions run `33805875080` completed successfully. Static gates reported `STORY_CADENCE_HOME_TRANSITION_STATIC_OK` and `AUTO_STORY_48_OK`; campaign files `campaign400-1.js` through `campaign400-8.js`, `story400.js`, and `title-island-concepts/index.html` were diff-checked unchanged. Chromium reported `STORY_CADENCE_HOME_TRANSITION_OK`, covering continuous Home backgrounds at phone/wide/compact sizes, real iframe Level Select navigation, active whoosh + arrival animations, same-screen non-replay, 48-level auto-story eligibility, routine/manual/turning-point/chapter-opening Story behavior, Story/Home routing, reduced motion, no horizontal overflow, and no non-media browser/request errors.

**Rendered review:** Artifact `9912899051` (`story-cadence-home-transition-renders`) contains five renders: phone Home, compact Home, wide Home, a mid-whoosh transition frame, and a chapter-opening Story Card. The artifact was downloaded and visually inspected. The wide Home render is now a single continuous Little Home sky with no old-background seam or floating phone shadow; the transition capture shows the requested strong blurred whoosh obscuring the screen swap before clearing.

**Files changed:** `index.html`, `game400-a.js`, `story-theme400.js`, and `style400-ui.css`. Temporary transformer/validator/workflow files self-removed after the green commit. Campaign data, story data, Little Home source composition, textures, music, and SFX assets were unchanged.

**Implementation commit:** `3d1fb4f4050c88e3c14c17cec312400b2de6043c` (`Refine story cadence home background and screen transitions`).

**Deployment:** GitHub Pages run `33805958028` completed successfully for exact product commit `3d1fb4f4050c88e3c14c17cec312400b2de6043c`. Live production remains `https://maloysius-wq.github.io/latchlings/`.

**Remaining risk / next action:** No blocking issue remains. The only intentionally subjective parameter is transition strength/speed; if user playtesting prefers a faster, softer, or more directional whoosh, that can be tuned independently without touching navigation or puzzle state.
'''
    t=t[:start]+section+t[end:]
p.write_text(t)
print('STORY_CADENCE_HOME_TRANSITION_HANDOFF_CLOSED')
