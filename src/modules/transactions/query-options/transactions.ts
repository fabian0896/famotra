import { infiniteQueryOptions } from '@tanstack/react-query';
import type { TransactionFilters } from '@/modules/transactions/models/transaction-filters';
import { QueryKeys } from '@/constants/query-keys';
import { Transactions } from '@/modules/transactions/services/transactions';

export const transactionsQueryOptions = ({
  filters,
  pageSize = 25,
}: {
  filters?: TransactionFilters;
  pageSize: number;
}) =>
  infiniteQueryOptions({
    queryKey: [QueryKeys.TRANSACTIONS, { filters, pageSize }],
    queryFn: ({ pageParam }) =>
      Transactions.get({ page: pageParam.page, pageSize: pageParam.pageSize, filters }),
    initialPageParam: { page: 1, pageSize },
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      if (!lastPage.transactions.length) return undefined;
      if (lastPage.transactions.length < lastPageParam.pageSize) return undefined;
      return { ...lastPageParam, page: lastPageParam.page + 1 };
    },
    select: (data) => {
      const transactions = data.pages.flatMap((page) => page.transactions);
      return { transactions, count: data.pages[0].count };
    },
  });
