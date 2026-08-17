## 2024-08-17 - Icon Button Accessibility
**Learning:** The layout components (header, sidebar, dashboard-layout) had icon-only buttons for toggling menus and sidebars without screen reader context.
**Action:** Always verify icon-only buttons have descriptive `aria-label` attributes and relevant state properties like `aria-expanded`.
