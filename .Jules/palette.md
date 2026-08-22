## 2026-08-22 - File Upload Keyboard Accessibility
**Learning:** Using `display: none` (or Tailwind's `hidden`) on a file input completely removes it from the accessibility tree, making it impossible for keyboard users to navigate to the dropzone and interact with it.
**Action:** Use `sr-only` instead of `hidden` for visually hidden inputs that need to remain focusable and readable by screen readers, and add `focus-within` styles to the parent container so keyboard focus is visibly indicated when tabbing through the form.
