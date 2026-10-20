/** Day 044 · Fathom · home page: count-up numbers, the live what-if forecast and the customer tabs. */
import { forecastChart, gbp } from './chart';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Count-up numbers when they scroll into view. */
document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
  const target = Number(el.dataset.count), suffix = el.dataset.suffix ?? '';
  const draw = (v: number) => (el.textContent = Math.round(v).toLocaleString('en-GB') + suffix);
  if (reduce) return;
  draw(0);
  new IntersectionObserver((es, io) => {
    if (!es[0].isIntersecting) return;
    io.disconnect();
    const t0 = performance.now();
    const step = (t: number) => { const p = Math.min((t - t0) / 1200, 1); draw(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }).observe(el);
});

/* What-if forecast: a tiny cash model, redrawn on every slider move. */
const box = document.querySelector<HTMLElement>('[data-whatif]');
if (box) {
  const START = 84000, SALES = 21000, COSTS = 19000, PAYROLL = 18000, FLOOR = 25000;
  const q = <T extends HTMLElement>(s: string) => box.querySelector<T>(s)!;
  const model = (growth: number, hire: number, late: number) => {
    const lateWeeks = Math.round(late / 7);
    let bal = START;
    return Array.from({ length: 13 }, (_, i) => {
      const income = (i < lateWeeks ? 0.4 : 1) * SALES * (1 + growth / 100);
      const cost = COSTS + (i >= 2 ? (hire * 12) / 52 : 0) + (i % 4 === 3 ? PAYROLL : 0);
      bal += income - cost;
      return Math.round(bal);
    });
  };
  const val = (k: string) => Number(q<HTMLInputElement>(`[data-in="${k}"]`).value);
  const base = model(0, 0, 0);
  const render = () => {
    const g = val('g'), h = val('h'), l = val('l');
    q('[data-out="g"]').textContent = `${g > 0 ? '+' : ''}${g}%`;
    q('[data-out="h"]').textContent = gbp(h);
    q('[data-out="l"]').textContent = `${l} days`;
    const pts = model(g, h, l);
    const low = Math.min(...pts), wk = pts.indexOf(low) + 1;
    q('[data-o="low"]').textContent = gbp(low);
    q('[data-o="week"]').textContent = String(wk);
    q('[data-o="end"]').textContent = gbp(pts[12]);
    const bad = low < FLOOR;
    q('[data-low]').classList.toggle('is-bad', bad);
    const v = q('[data-verdict]');
    v.classList.toggle('is-bad', bad);
    v.textContent = low < 0
      ? `You would run out of cash in week ${pts.findIndex((p) => p < 0) + 1}. Delay the hire or chase invoices sooner.`
      : bad
        ? `Careful: week ${wk} dips below your ${gbp(FLOOR)} safety floor. A slower hire or faster payers would fix it.`
        : `Comfortable: your lowest point is ${gbp(low)} in week ${wk}, above your ${gbp(FLOOR)} floor.`;
    q('[data-chart]').innerHTML = forecastChart({ points: pts, baseline: base, floor: FLOOR, id: 'wi', height: 270, width: 640 });
  };
  box.addEventListener('input', render);
  q('[data-reset]').addEventListener('click', () => {
    q<HTMLInputElement>('[data-in="g"]').value = '0'; q<HTMLInputElement>('[data-in="h"]').value = '4500'; q<HTMLInputElement>('[data-in="l"]').value = '14'; render();
  });
  render();
}

/* Customer tabs (WAI-ARIA tabs pattern, vertical). */
const tabs = document.querySelector<HTMLElement>('[data-tabs]');
if (tabs) {
  const list = [...tabs.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const select = (i: number, focus = false) => list.forEach((t, j) => {
    const on = i === j;
    t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')!)!.hidden = !on;
    if (on && focus) t.focus();
  });
  list.forEach((t, i) => t.addEventListener('click', () => select(i)));
  tabs.querySelector('[role="tablist"]')!.addEventListener('keydown', (e) => {
    const k = (e as KeyboardEvent).key, cur = list.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    const next = k === 'ArrowDown' || k === 'ArrowRight' ? (cur + 1) % list.length : k === 'ArrowUp' || k === 'ArrowLeft' ? (cur - 1 + list.length) % list.length : k === 'Home' ? 0 : k === 'End' ? list.length - 1 : -1;
    if (next >= 0) { e.preventDefault(); select(next, true); }
  });
}
