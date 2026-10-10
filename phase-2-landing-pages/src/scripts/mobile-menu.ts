/**
 * Phone menu for every landing page.
 * Many headers hide their main navigation below 1024px. This adds a menu button that opens the same links in a panel,
 * so every section stays reachable on a phone. It does nothing when the header already shows its links or has its own menu.
 */
const header = document.querySelector<HTMLElement>('header[class*="-header"]');
const nav = header?.querySelector<HTMLElement>('nav[aria-label="Main"]');
const bar = header?.querySelector<HTMLElement>(':scope > div');

if (header && nav && bar && !header.querySelector('[data-burger], .sys-burger')) {
  const links = [...nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
  if (links.length) {
    const id = 'mm-panel';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mm-btn';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', id);
    btn.innerHTML = '<span class="sr-only">Menu</span><i></i><i></i><i></i>';

    const panel = document.createElement('nav');
    panel.id = id;
    panel.className = 'mm-panel';
    panel.setAttribute('aria-label', 'Mobile');
    panel.hidden = true;
    const ul = document.createElement('ul');
    links.forEach((a) => {
      const li = document.createElement('li');
      const l = document.createElement('a');
      l.href = a.getAttribute('href')!;
      l.textContent = a.textContent?.trim() ?? '';
      li.appendChild(l);
      ul.appendChild(li);
    });
    // On very narrow screens the header buttons move into the panel so nothing runs off the edge
    const actions = [...bar.children].filter((c) => c !== nav && c !== bar.firstElementChild) as HTMLElement[];
    const extra: HTMLElement[] = [];
    actions.forEach((box) => {
      (box.matches('a[href]') ? [box as HTMLAnchorElement] : [...box.querySelectorAll<HTMLAnchorElement>('a[href]')]).forEach((a) => {
        const spans = [...a.querySelectorAll('span')];
        const label = (spans.length ? spans[spans.length - 1].textContent : a.textContent)?.trim();
        if (!label) return;
        const li = document.createElement('li');
        li.className = 'mm-cta';
        li.hidden = true;
        const l = document.createElement('a');
        l.href = a.getAttribute('href')!;
        l.textContent = label;
        li.appendChild(l);
        ul.appendChild(li);
        extra.push(li);
      });
    });
    panel.appendChild(ul);

    // Placed before the nav so the header's own last child (its call-to-action) keeps any last-child styling; CSS order puts the button last on screen
    bar.insertBefore(btn, nav);
    header.appendChild(panel);

    const theme = () => {
      const logo = header.querySelector('a') as HTMLElement;
      const rgb = getComputedStyle(logo).color.match(/\d+/g)!.map(Number);
      const light = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000 > 140;
      panel.dataset.tone = light ? 'dark' : 'light';
      panel.classList.toggle('mm-panel--up', header.getBoundingClientRect().top > innerHeight / 2);
    };
    const open = (v: boolean) => {
      if (v) theme();
      panel.hidden = !v;
      btn.setAttribute('aria-expanded', String(v));
      btn.classList.toggle('is-open', v);
    };
    const sync = () => {
      const visible = nav.offsetParent !== null && getComputedStyle(nav).display !== 'none';
      btn.hidden = visible;
      const tight = !visible && innerWidth < 600;
      actions.forEach((a) => a.classList.toggle('mm-hide', tight));
      extra.forEach((li) => (li.hidden = !tight));
      if (visible) open(false);
    };
    btn.addEventListener('click', () => open(panel.hidden));
    panel.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) open(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { open(false); btn.focus(); } });
    document.addEventListener('click', (e) => { if (!panel.hidden && !header.contains(e.target as Node)) open(false); });
    addEventListener('resize', sync);
    sync();
  }
}
