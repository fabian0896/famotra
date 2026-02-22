import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useMemo } from 'react';
import type { DateRange } from '@/lib/date-utils';
import { resolveDate } from '@/lib/date-utils';

export function useMonthYear(date?: string | Date | DateRange | null) {
  return useMemo(() => {
    const resolved = resolveDate(date);
    return {
      month: format(resolved, 'MMMM', { locale: es }),
      year: format(resolved, 'yyyy', { locale: es }),
    };
  }, [date]);
}
