/**
 * Day 041 · Pagebound Books · a tiny basket shared by every page through localStorage.
 * Pages call these functions, then listen for "basket:change" to repaint.
 */
export type Line = { slug: string; title: string; author: string; price: number; qty: number; palette: number; pattern: number };
const KEY = 'pagebound-basket';

export function read(): Line[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; }
}
function write(lines: Line[]) {
  try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* storage unavailable */ }
  dispatchEvent(new CustomEvent('basket:change'));
}
export function add(item: Omit<Line, 'qty'>, qty = 1) {
  const lines = read();
  const ex = lines.find((l) => l.slug === item.slug);
  ex ? (ex.qty = Math.min(10, ex.qty + qty)) : lines.push({ ...item, qty });
  write(lines);
}
export function setQty(slug: string, qty: number) {
  const lines = read().map((l) => (l.slug === slug ? { ...l, qty } : l)).filter((l) => l.qty > 0);
  write(lines);
}
export function clear() { write([]); }
export const count = () => read().reduce((s, l) => s + l.qty, 0);
export const total = () => read().reduce((s, l) => s + l.qty * l.price, 0);
export const gbp = (n: number) => '£' + n.toFixed(2);
addEventListener('storage', (e) => { if (e.key === KEY) dispatchEvent(new CustomEvent('basket:change')); });
