# AGENTS.md

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

Reusable skills live in `.opencode/skills/` (OpenCode loads them automatically; other agents should read them as standing instructions):

Before creating or editing any skill, read `SKILLS_GUIDE.md`. It defines the local quality bar for trigger descriptions, progressive disclosure, reusable resources, and repository-specific constraints.

- **judgment-review** — report concrete findings against CURRICULUM.md, FILES.md, and STRUCTURE.md
- **safe-commit** — commit and push scoped work while preserving unrelated changes
- **a11y-check** — inspect markup, keyboard behavior, focus, contrast, and reduced motion
- **api-docs-first** — must be loaded before using any external API, SDK, library, browser API, or CLI; verify the exact local version and read primary documentation before coding
- **honest-benchmark** — use fixed conditions, repeated runs, medians, p95, and recorded setup for performance claims
- **science** — keep claims within the evidence collected
- **standard-methods-first** — test documented existing methods before building substitutes
- **defensive-coding** — validate real boundaries and expose invalid states
- **jupyter** — safely edit, execute, validate, and review notebooks
- **publish-safety-check** — check public artifacts for secrets, accidental files, and unsupported claims
- **deploy-site** — publish/update the live site on GitHub Pages and verify the live URL
- **html-to-pdf** / **html-to-docx** — export HTML documents (e.g. the resume) to PDF or Word; the HTML is the source of truth
- **journal-pdf** — render existing `journal/*.md` files as a PDF report

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
6. Give direct answers and concrete findings. Do not grade understanding or
   speculate that work was copied.
