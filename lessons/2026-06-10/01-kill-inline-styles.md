# Lesson 1: Kill the Inline Styles

**Trains:** Skill #1 — Where things live (*"does this belong here?"*) — see [CURRICULUM.md](../CURRICULUM.md)
**Time estimate:** ~1 hour

## The problem

There are ~52 `style="..."` attributes scattered through your HTML files. For example:

```html
<div class="showcase-image" style="background:linear-gradient(135deg,#00d4ff,#7c3aed);font-size:2.5rem;color:#fff">🖥️</div>
```

Inline styles can't be reused, can't be themed (your seasonal themes can't touch them), override the stylesheet in confusing ways, and have to be hunted down one-by-one when the design changes. Style lives in CSS — that's where it belongs.

## The exercise

1. Have your agent list every inline style across the site. Read the list yourself.
2. **Group by purpose.** Most entries repeat a few gradient patterns with
   different colors rather than representing 52 unique styles. Define the
   smallest useful class set and name classes for purpose rather than appearance.
3. Write the spec for your agent: which classes to create, what they replace, and the constraint — **the site must look pixel-identical after**.
4. Let the agent execute. Read the diff: can you explain every change it made?
5. Click through every page in the browser yourself.

## Done when

- [ X] Your agent can prove zero inline styles remain — and you've seen the proof, not just trusted the claim
- [ X] No visual changes on any page
- [ X] *You* named the classes, not the agent
