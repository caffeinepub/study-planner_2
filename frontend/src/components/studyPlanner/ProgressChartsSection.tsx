import { DailyProgressChart } from './DailyProgressChart';
import { WeeklyProgressChart } from './WeeklyProgressChart';
import type { StudyTask } from '@/hooks/useQueries';
import type { GuestStudyTask } from '@/utils/studyPlannerGuestStorage';

interface ProgressChartsSectionProps {
  tasks: Array<StudyTask | GuestStudyTask>;
  viewType: 'daily' | 'weekly';
}

export function ProgressChartsSection({ tasks, viewType }: ProgressChartsSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Progress Charts</h2>
      {viewType === 'daily' ? (
        <DailyProgressChart tasks={tasks} />
      ) : (
        <WeeklyProgressChart tasks={tasks} />
      )}
    </div>
  );
}
