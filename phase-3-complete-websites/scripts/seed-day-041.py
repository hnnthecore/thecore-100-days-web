"""Generates the Day 041 content files (books as Markdown, events as JSON). Run once: python scripts/seed-day-041.py"""
import json, os

books = [
 ('the-salt-cartographer','The Salt Cartographer','Imogen Fairweather','Fiction',9.99,352,2024,'978-1-80000-001-1','Harbour & Reed',14,True,0,0,'A mapmaker walks the tidal flats of the Essex coast, redrawing the shoreline as it vanishes. Quiet, gorgeous and quietly devastating.','I finished it at 2 am and went straight back to page one.','Hana'),
 ('night-shift-at-the-lighthouse','Night Shift at the Lighthouse','Tomasz Brandt','Crime',8.99,320,2023,'978-1-80000-002-8','Greyfriars Press',9,True,1,1,'When the keeper of a remote lighthouse is found dead with the lamp still burning, a retired inspector has three days before the tide cuts the island off. A proper locked-room mystery with salt in its veins.','The best crime novel I have sold this year.','Dev'),
 ('after-the-orbit','After the Orbit','Ngozi Adeyemi-Clarke','Sci-fi & fantasy',10.99,448,2025,'978-1-80000-003-5','Nova Lantern',6,True,2,2,'Forty years after humanity left, one engineer is sent back to switch off the last station. What she finds on board is not what the records said. Big ideas, bigger heart.','A space opera that is really about home.','Priya'),
 ('a-field-guide-to-small-joys','A Field Guide to Small Joys','Mara Lindqvist','Non-fiction',14.99,264,2024,'978-1-80000-004-2','Open Door Books',20,True,3,3,'A year of noticing: frost on a gate, the first swift, the perfect cup of tea. Part nature diary, part gentle manifesto for paying attention.',None,None),
 ('the-very-patient-badger','The Very Patient Badger','Oliver Penhaligon','Children’s',7.99,40,2023,'978-1-80000-005-9','Pip & Pocket',25,False,4,4,'Badger has been waiting for his friends to finish their snack for ages. A funny, warm picture book about patience, with a spread that makes every child shriek.',None,None),
 ('what-the-river-keeps','What the River Keeps','Saoirse McAllister','Poetry & essays',11.99,128,2022,'978-1-80000-006-6','Tidewater',11,False,5,5,'Poems and short essays from a decade of living beside the River Don. Plain-spoken, precise and surprisingly funny.','Read one poem a night. Thank me later.','Hana'),
 ('seven-winters-in-york','Seven Winters in York','Alasdair Whitcombe','Fiction',9.49,400,2021,'978-1-80000-007-3','Harbour & Reed',8,False,1,3,'Seven winters, one house, five generations. A sweeping, tender family saga set behind the city walls.',None,None),
 ('the-quiet-heist','The Quiet Heist','Dolores Vance','Crime',8.49,296,2024,'978-1-80000-008-0','Greyfriars Press',13,False,3,0,'The plan is simple: steal a painting nobody will miss from a museum nobody visits. Nothing about it goes to plan. Wickedly clever and very funny.',None,None),
 ('the-glasswright-of-thorne','The Glasswright of Thorne','Eleni Vasilakis','Sci-fi & fantasy',12.99,512,2023,'978-1-80000-009-7','Nova Lantern',5,False,5,2,'In a city where every window holds a memory, one apprentice learns to blow glass that remembers back. Lush worldbuilding and an ending that lands.',None,None),
 ('how-to-fix-almost-anything','How to Fix Almost Anything','Bill Ratcliffe','Non-fiction',16.99,288,2025,'978-1-80000-010-3','Open Door Books',17,False,2,5,'A cheerful, clearly illustrated guide to mending the things in your house, from wobbly chairs to dripping taps, by a retired repair-café legend.',None,None),
 ('the-moon-and-the-marmalade-cat','The Moon and the Marmalade Cat','Fenella Okoro','Children’s',6.99,32,2022,'978-1-80000-011-0','Pip & Pocket',30,False,0,4,'A marmalade cat wants to touch the moon. A bedtime book with gorgeous night-time illustrations and a lullaby ending.',None,None),
 ('small-hours','Small Hours','Reuben Achterberg','Poetry & essays',10.49,160,2024,'978-1-80000-012-7','Tidewater',7,False,4,1,'Essays on insomnia, night buses and 3 am kitchens, by a writer who is awake when you are. Warm company for the sleepless.','Perfect for 3 am.','Dev'),
]
os.makedirs('src/content/day-041/books', exist_ok=True)
for slug, title, author, genre, price, pages, year, isbn, pub, stock, feat, palette, pattern, desc, quote, staff in books:
    fm = ['---', f'title: {json.dumps(title, ensure_ascii=False)}', f'author: {json.dumps(author, ensure_ascii=False)}', f'genre: {json.dumps(genre, ensure_ascii=False)}',
          f'price: {price}', f'pages: {pages}', f'year: {year}', f'isbn: "{isbn}"', f'publisher: {json.dumps(pub, ensure_ascii=False)}', f'stock: {stock}',
          f'featured: {"true" if feat else "false"}', f'palette: {palette}', f'pattern: {pattern}']
    if quote:
        fm += [f'staffPick: {json.dumps(quote, ensure_ascii=False)}', f'staff: "{staff}"']
    fm.append('---')
    with open(f'src/content/day-041/books/{slug}.md', 'w', encoding='utf8') as f:
        f.write('\n'.join(fm) + '\n\n' + desc + '\n')

events = [
 ('author-night-imogen-fairweather','An evening with Imogen Fairweather','2026-10-22','19:00','Author talk',5,40,31,'Imogen reads from The Salt Cartographer and talks about drawing maps of places that are disappearing. Wine and nibbles included.','Hana'),
 ('crime-book-club-october','Crime Book Club: Night Shift at the Lighthouse','2026-10-29','18:30','Book club',0,18,14,'Our friendly monthly club tackles a locked-room mystery. Come with theories. Spoilers welcome after the break.','Dev'),
 ('badger-story-time','Badger’s Story Time','2026-11-07','10:30','Kids',3,25,12,'Stories, songs and a very patient badger puppet for ages 3–7. Grown-ups get free coffee.','Priya'),
 ('zine-making-workshop','Zine-Making Workshop','2026-11-14','14:00','Workshop',12,14,9,'Fold, cut, write and print your own pocket-sized zine with local illustrator Sam Pryce. All materials provided.','Sam Pryce'),
 ('after-the-orbit-launch','Launch: After the Orbit','2026-12-03','19:00','Launch',0,60,22,'Ngozi Adeyemi-Clarke launches her new novel in conversation with sci-fi critic Jonah Weir, followed by signing and a space-themed bar.','Priya'),
 ('winter-poetry-night','Winter Poetry Night','2027-01-21','19:30','Author talk',4,35,10,'Saoirse McAllister and guests read by candlelight. Open mic slots available on the night.','Hana'),
]
os.makedirs('src/content/day-041/events', exist_ok=True)
for slug, title, date, time, kind, price, seats, taken, blurb, host in events:
    with open(f'src/content/day-041/events/{slug}.json', 'w', encoding='utf8') as f:
        json.dump({'title': title, 'date': date, 'time': time, 'kind': kind, 'price': price, 'seats': seats, 'taken': taken, 'blurb': blurb, 'host': host}, f, ensure_ascii=False, indent=2)
print(len(os.listdir('src/content/day-041/books')), len(os.listdir('src/content/day-041/events')))
