# Latchlings Development Handoff

Last updated: 2026-08-31

## Start here

This repository is the source of truth for the mobile puzzle game **Latchlings**.

Repository: `maloysius-wq/latchlings`

Live GitHub Pages build: `https://maloysius-wq.github.io/latchlings/`

Runtime baseline immediately before this handoff was added:

- Commit: `be0eb7b0a50e32047d87925ea3793d26cb61f619`
- Message: `Deploy 400-level themed campaign`
- GitHub Pages deployment for that commit completed successfully.

**Always inspect current `main` before making changes. Do not assume the baseline SHA above is still HEAD.**

## Critical known issue discovered while writing this handoff

`index.html` currently loads:

```html
<script src="campaign400-1.js"></script>
<script src="campaign400-2.js"></script>
<script src="campaign400-3.js"></script>
<script src="campaign400-4.js"></script>
<script src="campaign400-5.js"></script>
<script src="campaign400-6.js"></script>
<script src="campaign400-7.js"></script>
<script src="campaign400-8.js"></script>
```

However, **`campaign400-3.js` is missing from the repository tree**. There is also no commit in the repository history named `Add Chapter 3 campaign data`; the deployment history jumps from Chapter 2 to Chapter 4.

This means the 400-level deployment is not actually complete despite the Pages workflow succeeding. GitHub Pages only verified that the static site deployed; it does not validate JavaScript imports.

### Required first repair

Recover or regenerate the exact 50 frozen Chapter 3 levels for:

- Chapter 3: **Magnetic Anchors**
- Theme: **Lodestone Caverns**
- Global level IDs: **101–150**

Then create `campaign400-3.js` in the same compressed format as the other `campaign400-N.js` files and rerun the full campaign audit described below.

The original exact `campaign400-3.js` payload was not preserved in GitHub history or the recoverable prior-chat context, so do **not** pretend it can simply be restored from a hidden commit.

Until this is fixed, treat the 400-level campaign as having a critical runtime/data integrity defect.

---

## Product direction and non-negotiables

Latchlings is a mobile-first magnetic sliding puzzle game. The user wants it to feel polished, cute, premium, uncluttered, highly replayable, and genuinely challenging.

Important requirements that have been repeated throughout development:

- Mobile-first controls and layout.
- No emoji in the game UI. Use SVG/CSS/glyphs instead.
- Preserve the established cozy/premium visual language unless a change clearly improves it.
- Latchlings are round colorful creatures with expressive centered faces.
- Suit symbols are black/dark, not colored, so suit and body color remain separate visual/mechanical clues.
- Movement must feel like one continuous magnetic snap, not cell-by-cell hopping.
- The selected Latchling remains selected until the player selects another, unless a captured piece triggers smart auto-selection.
- Other Latchlings must matter strategically as movable blockers/stoppers.
- Color and suit must matter mechanically.
- Levels must be frozen/predetermined, not randomized on each play.
- Every published level must be solvable inside its move limit.
- Difficulty should not repeatedly reset to trivial whenever a new mechanic is introduced.
- Every chapter should contain genuinely difficult and expert-level puzzles.
- Nests are exclusive cells. **Nothing else may occupy a nest tile.**
- Do not put a rock, anchor, suit gate, color gate, rail, turner, switch, door, or starting Latchling on a nest cell.
- Keep the interface quiet. Avoid currencies, ad clutter, unnecessary counters, or noisy meta UI.

The user tests primarily through the GitHub Pages URL on a phone. Push approved fixes to GitHub rather than handing over local HTML files unless explicitly requested.

---

## Active runtime files

The current 400-level build is loaded by `index.html`.

### Active CSS

- `style400-ui.css` — global UI/home/level-select shell
- `style400-game.css` — board, pieces, controls, D-pad, modals, animation, 400-level presentation additions
- `style400-themes.css` — the eight chapter-specific visual themes

### Active JavaScript

Campaign data, in order:

