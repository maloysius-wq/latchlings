# Latchlings Cinematics Script

Last updated: 2026-09-05

This file is the durable source of truth for the campaign cinematics in the 400-level production game.

The cinematics are not a replacement for Story Cards. Story Cards carry the small, frequent route stories. Cinematics are reserved for the few moments where the player needs a new mental model of the world or of the campaign itself.

All writing here must remain consistent with `STORY_BIBLE.md` and `story400.js` plus the production story-grounding layer.

## Runtime rules

- Cinematics are animated but player-paced. Each beat settles into motion and waits for the player to continue.
- Every cinematic can be skipped.
- The opening is shown once before the normal Level 1 Story Card.
- Major campaign cinematics are shown once before Levels 251, 301, and 351, but only when normal campaign progress has actually unlocked those levels. A Daily-style direct jump must never reveal them early.
- Seen cinematics are replayable from **Story & Residents** once their campaign point is unlocked.
- Reset Progress clears cinematic seen state.
- Reduced-motion mode keeps every visual and line of dialogue but removes nonessential motion.
- Routine chapter mechanics are still introduced by their chapters. The opening explains the *meaning* of the puzzle board and its universal interaction language, not every later tile type.
- **Narration and character dialogue use different visual channels.** Narration belongs only in the lower copy panel and carries no visible `Narrator` label. Spoken character lines appear in speech bubbles attached to named character portraits on the scene itself.
- The first introduction of the recurring household must visibly pair all five residents with their face, name, and short role so the player is never expected to infer which Latchling a name belongs to.

---

# Cinematic 1: The Skyway

**Trigger:** Before Level 1, before the ordinary Level 1 Story Card.  
**Replay unlock:** Always available.  
**Story job:** Establish the Latchlands, normal drift, Little Home’s five residents and the different evidence each notices, several matching route failures, why Little Home sends a Waykeeper call, why the player answers as the Waykeeper, cooperative helper crews, the universal board language, and the initial Sunpetal investigation. **Do not reveal the stale-map diagnosis as solved fact here; Levels 1–20 earn that conclusion.**

## Beat 1 — The Latchlands Move

**Visual:** A wide field of small floating islands drifts at different speeds beneath soft clouds. Faint route lights flex between them.

**Narration:** The Latchlands are always moving. Drift is normal, which means yesterday’s path is never quite today’s.

**Player takeaway:** Movement is not the villain and the Waykeeper is not trying to stop it.

## Beat 2 — Meet Little Home

**Visual:** Little Home comes forward. All five residents are visibly paired with face, name, and role: Pippa — Organizer, Bramble — Courier, Rowan — Caretaker, Pip — Explorer, Tansy — Collector.

**Narration:** Pippa tracks routines, Bramble knows inter-household routes, Rowan watches the island, Pip finds overlooked clues, and Tansy notices who a broken path leaves waiting.

**Tansy:** “It was one basket.”  
**Pip:** “It was an expedition basket.”

**Player takeaway:** These five recur because their ordinary lives produce different evidence, not because they are chosen heroes.

## Beat 3 — The Same Miss

**Visual:** Little Home’s morning route fails in several ways: watering, bread, and another routine route miss similar stops.

**Narration:** Different chores and travelers are failing in suspiciously similar ways.

**Pippa:** “My watering stop moved a whole garden bed.”  
**Bramble:** “Bread from East Sunpetal missed us by nearly the same amount.”  
**Rowan:** “Little Home is healthy. It just drifted farther than those routes expected.”

**Player takeaway:** There is a pattern worth investigating, but its cause is not yet known.

## Beat 4 — What the Skyway Does

**Visual:** Route lights link homes, gardens, markets, and neighbors while islands continue drifting.

**Narration:** The Skyway exists to keep ordinary life connected while the world moves. A good route works with drift rather than freezing it.

## Beat 5 — A Waykeeper Answers

**Visual:** An old Waykeeper signal/compass motif lights above Little Home and new route lines sketch around present positions.

**Narration:** Little Home sends an old Waykeeper call. **You answer it.** The household brings observations from lived-in routes; the Waykeeper brings specialized route-reading skill and can connect those clues across the network.

**Pippa:** “We’ll show you what changed in the day-to-day routes.”  
**Rowan:** “You help us find out whether those changes belong to one larger pattern.”

