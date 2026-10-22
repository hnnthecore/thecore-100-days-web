/** Day 047 · Solstice Sound · camping planner: pick how you will sleep and tick off a packing list that is remembered on this device. */
const KEY = 'solstice-pack';
type Saved = { camp: string; packed: string[] };
function read(): Saved { try { const v = JSON.parse(localStorage.getItem(KEY) ?? '{}'); return { camp: typeof v.camp === 'string' ? v.camp : 'tent', packed: Array.isArray(v.packed) ? v.packed.filter((x: unknown) => typeof x === 'string') : [] }; } catch { return { camp: 'tent', packed: [] }; } }
function write(s: Saved) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* private mode: lasts this visit */ } }

const root = document.querySelector<HTMLElement>('[data-camp]');
if (root) {
  let state = read();
  const radios = [...root.querySelectorAll<HTMLInputElement>('input[name="camp"]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-panel]')];
  const bar = root.querySelector<HTMLElement>('[data-bar]')!;
  const count = root.querySelector<HTMLElement>('[data-count]')!;
  const paint = () => {
    radios.forEach((r) => { r.checked = r.value === state.camp; });
    panels.forEach((p) => { p.hidden = p.dataset.panel !== state.camp; });
    const boxes = [...root.querySelectorAll<HTMLInputElement>('[data-panel]:not([hidden]) input[type="checkbox"]')];
    boxes.forEach((b) => { b.checked = state.packed.includes(b.value); });
    const n = boxes.filter((b) => b.checked).length;
    count.textContent = n + ' of ' + boxes.length + ' packed';
    bar.style.setProperty('--p', boxes.length ? String(n / boxes.length) : '0');
  };
  root.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name === 'camp') state.camp = t.value;
    else if (t.type === 'checkbox') state.packed = t.checked ? [...new Set([...state.packed, t.value])] : state.packed.filter((x) => x !== t.value);
    write(state); paint();
  });
  root.querySelector('[data-reset]')?.addEventListener('click', () => { state = { camp: state.camp, packed: [] }; write(state); paint(); });
  paint();
}
