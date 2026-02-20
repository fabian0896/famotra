import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { tv } from 'tailwind-variants';
import { ArrowRightIcon } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import type { Transaction } from '@/modules/transactions/models/transactions.models';
import { transactionsQueryOptions } from '@/modules/transactions/query-options/transactions';
import { FormattedMoneyTransaction } from '@/components/formatted-money';
import { Skeleton } from '@/components/ui/skeleton';
import { TransactionDetail } from '@/modules/transactions/components/transaction-detail';
import { CategoryIcon } from '@/modules/categories/components/category-icon';
import { LocalDateFormat } from '@/components/local-date-format';

const description = tv({
  base: 'text-sm font-semibold text-foreground mb-0.5 line-clamp-1',
  variants: {
    pending: {
      true: 'text-amber-500',
    },
  },
});

function TransactionResumeItem({ transaction }: { transaction: Transaction }) {
  const pending =
    transaction.transaction_type !== 'transfer' &&
    (!transaction.account_id || !transaction.category_id);

  return (
    <TransactionDetail transaction={transaction}>
      <li className="block">
        <button className="p-3.5 flex gap-3.5 items-center w-full text-left transition-all active:bg-muted rounded-2xl overflow-hidden">
          <CategoryIcon className="size-11 rounded-xl text-sm" transaction={transaction} />
          <div className="flex-1">
            <p className={description({ pending })}>{transaction.description}</p>
            <LocalDateFormat
              formatStr="d 'de' MMMM"
              className="text-xs text-muted-foreground font-normal"
            >
              {transaction.date}
            </LocalDateFormat>
          </div>
          <div>
            <FormattedMoneyTransaction
              className="text-sm font-bold"
              transactionType={transaction.transaction_type}
              value={transaction.amount}
            />
          </div>
        </button>
      </li>
    </TransactionDetail>
  );
}

export function RecentTransactionsSkeleton({ className }: React.ComponentProps<'div'>) {
  return (
    <div className={className}>
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 w-[93px]" />
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
  const [parent] = useAutoAnimate();
  const { data } = useSuspenseInfiniteQuery(transactionsQueryOptions({ page: 1, pageSize: 10 }));
  return (
    <div className={className}>
      <div className="flex justify-between items-center">
        <h6 className="text-xl font-bold text-foreground">Recientes</h6>
        <button className="text-sm font-medium text-primary hover:underline">Ver todas</button>
      </div>
      <ul ref={parent} className="rounded-2xl bg-card mt-4">
        {data.map((transaction) => (
          <TransactionResumeItem key={transaction.id} transaction={transaction} />
        ))}
        <li className="py-3 flex justify-center">
          <button className="text-sm font-medium text-primary hover:underline flex items-center">
            Ver todas
            <ArrowRightIcon className="size-4 ms-1.5" />
          </button>
        </li>
      </ul>
    </div>
  );
}
