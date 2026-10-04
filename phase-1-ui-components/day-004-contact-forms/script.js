/*!
 * Thecore · 100 Days of Web Development
 * Day 004: Contact Forms
 *
 * Validation, ARIA wiring, loading states and success views all come from
 * the shared FormKit engine (packages/form-kit). This file only adds what
 * makes each form specific: custom rules, the wizard, time slots, file
 * uploads and the widget. Submissions are simulated with
 * FormKit.fakeRequest(); in production each onSubmit becomes a fetch() to an
 * API or form service (that's Phase 3).
 */
(() => {
  'use strict';

  const { $, $$ } = window.Thecore;
  const { enhance, validate, validators, SubmitError, fakeRequest, showSuccess, EMAIL } = window.FormKit;

  /* ======================================================================
     Custom validation rules (reusable by any form via data-validate)
     ====================================================================== */
  const PERSONAL_DOMAINS = ['gmail.com', 'googlemail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'icloud.com', 'aol.com', 'proton.me', 'protonmail.com'];

  validators.workEmail = (value) => {
    const domain = value.split('@')[1]?.toLowerCase();
    return PERSONAL_DOMAINS.includes(domain)
      ? 'Please use your work email so we can match you with the right team.'
      : null;
  };

  validators.emailOrPhone = (value) => {
    const digits = value.replace(/[^\d]/g, '');
    if (value.includes('@')) return EMAIL.test(value) ? null : 'That email doesn’t look complete.';
    return digits.length >= 7 && /^[+\d\s()-]+$/.test(value) ? null : 'Enter an email address or a phone number.';
  };

  validators.openDay = (value) => {
    const day = new Date(`${value}T12:00`).getDay();
    return day === 1 ? 'We’re closed on Mondays. Please choose another day.' : null;
  };

  /* ======================================================================
     01 · Lumen: talk to sales
     ====================================================================== */
  (() => {
    const form = $('#sales-form');
    const success = $('#sales-success');
    enhance(form, {
      onSubmit: () => fakeRequest(1400),
      onSuccess: () => {
        $('[data-sales-name]', success).textContent = `, ${form.elements.first.value.trim()}`;
        $('[data-sales-email]', success).textContent = form.elements.email.value.trim();
        showSuccess(form);
      },
    });
  })();

  /* ======================================================================
     02 · Halden: multi-step brief
     ====================================================================== */
  (() => {
    const root = $('[data-wizard]');
    const form = $('#brief-form');
    const steps = $$('[data-step]', form);
    const labels = $$('[data-step-label]', root);
    const progress = $('.brief__progress', root);
    const prev = $('[data-prev]', form);
    const next = $('[data-next]', form);
    const submit = $('[data-submit]', form);
    const review = $('[data-review]', form);
    const budget = $('[data-budget]', form);
    const budgetOut = $('[data-budget-out]', form);
    let current = 0;

    const money = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
    const budgetText = () => (Number(budget.value) >= Number(budget.max) ? `${money.format(budget.value)}+` : money.format(budget.value));

    const updateBudget = () => {
      const pct = ((budget.value - budget.min) / (budget.max - budget.min)) * 100;
      budget.style.setProperty('--fill', `${pct}%`);
      budgetOut.textContent = budgetText();
    };
    budget.addEventListener('input', updateBudget);
    updateBudget();

    function buildReview() {
      const data = new FormData(form);
      const rows = [
        ['Services', data.getAll('services').join(', '), 0],
        ['Budget', budgetText(), 1],
        ['Timeline', data.get('timeline'), 1],
        ['Name', data.get('name'), 2],
        ['Email', data.get('email'), 2],
        ['Company', data.get('company') || '—', 2],
        ['Project', data.get('about'), 2],
      ];
      review.innerHTML = '';
      rows.forEach(([label, value, step]) => {
        const row = document.createElement('div');
        const dt = Object.assign(document.createElement('dt'), { textContent: label });
        const dd = Object.assign(document.createElement('dd'), { textContent: value });
        const edit = document.createElement('button');
        edit.type = 'button';
        edit.innerHTML = '<svg class="icon"><use href="#i-edit"/></svg>Edit';
        edit.setAttribute('aria-label', `Edit ${label.toLowerCase()}`);
        edit.addEventListener('click', () => go(step));
        row.append(dt, dd, edit);
        review.append(row);
      });
    }

    function go(index, { focus = true } = {}) {
      const back = index < current;
      steps[current].hidden = true;
      current = index;
      const step = steps[current];
      step.hidden = false;
      step.classList.toggle('is-back', back);
      $('[data-step-count]', step).textContent = `Step ${current + 1} of ${steps.length}`;

      labels.forEach((l, i) => {
        l.classList.toggle('is-current', i === current);
        l.classList.toggle('is-done', i < current);
        if (i === current) l.setAttribute('aria-current', 'step');
        else l.removeAttribute('aria-current');
      });
      progress.style.setProperty('--p', (current + 1) / steps.length);

      const last = current === steps.length - 1;
      prev.hidden = current === 0;
      next.hidden = last;
      submit.hidden = !last;
      if (last) buildReview();

      if (focus) $('.brief__title', step).focus();
    }

    function advance() {
      const invalid = validate(steps[current]);
      if (invalid.length) {
        const target = invalid[0].matches('input, select, textarea') ? invalid[0] : invalid[0].querySelector('input') || invalid[0];
        target.focus();
        return;
      }
      go(current + 1);
    }

    next.addEventListener('click', advance);
    prev.addEventListener('click', () => go(current - 1));

    // Enter in a field moves to the next step instead of submitting early
    form.addEventListener('submit', (e) => {
      if (current < steps.length - 1) {
        e.preventDefault();
        e.stopImmediatePropagation();
        advance();
      }
    }, true);

    enhance(form, { onSubmit: () => fakeRequest(1500) });

    form.addEventListener('fk:reset', () => {
      updateBudget();
      go(0, { focus: false });
    });

    go(0, { focus: false });
  })();

  /* ======================================================================
     03 · Ember: table reservation
     ====================================================================== */
  (() => {
    const form = $('#booking-form');
    const date = form.elements.date;
    const slots = $('[data-slots]', form);
    const party = form.elements.party;
    const partyNote = $('[data-party-note]', form);
    const summary = $('[data-booking-summary]');
    const success = $('#booking-success');

    // Service periods per weekday (0 = Sunday). Monday is closed.
    const SERVICES = {
      0: [['Lunch', '12:00', '14:30']],
      2: [['Dinner', '17:00', '21:30']],
      3: [['Dinner', '17:00', '21:30']],
      4: [['Dinner', '17:00', '21:30']],
      5: [['Dinner', '17:00', '22:00']],
      6: [['Lunch', '12:00', '14:30'], ['Dinner', '17:30', '22:00']],
    };

    const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const today = new Date();
    const limit = new Date();
    limit.setDate(limit.getDate() + 60);
    date.min = iso(today);
    date.max = iso(limit);

    const toMin = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
    const toTime = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
    const longDate = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

    // Deterministic "sold out" slots so the demo looks realistic and stable
    const isFull = (key) => {
      let h = 0;
      for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
      return h % 5 === 0;
    };

    function renderSlots() {
      slots.innerHTML = '';
      if (!date.value) {
        slots.innerHTML = '<p class="booking__slots-empty">Pick a date to see available times.</p>';
        return;
      }
      const day = new Date(`${date.value}T12:00`);
      const services = SERVICES[day.getDay()];
      if (!services) {
        slots.innerHTML = '<p class="booking__slots-empty">Closed on this day.</p>';
        return;
      }

      const isToday = date.value === iso(new Date());
      const nowMin = new Date().getHours() * 60 + new Date().getMinutes() + 60; // at least an hour's notice
      let count = 0;

      services.forEach(([name, start, end]) => {
        if (services.length > 1) {
          slots.insertAdjacentHTML('beforeend', `<p class="booking__slots-group">${name}</p>`);
        }
        for (let m = toMin(start); m <= toMin(end); m += 30) {
          const time = toTime(m);
          const disabled = isFull(date.value + time) || (isToday && m < nowMin);
          const label = document.createElement('label');
          label.className = 'chip';
          label.innerHTML = `<input type="radio" name="time" value="${time}"${disabled ? ' disabled' : ''}>${time}`;
          if (disabled) label.title = 'Fully booked';
          slots.append(label);
          if (!disabled) count += 1;
        }
      });

      if (!count) slots.insertAdjacentHTML('beforeend', '<p class="booking__slots-empty">No tables left on this day. Please try another.</p>');
    }

    function updateSummary() {
      const n = Number(party.value) || 1;
      const time = form.elements.time?.value;
      const parts = [`Table for ${n}`];
      if (date.value) parts.push(longDate.format(new Date(`${date.value}T12:00`)));
      if (time) parts.push(time);
      summary.textContent = date.value ? parts.join(' · ') : 'Choose a date and time';
      partyNote.textContent = n > 8 ? 'For groups of 9–12 we’ll call to confirm your table.' : 'Up to 12 guests online.';
    }

    // Stepper
    const setParty = (n) => {
      party.value = Math.min(12, Math.max(1, n));
      $('[data-step-down]', form).disabled = Number(party.value) <= 1;
      $('[data-step-up]', form).disabled = Number(party.value) >= 12;
      updateSummary();
    };
    $('[data-step-down]', form).addEventListener('click', () => setParty(Number(party.value) - 1));
    $('[data-step-up]', form).addEventListener('click', () => setParty(Number(party.value) + 1));
    party.addEventListener('change', () => setParty(Number(party.value) || 1));

    date.addEventListener('change', () => {
      renderSlots();
      updateSummary();
    });
    form.addEventListener('change', (e) => {
      if (e.target.name === 'time') updateSummary();
    });

    enhance(form, {
      onSubmit: () => fakeRequest(1300),
      onSuccess: () => {
        const code = `EMB-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        $('[data-booking-confirm]', success).textContent =
          `${summary.textContent}. We’ve sent a confirmation to ${form.elements.email.value.trim()} and will text ${form.elements.phone.value.trim()} on the day.`;
        $('[data-booking-code]', success).textContent = code;
        showSuccess(form);
      },
    });

    form.addEventListener('fk:reset', () => {
      renderSlots();
      setParty(2);
    });

    setParty(2);
  })();

  /* ======================================================================
     04 · Nova: support ticket
     ====================================================================== */
  (() => {
    const form = $('#support-form');
    const success = $('#support-success');
    const dropzone = $('[data-dropzone]', form);
    const fileInput = $('input[type="file"]', dropzone);
    const list = $('[data-file-list]', form);
    const fileError = $('[data-file-error]', form);
    const urgentNote = $('[data-urgent-note]', form);
    const slaEl = $('[data-sla]');

    const SLA = { low: '2 business days', normal: '4 hours', high: '1 hour', urgent: '15 minutes' };
    const MAX_FILES = 3;
    const MAX_SIZE = 5 * 1024 * 1024;
    const ALLOWED = /\.(png|jpe?g|pdf|txt|log)$/i;
    let files = [];

    const size = (b) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

    function renderFiles() {
      list.innerHTML = '';
      files.forEach((file, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#i-file"/></svg><span></span><small>${size(file.size)}</small><button type="button" aria-label="Remove ${file.name.replace(/"/g, '')}"><svg class="icon"><use href="#i-x"/></svg></button>`;
        $('span', li).textContent = file.name;
        $('button', li).addEventListener('click', () => {
          files.splice(i, 1);
          renderFiles();
          fileInput.focus();
        });
        list.append(li);
      });
      // Keep the real input in sync so a normal form POST would include the files
      const transfer = new DataTransfer();
      files.forEach((f) => transfer.items.add(f));
      fileInput.files = transfer.files;
    }

    function addFiles(incoming) {
      const problems = [];
      [...incoming].forEach((file) => {
        if (!ALLOWED.test(file.name)) problems.push(`${file.name} isn’t a supported file type.`);
        else if (file.size > MAX_SIZE) problems.push(`${file.name} is larger than 5 MB.`);
        else if (files.length >= MAX_FILES) problems.push(`You can attach up to ${MAX_FILES} files.`);
        else if (!files.some((f) => f.name === file.name && f.size === file.size)) files.push(file);
      });
      fileError.textContent = [...new Set(problems)].join(' ');
      renderFiles();
    }

    fileInput.addEventListener('change', () => addFiles(fileInput.files));
    ['dragenter', 'dragover'].forEach((type) => dropzone.addEventListener(type, (e) => {
      e.preventDefault();
      dropzone.classList.add('is-dragging');
    }));
    ['dragleave', 'drop'].forEach((type) => dropzone.addEventListener(type, () => dropzone.classList.remove('is-dragging')));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      addFiles(e.dataTransfer.files);
    });

    // Priority changes the promise we make
    $('[data-priority]', form).addEventListener('change', (e) => {
      const p = e.target.value;
      urgentNote.hidden = p !== 'urgent';
      slaEl.textContent = SLA[p];
    });

    enhance(form, {
      onSubmit: async (data) => {
        await fakeRequest(1500);
        if (/error/i.test(data.get('subject'))) {
          throw new SubmitError('We couldn’t create your ticket because our servers are busy. Nothing you typed has been lost. Please try again in a moment.');
        }
      },
      onSuccess: () => {
        const priority = form.elements.priority.value;
        $('[data-ticket-id]', success).textContent = `#NV-${Math.floor(10000 + Math.random() * 89999)}`;
        $('[data-ticket-sla]', success).textContent =
          `We’ve emailed a copy to ${form.elements.email.value.trim()}. Expected first reply: within ${SLA[priority]}.`;
        showSuccess(form);
      },
    });

    form.addEventListener('fk:reset', () => {
      files = [];
      fileError.textContent = '';
      renderFiles();
      urgentNote.hidden = true;
      slaEl.textContent = SLA.normal;
    });
  })();

  /* ======================================================================
     05 · Forge: quick-contact widget
     ====================================================================== */
  (() => {
    const launcher = $('[data-launcher]');
    const panel = $('#qc-panel');
    const form = $('#qc-form');
    const success = $('#qc-success');
    const callbackToggle = $('[data-callback-toggle]', form);
    const callbackTimes = $('[data-callback-times]', form);
    let open = false;

    function setOpen(next, { restoreFocus = true } = {}) {
      open = next;
      panel.dataset.state = open ? 'open' : 'closed';
      launcher.setAttribute('aria-expanded', String(open));
      if (open) {
        // The panel's contents become focusable a frame or two after it opens; retry briefly.
        const first = form.hidden ? $('button', success) : $('input', form);
        let tries = 12;
        const tryFocus = () => {
          if (!open || !first) return;
          first.focus({ preventScroll: true });
          if (document.activeElement !== first && tries-- > 0) requestAnimationFrame(tryFocus);
        };
        tryFocus();
      } else if (restoreFocus && panel.contains(document.activeElement)) {
        launcher.focus();
      }
    }

    launcher.addEventListener('click', () => setOpen(!open));
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
    document.addEventListener('pointerdown', (e) => {
      if (open && !panel.contains(e.target) && !launcher.contains(e.target)) setOpen(false, { restoreFocus: false });
    });

    callbackToggle.addEventListener('change', () => {
      callbackTimes.hidden = !callbackToggle.checked;
    });

    enhance(form, {
      onSubmit: () => fakeRequest(1100),
      onSuccess: () => {
        const data = new FormData(form);
        const contact = data.get('contact').trim();
        $('[data-qc-name]', success).textContent = data.get('name').trim();
        $('[data-qc-confirm]', success).textContent = data.get('callback')
          ? `A coach will call ${contact} in the ${data.get('callTime').toLowerCase()} about ${data.get('interest').toLowerCase()}.`
          : `A coach will reply to ${contact} about ${data.get('interest').toLowerCase()} within the hour.`;
        showSuccess(form);
      },
    });

    form.addEventListener('fk:reset', () => {
      callbackTimes.hidden = true;
    });
  })();
})();
