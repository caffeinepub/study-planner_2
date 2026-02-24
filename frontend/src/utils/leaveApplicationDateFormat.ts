import { format } from 'date-fns';

export function formatSingleDate(date: Date): string {
  return format(date, 'do MMMM yyyy');
}

export function formatDateRange(startDate: Date, endDate: Date): string {
  const start = format(startDate, 'do MMMM yyyy');
  const end = format(endDate, 'do MMMM yyyy');
  return `from ${start} to ${end}`;
}

export function calculateDays(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

export function formatLeaveDuration(startDate: Date, endDate?: Date): string {
  if (!endDate || startDate.toDateString() === endDate.toDateString()) {
    return `on ${formatSingleDate(startDate)}`;
  }
  return formatDateRange(startDate, endDate);
}
