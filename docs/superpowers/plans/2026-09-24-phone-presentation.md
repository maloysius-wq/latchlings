# Phone Presentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make cinematic copy, Atlas information, and dense-board mechanic states comfortably understandable on phones without shrinking the protected puzzle controls.

**Architecture:** Retain current layout shells. Use scene-local CSS for the cinematic copy region, one selected-destination detail region in the Atlas, and a compact read-only mechanic inspector tied to existing board cells. Do not rebuild navigation, puzzle rendering, or the D-pad.

**Tech Stack:** Static HTML/CSS/JavaScript, Playwright screenshots and geometry assertions.

**Spec:** `docs/superpowers/specs/2026-09-24-game-polish-design.md`; execute after `2026-09-24-reliability-gameplay.md` and before `2026-09-24-story-staging.md`.

## Global Constraints

- No Undo, narrator voice, new board mechanic, level-data edit, or star-rule change.
- Do not alter `style400-control-restoration.css` or the accepted Reset/D-pad/Hint geometry.
- Preserve fixed cinematic footer/progress/Continue geometry, manual line advance, Large Text, Reduced Motion, keyboard focus, and 44px action targets.
- Use CSS changes in the owning files, not a new broad override sheet. Test Normal/Large Text at 320x568, 360x800, 390x844, and 430x932.
- Add failing browser assertions before each product edit; run targeted tests and full `npm test` after each task.

## Review Focus

1. A long Rowan line on 320x568 Large Text must scroll in copy without moving Continue (Task 1).
2. Atlas selection of a locked node must not start an unavailable level or reveal spoiler text (Task 2).
3. A selected mechanic on a dense Level 366 board must remain visible behind its description (Task 3).
4. Inspector output must name door OPEN/CLOSED and link letter in text, not color alone (Task 3).
5. Settings/Story/Atlas transitions must retain focus restoration and no horizontal overflow (Task 4).

---

## File map

| File | Responsibility |
|---|---|
| `style400-cinematics-dialogue.css`, `style400-opening-cinematic.css`, `style400-cinematics.css` | Essential cinematic typography and fixed copy/footer layout. |
| `style400-skyway-atlas.css`, `game400-a.js` | Selected Atlas destination detail and readable supporting copy. |
| `index.html`, `game400-a.js`, `game400-b.js`, `style400-game.css` | Read-only mechanic inspector. |
| `tests/phone-readability.browser.cjs`, `tests/mechanic-inspector.browser.cjs`, `package.json` | Regressions for copy, Atlas, and board inspection. |

### Task 1: Put readable dialogue in the existing cinematic copy region

**Files:** Create `tests/phone-readability.browser.cjs`; modify `style400-cinematics-dialogue.css:62-79`, `style400-opening-cinematic.css:35-44`, and only the related copy rules in `style400-cinematics.css`.

**Interfaces:** Consumes `#cinematicOverlay`, `.cinematic-copy`, `.cin-opening-dialogue-dock`, `.cinematic-lines`, `.cinematic-footer`, `#cinematicNext`.

- [ ] **Step 1: Write RED geometry/type tests.** At each required viewport, show the first, longest, and last Opening turns plus one narration/dialogue turn of each later film. Assert computed essential body font size is at least 15px Normal and 17px Large (short-phone layouts may use internal scrolling, not smaller essential copy). Assert copy begins near its heading rather than being bottom-anchored in an empty panel. Save footer/progress/button rectangles on the first turn and require <=1px shift on later turns. Assert no document horizontal overflow.
- [ ] **Step 2: Implement a content-sized message dock.** Make `.cin-opening-dialogue-dock` and `.cinematic-lines` occupy natural height at the top of the available copy track; increase bubble/narration font and speaker metadata proportionally. Keep `.cinematic-copy` as the only overflow-y container and `.cinematic-footer` as a fixed grid row. Do not place text over the scenic stage. For example, the layout should obey:

```css
.cinematic-overlay[data-cinematic="opening"] .cinematic-copy{
  grid-template-rows:auto auto minmax(0,1fr);
}
.cinematic-overlay[data-cinematic="opening"] .cin-opening-dialogue-dock{
  align-self:start;
  height:max-content;
  overflow:visible;
}
```

The exact CSS may differ if a shorter selector prevents cascade conflicts; remove superseded small-font declarations rather than adding another `!important` layer.
- [ ] **Step 3: Verify and commit.** Run the new test and `npm test`; inspect screenshots of narrator, Bramble, Rowan, and a later-film line at 320x568 and 390x844 in Normal/Large Text. Commit as `style: make cinematic copy readable on phones`.

