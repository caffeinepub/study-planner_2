# Specification

## Summary
**Goal:** Fix the Weekly Progress Chart so it calculates and displays correct current-week task counts and total completed study time using live task data.

**Planned changes:**
- Update `frontend/src/components/studyPlanner/WeeklyProgressChart.tsx` to derive `currentWeekTasks` by filtering the existing `tasks` prop to the local-time current week (Monday 00:00:00.000 through Sunday 23:59:59.999).
- Normalize task date handling so both backend optional date shapes (unwrap `[] | [Time]`) and guest task date values (`number | undefined`) are supported before passing into existing date-normalization logic.
- Recompute and bind Weekly Progress Chart stats from `currentWeekTasks` only: Total, Completed, Pending, and total time summed from completed tasks only using existing duration utilities.
- Ensure the Weekly Progress Chart recalculates immediately on task changes by keeping computations derived directly from the `tasks` prop with correct memoization dependencies.

**User-visible outcome:** Weekly Progress Chart no longer shows static zero values; it updates immediately to show accurate current-week totals (Total/Completed/Pending) and total completed study time without any UI/text/layout changes.
