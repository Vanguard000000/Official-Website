# Lessons

This sequence makes the site maintainable at a larger page count by
consolidating styles, navigation, and JavaScript responsibilities.

Work through them in order:

1. [Kill the inline styles](01-kill-inline-styles.md)
2. [One nav to rule them all](02-dry-the-nav.md)
3. [Split up script.js](03-split-up-script-js.md)

Constraints:

- Keep behavioral changes outside this refactor sequence.
- Record the plan and update it when the evidence changes.
- One commit per logical step, not one giant commit per lesson. Aim for commits under ~100 lines changed.
- After each lesson, the site must look and behave **exactly the same** in the browser. Refactoring means changing the code without changing the result.
