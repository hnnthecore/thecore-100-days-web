/*!
 * Thecore · 100 Days of Web Development
 * Day 018: Feature sections
 */
(() => {
  'use strict';

  const { $, $$, reducedMotion } = window.Thecore;
  const escape = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* Count a number up from 0 when it first becomes visible. */
  function countUp(el) {
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || '';
    const format = (v) => `${v.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
    if (reducedMotion.matches) { el.textContent = format(target); return; }
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / 1400);
      const eased = 1 - (1 - t) ** 3;
      el.textContent = format(target * eased);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    // If animation frames are throttled (background tab), still land on the real value.
    setTimeout(() => { el.textContent = format(target); }, 1600);
  }
  const counted = new WeakSet();
  const countObserver = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting && !counted.has(e.target)) { counted.add(e.target); countUp(e.target); }
  }), { threshold: 0.6 });
  $$('[data-count]').forEach((el) => {
    // Show the real value immediately for anyone not running the animation.
    el.textContent = `${Number(el.dataset.count).toLocaleString('en-GB', { minimumFractionDigits: Number(el.dataset.decimals || 0) })}${el.dataset.suffix || ''}`;
    countObserver.observe(el);
  });

  /* Run a callback only while an element is on screen and the tab is visible. */
  function whileVisible(el, onChange) {
    let inView = false;
    const update = () => onChange(inView && !document.hidden);
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; update(); }, { threshold: 0.2 }).observe(el);
    document.addEventListener('visibilitychange', update);
  }

  /* ======================================================================
     01 · Lumen: bento grid
     ====================================================================== */
  (() => {
    const bento = $('[data-bento]');
    const chart = $('[data-live-chart]', bento);
    const now = $('[data-live-now]', bento);
    const avatars = $('[data-avatars]', bento);
    const invite = $('[data-invite]', bento);

    // Glow follows the pointer inside each tile.
    bento.addEventListener('pointermove', (e) => {
      const tile = e.target.closest('.tile');
      if (!tile) return;
      const r = tile.getBoundingClientRect();
      tile.style.setProperty('--mx', `${e.clientX - r.left}px`);
      tile.style.setProperty('--my', `${e.clientY - r.top}px`);
    });

    // Live chart: a new bar every 1.5 s while visible.
    let values = Array.from({ length: 28 }, (_, i) => 30 + Math.sin(i / 3) * 18 + Math.random() * 20);
    const draw = () => { chart.innerHTML = values.map((v) => `<i style="--h:${v.toFixed(0)}%"></i>`).join(''); };
    draw();
    let timer = 0;
    let visitors = 142;
    whileVisible(bento, (on) => {
      clearInterval(timer);
      if (!on || reducedMotion.matches) return;
      timer = setInterval(() => {
        values = [...values.slice(1), Math.max(12, Math.min(98, values[values.length - 1] + (Math.random() - 0.48) * 22))];
        draw();
        visitors = Math.max(90, visitors + Math.round((Math.random() - 0.45) * 9));
        now.textContent = visitors;
      }, 1500);
    });

    const note = $('[data-privacy-note]', bento);
    $('[data-privacy]', bento).addEventListener('change', (e) => {
      note.textContent = e.target.checked ? 'IP addresses are never stored.' : 'Full IPs kept for 24 h, then deleted.';
    });

    const run = $('[data-run]', bento);
    const out = $('[data-run-out]', bento);
    run.addEventListener('click', () => {
      run.disabled = true;
      out.textContent = 'Installing…';
      setTimeout(() => { out.textContent = '✓ added 1 package in 0.8 s'; run.textContent = 'Run again'; run.disabled = false; }, 900);
    });

    const PEOPLE = [['RS', 265], ['TA', 150], ['KN', 210], ['IS', 30], ['LM', 330], ['PN', 20]];
    let shown = 3;
    function renderAvatars(fresh) {
      avatars.innerHTML = PEOPLE.slice(0, shown).map(([ini, h], i) => `<li class="${i < 2 || i === fresh ? 'is-live' : ''}"><span class="avatar" style="--h:${h}" aria-hidden="true">${ini}</span></li>`).join('');
      avatars.setAttribute('aria-label', `${shown} teammates on this dashboard`);
      invite.disabled = shown >= PEOPLE.length;
      if (invite.disabled) invite.textContent = 'Team is full on this plan';
    }
    invite.addEventListener('click', () => { if (shown < PEOPLE.length) { shown++; renderAvatars(shown - 1); } });
    renderAvatars();
  })();

  /* ======================================================================
     02 · Atlas: auto-playing feature tabs
     ====================================================================== */
  (() => {
    const root = $('[data-ftabs]');
    const tabs = $$('[role="tab"]', root);
    const pauseBtn = $('[data-ftabs-pause]', root);
    const DURATION = 5000;
    let index = 0;
    let elapsed = 0;
    let last = 0;
    let userPaused = false;
    let hover = false;
    let visible = false;
    let frame = 0;

    function select(i, focus = false) {
      index = (i + tabs.length) % tabs.length;
      elapsed = 0;
      tabs.forEach((t, n) => {
        const on = n === index;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
        t.style.setProperty('--p', '0');
      });
      if (focus) tabs[index].focus();
    }

    const running = () => !userPaused && !hover && visible && !reducedMotion.matches;
    function tick(t) {
      if (running()) {
        elapsed += t - last;
        tabs[index].style.setProperty('--p', String(Math.min(1, elapsed / DURATION)));
        if (elapsed >= DURATION) select(index + 1);
      }
      last = t;
      frame = requestAnimationFrame(tick);
    }
    function loop(on) {
      cancelAnimationFrame(frame);
      if (on) { last = performance.now(); frame = requestAnimationFrame(tick); }
    }

    tabs.forEach((t, i) => t.addEventListener('click', () => select(i, true)));
    root.addEventListener('keydown', (e) => {
      if (!e.target.matches('[role="tab"]')) return;
      const next = { ArrowDown: index + 1, ArrowRight: index + 1, ArrowUp: index - 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select(next, true);
    });

    // Pause while the pointer or keyboard focus is inside, or when asked.
    const box = $('.ftabs', root);
    box.addEventListener('pointerenter', () => { hover = true; });
    box.addEventListener('pointerleave', () => { hover = box.contains(document.activeElement); });
    box.addEventListener('focusin', () => { hover = true; });
    box.addEventListener('focusout', (e) => { if (!box.contains(e.relatedTarget)) hover = box.matches(':hover'); });
    pauseBtn.addEventListener('click', () => {
      userPaused = !userPaused;
      pauseBtn.setAttribute('aria-pressed', String(userPaused));
      $('span', pauseBtn).textContent = userPaused ? 'Play' : 'Pause';
      $('use', pauseBtn).setAttribute('href', userPaused ? '#i-play' : '#i-pause');
    });
    if (reducedMotion.matches) pauseBtn.hidden = true; // nothing auto-plays, so no control needed

    whileVisible(root, (on) => { visible = on; loop(on); });
    select(0);
  })();

  /* ======================================================================
     03 · Halden: alternating rows with reveal
     ====================================================================== */
  (() => {
    const zz = $('.zz');
    zz.classList.add('is-ready'); // only now may rows start hidden
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { threshold: 0.2 });
    $$('[data-reveal]', zz).forEach((row) => io.observe(row));
  })();

  /* ======================================================================
     04 · Forma: before / after slider
     ====================================================================== */
  (() => {
    const fig = $('[data-compare]');
    const handle = $('[data-handle]', fig);
    let pos = 50;

    function set(p, animate = false) {
      pos = Math.max(0, Math.min(100, Math.round(p)));
      fig.classList.toggle('is-animating', animate && !reducedMotion.matches);
      fig.style.setProperty('--pos', `${pos}%`);
      handle.setAttribute('aria-valuenow', String(pos));
      handle.setAttribute('aria-valuetext', pos === 0 ? 'Showing after only' : pos === 100 ? 'Showing before only' : `${pos}% before, ${100 - pos}% after`);
    }
    const fromEvent = (e) => {
      const r = fig.getBoundingClientRect();
      return ((e.clientX - r.left) / r.width) * 100;
    };

    let dragging = false;
    fig.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      dragging = true;
      fig.setPointerCapture(e.pointerId);
      set(fromEvent(e), e.target !== handle && !handle.contains(e.target));
      handle.focus({ preventScroll: true });
    });
    fig.addEventListener('pointermove', (e) => { if (dragging) set(fromEvent(e)); });
    const stop = () => { dragging = false; };
    fig.addEventListener('pointerup', stop);
    fig.addEventListener('pointercancel', stop);

    handle.addEventListener('keydown', (e) => {
      const big = e.shiftKey ? 10 : 2;
      const map = { ArrowLeft: pos - big, ArrowDown: pos - big, ArrowRight: pos + big, ArrowUp: pos + big, PageDown: pos - 20, PageUp: pos + 20, Home: 0, End: 100 };
      if (!(e.key in map)) return;
      e.preventDefault();
      set(map[e.key]);
    });
    $$('[data-jump]').forEach((b) => b.addEventListener('click', () => set(Number(b.dataset.jump) === 0 ? 100 : Number(b.dataset.jump) === 100 ? 0 : 50, true)));
    set(50);
  })();

  /* ======================================================================
     05 · Nova: sticky scroll story
     ====================================================================== */
  (() => {
    const scroller = $('[data-story-root]');
    const steps = $$('[data-step]', scroller);
    const stage = $('[data-stage]', scroller);

    // A step is "current" when it crosses the middle band of the scrolling area.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        steps.forEach((s) => s.classList.toggle('is-active', s === e.target));
        stage.dataset.stage = e.target.dataset.step;
      });
    }, { root: scroller, rootMargin: '-45% 0px -45% 0px' });
    steps.forEach((s) => io.observe(s));
  })();

  /* ======================================================================
     06 · Ember: integrations directory
     ====================================================================== */
  (() => {
    const root = $('[data-integrations]');
    const q = $('[data-int-q]', root);
    const catsEl = $('[data-int-cats]', root);
    const grid = $('[data-int-grid]', root);
    const count = $('[data-int-count]', root);
    const request = $('[data-int-request]', root);
    const msg = $('[data-int-msg]', root);

    const ITEMS = [
      ['Deliveroo', 'Delivery', 'Orders flow straight to the kitchen screen.', 180, true],
      ['Uber Eats', 'Delivery', 'Menus and stock sync automatically.', 150, true],
      ['Just Eat', 'Delivery', 'Accept and track orders without a tablet.', 20],
      ['Stuart', 'Delivery', 'On-demand couriers for your own website orders.', 260],
      ['Stripe', 'Payments', 'Card, Apple Pay and Google Pay online.', 270, true],
      ['SumUp', 'Payments', 'Tap-to-pay card readers at the table.', 230],
      ['Adyen', 'Payments', 'Enterprise payments for multi-site groups.', 140],
      ['PayPal', 'Payments', 'Let guests pay with their PayPal account.', 240],
      ['Klarna', 'Payments', 'Split the bill for large events and catering.', 340],
      ['Xero', 'Accounting', 'Daily sales and VAT, posted automatically.', 210, true],
      ['QuickBooks', 'Accounting', 'Sync revenue, tips and refunds.', 140],
      ['Sage', 'Accounting', 'End-of-day reports straight into Sage.', 150],
      ['Dext', 'Accounting', 'Snap supplier invoices from your phone.', 30],
      ['OpenTable', 'Bookings', 'Bookings appear on your floor plan.', 10, true],
      ['ResDiary', 'Bookings', 'Covers and table times in one place.', 200],
      ['SevenRooms', 'Bookings', 'Guest notes and preferences at the till.', 280],
      ['Google Reserve', 'Bookings', '“Book a table” right on Google Maps.', 220],
      ['Mailchimp', 'Marketing', 'Turn guests into newsletter subscribers.', 60],
      ['Klaviyo', 'Marketing', 'Birthday offers based on visit history.', 120],
      ['Instagram', 'Marketing', 'Tag dishes and take orders from posts.', 330],
      ['Google Business', 'Marketing', 'Keep opening hours and menus up to date.', 210],
      ['Deputy', 'Staff', 'Rotas built from your busiest hours.', 190],
      ['7shifts', 'Staff', 'Shift swaps and tip pooling.', 250],
      ['Tronc', 'Staff', 'Fair, compliant service-charge payouts.', 40],
    ].map(([name, cat, desc, h, popular]) => ({ name, cat, desc, h, popular: !!popular }));
    const CATS = ['All', ...new Set(ITEMS.map((i) => i.cat))];
    let cat = 'All';

    catsEl.innerHTML = CATS.map((c) => `<button type="button" aria-pressed="${c === 'All'}" data-cat="${c}">${c} <span class="sr-only">(${c === 'All' ? ITEMS.length : ITEMS.filter((i) => i.cat === c).length})</span></button>`).join('');

    function highlight(text, term) {
      if (!term) return escape(text);
      const i = text.toLowerCase().indexOf(term);
      return i < 0 ? escape(text) : `${escape(text.slice(0, i))}<mark>${escape(text.slice(i, i + term.length))}</mark>${escape(text.slice(i + term.length))}`;
    }

    function render() {
      const term = q.value.trim().toLowerCase();
      const list = ITEMS.filter((i) => (cat === 'All' || i.cat === cat) && (!term || `${i.name} ${i.desc} ${i.cat}`.toLowerCase().includes(term)));
      grid.innerHTML = list.map((i) => `
        <li class="int-card">
          <span class="int-logo" style="--h:${i.h}" aria-hidden="true">${i.name[0]}</span>
          <strong>${highlight(i.name, term)}</strong>
          <small>${i.cat}</small>
          <p>${highlight(i.desc, term)}</p>
          ${i.popular ? '<span class="int-badge">Popular</span>' : ''}
        </li>`).join('');
      count.textContent = `${list.length} ${list.length === 1 ? 'integration' : 'integrations'}${cat !== 'All' ? ` in ${cat}` : ''}${term ? ` matching “${q.value.trim()}”` : ''}`;
      request.hidden = list.length > 0;
      if (!list.length) $('[data-int-missing]', root).textContent = term ? `“${q.value.trim()}”` : `a ${cat.toLowerCase()} tool`;
      msg.textContent = '';
    }

    catsEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-cat]');
      if (!b) return;
      cat = b.dataset.cat;
      $$('[data-cat]', catsEl).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      render();
    });
    q.addEventListener('input', render);

    request.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('[data-int-email]', root);
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
      msg.className = `int-request__msg ${ok ? 'is-ok' : 'is-error'}`;
      email.setAttribute('aria-invalid', String(!ok));
      if (!ok) { msg.textContent = 'Please enter an email like you@restaurant.com.'; email.focus(); return; }
      msg.textContent = `Thanks! We'll email ${email.value.trim()} when ${q.value.trim() || 'it'} is ready.`;
      email.value = '';
    });

    render();
  })();
})();
