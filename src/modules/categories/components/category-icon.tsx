import { AlertTriangleIcon, ArrowRightLeftIcon } from 'lucide-react';
import type { Transaction } from '@/modules/transactions/models/transactions.models';
import { cn } from '@/lib/utils';

export function CategoryIcon({
  transaction,
  className,
  ...props
}: { transaction: Transaction } & React.ComponentProps<'div'>) {
  if (transaction.category?.icon) {
    return (
      <div
        {...props}
        className={cn('text-primary bg-primary/15 grid place-items-center', className)}
      >
        {transaction.category.icon}
      </div>
    );
  }
  if (transaction.transaction_type === 'transfer') {
    return (
      <div
        {...props}
        className={cn(
          'bg-blue-600/15 text-blue-400 [&_svg]:size-[36%] grid place-items-center',
          className
        )}
      >
        <ArrowRightLeftIcon />
      </div>
    );
  }
  return (
    <div
      {...props}
      className={cn(
        'bg-amber-600/15 text-amber-400 [&_svg]:size-[36%] grid place-items-center',
        className
      )}
    >
      <AlertTriangleIcon />
    </div>
  );
}
