import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { AddTransactionDialog } from '@/components/add-transaction-dialog';
import { transactionsQueryOptions } from '@/query-options/transactions';
import { Transaction, TransactionGroup, TransactionList } from '@/components/transactions';

export const Route = createFileRoute('/_authenticated/dashboard/transactions')({
  beforeLoad: () => ({
    breadcrumb: 'Transacciones',
  }),
  loader: async ({ context }) => {
    const queryClient = context.queryClient;
    await queryClient.ensureQueryData(transactionsQueryOptions);
  },
  component: Transactions,
});

function Transactions() {
  const { data: transactions } = useSuspenseQuery(transactionsQueryOptions);
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Transacciones</h1>
        <AddTransactionDialog />
      </div>
      <TransactionList>
        {transactions.map((group) => (
          <TransactionGroup key={group.date} date={group.date}>
            {group.transactions?.map((transaction) => (
              <Transaction key={transaction.id} transaction={transaction} />
            ))}
          </TransactionGroup>
        ))}
      </TransactionList>
    </div>
  );
}