- `campaign400-1.js` — Chapter 1, Levels 1–50
- `campaign400-2.js` — Chapter 2, Levels 51–100
- `campaign400-3.js` — **MISSING; should be Chapter 3, Levels 101–150**
- `campaign400-4.js` — Chapter 4, Levels 151–200
- `campaign400-5.js` — Chapter 5, Levels 201–250
- `campaign400-6.js` — Chapter 6, Levels 251–300
- `campaign400-7.js` — Chapter 7, Levels 301–350
- `campaign400-8.js` — Chapter 8, Levels 351–400

Engine:

- `game400-a.js` — constants, chapter metadata, progress, themes, level select, rendering, piece selection helpers
- `game400-b.js` — movement simulation, animation, win/loss/hints, rules/settings, binding and controls

### Legacy files still in the repo

These belong to the retired 80-level build and are **not loaded by the current `index.html`**:

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

Do not patch these expecting the live game to change. Keep them only as rollback/history unless intentionally cleaning the repo later.

---

## Campaign structure

The intended current campaign is **8 chapters × 50 levels = 400 levels**.

| Chapter | Global levels | Mechanic focus | Theme |
|---|---:|---|---|
| 1. First Snaps | 1–50 | Edges, rocks, core full-distance snapping | Sunpetal Meadows |
| 2. Clever Stops | 51–100 | Other Latchlings as movable stoppers | Lanternwood Grove |
| 3. Magnetic Anchors | 101–150 | Anchors plus prior stopper logic | Lodestone Caverns |
| 4. Suit Gates | 151–200 | Black suit identity gates | Masquerade Keep |
| 5. Color Gates | 201–250 | Body-color gates plus suit logic | Prism Gardens |
| 6. Rails and Turns | 251–300 | One-way rails and CW/CCW turners | Copperline Junction |
| 7. Switchworks | 301–350 | Switches, linked doors, cumulative routing | Stormswitch Foundry |
| 8. Master Circuit | 351–400 | Full mechanic combination | Aurora Crown |

Each chapter is displayed in five 10-level ranges so the level-select screen does not become a 50-button wall.

The difficulty philosophy is:

1. A very short mechanic introduction.
2. Development puzzles that combine the new mechanic with prior concepts.
3. A long medium/hard section.
4. An expert tail near Levels 46–50 of each chapter.

Do not return to the old pattern of ten-level chapters where each new chapter resets to tutorial difficulty.

---

## Core movement rules

Each Latchling has:

- `color`
- `suit`
- `pos`
- `expression`

A move begins in U/D/L/R and continues until the board stops or redirects it.

A moving Latchling is blocked by:

- board edge
- rock
- another Latchling
- closed door
- mismatched suit gate
- mismatched color gate
- rail entered from the wrong direction

Special behavior:

- Matching assigned nest: captures the Latchling immediately.
- Anchor: stops the Latchling on the anchor cell.
- Turner: changes travel direction CW/CCW while the same snap continues.
- Switch: toggles its linked door bit when traversed.

`game400-b.js::simulate()` is the shipping movement semantics. Any solver/validator must match this function exactly.

---

## Controls and selection behavior

The D-pad is a single continuous cross-shaped rocker with invisible directional hit regions.

The center of the D-pad contains a circular Latchling selector button with a cycle-arrow/three-dot glyph.

Current intended behavior:

- Tapping a Latchling directly selects it.
- Center selector cycles clockwise through all uncaptured Latchlings using their board positions around the board center.
- When a Latchling reaches its nest, the game automatically selects the closest remaining Latchling to that nest.
- Nearest selection uses squared Euclidean distance; ties fall to the lower piece index.

A prior bug made the center selector jump down/right on press because the generic `.dpad button:active` transform replaced its centering transform. The current fix is deliberately specific:

```css
.dpad button.dpad-cycle:active {
  transform: translate(-50%, calc(-50% + 3px)) scale(.985) !important;
}
```

Do not remove that specificity without testing the selector on mobile.

---

## Latchling faces and animation

Faces use CSS expressions including:

- happy
- surprised
- angry
- smug
- sleepy
- curious
- determined

Faces animate subtly. Blinking was specifically changed so Latchlings should **not all blink in sync**. `style400-game.css` uses per-piece CSS custom properties such as blink duration/delay and idle delay.

