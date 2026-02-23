import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { ArrowRightIcon } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Link } from '@tanstack/react-router';
import { TransactionResumeItem } from './transaction-resume-item';
import { transactionsQueryOptions } from '@/modules/transactions/query-options/transactions';
import { Skeleton } from '@/components/ui/skeleton';

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
  const { data } = useSuspenseInfiniteQuery(transactionsQueryOptions({ pageSize: 10 }));
  return (
    <div className={className}>
      <div className="flex justify-between items-center">
        <h6 className="text-xl font-bold text-foreground">Recientes</h6>
        <Link
          to="/dashboard/transactions"
          className="text-sm font-medium text-primary hover:underline"
        >
          Ver todas
        </Link>
      </div>
      <ul ref={parent} className="rounded-2xl bg-card mt-4 overflow-hidden">
        {data.transactions.map((transaction) => (
          <TransactionResumeItem key={transaction.id} transaction={transaction} />
        ))}
        <li className="py-3 flex justify-center">
          <Link
            to="/dashboard/transactions"
            className="text-sm font-medium text-primary hover:underline flex items-center"
          >
            Ver todas
            <ArrowRightIcon className="size-4 ms-1.5" />
          </Link>
        </li>
      </ul>
    </div>
  );
}
