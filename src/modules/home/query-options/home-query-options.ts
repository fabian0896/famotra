import { queryOptions } from '@tanstack/react-query';
import { HomeService } from '../services/home.service';
import { QueryKeys } from '@/constants/query-keys';

export const resumeQueryOptions = (options: { from: Date; to: Date }) => {
  return queryOptions({
    queryKey: [QueryKeys.TRANSACTIONS, QueryKeys.BALANCE_SUMMARY, options],
    queryFn: () => HomeService.getResume(options),
    staleTime: Infinity,
  });
};
