# Latchlings Cinematics Script

Last updated: 2026-09-04

This file is the durable source of truth for the campaign cinematics in the 400-level production game.

The cinematics are not a replacement for Story Cards. Story Cards carry the small, frequent route stories. Cinematics are reserved for the few moments where the player needs a new mental model of the world or of the campaign itself.

All writing here must remain consistent with `STORY_BIBLE.md` and `story400.js`.

## Runtime rules

- Cinematics are animated but player-paced. Each beat settles into motion and waits for the player to continue.
- Every cinematic can be skipped.
- The opening is shown once before the normal Level 1 Story Card.
- Major campaign cinematics are shown once before Levels 251, 301, and 351, but only when normal campaign progress has actually unlocked those levels. A Daily-style direct jump must never reveal them early.
- Seen cinematics are replayable from **Story & Residents** once their campaign point is unlocked.
- Reset Progress clears cinematic seen state.
- Reduced-motion mode keeps every visual and line of dialogue but removes nonessential motion.
- Routine chapter mechanics are still introduced by their chapters. The opening explains the *meaning* of the puzzle board and its universal interaction language, not every later tile type.

---

# Cinematic 1: The Skyway

**Trigger:** Before Level 1, before the ordinary Level 1 Story Card.  
**Replay unlock:** Always available.  
**Story job:** Make the entire puzzle campaign legible before the first move. Establish the Latchlands, natural drift, Little Home, the Skyway, the Waykeeper, the helper crew, snapping/stopping, and nests.

## Beat 1 — The Latchlands Move

**Visual:** A wide field of small floating islands drifts at different speeds beneath soft clouds. Faint route lights stretch between several islands, flexing as the islands move.

**Narrator:**  
> The Latchlands are always moving. Not quickly. Not dangerously. Just enough that yesterday’s path is never quite today’s.

**Meaning:** Drift is normal. The player is not trying to stop it.

## Beat 2 — Little Home

**Visual:** Little Home comes forward. The cottage, garden, tree, and five residents settle into view: Pippa, Bramble, Rowan, Pip, and Tansy. Tiny ordinary-life props move around them.

**Narrator:**  
> This is Little Home. Pippa keeps the garden organized. Bramble carries half the errands on the island. Rowan watches the island itself. Pip and Tansy turn almost anything into an expedition.

**Tansy:**  
> It was one basket.

**Pip:**  
> It was an expedition basket.

**Meaning:** The story is about ordinary lives, not abstract puzzle pieces.

## Beat 3 — What the Skyway Does

**Visual:** Route lights brighten from Little Home to neighboring islands. A basket icon, parcel, and tiny visitor light travel along separate paths while the islands continue drifting.

**Narrator:**  
> For generations, the Skyway has kept homes, gardens, markets, and neighbors connected while the islands drift. A good route does not hold the world still. It keeps working while the world moves.

**Meaning:** The Skyway is infrastructure that adapts to movement.

## Beat 4 — You Are the Waykeeper

**Visual:** A Waykeeper compass motif appears over the moving islands. Old route lines fade, new lines sketch themselves between the islands’ current positions.

**Pippa:**  
> That is where you come in. You are the Waykeeper.

**Rowan:**  
> You do not tell the islands where to be. You watch where they are, then find a route that works now.

**Meaning:** The player’s role is route-tending and adaptation, not controlling the islands.

## Beat 5 — The Helper Crew

**Visual:** A miniature route board appears. Several spherical Latchlings hop into place. A small story portrait of one household resident remains outside the board while the helper crew stands inside it.

**Bramble:**  
> When somebody needs a route fixed, the whole island pitches in. The Latchlings on your board are the helper crew working that route with you.

**Narrator:**  
> The person in the story gives the route its reason. The Latchlings on the board are the crew helping make it possible.

**Meaning:** Named residents in Story Cards do not have to match the color or suit of board pieces.

## Beat 6 — Snap, Stop, Set Up

**Visual:** One helper is selected. A direction flashes. The helper snaps in a straight line and stops against a rock. The demonstration resets; a second helper is positioned as the stopper, and the first helper snaps into it. A matching nest glows nearby.

**Narrator:**  
> Choose a Latchling, then choose a direction. They snap along that route until something stops them. An edge, a rock, or another helper can turn one move into the setup for the next.

