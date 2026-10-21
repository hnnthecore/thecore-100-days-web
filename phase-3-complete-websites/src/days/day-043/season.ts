/** Day 043 · Rootwork · the farm's calendar as data: a line for each month and the season each month belongs to. Shared by the page and its script. */
export const NOTES = [
  'Beds are resting under cloth. Kale is the only thing still giving, and the seed order arrives.',
  'Seed trays go onto the greenhouse benches. The tomatoes are sown by the end of the month.',
  'Sowing starts in earnest: salad onions under cloth, and the Green Jobs course begins.',
  'First pickings. Salad onions come out of the ground and the polytunnel fills up.',
  'Planting out. The beans go up their wigwams by the gate and Little Sprouts get a bed of their own.',
  'Strawberries, picked warm on Saturday. The first punnets always go to Little Sprouts.',
  'The glut begins: courgettes, beans, tomatoes and new potatoes all at once.',
  'Everything at once, and the kitchen is cooking for two hundred on Saturdays.',
  'Apples from the old orchard, pumpkins curing in the sun and the first carrots.',
  'Apple-pressing days and pumpkin soup, and the beds get put to rest. Come and clear one.',
  'The last carrots and pumpkins. Mulch goes onto the beds and the greenhouse gets cleaned.',
  'Quiet weeks. Kale, a bonfire, and soup at the gate on the shortest day.',
] as const;
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
/** Month number (1 to 12) to its season. */
export const seasonOf = (m: number): Season => (m >= 3 && m <= 5 ? 'spring' : m >= 6 && m <= 8 ? 'summer' : m >= 9 && m <= 11 ? 'autumn' : 'winter');
