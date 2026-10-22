"""Generates the Day 047 content: festival artists (Markdown). Run once: python scripts/seed-day-047.py"""
import json, os

# slug, name, day, stage, genre, start, end, headliner, hue, origin, blurb, listen
artists = [
 ('lila-hart', 'Lila Hart', 'Fri', 'Sunset', 'Soul', '18:00', '19:15', False, 330, 'Bristol', 'A velvet voice and a band that grooves like a Sunday afternoon.', 'Warm, slow-burning soul with horns, harmonies and the occasional unexpected cover of a 90s anthem.'),
 ('kite-and-key', 'Kite & Key', 'Fri', 'Forest', 'Folk', '19:00', '20:15', False, 130, 'Leeds', 'Two voices, one guitar and a whole forest singing along.', 'Intimate harmonies and stomping folk songs that turn into a mass singalong by the final chorus.'),
 ('nova-vale', 'Nova Vale', 'Fri', 'Sunset', 'Electronic', '20:00', '21:30', True, 285, 'London', 'Friday headliner. Cinematic synths and a live show you can see from space.', 'Producer and singer Nova Vale builds towering, emotional electronic anthems, played live with a full light rig.'),
 ('moss-theory', 'Moss Theory', 'Fri', 'Dome', 'Techno', '21:00', '22:30', False, 175, 'Berlin', 'Deep, hypnotic techno under a dome of lasers.', 'A late-night journey from rolling minimal grooves to peak-time drops, in the festival’s most intense room.'),
 ('aya-moon', 'Aya Moon', 'Sat', 'Forest', 'Pop', '17:00', '18:15', False, 20, 'Tokyo', 'Dreamy pop with a bounce that wakes up the afternoon.', 'Sparkling synth-pop in two languages, with choreography and a surprise guest for the closing song.'),
 ('ozone-kids', 'Ozone Kids', 'Sat', 'Dome', 'Hip-hop', '20:00', '21:30', False, 45, 'Manchester', 'Three MCs, one DJ and no sitting down.', 'Fast, funny and fiercely local. Expect crowd-surfing, call-and-response and a lot of sweat.'),
 ('fenwick', 'Fenwick', 'Sat', 'Forest', 'Indie', '20:30', '21:45', False, 95, 'Glasgow', 'Big-hearted indie guitars for a big-hearted crowd.', 'Chiming guitars and honest lyrics from Glasgow’s favourite four-piece. Bring someone to hug.'),
 ('the-marlowes', 'The Marlowes', 'Sat', 'Sunset', 'Rock', '21:00', '22:30', True, 8, 'Sheffield', 'Saturday headliner. Stadium rock, played like it is a pub.', 'Riffs, tambourines and sing-along choruses from the band that sold out three nights at the arena.'),
 ('tilda-brandt', 'Tilda Brandt', 'Sun', 'Sunset', 'Indie', '17:30', '18:45', False, 200, 'Stockholm', 'A gentle start to the final evening.', 'Lush, melancholy guitar pop with a voice that makes a field go quiet.'),
 ('juno-and-the-wolves', 'Juno & the Wolves', 'Sun', 'Forest', 'Folk', '19:00', '20:15', False, 150, 'Cardiff', 'Fiddles, drums and a howl or two.', 'Raucous folk-rock that gets even the most reluctant dancers moving in the mud.'),
 ('pale-static', 'Pale Static', 'Sun', 'Dome', 'Electronic', '19:30', '21:00', False, 250, 'Rotterdam', 'Glitchy beats and a visual show that melts your brain.', 'Experimental electronic duo with a live audiovisual show built from hundreds of old television screens.'),
 ('cassius-rowe', 'Cassius Rowe', 'Sun', 'Sunset', 'Soul', '20:30', '22:00', True, 38, 'Kingston', 'Sunday headliner. The perfect way to close the weekend.', 'A legend of reggae-soul closing the festival with a set of timeless songs and a very big smile.'),
]
os.makedirs('src/content/day-047/artists', exist_ok=True)
for slug, name, day, stage, genre, st, en, head, hue, origin, blurb, bio in artists:
    fm = ['---', f'name: {json.dumps(name)}', f'day: "{day}"', f'stage: "{stage}"', f'genre: "{genre}"', f'start: "{st}"', f'end: "{en}"', f'headliner: {str(head).lower()}',
          f'hue: {hue}', f'origin: {json.dumps(origin)}', f'blurb: {json.dumps(blurb)}', '---']
    body = f'{bio}\n\n## The set\n\nEach set runs for around {int(en[:2])*60+int(en[3:])-int(st[:2])*60-int(st[3:])} minutes on the {stage} stage. Arrive early to get close to the front, and check the schedule page for clashes with other acts you love.'
    with open(f'src/content/day-047/artists/{slug}.md', 'w', encoding='utf8') as f:
        f.write('\n'.join(fm) + '\n\n' + body + '\n')
print(len(artists))
