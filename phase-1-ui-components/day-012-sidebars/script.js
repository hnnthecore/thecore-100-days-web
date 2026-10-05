/*!
 * Thecore · 100 Days of Web Development
 * Day 012: Sidebars
 *
 * Six independent sidebars. Each block below is self-contained, so any one
 * can be copied into a project on its own.
 */
(() => {
  'use strict';

  const { $, $$, reducedMotion } = window.Thecore;

  const store = {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* private mode */ } },
  };

  /* Focus an element once it's actually focusable (it may still be mid-transition). */
  function focusSoon(el, tries = 10) {
    if (!el) return;
    el.focus({ preventScroll: true });
    if (document.activeElement !== el && tries > 0) requestAnimationFrame(() => focusSoon(el, tries - 1));
  }

  /* Demo links point nowhere. Mark the clicked one as current instead of jumping. */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.frame a[href="#"]');
    if (!link) return;
    e.preventDefault();
    const nav = link.closest('nav');
    if (!nav || link.closest('.side__sub')) return;
    $$('a[aria-current="page"]', nav).forEach((a) => a.removeAttribute('aria-current'));
    link.setAttribute('aria-current', 'page');
  });

  /* ======================================================================
     01 · Lumen: collapsible app sidebar
     ====================================================================== */
  (() => {
    const shell = $('[data-app]');
    const side = $('[data-side]', shell);
    const btn = $('[data-collapse]', side);
    const tip = $('[data-tip-el]', side);
    const title = $('.shell__main h3', shell);
    const KEY = 'thecore-d12-sidebar';

    function setCollapsed(collapsed, save = true) {
      shell.classList.toggle('is-collapsed', collapsed);
      btn.setAttribute('aria-pressed', String(collapsed));
      btn.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
      hideTip();
      if (save) store.set(KEY, collapsed ? '1' : '0');
    }

    // The sidebar is a rail when the user collapsed it, or the frame is narrow.
    const isRail = () => side.offsetWidth < 120;

    btn.addEventListener('click', () => setCollapsed(!shell.classList.contains('is-collapsed')));
    setCollapsed(store.get(KEY) === '1', false);

    // Expandable groups. Clicking a group while collapsed opens the sidebar first.
    $$('.side__group > button', side).forEach((groupBtn) => {
      const list = document.getElementById(groupBtn.getAttribute('aria-controls'));
      groupBtn.addEventListener('click', () => {
        if (shell.classList.contains('is-collapsed')) {
          setCollapsed(false);
          groupBtn.setAttribute('aria-expanded', 'true');
          list.hidden = false;
          return;
        }
        const open = groupBtn.getAttribute('aria-expanded') !== 'true';
        groupBtn.setAttribute('aria-expanded', String(open));
        list.hidden = !open;
      });
    });

    // Page title follows the selected link.
    $$('.side__nav > a', side).forEach((a) => a.addEventListener('click', () => {
      title.textContent = $('.side__label', a).textContent;
    }));

    // Tooltips: only in rail mode, on hover and keyboard focus.
    function showTip(el) {
      if (!isRail()) return;
      const box = side.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      tip.textContent = el.dataset.tip;
      tip.style.top = `${r.top - box.top + r.height / 2}px`;
      tip.hidden = false;
    }
    function hideTip() { tip.hidden = true; }

    $$('[data-tip]', side).forEach((el) => {
      el.addEventListener('pointerenter', () => showTip(el));
      el.addEventListener('pointerleave', hideTip);
      el.addEventListener('focus', () => { if (el.matches(':focus-visible')) showTip(el); });
      el.addEventListener('blur', hideTip);
    });
    side.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideTip(); });
    $('.side__nav', side).addEventListener('scroll', hideTip, { passive: true });
  })();

  /* ======================================================================
     02 · Atlas: documentation nav with filter + scroll-spy
     ====================================================================== */
  (() => {
    const root = $('[data-docs]');
    const tree = $('[data-docs-tree]', root);
    const input = $('[data-docs-filter]', root);
    const none = $('[data-docs-none]', root);
    const content = $('[data-docs-scroll]', root);
    const toc = $$('[data-toc] a', root);
    const groups = $$('.tree-group', tree);

    function setGroup(btn, open) {
      btn.setAttribute('aria-expanded', String(open));
      document.getElementById(btn.getAttribute('aria-controls')).hidden = !open;
    }

    groups.forEach((g) => {
      const btn = $('button', g);
      btn.dataset.userOpen = btn.getAttribute('aria-expanded');
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') !== 'true';
        setGroup(btn, open);
        if (!input.value.trim()) btn.dataset.userOpen = String(open);
      });
    });

    // Filter: hide pages that don't match, open groups that do, highlight the match.
    const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      let total = 0;
      groups.forEach((g) => {
        const btn = $('button', g);
        let hits = 0;
        $$('li', g).forEach((li) => {
          const a = $('a', li);
          const text = a.dataset.text || (a.dataset.text = a.textContent);
          const i = text.toLowerCase().indexOf(q);
          const match = !q || i !== -1;
          li.hidden = !match;
          a.innerHTML = q && match
            ? `${escape(text.slice(0, i))}<mark>${escape(text.slice(i, i + q.length))}</mark>${escape(text.slice(i + q.length))}`
            : escape(text);
          if (match) hits++;
        });
        g.hidden = hits === 0;
        setGroup(btn, q ? hits > 0 : btn.dataset.userOpen === 'true');
        total += hits;
      });
      none.hidden = total > 0;
    });

    // Scroll-spy: the active heading is the last one above a line near the top.
    const heads = toc.map((a) => document.getElementById(a.hash.slice(1)));
    function spy() {
      const top = content.getBoundingClientRect().top + 80;
      let active = 0;
      heads.forEach((h, i) => { if (h.getBoundingClientRect().top <= top) active = i; });
      if (content.scrollTop + content.clientHeight >= content.scrollHeight - 4) active = heads.length - 1;
      toc.forEach((a, i) => {
        a.classList.toggle('is-active', i === active);
        if (i === active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    }
    let ticking = false;
    content.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { spy(); ticking = false; });
    }, { passive: true });
    spy();

    // "On this page" links scroll the article, not the whole page.
    toc.forEach((a, i) => a.addEventListener('click', (e) => {
      e.preventDefault();
      const h = heads[i];
      const y = h.getBoundingClientRect().top - content.getBoundingClientRect().top + content.scrollTop - 16;
      content.scrollTo({ top: y, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      h.setAttribute('tabindex', '-1');
      h.focus({ preventScroll: true });
    }));
  })();

  /* ======================================================================
     03 · Nova: swipeable drawer
     ====================================================================== */
  (() => {
    const root = $('[data-mshell]');
    const drawer = $('[data-drawer]', root);
    const openBtn = $('[data-drawer-open]', root);
    const closeBtn = $('[data-drawer-close]', root);
    const backdrop = $('[data-drawer-backdrop]', root);
    const title = $('.mshell__bar strong', root);

    // Overlay mode only on narrow frames; on wide ones it's a static sidebar.
    const isOverlay = () => getComputedStyle(drawer).position === 'absolute';
    const isOpen = () => drawer.classList.contains('is-open');

    function open() {
      drawer.classList.add('is-open');
      backdrop.hidden = false;
      openBtn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('role', 'dialog');
      drawer.setAttribute('aria-modal', 'true');
      focusSoon($('a[aria-current="page"]', drawer) || $('a', drawer));
    }

    function close({ returnFocus = true } = {}) {
      if (!isOpen()) return;
      drawer.classList.remove('is-open');
      drawer.style.translate = '';
      backdrop.hidden = true;
      backdrop.style.removeProperty('--backdrop');
      openBtn.setAttribute('aria-expanded', 'false');
      drawer.removeAttribute('role');
      drawer.removeAttribute('aria-modal');
      if (returnFocus && isOverlay()) focusSoon(openBtn);
    }

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', () => close());
    backdrop.addEventListener('click', () => close());

    drawer.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      title.textContent = a.textContent.trim();
      if (isOverlay()) close();
    });

    // Esc closes; Tab stays inside while open.
    drawer.addEventListener('keydown', (e) => {
      if (!isOpen() || !isOverlay()) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      const items = $$('a, button', drawer);
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // Drag to close: the drawer follows the finger, then decides by distance or speed.
    let drag = null;
    drawer.addEventListener('pointerdown', (e) => {
      if (!isOpen() || !isOverlay() || e.button !== 0) return;
      drag = { x: e.clientX, y: e.clientY, dx: 0, t: performance.now(), moving: false, id: e.pointerId };
    });

    drawer.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      if (!drag.moving) {
        if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) {
          if (Math.abs(dy) > 10) drag = null; // vertical scroll wins
          return;
        }
        drag.moving = true;
        drawer.setPointerCapture(e.pointerId);
        drawer.classList.add('is-dragging');
      }
      drag.dx = Math.min(0, dx);
      drawer.style.translate = `${drag.dx}px 0`;
      backdrop.style.setProperty('--backdrop', String(1 + drag.dx / drawer.offsetWidth));
    });

    function endDrag(e) {
      if (!drag || e.pointerId !== drag.id) return;
      const { moving, dx, t } = drag;
      drag = null;
      if (!moving) return;
      drawer.classList.remove('is-dragging');
      const speed = Math.abs(dx) / (performance.now() - t); // px per ms
      drawer.style.translate = '';
      backdrop.style.removeProperty('--backdrop');
      if (dx < -drawer.offsetWidth * 0.35 || speed > 0.6) close();
      // A drag shouldn't also count as a click on the link underneath.
      suppressClickUntil = performance.now() + 50;
    }
    let suppressClickUntil = 0;
    drawer.addEventListener('click', (e) => {
      if (performance.now() < suppressClickUntil) { e.preventDefault(); e.stopImmediatePropagation(); }
    }, { capture: true });
    drawer.addEventListener('pointerup', endDrag);
    drawer.addEventListener('pointercancel', endDrag);

    // Switching the preview to desktop while open: drop the overlay state.
    new ResizeObserver(() => { if (!isOverlay() && isOpen()) close({ returnFocus: false }); }).observe(root);
  })();

  /* ======================================================================
     04 · Forma: search filters
     ====================================================================== */
  (() => {
    const root = $('[data-filters]');
    const dual = $('[data-dual]', root);
    const min = $('[data-min]', root);
    const max = $('[data-max]', root);
    const priceOut = $('[data-price-out]', root);
    const countOut = $('[data-result-count]', root);
    const chips = $('[data-chips]', root);
    const list = $('[data-list]', root);
    const clear = $('[data-clear]', root);

    const LO = Number(min.min);
    const HI = Number(min.max);
    const STEP = Number(min.step);
    const money = (v) => (v >= 1e6 ? `£${(v / 1e6).toFixed(v % 1e6 ? 2 : 0).replace(/0$/, '')}M` : `£${Math.round(v / 1000)}k`);

    const HOMES = [
      ['Harbour View Cottage', 'house', 685000, 3, ['garden', 'sea'], 'St Ives'],
      ['The Old Rectory', 'house', 1450000, 5, ['garden', 'parking'], 'Burford'],
      ['Canal Wharf Loft', 'apartment', 520000, 2, ['parking'], 'Manchester'],
      ['Meadow Lane', 'house', 395000, 3, ['garden', 'parking'], 'Harrogate'],
      ['Clifftop Apartment', 'apartment', 890000, 2, ['sea', 'parking'], 'Brighton'],
      ['Albion Mews', 'townhouse', 1150000, 4, ['garden'], 'Bath'],
      ['Riverside Studio', 'apartment', 285000, 1, [], 'York'],
      ['Elm Grove Villa', 'house', 2350000, 6, ['garden', 'parking'], 'Surrey'],
      ['Marina Penthouse', 'apartment', 1950000, 3, ['sea', 'parking'], 'Poole'],
      ['Sunnybank Terrace', 'townhouse', 465000, 3, ['garden'], 'Leeds'],
      ['Orchard House', 'house', 760000, 4, ['garden', 'parking'], 'Ludlow'],
      ['The Lookout', 'house', 2800000, 5, ['garden', 'sea', 'parking'], 'Salcombe'],
      ['Garden Flat', 'apartment', 440000, 2, ['garden'], 'Bristol'],
      ['Quayside Townhouse', 'townhouse', 625000, 3, ['parking', 'sea'], 'Falmouth'],
    ].map(([name, type, price, beds, feats, town], i) => ({ name, type, price, beds, feats, town, h: (i * 47) % 360 }));

    const LABEL = { house: 'House', apartment: 'Apartment', townhouse: 'Townhouse', garden: 'Garden', parking: 'Parking', sea: 'Sea view' };

    function read() {
      return {
        lo: Number(min.value),
        hi: Number(max.value),
        types: $$('input[name="type"]:checked', root).map((i) => i.value),
        beds: Number($('input[name="beds"]:checked', root).value),
        feats: $$('input[name="feat"]:checked', root).map((i) => i.value),
      };
    }

    const matches = (h, f, ignoreType = false) =>
      h.price >= f.lo && h.price <= f.hi &&
      (ignoreType || !f.types.length || f.types.includes(h.type)) &&
      h.beds >= f.beds &&
      f.feats.every((x) => h.feats.includes(x));

    function render() {
      const f = read();
      dual.style.setProperty('--lo', `${((f.lo - LO) / (HI - LO)) * 100}%`);
      dual.style.setProperty('--hi', `${((f.hi - LO) / (HI - LO)) * 100}%`);
      priceOut.textContent = `${money(f.lo)} – ${money(f.hi)}${f.hi === HI ? '+' : ''}`;
      min.setAttribute('aria-valuetext', money(f.lo));
      max.setAttribute('aria-valuetext', money(f.hi));

      // Each type shows how many results you'd get with it, given the other filters.
      $$('[data-count]', root).forEach((el) => {
        el.textContent = HOMES.filter((h) => h.type === el.dataset.count && matches(h, f, true)).length;
      });

      const results = HOMES.filter((h) => matches(h, f)).sort((a, b) => a.price - b.price);
      countOut.innerHTML = `${results.length} ${results.length === 1 ? 'home' : 'homes'} <span>of ${HOMES.length}</span>`;

      list.innerHTML = results.length
        ? results.map((h) => `<li><div class="flist__img" style="--h:${h.h}" aria-hidden="true"></div><div class="flist__body"><strong>${money(h.price)}</strong><span>${h.name}</span><small>${h.town} · ${h.beds} bed · ${LABEL[h.type]}</small></div></li>`).join('')
        : '<li class="flist__empty">No homes match. Try widening the price range or removing a filter.</li>';

      // Active-filter chips.
      const active = [];
      if (f.lo !== LO || f.hi !== HI) active.push(['price', '', priceOut.textContent]);
      f.types.forEach((t) => active.push(['type', t, LABEL[t]]));
      if (f.beds) active.push(['beds', '', `${f.beds}+ beds`]);
      f.feats.forEach((t) => active.push(['feat', t, LABEL[t]]));
      chips.innerHTML = active.map(([k, v, text]) =>
        `<li><button type="button" data-k="${k}" data-v="${v}" aria-label="Remove filter: ${text}">${text}<svg class="icon" aria-hidden="true"><use href="#i-x"/></svg></button></li>`).join('');
      clear.disabled = !active.length;
    }

    // Keep the two handles from crossing.
    min.addEventListener('input', () => { if (Number(min.value) > Number(max.value) - STEP) min.value = Number(max.value) - STEP; });
    max.addEventListener('input', () => { if (Number(max.value) < Number(min.value) + STEP) max.value = Number(min.value) + STEP; });
    root.addEventListener('input', render);
    root.addEventListener('change', render);

    function remove(k, v) {
      if (k === 'price') { min.value = LO; max.value = HI; }
      if (k === 'beds') $('input[name="beds"][value="0"]', root).checked = true;
      if (k === 'type' || k === 'feat') $(`input[name="${k}"][value="${v}"]`, root).checked = false;
    }

    chips.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      const idx = $$('button', chips).indexOf(b);
      remove(b.dataset.k, b.dataset.v);
      render();
      // Keep keyboard focus in the chip row (next chip, or the heading when none are left).
      const left = $$('button', chips);
      (left[Math.min(idx, left.length - 1)] || clear.closest('.fpanel').querySelector('h3')).focus?.();
    });

    clear.addEventListener('click', () => {
      min.value = LO; max.value = HI;
      $$('input[type="checkbox"]', root).forEach((i) => { i.checked = false; });
      $('input[name="beds"][value="0"]', root).checked = true;
      render();
      countOut.focus?.();
    });

    render();
  })();

  /* ======================================================================
     05 · Settings: vertical tabs + unsaved changes
     ====================================================================== */
  (() => {
    const root = $('[data-settings]');
    const tabs = $$('[role="tab"]', root);
    const panels = $$('[data-panel]', root);
    const bar = $('[data-savebar]', root);
    const saved = $('[data-saved]', root);
    let savedTimer = 0;

    function select(tab, focus = true) {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    }

    tabs.forEach((t) => t.addEventListener('click', () => select(t)));
    $('[role="tablist"]', root).addEventListener('keydown', (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i === -1) return;
      const next = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select(tabs[(next + tabs.length) % tabs.length]);
    });

    // Snapshot every field so we can tell what changed and undo it.
    const fields = (p) => $$('input', p);
    const value = (i) => (i.type === 'checkbox' ? i.checked : i.value);
    const snapshot = () => panels.forEach((p) => fields(p).forEach((i) => { i.dataset.saved = String(value(i)); }));

    function check() {
      let any = false;
      panels.forEach((p) => {
        const dirty = fields(p).some((i) => String(value(i)) !== i.dataset.saved);
        tabs.find((t) => t.getAttribute('aria-controls') === p.id).classList.toggle('is-dirty', dirty);
        any ||= dirty;
      });
      bar.hidden = !any;
      if (any) saved.textContent = '';
    }

    root.addEventListener('input', check);
    root.addEventListener('change', check);
    panels.forEach((p) => p.addEventListener('submit', (e) => e.preventDefault()));

    $('[data-discard]', root).addEventListener('click', () => {
      panels.forEach((p) => fields(p).forEach((i) => {
        if (i.type === 'checkbox') i.checked = i.dataset.saved === 'true'; else i.value = i.dataset.saved;
      }));
      check();
      tabs.find((t) => t.tabIndex === 0).focus();
    });

    $('[data-save]', root).addEventListener('click', () => {
      snapshot();
      check();
      saved.textContent = 'Changes saved';
      clearTimeout(savedTimer);
      savedTimer = setTimeout(() => { saved.textContent = ''; }, 2600);
      tabs.find((t) => t.tabIndex === 0).focus();
    });

    snapshot();
  })();

  /* ======================================================================
     06 · Halden: resizable mail sidebar
     ====================================================================== */
  (() => {
    const mail = $('[data-mail]');
    const handle = $('[data-resizer]', mail);
    const MIN = 72;
    const MAX = 360;
    const DEFAULT = 240;
    const SNAP = 150; // below this the sidebar snaps to icons only

    function setWidth(w) {
      const width = Math.round(Math.max(MIN, Math.min(MAX, w)));
      mail.style.setProperty('--side-w', `${width}px`);
      mail.classList.toggle('is-narrow', width < SNAP);
      handle.setAttribute('aria-valuenow', String(width));
      handle.setAttribute('aria-valuetext', width < SNAP ? 'Icons only' : `${width} pixels`);
      return width;
    }

    let start = null;
    handle.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      handle.setPointerCapture(e.pointerId);
      handle.classList.add('is-active');
      mail.classList.add('is-resizing');
      start = { x: e.clientX, w: Number(handle.getAttribute('aria-valuenow')) };
    });
    handle.addEventListener('pointermove', (e) => {
      if (!start) return;
      const w = start.w + (e.clientX - start.x);
      setWidth(w < SNAP - 30 ? MIN : Math.max(w, SNAP)); // snap instead of a squashed in-between state
    });
    const stop = () => { start = null; handle.classList.remove('is-active'); mail.classList.remove('is-resizing'); };
    handle.addEventListener('pointerup', stop);
    handle.addEventListener('pointercancel', stop);

    handle.addEventListener('dblclick', () => setWidth(DEFAULT));
    handle.addEventListener('keydown', (e) => {
      const now = Number(handle.getAttribute('aria-valuenow'));
      const step = e.shiftKey ? 48 : 16;
      let w = null;
      if (e.key === 'ArrowLeft') w = now < SNAP ? MIN : now - step < SNAP ? MIN : now - step;
      if (e.key === 'ArrowRight') w = now < SNAP ? SNAP : now + step;
      if (e.key === 'Home') w = MIN;
      if (e.key === 'End') w = MAX;
      if (e.key === 'Enter') w = DEFAULT;
      if (w === null) return;
      e.preventDefault();
      setWidth(w);
    });

    // Icon-only links get a native tooltip so mouse users can still read them.
    $$('.mail__side a', mail).forEach((a) => { a.title = $('span', a).textContent; });

    setWidth(DEFAULT);
  })();
})();
