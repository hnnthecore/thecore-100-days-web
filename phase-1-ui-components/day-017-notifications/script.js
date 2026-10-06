/*!
 * Thecore · 100 Days of Web Development
 * Day 017: Notifications & alerts
 *
 * Timers are done in JavaScript, never with animationend: under
 * "reduce motion" CSS animations finish instantly, but a message
 * must still stay on screen long enough to read.
 */
(() => {
  'use strict';

  const { $, $$ } = window.Thecore;
  const escape = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ICON = { success: 'i-check', error: 'i-alert', warning: 'i-warn', info: 'i-info' };
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };

  function focusSoon(el, tries = 10) {
    if (!el) return;
    el.focus({ preventScroll: true });
    if (document.activeElement !== el && tries > 0) requestAnimationFrame(() => focusSoon(el, tries - 1));
  }

  /* Run a callback only while an element is on screen and the tab is visible. */
  function whileVisible(el, onChange) {
    let inView = false;
    const update = () => onChange(inView && !document.hidden);
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; update(); }, { threshold: 0.25 }).observe(el);
    document.addEventListener('visibilitychange', update);
  }

  /* ======================================================================
     01 · Lumen: toast system
     ====================================================================== */
  (() => {
    const root = $('#n-toasts');
    const toaster = $('[data-toaster]', root);
    const list = $('[data-toast-list]', root);
    const polite = $('[data-live-polite]', root);
    const assertive = $('[data-live-assertive]', root);
    const projectsEl = $('[data-projects]', root);
    const MAX = 3;
    const toasts = [];

    // Announce through separate live regions, so the toast markup itself isn't read twice.
    function announce(text, urgent) {
      const region = urgent ? assertive : polite;
      region.textContent = '';
      setTimeout(() => { region.textContent = text; }, 50);
    }

    function toast(opts) {
      const el = document.createElement('li');
      const t = { el, remaining: 0, timer: 0, started: 0, paused: false, gone: false };

      function render(o) {
        Object.assign(t, o);
        el.className = `toast tone-${o.tone}`;
        const life = o.life ?? 5000;
        el.style.setProperty('--life', `${life}ms`);
        el.innerHTML = `
          ${o.tone === 'loading' ? '<span class="spinner" aria-hidden="true"></span>' : `<svg class="icon" aria-hidden="true"><use href="#${ICON[o.tone]}"/></svg>`}
          <div><p class="toast__title">${escape(o.title)}</p>${o.text ? `<p class="toast__text">${escape(o.text)}</p>` : ''}
            ${o.actions ? `<div class="toast__actions">${o.actions.map((a, i) => `<button type="button" data-a="${i}">${a.label}</button>`).join('')}</div>` : ''}</div>
          <button class="toast__close" type="button" aria-label="Dismiss notification"><svg class="icon" aria-hidden="true"><use href="#i-x"/></svg></button>
          ${Number.isFinite(life) ? '<span class="toast__bar" aria-hidden="true"></span>' : ''}`;
        clearTimeout(t.timer);
        t.remaining = life;
        if (Number.isFinite(life)) start();
        announce(`${o.title}${o.text ? `. ${o.text}` : ''}`, o.tone === 'error');
      }

      function start() {
        if (t.paused || !Number.isFinite(t.remaining)) return;
        t.started = performance.now();
        t.timer = setTimeout(dismiss, t.remaining);
      }
      function pause() {
        if (t.paused) return;
        t.paused = true;
        el.classList.add('is-paused');
        clearTimeout(t.timer);
        if (Number.isFinite(t.remaining)) t.remaining -= performance.now() - t.started;
      }
      function resume() {
        if (!t.paused) return;
        t.paused = false;
        el.classList.remove('is-paused');
        start();
      }
      function dismiss() {
        if (t.gone) return;
        t.gone = true;
        clearTimeout(t.timer);
        const hadFocus = el.contains(document.activeElement);
        el.classList.add('is-leaving');
        setTimeout(() => el.remove(), 250);
        toasts.splice(toasts.indexOf(t), 1);
        // Don't strand keyboard users: move to another toast, or back to the triggers.
        if (hadFocus) focusSoon($('.toast__close', toasts[toasts.length - 1]?.el) || $('.trig', root));
      }

      el.addEventListener('pointerenter', pause);
      el.addEventListener('pointerleave', () => { if (!el.contains(document.activeElement)) resume(); });
      el.addEventListener('focusin', pause);
      el.addEventListener('focusout', (e) => { if (!el.contains(e.relatedTarget) && !el.matches(':hover')) resume(); });
      el.addEventListener('click', (e) => {
        if (e.target.closest('.toast__close')) { dismiss(); return; }
        const a = e.target.closest('[data-a]');
        if (a) { const action = t.actions[a.dataset.a]; dismiss(); action.run(); }
      });
      el.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); dismiss(); } });

      // Swipe sideways to dismiss.
      let drag = null;
      el.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 || e.target.closest('button')) return;
        drag = { x: e.clientX, t: performance.now() };
        el.setPointerCapture(e.pointerId);
        el.classList.add('is-dragging');
      });
      el.addEventListener('pointermove', (e) => {
        if (!drag) return;
        const dx = e.clientX - drag.x;
        el.style.translate = `${dx}px 0`;
        el.style.opacity = String(1 - Math.min(Math.abs(dx) / 220, 0.8));
      });
      const endDrag = (e) => {
        if (!drag) return;
        const dx = e.clientX - drag.x;
        const speed = Math.abs(dx) / (performance.now() - drag.t);
        drag = null;
        el.classList.remove('is-dragging');
        if (Math.abs(dx) > 90 || speed > 0.6) {
          el.style.translate = `${dx > 0 ? 120 : -120}%`;
          dismiss();
        } else {
          el.style.translate = '';
          el.style.opacity = '';
        }
      };
      el.addEventListener('pointerup', endDrag);
      el.addEventListener('pointercancel', endDrag);

      t.dismiss = dismiss;
      render(opts);
      list.append(el);
      toasts.push(t);
      while (toasts.length > MAX) toasts[0].dismiss();
      return { update: render, dismiss };
    }

    // A small project list makes the Undo toast meaningful.
    let projects = ['Website redesign', 'Mobile app', 'Q4 launch', 'Brand refresh'];
    function renderProjects() {
      projectsEl.innerHTML = projects.map((p) => `<li><span>${escape(p)}</span><button type="button" data-archive="${escape(p)}">Archive</button></li>`).join('');
    }
    function archive(name) {
      const index = projects.indexOf(name);
      if (index < 0) return;
      projects.splice(index, 1);
      renderProjects();
      toast({ tone: 'success', title: `“${name}” archived`, text: 'You can restore it any time.', life: 7000,
        actions: [{ label: 'Undo', run: () => { projects.splice(index, 0, name); renderProjects(); toast({ tone: 'info', title: `“${name}” restored`, life: 3000 }); } }] });
    }
    projectsEl.addEventListener('click', (e) => { const b = e.target.closest('[data-archive]'); if (b) archive(b.dataset.archive); });
    renderProjects();

    function saveWithProgress() {
      const t = toast({ tone: 'loading', title: 'Saving changes…', life: Infinity });
      setTimeout(() => t.update({ tone: 'success', title: 'Changes saved', text: 'Synced to 3 devices.', life: 4000 }), 1600);
    }

    const TRIGGERS = {
      success: () => toast({ tone: 'success', title: 'Project saved', text: 'All changes are live.' }),
      error: () => toast({ tone: 'error', title: 'Payment failed', text: 'Your bank declined the charge. No money was taken.', life: Infinity,
        actions: [{ label: 'Try again', run: saveWithProgress }, { label: 'Use another card', run: () => toast({ tone: 'info', title: 'Opening payment settings…', life: 3000 }) }] }),
      undo: () => (projects.length ? archive(projects[0]) : toast({ tone: 'info', title: 'Nothing left to archive', life: 3000 })),
      promise: saveWithProgress,
    };
    $$('[data-toast]', root).forEach((b) => b.addEventListener('click', () => TRIGGERS[b.dataset.toast]()));
    $$('[name="tpos"]', root).forEach((r) => r.addEventListener('change', () => { toaster.dataset.pos = r.value; }));
  })();

  /* ======================================================================
     02 · Atlas: notification centre
     ====================================================================== */
  (() => {
    const root = $('[data-centre]');
    const bell = $('[data-bell]', root);
    const badge = $('[data-badge]', root);
    const bellLabel = $('[data-bell-label]', root);
    const panel = $('[data-panel]', root);
    const listEl = $('[data-nlist]', root);
    const markAll = $('[data-mark-all]', root);
    const liveToggle = $('[data-live-toggle]', root);
    const live = $('[data-centre-live]', root);
    const tabs = $$('[data-ntabs] [role="tab"]', root);
    let filter = 'all';
    let id = 0;

    const make = (who, h, html, time, type, group, read = false) => ({ id: ++id, who, h, html, time, type, group, read, fresh: false });
    const items = [
      make('Tom Ashby', 150, '<strong>Tom Ashby</strong> mentioned you in <strong>Q4 launch</strong>: <q>@riya can you check the hero copy?</q>', '12 min ago', 'mention', 'Today'),
      make('Atlas', 285, 'Deployment <strong>web-prod #482</strong> succeeded in 48 s.', '1 h ago', 'deploy', 'Today'),
      make('Kai Nakamura', 210, '<strong>Kai Nakamura</strong> commented on <strong>Pricing page</strong>: <q>Looks great on mobile.</q>', '3 h ago', 'comment', 'Today'),
      make('Ingrid Sørensen', 30, '<strong>Ingrid Sørensen</strong> invited you to <strong>Brand guidelines</strong>.', 'Yesterday', 'invite', 'Earlier', true),
      make('Lea Moreau', 330, '<strong>Lea Moreau</strong> mentioned you: <q>@riya the new illustrations are in.</q>', 'Mon', 'mention', 'Earlier', true),
      make('Atlas', 285, 'Your usage reached <strong>80%</strong> of the Pro plan this month.', 'Sun', 'billing', 'Earlier', true),
    ];
    const POOL = [
      ['Tom Ashby', 150, '<strong>Tom Ashby</strong> approved your pull request <strong>#219</strong>.', 'review'],
      ['Atlas', 285, 'Deployment <strong>web-preview #483</strong> is ready to review.', 'deploy'],
      ['Priya Nair', 20, '<strong>Priya Nair</strong> mentioned you: <q>@riya joining the 3pm call?</q>', 'mention'],
      ['Kai Nakamura', 210, '<strong>Kai Nakamura</strong> assigned you <strong>Fix checkout button</strong>.', 'task'],
    ];
    let poolIndex = 0;

    const initials = (n) => n.split(' ').map((p) => p[0]).join('').slice(0, 2);
    const unread = () => items.filter((n) => !n.read).length;

    function render() {
      const shown = items.filter((n) => filter === 'all' || (filter === 'mention' ? n.type === 'mention' : !n.read));
      let html = '';
      let group = '';
      shown.forEach((n) => {
        if (n.group !== group) { group = n.group; html += `<p class="ngroup">${group}</p>`; }
        html += `<button type="button" class="nitem${n.read ? ' is-read' : ''}${n.fresh ? ' is-new' : ''}" data-id="${n.id}">
          <span class="avatar" style="--h:${n.h}" aria-hidden="true">${initials(n.who)}</span>
          <span class="nitem__text">${n.html}<small>${n.time}${n.read ? '' : '<span class="sr-only">, unread</span>'}</small></span>
          <span class="nitem__dot" aria-hidden="true"></span></button>`;
        n.fresh = false;
      });
      listEl.innerHTML = html || `<div class="nempty"><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg><strong>You're all caught up</strong>${filter === 'mention' ? 'No mentions yet.' : 'Nothing unread.'}</div>`;

      const n = unread();
      badge.textContent = n ? (n > 9 ? '9+' : n) : '';
      bellLabel.textContent = `Notifications${n ? `, ${n} unread` : ''}`;
      markAll.disabled = !n;
      tabs.forEach((t) => {
        const c = t.dataset.f === 'unread' ? n : t.dataset.f === 'mention' ? items.filter((x) => x.type === 'mention' && !x.read).length : 0;
        t.innerHTML = `${t.dataset.f === 'all' ? 'All' : t.dataset.f === 'mention' ? 'Mentions' : 'Unread'}${c ? ` <b>${c}</b>` : ''}`;
      });
    }

    function setOpen(open, focusBell = false) {
      panel.hidden = !open;
      bell.setAttribute('aria-expanded', String(open));
      if (open) focusSoon(tabs.find((t) => t.tabIndex === 0));
      else if (focusBell) bell.focus();
    }
    bell.addEventListener('click', () => setOpen(panel.hidden));
    panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); setOpen(false, true); } });
    document.addEventListener('pointerdown', (e) => { if (!panel.hidden && !e.target.closest('.bell')) setOpen(false); });

    listEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-id]');
      if (!b) return;
      const n = items.find((x) => x.id === Number(b.dataset.id));
      n.read = true;
      render();
      focusSoon($(`[data-id="${n.id}"]`, listEl) || tabs.find((t) => t.tabIndex === 0));
      live.textContent = 'Marked as read';
    });
    markAll.addEventListener('click', () => {
      items.forEach((n) => { n.read = true; });
      render();
      live.textContent = 'All notifications marked as read';
      focusSoon(tabs.find((t) => t.tabIndex === 0));
    });

    tabs.forEach((t, i) => {
      const select = () => {
        tabs.forEach((x) => { x.setAttribute('aria-selected', String(x === t)); x.tabIndex = x === t ? 0 : -1; });
        filter = t.dataset.f;
        render();
        t.focus();
      };
      t.addEventListener('click', select);
      t.addEventListener('keydown', (e) => {
        const next = { ArrowRight: i + 1, ArrowLeft: i - 1 }[e.key];
        if (next === undefined) return;
        e.preventDefault();
        tabs[(next + tabs.length) % tabs.length].click();
      });
    });

    // Live arrivals, only while the demo is visible and "Live updates" is on.
    let timer = 0;
    function arrive() {
      const [who, h, html, type] = POOL[poolIndex++ % POOL.length];
      const n = make(who, h, html, 'Just now', type, 'Today');
      n.fresh = true;
      items.forEach((x) => { if (x.time === 'Just now') x.time = '1 min ago'; });
      items.unshift(n);
      if (items.length > 14) items.pop();
      render();
      bell.classList.remove('is-ringing');
      bell.getBoundingClientRect();
      bell.classList.add('is-ringing');
      live.textContent = `New notification: ${n.html.replace(/<[^>]+>/g, '')}`;
    }
    let visible = false;
    const schedule = () => {
      clearInterval(timer);
      if (visible && liveToggle.checked) timer = setInterval(arrive, 7000);
    };
    whileVisible($('.frame', $('#n-centre')), (v) => { visible = v; schedule(); });
    liveToggle.addEventListener('change', schedule);

    render();
  })();

  /* ======================================================================
     03 · Halden: inline alerts + error summary
     ====================================================================== */
  (() => {
    const root = $('[data-alerts]');
    const title = $('h3', root);
    title.tabIndex = -1;

    function removeAlert(alert) {
      const all = $$('[data-alert]', root);
      const next = all[all.indexOf(alert) + 1] || all[all.indexOf(alert) - 1];
      alert.classList.add('is-leaving');
      setTimeout(() => alert.remove(), 220);
      focusSoon((next && $('button', next)) || title);
    }
    root.addEventListener('click', (e) => {
      const d = e.target.closest('[data-dismiss]');
      if (d) removeAlert(d.closest('[data-alert]'));
    });

    // An alert can change tone in place once the problem is solved.
    function resolve(alert, title2, text) {
      alert.className = 'alert alert--success';
      alert.setAttribute('role', 'status');
      $('.alert__icon use', alert).setAttribute('href', '#i-check');
      $('.alert__body', alert).innerHTML = `<p class="alert__title">${title2}</p><p>${text}</p>`;
      if (!$('.alert__close', alert)) alert.insertAdjacentHTML('beforeend', '<button class="alert__close" type="button" aria-label="Dismiss" data-dismiss><svg class="icon"><use href="#i-x"/></svg></button>');
      focusSoon($('.alert__close', alert));
    }

    $('[data-update-card]', root).addEventListener('click', (e) => {
      resolve(e.target.closest('[data-alert]'), 'Card updated', 'Visa ending 8124 will be used from your next invoice.');
    });

    $('[data-retry-sync]', root).addEventListener('click', (e) => {
      const btn = e.currentTarget;
      btn.classList.add('is-loading');
      btn.textContent = 'Syncing…';
      btn.setAttribute('aria-busy', 'true');
      setTimeout(() => resolve(btn.closest('[data-alert]'), 'All invoices synced', 'INV-2044 and INV-2046 are now in Xero.'), 1300);
    });

    // Form with an error summary that links to each problem.
    const form = $('[data-bform]', root);
    const summary = $('[data-summary]', form);
    const sumList = $('[data-summary-list]', form);
    const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    let submitted = false;

    function check(input) {
      const v = input.value.trim();
      let msg = '';
      if (input.required && !v) msg = input.dataset.msg;
      else if (v && input.type === 'email' && !EMAIL.test(v)) msg = input.dataset.msg;
      else if (v && input.dataset.pattern && !new RegExp(input.dataset.pattern, 'i').test(v.replace(/\s/g, ''))) msg = input.dataset.msg;
      const err = $(`#${input.id}-e`, form);
      err.textContent = msg;
      err.hidden = !msg;
      input.classList.toggle('is-invalid', !!msg);
      if (msg) { input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', err.id); }
      else { input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); }
      return msg;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitted = true;
      const problems = $$('input', form).map((i) => [i, check(i)]).filter(([, m]) => m);
      $('.saved-alert', root)?.remove();
      if (problems.length) {
        $('.alert__title', summary).textContent = `Please fix ${problems.length} ${problems.length === 1 ? 'problem' : 'problems'}`;
        sumList.innerHTML = problems.map(([i, m]) => `<li><a href="#${i.id}" data-field="${i.id}">${escape(m)}</a></li>`).join('');
        summary.hidden = false;
        summary.focus();
        return;
      }
      summary.hidden = true;
      form.insertAdjacentHTML('beforebegin', '<div class="alert alert--success saved-alert" role="status" data-alert tabindex="-1"><svg class="icon alert__icon" aria-hidden="true"><use href="#i-check"/></svg><div class="alert__body"><p class="alert__title">Billing details saved</p><p>They will appear on your next invoice.</p></div><button class="alert__close" type="button" aria-label="Dismiss" data-dismiss><svg class="icon"><use href="#i-x"/></svg></button></div>');
      focusSoon($('.saved-alert', root));
    });

    // Summary links focus the field inside the frame instead of jumping the page.
    sumList.addEventListener('click', (e) => {
      const a = e.target.closest('[data-field]');
      if (!a) return;
      e.preventDefault();
      const field = $(`#${a.dataset.field}`, form);
      field.focus();
      field.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });

    // After the first submit, errors clear as soon as they're fixed.
    form.addEventListener('input', (e) => {
      if (!submitted || !e.target.matches('input')) return;
      check(e.target);
      const left = $$('input.is-invalid', form).length;
      if (!left) summary.hidden = true;
    });
  })();

  /* ======================================================================
     04 · Nova: announcement banners
     ====================================================================== */
  (() => {
    const root = $('[data-banners]');
    const ticker = $('[data-ticker]', root);
    const pauseBtn = $('[data-ticker-pause]', root);
    const countdown = $('[data-countdown]', root);
    const countdownSr = $('[data-countdown-sr]', root);
    const KEY = 'thecore-d17-banner-';

    // Remembered dismissals
    $$('[data-banner]', root).forEach((b) => { if (store.get(KEY + b.dataset.banner)) b.hidden = true; });
    root.addEventListener('click', (e) => {
      const close = e.target.closest('[data-close-banner]');
      if (!close) return;
      const banner = close.closest('[data-banner]');
      store.set(KEY + banner.dataset.banner, '1');
      banner.style.setProperty('--h', `${banner.offsetHeight}px`);
      banner.classList.add('is-leaving');
      setTimeout(() => { banner.hidden = true; banner.classList.remove('is-leaving'); }, 260);
      const next = $$('[data-banner]', root).find((b) => b !== banner && !b.hidden);
      focusSoon(next ? $('[data-close-banner]', next) : $('.store__bar a', root));
    });
    $('[data-reset-banners]', root).addEventListener('click', () => {
      $$('[data-banner]', root).forEach((b) => { store.set(KEY + b.dataset.banner, null); b.hidden = false; });
    });

    // Countdown to the end of tomorrow.
    const end = new Date();
    end.setDate(end.getDate() + 2);
    end.setHours(0, 0, 0, 0);
    const pad = (n) => String(n).padStart(2, '0');
    let lastLabel = '';
    function tick() {
      const s = Math.max(0, Math.floor((end - Date.now()) / 1000));
      const d = Math.floor(s / 86400);
      const h = Math.floor((s % 86400) / 3600);
      const m = Math.floor((s % 3600) / 60);
      countdown.innerHTML = `${d ? `<b>${d}d</b>` : ''}<b>${pad(h)}h</b><b>${pad(m)}m</b><b>${pad(s % 60)}s</b>`;
      // Screen readers get a calmer label that only changes each minute.
      const label = `${d ? `${d} day${d === 1 ? '' : 's'}, ` : ''}${h} hours and ${m} minutes`;
      if (label !== lastLabel) { countdownSr.textContent = label; lastLabel = label; }
    }
    tick();
    let cdTimer = 0;

    // Rotating announcement bar with a pause control (WCAG 2.2.2).
    const MESSAGES = ['Free delivery on orders over £50', 'New: the Cloudstride trainer in three new colours', 'Order by 2 pm for next-day delivery', 'Students get 15% off with a valid ID'];
    let msgIndex = 0;
    let rotTimer = 0;
    let userPaused = false;
    let hovering = false;
    const show = () => { ticker.textContent = MESSAGES[msgIndex]; ticker.style.animation = 'none'; ticker.getBoundingClientRect(); ticker.style.animation = ''; };
    show();
    const ticker4 = () => { msgIndex = (msgIndex + 1) % MESSAGES.length; show(); };

    let visible = false;
    function run() {
      clearInterval(rotTimer);
      clearInterval(cdTimer);
      if (!visible) return;
      cdTimer = setInterval(tick, 1000);
      if (!userPaused && !hovering) rotTimer = setInterval(ticker4, 4000);
    }
    whileVisible($('.frame', $('#n-banners')), (v) => { visible = v; run(); });
    const bar = ticker.parentElement;
    bar.addEventListener('pointerenter', () => { hovering = true; run(); });
    bar.addEventListener('pointerleave', () => { hovering = false; run(); });
    bar.addEventListener('focusin', () => { hovering = true; run(); });
    bar.addEventListener('focusout', () => { hovering = false; run(); });
    pauseBtn.addEventListener('click', () => {
      userPaused = !userPaused;
      pauseBtn.setAttribute('aria-pressed', String(userPaused));
      pauseBtn.setAttribute('aria-label', userPaused ? 'Play announcements' : 'Pause announcements');
      $('use', pauseBtn).setAttribute('href', userPaused ? '#i-play' : '#i-pause');
      run();
    });
  })();

  /* ======================================================================
     05 · Forge: notification preferences
     ====================================================================== */
  (() => {
    const root = $('[data-prefs]');
    const matrix = $('[data-matrix]', root);
    const status = $('[data-prefs-status]', root);
    const card = $('[data-pushcard]', root);
    const quiet = $('[data-quiet]', root);
    const fieldset = quiet.closest('.quiet');
    let statusTimer = 0;

    const CHANNELS = ['Email', 'Push', 'SMS'];
    const TOPICS = [
      ['Class changes', 'Cancellations and time changes', [1, 1, 1], 'Recommended: you can’t turn off every channel'],
      ['Booking reminders', '2 hours before each class', [0, 1, 0]],
      ['Spots opening up', 'For classes on your waitlist', [0, 1, 1]],
      ['New classes & events', 'Once a week at most', [1, 0, 0]],
      ['Offers & news', 'From Forge and partners', [0, 0, 0]],
    ];

    matrix.innerHTML = TOPICS.map(([name, desc, on], r) => `
      <tr><th scope="row">${name}<small>${desc}</small></th>
        ${CHANNELS.map((c, i) => `<td><input type="checkbox" data-r="${r}" data-c="${i}" ${on[i] ? 'checked' : ''} aria-label="${name} by ${c}"></td>`).join('')}
      </tr>`).join('');

    function say(text) {
      status.textContent = text;
      clearTimeout(statusTimer);
      statusTimer = setTimeout(() => { status.textContent = ''; }, 3000);
    }

    matrix.addEventListener('change', (e) => {
      const cb = e.target;
      const r = Number(cb.dataset.r);
      // "Class changes" must keep at least one channel: safety-critical messages.
      const row = $$(`[data-r="${r}"]`, matrix);
      if (r === 0 && !row.some((x) => x.checked)) {
        cb.checked = true;
        say('Class changes need at least one channel, so you never miss a cancellation.');
        return;
      }
      say(`✓ Saved: ${TOPICS[r][0]} by ${CHANNELS[cb.dataset.c].toLowerCase()} ${cb.checked ? 'on' : 'off'}`);
    });

    quiet.addEventListener('change', () => {
      fieldset.classList.toggle('is-off', !quiet.checked);
      $$('[data-quiet-times] input', root).forEach((i) => { i.disabled = !quiet.checked; });
      say(`✓ Quiet hours ${quiet.checked ? 'on' : 'off'}`);
    });
    $$('[data-quiet-times] input', root).forEach((i) => i.addEventListener('change', () => say(`✓ Quiet hours: ${$('[data-from]', root).value}–${$('[data-to]', root).value}`)));

    // Push permission: explain first, ask the browser only after a click.
    const titleEl = $('[data-push-title]', card);
    const textEl = $('[data-push-text]', card);
    const actions = $('.pushcard__actions', card);
    function showState(state) {
      card.classList.remove('is-done', 'is-blocked');
      if (state === 'granted') {
        card.classList.add('is-done');
        titleEl.textContent = 'Browser notifications are on';
        textEl.textContent = 'We sent a test notification. You can turn them off any time in your browser settings.';
        actions.hidden = true;
      } else if (state === 'denied') {
        card.classList.add('is-blocked');
        titleEl.textContent = 'Notifications are blocked';
        textEl.textContent = 'To allow them, click the padlock next to the address bar and set Notifications to Allow.';
        actions.hidden = true;
      } else if (state === 'unsupported') {
        card.classList.add('is-blocked');
        titleEl.textContent = 'Not available in this browser';
        textEl.textContent = 'Your browser doesn’t support web notifications. We’ll use email instead.';
        actions.hidden = true;
      }
    }
    card.tabIndex = -1;
    if (!('Notification' in window)) showState('unsupported');
    else if (Notification.permission === 'denied') showState('denied');
    else if (Notification.permission === 'granted') {
      showState('granted');
      textEl.textContent = 'You can turn them off any time in your browser settings.';
    }

    $('[data-push-enable]', card).addEventListener('click', async () => {
      try {
        const result = await Notification.requestPermission();
        if (result === 'granted') {
          try { new Notification('Forge', { body: 'You’re all set. We’ll tell you when a class changes.' }); } catch (e) { /* some browsers only allow this from a service worker */ }
          showState('granted');
        } else if (result === 'denied') {
          showState('denied');
        } else {
          say('No problem. You can turn notifications on later.');
        }
      } catch (e) {
        showState('unsupported');
      }
      focusSoon(card);
    });
    $('[data-push-later]', card).addEventListener('click', () => {
      card.hidden = true;
      say('Okay, we won’t ask again for 30 days.');
      focusSoon($('[data-r="0"][data-c="0"]', matrix));
    });
  })();

  /* ======================================================================
     06 · Ember: upload progress tray
     ====================================================================== */
  (() => {
    const section = $('#n-uploads');
    const tray = $('[data-tray]', section);
    const listEl = $('[data-tray-list]', section);
    const titleEl = $('[data-tray-title]', section);
    const summary = $('[data-tray-summary]', section);
    const toggle = $('[data-tray-toggle]', section);
    const closeBtn = $('[data-tray-close]', section);
    const live = $('[data-upload-live]', section);
    const drop = $('[data-drop]', section);
    const MAX_PARALLEL = 2;
    const uploads = [];
    let uid = 0;
    let loop = 0;

    const mb = (b) => (b >= 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`);
    const active = (u) => u.state === 'uploading' || u.state === 'queued' || u.state === 'paused';

    function add(name, size, failAt = null) {
      const u = { id: ++uid, name, size, done: 0, state: 'queued', speed: 900e3 + Math.random() * 1.4e6, failAt, h: (uid * 67) % 360 };
      const li = document.createElement('li');
      li.className = 'up';
      li.innerHTML = `<span class="up__thumb" aria-hidden="true"><svg class="icon"><use href="#i-file"/></svg></span>
        <span class="up__name">${escape(name)}</span>
        <span class="up__acts"></span>
        <span class="up__meta" aria-hidden="true"></span>
        <span class="up__bar" role="progressbar" aria-label="${escape(name)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></span>`;
      li.style.setProperty('--h', u.h);
      $('.up__thumb', li).style.setProperty('--h', u.h);
      u.li = li;
      uploads.push(u);
      listEl.append(li);
      setActions(u);
      paint(u);
    }

    // Action buttons change only when the state changes, so focus is kept.
    function setActions(u) {
      const box = $('.up__acts', u.li);
      const focused = box.contains(document.activeElement) ? document.activeElement.dataset.act : null;
      const btn = (act, icon, label) => `<button type="button" data-act="${act}" data-id="${u.id}" aria-label="${label} ${escape(u.name)}"><svg class="icon" aria-hidden="true"><use href="#${icon}"/></svg></button>`;
      box.innerHTML = {
        queued: btn('cancel', 'i-x', 'Cancel'),
        uploading: btn('pause', 'i-pause', 'Pause') + btn('cancel', 'i-x', 'Cancel'),
        paused: btn('resume', 'i-play', 'Resume') + btn('cancel', 'i-x', 'Cancel'),
        error: btn('retry', 'i-retry', 'Retry') + btn('remove', 'i-x', 'Remove'),
        done: '',
        cancelled: btn('remove', 'i-x', 'Remove'),
      }[u.state];
      u.li.className = `up is-${u.state}`;
      if (focused) focusSoon($(`[data-act]`, box) || closeBtn);
    }

    function paint(u) {
      const p = Math.min(100, Math.round((u.done / u.size) * 100));
      $('.up__bar', u.li).setAttribute('aria-valuenow', String(p));
      $('.up__bar i', u.li).style.setProperty('--p', `${p}%`);
      const meta = $('.up__meta', u.li);
      meta.className = `up__meta${u.state === 'error' ? ' is-error' : u.state === 'done' ? ' is-done' : ''}`;
      meta.textContent = {
        queued: `Waiting · ${mb(u.size)}`,
        uploading: `${mb(u.done)} of ${mb(u.size)} · ${Math.max(1, Math.ceil((u.size - u.done) / u.speed))} s left`,
        paused: `Paused at ${p}%`,
        error: 'Upload failed: connection lost. Your file is safe.',
        done: `Uploaded · ${mb(u.size)}`,
        cancelled: 'Cancelled',
      }[u.state];
      $('.up__bar', u.li).setAttribute('aria-valuetext', meta.textContent);
    }

    function header() {
      const done = uploads.filter((u) => u.state === 'done').length;
      const failed = uploads.filter((u) => u.state === 'error').length;
      const going = uploads.filter(active).length;
      titleEl.textContent = going ? `Uploading ${going} ${going === 1 ? 'file' : 'files'}` : failed ? `${failed} upload${failed === 1 ? '' : 's'} failed` : `${done} upload${done === 1 ? '' : 's'} complete`;
      const left = uploads.filter((u) => u.state === 'uploading' || u.state === 'queued').reduce((s, u) => s + (u.size - u.done) / u.speed, 0);
      summary.innerHTML = going ? `<span>${done} of ${uploads.filter((u) => u.state !== 'cancelled').length} done</span><span>About ${Math.ceil(left / MAX_PARALLEL)} s left</span>` : '';
      closeBtn.setAttribute('aria-label', going ? 'Cancel all uploads and close' : 'Close uploads');
    }

    function step() {
      // Start queued files while there's room.
      let running = uploads.filter((u) => u.state === 'uploading').length;
      uploads.filter((u) => u.state === 'queued').forEach((u) => {
        if (running < MAX_PARALLEL) { u.state = 'uploading'; running++; setActions(u); }
      });
      uploads.filter((u) => u.state === 'uploading').forEach((u) => {
        u.done = Math.min(u.size, u.done + u.speed * 0.25);
        if (u.failAt && u.done / u.size >= u.failAt) {
          u.state = 'error';
          u.failAt = null; // fail once; a retry works
          setActions(u);
          live.textContent = `${u.name} failed to upload. Retry is available.`;
        } else if (u.done >= u.size) {
          u.state = 'done';
          setActions(u);
          live.textContent = `${u.name} uploaded.`;
        }
        paint(u);
      });
      header();
      if (!uploads.some((u) => u.state === 'uploading' || u.state === 'queued')) { clearInterval(loop); loop = 0; }
    }
    const ensureLoop = () => { if (!loop) loop = setInterval(step, 250); };

    function start(files) {
      tray.hidden = false;
      files.forEach(([n, s, f]) => add(n, s, f));
      header();
      ensureLoop();
      live.textContent = `Uploading ${files.length} ${files.length === 1 ? 'file' : 'files'}.`;
    }

    $('[data-sample]', section).addEventListener('click', () => start([
      ['menu-hero.jpg', 4.2e6], ['short-rib-plated.jpg', 3.1e6], ['terrace-night.heic', 6.8e6, 0.55], ['team-portrait.png', 2.4e6], ['dessert-tart.jpg', 1.9e6],
    ]));
    $('[data-files]', section).addEventListener('change', (e) => {
      const files = [...e.target.files].map((f) => [f.name, Math.max(f.size, 200e3)]);
      if (files.length) start(files);
      e.target.value = '';
    });
    ['dragenter', 'dragover'].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add('is-over'); }));
    ['dragleave', 'drop'].forEach((t) => drop.addEventListener(t, () => drop.classList.remove('is-over')));
    drop.addEventListener('drop', (e) => {
      e.preventDefault();
      const files = [...(e.dataTransfer?.files || [])].map((f) => [f.name, Math.max(f.size, 200e3)]);
      if (files.length) start(files);
    });

    listEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      const u = uploads.find((x) => x.id === Number(b.dataset.id));
      const act = b.dataset.act;
      if (act === 'pause') u.state = 'paused';
      if (act === 'resume') u.state = 'queued';
      if (act === 'cancel') u.state = 'cancelled';
      if (act === 'retry') { u.state = 'queued'; u.done = Math.floor(u.done * 0.9); live.textContent = `Retrying ${u.name}.`; }
      if (act === 'remove') {
        uploads.splice(uploads.indexOf(u), 1);
        const next = u.li.nextElementSibling || u.li.previousElementSibling;
        u.li.remove();
        focusSoon((next && $('button', next)) || closeBtn);
        header();
        return;
      }
      setActions(u);
      paint(u);
      header();
      ensureLoop();
    });

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Collapse uploads' : 'Expand uploads');
      listEl.hidden = !open;
    });

    closeBtn.addEventListener('click', () => {
      uploads.filter(active).forEach((u) => { u.state = 'cancelled'; });
      clearInterval(loop);
      loop = 0;
      uploads.splice(0).forEach((u) => u.li.remove());
      tray.hidden = true;
      live.textContent = 'Uploads closed.';
      $('[data-sample]', section).focus();
    });
  })();
})();
