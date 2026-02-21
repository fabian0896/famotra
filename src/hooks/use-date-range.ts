import { endOfMonth, format, formatISO, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

export type DateRange = {
  start: string;
  end: string;
};

export function getDateRange(date: Date = new Date()): DateRange {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
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
