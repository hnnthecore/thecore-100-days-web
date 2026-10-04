# Day 005 · Login & Sign-up

Five authentication screens, built the way serious products build them. Everything is **simulated in the browser**: nothing is sent or stored. Real accounts (secure password storage, sessions, server-side rate limiting, email delivery) are built in Phase 4. These screens are designed so that only each `onSubmit` needs replacing.

| # | Screen | Best for | Highlights |
|---|--------|----------|------------|
| 01 | **Lumen** split-screen sign in | SaaS | Google / Microsoft buttons, show-password toggle, Caps Lock warning, "keep me signed in", wrong-password message, lockout with countdown after 3 failed attempts |
| 02 | **Atlas** sign up | Any product | Live strength meter + checklist, blocks very common passwords, fixes email typos ("Did you mean gmail.com?"), confirm password, terms, verify-email screen with resend timer |
| 03 | **Nova** passwordless code | Apps, internal tools | Email → 6-digit code; boxes auto-advance, accept paste and phone autofill, support Backspace and arrow keys, and auto-submit; resend timer |
| 04 | **Norde** shop account | E-commerce | Sign in / Create account tabs, built-in password reset, guest checkout, welcome-discount message |
| 05 | **Orbit** sign-in modal | Communities, content sites | Appears only when a guest tries to like or save; explains why; focus trap; finishes the original action after sign-in |

## Demo tips

- Sign in with the password `wrongpass` to see the error, then the lockout on the third try.
- Sign up with `password123` to see the common-password block; type `name@gmial.com` to see the typo fix.
- The one-time code is `246810`. Paste it into the first box to see auto-submit.

## Security & UX practices built in

- **Password-manager friendly.** Correct `autocomplete` values (`username`, `current-password`, `new-password`, `one-time-code`) mean browsers and password managers fill and save credentials properly.
- **No account probing.** Wrong-password and password-reset messages never reveal whether an email is registered.
- **Lockout feedback.** Repeated failures trigger a visible cooldown. In Phase 4 this is enforced on the server too.
- **Helpful, not hostile, password rules.** The checklist shows progress, length beats complexity, and only genuinely weak or common passwords are blocked.
- **Accessibility.**
  - Show-password buttons announce their state.
  - Errors are announced and linked to their fields.
  - Each one-time-code box is labelled ("Digit 3 of 6").
  - The modal traps focus, closes with Esc and returns focus to the button that opened it.

Built on the shared FormKit engine and form styles introduced on Day 004.
