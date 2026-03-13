/**
 * Extracts the first word from cleaned notes output
 * Ignores leading whitespace and common bullet prefixes
 * Returns sanitized first word or 'notes' as fallback
 */
function extractFirstWord(cleanedNotes: string): string {
  // Remove leading whitespace
  const trimmed = cleanedNotes.trim();

  if (trimmed.length === 0) {
    return "notes";
  }

  // Remove common bullet prefixes (dash, dot, asterisk with optional space)
  const withoutBullet = trimmed.replace(/^[-•*]\s*/, "");

  // Extract first word (split by whitespace)
  const words = withoutBullet.split(/\s+/).filter((w) => w.length > 0);

  if (words.length === 0) {
    return "notes";
  }

  // Get first word and remove any trailing punctuation
  const firstWord = words[0].replace(/[.,!?;:]+$/, "");

  return firstWord;
}

/**
 * Sanitizes a string for use in a filename
 * Converts to lowercase, replaces spaces with underscores, removes special characters
 */
function sanitizeForFilename(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/[^a-z0-9_]/g, "") // Remove non-alphanumeric characters except underscores
    .replace(/_+/g, "_") // Collapse multiple underscores
    .replace(/^_|_$/g, ""); // Remove leading/trailing underscores
}

/**
 * Gets the current date in YYYY-MM-DD format
 */
function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Generates a filename for the TXT download
 * Uses custom name if provided, otherwise auto-generates based on first word and date
 */
function generateFilename(customName: string, cleanedNotes: string): string {
  // If custom name is provided, use it
  if (customName.trim().length > 0) {
    let filename = customName.trim();
    // Add .txt extension if not present
    if (!filename.toLowerCase().endsWith(".txt")) {
      filename += ".txt";
    }
    return filename;
  }

  // Auto-generate filename: notes_<first_word_of_output>_<YYYY-MM-DD>.txt
  const firstWord = extractFirstWord(cleanedNotes);
  const sanitizedWord = sanitizeForFilename(firstWord);
  const date = getCurrentDate();

  // Fallback to 'notes' if sanitization results in empty string
  const wordPart = sanitizedWord.length > 0 ? sanitizedWord : "notes";

  return `notes_${wordPart}_${date}.txt`;
}

/**
 * Downloads cleaned notes as a plain text file
 * @param cleanedNotes - The cleaned notes content to download
 * @param customFileName - Optional custom filename (without extension)
 */
export function downloadNotesAsTxt(
  cleanedNotes: string,
  customFileName = "",
): void {
  if (!cleanedNotes.trim()) {
    return;
  }

  // Generate filename
  const filename = generateFilename(customFileName, cleanedNotes);

  // Create blob with plain text content
  const blob = new Blob([cleanedNotes], { type: "text/plain;charset=utf-8" });

  // Create temporary object URL
  const url = URL.createObjectURL(blob);

  // Create temporary anchor element and trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
