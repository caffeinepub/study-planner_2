# Specification

## Summary
**Goal:** Improve the Study Planner subject filter by persisting the last selected subject per view (Daily vs Weekly) and enhancing the dropdown with in-menu search and per-mode subject task counts, without any layout changes.

**Planned changes:**
- Persist the selected subject filter to localStorage when changed, using separate saved values for Daily and Weekly views.
- Restore and apply the saved subject filter on page load and when switching between Daily ↔ Weekly, initializing filter state synchronously from localStorage to avoid flicker.
- Enhance the existing subject filter dropdown content to include an in-dropdown search input that filters subjects by name as the user types.
- Display each subject option label with the task count for the currently active mode, formatted like `Math (5)`, without increasing dropdown width or changing page layout.

**User-visible outcome:** The subject filter remembers your last selection separately for Daily and Weekly views (including after refresh), and the dropdown lets you search subjects and see mode-accurate task counts next to each subject name—all without any layout shifts.
