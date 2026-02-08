import { infiniteQueryOptions } from '@tanstack/react-query';
import type { TransactionFilters } from '@/modules/transactions/models/transaction-filters';
import { QueryKeys } from '@/constants/query-keys';
import { Transactions } from '@/modules/transactions/services/transactions';

export const transactionsQueryOptions = (filters?: TransactionFilters) =>
  infiniteQueryOptions({
    queryKey: [QueryKeys.TRANSACTIONS, filters],
    queryFn: ({ pageParam }) => Transactions.get({ page: pageParam, filters }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      if (!lastPage.length) return undefined;
      return lastPageParam + 1;
    },
    select: (data) => {
      const list = data.pages.flat();
      const groups = Object.groupBy(list, (d) => d.date);
      return Object.entries(groups).map(([date, transactions]) => {
        return { date, transactions };
      });
    },
  });
