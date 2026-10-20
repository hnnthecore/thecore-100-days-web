"""Generates the Day 045 content: language courses (Markdown) and teachers (Markdown). Run once: python scripts/seed-day-045.py"""
import json, os

# slug, language, greeting, native name, colour, ink, speakers, tagline, teacher, schedule, intro, highlights
courses = [
 ('spanish', 'Spanish', 'Hola', 'Español', '#ff5a3c', '#fff', '500 million speakers', 'The language of 20 countries, taught through conversation', 'marta-solis',
  ['Mon 18:30', 'Wed 10:00', 'Sat 10:30'],
  'Spanish opens doors from Madrid to Mexico City. Our classes put you in conversations from the first week, so you speak rather than just study.',
  ['Speak from lesson one', 'Real-life situations: ordering, travelling, working', 'Latin American and Castilian accents']),
 ('french', 'French', 'Bonjour', 'Français', '#3a5bd9', '#fff', '300 million speakers', 'Elegance, culture and a language of diplomacy', 'camille-roche',
  ['Tue 18:30', 'Thu 19:00'],
  'French is spoken on five continents. We make pronunciation fun, build real vocabulary and take the fear out of the grammar.',
  ['Pronunciation coaching every week', 'Film, music and food in class', 'DELF exam preparation available']),
 ('german', 'German', 'Hallo', 'Deutsch', '#f2b705', '#2a1f00', '130 million speakers', 'Precise, practical and great for your career', 'jonas-weber',
  ['Mon 12:30', 'Wed 13:00'],
  'German rewards learners with clear logic and big career opportunities. We break cases and compound words into simple, memorable steps.',
  ['Grammar made visual', 'Business German pathway', 'Goethe-Zertifikat preparation']),
 ('italian', 'Italian', 'Ciao', 'Italiano', '#1f9d6b', '#fff', '68 million speakers', 'La dolce vita, one conversation at a time', 'giulia-ferri',
  ['Tue 10:00', 'Sat 14:00'],
  'Italian is the language of food, art and opera. Our lessons are warm, musical and full of laughter, just like Italy.',
  ['Cooking and culture lessons', 'Small friendly groups of 8', 'Summer trip to Bologna']),
 ('japanese', 'Japanese', 'こんにちは', '日本語', '#e23d6e', '#fff', '125 million speakers', 'From hiragana to conversation with confidence', 'yuki-tanaka',
  ['Mon 19:00', 'Wed 18:30'],
  'Japanese looks daunting, but with the right order of learning it is surprisingly friendly. We start with sounds and scripts, then move straight into speaking.',
  ['Hiragana and katakana in 3 weeks', 'Anime, manga and travel vocabulary', 'JLPT N5 to N3 preparation']),
 ('mandarin', 'Mandarin', '你好', '普通话', '#c8102e', '#fff', '1.1 billion speakers', 'The world’s most spoken language, made approachable', 'wei-chen',
  ['Thu 10:00', 'Sun 16:00'],
  'Mandarin is the key to business and culture across Asia. We teach tones through songs and games, and characters through stories.',
  ['Tone training that sticks', 'Pinyin first, characters step by step', 'HSK exam preparation']),
 ('portuguese', 'Portuguese', 'Olá', 'Português', '#0f8a8a', '#fff', '260 million speakers', 'Brazilian and European, from the beach to the boardroom', 'ana-lima',
  ['Wed 19:00', 'Fri 12:30'],
  'Portuguese is the fastest growing language in Europe and the voice of Brazil. Join a lively class and learn to sound natural, not textbook.',
  ['Brazilian and European tracks', 'Music and football vocabulary', 'Great second language for Spanish speakers']),
 ('arabic', 'Arabic', 'مرحبا', 'العربية', '#6a3fb5', '#fff', '420 million speakers', 'Modern Standard Arabic and everyday dialects', 'omar-haddad',
  ['Sat 11:00', 'Sun 12:00'],
  'Arabic is rich, ancient and widely useful. We introduce the script gently, build a strong listening base and add everyday dialect phrases.',
  ['Script mastery in 4 weeks', 'Modern Standard plus Levantine dialect', 'Culture and calligraphy workshops']),
]
os.makedirs('src/content/day-045/courses', exist_ok=True)
for slug, lang, hi, native, col, ink, spk, tag, teacher, sched, intro, hl in courses:
    fm = ['---', f'language: {json.dumps(lang)}', f'greeting: {json.dumps(hi, ensure_ascii=False)}', f'native: {json.dumps(native, ensure_ascii=False)}', f'colour: "{col}"', f'ink: "{ink}"',
          f'speakers: {json.dumps(spk)}', f'tagline: {json.dumps(tag, ensure_ascii=False)}', f'teacher: "{teacher}"', 'schedule:'] + [f'  - {json.dumps(s)}' for s in sched] + [f'intro: {json.dumps(intro)}', 'highlights:'] + [f'  - {json.dumps(h)}' for h in hl] + ['---']
    body = (f'## What you will learn\n\nBy the end of your first ten-week course you will be able to introduce yourself, ask and answer everyday questions and understand the gist of a simple conversation in {lang}. '
            f'Each level builds on the last, from first words at A1 to confident discussion at B2.\n\n'
            f'## How a lesson works\n\nEvery lesson follows the same rhythm: a warm-up chat, a short new idea, plenty of pair practice and a final challenge where you use what you learned straight away. Homework is optional, short and always useful.\n\n'
            f'## Who it is for\n\nBeginners, returners and travellers are all welcome. If you have studied {lang} before, take our free level test and we will place you in the right group.')
    with open(f'src/content/day-045/courses/{slug}.md', 'w', encoding='utf8') as f:
        f.write('\n'.join(fm) + '\n\n' + body + '\n')

