/** Day 046 · Wildcombe Herbal · behaviour shared by every page: the menu, the basket drawer and its lines, quick Add buttons, the newsletter field. */
import { cart, totals, unitOf, wireCount, money, FREE_OVER } from './cart';
import { byId } from './catalogue';

declare global { interface Window { __lenis?: { stop?: () => void; start?: () => void } } }

const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s)!;
const B = '/day-046-herbal-shop';

/* Mobile menu. */
const burger = $<HTMLButtonElement>('[data-burger]'), menu = $('[data-menu]');
const setMenu = (open: boolean) => { burger.setAttribute('aria-expanded', String(open)); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); menu.hidden = !open; };
burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
matchMedia('(min-width: 900px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

/* The header slides away on the way down and returns on the way up. */
const header = $('[data-header]');
let last = scrollY;
addEventListener('scroll', () => {
  const y = scrollY, away = y > last && y > 200 && burger.getAttribute('aria-expanded') !== 'true' && $('[data-drawer]').hidden;
  header.classList.toggle('is-away', away); document.querySelector('.thecore-badge')?.classList.toggle('is-away', away); last = y;
}, { passive: true });

/* Basket drawer. */
const drawer = $('[data-drawer]'), linesEl = $('[data-drawer-lines]'), footEl = $('[data-drawer-foot]');
const bank = (id: string) => { const i = document.querySelector<HTMLImageElement>(`[data-plate-bank] img[data-pid="${id}"]`); return i?.currentSrc || i?.src || ''; };
let opener: HTMLElement | null = null;
function render() {
  const lines = cart.lines(), t = totals();
  linesEl.innerHTML = lines.length
    ? `<div class="wh-drawer__bar" style="--p:${Math.min(100, (1 - t.toFree / FREE_OVER) * 100)}%">${t.toFree > 0 ? `Add ${money(t.toFree)} for free delivery` : 'Your delivery is free'}<i></i></div>` + lines.map((l) => {
      const p = byId(l.id), s = p.sizes.find((x) => x.id === l.size)!;
      return `<div class="wh-line" data-key="${l.key}"><a class="wh-line__img" style="--f:${p.field}" href="${B}/shop/${p.id}/"><img src="${bank(p.id)}" alt="" /></a><div><b>${p.name}</b><span>${s.label}</span><div class="wh-qty" role="group" aria-label="Quantity for ${p.name}"><button type="button" data-q="-1" aria-label="One fewer">−</button><output>${l.qty}</output><button type="button" data-q="1" aria-label="One more">+</button></div><br /><button type="button" class="wh-line__rm" data-rm>Remove</button></div><span class="wh-line__price">${money(unitOf(l) * l.qty)}</span></div>`;
    }).join('')
    : '<p class="wh-empty">Your basket is empty. A cup of something green, perhaps?</p>';
  footEl.innerHTML = lines.length
    ? `<div class="wh-sum"><span>Subtotal</span><span>${money(t.sub)}</span></div>${t.promoOk ? `<div class="wh-sum"><span>WILD10</span><span>−${money(t.discount)}</span></div>` : ''}<div class="wh-sum wh-sum--total"><span>Total</span><span>${money(t.total)}</span></div><p class="wh-soft" style="font-size:.9375rem">Delivery is worked out at checkout.</p><a class="wh-btn" href="${B}/checkout/">Checkout</a><a class="wh-btn wh-btn--ghost" href="${B}/basket/">View basket</a>`
    : `<a class="wh-btn" href="${B}/shop/">Shop the cabinet</a>`;
}
function open(from?: HTMLElement) { opener = from ?? (document.activeElement as HTMLElement); render(); drawer.hidden = false; $<HTMLElement>('.wh-drawer__x').focus(); window.__lenis?.stop?.(); }
function close() { drawer.hidden = true; opener?.focus(); window.__lenis?.start?.(); }
document.querySelectorAll('[data-drawer-open]').forEach((b) => b.addEventListener('click', () => open(b as HTMLElement)));
addEventListener('drawer:open', () => open());
drawer.addEventListener('click', (e) => {
  const t = e.target as HTMLElement;
  if (t.closest('[data-drawer-close]')) return close();
  const row = t.closest<HTMLElement>('.wh-line'); if (!row) return;
  const key = row.dataset.key!, line = cart.lines().find((l) => l.key === key)!;
  const q = t.closest<HTMLElement>('[data-q]');
  if (q) cart.setQty(key, line.qty + Number(q.dataset.q));
  if (t.closest('[data-rm]')) cart.remove(key);
});
addEventListener('keydown', (e) => { if (e.key === 'Escape' && !drawer.hidden) close(); });
addEventListener('cart:change', () => { if (!drawer.hidden) render(); });

/* Quick Add buttons anywhere on a page: data-add="id" data-size="size". */
const toast = $('[data-toast]');
let tt = 0;
addEventListener('cart:added', (e) => {
  const { id } = (e as CustomEvent).detail, p = byId(id);
  toast.textContent = `${p.name} added to your basket`; toast.hidden = false; clearTimeout(tt); tt = window.setTimeout(() => { toast.hidden = true; }, 2200);
});
document.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLElement>('[data-add]');
  if (!b || b.hasAttribute('data-add-page')) return;
  cart.add(b.dataset.add!, b.dataset.size!, 1);
});

/* Newsletter. */
$('[data-news]').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = $<HTMLInputElement>('#wh-news-in'), ok = $('[data-news-ok]');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim())) { ok.textContent = 'Please enter a valid email address.'; input.focus(); return; }
  ok.textContent = 'Thank you. Our first note will arrive with the next harvest.'; input.value = '';
});

wireCount();

/* Parts of a page rise as they arrive. */
const rise = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); rise.unobserve(e.target); } }), { threshold: 0.12 });
document.querySelectorAll('[data-rise]').forEach((el) => rise.observe(el));
