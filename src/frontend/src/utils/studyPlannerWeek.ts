/**
 * Utility functions for handling weekly date calculations in Study Planner.
 * Provides robust date normalization for both backend (bigint nanoseconds) and guest (number milliseconds) tasks.
 */

import type { Time } from '@/backend';

/**
 * Normalize a task date value to a JavaScript Date object.
 * Handles both backend bigint (nanoseconds) and guest number (milliseconds).
 * Returns null for invalid/missing dates.
 */
export function normalizeTaskDate(date: Time | number | undefined | null): Date | null {
  if (date == null) return null;

  try {
    let milliseconds: number;

    if (typeof date === 'bigint') {
      // Backend: nanoseconds stored as bigint
      // Convert to milliseconds: divide by 1,000,000
      milliseconds = Number(date / BigInt(1000000));
    } else if (typeof date === 'number') {
      // Guest: already in milliseconds
      milliseconds = date;
    } else {
      return null;
    }

    const dateObj = new Date(milliseconds);
    
    // Validate the date
    if (isNaN(dateObj.getTime())) {
      return null;
    }

    return dateObj;
  } catch {
    return null;
  }
}

/**
 * Get the start of the current week (Monday at 00:00:00.000 local time).
 */
export function getCurrentWeekStart(): Date {
  const now = new Date();
  const currentDay = now.getDay();
  
  // Calculate offset to Monday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  
  return monday;
}

/**
 * Get the end of the current week (Sunday at 23:59:59.999 local time).
 */
export function getCurrentWeekEnd(): Date {
  const monday = getCurrentWeekStart();
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return sunday;
}

/**
 * Check if a date falls within the current week (Monday-Sunday).
 */
export function isDateInCurrentWeek(date: Date): boolean {
  const weekStart = getCurrentWeekStart();
  const weekEnd = getCurrentWeekEnd();
  
  return date >= weekStart && date <= weekEnd;
}

/**
 * Get the day index (0-6) for a date within the current week.
 * 0 = Monday, 1 = Tuesday, ..., 6 = Sunday
 * Returns null if the date is not in the current week.
 */
export function getWeekDayIndex(date: Date): number | null {
  if (!isDateInCurrentWeek(date)) return null;
  
  const weekStart = getCurrentWeekStart();
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((dayStart.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff >= 0 && daysDiff < 7) {
    return daysDiff;
  }
  
  return null;
}
