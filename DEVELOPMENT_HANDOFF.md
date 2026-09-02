# Latchlings Development Handoff

Last updated: 2026-09-02

## Start here

This repository is the source of truth for **Latchlings**.

- Repository: `maloysius-wq/latchlings`
- Live build: `https://maloysius-wq.github.io/latchlings/`
- Runtime: intended 400-level themed campaign on `main`

Always inspect current `main`, `index.html`, and this handoff before changing anything.

### REPOSITORY ACCESS PRE-FLIGHT — HARD GATE

For **all repository work in this project**, the connected **GitHub plugin/connector is the canonical and first-line repository path**. This rule applies before any local/container/web attempt. If GitHub functions are not already loaded, the **first tool action for a repository task must be connector/plugin discovery for `GitHub`**. The first repository read must be `DEVELOPMENT_HANDOFF.md` through `GitHub.fetch_file` (or equivalent).

A failed local clone, missing checkout, container DNS failure, generic web failure, raw-GitHub failure, or absence of preloaded GitHub functions is **never evidence that GitHub access is unavailable**. An agent may claim GitHub is unavailable only after GitHub plugin discovery has explicitly been attempted **and** a real GitHub connector repository read cannot be invoked or fails. If the wrong route is attempted first, recover immediately through GitHub and continue the original request without asking the user to repeat the plugin instruction.

Read `AGENTS.md` and `.github/REPOSITORY_ACCESS_PREFLIGHT.md` for the durable preflight contract. The repository guard workflow validates that these instructions remain present.

## MANDATORY handoff workflow

For every substantive repository task, in every current or future chat:

1. Read this file and inspect the current repository.
2. Before implementation, add/update a `Current Work` entry with the date, user goal, implementation plan, expected files/systems, validation plan, deployment plan, and `IN PROGRESS` status.
3. Commit that handoff update before implementation begins.
4. If scope changes materially, update the handoff again while work is underway.
5. After implementation, update the same entry to `COMPLETED`, `PARTIAL`, or `BLOCKED` and record exactly what changed, important decisions, files changed, validation/test results, deployment status/commit, remaining bugs/risks, and exact next action if incomplete.
6. Commit the final handoff update after implementation/deployment commits.

If a chat is interrupted, the handoff must already contain enough detail to resume immediately. This file is a live project journal, not an end-of-chat summary.

---

## Current Work

### 2026-09-02 — Switch Little Home controls to striped rounded buttons

**Status: IN PROGRESS**

**User goal:** Replace the current cut-corner brass controls in selected Concept 2 / Little Home with the rounded striped button family the user actually intended from the earlier rendered gallery. Keep the striped concept but recolor it away from blue so it harmonizes with the Little Home title screen.

**Implementation plan:** Refine only Concept 2. Preserve the existing Play / Daily Puzzle / Level Select markup, hierarchy, and scene spacing. Remove the chamfered/cut-corner brass silhouette and brass rivet treatment. Restyle all three controls as rounded striped buttons with a custom Little Home palette: warm cream alternating with soft sage and muted moss/olive accents, plus a subtle tactile border, inset highlight, grounded shadow, and physical press state. Keep the two lower controls compact and coordinated. Concepts 1 and 3 remain unchanged. Production `index.html` remains untouched.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, `title-island-concepts/index.html`, plus temporary self-removing workflow/script files for transformation and Chromium validation. No new external assets or runtime dependencies.

**Validation plan:** Static checks must confirm Concept 2 no longer contains the cut-corner brass `clip-path` treatment, uses rounded striped controls with non-blue sage/cream/moss stripe colors, preserves all three control labels and markup, and preserves the current five-resident floating-island scene. Chromium at 390x844 must verify all controls remain inside the phone, do not overlap the island or each other, retain readable labels/icons, show rounded corners and striped backgrounds, have no horizontal overflow or console/page/request errors, and leave Concepts 1 and 3 on their prior non-striped control styles. Capture a screenshot for visual inspection.

**Deployment plan:** Commit this handoff entry before implementation, then commit the validated Concept 2 striped control refinement to `main`, deploy through GitHub Pages, inspect the rendered screenshot, and close this same entry with implementation SHA, validation/deployment details, and next action. Production title integration remains out of scope.

---

### 2026-09-02 — Apply Brass Toy Plates to Little Home controls

**Status: COMPLETED**

**User goal:** Replace the current generic hero-box style controls in selected Concept 2 / Little Home with the Brass Toy Plates direction chosen from the rendered button gallery. The result should feel bespoke, toy-like, intentional, and integrated with the floating-island world rather than like generic AI-generated app cards.

**Implementation plan:** Refine only Concept 2. Keep the current Play / Daily Puzzle / Level Select hierarchy and functionality, but restyle the controls as chamfered brass toy plates with layered metallic gradients, inset engraved borders, corner-rivet detailing, darker brass lower lips, and compact pressed-icon treatments. Reduce the two secondary controls from oversized white cards into tighter hardware-like plates so they read as a coordinated console/control cluster. Preserve all island, cloud, pebble, resident, tree, flower, stone, and floating motion work. Concepts 1 and 3 remain unchanged. Production `index.html` remains untouched.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, `title-island-concepts/index.html`, plus temporary self-removing transform/browser-validation workflow files. No new assets or external dependencies.

**Validation plan:** Static checks require Concept 2-only brass control selectors, chamfered/engraved/rivet treatment, preserved Play / Daily Puzzle / Level Select markup and labels, and unchanged global button styles for Concepts 1 and 3. Chromium at 390x844 must verify all three Concept 2 controls remain fully inside the phone, do not overlap each other or the floating island, retain readable text/icons and click targets, show no horizontal overflow/console/page/request errors, and preserve the current five-resident floating-island scene. Capture screenshots for visual inspection and sanity-check Concepts 1 and 3.

**Deployment plan:** Commit the validated Concept 2 control refinement to `main`, deploy through GitHub Pages, inspect the rendered screenshot, then close this handoff entry with implementation SHA, validation/deployment details, and next action. Production title integration remains out of scope.


#### Completion summary

**Implementation:** Restyled only selected Concept 2 / Little Home controls in `title-island-concepts/index.html`. The existing generic cream Play hero rectangle and two oversized white secondary cards now render as a coordinated Brass Toy Plates control cluster. Play uses a chamfered eight-corner metal plate silhouette, brushed horizontal brass grain, four inset rivets, engraved inner frame, darker lower mechanical lip, embossed text, and a pressed circular play-icon medallion. Daily Puzzle and Level Select use compact matching brass plates with their own slightly varied brass tones, four rivets each, engraved inset frames, compact typography, and pressed circular icon medallions. Hover/press states move the plates like physical controls instead of generic card hover effects. No control labels or markup/functionality changed.

**Design decision:** The brass treatment is intentionally limited to Concept 2 so the user can judge it against the existing Little Home composition. It was adapted to the real title page rather than the discarded standalone mock: the island, floating debris, clouds, residents, cottage, tree, flowers, and current spacing remain the actual source-of-truth scene. Concepts 1 and 3 keep their previous control styling.

**Files changed:** Permanent product implementation changed only `title-island-concepts/index.html`; this handoff was updated separately for project tracking. Temporary transformer/browser-validator/workflow files self-removed. Production `index.html`, campaign files, game runtime, textures, and other assets were untouched.

**Validation:** GitHub Actions run `33686091263` passed static and Chromium validation. At 390×844, Play rendered at 318×60 px; the two secondary plates rendered at 154.5×78 px each. All three controls remained fully inside the phone, Play did not overlap the secondary plates, and the moving island remained more than 16px clear of the Play control. Browser checks confirmed chamfered clip paths, multi-layer radial/repeating-linear brass backgrounds, 2px plate borders, engraved pseudo-element frames, readable labels, pressed icon medallions, the existing 5 residents / 6 floating pebbles / 4 clouds, no console/page/request errors, and no horizontal overflow. Concepts 1 and 3 were separately sanity-checked and retained their original non-brass control styles. Screenshot artifact `9868170479` was downloaded and visually inspected; the resulting controls read as deliberate toy-console hardware rather than generic hero/cards.

**Implementation commit:** `7b35e950c96052929aaa63594d92950b7794e7fe` (`Style Little Home controls as brass toy plates`).

**Deployment:** GitHub Pages run `33686161062` completed successfully for exact implementation commit `7b35e950c96052929aaa63594d92950b7794e7fe`. Live preview remains `https://maloysius-wq.github.io/latchlings/title-island-concepts/?c=2`.

**Remaining risk / next action:** This is a design-selection pass, not production integration. User should review the live brass controls in motion. The brass warmth, plate heights, secondary label wrapping, or rivet/engraving intensity can be tuned further if desired. Production title remains intentionally untouched pending explicit promotion.

---

### 2026-09-02 — Add Little Home island bob and floating earth pebbles

**Status: COMPLETED**

**User goal:** Confirm whether the selected Little Home clouds are animated, then make the floating-island read more clearly by giving the island itself a very subtle vertical bob and adding small brown pebbles around the lower dirt mass that float on the same overall cadence but at staggered phases.

**Current-state note:** Concept 2 already has four independently animated procedural clouds using `littleHomeCloudDrift` at 38s, 46s, 53s, and 42s. Their motion is intentionally subtle and will be preserved.

**Implementation plan:** Refine only selected Concept 2 / Little Home. Add a slow whole-island bob to `#c2 .island-model` while preserving its required horizontal centering transform. Counter the island shadow so it remains visually anchored below the island while changing slightly in scale/opacity with the float cycle. Add six small irregular earth-textured procedural pebbles around the outside of the lower brown `island-side`; give all pebbles the same base duration as the island but different negative delays, amplitudes, sizes, rotations, and positions so they rise/fall out of phase. Preserve all existing clouds, five-resident choreography, tree, cottage, flowers, stone, Play UI, and production runtime. Reduced-motion mode must disable the new bob/pebble motion.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, `title-island-concepts/index.html`, plus temporary self-removing transformer/browser-validation workflow files. No new external assets; existing local `textures/earth.jpg` may be reused for pebble material. Production `index.html`, campaigns, and game runtime must remain untouched.

**Validation plan:** Static checks require current cloud drift rules/durations to remain intact, a Concept 2-only island bob keyframe/rule, six floating-pebble elements and staggered shared-cadence animation rules, counter-motion/shadow treatment, and reduced-motion overrides. Chromium at 390x844 must sample multiple timestamps and prove the island vertical position changes slightly, the shadow remains approximately anchored, pebble positions change independently/out of phase, clouds still animate, no horizontal overflow or clipping occurs, no console/page/request errors appear, and all five residents remain present. Capture multiple timing screenshots and sanity-check Concepts 1 and 3 remain unaffected.

**Deployment plan:** Commit the validated preview refinement to `main`, let GitHub Pages deploy the exact implementation commit, visually inspect timing screenshots, then close this entry with implementation SHA, validation/deployment results, and next action. Production title integration remains out of scope.


