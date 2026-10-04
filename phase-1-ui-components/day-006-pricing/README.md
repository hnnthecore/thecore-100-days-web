# Day 006 · Pricing Sections

Pricing is where visitors decide. These six sections cover the main ways real businesses charge. Every number updates live as visitors change options, and every total is transparent.

| # | Section | Pricing model | Highlights |
|---|---------|---------------|------------|
| 01 | **Lumen** | SaaS subscription tiers | Monthly/yearly switch with real savings, hand-set prices in USD/EUR/GBP, team-size slider updating every total, free plan that steps aside for teams over 3, enterprise strip |
| 02 | **Atlas** | Feature comparison | Sticky plan header, column highlight on hover, collapsible feature groups, plain-English tooltips, one-plan-at-a-time tabs on phones |
| 03 | **Nova** | Usage-based (pay as you go) | Sliders for requests, storage and seats; tiered volume discounts; itemised estimate; cost-breakdown bar; Enterprise suggestion at high volume |
| 04 | **Forge** | Memberships + class packs | Switch between memberships and packs, 12-month commitment discount, prices shown per week and per class vs drop-in |
| 05 | **Halden** | Project packages | Choose a package plus add-ons, live total and timeline, bundle saving, optional monthly care plan, payment terms |
| 06 | **Ember** | Per-person quote | Menu choice, party size with capacity rules (Chef's Table max 12), wine pairing, 12.5% service, per-guest cost and deposit |

## Run it

Open `index.html` in a browser, or from the repo root:

```bash
python -m http.server 5500
```

## Changing the prices

Each section's prices live in a small data table at the top of its block in `script.js` (for example `PRICES`, `BANDS` or `SERVICE`). Edit those numbers and every total, label and breakdown updates automatically. No other code needs to change.

## Notable details

- **Honest maths.** Yearly prices show the billed amount, usage estimates list every line including discounts, and quotes include service charges and deposits up front.
- **Localised prices.** Each currency has its own hand-set prices rather than converted amounts like €10.87, and they are formatted the way that currency is normally written.
- **Smooth number changes.** Prices count to their new values instead of jumping, and they don't move for visitors who prefer reduced motion.
- **Accessible.**
  - Billing and plan choices are real radio buttons.
  - Price changes are announced to screen readers.
  - Tooltips work on keyboard focus as well as hover.
  - The comparison table uses proper table headers.

## Shared-system update

`packages/design-system/forms.css` gained a **switch** (on/off toggle) control, used here for the 12-month plan and the wine pairing.
