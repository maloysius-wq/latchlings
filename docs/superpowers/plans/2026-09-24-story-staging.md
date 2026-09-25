# Story Staging Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every major story image communicate the authored cause and consequence: morning errands miss real destinations, a new line reaches the familiar porch, changing maps and a living network make spatial sense, chapter rewards feel earned, and a parcel visibly arrives home.

**Architecture:** Keep the current five films, 21-line Opening, canonical Little Home iframe, and tap-per-line dialogue. Add one small reusable scene-geometry helper for SVG paths between measured DOM landmarks. Give dated maps explicit per-year coordinates and Homeward an ordered visual state. Stage short reward and ending effects inside existing screens. Do not replace the story renderer or campaign data.

**Tech Stack:** Static HTML/CSS/JavaScript, SVG paths, ResizeObserver, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-24-game-polish-design.md`; execute after `2026-09-24-reliability-gameplay.md` and `2026-09-24-phone-presentation.md`.

## Global Constraints

- Preserve every authored line and manual tap/keyboard advancement. No narrator audio, auto-advance, Undo, new puzzle, or spoiler before its earned level.
- Use the existing Little Home iframe for residents and landmarks. Do not create a visually different substitute island. Preserve the pre-Astra bottom controls and all campaign hashes.
- Connect rendered paths to actual landmarks after layout, iframe readiness, resize, and Reduced Motion changes. Never use a CSS-only line whose endpoint is independently guessed from percentages.
- Keep Continue/Skip reachable even if scene geometry cannot initialize; fail to a settled/static scene, not a blocked film.
- Add failing browser assertions before product edits. Run targeted tests and `npm test` after each task; capture Normal/Large Text at 320x568, 360x800, 390x844, and 430x932. Also inspect 844x390 landscape and Reduced Motion.
- Work on `codex/audit-polish-20260924`; do not push directly to `main`. Record actual evidence in `DEVELOPMENT_HANDOFF.md`.

## Review Focus

1. At each Opening errand, the visible mover begins at the named source, misses its actual target, and prior routes are visually subordinate rather than stacked equally (Task 1).
2. The Across route endpoint and arrival pulse meet the twin-lantern porch deck under resize and Reduced Motion (Task 2).
3. Year 12, 31, and 58 move the same named landmarks, and every drawn route touches its own year's nodes (Task 3).
4. Homeward communicates report -> anchor -> window -> redraw, with complete node-to-node alternatives rather than floating strokes (Task 4).
5. Reward vignettes are earned and skippable; the Level 400 parcel reaches the visible Little Home porch (Tasks 5-6).

---

## File map

| File | Responsibility |
|---|---|
| `scene-geometry400.js` | Pure rectangle-center/path math and DOM-to-SVG landmark synchronization shared by later films and ending. |
| `opening-cinematic400.js`, `style400-opening-cinematic.css` | Opening visual hierarchy, errand source/target labels, and puzzle handoff. |
| `cinematics400.js`, `style400-cinematics.css` | Porch, maps, Homeward nodes/paths, and ordered sequence state. |
| `game400-a.js`, `style400-game.css` | Level 1 semantic source/destination labels in the existing helper rail. |
| `game400-b.js`, `style400-ui.css` | Early chapter reward motion and ending parcel arrival. |
| `index.html` | Load shared helper and provide ending route/porch markup. |
| `tests/story-staging.browser.cjs`, `tests/story-payoffs.browser.cjs`, `package.json` | Permanent geometry, pacing, reward, and Reduced Motion checks. |

### Task 1: Clarify the Opening's three misses and first-board handoff

**Files:** Create `tests/story-staging.browser.cjs`; modify `opening-cinematic400.js:115-175`, `style400-opening-cinematic.css:11-32`, `game400-a.js:209-216`, `style400-game.css`; append the new test to `package.json`.

**Interfaces:** Existing `sourcePoint(root,name)`, `localLandmark(root,name)`, and SVG IDs `#opening-route-basket`, `#opening-route-water`, `#opening-route-play`. New read-only DOM labels use `data-errand-source`, `data-errand-target`, and `data-route-handoff`; no dialogue API changes.

