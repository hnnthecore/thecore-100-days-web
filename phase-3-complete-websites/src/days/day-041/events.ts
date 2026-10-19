/** Day 041 · Pagebound Books · events page: type filter, hiding past dates, and a native <dialog> seat reservation. */
import { wire } from './forms';

const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const items = [...document.querySelectorAll<HTMLElement>('[data-event]')];
const today = new Date().toISOString().slice(0, 10);
items.forEach((li) => { if (li.dataset.date! < today) li.classList.add('is-past'); });

let kind = 'all';
function paint() {
  let n = 0;
  items.forEach((li) => { const ok = (kind === 'all' || li.dataset.kind === kind) && li.dataset.date! >= today; li.hidden = !ok; if (ok) n++; });
  $('[data-none]').hidden = n > 0;
}
$('[data-kinds]').addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
  if (!b) return;
  kind = b.dataset.kind!;
  document.querySelectorAll<HTMLButtonElement>('[data-kinds] button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  paint();
});
paint();

const dlg = $<HTMLDialogElement>('[data-dialog]');
const form = $<HTMLFormElement>('[data-rsvp-form]');
const check = wire(form);
const seats = $<HTMLSelectElement>('#r-n');
let opener: HTMLElement | null = null, price = 0, title = '', when = '';
const paintTotal = () => { $('[data-d-total]').textContent = price ? '£' + (price * Number(seats.value)).toFixed(2) : 'Free'; };

$('[data-events]').addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-rsvp]');
  if (!b || b.disabled) return;
  opener = b; price = Number(b.dataset.price); title = b.dataset.title!; when = b.dataset.when!;
  const left = Math.min(6, Number(b.dataset.left));
  seats.innerHTML = Array.from({ length: left }, (_, i) => `<option>${i + 1}</option>`).join('');
  $('[data-d-title]').textContent = title; $('[data-d-when]').textContent = when;
  form.hidden = false; $('[data-d-done]').hidden = true; form.reset();
  form.querySelectorAll('[aria-invalid]').forEach((f) => f.removeAttribute('aria-invalid'));
  paintTotal();
  dlg.showModal();
});
seats.addEventListener('change', paintTotal);
$('[data-close]').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
dlg.addEventListener('close', () => opener?.focus());
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!check()) return;
  const n = Number(seats.value);
  $('[data-d-name]').textContent = $<HTMLInputElement>('#r-name').value.trim().split(/\s+/)[0];
  $('[data-d-text]').textContent = `${n} seat${n > 1 ? 's' : ''} for “${title}”, ${when}. We’ve emailed your confirmation.`;
  $('[data-d-ref]').textContent = 'EV-' + Math.random().toString(36).slice(2, 7).toUpperCase();
  form.hidden = true;
  const done = $('[data-d-done]'); done.hidden = false; done.focus();
});
