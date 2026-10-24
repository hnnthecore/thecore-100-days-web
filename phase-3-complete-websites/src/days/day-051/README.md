# Day 051 · Complete website: “Hirewell”

A job board where every listing shows its salary, as a **complete 22-page website** with the tools job seekers and employers actually use: filters, saved jobs, applications and a post-a-job form.

**Open it:** `phase-3-complete-websites/site/day-051-job-board/index.html`

Read `DESIGN.md` first: it is the brief this site is built from.

## The idea

The home page is a **chart of pay**. Every salaried role is a bar from its lowest to its highest salary on one shared £ scale, so you see who pays what at a glance. A slider sets “I need at least £…” and an orange line moves across the chart: each bar is cut at the line (grey below, cobalt above), roles that cannot reach it fade, and a sentence keeps count. Category buttons filter the rows and one button reorders them (top pay or newest). The contract role is paid by the day, so it sits below the chart with the yearly equivalent worked out in words. Cobalt on cool white, ink type and one orange for the line you control; **Schibsted Grotesk** for headlines, **Public Sans** for text.

## The pages

| Page | URL | What it does |
|------|-----|--------------|
| **Home** | `/` | The pay chart with category filter, the “I need at least” line, contract roles, three promises and the five hiring companies |
| **Jobs** | `/jobs/` | Twelve roles from the `jobs` collection with live search, category, work-mode checkboxes, level chips, a **minimum-salary slider** and sorting. `?q=` and `?cat=` links pre-fill the filters |
| **Job ×12** | `/jobs/<slug>/` | Full description from Markdown, a facts panel, save, and an **apply dialog** with name, email and a CV upload validated for type (PDF / Word) and size (2 MB) |
| **Companies** | `/companies/` | Five employers from the `companies` collection, filterable by industry |
| **Company ×5** | `/companies/<slug>/` | About the company and its open roles |
| **Saved jobs** | `/saved/` | Saved roles with a **side-by-side comparison table** (best pay highlighted) and a list of roles you applied for |
| **Employers** | `/employers/` | Three plans, and a **post-a-job form with a live preview card** and running total, plus an FAQ |

## Things worth reading in the code

- The chart is drawn on the server: each bar's `left` and `width` are percentages of the pay scale (`pct()` in `index.astro`), so it works with no JavaScript. The script only moves the line, cuts each bar at it (`--cut`), fades roles that fall short, filters and sorts.
- Day rates (under £1,000) are treated as contract pay: they are left off the annual chart and shown separately with the yearly figure worked out for 250 days.
- `store.ts` makes both the saved and applied lists from one small factory and re-reads `localStorage` on every call, because each page's scripts are bundled separately.
- Applying removes the job from your saved list and flips the button to “Applied” on every page.

## Photography

The five company photographs are from Pexels (free to use), mapped in `days/day-051/photos.ts`. The logo (two pay bars with an orange tick) is in `scripts/make-brand.mjs`.
