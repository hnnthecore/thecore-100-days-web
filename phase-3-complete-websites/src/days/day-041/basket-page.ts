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

/* Pick-up slots: the next six days, one-hour windows at the till. Some are full, always the same ones for the same date. */
const SLOTS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const days = Array.from({ length: 6 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i + 1); return d; }).filter((d) => d.getDay() !== -1);
const full = (d: Date, t: string) => { let h = 3; for (const c of d.toISOString().slice(0, 10) + t) h = (h * 33 + c.charCodeAt(0)) >>> 0; return h % 4 === 0; };
const lastHour = (d: Date) => (d.getDay() === 0 ? 15 : 17);
let pickDay = 0, pickSlot = '';
const daysEl = $('[data-days]'), slotsEl = $('[data-slots]'), noteEl = $('[data-slotnote]');
const dayLabel = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
function paintSlots() {
  const d = days[pickDay];
  daysEl.innerHTML = days.map((x, i) => `<button type="button" class="pb-day" data-day="${i}" aria-pressed="${i === pickDay}"><b>${x.toLocaleDateString('en-GB', { weekday: 'short' })}</b><span>${x.getDate()}</span></button>`).join('');
  const open = SLOTS.filter((t) => Number(t.slice(0, 2)) <= lastHour(d) && (d.getDay() !== 0 || Number(t.slice(0, 2)) >= 11));
  if (!open.some((t) => t === pickSlot && !full(d, t))) pickSlot = open.find((t) => !full(d, t)) ?? '';
  slotsEl.innerHTML = open.map((t) => `<button type="button" class="pb-slot" data-slot="${t}" aria-pressed="${t === pickSlot}" ${full(d, t) ? 'disabled' : ''}>${t}${full(d, t) ? '<small>Full</small>' : ''}</button>`).join('');
  noteEl.textContent = pickSlot ? `Collect on ${dayLabel(d)}, ${pickSlot} to ${String(Number(pickSlot.slice(0, 2)) + 1).padStart(2, '0')}:00` : 'No slots left that day. Please try another.';
}
daysEl.addEventListener('click', (e) => { const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-day]'); if (b) { pickDay = Number(b.dataset.day); paintSlots(); } });
slotsEl.addEventListener('click', (e) => { const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-slot]'); if (b && !b.disabled) { pickSlot = b.dataset.slot!; paintSlots(); } });
paintSlots();

const form = $<HTMLFormElement>('[data-checkout]');
const check = wire(form);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!check()) return;
  if (!pickSlot) { noteEl.textContent = 'Please choose a pick-up slot.'; return; }
  const n = count(), sum = total();
  $('[data-done-name]').textContent = $<HTMLInputElement>('#c-name').value.trim().split(/\s+/)[0];
  $('[data-done-text]').textContent = `${n} book${n === 1 ? '' : 's'}, ${gbp(sum)} to pay in store. Ready to collect on ${dayLabel(days[pickDay])}, ${pickSlot} to ${String(Number(pickSlot.slice(0, 2)) + 1).padStart(2, '0')}:00${$<HTMLInputElement>('#c-gift').checked ? ', gift wrapped' : ''}.`;
  $('[data-ref]').textContent = 'PB-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  finished = true;
  clear();
  $('[data-full]').hidden = true; $('[data-empty]').hidden = true;
  const done = $('[data-done]'); done.hidden = false; done.focus();
});
void BASE;
paint();