#### Completion summary

**Cloud answer:** Yes. Concept 2 already had animated clouds before this task. The four procedural clouds still use independent `littleHomeCloudDrift` cycles of 38s, 46s, 53s, and 42s; those rules were preserved unchanged.

**Implementation:** Refined only selected Concept 2 / Little Home in `title-island-concepts/index.html`. Added a 7.6-second `littleHomeIslandFloat` cycle to the whole `.island-model`, preserving its horizontal centering while lifting the island only 5px at the top of the cycle for a gentle floating read. Added a matching `littleHomeShadowAnchor` counter-animation to the existing island shadow: as the island rises, the shadow translates downward relative to the moving island so it remains visually anchored while shrinking slightly and fading. Added six small irregular procedural `float-pebble` elements around the outside of the lower brown dirt mass. The pebbles reuse local `textures/earth.jpg`, all share the same 7.6-second cadence as the island, and use unique negative delays, sizes, rotations, positions, and lift amplitudes so they bob out of phase. Reduced-motion mode disables the new island/shadow/pebble animation. The five-resident household, tree, cottage, flowers, stone, children, adult rest scheduler, Play UI, and clouds remain intact.

**Files changed:** Permanent product diff from the IN PROGRESS handoff commit `3b0853eee098ad73188c7b738c8311eda41f356d` to the implementation commit contains only `title-island-concepts/index.html` (17 additions, 2 deletions). Temporary transformer/browser-validator/workflow files self-removed. Production `index.html`, campaigns, game runtime, textures, and other product files were not changed.

**Validation:** GitHub Actions run `33684540269` passed static and Chromium validation. Static checks confirmed all four pre-existing cloud drift durations/rules, the Concept 2-only island bob, shadow counter-animation, exactly six earth-textured pebbles with unique stagger delays, the 5-resident 3-adult / 2-child household, current scene polish, reduced-motion override, and no production/campaign/game-file changes. Chromium at 390×844 sampled three timing phases: island top positions `271.07`, `267.22`, and `268.58` px for a measured 3.85px sampled vertical range; the shadow varied by only 0.72px while the island moved; all six pebbles had distinct phase positions at the initial sample and changed across time; all four clouds also changed position across the sampled interval. No console/page/request errors, clipping, or horizontal overflow occurred, and Concepts 1 and 3 passed sanity checks with no new island bob or pebble elements. Screenshot artifact `9867566769` contains three timing phases and was downloaded and visually inspected; the dirt pebbles read as suspended debris around the island and the island movement remains intentionally subtle.

**Implementation commit:** `457b26ee13fb1a879e19c275b3bab9d166d82428` (`Float the Little Home island`).

**Deployment:** GitHub Pages run `33684613308` completed successfully for exact implementation commit `457b26ee13fb1a879e19c275b3bab9d166d82428`. Live preview remains `https://maloysius-wq.github.io/latchlings/title-island-concepts/?c=2`.

**Remaining risk / next action:** This floating-motion pass is complete in the design-selection preview. The bob is deliberately restrained so it does not make the residents/cottage feel seasick; if user review wants a stronger floating read, the 5px amplitude or 7.6s cadence can be tuned. Production remains intentionally untouched pending explicit promotion.

---

### 2026-09-02 — Harden GitHub-plugin-first repository access preflight

**Status: COMPLETED**

**User goal:** Stop repeated failures where repository work incorrectly concludes that GitHub is unavailable after a local clone, container DNS, or ordinary web fetch fails, even though the connected GitHub plugin is installed and usable. Make the GitHub-plugin-first rule as durable and mechanically guarded as this repository can support so the user does not have to keep repeating it.

**Implementation plan:** Strengthen the repository access rule from prose guidance into a hard preflight contract. Add a root `AGENTS.md` for agent-entry instructions, add `.github/REPOSITORY_ACCESS_PREFLIGHT.md` with an explicit decision tree and a strict failure criterion for when GitHub may be called unavailable, strengthen the top of this handoff with a hard-gate pointer, and add a lightweight CI guard that fails if required sentinel instructions are removed. The preflight will require GitHub connector discovery before container/web fallback and require immediate recovery through the plugin if a wrong route is attempted.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, new root `AGENTS.md`, new `.github/REPOSITORY_ACCESS_PREFLIGHT.md`, new `.github/workflows/validate-repository-access-guard.yml`, plus temporary self-removing workflow files used to make atomic handoff edits. No production game/title/campaign files should change.

**Validation plan:** Verify the three durable instruction surfaces contain the same GitHub-first invariants; verify CI guard passes; verify production/game/campaign/title files are unchanged; verify the GitHub plugin itself can still read the current repository after hardening. The completion note must explicitly distinguish what is fixed at the repository/agent-process layer from what cannot be changed from a chat (base model weights/tool router).

**Deployment plan:** No product deployment is required because this is repository-process hardening only. Commit the durable guard files and handoff changes to `main`, run the guard workflow successfully, then close this entry as COMPLETED with exact commit/run details and remaining limitation.


#### Completion summary

**What was fixed:** Replaced the earlier single prose invariant with a three-layer durable repository preflight. Added root `AGENTS.md` with a FIRST ACTION RULE requiring GitHub plugin discovery/loading before any local/container/web route. Added `.github/REPOSITORY_ACCESS_PREFLIGHT.md` with the explicit decision tree, invalid-evidence list, strict two-part failure criterion for ever saying GitHub is unavailable, immediate recovery rule, and tool-classification rule preventing repository UI work from being misrouted to unrelated tools. Strengthened the top of this handoff into `REPOSITORY ACCESS PRE-FLIGHT — HARD GATE`, explicitly requiring connector discovery as the first tool action when GitHub functions are not loaded and `GitHub.fetch_file` of this handoff as the first repository read. Added `.github/workflows/validate-repository-access-guard.yml` so removal or weakening of the required sentinel instructions causes CI failure.

**Why this is stronger than the previous fix:** The prior fix existed only as prose inside this handoff and could still be bypassed by making the wrong tool choice before reading the file. The new rule is duplicated at the root agent-instruction layer (`AGENTS.md`), the dedicated repository preflight layer, and the handoff layer, with CI protecting those surfaces from accidental removal. The recovery contract also explicitly says that local clone/DNS/web failure is not GitHub failure and that an agent must recover through the plugin without asking the user to repeat the instruction.

**Files changed:** `AGENTS.md`, `.github/REPOSITORY_ACCESS_PREFLIGHT.md`, `.github/workflows/validate-repository-access-guard.yml`, and `DEVELOPMENT_HANDOFF.md`. Temporary self-removing workflow files used for atomic edits were removed. No production title, design concept, campaign, game runtime, texture, or other product files changed.

**Validation:** Repository access guard run `33682109007` completed successfully and verified all required GitHub-first sentinels across the three durable instruction surfaces. An earlier guard run `33682014157` failed only because one sentinel grep did not account for Markdown bold markup in the preflight text; the guard expression was corrected and rerun successfully. A GitHub compare from pre-task commit `fba3f18e0f0a9c8d2a2aa0cf3b6800025a2e3810` through hardened commit `76d2b76bd905bcc60280d4f07759e7747aa67bed` confirmed only the four intended process/instruction files differ. The GitHub plugin itself successfully read the hardened `DEVELOPMENT_HANDOFF.md`, `AGENTS.md`, and preflight file after implementation.

**Key commits:** `b740a1083326021f26df59ebf638be8c57c33bc1` added `AGENTS.md`; `c49d07966fe188590cb254b650409b2255823e0c` added the dedicated preflight contract; `aefd0d2` strengthened the handoff hard gate; `76d2b76bd905bcc60280d4f07759e7747aa67bed` finalized the passing CI guard checks.

**Deployment:** No product deployment was required because this task changed repository/agent-process files only.

**Remaining limitation:** This repository hardening cannot modify ChatGPT's base model weights or the platform's underlying tool-selection router. Therefore it is not a mathematical guarantee that a future model instance can never choose the wrong first tool. What is now fixed is the strongest durable layer available from this chat: multiple agent/repository instruction surfaces, an explicit failure criterion and recovery path, and CI protection against regression. Within this repository workflow, the user should not need to repeat “use the GitHub plugin.”

**Next action:** Resume normal Latchlings development. For the next repository request, GitHub plugin discovery/loading is the mandatory first tool action if GitHub functions are not already loaded.

---

### 2026-09-02 — Add randomized rest periods to Little Home adults

**Status: COMPLETED**

**User goal:** The three adult Latchlings in selected Concept 2 / Little Home move too continuously. Keep them alive and active, but introduce randomized movement timing so adults spend meaningful periods standing still between outings instead of constantly looping around the island.

**Implementation plan:** Preserve the five-resident household, two continuously playful children, blue flower, improved tree, inset stone, removed brown platform, and animated clouds. Convert only the three adult route animations from perpetual loops into one-shot outings controlled by a small Concept 2-only JavaScript scheduler. Each adult will begin after an independent randomized stagger, move for roughly 4–6 seconds, return to its resting position, then idle for roughly 4–9 seconds with occasional longer rests before another outing. Face/blink/inner idle animation must continue while locomotion is paused. Keep the gardener, parcel-runner, and tree-tender paths distinct and leave children unchanged.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, `title-island-concepts/index.html`, plus temporary self-removing transform/browser-validation scripts/workflow. No assets or production runtime files should change.

**Validation plan:** Static checks require exactly five Concept 2 residents split 3 adults / 2 children, adult route animations no longer infinite, a randomized adult scheduler with independent initial/idle timing, children retaining their continuous 6.1s play animations, and all current scene polish intact. Chromium at 390x844 will observe adult `data-motion-state` transitions over time and require every adult to enter both moving and idle states, every adult to complete at least one outing, meaningful idle intervals to occur, face/blink animation to remain active while an adult is idle, and no console/page/request errors or overflow. Capture several animation phases and sanity-check Concepts 1 and 3.

**Deployment plan:** Commit the validated preview change to `main`, deploy through GitHub Pages, inspect screenshots, then close this same handoff entry with implementation SHA, validation/deployment results, and next action.


#### Completion summary

**Implementation:** Updated only selected Concept 2 / Little Home in `title-island-concepts/index.html`. The three adult route classes (`life-garden`, `life-parcel`, `life-tree`) no longer run perpetual CSS loops. They now animate only while an `adult-outing` class is present, with a small JavaScript scheduler independently starting each adult after a randomized initial stagger. Each outing lasts a randomized 4.4–6.0 seconds, then the adult returns to its resting position and idles for a randomized 4.2–8.8 seconds; 20% of rests are longer 9–13 second pauses. The adults therefore spend substantial time stationary instead of constantly circling. Their child face/eye animations (`faceFloat` / `blinkCycle`) continue during idle periods because only locomotion is gated. The two children retain their existing continuous 6.1-second play/chase animations. Reduced-motion users keep adults stationary.

