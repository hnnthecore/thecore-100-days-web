/*!
 * Thecore · 100 Days of Web Development
 * Day 003: Footers
 *
 * Zero dependencies. Every footer is complete, semantic HTML without
 * JavaScript; scripts add live data (hours, clocks, status), copy-to-
 * clipboard, form feedback, and the theme switch.
 */
(() => {
  'use strict';

  const { $, $$, reducedMotion, setTheme, getThemePreference } = window.Thecore;

  const scrollRootOf = (el) => el.closest('[data-scroll-root]');
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /** Current weekday ("Mon") and minutes since midnight in a given time zone. */
  function nowIn(timeZone) {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone,
    });
    const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
    return { day: parts.weekday, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
  }

  const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };

  /** Run a callback now and then once a minute, aligned to the clock. */
  function everyMinute(fn) {
    fn();
    setTimeout(() => {
      fn();
      setInterval(fn, 60_000);
    }, (60 - new Date().getSeconds()) * 1000);
  }

  /* ======================================================================
     Shared footer behaviour
     ====================================================================== */

  // Copyright year never goes stale.
  $$('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Demo frames open scrolled to the footer, and stay there when resized
  // (unless the visitor has scrolled up to look at the page).
  $$('[data-stick-bottom]').forEach((scroller) => {
    let atBottom = true;
    const toBottom = () => {
      if (atBottom) scroller.scrollTop = scroller.scrollHeight;
    };
    scroller.addEventListener('scroll', () => {
      atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 4;
    }, { passive: true });
    const observer = new ResizeObserver(toBottom);
    [scroller, ...scroller.children].forEach((el) => observer.observe(el));
    document.fonts?.ready.then(toBottom);
    toBottom();
  });

  // Back to top: scroll the page (or demo frame) and move focus with it.
  $$('[data-to-top]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const root = scrollRootOf(btn);
      const behavior = reducedMotion.matches ? 'auto' : 'smooth';
      (root || window).scrollTo({ top: 0, behavior });
      (root || document.getElementById('main'))?.focus({ preventScroll: true });
    });
  });

  // Newsletter forms with inline validation.
  $$('[data-newsletter]').forEach((form) => {
    const input = $('input[type="email"]', form);
    const msg = $('.newsletter__msg', form);
    const button = $('button[type="submit"]', form);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = input.value.trim();
      form.classList.remove('is-invalid', 'is-success');

      if (!EMAIL.test(value)) {
        form.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
        msg.textContent = value ? 'Please check that email address.' : 'Please enter your email address.';
        input.focus();
        return;
      }

      form.classList.add('is-success');
      input.removeAttribute('aria-invalid');
      msg.textContent = 'You’re subscribed. Check your inbox to confirm.';
      input.value = '';
      button.disabled = true;
      setTimeout(() => { button.disabled = false; }, 4000);
    });

    input.addEventListener('input', () => {
      if (form.classList.contains('is-invalid') && EMAIL.test(input.value.trim())) {
        form.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
        msg.textContent = '';
      }
    });
  });

  // Link columns: always open on wide footers, accordions on narrow ones.
  $$('.ft').forEach((footer) => {
    const columns = $$('[data-collapsible]', footer);
    if (!columns.length) return;
    const BREAKPOINT = 620; // keep in sync with the @container rule in styles.css
    let narrow = null;

    const apply = () => {
      const isNarrow = footer.clientWidth < BREAKPOINT;
      if (isNarrow === narrow) return;
      narrow = isNarrow;
      columns.forEach((col) => {
        col.open = !narrow;
        const summary = $('summary', col);
        if (narrow) summary.removeAttribute('tabindex');
        else summary.tabIndex = -1; // headings, not controls, on wide layouts
      });
    };

    columns.forEach((col) => {
      $('summary', col).addEventListener('click', (e) => {
        if (!narrow) e.preventDefault();
      });
    });

    new ResizeObserver(apply).observe(footer);
    apply();
  });

  /* ======================================================================
     02 · Halden: copy email + live studio clocks
     ====================================================================== */
  $$('[data-copy]').forEach((btn) => {
    const hint = $('[data-copy-hint]', btn);
    hint.setAttribute('aria-live', 'polite');
    let timer = 0;

    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        // Fallback for older browsers / non-secure contexts
        const area = Object.assign(document.createElement('textarea'), { value: text });
        area.style.cssText = 'position:fixed;opacity:0';
        document.body.append(area);
        area.select();
        document.execCommand('copy');
        area.remove();
      }
      btn.classList.add('is-copied');
      hint.textContent = 'Copied!';
      clearTimeout(timer);
      timer = setTimeout(() => {
        btn.classList.remove('is-copied');
        hint.textContent = 'Copy';
      }, 2000);
    });
  });

  $$('[data-clock]').forEach((el) => {
    const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: el.dataset.clock });
    everyMinute(() => {
      el.textContent = fmt.format(new Date());
    });
  });

  /* ======================================================================
     03 · Ember: today's hours + open badge (the table is the source of truth)
     ====================================================================== */
  $$('[data-footer="ember"]').forEach((footer) => {
    const rows = $$('[data-day]', footer);
    const badge = $('[data-open-badge]', footer);
    const DAYS = rows.map((r) => r.dataset.day);

    const hoursOf = (row) => {
      const text = row.cells[1].textContent;
      const match = text.match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/);
      return match ? [toMinutes(match[1]), toMinutes(match[2])] : null;
    };

    everyMinute(() => {
      const { day, minutes } = nowIn('Europe/London');
      rows.forEach((r) => {
        const today = r.dataset.day === day;
        r.classList.toggle('is-today', today);
        if (today) r.setAttribute('aria-current', 'date');
        else r.removeAttribute('aria-current');
      });

      const todayRow = rows[DAYS.indexOf(day)];
      const hours = todayRow && hoursOf(todayRow);
      const open = hours && minutes >= hours[0] && minutes < hours[1];
      badge.className = `ember-ft__status ${open ? 'is-open' : 'is-closed'}`;
      badge.textContent = open ? 'Open now' : 'Closed now';
    });
  });

  /* ======================================================================
     04 · Orbit: System / Light / Dark switch (WAI-ARIA radio group)
     ====================================================================== */
  $$('[data-theme-switch]').forEach((group) => {
    const radios = $$('[role="radio"]', group);
    const MODES = radios.map((r) => r.dataset.mode);

    const sync = (mode) => {
      const index = Math.max(0, MODES.indexOf(mode));
      group.style.setProperty('--index', index);
      radios.forEach((r, i) => {
        r.setAttribute('aria-checked', String(i === index));
        r.tabIndex = i === index ? 0 : -1;
      });
    };

    radios.forEach((radio, i) => {
      radio.addEventListener('click', () => setTheme(radio.dataset.mode));
      radio.addEventListener('keydown', (e) => {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!step) return;
        e.preventDefault();
        const next = radios[(i + step + radios.length) % radios.length];
        next.focus();
        setTheme(next.dataset.mode);
      });
    });

    // Stay in sync with the page's own theme button.
    document.addEventListener('thecore:themechange', (e) => sync(e.detail.mode));
    sync(getThemePreference());
  });

  /* ======================================================================
     05 · Sentinel: 90-day uptime chart with hover details
     ====================================================================== */
  $$('[data-uptime]').forEach((chart) => {
    const bars = $('[data-uptime-bars]', chart);
    const tip = $('[data-uptime-tip]', chart);
    const avgEl = $('[data-uptime-avg]', chart.closest('.ft'));

    // Demo incident history (a real site would load this from its status API)
    const INCIDENTS = {
      23: { uptime: 99.71, note: 'Elevated API latency (EU)' },
      51: { uptime: 98.12, note: 'Partial outage: alert delivery' },
      77: { uptime: 99.86, note: 'Degraded dashboard loading' },
    };
    const dayFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
    const days = [];

    for (let i = 0; i < 90; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (89 - i));
      const incident = INCIDENTS[i];
      const uptime = incident ? incident.uptime : 100;
      days.push({ date, uptime, note: incident?.note || 'No incidents' });

      const bar = document.createElement('span');
      if (uptime < 99) bar.className = 'is-major';
      else if (uptime < 100) bar.className = 'is-minor';
      bar.dataset.index = i;
      bars.append(bar);
    }

    const avg = days.reduce((sum, d) => sum + d.uptime, 0) / days.length;
    if (avgEl) avgEl.textContent = `${avg.toFixed(2)}%`;
    chart.setAttribute('aria-label', `Uptime over the last 90 days: ${avg.toFixed(2)} percent, with ${Object.keys(INCIDENTS).length} days of incidents.`);

    bars.addEventListener('pointerover', (e) => {
      const bar = e.target.closest('span');
      if (!bar) return;
      const day = days[bar.dataset.index];
      tip.innerHTML = `<strong>${dayFmt.format(day.date)} · ${day.uptime.toFixed(2)}%</strong>${day.note}`;
      const chartBox = chart.getBoundingClientRect();
      const barBox = bar.getBoundingClientRect();
      // Keep the tooltip inside the chart's edges
      const x = Math.min(Math.max(barBox.left - chartBox.left + barBox.width / 2, 90), chartBox.width - 90);
      tip.style.setProperty('--tip-x', `${x}px`);
      tip.hidden = false;
    });
    bars.addEventListener('pointerleave', () => {
      tip.hidden = true;
    });
  });

  /* ======================================================================
     06 · Forge: per-location open/closed status (UK time)
     ====================================================================== */
  $$('[data-locations]').forEach((list) => {
    const items = $$('li', list);
    everyMinute(() => {
      const { minutes } = nowIn('Europe/London');
      items.forEach((li) => {
        const open = toMinutes(li.dataset.open);
        const close = toMinutes(li.dataset.close);
        const status = $('[data-loc-status]', li);
        const isOpen = minutes >= open && minutes < close;
        status.classList.toggle('is-open', isOpen);
        status.textContent = isOpen ? `Open · until ${li.dataset.close}` : `Closed · opens ${li.dataset.open}`;
      });
    });
  });
})();
