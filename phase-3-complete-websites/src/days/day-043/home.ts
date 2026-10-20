/** Day 043 · Rootwork · home page: impact numbers count up when they scroll into view. */
const stats = document.querySelector('[data-stats]')!;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const els = [...stats.querySelectorAll<HTMLElement>('[data-count]')];
if (!reduce) {
  els.forEach((el) => (el.textContent = '0'));
  new IntersectionObserver((es, io) => {
    if (!es[0].isIntersecting) return;
    io.disconnect();
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1500);
      els.forEach((el) => (el.textContent = Math.round(Number(el.dataset.count) * (1 - (1 - p) ** 3)).toLocaleString('en-GB')));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { threshold: 0.5 }).observe(stats);
}