- [x] **Step 1: Write RED scene checks.** Drive all 21 first-run turns by clicking Continue exactly once per turn. At turns 4, 6, and 7, wait for `data-geometry-ready=true`; compare route first point to the real source center and route last point to its miss marker within 3 CSS px after transforms. Compare miss marker to porch/garden/play-rock target and require a visible offset. Assert the active errand route has greater opacity/emphasis than previous misses; inspect mover at animation finish or the Reduced Motion settled point. Assert no error and reachable Continue at every turn.
- [x] **Step 2: Clarify source/destination visually.** In the Opening stage, add small scene-local labels for the active source and intended destination. Position them from the already measured source/target points in `syncGeometry`; do not hard-code screen percentages. Hide or de-emphasize obsolete route overlays when the next clue takes focus. Keep the route/miss/target relationship visible long enough for one tap-paced line, and do not cover faces, landmarks, or dialogue. Use the current textured prop vocabulary rather than introducing flat cards.
- [x] **Step 3: Match the Waykeeper handoff to Level 1.** On Opening turns 18-21, identify the breakfast origin and Little Home porch on the abstract board transition with two short semantic labels. On Level 1, show the same origin/destination terms in the existing Route Tip/helper rail; explicitly describe the grid as a route model rather than suggesting tile coordinates are island geography. Do not change the Level 1 board or helper-crew explanation.
- [x] **Step 4: Verify and commit.** Run `node tests/story-staging.browser.cjs`, `node tests/opening-world-coherence.browser.cjs`, `node tests/opening-continuous.browser.cjs`, then `npm test`. Compare dialogue-visible and dialogue-hidden screenshots at 320x568 and 390x844, Normal/Reduced Motion. Commit as `style: connect opening errands and board handoff`.

### Task 2: Anchor Across the Drift to the twin-lantern porch

**Files:** Create `scene-geometry400.js`; modify `index.html:130-154`, `cinematics400.js:96-99,157-170`, `style400-cinematics.css:435-505`; update `tests/story-staging.browser.cjs`.

**Interfaces:** `window.LatchlingsSceneGeometry.syncPath(svg,path,fromElement,toElement)` measures element centers in SVG-local coordinates and returns `true` only when both rectangles and the path are valid. `porchReconnectHtml()` supplies a named origin anchor and a deck landing marker inside `.porch-far-island`; the SVG route and pulse consume that same marker.

- [x] **Step 1: Write RED geometry checks.** Open `across-drift`, advance manually to the `porch-reconnect` beat, and wait for a nonzero SVG path. At 320x568, 390x844, and 430x932, require path start within 3 px of the origin marker and path end/pulse center within 3 px of the deck landing marker. Resize without reopening the film and reassert. Repeat under `prefers-reduced-motion: reduce`; capture one frame with dialogue visible and one with it hidden for scenic inspection.
- [x] **Step 2: Add the shared helper and replace independent positioning.** Implement rectangle-center conversion using the SVG's actual bounding rectangle/viewBox; write one `d` path from the two measured points. On scene render, call sync after layout, after iframe/asset readiness where relevant, and from a `ResizeObserver`; disconnect the observer when the stage is replaced. Use `path.getPointAtLength(path.getTotalLength())` to position the arrival pulse. Remove the old `.porch-reconnect-line` percentage/rotation and `.porch-route-pulse` percentage overrides, including their narrow-phone variants, instead of adding another override.
- [x] **Step 3: Keep the landmark recognizable.** The destination is the existing shared `familiarPorchIslandHtml()` twin-lantern deck, not a newly drawn generic target. Keep both lanterns, deck, porch, and route landing visible at 320px. If geometry is unavailable, show the porch and a settled origin/pulse but never claim the connection completed or disable Continue/Skip.
- [x] **Step 4: Verify and commit.** Run story-staging, cinematics-regression, and full `npm test`; inspect 320/390 screenshots in motion and Reduced Motion. Commit as `style: land Across route on familiar porch`.

### Task 3: Make dated maps show the same landmarks at different coordinates

**Files:** Modify `cinematics400.js:93,113-125`, `style400-cinematics.css:44-47,300-330`; update `tests/story-staging.browser.cjs`.

**Interfaces:** Define a frozen `MAP_YEARS` array with `{year, landmarks:{home:{x,y},keep:{x,y},crown:{x,y}}, edges:[['home','keep'],['keep','crown']]}` using normalized 0..1 sheet coordinates. `mapSheets(mode)` renders three SVG sheets from those data; each node has stable `data-landmark` and each route has `data-from`/`data-to`.

