# Day 036 · Real estate agency landing page: “Latch & Lane”

Independent estate and letting agents in Manchester and Salford (fictional). The brief to myself: **warm and editorial, like a good property magazine**, with the speed of a modern search tool. It uses cream, ink navy and coral, with sage for calm. Headlines are **Playfair Display** with italic coral accents, and the body is **Plus Jakarta Sans**. Every property is drawn in code, and the map is a hand-built SVG, so there are no photos and no map tiles.

**Open it:** `phase-2-landing-pages/site/day-036-real-estate/index.html`

## The six signature sections

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero + search** | Buy / Rent toggle, area and bedrooms, an arched illustration and trust numbers. Search jumps to the listings with your filters applied |
| 2 | **Listings with a live map** | Nine homes (five to buy, four to rent) with filters for area, bedrooms, max price and sort. The slider changes scale between buying and renting. Price pins on a stylised map are linked both ways to the cards: hover one to highlight the other, and click a pin to select the home. Hearts save homes (`localStorage`) |
| 3 | **Affordability** | Income, deposit, monthly debts, rate and term give the most you could borrow (4.5× income less debts, capped by a 35% payment-to-net-income rule), a budget, a monthly repayment, and how many of the homes for sale you can afford. “Show me these homes” applies it as the price filter |
| 4 | **Valuation** | A postcode (validated, with a coverage check), type, bedrooms and condition produce a price range, local average days to sell and a **12-month price trend sparkline** drawn as an SVG area chart. One click turns it into a valuation booking |
| 5 | **Neighbourhood guide** | Five areas in WAI-ARIA tabs, each with average price and rent, commute time, tags, and animated score bars for schools, green space and nightlife. “See homes in …” filters the listings |
| 6 | **Book a viewing** | Choose a home (or a free valuation), a day, a time and your position (first-time buyer, selling first…). The summary shows the property illustration, and the confirmation includes a reference |

## How sections talk to each other

The page is one connected tool. The hero search, the affordability result, the area guide and the valuation all feed the same listings filter and the same booking form, so you can go from “what can I afford?” to “book this one” without re-entering anything.

## Accessibility

- Map pins are real buttons with full labels (“Victorian terrace, Chorlton, £385,000”). Hovering or focusing a pin highlights its card, and clicking one moves focus to the card.
- Buy and rent use `aria-pressed`. The result count, affordability result, valuation and area panel are live regions, and tabs follow the WAI-ARIA pattern.
- The map is decorative; all of its information is also in the cards. Errors are shown as text with `aria-invalid`.
- “Reduce motion” stops the floating card, pin drops, card entrances and bar fills.

## Notes

Latch & Lane is a fictional agency. Properties, prices and estimates are demo content, not valuations or mortgage advice. Nothing is sent.

## Photography

The hero arch uses a real photograph from Unsplash (free for commercial use, no attribution required), stored in `src/assets/day-036/` and converted to WebP at build time. I rejected several "interior" photos because they were 3D renders, not photographs. The listing cards and map keep their drawn houses because nine listings need nine matching photos, which should come from the agency's real properties.

| Use | Photo | Source |
| --- | --- | --- |
| Hero arch | Bright living room with a vaulted ceiling | https://unsplash.com/photos/QQ6xmTXXFZ8 |

### Listing photos

All nine listing cards now use real photographs from Pexels (free to use), chosen to match each property type. Pexels IDs: s1 3639504, s2 7377669, s3 32711440, s4 17987656, s5 34099360, r1 12625643, r2 4655752, r3 10628470, r4 280222. The valuation summary keeps a drawn house because it changes with the form.
