# Phase 3 · Complete websites (Days 41–60) · complete

Real, multi-page websites built with **Astro**, **content collections** and **Tailwind CSS 4**. Each day is a whole site, not a single page: several linked pages, shared navigation, typed content, working forms and per-page SEO.

## How it's organised

```
phase-3-complete-websites/
├── astro.config.mjs        static output to ./site (committed, served by GitHub Pages)
├── scripts/
│   └── relativize.mjs      post-build: relative links + bundles scripts so pages also open from disk
├── src/
│   ├── content.config.ts   typed content collections for every day
│   ├── content/day-0xx/    Markdown and JSON content (books, events, projects, articles…)
│   ├── layouts/Site.astro  document shell + "back to Thecore" badge
│   ├── components/day-0xx/ each site's header, footer and shared pieces
│   ├── days/day-0xx/       each site's styles.css, scripts and README
│   └── pages/day-0xx-name/ the site's pages (index.astro, section/index.astro, section/[slug].astro)
└── site/                   built output
```

Build with `npm run build`. Open `site/day-0xx-name/index.html`; the pages also work straight from disk because links are made relative and scripts are bundled.

## Days so far

| Day | Site | Pages | Highlights |
|-----|------|-------|------------|
| 041 | **Pagebound Books** (independent bookshop) | 18 | Catalogue and 12 book pages from a Markdown collection, a basket shared across pages through `localStorage`, click-and-collect checkout, events with a native-dialog reservation |
| 042 | **Atelier Nord** (architecture studio) | 18 | Portfolio and case studies from a collection, a journal with reading progress and a live contents list, a studio page, and a project enquiry with a live cost, fee and timeline estimator |
| 043 | **Rootwork Community Farm** (charity) | 13 | Programmes and stories from collections, a donation box (one-off or monthly, live impact, Gift Aid) on two pages, volunteer shifts with filter, live spots and a sign-up dialog, team, timeline and FAQ |
| 044 | **Fathom** (SaaS product site) | 16 | Features and customers from collections, a live what-if cash forecast, pricing with annual toggle and plan recommender, filterable changelog, two-step demo booking |
| 045 | **Lingua Lane** (language school) | 14 | Courses and teachers from collections, live course search, a six-question level test with CEFR result, live-priced enrolment with promo code and URL pre-fill, teacher bios in dialogs |
| 046 | **Solstice Sound** (music festival) | 17 | Line-up and 12 act pages from a collection, a shared "My plan" with clash warnings on the schedule, ticket builder with live total and checkout, live countdown |
| 047 | **The Meridian** (online magazine) | 21 | 12 articles from a collection with reading progress and adjustable text size, four section pages, live search with highlighting, a saved-for-later list, subscribe plans |
| 048 | **Brightside Dental** (dental clinic) | 14 | Treatments and team from collections, a step-by-step online booking flow with seeded availability, a membership savings calculator, live open / closed badge |
| 049 | **Citrus & Salt** (recipe site) | 14 | Ten recipes from a collection with a servings scaler and metric / US units, a full-screen cook mode with timers, favourites, and a shopping list that merges ingredients |
| 050 | **Hirewell** (job board) | 22 | Jobs and companies from collections, salary-slider filtering, saved-jobs comparison table, apply dialog with CV validation, post-a-job form with live preview |
| 051 | **Stillwater** (yoga studio) | 14 | Classes and teachers from collections, a bookable seven-day timetable with spots left and cancellation, a pricing estimator, a find-your-class quiz |
| 052 | **Fernlight** (plant shop) | 18 | Catalogue with filters and a price slider, product pages where size and pot change the picture and price, persistent basket with promo and free-delivery logic, validated demo checkout, plant-finder quiz |
| 053 | **Static** (podcast network) | 25 | A simulated audio player that keeps its place across pages (position computed from stored time), clickable waveform, chapters, speed, listening history and followed shows |
| 054 | **Northgate College** (college) | 17 | Course catalogue with fee slider and compare (up to three), fees and funding calculator, four-step application with word count, open-day booking with places left |
| 055 | **Hollowfield Barn** (wedding venue) | 14 | Availability calendar with seeded bookings, live quote by date, package, guests and extras, gallery lightbox, real weddings from a collection |
| 056 | **The Lantern House** (museum) | 19 | Collection browser with a pointer-driven magnifier, year-scrubbing timeline, exhibitions with live status, tour ticket calculator with family rate, object of the day |
| 057 | **Nestegg** (savings app) | 13 | Light / dark theme with no flash, flip-through phone preview, live round-ups demo, compound-interest calculator with an SVG chart and a shareable URL, guides from a collection |
| 058 | **Clearwater Trust Annual Report** (charity data story) | 10 | Scroll-driven report with counting numbers, growing bar chart, interactive donuts, a hexagon impact map with metric switching, CSV downloads, print stylesheet and a donation impact panel |
| 059 | **Ridgeway Renovations** (builders) | 14 | Before / after slider built on a range input, project gallery with a before toggle, live cost estimator with finish levels and extras, estimate carried into a three-step quote form |
| 060 | **Thecore Studio** (Phase 3 showcase, the capstone) | 25 | A portfolio of all 19 sites with palettes, typefaces and page counts read from their real stylesheets and build output, a filterable work gallery, a pattern matrix, a side-by-side compare tool and case studies that take on each site's own accent colour |

## Conventions

- Each day has its own scoped CSS layer, palette and typefaces, so no two sites look alike.
- Forms are validated in the browser with inline messages. They are demos: nothing is sent.
- Every site is accessible: skip link, landmarks, breadcrumbs, `aria-current`, keyboard-friendly menus and dialogs, and `prefers-reduced-motion`.

## Smooth scrolling
Every page loads `src/scripts/smooth.ts` (Lenis) from the layout. It is off when the visitor asks for reduced motion. Anything that scrolls by itself (dialogs, menus, drawers) gets `data-lenis-prevent` so it scrolls normally.