- [x] **Step 1: Write RED map checks.** In the `dated-maps` and `map-sequence` beats, identify the same three named landmarks on every year. Assert at least two landmark coordinates differ by >=10% of sheet width or height between each consecutive year. Convert each SVG route endpoint into sheet coordinates and require <=2 px distance from its declared node center. Assert Year 12, Year 31, Year 58 labels appear in order and all three remain distinguishable with Reduced Motion.
- [x] **Step 2: Replace identical CSS drawings.** Choose explicit normalized coordinates with enough separation to read in a 145px sheet; use the same landmark IDs, recognizable icons/shapes, and two connected edges in each year. Render nodes and routes in one SVG viewBox so the lines cannot drift away from points. Keep the existing paper/wood textures, stacked drawer, spread, sequence, and tiny machine-map modes. Remove `.line.a/.line.b` and `.node.n1/.node.n2` geometry rules now superseded by the data-backed SVG.
- [x] **Step 3: Make the sequence explain time.** In sequence mode, show one dated sheet at a time in chronological order with a brief hold; Reduced Motion shows a stable three-sheet comparison instead of collapsing to one. This is visual timing only: authored Rowan/Pippa/Narrator lines and tap pacing do not change.
- [x] **Step 4: Verify and commit.** Run the story-staging test and `npm test`; review spread and sequence captures at 320/390px with copy visible and hidden. Commit as `style: show drift across three dated maps`.

### Task 4: Connect Homeward's named network and causal sequence

**Files:** Modify `cinematics400.js:83-116,172-194,232`, `scene-geometry400.js:syncPath`, `style400-cinematics.css:74-75,354-366,529+`, and `index.html`'s cinematic CSS/JavaScript cache keys; update `tests/story-staging.browser.cjs`.

**Interfaces:** `networkHtml(mode)` includes `<svg class="cin-network-routes">` paths with `data-from`/`data-to` node IDs. A visual `data-network-phase` is one of `report`, `anchor`, `window`, `redraw`, `complete`. The phase does not advance dialogue; it can progress within a held line and settles immediately under Reduced Motion.

- [x] **Step 1: Write RED network checks.** In `signals`, `living-network`, `many-routes`, and `homeward-network`, assert each visible path's first/last point is within 3px of a named node anchor after initial layout and resize. For `living-network`, observe phases in the specified order and require every phase to show its corresponding station/edge. Under Reduced Motion, require the complete causality state and readable labels without timed waits. In `many-routes`, assert exactly two alternative complete paths share named endpoints (not three free-floating strokes).
- [x] **Step 2: Anchor all routes.** Reuse `scene-geometry400.js` to measure actual rendered node anchors. Replace `.wire.w1`-`.wire.w7` and `.cin-route-options i` percentage lines with SVG paths derived from explicit edge arrays. If the eight-node map is too dense at 320px, emphasize the two or three nodes relevant to the current beat and reduce nonessential labels, but do not hide the source or destination names. Path sync follows resize and floating-node animation; if floating motion prevents stable attachment, stop float on these beats.
- [x] **Step 3: Stage the causal cycle.** On `living-network`, mark the report at Stormswitch/Meadows, anchor action at Lodestone, changed travel window at the receiving node, then a redrawn route connecting the pair. Give each state a visible icon/label and one-way progression to `complete`; do not reset mid-line. The `keepsakes` visual can introduce the participants, but it must not substitute for the network sequence. Reduced Motion shows all four settled results together, with no animation dependency.
- [x] **Step 4: Verify and commit.** Run story-staging and cinematics-regression tests, then `npm test`; inspect Homeward at 320/390/430px, Normal/Large Text and Reduced Motion. Commit as `style: make Homeward network causality visible`.

### Task 5: Add brief earned chapter-reward vignettes

**Files:** Create `tests/story-payoffs.browser.cjs`; modify the four `showChapter*Reward` functions in `game400-b.js:23-42`, `style400-ui.css`, `package.json`.

**Interfaces:** Existing reward modal remains the container. Each reward uses `data-reward-level="50|100|150|200"` and a scene-local `data-vignette-settled` state. Existing `Visit Little Home` and `Continue` actions remain immediate and work even during motion.

