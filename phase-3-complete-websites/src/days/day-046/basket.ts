/** Day 046 · Wildcombe Herbal · the basket page: draws the lines and totals from storage and keeps them in step with every change. */
import { cart, totals, unitOf, money, FREE_OVER } from './cart';
import { byId } from './catalogue';

const root = document.querySelector<HTMLElement>('[data-basket]');
if (root) {
  const B = '/day-046-herbal-shop';
  const lines = root.querySelector<HTMLElement>('[data-lines]')!, sum = root.querySelector<HTMLElement>('[data-sum]')!, go = root.querySelector<HTMLElement>('[data-go]')!;
  const msg = root.querySelector<HTMLElement>('[data-promo-msg]')!, input = root.querySelector<HTMLInputElement>('#promo')!;
  const bank = (id: string) => { const i = document.querySelector<HTMLImageElement>(`[data-plate-bank] img[data-pid="${id}"]`); return i?.currentSrc || i?.src || ''; };
  const render = () => {
    const ls = cart.lines(), t = totals();
    lines.innerHTML = ls.length ? ls.map((l) => {
      const p = byId(l.id), s = p.sizes.find((x) => x.id === l.size)!;
      return `<div class="wh-line wk__line" data-key="${l.key}"><a class="wh-line__img" style="--f:${p.field}" href="${B}/shop/${p.id}/"><img src="${bank(p.id)}" alt="" /></a><div><b>${p.name}</b><span class="wh-latin">${p.latin}</span><span>${s.label}, ${money(s.price)} each</span><div class="wh-qty" role="group" aria-label="Quantity for ${p.name}"><button type="button" data-q="-1" aria-label="One fewer">−</button><output>${l.qty}</output><button type="button" data-q="1" aria-label="One more">+</button></div> <button type="button" class="wh-line__rm" data-rm>Remove</button></div><span class="wh-line__price">${money(unitOf(l) * l.qty)}</span></div>`;
    }).join('') : `<p class="wh-empty">Your basket is empty.</p><p><a class="wh-btn" href="${B}/shop/">Shop the cabinet</a></p>`;
    sum.innerHTML = ls.length ? `<div class="wh-sum"><span>Subtotal</span><span>${money(t.sub)}</span></div>${t.promoOk ? `<div class="wh-sum"><span>WILD10, 10% off</span><span>−${money(t.discount)}</span></div>` : ''}<div class="wh-sum"><span>Delivery</span><span>${t.toFree > 0 ? 'From ' + money(3.95) : 'Free'}</span></div><div class="wh-sum wh-sum--total"><span>Total</span><span>${money(t.total)}</span></div>${t.toFree > 0 ? `<p class="wh-soft">Add ${money(t.toFree)} more for free delivery (over ${money(FREE_OVER)}).</p>` : ''}` : '';
    go.toggleAttribute('hidden', !ls.length);
    input.value = cart.promo();
  };
  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement, row = t.closest<HTMLElement>('.wk__line'); if (!row) return;
    const key = row.dataset.key!, line = cart.lines().find((l) => l.key === key)!;
    const q = t.closest<HTMLElement>('[data-q]'); if (q) cart.setQty(key, line.qty + Number(q.dataset.q));
    if (t.closest('[data-rm]')) cart.remove(key);
  });
  root.querySelector('[data-promo]')!.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = input.value.trim().toUpperCase();
    if (!code) { cart.setPromo(''); msg.textContent = ''; return; }
    cart.setPromo(code);
    msg.textContent = code === 'WILD10' ? 'Code applied: 10% off your order.' : 'Sorry, we do not recognise that code.';
    if (code !== 'WILD10') cart.setPromo('');
    render();
  });
  addEventListener('cart:change', render);
  render();
}
