# Latchlings — visual and story audit

Audit date: 12 September 2026. Repository: [maloysius-wq/latchlings](https://github.com/maloysius-wq/latchlings). Reviewed main: [`a5048dd`](https://github.com/maloysius-wq/latchlings/commit/a5048dd25804fdd261639e5a22332a0cfd506682), dated 11 September 2026. Live player experience inspected at https://maloysius-wq.github.io/latchlings/.

## Overall judgment

Latchlings has a coherent, appealing foundation: round expressive characters, a recognizable little household, an unusual cooperative story, eight distinct regions, and a readable core puzzle rule. Its largest gap from a professionally polished mobile game is consistency of presentation and clarity of attention. The title is a miniature landscape; the board is a dense patterned object; the Story cards are flat illustrations; the cinematics often resemble diagrams; the ending returns to a much simpler cottage. These surfaces communicate the same world with visibly different levels of detail and different visual languages.

The strongest direction is a warm, tactile storybook miniature: soft modeled characters, restrained materials, clear playable objects, and environmental storytelling through ordinary objects and small actions. Richness belongs in scenery, lighting, character performance, and consequences. A puzzle cell should never have to compete with its own decorative pattern.

This is an audit and a set of independent design studies. No repository commits, production changes, deployments, or modifications to the user's saved game were made. The repository's implementation journal gate becomes applicable before implementing the recommendations in the game.

## Coverage and limits

- Read the handoff's current-work guidance, repository access instructions, current production entry point, story bible, all four cinematic scripts and runtime definitions, dialogue processing, story rail, story model, gameplay flow, board/style layers, title source, and audio integration.
- Inspected the live game in a fresh, isolated Chromium context at 390 × 844. Replayed all **25 beats of all four cinematics** through the existing cinematic API, captured them, and visually reviewed the captures. Checked the runtime staging against the written intent.
- **Rendered all 400 initial board layouts** and collected geometry. No page JavaScript errors or document horizontal overflow were reported in that sweep. This does not establish that every element fits inside the viewport: clipping and vertical layout problems are separately discussed below.
- Visually inspected the five ten-level material variations in each of eight chapters: **40 milestone boards**, plus chapter entry boards and other representative states. Reviewed all eight Atlas region views.
- Inspected the title, early and late Story & Residents, a manual Story card, expanded story rail, pause, rules, hint, failure, ordinary win, chapter win, and campaign-completion screen. Solved Level 1 through its actual movement function using the supplied solution. Chapter reward and ending were opened as presentation states; their captures are not evidence of an organic 400-level playthrough.
- Inspected additional Level 400 layouts at 320 × 568, 360 × 844, 430 × 844, and 768 × 844. The 400-board sweep used reduced motion and suppressed automatic Story cards to isolate the board; the separate cinematic review used normal motion.
- Tested the real home Settings button and Daily entry. Daily opened Level 285 from a fresh account on the audit date.
- Created three independent HTML design studies and rendered each at 430px and 320px widths. The example interactions and dialogue sequence work, and the examples do not introduce document horizontal overflow in those checks.
- Not performed: solving all 400 puzzles, physical-device touch testing, iOS/Safari testing, audio listening/mixing evaluation, measured frame-time/battery profiling, exhaustive screen-reader testing, retention research, or player comprehension research. Recommendations about those areas are proposals or source findings, not claimed measurements.

## What to keep

1. The five named residents, their color/suit identities, and their small domestic motivations. These are the game's most distinctive assets.
2. The simple spherical species design. Improve expression, gaze, performance, and lighting rather than adding head accessories that conflict with the established design.
3. Little Home as the emotional anchor and the campaign's visible record of change.
4. Color plus suit as separate gameplay identities. Preserve that readable grammar when improving the art.
5. Player-paced, skippable cinematics and replay access.
6. The eight regional palettes and the Atlas journey. They provide useful variety; refine their execution rather than replacing the campaign structure.
7. The existing responsive move/capture feedback and chapter music hooks. They provide a base for a stronger coordinated presentation.
8. The ending's core message: ordinary life continues because communities keep adapting together.

## Highest-priority findings

Priority meanings: **P1** means a major obstacle to clarity or polish to address first; **P2** means a significant quality improvement; **P3** means refinement after the core presentation works. Effort is relative, not a schedule estimate.

| ID | Priority | Finding and evidence | Recommended action | Effort |
|---|---|---|---|---|
| V01 | P1 | Dense wood, plaid, spiral, diagonal, faceted and glowing treatments appear on nearly every floor cell. Dense late boards have the most visual noise precisely when route reading is hardest. | Use a low-contrast matte floor, consistent cell edges, and a quiet frame. Reserve saturation, symbols, strong shadows and glow for interactive objects and state changes. Move regional motifs to the rim and scenery. | Medium |
| V02 | P1 | The fixed compact story rail fits title, portrait, name, quote, question, movement, progress and Read all into about 90px. CSS sets several labels at roughly 6.7–8.3px and the quote around 9.8px on phones. | Display one short readable line at a time, ideally 14–16px for essential story copy. Put the full thread behind a large story entry. Use a 12px minimum for useful secondary information as a design target, not an assertion of compliance. | Medium |
| V03 | P1 | The later cinematics put several speaker bubbles in the scenic area while the lower panel often contains little or no text and substantial blank space. | Use a shared cinema layout with a larger scenic stage and a chronological one-speaker dialogue dock. Retain the opening's recent protection of the artwork. | Medium |
| N01 | P1 | `dialogueGroups()` collects lines by speaker. Across the Drift beat 2 renders Tansy's two lines together before Pip's reply. Old Maps beat 1 renders Bramble's setup and punchline together before Pippa's response. | Render the original ordered line array. Give each utterance its own step or ordered row. Never regroup the script for layout. | Small–medium |
| N02 | P1 | At fresh progress, Story & Residents already says the route system has grown rigid and promises rebuilding a living network. That answers much of the mystery before the investigation. Later rails recycle revelation-bearing lines. | Make all catch-up surfaces depend on earned knowledge. Maintain explicit facts known after each milestone. Separate the author's premise from the player's current briefing. | Medium |
| U01 | P1 | The visible Settings gear opens Story & Residents. Music/SFX toggles are associated with the separate Settings modal. Verified through the actual home button. | Make the gear open real settings; give Story & Residents its own book entry. Include music, SFX, motion, readability, and controls there. Ensure the toggles are available from pause too. | Small–medium |
| U02 | P1 | Atlas chapter buttons measure about 13 × 13px for inactive dots. Read all measures about 43 × 20px; game top controls were 36 × 36px in the first phone sample. | Increase effective non-overlapping tap areas. Use approximately 44–48px targets as a design goal; verify actual hit testing, not just visual icon size. | Small–medium |
| U03 | P1 | At 320 × 568, the control region extends to y=612. At 768 × 844, it extends to y=903. A full-page screenshot can conceal this problem by simply becoming taller. | Budget header, story, board, controls and safe area together. Use a shorter control arrangement on short screens and a deliberate tablet layout. Validate actual viewport screenshots and reachable controls. | Medium |
| N03 | P1 | Daily opens a later campaign level from fresh progress, with that level's story rail. Its shared `winLevel()` updates campaign unlocks without a Daily mode distinction. | Create an explicit Daily mode with independent completion/progress, neutral or spoiler-safe story, and a return path. Static code indicates progression leakage; the audit did not solve Daily to prove it end-to-end. | Medium |
| U04 | P1 | The story rail replaces `mechanicNote`, discarding the chapter's contextual mechanic guidance. Rules then rely partly on A, S and I/O shorthand. | Preserve mechanic introductions in a small playable demonstration; use the actual mechanic art in the rules. Keep story text and teaching logic from overwriting each other. | Medium |

## Screen-by-screen recommendations

### Little Home and first impression

**V04 — P2: unify material quality.** The title's island has a strong miniature silhouette, but granular soil/grass, flat roof planes, a low-poly tree, and glossy faces have different surface treatments. Establish one light direction, a restrained material library, and consistent shadow softness. Reduce conspicuous photographic-looking texture frequency; give the cottage readable roof thickness, a porch, a door recess, and a warmly lit window. Keep the existing single-cottage geometry.

**V05 — P2: create purposeful domestic motion.** Preserve the existing infrequent adult movement, which already avoids constant wandering. Add tiny authored actions at destinations: inspect a leaf, place a parcel, turn toward a child, glance at a late arrival. Two or three unmistakable actions are more expressive than constant bouncing. The two children can carry more of the comic energy.

**V06 — P2: make campaign progress discoverable.** The mailbox, pennant, anchor, bunting, telescope, compass, dock and route lights already have a story purpose. On first return after a chapter, briefly frame the new object and show a resident using it. Subsequently, let tapping it open a brief memory. Avoid an inventory of unlabeled tiny trophies.

**U05 — P2: clarify Play.** For returning users, show the current chapter and next route on the primary action. Keep Daily and Atlas secondary. Show the star total's meaning if it is intended as a motivation; do not make it resemble an unexplained currency.

### Gameplay and interaction feedback

**V07 — P1: preserve a consistent depth hierarchy.** Floor is flat and quiet; obstacles have weight; gates have a doorway silhouette; nests look recessed; Latchlings sit above the floor. Existing decorative floor rings can resemble mechanics. Decorative directional lines are especially inappropriate in a game with rails and turners.

**V08 — P2: improve selection without permanent noise.** Keep a high-contrast selection ring. Add a brief selection settle, matching destination emphasis, and an optional direction/trajectory preview when the user asks for help. Do not pulse the whole board throughout play.

**V09 — P2: make matching destinations more legible.** Use a recognizable socket or nest, a large suit mark, and a stable color rim. Show a short arrival response and keep the completed destination visually resolved. Preserve both identity dimensions; do not simplify to color alone.

**V10 — P2: make mechanic state changes explicit.** A switch should visibly connect to its affected doors; a door's open/closed silhouette should change. Rail entry direction and turn direction should be readable independently of texture. A rejected move can briefly identify the relevant blocker rather than only shaking the character. Test readability in grayscale and color-vision simulations.

**U06 — P2: reduce control dominance.** The D-pad is a substantial visual object and height expense. Keep it as a useful accessible input method, but explore a compact arrangement and optional swipe controls. Larger cells need not mean smaller touch controls: reclaim excessive margins and simplify the story rail first. Undo is a worthwhile separate design experiment, but introducing it changes difficulty and star economics and is not just a visual patch.

**V11 — P2: give the completion loop emotional causality.** The existing movement animation, trail, squash and capture are useful. Coordinate them into one legible sequence: departure, stop, destination acknowledgement, then ordinary-world payoff. A parcel arriving or a window lighting tells the player what the puzzle accomplished. Keep normal wins fast; reserve larger celebrations for milestones.

**U07 — P1: turn hints into readable help.** Current hints are a paragraph about a verified shortest solution from the starting position. Highlight the piece and direction on the board. If the hint is valid only after reset, say so before resetting and explain plainly. Longer term, compute hints from the current state. Never present a stale initial-state hint as a guaranteed next move.

**U08 — P2: improve failure tone.** Replace “This board is solver-verified” with a useful, kind response: “Let's try another route.” Show Retry as the primary action and a clear optional hint. Do not imply the player failed an implementation test.

**U09 — P2: explain mastery positively.** Replace “Verified shortest solution” with something like “Perfect route: 8 moves,” while accurately handling pluralization. The observed Level 1 win says “1 moves.” Give star criteria discoverability before a player is judged by them.

### Skyway Atlas

**V12 — P2: use meaningful landmarks.** The curving island path is a good framework. Give each ten-level destination a recognizable place or story object: porch, anchor station, market arch, observatory, map room, relay tower. Repeated miniature islands with tiny numbers do not carry enough authored identity.

**V13 — P2: simplify navigation hierarchy.** The title, large chapter card, dot navigation, five compressed range labels, route heading, map and Continue compete. Keep one chapter heading, one compact route-range control, and a dominant map. Replace truncated labels with a selected range's full name and accessible navigation.

**V14 — P2: distinguish restored from merely available.** Show inactive, available, current, mastered and restored states through shape, lighting and route connection—not solely small star pips. Fog can conceal future places, but should preserve the next destination's legibility. The early map's cloud cover makes later level numbers hard to read.

**V15 — P2: make world repair visible.** Animate a connection across the map after a milestone and briefly show the affected landmark working. The current Atlas transition work should be retained where it feels good. Test the real time-to-next-puzzle before adding more ceremony.

### Story cards, journal and navigation

**N04 — P1: remove duplicated information layers.** A route can currently have a quote, question, movement label, expanded rail, full Story card, current chapter briefing and journey summary. Give them clear jobs: during play = immediate motive; movement opening = new clue; milestone = result; journal = earned recap. A player should not need to navigate three layers to finish a sentence.

**V16 — P2: turn Story cards into actual postcards.** Use an authored crop of the place or prop involved. The current header illustrations are much flatter than Little Home and often function as generic decoration. Pair one image with one concise character line and one goal; keep longer context optional.

**U10 — P2: restructure Story & Residents.** The early screen is already long, and the replay library appears after briefing, role explanation, all five biographies, current chapter and journey. Put a concise “Now” summary first; expose Residents, Journey and Cinematics as separate accessible sections. Give unlocked films thumbnails and progress labels; keep the replay area easy to reach.

**N05 — P2: characterize through behavior.** Resident cards explain personality in prose. Illustrate it: Pippa straightens a route marker, Bramble attempts a shortcut, Rowan measures drift, Pip finds an overlooked clue, Tansy notices a missed visit. Let expressions change with the line. Do not permanently lock Rowan to happy or Tansy to surprised in emotional scenes.

### Victory, rewards and ending

**V17 — P1: show the chapter reward.** The Level 50 result explains the mailbox in a dense inset text block and repeats the next-region label. Show the mailbox arriving or being installed. Use one result sentence, the new keepsake, and clear “Visit Little Home” / “Continue” choices. Keep the star result visible and secondary.

**V18 — P1: bring the ending up to the title's art quality.** The actual final screen contains the correct five residents and thematic text, but its cottage/island are visibly simpler and flatter than the title. Reuse the canonical Little Home scene and show the completed network around it. Return the residents to ordinary actions; make the final visiting/delivery route visibly work.

**N06 — P2: let the final picture carry the thesis.** “No master switch / No final map / A living Skyway” explains the ending but reads like an essay summary. Keep that in the journal if needed. The emotional ending should be a successful familiar morning in a still-moving world, followed by “Skyway Restored” and the existing ordinary-life line. Make Return to Little Home the natural final action; Level Select can remain secondary.

### Audio, motion, accessibility and production consistency

**V19 — P2: unify the presentation system.** `index.html` loads many cumulative styles, including base, polish, refine, refine2, dialogue and geometry cinematic layers. The cast is defined in multiple runtime files. Consolidate after approving one design slice: one source for cast identity, a shared scene renderer, explicit dialogue state, design tokens and a small component vocabulary. Do not add another broad override file for every fix.

**U11 — P1: distinguish zoom, type size and fit.** The viewport disables user scaling. Offer usable text sizing and support platform accessibility preferences. Test actual phone viewport containment, safe areas, focus visibility, dialog focus containment, and reading order. `aria-hidden` art needs a meaningful equivalent where the art communicates the key plot point.

**V20 — P2: give motion a purpose.** Keep ambient drift slow and low contrast; use fast responsive input feedback; reserve camera moves for new evidence or a location reveal. Stop inactive offscreen animation. Source-level reduced-motion styling does not by itself prove all JavaScript animations obey the preference.

**A01 — P2: provide accessible sound controls and cinematic cues.** The music/SFX architecture already exists. Once settings are reachable, test separate levels, mute persistence and interruption recovery. Add restrained sound punctuation for the missed basket, distant porch, opening map drawer, dated-map reveal and distributed signals. Duck music during important dialogue if voice or speech-like effects are introduced. Audio quality was not auditioned in this audit.

**P01 — P2: profile the accepted scene, not speculative rewrites.** Before expanding effects, measure frame pacing, memory and loading on a modest phone. Texture layers, nested title iframes, repeated scenes and always-observing mutation logic are concrete candidates to examine. No performance failure was measured here. A new engine or full 3D conversion is not required to make this design direction work.

## Eight regional art directions

Use one playable-object grammar across all chapters. Regional variation belongs mainly in material hue, board border, lighting and surrounding landmarks. All five phase treatments per region were visually inspected.

| Region | Current weakness | Proposed treatment | Story made visible |
|---|---|---|---|
| Sunpetal Meadows | Floor becomes plaid, diagonal, spiral, framing and faceted patterns; later levels feel busier without adding meaning. | Quiet pale moss or warm stone floor; grass and flower clusters outside the grid; gentle morning light. | A basket, watering line, and mailbox move from missed to reliable. |
| Lanternwood Grove | Dark wood grain and repeated bright lines compete with rocks and pieces. | Desaturated timber cells; deeper forest silhouette; warm lanterns at destinations. | A recognizable neighbor's porch becomes reachable and later pays off in Tansy's scene. |
| Lodestone Caverns | Crystalline floor is almost as loud as the mechanic art. | Matte slate board; crystals in the frame/cavern; anchors as the brightest purposeful metal objects. | Anchors engage briefly while islands continue drifting. |
| Masquerade Keep | Purple tile repetition dominates the public-market identity. | Stone/ceramic routes, consistent brass suit gates, awnings and market silhouettes at the perimeter. | A cart reaches the correct stall; crowds/lanes resume after repair. |
| Prism Gardens | Rainbow floor competes directly with color-gate identity. | Neutral pale glass or limestone cells; refraction at the edges; saturated color reserved for gates and Latchlings. | The familiar porch is farther away; a new connection preserves a visit. |
| Copperline Junction | Copper lines, rivets and decoration can visually compete with rails and turners. | Muted copper/wood foundation; bold continuous rail language; paper records and station details beyond the playfield. | Dated maps match different island positions; an unfamiliar new route is approved. |
| Stormswitch Foundry | Dense cool grid and bright highlights obscure state hierarchy. | Dark neutral metal; switches and their linked doors get coherent active-state colors and line pulses. | A remote community signal visibly changes a local travel window. |
| Aurora Crown | Another dense cool patterned grid with broad background beams; climax has more decoration than distinct meaning. | Quiet midnight-blue floor; aurora above the board; a restrained constellation of regional accents and route lights. | Other regions visibly maintain connections while the final puzzle is solved. |

## Story architecture

### Make discoveries distinct

The current story repeatedly states versions of “the map must change” across early rails, movement questions, chapter results and late films. Repetition is useful for returning players, but it weakens a reveal when all layers treat it as new.

Use a clear progression of knowledge:

1. **Sunpetal:** today's routes miss; local observations explain where to try next.
2. **Lanternwood:** a route depends on other people as well as geometry.
3. **Lodestone:** stability means dependable stops during movement, not freezing the world.
4. **Masquerade:** a local solution must coordinate with wider civic infrastructure.
5. **Prism:** isolation threatens a specific relationship; copying the old map cannot solve it.
6. **Copperline:** historical evidence proves continuous revision was the original practice, and explains how that practice was lost.
7. **Stormswitch:** communities demonstrate the new practice together.
8. **Aurora:** the network continues without a single savior; ordinary visits work again.

This preserves the canon while giving each region a different dramatic job. Do not hide the basic rules simply to manufacture mystery. Hide future conclusions until they are earned.

### Fix repetition and continuity in actual content

- Beyond the bespoke first 20 levels, the rail selects from ten local lines per chapter using `(local - 1) % 10`. That visibly repeats every ten levels. For instance, the same telescope-going-home sentence appears at Levels 210, 220, 230, 240 and 250. The movement question changes, but the character performance does not.
- Build a 40-movement content table with separate setup, observation and result lines. Use the current ten recurring errand ideas as motifs whose situation evolves, rather than repeating their exact dialogue five times.
- Across the Drift ends with a route that never existed on the old map. Old Maps later says a never-before-existing route is built “for the first time.” Change the latter to the first deliberate application of the recovered Waykeeping method, or remove “for the first time.”
- The opening's recent dock is correct to protect artwork. The cinematic script still describes on-scene speech bubbles as the general rule. Update the durable design contract when adopting the common layout.
- Tansy's Lanternwood friend should have a recognizable name, porch silhouette, or object introduced in Chapter 2, so the telescope scene pays off a relationship rather than a generic distant house.
- Preserve the local-helper explanation, but deliver it through the board-to-world transition instead of repeated disclaimers that the pieces are not the named cast.

### Reshape pacing around play

The opening currently asks eight beats to establish geography, five people, failed routines, infrastructure, the player role, volunteer labor, controls and the starting goal, followed by the Level 1 Story card. That is a substantial reading gate before a tiny first puzzle.

Keep all necessary information but distribute it: show the failed breakfast delivery and call; let the player complete a very short guided route; introduce the remaining residents through the next few practical problems. Give returning players a one-tap resume and a concise recap. Keep the long introduction replayable.

The major films occur before Levels 1, 251, 301 and 351. There is a long cinematic gap before the first late film. Add modest visual chapter arrivals/payoffs at the intervening chapter boundaries rather than more mandatory exposition films. Decide whether each existing late cinematic is a recap of earned events or the discovery itself, and make the script's timing consistent with that choice.

The full beat-by-beat direction follows.

## All 25 cinematic beats

All rows refer to the current runtime, not a proposed replacement screenplay. “Improve” describes the next version; it is not a claim that those actions already exist.

### Film 1 — The Skyway, before Level 1

The opening has the clearest dialogue layout because its recent dock preserves the scenic stage. Its larger weaknesses are too much introductory reading, little visual change between some beats, and generic diagram assets doing the work of directed scenes.

| Beat | Current assessment | Graphical and narrative improvement |
|---|---|---|
| 1. The Latchlands Move | Five small islands and thin route lines establish the idea, but do not make ordinary life visible. | Begin on a small delivery crossing successfully, then pull back to drifting islands. Keep one distinctive house and one moving route endpoint in view so drift and successful adaptation are understood without a paragraph. |
| 2. Meet Little Home | The canonical title scene gives place identity. The five-person key is useful, but a roster plus long narration asks the player to memorize everyone at once. | Use a gentle camera move through three adult chores and two children investigating the basket. Show each name beside the relevant action. Keep full introductions available in the journal and reduce the forced narration. |
| 3. The Same Miss | The same household scene and basket route accompany dialogue about several different failed routines. The common offset is much clearer in words than in the image. | Show two or three short matching misses: basket misses the porch, water misses the bed, mail misses its marker. Use the same small displacement, then let a resident notice the pattern. Avoid dangerous falls or catastrophe; this is still a cozy morning. |
| 4. What the Skyway Does | Reuses the archipelago with small moving cargo symbols. It can feel like a second definition immediately after the first. | Show a short working connection elsewhere: an ordinary visit or delivery succeeds while its island moves. Let the route flex with the destination. Merge with beat 1 if playtesting says the opening is too long. |
| 5. A Waykeeper Answers | A large compass appears over the island diagram. The narration says “You answer,” but the player's act of answering is not dramatized. | Light a signal at Little Home, carry it across the gap, and have the player's compass respond. A simple “Answer the call” interaction can transition into a route view. Preserve the player's unfixed identity. |
| 6. Everyone Knows a Piece | “STORY → ROUTE CREW” is a diagram about the game's presentation architecture. | Show a local crew gather and take useful positions while Pippa hands over observations. Dissolve that same arrangement into the puzzle model. Use Bramble's existing line as the connective tissue. |
| 7. How You See a Route | Two schematic tracks illustrate stops, with substantial written instruction. | Make this a guided playable demonstration using actual production piece, rock, and nest art. First select, then slide, then land. Show how a helper stops another only when that rule becomes relevant. Essential teaching must survive skipping the film. |
| 8. Start With Sunpetal | Returns to the morning scene and a three-resident exchange. The humor is warm, but the same visual has already carried an earlier beat. | Frame the exact undelivered basket from the opening, then transition it into the first board objective. Preserve “First we make breakfast possible again.” The successful puzzle should visibly finish that delivery. |

### Film 2 — Across the Drift, after Level 250

This is the strongest emotional opportunity. The current familiar porch and telescope are good narrative choices, but the stage remains a small schematic landscape, and the grouped dialogue damages the exchange. The film should feel like a personal realization followed by a wider view.

| Beat | Current assessment | Graphical and narrative improvement |
|---|---|---|
| 1. The View From Prism Gardens | Familiar small islands plus colored beams suggest Prism but do not create a dramatic new viewpoint. | Rise past foreground crystal/garden forms into a wide horizon of island groups. Give near, middle and far layers distinct values and motion. Include old route markers visibly separated from the present positions. |
| 2. A Familiar Porch | The porch, telescope and Tansy are present, but multiple portraits/bubbles crowd the lower stage. Tansy's two lines are grouped together before Pip's response. | Use an intimate telescope-over-shoulder composition with a warm recognizable porch as the focal point. Play Tansy → Pip → Tansy in sequence. Hold briefly on her final wish to keep visiting; let expression and silence carry the stakes. |
| 3. Not One Bad Route | Dashed ghost lines explain misalignment, but their endpoints are not strongly tied to the particular islands in the frame. | Keep the islands still relative to the camera while overlaying their dated coordinates. Make three endpoint misses clear and consistent, then widen to the region. The player's attention should go directly to the gap. |
| 4. Yesterday's Map | Side-by-side OLD MAP/NOW cards show the concept as an infographic. | Animate one translucent old chart over the same current landscape. Align one region; reveal the other region slipping out. The single frame makes the impossibility unmistakable. Keep dialogue off that comparison. |
| 5. New Coordinates | Returns to the same island arrangement with a NEW COORDINATES badge and route. | Draw a new connection that reaches the actual porch; show a small delivery or light acknowledgement crossing it. If this is a recap after Level 250, frame it as remembering what the player achieved rather than claiming another discovery happened in the film. |

### Film 3 — Old Maps, New Routes, after Level 300

The premise of contradictory approved maps is excellent. The current maps are very simple sheets with a few lines and small year labels, so the essential evidence is hard to appreciate on a phone. The film needs a focused visual argument and corrected dialogue order.

| Beat | Current assessment | Graphical and narrative improvement |
|---|---|---|
| 1. The Contradictory Drawer | The drawer exists, but grouped Bramble lines spoil the setup–response–punchline order; there is also a separate scenic Bramble in addition to dialogue portrait representation. | Open a dusty drawer in a clearly Copperline environment. Show Bramble retrieve the papers. Deliver Bramble → Pippa → Bramble in order, with a reaction pause. Avoid a second floating body that looks like another character. |
| 2. Look at the Dates | Three small sheets show YEAR 12, YEAR 31, YEAR 58, but the dates and corresponding routes are minor marks. | Show the same recognizable island landmark on each sheet and enlarge the dates/stamps. Highlight one approved date at a time as Rowan speaks. Use persistent visual landmarks to make comparison effortless. |
| 3. They Were All Correct | Sheet sequencing is the right mechanism, but sparse diagrams do not strongly connect positions to useful routes. | Keep the island locations changing over time while each period's route fits its own positions. The dates advance; the endpoint visibly meets the destination each time. End with all approved stamps visible. |
| 4. What Was Forgotten | A small map stack sits beside a machine graphic. Narration/dialogue carry most of the historical causal explanation. | Transform an actively tended map desk into an unattended automated desk. A calendar advances, the route line freezes, and the landscape keeps moving. Give the machine useful work, so automation itself is not accidentally cast as the villain. |
| 5. The Real Problem | Reuses islands with frozen lines. The text repeats a conclusion already available elsewhere. | Split the visual attention cleanly: calm living islands continue moving while the rigid route geometry no longer reaches them. Use one short line. Make this the explanation of the lost maintenance practice rather than another generic statement that drift is normal. |
| 6. Make a New One | Another compass/route drawing; “for the first time” contradicts the earlier new route at Prism. | Let the recovered method guide a new Copperline route. A real rail/turner landmark reconnects and a courier traverses it. Say “Now we know why it works,” or otherwise remove the conflicting first-time claim. Transition to community coordination. |

### Film 4 — Homeward, after Level 350

This should feel like people taking responsibility across a living world. The current node network is understandable but abstract; much of the sense of many communities comes from labels and text rather than human activity.

| Beat | Current assessment | Graphical and narrative improvement |
|---|---|---|
| 1. Signals From Everywhere | Labeled regional islands establish geography but feel like a repeated map diagram. | Begin with small familiar regional landmarks sending signals, then reveal their connected geography. Use visual objects already earned rather than introducing a new diagram language. |
| 2. Everyone Has a Part | Keepsake cards and several speech bubbles compete in the stage. The props are too small to express real tasks. | Cut between a meadow dispatch, a Lodestone anchor holding, and a Copperline route check. Keep Pippa, Rowan and Bramble's existing reports as voice/text accompaniment in order. Show what “ready” means. |
| 3. A Living Network | Returns to essentially the same regional network arrangement as beat 1. | Stage an observable dependency: one region detects drift, a neighbor adjusts, a third opens a travel window. Pass a pulse along that causal chain. A repaired trip verifies the network works. |
| 4. No Perfect Route | Several simple line options surround familiar islands. | Show two working routes at different moments. One closes gracefully as the other becomes useful. This demonstrates flexibility, which is more persuasive than announcing that no perfect route exists. |
| 5. Aurora Crown | The region is represented by another small network node and aurora effects. It lacks a distinct final-location reveal. | Give Crown a memorable silhouette: overlapping ancient route arcs, observatory terraces or layered bridges, illuminated by routes arriving from the regions. Keep the established no-master-switch idea. |
| 6. Homeward | Returns to Little Home with four portrait bubbles crowded in one line. Its residents are the emotional anchor, but small text and schematic staging dilute the final exchange. | Give “We keep watching / adjusting / visiting” to successive resident actions. Pull back to show Little Home as one home among many. Save the fully restored familiar morning for Level 400, so this scene prepares rather than replaces the ending. |

### Shared cinematic direction

- Use one readable speaker at a time, stable placement, and chronological utterances. A scene beat may contain several dialogue turns without requiring the art to reset.
- Give every beat one dominant image, one intended observation, and one reason to press Continue.
- Keep narration only where the picture or dialogue cannot communicate the fact. Do not display a title, subtitle, counter, narrator panel, several bubbles and labels at equal emphasis.
- Reserve large camera moves for entering a place or changing the player's understanding. Within a conversation, hold the environment and let faces, gaze and small props act.
- Use consistent geography and remembered props. The same porch, mailbox and dated map should be recognizable when they return.
- Provide Replay, Skip and a readable progress indication. Consider an accessible previous-line/history option for accidental advances.
- Ensure reduced motion still ends on an informative state. An endpoint cannot remain ambiguous because its revealing animation was disabled.
- Build explicit scene/timeline state rather than depending on DOM mutation repair to keep dialogue and art aligned.

## Design studies included with this audit

The inline study contains three selectable screens. It is a proposal, not a replacement game or an approved final art kit.

1. **Gameplay:** quiet sage floor, differentiated solid rocks, a recessed destination, readable character identity, one short story line and compact controls. It demonstrates hierarchy. Its illustrative board is not intended as a faithful reproduction of a particular production puzzle.
2. **Cutscene:** Tansy's porch moment with foreground/background depth, controlled dusk lighting, an unobstructed scene and chronological dialogue. Continue steps through the original three utterances. A fourth visual study shows a reconnected route; that image belongs to the later payoff, not an extra canonical line in the porch conversation.
3. **Chapter reward:** an illustrated mailbox postcard, a concise ordinary-life result, and an invitation to revisit Little Home. The numerical star state and copy are illustrative.

These are composition and interaction studies made with simple rendered shapes. Production artwork should retain the existing five-character identity and use the agreed shared miniature style. The comparison is about clarity, staging and information hierarchy, not a claim that the study's simplified cottage should replace the richer title scene.

## Recommended implementation order

### Pass 1: clarity and correctness

Fix dialogue ordering, Settings routing, Daily isolation, chronological story knowledge, duplicated revelation claims, and displaced mechanic teaching. Establish viewport containment and minimum readable text/tap targets. Remove player-facing solver jargon. This is the highest-value pass because art cannot compensate for confused reading order or unavailable settings.

Acceptance: a fresh player can find sound controls; the first scene's dialogue stays in script order; Daily cannot expose future plot or advance the campaign; full controls remain reachable on short screens; the essential quote and mechanic cue are readable without magnification.

### Pass 2: one production-quality visual slice

Approve one Sunpetal gameplay screen, one dense Aurora board, the familiar-porch scene, and a chapter reward together. These cover quiet and busy mechanics, a character moment, and a payoff. Use the existing characters with a shared lighting and surface treatment. Compare current/proposed views at actual phone size and in motion before rolling out.

Acceptance: floor decoration never resembles a rule; selected piece and matching nest are immediately identifiable; dense mechanics stay distinguishable; the porch scene's meaning can be described with the text hidden; the reward visibly shows what changed.

### Pass 3: campaign application

Apply the approved material system to all eight chapter families and all five movement variants. Replace repeated rail lines with evolving movement content. Improve Atlas landmarks and chapter arrival/payoff states. Connect each keepsake with a visible action at Little Home.

Acceptance: all 400 boards retain their exact rules and solution data; normal play remains fast; every region looks distinct without altering mechanic grammar; each ten-level movement has its own setup and result rather than a repeated generic errand.

### Pass 4: cinematic direction and ending

Restage all 25 beats around the shot notes above, using a shared renderer, consistent cast and chronological dialogue. Revise long introductory pacing through playtests. Bring the ending onto the canonical Little Home scene and show the ordinary-life resolution.

Acceptance: no text covers the critical visual evidence; names remain associated with the correct speaker; each scene works in reduced motion; the player can explain why the final network differs from the old one and why returning home matters.

### Pass 5: mobile finish

Test actual phones, iOS/Safari, tablet layout, safe areas, text scaling, touch accuracy, keyboard/focus, asset loading and audio. Profile performance before adding more effects. Clean up accumulated style overrides and outdated script documentation after the chosen presentation is stable.

## Validation checklist for the eventual implementation

- 320 × 568, 360 × 800, 390 × 844, 430 × 932 and tablet coverage, including landscape decisions.
- Actual viewport screenshots, not only full-page captures; detect each control's bounds even if overflow is hidden.
- All 40 material variants and densest mechanic combinations; 400-board geometry regression.
- Fresh onboarding, skipped opening, returning player, all four replayable films, and every dialogue turn.
- All 40 movement starts and results; earned-knowledge checks before/after every chapter boundary.
- Daily, replay and campaign progression tracked separately.
- Readable foreground contrast against every background and matching identification without color alone.
- Normal/reduced motion, keyboard access, focus restoration, screen-reader reading order, and text scaling.
- Sound toggles reachable, persistent and honored across title, gameplay, pause and cinematics.
- A real low-end-phone performance pass with frame time and memory measurements.

## Evidence and source map

Audit materials in this folder:

- `report.json`: initial screen capture text, visible-sized button geometry, cinematic definitions and error log.
- `coverage.json`: all 400 rendered board measurements and additional viewport checks.
- `flows.json`: actual home Settings routing, fresh Daily entry, solved Level 1 result and staged chapter-reward text.
- `shots/`: full-size captured production views. Later settled ending, ordinary win, and milestone-board captures supersede early transition or overlay captures. In particular, the original Level 201 entry capture contains its automatic Story card and is not a clean-board assertion.
- `opening-contact.jpg`, `across-contact.jpg`, `maps-contact.jpg`, `homeward-contact.jpg`: all cinematic beats.
- `chapter-1-contact.jpg` through `chapter-8-contact.jpg`: the five milestone material variations per chapter.
- `concept-game.png`, `concept-cinema.png`, `concept-reward.png`: rendered proposal views.

Primary source anchors:

- [Production entry and screen structure](https://github.com/maloysius-wq/latchlings/blob/a5048dd25804fdd261639e5a22332a0cfd506682/index.html)
- [Cinematic scripts, visual factories and triggers](https://github.com/maloysius-wq/latchlings/blob/a5048dd25804fdd261639e5a22332a0cfd506682/cinematics400.js)
- [Dialogue grouping and opening dock](https://github.com/maloysius-wq/latchlings/blob/a5048dd25804fdd261639e5a22332a0cfd506682/cinematic-dialogue400.js)
- [Repeating story rail and replacement of mechanic note](https://github.com/maloysius-wq/latchlings/blob/a5048dd25804fdd261639e5a22332a0cfd506682/gameplay-story-rail400.js)
- [Story rail sizes and expansion styling](https://github.com/maloysius-wq/latchlings/blob/a5048dd25804fdd261639e5a22332a0cfd506682/style400-story-rail-board.css)
- [Movement arcs and player briefing](https://github.com/maloysius-wq/latchlings/blob/a5048dd25804fdd261639e5a22332a0cfd506682/story-grounding400.js)
- [Win, hint, failure, settings, Daily and navigation logic](https://github.com/maloysius-wq/latchlings/blob/a5048dd25804fdd261639e5a22332a0cfd506682/game400-b.js)
- [Board material variations](https://github.com/maloysius-wq/latchlings/blob/a5048dd25804fdd261639e5a22332a0cfd506682/style400-board-surfaces.css)
- [Canonical title scene](https://github.com/maloysius-wq/latchlings/blob/a5048dd25804fdd261639e5a22332a0cfd506682/title-island-concepts/index.html)
- [Story bible](https://github.com/maloysius-wq/latchlings/blob/a5048dd25804fdd261639e5a22332a0cfd506682/STORY_BIBLE.md)

The most useful next implementation unit is the clarity pass followed by a small approved visual slice. Approving a shared visual language before applying it everywhere will prevent another cycle of isolated surface fixes.
