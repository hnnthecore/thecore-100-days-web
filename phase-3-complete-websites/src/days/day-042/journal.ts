/** Day 042 · Atelier Nord · journal index: category chips and live search. */
const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const posts = [...document.querySelectorAll<HTMLElement>('[data-post]')];
const q = $<HTMLInputElement>('#s');
let cat = 'all';
function paint() {
  const term = q.value.trim().toLowerCase();
  const ok = posts.filter((p) => (cat === 'all' || p.dataset.cat === cat) && (!term || p.dataset.text!.includes(term)));
  const set = new Set(ok);
  posts.forEach((p) => (p.hidden = !set.has(p)));
  $('[data-count]').textContent = `${ok.length} ${ok.length === 1 ? 'article' : 'articles'}${cat !== 'all' ? ` in ${cat}` : ''}${term ? ` matching “${q.value.trim()}”` : ''}`;
  $('[data-empty]').hidden = ok.length > 0;
}
$('[data-cats]').addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
  if (!b) return;
  cat = b.dataset.cat!;
  document.querySelectorAll<HTMLButtonElement>('[data-cats] button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  paint();
});
q.addEventListener('input', paint);
