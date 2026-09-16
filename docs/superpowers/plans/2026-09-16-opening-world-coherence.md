# Opening World Coherence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the 21-turn Opening so it reuses the production Little Home, presents neighboring islands and routes in one coherent coordinate system, visibly proves every spoken story beat, and keeps all lower controls fixed in place.

**Architecture:** The Opening remains one persistent `cin-opening-continuous` root, but the hand-built duplicate Little Home is replaced by a same-origin iframe of the production `title-island-concepts/?c=2&embed=1&cinematic=1&opening=1` scene. A parent `opening-world-camera` owns the canonical Home frame, neighboring islands, route SVG, story props, and overlays so camera movement scales the whole world coherently. `opening-cinematic400.js` exposes a 21-entry deterministic choreography table; each step sets a semantic `data-story-action`, recomputes route/miss geometry from live canonical Home landmark rectangles, settles the relevant prop/action, and optionally animates between deterministic endpoints. Opening-only copy/footer CSS reserves fixed geometry, removes the changing beat subtitle, and scrolls inside the fixed copy slot when Large Text needs it.

**Tech Stack:** Static HTML/CSS/JavaScript, same-origin iframe DOM access, SVG geometry, Web Animations API, Playwright browser tests, GitHub Actions.

**Spec:** `DEVELOPMENT_HANDOFF.md` → “Opening world coherence and static cinematic controls”

## Global Constraints

- Do not modify `campaign400-1.js` through `campaign400-8.js`.
- Preserve all 21 canonical Opening utterances and all later cinematic text/behavior.
- Preserve Story replay, Skip behavior, Level 1 entry, title-screen Home behavior, Large Text, Reduced Motion, and accepted gameplay controls.
- Product code follows TDD: browser acceptance changes are committed and observed failing before implementation commits.
- Candidate validation must cover 320x568, 360x800, 390x844, and 430x932 where applicable.
- No merge to `main` until targeted tests and the complete shipped `npm test` pass on committed candidate state.

---

### Task 1: Add the red acceptance contract and branch CI

**Files:**
- Create: `tests/opening-world-coherence.browser.cjs`
- Modify: `package.json`
- Create: `.github/workflows/validate-opening-world.yml`

**Interfaces:**
- Consumes: `window.LatchlingsCinematics`, `.cin-opening-continuous`, `#cinematicStage`, `#cinematicNext`.
- Produces: acceptance assertions for `data-story-action`, canonical Home iframe reuse, semantic misses, proportional islands, and fixed lower controls.

- [ ] **Step 1: Write the failing browser test**

Create `tests/opening-world-coherence.browser.cjs` that opens the Opening at 360x800, 390x844, and 430x932 and asserts:

```js
const EXPECTED_ACTIONS=[
 'establish-drifting-neighborhood','show-working-skyway','focus-little-home',
 'breakfast-route-travels','breakfast-misses-porch','watering-misses-garden',
 'shortcut-misses-rock','tansy-compares-target','pip-shows-yesterday-route',
 'rowan-measures-three-offsets','three-misses-pulse-together','widen-to-network-question',
 'waykeeper-call-ready','route-adapts-to-drift','call-leaves-little-home',
 'waykeeper-answer-arrives','neighbors-share-local-knowledge','route-becomes-puzzle',
 'sunpetal-route-focus','breakfast-start-focus','investigation-ready'
];
```

For every turn, assert `.cin-opening-continuous.dataset.storyAction === EXPECTED_ACTIONS[step-1]`. Assert there is exactly one `.opening-home-reference` iframe and its `src` contains `c=2`, `embed=1`, `cinematic=1`, and `opening=1`. Inside that frame, assert `#c2 .island-model`, `.cottage`, `.little-home-tree`, and all five `[data-resident]` nodes exist. Assert the old duplicate `.opening-little-home` does not exist.

At steps 5, 6, and 7, measure `.opening-miss-marker[data-miss="basket|water|play"]` against `.opening-target-marker[data-target="porch|garden|play-rock"]`; require a visible miss of 14–52px, with each mover ending within 4px of its miss marker and at least 12px from its intended target. At step 10, require the three offset vectors to differ in rendered length by no more than 5px. At step 11, require all three miss markers visible simultaneously.

Capture `.cinematic-copy`, `.cinematic-footer`, `.cinematic-progress`, and `#cinematicNext` rectangles on all 21 turns and assert their top/bottom/height coordinates remain within 1px of turn 1. Assert Opening `#cinematicBeat` is hidden. Under Large Text, allow overflow only inside `.cinematic-copy-body` / the fixed message viewport, never by moving the footer.

- [ ] **Step 2: Put the new contract in the shipped suite**

Change `package.json` test script to:

```json
"test": "node tests/opening-world-coherence.browser.cjs && node tests/phone-visual-regressions.browser.cjs && node tests/opening-continuous.browser.cjs && node tests/opening-flow.browser.cjs && node tests/cinematics-regression.browser.cjs"
```

- [ ] **Step 3: Add temporary branch/main validation workflow**

