/** Day 049 · Brightside Dental · online booking flow: treatment → dentist → date and time → details → confirmation. */
import { wire } from '../shared/forms';

interface T { id: string; title: string; price: number; minutes: number; summary: string; svg: string }
interface D { id: string; name: string; role: string; treatments: string[] }
const data = (window as unknown as { __book: { treatments: T[]; dentists: D[]; HOURS: ([number, number] | null)[] } }).__book;
const { treatments, dentists, HOURS } = data;

const root = document.querySelector<HTMLElement>('[data-book]')!;
const $ = <E extends HTMLElement>(s: string) => root.querySelector<E>(s)!;
const sum = (k: string) => document.querySelector<HTMLElement>(`[data-s="${k}"]`)!;
const params = new URLSearchParams(location.search);

const state = { t: null as T | null, d: 'any', day: -1, time: '' };
let step = 1;

/* The next ten opening days, starting tomorrow. */
const days: Date[] = [];
for (let n = 1; days.length < 10; n++) { const d = new Date(Date.now() + n * 864e5); if (HOURS[d.getDay()]) days.push(d); }
const key = (d: Date) => d.toISOString().slice(0, 10);
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; // taste-skill-ignore: a clock
const longDay = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
const eligible = () => dentists.filter((d) => state.t && d.treatments.includes(state.t.id));

/* Seeded "busy" slots so availability looks real and never changes between visits. */
function busy(dentistId: string, day: Date, time: string): boolean {
  let h = 7;
  for (const c of `${dentistId}|${key(day)}|${time}`) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 4 === 0;
}
/** Who can see the patient at this time: the chosen dentist, or the first free eligible one. */
function who(day: Date, time: string): D | null {
  const pool = state.d === 'any' ? eligible() : eligible().filter((d) => d.id === state.d);
  return pool.find((d) => !busy(d.id, day, time)) ?? null;
}

function showStep(n: number) {
  step = n;
  root.querySelectorAll<HTMLElement>('[data-pane]').forEach((p) => (p.hidden = p.dataset.pane !== String(n)));
  root.querySelectorAll('[data-bar]').forEach((b, i) => { b.classList.toggle('is-on', i + 1 === n); b.classList.toggle('is-done', i + 1 < n); });
  const pane = $(`[data-pane="${n}"]`);
  (n === 5 ? pane : pane.querySelector<HTMLElement>('button,input'))?.focus();
}

function paintSummary() {
  sum('t').textContent = state.t ? state.t.title : 'Not chosen yet';
  sum('p').textContent = state.t ? `From £${state.t.price.toLocaleString('en-GB')}` : 'From £0';
  sum('d').textContent = state.t ? (state.d === 'any' ? 'First available' : dentists.find((d) => d.id === state.d)!.name) : 'Not chosen yet';
  sum('w').textContent = state.day >= 0 && state.time ? `${longDay(days[state.day])} at ${state.time}` : 'Not chosen yet';
}

/* Step 1 */
$('[data-treatments]').innerHTML = treatments.map((t) => `<button type="button" class="bd-opt" data-t="${t.id}" aria-pressed="false"><span class="bd-ico" style="width:2.6rem;height:2.6rem;flex:none">${t.svg}</span><span><b>${t.title}</b><small>${t.minutes} min · ${t.summary}</small></span><span class="bd-price">£${t.price.toLocaleString('en-GB')}</span></button>`).join('');
$('[data-treatments]').addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLElement>('[data-t]');
  if (b) pickTreatment(b.dataset.t!);
});
function pickTreatment(id: string) {
  state.t = treatments.find((t) => t.id === id)!;
  state.time = ''; state.day = -1;
  $('[data-treatments]').querySelectorAll('[data-t]').forEach((x) => x.setAttribute('aria-pressed', String((x as HTMLElement).dataset.t === id)));
  if (!eligible().some((d) => d.id === state.d)) state.d = 'any';
  paintDentists(); paintSummary(); showStep(2);
}

