/**
 * Day 051 · Hirewell · the job seeker's two lists, saved jobs and applications, kept in localStorage.
 * Each page's scripts are bundled separately, so every call re-reads storage rather than trusting a cached copy.
 */
function make(key: string, event: string) {
  let memory: string[] = [];
  const read = (): string[] => {
    try { const raw = localStorage.getItem(key); if (raw === null) return memory; const v = JSON.parse(raw); return Array.isArray(v) ? v : []; } catch { return memory; }
  };
  const write = (v: string[]) => {
    memory = v;
    try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* private mode: lasts for this visit */ }
    dispatchEvent(new CustomEvent(event));
  };
  return {
    all: read,
    has: (id: string) => read().includes(id),
    toggle: (id: string) => { const c = read(); write(c.includes(id) ? c.filter((x) => x !== id) : [...c, id]); },
    add: (id: string) => { const c = read(); if (!c.includes(id)) write([...c, id]); },
    remove: (id: string) => write(read().filter((x) => x !== id)),
  };
}

export const saved = make('hirewell-saved', 'saved:change');
export const applied = make('hirewell-applied', 'applied:change');

/** Keeps every [data-save] button and header counter in step with storage. */
export function wireChrome() {
  const paint = () => {
    document.querySelectorAll<HTMLButtonElement>('[data-save]').forEach((b) => {
      const on = saved.has(b.dataset.save!);
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', `${on ? 'Remove' : 'Save'} ${b.dataset.title ?? 'job'}${on ? ' from saved jobs' : ''}`);
      if (b.dataset.label !== undefined) b.textContent = on ? 'Saved' : 'Save job';
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

export const gbp = (n: number) => '£' + n.toLocaleString('en-GB');
/** Salaries under £1,000 are day rates. */
export const pay = (min: number, max: number) => (max < 1000 ? `${gbp(min)} to ${gbp(max)} a day` : `${gbp(min)} to ${gbp(max)}`);
export const ago = (d: string, now = new Date()) => {
  const days = Math.max(0, Math.round((now.getTime() - new Date(d + 'T00:00').getTime()) / 864e5));
  return days === 0 ? 'Today' : days === 1 ? 'Yesterday' : days < 14 ? `${days} days ago` : `${Math.round(days / 7)} weeks ago`;
};
