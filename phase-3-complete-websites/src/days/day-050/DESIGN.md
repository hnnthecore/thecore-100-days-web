# Citrus & Salt · design.md

The brief this site is built from. Anything that contradicts it is a bug.

## The idea (one sentence)

On this page, **a recipe collection**, becomes **a weekly dinner planner**: the first screen is the week itself, seven slots from Monday to Sunday, and the recipes are what you drop into it. The shopping list is the result, not a separate tool.

*Competitor test:* every recipe site opens with a yellow hero, a stack of tilted photos and "Fresh, simple recipes". This one opens with the question the cook really has, "What's for dinner this week?", and answers it with a board they fill in. At the end of the week they have a plan, the total cooking time and one merged shopping list.

## The live thing

**The week board.** Seven slots. Tap a day to open a picker of all ten recipes (photo, time, a vegetarian or quick tag) and choose one. "Fill the empty days" shuffles in dinners (quick ones, 30 minutes or less, Monday to Thursday). The summary under the board counts dinners, total cooking time and the number of items. "Add the week to my shopping list" merges every ingredient into the list with duplicates combined (so "garlic cloves" from three recipes become one line). The plan is remembered on this device. Without JavaScript the board is replaced by the plain list of recipes.

## What it is not

- Not a lemon-yellow hero, offset "sticker" shadows, tilted photo collage, DM Serif headline or tomato red.
- No eyebrow labels, no 01 / 02 / 03, no hairlines, no gradients, no shadows at rest, no emoji, no monospace.
- No dietary or health claims beyond the tags already on each recipe.

## Type

- **Archivo** (extra bold, tight): headlines, day names, times.
- **Karla**: everything else.

Steps: small 13px, body 17px, lead 20px, head 32-56px, hero 48-84px.

## Colour

Sea salt, slate and a single lemon.

| Token | Value | Use |
|---|---|---|
| salt | #f5f7f8 | page |
| salt-2 | #e6ebee | surfaces |
| salt-3 | #d2dae0 | hover |
| slate | #17222c | text, footer |
| muted | #4a5966 | secondary text |
| lemon | #ffd60a | the planner highlight, today, buttons on dark |
| lemon-soft | #fff3a3 | selected states |
| zest | #7a5c00 | lemon used as text on light |
| leaf | #1f7a4d | confirmations |

## Layout

- Masthead: one plain bar, logo, Recipes, Shopping list, About, and the list counter.
- Home: the question, the week board and its summary, then a row of quick recipes, the three tools in plain words, the recipe box.
- Inner pages (recipes with live filters, ten recipe pages with scaling and cook mode, shopping list, about) keep their structure and take the new tokens.

## Brand

Mark: a lemon slice (a lemon disc in segments) on slate. Favicon is the same slice on slate.

## Motion

A recipe settles into its slot with a short fade and rise; the summary numbers update; sections rise as they arrive; Lenis smooth scroll. Everything respects prefers-reduced-motion.
