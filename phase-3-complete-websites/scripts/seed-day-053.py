"""Generates the Day 053 content: podcast shows and episodes (Markdown). Run once: python scripts/seed-day-053.py"""
import json, os

shows = [
 ('small-hours', 'Small Hours', 'Late-night conversations for people who cannot sleep', 'Society', 'Nina Okafor', 24, '#6a4cff',
  'Nina Okafor talks to one interesting person about one big question, in the quiet hours when honesty comes easier. New episodes every Tuesday.'),
 ('pocket-science', 'Pocket Science', 'Ten minutes. One big idea. No jargon.', 'Science', 'Dr Theo Marsh', 10, '#00a88f',
  'Physicist Theo Marsh explains one idea from science in ten minutes flat, using kitchen metaphors and a lot of enthusiasm. Perfect for the commute.'),
 ('the-long-way-round', 'The Long Way Round', 'Slow stories from places that are hard to reach', 'Travel', 'Isla Brennan', 38, '#ff6a1f',
  'Isla Brennan travels to remote places and records the people she meets there. Rich with sound, short on hurry.'),
 ('make-it-work', 'Make It Work', 'How small teams build things that last', 'Business', 'Dev Kapoor', 32, '#e6338a',
  'Dev Kapoor interviews founders, makers and craftspeople about the unglamorous decisions behind lasting work.'),
]
os.makedirs('src/content/day-053/shows', exist_ok=True)
for slug, title, tag, cat, host, mins, col, about in shows:
    fm = ['---', f'title: {json.dumps(title)}', f'tagline: {json.dumps(tag)}', f'category: "{cat}"', f'host: {json.dumps(host)}', f'typical: {mins}', f'colour: "{col}"', '---']
    with open(f'src/content/day-053/shows/{slug}.md', 'w', encoding='utf8') as f:
        f.write('\n'.join(fm) + '\n\n' + about + '\n')

# show, number, title, date, minutes, summary, guest, chapters[(sec,title)]
E = [
 ('small-hours', 1, 'Why we cannot stop checking', '2026-09-29', 26, 'A psychologist explains why the phone in our pocket feels like a slot machine, and what happens when we put it down.', 'Dr Ruth Anand', ['Cold open', 'The slot machine problem', 'What boredom is for', 'A week without notifications']),
 ('small-hours', 2, 'The last night shift', '2026-09-22', 23, 'A hospital porter, a baker and a bus driver on what the city looks like at 4am.', 'Three night workers', ['The porter', 'The baker', 'The driver', 'Dawn']),
 ('small-hours', 3, 'On being bad at something', '2026-09-15', 28, 'Why adults avoid beginning new things, and how to get over it with a very ordinary ukulele.', 'Mel Ashworth', ['The ukulele', 'Fear of being seen', 'Beginner joy']),
 ('small-hours', 4, 'Letters we never sent', '2026-09-08', 25, 'Listeners read out letters they wrote and never posted. Some are funny. Some are not.', 'Listeners', ['The first letter', 'To a teacher', 'To a younger self', 'To a stranger']),
 ('pocket-science', 1, 'Why the sky is not purple', '2026-10-01', 10, 'If violet scatters more than blue, why is the sky blue? A story about eyes, sunlight and a happy accident.', '', ['The puzzle', 'Scattering in a minute', 'Your eyes are the answer']),
 ('pocket-science', 2, 'The trillion-bacteria sandwich', '2026-09-24', 11, 'Your gut hosts more microbes than there are stars in the galaxy. What are they doing in there?', '', ['Meet the neighbours', 'What they eat', 'What to feed them']),
 ('pocket-science', 3, 'How a fridge makes cold', '2026-09-17', 9, 'Cold is not a thing. Here is how a fridge moves heat out of your kitchen without cheating.', '', ['Heat is the thing', 'The clever fluid', 'Why the back is warm']),
 ('pocket-science', 4, 'Why time feels faster as you age', '2026-09-10', 12, 'Summers dragged at age eight and fly by now. Neuroscience has a few ideas about why.', '', ['The puzzle', 'Novelty and memory', 'How to slow it down']),
 ('the-long-way-round', 1, 'The lighthouse at the edge of Shetland', '2026-09-27', 40, 'Isla spends a week with the last lighthouse keepers in Shetland and learns what it means to be needed.', 'The keepers', ['Arriving', 'The lamp', 'A storm', 'Leaving']),
 ('the-long-way-round', 2, 'A bakery in the Atlas mountains', '2026-09-20', 36, 'A village oven that has not gone out in 300 years, and the family that feeds it.', 'Fatima & Omar', ['The oven', 'Morning bread', 'The market']),
 ('the-long-way-round', 3, 'The last train to Ilfracombe', '2026-09-13', 38, 'A seaside branch line, a guard who knows every passenger and a town that refuses to be forgotten.', 'Guard Pete', ['All aboard', 'The guard', 'The sea']),
 ('the-long-way-round', 4, 'Sheep, snow and satellite internet', '2026-09-06', 39, 'Remote farming in the Highlands has changed more in five years than in fifty.', 'Mairi MacLeod', ['Winter', 'The dish', 'Lambing']),
 ('make-it-work', 1, 'The potter who said no to Amazon', '2026-09-30', 33, 'A small pottery turned down a giant order. Two years later, it is still here. A story about growth and enough.', 'Kate Rowley', ['The email', 'The decision', 'Enough']),
 ('make-it-work', 2, 'Two founders, one spreadsheet', '2026-09-23', 31, 'How a couple built a software company on a kitchen table and kept the marriage.', 'Sam & Jo Lin', ['The table', 'Rules for fights', 'Hiring friends']),
 ('make-it-work', 3, 'What a repair shop knows about customers', '2026-09-16', 30, 'The owner of a 40-year-old watch repair shop on loyalty, trust and the pleasure of fixing.', 'Arthur Penn', ['The bench', 'Trust', 'Apprentices']),
 ('make-it-work', 4, 'Pricing without panic', '2026-09-09', 34, 'A pricing coach on why most small businesses charge too little and how to fix it kindly.', 'Priya Desai', ['The fear', 'A simple formula', 'The awkward email']),
]
os.makedirs('src/content/day-053/episodes', exist_ok=True)
for show, n, title, date, mins, summ, guest, ch in E:
    slug = f'{show}-{n}'
    total = mins * 60
    step = total // len(ch)
    fm = ['---', f'title: {json.dumps(title)}', f'show: "{show}"', f'number: {n}', f'date: "{date}"', f'minutes: {mins}', f'summary: {json.dumps(summ)}', f'guest: {json.dumps(guest)}', 'chapters:']
    fm += [f'  - {{ t: {i * step}, title: {json.dumps(c)} }}' for i, c in enumerate(ch)]
    fm.append('---')
    body = (f'{summ}\n\n## In this episode\n\n' + '\n'.join(f'- {c}' for c in ch) +
            f'\n\n## Show notes\n\nThis is a demo episode for the Static podcast network. There is no real audio: press play to try the player, which keeps its place as you move around the site.\n\n'
            '## Transcript excerpt\n\n> "I think the real surprise was how ordinary it all felt. The big moments were small, and the small moments were big." \n\nFull transcripts are available to members.')
    with open(f'src/content/day-053/episodes/{slug}.md', 'w', encoding='utf8') as f:
        f.write('\n'.join(fm) + '\n\n' + body + '\n')
print(len(shows), len(E))
