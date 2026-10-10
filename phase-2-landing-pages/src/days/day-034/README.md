# Day 034 · Plumber landing page: “Copperline Plumbing & Heating”

A plumbing and heating firm serving Bristol and Bath (fictional). The brief to myself: **warm, practical and honest**, a trade you'd happily let into your kitchen. It uses cream, deep teal and copper (the colour of the pipe itself) with water blue as the accent, and a flowing-pipe motif in the hero. The only typeface is **Bricolage Grotesque**, in heavy weights.

**Open it:** `phase-2-landing-pages/site/day-034-plumber/index.html`

## The six signature sections

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero + today's availability** | Animated copper pipe with water flowing through it, and a live board of the next free engineer arrivals. It rolls over to tomorrow when today is full |
| 2 | **Price list & quote basket** | Plumbing / Heating / Bathrooms / Landlords tabs with 24 priced jobs. Tap **+** to build a quote. A sticky basket totals it up and carries the jobs into the booking note |
| 3 | **Boiler advisor** | Age, repairs, yearly gas bill and warning signs produce a verdict (keep, repair and plan, or replace) on a coloured meter, with reasons, estimated yearly saving and payback on a new boiler |
| 4 | **Leak calculator** | Pick a dripping tap, running toilet or leaking pipe, how long and how bad. A bucket fills in real time and tells you litres, baths-worth and the cost on your water bill |
| 5 | **Care plans** | Three plans with a monthly / annual toggle, a feature comparison and a one-click “add to my booking” |
| 6 | **Book an engineer** | A day and arrival window with realistic availability, or an **emergency** toggle that skips scheduling (60-minute response, £60 fee). Bristol / Bath postcode coverage check, live summary and a confirmation with a job reference |

## The numbers

- Boiler efficiency falls about 1.2 percentage points per year of age from 88%, and a new boiler is taken as 93%. The verdict score combines age, repairs, warning signs and an “obsolete parts” penalty. Estimated payback assumes a £2,600 replacement.
- Leak flow is about 15 litres a day for a drip, 200 for a running toilet and 500 for a leaking pipe, scaled for “slow / steady / fast”. Water and sewerage are costed at £3.80 per 1,000 litres. These are rough illustrative figures.

## Accessibility

- Price tabs follow the WAI-ARIA pattern. The “+” buttons use `aria-pressed` with a full name (“Add Boiler service to my quote”), and the basket is a live region.
- All sliders, radios and checkboxes are native and labelled, and the verdict, bucket and plan summary are live regions. The meter marker is decorative, so the verdict is also in text.
- The emergency option is a labelled checkbox and its fee is stated before you submit. Errors use text with `aria-invalid`.
- “Reduce motion” stops the pipe flow, drop, wave and bucket-fill transitions.

## Notes

Copperline is a fictional business. Prices, engineers and reviews are demo content, and nothing is sent.

## Photography

The photo band under the hero uses real photographs from Unsplash (free for commercial use, no attribution required), stored in `src/assets/day-034/` and converted to WebP at build time. I skipped a photo that showed a tool brand. The price basket, boiler advisor and leak calculator stay as interface.

| Use | Photo | Source |
| --- | --- | --- |
| Band, large | Plumber fitting a waste pipe under a sink | https://unsplash.com/photos/c314Gh8dXAo |
| Band, small | Plumber checking the trap and valves | https://unsplash.com/photos/wzIjLL4KB-4 |

### Layout redesign

The hero is now pipework: a copper pipe with joints runs down the copy, with today's slots as a narrow side card.

### Navigation redesign

The header is now a pipework bar, and the sections follow a different order from the other days.
