import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { categoryByIdOption, categoryDetailsOptions } from '../query-options/categories';
import { CategoryIcon } from './category-icon';
import { Budget, BudgetSkeleton } from './budget';
import { PercentChange, PercentChangeSkeleton } from './percent-change';
import type { DateRange } from '@/lib/date-utils';
import { Skeleton } from '@/components/ui/skeleton';
import { FormattedMoney } from '@/components/formatted-money';

function TotalAmountSkeleton() {
  return <Skeleton className="h-[47px] w-[190px] mx-auto rounded" />;
}

export function CategoryTotalAmount({
  categoryId,
  range,
}: {
  categoryId: string;
  range: DateRange;
}) {
  const { data: details } = useSuspenseQuery(categoryDetailsOptions({ id: categoryId, range }));
  return (
    <h2 className="text-4xl font-bold text-foreground text-center">
      <FormattedMoney value={details.total_amount} />
    </h2>
  );
}

export function CategoryDetailsCard({
  month,
  year,
  categoryId,
  range,
}: {
  categoryId: string;
  range: DateRange;
  month: string;
  year: string;
}) {
  const { data: category } = useSuspenseQuery(categoryByIdOption({ id: categoryId }));
  return (
    <div className="bg-card p-5 rounded-3xl flex flex-col gap-4">
      <CategoryIcon
        className="size-16 mx-auto rounded-[20px] bg-(--color)/20 grid place-items-center text-2xl"
        category={category}
      />
      <Suspense fallback={<TotalAmountSkeleton />}>
        <CategoryTotalAmount categoryId={categoryId} range={range} />
      </Suspense>
      {category.type === 'income' ? (
        <Suspense fallback={<PercentChangeSkeleton />}>
          <PercentChange categoryId={categoryId} range={range} />
        </Suspense>
      ) : (
        <Suspense fallback={<BudgetSkeleton />}>
          <Budget range={range} categoryId={categoryId} />
        </Suspense>
      )}
      <p className="text-sm font-medium text-muted-foreground text-center first-letter:uppercase">
        {month} {year}
      </p>
    </div>
  );
}
