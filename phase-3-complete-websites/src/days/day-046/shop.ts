/** Day 046 · Wildcombe Herbal · the shop page: kind filter and sort on top of the hour-and-taste chooser. The kind and the sort live in the URL hash with the rest. */
import { initCabinet } from './cabinet';

const root = document.querySelector<HTMLElement>('[data-shop]');
if (root) {
  const cards = [...root.querySelectorAll<HTMLElement>('[data-card]')];
  const cab = root.querySelector<HTMLElement>('[data-cab]')!;
  const none = root.querySelector<HTMLElement>('[data-none]')!;
  const catBtns = [...root.querySelectorAll<HTMLButtonElement>('button[data-cat]')];
  const sort = root.querySelector<HTMLSelectElement>('[data-sort]')!;
  const orig = new Map(cards.map((c, i) => [c, i]));
  let cat = '';

  /* The chooser (initCabinet) uses `order` and a dim class; here a card from another kind is hidden outright. */
  const paint = () => {
    cards.forEach((c) => { c.hidden = !!cat && c.dataset.cat !== cat; });
    catBtns.forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.cat ?? '') === cat)));
    const key = (c: HTMLElement) => (sort.value === 'low' ? Number(c.dataset.price) : sort.value === 'high' ? -Number(c.dataset.price) : sort.value === 'name' ? 0 : orig.get(c)!);
    const ordered = [...cards].sort((a, b) => (sort.value === 'name' ? a.dataset.name!.localeCompare(b.dataset.name!) : key(a) - key(b)));
    ordered.forEach((c) => cab.append(c));
    none.hidden = cards.some((c) => !c.hidden);
    const h = new URLSearchParams(location.hash.slice(1)); if (cat) h.set("cat", cat); else h.delete("cat");
    history.replaceState(null, "", h.toString() ? `#${h}` : location.pathname + location.search);
  };
  catBtns.forEach((b) => b.addEventListener('click', () => { cat = b.dataset.cat ?? ''; paint(); }));
  sort.addEventListener('change', paint);
  const q = new URLSearchParams(location.hash.slice(1));
  if (q.get('cat')) cat = q.get('cat')!;
  initCabinet(root);
  addEventListener('hashchange', () => { const p = new URLSearchParams(location.hash.slice(1)); if (p.get('cat') !== null) { cat = p.get('cat')!; paint(); } });
  paint();
}