**Files changed:** Permanent implementation changed only `title-island-concepts/index.html`; this handoff was updated for process tracking. Temporary transformer/browser-validator/workflow files self-removed after the implementation commit. No production runtime, campaign, asset, or game files changed.

**Validation:** GitHub Actions run `33680651900` passed static and Chromium validation. Static checks confirmed the five-resident 3-adult / 2-child household, removal of all legacy infinite adult route rules, one-shot `adult-outing` route rules, randomized scheduler constants/state transitions, unchanged child animations, three flowers, four clouds, zero Concept 2 deck/fence elements, and no production/campaign/game-file changes. Chromium at 390×844 observed every adult entering both `idle` and `moving` states and completing at least one scheduled outing. Sampled idle adults still reported active `faceFloat` and `blinkCycle` animations. In the validation run, initial adult waits were independently staggered around 1.9s, 1.9s, and 2.9s; later standard rests sampled around 5.3–6.6s, demonstrating that movement is no longer continuous or synchronized. No console/page/request errors or horizontal overflow occurred, and Concepts 1 and 3 passed sanity renders. Screenshot artifact `9866126448` contains three timing phases and was downloaded and visually inspected; the island reads calmer while retaining intermittent adult activity and continuous child play.

**Implementation commit:** `d1f18519ecb545fcb5ce3c70fb0e29330229cca5` (`Give Little Home adults randomized rest periods`).

**Deployment:** GitHub Pages run `33680749805` completed successfully for implementation commit `d1f18519ecb545fcb5ce3c70fb0e29330229cca5`. The live preview remains `title-island-concepts/?c=2`.

**Remaining risk / next action:** This timing pass is complete in the design-selection preview. Production remains intentionally unchanged. Next action is user review of the calmer adult cadence; timer ranges can be tuned further if the adults should rest even longer or move less often.

---

### 2026-09-02 — Reduce Little Home household to five residents and add blue flower

**Status: COMPLETED**

**User goal:** Make selected Concept 2 / Little Home feel less crowded by removing one adult Latchling while keeping both children, and add another flower with blue petals.

**Implementation plan:** Remove the broad home/center-circuit adult (`life-home` / `l4`) so the household becomes exactly three adults plus two children. Preserve the gardener, parcel-runner, tree-tender, both children, their play/chase behavior, improved tree, stone position, removed brown platform, and animated clouds. Add one new blue procedural flower in the opened center-left yard space using the existing flower geometry with a Concept 2-only blue-petal override. Leave Concepts 1 and 3 and production `index.html` untouched.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, `title-island-concepts/index.html`, plus temporary self-removing transform/browser-validation workflow files. No third-party assets are needed.

**Validation plan:** Static checks require exactly five Concept 2 residents split 3 adults / 2 children, zero `life-home` resident markup, the existing three remaining adult routine classes, a third Concept 2 flower with blue-specific styling, no deck/fence regression, four animated clouds still present, and no production/campaign/game-file changes. Chromium at 390x844 must show no console/page/request errors, overflow, clipped UI, or resident/flower placement problems. Capture screenshots for visual inspection and sanity-check Concepts 1 and 3.

**Deployment plan:** Commit validated Concept 2 polish to `main`, deploy through GitHub Pages, inspect screenshots, then close this entry with implementation SHA, validation/deployment runs, and next action.


#### Completion summary

**Implementation:** Refined only Concept 2 / Little Home in `title-island-concepts/index.html`. Removed the gold `life-home` / `l4` adult whose broad center-circuit route contributed most to the crowded feel. The household is now exactly five residents: three adults (gardener, parcel runner, and tree tender) plus the same two smaller children. Added a third procedural flower in the newly opened back-center yard space at `left:148px; top:84px`, reusing the existing flower geometry with a Concept 2-only blue petal treatment (`#72aef5`) and warm yellow center. Updated the Concept 2 label/variant copy from six residents / four adults to five residents / three adults. The improved tree, stone placement, removed brown platform, animated clouds, children's play behavior, cottage, and title controls remain intact. Concepts 1 and 3 and production `index.html` were not changed.

**Files changed:** Permanent implementation changed only `title-island-concepts/index.html`; this handoff was updated for process tracking. Temporary transformer/browser-validator/workflow files self-removed after the implementation commit.

**Validation:** GitHub Actions run `33677356975` passed static and Chromium validation. Static checks confirmed exactly five Concept 2 residents split 3 adults / 2 children, zero `life-home` resident, all three remaining adult routine classes intact, exactly three flowers including `flower blue f3`, blue-petal styling/placement present, four clouds retained, zero Concept 2 deck/fence elements, zero runtime image/hotlink regressions, truthful five-resident copy, and no production/campaign/game-file changes. Chromium at 390x844 passed with no console/page/request errors or overflow, confirmed the 3/2 resident split, three flowers, and blue flower bounds of `168..190 x 356..378`, safely between the tree and cottage and on the island top. Concepts 1 and 3 passed sanity renders. Screenshot artifact `9864873514` contains three animation phases and was downloaded and visually inspected; the island reads noticeably less crowded, the remaining household still feels active, and the blue flower sits cleanly in the opened space.

**Implementation commit:** `9ed890c294baa502a7cdb2118a447c601ee9cf4b` (`Open up the Little Home household`).

**Deployment:** GitHub Pages run `33677427539` completed successfully for implementation commit `9ed890c294baa502a7cdb2118a447c601ee9cf4b`. The live preview remains `title-island-concepts/?c=2`.

**Remaining risk / next action:** This polish pass is complete in the design-selection preview. Production remains intentionally unchanged. Next action is user review of the live five-resident Little Home and any further requested polish or explicit promotion to production.

---

### 2026-09-02 — Polish Little Home stone, play area, and animated clouds

**Status: COMPLETED**

**User goal:** Continue polishing selected Concept 2 / Little Home. Move the stone right so it no longer overlaps the island edge, remove the brown platform beneath the tree where the children are playing, and replace the simplistic background clouds with better-looking animated procedural clouds.

**Implementation plan:** Keep the improved organic tree, cottage, six-resident household choreography, CC0 materials, and title controls. Nudge Concept 2's rock inward/right. Remove only Concept 2's brown deck/platform while preserving the children and their play/chase routine. Rebuild Concept 2's four existing cloud shapes with softer asymmetric multi-lobed CSS forms, layered highlight/shadow, varied scale/opacity, and independent slow drift cycles using CSS individual `translate` so existing scale placement is preserved. Leave production `index.html` and campaign/game runtime untouched.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, `title-island-concepts/index.html`, plus temporary self-removing transform/Chromium-validation workflow files. No new third-party assets are required.

**Validation plan:** Static checks require Concept 2's rock position to move right, zero Concept 2 deck/platform elements, exactly six residents with 4 adults / 2 children intact, four cloud elements with dedicated Little Home cloud styling/animation, no image elements or runtime hotlinks, and no production/campaign/game-file changes. Chromium at 390x844 must show no console/page/request errors, overflow, clipped UI, stone edge overlap, or cloud/title/island/control collisions. Sample cloud transforms at multiple timestamps to prove animation and capture screenshots for visual inspection. Sanity-check Concepts 1 and 3 remain functional.

**Deployment plan:** Commit the validated Concept 2 polish to `main`, deploy through existing GitHub Pages, visually inspect captured renders, then close this entry with implementation SHA, validation/deployment runs, and next action.


#### Completion summary

**Implementation:** Polished selected Concept 2 / Little Home only in `title-island-concepts/index.html`. Moved the left-side rock inward/right from `left:43px` to `left:58px` so it no longer sits on the island rim. Removed Concept 2's brown deck/platform beneath the tree while preserving all six moving residents and the children's chase/play routine. Rebuilt the four Little Home background clouds as softer asymmetric multi-lobed procedural CSS forms with highlight/underside shading and independent slow drift cycles (38s, 46s, 53s, and 42s with offset phases). No new third-party assets were added. Production `index.html` and campaign/game runtime files were not changed.

**Repository access hardening:** Added a permanent `Repository access invariant` near the top of this handoff: GitHub-plugin/connector access is canonical for repository work; local clone/container DNS/web-fetch failure is never sufficient evidence that GitHub is unavailable. Before claiming access is unavailable, future sessions must explicitly load/discover the GitHub connector and attempt a plugin repository read.

**Files changed:** Permanent implementation changed only `title-island-concepts/index.html`; `DEVELOPMENT_HANDOFF.md` was updated for process/current-work tracking. Temporary cloud transformer/browser-validator/workflow files self-removed after the implementation commit.

**Validation:** GitHub Actions run `33669562379` passed static and Chromium validation after an earlier temporary workflow YAML-formatting attempt (`33669461616`) was corrected. Static checks confirmed rock `left:58px`, zero Concept 2 deck/platform elements, exactly four clouds, exactly six residents split 4 adults / 2 children, no image elements/runtime hotlinks, and no production/campaign/game-file changes. Chromium at 390×844 passed with no console/page/request errors, no horizontal overflow or clipped UI, rock bounds safely inset from the island (`rock left/right 78/112`, island left/right `38/352`), and all four cloud `translate` values changing across sampled timestamps. Concepts 1 and 3 also passed sanity renders. Screenshot artifact `9861960868` contains three animation phases and was downloaded and visually inspected; the stone is visibly inset, the brown platform is gone, and the clouds read softer/more dimensional while drifting independently.

**Implementation commit:** `007210337d4acc72e027338d68e2dceb0ce6fb2b` (`Polish the Little Home island and clouds`).

**Deployment:** GitHub Pages run `33669670099` completed successfully for implementation commit `007210337d4acc72e027338d68e2dceb0ce6fb2b`. The refined preview remains `title-island-concepts/?c=2`.

**Remaining risk / next action:** This polish pass is complete in the design-selection preview. Production remains intentionally unchanged. Next action is user review of the live Little Home and any further requested polish or explicit promotion to production.

---

### 2026-09-02 — Refine Little Home procedural tree

**Status: COMPLETED**

**User goal:** Improve only Concept 2 / Little Home's tree. The current three-circle canopy looks too simplistic. Replace it with a more convincing procedural tree and texture it while preserving the selected island, six-resident household choreography, and production runtime.

**Implementation plan:** Keep Concepts 1 and 3 unchanged. Rebuild Concept 2's tree with a tapered locally textured trunk, visible forked branches, root flare/contact shadow, and an asymmetrical layered canopy made from several irregular procedural leaf masses rather than three circles. Reuse the already-vendored CC0 `textures/wood.jpg` for bark and `textures/grass.jpg` as subtle foliage grain so no new third-party dependency is needed. Add layered highlights/underside shading and a cleaner organic silhouette sized to the existing island. Do not modify production `index.html`.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, `title-island-concepts/index.html`, plus temporary self-removing transformer/browser-validation workflow files if needed. Existing local CC0 textures are reused; no campaign/game runtime files should change.

