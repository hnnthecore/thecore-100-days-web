# Phase 2 · Landing pages (Days 21–40)

One Astro project that builds every Phase 2 landing page. Each day is a completely different business, brand and layout, but they share one fast, accessible foundation.

| | |
|---|---|
| **Framework** | [Astro](https://astro.build): static HTML out, zero JavaScript unless a page asks for it |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) for layout, plus each day's own brand stylesheet |
| **Fonts** | Self-hosted with Fontsource (no Google Fonts requests, so no tracking and works offline) |
| **Images** | Hand-built SVG illustrations, so there are no stock-photo licences and pages stay tiny |
| **Output** | `site/`, committed to the repo, so GitHub Pages serves it with no build step or settings change |

## Folder layout

```
phase-2-landing-pages/
├── src/
│   ├── layouts/Landing.astro        ← shared <head>, fonts, skip link, “Day 0xx · Thecore” badge
│   ├── styles/global.css            ← Tailwind + base accessibility rules
│   ├── pages/day-021-restaurant/    ← the page itself (one folder per day)
│   ├── days/day-021/                ← that day's styles.css, script.ts and README
│   └── components/day-021/          ← that day's components (e.g. illustrations)
├── scripts/relativize.mjs           ← post-build: relative links, file:// friendly scripts
└── site/                            ← BUILT OUTPUT (open site/day-021-restaurant/index.html)
```

## Commands

Run these inside `phase-2-landing-pages/`:

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

`dev` gives a live-reloading preview. `build` writes the finished pages to `site/`.

## Why the post-build step?

Astro writes links like `/_astro/style.css`. Those break when the site lives in a sub-folder (as on GitHub Pages) or is opened by double-click. `scripts/relativize.mjs`:

1. Rewrites every link to a relative path (`../_astro/style.css`).
2. Adds `index.html` to folder links.
3. Turns the page script into a normal `defer` script wrapped in a private scope, because browsers refuse `type="module"` scripts on `file://` pages.

## Adding a day

1. Create `src/pages/day-0xx-name/index.astro` using the `Landing` layout.
2. Put its CSS and script in `src/days/day-0xx/`. Start the CSS with `@layer properties, theme, base, components, utilities;`, then wrap the rules in `@layer components { … }`. The first line fixes the layer order however the files load; without it, Tailwind's reset can win and shrink headings (this happened on Day 022).
3. Run `npm run build` and open `site/day-0xx-name/index.html`.
