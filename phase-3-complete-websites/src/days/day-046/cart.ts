/**
 * Day 046 · Wildcombe Herbal · the basket. Lines live in localStorage and are re-read on every call,
 * because each page's scripts are bundled separately and must always agree on what is in the basket.
 */
import { byId, money as fmt } from './catalogue';

export interface Line { key: string; id: string; size: string; qty: number }

const CART = 'wildcombe-basket', PROMO = 'wildcombe-promo';
let memCart: Line[] = [], memPromo = '';

const readCart = (): Line[] => { try { const r = localStorage.getItem(CART); if (r === null) return memCart; const v = JSON.parse(r); return Array.isArray(v) ? v : []; } catch { return memCart; } };
const writeCart = (v: Line[]) => {
  memCart = v;
  try { localStorage.setItem(CART, JSON.stringify(v)); } catch { /* private mode: lasts for this visit */ }
  dispatchEvent(new CustomEvent('cart:change'));
};

export const FREE_OVER = 35;
export const DELIVERY = { standard: { label: 'Standard, 2 to 4 working days', price: 3.95 }, next: { label: 'Next working day', price: 6.95 } } as const;
export const money = fmt;

export const unitOf = (l: Line) => byId(l.id).sizes.find((s) => s.id === l.size)?.price ?? 0;

export const cart = {
  lines: readCart,
  count: () => readCart().reduce((n, l) => n + l.qty, 0),
  add(id: string, size: string, qty = 1) {
    const key = `${id}|${size}`;
    const c = readCart();
    const hit = c.find((l) => l.key === key);
    if (hit) hit.qty = Math.min(12, hit.qty + qty); else c.push({ key, id, size, qty });
    writeCart(c);
    dispatchEvent(new CustomEvent('cart:added', { detail: { id, size } }));
  },
  setQty(key: string, qty: number) { writeCart(readCart().map((l) => (l.key === key ? { ...l, qty: Math.max(1, Math.min(12, qty)) } : l))); },
  remove(key: string) { writeCart(readCart().filter((l) => l.key !== key)); },
  clear() { writeCart([]); },
  promo: (): string => { try { const r = localStorage.getItem(PROMO); return r === null ? memPromo : r; } catch { return memPromo; } },
  setPromo(code: string) {
    memPromo = code;
    try { localStorage.setItem(PROMO, code); } catch { /* ignore */ }
    dispatchEvent(new CustomEvent('cart:change'));
  },
};

/** WILD10 takes 10% off. Standard delivery is free over £35. */
export function totals(method: keyof typeof DELIVERY = 'standard') {
  const sub = cart.lines().reduce((s, l) => s + l.qty * unitOf(l), 0);
  const promoOk = cart.promo().trim().toUpperCase() === 'WILD10';
  const discount = promoOk ? Math.round(sub * 0.1 * 100) / 100 : 0;
  const after = sub - discount;
  const ship = sub === 0 ? 0 : method === 'standard' && after >= FREE_OVER ? 0 : DELIVERY[method].price;
  return { sub, discount, promoOk, ship, total: after + ship, toFree: Math.max(0, FREE_OVER - after) };
}

/** Keeps every header basket counter in step with storage. */
export function wireCount() {
  const paint = () => document.querySelectorAll('[data-cart-count]').forEach((el) => (el.textContent = String(cart.count())));
  addEventListener('cart:change', paint);
  paint();
}
