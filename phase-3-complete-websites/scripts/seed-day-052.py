"""Generates the Day 052 content: yoga classes and teachers (Markdown). Run once: python scripts/seed-day-052.py"""
import json, os

# slug, title, tagline, level, minutes, intensity(1-5), hue, teacher, benefits[], blurb
C = [
 ('vinyasa-flow', 'Vinyasa Flow', 'Breath-led movement that builds heat and calm together', 'All levels', 60, 3, 18, 'maya-sol', ['Builds strength and stamina', 'Improves flexibility', 'Calms a busy mind'], 'A flowing sequence where every movement is linked to a breath. Expect sun salutations, standing poses and a long, quiet finish.'),
 ('yin-restore', 'Yin and Restore', 'Slow, supported stretches held for minutes at a time', 'All levels', 75, 1, 260, 'elias-grant', ['Releases deep tension', 'Settles the nervous system', 'Improves sleep'], 'Long, gentle holds with bolsters and blankets. A class for tired bodies and busy heads.'),
 ('hatha-basics', 'Hatha Basics', 'Learn the foundations of yoga, one pose at a time', 'Beginner', 60, 2, 140, 'priya-anand', ['Teaches safe alignment', 'Builds confidence', 'Gentle on joints'], 'Unhurried teaching of the key poses, how to breathe and how to use props. Perfect if you have never stepped on a mat.'),
 ('power-vinyasa', 'Power Vinyasa', 'A strong, sweaty class that works the whole body', 'Intermediate', 60, 5, 8, 'maya-sol', ['Builds serious strength', 'Boosts energy', 'Great cardio'], 'Faster, stronger and more athletic. Arm balances, core work and plenty of challenge.'),
 ('prenatal', 'Prenatal Yoga', 'Safe, supportive movement for every trimester', 'All levels', 60, 2, 340, 'priya-anand', ['Eases back and hip aches', 'Prepares for birth', 'Meets other parents-to-be'], 'Gentle stretching, breathing practice and pelvic-floor awareness, led by a certified prenatal teacher.'),
 ('meditation', 'Guided Meditation', 'Thirty minutes to arrive, breathe and let go', 'All levels', 30, 1, 200, 'elias-grant', ['Reduces stress', 'Improves focus', 'Needs no experience'], 'Seated or lying down, we use breath, sound and simple guided practices to settle the mind.'),
 ('pilates-mat', 'Mat Pilates', 'Precise core work for posture and strength', 'All levels', 50, 3, 45, 'jo-whitaker', ['Strengthens the core', 'Improves posture', 'Protects the back'], 'Small, controlled movements that wake up deep stabilising muscles. Low impact, high reward.'),
 ('morning-mobility', 'Morning Mobility', 'Wake up your joints before the day begins', 'Beginner', 40, 2, 100, 'jo-whitaker', ['Eases stiffness', 'Lifts energy', 'Perfect before work'], 'Gentle, flowing movement to open the hips, shoulders and spine. A cup of tea is optional but encouraged.'),
]
os.makedirs('src/content/day-052/classes', exist_ok=True)
for slug, title, tag, lvl, mins, inten, hue, teacher, ben, blurb in C:
    fm = ['---', f'title: {json.dumps(title)}', f'tagline: {json.dumps(tag)}', f'level: "{lvl}"', f'minutes: {mins}', f'intensity: {inten}', f'hue: {hue}', f'teacher: "{teacher}"', 'benefits:'] + [f'  - {json.dumps(b)}' for b in ben] + ['---']
    body = (f'{blurb}\n\n## What to expect\n\nYou will be welcomed at the door, shown where to leave your things and offered a mat and any props you need. '
            f'The room is warm, softly lit and unhurried. Each class begins with a few minutes of settling and ends with a rest.\n\n'
            f'## What to bring\n\nComfortable clothes you can move in, a water bottle and, if you like, your own mat. We provide everything else, including blocks, straps and blankets.\n\n'
            f'## Is it right for me?\n\nThis class is rated **{lvl.lower()}**. If you are unsure, arrive ten minutes early and talk to your teacher. Every body is welcome and every pose has a gentler option.')
    with open(f'src/content/day-052/classes/{slug}.md', 'w', encoding='utf8') as f:
        f.write('\n'.join(fm) + '\n\n' + body + '\n')

T = [
 ('maya-sol', 'Maya Sol', 'Founder and lead teacher', 14, '#e07a5f', 'Vinyasa, Power Vinyasa', 'Maya opened Stillwater to make a studio that feels like a deep breath. She teaches with humour and a lot of heart.'),
 ('elias-grant', 'Elias Grant', 'Yin and meditation teacher', 11, '#6b5b95', 'Yin, Meditation', 'Elias came to yoga through burnout and stayed for the stillness. His classes are slow, soft and surprisingly powerful.'),
 ('priya-anand', 'Priya Anand', 'Beginners and prenatal teacher', 9, '#2e9e6b', 'Hatha, Prenatal', 'Priya is a qualified midwife as well as a yoga teacher. She is patient, practical and wonderful with first-timers.'),
 ('jo-whitaker', 'Jo Whitaker', 'Pilates and mobility teacher', 8, '#d4a017', 'Pilates, Mobility', 'A former physiotherapist, Jo loves helping people move well and feel strong in their own bodies.'),
]
os.makedirs('src/content/day-052/teachers', exist_ok=True)
for slug, name, role, yrs, col, styles, bio in T:
    fm = ['---', f'name: {json.dumps(name)}', f'role: {json.dumps(role)}', f'years: {yrs}', f'colour: "{col}"', f'styles: {json.dumps(styles)}', '---']
    with open(f'src/content/day-052/teachers/{slug}.md', 'w', encoding='utf8') as f:
        f.write('\n'.join(fm) + '\n\n' + bio + '\n')
print(len(C), len(T))
