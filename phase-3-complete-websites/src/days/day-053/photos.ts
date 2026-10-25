/** Real photographs for Static (Pexels, free to use): the cover of each show and a portrait of each host. Keys are the show slugs. */
import c_make from '../../assets/day-053-covers/make-it-work.jpg';
import c_sci from '../../assets/day-053-covers/pocket-science.jpg';
import c_hours from '../../assets/day-053-covers/small-hours.jpg';
import c_way from '../../assets/day-053-covers/the-long-way-round.jpg';
import h_make from '../../assets/day-053-hosts/make-it-work.jpg';
import h_sci from '../../assets/day-053-hosts/pocket-science.jpg';
import h_hours from '../../assets/day-053-hosts/small-hours.jpg';
import h_way from '../../assets/day-053-hosts/the-long-way-round.jpg';

export const SHOW_COVERS: Record<string, ImageMetadata> = { 'make-it-work': c_make, 'pocket-science': c_sci, 'small-hours': c_hours, 'the-long-way-round': c_way };
export const COVER_ALTS: Record<string, string> = {
  'make-it-work': 'Two makers at a workbench in a cluttered, sunny workshop',
  'pocket-science': 'A scientist in a white coat and gloves working at a bench in front of a chalkboard of equations',
  'small-hours': 'A dark apartment block at night with a scatter of lit windows',
  'the-long-way-round': 'A grassy track running down to a remote coastal village and a loch',
};
export const HOST_PHOTOS: Record<string, ImageMetadata> = { 'make-it-work': h_make, 'pocket-science': h_sci, 'small-hours': h_hours, 'the-long-way-round': h_way };
