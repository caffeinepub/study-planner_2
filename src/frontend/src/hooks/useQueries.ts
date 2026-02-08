import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { StudyTaskPublic, StudyPlannerView, OptionalTime, Time } from '@/backend';

// Re-export types for convenience
export type StudyTask = StudyTaskPublic;
export { StudyPlannerView };

// Assignment-related types
export interface AssignmentParams {
  topic: string;
  level: string;
  length: string;
  language: string;
}

export interface AssignmentGenerationResult {
  params: AssignmentParams;
  needsConfirmation: boolean;
}

// Feature Requests
export function useSubmitFeatureRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ message, email }: { message: string; email: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitFeatureRequest(message, email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureRequests'] });
    },
  });
}

// Assignment Generation (frontend-only, no backend call)
export function useGenerateAssignment() {
  return useMutation({
    mutationFn: async (userInput: string): Promise<AssignmentGenerationResult> => {
      // Frontend-only assignment parameter extraction
      const topic = extractTopic(userInput);
      const params: AssignmentParams = {
        topic,
        level: 'Intermediate',
        length: 'Medium',
        language: 'English',
      };
      
      return {
        params,
        needsConfirmation: true,
      };
    },
  });
}

// Helper function to extract topic from user input
function extractTopic(input: string): string {
  const lowerInput = input.toLowerCase();
  
  // Remove common assignment request phrases
  const phrasesToRemove = [
    'assignment on',
    'assignment about',
    'create assignment on',
    'write assignment on',
    'generate assignment on',
    'mujhe',
    'par assignment',
    'chahiye',
    'bana do',
    'likh do',
    'assignment',
    'create',
    'write',
    'generate',
  ];
  
  let topic = input;
  phrasesToRemove.forEach(phrase => {
    const regex = new RegExp(phrase, 'gi');
    topic = topic.replace(regex, '');
  });
  
  return topic.trim() || 'General Topic';
}

// Confirm Assignment Generation (frontend-only)
export function useConfirmAssignmentGeneration() {
  return useMutation({
    mutationFn: async (confirmation: string): Promise<void> => {
      // Frontend-only confirmation
      const isConfirmed = confirmation.toLowerCase().trim() === 'yes' || 
                         confirmation.toLowerCase().trim() === 'haan' ||
                         confirmation.toLowerCase().trim() === 'han' ||
                         confirmation.toLowerCase().trim() === 'y';
      
      if (!isConfirmed) {
        throw new Error('ERR: Confirmation required');
      }
    },
  });
}

// Save Conversation Entry
export function useSaveConversationEntry() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ question, answer }: { question: string; answer: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveConversationEntry(question, answer);
    },
  });
}

// Study Planner
export function useAddTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      subject,
      topic,
      duration,
      priority,
      viewType,
      subjectColor,
      date,
      time,
    }: {
      subject: string;
      topic: string;
      duration: string;
      priority: string | null;
      viewType?: 'daily' | 'weekly';
      subjectColor?: string;
      date?: Time | null;
      time?: OptionalTime | null;
    }) => {
      if (!actor) throw new Error('ACTOR_NOT_READY');

      // Validate required fields
      if (!subject.trim() || !topic.trim() || !duration.trim()) {
        throw new Error('All fields are required. Please complete all fields before adding a task.');
      }

      // Convert viewType to backend enum format
      const backendViewType = viewType
        ? viewType === 'daily'
          ? StudyPlannerView.daily
          : StudyPlannerView.weekly
        : null;

      return actor.addTask(
        subject,
        topic,
        duration,
        priority,
        backendViewType,
        subjectColor || null,
        date || null,
        time || null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyTasks'] });
    },
  });
}

export function useGetStudyTasks(enabled: boolean, viewType?: 'daily' | 'weekly') {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<StudyTask[]>({
    queryKey: ['studyTasks', viewType],
    queryFn: async () => {
      if (!actor) return [];

      // Convert viewType to backend enum format
      const backendViewType = viewType
        ? viewType === 'daily'
          ? StudyPlannerView.daily
          : StudyPlannerView.weekly
        : null;

      return actor.getFilteredTasks(backendViewType);
    },
    enabled: enabled && !!actor && !actorFetching,
  });
}

export function useToggleTaskCompletion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.toggleTaskCompletion(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyTasks'] });
    },
  });
}

export function useDeleteTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyTasks'] });
    },
  });
}
