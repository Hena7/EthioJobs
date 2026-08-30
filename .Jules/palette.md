## 2024-05-23 - Screen Reader Experience for Notification Badges
**Learning:** Icon-only links with nested badge numbers (like notifications) result in confusing screen reader announcements (e.g., "3" without context) and require `aria-label` overrides on the parent link, along with `aria-hidden="true"` on the visual elements to prevent duplicated, disjointed reading.
**Action:** When adding numeric badges over icon-only buttons, always use a dynamic `aria-label` on the parent container reflecting the state and hide the visual nested elements from screen readers using `aria-hidden="true"`.
