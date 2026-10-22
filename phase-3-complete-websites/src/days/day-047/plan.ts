/**
 * Day 047 · Solstice Sound · "My plan": the acts you have starred. Saved in localStorage and shared by the
 * line-up, artist pages and schedule. Every change fires a `plan:change` event so each page can repaint itself.
 */
const KEY = 'solstice-plan';

export const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

function read(): string[] {
  try { const v = JSON.parse(localStorage.getItem(KEY) ?? '[]'); return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []; } catch { return []; }
}
/* Scripts are bundled per page, so several copies of this module can exist: always read the saved list, never a cached one. */
let fallback: string[] = [];
const current = () => { try { return localStorage.getItem(KEY) === null ? fallback : read(); } catch { return fallback; } };

export const plan = {
  all: () => [...current()],
  has: (id: string) => current().includes(id),
  toggle(id: string) {
    const cur = current();
    const ids = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    fallback = ids;
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch { /* private mode: the plan lasts for this visit only */ }
    dispatchEvent(new CustomEvent('plan:change'));
  },
  clear() {
    fallback = [];
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    dispatchEvent(new CustomEvent('plan:change'));
  },
};

/** Pairs of starred acts that overlap in time on the same day. */
export function clashes(sets: { id: string; day: string; start: string; end: string }[]): [string, string][] {
  const mine = sets.filter((s) => plan.has(s.id));
  const out: [string, string][] = [];
  for (let i = 0; i < mine.length; i++) for (let j = i + 1; j < mine.length; j++) {
    const a = mine[i], b = mine[j];
    if (a.day === b.day && toMin(a.start) < toMin(b.end) && toMin(b.start) < toMin(a.end)) out.push([a.id, b.id]);
  }
  return out;
}
