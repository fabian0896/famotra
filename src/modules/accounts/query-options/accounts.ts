import { queryOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/constants/query-keys';
import { Accounts } from '@/modules/accounts/services/accounts';

export const accountsQueryOptions = () => {
  return queryOptions({
    queryKey: [QueryKeys.ACCOUNTS],
    queryFn: () => Accounts.get(),
    staleTime: Infinity,
  });
};

export const accountByIdOptions = (id: string, queryClient?: QueryClient) => {
  return queryOptions({
    queryKey: [QueryKeys.ACCOUNTS, id],
    queryFn: () => Accounts.getById(id),
    staleTime: Infinity,
    placeholderData: () => {
      if (!queryClient) return undefined;
      const cached = queryClient.getQueryData<Awaited<ReturnType<typeof Accounts.get>>>(
        [QueryKeys.ACCOUNTS]
      );
      return cached?.accounts.find((a) => a.id === id);
    },
  });
};

export const netWorthSummaryOptions = () => {
  return queryOptions({
    queryKey: [QueryKeys.ACCOUNTS, QueryKeys.NET_WORTH_SUMMARY],
    queryFn: () => Accounts.getNetWorthSummary(),
    staleTime: Infinity,
  });
};
