/*!
 * Thecore FormKit
 * --------------------------------------------------------------------------
 * One small, dependency-free validation and submit engine for every form in
 * the portfolio. Markup stays plain HTML; FormKit reads the native attributes
 * you already write (required, type="email", minlength, pattern, min/max) and
 * adds:
 *   - friendly, specific error messages (override with data-msg-<rule>)
 *   - "validate after you leave a field, then live while you fix it" timing
 *   - full ARIA wiring: aria-invalid, aria-describedby, error summary
 *   - grouped radios/checkboxes   (<fieldset class="fld" data-group data-min="1">)
 *   - matching fields             (data-match="#password")
 *   - custom rules                (data-validate="ruleName" + FormKit.validators)
 *   - character counters          (.fld__counter next to a maxlength control)
 *   - submit lifecycle: loading button, success view, server-side errors
 *
 * Usage:
 *   FormKit.enhance(form, {
 *     onSubmit: async (data, form) => { await fetch(...) },  // throw FormKit.SubmitError to show errors
 *   });
 *
 * Markup conventions (see packages/design-system/forms.css):
 *   <div class="fld">
 *     <label class="fld__label" for="email">Email</label>
 *     <input class="input" id="email" name="email" type="email" required>
 *     <p class="fld__hint">We'll never share it.</p>      (optional)
 *     <p class="fld__error"></p>                          (optional, created if missing)
 *   </div>
 *   <form data-success="#thanks">  … shows #thanks (hidden) after a successful submit.
 * ========================================================================== */
