# Day 049 · Complete website: “Brightside Dental”

A friendly dental clinic in Leeds, as a **complete 14-page website** with a real booking flow: treatments, the team, a membership calculator, online booking and a contact page with live opening hours.

**Open it:** `phase-3-complete-websites/site/day-049-dental-clinic/index.html`

Read `DESIGN.md` first: it is the brief this site is built from.

## The idea

The home page opens with the question patients actually arrive with: **“What’s bothering you?”** Seven plain choices (my tooth hurts, I’m nervous, how much will it cost, I want a nicer smile, it’s for my child, I’m missing a tooth, I just need a check-up). Tapping one gives a short honest answer, the treatment’s price and duration, and a Book button that opens the booking flow with that treatment already chosen. The choice lives in the address (`#nervous`). White page, ink-blue type, pale blue surfaces and one gum pink; **Sora** for headlines, **Figtree** for text.

## The pages

| Page | URL | What it does |
|------|-----|--------------|
| **Home** | `/` | The worry chooser, a plain price table of every treatment, a photo band, the first visit minute by minute, the team, patient words and the booking call |
| **Treatments** | `/treatments/` | Eight treatments from the `treatments` collection with live search, category filter and price sorting |
| **Treatment ×8** | `/treatments/<slug>/` | What it is, what happens, aftercare, price, duration and which dentists offer it, with a Book button that pre-selects it |
| **Our team** | `/team/` | Four clinicians from the `dentists` collection, the treatments each offers and a “Book with” link |
| **Membership** | `/membership/` | A **savings calculator**: tick the care you expect in a year and see pay-as-you-go against a £19 / month plan, with an honest verdict either way |
| **Book online** | `/book/` | Treatment → dentist → date and time → details → confirmation, with a live summary, seeded availability, and `?t=` / `?d=` links from other pages |
| **Contact** | `/contact/` | Opening hours with today highlighted and an open / closed badge, map, message form and FAQ |

## Things worth reading in the code

- `concerns.ts` is the seven worries and their answers as plain data. The home page renders every answer into the HTML (hidden) and a short script shows the chosen one, so without JavaScript nothing is lost.
- `hours.ts` holds the opening hours and `openState()`, which turns any `Date` into “Open now · until 6pm” or “Closed · opens tomorrow at 8am”.
- `book.ts` keeps one `state` object and repaints from it. A slot is disabled when no eligible dentist is free, so choosing “first available” always lands on someone real. Availability is hashed from dentist, date and time, so it looks natural but is identical on every visit.

## Photography

The hero and the photo band use real photographs from Pexels (free to use), stored in `src/assets/day-049/`. I skipped a dental photo that showed a sportswear logo on a mask. The logo (a tooth with a pink smile line) is in `scripts/make-brand.mjs`.
