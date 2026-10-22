# Wildcombe Herbal · design.md

The brief this site is built from. Anything that contradicts it is a bug.

## The brand

**Wildcombe Herbal** grows, dries and blends herbs on a south-facing combe on the edge of Dartmoor, Devon, and sells them online: loose-leaf teas, salves and balms, syrups and tinctures, bath salts, and gift sets. A family business, first sold at the Totnes market in 2011. The shop is the template for the client's e-commerce work: catalogue, product page, basket, checkout, a tea club, a journal.

Product claims stay in the language a real UK herbal shop can use: "traditionally used", "to enjoy", never a cure. Nothing is invented that a visitor could mistake for a fact about a person (no star ratings, no sales counts).

## The idea (one sentence)

On this page, **a herb farm's catalogue**, becomes **a herbarium: every product is a pressed botanical plate on its own plant-coloured sheet, and the shop is the cabinet that holds them**.

*Competitor test:* a generic herbal shop is sage green on cream with leaf icons and white-background packshots in a grid. This one has no sage and no cream. Each herb owns a colour (chamomile yellow, peppermint teal, calendula marigold) and appears as an 1880s plate from Köhler's *Medizinal-Pflanzen* printed onto that colour. Latin names are part of the label, the way a herbarium sheet has them.

## The live thing

**What do you fancy a cup of?** Pick the hour (morning, afternoon, evening) and a taste (floral, minty, green, citrus, honeyed) and the cabinet re-sorts: matching plates come forward, the rest fade. It works on the home page and on the shop page, with the choice kept in the URL, and every plate still links to its product. Without JavaScript everything shows.

## What it is not

- Not sage green, not cream, not terracotta. Not leaf icons, hand-drawn scribbles or watercolour washes.
- Not white-background packshots in a card grid. Not star ratings or "bestseller" badges.
- No eyebrow labels, no 01 / 02 / 03, no gradients, no shadows at rest, no emoji, no monospace.

## Type

- **Fraunces** (variable, soft old-style): the brand, headings and product names; its italic for Latin names.
- **Instrument Sans**: interface, body and prices.

Steps: small 13px, body 17px, lead 21px, head 32-60px, the wordmark and the pinned title 12-16vw.

## Colour

Chrome: ink `#14110f` and paper `#f2f1ee`. Colour belongs to the herbs: each product has a field colour, and the page picks it up wherever that product is the subject (its plate, its product-page header, its button).

| Herb | Field |
| --- | --- |
| Chamomile | `#f3dd6b` |
| Nettle | `#8fc27a` |
| Lemon balm | `#d7e46b` |
| Peppermint | `#7fd1b9` |
| Lime blossom | `#e9e19a` |
| Evening blend (valerian) | `#c4bdeb` |
| Calendula | `#f5a623` |
| Comfrey | `#8db4ec` |
| Elder | `#c98bc2` |
| Echinacea | `#f48fb1` |
| Thyme | `#f6b49a` |
| Lavender | `#a994ee` |

Plates are scans on cream paper; the paper is stretched to white at build time so a plate takes on any field with `mix-blend-mode: multiply`.

## Home

1. **The pinned poster.** The brand name sits at 14vw across the top and holds its place for three screens. Beneath it the plates pass, one full-height panel for each of six herbs, each a plate on its own colour: Latin name, common name, one line, price, an Add button. The page releases into ordinary sections when the run ends.
2. **What do you fancy a cup of?** The two choosers and the cabinet of twelve plates (the live thing).
3. **From the combe.** A short, plain paragraph on where it is grown, with two photographs.
4. **How to brew.** Four steps with times and temperatures, as a table, not a card row.
5. **Tea club.** One sentence, one button.
6. **Journal.** The latest two notes.
7. **Footer.** Ink, large wordmark, shipping and returns in a line, newsletter field.

## Pages

Shop (all products, sort and filter), five collection pages (Teas, Salves and balms, Syrups and tinctures, Bath, Gifts and kits), twelve product pages (a plate on the field, a drawn pack, size choice, quantity, add to basket, ingredients, how to use, delivery), basket, checkout (details, delivery, payment, with validation), order confirmation, tea club, journal (four notes), about, shipping and returns, FAQ, contact.

## Basket and checkout

A slide-in basket (drawer) from every page, kept in localStorage, a free-delivery bar (free over £35), a promo field (`WILD10` for 10% off), standard delivery £3.95 and next-day £6.95. Checkout is three steps on one page: your details, delivery, payment. Card fields validate format but nothing is charged.

## Product imagery

Plates are public domain (Köhler's *Medizinal-Pflanzen*, 1887; Flora Batava; Curtis) and credited on the About page. Packs are drawn in SVG as placeholders for product photography; they show the real label design (name, Latin name, weight) so swapping in photographs later changes nothing else. Lifestyle photographs (the combe, drying herbs, a cup) are free-licence photographs, credited.
