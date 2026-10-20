/** Real photographs for Fathom (Pexels, free to use): one per feature, one per customer business and one portrait per customer quote. */
import f_forecast from '../../assets/day-044/feature-forecast.jpg';
import f_alerts from '../../assets/day-044/feature-alerts.jpg';
import f_invoices from '../../assets/day-044/feature-invoices.jpg';
import f_reports from '../../assets/day-044/feature-reports.jpg';
import f_scenarios from '../../assets/day-044/feature-scenarios.jpg';
import f_teams from '../../assets/day-044/feature-teams.jpg';
import b0 from '../../assets/day-044/biz-harbourline-logistics.jpg';
import b1 from '../../assets/day-044/biz-lattice-studio.jpg';
import b2 from '../../assets/day-044/biz-northbound-bakery.jpg';
import b3 from '../../assets/day-044/biz-petal-and-stem.jpg';
import p0 from '../../assets/day-044/person-harbourline-logistics.jpg';
import p1 from '../../assets/day-044/person-lattice-studio.jpg';
import p2 from '../../assets/day-044/person-northbound-bakery.jpg';
import p3 from '../../assets/day-044/person-petal-and-stem.jpg';

export const FEATURE_PHOTOS: Record<string, ImageMetadata> = { 'forecast': f_forecast, 'alerts': f_alerts, 'invoices': f_invoices, 'reports': f_reports, 'scenarios': f_scenarios, 'teams': f_teams };
export const BIZ_PHOTOS: Record<string, ImageMetadata> = { 'harbourline-logistics': b0, 'lattice-studio': b1, 'northbound-bakery': b2, 'petal-and-stem': b3 };
export const PERSON_PHOTOS: Record<string, ImageMetadata> = { 'harbourline-logistics': p0, 'lattice-studio': p1, 'northbound-bakery': p2, 'petal-and-stem': p3 };
export const PHOTO_ALTS: Record<string, string> = {"forecast":"A woman reviewing her figures on a laptop in a café","alerts":"A hand holding a phone showing a lock-screen notification","invoices":"An invoice, paperwork and a laptop on a wooden desk","reports":"Hands, a calculator and printed accounting charts on a table","scenarios":"A team standing at a wall of sticky notes planning together","teams":"A small team around a table with laptops and papers","harbourline-logistics":"Two couriers checking parcels at the back of a delivery van","lattice-studio":"A creative team talking around a table in a brick-walled studio","northbound-bakery":"A baker behind a counter of fresh bread","petal-and-stem":"A smiling florist wrapping a bunch of pink roses in her shop"};
export const PERSON_ALTS: Record<string, string> = {"harbourline-logistics":"Imogen Tate, managing director of Harbourline Logistics","lattice-studio":"Dev Malhotra, finance lead at Lattice Studio","northbound-bakery":"Rosa Whitfield, owner of Northbound Bakery","petal-and-stem":"Callum Reid, co-founder of Petal & Stem"};
