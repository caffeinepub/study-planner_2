/**
 * Utility functions for parsing and formatting Study Planner task durations.
 * Handles duration strings like "30 minutes", "1 hour", "1.5 hours", etc.
 */

/**
 * Parse a duration string into total minutes.
 * Returns 0 for unparseable values (never throws).
 */
export function parseDurationToMinutes(duration: string): number {
  if (!duration || typeof duration !== 'string') {
    return 0;
  }

  const trimmed = duration.trim().toLowerCase();
  
  // Match patterns like "30 minutes", "1 hour", "1.5 hours", "2.5 hours"
  const minutesMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*minutes?$/);
  if (minutesMatch) {
    return parseFloat(minutesMatch[1]);
  }

  const hoursMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*hours?$/);
  if (hoursMatch) {
    return parseFloat(hoursMatch[1]) * 60;
  }

  // Fallback: return 0 for unparseable strings
  return 0;
}

/**
 * Format total minutes into a human-readable string.
 * Examples: "30 minutes", "1 hour", "2.5 hours"
 */
export function formatMinutesToDuration(totalMinutes: number): string {
  if (totalMinutes < 60) {
    return `${totalMinutes} minute${totalMinutes !== 1 ? 's' : ''}`;
  }

  const hours = totalMinutes / 60;
  if (hours === 1) {
    return '1 hour';
  }

  // Format with up to 1 decimal place, removing trailing .0
  const formatted = hours.toFixed(1).replace(/\.0$/, '');
  return `${formatted} hours`;
}
