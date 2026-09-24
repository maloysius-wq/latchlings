# Latchlings game polish design

Date: 2026-09-24
Status: approved for implementation
Base: `main` at `47103e9fb1b3d75b3eac71bdfa40e70e632b51f7`

## Purpose and accepted direction

Make the existing 400-level web game feel reliable, readable, and visually coherent on phones without replacing its puzzle rules or story. This design responds to the full-game audit and the player's approvals on 2026-09-24.

The player explicitly wants **no Undo button** and **no narrator voices**. Every cinematic spoken line remains player-advanced by tap or keyboard. The existing five-resident Little Home, canonical story order, pre-Astra bottom controls, 400 authored boards and solutions, move limits, and star rules are protected. The work should improve presentation and recovery without introducing spoilers or a new game engine.

## Delivery boundaries

The work is a staged polish program in the existing static HTML/CSS/JavaScript architecture:

1. Reliability and gameplay clarity: deterministic browser tests, durable progress, approachable Daily selection, current-board hints, and gameplay regressions.
2. Phone presentation: essential-copy readability, Atlas detail hierarchy, and inspectable late-board mechanic states.
3. Story staging: landmark-connected cinematic routes, legible changing maps and network causality, clearer first-board mapping, short early chapter payoffs, and a visible final parcel arrival.

Each stage must keep the full shipped test command green before the next stage starts. A stage may be committed separately, but the final review compares all changes against the protected behavior above. No cloud account, backend, social leaderboard, voice assets, campaign rewrite, new puzzle data, Undo, or star-rule change is included.

## Gameplay behavior

### Progress durability

Browser storage remains the normal save path. Add a versioned, downloadable JSON backup containing campaign unlock/stars and earned cinematic state, with import from a player-selected local file. Import validates shape, ranges, known cinematic IDs, and consistency before replacing active state; invalid files never partially overwrite progress. The player confirms a valid import because it replaces current local progress. Daily history and preferences are excluded from this first backup format and remain separate from campaign unlocks.

If writing progress to browser storage fails, keep the in-memory result for the current session, show a clear nonblocking warning, and offer backup export. Never imply a save succeeded when it did not. Reset Progress remains an explicit confirmed action, with player-facing copy rather than developer terminology.

### Daily Puzzle

Daily selection remains deterministic for a given local date and player tier, but its pool cannot include mechanics the player has not encountered in the campaign. The tier is based on completed campaign progress, not the merely unlocked next level. A fresh player receives a curated early-board pool. The Daily header names its difficulty/mechanic tier, and its Rules entry remains available; Daily completion stays isolated from campaign stars and unlocks. This is not a global identical-for-everyone challenge because the current game has no shared score or leaderboard.

### Hints and failure

No Undo control or state rollback is added. Preserve move limits, Reset, retry flow, and star scoring. Replace the reset-only hint with a bounded, nonblocking current-state search using the real movement rules. If the search finds a completion within the remaining move budget, show only the next piece and direction, highlight them on return, and avoid disclosing the whole solution. State that a position cannot finish within the remaining budget only when the search establishes that conclusion. If search is inconclusive, say so honestly and offer Reset; do not label an unproven state impossible. Keep the existing authored first-move hint as the fast path for the untouched board.

### Dense-board understanding

Keep the board and bottom-control geometry unchanged. Add a non-disruptive inspection path for a selected/tapped mechanic tile that states its type, letter/direction, and live state in ordinary language, especially for switches, doors, gates, rails, and turners. It must not consume a move or obscure the board. Keyboard/D-pad players must be able to reach the same information. Existing non-color cues remain.

## Visual and narrative behavior

### Opening and first route

Keep the canonical Little Home iframe, the five-resident cast, the 21 player-paced lines, and the current story text. Refine choreography rather than rebuild the scene: establish a visible source and intended destination for each morning errand, show its actual miss, let the relevant resident react, and reduce older route overlays as attention moves to the next clue. Routes and movers are placed from measured landmarks and re-synchronized on resize; animation endpoints and reduced-motion endpoints agree.

