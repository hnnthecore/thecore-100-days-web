# Day 022 · Pizzeria landing page: “Forno Rosso”

A Neapolitan pizzeria in Hackney with delivery (a fictional brand). Deliberately the opposite of Day 021: a **1960s Italian poster** look with tomato red, cream, basil and mustard, tall **Anton** headlines, checkerboard borders and offset print shadows. Body text is **DM Sans**.

**Open it:** `phase-2-landing-pages/site/day-022-pizzeria/index.html`

## The six signature sections

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero** | Giant poster headline (“Pizza Napoletana in 90 sec.”), slowly spinning pizza on a wooden board with a rotating sunburst and stickers |
| 2 | **Le classiche** | Six pizza cards, each with its own illustration (built from the same layered SVG), dietary tags and **Add** buttons that fill the basket |
| 3 | **Build your own** | The centrepiece: choose Rossa/Bianca, 10″/12″/14″ and up to five toppings. Each topping drops onto the pizza, the plate resizes, the price updates and the pizza gets a name (“La Golosa”, or “L’Hawaiana Ribelle” if you add pineapple 🍍) |
| 4 | **48 hours, 90 seconds** | The dough journey as a five-step timeline with a progress bar that follows your scroll |
| 5 | **Delivery & deals** | Postcode checker with three outcomes (nearby, further, collection only) and validation, plus deal cards with a live “days left” countdown |
| 6 | **Reviews & find us** | Tilted review cards and a bold “find us” panel |

Plus a **basket drawer**: quantities, remove, subtotal, free delivery over £25 (with “add £x more” hint), a demo checkout with an animated order tracker, and the basket is saved in `localStorage` so it survives a reload.

## How the pizza works

`components/day-022/Pizza.astro` draws a pizza from layers: crust, two sauces and nine topping groups (`<g data-topping="basil">`…). Topping positions come from a **seeded golden-angle spiral**, so they look hand-scattered but are identical on every visit. The builder simply switches the `hidden` attribute on each layer. (SVG elements have no `.hidden` property, so the script sets the attribute directly: a real bug caught in testing.)

## Accessibility

- The basket is a real modal dialog: focus moves in, Tab is trapped, Esc closes, and focus returns to the basket button.
- Builder options are native radios and checkboxes, so they work with keyboard and screen readers. The 5-topping limit disables the remaining choices and explains why.
- The basket count, toast messages, pizza name and postcode result are announced through live regions.
- Spinning, dropping and sliding animations stop with “reduce motion”.

## Notes

Fictional business: prices, postcodes, reviews and orders are demo content, and nothing is really ordered.

## Photography

The hero and the dough section use real photographs from Unsplash (free for commercial use, no attribution required), stored in `src/assets/day-022/` and converted to WebP at build time. The interactive pizza builder keeps its drawn pizza, because the toppings change as you choose them.

| Use | Photo | Source |
| --- | --- | --- |
| Hero | Neapolitan margherita on a plate | https://unsplash.com/photos/x00CzBt4Dfk |
| Dough, step 1 | Baker holding a ball of dough | https://unsplash.com/photos/4yzEtTQLdL4 |
| Dough, step 2 | Hands stretching dough | https://unsplash.com/photos/_CaLXVUfD8g |
| Dough, step 3 | Pizza leaving a wood-fired oven | https://unsplash.com/photos/vHRFraV4U00 |
