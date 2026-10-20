/** Day 044 · Fathom · demo booking: details, then the next five working days with seeded availability, then a confirmation. */
import { wire } from '../shared/forms';

const root = document.querySelector<HTMLElement>('[data-demo]')!;
const $ = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
const step = (n: number) => {
  root.querySelectorAll<HTMLElement>('[data-step]').forEach((el) => (el.hidden = el.dataset.step !== String(n)));
  root.querySelectorAll('[data-step-bar]').forEach((b, i) => b.classList.toggle('is-on', i < Math.min(n, 2)));
  const target = root.querySelector<HTMLElement>(`[data-step="${n}"]`)!;
  (n === 3 ? target : target.querySelector<HTMLElement>('input,button'))?.focus();
};

/* The next five working days, starting tomorrow. */
const days: Date[] = [];
for (let d = new Date(), n = 0; days.length < 5; n++) { d = new Date(Date.now() + (n + 1) * 864e5); if (d.getDay() % 6) days.push(d); }
const TIMES = ['09:30', '10:00', '11:00', '12:30', '14:00', '15:30'];
const taken = (day: number, t: number) => ((day * 31 + t * 17 + 7) % 5) === 0;

let day = 0, time = -1;
const dayBox = $('[data-days]'), slotBox = $('[data-slots]');
const label = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

function paint() {
  dayBox.innerHTML = days.map((d, i) => `<button type="button" aria-pressed="${i === day}" data-i="${i}">${d.toLocaleDateString('en-GB', { weekday: 'short' })}<b>${d.getDate()}</b></button>`).join('');
  slotBox.innerHTML = TIMES.map((t, i) => `<button type="button" aria-pressed="${i === time}" data-t="${i}" ${taken(day, i) ? 'disabled aria-label="' + t + ', unavailable"' : ''}>${t}</button>`).join('');
}
dayBox.addEventListener('click', (e) => { const b = (e.target as HTMLElement).closest<HTMLElement>('[data-i]'); if (!b) return; day = Number(b.dataset.i); time = -1; paint(); });
slotBox.addEventListener('click', (e) => { const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-t]'); if (!b || b.disabled) return; time = Number(b.dataset.t); $('[data-slot-e]').hidden = true; paint(); });
paint();

const form = root.querySelector<HTMLFormElement>('form[data-step="1"]')!;
const check = wire(form);
form.addEventListener('submit', (e) => { e.preventDefault(); if (check()) step(2); });
$('[data-back]').addEventListener('click', () => step(1));
$('[data-book]').addEventListener('click', () => {
  if (time < 0) { $('[data-slot-e]').hidden = false; return; }
  const name = (document.getElementById('d-name') as HTMLInputElement).value.trim().split(/\s+/)[0];
  const email = (document.getElementById('d-email') as HTMLInputElement).value.trim();
  $('[data-d-name]').textContent = name;
  $('[data-d-text]').textContent = `${label(days[day])} at ${TIMES[time]}. A calendar invite is on its way to ${email}. (Demo: nothing was sent.)`;
  step(3);
});
