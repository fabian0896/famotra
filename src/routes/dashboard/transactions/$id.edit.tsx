import { createFileRoute } from '@tanstack/react-router';
import { EditTransactionPage } from '@/modules/transactions/pages/edit-transaction';
import { transactionByIdOptions } from '@/modules/transactions/query-options/transactions';

export const Route = createFileRoute('/dashboard/transactions/$id/edit')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(transactionByIdOptions(params.id)),
  component: EditTransactionPage,
});
