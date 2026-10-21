/** Day 044 · Fathom · home page behaviour: the live forecast, the feature panels, count-up numbers and the customer tabs. */
import { gbp } from './chart';
import { model, verdict, heroChart } from './forecast';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* The forecast: three controls bend the line, the sentence and the readouts. The chart is redrawn at the pixel size it is shown at. */
const box = document.querySelector<HTMLElement>('[data-whatif]');
if (box) {
  const q = <T extends HTMLElement>(s: string) => box.querySelector<T>(s)!;
  const chart = q('[data-chart]');
  const val = (k: string) => Number(q<HTMLInputElement>(`[data-in="${k}"]`).value);
  const base = model(0, 0, 0);
  const render = () => {
    const g = val('g'), h = val('h'), l = val('l');
    q('[data-out="g"]').textContent = `${g > 0 ? '+' : ''}${g}%`;
    q('[data-out="h"]').textContent = gbp(h);
    q('[data-out="l"]').textContent = `${l} days`;
    const pts = model(g, h, l);
    const low = Math.min(...pts), v = verdict(pts);
    q('[data-o="low"]').textContent = gbp(low);
    q('[data-o="week"]').textContent = String(pts.indexOf(low) + 1);
    q('[data-o="end"]').textContent = gbp(pts[12]);
    q('[data-low]').classList.toggle('is-bad', v.bad);
    const say = q('[data-verdict]');
    say.classList.toggle('is-bad', v.bad);
    say.textContent = v.text;
    const w = Math.round(chart.clientWidth || 1360);
    const hgt = Math.round(Math.min(440, Math.max(w < 560 ? 230 : 280, innerHeight * 0.4)));
    chart.innerHTML = heroChart(pts, base, w, hgt);
  };
  box.addEventListener('input', () => { chart.classList.add('is-live'); render(); });
  q('[data-reset]').addEventListener('click', () => {
    q<HTMLInputElement>('[data-in="g"]').value = '0'; q<HTMLInputElement>('[data-in="h"]').value = '4500'; q<HTMLInputElement>('[data-in="l"]').value = '14';
    chart.classList.add('is-live'); render();
  });
  let rz = 0;
  addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(() => { chart.classList.add('is-live'); render(); }); });
  render();
}

/* Feature panels: one open, the rest collapsed. Hover or focus opens another. */
const fx = document.querySelector<HTMLElement>('[data-fx]');
if (fx) {
  const panels = [...fx.querySelectorAll<HTMLElement>('.fx__p')];
  const open = (p: HTMLElement) => panels.forEach((o) => { const on = o === p; o.classList.toggle('is-open', on); o.querySelector('.fx__tab')!.setAttribute('aria-expanded', String(on)); });
  panels.forEach((p) => {
    p.querySelector('.fx__tab')!.addEventListener('click', () => open(p));
    p.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover) and (min-width: 900px)').matches) open(p); });
    p.addEventListener('focusin', () => open(p));
  });
}

/* Count-up numbers when they scroll into view. */
document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
  const target = Number(el.dataset.count), suffix = el.dataset.suffix ?? '';
  const draw = (n: number) => (el.textContent = Math.round(n).toLocaleString('en-GB') + suffix);
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

/* Customer tabs (WAI-ARIA tabs pattern). */
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
