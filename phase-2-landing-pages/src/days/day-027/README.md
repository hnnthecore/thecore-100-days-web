# Day 027 · Jewelry store landing page: “Maison Aurelle”

A fine-jewellery house in Hatton Garden, London (fictional). The brief to myself: **quiet luxury**, where the restraint is the luxury. It uses ivory and a near-black green, with champagne gold only where it matters, hairline borders and a lot of space. **Cormorant** is the display face, with its italics in gold as the accent, and **Jost** handles the interface. Every ring, earring, pendant and bracelet is **drawn in code**, so there isn't a single photo.

**Open it:** `phase-2-landing-pages/site/day-027-jewelry/index.html`

## The six signature sections

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero** | A gold halo ring floats over a deep green stage with twinkling sparkles. A trust row sits underneath: free insured delivery, 30-day returns, lifetime care |
| 2 | **Collection** | Eight pieces with filters (rings, earrings, necklaces, bracelets). Metal swatches on each card **redraw the piece** in yellow gold, rose gold or platinum and update the price. A heart saves pieces (kept in `localStorage`), and the header counter opens a “Saved” view |
| 3 | **Ring designer** | Choose setting (solitaire, halo, three-stone), metal, stone (diamond, sapphire, emerald, ruby), shape and carat. The ring redraws live, with an **estimated price** and a written summary. “Request this design” fills in the appointment form |
| 4 | **The 4Cs** | Four sliders (carat, cut, colour, clarity) change a diamond in real time: size in mm, sparkle, warm tint and inclusions. Each shows a plain-English explanation |
| 5 | **Atelier** | Five steps from sketch to certificate, revealing as you scroll, plus four credibility badges |
| 6 | **Private appointments** | Viewing, bespoke consultation or valuation. The date must be a future Tuesday–Saturday, and the form has validation and a confirmation message |

## Jewellery drawn in code

`days/day-027/art.ts` is a small library of functions that return SVG: `gem` (round, oval and emerald cuts, with facet lines that change with `fire`), `ring` (three settings), `earrings`, `necklace`, `bracelet` and `stoneOnly`. The same functions render the shop at build time and re-render in the browser for swatches, the designer and the 4Cs. One piece of drawing code serves the whole page.

## Pricing

The designer estimates the price from the setting, plus stone price × carat^1.7 (bigger stones cost disproportionately more, like real diamonds), shape and metal. Platinum is 8% above gold in the shop and about 10% in the designer. It's a demo model, labelled as an estimate.

## Accessibility

- Every control is a real radio, checkbox, range or button, with visible focus. Swatches use `role="radio"` with `aria-checked`, and filters and hearts use `aria-pressed`.
- Sliders in the 4Cs have `aria-valuetext` (“2.50 carats”, “grade F”), and the designer summary is a live region.
- The reveal-on-scroll only hides content when JavaScript has run, and it is off with “reduce motion”. The hero float and sparkles also stop.

## Notes

Maison Aurelle is a fictional business. Pieces, prices and certificates are demo content, and nothing is sent.

## Photography

The hero and the atelier section use real photographs from Unsplash (free for commercial use, no attribution required), stored in `src/assets/day-027/` and converted to WebP at build time. The collection grid and the ring designer keep their drawn jewellery, because they change with every option you pick.

| Use | Photo | Source |
| --- | --- | --- |
| Hero | Halo diamond ring, rose gold and white gold | https://unsplash.com/photos/Y_bxfTa_iUA |
| Atelier | Hand wearing two diamond rings | https://unsplash.com/photos/SBSeFdJouZU |
| Atelier | Rose-gold ring with a pink stone | https://unsplash.com/photos/yEJwDxAoHc0 |
| Atelier | Solitaire diamond on teal fabric | https://unsplash.com/photos/1w1FQagKes4 |
