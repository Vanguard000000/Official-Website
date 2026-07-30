# AGENTS.md

## Standing Rule

At the start of every session, before any other work, run `git pull` to keep the working directory in sync with `https://github.com/Vanguard000000/Official-Website` (main branch).

---

## Reporting language

- Report to the user only in ASD-STE100 Simplified Technical English.
- Use short, direct sentences.
- Each sentence must give one instruction or state one main fact.
- Use common words and consistent technical terms.
- Define each necessary technical term at its first use.
- Do not use idioms, jokes, metaphors, or vague language.
- Keep code, commands, paths, API names, error messages, and quotations exact.

## Development velocity

- Development velocity is the number one engineering priority.
- Use the smallest correct change that delivers the requested result.
- Treat excessive documentation and excessive validation as engineering
  failures because they slow delivery and increase maintenance.
- Do not add repeated checksums, hashes, audits, tests, or manual checks after
  the required pipeline check passes.
- Trust a stable pipeline after its required check passes.
- If a pipeline cannot be trusted, fix the pipeline instead of adding repeated
  downstream checks.
- Safety, correctness, science, security, data integrity, and explicit user
  requirements remain mandatory.

This file provides guidance for AI agents working on this project.

## Project Overview

**Personal Portfolio Website** - A showcase of my one-month journey learning web development with AI assistance. The site demonstrates HTML, CSS, and JavaScript fundamentals while documenting the process of learning to code with LLM collaboration.

## Tech Stack

- **HTML5** - Semantic markup, accessibility
- **CSS3** - Flexbox, Grid, custom properties, animations
- **Vanilla JavaScript** - DOM manipulation, interactive features
- **No build tools** - Plain files for simplicity and learning

## Project Structure

```text
├── index.html          # Home page
├── about.html          # About page
├── skills.html         # Skills page
├── portfolio.html      # Portfolio hub (flip cards)
├── activities.html     # Activities detail
├── volunteering.html   # Volunteering detail
├── frc.html            # FRC Robotics
├── goals.html          # Goals & timeline
├── journey.html        # Learning journey
├── contact.html        # Contact/social
├── 404.html            # Custom 404 page
├── styles.css          # All styling
├── animation.js        # Scroll reveals, metrics, idle
├── feature.js          # Navbar, hamburger, scroll-to-top
├── theme.js            # Dark/light, seasonal, celestial, countdown
├── AGENTS.md           # This file
├── README.md           # Project documentation
├── lessons/            # Daily lesson plans
├── journal/            # Daily journal entries
├── resume/             # Resume (HTML + .docx)
└── .opencode/skills/   # Agent skill definitions
```

## Development Guidelines

### For AI Assistants

1. **Explain before coding** - When I ask for code, explain the approach first
2. **Teach, don't just generate** - Show me patterns I can reuse
3. **Use vanilla JS/CSS** - No frameworks; I'm learning fundamentals
4. **Follow semantic HTML** - Proper heading hierarchy, landmarks, ARIA where needed
5. **Mobile-first responsive** - CSS custom properties for theming
6. **Accessible by default** - Color contrast, focus states, keyboard navigation

### Code Style

- **HTML**: Lowercase tags, 2-space indent, semantic elements
- **CSS**: BEM-ish class naming, custom properties for colors/spacing
- **JS**: ES6+, const/let, arrow functions, event delegation

## Current Status

- [x] index.html - Complete structure with all sections
- [x] styles.css - Complete styling with seasonal themes, light mode, responsive design
- [x] script.js - Split into animation.js, feature.js, theme.js
- [x] README.md - Updated with current project structure and live URL
- [x] Deploy to GitHub Pages - Live at vanguard000000.github.io/Official-Website

## Goals for This Project

1. **Learn HTML/CSS basics** - Semantic structure, Flexbox, Grid, responsive design
2. **Learn JavaScript fundamentals** - DOM, events, async basics
3. **Learn LLM-assisted coding** - Effective prompting, code review, debugging with AI
4. **Build a complete project** - Deployable portfolio site
5. **Showcase AI-assisted coding skills** - Document the collaboration process

## Agent Instructions

When working on this project:
- Prioritize teaching over doing
- Show me the "why" behind decisions
- Suggest modern but not bleeding-edge patterns
- Keep dependencies minimal (none preferred)
- Help me build a prompt library for future projects

## Agent Skills

Reusable skills live in `.opencode/skills/` (OpenCode loads them automatically;
other agents should read them as standing instructions).

Before creating or editing any skill, read `SKILLS_GUIDE.md`. It defines the
local quality bar for trigger descriptions, progressive disclosure, reusable
resources, and repository-specific constraints.

- **api-docs-first** — must be loaded before using any external API, SDK,
  library, browser API, or CLI; verify the exact local version and read primary
  documentation before coding
- **benchmarking** — fixed conditions, repeated runs, medians, p95, and a
  recorded setup for every performance claim; `scripts/run_bench.py` produces
  the artifact
- **defensive-coding** — validate real boundaries and expose invalid states
- **explanation** — the agent becomes the examiner and drills you on your own
  code without answering its own questions
- **jupyter** — safely edit, execute, validate, and review notebooks
- **release-check** — check public artifacts for secrets, accidental files, and
  unsupported claims before publishing
- **science** — keep claims within the evidence collected
- **standard-methods-first** — test documented existing methods before building
  substitutes
- **a11y-check** (local) — inspect markup, keyboard behavior, focus, contrast,
  and reduced motion
- **deploy-site** (local) — publish or update the live site on GitHub Pages and
  verify the live URL
- **safe-commit** (local) — commit and push scoped work while preserving
  unrelated changes
- **judgment-review** (local) — report concrete findings against the repository
  guidance files that exist
- **journal-pdf** (local) — render existing `journal/*.md` files as a PDF report
- **html-to-pdf** / **html-to-docx** (local) — export HTML documents such as the
  resume; the HTML is the source of truth
- **auto-pull** (local) — synchronize the checkout with `origin/main` when
  asked to pull, update, or sync

Keep skills task-scoped, evidence-based, and available for implementation,
explanation, debugging, and review.

## Working Routine

1. Inspect the requested files, current Git state, and relevant repository
   guidance.
2. State the evidence, intended change, scope, and verification.
3. Implement, explain, debug, or review within the requested scope.
4. Preserve unrelated work and use objective stop conditions for destructive
   operations, missing contracts, or unresolved file ownership.
5. Treat journals as optional project files. Do not inspect or enforce them
   unless the request is specifically about those files.
6. Give direct answers and concrete findings. Grade understanding only when the
   user explicitly invokes `explanation`; never speculate that work was
   copied.

## Before Committing

State which of these ran and what they reported. Do not claim a check passed
without its output.

1. Open the changed page in the browser and confirm the change is visible.
2. Check the browser console for errors introduced by the change.
3. For a notebook change, restart the kernel, run every cell, and inspect the
   rendered outputs.
4. Run `a11y-check` when markup, focus, color, or motion changed.
5. Run `release-check` before publishing or deploying.
6. Confirm `git status` shows only the files this task was meant to touch.
