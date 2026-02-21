# Specification

## Summary
**Goal:** Remove the automatic multi-action bullet splitting feature from the Notes Cleaner while preserving all other existing functionality.

**Planned changes:**
- Remove all UI elements related to automatic paragraph-to-multiple-bullet conversion (labels, checkboxes, toggle controls)
- Disable and remove the background logic that automatically splits single sentences into multiple bullets based on action phrase detection
- Ensure each grammatically complete sentence converts into exactly one bullet point
- Retain Basic Bullet Formatting, Definition Style Format, and Headings Auto Detect features
- Preserve all existing UI controls (Clean Notes, Reset Output, TXT Download buttons, File Name option)

**User-visible outcome:** Users will see a simplified Notes Cleaner interface without multi-action splitting controls. Each sentence will be converted into a single bullet point without automatic subdivision, while all other formatting features continue to work as before.
