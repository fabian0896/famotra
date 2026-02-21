import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { addMonths, subMonths } from 'date-fns';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import type { DateRange } from '@/hooks/use-date-range';
import { cn } from '@/lib/utils';
import { getDateRange, useDateRange } from '@/hooks/use-date-range';

export function DateSelector({
  value,
  onValueChange,
  defaultValue,
  className,
  ...props
}: {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (event: { value: Date; range: DateRange }) => void;
} & React.ComponentProps<'div'>) {
  const [date, setDate] = useControllableState({
    prop: value,
    defaultProp: defaultValue ?? new Date(),
    onChange: (val) => onValueChange?.({ value: val, range: getDateRange(val) }),
  });

  const { month, year } = useDateRange(date);

  const handlePrev = () => setDate(subMonths(date, 1));
  const handleNext = () => setDate(addMonths(date, 1));

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
          <ChevronDownIcon className="size-3.5 stroke-3" />
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
