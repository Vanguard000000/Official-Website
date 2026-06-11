# Lessons

The site works and it looks good — now the goal is to make it *maintainable*. You've gotten fast at adding features with an LLM. These lessons train the opposite muscle: cleaning up, consolidating, and deleting. That's the skill that separates "I can generate code" from "I can own a codebase."

The framing for all three lessons: **could this site survive growing to 50 pages?** Right now the answer is no. Let's fix that before adding anything new.

Work through them in order:

1. [Kill the inline styles](01-kill-inline-styles.md)
2. [One nav to rule them all](02-dry-the-nav.md)
3. [Split up script.js](03-split-up-script-js.md)

Rules of engagement:

- **No new features until these are done.** Not even small ones.
- You can use the LLM to help, but for each lesson, *you* write the plan first and explain it before generating any code. The LLM is your pair programmer, not your ghostwriter.
- One commit per logical step, not one giant commit per lesson. Aim for commits under ~100 lines changed.
- After each lesson, the site must look and behave **exactly the same** in the browser. Refactoring means changing the code without changing the result.
