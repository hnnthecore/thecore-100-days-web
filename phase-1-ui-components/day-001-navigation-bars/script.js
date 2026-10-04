/*!
 * Thecore · 100 Days of Web Development
 * Day 001: Navigation Bars
 *
 * Zero dependencies, progressive enhancement. Every nav is semantic HTML that
 * still works as plain links without JavaScript. Scripts only add disclosure
 * state, keyboard support and motion.
 *
 * Components are portable: they look for the nearest [data-scroll-root] (the
 * demo frame) and fall back to the window, so the same code runs unchanged on
 * a real page.
 */
(() => {
  'use strict';

  /* ======================================================================
     Utilities
     ====================================================================== */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
  // Theme toggle and reduced-motion flag come from the shared showcase shell.
  const { toggleTheme, reducedMotion } = window.Thecore;

  const scrollRootOf = (el) => el.closest('[data-scroll-root]');

  const isRendered = (el) => el.getClientRects().length > 0;
  const isFocusable = (el) => isRendered(el) && getComputedStyle(el).visibility !== 'hidden';

  /**
   * Focus an element inside a panel that is being revealed. A panel's
   * children can stay `visibility: hidden` for a frame or two after it
   * opens, so retry briefly until focus lands. Stops early if the panel
   * closes again.
   */
  function focusWhenReady(el, isStillOpen = () => true, attempts = 12) {
    if (!el || !isStillOpen()) return;
    el.focus({ preventScroll: true });
    if (document.activeElement !== el && attempts > 0) {
      requestAnimationFrame(() => focusWhenReady(el, isStillOpen, attempts - 1));
    }
  }

  function setScrollLock(el, locked) {
    const root = scrollRootOf(el) || document.documentElement;
    root.style.overflow = locked ? 'hidden' : '';
  }

  function trapFocus(container, event) {
    const items = $$(FOCUSABLE, container).filter(isFocusable);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /**
   * Disclosure controller shared by sheets, drawers, overlays and dialogs.
   * Keeps aria-expanded in sync and handles focus, Escape, scroll-lock and
   * (for modals) a focus trap.
   */
  function createDisclosure({ triggers, panel, modal = false, onChange }) {
    let isOpen = false;
    let lastTrigger = triggers[0];

    function set(next, { restoreFocus = true } = {}) {
      if (next === isOpen) return;
      isOpen = next;
      panel.dataset.state = isOpen ? 'open' : 'closed';
      triggers.forEach((t) => t.setAttribute('aria-expanded', String(isOpen)));
      if (modal) setScrollLock(panel, isOpen);
      onChange?.(isOpen);

      if (isOpen) {
        const target = $('[data-autofocus]', panel) || $$(FOCUSABLE, panel).find(isRendered);
        focusWhenReady(target, () => isOpen);
      } else if (restoreFocus && panel.contains(document.activeElement)) {
        lastTrigger.focus({ preventScroll: true });
      }
    }

    triggers.forEach((t) => {
      t.addEventListener('click', () => {
        lastTrigger = t;
        set(!isOpen);
      });
      t.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) set(false);
      });
    });

    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        set(false);
      } else if (e.key === 'Tab' && modal) {
        trapFocus(panel, e);
      }
    });

    $$('[data-close]', panel).forEach((el) => el.addEventListener('click', () => set(false)));

    return {
      set,
      toggle(trigger) {
        if (trigger) lastTrigger = trigger;
        set(!isOpen);
      },
      get isOpen() {
        return isOpen;
      },
    };
  }

  /** Close a mobile menu automatically if its container grows past the breakpoint. */
  function closeWhenHidden(container, toggle, controller) {
    new ResizeObserver(() => {
      if (controller.isOpen && !toggle.offsetWidth) controller.set(false, { restoreFocus: false });
    }).observe(container);
  }

  /* ======================================================================
     01 · Aurora: floating glass pill
     ====================================================================== */
  function initAurora(root) {
    const track = $('.aurora__track', root);
    const indicator = $('.aurora__indicator', root);
    const links = $$('.aurora__links a', root);
    let active = links.find((a) => a.hasAttribute('aria-current')) || links[0];

    // The highlight pill glides to whichever link is hovered or focused,
    // then settles back on the current page.
    const moveTo = (el) => {
      if (!el || !el.offsetWidth) return;
      indicator.style.setProperty('--x', `${el.offsetLeft}px`);
      indicator.style.setProperty('--w', `${el.offsetWidth}px`);
      indicator.style.opacity = '1';
    };

    links.forEach((a) => {
      a.addEventListener('pointerenter', () => moveTo(a));
      a.addEventListener('focus', () => moveTo(a));
      a.addEventListener('click', () => {
        active.removeAttribute('aria-current');
        a.setAttribute('aria-current', 'page');
        active = a;
        moveTo(a);
      });
    });

    track.addEventListener('pointerleave', () => moveTo(active));
    track.addEventListener('focusout', (e) => {
      if (!track.contains(e.relatedTarget)) moveTo(active);
    });

    // Re-measure on resize and once web fonts have loaded (widths change).
    new ResizeObserver(() => moveTo(active)).observe(track);
    document.fonts?.ready.then(() => moveTo(active));
    requestAnimationFrame(() => {
      moveTo(active);
      requestAnimationFrame(() => indicator.classList.add('is-ready'));
    });

    // Mobile dropdown sheet
    const toggle = $('.aurora__toggle', root);
    const sheet = document.getElementById(toggle.getAttribute('aria-controls'));
    const menu = createDisclosure({ triggers: [toggle], panel: sheet });

    $$('a', sheet).forEach((a) => a.addEventListener('click', () => menu.set(false)));
    document.addEventListener('pointerdown', (e) => {
      if (menu.isOpen && !sheet.contains(e.target) && !toggle.contains(e.target)) {
        menu.set(false, { restoreFocus: false });
      }
    });
    closeWhenHidden(root, toggle, menu);
  }

  /* ======================================================================
     02 · Atlas: SaaS mega menu
     ====================================================================== */
  function initAtlas(root) {
    const triggers = $$('[data-mega-trigger]', root);
    const panelOf = (t) => document.getElementById(t.getAttribute('aria-controls'));
    let current = null;
    let openTimer = 0;
    let closeTimer = 0;
    let openedByHover = false;

    function open(t, { viaHover = false } = {}) {
      clearTimeout(closeTimer);
      if (current === t) return;

      const switching = Boolean(current);
      if (switching) {
        // Swap panels instantly instead of fading one out and the next in.
        root.classList.add('is-switching');
        hide(current);
        requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('is-switching')));
      }

      t.setAttribute('aria-expanded', 'true');
      panelOf(t).dataset.state = 'open';
      current = t;
      openedByHover = viaHover;
      root.classList.add('has-open');
    }

    function hide(t) {
      t.setAttribute('aria-expanded', 'false');
      panelOf(t).dataset.state = 'closed';
    }

    function close(t = current) {
      if (!t) return;
      hide(t);
      if (t === current) {
        current = null;
        root.classList.remove('has-open');
      }
    }

    triggers.forEach((t) => {
      const item = t.closest('.atlas__item');

      // Hover intent: a short delay stops menus flashing open as the cursor
      // passes over the bar; once one is open, neighbours open instantly.
      item.addEventListener('pointerenter', (e) => {
        if (e.pointerType !== 'mouse') return;
        clearTimeout(closeTimer);
        clearTimeout(openTimer);
        openTimer = setTimeout(() => open(t, { viaHover: true }), current ? 0 : 90);
      });

      item.addEventListener('pointerleave', (e) => {
        if (e.pointerType !== 'mouse') return;
        clearTimeout(openTimer);
        closeTimer = setTimeout(() => close(t), 220);
      });

      // A click right after a hover-open shouldn't immediately close the menu.
      t.addEventListener('click', () => {
        if (current === t && !openedByHover) close(t);
        else open(t);
        openedByHover = false;
      });

      t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          open(t);
          focusWhenReady($('a', panelOf(t)), () => current === t);
        }
      });

      $$('a', panelOf(t)).forEach((a) => a.addEventListener('click', () => close()));
    });

    root.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && current) {
        const t = current;
        close(t);
        t.focus();
      }
    });

    root.addEventListener('focusout', (e) => {
      if (current && e.relatedTarget && !root.contains(e.relatedTarget)) close();
    });

    document.addEventListener('pointerdown', (e) => {
      if (current && !root.contains(e.target)) close();
    });

    // Mobile drawer
    const toggle = $('.atlas__toggle', root);
    const drawer = document.getElementById(toggle.getAttribute('aria-controls'));
    const drawerMenu = createDisclosure({ triggers: [toggle], panel: drawer, modal: true });
    $$('a', drawer).forEach((a) => a.addEventListener('click', () => drawerMenu.set(false)));
    initAccordions(drawer);
    closeWhenHidden(root, toggle, drawerMenu);
  }

  function initAccordions(scope) {
    $$('.accordion__trigger', scope).forEach((btn) => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
      });
    });
  }

  /* ======================================================================
     03 · Halden: editorial overlay
     ====================================================================== */
  function initHalden(root) {
    const button = $('.halden__menu-btn', root);
    const overlay = document.getElementById(button.getAttribute('aria-controls'));
    const menu = createDisclosure({ triggers: [button], panel: overlay, modal: true });

    $$('.halden-overlay__nav a', overlay).forEach((a) => a.addEventListener('click', () => menu.set(false)));

    // Live studio time adds a small human detail.
    const clock = $('[data-clock]', overlay);
    if (clock) {
      const fmt = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Copenhagen',
      });
      const tick = () => {
        clock.textContent = fmt.format(new Date());
      };
      tick();
      setInterval(tick, 15000);
    }
  }

  /* ======================================================================
     04 · Nova: app bar, popovers, command palette
     ====================================================================== */
  function initNova(root) {
    initPopovers(root);
    initPalette(root);

    // Workspace switcher
    const wsName = $('[data-ws-name]', root);
    const wsAvatar = $('[data-ws-avatar]', root);
    $$('[data-ws]', root).forEach((option) => {
      option.addEventListener('click', () => {
        $$('[data-ws]', root).forEach((o) => o.removeAttribute('aria-current'));
        option.setAttribute('aria-current', 'true');
        wsName.textContent = option.dataset.ws;
        wsAvatar.textContent = option.dataset.ws.charAt(0);
        wsAvatar.style.setProperty('--h', option.dataset.h);
      });
    });

    // Notifications: mark all read
    const markRead = $('[data-mark-read]', root);
    markRead?.addEventListener('click', () => {
      $$('.notif.is-unread', root).forEach((n) => n.classList.remove('is-unread'));
      $('[data-unread-badge]', root).hidden = true;
      $('[data-notif-trigger]', root).setAttribute('aria-label', 'Notifications, none unread');
      markRead.disabled = true;
      markRead.textContent = 'All caught up';
    });
  }

  function initPopovers(scope) {
    const triggers = $$('[data-popover-trigger]', scope);
    const panelOf = (t) => document.getElementById(t.getAttribute('aria-controls'));
    const itemsOf = (panel) => $$('.menu-item, a, button', panel).filter(isFocusable);
    let current = null;

    function open(t) {
      if (current && current !== t) close(current);
      t.setAttribute('aria-expanded', 'true');
      panelOf(t).dataset.state = 'open';
      current = t;
    }

    function close(t = current, { focusTrigger = false } = {}) {
      if (!t) return;
      t.setAttribute('aria-expanded', 'false');
      panelOf(t).dataset.state = 'closed';
      if (t === current) current = null;
      if (focusTrigger) t.focus();
    }

    triggers.forEach((t) => {
      const panel = panelOf(t);

      t.addEventListener('click', () => (current === t ? close(t) : open(t)));

      t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          open(t);
          focusWhenReady($$('.menu-item, a, button', panel).find(isRendered), () => current === t);
        } else if (e.key === 'Escape') {
          close(t);
        }
      });

      // Arrow keys move through items like a native menu.
      panel.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          close(t, { focusTrigger: true });
          return;
        }
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        e.preventDefault();
        const items = itemsOf(panel);
        const i = items.indexOf(document.activeElement);
        const next = e.key === 'ArrowDown' ? i + 1 : i - 1;
        items[(next + items.length) % items.length]?.focus();
      });

      $$('.menu-item', panel).forEach((item) => item.addEventListener('click', () => close(t)));
    });

    document.addEventListener('pointerdown', (e) => {
      if (current && !current.parentElement.contains(e.target)) close();
    });

    scope.addEventListener('focusout', (e) => {
      if (current && e.relatedTarget && !current.parentElement.contains(e.relatedTarget)) close();
    });
  }

  function initPalette(root) {
    const triggers = $$('[data-palette-trigger]', root);
    if (!triggers.length) return;

    const palette = document.getElementById(triggers[0].getAttribute('aria-controls'));
    const input = $('.palette__input', palette);
    const list = $('.palette__list', palette);
    const options = $$('[role="option"]', palette);
    const groups = $$('.palette__group', palette);
    const empty = $('.palette__empty', palette);
    const crumb = $('[data-crumb]', root);
    let visible = options;
    let index = 0;

    const controller = createDisclosure({
      triggers,
      panel: palette,
      modal: true,
      onChange(isOpen) {
        if (isOpen) {
          input.value = '';
          filter();
        }
      },
    });

    function highlight(i) {
      options.forEach((o) => o.setAttribute('aria-selected', 'false'));
      if (!visible.length) {
        input.removeAttribute('aria-activedescendant');
        return;
      }
      index = (i + visible.length) % visible.length;
      const el = visible[index];
      el.setAttribute('aria-selected', 'true');
      input.setAttribute('aria-activedescendant', el.id);

      // Keep the highlighted option in view without scrolling the page.
      if (el.offsetTop < list.scrollTop) {
        list.scrollTop = el.offsetTop - 8;
      } else if (el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight) {
        list.scrollTop = el.offsetTop + el.offsetHeight - list.clientHeight + 8;
      }
    }

    function filter() {
      const query = input.value.trim().toLowerCase();
      options.forEach((o) => {
        const haystack = `${o.dataset.label} ${o.textContent} ${o.dataset.keywords || ''}`.toLowerCase();
        o.hidden = Boolean(query) && !haystack.includes(query);
      });
      groups.forEach((g) => {
        g.hidden = !$$('[role="option"]:not([hidden])', g).length;
      });
      visible = options.filter((o) => !o.hidden);
      empty.hidden = visible.length > 0;
      $('span', empty).textContent = input.value.trim();
      list.scrollTop = 0;
      highlight(0);
    }

    function run(option) {
      if (option.dataset.action === 'theme') toggleTheme();
      else if (crumb) crumb.textContent = option.dataset.label;
      controller.set(false);
    }

    input.addEventListener('input', filter);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        highlight(index + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlight(index - 1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (visible[index]) run(visible[index]);
      }
    });

    options.forEach((o) => {
      o.addEventListener('pointermove', () => {
        const i = visible.indexOf(o);
        if (i !== -1 && i !== index) highlight(i);
      });
      o.addEventListener('click', () => run(o));
    });

    // Global ⌘K / Ctrl+K
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (!controller.isOpen) {
          root.closest('[data-frame]')?.scrollIntoView({
            behavior: reducedMotion.matches ? 'auto' : 'smooth',
            block: 'center',
          });
        }
        controller.toggle(triggers.find((t) => t.offsetWidth) || triggers[0]);
      }
    });
  }

  /* ======================================================================
     05 · Pulse: smart sticky header
     ====================================================================== */
  function initPulse(root) {
    const scroller = scrollRootOf(root);
    const target = scroller || window;
    const getY = () => (scroller ? scroller.scrollTop : window.scrollY);
    const getMax = () =>
      scroller
        ? scroller.scrollHeight - scroller.clientHeight
        : document.documentElement.scrollHeight - window.innerHeight;

    const HIDE_AFTER = 140; // px scrolled before the header may hide
    const TOLERANCE = 6; // ignore tiny scroll jitters
    let lastY = getY();
    let ticking = false;

    function update() {
      const y = getY();
      const delta = y - lastY;
      const max = getMax();

      root.classList.toggle('is-scrolled', y > 8);

      if (Math.abs(delta) > TOLERANCE) {
        const hide = delta > 0 && y > HIDE_AFTER && !root.contains(document.activeElement);
        root.classList.toggle('is-hidden', hide);
        lastY = y;
      }

      root.style.setProperty('--progress', max > 0 ? Math.min(1, y / max).toFixed(4) : '0');
      ticking = false;
    }

    // rAF-throttled: at most one layout read per frame, scroll stays at 60fps+.
    target.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );

    // Keyboard users tabbing into a hidden header bring it back.
    root.addEventListener('focusin', () => root.classList.remove('is-hidden'));
    update();
  }

  /* ======================================================================
     06 · Dock: bottom tab bar / side rail
     ====================================================================== */
  function initDock(root) {
    const items = $$('.dock__item', root);
    items.forEach((item) => {
      item.addEventListener('click', () => {
        items.forEach((i) => i.removeAttribute('aria-current'));
        item.setAttribute('aria-current', 'page');
      });
    });
  }

  /* ======================================================================
     Boot
     ====================================================================== */
  const registry = {
    aurora: initAurora,
    atlas: initAtlas,
    halden: initHalden,
    nova: initNova,
    pulse: initPulse,
    dock: initDock,
  };

  $$('[data-nav]').forEach((el) => registry[el.dataset.nav]?.(el));
})();
