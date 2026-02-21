import { AlertTriangleIcon, ArrowRightLeftIcon } from 'lucide-react';
import type {
  TransactionCategory,
  TransactionTypes,
} from '@/modules/transactions/models/transactions.models';
import type { Category } from '../models/categories.models';
import { cn } from '@/lib/utils';

export function CategoryIcon({
  category,
  transactionType,
  className,
  ...props
}: {
  category: TransactionCategory | Category | null;
  transactionType?: TransactionTypes;
} & React.ComponentProps<'div'>) {
  if (transactionType === 'transfer') {
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
  if (category?.icon) {
    return (
      <div
        {...props}
        style={{ '--color': category.color, ...(props.style ?? {}) } as React.CSSProperties}
        className={cn('text-(--color) bg-(--color)/15 grid place-items-center', className)}
      >
        {category.icon}
      </div>
    );
  }
  return (
    <div
      {...props}
      className={cn(
        'bg-amber-600/15 border border-dashed border-amber-700 text-amber-400 [&_svg]:size-[40%] grid place-items-center',
        className
      )}
    >
      <AlertTriangleIcon />
    </div>
  );
}
