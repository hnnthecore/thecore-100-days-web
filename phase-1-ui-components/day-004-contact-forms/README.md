# Day 004 · Contact Forms

Five contact forms that really work, each for a different real-world situation. All of them validate as you type with clear, human messages, show a loading state while sending, handle errors, and confirm success.

| # | Form | Situation | Highlights |
|---|------|-----------|------------|
| 01 | **Lumen** | B2B "talk to sales" | Rejects personal email domains, topic chips, character counter, linked error summary |
| 02 | **Halden** | Agency project brief | 4-step wizard: service cards, budget slider, timeline, review screen with "Edit" links |
| 03 | **Ember** | Restaurant booking | Blocks closed days, generates time slots from real opening hours (sold-out slots greyed), party-size stepper, live booking summary, booking reference |
| 04 | **Nova** | IT support ticket | Priority levels that change the promised reply time, drag-and-drop attachments with type/size checks, graceful server-error handling, ticket number |
| 05 | **Forge** | Quick-contact widget | Floating "Questions?" button, floating labels, accepts email *or* phone, optional call-back time |

## Run it

Open `index.html` in a browser, or from the repo root:

```bash
python -m http.server 5500
```

## The new shared form system

This day introduced two reusable building blocks that every future form uses:

- **`packages/design-system/forms.css`** contains every form control: inputs, selects, textareas, floating labels, checkboxes, chips, option cards, segmented controls, steppers, sliders, one-time-code boxes, drop zones, error messages, the loading button and success panels.
- **`packages/form-kit/form-kit.js`** is the validation and submit engine (**FormKit**):
  - It reads the HTML rules you already write (`required`, `type="email"`, `minlength`, `pattern`, `min`/`max`).
  - It adds friendly messages, which you can override with `data-msg-required` and similar attributes.
  - It checks a field after you leave it, then re-checks live while you fix it.
  - It wires up full screen-reader support (`aria-invalid`, `aria-describedby`, error summary).
  - It handles grouped options, matching fields (`data-match`), custom rules (`data-validate`) and character counters.
  - It runs the submit flow: loading → success, or loading → server error shown inline.

Submissions are simulated with `FormKit.fakeRequest()`. In Phase 3, each `onSubmit` becomes a real `fetch()` to an API or form service, and nothing else changes.

## Accessibility

- Every error is tied to its field and announced.
- The error summary links straight to each problem.
- Focus moves to the first problem, or to the next step in the wizard.
- Chips and cards keep real radio/checkbox inputs, so keyboards and screen readers work natively.
- The widget closes with Esc and returns focus to its button.