**Rowan:**  
> Guide each helper into the nest that matches them. A nest is a safe arrival point. When every helper is safely placed, the route is working.

**Meaning:** This is the universal board language: select, direction, continuous snap, deliberate stop, matching nest, solve everyone.

## Beat 7 — This Morning

**Visual:** The miniature board dissolves back into Little Home. A breakfast basket follows an old glowing route, misses its intended connection because the islands have shifted, and lands at an awkward stop. Rowan looks toward the horizon. Pippa looks at the route. Pip and Tansy look at breakfast.

**Pippa:**  
> That route worked yesterday.

**Rowan:**  
> Little Home moved farther than usual overnight.

**Pip:**  
> So breakfast is a puzzle now?

**Tansy:**  
> Breakfast is *urgently* a puzzle now.

**Narrator:**  
> Start small, Waykeeper. Fix the morning route. Then find out why the Skyway stopped keeping up.

**Final button:** **Begin Level 1**

---

# Cinematic 2: Across the Drift

**Trigger:** Before Level 251, after normal campaign progress completes Level 250.  
**Replay unlock:** Campaign progress has unlocked Level 251.  
**Story job:** Turn the larger drift from an inconvenience into a visible threat to connection, and establish that restoring the historical map exactly is impossible.

## Beat 1 — The View From Prism Gardens

**Visual:** The camera rises above Prism Gardens. Color routes glow below. Beyond them, clusters of islands sit visibly farther apart than the older translucent route map expects.

**Narrator:**  
> From Prism Gardens, the Waykeeper can finally see farther than one route at a time.

## Beat 2 — A Familiar Porch

**Visual:** Tansy looks through Little Home’s new telescope. A tiny Lanternwood porch light appears at the edge of the view and slowly drifts farther from its old route marker.

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

**Narrator:**  
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

**Narrator:**  
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

**Narrator:**  
> Old Waykeepers never protected one perfect map. They watched the drift and rewrote the routes again and again.

## Beat 4 — What Was Forgotten

**Visual:** Hand-drawn revisions gradually give way to a neat automated network. The islands continue moving, but the automated route lines stop changing.

**Rowan:**  
> The machines kept more of the work running by themselves.

**Bramble:**  
> And eventually everyone forgot the part where somebody still had to look out the window.

## Beat 5 — The Real Problem

**Visual:** The frozen network falls out of alignment. The islands remain calm and healthy beneath it.

**Narrator:**  
> The islands are not broken. The drift is not the disaster. The Skyway stopped changing with them.

**Pippa:**  
> Then we do not restore the old map.

## Beat 6 — Make a New One

**Visual:** The Waykeeper compass turns. A completely new route draws across Copperline, bends through current positions, and lights successfully.

**Rowan:**  
> We make the route the Latchlands need now.

**Bramble:**  
> Finally. Instructions I can follow.

**Narrator:**  
> For the first time, the Waykeeper deliberately builds a route that has never existed before.

**Final button:** **Build the Living Skyway**

---

# Cinematic 4: Homeward

**Trigger:** Before Level 351, after normal campaign progress completes Level 350.  
**Replay unlock:** Campaign progress has unlocked Level 351.  
**Story job:** Turn the final chapter from a solo rescue into a coordinated community effort and establish that Aurora Crown is not a master switch.

## Beat 1 — Signals From Everywhere

**Visual:** Little Home’s route board fills with small signals from Sunpetal Meadows, Lanternwood Grove, Lodestone Caverns, Masquerade Keep, Prism Gardens, Copperline Junction, and Stormswitch Foundry.

**Narrator:**  
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

**Narrator:**  
> One community watches the drift. Another adjusts an anchor. Another changes a travel window. The Skyway begins responding faster than the islands can leave yesterday’s map behind.

## Beat 4 — No Perfect Route

**Visual:** Rowan studies several valid routes that change as the islands move. None is highlighted as the permanent answer.

**Rowan:**  
> There is no one perfect route to switch back on.

**Pippa:**  
> Good. We know what to do with perfect old routes now.

## Beat 5 — Aurora Crown

**Visual:** Aurora Crown appears in the distance where many old and new route lines overlap. No giant lever or central machine appears. Instead, lines arrive from every region.

**Narrator:**  
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

**Narrator:**  
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
