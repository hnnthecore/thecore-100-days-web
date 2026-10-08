# Day 031 · Hotel landing page: “The Saltmarsh”

A 24-room boutique hotel on the north Norfolk coast (fictional). The brief to myself: **calm and unhurried**, the opposite of a booking-engine page. It uses sand, sea-glass, deep teal and brass, with arched windows as the recurring shape. The headlines are **Newsreader** with italic accents, and the interface is **Figtree**. Every room and view is drawn in code, so there are no photos.

**Open it:** `phase-2-landing-pages/site/day-031-hotel/index.html`

## The six signature sections

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero + availability search** | An arched window looking out over a drifting sea. Arrival and departure dates and a guest stepper tell you straight away how many rooms are free |
| 2 | **Rooms** | Six rooms, each with its own illustration (garden, courtyard, marsh, sea, dunes). Prices **update for your exact dates and guests**: the stay total and the average night. Rooms that sleep too few, or are booked, are greyed out with the reason |
| 3 | **Rate calendar** | Three months of days coloured from green (best value) to terracotta (peak), each showing the lowest available rate. Click an arrival day and then a departure day; the search, rooms and summary all follow |
| 4 | **Plan your stay** | Dine / Spa / Explore tabs with twelve optional extras. Costs are worked out per person or per night from your dates |
| 5 | **Guest reviews** | A 4.9 rating with animated category bars, three reviews, and travel times |
| 6 | **Reserve** | Locked until a room is selected. It has a live summary (room, extras, total incl. VAT, 20% deposit), a validated guest form and a confirmation with a booking reference |

## How the pricing works

The base nightly rate is multiplied by a seasonal factor (summer +35–40%, winter −15–20%, Christmas +35%) and by +22% on Friday and Saturday nights. Availability is generated from the room and date, so it is stable between reloads. Weekends are busier. The calendar, the room cards and the summary all use the same functions, so they never disagree.

## Accessibility

- Every calendar day is a button with a full label (“Friday 16 October, from £175”). Selected days use `aria-pressed`, and the instructions are a live region.
- Dates use native date inputs, with the calendar as an optional shortcut. The guest stepper and the extras use real buttons, and the tabs follow the WAI-ARIA pattern.
- The reservation form is a disabled `fieldset` until a room is chosen, with the reason shown in text. The confirmation takes focus.
- “Reduce motion” stops the sun and wave drift and the bar-fill animation.

## Notes

The Saltmarsh is a fictional hotel. Rooms, rates, reviews and availability are demo content, and nothing is sent or charged.

## Photography

The hero window and all six room cards use real photographs from Unsplash (free for commercial use, no attribution required), stored in `src/assets/day-031/` and converted to WebP at build time. I skipped bedrooms with visible hotel names or product labels on pillows. The Sea View Suite photo is also cropped to the balcony for The Lighthouse; swap in a unique photo once the real hotel supplies them.

| Use | Photo | Source |
| --- | --- | --- |
| Dune Family Loft | Beach artwork above a headboard | https://unsplash.com/photos/kHLJmUQ6xq0 |
| Garden Nook | Bed with herringbone floor | https://unsplash.com/photos/XWgTzyymwj8 |
| Courtyard Double | Sitting room with desk | https://unsplash.com/photos/xQbmc2FnK3Y |
| Marsh View King | King bed with view to the bathroom | https://unsplash.com/photos/3OBxWoy75yw |
| Hero window, Sea View Suite, The Lighthouse | Twin beds with a sea view | https://unsplash.com/photos/uXYHodDhiG4 |
