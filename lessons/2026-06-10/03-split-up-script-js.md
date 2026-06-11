# Lesson 3: Split Up script.js

**Trains:** Skill #4 — Reading code you didn't write, Skill #7 — Writing intent before code, and Skill #3 — Deletion — see [CURRICULUM.md](../CURRICULUM.md)
**Time estimate:** 2–3 hours

## The problem

`script.js` is ~490 lines of independent features stacked in one file: hamburger menu, scroll reveals, navbar shrink, dark mode, seasonal themes, celestial background, cursor trail, countdown widget, idle animations. When something breaks you can't tell which feature did it — and at least one real conflict is hiding in there.

## The exercise

1. **Inventory it yourself.** Read `script.js` top to bottom and list every distinct feature. No agent for this step — reading code you "own" but didn't write is the whole point.
2. **Find the bug while you're in there.** The seasonal-theme logic and the dark-mode toggle fight each other. Find where, and describe what's wrong in your own words.
3. **Propose your own split.** Group the features into modules, name the files, and write one line per module on why those features belong together. There's no single right answer — but you have to defend yours.
4. Hand the spec to your agent with the constraints: behavior identical afterward (except the bug fix), one module per commit, and you verify in the browser after each one.
5. **Deletion round.** Now that features are isolated, pick at least one that doesn't earn its complexity and delete it. The cursor trail and the hand-rolled smooth-scroll (CSS `scroll-behavior: smooth` already does this) are strong candidates — but the call is yours, and the commit message must carry your reasoning.

## Done when

- [ X] The module split matches *your* proposed design, not one the agent invented
- [ X] The theme conflict is fixed and you can explain what was wrong
- [ X] At least one feature is gone, with your reasoning in the commit message
