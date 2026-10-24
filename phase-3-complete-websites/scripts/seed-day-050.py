"""Generates the Day 050 content: recipes (Markdown with structured front matter). Run once: python scripts/seed-day-050.py"""
import json, os

# slug, title, tagline, cuisine, minutes, serves, difficulty, kcal, diets, hue, ingredients[(qty, unit, name)], steps[(text, timerMinutes|0)], tip
R = [
 ('lemon-garlic-spaghetti', 'Lemon and garlic spaghetti', 'Silky, zesty and on the table in twenty minutes.', 'Italian', 20, 2, 'Easy', 540, ['Vegetarian', 'Quick'], 48,
  [(200, 'g', 'spaghetti'), (3, '', 'garlic cloves'), (1, '', 'lemon'), (40, 'g', 'parmesan'), (3, 'tbsp', 'olive oil'), (1, 'handful', 'fresh parsley')],
  [('Boil the spaghetti in well-salted water until just tender. Save a mug of the cooking water, then drain.', 10), ('Warm the olive oil over a low heat and add thinly sliced garlic. Cook gently until pale gold, about 2 minutes.', 2), ('Add the lemon zest, juice and a splash of pasta water, then toss in the spaghetti.', 0), ('Stir in the grated parmesan and parsley, adding more pasta water until glossy. Season and serve at once.', 0)],
  'Never let the garlic brown. Bitter garlic ruins the whole bowl.'),
 ('smoky-chickpea-stew', 'Smoky chickpea stew', 'A warming one-pot dinner that tastes even better tomorrow.', 'Spanish', 35, 4, 'Easy', 380, ['Vegan', 'Gluten-free', 'High-protein'], 14,
  [(2, 'tbsp', 'olive oil'), (1, '', 'onion'), (3, '', 'garlic cloves'), (2, 'tsp', 'smoked paprika'), (400, 'g', 'tinned tomatoes'), (800, 'g', 'tinned chickpeas'), (200, 'g', 'spinach')],
  [('Soften the chopped onion in the oil over a medium heat for 8 minutes.', 8), ('Add the garlic and paprika and stir for a minute until fragrant.', 1), ('Tip in the tomatoes and drained chickpeas with a splash of water. Simmer gently.', 20), ('Stir through the spinach until wilted, then season well and serve with crusty bread.', 2)],
  'Finish with a squeeze of lemon to wake all the flavours up.'),
 ('sheet-pan-harissa-chicken', 'Sheet-pan harissa chicken', 'One tray, big flavour and almost no washing up.', 'North African', 45, 4, 'Easy', 520, ['Gluten-free', 'High-protein'], 8,
  [(8, '', 'chicken thighs'), (3, 'tbsp', 'harissa paste'), (500, 'g', 'baby potatoes'), (2, '', 'red peppers'), (1, '', 'red onion'), (150, 'g', 'natural yoghurt')],
  [('Heat the oven to 220C. Mix the chicken with harissa and a pinch of salt.', 0), ('Spread the halved potatoes, chopped peppers and onion on a large tray and nestle the chicken on top.', 0), ('Roast until the chicken is crisp and cooked through and the potatoes are golden.', 35), ('Serve with the yoghurt spooned over, plus a scatter of herbs if you have them.', 0)],
  'Marinate the chicken in the morning for even more flavour.'),
 ('mushroom-miso-ramen', 'Mushroom miso ramen', 'Deep, savoury and surprisingly quick for a bowl this good.', 'Japanese', 30, 2, 'Medium', 460, ['Vegan'], 330,
  [(250, 'g', 'mushrooms'), (2, 'tbsp', 'white miso'), (1, 'tbsp', 'soy sauce'), (700, 'ml', 'vegetable stock'), (200, 'g', 'ramen noodles'), (2, '', 'spring onions'), (1, 'tsp', 'sesame oil')],
  [('Fry the sliced mushrooms in a dry pan until deeply browned, about 8 minutes.', 8), ('Add the stock and soy sauce and bring to a simmer.', 5), ('Cook the noodles separately according to the packet, then drain.', 4), ('Whisk the miso with a ladle of hot stock until smooth and stir it back in. Do not boil it.', 0), ('Divide the noodles between bowls, ladle over the broth and top with mushrooms, spring onions and sesame oil.', 0)],
  'Add miso off the heat. Boiling it dulls both flavour and goodness.'),
 ('tomato-burrata-toast', 'Burrata and tomato toast', 'Summer on a slice, no cooking required.', 'Italian', 10, 2, 'Easy', 410, ['Vegetarian', 'Quick'], 2,
  [(4, 'slices', 'sourdough'), (300, 'g', 'ripe tomatoes'), (1, '', 'burrata'), (2, 'tbsp', 'olive oil'), (1, 'handful', 'basil leaves'), (1, 'tsp', 'balsamic vinegar')],
  [('Toast the sourdough until golden and rub one side with a cut garlic clove if you like.', 3), ('Chop the tomatoes and toss with oil, balsamic and a good pinch of salt.', 0), ('Pile the tomatoes on the toast and tear the burrata over the top.', 0), ('Scatter with basil and finish with a grind of black pepper.', 0)],
  'Leave the tomatoes to sit for ten minutes. They release their sweet juices.'),
 ('coconut-red-lentil-dal', 'Coconut red lentil dal', 'Creamy, comforting and ready in half an hour.', 'Indian', 30, 4, 'Easy', 430, ['Vegan', 'Gluten-free', 'High-protein'], 36,
  [(250, 'g', 'red lentils'), (400, 'ml', 'coconut milk'), (1, '', 'onion'), (3, '', 'garlic cloves'), (2, 'tsp', 'curry powder'), (1, 'tsp', 'turmeric'), (1, '', 'lime')],
  [('Fry the chopped onion and garlic in a little oil until soft.', 6), ('Stir in the curry powder and turmeric for 30 seconds.', 1), ('Add the rinsed lentils, coconut milk and 500ml water. Simmer, stirring often, until thick.', 20), ('Season, squeeze over the lime and serve with rice or flatbreads.', 0)],
  'Fry a spoon of cumin seeds in butter and pour over the top for a restaurant finish.'),
 ('crispy-salmon-rice-bowl', 'Crispy salmon rice bowl', 'Sticky, salty, sweet and wonderfully fresh.', 'Japanese', 25, 2, 'Medium', 620, ['High-protein', 'Quick'], 20,
  [(2, '', 'salmon fillets'), (200, 'g', 'sushi rice'), (2, 'tbsp', 'soy sauce'), (1, 'tbsp', 'honey'), (1, '', 'cucumber'), (1, '', 'avocado'), (1, 'tbsp', 'sesame seeds')],
  [('Rinse the rice, then cook it according to the packet and leave covered.', 15), ('Pat the salmon dry and fry skin-side down in a hot pan until the skin is crisp, then flip for 2 minutes.', 7), ('Mix the soy and honey in the pan to make a glaze and spoon it over the fish.', 1), ('Serve over the rice with sliced cucumber, avocado and sesame seeds.', 0)],
  'Press the salmon down with a spatula for the first 30 seconds for extra-flat, extra-crispy skin.'),
 ('roasted-cauliflower-tacos', 'Roasted cauliflower tacos', 'Charred, spicy and piled high with crunchy slaw.', 'Mexican', 40, 4, 'Easy', 350, ['Vegan', 'Quick'], 100,
  [(1, '', 'cauliflower'), (2, 'tbsp', 'olive oil'), (2, 'tsp', 'cumin'), (8, '', 'small corn tortillas'), (200, 'g', 'red cabbage'), (2, '', 'limes'), (1, 'handful', 'coriander')],
  [('Heat the oven to 220C. Toss cauliflower florets with oil, cumin and salt, then roast until charred at the edges.', 30), ('Shred the cabbage and toss with the juice of one lime and a pinch of salt.', 0), ('Warm the tortillas in a dry pan for 20 seconds on each side.', 2), ('Fill with cauliflower and slaw and finish with coriander and lime wedges.', 0)],
  'A spoon of tahini thinned with lime juice makes a great drizzle.'),
 ('banana-oat-pancakes', 'Banana and oat pancakes', 'Fluffy, naturally sweet and kind to Sunday mornings.', 'Breakfast', 15, 2, 'Easy', 320, ['Vegetarian', 'Quick'], 55,
  [(2, '', 'ripe bananas'), (100, 'g', 'rolled oats'), (2, '', 'eggs'), (1, 'tsp', 'baking powder'), (100, 'ml', 'milk'), (1, 'tbsp', 'butter')],
  [('Blend the bananas, oats, eggs, baking powder and milk until smooth. Rest for 5 minutes.', 5), ('Melt a little butter in a non-stick pan over a medium heat.', 0), ('Spoon in small rounds of batter and cook until bubbles appear, then flip.', 4), ('Stack and serve with fruit, yoghurt or a drizzle of honey.', 0)],
  'Keep the pancakes small. They are easier to flip and cook more evenly.'),
 ('spiced-apple-crumble', 'Spiced apple crumble', 'The classic pudding, with a little cinnamon and a lot of crunch.', 'British', 55, 6, 'Easy', 410, ['Vegetarian'], 28,
  [(800, 'g', 'cooking apples'), (3, 'tbsp', 'sugar'), (1, 'tsp', 'cinnamon'), (150, 'g', 'plain flour'), (100, 'g', 'butter'), (75, 'g', 'rolled oats')],
  [('Heat the oven to 190C. Peel and slice the apples and toss with sugar and cinnamon in a baking dish.', 0), ('Rub the cold butter into the flour until it looks like breadcrumbs, then stir in the oats and a spoon of sugar.', 0), ('Scatter the crumble over the apples without pressing it down.', 0), ('Bake until bubbling at the edges and golden on top.', 40), ('Rest for 10 minutes, then serve with custard or ice cream.', 10)],
  'Add a handful of blackberries for colour and a gentle tartness.'),
]
os.makedirs('src/content/day-050/recipes', exist_ok=True)
for slug, title, tag, cuisine, mins, serves, diff, kcal, diets, hue, ing, steps, tip in R:
    fm = ['---', f'title: {json.dumps(title)}', f'tagline: {json.dumps(tag)}', f'cuisine: "{cuisine}"', f'minutes: {mins}', f'serves: {serves}', f'difficulty: "{diff}"', f'kcal: {kcal}', 'diets:'] + [f'  - "{d}"' for d in diets] + [f'hue: {hue}', 'ingredients:']
    for q, u, n in ing:
        fm.append(f'  - {{ q: {q}, u: {json.dumps(u)}, n: {json.dumps(n)} }}')
    fm.append('steps:')
    for t, m in steps:
        fm.append(f'  - {{ t: {json.dumps(t)}, m: {m} }}')
    fm.append(f'tip: {json.dumps(tip)}')
    fm.append('---')
    body = f'{tagline if False else tag} This recipe serves {serves} and takes about {mins} minutes from start to finish.'
    with open(f'src/content/day-050/recipes/{slug}.md', 'w', encoding='utf8') as f:
        f.write('\n'.join(fm) + '\n\n' + body + '\n')
print(len(R))
