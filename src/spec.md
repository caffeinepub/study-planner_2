# Specification

## Summary
**Goal:** Rebuild the Cleaned Notes output panel action area to add Clear Output, a File Name input, and a Download TXT action with consistent reset behavior and filename rules.

**Planned changes:**
- Update only the "Cleaned Notes" output panel UI in `frontend/src/pages/NotesCleanerPage.tsx` to use this layout: Copy + Clear Output buttons in the same row under the textarea, a "File Name" input below, and a "Download TXT" button below the input, with responsive stacking on small screens.
- Implement Clear Output behavior to empty the cleaned output, reset the File Name input, reset any "Copied!" UI state, and hide Download TXT when output is empty.
- Add auto-reset when "Clean Notes" is clicked so prior output does not stack and both File Name and Copy state reset before showing the new result.
- Update TXT download logic in `frontend/src/utils/notesCleanerTxtDownload.ts` to export plain text exactly as shown, and apply filename rules (custom name with enforced `.txt`, otherwise `notes_<first_word_of_output>_<YYYY-MM-DD>.txt` with first word sanitized and bullet prefixes ignored).

**User-visible outcome:** Users can copy or clear cleaned output, optionally enter a file name, and download the cleaned notes as a plain-text `.txt` file with predictable naming; controls remain responsive and Download TXT only appears when there is output.
