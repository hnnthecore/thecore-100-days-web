/** Day 042 · Atelier Nord · projects index: filter the sheet by type (kept in the URL hash) and preview a project when you hover or focus its row. */
const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const grid = $('[data-grid]');
const rows = [...grid.querySelectorAll<HTMLElement>('[data-project]')];
const figs = [...document.querySelectorAll<HTMLElement>('[data-for]')];
let type = 'all';

function preview(slug: string) { figs.forEach((f) => f.classList.toggle('is-on', f.dataset.for === slug)); }
function paint() {
  const list = rows.filter((c) => type === 'all' || c.dataset.type === type);
  const shown = new Set(list);
  rows.forEach((c) => { c.hidden = !shown.has(c); });
  $('[data-count]').textContent = `${list.length} ${list.length === 1 ? 'project' : 'projects'}${type !== 'all' ? ` · ${type}` : ''}`;
  if (list[0]) preview(list[0].dataset.slug!);
}
function setType(t: string) {
  type = t;
  document.querySelectorAll<HTMLButtonElement>('[data-types] button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.type === t)));
  history.replaceState(null, '', t === 'all' ? location.pathname : `#${t}`);
  paint();
}
$('[data-types]').addEventListener('click', (e) => { const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button'); if (b) setType(b.dataset.type!); });
rows.forEach((r) => { r.addEventListener('mouseenter', () => preview(r.dataset.slug!)); r.addEventListener('focusin', () => preview(r.dataset.slug!)); });
const known = [...document.querySelectorAll<HTMLButtonElement>('[data-types] button')].map((b) => b.dataset.type);
setType(known.includes(decodeURIComponent(location.hash.slice(1))) ? decodeURIComponent(location.hash.slice(1)) : 'all');
