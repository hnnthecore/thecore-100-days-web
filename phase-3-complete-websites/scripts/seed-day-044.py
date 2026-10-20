"""Generates the Day 044 content files: product features, customer stories (Markdown) and changelog releases (JSON). Run once: python scripts/seed-day-044.py"""
import json, os

features = [
 ('forecast', 'Rolling forecast', 'See 13 weeks ahead, updated every morning', 'line',
  'Fathom reads your bank, invoices and bills overnight and rebuilds a 13-week cash forecast before you have had your coffee.',
  [('What you get', 'A single line that shows your cash balance for every week ahead, with the lowest point flagged so you never get surprised by payroll again.'),
   ('How it works', 'We combine what is already in the bank with invoices due, bills scheduled and your usual patterns, then learn from how late your customers really pay rather than when they are supposed to.'),
   ('Why it matters', 'Most small businesses fail from running out of cash, not from losing money. A forecast turns a nasty surprise into a Tuesday-morning decision.')]),
 ('scenarios', 'Scenarios', 'Ask "what if" before you commit', 'branch',
  'Hire, buy equipment or lose your biggest client on paper first. Compare scenarios side by side against the baseline.',
  [('What you get', 'Duplicate your forecast, change anything and see the difference in cash, runway and lowest balance instantly.'),
   ('How it works', 'Scenarios are layers on top of your live numbers, so when reality changes the scenarios update with it. Nothing is a stale spreadsheet.'),
   ('Why it matters', 'Big decisions deserve better than a hunch. Know how a hire or a late payer changes your runway before you say yes.')]),
 ('invoices', 'Invoice chasing', 'Get paid days sooner, politely', 'mail',
  'Fathom drafts friendly reminders for overdue invoices and learns which customers respond to which tone.',
  [('What you get', 'A short list each morning of who to nudge, with a message ready to send in your voice.'),
   ('How it works', 'Reminders go out from your own email at the times your customers actually read them. Replies land in your inbox, not ours.'),
   ('Why it matters', 'Customers on Fathom are paid 9 days sooner on average, which is often the difference between a comfortable month and a stressful one.')]),
 ('alerts', 'Smart alerts', 'Hear about trouble weeks before it arrives', 'bell',
  'Set a minimum balance and Fathom warns you in Slack or email the moment the forecast dips below it.',
  [('What you get', 'Quiet, useful alerts: a forecast dip, a big invoice gone late, a bill that is higher than usual.'),
   ('How it works', 'Alerts compare today against your own history, so a pattern-breaking bill is flagged but a normal one is not.'),
   ('Why it matters', 'You find out while there is still time to act, not on the day the money runs out.')]),
 ('reports', 'Investor-ready reports', 'One click from numbers to board pack', 'chart',
  'Runway, burn, cash conversion and cash by project, in clean reports your accountant and investors already understand.',
  [('What you get', 'Monthly and quarterly packs with charts and commentary, exportable to PDF or shared by private link.'),
   ('How it works', 'Reports pull from the same live data as your forecast, so the numbers always match across the business.'),
   ('Why it matters', 'Less time building slides, more time running the company.')]),
 ('teams', 'Teams and accountants', 'Bring your bookkeeper in, safely', 'users',
  'Invite your accountant, finance lead or co-founder with the right level of access, and see who changed what.',
  [('What you get', 'Roles for owners, finance, accountants and read-only viewers, with a full audit trail.'),
   ('How it works', 'Single sign-on, two-step verification and per-forecast permissions come as standard on every paid plan.'),
   ('Why it matters', 'Your accountant sees the same live picture you do, so conversations start from facts.')]),
]
os.makedirs('src/content/day-044/features', exist_ok=True)
for i, (slug, title, tag, icon, lede, sections) in enumerate(features):
    fm = ['---', f'title: {json.dumps(title)}', f'tagline: {json.dumps(tag)}', f'icon: "{icon}"', f'order: {i}', f'lede: {json.dumps(lede)}', '---']
    body = '\n\n'.join(f'## {h}\n\n{t}' for h, t in sections)
    with open(f'src/content/day-044/features/{slug}.md', 'w', encoding='utf8') as f:
        f.write('\n'.join(fm) + '\n\n' + body + '\n')

