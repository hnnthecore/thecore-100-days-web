/** Day 054 · progressive interactions: menu, reveals, principles carousel and enquiry validation. */
const root = document.querySelector<HTMLElement>('.e54');

if (root) {
  const header = root.querySelector<HTMLElement>('[data-header]')!;
  const burger = root.querySelector<HTMLButtonElement>('[data-burger]')!;
  const menu = root.querySelector<HTMLElement>('[data-menu]')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const setMenu = (open: boolean) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    document.body.classList.toggle('e54-menu-open', open);
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (event) => { if ((event.target as HTMLElement).closest('a')) setMenu(false); });
  addEventListener('keydown', (event) => { if (event.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); } });
  matchMedia('(min-width: 1020px)').addEventListener('change', (event) => { if (event.matches) setMenu(false); });

  /* Keep navigation as direct page loads and suppress WebKit's force-press destination preview. */
  root.querySelectorAll<HTMLAnchorElement>('.e54-nav a, .e54-mobile-menu a').forEach((link) => {
    link.addEventListener('webkitmouseforcewillbegin', (event) => event.preventDefault());
  });

  const updateHeader = () => header.classList.toggle('is-scrolled', scrollY > 20);
  addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  root.querySelectorAll<HTMLAnchorElement>('a[data-programme]').forEach((link) => {
    link.addEventListener('click', () => {
      const select = root.querySelector<HTMLSelectElement>('#e54-interest');
      if (select && link.dataset.programme) select.value = link.dataset.programme;
    });
  });

  if (!reduced.matches && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('e54-js');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    root.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
  }

  const carousel = root.querySelector<HTMLElement>('[data-carousel]');
  if (carousel) {
    const slides = [...carousel.querySelectorAll<HTMLElement>('[data-slide]')];
    let current = 0;
    const show = (next: number) => {
      current = (next + slides.length) % slides.length;
      slides.forEach((slide, index) => { slide.hidden = index !== current; });
    };
    carousel.querySelector('[data-prev]')?.addEventListener('click', () => show(current - 1));
    carousel.querySelector('[data-next]')?.addEventListener('click', () => show(current + 1));
  }

  const form = root.querySelector<HTMLFormElement>('[data-form]');
  if (form) {
    const status = form.querySelector<HTMLElement>('[data-status]')!;
    const params = new URLSearchParams(location.search);
    const requestedProgramme = params.get('programme');
    const requestedTopic = params.get('topic');
    const interest = form.elements.namedItem('interest') as HTMLSelectElement | null;
    const message = form.elements.namedItem('message') as HTMLTextAreaElement | null;
    if (interest && requestedProgramme && [...interest.options].some((option) => option.value === requestedProgramme)) interest.value = requestedProgramme;
    if (message && requestedTopic) message.value = `I would like to discuss using the resource “${requestedTopic}” in a learning brief.`;
    const validate = (field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
      let valid = field.checkValidity();
      if (field instanceof HTMLTextAreaElement && field.value.trim().length < 12) valid = false;
      field.setAttribute('aria-invalid', String(!valid));
      const described = (field.getAttribute('aria-describedby') || '').split(' ').filter((id) => id.endsWith('error'));
      described.forEach((id) => { const error = document.getElementById(id); if (error) error.hidden = valid; });
      return valid;
    };
    const fields = [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea')];
    fields.forEach((field) => {
      field.addEventListener('blur', () => validate(field));
      field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validate(field); });
      field.addEventListener('change', () => { if (field.getAttribute('aria-invalid') === 'true') validate(field); });
    });
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      status.hidden = true;
      delete status.dataset.state;
      const valid = fields.map(validate).every(Boolean);
      if (!valid) {
        fields.find((field) => field.getAttribute('aria-invalid') === 'true')?.focus();
        return;
      }
      const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim().split(/\s+/)[0];
      const endpoint = form.dataset.endpoint?.trim();
      if (!endpoint) {
        status.innerHTML = `<strong>Your details are complete, ${name}.</strong><span>No enquiry has been sent because secure online delivery is not connected yet.</span>`;
        status.hidden = false;
        status.focus();
        return;
      }

      const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
      const originalLabel = submit.innerHTML;
      submit.disabled = true;
      submit.textContent = 'Sending…';
      try {
        const response = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(`Submission failed with status ${response.status}`);
        status.innerHTML = `<strong>Thank you, ${name}.</strong><span>Your enquiry was sent successfully.</span>`;
        status.dataset.state = 'success';
        form.reset();
        fields.forEach((field) => field.removeAttribute('aria-invalid'));
      } catch {
        status.innerHTML = '<strong>We could not send your enquiry.</strong><span>Please check your connection and try again. Your form details have been kept.</span>';
        status.dataset.state = 'error';
      } finally {
        submit.disabled = false;
        submit.innerHTML = originalLabel;
        status.hidden = false;
        status.focus();
      }
    });
  }
}

