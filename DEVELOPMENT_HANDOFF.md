# Latchlings Development Handoff

Last updated: 2026-08-31

## Start here

This repository is the source of truth for **Latchlings**.

- Repository: `maloysius-wq/latchlings`
- Live build: `https://maloysius-wq.github.io/latchlings/`
- Current runtime: 400-level themed campaign on `main`

Always inspect current `main`, `index.html`, and this handoff before changing anything.

---

## MANDATORY handoff maintenance workflow

This workflow is required for this project in every current or future chat.

### Before any substantive development work

1. Read `DEVELOPMENT_HANDOFF.md` and inspect the current repository state.
2. Update this file **before implementation begins** with a `Current Work` entry containing:
   - date
   - user request / goal
   - planned implementation
   - files or systems expected to change
   - validation/testing plan
   - deployment plan if applicable
   - status: `IN PROGRESS`
3. Commit that handoff update before making the actual implementation changes.
4. If scope changes materially while working, update the handoff again rather than letting the written plan become stale.

### After implementation

1. Update the same `Current Work` entry to `COMPLETED`, `PARTIAL`, or `BLOCKED`.
2. Record:
   - exactly what changed
   - important behavior decisions
   - files changed
   - validation/tests performed and their results
   - deployment status and commit SHA when relevant
   - any new bugs, risks, or follow-up work
3. Commit the final handoff update after the implementation/deployment commits.

### If the chat is interrupted

The handoff must already contain enough information for another chat to resume immediately. Leave the entry as `IN PROGRESS`, `PARTIAL`, or `BLOCKED` and state the exact next action.

### General rule

**Any repository change that affects development state should be reflected in this handoff.** The handoff is a live project journal, not a document that is only refreshed at the end of a chat.

---

## Current Work

### 2026-08-31 — Establish live handoff workflow

**Status: IN PROGRESS**

**User request:** Make `DEVELOPMENT_HANDOFF.md` a continuously maintained development journal. Before future work, record the plan first; after work, record what was completed so another chat can resume at any point.

**Plan:**

- Add the mandatory start-of-work / end-of-work workflow above.
- Preserve the critical current project state and known issues in this handoff.
- Commit this plan before marking the workflow setup complete.
- Then make a second handoff commit marking this task complete and documenting the resulting workflow.

**Files expected to change:**

- `DEVELOPMENT_HANDOFF.md`

**Validation:**

- Re-fetch the handoff after the first commit and verify the workflow text is present.
- Make the completion update using the new blob SHA.

**Deployment:** None. Documentation-only change; GitHub Pages gameplay files are not being altered.

---

## Critical known issue

`index.html` currently references `campaign400-3.js`, but **that file is missing from the repository tree**. GitHub history shows campaign commits for Chapters 1, 2, then 4–8, with no Chapter 3 data commit.

Affected range:

- Chapter 3: **Magnetic Anchors**
- Theme: **Lodestone Caverns**
- Global levels: **101–150**

This is a critical runtime/data-integrity defect. A successful GitHub Pages deployment does not validate missing JavaScript imports.

### Required repair before normal feature development

1. Recover or regenerate Chapter 3 Levels 101–150.
2. Create `campaign400-3.js` in the same compact format as the other campaign files.
3. Run the full campaign validator against the actual repository files.
4. Verify all 400 levels load and replay correctly.
5. Test Chapter 3 through the live GitHub Pages build.

The original exact Chapter 3 payload is not recoverable from GitHub history, so do not claim it can be restored from a hidden commit.

---

## Active runtime files

### Loaded by `index.html`

CSS:

- `style400-ui.css`
- `style400-game.css`
- `style400-themes.css`

Campaign data:

- `campaign400-1.js` — Levels 1–50
- `campaign400-2.js` — Levels 51–100
- `campaign400-3.js` — **MISSING; should be Levels 101–150**
- `campaign400-4.js` — Levels 151–200
- `campaign400-5.js` — Levels 201–250
- `campaign400-6.js` — Levels 251–300
- `campaign400-7.js` — Levels 301–350
- `campaign400-8.js` — Levels 351–400

Engine:

- `game400-a.js`
- `game400-b.js`

### Legacy 80-level files still in the repository

These are retained history/rollback material and are **not active runtime source**:

- `game-a.js`
- `game-b.js`
- `levels-a.js`
- `levels-41-50.js`
- `levels-51-60.js`
- `levels-61-70.js`
- `levels-71-80.js`
- `style.css`
- `enhancements.css`
- `enhancements.js`

