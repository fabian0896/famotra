import { endOfMonth, formatISO, parseISO, startOfMonth } from 'date-fns';

export type DateRange = {
  start: string;
  end: string;
};

export function getDateRange(date: Date = new Date()): DateRange {
  return {
    start: formatISO(startOfMonth(date), { representation: 'date' }),
    end: formatISO(endOfMonth(date), { representation: 'date' }),
  };
}

export function isDateRange(value: unknown): value is DateRange {
  if (!value) return false;
  return typeof value === 'object' && 'start' in value && 'end' in value;
}

export function resolveDate(input: string | Date | DateRange | null | undefined): Date {
  if (!input) return new Date();
  if (isDateRange(input)) return parseISO(input.start);
  if (typeof input === 'string') return parseISO(input);
  return input;
}
