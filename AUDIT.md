# Site Audit

Living checklist maintained by the `/full-audit` skill. Findings are appended, never rewritten;
check an item off (`- [x]`) once you've fixed it and it won't be touched again. Re-running the
audit adds new findings to the bottom of each section and leaves checked items alone.

## Run log

- 2026-09-02 — initial audit: 27 findings (7 test coverage, 1 accessibility, 2 performance, 5 SEO, 6 responsive/UX including 1 production-breaking bug, 2 security, 3 feature alignment, 4 code quality)

## 1. Test coverage — unit gaps and e2e

- [x] `src/components/sortPosts.tsx:80` — uncovered branch: the `return 0` equal-values case in the sort comparator has no test. (found: 2026-09-02) (fixed: 2026-09-02)
- [ ] Add `tests/navigation.spec.ts` — Playwright nav-smoke spec: from `/`, click through to `/about`, `/countries`, `/league-of-roasts`, `/to-do-list`, `/where-should-i-go` and assert each renders real CMS-sourced content (not just "navigation succeeded"), to catch GraphQL API/query breakage. Currently zero e2e coverage beyond the homepage h1. (found: 2026-09-02)
- [ ] Add `tests/blog-post.spec.ts` — navigate to a known `[slug].astro` post (e.g. `/swan-lion-tokyo-japan`) and assert title, rating, and body content render. No current coverage. (found: 2026-09-02)
- [ ] Add `tests/sort-posts.spec.ts` — on `/league-of-roasts`, change the sort-column select and click the sort-order toggle, then assert the first row's restaurant name changes to match expected order (per the project's e2e rule: user does X, Y changes). No current coverage of `SortPosts` sorting. (found: 2026-09-02)
- [ ] Add a Playwright spec for `SortPosts` filter behaviour — set the meat filter / minimum-rating filter and assert the `role="status"` "Showing N of M results" live region (`src/components/sortPosts.tsx:242`) updates correctly, and "Clear All Filters" restores the count. No current e2e coverage. (found: 2026-09-02)
- [ ] Add a Playwright spec for the `SortPosts` "Copy link" button — click it, grant clipboard permissions in the Playwright context, read `navigator.clipboard.readText()` and assert it equals `page.url()`, and assert the button label flips to "Link copied!" (`sortPosts.tsx:235`) and reverts. No current e2e coverage. (found: 2026-09-02)
- [ ] Add a Playwright spec asserting currency conversion on `/league-of-roasts` — assert the "Price (GBP)" column renders `£`-prefixed, `.toFixed(2)`-formatted values (`sortPosts.tsx:275`), proving the build-time `exchangerate-api.com` fetch (`league-of-roasts.astro:16`) actually reaches the client. No current coverage — a broken currency fetch would ship silently today. (found: 2026-09-02)
- [ ] Add `tests/404.spec.ts` — navigate to an unknown slug (e.g. `/this-does-not-exist`) and assert `src/pages/404.astro` content renders with a 404 response status. No current coverage. (found: 2026-09-02)

## 2. Accessibility

- [ ] `src/components/header/header.astro:38-41` — mobile nav `tabindex` state (`setMenuLinks(hidden)`) is computed once at script load from `window.innerWidth` and never re-runs on resize/orientation change, so tabindex can go stale after a viewport change. Low priority. (found: 2026-09-02)

## 3. Performance

- [ ] Blog post hero images (e.g. `/swan-lion-tokyo-japan`) serve the raw WordPress-uploaded size (2560×1920) with no `srcset`/`sizes`, so every viewport downloads the full-resolution file — inflates LCP payload on mobile. (found: 2026-09-02)
- [ ] `/league-of-roasts` hero image (`Fado-Irish-Bar-and-Grill-Benalmadena-The-Whole-Roast-scaled.jpg`, 2000×2000) is marked `loading="lazy"` despite being the above-the-fold hero, delaying LCP unnecessarily. (found: 2026-09-02)

## 4. SEO / metadata

- [ ] `src/layouts/BaseLayout.astro:47` — canonical `<link>` is hardcoded to `https://roastdinnersaroundtheworld.com` (no `www`) and emitted identically on every route (homepage, `/about`, `/league-of-roasts`, every blog post), telling search engines every page is a duplicate of the homepage. Also mismatches `site` in `astro.config.mjs:7` (`https://www.roastdinnersaroundtheworld.com`, with `www`) — `og:image` on blog posts correctly uses the `www` domain, so the canonical tag is the outlier. (found: 2026-09-02)
- [ ] `/sitemap.xml` returns 404 — `@astrojs/sitemap` integration isn't configured. (found: 2026-09-02)
- [ ] `public/robots.txt` is the default Astro scaffold (`Allow: /`) with no `Sitemap:` line — consistent with there being no sitemap to point to yet. (found: 2026-09-02)
- [ ] `/about` meta description is a raw WordPress excerpt that ends mid-sentence with a literal `[…]` character, reading poorly as a search-result snippet. (found: 2026-09-02)
- [ ] No `twitter:card`/Twitter meta tags anywhere, only `og:*`. Minor, low priority for a personal site. (found: 2026-09-02)

## 5. Responsive / UX

