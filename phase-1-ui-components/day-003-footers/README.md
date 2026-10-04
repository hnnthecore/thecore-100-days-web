# Day 003 · Footers

The footer is where visitors go when they're looking for something specific (hours, contact, legal) or deciding whether to trust a business. These six footers turn that moment into action. Each one pairs with a nav from Day 1 or a hero from Day 2, so together they form complete page templates.

| # | Footer | Best for | Highlights |
|---|--------|----------|------------|
| 01 | **Lumen** | SaaS / software | Newsletter with validation, four link columns that become accordions on phones, live status pill, language picker, back-to-top |
| 02 | **Halden** | Agencies, studios | Huge “Let's talk” invitation, copy-email button, two studios with live local clocks, giant wordmark whose letters lift on hover |
| 03 | **Ember** | Restaurants, cafés, bars | Opening-hours table with today highlighted, live open/closed badge, stylised map card, booking and phone buttons |
| 04 | **Orbit** | Apps, blogs, docs | Compact and calm, with a System / Light / Dark switch that really controls the page theme and follows the OS setting |
| 05 | **Sentinel** | Security, fintech, B2B | 90-day uptime chart with hover details, SOC 2 / ISO / GDPR badges, responsible-disclosure contact with PGP key |
| 06 | **Forge** | Gyms, clinics, multi-location businesses | Bold free-trial band, per-studio live open status, app download buttons, social row |

## Run it

Open `index.html` in a browser, or from the repo root:

```bash
python -m http.server 5500
```

## Notable techniques

- **Single source of truth.** Ember's open/closed badge reads the hours straight from the visible table, so updating the table updates the badge.
- **Accordions only when needed.** Link columns use native `<details>`. On wide footers they stay open and behave as plain headings. On narrow footers they become tappable accordions.
- **Real theme control.** Orbit's switch uses the shared `Thecore.setTheme()` API. It is an accessible radio group (arrow keys work) and stays in sync with the page's own theme button.
- **Live, honest details.** Restaurant hours, gym locations and studio clocks all use each business's own time zone. The copyright year updates itself.
- **Accessibility.** Each footer uses `<nav aria-label>` for its link groups, real `<address>` and `<table>` markup, social links with descriptive labels, polite announcements for form results and the copy button, and focus that follows the back-to-top jump.

## Shared-system update

`packages/showcase/showcase.js` now also exposes `Thecore.setTheme('light' | 'dark' | 'system')` and `Thecore.getThemePreference()`, and fires a `thecore:themechange` event. "System" mode follows OS changes live.