/* Step 2 */
function paintDentists() {
  const portrait = (id: string, name: string) => { const src = document.querySelector<HTMLImageElement>(`[data-pid="${id}"]`)?.src; return src ? `<img src="${src}" alt="" width="44" height="44" class="bd-av bd-av--photo" style="width:2.8rem;height:2.8rem;flex:none" />` : `<span class="bd-ico" style="width:2.6rem;height:2.6rem;flex:none">${name.replace(/^Dr /, '')[0]}</span>`; };
  $('[data-dentists]').innerHTML = [`<button type="button" class="bd-opt" data-d="any" aria-pressed="${state.d === 'any'}"><span class="bd-ico" style="width:2.6rem;height:2.6rem;flex:none"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span><span><b>First available</b><small>We will match you with whoever is free soonest</small></span></button>`]
    .concat(eligible().map((d) => `<button type="button" class="bd-opt" data-d="${d.id}" aria-pressed="${state.d === d.id}">${portrait(d.id, d.name)}<span><b>${d.name}</b><small>${d.role}</small></span></button>`)).join('');
}
$('[data-dentists]').addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLElement>('[data-d]');
  if (!b) return;
  state.d = b.dataset.d!; state.time = '';
  paintDentists(); paintDays(); paintSlots(); paintSummary(); showStep(3);
});

/* Step 3 */
function paintDays() {
  $('[data-days]').innerHTML = days.map((d, i) => `<button type="button" data-i="${i}" aria-pressed="${i === state.day}" aria-label="${longDay(d)}">${d.toLocaleDateString('en-GB', { weekday: 'short' })}<b>${d.getDate()}</b>${d.toLocaleDateString('en-GB', { month: 'short' })}</button>`).join('');
}
function paintSlots() {
  const box = $('[data-slots]');
  if (state.day < 0 || !state.t) { box.innerHTML = '<p style="grid-column:1/-1;color:var(--muted)">Choose a day to see times.</p>'; return; }
  const d = days[state.day], h = HOURS[d.getDay()]!;
  const out: string[] = [];
  for (let m = h[0] * 60; m + state.t.minutes <= h[1] * 60; m += 30) {
    const t = hhmm(m);
    out.push(`<button type="button" data-time="${t}" aria-pressed="${t === state.time}" ${who(d, t) ? '' : 'disabled aria-label="' + t + ', unavailable"'}>${t}</button>`);
  }
  box.innerHTML = out.join('');
}
$('[data-days]').addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLElement>('[data-i]');
  if (!b) return;
  state.day = Number(b.dataset.i); state.time = '';
  paintDays(); paintSlots(); paintSummary();
});
$('[data-slots]').addEventListener('click', (e) => {
  const b = (e.target as HTMLButtonElement).closest<HTMLButtonElement>('[data-time]');
  if (!b || b.disabled) return;
  state.time = b.dataset.time!;
  $('[data-slot-e]').hidden = true;
  paintSlots(); paintSummary();
});
$('[data-next]').addEventListener('click', () => {
  if (state.day < 0 || !state.time) { $('[data-slot-e]').hidden = false; return; }
  showStep(4);
});

/* Step 4 and confirmation */
root.querySelectorAll('[data-back]').forEach((b) => b.addEventListener('click', () => showStep(step - 1)));
const form = $<HTMLFormElement>('form[data-pane="4"]');
const check = wire(form);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!check()) return;
  const d = who(days[state.day], state.time)!;
  const first = (document.getElementById('b-name') as HTMLInputElement).value.trim().split(/\s+/)[0];
  $('[data-d-name]').textContent = first;
  $('[data-d-text]').textContent = `${state.t!.title} with ${d.name} on ${longDay(days[state.day])} at ${state.time}. A confirmation is on its way to ${(document.getElementById('b-email') as HTMLInputElement).value.trim()}.`;
  root.querySelectorAll('[data-bar]').forEach((b) => { b.classList.remove('is-on'); b.classList.add('is-done'); });
  showStep(5);
});

/* Arrive from a treatment or team page: ?t=whitening and/or ?d=dr-anna-bell */
const pt = params.get('t'), pd = params.get('d');
paintDays(); paintSlots(); paintSummary();
if (pt && treatments.some((t) => t.id === pt)) {
  state.t = treatments.find((t) => t.id === pt)!;
  $('[data-treatments]').querySelectorAll('[data-t]').forEach((x) => x.setAttribute('aria-pressed', String((x as HTMLElement).dataset.t === pt)));
  paintDentists(); paintSummary(); showStep(2);
} else if (pd && dentists.some((d) => d.id === pd)) {
  const dn = dentists.find((d) => d.id === pd)!;
  state.d = dn.id;
  showStep(1);
  $('[data-treatments]').querySelectorAll<HTMLElement>('[data-t]').forEach((b) => { b.hidden = !dn.treatments.includes(b.dataset.t!); });
} else showStep(1);
