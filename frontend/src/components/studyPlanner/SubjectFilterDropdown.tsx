import { useState, useMemo } from 'react';
import { Check, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SubjectCount {
  subject: string;
  count: number;
}

interface SubjectFilterDropdownProps {
  subjects: string[];
  subjectCounts: SubjectCount[];
  selectedSubject: string;
  onSelectSubject: (subject: string) => void;
}

export function SubjectFilterDropdown({
  subjects,
  subjectCounts,
  selectedSubject,
  onSelectSubject,
}: SubjectFilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Create a map for quick count lookup
  const countMap = useMemo(() => {
    const map = new Map<string, number>();
    subjectCounts.forEach(({ subject, count }) => {
      map.set(subject, count);
    });
    return map;
  }, [subjectCounts]);

  // Filter subjects based on search query
  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return subjects;
    
    const query = searchQuery.toLowerCase();
    return subjects.filter((subject) =>
      subject.toLowerCase().includes(query)
    );
  }, [subjects, searchQuery]);

  const handleSelect = (subject: string) => {
    onSelectSubject(subject === selectedSubject ? '' : subject);
    setOpen(false);
    setSearchQuery('');
  };

  const displayValue = selectedSubject || 'All Subjects';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {displayValue}
          <svg
            className="ml-2 h-4 w-4 shrink-0 opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <div className="flex items-center border-b px-3 py-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder="Search subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto p-1">
          <button
            onClick={() => handleSelect('')}
            className={cn(
              'relative flex w-full cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
              !selectedSubject && 'bg-accent'
            )}
          >
            <span>All Subjects</span>
            {!selectedSubject && (
              <Check className="h-4 w-4" />
            )}
          </button>
          {filteredSubjects.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No subjects found
            </div>
          ) : (
            filteredSubjects.map((subject) => {
              const count = countMap.get(subject) || 0;
              const isSelected = selectedSubject === subject;
              
              return (
                <button
                  key={subject}
                  onClick={() => handleSelect(subject)}
                  className={cn(
                    'relative flex w-full cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
                    isSelected && 'bg-accent'
                  )}
                >
                  <span className="flex items-center gap-2">
                    {subject}
                    <span className="text-xs text-muted-foreground">
                      ({count})
                    </span>
                  </span>
                  {isSelected && (
                    <Check className="h-4 w-4" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
