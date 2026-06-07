Your task is to make one incremental improvement to test coverage for this Astro + React project.

## Step 1 — Read the current test state

Read every file in `tests/` and check `package.json` for installed testing dependencies (vitest, @testing-library/react, etc.).

Also read:
- `src/components/sortPosts.tsx` — the main interactive React component
- Any source file you believe is a candidate for a new test

## Step 2 — Choose: unit or e2e?

Use this decision framework:

**Unit tests are better for:**
- Algorithmic logic: filtering, sorting, data transformation, calculations
- Functions or components with clear inputs → outputs that do not require a browser
- The `sortPosts.tsx` component's filter/sort logic is the prime candidate here

**E2E tests (Playwright) are better for:**
- User interactions that span the full page or require a live server (navigation, dynamic data loading, form submission flows)
- Testing that interactive features actually *work* end-to-end (e.g. applying a filter changes the visible rows)

**Critical rule:** Do NOT write an e2e test that only asserts something is visible (checking for an h1, a heading text, or that a page loads). Those are snapshot/smoke tests, not functional tests. A good e2e test exercises a behaviour: a user does X, then Y changes. Visibility-only assertions belong in unit tests.

**Also do not write a test that is already covered.** Read the existing tests first.

## Step 3 — Evaluate: is an improvement justified?

Ask yourself:
1. Is there untested logic that could break silently?
2. Would the test catch a real regression?
3. Is the setup cost proportionate to the coverage gained?

If no meaningful improvement is justifiable given the current state, report back clearly with your reasoning and stop. Do not add a test just to add one.

## Step 4 — Act: install dependencies if needed, then write the test

**For unit tests**, check if vitest and @testing-library/react are installed. If not, install them:
```
yarn add -D vitest @testing-library/react @testing-library/user-event @vitejs/plugin-react jsdom
```
Then add a vitest config if none exists. Unit test files live alongside source in `src/` (e.g. `src/components/sortPosts.test.tsx`).

**For e2e tests**, use the existing Playwright setup. New test files go in `tests/`. Use `page.goto('/')` style navigation. The dev server runs on `http://localhost:4321`.

## Step 5 — Commit and open a PR

Once the test is written and passing:

1. Create a new branch named `tests/<short-description>` (e.g. `tests/url-param-seeding`).
2. Stage only the changed test file(s) and commit with a concise message describing the coverage added.
3. Push the branch and open a PR against `main` using `gh pr create`. PR title should be short (under 70 chars). Body should include what behaviour the test covers and what regression it would catch.
4. Return the PR URL.

## Step 6 — Report back

Summarise:
- What you chose (unit vs e2e) and why
- What specific behaviour the new test covers
- What regression it would catch
- The PR URL
