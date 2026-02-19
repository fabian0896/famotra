import { infiniteQueryOptions } from '@tanstack/react-query';
import type { TransactionFilters } from '@/modules/transactions/models/transaction-filters';
import { QueryKeys } from '@/constants/query-keys';
import { Transactions } from '@/modules/transactions/services/transactions';

export const transactionsQueryOptions = ({
  filters,
  page = 1,
  pageSize = 25,
}: {
  filters?: TransactionFilters;
  page: number;
  pageSize: number;
}) =>
  infiniteQueryOptions({
    queryKey: [QueryKeys.TRANSACTIONS, { filters, page, pageSize }],
    queryFn: ({ pageParam }) => Transactions.get({ page: pageParam, filters, pageSize }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      if (!lastPage.length) return undefined;
      return lastPageParam + 1;
    },
    select: (data) => {
      return data.pages.flat();
    },
  });
