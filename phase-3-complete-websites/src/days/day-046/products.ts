/** Day 046 · Wildcombe Herbal · the botanical plates, and the catalogue (see catalogue.ts for the products themselves). Pages use this file; scripts use catalogue.ts. */
import chamomile from '../../assets/day-046-plates/chamomile.jpg';
import nettle from '../../assets/day-046-plates/nettle.jpg';
import lemonBalm from '../../assets/day-046-plates/lemon-balm.jpg';
import peppermint from '../../assets/day-046-plates/peppermint.jpg';
import lime from '../../assets/day-046-plates/lime.jpg';
import valerian from '../../assets/day-046-plates/valerian.jpg';
import calendula from '../../assets/day-046-plates/calendula.jpg';
import comfrey from '../../assets/day-046-plates/comfrey.jpg';
import elder from '../../assets/day-046-plates/elder.jpg';
import echinacea from '../../assets/day-046-plates/echinacea.jpg';
import thyme from '../../assets/day-046-plates/thyme.jpg';
import lavender from '../../assets/day-046-plates/lavender.jpg';

export const PLATES = { chamomile, nettle, 'lemon-balm': lemonBalm, peppermint, lime, valerian, calendula, comfrey, elder, echinacea, thyme, lavender } as Record<string, ImageMetadata>;

export * from './catalogue';
