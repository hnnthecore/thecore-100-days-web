/** Day 042 · Atelier Nord · behaviour shared by every page: sticky header state and the mobile menu. */
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
