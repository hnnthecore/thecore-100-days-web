/** Day 044 · Fathom · home page behaviour: the live forecast, the feature panels, count-up numbers and the customer tabs. */
import { gbp } from './chart';
import { model, verdict, heroChart, storyChart, storyGeom } from './forecast';

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

/* The scroll story: on wide screens the section is pinned and scrolling draws the 13 weeks; elsewhere the finished chart is shown. */
const story = document.querySelector<HTMLElement>('[data-story]');
if (story) {
  const stick = story.querySelector<HTMLElement>('.fw__stick')!;
  const holder = story.querySelector<HTMLElement>('[data-story-chart]')!;
  const wk = story.querySelector<HTMLElement>('[data-wk]')!;
  const events = [...story.querySelectorAll<HTMLElement>('[data-events] li')];
  const pts = model(0, 4500, 14);
  const wide = matchMedia('(min-width: 1000px) and (prefers-reduced-motion: no-preference)');
  let W = 1000, H = 380, pinned = false, total = 0, ticking = false;
  const setWeek = (v: number) => {
    const g = storyGeom(pts, W, H), pt = g.at(v);
    holder.querySelector('[data-clip]')?.setAttribute('width', String(pt.x + 2));
    holder.querySelector('[data-cursor]')?.setAttribute('d', `M${pt.x.toFixed(1)} ${g.padT}V${H - g.padB}`);
    holder.querySelector('[data-dot]')?.setAttribute('cx', pt.x.toFixed(1));
    holder.querySelector('[data-dot]')?.setAttribute('cy', pt.y.toFixed(1));
    wk.textContent = String(Math.min(13, Math.round(v) + 1));
    let now = -1;
    events.forEach((li, i) => { const seen = Number(li.dataset.w) - 1 <= v + 0.05; li.classList.toggle('is-seen', seen); if (seen) now = i; });
    events.forEach((li, i) => li.classList.toggle('is-now', i === now));
  };
  const draw = () => {
    W = Math.max(320, Math.round(holder.clientWidth || 1000));
    H = Math.round(Math.min(420, Math.max(W < 560 ? 230 : 280, innerHeight * 0.42)));
    holder.innerHTML = storyChart(pts, W, H);
  };
  const update = () => {
    ticking = false;
    if (!pinned) { setWeek(12); return; }
    const top = story.getBoundingClientRect().top, px = Math.min(Math.max(72 - top, 0), total);
    setWeek(Math.min(1, px / (total * 0.85)) * 12);
  };
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  const measure = () => {
    pinned = wide.matches;
    story.classList.toggle('is-pinned', pinned);
    story.classList.add('is-js');
    draw();
    if (pinned) { total = innerHeight * 3; story.style.height = stick.offsetHeight + total + 'px'; } else story.style.height = '';
    update();
  };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', measure);
  wide.addEventListener('change', measure);
  measure();
}

/* Product tour: the list on the left follows the screen in view. */
const nav = document.querySelector<HTMLElement>('[data-nav]');
if (nav) {
  const links = [...nav.querySelectorAll<HTMLAnchorElement>('a')];
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle('is-on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-12% 0px -55% 0px' });
  document.querySelectorAll('[data-s]').forEach((el) => io.observe(el));
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
