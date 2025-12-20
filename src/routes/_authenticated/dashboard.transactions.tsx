import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { NumericFormat } from 'react-number-format';
import { AddTransactionDialog } from '@/components/add-transaction-dialog';
import { transactionsQueryOptions } from '@/query-options/transactions';

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
      <div className="flex flex-col gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item}>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">19 Diciembre, 2025</p>
            </div>
            <ul className="space-y-4">
              {transactions.map((tx) => (
                <li key={tx.id} className="flex items-center gap-4 px-3 py-2 rounded-lg">
                  <div className="text-base flex items-center justify-center bg-primary/20 w-12 h-12 rounded-full">
                    {tx.category.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground font-medium mb-1">{tx.description}</p>
                    <p className="text-sm text-muted-foreground">{tx.category.name}</p>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <img
                      src={tx.account.bank?.logo}
                      alt={tx.account.bank?.name}
                      className="w-6 h-6 rounded"
                    />
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{tx.account.name}</p>
                      <p className="text-xs text-muted-foreground">{tx.account.bank?.name}</p>
                    </div>
                  </div>
                  <div>
                    <NumericFormat
                      className="text-base text-red-400 font-medium"
                      thousandSeparator
                      displayType="text"
                      prefix="$"
                      value={tx.amount}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
