/**
 * Day 048 · The Meridian · "Saved for later". A list of article ids in localStorage, shared by article pages, search and the Saved page.
 * Scripts are bundled per page, so this always reads the stored list instead of trusting a cached copy.
 */
const KEY = 'meridian-saved';
let fallback: string[] = [];

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return fallback;
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
  } catch { return fallback; }
}

export const saved = {
  all: () => read(),
  has: (id: string) => read().includes(id),
  toggle(id: string) {
    const cur = read();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    fallback = next;
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private mode: lasts for this visit */ }
    dispatchEvent(new CustomEvent('saved:change'));
  },
};

/** Wires every [data-save] button on the page and the header counter. */
export function wireSaveButtons() {
  const paint = () => {
    document.querySelectorAll<HTMLButtonElement>('[data-save]').forEach((b) => {
      const on = saved.has(b.dataset.save!);
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', `${on ? 'Remove from' : 'Save'} ${b.dataset.title ?? 'article'}${on ? ' saved list' : ' for later'}`);
      if (b.dataset.label !== undefined) b.textContent = on ? 'Saved' : 'Save for later';
    });
    document.querySelectorAll('[data-saved-count]').forEach((el) => (el.textContent = String(saved.all().length)));
  };
  document.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-save]');
    if (b) saved.toggle(b.dataset.save!);
  });
  addEventListener('saved:change', paint);
  paint();
}
