/** Day 041 · Pagebound Books · contact page: open-now status read from the hours table, and the message form. */
import { wire } from './forms';

const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const HOURS: Record<number, [number, number]> = {};
document.querySelectorAll<HTMLTableRowElement>('.pb-hours tr').forEach((tr) => {
  const m = tr.querySelector('td')!.textContent!.match(/(\d+):(\d+)\s*–\s*(\d+):(\d+)/)!;
  HOURS[Number(tr.dataset.day)] = [Number(m[1]) * 60 + Number(m[2]), Number(m[3]) * 60 + Number(m[4])];
});
const now = new Date();
const mins = now.getHours() * 60 + now.getMinutes();
const [open, close] = HOURS[now.getDay()];
document.querySelectorAll<HTMLTableRowElement>('.pb-hours tr').forEach((tr) => tr.classList.toggle('is-today', Number(tr.dataset.day) === now.getDay()));
const isOpen = mins >= open && mins < close;
$('[data-dot]').classList.toggle('is-closed', !isOpen);
const t = (m: number) => { const h = Math.floor(m / 60); return `${h > 12 ? h - 12 : h}${m % 60 ? ':' + String(m % 60).padStart(2, '0') : ''} ${h >= 12 ? 'pm' : 'am'}`; };
$('[data-open]').textContent = isOpen ? `Open now, until ${t(close)}` : mins < open ? `Closed, opens today at ${t(open)}` : 'Closed, opens tomorrow';

const form = $<HTMLFormElement>('[data-contact]');
const check = wire(form);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const ok = $('[data-ok]');
  if (!check()) { ok.textContent = ''; return; }
  ok.textContent = `Thanks ${$<HTMLInputElement>('#m-name').value.trim().split(/\s+/)[0]}, we’ll reply within a working day.`;
  form.reset();
});