Do not patch the legacy files expecting the live game to change.

---

## Product direction and non-negotiables

Latchlings is a mobile-first magnetic sliding puzzle game. It should feel cute, polished, premium, uncluttered, strategic, and increasingly difficult.

Preserve these requirements:

- Mobile-first UI and controls.
- No emoji in the game UI. Use SVG/CSS/glyphs.
- Round colorful Latchlings with expressive centered faces.
- Suit symbols stay black/dark so suit and body color remain distinct clues.
- Movement is one smooth continuous magnetic snap, never cell-by-cell hopping.
- Selection persists until changed, except smart selection after capture.
- Other Latchlings function as movable strategic stoppers.
- Color and suit matter mechanically.
- Campaign levels are frozen/predetermined, not runtime-randomized.
- Every published level must be solvable inside its move limit.
- Difficulty must not reset to trivial at every mechanic introduction.
- Each chapter needs genuinely hard and expert puzzles.
- **Nest tiles are exclusive. Nothing else may occupy a nest cell.**
- Do not place rocks, anchors, gates, rails, turners, switches, doors, or starting Latchlings on nests.
- Keep the UI quiet. Avoid ad clutter, currencies, decorative counters, or noisy meta systems.
- Push approved gameplay fixes to GitHub so the user can test the same Pages URL.

---

## Campaign structure

Intended campaign: **8 chapters × 50 levels = 400 levels**.

| Chapter | Levels | Focus | Theme |
|---|---:|---|---|
| 1. First Snaps | 1–50 | Edges, rocks, core snapping | Sunpetal Meadows |
| 2. Clever Stops | 51–100 | Latchlings as movable stoppers | Lanternwood Grove |
| 3. Magnetic Anchors | 101–150 | Anchors plus stopper logic | Lodestone Caverns |
| 4. Suit Gates | 151–200 | Suit identity gates | Masquerade Keep |
| 5. Color Gates | 201–250 | Body-color gates plus suit logic | Prism Gardens |
| 6. Rails and Turns | 251–300 | Direction rails and turners | Copperline Junction |
| 7. Switchworks | 301–350 | Switches, doors, cumulative routing | Stormswitch Foundry |
| 8. Master Circuit | 351–400 | Full mechanic combination | Aurora Crown |

Each chapter is displayed in five 10-level ranges.

Difficulty shape per chapter:

1. Very short introduction.
2. Development with prior mechanics retained.
3. Sustained medium/hard play.
4. Expert tail around local Levels 46–50.

Do not return to the original 10-level structure where difficulty repeatedly collapsed.

---

## Core movement semantics

`game400-b.js::simulate()` is the shipping ruleset and is the source of truth for any solver.

A move continues until stopped or redirected by:

- board edge
- rock
- another Latchling
- closed door
- mismatched suit gate
- mismatched color gate
- wrong-direction rail

Special behavior:

- Matching assigned nest captures immediately.
- Anchor stops on the anchor cell.
- Turner changes direction during the same continuous snap.
- Switch toggles its linked door bit while traversed.

Any validator must reproduce these semantics exactly.

---

## Selection and D-pad behavior

The D-pad is a single continuous physical rocker with invisible directional hit regions.

Center selector button:

- Uses a cycle-arrow / three-dot glyph.
- Cycles clockwise through remaining Latchlings based on board position.
- Directly tapping a Latchling remains supported.
- After a capture, the nearest remaining Latchling to the captured nest is automatically selected.

Important pressed-state fix that must not regress:

```css
.dpad button.dpad-cycle:active {
  transform: translate(-50%, calc(-50% + 3px)) scale(.985) !important;
}
```

This prevents the center selector from jumping down/right while pressed.

---

## Faces and animation

Expressions include happy, surprised, angry, smug, sleepy, curious, and determined.

Blinking must remain asynchronous. Latchlings should not all blink at the same time. `style400-game.css` uses per-piece blink duration/delay and idle delay CSS custom properties.

`prefers-reduced-motion` should disable nonessential face/star motion.

---

## Stars, progress, and completion

Star thresholds:

- `movesUsed <= lev.optimal` → 3 stars
- `movesUsed <= lev.optimal + 1` → 2 stars
- otherwise → 1 star

The win popup must show visual star icons, not text-only star counts.

Progress key:

```text
latchlings_campaign400_progress_v1
```

Progress shape:

```js
{ unlocked: Number, stars: { [levelId]: 1 | 2 | 3 } }
```

Level 400 finishes on the completion screen and must not loop.

