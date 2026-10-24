"""Generates the Day 051 content: companies and jobs (Markdown). Run once: python scripts/seed-day-051.py"""
import json, os

companies = [
 ('northwind-labs', 'Northwind Labs', 'Software that makes logistics less painful', 'Software', '120 people', '#0b6e4f', 'Manchester',
  'Northwind builds planning tools for freight and delivery teams. Engineers here ship weekly, own what they build and work in small cross-functional squads.'),
 ('lumen-health', 'Lumen Health', 'Care that fits in your pocket', 'Healthtech', '60 people', '#d14d72', 'London',
  'Lumen is a digital GP service used by half a million people. Our teams combine clinicians, designers and engineers to make healthcare calmer.'),
 ('bramble-bakery-group', 'Bramble Bakery Group', 'Twelve bakeries and a lot of sourdough', 'Food and drink', '300 people', '#c4630a', 'Leeds',
  'Bramble bakes for the neighbourhood: twelve shops, one central bakery and a growing online business. We hire kind people who love good bread.'),
 ('tidewater-energy', 'Tidewater Energy', 'Clean power for coastal towns', 'Energy', '85 people', '#1c5fd4', 'Bristol',
  'Tidewater develops community wind and tidal projects. We combine engineers, planners and community organisers in pursuit of cheaper, greener power.'),
 ('paperplane-studio', 'Paperplane Studio', 'Design and brand for ambitious teams', 'Creative agency', '35 people', '#7b3fe4', 'Edinburgh',
  'Paperplane is an independent studio making brands, products and campaigns for startups and charities. Four-day week, no meetings on Fridays.'),
]
os.makedirs('src/content/day-051/companies', exist_ok=True)
for slug, name, tag, ind, size, col, city, about in companies:
    fm = ['---', f'name: {json.dumps(name)}', f'tagline: {json.dumps(tag)}', f'industry: {json.dumps(ind)}', f'size: {json.dumps(size)}', f'colour: "{col}"', f'city: {json.dumps(city)}', '---']
    with open(f'src/content/day-051/companies/{slug}.md', 'w', encoding='utf8') as f:
        f.write('\n'.join(fm) + '\n\n' + about + '\n')

# slug, title, company, location, mode, type, level, min, max, category, posted, tags, summary
J = [
 ('senior-frontend-engineer', 'Senior Frontend Engineer', 'northwind-labs', 'Manchester', 'Hybrid', 'Full-time', 'Senior', 68000, 85000, 'Engineering', '2026-10-02', ['TypeScript', 'React', 'Accessibility'], 'Lead the front end of our planning platform used by 400 logistics teams.'),
 ('backend-engineer', 'Backend Engineer', 'northwind-labs', 'Remote (UK)', 'Remote', 'Full-time', 'Mid', 52000, 66000, 'Engineering', '2026-09-30', ['Go', 'PostgreSQL', 'APIs'], 'Build the services that route 2 million deliveries a week.'),
 ('data-analyst', 'Data Analyst', 'lumen-health', 'London', 'Hybrid', 'Full-time', 'Mid', 45000, 58000, 'Data', '2026-10-01', ['SQL', 'Python', 'Dashboards'], 'Turn patient and service data into decisions that make care better.'),
 ('product-designer', 'Product Designer', 'lumen-health', 'London', 'Hybrid', 'Full-time', 'Mid', 50000, 64000, 'Design', '2026-09-28', ['Figma', 'Research', 'Design systems'], 'Design calm, trustworthy experiences for people at a vulnerable moment.'),
 ('junior-developer', 'Junior Developer', 'lumen-health', 'London', 'On-site', 'Full-time', 'Junior', 32000, 40000, 'Engineering', '2026-09-26', ['JavaScript', 'Testing', 'Mentoring'], 'Start your career in a team that invests in teaching and pairing.'),
 ('head-baker', 'Head Baker', 'bramble-bakery-group', 'Leeds', 'On-site', 'Full-time', 'Senior', 36000, 44000, 'Operations', '2026-10-03', ['Sourdough', 'Team lead', 'Early starts'], 'Run the night shift at our central bakery and train the next generation.'),
 ('marketing-manager', 'Marketing Manager', 'bramble-bakery-group', 'Leeds', 'Hybrid', 'Full-time', 'Mid', 40000, 50000, 'Marketing', '2026-09-27', ['Social media', 'Email', 'Brand'], 'Grow our shops and online business through warm, honest storytelling.'),
 ('weekend-shop-assistant', 'Weekend Shop Assistant', 'bramble-bakery-group', 'Leeds', 'On-site', 'Part-time', 'Junior', 22000, 24000, 'Operations', '2026-09-24', ['Customer service', 'Weekends'], 'Greet customers, serve fresh bread and brighten up Saturday mornings.'),
 ('project-planner', 'Project Planner', 'tidewater-energy', 'Bristol', 'Hybrid', 'Full-time', 'Mid', 46000, 58000, 'Operations', '2026-09-29', ['Planning', 'Stakeholders', 'Renewables'], 'Plan community wind and tidal projects from first survey to switch-on.'),
 ('community-engagement-lead', 'Community Engagement Lead', 'tidewater-energy', 'Bristol', 'Hybrid', 'Full-time', 'Senior', 50000, 62000, 'Marketing', '2026-09-22', ['Communication', 'Events', 'Public speaking'], 'Bring local people into the story of the projects we build on their doorstep.'),
 ('brand-designer', 'Brand Designer', 'paperplane-studio', 'Edinburgh', 'Hybrid', 'Full-time', 'Mid', 38000, 48000, 'Design', '2026-10-02', ['Identity', 'Typography', 'Illustration'], 'Create brand identities that feel alive, for founders who care.'),
 ('freelance-copywriter', 'Freelance Copywriter', 'paperplane-studio', 'Remote (UK)', 'Remote', 'Contract', 'Mid', 350, 450, 'Marketing', '2026-09-25', ['Copywriting', 'Tone of voice', 'Web'], 'Day-rate writing for brand and web projects. Three-month renewable contract.'),
]
os.makedirs('src/content/day-051/jobs', exist_ok=True)
for slug, title, co, loc, mode, typ, lvl, lo, hi, cat, posted, tags, summ in J:
    fm = ['---', f'title: {json.dumps(title)}', f'company: "{co}"', f'location: {json.dumps(loc)}', f'mode: "{mode}"', f'type: "{typ}"', f'level: "{lvl}"', f'min: {lo}', f'max: {hi}', f'category: "{cat}"', f'posted: "{posted}"', 'tags:'] + [f'  - {json.dumps(t)}' for t in tags] + [f'summary: {json.dumps(summ)}', '---']
    body = (f'## About the role\n\n{summ} You will work with a friendly team that values clear communication, steady pace and doing the job well.\n\n'
            f'## What you will do\n\n- Own your work from first idea to launch\n- Share what you learn with the rest of the team\n- Work closely with colleagues across the company\n- Help us improve how we work\n\n'
            f'## What we are looking for\n\n- Experience with {tags[0].lower()}{" and " + tags[1].lower() if len(tags) > 1 else ""}\n- Good judgement, curiosity and care for detail\n- A kind, collaborative approach\n\n'
            f'## What you get\n\n- 28 days holiday plus bank holidays\n- Flexible working and a learning budget\n- Pension, health cover and a friendly team')
    with open(f'src/content/day-051/jobs/{slug}.md', 'w', encoding='utf8') as f:
        f.write('\n'.join(fm) + '\n\n' + body + '\n')
print(len(companies), len(J))
