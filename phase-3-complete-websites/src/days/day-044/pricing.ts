/** Day 044 · Fathom · pricing page: billing toggle (annual saves 20%) and a plan recommender. */
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!;
const plans = [...document.querySelectorAll<HTMLElement>('[data-plan]')];
const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-period]')];
let period = 'year';

function paint() {
  buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.period === period)));
  plans.forEach((p) => {
    const base = Number(p.dataset.price);
    p.querySelector('[data-amount]')!.textContent = '£' + (period === 'year' ? Math.round(base * 0.8) : base);
    p.querySelector('[data-billed]')!.textContent = period === 'year' ? `billed annually (£${Math.round(base * 0.8 * 12)})` : 'billed monthly, cancel any time';
  });
}
buttons.forEach((b) => b.addEventListener('click', () => { period = b.dataset.period!; paint(); }));
paint();

/* Recommender: the biggest need among connections, team size and features wins. */
const rec = $('[data-rec]');
const names = ['Starter', 'Growth', 'Scale'];
function recommend() {
  const v = (k: string) => Number(rec.querySelector<HTMLSelectElement>(`[data-r="${k}"]`)!.value);
  const conn = v('conn'), team = v('team'), need = v('need');
  const level = Math.max(conn > 5 || team > 5 || need === 2 ? 2 : conn > 1 || team > 1 || need === 1 ? 1 : 0);
  $('[data-rec-out]').innerHTML = `We suggest <b class="fa-grad">${names[level]}</b>`;
  plans.forEach((p, i) => p.classList.toggle('is-rec', i === level));
}
rec.addEventListener('change', recommend);
recommend();
