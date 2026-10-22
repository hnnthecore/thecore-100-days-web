/** Day 042 · Atelier Nord · home page behaviour: walk the elevation (pinned on wide screens, a plain swipe elsewhere) and the project preview. */
export {};
declare global { interface Window { __lenis?: { scrollTo: (y: number, o?: { duration?: number }) => void } } }
const sec = document.querySelector<HTMLElement>('[data-walk]');
const view = document.querySelector<HTMLElement>('[data-view]');
const track = document.querySelector<HTMLElement>('[data-track]');
const metres = document.querySelector<HTMLElement>('[data-metres]');
const now = document.querySelector<HTMLElement>('[data-now]');
const items = [...document.querySelectorAll<HTMLElement>('[data-b]')];
const PX_PER_M = 80;
const wide = matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)');
let pinned = false, max = 0, ticking = false, last = -1;

/* Where along the elevation we are, in pixels, whichever way it is being moved. */
const pos = () => (pinned ? Math.min(Math.max(-sec!.getBoundingClientRect().top + stickTop(), 0), max) : view!.scrollLeft);
const stickTop = () => parseFloat(getComputedStyle(document.querySelector('.wk__stick')!).top) || 0;

/** The building the visitor is standing in front of: the last one that has started by the left edge of the view (plus the page gutter). */
function current(x: number) {
  const probe = x + 80;
  let at = 0;
  items.forEach((li, i) => { if (li.offsetLeft <= probe) at = i; });
  return at;
}

function paint() {
  ticking = false;
  const x = pos();
  if (pinned) track!.style.transform = `translate3d(${-x}px,0,0)`;
  metres!.textContent = String(Math.round(x / PX_PER_M));
  const at = current(x);
  if (at !== last) { last = at; now!.textContent = `${items[at].dataset.name} · ${items[at].dataset.m}`; }
}
const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };

function measure() {
  pinned = wide.matches;
  sec!.classList.toggle('is-pinned', pinned);
  if (!pinned) { sec!.style.height = ''; track!.style.transform = ''; view!.scrollLeft = 0; paint(); return; }
  const stick = document.querySelector<HTMLElement>('.wk__stick')!;
  max = Math.max(0, track!.scrollWidth - view!.clientWidth);
  sec!.style.height = stick.offsetHeight + max + 'px';
  paint();
}

/* Previous / next building: move the page (pinned) or the strip (plain). Next always goes to the following building, previous to the start of this one or the one before it. */
const GUTTER = 40;
function go(dir: number) {
  const x = pos(), i = current(x);
  const startOf = (k: number) => Math.max(0, items[k].offsetLeft - GUTTER);
  let k = i;
  if (dir > 0) k = Math.min(items.length - 1, i + 1);
  else k = x > startOf(i) + 24 ? i : Math.max(0, i - 1);
  const to = Math.min(startOf(k), pinned ? max : view!.scrollWidth - view!.clientWidth);
  if (pinned) {
    const top = sec!.getBoundingClientRect().top + scrollY - stickTop() + to;
    if (window.__lenis) window.__lenis.scrollTo(top, { duration: 1.2 }); else scrollTo({ top, behavior: 'smooth' });
  } else view!.scrollTo({ left: to, behavior: 'smooth' });
}

if (sec && view && track && metres && now) {
  addEventListener('scroll', queue, { passive: true });
  view.addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', measure);
  wide.addEventListener('change', measure);
  document.querySelector('[data-prev]')?.addEventListener('click', () => go(-1));
  document.querySelector('[data-next]')?.addEventListener('click', () => go(1));
  view.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });
  addEventListener('load', measure);
  measure();
}

/* The register: hover or focus a project and its photograph shows beside the list. */
const reg = document.querySelector('[data-reg]');
const figs = [...document.querySelectorAll<HTMLElement>('[data-pic]')];
if (reg && figs.length) {
  const show = (id: string) => figs.forEach((f) => f.classList.toggle('is-on', f.dataset.pic === id));
  reg.querySelectorAll<HTMLElement>('a[data-for]').forEach((a) => {
    a.addEventListener('mouseenter', () => show(a.dataset.for!));
    a.addEventListener('focus', () => show(a.dataset.for!));
  });
}
