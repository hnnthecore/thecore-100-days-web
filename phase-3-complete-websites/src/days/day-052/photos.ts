/** Real photographs for Stillwater (Pexels, free to use): one for each class and a portrait for each teacher. */
import hatha from '../../assets/day-052-classes/hatha-basics.jpg';
import meditation from '../../assets/day-052-classes/meditation.jpg';
import mobility from '../../assets/day-052-classes/morning-mobility.jpg';
import pilates from '../../assets/day-052-classes/pilates-mat.jpg';
import power from '../../assets/day-052-classes/power-vinyasa.jpg';
import prenatal from '../../assets/day-052-classes/prenatal.jpg';
import vinyasa from '../../assets/day-052-classes/vinyasa-flow.jpg';
import yin from '../../assets/day-052-classes/yin-restore.jpg';
import maya from '../../assets/day-052-team/maya-sol.jpg';
import elias from '../../assets/day-052-team/elias-grant.jpg';
import jo from '../../assets/day-052-team/jo-whitaker.jpg';
import priya from '../../assets/day-052-team/priya-anand.jpg';

export const CLASS_PHOTOS: Record<string, ImageMetadata> = { 'hatha-basics': hatha, meditation, 'morning-mobility': mobility, 'pilates-mat': pilates, 'power-vinyasa': power, prenatal, 'vinyasa-flow': vinyasa, 'yin-restore': yin };
export const CLASS_ALTS: Record<string, string> = {
  'hatha-basics': 'A yoga class holding a standing pose with their arms raised, led by a teacher in a bright studio',
  meditation: 'A woman sitting cross-legged in meditation among tall pine trees',
  'morning-mobility': 'A woman reaching for her toes in a gentle morning stretch beside a sofa',
  'pilates-mat': 'Two women on mats working on a pilates leg stretch in a mirrored studio',
  'power-vinyasa': 'Women on pink mats working through a strong flow in a bright brick studio',
  prenatal: 'A pregnant woman holding a gentle lunge in a calm room',
  'vinyasa-flow': 'A woman in a side-angle pose on her mat in front of white curtains',
  'yin-restore': 'A woman resting over a bolster and block in a restorative yin pose among singing bowls',
};
export const TEACHER_PHOTOS: Record<string, ImageMetadata> = { 'maya-sol': maya, 'elias-grant': elias, 'jo-whitaker': jo, 'priya-anand': priya };
