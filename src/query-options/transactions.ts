import { queryOptions } from '@tanstack/react-query';
import { QueryKeys } from '@/constants/query-keys';
import { Transactions } from '@/services/transactions';

export const transactionsQueryOptions = queryOptions({
  queryKey: [QueryKeys.TRANSACTIONS],
  queryFn: () => Transactions.get(),
});