**Validation plan:** Static checks require Concept 2 to use the new dedicated tree markup/classes, at least seven irregular foliage clusters, visible branch/root elements, local wood/grass texture references, and no new image elements/hotlinks. Chromium at 390x844 must show no console/page/request errors, overflow, clipped UI, or tree overlap with the title/cottage/primary controls. Capture the tree at multiple household animation phases and visually inspect silhouette, texture readability, resident clearance, and overall island balance. Sanity-check Concepts 1 and 3 remain unchanged.

**Deployment plan:** Commit the validated Concept 2 tree refinement to `main`, deploy through existing GitHub Pages, visually inspect screenshots, then close this same handoff entry with implementation SHA, validation/deployment runs, remaining risks, and exact next action.


#### Completion summary

**Implementation:** Rebuilt only Concept 2 / Little Home's tree in `title-island-concepts/index.html`. The original three-circle canopy was removed. The replacement has a tapered wood-textured procedural trunk, three visible forked branch forms, three root/contact forms, a ground shadow, and a unified irregular canopy silhouette. The canopy uses the already-vendored CC0 `textures/grass.jpg` as subtle foliage grain with layered highlights/underside shading and seven internal faceted tonal patches rather than separate round leaf blobs. A very slight canopy sway adds life without competing with the six animated residents. Concepts 1 and 3 remain unchanged, the six-resident Little Home household remains 4 adults / 2 children with its existing routines, and production `index.html` was not changed.

**Files changed:** `title-island-concepts/index.html`. Temporary transformer/validator workflows and scripts self-removed after their validated commits. No new third-party assets were added; existing local CC0 `wood.jpg` and `grass.jpg` were reused.

**Validation:** Initial structural tree run `33666314811` passed static and Chromium checks with 7 foliage elements, 3 branches, 3 roots, all 6 residents intact, no fence/image regressions, changing canopy transform across sampled timestamps, and no title/cottage/control collisions. Screenshot artifact `9860710586` was visually inspected; it confirmed the structure was improved but the canopy still read too much like a cluster of rounded masses. A second same-scope refinement unified the crown into one irregular polygon silhouette with internal tonal facets. Final run `33666543249` passed `CANOPY_STATIC_OK` and Chromium at 390×844 with zero console/page/request errors, zero overflow, zero clipped UI, 7 internal foliage facets, 6 residents / 2 children, 3 branches, 3 roots, zero image elements, zero Concept 2 fence elements, and a rendered irregular canopy pseudo-element. Final screenshot artifact `9860803140` was downloaded and visually inspected; the crown reads as one textured organic tree at phone size and retains clear separation from the cottage, title, residents, and primary controls.

**Implementation commit:** `5d466fce25c80189c7246bf075f6b96f5c3fb6e7` (`Unify the Little Home tree canopy`). The preceding structural-tree commit was `9438c1ff2af21312997e8c9ee4f2fb86c9360e5e`.

**Deployment:** GitHub Pages run `33666617556` completed successfully for final implementation commit `5d466fce25c80189c7246bf075f6b96f5c3fb6e7`. The refined preview remains `title-island-concepts/?c=2`.

**Remaining risk / next action:** This tree refinement is complete in the design-selection preview. Production remains intentionally unchanged. The next action is user review of the live Little Home; only promote or further adapt it when the user explicitly asks.

---

### 2026-09-02 — Refine selected Little Home concept with a living six-Latchling household

**Status: COMPLETED**

**User goal:** Refine selected procedural title concept #2 / Little Home. Remove its fence, shrink the residents so their scale makes sense relative to the cottage, and show exactly six Latchlings: four adults and two smaller children. All six should visibly move through daily-life routines, with the children playing and the adults doing varied household/island activities.

**Implementation plan:** Keep the existing procedural Little Home island, cottage, CC0 surface textures, shipping-faithful Latchling faces/palettes/suits, and title UI. Remove only Concept 2's fence. Scale Concept 2 adults to roughly cottage-resident scale and children smaller again. Add distinct looping CSS choreography rather than synchronized idle motion: adult gardening, a house/parcel errand, yard/tree tending, and a home/center wandering routine; two children play/chase around a tiny procedural play prop. Preserve asynchronous shipping blink/face motion on top of the locomotion. Keep Concepts 1 and 3 intact for reference and leave production `index.html` unchanged.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, `title-island-concepts/index.html`, plus temporary self-removing transformation/browser-validation workflow/script if needed. No production runtime or campaign files should change.

**Validation plan:** Static checks require Concept 2 to contain zero fence elements, exactly six residents, exactly four `.adult` and two `.child` residents, adult/child scale rules, distinct daily-life animation classes, no environment image sprites/hotlinks, and unchanged shipping Latchling palette/suit structure. Chromium at 390x844 must show no console/page/request errors, overflow, clipped UI, or residents leaving the island/covering the primary controls. Sample resident bounding boxes at multiple timestamps to prove all six have locomotion, verify child bodies are smaller than adults, and capture multiple animation-phase screenshots for visual inspection. Quick sanity-render Concepts 1 and 3.

**Deployment plan:** Commit the validated Concept 2 refinement to `main`, deploy through existing GitHub Pages, visually inspect the animation-phase screenshots, then close this same handoff entry with implementation SHA, validation/deployment runs, remaining risks, and exact next action.


#### Completion summary

**Implementation:** Refined only Concept 2 / Little Home in `title-island-concepts/index.html`. Removed its fence and rescaled the six residents so they read as occupants of the cottage rather than nearly house-sized characters. The household is exactly four 34 px adults and two 25 px children. Adults now have separate looping routines for gardening, carrying a parcel between home and yard, tending the tree/yard, and making a broader home/center circuit. The two smaller children play/chase through the yard around a tiny animated procedural ball. Small procedural chore props distinguish the adult routines. Shipping-faithful face, suit, palette, blink, and idle behavior remains layered inside each moving resident. Concepts 1 and 3 remain intact for comparison, and production `index.html` was not changed.

**Files changed:** `title-island-concepts/index.html`. Temporary transformer/validator/finalizer files self-removed after the permanent implementation commit.

**Validation:** GitHub Actions run `33655194619` passed the substantive static and Chromium checks before its first push-cleanup step encountered a tracked `package.json` housekeeping issue. Static validation proved zero Concept 2 fence elements, exactly six residents split 4 adults / 2 children, all six distinct routine classes, the 34 px / 25 px size rules, the animated play prop, preserved shipping palette values, zero image elements/runtime hotlinks, and no production/campaign/game-file changes. Chromium at 390x844 passed with no console/page/request errors, no horizontal overflow or clipped primary UI, all six residents remaining on the island, and all six showing measurable locomotion across three sampled timestamps. Concepts 1 and 3 also passed sanity renders. Screenshot artifact `9856427867` contains three animation phases and was downloaded and visually inspected; the smaller scale, open fence-free yard, adult activity spread, and child play read cleanly in all three phases. The validated transformation was then reproduced and permanently pushed by successful finalizer run `33655345022`.

**Implementation commit:** `5a7ec019f9df64e2c02a6675280a5aca30be934c` (`Animate the Little Home household`).

**Deployment:** GitHub Pages run `33655361488` completed successfully for implementation commit `5a7ec019f9df64e2c02a6675280a5aca30be934c`. The refined preview is `title-island-concepts/?c=2`.

**Remaining risk / next action:** This refinement is complete as a design-selection preview. Production `index.html` remains intentionally unchanged. The next action is user review of the live animated Little Home; only promote or adapt it into the production title screen when the user explicitly asks to do so.

---

### 2026-09-02 — Rebuild floating-island title concepts with procedural models + CC0 textures

**Status: COMPLETED**

**User goal:** Move away from prebuilt environmental asset sprites. Rebuild the focused floating-island title concepts around procedural browser-rendered models, using carefully selected CC0 textures as surface material only. Latchlings must match the shipping game itself, not the looser concept-gallery interpretation.

**Implementation plan:** Preserve the existing three-concept selection structure and keep production `index.html` untouched. Replace Kenney isometric environment sprites with procedural HTML/CSS/SVG geometry for the floating landmass and small lived-in props. Research and locally vendor a minimal CC0 texture set for grass/soil, stone, and wood or comparable materials, with exact source/license provenance. Rebuild preview Latchlings from the shipping `style400-game.css` and `game400-a.js` design language: exact five body palettes, radial/linear body shading, 29% crown suit mark, large white eyes with game-style pupils/highlights, the shipping expression vocabulary, and asynchronous blink/idle timing.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, `title-island-concepts/index.html`, `title-island-concepts/ASSET_CREDITS.md`, a small new `title-island-concepts/textures/` directory, and temporary self-removing import/browser-validation workflows if needed. Existing isometric source assets may remain archived but must no longer be referenced by the rebuilt runtime preview. Production game runtime files remain unchanged.

**Validation plan:** Verify no active isometric/environment sprite references in the focused preview; all third-party runtime raster files are texture/material maps with CC0 provenance; preview Latchling CSS/markup mirrors shipping palette/proportions/expression rules; exactly three concepts; zero emoji; no external runtime hotlinks; Chromium render at 390x844 with no console/page/request errors, broken images, horizontal overflow, or clipped primary UI; capture and visually inspect all three screenshots.

**Deployment plan:** Commit the procedural/textured preview only after texture provenance and browser validation pass, deploy through existing GitHub Pages, visually inspect the validated renders, then close this same handoff entry with exact files, sources, commit/run IDs, deployment result, and remaining next action.


#### Completion summary

**Implementation:** Rebuilt the focused `title-island-concepts/` gallery away from premade environment sprites/models. The floating landmass, grass cap, earth sides, clouds, path, rocks, tree, fence, deck, cottage, bridge, and flowers are now browser-built HTML/CSS geometry. The active preview contains zero environment `<img>` elements and no active Kenney/isometric references. Production `index.html` was not changed.

**Latchling fidelity:** Rebuilt the preview characters directly from the current shipping `style400-game.css` / `game400-a.js` language: exact coral/blue/mint/gold/lavender COLORS/LIGHT/DARK values, shipping radial/linear body shading, 29% crown suit-mark proportions, exact heart/diamond/club/spade/star SVG paths, shipping eye/pupil/highlight proportions, all seven shipping expression classes (`happy`, `surprised`, `angry`, `smug`, `sleepy`, `curious`, `determined`), and asynchronous blink/face timing.

**CC0 materials:** Added only three local 512×512 compressed color/albedo maps from ambientCG, which publishes its assets under CC0 1.0: Grass005 as `textures/grass.jpg`, Ground085 as `textures/earth.jpg`, and Wood093 as `textures/wood.jpg`. No normal/roughness/displacement maps, preview sheets, premade models, or runtime hotlinks are used.

