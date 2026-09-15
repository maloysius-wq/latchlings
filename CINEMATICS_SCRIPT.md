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

# Cinematic 1: The Morning the Routes Missed

**Trigger:** Before Level 1, before the ordinary Level 1 Story Card.  
**Replay unlock:** Always available.  
**Story job:** Establish the Latchlands, normal drift, Little Home’s five residents and the different evidence each notices, several matching route failures, why Little Home sends a Waykeeper call, why the player answers as the Waykeeper, cooperative helper crews, the universal board language, and the initial Sunpetal investigation. **Do not reveal the stale-map diagnosis as solved fact here; Levels 1–20 earn that conclusion.**

**Presentation rule:** This is one continuous, textured Little Home scene rather than a sequence of unrelated cards. The stage persists for all 21 player-paced lines. Earth, grass, and wood use the same material textures as the title island. Dialogue remains in a protected region below the art, and every drawn route terminates at its named visual destination.

## Scene 1 — A Moving World

**Visual:** Begin wide on several naturally drifting islands. Working Skyway lights visibly connect actual island anchors. Little Home is already present in the same world and eases forward without a scene cut.

**Narrator:** “In the Latchlands, the islands are always drifting—slowly, quietly, and exactly as they should.”  
**Narrator:** “The Skyway moves with them, carrying neighbors, parcels, and all the small things that make a day work.”

## Scene 2 — Morning at Little Home

**Visual:** Settle on the five residents doing familiar morning jobs. A breakfast basket follows a visible route from the neighboring bakery, then stops beside—rather than on—the porch.

**Narrator:** “And on a little island called Little Home, every morning began with its own familiar collection of very important jobs.”  
**Bramble:** “Breakfast incoming. Perfectly timed, as usual.”  
**Bramble:** “…That is not our porch.”

## Scene 3 — The Same Strange Miss

**Visual:** Pippa’s watering cart and Pip’s shortcut appear on the same continuous map. Their paths stop at explicit old-route markers offset from the garden and play rock. Rowan compares all three equal-looking misses against Little Home’s measured drift.

**Pippa:** “My watering line missed the garden too.”  
**Pip:** “Our shortcut missed the play rock.”  
**Tansy:** “A shortcut is supposed to reach something, Pip.”  
**Pip:** “It did yesterday.”  
**Rowan:** “Little Home drifted exactly as expected. But three different routes missed us by nearly the same distance.”  
**Narrator:** “One missed errand might have been bad luck. Three matching misses were a question.”

## Scene 4 — The Old Call

**Visual:** Pippa activates a physical Waykeeper call box on Little Home. Its gold signal follows a connected path to the player’s compass. After the player answers, a separate textured helper skiff arrives on its own route so the volunteers do not pile on top of the household.

**Pippa:** “We know our island. We know our routes. But something larger isn’t adding up.”  
**Pippa:** “Let’s send the old Waykeeper call.”  
**Narrator:** “Waykeepers once helped the Skyway adapt whenever familiar paths stopped fitting the world around them.”  
**Narrator:** “Little Home sent the call…”  
**Narrator:** “…and you answered.”

**Line 13 button:** **Send the Call**  
**Line 15 button:** **Answer**

## Scene 5 — See the Route

**Visual:** The shared scene yields to an exact miniature model of Level 1, framed in textured wood. The board introduces paths, participants, and stopping places without pretending the abstract board pieces are the named residents.

**Bramble:** “We’ll bring what we know. Our neighbors will bring what they know. You help us see how all the pieces fit together.”  
**Narrator:** “To a Waykeeper, every real route becomes a puzzle of paths, people, and stopping places.”  
**Rowan:** “Start with Sunpetal’s morning routes. Find out why they’re all missing in the same way.”  
**Pippa:** “And perhaps begin with breakfast.”  
**Pip:** “Finally, a properly organized investigation.”

**Final button:** **Help Little Home**

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

