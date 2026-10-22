/** Day 047 · Solstice Sound · wires every ★ button on a page to the shared plan and keeps them in sync. */
import { plan } from './plan';

function paint() {
  document.querySelectorAll<HTMLButtonElement>('[data-star]').forEach((b) => {
    const on = plan.has(b.dataset.star!);
    b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', `${on ? 'Remove' : 'Add'} ${b.dataset.name} ${on ? 'from' : 'to'} my plan`);
    if (b.dataset.text !== undefined) b.textContent = on ? '★ In my plan' : '☆ Add to my plan';
  });
}
document.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-star]');
  if (b) plan.toggle(b.dataset.star!);
});
addEventListener('plan:change', paint);
paint();
