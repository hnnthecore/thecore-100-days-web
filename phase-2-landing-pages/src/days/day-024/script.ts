/**
 * Day 024 · Halden & Rowe · interactions:
 * sector tabs, project filters + native <dialog> case studies, scroll-linked process,
 * cost estimator (feeds the enquiry form), file attachments with validation.
 */
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll(s)] as T[];
const gbp = (n: number) => `£${Math.round(n).toLocaleString('en-GB')}`;
const short = (n: number) => (n >= 1e6 ? `£${(n / 1e6).toFixed(n >= 1e7 ? 1 : 2)}M` : `£${Math.round(n / 1000)}k`);

/* ---------- Header + current section ---------- */
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();
const links = $$<HTMLAnchorElement>('.hr-header nav a');
const spy = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) links.forEach((a) => (a.hash === `#${e.target.id}` ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
}), { rootMargin: '-45% 0px -50% 0px' });
['sectors', 'projects', 'process', 'estimate'].forEach((id) => spy.observe(document.getElementById(id)!));

/* ---------- Safety record: real day count since the last incident ---------- */
const since = new Date(2020, 9, 6);
const safeDays = Math.floor((Date.now() - since.getTime()) / 86_400_000);
$('[data-safe-days]').textContent = safeDays.toLocaleString('en-GB');

/* ---------- Sector tabs ---------- */
const tabs = $$<HTMLButtonElement>('[data-sector-tabs] [role="tab"]');
tabs.forEach((t, i) => {
  const select = (focus = true) => {
    tabs.forEach((x) => {
      const on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')!)!.hidden = !on;
    });
    if (focus) t.focus();
  };
  t.addEventListener('click', () => select());
  t.addEventListener('keydown', (e) => {
    const n = ({ ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 } as Record<string, number>)[e.key];
    if (n === undefined) return;
    e.preventDefault();
    tabs[(n + tabs.length) % tabs.length].click();
  });
});

/* ---------- Projects: filters + case-study dialogs ---------- */
const filterBtns = $$<HTMLButtonElement>('[data-filters] button');
const projects = $$('.hr-project');
filterBtns.forEach((b) => b.addEventListener('click', () => {
  filterBtns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  let n = 0;
  projects.forEach((p) => { const show = b.dataset.f === 'all' || p.dataset.sector === b.dataset.f; p.hidden = !show; if (show) n++; });
  $('[data-project-count]').textContent = `Showing ${n} ${n === 1 ? 'project' : 'projects'}.`;
}));
$$<HTMLButtonElement>('[data-open]').forEach((b) => b.addEventListener('click', () => {
  const dlg = document.getElementById(`dlg-${b.dataset.open}`) as HTMLDialogElement;
  dlg.showModal(); // native modal: focus trap, Esc and focus return come for free
}));
// Clicking the dimmed backdrop (the <dialog> itself, outside its content) closes it.
$$<HTMLDialogElement>('.hr-dialog').forEach((d) => d.addEventListener('click', (e) => { if (e.target === d) d.close(); }));

/* ---------- Process: line fills and steps light up as you scroll ---------- */
const stepsWrap = $('[data-steps]');
const fill = $('[data-steps-fill]');
const steps = $$('[data-step]');
function process() {
  const r = stepsWrap.getBoundingClientRect();
  const mark = innerHeight * 0.6;
  const p = Math.min(1, Math.max(0, (mark - r.top) / r.height));
  fill.style.setProperty('--p', `${(p * 100).toFixed(1)}%`);
  steps.forEach((s) => s.classList.toggle('is-reached', s.getBoundingClientRect().top < mark));
}
addEventListener('scroll', process, { passive: true });
process();

/* ---------- Cost estimator ---------- */
const est = $<HTMLFormElement>('[data-estimator]');
const area = $<HTMLInputElement>('[data-area]', est);
const SPEED: Record<string, number> = { ext: 8, loft: 10, house: 12, fitout: 120, refurb: 15 };
const SPLIT: Record<string, [number, number, number]> = { ext: [12, 18, 70], loft: [12, 16, 72], house: [15, 20, 65], fitout: [18, 6, 76], refurb: [14, 10, 76] };
const NOTE: Record<string, string> = {
  ext: 'Includes foundations, structural steel, roof, glazing and finishes. Excludes kitchen units, VAT and planning fees.',
  loft: 'Includes structure, dormer, stairs, insulation and a shower room. Excludes VAT and party-wall surveys.',
  house: 'Shell, core and finishes to a ready-to-live standard. Excludes land, VAT (often zero-rated for new homes) and landscaping.',
  fitout: 'Cat B fit-out: partitions, M&E, finishes and furniture installation. Excludes furniture supply and VAT.',
  refurb: 'Strip-out, rewire, replumb, insulation and finishes. Excludes VAT and any structural surprises behind the plaster.',
};
let lastType = '';
function estimate() {
  const type = $<HTMLInputElement>('[name="type"]:checked', est);
  if (type.value !== lastType) {
    // Each project type has its own sensible size range.
    area.min = type.dataset.min!; area.max = type.dataset.max!;
    const mid = Math.round((Number(area.min) + Number(area.max)) / 3);
    if (lastType) area.value = String(mid);
    area.value = String(Math.min(Number(area.max), Math.max(Number(area.min), Number(area.value))));
    $('[data-area-min]', est).textContent = `${area.min} m²`;
    $('[data-area-max]', est).textContent = `${Number(area.max).toLocaleString('en-GB')} m²`;
    lastType = type.value;
  }
  const m2 = Number(area.value);
  const spec = Number(($<HTMLInputElement>('[name="spec"]:checked', est)).value);
  const loc = Number(($<HTMLInputElement>('[name="loc"]:checked', est)).value);
  const rate = Number(type.dataset.rate) * spec * loc;
  const mid = rate * m2;
  const low = mid * 0.9; const high = mid * 1.12;
  const weeks = Math.round(Number(type.dataset.base) + m2 / SPEED[type.value]);
  $('[data-area-out]', est).textContent = `${m2.toLocaleString('en-GB')} m²`;
  area.setAttribute('aria-valuetext', `${m2} square metres`);
  $('[data-est-range]', est).textContent = `${short(low)} – ${short(high)}`;
  $('[data-est-rate]', est).textContent = `${gbp(rate)}/m²`;
  $('[data-est-weeks]', est).textContent = `${weeks} weeks`;
  const [a, b, c] = SPLIT[type.value];
  $$('[data-split] span', est).forEach((s, i) => s.style.setProperty('--w', `${[a, b, c][i]}%`));
  $('[data-est-note]', est).textContent = NOTE[type.value];
  // The visible name is the first text node of the label's <span> (before the <small> rate).
  return { type: (type.nextElementSibling!.firstChild!.textContent ?? '').trim(), m2, low, high, weeks };
}
est.addEventListener('input', estimate);
est.addEventListener('change', estimate);
estimate();

