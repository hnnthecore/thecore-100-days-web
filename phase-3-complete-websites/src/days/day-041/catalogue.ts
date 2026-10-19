/** Day 041 · Pagebound Books · catalogue page: genre chips, search, sort and price filter, with the genre kept in the URL hash. */
const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const grid = $('[data-grid]');
const cards = [...grid.querySelectorAll<HTMLElement>('[data-book]')];
const q = $<HTMLInputElement>('#q'), sort = $<HTMLSelectElement>('#sort'), cheap = $<HTMLInputElement>('#cheap');
let genre = 'all';

function paint() {
  const term = q.value.trim().toLowerCase();
  const list = cards.filter((c) => (genre === 'all' || c.dataset.genre === genre) && (!term || c.dataset.title!.includes(term) || c.dataset.author!.includes(term)) && (!cheap.checked || Number(c.dataset.price) < 10));
  const key = sort.value;
  list.sort((a, b) => key === 'price-asc' ? Number(a.dataset.price) - Number(b.dataset.price) : key === 'price-desc' ? Number(b.dataset.price) - Number(a.dataset.price) : key === 'author' ? a.dataset.author!.localeCompare(b.dataset.author!) : a.dataset.title!.localeCompare(b.dataset.title!));
  const shown = new Set(list);
  cards.forEach((c) => (c.hidden = !shown.has(c)));
  list.forEach((c) => grid.append(c));
  $('[data-count]').textContent = `${list.length} ${list.length === 1 ? 'book' : 'books'}${genre !== 'all' ? ` in ${genre}` : ''}${term ? ` matching “${q.value.trim()}”` : ''}`;
  $('[data-empty]').hidden = list.length > 0;
}
function setGenre(g: string) {
  genre = g;
  document.querySelectorAll<HTMLButtonElement>('[data-genres] button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.genre === g)));
  history.replaceState(null, '', g === 'all' ? location.pathname : `#${encodeURIComponent(g)}`);
  paint();
}
$('[data-genres]').addEventListener('click', (e) => { const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button'); if (b) setGenre(b.dataset.genre!); });
[q, sort, cheap].forEach((el) => el.addEventListener('input', paint));
$<HTMLFormElement>('[data-filters]').addEventListener('submit', (e) => e.preventDefault());
const fromHash = decodeURIComponent(location.hash.slice(1));
const known = [...document.querySelectorAll<HTMLButtonElement>('[data-genres] button')].map((b) => b.dataset.genre);
setGenre(known.includes(fromHash) ? fromHash : 'all');
