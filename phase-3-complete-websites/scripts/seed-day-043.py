"""Generates the Day 043 content files: programmes and stories (Markdown), volunteer shifts (JSON). Run once: python scripts/seed-day-043.py"""
import json, os

programmes = [
 ('grow-together', 'Grow Together', 'Community growing for everyone', 'beds', 'Tuesdays and Saturdays', 'All ages', 340, 'neighbours growing food each week',
  ['What happens', 'Twice a week the farm opens its gates. You can plant, weed, harvest or simply drink tea in the sun. Every session has a grower on hand to teach, and every bed is shared.'],
  ['Who it is for', 'Anyone, whether you have grown before or have never touched a trowel. Many of our regulars first came for the company and stayed for the courgettes.'],
  ['What you take home', 'A share of whatever is ripe, a few new skills and, for many people, a new group of friends. Surplus goes to the community fridge on Wilmslow Road.']),
 ('seed-to-plate', 'Seed to Plate', 'Cooking skills with food you grew', 'kitchen', 'Thursday evenings', 'Over 16s', 1200, 'meals cooked and shared this year',
  ['What happens', 'Each Thursday a local cook leads a relaxed session in the farm kitchen, using whatever came out of the ground that week. We cook, eat together and send everyone home with a jar.'],
  ['Who it is for', 'Beginners welcome. We keep groups small, pay-what-you-can, and always cater for dietary needs.'],
  ['What you take home', 'Confidence with fresh ingredients, a handful of recipes you can afford and a seat at a table that feels like home.']),
 ('little-sprouts', 'Little Sprouts', 'A garden club for ages 4 to 11', 'kids', 'Saturday mornings', 'Ages 4 to 11', 180, 'children in the garden club',
  ['What happens', 'Mud, worms, wheelbarrows and a lot of laughing. Children plant their own beds, meet the hens, make bug hotels and eat a snack they picked themselves.'],
  ['Who it is for', 'Children aged 4 to 11, with a grown-up for the youngest. Sessions are free for families on low incomes.'],
  ['What you take home', 'Muddy knees, a pot of something growing and a child who suddenly wants to eat salad.']),
 ('green-jobs', 'Green Jobs Training', 'An 8-week course in growing and horticulture', 'greenhouse', 'Mon to Thu, 8 weeks', 'Over 18s', 46, 'trainees now working in horticulture',
  ['What happens', 'A paid, accredited course in propagation, soil, planting plans and market growing, with weekly work placements at local nurseries and landscaping firms.'],
  ['Who it is for', 'Adults looking for a change of direction or a first step into work. No experience needed. Childcare costs are covered.'],
  ['What you take home', 'A Level 2 horticulture certificate, a reference and, for 8 in 10 trainees, a job offer within three months.']),
]
os.makedirs('src/content/day-043/programmes', exist_ok=True)
for slug, title, tag, scene, when, who, n, nlabel, b1, b2, b3 in programmes:
    fm = ['---', f'title: {json.dumps(title)}', f'tagline: {json.dumps(tag)}', f'scene: "{scene}"', f'when: {json.dumps(when)}', f'who: {json.dumps(who)}',
          f'stat: {{ value: {n}, label: {json.dumps(nlabel)} }}', '---']
    body = '\n\n'.join(f'## {h}\n\n{t}' for h, t in (b1, b2, b3))
    with open(f'src/content/day-043/programmes/{slug}.md', 'w', encoding='utf8') as f:
        f.write('\n'.join(fm) + '\n\n' + body + '\n')

stories = [
 ('amina-and-the-allotment', 'Amina and the allotment', '2026-09-12', 'Rootwork team', 'Volunteers', 'Amina arrived at the farm six months ago, new to the city and not sure where to start. Today she runs the Saturday seedling table.',
  ['## A cold first Saturday', 'Amina had moved to Manchester in February and knew almost nobody. A neighbour mentioned the farm, and she turned up in the rain with the wrong shoes.', 'Somebody handed her a mug of tea and a trowel, and she has not really stopped since.', '## Finding a job to do', 'By April she had taken over the seedling table. She knows the name of every tray, which ones need more light, and which ones the slugs will go for first.', '## What she says now', 'I came for something to do. I stayed because people noticed when I was not there.']),
 ('the-1000-tomato-summer', 'The thousand-tomato summer', '2026-08-03', 'Rootwork team', 'Growing', 'A greenhouse, a heatwave and 1,043 tomatoes. How a small team and a lot of volunteers fed half a neighbourhood.',
  ['## A bumper year', 'We planted sixty tomato plants in March and hoped for the best. By August the greenhouse looked like a jungle, and the picking rota was fully booked.', '## Where they all went', 'Roughly a third went to the community fridge, a third into the Thursday cooking sessions and a third into veg boxes for families who needed them most.', '## What we learned', 'Pick early, pick often, and always make more chutney than you think you could possibly need.']),
 ('from-trainee-to-grower', 'From trainee to head grower', '2026-06-20', 'Rootwork team', 'Training', 'Dev joined the Green Jobs course after ten years in warehouses. This spring he became our first trainee to be hired as a full-time grower.',
  ['## The leap', 'Dev had never grown anything before. In week two of the course he planted a row of onions in the wrong direction. He now laughs about it.', '## Eight weeks later', 'He finished the course top of the class, did a placement at a local nursery and was offered a job there. He turned it down to come back to Rootwork.', '## What is next', 'He is training the next cohort and has a plan to double our winter salad crop. We believe him.']),
]
os.makedirs('src/content/day-043/stories', exist_ok=True)
for slug, title, date, author, cat, excerpt, body in stories:
    fm = ['---', f'title: {json.dumps(title)}', f'date: "{date}"', f'author: {json.dumps(author)}', f'category: "{cat}"', f'excerpt: {json.dumps(excerpt)}', '---']
    with open(f'src/content/day-043/stories/{slug}.md', 'w', encoding='utf8') as f:
        f.write('\n'.join(fm) + '\n\n' + '\n\n'.join(body) + '\n')

shifts = [
 ('2026-10-10', '10:00', 'Autumn bed clearing', 'Growing', 14, 9, 'Main field'),
 ('2026-10-13', '10:00', 'Apple pressing day', 'Events', 20, 17, 'Orchard'),
 ('2026-10-17', '09:30', 'Planting garlic', 'Growing', 12, 5, 'Bed row C'),
 ('2026-10-22', '18:00', 'Cook the harvest', 'Cooking', 10, 8, 'Farm kitchen'),
 ('2026-10-24', '10:00', 'Build the new compost bays', 'Building', 8, 3, 'Yard'),
 ('2026-10-31', '11:00', 'Pumpkin patch and bonfire prep', 'Events', 25, 14, 'Orchard'),
 ('2026-11-07', '10:00', 'Greenhouse tidy and repairs', 'Building', 8, 2, 'Greenhouse'),
 ('2026-11-14', '09:30', 'Winter salad planting', 'Growing', 12, 6, 'Polytunnel'),
]
os.makedirs('src/content/day-043/shifts', exist_ok=True)
for i, (date, time, title, kind, spots, taken, where) in enumerate(shifts):
    with open(f'src/content/day-043/shifts/{date}-{i}.json', 'w', encoding='utf8') as f:
        json.dump({'date': date, 'time': time, 'title': title, 'kind': kind, 'spots': spots, 'taken': taken, 'where': where}, f, indent=2)
print(len(os.listdir('src/content/day-043/programmes')), len(os.listdir('src/content/day-043/stories')), len(os.listdir('src/content/day-043/shifts')))