- [ ] **Production-breaking bug**: `src/components/sortPosts.tsx:275` — `£{convertedPrice.toFixed(2)}` throws `TypeError: Cannot read properties of null (reading 'toFixed')` whenever any post has a null/missing price, because `src/pages/league-of-roasts.astro:44-46` (`convertedPrice = currencyRates?.[currency] ? price / currencyRates[currency] : price`) passes `null` straight through. With no error boundary around the island, this unmounts the entire `SortPosts` component — the whole league table (and anywhere else `SortPosts` is used, e.g. `/where-should-i-go`) silently renders as blank white space with no error shown to the user. Reproduces on every load since `showConvertedPrice` defaults to `true` (`sortPosts.tsx:47`). (found: 2026-09-02)
- [ ] `src/components/header/header.astro:43-54` + `header.css:123-151` — the mobile nav-toggle click handler sets an inline `menu.style.display = "none"/"block"`, which beats the `@media (min-width: 1200px){ display:flex }` desktop rule. Reproducible dead-end: open the mobile menu, close it, then widen the viewport past 1200px — the desktop nav stays hidden and the toggle button itself is `display:none` at that breakpoint, so there's no way to recover the nav without a full page reload. (found: 2026-09-02)
- [ ] `/countries` — "Portugal" and "Switzerland" are plain unlinked text while "Dubai", "France", "Malta", "Norway", "Spain", "USA" are hyperlinks, even though the homepage lists reviews for both (Irish Rover/Portugal, Paddy Reillys/Switzerland). Looks like an oversight, no visual "coming soon" distinction given. (found: 2026-09-02)
- [ ] `/where-should-i-go` copy says "Please either add comments here, or e-mail to me" but no comment widget/form exists on the page — references a feature that isn't there. (found: 2026-09-02)
- [ ] `src/pages/404.astro` — missing whitespace: renders as "...try another part of the world.Go home?" with no space before the link. (found: 2026-09-02)
- [ ] `/to-do-list` is a dead-end page: a single list item with no further call-to-action or link back into deeper site content beyond the nav bar. Nice-to-have, not urgent. (found: 2026-09-02)

## 6. Security

- [ ] `vercel.json:66` — CSP `script-src` includes `'unsafe-inline'`. Worth auditing whether any remaining inline `<script>` blocks (outside GTM) could move to external files/nonces to drop this. Low urgency hardening opportunity, not a live hole — no client secrets or injection vectors found (`dangerouslySetInnerHTML`/raw `innerHTML` absent from `src/`, GraphQL queries use variables not string interpolation, `connect-src`/`script-src` allowlist matches actual usage). (found: 2026-09-02)
- [ ] `yarn audit` reports 8 high / 10 moderate advisories, all in dev-toolchain transitive deps (`fast-uri`, `postcss`, `undici`, `nanoid`, `browserslist` via Astro/Vite) — not shipped to the client bundle, so not exploitable in production, but confirm Renovate PRs actually clear them rather than leaving them open indefinitely. (found: 2026-09-02)

## 7. Feature alignment vs README

- [ ] `README.md:18` says "ESLint + Prettier — linting and formatting", but the project actually uses Biome (`package.json` scripts `biome check .` / `biome format --write .`, devDependency `@biomejs/biome`) — no ESLint or Prettier present at all. Update the README line. (found: 2026-09-02)
- [ ] `README.md:31-39` scripts table omits `npm run test:coverage` and `npm run knip`, both enforced CI gates (`knip.yml`, `unit-tests.yml`) — add rows for onboarding completeness. (found: 2026-09-02)
- [ ] `src/pages/blog/jamstack.md` is a completely empty file that still builds to a live route (`/blog/jamstack/index.html`, confirmed in `yarn build` output), not referenced in the README's feature list — looks like leftover scaffolding. Either populate it or delete the file/route. (found: 2026-09-02)

## 8. Code quality

- [ ] `src/lib/api.ts:1` — `fetchGraphQL` has no return type annotation (`response.json()` resolves to implicit `any`), so callers declaring `let x: unknown` (e.g. `src/pages/about.astro:10`, `countries.astro:10`, `to-do-list.astro:9`, `where-should-i-go.astro:9`) get no real safety — the variable narrows back to `any` on assignment. A typed `fetchGraphQL<T>(query, variables): Promise<T>` plus a shared `Page`/`Post` interface would catch real mistakes. (found: 2026-09-02)
- [ ] `src/pages/index.astro:8` — `let posts = [];` is an untyped empty-array initializer (implicit `any[]`), same root cause as the `fetchGraphQL` typing gap above. (found: 2026-09-02)
- [ ] `src/pages/about.astro`, `countries.astro`, `to-do-list.astro`, `where-should-i-go.astro` all repeat an identical ~9-line block (`let singlePost: unknown` → try/fetch/catch-and-throw). Worth extracting a shared `fetchSinglePost(id: string)` helper in `src/lib/api.ts`. (found: 2026-09-02)
- [ ] The WordPress host `blog.roastdinnersaroundtheworld.com` is hardcoded separately in `src/lib/api.ts:2`, `src/layouts/BaseLayout.astro:18`, and `src/pages/[slug].astro:19` (GraphQL endpoint, preconnect link, image-URL rewrite check) — no single source of truth. Worth a shared `WP_HOST` constant. (found: 2026-09-02)
