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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Transacciones</h1>
        <AddTransactionDialog />
      </div>
      <div className="flex flex-col gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item}>
            <p className="text-sm text-muted-foreground mb-4">19 Diciembre, 2025</p>
            <ul className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <li key={i} className="flex items-center gap-4 px-3 py-2 rounded-lg">
                  <div className="text-base flex items-center justify-center bg-primary/20 w-12 h-12 rounded-full">
                    🚚
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground font-medium mb-1">Didi para casa</p>
                    <p className="text-sm text-muted-foreground">Transporte</p>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <p className="text-sm text-muted-foreground">Nu bank</p>
                  </div>
                  <div>
                    <p className="text-base text-red-400 font-medium">-$15,000</p>
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
