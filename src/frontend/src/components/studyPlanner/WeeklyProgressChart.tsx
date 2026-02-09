import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { parseDurationToMinutes } from '@/utils/studyPlannerDuration';
import type { StudyTask } from '@/hooks/useQueries';
import type { GuestStudyTask } from '@/utils/studyPlannerGuestStorage';

interface WeeklyProgressChartProps {
  tasks: Array<StudyTask | GuestStudyTask>;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function WeeklyProgressChart({ tasks }: WeeklyProgressChartProps) {
  const weeklyData = useMemo(() => {
    // Initialize hours for each day
    const dayHours = new Array(7).fill(0);
    
    // Get current week's Monday
    const now = new Date();
    const currentDay = now.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    // Sum up study hours for each day
    tasks.forEach((task) => {
      if (!task.date) return;
      
      const taskDate = new Date(Number(task.date) / 1000000); // Convert nanoseconds to milliseconds
      taskDate.setHours(0, 0, 0, 0);
      
      // Calculate day index (0 = Monday, 6 = Sunday)
      const daysDiff = Math.floor((taskDate.getTime() - monday.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff >= 0 && daysDiff < 7) {
        const minutes = parseDurationToMinutes(task.duration);
        dayHours[daysDiff] += minutes / 60; // Convert to hours
      }
    });

    const maxHours = Math.max(...dayHours, 1);
    
    return dayHours.map((hours, index) => ({
      day: DAYS[index],
      hours: Math.round(hours * 10) / 10, // Round to 1 decimal
      heightPercent: (hours / maxHours) * 100,
    }));
  }, [tasks]);

  const totalHours = weeklyData.reduce((sum, day) => sum + day.hours, 0);

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-lg">Weekly Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bar Chart */}
        <div className="h-48 flex items-end justify-between gap-2 px-2">
          {weeklyData.map((day, index) => (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
              {/* Bar */}
              <div className="w-full flex flex-col items-center justify-end h-40">
                <div
                  className="w-full rounded-t-lg transition-all duration-300"
                  style={{
                    height: `${day.heightPercent}%`,
                    background: `linear-gradient(to top, oklch(0.70 0.15 ${220 + index * 15}), oklch(0.80 0.12 ${220 + index * 15}))`,
                    minHeight: day.hours > 0 ? '8px' : '0px',
                  }}
                />
              </div>
              {/* Label */}
              <div className="text-center">
                <div className="text-xs font-medium text-muted-foreground">{day.day}</div>
                <div className="text-xs font-bold text-foreground">{day.hours}h</div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Summary */}
        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border border-purple-200/50 dark:border-purple-800/30">
          <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
            {Math.round(totalHours * 10) / 10}h
          </div>
          <div className="text-sm text-purple-600 dark:text-purple-500 mt-1">Total Study Time This Week</div>
        </div>
      </CardContent>
    </Card>
  );
}
