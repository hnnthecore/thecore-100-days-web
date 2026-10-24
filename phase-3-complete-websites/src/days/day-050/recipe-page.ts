/** Day 050 · Citrus & Salt · recipe page behaviour: scaling, units, shopping list and cook mode with timers. */
import { amount, list } from './kitchen';

interface Recipe { id: string; title: string; serves: number; ingredients: { q: number; u: string; n: string }[]; steps: { t: string; m: number }[] }
const recipe = (window as unknown as { __recipe: Recipe }).__recipe;
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!;

let serves = recipe.serves;
let system: 'metric' | 'us' = 'metric';
const ticked = new Set<number>();

/* ---------- Ingredients ---------- */
function paintIng() {
  const ratio = serves / recipe.serves;
  $('[data-serves]').textContent = `Serves ${serves}`;
  $('[data-ing]').innerHTML = recipe.ingredients.map((ing, i) => {
    const a = amount(ing.q, ing.u, ratio, system);
    return `<li><label><input type="checkbox" data-i="${i}" ${ticked.has(i) ? 'checked' : ''} /><b>${a.text}${a.unit ? ' ' + a.unit : ''}</b><span>${ing.n}</span></label></li>`;
  }).join('');
}
document.querySelectorAll<HTMLButtonElement>('[data-serv]').forEach((b) => b.addEventListener('click', () => { serves = Math.min(24, Math.max(1, serves + Number(b.dataset.serv))); paintIng(); }));
$('[data-units]').addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
  if (!b) return;
  system = b.dataset.u as 'metric' | 'us';
  document.querySelectorAll('[data-units] button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  paintIng();
});
$('[data-ing]').addEventListener('change', (e) => {
  const c = e.target as HTMLInputElement;
  c.checked ? ticked.add(Number(c.dataset.i)) : ticked.delete(Number(c.dataset.i));
});
paintIng();

$('[data-addlist]').addEventListener('click', () => {
  const ratio = serves / recipe.serves;
  const rest = recipe.ingredients.filter((_, i) => !ticked.has(i)).map((ing) => ({ name: ing.n, q: Math.round(ing.q * ratio * 100) / 100, u: ing.u, recipe: recipe.title }));
  list.add(rest);
  $('[data-added]').textContent = rest.length ? `Added ${rest.length} item${rest.length === 1 ? '' : 's'} to your shopping list.` : 'You ticked everything, so there is nothing to add.';
});
$('[data-print]').addEventListener('click', () => print());

/* ---------- Cook mode ---------- */
const dlg = $<HTMLDialogElement>('[data-dialog]');
let step = 0, tick: ReturnType<typeof setInterval> | null = null, left = 0;

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; // taste-skill-ignore: a clock

function stopTimer() { if (tick) clearInterval(tick); tick = null; }
function showStep() {
  stopTimer();
  const s = recipe.steps[step];
  $('[data-n]').textContent = `Step ${step + 1} of ${recipe.steps.length}`;
  $('[data-where]').textContent = `${step + 1} / ${recipe.steps.length}`;
  $('[data-text]').textContent = s.t;
  $<HTMLElement>('[data-prog]').style.width = `${((step + 1) / recipe.steps.length) * 100}%`;
  const t = $('[data-timer]');
  t.hidden = s.m <= 0;
  t.classList.remove('is-done');
  left = s.m * 60;
  $('[data-clock]').textContent = fmt(left);
  $('[data-tgo]').textContent = 'Start timer';
  $<HTMLButtonElement>('[data-prev]').disabled = step === 0;
  $('[data-next]').textContent = step === recipe.steps.length - 1 ? 'Finish' : 'Next step →';
}
$('[data-tgo]').addEventListener('click', () => {
  if (tick) { stopTimer(); $('[data-tgo]').textContent = 'Resume'; return; }
  $('[data-tgo]').textContent = 'Pause';
  tick = setInterval(() => {
    left--;
    $('[data-clock]').textContent = fmt(Math.max(0, left));
    if (left <= 0) { stopTimer(); $('[data-timer]').classList.add('is-done'); $('[data-tgo]').textContent = 'Done!'; }
  }, 1000);
});
$('[data-cook]').addEventListener('click', () => { step = 0; showStep(); dlg.showModal(); });
$('[data-next]').addEventListener('click', () => { if (step >= recipe.steps.length - 1) { dlg.close(); return; } step++; showStep(); });
$('[data-prev]').addEventListener('click', () => { if (step > 0) { step--; showStep(); } });
$('[data-close]').addEventListener('click', () => dlg.close());
dlg.addEventListener('close', stopTimer);
dlg.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') $('[data-next]').click();
  if (e.key === 'ArrowLeft') $('[data-prev]').click();
});
