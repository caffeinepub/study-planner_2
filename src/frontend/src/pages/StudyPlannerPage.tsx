import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Trash2, Download, AlertCircle, Info, ArrowUpDown, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useAddTask, useToggleTaskCompletion, useDeleteTask, useGetStudyTasks, type StudyTask } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useStudyPlannerView } from '@/hooks/useStudyPlannerView';
import { useStudyPlannerSort } from '@/hooks/useStudyPlannerSort';
import { useStudyPlannerSubjectFilter } from '@/hooks/useStudyPlannerSubjectFilter';
import { SubjectBadge } from '@/components/studyPlanner/SubjectBadge';
import { SubjectFilterDropdown } from '@/components/studyPlanner/SubjectFilterDropdown';
import { ProgressChartsSection } from '@/components/studyPlanner/ProgressChartsSection';
import { getPersistedSubjectColor, getIndicatorColorClass } from '@/utils/subjectColorMapping';
import { exportTasksToPdf } from '@/utils/studyPlannerPdfExport';
import { exportTasksToTxt } from '@/utils/studyPlannerTxtExport';
import { sortTasks } from '@/utils/studyPlannerSort';
import {
  dateInputToTimestamp,
  timeInputToOptionalTime,
  formatTaskDateTime,
} from '@/utils/studyPlannerTaskDateTime';
import {
  loadGuestTasks,
  addGuestTask,
  toggleGuestTaskCompletion,
  deleteGuestTask,
  clearAllGuestTasks,
  type GuestStudyTask,
} from '@/utils/studyPlannerGuestStorage';
import { parseDurationToMinutes, formatMinutesToDuration } from '@/utils/studyPlannerDuration';

type ViewType = 'daily' | 'weekly';

const SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Geography',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Economics',
  'Literature',
  'Social Studies',
  'Urdu',
];

const DURATIONS = ['30 minutes', '45 minutes', '1 hour', '1.5 hours', '2 hours', '2.5 hours', '3 hours', '3.5 hours', '4 hours', '4.5 hours', '5 hours', '5.5 hours', '6 hours'];

