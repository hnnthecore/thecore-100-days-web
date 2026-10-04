/*!
 * Thecore · 100 Days of Web Development
 * Day 010: Product Cards
 *
 * Cards are plain HTML (product name links, real images, real checkboxes).
 * Scripts add swatches, basket/order state, in-card carousels, compare,
 * quick view and the marketplace states. Nothing is sent anywhere.
 */
(() => {
  'use strict';

  const { $, $$ } = window.Thecore;
  // Simulated network time (not an animation, so it ignores reduced-motion settings)
  const networkDelay = (ms) => new Promise((r) => setTimeout(r, ms));

  function toast(el, html) {
    el.innerHTML = html;
    el.classList.add('is-visible');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('is-visible'), 2200);
  }

  /* ======================================================================
     01 · Norde: shop cards (swatches, wishlist, quick add, notify)
     ====================================================================== */
  (() => {
    const root = $('[data-shop]');
    const basket = $('[data-basket]', root);
    const count = $('[data-basket-count]', root);
    const toastEl = $('[data-toast]', root);
    const COLOR_NAMES = { sage: 'Sage', sand: 'Sand', clay: 'Clay' };
    let items = 0;

    // Colour swatches (WAI-ARIA radio group with arrow keys)
    $$('.pcard__swatches', root).forEach((group) => {
      const card = group.closest('[data-pcard]');
      const radios = $$('[role="radio"]', group);
      const img = $('[data-img]', card);
      const alt = $('[data-img-alt]', card);

      const select = (radio, focus = false) => {
        radios.forEach((r) => {
          r.setAttribute('aria-checked', String(r === radio));
          r.tabIndex = r === radio ? 0 : -1;
        });
        if (focus) radio.focus();
        const c = radio.dataset.color;
        img.classList.add('is-swapping');
        setTimeout(() => {
          img.src = `images/vase-${c}.svg`;
          alt.src = `images/vase-${c}-styled.svg`;
          img.alt = `${card.dataset.name} in ${COLOR_NAMES[c].toLowerCase()}`;
          img.classList.remove('is-swapping');
        }, 120);
        $('[data-variant]', card).textContent = COLOR_NAMES[c];
      };

      radios.forEach((radio, i) => {
        radio.addEventListener('click', () => select(radio));
        radio.addEventListener('keydown', (e) => {
          const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
          if (!step) return;
          e.preventDefault();
          select(radios[(i + step + radios.length) % radios.length], true);
        });
      });
    });

    root.addEventListener('click', (e) => {
      const wish = e.target.closest('.pcard__wish');
      if (wish) {
        const on = wish.getAttribute('aria-pressed') !== 'true';
        wish.setAttribute('aria-pressed', String(on));
        const name = wish.closest('[data-pcard]').dataset.name;
        toast(toastEl, on ? `♥ ${name} saved to your wishlist` : `Removed ${name} from your wishlist`);
        return;
      }

      const quick = e.target.closest('[data-quick-add]');
      if (quick) {
        const card = quick.closest('[data-pcard]');
        const variant = $('.pcard__variant', card).textContent;
        items += 1;
        count.textContent = items;
        basket.classList.remove('is-bumped');
        void basket.offsetWidth;
        basket.classList.add('is-bumped');
        quick.classList.add('is-added');
        quick.innerHTML = '<svg class="icon"><use href="#i-check"/></svg>Added';
        toast(toastEl, `<svg class="icon"><use href="#i-check"/></svg>${card.dataset.name} (${variant}) added to basket`);
        setTimeout(() => {
          quick.classList.remove('is-added');
          quick.innerHTML = '<svg class="icon"><use href="#i-plus"/></svg>Quick add';
        }, 1600);
        return;
      }

      const notify = e.target.closest('[data-notify]');
      if (notify) {
        const on = notify.getAttribute('aria-pressed') !== 'true';
        notify.setAttribute('aria-pressed', String(on));
        notify.textContent = on ? '✓ We’ll email you when it’s back' : 'Notify me when back';
      }
    });
  })();

  /* ======================================================================
     02 · Forma: listing cards with in-card photo carousel
     ====================================================================== */
  $$('[data-lcard]').forEach((card) => {
    const media = $('.lcard__media', card);
    const img = $('[data-l-img]', card);
    const slides = JSON.parse(media.dataset.slides);
    const alts = JSON.parse(media.dataset.alts);
    const dotsWrap = $('[data-l-dots]', card);
    const status = $('[data-l-status]', card);
    const name = $('.lcard__name', card).textContent.trim();
    let index = 0;

    dotsWrap.innerHTML = slides.map(() => '<i></i>').join('');
    const dots = $$('i', dotsWrap);

    const show = (i) => {
      index = (i + slides.length) % slides.length;
      img.src = slides[index];
      img.alt = `${name}, ${alts[index].toLowerCase()}`;
      img.style.animation = 'none';
      void img.offsetWidth;
      img.style.animation = '';
      dots.forEach((d, n) => d.classList.toggle('is-on', n === index));
      status.textContent = `Photo ${index + 1} of ${slides.length}: ${alts[index]}`;
    };

    $('[data-l-prev]', card).addEventListener('click', () => show(index - 1));
    $('[data-l-next]', card).addEventListener('click', () => show(index + 1));

    let startX = null;
    media.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') startX = e.clientX; });
    media.addEventListener('pointerup', (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 35) show(index + (dx < 0 ? 1 : -1));
    });

    $('.lcard__save', card).addEventListener('click', (e) => {
      const btn = e.currentTarget;
      btn.setAttribute('aria-pressed', String(btn.getAttribute('aria-pressed') !== 'true'));
    });

    show(0);
  });

  /* ======================================================================
     03 · Ember: menu items, Add → stepper, order bar
     ====================================================================== */
  (() => {
    const root = $('[data-menu]');
    const bar = $('[data-orderbar]', root);
    const countEl = $('[data-order-count]', root);
    const totalEl = $('[data-order-total]', root);
    const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });
    const qty = new Map();

    function renderControl(card) {
      const ctrl = $('[data-ctrl]', card);
      const n = qty.get(card) || 0;
      const name = card.dataset.name;
      if (!n) {
        ctrl.innerHTML = `<button class="add-btn" type="button" data-add aria-label="Add ${name}">Add</button>`;
      } else if (!$('.stepper', ctrl)) {
        ctrl.innerHTML = `<span class="stepper" role="group" aria-label="${name} quantity">
          <button type="button" data-dec aria-label="Remove one ${name}"><svg class="icon"><use href="#i-minus"/></svg></button>
          <input type="number" value="${n}" min="0" max="20" readonly aria-label="${name} quantity" tabindex="-1">
          <button type="button" data-inc aria-label="Add one more ${name}"><svg class="icon"><use href="#i-plus"/></svg></button>
        </span>`;
      } else {
        $('input', ctrl).value = n;
      }
    }

    function renderBar() {
      let count = 0;
      let total = 0;
      qty.forEach((n, card) => { count += n; total += n * Number(card.dataset.price); });
      bar.hidden = count === 0;
      countEl.textContent = `${count} item${count === 1 ? '' : 's'}`;
      totalEl.textContent = gbp.format(total);
    }

    const cards = $$('[data-item]', root);
    cards.forEach(renderControl);

    root.addEventListener('click', (e) => {
      const card = e.target.closest('[data-item]');
      if (!card) return;
      const n = qty.get(card) || 0;
      if (e.target.closest('[data-add]')) {
        qty.set(card, 1);
        renderControl(card);
        $('[data-inc]', card).focus();
      } else if (e.target.closest('[data-inc]')) {
        qty.set(card, Math.min(20, n + 1));
        renderControl(card);
      } else if (e.target.closest('[data-dec]')) {
        qty.set(card, n - 1);
        if (n - 1 <= 0) {
          qty.delete(card);
          renderControl(card);
          $('[data-add]', card).focus();
        } else {
          renderControl(card);
        }
      } else {
        return;
      }
      renderBar();
    });
  })();

  /* ======================================================================
     04 · Drive: car listings with price mode + compare tray
     ====================================================================== */
  (() => {
    const root = $('[data-cars]');
    const cards = $$('[data-car]', root);
    const tray = $('[data-ctray]', root);
    const trayText = $('[data-ctray-text]', root);
    const go = $('[data-ctray-go]', root);
    const MAX = 3;
    const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });

    function renderPrices() {
      const monthly = $('input[name="carPrice"]:checked', root).value === 'monthly';
      cards.forEach((card) => {
        $('[data-price]', card).innerHTML = monthly
          ? `${gbp.format(card.dataset.monthly)}<small>/month</small>`
          : gbp.format(card.dataset.cash);
      });
    }

    function renderCompare() {
      const checked = cards.filter((c) => $('[data-compare-check]', c).checked);
      cards.forEach((c) => {
        const box = $('[data-compare-check]', c);
        c.classList.toggle('is-compared', box.checked);
        box.disabled = !box.checked && checked.length >= MAX;
      });
      tray.hidden = checked.length === 0;
      trayText.textContent = checked.length === 1
        ? `${checked[0].dataset.name} selected. Pick one more.`
        : `${checked.length} cars selected${checked.length >= MAX ? ' (maximum)' : ''}`;
      go.textContent = `Compare (${checked.length})`;
      go.setAttribute('aria-disabled', String(checked.length < 2));
    }

    root.addEventListener('change', (e) => {
      if (e.target.name === 'carPrice') renderPrices();
      if (e.target.matches('[data-compare-check]')) renderCompare();
    });
    $('[data-ctray-clear]', root).addEventListener('click', () => {
      $$('[data-compare-check]', root).forEach((b) => { b.checked = false; });
      renderCompare();
    });

    renderPrices();
    renderCompare();
  })();

  /* ======================================================================
     05 · Aurum: luxury cards with accessible quick view
     ====================================================================== */
  (() => {
    const root = $('[data-luxe]');
    const qv = $('[data-qv]', root);
    const panel = $('.qv__panel', qv);
    const error = $('[data-qv-error]', qv);
    const note = $('[data-qv-note]', qv);
    const scroller = root.closest('[data-scroll-root]');
    let opener = null;

    function open(card, trigger) {
      opener = trigger;
      $('[data-qv-img]', qv).src = $('img', card).src;
      $('[data-qv-img]', qv).alt = $('img', card).alt;
      $('[data-qv-name]', qv).textContent = card.dataset.name;
      $('[data-qv-metal]', qv).textContent = card.dataset.metal;
      $('[data-qv-price]', qv).textContent = card.dataset.price;
      $('[data-qv-desc]', qv).textContent = card.dataset.desc;
      $$('input[name="qvSize"]', qv).forEach((r) => { r.checked = false; });
      error.textContent = '';
      note.classList.remove('is-done');
      note.textContent = 'Complimentary engraving · Free insured delivery';
      qv.hidden = false;
      if (scroller) scroller.style.overflow = 'hidden';
      let tries = 12;
      const focus = () => {
        const btn = $('.qv__close', qv);
        btn.focus({ preventScroll: true });
        if (document.activeElement !== btn && tries-- > 0) requestAnimationFrame(focus);
      };
      focus();
    }

    function close() {
      qv.hidden = true;
      if (scroller) scroller.style.overflow = '';
      opener?.focus({ preventScroll: true });
    }

    $$('[data-quick]', root).forEach((btn) => btn.addEventListener('click', () => open(btn.closest('[data-x]'), btn)));
    $$('[data-qv-close]', qv).forEach((el) => el.addEventListener('click', close));

    qv.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
      if (e.key !== 'Tab') return;
      const f = $$('button, a[href], input:not(:disabled)', panel).filter((el) => el.offsetParent !== null);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });

    $('[data-qv-add]', qv).addEventListener('click', () => {
      const size = $('input[name="qvSize"]:checked', qv);
      if (!size) {
        error.textContent = 'Please choose a ring size.';
        $('input[name="qvSize"]:not(:disabled)', qv).focus();
        return;
      }
      error.textContent = '';
      note.classList.add('is-done');
      note.textContent = `✓ Added ${$('[data-qv-name]', qv).textContent}, size ${size.value}, to your bag.`;
    });

    qv.addEventListener('change', () => { error.textContent = ''; });
  })();

  /* ======================================================================
     06 · Nova: marketplace with skeletons, filters and install states
     ====================================================================== */
  (() => {
    const root = $('[data-apps]');
    const grid = $('[data-agrid]', root);
    const status = $('[data-apps-status]', root);
    const APPS = [
      { name: 'Slack', by: 'Slack Technologies', cat: 'comms', desc: 'Post updates and alerts to channels.', tile: 'oklch(55% 0.18 330)', letter: 'S', rating: 4.8, installs: '48k' },
      { name: 'GitHub', by: 'GitHub', cat: 'dev', desc: 'Link commits and pull requests to projects.', tile: 'oklch(25% 0.02 270)', letter: 'G', rating: 4.9, installs: '62k' },
      { name: 'Zendesk', by: 'Zendesk', cat: 'comms', desc: 'Turn support tickets into tasks.', tile: 'oklch(55% 0.1 160)', letter: 'Z', rating: 4.5, installs: '12k' },
      { name: 'Sentry', by: 'Sentry', cat: 'dev', desc: 'See errors next to the work that caused them.', tile: 'oklch(45% 0.15 300)', letter: 'S', rating: 4.7, installs: '21k' },
      { name: 'Looker', by: 'Google Cloud', cat: 'data', desc: 'Embed dashboards in any project.', tile: 'oklch(58% 0.17 255)', letter: 'L', rating: 4.4, installs: '9k' },
      { name: 'Segment', by: 'Twilio', cat: 'data', desc: 'Send product events to every tool.', tile: 'oklch(60% 0.14 175)', letter: 'S', rating: 4.6, installs: '15k' },
    ];
    const installed = new Set(['GitHub']);
    let category = 'all';

    const skeleton = () => `<div class="acard acard--skeleton" aria-hidden="true">
      <div class="acard__top"><span class="sk sk--icon"></span><span style="flex:1;display:grid;gap:6px"><span class="sk sk--line" style="width:60%"></span><span class="sk sk--line" style="width:40%"></span></span></div>
      <span class="sk sk--line"></span><span class="sk sk--line" style="width:80%"></span><span class="sk sk--btn"></span></div>`;

    const label = (name) => (installed.has(name) ? 'Installed ✓' : 'Install');

    function render() {
      const list = APPS.filter((a) => category === 'all' || a.cat === category);
      grid.innerHTML = list.map((a, i) => `
        <article class="acard" style="--i:${i}">
          <div class="acard__top"><span class="acard__icon" style="--tile:${a.tile}" aria-hidden="true">${a.letter}</span><div><h4>${a.name}</h4><p class="acard__by">by ${a.by}</p></div></div>
          <p>${a.desc}</p>
          <p class="acard__meta"><span><svg class="icon"><use href="#i-star"/></svg> ${a.rating}</span><span>${a.installs} installs</span></p>
          <button class="install" type="button" data-app="${a.name}" data-state="${installed.has(a.name) ? 'installed' : 'idle'}" aria-label="${installed.has(a.name) ? `${a.name} is installed. Activate to remove` : `Install ${a.name}`}">${label(a.name)}</button>
        </article>`).join('');
      grid.setAttribute('aria-busy', 'false');
      status.textContent = `${list.length} integration${list.length === 1 ? '' : 's'} shown`;
    }

    async function load() {
      grid.setAttribute('aria-busy', 'true');
      status.textContent = 'Loading integrations…';
      grid.innerHTML = Array.from({ length: 6 }, skeleton).join('');
      await networkDelay(1200);
      render();
    }

    $$('[data-cat]', root).forEach((btn) => {
      btn.addEventListener('click', () => {
        category = btn.dataset.cat;
        $$('[data-cat]', root).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        render();
      });
    });

    $('[data-apps-reload]', root).addEventListener('click', load);

    grid.addEventListener('click', async (e) => {
      const btn = e.target.closest('.install');
      if (!btn || btn.dataset.state === 'installing') return;
      const name = btn.dataset.app;
      if (btn.dataset.state === 'installed') {
        installed.delete(name);
        btn.dataset.state = 'idle';
        btn.textContent = 'Install';
        btn.setAttribute('aria-label', `Install ${name}`);
        status.textContent = `${name} removed`;
        return;
      }
      btn.dataset.state = 'installing';
      btn.textContent = 'Installing…';
      status.textContent = `Installing ${name}…`;
      await networkDelay(1400);
      installed.add(name);
      btn.dataset.state = 'installed';
      btn.textContent = 'Installed ✓';
      btn.setAttribute('aria-label', `${name} is installed. Activate to remove`);
      status.textContent = `${name} installed`;
    });

    // Remove label on hover for installed apps
    grid.addEventListener('pointerover', (e) => {
      const btn = e.target.closest('.install[data-state="installed"]');
      if (btn) btn.textContent = 'Remove';
    });
    grid.addEventListener('pointerout', (e) => {
      const btn = e.target.closest('.install[data-state="installed"]');
      if (btn) btn.textContent = 'Installed ✓';
    });

    load();
  })();
})();
