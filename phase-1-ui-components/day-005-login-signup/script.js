/*!
 * Thecore · 100 Days of Web Development
 * Day 005: Login & Sign-up
 *
 * IMPORTANT: everything here is a front-end simulation. Nothing is sent
 * anywhere and nothing is stored. Real authentication (hashed passwords,
 * sessions, rate limiting on the server, email delivery) is built in Phase 4;
 * these screens are designed so that only each onSubmit needs replacing.
 */
(() => {
  'use strict';

  const { $, $$ } = window.Thecore;
  const { enhance, validators, SubmitError, fakeRequest, clear, showSuccess } = window.FormKit;

  /* ======================================================================
     Shared helpers
     ====================================================================== */

  /** Focus an element that is being revealed (retries while it becomes focusable). */
  function focusSoon(el, tries = 12) {
    if (!el) return;
    el.focus({ preventScroll: true });
    if (document.activeElement !== el && tries > 0) requestAnimationFrame(() => focusSoon(el, tries - 1));
  }

  /** Swap between two views inside a container. */
  function show(view, ...others) {
    others.forEach((o) => { o.hidden = true; });
    view.hidden = false;
  }

  // Show / hide password buttons
  $$('[data-password-toggle]').forEach((btn) => {
    const input = document.getElementById(btn.getAttribute('aria-controls'));
    const use = $('use', btn);
    btn.addEventListener('click', () => {
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      btn.setAttribute('aria-pressed', String(!showing));
      btn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
      use.setAttribute('href', showing ? '#i-eye' : '#i-eye-off');
      // Keep the caret where the user was typing
      const pos = input.selectionStart;
      input.focus();
      input.setSelectionRange(pos, pos);
    });
  });

  // Caps Lock warning on password fields
  $$('[data-caps]').forEach((input) => {
    const warning = $('[data-caps-warning]', input.closest('.fld'));
    if (!warning) return;
    const check = (e) => {
      if (typeof e.getModifierState === 'function') warning.hidden = !e.getModifierState('CapsLock');
    };
    input.addEventListener('keydown', check);
    input.addEventListener('keyup', check);
    input.addEventListener('blur', () => { warning.hidden = true; });
  });

  /* ======================================================================
     01 · Lumen: sign in with attempts + lockout
     ====================================================================== */
  (() => {
    const form = $('#signin-form');
    const view = $('#signin-view');
    const success = $('#signin-success');
    const alert = $('[data-form-alert]', form);
    const alertText = $('[data-form-alert-text]', form);
    const submit = $('[type="submit"]', form);
    const MAX_ATTEMPTS = 3;
    const LOCK_SECONDS = 30;
    let attempts = 0;
    let lockTimer = 0;

    const nameFrom = (email) => {
      const local = email.split('@')[0].split(/[._-]/)[0];
      return local.charAt(0).toUpperCase() + local.slice(1);
    };

    function signedIn(heading) {
      $('[data-signin-welcome]', success).textContent = heading;
      show(success, view);
      focusSoon(success.querySelector('button'));
    }

    function startLockout() {
      let remaining = LOCK_SECONDS;
      submit.disabled = true;
      alert.classList.add('is-locked');
      const tick = () => {
        alertText.textContent = `Too many attempts. For your security, please wait ${remaining}s before trying again.`;
        if (remaining-- <= 0) {
          clearInterval(lockTimer);
          submit.disabled = false;
          alert.hidden = true;
          alert.classList.remove('is-locked');
          attempts = 0;
        }
      };
      tick();
      alert.hidden = false;
      lockTimer = setInterval(tick, 1000);
    }

    enhance(form, {
      onSubmit: async (data) => {
        await fakeRequest(900);
        if (data.get('password') === 'wrongpass') {
          attempts += 1;
          if (attempts >= MAX_ATTEMPTS) throw new SubmitError('locked');
          const left = MAX_ATTEMPTS - attempts;
          // Never reveal whether the email exists: one message for both cases
          throw new SubmitError(`Incorrect email or password. ${left} ${left === 1 ? 'attempt' : 'attempts'} left before a short lockout.`);
        }
        return nameFrom(data.get('email'));
      },
      onSuccess: (name) => signedIn(`Welcome back, ${name}`),
      onError: (err) => {
        form.elements.password.value = '';
        if (err.message === 'locked') startLockout();
        else focusSoon(form.elements.password);
      },
    });

    $$('[data-sso]', view).forEach((btn) => {
      btn.addEventListener('click', async () => {
        btn.setAttribute('aria-busy', 'true');
        await fakeRequest(900);
        btn.removeAttribute('aria-busy');
        signedIn(`Signed in with ${btn.dataset.sso}`);
      });
    });

    $('[data-signout]', success).addEventListener('click', () => {
      form.reset();
      clear(form);
      clearInterval(lockTimer);
      submit.disabled = false;
      attempts = 0;
      show(view, success);
      focusSoon(form.elements.email);
    });
  })();

  /* ======================================================================
     02 · Atlas: sign up with strength meter + email typo suggestion
     ====================================================================== */
  const COMMON_PASSWORDS = new Set([
    'password', 'password1', 'password123', '12345678', '123456789', '1234567890', 'qwerty123', 'qwertyuiop',
    'iloveyou', 'admin123', 'welcome1', 'letmein1', 'football', 'sunshine', 'princess', 'abc12345', 'passw0rd',
  ]);

  function scorePassword(pw) {
    const rules = {
      length: pw.length >= 8,
      case: /[a-z]/.test(pw) && /[A-Z]/.test(pw),
      number: /\d/.test(pw),
      symbol: /[^A-Za-z0-9]/.test(pw),
    };
    if (!pw) return { score: 0, rules, label: 'Use 8 or more characters' };
    if (COMMON_PASSWORDS.has(pw.toLowerCase())) return { score: 1, rules, label: 'Too common', common: true };

    let score = Object.values(rules).filter(Boolean).length;
    if (pw.length >= 14) score += 1;
    if (/(.)\1{2,}/.test(pw) || /(?:0123|1234|2345|3456|4567|5678|6789|abcd|qwer)/i.test(pw)) score -= 1;
    if (!rules.length) score = Math.min(score, 1);
    score = Math.max(1, Math.min(4, score));
    return { score, rules, label: ['', 'Weak', 'Fair', 'Good', 'Strong'][score] };
  }

  validators.strongPassword = (value) => {
    const { score, common } = scorePassword(value);
    if (common) return 'That’s one of the most common passwords. Please choose something more unique.';
    if (score < 2) return 'Please choose a stronger password: add length, numbers or symbols.';
    return null;
  };

  // Email typo suggestions ("gmial.com" → "gmail.com")
  const KNOWN_DOMAINS = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'proton.me', 'live.com', 'aol.com'];

  function distance(a, b) {
    const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
    for (let j = 1; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
    }
    return dp[a.length][b.length];
  }

  function suggestEmail(email) {
    const [local, domain] = email.toLowerCase().split('@');
    if (!local || !domain || KNOWN_DOMAINS.includes(domain)) return null;
    let best = null;
    KNOWN_DOMAINS.forEach((d) => {
      const dist = distance(domain, d);
      if (dist > 0 && dist <= 2 && (!best || dist < best.dist)) best = { d, dist };
    });
    return best ? `${local}@${best.d}` : null;
  }

  (() => {
    const form = $('#signup-form');
    const success = $('#signup-success');
    const pass = form.elements.password;
    const strength = $('[data-strength]', form);
    const strengthLabel = $('[data-strength-label]', form);
    const rules = $$('[data-rule]', form);
    const email = form.elements.email;
    const typoHint = $('[data-typo-hint]', form);
    const typoFix = $('[data-typo-fix]', form);
    const resend = $('[data-resend]', success);
    const resendTimer = $('[data-resend-timer]', success);
    const resendStatus = $('[data-resend-status]', success);
    let countdown = 0;

    function updateStrength() {
      const { score, rules: met, label } = scorePassword(pass.value);
      strength.dataset.score = pass.value ? score : 0;
      strengthLabel.textContent = pass.value ? `Strength: ${label}` : label;
      rules.forEach((r) => r.classList.toggle('is-met', Boolean(met[r.dataset.rule])));
    }
    pass.addEventListener('input', updateStrength);

    const checkTypo = () => {
      const suggestion = suggestEmail(email.value.trim());
      typoHint.hidden = !suggestion;
      if (suggestion) typoFix.textContent = suggestion;
    };
    email.addEventListener('blur', checkTypo);
    email.addEventListener('input', () => { if (!typoHint.hidden) checkTypo(); });
    typoFix.addEventListener('click', () => {
      email.value = typoFix.textContent;
      typoHint.hidden = true;
      email.dispatchEvent(new Event('input', { bubbles: true }));
      email.focus();
    });

    function startResendTimer() {
      let s = 30;
      resend.disabled = true;
      resend.innerHTML = 'Resend email in <span data-resend-timer>30</span>s';
      clearInterval(countdown);
      countdown = setInterval(() => {
        s -= 1;
        const t = $('[data-resend-timer]', resend);
        if (t) t.textContent = s;
        if (s <= 0) {
          clearInterval(countdown);
          resend.disabled = false;
          resend.textContent = 'Resend email';
        }
      }, 1000);
    }

    resend.addEventListener('click', async () => {
      resend.setAttribute('aria-busy', 'true');
      await fakeRequest(800);
      resend.removeAttribute('aria-busy');
      resendStatus.textContent = 'Sent again. It can take a minute to arrive.';
      startResendTimer();
    });

    enhance(form, {
      onSubmit: () => fakeRequest(1300),
      onSuccess: () => {
        $('[data-verify-email]', success).textContent = email.value.trim();
        resendStatus.textContent = '';
        showSuccess(form);
        startResendTimer();
      },
    });

    form.addEventListener('fk:reset', () => {
      clearInterval(countdown);
      typoHint.hidden = true;
      updateStrength();
    });

    resendTimer.textContent = '30';
    updateStrength();
  })();

  /* ======================================================================
     03 · Nova: passwordless one-time code
     ====================================================================== */
  (() => {
    const flow = $('[data-otp-flow]');
    const steps = {
      email: $('[data-otp-step="email"]', flow),
      code: $('[data-otp-step="code"]', flow),
      done: $('[data-otp-step="done"]', flow),
    };
    const emailForm = $('#otp-email-form');
    const codeForm = $('#otp-code-form');
    const boxes = $$('[data-otp] input', codeForm);
    const otp = $('[data-otp]', codeForm);
    const error = $('[data-otp-error]', codeForm);
    const verifyBtn = $('[type="submit"]', codeForm);
    const resend = $('[data-otp-resend]', codeForm);
    const DEMO_CODE = $('[data-demo-code]', codeForm).textContent.trim();
    let timer = 0;
    let busy = false;

    const goTo = (name) => {
      show(steps[name], ...Object.values(steps).filter((s) => s !== steps[name]));
    };

    function startTimer() {
      let s = 30;
      resend.disabled = true;
      resend.innerHTML = 'Resend code in <span data-otp-timer>30</span>s';
      clearInterval(timer);
      timer = setInterval(() => {
        s -= 1;
        const t = $('[data-otp-timer]', resend);
        if (t) t.textContent = s;
        if (s <= 0) {
          clearInterval(timer);
          resend.disabled = false;
          resend.textContent = 'Resend code';
        }
      }, 1000);
    }

    function resetBoxes() {
      boxes.forEach((b) => { b.value = ''; b.removeAttribute('aria-invalid'); });
      otp.classList.remove('is-correct');
    }

    /** Spread a string of digits across the boxes starting at index. */
    function fill(digits, start = 0) {
      const clean = digits.replace(/\D/g, '').slice(0, boxes.length - start);
      [...clean].forEach((d, i) => { boxes[start + i].value = d; });
      const next = Math.min(start + clean.length, boxes.length - 1);
      boxes[next].focus();
      if (boxes.every((b) => b.value)) codeForm.requestSubmit();
    }

    boxes.forEach((box, i) => {
      box.addEventListener('input', () => {
        error.textContent = '';
        boxes.forEach((b) => b.removeAttribute('aria-invalid'));
        if (box.value.length > 1) {
          // Paste or SMS autofill into one box
          const value = box.value;
          box.value = '';
          fill(value, i);
          return;
        }
        box.value = box.value.replace(/\D/g, '');
        if (box.value && i < boxes.length - 1) boxes[i + 1].focus();
        if (boxes.every((b) => b.value)) codeForm.requestSubmit();
      });

      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !box.value && i > 0) {
          e.preventDefault();
          boxes[i - 1].value = '';
          boxes[i - 1].focus();
        } else if (e.key === 'ArrowLeft' && i > 0) {
          e.preventDefault();
          boxes[i - 1].focus();
        } else if (e.key === 'ArrowRight' && i < boxes.length - 1) {
          e.preventDefault();
          boxes[i + 1].focus();
        }
      });

      box.addEventListener('paste', (e) => {
        e.preventDefault();
        fill(e.clipboardData.getData('text'), i);
      });

      box.addEventListener('focus', () => box.select());
    });

    enhance(emailForm, {
      onSubmit: () => fakeRequest(900),
      onSuccess: () => {
        $('[data-otp-email]', flow).textContent = emailForm.elements.email.value.trim();
        resetBoxes();
        error.textContent = '';
        goTo('code');
        startTimer();
        focusSoon(boxes[0]);
      },
    });

    codeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (busy) return;
      const code = boxes.map((b) => b.value).join('');
      if (code.length < boxes.length) {
        error.textContent = 'Enter all 6 digits of the code.';
        boxes.find((b) => !b.value)?.focus();
        return;
      }

      busy = true;
      verifyBtn.setAttribute('aria-busy', 'true');
      await fakeRequest(800);
      verifyBtn.removeAttribute('aria-busy');
      busy = false;

      if (code === DEMO_CODE) {
        otp.classList.add('is-correct');
        await fakeRequest(400);
        clearInterval(timer);
        goTo('done');
        focusSoon(steps.done);
      } else {
        error.textContent = 'That code isn’t right. Check your email and try again.';
        boxes.forEach((b) => b.setAttribute('aria-invalid', 'true'));
        otp.classList.remove('is-shaking');
        void otp.offsetWidth;
        otp.classList.add('is-shaking');
        boxes.forEach((b) => { b.value = ''; });
        boxes[0].focus();
      }
    });

    resend.addEventListener('click', async () => {
      resend.setAttribute('aria-busy', 'true');
      await fakeRequest(700);
      resend.removeAttribute('aria-busy');
      error.textContent = '';
      resetBoxes();
      startTimer();
      boxes[0].focus();
    });

    $('[data-otp-back]', flow).addEventListener('click', () => {
      clearInterval(timer);
      goTo('email');
      focusSoon(emailForm.elements.email);
    });

    $('[data-otp-restart]', flow).addEventListener('click', () => {
      emailForm.reset();
      clear(emailForm);
      goTo('email');
      focusSoon(emailForm.elements.email);
    });
  })();

  /* ======================================================================
     04 · Norde: tabbed account card + password reset
     ====================================================================== */
  (() => {
    const card = $('[data-shop]');
    const views = $$('[data-shop-view]', card);
    const tablist = $('[role="tablist"]', card);
    const tabs = $$('[role="tab"]', card);
    const forms = $$('form', card);
    const doneTitle = $('[data-shop-done-title]', card);
    const doneText = $('[data-shop-done-text]', card);

    function goTo(name) {
      const view = views.find((v) => v.dataset.shopView === name);
      show(view, ...views.filter((v) => v !== view));
      if (name === 'main') {
        forms.forEach((f) => { f.reset(); clear(f); });
        select(tabs[0]);
      }
      focusSoon($('h3, input', view));
    }

    function select(tab, { focus = false } = {}) {
      tabs.forEach((t, i) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
        if (on) tablist.style.setProperty('--tab', i);
      });
      if (focus) tab.focus();
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        const keys = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
        if (!(e.key in keys)) return;
        e.preventDefault();
        select(tabs[(keys[e.key] + tabs.length) % tabs.length], { focus: true });
      });
    });

    $$('[data-shop-go]', card).forEach((btn) => btn.addEventListener('click', () => goTo(btn.dataset.shopGo)));

    const done = (title, text) => {
      doneTitle.textContent = title;
      doneText.textContent = text;
      goTo('done');
    };

    enhance($('#shop-in-form'), {
      onSubmit: () => fakeRequest(1000),
      onSuccess: () => done('Welcome back', 'Your saved basket and order history are ready.'),
    });

    const upForm = $('#shop-up-form');
    enhance(upForm, {
      onSubmit: () => fakeRequest(1200),
      onSuccess: () => done(
        `Welcome to Norde, ${upForm.elements.first.value.trim()}`,
        upForm.elements.news.checked
          ? 'Your account is ready. Your 10% welcome code NORDE10 is on its way to your inbox.'
          : 'Your account is ready. Happy browsing.',
      ),
    });

    const resetForm = $('#shop-reset-form');
    enhance(resetForm, {
      onSubmit: () => fakeRequest(1000),
      // Same message whether or not the account exists, so emails can't be probed
      onSuccess: () => done('Check your email', `If an account exists for ${resetForm.elements.email.value.trim()}, we’ve sent a link to reset your password. It expires in 30 minutes.`),
    });
  })();

  /* ======================================================================
     05 · Orbit: contextual sign-in modal
     ====================================================================== */
  (() => {
    const feed = $('[data-feed]');
    const modal = $('#auth-modal');
    const dialog = $('.modal__dialog', modal);
    const form = $('#modal-form');
    const title = $('[data-modal-title]', modal);
    const reason = $('[data-modal-reason]', modal);
    const userSlot = $('[data-feed-user]', feed);
    const toast = $('[data-toast]');
    const scroller = modal.closest('[data-scroll-root]');
    const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled])';

    const CONTEXT = {
      like: ['Sign in to like this post', 'Show the author some love. We’ll remember what you liked.', 'Post liked'],
      save: ['Sign in to save this post', 'Build your reading list and pick up where you left off on any device.', 'Saved to your reading list'],
      signin: ['Sign in to Orbit', 'Join thousands of designers sharing their best work.', null],
    };

    let signedIn = false;
    let pending = null; // { button, action }
    let toastTimer = 0;

    const showToast = (text) => {
      toast.textContent = text;
      toast.classList.add('is-visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
    };

    const perform = (button, action) => {
      if (action === 'signin') return;
      const pressed = button.getAttribute('aria-pressed') === 'true';
      button.setAttribute('aria-pressed', String(!pressed));
      $('span', button).textContent = action === 'like' ? (pressed ? 'Like' : 'Liked') : (pressed ? 'Save' : 'Saved');
      showToast(pressed ? 'Removed' : CONTEXT[action][2]);
    };

    function open(button, action) {
      pending = { button, action };
      const [t, r] = CONTEXT[action];
      title.textContent = t;
      reason.textContent = r;
      modal.dataset.state = 'open';
      if (scroller) scroller.style.overflow = 'hidden';
      focusSoon($('.sso__btn', dialog));
    }

    function close({ restore = true } = {}) {
      modal.dataset.state = 'closed';
      if (scroller) scroller.style.overflow = '';
      if (restore && pending?.button?.isConnected) pending.button.focus();
    }

    function completeSignIn(name) {
      signedIn = true;
      userSlot.innerHTML = `<span class="avatar" style="--h: 265">${name.slice(0, 2).toUpperCase()}</span><span>${name}</span>`;
      const { button, action } = pending || {};
      close({ restore: action !== 'signin' });
      if (button && action !== 'signin') perform(button, action);
      else showToast(`Welcome, ${name}`);
      form.reset();
      clear(form);
    }

    feed.addEventListener('click', (e) => {
      const button = e.target.closest('[data-auth-open]');
      if (!button) return;
      if (signedIn) perform(button, button.dataset.action);
      else open(button, button.dataset.action);
    });

    $$('[data-modal-close]', modal).forEach((el) => el.addEventListener('click', () => close()));

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      // Keep keyboard focus inside the dialog
      const items = $$(FOCUSABLE, dialog).filter((el) => el.offsetParent !== null);
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    $$('[data-modal-sso]', modal).forEach((btn) => {
      btn.addEventListener('click', async () => {
        btn.setAttribute('aria-busy', 'true');
        await fakeRequest(900);
        btn.removeAttribute('aria-busy');
        completeSignIn('Riya');
      });
    });

    enhance(form, {
      onSubmit: async (data) => {
        await fakeRequest(1000);
        const local = data.get('email').split('@')[0].split(/[._-]/)[0];
        return local.charAt(0).toUpperCase() + local.slice(1);
      },
      onSuccess: (name) => completeSignIn(name),
    });
  })();
})();
