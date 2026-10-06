/*!
 * Thecore · 100 Days of Web Development
 * Day 019: Calendars & date pickers
 *
 * Every date here is a *local* calendar date built with new Date(y, m, d),
 * never parsed from a string. That avoids the classic bug where
 * "2026-11-24" is read as UTC midnight and shows as the 23rd.
 */
(() => {
  'use strict';

  const { $, $$ } = window.Thecore;
  const LOCALE = 'en-GB';

  /* ---------- Date helpers ---------- */
  const today = (() => { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); })();
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const addMonths = (d, n) => {
    const last = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate();
    return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), last));
  };
  const same = (a, b) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const key = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const fromKey = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const mondayOf = (d) => addDays(d, -((d.getDay() + 6) % 7)); // weeks start on Monday (UK)
  const daysBetween = (a, b) => Math.round((b - a) / 86400000);
  const isWeekend = (d) => d.getDay() === 0 || d.getDay() === 6;

  const fmtLong = new Intl.DateTimeFormat(LOCALE, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const fmtShort = new Intl.DateTimeFormat(LOCALE, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const fmtDayMon = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'short' });
  const fmtMonth = new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' });
  const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const DOW_LONG = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dowHeader = () => DOW.map((d, i) => `<th scope="col"><abbr title="${DOW_LONG[i]}">${d.slice(0, 2)}</abbr></th>`).join('');

  /* Stable pseudo-random numbers from a seed, so demo data never jumps around. */
  const seeded = (seed) => { let s = seed % 2147483647 || 1; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };
  const escape = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function focusSoon(el, tries = 10) {
    if (!el) return;
    el.focus({ preventScroll: true });
    if (document.activeElement !== el && tries > 0) requestAnimationFrame(() => focusSoon(el, tries - 1));
  }

  /* Weeks (Monday-first) covering a month: 6 rows so the grid never jumps in height. */
  function monthDays(month) {
    const start = mondayOf(new Date(month.getFullYear(), month.getMonth(), 1));
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }

  /* Shared keyboard rules for a day grid. Returns the new date or null. */
  function moveByKey(e, d) {
    const k = e.key;
    if (k === 'ArrowLeft') return addDays(d, -1);
    if (k === 'ArrowRight') return addDays(d, 1);
    if (k === 'ArrowUp') return addDays(d, -7);
    if (k === 'ArrowDown') return addDays(d, 7);
    if (k === 'Home') return mondayOf(d);
    if (k === 'End') return addDays(mondayOf(d), 6);
    if (k === 'PageUp') return e.shiftKey ? addMonths(d, -12) : addMonths(d, -1);
    if (k === 'PageDown') return e.shiftKey ? addMonths(d, 12) : addMonths(d, 1);
    return null;
  }

  /* ======================================================================
     01 · Atlas: accessible date picker
     ====================================================================== */
  (() => {
    const root = $('[data-datepicker]');
    const input = $('[data-date-input]', root);
    const openBtn = $('[data-date-open]', root);
    const hint = $('[data-date-hint]', root);
    const dp = $('[data-dp]', root);
    const title = $('[data-dp-title]', root);
    const body = $('[data-dp-body]', root);
    const form = $('[data-pform]');
    const msg = $('[data-pform-msg]');
    $('[data-dp-dow]', root).innerHTML = dowHeader();

    const allowed = (d) => d > today && !isWeekend(d);
    const nextAllowed = (d) => { let x = d; while (!allowed(x)) x = addDays(x, 1); return x; };
    let selected = null;
    let focusDate = nextAllowed(addDays(today, 1));
    let view = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);

    function render() {
      title.textContent = fmtMonth.format(view);
      const days = monthDays(view);
      let html = '';
      for (let w = 0; w < 6; w++) {
        html += '<tr>';
        for (let i = 0; i < 7; i++) {
          const d = days[w * 7 + i];
          const other = d.getMonth() !== view.getMonth();
          const ok = allowed(d);
          const sel = same(d, selected);
          html += `<td role="gridcell" aria-selected="${sel}"><button type="button" class="day${other ? ' is-other' : ''}${same(d, today) ? ' is-today' : ''}${sel ? ' is-selected' : ''}" tabindex="${same(d, focusDate) ? 0 : -1}" data-date="${key(d)}" aria-label="${fmtLong.format(d)}${same(d, today) ? ', today' : ''}${ok ? '' : ', unavailable'}"${ok ? '' : ' aria-disabled="true"'}>${d.getDate()}</button></td>`;
        }
        html += '</tr>';
      }
      body.innerHTML = html;
      $('[data-dp-prev]', root).disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
    }

    function setFocus(d) {
      focusDate = d;
      if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) view = new Date(d.getFullYear(), d.getMonth(), 1);
      render();
      $(`[data-date="${key(d)}"]`, body)?.focus();
    }

    function open() {
      focusDate = selected || nextAllowed(addDays(today, 1));
      view = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
      render();
      dp.hidden = false;
      openBtn.setAttribute('aria-expanded', 'true');
      focusSoon($(`[data-date="${key(focusDate)}"]`, body));
    }
    function close(returnFocus = true) {
      if (dp.hidden) return;
      dp.hidden = true;
      openBtn.setAttribute('aria-expanded', 'false');
      if (returnFocus) openBtn.focus();
    }

    function choose(d, from) {
      if (!allowed(d)) {
        const alt = nextAllowed(d < today ? addDays(today, 1) : d);
        hint.className = 'fld__hint is-error';
        hint.textContent = `${fmtShort.format(d)} isn’t available (${d <= today ? 'that date has passed' : 'weekends are closed'}). The next free day is ${fmtShort.format(alt)}.`;
        input.setAttribute('aria-invalid', 'true');
        return false;
      }
      selected = d;
      input.value = fmtShort.format(d);
      input.removeAttribute('aria-invalid');
      const n = daysBetween(today, d);
      hint.className = 'fld__hint is-ok';
      hint.textContent = `✓ ${DOW_LONG[(d.getDay() + 6) % 7]}, ${n} ${n === 1 ? 'day' : 'days'} from today.`;
      if (from === 'grid') close();
      return true;
    }

    // Understands: 24/11/2026, 24/11, 2026-11-24, 24 nov, today, tomorrow, friday, next friday, in 3 days.
    function parse(text) {
      const t = text.trim().toLowerCase().replace(/,/g, ' ').replace(/\s+/g, ' ');
      if (!t) return null;
      if (t === 'today') return today;
      if (t === 'tomorrow') return addDays(today, 1);
      let m = t.match(/^in (\d{1,3}) (day|days|week|weeks)$/);
      if (m) return addDays(today, Number(m[1]) * (m[2].startsWith('week') ? 7 : 1));
      m = t.match(/^(next )?(mon|tue|wed|thu|fri|sat|sun)[a-z]*$/);
      if (m) {
        const target = DOW.findIndex((d) => d.toLowerCase() === m[2]);
        let d = addDays(today, 1);
        while ((d.getDay() + 6) % 7 !== target) d = addDays(d, 1);
        return d; // “friday” and “next friday” both mean the coming one
      }
      m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      if (m) return valid(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
      m = t.match(/^(\d{1,2})[/.\-](\d{1,2})(?:[/.\-](\d{2,4}))?$/);
      if (m) return withYear(Number(m[1]), Number(m[2]) - 1, m[3]);
      const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      m = t.match(/^(\d{1,2})(?:st|nd|rd|th)? ([a-z]{3})[a-z]*(?: (\d{2,4}))?$/);
      if (m && months.includes(m[2])) return withYear(Number(m[1]), months.indexOf(m[2]), m[3]);
      return undefined; // couldn't understand it
    }
    function valid(y, mo, d) {
      const x = new Date(y, mo, d);
      return x.getMonth() === mo && x.getDate() === d ? x : undefined; // rejects 31/02
    }
    function withYear(d, mo, y) {
      if (y) return valid(y.length === 2 ? 2000 + Number(y) : Number(y), mo, d);
      const x = valid(today.getFullYear(), mo, d);
      return x && x < today ? valid(today.getFullYear() + 1, mo, d) : x; // no year given: the next one
    }

    function commitTyped() {
      if (!input.value.trim()) { selected = null; return; }
      if (selected && input.value === fmtShort.format(selected)) return;
      const d = parse(input.value);
      if (!d) {
        hint.className = 'fld__hint is-error';
        hint.textContent = 'Sorry, I couldn’t read that date. Try 24/11/2026, “tomorrow” or “next friday”.';
        input.setAttribute('aria-invalid', 'true');
        selected = null;
        return;
      }
      if (!choose(d, 'typed')) selected = null;
    }
    input.addEventListener('change', commitTyped);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); commitTyped(); }
      if (e.key === 'ArrowDown' && e.altKey) { e.preventDefault(); open(); }
    });

    openBtn.addEventListener('click', () => (dp.hidden ? open() : close()));
    body.addEventListener('click', (e) => {
      const b = e.target.closest('[data-date]');
      if (!b) return;
      const d = fromKey(b.dataset.date);
      if (b.getAttribute('aria-disabled') === 'true') { setFocus(d); choose(d, 'grid'); return; }
      choose(d, 'grid');
    });
    body.addEventListener('keydown', (e) => {
      const b = e.target.closest('[data-date]');
      if (!b) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const d = fromKey(b.dataset.date);
        if (b.getAttribute('aria-disabled') !== 'true') choose(d, 'grid');
        return;
      }
      const next = moveByKey(e, fromKey(b.dataset.date));
      if (!next) return;
      e.preventDefault();
      if (next < today) return;
      setFocus(next);
    });
    $('[data-dp-prev]', root).addEventListener('click', () => { view = addMonths(view, -1); focusDate = new Date(view); render(); });
    $('[data-dp-next]', root).addEventListener('click', () => { view = addMonths(view, 1); focusDate = new Date(view); render(); });
    $('[data-dp-today]', root).addEventListener('click', () => setFocus(nextAllowed(addDays(today, 1))));
    $('[data-dp-cancel]', root).addEventListener('click', () => close());

    // Dialog behaviour: Esc closes, Tab stays inside, clicking outside closes.
    dp.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
      if (e.key !== 'Tab') return;
      const items = [$('[data-dp-prev]', root), $('[data-dp-next]', root), $('[tabindex="0"]', body), $('[data-dp-today]', root), $('[data-dp-cancel]', root)].filter((x) => x && !x.disabled);
      const i = items.indexOf(document.activeElement);
      e.preventDefault();
      items[(i + (e.shiftKey ? -1 : 1) + items.length) % items.length].focus();
    });
    document.addEventListener('pointerdown', (e) => { if (!dp.hidden && !root.contains(e.target)) close(false); });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      commitTyped();
      if (!selected) {
        msg.className = 'pform__msg is-error';
        msg.textContent = 'Please choose a launch date.';
        input.focus();
        return;
      }
      msg.className = 'pform__msg';
      msg.textContent = `✓ “${$('#pp-name').value}” created, launching ${fmtLong.format(selected)}.`;
    });
  })();

  /* ======================================================================
     02 · Wander: date range picker
     ====================================================================== */
  (() => {
    const root = $('[data-range]');
    const monthsEl = $('[data-range-months]', root);
    const summary = $('[data-range-summary]', root);
    const book = $('[data-range-book]', root);
    const startOut = $('[data-start-out]', root);
    const endOut = $('[data-end-out]', root);
    const fields = $$('.range__field', root);
    const PRICE = (d) => (d.getDay() === 5 || d.getDay() === 6 ? 170 : 140);

    // A few booked nights scattered over the next months.
    const rand = seeded(today.getFullYear() * 400 + today.getMonth() * 31);
    const booked = new Set();
    for (let i = 3; i < 120; i++) if (rand() < 0.09) { const d = addDays(today, i); booked.add(key(d)); if (rand() < 0.6) booked.add(key(addDays(d, 1))); }

    let start = null;
    let end = null;
    let hover = null;
    let first = new Date(today.getFullYear(), today.getMonth(), 1);
    let focusDate = today;

    const blocked = (a, b) => { for (let d = a; d < b; d = addDays(d, 1)) if (booked.has(key(d))) return true; return false; };
    const unavailable = (d) => d < today || booked.has(key(d));

    function monthTable(m) {
      const days = monthDays(m);
      let rows = '';
      for (let w = 0; w < 6; w++) {
        rows += '<tr>';
        for (let i = 0; i < 7; i++) {
          const d = days[w * 7 + i];
          if (d.getMonth() !== m.getMonth()) { rows += '<td></td>'; continue; }
          const k = key(d);
          const isStart = same(d, start);
          const isEnd = same(d, end);
          const inRange = start && end && d > start && d < end;
          const preview = start && !end && hover && d > start && d <= hover && !blocked(start, hover);
          const dis = d < today;
          const bk = booked.has(k);
          const cls = ['day', isStart && 'is-selected is-start', isEnd && 'is-selected is-end', inRange && 'is-in', preview && 'is-preview', bk && 'is-booked', same(d, today) && 'is-today'].filter(Boolean).join(' ');
          const label = `${fmtLong.format(d)}${bk ? ', booked' : ''}${isStart ? ', check-in' : ''}${isEnd ? ', check-out' : ''}`;
          rows += `<td><button type="button" class="${cls}" data-date="${k}" tabindex="${same(d, focusDate) ? 0 : -1}" aria-label="${label}" aria-pressed="${isStart || isEnd}"${dis ? ' aria-disabled="true"' : ''}>${d.getDate()}</button></td>`;
        }
        rows += '</tr>';
      }
      return `<div class="rmonth"><h4>${fmtMonth.format(m)}</h4><table role="grid" aria-label="${fmtMonth.format(m)}"><thead><tr>${dowHeader()}</tr></thead><tbody>${rows}</tbody></table></div>`;
    }

    function render(focus) {
      monthsEl.innerHTML = monthTable(first) + monthTable(addMonths(first, 1));
      $('[data-range-prev]', root).disabled = first <= new Date(today.getFullYear(), today.getMonth(), 1);
      startOut.textContent = start ? fmtDayMon.format(start) : 'Add date';
      endOut.textContent = end ? fmtDayMon.format(end) : 'Add date';
      fields[0].classList.toggle('is-next', !start || (start && end));
      fields[1].classList.toggle('is-next', !!start && !end);
      if (start && end) {
        const nights = daysBetween(start, end);
        let total = 0;
        for (let d = start; d < end; d = addDays(d, 1)) total += PRICE(d);
        summary.className = '';
        summary.innerHTML = `<strong>${nights} ${nights === 1 ? 'night' : 'nights'}</strong> · ${fmtDayMon.format(start)} – ${fmtDayMon.format(end)} · <strong>€${total.toLocaleString(LOCALE)}</strong> total`;
        book.disabled = false;
      } else {
        book.disabled = true;
        if (!summary.classList.contains('is-error')) summary.textContent = start ? `Check-in ${fmtShort.format(start)}. Now choose your check-out date.` : 'Choose your check-in date.';
      }
      if (focus) $(`[data-date="${key(focusDate)}"]`, monthsEl)?.focus();
    }

    function pick(d) {
      summary.classList.remove('is-error');
      if (unavailable(d) && !(start && !end && d > start && booked.has(key(d)) && !blocked(start, d))) {
        // A booked day can still be a check-out (you leave that morning) but never a check-in.
        summary.className = 'is-error';
        summary.textContent = d < today ? 'That date has passed.' : `${fmtShort.format(d)} is booked. Try another day.`;
        render(true);
        return;
      }
      if (!start || end || d <= start) { start = d; end = null; }
      else if (blocked(start, d)) {
        summary.className = 'is-error';
        summary.textContent = 'Your stay would include booked nights. Choose an earlier check-out.';
      } else end = d;
      focusDate = d;
      render(true);
    }

    monthsEl.addEventListener('click', (e) => { const b = e.target.closest('[data-date]'); if (b) pick(fromKey(b.dataset.date)); });
    monthsEl.addEventListener('pointerover', (e) => {
      const b = e.target.closest('[data-date]');
      if (!b || !start || end) return;
      const d = fromKey(b.dataset.date);
      if (!same(d, hover)) { hover = d; render(); }
    });
    monthsEl.addEventListener('keydown', (e) => {
      const b = e.target.closest('[data-date]');
      if (!b) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(fromKey(b.dataset.date)); return; }
      const next = moveByKey(e, fromKey(b.dataset.date));
      if (!next || next < new Date(today.getFullYear(), today.getMonth(), 1)) return;
      e.preventDefault();
      focusDate = next;
      if (start && !end) hover = next;
      const firstNext = new Date(first.getFullYear(), first.getMonth() + 2, 1);
      if (next < first) first = new Date(next.getFullYear(), next.getMonth(), 1);
      else if (next >= firstNext) first = new Date(next.getFullYear(), next.getMonth() - 1, 1);
      render(true);
    });
    $('[data-range-prev]', root).addEventListener('click', () => { first = addMonths(first, -1); render(); });
    $('[data-range-next]', root).addEventListener('click', () => { first = addMonths(first, 1); render(); });

    $('[data-presets]', root).addEventListener('click', (e) => {
      const b = e.target.closest('[data-preset]');
      if (!b) return;
      summary.classList.remove('is-error');
      const p = b.dataset.preset;
      if (p === 'clear') { start = end = hover = null; render(); return; }
      let s;
      if (p === 'weekend' || p === 'next-weekend') {
        s = addDays(mondayOf(today), 4); // this week's Friday
        if (s <= today) s = addDays(s, 7);
        if (p === 'next-weekend') s = addDays(s, 7);
        end = addDays(s, 2);
      } else {
        s = addDays(mondayOf(today), 7);
        end = addDays(s, 7);
      }
      start = s;
      // Move forward a week at a time until the stay is free.
      while (blocked(start, end)) { start = addDays(start, 7); end = addDays(end, 7); }
      first = new Date(start.getFullYear(), start.getMonth(), 1);
      focusDate = start;
      render();
    });

    book.addEventListener('click', () => {
      summary.innerHTML = `✓ Reserved Casa Alfama, <strong>${fmtDayMon.format(start)} – ${fmtDayMon.format(end)}</strong>. Confirmation sent.`;
      book.disabled = true;
    });

    render();
  })();

  /* ======================================================================
     03 · Lumen: month calendar
     ====================================================================== */
  (() => {
    const root = $('[data-month]');
    const grid = $('[data-mcal]', root);
    const titleEl = $('[data-month-title]', root);
    const agenda = $('[data-agenda]', root);
    const label = $('[data-mcal-label]', root);
    let month = new Date(today.getFullYear(), today.getMonth(), 1);
    let selected = today;
    let adding = null;
    const shown = new Set(['team', 'client', 'launch']);

    // Demo events relative to today, so the calendar always looks alive.
    const events = [
      [-6, '10:00', 'Sprint planning', 'team'], [-3, '14:30', 'Nordlys review', 'client'], [-1, '09:30', 'Stand-up', 'team'],
      [0, '11:00', 'Design critique', 'team'], [0, '15:00', 'Museum of Light call', 'client'], [0, '17:00', 'Release v2.4', 'launch'], [0, '18:00', 'Team drinks', 'team'],
      [2, '10:00', 'Workshop: Fjord & Co.', 'client'], [3, '13:00', 'Lunch & learn', 'team'], [6, '09:00', 'Pricing page live', 'launch'],
      [8, '16:00', 'Quarterly review', 'team'], [9, '11:30', 'Ashby Print kickoff', 'client'], [13, '10:00', 'Mobile app beta', 'launch'],
      [15, '14:00', '1:1s', 'team'], [20, '10:00', 'Retro', 'team'], [22, '15:30', 'Studio Moreau pitch', 'client'], [27, '09:00', 'Q4 launch', 'launch'],
    ].map(([off, time, title, cat]) => ({ date: key(addDays(today, off)), time, title, cat }));

    const on = (d) => events.filter((e) => e.date === key(d) && shown.has(e.cat)).sort((a, b) => a.time.localeCompare(b.time));

    function render(focusKey) {
      titleEl.textContent = fmtMonth.format(month);
      label.textContent = `${fmtMonth.format(month)}, team calendar`;
      let html = '<span class="sr-only" id="mcal-label">' + escape(label.textContent) + '</span>';
      html += DOW.map((d, i) => `<div class="mcal__dow" role="columnheader"><abbr title="${DOW_LONG[i]}" style="text-decoration:none">${d}</abbr></div>`).join('');
      monthDays(month).forEach((d) => {
        const list = on(d);
        const other = d.getMonth() !== month.getMonth();
        const k = key(d);
        html += `<div class="mday${other ? ' is-other' : ''}${same(d, today) ? ' is-today' : ''}${same(d, selected) ? ' is-selected' : ''}" role="gridcell" data-day="${k}">
          <button type="button" class="mday__num" data-pick="${k}" tabindex="${same(d, selected) ? 0 : -1}" aria-label="${fmtLong.format(d)}${same(d, today) ? ', today' : ''}, ${list.length ? `${list.length} ${list.length === 1 ? 'event' : 'events'}` : 'no events'}">${d.getDate()}</button>
          ${list.slice(0, 2).map((e) => `<span class="mev mev--${e.cat}${e.fresh ? ' is-new' : ''}"><span class="mev__time">${e.time}</span> ${escape(e.title)}</span>`).join('')}
          ${list.length > 2 ? `<button type="button" class="mday__more" data-pick="${k}" tabindex="-1">+${list.length - 2} more</button>` : ''}
          <span class="mday__dots" aria-hidden="true">${list.slice(0, 3).map((e) => `<i style="--c:var(--ev-${e.cat})"></i>`).join('')}</span>
          ${adding === k ? `<div class="qadd" data-qadd><label class="sr-only" for="qadd-in">New event on ${fmtLong.format(d)}</label><input id="qadd-in" placeholder="New event, e.g. 14:00 Call" data-qadd-in><select aria-label="Category" data-qadd-cat><option value="team">Team</option><option value="client">Client</option><option value="launch">Launch</option></select><small>Enter to save · Esc to cancel</small></div>` : ''}
        </div>`;
      });
      grid.innerHTML = html;
      events.forEach((e) => { e.fresh = false; });
      renderAgenda();
      if (adding) focusSoon($('[data-qadd-in]', grid));
      else if (focusKey) $(`.mday__num[data-pick="${focusKey}"]`, grid)?.focus();
    }

    function renderAgenda() {
      const list = on(selected);
      agenda.innerHTML = `<h4>${fmtLong.format(selected)}</h4>${list.length ? `<ul role="list">${list.map((e) => `<li style="--c:var(--ev-${e.cat})"><strong>${escape(e.title)}</strong><small>${e.time}</small></li>`).join('')}</ul>` : '<p class="empty">Nothing planned.</p>'}<button type="button" class="btn btn--outline btn--sm" data-add-selected>+ Add event</button>`;
    }

    function select(d, focus = true) {
      if (d.getMonth() !== month.getMonth() || d.getFullYear() !== month.getFullYear()) month = new Date(d.getFullYear(), d.getMonth(), 1);
      selected = d;
      render(focus ? key(d) : null);
    }

    grid.addEventListener('click', (e) => {
      if (e.target.closest('[data-qadd]')) return;
      const pickBtn = e.target.closest('[data-pick]');
      if (pickBtn) { adding = null; select(fromKey(pickBtn.dataset.pick)); return; }
      const cell = e.target.closest('[data-day]');
      if (cell) { selected = fromKey(cell.dataset.day); adding = cell.dataset.day; render(); }
    });
    grid.addEventListener('keydown', (e) => {
      const input = e.target.closest('[data-qadd-in]');
      if (input) {
        if (e.key === 'Escape') { e.preventDefault(); const k = adding; adding = null; render(k); }
        if (e.key === 'Enter') {
          e.preventDefault();
          const text = input.value.trim();
          const k = adding;
          if (text) {
            const m = text.match(/^(\d{1,2})(?::(\d{2}))?\s+(.+)$/);
            const time = m ? `${m[1].padStart(2, '0')}:${m[2] || '00'}` : '09:00';
            events.push({ date: k, time, title: m ? m[3] : text, cat: $('[data-qadd-cat]', grid).value, fresh: true });
            shown.add($('[data-qadd-cat]', grid).value);
          }
          adding = null;
          render(k);
        }
        return;
      }
      const b = e.target.closest('.mday__num');
      if (!b) return;
      if (e.key === 'Enter' && e.shiftKey) { e.preventDefault(); adding = b.dataset.pick; render(); return; }
      const next = moveByKey(e, fromKey(b.dataset.pick));
      if (!next) return;
      e.preventDefault();
      select(next);
    });
    grid.addEventListener('focusout', (e) => {
      if (adding && e.target.closest('[data-qadd]') && !e.relatedTarget?.closest('[data-qadd]')) { adding = null; render(); }
    });
    agenda.addEventListener('click', (e) => { if (e.target.closest('[data-add-selected]')) { adding = key(selected); render(); } });

    $('[data-month-prev]', root).addEventListener('click', () => { month = addMonths(month, -1); render(); });
    $('[data-month-next]', root).addEventListener('click', () => { month = addMonths(month, 1); render(); });
    $('[data-month-today]', root).addEventListener('click', () => select(today));
    $$('[data-cats] input', root).forEach((c) => c.addEventListener('change', () => { if (c.checked) shown.add(c.value); else shown.delete(c.value); render(); }));

    render();
  })();

  /* ======================================================================
     04 · Halden: week schedule
     ====================================================================== */
  (() => {
    const root = $('[data-week]');
    const grid = $('[data-week-grid]', root);
    const scroll = $('[data-week-scroll]', root);
    const titleEl = $('[data-week-title]', root);
    const pop = $('[data-evpop]', root);
    const H0 = 8;
    const H1 = 19;
    let monday = mondayOf(today);
    let lastTrigger = null;

    // Template week: [day 0–6, start, end, title, type, where, who]
    const TEMPLATE = [
      [0, 9, 9.5, 'Studio stand-up', 'meeting', 'Main room', 'Whole studio'],
      [0, 10, 12, 'Deep work: Nordlys logos', 'focus', 'Quiet room', 'Ingrid'],
      [0, 14, 15, 'Museum of Light call', 'client', 'Video call', 'Lea Moreau, Tom'],
      [1, 9, 9.5, 'Studio stand-up', 'meeting', 'Main room', 'Whole studio'],
      [1, 11, 12.5, 'Fjord & Co. workshop', 'client', 'Client office', 'Tom, Kai'],
      [1, 11.5, 13, 'Type review', 'meeting', 'Main room', 'Ingrid, Riya'],
      [1, 16, 17, 'Portfolio shoot', 'focus', 'Studio B', 'Mira'],
      [2, 9, 9.5, 'Studio stand-up', 'meeting', 'Main room', 'Whole studio'],
      [2, 13, 14, 'Lunch & learn: variable fonts', 'social', 'Kitchen', 'Everyone welcome'],
      [2, 14.5, 16, 'Ashby Print proofs', 'client', 'Print room', 'Tom'],
      [2, 15, 16.5, 'Website QA', 'focus', 'Desks', 'Kai'],
      [2, 15.5, 16, 'Quick sync', 'meeting', 'Phone', 'Riya'],
      [3, 9, 9.5, 'Studio stand-up', 'meeting', 'Main room', 'Whole studio'],
      [3, 10, 13, 'Deep work: packaging', 'focus', 'Quiet room', 'Ingrid'],
      [3, 15, 16, 'New business pitch', 'client', 'Boardroom', 'Tom, Riya'],
      [4, 9, 9.5, 'Studio stand-up', 'meeting', 'Main room', 'Whole studio'],
      [4, 11, 12, 'Show & tell', 'meeting', 'Main room', 'Whole studio'],
      [4, 17, 18.5, 'Friday drinks', 'social', 'The Crown', 'Everyone'],
      [5, 10, 12.5, 'Open studio morning', 'social', 'Studio', 'Visitors welcome'],
    ];
    const hhmm = (h) => `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;

    // Overlapping events share the column width (greedy column assignment).
    function layout(list) {
      const sorted = [...list].sort((a, b) => a.s - b.s || b.e - a.e);
      let cluster = [];
      let clusterEnd = -1;
      const flush = () => { const cols = Math.max(...cluster.map((x) => x.col)) + 1; cluster.forEach((x) => { x.cols = cols; }); cluster = []; };
      sorted.forEach((ev) => {
        if (ev.s >= clusterEnd && cluster.length) flush();
        const used = cluster.filter((x) => x.e > ev.s).map((x) => x.col);
        let c = 0;
        while (used.includes(c)) c++;
        ev.col = c;
        cluster.push(ev);
        clusterEnd = Math.max(clusterEnd, ev.e);
      });
      if (cluster.length) flush();
      return sorted;
    }

    function render() {
      const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
      titleEl.textContent = `${fmtDayMon.format(days[0])} – ${fmtDayMon.format(days[6])} ${days[6].getFullYear()}`;
      const thisWeek = same(monday, mondayOf(today));
      grid.style.setProperty('--hours', H1 - H0);
      grid.style.setProperty('--h0', H0);
      let html = '<div class="week__corner"></div>';
      html += days.map((d) => `<div class="week__head${same(d, today) ? ' is-today' : ''}">${DOW[(d.getDay() + 6) % 7]}<strong>${d.getDate()}</strong></div>`).join('');
      html += `<div class="week__times" aria-hidden="true">${Array.from({ length: H1 - H0 }, (_, i) => `<span>${i === 0 ? '' : hhmm(H0 + i)}</span>`).join('')}</div>`;
      days.forEach((d, di) => {
        const list = layout(TEMPLATE.filter((t) => t[0] === di && (thisWeek || t[4] !== 'client' || di % 2)).map(([, s, e, title, type, where, who]) => ({ s, e, title, type, where, who })));
        html += `<div class="week__day${same(d, today) ? ' is-today' : ''}" role="list" aria-label="${fmtLong.format(d)}">`;
        list.forEach((ev) => {
          html += `<button type="button" role="listitem" class="wev wev--${ev.type}" style="--s:${ev.s};--e:${ev.e};--col:${ev.col};--cols:${ev.cols}" data-ev='${JSON.stringify({ ...ev, day: key(d) }).replace(/'/g, '&#39;')}' aria-label="${escape(ev.title)}, ${hhmm(ev.s)} to ${hhmm(ev.e)}"><strong>${escape(ev.title)}</strong><small>${hhmm(ev.s)}–${hhmm(ev.e)}</small></button>`;
        });
        if (same(d, today)) {
          const now = new Date();
          const t = now.getHours() + now.getMinutes() / 60;
          if (t >= H0 && t <= H1) html += `<span class="now-line" style="--t:${t}" aria-hidden="true"></span>`;
        }
        html += '</div>';
      });
      grid.innerHTML = html;
    }

    function openPop(btn) {
      const ev = JSON.parse(btn.dataset.ev);
      lastTrigger = btn;
      $('[data-evpop-title]', pop).textContent = ev.title;
      $('[data-evpop-when]', pop).textContent = `${fmtLong.format(fromKey(ev.day))}, ${hhmm(ev.s)}–${hhmm(ev.e)}`;
      $('[data-evpop-where]', pop).textContent = `📍 ${ev.where}`;
      $('[data-evpop-who]', pop).textContent = ev.who;
      pop.style.setProperty('--c', getComputedStyle(btn).getPropertyValue('--c'));
      pop.hidden = false;
      // Place it next to the event, kept inside the page.
      const r = btn.getBoundingClientRect();
      const p = root.getBoundingClientRect();
      let left = r.right - p.left + 8;
      if (left + 270 > p.width) left = Math.max(8, r.left - p.left - 268);
      pop.style.left = `${left}px`;
      pop.style.top = `${Math.min(Math.max(8, r.top - p.top), p.height - pop.offsetHeight - 8)}px`;
      focusSoon($('[data-evpop-close]', pop));
    }
    function closePop() { if (pop.hidden) return; pop.hidden = true; lastTrigger?.focus(); }

    grid.addEventListener('click', (e) => { const b = e.target.closest('[data-ev]'); if (b) openPop(b); });
    $('[data-evpop-close]', pop).addEventListener('click', closePop);
    root.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pop.hidden) { e.preventDefault(); closePop(); } });
    scroll.addEventListener('scroll', () => { if (!pop.hidden) { pop.hidden = true; } }, { passive: true });
    document.addEventListener('pointerdown', (e) => { if (!pop.hidden && !pop.contains(e.target) && !e.target.closest('[data-ev]')) pop.hidden = true; });

    $('[data-week-prev]', root).addEventListener('click', () => { monday = addDays(monday, -7); render(); });
    $('[data-week-next]', root).addEventListener('click', () => { monday = addDays(monday, 7); render(); });
    $('[data-week-today]', root).addEventListener('click', () => { monday = mondayOf(today); render(); });

    render();
    // Keep the now-line honest while the page is open.
    setInterval(() => { if (!document.hidden && same(monday, mondayOf(today))) { const line = $('.now-line', grid); if (line) { const n = new Date(); line.style.setProperty('--t', n.getHours() + n.getMinutes() / 60); } } }, 60000);
  })();

  /* ======================================================================
     05 · Nova Air: fare calendar
     ====================================================================== */
  (() => {
    const root = $('[data-fares]');
    const grid = $('[data-fares-grid]', root);
    const titleEl = $('[data-fares-title]', root);
    const label = $('[data-fares-label]', root);
    const flights = $('[data-flights]', root);
    let month = new Date(today.getFullYear(), today.getMonth(), 1);
    let selected = null;
    let focusDate = addDays(today, 1);

    function fare(d) {
      const r = seeded(d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate())();
      if (r < 0.06) return null; // sold out
      const weekend = d.getDay() === 5 || d.getDay() === 0 ? 34 : 0;
      const soon = Math.max(0, 30 - daysBetween(today, d)) * 2.2;
      return Math.round(39 + r * 90 + weekend + soon);
    }

    function render(focus) {
      titleEl.textContent = fmtMonth.format(month);
      label.textContent = `Fares for ${fmtMonth.format(month)}`;
      const first = new Date(month.getFullYear(), month.getMonth(), 1);
      const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
      const days = Array.from({ length: count }, (_, i) => addDays(first, i));
      const prices = days.filter((d) => d > today).map(fare).filter(Boolean).sort((a, b) => a - b);
      const q = (p) => prices[Math.floor(prices.length * p)] ?? Infinity;
      const min = prices[0];
      let html = `<span class="sr-only" id="fares-label">${label.textContent}</span>` + DOW.map((d) => `<span class="fares__dow" role="columnheader">${d}</span>`).join('');
      html += Array.from({ length: (first.getDay() + 6) % 7 }, () => '<span class="fare is-empty" aria-hidden="true"></span>').join('');
      days.forEach((d) => {
        const p = d > today ? fare(d) : null;
        const past = d <= today;
        const lv = p == null ? '' : p <= q(0.15) ? 0 : p <= q(0.45) ? 1 : p <= q(0.8) ? 2 : 3;
        const cheapest = p === min;
        html += `<button type="button" role="gridcell" class="fare${cheapest ? ' is-cheapest' : ''}${same(d, selected) ? ' is-selected' : ''}" data-date="${key(d)}" data-lv="${lv}" tabindex="${same(d, focusDate) ? 0 : -1}" ${p == null ? 'disabled' : ''} aria-label="${fmtLong.format(d)}${past ? ', unavailable' : p == null ? ', sold out' : `, £${p}${cheapest ? ', cheapest this month' : ''}`}" aria-pressed="${same(d, selected)}"><small>${d.getDate()}</small><strong>${past ? '–' : p == null ? 'Sold out' : `£${p}`}</strong></button>`;
      });
      grid.innerHTML = html;
      $('[data-fares-prev]', root).disabled = month <= new Date(today.getFullYear(), today.getMonth(), 1);
      if (!$('[tabindex="0"]', grid)) { const firstOk = $('.fare:not(:disabled):not(.is-empty)', grid); if (firstOk) { firstOk.tabIndex = 0; focusDate = fromKey(firstOk.dataset.date); } }
      if (focus) $('[tabindex="0"]', grid)?.focus();
    }

    function choose(d) {
      selected = d;
      focusDate = d;
      render(true);
      const p = fare(d);
      const opts = [['06:45', '09:30', 0], ['12:10', '14:55', 22], ['19:35', '22:20', -6]];
      flights.innerHTML = `<h4>${fmtLong.format(d)}</h4>${opts.map(([dep, arr, add]) => `<div class="flight"><time>${dep}</time><span>→ <time>${arr}</time> <small>2 h 45 m · direct</small></span><strong>£${Math.max(29, p + add)}</strong><button type="button" class="btn btn--primary btn--sm">Select</button></div>`).join('')}`;
    }

    grid.addEventListener('click', (e) => { const b = e.target.closest('[data-date]'); if (b && !b.disabled) choose(fromKey(b.dataset.date)); });
    grid.addEventListener('keydown', (e) => {
      const b = e.target.closest('[data-date]');
      if (!b) return;
      const next = moveByKey(e, fromKey(b.dataset.date));
      if (!next || next <= today) return;
      e.preventDefault();
      focusDate = next;
      if (next.getMonth() !== month.getMonth() || next.getFullYear() !== month.getFullYear()) month = new Date(next.getFullYear(), next.getMonth(), 1);
      render(true);
      // Sold-out days are disabled buttons and can't take focus; keep focus on the grid.
      if (!grid.contains(document.activeElement)) $('.fare:not(:disabled):not(.is-empty)', grid)?.focus();
    });
    $('[data-fares-prev]', root).addEventListener('click', () => { month = addMonths(month, -1); render(); });
    $('[data-fares-next]', root).addEventListener('click', () => { month = addMonths(month, 1); focusDate = month; render(); });
    render();
  })();

  /* ======================================================================
     06 · Ember: event card + add to calendar
     ====================================================================== */
  (() => {
    const root = $('[data-event]');
    const tzSel = $('[data-ev-tz]', root);
    const countdown = $('[data-ev-countdown]', root);
    const menuBtn = $('[data-addcal-btn]', root);
    const menu = $('[data-addcal-menu]', root);
    const msg = $('[data-ev-msg]', root);
    const HOST_TZ = 'Europe/London';
    const TITLE = 'Ember Supper Club: Autumn harvest';
    const PLACE = 'Ember Kitchen, 14 Hoxton Square, London';
    const DETAILS = 'A six-course tasting menu. Dietary needs? Reply to your booking email.';

    // Turn a wall-clock time in a time zone into a real moment (UTC).
    function zoned(y, m, d, h, min, tz) {
      const guess = Date.UTC(y, m, d, h, min);
      const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }).formatToParts(new Date(guess)).map((p) => [p.type, p.value]));
      const asIfUtc = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute));
      return new Date(guess - (asIfUtc - guess));
    }

    // The event: the Saturday at least 10 days away, 19:30–22:30 London time.
    let day = addDays(today, 10);
    while (day.getDay() !== 6) day = addDays(day, 1);
    const start = zoned(day.getFullYear(), day.getMonth(), day.getDate(), 19, 30, HOST_TZ);
    const end = new Date(start.getTime() + 3 * 3600000);

    const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const ZONES = [[local, `Your time (${local.replace(/_/g, ' ')})`], ['Europe/London', 'London'], ['Europe/Paris', 'Paris'], ['America/New_York', 'New York'], ['Asia/Kolkata', 'Mumbai / Delhi'], ['Asia/Tokyo', 'Tokyo'], ['Australia/Sydney', 'Sydney']];
    tzSel.innerHTML = ZONES.filter(([z], i) => i === 0 || z !== local).map(([z, n]) => `<option value="${z}">${n}</option>`).join('');

    function show() {
      const tz = tzSel.value;
      const f = (opts) => new Intl.DateTimeFormat(LOCALE, { timeZone: tz, ...opts });
      $('[data-ev-mon]', root).textContent = f({ month: 'short' }).format(start);
      $('[data-ev-day]', root).textContent = f({ day: 'numeric' }).format(start);
      $('[data-ev-dow]', root).textContent = f({ weekday: 'short' }).format(start);
      $('[data-ev-date]', root).textContent = f({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(start);
      const zoneName = f({ timeZoneName: 'short' }).formatToParts(start).find((p) => p.type === 'timeZoneName')?.value || '';
      const hostDay = new Intl.DateTimeFormat(LOCALE, { timeZone: HOST_TZ, day: 'numeric' }).format(start);
      const shownDay = f({ day: 'numeric' }).format(start);
      $('[data-ev-time]', root).innerHTML = `${f({ hour: '2-digit', minute: '2-digit' }).format(start)} – ${f({ hour: '2-digit', minute: '2-digit' }).format(end)} ${zoneName}${tz !== HOST_TZ ? ` <small>(19:30 in London${hostDay !== shownDay ? ', a different day for you' : ''})</small>` : ''}`;
    }
    tzSel.addEventListener('change', show);
    show();

    function tick() {
      const s = Math.max(0, Math.floor((start - Date.now()) / 1000));
      const parts = [[Math.floor(s / 86400), 'days'], [Math.floor((s % 86400) / 3600), 'hours'], [Math.floor((s % 3600) / 60), 'mins']];
      countdown.innerHTML = `<span class="sr-only">Starts in ${parts.map(([v, u]) => `${v} ${u}`).join(', ')}</span>${parts.map(([v, u]) => `<b aria-hidden="true">${v}<small>${u}</small></b>`).join('')}`;
    }
    tick();
    setInterval(() => { if (!document.hidden) tick(); }, 30000);

    // Calendar links
    const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    $('[data-cal="google"]', root).href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(TITLE)}&dates=${stamp(start)}/${stamp(end)}&details=${encodeURIComponent(DETAILS)}&location=${encodeURIComponent(PLACE)}`;
    $('[data-cal="outlook"]', root).href = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(TITLE)}&startdt=${start.toISOString()}&enddt=${end.toISOString()}&location=${encodeURIComponent(PLACE)}&body=${encodeURIComponent(DETAILS)}`;

    // .ics: lines must be CRLF-separated; commas and semicolons escaped.
    const icsText = (s) => s.replace(/\\/g, '\\\\').replace(/([,;])/g, '\\$1');
    $('[data-cal="ics"]', root).addEventListener('click', () => {
      const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Thecore//Day 019//EN', 'BEGIN:VEVENT',
        `UID:${stamp(start)}-supper-club@ember.kitchen`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
        `SUMMARY:${icsText(TITLE)}`, `LOCATION:${icsText(PLACE)}`, `DESCRIPTION:${icsText(DETAILS)}`,
        'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', 'DESCRIPTION:Supper club in 2 hours', 'END:VALARM',
        'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
      const a = Object.assign(document.createElement('a'), { href: url, download: 'ember-supper-club.ics' });
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      msg.textContent = '✓ ember-supper-club.ics downloaded. Open it to add the event (with a 2-hour reminder).';
      toggle(false, true);
    });

    const items = () => $$('a, button', menu);
    function toggle(open, focusBtn = false) {
      menu.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
      if (open) items()[0].focus();
      else if (focusBtn) menuBtn.focus();
    }
    menuBtn.addEventListener('click', () => toggle(menu.hidden));
    menu.addEventListener('keydown', (e) => {
      const list = items();
      const i = list.indexOf(document.activeElement);
      if (e.key === 'Escape') { e.preventDefault(); toggle(false, true); }
      if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1) % list.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
    });
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) { msg.textContent = 'Opening your calendar in a new tab…'; toggle(false); } });
    document.addEventListener('pointerdown', (e) => { if (!menu.hidden && !e.target.closest('[data-addcal]')) toggle(false); });
  })();
})();