$('[data-est-cta]').addEventListener('click', () => {
  const e = estimate();
  const sel = $<HTMLSelectElement>('[data-c-type]');
  [...sel.options].forEach((o) => { if (o.text === e.type) sel.value = o.value; });
  $<HTMLInputElement>('[data-c-budget]').value = `${short(e.low)} – ${short(e.high)}`;
  const msg = $<HTMLTextAreaElement>('[data-c-msg]');
  if (!msg.value.trim()) msg.value = `${e.type}, about ${e.m2} m². Online estimate ${short(e.low)} – ${short(e.high)}, around ${e.weeks} weeks on site.`;
  setTimeout(() => $<HTMLInputElement>('#c-name').focus({ preventScroll: true }), 500);
});

/* ---------- Enquiry form + attachments ---------- */
const form = $<HTMLFormElement>('[data-contact]');
const drop = $('[data-drop]', form);
const fileInput = $<HTMLInputElement>('[data-files]', form);
const fileList = $('[data-file-list]', form);
const fileErr = $('[data-file-err]', form);
const OK_EXT = /\.(pdf|dwg|dxf|jpe?g|png)$/i;
const MAX = 20 * 1024 * 1024;
let files: File[] = [];
const size = (b: number) => (b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`);

function addFiles(list: FileList | File[]) {
  const problems: string[] = [];
  [...list].forEach((f) => {
    if (!OK_EXT.test(f.name)) problems.push(`${f.name} isn’t a PDF, DWG, DXF, JPG or PNG`);
    else if (f.size > MAX) problems.push(`${f.name} is over 20 MB`);
    else if (files.length >= 8) problems.push('Up to 8 files, please');
    else if (!files.some((x) => x.name === f.name && x.size === f.size)) files.push(f);
  });
  fileErr.textContent = problems.length ? `${[...new Set(problems)].join('. ')}.` : '';
  renderFiles();
}
function renderFiles() {
  fileList.innerHTML = files.map((f, i) => `<li><span>${f.name.replace(/[<>&]/g, '')}</span><small>${size(f.size)}</small><button type="button" data-rm="${i}" aria-label="Remove ${f.name.replace(/"/g, '')}">Remove</button></li>`).join('');
}
fileInput.addEventListener('change', () => { addFiles(fileInput.files!); fileInput.value = ''; });
fileList.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-rm]');
  if (!b) return;
  files.splice(Number(b.dataset.rm), 1);
  renderFiles();
  fileInput.focus();
});
['dragenter', 'dragover'].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add('is-over'); }));
['dragleave', 'drop'].forEach((t) => drop.addEventListener(t, () => drop.classList.remove('is-over')));
drop.addEventListener('drop', (e) => { e.preventDefault(); if ((e as DragEvent).dataTransfer?.files) addFiles((e as DragEvent).dataTransfer!.files); });

function check(i: HTMLInputElement) {
  const v = i.value.trim();
  const ok = i.type === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) : v.length > 1;
  i.setAttribute('aria-invalid', String(!ok));
  (document.getElementById(i.getAttribute('aria-describedby')!) as HTMLElement).hidden = ok;
  return ok;
}
$$<HTMLInputElement>('[data-req]', form).forEach((i) => i.addEventListener('input', () => { if (i.getAttribute('aria-invalid') === 'true') check(i); }));
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const bad = $$<HTMLInputElement>('[data-req]', form).filter((i) => !check(i));
  const err = $('[data-form-err]', form);
  if (bad.length) { err.textContent = 'Please check the highlighted fields.'; bad[0].focus(); return; }
  err.textContent = '';
  const name = $<HTMLInputElement>('#c-name').value.trim().split(' ')[0];
  $('[data-done-title]').textContent = `Thank you, ${name}.`;
  $('[data-done-text]').textContent = `A director will call within one working day about your ${$<HTMLSelectElement>('[data-c-type]').value.toLowerCase()}${files.length ? `, having read the ${files.length} document${files.length > 1 ? 's' : ''} you attached` : ''}.`;
  form.hidden = true;
  const done = $('[data-done]');
  done.hidden = false;
  done.focus();
});
