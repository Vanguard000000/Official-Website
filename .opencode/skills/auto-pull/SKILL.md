---
name: auto-pull
description: Pull latest changes from the remote repo at the start of every session in this project (Official-Website-portfolio). Use automatically on first interaction in this repo before any other work begins. Also triggered by "pull latest", "update the repo", "sync changes", or when the student hasn't worked in this repo for a while.
---

# Auto Pull

At the start of every session in this repo, pull the latest changes before any other work.

## Workflow

1. **Check you're in this project.** Confirm the working directory is the Official-Website-portfolio directory.
2. **Stash or preserve local changes.** Run `git status` to see what's uncommitted:
   - If the working tree is clean, proceed.
   - If there are uncommitted changes, ask the student whether to stash them, commit them (use safe-commit), or skip the pull. Never pull with uncommitted changes without the student's decision.
3. **Pull.** Run `git pull origin main`.
4. **Report what came in.** Show the new commits pulled. If there's a merge conflict, stop and explain what happened — do not resolve conflicts without the student.
5. **Note updated files.** Mention any new or changed lesson files, journal entries, or skills so the student knows what's different.

## Hard Limits

- Never discard uncommitted work without the student's explicit permission.
- Never resolve merge conflicts without the student present.
- Do not amend, force-push, or rebase during this workflow.
- If `git pull` fails for any reason other than an uncommitted change, stop and explain the error.

## Done When

- `git status` shows the local branch is up to date with `origin/main`.
- The student knows what was pulled and whether any of their work was affected.
