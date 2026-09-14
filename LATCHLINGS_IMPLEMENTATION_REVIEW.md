# Latchlings — implementation review against the visual/story audit

Reviewed September 13, 2026 (Pacific), against current GitHub main and the deployed game.

## Verdict

**Accept the chapter rollout as substantial progress. Do not mark the entire original audit complete yet.**

The game is materially easier to read. Settings, Daily isolation, dialogue order, chapter reward presentation, and compact gameplay controls have improved. The tested puzzle solutions still work.

However, the current handoff closes **Pass 3: chapter application**, not all five passes. The full cinematic/ending direction and mobile finishing work remain. There are also reproducible text, hint, and motion defects that should be corrected before final acceptance.

This was a read-only repository review. No game files, commits, workflows, or production progress were changed. Browser progress used disposable local sessions.

## Basis and coverage

- Original audit baseline: `a5048dd25804fdd261639e5a22332a0cfd506682`.
- Reviewed head: `d6e39c0866505795c2aa6a26777896072e16e7df`. Rechecked main at the end; it had not moved.
- Compared 174 commits / 30 changed files from the original baseline; inspected current handoff, access instructions, relevant archive entries, current code and changes.
- GitHub Pages and Repository Access Guard both succeeded on the exact reviewed head: [Pages run](https://github.com/maloysius-wq/latchlings/actions/runs/34796217103), [guard run](https://github.com/maloysius-wq/latchlings/actions/runs/34796218186).
- Live Aurora CSS and JS SHA-256 hashes match the handoff's accepted hashes.
- Rendered and measured **all 400 starting boards** at 390×844. Captured the 40 ten-level endpoints, all eight chapter entries, and the Level 366 proof.
- Inspected all **25 cinematic beats**, all eight Atlas chapter views and reward cards, fresh journal, Settings, Daily, home and ending.
- Replayed real authored solutions for **Levels 1, 50, 100, 150, 200, 250, 300, 350 and 400**. Every one finished at its authored optimal move count with no pieces remaining.
- Solved the current Daily (Level 322, 13 moves) from fresh progress. Campaign unlocks/stars stayed at Level 1 / empty, cinematic-seen state stayed unchanged, and completion was stored separately.
- Checked gameplay layouts at 320×568, 360×844, 390×844, 430×844 and 768×844, normal and large text, using six representative boards per configuration. The control region stayed within the viewport in all 60 samples.
- Rendered settled small-screen versions of all 25 cinematic beats separately.
- No JavaScript page errors in the main and supplemental board/solution runs.

**Limits:** This is not an exhaustive 400-level playthrough, a physical-phone test, Safari/iOS certification, a full assistive-technology audit, audio listening review, or frame-rate/memory benchmark. Passing deployment and layout assertions is not the same as professional visual acceptance.

## Reproducible issues to fix

### R1 — P1: Story and mechanic text are still clipped

At 390×844 / normal text:

- **40 story rails** have content taller than their clipped parent: Levels **71–80, 141–150, 201–210, 341–350**.
- **305 of 400 route tips** exceed their two-line box.
- Level 201 is a clear example: the story paragraph ends below its visible parent, cutting off “markers.” The route tip loses the distinction “black suit answers another” behind an ellipsis.

The new 14px story font is good, but legacy fixed heights and overflow rules survived. The Level 201 paragraph reaches y=185 while its parent ends at y=174. Its mechanic copy needs 48px but receives 32px.

**Source:** [fixed story heights](https://github.com/maloysius-wq/latchlings/blob/d6e39c0866505795c2aa6a26777896072e16e7df/style400-story-rail-board.css#L47), [hidden overflow](https://github.com/maloysius-wq/latchlings/blob/d6e39c0866505795c2aa6a26777896072e16e7df/style400-story-rail-board.css#L87), [two-line mechanic clamp](https://github.com/maloysius-wq/latchlings/blob/d6e39c0866505795c2aa6a26777896072e16e7df/style400-story-theme.css#L17).

**Required correction:** Author genuinely concise immediate lines and allow safe wrapping. Keep essential mechanic distinctions visible. Do not fix this by shrinking the text back down. Re-test all 400 rails/tips at normal and large text, including ancestor clipping—not merely paragraph scroll height or document overflow.

[Level 201 evidence](C:/RetroRig_Codex_Handoff/audit-latchlings/review-2026-09-13/shots/clipping-390-false.png)

### R2 — P2: The in-game Reduced Motion preference does not stop resident movement

With the OS/browser motion preference set to normal and the game's preference already saved as Reduced:

- Parent preference and iframe `data-motion` both correctly read “reduced.”
- After 12.5 seconds, two adults had started moving.
- After entering gameplay and waiting another 12.5 seconds, the third adult moved in the offscreen home iframe.

The resident scheduler checks a constant captured from the OS preference. The game's CSS preference does not cancel Web Animations API movement or the timer.

**Source:** [home resident scheduler](https://github.com/maloysius-wq/latchlings/blob/d6e39c0866505795c2aa6a26777896072e16e7df/title-island-concepts/index.html#L268), [preference message handling](https://github.com/maloysius-wq/latchlings/blob/d6e39c0866505795c2aa6a26777896072e16e7df/title-island-concepts/index.html#L325).

**Required correction:** Give the scheduler a live effective preference combining game and OS settings. Cancel active movement and pending timers when reduced motion is enabled or the scene becomes inactive. Resume deliberately when allowed. Test the setting independently of OS reduced motion.

### R3 — P2: Hint highlighting expires before the player returns to the board

The highlight timer starts when the hint modal opens and removes the highlight after 3.2 seconds. I waited 3.8 seconds to read the hint, closed it, and found **zero highlighted elements**, despite the text promising a highlighted piece and direction on return.

**Source:** [showHint](https://github.com/maloysius-wq/latchlings/blob/d6e39c0866505795c2aa6a26777896072e16e7df/game400-b.js#L35).

**Required correction:** Start the highlight on “Back to board,” or retain it until the suggested move, dismissal, selection change or reset. Keep the improved reset-before-hint warning.

### R4 — P2: Large Text does not enlarge the essential story line

Measured at Level 201:

| Viewport | Story normal → large | Route tip normal → large |
|---|---|---|
| 390×844 | 14px → 14px | 13.5px → 16px |
| 320×568 | 13px → 13px | 12.5px → 12.5px |

The option changes some surfaces but not the most important story text; the short-screen `!important` rule also defeats the route-tip increase.

**Required correction:** Define which text is covered by the preference, use a shared scale, and allocate room for the enlarged content. Revalidate dialogs, cinematics and journal text too. Keeping controls in bounds while defeating the selected font size is not a satisfactory accessibility tradeoff.

**Source:** [story readability rules](https://github.com/maloysius-wq/latchlings/blob/d6e39c0866505795c2aa6a26777896072e16e7df/style400-story-rail-board.css#L112), [game text-size and short-screen rules](https://github.com/maloysius-wq/latchlings/blob/d6e39c0866505795c2aa6a26777896072e16e7df/style400-game.css).

### R5 — P2: Small-screen cinematic Continue requires discovering an internal scroll

At 320×568, **14 of 25 settled beats** place part or all of Continue below the viewport at the initial scroll position. Across the Drift beat 2 puts it at y=574–616. The copy region is scrollable, so this is **not an unescapable progression block**, but the expected next action disappears.

**Required correction:** Keep cinematic navigation in a persistent footer outside the scrolling dialogue region. Make remaining dialogue/scroll state obvious. Do not reduce essential text to make everything fit.

[Small-screen porch evidence](C:/RetroRig_Codex_Handoff/audit-latchlings/review-2026-09-13/shots/settled-320-across-drift.png)

## Outstanding visual/story work

### Cinematics: layout improvement, not a complete directorial pass

The chronological dock is a real success: Tansy → Pip → Tansy and Bramble → Pippa → Bramble now retain their order. The porch gained a dusk setting and recognizable twin lanterns. The Copperline “first time” contradiction was corrected.

But most scenic compositions remain essentially those reviewed originally. Ordered rows are an acceptable correctness fix; they do not by themselves provide the one-speaker pacing, purposeful character actions, visual cause-and-effect and scenic restaging described in Pass 4.

| Film / beat | Current review and remaining direction |
|---|---|
| Opening 1 | Still a route-network overview. Ground it in an ordinary delivery and visible drift. |
| Opening 2 | Same home introduction and five-person roster. Introduce residents through chores rather than a cast briefing. |
| Opening 3 | Missed-route marks are present; make basket, watering and mail failures unmistakable actions. |
| Opening 4 | Network/cargo overview remains. Show a connection working flexibly. |
| Opening 5 | Large Waykeeper emblem remains. Make answering the call an action by the player. |
| Opening 6 | Still the STORY → ROUTE CREW diagram. Show neighbors volunteering. |
| Opening 7 | Still a demonstration panel. Connect it to guided, playable teaching. |
| Opening 8 | Home scene and several lines remain before play. Connect the failed basket directly to the first puzzle. |
| Across 1 | Wider network remains diagram-like; add a convincing horizon and distance reveal. |
| Across 2 | **Improved:** dusk porch, twin lanterns, correct dialogue order. Refine telescope/character staging and emotional acting. |
| Across 3 | Broken line diagram remains; show actual formerly connected endpoints drifting apart. |
| Across 4 | Side-by-side maps remain; demonstrate one alignment causing another mismatch. |
| Across 5 | New-route network remains; show the new route actually reaching the familiar porch. |
| Old Maps 1 | Ordered joke now works. Restage as a physical drawer discovery with character performance. |
| Old Maps 2 | Dates remain very small. Make dates and repeated landmarks readable evidence. |
| Old Maps 3 | Map sequence remains abstract. Show why each map fits its own time. |
| Old Maps 4 | Automation remains a panel/gear diagram. Show a tended desk becoming unattended. |
| Old Maps 5 | Frozen lines communicate the idea broadly; show healthy moving islands against stale routing. |
| Old Maps 6 | **Continuity fixed.** The recovered method still needs visual demonstration, not another explanatory paragraph. |
| Homeward 1 | Regional node map remains. Give each community a recognizable working signal. |
| Homeward 2 | Keepsake cards remain in place of people contributing. Show different residents doing different tasks. |
| Homeward 3 | Distributed network remains a diagram. Stage an observable cross-region response chain. |
| Homeward 4 | Alternate lines remain abstract. Show two valid routes working at different moments. |
| Homeward 5 | Crown is still a small landmark. Give it identity without portraying a central master control. |
| Homeward 6 | Home return composition exists. Add ordinary successive actions and a pullback showing home as one node. |

Opening still has eight beats before Level 1, and the next major film still arrives only after Level 250. Short regional visual arrivals—not additional long exposition—remain worthwhile.

### Ending: the original high-priority finding is still open

The new Level 400 reward card is a welcome addition, but “See the living Skyway” leads to the **unchanged simplified completion scene**:

- Flat cottage and island, visibly below the title's material detail.
- No ordinary delivery/visit sequence carrying the emotional conclusion.
- The explanatory “No master switch / No final map / A living Skyway” text remains.
- Level Select is still much more prominent than Return to Little Home.

Reuse the canonical home scene, show an ordinary morning working while the world still drifts, then make Return to Little Home primary. Also shorten the new Aurora reward paragraph; it repeats the thesis before the older ending repeats it again.

[Ending evidence](C:/RetroRig_Codex_Handoff/audit-latchlings/review-2026-09-13/shots/ending.png)

### Chapters and world presentation

All eight chapter visual modes are applied correctly; Level 366 intentionally retains the earlier dark Aurora proof while the other 49 Aurora boards use the pale crystalline treatment. That is a documented exception, not an accidental theme failure. Decide whether to harmonize it during final art direction.

The quieter floors, stronger selected piece, recognizable nests and chapter reward postcards are worth keeping. Remaining polish:

- Keep decorative props entirely outside playable cells. The Level 201 capture still shows small decorative badges over corner cells; these can resemble additional mechanics.
- Different chapters are recognizable, but five within-chapter “movements” are often subtle palette changes rather than distinct places.
- Atlas navigation remains crowded, with small secondary text and truncated range names. New landmarks are helpful, but many nodes still feel interchangeable.
- Home rewards now have focused reveal behavior, but resident use and tap-to-revisit memories are not implemented.
- Home still says “Play” at returning/completed progress, without chapter/next-route context.
- Later story rails use the same third-person movement setup for ten levels while rotating the named portrait. This removes the old ten-line revelation recycling across the whole chapter, but is not fully authored character dialogue or per-route progression.
- Cast expressions and identity data are still duplicated; the presentation stack gained another shared override layer and four chapter wrapper modules. Consolidation remains outstanding.

## Original-audit acceptance checklist

“Improved” means meaningful progress, not full closure of every requested refinement.

| Audit IDs | Status at reviewed head |
|---|---|
| V01 quiet board floors | Largely addressed; residual decorative overlap merits cleanup. |
| V02 readable story rail | Partial: larger copy, but R1 clipping and R4 scaling defects. |
| V03 shared cinematic layout | Partial: chronological dock done; scenic/pacing pass outstanding. |
| N01 dialogue order | Addressed for the identified speaker-order defects. |
| N02 earned knowledge | Fresh journal addressed; later rail authorship/pacing remains partial. |
| U01 real Settings | Addressed; actual home gear tested. |
| U02 touch targets | Improved for gameplay chrome/Atlas chapter controls; not an all-controls certification. Cinematic Skip is still 28px high on the small sample. Dense board pieces themselves remain small. |
| U03 viewport containment | Gameplay control-region issue addressed in tested configurations; see R5 for cinematics. |
| N03 Daily isolation | Addressed in actual fresh Daily solve. |
| U04 mechanic teaching | Separate mechanic note and real rule art added; R1 still truncates teaching. |
| V04 material consistency | Outstanding across title, scene cards and ending. |
| V05 purposeful domestic actions | Outstanding. |
| V06 discoverable keepsakes | Partial: rewards/reveals added; resident use and memory interaction outstanding. |
| U05 contextual Continue on home | Outstanding. |
| V07 depth hierarchy | Improved; complete cross-region fixture/decoration consistency still needed. |
| V08 selection feedback | Improved; selected piece and destination emphasis added. |
| V09 readable nests | Improved; retain suit plus color and refine arrival feedback. |
| V10 mechanic-state causality | Partial; explicit switch-door relationship/rejected-blocker feedback still outstanding. |
| U06 control dominance | Compact controls improved. Swipe/undo remain optional design experiments, not blockers for this review. |
| V11 emotional win causality | Partial; chapter rewards improved, ordinary-world actions still limited. |
| U07 hints | Partial: honest reset flow and highlight added; R3 prevents reliable highlighting after reading. |
| U08 failure tone | Addressed in source. |
| U09 mastery copy | Move wording/pluralization addressed; star criteria discoverability still needs attention. |
| V12 meaningful Atlas landmarks | Improved but partial. |
| V13 Atlas hierarchy | Outstanding. |
| V14 restored vs available states | Further visual distinction still needed; no new progression defect found. |
| V15 visible map repair | Existing transition retained; working-landmark payoff remains partial. |
| N04 information-layer roles | Simplified rail is progress; duplicated exposition remains. |
| V16 story postcards | Reward postcards added; full Story Card redesign outstanding. |
| U10 journal structure | Outstanding: long stacked content still precedes replay library. |
| N05 characterization | Outstanding beyond static portraits/copy. |
| V17 chapter reward | Substantially addressed across all eight chapters; trim late reward copy. |
| V18 ending art quality | Outstanding. |
| N06 visual ending thesis | Outstanding. |
| V19 presentation consolidation | Outstanding. |
| U11 accessibility | Partial: zoom restored, preferences exposed; R4/R5 and broader device/focus checks remain. |
| V20 motion | Partial: R2 confirmed. |
| A01 audio | Controls now reachable; listening/mixing/interruption review not performed. |
| P01 device performance | Not certified; measure on a modest physical phone. |

## Recommended next implementation order

1. Fix R1–R5 in a focused usability pass; retain the approved board art and protect campaign definitions/solutions.
2. Complete the original **Pass 4**: restage the 25 cinematic beats and replace the ending presentation. Approve representative scenes before broad changes.
3. Finish home/Atlas/journal coherence and author concise movement/character copy.
4. Complete **Pass 5**: physical phone and iOS/Safari checks, safe areas, scaling/focus, real audio review, motion interruption, frame pacing, and consolidation.
5. Re-run the acceptance matrix and close the audit item by item. Do not label untested or intentionally deferred items “complete.”

### Copy/paste instruction for the implementation chat

> Read DEVELOPMENT_HANDOFF.md first and use current GitHub main as the source of truth. Review LATCHLINGS_IMPLEMENTATION_REVIEW.md alongside the original LATCHLINGS_VISUAL_STORY_AUDIT.md. Preserve the accepted chapter art and campaign data. First fix review findings R1–R5 and verify them with settled browser evidence, including ancestor text clipping, independent in-game Reduced Motion testing, persistent hint highlights, actual large-text scaling, and visible cinematic navigation on small screens. Then complete the outstanding cinematic/ending and mobile-finishing passes. Keep completed, partial, deferred and untested audit items explicitly separate. Follow the repository's development/handoff workflow for implementation.

## Local evidence

Main measurements: [results.json](C:/RetroRig_Codex_Handoff/audit-latchlings/review-2026-09-13/results.json). Text and actual-solution tests: [supplement.json](C:/RetroRig_Codex_Handoff/audit-latchlings/review-2026-09-13/supplement.json). Settled small-screen cinematics: [inspect.json](C:/RetroRig_Codex_Handoff/audit-latchlings/review-2026-09-13/inspect.json). Independent motion test: [motion.json](C:/RetroRig_Codex_Handoff/audit-latchlings/review-2026-09-13/motion.json).

Screenshots and contact sheets are in the same local review folder. The original audit and original screenshots were preserved.
