import { ScaleIcon, TrendingDownIcon, TrendingUpDownIcon, TrendingUpIcon } from 'lucide-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { categoryDetailsOptions } from '../query-options/categories';
import type { DateRange } from '@/hooks/use-date-range';
import { Skeleton } from '@/components/ui/skeleton';

export function PercentChange({ categoryId, range }: { categoryId: string; range: DateRange }) {
  const { data: details } = useSuspenseQuery(categoryDetailsOptions({ id: categoryId, range }));
  const value = details.percentage_change;

  if (!value) {
    return (
      <div className="text-muted-foreground text-sm font-semibold text-center flex items-center justify-center gap-1.5">
        <TrendingUpDownIcon className="size-3.5 stroke-3" />
        <span>Sin datos del período anterior</span>
      </div>
    );
  }

  if (value === 0) {
    return (
      <div
        style={{ '--color': details.category_color } as React.CSSProperties}
        className="text-(--color) text-sm font-semibold text-center flex items-center justify-center gap-1.5"
      >
        <ScaleIcon className="size-3.5 stroke-3" />
        <span>Igual al período anterior</span>
      </div>
    );
  }

  if (value > 0) {
    return (
      <div className="text-green-400 text-sm font-semibold text-center flex items-center justify-center gap-1.5">
        <TrendingUpIcon className="size-3.5 stroke-3" />
        <span>+{value}% vs el período anterior</span>
      </div>
    );
  }

  return (
    <div className="text-red-400 text-sm font-semibold text-center flex items-center justify-center gap-1.5">
      <TrendingDownIcon className="size-3.5 stroke-3" />
      <span>{value}% vs el período anterior</span>
    </div>
  );
}

export function PercentChangeSkeleton() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <Skeleton className="size-3.5 rounded-full shrink-0" />
      <Skeleton className="h-4 w-40" />
    </div>
  );
}
