---
name: product-roadmap
description: Build or refresh a product roadmap for Roast Dinners Around the World — new features, pages, and content, PLUS making existing content easier to find, SEO, and improvements to features/pages that already exist — grounded in what the app already has. Writes a plain markdown ROADMAP.md at the repo root, grouped into Now/Next/Later, with each feature broken into a sequence of ~15-minute-reviewable PR steps. Use when the user asks for a roadmap, growth ideas, "what should we build next", or to update/rescope the existing roadmap — not for auditing existing code health (use AUDIT.md's audit process if present).
---

# Product roadmap

Produces (or refreshes) **`ROADMAP.md`** at the repo root for `roastdinnersaroundtheworld`: an
Astro 7 + React site tracking and rating roast dinners globally — browse by country, a League of
Roasts ranking, a to-do list, and a "Where should I go?" discovery tool. This is the international
sibling of `rdldn` (the London-only site) — similar shape, but its own repo/data/features; don't
assume shared infra between them. Roadmap items are scored against what actually grows and
deepens engagement. Covers more than new features:

- **Findability** — making existing country/roast content easier to discover: internal linking,
  related roasts, better navigation between country pages and individual roast posts.
- **SEO** — structured data, indexability of country/roast pages, content targeting search
  intent the site can already answer.
- **Improving what already exists** — `league-of-roasts.astro`, `to-do-list.astro`,
  `where-should-i-go.astro`, `countries.astro` are all live and real; extending them is often
  cheaper than a new feature.

## Grounding the roadmap in the real app

- `README.md` — stated features: browse by country, league table, to-do list, "where should I
  go?" discovery.
- `AUDIT.md` if present — don't duplicate known bugs/gaps as roadmap features; those are health
  fixes.
- `package.json` — Astro 7 + React 19, `astro-seo`, `accented`; no database/auth package visible
  — confirm before proposing anything needing persistence (accounts, saved lists) that the
  to-do-list page doesn't already cover client-side.
- `src/pages/*.astro` — real pages: `index`, `countries`, `[slug]` (roast posts), `blog/`,
  `league-of-roasts`, `to-do-list`, `where-should-i-go`, `about`.

## Output format

Plain markdown. Write directly to `ROADMAP.md` at the repo root, overwriting the previous
version. Structure: intro + 4 goal-tag lenses (Acquisition/Engagement/Retention/Fun) →
PR-sequence explainer → Now/Next/Later sections, each feature as `### N. Name — *Goal tags*` +
description + numbered PR-step list → Mise en place table (if any infra proposed) → footer
`*Roast Dinners Around the World — product roadmap, <date>*`.

## Breaking a feature into PR steps

Sequence data/logic → UI → wiring, splitting wherever a step could stand alone:

- A pure function (query, formatter) plus its unit tests is its own step.
- New UI is its own step, built against existing or stubbed data.
- A step needing new human-written content (country write-ups, editorial curation) gets a GitHub
  issue via `mcp__github__create_issue` rather than a PR, referenced from the roadmap line.
- No feature-flag system exists here (unlike `rdldn`'s `featureFlags.ts`) — don't propose gating
  behind flags unless the user asks for one to be built first.
- If a feature is small enough that splitting produces nothing independently reviewable, write
  **"One PR."** instead.

## Notes

- Personal/small project — don't propose enterprise-scale features as "Now"/"Next".
- Don't re-propose anything already tracked as an open item in `AUDIT.md`.
- Do not commit, push, or open a PR for `ROADMAP.md` changes unless the user explicitly asks.
