---
name: full-audit
description: Run a full audit of the Roast Dinners Around The World site (Astro 6 + React 19 islands, WordPress GraphQL backend, deployed on Vercel) covering test coverage (unit + e2e gaps), accessibility, performance, SEO, responsive/UX, security, feature alignment against the README, and code quality (typing, duplication, bad patterns, dead code). Appends new findings to a persistent AUDIT.md checklist in the repo (existing checked-off items are preserved). Use when the user asks to audit, review the health of, or find improvements for the whole site — not for reviewing a single PR/diff (use /code-review for that).
---

# Full site audit

Produces a holistic health report for the Roast Dinners Around The World site: an **Astro 6**
static/SSR site with **React 19** islands (`client:only="react"`), styled with plain per-page
`.css` files (no Tailwind/CSS-in-JS), pulling content from a WordPress GraphQL API via
`fetchGraphQL` in `src/lib/api.ts`, and deployed to Vercel (see `vercel.json`, which already sets
a CSP and other security headers). There is no application backend of its own — no server,
sessions, auth, or database — the only "backend" is the external WordPress GraphQL API and the
exchangerate-api.com currency lookup.

This is NOT a PR/diff review — `lint` (Biome), `ts-check` (`tsc --noEmit`), `knip` (dead-export
detection), and `build` are already enforced as CI gates (see `.github/workflows/lint.yml`,
`knip.yml`, `unit-tests.yml`, `playwright.yml`), so **do not re-check whether the app
lints/type-checks/builds/passes CI — it already does**. This audit looks at things no single
PR's gates catch: coverage gaps in files nobody has recently touched, e2e coverage of full user
flows, cross-cutting site quality (a11y, perf, SEO, security, UX), and code quality that a
passing type-check doesn't guarantee (the project's `tsconfig` is Astro's base config, **not
strict mode**, so untyped `let`s, implicit `any`, and unsafe casts still compile cleanly — see
category 8).

## When to run this

User asks to "audit the site", "find ways to improve the website", "do a full review of the
app", or similar whole-app requests. If they ask about a single PR or the current diff, use
`/code-review` instead.

## Output

Findings live in a single persistent file at the repo root: **`AUDIT.md`**. This is not a
one-off report — it's a living checklist that accumulates across runs. Each run **appends**,
never replaces:

- `AUDIT.md` has one `## <n>. <Category>` section per category below, in the same order, each
  containing a flat markdown checklist (`- [ ] finding text (found: YYYY-MM-DD)`).
