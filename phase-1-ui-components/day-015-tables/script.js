/*!
 * Thecore · 100 Days of Web Development
 * Day 015: Tables
 *
 * Every table is a real <table> built from a small data array, so
 * swapping the demo data for an API response later is a one-line change.
 */
(() => {
  'use strict';

  const { $, $$ } = window.Thecore;

  const escape = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });
  const gbp2 = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 });
  const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const initials = (n) => n.split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

  function focusSoon(el, tries = 10) {
    if (!el) return;
    el.focus({ preventScroll: true });
    if (document.activeElement !== el && tries > 0) requestAnimationFrame(() => focusSoon(el, tries - 1));
  }

  /* CSV: quote every field that needs it, then hand the file to the browser. */
  const csvCell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  function downloadCsv(filename, rows) {
    const text = rows.map((r) => r.map(csvCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['﻿', text], { type: 'text/csv;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: filename });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function toast(root, message, action) {
    const el = $('[data-toast]', root);
    clearTimeout(el._t);
    el.textContent = '';
    el.append(Object.assign(document.createElement('span'), { textContent: message }));
    if (action) {
      const b = Object.assign(document.createElement('button'), { type: 'button', textContent: action.label });
      b.addEventListener('click', () => { el.hidden = true; action.run(); });
      el.append(b);
    }
    el.hidden = false;
    el._t = setTimeout(() => { el.hidden = true; }, action ? 6000 : 3000);
  }

  /* ======================================================================
     01 · Lumen: sortable data table
     ====================================================================== */
  (() => {
    const root = $('[data-customers]');
    const body = $('[data-cust-body]', root);
    const q = $('[data-cust-q]', root);
    const statusSel = $('[data-cust-status]', root);
    const all = $('[data-select-all]', root);
    const bulk = $('[data-bulk]', root);
    const info = $('[data-pager-info]', root);
    const nav = $('[data-pager-nav]', root);
    const PER_PAGE = 8;

    const NAMES = ['Aisha Khan', 'Ben Carter', 'Chloé Martin', 'Daniel Okafor', 'Elena Rossi', 'Finn Larsen', 'Grace Liu', 'Hugo Silva',
      'Isla Murray', 'Jonas Weber', 'Kavya Iyer', 'Leo Moreau', 'Maya Cohen', 'Noah Becker', 'Olivia Brown', 'Priya Nair',
      'Quentin Dubois', 'Rosa García', 'Sam Taylor', 'Tara Walsh', 'Umar Farooq', 'Vera Novak', 'Will Harper', 'Ximena Ruiz',
      'Yuki Tanaka', 'Zara Ahmed', 'Arjun Mehta', 'Bea Lindqvist'];
    const PLANS = { Starter: 19, Pro: 49, Business: 129 };
    const STATUS = ['Active', 'Active', 'Active', 'Trial', 'Active', 'Past due', 'Active', 'Cancelled'];
    const STATUS_C = { Active: 'c-ok', Trial: 'c-info', 'Past due': 'c-warn', Cancelled: 'c-mute' };

    let rows = NAMES.map((name, i) => {
      const plan = Object.keys(PLANS)[(i * 7) % 3];
      const status = STATUS[(i * 5) % STATUS.length];
      const seats = 1 + ((i * 13) % 9);
      return {
        id: i + 1,
        name,
        email: `${name.split(' ')[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}@${['acme.co', 'northwind.io', 'globex.com', 'initech.dev'][i % 4]}`,
        plan,
        status,
        mrr: status === 'Cancelled' || status === 'Trial' ? 0 : PLANS[plan] * seats,
        joined: new Date(2025, (i * 5) % 12, 1 + ((i * 11) % 27)),
        h: (i * 37) % 360,
      };
    });
    let sort = { key: 'mrr', dir: 'desc' };
    let page = 1;
    const selected = new Set();

    const compare = (a, b) => {
      const k = sort.key;
      const v = typeof a[k] === 'string' ? a[k].localeCompare(b[k]) : a[k] - b[k];
      return sort.dir === 'asc' ? v : -v;
    };

    function view() {
      const term = q.value.trim().toLowerCase();
      return rows
        .filter((r) => (!statusSel.value || r.status === statusSel.value) && (!term || `${r.name} ${r.email}`.toLowerCase().includes(term)))
        .sort(compare);
    }

    function render(focusPage) {
      const list = view();
      const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
      page = Math.min(page, pages);
      const start = (page - 1) * PER_PAGE;
      const shown = list.slice(start, start + PER_PAGE);

      body.innerHTML = shown.length ? shown.map((r) => `
        <tr class="${selected.has(r.id) ? 'is-selected' : ''}">
          <td class="col-check"><input type="checkbox" class="cb" data-id="${r.id}" aria-label="Select ${escape(r.name)}" ${selected.has(r.id) ? 'checked' : ''}></td>
          <td><div class="who"><span class="avatar" style="--h:${r.h}" aria-hidden="true">${initials(r.name)}</span><div><strong>${escape(r.name)}</strong><small>${r.email}</small></div></div></td>
          <td class="hide-sm">${r.plan}</td>
          <td><span class="badge-s ${STATUS_C[r.status]}">${r.status}</span></td>
          <td class="num">${r.mrr ? gbp.format(r.mrr) : '<span class="muted">£0</span>'}</td>
          <td class="hide-md">${day.format(r.joined)}</td>
        </tr>`).join('')
        : '<tr class="empty-row"><td colspan="6">No customers match. Try another search or status.</td></tr>';

      // Header checkbox: checked, unchecked or "some" (indeterminate) for this page.
      const onPage = shown.filter((r) => selected.has(r.id)).length;
      all.checked = shown.length > 0 && onPage === shown.length;
      all.indeterminate = onPage > 0 && onPage < shown.length;
      all.disabled = !shown.length;

      bulk.hidden = !selected.size;
      $('[data-bulk-count]', root).textContent = `${selected.size} selected`;
      $('[data-cust-total]', root).textContent = `${rows.length} customers · ${gbp.format(rows.reduce((s, r) => s + r.mrr, 0))} MRR`;

      info.textContent = list.length ? `Showing ${start + 1}–${start + shown.length} of ${list.length}` : 'No results';
      let html = `<button type="button" data-page="${page - 1}" aria-label="Previous page" ${page === 1 ? 'disabled' : ''}><svg class="icon" aria-hidden="true"><use href="#i-chevron-left"/></svg></button>`;
      for (let p = 1; p <= pages; p++) html += `<button type="button" data-page="${p}" aria-label="Page ${p}" ${p === page ? 'aria-current="page"' : ''}>${p}</button>`;
      html += `<button type="button" data-page="${page + 1}" aria-label="Next page" ${page === pages ? 'disabled' : ''}><svg class="icon" aria-hidden="true"><use href="#i-chevron-right"/></svg></button>`;
      nav.innerHTML = html;
      if (focusPage) ($(`[data-page="${focusPage}"]:not(:disabled)`, nav) || $('[aria-current="page"]', nav)).focus();

      $$('th[aria-sort]', root).forEach((th) => {
        const key = $('[data-sort]', th).dataset.sort;
        const state = key === sort.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none';
        th.setAttribute('aria-sort', state);
        $('use', th).setAttribute('href', state === 'ascending' ? '#i-up' : state === 'descending' ? '#i-down' : '#i-sort');
      });
    }

    $$('[data-sort]', root).forEach((b) => b.addEventListener('click', () => {
      const key = b.dataset.sort;
      const numeric = key === 'mrr' || key === 'joined';
      sort = sort.key === key ? { key, dir: sort.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: numeric ? 'desc' : 'asc' };
      page = 1;
      render();
    }));

    q.addEventListener('input', () => { page = 1; render(); });
    statusSel.addEventListener('change', () => { page = 1; render(); });

    nav.addEventListener('click', (e) => {
      const b = e.target.closest('[data-page]');
      if (!b || b.disabled) return;
      const label = b.getAttribute('aria-label');
      const isArrow = /Previous|Next/.test(label);
      page = Number(b.dataset.page);
      render(isArrow ? null : String(page));
      // Keep focus on the arrow pressed; if it just became disabled, use the current page.
      if (isArrow) ($(`[aria-label="${label}"]:not(:disabled)`, nav) || $('[aria-current="page"]', nav)).focus();
    });

    body.addEventListener('change', (e) => {
      const cb = e.target.closest('[data-id]');
      if (!cb) return;
      const id = Number(cb.dataset.id);
      if (cb.checked) selected.add(id); else selected.delete(id);
      render();
      $(`[data-id="${id}"]`, body)?.focus();
    });

    all.addEventListener('change', () => {
      const list = view();
      const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);
      const select = all.checked;
      shown.forEach((r) => (select ? selected.add(r.id) : selected.delete(r.id)));
      render();
    });

    $('[data-bulk-clear]', root).addEventListener('click', () => { selected.clear(); render(); all.focus(); });

    $('[data-bulk-export]', root).addEventListener('click', () => {
      const chosen = rows.filter((r) => selected.has(r.id));
      downloadCsv('lumen-customers.csv', [['Name', 'Email', 'Plan', 'Status', 'MRR (GBP)', 'Joined'],
        ...chosen.map((r) => [r.name, r.email, r.plan, r.status, r.mrr, r.joined.toISOString().slice(0, 10)])]);
      toast(root, `Exported ${chosen.length} ${chosen.length === 1 ? 'customer' : 'customers'} to CSV`);
    });

    $('[data-bulk-delete]', root).addEventListener('click', () => {
      const before = rows;
      const n = selected.size;
      rows = rows.filter((r) => !selected.has(r.id));
      selected.clear();
      render();
      q.focus();
      toast(root, `Deleted ${n} ${n === 1 ? 'customer' : 'customers'}`, { label: 'Undo', run: () => { rows = before; render(); } });
    });

    render();
  })();

  /* ======================================================================
     02 · Halden: responsive invoices
     ====================================================================== */
  (() => {
    const root = $('[data-invoices]');
    const body = $('[data-inv-body]', root);
    const tabs = $$('[data-itabs] button', root);
    let filter = '';

    const invoices = [
      ['INV-2041', 'Nordlys AS', '2026-08-02', '2026-09-01', 'Paid', 12400, '2026-08-28'],
      ['INV-2042', 'Museum of Light', '2026-08-15', '2026-09-14', 'Overdue', 8600],
      ['INV-2043', 'Fjord & Co.', '2026-09-01', '2026-10-01', 'Paid', 4250, '2026-09-30'],
      ['INV-2044', 'Ashby Print', '2026-09-05', '2026-10-05', 'Overdue', 1980],
      ['INV-2045', 'Nakamura Labs', '2026-09-18', '2026-10-18', 'Due', 15200],
      ['INV-2046', 'Studio Moreau', '2026-09-24', '2026-10-24', 'Due', 3600],
      ['INV-2047', 'Nordlys AS', '2026-10-01', '2026-10-31', 'Due', 9800],
    ].map(([id, client, issued, due, status, amount, paid]) => ({ id, client, issued: new Date(issued), due: new Date(due), status, amount, paid: paid && new Date(paid), reminded: false }));

    const C = { Paid: 'c-ok', Due: 'c-info', Overdue: 'c-bad' };

    function render(flashId) {
      const list = invoices.filter((i) => !filter || i.status === filter);
      body.innerHTML = list.length ? list.map((i) => `
        <tr data-row="${i.id}" class="${i.id === flashId ? 'is-flash' : ''}">
          <td data-label="Invoice"><span class="inv-id">${i.id}</span></td>
          <td data-label="Client">${escape(i.client)}</td>
          <td data-label="Issued">${day.format(i.issued)}</td>
          <td data-label="Due">${day.format(i.due)}</td>
          <td data-label="Status"><span class="badge-s ${C[i.status]}">${i.status}</span></td>
          <td data-label="Amount" class="num">${gbp2.format(i.amount)}</td>
          <td>${i.status === 'Paid'
            ? `<span class="muted">Paid ${day.format(i.paid)}</span>`
            : `<button type="button" class="row-btn" data-remind="${i.id}" ${i.reminded ? 'disabled' : ''} aria-label="${i.reminded ? `Reminder sent for ${i.id}` : `Send reminder for ${i.id}`}">${i.reminded ? '✓ Reminder sent' : 'Remind'}</button><button type="button" class="row-btn" data-pay="${i.id}" aria-label="Mark ${i.id} as paid">Mark paid</button>`}</td>
        </tr>`).join('')
        : `<tr class="empty-row"><td colspan="7">No ${filter.toLowerCase()} invoices. Nice.</td></tr>`;

      tabs.forEach((t) => {
        const n = invoices.filter((i) => !t.dataset.f || i.status === t.dataset.f).length;
        $('span', t).textContent = n;
        t.setAttribute('aria-pressed', String(t.dataset.f === filter));
      });
      $('[data-outstanding]', root).textContent = gbp2.format(invoices.filter((i) => i.status !== 'Paid').reduce((s, i) => s + i.amount, 0));
    }

    tabs.forEach((t) => t.addEventListener('click', () => { filter = t.dataset.f; render(); }));

    body.addEventListener('click', (e) => {
      const remind = e.target.closest('[data-remind]');
      const pay = e.target.closest('[data-pay]');
      if (remind) {
        invoices.find((i) => i.id === remind.dataset.remind).reminded = true;
        render();
        focusSoon($(`[data-pay="${remind.dataset.remind}"]`, body));
      }
      if (pay) {
        const inv = invoices.find((i) => i.id === pay.dataset.pay);
        inv.status = 'Paid';
        inv.paid = new Date();
        render(inv.id);
        // The button is gone now; keep focus nearby.
        focusSoon($('[data-remind]:not(:disabled), [data-pay]', body) || tabs.find((t) => t.getAttribute('aria-pressed') === 'true'));
      }
    });

    render();
  })();

  /* ======================================================================
     03 · Forge: class timetable
     ====================================================================== */
  (() => {
    const root = $('[data-timetable]');
    const head = $('[data-tt-head]', root);
    const body = $('[data-tt-body]', root);
    const bookedEl = $('[data-booked]', root);
    const filters = $$('[data-tt-filters] button', root);

    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const LONG = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const TIMES = ['07:00', '09:30', '12:30', '17:30', '19:00'];
    const CLASSES = {
      '0-0': ['Strength 45', 'strength', 'Sam', 3], '0-3': ['HIIT Burn', 'cardio', 'Lea', 6], '0-4': ['Yoga Flow', 'mind', 'Ana', 10],
      '1-1': ['Mobility', 'mind', 'Ana', 8], '1-2': ['Spin Express', 'cardio', 'Kai', 4], '1-4': ['Barbell Club', 'strength', 'Sam', 2],
      '2-0': ['HIIT Burn', 'cardio', 'Lea', 5], '2-3': ['Strength 45', 'strength', 'Tom', 7], '2-4': ['Breathwork', 'mind', 'Ana', 12],
      '3-1': ['Kettlebells', 'strength', 'Tom', 6], '3-2': ['Spin Express', 'cardio', 'Kai', 0], '3-3': ['Yoga Flow', 'mind', 'Ana', 9],
      '4-0': ['Strength 45', 'strength', 'Sam', 4], '4-3': ['Boxing Fit', 'cardio', 'Lea', 3], '4-4': ['Pilates', 'mind', 'Mia', 7],
      '5-1': ['Barbell Club', 'strength', 'Tom', 5], '5-2': ['Park Run Club', 'cardio', 'Kai', 20],
      '6-1': ['Slow Sunday Yoga', 'mind', 'Ana', 14], '6-2': ['Open Gym Intro', 'strength', 'Sam', 6],
    };
    const state = Object.fromEntries(Object.entries(CLASSES).map(([k, [name, type, coach, spots]]) => [k, { name, type, coach, spots, booked: false }]));
    const today = (new Date().getDay() + 6) % 7;
    const monday = new Date();
    monday.setDate(monday.getDate() - today);
    const short = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });

    head.innerHTML = `<tr><th scope="col">Time</th>${DAYS.map((d, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return `<th scope="col" class="${i === today ? 'is-today' : ''}" ${i === today ? 'aria-current="date"' : ''}><abbr title="${LONG[i]}">${d}</abbr><small>${i === today ? 'Today' : short.format(date)}</small></th>`;
    }).join('')}</tr>`;

    function cell(d, t) {
      const k = `${d}-${t}`;
      const c = state[k];
      if (!c) return `<td class="${d === today ? 'is-today' : ''}"></td>`;
      const full = c.spots === 0 && !c.booked;
      return `<td class="${d === today ? 'is-today' : ''}">
        <button type="button" class="klass klass--${c.type}" data-k="${k}" aria-pressed="${c.booked}" ${full ? 'disabled' : ''}>
          <strong>${c.name}</strong><span>with ${c.coach}</span>
          <small>${c.booked ? 'Booked ✓' : full ? 'Full' : `${c.spots} ${c.spots === 1 ? 'spot' : 'spots'} left`}</small>
          <span class="sr-only">, ${LONG[d]} at ${TIMES[t]}</span>
        </button></td>`;
    }

    function render(focusKey) {
      body.innerHTML = TIMES.map((time, t) => `<tr><th scope="row">${time}</th>${DAYS.map((_, d) => cell(d, t)).join('')}</tr>`).join('');
      applyFilter();
      const booked = Object.entries(state).filter(([, c]) => c.booked);
      bookedEl.textContent = booked.length
        ? `${booked.length} ${booked.length === 1 ? 'class' : 'classes'} booked: ${booked.map(([k, c]) => `${c.name} (${DAYS[k.split('-')[0]]})`).join(', ')}`
        : 'No classes booked yet';
      if (focusKey) $(`[data-k="${focusKey}"]`, body)?.focus();
    }

    function applyFilter() {
      const type = filters.find((f) => f.getAttribute('aria-pressed') === 'true').dataset.type;
      $$('.klass', body).forEach((b) => b.classList.toggle('is-dim', type !== 'all' && !b.classList.contains(`klass--${type}`)));
    }

    body.addEventListener('click', (e) => {
      const b = e.target.closest('[data-k]');
      if (!b) return;
      const c = state[b.dataset.k];
      c.booked = !c.booked;
      c.spots += c.booked ? -1 : 1;
      render(b.dataset.k);
    });

    filters.forEach((f) => f.addEventListener('click', () => {
      filters.forEach((x) => x.setAttribute('aria-pressed', String(x === f)));
      applyFilter();
    }));

    render();

    // Start the scroller on today's column on small screens.
    const wrap = $('.twrap--scroll', root);
    requestAnimationFrame(() => {
      const th = $('th.is-today', head);
      if (th && wrap.scrollWidth > wrap.clientWidth) wrap.scrollLeft = th.offsetLeft - 80;
    });
  })();

  /* ======================================================================
     04 · Atlas: editable budget grid
     ====================================================================== */
  (() => {
    const root = $('[data-budget]');
    const table = $('[data-grid]', root);
    const body = $('[data-grid-body]', root);
    const foot = $('[data-grid-foot]', root);
    const live = $('[data-grid-live]', root);
    const meter = $('[data-meter]', root);
    const LIMIT = 400;
    const Q = ['Q1', 'Q2', 'Q3', 'Q4'];

    const data = [
      ['Salaries', [48, 48, 52, 52]],
      ['Office & rent', [12, 12, 12, 12]],
      ['Software', [6, 6, 7, 7]],
      ['Marketing', [10, 14, 18, 24]],
      ['Travel & events', [3, 5, 4, 8]],
    ].map(([name, q]) => ({ name, q, changed: [false, false, false, false] }));
    let pos = { r: 0, c: 0 };
    let editing = null;
    let extra = 0;

    const k = (n) => `£${Number.isInteger(n) ? n : n.toFixed(1)}k`;
    const sum = (a) => a.reduce((s, v) => s + v, 0);

    function render() {
      body.innerHTML = data.map((row, r) => `
        <tr>
          <th scope="row">${escape(row.name)}</th>
          ${row.q.map((v, c) => `<td class="cell${row.changed[c] ? ' is-changed' : ''}" role="gridcell" tabindex="-1" data-r="${r}" data-c="${c}" aria-label="${escape(row.name)}, ${Q[c]}: ${k(v)}">${k(v)}</td>`).join('')}
          <td class="num total">${k(sum(row.q))}</td>
        </tr>`).join('');
      const cols = Q.map((_, c) => sum(data.map((row) => row.q[c])));
      const total = sum(cols);
      foot.innerHTML = `<tr><th scope="row">Total</th>${cols.map((v) => `<td class="num">${k(v)}</td>`).join('')}<td class="num">${k(total)}</td></tr>`;

      $('[data-planned]', meter).textContent = k(total);
      $('.budget-meter__bar', meter).style.setProperty('--p', `${Math.min(100, (total / LIMIT) * 100)}%`);
      meter.classList.toggle('is-over', total > LIMIT);
      $('[data-left]', meter).textContent = total > LIMIT ? `${k(total - LIMIT)} over budget` : `${k(LIMIT - total)} left`;
      activate(pos.r, pos.c, false);
    }

    const cellAt = (r, c) => $(`[data-r="${r}"][data-c="${c}"]`, body);

    // Roving tabindex: exactly one cell is tabbable; arrows move it.
    function activate(r, c, focus = true) {
      pos = { r: Math.max(0, Math.min(data.length - 1, r)), c: Math.max(0, Math.min(3, c)) };
      $$('.cell', body).forEach((el) => { el.tabIndex = -1; el.classList.remove('is-active'); });
      const el = cellAt(pos.r, pos.c);
      el.tabIndex = 0;
      el.classList.add('is-active');
      if (focus) el.focus();
    }

    function startEdit(initial) {
      const el = cellAt(pos.r, pos.c);
      const old = data[pos.r].q[pos.c];
      const input = Object.assign(document.createElement('input'), {
        type: 'text',
        inputMode: 'decimal',
        value: initial ?? String(old),
      });
      input.setAttribute('aria-label', `${data[pos.r].name}, ${Q[pos.c]}, in thousands of pounds`);
      el.append(input);
      editing = { el, input, old };
      input.focus();
      if (initial === undefined) input.select();
      input.addEventListener('blur', () => { if (editing?.input === input) commit(); });
    }

    function commit(move) {
      if (!editing) return true;
      const { el, input, old } = editing;
      const raw = input.value.replace(/[£k,\s]/gi, '');
      const v = raw === '' ? 0 : Number(raw);
      if (!Number.isFinite(v) || v < 0 || v > 9999) {
        el.classList.add('is-invalid');
        live.textContent = 'Please enter a number between 0 and 9999.';
        input.focus();
        return false;
      }
      editing = null;
      const value = Math.round(v * 10) / 10;
      const row = data[pos.r];
      if (value !== old) { row.q[pos.c] = value; row.changed[pos.c] = true; }
      render();
      live.textContent = `${row.name} ${Q[pos.c]} set to ${k(value)}. Row total ${k(sum(row.q))}.`;
      if (move) activate(pos.r + move.r, pos.c + move.c); else activate(pos.r, pos.c);
      return true;
    }

    function cancel() {
      if (!editing) return;
      const { input, el } = editing;
      editing = null; // clear first, so the blur fired by removing the input doesn't save it
      input.remove();
      el.classList.remove('is-invalid');
      activate(pos.r, pos.c);
      live.textContent = 'Edit cancelled.';
    }

    table.addEventListener('keydown', (e) => {
      if (editing) {
        if (e.key === 'Enter') { e.preventDefault(); commit({ r: e.shiftKey ? -1 : 1, c: 0 }); }
        else if (e.key === 'Tab') { e.preventDefault(); commit({ r: 0, c: e.shiftKey ? -1 : 1 }); }
        else if (e.key === 'Escape') { e.preventDefault(); cancel(); }
        return;
      }
      if (!e.target.classList.contains('cell')) return;
      const moves = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
      if (moves[e.key]) { e.preventDefault(); activate(pos.r + moves[e.key][0], pos.c + moves[e.key][1]); }
      else if (e.key === 'Home') { e.preventDefault(); activate(e.ctrlKey ? 0 : pos.r, 0); }
      else if (e.key === 'End') { e.preventDefault(); activate(e.ctrlKey ? data.length - 1 : pos.r, 3); }
      else if (e.key === 'Enter' || e.key === 'F2') { e.preventDefault(); startEdit(); }
      else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); startEdit(''); }
      else if (/^[0-9.]$/.test(e.key) && !e.ctrlKey && !e.metaKey) { e.preventDefault(); startEdit(e.key); }
    });

    body.addEventListener('mousedown', (e) => {
      const el = e.target.closest('.cell');
      if (!el || e.target.tagName === 'INPUT') return;
      if (editing && !commit()) { e.preventDefault(); return; }
      e.preventDefault();
      const r = Number(el.dataset.r);
      const c = Number(el.dataset.c);
      if (r === pos.r && c === pos.c && document.activeElement === el) startEdit(); // second click edits
      else activate(r, c);
    });
    body.addEventListener('dblclick', (e) => { if (e.target.closest('.cell') && !editing) startEdit(); });

    $('[data-add-row]', root).addEventListener('click', () => {
      extra += 1;
      data.push({ name: extra === 1 ? 'Other' : `Other ${extra}`, q: [0, 0, 0, 0], changed: [false, false, false, false] });
      pos = { r: data.length - 1, c: 0 };
      render();
      activate(pos.r, 0);
      live.textContent = `Added a row: ${data[pos.r].name}.`;
    });

    render();
  })();

  /* ======================================================================
     05 · Nova: expandable order rows
     ====================================================================== */
  (() => {
    const root = $('[data-orders]');
    const body = $('[data-orders-body]', root);
    const expandAll = $('[data-expand-all]', root);
    const STEPS = ['Placed', 'Paid', 'Packed', 'Shipped', 'Delivered'];
    const C = { Processing: 'c-warn', Shipped: 'c-info', Delivered: 'c-ok', Cancelled: 'c-mute' };

    const orders = [
      ['#10482', 'Aisha Khan', '4 Oct 2026', 'Processing', 2, [['Cloudstride running shoe', 1, 120, 210], ['Merino running socks (3)', 2, 24, 300]], '14 Rye Lane, London SE15 5AR'],
      ['#10481', 'Jonas Weber', '3 Oct 2026', 'Shipped', 3, [['Leather tote', 1, 165, 45]], 'Torstraße 88, 10119 Berlin'],
      ['#10479', 'Grace Liu', '2 Oct 2026', 'Delivered', 4, [['Roll-top backpack', 1, 110, 230], ['Running cap', 1, 28, 160]], '22 Queen St, Edinburgh EH2 1JX'],
      ['#10476', 'Leo Moreau', '1 Oct 2026', 'Processing', 1, [['Polarised sunglasses', 1, 89, 200]], '5 Rue Oberkampf, 75011 Paris'],
      ['#10471', 'Priya Nair', '29 Sep 2026', 'Delivered', 4, [['Suede chelsea boot', 1, 180, 50], ['Leather belt', 1, 48, 35], ['Minimalist leather wallet', 1, 55, 40]], '9 Park Row, Bristol BS1 5LJ'],
      ['#10468', 'Sam Taylor', '28 Sep 2026', 'Cancelled', 1, [['Trail runner GTX', 1, 145, 140]], '31 Mill Rd, Cambridge CB1 2AD'],
    ].map(([id, customer, date, status, step, items, address]) => ({ id, customer, date, status, step, items, address, open: false }));

    const total = (o) => o.items.reduce((s, [, q, p]) => s + q * p, 0);
    const key = (o) => o.id.slice(1);

    function rowHtml(o) {
      const k = key(o);
      const n = o.items.reduce((s, [, q]) => s + q, 0);
      const action = o.status === 'Processing' ? `<button class="btn btn--primary btn--sm" type="button" data-ship="${k}">Mark as shipped</button>`
        : o.status === 'Shipped' ? `<button class="btn btn--primary btn--sm" type="button" data-deliver="${k}">Mark as delivered</button>` : '';
      return `
        <tr class="${o.open ? 'is-open' : ''}" data-order="${k}">
          <td class="col-check"><button class="expander" type="button" aria-expanded="${o.open}" aria-controls="od-${k}" aria-label="Details for order ${o.id}" data-toggle="${k}"><svg class="icon" aria-hidden="true"><use href="#i-chevron-right"/></svg></button></td>
          <td><span class="order-id">${o.id}</span><span class="order-date">${o.date} · ${n} ${n === 1 ? 'item' : 'items'}</span></td>
          <td class="hide-sm">${escape(o.customer)}</td>
          <td><span class="badge-s ${C[o.status]}">${o.status}</span></td>
          <td class="num">${gbp2.format(total(o))}</td>
        </tr>
        <tr class="detail-row" id="od-${k}" ${o.open ? '' : 'hidden'}>
          <td colspan="5">
            <div class="detail">
              <div>
                <h4>Items</h4>
                <ul class="items" role="list">${o.items.map(([name, q, p, h]) => `<li><span class="sw" style="--h:${h}" aria-hidden="true"></span><span>${escape(name)} <span class="muted">× ${q}</span></span><b>${gbp2.format(q * p)}</b></li>`).join('')}</ul>
                <h4 style="margin-top:1rem">Deliver to</h4>
                <address class="addr">${escape(o.customer)}<br>${escape(o.address)}</address>
              </div>
              <div>
                <h4>Progress</h4>
                <ol class="timeline">${o.status === 'Cancelled'
                  ? '<li class="is-done">Placed</li><li class="is-done">Cancelled<small>Refunded in full</small></li>'
                  : STEPS.map((s, i) => `<li class="${i <= o.step ? 'is-done' : ''}">${s}${i === o.step ? '<small>Latest update</small>' : ''}</li>`).join('')}</ol>
                <div class="detail__actions">${action}<button class="btn btn--ghost btn--sm" type="button" data-copy="${o.id}">Copy order ID</button></div>
              </div>
            </div>
          </td>
        </tr>`;
    }

    function render() {
      body.innerHTML = orders.map(rowHtml).join('');
      const allOpen = orders.every((o) => o.open);
      expandAll.textContent = allOpen ? 'Collapse all' : 'Expand all';
      expandAll.setAttribute('aria-pressed', String(allOpen));
    }

    body.addEventListener('click', async (e) => {
      const t = e.target.closest('[data-toggle], [data-ship], [data-deliver], [data-copy]');
      if (!t) return;
      if (t.dataset.toggle) {
        const o = orders.find((x) => key(x) === t.dataset.toggle);
        o.open = !o.open;
        render();
        $(`[data-toggle="${key(o)}"]`, body).focus();
      } else if (t.dataset.ship || t.dataset.deliver) {
        const o = orders.find((x) => key(x) === (t.dataset.ship || t.dataset.deliver));
        o.status = t.dataset.ship ? 'Shipped' : 'Delivered';
        o.step = t.dataset.ship ? 3 : 4;
        render();
        focusSoon($(`[data-deliver="${key(o)}"]`, body) || $(`[data-toggle="${key(o)}"]`, body));
      } else if (t.dataset.copy) {
        try { await navigator.clipboard.writeText(t.dataset.copy); } catch (err) { /* clipboard blocked: label still confirms intent */ }
        t.textContent = 'Copied';
        setTimeout(() => { if (t.isConnected) t.textContent = 'Copy order ID'; }, 1600);
      }
    });

    expandAll.addEventListener('click', () => {
      const open = !orders.every((o) => o.open);
      orders.forEach((o) => { o.open = open; });
      render();
    });

    render();
  })();

  /* ======================================================================
     06 · Ember: configurable report
     ====================================================================== */
  (() => {
    const root = $('[data-report]');
    const table = $('[data-report-table]', root);
    const head = $('[data-report-head]', root);
    const body = $('[data-report-body]', root);
    const foot = $('[data-report-foot]', root);
    const menuBtn = $('[data-colmenu-btn]', root);
    const menu = $('[data-colmenu-pop]', root);
    const status = $('[data-report-status]', root);

    const DISHES = [
      ['Short rib, bone marrow', 'Mains', 412, 28, 4.9, 61], ['Charred hispi cabbage', 'Small plates', 538, 14, 4.7, 74],
      ['Wood-fired hake', 'Mains', 296, 24, 4.6, 58], ['Burnt honey tart', 'Desserts', 471, 9, 4.8, 79],
      ['Beef tartare', 'Small plates', 254, 16, 4.5, 63], ['Lamb shoulder (to share)', 'Mains', 133, 62, 4.9, 55],
      ['Crispy potatoes', 'Sides', 702, 6, 4.6, 84], ['Seasonal greens', 'Sides', 389, 5, 4.2, 81],
      ['Burrata, blood orange', 'Small plates', 344, 13, 4.4, 68], ['Mushroom risotto', 'Mains', 218, 19, 4.3, 70],
      ['Chocolate fondant', 'Desserts', 305, 10, 4.7, 76], ['Sourdough & cultured butter', 'Sides', 811, 5, 4.8, 88],
      ['Scallops, nduja', 'Small plates', 187, 18, 4.6, 52], ['Cheese plate', 'Desserts', 96, 14, 4.1, 47],
      ['Pickled mackerel', 'Small plates', 72, 11, 3.9, 49],
    ].map(([dish, cat, orders, price, rating, margin]) => ({ dish, cat, orders, revenue: orders * price, price, rating, margin }));

    const maxRev = Math.max(...DISHES.map((d) => d.revenue));
    const COLS = [
      { key: 'dish', label: 'Dish', fixed: true, cell: (d) => escape(d.dish), csv: (d) => d.dish },
      { key: 'cat', label: 'Category', cell: (d) => d.cat, csv: (d) => d.cat },
      { key: 'orders', label: 'Orders', num: true, cell: (d) => d.orders.toLocaleString('en-GB'), csv: (d) => d.orders },
      { key: 'revenue', label: 'Revenue', num: true, cell: (d) => `<span class="rev"><i style="--w:${((d.revenue / maxRev) * 100).toFixed(0)}%" aria-hidden="true"></i>${gbp.format(d.revenue)}</span>`, csv: (d) => d.revenue },
      { key: 'price', label: 'Price', num: true, cell: (d) => gbp.format(d.price), csv: (d) => d.price },
      { key: 'rating', label: 'Rating', num: true, cell: (d) => `★ ${d.rating.toFixed(1)}`, csv: (d) => d.rating },
      { key: 'margin', label: 'Margin', num: true, cell: (d) => `<span class="${d.margin < 55 ? 'neg' : ''}">${d.margin}%</span>`, csv: (d) => `${d.margin}%` },
    ];
    const visible = new Set(COLS.map((c) => c.key));

    const tot = {
      orders: DISHES.reduce((s, d) => s + d.orders, 0),
      revenue: DISHES.reduce((s, d) => s + d.revenue, 0),
    };
    tot.rating = DISHES.reduce((s, d) => s + d.rating * d.orders, 0) / tot.orders;
    tot.margin = Math.round(DISHES.reduce((s, d) => s + d.margin * d.revenue, 0) / tot.revenue);
    const TOTAL_CELL = { dish: 'Total', cat: `${DISHES.length} dishes`, orders: tot.orders.toLocaleString('en-GB'), revenue: gbp.format(tot.revenue), price: `avg ${gbp.format(tot.revenue / tot.orders)}`, rating: `★ ${tot.rating.toFixed(1)}`, margin: `${tot.margin}%` };

    // Menu of column checkboxes.
    menu.insertAdjacentHTML('beforeend', COLS.filter((c) => !c.fixed).map((c) => `<label class="check"><input type="checkbox" value="${c.key}" checked>${c.label}</label>`).join(''));

    function render() {
      const cols = COLS.filter((c) => visible.has(c.key));
      head.innerHTML = `<tr>${cols.map((c) => `<th scope="col" class="${c.num ? 'num' : ''}">${c.label}</th>`).join('')}</tr>`;
      body.innerHTML = DISHES.map((d) => `<tr>${cols.map((c, i) => (i === 0 ? `<th scope="row">${c.cell(d)}</th>` : `<td class="${c.num ? 'num' : ''}">${c.cell(d)}</td>`)).join('')}</tr>`).join('');
      foot.innerHTML = `<tr>${cols.map((c, i) => (i === 0 ? `<th scope="row">${TOTAL_CELL[c.key]}</th>` : `<td class="${c.num ? 'num' : ''}">${TOTAL_CELL[c.key]}</td>`)).join('')}</tr>`;
    }

    function toggleMenu(open) {
      menu.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
      if (open) $('input', menu).focus();
    }
    menuBtn.addEventListener('click', () => toggleMenu(menu.hidden));
    menu.addEventListener('change', (e) => {
      const cb = e.target;
      if (cb.checked) visible.add(cb.value); else visible.delete(cb.value);
      render();
      status.textContent = `${visible.size} of ${COLS.length} columns shown`;
    });
    menu.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); toggleMenu(false); menuBtn.focus(); } });
    document.addEventListener('pointerdown', (e) => { if (!menu.hidden && !e.target.closest('[data-colmenu]')) toggleMenu(false); });

    $$('input[name="density"]', root).forEach((r) => r.addEventListener('change', () => {
      table.classList.toggle('is-compact', r.value === 'compact' && r.checked);
    }));

    $('[data-export]', root).addEventListener('click', () => {
      const cols = COLS.filter((c) => visible.has(c.key));
      const file = 'ember-dish-report-october.csv';
      downloadCsv(file, [
        cols.map((c) => c.label),
        ...DISHES.map((d) => cols.map((c) => c.csv(d))),
        cols.map((c) => ({ dish: 'Total', cat: '', orders: tot.orders, revenue: tot.revenue, price: '', rating: tot.rating.toFixed(2), margin: `${tot.margin}%` }[c.key])),
      ]);
      status.textContent = `Downloaded ${file}: ${DISHES.length} rows, ${cols.length} columns.`;
    });

    render();
  })();
})();
