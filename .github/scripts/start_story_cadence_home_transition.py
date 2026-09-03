from pathlib import Path
p=Path('DEVELOPMENT_HANDOFF.md')
t=p.read_text()
heading='### 2026-09-03 — Reduce story interruptions, unify Little Home background, and add screen whoosh transitions'
if heading not in t:
    marker='## Current Work\n'
    i=t.index(marker)+len(marker)
    entry=r'''

### 2026-09-03 — Reduce story interruptions, unify Little Home background, and add screen whoosh transitions

**Status: IN PROGRESS**

**User goal:** Make the new story presentation less interruptive, fix the production Little Home title screen so its sky/background truly fills the whole viewport instead of appearing as a portrait layer over the legacy global background, and add a polished blurry whoosh transition between major screens.

**Story cadence plan:** Keep every level's story metadata and the persistent book/story control, but stop auto-opening a Story Card on every unseen routine level. Auto-open only chapter openings (local Level 1 of each 50-level chapter) and the existing major turning points (local Levels 10, 20, 30, 40, and 50). This reduces automatic story interruptions from as many as 400 to 48 across the full campaign while retaining manual access for all 400 levels. Preserve seen-state behavior so previously acknowledged story moments do not reappear on retry.

**Little Home background plan:** Remove the visual 'phone panel over another sky' effect in production. Make the approved Little Home sky gradient/radial wash the full production viewport while Home is active, remove the production wrapper shadow/frame treatment, and suppress the legacy `#app` cloud/backdrop decorations behind Home. Keep the embedded Little Home scene itself centered and responsive without changing its approved composition, controls, title animation, island, characters, or progression keepsakes.

**Transition plan:** Add one reusable screen-transition layer for all `screen(...)` navigation. On screen changes, immediately switch the functional target screen while a short directional veil sweeps across the viewport with backdrop blur, soft streak highlights, and a brief target-screen blur/translate settle, producing a fast 'blurry whoosh' without delaying game state updates. Do not animate redundant same-screen calls. Under `prefers-reduced-motion: reduce`, switch screens instantly with no whoosh or blur.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, `index.html`, `game400-a.js`, `story-theme400.js`, `style400-ui.css`, and possibly a small dedicated transition CSS layer if cleaner. Campaign data, story data, title-concept composition, puzzle mechanics, textures, music, and SFX assets remain unchanged. Temporary self-removing GitHub Actions implementation/validation files may be used.

**Validation plan:** Static checks must confirm all 400 story records remain present and all campaign files are unchanged; auto-story eligibility must resolve to exactly 48 levels (8 chapter openings + 40 turning points), while manual Story Card access remains available on routine levels. Chromium must prove routine levels do not auto-popup, chapter openings/turning points do, seen milestones do not repeat, and manual book access works. Home screenshots at tall phone, compact phone, and wide desktop must show a continuous Little Home sky with no legacy backdrop seam/panel shadow. Screen navigation must exercise Home → Levels → Game → Story → Home plus Daily/Complete routes, verify the whoosh layer runs on real changes but not same-screen calls, ensure no interaction lock after animation, and verify reduced-motion disables transition animation. Require no console/page/request errors or horizontal overflow and visually inspect rendered Home/transition states before deployment.

**Deployment plan:** Commit this handoff entry before product implementation, implement and validate through GitHub Actions/Chromium, inspect rendered artifacts, deploy the exact validated product SHA through GitHub Pages, then close this same entry with implementation SHA, workflow/artifact IDs, deployment run, and any remaining risk.

---
'''
    t=t[:i]+entry+t[i:]
p.write_text(t)
print('HANDOFF_STORY_CADENCE_TRANSITION_STARTED')
