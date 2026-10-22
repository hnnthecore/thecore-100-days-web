/** Day 045 · Lingua Lane · enrol page: live price (format, course pack, promo code), start dates and a two-step form. */
import { wire } from '../shared/forms';

const root = document.querySelector<HTMLElement>('[data-enrol]')!;
const f = <T extends HTMLElement>(k: string) => root.querySelector<T>(`[data-f="${k}"]`)!;
const s = (k: string) => document.querySelector<HTMLElement>(`[data-s="${k}"]`)!;
const course = f<HTMLSelectElement>('course'), level = f<HTMLSelectElement>('level'), start = f<HTMLSelectElement>('start'), promo = f<HTMLInputElement>('promo'), pack = f<HTMLInputElement>('pack');
const fmt = () => root.querySelector<HTMLInputElement>('input[name="fmt"]:checked')!.value;

/* Arrive from a course page or the level test: /enrol/?course=spanish&level=B1 */
const params = new URLSearchParams(location.search);
if ([...course.options].some((o) => o.value === params.get('course'))) course.value = params.get('course')!;
if ([...level.options].some((o) => o.value === params.get('level'))) level.value = params.get('level')!;

/* The next four Mondays, starting at least a week away. */
const mondays: Date[] = [];
for (let d = new Date(); mondays.length < 4; ) { d = new Date(d.getTime() + 864e5); if (d.getDay() === 1 && d.getTime() - Date.now() > 6 * 864e5) mondays.push(new Date(d)); }
const longDate = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
start.innerHTML = mondays.map((d, i) => `<option value="${i}">${longDate(d)}</option>`).join('');

let discount = 0;
function price() {
  const base = fmt() === 'group' ? 189 : 420;
  const sub = base + (pack.checked ? 15 : 0);
  const off = Math.round(sub * discount);
  return { sub, off, total: sub - off };
}
function paint() {
  const name = course.selectedOptions[0].textContent!;
  s('course').textContent = `${name} · ${level.value}`;
  s('fmt').textContent = fmt() === 'group' ? 'Small group · 10 weeks' : 'Private · 10 lessons';
  s('start').textContent = longDate(mondays[Number(start.value)]);
  const { total, off } = price();
  s('total').textContent = '£' + total;
  s('note').textContent = off ? `Includes ${'£' + off} promo saving.` : 'First lesson free if you do not love it.';
}
root.addEventListener('input', () => {
  const code = promo.value.trim().toUpperCase();
  discount = code === 'LINGUA10' ? 0.1 : 0;
  const m = document.getElementById('e-promo-m')!;
  m.textContent = discount ? 'Code applied: 10% off.' : '';
  paint();
});
paint();

const bars = root.querySelectorAll('[data-bar]');
const pane = (n: number) => {
  root.querySelectorAll<HTMLElement>('[data-pane]').forEach((p) => (p.hidden = p.dataset.pane !== String(n)));
  bars.forEach((b, i) => b.classList.toggle('is-on', i < Math.min(n, 2)));
  const t = root.querySelector<HTMLElement>(`[data-pane="${n}"]`)!;
  (n === 3 ? t : t.querySelector<HTMLElement>('select,input'))?.focus();
};

root.querySelector<HTMLFormElement>('form[data-pane="1"]')!.addEventListener('submit', (e) => { e.preventDefault(); pane(2); });
const f2 = root.querySelector<HTMLFormElement>('form[data-pane="2"]')!;
const check = wire(f2);
root.querySelector('[data-back]')!.addEventListener('click', () => pane(1));
f2.addEventListener('submit', (e) => {
  e.preventDefault();
  const terms = document.getElementById('e-terms') as HTMLInputElement;
  const okFields = check();
  document.getElementById('e-terms-e')!.hidden = terms.checked;
  if (!okFields || !terms.checked) { if (okFields) terms.focus(); return; }
  const first = (document.getElementById('e-name') as HTMLInputElement).value.trim().split(/\s+/)[0];
  const email = (document.getElementById('e-email') as HTMLInputElement).value.trim();
  root.querySelector('[data-d-name]')!.textContent = first;
  root.querySelector('[data-d-text]')!.textContent = `You are booked on ${course.selectedOptions[0].textContent} ${level.value}, starting ${longDate(mondays[Number(start.value)])}. Confirmation and joining details are on their way to ${email}.`;
  pane(3);
});
