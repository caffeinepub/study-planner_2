import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { parseDurationToMinutes, formatMinutesToDuration } from '@/utils/studyPlannerDuration';
import { normalizeTaskDate, isDateInCurrentWeek } from '@/utils/studyPlannerWeek';
import type { StudyTask } from '@/hooks/useQueries';
import type { GuestStudyTask } from '@/utils/studyPlannerGuestStorage';

interface WeeklyProgressChartProps {
  tasks: Array<StudyTask | GuestStudyTask>;
}

export function WeeklyProgressChart({ tasks }: WeeklyProgressChartProps) {
  const stats = useMemo(() => {
    // Filter to current week only (Monday-Sunday)
    const currentWeekTasks = tasks.filter((task) => {
      const taskDate = normalizeTaskDate(task.date);
      if (!taskDate) return false;
      return isDateInCurrentWeek(taskDate);
    });

    const completed = currentWeekTasks.filter((t) => t.isCompleted).length;
    const pending = currentWeekTasks.length - completed;
    
    // Sum study time of ONLY completed weekly tasks
    const totalMinutes = currentWeekTasks
      .filter((task) => task.isCompleted)
      .reduce((sum, task) => sum + parseDurationToMinutes(task.duration), 0);
    const totalTime = formatMinutesToDuration(totalMinutes);
    
    const completedPercent = currentWeekTasks.length > 0 ? (completed / currentWeekTasks.length) * 100 : 0;
    const pendingPercent = currentWeekTasks.length > 0 ? (pending / currentWeekTasks.length) * 100 : 0;

    return {
      completed,
      pending,
      totalTime,
      completedPercent,
      pendingPercent,
      totalTasks: currentWeekTasks.length,
    };
  }, [tasks]);

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-lg">Weekly Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Donut Chart */}
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="oklch(0.95 0.01 var(--hue))"
                strokeWidth="12"
              />
              {/* Completed arc */}
              {stats.completed > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="oklch(0.75 0.15 150)"
                  strokeWidth="12"
                  strokeDasharray={`${stats.completedPercent * 2.513} 251.3`}
                  strokeLinecap="round"
                />
              )}
              {/* Pending arc */}
              {stats.pending > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="oklch(0.80 0.12 60)"
                  strokeWidth="12"
                  strokeDasharray={`${stats.pendingPercent * 2.513} 251.3`}
                  strokeDashoffset={`-${stats.completedPercent * 2.513}`}
                  strokeLinecap="round"
                />
              )}
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold">{stats.totalTasks}</div>
              <div className="text-sm text-muted-foreground">Tasks</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200/50 dark:border-green-800/30">
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.completed}</div>
            <div className="text-xs text-green-600 dark:text-green-500 mt-1">Completed</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200/50 dark:border-amber-800/30">
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{stats.pending}</div>
            <div className="text-xs text-amber-600 dark:text-amber-500 mt-1">Pending</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/50 dark:border-blue-800/30">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats.totalTime}</div>
            <div className="text-xs text-blue-600 dark:text-blue-500 mt-1">Total Time</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
