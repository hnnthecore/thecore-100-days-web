# Day 038 · Coffee roastery landing page: “Ember & Oak Coffee Roasters”

A small-batch speciality roaster with a café, in Sheffield (fictional). The brief to myself: **make people want to brew, not just buy**. It uses espresso brown, cream, oat and one burnt orange, with a wide, confident display face (**Syne**) over a friendly body font (**Figtree**). The coffee bags and the beans are drawn in code, and the beans darken as you slide the roast.

**Open it:** `phase-2-landing-pages/site/day-038-coffee-roastery/index.html`

## The six signature sections

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero + roast dial** | Slide from Light to Dark. The beans change colour, tasting notes change, and acidity and body meters move. “Show me coffees like this” filters the shop. A line tells you if we roast today or when the next roast is |
| 2 | **Beans & bag** | Six coffees with roast and brew-method filters, flavour bars, a size and grind picker per coffee, live prices (250 g or 1 kg), and a real **slide-in bag** with line items, removal, a free-delivery progress bar over £25 and a total |
| 3 | **Brew guide with live timer** | V60, AeroPress, French press, espresso and Moka pot. Set your dose and it calculates the water, ratio and temperature (and the pour targets inside the steps). A **ring timer** runs the recipe, highlights the current step, and pause / resume / reset all work |
| 4 | **Taste quiz** | Three questions (how you brew, your mood, milk or black) are scored against each coffee's flavour profile and brewing suitability. The result is a **radar chart** of five flavour axes and an add-to-bag button |
| 5 | **Subscription** | Pick a coffee, size, grind and frequency for a per-delivery price with 10% off and free delivery. It shows yearly savings and the next four delivery dates (always roast days), which you can skip |
| 6 | **Visit & wholesale** | Open-now status from the hours table, and a wholesale form where a cups-per-day slider tells you roughly how many kilograms of coffee a week that means |

## Details worth knowing

- The bag drawer is a modal: it traps Tab, closes with Esc or a click on the backdrop, locks page scrolling and returns focus to the bag button.
- The timer announces each new step through a visually hidden live region, so a screen-reader user can brew with their eyes closed.
- Open-now and today's row are calculated from the visible hours table, so the table and the status can never disagree.

## Accessibility

- The roast dial is a labelled range with `aria-valuetext` (“Dark”). Filters use `aria-pressed`; the brew tabs follow the WAI-ARIA pattern.
- The quiz uses real radio groups, and the result, bag total, subscription price and timer step are live regions.
- “Reduce motion” stops card entrances, drawer slide, the ring and meter transitions, and hover lifts. The timer itself still runs.

## Notes

Ember & Oak is a fictional business. Coffees, prices and orders are demo content, and nothing is charged or sent.

## Photography

The photo band under the hero uses real photographs from Unsplash (free for commercial use, no attribution required), stored in `src/assets/day-038/` and converted to WebP at build time. The roast dial, the coffee bag illustrations, the brew timer and the quiz stay as interface because they are live and carry the fictional Ember & Oak labels.

| Use | Photo | Source |
| --- | --- | --- |
| Band, large | Scooping roasted beans from the cooling tray | https://unsplash.com/photos/YC6RVdoTtIk |
| Band | Beans in the roaster drum | https://unsplash.com/photos/_7CVm353m7A |
| Band | Hand holding roasted beans over a pan | https://unsplash.com/photos/rKYRJu0n06Y |
