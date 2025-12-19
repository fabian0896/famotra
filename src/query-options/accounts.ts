import { queryOptions } from '@tanstack/react-query';
import { QueryKeys } from '@/constants/query-keys';
import { Accounts } from '@/services/accounts';

export const accountsQueryOptions = queryOptions({
  queryKey: [QueryKeys.ACCOUNTS],
  queryFn: () => Accounts.get(),
  staleTime: Infinity,
  refetchOnWindowFocus: true,
});
