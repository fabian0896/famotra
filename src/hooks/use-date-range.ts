import { endOfMonth, format, formatISO, parseISO, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { useMemo } from 'react';

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

function isDateRange(value: unknown): value is DateRange {
  if (!value) return false;
  return typeof value === 'object' && 'start' in value && 'end' in value;
}

function resolveDate(input: string | Date | DateRange | null | undefined): Date {
  if (!input) return new Date();
  if (isDateRange(input)) return parseISO(input.start);
  if (typeof input === 'string') return parseISO(input);
  return input;
}

export function useMonthYear(date?: string | Date | DateRange | null) {
  const result = useMemo(() => {
    const resolved = resolveDate(date);
    return {
      month: format(resolved, 'MMMM', { locale: es }),
      year: format(resolved, 'yyyy', { locale: es }),
    };
  }, [date]);
  return result;
}
