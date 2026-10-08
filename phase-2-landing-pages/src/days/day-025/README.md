# Day 025 · Transport company landing page: “Pace Logistics”

A UK road-freight and distribution company (fictional). The brief to myself: make it feel like a **logistics-tech platform**, not a haulier's brochure. It uses crisp paper white, deep navy, electric blue and a lime “signal” colour. Type is **Manrope** for the interface and **JetBrains Mono** for tracking codes and data.

**Open it:** `phase-2-landing-pages/site/day-025-transport/index.html`

## The six signature sections

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero + live tracking** | A live count of trucks on the road and the number of deliveries made today. A tracking card validates `PCE-123-456` numbers and shows status, ETA, an animated truck on the route bar and a timeline of scans. The same number always returns the same journey |
| 2 | **Services** | Six service cards: pallets, full loads, same-day, warehousing, temperature-controlled, EU & ports |
| 3 | **Instant quote** | Choose collection and delivery hubs (with a swap button), the number of pallets (1–26) and the weight. Four speeds are compared side by side, each with a price, an ETA and the CO₂ for that shipment. Same-day is offered only for up to 2 pallets and 400 km. “Book this shipment” fills in the contact form |
| 4 | **Live network map** | An SVG map of 12 hubs and 15 trunk routes, with freight animated along the routes. Hubs are buttons: choosing one lights up its routes and updates the hub card |
| 5 | **Sustainability** | A CO₂ count-up, the fleet's energy-mix bars and a roadmap to net-zero |
| 6 | **Ship with us / Careers** | Tabs switch between a callback form with validation and a list of open jobs with quick apply |

## One data file, two uses

`days/day-025/data.ts` holds the hubs, routes, curve maths and road distances. The page uses it at build time to draw the map. The script uses it in the browser for quotes and tracking. The map, the quote distances and the tracking routes therefore always agree.

## Accessibility

- Map hubs are focusable buttons (`role="button"`, `aria-pressed`) that respond to Enter and Space. The hub card is a live region.
- The quote options are native radio buttons, and options that aren't available are disabled with a reason.
- Tracking and quote results are announced via `aria-live`. An invalid tracking number explains the expected format.
- The tabs follow the WAI-ARIA pattern (arrow keys, Home and End).
- “Reduce motion” turns off the route animations, the pulse, the truck slide and the bar growth.

## Notes

Pace Logistics is a fictional business. All tracking, prices, jobs and figures are demo content, and nothing is sent.

## Photography

The photo band under the hero uses real photographs from Unsplash (free for commercial use, no attribution required), stored in `src/assets/day-025/` and converted to WebP at build time. I skipped two photos that showed real company names (a truck mudflap and a forklift).

| Use | Photo | Source |
| --- | --- | --- |
| Road | White lorry on a motorway | https://unsplash.com/photos/ZhNYKwjRMh4 |
| Warehouse | Warehouse with blue and orange racking | https://unsplash.com/photos/jcav1COVvOc |
| Delivery | Parcel being handed over | https://unsplash.com/photos/BFdSCxmqvYc |