export default function StudyPlannerPage() {
  // Persistent view and sort state
  const [currentView, setCurrentView] = useStudyPlannerView();
  const [sortMode, setSortMode] = useStudyPlannerSort();
  const [subjectFilter, setSubjectFilter] = useStudyPlannerSubjectFilter(currentView);

  // Form state
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('');
  const [priority, setPriority] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');

  // Submission guard
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guest mode state
  const [guestTasks, setGuestTasks] = useState<GuestStudyTask[]>([]);

  const { identity } = useInternetIdentity();
  const addTaskMutation = useAddTask();
  const toggleCompletionMutation = useToggleTaskCompletion(currentView);
  const deleteTaskMutation = useDeleteTask(currentView);
  
  const isAuthenticated = !!identity;
  
  // Fetch backend tasks filtered by current view when authenticated
  const { data: backendTasks = [], isLoading: tasksLoading } = useGetStudyTasks(isAuthenticated, currentView);

  // Load guest tasks on mount and when auth changes
  useEffect(() => {
    if (!isAuthenticated) {
      setGuestTasks(loadGuestTasks());
    }
  }, [isAuthenticated]);

  // Unified task list - use backend tasks when authenticated, guest tasks otherwise
  const allTasks: Array<StudyTask | GuestStudyTask> = isAuthenticated ? backendTasks : guestTasks;

  // Filter tasks based on current view
  const filteredTasks = allTasks.filter((task) => {
    if (!task.viewType) return true;
    
    const taskViewType = task.viewType;
    
    if (typeof taskViewType === 'string') {
      return taskViewType === currentView;
    }
    
    if (typeof taskViewType === 'object' && taskViewType !== null && '__kind__' in taskViewType) {
      return (taskViewType as any).__kind__ === currentView;
    }
    
    return true;
  });

  // Apply subject filter
  const subjectFilteredTasks = useMemo(() => {
    if (!subjectFilter) return filteredTasks;
    return filteredTasks.filter((task) => task.subject === subjectFilter);
  }, [filteredTasks, subjectFilter]);

  // Apply sorting
  const sortedTasks = sortTasks(subjectFilteredTasks, sortMode);

  // Compute subject counts for the current view (before subject filter is applied)
  const subjectCounts = useMemo(() => {
    const counts = new Map<string, number>();
    
    filteredTasks.forEach((task) => {
      const subject = task.subject;
      counts.set(subject, (counts.get(subject) || 0) + 1);
    });
    
    return Array.from(counts.entries())
      .map(([subject, count]) => ({ subject, count }))
      .sort((a, b) => a.subject.localeCompare(b.subject));
  }, [filteredTasks]);

  // View toggle handler
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    toast.success(`Switched to ${view} view`);
  };

  // Sort toggle handler
  const handleSortChange = () => {
    const newMode = sortMode === 'default' ? 'dateTime' : 'default';
    setSortMode(newMode);
    toast.success(newMode === 'dateTime' ? 'Sorted by date & time' : 'Sorted by creation order');
  };

  const validateFields = (): boolean => {
    if (!subject.trim()) {
      toast.error('Please select a subject', { icon: <AlertCircle className="h-4 w-4" /> });
      return false;
    }
    if (!topic.trim()) {
      toast.error('Please enter a topic', { icon: <AlertCircle className="h-4 w-4" /> });
      return false;
    }
    if (!duration.trim()) {
      toast.error('Please select a duration', { icon: <AlertCircle className="h-4 w-4" /> });
      return false;
    }
    return true;
  };

  const handleAddTask = async () => {
    if (!validateFields()) return;
    if (isSubmitting) return; // Prevent duplicate submissions

    setIsSubmitting(true);

    try {
      const priorityValue = priority.trim() || null;
      const subjectColor = getPersistedSubjectColor(subject.trim());
      const dateValue = dateInputToTimestamp(taskDate);
      const timeValue = timeInputToOptionalTime(taskTime);

      if (isAuthenticated) {
        // Authenticated mode
        await addTaskMutation.mutateAsync(
          {
            subject: subject.trim(),
            topic: topic.trim(),
            duration: duration.trim(),
            priority: priorityValue,
            viewType: currentView,
            subjectColor,
            date: dateValue,
            time: timeValue,
          }
        );

        // Reset form
        setSubject('');
        setTopic('');
        setDuration('');
        setPriority('');
        setTaskDate('');
        setTaskTime('');

        toast.success('Task added to your study plan!');
      } else {
        // Guest mode
        const guestDateValue = dateValue ? Number(dateValue) : undefined;
        const guestTimeValue = timeValue
          ? { hour: Number(timeValue.hour), minute: Number(timeValue.minute) }
          : undefined;

        addGuestTask(
          subject.trim(),
          topic.trim(),
          duration.trim(),
          priorityValue,
          currentView,
          subjectColor,
          guestDateValue,
          guestTimeValue
        );
        
        setGuestTasks(loadGuestTasks());
        
        // Reset form
        setSubject('');
        setTopic('');
        setDuration('');
        setPriority('');
        setTaskDate('');
        setTaskTime('');

        toast.success('Task added to your study plan!');
      }
    } catch (error: any) {
      const errorMsg = error?.message || '';
      console.error('Add task error:', error);

      if (errorMsg === 'ACTOR_NOT_READY') {
        toast.error('Please wait while the app is loading...');
      } else if (errorMsg.includes('All fields are required')) {
        toast.error('All fields are required. Please complete all fields before adding a task.');
      } else {
        toast.error('Failed to add task. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = (taskId: bigint | number) => {
    if (isAuthenticated) {
      toggleCompletionMutation.mutate(taskId as bigint, {
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to toggle task completion');
        },
      });
    } else {
      try {
        toggleGuestTaskCompletion(taskId as number);
        setGuestTasks(loadGuestTasks());
      } catch (error) {
        console.error('Guest task toggle error:', error);
        toast.error('Failed to toggle task completion');
      }
    }
  };

  const handleDeleteTask = (taskId: bigint | number) => {
    if (isAuthenticated) {
      deleteTaskMutation.mutate(taskId as bigint, {
        onSuccess: () => {
          toast.success('Task removed');
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to delete task');
        },
      });
    } else {
      try {
        deleteGuestTask(taskId as number);
        setGuestTasks(loadGuestTasks());
        toast.success('Task removed');
      } catch (error) {
        console.error('Guest task delete error:', error);
        toast.error('Failed to delete task');
      }
    }
  };

  const handleClearAllTasks = () => {
    if (sortedTasks.length === 0) {
      toast.info('No tasks to clear');
      return;
    }

    if (confirm('Are you sure you want to clear all tasks? This action cannot be undone.')) {
      if (isAuthenticated) {
        allTasks.forEach((task) => {
          deleteTaskMutation.mutate((task as StudyTask).id);
        });
        toast.success('All tasks cleared');
      } else {
        clearAllGuestTasks();
        setGuestTasks([]);
        toast.success('All tasks cleared');
      }
    }
  };

  const handleDownloadTxt = async () => {
    if (sortedTasks.length === 0) {
      toast.info('No tasks to export. Add some tasks first!', {
        icon: <Info className="h-4 w-4" />,
      });
      return;
    }

    try {
      exportTasksToTxt({
        tasks: sortedTasks,
        viewType: currentView,
      });
      toast.success('Study plan exported as TXT!');
    } catch (error) {
      console.error('TXT export error:', error);
      toast.error('Failed to export study plan. Please try again.');
    }
  };

  const handleDownloadPdf = async () => {
    if (sortedTasks.length === 0) {
      toast.info('No tasks to export. Add some tasks first!', {
        icon: <Info className="h-4 w-4" />,
      });
      return;
    }

    try {
      await exportTasksToPdf({
        tasks: sortedTasks,
        viewType: currentView,
      });
      toast.success('Study plan exported as PDF!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF. Please try again.');
    }
  };

  const completedCount = sortedTasks.filter((t) => t.isCompleted).length;
  const totalCount = sortedTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Weekly Summary calculations
  const pendingCount = totalCount - completedCount;
  const totalStudyMinutes = sortedTasks.reduce((sum, task) => {
    return sum + parseDurationToMinutes(task.duration);
  }, 0);
  const totalStudyTime = formatMinutesToDuration(totalStudyMinutes);

  const taskPanelHeading = currentView === 'daily' ? 'Your Daily Study Tasks' : 'Your Weekly Study Tasks';

  return (
    <TooltipProvider>
      <div className="container py-8 md:py-12 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Study Planner</h1>
          <p className="text-lg text-muted-foreground">
            Plan your daily or weekly study schedule with ease
          </p>
          {!isAuthenticated && (
            <p className="text-sm text-muted-foreground mt-2">
              Guest mode: Tasks are stored locally in your browser
            </p>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-center gap-3 mb-6 p-4 bg-card border-2 rounded-lg">
          <img
            src="/assets/generated/view-toggle-icon-transparent.dim_32x32.png"
            alt="View Toggle"
            className="h-6 w-6"
          />
          <button
            onClick={() => handleViewChange('daily')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentView === 'daily'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => handleViewChange('weekly')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentView === 'weekly'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Weekly
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          {/* Add Task Form */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Study Task
              </CardTitle>
              <CardDescription>Create a new task for your study plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject" className="flex items-center gap-2">
                  Subject <span className="text-destructive">*</span>
                </Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((subj) => (
                      <SelectItem key={subj} value={subj}>
                        {subj}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic" className="flex items-center gap-2 font-normal text-sm">
                  Topic <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="topic"
                  placeholder="e.g., Algebra - Chapter 5"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="font-normal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center gap-2">
                  Duration <span className="text-destructive">*</span>
                </Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map((dur) => (
                      <SelectItem key={dur} value={dur}>
                        {dur}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="flex items-center gap-2">
                  Priority Level
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>High: Urgent tasks or exams</p>
                      <p>Medium: Regular study sessions</p>
                      <p>Low: Review or optional topics</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        High
                      </span>
                    </SelectItem>
                    <SelectItem value="Medium">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-yellow-500" />
                        Medium
                      </span>
                    </SelectItem>
                    <SelectItem value="Low">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        Low
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taskDate" className="flex items-center gap-2 font-normal text-sm">
                  Date (Optional)
                </Label>
                <Input
                  id="taskDate"
                  type="date"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  className="font-normal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taskTime" className="flex items-center gap-2 font-normal text-sm">
                  Time (Optional)
                </Label>
                <Input
                  id="taskTime"
                  type="time"
                  value={taskTime}
                  onChange={(e) => setTaskTime(e.target.value)}
                  className="font-normal"
                />
              </div>

              <Button
                onClick={handleAddTask}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Adding...' : 'Add Task'}
              </Button>
            </CardContent>
          </Card>

          {/* Task List */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{taskPanelHeading}</CardTitle>
                <div className="flex items-center gap-2">
                  <SubjectFilterDropdown
                    subjects={SUBJECTS}
                    subjectCounts={subjectCounts}
                    selectedSubject={subjectFilter}
                    onSelectSubject={setSubjectFilter}
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleSortChange}
                        className="h-9 w-9"
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{sortMode === 'default' ? 'Sort by date & time' : 'Sort by creation order'}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleDownloadTxt}
                        className="h-9 w-9"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Export as TXT</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleDownloadPdf}
                        className="h-9 w-9"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Export as PDF</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <CardDescription>
                {totalCount === 0 ? 'No tasks yet' : `${completedCount} of ${totalCount} completed`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>

              {/* Task List with fixed height and scroll */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {sortedTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No tasks added yet.</p>
                    <p className="text-sm mt-1">Create your first task to get started!</p>
                  </div>
                ) : (
                  sortedTasks.map((task) => {
                    const taskId = task.id;
                    const isCompleted = task.isCompleted;
                    const indicatorColor = getIndicatorColorClass(task.subject);
                    const dateTimeDisplay = formatTaskDateTime(task.date, task.time);

                    return (
                      <div
                        key={String(taskId)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isCompleted
                            ? 'bg-muted/50 border-muted'
                            : 'bg-card border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-1 h-full rounded-full ${indicatorColor} flex-shrink-0 mt-1`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Checkbox
                                  checked={isCompleted}
                                  onCheckedChange={() => handleToggleComplete(taskId)}
                                  id={`task-${taskId}`}
                                />
                                <SubjectBadge subject={task.subject} />
                                {task.priority && (
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      task.priority === 'High'
                                        ? 'border-red-500 text-red-700 dark:text-red-400'
                                        : task.priority === 'Medium'
                                        ? 'border-yellow-500 text-yellow-700 dark:text-yellow-400'
                                        : 'border-green-500 text-green-700 dark:text-green-400'
                                    }`}
                                  >
                                    {task.priority}
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTask(taskId)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <label
                              htmlFor={`task-${taskId}`}
                              className={`block text-sm font-medium mb-1 cursor-pointer ${
                                isCompleted ? 'line-through text-muted-foreground' : ''
                              }`}
                            >
                              {task.topic}
                            </label>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                              <span>{task.duration}</span>
                              {dateTimeDisplay && (
                                <>
                                  <span>•</span>
                                  <span>{dateTimeDisplay}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Action Buttons */}
              {sortedTasks.length > 0 && (
                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handleClearAllTasks}
                    className="w-full text-destructive hover:text-destructive"
                  >
                    Clear All Tasks
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress Charts Section */}
        <ProgressChartsSection viewType={currentView} tasks={filteredTasks} />
      </div>
    </TooltipProvider>
  );
}
