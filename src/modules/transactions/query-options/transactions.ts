import { queryOptions } from '@tanstack/react-query';
import { QueryKeys } from '@/constants/query-keys';
import { Transactions } from '@/modules/transactions/services/transactions';

export const transactionsQueryOptions = queryOptions({
  queryKey: [QueryKeys.TRANSACTIONS],
  queryFn: () => Transactions.get(),
  select: (data) => {
    const groups = Object.groupBy(data, (d) => d.date);
    return Object.entries(groups).map(([date, transactions]) => {
      return { date, transactions };
    });
  },
});
