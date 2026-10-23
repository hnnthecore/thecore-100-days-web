/** Real photographs for Brightside Dental (Pexels, free to use): one for each treatment and a portrait for each person on the team. */
import t_check from '../../assets/day-049-treatments/check-up.jpg';
import t_hyg from '../../assets/day-049-treatments/hygiene.jpg';
import t_white from '../../assets/day-049-treatments/whitening.jpg';
import t_align from '../../assets/day-049-treatments/aligners.jpg';
import t_impl from '../../assets/day-049-treatments/implants.jpg';
import t_root from '../../assets/day-049-treatments/root-canal.jpg';
import t_emerg from '../../assets/day-049-treatments/emergency.jpg';
import t_kids from '../../assets/day-049-treatments/children.jpg';
import d_anna from '../../assets/day-049-team/dr-anna-bell.jpg';
import d_maya from '../../assets/day-049-team/dr-maya-lindgren.jpg';
import d_sam from '../../assets/day-049-team/dr-sam-okafor.jpg';
import d_hannah from '../../assets/day-049-team/hannah-cole.jpg';

export const TREATMENT_PHOTOS: Record<string, ImageMetadata> = { 'check-up': t_check, hygiene: t_hyg, whitening: t_white, aligners: t_align, implants: t_impl, 'root-canal': t_root, emergency: t_emerg, children: t_kids };
export const TREATMENT_ALTS: Record<string, string> = {
  'check-up': 'A dentist in a mask and scrubs examining a patient under the surgery light',
  hygiene: 'Gloved hands holding a model of the teeth and a toothbrush to show how to clean them',
  whitening: 'A smiling teenager looking at a tooth shade guide held by a gloved hand',
  aligners: 'A hand holding up a clear plastic aligner',
  implants: 'A cut-away model of a dental implant beside a natural tooth',
  'root-canal': 'A dentist in orange gloves pointing at a cross-section model of a tooth',
  emergency: 'A woman with a pained expression holding her hand to her cheek',
  children: 'A smiling girl in a lilac hoodie holding a dental mirror in the dentist’s chair',
};
export const TEAM_PHOTOS: Record<string, ImageMetadata> = { 'dr-anna-bell': d_anna, 'dr-maya-lindgren': d_maya, 'dr-sam-okafor': d_sam, 'hannah-cole': d_hannah };
