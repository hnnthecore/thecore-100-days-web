# Day 033 · Electrician landing page: “Voltline Electrical”

Domestic and emergency electricians in the West Midlands (fictional). The brief to myself: **bold and electric, but trustworthy**. It uses ultramarine and night navy with a hit of volt yellow, a glowing bolt that flickers, and diagonal cuts between sections like a hazard sign. Type is **Sora**. The page leads with usefulness: safety advice, real prices and a real due date, before any sales talk.

**Open it:** `phase-2-landing-pages/site/day-033-electrician/index.html`

## The six signature sections

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero + engineer ETA** | Enter a postcode and it tells you which engineer is nearest and when they could arrive. It checks the format and whether we cover the area (B, CV, WS, WV, DY, ST, TF) |
| 2 | **House tour** | A cutaway house with six pulsing hotspots (kitchen, fuse board, lounge, bathroom, bedrooms and loft, garage). Each shows typical jobs with price ranges and times, and “Book this job” pre-selects the right job type |
| 3 | **Emergency triage** | Seven common symptoms, from sparks to a flickering light, each ranked **Danger / Urgent / Book soon** with numbered steps. Danger sends you to call 999, not to a booking form |
| 4 | **EV charger calculator** | Miles per month, share charged at home, car efficiency and tariff produce annual savings versus public charging, two cost bars and a payback period for a £949 install |
| 5 | **Safety certificate checker** | Landlord, homeowner or business plus the last EICR date gives a status: in date, due soon or overdue by N days. It shows the next due date, the relevant guidance and a booking shortcut |
| 6 | **Book a visit** | A job type, day and time window with realistic availability, or an emergency mode that skips scheduling. It has a postcode coverage check, a live summary and a confirmation with a job reference |

## Design decisions

- **Triage never sells first.** The most serious answers tell you to leave the building and call 999. Only urgent and non-urgent results offer booking.
- The EICR rule differs by audience (5 years for landlords and businesses, 10 recommended for homes), with wording that doesn't overstate what the law requires for homeowners.
- Prices are shown as ranges with typical time, so the number never feels like a trap. Everything says “fixed quote before we start”.

## Accessibility

- House hotspots are real buttons with full labels and `aria-pressed`, and the detail panel is a live region. Labels appear on hover, focus and selection.
- Symptoms are a real radio group, and severity is written in words, not just a coloured dot. Results and the EICR status are live regions.
- Date, range, select and checkbox controls are native. Postcode and form errors are shown in text with `aria-invalid`.
- “Reduce motion” stops the bolt flicker, the hotspot pulses, the live-dot pulse and the bar-fill transitions.

## Notes

Voltline is a fictional business. Prices, engineers and ETAs are demo content, and nothing is sent. The safety advice is general guidance; in an emergency, always call 999.

## Photography

The photo band under the hero uses real photographs from Unsplash (free for commercial use, no attribution required), stored in `src/assets/day-033/` and converted to WebP at build time. I skipped photos that showed brand logos on equipment, helmets and clothing. The bolt, house tour, triage and EV calculator stay as interface.

| Use | Photo | Source |
| --- | --- | --- |
| Band, large | Electrician fitting a wall switch | https://unsplash.com/photos/_2AlIm-F6pw |
| Band, small | Testing a consumer unit | https://unsplash.com/photos/PkHf7BUWbtk |
