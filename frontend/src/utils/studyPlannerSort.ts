// Deterministic sorting utilities for Study Planner tasks

import type { StudyTask } from '@/hooks/useQueries';
import type { GuestStudyTask } from './studyPlannerGuestStorage';

export type SortMode = 'default' | 'dateTime';

/**
 * Get sort timestamp for a task (combines date and time)
 */
function getTaskSortTimestamp(task: StudyTask | GuestStudyTask): number {
  // If task has a date, use it
  if (task.date) {
    const dateValue = Number(task.date);
    
    // If task also has time, add time offset
    if (task.time) {
      const hours = Number(task.time.hour);
      const minutes = Number(task.time.minute);
      return dateValue + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
    }
    
    return dateValue;
  }
  
  // No date - return Infinity to sort to end
  return Infinity;
}

/**
 * Get task ID for stable sorting
 */
function getTaskId(task: StudyTask | GuestStudyTask): number {
  return Number(task.id);
}

/**
 * Sort tasks by date/time (chronological)
 * Tasks without date/time appear at the end
 * Ties broken by task ID for stability
 */
export function sortTasksByDateTime(
  tasks: Array<StudyTask | GuestStudyTask>
): Array<StudyTask | GuestStudyTask> {
  return [...tasks].sort((a, b) => {
    const aTimestamp = getTaskSortTimestamp(a);
    const bTimestamp = getTaskSortTimestamp(b);
    
    // Compare timestamps
    if (aTimestamp !== bTimestamp) {
      return aTimestamp - bTimestamp;
    }
    
    // Timestamps equal - break tie with task ID
    return getTaskId(a) - getTaskId(b);
  });
}

/**
 * Sort tasks by creation order (default)
 * Uses task ID for stable ordering
 */
export function sortTasksByDefault(
  tasks: Array<StudyTask | GuestStudyTask>
): Array<StudyTask | GuestStudyTask> {
  return [...tasks].sort((a, b) => getTaskId(a) - getTaskId(b));
}

/**
 * Apply sorting based on mode
 */
export function sortTasks(
  tasks: Array<StudyTask | GuestStudyTask>,
  mode: SortMode
): Array<StudyTask | GuestStudyTask> {
  switch (mode) {
    case 'dateTime':
      return sortTasksByDateTime(tasks);
    case 'default':
    default:
      return sortTasksByDefault(tasks);
  }
}
