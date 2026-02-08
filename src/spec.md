# Specification

## Summary
**Goal:** Restore the original Study Planner task list UI layout (buttons and task cards) without changing functionality.

**Planned changes:**
- Keep the existing progress bar exactly as-is and in the same position (directly below the task panel heading text and directly above the task list), including the percentage text.
- Group all task list action buttons (Sort, Clear, Download TXT, Download PDF) together in a single horizontal row at the top-right of the task list panel header; remove any instances of these buttons elsewhere in the panel.
- Remove any large/filled subject- or priority-colored backgrounds/blocks inside task cards, returning cards to the neutral/light default background while keeping subject as a small pill badge and priority as a small badge only.
- Restore the original compact task card structure: left checkbox; central content (subject + badges, topic, duration + date/time in smaller text); and a right-aligned delete (trash) icon, with no redesigned/expanded/extra-emphasis UI.
- Ensure no other StudyPlannerPage UI is moved or restyled beyond what’s strictly necessary (do not move the Daily/Weekly toggle; do not change the Add Task form; no new animations or new styling patterns).

**User-visible outcome:** The Study Planner task list looks and feels like the prior compact design: progress bar unchanged, all action buttons are back at the top-right in one row, and task cards are neutral and compact with the original checkbox/content/delete layout.
