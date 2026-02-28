import { NumericFormat } from 'react-number-format';
import type { CategoryTypes } from '@/modules/categories/models/categories.models';
import { cn } from '@/lib/utils';
import { useFieldContext } from '@/hooks/form';
import { FieldError } from '@/components/ui/field';

const colorByType: Record<CategoryTypes | 'neutral', string> = {
  expense: 'text-red-400',
  income: 'text-emerald-400',
  neutral: 'text-blue-400',
};

export function TransactionAmountField({ type }: { type: CategoryTypes | 'neutral' }) {
  const field = useFieldContext<number>();
  const isError = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <div className="flex flex-col gap-1.5 items-center">
      <p className="text-sm font-medium text-muted-foreground">Valor</p>
      <NumericFormat
        className={cn(
          'text-5xl font-bold w-full text-center outline-none bg-transparent',
          colorByType[type],
          isError && 'text-destructive'
        )}
        name={field.name}
        value={field.state.value === 0 ? '' : field.state.value}
        onValueChange={({ floatValue }) => field.handleChange(floatValue ?? 0)}
        onBlur={field.handleBlur}
        prefix="$"
        thousandSeparator="."
        decimalSeparator=","
        placeholder="$ 0"
        inputMode="numeric"
        autoFocus
      />
      <FieldError errors={field.state.meta.errors} />
    </div>
  );
}
