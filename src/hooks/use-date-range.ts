import { endOfMonth, format, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

export const useDateRange = (date: Date = new Date()) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const month = format(date, 'MMMM', { locale: es });
  const year = format(date, 'yyyy', { locale: es });
  return { start, end, month, year };
};