The user explicitly asked for different blink intervals. Preserve asynchronous blinking when touching piece rendering or animation CSS.

`prefers-reduced-motion` disables face/eye/mouth/star animation in the themed CSS.

---

## Win, stars, progress, and completion

Star calculation in `game400-b.js`:

- `movesUsed <= lev.optimal` → 3 stars
- `movesUsed <= lev.optimal + 1` → 2 stars
- otherwise → 1 star

The win popup visually renders 1–3 star icons. Do not regress to text-only “you earned X stars.”

Current progress key:

```text
latchlings_campaign400_progress_v1
```

Stored data shape:

```js
{
  unlocked: Number,
  stars: { [levelId]: 1 | 2 | 3 }
}
```

Current campaign clamps progress to Levels 1–400.

Level 400 should finish on the `complete` screen and must not loop back into itself.

The old 80-level build used a different localStorage key; do not accidentally restore it.

---

## Campaign data format

The `campaign400-N.js` files use a compressed numeric representation to keep mobile payloads smaller.

`campaign400-1.js` defines lookup tables for:

- colors
- suits
- expressions
- directions
- turn direction

It also defines `_L(x)`, which expands compact arrays into normal runtime level objects, initializes `window.LEVELS = []`, then pushes Chapter 1.

Later chapter files append to `window.LEVELS`.

Expanded runtime level objects contain fields equivalent to:

```js
{
  size,
  pieces,
  nests,
  rocks,
  anchors,
  suitGates,
  colorGates,
  rails,
  turners,
  switches,
  doors,
  optimal,
  moveLimit,
  solution,
  difficultyScore,
  id,
  chapter
}
```

If replacing or regenerating a chapter, preserve global IDs and chapter numbering. Do not silently reorder levels because saved progress is keyed by numeric level ID.

---

## Level-validation invariants

Before publishing any level-data change, validate the full campaign, not only the edited chapter.

At minimum every level must satisfy all of these:

1. Level IDs are unique, sequential, and map to the correct chapter.
2. All starting piece positions are unique.
3. All nest positions are unique.
4. No piece starts on any nest.
5. **No nest overlaps any rock, anchor, suit gate, color gate, rail, turner, switch, or door.**
6. No illegal overlapping special tiles unless the mechanic explicitly allows it. Current design intent is generally one board object per special cell.
7. Replaying the stored `solution` through shipping movement semantics captures every Latchling.
8. Stored solution finishes within `moveLimit`.
9. `optimal` and star thresholds are solver-verified before publication.
10. The chapter’s signature mechanic is genuinely involved in the intended/verified route, especially after the introductory levels.
11. Hard/expert levels should be screened against short obvious solutions.
12. Difficulty should not collapse at chapter boundaries beyond the small amount needed to teach the new mechanic.

### Prior audit history

During the 400-level rebuild, the old 80-level campaign was found to contain **28 levels where a nest shared a tile with another board object**. The 400-level replacement process was designed specifically to forbid that.

The rebuild was reported as `400/400` passing the campaign audit with zero overlap/replay problems before deployment. However, because `campaign400-3.js` was never committed, **the repository as it exists now cannot be considered a complete 400/400 audited artifact** until Chapter 3 is restored and the audit is rerun on the files actually present in GitHub.

The generator/validator used during the rebuild is not currently committed in this repository. A future development pass should strongly consider adding a reproducible `tools/` validator/generator so this cannot happen again.

---

## Visual direction

The established UI language is:

- soft cream rounded cards
- deep navy text
- sky/cozy fantasy framing
- pastel Latchling bodies
- black/dark suit glyphs
- soft shadows
- large tactile D-pad
- minimal clutter
- touch-first sizing

The chapter-specific visual layer is in `style400-themes.css` and changes board palette, canvas/background, decorative flourishes, rocks, and some mechanic-specific rendering while preserving readability.

Theme identities:

