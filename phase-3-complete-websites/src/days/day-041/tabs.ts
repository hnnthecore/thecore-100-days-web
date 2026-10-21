/** Day 041 · Pagebound Books · accessible tabs (arrow keys, Home and End) for the book page. */
document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((root) => {
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const select = (t: HTMLButtonElement, focus = false) => {
    tabs.forEach((x) => {
      const on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      root.querySelector<HTMLElement>('#' + x.getAttribute('aria-controls'))!.hidden = !on;
    });
    if (focus) t.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      const k = (e as KeyboardEvent).key;
      const to = k === 'ArrowRight' ? tabs[(i + 1) % tabs.length] : k === 'ArrowLeft' ? tabs[(i + tabs.length - 1) % tabs.length] : k === 'Home' ? tabs[0] : k === 'End' ? tabs[tabs.length - 1] : null;
      if (to) { e.preventDefault(); select(to, true); }
    });
  });
});
