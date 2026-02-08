// Utility functions for handling optional date and time fields in Study Planner tasks

import type { Time, OptionalTime } from '@/backend';

/**
 * Convert HTML date input (YYYY-MM-DD) to timestamp (bigint for backend, number for guest)
 */
export function dateInputToTimestamp(dateInput: string): bigint | null {
  if (!dateInput || dateInput.trim() === '') return null;

  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return null;
    
    // Set to start of day in local timezone
    date.setHours(0, 0, 0, 0);
    return BigInt(date.getTime());
  } catch {
    return null;
  }
}

/**
 * Convert HTML time input (HH:MM) to OptionalTime
 */
export function timeInputToOptionalTime(timeInput: string): OptionalTime | null {
  if (!timeInput || timeInput.trim() === '') return null;

  try {
    const [hourStr, minuteStr] = timeInput.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    if (isNaN(hour) || isNaN(minute)) return null;
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

    return {
      hour: BigInt(hour),
      minute: BigInt(minute),
    };
  } catch {
    return null;
  }
}

/**
 * Format date and time for display
 * Returns empty string if both are absent
 */
export function formatTaskDateTime(
  date?: Time | number | null,
  time?: OptionalTime | { hour: number; minute: number } | null
): string {
  if (!date) return '';

  try {
    const dateValue = typeof date === 'bigint' ? Number(date) : date;
    const dateObj = new Date(dateValue);

    if (isNaN(dateObj.getTime())) return '';

    const dateStr = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    if (!time) return dateStr;

    const hour = typeof time.hour === 'bigint' ? Number(time.hour) : time.hour;
    const minute = typeof time.minute === 'bigint' ? Number(time.minute) : time.minute;

    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    return `${dateStr} at ${timeStr}`;
  } catch {
    return '';
  }
}
