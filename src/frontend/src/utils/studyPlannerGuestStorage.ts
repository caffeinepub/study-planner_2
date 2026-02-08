// Guest-mode storage utility for Study Planner tasks

export interface GuestStudyTask {
  id: number;
  subject: string;
  topic: string;
  duration: string;
  priority: string | null;
  isCompleted: boolean;
  viewType?: 'daily' | 'weekly';
  subjectColor?: string;
  created: number;
  date?: number;
  time?: { hour: number; minute: number };
}

const STORAGE_KEY = 'studyPlanner_guestTasks';

let nextGuestTaskId = 1;

/**
 * Load guest tasks from localStorage
 * Safely handles legacy tasks with color overrides by ignoring them
 */
export function loadGuestTasks(): GuestStudyTask[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    
    if (!Array.isArray(parsed)) return [];

    // Upgrade legacy tasks: strip any colorOverride field
    const upgradedTasks = parsed.map((task: any) => {
      const { colorOverride, ...cleanTask } = task;
      return cleanTask as GuestStudyTask;
    });

    // Update nextGuestTaskId
    if (upgradedTasks.length > 0) {
      const maxId = Math.max(...upgradedTasks.map((t) => t.id));
      nextGuestTaskId = maxId + 1;
    }

    return upgradedTasks;
  } catch (error) {
    console.error('Failed to load guest tasks:', error);
    return [];
  }
}

/**
 * Save guest tasks to localStorage
 */
function saveGuestTasks(tasks: GuestStudyTask[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save guest tasks:', error);
  }
}

/**
 * Add a new guest task (no colorOverride parameter)
 */
export function addGuestTask(
  subject: string,
  topic: string,
  duration: string,
  priority: string | null,
  viewType: 'daily' | 'weekly',
  subjectColor?: string,
  date?: number,
  time?: { hour: number; minute: number }
): void {
  const tasks = loadGuestTasks();

  const newTask: GuestStudyTask = {
    id: nextGuestTaskId++,
    subject,
    topic,
    duration,
    priority,
    isCompleted: false,
    viewType,
    subjectColor,
    created: Date.now(),
    date,
    time,
  };

  tasks.push(newTask);
  saveGuestTasks(tasks);
}

/**
 * Toggle task completion status
 */
export function toggleGuestTaskCompletion(taskId: number): void {
  const tasks = loadGuestTasks();
  const task = tasks.find((t) => t.id === taskId);

  if (task) {
    task.isCompleted = !task.isCompleted;
    saveGuestTasks(tasks);
  }
}

/**
 * Delete a guest task
 */
export function deleteGuestTask(taskId: number): void {
  const tasks = loadGuestTasks();
  const filtered = tasks.filter((t) => t.id !== taskId);
  saveGuestTasks(filtered);
}

/**
 * Clear all guest tasks
 */
export function clearAllGuestTasks(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  nextGuestTaskId = 1;
}
