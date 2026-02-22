import { queryOptions } from '@tanstack/react-query';
import { HomeService } from '../services/home.service';
import type { DateRange } from '@/lib/date-utils';
import { QueryKeys } from '@/constants/query-keys';

export const resumeQueryOptions = (options: DateRange) => {
  return queryOptions({
    queryKey: [QueryKeys.TRANSACTIONS, QueryKeys.BALANCE_SUMMARY, options],
    queryFn: () => HomeService.getResume(options),
    staleTime: Infinity,
  });
};
