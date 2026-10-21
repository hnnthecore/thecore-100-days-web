/** Day 041 · Pagebound Books · home page behaviour: a note for the hovered frame, the shelf sort, and the drag row of moments. */

/* Hover or focus a frame in the hero sheet and its note appears in the fixed place. */
const note = document.querySelector<HTMLElement>('[data-hover-note]');
if (note) {
  const rest = note.textContent ?? '';
  document.querySelectorAll<HTMLElement>('.pg-sheet .pg-f').forEach((f) => {
    const on = () => { note.textContent = f.dataset.note ?? rest; };
    const off = () => { note.textContent = rest; };
    f.addEventListener('mouseenter', on); f.addEventListener('focus', on); f.addEventListener('mouseleave', off); f.addEventListener('blur', off);
  });
}

/* Sort the sheet: press a shelf and everything else dims. */
const chips = document.querySelector<HTMLElement>('[data-chips]');
const mason = document.querySelector<HTMLElement>('[data-mason]');
if (chips && mason) {
  const figs = [...mason.querySelectorAll<HTMLElement>('figure')];
  chips.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
    if (!b) return;
    const g = b.dataset.g!;
    chips.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    figs.forEach((f) => f.classList.toggle('is-dim', g !== 'all' && f.dataset.genre !== g));
  });
}

/* The row of moments: the buttons step along it, the bar shows how far you are. */
const row = document.querySelector<HTMLElement>('[data-row]');
if (row) {
  const bar = document.querySelector<HTMLElement>('[data-bar]')!;
  const step = () => (row.firstElementChild as HTMLElement).offsetWidth + 32;
  const paint = () => {
    const max = row.scrollWidth - row.clientWidth;
    const share = max > 0 ? row.scrollLeft / max : 0;
    const w = Math.max(0.15, row.clientWidth / row.scrollWidth);
    bar.style.width = w * 100 + '%';
    bar.style.marginLeft = share * (1 - w) * 100 + '%';
  };
  row.addEventListener('scroll', paint, { passive: true });
  document.querySelector('[data-prev]')?.addEventListener('click', () => row.scrollBy({ left: -step(), behavior: 'smooth' }));
  document.querySelector('[data-next]')?.addEventListener('click', () => row.scrollBy({ left: step(), behavior: 'smooth' }));
  row.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') row.scrollBy({ left: step(), behavior: 'smooth' }); if (e.key === 'ArrowLeft') row.scrollBy({ left: -step(), behavior: 'smooth' }); });
  paint();
  addEventListener('resize', paint);
}
