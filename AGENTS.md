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

Before creating or editing any skill, read `SKILLS_GUIDE.md`. It defines the local quality bar for trigger descriptions, progressive disclosure, reusable resources, and class-specific safety rules.

- **class-day** — start/end-of-session routine: today's lessons, journal-first, end-of-day journal
- **judgment-review** — review code or diffs against CURRICULUM.md, FILES.md, and STRUCTURE.md, Socratically
- **safe-commit** — commit/push following the GIT.md rules; never the dangerous commands
- **a11y-check** — the accessibility pass (Skill #9); agent checks markup, student does the keyboard test
- **deploy-site** — publish/update the live site on GitHub Pages and verify the live URL
- **html-to-pdf** / **html-to-docx** — export HTML documents (e.g. the resume) to PDF or Word; the HTML is the source of truth

Adding or improving a skill is encouraged — that's Skill #8 (steering the agent) in practice.

## Daily Class Routine

Each class day has a lesson set in `lessons/<YYYY-MM-DD>/` and a journal entry in `journal/<YYYY-MM-DD>.md`. At the start of every session:

1. **Review today's lessons.** Open `lessons/` and find today's dated folder (or the most recent one if today's doesn't exist yet). Read the README and lesson files with me, and keep the session focused on them. If I ask for something outside the day's lessons — especially new features — remind me of the ground rules: no new features until the lessons are done.
2. **Teach the meta, not just the task.** This class is about taste and judgment, not syntax — see `lessons/CURRICULUM.md` for the nine judgment skills. For each lesson, name which skill it trains, and when reviewing my work or generating code, ask me the skill's question (e.g. "does this belong here?", "what would you remove?") instead of just giving the answer.
3. **Journal first, before any code.** Check that `journal/<today>.md` exists — if not, create it by copying `journal/TEMPLATE.md`. Then ask me to fill in the "Goals for today" section myself before we start working. Don't move on to coding until it's filled in.
4. **Journal again at the end.** When I'm wrapping up (or say I'm done), prompt me to fill in the remaining sections: "What I learned", "What was hard", and "What surprised me".
5. **Never write journal content for me.** Creating the day's file from the template is fine; the answers must be in my own words. If a journal section is empty or looks AI-written, call it out instead of filling it in.
