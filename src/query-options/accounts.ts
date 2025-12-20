import { queryOptions } from '@tanstack/react-query';
import { QueryKeys } from '@/constants/query-keys';
import { Accounts } from '@/services/accounts';

export const accountsQueryOptions = queryOptions({
  queryKey: [QueryKeys.ACCOUNTS],
  queryFn: () => Accounts.get(),
  staleTime: Infinity,
});

export const totalBalancesQueryOptions = queryOptions({
  queryKey: [QueryKeys.TOTAL_BALANCES],
  queryFn: () => Accounts.getTotalBalance(),
});
