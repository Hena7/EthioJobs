## 2024-05-18 - Missing ARIA Labels and Focus States
**Learning:** Found multiple icon-only interactive elements in the main navigation (e.g., Notifications, User Menu, Theme Toggle) that lacked ARIA labels and focus states for keyboard users. This is a common pattern when utilizing icons without text labels where accessibility states are easily overlooked.
**Action:** Consistently ensure that all newly created icon-only links or buttons are provided with an `aria-label` and the standard focus ring classes: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background`.

## 2026-09-12 - Missing Focus States in Layout & Notification Components
**Learning:** Verified that several important interactive layout elements (e.g., dashboard sidebar toggle, sidebar close button, and individual notification items) were completely missing visible focus states, significantly degrading keyboard navigation accessibility.
**Action:** When auditing or implementing interactive elements (`button`, `a`, `div` acting as buttons), immediately check for hover states and deliberately add equivalent `focus-visible` ring styling to maintain accessibility standards.
