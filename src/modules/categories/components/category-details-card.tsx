import {
  PlusIcon,
  ScaleIcon,
  TrendingDownIcon,
  TrendingUpDownIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { categoryByIdOption, categoryDetailsOptions } from '../query-options/categories';
import { CategoryIcon } from './category-icon';
import type { DateRange } from '@/hooks/use-date-range';
import { Skeleton } from '@/components/ui/skeleton';
import { getContrastColor } from '@/lib/get-contrast-color';
import { Button } from '@/components/ui/button';
import { FormattedMoney } from '@/components/formatted-money';

function Budget({ budget = false, categoryId }: { categoryId: string; budget?: boolean }) {
  const { data: category } = useSuspenseQuery(categoryByIdOption({ id: categoryId }));
  if (budget) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center w-full">
          <p className="text-sm font-medium text-muted-foreground">Budget: $1,500.00</p>
          <p
            style={{ '--color': category.color } as React.CSSProperties}
            className="text-sm font-semibold text-(--color)"
          >
            83% used
          </p>
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <div
            style={{ width: '50%', '--color': category.color } as React.CSSProperties}
            className="h-full bg-(--color) rounded-full"
          ></div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-sm font-medium text-muted-foreground">
        Sin presupuesto para esta categoría
      </p>
      <Button
        style={
          {
            '--color': category.color,
            '--text-color': getContrastColor(category.color),
          } as React.CSSProperties
        }
        className="h-[38px] rounded-[12px] bg-(--color) text-(--text-color) shadow-none"
      >
        <PlusIcon />
        Establecer presupuesto
      </Button>
    </div>
  );
}

function PercentChange({
  categoryId,
  range,
  color,
}: {
  categoryId: string;
  range: DateRange;
  color: string;
}) {
  const { data: details } = useSuspenseQuery(categoryDetailsOptions({ id: categoryId, range }));
  const value = details.percentage_change;
  if (!value) {
    return (
      <div className="text-muted-foreground text-sm font-semibold text-center flex items-center justify-center gap-1.5">
        <TrendingUpDownIcon className="size-3.5 stroke-3" />
        <span>Sin datos del periodo anterior</span>
      </div>
    );
  }
  if (value === 0) {
    return (
      <div
        style={{ '--color': color } as React.CSSProperties}
        className="text-(--color) text-sm font-semibold text-center flex items-center justify-center gap-1.5"
      >
        <ScaleIcon className="size-3.5 stroke-3" />
        <span>Igual al periodo anterior</span>
      </div>
    );
  }
  if (value > 0) {
    return (
      <div className="text-green-400 text-sm font-semibold text-center flex items-center justify-center gap-1.5">
        <TrendingUpIcon className="size-3.5 stroke-3" />
        <span>+{value}% vs periodo anterior</span>
      </div>
    );
  }
  if (value < 0) {
    return (
      <div className="text-red-400 text-sm font-semibold text-center flex items-center justify-center gap-1.5">
        <TrendingDownIcon className="size-3.5 stroke-3" />
        <span>{value}% vs periodo anterior</span>
      </div>
    );
  }
}

function PercentChangeSkeleton() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <Skeleton className="size-3.5 rounded-full shrink-0" />
      <Skeleton className="h-4 w-40" />
    </div>
  );
}

function BudgetSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-4 w-48 mx-auto" />
      <Skeleton className="h-[38px] w-full rounded-[12px]" />
    </div>
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
  const { data: details } = useSuspenseQuery(categoryDetailsOptions({ id: categoryId, range }));
  return (
    <div className="bg-card p-5 rounded-3xl flex flex-col gap-4">
      <CategoryIcon
        className="size-16 mx-auto rounded-[20px] bg-(--color)/20 grid place-items-center text-2xl"
        category={category}
      />
      <h2 className="text-4xl font-bold text-foreground text-center">
        <FormattedMoney value={details.total_amount} />
      </h2>
      {category.type === 'income' ? (
        <Suspense fallback={<PercentChangeSkeleton />}>
          <PercentChange color={category.color} categoryId={categoryId} range={range} />
        </Suspense>
      ) : (
        <Suspense fallback={<BudgetSkeleton />}>
          <Budget categoryId={categoryId} />
        </Suspense>
      )}
      <p className="text-sm font-medium text-muted-foreground text-center first-letter:uppercase">
        {month} {year}
      </p>
    </div>
  );
}
