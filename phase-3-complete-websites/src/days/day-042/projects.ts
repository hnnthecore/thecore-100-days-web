/** Day 042 · Atelier Nord · projects page: filter by type and switch between grid and list, remembered in the URL hash. */
const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const grid = $('[data-grid]');
const cards = [...grid.querySelectorAll<HTMLElement>('[data-project]')];
let type = 'all';

function paint() {
  const list = cards.filter((c) => type === 'all' || c.dataset.type === type);
  const shown = new Set(list);
  cards.forEach((c, i) => { c.hidden = !shown.has(c); c.style.animationDelay = `${i * 40}ms`; });
  $('[data-count]').textContent = `${list.length} ${list.length === 1 ? 'project' : 'projects'}${type !== 'all' ? ` · ${type}` : ''}`;
}
function setType(t: string) {
  type = t;
  document.querySelectorAll<HTMLButtonElement>('[data-types] button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.type === t)));
  history.replaceState(null, '', t === 'all' ? location.pathname : `#${t}`);
  paint();
}
$('[data-types]').addEventListener('click', (e) => { const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button'); if (b) setType(b.dataset.type!); });
$('[data-views]').addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
  if (!b) return;
  grid.classList.toggle('is-list', b.dataset.view === 'list');
  document.querySelectorAll<HTMLButtonElement>('[data-views] button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
});
const known = [...document.querySelectorAll<HTMLButtonElement>('[data-types] button')].map((b) => b.dataset.type);
setType(known.includes(decodeURIComponent(location.hash.slice(1))) ? decodeURIComponent(location.hash.slice(1)) : 'all');
