/** Day 046 · Wildcombe Herbal · product page: choose a size and a quantity, see the price, add to the basket and open it. */
import { cart, money } from './cart';

const root = document.querySelector<HTMLElement>('[data-product]');
if (root) {
  const id = root.dataset.product!;
  const form = root.querySelector<HTMLFormElement>('[data-buy]')!;
  const price = root.querySelector<HTMLElement>('[data-price]')!;
  const qtyEl = root.querySelector<HTMLElement>('[data-qty]')!;
  let qty = 1;
  const size = () => form.querySelector<HTMLInputElement>('input[name="size"]:checked')!;
  const paint = () => { price.textContent = money(Number(size().dataset.price) * qty); qtyEl.textContent = String(qty); };
  form.addEventListener('change', paint);
  form.querySelectorAll<HTMLElement>('[data-q]').forEach((b) => b.addEventListener('click', () => { qty = Math.max(1, Math.min(12, qty + Number(b.dataset.q))); paint(); }));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    cart.add(id, size().value, qty);
    dispatchEvent(new CustomEvent('drawer:open'));
  });
  paint();
}
