---
name: auto-pull
description: Synchronize this repository with origin/main. Use when asked to pull, update, or sync the checkout.
---

# Sync from origin

## Workflow

1. Confirm the repository root, current branch, upstream, and working-tree
   status.
2. Run `git fetch origin`.
3. Compare the local branch with `origin/main`.
4. If the worktree is clean and the branch can fast-forward, run
   `git pull --ff-only origin main`.
5. If local changes or divergent commits would be affected, stop and report the
   exact files and divergence before choosing a merge, rebase, stash, or commit.
6. Report the commits and files introduced by the update.

## Boundaries

- Preserve uncommitted work.
- Do not resolve merge conflicts, amend, rebase, or force-push as part of a
  routine sync.
- A failed fast-forward or unresolved worktree overlap requires a separate,
  explicit integration decision.

## Done when

- Local and `origin/main` divergence is reported.
- A successful sync ends with the expected upstream revision.
- Any unresolved integration condition is stated with the affected files.
