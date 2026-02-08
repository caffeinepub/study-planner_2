# Specification

## Summary
**Goal:** Fix the Study Planner so the Daily tab shows the same progress bar UI as Weekly, correctly reflecting Daily-task completion.

**Planned changes:**
- In `frontend/src/pages/StudyPlannerPage.tsx`, render the existing progress bar component in the Daily view, visible only when the Daily tab is active and matching the Weekly progress bar styling.
- Place the Daily progress bar directly under the "Your Daily Study Tasks" heading and above the daily task list, using the same spacing/margins as the Weekly progress bar placement, without moving other UI elements.
- Compute Daily progress from Daily tasks only and hide the progress bar when there are 0 daily tasks; show it (with percentage) when there is at least 1 daily task.
- If the Daily progress bar still does not render after binding to Daily tab state, add targeted console logging in `StudyPlannerPage.tsx` for `currentView`, daily totals/completed, and computed percent (no UI/styling changes).

**User-visible outcome:** When the Daily tab is active and there is at least one daily task, users see a progress bar under "Your Daily Study Tasks" showing Daily completion percentage; Weekly view remains unchanged.
