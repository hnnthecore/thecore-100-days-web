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

### Second round: deeper structure

- **Comparison matrix** on the Product page replaces the card grid: six features by spreadsheet / Starter / Growth / Scale, with a "highlight a plan" toggle and a sticky first column on small screens.
- **Tabbed feature pages**: Overview, How it works and Pricing (which plans include the feature). Arrow keys, Home and End move between tabs and the tab is kept in the URL hash.
- **Status-page footer** on every page: all systems operational, a 90-day uptime strip and the latest two changelog entries (fictional figures).
- **Plan quiz** (new page `/fit/`): five questions, one at a time, ending in a recommended plan with the reasons. Linked from Pricing, the matrix, feature pages and the footer.
- The live what-if sliders stay as the signature moment. Also fixed the mobile menu icon, which was white on white.

## Redesign: the forecast is the page

Rebuilt from `DESIGN.md`. The old home (a gradient headline, a floating dashboard mock-up, a bento of rounded cards) is replaced by the product doing its one job.

- **First screen:** one huge live chart of the next 13 weeks on a green-black ground. Three controls underneath (sales change, a new hire per month, customers pay late by) bend the mint line; the verdict sentence, the lowest-balance callout and three readouts update on every move. The dotted line is the current plan, the dashed coral line is the safety floor. It works with the keyboard (arrow keys on each slider), and the chart is redrawn at the pixel size it is shown at so its text is never stretched.
- **Files:** `DESIGN.md`, `fathom.css` (tokens, flat inner-page restyle, home), `forecast.ts` (the cash model and the big chart as pure functions, so the page renders the first view at build time and the script redraws it), `home.ts` (sliders, feature panels, count-up numbers, customer tabs), `pages/day-044-saas-product/index.astro`, `components/day-044/Shell.astro`.
- **Home, in order:** the forecast; "Every morning at 7:02" (a timed feed beside a photograph); What Fathom does (six tall panels, one open, the rest collapsed to a vertical title); four numbers at poster size; Owners sleep better (a horizontal choice of four businesses with photograph and quote); one large closing sentence with the four businesses.
- **Type and colour:** Onest for headings, figures and chart labels, Hanken Grotesk for body; green-black, a cool light ground, mint for the line and deep green for accents on light. No gradients, no monospace, no blue-violet.
- **Inner pages** follow the tokens: dark plain header, flat ink page heads, square buttons and fields, flat tiles, no shadows. The shared chart helper (`chart.ts`) was recoloured to match.
- **Logo:** the forecast-line mark recoloured to mint on ink (`scripts/make-brand.mjs`).

### Checks run
Taste Skill source linter 0 fail / 0 warn; browser inspector (1440 / 768 / 390) with only the reduced-motion environment note and no footage left; overflow and contrast sweep of all pages at five widths.

### Second pass: the product, not a template
The hero (the live forecast) stays. Below it, "Thirteen weeks, one scroll" pins the section on wide screens and scrolling draws the 13 weeks (`storyChart` and `storyGeom` in `forecast.ts`, driven from `home.ts`), with the late invoice, payroll, the hire and the warning appearing as they happen. "What Fathom does" shows six product screens built in HTML and CSS (`SCREENS` in the page), with a list that follows the screen in view. On phones and with reduced motion the story shows the finished chart.
