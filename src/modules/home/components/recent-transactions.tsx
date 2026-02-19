import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { AlertTriangleIcon, ArrowRightLeftIcon } from 'lucide-react';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { tv } from 'tailwind-variants';
import type { Transaction } from '@/modules/transactions/models/transactions.models';
import { transactionsQueryOptions } from '@/modules/transactions/query-options/transactions';
import { FormattedMoneyTransaction } from '@/components/formatted-money';
import { Skeleton } from '@/components/ui/skeleton';

function TransactionItemIcon({ transaction }: { transaction: Transaction }) {
  if (transaction.category?.icon) {
    return transaction.category.icon;
  }
  if (transaction.transaction_type === 'transfer') {
    return <ArrowRightLeftIcon className="size-4" />;
  }
  return <AlertTriangleIcon className="size-4" />;
}

const item = tv({
  slots: {
    icon: 'size-11 bg-primary/15 rounded-xl grid place-items-center text-sm',
    description: 'text-sm font-semibold text-foreground mb-0.5 line-clamp-1',
    amount: 'text-sm font-bold',
  },
  variants: {
    type: {
      income: {
        amount: 'text-green-400',
      },
      expense: {
        amount: 'text-red-400',
      },
      transfer: {
        amount: 'text-blue-400',
        icon: 'bg-blue-600/15 text-blue-400',
      },
    },
    pending: {
      true: {
        icon: 'bg-amber-600/15 text-amber-400',
        description: 'text-amber-500',
      },
    },
  },
});

function TransactionResumeItem({ transaction }: { transaction: Transaction }) {
  const localDate = `${transaction.date}T12:00:00`;
  const date = format(localDate, "d 'de' MMMM", { locale: es });

  const pending =
    transaction.transaction_type !== 'transfer' &&
    (!transaction.account_id || !transaction.category_id);

  const clx = item({ type: transaction.transaction_type, pending });

  return (
    <li className="p-3.5 flex gap-3.5 items-center">
      <div className={clx.icon()}>
        <TransactionItemIcon transaction={transaction} />
      </div>
      <div className="flex-1">
        <p className={clx.description()}>{transaction.description}</p>
        <p className="text-xs text-muted-foreground font-normal">{date}</p>
      </div>
      <div>
        <p className={`text-sm font-bold ${clx.amount()}`}>
          <FormattedMoneyTransaction
            transactionType={transaction.transaction_type}
            value={transaction.amount}
          />
        </p>
      </div>
    </li>
  );
}

export function RecentTransactionsSkeleton({ className }: React.ComponentProps<'div'>) {
  return (
    <div className={className}>
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-5 w-20" />
      </div>
      <ul className="rounded-2xl bg-card mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="p-3.5 flex gap-3.5 items-center">
            <Skeleton className="size-11 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-1.5" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-16" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RecentTransactions({ className }: React.ComponentProps<'div'>) {
  const { data } = useSuspenseInfiniteQuery(transactionsQueryOptions({ page: 1, pageSize: 10 }));
  return (
    <div className={className}>
      <div className="flex justify-between items-center">
        <h6 className="text-xl font-bold text-foreground">Transacciones recientes</h6>
        <button className="text-sm font-medium text-primary hover:underline">Ver todas</button>
      </div>
      <ul className="rounded-2xl bg-card mt-4">
        {data.map((transaction) => (
          <TransactionResumeItem key={transaction.id} transaction={transaction} />
        ))}
        <li className="p-4 flex justify-center">
          <button className="text-sm font-medium text-primary hover:underline">Ver más</button>
        </li>
      </ul>
    </div>
  );
}
