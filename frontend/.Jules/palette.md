## 2024-08-21 - [Dynamic Search Results Accessibility]
**Learning:** Dynamic search result counts (e.g., "X jobs found") update visually but are invisible to screen readers without ARIA live regions. Using `aria-live="polite"` and `aria-atomic="true"` ensures these crucial updates are announced to assistive technologies without interrupting the user's flow.
**Action:** Always add `aria-live` to dynamically updating text counters, especially on search and filtering pages, so screen reader users are immediately aware of the result of their actions.