**Files changed:** `title-island-concepts/index.html`, `title-island-concepts/ASSET_CREDITS.md`, `title-island-concepts/textures/grass.jpg`, `title-island-concepts/textures/earth.jpg`, `title-island-concepts/textures/wood.jpg`. Temporary build/finalization workflows and rebuild script self-removed.

**Validation:** GitHub Actions run `33651741229` passed the substantive static and Chromium gates. Static validation confirmed exactly three concepts, zero sprite image elements, zero legacy isometric runtime references, exactly the three local 512×512 texture maps, and shipping palette/expression/suit requirements. Chromium at 390×844 passed all three concepts with no console/page/request errors, no horizontal overflow, no clipped primary UI, three loaded local texture resources, zero `<img>` elements, and complete suit/face markup for 6 / 6 / 7 Latchlings. Screenshot artifact `9855068387` was downloaded and all three renders were visually inspected.

**Implementation commit:** `4d2b0ed0b84965e74875cc61b306455712213f9a` (`Rebuild title concepts with procedural textured models`).

**Deployment:** GitHub Pages run `33651987557` completed successfully for implementation commit `4d2b0ed0b84965e74875cc61b306455712213f9a`. The focused preview remains at `title-island-concepts/`, with `?c=1`, `?c=2`, and `?c=3` selecting Quiet Perch, Little Home, and Island Life.

**Remaining risk / next action:** This is still a design-selection preview. Do not replace the production title screen until the user chooses a procedural concept, requests a hybrid, or asks for another refinement pass. Older unused experimental asset files remain archived in the repository but are not referenced by this focused preview.

---

### 2026-09-02 — Repair Level 269 campaign integrity defect

**Status: COMPLETED**

**Why this was discovered:** Full-campaign validation performed while repairing the missing Chapter 3 file found exactly one pre-existing campaign integrity defect outside Chapter 3. Level 269 has a rail on cell `6,1`, which is also a nest. The shipping simulator blocks that nest entry because the rail direction check runs before nest capture, so the stored solution is invalid.

**Implementation plan:** Remove or relocate the conflicting rail with the smallest possible Level 269-only data change, then replay the stored solution and independently solve the repaired board. Do not alter unrelated Chapter 6 boards.

**Validation plan:** Require zero nest/object overlaps across all 400 levels, require every stored solution to replay to completion, and verify Level 269 shortest-path optimality against its stored `optimal` value.


**Completion:** Removed the rail that occupied the second nest at `6,1`, regenerated Level 269 from the shipping movement semantics, and stored the newly proven shortest route. Full-campaign validation now reports zero nest/object overlaps and all 400 stored routes replay successfully.

---

### 2026-09-02 — Repair missing Chapter 3 campaign data

**Status: COMPLETED**

**User goal:** Continue Latchlings from the current repository, but fix critical handoff issues before feature work. The highest-severity issue is the live runtime reference to missing `campaign400-3.js`, which leaves Levels 101–150 absent.

**Implementation plan:** Rebuild Chapter 3 as 50 frozen, deterministic Lodestone Caverns boards using the shipping movement semantics. Chapter 3 will focus on anchors while retaining rocks and movable-Latchling stopper logic, with a brief introduction followed by sustained medium/hard play and an expert tail. Every generated board must have a stored shortest solution, use at least one anchor on that shortest route, keep all starts/nests/rocks/anchors exclusive, and avoid later-chapter mechanics.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, new `campaign400-3.js`, and a temporary self-removing repository validator. Production title-screen concept files remain unchanged until this critical repair is complete.

**Validation plan:** Validate Chapter 3 IDs 101–150, compact-data schema, unique/exclusive cells, no nest/object overlap, stored solution replay, move limits, anchor use on shortest solutions, solver-confirmed optimality, difficulty progression, JavaScript loading, and then validate the full 400-level campaign references so `index.html` has no missing campaign script.

**Deployment plan:** Commit `campaign400-3.js`, run the repository-backed validator, confirm the Pages build for the repaired head, then mark this entry COMPLETED with commit/run details before resuming title-screen feature work.


**Completion:** Rebuilt `campaign400-3.js` with Levels 101–150 as deterministic Lodestone Caverns anchor boards. Validation loaded all 400 levels, replayed Chapter 3 routes, required anchor use, and independently confirmed all 50 stored Chapter 3 solutions are shortest. Optimal range is 3–13 moves with an expert tail of 10, 12, 11, 11, 13.

---

### 2026-09-02 — Three focused floating-island title concepts

**Status: COMPLETED**

**User goal:** Create three real browser-rendered HTML title-screen examples based on the newly clarified direction: one large floating island centered on the screen, with Latchlings going about their daily life. These must not be image-generation mockups. The Latchlings also need to pull back from bird anatomy and remain visually consistent with the actual game: round magnetic creatures with expressive eyes/faces and black suit marks, but no beaks, feathers, tails, or overt bird body language.

**Three variants to build:**
1. **Cozy Nest Island** — simplest and calmest version: central nest/home area, path, tree, flowers, 5–7 Latchlings doing subtle daily-life actions.
2. **Cozy Home Island** — same core composition with a few tiny lived-in details such as a little home/perch, mailbox/sign, flower patch, and slightly more routine activity.
3. **Playful Island Life** — same visual language but more motion and interaction: hopping, hovering, a small play/perch prop, reactions between Latchlings, while staying organized rather than chaotic.

**Implementation rules:**
- Real HTML/CSS/JS rendered in-browser and hosted under the existing GitHub Pages site.
- Production `index.html` remains untouched until the user explicitly selects a direction.
- Character design should borrow from the shipping board Latchlings: round gradient body, white eyes/pupils, expressive mouth, black suit mark, asynchronous blink/idle motion.
- No beaks, feather tufts, tails, bird feet, wings shaped like bird wings, or other bird-specific anatomy. Small abstract side nubs/arms are okay.
- Zero emoji.
- UI stays clean: logo/title above island, Play below, Daily Puzzle / Level Select beneath, settings/progress kept subtle.
- Use locally committed CC0 decorative assets only when they genuinely help. Do not use whole asset sheets or preview composites.
- Keep one large island as the visual anchor with generous sky/breathing room.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, new `title-island-concepts/` HTML/CSS/JS preview files, reuse of existing individually vendored CC0 assets where appropriate, and temporary self-removing browser-validation workflow if needed. Production runtime files are out of scope.

**Validation plan:** JavaScript syntax; zero-emoji scan; check that character markup contains no bird-specific anatomy classes/labels; exactly three distinct concepts; Chromium render at 390x844; no console/page errors, broken images, horizontal overflow, or clipped primary UI; screenshot artifact for visual inspection.

**Deployment plan:** commit the preview under `title-island-concepts/`, render/validate all three in GitHub Actions, deploy through existing Pages, visually inspect screenshots, then update this entry to `COMPLETED` with the hosted URL, commits, render results, and next action.


#### Completion summary

**Implementation:** Completed all three browser-rendered concepts under `title-island-concepts/` while leaving production `index.html` unchanged. The live Latchlings and mobile title UI were retained. Old mismatched island pieces were replaced with coherent individually exported Kenney CC0 isometric bases and farm props. Concept 1 is a quiet grassy supply/rest nook, Concept 2 adds an assembled tiny cottage and yard, and Concept 3 is a busier playful island-life scene. Asset credits were updated.

**Files changed:** `title-island-concepts/index.html`, `title-island-concepts/ASSET_CREDITS.md`.

**Validation:** Static checks confirmed exactly three concepts, no emoji, no bird-anatomy runtime terms, all image references local/present, 29 total local image references and 17 isometric references. Chromium at 390x844 passed all three with no broken images, console/page/request errors, horizontal overflow, or clipped primary UI. Render counts were 6 Latchlings / 4 isometric assets, 6 / 7, and 7 / 6. Screenshots were uploaded and visually inspected. GitHub Actions run `33648157837` succeeded.

**Implementation commit:** `b5d649b5fedb277254fd762bef65e928fe843dbb`.

**Deployment:** GitHub Pages run `33648292031` succeeded for the implementation commit. The preview remains under `title-island-concepts/`, with query values `c=1`, `c=2`, and `c=3` selecting the concepts.

**Next action:** Do not change the production title screen until the user chooses one concept or asks for a hybrid/refinement.

---
### 2026-09-01 — Host second CC0 asset-based title concept gallery

**Status: COMPLETED**

**User goal:** The second batch of ten title-page concepts was created as local HTML using CC0 artwork for all non-Latchling decorative drawings, but the local phone preview could not resolve its sibling asset files. Host this second gallery under the existing `maloysius-wq/latchlings` GitHub Pages site, just like the first concept batch, and provide a live phone-friendly URL.

**Implementation plan:**

1. Preserve the production game and the existing first `title-concepts/` gallery unchanged.
2. Package the second concept batch as a self-contained browser page under `title-concepts-cc0-v2/`, embedding its CC0 image data and runtime code so it cannot fail because of missing sibling assets on mobile.
3. Preserve the explicit zero-emoji rule in the hosted preview by replacing leftover Unicode icon glyphs with inline SVG/CSS where needed.
4. Save source/license notes for the CC0 artwork alongside the hosted gallery.
5. Validate HTML/JavaScript and all ten concept definitions, deploy through existing GitHub Pages, verify the Pages workflow, and check the public URL.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, new `title-concepts-cc0-v2/index.html`, `title-concepts-cc0-v2/ASSET_CREDITS.md`; production `index.html` remains untouched.

**Validation plan:** self-contained asset check (no local sibling image dependencies), JavaScript syntax/sanity, ten concept definitions, zero-emoji/UI-glyph check, GitHub Pages build success, public URL fetch.

**Deployment plan:** commit the self-contained gallery and credits to `main`, wait for Pages success, verify `https://maloysius-wq.github.io/latchlings/title-concepts-cc0-v2/`, then update this entry to `COMPLETED` with commit/deployment details.

#### Completion summary

The second batch of ten CC0-art title-page concepts is now hosted under `title-concepts-cc0-v2/` without changing the production game or the original `title-concepts/` gallery.

**Hosted URL:** `https://maloysius-wq.github.io/latchlings/title-concepts-cc0-v2/`

**Implementation:**
- Added `title-concepts-cc0-v2/index.html` with all ten responsive concepts and `?c=1` through `?c=10` single-concept views.
- Latchlings remain custom animated inline SVG/HTML characters with independent blink timing.
- Non-Latchling illustrative art is loaded from locally committed CC0 PNG assets rather than procedurally drawn scenery.
- Imported twelve local source-art PNGs from six Kenney CC0 packs using the public `Tiddybub/2d-assets` CC0 archive: Background Elements Remastered, Sketch Town, Shape Characters, Animal Pack, Foliage Sprites, and UI Pack - Adventure.
- Preserved each imported pack's `SOURCE.md` and available license record under `title-concepts-cc0-v2/sources/`.
- Updated `title-concepts-cc0-v2/ASSET_CREDITS.md` to describe the actual local-source import and production guidance.
- Removed leftover Unicode icon-style UI glyphs from the hosted preview; UI labels are plain text/CSS and the Latchling artwork is inline SVG.
- Added `prefers-reduced-motion` handling for the preview animations.

