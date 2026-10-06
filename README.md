# Thecore · 100 Days of Web Development

A growing library of reusable components, landing pages, complete websites, web applications and portfolio-grade products. Everything is built on one shared design system, so all 100 days feel like a single product family.

**Live demo:** https://hnnthecore.github.io/thecore-100-days-web/

## Repository structure

```
thecore-100-days/
├── README.md                         ← you are here: plan, conventions, progress
├── packages/
│   ├── design-system/                ← single source of truth used by every day
│   │   ├── tokens.css                   colour (OKLCH), type, space, radius, shadow, motion
│   │   ├── base.css                     modern reset, focus ring, reduced-motion, utilities
│   │   ├── components.css               buttons, hamburger, avatars, badges, skeletons
│   │   └── forms.css                    every form control, error and success state
│   ├── form-kit/                     ← FormKit: shared validation + submit engine
│   │   └── form-kit.js
│   └── showcase/                     ← demo page chrome shared by every day's showcase
│       ├── showcase.css                 header, intro, browser frames with device switching
│       └── showcase.js                  theme toggle, viewport switching (window.Thecore API)
│
├── phase-1-ui-components/            ← Days 1–20  · HTML + modern CSS + vanilla JS
│   ├── day-001-navigation-bars/
│   ├── day-002-hero-sections/
│   └── …
├── phase-2-landing-pages/            ← Days 21–40 · Astro + Tailwind v4 (mapped to our tokens)
├── phase-3-complete-websites/        ← Days 41–60 · Astro multi-page, content collections, real forms
├── phase-4-web-apps/                 ← Days 61–80 · Next.js + TypeScript + Postgres + Auth
└── phase-5-portfolio-projects/       ← Days 81–100 · Full products, AI features (Claude API)
```

Each phase folder is created when that phase starts.

### Every day folder contains

| File          | Purpose |
|---------------|---------|
| `index.html`  | Live showcase page you can open straight in a browser |
| `styles.css`  | Component styles, built on the shared tokens |
| `script.js`   | Behaviour (progressive enhancement, no dependencies in Phase 1) |
| `README.md`   | What was built, design decisions, how to reuse it |

Later phases follow each framework's own conventions (`src/`, `app/` and so on), with the same README format.

## Tech stack by phase

| Phase | Days | Stack | Why |
|-------|------|-------|-----|
| 1 · UI Components | 1–20 | Semantic HTML, modern CSS (container queries, OKLCH, `:has()`), vanilla JS | Framework-agnostic and zero-build, so any page opens with a double-click. These are the patterns we port into later phases. |
| 2 · Landing Pages | 21–40 | Astro, Tailwind CSS v4 (`@theme` = our tokens), GSAP / Motion where it adds value | Static-first output with excellent Lighthouse scores, and every page can look completely different. |
| 3 · Complete Websites | 41–60 | Astro multi-page, content collections, form actions, image optimisation | Real 4–6 page sites with working forms, SEO and performance budgets. |
| 4 · Web Applications | 61–80 | Next.js (App Router), TypeScript, Drizzle + Postgres, Better Auth / Auth.js, Zod, shadcn/ui themed with our tokens | The industry standard for full-stack React: auth, roles, CRUD, APIs. |
| 5 · Portfolio Projects | 81–100 | Turborepo monorepo, everything above, Stripe (test mode), Claude API for AI features | A few flagship products that combine all of the above. |

The stack is reviewed at the start of each phase. If something better fits, we switch.

## Quality bar (every day)

- **Responsive.** Components respond to their container as well as the viewport.
- **Accessible.** Semantic HTML, full keyboard support, correct ARIA, visible focus, `prefers-reduced-motion`.
- **Themed.** Light and dark modes driven by tokens. No hard-coded colours in components.
- **Fast.** No unnecessary dependencies, no layout shift, animations limited to `transform`, `opacity` and `clip-path`.
- **Documented.** Every day has a README explaining the decisions behind it.

## Running locally

Phase 1 pages work by opening `index.html` directly. To serve the whole repo (recommended, since some browsers restrict `file://`):

```bash
python -m http.server 5500
```

Then open `http://localhost:5500/phase-1-ui-components/day-001-navigation-bars/`.

## Naming conventions

- Day folders: `day-NNN-kebab-name` (zero-padded so they sort correctly)
- CSS: BEM-style blocks per pattern (`.aurora__bar`, `.mega__link`), with tokens prefixed by role (`--color-*`, `--space-*`)
- Commits: `day-001: add navigation bars`, `design-system: add surface-raised token`

## Progress

| Day | Project | Status |
|-----|---------|--------|
| 001 | [Navigation Bars](phase-1-ui-components/day-001-navigation-bars/) | ✅ Done |
| 002 | [Hero Sections](phase-1-ui-components/day-002-hero-sections/) | ✅ Done |
| 003 | [Footers](phase-1-ui-components/day-003-footers/) | ✅ Done |
| 004 | [Contact Forms](phase-1-ui-components/day-004-contact-forms/) | ✅ Done |
| 005 | [Login & Sign-up](phase-1-ui-components/day-005-login-signup/) | ✅ Done |
| 006 | [Pricing Sections](phase-1-ui-components/day-006-pricing/) | ✅ Done |
| 007 | [Testimonials](phase-1-ui-components/day-007-testimonials/) | ✅ Done |
| 008 | [FAQ Sections](phase-1-ui-components/day-008-faq/) | ✅ Done |
| 009 | [Galleries](phase-1-ui-components/day-009-galleries/) | ✅ Done |
| 010 | [Product Cards](phase-1-ui-components/day-010-product-cards/) | ✅ Done |
| 011 | [Dashboards](phase-1-ui-components/day-011-dashboards/) | ✅ Done |
| 012 | [Sidebars](phase-1-ui-components/day-012-sidebars/) | ✅ Done |
| 013 | [Modals](phase-1-ui-components/day-013-modals/) | ✅ Done |
| 014 | [Search Bars](phase-1-ui-components/day-014-search-bars/) | ✅ Done |
| 015 | [Tables](phase-1-ui-components/day-015-tables/) | ✅ Done |
| 016 | [Profile Pages](phase-1-ui-components/day-016-profile-pages/) | ✅ Done |
| 017 | [Notifications](phase-1-ui-components/day-017-notifications/) | ✅ Done |
| 018 | [Feature Sections](phase-1-ui-components/day-018-feature-sections/) | ✅ Done |
| 019 | [Calendars](phase-1-ui-components/day-019-calendars/) | ✅ Done |
| 020 | [Error States](phase-1-ui-components/day-020-error-states/) | ✅ Done |
| 021 | [Sol y Sal](phase-2-landing-pages/site/day-021-restaurant/) | ✅ Done |
| 022 | [Forno Rosso](phase-2-landing-pages/site/day-022-pizzeria/) | ✅ Done |
| 023 | [Northgate Motorworks](phase-2-landing-pages/site/day-023-workshop/) | ✅ Done |
| 024 | [Halden & Rowe](phase-2-landing-pages/site/day-024-construction/) | ✅ Done |
| 025 | [Pace Logistics](phase-2-landing-pages/site/day-025-transport/) | ✅ Done |
| 026 | Hair Salon | ⏳ Next |
