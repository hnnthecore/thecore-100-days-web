/*!
 * Thecore · 100 Days of Web Development
 * Day 011: Dashboards
 *
 * All figures are generated demo data. In Phase 4 the same widgets read
 * from a real API; only the data functions at the top of each section change.
 */
(() => {
  'use strict';

  const { $, $$ } = window.Thecore;
  const { area, bars, donut, spark, series } = window.Charts;

  const css = (el, name) => getComputedStyle(el).getPropertyValue(name).trim();
  const num = new Intl.NumberFormat('en-GB');
  const compact = new Intl.NumberFormat('en-GB', { notation: 'compact', maximumFractionDigits: 1 });

  /* ======================================================================
     01 · Lumen: SaaS analytics
     ====================================================================== */
  (() => {
    const root = $('[data-analytics]');
    const kpis = $('[data-kpis]', root);
    const label = $('[data-range-label]', root);
    const pages = $('[data-pages] tbody', root);
    let traffic = null;

    const PAGES = [['/', 1], ['/pricing', 0.46], ['/features', 0.38], ['/blog/ai-workflows', 0.27], ['/customers', 0.18]];

    function render(days) {
      const c1 = css(root, '--c1');
      const c2 = css(root, '--c2');
      const now = series(days * 7, days, 1600, 320, 6);
      const prev = series(days * 13, days, 1450, 300, 2);
      const labels = Array.from({ length: days }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (days - 1 - i));
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      });

      const sum = (a) => a.reduce((s, v) => s + v, 0);
      const visitors = sum(now);
      const prevVisitors = sum(prev);
      const change = (a, b) => ((a - b) / b) * 100;
      const signups = Math.round(visitors * 0.042);
      const conv = (signups / visitors) * 100;
      const mrr = 18200 + days * 41;

      const cards = [
        { label: 'Visitors', value: compact.format(visitors), d: change(visitors, prevVisitors), data: now },
        { label: 'Sign-ups', value: num.format(signups), d: change(signups, prevVisitors * 0.04), data: now.map((v) => v * 0.04 + (v % 7)) },
        { label: 'Conversion', value: `${conv.toFixed(2)}%`, d: 0.4, data: now.map((v, i) => 4 + Math.sin(i / 3) * 0.4 + (v % 9) / 18) },
        { label: 'MRR', value: `$${num.format(mrr)}`, d: 6.8, data: now.map((_, i) => 100 + i * 2 + (i % 4)) },
      ];

      kpis.innerHTML = cards.map((k, i) => `
        <div class="kpi">
          <span class="kpi__label">${k.label}</span>
          <strong class="kpi__value">${k.value}</strong>
          <span class="delta ${k.d >= 0 ? 'delta--up' : 'delta--down'}"><svg class="icon"><use href="#i-${k.d >= 0 ? 'up' : 'down'}"/></svg>${Math.abs(k.d).toFixed(1)}%<span class="sr-only"> ${k.d >= 0 ? 'increase' : 'decrease'}</span></span>
          <span class="kpi__spark" data-spark="${i}"></span>
        </div>`).join('');
      cards.forEach((k, i) => spark($(`[data-spark="${i}"]`, kpis), k.data, k.d >= 0 ? c1 : css(document.documentElement, '--color-danger')));

      const data = {
        labels,
        caption: `Visitors per day, last ${days} days`,
        format: (v, axis) => (axis ? compact.format(v) : num.format(Math.round(v))),
        series: [{ name: 'This period', values: now, color: c1 }, { name: 'Previous', values: prev, color: c2, dashed: true }],
      };
      if (traffic) traffic(data);
      else traffic = area($('[data-traffic]', root), data);

      label.textContent = `Last ${days} days vs previous ${days} days`;
      pages.innerHTML = PAGES.map(([path, share]) => {
        const v = Math.round(visitors * 0.31 * share);
        return `<tr><th scope="row" style="--p:${share}"><span>${path}</span></th><td>${num.format(v)}</td></tr>`;
      }).join('');
    }

    root.addEventListener('change', (e) => { if (e.target.name === 'range') render(Number(e.target.value)); });
    render(30);
  })();

  /* ======================================================================
     02 · Ember: tonight's service
     ====================================================================== */
  (() => {
    const root = $('[data-service]');
    const floor = $('[data-floor]', root);
    const legend = $('[data-floor-legend]', root);
    const STATES = ['free', 'seated', 'bill'];
    const LABELS = { free: 'Free', seated: 'Seated', bill: 'Bill requested', reserved: 'Reserved' };
    const TABLES = [
      [1, 2, 'seated', true], [2, 2, 'free', true], [3, 4, 'seated'], [4, 4, 'bill'], [5, 6, 'reserved'], [6, 2, 'free', true],
      [7, 4, 'seated'], [8, 4, 'free'], [9, 2, 'seated', true], [10, 6, 'seated'], [11, 2, 'free', true], [12, 4, 'reserved'],
    ];

    $('[data-service-date]', root).textContent = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

    floor.innerHTML = TABLES.map(([n, seats, state, round]) =>
      `<button class="table-btn${round ? ' is-round' : ''}" type="button" data-state="${state}" data-n="${n}" data-seats="${seats}"><strong>T${n}</strong><span>${seats} seats</span></button>`).join('');

    function updateLegend() {
      const counts = { free: 0, seated: 0, bill: 0, reserved: 0 };
      let guests = 0;
      $$('.table-btn', floor).forEach((t) => {
        counts[t.dataset.state] += 1;
        if (t.dataset.state !== 'free' && t.dataset.state !== 'reserved') guests += Number(t.dataset.seats);
        t.setAttribute('aria-label', `Table ${t.dataset.n}, ${t.dataset.seats} seats, ${LABELS[t.dataset.state]}`);
      });
      legend.innerHTML = `<span><b>${counts.seated}</b> seated</span><span><b>${counts.bill}</b> bill</span><span><b>${counts.free}</b> free</span><span><b>${guests}</b> guests in</span>`;
    }

    floor.addEventListener('click', (e) => {
      const t = e.target.closest('.table-btn');
      if (!t) return;
      const i = STATES.indexOf(t.dataset.state);
      t.dataset.state = STATES[(i + 1) % STATES.length]; // reserved tables get seated on first tap
      updateLegend();
    });
    updateLegend();

    const hours = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    const covers = [6, 14, 22, 24, 16, 8];
    const nowIdx = Math.max(0, Math.min(5, new Date().getHours() - 17));
    bars($('[data-covers]', root), {
      labels: hours, values: covers, name: 'Covers', caption: 'Covers booked per hour',
      color: 'oklch(74% 0.15 55 / 0.45)', highlight: nowIdx, highlightColor: 'oklch(74% 0.15 55)',
    });
    $('[data-covers-total]', root).textContent = `${covers.reduce((a, b) => a + b, 0)} covers booked`;

    donut($('[data-target]', root), {
      caption: 'Revenue so far vs target',
      segments: [{ label: 'Taken so far', value: 3720, color: 'oklch(74% 0.15 55)' }, { label: 'Still to go', value: 2280, color: 'oklch(30% 0.016 50)' }],
      center: { value: '£3,720', label: '62% of target' },
    });
  })();

  /* ======================================================================
     03 · Forma: agent pipeline
     ====================================================================== */
  (() => {
    const root = $('[data-pipeline]');
    const agenda = $('[data-agenda]', root);
    const left = $('[data-agenda-left]', root);
    const update = () => {
      const remaining = $$('input:not(:checked)', agenda).length;
      left.textContent = remaining ? `${remaining} remaining` : 'All done 🎉';
    };
    agenda.addEventListener('change', update);
    update();

    bars($('[data-listing-views]', root), {
      labels: ['Villa Solvej', 'Linde', 'Havn', 'Strandvej', 'Kildevej', 'Parkvej'],
      values: [412, 268, 587, 191, 143, 236],
      name: 'Views', caption: 'Views per listing, last 7 days',
      color: css(root, '--color-accent-soft') || 'oklch(55% 0.14 42 / 0.3)',
      highlight: 2, highlightColor: css(root, '--color-accent'),
    });
  })();

  /* ======================================================================
     04 · Forge: member progress
     ====================================================================== */
  (() => {
    const root = $('[data-member]');
    const heat = $('[data-heat]', root);
    const DAYS = 84;
    let seed = 42;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const levels = Array.from({ length: DAYS }, (_, i) => {
      const r = rand();
      const recent = i > DAYS - 15 ? 0.25 : 0;
      return r + recent > 0.82 ? 3 : r + recent > 0.62 ? 2 : r + recent > 0.45 ? 1 : 0;
    });
    // Ensure a current streak for the demo
    for (let i = DAYS - 6; i < DAYS; i++) levels[i] = Math.max(1, levels[i]);

    const fmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    const words = ['Rest day', '1 class', '2 classes', 'Class + PT session'];
    heat.innerHTML = levels.map((l, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (DAYS - 1 - i));
      return `<span data-l="${l}" title="${fmt.format(d)}: ${words[l]}"></span>`;
    }).join('');

    let streak = 0;
    for (let i = DAYS - 1; i >= 0 && levels[i] > 0; i--) streak++;
    const month = levels.slice(-30).filter(Boolean).length; // active days in the last 30
    heat.setAttribute('aria-label', `Activity over the last 12 weeks: ${levels.filter(Boolean).length} active days, current streak ${streak} days.`);
    $('[data-streak]', root).textContent = streak;
    $('[data-month-classes]', root).textContent = month;

    area($('[data-lift]', root), {
      labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      caption: 'Best deadlift per month in kilograms',
      format: (v) => `${Math.round(v)} kg`,
      series: [{ name: 'Deadlift', values: [95, 105, 112, 120, 132, 140], color: 'oklch(91% 0.21 125)' }],
    });

    const booking = $('[data-booking]', root);
    booking.addEventListener('click', () => {
      const booked = booking.getAttribute('aria-pressed') === 'true';
      booking.setAttribute('aria-pressed', String(!booked));
      booking.textContent = booked ? 'Book again (6 spots left)' : 'Booked ✓ · Cancel';
    });
  })();

  /* ======================================================================
     05 · Sentinel: live security operations
     ====================================================================== */
  (() => {
    const root = $('[data-soc]');
    const list = $('[data-alerts]', root);
    const openCount = $('[data-open-count]', root);
    const summary = $('[data-soc-summary]', root);
    const pauseBtn = $('[data-soc-pause]', root);
    const legend = $('[data-sev-legend]', root);
    const SEV = { critical: 4, high: 11, medium: 27, low: 58 };
    const COLORS = { critical: css(root, '--crit'), high: css(root, '--high'), medium: css(root, '--med'), low: css(root, '--low') };
    const EVENTS = [
      ['critical', 'Ransomware signature on fin-laptop-12', 'EDR · Copenhagen'],
      ['high', 'Impossible travel: j.lind signed in from 2 countries', 'Identity'],
      ['medium', 'Port scan from 185.220.101.4', 'Firewall · edge-02'],
      ['low', 'New admin token created', 'Audit log'],
      ['high', 'Brute-force on VPN gateway', 'Network · vpn-01'],
      ['medium', 'Outdated TLS on staging API', 'Scanner'],
      ['low', 'MFA reset requested', 'Identity'],
      ['critical', 'Data exfiltration pattern to unknown host', 'DLP · db-02'],
    ];
    let paused = false;
    let visible = true;
    let next = 0;

    const sevChart = donut($('[data-severity]', root), { caption: 'Alerts by severity, last 24 hours', segments: [] });

    function renderSeverity() {
      const segments = Object.entries(SEV).map(([k, v]) => ({ label: k[0].toUpperCase() + k.slice(1), value: v, color: COLORS[k] }));
      const total = segments.reduce((s, x) => s + x.value, 0);
      sevChart({ caption: 'Alerts by severity, last 24 hours', segments, center: { value: String(total), label: 'alerts · 24h' } });
      legend.innerHTML = segments.map((s) => `<li><i style="background:${s.color}"></i>${s.label}<b>${s.value}</b></li>`).join('');
    }

    function counts() {
      const open = $$('.alert:not(.is-ack)', list).length;
      openCount.textContent = `${open} open`;
      summary.textContent = `${open} open · ${SEV.critical} critical today · median response 4m`;
    }

    function addAlert(initial = false) {
      const [sev, title, source] = EVENTS[next % EVENTS.length];
      next += 1;
      const li = document.createElement('li');
      li.className = 'alert';
      li.dataset.sev = sev;
      const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      li.innerHTML = `<span class="alert__sev">${sev}</span><span class="alert__text"><strong></strong><small>${time} · ${source}</small></span><button class="alert__ack" type="button">Acknowledge</button>`;
      $('strong', li).textContent = title;
      $('button', li).setAttribute('aria-label', `Acknowledge: ${title}`);
      list.prepend(li);
      while (list.children.length > 6) list.lastElementChild.remove();
      if (!initial) {
        SEV[sev] += 1;
        renderSeverity();
      }
      counts();
    }

    list.addEventListener('click', (e) => {
      const btn = e.target.closest('.alert__ack');
      if (!btn) return;
      const alert = btn.closest('.alert');
      alert.classList.add('is-ack');
      btn.textContent = 'Acknowledged ✓';
      btn.disabled = true;
      counts();
    });

    pauseBtn.addEventListener('click', () => {
      paused = !paused;
      pauseBtn.setAttribute('aria-pressed', String(paused));
      $('span', pauseBtn).textContent = paused ? 'Resume feed' : 'Pause feed';
      $('use', pauseBtn).setAttribute('href', paused ? '#i-play' : '#i-pause');
    });

    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(root);
    setInterval(() => { if (!paused && visible && !document.hidden) addAlert(); }, 4000);

    for (let i = 0; i < 4; i++) addAlert(true);
    renderSeverity();
  })();

  /* ======================================================================
     06 · Nova: online shop admin
     ====================================================================== */
  (() => {
    const root = $('[data-shopadmin]');
    const values = series(11, 14, 820, 260, 8);
    const labels = values.map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (values.length - 1 - i));
      return d.toLocaleDateString('en-GB', { day: 'numeric' });
    });
    const eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
    bars($('[data-revenue]', root), {
      labels, values, name: 'Revenue', caption: 'Revenue per day, last 14 days',
      format: (v, axis) => (axis ? `€${compact.format(v)}` : eur.format(v)),
      color: 'color-mix(in oklch, var(--c1) 35%, transparent)', highlight: values.length - 1, highlightColor: css(root, '--c1'),
    });

    const rows = $$('[data-orders] tr', root);
    const empty = $('[data-orders-empty]', root);
    $$('[data-order-filter] button', root).forEach((btn, _, all) => {
      btn.addEventListener('click', () => {
        all.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        let shown = 0;
        rows.forEach((r) => {
          r.hidden = !(btn.dataset.status === 'all' || r.dataset.status === btn.dataset.status);
          if (!r.hidden) shown += 1;
        });
        empty.hidden = shown > 0;
      });
    });

    $$('[data-reorder]', root).forEach((btn) => {
      btn.addEventListener('click', () => {
        const li = btn.closest('li');
        li.classList.add('is-ordered');
        $('.stock__bar', li).style.setProperty('--p', 1);
        $('small', li).textContent = '50 on order · arrives Thursday';
        btn.textContent = 'Ordered ✓';
        btn.disabled = true;
      });
    });
  })();
})();