- **Before writing anything**, read the current `AUDIT.md` in full (create it from the template
  below if it doesn't exist yet).
- For each category, compare this run's findings against what's already listed in that section:
  - If a finding already exists (same issue, same file/route — wording may differ slightly),
    **do not duplicate it**. Leave the existing line untouched.
  - If an existing unchecked item no longer reproduces (verify, don't assume — re-check it),
    check it off and add `(resolved: YYYY-MM-DD, verified during audit)` rather than deleting
    the line, so there's a record.
  - **Never touch a line that's already checked off (`- [x]`)** — those are the user's own
    record of completed work. Leave them exactly as-is, in place.
  - Genuinely new findings get appended to the bottom of that section's list as new `- [ ]`
    items, dated.
- Add a line to the `## Run log` section at the top with today's date and a one-line summary
  (e.g. "2026-08-31 — 4 new findings (2 a11y, 1 security, 1 code quality), 1 item resolved").
- Do not renumber, reorder, or rewrite prose outside the checklists — this file is meant to be
  readable as a diff over time.

Do not modify application code during the audit unless the user explicitly asks you to fix
something after seeing the report — this skill is read-only/diagnostic aside from editing
`AUDIT.md` itself.

### AUDIT.md template (use this structure if the file doesn't exist yet)

```markdown
# Site Audit

Living checklist maintained by the `/full-audit` skill. Findings are appended, never rewritten;
check an item off (`- [x]`) once you've fixed it and it won't be touched again. Re-running the
audit adds new findings to the bottom of each section and leaves checked items alone.

## Run log

- YYYY-MM-DD — initial audit

## 1. Test coverage — unit gaps and e2e

## 2. Accessibility

## 3. Performance

## 4. SEO / metadata

## 5. Responsive / UX

## 6. Security

## 7. Feature alignment vs README

## 8. Code quality
```

## How to run it

Fan out the categories below as parallel forks or a general-purpose subagent per category (they
are independent and read-heavy — keep the raw output out of your main context). Have each one
**report findings back as text**, not write to `AUDIT.md` directly — only you should touch that
file, in a single merge pass at the end, so the dedup/checked-item rules above are applied
consistently in one place. Categories needing the browser (a11y/perf/responsive/e2e-walkthrough)
should run together in one browser-driving pass since they all need the app running.

Before starting, check whether a dev server is already running; if not, start it yourself with
`yarn dev` (Astro dev server, `http://localhost:4321`) for the duration of the audit, and stop it
when done unless the user is already running it. Note: `yarn build` is also worth running once up
front — the Vercel build output reveals bundle sizes and any pages that fail to prerender.

### 1. Test coverage — unit gaps and e2e

- Run `yarn test:coverage` (Vitest + v8 coverage). List every file below full coverage in
  `src/`, and call out any file with zero tests, especially `src/lib/api.ts` (`fetchGraphQL`)
  and anything under `src/lib/graphql/queries/`.
- **E2e coverage**: Playwright is set up (`playwright.config.ts`, specs in `tests/`), but as of
  this writing `tests/index.spec.ts` only asserts the homepage h1 renders — a smoke test, not a
  behavioural one (re-verify, don't assume this is still the only spec). Walk the real flows in
  the browser via `claude-in-chrome` as a manual substitute and report which have actual
  Playwright coverage vs none:
  - Homepage → navigate to each page (`/about`, `/countries`, `/league-of-roasts`,
    `/to-do-list`, `/where-should-i-go`, a `[slug]` blog post) and confirm content loads from the
    WordPress GraphQL API
  - The league table's sort/filter interactions in `SortPosts` (`src/components/sortPosts.tsx`)
    — this is the only interactive React island in the app and the highest-value e2e target
  - The "copy link" button in `SortPosts` actually copies the right URL
  - Currency conversion on `league-of-roasts.astro` renders GBP-normalised prices
  - 404 page behaviour for an unknown slug
  For each flow, report whether it currently has automated coverage (unit-level mocks/component
  tests don't count as e2e) and, where missing, propose a concretely-scoped Playwright spec
  (per the project's own rule in `.claude/commands/tests.md`: no visibility-only assertions — a
  good e2e test exercises "user does X, then Y changes").

### 2. Accessibility

- Automated pass per route (axe via browser console injection, or Lighthouse a11y score through
  `claude-in-chrome`) — note CI already runs `@axe-core/cli` against `/` only
  (`.github/workflows/pull_request_audit.yml`); routes beyond the homepage are not covered.
- Manual: colour contrast (primary palette is `#603d34` dark red-brown, `#333` dark grey, and
  `blue` links, all on white — verify these pairs), focus order/visible focus states, keyboard
  operability of the `SortPosts` table and the mobile nav toggle in `header.astro` (which
  manages `aria-expanded`/`tabindex` via script), and screen-reader announcement of dynamic
  state (sort/filter changes, the "Link copied!" button text change, which is currently
  visual-only feedback).
- Do not flag the intentional patterns already documented in `.claude/commands/accessibility.md`
  (skip link in `BaseLayout.astro`, the `sr-only` h1 in `header.astro`).

### 3. Performance

- Lighthouse performance score and Core Web Vitals (LCP, CLS, INP) per route — a Lighthouse CI
  budget already exists at `.github/lighthouse/budget.json` / `lighthouse.config.js`; check
  whether it's actually wired into a workflow or just sitting unused.
- `yarn build` output: bundle size, unused JS/CSS, whether `client:only="react"` is used on
  `SortPosts` where a lighter `client:idle`/`client:visible` directive would do.
- Data fetching: redundant/sequential `fetchGraphQL` calls that could run in parallel
  (`Promise.all`), and whether the exchangerate-api.com currency lookup in
  `league-of-roasts.astro` happens at build/request time (intentional) rather than regressing to
  a client-side fetch.
- Image weight: unoptimised images in `src/images/` or served via the `/wp-images/*` Vercel
  rewrite, missing `width`/`height` causing layout shift.

### 4. SEO / metadata

- `astro-seo` usage per page (title/meta description/canonical/Open Graph), consistency across
  `src/pages/*.astro` and the dynamic `[slug].astro` blog route.
- `site` in `astro.config.mjs` (`https://www.roastdinnersaroundtheworld.com`) matches canonical
  URLs actually rendered; presence of `sitemap.xml`/`robots.txt` in `public/` or via an Astro
  sitemap integration; semantic heading structure per route (note the intentional `sr-only` h1
  pattern — don't flag it as missing, but do check pages that skip straight to h3+).

### 5. Responsive / UX

- Screenshot each route at ~375px and ~1280px via `claude-in-chrome`, focusing on the
  `SortPosts` table (a common responsive failure point for wide data tables) and the mobile nav.
- Console errors on load/navigation (`read_console_messages`), broken links (including the
  `/wp-images/*` rewrite and any hardcoded `blog.roastdinnersaroundtheworld.com` links), dead-end
  pages with no next step.

### 6. Security

- Secrets/credentials: nothing hardcoded in source, no non-`PUBLIC_`-prefixed secrets exposed to
  the client; `API_URL` in `src/lib/api.ts` stays server-side only.
- Injection: no `dangerouslySetInnerHTML`/`innerHTML` with unsanitised GraphQL content; GraphQL
  queries in `src/lib/graphql/queries/` use variables, not string-interpolated user input.
- Dependency vulnerabilities: `yarn audit` (or check Renovate's open PR backlog per
  `renovate.json`).
- HTTP security headers: `vercel.json` already sets CSP, HSTS, X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy — verify they still match what the
  app actually loads (e.g. the CSP's `connect-src`/`script-src` allowlist covers exactly the
  domains used: Google Tag Manager/Analytics, exchangerate-api.com, the WordPress blog host —
  flag anything missing or over-permissive like a stray `unsafe-inline`).
- No auth/user accounts exist on this site (public read-only content) — do not flag the absence
  of login/session handling as a finding.

### 7. Feature alignment vs README

There is no `ROADMAP.md` in this repo. Instead, diff the README's stated **Features** list
(browse roast dinners by country, league table of top-rated roasts, restaurant to-do list,
"where should I go?" discovery tool) against what's actually live in `main`:

- Confirm each listed feature has a working, reachable route and isn't stubbed/broken.
- Flag any route or component that exists in `src/pages/` but isn't mentioned in the README
  (undocumented feature) or vice versa (documented but missing/removed).
- Cross-check the README's "Tech Stack" and "Scripts" tables against `package.json` — flag drift
  (e.g. the README currently says "ESLint + Prettier" but `package.json` uses Biome
  (`biome check`/`biome format`) instead — verify which is current and correct the stale one).

### 8. Code quality

A passing `lint`/`ts-check`/`build`/`knip` only proves the code compiles cleanly and has no
dead exports Knip can see — not that it's precisely typed, non-duplicated, or free of dead
weight in ways static analysis misses. That's what this category covers.

- **Typing** — this project is **not** in TypeScript strict mode (uses `astro/tsconfigs/base`),
  so look for: untyped variables (`let x = []`, `let x;`), explicit `any`, missing return type
  annotations on exported functions, unsafe `as Type` casts, untyped GraphQL response data used
  directly in templates without a shape/interface.
- **Code duplication** — `.astro` pages with near-identical GraphQL-fetch frontmatter that could
  share a helper, hardcoded numeric post IDs repeated across pages (see `src/lib/pageIds.ts`,
  which already centralises some — check for others that aren't yet using it), repeated JSX/HTML
  blocks across pages.
- **Bad patterns** — `console.log` left in non-catch code paths (`console.error` in catch blocks
  is intentional, don't flag it), raw `fetch` calls to the WordPress host that bypass
  `fetchGraphQL` in `src/lib/api.ts`, `useEffect`/`useMemo` with missing or overly broad
  dependency arrays in `SortPosts`, hardcoded URLs duplicated across files instead of centralised.
- **Dead code** — cross-check against `knip.json`'s `ignore`/`ignoreDependencies` before
  flagging anything Knip already tolerates intentionally; look for commented-out code blocks
  (e.g. commented `<Image ... />` in `.astro` files) and exports genuinely unused anywhere in the
  project that Knip's config might be suppressing.

## Notes

- This is a personal/small project — keep findings proportionate. Don't recommend enterprise-
  scale tooling (e.g. a full CI a11y pipeline) as a "blocker"; note it as a "nice to have" instead
  unless it's actually broken for a real user.
- Cite every finding with a route, file:line, or screenshot — no vague "could be improved"
  entries.
- **Every checklist item must be independently reviewable as one small PR** — same spirit as the
  project's own quality/a11y/security command files, which scope each fix to one or two files.
  If a finding is actually a bundle of unrelated or large changes (e.g. "add Playwright e2e
  coverage", "improve accessibility across the app", "harden headers"), split it into several
  separate `- [ ]` lines, each scoped to a single reviewable change (e.g. one line per flow's e2e
  spec, one line per route's a11y fix, one line per header issue). Never write a checklist item a
  reviewer couldn't approve or reject on its own without also weighing in on unrelated changes
  bundled into it.