Create `.github/workflows/validate-opening-world.yml` with `push` branches `agent/opening-world-static-controls-20260916` and `main`, plus `workflow_dispatch`. Use Node 20, `npm install --no-audit --no-fund`, `npx playwright install --with-deps chromium`, then run `npm test`. Upload `test-artifacts/opening-world/**` when present.

- [ ] **Step 4: Commit RED state and verify failure**

Commit message: `test: define opening world coherence contract`.

Expected branch Actions result: FAIL because the current scene has no `.opening-home-reference`, no `data-story-action` choreography, the old `.opening-little-home` exists, and lower content geometry is not fixed.

---

### Task 2: Give the production Little Home an Opening-safe cinematic surface

**Files:**
- Modify: `title-island-concepts/index.html`
- Test: `tests/opening-world-coherence.browser.cjs`

**Interfaces:**
- Consumes: existing `?c=2&embed=1&cinematic=1` mode and canonical `#c2` DOM.
- Produces: `?opening=1` mode with ambient Home-life motion paused and stable landmark queries.

- [ ] **Step 1: Extend the red test**

Inside the canonical iframe assert:

```js
assert.equal(frameBody.dataset.openingCinematic,'true');
assert.equal(frameDoc.documentElement.dataset.sceneActive,'false');
```

Require `window.LatchlingsCinematicHome.getLandmark(name)` for `porch`, `garden`, `play-rock`, `call`, and each resident name. Each result must contain finite `{x,y,width,height}` values in iframe viewport coordinates.

- [ ] **Step 2: Implement the smallest iframe API**

In `initProductionEmbed()`, detect `opening=1`. In that mode, pause ambient adult/child choreography and set `document.body.dataset.openingCinematic='true'`. Expose:

```js
window.LatchlingsCinematicHome={
 getLandmark(name){ /* return viewport rect for canonical selector/derived target */ },
 focusResident(name){ /* add/remove one non-layout-changing focus class */ },
 clearFocus(){ /* clear opening-only focus classes */ }
};
```

Use canonical DOM as sources: porch from the cottage door/threshold, garden from the flower cluster, play-rock from `#c2 .rock.r1`, residents from `[data-resident="..."]`, and call origin from a stable point on the Home plateau. Do not add visible duplicate scenery.

- [ ] **Step 3: Add Opening-only focus CSS inside the title scene**

Use outline/glow/scale only. It must not alter layout. Disable transition/animation under Reduced Motion.

- [ ] **Step 4: Commit and run candidate validation**

Commit message: `feat: expose canonical Little Home cinematic landmarks`.

Expected: the canonical-surface assertions become green while the overall Task 1 test remains red on missing parent choreography/static controls.

---

### Task 3: Replace the duplicate Home with one coherent world camera

**Files:**
- Modify: `opening-cinematic400.js`
- Modify: `style400-opening-cinematic.css`
- Test: `tests/opening-world-coherence.browser.cjs`
- Test: `tests/phone-visual-regressions.browser.cjs`

**Interfaces:**
- Produces: `.opening-world-camera`, `.opening-home-reference`, `.opening-neighbor-island`, `.opening-route-map`, semantic target/miss markers, basket/water/play movers.

- [ ] **Step 1: Make current geometry tests target the new semantic surface**

Update phone visual regression helpers so Little Home grounding checks are read from the canonical iframe and parent semantic markers rather than `.home-top` from the duplicate island. Keep existing 360x800 / 390x844 / 430x932 control assertions unchanged.

- [ ] **Step 2: Replace `create()` world markup**

`create()` must emit one persistent camera with:

```html
<div class="opening-world-camera">
  <div class="opening-neighbor-island neighbor-bakery-island">...</div>
  <div class="opening-neighbor-island neighbor-tree-island">...</div>
  <iframe class="opening-home-reference" src="title-island-concepts/?c=2&embed=1&cinematic=1&opening=1" ...></iframe>
  <svg class="opening-route-map">...</svg>
  <div class="opening-story-props">...</div>
</div>
```

Delete the hand-built `.opening-little-home`, duplicate cottage/tree/garden/rock/cast markup, and the old fixed 1000x600 path assumptions.

- [ ] **Step 3: Compute geometry from live landmarks**

Add helpers that convert iframe landmark rectangles into stage-local coordinates. Recompute routes/markers after iframe load, each step, and stage resize. Route endpoints must be the semantic miss markers, while target markers indicate the actual porch/garden/play rock.

- [ ] **Step 4: Make establishing scale relational**

CSS must define neighboring islands as perspective-scaled relatives of the same world, not independently arbitrary objects. Steps 1–2 use a wider camera; step 3 onward zooms the entire camera toward Little Home. Camera transforms must apply to Home, neighboring islands, routes, markers, and movers together.

- [ ] **Step 5: Commit and validate geometry**

Commit message: `feat: rebuild opening around canonical Little Home`.

Expected: canonical Home/proportional island/semantic miss tests green. Existing phone geometry tests must no longer reference removed duplicate Home selectors.

---

### Task 4: Give all 21 spoken turns deterministic visible actions

