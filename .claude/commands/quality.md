You are running an incremental code quality improvement session for this Astro + React project.

## Stack

- **Astro 6** with React 19 islands (`client:only="react"`)
- **TypeScript** — not in strict mode; uses Astro's base tsconfig (`astro/tsconfigs/base`)
- **Plain CSS** — per-component/per-page `.css` files; no Tailwind, no Emotion
- **Vitest** + **@testing-library/react** for unit tests; **Playwright** for E2E
- **ESLint** (flat config) + **Prettier** + **Knip** for unused code detection
- Source files live in: `src/components/`, `src/layouts/`, `src/lib/`, `src/pages/`

## What to do each invocation

### Step 1 — Pick a category

Use the current second of the clock (or any arbitrary signal) to pick **one** of these four categories. Vary the selection — do not always pick the same one:

1. **Strict typing** — look for: untyped variables (`let x = []`, `let x;`), explicit `any`, missing return type annotations on exported functions, unsafe `as Type` casts, untyped GraphQL response data used directly in templates
2. **Code duplication** — look for: `.astro` pages with near-identical frontmatter fetch patterns that could share a helper, magic hardcoded IDs (`{ id: "205" }`, `{ id: "40" }`, etc.) inlined across multiple pages, repeated JSX/HTML blocks across pages
3. **Bad patterns** — look for: `console.log` left in production code (not `console.error`), `let` declarations where a `const` + try/catch pattern would be cleaner, import ordering issues (e.g. `import` after `await` calls), hardcoded URLs duplicated across files rather than centralised in a config
4. **Dead code** — look for: commented-out code blocks (e.g. `<!-- <Image ... /> -->` in `.astro` files), unused imports, exports not referenced anywhere in the project (cross-check with `knip.json` before flagging — check the `ignoreDependencies` list)

### Step 2 — Find the best candidate

Read the relevant source files in `src/components/`, `src/layouts/`, `src/lib/`, and `src/pages/`. Identify the **single clearest, most impactful** instance of the chosen category. Prefer issues that:

- Are in frequently-used files
- Have an unambiguous fix
- Won't require changes across many files

### Step 3 — Fix it

Make the fix. Keep scope tight — one issue, one or two files. Do not refactor beyond what is needed to address the specific finding.

### Step 4 — Commit and open a PR

Once the fix is made:

1. Create a new branch named `quality/<short-description>` (e.g. `quality/fix-og-props`).
2. Stage only the changed file(s) and commit with a concise message describing the improvement.
3. Push the branch and open a PR against `main` using `gh pr create`. Title under 70 chars. Body should include the category, what was fixed, and why it matters.
4. Return the PR URL.

### Step 5 — Report

Output exactly this structure:

```
## Quality improvement

**Category:** <chosen category name>
**File:** <path:line>
**Issue:** <one sentence describing the problem>
**Fix:** <what was changed and why>
**PR:** <URL>
**Next suggestion:** <the next candidate worth tackling in this category, with file path>
```

## Known project patterns

- **Data fetching:** `fetchGraphQL(query, variables?)` in `src/lib/api.ts` is the standard way to call the WordPress GraphQL API — raw `fetch` to the same host is a smell
- **GraphQL queries:** Live in `src/lib/graphql/queries/` as named exports — new queries belong there, not inlined in pages
- **Page IDs:** Several pages fetch a single post by a hardcoded numeric ID (e.g. `"205"`, `"40"`, `"272"`) — these are candidates to centralise in a constants file, but flag rather than auto-centralise if the change spans many files
- **React islands:** `SortPosts` in `src/components/sortPosts.tsx` is the only interactive React component; it uses `client:only="react"` in `league-of-roasts.astro`
- **Knip ignore list:** `lint-staged` and `prettier-config-standard` are intentionally listed in `knip.json` `ignoreDependencies` — do not flag these as unused
- **`console.error`** in catch blocks is intentional and acceptable; `console.log` in non-catch paths is the smell to flag