### Task 2: Give Atlas destinations readable detail without shrinking the map

**Files:** Modify `game400-a.js:184-197`, `style400-skyway-atlas.css`; update `tests/phone-readability.browser.cjs`.

**Interfaces:** `renderChapter()` renders `#atlasNodeDetail`; focus/hover updates it from a node's existing `data-level`/`data-state`. Clicking an available node still calls `startLevel`; locked nodes remain disabled.

- [ ] **Step 1: Write RED cases.** At 320x568 and 390x844, require the selected/current destination name and state to appear in >=14px visible text. Focus restored and current nodes; verify detail updates without changing level. Confirm a locked node remains disabled, cannot start play, and exposes no future-chapter result in DOM text. Confirm map retains its original dominant height and route nodes remain in map bounds.
- [ ] **Step 2: Add a compact detail region inside the map.** In `renderChapter()`, append an `aria-live="polite"` read-only `#atlasNodeDetail` with default current/next-stop content. Use existing `STORY.levelMeta()` for spoiler-safe available names; locked nodes show only “Level N · Locked”. On focus/hover, update detail; on blur, restore current selection. Keep the map click action unchanged. Style the detail as a translucent panel along the map's lower safe edge and enlarge chapter objective/route-range supporting text instead of relying on 7–10px microcopy.
- [ ] **Step 3: Verify and commit.** Run phone-readability test and `npm test`; manually review Chapter 1 and Chapter 5 Atlas at 320x568/390x844, including Large Text and locked nodes. Commit as `style: clarify Atlas destinations on phones`.

### Task 3: Inspect a mechanic without moving or changing the board

**Files:** Modify `index.html:71-84`, `game400-a.js:209-226`, `game400-b.js:82`, `style400-game.css`; create `tests/mechanic-inspector.browser.cjs`.

**Interfaces:** `describeMechanic(lev,r,c,doorMask) -> string|null`; `showMechanicInspector(text)`. The board cell supplies row/column. `renderGame()` updates live door descriptions after a move.

- [ ] **Step 1: Write RED tests.** Start Levels 101, 201, 301, and 366 with story cards closed. Focus/click an anchor, suit gate, color gate, rail/turner, switch, and door. Assert the inspector text names the mechanic and its current state; door A says CLOSED before the matching switch and OPEN after it. Assert inspection does not change `movesUsed`, `positions`, selection, or door mask. Verify a keyboard user can reach the same information.
- [ ] **Step 2: Add a read-only inspector.** Put a small `role="status" aria-live="polite"` region adjacent to the existing Route Tip, not over board cells or inside the D-pad. `describeMechanic` derives its sentence from `findAt(lev.anchors|suitGates|colorGates|rails|turners|switches|doors,r,c)` and `mechanicLinkLabel(id)`. Give only mechanic-bearing cells `tabindex="0"` and a concise `aria-label`; use event delegation on `#board` for pointer selection and focus. Do not make every tiny cell an enlarged overlapping hit target. Preserve piece selection precedence. Restore the normal Route Tip when no mechanic is inspected or a new level starts.
- [ ] **Step 3: Preserve layout on dense boards.** The inspector must wrap or scroll within its own compact area on 320x568; board and D-pad bounds stay unchanged. Use a visible focus cue and text equivalent for all state icons.
- [ ] **Step 4: Verify and commit.** Run mechanic-inspector test, 400-solution gate, and `npm test`; compare Level 1 and Level 366 screenshots before/after. Commit as `feat: explain live board mechanics without a move`.

### Task 4: Phone-stage verification and handoff

**Files:** Modify `DEVELOPMENT_HANDOFF.md` after evidence is available.

- [ ] **Step 1: Run one fresh phone matrix.** At 320x568, 360x800, 390x844, 430x932, and 844x390, capture Home, Opening long line, later-film line, Level 1, Level 366, Atlas, Story/Journal, Settings, and Ending. Test Normal/Large Text and OS/in-game Reduced Motion. Check no essential text clips, no document horizontal scroll, footer/controls remain onscreen, and modal focus returns.
- [ ] **Step 2: Run full checks.** Run `npm test`, `git diff --check`, verify campaign SHA-256 unchanged, and inspect committed-branch CI. Record both successful and external-only observations in handoff. Overall status remains IN PROGRESS until story staging is complete.
- [ ] **Step 3: Commit.** Commit the handoff evidence as `docs: record phone readability verification`.
