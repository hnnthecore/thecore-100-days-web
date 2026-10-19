/** Day 042 · Atelier Nord · enquiry page: live cost, fee and timeline estimate, file list and validated form. */
const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const form = $<HTMLFormElement>('[data-enquiry]');
const area = $<HTMLInputElement>('#area');
const gbp = (n: number) => '£' + (Math.round(n / 1000) * 1000).toLocaleString('en-GB');
const RATE: Record<string, number> = { Residential: 3200, Cultural: 4200, Education: 3600, Workplace: 3000 };
const val = (n: string) => (form.elements.namedItem(n) as RadioNodeList).value;

function paintEstimate() {
  const m2 = Number(area.value);
  const type = val('type');
  const build = m2 * RATE[type];
  const fee = build * Number(val('quality'));
  const months = Math.round(9 + Math.sqrt(m2) * 0.9 + m2 / 700);
  $('[data-area-out]').textContent = `${m2.toLocaleString('en-GB')} m²`;
  $('[data-cost]').textContent = `${gbp(build * 0.88)} – ${gbp(build * 1.12)}`;
  $('[data-fee]').textContent = `${gbp(fee * 0.9)} – ${gbp(fee * 1.1)}`;
  $('[data-time]').textContent = `${months} – ${months + 4} months`;
  area.setAttribute('aria-valuetext', `${m2} square metres`);
}
form.addEventListener('input', paintEstimate);
paintEstimate();

/* Files: validate type and size, list them, allow removal. The files never leave the browser. */
const fileIn = $<HTMLInputElement>('#f-files');
const list = $('[data-files]');
const err = $('#f-files-e');
const OK = /\.(pdf|jpe?g|png|dwg|dxf)$/i;
let files: File[] = [];
function paintFiles() {
  list.innerHTML = files.map((f, i) => `<li><span>${f.name.replace(/</g, '&lt;')} · ${(f.size / 1048576).toFixed(1)} MB</span><button type="button" data-rm="${i}" aria-label="Remove ${f.name.replace(/"/g, '')}">Remove</button></li>`).join('');
}
fileIn.addEventListener('change', () => {
  const bad: string[] = [];
  [...fileIn.files!].forEach((f) => { if (!OK.test(f.name)) bad.push(`${f.name} is not a supported type`); else if (f.size > 20 * 1048576) bad.push(`${f.name} is over 20 MB`); else if (files.length < 8) files.push(f); });
  fileIn.value = '';
  err.hidden = bad.length === 0; err.textContent = bad.join('. ');
  paintFiles();
});
list.addEventListener('click', (e) => { const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-rm]'); if (b) { files.splice(Number(b.dataset.rm), 1); paintFiles(); } });

/* Validation */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const req = [...form.querySelectorAll<HTMLInputElement>('[data-req]')];
function valid(el: HTMLInputElement) { const v = el.value.trim(); const ok = el.type === 'email' ? EMAIL.test(v) : v.length > 2; el.setAttribute('aria-invalid', String(!ok)); $(`#${el.id}-e`).hidden = ok; return ok; }
req.forEach((el) => el.addEventListener('blur', () => { if (el.value) valid(el); }));
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const status = $('[data-status]');
  const bad = req.filter((el) => !valid(el));
  if (bad.length) { status.textContent = ''; bad[0].focus(); return; }
  status.textContent = `Thank you ${$<HTMLInputElement>('#f-name').value.trim().split(/\s+/)[0]}. We have your ${val('type').toLowerCase()} brief${files.length ? ` and ${files.length} file${files.length > 1 ? 's' : ''}` : ''}. Elin or Callum will reply within two working days. (Demo: nothing was sent.)`;
});
