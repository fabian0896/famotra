import { ArrowDownLeftIcon, ArrowUpRightIcon } from 'lucide-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { balanceSummaryOptions } from '@/modules/transactions/query-options/transactions';
import type { DateRange } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import { getDateRange } from '@/lib/date-utils';
import { useMonthYear } from '@/hooks/use-month-year';
import { FormattedMoney } from '@/components/formatted-money';

export function ResumeCard({
  className,
  range = getDateRange(),
  ...props
}: { range?: DateRange } & React.ComponentProps<'div'>) {
  const { month, year } = useMonthYear(range);
  const { data } = useSuspenseQuery(balanceSummaryOptions(range));
  return (
    <div
      className={cn(
        'flex flex-col gap-5 p-6 rounded-3xl bg-linear-to-br from-[#6366F1] via-[#4F46E5] to-[#E85A4F]',
        className
      )}
      {...props}
    >
      <div className="flex justify-between items-center">
        <h6 className="text-white text-sm font-medium">Balance total</h6>
        <p className="font-mono text-sm text-white/70 tracking-wider first-letter:uppercase">
          {month} {year}
        </p>
      </div>
      <p className="text-white text-4xl font-bold tracking-tight leading-tight">
        <FormattedMoney value={data.balance} />
      </p>
      <div className="flex gap-6">
        <div className="flex gap-2 items-center">
          <div className="size-7 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowDownLeftIcon className="text-white size-3.5 stroke-3" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-white/70 mb-0.5">Ingresos</p>
            <p className="text-sm font-bold text-white">
              <FormattedMoney value={data.income} />
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="size-7 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowUpRightIcon className="text-white size-3.5 stroke-3" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-white/70 mb-0.5">Gastos</p>
            <p className="text-sm font-bold text-white">
              <FormattedMoney allowNegative={false} value={data.expenses} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-white/20', className)} />;
}

export function ResumeCardSkeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5 p-6 rounded-3xl bg-linear-to-br from-[#6366F1] via-[#4F46E5] to-[#E85A4F]',
        className
      )}
      {...props}
    >
      <div className="flex justify-between items-center">
        <SkeletonBlock className="h-5 w-24" />
        <SkeletonBlock className="h-5 w-20" />
      </div>
      <SkeletonBlock className="h-[45px] w-40" />
      <div className="flex gap-6">
        <div className="flex gap-2 items-center">
          <SkeletonBlock className="size-7 rounded-full" />
          <div className="flex-1 space-y-1">
            <SkeletonBlock className="h-3.5 w-12" />
            <SkeletonBlock className="h-5 w-16" />
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <SkeletonBlock className="size-7 rounded-full" />
          <div className="flex-1 space-y-1">
            <SkeletonBlock className="h-3.5 w-16" />
            <SkeletonBlock className="h-5 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
