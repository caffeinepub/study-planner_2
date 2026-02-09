import { useState, useEffect } from 'react';

type ViewType = 'daily' | 'weekly';

const STORAGE_KEY_DAILY = 'studyPlanner_subjectFilter_daily';
const STORAGE_KEY_WEEKLY = 'studyPlanner_subjectFilter_weekly';

/**
 * Hook to persist and restore the Study Planner subject filter independently for Daily and Weekly views
 * Returns the filter value for the active view and a setter function
 */
export function useStudyPlannerSubjectFilter(activeView: ViewType) {
  // Initialize state from storage synchronously to avoid flicker
  const [dailyFilter, setDailyFilter] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DAILY);
      return stored || '';
    } catch (error) {
      console.error('Failed to read daily subject filter:', error);
      return '';
    }
  });

  const [weeklyFilter, setWeeklyFilter] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY_WEEKLY);
      return stored || '';
    } catch (error) {
      console.error('Failed to read weekly subject filter:', error);
      return '';
    }
  });

  // Persist daily filter changes to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY_DAILY, dailyFilter);
    } catch (error) {
      console.error('Failed to save daily subject filter:', error);
    }
  }, [dailyFilter]);

  // Persist weekly filter changes to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY_WEEKLY, weeklyFilter);
    } catch (error) {
      console.error('Failed to save weekly subject filter:', error);
    }
  }, [weeklyFilter]);

  // Return the appropriate filter and setter based on active view
  const currentFilter = activeView === 'daily' ? dailyFilter : weeklyFilter;
  const setCurrentFilter = activeView === 'daily' ? setDailyFilter : setWeeklyFilter;

  return [currentFilter, setCurrentFilter] as const;
}
