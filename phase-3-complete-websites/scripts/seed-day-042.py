"""Generates the Day 042 content files (projects and journal articles as Markdown). Run once: python scripts/seed-day-042.py"""
import json, os

projects = [
 ('house-on-the-skerry', 'House on the Skerry', 'Isle of Skye', 'Residential', 2024, 185, 'Completed', 'Private client', 'cabin', ['Larch cladding', 'Triple glazing', 'Hebridean slate'], 'A family house that turns its back on the wind and opens its heart to the sea.',
  ['Brief', 'A retired couple wanted a home that felt sheltered in a storm and bright on the rare calm day, with room for six grandchildren.'],
  ['Approach', 'We folded the house into the slope so the roof reads as a stone. The living spaces face the water through one long window, while bedrooms sit behind thick walls on the leeward side.'],
  ['Outcome', 'The house uses 78% less energy than a typical new build, and the owners say the best moment is a winter storm from the window seat.'],
  [['78%', 'less energy than typical'], ['185 m²', 'floor area'], ['14 months', 'on site']]),
 ('ullapool-library-and-archive', 'Ullapool Library & Archive', 'Ullapool, Highland', 'Cultural', 2023, 1450, 'Completed', 'Highland Council', 'library', ['Cross-laminated timber', 'Brick', 'Birch plywood'], 'A civic library whose reading room hangs over the harbour.',
  ['Brief', 'Combine a lending library, the regional archive and a community hall on a tight harbourside site, within a modest public budget.'],
  ['Approach', 'Heavy archive rooms sit low and quiet in brick. Above them, a light timber reading room cantilevers toward the water, with a stair that doubles as an amphitheatre for talks.'],
  ['Outcome', 'Visits are up threefold, and the archive now holds 40,000 items at stable temperature without mechanical cooling.'],
  [['3×', 'more visitors'], ['40,000', 'archive items'], ['£3,400/m²', 'build cost']]),
 ('birch-court-primary-school', 'Birch Court Primary School', 'Dundee', 'Education', 2025, 3200, 'Completed', 'Dundee City Council', 'school', ['Birch plywood', 'Terrazzo', 'Green roof'], 'A school arranged around a courtyard where classrooms spill outdoors.',
  ['Brief', 'A 420-pupil school with outdoor learning at its heart, built to Passivhaus standards on a limited budget.'],
  ['Approach', 'Every classroom has its own door to a covered veranda and a garden bed. Corridors are wide enough to teach in, with deep window seats and borrowed daylight.'],
  ['Outcome', 'The school is certified Passivhaus, and teachers report calmer corridors and children who ask to stay out for lessons.'],
  [['Passivhaus', 'certified'], ['420', 'pupils'], ['100%', 'classrooms with outdoor access']]),
 ('hollow-tower', 'The Hollow Tower', 'Glasgow', 'Workplace', 2022, 6800, 'Completed', 'Meridian Property', 'tower', ['Weathering steel', 'Glass', 'Concrete frame'], 'A twelve-storey office with a garden at its core.',
  ['Brief', 'A speculative office building that could attract tenants who care about wellbeing and carbon, on a narrow city plot.'],
  ['Approach', 'We hollowed out the middle of the floor plate into a vertical garden, so every desk is within eight metres of a window and a leaf.'],
  ['Outcome', 'Fully let before completion, and rated BREEAM Outstanding.'],
  [['BREEAM', 'Outstanding'], ['12', 'storeys'], ['100%', 'let at completion']]),
 ('orchard-pavilion', 'The Orchard Pavilion', 'Perthshire', 'Cultural', 2023, 220, 'Completed', 'Glenfarg Trust', 'pavilion', ['Douglas fir', 'Polycarbonate', 'Rammed earth'], 'An open-sided pavilion for weddings, workshops and winter apple pressing.',
  ['Brief', 'A flexible shelter in an old orchard that is lovely in July and still useful in January.'],
  ['Approach', 'A broad timber roof floats on slender columns above a rammed-earth floor. Sliding screens close the sides when the weather demands it.'],
  ['Outcome', 'Booked solid from May to September, and the trust now presses 8 tonnes of apples a year under it.'],
  [['220 m²', 'covered space'], ['8 t', 'apples pressed a year'], ['40', 'events in year one']]),
 ('lanark-courtyard-houses', 'Lanark Courtyard Houses', 'Edinburgh', 'Residential', 2021, 1100, 'Completed', 'Port Housing', 'courtyard', ['Brick', 'Lime render', 'Zinc'], 'Twelve homes around a shared garden, with the feel of a village.',
  ['Brief', 'Affordable family homes at density, without losing the sense of a street where neighbours know each other.'],
  ['Approach', 'Terraced houses frame a shared courtyard with growing beds, play space and a bike barn. Every front door opens onto the garden.'],
  ['Outcome', 'A waiting list of more than 300, and a residents’ group that organises a street party every June.'],
  [['12', 'homes'], ['300+', 'on the waiting list'], ['A', 'EPC rating']]),
 ('tide-mill-studios', 'Tide Mill Studios', 'Fife', 'Workplace', 2024, 900, 'Completed', 'Mill Creative CIC', 'pavilion', ['Reused stone', 'Oak', 'Glass'], 'A derelict tide mill reborn as eleven artists’ studios.',
  ['Brief', 'Convert a listed mill into affordable workspace without erasing its character.'],
  ['Approach', 'We kept every stone we could, inserted a slim oak structure inside and added one glass-roofed street that runs the length of the mill.'],
  ['Outcome', 'All eleven studios were let before opening day, and the old waterwheel turns again.'],
  [['11', 'studios'], ['70%', 'of stone reused'], ['1', 'working waterwheel']]),
 ('harbour-sauna', 'Harbour Sauna', 'Anstruther, Fife', 'Residential', 2025, 40, 'Completed', 'Anstruther Wild Swimmers', 'cabin', ['Charred timber', 'Glass', 'Stainless steel'], 'A tiny wood-fired sauna with a big window onto the harbour.',
  ['Brief', 'A community sauna on the harbour wall for 12 people, built from local timber and using no mains power.'],
  ['Approach', 'The building is two rooms and a veranda. Charred larch resists the salt, and the big window frames the boats coming home.'],
  ['Outcome', 'Members have grown from 40 to 600 in a year, and the sauna has its own waiting list.'],
  [['600', 'members'], ['0 kWh', 'mains electricity'], ['40 m²', 'floor area']]),
]

