/**
 * Day 041 · Pagebound Books · behaviour shared by every page: sticky-header state, mobile menu and the live basket count.
 */
import { count } from './basket';

const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

const burger = $<HTMLButtonElement>('[data-burger]');
const menu = $('[data-menu]');
function setMenu(open: boolean) {
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menu.hidden = !open;
}
burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) setMenu(false); });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); } });
matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

function paintCount() {
  const n = count();
  document.querySelectorAll<HTMLElement>('[data-basket-count]').forEach((el) => { el.textContent = String(n); el.hidden = n === 0; });
  document.querySelectorAll<HTMLElement>('[data-basket-link]').forEach((el) => el.setAttribute('aria-label', `Basket, ${n} item${n === 1 ? '' : 's'}`));
}
addEventListener('basket:change', paintCount);
paintCount();

/* ---------- "Add" buttons anywhere on the site ---------- */
import { add } from './basket';
let toastTimer = 0;
export function toast(html: string) {
  document.querySelector('.pb-toast')?.remove();
  const t = document.createElement('div');
  t.className = 'pb-toast'; t.setAttribute('role', 'status'); t.innerHTML = html;
  document.querySelector('.pb')!.append(t);
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => t.remove(), 4500);
}
document.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-quick]');
  if (!b) return;
  add({ slug: b.dataset.quick!, title: b.dataset.title!, author: b.dataset.author!, price: Number(b.dataset.price), palette: Number(b.dataset.palette), pattern: Number(b.dataset.pattern) });
  const basketHref = document.querySelector<HTMLAnchorElement>('[data-basket-link]')!.getAttribute('href');
  toast(`Added “${b.dataset.title}” <a href="${basketHref}">View basket</a>`);
});
