import { queryOptions } from '@tanstack/react-query';
import { QueryKeys } from '@/constants/query-keys';
import { Banks } from '@/services/banks';

export const banksQueryOptions = queryOptions({
  queryKey: [QueryKeys.BANKS],
  queryFn: () => Banks.getBankList(),
  staleTime: Infinity,
});
