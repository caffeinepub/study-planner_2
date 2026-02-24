// Hook to persist Study Planner sort mode across sessions

import { useState, useEffect } from 'react';
import type { SortMode } from '@/utils/studyPlannerSort';

const STORAGE_KEY = 'studyPlanner_sortMode';

/**
 * Hook to manage and persist sort mode preference
 */
export function useStudyPlannerSort(): [SortMode, (mode: SortMode) => void] {
  const [sortMode, setSortModeState] = useState<SortMode>(() => {
    if (typeof window === 'undefined') return 'default';
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dateTime' || stored === 'default') {
      return stored;
    }
    return 'default';
  });

  const setSortMode = (mode: SortMode) => {
    setSortModeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  };

  return [sortMode, setSortMode];
}
