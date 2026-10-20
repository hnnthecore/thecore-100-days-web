/** Real photographs for Lingua Lane (Pexels, free to use): a portrait of each teacher and a street scene for each language. */
import t0 from '../../assets/day-045/teacher-ana-lima.jpg';
import t1 from '../../assets/day-045/teacher-camille-roche.jpg';
import t2 from '../../assets/day-045/teacher-giulia-ferri.jpg';
import t3 from '../../assets/day-045/teacher-jonas-weber.jpg';
import t4 from '../../assets/day-045/teacher-marta-solis.jpg';
import t5 from '../../assets/day-045/teacher-omar-haddad.jpg';
import t6 from '../../assets/day-045/teacher-wei-chen.jpg';
import t7 from '../../assets/day-045/teacher-yuki-tanaka.jpg';
import c0 from '../../assets/day-045/course-spanish.jpg';
import c1 from '../../assets/day-045/course-french.jpg';
import c2 from '../../assets/day-045/course-german.jpg';
import c3 from '../../assets/day-045/course-italian.jpg';
import c4 from '../../assets/day-045/course-japanese.jpg';
import c5 from '../../assets/day-045/course-mandarin.jpg';
import c6 from '../../assets/day-045/course-portuguese.jpg';
import c7 from '../../assets/day-045/course-arabic.jpg';

export const TEACHER_PHOTOS: Record<string, ImageMetadata> = { 'ana-lima': t0, 'camille-roche': t1, 'giulia-ferri': t2, 'jonas-weber': t3, 'marta-solis': t4, 'omar-haddad': t5, 'wei-chen': t6, 'yuki-tanaka': t7 };
export const COURSE_PHOTOS: Record<string, ImageMetadata> = { 'spanish': c0, 'french': c1, 'german': c2, 'italian': c3, 'japanese': c4, 'mandarin': c5, 'portuguese': c6, 'arabic': c7 };
export const COURSE_ALTS: Record<string, string> = {"spanish":"A sunny Plaza Mayor in Madrid with its red-painted arcades and a statue in the middle","french":"A Montmartre street in Paris with café terraces and strollers","german":"The Brandenburg Gate in Berlin against a blue sky","italian":"A sunlit cobbled street between ochre buildings in Rome","japanese":"A busy neon-lit street in Tokyo at night","mandarin":"An old Beijing hutong gateway hung with red lanterns","portuguese":"A yellow tram on a Lisbon street","arabic":"A circular medallion of Arabic calligraphy"};
