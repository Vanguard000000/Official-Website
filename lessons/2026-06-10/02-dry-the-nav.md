# Lesson 2: One Nav to Rule Them All

**Trains:** Skill #2 — Spotting duplication, and Skill #7 — Writing intent before code — see [CURRICULUM.md](../CURRICULUM.md)
**Time estimate:** 1–2 hours

## The problem

Your nav and footer are copy-pasted identically across all ~10 HTML pages. Test the pain: add a new link to the nav and you have to edit 10 files — miss one, and that page silently has a stale menu. DRY ("Don't Repeat Yourself") isn't about elegance; it's about having exactly one place to make each change.

## The exercise

1. **Make the call.** Two ways to fix this — research both and pick one, with a two-sentence defense, *before* any code exists:
   - **Option A — JS injection:** one nav definition, injected on every page at load. Simpler, but: a flash before the nav appears, and no nav if JS fails.
   - **Option B — a static site generator** (e.g. [Eleventy](https://www.11ty.dev/)): pages become content + a shared layout, and a build step stamps out the HTML. More to learn, closer to how real sites work.
2. **Write the spec.** It must cover the interesting wrinkle: the active-link highlight differs per page, so the shared nav has to know which page it's on. Think through how, and put your answer in the spec — don't let the agent decide it for you.
3. Let the agent execute, converting pages incrementally. You verify each converted page in the browser before moving to the next.

## Done when

- [ X] Adding a nav link means editing exactly **one** file — prove it by having the agent add a test link, watching it appear everywhere, then reverting
- [X ] Every page shows the correct active-link highlight
- [X ] You can explain the tradeoff of the approach you picked in two sentences
