/** Day 042 · Atelier Nord · home page behaviour: walk the elevation (pinned on wide screens, a plain swipe elsewhere) and the project preview. */
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

function paint() {
  ticking = false;
  const x = pos();
  if (pinned) track!.style.transform = `translate3d(${-x}px,0,0)`;
  metres!.textContent = String(Math.round(x / PX_PER_M));
  const probe = x + view!.clientWidth * 0.4;
  let at = 0;
  items.forEach((li, i) => { if (li.offsetLeft <= probe) at = i; });
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

/* Previous / next building: move the page (pinned) or the strip (plain). */
function go(dir: number) {
  const x = pos();
  const target = dir > 0 ? items.find((li) => li.offsetLeft > x + 8) : [...items].reverse().find((li) => li.offsetLeft < x - 8);
  const to = target ? Math.min(target.offsetLeft - 24, max || Infinity) : dir > 0 ? max || view!.scrollWidth : 0;
  if (pinned) scrollTo({ top: sec!.getBoundingClientRect().top + scrollY - stickTop() + Math.max(to, 0), behavior: 'smooth' });
  else view!.scrollTo({ left: Math.max(to, 0), behavior: 'smooth' });
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
