/** Day 045 · Lingua Lane · home page behaviour: the door picker, the course accordion and the question cards. */

/* The eight doors: tabs that swap the photograph and the panel. The photograph opens with a shutter the first time it is seen. */
const doors = document.querySelector<HTMLElement>('[data-doors]');
if (doors) {
  const tabs = [...doors.querySelectorAll<HTMLButtonElement>('[role=tab]')];
  const panels = [...doors.querySelectorAll<HTMLElement>('[role=tabpanel]')];
  const imgs = [...doors.querySelectorAll<HTMLElement>('[data-img]')];
  const show = (i: number, focus = false) => {
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(i === j)); t.tabIndex = i === j ? 0 : -1; });
    panels.forEach((p, j) => p.classList.toggle('is-on', i === j));
    imgs.forEach((p, j) => p.classList.toggle('is-on', i === j));
    if (focus) tabs[i].focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => show(i));
    t.addEventListener('keydown', (e) => {
      const n = tabs.length;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); show((i + 1) % n, true); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); show((i + n - 1) % n, true); }
      if (e.key === 'Home') { e.preventDefault(); show(0, true); }
      if (e.key === 'End') { e.preventDefault(); show(n - 1, true); }
    });
  });
  const plate = doors.querySelector<HTMLElement>('[data-plate]');
  if (plate) {
    if ('IntersectionObserver' in window) {
      // Watch the section, not the plate: the shutter hides the plate itself, so it could never look visible.
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { plate.classList.add('is-in'); io.disconnect(); } }), { threshold: 0.2 });
      io.observe(doors);
    } else plate.classList.add('is-in');
  }
}

/* How a course runs: one panel open at a time. */
const stages = document.querySelector<HTMLElement>('[data-stages]');
if (stages) {
  const items = [...stages.querySelectorAll<HTMLElement>('.dr-stage')];
  items.forEach((li) => li.querySelector('button')!.addEventListener('click', () => {
    items.forEach((x) => { const on = x === li; x.classList.toggle('is-on', on); x.querySelector('button')!.setAttribute('aria-expanded', String(on)); });
  }));
}

/* Questions: one card open at a time. */
const cards = document.querySelector<HTMLElement>('[data-cards]');
if (cards) {
  const items = [...cards.querySelectorAll<HTMLElement>('.dr-card')];
  items.forEach((li) => li.querySelector('button')!.addEventListener('click', () => {
    items.forEach((x) => { const on = x === li; x.classList.toggle('is-on', on); x.querySelector('button')!.setAttribute('aria-expanded', String(on)); });
  }));
}
