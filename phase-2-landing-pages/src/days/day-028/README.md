# Day 028 · IT company landing page: “Stackwell”

A managed-IT provider for growing UK businesses (fictional). The brief to myself: **friendly, confident tech**, with no stock photos of padlocks and no blue-on-blue. It uses warm paper, graphite and a signal orange, with highlighter-style underlines and a bento grid, set in **Space Grotesk** with **JetBrains Mono** for anything a machine would say.

**Open it:** `phase-2-landing-pages/site/day-028-it-company/index.html`

## The six signature sections

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero + ticket console** | A dark terminal window. Pick a problem (slow laptop, locked out, email delay, new starter) and watch a ticket get triaged line by line, with a reference number and a real “fixed by 14:32” estimate |
| 2 | **Services bento** | Six cards in a bento layout: a large dark “Managed IT” card with a live device list, and a highlighted security card |
| 3 | **Plan builder** | Slide the team size (5–250), tick add-ons and toggle annual billing. You get an itemised price with volume discounts, price per person and a comparison with one in-house technician |
| 4 | **Public status board** | Six systems × 90 days of uptime bars (green, amber or red). Hover or tap a day for the detail, with an SLA strip underneath |
| 5 | **Client results** | Three clients in WAI-ARIA tabs, each with metrics that count up and a quote |
| 6 | **IT health check** | Six yes/no questions score the business live on a gauge, name the biggest gap and unlock a report request form |

## Notes on the logic

- Pricing: £32 per person per month for the core plan, plus add-ons. Volume discount is 8% from 25 people, 12% from 50 and 15% from 100; annual billing takes another 10%. Every line of the sum is shown, so the total is never a mystery.
- The status board is generated from seeded random numbers, so it looks the same on every reload. Uptime percentages are calculated from the bars.
- The health score only counts “yes” answers, and an unanswered question counts as a no. The label says “3 of 6 answered…” until the quiz is complete.

## Accessibility

- Every bar group has an `aria-label` summary (“99.82% uptime, 4 incidents”), and a screen-reader-only list names each incident.
- The console log, plan price, health score and form messages are live regions.
- Add-ons, the annual switch and the quiz answers are real checkboxes and radios with visible focus. Tabs follow the WAI-ARIA pattern.
- “Reduce motion” prints the console log at once, stops the pulse and caret, and skips the count-ups and the gauge sweep.

## Notes

Stackwell is a fictional company. Clients, prices and statistics are demo content, and nothing is sent.

## Photography

The photo band under the hero uses real photographs from Unsplash (free for commercial use, no attribution required), stored in `src/assets/day-028/` and converted to WebP at build time. I skipped photos that showed visible brand names (a drinks can, wall graphics and a poster). The ticket console, plan builder and status board stay as live interface, not photos.

| Use | Photo | Source |
| --- | --- | --- |
| Band, large | Open-plan office with people at desks | https://unsplash.com/photos/kN_kViDchA0 |
| Band, small | Quiet office floor with glass partitions | https://unsplash.com/photos/PG8NyM_Mcts |

### Layout redesign

The hero is now a left-aligned headline row with the ticket console as a full-width app window beneath it, with the problem chips and the live log side by side.

### Navigation redesign

The header is now a slim side rail on wide screens, and the sections follow a different order from the other days.
