# Specification

## Summary
**Goal:** Apply 5 targeted fixes to the Leave Application Generator form and output section.

**Planned changes:**
- Add back the "Parent / Guardian Name" input field to the right of "Student Name" on the same row, each at 50% width, with required validation
- Move "Class / Grade" field to the right of "School / Institution Name" (Row 1: Student Name + Parent/Guardian Name; Row 2: School/Institution Name + Class/Grade)
- Move the Language dropdown to the same row as "Recipient Type", each at 50% width
- Add a "Clear" button to the output section after "Download PDF" that clears only the preview content without affecting inputs or reloading the page
- Fix the "Download PDF" button to use async handling with loading state ("Generating…"), button disable/re-enable, and try/catch error handling to prevent page freezing

**User-visible outcome:** The Leave Application form displays all fields in the correct two-row layout, the language selector is inline with Recipient Type, and the output section has a functioning Clear button and a non-freezing Download PDF button with loading feedback.
