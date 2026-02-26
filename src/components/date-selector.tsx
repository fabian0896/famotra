import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { addMonths, parseISO, subMonths } from 'date-fns';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import type { DateRange } from '@/lib/date-utils';
import { getDateRange } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import { useMonthYear } from '@/hooks/use-month-year';

export function DateSelector({
  value,
  onValueChange,
  defaultValue,
  className,
  ...props
}: {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (event: DateRange) => void;
} & React.ComponentProps<'div'>) {
  const [range, setRange] = useControllableState({
    prop: value,
    defaultProp: defaultValue ?? getDateRange(),
    onChange: (val) => onValueChange?.(val),
  });

  const { month, year } = useMonthYear(range);

  const handlePrev = () => {
    const prev = subMonths(parseISO(range.start), 1);
    setRange(getDateRange(prev));
  };
  const handleNext = () => {
    const next = addMonths(parseISO(range.start), 1);
    setRange(getDateRange(next));
  };

  return (
    <div {...props} className={cn('flex justify-between items-center', className)}>
      <button
        onClick={handlePrev}
        type="button"
        className="size-9 rounded-full bg-card border border-border grid place-items-center transition-all active:scale-105"
      >
        <ChevronLeftIcon className="size-4.5 text-muted-foreground" />
      </button>
      <div className="flex flex-col items-center justify-center gap-1">
        <button
          type="button"
          className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase"
        >
          Mensual
        </button>
        <p className="text-base font-semibold text-foreground first-letter:uppercase lowercase">
          {month} {year}
        </p>
      </div>
      <button
        onClick={handleNext}
        type="button"
        className="size-9 rounded-full bg-card border border-border grid place-items-center transition-all active:scale-105"
      >
        <ChevronRightIcon className="size-4.5 text-muted-foreground" />
      </button>
    </div>
  );
}
