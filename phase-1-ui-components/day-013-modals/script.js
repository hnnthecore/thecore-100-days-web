/*!
 * Thecore · 100 Days of Web Development
 * Day 013: Modals
 *
 * One small dialog controller (createModal) powers all six demos:
 * open/close animation, focus trap, Esc, backdrop click, inert background
 * and returning focus to whatever opened the dialog.
 */
(() => {
  'use strict';

  const { $, $$, reducedMotion, isMac, toggleTheme } = window.Thecore;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const NETWORK_DELAY = 900; // pretend server time; not shortened by reduced motion

  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusables = (root) => $$(FOCUSABLE, root).filter((el) => el.getClientRects().length && !el.closest('[hidden]'));

  /* Focus an element as soon as it can take focus (it may still be animating in). */
  function focusSoon(el, tries = 12) {
    if (!el) return;
    el.focus({ preventScroll: true });
    if (document.activeElement !== el && tries > 0) requestAnimationFrame(() => focusSoon(el, tries - 1));
  }

  /* ======================================================================
     Dialog controller
     ====================================================================== */
  const openModals = new Set();

  function createModal(el, opts = {}) {
    const { initialFocus, beforeClose, onOpen, onClose } = opts;
    const page = $('[data-page]', el.parentElement);
    const panel = $('.modal__panel', el);
    let trigger = null;
    let returnTo = null;
    let closeTimer = 0;

    function open(from) {
      clearTimeout(closeTimer);
      trigger = from || document.activeElement;
      returnTo = null;
      el.hidden = false;
      page.inert = true;
      openModals.add(api);
      onOpen?.();
      el.getBoundingClientRect(); // commit the closed state so the open transition runs
      el.classList.add('is-open');
      focusSoon(initialFocus?.() || focusables(panel)[0] || panel);
    }

    function close({ force = false, focus } = {}) {
      if (el.hidden || !el.classList.contains('is-open')) return;
      if (!force && beforeClose && beforeClose() === false) return;
      el.classList.remove('is-open');
      page.inert = false;
      openModals.delete(api);
      onClose?.();
      const target = focus || returnTo || trigger;
      if (target?.isConnected) focusSoon(target);
      closeTimer = setTimeout(() => { el.hidden = true; }, reducedMotion.matches ? 0 : 420);
    }

    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) { close(); return; }
      // Backdrop without data-close: the dialog can't be dismissed by accident, so nudge it.
      if (e.target.classList.contains('modal__backdrop')) {
        panel.classList.remove('is-nudged');
        panel.getBoundingClientRect();
        panel.classList.add('is-nudged');
      }
    });

    el.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
      if (e.key !== 'Tab') return;
      const items = focusables(panel);
      if (!items.length) { e.preventDefault(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    const api = { open, close, el, isOpen: () => el.classList.contains('is-open'), setReturn: (t) => { returnTo = t; } };
    return api;
  }

  /* Small toast per demo frame, with an optional action button. */
  function toast(frame, message, action) {
    const el = $('[data-toast]', frame);
    clearTimeout(el._timer);
    el.textContent = '';
    el.append(Object.assign(document.createElement('span'), { textContent: message }));
    if (action) {
      const b = Object.assign(document.createElement('button'), { type: 'button', textContent: action.label });
      b.addEventListener('click', () => { el.hidden = true; action.run(); });
      el.append(b);
    }
    el.hidden = false;
    el._timer = setTimeout(() => { el.hidden = true; }, action ? 6000 : 3200);
  }

  /* ======================================================================
     01 · Halden: type-to-confirm delete
     ====================================================================== */
  (() => {
    const section = $('#m-confirm');
    const frame = $('.frame__scroller', section);
    const form = $('[data-confirm-form]', section);
    const input = $('[data-confirm-input]', section);
    const btn = $('[data-confirm-btn]', section);
    const danger = $('[data-project]', section);
    const gone = $('[data-gone]', section);
    const openBtn = $('[data-open="confirm-dialog"]', section);
    const NAME = 'halden-website';
    let busy = false;

    const modal = createModal($('#confirm-dialog'), {
      initialFocus: () => input,
      beforeClose: () => !busy, // can't cancel mid-request
      onOpen: () => { input.value = ''; check(); },
    });

    function check() {
      const ok = input.value.trim() === NAME;
      btn.disabled = !ok || busy;
      input.classList.toggle('is-match', ok);
    }
    input.addEventListener('input', check);
    openBtn.addEventListener('click', () => modal.open(openBtn));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (input.value.trim() !== NAME || busy) return;
      busy = true;
      btn.classList.add('is-loading');
      btn.setAttribute('aria-busy', 'true');
      check();
      await wait(NETWORK_DELAY);
      busy = false;
      btn.classList.remove('is-loading');
      btn.removeAttribute('aria-busy');
      danger.hidden = true;
      gone.hidden = false;
      modal.close({ focus: $('[data-restore]', gone) });
      toast(frame, 'Project deleted', { label: 'Undo', run: restore });
    });

    function restore() {
      danger.hidden = false;
      gone.hidden = true;
      focusSoon(openBtn);
    }
    $('[data-restore]', gone).addEventListener('click', restore);
  })();

  /* ======================================================================
     02 · Lumen: command palette
     ====================================================================== */
  (() => {
    const section = $('#m-palette');
    const frame = $('.frame__scroller', section);
    const input = $('[data-palette-input]', section);
    const list = $('[data-palette-list]', section);
    const empty = $('[data-palette-empty]', section);
    const openBtn = $('[data-open="palette"]', section);

    const ITEMS = [
      { group: 'Pages', label: 'Overview', icon: 'i-file', hint: 'Page' },
      { group: 'Pages', label: 'Analytics', icon: 'i-file', hint: 'Page' },
      { group: 'Pages', label: 'Invoices', icon: 'i-file', hint: 'Page', keys: 'billing payments' },
      { group: 'Pages', label: 'Customers', icon: 'i-file', hint: 'Page', keys: 'clients' },
      { group: 'Pages', label: 'Settings', icon: 'i-file', hint: 'Page', keys: 'preferences account' },
      { group: 'Actions', label: 'Create invoice', icon: 'i-bolt', hint: 'Action', keys: 'new bill' },
      { group: 'Actions', label: 'Invite a teammate', icon: 'i-bolt', hint: 'Action', keys: 'add member' },
      { group: 'Actions', label: 'Toggle dark mode', icon: 'i-bolt', hint: 'Action', keys: 'theme light night', run: () => toggleTheme() },
      { group: 'Actions', label: 'Export as CSV', icon: 'i-bolt', hint: 'Action', keys: 'download spreadsheet' },
      { group: 'People', label: 'Riya Sharma', person: 265, hint: 'Designer' },
      { group: 'People', label: 'Tom Ashby', person: 150, hint: 'Engineer' },
      { group: 'People', label: 'Kai Nakamura', person: 210, hint: 'Sales' },
    ];
    let recent = [ITEMS[1], ITEMS[5]];
    let shown = [];
    let active = 0;

    const modal = createModal($('#palette'), {
      initialFocus: () => input,
      onOpen: () => { input.value = ''; render(); },
    });

    const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    function highlight(label, q) {
      const i = q ? label.toLowerCase().indexOf(q) : -1;
      return i === -1 ? escape(label) : `${escape(label.slice(0, i))}<mark>${escape(label.slice(i, i + q.length))}</mark>${escape(label.slice(i + q.length))}`;
    }
    const initials = (n) => n.split(' ').map((p) => p[0]).join('');

    function render() {
      const q = input.value.trim().toLowerCase();
      shown = q
        ? ITEMS.filter((it) => `${it.label} ${it.keys || ''} ${it.group}`.toLowerCase().includes(q))
        : [...recent.map((it) => ({ ...it, group: 'Recent', ref: it })), ...ITEMS.filter((it) => it.group !== 'People')];
      active = 0;
      let html = '';
      let group = '';
      shown.forEach((it, i) => {
        if (it.group !== group) {
          group = it.group;
          html += `<div class="palette__group" role="presentation">${group}</div>`;
        }
        const lead = it.person
          ? `<span class="avatar" style="--h:${it.person}" aria-hidden="true">${initials(it.label)}</span>`
          : `<svg class="icon" aria-hidden="true"><use href="#${it.icon}"/></svg>`;
        html += `<div class="palette__opt" role="option" id="pal-${i}" aria-selected="false">${lead}<span>${highlight(it.label, q)}</span><small>${it.hint}</small></div>`;
      });
      list.innerHTML = html;
      empty.hidden = shown.length > 0;
      $('span', empty).textContent = input.value.trim();
      list.hidden = !shown.length;
      setActive(0);
    }

    function setActive(i) {
      if (!shown.length) { input.removeAttribute('aria-activedescendant'); return; }
      active = (i + shown.length) % shown.length;
      $$('[role="option"]', list).forEach((o, n) => o.setAttribute('aria-selected', String(n === active)));
      const opt = $(`#pal-${active}`, list);
      input.setAttribute('aria-activedescendant', opt.id);
      opt.scrollIntoView({ block: 'nearest' });
    }

    function run(i) {
      const it = shown[i];
      if (!it) return;
      const item = it.ref || it;
      recent = [item, ...recent.filter((r) => r !== item)].slice(0, 3);
      modal.close();
      item.run?.();
      const verb = item.group === 'People' ? 'Opened profile:' : item.group === 'Actions' ? 'Done:' : 'Opened';
      toast(frame, `${verb} ${item.label}`);
    }

    input.addEventListener('input', render);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (e.key === 'Home' && !input.value) { e.preventDefault(); setActive(0); }
      else if (e.key === 'End' && !input.value) { e.preventDefault(); setActive(shown.length - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); run(active); }
    });
    list.addEventListener('pointermove', (e) => {
      const opt = e.target.closest('[role="option"]');
      if (opt) { const i = Number(opt.id.slice(4)); if (i !== active) setActive(i); }
    });
    list.addEventListener('click', (e) => {
      const opt = e.target.closest('[role="option"]');
      if (opt) run(Number(opt.id.slice(4)));
    });
    list.addEventListener('mousedown', (e) => e.preventDefault()); // keep focus in the input

    openBtn.addEventListener('click', () => modal.open(openBtn));

    // ⌘K / Ctrl K, only while this demo is mostly on screen, so it never hijacks the browser elsewhere.
    let inView = false;
    new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; }, { threshold: 0.5 }).observe($('.frame', section));
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() !== 'k' || !(isMac ? e.metaKey : e.ctrlKey) || e.altKey || e.shiftKey) return;
      if (!inView) return;
      if (modal.isOpen()) { e.preventDefault(); modal.close(); return; }
      if (openModals.size) return;
      e.preventDefault();
      modal.open(openBtn);
    });
  })();

  /* ======================================================================
     03 · Forge: onboarding steps
     ====================================================================== */
  (() => {
    const section = $('#m-onboard');
    const form = $('[data-onboard]', section);
    const panes = $$('[data-pane]', form);
    const next = $('[data-next]', form);
    const back = $('[data-back]', form);
    const title = $('[data-step-title]', form);
    const label = $('[data-step-label]', form);
    const progress = $('[data-progress]', form);
    const daysHint = $('[data-days-hint]', form);
    const summary = $('[data-summary]', form);
    const plan = $('[data-plan]', section);
    const openBtn = $('[data-open="onboard"]', section);
    const TITLES = ["What's your main goal?", 'How experienced are you?', 'Which days can you train?', 'Your plan is ready'];
    let step = 1;

    const modal = createModal($('#onboard'), { initialFocus: () => $('input', panes[step - 1]) || next });

    const value = (name) => $(`input[name="${name}"]:checked`, form)?.value;
    const days = () => $$('input[name="day"]:checked', form).map((i) => i.value);

    function valid() {
      if (step === 1) return !!value('goal');
      if (step === 2) return !!value('level');
      if (step === 3) return days().length >= 2;
      return true;
    }

    function update() {
      next.disabled = !valid();
      const n = days().length;
      daysHint.textContent = n < 2 ? 'Pick at least 2 days.' : n <= 3 ? `${n} days a week: a great, sustainable start.` : n <= 5 ? `${n} days a week: ambitious, with rest built in.` : `${n} days a week: we'll keep some sessions light.`;
    }

    function go(to, dir = 1, focus = true) {
      step = to;
      panes.forEach((p) => {
        p.hidden = Number(p.dataset.pane) !== step;
        p.classList.toggle('is-back', dir < 0);
      });
      title.textContent = TITLES[step - 1];
      label.textContent = step < 4 ? `Step ${step} of 3` : 'All set';
      progress.style.setProperty('--p', `${(step / 4) * 100}%`);
      progress.setAttribute('aria-valuenow', String(step));
      progress.setAttribute('aria-valuetext', step < 4 ? `Step ${step} of 3` : 'Complete');
      back.hidden = step === 1 || step === 4;
      next.firstChild.textContent = step === 4 ? 'Start training' : step === 3 ? 'Build my plan' : 'Next';
      if (step === 4) {
        summary.innerHTML = `<dt>Goal</dt><dd>${value('goal')}</dd><dt>Level</dt><dd>${value('level')}</dd><dt>Training</dt><dd>${days().join(', ')}</dd>`;
      }
      update();
      if (focus) focusSoon(title); // announce the new step
    }

    form.addEventListener('change', update);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!valid()) return;
      if (step < 4) { go(step + 1); return; }
      plan.hidden = false;
      plan.textContent = `Plan saved: ${value('goal').toLowerCase()}, ${value('level').toLowerCase()} level, ${days().length} days a week.`;
      modal.close({ force: true });
      openBtn.textContent = 'Edit my plan';
    });
    back.addEventListener('click', () => go(step - 1, -1));
    openBtn.addEventListener('click', () => { go(1, 1, false); modal.open(openBtn); });
    go(1, 1, false);
  })();

  /* ======================================================================
     04 · Ember: bottom sheet
     ====================================================================== */
  (() => {
    const section = $('#m-sheet');
    const el = $('#sheet');
    const form = $('[data-sheet]', el);
    const handle = $('[data-handle]', el);
    const qtyOut = $('[data-qty-out]', el);
    const total = $('[data-total]', el);
    const basketEl = $('[data-basket]', section);
    const minus = $('[data-qty="-1"]', el);
    const basket = [];
    let dish = null;
    let qty = 1;

    const modal = createModal(el, {
      initialFocus: () => $('.sheet__add', el),
      onClose: () => el.classList.remove('is-expanded'),
    });

    const money = (n) => `£${n}`;
    const extras = () => $$('[data-extra]:checked', el).reduce((s, i) => s + Number(i.value), 0);
    function price() {
      qtyOut.textContent = qty;
      minus.disabled = qty <= 1;
      total.textContent = money((dish.price + extras()) * qty);
    }

    $$('[data-open="sheet"]', section).forEach((btn) => btn.addEventListener('click', () => {
      dish = JSON.parse(btn.dataset.dish);
      qty = 1;
      $('[data-sheet-name]', el).textContent = dish.name;
      $('[data-sheet-desc]', el).textContent = dish.desc;
      $('[data-sheet-img]', el).style.setProperty('--h', dish.h);
      $$('[data-extra]', el).forEach((i) => { i.checked = false; });
      $('#sh-note', el).value = '';
      $('.sheet__body', el).scrollTop = 0;
      price();
      modal.open(btn);
    }));

    el.addEventListener('change', price);
    $$('[data-qty]', el).forEach((b) => b.addEventListener('click', () => {
      qty = Math.max(1, Math.min(20, qty + Number(b.dataset.qty)));
      price();
    }));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      basket.push({ qty, cost: (dish.price + extras()) * qty });
      const items = basket.reduce((s, b) => s + b.qty, 0);
      const sum = basket.reduce((s, b) => s + b.cost, 0);
      basketEl.textContent = `${items} ${items === 1 ? 'item' : 'items'} in your order · ${money(sum)}`;
      modal.close();
    });

    // Dragging the handle: down to dismiss, up to expand. Only in bottom-sheet mode.
    const sheetMode = () => getComputedStyle(handle).display !== 'none';
    let drag = null;
    handle.addEventListener('pointerdown', (e) => {
      if (!sheetMode() || e.button !== 0) return;
      handle.setPointerCapture(e.pointerId);
      drag = { y: e.clientY, t: performance.now(), dy: 0 };
      form.classList.add('is-dragging');
    });
    handle.addEventListener('pointermove', (e) => {
      if (!drag) return;
      drag.dy = e.clientY - drag.y;
      // Free movement downwards, resistance upwards.
      const shown = drag.dy > 0 ? drag.dy : drag.dy / 4;
      el.style.setProperty('--drag', `${shown}px`);
    });
    function endDrag() {
      if (!drag) return;
      const { dy, t } = drag;
      drag = null;
      form.classList.remove('is-dragging');
      el.style.removeProperty('--drag');
      const speed = dy / (performance.now() - t);
      const expanded = el.classList.contains('is-expanded');
      if (dy > form.offsetHeight * 0.35 || speed > 0.8) {
        if (expanded && dy < form.offsetHeight * 0.6 && speed <= 0.8) el.classList.remove('is-expanded');
        else modal.close();
      } else if (dy < -40) {
        el.classList.add('is-expanded');
      } else if (expanded && dy > 60) {
        el.classList.remove('is-expanded');
      }
    }
    handle.addEventListener('pointerup', endDrag);
    handle.addEventListener('pointercancel', endDrag);
    handle.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      el.classList.toggle('is-expanded');
    });
  })();

  /* ======================================================================
     05 · Atlas: slide-over edit panel
     ====================================================================== */
  (() => {
    const section = $('#m-slide');
    const frame = $('.frame__scroller', section);
    const listEl = $('[data-people]', section);
    const form = $('[data-slide-form]', section);
    const guard = $('[data-guard]', form);
    const btns = $('[data-btns]', form);
    const fields = $$('[data-so-field]', form);
    const nameIn = $('#so-name', form);
    const nameErr = $('#so-name-err', form);

    const PEOPLE = [
      { id: 1, name: 'Riya Sharma', email: 'riya@atlas.dev', title: 'Product designer', role: 'Owner', billing: true, h: 265 },
      { id: 2, name: 'Tom Ashby', email: 'tom@atlas.dev', title: 'Staff engineer', role: 'Admin', billing: false, h: 150 },
      { id: 3, name: 'Ingrid Sørensen', email: 'ingrid@atlas.dev', title: 'Brand lead', role: 'Member', billing: false, h: 30 },
      { id: 4, name: 'Kai Nakamura', email: 'kai@atlas.dev', title: 'Account executive', role: 'Member', billing: false, h: 210 },
      { id: 5, name: 'Lea Moreau', email: 'lea@studio.fr', title: 'Freelance copywriter', role: 'Viewer', billing: false, h: 330 },
    ];
    let current = null;
    let snapshot = '';

    const initials = (n) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
    const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

    function renderList(flashId) {
      listEl.innerHTML = PEOPLE.map((p) => `
        <li data-id="${p.id}" class="${p.id === flashId ? 'is-updated' : ''}">
          <span class="avatar" style="--h:${p.h}" aria-hidden="true">${initials(p.name)}</span>
          <span class="people__who"><strong>${escape(p.name)}</strong><small>${escape(p.title || 'No title')} · ${p.email}</small></span>
          <span class="people__role">${p.role}</span>
          <button class="btn btn--ghost btn--sm" type="button" data-edit="${p.id}" aria-label="Edit ${escape(p.name)}"><svg class="icon" aria-hidden="true"><use href="#i-pen"/></svg>Edit</button>
        </li>`).join('');
    }

    const read = () => JSON.stringify(fields.map((f) => (f.type === 'checkbox' ? f.checked : f.value)));
    const dirty = () => read() !== snapshot;

    function showGuard(on) {
      guard.hidden = !on;
      btns.hidden = on;
      if (on) focusSoon($('[data-keep]', guard));
    }

    const modal = createModal($('#slideover'), {
      initialFocus: () => nameIn,
      beforeClose: () => {
        if (!dirty()) return true;
        if (guard.hidden) showGuard(true); // ask first; a second Esc keeps the question open
        return false;
      },
      onClose: () => showGuard(false),
    });

    listEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-edit]');
      if (!b) return;
      current = PEOPLE.find((p) => p.id === Number(b.dataset.edit));
      nameIn.value = current.name;
      $('#so-title-in', form).value = current.title;
      $('#so-role', form).value = current.role;
      $('[name="billing"]', form).checked = current.billing;
      $('[data-so-name]', form).textContent = current.name;
      $('[data-so-email]', form).textContent = current.email;
      const av = $('[data-so-avatar]', form);
      av.textContent = initials(current.name);
      av.style.setProperty('--h', current.h);
      nameIn.classList.remove('is-invalid');
      nameIn.removeAttribute('aria-invalid');
      nameErr.hidden = true;
      snapshot = read();
      showGuard(false);
      modal.open(b);
    });

    $('[data-keep]', guard).addEventListener('click', () => { showGuard(false); focusSoon(nameIn); });
    $('[data-discard]', guard).addEventListener('click', () => modal.close({ force: true }));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!nameIn.value.trim()) {
        nameIn.classList.add('is-invalid');
        nameIn.setAttribute('aria-invalid', 'true');
        nameIn.setAttribute('aria-describedby', 'so-name-err');
        nameErr.hidden = false;
        nameIn.focus();
        return;
      }
      Object.assign(current, {
        name: nameIn.value.trim(),
        title: $('#so-title-in', form).value.trim(),
        role: $('#so-role', form).value,
        billing: $('[name="billing"]', form).checked,
      });
      const changed = dirty();
      renderList(current.id);
      modal.close({ force: true, focus: $(`[data-edit="${current.id}"]`, listEl) });
      toast(frame, changed ? `Saved changes to ${current.name}` : 'No changes to save');
    });

    nameIn.addEventListener('input', () => {
      if (nameIn.value.trim()) { nameIn.classList.remove('is-invalid'); nameIn.removeAttribute('aria-invalid'); nameErr.hidden = true; }
    });

    renderList();
  })();

  /* ======================================================================
     06 · Nova: share & invite
     ====================================================================== */
  (() => {
    const section = $('#m-share');
    const frame = $('.frame__scroller', section);
    const field = $('[data-chip-field]', section);
    const chipsEl = $('[data-chips]', section);
    const email = $('[data-email]', section);
    const hint = $('[data-email-hint]', section);
    const send = $('[data-send]', section);
    const roleSel = $('[data-new-role]', section);
    const accessEl = $('[data-access]', section);
    const pub = $('[data-public]', section);
    const pubDesc = $('[data-public-desc]', section);
    const copy = $('[data-copy]', section);
    const openBtn = $('[data-open="share"]', section);
    const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const ROLES = ['Can edit', 'Can comment', 'Can view'];

    const access = [
      { name: 'Mia Kent (you)', email: 'mia@nova.so', role: 'Owner', h: 300 },
      { name: 'Tom Ashby', email: 'tom@nova.so', role: 'Can edit', h: 150 },
      { name: 'Ingrid Sørensen', email: 'ingrid@studio.no', role: 'Can view', h: 30 },
    ];
    let chips = [];

    const modal = createModal($('#share'), { initialFocus: () => email });
    openBtn.addEventListener('click', () => modal.open(openBtn));

    const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const initials = (n) => n.replace(/\(.*\)/, '').split(/[\s.@]+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');

    function renderAccess(newEmails = []) {
      accessEl.innerHTML = access.map((p, i) => `
        <li class="${newEmails.includes(p.email) ? 'is-new' : ''}">
          <span class="avatar" style="--h:${p.h}" aria-hidden="true">${initials(p.name)}</span>
          <span class="access__who"><strong>${escape(p.name)}</strong><small>${escape(p.email)}</small></span>
          ${p.role === 'Owner' ? '<span class="access__owner">Owner</span>' : `
          <label class="sr-only" for="acc-${i}">Access for ${escape(p.name)}</label>
          <select id="acc-${i}" data-i="${i}">${ROLES.map((r) => `<option${r === p.role ? ' selected' : ''}>${r}</option>`).join('')}<option value="remove">Remove access</option></select>`}
        </li>`).join('');
    }

    function renderChips() {
      chipsEl.innerHTML = chips.map((c, i) => `<li><span>${escape(c)}</span><button type="button" data-remove="${i}" aria-label="Remove ${escape(c)}"><svg class="icon" aria-hidden="true"><use href="#i-x"/></svg></button></li>`).join('');
      send.disabled = !chips.length && !EMAIL.test(email.value.trim());
    }

    function setHint(text, error = false) {
      hint.textContent = text;
      hint.classList.toggle('is-error', error);
      field.classList.toggle('is-invalid', error);
      if (error) email.setAttribute('aria-invalid', 'true'); else email.removeAttribute('aria-invalid');
    }

    // Turn typed text into chips. Returns false if something was invalid.
    function commit(text = email.value) {
      const parts = text.split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean);
      const bad = [];
      parts.forEach((p) => {
        const lower = p.toLowerCase();
        if (!EMAIL.test(p)) bad.push(p);
        else if (access.some((a) => a.email === lower)) setHint(`${p} already has access.`, true);
        else if (!chips.includes(lower)) chips.push(lower);
      });
      email.value = bad.join(', ');
      renderChips();
      if (bad.length) { setHint(`“${bad[0]}” doesn't look like an email address.`, true); return false; }
      if (!hint.classList.contains('is-error')) setHint('Separate emails with Enter or a comma.');
      return true;
    }

    email.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ',') && email.value.trim()) { e.preventDefault(); commit(); }
      else if (e.key === 'Backspace' && !email.value && chips.length) { chips.pop(); renderChips(); }
    });
    email.addEventListener('input', () => {
      if (email.value.includes(',')) commit();
      else { setHint('Separate emails with Enter or a comma.'); renderChips(); }
    });
    email.addEventListener('paste', (e) => {
      const text = e.clipboardData?.getData('text') || '';
      if (/[,;\s]/.test(text.trim())) { e.preventDefault(); commit(email.value + ',' + text); }
    });
    field.addEventListener('click', (e) => { if (e.target === field || e.target === chipsEl) email.focus(); });
    chipsEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-remove]');
      if (!b) return;
      chips.splice(Number(b.dataset.remove), 1);
      renderChips();
      email.focus();
    });

    $('[data-invite]', section).addEventListener('submit', (e) => {
      e.preventDefault();
      if (email.value.trim() && !commit()) { email.focus(); return; }
      if (!chips.length) return;
      const added = chips.map((c) => ({ name: c.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()), email: c, role: roleSel.value, h: (c.length * 37) % 360 }));
      access.push(...added);
      chips = [];
      renderChips();
      renderAccess(added.map((a) => a.email));
      toast(frame, `Invited ${added.length} ${added.length === 1 ? 'person' : 'people'} (${roleSel.value.toLowerCase()})`);
      email.focus();
    });

    accessEl.addEventListener('change', (e) => {
      const sel = e.target.closest('select');
      if (!sel) return;
      const i = Number(sel.dataset.i);
      const person = access[i];
      if (sel.value !== 'remove') { person.role = sel.value; toast(frame, `${person.name} ${sel.value.toLowerCase()}`); return; }
      access.splice(i, 1);
      renderAccess();
      focusSoon(email);
      toast(frame, `Removed ${person.name}`, { label: 'Undo', run: () => { access.splice(i, 0, person); renderAccess(); } });
    });

    pub.addEventListener('change', () => {
      pub.closest('.share__link').classList.toggle('is-public', pub.checked);
      pubDesc.textContent = pub.checked ? 'Anyone with the link can view' : 'Only invited people can open';
    });

    copy.addEventListener('click', async () => {
      const url = 'https://nova.so/doc/q4-launch-plan';
      try { await navigator.clipboard.writeText(url); }
      catch (err) {
        // Fallback for browsers or pages without clipboard permission.
        const ta = Object.assign(document.createElement('textarea'), { value: url });
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.append(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e2) { /* nothing else to try */ }
        ta.remove();
        copy.focus();
      }
      $('span', copy).textContent = 'Link copied';
      copy.classList.add('is-copied');
      clearTimeout(copy._t);
      copy._t = setTimeout(() => { $('span', copy).textContent = 'Copy link'; copy.classList.remove('is-copied'); }, 2000);
    });

    renderAccess();
    renderChips();
  })();
})();
