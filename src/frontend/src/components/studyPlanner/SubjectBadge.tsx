import { getSubjectColorClass } from '@/utils/subjectColorMapping';

interface SubjectBadgeProps {
  subject: string;
  subjectColor?: string | null;
}

export function SubjectBadge({ subject, subjectColor }: SubjectBadgeProps) {
  const colorClass = getSubjectColorClass(subject, subjectColor);

  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorClass}`}>
      {subject}
    </span>
  );
}
