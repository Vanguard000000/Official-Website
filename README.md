# Prakhar Singh - Portfolio

A personal portfolio website documenting my one-month journey learning web development with AI assistance.

**Live site:** [vanguard000000.github.io/Official-Website](https://vanguard000000.github.io/Official-Website/)

## About This Project

This website serves as both a **learning artifact** and a **showcase** of skills acquired during an intensive one-month course on web development fundamentals. Every line of code was written with the help of LLM coding assistants, demonstrating:

- **HTML5** — Semantic structure, accessibility best practices
- **CSS3** — Modern layout (Flexbox/Grid), responsive design, animations, seasonal themes
- **Vanilla JavaScript** — DOM manipulation, event handling, ES6+ (split into modules: animation, feature, theme)
- **AI-Assisted Development** — Prompt engineering, code review, debugging workflows

## Pages

| Page | Description |
|------|-------------|
| **Home** | Hero, skills overview, projects, counters |
| **About** | Personal story and learning objectives |
| **Skills** | Web development and robotics/engineering skills |
| **Portfolio** | Flip cards linking to activities and volunteering |
| **Activities** | TSA, SEFH research, BSA scouting |
| **Volunteering** | Houston Food Bank, Moody Gardens, NJHS, beach cleanup |
| **FRC** | Robotics aspiration and engineering skills |
| **Goals** | Learning objectives and coding timeline |
| **Journey** | Why AI-assisted coding |
| **Contact** | Social links and footer |

## Project Structure

```
├── index.html           # Home page
├── about.html           # About page
├── skills.html          # Skills page
├── portfolio.html       # Portfolio hub (flip cards)
├── activities.html      # Activities detail page
├── volunteering.html    # Volunteering detail page
├── frc.html             # FRC Robotics page
├── goals.html           # Goals & timeline
├── journey.html         # Learning journey
├── contact.html         # Contact/social
├── 404.html             # Custom 404 page
├── styles.css           # All styling (1,700 lines)
├── animation.js         # Scroll reveals, metrics, idle animations
├── feature.js           # Navbar, hamburger, nav links, scroll-to-top
├── theme.js             # Dark/light mode, seasonal themes, celestial bg, countdown
├── AGENTS.md            # AI agent guidelines
├── README.md            # This file
├── lessons/             # Daily lesson plans
├── journal/             # Daily journal entries
├── resume/              # Resume (HTML source + exported .docx)
└── .opencode/skills/    # Agent skill definitions
```

## Deployment

Deployed via **GitHub Pages** from the `main` branch. Pushing to `main` triggers an automatic rebuild. Live at:

https://vanguard000000.github.io/Official-Website/

## Getting Started

```bash
git clone https://github.com/Vanguard000000/Official-Website.git
cd Official-Website
# Open index.html in a browser, or:
npx serve .
```

## Learning Resources

- [MDN Web Docs](https://developer.mozilla.org/) — HTML/CSS/JS reference
- [CSS-Tricks](https://css-tricks.com/) — Layout guides
- [JavaScript.info](https://javascript.info/) — JS fundamentals

## License

MIT License — Feel free to use as a template for your own learning journey!