(() => {
  'use strict';

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const CONTROL = 'input:not([type="submit"]):not([type="button"]):not([type="hidden"]), select, textarea';
  let uid = 0;

  /** Error thrown from onSubmit to show a form-level and/or per-field message. */
  class SubmitError extends Error {
    constructor(message, fieldErrors = {}) {
      super(message);
      this.fieldErrors = fieldErrors; // { fieldName: 'message' }
    }
  }

  /** Custom rules: FormKit.validators.name = (value, control, form) => 'error' | null */
  const validators = {};

  /* ------------------------------------------------------------------ */
  /* Helpers                                                              */
  /* ------------------------------------------------------------------ */
  const ensureId = (el, prefix) => {
    if (!el.id) el.id = `${prefix}-${++uid}`;
    return el.id;
  };

  const fieldOf = (control) => control.closest('[data-group]') || control.closest('.fld') || control.parentElement;
  const isGrouped = (control) => Boolean(control.closest('[data-group]'));

  function labelOf(field, control) {
    const source = field.querySelector('legend, .fld__label') || (control.labels && control.labels[0]);
    if (!source) return 'This field';
    const clone = source.cloneNode(true);
    clone.querySelectorAll('.fld__optional, .sr-only, abbr').forEach((n) => n.remove());
    return clone.textContent.trim().replace(/\s*\*$/, '') || 'This field';
  }

  function errorElOf(field) {
    let el = field.querySelector(':scope > .fld__error, .fld__error');
    if (!el) {
      el = document.createElement('p');
      el.className = 'fld__error';
      field.append(el);
    }
    ensureId(el, 'fk-err');
    return el;
  }

  function addDescribedBy(el, id) {
    const ids = new Set((el.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
    ids.add(id);
    el.setAttribute('aria-describedby', [...ids].join(' '));
  }

  const msg = (control, rule, fallback) => control.dataset[`msg${rule[0].toUpperCase()}${rule.slice(1)}`] || fallback;

  /* ------------------------------------------------------------------ */
  /* Rules                                                                */
  /* ------------------------------------------------------------------ */
  function checkControl(control, form) {
    const field = fieldOf(control);
    const label = labelOf(field, control);
    const type = control.type;

    if (type === 'checkbox') {
      return control.required && !control.checked ? msg(control, 'required', `Please tick this box to continue.`) : null;
    }

    if (type === 'file') {
      return control.required && !control.files.length ? msg(control, 'required', `Please attach a file.`) : null;
    }

    const value = control.value.trim();

    if (!value) {
      if (!control.required) return null;
      if (control.tagName === 'SELECT') return msg(control, 'required', `Please choose ${label.toLowerCase()}.`);
      return msg(control, 'required', `${label} is required.`);
    }

    if (type === 'email' && !EMAIL.test(value)) {
      return msg(control, 'email', 'Enter a valid email address, like name@example.com.');
    }

    if (control.minLength > 0 && value.length < control.minLength) {
      return msg(control, 'minlength', `${label} needs at least ${control.minLength} characters.`);
    }

    if (control.pattern && !new RegExp(`^(?:${control.pattern})$`).test(value)) {
      return msg(control, 'pattern', `${label} isn’t in the expected format.`);
    }

    if (control.validity.rangeUnderflow) return msg(control, 'min', `${label} must be ${control.min} or later.`);
    if (control.validity.rangeOverflow) return msg(control, 'max', `${label} must be ${control.max} or earlier.`);
    if (control.validity.badInput) return msg(control, 'format', `${label} isn’t valid.`);

    if (control.dataset.match) {
      const other = form.querySelector(control.dataset.match);
      if (other && other.value !== control.value) return msg(control, 'match', 'These don’t match.');
    }

    for (const name of (control.dataset.validate || '').split(/\s+/).filter(Boolean)) {
      const result = validators[name]?.(value, control, form);
      if (result) return result;
    }

    return null;
  }

  function checkGroup(group) {
    const inputs = [...group.querySelectorAll('input[type="radio"], input[type="checkbox"]')];
    const checked = inputs.filter((i) => i.checked).length;
    const min = Number(group.dataset.min || (inputs.some((i) => i.required) ? 1 : 0));
    if (checked >= min) return null;
    const label = labelOf(group, inputs[0]).toLowerCase();
    return group.dataset.msgRequired || (min > 1 ? `Please choose at least ${min} options.` : `Please choose ${label}.`);
  }

  /* ------------------------------------------------------------------ */
  /* Rendering state                                                      */
  /* ------------------------------------------------------------------ */
  function render(field, controls, message) {
    const errorEl = errorElOf(field);
    errorEl.textContent = message || '';
    field.classList.toggle('is-invalid', Boolean(message));
    controls.forEach((c) => {
      if (message) c.setAttribute('aria-invalid', 'true');
      else c.removeAttribute('aria-invalid');
    });
    return !message;
  }

  /** Validate one control (or its whole group). Returns true when valid. */
  function validateControl(control, form = control.form) {
    if (control.disabled || control.closest('[hidden], [inert]')) return true;
    if (isGrouped(control)) return validateGroup(control.closest('[data-group]'));
    return render(fieldOf(control), [control], checkControl(control, form));
  }

  /** Validate every control inside a container (a whole form, or one step). */
  function validateGroup(group) {
    if (group.disabled || group.closest('[hidden], [inert]')) return true;
    return render(group, [...group.querySelectorAll('input')], checkGroup(group));
  }

  /** Validate every control and group inside a container (a whole form, or one step). */
  function validate(scope) {
    const form = scope.tagName === 'FORM' ? scope : scope.closest('form');
    const invalid = [];

    // Document order, so the first error is the first one on screen
    scope.querySelectorAll(`${CONTROL}, [data-group]`).forEach((el) => {
      if (el.closest('[data-fk-ignore]')) return;
      if (el.matches('[data-group]')) {
        if (!validateGroup(el)) invalid.push(el);
        return;
      }
      if (isGrouped(el)) return; // its group handles it
      if (!validateControl(el, form)) invalid.push(el);
    });

    return invalid;
  }

  /** The element to focus for an invalid control or group. */
  function focusTargetOf(item) {
    if (item.matches(CONTROL)) return item;
    const input = item.querySelector('input:not(:disabled)');
    if (input) return input;
    item.tabIndex = -1; // empty group (e.g. options not loaded yet)
    return item;
  }

  function focusFirst(invalid) {
    if (invalid[0]) focusTargetOf(invalid[0]).focus();
  }

  function showSummary(form, invalid) {
    const box = form.querySelector('[data-error-summary]');
    if (!box) return false;
    if (!invalid.length) {
      box.hidden = true;
      return false;
    }
    const items = invalid.map((item) => {
      const target = focusTargetOf(item);
      const field = item.matches('[data-group]') ? item : fieldOf(item);
      return `<li><a href="#${ensureId(target, 'fk-ctl')}">${errorElOf(field).textContent}</a></li>`;
    });
    box.innerHTML = `<strong>Please fix ${invalid.length === 1 ? 'one thing' : `${invalid.length} things`} before sending:</strong><ul>${items.join('')}</ul>`;
    box.hidden = false;
    box.tabIndex = -1;
    box.focus();
    return true;
  }

  function clear(form) {
    form.querySelectorAll('.is-invalid').forEach((f) => f.classList.remove('is-invalid'));
    form.querySelectorAll('[aria-invalid]').forEach((c) => c.removeAttribute('aria-invalid'));
    form.querySelectorAll('.fld__error').forEach((e) => { e.textContent = ''; });
    const box = form.querySelector('[data-error-summary]');
    if (box) box.hidden = true;
    const alert = form.querySelector('[data-form-alert]');
    if (alert) alert.hidden = true;
  }

  /* ------------------------------------------------------------------ */
  /* Enhance                                                              */
  /* ------------------------------------------------------------------ */
  function enhance(form, options = {}) {
    if (form.dataset.fkReady) return form;
    form.dataset.fkReady = 'true';
    form.noValidate = true;

    const touched = new WeakSet();

    // Wire hints and errors to their controls (and groups) for screen readers
    const wire = (target, field) => {
      const hint = field.querySelector('.fld__hint');
      if (hint) addDescribedBy(target, ensureId(hint, 'fk-hint'));
      addDescribedBy(target, errorElOf(field).id);
    };
    form.querySelectorAll('[data-group]').forEach((group) => wire(group, group));
    form.querySelectorAll(CONTROL).forEach((control) => {
      if (isGrouped(control)) return;
      const field = fieldOf(control);
      if (field) wire(control, field);
    });

    // Live character counters
    form.querySelectorAll('[maxlength]').forEach((control) => {
      const counter = fieldOf(control)?.querySelector('.fld__counter');
      if (!counter) return;
      const max = control.maxLength;
      const update = () => {
        const n = control.value.length;
        counter.textContent = `${n} / ${max}`;
        counter.classList.toggle('is-near', n > max * 0.9);
      };
      control.addEventListener('input', update);
      update();
    });

    // Validate when leaving a field (only if the visitor actually typed),
    // then re-validate live while they fix it.
    form.addEventListener('focusout', (e) => {
      const control = e.target.closest(CONTROL);
      if (!control || !form.contains(control)) return;
      if (isGrouped(control)) {
        const group = control.closest('[data-group]');
        if (group.contains(e.relatedTarget)) return; // still inside the group
      }
      if (control.value || touched.has(control) || fieldOf(control).classList.contains('is-invalid')) {
        validateControl(control, form);
      }
    });

    form.addEventListener('input', (e) => {
      const control = e.target.closest(CONTROL);
      if (!control) return;
      touched.add(control);
      const field = fieldOf(control);
      if (field?.classList.contains('is-invalid')) validateControl(control, form);
      // Keep "confirm" fields honest when the original changes
      form.querySelectorAll(`[data-match="#${control.id}"]`).forEach((m) => {
        if (m.value && fieldOf(m).classList.contains('is-invalid')) validateControl(m, form);
      });
    });

    form.addEventListener('change', (e) => {
      const control = e.target.closest('input[type="radio"], input[type="checkbox"], select, input[type="file"]');
      if (control && fieldOf(control)?.classList.contains('is-invalid')) validateControl(control, form);
    });

    // Submit lifecycle
    let busy = false;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (busy) return;

      const invalid = validate(form);
      if (invalid.length) {
        if (!showSummary(form, invalid)) focusFirst(invalid);
        options.onInvalid?.(invalid, form);
        return;
      }
      showSummary(form, []);

      const alert = form.querySelector('[data-form-alert]');
      if (alert) alert.hidden = true;

      const button = e.submitter || form.querySelector('[type="submit"]');
      busy = true;
      button?.setAttribute('aria-busy', 'true');

      try {
        const result = await options.onSubmit?.(new FormData(form), form);
        if (options.onSuccess) options.onSuccess(result, form);
        else showSuccess(form);
      } catch (err) {
        const fieldErrors = err?.fieldErrors || {};
        const invalidFromServer = [];
        Object.entries(fieldErrors).forEach(([name, message]) => {
          const control = form.elements[name];
          const el = control instanceof RadioNodeList ? control[0] : control;
          if (!el) return;
          render(fieldOf(el), [el], message);
          invalidFromServer.push(el);
        });
        if (alert && err?.message) {
          alert.querySelector('[data-form-alert-text]')
            ? (alert.querySelector('[data-form-alert-text]').textContent = err.message)
            : (alert.textContent = err.message);
          alert.hidden = false;
        }
        focusFirst(invalidFromServer);
        if (!invalidFromServer.length && alert) alert.focus?.();
        options.onError?.(err, form);
      } finally {
        busy = false;
        button?.removeAttribute('aria-busy');
      }
    });

    // "Send another" buttons inside the success view
    const successView = form.dataset.success && document.querySelector(form.dataset.success);
    successView?.querySelectorAll('[data-form-reset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        form.reset();
        clear(form);
        form.dispatchEvent(new Event('fk:reset'));
        successView.hidden = true;
        form.hidden = false;
        form.querySelector(CONTROL)?.focus();
      });
    });

    return form;
  }

  function showSuccess(form) {
    const view = form.dataset.success && document.querySelector(form.dataset.success);
    if (!view) return;
    form.hidden = true;
    view.hidden = false;
    view.tabIndex = -1;
    view.focus();
  }

  /** Simulates a network request in demos. Replace with fetch() in production. */
  const fakeRequest = (ms = 1200) => new Promise((resolve) => setTimeout(resolve, ms));

  window.FormKit = { enhance, validate, validateControl, clear, showSuccess, validators, SubmitError, fakeRequest, EMAIL };
})();
