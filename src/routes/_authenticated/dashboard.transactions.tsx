import { createFileRoute } from '@tanstack/react-router';
import { transactionsQueryOptions } from '@/modules/transactions/query-options/transactions';
import { TransactionsPage } from '@/modules/transactions/pages/transactions';

export const Route = createFileRoute('/_authenticated/dashboard/transactions')({
  beforeLoad: () => ({
    breadcrumb: 'Transacciones',
  }),
  loader: async ({ context }) => {
    const queryClient = context.queryClient;
    await queryClient.ensureInfiniteQueryData(transactionsQueryOptions);
  },
  component: TransactionsPage,
});
