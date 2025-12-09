import { createFileRoute } from '@tanstack/react-router';
import { AddTransactionDialog } from '@/components/add-transaction-dialog';

export const Route = createFileRoute('/_authenticated/dashboard/transactions')({
  beforeLoad: () => ({
    breadcrumb: 'Transacciones',
  }),
  component: Transactions,
});

function Transactions() {
  return (
    <div>
      <AddTransactionDialog />
    </div>
  );
}
