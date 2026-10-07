# Day 032 · Cleaning company landing page: “Lemon & Linen”

A home and office cleaning company across Yorkshire and Greater Manchester (fictional). The brief to myself: **make cleaning feel like a treat, not a chore**. It uses foam white, mint, lemon and deep teal, with big rounded shapes, soap bubbles drifting up behind the hero and sticker-style highlights. **Outfit** is the only typeface, in heavy weights for headlines.

**Open it:** `phase-2-landing-pages/site/day-032-cleaning/index.html`

## The six signature sections

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero + instant quote** | Postcode, bedrooms, bathrooms, type of clean and frequency give a live price, the number of cleaners and the time needed, plus what you'd save by going weekly. The postcode is checked for UK format **and** whether we cover it (Leeds, Bradford, York, Manchester and so on) |
| 2 | **Services & extras** | Six services, then toggle chips for six extras (oven, fridge, windows…) that feed back into the quote above |
| 3 | **Room by room** | Kitchen / bathroom / bedrooms / living tabs with a checklist that ticks in. A switch adds the deep-clean extras highlighted in yellow, and the time estimate scales with your home size |
| 4 | **Book a clean** | Fourteen days, four time slots a day with realistic availability, and a short details form. A live summary shows the service, team, repeat schedule, extras and price, then a confirmation with a reference |
| 5 | **Team & guarantee** | Count-up stats, four cleaner profiles and four promises (vetted, insured, eco, 24-hour re-clean) |
| 6 | **FAQ & callback** | Six questions in a native, exclusive accordion, and a “call me back” form |

## Quote logic

Work hours come from `(bedrooms × 0.9 + bathrooms × 0.7 + 1.5) × service factor` (regular 1, deep 1.8, tenancy 2.2). A second cleaner is added above 4.5 hours of work, and the visit time is split between them. The price is hours × rate (£19, £24 or £26), with a £45 minimum, a 20%, 15% or 8% repeat discount on regular cleans only, and extras on top. Deep and tenancy cleans are one-off, so the frequency options switch off for them.

## Accessibility

- The postcode feedback, quote, add-on total and booking messages are live regions. The postcode field gets `aria-invalid` with a text message.
- Steppers, frequency, days and times are real buttons, radios and a select. Taken slots are disabled and struck through. Room tabs follow the WAI-ARIA pattern, and the FAQ uses native `<details>`.
- The “Book this clean” link refuses to jump ahead without a covered postcode, and moves focus to the field.
- “Reduce motion” stops the bubbles, tick animations and button wiggles.

## Notes

Lemon & Linen is a fictional business. Prices, people and reviews are demo content, and nothing is sent or charged.
