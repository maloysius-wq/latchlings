# Latchlings Game Polish Execution Guide

This is the entry point for a GPT-6 Luna extra-high implementation session. The approved behavior is in [`../specs/2026-09-24-game-polish-design.md`](../specs/2026-09-24-game-polish-design.md). The plan is split by dependency, not by separate products:

1. [`2026-09-24-reliability-gameplay.md`](2026-09-24-reliability-gameplay.md) — stabilize tests, protect progress, tier Daily, add current-board hints.
2. [`2026-09-24-phone-presentation.md`](2026-09-24-phone-presentation.md) — cinematic readability, Atlas detail, mechanic inspection.
3. [`2026-09-24-story-staging.md`](2026-09-24-story-staging.md) — landmark-connected Opening/films, chapter rewards, final parcel.

Execute tasks in numbered order, including Reliability Task 0. Do not combine commits across unrelated tasks. Complete and verify one stage before starting the next. If a task discovers a conflict with the current source, inspect the source, preserve the approved intent, update the plan/handoff with the concrete adjustment, and run the affected tests; do not silently skip a requirement. Do not claim success from a screenshot alone when the task specifies geometry or behavior assertions.

## Starting checklist

- [ ] Read `AGENTS.md`, `.github/REPOSITORY_ACCESS_PREFLIGHT.md`, and `DEVELOPMENT_HANDOFF.md` through the GitHub connector first, per repository policy. Then inspect the local working tree and approved spec.
- [ ] Work on the feature branch `codex/audit-polish-20260924`. Confirm the exact checkout and do not overwrite unrelated user changes. Do not merge or deploy without the player asking.
- [ ] Run baseline `npm test` and record exact failures, not a paraphrase. Record SHA-256 for all eight `campaign400-*.js` files.
- [ ] Commit an IN PROGRESS handoff before touching product code, as Reliability Task 0 directs.
- [ ] Use `superpowers:executing-plans` for native inline execution unless the player explicitly requests subagent-driven work. Use `superpowers:test-driven-development` and `superpowers:systematic-debugging` when those skills trigger; do not let test repairs weaken the geometric assertions.

## Task rhythm

For each task, read its **Files**, **Interfaces**, steps, and **Review Focus** before editing. Then:

1. Inspect the current functions and tests at the listed paths; line numbers are navigation hints, not authority if the file has changed.
2. Add the specified regression test or, for existing-content gates, prove the assertion fails on a deliberately wrong expectation without changing campaign data.
3. Make the smallest product change that satisfies the test and approved spec.
4. Run the task's named tests, then the full `npm test`. Resolve failures before moving on.
5. Inspect the specified phone screenshots and Reduced Motion state where applicable. Check `git diff --check`, `git status --short`, and the campaign hashes.
6. Commit the task with the listed commit message. Update `DEVELOPMENT_HANDOFF.md` with factual progress at stage boundaries.

If a test cannot run because of a local Playwright/browser setup problem, fix or document the setup separately; do not label product behavior verified. If a scene cannot find a canonical iframe landmark, keep Continue/Skip usable and record the fallback; do not pretend its route landed.

## Non-negotiable acceptance

- No Undo button, narrator voice, new level data, changed move/star rules, or altered protected bottom controls.
- All 400 authored solutions still work; campaign and Daily remain isolated.
- Every film line remains manually advanced. Paths terminate on rendered, named landmarks; Reduced Motion shows the same settled story state.
- Backup rejection never mutates progress, storage failure is visible, and hint uncertainty is stated honestly.
- Phone layouts remain readable at the stated viewport matrix, with Large Text and no horizontal overflow.
- Final `npm test` and committed-branch CI pass; remaining physical iOS/Android and audio checks are called out as external, not claimed complete.

When all three stages pass, finalize `DEVELOPMENT_HANDOFF.md` with the actual commands/results, branch/commit SHA, artifact paths, and remaining external checks. Push the feature branch for review; wait for the player's merge/deploy instruction.
