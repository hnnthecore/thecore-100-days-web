# Day 010 · Product Cards

The card is where browsing turns into buying. Six patterns, each with the interactions its customers expect.

| # | Cards | Best for | Highlights |
|---|-------|----------|------------|
| 01 | **Norde** shop cards | E-commerce, homeware, fashion | Hover shows a styled lifestyle photo, colour swatches swap the image and name (arrow keys work), sale price with savings, wishlist heart, quick add with an animated basket count and toast, sold-out "notify me" |
| 02 | **Forma** listing cards | Estate agents, rentals, hotels | Mini photo carousel inside each card (arrows on hover, dots, swipe), New / Open house / Price drop badges, save button, key facts |
| 03 | **Ember** menu items | Restaurants, takeaways, cafés | Vegetarian / gluten-free / spice badges; "Add" becomes a quantity stepper; order bar slides up with a live total |
| 04 | **Drive** car listings | Car dealers, big-ticket items | Cash / monthly finance toggle for every card, spec chips, compare up to 3 cars with a tray |
| 05 | **Aurum** luxury cards | Jewellery, watches, fashion | Minimal serif styling; accessible **Quick view** dialog with large image, description and ring size; "Add to bag" checks a size is chosen |
| 06 | **Nova** marketplace cards | Integrations, plugins, templates | Skeleton loading placeholders, category filter, Install → Installing → Installed ✓ (Remove on hover), ratings and install counts |

## Run it

Open `index.html` in a browser, or from the repo root:

```bash
python -m http.server 5500
```

## Notable details

- **Self-contained.** This day has its own `images/` folder (24 SVG illustrations, about 100 KB), so it can be committed and published on its own.
- **Real controls underneath.** Swatches are an ARIA radio group, compare uses real checkboxes, and ring sizes are real radio buttons. Everything works with a keyboard and a screen reader.
- **Live feedback is announced.** Basket toasts, photo changes, install progress and the number of apps shown are all spoken by screen readers.
- **Loading states.** The marketplace shows skeletons while it "loads". This keeps the layout from jumping, which is a key signal of quality and good for Core Web Vitals.
- **Simulated data.** Prices, products and installs are fictional, and nothing is sent anywhere. In later phases these cards connect to a real cart and database.