customers = [
 ('northbound-bakery', 'Northbound Bakery', 'Food and drink', '12 staff', 'Bakery chain, Leeds', 'Rosa Whitfield', 'Owner', '#e8742c',
  'We used to find out about a cash problem when the bank told us. Now I see it three weeks away and fix it over a cuppa.',
  [('£48k', 'extra cash headroom'), ('9 days', 'faster payment from wholesale'), ('0', 'overdraft days this year')],
  [('The challenge', 'Northbound sells to cafes on 30-day terms but pays flour suppliers in 14. Rosa tracked it on a spreadsheet that only she understood and that was always a week out of date.'),
   ('What changed', 'Fathom connected to the bank and invoicing system in an afternoon. The first forecast showed a pinch point in March that nobody had seen coming, and Rosa moved a delivery of ovens to avoid it.'),
   ('The result', 'A year later, Northbound has opened two new shops without borrowing, and Rosa spends Friday afternoons baking instead of reconciling.')]),
 ('lattice-studio', 'Lattice Studio', 'Design agency', '28 staff', 'Brand and web studio, Bristol', 'Dev Malhotra', 'Finance lead', '#6a5cff',
  'Scenarios changed how we make hiring decisions. We see the runway impact before the offer goes out.',
  [('14 months', 'of runway, now visible'), ('3', 'hires planned with confidence'), ('2 hrs', 'a week saved on reporting')],
  [('The challenge', 'Project-based income made Lattice feel unpredictable. Good months and quiet months made planning headcount feel like gambling.'),
   ('What changed', 'With scenarios, Dev modelled a lost client and a new hire side by side. The agency chose to hire in stages, protecting a six-month cushion.'),
   ('The result', 'Lattice grew by a third in a year and the partners now get a one-page cash report every Monday without anyone building it.')]),
 ('harbourline-logistics', 'Harbourline Logistics', 'Transport', '65 staff', 'Freight and courier, Southampton', 'Imogen Tate', 'Managing director', '#0fa3a3',
  'Chasing invoices used to be a full-time job. Fathom does the first nudge and I only handle the awkward ones.',
  [('£210k', 'recovered from overdue invoices'), ('-11 days', 'average days to be paid'), ('1', 'day a week of admin freed')],
  [('The challenge', 'Harbourline carries fuel and wage costs weeks before customers pay. Late payers hit hard.'),
   ('What changed', 'Automatic reminders in a friendly tone, plus a forecast that factors in how late each customer really is, replaced a stressful weekly chase.'),
   ('The result', 'The business smoothed out its cash cycle and renegotiated better terms with its fuel supplier using the forecast as evidence.')]),
 ('petal-and-stem', 'Petal & Stem', 'Retail', '4 staff', 'Florist and workshop, Edinburgh', 'Callum Reid', 'Co-founder', '#e23d6e',
  'It is like having a finance director on tap, for the price of a nice bouquet each month.',
  [('£0', 'spent on a finance hire'), ('5 mins', 'a week to review cash'), ('2x', 'wedding season with confidence')],
  [('The challenge', 'Seasonal peaks meant huge stock buys followed by long lulls. Callum worried constantly about the quiet months.'),
   ('What changed', 'A seasonal forecast shaped by last year’s data let the shop plan stock purchases around cash, not nerves.'),
   ('The result', 'Petal & Stem went through its second wedding season without touching an overdraft, and opened a workshop space in the quiet months.')]),
]
os.makedirs('src/content/day-044/customers', exist_ok=True)
for slug, name, sector, size, tag, who, role, colour, quote, stats, sections in customers:
    fm = ['---', f'name: {json.dumps(name)}', f'sector: {json.dumps(sector)}', f'size: {json.dumps(size)}', f'tag: {json.dumps(tag)}', f'person: {json.dumps(who)}', f'role: {json.dumps(role)}',
          f'colour: "{colour}"', f'quote: {json.dumps(quote)}', 'stats:'] + [f'  - {{ value: {json.dumps(v)}, label: {json.dumps(l)} }}' for v, l in stats] + ['---']
    body = '\n\n'.join(f'## {h}\n\n{t}' for h, t in sections)
    with open(f'src/content/day-044/customers/{slug}.md', 'w', encoding='utf8') as f:
        f.write('\n'.join(fm) + '\n\n' + body + '\n')

releases = [
 ('2026-09-24', 'v4.2', 'feature', 'Scenarios can now be shared', 'Send any scenario to your accountant as a private link. They can comment but not change your numbers.'),
 ('2026-09-10', 'v4.1', 'improvement', 'Forecasts load twice as fast', 'We rebuilt how weekly totals are calculated. Large accounts with 50,000 transactions now open in under a second.'),
 ('2026-08-27', 'v4.0', 'feature', 'Multi-currency forecasting', 'Hold balances in GBP, EUR and USD and see everything in your reporting currency, with live exchange rates.'),
 ('2026-08-12', 'v3.9', 'fix', 'Fixed duplicate bank transactions', 'A small number of customers saw the same transaction twice after a bank reconnect. This is fixed and duplicates are cleaned up automatically.'),
 ('2026-07-29', 'v3.8', 'feature', 'Slack alerts', 'Get low-balance and late-payer alerts in the channel of your choice, with a one-click snooze.'),
 ('2026-07-15', 'v3.7', 'improvement', 'Smarter late-payer predictions', 'The model now learns from seasonality, so December payers are no longer treated like July payers.'),
 ('2026-06-30', 'v3.6', 'feature', 'Investor report templates', 'Three new board-pack templates with runway, burn and cash conversion charts, ready for PDF export.'),
 ('2026-06-11', 'v3.5', 'fix', 'Accessibility improvements', 'Charts now have keyboard navigation and text summaries, and every control meets WCAG 2.2 AA contrast.'),
]
os.makedirs('src/content/day-044/releases', exist_ok=True)
for date, ver, kind, title, text in releases:
    with open(f'src/content/day-044/releases/{ver}.json', 'w', encoding='utf8') as f:
        json.dump({'date': date, 'version': ver, 'kind': kind, 'title': title, 'text': text}, f, indent=1)
print(len(features), len(customers), len(releases))
