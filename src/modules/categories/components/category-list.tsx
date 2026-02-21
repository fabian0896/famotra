import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { cagoryResumeQueryOptions } from '../query-options/categories';
import type { CategoryResume, CategoryTypes } from '../models/categories.models';
import type { DateRange } from '@/hooks/use-date-range';
import { FormattedMoney, FormattedMoneyTransaction } from '@/components/formatted-money';
import { Skeleton } from '@/components/ui/skeleton';

export function CategoryItem({ category }: { category: CategoryResume }) {
  return (
    <li className="block h-full">
      <Link
        to="/dashboard/categories/$id"
        params={{ id: category.category_id }}
        className="p-3.5 h-[76px] bg-card w-full rounded-2xl flex gap-3.5 items-center"
      >
        <div
          style={{ '--color': category.category_color } as React.CSSProperties}
          className="size-11 rounded-xl bg-(--color)/15 grid place-items-center text-base"
        >
          {category.category_icon}
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between">
            <p className="text-sm text-foreground font-semibold">{category.category_name}</p>
            <p className="text-sm text-foreground font-bold text-right">
              <FormattedMoney allowNegative={false} value={category.total_amount} />
            </p>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              style={
                {
                  width: `${category.percentage}%`,
                  '--color': category.category_color,
                } as React.CSSProperties
              }
              className="h-full bg-(--color) rounded-full"
            ></div>
          </div>
        </div>
      </Link>
    </li>
  );
}

export function CategoryList({ type, range }: { type: CategoryTypes; range: DateRange }) {
  const { data: categories } = useSuspenseQuery(cagoryResumeQueryOptions({ type, range }));
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
          <CategoryItem key={category.category_id} category={category} />
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
