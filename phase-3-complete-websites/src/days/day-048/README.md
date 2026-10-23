# Day 048 · Complete website: “The Meridian”

An independent online magazine about science, culture, cities and food, as a **complete 21-page website**: a front page, twelve articles, four section pages, writers, live search, a reading list and a subscribe page.

**Open it:** `phase-3-complete-websites/site/day-048-magazine/index.html`

Read `DESIGN.md` first: it is the brief this site is built from.

## The idea

A front page set by its readers. Every story is a headline and **the size of the headline is how many people read it**: the most-read story fills the first row, the least-read is small at the foot. Section buttons (All, Science, Culture, Cities, Food) fade the others, "Most read / Newest" reorders the wall, and on desktop the cover photograph follows the pointer. The look is a cool light page, ink type and one flat colour per section (teal, violet, blue, orange) with a lime highlighter. **Bricolage Grotesque** for headlines and interface, **Newsreader** for reading.

## The pages

| Page | URL | What it does |
|------|-----|--------------|
| **Front page** | `/` | The wall of headlines sized by reads, filter and order, then a row of photo stories for each section, an about line and the Friday newsletter |
| **Article ×12** | `/articles/<slug>/` | From the `articles` collection: reading-progress bar, reading time, **text size A− / A+** (remembered), save for later, copy link, drop cap, pull quote, author box and related stories |
| **Section ×4** | `/section/<name>/` | Science, Culture, Cities and Food, sortable by newest or most read |
| **Writers** | `/authors/` | Six writers from the `authors` collection with their stories |
| **Search** | `/search/` | Live search across headlines, standfirsts and writers with highlighting, section filter and sorting. The index is embedded in the page, so it works from disk |
| **Saved** | `/saved/` | Your reading list. Removing a story updates the list immediately |
| **Subscribe** | `/subscribe/` | Free, Digital and Print plans, a monthly / yearly toggle and a sign-up form |

## Things worth reading in the code

- `pages/day-048-magazine/index.astro` computes each headline's weight from its `reads` (square-root scale between the least and most read) and hands it to CSS as `--w`; `font-size` is `calc(base + var(--w) * range)`.
- The wall's filter and order are a few lines of script; the first item after sorting gets `is-lead` and spans both columns.
- `saved.ts` keeps the reading list in `localStorage` and re-reads it on every call, because each page's scripts are bundled separately.
- `data.ts` loads and sorts the collections once, and builds the plain-JSON index that search and the Saved page use.
- `Story.astro` is the single card used on the front page, sections and related lists.

## Photography

Every story card and article header uses a real photograph from Pexels (free to use), mapped in `days/day-048/photos.ts`. Pexels IDs: 20590322, 14905028, 9800101, 7966484, 8459996, 28194254, 3709370, 36197844, 35402056, 7159882, 6213723, 19948279. The logo (a disc with a line of longitude) is in `scripts/make-brand.mjs`.