teachers = [
 ('marta-solis', 'Marta Solís', ['Spanish'], 'Madrid', 12, '#ff5a3c', 'Language is a bridge, so I make students cross it on day one.', 'Marta grew up in Madrid and has taught Spanish to adults for twelve years. She is known for lively classes full of role-play, and for patiently untangling the subjunctive.'),
 ('camille-roche', 'Camille Roche', ['French'], 'Lyon', 9, '#3a5bd9', 'Pronunciation is confidence. Once you sound good, you speak more.', 'Camille trained as a drama teacher before moving to London. Her classes use poetry, film clips and tongue twisters to make French sounds feel natural.'),
 ('jonas-weber', 'Jonas Weber', ['German'], 'Hamburg', 14, '#f2b705', 'German is more logical than people think. I will show you the pattern.', 'Jonas has taught German for business and exams for fourteen years. He draws a lot on the whiteboard and promises that cases are not as scary as they sound.'),
 ('giulia-ferri', 'Giulia Ferri', ['Italian'], 'Bologna', 8, '#1f9d6b', 'If your Italian class does not make you hungry, something is wrong.', 'Giulia combines language teaching with her love of cooking. Expect recipes, regional dialects and plenty of conversation over coffee.'),
 ('yuki-tanaka', 'Yuki Tanaka', ['Japanese'], 'Osaka', 10, '#e23d6e', 'Small steps every week. Soon you are reading a menu in Tokyo.', 'Yuki moved from Osaka ten years ago. She builds Japanese up gently, starting with sounds and scripts, and finishing every class with a game.'),
 ('wei-chen', 'Wei Chen', ['Mandarin'], 'Chengdu', 11, '#c8102e', 'Tones are just music. Everybody can learn music.', 'Wei is a former musician who teaches Mandarin tones with songs. She also leads the school’s Lunar New Year celebration every year.'),
 ('ana-lima', 'Ana Lima', ['Portuguese', 'Spanish'], 'São Paulo', 7, '#0f8a8a', 'Portuguese is a party in the mouth. Let us enjoy it together.', 'Ana teaches both Brazilian Portuguese and bridging classes for Spanish speakers. Her classes are known for music and laughter.'),
 ('omar-haddad', 'Omar Haddad', ['Arabic'], 'Beirut', 13, '#6a3fb5', 'The script is a beautiful puzzle. Let me hand you the first pieces.', 'Omar teaches Modern Standard Arabic alongside Levantine dialect. He also runs calligraphy workshops where students write their own names.'),
]
os.makedirs('src/content/day-045/teachers', exist_ok=True)
for slug, name, langs, from_, yrs, col, quote, bio in teachers:
    fm = ['---', f'name: {json.dumps(name, ensure_ascii=False)}', 'languages:'] + [f'  - {json.dumps(l)}' for l in langs] + [f'from: {json.dumps(from_, ensure_ascii=False)}', f'years: {yrs}', f'colour: "{col}"', f'quote: {json.dumps(quote)}', '---']
    with open(f'src/content/day-045/teachers/{slug}.md', 'w', encoding='utf8') as f:
        f.write('\n'.join(fm) + '\n\n' + bio + '\n')
print(len(courses), len(teachers))