**Important commits / workflow runs:**
- Start-of-work handoff workflow run `33541372320` completed successfully and committed the IN PROGRESS entry before implementation.
- CC0 asset import workflow was launched by commit `592b32cdd1f378905290f02f4bf1bfab5b80d9be`; run `33541949041` completed successfully and self-removed after importing/validating the source art.
- Gallery page created in commit `d3a1376e603361d577c6adcc66467d37925a15f3`.
- Asset provenance updated in commit `299e8e400a62fc426f7e4daa108058c51b244c70`.
- Final gallery cleanup commit `cc49383f9474660594779994ce0fd4fc6b3dd670`.
- Browser validation workflow run `33542462219` completed successfully; its self-cleanup commit is `696ddc20274de30ddb1a2cdaa2be516009e99993`.
- GitHub Pages run `33542539037` for validated head `696ddc20274de30ddb1a2cdaa2be516009e99993` completed successfully.

**Validation passed:**
- Static gallery validation passed with exactly ten concept definitions.
- Twelve local PNG source-art files were imported and validated as PNG images.
- Browser validation ran in Chromium at a 390x844 mobile viewport.
- Main gallery rendered ten concept cards and ten phone frames.
- Every loaded image completed with nonzero natural width/height.
- No failed browser requests, console errors, page errors, or horizontal overflow were detected.
- Each `?c=1` through `?c=10` single-concept mobile view rendered successfully with its local art assets.
- Temporary importer/validator workflows removed themselves after successful use.

**Production note:** This remains a design-selection gallery. Do not replace the shipping title screen until the user selects a direction or requests a hybrid. For the eventual production screen, prefer clean individual sprites from the underlying CC0 packs where useful instead of shipping whole source-pack preview composites.

---

### 2026-08-31 — Ten browser-rendered title-page concepts

**Status: COMPLETED**

**User goal:** Replace the current title page direction with something dramatically cuter, more characterful, animated, handcrafted, and less template/AI-looking. Produce **10 genuinely different title-page concepts as real HTML/CSS/JS that can actually run in the browser**, not generated concept art. Latchlings on the title page must have expressive eyes/faces and animation. Zero emoji. Research and use appropriate CC0 assets from the internet where they materially improve the designs.

**Implementation plan:**

1. Inspect the current home/title markup and active 400-level visual language so concepts remain plausible within the actual game.
2. Research CC0 UI/environment/decorative asset packs suitable for a cute sky-island puzzle game, with source/license provenance saved alongside the concepts.
3. Build a standalone `title-concepts/` preview area containing ten distinct, mobile-first HTML concepts rather than ten palette swaps. Each concept will preserve the core product actions (Play, Daily Puzzle, Level Select, settings/progress context) but explore different composition, ornament, character staging, motion, typography treatment, panels, and environmental framing.
4. Latchlings will be real HTML/CSS/SVG creatures with eyes, mouths, black suit marks, individual expressions, asynchronous blinks, idle motion, and different poses. No emoji or generated raster character art.
5. Where CC0 assets are used, vendor them locally or use a safe build/import step and record exact source/license details in `title-concepts/ASSET_CREDITS.md`. Prefer Kenney/OpenGameArt CC0 sources and avoid attribution-required assets unless clearly documented.
6. Render all ten concepts in a phone-size headless browser, inspect screenshots for clipping/readability/uncanny faces, and fix obvious defects before deployment.
7. Deploy the preview gallery under the existing GitHub Pages site without replacing the live game title page. The user will choose a direction first; production integration happens only after selection.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, new `title-concepts/` HTML/CSS/JS preview files, locally vendored CC0 decorative assets where useful, `title-concepts/ASSET_CREDITS.md`, and temporary self-removing workflows only if needed for binary asset import/render validation. Existing live `index.html` home screen remains unchanged during concept exploration.

**Validation plan:** zero emoji scan; HTML/CSS/JS syntax/sanity checks; ten distinct concept entries; mobile-size headless rendering/screenshots; no external runtime hotlinks for selected assets; provenance/license audit for all third-party assets.

**Deployment plan:** add the preview gallery and assets under `title-concepts/`, verify Pages deployment, then mark this entry COMPLETED with concept descriptions, source assets, screenshots/render results, preview URL, commits, and next action.

#### Completion summary

Ten genuinely different browser-feasible title-page directions were built under `title-concepts/` without modifying the production `index.html` title page. The live preview gallery is intended for design selection before any production integration.

**Concepts:**
1. Storybook Skyway — warm floating-island storybook composition.
2. Nest Nursery — giant living tree with multiple nest/perch characters.
3. Skyway Journal — paper travel-journal/map direction.
4. Toybox Diorama — chunky tabletop/toy-stage direction.
5. Cloud Carousel — circular/orbiting cloud composition.
6. Cottage Window — cozy windowsill looking into the skyway.
7. Garden Gate — flower/hedge entrance with peeking characters.
8. Lantern Constellations — soft twilight moon/lantern direction.
9. Patchwork Story — felt/stitch/applique handmade direction.
10. Little Music Box — tiny clockwork stage/music-box direction.

**Character/art system:** Latchlings are original HTML/CSS/inline-SVG, not generated raster art. They have white eyes/pupils, mouths, blush, wings/feet, black suit marks, multiple expressions, individual deterministic blink intervals, and distinct idle/pose animations. The preview contains zero emoji and respects `prefers-reduced-motion`.

**Product/UI decision:** Fake currency/energy bars from earlier concept imagery were deliberately rejected. Every concept uses product-relevant context only: star progress, settings, Play, Daily Puzzle, and Level Select.

**CC0 assets:** Five local accents from Kenney `Background Elements Remastered` are vendored in `title-concepts/assets/kenney/`: `cloud1.png`, `cloud4.png`, `tree.png`, `castleSmallAlt.png`, and `bush3.png`. Full provenance and CC0 1.0 licensing are recorded in `title-concepts/ASSET_CREDITS.md`. Additional researched production candidates are Kenney UI Pack - Adventure, Fantasy UI Borders, Foliage Sprites, and the CC0 Wenrexa flower/nature UI kit, but the preview intentionally avoids becoming an off-the-shelf asset-pack collage.

**Files added:** `title-concepts/index.html`, `concept.html`, `shared.css`, `themes-a.css`, `themes-b.css`, `preview-fixes.css`, `concepts.js`, `ASSET_CREDITS.md`, plus the five vendored PNG accents.

**Validation:** static validation passed for JS syntax, presence of all ten templates, exact CC0 asset set, zero emoji, and no external runtime hotlinks in the concept renderer. GitHub Actions run `33471050823` rendered all ten concepts in Chromium at a 390x844 mobile viewport with no console/page errors, failed requests, broken images, or horizontal overflow and uploaded screenshot artifact `9786540353`. Screenshots were downloaded and visually inspected. The first pass found only a 14px vertical overflow on Nest Nursery; `preview-fixes.css` reduced its scene height, and the final browser gate confirmed it fits within 390x844 with no overflow.

**Implementation head before handoff close:** `4d8f7df964c201190237b16f778ed2476ce21ed9`.

**Preview URL:** `https://maloysius-wq.github.io/latchlings/title-concepts/`

**Next action:** user reviews the ten live animated HTML concepts and chooses a direction or asks to combine specific elements. Do not replace the production title page until the user explicitly selects/approves a direction.

---

### 2026-08-31 — SFX timing and softness tuning

**Status: COMPLETED**

**User feedback / goal:** Keep the current magnetic whoosh character, but make short snaps actually expose enough of the recording to hear it. Determine whether leading silence is being clipped. Make every ordinary movement collision/end-stop use the same soft wall-edge sound instead of separate rock/anchor/blocked-square impacts. Replace both the level-win cue and the Continue/Next Level confirmation cue with softer, cuter pre-recorded sounds. Preserve the zero-procedural-audio rule.

**Implementation plan:**

1. Measure the existing three movement WAVs for leading silence/low-level attack and total duration. If dead space exists, trim only silent/near-silent leading material from the checked-in recordings without pitch/time-stretch or synthesis.
2. If necessary, slightly relax movement-stop playback behavior so a short snap does not chop off the useful attack, while keeping one recorded travel cue per continuous snap and preventing overlap into later moves.
3. Route all non-capture ordinary endpoints (edge, another Latchling, rock, anchor, door, suit gate, color gate, rail) to the existing preferred `stop-soft.wav`. Retire specialized endpoint sounds from active runtime use rather than deleting provenance immediately.
4. Search the existing CC0 Kenney interface library for gentler/cuter alternatives for `level-clear.wav` and `ui-confirm.wav`/Next Level. Import selected source recordings locally and update `SFX_CREDITS.md` with exact original filenames and purpose.
5. Keep semantic sounds distinct so Continue/Next Level does not double-stack with level-clear.
6. Validate active JS syntax, exact file references, WAV format, no procedural/pitch/playbackRate/randomization code, movement audio timing behavior, unified endpoint routing, and Pages deployment.

**Expected files/systems:** `DEVELOPMENT_HANDOFF.md`, `sfx400.js`, `SFX_CREDITS.md`, selected files in `assets/sfx/`, and temporary self-removing GitHub workflows only if needed to inspect/replace binary audio. Core level data and puzzle semantics are out of scope.

**Deployment plan:** stage/validate binary audio first, then update `sfx400.js`, run repository-backed validation, wait for GitHub Pages success, and finally mark this entry COMPLETED with exact source/timing decisions and commits.


#### Completion summary

- Waveform audit confirmed real leading low-level padding in the three whooshes. The -40 dBFS attack originally began at about 225 ms / 117 ms / 86 ms for short / medium / long. Front-only trims of 215 ms / 107 ms / 76 ms now put the strong attack at about 10 ms without pitch, speed, time-stretch, synthesis, or randomization. Final durations are about 0.328 s / 0.299 s / 0.494 s.
- Every ordinary non-capture stop now uses `stop-soft.wav`, including edge, another Latchling, rock, anchor, closed door, gate, and rail. Nest capture remains `capture.wav`. The old specialized impact files remain only as inactive provenance/history assets.
- Level clear now uses Kenney CC0 `confirmation_002.wav` at controller volume 0.24 instead of the sharper `confirmation_004.wav`. Continue/Next Level now uses a dedicated Kenney CC0 `pluck_001.wav` as `next-level.wav` at volume 0.16 instead of generic `ui-confirm.wav`.
- `SFX_CREDITS.md` records the new source files, trim amounts, and unified-stop rule.
- Validation passed for JavaScript syntax, mappings, unified stop routing, WAV format, <=12 ms movement attack onset, and zero forbidden procedural/pitch/playbackRate/randomization code.
- Key commits/runs: start handoff `2ec78a4c2dfb0703f483a26daf5702d19f57759c`; timing audit run `33443079744`; asset tuning run `33443162541` / commit `91b4f71`; runtime/provenance run `33443235379` / commit `32cd0d11561df678d25e45bba0c12c21ddbf6e01`; GitHub Pages run `33443251025` completed successfully.
- Remaining test is subjective real-device listening only.