**Files:**
- Modify: `opening-cinematic400.js`
- Modify: `style400-opening-cinematic.css`
- Test: `tests/opening-world-coherence.browser.cjs`
- Test: `tests/opening-continuous.browser.cjs`

**Interfaces:**
- Produces: `OPENING_ACTIONS[1..21]`, root `data-story-action`, deterministic settled visuals.

- [ ] **Step 1: Define the exact choreography table**

Implement the 21 action IDs from Task 1. Each entry also declares a camera phase, resident focus, route visibility, prop settled state, and optional transient animation.

- [ ] **Step 2: Implement semantic story actions**

Required obvious actions:

```text
1 wide neighborhood drifts
2 working Skyway carries cargo
3 camera settles on canonical Little Home
4 breakfast basket travels in
5 basket lands at a miss marker separate from porch
6 watering stream/puddle misses garden
7 shortcut endpoint misses play rock
8 play-rock target ring contrasts miss
9 yesterday-route ghost reaches old target
10 Rowan reveals three equal offset vectors
11 all three misses pulse together
12 camera widens to show network implication
13 Waykeeper call device appears on Little Home
14 route visibly bends/adapts around drift
15 call signal travels outward
16 answer signal/player compass arrives
17 all residents contribute visible knowledge tokens
18 route/world dissolves into Level 1 puzzle model
19 Sunpetal route/Level 1 focus becomes explicit
20 breakfast start is highlighted
21 full puzzle readiness pulse settles
```

- [ ] **Step 3: Preserve Reduced Motion with meaningful settled states**

Reduced Motion skips travel tweens but lands every mover/route/signal in the same semantic end state and keeps `data-story-action` unchanged.

- [ ] **Step 4: Commit and run targeted plus full tests**

Commit message: `feat: choreograph every opening story turn`.

Expected: all 21 action assertions green and existing 21-line continuity/replay tests green.

---

### Task 5: Make the lower cinematic area static

**Files:**
- Modify: `cinematics400.js`
- Modify: `cinematic-dialogue400.js`
- Modify: `style400-cinematics.css`
- Modify: `style400-cinematics-dialogue.css`
- Test: `tests/opening-world-coherence.browser.cjs`
- Test: `tests/opening-flow.browser.cjs`

**Interfaces:**
- Produces: fixed Opening copy region, hidden Opening beat subtitle, stable footer/progress/button geometry.

- [ ] **Step 1: Reserve permanent Opening copy structure**

For Opening only, keep the counter/title in a fixed header region and one permanent message viewport beneath it. Resident and narrator turns render inside that viewport rather than inserting/removing differently sized sibling docks.

- [ ] **Step 2: Remove the changing Opening route/beat subtitle**

Hide `#cinematicBeat` for Opening. Do not remove beat metadata from the cinematic data model or later films.

- [ ] **Step 3: Lock footer geometry**

Use a fixed four-row Opening shell: header, stage, copy, footer. Footer/progress/button heights and positions must not depend on message length. Large Text may scroll inside the message viewport.

- [ ] **Step 4: Commit and verify fixed coordinates**

Commit message: `fix: keep opening cinematic controls stationary`.

Expected: footer/progress/button coordinate assertions remain within 1px across all 21 turns at tested phone sizes and Large Text.

---

### Task 6: Visual evidence, full verification, merge, and closeout

**Files:**
- Modify: `DEVELOPMENT_HANDOFF.md`
- Delete after committed-main evidence: `.github/workflows/validate-opening-world.yml`

**Interfaces:**
- Consumes: committed candidate branch and Actions evidence.
- Produces: reviewed PR, merged `main`, committed-main verification, completed handoff.

- [ ] **Step 1: Capture representative settled screenshots**

The new Playwright test saves 390x844 screenshots for turns 1, 3, 5, 6, 7, 10, 13, 16, 18, and 21 plus one 360x800 Large Text frame to `test-artifacts/opening-world/`.

- [ ] **Step 2: Review visual evidence manually**

Reject the candidate if any screenshot shows mismatched island scale, detached/overshooting routes, a “miss” that visually lands on its target, obscured residents, or moving lower controls.

- [ ] **Step 3: Run full committed-candidate suite**

Require the branch workflow to complete `npm test` with zero failures.

- [ ] **Step 4: Create and review PR**

Compare candidate to `main`; confirm no `campaign400-*.js` changes and no unrelated product changes. Merge only after candidate verification is green.

- [ ] **Step 5: Reverify exact merged `main`**

The temporary workflow also runs on `main`; require a successful run on the exact merge SHA plus successful repository-access guard and Pages deployment/status.

- [ ] **Step 6: Close the handoff**

Change the current-work status to `COMPLETED / VERIFIED ON COMMITTED MAIN` and record root cause, implementation summary, PR/merge SHA, candidate run, main run, visual artifact, Pages/guard status, and any remaining external-only checks.

- [ ] **Step 7: Remove the temporary validation workflow**

Delete `.github/workflows/validate-opening-world.yml` only after main evidence is recorded, then confirm the repository guard remains green.
