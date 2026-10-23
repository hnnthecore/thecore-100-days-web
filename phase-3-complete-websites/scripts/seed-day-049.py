"""Generates the Day 049 content: dental treatments and dentists (Markdown). Run once: python scripts/seed-day-049.py"""
import json, os

# slug, title, category, price, minutes, icon, summary, [what, how, aftercare]
treatments = [
 ('check-up', 'Check-up and clean', 'Everyday', 55, 30, 'tooth', 'A thorough exam, X-rays if needed and a professional polish.',
  ['A check-up is the best way to catch problems while they are small. Your dentist will look at your teeth, gums and mouth, and talk through anything they find.', 'We start with a gentle exam, take X-rays only when they are useful and finish with a polish that removes surface stains.', 'Most people need a check-up every six to twelve months. We will tell you when to come back, and send a reminder.']),
 ('hygiene', 'Hygienist visit', 'Everyday', 70, 40, 'spark', 'A deep clean that removes plaque and tartar and keeps gums healthy.',
  ['Brushing cannot reach everything. A hygienist removes the hard tartar that builds up along the gum line and teaches you how to keep it away.', 'Using gentle ultrasonic tools and a fine polish, we clean above and below the gum line. Most people find it relaxing.', 'Gums may feel tender for a day. Brush gently, use the interdental brushes we show you and book a repeat in three to six months.']),
 ('whitening', 'Teeth whitening', 'Cosmetic', 290, 60, 'sun', 'Safe, dentist-led whitening for up to eight shades brighter.',
  ['Professional whitening is safer and more effective than anything from a shop. It lifts years of tea, coffee and wine from your smile.', 'We make custom trays for you to wear at home with a medical-grade gel, plus an in-surgery boost to kick things off.', 'Avoid strongly coloured food and drink for 48 hours. Top up once or twice a year to keep your smile bright.']),
 ('aligners', 'Clear aligners', 'Cosmetic', 2400, 45, 'align', 'Near-invisible aligners to straighten teeth without wires.',
  ['Clear aligners gradually move your teeth into place using a series of removable trays. Most adults notice a difference within a few months.', 'We scan your teeth, show you a 3D preview of your final smile and order a set of trays that you swap every two weeks.', 'After treatment you will wear a retainer at night. We check your progress every six weeks along the way.']),
 ('implants', 'Dental implants', 'Restorative', 2200, 90, 'anchor', 'A permanent, natural-looking replacement for a missing tooth.',
  ['An implant replaces both the root and the crown, so it looks, feels and works like a real tooth. With care, it can last a lifetime.', 'A small titanium post is placed in the jaw under local anaesthetic. After it has healed, a custom crown is fitted on top.', 'Healing takes three to six months. You will have regular reviews, and we show you how to keep the area spotless.']),
 ('root-canal', 'Root canal treatment', 'Restorative', 420, 75, 'shield', 'Saves a badly damaged tooth and ends the pain.',
  ['A root canal has an unfair reputation. In reality it removes the painful infection inside a tooth and lets you keep it.', 'Under local anaesthetic, we clean the inside of the tooth, seal it and protect it with a filling or crown.', 'Mild tenderness for a few days is normal. Painkillers from the pharmacy are usually enough, and most people feel better immediately.']),
 ('children', 'Children’s dentistry', 'Family', 35, 25, 'smile', 'Friendly, relaxed visits that help children enjoy the dentist.',
  ['Good habits start early. Our team makes first visits fun, with stickers, stories and a very patient dentist.', 'We count teeth, show children how to brush and apply protective fissure sealants where helpful.', 'We recommend a first visit as soon as the first tooth appears, then every six months. Under-18s are free on the NHS-style plan.']),
 ('emergency', 'Emergency appointment', 'Urgent', 85, 30, 'bolt', 'Same-day help for toothache, broken teeth and swelling.',
  ['Dental pain rarely waits. We keep emergency slots free every day so that you can be seen quickly.', 'We find the cause, relieve the pain and give you a clear plan, whether that means a filling, a repair or a referral.', 'If you have facial swelling or trouble swallowing or breathing, call 999 or go to A&E straight away.']),
]
os.makedirs('src/content/day-049/treatments', exist_ok=True)
for slug, title, cat, price, mins, icon, summary, (what, how, after) in treatments:
    fm = ['---', f'title: {json.dumps(title, ensure_ascii=False)}', f'category: "{cat}"', f'price: {price}', f'minutes: {mins}', f'icon: "{icon}"', f'summary: {json.dumps(summary, ensure_ascii=False)}', '---']
    body = f'## What it is\n\n{what}\n\n## What happens\n\n{how}\n\n## Afterwards\n\n{after}'
    with open(f'src/content/day-049/treatments/{slug}.md', 'w', encoding='utf8') as f:
        f.write('\n'.join(fm) + '\n\n' + body + '\n')

dentists = [
 ('dr-anna-bell', 'Dr Anna Bell', 'Principal dentist', 'General and cosmetic dentistry', 18, '#0e7c86', ['check-up', 'whitening', 'aligners'], 'Anna founded Brightside to make the dentist a place people do not dread. She loves a good smile makeover and has a collection of vintage toothbrush holders.'),
 ('dr-sam-okafor', 'Dr Sam Okafor', 'Implant dentist', 'Implants and restorative care', 14, '#ff7a59', ['implants', 'root-canal', 'emergency'], 'Sam trained in London and Zurich and places hundreds of implants a year. Patients say he explains everything twice and never rushes.'),
 ('dr-maya-lindgren', 'Dr Maya Lindgren', 'Family dentist', 'Children and family dentistry', 9, '#7b6bd6', ['children', 'check-up', 'emergency'], 'Maya is the one children ask for by name. She uses puppets, stories and a lot of patience to turn nervous visits into giggles.'),
 ('hannah-cole', 'Hannah Cole', 'Dental hygienist', 'Gum health and prevention', 11, '#2e9e6b', ['hygiene', 'whitening'], 'Hannah believes the best dentistry is the kind you never need. She will happily explain flossing to anyone, anywhere.'),
]
os.makedirs('src/content/day-049/dentists', exist_ok=True)
for slug, name, role, special, years, colour, tr, bio in dentists:
    fm = ['---', f'name: {json.dumps(name)}', f'role: {json.dumps(role)}', f'special: {json.dumps(special)}', f'years: {years}', f'colour: "{colour}"', 'treatments:'] + [f'  - "{t}"' for t in tr] + ['---']
    with open(f'src/content/day-049/dentists/{slug}.md', 'w', encoding='utf8') as f:
        f.write('\n'.join(fm) + '\n\n' + bio + '\n')
print(len(treatments), len(dentists))
