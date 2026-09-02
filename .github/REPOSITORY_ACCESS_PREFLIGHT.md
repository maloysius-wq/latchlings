# Repository Access Preflight Contract

This file exists because repository work repeatedly took the wrong tool route despite GitHub being connected. Treat this as a hard gate, not advisory prose.

## Trigger

Apply this preflight before **any** task that asks an agent to inspect, modify, validate, deploy, compare, debug, or continue work in `maloysius-wq/latchlings`.

## Required decision tree

1. **Classify the task as repository work.**
   - Repository read/write/status/deployment/Actions/PR/issue work qualifies.
2. **Check whether GitHub functions are already loaded.**
   - If yes, use them.
   - If no, immediately use the connector/plugin discovery layer to load `GitHub`.
3. **Read the repository through GitHub.**
   - First read: `DEVELOPMENT_HANDOFF.md` with `GitHub.fetch_file` or equivalent.
   - Then inspect the current files needed for the task.
4. **Only after GitHub is established may local/container/web access be used as an optional secondary convenience.**
5. **Follow the handoff workflow before implementation.**

## Invalid evidence for “GitHub is unavailable”

None of the following establishes that GitHub access is unavailable:

- local `git clone` fails
- container cannot resolve `github.com`
- local checkout is absent
- generic web search cannot find the repository
- raw.githubusercontent.com fetch fails
- a GitHub namespace is not preloaded in the visible tool list
- a previous non-plugin route failed

These are failures of secondary routes, not failures of the connected GitHub plugin.

## Strict failure criterion

An agent may tell the user that GitHub repository access is unavailable **only after**:

1. GitHub connector/plugin discovery has explicitly been attempted, **and**
2. a GitHub connector repository action such as `GitHub.get_repo` or `GitHub.fetch_file` cannot be invoked or returns an actual connector/access failure.

If step 1 has not happened, saying GitHub is unavailable is a process error.

## Recovery rule

If an agent accidentally tries container/web/local Git first and that route fails:

- do **not** stop
- do **not** ask the user whether to continue
- do **not** offer a patch as a substitute
- immediately load the GitHub plugin and continue the original request

## Tool-classification rule

Repository coding work must not be routed to unrelated tools such as image generation unless the user explicitly requests an image artifact. A visual UI change implemented in repository HTML/CSS/JS is still repository work and must begin with GitHub.

## Durable handoff sequence

After GitHub is loaded:

`GitHub plugin -> DEVELOPMENT_HANDOFF.md -> current source -> IN PROGRESS handoff commit -> implementation -> validation -> deployment/status check -> COMPLETED/PARTIAL/BLOCKED handoff commit`

The user should not need to repeat “use the GitHub plugin.”
