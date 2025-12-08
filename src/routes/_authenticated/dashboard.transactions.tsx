import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard/transactions')({
  beforeLoad: () => ({
    breadcrumb: 'Transacciones',
  }),
  component: Transactions,
});

function Transactions() {
  return <div>Transactions</div>;
}
