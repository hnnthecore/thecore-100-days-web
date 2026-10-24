/**
 * Day 050 · Citrus & Salt · the kitchen maths and storage shared by every page:
 * friendly amounts (½, ¼, 1½), metric / US unit conversion, the shopping list and favourites.
 * Lists live in localStorage and are re-read on every call, because each page's scripts are bundled separately.
 */

/* ---------- Amounts ---------- */
const FR: [number, string][] = [[0.125, '⅛'], [0.25, '¼'], [1 / 3, '⅓'], [0.5, '½'], [2 / 3, '⅔'], [0.75, '¾']];

/** 1.5 → "1½", 0.25 → "¼", 250 → "250", 2.333 → "2⅓". */
export function pretty(n: number): string {
  if (n >= 20) return String(Math.round(n / 5) * 5 || Math.round(n));
  const whole = Math.floor(n + 1e-9);
  const rest = n - whole;
  if (rest < 0.06) return String(whole || (n < 0.06 ? 0 : 0));
  const near = FR.find(([v]) => Math.abs(rest - v) < 0.07);
  if (near) return (whole ? String(whole) : '') + near[1];
  return String(Math.round(n * 10) / 10);
}

type Conv = { to: string; factor: number };
const US: Record<string, Conv> = { g: { to: 'oz', factor: 0.03527 }, ml: { to: 'fl oz', factor: 0.03381 } };

/** Returns the amount and unit as displayed for a unit system, scaled by `ratio`. */
export function amount(q: number, u: string, ratio: number, system: 'metric' | 'us'): { text: string; unit: string } {
  let v = q * ratio, unit = u;
  if (system === 'us' && US[u]) { v *= US[u].factor; unit = US[u].to; }
  return { text: pretty(v), unit };
}

/* ---------- Stored lists ---------- */
function load<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw === null ? fallback : (JSON.parse(raw) as T); } catch { return fallback; }
}
function save(key: string, v: unknown, event: string) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* private mode: lasts for this visit */ }
  dispatchEvent(new CustomEvent(event));
}

export interface Item { id: string; name: string; q: number; u: string; recipe: string; done: boolean }
const LIST = 'citrus-list', FAV = 'citrus-favs';
let memList: Item[] = [], memFav: string[] = [];

export const list = {
  all: (): Item[] => { try { return localStorage.getItem(LIST) === null ? memList : load<Item[]>(LIST, []); } catch { return memList; } },
  /** Adds ingredients, merging with items of the same name and unit. */
  add(items: { name: string; q: number; u: string; recipe: string }[]) {
    const cur = list.all();
    for (const it of items) {
      const hit = cur.find((c) => c.name === it.name && c.u === it.u);
      if (hit) { hit.q += it.q; if (!hit.recipe.includes(it.recipe)) hit.recipe += `, ${it.recipe}`; hit.done = false; }
      else cur.push({ id: `${it.name}|${it.u}`, ...it, done: false });
    }
    memList = cur; save(LIST, cur, 'list:change');
  },
  toggle(id: string) { const cur = list.all(); const h = cur.find((c) => c.id === id); if (h) h.done = !h.done; memList = cur; save(LIST, cur, 'list:change'); },
  remove(id: string) { memList = list.all().filter((c) => c.id !== id); save(LIST, memList, 'list:change'); },
  clearDone() { memList = list.all().filter((c) => !c.done); save(LIST, memList, 'list:change'); },
  clear() { memList = []; save(LIST, memList, 'list:change'); },
};

export const favs = {
  all: (): string[] => { try { return localStorage.getItem(FAV) === null ? memFav : load<string[]>(FAV, []); } catch { return memFav; } },
  has: (id: string) => favs.all().includes(id),
  toggle(id: string) { const cur = favs.all(); memFav = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]; save(FAV, memFav, 'favs:change'); },
};

/** Keeps every [data-fav] heart and the header counters in step with storage. */
export function wireChrome() {
  const paint = () => {
    document.querySelectorAll<HTMLButtonElement>('[data-fav]').forEach((b) => {
      const on = favs.has(b.dataset.fav!);
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', `${on ? 'Remove' : 'Add'} ${b.dataset.title} ${on ? 'from' : 'to'} favourites`);
      if (b.dataset.label !== undefined) b.textContent = on ? 'Saved' : 'Save';
    });
    document.querySelectorAll('[data-list-count]').forEach((el) => (el.textContent = String(list.all().filter((i) => !i.done).length)));
  };
  document.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-fav]');
    if (b) favs.toggle(b.dataset.fav!);
  });
  addEventListener('favs:change', paint);
  addEventListener('list:change', paint);
  paint();
}
