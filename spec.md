# Specification

## Summary
**Goal:** Redesign the Leave Application input section layout to a 3-column CSS grid with responsive behavior and fix spacing between the input and output sections.

**Planned changes:**
- Replace the current full-width stacked layout in the LeaveApplicationPage input section with a `display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;` layout
- Arrange form fields into exactly 4 rows: Row 1 (Recipient Type, Language, Your Name), Row 2 (Parent/Guardian Name, School/College Name, Class/Grade), Row 3 (Leave Date(s), Leave Duration Type, Reason for Leave), Row 4 (Absent Since Date, Medical Certificate Checkbox, empty placeholder)
- Remove `width: 100%` / `w-full` styling from inputs and selects so each field respects its grid cell width
- Add a responsive breakpoint so the grid collapses to a single column (`grid-template-columns: 1fr`) on viewports below 768px
- Remove excessive bottom margin/padding from the input card and tighten spacing so output action buttons sit near the bottom edge of the output card

**User-visible outcome:** The leave application form displays as a compact 3-column grid on desktop and stacks vertically on mobile, with balanced spacing between the input and output sections and no fields overflowing their grid cells.
