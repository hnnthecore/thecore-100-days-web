/*!
 * Thecore · 100 Days of Web Development
 * Day 002: Hero Sections
 *
 * Zero dependencies. Every hero is complete, readable HTML without
 * JavaScript; scripts add live data (opening hours, countdowns), form
 * feedback and motion. Animations pause while a hero is off-screen and
 * respect the visitor's reduced-motion setting.
 */
(() => {
  'use strict';

  const { $, $$, reducedMotion } = window.Thecore;

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const scrollRootOf = (el) => el.closest('[data-scroll-root]');
  const canHover = matchMedia('(hover: hover) and (pointer: fine)');

  /* ======================================================================
     Shared: pause looping animations while a hero is off-screen
     ====================================================================== */
  const visibility = new WeakMap();
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      visibility.set(entry.target, entry.isIntersecting);
      entry.target.classList.toggle('is-paused', !entry.isIntersecting);
    });
  });

  const isVisible = (hero) => visibility.get(hero) !== false;

  /** Resolves once the hero is on screen again (polls cheaply). */
  async function whenVisible(hero) {
    while (!isVisible(hero)) await wait(250);
  }

  /** Throttle a pointer handler to one update per animation frame. */
  function onPointerFrame(el, handler) {
    let frame = 0;
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        handler(e);
      });
    });
  }

  /* ======================================================================
     01 · Nimbus: spotlight, email capture, scroll-linked tilt
     ====================================================================== */
  function initNimbus(hero) {
    // Spotlight follows the cursor
    const spotlight = $('.nimbus__spotlight', hero);
    onPointerFrame(hero, (e) => {
      const r = hero.getBoundingClientRect();
      spotlight.style.setProperty('--mx', `${e.clientX - r.left}px`);
      spotlight.style.setProperty('--my', `${e.clientY - r.top}px`);
    });

    // Email capture with friendly, inline validation
    const form = $('[data-capture]', hero);
    const input = $('input', form);
    const text = $('[data-capture-text]', form);
    const button = $('button', form);
    const defaultText = text.textContent;
    const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const setInvalid = (message) => {
      form.classList.remove('is-invalid');
      void form.offsetWidth; // restart the shake animation
      form.classList.add('is-invalid');
      input.setAttribute('aria-invalid', 'true');
      text.textContent = message;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = input.value.trim();
      if (!value) return setInvalid('Please enter your work email.');
      if (!EMAIL.test(value)) return setInvalid('That email doesn’t look quite right. Check for typos.');

      form.classList.remove('is-invalid');
      form.classList.add('is-success');
      input.removeAttribute('aria-invalid');
      text.textContent = `You’re on the list! We’ll email ${value} within 24 hours.`;
      button.disabled = true;
      button.firstChild.textContent = 'Request sent ';
    });

    input.addEventListener('input', () => {
      if (form.classList.contains('is-invalid') && EMAIL.test(input.value.trim())) {
        form.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
        text.textContent = defaultText;
      }
    });

    // Product window straightens up as it scrolls into view
    const product = $('.nimbus__window', hero);
    const root = scrollRootOf(hero);
    const target = root || window;
    let ticking = false;

    const updateTilt = () => {
      ticking = false;
      const view = root ? root.getBoundingClientRect() : { top: 0, height: innerHeight };
      const rect = product.getBoundingClientRect();
      const progress = clamp(1 - (rect.top - view.top) / (view.height * 0.75), 0, 1);
      product.style.setProperty('--tilt', `${(20 * (1 - progress)).toFixed(2)}deg`);
      product.style.setProperty('--tilt-scale', (0.94 + 0.06 * progress).toFixed(4));
    };

    if (reducedMotion.matches) {
      product.style.setProperty('--tilt', '0deg');
      product.style.setProperty('--tilt-scale', '1');
    } else {
      target.addEventListener('scroll', () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateTilt);
        }
      }, { passive: true });
      updateTilt();
    }
  }

  /* ======================================================================
     02 · Forma: accessible tabs + validated search
     ====================================================================== */
  function initForma(hero) {
    const form = $('[data-search]', hero);
    const tabs = $$('[role="tab"]', form);
    const pill = $('.search-card__tab-pill', form);
    const panel = $('[role="tabpanel"]', form);
    const location = $('input[name="location"]', form);
    const locationField = location.closest('.field');
    const budget = $('[data-budget]', form);
    const budgetLabel = $('[data-budget-label]', form);
    const submitLabel = $('.search-card__submit span', form);
    const msg = $('.search-card__msg', form);

    const MODES = {
      buy: { budget: 'Max price', options: ['No limit', '€400k', '€750k', '€1.2M', '€2M+'], placeholder: 'City, area or postcode', submit: 'Search' },
      rent: { budget: 'Max rent / month', options: ['No limit', '€1,000', '€1,500', '€2,500', '€4,000+'], placeholder: 'City, area or postcode', submit: 'Search' },
      sell: { budget: 'Timeline', options: ['Just exploring', 'Within 3 months', 'Within 6 months', 'This year'], placeholder: 'Your property’s address', submit: 'Get valuation' },
    };
    let mode = 'buy';

    const movePill = () => {
      const active = tabs.find((t) => t.getAttribute('aria-selected') === 'true');
      if (!active || !active.offsetWidth) return;
      pill.style.setProperty('--x', `${active.offsetLeft - 3}px`);
      pill.style.setProperty('--w', `${active.offsetWidth}px`);
    };

    function select(tab, { focus = false } = {}) {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      if (focus) tab.focus();
      panel.setAttribute('aria-labelledby', tab.id);
      mode = tab.dataset.mode;

      const config = MODES[mode];
      budgetLabel.textContent = config.budget;
      budget.innerHTML = config.options.map((o, i) => `<option value="${i ? o : ''}">${o}</option>`).join('');
      location.placeholder = config.placeholder;
      submitLabel.textContent = config.submit;
      msg.textContent = '';
      msg.classList.remove('is-error');
      locationField.classList.remove('is-invalid');
      movePill();
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      // Arrow keys move between tabs (WAI-ARIA tabs pattern)
      tab.addEventListener('keydown', (e) => {
        const keys = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
        if (!(e.key in keys)) return;
        e.preventDefault();
        select(tabs[(keys[e.key] + tabs.length) % tabs.length], { focus: true });
      });
    });

    new ResizeObserver(movePill).observe(form);
    document.fonts?.ready.then(movePill);
    movePill();

    // A stable, believable result count for any search term
    const countFor = (term) => {
      let h = 0;
      for (const ch of term.toLowerCase()) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
      return 40 + (h % 460);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const place = location.value.trim();

      if (!place) {
        locationField.classList.add('is-invalid');
        location.setAttribute('aria-invalid', 'true');
        msg.classList.add('is-error');
        msg.textContent = mode === 'sell'
          ? 'Enter your property’s address so we can value it.'
          : 'Enter a city, area or postcode to start your search.';
        location.focus();
        return;
      }

      msg.classList.remove('is-error');
      const safePlace = place.replace(/[<>&"]/g, '');
      if (mode === 'sell') {
        msg.innerHTML = `Thanks! A local agent will send a free valuation for <strong>${safePlace}</strong> within 24 hours.`;
      } else {
        const what = mode === 'rent' ? 'rentals' : 'homes for sale';
        msg.innerHTML = `Showing <strong>${countFor(place + mode)} ${what}</strong> in <strong>${safePlace}</strong>`;
      }
    });

    location.addEventListener('input', () => {
      if (location.value.trim()) {
        locationField.classList.remove('is-invalid');
        location.removeAttribute('aria-invalid');
        if (msg.classList.contains('is-error')) {
          msg.textContent = '';
          msg.classList.remove('is-error');
        }
      }
    });
  }

  /* ======================================================================
     03 · Ember: live "open now" status in the restaurant's own time zone
     ====================================================================== */
  function initEmber(hero) {
    const status = $('[data-open-status]', hero);
    const label = $('span', status);

    // Opening hours in minutes after midnight (London time). Monday closed.
    const HOURS = {
      Tue: [17 * 60, 23 * 60], Wed: [17 * 60, 23 * 60], Thu: [17 * 60, 23 * 60],
      Fri: [17 * 60, 23 * 60 + 30], Sat: [12 * 60, 23 * 60 + 30], Sun: [12 * 60, 16 * 60],
    };
    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const fmt = new Intl.DateTimeFormat('en-GB', {
      weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'Europe/London',
    });
    const toClock = (mins) => `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;

    function update() {
      const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
      const day = parts.weekday;
      const now = Number(parts.hour) * 60 + Number(parts.minute);
      const today = HOURS[day];

      if (today && now >= today[0] && now < today[1]) {
        status.className = 'ember__status is-open';
        label.innerHTML = `<strong>Open now</strong> · until ${toClock(today[1])}`;
        return;
      }

      // Find the next opening time
      status.className = 'ember__status is-closed';
      if (today && now < today[0]) {
        label.innerHTML = `<strong>Closed</strong> · opens today at ${toClock(today[0])}`;
        return;
      }
      const start = DAYS.indexOf(day);
      for (let i = 1; i <= 7; i++) {
        const next = DAYS[(start + i) % 7];
        if (HOURS[next]) {
          const when = i === 1 ? 'tomorrow' : next;
          label.innerHTML = `<strong>Closed</strong> · opens ${when} at ${toClock(HOURS[next][0])}`;
          return;
        }
      }
    }

    update();
    setInterval(update, 60_000);
  }

  /* ======================================================================
     04 · Kinetic: rolling headline word
     ====================================================================== */
  function initKinetic(hero) {
    const words = $('.kinetic__words', hero);
    const count = words.children.length; // last item repeats the first for a seamless loop
    let index = 0;

    if (reducedMotion.matches) return;

    setInterval(() => {
      if (!isVisible(hero) || document.hidden) return;
      index += 1;
      words.style.setProperty('--i', index);

      if (index === count - 1) {
        // Landed on the duplicate: jump back to the real first word invisibly
        setTimeout(() => {
          words.classList.add('no-anim');
          index = 0;
          words.style.setProperty('--i', 0);
          void words.offsetHeight;
          words.classList.remove('no-anim');
        }, 750);
      }
    }, 2400);
  }

  /* ======================================================================
     05 · Sentinel: typing terminal + count-up stats
     ====================================================================== */
  function initSentinel(hero) {
    // Count-up numbers (re-run every time the stats scroll into view)
    const counters = $$('[data-count]', hero);
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));

    function runCount(el) {
      const target = Number(el.dataset.count);
      const decimals = Number(el.dataset.decimals || 0);
      if (reducedMotion.matches) {
        el.textContent = target.toFixed(decimals);
        return;
      }
      const start = performance.now();
      const duration = 1600;
      const step = (now) => {
        const t = clamp((now - start) / duration, 0, 1);
        el.textContent = (target * easeOutExpo(t)).toFixed(decimals);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) runCount(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => statsObserver.observe(el));

    // Terminal: commands are typed, results appear line by line, then it loops
    const screen = $('[data-terminal]', hero);
    const SCRIPT = [
      { cls: 't-prompt', text: '$ ', typed: 'sentinel scan --env production' },
      { cls: 't-dim', text: '→ Enumerating 1,284 assets across 3 regions…' },
      { cls: 't-ok', text: '✓ Firewall policies ............ OK' },
      { cls: 't-ok', text: '✓ TLS certificates ............ OK' },
      { cls: 't-warn', text: '! Outdated OpenSSH on db-02 .... PATCHED' },
      { cls: 't-crit', text: '✗ Credential stuffing (443) .... BLOCKED' },
      { cls: 't-crit', text: '✗ Malicious macro: invoice.docm  QUARANTINED' },
      { cls: 't-dim', text: '' },
      { cls: 't-ok', text: '✓ Scan complete · 3 threats contained in 4.2s' },
    ];

    const cursor = document.createElement('span');
    cursor.className = 't-cursor';

    const line = (cls, text = '') => {
      const span = document.createElement('span');
      span.className = cls;
      span.textContent = text;
      screen.append(span, '\n');
      return span;
    };

    function renderInstant() {
      screen.textContent = '';
      SCRIPT.forEach(({ cls, text, typed }) => {
        const el = line(cls, text);
        if (typed) el.after(document.createTextNode(typed));
      });
      screen.append(Object.assign(document.createElement('span'), { className: 't-prompt', textContent: '$ ' }), cursor);
    }

    async function play() {
      for (;;) {
        await whenVisible(hero);
        screen.textContent = '';
        for (const { cls, text, typed } of SCRIPT) {
          await whenVisible(hero);
          const el = line(cls, text);
          if (typed) {
            const cmd = document.createTextNode('');
            el.after(cmd);
            cmd.after(cursor);
            for (const ch of typed) {
              cmd.textContent += ch;
              await wait(28 + Math.random() * 40);
            }
            cursor.remove();
            await wait(350);
          } else {
            await wait(280);
          }
        }
        screen.append(Object.assign(document.createElement('span'), { className: 't-prompt', textContent: '$ ' }), cursor);
        await wait(5000);
      }
    }

    if (reducedMotion.matches) renderInstant();
    else play();
  }

  /* ======================================================================
     06 · Forge: next-class countdown + pointer parallax
     ====================================================================== */
  function initForge(hero) {
    // Countdown to the next class (classes start every half hour)
    const timer = $('[data-countdown]', hero);
    const tick = () => {
      const now = new Date();
      const next = new Date(now);
      next.setSeconds(0, 0);
      next.setMinutes(now.getMinutes() < 30 ? 30 : 60);
      const secs = Math.max(0, Math.round((next - now) / 1000));
      timer.textContent = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
      timer.setAttribute('aria-label', `Starts in ${Math.floor(secs / 60)} minutes`);
    };
    tick();
    setInterval(tick, 1000);

    // Depth layers drift with the cursor
    $$('[data-depth]', hero).forEach((el) => el.style.setProperty('--depth', el.dataset.depth));
    if (reducedMotion.matches || !canHover.matches) return;

    onPointerFrame(hero, (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      hero.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    });
    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--px', 0);
      hero.style.setProperty('--py', 0);
    });
  }

  /* ======================================================================
     Boot
     ====================================================================== */
  const registry = {
    nimbus: initNimbus,
    forma: initForma,
    ember: initEmber,
    kinetic: initKinetic,
    sentinel: initSentinel,
    forge: initForge,
  };

  $$('[data-hero]').forEach((hero) => {
    visibilityObserver.observe(hero);
    registry[hero.dataset.hero]?.(hero);
  });
})();
