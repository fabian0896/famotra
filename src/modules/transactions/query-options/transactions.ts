import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
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

export const balanceSummaryOptions = ({ start, end }: { start: string; end: string }) =>
  queryOptions({
    queryKey: [QueryKeys.TRANSACTIONS, QueryKeys.BALANCE_SUMMARY, { start, end }],
    queryFn: () => Transactions.getBalanceSummary({ start, end }),
    staleTime: Infinity,
  });

export const dailyTotalsOptions = ({ filters }: { filters: TransactionFilters }) => {
  return queryOptions({
    queryKey: [QueryKeys.TRANSACTIONS, QueryKeys.DAILY_TOTAL, filters],
    queryFn: () => Transactions.getDailyTotals({ filters }),
    staleTime: Infinity,
    select: (totals) => new Map(totals.map((t) => [t.day, t.total])),
  });
};
