import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';
import { balanceSummaryOptions } from '../query-options/transactions';
import type { DateRange } from '@/lib/date-utils';
import { FormattedMoney } from '@/components/formatted-money';
import { Skeleton } from '@/components/ui/skeleton';

export function BalanceSummary({ range }: { range: DateRange }) {
  const { data } = useSuspenseQuery(balanceSummaryOptions(range));

  return (
    <div className="bg-card rounded-2xl py-3 px-4 flex justify-between items-center">
      <div>
        <p className="text-sm font-bold text-green-400 text-center">
          <FormattedMoney value={data.income} />
        </p>
        <p className="text-[11px] text-center font-medium text-muted-foreground">Ingresos</p>
      </div>
      <div className="h-9 w-px bg-muted" />
      <div>
        <p className="text-sm font-bold text-red-400 text-center">
          <FormattedMoney value={data.expenses} />
        </p>
        <p className="text-[11px] text-center font-medium text-muted-foreground">Gastos</p>
      </div>
      <div className="h-9 w-px bg-muted" />
      <div>
        <p className="text-sm font-bold text-blue-400 text-center">
          <FormattedMoney value={data.balance} />
        </p>
        <p className="text-[11px] text-center font-medium text-muted-foreground">Balance</p>
      </div>
    </div>
  );
}

export function BalanceSummarySkeleton() {
  return (
    <div className="bg-card rounded-2xl py-3 px-4 flex justify-between items-center">
      {(['Ingresos', 'Gastos', 'Balance'] as const).map((label, i) => (
        <React.Fragment key={label}>
          {i > 0 && <div className="h-9 w-px bg-muted" />}
          <div key={label} className="flex flex-col items-center gap-1">
            <Skeleton className="h-4 w-16" />
            <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
