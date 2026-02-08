// Centralized subject color mapping system

// Predefined subject-to-color mapping
const SUBJECT_COLOR_MAP: Record<string, string> = {
  Mathematics: 'blue',
  Science: 'green',
  English: 'purple',
  History: 'orange',
  Geography: 'teal',
  Physics: 'indigo',
  Chemistry: 'pink',
  Biology: 'emerald',
  'Computer Science': 'cyan',
  Economics: 'amber',
  Literature: 'violet',
  'Social Studies': 'rose',
  Urdu: 'lime',
};

// Color class mappings for badges
const COLOR_CLASSES: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  violet: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  lime: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
};

// Indicator bar color classes
const INDICATOR_COLOR_CLASSES: Record<string, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  teal: 'bg-teal-500',
  indigo: 'bg-indigo-500',
  pink: 'bg-pink-500',
  emerald: 'bg-emerald-500',
  cyan: 'bg-cyan-500',
  amber: 'bg-amber-500',
  violet: 'bg-violet-500',
  rose: 'bg-rose-500',
  lime: 'bg-lime-500',
};

/**
 * Get the color name for a subject from the predefined mapping
 */
function getSubjectColorName(subject: string): string {
  return SUBJECT_COLOR_MAP[subject] || 'blue';
}

/**
 * Get the persisted subject color (for storage)
 */
export function getPersistedSubjectColor(subject: string): string {
  return getSubjectColorName(subject);
}

/**
 * Get the badge color class for a subject
 * Uses persisted color if available, otherwise derives from subject name
 */
export function getSubjectColorClass(subject: string, persistedColor?: string | null): string {
  const colorName = persistedColor || getSubjectColorName(subject);
  return COLOR_CLASSES[colorName] || COLOR_CLASSES.blue;
}

/**
 * Get the indicator bar color class for a subject
 */
export function getIndicatorColorClass(subject: string, persistedColor?: string | null): string {
  const colorName = persistedColor || getSubjectColorName(subject);
  return INDICATOR_COLOR_CLASSES[colorName] || INDICATOR_COLOR_CLASSES.blue;
}
