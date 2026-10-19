# Day 041 · Complete website: “Pagebound Books”

The first **complete, multi-page website** of Phase 3: an independent bookshop on Canongate, Edinburgh (fictional). Unlike the single-page landing pages before it, this is a real site you can browse across: **18 pages** from one codebase, with a catalogue, book pages, a working basket, events with reservations, an about page and a contact page.

**Open it:** `phase-3-complete-websites/site/day-041-bookshop/index.html`

## The pages

| Page | URL | What it does |
|------|-----|--------------|
| **Home** | `/` | Hero with fanned covers, front-table picks, a bookseller's pick, the next three events and a newsletter sign-up |
| **Catalogue** | `/books/` | All 12 books with genre chips (kept in the URL hash, so a filtered view can be shared), search, sort and an “under £10” filter |
| **Book pages ×12** | `/books/<slug>/` | One page per book, generated from the `books` content collection: cover, description (rendered from Markdown), staff pick, specs, price, quantity picker, stock level and related books |
| **Basket** | `/basket/` | Edit quantities, remove items, totals, then a validated click-and-collect reservation with a pick-up date and gift-wrap option |
| **Events** | `/events/` | Six events from the `events` collection, filterable by type, with live seat bars. “Reserve a seat” opens a native `<dialog>` form |
| **About** | `/about/` | The shop's story, the booksellers, a timeline and the numbers |
| **Visit & contact** | `/contact/` | Message form, an **open-now** status read from the hours table, a map, address and an FAQ |

## What makes it a *website*

- **Content collections.** Books are Markdown files with a typed schema (genre, price, stock…), events are JSON. Add a file and a new page and catalogue card appear.
- **A shared shell.** One header, one footer and one mobile menu serve every page, with the current page marked by `aria-current`.
- **A basket that follows you.** It lives in `localStorage`, so the count in the header stays right on every page and across tabs. Add a book anywhere, see it everywhere.
- **Real forms.** Newsletter, reservation, RSVP and contact forms all share one small validation helper, with inline messages and focus moved to the first problem.
- **SEO basics.** Each page has its own title and description, and the book pages say who wrote what at what price.
- **Works anywhere.** Links are written as root paths and rewritten to relative ones after the build. The scripts are bundled so the site also works when opened straight from a folder.

## Accessibility

- Skip link on every page, a logical heading outline and breadcrumb navigation (`<ol aria-label="Breadcrumb">`) on inner pages.
- The mobile menu is a real button with `aria-expanded`, closes on Esc and on link click, and resets when the window is widened.
- The event dialog uses `showModal()`: focus is trapped, Esc closes it, and focus returns to the button that opened it.
- Basket, catalogue count and form feedback are live regions. Quantity buttons are labelled per book.
- “Reduce motion” stops card entrances, the cover lift and the menu animation.

## Notes

Pagebound Books is a fictional business. Books, authors and events are invented. The basket and reservations are demo only: nothing is sent or charged.

## Photography

The photo band under the hero uses real photographs from Pexels (free to use, no attribution required), stored in `src/assets/day-041/` and converted to WebP at build time. The book covers stay generated because they belong to fictional titles; real covers are copyrighted.

| Use | Pexels photo |
| --- | --- |
| Twelve thousand books | https://www.pexels.com/photo/34824141/ |
| Browse as long as you like | https://www.pexels.com/photo/35392073/ |
| Corners to get lost in | https://www.pexels.com/photo/28175346/ |

### Navigation redesign

The header is now a split masthead (menu left, logo centred, actions right), and the home page sections follow a different order from the other days.

### Home hero redesign

The first screen is a centred headline over a wooden shelf of standing book covers. The page opens with the bookseller's pick, then the front-table books, the photo band, upcoming events and the newsletter.

### Photographic book covers

The drawn covers are gone. Every book now has a real photograph from Pexels (free to use, no attribution required) as its cover, cropped to 2:3, with a printed-book hinge and page edge, and the title and author set on top as live text so they stay sharp and searchable. The same cover appears on the shelf, front table, bookseller's pick, catalogue, detail pages, related books and the basket (the basket embeds small versions so it works from disk). The photos are mood-matched stand-ins, not real jackets.

| Book | Pexels photo |
| --- | --- |
| the-salt-cartographer | https://www.pexels.com/photo/32731085/ |
| after-the-orbit | https://www.pexels.com/photo/30596282/ |
| a-field-guide-to-small-joys | https://www.pexels.com/photo/16846301/ |
| how-to-fix-almost-anything | https://www.pexels.com/photo/34471533/ |
| night-shift-at-the-lighthouse | https://www.pexels.com/photo/8080389/ |
| seven-winters-in-york | https://www.pexels.com/photo/35510721/ |
| small-hours | https://www.pexels.com/photo/36425215/ |
| the-glasswright-of-thorne | https://www.pexels.com/photo/19766312/ |
| the-moon-and-the-marmalade-cat | https://www.pexels.com/photo/3885950/ |
| the-quiet-heist | https://www.pexels.com/photo/31988476/ |
| the-very-patient-badger | https://www.pexels.com/photo/10830792/ |
| what-the-river-keeps | https://www.pexels.com/photo/11028729/ |

### About and Contact photography

The About page now shows a real photograph of a sunny bookshop window seat (Pexels 29509137) instead of the drawn shop. The Contact page has a real OpenStreetMap map of Canongate, Edinburgh (an embedded map, so it needs a connection; the "Open the full map" link goes to openstreetmap.org) with a small photograph of a green shop door (Pexels 15232793) and the caption "Look for the green door". The street is real, the shop is fictional.