- Sunpetal Meadows: bright meadow, flowers, warm stone
- Lanternwood Grove: dark green woodland, lantern warmth
- Lodestone Caverns: dark blue cave, cyan/purple crystals
- Masquerade Keep: purple moonlit castle, gold/ornamental suit-gate styling
- Prism Gardens: luminous garden, multicolor/prismatic accents
- Copperline Junction: warm industrial copper/rail aesthetic
- Stormswitch Foundry: cool steel, storm/electric accents
- Aurora Crown: dark royal blue/purple with aurora glow

Do not make themed decoration cover the playable board or reduce tile readability on phones.

---

## Deployment workflow

Hosting is GitHub Pages from `main`, root directory.

Live URL:

`https://maloysius-wq.github.io/latchlings/`

Recommended safe rollout for large changes:

1. Inspect current `main` and active `index.html` first.
2. Add new assets under new filenames if doing a large campaign/engine migration.
3. Upload all dependencies before changing `index.html`.
4. Update `index.html` last.
5. Check the GitHub Pages `pages build and deployment` workflow.
6. Wait for `status: completed`, `conclusion: success`.
7. Fetch/check the public Pages build or test the URL on mobile.
8. For large JS/CSS changes, hard-refresh once to avoid stale browser cache.

Important lesson from the 400-level deployment: **a successful Pages workflow does not prove every referenced JS file exists or runs.** Verify the repository tree and browser network/runtime after deployment.

---

## Testing priorities

When the user reports a level is impossible, do not guess. Reproduce it through the exact `simulate()` semantics and provide an exact route or repair the level.

Pay particular attention to:

- center D-pad selector hitbox/pressed state on phone
- Latchlings retaining selection correctly
- nearest-piece auto-selection after capture
- continuous motion animation through turners
- visual trails on bent routes
- switch/door state transitions
- Chapter 50-level range navigation
- final Level 400 completion flow
- stale localStorage/progress behavior
- theme readability on smaller phones
- synchronized face animations accidentally returning
- nest exclusivity
- difficulty dips around Levels 51, 101, 151, 201, 251, 301, and 351

---

## Known current limitations / future polish

The current build is deliberately focused on core puzzle play. It does not yet have a full native-app layer, cloud accounts, cloud saves, social systems, or a large live-ops economy.

Potential future polish that fits the design if the user asks for it:

- magnetic sound design / WebAudio feedback
- haptics
- tasteful particles
- improved transitions
- better accessibility options
- campaign/meta restoration rewards
- daily challenge evolution
- analytics/test instrumentation

Do not add these merely because they are fashionable. Preserve the uncluttered puzzle-first experience.

---

## Recent feature history worth preserving

The most recent major development sequence before the 400-level rebuild was:

1. Tuned early-game difficulty so Chapter 1 was not mostly one-direction trivial moves.
2. Rebuilt the D-pad as one continuous physical rocker rather than four visible button slabs.
3. Added a center D-pad selector to cycle Latchlings clockwise.
4. Fixed the center selector jumping down/right on press.
5. Added nearest remaining Latchling auto-selection after capture.
6. Added visual star icons to the win modal.
7. Added animated expressive faces.
8. Changed blink timing so individual Latchlings do not blink in sync.
9. Expanded campaign from 80 to intended 400 levels.
10. Added eight distinct chapter themes.
11. Added 50-level chapter navigation in five 10-level ranges.
12. Added hard nest-exclusivity rules after finding overlaps in the old campaign.
13. Reworked difficulty so chapters have sustained hard/expert tails rather than resetting every ten levels.

---

## First actions for the next chat

1. Read this file.
2. Inspect the current `main` branch and `index.html`.
3. Confirm the missing `campaign400-3.js` issue still exists.
4. Restore/regenerate Chapter 3 Levels 101–150 in the same compressed format.
5. Add a reproducible validator if practical.
6. Run a full 400-level audit against the actual repository files.
7. Test the GitHub Pages build on a phone-sized browser and verify Chapter 3 loads.
8. Only after that resume new feature work or level tuning.

A good continuation prompt is:

> Continue development of Latchlings. The repository is `maloysius-wq/latchlings`. Read `DEVELOPMENT_HANDOFF.md` first and use the current repository as the source of truth. Fix any critical handoff issues before continuing feature work.
