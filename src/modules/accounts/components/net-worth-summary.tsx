import React from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { netWorthSummaryOptions } from '../query-options/accounts';
import { cn } from '@/lib/utils';
import { FormattedMoney } from '@/components/formatted-money';
import { Skeleton } from '@/components/ui/skeleton';

export function NetWorthSummarySkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <Skeleton className="h-3.5 w-16" />
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-3.5 w-24" />
    </div>
  );
}

export function NetWorthSummary({ className, ...props }: React.ComponentProps<'div'>) {
  const { data } = useSuspenseQuery(netWorthSummaryOptions());

  const pct = data.monthly_change_pct;
  const isNegative = pct < 0;
  const TrendIcon = isNegative ? TrendingDownIcon : TrendingUpIcon;
  const trendColor = isNegative ? 'text-red-400' : 'text-green-400';
  const sign = pct > 0 ? '+' : '';

  return (
    <div className={cn('flex flex-col gap-1', className)} {...props}>
      <p className="text-sm font-medium text-muted-foreground text-center">Patrimonio</p>
      <p className="text-4xl font-bold text-center text-foreground">
        <FormattedMoney value={data.current_net_worth} />
      </p>
      <p
        className={cn(
          'text-xs text-center font-medium flex justify-center gap-1 items-center',
          trendColor
        )}
      >
        <TrendIcon className="size-3.5 stroke-3" />
        {sign}
        {pct}% este mes
      </p>
    </div>
  );
}
