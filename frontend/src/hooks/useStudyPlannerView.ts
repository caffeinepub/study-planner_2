import { useState, useEffect } from 'react';

type ViewType = 'daily' | 'weekly';

const STORAGE_KEY = 'studyPlanner_viewPreference';

/**
 * Hook to persist and restore the Study Planner view mode (daily/weekly)
 * Defaults to 'weekly' if no preference is stored or if storage is corrupted
 */
export function useStudyPlannerView() {
  // Initialize state from storage synchronously to avoid flicker
  const [view, setView] = useState<ViewType>(() => {
    if (typeof window === 'undefined') return 'weekly';
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'daily' || stored === 'weekly') {
        return stored;
      }
    } catch (error) {
      console.error('Failed to read view preference:', error);
    }
    
    return 'weekly'; // Safe default
  });

  // Persist view changes to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, view);
    } catch (error) {
      console.error('Failed to save view preference:', error);
    }
  }, [view]);

  return [view, setView] as const;
}
