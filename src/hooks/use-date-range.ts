import { endOfMonth, format, formatISO, isSameMonth, parseISO, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

export type DateRange = {
  start: string;
  end: string;
};

interface GetDateRangeOptions {
  fullMonth?: boolean;
}

export function getDateRange(options?: GetDateRangeOptions): DateRange;
export function getDateRange(date: Date, options?: GetDateRangeOptions): DateRange;
export function getDateRange(
  dateOrOptions?: Date | GetDateRangeOptions,
  options?: GetDateRangeOptions
): DateRange {
  const date = dateOrOptions instanceof Date ? dateOrOptions : new Date();
  const opts = dateOrOptions instanceof Date ? options : dateOrOptions;
  const start = startOfMonth(date);
  const isCurrentMonth = isSameMonth(date, new Date());
  const end = opts?.fullMonth ? (isCurrentMonth ? new Date() : endOfMonth(date)) : date;
  return {
    start: formatISO(start, { representation: 'date' }),
    end: formatISO(end, { representation: 'date' }),
  };
}
export const useDateRange = (date: Date = new Date()) => {
  const { start, end } = getDateRange(date);
  const month = format(date, 'MMMM', { locale: es });
  const year = format(date, 'yyyy', { locale: es });
  return { start, end, month, year };
};

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
  const resolved = resolveDate(date);
  return {
    month: format(resolved, 'MMMM', { locale: es }),
    year: format(resolved, 'yyyy', { locale: es }),
  };
}
