import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { AddTransactionDialog } from '@/components/add-transaction-dialog';
import { transactionsQueryOptions } from '@/query-options/transactions';
import { Transaction, TransactionGroup, TransactionList } from '@/components/transactions-list';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div className="flex gap-6 container mx-auto">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Transacciones</h1>
          {transactions.length ? <AddTransactionDialog /> : null}
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
      <div className="w-[300px]">
        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle>Cateorias</CardTitle>
            <CardDescription>Aqui van resumen de las categorias</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
