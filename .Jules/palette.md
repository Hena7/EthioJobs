## 2024-05-18 - Missing ARIA Labels and Focus States
**Learning:** Found multiple icon-only interactive elements in the main navigation (e.g., Notifications, User Menu, Theme Toggle) that lacked ARIA labels and focus states for keyboard users. This is a common pattern when utilizing icons without text labels where accessibility states are easily overlooked.
**Action:** Consistently ensure that all newly created icon-only links or buttons are provided with an `aria-label` and the standard focus ring classes: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background`.
## 2024-10-24 - Interactive button state feedback
**Learning:** Adding loading spinners and ARIA states to buttons significantly improves feedback for users, especially on form submission states where wait times are common. It also ensures screen reader accessibility for interactive choices.
**Action:** Always verify if interactive elements like buttons have appropriate `disabled`, `aria-pressed`, and loading states for better UX and a11y.
