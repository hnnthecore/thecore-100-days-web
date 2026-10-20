/** One real photograph per programme (Pexels, free to use). Keys are the programme slugs. */
import p_green_jobs from '../../assets/day-043-cards/green-jobs.jpg';
import p_grow_together from '../../assets/day-043-cards/grow-together.jpg';
import p_little_sprouts from '../../assets/day-043-cards/little-sprouts.jpg';
import p_seed_to_plate from '../../assets/day-043-cards/seed-to-plate.jpg';

export const PROGRAMME_PHOTOS: Record<string, ImageMetadata> = {
  'green-jobs': p_green_jobs,
  'grow-together': p_grow_together,
  'little-sprouts': p_little_sprouts,
  'seed-to-plate': p_seed_to_plate,
};

import s_amina from '../../assets/day-043-stories/amina-and-the-allotment.jpg';
import s_trainee from '../../assets/day-043-stories/from-trainee-to-grower.jpg';
import s_tomato from '../../assets/day-043-stories/the-1000-tomato-summer.jpg';
import amina_portrait from '../../assets/day-043-stories/amina-portrait.jpg';
import gate_photo from '../../assets/day-043-stories/gate.jpg';

/** One real photograph per story (Pexels, free to use). Keys are the story slugs. */
export const STORY_PHOTOS: Record<string, ImageMetadata> = { 'amina-and-the-allotment': s_amina, 'from-trainee-to-grower': s_trainee, 'the-1000-tomato-summer': s_tomato };
export const STORY_ALTS: Record<string, string> = {
  'amina-and-the-allotment': 'A smiling woman holding a wicker basket of fresh vegetables on an allotment',
  'from-trainee-to-grower': 'A young gardener in an apron sowing seeds into a tray in a greenhouse',
  'the-1000-tomato-summer': 'A smiling woman holding a bowl of ripe red tomatoes in a greenhouse',
};
export const AMINA_PORTRAIT = amina_portrait;
export const GATE_PHOTO = gate_photo;

import team_farida from '../../assets/day-043-team/farida.jpg';
import team_joe from '../../assets/day-043-team/joe.jpg';
import team_dev from '../../assets/day-043-team/dev.jpg';
import team_lucy from '../../assets/day-043-team/lucy.jpg';
/** A real portrait of each person on the About page team (Pexels, free to use). */
export const TEAM_PHOTOS: Record<string, ImageMetadata> = { 'Farida Haque': team_farida, 'Joe Mbeki': team_joe, 'Dev Anand': team_dev, 'Lucy Marsh': team_lucy };
