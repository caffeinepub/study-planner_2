# Specification

## Summary
**Goal:** Add an add-only “Progress Charts” section to the Study Planner page that shows Daily and Weekly progress charts derived from existing task data.

**Planned changes:**
- Add a new UI section titled exactly "Progress Charts" rendered strictly below the existing Summary section, without modifying any existing UI elements.
- In Daily mode, display a compact chart (donut or bar) for completed vs pending tasks for today, plus a highlighted total study time value calculated from existing task durations.
- In Weekly mode, display a Mon–Sun chart with 7 labeled buckets showing daily study hours computed from existing tasks’ durations and completion status.
- Ensure charts auto-update immediately as tasks are added, deleted, cleared, or completion is toggled, using only existing frontend task state (guest/local utilities or already-fetched authenticated tasks) with no new backend work and no new storage for chart data.

**User-visible outcome:** The Study Planner page includes a new "Progress Charts" section below Summary that shows an automatically updating Daily completed-vs-pending + total study time view and a Weekly Mon–Sun study-hours chart, without any changes to the rest of the planner UI.
