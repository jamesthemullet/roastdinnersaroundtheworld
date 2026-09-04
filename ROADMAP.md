# Product Roadmap — Roast Dinners Around the World

The site already covers the core loop — browse by country, rank in the League of Roasts, get a
suggestion via "Where should I go?" — but individual roast posts don't yet link to each other,
and there's no reason to come back once a to-do list item is ticked off. Everything below is
scored against four jobs:

- **Acquisition** — brings new visitors in
- **Engagement** — deepens a single visit
- **Retention** — earns a repeat visit
- **Fun** — no metric, just delight

Every feature is broken into a **PR sequence** — each step small enough for a human to review in
about 15 minutes. Genuinely atomic changes are left as one PR.

## Now (ship in weeks — reuses existing infra)

### 1. Related roasts — *Engagement, Retention*
"More roasts in this country" links at the bottom of every roast post, so a single visit doesn't
dead-end after one review.

1. Query: given a roast post, find related posts by shared country — pure function + tests,
   reusing data already fetched for `countries.astro`.
2. Component rendering the related-roasts list on `[slug].astro`.

### 2. "Where should I go?" history — *Retention, Fun*
`where-should-i-go.astro` currently gives a one-off suggestion with no memory — exclude
previously-suggested roasts so re-rolling feels like discovery.

1. Track recently-suggested roast IDs client-side (session state) — pure function + tests
   extending the existing suggestion logic to accept an exclusion list.
2. Wire the exclusion list into the re-roll action.

### 3. Roast structured data — *Acquisition, SEO*
Review/LocalBusiness structured data on every roast post so search engines show ratings directly.

1. **One PR.** A single JSON-LD block added to the post template from fields that already exist.

### 4. Country guide pages — *Acquisition, SEO*
Static "Best Roast Dinners in [Country]" pages generated from League of Roasts data, targeting
search terms the site can already answer.

1. Query: top-N roasts per country by rating — pure function + tests, reusing the League of
   Roasts data layer.
2. Static page template reusing the existing `countries.astro` layout, internal-linking into
   individual roast posts.

## Next (this quarter — moderate new build)

### 5. To-do list reminders — *Retention*
A nudge when a to-do-list item has sat unvisited for a while, or when a new roast is added in a
country already on the list.

1. **Infra (Mise en Place):** pick and wire an email or web push provider — no such package
   currently in `package.json`.
2. Query: to-do list items matching newly-added roasts — pure function + tests.
3. Notification send + a small preference toggle.

---
*Roast Dinners Around the World — product roadmap, 2 September 2026*
