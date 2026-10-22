# Day 046 · Complete website: “Wildcombe Herbal”

An online herb shop (a template for the client's e-commerce work), as a **33-page website**: home, the shop, five collections, fourteen products, a basket drawer and basket page, a three-part checkout, a tea club, a journal, about, shipping and returns, questions and contact.

**Open it:** `phase-3-complete-websites/site/day-046-herbal-shop/index.html`

Read `DESIGN.md` first: it is the brief this site is built from.

## The idea

A herb farm's catalogue becomes a herbarium. Every product is a pressed botanical plate (Köhler's *Medizinal-Pflanzen*, 1887, and other public-domain herbals) printed onto its herb's own colour: chamomile yellow, peppermint teal, calendula marigold. There is no sage green and no cream. The home page opens with a **pinned poster**: the brand name holds its place across the top while six plates pass beneath it, each with its Latin name, price and an Add button.

**The live thing:** "What do you fancy a cup of?" Pick an hour and a taste and the matching plates come forward while the rest fade. It works on the home page and the shop page and the choice lives in the URL hash, together with the kind filter.

## Pages

| Page | URL | What it does |
|------|-----|--------------|
| Home | `/` | Pinned poster, the chooser and cabinet, the farm, a brewing table, tea club, journal |
| Shop | `/shop/` | All fourteen products: filter by kind, hour and taste, sort by price or name |
| Collections ×5 | `/collections/<kind>/` | Teas, salves and balms, syrups and tinctures, bath, gifts and kits |
| Products ×14 | `/shop/<id>/` | Plate and drawn pack, size, quantity, live price, accordion of details, related plates |
| Basket | `/basket/` | Every line, quantities, promo code, totals |
| Checkout | `/checkout/` | Details, address, delivery, card (format and Luhn check) with a live summary, then a confirmation |
| Tea club | `/tea-club/` | Three plans and a short sign-up |
| Journal | `/journal/`, `/journal/<slug>/` | Four notes from the `herbJournal` collection |
| About | `/about/` | The farm, how things are made, and the credits for every plate and picture |
| Shipping, Questions, Contact | `/shipping/`, `/faq/`, `/contact/` | The practical pages |

## Things worth reading in the code

- `catalogue.ts` holds every product as plain data (no images), so the basket and the choosers can import it in the browser. `products.ts` adds the plate images for the pages.
- `cart.ts` keeps lines in localStorage and re-reads them on every call, because each page's script is bundled separately. `WILD10` takes 10% off; standard delivery is free over £35.
- `cabinet.ts` is the chooser, shared by the home and shop pages. It writes `time`, `taste` (and the shop's `cat`) to the hash without losing each other.
- `Plate.astro` prints a plate on its field with `mix-blend-mode: multiply`. `scripts/prep-plates.mjs` stretches each scan's paper to white first, so every plate sits cleanly on any colour.
- `Pack.astro` draws the pack (tin, pouch, jar, bottle or box) with its real label, as a stand-in for product photography.
- The basket drawer is rendered by `shell.ts` from storage and uses a hidden bank of small plate images, so no image URLs live in JavaScript.

## Credits

Plates: Wikimedia Commons, public domain (list on the About page and in `src/assets/day-046-plates/credits.json`). Photographs: Pexels (list on the About page and in `src/assets/day-046-photos/credits.json`). The logo is a herbarium specimen tag with a pressed sprig (`scripts/make-brand.mjs`).

## Product photography

Real photographs of the products are needed before launch. The drawn packs in `Pack.astro` use the final label design, so swapping photographs in later changes nothing else on the page.
