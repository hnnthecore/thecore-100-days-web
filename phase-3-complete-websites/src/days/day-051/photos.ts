/** Real photographs of the five hiring companies' workplaces (Pexels, free to use). Keys are the company slugs. */
import bramble from '../../assets/day-051-companies/bramble-bakery-group.jpg';
import lumen from '../../assets/day-051-companies/lumen-health.jpg';
import northwind from '../../assets/day-051-companies/northwind-labs.jpg';
import paperplane from '../../assets/day-051-companies/paperplane-studio.jpg';
import tidewater from '../../assets/day-051-companies/tidewater-energy.jpg';

export const COMPANY_PHOTOS: Record<string, ImageMetadata> = { 'bramble-bakery-group': bramble, 'lumen-health': lumen, 'northwind-labs': northwind, 'paperplane-studio': paperplane, 'tidewater-energy': tidewater };
export const COMPANY_ALTS: Record<string, string> = {
  'bramble-bakery-group': 'Two bakers in aprons smiling behind a board of freshly baked flatbreads in a professional kitchen',
  'lumen-health': 'Two smiling healthcare workers in green scrubs with stethoscopes, arms crossed',
  'northwind-labs': 'An open-plan software office where engineers work at desks with monitors and laptops',
  'paperplane-studio': 'A designer holding colour swatches over a laptop in a bright creative studio',
  'tidewater-energy': 'Four engineers in hard hats and hi-vis vests standing behind a solar panel',
};
