# Specification

## Summary
**Goal:** Fix the Study Planner Weekly Progress chart so it reflects real task data for the current week by correctly interpreting backend task `date` values and recalculating metrics from the filtered weekly task list.

**Planned changes:**
- Update Weekly Progress chart date handling to unwrap backend optional/variant `date` values (e.g., `[] | [Time]`) into a usable `Time`/JavaScript `Date` before calling the existing `normalizeTaskDate`.
- Ensure the Weekly Progress chart derives all displayed metrics (total tasks, completed, pending, total time) exclusively from the `currentWeekTasks` filtered by the existing local-time week boundaries (Monday start through Sunday end).
- Make Weekly Progress chart calculations reactive to `tasks` prop changes so add/delete/toggle completion immediately updates the chart values without refresh.

**User-visible outcome:** In Weekly view, the Weekly Progress chart shows correct non-zero counts and time totals for tasks dated within the current week (including backend tasks with optional `date`), and updates instantly when tasks are added, deleted, or completed.
