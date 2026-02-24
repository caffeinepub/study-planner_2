# Specification

## Summary
**Goal:** Fix UI/UX and functional issues in the Leave Application Generator page, switching to manual generation mode and resolving several bugs.

**Planned changes:**
- Add a "Create Application" button below the input fields that is always visible; application generation only triggers on button click, removing all reactive/live generation logic
- Always render "Copy to Clipboard", "Download as PDF", and "Clear Output" buttons in the Output Section regardless of output state (no conditional rendering)
- Implement "Clear Output" button that immediately clears the preview and resets output state without page reload, keeping all three buttons visible
- Fix the date picker bug that prevents navigating and selecting dates beyond February; remove any unintended maxDate or month-range restrictions
- Fix language consistency so that when Urdu or Arabic is selected, the entire application output (body, subject, date, salutation, signature, labels) is generated exclusively in that language with no English mixed in, and RTL direction/alignment is applied to both the preview and PDF export
- Fix PDF export to faithfully match the on-screen preview with consistent line spacing, correct paragraph alignment, and no extra blank lines

**User-visible outcome:** Users can manually trigger application generation via a dedicated button, always see all output action buttons, clear the output without a page reload, navigate the date picker freely across all months, receive fully translated Urdu/Arabic output with proper RTL layout, and download a PDF that accurately matches the preview.
