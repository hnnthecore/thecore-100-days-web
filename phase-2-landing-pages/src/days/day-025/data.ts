/**
 * Day 025 · Pace Logistics · network data shared by the page (map) and the script (quotes, tracking).
 * Hub positions are in the map's 400 × 600 coordinate space (a stylised UK, not to scale).
 */
export type Hub = { id: string; name: string; x: number; y: number; trucks: number; size: string };

export const HUBS: Hub[] = [
  { id: 'gla', name: 'Glasgow', x: 128, y: 168, trucks: 46, size: '120,000 sq ft' },
  { id: 'edi', name: 'Edinburgh', x: 196, y: 160, trucks: 28, size: '64,000 sq ft' },
  { id: 'ncl', name: 'Newcastle', x: 262, y: 226, trucks: 34, size: '80,000 sq ft' },
  { id: 'lds', name: 'Leeds', x: 252, y: 312, trucks: 52, size: '150,000 sq ft' },
  { id: 'man', name: 'Manchester', x: 204, y: 330, trucks: 71, size: '210,000 sq ft' },
  { id: 'bhm', name: 'Birmingham', x: 226, y: 416, trucks: 88, size: '260,000 sq ft' },
  { id: 'brs', name: 'Bristol', x: 170, y: 478, trucks: 39, size: '96,000 sq ft' },
  { id: 'cdf', name: 'Cardiff', x: 128, y: 472, trucks: 22, size: '58,000 sq ft' },
  { id: 'lon', name: 'London', x: 300, y: 488, trucks: 124, size: '340,000 sq ft' },
  { id: 'sou', name: 'Southampton', x: 238, y: 528, trucks: 31, size: '72,000 sq ft' },
  { id: 'dov', name: 'Dover', x: 362, y: 512, trucks: 27, size: 'Port terminal' },
  { id: 'fxt', name: 'Felixstowe', x: 366, y: 444, trucks: 43, size: 'Port terminal' },
];

/** Trunk routes run every night between these hubs. */
export const ROUTES: [string, string][] = [
  ['gla', 'edi'], ['gla', 'man'], ['edi', 'ncl'], ['ncl', 'lds'], ['lds', 'man'], ['lds', 'bhm'],
  ['man', 'bhm'], ['bhm', 'lon'], ['bhm', 'brs'], ['brs', 'cdf'], ['brs', 'sou'], ['lon', 'sou'],
  ['lon', 'dov'], ['lon', 'fxt'], ['fxt', 'bhm'],
];

export const hub = (id: string) => HUBS.find((h) => h.id === id)!;

/** A gentle curve between two hubs (quadratic Bézier bending to one side). */
export function curve(a: Hub, b: Hub, bend = 0.18) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return `M${a.x} ${a.y}Q${(mx - dy * bend).toFixed(1)} ${(my + dx * bend).toFixed(1)} ${b.x} ${b.y}`;
}

/** Road distance in km, roughly: straight-line map distance × a road factor. */
export const roadKm = (a: Hub, b: Hub) => Math.round(Math.hypot(a.x - b.x, a.y - b.y) * 2.05);
