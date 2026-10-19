/** Day 041 · Pagebound Books · basket page: editable lines, totals and a click-and-collect reservation form. */
import { read, setQty, clear, count, total, gbp } from './basket';
import { bookCoverHtml } from './bookcover';
import { wire } from './forms';

const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const BASE = '/day-041-bookshop';
let finished = false;

function paint() {
  if (finished) return;
  const lines = read();
  $('[data-empty]').hidden = lines.length > 0;
  $('[data-full]').hidden = lines.length === 0;
  const link = (slug: string) => document.querySelector<HTMLAnchorElement>('[data-basket-link]')!.getAttribute('href')!.replace('basket/', `books/${slug}/`).replace('basket', `books/${slug}`);
  $('[data-lines]').innerHTML = lines.map((l) => `<li class="pb-line">
    <a class="pb-cover" href="${link(l.slug)}" aria-hidden="true" tabindex="-1">${bookCoverHtml(l.slug, l.title, l.author, l.palette, l.pattern)}</a>
    <div><h3><a href="${link(l.slug)}">${esc(l.title)}</a></h3><p>${esc(l.author)} · ${gbp(l.price)} each</p>
      <div class="pb-qty mt-2" role="group" aria-label="Quantity of ${esc(l.title)}"><button type="button" data-set="${l.slug}:${l.qty - 1}" aria-label="Fewer">−</button><output aria-live="polite">${l.qty}</output><button type="button" data-set="${l.slug}:${Math.min(10, l.qty + 1)}" aria-label="More">+</button></div></div>
    <div class="pb-line__end"><b class="pb-price">${gbp(l.price * l.qty)}</b><button type="button" class="pb-line__rm" data-set="${l.slug}:0">Remove</button></div>
  </li>`).join('');
  $('[data-items]').textContent = `${count()} book${count() === 1 ? '' : 's'}`;
  $('[data-total]').textContent = gbp(total());
}
$('[data-lines]').addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-set]');
  if (!b) return;
  const [slug, qty] = b.dataset.set!.split(':');
  setQty(slug, Number(qty));
});
addEventListener('basket:change', paint);

/* Collection dates: the next six days the shop is open, Sunday included. */
const sel = $<HTMLSelectElement>('[data-when]');
const days = Array.from({ length: 6 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i + 1); return d; });
sel.innerHTML = days.map((d, i) => `<option value="${d.toISOString().slice(0, 10)}">${d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}${i === 0 ? ' (earliest)' : ''}</option>`).join('');

const form = $<HTMLFormElement>('[data-checkout]');
const check = wire(form);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!check()) return;
  const n = count(), sum = total();
  $('[data-done-name]').textContent = $<HTMLInputElement>('#c-name').value.trim().split(/\s+/)[0];
  $('[data-done-text]').textContent = `${n} book${n === 1 ? '' : 's'}, ${gbp(sum)} to pay in store. Ready to collect on ${sel.selectedOptions[0].text.replace(' (earliest)', '')} from 10 am${$<HTMLInputElement>('#c-gift').checked ? ', gift wrapped' : ''}.`;
  $('[data-ref]').textContent = 'PB-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  finished = true;
  clear();
  $('[data-full]').hidden = true; $('[data-empty]').hidden = true;
  const done = $('[data-done]'); done.hidden = false; done.focus();
});
void BASE;
paint();
