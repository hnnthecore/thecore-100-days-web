/**
 * Day 050 · Citrus & Salt · the weekly dinner plan. Seven days, each holding a recipe id or nothing.
 * Stored in localStorage and re-read on every call, because each page's scripts are bundled separately.
 */
import { list } from './kitchen';

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
export type Day = (typeof DAYS)[number];
const KEY = 'citrus-week';
let mem: Record<string, string> = {};

export interface Recipe { id: string; title: string; minutes: number; serves: number; diets: string[]; ingredients: { q: number; u: string; n: string }[] }

export const week = {
  get(): Record<string, string> {
    try { const raw = localStorage.getItem(KEY); return raw === null ? mem : (JSON.parse(raw) as Record<string, string>); } catch { return mem; }
  },
  set(day: string, id: string | null) {
    const cur = { ...week.get() };
    if (id) cur[day] = id; else delete cur[day];
    week.write(cur);
  },
  write(cur: Record<string, string>) {
    mem = cur;
    try { localStorage.setItem(KEY, JSON.stringify(cur)); } catch { /* private mode: lasts for this visit */ }
    dispatchEvent(new CustomEvent('week:change'));
  },
  clear() { week.write({}); },
};

/** Fills the empty days: quick dinners (30 minutes or less) from Monday to Thursday, anything at the weekend, no repeats while there is choice. */
export function shuffle(recipes: Recipe[]) {
  const cur = { ...week.get() };
  const used = new Set(Object.values(cur));
  for (const d of DAYS) {
    if (cur[d]) continue;
    const weekday = DAYS.indexOf(d) < 4;
    const fresh = recipes.filter((r) => !used.has(r.id));
    const pool = (fresh.length ? fresh : recipes).filter((r) => !weekday || r.minutes <= 30);
    const from = pool.length ? pool : fresh.length ? fresh : recipes;
    const pick = from[Math.floor(Math.random() * from.length)];
    cur[d] = pick.id; used.add(pick.id);
  }
  week.write(cur);
}

/** Totals for the summary line, and the ingredients of the whole week. */
export function totals(recipes: Recipe[]) {
  const chosen = Object.values(week.get()).map((id) => recipes.find((r) => r.id === id)).filter(Boolean) as Recipe[];
  const minutes = chosen.reduce((n, r) => n + r.minutes, 0);
  const items = chosen.flatMap((r) => r.ingredients.map((i) => ({ name: i.n, q: i.q, u: i.u, recipe: r.title })));
  return { dinners: chosen.length, minutes, items, kinds: new Set(items.map((i) => `${i.name}|${i.u}`)).size };
}

export function addWeekToList(recipes: Recipe[]) {
  const t = totals(recipes);
  list.add(t.items);
  return t;
}

export const hoursText = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} h ${m % 60 ? `${m % 60} min` : ''}`.trim() : `${m} min`);

/** First visit only: a sample week to start from (the quickest dinners early in the week), so the board is never empty. Never overwrites a saved plan. */
export function seed(recipes: Recipe[]) {
  try { if (localStorage.getItem(KEY) !== null) return; } catch { return; }
  const byTime = [...recipes].sort((a, b) => a.minutes - b.minutes || a.title.localeCompare(b.title));
  const start: Record<string, string> = {};
  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].forEach((d, i) => { if (byTime[i]) start[d] = byTime[i].id; });
  week.write(start);
}
