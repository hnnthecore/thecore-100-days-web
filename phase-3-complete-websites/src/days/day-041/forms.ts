/**
 * Day 041 · Pagebound Books · small helpers for accessible form validation, shared by every form on the site.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Validates one field and shows or hides the matching "#<id>-e" error message. */
export function validField(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): boolean {
  const v = el.value.trim();
  let ok = true;
  if (el.required || el.dataset.req !== undefined) {
    if (el instanceof HTMLInputElement && el.type === 'email') ok = EMAIL.test(v);
    else if (el instanceof HTMLInputElement && el.type === 'tel') ok = v.replace(/\D/g, '').length >= 10;
    else ok = v.length > 1;
  } else if (v && el instanceof HTMLInputElement && el.type === 'email') ok = EMAIL.test(v);
  el.setAttribute('aria-invalid', String(!ok));
  const msg = document.getElementById(`${el.id}-e`);
  if (msg) msg.hidden = ok;
  return ok;
}

/** Wires blur validation, and returns a function that validates the whole form and focuses the first problem. */
export function wire(form: HTMLFormElement) {
  const fields = [...form.querySelectorAll<HTMLInputElement>('[data-req]')];
  fields.forEach((f) => f.addEventListener('blur', () => { if (f.value) validField(f); }));
  return () => {
    const bad = fields.filter((f) => !validField(f));
    bad[0]?.focus();
    return bad.length === 0;
  };
}
