/** Day 043 · Rootwork · Get involved: filter sessions, choose several, then confirm in a native dialog. */
import { wire } from '../shared/forms';

const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const items = [...document.querySelectorAll<HTMLElement>('[data-shift]')];
const picked = new Set<string>();
let kind = 'all';

function paint() {
  items.forEach((li) => {
    li.hidden = !(kind === 'all' || li.dataset.kind === kind);
    const mine = picked.has(li.dataset.shift!);
    li.classList.toggle('is-mine', mine);
    const left = Number(li.dataset.left) - (mine ? 1 : 0);
    li.querySelector('[data-left-text]')!.textContent = left > 0 ? `${left} of ${li.dataset.spots} spots left` : 'Full';
    const b = li.querySelector<HTMLButtonElement>('[data-join]')!;
    b.setAttribute('aria-pressed', String(mine));
    b.textContent = mine ? '✓ Signed up' : Number(li.dataset.left) <= 0 ? 'Full' : 'Sign up';
    b.disabled = Number(li.dataset.left) <= 0 && !mine;
  });
  const n = picked.size;
  $('[data-mine]').hidden = n === 0;
  $('[data-mine-text]').textContent = `${n} session${n === 1 ? '' : 's'} chosen`;
}
$('[data-kinds]').addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
  if (!b) return;
  kind = b.dataset.kind!;
  document.querySelectorAll<HTMLButtonElement>('[data-kinds] button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  paint();
});
$('[data-shifts]').addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-join]');
  if (!b) return;
  const id = b.closest<HTMLElement>('[data-shift]')!.dataset.shift!;
  picked.has(id) ? picked.delete(id) : picked.add(id);
  paint();
});

const dlg = $<HTMLDialogElement>('[data-dialog]');
const form = $<HTMLFormElement>('[data-vol]');
const check = wire(form);
let opener: HTMLElement | null = null;
$('[data-confirm]').addEventListener('click', (e) => {
  opener = e.currentTarget as HTMLElement;
  $('[data-d-list]').textContent = items.filter((li) => picked.has(li.dataset.shift!)).map((li) => `${li.dataset.title} (${li.dataset.when})`).join(' · ');
  form.hidden = false; $('[data-d-done]').hidden = true;
  dlg.showModal();
});
dlg.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => dlg.close()));
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
dlg.addEventListener('close', () => opener?.focus());
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!check()) return;
  const n = picked.size;
  $('[data-d-name]').textContent = $<HTMLInputElement>('#v-name').value.trim().split(/\s+/)[0];
  $('[data-d-text]').textContent = `You're booked on ${n} session${n === 1 ? '' : 's'}. Wear old clothes and sturdy shoes; we'll supply gloves, tools and tea.`;
  form.hidden = true;
  const done = $('[data-d-done]'); done.hidden = false; done.focus();
});
paint();
