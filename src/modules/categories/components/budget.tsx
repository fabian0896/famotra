import { PlusIcon } from 'lucide-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { categoryDetailsOptions } from '../query-options/categories';
import type { DateRange } from '@/lib/date-utils';
import { getContrastColor } from '@/lib/color-utils';
import { Button } from '@/components/ui/button';
import { FormattedMoney } from '@/components/formatted-money';
import { Skeleton } from '@/components/ui/skeleton';

export function Budget({ categoryId, range }: { categoryId: string; range: DateRange }) {
  const { data: details } = useSuspenseQuery(categoryDetailsOptions({ id: categoryId, range }));

  if (details.budget_amount) {
    const percentage = Math.min(details.budget_percentage ?? 0, 100);
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center w-full">
          <p className="text-sm font-medium text-muted-foreground">
            Meta: <FormattedMoney value={details.budget_amount} />
          </p>
          <p
            style={{ '--color': details.category_color } as React.CSSProperties}
            className="text-sm font-semibold text-(--color)"
          >
            {details.budget_percentage}% gastado
          </p>
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <div
            style={
              {
                width: `${percentage}%`,
                '--color': details.category_color,
              } as React.CSSProperties
            }
            className="h-full bg-(--color) rounded-full transition-all"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-sm font-medium text-muted-foreground">
        Sin presupuesto configurado
      </p>
      <Button
        asChild
        style={
          {
            '--color': details.category_color,
            '--text-color': getContrastColor(details.category_color),
          } as React.CSSProperties
        }
        className="h-[38px] rounded-[12px] bg-(--color) text-(--text-color) shadow-none"
      >
        <Link to="/dashboard/categories/$id/edit" params={{ id: categoryId }}>
          <PlusIcon />
          Configurar presupuesto
        </Link>
      </Button>
    </div>
  );
}

export function BudgetSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-4 w-48 mx-auto" />
      <Skeleton className="h-[38px] w-full rounded-[12px]" />
    </div>
  );
}
