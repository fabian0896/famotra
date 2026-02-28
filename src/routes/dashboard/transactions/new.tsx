import { createFileRoute } from '@tanstack/react-router';
import { NewTransactionPage } from '@/modules/transactions/pages/new-transaction';

export const Route = createFileRoute('/dashboard/transactions/new')({
  component: NewTransactionPage,
});
