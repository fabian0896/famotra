import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { categoryResumeQueryOptions } from '../query-options/categories';
import { CategoryItem } from './category-item';
import type { CategoryTypes } from '../models/categories.models';
import type { DateRange } from '@/lib/date-utils';
import { FormattedMoneyTransaction } from '@/components/formatted-money';
import { Skeleton } from '@/components/ui/skeleton';

export function CategoryList({ type, range }: { type: CategoryTypes; range: DateRange }) {
  const { data: categories } = useSuspenseQuery(categoryResumeQueryOptions({ type, range }));
  const [parent] = useAutoAnimate();

  const title = type === 'expense' ? 'Gasto total' : 'Ingreso total';
  const total = useMemo(() => {
    return categories.reduce((t, current) => t + current.total_amount, 0);
  }, [categories]);

  return (
    <div>
      <div className="py-2.5 px-3.5 flex justify-between items-center bg-card mb-2 rounded-[12px]">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <FormattedMoneyTransaction
          className="text-lg font-bold"
          transactionType={type}
          value={total}
        />
      </div>
      <ul ref={parent} className="block space-y-2">
        {categories.map((category) => (
          <CategoryItem range={range} key={category.category_id} category={category} />
        ))}
      </ul>
    </div>
  );
}

export function CategoryListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div>
      <div className="py-2.5 px-3.5 flex justify-between items-center bg-card mb-2 rounded-[12px]">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-7 w-20" />
      </div>
      <ul className="block space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <li key={i} className="block h-full">
            <div className="p-3.5 h-[76px] bg-card w-full rounded-2xl flex gap-3.5 items-center">
              <Skeleton className="size-11 rounded-xl shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
