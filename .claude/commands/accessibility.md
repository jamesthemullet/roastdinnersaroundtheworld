You are running an incremental accessibility review session for this Astro + React project. Target conformance level is **WCAG 2.1 AA**.

## Stack

- **Astro 6** with React 19 islands (`client:only="react"`)
- **TypeScript** — not in strict mode; uses Astro's base tsconfig (`astro/tsconfigs/base`)
- **Plain CSS** — per-component/per-page `.css` files; no Tailwind, no Emotion
- **Vitest** + **@testing-library/react** for unit tests; **Playwright** for E2E
- Source files live in: `src/components/`, `src/layouts/`, `src/lib/`, `src/pages/`

## What to do each invocation

### Step 1 — Audit for accessibility issues

Read the source files in `src/components/`, `src/layouts/`, and `src/pages/`. Look across these categories:

1. **Colour contrast** — hardcoded hex/named colour values in `.css` files; check foreground/background pairs against WCAG AA minimums (4.5:1 for normal text, 3:1 for large text ≥ 18pt or 14pt bold, 3:1 for UI components and focus indicators). Flag any pair where contrast is uncertain or provably failing.
2. **Keyboard & focus** — interactive elements reachable and operable by keyboard alone; visible focus indicators present on all focusable elements; no keyboard trap; logical tab order matches visual order; React state changes that move content (filters applied, columns hidden) preserve or restore focus predictably.
3. **Screen reader announcements** — dynamic UI changes (filter results count, sort order, copy-to-clipboard feedback) communicated via ARIA live regions (`aria-live`, `role="status"`, `role="alert"`); button state changes reflected in accessible name or `aria-pressed`; table sort direction announced with `aria-sort`.
4. **Semantic HTML & ARIA** — correct use of landmark regions (`<header>`, `<nav>`, `<main>`, `<footer>`); headings form a logical outline (no skipped levels; no purely visual h1 that leaves pages without a programmatic title); lists used for list content; `<button>` for actions, `<a>` for navigation; ARIA roles/attributes used only where native HTML is insufficient.
5. **Images & media** — all `<img>` elements have an `alt` attribute; decorative images use `alt=""`; meaningful images have descriptive, context-aware alt text (not just filename or title); no information conveyed by colour alone.
6. **Forms** — every input has a visible, programmatically associated `<label>`; required fields indicated in label text or via `aria-required`; error messages associated with inputs via `aria-describedby`; no placeholder-as-label pattern.
7. **Motion & timing** — no auto-playing, looping, or blinking content without a pause/stop control; no critical content behind a time limit.

### Step 2 — Classify each finding

For each finding, assign a severity:

- **Critical** — directly blocks a user from completing a task (e.g., form input with no label, keyboard trap, missing alt on meaningful image)
- **Significant** — degrades experience for assistive technology users but does not fully block them (e.g., insufficient colour contrast, missing live region for dynamic feedback, skipped heading level)
- **Minor** — best-practice improvement with low user impact (e.g., decorative image missing `alt=""`, redundant ARIA role on native element)

Discard any finding that is purely theoretical with no evidence of an actual issue in this codebase.

If you find **nothing worth improving**, stop here and report that clearly. Do not invent issues.

### Step 3 — Report your findings

Output exactly this structure:

```
## Accessibility review

**Date:** <today's date>
**Standard:** WCAG 2.1 AA

### Critical findings
<numbered list — or "None" if there are none>

### Significant findings
<numbered list — or "None" if there are none>

### Minor findings
<numbered list — or "None" if there are none>

### Verdict
<one sentence: e.g. "One critical issue and two significant issues found." or "No accessibility issues identified.">
```

### Step 4 — Fix the highest-severity finding

Pick the **single most impactful** finding and fix it. Prefer fixes that:

- Are self-contained to one or two files
- Have an unambiguous correct implementation
- Address Critical issues before Significant, Significant before Minor

Make the fix. Keep scope tight — one issue, one or two files. Do not refactor beyond what is needed to address the specific finding.

After fixing, append to your report:

```
### Fix applied
**Finding:** <which finding was fixed>
**File:** <path:line>
**Change:** <one sentence describing what was changed and why>
```

### Step 5 — Create a GitHub issue for each remaining finding

For each finding **not fixed in Step 4**, create a GitHub issue. Group all Minor findings into a single issue; create individual issues for Critical and Significant findings.

**For Critical or Significant findings:**

```bash
gh issue create \
  --title "a11y: <short title>" \
  --label "accessibility" \
  --body "## Summary

<one paragraph describing the issue and which WCAG criterion it relates to>

## Location

\`<file path>\` — <relevant element, component, or section>

## Suggested fix

<concrete description of what to change>

## WCAG criterion

<criterion number and name, e.g. 1.4.3 Contrast (Minimum)>

---
*Generated by the accessibility skill.*"
```

**For grouped Minor findings:**

```bash
gh issue create \
  --title "a11y: minor accessibility improvements" \
  --label "accessibility" \
  --body "## Minor accessibility improvements

The following small, low-risk accessibility improvements were identified during a routine review.

<bulleted list of findings, each with file path and a one-sentence description of the fix>

---
*Generated by the accessibility skill.*"
```

Report all issue URLs once created.

## Known project patterns

- **Skip link:** `<a href="#main-content" class="skip-link">` in `BaseLayout.astro` targets `<main id="main-content">` — this is intentional and correct; do not flag it
- **sr-only h1:** `<h1 class='sr-only'>Roast Dinners Around The World</h1>` in `header.astro` provides a programmatic page title even when pages use h2 as the first visible heading — treat this as intentional unless the heading outline is otherwise broken
- **Mobile nav toggle:** `header.astro` manages `aria-expanded` and `tabindex` on nav links via a script — verify the script keeps these in sync on every toggle; it is the single most complex ARIA interaction in the project
- **SortPosts table:** `src/components/sortPosts.tsx` — the only interactive React island; it has `aria-label` on the `<table>` and descriptive `aria-label` on external links; check for `aria-sort` on sortable column headers and live region announcements for filter/sort state changes
- **Copy-to-clipboard button:** in `sortPosts.tsx` the button text changes to "Link copied!" on click — this is visual-only feedback and is a known gap for screen reader users; an `aria-live` region or `role="status"` announcement is the correct fix
- **Colour palette:** primary colours are `#603d34` (dark red-brown), `#333` (dark grey), `blue` (body links), and `white`; the `#603d34`/white pair and the `blue`/white pair are the main contrast candidates to verify
- **No `console.error` smell here:** ignore `console.error` in catch blocks — that is intentional error logging, not an accessibility issue
