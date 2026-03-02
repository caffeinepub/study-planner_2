/**
 * Formats a Date object into a human-readable string like "February 28, 2026".
 * Does NOT include any "Date:" prefix — that label belongs in the template.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats a date range into a human-readable leave duration string.
 * E.g. "February 28, 2026 to March 2, 2026 (3 days)"
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  if (start === end) {
    return `${start} (1 day)`;
  }

  return `${start} to ${end} (${diffDays} days)`;
}

/**
 * Formats a single date for display in the leave application letter header.
 * Returns only the date string, e.g. "February 28, 2026" — no label.
 */
export function formatLetterDate(date: Date): string {
  return formatDate(date);
}
