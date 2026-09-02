# Agent Repository Preflight

This repository is developed through connected-agent workflows. For ChatGPT/agent repository work, the GitHub connector is the canonical path.

## FIRST ACTION RULE

When the task involves reading, changing, validating, deploying, or checking this repository:

1. If GitHub tool functions are not already loaded, the **first tool action must be GitHub plugin discovery/loading** through the connector layer.
2. The **first repository read must be `DEVELOPMENT_HANDOFF.md` through GitHub** (`GitHub.fetch_file` or equivalent).
3. Do not use a local clone, container network access, generic web search, or raw-GitHub fetch as the availability test for this repository.
4. A local `git clone` DNS/network failure, missing checkout, or generic web/raw-GitHub failure does **not** mean GitHub is unavailable.
5. Do not tell the user repository work cannot be done unless GitHub plugin discovery itself has been attempted and a GitHub connector read has actually failed or cannot be invoked.
6. If the wrong route is attempted first, recover immediately by loading GitHub and continue the requested work. Do not ask the user to remind you to use the plugin.

Read `.github/REPOSITORY_ACCESS_PREFLIGHT.md` for the precise decision tree, then follow `DEVELOPMENT_HANDOFF.md` for the mandatory IN PROGRESS / implementation / validation / completion workflow.
