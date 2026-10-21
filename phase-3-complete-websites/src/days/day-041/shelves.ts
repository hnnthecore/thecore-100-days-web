/** Day 041 · Pagebound Books · shared shelf helpers: spine colours, where each genre lives in the shop and the booksellers. */
export const PALETTES: [string, string][] = [['#7a1f2b', '#f2d8a7'], ['#1d4b57', '#f1e3c4'], ['#3a2d6b', '#f4e4c1'], ['#965014', '#fff0d2'], ['#2f6b4a', '#f3e6c6'], ['#8a2f5b', '#f6e0c3']];
export const BAYS: Record<string, string> = {
  'Fiction': 'Fiction · Bay 2, eye level',
  'Crime': 'Crime · Bay 4, back wall',
  'Sci-fi & fantasy': 'Sci-fi & fantasy · Bay 5, by the stairs',
  'Non-fiction': 'Non-fiction · Bay 1, front window',
  'Children’s': 'Children’s · the reading nook',
  'Poetry & essays': 'Poetry & essays · Bay 3, by the kettle',
};
export const STAFF: Record<string, { name: string; role: string }> = {
  Hana: { name: 'Hana Rahimi', role: 'Owner & fiction buyer' },
  Dev: { name: 'Dev Chaudhary', role: 'Crime & thrillers' },
  Priya: { name: 'Priya Nair', role: 'Children’s & sci-fi' },
  Moira: { name: 'Moira Lennox', role: 'Events & poetry' },
};
/** A small stable number from a string, so every spine keeps its own height. */
export const hash = (s: string) => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
