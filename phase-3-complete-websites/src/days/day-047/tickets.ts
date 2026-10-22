/** Day 047 · Solstice Sound · ticket page: live order summary, quantity stepper, checkout dialog and a booking reference. */
import { wire } from '../shared/forms';
import { plan } from './plan';

const root = document.querySelector<HTMLElement>('[data-tix]')!;
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!;
const FEE = 4.5, MAX = 8;
let qty = 2;
const gbp = (n: number) => '£' + n.toFixed(2).replace(/\.00$/, '');
const tier = () => root.querySelector<HTMLInputElement>('input[name="tier"]:checked')!;
const extras = () => [...root.querySelectorAll<HTMLInputElement>('[data-extra]:checked')];

function calc() {
  const t = tier();
  const lines: [string, number][] = [[`${qty} × ${t.dataset.name}`, qty * Number(t.dataset.price)]];
  extras().forEach((x) => {
    const per = x.dataset.extra === 'shuttle' ? qty : x.dataset.extra === 'camp' ? Math.ceil(qty / 4) : 1;
    lines.push([`${per} × ${x.dataset.name}`, per * Number(x.dataset.price)]);
  });
  lines.push(['Booking fee', FEE]);
  return { lines, total: lines.reduce((s, l) => s + l[1], 0) };
}

function paint() {
  $('[data-qty]').textContent = String(qty);
  $<HTMLElement>('[data-dayrow]').hidden = tier().value !== 'day';
  const { lines, total } = calc();
  $('[data-lines]').innerHTML = lines.map(([l, v]) => `<div><dt>${l}</dt><dd>${gbp(v)}</dd></div>`).join('');
  $('[data-total]').textContent = gbp(total);
}
root.addEventListener('change', paint);
document.querySelectorAll<HTMLButtonElement>('[data-q]').forEach((b) => b.addEventListener('click', () => { qty = Math.min(MAX, Math.max(1, qty + Number(b.dataset.q))); paint(); }));
paint();

const dlg = $<HTMLDialogElement>('[data-dialog]');
const form = $<HTMLFormElement>('[data-form]');
const check = wire(form);
$('[data-checkout]').addEventListener('click', () => {
  const { total } = calc();
  const t = tier();
  const what = t.value === 'day' ? `${qty} day pass${qty > 1 ? 'es' : ''} for ${$<HTMLSelectElement>('[data-day]').value}` : `${qty} ${t.dataset.name} ticket${qty > 1 ? 's' : ''}`;
  $('[data-summary]').textContent = `${what}. Total ${gbp(total)}.`;
  $<HTMLElement>('[data-pay]').hidden = false;
  $<HTMLElement>('[data-done]').hidden = true;
  dlg.showModal();
});
dlg.addEventListener('click', (e) => { const t = e.target as HTMLElement; if (t === dlg || t.closest('[data-close]')) dlg.close(); });
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!check()) return;
  const ref = 'SS27-' + Math.random().toString(36).slice(2, 7).toUpperCase();
  const first = $<HTMLInputElement>('#c-name').value.trim().split(/\s+/)[0];
  const n = plan.all().length;
  $('[data-done-text]').textContent = `Thank you ${first}! Your tickets are on their way to ${$<HTMLInputElement>('#c-email').value.trim()}.${n ? ` You also have ${n} act${n > 1 ? 's' : ''} in your plan.` : ''}`;
  $('[data-ref]').textContent = ref;
  $<HTMLElement>('[data-pay]').hidden = true;
  const done = $<HTMLElement>('[data-done]');
  done.hidden = false; done.focus();
});
