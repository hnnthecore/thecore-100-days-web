# Day 050 · Complete website: “Citrus & Salt”

A recipe site for real weeknights, as a **complete 14-page website** built around tools a cook actually needs: a weekly dinner planner, scaling, cook mode, favourites and a shopping list that merges ingredients.

**Open it:** `phase-3-complete-websites/site/day-050-recipes/index.html`

Read `DESIGN.md` first: it is the brief this site is built from.

## The idea

The home page is a **week board**: seven slots, Monday to Sunday. Tap a day to choose a dinner from all ten recipes, or press “Fill the empty days” to shuffle in quick dinners (30 minutes or less, Monday to Thursday). The summary shows the number of dinners, the total cooking time and how many things you need to buy, and one button merges every ingredient of the week into the shopping list. New visitors start with a sample week they can change; the plan is kept on this device. Sea salt, slate and a single lemon; **Archivo** for headlines, **Karla** for text.

## The pages

| Page | URL | What it does |
|------|-----|--------------|
| **Home** | `/` | The week board, quick recipes, the three tools in plain words and the recipe box |
| **Recipes** | `/recipes/` | Ten recipes from the `recipes` collection with live search (including ingredients), multi-select diet filters, a **time slider**, favourites-only, sorting and `#Vegan` style deep links |
| **Recipe ×10** | `/recipes/<slug>/` | **Servings stepper** that scales every amount to kitchen fractions, **metric / US units**, tick what you already have and add the rest to your list, **cook mode** and print |
| **Cook mode** | (dialog) | A full-screen, one-step-at-a-time view with large type, a progress bar, arrow-key navigation and a **countdown timer** on steps that need one |
| **Shopping list** | `/shopping-list/` | Items from any recipe or the whole week, with duplicates merged (“3 + 3 garlic cloves” becomes 6), tick off, remove, add your own, copy as text |
| **About** | `/about/` | How the tools work and a recipe-suggestion form |

## Things worth reading in the code

- `week.ts` is the planner: the plan in `localStorage` (re-read on every call), `shuffle()`, `totals()` and `seed()` for the first-visit sample week.
- `kitchen.ts` holds the maths (`pretty()` turns 0.75 into ¾, `amount()` scales and converts) and the storage for the list and favourites. `list.add()` merges items with the same name and unit, which is what makes “add the week” work.
- The planner's slots are filled by script, so a hidden bank of recipe photographs (`data-bank`) lets it reuse the optimised images instead of putting URLs in JavaScript.
- Ingredients and steps are structured front matter (`q`, `u`, `n` and `t`, `m`), so the same data drives the page, the scaler, the timers, the planner totals and the list.
- Cook mode is a native `<dialog>` opened with `showModal()`, so focus handling and Esc come for free.

## Photography

Every recipe uses a real photograph from Pexels (free to use), mapped in `days/day-050/photos.ts`. The logo (a lemon slice) is in `scripts/make-brand.mjs`.
