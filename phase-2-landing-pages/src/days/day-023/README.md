# Day 023 · Mechanical workshop landing page: “Northgate Motorworks”

An independent car specialist in Leeds (fictional). The design goal: look as trustworthy and precise as a premium dealer, while showing the honesty dealers are often accused of lacking. **Dark, technical and restrained**: graphite surfaces, hairline borders, a single signal-orange accent, **Archivo** at a wide width for an engineered feel, and **Inter** for UI.

**Open it:** `phase-2-landing-pages/site/day-023-workshop/index.html`

## The six signature sections

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero** | A car outline that draws itself like a diagnostic scan, a scanning laser line and live callouts (front pads 2.1 mm, oil life 12%, tyres OK), plus trust stats |
| 2 | **Services** | Six services in a hairline grid with “from” prices and durations; each arrow jumps to the quote with that job pre-selected |
| 3 | **Instant quote** | A UK number-plate input that validates format and simulates a DVLA lookup, then prices the job: parts × vehicle factor, labour at the published £85/h, add-ons, VAT. MOTs are shown VAT-exempt at the legal maximum; electric cars get a cheaper service and “no clutch” |
| 4 | **Digital health check** | A realistic red/amber/green inspection report with readings, a 75/100 score ring, filters, and **Approve / Decline** per item with a running total and send-approval message |
| 5 | **Why us & reviews** | Four promises (fixed price, 12-month guarantee, free collection, keeps your warranty) and owner reviews |
| 6 | **Book** | Next 12 working days (Sundays and full days blocked), drop-off or free collection (postcode zone check), courtesy-car availability per day, UK mobile validation, and a confirmation summary. Beside it: location, hours and a live “open now” in UK time |

## Why these features

The health check with photos and approve/decline is how leading independent garages build trust today. Combined with a transparent quote engine, it answers the two biggest fears about garages: “will they overcharge me?” and “do I really need this?”.

## Consistency checks

The “from” prices on the service cards are verified against the quote engine, so no petrol, diesel or hybrid car in the demo is quoted below its card price. (An earlier version said “Interim from £149” while the engine quoted £180; that was caught in testing and fixed.)

## Accessibility

- The quote form is `inert` until a vehicle is found, so keyboard users can't tab into a form that has no price yet.
- Filters follow the tabs pattern. Approve/Decline are toggle buttons (`aria-pressed`) labelled by item name and price.
- Live regions announce the lookup result, the quote breakdown, the approved total and the open/closed status.
- The car-drawing, scan and pulse animations stop with “reduce motion”.

## Notes

Fictional business: registrations, vehicles, prices and reviews are demo data. No real lookup or booking happens.

## Photography

The hero scan panel and the "Why Northgate" section use real photographs from Unsplash (free for commercial use, no attribution required), stored in `src/assets/day-023/` and converted to WebP at build time. I did not use two photos that showed real car and oil brands.

| Use | Photo | Source |
| --- | --- | --- |
| Hero scan background and first photo | Mechanic inspecting an engine | https://unsplash.com/photos/bEGTsOCnHro |
| Tyres | Gloved hands checking a tyre | https://unsplash.com/photos/9uHal2Dd9aE |
| Hands-on work | Hand with a spanner over an engine | https://unsplash.com/photos/Fd6osyVbtG4 |

### Layout redesign

The hero now leads with the live scan as a wide banner, with the headline and booking actions in two columns underneath, so the page opens like a diagnostic screen instead of the usual text-left, picture-right split.

### Navigation redesign

The header is now a capsule menu, and the sections follow a different order from the other days.
