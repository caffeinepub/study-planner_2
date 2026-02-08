# Specification

## Summary
**Goal:** Add a progress bar to the Study Planner **Daily** view that matches the existing **Weekly** progress bar styling and behavior.

**Planned changes:**
- In `frontend/src/pages/StudyPlannerPage.tsx`, add a progress bar to the **Daily** tab positioned directly under the "Your Daily Study Tasks" heading and above the daily task list.
- Compute Daily progress as `(completed daily tasks / total daily tasks) × 100`, showing `0%` when there are no daily tasks.
- Reuse the existing Weekly progress bar styling exactly, ensuring Daily and Weekly progress remain independent and the Weekly progress bar remains unchanged.

**User-visible outcome:** When viewing the Daily tab, users see a progress bar under "Your Daily Study Tasks" reflecting completion of daily tasks only, without any other layout or UI changes.