---

### 2026-08-31 — Full licensed sound-effects pass

**Status: COMPLETED**

**User request:** Perform a full audit of Latchlings and add high-quality real sound effects to meaningful UI/gameplay events, including menu/button taps, Latchling selection, continuous magnetic movement, and endpoint impacts. Zero procedurally generated sounds were allowed.

#### Final source / license decision

The entire shipping SFX palette is sourced from **Kenney** game-audio packs released under **Creative Commons CC0 1.0 Universal**. Attribution is not legally required, but permanent provenance is preserved in `SFX_CREDITS.md`, including the official Kenney source pack/pages, exact original filenames, transfer mirrors used for retrieval, CC0 license URL, and optional Kenney credit.

Source families:

- Kenney **Interface Sounds** for UI, selection, hint, switch, capture and result cues.
- Kenney **Impact Sounds** for physical snap endpoints.
- Kenney **Foley Sounds / Woosh** for continuous magnetic travel.

All 21 shipping files are local in `assets/sfx/`. No runtime hotlinks are used.

#### Final sound map / design rules

The audit intentionally uses a restrained semantic vocabulary instead of making every state noisy.

- Ordinary button/menu action: quiet UI tap.
- Back/close/resume-style action: back cue.
- Settings/pause/rules-style modal opening: open cue.
- Positive UI confirmation: confirmation cue.
- Direct Latchling selection: dedicated select cue, only when selection actually changes.
- Center D-pad Latchling cycle: separate light tick cue.
- Invalid/no-movement D-pad input: error/bump cue.
- Valid magnetic movement: exactly **one continuous pre-recorded woosh per snap**, never one sound per grid cell.
  - path length <= 2: `move-short.wav`
  - path length 3–4: `move-medium.wav`
  - path length >= 5: `move-long.wav`
- Movement endpoint is sounded at the instant the primary travel animation reaches its destination, before the secondary bounce/capture flourish:
  - board edge or another Latchling: `stop-soft.wav`
  - rock: `stop-rock.wav`
  - anchor: `stop-anchor.wav`
  - closed door, mismatched suit/color gate, or wrong-direction rail: `stop-blocked.wav`
  - matching nest: `capture.wav`
- Switch activation: subtle `switch.wav` timed to the route step.
- Turner: subtle `turn.wav` timed to the route bend.
- Ordinary successful travel through gates/rails is intentionally silent to avoid sonic clutter.
- Hint: dedicated question/hint cue.
- Level clear: positive result cue.
- Out of moves: restrained lose/error cue.
- Level 400 completion: separate campaign-completion punctuation.
- Generic UI taps are suppressed for semantic buttons such as D-pad directions, Latchling selection/cycle, and Hint so their specialized sound does not double-stack.
- Level 400 `Finish` suppresses the generic confirmation cue so it does not stack with campaign completion.

#### Zero-procedural guarantee

`sfx400.js` uses standard HTML `Audio` playback of the checked-in source recordings. The final validator rejects procedural/variable audio code and confirmed that the SFX layer contains none of the following:

- `AudioContext` / `webkitAudioContext`
- oscillators / `createOscillator` / `OscillatorNode`
- runtime-generated audio samples
- `playbackRate` changes
- pitch/detune changes
- random sound/pitch variation

The runtime may only choose a recorded file, set its volume, start/stop it, and use a small pool of identical recorded one-shots for safe overlap.

#### Files and runtime changes

- New `SFX_CREDITS.md` with permanent CC0/provenance record.
- New `assets/sfx/` containing exactly 21 local mono PCM WAV files.
- New `sfx400.js` controller with separate SFX state key `latchlings_sfx_enabled_v1`.
- `game400-a.js` now emits semantic direct-selection and center-cycle events.
- `game400-b.js` now emits invalid move, move start, in-route switch/turner, endpoint/capture, hint, level clear/loss and campaign-completion events.
- `index.html` loads `sfx400.js` after `music400.js`.
- Settings now receives a separate `Sound Effects: On / Off` control without adding persistent top-bar clutter. Music and SFX preferences remain independent.

#### Audio processing

Source recordings were transcoded only to normalize the delivery container/format, not to generate or creatively alter the sounds. All shipping SFX are:

- mono
- 44.1 kHz
- 16-bit PCM WAV

No pitch, playback-rate, randomization, synthesis, or procedural sample generation is performed.

#### Important commits / workflow runs

- `b381f514cd1bb65a8d73a017a7b1d1900f24699b` — start-of-work handoff recorded by the temporary handoff workflow.
- `04a90ae53b683e5d4071163051aed61d8674f5f6` — add `SFX_CREDITS.md`.
- `270c762fb7b52a3ff627f0097df2b7903e50adc0` — add `sfx400.js` sourced-audio controller.
- `e4809aafe202bed3d604ae6fd984d15651f85b25` — create semantic SFX wiring workflow; workflow run `33441560859` completed successfully and self-removed after applying/validating the gameplay hooks.
- Initial SFX import workflow run `33441306894` downloaded, converted and file-count-validated all 21 recordings but failed only at the final git push because `main` advanced in a narrow race window. This was not an asset/source failure.
- `949f49f0b4d9745784faeacfdf9aeb46b7433258` — make SFX importer rebase/push retry-safe.
- Workflow run `33441700503` — retry import completed successfully.
- `b81bf270adddb2d7d1680b5fd9b282d7b96f049e` — bot commit adding all 21 final local SFX assets and removing importer.
- `5cd1aecf4f216edc308633f1a2b52f6fd892950b` — enable `sfx400.js` in live `index.html`.
- `38a1acb1c9f2482ab4ab66f48ed1ae4de26b4af9` — launch final repository-backed SFX validation.
- Workflow run `33441908994` — all SFX validation steps completed successfully.
- `7532721b563f1c43303a1ae5fb6d09bb32fb9e54` — validator cleanup completion commit; tree content matches the validated live runtime.
- GitHub Pages run `33441927536` for `7532721b563f1c43303a1ae5fb6d09bb32fb9e54` completed successfully.

#### Validation passed

- Active JS syntax check passed for `game400-a.js`, `game400-b.js`, `music400.js`, and `sfx400.js`.
- Exactly 21 SFX are referenced and exactly 21 WAV files ship; the filename sets match 1:1.
- Every WAV was parsed and confirmed non-empty, mono, 44.1 kHz, 16-bit PCM.
- Zero-procedural policy scan passed for oscillators, AudioContext synthesis, playback-rate/pitch/detune and random variation.
- Semantic engine hook audit passed for direct selection, cycling, invalid input, move start, route events, move end, capture, hint, clear, lose and campaign completion.
- Loader order check passed: `music400.js` then `sfx400.js`.
- Fake-media playback harness passed exact semantic routing for selection, cycling, invalid moves, short/medium/long travel, rock/anchor/blocked endpoints and capture.
- Import workflow and final validator both removed themselves after successful use.
- Final GitHub Pages deployment completed successfully.

#### Remaining listening/compatibility note

The objective wiring, assets and deployment are validated. The final subjective mix still requires real-device playtesting by ear. Individual cue choice or volume can be adjusted without changing the architecture if a sound feels too sharp, soft, busy, metallic, airy, etc.

An attempted independent HTTP fetch from the local execution environment could not resolve `maloysius-wq.github.io` because that environment had no DNS access, so do not claim that local curl provided a live-browser test. GitHub Pages itself reports the validated deployment as successful.

#### Remaining unrelated critical issue

The pre-existing missing `campaign400-3.js` / Levels 101–150 issue remains open and was explicitly preserved by the SFX validator. This SFX pass does not repair or conceal that campaign-data defect.

---

### 2026-08-31 — Add licensed game music

**Status: COMPLETED**

**User request:** Add a very happy/cutesy title/menu track that persists across non-level screens and a different cute, soft, slow, pensive/inquisitive instrumental track for each chapter. Music must use a Creative Commons license suitable for the game, with attribution information saved when applicable.

**Start-of-work handoff commit:** `0a50cc1eea095d5f0adf9f22de2a5067248fd7ec`

#### Final soundtrack

All nine selected tracks are **CC0 1.0 / public-domain dedication**, so no attribution is legally required. Full voluntary credits, original source URLs, licensing notes, and processing details are preserved in `MUSIC_CREDITS.md`.

- Title/menu: **Happy Ukelele Island Surfing Theme** — Tarush Singhal
- Chapter 1 / Sunpetal Meadows: **Calm3 - Peaceful Days** — Juhani Junkala / SubspaceAudio
- Chapter 2 / Lanternwood Grove: **Calm1 - A Place I Call Home** — Juhani Junkala / SubspaceAudio
- Chapter 3 / Lodestone Caverns: **A Small Town On Pluto (Music Box)** — HoliznaCC0
- Chapter 4 / Masquerade Keep: **Mystical Piano** — Indieteur
- Chapter 5 / Prism Gardens: **Gem Popper Piano Tune** — Mopz
- Chapter 6 / Copperline Junction: **Cozy Puzzle In-Game 3** — MintoDog
- Chapter 7 / Stormswitch Foundry: **Electric Piano And Piano Soft Melody** — OpenGameArt contributor; the archival mirror does not preserve the uploader name
- Chapter 8 / Aurora Crown: **Calm Piano 1 (Vaporware)** — cynicmusic / The Cynic Project

Shipping assets live in `assets/music/` as:

- `title-happy-ukulele.mp3`
- `chapter-1-peaceful-days.mp3`
- `chapter-2-place-i-call-home.mp3`
- `chapter-3-pluto-music-box.mp3`
- `chapter-4-mystical-piano.mp3`
- `chapter-5-gem-popper.mp3`
- `chapter-6-cozy-puzzle.mp3`
- `chapter-7-electric-soft.mp3`
- `chapter-8-vaporware.mp3`

The source copies were retrieved from the public CC0 archival repository `euuuuuuan/todak-public`, whose provenance ledger links back to the original OpenGameArt / Free Music Archive pages. `MUSIC_CREDITS.md` records those original pages as the primary human-readable references.

#### Audio processing

The archive copies were OGG/Vorbis. A temporary GitHub Action converted them to MP3 for broad mobile-browser compatibility and normalized them approximately to:

- -20 LUFS integrated loudness
- -2 dBTP true peak target
- 7 LU loudness-range target
- LAME MP3 variable quality `-q:a 5`

The first conversion workflow attempt failed cleanly because the current GitHub runner image did not include `ffmpeg`. No audio files were modified by that failed run. The workflow was fixed to install FFmpeg explicitly, then made race-safe with `git pull --rebase origin main` before its final push.

