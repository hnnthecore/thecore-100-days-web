# Day 044 · Complete website: “Fathom”

A cash-flow forecasting product for small businesses (fictional), as a **complete 16-page SaaS marketing site**: home, product overview and one page per feature, pricing, customer stories, a changelog and a demo booking flow.

**Open it:** `phase-3-complete-websites/site/day-044-saas-product/index.html`

The look is confident fintech: midnight navy, electric blue, a mint accent and a soft lavender mesh on white. **Manrope** for everything and **JetBrains Mono** for every number. The product mock-ups and charts are drawn in code.

## The pages

| Page | URL | What it does |
|------|-----|--------------|
| **Home** | `/` | Hero with a product mock-up, count-up numbers, a feature bento, a **live what-if forecast**, customer tabs and a call to action |
| **Product** | `/features/` | Six features from the `features` collection and a three-step "how it works" |
| **Feature ×6** | `/features/<slug>/` | Headline, chart, long copy from Markdown and related features |
| **Pricing** | `/pricing/` | Monthly / annual toggle (annual saves 20%), a **plan recommender**, comparison table and FAQ |
| **Customers** | `/customers/` | Four stories from the `customers` collection, filterable by sector |
| **Case study ×4** | `/customers/<slug>/` | Quote, headline numbers and the story |
| **Changelog** | `/changelog/` | Eight releases from the `releases` collection, filterable by type, plus an email subscribe form |
| **Demo** | `/demo/` | A two-step booking: details, then a day and time from seeded availability, then a confirmation |

## Things worth reading in the code

- `chart.ts` draws the forecast chart as an SVG string, so one function serves the static hero and the live what-if widget.
- `home.ts` holds a tiny cash model (sales, hire cost, late payment) and redraws against a dotted baseline on every slider move.
- Customer tabs follow the WAI-ARIA tabs pattern with arrow keys, Home and End.
- Forms use the shared `wire()` helper. They are demos: nothing is sent.

### Navigation redesign

The header is now an inverted dark bar, and the home page sections follow a different order from the other days.

### Home hero redesign

The first screen is a centred headline with the product dashboard as a wide stage beneath it. The page opens with the live "what if" demo, then the numbers, features, customer stories and the call to action.

### Real photography

The static drawn chart panels on the feature pages are replaced by one real photograph each (Pexels, free to use): forecast 7681758, alerts 4979123, invoices 7857567, reports 6779567, scenarios 6592357, teams 7109013. Every customer now has a real photograph of their kind of business (Harbourline 5025635, Lattice 23496667, Northbound 36522640, Petal & Stem 5409690) and a real portrait for the person quoted (Imogen 8171192, Dev 5715795, Rosa 7966413, Callum 7342653). The product itself, the hero dashboard and the live what-if demo, is built as real, interactive interface, not a picture. The photos are stand-ins for the fictional customers.
