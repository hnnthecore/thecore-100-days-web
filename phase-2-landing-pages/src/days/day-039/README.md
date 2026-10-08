# Day 039 · Travel company landing page: “Wayfarer Journeys”

A tailor-made holiday company for UK travellers (fictional). The brief to myself: **make planning feel like the start of the holiday**. It uses a night-sky indigo that fades into a sunset orange-to-magenta, with sand-coloured sections and illustrated destinations. Headlines are **Unbounded** (a rounded, wide display face) and the body is **DM Sans**. All eight destination scenes are drawn in code.

**Open it:** `phase-2-landing-pages/site/day-039-travel/index.html`

## The six signature sections

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero + trip matcher** | Pick what you love (beach, mountains, culture, food, wildlife), a month and a budget, and it names your top matches live |
| 2 | **Destinations & climate** | Eight places, ranked by your answers. Each card has a 12-month temperature chart with the best months shaded and your month highlighted, plus “Great in October” badges and the typical weather that month |
| 3 | **Itinerary builder** | Choose a destination, 3–14 days, pace (relaxed, balanced or packed) and the kinds of activity you want more of. You get a day-by-day plan: arrival evening, activity slots, a departure morning. Each slot has a **swap** button for a different idea. Copy the whole plan to the clipboard |
| 4 | **Price estimator** | Travellers, month, hotel class, meals and flights give a total and a per-person price, split into flights, hotels, activities and transfers as animated bars. Peak, shoulder or low season is worked out from the destination, and a 20% deposit is shown |
| 5 | **Smart packing list** | A list generated from the destination, month, trip length and style (cold-weather layers, rain gear, swimwear, temple-appropriate clothing, bug spray…), with ticking, a progress ring and memory between visits |
| 6 | **Plan with an expert** | A short enquiry form that carries your trip summary and estimate with it. Validation and a confirmation naming the expert who covers that region |

## How it fits together

Everything revolves around one trip. Choosing “Plan this trip” on a card sets the itinerary, which sets the price, the packing list and the enquiry summary. The matcher's month also flows through to the price and the weather-aware packing.

## Honest about the numbers

- Base prices are per person for 7 nights at 4★ with breakfast and flights from London. They split into flights 38%, hotel 42%, activities 12% and transfers 8%, then scale with nights, hotel class, meals, solo supplement (+50% on the room) and season (peak +12%, low −10%).
- Climate numbers are rounded averages. Visa and health notes only tell you to check official guidance, since rules change.

## Accessibility

- Vibe chips use `aria-pressed`; the match summary, itinerary, price and progress are live or labelled regions. Climate charts have text labels for each bar and a text summary of the selected month.
- Swap buttons have specific labels (“Swap this activity: …”) and keep focus after swapping.
- Packing items are real checkboxes saved per destination. Dates, selects and range sliders are native.
- “Reduce motion” stops the twinkling stars, card entrances, chips popping in and the bar transitions.

## Notes

Wayfarer is a fictional company. Destinations, prices and experts are demo content, and nothing is sent or booked.

## Photography

The eight destination cards use real photographs from Pexels (free to use, no attribution required), stored in `src/assets/day-039/` and converted to WebP at build time. I rejected a Lisbon photo that showed a drinks-brand tram. The trip matcher and itinerary builder stay as interface.

| Destination | Pexels photo |
| --- | --- |
| Lisbon | https://www.pexels.com/photo/a-street-with-tram-rails-25294225/ |
| Santorini | https://www.pexels.com/photo/28000940/ |
| Kyoto | https://www.pexels.com/photo/26946364/ |
| Banff | https://www.pexels.com/photo/16665444/ |
| Marrakech | https://www.pexels.com/photo/7808145/ |
| Bali | https://www.pexels.com/photo/34136177/ |
| Serengeti | https://www.pexels.com/photo/33650529/ |
| Reykjavik | https://www.pexels.com/photo/31291321/ |