The Waykeeper model transition briefly labels the breakfast route's origin and Little Home porch destination. The first playable board carries the same two semantic labels or an equivalent short visual handoff without implying that the abstract grid physically matches the island geography. The Level 1 helper-crew explanation remains intact.

### Three later films

- **Across the Drift:** the newly drawn route terminates at the same recognizable twin-lantern porch/deck shown earlier. Its endpoint, arrival pulse, and receiving prop share one measured landmark. Avoid independent percentage-positioned approximations.
- **Old Maps, New Routes:** Year 12, 31, and 58 show visibly different coordinates for the *same identifiable landmarks*. Routes on each sheet meet that sheet's landmarks. The sequence explicitly demonstrates that each dated map was valid for its moment; it must not merely rotate otherwise identical drawings.
- **Homeward:** network routes visibly begin and end at named community nodes. A short, ordered sequence communicates report -> anchor adjustment -> new travel window -> redrawn route. The “two routes can both be right” image should show two complete alternatives, not floating strokes.

The films keep their authored dialogue and manual pacing. Scene-only captures must communicate the named cause or consequence without relying entirely on captions. No recorded narration is added; on-screen narrator text remains available.

### Chapter and ending payoffs

At the Level 50, 100, 150, and 200 chapter rewards, use brief, skippable visual vignettes tied to the already earned result or Little Home keepsake. They should not become long mandatory cutscenes, repeat the result prose, or preannounce later discoveries. The final network image should give Little Home enough contrast and scale to be recognized, then make a parcel visibly complete a route to its porch. The ordinary morning is the emotional payoff; the islands continue drifting.

### Phone readability and material consistency

Use the large unused cinematic copy region for comfortable essential dialogue rather than leaving a tiny line at its bottom. Aim for approximately 15-16px normal phone body text and a meaningfully larger Large Text setting; short phones may scroll the copy region while the scene, progress, Skip, and Continue remain stable. Speaker names and narration must remain legible. Atlas descriptions and node details should use a readable selected-destination panel instead of depending on miniature map labels. Keep the map dominant and its restored/current/available/locked distinctions.

Carry the existing Little Home texture and material vocabulary into only the cutscene props that currently look flat or disconnected. Preserve distinct chapter palettes and the accepted gameplay depth hierarchy. Avoid stacking broad override layers when a scene-local rule or shared token can express the same treatment.

## Failure handling and accessibility

Backup import errors are actionable and do not mutate progress. Storage warnings are visible but do not block play. Search-limited hints never claim certainty they lack. Animation failure or delayed iframe readiness must leave a valid settled story state and reachable Continue/Skip controls. Reduced Motion shows the same semantic endpoints without travel animation.

Maintain keyboard operation, focus restoration, meaningful labels, user zoom, Normal/Large Text, non-color mechanic/state cues, and at least the current action-target sizes. Physical Android/iOS touch, performance, safe-area, and subjective audio balance remain external certification tasks; desktop emulation is not represented as hardware proof.

## Verification and acceptance

First repair the two current browser-suite failures by waiting for geometry readiness and observable animation/settled states instead of assuming a fixed short timer. Do not weaken assertions about actual destinations or resident overlap. Add tests that fail before each gameplay or scene change and pass afterward.

Permanent checks cover: all 400 authored solution sequences without changing their source bytes; campaign/Daily isolation; save failure and backup round trip/rejection; tier-safe Daily selection; current-state hint correctness and honest inconclusive behavior; mechanic inspection; all 21 opening turns and later film beats; landmark-to-route geometry; dated-map differences; ordered Homeward events; phone containment and Large Text at short/standard/wide portrait sizes; Reduced Motion; and the protected bottom controls. Review settled screenshots with dialogue visible and hidden. Run the full `npm test` after every stage and again on committed branch state.

Completion requires a clean test suite, no new browser page errors, visually connected routes and legible phone text in the reviewed captures, and explicit reporting of external device checks still outstanding. The repository handoff is marked IN PROGRESS before product changes and completed only with actual committed verification evidence.
