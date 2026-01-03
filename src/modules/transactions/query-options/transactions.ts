import { infiniteQueryOptions } from '@tanstack/react-query';
import { QueryKeys } from '@/constants/query-keys';
import { Transactions } from '@/modules/transactions/services/transactions';

export const transactionsQueryOptions = infiniteQueryOptions({
  queryKey: [QueryKeys.TRANSACTIONS],
  queryFn: ({ pageParam }) => Transactions.get({ page: pageParam }),
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