**Player takeaway:** This explicitly answers why the player is here without assigning the Waykeeper a fixed biography.

## Beat 6 — Everyone Knows a Piece

**Visual:** Local helper crews gather around a route board.

**Narration:** Every island knows its own paths and hardware. Volunteers test stops and travel windows; Little Home coordinates reports; the Waykeeper connects the route logic.

**Bramble:** “Everybody knows a piece of the route. We just need to put the pieces together.”

## Beat 7 — How You See a Route

**Visual:** Demonstrate select → direction → continuous snap → deliberate stopper → matching nest.

**Narration:** A board is the Waykeeper’s route model. Edges, rocks, helpers, and later Skyway hardware create stopping points. One move can set up the next.

**Rowan:** “Guide each helper into the nest that matches them. When every helper arrives safely, that route is working.”

## Beat 8 — Start With Sunpetal

**Visual:** Return to Little Home’s failed morning connection.

**Narration:** Restore Sunpetal’s morning routes, compare the failures as reports arrive, and determine whether this is one strange morning or something larger.

**Pippa:** “First we make breakfast possible again.”  
**Pip:** “Then we investigate breakfast.”  
**Tansy:** “In that order, please.”

**Final button:** **Begin Level 1**

---

# Cinematic 2: Across the Drift

**Trigger:** Before Level 251, after normal campaign progress completes Level 250.  
**Replay unlock:** Campaign progress has unlocked Level 251.  
**Story job:** Turn the larger drift from an inconvenience into a visible threat to connection, and establish that restoring the historical map exactly is impossible.

## Beat 1 — The View From Prism Gardens

**Visual:** The camera rises above Prism Gardens. Color routes glow below. Beyond them, clusters of islands sit visibly farther apart than the older translucent route map expects.

**Narration:**  
> From Prism Gardens, the Waykeeper can finally see farther than one route at a time.

## Beat 2 — A Familiar Porch

**Visual:** Tansy looks through Little Home’s new telescope. A tiny Lanternwood porch light appears at the edge of the view and slowly drifts farther from its old route marker. Tansy and Pip speak in bubbles attached to named portraits.

**Tansy:**  
> I can still see their porch.

**Pip:**  
> That sounded less reassuring than you meant it to.

**Tansy:**  
> I would like to keep being able to visit it.

## Beat 3 — Not One Bad Route

**Visual:** Rowan overlays current island positions against the historical Skyway. More and more route endpoints miss their islands.

**Rowan:**  
> This is not one route behaving badly. Look at all of them.

**Narration:**  
> The islands are doing what they have always done. The network is falling behind them.

## Beat 4 — Yesterday’s Map

**Visual:** Pippa aligns an old map over the present-day islands. It cannot fit. When one region lines up, another slips away.

**Pippa:**  
> If we put every marker back exactly where it used to be, the islands will still be somewhere new.

**Rowan:**  
> Then yesterday’s map cannot be the answer.

## Beat 5 — New Coordinates

**Visual:** The old lines fade. A new route sketches itself between the islands’ current positions and holds while they continue to drift.

**Bramble:**  
> Good. I was getting tired of chasing yesterday.

**Narration:**  
> Prism Gardens reconnects on a route that never existed on the old map. The next question is waiting at Copperline Junction: what did the first Waykeepers know that everyone else forgot?

**Final button:** **Continue to Copperline**

---

# Cinematic 3: Old Maps, New Routes

**Trigger:** Before Level 301, after normal campaign progress completes Level 300.  
**Replay unlock:** Campaign progress has unlocked Level 301.  
**Story job:** Deliver the campaign’s central revelation. The original Skyway was designed for constant revision. The crisis is not movement; it is a network that stopped changing with the people who use it.

## Beat 1 — The Contradictory Drawer

**Visual:** A Copperline map drawer opens. Several translucent route diagrams stack over one another. Their lines disagree dramatically.

**Bramble:**  
> I have found the instructions.

**Pippa:**  
> Wonderful.

**Bramble:**  
> They disagree with the other instructions.

## Beat 2 — Look at the Dates

**Visual:** Rowan slides the diagrams apart. Different dates glow on each map. Island positions shift from map to map while each set of route lines fits its own moment.

**Rowan:**  
> They do not disagree. Look at the dates.