---

## Campaign data format

`campaign400-1.js` defines compact lookup tables and `_L(x)`, expands compressed level arrays, initializes `window.LEVELS`, then appends Chapter 1.

Subsequent campaign files append their 50 levels.

Expanded runtime levels contain fields equivalent to:

```js
{
  size, pieces, nests, rocks, anchors,
  suitGates, colorGates, rails, turners,
  switches, doors, optimal, moveLimit,
  solution, difficultyScore, id, chapter
}
```

Preserve global IDs if regenerating a chapter because saved progress is keyed by level number.

---

## Validation invariants

Before publishing any level-data change, validate the **entire campaign**.

Required checks:

1. IDs are unique, sequential, and in the correct chapter.
2. Starting piece positions are unique.
3. Nest positions are unique.
4. No piece starts on a nest.
5. No nest overlaps a rock, anchor, suit gate, color gate, rail, turner, switch, or door.
6. No unintended special-tile overlaps.
7. Stored solution replays through shipping semantics and captures every Latchling.
8. Stored solution is within `moveLimit`.
9. `optimal` and star thresholds are solver-verified before publication.
10. Chapter mechanic is genuinely involved beyond the introduction.
11. Expert levels are screened against short obvious solutions.
12. Difficulty does not collapse at chapter boundaries.

Historical note: the retired 80-level campaign contained **28 nest/object overlaps**. The 400-level replacement was explicitly designed to eliminate them.

The generator/validator used during the rebuild is not currently committed. Adding a reproducible `tools/` validator/generator is strongly recommended.

---

## Visual themes

- Sunpetal Meadows: bright meadow, flowers, warm stone
- Lanternwood Grove: dark green woodland, lantern warmth
- Lodestone Caverns: dark blue cave, cyan/purple crystals
- Masquerade Keep: purple moonlit castle, gold ornament
- Prism Gardens: luminous garden, prismatic accents
- Copperline Junction: warm industrial copper/rail look
- Stormswitch Foundry: cool steel and electric storm accents
- Aurora Crown: dark royal blue/purple with aurora glow

Themed decoration must never obscure board readability on a phone.

---

## Deployment workflow

GitHub Pages serves `main` from the repository root.

Safe deployment sequence:

1. Inspect current `main` and `index.html`.
2. Update this handoff with an `IN PROGRESS` plan and commit it.
3. Upload dependencies before switching `index.html` during large migrations.
4. Update `index.html` last.
5. Check the `pages build and deployment` workflow.
6. Wait for `completed / success`.
7. Verify referenced files exist and perform runtime/browser checks.
8. Update this handoff with final status/results and commit it.

A successful Pages workflow proves static deployment succeeded; it does **not** prove imported JavaScript exists or executes.

---

## Testing priorities

Pay particular attention to:

- D-pad center selector hitbox and pressed state
- persistent selection
- nearest-piece selection after capture
- continuous animation through turners
- trails on bent routes
- switch/door state
- 50-level chapter range navigation
- Level 400 completion
- localStorage progress
- theme readability on smaller phones
- asynchronous blinking
- nest exclusivity
- difficulty dips near chapter boundaries

When a level is reported impossible, reproduce it using exact shipping simulation. Do not guess.

---

## Recent feature history

1. Early-game difficulty tuned upward.
2. D-pad rebuilt as one continuous rocker.
3. Center Latchling selector added.
4. Selector pressed-state jump fixed.
5. Nearest remaining Latchling auto-selection added.
6. Visual stars added to win modal.
7. Expressive face animation added.
8. Blink timing changed to asynchronous intervals.
9. Campaign expanded from 80 to intended 400 levels.
10. Eight chapter visual themes added.
11. Chapter level select expanded to five 10-level ranges.
12. Hard nest-exclusivity rule introduced.
13. Difficulty curve redesigned for sustained hard/expert tails.

---

## First actions for a future chat

1. Read this handoff.
2. Inspect current `main` and `index.html`.
3. Create/update the `Current Work` section and commit the plan before implementing anything.
4. Fix the missing `campaign400-3.js` issue if it remains unresolved.
5. Run a full repository-backed campaign audit.
6. Verify Chapter 3 and representative expert levels through the live build.
7. At task completion, update and commit this handoff again.

Suggested continuation prompt:

> Continue development of Latchlings. The repository is `maloysius-wq/latchlings`. Read `DEVELOPMENT_HANDOFF.md` first and use the current repository as the source of truth. Follow the mandatory handoff workflow before making changes.