os.makedirs('src/content/day-042/projects', exist_ok=True)
for i, (slug, title, loc, typ, year, area, status, client, kind, mats, summary, b1, b2, b3, stats) in enumerate(projects):
    fm = ['---', f'title: {json.dumps(title, ensure_ascii=False)}', f'location: {json.dumps(loc, ensure_ascii=False)}', f'type: "{typ}"', f'year: {year}', f'area: {area}',
          f'status: "{status}"', f'client: {json.dumps(client, ensure_ascii=False)}', f'kind: "{kind}"', f'variant: {i % 3}', f'featured: {"true" if i < 4 else "false"}',
          f'materials: {json.dumps(mats, ensure_ascii=False)}', f'summary: {json.dumps(summary, ensure_ascii=False)}',
          'stats:'] + [f'  - {{ value: {json.dumps(v, ensure_ascii=False)}, label: {json.dumps(l, ensure_ascii=False)} }}' for v, l in stats] + ['---']
    body = '\n\n'.join(f'## {h}\n\n{t}' for h, t in (b1, b2, b3))
    with open(f'src/content/day-042/projects/{slug}.md', 'w', encoding='utf8') as f:
        f.write('\n'.join(fm) + '\n\n' + body + '\n')

journal = [
 ('why-we-draw-by-hand-first', 'Why we still draw by hand first', '2026-09-18', 'Elin Sørensen', 'Process', 'Before any software opens, every project starts with a pencil. Here is why that slow first hour pays for itself.',
  ['## The first hour', 'On every project, the first hour is spent with tracing paper and a soft pencil. There is no model, no grid and no programme of accommodation yet, only the site and a question.', 'A pencil is slow and imprecise in a way that is useful. It forces you to decide what matters and leave out what doesn’t.', '## What the drawings are for', 'These early sketches are not meant to be beautiful. They are meant to be argued with. We pin them to the wall, walk past them for a week and notice which lines we keep redrawing.', 'Those are the lines the building is really about.', '## Then, and only then, the model', 'By the time the computer comes out, the big ideas are settled. The software’s job is to test them, not to invent them.']),
 ('building-with-timber-what-we-learned', 'Building with timber: five lessons from five projects', '2026-08-02', 'Callum Reid', 'Materials', 'Cross-laminated timber is not a magic material. It is a very good one, if you respect it. Here is what five projects taught us.',
  ['## 1. Detail for water first', 'Timber and water are an old argument. Every junction on our timber projects starts with the question: where does the rain go, and where does it dry?', '## 2. Leave some of it showing', 'Exposed structure is cheaper, calmer and healthier than boarding everything over. The smell alone sells the idea.', '## 3. Talk to the fire engineer on day one', 'Exposed timber can meet fire regulations, but only if the strategy is designed in from the start.', '## 4. Prefabricate, but not everything', 'Factory-made floors and walls save weeks on site. Details that depend on the ground should stay on site.', '## 5. Carbon is the argument, comfort is the pleasure', 'The carbon story gets timber on the shortlist. The warmth, light and quiet are why clients stay in love with it.']),
 ('designing-a-school-that-teaches-itself', 'Designing a school that teaches itself', '2026-06-21', 'Elin Sørensen', 'Education', 'Birch Court was designed around a simple idea: a building can be a teacher. This is how that idea shaped the plan.',
  ['## Corridors are classrooms', 'The corridors at Birch Court are four metres wide, with window seats and borrowed daylight. They are the school’s second classroom.', '## Every class has a garden', 'Each classroom opens to a covered veranda and a growing bed. The weather becomes part of the curriculum.', '## Listening to the children', 'We ran workshops with the pupils, who asked for three things: a place to hide, a place to be loud and a place to see the sky. All three made it into the plan.']),
 ('reusing-the-tide-mill', 'Reusing the tide mill: a conservation diary', '2026-04-09', 'Callum Reid', 'Conservation', 'Converting a listed mill is mostly about restraint. A short diary of what we kept, what we added and what we left alone.',
  ['## Week 1: stand and look', 'We spent the first week simply standing in the building. The mill had been shaped by 200 years of work, and most of that shape was worth keeping.', '## Week 6: the stone', 'A mason sorted the fallen masonry into three piles: reuse as it is, reuse recut and recycle. In the end 70% went back into the building.', '## Week 30: the wheel', 'The day the waterwheel turned again, half the village came to watch. Nobody had planned for that, and it was the best day of the project.']),
 ('what-passivhaus-actually-feels-like', 'What Passivhaus actually feels like', '2026-02-27', 'Maya Okafor', 'Sustainability', 'The standard is full of numbers, but what clients mention is something simpler: the house is quiet, even and fresh.',
  ['## Not hot, just even', 'In a Passivhaus there are no draughts and no cold spots. The temperature is the same by the window as by the sofa.', '## Fresh air, all the time', 'Mechanical ventilation brings filtered air in continuously, which means no condensation, no mould and no stuffiness.', '## The bills', 'The heating bill for a family home is typically about the cost of running a hairdryer, which is the number clients tell their friends.']),
]
os.makedirs('src/content/day-042/journal', exist_ok=True)
for slug, title, date, author, cat, excerpt, body in journal:
    fm = ['---', f'title: {json.dumps(title, ensure_ascii=False)}', f'date: "{date}"', f'author: {json.dumps(author, ensure_ascii=False)}', f'category: "{cat}"', f'excerpt: {json.dumps(excerpt, ensure_ascii=False)}', '---']
    with open(f'src/content/day-042/journal/{slug}.md', 'w', encoding='utf8') as f:
        f.write('\n'.join(fm) + '\n\n' + '\n\n'.join(body) + '\n')
print(len(os.listdir('src/content/day-042/projects')), len(os.listdir('src/content/day-042/journal')))