- [ ] **Step 1: Write RED reward checks.** Simulate an earned clear at Levels 50, 100, 150, and 200. Assert the matching existing result/keepsake appears and that no later-region prop or text appears. Click both actions while the vignette is moving and confirm correct Home/next-level flow without delayed auto-advance. Under Reduced Motion, assert the vignette is already settled and the modal actions remain reachable. Verify a replay of an already cleared chapter does not accidentally reveal future rewards.
- [ ] **Step 2: Animate only the earned result.** Within the existing textured postcard, stage a 0.7-1.5s one-shot visual: Level 50 basket to mailbox, Level 100 Lanternwood light relit, Level 150 anchor aligned, Level 200 market bunting/route opened. Do not add a new full-screen cinematic or repeat result prose. Add short, meaningful `role="img"` labels; decorative moving pieces are `aria-hidden`.
- [ ] **Step 3: Keep skipping free.** Both reward buttons must work at any time. No timer may gate input, launch the next level automatically, or trap focus. In Reduced Motion, show the completed image immediately. Add an optional replay affordance only if it fits without hiding the two primary actions; it is not required for acceptance.
- [ ] **Step 4: Verify and commit.** Run story-payoffs, full `npm test`, and 320/390px screenshots. Commit as `style: celebrate earned early chapter returns`.

### Task 6: Deliver the Level 400 parcel to Little Home's actual porch

**Files:** Modify `index.html:91-106`, `style400-ui.css:140-180`, and only the ending-screen activation code in `game400-a.js`/`game400-b.js`; update `tests/story-payoffs.browser.cjs`.

**Interfaces:** The ending network field retains its named regions. The parcel trajectory is an SVG path from the final network handoff marker to the center of `#c2 .cottage .door` in the same-origin canonical iframe, converted through the iframe's rendered rectangle into parent-stage coordinates. Opening's `LatchlingsCinematicHome` API is installed only for its Opening iframe; do not assume it exists on the ending iframe. `data-parcel-arrived="true"` is set only when the visible parcel lands.

- [ ] **Step 1: Write RED ending checks.** Open the genuine completion screen after Level 400. Wait for the canonical home iframe to load. Require the displayed parcel to travel visibly along a nonzero path and finish within 3px of the porch marker; require Little Home text/prop contrast in 320/390 screenshots. Resize and reassert path/landing. Under Reduced Motion, require the parcel already at the porch, the porch light on, and `data-parcel-arrived=true`. Continue/Home buttons must stay usable if the iframe is late or unavailable.
- [ ] **Step 2: Replace the guessed CSS translation.** Remove the fixed `translate:125px -20px` and absolute parcel keyframes. Read `endingHomeFrame.contentDocument.querySelector('#c2 .cottage .door').getBoundingClientRect()` only after load; convert its center using frame bounds plus `frame.clientWidth / frame.contentWindow.innerWidth` and `frame.clientHeight / frame.contentWindow.innerHeight` (the same projection pattern as `opening-cinematic400.js:localLandmark`). Feed that point to `scene-geometry400.js` for path and arrival. Reveal the parcel for the whole final leg; do not rely on a 2.15s animation delay that leaves the payoff invisible in short captures. Bring the home iframe forward enough to read its house/porch, while keeping the islands' ongoing drift visible.
- [ ] **Step 3: Handle readiness and fallback.** Recompute after iframe ready and resize. If the iframe never exposes a usable landmark, settle at a visible labeled Little Home landing node and do not set a false porch-arrival claim; keep all completion actions available. Do not add a different island illustration or imply the Skyway stops drifting.
- [ ] **Step 4: Verify and commit.** Run story-payoffs, opening-world-coherence, and `npm test`; inspect 320/390/430px in motion and Reduced Motion. Commit as `style: bring final parcel visibly home`.

### Task 7: Final verification, handoff, and branch review

**Files:** Modify `DEVELOPMENT_HANDOFF.md` after verification; no campaign-source changes.

- [ ] **Step 1: Run the full matrix on committed code.** Run `npm test`, `git diff --check`, and compare SHA-256 hashes of all eight campaign files with Task 0. Open every film from Story replay and test all 21 Opening lines plus each later beat, Next/Skip/focus restoration, normal and in-game/OS Reduced Motion, Normal/Large Text, and viewports 320x568, 360x800, 390x844, 430x932, 844x390. Capture dialogue visible/hidden for route-heavy scenes; check no page errors or horizontal overflow.
- [ ] **Step 2: Complete the handoff accurately.** Record exact test commands/results, screenshots or artifact paths, commit SHA, campaign hashes, known limitations, and external-only physical iOS/Android/audio checks. Mark COMPLETED only if all required checks pass; otherwise mark PARTIAL with failing assertions and leave product changes unmerged.
- [ ] **Step 3: Commit and push for review.** Commit as `docs: complete game polish handoff`; push the feature branch, verify CI and GitHub file contents, then present a concise user-facing summary. Do not merge or deploy without the player's request.