Temporary import/conversion workflows removed themselves after successful use, so `.github/workflows/` is not left with one-use soundtrack machinery.

Relevant commits/runs:

- `3f5f3ee9cbaf9ed0603fe8d77d3d361b872ea1cd` — add temporary CC0 import workflow
- workflow run `33439477791` — import succeeded
- `7efa2d70146adc50ae3ea4b16cfb24dc9de9e04a` — bot commit adding source OGG assets
- `5f15e6bdca1412075ac3e77d0a87de371641f2c3` — initial converter workflow
- workflow run `33439669269` — failed because FFmpeg was absent on runner
- `165309b5d64478d3c7aba60cdc4cd410bccd5ea8` — explicitly install FFmpeg
- `7d4c682385f9822910b200635f91d2b3a647ba5a` — make converter push race-safe
- workflow run `33439965272` — final conversion succeeded
- `0e556191474f9235d1554463f2a7133834d809bd` — bot commit replacing OGGs with normalized MP3s
- `11f02be93ad380d354265095f874a84a62660d4c` — add `MUSIC_CREDITS.md`
- `cef36e536e2991aa7148869014eb4bc623b6f4ec` — add `music400.js`
- `0ff40d3586d579dd0c3a71c1fd159964632b49b9` — load `music400.js` in live `index.html`

#### Music-controller behavior

`music400.js` is intentionally separate from puzzle movement logic.

- Uses one looping `Audio` element so tracks cannot overlap at full volume.
- Target music volume is `0.24` after normalization.
- Track changes use a short ~360 ms fade.
- Home, Level Select, Rules/Settings opened from non-level screens, and completion use the title track.
- Actual gameplay uses the track for `ceil(displayed level / 50)`, Chapters 1–8.
- Moving between levels inside the same chapter does **not** restart the chapter music.
- Normal navigation between non-level screens does **not** restart the title music.
- Pause/win/rules overlays while the game screen remains active keep the chapter track because the player is still in the level context.
- Daily Puzzle uses the soundtrack for the level/chapter it resolves to.
- Audio begins only after the first real pointer/keyboard gesture to respect browser autoplay restrictions.
- The single media element is primed during that gesture, then synchronized to the resulting screen after the click/navigation completes.
- Music pauses when the tab/page becomes hidden and resumes to the correct context when visible again.
- Music enabled state persists in `latchlings_music_enabled_v1`.
- A `Music: On` / `Music: Off` button is injected into the existing Settings modal rather than adding a permanent top-bar control.
- No emoji or extra persistent UI clutter was added.
- Debug surface: `window.LatchlingsMusic` exposes `sync`, `isEnabled`, `setEnabled`, `current`, and `requested` for troubleshooting.

The controller watches active screen state and the displayed level label instead of modifying `game400-a.js` / `game400-b.js`. This keeps soundtrack behavior decoupled from core movement semantics.

#### Validation performed

Passed:

- Original source/license research for selected tracks: all final selections are CC0.
- Repository asset check: exactly nine final MP3 files exist in `assets/music/`; no OGG originals remain.
- Temporary import/conversion workflows are gone after successful processing.
- `music400.js` JavaScript syntax check with Node passed.
- Local controller mapping harness passed:
  - Home → title
  - Level Select → title
  - Complete → title
  - Levels 1–50 → Chapter 1
  - 51–100 → Chapter 2
  - 101–150 → Chapter 3
  - 151–200 → Chapter 4
  - 201–250 → Chapter 5
  - 251–300 → Chapter 6
  - 301–350 → Chapter 7
  - 351–400 → Chapter 8
- Final GitHub Pages deployment run `33440180653` completed successfully for commit `0ff40d3586d579dd0c3a71c1fd159964632b49b9`.

Not directly validated by automation:

- Audible playback/loop transitions on the user's specific phone/browser. The implementation handles standard mobile autoplay constraints structurally, but real-device listening remains the final subjective/compatibility test.
- Musical taste/fit is intentionally subject to user playtesting; tracks can be swapped later without changing the controller architecture.

#### Remaining unrelated critical issue

The pre-existing missing `campaign400-3.js` problem remains open. The soundtrack controller maps Chapter 3 by displayed level number, but the campaign data itself still needs repair before Levels 101–150 can be considered healthy. Do not treat the successful music deployment as fixing that campaign defect.

---

### 2026-08-31 — Establish live handoff workflow

**Status: COMPLETED**

Added the mandatory start-of-work/end-of-work handoff process. Start commit: `18f988ff874c27e759213c6021ad71241d00e2f9`. Completion commit: `42bbc1771bb34bf1381575f1a55199288cae77d7`.

---

## Critical known issue

`index.html` references `campaign400-3.js`, but **that file is missing from the repository tree**. GitHub history contains Chapter 1, Chapter 2, then Chapters 4–8, with no Chapter 3 campaign-data commit.

Affected range:

- Chapter 3: Magnetic Anchors
- Theme: Lodestone Caverns
- Levels 101–150

Required repair: regenerate/recover Chapter 3, create `campaign400-3.js` in the same compact format, run a full 400-level repository-backed validator, and verify Chapter 3 in the live build. Do not claim the exact missing payload exists in GitHub history.

---

## Active runtime

Loaded by `index.html`:

**CSS**
- `style400-ui.css`
- `style400-game.css`
- `style400-themes.css`

**Campaign**
- `campaign400-1.js` Levels 1–50
- `campaign400-2.js` Levels 51–100
- `campaign400-3.js` MISSING, should be Levels 101–150
- `campaign400-4.js` Levels 151–200
- `campaign400-5.js` Levels 201–250
- `campaign400-6.js` Levels 251–300
- `campaign400-7.js` Levels 301–350
- `campaign400-8.js` Levels 351–400

**Engine / presentation logic**
- `game400-a.js`
- `game400-b.js`
- `music400.js`
- `sfx400.js`

**Music / licensing**
- `assets/music/*.mp3` — nine local soundtrack files
- `MUSIC_CREDITS.md` — permanent license/provenance record

**Sound effects / licensing**
- `assets/sfx/*.wav` — 21 local sourced CC0 SFX files
- `SFX_CREDITS.md` — permanent CC0/provenance record

Legacy 80-level files (`game-a.js`, `game-b.js`, `levels-*`, `style.css`, `enhancements.*`) remain as history and are not active runtime source.

---

## Product non-negotiables

- Mobile-first, polished, cute, premium, uncluttered.
- No emoji in game UI. Use SVG/CSS/glyphs.
- Round colorful Latchlings, expressive centered faces, dark/black suit symbols.
- One smooth continuous magnetic snap, never cell-by-cell hopping.
- Persistent selection; direct tap-to-select remains available.
- Center D-pad selector cycles clockwise through uncaptured Latchlings.
- After capture, select the nearest remaining Latchling.
- Other Latchlings are strategic movable stoppers.
- Color and suit matter mechanically.
- Frozen/predetermined campaign levels.
- Every published level must be solvable inside move limit.
- Difficulty should remain sustained and include expert puzzles in every chapter.
- Nest cells are exclusive: no rocks, anchors, gates, rails, turners, switches, doors, or starting pieces may overlap nests.
- Keep the UI quiet. Avoid ad/currency/counter clutter.
- Push approved changes to GitHub so the same Pages URL remains the user's test build.
- Current music direction: title/menu = highly happy/cutesy; level tracks = chapter-specific, cute, soft, slow, pensive/inquisitive, instrumental. Preserve `MUSIC_CREDITS.md` when swapping tracks.
- Current SFX direction: sourced recorded audio only, no procedural generation; one continuous travel sound per magnetic snap; restrained semantic endpoint/UI cues. Preserve `SFX_CREDITS.md` when swapping effects.

---

## Campaign structure and themes

1. Levels 1–50, First Snaps, Sunpetal Meadows
2. Levels 51–100, Clever Stops, Lanternwood Grove
3. Levels 101–150, Magnetic Anchors, Lodestone Caverns
4. Levels 151–200, Suit Gates, Masquerade Keep
5. Levels 201–250, Color Gates, Prism Gardens
6. Levels 251–300, Rails and Turns, Copperline Junction
7. Levels 301–350, Switchworks, Stormswitch Foundry
8. Levels 351–400, Master Circuit, Aurora Crown

Each chapter uses five 10-level ranges. Difficulty should have only a brief introduction, then sustained medium/hard play and an expert tail around local Levels 46–50.

---

## Core gameplay semantics

`game400-b.js::simulate()` is the source of truth for movement/solver behavior.

Blocking: board edge, rock, another Latchling, closed door, mismatched suit gate, mismatched color gate, wrong-direction rail.

Specials: matching nest captures; anchor stops; turner redirects the same snap; switch toggles linked door state.

Any validator must reproduce shipping semantics exactly.

---

## Controls, animation, stars, progress

- D-pad is one continuous physical rocker with invisible directional hit regions.
- Center cycle button pressed-state fix must preserve centering:
  `.dpad button.dpad-cycle:active { transform: translate(-50%, calc(-50% + 3px)) scale(.985) !important; }`
- Latchling blinking must remain asynchronous via per-piece duration/delay.
- `prefers-reduced-motion` disables nonessential animation.
- Win popup renders visual stars.
- 3 stars at `movesUsed <= optimal`; 2 at `<= optimal + 1`; otherwise 1.
- Progress key: `latchlings_campaign400_progress_v1`.
- Music preference key: `latchlings_music_enabled_v1`.
- SFX preference key: `latchlings_sfx_enabled_v1`.
- Level 400 finishes without looping.

---

## Validation rules for level-data changes

Validate the entire campaign after any level-data edit: sequential IDs, unique starts/nests, no piece on nest, no nest/object overlap, no unintended special-tile overlap, stored solution replay, within move limit, solver-verified optimal/star thresholds, mechanic use, expert screening, and no chapter-boundary difficulty collapse.

Historical note: the retired 80-level campaign had 28 nest/object overlaps. Do not regress.

---

## Deployment workflow

GitHub Pages serves `main` from the root.

Safe order for large changes: handoff plan commit; upload dependencies/assets; update runtime code; update `index.html` last if necessary; wait for Pages `completed / success`; verify every referenced file actually exists and executes; test live behavior; then make the final handoff completion commit.

A successful Pages workflow does not prove JavaScript imports exist or run.

---

## First actions for a future chat

1. Read this file and inspect `main` plus `index.html`.
2. Follow the mandatory handoff workflow before implementation.
3. Resume any `IN PROGRESS`, `PARTIAL`, or `BLOCKED` Current Work entry first.
4. Do not forget the missing `campaign400-3.js` critical issue.
5. Preserve/update `MUSIC_CREDITS.md` if soundtrack files change.
6. Preserve/update `SFX_CREDITS.md` if sound-effect files change; keep SFX sourced-recording-only.
7. At task completion, update and commit this handoff again.