**Pippa:**  
> Every one of these was approved.

## Beat 3 — They Were All Correct

**Visual:** The maps animate in chronological order. Islands drift; route lines are redrawn around them. A Waykeeper mark appears on each revision.

**Pippa:**  
> They were all correct.

**Narration:**  
> Old Waykeepers never protected one perfect map. They watched the drift and rewrote the routes again and again.

## Beat 4 — What Was Forgotten

**Visual:** Hand-drawn revisions gradually give way to a neat automated network. The islands continue moving, but the automated route lines stop changing.

**Rowan:**  
> The machines kept more of the work running by themselves.

**Bramble:**  
> And eventually everyone forgot the part where somebody still had to look out the window.

## Beat 5 — The Real Problem

**Visual:** The frozen network falls out of alignment. The islands remain calm and healthy beneath it.

**Narration:**  
> The islands are not broken. The drift is not the disaster. The Skyway stopped changing with them.

**Pippa:**  
> Then we do not restore the old map.

## Beat 6 — Make a New One

**Visual:** The Waykeeper compass turns. A completely new route draws across Copperline, bends through current positions, and lights successfully.

**Rowan:**  
> We make the route the Latchlands need now.

**Bramble:**  
> Finally. Instructions I can follow.

**Narration:**  
> For the first time, the Waykeeper deliberately builds a route that has never existed before.

**Final button:** **Build the Living Skyway**

---

# Cinematic 4: Homeward

**Trigger:** Before Level 351, after normal campaign progress completes Level 350.  
**Replay unlock:** Campaign progress has unlocked Level 351.  
**Story job:** Turn the final chapter from a solo rescue into a coordinated community effort and establish that Aurora Crown is not a master switch.

## Beat 1 — Signals From Everywhere

**Visual:** Little Home’s route board fills with small signals from Sunpetal Meadows, Lanternwood Grove, Lodestone Caverns, Masquerade Keep, Prism Gardens, Copperline Junction, and Stormswitch Foundry.

**Narration:**  
> By the time Stormswitch comes online, the Waykeeper is no longer working alone.

## Beat 2 — Everyone Has a Part

**Visual:** Regional icons light one after another: mailbox, pennant, anchor, bunting, telescope, compass, docking beam.

**Pippa:**  
> Meadows are ready.

**Rowan:**  
> Lodestone is holding alignment.

**Bramble:**  
> Copperline says the new route is ugly, functional, and therefore officially excellent.

## Beat 3 — A Living Network

**Visual:** Route lights pulse from region to region rather than from one central hub. One path changes and neighboring paths adjust around it.

**Narration:**  
> One community watches the drift. Another adjusts an anchor. Another changes a travel window. The Skyway begins responding faster than the islands can leave yesterday’s map behind.

## Beat 4 — No Perfect Route

**Visual:** Rowan studies several valid routes that change as the islands move. None is highlighted as the permanent answer.

**Rowan:**  
> There is no one perfect route to switch back on.

**Pippa:**  
> Good. We know what to do with perfect old routes now.

## Beat 5 — Aurora Crown

**Visual:** Aurora Crown appears in the distance where many old and new route lines overlap. No giant lever or central machine appears. Instead, lines arrive from every region.

**Narration:**  
> Aurora Crown is not a master switch. It is where the oldest surviving Skyway lines meet.

**Bramble:**  
> Excellent. Everyone brought tools anyway.

## Beat 6 — Homeward

**Visual:** Little Home becomes one glowing node among many. The five residents stand together while route lights pass outward in every direction. The islands keep gently drifting.

**Pippa:**  
> We keep watching.

**Rowan:**  
> We keep adjusting.

**Tansy:**  
> We keep visiting.

**Pip:**  
> Preferably by the interesting route.

**Narration:**  
> Home is not the place that never moves. It is the place you keep finding a way back to.

**Final button:** **Begin Homeward**

---

# Final campaign payoff

Level 400 already resolves the cinematic arc with the production **Skyway Restored** ending. Do not insert another mandatory film between Level 400 and that ending unless the story architecture changes later.

The meaning of **Skyway Restored** remains:

- the islands still drift;
- the Latchlands have relearned how to observe and communicate;
- Waykeeping is again a living community practice;
- routes change with the people who need them;
- ordinary life continues.